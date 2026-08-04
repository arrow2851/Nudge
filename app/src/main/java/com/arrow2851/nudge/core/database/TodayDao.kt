package com.arrow2851.nudge.core.database

import androidx.room.Dao
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface TodayDao {
    @Query(
        """
        SELECT * FROM completions
        ORDER BY completed_at DESC
        LIMIT :limit
        """,
    )
    fun observeRecentCompletions(limit: Int = 40): Flow<List<CompletionEntity>>
}
