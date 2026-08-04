package com.arrow2851.nudge.core.model

enum class ChoreGroup {
    NeedsAttention,
    ComingUp,
    AsNeeded,
    Paused,
}

enum class AreaTemplateKind {
    House,
    Car,
}

data class ChoreCompletionMutation(
    val choreId: String,
    val completionId: String,
    val previousNextDueAt: Long?,
    val nextDueAt: Long?,
    val grade: CompletionGrade,
)

data class TemplateApplyResult(
    val sectionsAdded: Int,
    val choresAdded: Int,
)

data class TemplateSection(
    val name: String,
    val icon: String? = null,
)

data class TemplateChore(
    val title: String,
    val sectionName: String? = null,
    val estimatedMinutes: Int? = null,
    val recurrenceType: RecurrenceType,
    val intervalValue: Int? = null,
    val intervalUnit: RecurrenceUnit? = null,
    val daysOfWeek: Set<Int> = emptySet(),
    val dayOfMonth: Int? = null,
    val scheduleBasis: ScheduleBasis = ScheduleBasis.Calendar,
    val supportsGrading: Boolean = false,
    val defaultGrade: CompletionGrade = CompletionGrade.None,
    val firstDueOffsetDays: Int? = null,
)

data class AreaTemplate(
    val kind: AreaTemplateKind,
    val sections: List<TemplateSection>,
    val chores: List<TemplateChore>,
)
