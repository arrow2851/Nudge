package com.arrow2851.nudge.core.model

object AreaTemplates {
    fun definition(kind: AreaTemplateKind): AreaTemplate = when (kind) {
        AreaTemplateKind.House -> house
        AreaTemplateKind.Car -> car
    }

    private val house = AreaTemplate(
        kind = AreaTemplateKind.House,
        sections = listOf(
            TemplateSection("Kitchen", "kitchen"),
            TemplateSection("Bathroom", "bathroom"),
            TemplateSection("Living Room", "living_room"),
            TemplateSection("Bedroom", "bedroom"),
        ),
        chores = listOf(
            TemplateChore(
                title = "Wipe countertops",
                sectionName = "Kitchen",
                estimatedMinutes = 5,
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 1,
                intervalUnit = RecurrenceUnit.Days,
                scheduleBasis = ScheduleBasis.Completion,
                supportsGrading = true,
                defaultGrade = CompletionGrade.Light,
                firstDueOffsetDays = 0,
            ),
            TemplateChore(
                title = "Clean stovetop",
                sectionName = "Kitchen",
                estimatedMinutes = 10,
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(6),
                supportsGrading = true,
                defaultGrade = CompletionGrade.Moderate,
                firstDueOffsetDays = 2,
            ),
            TemplateChore(
                title = "Empty bathroom bin",
                sectionName = "Bathroom",
                estimatedMinutes = 3,
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(5),
                firstDueOffsetDays = 1,
            ),
            TemplateChore(
                title = "Clean sink and counter",
                sectionName = "Bathroom",
                estimatedMinutes = 10,
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(7),
                supportsGrading = true,
                defaultGrade = CompletionGrade.Moderate,
                firstDueOffsetDays = 3,
            ),
            TemplateChore(
                title = "Vacuum living room",
                sectionName = "Living Room",
                estimatedMinutes = 15,
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(6),
                firstDueOffsetDays = 4,
            ),
            TemplateChore(
                title = "Water houseplants",
                sectionName = "Living Room",
                estimatedMinutes = 8,
                recurrenceType = RecurrenceType.WhenNeeded,
            ),
            TemplateChore(
                title = "Change bed linens",
                sectionName = "Bedroom",
                estimatedMinutes = 15,
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 2,
                intervalUnit = RecurrenceUnit.Weeks,
                supportsGrading = true,
                defaultGrade = CompletionGrade.Deep,
                firstDueOffsetDays = 6,
            ),
        ),
    )

    private val car = AreaTemplate(
        kind = AreaTemplateKind.Car,
        sections = emptyList(),
        chores = listOf(
            TemplateChore(
                title = "Check tire pressure",
                estimatedMinutes = 10,
                recurrenceType = RecurrenceType.Monthly,
                dayOfMonth = 1,
                firstDueOffsetDays = 2,
            ),
            TemplateChore(
                title = "Check oil level",
                estimatedMinutes = 5,
                recurrenceType = RecurrenceType.Monthly,
                dayOfMonth = 15,
                firstDueOffsetDays = 7,
            ),
            TemplateChore(
                title = "Wash exterior",
                estimatedMinutes = 30,
                recurrenceType = RecurrenceType.WhenNeeded,
                supportsGrading = true,
                defaultGrade = CompletionGrade.Moderate,
            ),
            TemplateChore(
                title = "Replace cabin air filter",
                estimatedMinutes = 20,
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 6,
                intervalUnit = RecurrenceUnit.Months,
                scheduleBasis = ScheduleBasis.Calendar,
                supportsGrading = true,
                defaultGrade = CompletionGrade.Deep,
                firstDueOffsetDays = 30,
            ),
        ),
    )
}
