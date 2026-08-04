package com.arrow2851.nudge.core.backup

import android.content.Context
import android.net.Uri
import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.data.ReusableListRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private const val CurrentBackupFormat = 1

@Serializable
data class BackupTask(
    val task: Task,
    val isMainTask: Boolean,
)

@Serializable
data class NudgeBackup(
    val formatVersion: Int = CurrentBackupFormat,
    val exportedAt: Long,
    val areas: List<Area>,
    val sections: List<Section>,
    val tasks: List<BackupTask>,
    val chores: List<ChoreWithSchedule>,
    val lists: List<ReusableListWithItems>,
    val preferences: AppPreferences,
)

data class BackupSummary(
    val areas: Int,
    val sections: Int,
    val tasks: Int,
    val chores: Int,
    val lists: Int,
    val listItems: Int,
) {
    val itemCount: Int
        get() = areas + sections + tasks + chores + lists + listItems
}

class LocalBackupService @Inject constructor(
    @ApplicationContext private val context: Context,
    private val areaRepository: AreaRepository,
    private val taskRepository: TaskRepository,
    private val choreRepository: ChoreRepository,
    private val reusableListRepository: ReusableListRepository,
    private val preferencesRepository: PreferencesRepository,
    private val timeProvider: TimeProvider,
) {
    private val json = Json {
        prettyPrint = true
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    suspend fun exportTo(uri: Uri): BackupSummary = withContext(Dispatchers.IO) {
        val backup = createBackup()
        val output = context.contentResolver.openOutputStream(uri)
            ?: error("Could not open the selected backup destination")
        output.bufferedWriter().use { writer ->
            writer.write(json.encodeToString(backup))
        }
        backup.summary()
    }

    suspend fun restoreFrom(uri: Uri): BackupSummary = withContext(Dispatchers.IO) {
        val input = context.contentResolver.openInputStream(uri)
            ?: error("Could not open the selected backup file")
        val content = input.bufferedReader().use { it.readText() }
        val backup = json.decodeFromString<NudgeBackup>(content)
        require(backup.formatVersion in 1..CurrentBackupFormat) {
            "This backup format is newer than this version of Nudge"
        }
        restore(backup)
        backup.summary()
    }

    private suspend fun createBackup(): NudgeBackup {
        val taskNodes = taskRepository.observeTaskNodes().first()
        val lists = reusableListRepository.observeLists().first().mapNotNull { list ->
            reusableListRepository.observeList(list.id).first()
        }
        return NudgeBackup(
            exportedAt = timeProvider.nowEpochMillis(),
            areas = areaRepository.observeAreas().first(),
            sections = areaRepository.observeSections().first(),
            tasks = taskNodes.flatMap { node ->
                listOf(BackupTask(node.task, node.isMainTask)) +
                    node.subtasks.map { BackupTask(it, false) }
            },
            chores = choreRepository.observeChoresWithSchedules().first(),
            lists = lists,
            preferences = preferencesRepository.preferences.first(),
        )
    }

    private suspend fun restore(backup: NudgeBackup) {
        backup.areas.forEach { areaRepository.saveArea(it) }
        backup.sections.forEach { areaRepository.saveSection(it) }
        backup.tasks
            .sortedBy { it.task.parentTaskId != null }
            .forEach { taskRepository.saveTask(it.task) }
        backup.tasks
            .filter { it.isMainTask && it.task.parentTaskId == null }
            .forEach { taskRepository.setMainTask(it.task.id, true) }
        backup.chores.forEach { choreRepository.saveChore(it) }
        backup.lists.forEach { listWithItems ->
            reusableListRepository.saveList(listWithItems.list)
            listWithItems.items
                .sortedBy { it.parentItemId != null }
                .forEach { reusableListRepository.saveItem(it) }
        }
        backup.preferences.let { preferences ->
            preferencesRepository.setThemeMode(preferences.themeMode)
            preferencesRepository.setShowDueShorthand(preferences.showDueShorthand)
            preferencesRepository.setHideCompletedItems(preferences.hideCompletedItems)
            preferencesRepository.setDailyProgressEnabled(preferences.dailyProgressEnabled)
            preferencesRepository.setQuickWinEnabled(preferences.quickWinEnabled)
            preferencesRepository.setDemoDataEnabled(preferences.demoDataEnabled)
        }
    }

    private fun NudgeBackup.summary(): BackupSummary = BackupSummary(
        areas = areas.size,
        sections = sections.size,
        tasks = tasks.size,
        chores = chores.size,
        lists = lists.size,
        listItems = lists.sumOf { it.items.size },
    )

    companion object {
        const val SuggestedFileName = "nudge-backup.json"
    }
}
