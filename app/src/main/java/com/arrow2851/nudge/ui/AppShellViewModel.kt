package com.arrow2851.nudge.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
) : ViewModel() {
    val feedback: SharedFlow<AppFeedbackEvent> = mutationCoordinator.events

    fun undo(token: UndoToken) {
        viewModelScope.launch { mutationCoordinator.performUndo(token) }
    }

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
