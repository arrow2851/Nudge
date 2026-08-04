package com.arrow2851.nudge.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.arrow2851.nudge.core.intervention.InterventionNotificationCenter
import com.arrow2851.nudge.core.intervention.InterventionServiceController
import com.arrow2851.nudge.core.intervention.InterventionSettingsRepository
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@AndroidEntryPoint
class InterventionActionReceiver : BroadcastReceiver() {
    @Inject
    lateinit var settingsRepository: InterventionSettingsRepository

    @Inject
    lateinit var serviceController: InterventionServiceController

    @Inject
    lateinit var notifications: InterventionNotificationCenter

    @Inject
    lateinit var timeProvider: TimeProvider

    override fun onReceive(context: Context, intent: Intent) {
        val pendingResult = goAsync()
        CoroutineScope(SupervisorJob() + Dispatchers.IO).launch {
            try {
                when (intent.action) {
                    ActionPauseOneHour -> {
                        settingsRepository.setPausedUntil(
                            timeProvider.nowEpochMillis() + OneHourMillis,
                        )
                        notifications.cancelPrompt()
                    }

                    ActionNotNow -> {
                        intent.getStringExtra(ExtraRecommendationId)?.let {
                            settingsRepository.recordDismissal(it)
                        }
                        notifications.cancelPrompt()
                    }

                    ActionDifferentTask -> {
                        intent.getStringExtra(ExtraRecommendationId)?.let {
                            settingsRepository.recordDismissal(it)
                        }
                        notifications.cancelPrompt()
                        serviceController.checkNow(ignoreCooldown = true)
                    }
                }
            } finally {
                pendingResult.finish()
            }
        }
    }

    companion object {
        const val ActionPauseOneHour = "com.arrow2851.nudge.action.PAUSE_ONE_HOUR"
        const val ActionNotNow = "com.arrow2851.nudge.action.NOT_NOW"
        const val ActionDifferentTask = "com.arrow2851.nudge.action.DIFFERENT_TASK"
        const val ExtraRecommendationId = "recommendation_id"
        private const val OneHourMillis = 60L * 60L * 1_000L
    }
}
