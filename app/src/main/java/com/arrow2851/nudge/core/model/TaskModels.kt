package com.arrow2851.nudge.core.model

data class TaskRecord(
    val task: Task,
    val isMainTask: Boolean,
)

data class TaskNode(
    val task: Task,
    val isMainTask: Boolean,
    val subtasks: List<Task>,
) {
    val completedSubtaskCount: Int
        get() = subtasks.count { it.completedAt != null }

    val subtaskProgress: Float
        get() = if (subtasks.isEmpty()) 0f else completedSubtaskCount.toFloat() / subtasks.size
}

fun List<TaskRecord>.toTaskNodes(): List<TaskNode> {
    val childrenByParent = filter { it.task.parentTaskId != null }
        .groupBy { it.task.parentTaskId }

    return filter { it.task.parentTaskId == null }
        .sortedWith(taskRecordComparator)
        .map { root ->
            val children = childrenByParent[root.task.id]
                .orEmpty()
                .sortedWith(taskRecordComparator)
                .map(TaskRecord::task)
            TaskNode(
                task = root.task,
                isMainTask = root.isMainTask || children.isNotEmpty(),
                subtasks = children,
            )
        }
}

private val taskRecordComparator = compareBy<TaskRecord>(
    { it.task.completedAt != null },
    { it.task.sortOrder },
    { it.task.createdAt },
)
