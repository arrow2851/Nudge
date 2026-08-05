package com.arrow2851.nudge.core.model

import kotlinx.serialization.Serializable

@Serializable
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

@Serializable
enum class RecurrenceType {
    None,
    Interval,
    Weekly,
    Monthly,
    WhenNeeded,
    Custom,
}

@Serializable
enum class RecurrenceUnit {
    Days,
    Weeks,
    Months,
    Years,
}

@Serializable
enum class ScheduleBasis {
    Calendar,
    Completion,
}

@Serializable
enum class CompletionGrade {
    None,
    Light,
    Moderate,
    Deep,
}

@Serializable
enum class CompletionSource {
    App,
    Widget,
    Intervention,
    Notification,
    Gemini,
}

@Serializable
enum class ThemeMode {
    System,
    Light,
    Dark,
}

@Serializable
enum class ItemHandedness {
    Standard,
    RightHanded,
}

@Serializable
enum class HistoryItemType {
    Task,
    ListItem,
}

@Serializable
enum class HistoryEventType {
    Completed,
    Deleted,
}

@Serializable
data class Area(
    val id: String,
    val name: String,
    val icon: String? = null,
    val sortOrder: Long,
    val createdAt: Long,
    val updatedAt: Long,
    val archivedAt: Long? = null,
)

@Serializable
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

@Serializable
data class AreaWithSections(
    val area: Area,
    val sections: List<Section>,
)

@Serializable
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

@Serializable
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

@Serializable
data class ChoreSchedule(
    val choreId: String,
    val recurrenceType: RecurrenceType,
    val intervalValue: Int? = null,
    val intervalUnit: RecurrenceUnit? = null,
    val daysOfWeek: Set<Int> = emptySet(),
    val dayOfMonth: Int? = null,
    val scheduleBasis: ScheduleBasis = ScheduleBasis.Calendar,
)

@Serializable
data class ChoreWithSchedule(
    val chore: Chore,
    val schedule: ChoreSchedule?,
)

@Serializable
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

@Serializable
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

@Serializable
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

@Serializable
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

@Serializable
data class ReusableListWithItems(
    val list: ReusableList,
    val items: List<ListItem>,
)

@Serializable
data class ItemHistoryEntry(
    val id: String,
    val itemType: HistoryItemType,
    val eventType: HistoryEventType,
    val sourceItemId: String?,
    val title: String,
    val detail: String? = null,
    val containerName: String? = null,
    val occurredAt: Long,
)

@Serializable
data class AppPreferences(
    val themeMode: ThemeMode = ThemeMode.System,
    val showDueShorthand: Boolean = true,
    val hideCompletedItems: Boolean = false,
    val dailyProgressEnabled: Boolean = false,
    val quickWinEnabled: Boolean = false,
    val demoDataEnabled: Boolean = false,
    val itemHandedness: ItemHandedness = ItemHandedness.Standard,
)
