package com.arrow2851.nudge.core.data

import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.ThemeMode
import kotlinx.coroutines.flow.Flow

interface AreaRepository {
    fun observeAreas(): Flow<List<Area>>
    fun observeArea(areaId: String): Flow<AreaWithSections?>
    suspend fun saveArea(area: Area)
    suspend fun saveSection(section: Section)
    suspend fun archiveArea(areaId: String, archivedAt: Long)
    suspend fun archiveSection(sectionId: String, archivedAt: Long)
}

interface TaskRepository {
    fun observeRootTasks(): Flow<List<Task>>
    fun observeSubtasks(parentTaskId: String): Flow<List<Task>>
    fun observeTask(taskId: String): Flow<Task?>
    suspend fun saveTask(task: Task)
    suspend fun setCompleted(taskId: String, completedAt: Long?)
    suspend fun archiveTask(taskId: String, archivedAt: Long)
}

interface ChoreRepository {
    fun observeChores(): Flow<List<Chore>>
    fun observeChoresForArea(areaId: String): Flow<List<Chore>>
    fun observeChore(choreId: String): Flow<ChoreWithSchedule?>
    suspend fun saveChore(chore: ChoreWithSchedule)
    suspend fun archiveChore(choreId: String, archivedAt: Long)
}

interface CompletionRepository {
    fun observeTaskCompletions(taskId: String): Flow<List<Completion>>
    fun observeChoreCompletions(choreId: String): Flow<List<Completion>>
    suspend fun recordCompletion(completion: Completion)
}

interface ReusableListRepository {
    fun observeLists(): Flow<List<ReusableList>>
    fun observeList(listId: String): Flow<ReusableListWithItems?>
    fun observeSuggestions(normalizedPrefix: String, limit: Int = 8): Flow<List<ListCatalogItem>>
    suspend fun saveList(list: ReusableList)
    suspend fun saveItem(item: ListItem)
    suspend fun saveCatalogItem(item: ListCatalogItem)
    suspend fun setItemChecked(itemId: String, checkedAt: Long?)
    suspend fun archiveList(listId: String, archivedAt: Long)
}

interface PreferencesRepository {
    val preferences: Flow<AppPreferences>

    suspend fun setThemeMode(value: ThemeMode)
    suspend fun setShowDueShorthand(value: Boolean)
    suspend fun setHideCompletedItems(value: Boolean)
    suspend fun setDailyProgressEnabled(value: Boolean)
    suspend fun setQuickWinEnabled(value: Boolean)
    suspend fun setDemoDataEnabled(value: Boolean)
}
