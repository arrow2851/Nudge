package com.arrow2851.nudge.core.intervention

import android.Manifest
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.arrow2851.nudge.service.InterventionMonitorService
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

interface InstalledAppReader {
    suspend fun launcherApps(): List<InstalledApp>
}

class AndroidInstalledAppReader @Inject constructor(
    @ApplicationContext private val context: Context,
) : InstalledAppReader {
    override suspend fun launcherApps(): List<InstalledApp> = withContext(Dispatchers.Default) {
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val resolveInfos = if (Build.VERSION.SDK_INT >= 33) {
            context.packageManager.queryIntentActivities(
                intent,
                PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_ALL.toLong()),
            )
        } else {
            @Suppress("DEPRECATION")
            context.packageManager.queryIntentActivities(intent, PackageManager.MATCH_ALL)
        }
        resolveInfos
            .asSequence()
            .map { info ->
                InstalledApp(
                    packageName = info.activityInfo.packageName,
                    label = info.loadLabel(context.packageManager).toString(),
                )
            }
            .filterNot { it.packageName == context.packageName }
            .distinctBy(InstalledApp::packageName)
            .sortedBy { it.label.lowercase() }
            .toList()
    }
}

interface UsageAccessController {
    fun hasAccess(): Boolean
    fun settingsIntent(): Intent
}

class AndroidUsageAccessController @Inject constructor(
    @ApplicationContext private val context: Context,
) : UsageAccessController {
    override fun hasAccess(): Boolean {
        val appOps = context.getSystemService(AppOpsManager::class.java)
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName,
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    override fun settingsIntent(): Intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
        data = Uri.parse("package:${context.packageName}")
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
}

interface UsageEventReader {
    fun read(beginTime: Long, endTime: Long): List<UsageEventSnapshot>
}

class AndroidUsageEventReader @Inject constructor(
    @ApplicationContext private val context: Context,
) : UsageEventReader {
    override fun read(beginTime: Long, endTime: Long): List<UsageEventSnapshot> {
        val usageStatsManager = context.getSystemService(UsageStatsManager::class.java)
        val events = usageStatsManager.queryEvents(beginTime, endTime) ?: return emptyList()
        val event = UsageEvents.Event()
        return buildList {
            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                val mappedType = when (event.eventType) {
                    UsageEvents.Event.MOVE_TO_FOREGROUND -> UsageEventType.Foreground
                    UsageEvents.Event.MOVE_TO_BACKGROUND -> UsageEventType.Background
                    UsageEvents.Event.SCREEN_NON_INTERACTIVE -> UsageEventType.ScreenOff
                    else -> when {
                        Build.VERSION.SDK_INT >= 29 &&
                            event.eventType == UsageEvents.Event.ACTIVITY_RESUMED ->
                            UsageEventType.Foreground
                        Build.VERSION.SDK_INT >= 29 &&
                            event.eventType == UsageEvents.Event.ACTIVITY_PAUSED ->
                            UsageEventType.Background
                        else -> null
                    }
                }
                if (mappedType != null) {
                    add(
                        UsageEventSnapshot(
                            packageName = event.packageName,
                            type = mappedType,
                            timestamp = event.timeStamp,
                        ),
                    )
                }
            }
        }
    }
}

class InterventionServiceController @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    fun start() {
        val intent = Intent(context, InterventionMonitorService::class.java)
            .setAction(InterventionMonitorService.ActionStart)
        ContextCompat.startForegroundService(context, intent)
    }

    fun stop() {
        context.startService(
            Intent(context, InterventionMonitorService::class.java)
                .setAction(InterventionMonitorService.ActionStop),
        )
    }

    fun checkNow(ignoreCooldown: Boolean = false) {
        val intent = Intent(context, InterventionMonitorService::class.java)
            .setAction(InterventionMonitorService.ActionCheckNow)
            .putExtra(InterventionMonitorService.ExtraIgnoreCooldown, ignoreCooldown)
        ContextCompat.startForegroundService(context, intent)
    }

    fun notificationsGranted(): Boolean = Build.VERSION.SDK_INT < 33 ||
        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) ==
        PackageManager.PERMISSION_GRANTED
}
