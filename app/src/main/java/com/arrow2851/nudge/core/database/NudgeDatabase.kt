package com.arrow2851.nudge.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.room.migration.Migration

@Database(
    entities = [
        AreaEntity::class,
        SectionEntity::class,
        TaskEntity::class,
        ChoreEntity::class,
        ChoreScheduleEntity::class,
        CompletionEntity::class,
        ReusableListEntity::class,
        ListCatalogItemEntity::class,
        ListItemEntity::class,
        ItemHistoryEntity::class,
    ],
    version = NudgeDatabase.Version,
    exportSchema = true,
)
@TypeConverters(DatabaseConverters::class)
abstract class NudgeDatabase : RoomDatabase() {
    abstract fun areaDao(): AreaDao
    abstract fun taskDao(): TaskDao
    abstract fun taskOperationsDao(): TaskOperationsDao
    abstract fun choreDao(): ChoreDao
    abstract fun careOperationsDao(): CareOperationsDao
    abstract fun completionDao(): CompletionDao
    abstract fun historyDao(): HistoryDao
    abstract fun todayDao(): TodayDao
    abstract fun reusableListDao(): ReusableListDao
    abstract fun listOperationsDao(): ListOperationsDao

    companion object {
        const val Name = "nudge.db"
        const val Version = 3
    }
}

object NudgeMigrations {
    val Migration1To2 = Migration(1, 2) { database ->
        database.execSQL(
            """
            CREATE TABLE IF NOT EXISTS `task_main_flags` (
                `task_id` TEXT NOT NULL,
                PRIMARY KEY(`task_id`),
                FOREIGN KEY(`task_id`) REFERENCES `tasks`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
            )
            """.trimIndent(),
        )
    }

    val Migration2To3 = Migration(2, 3) { database ->
        database.execSQL("DROP TABLE IF EXISTS `task_main_flags`")
        database.execSQL(
            """
            CREATE TABLE IF NOT EXISTS `item_history` (
                `id` TEXT NOT NULL,
                `item_type` TEXT NOT NULL,
                `event_type` TEXT NOT NULL,
                `source_item_id` TEXT,
                `title` TEXT NOT NULL,
                `detail` TEXT,
                `container_name` TEXT,
                `occurred_at` INTEGER NOT NULL,
                PRIMARY KEY(`id`)
            )
            """.trimIndent(),
        )
        database.execSQL(
            "CREATE INDEX IF NOT EXISTS `index_item_history_occurred_at` ON `item_history` (`occurred_at`)",
        )
        database.execSQL(
            "CREATE INDEX IF NOT EXISTS `index_item_history_item_type` ON `item_history` (`item_type`)",
        )
        database.execSQL(
            "CREATE INDEX IF NOT EXISTS `index_item_history_event_type` ON `item_history` (`event_type`)",
        )
        database.execSQL(
            "CREATE INDEX IF NOT EXISTS `index_item_history_source_item_id` ON `item_history` (`source_item_id`)",
        )
    }

    val All: Array<Migration> = arrayOf(Migration1To2, Migration2To3)
}
