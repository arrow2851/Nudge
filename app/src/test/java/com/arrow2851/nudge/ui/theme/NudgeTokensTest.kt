package com.arrow2851.nudge.ui.theme

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class NudgeTokensTest {
    @Test
    fun spacingScaleMatchesApprovedPrototype() {
        val spacing = NudgeSpacing()

        assertEquals(4f, spacing.x1.value)
        assertEquals(8f, spacing.x2.value)
        assertEquals(12f, spacing.x3.value)
        assertEquals(16f, spacing.x4.value)
        assertEquals(20f, spacing.x5.value)
        assertEquals(24f, spacing.x6.value)
        assertEquals(32f, spacing.x8.value)
    }

    @Test
    fun interactionAndMotionTokensMeetPhaseTwoContract() {
        assertTrue(NudgeTouchTarget.Minimum.value >= 48f)
        assertEquals(140, NudgeMotion.Fast)
        assertEquals(220, NudgeMotion.Normal)
    }
}
