package com.arrow2851.nudge.core.model

enum class TaskStatus {
    Inbox,
    Planned,
    InProgress,
    Waiting,
    Blocked,
    Completed,
    Cancelled,
    Someday,
}

enum class RecurrenceType {
    None,
    Interval,
    Weekly,
    Monthly,
    WhenNeeded,
    Custom,
}

enum class RecurrenceUnit {
    Days,
    Weeks,
    Months,
    Years,
}

enum class ScheduleBasis {
    Calendar,
    Completion,
}

enum class CompletionGrade {
    None,
    Light,
    Moderate,
    Deep,
}

enum class CompletionSource {
    App,
    Widget,
    Intervention,
    Notification,
    Gemini,
}

enum class ThemeMode {
    System,
    Light,
    Dark,
}

data class Area(
    val id: String,
    val name: String,
    val icon: String? = null,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val archivedAt: Long? = null,
)

data class Section(
    val id: String,
    val areaId: String,
    val name: String,
    val icon: String? = null,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val archivedAt: Long? = null,
)

data class AreaWithSections(
    val area: Area,
    val sections: List<Section>,
)

data class Task(
    val id: String,
    val title: String,
    val description: String? = null,
    val parentTaskId: String? = null,
    val areaId: String? = null,
    val sectionId: String? = null,
    val status: TaskStatus = TaskStatus.Inbox,
    val priority: Int = 0,
    val estimatedMinutes: Int? = null,
    val dueAt: Long? = null,
    val includeInNudges: Boolean = true,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val completedAt: Long? = null,
    val archivedAt: Long? = null,
)

data class Chore(
    val id: String,
    val title: String,
    val description: String? = null,
    val areaId: String,
    val sectionId: String? = null,
    val priority: Int = 0,
    val estimatedMinutes: Int? = null,
    val includeInNudges: Boolean = true,
    val supportsGrading: Boolean = false,
    val defaultGrade: CompletionGrade = CompletionGrade.None,
    val nextDueAt: Long? = null,
    val isPaused: Boolean = false,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val archivedAt: Long? = null,
)

data class ChoreSchedule(
    val choreId: String,
    val recurrenceType: RecurrenceType,
    val intervalValue: Int? = null,
    val intervalUnit: RecurrenceUnit? = null,
    val daysOfWeek: Set<Int> = emptySet(),
    val dayOfMonth: Int? = null,
    val scheduleBasis: ScheduleBasis = ScheduleBasis.Calendar,
)

data class ChoreWithSchedule(
    val chore: Chore,
    val schedule: ChoreSchedule?,
)

data class Completion(
    val id: String,
    val taskId: String? = null,
    val choreId: String? = null,
    val completedAt: Long,
    val grade: CompletionGrade = CompletionGrade.None,
    val durationMinutes: Int? = null,
    val note: String? = null,
    val source: CompletionSource = CompletionSource.App,
)

data class ReusableList(
    val id: String,
    val name: String,
    val icon: String? = null,
    val isReusable: Boolean = true,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val archivedAt: Long? = null,
)

data class ListCatalogItem(
    val id: String,
    val normalizedName: String,
    val displayName: String,
    val category: String? = null,
    val defaultQuantity: String? = null,
    val timesUsed: Int = 0,
    val lastUsedAt: Long? = null,
    val favorite: Boolean = false,
)

data class ListItem(
    val id: String,
    val listId: String,
    val parentItemId: String? = null,
    val catalogItemId: String? = null,
    val name: String,
    val quantity: String? = null,
    val isChecked: Boolean = false,
    val sortOrder: Long,
    val addedAt: Long,
    val updatedAt: Long,
    val checkedAt: Long? = null,
    val archivedAt: Long? = null,
)

data class ReusableListWithItems(
    val list: ReusableList,
    val items: List<ListItem>,
)

data class AppPreferences(
    val themeMode: ThemeMode = ThemeMode.System,
    val showDueShorthand: Boolean = true,
    val hideCompletedItems: Boolean = false,
    val dailyProgressEnabled: Boolean = false,
    val quickWinEnabled: Boolean = false,
    val demoDataEnabled: Boolean = false,
)
