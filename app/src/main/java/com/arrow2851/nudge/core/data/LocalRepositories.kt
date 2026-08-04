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
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.AreaTemplates
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreRecurrence
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.CompletionSource
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskNode
import com.arrow2851.nudge.core.model.TaskRecord
import com.arrow2851.nudge.core.model.TaskStatus
import com.arrow2851.nudge.core.model.TemplateApplyResult
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.model.toTaskNodes
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class LocalAreaRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val areaDao: AreaDao,
    private val choreDao: ChoreDao,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : AreaRepository {
    private val operations
        get() = database.careOperationsDao()

    override fun observeAreas(): Flow<List<Area>> = areaDao.observeActiveAreas()
        .map { areas -> areas.map { it.toDomain() } }

    override fun observeSections(): Flow<List<Section>> = areaDao.observeActiveSections()
        .map { sections -> sections.map { it.toDomain() } }

    override fun observeArea(areaId: String): Flow<AreaWithSections?> =
        areaDao.observeAreaWithSections(areaId).map { it?.toDomain() }

    override suspend fun saveArea(area: Area) = operations.upsertArea(area.toEntity())

    override suspend fun saveSection(section: Section) = operations.upsertSection(section.toEntity())

    override suspend fun createArea(name: String, icon: String?): Area {
        val now = timeProvider.nowEpochMillis()
        val area = Area(
            id = idGenerator.newId(),
            name = name.trim(),
            icon = icon,
            sortOrder = SortOrders.after(
                operations.getMaxAreaSortOrder() ?: -SortOrders.Gap,
            ),
            createdAt = now,
            updatedAt = now,
        )
        operations.upsertArea(area.toEntity())
        return area
    }

    override suspend fun createSection(areaId: String, name: String, icon: String?): Section {
        val now = timeProvider.nowEpochMillis()
        val section = Section(
            id = idGenerator.newId(),
            areaId = areaId,
            name = name.trim(),
            icon = icon,
            sortOrder = SortOrders.after(
                operations.getMaxSectionSortOrder(areaId) ?: -SortOrders.Gap,
            ),
            createdAt = now,
            updatedAt = now,
        )
        operations.upsertSection(section.toEntity())
        return section
    }

    override suspend fun moveArea(areaId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val areas = operations.getActiveAreas()
            val index = areas.indexOfFirst { it.id == areaId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in areas.indices) return@withTransaction
            val target = areas[targetIndex]
            val current = areas[index]
            val now = timeProvider.nowEpochMillis()
            operations.updateAreaSortOrder(current.id, target.sortOrder, now)
            operations.updateAreaSortOrder(target.id, current.sortOrder, now)
        }
    }

    override suspend fun moveSection(sectionId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val section = operations.getSection(sectionId) ?: return@withTransaction
            val sections = operations.getActiveSections(section.areaId)
            val index = sections.indexOfFirst { it.id == sectionId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in sections.indices) return@withTransaction
            val target = sections[targetIndex]
            val now = timeProvider.nowEpochMillis()
            operations.updateSectionSortOrder(section.id, target.sortOrder, now)
            operations.updateSectionSortOrder(target.id, section.sortOrder, now)
        }
    }

    override suspend fun applyTemplate(
        areaId: String,
        kind: AreaTemplateKind,
    ): TemplateApplyResult = database.withTransaction {
        operations.getArea(areaId) ?: return@withTransaction TemplateApplyResult(0, 0)
        val template = AreaTemplates.definition(kind)
        val now = timeProvider.nowEpochMillis()
        val existingSections = operations.getActiveSections(areaId)
        val sectionsByName = existingSections.associateBy { normalize(it.name) }.toMutableMap()
        var nextSectionOrder = operations.getMaxSectionSortOrder(areaId) ?: -SortOrders.Gap
        var sectionsAdded = 0

        template.sections.forEach { templateSection ->
            val key = normalize(templateSection.name)
            if (key !in sectionsByName) {
                nextSectionOrder = SortOrders.after(nextSectionOrder)
                val section = Section(
                    id = idGenerator.newId(),
                    areaId = areaId,
                    name = templateSection.name,
                    icon = templateSection.icon,
                    sortOrder = nextSectionOrder,
                    createdAt = now,
                    updatedAt = now,
                )
                operations.upsertSection(section.toEntity())
                sectionsByName[key] = section.toEntity()
                sectionsAdded += 1
            }
        }

        val existingChores = operations.getActiveChoresForArea(areaId)
        val existingTitles = existingChores.map { normalize(it.title) }.toMutableSet()
        val maxOrderBySection = existingChores.groupBy { it.sectionId }
            .mapValues { (_, chores) -> chores.maxOfOrNull { it.sortOrder } ?: -SortOrders.Gap }
            .toMutableMap()
        var choresAdded = 0

        template.chores.forEach { templateChore ->
            val titleKey = normalize(templateChore.title)
            if (titleKey !in existingTitles) {
                val sectionId = templateChore.sectionName
                    ?.let { sectionsByName[normalize(it)]?.id }
                val nextOrder = SortOrders.after(
                    maxOrderBySection[sectionId] ?: -SortOrders.Gap,
                )
                maxOrderBySection[sectionId] = nextOrder
                val choreId = idGenerator.newId()
                val dueAt = templateChore.firstDueOffsetDays?.let { offset ->
                    now + offset.toLong() * 86_400_000L
                }
                val chore = Chore(
                    id = choreId,
                    title = templateChore.title,
                    areaId = areaId,
                    sectionId = sectionId,
                    estimatedMinutes = templateChore.estimatedMinutes,
                    supportsGrading = templateChore.supportsGrading,
                    defaultGrade = templateChore.defaultGrade,
                    nextDueAt = dueAt,
                    sortOrder = nextOrder,
                    createdAt = now,
                    updatedAt = now,
                )
                val schedule = ChoreSchedule(
                    choreId = choreId,
                    recurrenceType = templateChore.recurrenceType,
                    intervalValue = templateChore.intervalValue,
                    intervalUnit = templateChore.intervalUnit,
                    daysOfWeek = templateChore.daysOfWeek,
                    dayOfMonth = templateChore.dayOfMonth,
                    scheduleBasis = templateChore.scheduleBasis,
                )
                operations.upsertChore(chore.toEntity())
                operations.upsertSchedule(schedule.toEntity())
                existingTitles += titleKey
                choresAdded += 1
            }
        }
        TemplateApplyResult(sectionsAdded, choresAdded)
    }

    override suspend fun archiveArea(areaId: String, archivedAt: Long) {
        database.withTransaction {
            operations.archiveChoresForArea(areaId, archivedAt)
            operations.archiveSectionsForArea(areaId, archivedAt)
            operations.archiveArea(areaId, archivedAt)
        }
    }

    override suspend fun archiveSection(sectionId: String, archivedAt: Long) {
        database.withTransaction {
            operations.clearSectionForActiveChores(sectionId, archivedAt)
            operations.archiveSection(sectionId, archivedAt)
        }
    }

    private fun normalize(value: String): String = value.trim().lowercase()
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
                TaskRecord(record.task.toDomain(), record.isMainTask)
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
                children.forEach { updateCompletion(it.id, completedAt, updatedAt) }
                return@withTransaction
            }
            val parentId = task.parentTaskId ?: return@withTransaction
            val siblings = operationsDao.getChildren(parentId)
            val allCompleted = siblings.all {
                if (it.id == taskId) completedAt != null else it.completedAt != null
            }
            updateCompletion(parentId, if (allCompleted) completedAt ?: updatedAt else null, updatedAt)
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
                    child.id,
                    null,
                    parent.sortOrder + index + 1L,
                    timeProvider.nowEpochMillis(),
                )
            }
            if (children.isNotEmpty()) rebalance(null)
        }
    }

    override suspend fun moveTask(taskId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val siblings = operationsDao.getSiblings(task.parentTaskId)
                .filter { (it.completedAt != null) == (task.completedAt != null) }
            val index = siblings.indexOfFirst { it.id == taskId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in siblings.indices) return@withTransaction
            val target = siblings[targetIndex]
            val now = timeProvider.nowEpochMillis()
            operationsDao.updateSortOrder(task.id, target.sortOrder, now)
            operationsDao.updateSortOrder(target.id, task.sortOrder, now)
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
            val parent = roots[index - 1]
            val now = timeProvider.nowEpochMillis()
            operationsDao.setMainTask(TaskMainFlagEntity(parent.id))
            operationsDao.updateParentAndOrder(
                task.id,
                parent.id,
                SortOrders.after(operationsDao.getMaxSortOrder(parent.id) ?: -SortOrders.Gap),
                now,
            )
        }
    }

    override suspend fun unindentTask(taskId: String) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val parentId = task.parentTaskId ?: return@withTransaction
            val parent = operationsDao.getTask(parentId) ?: return@withTransaction
            operationsDao.updateParentAndOrder(
                task.id,
                null,
                parent.sortOrder + 1L,
                timeProvider.nowEpochMillis(),
            )
            rebalance(null)
        }
    }

    override suspend fun archiveTask(taskId: String, archivedAt: Long) {
        database.withTransaction {
            val task = operationsDao.getTask(taskId) ?: return@withTransaction
            val children = operationsDao.getChildren(taskId)
            children.forEachIndexed { index, child ->
                operationsDao.updateParentAndOrder(
                    child.id,
                    null,
                    task.sortOrder + index + 1L,
                    archivedAt,
                )
            }
            operationsDao.clearMainTask(taskId)
            operationsDao.archiveTask(taskId, archivedAt)
            if (children.isNotEmpty()) rebalance(null)
        }
    }

    private suspend fun updateCompletion(taskId: String, completedAt: Long?, updatedAt: Long) {
        operationsDao.updateCompletion(
            taskId,
            if (completedAt == null) TaskStatus.Inbox.name else TaskStatus.Completed.name,
            completedAt,
            updatedAt,
        )
    }

    private suspend fun rebalance(parentTaskId: String?) {
        val now = timeProvider.nowEpochMillis()
        operationsDao.getSiblings(parentTaskId).forEachIndexed { index, task ->
            operationsDao.updateSortOrder(task.id, SortOrders.initial(index), now)
        }
    }
}

class LocalChoreRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val choreDao: ChoreDao,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : ChoreRepository {
    private val operations
        get() = database.careOperationsDao()

    override fun observeChores(): Flow<List<Chore>> = choreDao.observeActiveChores()
        .map { chores -> chores.map { it.toDomain() } }

    override fun observeChoresWithSchedules(): Flow<List<ChoreWithSchedule>> =
        choreDao.observeActiveChoresWithSchedules().map { rows -> rows.map { it.toDomain() } }

    override fun observeChoresForArea(areaId: String): Flow<List<Chore>> =
        choreDao.observeChoresForArea(areaId).map { chores -> chores.map { it.toDomain() } }

    override fun observeChoresForAreaWithSchedules(areaId: String): Flow<List<ChoreWithSchedule>> =
        choreDao.observeChoresForAreaWithSchedules(areaId).map { rows -> rows.map { it.toDomain() } }

    override fun observeChoresForSection(sectionId: String): Flow<List<ChoreWithSchedule>> =
        choreDao.observeChoresForSection(sectionId).map { rows -> rows.map { it.toDomain() } }

    override fun observeChore(choreId: String): Flow<ChoreWithSchedule?> =
        choreDao.observeChoreWithSchedule(choreId).map { it?.toDomain() }

    override suspend fun saveChore(chore: ChoreWithSchedule) {
        database.withTransaction {
            operations.upsertChore(chore.chore.toEntity())
            if (chore.schedule == null) {
                operations.deleteSchedule(chore.chore.id)
            } else {
                operations.upsertSchedule(chore.schedule.toEntity())
            }
        }
    }

    override suspend fun completeChore(
        choreId: String,
        grade: CompletionGrade,
    ): ChoreCompletionMutation = database.withTransaction {
        val row = operations.getChoreWithSchedule(choreId)
            ?: error("Chore not found")
        val domain = row.toDomain()
        val now = timeProvider.nowEpochMillis()
        val appliedGrade = when {
            !domain.chore.supportsGrading -> CompletionGrade.None
            grade != CompletionGrade.None -> grade
            else -> domain.chore.defaultGrade
        }
        val completionId = idGenerator.newId()
        val nextDue = ChoreRecurrence.nextDueAt(
            schedule = domain.schedule,
            currentDueAt = domain.chore.nextDueAt,
            completedAt = now,
        )
        operations.upsertCompletion(
            Completion(
                id = completionId,
                choreId = choreId,
                completedAt = now,
                grade = appliedGrade,
                source = CompletionSource.App,
            ).toEntity(),
        )
        operations.updateNextDue(choreId, nextDue, now)
        ChoreCompletionMutation(
            choreId = choreId,
            completionId = completionId,
            previousNextDueAt = domain.chore.nextDueAt,
            nextDueAt = nextDue,
            grade = appliedGrade,
        )
    }

    override suspend fun undoCompletion(mutation: ChoreCompletionMutation) {
        database.withTransaction {
            operations.deleteCompletion(mutation.completionId)
            operations.updateNextDue(
                mutation.choreId,
                mutation.previousNextDueAt,
                timeProvider.nowEpochMillis(),
            )
        }
    }

    override suspend fun setPaused(choreId: String, paused: Boolean) {
        operations.updatePaused(choreId, paused, timeProvider.nowEpochMillis())
    }

    override suspend fun skipOccurrence(choreId: String) {
        database.withTransaction {
            val row = operations.getChoreWithSchedule(choreId) ?: return@withTransaction
            val domain = row.toDomain()
            val now = timeProvider.nowEpochMillis()
            val calendarSchedule = domain.schedule?.copy(scheduleBasis = ScheduleBasis.Calendar)
            val nextDue = ChoreRecurrence.nextDueAt(
                calendarSchedule,
                domain.chore.nextDueAt,
                now,
            )
            operations.updateNextDue(choreId, nextDue, now)
        }
    }

    override suspend fun moveChore(choreId: String, direction: Int) {
        if (direction == 0) return
        database.withTransaction {
            val row = operations.getChoreWithSchedule(choreId) ?: return@withTransaction
            val chore = row.chore
            val siblings = operations.getChoreSiblings(chore.areaId, chore.sectionId)
            val index = siblings.indexOfFirst { it.id == choreId }
            val targetIndex = index + direction.coerceIn(-1, 1)
            if (index < 0 || targetIndex !in siblings.indices) return@withTransaction
            val target = siblings[targetIndex]
            val now = timeProvider.nowEpochMillis()
            operations.updateChoreSortOrder(chore.id, target.sortOrder, now)
            operations.updateChoreSortOrder(target.id, chore.sortOrder, now)
        }
    }

    override suspend fun archiveChore(choreId: String, archivedAt: Long) =
        operations.archiveChore(choreId, archivedAt)
}

class LocalCompletionRepository @Inject constructor(
    private val completionDao: CompletionDao,
) : CompletionRepository {
    override fun observeTaskCompletions(taskId: String): Flow<List<Completion>> =
        completionDao.observeTaskCompletions(taskId).map { rows -> rows.map { it.toDomain() } }

    override fun observeChoreCompletions(choreId: String): Flow<List<Completion>> =
        completionDao.observeChoreCompletions(choreId).map { rows -> rows.map { it.toDomain() } }

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

    override fun observeSuggestions(normalizedPrefix: String, limit: Int): Flow<List<ListCatalogItem>> =
        reusableListDao.observeCatalogSuggestions(normalizedPrefix.trim().lowercase(), limit)
            .map { items -> items.map { it.toDomain() } }

    override suspend fun saveList(list: ReusableList) = reusableListDao.upsertList(list.toEntity())
    override suspend fun saveItem(item: ListItem) = reusableListDao.upsertItem(item.toEntity())
    override suspend fun saveCatalogItem(item: ListCatalogItem) = reusableListDao.upsertCatalogItem(item.toEntity())

    override suspend fun setItemChecked(itemId: String, checkedAt: Long?) =
        reusableListDao.updateChecked(
            itemId,
            checkedAt != null,
            checkedAt,
            timeProvider.nowEpochMillis(),
        )

    override suspend fun archiveList(listId: String, archivedAt: Long) =
        reusableListDao.archiveList(listId, archivedAt)
}
