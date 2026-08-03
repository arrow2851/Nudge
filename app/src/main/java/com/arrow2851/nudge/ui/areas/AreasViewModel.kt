package com.arrow2851.nudge.ui.areas

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreGroup
import com.arrow2851.nudge.core.model.ChoreRecurrence
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.Instant
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AreaCareItem(
    val area: Area,
    val sections: List<Section>,
    val chores: List<ChoreWithSchedule>,
    val now: Long,
) {
    val needsAttention: List<ChoreWithSchedule>
        get() = chores.filter { ChoreRecurrence.group(it, now) == ChoreGroup.NeedsAttention }

    val comingUp: List<ChoreWithSchedule>
        get() = chores.filter { ChoreRecurrence.group(it, now) == ChoreGroup.ComingUp }

    val asNeeded: List<ChoreWithSchedule>
        get() = chores.filter { ChoreRecurrence.group(it, now) == ChoreGroup.AsNeeded }

    val paused: List<ChoreWithSchedule>
        get() = chores.filter { ChoreRecurrence.group(it, now) == ChoreGroup.Paused }

    val nextRelevant: ChoreWithSchedule?
        get() = (needsAttention + comingUp).minByOrNull { it.chore.nextDueAt ?: Long.MAX_VALUE }

    fun sectionChores(sectionId: String?): List<ChoreWithSchedule> =
        chores.filter { it.chore.sectionId == sectionId }
}

data class SectionCareItem(
    val section: Section,
    val area: Area,
    val chores: List<ChoreWithSchedule>,
    val now: Long,
) {
    fun grouped(group: ChoreGroup): List<ChoreWithSchedule> =
        chores.filter { ChoreRecurrence.group(it, now) == group }
}

sealed interface AreasUiState {
    data object Loading : AreasUiState

    data class Ready(
        val areas: List<AreaCareItem>,
        val now: Long,
        val recoverableError: String? = null,
    ) : AreasUiState {
        val attentionCount: Int
            get() = areas.sumOf { it.needsAttention.size }

        val totalChores: Int
            get() = areas.sumOf { it.chores.size }

        fun area(areaId: String): AreaCareItem? = areas.firstOrNull { it.area.id == areaId }

        fun section(sectionId: String): SectionCareItem? = areas.firstNotNullOfOrNull { area ->
            area.sections.firstOrNull { it.id == sectionId }?.let { section ->
                SectionCareItem(
                    section = section,
                    area = area.area,
                    chores = area.sectionChores(section.id),
                    now = now,
                )
            }
        }

        fun chore(choreId: String): ChoreWithSchedule? = areas.firstNotNullOfOrNull { area ->
            area.chores.firstOrNull { it.chore.id == choreId }
        }
    }

    data class Error(val message: String) : AreasUiState
}

data class ChoreDraft(
    val id: String? = null,
    val title: String = "",
    val description: String = "",
    val areaId: String,
    val sectionId: String? = null,
    val estimatedMinutes: Int? = null,
    val recurrenceType: RecurrenceType = RecurrenceType.Weekly,
    val intervalValue: Int = 1,
    val intervalUnit: RecurrenceUnit = RecurrenceUnit.Weeks,
    val scheduleBasis: ScheduleBasis = ScheduleBasis.Calendar,
    val firstDueAt: Long? = null,
    val supportsGrading: Boolean = false,
    val defaultGrade: CompletionGrade = CompletionGrade.Moderate,
    val isPaused: Boolean = false,
)

sealed interface AreasEvent {
    data class Message(val text: String) : AreasEvent
    data class ChoreCompleted(
        val text: String,
        val mutation: ChoreCompletionMutation,
    ) : AreasEvent
}

@HiltViewModel
class AreasViewModel @Inject constructor(
    private val areaRepository: AreaRepository,
    private val choreRepository: ChoreRepository,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val currentTime = MutableStateFlow(timeProvider.nowEpochMillis())
    private val recoverableError = MutableStateFlow<String?>(null)
    private val eventChannel = Channel<AreasEvent>(Channel.BUFFERED)

    val events = eventChannel.receiveAsFlow()

    val uiState: StateFlow<AreasUiState> = combine(
        areaRepository.observeAreas(),
        areaRepository.observeSections(),
        choreRepository.observeChoresWithSchedules(),
        currentTime,
        recoverableError,
    ) { areas, sections, chores, now, error ->
        AreasUiState.Ready(
            areas = areas.map { area ->
                AreaCareItem(
                    area = area,
                    sections = sections.filter { it.areaId == area.id },
                    chores = chores.filter { it.chore.areaId == area.id },
                    now = now,
                )
            },
            now = now,
            recoverableError = error,
        ) as AreasUiState
    }
        .onStart { emit(AreasUiState.Loading) }
        .catch { throwable ->
            emit(AreasUiState.Error(throwable.message ?: "Recurring care could not be loaded."))
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000L),
            initialValue = AreasUiState.Loading,
        )

    fun createArea(name: String, template: AreaTemplateKind?) {
        mutate {
            val area = areaRepository.createArea(
                name = name,
                icon = when (template) {
                    AreaTemplateKind.House -> "home"
                    AreaTemplateKind.Car -> "car"
                    null -> null
                },
            )
            val result = template?.let { areaRepository.applyTemplate(area.id, it) }
            eventChannel.send(
                AreasEvent.Message(
                    result?.let { "Added ${area.name}: ${it.sectionsAdded} sections and ${it.choresAdded} chores" }
                        ?: "Added ${area.name}",
                ),
            )
        }
    }

    fun renameArea(areaId: String, name: String) {
        mutate {
            val area = ready()?.area(areaId)?.area ?: return@mutate
            areaRepository.saveArea(
                area.copy(name = name.trim(), updatedAt = timeProvider.nowEpochMillis()),
            )
            eventChannel.send(AreasEvent.Message("Area updated"))
        }
    }

    fun moveArea(areaId: String, direction: Int) {
        mutate { areaRepository.moveArea(areaId, direction) }
    }

    fun archiveArea(areaId: String) {
        mutate {
            areaRepository.archiveArea(areaId, timeProvider.nowEpochMillis())
            eventChannel.send(AreasEvent.Message("Area archived"))
        }
    }

    fun createSection(areaId: String, name: String) {
        mutate {
            areaRepository.createSection(areaId, name.trim())
            eventChannel.send(AreasEvent.Message("Section added"))
        }
    }

    fun renameSection(sectionId: String, name: String) {
        mutate {
            val section = ready()?.section(sectionId)?.section ?: return@mutate
            areaRepository.saveSection(
                section.copy(name = name.trim(), updatedAt = timeProvider.nowEpochMillis()),
            )
            eventChannel.send(AreasEvent.Message("Section updated"))
        }
    }

    fun moveSection(sectionId: String, direction: Int) {
        mutate { areaRepository.moveSection(sectionId, direction) }
    }

    fun archiveSection(sectionId: String) {
        mutate {
            areaRepository.archiveSection(sectionId, timeProvider.nowEpochMillis())
            eventChannel.send(AreasEvent.Message("Section archived; its chores moved to General"))
        }
    }

    fun applyTemplate(areaId: String, kind: AreaTemplateKind) {
        mutate {
            val result = areaRepository.applyTemplate(areaId, kind)
            eventChannel.send(
                AreasEvent.Message(
                    "Template added ${result.sectionsAdded} sections and ${result.choresAdded} chores",
                ),
            )
        }
    }

    fun saveChore(draft: ChoreDraft) {
        mutate {
            val state = ready() ?: return@mutate
            val existing = draft.id?.let(state::chore)
            val now = timeProvider.nowEpochMillis()
            val choreId = existing?.chore?.id ?: idGenerator.newId()
            val sameGroup = state.area(draft.areaId)?.chores.orEmpty().filter {
                it.chore.sectionId == draft.sectionId
            }
            val sortOrder = existing?.chore?.sortOrder ?: SortOrders.after(
                sameGroup.maxOfOrNull { it.chore.sortOrder } ?: -SortOrders.Gap,
            )
            val recurrence = normalizeRecurrence(draft, now)
            val chore = Chore(
                id = choreId,
                title = draft.title.trim(),
                description = draft.description.trim().ifEmpty { null },
                areaId = draft.areaId,
                sectionId = draft.sectionId,
                estimatedMinutes = draft.estimatedMinutes,
                supportsGrading = draft.supportsGrading,
                defaultGrade = if (draft.supportsGrading) draft.defaultGrade else CompletionGrade.None,
                nextDueAt = if (draft.recurrenceType == RecurrenceType.WhenNeeded) {
                    null
                } else {
                    draft.firstDueAt ?: existing?.chore?.nextDueAt ?: now
                },
                isPaused = draft.isPaused,
                sortOrder = sortOrder,
                createdAt = existing?.chore?.createdAt ?: now,
                updatedAt = now,
            )
            choreRepository.saveChore(ChoreWithSchedule(chore, recurrence))
            eventChannel.send(AreasEvent.Message(if (existing == null) "Chore added" else "Chore updated"))
        }
    }

    fun completeChore(choreId: String, grade: CompletionGrade = CompletionGrade.None) {
        mutate {
            val mutation = choreRepository.completeChore(choreId, grade)
            eventChannel.send(
                AreasEvent.ChoreCompleted(
                    text = if (mutation.nextDueAt == null) {
                        "Completed; available again as needed"
                    } else {
                        "Completed; next occurrence scheduled"
                    },
                    mutation = mutation,
                ),
            )
        }
    }

    fun undoCompletion(mutation: ChoreCompletionMutation) {
        mutate {
            choreRepository.undoCompletion(mutation)
            eventChannel.send(AreasEvent.Message("Completion undone"))
        }
    }

    fun setPaused(choreId: String, paused: Boolean) {
        mutate {
            choreRepository.setPaused(choreId, paused)
            eventChannel.send(AreasEvent.Message(if (paused) "Chore paused" else "Chore resumed"))
        }
    }

    fun skipOccurrence(choreId: String) {
        mutate {
            choreRepository.skipOccurrence(choreId)
            eventChannel.send(AreasEvent.Message("Occurrence skipped"))
        }
    }

    fun moveChore(choreId: String, direction: Int) {
        mutate { choreRepository.moveChore(choreId, direction) }
    }

    fun archiveChore(choreId: String) {
        mutate {
            choreRepository.archiveChore(choreId, timeProvider.nowEpochMillis())
            eventChannel.send(AreasEvent.Message("Chore archived"))
        }
    }

    fun dismissRecoverableError() {
        recoverableError.value = null
    }

    private fun normalizeRecurrence(draft: ChoreDraft, now: Long): ChoreSchedule {
        val zone = ZoneId.systemDefault()
        val date = Instant.ofEpochMilli(draft.firstDueAt ?: now).atZone(zone)
        return when (draft.recurrenceType) {
            RecurrenceType.WhenNeeded,
            RecurrenceType.None,
            -> ChoreSchedule(
                choreId = draft.id ?: "pending",
                recurrenceType = RecurrenceType.WhenNeeded,
                scheduleBasis = draft.scheduleBasis,
            )
            RecurrenceType.Interval -> ChoreSchedule(
                choreId = draft.id ?: "pending",
                recurrenceType = RecurrenceType.Interval,
                intervalValue = draft.intervalValue.coerceAtLeast(1),
                intervalUnit = draft.intervalUnit,
                scheduleBasis = draft.scheduleBasis,
            )
            RecurrenceType.Weekly -> ChoreSchedule(
                choreId = draft.id ?: "pending",
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(date.dayOfWeek.value),
                scheduleBasis = draft.scheduleBasis,
            )
            RecurrenceType.Monthly -> ChoreSchedule(
                choreId = draft.id ?: "pending",
                recurrenceType = RecurrenceType.Monthly,
                dayOfMonth = date.dayOfMonth,
                scheduleBasis = draft.scheduleBasis,
            )
            RecurrenceType.Custom -> ChoreSchedule(
                choreId = draft.id ?: "pending",
                recurrenceType = RecurrenceType.Custom,
                intervalValue = draft.intervalValue.coerceAtLeast(1),
                intervalUnit = draft.intervalUnit,
                scheduleBasis = draft.scheduleBasis,
            )
        }.copy(choreId = draft.id ?: "pending")
    }

    private fun ready(): AreasUiState.Ready? = uiState.value as? AreasUiState.Ready

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
