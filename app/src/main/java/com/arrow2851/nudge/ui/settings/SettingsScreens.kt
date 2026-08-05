package com.arrow2851.nudge.ui.settings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backup
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Widgets
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.core.model.ItemHandedness

@Composable
fun SettingsHomeScreen(
    onBack: () -> Unit,
    onOpenInterventions: () -> Unit,
    onOpenHistory: () -> Unit,
    onOpenDisplay: () -> Unit,
    onOpenBackup: () -> Unit,
    onOpenWidgets: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, vertical = 12.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back") }
        Text(
            text = "Settings",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = "Interventions, history, checklist behavior, backup, and home-screen access.",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(20.dp))
        SettingsLinkRow(
            icon = Icons.Default.NotificationsActive,
            title = "Interventions",
            supporting = "Distracting apps, permissions, limits, quiet hours, and monitoring.",
            onClick = onOpenInterventions,
        )
        SettingsLinkRow(
            icon = Icons.Default.History,
            title = "History",
            supporting = "Completed and deleted Tasks and List items.",
            onClick = onOpenHistory,
        )
        SettingsLinkRow(
            icon = Icons.Default.Tune,
            title = "Display and item behavior",
            supporting = "Handedness, completed-item visibility, due dates, and Today options.",
            onClick = onOpenDisplay,
        )
        SettingsLinkRow(
            icon = Icons.Default.Backup,
            title = "Backup and restore",
            supporting = "Create or restore a portable local backup.",
            onClick = onOpenBackup,
        )
        SettingsLinkRow(
            icon = Icons.Default.Widgets,
            title = "Widgets",
            supporting = "Tasks and reusable Lists for quick access from the home screen.",
            onClick = onOpenWidgets,
        )
    }
}

@Composable
fun DisplayBehaviorScreen(
    onBack: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel(),
) {
    val preferences by viewModel.preferences.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, vertical = 12.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back") }
        Text(
            text = "Display and item behavior",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(18.dp))
        Text("Item controls", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        Text(
            text = "Choose which side holds the details and metadata actions versus the checkbox and drag handle.",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(10.dp))
        Row(modifier = Modifier.fillMaxWidth()) {
            ItemHandedness.entries.forEach { option ->
                FilterChip(
                    selected = preferences.itemHandedness == option,
                    onClick = { viewModel.setHandedness(option) },
                    label = {
                        Text(if (option == ItemHandedness.Standard) "Standard" else "Right-handed")
                    },
                    modifier = Modifier.padding(end = 8.dp),
                )
            }
        }
        Spacer(Modifier.height(18.dp))
        ToggleSetting(
            title = "Hide completed items",
            supporting = "Applies to Tasks and checked List items. Each screen also shows a visibility icon.",
            checked = preferences.hideCompletedItems,
            onCheckedChange = viewModel::setHideCompleted,
        )
        ToggleSetting(
            title = "Show due-date shorthand",
            supporting = "Show Today, 1d, or a short date beneath Task names.",
            checked = preferences.showDueShorthand,
            onCheckedChange = viewModel::setShowDueShorthand,
        )
        ToggleSetting(
            title = "Daily progress",
            supporting = "Show the optional progress summary on Today.",
            checked = preferences.dailyProgressEnabled,
            onCheckedChange = viewModel::setDailyProgress,
        )
        ToggleSetting(
            title = "Quick Win",
            supporting = "Show the recommendation engine's suggested small action on Today.",
            checked = preferences.quickWinEnabled,
            onCheckedChange = viewModel::setQuickWin,
        )
    }
}

@Composable
fun WidgetSettingsScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, vertical = 12.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back") }
        Text(
            text = "Widgets",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(12.dp))
        Text(
            text = "Add the Nudge Tasks or Nudge List widget from your launcher’s widget picker. Each widget opens the matching checklist and supports quick completion actions.",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun SettingsLinkRow(
    icon: ImageVector,
    title: String,
    supporting: String,
    onClick: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 14.dp),
        ) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Text(
                supporting,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null)
    }
    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
}

@Composable
private fun ToggleSetting(
    title: String,
    supporting: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Text(
                supporting,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
}
