package com.arrow2851.nudge.ui.history

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.arrow2851.nudge.core.model.HistoryEventType
import com.arrow2851.nudge.core.model.HistoryItemType
import com.arrow2851.nudge.ui.components.NudgeConfirmDialog
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun HistoryScreen(
    onBack: () -> Unit,
    viewModel: HistoryViewModel = hiltViewModel(),
) {
    val history by viewModel.history.collectAsStateWithLifecycle()
    var confirmClearAll by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TextButton(onClick = onBack) { Text("Back") }
            Text(
                text = "History",
                modifier = Modifier.weight(1f),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            if (history.isNotEmpty()) {
                TextButton(onClick = { confirmClearAll = true }) {
                    Text("Clear all")
                }
            }
        }

        if (history.isEmpty()) {
            NudgeEmptyState(
                title = "No history yet",
                message = "Completed and deleted Tasks and List items will appear here.",
            )
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    horizontal = 16.dp,
                    vertical = 8.dp,
                ),
            ) {
                items(history, key = { it.id }) { entry ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(entry.title, style = MaterialTheme.typography.titleMedium)
                            val type = when (entry.itemType) {
                                HistoryItemType.Task -> "Task"
                                HistoryItemType.ListItem -> "List item"
                            }
                            val event = when (entry.eventType) {
                                HistoryEventType.Completed -> "completed"
                                HistoryEventType.Deleted -> "deleted"
                            }
                            Text(
                                text = buildList {
                                    add("$type $event")
                                    entry.containerName?.let { add(it) }
                                    add(formatHistoryTime(entry.occurredAt))
                                }.joinToString(" · "),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                            entry.detail?.let {
                                Spacer(Modifier.height(2.dp))
                                Text(
                                    text = it,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                        IconButton(onClick = { viewModel.delete(entry.id) }) {
                            Icon(
                                Icons.Default.DeleteOutline,
                                contentDescription = "Remove ${entry.title} from history",
                            )
                        }
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                }
            }
        }
    }

    NudgeConfirmDialog(
        visible = confirmClearAll,
        title = "Clear all history?",
        message = "This removes completed and deleted item history. It does not delete current Tasks or List items.",
        confirmLabel = "Clear all",
        dismissLabel = "Cancel",
        onConfirm = {
            viewModel.clearAll()
            confirmClearAll = false
        },
        onDismiss = { confirmClearAll = false },
    )
}

private fun formatHistoryTime(epochMillis: Long): String =
    Instant.ofEpochMilli(epochMillis)
        .atZone(ZoneId.systemDefault())
        .format(DateTimeFormatter.ofPattern("MMM d, yyyy · h:mm a"))
