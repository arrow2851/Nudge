package com.arrow2851.nudge.ui.tasks

import androidx.compose.foundation.gestures.detectDragGesturesAfterLongPress
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Checkbox
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.theme.NudgeTouchTarget

@Composable
internal fun TaskNodeCard(
    node: TaskNode,
    editingTaskId: String?,
    showDueShorthand: Boolean,
    hideCompleted: Boolean,
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
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top,
    ) {
        NudgeCard(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(vertical = 4.dp),
        ) {
            if (node.isMainTask && node.subtasks.isNotEmpty()) {
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = "${node.completedSubtaskCount}/${node.subtasks.size} complete",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(
                            text = "Main Task",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                        )
                    }
                    Spacer(Modifier.height(6.dp))
                    LinearProgressIndicator(
                        progress = { node.subtaskProgress },
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }

            TaskRow(
                task = node.task,
                isEditing = editingTaskId == node.task.id,
                showDueShorthand = showDueShorthand,
                canIndent = true,
                canUnindent = false,
                onEdit = { onEditTask(node.task.id) },
                onFinishTitleEdit = { onFinishTitleEdit(node.task.id, it) },
                onCancelTitleEdit = { onCancelTitleEdit(node.task.id) },
                onToggleCompleted = { onToggleCompleted(node.task.id) },
                onOpenDetails = { onOpenDetails(node.task.id) },
                onMoveUp = { onMoveUp(node.task.id) },
                onMoveDown = { onMoveDown(node.task.id) },
                onIndent = { onIndent(node.task.id) },
                onUnindent = {},
            )

            val visibleSubtasks = if (hideCompleted) {
                node.subtasks.filter { it.completedAt == null }
            } else {
                node.subtasks
            }
            visibleSubtasks.forEach { subtask ->
                HorizontalDivider(
                    modifier = Modifier.padding(start = 64.dp),
                    color = MaterialTheme.colorScheme.outlineVariant,
                )
                TaskRow(
                    task = subtask,
                    modifier = Modifier.padding(start = 24.dp),
                    isEditing = editingTaskId == subtask.id,
                    showDueShorthand = showDueShorthand,
                    canIndent = false,
                    canUnindent = true,
                    onEdit = { onEditTask(subtask.id) },
                    onFinishTitleEdit = { onFinishTitleEdit(subtask.id, it) },
                    onCancelTitleEdit = { onCancelTitleEdit(subtask.id) },
                    onToggleCompleted = { onToggleCompleted(subtask.id) },
                    onOpenDetails = { onOpenDetails(subtask.id) },
                    onMoveUp = { onMoveUp(subtask.id) },
                    onMoveDown = { onMoveDown(subtask.id) },
                    onIndent = {},
                    onUnindent = { onUnindent(subtask.id) },
                )
            }
        }

        if (node.isMainTask) {
            Spacer(Modifier.width(8.dp))
            IconButton(
                onClick = { onAddSubtask(node.task.id) },
                modifier = Modifier
                    .size(NudgeTouchTarget.Minimum)
                    .testTag("add-subtask-${node.task.id}"),
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add subtask to ${node.task.title.ifBlank { "task" }}",
                )
            }
        }
    }
}

@Composable
internal fun TaskRow(
    task: Task,
    modifier: Modifier = Modifier,
    isEditing: Boolean,
    showDueShorthand: Boolean,
    canIndent: Boolean,
    canUnindent: Boolean,
    onEdit: () -> Unit,
    onFinishTitleEdit: (String) -> Unit,
    onCancelTitleEdit: () -> Unit,
    onToggleCompleted: () -> Unit,
    onOpenDetails: () -> Unit,
    onMoveUp: () -> Unit,
    onMoveDown: () -> Unit,
    onIndent: () -> Unit,
    onUnindent: () -> Unit,
) {
    var titleDraft by remember(task.id, isEditing, task.title) { mutableStateOf(task.title) }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .taskSwipeActions(
                taskId = task.id,
                canIndent = canIndent,
                canUnindent = canUnindent,
                onIndent = onIndent,
                onUnindent = onUnindent,
            )
            .semantics {
                contentDescription = "Task ${task.title.ifBlank { "New task" }}"
                customActions = buildList {
                    add(CustomAccessibilityAction("Move up") { onMoveUp(); true })
                    add(CustomAccessibilityAction("Move down") { onMoveDown(); true })
                    if (canIndent) {
                        add(CustomAccessibilityAction("Indent as subtask") { onIndent(); true })
                    }
                    if (canUnindent) {
                        add(CustomAccessibilityAction("Unindent task") { onUnindent(); true })
                    }
                }
            }
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        ReorderHandle(onMoveUp = onMoveUp, onMoveDown = onMoveDown)
        Checkbox(
            checked = task.completedAt != null,
            onCheckedChange = { onToggleCompleted() },
            modifier = Modifier.testTag("task-checkbox-${task.title.ifBlank { task.id }}"),
        )
        Spacer(Modifier.width(4.dp))

        if (isEditing) {
            BasicTextField(
                value = titleDraft,
                onValueChange = { titleDraft = it },
                modifier = Modifier
                    .weight(1f)
                    .testTag("task-title-editor-${task.id}"),
                singleLine = true,
                textStyle = MaterialTheme.typography.titleMedium.copy(
                    color = MaterialTheme.colorScheme.onSurface,
                ),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(
                    onDone = { onFinishTitleEdit(titleDraft) },
                ),
                decorationBox = { inner ->
                    if (titleDraft.isEmpty()) {
                        Text(
                            text = "Task name",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    inner()
                },
            )
        } else {
            TextButton(
                onClick = onEdit,
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(horizontal = 4.dp, vertical = 8.dp),
            ) {
                Text(
                    text = task.title.ifBlank { "New task" },
                    modifier = Modifier.fillMaxWidth(),
                    style = MaterialTheme.typography.titleMedium,
                    color = if (task.completedAt == null) {
                        MaterialTheme.colorScheme.onSurface
                    } else {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    },
                    textDecoration = if (task.completedAt == null) null else TextDecoration.LineThrough,
                )
            }
        }

        if (showDueShorthand && task.dueAt != null) {
            Text(
                text = formatDueShorthand(task.dueAt),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.width(4.dp))
        }

        IconButton(
            onClick = onOpenDetails,
            modifier = Modifier
                .size(NudgeTouchTarget.Minimum)
                .testTag("task-details-${task.title.ifBlank { task.id }}"),
        ) {
            Text(text = "›", style = MaterialTheme.typography.headlineMedium)
        }
    }
}

@Composable
internal fun ReorderHandle(
    onMoveUp: () -> Unit,
    onMoveDown: () -> Unit,
) {
    val threshold = with(LocalDensity.current) { 48.dp.toPx() }
    var accumulated by remember { mutableFloatStateOf(0f) }

    Box(
        modifier = Modifier
            .size(NudgeTouchTarget.Minimum)
            .semantics { contentDescription = "Hold and drag to reorder" }
            .pointerInput(onMoveUp, onMoveDown) {
                detectDragGesturesAfterLongPress(
                    onDragStart = { accumulated = 0f },
                    onDragCancel = { accumulated = 0f },
                    onDragEnd = { accumulated = 0f },
                    onDrag = { change, dragAmount ->
                        change.consume()
                        accumulated += dragAmount.y
                        if (accumulated > threshold) {
                            onMoveDown()
                            accumulated = 0f
                        } else if (accumulated < -threshold) {
                            onMoveUp()
                            accumulated = 0f
                        }
                    },
                )
            },
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = "≡",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
internal fun Modifier.taskSwipeActions(
    taskId: String,
    canIndent: Boolean,
    canUnindent: Boolean,
    onIndent: () -> Unit,
    onUnindent: () -> Unit,
): Modifier {
    val threshold = with(LocalDensity.current) { 72.dp.toPx() }
    var offset by remember(taskId) { mutableFloatStateOf(0f) }

    return graphicsLayer { translationX = offset }
        .pointerInput(taskId, canIndent, canUnindent) {
            detectHorizontalDragGestures(
                onDragCancel = { offset = 0f },
                onDragEnd = {
                    when {
                        offset >= threshold && canIndent -> onIndent()
                        offset <= -threshold && canUnindent -> onUnindent()
                    }
                    offset = 0f
                },
                onHorizontalDrag = { change, amount ->
                    change.consume()
                    offset = (offset + amount).coerceIn(-threshold * 1.5f, threshold * 1.5f)
                },
            )
        }
}
