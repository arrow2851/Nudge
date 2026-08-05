package com.arrow2851.nudge.ui.today

import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.ListItemArchiveMutation
import com.arrow2851.nudge.core.data.ListItemCheckMutation
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.RecentCompletionReader
import com.arrow2851.nudge.core.data.TaskArchiveMutation
import com.arrow2851.nudge.core.data.TaskCompletionMutation
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.data.TaskWorkflowRepository
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TemplateApplyResult
import com.arrow2851.nudge.core.model.ThemeMode
import com.arrow2851.nudge.core.model.TimeProvider
import java.time.LocalDate
import java.time.ZoneId
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class TodayViewModelTest {
    private val dispatcher = StandardTestDispatcher()
    private val zone = ZoneId.systemDefault()
    private val date = LocalDate.of(2026, 8, 3)
    private val now = date.atTime(12, 0).atZone(zone).toInstant().toEpochMilli()
    private val startToday = date.atStartOfDay(zone).toInstant().toEpochMilli()

    @Before
    fun setUp() = Dispatchers.setMain(dispatcher)

    @After
    fun tearDown() = Dispatchers.resetMain()

    @Test
    fun aggregatesTasksChoresListsActivityProgressAndQuickWin() = runTest(dispatcher) {
        val area = Area("area", "House", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val section = Section("section", area.id, "Kitchen", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val taskRepository = FakeTodayTaskRepository(
            listOf(
                node(Task("overdue", "File expenses", dueAt = startToday - 1, estimatedMinutes = 20, sortOrder = 0, createdAt = 1, updatedAt = 1)),
                node(Task("today", "Call dentist", dueAt = startToday + 3_600_000L, estimatedMinutes = 8, sortOrder = 1, createdAt = 1, updatedAt = 1)),
                node(Task("completed", "Send report", completedAt = now - 3_600_000L, sortOrder = 2, createdAt = 1, updatedAt = 1)),
            ),
        )
        val dueChore = chore(
            id = "due-chore",
            title = "Wipe counters",
            areaId = area.id,
            sectionId = section.id,
            nextDueAt = startToday + 7_200_000L,
            estimatedMinutes = 5,
            supportsGrading = true,
        )
        val checkedAt = now - 1_800_000L
        val viewModel = viewModel(
            tasks = taskRepository,
            chores = FakeTodayChoreRepository(listOf(dueChore), now),
            areas = FakeTodayAreaRepository(listOf(area), listOf(section)),
            lists = FakeTodayListRepository(
                listOf(
                    ReusableListWithItems(
                        ReusableList("list", "Groceries", isReusable = true, sortOrder = 0, createdAt = 1, updatedAt = 1),
                        listOf(
                            ListItem("active", "list", name = "Milk", sortOrder = 0, addedAt = 1, updatedAt = 1),
                            ListItem("checked", "list", name = "Bread", isChecked = true, checkedAt = checkedAt, sortOrder = 1, addedAt = 1, updatedAt = checkedAt),
                        ),
                    ),
                ),
            ),
            completions = FakeTodayRecentCompletionReader(emptyList()),
            preferences = FakeTodayPreferencesRepository(
                AppPreferences(dailyProgressEnabled = true, quickWinEnabled = true),
            ),
        )
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        val ready = viewModel.uiState.value as TodayUiState.Ready
        assertEquals(setOf("Call dentist", "Wipe counters"), ready.dueToday.map { it.title }.toSet())
        assertEquals(listOf("File expenses"), ready.overdue.map { it.title })
        assertEquals("Wipe counters", ready.quickWin?.title)
        assertEquals(1, ready.lists.single().activeCount)
        assertEquals(1, ready.lists.single().checkedCount)
        assertTrue(ready.recentActivity.any { it.title == "Send report" })
        assertTrue(ready.recentActivity.any { it.title == "Bread" })
        assertEquals(2, ready.progress?.completedToday)
        assertEquals(3, ready.progress?.remaining)
    }

    @Test
    fun completesTaskAndGradedChoreThenSupportsExactUndo() = runTest(dispatcher) {
        val area = Area("area", "House", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val task = Task("task", "Pay bill", dueAt = startToday, sortOrder = 0, createdAt = 1, updatedAt = 1)
        val tasks = FakeTodayTaskRepository(listOf(node(task)))
        val gradedChore = chore(
            id = "chore",
            title = "Clean kitchen",
            areaId = area.id,
            nextDueAt = startToday,
            supportsGrading = true,
        )
        val chores = FakeTodayChoreRepository(listOf(gradedChore), now)
        val viewModel = viewModel(
            tasks = tasks,
            chores = chores,
            areas = FakeTodayAreaRepository(listOf(area), emptyList()),
            lists = FakeTodayListRepository(emptyList()),
            completions = FakeTodayRecentCompletionReader(emptyList()),
            preferences = FakeTodayPreferencesRepository(AppPreferences()),
        )
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        val taskEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.completeItem(task.id)
        advanceUntilIdle()
        val completedTaskEvent = taskEvent.await() as TodayEvent.ItemCompleted
        assertEquals(now, tasks.nodes.value.single().task.completedAt)

        val taskUndoEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.undoCompletion(completedTaskEvent.undo)
        advanceUntilIdle()
        assertEquals(TodayEvent.Message("Completion undone"), taskUndoEvent.await())
        assertNull(tasks.nodes.value.single().task.completedAt)

        val choreEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.completeItem(gradedChore.chore.id, CompletionGrade.Deep)
        advanceUntilIdle()
        val completedChoreEvent = choreEvent.await() as TodayEvent.ItemCompleted
        assertEquals(CompletionGrade.Deep, chores.lastGrade)
        assertTrue(chores.chores.value.single().chore.nextDueAt != startToday)

        val choreUndoEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.undoCompletion(completedChoreEvent.undo)
        advanceUntilIdle()
        assertEquals(TodayEvent.Message("Completion undone"), choreUndoEvent.await())
        assertEquals(startToday, chores.chores.value.single().chore.nextDueAt)
    }

    private fun viewModel(
        tasks: FakeTodayTaskRepository,
        chores: FakeTodayChoreRepository,
        areas: FakeTodayAreaRepository,
        lists: FakeTodayListRepository,
        completions: FakeTodayRecentCompletionReader,
        preferences: FakeTodayPreferencesRepository,
    ) = TodayViewModel(
        taskRepository = tasks,
        taskWorkflowRepository = FakeTodayTaskWorkflowRepository(tasks, now),
        choreRepository = chores,
        areaRepository = areas,
        listRepository = lists,
        preferencesRepository = preferences,
        recentCompletionReader = completions,
        timeProvider = object : TimeProvider {
            override fun nowEpochMillis(): Long = now
        },
    )

    private fun node(task: Task) = TaskNode(task, isMainTask = false, subtasks = emptyList())

    private fun chore(
        id: String,
        title: String,
        areaId: String,
        sectionId: String? = null,
        nextDueAt: Long?,
        estimatedMinutes: Int? = null,
        supportsGrading: Boolean = false,
    ) = ChoreWithSchedule(
        chore = Chore(
            id = id,
            title = title,
            areaId = areaId,
            sectionId = sectionId,
            nextDueAt = nextDueAt,
            estimatedMinutes = estimatedMinutes,
            supportsGrading = supportsGrading,
            defaultGrade = if (supportsGrading) CompletionGrade.Moderate else CompletionGrade.None,
            sortOrder = 0,
            createdAt = 1,
            updatedAt = 1,
        ),
        schedule = ChoreSchedule(id, RecurrenceType.Weekly),
    )
}

private class FakeTodayTaskRepository(initial: List<TaskNode>) : TaskRepository {
    val nodes = MutableStateFlow(initial)

    fun task(taskId: String): Task? = nodes.value
        .flatMap { listOf(it.task) + it.subtasks }
        .firstOrNull { it.id == taskId }

    override fun observeTaskNodes(): Flow<List<TaskNode>> = nodes
    override fun observeRootTasks(): Flow<List<Task>> = flowOf(nodes.value.map { it.task })
    override fun observeSubtasks(parentTaskId: String): Flow<List<Task>> = flowOf(emptyList())
    override fun observeTask(taskId: String): Flow<Task?> = flowOf(task(taskId))
    override suspend fun saveTask(task: Task) = Unit
    override suspend fun setCompleted(taskId: String, completedAt: Long?) {
        nodes.value = nodes.value.map { node ->
            if (node.task.id == taskId) node.copy(task = node.task.copy(completedAt = completedAt)) else node
        }
    }
    override suspend fun setMainTask(taskId: String, enabled: Boolean) = Unit
    override suspend fun moveTask(taskId: String, direction: Int) = Unit
    override suspend fun indentTask(taskId: String) = Unit
    override suspend fun unindentTask(taskId: String) = Unit
    override suspend fun archiveTask(taskId: String, archivedAt: Long) = Unit
}

private class FakeTodayTaskWorkflowRepository(
    private val repository: FakeTodayTaskRepository,
    private val now: Long,
) : TaskWorkflowRepository {
    override suspend fun toggleCompletion(taskId: String): TaskCompletionMutation {
        val task = requireNotNull(repository.task(taskId))
        val next = now.takeIf { task.completedAt == null }
        repository.setCompleted(taskId, next)
        return TaskCompletionMutation(
            previousCompletedAtByTask = mapOf(taskId to task.completedAt),
            completedAtByTask = mapOf(taskId to next),
        )
    }

    override suspend fun undoCompletion(mutation: TaskCompletionMutation) {
        mutation.previousCompletedAtByTask.forEach { (taskId, completedAt) ->
            repository.setCompleted(taskId, completedAt)
        }
    }

    override suspend fun reorderTask(taskId: String, targetTaskId: String) = Unit
    override suspend fun archiveTask(taskId: String): TaskArchiveMutation = error("Not used")
    override suspend fun undoArchive(mutation: TaskArchiveMutation) = Unit
}

private class FakeTodayChoreRepository(
    initial: List<ChoreWithSchedule>,
    private val now: Long,
) : ChoreRepository {
    val chores = MutableStateFlow(initial)
    var lastGrade: CompletionGrade? = null

    override fun observeChores(): Flow<List<Chore>> = flowOf(chores.value.map { it.chore })
    override fun observeChoresWithSchedules(): Flow<List<ChoreWithSchedule>> = chores
    override fun observeChoresForArea(areaId: String): Flow<List<Chore>> = flowOf(emptyList())
    override fun observeChoresForAreaWithSchedules(areaId: String): Flow<List<ChoreWithSchedule>> = flowOf(emptyList())
    override fun observeChoresForSection(sectionId: String): Flow<List<ChoreWithSchedule>> = flowOf(emptyList())
    override fun observeChore(choreId: String): Flow<ChoreWithSchedule?> = flowOf(chores.value.firstOrNull { it.chore.id == choreId })
    override suspend fun saveChore(chore: ChoreWithSchedule) = Unit
    override suspend fun completeChore(choreId: String, grade: CompletionGrade): ChoreCompletionMutation {
        val current = chores.value.first { it.chore.id == choreId }
        val nextDue = now + 86_400_000L
        lastGrade = grade
        chores.value = chores.value.map { row ->
            if (row.chore.id == choreId) row.copy(chore = row.chore.copy(nextDueAt = nextDue)) else row
        }
        return ChoreCompletionMutation(choreId, "completion", current.chore.nextDueAt, nextDue, grade)
    }
    override suspend fun undoCompletion(mutation: ChoreCompletionMutation) {
        chores.value = chores.value.map { row ->
            if (row.chore.id == mutation.choreId) {
                row.copy(chore = row.chore.copy(nextDueAt = mutation.previousNextDueAt))
            } else {
                row
            }
        }
    }
    override suspend fun setPaused(choreId: String, paused: Boolean) = Unit
    override suspend fun skipOccurrence(choreId: String) = Unit
    override suspend fun moveChore(choreId: String, direction: Int) = Unit
    override suspend fun archiveChore(choreId: String, archivedAt: Long) = Unit
}

private class FakeTodayAreaRepository(
    areas: List<Area>,
    sections: List<Section>,
) : AreaRepository {
    private val areaFlow = MutableStateFlow(areas)
    private val sectionFlow = MutableStateFlow(sections)

    override fun observeAreas(): Flow<List<Area>> = areaFlow
    override fun observeSections(): Flow<List<Section>> = sectionFlow
    override fun observeArea(areaId: String): Flow<AreaWithSections?> = flowOf(null)
    override suspend fun saveArea(area: Area) = Unit
    override suspend fun saveSection(section: Section) = Unit
    override suspend fun createArea(name: String, icon: String?): Area = error("Not used")
    override suspend fun createSection(areaId: String, name: String, icon: String?): Section = error("Not used")
    override suspend fun moveArea(areaId: String, direction: Int) = Unit
    override suspend fun moveSection(sectionId: String, direction: Int) = Unit
    override suspend fun applyTemplate(areaId: String, kind: AreaTemplateKind) = TemplateApplyResult(0, 0)
    override suspend fun archiveArea(areaId: String, archivedAt: Long) = Unit
    override suspend fun archiveSection(sectionId: String, archivedAt: Long) = Unit
}

private class FakeTodayListRepository(
    initial: List<ReusableListWithItems>,
) : ListWorkflowRepository {
    private val lists = MutableStateFlow(initial)

    override fun observeLists(): Flow<List<ReusableListWithItems>> = lists
    override fun observeList(listId: String): Flow<ReusableListWithItems?> = flowOf(lists.value.firstOrNull { it.list.id == listId })
    override fun observeSuggestions(query: String, limit: Int): Flow<List<ListCatalogItem>> = flowOf(emptyList())
    override suspend fun createList(name: String, isReusable: Boolean): ReusableList = error("Not used")
    override suspend fun saveList(list: ReusableList) = Unit
    override suspend fun moveList(listId: String, direction: Int) = Unit
    override suspend fun reorderList(listId: String, targetListId: String) = Unit
    override suspend fun archiveList(listId: String) = Unit
    override suspend fun addItem(listId: String, name: String, quantity: String?, parentItemId: String?, catalogItemId: String?): ListItem = error("Not used")
    override suspend fun saveItem(item: ListItem) = Unit
    override suspend fun setItemChecked(itemId: String, checked: Boolean) = ListItemCheckMutation(itemId, null, null)
    override suspend fun undoCheck(mutation: ListItemCheckMutation) = Unit
    override suspend fun moveItem(itemId: String, direction: Int) = Unit
    override suspend fun reorderItem(itemId: String, targetItemId: String) = Unit
    override suspend fun indentItem(itemId: String) = Unit
    override suspend fun unindentItem(itemId: String) = Unit
    override suspend fun archiveItem(itemId: String): ListItemArchiveMutation = error("Not used")
    override suspend fun undoArchive(mutation: ListItemArchiveMutation) = Unit
    override suspend fun resetCheckedItems(listId: String) = Unit
    override suspend fun clearCheckedItems(listId: String) = Unit
}

private class FakeTodayRecentCompletionReader(initial: List<Completion>) : RecentCompletionReader {
    private val completions = MutableStateFlow(initial)
    override fun observeRecent(limit: Int): Flow<List<Completion>> = completions
}

private class FakeTodayPreferencesRepository(initial: AppPreferences) : PreferencesRepository {
    private val values = MutableStateFlow(initial)
    override val preferences: Flow<AppPreferences> = values
    override suspend fun setThemeMode(value: ThemeMode) = Unit
    override suspend fun setShowDueShorthand(value: Boolean) = Unit
    override suspend fun setHideCompletedItems(value: Boolean) = Unit
    override suspend fun setDailyProgressEnabled(value: Boolean) {
        values.value = values.value.copy(dailyProgressEnabled = value)
    }
    override suspend fun setQuickWinEnabled(value: Boolean) {
        values.value = values.value.copy(quickWinEnabled = value)
    }
    override suspend fun setDemoDataEnabled(value: Boolean) = Unit
    override suspend fun setItemHandedness(value: ItemHandedness) {
        values.value = values.value.copy(itemHandedness = value)
    }
}
