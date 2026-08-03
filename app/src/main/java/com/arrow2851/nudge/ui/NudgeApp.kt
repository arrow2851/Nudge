package com.arrow2851.nudge.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeChip
import com.arrow2851.nudge.ui.components.NudgeDestination
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeListRow
import com.arrow2851.nudge.ui.components.NudgeScreenScaffold
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.nudgeSemanticColors
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import kotlinx.coroutines.launch

@Composable
fun NudgeApp() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val selectedDestination = NudgeDestination.entries.firstOrNull {
        it.route == currentRoute
    } ?: NudgeDestination.Today
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    var showQuickAdd by remember { mutableStateOf(false) }
    var quickAddValue by remember { mutableStateOf("") }

    val navigateTo: (NudgeDestination) -> Unit = { destination ->
        navController.navigate(destination.route) {
            popUpTo(navController.graph.findStartDestination().id) {
                saveState = true
            }
            launchSingleTop = true
            restoreState = true
        }
    }

    NudgeScreenScaffold(
        title = selectedDestination.label,
        selectedDestination = selectedDestination,
        onDestinationSelected = navigateTo,
        snackbarHostState = snackbarHostState,
        actions = {
            IconButton(onClick = { showQuickAdd = true }) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Quick add",
                )
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NudgeDestination.Today.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(NudgeDestination.Today.route) {
                TodayFoundationScreen()
            }
            composable(NudgeDestination.Areas.route) {
                AreasFoundationScreen()
            }
            composable(NudgeDestination.Tasks.route) {
                TasksFoundationScreen()
            }
            composable(NudgeDestination.Lists.route) {
                ListsFoundationScreen()
            }
        }
    }

    NudgeBottomSheet(
        visible = showQuickAdd,
        onDismiss = { showQuickAdd = false },
    ) {
        Text(
            text = "Quick add",
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = "Capture the thought now. Destination-specific details come next.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeTextField(
            value = quickAddValue,
            onValueChange = { quickAddValue = it },
            label = "Name",
            placeholder = "What needs attention?",
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x4))
        NudgeButton(
            text = "Save",
            onClick = {
                val savedName = quickAddValue.trim().ifEmpty { "New item" }
                showQuickAdd = false
                quickAddValue = ""
                scope.launch {
                    snackbarHostState.showSnackbar("Saved: $savedName")
                }
            },
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

@Composable
private fun TodayFoundationScreen() {
    FoundationPage(
        eyebrow = "TODAY",
        title = "Small steps, right now.",
        message = "A calm overview for what needs attention without turning the day into a dashboard.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Needs attention",
                        style = MaterialTheme.typography.titleLarge,
                    )
                    Text(
                        text = "2 small actions",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                NudgeChip(label = "Light")
            }
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
            NudgeListRow(
                title = "Wipe stovetop",
                supportingText = "Kitchen · overdue",
                leading = {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                showDivider = true,
            )
            NudgeListRow(
                title = "Water houseplants",
                supportingText = "Living Room · today",
                leading = {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.nudgeSemanticColors.success,
                    )
                },
            )
        }
    }
}

@Composable
private fun AreasFoundationScreen() {
    FoundationPage(
        eyebrow = "RECURRING CARE",
        title = "Keep recurring care visible.",
        message = "Areas and optional Sections will inherit this shell when the recurring-chore vertical slice begins.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = "House",
                supportingText = "4 areas · 3 need attention",
                leading = {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                trailing = { Text("›", style = MaterialTheme.typography.headlineMedium) },
            )
        }
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
        NudgeEmptyState(
            title = "Car is ready for setup",
            message = "Add recurring maintenance only when it is useful.",
            actionLabel = "Add first chore",
            onAction = {},
            icon = {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                )
            },
        )
    }
}

@Composable
private fun TasksFoundationScreen() {
    FoundationPage(
        eyebrow = "ONE-TIME CHECKLIST",
        title = "One-time tasks stay lightweight.",
        message = "The production shell keeps Tasks separate from recurring Areas while sharing the same accessible components.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = "Submit reimbursement",
                supportingText = "Due today",
                leading = {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                showDivider = true,
            )
            NudgeListRow(
                title = "Schedule tire rotation",
                supportingText = "No due date",
                leading = {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                },
            )
        }
    }
}

@Composable
private fun ListsFoundationScreen() {
    FoundationPage(
        eyebrow = "REUSABLE LISTS",
        title = "Reusable lists remember what matters.",
        message = "List history and suggestions arrive in their vertical slice; the shared rows, fields, sheets, and feedback patterns are ready now.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = "Groceries",
                supportingText = "6 active items",
                leading = {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                trailing = { Text("›", style = MaterialTheme.typography.headlineMedium) },
                showDivider = true,
            )
            NudgeListRow(
                title = "Travel packing",
                supportingText = "Reusable · 0 active items",
                leading = {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                },
                trailing = { Text("›", style = MaterialTheme.typography.headlineMedium) },
            )
        }
    }
}

@Composable
private fun FoundationPage(
    eyebrow: String,
    title: String,
    message: String,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(PaddingValues(horizontal = 20.dp, vertical = 24.dp)),
    ) {
        NudgeSectionLabel(text = eyebrow)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = title,
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x6))
        content()
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x8))
        Text(
            text = "Phase 2 design system",
            modifier = Modifier.fillMaxWidth(),
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
    }
}
