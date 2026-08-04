package com.arrow2851.nudge.ui.tasks

import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.ThemeMode
import com.arrow2851.nudge.core.model.TimeProvider
import java.time.LocalDate
import java.time.ZoneId
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
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
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class TasksViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun createTaskPersistsEmptyEditableRoot() = runTest(dispatcher) {
        val repository = FakeTaskRepository()
        val viewModel = createViewModel(repository)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) {
            viewModel.uiState.collect {}
        }
        advanceUntilIdle()

        viewModel.createTask()
        advanceUntilIdle()

        val ready = viewModel.uiState.value as TasksUiState.Ready
        assertEquals("task-1", ready.editingTaskId)
        assertEquals("", ready.nodes.single().task.title)
        assertEquals(null, ready.nodes.single().task.parentTaskId)
    }

    @Test
    fun completingTaskDelegatesAndSupportsUndo() = runTest(dispatcher) {
        val repository = FakeTaskRepository(
            initial = listOf(
                TaskNode(
                    task = task(id = "one", title = "One"),
                    isMainTask = false,
                    subtasks = emptyList(),
                ),
            ),
        )
        val viewModel = createViewModel(repository)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) {
            viewModel.uiState.collect {}
        }
        advanceUntilIdle()

        viewModel.toggleCompleted("one")
        advanceUntilIdle()
        assertEquals(2_000L, repository.lastCompletion)

        viewModel.undoCompletion(CompletionUndo("one", null))
        advanceUntilIdle()
        assertEquals(null, repository.lastCompletion)
    }

    @Test
    fun dueShorthandUsesCalendarDistance() {
        val zone = ZoneId.of("UTC")
        val today = LocalDate.of(2026, 8, 3).atStartOfDay(zone).toInstant().toEpochMilli()
        val tomorrow = LocalDate.of(2026, 8, 4).atStartOfDay(zone).toInstant().toEpochMilli()
        val overdue = LocalDate.of(2026, 8, 2).atStartOfDay(zone).toInstant().toEpochMilli()

        assertEquals("1d", formatDueShorthand(tomorrow, today, zone))
        assertEquals("-1d", formatDueShorthand(overdue, today, zone))
    }

    private fun createViewModel(repository: FakeTaskRepository) = TasksViewModel(
        taskRepository = repository,
        preferencesRepository = FakePreferencesRepository(),
        idGenerator = object : IdGenerator {
            override fun newId(): String = "task-1"
        },
        timeProvider = object : TimeProvider {
            override fun nowEpochMillis(): Long = 2_000L
        },
    )

    private fun task(id: String, title: String) = Task(
        id = id,
        title = title,
        sortOrder = 0L,
        createdAt = 1_000L,
        updatedAt = 1_000L,
    )
}

private class FakeTaskRepository(
    initial: List<TaskNode> = emptyList(),
) : TaskRepository {
    private val nodes = MutableStateFlow(initial)
    var lastCompletion: Long? = null

    override fun observeTaskNodes(): Flow<List<TaskNode>> = nodes
    override fun observeRootTasks(): Flow<List<Task>> = flowOf(nodes.value.map(TaskNode::task))
    override fun observeSubtasks(parentTaskId: String): Flow<List<Task>> = flowOf(emptyList())
    override fun observeTask(taskId: String): Flow<Task?> = flowOf(
        nodes.value.flatMap { listOf(it.task) + it.subtasks }.firstOrNull { it.id == taskId },
    )

    override suspend fun saveTask(task: Task) {
        val existing = nodes.value.indexOfFirst { it.task.id == task.id }
        nodes.value = if (existing >= 0) {
            nodes.value.toMutableList().also { list ->
                list[existing] = list[existing].copy(task = task)
            }
        } else {
            nodes.value + TaskNode(task, isMainTask = false, subtasks = emptyList())
        }
    }

    override suspend fun setCompleted(taskId: String, completedAt: Long?) {
        lastCompletion = completedAt
        nodes.value = nodes.value.map { node ->
            if (node.task.id == taskId) node.copy(task = node.task.copy(completedAt = completedAt)) else node
        }
    }

    override suspend fun setMainTask(taskId: String, enabled: Boolean) {
        nodes.value = nodes.value.map { if (it.task.id == taskId) it.copy(isMainTask = enabled) else it }
    }

    override suspend fun moveTask(taskId: String, direction: Int) = Unit
    override suspend fun indentTask(taskId: String) = Unit
    override suspend fun unindentTask(taskId: String) = Unit
    override suspend fun archiveTask(taskId: String, archivedAt: Long) {
        nodes.value = nodes.value.filterNot { it.task.id == taskId }
    }
}

private class FakePreferencesRepository : PreferencesRepository {
    private val state = MutableStateFlow(AppPreferences())
    override val preferences: Flow<AppPreferences> = state

    override suspend fun setThemeMode(value: ThemeMode) {
        state.value = state.value.copy(themeMode = value)
    }

    override suspend fun setShowDueShorthand(value: Boolean) {
        state.value = state.value.copy(showDueShorthand = value)
    }

    override suspend fun setHideCompletedItems(value: Boolean) {
        state.value = state.value.copy(hideCompletedItems = value)
    }

    override suspend fun setDailyProgressEnabled(value: Boolean) {
        state.value = state.value.copy(dailyProgressEnabled = value)
    }

    override suspend fun setQuickWinEnabled(value: Boolean) {
        state.value = state.value.copy(quickWinEnabled = value)
    }

    override suspend fun setDemoDataEnabled(value: Boolean) {
        state.value = state.value.copy(demoDataEnabled = value)
    }
}
