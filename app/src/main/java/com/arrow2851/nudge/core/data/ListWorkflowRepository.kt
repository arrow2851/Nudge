package com.arrow2851.nudge.core.data

import androidx.room.withTransaction
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.HistoryEventType
import com.arrow2851.nudge.core.model.HistoryItemType
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.ItemHistoryEntry
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.TimeProvider
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

data class ListItemCheckMutation(
    val itemId: String,
    val previousCheckedAt: Long?,
    val checkedAt: Long?,
    val createdHistoryId: String? = null,
)

data class ListItemArchiveMutation(
    val item: ListItem,
    val childSortOrders: Map<String, Long>,
    val historyId: String,
)

interface ListWorkflowRepository {
    fun observeLists(): Flow<List<ReusableListWithItems>>
    fun observeList(listId: String): Flow<ReusableListWithItems?>
    fun observeSuggestions(query: String, limit: Int = 8): Flow<List<ListCatalogItem>>

    suspend fun createList(name: String, isReusable: Boolean): ReusableList
    suspend fun saveList(list: ReusableList)
    suspend fun moveList(listId: String, direction: Int)
    suspend fun reorderList(listId: String, targetListId: String)
    suspend fun archiveList(listId: String)

    suspend fun addItem(
        listId: String,
        name: String,
        quantity: String? = null,
        parentItemId: String? = null,
        catalogItemId: String? = null,
    ): ListItem
    suspend fun saveItem(item: ListItem)
    suspend fun setItemChecked(itemId: String, checked: Boolean): ListItemCheckMutation
    suspend fun undoCheck(mutation: ListItemCheckMutation)
    suspend fun moveItem(itemId: String, direction: Int)
    suspend fun reorderItem(itemId: String, targetItemId: String)
    suspend fun indentItem(itemId: String)
    suspend fun unindentItem(itemId: String)
    suspend fun archiveItem(itemId: String): ListItemArchiveMutation
    suspend fun undoArchive(mutation: ListItemArchiveMutation)

    @Deprecated("Checked items should be hidden or individually restored")
    suspend fun resetCheckedItems(listId: String)

    @Deprecated("Checked items should be deleted individually")
    suspend fun clearCheckedItems(listId: String)
}

class RoomListWorkflowRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ListWorkflowRepository {
    private val dao
        get() = database.listOperationsDao()
    private val history
        get() = database.historyDao()

    override fun observeLists(): Flow<List<ReusableListWithItems>> =
        dao.observeActiveListsWithItems().map { rows -> rows.map { it.toDomain() } }

    override fun observeList(listId: String): Flow<ReusableListWithItems?> =
        dao.observeActiveListWithItems(listId).map { it?.toDomain() }

    override fun observeSuggestions(query: String, limit: Int): Flow<List<ListCatalogItem>> =
        dao.observeCatalogSuggestions(normalizeName(query), limit).map { rows -> rows.map { it.toDomain() } }

    override suspend fun createList(name: String, isReusable: Boolean): ReusableList =
        database.withTransaction {
            val now = timeProvider.nowEpochMillis()
            val list = ReusableList(
                id = idGenerator.newId(),
                name = name.trim(),
                icon = if (isReusable) "refresh" else "checklist",
                isReusable = isReusable,
                sortOrder = SortOrders.after(dao.getMaxListSortOrder() ?: -SortOrders.Gap),
                createdAt = now,
                updatedAt = now,
            )
            dao.upsertList(list.toEntity())
            list
        }

    override suspend fun saveList(list: ReusableList) {
        dao.upsertList(list.copy(updatedAt = timeProvider.nowEpochMillis()).toEntity())
    }

    override suspend fun moveList(listId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val lists = dao.getActiveLists()
            val index = lists.indexOfFirst { it.id == listId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in lists.indices) return@withTransaction
            swapListOrders(lists[index].id, lists[index].sortOrder, lists[targetIndex].id, lists[targetIndex].sortOrder)
        }
    }

    override suspend fun reorderList(listId: String, targetListId: String) {
        if (listId == targetListId) return
        database.withTransaction {
            val current = dao.getList(listId) ?: return@withTransaction
            val target = dao.getList(targetListId) ?: return@withTransaction
            if (current.archivedAt != null || target.archivedAt != null) return@withTransaction
            swapListOrders(current.id, current.sortOrder, target.id, target.sortOrder)
        }
    }

    override suspend fun archiveList(listId: String) {
        dao.archiveList(listId, timeProvider.nowEpochMillis())
    }

    override suspend fun addItem(
        listId: String,
        name: String,
        quantity: String?,
        parentItemId: String?,
        catalogItemId: String?,
    ): ListItem = database.withTransaction {
        requireNotNull(dao.getList(listId)) { "List not found" }
        parentItemId?.let { parentId ->
            val parent = requireNotNull(dao.getItem(parentId)) { "Parent item not found" }
            require(parent.parentItemId == null) { "Lists support one level of subitems" }
            require(parent.listId == listId) { "Parent item belongs to another list" }
        }
        val now = timeProvider.nowEpochMillis()
        val item = ListItem(
            id = idGenerator.newId(),
            listId = listId,
            parentItemId = parentItemId,
            catalogItemId = catalogItemId,
            name = name.trim(),
            quantity = quantity?.trim()?.ifEmpty { null },
            sortOrder = SortOrders.after(
                dao.getMaxItemSortOrder(listId, parentItemId) ?: -SortOrders.Gap,
            ),
            addedAt = now,
            updatedAt = now,
        )
        dao.upsertItem(item.toEntity())
        item
    }

    override suspend fun saveItem(item: ListItem) {
        dao.upsertItem(item.copy(updatedAt = timeProvider.nowEpochMillis()).toEntity())
    }

    override suspend fun setItemChecked(
        itemId: String,
        checked: Boolean,
    ): ListItemCheckMutation = database.withTransaction {
        val item = requireNotNull(dao.getItem(itemId)) { "List item not found" }
        val list = requireNotNull(dao.getList(item.listId)) { "List not found" }
        val now = timeProvider.nowEpochMillis()
        val checkedAt = now.takeIf { checked }
        var historyId: String? = null
        if (checked && !item.isChecked) {
            val normalized = normalizeName(item.name)
            val existingDomain = dao.getCatalogItem(normalized)?.toDomain()
            val catalog = existingDomain?.copy(
                displayName = item.name,
                defaultQuantity = item.quantity ?: existingDomain.defaultQuantity,
                timesUsed = existingDomain.timesUsed + 1,
                lastUsedAt = now,
            ) ?: ListCatalogItem(
                id = idGenerator.newId(),
                normalizedName = normalized,
                displayName = item.name,
                defaultQuantity = item.quantity,
                timesUsed = 1,
                lastUsedAt = now,
            )
            dao.upsertCatalogItem(catalog.toEntity())
            dao.updateCatalogLink(itemId, catalog.id, now)
            historyId = idGenerator.newId()
            history.upsert(
                ItemHistoryEntry(
                    id = historyId,
                    itemType = HistoryItemType.ListItem,
                    eventType = HistoryEventType.Completed,
                    sourceItemId = item.id,
                    title = item.name,
                    detail = item.quantity,
                    containerName = list.name,
                    occurredAt = now,
                ).toEntity(),
            )
        }
        dao.updateChecked(itemId, checked, checkedAt, now)
        ListItemCheckMutation(
            itemId = itemId,
            previousCheckedAt = item.checkedAt,
            checkedAt = checkedAt,
            createdHistoryId = historyId,
        )
    }

    override suspend fun undoCheck(mutation: ListItemCheckMutation) {
        database.withTransaction {
            val previous = mutation.previousCheckedAt
            dao.updateChecked(
                itemId = mutation.itemId,
                checked = previous != null,
                checkedAt = previous,
                updatedAt = timeProvider.nowEpochMillis(),
            )
            mutation.createdHistoryId?.let { history.delete(it) }
        }
    }

    override suspend fun moveItem(itemId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val item = dao.getItem(itemId) ?: return@withTransaction
            val siblings = dao.getSiblings(item.listId, item.parentItemId)
                .filter { it.isChecked == item.isChecked }
            val index = siblings.indexOfFirst { it.id == itemId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in siblings.indices) return@withTransaction
            swapItemOrders(item, siblings[targetIndex])
        }
    }

    override suspend fun reorderItem(itemId: String, targetItemId: String) {
        if (itemId == targetItemId) return
        database.withTransaction {
            val item = dao.getItem(itemId) ?: return@withTransaction
            val target = dao.getItem(targetItemId) ?: return@withTransaction
            if (item.archivedAt != null || target.archivedAt != null) return@withTransaction
            if (item.listId != target.listId || item.parentItemId != target.parentItemId) return@withTransaction
            if (item.isChecked != target.isChecked) return@withTransaction
            swapItemOrders(item, target)
        }
    }

    override suspend fun indentItem(itemId: String) {
        database.withTransaction {
            val item = dao.getItem(itemId) ?: return@withTransaction
            if (item.parentItemId != null) return@withTransaction
            val roots = dao.getSiblings(item.listId, null)
                .filter { it.isChecked == item.isChecked }
            val index = roots.indexOfFirst { it.id == itemId }
            if (index <= 0) return@withTransaction
            val parent = roots[index - 1]
            val now = timeProvider.nowEpochMillis()
            dao.updateParentAndOrder(
                itemId = itemId,
                parentItemId = parent.id,
                sortOrder = SortOrders.after(
                    dao.getMaxItemSortOrder(item.listId, parent.id) ?: -SortOrders.Gap,
                ),
                updatedAt = now,
            )
        }
    }

    override suspend fun unindentItem(itemId: String) {
        database.withTransaction {
            val item = dao.getItem(itemId) ?: return@withTransaction
            val parentId = item.parentItemId ?: return@withTransaction
            val parent = dao.getItem(parentId) ?: return@withTransaction
            dao.updateParentAndOrder(
                itemId = item.id,
                parentItemId = null,
                sortOrder = parent.sortOrder + 1L,
                updatedAt = timeProvider.nowEpochMillis(),
            )
            rebalance(item.listId, null)
        }
    }

    override suspend fun archiveItem(itemId: String): ListItemArchiveMutation =
        database.withTransaction {
            val itemEntity = requireNotNull(dao.getItem(itemId)) { "List item not found" }
            require(itemEntity.archivedAt == null) { "List item is already deleted" }
            val item = itemEntity.toDomain()
            val list = requireNotNull(dao.getList(item.listId)) { "List not found" }
            val children = dao.getChildren(item.id)
            val now = timeProvider.nowEpochMillis()
            val historyId = idGenerator.newId()
            history.upsert(
                ItemHistoryEntry(
                    id = historyId,
                    itemType = HistoryItemType.ListItem,
                    eventType = HistoryEventType.Deleted,
                    sourceItemId = item.id,
                    title = item.name,
                    detail = item.quantity,
                    containerName = list.name,
                    occurredAt = now,
                ).toEntity(),
            )
            children.forEachIndexed { index, child ->
                dao.updateParentAndOrder(
                    itemId = child.id,
                    parentItemId = null,
                    sortOrder = item.sortOrder + index + 1L,
                    updatedAt = now,
                )
            }
            dao.archiveItem(itemId, now)
            if (children.isNotEmpty()) rebalance(item.listId, null)
            ListItemArchiveMutation(
                item = item,
                childSortOrders = children.associate { it.id to it.sortOrder },
                historyId = historyId,
            )
        }

    override suspend fun undoArchive(mutation: ListItemArchiveMutation) {
        database.withTransaction {
            val now = timeProvider.nowEpochMillis()
            dao.restoreItem(mutation.item.id, now)
            mutation.childSortOrders.forEach { (childId, sortOrder) ->
                dao.updateParentAndOrder(
                    itemId = childId,
                    parentItemId = mutation.item.id,
                    sortOrder = sortOrder,
                    updatedAt = now,
                )
            }
            history.delete(mutation.historyId)
            rebalance(mutation.item.listId, mutation.item.parentItemId)
        }
    }

    @Suppress("DEPRECATION")
    override suspend fun resetCheckedItems(listId: String) {
        database.withTransaction {
            dao.getActiveItems(listId)
                .filter { it.isChecked }
                .forEach { item ->
                    dao.updateChecked(item.id, false, null, timeProvider.nowEpochMillis())
                }
        }
    }

    @Suppress("DEPRECATION")
    override suspend fun clearCheckedItems(listId: String) {
        database.withTransaction {
            dao.getActiveItems(listId)
                .filter { it.isChecked && it.parentItemId == null }
                .forEach { archiveItem(it.id) }
        }
    }

    private suspend fun swapListOrders(
        firstId: String,
        firstOrder: Long,
        secondId: String,
        secondOrder: Long,
    ) {
        val now = timeProvider.nowEpochMillis()
        dao.updateListSortOrder(firstId, secondOrder, now)
        dao.updateListSortOrder(secondId, firstOrder, now)
    }

    private suspend fun swapItemOrders(
        first: com.arrow2851.nudge.core.database.ListItemEntity,
        second: com.arrow2851.nudge.core.database.ListItemEntity,
    ) {
        val now = timeProvider.nowEpochMillis()
        dao.updateItemSortOrder(first.id, second.sortOrder, now)
        dao.updateItemSortOrder(second.id, first.sortOrder, now)
    }

    private suspend fun rebalance(listId: String, parentItemId: String?) {
        val now = timeProvider.nowEpochMillis()
        dao.getSiblings(listId, parentItemId).forEachIndexed { index, item ->
            dao.updateItemSortOrder(item.id, SortOrders.initial(index), now)
        }
    }
}

fun normalizeListItemName(value: String): String = normalizeName(value)

private fun normalizeName(value: String): String = value
    .trim()
    .lowercase()
    .replace(Regex("\\s+"), " ")
