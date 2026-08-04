package com.arrow2851.nudge.core.data

import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.Completion
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

interface RecentCompletionReader {
    fun observeRecent(limit: Int = 40): Flow<List<Completion>>
}

class RoomRecentCompletionReader @Inject constructor(
    database: NudgeDatabase,
) : RecentCompletionReader {
    private val dao = database.todayDao()

    override fun observeRecent(limit: Int): Flow<List<Completion>> =
        dao.observeRecentCompletions(limit).map { rows -> rows.map { it.toDomain() } }
}
