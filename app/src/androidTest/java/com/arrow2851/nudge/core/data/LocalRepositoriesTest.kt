package com.arrow2851.nudge.core.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
import com.arrow2851.nudge.core.model.TaskStatus
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.seed.DatabaseSeeder
import com.arrow2851.nudge.core.seed.DemoSeedData
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LocalRepositoriesTest {
    private lateinit var database: NudgeDatabase
    private val fixedTime = object : TimeProvider {
        override fun nowEpochMillis(): Long = DemoSeedData.Epoch + 999L
    }
    private val fixedIds = object : IdGenerator {
        override fun newId(): String = "generated-id"
    }

    @Before
    fun createDatabase() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, NudgeDatabase::class.java)
            .allowMainThreadQueries()
            .build()
    }

    @After
    fun closeDatabase() {
        database.close()
    }

    @Test
    fun areasAndSectionsAreObservedInSortOrder() = runBlocking {
        val repository = LocalAreaRepository(
            database,
            database.areaDao(),
            database.choreDao(),
            fixedIds,
            fixedTime,
        )
        val area = Area(
            id = "area",
            name = "House",
            sortOrder = 0L,
            createdAt = fixedTime.nowEpochMillis(),
            updatedAt = fixedTime.nowEpochMillis(),
        )
        repository.saveArea(area)
        repository.saveSection(
            Section(
                id = "second",
                areaId = area.id,
                name = "Bathroom",
                sortOrder = SortOrders.initial(1),
                createdAt = fixedTime.nowEpochMillis(),
                updatedAt = fixedTime.nowEpochMillis(),
            ),
        )
        repository.saveSection(
            Section(
                id = "first",
                areaId = area.id,
                name = "Kitchen",
                sortOrder = SortOrders.initial(0),
                createdAt = fixedTime.nowEpochMillis(),
                updatedAt = fixedTime.nowEpochMillis(),
            ),
        )

        val observed = repository.observeArea(area.id).first()

        assertEquals(area, observed?.area)
        assertEquals(listOf("Kitchen", "Bathroom"), observed?.sections?.map { it.name })
    }

    @Test
    fun completingATaskUpdatesStatusAndTimestamp() = runBlocking {
        val repository = LocalTaskRepository(database, database.taskDao(), fixedTime)
        repository.saveTask(
            Task(
                id = "task",
                title = "Submit reimbursement",
                sortOrder = 0L,
                createdAt = DemoSeedData.Epoch,
                updatedAt = DemoSeedData.Epoch,
            ),
        )

        repository.setCompleted("task", DemoSeedData.Epoch + 500L)
        val completed = repository.observeTask("task").first()

        assertEquals(TaskStatus.Completed, completed?.status)
        assertEquals(DemoSeedData.Epoch + 500L, completed?.completedAt)
        assertEquals(fixedTime.nowEpochMillis(), completed?.updatedAt)
    }

    @Test
    fun reusableListRepositoryReturnsItemsAndCatalogSuggestions() = runBlocking {
        val repository = LocalReusableListRepository(database.reusableListDao(), fixedTime)
        repository.saveList(
            ReusableList(
                id = "groceries",
                name = "Groceries",
                sortOrder = 0L,
                createdAt = DemoSeedData.Epoch,
                updatedAt = DemoSeedData.Epoch,
            ),
        )
        repository.saveCatalogItem(
            ListCatalogItem(
                id = "milk",
                normalizedName = "milk",
                displayName = "Milk",
                timesUsed = 4,
            ),
        )
        repository.saveItem(
            ListItem(
                id = "milk-item",
                listId = "groceries",
                catalogItemId = "milk",
                name = "Milk",
                sortOrder = 0L,
                addedAt = DemoSeedData.Epoch,
                updatedAt = DemoSeedData.Epoch,
            ),
        )

        assertEquals("Milk", repository.observeList("groceries").first()?.items?.single()?.name)
        assertEquals("Milk", repository.observeSuggestions("mi").first().single().displayName)
    }

    @Test
    fun deterministicSeederOnlyRunsOnce() = runBlocking {
        val seeder = DatabaseSeeder(database)

        assertTrue(seeder.seedIfEmpty())
        assertFalse(seeder.seedIfEmpty())
        assertEquals(DemoSeedData.areas.size, database.areaDao().observeActiveAreas().first().size)
    }
}
