package com.arrow2851.nudge.ui.today

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeListRow
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.theme.nudgeSemanticColors
import com.arrow2851.nudge.ui.theme.nudgeSpacing

@Composable
fun TodayScreen(
    state: TodayUiState,
    viewModel: TodayViewModel,
    onOpenTask: (String) -> Unit,
    onOpenChore: (TodayDueItem) -> Unit,
    onOpenList: (String) -> Unit,
) {
    LaunchedEffect(viewModel) { viewModel.refresh() }

    when (state) {
        TodayUiState.Loading -> Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center,
        ) {
            CircularProgressIndicator()
        }

        is TodayUiState.Error -> NudgeEmptyState(
            title = "Today is unavailable",
            message = state.message,
            actionLabel = "Try again",
            onAction = viewModel::refresh,
        )

        is TodayUiState.Ready -> TodayReadyScreen(
            state = state,
            viewModel = viewModel,
            onOpenTask = onOpenTask,
            onOpenChore = onOpenChore,
            onOpenList = onOpenList,
        )
    }
}

@Composable
private fun TodayReadyScreen(
    state: TodayUiState.Ready,
    viewModel: TodayViewModel,
    onOpenTask: (String) -> Unit,
    onOpenChore: (TodayDueItem) -> Unit,
    onOpenList: (String) -> Unit,
) {
    var overdueExpanded by rememberSaveable { mutableStateOf(false) }
    var gradingItemId by rememberSaveable { mutableStateOf<String?>(null) }
    val gradingItem = gradingItemId?.let(state::dueItem)

    fun open(item: TodayDueItem) {
        when (item.kind) {
            TodayItemKind.Task -> onOpenTask(item.id)
            TodayItemKind.Chore -> onOpenChore(item)
        }
    }

    fun requestComplete(item: TodayDueItem) {
        if (item.supportsGrading) {
            gradingItemId = item.id
        } else {
            viewModel.completeItem(item.id)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(PaddingValues(horizontal = 20.dp, vertical = 24.dp))
            .testTag("today-screen"),
    ) {
        NudgeSectionLabel(state.dateLabel)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = "Small steps, right now.",
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = if (state.dueToday.isEmpty() && state.overdue.isEmpty()) {
                "Everything urgent is clear. Reusable Lists are still close by."
            } else {
                "${state.dueToday.size + state.overdue.size} small actions need attention."
            },
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        state.progress?.let { progress ->
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x5))
            NudgeCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("today-progress"),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column {
                        Text(
                            text = "${progress.completedToday} completed today",
                            style = MaterialTheme.typography.titleMedium,
                        )
                        Text(
                            text = "A small task is enough.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Text(
                        text = "${progress.completedToday} / ${progress.total}",
                        style = MaterialTheme.typography.titleMedium,
                    )
                }
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
                LinearProgressIndicator(
                    progress = { progress.fraction },
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }

        state.quickWin?.let { quickWin ->
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x5))
            SectionHeading("Quick Win", quickWin.estimatedMinutes?.let { "$it min" } ?: "Small step")
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            NudgeCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("today-quick-win-${quickWin.title}"),
                onClick = { open(quickWin) },
            ) {
                NudgeSectionLabel("RECOMMENDED NOW")
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                Text(quickWin.title, style = MaterialTheme.typography.headlineMedium)
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x1))
                Text(
                    text = "${quickWin.supportingText} · ${quickWin.dueLabel}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    NudgeButton(
                        text = "Open",
                        onClick = { open(quickWin) },
                        modifier = Modifier.weight(1f),
                        style = NudgeButtonStyle.Outlined,
                    )
                    NudgeButton(
                        text = "Done",
                        onClick = { requestComplete(quickWin) },
                        modifier = Modifier
                            .weight(1f)
                            .testTag("today-quick-win-complete"),
                    )
                }
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x6))
        SectionHeading("Due today", state.dueToday.size.toString())
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            if (state.dueToday.isEmpty()) {
                NudgeEmptyState(
                    title = "Everything is done",
                    message = "Your Today list is clear.",
                    icon = {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                        )
                    },
                )
            } else {
                state.dueToday.forEachIndexed { index, item ->
                    TodayDueRow(
                        item = item,
                        onOpen = { open(item) },
                        onComplete = { requestComplete(item) },
                        showDivider = index < state.dueToday.lastIndex,
                    )
                }
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x6))
        SectionHeading("Overdue", state.overdue.size.toString())
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = if (state.overdue.isEmpty()) "Nothing overdue" else "Review overdue items",
                supportingText = if (state.overdue.isEmpty()) {
                    "You are caught up."
                } else {
                    "${state.overdue.size} waiting for attention"
                },
                trailing = {
                    Text(
                        text = if (overdueExpanded) "⌃" else "⌄",
                        style = MaterialTheme.typography.headlineMedium,
                    )
                },
                onClick = { overdueExpanded = !overdueExpanded },
                modifier = Modifier.testTag("today-overdue-toggle"),
                showDivider = overdueExpanded && state.overdue.isNotEmpty(),
            )
            if (overdueExpanded) {
                state.overdue.forEachIndexed { index, item ->
                    TodayDueRow(
                        item = item,
                        onOpen = { open(item) },
                        onComplete = { requestComplete(item) },
                        showDivider = index < state.overdue.lastIndex,
                    )
                }
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x6))
        SectionHeading("Lists", "Quick access")
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        if (state.lists.isEmpty()) {
            NudgeCard(modifier = Modifier.fillMaxWidth()) {
                NudgeEmptyState(
                    title = "No Lists yet",
                    message = "Create a reusable or one-off List from the Lists destination.",
                )
            }
        } else {
            state.lists.take(4).forEach { list ->
                NudgeCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("today-list-${list.name}"),
                    onClick = { onOpenList(list.id) },
                ) {
                    NudgeListRow(
                        title = list.name,
                        supportingText = "${list.activeCount} active · ${list.preview}",
                        leading = {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = null,
                                tint = if (list.isReusable) {
                                    MaterialTheme.colorScheme.primary
                                } else {
                                    MaterialTheme.colorScheme.onSurfaceVariant
                                },
                            )
                        },
                        trailing = { Text("›", style = MaterialTheme.typography.headlineMedium) },
                    )
                }
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        SectionHeading("Recent Activity", state.recentActivity.size.toString())
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            if (state.recentActivity.isEmpty()) {
                Text(
                    text = "Completed tasks, chores, and List items will appear here.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                state.recentActivity.take(4).forEachIndexed { index, activity ->
                    NudgeListRow(
                        title = activity.title,
                        supportingText = activity.detail,
                        leading = {
                            Icon(
                                imageVector = when (activity.kind) {
                                    TodayActivityKind.Task -> Icons.Default.CheckCircle
                                    TodayActivityKind.Chore -> Icons.Default.LocationOn
                                    TodayActivityKind.ListItem -> Icons.Default.Refresh
                                },
                                contentDescription = null,
                                tint = MaterialTheme.nudgeSemanticColors.success,
                            )
                        },
                        trailing = {
                            Text(
                                text = activity.timeLabel,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        },
                        modifier = Modifier.testTag("today-activity-${activity.title}"),
                        showDivider = index < minOf(3, state.recentActivity.lastIndex),
                    )
                }
            }
        }

        state.recoverableError?.let { message ->
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
            NudgeCard(modifier = Modifier.fillMaxWidth()) {
                Text(message, color = MaterialTheme.colorScheme.error)
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                NudgeButton(
                    text = "Dismiss",
                    onClick = viewModel::dismissRecoverableError,
                    style = NudgeButtonStyle.Text,
                )
            }
        }

        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x8))
    }

    NudgeBottomSheet(
        visible = gradingItem != null,
        onDismiss = { gradingItemId = null },
    ) {
        gradingItem ?: return@NudgeBottomSheet
        Text("How much did you do?", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = gradingItem.title,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        CompletionGrade.entries
            .filter { it != CompletionGrade.None }
            .forEach { grade ->
                NudgeButton(
                    text = grade.name,
                    onClick = {
                        viewModel.completeItem(gradingItem.id, grade)
                        gradingItemId = null
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("today-complete-${grade.name.lowercase()}"),
                    style = if (grade == gradingItem.defaultGrade) {
                        NudgeButtonStyle.Primary
                    } else {
                        NudgeButtonStyle.Outlined
                    },
                )
                Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
            }
    }
}

@Composable
private fun TodayDueRow(
    item: TodayDueItem,
    onOpen: () -> Unit,
    onComplete: () -> Unit,
    showDivider: Boolean,
) {
    NudgeListRow(
        title = item.title,
        supportingText = "${item.supportingText} · ${item.dueLabel}",
        leading = {
            Icon(
                imageVector = if (item.kind == TodayItemKind.Chore) {
                    Icons.Default.LocationOn
                } else {
                    Icons.Default.CheckCircle
                },
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
            )
        },
        trailing = {
            Checkbox(
                checked = false,
                onCheckedChange = { onComplete() },
                modifier = Modifier.testTag("today-complete-${item.title}"),
            )
        },
        onClick = onOpen,
        modifier = Modifier.testTag("today-due-${item.title}"),
        showDivider = showDivider,
    )
}

@Composable
private fun SectionHeading(
    title: String,
    meta: String,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title, style = MaterialTheme.typography.titleLarge)
        Text(
            text = meta,
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
