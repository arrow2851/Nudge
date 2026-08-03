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
        TaskMainFlagEntity::class,
        ChoreEntity::class,
        ChoreScheduleEntity::class,
        CompletionEntity::class,
        ReusableListEntity::class,
        ListCatalogItemEntity::class,
        ListItemEntity::class,
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
    abstract fun reusableListDao(): ReusableListDao
    abstract fun listOperationsDao(): ListOperationsDao

    companion object {
        const val Name = "nudge.db"
        const val Version = 2
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

    val All: Array<Migration> = arrayOf(Migration1To2)
}
