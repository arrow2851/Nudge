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
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@Composable
fun TasksScreen(
    createRequest: Int,
    snackbarHostState: SnackbarHostState,
    viewModel: TasksViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    var selectedTaskId by rememberSaveable { mutableStateOf<String?>(null) }

    LaunchedEffect(createRequest) {
        if (createRequest > 0) viewModel.createTask()
    }

    LaunchedEffect(viewModel, snackbarHostState) {
        viewModel.events.collect { event ->
            when (event) {
                is TasksEvent.CompletionChanged -> {
                    val result = snackbarHostState.showSnackbar(
                        message = event.message,
                        actionLabel = "Undo",
                        withDismissAction = true,
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        viewModel.undoCompletion(event.undo)
                    }
                }
            }
        }
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
                onCancelTitleEdit = viewModel::cancelTitleEdit,
                onToggleCompleted = viewModel::toggleCompleted,
                onOpenDetails = { selectedTaskId = it },
                onMoveUp = viewModel::moveUp,
                onMoveDown = viewModel::moveDown,
                onIndent = viewModel::indent,
                onUnindent = viewModel::unindent,
                onToggleCompletedVisibility = { viewModel.setHideCompleted(!current.hideCompleted) },
            )

            current.recoverableError?.let { message ->
                RecoverableErrorBanner(
                    message = message,
                    onDismiss = viewModel::dismissRecoverableError,
                )
            }

            val selectedTask = selectedTaskId?.let(current::findTask)
            TaskDetailsSheet(
                task = selectedTask,
                isMainTask = selectedTask?.let { current.isMainTask(it.id) } == true,
                onDismiss = { selectedTaskId = null },
                onSaveTitle = viewModel::finishTitleEdit,
                onDueDateChanged = viewModel::updateDueDate,
                onMainTaskChanged = viewModel::setMainTask,
                onAddSubtask = viewModel::createTask,
                onMoveUp = viewModel::moveUp,
                onMoveDown = viewModel::moveDown,
                onIndent = viewModel::indent,
                onUnindent = viewModel::unindent,
                onArchive = {
                    viewModel.archive(it)
                    selectedTaskId = null
                },
            )
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
    onCancelTitleEdit: (String) -> Unit,
    onToggleCompleted: (String) -> Unit,
    onOpenDetails: (String) -> Unit,
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
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            NudgeSectionLabel(text = "ONE-TIME CHECKLIST")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Text(
                text = "Tasks",
                style = MaterialTheme.typography.displaySmall,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Text(
                text = "Capture it, check it off, and keep moving.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        if (visibleActive.isEmpty() && visibleCompleted.isEmpty()) {
            item {
                NudgeEmptyState(
                    title = "Nothing on the checklist",
                    message = "Add one small task. You can turn it into a Main Task later.",
                    actionLabel = "Add task",
                    onAction = onAddTask,
                    icon = { Icon(Icons.Default.Add, contentDescription = null) },
                )
            }
        } else {
            items(visibleActive, key = { it.task.id }) { node ->
                TaskNodeCard(
                    node = node,
                    editingTaskId = state.editingTaskId,
                    showDueShorthand = state.showDueShorthand,
                    hideCompleted = state.hideCompleted,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onCancelTitleEdit = onCancelTitleEdit,
                    onToggleCompleted = onToggleCompleted,
                    onOpenDetails = onOpenDetails,
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
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    NudgeSectionLabel(text = "COMPLETED")
                    TextButton(onClick = onToggleCompletedVisibility) {
                        Text(
                            if (state.hideCompleted) {
                                "Show completed (${state.completedNodes.size})"
                            } else {
                                "Hide completed"
                            },
                        )
                    }
                }
            }

            items(visibleCompleted, key = { "completed-${it.task.id}" }) { node ->
                TaskNodeCard(
                    node = node,
                    editingTaskId = state.editingTaskId,
                    showDueShorthand = state.showDueShorthand,
                    hideCompleted = false,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onCancelTitleEdit = onCancelTitleEdit,
                    onToggleCompleted = onToggleCompleted,
                    onOpenDetails = onOpenDetails,
                    onMoveUp = onMoveUp,
                    onMoveDown = onMoveDown,
                    onIndent = onIndent,
                    onUnindent = onUnindent,
                )
            }
        }

        item {
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
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
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
