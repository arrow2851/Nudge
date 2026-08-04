package com.arrow2851.nudge.ui.quickadd

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch

sealed interface QuickAddEvent {
    data class Saved(val title: String) : QuickAddEvent
    data class Error(val message: String) : QuickAddEvent
}

@HiltViewModel
class QuickAddViewModel @Inject constructor(
    private val taskRepository: TaskRepository,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val eventChannel = Channel<QuickAddEvent>(Channel.BUFFERED)
    val events: Flow<QuickAddEvent> = eventChannel.receiveAsFlow()

    fun saveTask(title: String) {
        val normalized = title.trim()
        if (normalized.isEmpty()) {
            viewModelScope.launch {
                eventChannel.send(QuickAddEvent.Error("Enter a task name"))
            }
            return
        }
        viewModelScope.launch {
            runCatching {
                val nodes = taskRepository.observeTaskNodes().first()
                val nextOrder = SortOrders.after(
                    nodes.maxOfOrNull { it.task.sortOrder } ?: -SortOrders.Gap,
                )
                val now = timeProvider.nowEpochMillis()
                taskRepository.saveTask(
                    Task(
                        id = idGenerator.newId(),
                        title = normalized,
                        sortOrder = nextOrder,
                        createdAt = now,
                        updatedAt = now,
                    ),
                )
            }.onSuccess {
                eventChannel.send(QuickAddEvent.Saved(normalized))
            }.onFailure { error ->
                eventChannel.send(
                    QuickAddEvent.Error(error.message ?: "Task could not be saved"),
                )
            }
        }
    }
}
