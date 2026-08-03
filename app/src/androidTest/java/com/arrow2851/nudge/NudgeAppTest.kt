package com.arrow2851.nudge

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
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
    fun productionShellLaunchesAndSwitchesDestinations() {
        composeRule.onNodeWithText("Small steps, right now.").assertIsDisplayed()

        val destinations = listOf(
            "Areas" to "Keep recurring care visible.",
            "Tasks" to "One-time tasks stay lightweight.",
            "Lists" to "Reusable lists remember what matters.",
            "Today" to "Small steps, right now.",
        )

        destinations.forEach { (destination, expectedHeadline) ->
            composeRule
                .onNodeWithContentDescription("$destination destination")
                .performClick()
            composeRule.onNodeWithText(expectedHeadline).assertIsDisplayed()
        }
    }

    @Test
    fun quickAddUsesTheSharedBottomSheetAndField() {
        composeRule.onNodeWithContentDescription("Quick add").performClick()
        composeRule.onNodeWithText("Capture the thought now. Destination-specific details come next.")
            .assertIsDisplayed()
        composeRule.onNodeWithText("Name").assertIsDisplayed()
        composeRule.onNodeWithText("Save").assertIsDisplayed()
    }
}
