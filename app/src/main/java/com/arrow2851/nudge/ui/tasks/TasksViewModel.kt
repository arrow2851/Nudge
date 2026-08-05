package com.arrow2851.nudge.ui.tasks

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.data.TaskWorkflowRepository
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.mutation.AppMutationCoordinator
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface TasksUiState {
    data object Loading : TasksUiState

    data class Ready(
        val nodes: List<TaskNode>,
        val hideCompleted: Boolean,
        val showDueShorthand: Boolean,
        val handedness: ItemHandedness,
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
    }

    data class Error(val message: String) : TasksUiState
}

@HiltViewModel
class TasksViewModel @Inject constructor(
    private val taskRepository: TaskRepository,
    private val taskWorkflowRepository: TaskWorkflowRepository,
    private val preferencesRepository: PreferencesRepository,
    private val mutationCoordinator: AppMutationCoordinator,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val editingTaskId = MutableStateFlow<String?>(null)
    private val recoverableError = MutableStateFlow<String?>(null)

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
            handedness = preferences.itemHandedness,
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
                if (task.title.isEmpty()) {
                    val mutation = taskWorkflowRepository.archiveTask(taskId)
                    mutationCoordinator.registerUndo("Empty task removed") {
                        taskWorkflowRepository.undoArchive(mutation)
                    }
                }
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
            if (task?.title.isNullOrEmpty() && task != null) {
                val mutation = taskWorkflowRepository.archiveTask(taskId)
                mutationCoordinator.registerUndo("Empty task removed") {
                    taskWorkflowRepository.undoArchive(mutation)
                }
            }
            if (editingTaskId.value == taskId) editingTaskId.value = null
        }
    }

    fun toggleCompleted(taskId: String) {
        launchMutation {
            val task = currentTask(taskId) ?: return@launchMutation
            val mutation = taskWorkflowRepository.toggleCompletion(taskId)
            mutationCoordinator.registerUndo(
                if (task.completedAt == null) "Task completed" else "Task reopened",
            ) {
                taskWorkflowRepository.undoCompletion(mutation)
            }
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

    fun reorder(taskId: String, targetTaskId: String) {
        launchMutation { taskWorkflowRepository.reorderTask(taskId, targetTaskId) }
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
            val mutation = taskWorkflowRepository.archiveTask(taskId)
            if (editingTaskId.value == taskId) editingTaskId.value = null
            mutationCoordinator.registerUndo("Task deleted") {
                taskWorkflowRepository.undoArchive(mutation)
            }
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
            mutationCoordinator.beginMutation()
            runCatching { block() }
                .onFailure { throwable ->
                    recoverableError.value = throwable.message ?: "That change could not be saved."
                }
        }
    }
}
