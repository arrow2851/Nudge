package com.arrow2851.nudge.core.seed

import androidx.room.withTransaction
import com.arrow2851.nudge.core.data.toEntity
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import javax.inject.Inject

object DemoSeedData {
    const val Epoch: Long = 1_767_225_600_000L

    val areas = listOf(
        Area(
            id = "demo-area-house",
            name = "House",
            icon = "home",
            sortOrder = SortOrders.initial(0),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
        Area(
            id = "demo-area-car",
            name = "Car",
            icon = "car",
            sortOrder = SortOrders.initial(1),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
    )

    val sections = listOf(
        Section(
            id = "demo-section-kitchen",
            areaId = "demo-area-house",
            name = "Kitchen",
            icon = "kitchen",
            sortOrder = SortOrders.initial(0),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
        Section(
            id = "demo-section-bathroom",
            areaId = "demo-area-house",
            name = "Bathroom",
            icon = "bathroom",
            sortOrder = SortOrders.initial(1),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
    )

    val tasks = listOf(
        Task(
            id = "demo-task-reimbursement",
            title = "Submit reimbursement",
            dueAt = Epoch + 86_400_000L,
            sortOrder = SortOrders.initial(0),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
        Task(
            id = "demo-task-tire-rotation",
            title = "Schedule tire rotation",
            areaId = "demo-area-car",
            sortOrder = SortOrders.initial(1),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
    )

    val chores = listOf(
        ChoreWithSchedule(
            chore = Chore(
                id = "demo-chore-stovetop",
                title = "Wipe stovetop",
                areaId = "demo-area-house",
                sectionId = "demo-section-kitchen",
                estimatedMinutes = 5,
                supportsGrading = true,
                defaultGrade = CompletionGrade.Light,
                nextDueAt = Epoch + 43_200_000L,
                sortOrder = SortOrders.initial(0),
                createdAt = Epoch,
                updatedAt = Epoch,
            ),
            schedule = ChoreSchedule(
                choreId = "demo-chore-stovetop",
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 2,
                intervalUnit = RecurrenceUnit.Days,
                scheduleBasis = ScheduleBasis.Completion,
            ),
        ),
        ChoreWithSchedule(
            chore = Chore(
                id = "demo-chore-bathroom-bin",
                title = "Empty bathroom bin",
                areaId = "demo-area-house",
                sectionId = "demo-section-bathroom",
                estimatedMinutes = 3,
                nextDueAt = Epoch + 86_400_000L,
                sortOrder = SortOrders.initial(1),
                createdAt = Epoch,
                updatedAt = Epoch,
            ),
            schedule = ChoreSchedule(
                choreId = "demo-chore-bathroom-bin",
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(6),
                scheduleBasis = ScheduleBasis.Calendar,
            ),
        ),
    )

    val lists = listOf(
        ReusableList(
            id = "demo-list-groceries",
            name = "Groceries",
            icon = "cart",
            sortOrder = SortOrders.initial(0),
            createdAt = Epoch,
            updatedAt = Epoch,
        ),
    )

    val catalogItems = listOf(
        ListCatalogItem(
            id = "demo-catalog-bananas",
            normalizedName = "bananas",
            displayName = "Bananas",
            timesUsed = 4,
            lastUsedAt = Epoch,
        ),
        ListCatalogItem(
            id = "demo-catalog-milk",
            normalizedName = "milk",
            displayName = "Milk",
            timesUsed = 7,
            lastUsedAt = Epoch,
            favorite = true,
        ),
    )

    val listItems = listOf(
        ListItem(
            id = "demo-list-item-bananas",
            listId = "demo-list-groceries",
            catalogItemId = "demo-catalog-bananas",
            name = "Bananas",
            quantity = "6",
            sortOrder = SortOrders.initial(0),
            addedAt = Epoch,
            updatedAt = Epoch,
        ),
        ListItem(
            id = "demo-list-item-milk",
            listId = "demo-list-groceries",
            catalogItemId = "demo-catalog-milk",
            name = "Milk",
            quantity = "1 gallon",
            sortOrder = SortOrders.initial(1),
            addedAt = Epoch,
            updatedAt = Epoch,
        ),
    )
}

class DatabaseSeeder @Inject constructor(
    private val database: NudgeDatabase,
) {
    suspend fun seedIfEmpty(): Boolean = database.withTransaction {
        val alreadyInitialized = database.areaDao().countAreas() > 0 ||
            database.taskDao().countTasks() > 0 ||
            database.choreDao().countChores() > 0 ||
            database.reusableListDao().countLists() > 0

        if (alreadyInitialized) {
            return@withTransaction false
        }

        database.areaDao().upsertAreas(DemoSeedData.areas.map { it.toEntity() })
        database.areaDao().upsertSections(DemoSeedData.sections.map { it.toEntity() })
        database.taskDao().upsertTasks(DemoSeedData.tasks.map { it.toEntity() })
        database.choreDao().upsertChores(DemoSeedData.chores.map { it.chore.toEntity() })
        database.choreDao().upsertSchedules(
            DemoSeedData.chores.mapNotNull { it.schedule?.toEntity() },
        )
        database.reusableListDao().upsertLists(DemoSeedData.lists.map { it.toEntity() })
        database.reusableListDao().upsertCatalogItems(
            DemoSeedData.catalogItems.map { it.toEntity() },
        )
        database.reusableListDao().upsertItems(DemoSeedData.listItems.map { it.toEntity() })
        true
    }
}
