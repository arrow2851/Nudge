package com.arrow2851.nudge

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performImeAction
import androidx.compose.ui.test.performTextInput
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
            "Tasks" to "Capture it, check it off, and keep moving.",
            "Lists" to "Reusable lists remember what matters.",
            "Today" to "Small steps, right now.",
        )
        destinations.forEach { (destination, expectedText) ->
            composeRule.onNodeWithContentDescription("$destination destination").performClick()
            composeRule.onNodeWithText(expectedText).assertIsDisplayed()
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

    @Test
    fun completeTasksWorkflowPersistsAndSupportsUndoAndSubtasks() {
        composeRule.onNodeWithContentDescription("Tasks destination").performClick()
        composeRule.onNodeWithContentDescription("Add task").performClick()
        composeRule.onNode(hasSetTextAction()).performTextInput("Phase 4 task")
        composeRule.onNode(hasSetTextAction()).performImeAction()
        composeRule.onNodeWithText("Phase 4 task").assertIsDisplayed()
        composeRule.onNodeWithTag("task-checkbox-Phase 4 task").performClick()
        composeRule.onNodeWithText("Task completed").assertIsDisplayed()
        composeRule.onNodeWithText("Undo").performClick()
        composeRule.onNodeWithTag("task-details-Phase 4 task").performClick()
        composeRule.onNodeWithText("Task details").assertIsDisplayed()
        composeRule.onNodeWithTag("main-task-switch-Phase 4 task").performClick()
        composeRule.onNodeWithText("Add subtask").performClick()
        composeRule.onNode(hasSetTextAction()).performTextInput("Phase 4 child")
        composeRule.onNode(hasSetTextAction()).performImeAction()
        composeRule.onNodeWithText("Phase 4 child").assertIsDisplayed()
        composeRule.onNodeWithText("0/1 complete").assertIsDisplayed()
    }

    @Test
    fun completeRecurringCareWorkflowCreatesTemplateGradesAndAddsAsNeededChore() {
        composeRule.onNodeWithContentDescription("Areas destination").performClick()
        composeRule.onNodeWithContentDescription("Add area").performClick()
        composeRule.onNodeWithTag("area-name-field").performTextInput("Phase 5 House")
        composeRule.onNodeWithTag("house-template-choice").performClick()
        composeRule.onNodeWithTag("save-area").performClick()

        composeRule.onNodeWithTag("area-card-Phase 5 House").assertIsDisplayed().performClick()
        composeRule.onNodeWithTag("section-card-Kitchen").assertIsDisplayed().performClick()
        composeRule.onNodeWithText("Wipe countertops").assertIsDisplayed()
        composeRule.onNodeWithTag("complete-chore-Wipe countertops").performClick()
        composeRule.onNodeWithTag("complete-light").performClick()
        composeRule.waitUntil(timeoutMillis = 5_000L) {
            composeRule
                .onAllNodesWithText("Completed; next occurrence scheduled")
                .fetchSemanticsNodes()
                .isNotEmpty()
        }
        composeRule.onNodeWithText("Completed; next occurrence scheduled").assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Add chore").performClick()
        composeRule.onNodeWithTag("chore-name-field").performTextInput("Polish fixtures")
        composeRule.onNodeWithText("As needed").performClick()
        composeRule.onNodeWithTag("save-chore").performClick()
        composeRule.onNodeWithText("Polish fixtures").assertIsDisplayed()
        composeRule.onNodeWithText("AS NEEDED").assertIsDisplayed()
    }
}
