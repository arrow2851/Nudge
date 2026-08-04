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
import androidx.work.workDataOf
import com.arrow2851.nudge.core.domain.DerivedDataRefreshEngine
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
    private val refreshEngine: DerivedDataRefreshEngine,
) : CoroutineWorker(appContext, workerParameters) {
    override suspend fun doWork(): Result {
        return try {
            val result = refreshEngine.refresh(timeProvider.nowEpochMillis())
            Result.success(
                workDataOf(
                    OutputScannedChores to result.scannedRecurringChores,
                    OutputRepairedChores to result.repairedRecurringChores,
                    OutputRecommendations to result.recommendationCandidateIds.joinToString(","),
                ),
            )
        } catch (throwable: Throwable) {
            if (runAttemptCount < MaxAttempts) {
                Result.retry()
            } else {
                Result.failure(
                    workDataOf(
                        OutputError to (throwable.message ?: throwable::class.java.simpleName),
                    ),
                )
            }
        }
    }

    companion object {
        const val UniqueName = "nudge-derived-data-refresh"
        const val Tag = "nudge-maintenance"
        const val OutputScannedChores = "scanned-recurring-chores"
        const val OutputRepairedChores = "repaired-recurring-chores"
        const val OutputRecommendations = "recommendation-candidate-ids"
        const val OutputError = "refresh-error"
        const val MaxAttempts = 3
    }
}
