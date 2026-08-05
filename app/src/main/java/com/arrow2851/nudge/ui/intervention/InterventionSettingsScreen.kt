package com.arrow2851.nudge.ui.intervention

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.core.intervention.InterventionMode

@Composable
fun InterventionSettingsScreen(
    onBack: () -> Unit,
    viewModel: InterventionSettingsViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) {
        viewModel.refreshPermissions()
    }

    LaunchedEffect(Unit) { viewModel.refreshPermissions() }
    DisposableEffect(lifecycleOwner, viewModel) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) viewModel.refreshPermissions()
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    val readyToMonitor = state.usageAccessGranted &&
        state.notificationPermissionGranted &&
        state.settings.selectedPackages.isNotEmpty()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 16.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back") }
        Text(
            text = "Interventions",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = "Choose apps that absorb time. Usage events stay local and Nudge suggests one useful action after your limit.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(16.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = if (readyToMonitor) "Ready to monitor" else "Setup incomplete",
                    style = MaterialTheme.typography.titleLarge,
                    color = if (readyToMonitor) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.error
                    },
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = when {
                        !state.usageAccessGranted -> "Grant Usage Access."
                        !state.notificationPermissionGranted -> "Allow notifications."
                        state.settings.selectedPackages.isEmpty() -> "Choose at least one distracting app."
                        else -> "Usage Access, notifications, and app selection are ready."
                    },
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Spacer(Modifier.height(12.dp))

        PermissionCard(
            title = "Usage Access",
            granted = state.usageAccessGranted,
            explanation = "Required to determine which selected app is active and how long the current session has lasted.",
            actionLabel = if (state.usageAccessGranted) "Refresh" else "Open Android settings",
            onAction = {
                if (state.usageAccessGranted) {
                    viewModel.refreshPermissions()
                } else {
                    context.startActivity(viewModel.usageSettingsIntent())
                }
            },
        )
        Spacer(Modifier.height(12.dp))
        PermissionCard(
            title = "Notifications",
            granted = state.notificationPermissionGranted,
            explanation = "Required for the visible monitoring service and user-tapped intervention prompts.",
            actionLabel = if (state.notificationPermissionGranted) "Granted" else "Allow notifications",
            onAction = {
                if (Build.VERSION.SDK_INT >= 33 && !state.notificationPermissionGranted) {
                    notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            },
        )

        Spacer(Modifier.height(24.dp))
        SectionTitle("Style")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            InterventionMode.entries.forEach { mode ->
                FilterChip(
                    selected = state.settings.mode == mode,
                    onClick = { viewModel.setMode(mode) },
                    label = { Text(mode.name) },
                )
            }
        }
        Spacer(Modifier.height(12.dp))
        StepperRow(
            label = "App-use limit",
            value = state.settings.usageLimitMinutes,
            suffix = "min",
            onDecrease = { viewModel.setUsageLimit(state.settings.usageLimitMinutes - 5) },
            onIncrease = { viewModel.setUsageLimit(state.settings.usageLimitMinutes + 5) },
        )
        StepperRow(
            label = "Suggested task size",
            value = state.settings.maximumTaskMinutes,
            suffix = "min",
            onDecrease = {
                viewModel.setMaximumTaskMinutes(state.settings.maximumTaskMinutes - 1)
            },
            onIncrease = {
                viewModel.setMaximumTaskMinutes(state.settings.maximumTaskMinutes + 1)
            },
        )
        StepperRow(
            label = "Cooldown",
            value = state.settings.cooldownMinutes,
            suffix = "min",
            onDecrease = { viewModel.setCooldownMinutes(state.settings.cooldownMinutes - 5) },
            onIncrease = { viewModel.setCooldownMinutes(state.settings.cooldownMinutes + 5) },
        )
        StepperRow(
            label = "Daily maximum",
            value = state.settings.dailyLimit,
            suffix = "prompts",
            onDecrease = { viewModel.setDailyLimit(state.settings.dailyLimit - 1) },
            onIncrease = { viewModel.setDailyLimit(state.settings.dailyLimit + 1) },
        )
        ToggleRow(
            title = "Combine selected apps",
            supporting = "Switching directly between selected apps can remain one continuous session.",
            checked = state.settings.combinedSessions,
            onCheckedChange = viewModel::setCombinedSessions,
        )

        Spacer(Modifier.height(20.dp))
        SectionTitle("Quiet hours")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = state.settings.quietStartMinute == state.settings.quietEndMinute,
                onClick = { viewModel.setQuietHours(0, 0) },
                label = { Text("Off") },
            )
            FilterChip(
                selected = state.settings.quietStartMinute == 22 * 60 &&
                    state.settings.quietEndMinute == 7 * 60,
                onClick = { viewModel.setQuietHours(22 * 60, 7 * 60) },
                label = { Text("10 PM–7 AM") },
            )
            FilterChip(
                selected = state.settings.quietStartMinute == 23 * 60 &&
                    state.settings.quietEndMinute == 6 * 60,
                onClick = { viewModel.setQuietHours(23 * 60, 6 * 60) },
                label = { Text("11 PM–6 AM") },
            )
        }

        Spacer(Modifier.height(24.dp))
        SectionTitle("Distracting apps")
        Text(
            text = "${state.settings.selectedPackages.size} selected",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(8.dp))
        if (state.loadingApps) {
            Text("Loading installed apps…")
        } else {
            state.installedApps
                .sortedWith(
                    compareByDescending<com.arrow2851.nudge.core.intervention.InstalledApp> {
                        it.packageName in state.settings.selectedPackages
                    }.thenBy { it.label.lowercase() },
                )
                .forEach { app ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Checkbox(
                            checked = app.packageName in state.settings.selectedPackages,
                            onCheckedChange = { viewModel.togglePackage(app.packageName) },
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(app.label, style = MaterialTheme.typography.bodyLarge)
                            Text(
                                app.packageName,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                    HorizontalDivider()
                }
        }

        Spacer(Modifier.height(24.dp))
        SectionTitle("Compatibility check")
        OutlinedButton(
            onClick = viewModel::checkCompatibility,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Run usage check")
        }
        state.diagnostics?.let {
            Spacer(Modifier.height(8.dp))
            Text(it, style = MaterialTheme.typography.bodyMedium)
        }
        state.message?.let {
            Spacer(Modifier.height(8.dp))
            Text(it, color = MaterialTheme.colorScheme.primary)
        }

        Spacer(Modifier.height(24.dp))
        if (state.settings.enabled) {
            OutlinedButton(
                onClick = viewModel::stopMonitoring,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Stop monitoring")
            }
        } else {
            Button(
                onClick = viewModel::startMonitoring,
                enabled = readyToMonitor,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Start monitoring")
            }
        }
        Spacer(Modifier.height(32.dp))
    }
}

@Composable
private fun PermissionCard(
    title: String,
    granted: Boolean,
    explanation: String,
    actionLabel: String,
    onAction: () -> Unit,
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    if (granted) "Ready" else "Required",
                    color = if (granted) MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.error,
                )
            }
            Spacer(Modifier.height(6.dp))
            Text(
                explanation,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(10.dp))
            TextButton(onClick = onAction, enabled = !granted || actionLabel == "Refresh") {
                Text(actionLabel)
            }
        }
    }
}

@Composable
private fun StepperRow(
    label: String,
    value: Int,
    suffix: String,
    onDecrease: () -> Unit,
    onIncrease: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(label, style = MaterialTheme.typography.bodyLarge)
            Text(
                "$value $suffix",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        OutlinedButton(onClick = onDecrease) { Text("−") }
        Spacer(Modifier.padding(horizontal = 3.dp))
        OutlinedButton(onClick = onIncrease) { Text("+") }
    }
}

@Composable
private fun ToggleRow(
    title: String,
    supporting: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
            Text(
                supporting,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.titleLarge,
        fontWeight = FontWeight.Bold,
    )
    Spacer(Modifier.height(8.dp))
}
