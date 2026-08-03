package com.arrow2851.nudge

import org.junit.Assert.assertEquals
import org.junit.Test

class FoundationUnitTest {
    @Test
    fun applicationId_isStable() {
        assertEquals("com.arrow2851.nudge", BuildConfig.APPLICATION_ID)
    }
}
