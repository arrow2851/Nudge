package com.arrow2851.nudge.ui.tasks

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.lifecycle.HiltViewModel
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

sealed interface TasksUiState {
    data object Loading : TasksUiState

    data class Ready(
        val nodes: List<TaskNode>,
        val hideCompleted: Boolean,
        val showDueShorthand: Boolean,
        val editingTaskId: String?,
        val recoverableError: String?,
    ) : TasksUiState {
        val activeNodes: List<TaskNode>
            get() = nodes.filter { it.task.completedAt == null }

        val completedNodes: List<TaskNode>
            get() = nodes.filter { it.task.completedAt != null }

        fun findTask(taskId: String): Task? = nodes.firstNotNullOfOrNull { node ->
            when {
                node.task.id == taskId -> node.task
                else -> node.subtasks.firstOrNull { it.id == taskId }
            }
        }

        fun isMainTask(taskId: String): Boolean =
            nodes.firstOrNull { it.task.id == taskId }?.isMainTask == true
    }

    data class Error(val message: String) : TasksUiState
}

data class CompletionUndo(
    val taskId: String,
    val previousCompletedAt: Long?,
)

sealed interface TasksEvent {
    data class CompletionChanged(
        val message: String,
        val undo: CompletionUndo,
    ) : TasksEvent
}

@HiltViewModel
class TasksViewModel @Inject constructor(
    private val taskRepository: TaskRepository,
    private val preferencesRepository: PreferencesRepository,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val editingTaskId = MutableStateFlow<String?>(null)
    private val recoverableError = MutableStateFlow<String?>(null)
    private val eventChannel = Channel<TasksEvent>(capacity = Channel.BUFFERED)

    val events: Flow<TasksEvent> = eventChannel.receiveAsFlow()

    val uiState: StateFlow<TasksUiState> = combine(
        taskRepository.observeTaskNodes(),
        preferencesRepository.preferences,
        editingTaskId,
        recoverableError,
    ) { nodes, preferences, editingId, error ->
        TasksUiState.Ready(
            nodes = nodes,
            hideCompleted = preferences.hideCompletedItems,
            showDueShorthand = preferences.showDueShorthand,
            editingTaskId = editingId,
            recoverableError = error,
        ) as TasksUiState
    }
        .onStart { emit(TasksUiState.Loading) }
        .catch { throwable ->
            emit(TasksUiState.Error(throwable.message ?: "Tasks could not be loaded."))
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000L),
            initialValue = TasksUiState.Loading,
        )

    fun createTask(parentTaskId: String? = null) {
        launchMutation {
            val current = uiState.value as? TasksUiState.Ready
            val allTasks = current?.nodes.orEmpty().flatMap { node -> listOf(node.task) + node.subtasks }
            val nextOrder = SortOrders.after(
                allTasks.filter { it.parentTaskId == parentTaskId }
                    .maxOfOrNull(Task::sortOrder) ?: -SortOrders.Gap,
            )
            val now = timeProvider.nowEpochMillis()
            val task = Task(
                id = idGenerator.newId(),
                title = "",
                parentTaskId = parentTaskId,
                sortOrder = nextOrder,
                createdAt = now,
                updatedAt = now,
            )
            if (parentTaskId != null) taskRepository.setMainTask(parentTaskId, true)
            taskRepository.saveTask(task)
            editingTaskId.value = task.id
        }
    }

    fun editTask(taskId: String) {
        editingTaskId.value = taskId
    }

    fun finishTitleEdit(taskId: String, title: String) {
        launchMutation {
            val task = currentTask(taskId) ?: return@launchMutation
            val normalized = title.trim()
            if (normalized.isEmpty()) {
                if (task.title.isEmpty()) taskRepository.archiveTask(taskId, timeProvider.nowEpochMillis())
            } else if (normalized != task.title) {
                taskRepository.saveTask(
                    task.copy(
                        title = normalized,
                        updatedAt = timeProvider.nowEpochMillis(),
                    ),
                )
            }
            if (editingTaskId.value == taskId) editingTaskId.value = null
        }
    }

    fun cancelTitleEdit(taskId: String) {
        launchMutation {
            val task = currentTask(taskId)
            if (task?.title.isNullOrEmpty()) {
                taskRepository.archiveTask(taskId, timeProvider.nowEpochMillis())
            }
            if (editingTaskId.value == taskId) editingTaskId.value = null
        }
    }

    fun toggleCompleted(taskId: String) {
        launchMutation {
            val task = currentTask(taskId) ?: return@launchMutation
            val previous = task.completedAt
            val completedAt = if (previous == null) timeProvider.nowEpochMillis() else null
            taskRepository.setCompleted(taskId, completedAt)
            eventChannel.send(
                TasksEvent.CompletionChanged(
                    message = if (completedAt == null) "Task reopened" else "Task completed",
                    undo = CompletionUndo(taskId, previous),
                ),
            )
        }
    }

    fun undoCompletion(undo: CompletionUndo) {
        launchMutation {
            taskRepository.setCompleted(undo.taskId, undo.previousCompletedAt)
        }
    }

    fun updateDueDate(taskId: String, dueAt: Long?) {
        launchMutation {
            val task = currentTask(taskId) ?: return@launchMutation
            taskRepository.saveTask(
                task.copy(
                    dueAt = dueAt,
                    updatedAt = timeProvider.nowEpochMillis(),
                ),
            )
        }
    }

    fun setMainTask(taskId: String, enabled: Boolean) {
        launchMutation { taskRepository.setMainTask(taskId, enabled) }
    }

    fun moveUp(taskId: String) {
        launchMutation { taskRepository.moveTask(taskId, -1) }
    }

    fun moveDown(taskId: String) {
        launchMutation { taskRepository.moveTask(taskId, 1) }
    }

    fun indent(taskId: String) {
        launchMutation { taskRepository.indentTask(taskId) }
    }

    fun unindent(taskId: String) {
        launchMutation { taskRepository.unindentTask(taskId) }
    }

    fun archive(taskId: String) {
        launchMutation {
            taskRepository.archiveTask(taskId, timeProvider.nowEpochMillis())
            if (editingTaskId.value == taskId) editingTaskId.value = null
        }
    }

    fun setHideCompleted(hide: Boolean) {
        launchMutation { preferencesRepository.setHideCompletedItems(hide) }
    }

    fun dismissRecoverableError() {
        recoverableError.value = null
    }

    private fun currentTask(taskId: String): Task? =
        (uiState.value as? TasksUiState.Ready)?.findTask(taskId)

    private fun launchMutation(block: suspend () -> Unit) {
        viewModelScope.launch {
            runCatching { block() }
                .onFailure { throwable ->
                    recoverableError.value = throwable.message ?: "That change could not be saved."
                }
        }
    }
}
