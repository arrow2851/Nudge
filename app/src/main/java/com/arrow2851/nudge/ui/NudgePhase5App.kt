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
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.arrow2851.nudge.ui.areas.AreaDetailScreen
import com.arrow2851.nudge.ui.areas.AreasEvent
import com.arrow2851.nudge.ui.areas.AreasOverviewScreen
import com.arrow2851.nudge.ui.areas.AreasViewModel
import com.arrow2851.nudge.ui.areas.SectionDetailScreen
import com.arrow2851.nudge.ui.components.NudgeBottomSheet
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeChip
import com.arrow2851.nudge.ui.components.NudgeDestination
import com.arrow2851.nudge.ui.components.NudgeListRow
import com.arrow2851.nudge.ui.components.NudgeScreenScaffold
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.tasks.TasksScreen
import com.arrow2851.nudge.ui.theme.nudgeSemanticColors
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import kotlinx.coroutines.launch

private const val AreaRoute = "area/{areaId}"
private const val SectionRoute = "section/{sectionId}"

@Composable
fun NudgePhase5App(
    areasViewModel: AreasViewModel = hiltViewModel(),
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val selectedDestination = when {
        currentRoute?.startsWith("area/") == true || currentRoute?.startsWith("section/") == true ->
            NudgeDestination.Areas
        else -> NudgeDestination.entries.firstOrNull { it.route == currentRoute }
            ?: NudgeDestination.Today
    }
    val areasState by areasViewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    var showQuickAdd by remember { mutableStateOf(false) }
    var quickAddValue by remember { mutableStateOf("") }
    var taskCreateRequest by remember { mutableIntStateOf(0) }
    var areaCreateRequest by remember { mutableIntStateOf(0) }
    var choreCreateRequest by remember { mutableIntStateOf(0) }

    LaunchedEffect(areasViewModel, snackbarHostState) {
        areasViewModel.events.collect { event ->
            when (event) {
                is AreasEvent.Message -> snackbarHostState.showSnackbar(event.text)
                is AreasEvent.ChoreCompleted -> {
                    val result = snackbarHostState.showSnackbar(
                        message = event.text,
                        actionLabel = "Undo",
                        withDismissAction = true,
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        areasViewModel.undoCompletion(event.mutation)
                    }
                }
            }
        }
    }

    val navigateTo: (NudgeDestination) -> Unit = { destination ->
        navController.navigate(destination.route) {
            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    val actionDescription = when {
        selectedDestination == NudgeDestination.Tasks -> "Add task"
        selectedDestination == NudgeDestination.Areas && currentRoute == NudgeDestination.Areas.route ->
            "Add area"
        selectedDestination == NudgeDestination.Areas -> "Add chore"
        else -> "Quick add"
    }

    NudgeScreenScaffold(
        title = selectedDestination.label,
        selectedDestination = selectedDestination,
        onDestinationSelected = navigateTo,
        snackbarHostState = snackbarHostState,
        actions = {
            IconButton(
                onClick = {
                    when {
                        selectedDestination == NudgeDestination.Tasks -> taskCreateRequest += 1
                        selectedDestination == NudgeDestination.Areas &&
                            currentRoute == NudgeDestination.Areas.route -> areaCreateRequest += 1
                        selectedDestination == NudgeDestination.Areas -> choreCreateRequest += 1
                        else -> showQuickAdd = true
                    }
                },
            ) {
                Icon(Icons.Default.Add, contentDescription = actionDescription)
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NudgeDestination.Today.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(NudgeDestination.Today.route) { TodayPhase5FoundationScreen() }
            composable(NudgeDestination.Areas.route) {
                AreasOverviewScreen(
                    state = areasState,
                    createRequest = areaCreateRequest,
                    viewModel = areasViewModel,
                    onOpenArea = { areaId -> navController.navigate("area/$areaId") },
                )
            }
            composable(AreaRoute) { entry ->
                val areaId = entry.arguments?.getString("areaId").orEmpty()
                AreaDetailScreen(
                    areaId = areaId,
                    state = areasState,
                    createChoreRequest = choreCreateRequest,
                    viewModel = areasViewModel,
                    onBack = { navController.popBackStack() },
                    onOpenSection = { sectionId -> navController.navigate("section/$sectionId") },
                )
            }
            composable(SectionRoute) { entry ->
                val sectionId = entry.arguments?.getString("sectionId").orEmpty()
                SectionDetailScreen(
                    sectionId = sectionId,
                    state = areasState,
                    createChoreRequest = choreCreateRequest,
                    viewModel = areasViewModel,
                    onBack = { navController.popBackStack() },
                )
            }
            composable(NudgeDestination.Tasks.route) {
                TasksScreen(
                    createRequest = taskCreateRequest,
                    snackbarHostState = snackbarHostState,
                )
            }
            composable(NudgeDestination.Lists.route) { ListsPhase5FoundationScreen() }
        }
    }

    NudgeBottomSheet(visible = showQuickAdd, onDismiss = { showQuickAdd = false }) {
        Text("Quick add", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            "Capture the thought now. Destination-specific details come next.",
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
                scope.launch { snackbarHostState.showSnackbar("Saved: $savedName") }
            },
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

@Composable
private fun TodayPhase5FoundationScreen() {
    Phase5FoundationPage(
        eyebrow = "TODAY",
        title = "Small steps, right now.",
        message = "Today aggregation arrives after recurring care and reusable Lists are native.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Needs attention", style = MaterialTheme.typography.titleLarge)
                    Text(
                        "Recurring-care data is now available to the future Today aggregator.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                NudgeChip(label = "Local")
            }
            Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x3))
            NudgeListRow(
                title = "Recurring chores",
                supportingText = "Open Areas for the live repository-backed view",
                leading = {
                    Icon(
                        Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                showDivider = true,
            )
            NudgeListRow(
                title = "One-time tasks",
                supportingText = "Open Tasks for the complete checklist",
                leading = {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.nudgeSemanticColors.success,
                    )
                },
            )
        }
    }
}

@Composable
private fun ListsPhase5FoundationScreen() {
    Phase5FoundationPage(
        eyebrow = "REUSABLE LISTS",
        title = "Reusable lists remember what matters.",
        message = "List history and suggestions are the next native vertical slice.",
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = "Groceries",
                supportingText = "Reusable list foundation",
                leading = {
                    Icon(
                        Icons.Default.Refresh,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                trailing = { Text("›", style = MaterialTheme.typography.headlineMedium) },
            )
        }
    }
}

@Composable
private fun Phase5FoundationPage(
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
        NudgeSectionLabel(eyebrow)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(title, style = MaterialTheme.typography.displaySmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
        Text(
            message,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x6))
        content()
        Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x8))
        Text(
            "Native Android development",
            modifier = Modifier.fillMaxWidth(),
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
    }
}
