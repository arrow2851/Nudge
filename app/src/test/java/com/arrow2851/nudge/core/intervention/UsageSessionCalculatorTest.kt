package com.arrow2851.nudge.core.intervention

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class UsageSessionCalculatorTest {
    private val calculator = UsageSessionCalculator()

    @Test
    fun `single selected app session is measured from foreground event`() {
        val session = calculator.calculate(
            events = listOf(
                UsageEventSnapshot("com.example.social", UsageEventType.Foreground, 1_000L),
            ),
            selectedPackages = setOf("com.example.social"),
            now = 601_000L,
            combinedSessions = false,
        )

        requireNotNull(session)
        assertEquals("com.example.social", session.packageName)
        assertEquals(10, session.durationMinutes)
    }

    @Test
    fun `unselected foreground app ends selected session`() {
        val session = calculator.calculate(
            events = listOf(
                UsageEventSnapshot("com.example.social", UsageEventType.Foreground, 1_000L),
                UsageEventSnapshot("com.example.mail", UsageEventType.Foreground, 120_000L),
            ),
            selectedPackages = setOf("com.example.social"),
            now = 601_000L,
            combinedSessions = true,
        )

        assertNull(session)
    }

    @Test
    fun `combined sessions bridge quick switch between selected apps`() {
        val session = calculator.calculate(
            events = listOf(
                UsageEventSnapshot("com.example.social", UsageEventType.Foreground, 1_000L),
                UsageEventSnapshot("com.example.social", UsageEventType.Background, 300_000L),
                UsageEventSnapshot("com.example.video", UsageEventType.Foreground, 305_000L),
            ),
            selectedPackages = setOf("com.example.social", "com.example.video"),
            now = 601_000L,
            combinedSessions = true,
        )

        requireNotNull(session)
        assertEquals("com.example.video", session.packageName)
        assertEquals(10, session.durationMinutes)
        assertEquals(setOf("com.example.social", "com.example.video"), session.packagesSeen)
    }

    @Test
    fun `screen off clears a selected session`() {
        val session = calculator.calculate(
            events = listOf(
                UsageEventSnapshot("com.example.social", UsageEventType.Foreground, 1_000L),
                UsageEventSnapshot(null, UsageEventType.ScreenOff, 120_000L),
            ),
            selectedPackages = setOf("com.example.social"),
            now = 601_000L,
            combinedSessions = false,
        )

        assertNull(session)
    }
}
