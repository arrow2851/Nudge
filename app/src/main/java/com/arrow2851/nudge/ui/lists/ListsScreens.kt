package com.arrow2851.nudge.ui.lists

import androidx.compose.foundation.gestures.detectHorizontalDragGestures
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.data.normalizeListItemName
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.ui.checklist.ChecklistRow
import com.arrow2851.nudge.ui.checklist.ChecklistSelectionBar
import com.arrow2851.nudge.ui.checklist.ChecklistSelectionMode
import com.arrow2851.nudge.ui.checklist.ChecklistSuggestion
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
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("lists-overview"),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 14.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                item {
                    NudgeSectionLabel("REUSABLE CHECKLISTS")
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                    Text(
                        "Reusable lists remember what matters.",
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x1))
                    Text(
                        "Checked items stay available and return as deduplicated suggestion bubbles.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.height(8.dp))
                }

                if (state.lists.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "No lists yet",
                            message = "Create a reusable list for groceries, packing, or anything you revisit.",
                            actionLabel = "Add List",
                            onAction = { showEditor = true },
                        )
                    }
                } else {
                    itemsIndexed(
                        state.lists,
                        key = { _, overview -> overview.list.id },
                    ) { _, overview ->
                        NudgeCard(
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("list-card-${overview.list.name}"),
                            onClick = { onOpenList(overview.list.id) },
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 10.dp),
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    if (overview.list.isReusable) {
                                        Icons.Default.Refresh
                                    } else {
                                        Icons.Default.CheckCircle
                                    },
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                )
                                Column(
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(start = 12.dp),
                                ) {
                                    Text(overview.list.name, style = MaterialTheme.typography.titleLarge)
                                    Text(
                                        "${overview.activeCount} active · ${overview.completedCount} checked",
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                                TextButton(
                                    onClick = {
                                        selectedListId = overview.list.id
                                        showEditor = true
                                    },
                                ) {
                                    Text("Edit")
                                }
                                Text("›", style = MaterialTheme.typography.headlineMedium)
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
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add-list-bottom"),
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
    var selectionMode by rememberSaveable { mutableStateOf(ChecklistSelectionMode.None) }
    var selectedItemIds by rememberSaveable { mutableStateOf(emptyList<String>()) }
    var showNoteDialog by rememberSaveable { mutableStateOf(false) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createItemRequest) {
        if (createItemRequest > lastHandledCreate) {
            lastHandledCreate = createItemRequest
            viewModel.createItem(listId)
        }
    }

    when {
        state == ListsUiState.Loading -> ListLoading()
        state is ListsUiState.Error -> ListFatalError(state.message)
        overview == null || ready == null -> ListFatalError("List not found.")
        else -> {
            val visibleCompleted = if (ready.hideCompleted) emptyList() else overview.completedNodes
            val allItems = overview.items
            val selectableIds = when (selectionMode) {
                ChecklistSelectionMode.Metadata -> allItems.map(ListItem::id)
                ChecklistSelectionMode.Delete -> allItems
                    .filter(ListItem::isChecked)
                    .map(ListItem::id)
                ChecklistSelectionMode.None -> emptyList()
            }
            val activeNames = allItems
                .filter { !it.isChecked && it.id != ready.editingItemId }
                .mapTo(mutableSetOf()) { normalizeListItemName(it.name) }
            val bubbleSuggestions = suggestions
                .distinctBy(ListCatalogItem::normalizedName)
                .filterNot { it.normalizedName in activeNames }
                .map { ChecklistSuggestion(id = it.id, label = it.displayName) }

            LaunchedEffect(selectionMode, allItems) {
                selectedItemIds = selectedItemIds.filter { it in selectableIds }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("list-detail-${overview.list.name}"),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(0.dp),
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
                    NudgeButton(
                        text = "Edit List",
                        onClick = { showListEditor = true },
                        style = NudgeButtonStyle.Text,
                    )
                    ChecklistSelectionBar(
                        mode = selectionMode,
                        metadataActionLabel = "Add note",
                        checkedCount = overview.completedCount,
                        selectedCount = selectedItemIds.size,
                        hideChecked = ready.hideCompleted,
                        onStartMetadata = {
                            selectionMode = ChecklistSelectionMode.Metadata
                            selectedItemIds = emptyList()
                        },
                        onStartDelete = {
                            selectionMode = ChecklistSelectionMode.Delete
                            selectedItemIds = emptyList()
                        },
                        onSelectAll = { selectedItemIds = selectableIds.distinct() },
                        onApply = {
                            when (selectionMode) {
                                ChecklistSelectionMode.Metadata -> showNoteDialog = true
                                ChecklistSelectionMode.Delete -> {
                                    viewModel.archiveItems(selectedItemIds.toSet())
                                    selectionMode = ChecklistSelectionMode.None
                                    selectedItemIds = emptyList()
                                }
                                ChecklistSelectionMode.None -> Unit
                            }
                        },
                        onCancel = {
                            selectionMode = ChecklistSelectionMode.None
                            selectedItemIds = emptyList()
                            showNoteDialog = false
                        },
                        onToggleCheckedVisibility = {
                            viewModel.setHideCompleted(!ready.hideCompleted)
                        },
                    )
                    Spacer(Modifier.height(4.dp))
                }

                if (overview.activeNodes.isEmpty() && overview.completedNodes.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "This list is empty",
                            message = "Add an item directly. Checked items return as suggestion bubbles.",
                            actionLabel = "Add Item",
                            onAction = { viewModel.createItem(overview.list.id) },
                        )
                    }
                }

                if (overview.activeNodes.isNotEmpty()) {
                    item { NudgeSectionLabel("ACTIVE") }
                    itemsIndexed(
                        overview.activeNodes,
                        key = { _, node -> "active-${node.item.id}" },
                    ) { index, node ->
                        ListNodeRows(
                            node = node,
                            previousRootId = overview.activeNodes.getOrNull(index - 1)?.item?.id,
                            nextRootId = overview.activeNodes.getOrNull(index + 1)?.item?.id,
                            editingItemId = ready.editingItemId,
                            handedness = ready.handedness,
                            selectionMode = selectionMode,
                            selectedItemIds = selectedItemIds.toSet(),
                            suggestions = bubbleSuggestions,
                            onToggleSelection = { itemId ->
                                selectedItemIds = selectedItemIds.toggle(itemId)
                            },
                            onToggle = viewModel::toggleItem,
                            onEdit = viewModel::editItem,
                            onDraftChange = viewModel::setSuggestionQuery,
                            onFinishEdit = viewModel::finishTitleEdit,
                            onAcceptSuggestion = { itemId, suggestionId ->
                                suggestions.firstOrNull { it.id == suggestionId }?.let { suggestion ->
                                    viewModel.acceptSuggestion(itemId, suggestion)
                                }
                            },
                            onDelete = viewModel::archiveItem,
                            onReorder = viewModel::reorderItem,
                            onMoveUp = { viewModel.moveItem(it, -1) },
                            onMoveDown = { viewModel.moveItem(it, 1) },
                            onIndent = viewModel::indentItem,
                            onUnindent = viewModel::unindentItem,
                            onAddSubitem = { viewModel.createItem(overview.list.id, it) },
                        )
                    }
                }

                if (overview.completedNodes.isNotEmpty()) {
                    item {
                        NudgeSectionLabel(
                            if (ready.hideCompleted) {
                                "CHECKED · ${overview.completedCount} HIDDEN"
                            } else {
                                "CHECKED"
                            },
                        )
                    }
                    itemsIndexed(
                        visibleCompleted,
                        key = { _, node -> "checked-${node.item.id}" },
                    ) { index, node ->
                        ListNodeRows(
                            node = node,
                            previousRootId = visibleCompleted.getOrNull(index - 1)?.item?.id,
                            nextRootId = visibleCompleted.getOrNull(index + 1)?.item?.id,
                            editingItemId = ready.editingItemId,
                            handedness = ready.handedness,
                            selectionMode = selectionMode,
                            selectedItemIds = selectedItemIds.toSet(),
                            suggestions = bubbleSuggestions,
                            onToggleSelection = { itemId ->
                                selectedItemIds = selectedItemIds.toggle(itemId)
                            },
                            onToggle = viewModel::toggleItem,
                            onEdit = viewModel::editItem,
                            onDraftChange = viewModel::setSuggestionQuery,
                            onFinishEdit = viewModel::finishTitleEdit,
                            onAcceptSuggestion = { itemId, suggestionId ->
                                suggestions.firstOrNull { it.id == suggestionId }?.let { suggestion ->
                                    viewModel.acceptSuggestion(itemId, suggestion)
                                }
                            },
                            onDelete = viewModel::archiveItem,
                            onReorder = viewModel::reorderItem,
                            onMoveUp = { viewModel.moveItem(it, -1) },
                            onMoveDown = { viewModel.moveItem(it, 1) },
                            onIndent = viewModel::indentItem,
                            onUnindent = viewModel::unindentItem,
                            onAddSubitem = { viewModel.createItem(overview.list.id, it) },
                        )
                    }
                }

                if (selectionMode == ChecklistSelectionMode.None) {
                    item {
                        Spacer(Modifier.height(12.dp))
                        NudgeButton(
                            text = "Add Item",
                            onClick = { viewModel.createItem(overview.list.id) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("add-list-item-bottom"),
                            style = NudgeButtonStyle.Outlined,
                            leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                        )
                    }
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
                onArchive = {
                    viewModel.archiveList(overview.list.id)
                    showListEditor = false
                    onBack()
                },
            )

            if (showNoteDialog && selectedItemIds.isNotEmpty()) {
                NoteAssignmentDialog(
                    selectedCount = selectedItemIds.size,
                    onDismiss = { showNoteDialog = false },
                    onApply = { note ->
                        viewModel.updateItemNotes(selectedItemIds.toSet(), note)
                        showNoteDialog = false
                        selectionMode = ChecklistSelectionMode.None
                        selectedItemIds = emptyList()
                    },
                )
            }

            ready.recoverableError?.let {
                ListErrorBanner(it, viewModel::dismissRecoverableError)
            }
        }
    }
}

@Composable
private fun ListNodeRows(
    node: ListItemNode,
    previousRootId: String?,
    nextRootId: String?,
    editingItemId: String?,
    handedness: ItemHandedness,
    selectionMode: ChecklistSelectionMode,
    selectedItemIds: Set<String>,
    suggestions: List<ChecklistSuggestion>,
    onToggleSelection: (String) -> Unit,
    onToggle: (String) -> Unit,
    onEdit: (String) -> Unit,
    onDraftChange: (String) -> Unit,
    onFinishEdit: (String, String) -> Unit,
    onAcceptSuggestion: (String, String) -> Unit,
    onDelete: (String) -> Unit,
    onReorder: (String, String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
    onAddSubitem: (String) -> Unit,
) {
    val hasChildren = node.children.isNotEmpty()
    var expanded by rememberSaveable(node.item.id) { mutableStateOf(hasChildren) }

    LaunchedEffect(hasChildren) {
        expanded = hasChildren
    }

    ListChecklistRow(
        item = node.item,
        previousId = previousRootId,
        nextId = nextRootId,
        editing = editingItemId == node.item.id,
        handedness = handedness,
        expanded = expanded,
        hasChildren = hasChildren,
        selectionMode = selectionMode,
        selected = node.item.id in selectedItemIds,
        suggestions = if (editingItemId == node.item.id) suggestions else emptyList(),
        onToggleSelection = onToggleSelection,
        onExpand = { expanded = !expanded },
        onToggle = onToggle,
        onEdit = onEdit,
        onDraftChange = onDraftChange,
        onFinishEdit = onFinishEdit,
        onAcceptSuggestion = onAcceptSuggestion,
        onDelete = onDelete,
        onReorder = onReorder,
        onMoveUp = onMoveUp,
        onMoveDown = onMoveDown,
        onIndent = onIndent,
        onUnindent = onUnindent,
    )

    if (hasChildren && expanded) {
        node.children.forEachIndexed { index, child ->
            HorizontalDivider(
                modifier = Modifier.padding(start = 62.dp),
                color = MaterialTheme.colorScheme.outlineVariant,
            )
            ListChecklistRow(
                item = child,
                previousId = node.children.getOrNull(index - 1)?.id,
                nextId = node.children.getOrNull(index + 1)?.id,
                editing = editingItemId == child.id,
                handedness = handedness,
                indented = true,
                expanded = false,
                hasChildren = false,
                selectionMode = selectionMode,
                selected = child.id in selectedItemIds,
                suggestions = if (editingItemId == child.id) suggestions else emptyList(),
                onToggleSelection = onToggleSelection,
                onExpand = {},
                onToggle = onToggle,
                onEdit = onEdit,
                onDraftChange = onDraftChange,
                onFinishEdit = onFinishEdit,
                onAcceptSuggestion = onAcceptSuggestion,
                onDelete = onDelete,
                onReorder = onReorder,
                onMoveUp = onMoveUp,
                onMoveDown = onMoveDown,
                onIndent = onIndent,
                onUnindent = onUnindent,
            )
        }
        TextButton(
            onClick = { onAddSubitem(node.item.id) },
            modifier = Modifier.padding(start = 54.dp),
            enabled = selectionMode == ChecklistSelectionMode.None,
        ) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(Modifier.width(4.dp))
            Text("Add subitem")
        }
    }
    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
}

@Composable
private fun ListChecklistRow(
    item: ListItem,
    previousId: String?,
    nextId: String?,
    editing: Boolean,
    handedness: ItemHandedness,
    indented: Boolean = false,
    expanded: Boolean,
    hasChildren: Boolean,
    selectionMode: ChecklistSelectionMode,
    selected: Boolean,
    suggestions: List<ChecklistSuggestion>,
    onToggleSelection: (String) -> Unit,
    onExpand: () -> Unit,
    onToggle: (String) -> Unit,
    onEdit: (String) -> Unit,
    onDraftChange: (String) -> Unit,
    onFinishEdit: (String, String) -> Unit,
    onAcceptSuggestion: (String, String) -> Unit,
    onDelete: (String) -> Unit,
    onReorder: (String, String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
) {
    ChecklistRow(
        id = item.id,
        title = item.name,
        checked = item.isChecked,
        handedness = handedness,
        modifier = Modifier
            .testTag("list-item-row-${item.name}")
            .listItemSwipeActions(
                itemId = item.id,
                enabled = selectionMode == ChecklistSelectionMode.None,
                canIndent = item.parentItemId == null,
                canUnindent = item.parentItemId != null,
                onIndent = { onIndent(item.id) },
                onUnindent = { onUnindent(item.id) },
            ),
        metadata = item.quantity,
        editing = editing,
        indented = indented,
        expanded = expanded,
        hasChildren = hasChildren,
        selectionMode = selectionMode,
        selected = selected,
        suggestions = suggestions,
        canMovePrevious = previousId != null,
        canMoveNext = nextId != null,
        onTitleClick = { onEdit(item.id) },
        onTitleCommitted = { onFinishEdit(item.id, it) },
        onTitleDraftChanged = onDraftChange,
        onSuggestionAccepted = { onAcceptSuggestion(item.id, it.id) },
        onCheckedChange = { onToggle(item.id) },
        onSelectionChange = { onToggleSelection(item.id) },
        onExpandClick = onExpand,
        onDelete = { onDelete(item.id) },
        onMovePrevious = {
            previousId?.let { onReorder(item.id, it) } ?: onMoveUp(item.id)
        },
        onMoveNext = {
            nextId?.let { onReorder(item.id, it) } ?: onMoveDown(item.id)
        },
    )
}

@Composable
private fun Modifier.listItemSwipeActions(
    itemId: String,
    enabled: Boolean,
    canIndent: Boolean,
    canUnindent: Boolean,
    onIndent: () -> Unit,
    onUnindent: () -> Unit,
): Modifier {
    if (!enabled) return this
    val threshold = with(LocalDensity.current) { 72.dp.toPx() }
    var offset by remember(itemId) { mutableFloatStateOf(0f) }

    return graphicsLayer { translationX = offset }
        .pointerInput(itemId, canIndent, canUnindent) {
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

@Composable
private fun NoteAssignmentDialog(
    selectedCount: Int,
    onDismiss: () -> Unit,
    onApply: (String?) -> Unit,
) {
    var note by rememberSaveable { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Note for $selectedCount item${if (selectedCount == 1) "" else "s"}") },
        text = {
            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                label = { Text("Quantity or note") },
                placeholder = { Text("2, large, 12 oz, low sodium…") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("bulk-note-field"),
            )
        },
        confirmButton = {
            TextButton(onClick = { onApply(note.trim().ifEmpty { null }) }) {
                Text("Apply")
            }
        },
        dismissButton = {
            Row {
                TextButton(onClick = { onApply(null) }) {
                    Text("Remove notes")
                }
                TextButton(onClick = onDismiss) {
                    Text("Cancel")
                }
            }
        },
    )
}

@Composable
private fun ListLoading() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ListFatalError(message: String) {
    Box(
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center,
    ) {
        NudgeEmptyState(title = "Lists are unavailable", message = message)
    }
}

@Composable
private fun ListErrorBanner(message: String, onDismiss: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(message, modifier = Modifier.weight(1f))
        TextButton(onClick = onDismiss) { Text("Dismiss") }
    }
}

private fun List<String>.toggle(value: String): List<String> =
    if (value in this) filterNot { it == value } else this + value
