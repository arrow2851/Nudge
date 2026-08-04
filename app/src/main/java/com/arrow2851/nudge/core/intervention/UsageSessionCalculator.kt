package com.arrow2851.nudge.core.intervention

import javax.inject.Inject

private const val DefaultTransitionGraceMillis = 30_000L

class UsageSessionCalculator @Inject constructor() {
    fun calculate(
        events: List<UsageEventSnapshot>,
        selectedPackages: Set<String>,
        now: Long,
        combinedSessions: Boolean,
        transitionGraceMillis: Long = DefaultTransitionGraceMillis,
    ): UsageSession? {
        if (selectedPackages.isEmpty()) return null

        var foregroundPackage: String? = null
        var selectedSessionStart: Long? = null
        var lastSelectedBackgroundAt: Long? = null
        val packagesSeen = linkedSetOf<String>()

        events.sortedBy(UsageEventSnapshot::timestamp).forEach { event ->
            when (event.type) {
                UsageEventType.ScreenOff -> {
                    foregroundPackage = null
                    selectedSessionStart = null
                    lastSelectedBackgroundAt = null
                    packagesSeen.clear()
                }

                UsageEventType.Foreground -> {
                    val packageName = event.packageName ?: return@forEach
                    val selected = packageName in selectedPackages
                    val previousWasSelected = foregroundPackage in selectedPackages
                    val canBridgeTransition = combinedSessions &&
                        selected &&
                        selectedSessionStart != null &&
                        lastSelectedBackgroundAt != null &&
                        event.timestamp - lastSelectedBackgroundAt!! <= transitionGraceMillis

                    if (!selected) {
                        selectedSessionStart = null
                        packagesSeen.clear()
                    } else if (!previousWasSelected && !canBridgeTransition) {
                        selectedSessionStart = event.timestamp
                        packagesSeen.clear()
                    } else if (!combinedSessions && foregroundPackage != packageName) {
                        selectedSessionStart = event.timestamp
                        packagesSeen.clear()
                    }

                    foregroundPackage = packageName
                    lastSelectedBackgroundAt = null
                    if (selected) packagesSeen += packageName
                }

                UsageEventType.Background -> {
                    val packageName = event.packageName
                    if (foregroundPackage == packageName) {
                        if (packageName in selectedPackages) {
                            lastSelectedBackgroundAt = event.timestamp
                        }
                        foregroundPackage = null
                    }
                }
            }
        }

        val activePackage = foregroundPackage?.takeIf { it in selectedPackages } ?: return null
        val startedAt = selectedSessionStart ?: return null
        return UsageSession(
            packageName = activePackage,
            startedAt = startedAt,
            observedAt = now,
            packagesSeen = packagesSeen.ifEmpty { setOf(activePackage) },
        )
    }
}
