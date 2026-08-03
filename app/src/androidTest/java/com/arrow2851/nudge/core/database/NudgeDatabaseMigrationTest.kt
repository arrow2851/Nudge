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
        val database = helper.createDatabase("phase5-schema-test.db", NudgeDatabase.Version)
        val tableNames = mutableSetOf<String>()
        database.query("SELECT name FROM sqlite_master WHERE type = 'table'").use { cursor ->
            while (cursor.moveToNext()) tableNames += cursor.getString(0)
        }
        database.close()
        assertTrue(
            tableNames.containsAll(
                setOf(
                    "areas", "sections", "tasks", "task_main_flags", "chores",
                    "chore_schedules", "completions", "reusable_lists",
                    "list_catalog_items", "list_items",
                ),
            ),
        )
    }

    @Test
    fun migrationOneToTwoPreservesTasksAndRecurringCare() {
        val name = "phase5-migration-test.db"
        helper.createDatabase(name, 1).apply {
            execSQL("INSERT INTO areas VALUES ('area', 'House', 'home', 0, 1000, 1000, NULL)")
            execSQL("INSERT INTO sections VALUES ('section', 'area', 'Kitchen', NULL, 0, 1000, 1000, NULL)")
            execSQL(
                """
                INSERT INTO chores VALUES (
                    'chore', 'Clean sink', NULL, 'area', 'section', 0, 10, 1, 1,
                    'Moderate', 2000, 0, 0, 1000, 1000, NULL
                )
                """.trimIndent(),
            )
            execSQL(
                """
                INSERT INTO chore_schedules VALUES (
                    'chore', 'Interval', 1, 'Weeks', '', NULL, 'Completion'
                )
                """.trimIndent(),
            )
            execSQL(
                """
                INSERT INTO completions VALUES (
                    'completion', NULL, 'chore', 1500, 'Moderate', 10, NULL, 'App'
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

        migrated.query("SELECT title, next_due_at FROM chores WHERE id = 'chore'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Clean sink", cursor.getString(0))
            assertEquals(2000L, cursor.getLong(1))
        }
        migrated.query("SELECT recurrence_type, schedule_basis FROM chore_schedules WHERE chore_id = 'chore'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Interval", cursor.getString(0))
            assertEquals("Completion", cursor.getString(1))
        }
        migrated.query("SELECT grade FROM completions WHERE id = 'completion'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Moderate", cursor.getString(0))
        }
        migrated.query("SELECT COUNT(*) FROM task_main_flags").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals(0, cursor.getInt(0))
        }
        migrated.close()
    }
}
