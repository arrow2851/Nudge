package com.arrow2851.nudge.core.data

import com.arrow2851.nudge.core.database.HistoryDao
import com.arrow2851.nudge.core.model.ItemHistoryEntry
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class LocalHistoryRepository @Inject constructor(
    private val historyDao: HistoryDao,
) : HistoryRepository {
    override fun observeHistory(): Flow<List<ItemHistoryEntry>> =
        historyDao.observeHistory().map { rows -> rows.map { it.toDomain() } }

    override suspend fun deleteEntry(historyId: String) {
        historyDao.delete(historyId)
    }

    override suspend fun clearAll() {
        historyDao.clearAll()
    }
}
