package com.arrow2851.nudge.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(
    createRequest: Int,
    viewModel: TasksViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    var dueDateTaskId by rememberSaveable { mutableStateOf<String?>(null) }

    LaunchedEffect(createRequest) {
        if (createRequest > 0) viewModel.createTask()
    }

    when (val current = state) {
        TasksUiState.Loading -> LoadingTasks()
        is TasksUiState.Error -> ErrorTasks(
            message = current.message,
            onRetry = viewModel::dismissRecoverableError,
        )
        is TasksUiState.Ready -> {
            TasksContent(
                state = current,
                onAddTask = { viewModel.createTask() },
                onAddSubtask = viewModel::createTask,
                onEditTask = viewModel::editTask,
                onFinishTitleEdit = viewModel::finishTitleEdit,
                onToggleCompleted = viewModel::toggleCompleted,
                onOpenDueDate = { dueDateTaskId = it },
                onDelete = viewModel::archive,
                onReorder = viewModel::reorder,
                onMoveUp = viewModel::moveUp,
                onMoveDown = viewModel::moveDown,
                onIndent = viewModel::indent,
                onUnindent = viewModel::unindent,
                onToggleCompletedVisibility = {
                    viewModel.setHideCompleted(!current.hideCompleted)
                },
            )

            current.recoverableError?.let { message ->
                RecoverableErrorBanner(
                    message = message,
                    onDismiss = viewModel::dismissRecoverableError,
                )
            }

            val dueTask = dueDateTaskId?.let(current::findTask)
            if (dueTask != null) {
                val datePickerState = rememberDatePickerState(
                    initialSelectedDateMillis = dueTask.dueAt,
                )
                DatePickerDialog(
                    onDismissRequest = { dueDateTaskId = null },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                viewModel.updateDueDate(dueTask.id, datePickerState.selectedDateMillis)
                                dueDateTaskId = null
                            },
                            enabled = datePickerState.selectedDateMillis != null,
                        ) {
                            Text(if (dueTask.dueAt == null) "Set date" else "Change date")
                        }
                    },
                    dismissButton = {
                        Row {
                            if (dueTask.dueAt != null) {
                                TextButton(
                                    onClick = {
                                        viewModel.updateDueDate(dueTask.id, null)
                                        dueDateTaskId = null
                                    },
                                ) {
                                    Text("Remove date")
                                }
                            }
                            TextButton(onClick = { dueDateTaskId = null }) {
                                Text("Cancel")
                            }
                        }
                    },
                ) {
                    DatePicker(state = datePickerState)
                }
            }
        }
    }
}

@Composable
private fun TasksContent(
    state: TasksUiState.Ready,
    onAddTask: () -> Unit,
    onAddSubtask: (String) -> Unit,
    onEditTask: (String) -> Unit,
    onFinishTitleEdit: (String, String) -> Unit,
    onToggleCompleted: (String) -> Unit,
    onOpenDueDate: (String) -> Unit,
    onDelete: (String) -> Unit,
    onReorder: (String, String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
    onToggleCompletedVisibility: () -> Unit,
) {
    val visibleActive = state.activeNodes
    val visibleCompleted = if (state.hideCompleted) emptyList() else state.completedNodes

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .testTag("tasks-list"),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(0.dp),
    ) {
        item {
            NudgeSectionLabel(text = "ONE-TIME CHECKLIST")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Text(
                text = "Tasks",
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x1))
            Text(
                text = "Capture it, check it off, and keep moving.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(14.dp))
        }

        if (visibleActive.isEmpty() && visibleCompleted.isEmpty()) {
            item {
                NudgeEmptyState(
                    title = "Nothing on the checklist",
                    message = "Add one small task.",
                    actionLabel = "Add task",
                    onAction = onAddTask,
                    icon = { Icon(Icons.Default.Add, contentDescription = null) },
                )
            }
        } else {
            itemsIndexed(
                visibleActive,
                key = { _, node -> node.task.id },
            ) { index, node ->
                TaskNodeCard(
                    node = node,
                    previousRootId = visibleActive.getOrNull(index - 1)?.task?.id,
                    nextRootId = visibleActive.getOrNull(index + 1)?.task?.id,
                    editingTaskId = state.editingTaskId,
                    showDueShorthand = state.showDueShorthand,
                    hideCompleted = state.hideCompleted,
                    handedness = state.handedness,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onToggleCompleted = onToggleCompleted,
                    onOpenDueDate = onOpenDueDate,
                    onDelete = onDelete,
                    onReorder = onReorder,
                    onMoveUp = onMoveUp,
                    onMoveDown = onMoveDown,
                    onIndent = onIndent,
                    onUnindent = onUnindent,
                )
            }
        }

        if (state.completedNodes.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp, bottom = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    NudgeSectionLabel(text = "COMPLETED")
                    IconButton(
                        onClick = onToggleCompletedVisibility,
                        modifier = Modifier.testTag("toggle-completed-visibility"),
                    ) {
                        Icon(
                            imageVector = if (state.hideCompleted) {
                                Icons.Default.Visibility
                            } else {
                                Icons.Default.VisibilityOff
                            },
                            contentDescription = if (state.hideCompleted) {
                                "Show completed tasks"
                            } else {
                                "Hide completed tasks"
                            },
                        )
                    }
                }
            }

            itemsIndexed(
                visibleCompleted,
                key = { _, node -> "completed-${node.task.id}" },
            ) { index, node ->
                TaskNodeCard(
                    node = node,
                    previousRootId = visibleCompleted.getOrNull(index - 1)?.task?.id,
                    nextRootId = visibleCompleted.getOrNull(index + 1)?.task?.id,
                    editingTaskId = state.editingTaskId,
                    showDueShorthand = state.showDueShorthand,
                    hideCompleted = false,
                    handedness = state.handedness,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onToggleCompleted = onToggleCompleted,
                    onOpenDueDate = onOpenDueDate,
                    onDelete = onDelete,
                    onReorder = onReorder,
                    onMoveUp = onMoveUp,
                    onMoveDown = onMoveDown,
                    onIndent = onIndent,
                    onUnindent = onUnindent,
                )
            }
        }

        item {
            Spacer(Modifier.height(12.dp))
            NudgeButton(
                text = "Add task",
                onClick = onAddTask,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("add-task-bottom"),
                style = NudgeButtonStyle.Outlined,
                leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
            )
        }
    }
}

@Composable
internal fun LoadingTasks() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
internal fun ErrorTasks(message: String, onRetry: () -> Unit) {
    NudgeEmptyState(
        title = "Tasks are unavailable",
        message = message,
        actionLabel = "Try again",
        onAction = onRetry,
    )
}

@Composable
internal fun RecoverableErrorBanner(message: String, onDismiss: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        contentAlignment = Alignment.TopCenter,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = message,
                modifier = Modifier.weight(1f),
                style = MaterialTheme.typography.bodyMedium,
            )
            TextButton(onClick = onDismiss) { Text("Dismiss") }
        }
    }
}

internal fun formatDueShorthand(
    dueAt: Long,
    now: Long = System.currentTimeMillis(),
    zoneId: ZoneId = ZoneId.systemDefault(),
): String {
    val dueDate = Instant.ofEpochMilli(dueAt).atZone(zoneId).toLocalDate()
    val today = Instant.ofEpochMilli(now).atZone(zoneId).toLocalDate()
    val days = ChronoUnit.DAYS.between(today, dueDate)
    return when (days) {
        0L -> "Today"
        1L -> "1d"
        -1L -> "-1d"
        in 2L..6L -> "${days}d"
        else -> dueDate.format(DateTimeFormatter.ofPattern("MMM d"))
    }
}

internal fun formatLongDate(dueAt: Long): String =
    Instant.ofEpochMilli(dueAt)
        .atZone(ZoneId.systemDefault())
        .toLocalDate()
        .format(DateTimeFormatter.ofPattern("MMM d, yyyy"))
