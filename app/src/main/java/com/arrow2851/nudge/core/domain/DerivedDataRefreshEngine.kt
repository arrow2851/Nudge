package com.arrow2851.nudge.core.domain

import javax.inject.Inject

data class DerivedDataRefreshResult(
    val scannedRecurringChores: Int,
    val repairedRecurringChores: Int,
    val recommendationCandidateIds: List<String>,
)

class DerivedDataRefreshEngine @Inject constructor(
    private val recurrenceMaintenanceEngine: RecurrenceMaintenanceEngine,
    private val recommendationReader: RecommendationReader,
) {
    suspend fun refresh(now: Long): DerivedDataRefreshResult {
        val recurrence = recurrenceMaintenanceEngine.repairMissingDueDates(now)
        val recommendations = recommendationReader.rank(
            context = RecommendationContext(now = now),
            limit = 3,
        )
        return DerivedDataRefreshResult(
            scannedRecurringChores = recurrence.scannedCount,
            repairedRecurringChores = recurrence.repairedCount,
            recommendationCandidateIds = recommendations.map { it.candidate.id },
        )
    }
}
