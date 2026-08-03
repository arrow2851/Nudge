package com.arrow2851.nudge.core.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface AreaDao {
    @Query("SELECT * FROM areas WHERE archived_at IS NULL ORDER BY sort_order, name")
    fun observeActiveAreas(): Flow<List<AreaEntity>>

    @Query("SELECT * FROM sections WHERE archived_at IS NULL ORDER BY area_id, sort_order, name")
    fun observeActiveSections(): Flow<List<SectionEntity>>

    @Transaction
    @Query("SELECT * FROM areas WHERE id = :areaId LIMIT 1")
    fun observeAreaWithSections(areaId: String): Flow<AreaWithSectionsEntity?>

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

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertArea(area: AreaEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAreas(areas: List<AreaEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSection(section: SectionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSections(sections: List<SectionEntity>)

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

    @Query("SELECT COUNT(*) FROM areas")
    suspend fun countAreas(): Int
}

@Dao
interface TaskDao {
    @Query(
        """
        SELECT * FROM tasks
        WHERE parent_task_id IS NULL AND archived_at IS NULL
        ORDER BY CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END, sort_order, created_at
        """,
    )
    fun observeRootTasks(): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE parent_task_id = :parentTaskId AND archived_at IS NULL ORDER BY sort_order")
    fun observeSubtasks(parentTaskId: String): Flow<List<TaskEntity>>

    @Query("SELECT * FROM tasks WHERE id = :taskId LIMIT 1")
    fun observeTask(taskId: String): Flow<TaskEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertTask(task: TaskEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertTasks(tasks: List<TaskEntity>)

    @Query(
        """
        UPDATE tasks
        SET status = :status,
            completed_at = :completedAt,
            updated_at = :updatedAt
        WHERE id = :taskId
        """,
    )
    suspend fun updateCompletion(taskId: String, status: String, completedAt: Long?, updatedAt: Long)

    @Query("UPDATE tasks SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :taskId")
    suspend fun archiveTask(taskId: String, archivedAt: Long)

    @Query("SELECT COUNT(*) FROM tasks")
    suspend fun countTasks(): Int
}

@Dao
interface ChoreDao {
    @Query("SELECT * FROM chores WHERE archived_at IS NULL ORDER BY area_id, sort_order, title")
    fun observeActiveChores(): Flow<List<ChoreEntity>>

    @Transaction
    @Query("SELECT * FROM chores WHERE archived_at IS NULL ORDER BY area_id, sort_order, title")
    fun observeActiveChoresWithSchedules(): Flow<List<ChoreWithScheduleEntity>>

    @Query(
        """
        SELECT * FROM chores
        WHERE area_id = :areaId AND archived_at IS NULL
        ORDER BY CASE WHEN next_due_at IS NULL THEN 1 ELSE 0 END, next_due_at, sort_order
        """,
    )
    fun observeChoresForArea(areaId: String): Flow<List<ChoreEntity>>

    @Transaction
    @Query(
        """
        SELECT * FROM chores
        WHERE area_id = :areaId AND archived_at IS NULL
        ORDER BY CASE WHEN is_paused = 1 THEN 3 WHEN next_due_at IS NULL THEN 2 ELSE 0 END,
                 next_due_at, sort_order
        """,
    )
    fun observeChoresForAreaWithSchedules(areaId: String): Flow<List<ChoreWithScheduleEntity>>

    @Transaction
    @Query(
        """
        SELECT * FROM chores
        WHERE section_id = :sectionId AND archived_at IS NULL
        ORDER BY CASE WHEN is_paused = 1 THEN 3 WHEN next_due_at IS NULL THEN 2 ELSE 0 END,
                 next_due_at, sort_order
        """,
    )
    fun observeChoresForSection(sectionId: String): Flow<List<ChoreWithScheduleEntity>>

    @Transaction
    @Query("SELECT * FROM chores WHERE id = :choreId LIMIT 1")
    fun observeChoreWithSchedule(choreId: String): Flow<ChoreWithScheduleEntity?>

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
    suspend fun getSiblings(areaId: String, sectionId: String?): List<ChoreEntity>

    @Query(
        """
        SELECT MAX(sort_order) FROM chores
        WHERE archived_at IS NULL
          AND area_id = :areaId
          AND ((section_id = :sectionId) OR (section_id IS NULL AND :sectionId IS NULL))
        """,
    )
    suspend fun getMaxSortOrder(areaId: String, sectionId: String?): Long?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertChore(chore: ChoreEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertChores(chores: List<ChoreEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSchedule(schedule: ChoreScheduleEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSchedules(schedules: List<ChoreScheduleEntity>)

    @Query("DELETE FROM chore_schedules WHERE chore_id = :choreId")
    suspend fun deleteSchedule(choreId: String)

    @Query("UPDATE chores SET next_due_at = :nextDueAt, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updateNextDue(choreId: String, nextDueAt: Long?, updatedAt: Long)

    @Query("UPDATE chores SET is_paused = :paused, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updatePaused(choreId: String, paused: Boolean, updatedAt: Long)

    @Query("UPDATE chores SET sort_order = :sortOrder, updated_at = :updatedAt WHERE id = :choreId")
    suspend fun updateSortOrder(choreId: String, sortOrder: Long, updatedAt: Long)

    @Query("UPDATE chores SET section_id = NULL, updated_at = :updatedAt WHERE section_id = :sectionId AND archived_at IS NULL")
    suspend fun clearSectionForActiveChores(sectionId: String, updatedAt: Long)

    @Query("UPDATE chores SET archived_at = :archivedAt, updated_at = :archivedAt WHERE area_id = :areaId")
    suspend fun archiveChoresForArea(areaId: String, archivedAt: Long)

    @Query("UPDATE chores SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :choreId")
    suspend fun archiveChore(choreId: String, archivedAt: Long)

    @Query("SELECT COUNT(*) FROM chores")
    suspend fun countChores(): Int
}

@Dao
interface CompletionDao {
    @Query("SELECT * FROM completions WHERE task_id = :taskId ORDER BY completed_at DESC")
    fun observeTaskCompletions(taskId: String): Flow<List<CompletionEntity>>

    @Query("SELECT * FROM completions WHERE chore_id = :choreId ORDER BY completed_at DESC")
    fun observeChoreCompletions(choreId: String): Flow<List<CompletionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCompletion(completion: CompletionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCompletions(completions: List<CompletionEntity>)

    @Query("DELETE FROM completions WHERE id = :completionId")
    suspend fun deleteCompletion(completionId: String)
}

@Dao
interface ReusableListDao {
    @Query("SELECT * FROM reusable_lists WHERE archived_at IS NULL ORDER BY sort_order, name")
    fun observeActiveLists(): Flow<List<ReusableListEntity>>

    @Transaction
    @Query("SELECT * FROM reusable_lists WHERE id = :listId LIMIT 1")
    fun observeListWithItems(listId: String): Flow<ReusableListWithItemsEntity?>

    @Query(
        """
        SELECT * FROM list_catalog_items
        WHERE normalized_name LIKE :normalizedPrefix || '%'
        ORDER BY favorite DESC, times_used DESC, last_used_at DESC
        LIMIT :limit
        """,
    )
    fun observeCatalogSuggestions(normalizedPrefix: String, limit: Int = 8): Flow<List<ListCatalogItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertList(list: ReusableListEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertLists(lists: List<ReusableListEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertItem(item: ListItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertItems(items: List<ListItemEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertCatalogItem(item: ListCatalogItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertCatalogItems(items: List<ListCatalogItemEntity>)

    @Query(
        """
        UPDATE list_items
        SET is_checked = :checked, checked_at = :checkedAt, updated_at = :updatedAt
        WHERE id = :itemId
        """,
    )
    suspend fun updateChecked(itemId: String, checked: Boolean, checkedAt: Long?, updatedAt: Long)

    @Query("UPDATE reusable_lists SET archived_at = :archivedAt, updated_at = :archivedAt WHERE id = :listId")
    suspend fun archiveList(listId: String, archivedAt: Long)

    @Query("SELECT COUNT(*) FROM reusable_lists")
    suspend fun countLists(): Int
}
