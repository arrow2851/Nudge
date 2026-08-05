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
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.ui.checklist.ChecklistMetadataKind
import com.arrow2851.nudge.ui.checklist.ChecklistRow
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
                        "Checked items stay available and become inline suggestions the next time you type.",
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
                                    if (overview.list.isReusable) Icons.Default.Refresh else Icons.Default.CheckCircle,
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
    var showAddItem by rememberSaveable { mutableStateOf(false) }
    var subitemParentId by rememberSaveable { mutableStateOf<String?>(null) }
    var noteItemId by rememberSaveable { mutableStateOf<String?>(null) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createItemRequest) {
        if (createItemRequest > lastHandledCreate) {
            lastHandledCreate = createItemRequest
            subitemParentId = null
            showAddItem = true
        }
    }

    when {
        state == ListsUiState.Loading -> ListLoading()
        state is ListsUiState.Error -> ListFatalError(state.message)
        overview == null || ready == null -> ListFatalError("List not found.")
        else -> {
            val parent = subitemParentId?.let(ready::item)
            val noteItem = noteItemId?.let(ready::item)
            val visibleCompleted = if (ready.hideCompleted) emptyList() else overview.completedNodes

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
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        NudgeButton(
                            text = "Edit List",
                            onClick = { showListEditor = true },
                            style = NudgeButtonStyle.Text,
                        )
                        if (overview.completedCount > 0) {
                            IconButton(
                                onClick = {
                                    viewModel.setHideCompleted(!ready.hideCompleted)
                                },
                                modifier = Modifier.testTag("toggle-checked-visibility"),
                            ) {
                                Icon(
                                    imageVector = if (ready.hideCompleted) {
                                        Icons.Default.Visibility
                                    } else {
                                        Icons.Default.VisibilityOff
                                    },
                                    contentDescription = if (ready.hideCompleted) {
                                        "Show checked items"
                                    } else {
                                        "Hide checked items"
                                    },
                                )
                            }
                        }
                    }
                    Spacer(Modifier.height(4.dp))
                }

                if (overview.activeNodes.isEmpty() && overview.completedNodes.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "This list is empty",
                            message = "Add an item. Reused items will appear as gray inline hints while typing.",
                            actionLabel = "Add Item",
                            onAction = { showAddItem = true },
                        )
                    }
                }

                if (overview.activeNodes.isNotEmpty()) {
                    item { NudgeSectionLabel("ACTIVE") }
                    itemsIndexed(
                        overview.activeNodes,
                        key = { _, node -> "active-${node.item.id}" },
                    ) { index, node ->
                        ListNodeRowsV2(
                            node = node,
                            previousRootId = overview.activeNodes.getOrNull(index - 1)?.item?.id,
                            nextRootId = overview.activeNodes.getOrNull(index + 1)?.item?.id,
                            editingItemId = ready.editingItemId,
                            handedness = ready.handedness,
                            onToggle = viewModel::toggleItem,
                            onEdit = viewModel::editItem,
                            onFinishEdit = viewModel::finishTitleEdit,
                            onOpenNote = { noteItemId = it },
                            onDelete = viewModel::archiveItem,
                            onReorder = viewModel::reorderItem,
                            onMoveUp = { viewModel.moveItem(it, -1) },
                            onMoveDown = { viewModel.moveItem(it, 1) },
                            onIndent = viewModel::indentItem,
                            onUnindent = viewModel::unindentItem,
                            onAddSubitem = {
                                subitemParentId = it
                                showAddItem = true
                            },
                        )
                    }
                }

                if (overview.completedNodes.isNotEmpty()) {
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 12.dp, bottom = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            NudgeSectionLabel("CHECKED")
                            if (ready.hideCompleted) {
                                Text(
                                    "${overview.completedCount} hidden",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                    itemsIndexed(
                        visibleCompleted,
                        key = { _, node -> "checked-${node.item.id}" },
                    ) { index, node ->
                        ListNodeRowsV2(
                            node = node,
                            previousRootId = visibleCompleted.getOrNull(index - 1)?.item?.id,
                            nextRootId = visibleCompleted.getOrNull(index + 1)?.item?.id,
                            editingItemId = ready.editingItemId,
                            handedness = ready.handedness,
                            onToggle = viewModel::toggleItem,
                            onEdit = viewModel::editItem,
                            onFinishEdit = viewModel::finishTitleEdit,
                            onOpenNote = { noteItemId = it },
                            onDelete = viewModel::archiveItem,
                            onReorder = viewModel::reorderItem,
                            onMoveUp = { viewModel.moveItem(it, -1) },
                            onMoveDown = { viewModel.moveItem(it, 1) },
                            onIndent = viewModel::indentItem,
                            onUnindent = viewModel::unindentItem,
                            onAddSubitem = {
                                subitemParentId = it
                                showAddItem = true
                            },
                        )
                    }
                }

                item {
                    Spacer(Modifier.height(12.dp))
                    NudgeButton(
                        text = "Add Item",
                        onClick = {
                            subitemParentId = null
                            showAddItem = true
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add-list-item-bottom"),
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
                onArchive = {
                    viewModel.archiveList(overview.list.id)
                    showListEditor = false
                    onBack()
                },
            )

            AddListItemSheetV2(
                visible = showAddItem,
                parentItem = parent,
                suggestions = suggestions.filterNot { suggestion ->
                    overview.items.any { it.catalogItemId == suggestion.id && !it.isChecked }
                },
                onQueryChange = viewModel::setSuggestionQuery,
                onDismiss = {
                    showAddItem = false
                    subitemParentId = null
                    viewModel.setSuggestionQuery("")
                },
                onSave = { name, quantity, catalogId ->
                    viewModel.addItem(
                        listId = overview.list.id,
                        name = name,
                        quantity = quantity,
                        parentItemId = parent?.id,
                        catalogItemId = catalogId,
                    )
                    showAddItem = false
                    subitemParentId = null
                    viewModel.setSuggestionQuery("")
                },
            )

            ListItemNoteSheetV2(
                item = noteItem,
                onDismiss = { noteItemId = null },
                onSave = { value ->
                    noteItem?.let { viewModel.updateItemNote(it.id, value) }
                    noteItemId = null
                },
            )

            ready.recoverableError?.let {
                ListErrorBanner(it, viewModel::dismissRecoverableError)
            }
        }
    }
}

@Composable
private fun ListNodeRowsV2(
    node: ListItemNode,
    previousRootId: String?,
    nextRootId: String?,
    editingItemId: String?,
    handedness: ItemHandedness,
    onToggle: (String) -> Unit,
    onEdit: (String) -> Unit,
    onFinishEdit: (String, String) -> Unit,
    onOpenNote: (String) -> Unit,
    onDelete: (String) -> Unit,
    onReorder: (String, String) -> Unit,
    onMoveUp: (String) -> Unit,
    onMoveDown: (String) -> Unit,
    onIndent: (String) -> Unit,
    onUnindent: (String) -> Unit,
    onAddSubitem: (String) -> Unit,
) {
    var expanded by rememberSaveable(node.item.id) {
        mutableStateOf(node.children.isNotEmpty())
    }

    ListChecklistRow(
        item = node.item,
        previousId = previousRootId,
        nextId = nextRootId,
        editing = editingItemId == node.item.id,
        handedness = handedness,
        expanded = expanded,
        expandable = true,
        onExpand = { expanded = !expanded },
        onToggle = onToggle,
        onEdit = onEdit,
        onFinishEdit = onFinishEdit,
        onOpenNote = onOpenNote,
        onDelete = onDelete,
        onReorder = onReorder,
        onMoveUp = onMoveUp,
        onMoveDown = onMoveDown,
        onIndent = onIndent,
        onUnindent = onUnindent,
    )

    if (expanded) {
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
                expandable = false,
                onExpand = {},
                onToggle = onToggle,
                onEdit = onEdit,
                onFinishEdit = onFinishEdit,
                onOpenNote = onOpenNote,
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
    expandable: Boolean,
    onExpand: () -> Unit,
    onToggle: (String) -> Unit,
    onEdit: (String) -> Unit,
    onFinishEdit: (String, String) -> Unit,
    onOpenNote: (String) -> Unit,
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
                canIndent = item.parentItemId == null,
                canUnindent = item.parentItemId != null,
                onIndent = { onIndent(item.id) },
                onUnindent = { onUnindent(item.id) },
            ),
        metadata = item.quantity,
        metadataKind = ChecklistMetadataKind.QuantityOrNote,
        editing = editing,
        indented = indented,
        expanded = expanded,
        expandable = expandable,
        canMovePrevious = previousId != null,
        canMoveNext = nextId != null,
        onTitleClick = { onEdit(item.id) },
        onTitleCommitted = { onFinishEdit(item.id, it) },
        onCheckedChange = { onToggle(item.id) },
        onMetadataClick = { onOpenNote(item.id) },
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
    canIndent: Boolean,
    canUnindent: Boolean,
    onIndent: () -> Unit,
    onUnindent: () -> Unit,
): Modifier {
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
