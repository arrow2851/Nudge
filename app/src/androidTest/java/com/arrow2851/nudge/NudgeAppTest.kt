package com.arrow2851.nudge

import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performImeAction
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.performScrollToNode
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
        waitForNode(hasSetTextAction())
        composeRule.onNode(hasSetTextAction()).performTextInput("Phase 4 task")
        composeRule.onNode(hasSetTextAction()).performImeAction()
        composeRule.onNodeWithText("Phase 4 task").assertIsDisplayed()
        waitForNode(
            hasTestTag("task-checkbox-Phase 4 task"),
            useUnmergedTree = true,
        )
        composeRule.onNodeWithTag(
            "task-checkbox-Phase 4 task",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Task completed", timeoutMillis = 10_000L)
        composeRule.onNodeWithText("Undo").performClick()
        composeRule.onNodeWithTag("task-details-Phase 4 task").performClick()
        composeRule.onNodeWithText("Task details").assertIsDisplayed()
        composeRule.onNodeWithTag("main-task-switch-Phase 4 task").performClick()
        composeRule.onNodeWithText("Add subtask").performClick()
        waitForNode(hasSetTextAction())
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

        waitForNode(hasTestTag("area-card-Phase 5 House"), timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("area-card-Phase 5 House").performClick()
        waitForNode(hasTestTag("section-card-Kitchen"), timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("section-card-Kitchen").performClick()
        composeRule.onNodeWithText("Wipe countertops").assertIsDisplayed()
        composeRule.onNodeWithTag("complete-chore-Wipe countertops").performClick()
        composeRule.onNodeWithTag("complete-light").performClick()
        waitForText("Completed; next occurrence scheduled", timeoutMillis = 10_000L)
        composeRule.onNodeWithText("Completed; next occurrence scheduled").assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Add chore").performClick()
        composeRule.onNodeWithTag("chore-name-field").performTextInput("Polish fixtures")
        composeRule.onNodeWithText("As needed").performClick()
        composeRule.onNodeWithTag("save-chore").performScrollTo().performClick()
        waitForText("1 as needed", substring = true, timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("section-detail-Kitchen")
            .performScrollToNode(hasTestTag("chore-row-Polish fixtures"))
        composeRule.onNodeWithTag("chore-row-Polish fixtures").assertIsDisplayed()
        composeRule.onNodeWithText("AS NEEDED").assertIsDisplayed()
    }

    @Test
    fun completeReusableListsWorkflowLearnsSuggestionsAndSupportsUndo() {
        composeRule.onNodeWithContentDescription("Lists destination").performClick()
        composeRule.onNodeWithContentDescription("Add list").performClick()
        composeRule.onNodeWithTag("list-name-field").performTextInput("Phase 6 Groceries")
        composeRule.onNodeWithTag("save-list").performClick()
        waitForNode(hasTestTag("list-card-Phase 6 Groceries"), timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("list-card-Phase 6 Groceries").performClick()

        composeRule.onNodeWithContentDescription("Add list item").performClick()
        composeRule.onNodeWithTag("list-item-name-field").performTextInput("Oat Milk")
        composeRule.onNodeWithTag("list-item-quantity-field").performTextInput("2 cartons")
        composeRule.onNodeWithTag("save-list-item").performScrollTo().performClick()
        waitForNode(hasTestTag("list-item-row-Oat Milk"), timeoutMillis = 10_000L)

        waitForNode(
            hasTestTag("list-item-checkbox-Oat Milk"),
            useUnmergedTree = true,
        )
        composeRule.onNodeWithTag(
            "list-item-checkbox-Oat Milk",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Item checked", timeoutMillis = 15_000L)
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Change undone", timeoutMillis = 10_000L)
        waitForText("1 active · 0 checked", substring = true, timeoutMillis = 10_000L)
        composeRule.onNodeWithTag(
            "list-item-checkbox-Oat Milk",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Item checked", timeoutMillis = 15_000L)
        waitForText("0 active · 1 checked", substring = true, timeoutMillis = 10_000L)

        composeRule.onNodeWithContentDescription("Add list item").performClick()
        composeRule.onNodeWithTag("list-item-name-field").performTextInput("oat")
        waitForNode(hasTestTag("list-suggestion-oat milk"), timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("list-suggestion-oat milk").performClick()
        composeRule.onNodeWithTag("save-list-item").performScrollTo().performClick()
        waitForText("1 active · 1 checked", substring = true, timeoutMillis = 10_000L)
        waitForTextCount("2 cartons", minimumCount = 2, timeoutMillis = 10_000L)
    }

    @Test
    fun todayAggregatesDueChoreAndSupportsCompletionUndo() {
        composeRule.onNodeWithContentDescription("Areas destination").performClick()
        composeRule.onNodeWithContentDescription("Add area").performClick()
        composeRule.onNodeWithTag("area-name-field").performTextInput("Phase 7 Area")
        composeRule.onNodeWithTag("save-area").performClick()
        waitForNode(hasTestTag("area-card-Phase 7 Area"), timeoutMillis = 10_000L)
        composeRule.onNodeWithTag("area-card-Phase 7 Area").performClick()

        composeRule.onNodeWithContentDescription("Add chore").performClick()
        composeRule.onNodeWithTag("chore-name-field").performTextInput("Phase 7 due chore")
        composeRule.onNodeWithTag("save-chore").performScrollTo().performClick()
        waitForNode(hasTestTag("chore-row-Phase 7 due chore"), timeoutMillis = 10_000L)

        composeRule.onNodeWithContentDescription("Today destination").performClick()
        waitForNode(hasTestTag("today-due-Phase 7 due chore"), timeoutMillis = 10_000L)
        composeRule.onNodeWithText("Due today").assertIsDisplayed()
        composeRule.onNodeWithText("Lists").assertIsDisplayed()
        composeRule.onNodeWithText("Recent Activity").assertIsDisplayed()

        waitForNode(
            hasTestTag("today-complete-Phase 7 due chore"),
            timeoutMillis = 10_000L,
            useUnmergedTree = true,
        )
        composeRule.onNodeWithTag(
            "today-complete-Phase 7 due chore",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Completed; next occurrence scheduled", timeoutMillis = 10_000L)
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Completion undone", timeoutMillis = 10_000L)
        waitForNode(hasTestTag("today-due-Phase 7 due chore"), timeoutMillis = 10_000L)
    }

    private fun waitForNode(
        matcher: SemanticsMatcher,
        timeoutMillis: Long = 5_000L,
        useUnmergedTree: Boolean = false,
    ) {
        composeRule.waitUntil(timeoutMillis = timeoutMillis) {
            composeRule
                .onAllNodes(matcher, useUnmergedTree = useUnmergedTree)
                .fetchSemanticsNodes()
                .isNotEmpty()
        }
    }

    private fun waitForText(
        text: String,
        substring: Boolean = false,
        timeoutMillis: Long = 5_000L,
    ) {
        composeRule.waitUntil(timeoutMillis = timeoutMillis) {
            composeRule
                .onAllNodesWithText(text, substring = substring)
                .fetchSemanticsNodes()
                .isNotEmpty()
        }
    }

    private fun waitForTextCount(
        text: String,
        minimumCount: Int,
        timeoutMillis: Long = 5_000L,
    ) {
        composeRule.waitUntil(timeoutMillis = timeoutMillis) {
            composeRule.onAllNodesWithText(text).fetchSemanticsNodes().size >= minimumCount
        }
    }
}
