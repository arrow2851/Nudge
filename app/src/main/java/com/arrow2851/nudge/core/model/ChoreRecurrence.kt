package com.arrow2851.nudge.core.model

import com.arrow2851.nudge.core.domain.DefaultRecurrenceEngine
import java.time.LocalDate
import java.time.ZoneId

object ChoreRecurrence {
    private val engine = DefaultRecurrenceEngine()

    fun group(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): ChoreGroup = engine.group(chore, now, zoneId)

    fun nextDueAt(
        schedule: ChoreSchedule?,
        currentDueAt: Long?,
        completedAt: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): Long? = engine.nextDueAt(schedule, currentDueAt, completedAt, zoneId)

    fun dueLabel(
        chore: ChoreWithSchedule,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): String = engine.dueLabel(chore, now, zoneId)
}

fun LocalDate.atStartOfDayEpochMillis(zoneId: ZoneId = ZoneId.systemDefault()): Long =
    atStartOfDay(zoneId).toInstant().toEpochMilli()
