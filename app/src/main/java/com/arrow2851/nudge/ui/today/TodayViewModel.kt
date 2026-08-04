package com.arrow2851.nudge.ui.today

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.RecentCompletionReader
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.domain.DefaultRecommendationEngine
import com.arrow2851.nudge.core.domain.RecommendationCandidate
import com.arrow2851.nudge.core.domain.RecommendationContext
import com.arrow2851.nudge.core.domain.RecommendationKind
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

private val todayRecommendationEngine = DefaultRecommendationEngine()

enum class TodayItemKind {
    Task,
    Chore,
}

data class TodayDueItem(
    val id: String,
    val title: String,
    val kind: TodayItemKind,
    val dueAt: Long,
    val dueLabel: String,
    val supportingText: String,
    val estimatedMinutes: Int?,
    val includeInNudges: Boolean,
    val supportsGrading: Boolean = false,
    val defaultGrade: CompletionGrade = CompletionGrade.None,
    val areaId: String? = null,
    val sectionId: String? = null,
)

data class TodayListSummary(
    val id: String,
    val name: String,
    val isReusable: Boolean,
    val activeCount: Int,
    val checkedCount: Int,
    val preview: String,
)

enum class TodayActivityKind {
    Task,
    Chore,
    ListItem,
}

data class TodayActivity(
    val id: String,
    val title: String,
    val detail: String,
    val timeLabel: String,
    val occurredAt: Long,
    val kind: TodayActivityKind,
)

data class TodayProgress(
    val completedToday: Int,
    val remaining: Int,
) {
    val total: Int
        get() = completedToday + remaining

    val fraction: Float
        get() = if (total == 0) 1f else completedToday.toFloat() / total
}

sealed interface TodayUiState {
    data object Loading : TodayUiState

    data class Ready(
        val dateLabel: String,
        val now: Long,
        val dueToday: List<TodayDueItem>,
        val overdue: List<TodayDueItem>,
        val lists: List<TodayListSummary>,
        val recentActivity: List<TodayActivity>,
        val progress: TodayProgress?,
        val quickWin: TodayDueItem?,
        val recoverableError: String? = null,
    ) : TodayUiState {
        fun dueItem(itemId: String): TodayDueItem? =
            (dueToday + overdue).firstOrNull { it.id == itemId }
    }

    data class Error(val message: String) : TodayUiState
}

sealed interface TodayCompletionUndo {
    data class TaskCompletion(
        val taskId: String,
        val previousCompletedAt: Long?,
    ) : TodayCompletionUndo

    data class ChoreCompletion(
        val mutation: ChoreCompletionMutation,
    ) : TodayCompletionUndo
}

sealed interface TodayEvent {
    data class Message(val text: String) : TodayEvent

    data class ItemCompleted(
        val text: String,
        val undo: TodayCompletionUndo,
    ) : TodayEvent
}

private data class TodayCoreSnapshot(
    val tasks: List<TaskNode>,
    val chores: List<ChoreWithSchedule>,
    val areas: List<Area>,
    val sections: List<Section>,
)

private data class TodayContextSnapshot(
    val lists: List<ReusableListWithItems>,
    val completions: List<Completion>,
    val preferences: AppPreferences,
    val now: Long,
)

@HiltViewModel
class TodayViewModel @Inject constructor(
    private val taskRepository: TaskRepository,
    private val choreRepository: ChoreRepository,
    private val areaRepository: AreaRepository,
    private val listRepository: ListWorkflowRepository,
    private val preferencesRepository: PreferencesRepository,
    recentCompletionReader: RecentCompletionReader,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val currentTime = MutableStateFlow(timeProvider.nowEpochMillis())
    private val recoverableError = MutableStateFlow<String?>(null)
    private val eventChannel = Channel<TodayEvent>(Channel.BUFFERED)

    val events: Flow<TodayEvent> = eventChannel.receiveAsFlow()

    private val coreSnapshot = combine(
        taskRepository.observeTaskNodes(),
        choreRepository.observeChoresWithSchedules(),
        areaRepository.observeAreas(),
        areaRepository.observeSections(),
    ) { tasks, chores, areas, sections ->
        TodayCoreSnapshot(tasks, chores, areas, sections)
    }

    private val contextSnapshot = combine(
        listRepository.observeLists(),
        recentCompletionReader.observeRecent(),
        preferencesRepository.preferences,
        currentTime,
    ) { lists, completions, preferences, now ->
        TodayContextSnapshot(lists, completions, preferences, now)
    }

    val uiState: StateFlow<TodayUiState> = combine(
        coreSnapshot,
        contextSnapshot,
        recoverableError,
    ) { core, context, error ->
        buildReadyState(core, context, error) as TodayUiState
    }
        .onStart { emit(TodayUiState.Loading) }
        .catch { throwable ->
            emit(TodayUiState.Error(throwable.message ?: "Today could not be loaded."))
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000L),
            initialValue = TodayUiState.Loading,
        )

    fun refresh() {
        currentTime.value = timeProvider.nowEpochMillis()
    }

    fun completeItem(itemId: String, grade: CompletionGrade = CompletionGrade.None) {
        mutate {
            val item = ready()?.dueItem(itemId) ?: return@mutate
            when (item.kind) {
                TodayItemKind.Task -> {
                    taskRepository.setCompleted(item.id, timeProvider.nowEpochMillis())
                    eventChannel.send(
                        TodayEvent.ItemCompleted(
                            text = "Task completed",
                            undo = TodayCompletionUndo.TaskCompletion(item.id, null),
                        ),
                    )
                }

                TodayItemKind.Chore -> {
                    val mutation = choreRepository.completeChore(item.id, grade)
                    eventChannel.send(
                        TodayEvent.ItemCompleted(
                            text = if (mutation.nextDueAt == null) {
                                "Completed; available again as needed"
                            } else {
                                "Completed; next occurrence scheduled"
                            },
                            undo = TodayCompletionUndo.ChoreCompletion(mutation),
                        ),
                    )
                }
            }
        }
    }

    fun undoCompletion(undo: TodayCompletionUndo) {
        mutate {
            when (undo) {
                is TodayCompletionUndo.TaskCompletion ->
                    taskRepository.setCompleted(undo.taskId, undo.previousCompletedAt)

                is TodayCompletionUndo.ChoreCompletion ->
                    choreRepository.undoCompletion(undo.mutation)
            }
            eventChannel.send(TodayEvent.Message("Completion undone"))
        }
    }

    fun dismissRecoverableError() {
        recoverableError.value = null
    }

    private fun ready(): TodayUiState.Ready? = uiState.value as? TodayUiState.Ready

    private fun mutate(block: suspend () -> Unit) {
        viewModelScope.launch {
            runCatching { block() }
                .onSuccess { currentTime.value = timeProvider.nowEpochMillis() }
                .onFailure { throwable ->
                    recoverableError.value = throwable.message ?: "That change could not be saved."
                }
        }
    }
}

private fun buildReadyState(
    core: TodayCoreSnapshot,
    context: TodayContextSnapshot,
    recoverableError: String?,
): TodayUiState.Ready {
    val zone = ZoneId.systemDefault()
    val nowInstant = Instant.ofEpochMilli(context.now)
    val today = nowInstant.atZone(zone).toLocalDate()
    val startOfToday = today.atStartOfDay(zone).toInstant().toEpochMilli()
    val startOfTomorrow = today.plusDays(1).atStartOfDay(zone).toInstant().toEpochMilli()
    val areasById = core.areas.associateBy(Area::id)
    val sectionsById = core.sections.associateBy(Section::id)
    val allTasks = core.tasks.flatMap { node -> listOf(node.task) + node.subtasks }

    fun location(areaId: String?, sectionId: String?): String? {
        val values = listOfNotNull(
            areaId?.let(areasById::get)?.name,
            sectionId?.let(sectionsById::get)?.name,
        )
        return values.joinToString(" › ").ifEmpty { null }
    }

    val openItems = buildList {
        allTasks
            .filter { it.completedAt == null && it.dueAt != null }
            .forEach { task ->
                val dueAt = requireNotNull(task.dueAt)
                add(
                    TodayDueItem(
                        id = task.id,
                        title = task.title,
                        kind = TodayItemKind.Task,
                        dueAt = dueAt,
                        dueLabel = dueLabel(dueAt, today, zone),
                        supportingText = location(task.areaId, task.sectionId) ?: "Task",
                        estimatedMinutes = task.estimatedMinutes,
                        includeInNudges = task.includeInNudges,
                        areaId = task.areaId,
                        sectionId = task.sectionId,
                    ),
                )
            }

        core.chores
            .filter { row ->
                !row.chore.isPaused &&
                    row.chore.nextDueAt != null &&
                    row.schedule?.recurrenceType != RecurrenceType.WhenNeeded
            }
            .forEach { row ->
                val chore = row.chore
                val dueAt = requireNotNull(chore.nextDueAt)
                add(
                    TodayDueItem(
                        id = chore.id,
                        title = chore.title,
                        kind = TodayItemKind.Chore,
                        dueAt = dueAt,
                        dueLabel = dueLabel(dueAt, today, zone),
                        supportingText = location(chore.areaId, chore.sectionId) ?: "Recurring chore",
                        estimatedMinutes = chore.estimatedMinutes,
                        includeInNudges = chore.includeInNudges,
                        supportsGrading = chore.supportsGrading,
                        defaultGrade = chore.defaultGrade,
                        areaId = chore.areaId,
                        sectionId = chore.sectionId,
                    ),
                )
            }
    }

    val overdue = openItems
        .filter { it.dueAt < startOfToday }
        .sortedWith(compareBy<TodayDueItem> { it.dueAt }.thenBy { it.title })
    val dueToday = openItems
        .filter { it.dueAt in startOfToday until startOfTomorrow }
        .sortedWith(compareBy<TodayDueItem> { it.dueAt }.thenBy { it.title })

    val choreById = core.chores.associateBy { it.chore.id }
    val activity = buildList {
        allTasks.filter { it.completedAt != null }.forEach { task ->
            val completedAt = requireNotNull(task.completedAt)
            add(
                TodayActivity(
                    id = "task-${task.id}-$completedAt",
                    title = task.title,
                    detail = listOfNotNull(location(task.areaId, task.sectionId), "Task completed")
                        .joinToString(" · "),
                    timeLabel = activityTimeLabel(completedAt, context.now, zone),
                    occurredAt = completedAt,
                    kind = TodayActivityKind.Task,
                ),
            )
        }

        context.completions.forEach { completion ->
            val row = completion.choreId?.let(choreById::get) ?: return@forEach
            val grade = completion.grade
                .takeIf { it != CompletionGrade.None }
                ?.name
                ?.lowercase()
                ?.replaceFirstChar(Char::uppercase)
            add(
                TodayActivity(
                    id = "chore-${completion.id}",
                    title = row.chore.title,
                    detail = listOfNotNull(
                        location(row.chore.areaId, row.chore.sectionId),
                        grade?.let { "$it completion" } ?: "Chore completed",
                    ).joinToString(" · "),
                    timeLabel = activityTimeLabel(completion.completedAt, context.now, zone),
                    occurredAt = completion.completedAt,
                    kind = TodayActivityKind.Chore,
                ),
            )
        }

        context.lists.forEach { listWithItems ->
            listWithItems.items.filter { it.checkedAt != null }.forEach { item ->
                val checkedAt = requireNotNull(item.checkedAt)
                add(
                    TodayActivity(
                        id = "list-${item.id}-$checkedAt",
                        title = item.name,
                        detail = "${listWithItems.list.name} · list item",
                        timeLabel = activityTimeLabel(checkedAt, context.now, zone),
                        occurredAt = checkedAt,
                        kind = TodayActivityKind.ListItem,
                    ),
                )
            }
        }
    }.sortedByDescending(TodayActivity::occurredAt)

    val completedToday = activity.count { it.occurredAt in startOfToday until startOfTomorrow }
    val remaining = overdue.size + dueToday.size
    val quickWinItems = overdue + dueToday
    val quickWinById = quickWinItems.associateBy(TodayDueItem::id)
    val quickWin = todayRecommendationEngine.select(
        context = RecommendationContext(now = context.now),
        candidates = quickWinItems.map(TodayDueItem::toRecommendationCandidate),
    )?.candidate?.id?.let(quickWinById::get)

    return TodayUiState.Ready(
        dateLabel = today.format(DateTimeFormatter.ofPattern("EEEE, MMMM d")),
        now = context.now,
        dueToday = dueToday,
        overdue = overdue,
        lists = context.lists.map { listWithItems ->
            val active = listWithItems.items.filterNot { it.isChecked }
            val preview = active
                .filter { it.parentItemId == null }
                .take(2)
                .joinToString(" · ") { it.name }
                .ifEmpty { if (listWithItems.list.isReusable) "Ready to reset" else "All checked" }
            TodayListSummary(
                id = listWithItems.list.id,
                name = listWithItems.list.name,
                isReusable = listWithItems.list.isReusable,
                activeCount = active.size,
                checkedCount = listWithItems.items.count { it.isChecked },
                preview = preview,
            )
        },
        recentActivity = activity.take(6),
        progress = if (context.preferences.dailyProgressEnabled) {
            TodayProgress(completedToday = completedToday, remaining = remaining)
        } else {
            null
        },
        quickWin = quickWin.takeIf { context.preferences.quickWinEnabled },
        recoverableError = recoverableError,
    )
}

private fun TodayDueItem.toRecommendationCandidate(): RecommendationCandidate =
    RecommendationCandidate(
        id = id,
        title = title,
        kind = when (kind) {
            TodayItemKind.Task -> RecommendationKind.Task
            TodayItemKind.Chore -> RecommendationKind.Chore
        },
        dueAt = dueAt,
        estimatedMinutes = estimatedMinutes,
        includeInNudges = includeInNudges,
        areaId = areaId,
        sectionId = sectionId,
    )

private fun dueLabel(
    dueAt: Long,
    today: java.time.LocalDate,
    zone: ZoneId,
): String {
    val dueDate = Instant.ofEpochMilli(dueAt).atZone(zone).toLocalDate()
    return when {
        dueDate.isBefore(today) -> {
            val days = ChronoUnit.DAYS.between(dueDate, today).coerceAtLeast(1)
            if (days == 1L) "1 day overdue" else "$days days overdue"
        }

        dueDate == today -> "Today"
        else -> dueDate.format(DateTimeFormatter.ofPattern("MMM d"))
    }
}

private fun activityTimeLabel(
    occurredAt: Long,
    now: Long,
    zone: ZoneId,
): String {
    val elapsedMinutes = ((now - occurredAt).coerceAtLeast(0L) / 60_000L)
    return when {
        elapsedMinutes < 1 -> "Now"
        elapsedMinutes < 60 -> "${elapsedMinutes}m"
        elapsedMinutes < 24 * 60 -> "${elapsedMinutes / 60}h"
        else -> Instant.ofEpochMilli(occurredAt)
            .atZone(zone)
            .toLocalDate()
            .format(DateTimeFormatter.ofPattern("MMM d"))
    }
}
