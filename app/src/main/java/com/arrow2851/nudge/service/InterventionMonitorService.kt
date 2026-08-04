package com.arrow2851.nudge.service

import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import com.arrow2851.nudge.core.intervention.InterventionBlockReason
import com.arrow2851.nudge.core.intervention.InterventionCoordinator
import com.arrow2851.nudge.core.intervention.InterventionEvaluation
import com.arrow2851.nudge.core.intervention.InterventionNotificationCenter
import com.arrow2851.nudge.core.intervention.InterventionSettingsRepository
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

@AndroidEntryPoint
class InterventionMonitorService : Service() {
    @Inject
    lateinit var coordinator: InterventionCoordinator

    @Inject
    lateinit var notifications: InterventionNotificationCenter

    @Inject
    lateinit var settingsRepository: InterventionSettingsRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private var monitoringJob: Job? = null

    override fun onCreate() {
        super.onCreate()
        notifications.ensureChannels()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action ?: ActionStart) {
            ActionStop -> {
                serviceScope.launch {
                    val settings = settingsRepository.settings.first()
                    settingsRepository.saveSettings(settings.copy(enabled = false))
                    stopMonitoring()
                }
                return START_NOT_STICKY
            }

            ActionCheckNow -> {
                ensureForeground()
                val ignoreCooldown = intent?.getBooleanExtra(ExtraIgnoreCooldown, false) ?: false
                serviceScope.launch { runCheck(ignoreCooldown) }
            }

            else -> {
                ensureForeground()
                startMonitoringLoop()
            }
        }
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        monitoringJob?.cancel()
        serviceScope.cancel()
        super.onDestroy()
    }

    private fun ensureForeground() {
        val notification = notifications.monitoringNotification()
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(
                InterventionNotificationCenter.MonitoringNotificationId,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
            )
        } else {
            startForeground(InterventionNotificationCenter.MonitoringNotificationId, notification)
        }
    }

    private fun startMonitoringLoop() {
        if (monitoringJob?.isActive == true) return
        monitoringJob = serviceScope.launch {
            while (isActive) {
                runCheck(ignoreCooldown = false)
                delay(PollIntervalMillis)
            }
        }
    }

    private suspend fun runCheck(ignoreCooldown: Boolean) {
        when (val evaluation = coordinator.evaluate(ignoreCooldown)) {
            is InterventionEvaluation.Prompt -> notifications.showPrompt(evaluation.value)
            is InterventionEvaluation.Blocked -> {
                if (evaluation.reason == InterventionBlockReason.Disabled) stopMonitoring()
            }
        }
    }

    private fun stopMonitoring() {
        monitoringJob?.cancel()
        monitoringJob = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    companion object {
        const val ActionStart = "com.arrow2851.nudge.action.START_INTERVENTION_MONITOR"
        const val ActionStop = "com.arrow2851.nudge.action.STOP_INTERVENTION_MONITOR"
        const val ActionCheckNow = "com.arrow2851.nudge.action.CHECK_INTERVENTION_NOW"
        const val ExtraIgnoreCooldown = "ignore_cooldown"
        private const val PollIntervalMillis = 15_000L
    }
}
