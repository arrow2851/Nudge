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
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.DragHandle
import androidx.compose.material.icons.filled.Notes
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

enum class ChecklistMetadataKind {
    DueDate,
    QuantityOrNote,
}

@Composable
fun ChecklistRow(
    id: String,
    title: String,
    checked: Boolean,
    handedness: ItemHandedness,
    modifier: Modifier = Modifier,
    checkboxTestTag: String = "checklist-checkbox-$id",
    metadata: String? = null,
    metadataKind: ChecklistMetadataKind? = null,
    editing: Boolean = false,
    indented: Boolean = false,
    expanded: Boolean = false,
    expandable: Boolean = false,
    canMovePrevious: Boolean = false,
    canMoveNext: Boolean = false,
    onTitleClick: () -> Unit,
    onTitleCommitted: (String) -> Unit,
    onCheckedChange: () -> Unit,
    onMetadataClick: (() -> Unit)? = null,
    onExpandClick: (() -> Unit)? = null,
    onDelete: () -> Unit,
    onMovePrevious: () -> Unit,
    onMoveNext: () -> Unit,
) {
    var titleDraft by remember(id, editing, title) { mutableStateOf(title) }
    val isRightHanded = handedness == ItemHandedness.RightHanded
    val dragOffset = remember(id) { Animatable(0f) }
    val dragging = dragOffset.value != 0f

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = if (indented) 24.dp else 0.dp)
            .heightIn(min = 52.dp)
            .zIndex(if (dragging) 2f else 0f)
            .graphicsLayer {
                translationY = dragOffset.value
                scaleX = if (dragging) 1.015f else 1f
                scaleY = if (dragging) 1.015f else 1f
                shadowElevation = if (dragging) 10.dp.toPx() else 0f
            }
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
                    add(CustomAccessibilityAction("Delete item") {
                        onDelete()
                        true
                    })
                }
            },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (isRightHanded) {
            DetailsButton(
                expanded = expanded,
                expandable = expandable,
                mirrored = true,
                onClick = onExpandClick,
            )
            MetadataButton(metadataKind, metadata, onMetadataClick)
        } else {
            ImmediateDragHandle(
                dragOffset = dragOffset,
                canMovePrevious = canMovePrevious,
                canMoveNext = canMoveNext,
                onMovePrevious = onMovePrevious,
                onMoveNext = onMoveNext,
            )
            Checkbox(
                checked = checked,
                onCheckedChange = { onCheckedChange() },
                modifier = Modifier.testTag(checkboxTestTag),
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 2.dp, vertical = 3.dp),
        ) {
            if (editing) {
                BasicTextField(
                    value = titleDraft,
                    onValueChange = { titleDraft = it },
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
            } else {
                TextButton(
                    onClick = onTitleClick,
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(horizontal = 2.dp, vertical = 2.dp),
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
            Checkbox(
                checked = checked,
                onCheckedChange = { onCheckedChange() },
                modifier = Modifier.testTag(checkboxTestTag),
            )
            ImmediateDragHandle(
                dragOffset = dragOffset,
                canMovePrevious = canMovePrevious,
                canMoveNext = canMoveNext,
                onMovePrevious = onMovePrevious,
                onMoveNext = onMoveNext,
            )
        } else {
            MetadataButton(metadataKind, metadata, onMetadataClick)
            DetailsButton(
                expanded = expanded,
                expandable = expandable,
                mirrored = false,
                onClick = onExpandClick,
            )
        }

        IconButton(
            onClick = onDelete,
            modifier = Modifier
                .size(40.dp)
                .testTag("delete-checklist-item-$id"),
        ) {
            Icon(
                imageVector = Icons.Default.DeleteOutline,
                contentDescription = "Delete ${title.ifBlank { "item" }}",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun MetadataButton(
    kind: ChecklistMetadataKind?,
    metadata: String?,
    onClick: (() -> Unit)?,
) {
    if (kind == null || onClick == null) return
    IconButton(
        onClick = onClick,
        modifier = Modifier.size(40.dp),
    ) {
        Icon(
            imageVector = when (kind) {
                ChecklistMetadataKind.DueDate -> Icons.Default.CalendarMonth
                ChecklistMetadataKind.QuantityOrNote -> Icons.Default.Notes
            },
            contentDescription = when (kind) {
                ChecklistMetadataKind.DueDate -> if (metadata == null) "Set due date" else "Change due date"
                ChecklistMetadataKind.QuantityOrNote ->
                    if (metadata == null) "Add quantity or note" else "Change quantity or note"
            },
            tint = if (metadata == null) {
                MaterialTheme.colorScheme.onSurfaceVariant
            } else {
                MaterialTheme.colorScheme.primary
            },
        )
    }
}

@Composable
private fun DetailsButton(
    expanded: Boolean,
    expandable: Boolean,
    mirrored: Boolean,
    onClick: (() -> Unit)?,
) {
    if (!expandable || onClick == null) {
        Spacer(Modifier.width(8.dp))
        return
    }
    IconButton(onClick = onClick, modifier = Modifier.size(40.dp)) {
        Icon(
            imageVector = when {
                expanded && mirrored -> Icons.Default.ChevronRight
                expanded -> Icons.Default.ChevronLeft
                mirrored -> Icons.Default.ChevronLeft
                else -> Icons.Default.ChevronRight
            },
            contentDescription = if (expanded) "Collapse subitems" else "Expand subitems",
        )
    }
}

@Composable
private fun ImmediateDragHandle(
    dragOffset: Animatable<Float, AnimationVector1D>,
    canMovePrevious: Boolean,
    canMoveNext: Boolean,
    onMovePrevious: () -> Unit,
    onMoveNext: () -> Unit,
) {
    val density = LocalDensity.current
    val haptics = LocalHapticFeedback.current
    val scope = rememberCoroutineScope()
    val threshold = with(density) { 30.dp.toPx() }
    var accumulated by remember { mutableFloatStateOf(0f) }

    Box(
        modifier = Modifier
            .size(40.dp)
            .semantics { contentDescription = "Drag to reorder" }
            .pointerInput(canMovePrevious, canMoveNext) {
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
            },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            imageVector = Icons.Default.DragHandle,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
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
                modifier = Modifier.weight(1f),
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
