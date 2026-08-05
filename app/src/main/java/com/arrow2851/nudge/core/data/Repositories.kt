package com.arrow2851.nudge.core.data

import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ItemHistoryEntry
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TemplateApplyResult
import com.arrow2851.nudge.core.model.ThemeMode
import kotlinx.coroutines.flow.Flow

data class TaskCompletionMutation(
    val previousCompletedAtByTask: Map<String, Long?>,
    val completedAtByTask: Map<String, Long?>,
    val createdHistoryIds: List<String> = emptyList(),
)

data class TaskArchiveMutation(
    val task: Task,
    val childSortOrders: Map<String, Long>,
    val historyId: String,
)

interface AreaRepository {
    fun observeAreas(): Flow<List<Area>>
    fun observeSections(): Flow<List<Section>>
    fun observeArea(areaId: String): Flow<AreaWithSections?>
    suspend fun saveArea(area: Area)
    suspend fun saveSection(section: Section)
    suspend fun createArea(name: String, icon: String? = null): Area
    suspend fun createSection(areaId: String, name: String, icon: String? = null): Section
    suspend fun moveArea(areaId: String, direction: Int)
    suspend fun moveSection(sectionId: String, direction: Int)
    suspend fun applyTemplate(areaId: String, kind: AreaTemplateKind): TemplateApplyResult
    suspend fun archiveArea(areaId: String, archivedAt: Long)
    suspend fun archiveSection(sectionId: String, archivedAt: Long)
}

interface TaskRepository {
    fun observeTaskNodes(): Flow<List<TaskNode>>
    fun observeRootTasks(): Flow<List<Task>>
    fun observeSubtasks(parentTaskId: String): Flow<List<Task>>
    fun observeTask(taskId: String): Flow<Task?>
    suspend fun saveTask(task: Task)
    suspend fun setCompleted(taskId: String, completedAt: Long?)
    suspend fun setMainTask(taskId: String, enabled: Boolean)
    suspend fun moveTask(taskId: String, direction: Int)
    suspend fun indentTask(taskId: String)
    suspend fun unindentTask(taskId: String)
    suspend fun archiveTask(taskId: String, archivedAt: Long)
}

interface TaskWorkflowRepository {
    suspend fun toggleCompletion(taskId: String): TaskCompletionMutation
    suspend fun undoCompletion(mutation: TaskCompletionMutation)
    suspend fun reorderTask(taskId: String, targetTaskId: String)
    suspend fun archiveTask(taskId: String): TaskArchiveMutation
    suspend fun undoArchive(mutation: TaskArchiveMutation)
}

interface ChoreRepository {
    fun observeChores(): Flow<List<Chore>>
    fun observeChoresWithSchedules(): Flow<List<ChoreWithSchedule>>
    fun observeChoresForArea(areaId: String): Flow<List<Chore>>
    fun observeChoresForAreaWithSchedules(areaId: String): Flow<List<ChoreWithSchedule>>
    fun observeChoresForSection(sectionId: String): Flow<List<ChoreWithSchedule>>
    fun observeChore(choreId: String): Flow<ChoreWithSchedule?>
    suspend fun saveChore(chore: ChoreWithSchedule)
    suspend fun completeChore(choreId: String, grade: CompletionGrade): ChoreCompletionMutation
    suspend fun undoCompletion(mutation: ChoreCompletionMutation)
    suspend fun setPaused(choreId: String, paused: Boolean)
    suspend fun skipOccurrence(choreId: String)
    suspend fun moveChore(choreId: String, direction: Int)
    suspend fun archiveChore(choreId: String, archivedAt: Long)
}

interface CompletionRepository {
    fun observeTaskCompletions(taskId: String): Flow<List<Completion>>
    fun observeChoreCompletions(choreId: String): Flow<List<Completion>>
    suspend fun recordCompletion(completion: Completion)
}

interface HistoryRepository {
    fun observeHistory(): Flow<List<ItemHistoryEntry>>
    suspend fun deleteEntry(historyId: String)
    suspend fun clearAll()
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
    suspend fun setItemHandedness(value: ItemHandedness)
}
