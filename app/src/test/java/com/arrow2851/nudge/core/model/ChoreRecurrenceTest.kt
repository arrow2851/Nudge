package com.arrow2851.nudge.core.model

import java.time.LocalDate
import java.time.ZoneId
import org.junit.Assert.assertEquals
import org.junit.Test

class ChoreRecurrenceTest {
    private val zone = ZoneId.of("UTC")

    @Test
    fun completionBasedIntervalRestartsFromCompletion() {
        val completed = date(2026, 8, 3)
        val result = ChoreRecurrence.nextDueAt(
            schedule = ChoreSchedule(
                choreId = "chore",
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 2,
                intervalUnit = RecurrenceUnit.Days,
                scheduleBasis = ScheduleBasis.Completion,
            ),
            currentDueAt = date(2026, 7, 20),
            completedAt = completed,
            zoneId = zone,
        )

        assertEquals(date(2026, 8, 5), result)
    }

    @Test
    fun calendarIntervalCatchesUpToFirstFutureOccurrence() {
        val result = ChoreRecurrence.nextDueAt(
            schedule = ChoreSchedule(
                choreId = "chore",
                recurrenceType = RecurrenceType.Interval,
                intervalValue = 7,
                intervalUnit = RecurrenceUnit.Days,
                scheduleBasis = ScheduleBasis.Calendar,
            ),
            currentDueAt = date(2026, 7, 20),
            completedAt = date(2026, 8, 3),
            zoneId = zone,
        )

        assertEquals(date(2026, 8, 10), result)
    }

    @Test
    fun weeklyScheduleUsesRealWeekday() {
        val result = ChoreRecurrence.nextDueAt(
            schedule = ChoreSchedule(
                choreId = "chore",
                recurrenceType = RecurrenceType.Weekly,
                daysOfWeek = setOf(6),
                scheduleBasis = ScheduleBasis.Calendar,
            ),
            currentDueAt = date(2026, 8, 1),
            completedAt = date(2026, 8, 3),
            zoneId = zone,
        )

        assertEquals(date(2026, 8, 8), result)
    }

    @Test
    fun monthlyScheduleClampsToShortMonth() {
        val result = ChoreRecurrence.nextDueAt(
            schedule = ChoreSchedule(
                choreId = "chore",
                recurrenceType = RecurrenceType.Monthly,
                dayOfMonth = 31,
                scheduleBasis = ScheduleBasis.Completion,
            ),
            currentDueAt = null,
            completedAt = date(2027, 1, 31),
            zoneId = zone,
        )

        assertEquals(date(2027, 2, 28), result)
    }

    @Test
    fun groupingPrioritizesPausedAndAsNeeded() {
        val now = date(2026, 8, 3)
        val asNeeded = care(nextDueAt = null, recurrenceType = RecurrenceType.WhenNeeded)
        val paused = care(nextDueAt = date(2026, 8, 1), paused = true)
        val due = care(nextDueAt = now)
        val upcoming = care(nextDueAt = date(2026, 8, 10))

        assertEquals(ChoreGroup.AsNeeded, ChoreRecurrence.group(asNeeded, now, zone))
        assertEquals(ChoreGroup.Paused, ChoreRecurrence.group(paused, now, zone))
        assertEquals(ChoreGroup.NeedsAttention, ChoreRecurrence.group(due, now, zone))
        assertEquals(ChoreGroup.ComingUp, ChoreRecurrence.group(upcoming, now, zone))
    }

    private fun date(year: Int, month: Int, day: Int): Long =
        LocalDate.of(year, month, day).atStartOfDay(zone).toInstant().toEpochMilli()

    private fun care(
        nextDueAt: Long?,
        recurrenceType: RecurrenceType = RecurrenceType.Weekly,
        paused: Boolean = false,
    ) = ChoreWithSchedule(
        chore = Chore(
            id = "chore-$nextDueAt-$paused",
            title = "Chore",
            areaId = "area",
            nextDueAt = nextDueAt,
            isPaused = paused,
            sortOrder = 0,
            createdAt = 0,
            updatedAt = 0,
        ),
        schedule = ChoreSchedule(
            choreId = "chore-$nextDueAt-$paused",
            recurrenceType = recurrenceType,
        ),
    )
}
