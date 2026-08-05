package com.arrow2851.nudge.ui.tasks

import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.ui.checklist.ChecklistRow
import com.arrow2851.nudge.ui.checklist.ChecklistSelectionMode

@Composable
internal fun TaskNodeCard(
    node: TaskNode,
    previousRootId: String?,
    nextRootId: String?,
    editingTaskId: String?,
    showDueShorthand: Boolean,
    hideCompleted: Boolean,
    handedness: ItemHandedness,
    selectionMode: ChecklistSelectionMode,
    selectedTaskIds: Set<String>,
    onSelectionChange: (String) -> Unit,
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
) {
    val hasChildren = node.subtasks.isNotEmpty()
    var expanded by rememberSaveable(node.task.id) { mutableStateOf(hasChildren) }

    LaunchedEffect(hasChildren) {
        expanded = hasChildren
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        if (hasChildren) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 48.dp, end = 44.dp, top = 4.dp, bottom = 2.dp),
            ) {
                Text(
                    text = "${node.completedSubtaskCount}/${node.subtasks.size}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.width(8.dp))
                LinearProgressIndicator(
                    progress = { node.subtaskProgress },
                    modifier = Modifier
                        .weight(1f)
                        .height(3.dp),
                )
            }
        }

        TaskChecklistRow(
            task = node.task,
            previousId = previousRootId,
            nextId = nextRootId,
            editing = editingTaskId == node.task.id,
            showDueShorthand = showDueShorthand,
            handedness = handedness,
            expanded = expanded,
            hasChildren = hasChildren,
            selectionMode = selectionMode,
            selected = node.task.id in selectedTaskIds,
            onSelectionChange = onSelectionChange,
            onExpand = { expanded = !expanded },
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

        if (hasChildren && expanded) {
            val visibleSubtasks = if (hideCompleted) {
                node.subtasks.filter { it.completedAt == null }
            } else {
                node.subtasks
            }
            visibleSubtasks.forEachIndexed { index, subtask ->
                HorizontalDivider(
                    modifier = Modifier.padding(start = 62.dp),
                    color = MaterialTheme.colorScheme.outlineVariant,
                )
                TaskChecklistRow(
                    task = subtask,
                    previousId = visibleSubtasks.getOrNull(index - 1)?.id,
                    nextId = visibleSubtasks.getOrNull(index + 1)?.id,
                    editing = editingTaskId == subtask.id,
                    showDueShorthand = showDueShorthand,
                    handedness = handedness,
                    indented = true,
                    expanded = false,
                    hasChildren = false,
                    selectionMode = selectionMode,
                    selected = subtask.id in selectedTaskIds,
                    onSelectionChange = onSelectionChange,
                    onExpand = {},
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
            TextButton(
                onClick = { onAddSubtask(node.task.id) },
                modifier = Modifier.padding(start = 54.dp),
                enabled = selectionMode == ChecklistSelectionMode.None,
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(Modifier.width(4.dp))
                Text("Add subtask")
            }
        }
        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
    }
}

@Composable
private fun TaskChecklistRow(
    task: Task,
    previousId: String?,
    nextId: String?,
    editing: Boolean,
    showDueShorthand: Boolean,
    handedness: ItemHandedness,
    indented: Boolean = false,
    expanded: Boolean,
    hasChildren: Boolean,
    selectionMode: ChecklistSelectionMode,
    selected: Boolean,
    onSelectionChange: (String) -> Unit,
    onExpand: () -> Unit,
    onEditTask: (String) -> Unit,
    onFinishTitleEdit: (String, String) -> Unit,
    onToggleCompleted: (String) -> Unit,
    onDelete: (String) -> Unit,
    onReorder: (String, String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
) {
    ChecklistRow(
        id = task.id,
        title = task.title,
        checked = task.completedAt != null,
        handedness = handedness,
        modifier = Modifier.taskSwipeActions(
            taskId = task.id,
            enabled = selectionMode == ChecklistSelectionMode.None,
            canIndent = task.parentTaskId == null,
            canUnindent = task.parentTaskId != null,
            onIndent = { onIndent(task.id) },
            onUnindent = { onUnindent(task.id) },
        ),
        checkboxTestTag = "task-checkbox-${task.title}",
        metadata = if (showDueShorthand) task.dueAt?.let(::formatDueShorthand) else {
            task.dueAt?.let(::formatLongDate)
        },
        editing = editing,
        indented = indented,
        expanded = expanded,
        hasChildren = hasChildren,
        selectionMode = selectionMode,
        selected = selected,
        canMovePrevious = previousId != null,
        canMoveNext = nextId != null,
        onTitleClick = { onEditTask(task.id) },
        onTitleCommitted = { onFinishTitleEdit(task.id, it) },
        onCheckedChange = { onToggleCompleted(task.id) },
        onSelectionChange = { onSelectionChange(task.id) },
        onExpandClick = onExpand,
        onDelete = { onDelete(task.id) },
        onMovePrevious = {
            previousId?.let { onReorder(task.id, it) } ?: onMoveUp(task.id)
        },
        onMoveNext = {
            nextId?.let { onReorder(task.id, it) } ?: onMoveDown(task.id)
        },
    )
}

@Composable
internal fun Modifier.taskSwipeActions(
    taskId: String,
    enabled: Boolean,
    canIndent: Boolean,
    canUnindent: Boolean,
    onIndent: () -> Unit,
    onUnindent: () -> Unit,
): Modifier {
    if (!enabled) return this
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
