package com.arrow2851.nudge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.ui.intervention.InterventionPromptUiState
import com.arrow2851.nudge.ui.intervention.InterventionPromptViewModel
import com.arrow2851.nudge.ui.theme.NudgeTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.delay

@AndroidEntryPoint
class InterventionActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NudgeTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    if (intent.getBooleanExtra(ExtraStandaloneStatus, false)) {
                        MonitoringStatusScreen(onClose = ::finish)
                    } else {
                        val viewModel: InterventionPromptViewModel = hiltViewModel()
                        val state by viewModel.uiState.collectAsStateWithLifecycle()
                        LaunchedEffect(state.completed) {
                            if (state.completed) {
                                delay(600)
                                finish()
                            }
                        }
                        InterventionPromptScreen(
                            state = state,
                            onComplete = viewModel::complete,
                            onDifferent = viewModel::different,
                            onNotNow = {
                                viewModel.dismiss()
                                finish()
                            },
                        )
                    }
                }
            }
        }
    }

    companion object {
        const val ExtraStandaloneStatus = "standalone_status"
        const val ExtraSourcePackage = "source_package"
        const val ExtraUsageMinutes = "usage_minutes"
        const val ExtraRecommendationId = "recommendation_id"
        const val ExtraRecommendationTitle = "recommendation_title"
        const val ExtraRecommendationKind = "recommendation_kind"
        const val ExtraEstimatedMinutes = "estimated_minutes"
        const val ExtraScore = "score"
    }
}

@Composable
private fun MonitoringStatusScreen(onClose: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "Nudge monitoring is active",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.height(12.dp))
        Text(
            text = "Usage data stays on your device. Open Nudge settings to change apps, limits, quiet hours, or pause monitoring.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.height(24.dp))
        Button(onClick = onClose) { Text("Close") }
    }
}

@Composable
private fun InterventionPromptScreen(
    state: InterventionPromptUiState,
    onComplete: () -> Unit,
    onDifferent: () -> Unit,
    onNotNow: () -> Unit,
) {
    var running by remember { mutableStateOf(false) }
    var remainingSeconds by remember { mutableIntStateOf(state.estimatedMinutes.coerceAtLeast(1) * 60) }

    LaunchedEffect(state.recommendationId) {
        running = false
        remainingSeconds = state.estimatedMinutes.coerceAtLeast(1) * 60
    }
    LaunchedEffect(running, remainingSeconds) {
        if (running && remainingSeconds > 0) {
            delay(1_000)
            remainingSeconds -= 1
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "A small reset",
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.primary,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = state.recommendationTitle,
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = "You have been in ${friendlyPackage(state.sourcePackage)} for about ${state.usageMinutes} minutes.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(24.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = "%02d:%02d".format(remainingSeconds / 60, remainingSeconds % 60),
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Bold,
                )
                Spacer(Modifier.height(12.dp))
                OutlinedButton(onClick = { running = !running }) {
                    Text(if (running) "Pause focus" else "Start focus")
                }
            }
        }
        state.message?.let {
            Spacer(Modifier.height(12.dp))
            Text(it, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = onComplete,
            enabled = !state.busy,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(if (state.busy) "Saving…" else "Mark complete")
        }
        Spacer(Modifier.height(10.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            TextButton(onClick = onDifferent, enabled = !state.busy) {
                Text("Different task")
            }
            TextButton(onClick = onNotNow, enabled = !state.busy) {
                Text("Not now")
            }
        }
    }
}

private fun friendlyPackage(packageName: String): String = packageName
    .substringAfterLast('.')
    .ifBlank { "the selected app" }
    .replaceFirstChar(Char::uppercase)
