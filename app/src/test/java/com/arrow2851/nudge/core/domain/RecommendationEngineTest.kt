package com.arrow2851.nudge.core.domain

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RecommendationEngineTest {
    private val engine = DefaultRecommendationEngine()
    private val now = 1_700_000_000_000L

    @Test
    fun `rank excludes ineligible and over-budget candidates`() {
        val ranked = engine.rank(
            context = RecommendationContext(now = now, maximumMinutes = 10),
            candidates = listOf(
                candidate("eligible", estimatedMinutes = 5),
                candidate("completed", estimatedMinutes = 5, isCompleted = true),
                candidate("blocked", estimatedMinutes = 5, isBlocked = true),
                candidate("paused", estimatedMinutes = 5, isPaused = true),
                candidate("disabled", estimatedMinutes = 5, includeInNudges = false),
                candidate("long", estimatedMinutes = 30),
                candidate("snoozed", estimatedMinutes = 5, snoozedUntil = now + 1_000L),
            ),
        )

        assertEquals(listOf("eligible"), ranked.map { it.candidate.id })
    }

    @Test
    fun `overdue quick win outranks future work`() {
        val ranked = engine.rank(
            context = RecommendationContext(now = now, maximumMinutes = 15),
            candidates = listOf(
                candidate(
                    id = "future",
                    dueAt = now + 5L * 86_400_000L,
                    priority = 3,
                    estimatedMinutes = 15,
                ),
                candidate(
                    id = "overdue",
                    dueAt = now - 86_400_000L,
                    estimatedMinutes = 5,
                ),
            ),
        )

        assertEquals("overdue", ranked.first().candidate.id)
        assertTrue(ranked.first().score.urgency > ranked.last().score.urgency)
    }

    @Test
    fun `matching context can break otherwise equal candidates`() {
        val ranked = engine.rank(
            context = RecommendationContext(
                now = now,
                maximumMinutes = 15,
                areaId = "home",
                sectionId = "kitchen",
            ),
            candidates = listOf(
                candidate(id = "elsewhere", areaId = "car", sectionId = null),
                candidate(id = "nearby", areaId = "home", sectionId = "kitchen"),
            ),
        )

        assertEquals("nearby", ranked.first().candidate.id)
        assertEquals(50, ranked.first().score.contextFit)
    }

    @Test
    fun `recent and dismissal penalties rotate suggestions deterministically`() {
        val candidates = listOf(
            candidate(id = "alpha", title = "Alpha"),
            candidate(id = "beta", title = "Beta"),
            candidate(id = "gamma", title = "Gamma"),
        )
        val initial = engine.rank(
            context = RecommendationContext(now = now),
            candidates = candidates,
        )
        val rotated = engine.rank(
            context = RecommendationContext(
                now = now,
                recentSuggestionIds = setOf("alpha"),
                dismissalCounts = mapOf("beta" to 2),
            ),
            candidates = candidates,
        )

        assertEquals(listOf("alpha", "beta", "gamma"), initial.map { it.candidate.id })
        assertEquals("gamma", rotated.first().candidate.id)
        assertEquals(
            rotated.map { it.candidate.id },
            engine.rank(
                context = RecommendationContext(
                    now = now,
                    recentSuggestionIds = setOf("alpha"),
                    dismissalCounts = mapOf("beta" to 2),
                ),
                candidates = candidates,
            ).map { it.candidate.id },
        )
    }

    private fun candidate(
        id: String,
        title: String = id,
        dueAt: Long? = null,
        priority: Int = 0,
        estimatedMinutes: Int? = 10,
        includeInNudges: Boolean = true,
        areaId: String? = null,
        sectionId: String? = null,
        isCompleted: Boolean = false,
        isPaused: Boolean = false,
        isBlocked: Boolean = false,
        snoozedUntil: Long? = null,
    ): RecommendationCandidate = RecommendationCandidate(
        id = id,
        title = title,
        kind = RecommendationKind.Task,
        dueAt = dueAt,
        priority = priority,
        estimatedMinutes = estimatedMinutes,
        includeInNudges = includeInNudges,
        areaId = areaId,
        sectionId = sectionId,
        isCompleted = isCompleted,
        isPaused = isPaused,
        isBlocked = isBlocked,
        snoozedUntil = snoozedUntil,
    )
}
