package com.arrow2851.nudge.core.work

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit
import javax.inject.Inject

interface MaintenanceScheduler {
    fun ensureScheduled()
}

class WorkManagerMaintenanceScheduler @Inject constructor(
    private val workManager: WorkManager,
) : MaintenanceScheduler {
    override fun ensureScheduled() {
        val request = PeriodicWorkRequestBuilder<RefreshDerivedDataWorker>(12, TimeUnit.HOURS)
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                    .build(),
            )
            .addTag(RefreshDerivedDataWorker.Tag)
            .build()

        workManager.enqueueUniquePeriodicWork(
            RefreshDerivedDataWorker.UniqueName,
            ExistingPeriodicWorkPolicy.KEEP,
            request,
        )
    }
}

@HiltWorker
class RefreshDerivedDataWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParameters: WorkerParameters,
    private val timeProvider: TimeProvider,
) : CoroutineWorker(appContext, workerParameters) {
    override suspend fun doWork(): Result {
        // Phase 3 establishes the stable boundary only. Recurrence and reminder
        // calculations attach here after their domain rules are implemented.
        timeProvider.nowEpochMillis()
        return Result.success()
    }

    companion object {
        const val UniqueName = "nudge-derived-data-refresh"
        const val Tag = "nudge-maintenance"
    }
}
