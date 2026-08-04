package com.arrow2851.nudge.core.domain

import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskStatus
import javax.inject.Inject
import kotlin.math.abs

private const val DayMillis = 86_400_000L
private const val DefaultEstimatedMinutes = 15

enum class RecommendationKind {
    Task,
    Chore,
}

data class RecommendationCandidate(
    val id: String,
    val title: String,
    val kind: RecommendationKind,
    val dueAt: Long? = null,
    val priority: Int = 0,
    val estimatedMinutes: Int? = null,
    val includeInNudges: Boolean = true,
    val areaId: String? = null,
    val sectionId: String? = null,
    val isCompleted: Boolean = false,
    val isPaused: Boolean = false,
    val isBlocked: Boolean = false,
    val snoozedUntil: Long? = null,
)

data class RecommendationContext(
    val now: Long,
    val maximumMinutes: Int = DefaultEstimatedMinutes,
    val areaId: String? = null,
    val sectionId: String? = null,
    val recentSuggestionIds: Set<String> = emptySet(),
    val dismissalCounts: Map<String, Int> = emptyMap(),
)

data class RecommendationScore(
    val urgency: Int,
    val priority: Int,
    val durationFit: Int,
    val contextFit: Int,
    val quickWin: Int,
    val recentPenalty: Int,
    val dismissalPenalty: Int,
) {
    val total: Int
        get() = urgency + priority + durationFit + contextFit + quickWin -
            recentPenalty - dismissalPenalty
}

data class ScoredRecommendation(
    val candidate: RecommendationCandidate,
    val score: RecommendationScore,
)

interface RecommendationEngine {
    fun rank(
        context: RecommendationContext,
        candidates: List<RecommendationCandidate>,
        limit: Int = 3,
    ): List<ScoredRecommendation>

    fun select(
        context: RecommendationContext,
        candidates: List<RecommendationCandidate>,
    ): ScoredRecommendation? = rank(context, candidates, limit = 1).firstOrNull()
}

class DefaultRecommendationEngine @Inject constructor() : RecommendationEngine {
    override fun rank(
        context: RecommendationContext,
        candidates: List<RecommendationCandidate>,
        limit: Int,
    ): List<ScoredRecommendation> {
        if (limit <= 0) return emptyList()
        return candidates
            .asSequence()
            .filter { it.isEligible(context) }
            .map { candidate ->
                ScoredRecommendation(
                    candidate = candidate,
                    score = score(candidate, context),
                )
            }
            .sortedWith(
                compareByDescending<ScoredRecommendation> { it.score.total }
                    .thenBy { it.candidate.dueAt ?: Long.MAX_VALUE }
                    .thenBy { it.candidate.estimatedMinutes ?: DefaultEstimatedMinutes }
                    .thenBy { it.candidate.title.lowercase() }
                    .thenBy { it.candidate.id },
            )
            .take(limit)
            .toList()
    }

    private fun RecommendationCandidate.isEligible(context: RecommendationContext): Boolean {
        if (!includeInNudges || isCompleted || isPaused || isBlocked) return false
        if (snoozedUntil != null && snoozedUntil > context.now) return false
        val estimate = estimatedMinutes ?: DefaultEstimatedMinutes
        return estimate <= context.maximumMinutes.coerceAtLeast(1)
    }

    private fun score(
        candidate: RecommendationCandidate,
        context: RecommendationContext,
    ): RecommendationScore {
        val estimate = candidate.estimatedMinutes ?: DefaultEstimatedMinutes
        val urgency = when (val dueAt = candidate.dueAt) {
            null -> 0
            else -> {
                val delta = dueAt - context.now
                when {
                    delta <= 0L -> 200 + ((-delta / DayMillis).coerceAtMost(30L) * 4L).toInt()
                    delta <= DayMillis -> 140
                    delta <= 3L * DayMillis -> 80
                    delta <= 7L * DayMillis -> 40
                    else -> 10
                }
            }
        }
        val priority = candidate.priority.coerceIn(0, 5) * 20
        val durationFit = (60 - abs(context.maximumMinutes - estimate) * 3).coerceAtLeast(0)
        val contextFit = when {
            context.sectionId != null && candidate.sectionId == context.sectionId -> 50
            context.areaId != null && candidate.areaId == context.areaId -> 30
            else -> 0
        }
        val quickWin = when {
            estimate <= 5 -> 30
            estimate <= 10 -> 15
            else -> 0
        }
        val recentPenalty = if (candidate.id in context.recentSuggestionIds) 80 else 0
        val dismissalPenalty = (
            context.dismissalCounts[candidate.id].orZero().coerceAtLeast(0) * 35
        ).coerceAtMost(140)
        return RecommendationScore(
            urgency = urgency,
            priority = priority,
            durationFit = durationFit,
            contextFit = contextFit,
            quickWin = quickWin,
            recentPenalty = recentPenalty,
            dismissalPenalty = dismissalPenalty,
        )
    }

    private fun Int?.orZero(): Int = this ?: 0
}

fun Task.toRecommendationCandidate(): RecommendationCandidate = RecommendationCandidate(
    id = id,
    title = title,
    kind = RecommendationKind.Task,
    dueAt = dueAt,
    priority = priority,
    estimatedMinutes = estimatedMinutes,
    includeInNudges = includeInNudges,
    areaId = areaId,
    sectionId = sectionId,
    isCompleted = completedAt != null || status == TaskStatus.Completed || status == TaskStatus.Cancelled,
    isBlocked = status == TaskStatus.Blocked,
)

fun ChoreWithSchedule.toRecommendationCandidate(): RecommendationCandidate = RecommendationCandidate(
    id = chore.id,
    title = chore.title,
    kind = RecommendationKind.Chore,
    dueAt = chore.nextDueAt,
    priority = chore.priority,
    estimatedMinutes = chore.estimatedMinutes,
    includeInNudges = chore.includeInNudges,
    areaId = chore.areaId,
    sectionId = chore.sectionId,
    isPaused = chore.isPaused,
)
