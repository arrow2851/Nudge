package com.arrow2851.nudge.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun TaskDetailsSheet(
    task: Task?,
    isMainTask: Boolean,
    onDismiss: () -> Unit,
    onSaveTitle: (String, String) -> Unit,
    onDueDateChanged: (String, Long?) -> Unit,
    onMainTaskChanged: (String, Boolean) -> Unit,
    onAddSubtask: (String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
    onArchive: (String) -> Unit,
) {
    var title by remember(task?.id, task?.updatedAt) { mutableStateOf(task?.title.orEmpty()) }
    var showDatePicker by rememberSaveable(task?.id) { mutableStateOf(false) }

    NudgeBottomSheet(
        visible = task != null,
        onDismiss = onDismiss,
    ) {
        task ?: return@NudgeBottomSheet
        Text(
            text = if (task.parentTaskId == null) "Task details" else "Subtask details",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = title,
            onValueChange = { title = it },
            label = "Task name",
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        NudgeButton(
            text = "Save name",
            onClick = { onSaveTitle(task.id, title) },
            modifier = Modifier.fillMaxWidth(),
            enabled = title.isNotBlank(),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Due date", style = MaterialTheme.typography.titleMedium)
                Text(
                    text = task.dueAt?.let(::formatLongDate) ?: "None",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            TextButton(onClick = { showDatePicker = true }) {
                Text(if (task.dueAt == null) "Set" else "Change")
            }
            if (task.dueAt != null) {
                TextButton(onClick = { onDueDateChanged(task.id, null) }) {
                    Text("Clear")
                }
            }
        }

        if (task.parentTaskId == null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Main Task", style = MaterialTheme.typography.titleMedium)
                    Text(
                        text = "Main Tasks can contain one level of subtasks.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Switch(
                    checked = isMainTask,
                    onCheckedChange = { onMainTaskChanged(task.id, it) },
                    modifier = Modifier.testTag("main-task-switch-${task.title}"),
                )
            }
            if (isMainTask) {
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
                NudgeButton(
                    text = "Add subtask",
                    onClick = {
                        onAddSubtask(task.id)
                        onDismiss()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Tonal,
                    leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                )
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeSectionLabel(text = "POSITION")
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            NudgeButton(
                text = "Move up",
                onClick = { onMoveUp(task.id) },
                modifier = Modifier.weight(1f),
                style = NudgeButtonStyle.Outlined,
            )
            NudgeButton(
                text = "Move down",
                onClick = { onMoveDown(task.id) },
                modifier = Modifier.weight(1f),
                style = NudgeButtonStyle.Outlined,
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        NudgeButton(
            text = if (task.parentTaskId == null) "Indent under previous task" else "Make regular task",
            onClick = {
                if (task.parentTaskId == null) onIndent(task.id) else onUnindent(task.id)
                onDismiss()
            },
            modifier = Modifier.fillMaxWidth(),
            style = NudgeButtonStyle.Outlined,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = "Delete task",
            onClick = { onArchive(task.id) },
            modifier = Modifier.fillMaxWidth(),
            style = NudgeButtonStyle.Text,
            leadingIcon = { Icon(Icons.Default.Delete, contentDescription = null) },
        )
    }

    if (task != null && showDatePicker) {
        val datePickerState = rememberDatePickerState(initialSelectedDateMillis = task.dueAt)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        onDueDateChanged(task.id, datePickerState.selectedDateMillis)
                        showDatePicker = false
                    },
                    enabled = datePickerState.selectedDateMillis != null,
                ) {
                    Text("Set date")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Cancel")
                }
            },
        ) {
            DatePicker(state = datePickerState)
        }
    }
}
