package com.arrow2851.nudge.core.intervention

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.arrow2851.nudge.InterventionActivity
import com.arrow2851.nudge.receiver.InterventionActionReceiver
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject

class InterventionNotificationCenter @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val manager: NotificationManager
        get() = context.getSystemService(NotificationManager::class.java)

    fun ensureChannels() {
        manager.createNotificationChannels(
            listOf(
                NotificationChannel(
                    MonitoringChannelId,
                    "Nudge monitoring",
                    NotificationManager.IMPORTANCE_LOW,
                ).apply {
                    description = "Visible status while opt-in app-usage monitoring is active."
                    setShowBadge(false)
                },
                NotificationChannel(
                    InterventionChannelId,
                    "Useful action suggestions",
                    NotificationManager.IMPORTANCE_HIGH,
                ).apply {
                    description = "Suggestions shown after a selected app reaches its usage limit."
                },
            ),
        )
    }

    fun monitoringNotification(): Notification {
        ensureChannels()
        val openIntent = PendingIntent.getActivity(
            context,
            100,
            Intent(context, InterventionActivity::class.java)
                .putExtra(InterventionActivity.ExtraStandaloneStatus, true),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val pauseIntent = PendingIntent.getBroadcast(
            context,
            101,
            Intent(context, InterventionActionReceiver::class.java)
                .setAction(InterventionActionReceiver.ActionPauseOneHour),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        return NotificationCompat.Builder(context, MonitoringChannelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("Nudge monitoring is active")
            .setContentText("Selected-app usage stays on this device.")
            .setContentIntent(openIntent)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .addAction(0, "Pause 1 hour", pauseIntent)
            .build()
    }

    fun showPrompt(prompt: InterventionPrompt) {
        ensureChannels()
        val contentIntent = promptActivityIntent(prompt, requestCode = prompt.recommendationId.hashCode())
        val differentIntent = PendingIntent.getBroadcast(
            context,
            prompt.recommendationId.hashCode() + 1,
            Intent(context, InterventionActionReceiver::class.java)
                .setAction(InterventionActionReceiver.ActionDifferentTask)
                .putExtra(InterventionActionReceiver.ExtraRecommendationId, prompt.recommendationId),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val notNowIntent = PendingIntent.getBroadcast(
            context,
            prompt.recommendationId.hashCode() + 2,
            Intent(context, InterventionActionReceiver::class.java)
                .setAction(InterventionActionReceiver.ActionNotNow)
                .putExtra(InterventionActionReceiver.ExtraRecommendationId, prompt.recommendationId),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val notification = NotificationCompat.Builder(context, InterventionChannelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("Ready for a small reset?")
            .setContentText("${prompt.recommendationTitle} · about ${prompt.estimatedMinutes} min")
            .setStyle(
                NotificationCompat.BigTextStyle().bigText(
                    "You have used ${friendlyAppName(prompt.sourcePackage)} for about " +
                        "${prompt.usageMinutes} minutes. Try ${prompt.recommendationTitle}.",
                ),
            )
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(0, "Start", contentIntent)
            .addAction(0, "Different", differentIntent)
            .addAction(0, "Not now", notNowIntent)
            .build()
        manager.notify(PromptNotificationId, notification)
    }

    fun cancelPrompt() {
        manager.cancel(PromptNotificationId)
    }

    private fun promptActivityIntent(prompt: InterventionPrompt, requestCode: Int): PendingIntent {
        val intent = Intent(context, InterventionActivity::class.java).apply {
            putExtra(InterventionActivity.ExtraSourcePackage, prompt.sourcePackage)
            putExtra(InterventionActivity.ExtraUsageMinutes, prompt.usageMinutes)
            putExtra(InterventionActivity.ExtraRecommendationId, prompt.recommendationId)
            putExtra(InterventionActivity.ExtraRecommendationTitle, prompt.recommendationTitle)
            putExtra(InterventionActivity.ExtraRecommendationKind, prompt.recommendationKind)
            putExtra(InterventionActivity.ExtraEstimatedMinutes, prompt.estimatedMinutes)
            putExtra(InterventionActivity.ExtraScore, prompt.score)
        }
        return PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    private fun friendlyAppName(packageName: String): String = runCatching {
        val applicationInfo = context.packageManager.getApplicationInfo(packageName, 0)
        context.packageManager.getApplicationLabel(applicationInfo).toString()
    }.getOrDefault(packageName.substringAfterLast('.').replaceFirstChar(Char::uppercase))

    companion object {
        const val MonitoringNotificationId = 4101
        const val PromptNotificationId = 4102
        private const val MonitoringChannelId = "nudge_monitoring"
        private const val InterventionChannelId = "nudge_interventions"
    }
}
