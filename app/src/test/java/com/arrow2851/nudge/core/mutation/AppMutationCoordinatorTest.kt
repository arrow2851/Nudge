package com.arrow2851.nudge.core.mutation

import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AppMutationCoordinatorTest {
    @Test
    fun `registered undo runs exactly once`() = runTest {
        val coordinator = AppMutationCoordinator()
        var undone = 0

        coordinator.beginMutation()
        val token = coordinator.registerUndo("Changed") { undone += 1 }

        assertTrue(coordinator.performUndo(token))
        assertFalse(coordinator.performUndo(token))
        assertTrue(undone == 1)
    }

    @Test
    fun `next mutation invalidates previous undo`() = runTest {
        val coordinator = AppMutationCoordinator()
        var undone = false

        coordinator.beginMutation()
        val token = coordinator.registerUndo("Changed") { undone = true }
        coordinator.beginMutation()

        assertFalse(coordinator.performUndo(token))
        assertFalse(undone)
    }

    @Test
    fun `new undo token cannot execute the previous action`() = runTest {
        val coordinator = AppMutationCoordinator()
        var first = 0
        var second = 0

        coordinator.beginMutation()
        val firstToken = coordinator.registerUndo("First") { first += 1 }
        coordinator.beginMutation()
        val secondToken = coordinator.registerUndo("Second") { second += 1 }

        assertFalse(coordinator.performUndo(firstToken))
        assertTrue(coordinator.performUndo(secondToken))
        assertTrue(first == 0)
        assertTrue(second == 1)
    }
}
