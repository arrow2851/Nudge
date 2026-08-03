package com.arrow2851.nudge.core.database

import androidx.room.testing.MigrationTestHelper
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
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
    fun versionOneSchemaCreatesEveryCoreTable() {
        val database = helper.createDatabase(NudgeDatabase.Version)
        val tableNames = mutableSetOf<String>()

        database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").use { statement ->
            while (statement.step()) {
                tableNames += statement.getText(0)
            }
        }
        database.close()

        val expected = setOf(
            "areas",
            "sections",
            "tasks",
            "chores",
            "chore_schedules",
            "completions",
            "reusable_lists",
            "list_catalog_items",
            "list_items",
        )
        assertTrue(tableNames.containsAll(expected))
    }
}
