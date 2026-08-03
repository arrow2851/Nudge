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
    ],
    version = NudgeDatabase.Version,
    exportSchema = true,
)
@TypeConverters(DatabaseConverters::class)
abstract class NudgeDatabase : RoomDatabase() {
    abstract fun areaDao(): AreaDao
    abstract fun taskDao(): TaskDao
    abstract fun choreDao(): ChoreDao
    abstract fun completionDao(): CompletionDao
    abstract fun reusableListDao(): ReusableListDao

    companion object {
        const val Name = "nudge.db"
        const val Version = 1
    }
}

object NudgeMigrations {
    val All: Array<Migration> = emptyArray()
}
