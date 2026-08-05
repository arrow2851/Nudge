package com.arrow2851.nudge

import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertTextContains
import androidx.compose.ui.test.hasAnyAncestor
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.isToggleable
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
import androidx.compose.ui.test.performTouchInput
import androidx.compose.ui.test.swipeRight
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class NudgeAppTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun shellNavigationAndSettingsAlwaysReturnToTodayRoot() {
        composeRule.onNodeWithText("Small steps, right now.").assertIsDisplayed()
        listOf(
            "Areas" to "Keep recurring care visible.",
            "Tasks" to "Capture it, check it off, and keep moving.",
            "Lists" to "Reusable lists remember what matters.",
            "Today" to "Small steps, right now.",
        ).forEach { (destination, expectedText) ->
            composeRule.onNodeWithContentDescription("$destination destination").performClick()
            composeRule.onNodeWithText(expectedText).assertIsDisplayed()
        }

        composeRule.onNodeWithContentDescription("Settings").performClick()
        composeRule.onNodeWithText("Display and item behavior").assertIsDisplayed()
        composeRule.onNodeWithContentDescription("Today destination").performClick()
        composeRule.onNodeWithText("Small steps, right now.").assertIsDisplayed()
    }

    @Test
    fun taskRowsSupportAtomicUndoInvalidationInlineDatesAndAutomaticChildren() {
        createTask("Atomic parent")

        composeRule.onNodeWithTag("task-checkbox-Atomic parent", useUnmergedTree = true)
            .performClick()
        waitForText("Task completed")
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")

        composeRule.onNodeWithTag("task-checkbox-Atomic parent", useUnmergedTree = true)
            .performClick()
        waitForText("Task completed")
        composeRule.onNodeWithContentDescription("Add task").performClick()
        composeRule.waitUntil(5_000L) {
            composeRule.onAllNodesWithText("Undo").fetchSemanticsNodes().isEmpty()
        }
        completeOpenTextEditor("Mutation after completion")

        val row = hasContentDescription("Checklist item Atomic parent")
        firstNode(
            hasContentDescription("Set due date") and hasAnyAncestor(row),
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Set date").assertIsDisplayed()
        composeRule.onNodeWithText("Cancel").performClick()

        firstNode(
            hasContentDescription("Expand subitems") and hasAnyAncestor(row),
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Add subtask").performClick()
        completeOpenTextEditor("Atomic child")
        composeRule.onNodeWithText("Atomic child").assertIsDisplayed()
        composeRule.onNodeWithText("0/1").assertIsDisplayed()
    }

    @Test
    fun recurringCareTemplateAndGradedCompletionSupportExactUndo() {
        composeRule.onNodeWithContentDescription("Areas destination").performClick()
        composeRule.onNodeWithContentDescription("Add area").performClick()
        composeRule.onNodeWithTag("area-name-field").performTextInput("Refactor House")
        composeRule.onNodeWithTag("house-template-choice").performClick()
        composeRule.onNodeWithTag("save-area").performClick()

        waitForNode(hasTestTag("area-card-Refactor House"))
        composeRule.onNodeWithTag("area-card-Refactor House").performClick()
        waitForNode(hasTestTag("section-card-Kitchen"))
        composeRule.onNodeWithTag("section-card-Kitchen").performClick()
        composeRule.onNodeWithText("Wipe countertops").assertIsDisplayed()
        composeRule.onNodeWithTag("complete-chore-Wipe countertops").performClick()
        composeRule.onNodeWithTag("complete-light").performClick()
        waitForText("Completed; next occurrence scheduled")
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")
        composeRule.onNodeWithText("Wipe countertops").assertIsDisplayed()

        composeRule.onNodeWithContentDescription("Add chore").performClick()
        composeRule.onNodeWithTag("chore-name-field").performTextInput("Polish fixtures")
        composeRule.onNodeWithText("As needed").performClick()
        composeRule.onNodeWithTag("save-chore").performScrollTo().performClick()
        waitForText("1 as needed", substring = true)
        composeRule.onNodeWithTag("section-detail-Kitchen")
            .performScrollToNode(hasTestTag("chore-row-Polish fixtures"))
        composeRule.onNodeWithTag("chore-row-Polish fixtures").assertIsDisplayed()
    }

    @Test
    fun reusableListUsesInlineNotesSwipeSuggestionAndAtomicUndo() {
        composeRule.onNodeWithContentDescription("Lists destination").performClick()
        composeRule.onNodeWithContentDescription("Add list").performClick()
        composeRule.onNodeWithTag("list-name-field").performTextInput("Refactor Groceries")
        composeRule.onNodeWithTag("save-list").performClick()
        waitForNode(hasTestTag("list-card-Refactor Groceries"))
        composeRule.onNodeWithTag("list-card-Refactor Groceries").performClick()

        addListItem("Oat Milk", "2 cartons")
        waitForNode(hasTestTag("list-item-row-Oat Milk"))
        firstNode(
            hasContentDescription("Change quantity or note") and
                hasAnyAncestor(hasTestTag("list-item-row-Oat Milk")),
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Quantity or note").assertIsDisplayed()
        composeRule.onNodeWithText("Save").performClick()

        listItemToggle("Oat Milk").performClick()
        waitForText("Item checked")
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")
        waitForText("1 active · 0 checked", substring = true)

        listItemToggle("Oat Milk").performClick()
        waitForText("0 active · 1 checked", substring = true)
        composeRule.onNodeWithContentDescription("Add list item").performClick()
        composeRule.onNodeWithTag("list-item-name-field").performTextInput("oat")
        waitForText("Swipe right across the name", substring = true)
        composeRule.onNodeWithTag("list-item-name-field").performTouchInput { swipeRight() }
        composeRule.onNodeWithTag("list-item-quantity-field").assertTextContains("2 cartons")
        composeRule.onNodeWithTag("save-list-item").performScrollTo().performClick()
        waitForText("1 active · 1 checked", substring = true)
    }

    @Test
    fun historyCanBeClearedWithoutChangingTheCompletedTask() {
        createTask("History task")
        composeRule.onNodeWithTag("task-checkbox-History task", useUnmergedTree = true)
            .performClick()
        waitForText("Task completed")

        composeRule.onNodeWithContentDescription("Today destination").performClick()
        composeRule.onNodeWithContentDescription("Settings").performClick()
        composeRule.onNodeWithText("History").performClick()
        waitForText("History task")
        composeRule.onNodeWithText("Clear all").performClick()
        composeRule.onAllNodesWithText("Clear all")[1].performClick()
        waitForText("No history yet")

        composeRule.onNodeWithContentDescription("Tasks destination").performClick()
        composeRule.onNodeWithText("History task").assertIsDisplayed()
    }

    @Test
    fun rightHandedModeMirrorsMetadataCheckboxAndDragControls() {
        composeRule.onNodeWithContentDescription("Settings").performClick()
        composeRule.onNodeWithText("Display and item behavior").performClick()
        composeRule.onNodeWithText("Right-handed").performClick()
        composeRule.onNodeWithContentDescription("Tasks destination").performClick()
        createTask("Right handed task", alreadyOnTasks = true)

        val row = hasContentDescription("Checklist item Right handed task")
        val metadata = firstNode(
            hasContentDescription("Set due date") and hasAnyAncestor(row),
            useUnmergedTree = true,
        ).fetchSemanticsNode().boundsInRoot
        val checkbox = composeRule.onNodeWithTag(
            "task-checkbox-Right handed task",
            useUnmergedTree = true,
        ).fetchSemanticsNode().boundsInRoot
        val drag = firstNode(
            hasContentDescription("Drag to reorder") and hasAnyAncestor(row),
            useUnmergedTree = true,
        ).fetchSemanticsNode().boundsInRoot

        assertTrue(metadata.left < checkbox.left)
        assertTrue(checkbox.left < drag.left)
    }

    @Test
    fun todayAggregatesDueChoresAndSupportsCompletionUndo() {
        composeRule.onNodeWithContentDescription("Areas destination").performClick()
        composeRule.onNodeWithContentDescription("Add area").performClick()
        composeRule.onNodeWithTag("area-name-field").performTextInput("Today Area")
        composeRule.onNodeWithTag("save-area").performClick()
        waitForNode(hasTestTag("area-card-Today Area"))
        composeRule.onNodeWithTag("area-card-Today Area").performClick()

        composeRule.onNodeWithContentDescription("Add chore").performClick()
        composeRule.onNodeWithTag("chore-name-field").performTextInput("Today due chore")
        composeRule.onNodeWithTag("save-chore").performScrollTo().performClick()
        waitForNode(hasTestTag("chore-row-Today due chore"))

        composeRule.onNodeWithContentDescription("Today destination").performClick()
        waitForNode(hasTestTag("today-due-Today due chore"))
        composeRule.onNodeWithText("Due today").assertIsDisplayed()
        composeRule.onNodeWithTag(
            "today-complete-Today due chore",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Completed; next occurrence scheduled")
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")
        waitForNode(hasTestTag("today-due-Today due chore"))
    }

    private fun createTask(title: String, alreadyOnTasks: Boolean = false) {
        if (!alreadyOnTasks) {
            composeRule.onNodeWithContentDescription("Tasks destination").performClick()
        }
        composeRule.onNodeWithContentDescription("Add task").performClick()
        completeOpenTextEditor(title)
        waitForText(title)
    }

    private fun completeOpenTextEditor(text: String) {
        waitForNode(hasSetTextAction())
        firstNode(hasSetTextAction()).performTextInput(text)
        firstNode(hasSetTextAction()).performImeAction()
    }

    private fun addListItem(name: String, quantity: String) {
        composeRule.onNodeWithContentDescription("Add list item").performClick()
        composeRule.onNodeWithTag("list-item-name-field").performTextInput(name)
        composeRule.onNodeWithTag("list-item-quantity-field").performTextInput(quantity)
        composeRule.onNodeWithTag("save-list-item").performScrollTo().performClick()
    }

    private fun listItemToggle(name: String) = firstNode(
        isToggleable() and hasAnyAncestor(hasTestTag("list-item-row-$name")),
        useUnmergedTree = true,
    )

    private fun firstNode(
        matcher: SemanticsMatcher,
        useUnmergedTree: Boolean = false,
    ) = composeRule.onAllNodes(matcher, useUnmergedTree = useUnmergedTree)[0]

    private fun waitForNode(
        matcher: SemanticsMatcher,
        timeoutMillis: Long = 10_000L,
        useUnmergedTree: Boolean = false,
    ) {
        composeRule.waitUntil(timeoutMillis) {
            composeRule.onAllNodes(matcher, useUnmergedTree).fetchSemanticsNodes().isNotEmpty()
        }
    }

    private fun waitForText(
        text: String,
        substring: Boolean = false,
        timeoutMillis: Long = 10_000L,
    ) {
        composeRule.waitUntil(timeoutMillis) {
            composeRule.onAllNodesWithText(text, substring = substring)
                .fetchSemanticsNodes().isNotEmpty()
        }
    }
}
