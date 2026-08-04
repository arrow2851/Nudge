package com.arrow2851.nudge.core.data

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.arrow2851.nudge.core.database.NudgeDatabase
import com.arrow2851.nudge.core.model.SortOrders
import com.arrow2851.nudge.core.model.Task
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
class TaskVerticalSliceRepositoryTest {
    private lateinit var database: NudgeDatabase
    private lateinit var repository: LocalTaskRepository
    private var now = 10_000L

    @Before
    fun createDatabase() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        database = Room.inMemoryDatabaseBuilder(context, NudgeDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        repository = LocalTaskRepository(
            database = database,
            taskDao = database.taskDao(),
            timeProvider = object : TimeProvider {
                override fun nowEpochMillis(): Long = now
            },
        )
    }

    @After
    fun closeDatabase() {
        database.close()
    }

    @Test
    fun parentAndChildCompletionStaySynchronized() = runBlocking {
        repository.saveTask(task("parent", "Parent", 0L))
        repository.setMainTask("parent", true)
        repository.saveTask(task("a", "A", 0L, parentId = "parent"))
        repository.saveTask(task("b", "B", SortOrders.Gap, parentId = "parent"))

        repository.setCompleted("a", 11_000L)
        assertNull(repository.observeTask("parent").first()?.completedAt)

        repository.setCompleted("b", 12_000L)
        assertEquals(12_000L, repository.observeTask("parent").first()?.completedAt)

        repository.setCompleted("parent", null)
        assertTrue(repository.observeSubtasks("parent").first().all { it.completedAt == null })
    }

    @Test
    fun disablingMainTaskReleasesSubtasksAsRoots() = runBlocking {
        repository.saveTask(task("parent", "Parent", 0L))
        repository.setMainTask("parent", true)
        repository.saveTask(task("child", "Child", 0L, parentId = "parent"))

        repository.setMainTask("parent", false)

        val nodes = repository.observeTaskNodes().first()
        assertEquals(listOf("Parent", "Child"), nodes.map { it.task.title })
        assertFalse(nodes.first().isMainTask)
        assertTrue(nodes.all { it.subtasks.isEmpty() })
    }

    @Test
    fun indentAndUnindentPreserveOneLevelHierarchy() = runBlocking {
        repository.saveTask(task("first", "First", 0L))
        repository.saveTask(task("second", "Second", SortOrders.Gap))

        repository.indentTask("second")
        val indented = repository.observeTaskNodes().first()
        assertEquals("Second", indented.single().subtasks.single().title)
        assertTrue(indented.single().isMainTask)

        repository.unindentTask("second")
        val roots = repository.observeTaskNodes().first()
        assertEquals(listOf("First", "Second"), roots.map { it.task.title })
    }

    private fun task(
        id: String,
        title: String,
        sortOrder: Long,
        parentId: String? = null,
    ) = Task(
        id = id,
        title = title,
        parentTaskId = parentId,
        sortOrder = sortOrder,
        createdAt = now,
        updatedAt = now,
    )
}
