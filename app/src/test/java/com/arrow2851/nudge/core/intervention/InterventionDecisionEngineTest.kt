package com.arrow2851.nudge.core.intervention

import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class InterventionDecisionEngineTest {
    private val engine = InterventionDecisionEngine()
    private val zone = ZoneId.of("America/Chicago")

    @Test
    fun `eligible session passes all safeguards`() {
        val now = instantAt(2026, 8, 3, 14, 0)
        val reason = engine.blockReason(
            input(
                now = now,
                session = UsageSession("social", now - 20 * 60_000L, now, setOf("social")),
            ),
        )

        assertNull(reason)
    }

    @Test
    fun `quiet hours block an otherwise eligible session`() {
        val now = instantAt(2026, 8, 3, 23, 0)
        val reason = engine.blockReason(
            input(
                now = now,
                session = UsageSession("social", now - 20 * 60_000L, now, setOf("social")),
            ),
        )

        assertEquals(InterventionBlockReason.QuietHours, reason)
    }

    @Test
    fun `cooldown blocks repeated prompt`() {
        val now = instantAt(2026, 8, 3, 14, 0)
        val reason = engine.blockReason(
            input(
                now = now,
                session = UsageSession("social", now - 20 * 60_000L, now, setOf("social")),
                runtime = InterventionRuntimeState(lastPromptAt = now - 5 * 60_000L),
            ),
        )

        assertEquals(InterventionBlockReason.Cooldown, reason)
    }

    @Test
    fun `daily limit resets on a new local date`() {
        val now = instantAt(2026, 8, 4, 14, 0)
        val reason = engine.blockReason(
            input(
                now = now,
                session = UsageSession("social", now - 20 * 60_000L, now, setOf("social")),
                runtime = InterventionRuntimeState(
                    dailyDateKey = "2026-08-03",
                    dailyPromptCount = 3,
                ),
            ),
        )

        assertNull(reason)
    }

    private fun input(
        now: Long,
        session: UsageSession?,
        runtime: InterventionRuntimeState = InterventionRuntimeState(),
    ) = InterventionDecisionInput(
        settings = InterventionSettings(
            enabled = true,
            selectedPackages = setOf("social"),
            usageLimitMinutes = 15,
            cooldownMinutes = 45,
            dailyLimit = 3,
        ),
        runtime = runtime,
        session = session,
        now = now,
        zoneId = zone,
        usageAccessGranted = true,
    )

    private fun instantAt(year: Int, month: Int, day: Int, hour: Int, minute: Int): Long =
        ZonedDateTime.of(year, month, day, hour, minute, 0, 0, zone)
            .toInstant()
            .toEpochMilli()
}
