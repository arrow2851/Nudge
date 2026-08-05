package com.arrow2851.nudge.core.database

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface HistoryDao {
    @Query("SELECT * FROM item_history ORDER BY occurred_at DESC, id DESC")
    fun observeHistory(): Flow<List<ItemHistoryEntity>>

    @Upsert
    suspend fun upsert(entry: ItemHistoryEntity)

    @Query("DELETE FROM item_history WHERE id = :historyId")
    suspend fun delete(historyId: String)

    @Query("DELETE FROM item_history WHERE id IN (:historyIds)")
    suspend fun deleteAll(historyIds: List<String>)

    @Query("DELETE FROM item_history")
    suspend fun clearAll()
}
