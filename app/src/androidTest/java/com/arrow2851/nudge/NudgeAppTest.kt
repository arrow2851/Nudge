package com.arrow2851.nudge

import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assertDoesNotExist
import androidx.compose.ui.test.assertIsDisplayed
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
        waitForText("Small steps, right now.")
        listOf(
            "Areas" to "Keep recurring care visible.",
            "Tasks" to "Capture it, check it off, and keep moving.",
            "Lists" to "Reusable lists remember what matters.",
            "Today" to "Small steps, right now.",
        ).forEach { (destination, expectedText) ->
            composeRule.onNodeWithContentDescription("$destination destination").performClick()
            waitForText(expectedText)
        }

        composeRule.onNodeWithContentDescription("Settings").performClick()
        waitForText("Display and item behavior")
        composeRule.onNodeWithContentDescription("Today destination").performClick()
        waitForText("Small steps, right now.")
    }

    @Test
    fun taskRowsUseTopDatesDynamicParentsAndAtomicUndo() {
        createTask("Atomic parent")

        composeRule.onNodeWithText("Set date").performClick()
        composeRule.onNodeWithTag(
            "selection-task-checkbox-Atomic parent",
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Continue (1)").performClick()
        composeRule.onNodeWithText("Cancel").performClick()

        composeRule.onNodeWithContentDescription("Expand subitems").assertDoesNotExist()
        composeRule.onNodeWithContentDescription("Add task").performClick()
        completeOpenTextEditor("Atomic child")
        val childRow = hasContentDescription("Checklist item Atomic child")
        firstNode(childRow, useUnmergedTree = true).performTouchInput { swipeRight() }

        waitForText("0/1")
        waitForText("Atomic child")
        val parentRow = hasContentDescription("Checklist item Atomic parent")
        firstNode(
            hasContentDescription("Collapse subitems") and hasAnyAncestor(parentRow),
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Atomic child").assertDoesNotExist()
        firstNode(
            hasContentDescription("Expand subitems") and hasAnyAncestor(parentRow),
            useUnmergedTree = true,
        ).performClick()
        waitForText("Atomic child")

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
        waitForText("Mutation after completion")
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
    fun reusableListUsesInlineRowsNotesSuggestionBubblesAndBulkDelete() {
        composeRule.onNodeWithContentDescription("Lists destination").performClick()
        composeRule.onNodeWithContentDescription("Add list").performClick()
        composeRule.onNodeWithTag("list-name-field").performTextInput("Refactor Groceries")
        composeRule.onNodeWithTag("save-list").performClick()
        waitForNode(hasTestTag("list-card-Refactor Groceries"))
        composeRule.onNodeWithTag("list-card-Refactor Groceries").performClick()

        addListItem("Oat Milk")
        waitForNode(hasTestTag("list-item-row-Oat Milk"))

        composeRule.onNodeWithText("Add note").performClick()
        listItemToggle("Oat Milk").performClick()
        composeRule.onNodeWithText("Continue (1)").performClick()
        composeRule.onNodeWithTag("bulk-note-field").performTextInput("2 cartons")
        composeRule.onNodeWithText("Apply").performClick()
        waitForText("2 cartons")

        listItemToggle("Oat Milk").performClick()
        waitForText("Item checked")
        composeRule.onNodeWithContentDescription("Delete Oat Milk").assertIsDisplayed()
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")
        waitForText("1 active · 0 checked", substring = true)

        listItemToggle("Oat Milk").performClick()
        waitForText("0 active · 1 checked", substring = true)
        composeRule.onNodeWithContentDescription("Add list item").performClick()
        waitForNode(hasSetTextAction(), useUnmergedTree = true)
        composeRule.waitUntil(10_000L) {
            composeRule.onAllNodesWithText("Oat Milk").fetchSemanticsNodes().size >= 2
        }
        val oatNodes = composeRule.onAllNodesWithText("Oat Milk")
        oatNodes[oatNodes.fetchSemanticsNodes().lastIndex].performClick()
        waitForText("1 active · 1 checked", substring = true)

        composeRule.onNodeWithText("Select to delete").performClick()
        val checkedRow = hasTestTag("list-item-row-Oat Milk")
        firstNode(
            isToggleable() and hasAnyAncestor(checkedRow),
            useUnmergedTree = true,
        ).performClick()
        composeRule.onNodeWithText("Delete (1)").performClick()
        waitForText("1 items deleted")
        composeRule.onNodeWithText("Undo").performClick()
        waitForText("Undone")
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
    fun rightHandedModePlacesCheckedDeleteAtTheFarLeft() {
        composeRule.onNodeWithContentDescription("Settings").performClick()
        composeRule.onNodeWithText("Display and item behavior").performClick()
        composeRule.onNodeWithText("Right-handed").performClick()
        composeRule.onNodeWithContentDescription("Tasks destination").performClick()
        createTask("Right handed task", alreadyOnTasks = true)

        composeRule.onNodeWithContentDescription("Expand subitems").assertDoesNotExist()
        composeRule.onNodeWithTag(
            "task-checkbox-Right handed task",
            useUnmergedTree = true,
        ).performClick()
        waitForText("Task completed")

        val delete = composeRule.onNodeWithContentDescription("Delete Right handed task")
            .fetchSemanticsNode().boundsInRoot
        val checkbox = composeRule.onNodeWithTag(
            "task-checkbox-Right handed task",
            useUnmergedTree = true,
        ).fetchSemanticsNode().boundsInRoot

        assertTrue(delete.left < checkbox.left)
        composeRule.onNodeWithContentDescription("Drag to reorder").assertDoesNotExist()
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
        waitForNode(hasSetTextAction(), useUnmergedTree = true)
        firstNode(hasSetTextAction(), useUnmergedTree = true).performTextInput(text)
        firstNode(hasSetTextAction(), useUnmergedTree = true).performImeAction()
    }

    private fun addListItem(name: String) {
        composeRule.onNodeWithContentDescription("Add list item").performClick()
        completeOpenTextEditor(name)
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
