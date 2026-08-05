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
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
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
import com.arrow2851.nudge.ui.checklist.ChecklistSelectionBar
import com.arrow2851.nudge.ui.checklist.ChecklistSelectionMode
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
    var selectionMode by rememberSaveable { mutableStateOf(ChecklistSelectionMode.None) }
    var selectedTaskIds by rememberSaveable { mutableStateOf(emptyList<String>()) }
    var showDatePicker by rememberSaveable { mutableStateOf(false) }

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
            val allTasks = current.nodes.flatMap { node -> listOf(node.task) + node.subtasks }
            val selectableIds = when (selectionMode) {
                ChecklistSelectionMode.Metadata -> allTasks.map(Task::id)
                ChecklistSelectionMode.Delete -> allTasks
                    .filter { it.completedAt != null }
                    .map(Task::id)
                ChecklistSelectionMode.None -> emptyList()
            }

            LaunchedEffect(selectionMode, allTasks) {
                selectedTaskIds = selectedTaskIds.filter { it in selectableIds }
            }

            TasksContent(
                state = current,
                selectionMode = selectionMode,
                selectedTaskIds = selectedTaskIds.toSet(),
                onToggleSelection = { taskId ->
                    selectedTaskIds = selectedTaskIds.toggle(taskId)
                },
                onStartDateSelection = {
                    selectionMode = ChecklistSelectionMode.Metadata
                    selectedTaskIds = emptyList()
                },
                onStartDeleteSelection = {
                    selectionMode = ChecklistSelectionMode.Delete
                    selectedTaskIds = emptyList()
                },
                onSelectAll = { selectedTaskIds = selectableIds.distinct() },
                onApplySelection = {
                    when (selectionMode) {
                        ChecklistSelectionMode.Metadata -> showDatePicker = true
                        ChecklistSelectionMode.Delete -> {
                            viewModel.archiveTasks(selectedTaskIds.toSet())
                            selectionMode = ChecklistSelectionMode.None
                            selectedTaskIds = emptyList()
                        }
                        ChecklistSelectionMode.None -> Unit
                    }
                },
                onCancelSelection = {
                    selectionMode = ChecklistSelectionMode.None
                    selectedTaskIds = emptyList()
                    showDatePicker = false
                },
                onAddTask = { viewModel.createTask() },
                onAddSubtask = viewModel::createTask,
                onEditTask = viewModel::editTask,
                onFinishTitleEdit = viewModel::finishTitleEdit,
                onToggleCompleted = viewModel::toggleCompleted,
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

            if (showDatePicker && selectedTaskIds.isNotEmpty()) {
                val selectedTasks = selectedTaskIds.mapNotNull(current::findTask)
                val datePickerState = rememberDatePickerState(
                    initialSelectedDateMillis = selectedTasks
                        .mapNotNull(Task::dueAt)
                        .distinct()
                        .singleOrNull(),
                )
                DatePickerDialog(
                    onDismissRequest = { showDatePicker = false },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                viewModel.updateDueDates(
                                    selectedTaskIds.toSet(),
                                    datePickerState.selectedDateMillis,
                                )
                                showDatePicker = false
                                selectionMode = ChecklistSelectionMode.None
                                selectedTaskIds = emptyList()
                            },
                            enabled = datePickerState.selectedDateMillis != null,
                        ) {
                            Text("Set date")
                        }
                    },
                    dismissButton = {
                        Row {
                            if (selectedTasks.any { it.dueAt != null }) {
                                TextButton(
                                    onClick = {
                                        viewModel.updateDueDates(selectedTaskIds.toSet(), null)
                                        showDatePicker = false
                                        selectionMode = ChecklistSelectionMode.None
                                        selectedTaskIds = emptyList()
                                    },
                                ) {
                                    Text("Remove dates")
                                }
                            }
                            TextButton(onClick = { showDatePicker = false }) {
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
    selectionMode: ChecklistSelectionMode,
    selectedTaskIds: Set<String>,
    onToggleSelection: (String) -> Unit,
    onStartDateSelection: () -> Unit,
    onStartDeleteSelection: () -> Unit,
    onSelectAll: () -> Unit,
    onApplySelection: () -> Unit,
    onCancelSelection: () -> Unit,
    onAddTask: () -> Unit,
    onAddSubtask: (String) -> Unit,
    onEditTask: (String) -> Unit,
    onFinishTitleEdit: (String, String) -> Unit,
    onToggleCompleted: (String) -> Unit,
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
    val completedCount = state.nodes.sumOf { node ->
        listOf(node.task).plus(node.subtasks).count { it.completedAt != null }
    }

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
            ChecklistSelectionBar(
                mode = selectionMode,
                metadataActionLabel = "Set date",
                checkedCount = completedCount,
                selectedCount = selectedTaskIds.size,
                hideChecked = state.hideCompleted,
                onStartMetadata = onStartDateSelection,
                onStartDelete = onStartDeleteSelection,
                onSelectAll = onSelectAll,
                onApply = onApplySelection,
                onCancel = onCancelSelection,
                onToggleCheckedVisibility = onToggleCompletedVisibility,
            )
            Spacer(Modifier.height(4.dp))
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
                    selectionMode = selectionMode,
                    selectedTaskIds = selectedTaskIds,
                    onSelectionChange = onToggleSelection,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onToggleCompleted = onToggleCompleted,
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
                NudgeSectionLabel(
                    text = if (state.hideCompleted) {
                        "COMPLETED · $completedCount HIDDEN"
                    } else {
                        "COMPLETED"
                    },
                )
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
                    selectionMode = selectionMode,
                    selectedTaskIds = selectedTaskIds,
                    onSelectionChange = onToggleSelection,
                    onAddSubtask = onAddSubtask,
                    onEditTask = onEditTask,
                    onFinishTitleEdit = onFinishTitleEdit,
                    onToggleCompleted = onToggleCompleted,
                    onDelete = onDelete,
                    onReorder = onReorder,
                    onMoveUp = onMoveUp,
                    onMoveDown = onMoveDown,
                    onIndent = onIndent,
                    onUnindent = onUnindent,
                )
            }
        }

        if (selectionMode == ChecklistSelectionMode.None) {
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

private fun List<String>.toggle(value: String): List<String> =
    if (value in this) filterNot { it == value } else this + value
