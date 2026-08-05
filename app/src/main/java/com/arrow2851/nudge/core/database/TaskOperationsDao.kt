package com.arrow2851.nudge.core.database

import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Embedded
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

data class TaskRecordEntity(
    @Embedded val task: TaskEntity,
    @ColumnInfo(name = "is_main_task") val isMainTask: Boolean,
)

@Dao
interface TaskOperationsDao {
    @Query(
        """
        SELECT tasks.*,
               CASE WHEN EXISTS(
                   SELECT 1 FROM tasks AS children
                   WHERE children.parent_task_id = tasks.id
                     AND children.archived_at IS NULL
               ) THEN 1 ELSE 0 END AS is_main_task
        FROM tasks
        WHERE tasks.archived_at IS NULL
        ORDER BY CASE WHEN tasks.completed_at IS NULL THEN 0 ELSE 1 END,
                 tasks.parent_task_id,
                 tasks.sort_order,
                 tasks.created_at
        """,
    )
    fun observeTaskRecords(): Flow<List<TaskRecordEntity>>

    @Query("SELECT * FROM tasks WHERE id = :taskId LIMIT 1")
    suspend fun getTask(taskId: String): TaskEntity?

    @Query(
        """
        SELECT * FROM tasks
        WHERE archived_at IS NULL
          AND ((parent_task_id = :parentTaskId) OR (parent_task_id IS NULL AND :parentTaskId IS NULL))
        ORDER BY CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END, sort_order, created_at
        """,
    )
    suspend fun getSiblings(parentTaskId: String?): List<TaskEntity>

    @Query(
        """
        SELECT * FROM tasks
        WHERE archived_at IS NULL AND parent_task_id = :parentTaskId
        ORDER BY CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END, sort_order, created_at
        """,
    )
    suspend fun getChildren(parentTaskId: String): List<TaskEntity>

    @Query(
        """
        SELECT MAX(sort_order) FROM tasks
        WHERE archived_at IS NULL
          AND ((parent_task_id = :parentTaskId) OR (parent_task_id IS NULL AND :parentTaskId IS NULL))
        """,
    )
    suspend fun getMaxSortOrder(parentTaskId: String?): Long?

    @Query(
        """
        UPDATE tasks
        SET parent_task_id = :parentTaskId,
            sort_order = :sortOrder,
            updated_at = :updatedAt
        WHERE id = :taskId
        """,
    )
    suspend fun updateParentAndOrder(
        taskId: String,
        parentTaskId: String?,
        sortOrder: Long,
        updatedAt: Long,
    )

    @Query(
        """
        UPDATE tasks
        SET sort_order = :sortOrder,
            updated_at = :updatedAt
        WHERE id = :taskId
        """,
    )
    suspend fun updateSortOrder(
        taskId: String,
        sortOrder: Long,
        updatedAt: Long,
    )

    @Query(
        """
        UPDATE tasks
        SET status = :status,
            completed_at = :completedAt,
            updated_at = :updatedAt
        WHERE id = :taskId
        """,
    )
    suspend fun updateCompletion(
        taskId: String,
        status: String,
        completedAt: Long?,
        updatedAt: Long,
    )

    @Query(
        """
        UPDATE tasks
        SET archived_at = :archivedAt,
            updated_at = :archivedAt
        WHERE id = :taskId
        """,
    )
    suspend fun archiveTask(taskId: String, archivedAt: Long)

    @Query(
        """
        UPDATE tasks
        SET archived_at = NULL,
            updated_at = :updatedAt
        WHERE id = :taskId
        """,
    )
    suspend fun restoreTask(taskId: String, updatedAt: Long)
}
