package com.arrow2851.nudge.core.data

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ThemeMode
import java.io.IOException
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map

class DataStorePreferencesRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) : PreferencesRepository {
    override val preferences: Flow<AppPreferences> = dataStore.data
        .catch { error ->
            if (error is IOException) {
                emit(emptyPreferences())
            } else {
                throw error
            }
        }
        .map { values ->
            AppPreferences(
                themeMode = values[Keys.ThemeMode]
                    ?.let { runCatching { ThemeMode.valueOf(it) }.getOrNull() }
                    ?: ThemeMode.System,
                showDueShorthand = values[Keys.ShowDueShorthand] ?: true,
                hideCompletedItems = values[Keys.HideCompletedItems] ?: false,
                dailyProgressEnabled = values[Keys.DailyProgressEnabled] ?: false,
                quickWinEnabled = values[Keys.QuickWinEnabled] ?: false,
                demoDataEnabled = values[Keys.DemoDataEnabled] ?: false,
                itemHandedness = values[Keys.ItemHandedness]
                    ?.let { runCatching { ItemHandedness.valueOf(it) }.getOrNull() }
                    ?: ItemHandedness.Standard,
            )
        }

    override suspend fun setThemeMode(value: ThemeMode) {
        dataStore.edit { it[Keys.ThemeMode] = value.name }
    }

    override suspend fun setShowDueShorthand(value: Boolean) {
        dataStore.edit { it[Keys.ShowDueShorthand] = value }
    }

    override suspend fun setHideCompletedItems(value: Boolean) {
        dataStore.edit { it[Keys.HideCompletedItems] = value }
    }

    override suspend fun setDailyProgressEnabled(value: Boolean) {
        dataStore.edit { it[Keys.DailyProgressEnabled] = value }
    }

    override suspend fun setQuickWinEnabled(value: Boolean) {
        dataStore.edit { it[Keys.QuickWinEnabled] = value }
    }

    override suspend fun setDemoDataEnabled(value: Boolean) {
        dataStore.edit { it[Keys.DemoDataEnabled] = value }
    }

    override suspend fun setItemHandedness(value: ItemHandedness) {
        dataStore.edit { it[Keys.ItemHandedness] = value.name }
    }

    private object Keys {
        val ThemeMode = stringPreferencesKey("theme_mode")
        val ShowDueShorthand = booleanPreferencesKey("show_due_shorthand")
        val HideCompletedItems = booleanPreferencesKey("hide_completed_items")
        val DailyProgressEnabled = booleanPreferencesKey("daily_progress_enabled")
        val QuickWinEnabled = booleanPreferencesKey("quick_win_enabled")
        val DemoDataEnabled = booleanPreferencesKey("demo_data_enabled")
        val ItemHandedness = stringPreferencesKey("item_handedness")
    }
}
