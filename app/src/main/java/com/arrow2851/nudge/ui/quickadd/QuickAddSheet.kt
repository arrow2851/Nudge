package com.arrow2851.nudge.ui.quickadd

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import java.util.Locale

@Composable
fun QuickAddSheet(
    visible: Boolean,
    onDismiss: () -> Unit,
    onSaved: (String) -> Unit,
    onError: (String) -> Unit,
    viewModel: QuickAddViewModel = hiltViewModel(),
) {
    var value by remember { mutableStateOf("") }
    val voiceLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val spoken = result.data
                ?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                ?.firstOrNull()
                ?.trim()
            if (!spoken.isNullOrEmpty()) value = spoken
        }
    }

    LaunchedEffect(viewModel) {
        viewModel.events.collect { event ->
            when (event) {
                is QuickAddEvent.Saved -> {
                    value = ""
                    onDismiss()
                    onSaved(event.title)
                }
                is QuickAddEvent.Error -> onError(event.message)
            }
        }
    }

    NudgeBottomSheet(visible = visible, onDismiss = onDismiss) {
        Text("Quick add", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            "Add a lightweight one-time Task now. You can add due dates, subtasks, and other details from Tasks later.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = value,
            onValueChange = { value = it },
            label = "Task name",
            placeholder = "What needs attention?",
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        Row(modifier = Modifier.fillMaxWidth()) {
            NudgeButton(
                text = "Speak",
                onClick = {
                    val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                        putExtra(
                            RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM,
                        )
                        putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault().toLanguageTag())
                        putExtra(RecognizerIntent.EXTRA_PROMPT, "What should Nudge add?")
                    }
                    voiceLauncher.launch(intent)
                },
                style = NudgeButtonStyle.Outlined,
                modifier = Modifier.weight(1f),
            )
            Spacer(Modifier.width(MaterialTheme.nudgeSpacing.x2))
            NudgeButton(
                text = "Save task",
                onClick = { viewModel.saveTask(value) },
                modifier = Modifier.weight(1f),
            )
        }
    }
}
