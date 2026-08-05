package com.arrow2851.nudge.ui.checklist

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.AnimationVector1D
import androidx.compose.animation.core.spring
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import com.arrow2851.nudge.core.model.ItemHandedness
import kotlinx.coroutines.launch

enum class ChecklistSelectionMode {
    None,
    Metadata,
    Delete,
}

data class ChecklistSuggestion(
    val id: String,
    val label: String,
)

@Composable
fun ChecklistRow(
    id: String,
    title: String,
    checked: Boolean,
    handedness: ItemHandedness,
    modifier: Modifier = Modifier,
    checkboxTestTag: String = "checklist-checkbox-$id",
    metadata: String? = null,
    editing: Boolean = false,
    indented: Boolean = false,
    expanded: Boolean = false,
    hasChildren: Boolean = false,
    selectionMode: ChecklistSelectionMode = ChecklistSelectionMode.None,
    selected: Boolean = false,
    suggestions: List<ChecklistSuggestion> = emptyList(),
    canMovePrevious: Boolean = false,
    canMoveNext: Boolean = false,
    onTitleClick: () -> Unit,
    onTitleCommitted: (String) -> Unit,
    onTitleDraftChanged: (String) -> Unit = {},
    onSuggestionAccepted: (ChecklistSuggestion) -> Unit = {},
    onCheckedChange: () -> Unit,
    onSelectionChange: () -> Unit = {},
    onExpandClick: (() -> Unit)? = null,
    onDelete: () -> Unit,
    onMovePrevious: () -> Unit,
    onMoveNext: () -> Unit,
) {
    var titleDraft by remember(id, editing, title) { mutableStateOf(title) }
    val isRightHanded = handedness == ItemHandedness.RightHanded
    val dragOffset = remember(id) { Animatable(0f) }
    val dragging = dragOffset.value != 0f
    val isSelectable = when (selectionMode) {
        ChecklistSelectionMode.None -> false
        ChecklistSelectionMode.Metadata -> true
        ChecklistSelectionMode.Delete -> checked
    }
    val showSelectionCheckbox = selectionMode != ChecklistSelectionMode.None && isSelectable
    val showDelete = checked && selectionMode == ChecklistSelectionMode.None

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = if (indented) 24.dp else 0.dp)
            .heightIn(min = 50.dp)
            .zIndex(if (dragging) 2f else 0f)
            .graphicsLayer {
                translationY = dragOffset.value
                scaleX = if (dragging) 1.012f else 1f
                scaleY = if (dragging) 1.012f else 1f
                shadowElevation = if (dragging) 8.dp.toPx() else 0f
            }
            .wholeRowReorder(
                enabled = selectionMode == ChecklistSelectionMode.None,
                dragOffset = dragOffset,
                canMovePrevious = canMovePrevious,
                canMoveNext = canMoveNext,
                onMovePrevious = onMovePrevious,
                onMoveNext = onMoveNext,
            )
            .semantics {
                contentDescription = "Checklist item ${title.ifBlank { "New item" }}"
                customActions = buildList {
                    if (canMovePrevious) {
                        add(CustomAccessibilityAction("Move before previous item") {
                            onMovePrevious()
                            true
                        })
                    }
                    if (canMoveNext) {
                        add(CustomAccessibilityAction("Move after next item") {
                            onMoveNext()
                            true
                        })
                    }
                    if (showDelete) {
                        add(CustomAccessibilityAction("Delete item") {
                            onDelete()
                            true
                        })
                    }
                }
            },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (isRightHanded) {
            if (showDelete) {
                DeleteButton(title = title, onDelete = onDelete)
            }
            ExpandButton(
                expanded = expanded,
                hasChildren = hasChildren,
                onClick = onExpandClick,
            )
        } else {
            ChecklistCheckbox(
                checked = checked,
                selected = selected,
                selectionMode = selectionMode,
                selectable = isSelectable,
                testTag = checkboxTestTag,
                onCheckedChange = onCheckedChange,
                onSelectionChange = onSelectionChange,
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 4.dp, vertical = 2.dp),
        ) {
            if (editing) {
                BasicTextField(
                    value = titleDraft,
                    onValueChange = {
                        titleDraft = it
                        onTitleDraftChanged(it)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("checklist-title-editor-$id"),
                    singleLine = true,
                    textStyle = MaterialTheme.typography.titleMedium.copy(
                        color = MaterialTheme.colorScheme.onSurface,
                    ),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(
                        onDone = { onTitleCommitted(titleDraft) },
                    ),
                    decorationBox = { inner ->
                        if (titleDraft.isEmpty()) {
                            Text(
                                text = "Item name",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        inner()
                    },
                )
                if (suggestions.isNotEmpty()) {
                    SuggestionBubbles(
                        suggestions = suggestions,
                        onSuggestionAccepted = { suggestion ->
                            titleDraft = suggestion.label
                            onTitleDraftChanged(suggestion.label)
                            onSuggestionAccepted(suggestion)
                        },
                    )
                }
            } else {
                TextButton(
                    onClick = {
                        if (showSelectionCheckbox) onSelectionChange() else onTitleClick()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(horizontal = 2.dp, vertical = 1.dp),
                ) {
                    Text(
                        text = title.ifBlank { "New item" },
                        modifier = Modifier.fillMaxWidth(),
                        style = MaterialTheme.typography.titleMedium,
                        color = if (checked) {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        } else {
                            MaterialTheme.colorScheme.onSurface
                        },
                        textDecoration = if (checked) TextDecoration.LineThrough else null,
                    )
                }
            }

            metadata?.takeIf { it.isNotBlank() }?.let { value ->
                Text(
                    text = value,
                    modifier = Modifier.padding(horizontal = 2.dp),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        if (isRightHanded) {
            ChecklistCheckbox(
                checked = checked,
                selected = selected,
                selectionMode = selectionMode,
                selectable = isSelectable,
                testTag = checkboxTestTag,
                onCheckedChange = onCheckedChange,
                onSelectionChange = onSelectionChange,
            )
        } else {
            ExpandButton(
                expanded = expanded,
                hasChildren = hasChildren,
                onClick = onExpandClick,
            )
            if (showDelete) {
                DeleteButton(title = title, onDelete = onDelete)
            }
        }
    }
}

@Composable
fun ChecklistSelectionBar(
    mode: ChecklistSelectionMode,
    metadataActionLabel: String,
    checkedCount: Int,
    selectedCount: Int,
    hideChecked: Boolean,
    onStartMetadata: () -> Unit,
    onStartDelete: () -> Unit,
    onSelectAll: () -> Unit,
    onApply: () -> Unit,
    onCancel: () -> Unit,
    onToggleCheckedVisibility: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        when (mode) {
            ChecklistSelectionMode.None -> {
                TextButton(onClick = onStartMetadata) {
                    Text(metadataActionLabel)
                }
                if (checkedCount > 0) {
                    TextButton(onClick = onStartDelete) {
                        Text("Select to delete")
                    }
                    Spacer(Modifier.weight(1f))
                    IconButton(onClick = onToggleCheckedVisibility) {
                        Icon(
                            imageVector = if (hideChecked) {
                                Icons.Default.Visibility
                            } else {
                                Icons.Default.VisibilityOff
                            },
                            contentDescription = if (hideChecked) {
                                "Show checked items"
                            } else {
                                "Hide checked items"
                            },
                        )
                    }
                } else {
                    Spacer(Modifier.weight(1f))
                }
            }

            ChecklistSelectionMode.Metadata -> {
                Text(
                    text = "Select items",
                    style = MaterialTheme.typography.labelLarge,
                )
                Spacer(Modifier.weight(1f))
                TextButton(onClick = onSelectAll) { Text("Select all") }
                TextButton(onClick = onApply, enabled = selectedCount > 0) {
                    Text("Continue ($selectedCount)")
                }
                TextButton(onClick = onCancel) { Text("Cancel") }
            }

            ChecklistSelectionMode.Delete -> {
                Text(
                    text = "Select checked items",
                    style = MaterialTheme.typography.labelLarge,
                )
                Spacer(Modifier.weight(1f))
                TextButton(onClick = onSelectAll) { Text("Select all") }
                TextButton(onClick = onApply, enabled = selectedCount > 0) {
                    Text("Delete ($selectedCount)")
                }
                TextButton(onClick = onCancel) { Text("Cancel") }
            }
        }
    }
}

@Composable
private fun ChecklistCheckbox(
    checked: Boolean,
    selected: Boolean,
    selectionMode: ChecklistSelectionMode,
    selectable: Boolean,
    testTag: String,
    onCheckedChange: () -> Unit,
    onSelectionChange: () -> Unit,
) {
    if (selectionMode != ChecklistSelectionMode.None && selectable) {
        Checkbox(
            checked = selected,
            onCheckedChange = { onSelectionChange() },
            modifier = Modifier.testTag("selection-$testTag"),
        )
    } else {
        Checkbox(
            checked = checked,
            onCheckedChange = { onCheckedChange() },
            modifier = Modifier.testTag(testTag),
        )
    }
}

@Composable
private fun DeleteButton(title: String, onDelete: () -> Unit) {
    IconButton(
        onClick = onDelete,
        modifier = Modifier
            .size(40.dp)
            .testTag("delete-checklist-item-$title"),
    ) {
        Icon(
            imageVector = Icons.Default.DeleteOutline,
            contentDescription = "Delete ${title.ifBlank { "item" }}",
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun ExpandButton(
    expanded: Boolean,
    hasChildren: Boolean,
    onClick: (() -> Unit)?,
) {
    if (!hasChildren || onClick == null) return
    IconButton(onClick = onClick, modifier = Modifier.size(40.dp)) {
        Icon(
            imageVector = if (expanded) {
                Icons.Default.KeyboardArrowDown
            } else {
                Icons.Default.KeyboardArrowRight
            },
            contentDescription = if (expanded) "Collapse subitems" else "Expand subitems",
        )
    }
}

@Composable
private fun SuggestionBubbles(
    suggestions: List<ChecklistSuggestion>,
    onSuggestionAccepted: (ChecklistSuggestion) -> Unit,
) {
    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 6.dp),
    ) {
        items(
            items = suggestions,
            key = ChecklistSuggestion::id,
        ) { suggestion ->
            AssistChip(
                onClick = { onSuggestionAccepted(suggestion) },
                label = { Text(suggestion.label) },
                modifier = Modifier.padding(end = 6.dp),
            )
        }
    }
}

@Composable
private fun Modifier.wholeRowReorder(
    enabled: Boolean,
    dragOffset: Animatable<Float, AnimationVector1D>,
    canMovePrevious: Boolean,
    canMoveNext: Boolean,
    onMovePrevious: () -> Unit,
    onMoveNext: () -> Unit,
): Modifier {
    if (!enabled || (!canMovePrevious && !canMoveNext)) return this

    val density = LocalDensity.current
    val haptics = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val threshold = with(density) { 30.dp.toPx() }
    var accumulated by remember { mutableFloatStateOf(0f) }

    return pointerInput(canMovePrevious, canMoveNext) {
        detectDragGestures(
            onDragStart = {
                accumulated = 0f
                haptics.performHapticFeedback(HapticFeedbackType.LongPress)
            },
            onDragCancel = {
                accumulated = 0f
                scope.launch { dragOffset.animateTo(0f, spring()) }
            },
            onDragEnd = {
                accumulated = 0f
                scope.launch { dragOffset.animateTo(0f, spring()) }
            },
            onDrag = { change, dragAmount ->
                if (kotlin.math.abs(dragAmount.y) < kotlin.math.abs(dragAmount.x)) {
                    return@detectDragGestures
                }
                change.consume()
                accumulated += dragAmount.y
                scope.launch {
                    dragOffset.snapTo(
                        accumulated.coerceIn(-threshold * 1.5f, threshold * 1.5f),
                    )
                }
                when {
                    accumulated <= -threshold && canMovePrevious -> {
                        onMovePrevious()
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        accumulated = 0f
                        scope.launch { dragOffset.snapTo(0f) }
                    }

                    accumulated >= threshold && canMoveNext -> {
                        onMoveNext()
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        accumulated = 0f
                        scope.launch { dragOffset.snapTo(0f) }
                    }
                }
            },
        )
    }
}

@Composable
fun InlineAutocompleteField(
    value: String,
    suggestion: String?,
    onValueChange: (String) -> Unit,
    onSuggestionAccepted: (String) -> Unit,
    modifier: Modifier = Modifier,
    inputTestTag: String? = null,
    placeholder: String = "Item name",
    textStyle: TextStyle = MaterialTheme.typography.titleMedium,
) {
    val threshold = with(LocalDensity.current) { 64.dp.toPx() }
    var horizontalDrag by remember(value, suggestion) { mutableFloatStateOf(0f) }
    val suffix = suggestion
        ?.takeIf { it.startsWith(value, ignoreCase = true) && it.length > value.length }
        ?.drop(value.length)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .pointerInput(suggestion, value) {
                detectHorizontalDragGestures(
                    onDragCancel = { horizontalDrag = 0f },
                    onDragEnd = {
                        if (horizontalDrag >= threshold && suggestion != null) {
                            onSuggestionAccepted(suggestion)
                        }
                        horizontalDrag = 0f
                    },
                    onHorizontalDrag = { change, amount ->
                        change.consume()
                        horizontalDrag = (horizontalDrag + amount).coerceAtLeast(0f)
                    },
                )
            },
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier
                    .weight(1f)
                    .then(
                        inputTestTag?.let { Modifier.testTag(it) } ?: Modifier,
                    ),
                singleLine = true,
                textStyle = textStyle.copy(color = LocalContentColor.current),
                decorationBox = { inner ->
                    if (value.isEmpty()) {
                        Text(
                            text = placeholder,
                            style = textStyle,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    inner()
                },
            )
            suffix?.let {
                Text(
                    text = it,
                    style = textStyle,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.45f),
                )
            }
        }
    }
}
