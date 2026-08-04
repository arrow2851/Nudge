package com.arrow2851.nudge.core.intervention

import java.time.Instant
import java.time.ZoneId
import javax.inject.Inject

enum class InterventionMode {
    Gentle,
    Balanced,
    Strict,
}

data class InterventionSettings(
    val enabled: Boolean = false,
    val selectedPackages: Set<String> = emptySet(),
    val mode: InterventionMode = InterventionMode.Balanced,
    val usageLimitMinutes: Int = 15,
    val maximumTaskMinutes: Int = 10,
    val cooldownMinutes: Int = 45,
    val dailyLimit: Int = 3,
    val quietStartMinute: Int = 22 * 60,
    val quietEndMinute: Int = 7 * 60,
    val combinedSessions: Boolean = false,
    val pausedUntil: Long? = null,
) {
    val effectiveUsageLimitMinutes: Int
        get() = when (mode) {
            InterventionMode.Gentle -> usageLimitMinutes.coerceAtLeast(20)
            InterventionMode.Balanced -> usageLimitMinutes.coerceAtLeast(5)
            InterventionMode.Strict -> usageLimitMinutes.coerceIn(5, 10)
        }
}

data class InterventionRuntimeState(
    val lastPromptAt: Long? = null,
    val dailyDateKey: String? = null,
    val dailyPromptCount: Int = 0,
    val recentSuggestionIds: List<String> = emptyList(),
    val dismissalCounts: Map<String, Int> = emptyMap(),
)

data class InstalledApp(
    val packageName: String,
    val label: String,
)

enum class UsageEventType {
    Foreground,
    Background,
    ScreenOff,
}

data class UsageEventSnapshot(
    val packageName: String?,
    val type: UsageEventType,
    val timestamp: Long,
)

data class UsageSession(
    val packageName: String,
    val startedAt: Long,
    val observedAt: Long,
    val packagesSeen: Set<String>,
) {
    val durationMillis: Long
        get() = (observedAt - startedAt).coerceAtLeast(0L)

    val durationMinutes: Int
        get() = (durationMillis / 60_000L).toInt()
}

enum class InterventionBlockReason {
    Disabled,
    Paused,
    NoSelectedApps,
    NoActiveSession,
    BelowUsageLimit,
    QuietHours,
    Cooldown,
    DailyLimit,
    UsageAccessMissing,
    NoRecommendation,
}

data class InterventionPrompt(
    val sourcePackage: String,
    val usageMinutes: Int,
    val recommendationId: String,
    val recommendationTitle: String,
    val recommendationKind: String,
    val estimatedMinutes: Int,
    val score: Int,
    val createdAt: Long,
)

sealed interface InterventionEvaluation {
    data class Prompt(val value: InterventionPrompt) : InterventionEvaluation
    data class Blocked(val reason: InterventionBlockReason) : InterventionEvaluation
}

data class InterventionDecisionInput(
    val settings: InterventionSettings,
    val runtime: InterventionRuntimeState,
    val session: UsageSession?,
    val now: Long,
    val zoneId: ZoneId,
    val usageAccessGranted: Boolean,
    val ignoreCooldown: Boolean = false,
)

class InterventionDecisionEngine @Inject constructor() {
    fun blockReason(input: InterventionDecisionInput): InterventionBlockReason? {
        val settings = input.settings
        if (!settings.enabled) return InterventionBlockReason.Disabled
        if (!input.usageAccessGranted) return InterventionBlockReason.UsageAccessMissing
        if (settings.selectedPackages.isEmpty()) return InterventionBlockReason.NoSelectedApps
        if (settings.pausedUntil != null && settings.pausedUntil > input.now) {
            return InterventionBlockReason.Paused
        }
        val session = input.session ?: return InterventionBlockReason.NoActiveSession
        if (session.durationMinutes < settings.effectiveUsageLimitMinutes) {
            return InterventionBlockReason.BelowUsageLimit
        }
        if (isQuietTime(input.now, input.zoneId, settings)) {
            return InterventionBlockReason.QuietHours
        }
        val dateKey = localDateKey(input.now, input.zoneId)
        val promptsToday = if (input.runtime.dailyDateKey == dateKey) {
            input.runtime.dailyPromptCount
        } else {
            0
        }
        if (promptsToday >= settings.dailyLimit.coerceAtLeast(1)) {
            return InterventionBlockReason.DailyLimit
        }
        if (!input.ignoreCooldown) {
            val lastPromptAt = input.runtime.lastPromptAt
            val cooldownMillis = settings.cooldownMinutes.coerceAtLeast(1) * 60_000L
            if (lastPromptAt != null && input.now - lastPromptAt < cooldownMillis) {
                return InterventionBlockReason.Cooldown
            }
        }
        return null
    }

    fun localDateKey(now: Long, zoneId: ZoneId): String =
        Instant.ofEpochMilli(now).atZone(zoneId).toLocalDate().toString()

    private fun isQuietTime(
        now: Long,
        zoneId: ZoneId,
        settings: InterventionSettings,
    ): Boolean {
        val minute = Instant.ofEpochMilli(now).atZone(zoneId).let {
            it.hour * 60 + it.minute
        }
        val start = settings.quietStartMinute.coerceIn(0, 1439)
        val end = settings.quietEndMinute.coerceIn(0, 1439)
        if (start == end) return false
        return if (start < end) {
            minute in start until end
        } else {
            minute >= start || minute < end
        }
    }
}
