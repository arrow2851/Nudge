package com.arrow2851.nudge

import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertExists
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class NudgeAppTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun appLaunchesAndSwitchesDestinations() {
        composeRule.onNodeWithText("Android foundation is running.").assertExists()

        composeRule.onNodeWithText("Areas").performClick()
        composeRule.onAllNodesWithText("Areas").assertCountEquals(2)
    }
}
