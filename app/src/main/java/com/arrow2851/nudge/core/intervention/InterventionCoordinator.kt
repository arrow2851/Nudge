package com.arrow2851.nudge.core.intervention

import com.arrow2851.nudge.core.domain.RecommendationContext
import com.arrow2851.nudge.core.domain.RecommendationReader
import com.arrow2851.nudge.core.model.TimeProvider
import java.time.ZoneId
import javax.inject.Inject
import kotlinx.coroutines.flow.first

private const val UsageLookbackMillis = 24L * 60L * 60L * 1_000L

data class InterventionDiagnostics(
    val usageAccessGranted: Boolean,
    val activeSession: UsageSession?,
    val selectedAppCount: Int,
    val blockReason: InterventionBlockReason?,
)

class InterventionCoordinator @Inject constructor(
    private val settingsRepository: InterventionSettingsRepository,
    private val usageAccessController: UsageAccessController,
    private val usageEventReader: UsageEventReader,
    private val usageSessionCalculator: UsageSessionCalculator,
    private val decisionEngine: InterventionDecisionEngine,
    private val recommendationReader: RecommendationReader,
    private val timeProvider: TimeProvider,
) {
    suspend fun evaluate(ignoreCooldown: Boolean = false): InterventionEvaluation {
        val settings = settingsRepository.settings.first()
        val runtime = settingsRepository.runtime.first()
        val now = timeProvider.nowEpochMillis()
        val zoneId = ZoneId.systemDefault()
        val usageAccessGranted = usageAccessController.hasAccess()
        val session = if (usageAccessGranted && settings.selectedPackages.isNotEmpty()) {
            currentSession(settings, now)
        } else {
            null
        }
        val blockReason = decisionEngine.blockReason(
            InterventionDecisionInput(
                settings = settings,
                runtime = runtime,
                session = session,
                now = now,
                zoneId = zoneId,
                usageAccessGranted = usageAccessGranted,
                ignoreCooldown = ignoreCooldown,
            ),
        )
        if (blockReason != null) return InterventionEvaluation.Blocked(blockReason)

        val activeSession = requireNotNull(session)
        val recommendation = recommendationReader.select(
            RecommendationContext(
                now = now,
                maximumMinutes = settings.maximumTaskMinutes,
                recentSuggestionIds = runtime.recentSuggestionIds.toSet(),
                dismissalCounts = runtime.dismissalCounts,
            ),
        ) ?: return InterventionEvaluation.Blocked(InterventionBlockReason.NoRecommendation)

        val prompt = InterventionPrompt(
            sourcePackage = activeSession.packageName,
            usageMinutes = activeSession.durationMinutes,
            recommendationId = recommendation.candidate.id,
            recommendationTitle = recommendation.candidate.title,
            recommendationKind = recommendation.candidate.kind.name,
            estimatedMinutes = recommendation.candidate.estimatedMinutes
                ?: settings.maximumTaskMinutes,
            score = recommendation.score.total,
            createdAt = now,
        )
        settingsRepository.recordPrompt(
            recommendationId = prompt.recommendationId,
            now = now,
            dateKey = decisionEngine.localDateKey(now, zoneId),
        )
        return InterventionEvaluation.Prompt(prompt)
    }

    suspend fun diagnostics(): InterventionDiagnostics {
        val settings = settingsRepository.settings.first()
        val runtime = settingsRepository.runtime.first()
        val now = timeProvider.nowEpochMillis()
        val access = usageAccessController.hasAccess()
        val session = if (access && settings.selectedPackages.isNotEmpty()) {
            currentSession(settings, now)
        } else {
            null
        }
        val reason = decisionEngine.blockReason(
            InterventionDecisionInput(
                settings = settings,
                runtime = runtime,
                session = session,
                now = now,
                zoneId = ZoneId.systemDefault(),
                usageAccessGranted = access,
            ),
        )
        return InterventionDiagnostics(
            usageAccessGranted = access,
            activeSession = session,
            selectedAppCount = settings.selectedPackages.size,
            blockReason = reason,
        )
    }

    private fun currentSession(
        settings: InterventionSettings,
        now: Long,
    ): UsageSession? = usageSessionCalculator.calculate(
        events = usageEventReader.read(now - UsageLookbackMillis, now),
        selectedPackages = settings.selectedPackages,
        now = now,
        combinedSessions = settings.combinedSessions,
    )
}
