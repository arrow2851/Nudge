package com.arrow2851.nudge.core.domain

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.arrow2851.nudge.core.data.LocalAreaRepository
import com.arrow2851.nudge.core.data.LocalChoreRepository
import com.arrow2851.nudge.core.data.LocalTaskRepository
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TimeProvider
import java.time.LocalDate
import java.time.ZoneId
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class DerivedDataEnginesTest {
    private lateinit var database: NudgeDatabase
    private lateinit var areas: LocalAreaRepository
    private lateinit var chores: LocalChoreRepository
    private lateinit var tasks: LocalTaskRepository
    private val zone = ZoneId.of("America/Chicago")
    private val now = LocalDate.of(2026, 8, 3).atStartOfDay(zone).toInstant().toEpochMilli()
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
        areas = LocalAreaRepository(
            database,
            database.areaDao(),
            database.choreDao(),
            idGenerator,
            timeProvider,
        )
        chores = LocalChoreRepository(database, database.choreDao(), idGenerator, timeProvider)
        tasks = LocalTaskRepository(database, database.taskDao(), timeProvider)
    }

    @After
    fun tearDown() = database.close()

    @Test
    fun refreshRepairsMissingDueDateAndRanksRepositoryCandidates() = runBlocking {
        val area = areas.createArea("House")
        val recurring = Chore(
            id = "recurring",
            title = "Wipe counters",
            areaId = area.id,
            estimatedMinutes = 5,
            nextDueAt = null,
            sortOrder = 0,
            createdAt = now,
            updatedAt = now,
        )
        chores.saveChore(
            ChoreWithSchedule(
                chore = recurring,
                schedule = ChoreSchedule(
                    choreId = recurring.id,
                    recurrenceType = RecurrenceType.Interval,
                    intervalValue = 1,
                    intervalUnit = RecurrenceUnit.Days,
                    scheduleBasis = ScheduleBasis.Completion,
                ),
            ),
        )
        tasks.saveTask(
            Task(
                id = "overdue-task",
                title = "Pay bill",
                estimatedMinutes = 8,
                dueAt = now - 86_400_000L,
                sortOrder = 0,
                createdAt = now,
                updatedAt = now,
            ),
        )
        tasks.saveTask(
            Task(
                id = "long-task",
                title = "Organize garage",
                estimatedMinutes = 45,
                dueAt = now,
                sortOrder = 1,
                createdAt = now,
                updatedAt = now,
            ),
        )

        val recurrence = DefaultRecurrenceEngine()
        val maintenance = RecurrenceMaintenanceEngine(
            choreRepository = chores,
            planner = RecurrenceMaintenancePlanner(recurrence),
        )
        val recommendations = RecommendationReader(
            taskRepository = tasks,
            choreRepository = chores,
            recommendationEngine = DefaultRecommendationEngine(),
        )
        val result = DerivedDataRefreshEngine(maintenance, recommendations).refresh(now)

        assertEquals(1, result.repairedRecurringChores)
        assertEquals(
            now + 86_400_000L,
            chores.observeChore(recurring.id).first()?.chore?.nextDueAt,
        )
        assertEquals("overdue-task", result.recommendationCandidateIds.first())
        assertTrue("long-task" !in result.recommendationCandidateIds)
    }
}
