package com.arrow2851.nudge.core.mutation

import kotlinx.coroutines.async
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AppMutationCoordinatorTest {
    @Test
    fun undoExecutesExactlyOnce() = runTest {
        val coordinator = AppMutationCoordinator()
        var executions = 0
        val event = async(UnconfinedTestDispatcher(testScheduler)) {
            coordinator.events.filterIsInstance<AppFeedbackEvent.UndoAvailable>().first()
        }
        val ticket = coordinator.beginMutation()
        coordinator.registerUndo(ticket, "Deleted") { executions += 1 }
        val token = event.await().token

        assertTrue(coordinator.performUndo(token))
        assertFalse(coordinator.performUndo(token))
        assertTrue(executions == 1)
    }

    @Test
    fun nextMutationInvalidatesPreviousUndo() = runTest {
        val coordinator = AppMutationCoordinator()
        var executions = 0
        val event = async(UnconfinedTestDispatcher(testScheduler)) {
            coordinator.events.filterIsInstance<AppFeedbackEvent.UndoAvailable>().first()
        }
        val ticket = coordinator.beginMutation()
        coordinator.registerUndo(ticket, "Completed") { executions += 1 }
        val token = event.await().token

        coordinator.beginMutation()

        assertFalse(coordinator.performUndo(token))
        assertTrue(executions == 0)
    }

    @Test
    fun newerUndoTokenCannotExecuteOlderAction() = runTest {
        val coordinator = AppMutationCoordinator()
        var firstExecutions = 0
        var secondExecutions = 0
        val firstEvent = async(UnconfinedTestDispatcher(testScheduler)) {
            coordinator.events.filterIsInstance<AppFeedbackEvent.UndoAvailable>().first()
        }
        val firstTicket = coordinator.beginMutation()
        coordinator.registerUndo(firstTicket, "First") { firstExecutions += 1 }
        val firstToken = firstEvent.await().token

        val secondEvent = async(UnconfinedTestDispatcher(testScheduler)) {
            coordinator.events.filterIsInstance<AppFeedbackEvent.UndoAvailable>().first()
        }
        val secondTicket = coordinator.beginMutation()
        coordinator.registerUndo(secondTicket, "Second") { secondExecutions += 1 }
        val secondToken = secondEvent.await().token

        assertFalse(coordinator.performUndo(firstToken))
        assertTrue(coordinator.performUndo(secondToken))
        assertTrue(firstExecutions == 0)
        assertTrue(secondExecutions == 1)
    }

    @Test
    fun slowOlderMutationCannotRegisterUndoAfterNewerMutation() = runTest {
        val coordinator = AppMutationCoordinator()
        val staleTicket = coordinator.beginMutation()
        val currentTicket = coordinator.beginMutation()

        val staleToken = coordinator.registerUndo(staleTicket, "Stale") { error("must not run") }
        val currentToken = coordinator.registerUndo(currentTicket, "Current") { }

        assertTrue(staleToken == null)
        assertTrue(currentToken != null)
    }
}
