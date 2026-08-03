package com.arrow2851.nudge.core.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.TimeProvider
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ReusableListsWorkflowRepositoryTest {
    private lateinit var database: NudgeDatabase
    private lateinit var repository: RoomListWorkflowRepository
    private var now = 10_000L
    private var nextId = 0

    @Before
    fun createDatabase() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, NudgeDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        repository = RoomListWorkflowRepository(
            database = database,
            idGenerator = object : IdGenerator {
                override fun newId(): String = "generated-${++nextId}"
            },
            timeProvider = object : TimeProvider {
                override fun nowEpochMillis(): Long = ++now
            },
        )
    }

    @After
    fun closeDatabase() {
        database.close()
    }

    @Test
    fun reusableListLearnsSuggestionsAndUndoRestoresCheckState() = runBlocking {
        val list = repository.createList("Groceries", true)
        val milk = repository.addItem(list.id, "Oat Milk", "2 cartons")

        val mutation = repository.setItemChecked(milk.id, true)

        assertTrue(repository.observeList(list.id).first()!!.items.single().isChecked)
        val suggestion = repository.observeSuggestions("oat").first().single()
        assertEquals("Oat Milk", suggestion.displayName)
        assertEquals("2 cartons", suggestion.defaultQuantity)
        assertEquals(1, suggestion.timesUsed)

        repository.undoCheck(mutation)

        val restored = repository.observeList(list.id).first()!!.items.single()
        assertFalse(restored.isChecked)
        assertNull(restored.checkedAt)
    }

    @Test
    fun hierarchyOrderingResetAndClearPreserveUncheckedChildren() = runBlocking {
        val list = repository.createList("Packing", true)
        val parent = repository.addItem(list.id, "Clothes")
        val child = repository.addItem(list.id, "Socks")

        repository.indentItem(child.id)
        var observed = repository.observeList(list.id).first()!!
        assertEquals(parent.id, observed.items.first { it.id == child.id }.parentItemId)

        repository.setItemChecked(parent.id, true)
        repository.resetCheckedItems(list.id)
        observed = repository.observeList(list.id).first()!!
        assertFalse(observed.items.first { it.id == parent.id }.isChecked)

        repository.setItemChecked(parent.id, true)
        repository.clearCheckedItems(list.id)
        observed = repository.observeList(list.id).first()!!
        assertEquals(listOf("Socks"), observed.items.map { it.name })
        assertNull(observed.items.single().parentItemId)
    }

    @Test
    fun oneOffListsCanBeReorderedAndArchived() = runBlocking {
        val first = repository.createList("Hardware", false)
        val second = repository.createList("Errands", false)

        repository.moveList(second.id, -1)
        assertEquals(
            listOf("Errands", "Hardware"),
            repository.observeLists().first().map { it.list.name },
        )

        repository.archiveList(first.id)
        assertEquals(listOf("Errands"), repository.observeLists().first().map { it.list.name })
    }
}
