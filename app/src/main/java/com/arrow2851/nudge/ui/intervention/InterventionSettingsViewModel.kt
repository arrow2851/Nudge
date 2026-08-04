package com.arrow2851.nudge.ui.intervention

import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.intervention.InstalledApp
import com.arrow2851.nudge.core.intervention.InstalledAppReader
import com.arrow2851.nudge.core.intervention.InterventionBlockReason
import com.arrow2851.nudge.core.intervention.InterventionCoordinator
import com.arrow2851.nudge.core.intervention.InterventionMode
import com.arrow2851.nudge.core.intervention.InterventionRuntimeState
import com.arrow2851.nudge.core.intervention.InterventionServiceController
import com.arrow2851.nudge.core.intervention.InterventionSettings
import com.arrow2851.nudge.core.intervention.InterventionSettingsRepository
import com.arrow2851.nudge.core.intervention.UsageAccessController
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class InterventionSettingsUiState(
    val settings: InterventionSettings = InterventionSettings(),
    val runtime: InterventionRuntimeState = InterventionRuntimeState(),
    val installedApps: List<InstalledApp> = emptyList(),
    val usageAccessGranted: Boolean = false,
    val notificationPermissionGranted: Boolean = false,
    val loadingApps: Boolean = true,
    val diagnostics: String? = null,
    val message: String? = null,
)

@HiltViewModel
class InterventionSettingsViewModel @Inject constructor(
    private val settingsRepository: InterventionSettingsRepository,
    private val installedAppReader: InstalledAppReader,
    private val usageAccessController: UsageAccessController,
    private val serviceController: InterventionServiceController,
    private val coordinator: InterventionCoordinator,
) : ViewModel() {
    private val _uiState = MutableStateFlow(InterventionSettingsUiState())
    val uiState: StateFlow<InterventionSettingsUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            settingsRepository.settings.collect { settings ->
                _uiState.update { it.copy(settings = settings) }
            }
        }
        viewModelScope.launch {
            settingsRepository.runtime.collect { runtime ->
                _uiState.update { it.copy(runtime = runtime) }
            }
        }
        viewModelScope.launch {
            val apps = runCatching { installedAppReader.launcherApps() }.getOrDefault(emptyList())
            _uiState.update { it.copy(installedApps = apps, loadingApps = false) }
        }
        refreshPermissions()
    }

    fun usageSettingsIntent(): Intent = usageAccessController.settingsIntent()

    fun refreshPermissions() {
        _uiState.update {
            it.copy(
                usageAccessGranted = usageAccessController.hasAccess(),
                notificationPermissionGranted = serviceController.notificationsGranted(),
            )
        }
    }

    fun togglePackage(packageName: String) = updateSettings { settings ->
        val packages = settings.selectedPackages.toMutableSet().apply {
            if (!add(packageName)) remove(packageName)
        }
        settings.copy(selectedPackages = packages)
    }

    fun setMode(value: InterventionMode) = updateSettings { it.copy(mode = value) }

    fun setUsageLimit(value: Int) = updateSettings {
        it.copy(usageLimitMinutes = value.coerceIn(5, 240))
    }

    fun setMaximumTaskMinutes(value: Int) = updateSettings {
        it.copy(maximumTaskMinutes = value.coerceIn(1, 120))
    }

    fun setCooldownMinutes(value: Int) = updateSettings {
        it.copy(cooldownMinutes = value.coerceIn(5, 24 * 60))
    }

    fun setDailyLimit(value: Int) = updateSettings {
        it.copy(dailyLimit = value.coerceIn(1, 20))
    }

    fun setCombinedSessions(value: Boolean) = updateSettings {
        it.copy(combinedSessions = value)
    }

    fun setQuietHours(startMinute: Int, endMinute: Int) = updateSettings {
        it.copy(quietStartMinute = startMinute, quietEndMinute = endMinute)
    }

    fun startMonitoring() {
        refreshPermissions()
        val state = _uiState.value
        when {
            !state.usageAccessGranted -> {
                _uiState.update { it.copy(message = "Grant Usage Access before starting monitoring.") }
            }
            !state.notificationPermissionGranted -> {
                _uiState.update { it.copy(message = "Allow notifications before starting monitoring.") }
            }
            state.settings.selectedPackages.isEmpty() -> {
                _uiState.update { it.copy(message = "Choose at least one distracting app.") }
            }
            else -> viewModelScope.launch {
                settingsRepository.saveSettings(
                    state.settings.copy(enabled = true, pausedUntil = null),
                )
                serviceController.start()
                _uiState.update { it.copy(message = "Monitoring started") }
            }
        }
    }

    fun stopMonitoring() {
        viewModelScope.launch {
            settingsRepository.saveSettings(_uiState.value.settings.copy(enabled = false))
            serviceController.stop()
            _uiState.update { it.copy(message = "Monitoring stopped") }
        }
    }

    fun checkCompatibility() {
        viewModelScope.launch {
            val diagnostics = runCatching { coordinator.diagnostics() }
            _uiState.update { state ->
                val text = diagnostics.fold(
                    onSuccess = { result ->
                        when {
                            !result.usageAccessGranted -> "Usage Access is not granted."
                            result.selectedAppCount == 0 -> "No distracting apps are selected."
                            result.activeSession != null -> {
                                "Detected ${result.activeSession.packageName} for " +
                                    "${result.activeSession.durationMinutes} minute(s)."
                            }
                            result.blockReason == InterventionBlockReason.QuietHours ->
                                "Monitoring works; prompts are currently blocked by quiet hours."
                            else -> "Usage Access works. No selected app is currently active."
                        }
                    },
                    onFailure = { it.message ?: "Compatibility check failed" },
                )
                state.copy(diagnostics = text)
            }
        }
    }

    fun clearMessage() {
        _uiState.update { it.copy(message = null) }
    }

    private fun updateSettings(transform: (InterventionSettings) -> InterventionSettings) {
        viewModelScope.launch {
            settingsRepository.saveSettings(transform(_uiState.value.settings))
        }
    }
}
