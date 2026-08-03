package com.arrow2851.nudge.core.database

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface ListOperationsDao {
    @Transaction
    @Query("SELECT * FROM reusable_lists WHERE archived_at IS NULL ORDER BY sort_order, name")
    fun observeActiveListsWithItems(): Flow<List<ReusableListWithItemsEntity>>

    @Transaction
    @Query("SELECT * FROM reusable_lists WHERE id = :listId AND archived_at IS NULL LIMIT 1")
    fun observeActiveListWithItems(listId: String): Flow<ReusableListWithItemsEntity?>

    @Query("SELECT * FROM reusable_lists WHERE id = :listId LIMIT 1")
    suspend fun getList(listId: String): ReusableListEntity?

    @Query("SELECT * FROM list_items WHERE id = :itemId LIMIT 1")
    suspend fun getItem(itemId: String): ListItemEntity?

    @Query(
        """
        SELECT * FROM list_items
        WHERE list_id = :listId
          AND archived_at IS NULL
          AND ((:parentItemId IS NULL AND parent_item_id IS NULL) OR parent_item_id = :parentItemId)
        ORDER BY is_checked, sort_order
        """,
    )
    suspend fun getSiblings(listId: String, parentItemId: String?): List<ListItemEntity>

    @Query(
        """
        SELECT * FROM list_items
        WHERE parent_item_id = :parentItemId AND archived_at IS NULL
        ORDER BY is_checked, sort_order
        """,
    )
    suspend fun getChildren(parentItemId: String): List<ListItemEntity>

    @Query("SELECT MAX(sort_order) FROM reusable_lists WHERE archived_at IS NULL")
    suspend fun getMaxListSortOrder(): Long?

    @Query(
        """
        SELECT MAX(sort_order) FROM list_items
        WHERE list_id = :listId
          AND archived_at IS NULL
          AND ((:parentItemId IS NULL AND parent_item_id IS NULL) OR parent_item_id = :parentItemId)
        """,
    )
    suspend fun getMaxItemSortOrder(listId: String, parentItemId: String?): Long?

    @Query("SELECT * FROM list_catalog_items WHERE normalized_name = :normalizedName LIMIT 1")
    suspend fun getCatalogItem(normalizedName: String): ListCatalogItemEntity?

    @Query(
        """
        SELECT * FROM list_catalog_items
        WHERE normalized_name LIKE :normalizedPrefix || '%'
        ORDER BY favorite DESC, times_used DESC, last_used_at DESC, display_name
        LIMIT :limit
        """,
    )
    fun observeCatalogSuggestions(
        normalizedPrefix: String,
        limit: Int = 8,
    ): Flow<List<ListCatalogItemEntity>>

    @Upsert
    suspend fun upsertList(list: ReusableListEntity)

    @Upsert
    suspend fun upsertItem(item: ListItemEntity)

    @Upsert
    suspend fun upsertCatalogItem(item: ListCatalogItemEntity)

    @Query("UPDATE reusable_lists SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :listId")
    suspend fun updateListSortOrder(listId: String, sortOrder: Long, updatedAt: Long)

    @Query(
        """
        UPDATE list_items
        SET is_checked = :checked,
            checked_at = :checkedAt,
            updated_at = :updatedAt
        WHERE id = :itemId
        """,
    )
    suspend fun updateChecked(
        itemId: String,
        checked: Boolean,
        checkedAt: Long?,
        updatedAt: Long,
    )

    @Query("UPDATE list_items SET catalog_item_id = :catalogItemId, updated_at = :updatedAt WHERE id = :itemId")
    suspend fun updateCatalogLink(itemId: String, catalogItemId: String, updatedAt: Long)

    @Query(
        """
        UPDATE list_items
        SET parent_item_id = :parentItemId,
            sort_order = :sortOrder,
            updated_at = :updatedAt
        WHERE id = :itemId
        """,
    )
    suspend fun updateParentAndOrder(
        itemId: String,
        parentItemId: String?,
        sortOrder: Long,
        updatedAt: Long,
    )

    @Query("UPDATE list_items SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :itemId")
    suspend fun updateItemSortOrder(itemId: String, sortOrder: Long, updatedAt: Long)

    @Query("UPDATE list_items SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :itemId")
    suspend fun archiveItem(itemId: String, archivedAt: Long)

    @Query(
        """
        UPDATE list_items
        SET is_checked = 0,
            checked_at = NULL,
            updated_at = :updatedAt
        WHERE list_id = :listId AND archived_at IS NULL AND is_checked = 1
        """,
    )
    suspend fun resetCheckedItems(listId: String, updatedAt: Long)

    @Query(
        """
        UPDATE list_items
        SET archived_at = :archivedAt,
            updated_at = :archivedAt
        WHERE list_id = :listId AND archived_at IS NULL AND is_checked = 1
        """,
    )
    suspend fun archiveCheckedItems(listId: String, archivedAt: Long)

    @Query("UPDATE reusable_lists SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :listId")
    suspend fun archiveList(listId: String, archivedAt: Long)
}
