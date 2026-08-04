package com.arrow2851.nudge.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.arrow2851.nudge.R
import com.arrow2851.nudge.receiver.InterventionActionReceiver

class PauseInterventionsWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        appWidgetIds.forEach { widgetId ->
            val pauseIntent = PendingIntent.getBroadcast(
                context,
                widgetId,
                Intent(context, InterventionActionReceiver::class.java)
                    .setAction(InterventionActionReceiver.ActionPauseOneHour),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )
            val views = RemoteViews(context.packageName, R.layout.widget_pause_interventions).apply {
                setOnClickPendingIntent(R.id.widget_pause_button, pauseIntent)
            }
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}
