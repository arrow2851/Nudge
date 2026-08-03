package com.arrow2851.nudge.core.database

import androidx.room.ColumnInfo
import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import androidx.room.Relation
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.CompletionSource
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.TaskStatus

@Entity(
    tableName = "areas",
    indices = [Index(value = ["sort_order"])],
)
data class AreaEntity(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String?,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

@Entity(
    tableName = "sections",
    foreignKeys = [
        ForeignKey(
            entity = AreaEntity::class,
            parentColumns = ["id"],
            childColumns = ["area_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [
        Index(value = ["area_id"]),
        Index(value = ["area_id", "sort_order"]),
    ],
)
data class SectionEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "area_id") val areaId: String,
    val name: String,
    val icon: String?,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

@Entity(
    tableName = "tasks",
    foreignKeys = [
        ForeignKey(
            entity = TaskEntity::class,
            parentColumns = ["id"],
            childColumns = ["parent_task_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
        ForeignKey(
            entity = AreaEntity::class,
            parentColumns = ["id"],
            childColumns = ["area_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
        ForeignKey(
            entity = SectionEntity::class,
            parentColumns = ["id"],
            childColumns = ["section_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [
        Index(value = ["parent_task_id"]),
        Index(value = ["area_id"]),
        Index(value = ["section_id"]),
        Index(value = ["sort_order"]),
        Index(value = ["due_at"]),
    ],
)
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String?,
    @ColumnInfo(name = "parent_task_id") val parentTaskId: String?,
    @ColumnInfo(name = "area_id") val areaId: String?,
    @ColumnInfo(name = "section_id") val sectionId: String?,
    val status: TaskStatus,
    val priority: Int,
    @ColumnInfo(name = "estimated_minutes") val estimatedMinutes: Int?,
    @ColumnInfo(name = "due_at") val dueAt: Long?,
    @ColumnInfo(name = "include_in_nudges") val includeInNudges: Boolean,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "completed_at") val completedAt: Long?,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

@Entity(
    tableName = "chores",
    foreignKeys = [
        ForeignKey(
            entity = AreaEntity::class,
            parentColumns = ["id"],
            childColumns = ["area_id"],
            onDelete = ForeignKey.CASCADE,
        ),
        ForeignKey(
            entity = SectionEntity::class,
            parentColumns = ["id"],
            childColumns = ["section_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [
        Index(value = ["area_id"]),
        Index(value = ["section_id"]),
        Index(value = ["area_id", "sort_order"]),
        Index(value = ["next_due_at"]),
    ],
)
data class ChoreEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String?,
    @ColumnInfo(name = "area_id") val areaId: String,
    @ColumnInfo(name = "section_id") val sectionId: String?,
    val priority: Int,
    @ColumnInfo(name = "estimated_minutes") val estimatedMinutes: Int?,
    @ColumnInfo(name = "include_in_nudges") val includeInNudges: Boolean,
    @ColumnInfo(name = "supports_grading") val supportsGrading: Boolean,
    @ColumnInfo(name = "default_grade") val defaultGrade: CompletionGrade,
    @ColumnInfo(name = "next_due_at") val nextDueAt: Long?,
    @ColumnInfo(name = "is_paused") val isPaused: Boolean,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

@Entity(
    tableName = "chore_schedules",
    foreignKeys = [
        ForeignKey(
            entity = ChoreEntity::class,
            parentColumns = ["id"],
            childColumns = ["chore_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index(value = ["chore_id"], unique = true)],
)
data class ChoreScheduleEntity(
    @PrimaryKey
    @ColumnInfo(name = "chore_id")
    val choreId: String,
    @ColumnInfo(name = "recurrence_type") val recurrenceType: RecurrenceType,
    @ColumnInfo(name = "interval_value") val intervalValue: Int?,
    @ColumnInfo(name = "interval_unit") val intervalUnit: RecurrenceUnit?,
    @ColumnInfo(name = "days_of_week") val daysOfWeek: Set<Int>,
    @ColumnInfo(name = "day_of_month") val dayOfMonth: Int?,
    @ColumnInfo(name = "schedule_basis") val scheduleBasis: ScheduleBasis,
)

@Entity(
    tableName = "completions",
    foreignKeys = [
        ForeignKey(
            entity = TaskEntity::class,
            parentColumns = ["id"],
            childColumns = ["task_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
        ForeignKey(
            entity = ChoreEntity::class,
            parentColumns = ["id"],
            childColumns = ["chore_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [
        Index(value = ["task_id"]),
        Index(value = ["chore_id"]),
        Index(value = ["completed_at"]),
    ],
)
data class CompletionEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "task_id") val taskId: String?,
    @ColumnInfo(name = "chore_id") val choreId: String?,
    @ColumnInfo(name = "completed_at") val completedAt: Long,
    val grade: CompletionGrade,
    @ColumnInfo(name = "duration_minutes") val durationMinutes: Int?,
    val note: String?,
    val source: CompletionSource,
)

@Entity(
    tableName = "reusable_lists",
    indices = [Index(value = ["sort_order"])],
)
data class ReusableListEntity(
    @PrimaryKey val id: String,
    val name: String,
    val icon: String?,
    @ColumnInfo(name = "is_reusable") val isReusable: Boolean,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

@Entity(
    tableName = "list_catalog_items",
    indices = [Index(value = ["normalized_name"], unique = true)],
)
data class ListCatalogItemEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "normalized_name") val normalizedName: String,
    @ColumnInfo(name = "display_name") val displayName: String,
    val category: String?,
    @ColumnInfo(name = "default_quantity") val defaultQuantity: String?,
    @ColumnInfo(name = "times_used") val timesUsed: Int,
    @ColumnInfo(name = "last_used_at") val lastUsedAt: Long?,
    val favorite: Boolean,
)

@Entity(
    tableName = "list_items",
    foreignKeys = [
        ForeignKey(
            entity = ReusableListEntity::class,
            parentColumns = ["id"],
            childColumns = ["list_id"],
            onDelete = ForeignKey.CASCADE,
        ),
        ForeignKey(
            entity = ListItemEntity::class,
            parentColumns = ["id"],
            childColumns = ["parent_item_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
        ForeignKey(
            entity = ListCatalogItemEntity::class,
            parentColumns = ["id"],
            childColumns = ["catalog_item_id"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [
        Index(value = ["list_id"]),
        Index(value = ["parent_item_id"]),
        Index(value = ["catalog_item_id"]),
        Index(value = ["list_id", "sort_order"]),
    ],
)
data class ListItemEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "list_id") val listId: String,
    @ColumnInfo(name = "parent_item_id") val parentItemId: String?,
    @ColumnInfo(name = "catalog_item_id") val catalogItemId: String?,
    val name: String,
    val quantity: String?,
    @ColumnInfo(name = "is_checked") val isChecked: Boolean,
    @ColumnInfo(name = "sort_order") val sortOrder: Long,
    @ColumnInfo(name = "added_at") val addedAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
    @ColumnInfo(name = "checked_at") val checkedAt: Long?,
    @ColumnInfo(name = "archived_at") val archivedAt: Long?,
)

data class AreaWithSectionsEntity(
    @Embedded val area: AreaEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "area_id",
    )
    val sections: List<SectionEntity>,
)

data class ChoreWithScheduleEntity(
    @Embedded val chore: ChoreEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "chore_id",
    )
    val schedule: ChoreScheduleEntity?,
)

data class ReusableListWithItemsEntity(
    @Embedded val list: ReusableListEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "list_id",
    )
    val items: List<ListItemEntity>,
)
