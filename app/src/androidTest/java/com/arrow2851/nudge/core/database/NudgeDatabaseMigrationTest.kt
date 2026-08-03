package com.arrow2851.nudge.core.database

import androidx.room.testing.MigrationTestHelper
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class NudgeDatabaseMigrationTest {
    @get:Rule
    val helper = MigrationTestHelper(
        InstrumentationRegistry.getInstrumentation(),
        NudgeDatabase::class.java,
    )

    @Test
    fun versionTwoSchemaCreatesEveryCoreTable() {
        val database = helper.createDatabase(
            name = "phase4-schema-test.db",
            version = NudgeDatabase.Version,
        )
        val tableNames = mutableSetOf<String>()

        database.query("SELECT name FROM sqlite_master WHERE type = 'table'").use { cursor ->
            while (cursor.moveToNext()) tableNames += cursor.getString(0)
        }
        database.close()

        val expected = setOf(
            "areas",
            "sections",
            "tasks",
            "task_main_flags",
            "chores",
            "chore_schedules",
            "completions",
            "reusable_lists",
            "list_catalog_items",
            "list_items",
        )
        assertTrue(tableNames.containsAll(expected))
    }

    @Test
    fun migrationOneToTwoPreservesTasksAndAddsMainTaskFlags() {
        val name = "phase4-migration-test.db"
        helper.createDatabase(name = name, version = 1).apply {
            execSQL(
                """
                INSERT INTO tasks (
                    id, title, description, parent_task_id, area_id, section_id,
                    status, priority, estimated_minutes, due_at, include_in_nudges,
                    sort_order, created_at, updated_at, completed_at, archived_at
                ) VALUES (
                    'task', 'Preserved task', NULL, NULL, NULL, NULL,
                    'Inbox', 0, NULL, NULL, 1,
                    0, 1000, 1000, NULL, NULL
                )
                """.trimIndent(),
            )
            close()
        }

        val migrated = helper.runMigrationsAndValidate(
            name,
            2,
            true,
            NudgeMigrations.Migration1To2,
        )

        migrated.query("SELECT title FROM tasks WHERE id = 'task'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Preserved task", cursor.getString(0))
        }
        migrated.query("SELECT COUNT(*) FROM task_main_flags").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals(0, cursor.getInt(0))
        }
        migrated.close()
    }
}
