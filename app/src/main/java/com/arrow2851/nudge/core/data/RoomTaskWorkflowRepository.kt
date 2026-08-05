package com.arrow2851.nudge.core.data

import androidx.room.withTransaction
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.HistoryEventType
import com.arrow2851.nudge.core.model.HistoryItemType
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.ItemHistoryEntry
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.TaskStatus
import com.arrow2851.nudge.core.model.TimeProvider
import javax.inject.Inject

class RoomTaskWorkflowRepository @Inject constructor(
    private val database: NudgeDatabase,
    private val idGenerator: IdGenerator,
    private val timeProvider: TimeProvider,
) : TaskWorkflowRepository {
    private val tasks
        get() = database.taskOperationsDao()
    private val history
        get() = database.historyDao()

    override suspend fun toggleCompletion(taskId: String): TaskCompletionMutation =
        database.withTransaction {
            val task = requireNotNull(tasks.getTask(taskId)) { "Task not found" }
            require(task.archivedAt == null) { "Task is no longer active" }
            val now = timeProvider.nowEpochMillis()
            val previous = linkedMapOf<String, Long?>()
            val desired = linkedMapOf<String, Long?>()
            val records = linkedMapOf(task.id to task)

            fun stage(id: String, before: Long?, after: Long?) {
                previous[id] = before
                desired[id] = after
            }

            val children = tasks.getChildren(task.id)
            children.forEach { records[it.id] = it }
            if (children.isNotEmpty()) {
                val next = now.takeIf { task.completedAt == null }
                stage(task.id, task.completedAt, next)
                children.forEach { child -> stage(child.id, child.completedAt, next) }
            } else {
                val next = now.takeIf { task.completedAt == null }
                stage(task.id, task.completedAt, next)
                task.parentTaskId?.let { parentId ->
                    val parent = tasks.getTask(parentId)
                    if (parent != null && parent.archivedAt == null) {
                        records[parent.id] = parent
                        val siblings = tasks.getChildren(parentId)
                        val allCompleted = siblings.all { sibling ->
                            when (sibling.id) {
                                task.id -> next != null
                                else -> sibling.completedAt != null
                            }
                        }
                        val parentNext = if (allCompleted) parent.completedAt ?: now else null
                        if (parentNext != parent.completedAt) {
                            stage(parent.id, parent.completedAt, parentNext)
                        }
                    }
                }
            }

            desired.forEach { (id, completedAt) ->
                tasks.updateCompletion(
                    taskId = id,
                    status = if (completedAt == null) TaskStatus.Inbox.name else TaskStatus.Completed.name,
                    completedAt = completedAt,
                    updatedAt = now,
                )
            }

            val historyIds = mutableListOf<String>()
            desired.forEach { (id, completedAt) ->
                if (previous[id] == null && completedAt != null) {
                    val record = records[id] ?: tasks.getTask(id) ?: return@forEach
                    val historyId = idGenerator.newId()
                    history.upsert(
                        ItemHistoryEntry(
                            id = historyId,
                            itemType = HistoryItemType.Task,
                            eventType = HistoryEventType.Completed,
                            sourceItemId = id,
                            title = record.title,
                            occurredAt = completedAt,
                        ).toEntity(),
                    )
                    historyIds += historyId
                }
            }

            TaskCompletionMutation(
                previousCompletedAtByTask = previous,
                completedAtByTask = desired,
                createdHistoryIds = historyIds,
            )
        }

    override suspend fun undoCompletion(mutation: TaskCompletionMutation) {
        database.withTransaction {
            val now = timeProvider.nowEpochMillis()
            mutation.previousCompletedAtByTask.forEach { (taskId, completedAt) ->
                tasks.updateCompletion(
                    taskId = taskId,
                    status = if (completedAt == null) TaskStatus.Inbox.name else TaskStatus.Completed.name,
                    completedAt = completedAt,
                    updatedAt = now,
                )
            }
            if (mutation.createdHistoryIds.isNotEmpty()) {
                history.deleteAll(mutation.createdHistoryIds)
            }
        }
    }

    override suspend fun reorderTask(taskId: String, targetTaskId: String) {
        if (taskId == targetTaskId) return
        database.withTransaction {
            val task = tasks.getTask(taskId) ?: return@withTransaction
            val target = tasks.getTask(targetTaskId) ?: return@withTransaction
            if (task.archivedAt != null || target.archivedAt != null) return@withTransaction
            if (task.parentTaskId != target.parentTaskId) return@withTransaction
            if ((task.completedAt != null) != (target.completedAt != null)) return@withTransaction
            val now = timeProvider.nowEpochMillis()
            tasks.updateSortOrder(task.id, target.sortOrder, now)
            tasks.updateSortOrder(target.id, task.sortOrder, now)
        }
    }

    override suspend fun archiveTask(taskId: String): TaskArchiveMutation =
        database.withTransaction {
            val taskEntity = requireNotNull(tasks.getTask(taskId)) { "Task not found" }
            require(taskEntity.archivedAt == null) { "Task is already deleted" }
            val task = taskEntity.toDomain()
            val children = tasks.getChildren(taskId)
            val now = timeProvider.nowEpochMillis()
            val historyId = idGenerator.newId()
            history.upsert(
                ItemHistoryEntry(
                    id = historyId,
                    itemType = HistoryItemType.Task,
                    eventType = HistoryEventType.Deleted,
                    sourceItemId = task.id,
                    title = task.title,
                    occurredAt = now,
                ).toEntity(),
            )
            children.forEachIndexed { index, child ->
                tasks.updateParentAndOrder(
                    taskId = child.id,
                    parentTaskId = null,
                    sortOrder = task.sortOrder + index + 1L,
                    updatedAt = now,
                )
            }
            tasks.archiveTask(taskId, now)
            if (children.isNotEmpty()) rebalance(parentTaskId = null)
            TaskArchiveMutation(
                task = task,
                childSortOrders = children.associate { it.id to it.sortOrder },
                historyId = historyId,
            )
        }

    override suspend fun undoArchive(mutation: TaskArchiveMutation) {
        database.withTransaction {
            val now = timeProvider.nowEpochMillis()
            tasks.restoreTask(mutation.task.id, now)
            mutation.childSortOrders.forEach { (childId, sortOrder) ->
                tasks.updateParentAndOrder(
                    taskId = childId,
                    parentTaskId = mutation.task.id,
                    sortOrder = sortOrder,
                    updatedAt = now,
                )
            }
            history.delete(mutation.historyId)
            rebalance(mutation.task.parentTaskId)
        }
    }

    private suspend fun rebalance(parentTaskId: String?) {
        val now = timeProvider.nowEpochMillis()
        tasks.getSiblings(parentTaskId).forEachIndexed { index, task ->
            tasks.updateSortOrder(task.id, SortOrders.initial(index), now)
        }
    }
}
