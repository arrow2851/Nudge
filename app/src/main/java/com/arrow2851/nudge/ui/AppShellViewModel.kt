package com.arrow2851.nudge.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.TaskCompletionMutation
import com.arrow2851.nudge.core.data.TaskWorkflowRepository
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.mutation.AppFeedbackEvent
import com.arrow2851.nudge.core.mutation.AppMutationCoordinator
import com.arrow2851.nudge.core.mutation.UndoToken
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.launch

@HiltViewModel
class AppShellViewModel @Inject constructor(
    private val mutationCoordinator: AppMutationCoordinator,
    private val taskWorkflowRepository: TaskWorkflowRepository,
    private val choreRepository: ChoreRepository,
) : ViewModel() {
    val feedback: SharedFlow<AppFeedbackEvent> = mutationCoordinator.events

    fun undo(token: UndoToken) {
        viewModelScope.launch { mutationCoordinator.performUndo(token) }
    }

    fun registerTaskUndo(message: String, mutation: TaskCompletionMutation) {
        viewModelScope.launch {
            mutationCoordinator.beginMutation()
            mutationCoordinator.registerUndo(message) {
                taskWorkflowRepository.undoCompletion(mutation)
            }
        }
    }

    fun registerChoreUndo(message: String, mutation: ChoreCompletionMutation) {
        viewModelScope.launch {
            mutationCoordinator.beginMutation()
            mutationCoordinator.registerUndo(message) {
                choreRepository.undoCompletion(mutation)
            }
        }
    }

    @Deprecated("Use the repository-level task or chore undo registration methods")
    fun registerUndo(message: String, action: () -> Unit) {
        viewModelScope.launch {
            mutationCoordinator.beginMutation()
            mutationCoordinator.registerUndo(message) { action() }
        }
    }

    fun mutationMessage(message: String) {
        viewModelScope.launch {
            mutationCoordinator.beginMutation()
            mutationCoordinator.showMessage(message)
        }
    }

    fun invalidateUndo() {
        viewModelScope.launch { mutationCoordinator.invalidateUndo() }
    }
}
