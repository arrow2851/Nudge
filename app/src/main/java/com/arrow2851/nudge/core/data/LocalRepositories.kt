package com.arrow2851.nudge.core.data

import androidx.room.withTransaction
import com.arrow2851.nudge.core.database.AreaDao
import com.arrow2851.nudge.core.database.ChoreDao
import com.arrow2851.nudge.core.database.CompletionDao
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.database.ReusableListDao
import com.arrow2851.nudge.core.database.TaskDao
import com.arrow2851.nudge.core.database.TaskMainFlagEntity
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
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TaskRecord
import com.arrow2851.nudge.core.model.TaskStatus
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.model.toTaskNodes
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class LocalAreaRepository @Inject constructor(
    private val areaDao: AreaDao,
) : AreaRepository {
    override fun observeAreas(): Flow<List<Area>> = areaDao.observeActiveAreas()
        .map { areas -> areas.map { it.toDomain() } }

    override fun observeArea(areaId: String): Flow<AreaWithSections?> =
        areaDao.observeAreaWithSections(areaId).map { it?.toDomain() }

    override suspend fun saveArea(area: Area) = areaDao.upsertArea(area.toEntity())

    override suspend fun saveSection(section: Section) = areaDao.upsertSection(section.toEntity())

    override suspend fun archiveArea(areaId: String, archivedAt: Long) =
        areaDao.archiveArea(areaId, archivedAt)

    override suspend fun archiveSection(sectionId: String, archivedAt: Long) =
        areaDao.archiveSection(sectionId, archivedAt)
}

class LocalTaskRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val taskDao: TaskDao,
    private val timeProvider: TimeProvider,
) : TaskRepository {
    private val operationsDao
        get() = database.taskOperationsDao()

    override fun observeTaskNodes(): Flow<List<TaskNode>> = operationsDao.observeTaskRecords()
        .map { records ->
            records.map { record ->
                TaskRecord(
                    task = record.task.toDomain(),
                    isMainTask = record.isMainTask,
                )
            }.toTaskNodes()
        }

    override fun observeRootTasks(): Flow<List<Task>> = taskDao.observeRootTasks()
        .map { tasks -> tasks.map { it.toDomain() } }

    override fun observeSubtasks(parentTaskId: String): Flow<List<Task>> =
        taskDao.observeSubtasks(parentTaskId).map { tasks -> tasks.map { it.toDomain() } }

    override fun observeTask(taskId: String): Flow<Task?> =
        taskDao.observeTask(taskId).map { it?.toDomain() }

    override suspend fun saveTask(task: Task) = taskDao.upsertTask(task.toEntity())

    override suspend fun setCompleted(taskId: String, completedAt: Long?) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val updatedAt = timeProvider.nowEpochMillis()
            val children = operationsDao.getChildren(taskId)

            updateCompletion(taskId, completedAt, updatedAt)

            if (children.isNotEmpty()) {
                children.forEach { child ->
                    updateCompletion(child.id, completedAt, updatedAt)
                }
                return@withTransaction
            }

            val parentId = task.parentTaskId ?: return@withTransaction
            val siblings = operationsDao.getChildren(parentId)
            val allChildrenCompleted = siblings.all { sibling ->
                if (sibling.id == taskId) completedAt != null else sibling.completedAt != null
            }
            updateCompletion(
                taskId = parentId,
                completedAt = if (allChildrenCompleted) completedAt ?: updatedAt else null,
                updatedAt = updatedAt,
            )
        }
    }

    override suspend fun setMainTask(taskId: String, enabled: Boolean) {
        database.withTransaction {
            if (enabled) {
                operationsDao.setMainTask(TaskMainFlagEntity(taskId))
                return@withTransaction
            }

            val parent = operationsDao.getTask(taskId) ?: return@withTransaction
            val children = operationsDao.getChildren(taskId)
            operationsDao.clearMainTask(taskId)
            children.forEachIndexed { index, child ->
                operationsDao.updateParentAndOrder(
                    taskId = child.id,
                    parentTaskId = null,
                    sortOrder = parent.sortOrder + index + 1L,
                    updatedAt = timeProvider.nowEpochMillis(),
                )
            }
            if (children.isNotEmpty()) rebalance(parentTaskId = null)
        }
    }

    override suspend fun moveTask(taskId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val siblings = operationsDao.getSiblings(task.parentTaskId)
                .filter { (it.completedAt != null) == (task.completedAt != null) }
            val currentIndex = siblings.indexOfFirst { it.id == taskId }
            val targetIndex = currentIndex + direction.coerceIn(-1, 1)
            if (currentIndex < 0 || targetIndex !in siblings.indices) return@withTransaction

            val target = siblings[targetIndex]
            val updatedAt = timeProvider.nowEpochMillis()
            operationsDao.updateSortOrder(task.id, target.sortOrder, updatedAt)
            operationsDao.updateSortOrder(target.id, task.sortOrder, updatedAt)
        }
    }

    override suspend fun indentTask(taskId: String) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            if (task.parentTaskId != null) return@withTransaction

            val roots = operationsDao.getSiblings(null)
                .filter { (it.completedAt != null) == (task.completedAt != null) }
            val index = roots.indexOfFirst { it.id == taskId }
            if (index <= 0) return@withTransaction

            val newParent = roots[index - 1]
            val updatedAt = timeProvider.nowEpochMillis()
            operationsDao.setMainTask(TaskMainFlagEntity(newParent.id))
            operationsDao.updateParentAndOrder(
                taskId = task.id,
                parentTaskId = newParent.id,
                sortOrder = SortOrders.after(
                    operationsDao.getMaxSortOrder(newParent.id) ?: -SortOrders.Gap,
                ),
                updatedAt = updatedAt,
            )
        }
    }

    override suspend fun unindentTask(taskId: String) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val parentId = task.parentTaskId ?: return@withTransaction
            val parent = operationsDao.getTask(parentId) ?: return@withTransaction
            operationsDao.updateParentAndOrder(
                taskId = task.id,
                parentTaskId = null,
                sortOrder = parent.sortOrder + 1L,
                updatedAt = timeProvider.nowEpochMillis(),
            )
            rebalance(parentTaskId = null)
        }
    }

    override suspend fun archiveTask(taskId: String, archivedAt: Long) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val children = operationsDao.getChildren(taskId)
            children.forEachIndexed { index, child ->
                operationsDao.updateParentAndOrder(
                    taskId = child.id,
                    parentTaskId = null,
                    sortOrder = task.sortOrder + index + 1L,
                    updatedAt = archivedAt,
                )
            }
            operationsDao.clearMainTask(taskId)
            operationsDao.archiveTask(taskId, archivedAt)
            if (children.isNotEmpty()) rebalance(parentTaskId = null)
        }
    }

    private suspend fun updateCompletion(
        taskId: String,
        completedAt: Long?,
        updatedAt: Long,
    ) {
        operationsDao.updateCompletion(
            taskId = taskId,
            status = if (completedAt == null) TaskStatus.Inbox.name else TaskStatus.Completed.name,
            completedAt = completedAt,
            updatedAt = updatedAt,
        )
    }

    private suspend fun rebalance(parentTaskId: String?) {
        val updatedAt = timeProvider.nowEpochMillis()
        operationsDao.getSiblings(parentTaskId).forEachIndexed { index, task ->
            operationsDao.updateSortOrder(
                taskId = task.id,
                sortOrder = SortOrders.initial(index),
                updatedAt = updatedAt,
            )
        }
    }
}

class LocalChoreRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val choreDao: ChoreDao,
) : ChoreRepository {
    override fun observeChores(): Flow<List<Chore>> = choreDao.observeActiveChores()
        .map { chores -> chores.map { it.toDomain() } }

    override fun observeChoresForArea(areaId: String): Flow<List<Chore>> =
        choreDao.observeChoresForArea(areaId).map { chores -> chores.map { it.toDomain() } }

    override fun observeChore(choreId: String): Flow<ChoreWithSchedule?> =
        choreDao.observeChoreWithSchedule(choreId).map { it?.toDomain() }

    override suspend fun saveChore(chore: ChoreWithSchedule) {
        database.withTransaction {
            choreDao.upsertChore(chore.chore.toEntity())
            chore.schedule?.let { choreDao.upsertSchedule(it.toEntity()) }
        }
    }

    override suspend fun archiveChore(choreId: String, archivedAt: Long) =
        choreDao.archiveChore(choreId, archivedAt)
}

class LocalCompletionRepository @Inject constructor(
    private val completionDao: CompletionDao,
) : CompletionRepository {
    override fun observeTaskCompletions(taskId: String): Flow<List<Completion>> =
        completionDao.observeTaskCompletions(taskId)
            .map { completions -> completions.map { it.toDomain() } }

    override fun observeChoreCompletions(choreId: String): Flow<List<Completion>> =
        completionDao.observeChoreCompletions(choreId)
            .map { completions -> completions.map { it.toDomain() } }

    override suspend fun recordCompletion(completion: Completion) =
        completionDao.insertCompletion(completion.toEntity())
}

class LocalReusableListRepository @Inject constructor(
    private val reusableListDao: ReusableListDao,
    private val timeProvider: TimeProvider,
) : ReusableListRepository {
    override fun observeLists(): Flow<List<ReusableList>> = reusableListDao.observeActiveLists()
        .map { lists -> lists.map { it.toDomain() } }

    override fun observeList(listId: String): Flow<ReusableListWithItems?> =
        reusableListDao.observeListWithItems(listId).map { it?.toDomain() }

    override fun observeSuggestions(
        normalizedPrefix: String,
        limit: Int,
    ): Flow<List<ListCatalogItem>> = reusableListDao
        .observeCatalogSuggestions(normalizedPrefix.trim().lowercase(), limit)
        .map { items -> items.map { it.toDomain() } }

    override suspend fun saveList(list: ReusableList) = reusableListDao.upsertList(list.toEntity())

    override suspend fun saveItem(item: ListItem) = reusableListDao.upsertItem(item.toEntity())

    override suspend fun saveCatalogItem(item: ListCatalogItem) =
        reusableListDao.upsertCatalogItem(item.toEntity())

    override suspend fun setItemChecked(itemId: String, checkedAt: Long?) =
        reusableListDao.updateChecked(
            itemId = itemId,
            checked = checkedAt != null,
            checkedAt = checkedAt,
            updatedAt = timeProvider.nowEpochMillis(),
        )

    override suspend fun archiveList(listId: String, archivedAt: Long) =
        reusableListDao.archiveList(listId, archivedAt)
}
