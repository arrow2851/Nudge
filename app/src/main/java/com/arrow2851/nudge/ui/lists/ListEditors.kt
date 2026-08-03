package com.arrow2851.nudge.ui.lists

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@Composable
internal fun ListEditorSheet(
    visible: Boolean,
    existing: ReusableList? = null,
    onDismiss: () -> Unit,
    onSave: (String, Boolean) -> Unit,
    onMoveUp: (() -> Unit)? = null,
    onMoveDown: (() -> Unit)? = null,
    onArchive: (() -> Unit)? = null,
) {
    var name by remember(visible, existing?.updatedAt) { mutableStateOf(existing?.name.orEmpty()) }
    var reusable by remember(visible, existing?.updatedAt) {
        mutableStateOf(existing?.isReusable ?: true)
    }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = if (existing == null) "Add List" else "List Details",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = name,
            onValueChange = { name = it },
            label = "List name",
            placeholder = "Groceries, Packing, Hardware…",
            modifier = Modifier.testTag("list-name-field"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Reusable list", style = MaterialTheme.typography.titleMedium)
                Text(
                    "Remember checked items as suggestions for future trips.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Switch(
                checked = reusable,
                onCheckedChange = { reusable = it },
                modifier = Modifier.testTag("reusable-list-switch"),
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = if (existing == null) "Add List" else "Save List",
            onClick = { onSave(name.trim(), reusable) },
            enabled = name.isNotBlank(),
            modifier = Modifier.fillMaxWidth().testTag("save-list"),
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
            if (onArchive != null) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Archive List",
                    onClick = onArchive,
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Text,
                )
            }
        }
    }
}

@Composable
internal fun ListItemEditorSheet(
    visible: Boolean,
    existing: ListItem? = null,
    parentItem: ListItem? = null,
    suggestions: List<ListCatalogItem>,
    onQueryChange: (String) -> Unit,
    onDismiss: () -> Unit,
    onSave: (String, String?, String?) -> Unit,
    onMoveUp: (() -> Unit)? = null,
    onMoveDown: (() -> Unit)? = null,
    onIndent: (() -> Unit)? = null,
    onUnindent: (() -> Unit)? = null,
    onAddSubitem: (() -> Unit)? = null,
    onArchive: (() -> Unit)? = null,
) {
    var name by remember(visible, existing?.updatedAt, parentItem?.id) {
        mutableStateOf(existing?.name.orEmpty())
    }
    var quantity by remember(visible, existing?.updatedAt, parentItem?.id) {
        mutableStateOf(existing?.quantity.orEmpty())
    }
    var selectedCatalogId by remember(visible, existing?.updatedAt, parentItem?.id) {
        mutableStateOf(existing?.catalogItemId)
    }

    LaunchedEffect(name, visible) {
        if (visible) onQueryChange(name)
    }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = when {
                existing != null -> "Item Details"
                parentItem != null -> "Add Subitem"
                else -> "Add Item"
            },
            style = MaterialTheme.typography.headlineMedium,
        )
        if (parentItem != null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Text(
                "Under ${parentItem.name}",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = name,
            onValueChange = {
                name = it
                selectedCatalogId = null
            },
            label = "Item name",
            placeholder = "What belongs on the list?",
            modifier = Modifier.testTag("list-item-name-field"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        NudgeTextField(
            value = quantity,
            onValueChange = { quantity = it },
            label = "Quantity or note",
            placeholder = "Optional — 2, large, 12 oz…",
            modifier = Modifier.testTag("list-item-quantity-field"),
        )

        if (existing == null && suggestions.isNotEmpty()) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
            NudgeSectionLabel("SUGGESTIONS")
            suggestions.take(6).forEach { suggestion ->
                TextButton(
                    onClick = {
                        name = suggestion.displayName
                        quantity = suggestion.defaultQuantity.orEmpty()
                        selectedCatalogId = suggestion.id
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("list-suggestion-${suggestion.normalizedName}"),
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(suggestion.displayName)
                        val detail = listOfNotNull(
                            suggestion.defaultQuantity,
                            suggestion.timesUsed.takeIf { it > 0 }?.let { "$it uses" },
                        ).joinToString(" · ")
                        if (detail.isNotEmpty()) {
                            Text(
                                detail,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = if (existing == null) "Add Item" else "Save Item",
            onClick = {
                onSave(
                    name.trim(),
                    quantity.trim().ifEmpty { null },
                    selectedCatalogId,
                )
            },
            enabled = name.isNotBlank(),
            modifier = Modifier.fillMaxWidth().testTag("save-list-item"),
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
            if (onIndent != null || onUnindent != null) {
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (onIndent != null) {
                        NudgeButton(
                            text = "Make subitem",
                            onClick = onIndent,
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Outlined,
                        )
                    }
                    if (onUnindent != null) {
                        NudgeButton(
                            text = "Move to top level",
                            onClick = onUnindent,
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Outlined,
                        )
                    }
                }
            }
            if (onAddSubitem != null && existing.parentItemId == null) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Add subitem",
                    onClick = onAddSubitem,
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Outlined,
                )
            }
            if (onArchive != null) {
                Spacer(Modifier.height(8.dp))
                NudgeButton(
                    text = "Remove Item",
                    onClick = onArchive,
                    modifier = Modifier.fillMaxWidth(),
                    style = NudgeButtonStyle.Text,
                )
            }
        }
    }
}
