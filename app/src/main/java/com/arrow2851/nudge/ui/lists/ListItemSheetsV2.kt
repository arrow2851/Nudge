package com.arrow2851.nudge.ui.lists

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.ui.checklist.InlineAutocompleteField
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@Composable
internal fun AddListItemSheetV2(
    visible: Boolean,
    parentItem: ListItem? = null,
    suggestions: List<ListCatalogItem>,
    onQueryChange: (String) -> Unit,
    onDismiss: () -> Unit,
    onSave: (String, String?, String?) -> Unit,
) {
    var name by remember(visible, parentItem?.id) { mutableStateOf("") }
    var quantity by remember(visible, parentItem?.id) { mutableStateOf("") }
    var selectedCatalogId by remember(visible, parentItem?.id) { mutableStateOf<String?>(null) }

    LaunchedEffect(name, visible) {
        if (visible) onQueryChange(name)
    }

    val suggestion = suggestions.firstOrNull { candidate ->
        name.isNotBlank() && candidate.displayName.startsWith(name, ignoreCase = true)
    }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text(
            text = if (parentItem == null) "Add Item" else "Add Subitem",
            style = MaterialTheme.typography.headlineMedium,
        )
        parentItem?.let {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            Text(
                text = "Under ${it.name}",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .testTag("list-item-name-field"),
        ) {
            Text(
                text = "Item name",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x1))
            InlineAutocompleteField(
                value = name,
                suggestion = suggestion?.displayName,
                onValueChange = {
                    name = it
                    selectedCatalogId = null
                },
                onSuggestionAccepted = { accepted ->
                    name = accepted
                    quantity = suggestion?.defaultQuantity.orEmpty()
                    selectedCatalogId = suggestion?.id
                },
                inputTestTag = "list-item-name-input",
                placeholder = "What belongs on the list?",
            )
            if (suggestion != null) {
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x1))
                Text(
                    text = "Swipe right across the name to accept the gray hint",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        NudgeTextField(
            value = quantity,
            onValueChange = { quantity = it },
            label = "Quantity or note",
            placeholder = "Optional — 2, large, 12 oz…",
            modifier = Modifier.testTag("list-item-quantity-field"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = "Add Item",
            onClick = {
                onSave(
                    name.trim(),
                    quantity.trim().ifEmpty { null },
                    selectedCatalogId,
                )
            },
            enabled = name.isNotBlank(),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("save-list-item"),
        )
    }
}

@Composable
internal fun ListItemNoteSheetV2(
    item: ListItem?,
    onDismiss: () -> Unit,
    onSave: (String?) -> Unit,
) {
    var value by remember(item?.id, item?.updatedAt) { mutableStateOf(item?.quantity.orEmpty()) }

    NudgeBottomSheet(visible = item != null, onDismiss = onDismiss) {
        item ?: return@NudgeBottomSheet
        Text("Quantity or note", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = item.name,
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = value,
            onValueChange = { value = it },
            label = "Quantity or note",
            placeholder = "2, large, 12 oz, buy the low-sodium one…",
            modifier = Modifier.testTag("list-item-note-editor"),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = "Save",
            onClick = { onSave(value.trim().ifEmpty { null }) },
            modifier = Modifier.fillMaxWidth(),
        )
        if (item.quantity != null) {
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            NudgeButton(
                text = "Remove note",
                onClick = { onSave(null) },
                modifier = Modifier.fillMaxWidth(),
                style = NudgeButtonStyle.Text,
            )
        }
    }
}
