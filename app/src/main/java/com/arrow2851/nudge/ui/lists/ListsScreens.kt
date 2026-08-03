package com.arrow2851.nudge.ui.lists

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Checklist
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@Composable
fun ListsOverviewScreen(
    state: ListsUiState,
    createRequest: Int,
    viewModel: ListsViewModel,
    onOpenList: (String) -> Unit,
) {
    var showEditor by rememberSaveable { mutableStateOf(false) }
    var selectedListId by rememberSaveable { mutableStateOf<String?>(null) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createRequest) {
        if (createRequest > lastHandledCreate) {
            lastHandledCreate = createRequest
            selectedListId = null
            showEditor = true
        }
    }

    when (state) {
        ListsUiState.Loading -> ListLoading()
        is ListsUiState.Error -> ListFatalError(state.message)
        is ListsUiState.Ready -> {
            val selected = selectedListId?.let(state::list)
            LazyColumn(
                modifier = Modifier.fillMaxSize().testTag("lists-overview"),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item {
                    NudgeSectionLabel("REUSABLE CHECKLISTS")
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                    Text(
                        "Reusable lists remember what matters.",
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                    Text(
                        "Check items off now, then reuse the list or bring back past items from suggestions.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                if (state.lists.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "No lists yet",
                            message = "Create a reusable list for groceries and packing, or a one-off checklist.",
                            actionLabel = "Add List",
                            onAction = { showEditor = true },
                        )
                    }
                } else {
                    items(state.lists, key = { it.list.id }) { overview ->
                        NudgeCard(
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("list-card-${overview.list.name}"),
                            onClick = { onOpenList(overview.list.id) },
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    if (overview.list.isReusable) Icons.Default.Refresh else Icons.Default.Checklist,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                )
                                Column(modifier = Modifier.weight(1f).padding(start = 12.dp)) {
                                    Text(overview.list.name, style = MaterialTheme.typography.titleLarge)
                                    Text(
                                        "${overview.activeCount} active · ${overview.completedCount} checked",
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                    Text(
                                        if (overview.list.isReusable) "Reusable" else "One-off",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.primary,
                                    )
                                }
                                Text("›", style = MaterialTheme.typography.headlineMedium)
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                TextButton(onClick = { viewModel.moveList(overview.list.id, -1) }) {
                                    Text("Move up")
                                }
                                TextButton(onClick = { viewModel.moveList(overview.list.id, 1) }) {
                                    Text("Move down")
                                }
                                TextButton(onClick = {
                                    selectedListId = overview.list.id
                                    showEditor = true
                                }) {
                                    Text("Edit")
                                }
                            }
                        }
                    }
                }

                item {
                    NudgeButton(
                        text = "Add List",
                        onClick = {
                            selectedListId = null
                            showEditor = true
                        },
                        modifier = Modifier.fillMaxWidth().testTag("add-list-bottom"),
                        style = NudgeButtonStyle.Outlined,
                        leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                    )
                }
            }

            ListEditorSheet(
                visible = showEditor,
                existing = selected?.list,
                onDismiss = {
                    showEditor = false
                    selectedListId = null
                },
                onSave = { name, reusable ->
                    if (selected == null) viewModel.createList(name, reusable)
                    else viewModel.updateList(selected.list.id, name, reusable)
                    showEditor = false
                    selectedListId = null
                },
                onMoveUp = selected?.let { { viewModel.moveList(it.list.id, -1) } },
                onMoveDown = selected?.let { { viewModel.moveList(it.list.id, 1) } },
                onArchive = selected?.let {
                    {
                        viewModel.archiveList(it.list.id)
                        showEditor = false
                        selectedListId = null
                    }
                },
            )
            state.recoverableError?.let {
                ListErrorBanner(it, viewModel::dismissRecoverableError)
            }
        }
    }
}

@Composable
fun ListDetailScreen(
    listId: String,
    state: ListsUiState,
    createItemRequest: Int,
    suggestions: List<ListCatalogItem>,
    viewModel: ListsViewModel,
    onBack: () -> Unit,
) {
    val ready = state as? ListsUiState.Ready
    val overview = ready?.list(listId)
    var showListEditor by rememberSaveable { mutableStateOf(false) }
    var showItemEditor by rememberSaveable { mutableStateOf(false) }
    var selectedItemId by rememberSaveable { mutableStateOf<String?>(null) }
    var subitemParentId by rememberSaveable { mutableStateOf<String?>(null) }
    var showCompleted by rememberSaveable { mutableStateOf(true) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createItemRequest) {
        if (createItemRequest > lastHandledCreate) {
            lastHandledCreate = createItemRequest
            selectedItemId = null
            subitemParentId = null
            showItemEditor = true
        }
    }

    when {
        state == ListsUiState.Loading -> ListLoading()
        state is ListsUiState.Error -> ListFatalError(state.message)
        overview == null -> ListFatalError("List not found.")
        else -> {
            val selected = selectedItemId?.let(ready::item)
            val parent = subitemParentId?.let(ready::item)
            LazyColumn(
                modifier = Modifier.fillMaxSize().testTag("list-detail-${overview.list.name}"),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                item {
                    TextButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = null)
                        Text("Lists")
                    }
                    Text(
                        overview.list.name,
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "${overview.activeCount} active · ${overview.completedCount} checked · " +
                            if (overview.list.isReusable) "reusable" else "one-off",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        NudgeButton(
                            text = "Edit List",
                            onClick = { showListEditor = true },
                            style = NudgeButtonStyle.Text,
                        )
                        if (overview.completedCount > 0) {
                            NudgeButton(
                                text = if (showCompleted) "Hide Checked" else "Show Checked",
                                onClick = { showCompleted = !showCompleted },
                                style = NudgeButtonStyle.Text,
                            )
                        }
                    }
                }

                if (overview.activeNodes.isNotEmpty()) {
                    item { NudgeSectionLabel("ACTIVE") }
                    items(overview.activeNodes, key = { "active-${it.item.id}" }) { node ->
                        ListNodeRows(
                            node = node,
                            onToggle = viewModel::toggleItem,
                            onOpen = {
                                selectedItemId = it
                                subitemParentId = null
                                showItemEditor = true
                            },
                        )
                    }
                }

                if (overview.activeNodes.isEmpty() && overview.completedNodes.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "This list is empty",
                            message = "Add an item now. Past completed items will appear as suggestions later.",
                            actionLabel = "Add Item",
                            onAction = { showItemEditor = true },
                        )
                    }
                }

                if (showCompleted && overview.completedNodes.isNotEmpty()) {
                    item { NudgeSectionLabel("CHECKED") }
                    items(overview.completedNodes, key = { "checked-${it.item.id}" }) { node ->
                        ListNodeRows(
                            node = node,
                            onToggle = viewModel::toggleItem,
                            onOpen = {
                                selectedItemId = it
                                subitemParentId = null
                                showItemEditor = true
                            },
                        )
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            if (overview.list.isReusable) {
                                NudgeButton(
                                    text = "Return Checked",
                                    onClick = { viewModel.resetCheckedItems(overview.list.id) },
                                    modifier = Modifier.weight(1f).testTag("reset-checked-items"),
                                    style = NudgeButtonStyle.Outlined,
                                )
                            }
                            NudgeButton(
                                text = "Clear Checked",
                                onClick = { viewModel.clearCheckedItems(overview.list.id) },
                                modifier = Modifier.weight(1f).testTag("clear-checked-items"),
                                style = NudgeButtonStyle.Outlined,
                            )
                        }
                    }
                }

                item {
                    NudgeButton(
                        text = "Add Item",
                        onClick = {
                            selectedItemId = null
                            subitemParentId = null
                            showItemEditor = true
                        },
                        modifier = Modifier.fillMaxWidth().testTag("add-list-item-bottom"),
                        style = NudgeButtonStyle.Outlined,
                        leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                    )
                }
            }

            ListEditorSheet(
                visible = showListEditor,
                existing = overview.list,
                onDismiss = { showListEditor = false },
                onSave = { name, reusable ->
                    viewModel.updateList(overview.list.id, name, reusable)
                    showListEditor = false
                },
                onMoveUp = { viewModel.moveList(overview.list.id, -1) },
                onMoveDown = { viewModel.moveList(overview.list.id, 1) },
                onArchive = {
                    viewModel.archiveList(overview.list.id)
                    showListEditor = false
                    onBack()
                },
            )

            ListItemEditorSheet(
                visible = showItemEditor,
                existing = selected,
                parentItem = parent,
                suggestions = suggestions.filterNot { suggestion ->
                    overview.items.any { it.catalogItemId == suggestion.id && !it.isChecked }
                },
                onQueryChange = viewModel::setSuggestionQuery,
                onDismiss = {
                    showItemEditor = false
                    selectedItemId = null
                    subitemParentId = null
                    viewModel.setSuggestionQuery("")
                },
                onSave = { name, quantity, catalogId ->
                    if (selected == null) {
                        viewModel.addItem(
                            listId = overview.list.id,
                            name = name,
                            quantity = quantity,
                            parentItemId = parent?.id,
                            catalogItemId = catalogId,
                        )
                    } else {
                        viewModel.updateItem(selected.id, name, quantity)
                    }
                    showItemEditor = false
                    selectedItemId = null
                    subitemParentId = null
                    viewModel.setSuggestionQuery("")
                },
                onMoveUp = selected?.let { { viewModel.moveItem(it.id, -1) } },
                onMoveDown = selected?.let { { viewModel.moveItem(it.id, 1) } },
                onIndent = selected?.takeIf { it.parentItemId == null }?.let {
                    { viewModel.indentItem(it.id) }
                },
                onUnindent = selected?.takeIf { it.parentItemId != null }?.let {
                    { viewModel.unindentItem(it.id) }
                },
                onAddSubitem = selected?.takeIf { it.parentItemId == null }?.let { root ->
                    {
                        selectedItemId = null
                        subitemParentId = root.id
                        showItemEditor = true
                    }
                },
                onArchive = selected?.let {
                    {
                        viewModel.archiveItem(it.id)
                        showItemEditor = false
                        selectedItemId = null
                    }
                },
            )
            ready.recoverableError?.let {
                ListErrorBanner(it, viewModel::dismissRecoverableError)
            }
        }
    }
}

@Composable
private fun ListNodeRows(
    node: ListItemNode,
    onToggle: (String) -> Unit,
    onOpen: (String) -> Unit,
) {
    ListItemRow(node.item, false, onToggle, onOpen)
    node.children.forEach { child ->
        ListItemRow(child, true, onToggle, onOpen)
    }
}

@Composable
private fun ListItemRow(
    item: ListItem,
    indented: Boolean,
    onToggle: (String) -> Unit,
    onOpen: (String) -> Unit,
) {
    NudgeCard(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = if (indented) 28.dp else 0.dp)
            .testTag("list-item-row-${item.name}"),
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(
                checked = item.isChecked,
                onCheckedChange = { onToggle(item.id) },
                modifier = Modifier.testTag("list-item-checkbox-${item.name}"),
            )
            TextButton(
                onClick = { onOpen(item.id) },
                modifier = Modifier.weight(1f),
            ) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        item.name,
                        style = MaterialTheme.typography.titleMedium,
                        textDecoration = if (item.isChecked) TextDecoration.LineThrough else null,
                    )
                    item.quantity?.let {
                        Text(
                            it,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
            Text("›", style = MaterialTheme.typography.headlineSmall)
        }
    }
}

@Composable
private fun ListLoading() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ListFatalError(message: String) {
    Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
        NudgeEmptyState(title = "Lists are unavailable", message = message)
    }
}

@Composable
private fun ListErrorBanner(message: String, onDismiss: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        contentAlignment = Alignment.TopCenter,
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(message, modifier = Modifier.weight(1f))
                TextButton(onClick = onDismiss) { Text("Dismiss") }
            }
        }
    }
}
