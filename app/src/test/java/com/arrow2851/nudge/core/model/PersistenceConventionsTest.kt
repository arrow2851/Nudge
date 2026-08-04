package com.arrow2851.nudge.core.model

import com.arrow2851.nudge.core.database.DatabaseConverters
import com.arrow2851.nudge.core.seed.DemoSeedData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PersistenceConventionsTest {
    @Test
    fun sparseOrderingSupportsInsertionUntilRebalanceIsNeeded() {
        assertEquals(0L, SortOrders.initial(0))
        assertEquals(1_024L, SortOrders.initial(1))
        assertEquals(512L, SortOrders.between(0L, 1_024L))
        assertNull(SortOrders.between(5L, 6L))
    }

    @Test
    fun enumAndCollectionConvertersRoundTrip() {
        val converters = DatabaseConverters()

        assertEquals(
            TaskStatus.InProgress,
            converters.stringToTaskStatus(
                converters.taskStatusToString(TaskStatus.InProgress),
            ),
        )
        assertEquals(
            setOf(1, 3, 7),
            converters.stringToDaysOfWeek(
                converters.daysOfWeekToString(setOf(7, 1, 3)),
            ),
        )
    }

    @Test
    fun demoFixturesAreDeterministicAndRelationallyConsistent() {
        assertEquals("demo-area-house", DemoSeedData.areas.first().id)
        assertTrue(DemoSeedData.sections.all { section ->
            DemoSeedData.areas.any { it.id == section.areaId }
        })
        assertTrue(DemoSeedData.chores.all { fixture ->
            fixture.schedule?.choreId == fixture.chore.id
        })
        assertTrue(DemoSeedData.listItems.all { item ->
            DemoSeedData.lists.any { it.id == item.listId }
        })
    }
}
