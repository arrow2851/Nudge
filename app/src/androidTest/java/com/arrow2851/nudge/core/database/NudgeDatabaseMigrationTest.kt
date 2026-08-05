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
    fun versionThreeSchemaCreatesEveryCoreTable() {
        val database = helper.createDatabase("phase11-schema-test.db", NudgeDatabase.Version)
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
                    "list_catalog_items", "list_items", "item_history",
                ),
            ),
        )
    }

    @Test
    fun migrationOneToTwoPreservesTasksRecurringCareAndLists() {
        val name = "phase6-migration-test.db"
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
            execSQL(
                """
                INSERT INTO reusable_lists VALUES (
                    'list', 'Groceries', 'refresh', 1, 0, 1000, 1000, NULL
                )
                """.trimIndent(),
            )
            execSQL(
                """
                INSERT INTO list_catalog_items VALUES (
                    'catalog', 'oat milk', 'Oat Milk', 'Dairy', '2 cartons', 3, 1500, 1
                )
                """.trimIndent(),
            )
            execSQL(
                """
                INSERT INTO list_items VALUES (
                    'item', 'list', NULL, 'catalog', 'Oat Milk', '2 cartons', 1,
                    0, 1000, 1500, 1500, NULL
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
        migrated.query("SELECT name, is_reusable FROM reusable_lists WHERE id = 'list'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Groceries", cursor.getString(0))
            assertEquals(1, cursor.getInt(1))
        }
        migrated.query("SELECT display_name, times_used FROM list_catalog_items WHERE id = 'catalog'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Oat Milk", cursor.getString(0))
            assertEquals(3, cursor.getInt(1))
        }
        migrated.query("SELECT name, quantity, is_checked FROM list_items WHERE id = 'item'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Oat Milk", cursor.getString(0))
            assertEquals("2 cartons", cursor.getString(1))
            assertEquals(1, cursor.getInt(2))
        }
        migrated.close()
    }

    @Test
    fun migrationTwoToThreeAddsChecklistHistoryWithoutLosingData() {
        val name = "phase11-history-migration-test.db"
        helper.createDatabase(name, 2).apply {
            execSQL(
                """
                INSERT INTO tasks VALUES (
                    'task', 'Existing task', NULL, NULL, NULL, NULL, 'Inbox', 0,
                    NULL, NULL, 1, 0, 1000, 1000, NULL, NULL
                )
                """.trimIndent(),
            )
            close()
        }

        val migrated = helper.runMigrationsAndValidate(
            name,
            3,
            true,
            NudgeMigrations.Migration2To3,
        )

        migrated.query("SELECT title FROM tasks WHERE id = 'task'").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals("Existing task", cursor.getString(0))
        }
        migrated.query("SELECT COUNT(*) FROM item_history").use { cursor ->
            assertTrue(cursor.moveToFirst())
            assertEquals(0, cursor.getInt(0))
        }
        migrated.close()
    }
}
