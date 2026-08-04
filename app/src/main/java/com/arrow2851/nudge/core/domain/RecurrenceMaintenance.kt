package com.arrow2851.nudge.core.domain

import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.flow.first

data class RecurrenceRepair(
    val choreId: String,
    val repairedNextDueAt: Long,
)

data class RecurrenceMaintenanceResult(
    val scannedCount: Int,
    val repairs: List<RecurrenceRepair>,
) {
    val repairedCount: Int
        get() = repairs.size
}

class RecurrenceMaintenancePlanner @Inject constructor(
    private val recurrenceEngine: DefaultRecurrenceEngine,
) {
    fun plan(
        chores: List<ChoreWithSchedule>,
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): List<RecurrenceRepair> = chores.mapNotNull { row ->
        recurrenceEngine.repairMissingDueAt(row, now, zoneId)?.let { nextDueAt ->
            RecurrenceRepair(
                choreId = row.chore.id,
                repairedNextDueAt = nextDueAt,
            )
        }
    }
}

class RecurrenceMaintenanceEngine @Inject constructor(
    private val choreRepository: ChoreRepository,
    private val planner: RecurrenceMaintenancePlanner,
) {
    suspend fun repairMissingDueDates(
        now: Long,
        zoneId: ZoneId = ZoneId.systemDefault(),
    ): RecurrenceMaintenanceResult {
        val chores = choreRepository.observeChoresWithSchedules().first()
        val repairs = planner.plan(chores, now, zoneId)
        val choresById = chores.associateBy { it.chore.id }
        repairs.forEach { repair ->
            val existing = choresById.getValue(repair.choreId)
            choreRepository.saveChore(
                existing.copy(
                    chore = existing.chore.copy(
                        nextDueAt = repair.repairedNextDueAt,
                        updatedAt = now,
                    ),
                ),
            )
        }
        return RecurrenceMaintenanceResult(
            scannedCount = chores.size,
            repairs = repairs,
        )
    }
}
