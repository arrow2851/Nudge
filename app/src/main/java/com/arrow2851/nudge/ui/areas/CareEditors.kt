package com.arrow2851.nudge.ui.areas

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
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
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@Composable
internal fun AreaEditorSheet(
    visible: Boolean,
    existingName: String? = null,
    onDismiss: () -> Unit,
    onSave: (String, AreaTemplateKind?) -> Unit,
    onArchive: (() -> Unit)? = null,
) {
    var name by remember(visible, existingName) { mutableStateOf(existingName.orEmpty()) }
    var template by remember(visible) { mutableStateOf<AreaTemplateKind?>(null) }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = if (existingName == null) "Add Area" else "Edit Area",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = name,
            onValueChange = { name = it },
            label = "Area name",
            placeholder = "House, Car, Office…",
            modifier = Modifier.testTag("area-name-field"),
        )
        if (existingName == null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
            NudgeSectionLabel("STARTING POINT")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            ChoiceButton(
                text = "Start empty",
                selected = template == null,
                onClick = { template = null },
            )
            Spacer(Modifier.height(8.dp))
            ChoiceButton(
                text = "House template",
                selected = template == AreaTemplateKind.House,
                onClick = {
                    template = AreaTemplateKind.House
                    if (name.isBlank()) name = "House"
                },
                testTag = "house-template-choice",
            )
            Spacer(Modifier.height(8.dp))
            ChoiceButton(
                text = "Car template",
                selected = template == AreaTemplateKind.Car,
                onClick = {
                    template = AreaTemplateKind.Car
                    if (name.isBlank()) name = "Car"
                },
                testTag = "car-template-choice",
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = if (existingName == null) "Add Area" else "Save Area",
            onClick = { onSave(name.trim(), template) },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("save-area"),
            enabled = name.isNotBlank(),
        )
        if (onArchive != null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            NudgeButton(
                text = "Archive Area",
                onClick = onArchive,
                modifier = Modifier.fillMaxWidth(),
                style = NudgeButtonStyle.Text,
            )
        }
    }
}

@Composable
internal fun SectionEditorSheet(
    visible: Boolean,
    existingName: String? = null,
    onDismiss: () -> Unit,
    onSave: (String) -> Unit,
    onArchive: (() -> Unit)? = null,
) {
    var name by remember(visible, existingName) { mutableStateOf(existingName.orEmpty()) }
    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = if (existingName == null) "Add Section" else "Edit Section",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = name,
            onValueChange = { name = it },
            label = "Section name",
            placeholder = "Kitchen, Bathroom, Maintenance…",
            modifier = Modifier.testTag("section-name-field"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = if (existingName == null) "Add Section" else "Save Section",
            onClick = { onSave(name.trim()) },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("save-section"),
            enabled = name.isNotBlank(),
        )
        if (onArchive != null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            NudgeButton(
                text = "Archive Section",
                onClick = onArchive,
                modifier = Modifier.fillMaxWidth(),
                style = NudgeButtonStyle.Text,
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun ChoreEditorSheet(
    visible: Boolean,
    initial: ChoreDraft?,
    existing: ChoreWithSchedule?,
    sections: List<Section>,
    onDismiss: () -> Unit,
    onSave: (ChoreDraft) -> Unit,
    onPause: ((Boolean) -> Unit)? = null,
    onSkip: (() -> Unit)? = null,
    onMoveUp: (() -> Unit)? = null,
    onMoveDown: (() -> Unit)? = null,
    onArchive: (() -> Unit)? = null,
) {
    val base = initial ?: return
    var draft by remember(visible, initial, existing?.chore?.updatedAt) { mutableStateOf(base) }
    var showDatePicker by rememberSaveable(visible) { mutableStateOf(false) }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = if (existing == null) "Add Chore" else "Chore Details",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = draft.title,
            onValueChange = { draft = draft.copy(title = it) },
            label = "Chore name",
            placeholder = "What repeats?",
            modifier = Modifier.testTag("chore-name-field"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        NudgeTextField(
            value = draft.description,
            onValueChange = { draft = draft.copy(description = it) },
            label = "Notes",
            placeholder = "Optional",
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeSectionLabel("SECTION")
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        ChoiceButton(
            text = "General Area",
            selected = draft.sectionId == null,
            onClick = { draft = draft.copy(sectionId = null) },
        )
        sections.forEach { section ->
            Spacer(Modifier.height(6.dp))
            ChoiceButton(
                text = section.name,
                selected = draft.sectionId == section.id,
                onClick = { draft = draft.copy(sectionId = section.id) },
                testTag = "section-choice-${section.name}",
            )
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeSectionLabel("REPEAT")
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        RepeatChoice("As needed", draft.recurrenceType == RecurrenceType.WhenNeeded) {
            draft = draft.copy(recurrenceType = RecurrenceType.WhenNeeded, firstDueAt = null)
        }
        RepeatChoice(
            "Daily",
            draft.recurrenceType == RecurrenceType.Interval &&
                draft.intervalValue == 1 && draft.intervalUnit == RecurrenceUnit.Days,
        ) {
            draft = draft.copy(
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 1,
                intervalUnit = RecurrenceUnit.Days,
            )
        }
        RepeatChoice("Weekly", draft.recurrenceType == RecurrenceType.Weekly) {
            draft = draft.copy(recurrenceType = RecurrenceType.Weekly)
        }
        RepeatChoice("Monthly", draft.recurrenceType == RecurrenceType.Monthly) {
            draft = draft.copy(recurrenceType = RecurrenceType.Monthly)
        }
        RepeatChoice(
            "Every ${draft.intervalValue.coerceAtLeast(1)} ${draft.intervalUnit.name.lowercase()}",
            draft.recurrenceType == RecurrenceType.Custom,
        ) {
            draft = draft.copy(recurrenceType = RecurrenceType.Custom)
        }
        if (draft.recurrenceType == RecurrenceType.Custom) {
            Spacer(Modifier.height(8.dp))
            NudgeTextField(
                value = draft.intervalValue.toString(),
                onValueChange = { value ->
                    draft = draft.copy(intervalValue = value.toIntOrNull()?.coerceAtLeast(1) ?: 1)
                },
                label = "Repeat every",
            )
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RecurrenceUnit.entries.forEach { unit ->
                    TextButton(onClick = { draft = draft.copy(intervalUnit = unit) }) {
                        Text(
                            text = unit.name,
                            color = if (draft.intervalUnit == unit) {
                                MaterialTheme.colorScheme.primary
                            } else {
                                MaterialTheme.colorScheme.onSurfaceVariant
                            },
                        )
                    }
                }
            }
        }

        if (draft.recurrenceType != RecurrenceType.WhenNeeded) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("First due", style = MaterialTheme.typography.titleMedium)
                    Text(
                        text = draft.firstDueAt?.let(::formatCareDate) ?: "Today",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                TextButton(onClick = { showDatePicker = true }) { Text("Choose") }
            }
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
            NudgeSectionLabel("SCHEDULE BASIS")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            ChoiceButton(
                text = "Calendar — keep the planned cadence",
                selected = draft.scheduleBasis == ScheduleBasis.Calendar,
                onClick = { draft = draft.copy(scheduleBasis = ScheduleBasis.Calendar) },
            )
            Spacer(Modifier.height(6.dp))
            ChoiceButton(
                text = "Completion — restart after I finish",
                selected = draft.scheduleBasis == ScheduleBasis.Completion,
                onClick = { draft = draft.copy(scheduleBasis = ScheduleBasis.Completion) },
            )
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = draft.estimatedMinutes?.toString().orEmpty(),
            onValueChange = { value -> draft = draft.copy(estimatedMinutes = value.toIntOrNull()) },
            label = "Estimated minutes",
            placeholder = "Optional",
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Completion grading", style = MaterialTheme.typography.titleMedium)
                Text(
                    "Choose Light, Moderate, or Deep when completing.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Switch(
                checked = draft.supportsGrading,
                onCheckedChange = { draft = draft.copy(supportsGrading = it) },
                modifier = Modifier.testTag("grading-switch"),
            )
        }
        if (draft.supportsGrading) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                listOf(
                    CompletionGrade.Light,
                    CompletionGrade.Moderate,
                    CompletionGrade.Deep,
                ).forEach { grade ->
                    NudgeButton(
                        text = grade.name,
                        onClick = { draft = draft.copy(defaultGrade = grade) },
                        modifier = Modifier.weight(1f),
                        style = if (draft.defaultGrade == grade) {
                            NudgeButtonStyle.Tonal
                        } else {
                            NudgeButtonStyle.Outlined
                        },
                    )
                }
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = if (existing == null) "Add Chore" else "Save Chore",
            onClick = { onSave(draft) },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("save-chore"),
            enabled = draft.title.isNotBlank(),
        )

        if (existing != null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
            NudgeSectionLabel("ACTIONS")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (onMoveUp != null) {
                    NudgeButton(
                        text = "Move up",
                        onClick = onMoveUp,
                        modifier = Modifier.weight(1f),
                        style = NudgeButtonStyle.Outlined,
                    )
                }
                if (onMoveDown != null) {
                    NudgeButton(
                        text = "Move down",
                        onClick = onMoveDown,
                        modifier = Modifier.weight(1f),
                        style = NudgeButtonStyle.Outlined,
                    )
                }
            }
            if (onPause != null) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = if (existing.chore.isPaused) "Resume Chore" else "Pause Chore",
                    onClick = { onPause(!existing.chore.isPaused) },
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Outlined,
                )
            }
            if (onSkip != null && existing.schedule?.recurrenceType != RecurrenceType.WhenNeeded) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Skip this occurrence",
                    onClick = onSkip,
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Outlined,
                )
            }
            if (onArchive != null) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Archive Chore",
                    onClick = onArchive,
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Text,
                )
            }
        }
    }

    if (visible && showDatePicker) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = draft.firstDueAt)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        draft = draft.copy(firstDueAt = pickerState.selectedDateMillis)
                        showDatePicker = false
                    },
                    enabled = pickerState.selectedDateMillis != null,
                ) { Text("Set date") }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) { Text("Cancel") }
            },
        ) {
            DatePicker(state = pickerState)
        }
    }
}

@Composable
internal fun GradeCompletionDialog(
    choreTitle: String?,
    onDismiss: () -> Unit,
    onGrade: (CompletionGrade) -> Unit,
) {
    if (choreTitle == null) return
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("How much did you do?") },
        text = {
            Column {
                Text(choreTitle)
                Spacer(Modifier.height(12.dp))
                listOf(
                    CompletionGrade.Light,
                    CompletionGrade.Moderate,
                    CompletionGrade.Deep,
                ).forEach { grade ->
                    NudgeButton(
                        text = grade.name,
                        onClick = { onGrade(grade) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("complete-${grade.name.lowercase()}"),
                        style = NudgeButtonStyle.Tonal,
                    )
                    Spacer(Modifier.height(8.dp))
                }
            }
        },
        confirmButton = {},
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
internal fun TemplateDialog(
    visible: Boolean,
    onDismiss: () -> Unit,
    onApply: (AreaTemplateKind) -> Unit,
) {
    if (!visible) return
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Use a template") },
        text = {
            Column {
                Text("Only missing Sections and chores are added. Existing setup is never duplicated.")
                Spacer(Modifier.height(16.dp))
                NudgeButton(
                    text = "Add House starter",
                    onClick = { onApply(AreaTemplateKind.House) },
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Tonal,
                )
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Add Car starter",
                    onClick = { onApply(AreaTemplateKind.Car) },
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Outlined,
                )
            }
        },
        confirmButton = {},
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
private fun ChoiceButton(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    testTag: String? = null,
) {
    NudgeButton(
        text = text,
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .then(if (testTag == null) Modifier else Modifier.testTag(testTag)),
        style = if (selected) NudgeButtonStyle.Tonal else NudgeButtonStyle.Outlined,
    )
}

@Composable
private fun RepeatChoice(text: String, selected: Boolean, onClick: () -> Unit) {
    ChoiceButton(text = text, selected = selected, onClick = onClick)
    Spacer(Modifier.height(6.dp))
}
