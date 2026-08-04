package com.arrow2851.nudge.core.database

import androidx.room.Dao
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Upsert

@Dao
interface CareOperationsDao {
    @Query("SELECT * FROM areas WHERE id = :areaId LIMIT 1")
    suspend fun getArea(areaId: String): AreaEntity?

    @Query("SELECT * FROM sections WHERE id = :sectionId LIMIT 1")
    suspend fun getSection(sectionId: String): SectionEntity?

    @Query("SELECT * FROM areas WHERE archived_at IS NULL ORDER BY sort_order, name")
    suspend fun getActiveAreas(): List<AreaEntity>

    @Query("SELECT * FROM sections WHERE area_id = :areaId AND archived_at IS NULL ORDER BY sort_order, name")
    suspend fun getActiveSections(areaId: String): List<SectionEntity>

    @Query("SELECT MAX(sort_order) FROM areas WHERE archived_at IS NULL")
    suspend fun getMaxAreaSortOrder(): Long?

    @Query("SELECT MAX(sort_order) FROM sections WHERE area_id = :areaId AND archived_at IS NULL")
    suspend fun getMaxSectionSortOrder(areaId: String): Long?

    @Upsert
    suspend fun upsertArea(area: AreaEntity)

    @Upsert
    suspend fun upsertSection(section: SectionEntity)

    @Query("UPDATE areas SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :areaId")
    suspend fun updateAreaSortOrder(areaId: String, sortOrder: Long, updatedAt: Long)

    @Query("UPDATE sections SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :sectionId")
    suspend fun updateSectionSortOrder(sectionId: String, sortOrder: Long, updatedAt: Long)

    @Query("UPDATE areas SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :areaId")
    suspend fun archiveArea(areaId: String, archivedAt: Long)

    @Query("UPDATE sections SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :sectionId")
    suspend fun archiveSection(sectionId: String, archivedAt: Long)

    @Query("UPDATE sections SET archived_at = :archivedAt, updated_at = :archivedAt WHERE area_id = :areaId")
    suspend fun archiveSectionsForArea(areaId: String, archivedAt: Long)

    @Transaction
    @Query("SELECT * FROM chores WHERE id = :choreId LIMIT 1")
    suspend fun getChoreWithSchedule(choreId: String): ChoreWithScheduleEntity?

    @Query("SELECT * FROM chores WHERE area_id = :areaId AND archived_at IS NULL ORDER BY sort_order")
    suspend fun getActiveChoresForArea(areaId: String): List<ChoreEntity>

    @Query(
        """
        SELECT * FROM chores
        WHERE archived_at IS NULL
          AND area_id = :areaId
          AND ((section_id = :sectionId) OR (section_id IS NULL AND :sectionId IS NULL))
        ORDER BY sort_order
        """,
    )
    suspend fun getChoreSiblings(areaId: String, sectionId: String?): List<ChoreEntity>

    @Query(
        """
        SELECT MAX(sort_order) FROM chores
        WHERE archived_at IS NULL
          AND area_id = :areaId
          AND ((section_id = :sectionId) OR (section_id IS NULL AND :sectionId IS NULL))
        """,
    )
    suspend fun getMaxChoreSortOrder(areaId: String, sectionId: String?): Long?

    @Upsert
    suspend fun upsertChore(chore: ChoreEntity)

    @Upsert
    suspend fun upsertSchedule(schedule: ChoreScheduleEntity)

    @Query("DELETE FROM chore_schedules WHERE chore_id = :choreId")
    suspend fun deleteSchedule(choreId: String)

    @Query("UPDATE chores SET next_due_at = :nextDueAt, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updateNextDue(choreId: String, nextDueAt: Long?, updatedAt: Long)

    @Query("UPDATE chores SET is_paused = :paused, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updatePaused(choreId: String, paused: Boolean, updatedAt: Long)

    @Query("UPDATE chores SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updateChoreSortOrder(choreId: String, sortOrder: Long, updatedAt: Long)

    @Query("UPDATE chores SET section_id = NULL, updated_at = :updatedAt WHERE section_id = :sectionId AND archived_at IS NULL")
    suspend fun clearSectionForActiveChores(sectionId: String, updatedAt: Long)

    @Query("UPDATE chores SET archived_at = :archivedAt, updated_at = :archivedAt WHERE area_id = :areaId")
    suspend fun archiveChoresForArea(areaId: String, archivedAt: Long)

    @Query("UPDATE chores SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :choreId")
    suspend fun archiveChore(choreId: String, archivedAt: Long)

    @Upsert
    suspend fun upsertCompletion(completion: CompletionEntity)

    @Query("DELETE FROM completions WHERE id = :completionId")
    suspend fun deleteCompletion(completionId: String)
}
