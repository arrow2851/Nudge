package com.arrow2851.nudge.core.domain

import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreRecurrence
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import java.time.LocalDate
import java.time.ZoneId
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class RecurrenceEngineTest {
    private val engine = DefaultRecurrenceEngine()
    private val zone = ZoneId.of("America/Chicago")
    private val now = LocalDate.of(2026, 8, 3).atStartOfDay(zone).toInstant().toEpochMilli()

    @Test
    fun `repair schedules a missing interval due date`() {
        val row = row(
            nextDueAt = null,
            schedule = ChoreSchedule(
                choreId = "chore",
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 2,
                intervalUnit = RecurrenceUnit.Days,
                scheduleBasis = ScheduleBasis.Completion,
            ),
        )

        val repaired = engine.repairMissingDueAt(row, now, zone)

        assertEquals(
            LocalDate.of(2026, 8, 5).atStartOfDay(zone).toInstant().toEpochMilli(),
            repaired,
        )
    }

    @Test
    fun `repair preserves paused as-needed and already scheduled chores`() {
        val interval = ChoreSchedule(
            choreId = "chore",
            recurrenceType = RecurrenceType.Interval,
            intervalValue = 1,
            intervalUnit = RecurrenceUnit.Days,
        )
        val asNeeded = ChoreSchedule(
            choreId = "chore",
            recurrenceType = RecurrenceType.WhenNeeded,
        )

        assertNull(engine.repairMissingDueAt(row(isPaused = true, schedule = interval), now, zone))
        assertNull(engine.repairMissingDueAt(row(schedule = asNeeded), now, zone))
        assertNull(engine.repairMissingDueAt(row(nextDueAt = now, schedule = interval), now, zone))
    }

    @Test
    fun `compatibility facade and engine return the same next occurrence`() {
        val schedule = ChoreSchedule(
            choreId = "chore",
            recurrenceType = RecurrenceType.Monthly,
            dayOfMonth = 31,
            scheduleBasis = ScheduleBasis.Calendar,
        )

        assertEquals(
            engine.nextDueAt(schedule, now, now, zone),
            ChoreRecurrence.nextDueAt(schedule, now, now, zone),
        )
    }

    private fun row(
        nextDueAt: Long? = null,
        isPaused: Boolean = false,
        schedule: ChoreSchedule?,
    ): ChoreWithSchedule = ChoreWithSchedule(
        chore = Chore(
            id = "chore",
            title = "Wipe counters",
            areaId = "home",
            nextDueAt = nextDueAt,
            isPaused = isPaused,
            sortOrder = 0L,
            createdAt = now,
            updatedAt = now,
        ),
        schedule = schedule,
    )
}
