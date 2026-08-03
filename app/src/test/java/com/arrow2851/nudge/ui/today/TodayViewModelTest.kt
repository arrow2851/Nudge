package com.arrow2851.nudge.ui.today

import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.ListItemCheckMutation
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.RecentCompletionReader
import com.arrow2851.nudge.core.data.TaskRepository
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
    fun aggregatesDueItemsListsActivityProgressAndQuickWin() = runTest(dispatcher) {
        val area = Area("area", "House", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val section = Section("section", area.id, "Kitchen", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val tasks = FakeTaskRepository(
            listOf(
                node(Task("overdue-task", "File expenses", dueAt = startToday - 86_400_000L, estimatedMinutes = 20, sortOrder = 0, createdAt = 1, updatedAt = 1)),
                node(Task("today-task", "Call dentist", dueAt = startToday + 3_600_000L, estimatedMinutes = 8, sortOrder = 1, createdAt = 1, updatedAt = 1)),
                node(Task("completed-task", "Send report", dueAt = startToday, completedAt = now - 3_600_000L, sortOrder = 2, createdAt = 1, updatedAt = 1)),
                node(Task("future-task", "Future task", dueAt = startToday + 2 * 86_400_000L, sortOrder = 3, createdAt = 1, updatedAt = 1)),
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
        val completedChore = chore(
            id = "completed-chore",
            title = "Clean sink",
            areaId = area.id,
            sectionId = section.id,
            nextDueAt = startToday + 7 * 86_400_000L,
            estimatedMinutes = 10,
        )
        val chores = FakeChoreRepository(
            initial = listOf(
                dueChore,
                completedChore,
                chore("paused", "Paused chore", area.id, nextDueAt = startToday - 1, paused = true),
                chore("as-needed", "As needed", area.id, nextDueAt = null, recurrenceType = RecurrenceType.WhenNeeded),
            ),
            now = now,
        )
        val checkedAt = now - 1_800_000L
        val lists = FakeListWorkflowRepository(
            listOf(
                ReusableListWithItems(
                    list = ReusableList("list", "Groceries", isReusable = true, sortOrder = 0, createdAt = 1, updatedAt = 1),
                    items = listOf(
                        ListItem("active", "list", name = "Milk", sortOrder = 0, addedAt = 1, updatedAt = 1),
                        ListItem("checked", "list", name = "Bread", isChecked = true, sortOrder = 1, addedAt = 1, updatedAt = checkedAt, checkedAt = checkedAt),
                    ),
                ),
            ),
        )
        val completions = FakeRecentCompletionReader(
            listOf(
                Completion(
                    id = "completion",
                    choreId = completedChore.chore.id,
                    completedAt = now - 900_000L,
                    grade = CompletionGrade.Moderate,
                ),
            ),
        )
        val viewModel = viewModel(
            tasks = tasks,
            chores = chores,
            areas = FakeAreaRepository(listOf(area), listOf(section)),
            lists = lists,
            completions = completions,
            preferences = FakePreferencesRepository(
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
        assertTrue(ready.recentActivity.any { it.title == "Clean sink" })
        assertTrue(ready.recentActivity.any { it.title == "Bread" })
        assertEquals(3, ready.progress?.completedToday)
        assertEquals(3, ready.progress?.remaining)
    }

    @Test
    fun completesTaskAndGradedChoreThenSupportsUndo() = runTest(dispatcher) {
        val area = Area("area", "House", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val task = Task("task", "Pay bill", dueAt = startToday, sortOrder = 0, createdAt = 1, updatedAt = 1)
        val tasks = FakeTaskRepository(listOf(node(task)))
        val gradedChore = chore(
            id = "chore",
            title = "Clean kitchen",
            areaId = area.id,
            nextDueAt = startToday,
            supportsGrading = true,
        )
        val chores = FakeChoreRepository(listOf(gradedChore), now)
        val viewModel = viewModel(
            tasks = tasks,
            chores = chores,
            areas = FakeAreaRepository(listOf(area), emptyList()),
            lists = FakeListWorkflowRepository(emptyList()),
            completions = FakeRecentCompletionReader(emptyList()),
            preferences = FakePreferencesRepository(AppPreferences()),
        )
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        val taskEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.completeItem(task.id)
        advanceUntilIdle()
        val completedTaskEvent = taskEvent.await() as TodayEvent.ItemCompleted
        assertEquals(now, tasks.nodes.value.single().task.completedAt)

        viewModel.undoCompletion(completedTaskEvent.undo)
        advanceUntilIdle()
        assertNull(tasks.nodes.value.single().task.completedAt)

        val choreEvent = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }
        viewModel.completeItem(gradedChore.chore.id, CompletionGrade.Deep)
        advanceUntilIdle()
        val completedChoreEvent = choreEvent.await() as TodayEvent.ItemCompleted
        assertEquals(CompletionGrade.Deep, chores.lastGrade)
        assertTrue(chores.chores.value.single().chore.nextDueAt != startToday)

        viewModel.undoCompletion(completedChoreEvent.undo)
        advanceUntilIdle()
        assertEquals(startToday, chores.chores.value.single().chore.nextDueAt)
    }

    private fun viewModel(
        tasks: FakeTaskRepository,
        chores: FakeChoreRepository,
        areas: FakeAreaRepository,
        lists: FakeListWorkflowRepository,
        completions: FakeRecentCompletionReader,
        preferences: FakePreferencesRepository,
    ) = TodayViewModel(
        taskRepository = tasks,
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
        paused: Boolean = false,
        recurrenceType: RecurrenceType = RecurrenceType.Weekly,
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
            isPaused = paused,
            sortOrder = 0,
            createdAt = 1,
            updatedAt = 1,
        ),
        schedule = ChoreSchedule(id, recurrenceType),
    )
}

private class FakeTaskRepository(initial: List<TaskNode>) : TaskRepository {
    val nodes = MutableStateFlow(initial)

    override fun observeTaskNodes(): Flow<List<TaskNode>> = nodes
    override fun observeRootTasks(): Flow<List<Task>> = flowOf(nodes.value.map { it.task })
    override fun observeSubtasks(parentTaskId: String): Flow<List<Task>> = flowOf(emptyList())
    override fun observeTask(taskId: String): Flow<Task?> = flowOf(nodes.value.firstOrNull { it.task.id == taskId }?.task)
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

private class FakeChoreRepository(
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

private class FakeAreaRepository(
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

private class FakeListWorkflowRepository(
    initial: List<ReusableListWithItems>,
) : ListWorkflowRepository {
    private val lists = MutableStateFlow(initial)

    override fun observeLists(): Flow<List<ReusableListWithItems>> = lists
    override fun observeList(listId: String): Flow<ReusableListWithItems?> = flowOf(lists.value.firstOrNull { it.list.id == listId })
    override fun observeSuggestions(query: String, limit: Int): Flow<List<ListCatalogItem>> = flowOf(emptyList())
    override suspend fun createList(name: String, isReusable: Boolean): ReusableList = error("Not used")
    override suspend fun saveList(list: ReusableList) = Unit
    override suspend fun moveList(listId: String, direction: Int) = Unit
    override suspend fun archiveList(listId: String) = Unit
    override suspend fun addItem(listId: String, name: String, quantity: String?, parentItemId: String?, catalogItemId: String?): ListItem = error("Not used")
    override suspend fun saveItem(item: ListItem) = Unit
    override suspend fun setItemChecked(itemId: String, checked: Boolean) = ListItemCheckMutation(itemId, null, null)
    override suspend fun undoCheck(mutation: ListItemCheckMutation) = Unit
    override suspend fun moveItem(itemId: String, direction: Int) = Unit
    override suspend fun indentItem(itemId: String) = Unit
    override suspend fun unindentItem(itemId: String) = Unit
    override suspend fun archiveItem(itemId: String) = Unit
    override suspend fun resetCheckedItems(listId: String) = Unit
    override suspend fun clearCheckedItems(listId: String) = Unit
}

private class FakeRecentCompletionReader(initial: List<Completion>) : RecentCompletionReader {
    private val completions = MutableStateFlow(initial)
    override fun observeRecent(limit: Int): Flow<List<Completion>> = completions
}

private class FakePreferencesRepository(initial: AppPreferences) : PreferencesRepository {
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
}
