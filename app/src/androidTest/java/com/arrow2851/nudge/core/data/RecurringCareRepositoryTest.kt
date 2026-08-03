package com.arrow2851.nudge.core.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.TimeProvider
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class RecurringCareRepositoryTest {
    private lateinit var database: NudgeDatabase
    private lateinit var areas: LocalAreaRepository
    private lateinit var chores: LocalChoreRepository
    private var now = 1_775_000_000_000L
    private var ids = 0
    private val idGenerator = object : IdGenerator {
        override fun newId(): String = "generated-${++ids}"
    }
    private val timeProvider = object : TimeProvider {
        override fun nowEpochMillis(): Long = now
    }

    @Before
    fun setUp() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, NudgeDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        areas = LocalAreaRepository(database, database.areaDao(), database.choreDao(), idGenerator, timeProvider)
        chores = LocalChoreRepository(database, database.choreDao(), idGenerator, timeProvider)
    }

    @After
    fun tearDown() = database.close()

    @Test
    fun houseTemplateIsIdempotentAndCarTemplateHasNoSections() = runBlocking {
        val house = areas.createArea("House")
        val first = areas.applyTemplate(house.id, AreaTemplateKind.House)
        val second = areas.applyTemplate(house.id, AreaTemplateKind.House)
        assertEquals(4, first.sectionsAdded)
        assertEquals(7, first.choresAdded)
        assertEquals(0, second.sectionsAdded)
        assertEquals(0, second.choresAdded)

        val car = areas.createArea("Car")
        val carResult = areas.applyTemplate(car.id, AreaTemplateKind.Car)
        assertEquals(0, carResult.sectionsAdded)
        assertEquals(4, carResult.choresAdded)
        assertTrue(areas.observeArea(car.id).first()?.sections.orEmpty().isEmpty())
    }

    @Test
    fun gradedCompletionAdvancesAndUndoRestoresDueDateAndHistory() = runBlocking {
        val area = areas.createArea("House")
        val originalDue = now - 86_400_000L
        val chore = Chore(
            id = "weekly",
            title = "Clean sink",
            areaId = area.id,
            supportsGrading = true,
            defaultGrade = CompletionGrade.Moderate,
            nextDueAt = originalDue,
            sortOrder = 0,
            createdAt = now,
            updatedAt = now,
        )
        chores.saveChore(
            ChoreWithSchedule(
                chore,
                ChoreSchedule(
                    choreId = chore.id,
                    recurrenceType = RecurrenceType.Interval,
                    intervalValue = 1,
                    intervalUnit = RecurrenceUnit.Weeks,
                    scheduleBasis = ScheduleBasis.Completion,
                ),
            ),
        )

        val mutation = chores.completeChore(chore.id, CompletionGrade.Deep)
        val completed = chores.observeChore(chore.id).first()
        assertEquals(now + 7L * 86_400_000L, completed?.chore?.nextDueAt)
        assertEquals(CompletionGrade.Deep, database.completionDao().observeChoreCompletions(chore.id).first().single().grade)

        chores.undoCompletion(mutation)
        assertEquals(originalDue, chores.observeChore(chore.id).first()?.chore?.nextDueAt)
        assertTrue(database.completionDao().observeChoreCompletions(chore.id).first().isEmpty())
    }

    @Test
    fun asNeededRemainsAvailableAndArchivingSectionReleasesChore() = runBlocking {
        val area = areas.createArea("House")
        val section = areas.createSection(area.id, "Kitchen")
        val chore = Chore(
            id = "as-needed",
            title = "Polish fixtures",
            areaId = area.id,
            sectionId = section.id,
            nextDueAt = null,
            sortOrder = 0,
            createdAt = now,
            updatedAt = now,
        )
        chores.saveChore(
            ChoreWithSchedule(
                chore,
                ChoreSchedule(chore.id, RecurrenceType.WhenNeeded),
            ),
        )

        chores.completeChore(chore.id, CompletionGrade.None)
        assertNull(chores.observeChore(chore.id).first()?.chore?.nextDueAt)

        areas.archiveSection(section.id, now + 1)
        assertNull(chores.observeChore(chore.id).first()?.chore?.sectionId)
    }

    @Test
    fun archivingAreaArchivesItsRecurringCare() = runBlocking {
        val area = areas.createArea("Garage")
        val chore = Chore(
            id = "garage-chore",
            title = "Sweep garage",
            areaId = area.id,
            sortOrder = 0,
            createdAt = now,
            updatedAt = now,
        )
        chores.saveChore(ChoreWithSchedule(chore, ChoreSchedule(chore.id, RecurrenceType.WhenNeeded)))

        areas.archiveArea(area.id, now + 1)

        assertTrue(areas.observeAreas().first().none { it.id == area.id })
        assertTrue(chores.observeChoresWithSchedules().first().none { it.chore.id == chore.id })
    }
}
