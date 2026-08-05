package com.arrow2851.nudge.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.room.Room
import androidx.work.WorkManager
import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.CompletionRepository
import com.arrow2851.nudge.core.data.DataStorePreferencesRepository
import com.arrow2851.nudge.core.data.HistoryRepository
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.LocalAreaRepository
import com.arrow2851.nudge.core.data.LocalChoreRepository
import com.arrow2851.nudge.core.data.LocalCompletionRepository
import com.arrow2851.nudge.core.data.LocalHistoryRepository
import com.arrow2851.nudge.core.data.LocalReusableListRepository
import com.arrow2851.nudge.core.data.LocalTaskRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.RecentCompletionReader
import com.arrow2851.nudge.core.data.ReusableListRepository
import com.arrow2851.nudge.core.data.RoomListWorkflowRepository
import com.arrow2851.nudge.core.data.RoomRecentCompletionReader
import com.arrow2851.nudge.core.data.RoomTaskWorkflowRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.data.TaskWorkflowRepository
import com.arrow2851.nudge.core.database.AreaDao
import com.arrow2851.nudge.core.database.ChoreDao
import com.arrow2851.nudge.core.database.CompletionDao
import com.arrow2851.nudge.core.database.HistoryDao
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.database.NudgeMigrations
import com.arrow2851.nudge.core.database.ReusableListDao
import com.arrow2851.nudge.core.database.TaskDao
import com.arrow2851.nudge.core.intervention.AndroidInstalledAppReader
import com.arrow2851.nudge.core.intervention.AndroidUsageAccessController
import com.arrow2851.nudge.core.intervention.AndroidUsageEventReader
import com.arrow2851.nudge.core.intervention.DataStoreInterventionSettingsRepository
import com.arrow2851.nudge.core.intervention.InstalledAppReader
import com.arrow2851.nudge.core.intervention.InterventionSettingsRepository
import com.arrow2851.nudge.core.intervention.UsageAccessController
import com.arrow2851.nudge.core.intervention.UsageEventReader
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.SystemTimeProvider
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.model.UuidIdGenerator
import com.arrow2851.nudge.core.work.MaintenanceScheduler
import com.arrow2851.nudge.core.work.WorkManagerMaintenanceScheduler
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

private val Context.nudgePreferencesDataStore by preferencesDataStore(
    name = "nudge_preferences",
)

@Module
@InstallIn(SingletonComponent::class)
object PersistenceModule {
    @Provides
    @Singleton
    fun provideDatabase(
        @ApplicationContext context: Context,
    ): NudgeDatabase = Room.databaseBuilder(
        context,
        NudgeDatabase::class.java,
        NudgeDatabase.Name,
    )
        .addMigrations(*NudgeMigrations.All)
        .build()

    @Provides
    fun provideAreaDao(database: NudgeDatabase): AreaDao = database.areaDao()

    @Provides
    fun provideTaskDao(database: NudgeDatabase): TaskDao = database.taskDao()

    @Provides
    fun provideChoreDao(database: NudgeDatabase): ChoreDao = database.choreDao()

    @Provides
    fun provideCompletionDao(database: NudgeDatabase): CompletionDao = database.completionDao()

    @Provides
    fun provideHistoryDao(database: NudgeDatabase): HistoryDao = database.historyDao()

    @Provides
    fun provideReusableListDao(database: NudgeDatabase): ReusableListDao = database.reusableListDao()

    @Provides
    @Singleton
    fun providePreferencesDataStore(
        @ApplicationContext context: Context,
    ): DataStore<Preferences> = context.nudgePreferencesDataStore

    @Provides
    @Singleton
    fun provideWorkManager(
        @ApplicationContext context: Context,
    ): WorkManager = WorkManager.getInstance(context)
}

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    @Singleton
    abstract fun bindAreaRepository(implementation: LocalAreaRepository): AreaRepository

    @Binds
    @Singleton
    abstract fun bindTaskRepository(implementation: LocalTaskRepository): TaskRepository

    @Binds
    @Singleton
    abstract fun bindTaskWorkflowRepository(
        implementation: RoomTaskWorkflowRepository,
    ): TaskWorkflowRepository

    @Binds
    @Singleton
    abstract fun bindChoreRepository(implementation: LocalChoreRepository): ChoreRepository

    @Binds
    @Singleton
    abstract fun bindCompletionRepository(
        implementation: LocalCompletionRepository,
    ): CompletionRepository

    @Binds
    @Singleton
    abstract fun bindHistoryRepository(
        implementation: LocalHistoryRepository,
    ): HistoryRepository

    @Binds
    @Singleton
    abstract fun bindReusableListRepository(
        implementation: LocalReusableListRepository,
    ): ReusableListRepository

    @Binds
    @Singleton
    abstract fun bindListWorkflowRepository(
        implementation: RoomListWorkflowRepository,
    ): ListWorkflowRepository

    @Binds
    @Singleton
    abstract fun bindRecentCompletionReader(
        implementation: RoomRecentCompletionReader,
    ): RecentCompletionReader

    @Binds
    @Singleton
    abstract fun bindPreferencesRepository(
        implementation: DataStorePreferencesRepository,
    ): PreferencesRepository

    @Binds
    @Singleton
    abstract fun bindInterventionSettingsRepository(
        implementation: DataStoreInterventionSettingsRepository,
    ): InterventionSettingsRepository
}

@Module
@InstallIn(SingletonComponent::class)
abstract class InterventionPlatformModule {
    @Binds
    @Singleton
    abstract fun bindInstalledAppReader(
        implementation: AndroidInstalledAppReader,
    ): InstalledAppReader

    @Binds
    @Singleton
    abstract fun bindUsageAccessController(
        implementation: AndroidUsageAccessController,
    ): UsageAccessController

    @Binds
    @Singleton
    abstract fun bindUsageEventReader(
        implementation: AndroidUsageEventReader,
    ): UsageEventReader
}

@Module
@InstallIn(SingletonComponent::class)
abstract class CoreBindingsModule {
    @Binds
    @Singleton
    abstract fun bindIdGenerator(implementation: UuidIdGenerator): IdGenerator

    @Binds
    @Singleton
    abstract fun bindTimeProvider(implementation: SystemTimeProvider): TimeProvider

    @Binds
    @Singleton
    abstract fun bindMaintenanceScheduler(
        implementation: WorkManagerMaintenanceScheduler,
    ): MaintenanceScheduler
}
