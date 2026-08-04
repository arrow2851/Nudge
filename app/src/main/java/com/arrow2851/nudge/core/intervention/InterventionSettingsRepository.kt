package com.arrow2851.nudge.core.intervention

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import java.io.IOException
import javax.inject.Inject
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map

interface InterventionSettingsRepository {
    val settings: Flow<InterventionSettings>
    val runtime: Flow<InterventionRuntimeState>

    suspend fun saveSettings(value: InterventionSettings)
    suspend fun recordPrompt(recommendationId: String, now: Long, dateKey: String)
    suspend fun recordDismissal(recommendationId: String)
    suspend fun setPausedUntil(value: Long?)
    suspend fun clearRecommendationHistory()
}

class DataStoreInterventionSettingsRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) : InterventionSettingsRepository {
    private val safeData: Flow<Preferences> = dataStore.data.catch { error ->
        if (error is IOException) emit(emptyPreferences()) else throw error
    }

    override val settings: Flow<InterventionSettings> = safeData.map { values ->
        InterventionSettings(
            enabled = values[Keys.Enabled] ?: false,
            selectedPackages = decodeList(values[Keys.SelectedPackages]).toSet(),
            mode = values[Keys.Mode]
                ?.let { runCatching { InterventionMode.valueOf(it) }.getOrNull() }
                ?: InterventionMode.Balanced,
            usageLimitMinutes = values[Keys.UsageLimitMinutes] ?: 15,
            maximumTaskMinutes = values[Keys.MaximumTaskMinutes] ?: 10,
            cooldownMinutes = values[Keys.CooldownMinutes] ?: 45,
            dailyLimit = values[Keys.DailyLimit] ?: 3,
            quietStartMinute = values[Keys.QuietStartMinute] ?: 22 * 60,
            quietEndMinute = values[Keys.QuietEndMinute] ?: 7 * 60,
            combinedSessions = values[Keys.CombinedSessions] ?: false,
            pausedUntil = values[Keys.PausedUntil],
        )
    }

    override val runtime: Flow<InterventionRuntimeState> = safeData.map { values ->
        InterventionRuntimeState(
            lastPromptAt = values[Keys.LastPromptAt],
            dailyDateKey = values[Keys.DailyDateKey],
            dailyPromptCount = values[Keys.DailyPromptCount] ?: 0,
            recentSuggestionIds = decodeList(values[Keys.RecentSuggestionIds]),
            dismissalCounts = decodeCounts(values[Keys.DismissalCounts]),
        )
    }

    override suspend fun saveSettings(value: InterventionSettings) {
        dataStore.edit { preferences ->
            preferences[Keys.Enabled] = value.enabled
            preferences[Keys.SelectedPackages] = encodeList(value.selectedPackages.sorted())
            preferences[Keys.Mode] = value.mode.name
            preferences[Keys.UsageLimitMinutes] = value.usageLimitMinutes.coerceIn(5, 240)
            preferences[Keys.MaximumTaskMinutes] = value.maximumTaskMinutes.coerceIn(1, 120)
            preferences[Keys.CooldownMinutes] = value.cooldownMinutes.coerceIn(5, 24 * 60)
            preferences[Keys.DailyLimit] = value.dailyLimit.coerceIn(1, 20)
            preferences[Keys.QuietStartMinute] = value.quietStartMinute.coerceIn(0, 1439)
            preferences[Keys.QuietEndMinute] = value.quietEndMinute.coerceIn(0, 1439)
            preferences[Keys.CombinedSessions] = value.combinedSessions
            value.pausedUntil?.let { preferences[Keys.PausedUntil] = it }
                ?: preferences.remove(Keys.PausedUntil)
        }
    }

    override suspend fun recordPrompt(recommendationId: String, now: Long, dateKey: String) {
        dataStore.edit { preferences ->
            val sameDate = preferences[Keys.DailyDateKey] == dateKey
            preferences[Keys.DailyDateKey] = dateKey
            preferences[Keys.DailyPromptCount] = if (sameDate) {
                (preferences[Keys.DailyPromptCount] ?: 0) + 1
            } else {
                1
            }
            preferences[Keys.LastPromptAt] = now
            val recent = decodeList(preferences[Keys.RecentSuggestionIds])
                .filterNot { it == recommendationId }
                .toMutableList()
                .apply { add(0, recommendationId) }
                .take(8)
            preferences[Keys.RecentSuggestionIds] = encodeList(recent)
        }
    }

    override suspend fun recordDismissal(recommendationId: String) {
        dataStore.edit { preferences ->
            val counts = decodeCounts(preferences[Keys.DismissalCounts]).toMutableMap()
            counts[recommendationId] = (counts[recommendationId] ?: 0) + 1
            preferences[Keys.DismissalCounts] = encodeCounts(counts)
        }
    }

    override suspend fun setPausedUntil(value: Long?) {
        dataStore.edit { preferences ->
            value?.let { preferences[Keys.PausedUntil] = it }
                ?: preferences.remove(Keys.PausedUntil)
        }
    }

    override suspend fun clearRecommendationHistory() {
        dataStore.edit { preferences ->
            preferences.remove(Keys.RecentSuggestionIds)
            preferences.remove(Keys.DismissalCounts)
            preferences.remove(Keys.LastPromptAt)
            preferences.remove(Keys.DailyDateKey)
            preferences.remove(Keys.DailyPromptCount)
        }
    }

    private fun encodeList(values: Collection<String>): String = values.joinToString("\n")

    private fun decodeList(value: String?): List<String> = value
        .orEmpty()
        .lineSequence()
        .map(String::trim)
        .filter(String::isNotEmpty)
        .toList()

    private fun encodeCounts(values: Map<String, Int>): String = values.entries
        .sortedBy(Map.Entry<String, Int>::key)
        .joinToString("\n") { (key, count) -> "$key=$count" }

    private fun decodeCounts(value: String?): Map<String, Int> = value
        .orEmpty()
        .lineSequence()
        .mapNotNull { line ->
            val separator = line.lastIndexOf('=')
            if (separator <= 0) return@mapNotNull null
            val count = line.substring(separator + 1).toIntOrNull() ?: return@mapNotNull null
            line.substring(0, separator) to count.coerceAtLeast(0)
        }
        .toMap()

    private object Keys {
        val Enabled = booleanPreferencesKey("intervention_enabled")
        val SelectedPackages = stringPreferencesKey("intervention_selected_packages")
        val Mode = stringPreferencesKey("intervention_mode")
        val UsageLimitMinutes = intPreferencesKey("intervention_usage_limit_minutes")
        val MaximumTaskMinutes = intPreferencesKey("intervention_maximum_task_minutes")
        val CooldownMinutes = intPreferencesKey("intervention_cooldown_minutes")
        val DailyLimit = intPreferencesKey("intervention_daily_limit")
        val QuietStartMinute = intPreferencesKey("intervention_quiet_start_minute")
        val QuietEndMinute = intPreferencesKey("intervention_quiet_end_minute")
        val CombinedSessions = booleanPreferencesKey("intervention_combined_sessions")
        val PausedUntil = longPreferencesKey("intervention_paused_until")
        val LastPromptAt = longPreferencesKey("intervention_last_prompt_at")
        val DailyDateKey = stringPreferencesKey("intervention_daily_date_key")
        val DailyPromptCount = intPreferencesKey("intervention_daily_prompt_count")
        val RecentSuggestionIds = stringPreferencesKey("intervention_recent_suggestion_ids")
        val DismissalCounts = stringPreferencesKey("intervention_dismissal_counts")
    }
}
