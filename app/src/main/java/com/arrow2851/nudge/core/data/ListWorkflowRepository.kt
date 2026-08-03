package com.arrow2851.nudge.core.data

import androidx.room.withTransaction
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.IdGenerator
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
)

interface ListWorkflowRepository {
    fun observeLists(): Flow<List<ReusableListWithItems>>
    fun observeList(listId: String): Flow<ReusableListWithItems?>
    fun observeSuggestions(query: String, limit: Int = 8): Flow<List<ListCatalogItem>>

    suspend fun createList(name: String, isReusable: Boolean): ReusableList
    suspend fun saveList(list: ReusableList)
    suspend fun moveList(listId: String, direction: Int)
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
    suspend fun indentItem(itemId: String)
    suspend fun unindentItem(itemId: String)
    suspend fun archiveItem(itemId: String)
    suspend fun resetCheckedItems(listId: String)
    suspend fun clearCheckedItems(listId: String)
}

class RoomListWorkflowRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ListWorkflowRepository {
    private val dao
        get() = database.listOperationsDao()

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
            val current = lists[index]
            val target = lists[targetIndex]
            val now = timeProvider.nowEpochMillis()
            dao.updateListSortOrder(current.id, target.sortOrder, now)
            dao.updateListSortOrder(target.id, current.sortOrder, now)
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
        val now = timeProvider.nowEpochMillis()
        val checkedAt = now.takeIf { checked }
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
        }
        dao.updateChecked(itemId, checked, checkedAt, now)
        ListItemCheckMutation(
            itemId = itemId,
            previousCheckedAt = item.checkedAt,
            checkedAt = checkedAt,
        )
    }

    override suspend fun undoCheck(mutation: ListItemCheckMutation) {
        val previous = mutation.previousCheckedAt
        dao.updateChecked(
            itemId = mutation.itemId,
            checked = previous != null,
            checkedAt = previous,
            updatedAt = timeProvider.nowEpochMillis(),
        )
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
            val target = siblings[targetIndex]
            val now = timeProvider.nowEpochMillis()
            dao.updateItemSortOrder(item.id, target.sortOrder, now)
            dao.updateItemSortOrder(target.id, item.sortOrder, now)
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

    override suspend fun archiveItem(itemId: String) {
        database.withTransaction {
            val item = dao.getItem(itemId) ?: return@withTransaction
            val archivedAt = timeProvider.nowEpochMillis()
            releaseChildren(item, archivedAt)
            dao.archiveItem(itemId, archivedAt)
        }
    }

    override suspend fun resetCheckedItems(listId: String) {
        dao.resetCheckedItems(listId, timeProvider.nowEpochMillis())
    }

    override suspend fun clearCheckedItems(listId: String) {
        database.withTransaction {
            val archivedAt = timeProvider.nowEpochMillis()
            dao.getActiveItems(listId)
                .filter { it.isChecked && it.parentItemId == null }
                .forEach { releaseChildren(it, archivedAt) }
            dao.archiveCheckedItems(listId, archivedAt)
        }
    }

    private suspend fun releaseChildren(
        item: com.arrow2851.nudge.core.database.ListItemEntity,
        updatedAt: Long,
    ) {
        val children = dao.getChildren(item.id)
        children.forEachIndexed { index, child ->
            dao.updateParentAndOrder(
                itemId = child.id,
                parentItemId = null,
                sortOrder = item.sortOrder + index + 1L,
                updatedAt = updatedAt,
            )
        }
        if (children.isNotEmpty()) rebalance(item.listId, null)
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
