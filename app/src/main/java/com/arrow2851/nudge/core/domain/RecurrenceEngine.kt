package com.arrow2851.nudge.core.domain

import com.arrow2851.nudge.core.model.ChoreGroup
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import javax.inject.Inject

interface RecurrenceEngine {
    fun group(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): ChoreGroup

    fun nextDueAt(
        schedule: ChoreSchedule?,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): Long?

    fun dueLabel(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): String

    fun repairMissingDueAt(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): Long?
}

class DefaultRecurrenceEngine @Inject constructor() : RecurrenceEngine {
    override fun group(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId,
    ): ChoreGroup {
        if (chore.chore.isPaused) return ChoreGroup.Paused
        if (chore.schedule?.recurrenceType == RecurrenceType.WhenNeeded || chore.chore.nextDueAt == null) {
            return ChoreGroup.AsNeeded
        }
        val today = Instant.ofEpochMilli(now).atZone(zoneId).toLocalDate()
        val dueDate = Instant.ofEpochMilli(chore.chore.nextDueAt).atZone(zoneId).toLocalDate()
        return if (!dueDate.isAfter(today)) ChoreGroup.NeedsAttention else ChoreGroup.ComingUp
    }

    override fun nextDueAt(
        schedule: ChoreSchedule?,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId,
    ): Long? {
        schedule ?: return null
        return when (schedule.recurrenceType) {
            RecurrenceType.None,
            RecurrenceType.WhenNeeded,
            -> null

            RecurrenceType.Interval -> intervalNext(schedule, currentDueAt, completedAt, zoneId)
            RecurrenceType.Weekly -> weeklyNext(schedule, currentDueAt, completedAt, zoneId)
            RecurrenceType.Monthly -> monthlyNext(schedule, currentDueAt, completedAt, zoneId)
            RecurrenceType.Custom -> when {
                schedule.intervalValue != null && schedule.intervalUnit != null ->
                    intervalNext(schedule, currentDueAt, completedAt, zoneId)
                schedule.daysOfWeek.isNotEmpty() ->
                    weeklyNext(schedule, currentDueAt, completedAt, zoneId)
                schedule.dayOfMonth != null ->
                    monthlyNext(schedule, currentDueAt, completedAt, zoneId)
                else -> null
            }
        }
    }

    override fun dueLabel(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId,
    ): String {
        return when (group(chore, now, zoneId)) {
            ChoreGroup.Paused -> "Paused"
            ChoreGroup.AsNeeded -> "As needed"
            else -> {
                val dueAt = chore.chore.nextDueAt ?: return "As needed"
                val dueDate = Instant.ofEpochMilli(dueAt).atZone(zoneId).toLocalDate()
                val today = Instant.ofEpochMilli(now).atZone(zoneId).toLocalDate()
                when (val days = ChronoUnit.DAYS.between(today, dueDate)) {
                    in Long.MIN_VALUE..-1L -> "${-days}d overdue"
                    0L -> "Today"
                    1L -> "Tomorrow"
                    in 2L..6L -> "${days}d"
                    else -> dueDate.format(DateTimeFormatter.ofPattern("MMM d"))
                }
            }
        }
    }

    override fun repairMissingDueAt(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId,
    ): Long? {
        val schedule = chore.schedule ?: return null
        if (chore.chore.isPaused || chore.chore.nextDueAt != null) return null
        if (schedule.recurrenceType == RecurrenceType.None || schedule.recurrenceType == RecurrenceType.WhenNeeded) {
            return null
        }
        return nextDueAt(
            schedule = schedule,
            currentDueAt = null,
            completedAt = now,
            zoneId = zoneId,
        )
    }

    private fun intervalNext(
        schedule: ChoreSchedule,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId,
    ): Long? {
        val value = schedule.intervalValue?.coerceAtLeast(1) ?: return null
        val unit = schedule.intervalUnit ?: return null
        val anchorMillis = if (schedule.scheduleBasis == ScheduleBasis.Calendar) {
            currentDueAt ?: completedAt
        } else {
            completedAt
        }
        var candidate = addInterval(
            Instant.ofEpochMilli(anchorMillis).atZone(zoneId),
            value,
            unit,
        )
        if (schedule.scheduleBasis == ScheduleBasis.Calendar) {
            while (candidate.toInstant().toEpochMilli() <= completedAt) {
                candidate = addInterval(candidate, value, unit)
            }
        }
        return candidate.toInstant().toEpochMilli()
    }

    private fun weeklyNext(
        schedule: ChoreSchedule,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId,
    ): Long? {
        val days = schedule.daysOfWeek.ifEmpty {
            setOf(Instant.ofEpochMilli(currentDueAt ?: completedAt).atZone(zoneId).dayOfWeek.value)
        }
        val anchorMillis = if (schedule.scheduleBasis == ScheduleBasis.Calendar) {
            maxOf(currentDueAt ?: completedAt, completedAt)
        } else {
            completedAt
        }
        var date = Instant.ofEpochMilli(anchorMillis).atZone(zoneId).toLocalDate().plusDays(1)
        repeat(14) {
            if (date.dayOfWeek.value in days) {
                return date.atStartOfDay(zoneId).toInstant().toEpochMilli()
            }
            date = date.plusDays(1)
        }
        return null
    }

    private fun monthlyNext(
        schedule: ChoreSchedule,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId,
    ): Long {
        val anchorMillis = if (schedule.scheduleBasis == ScheduleBasis.Calendar) {
            maxOf(currentDueAt ?: completedAt, completedAt)
        } else {
            completedAt
        }
        val anchor = Instant.ofEpochMilli(anchorMillis).atZone(zoneId)
        val targetDay = schedule.dayOfMonth ?: anchor.dayOfMonth
        val nextMonth = anchor.toLocalDate().withDayOfMonth(1).plusMonths(1)
        val date = nextMonth.withDayOfMonth(targetDay.coerceAtMost(nextMonth.lengthOfMonth()))
        return date.atStartOfDay(zoneId).toInstant().toEpochMilli()
    }

    private fun addInterval(
        base: ZonedDateTime,
        value: Int,
        unit: RecurrenceUnit,
    ): ZonedDateTime = when (unit) {
        RecurrenceUnit.Days -> base.plusDays(value.toLong())
        RecurrenceUnit.Weeks -> base.plusWeeks(value.toLong())
        RecurrenceUnit.Months -> base.plusMonths(value.toLong())
        RecurrenceUnit.Years -> base.plusYears(value.toLong())
    }
}
