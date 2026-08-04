package com.arrow2851.nudge.ui

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
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
import androidx.compose.ui.Modifier
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
import com.arrow2851.nudge.ui.components.NudgeDestination
import com.arrow2851.nudge.ui.components.NudgeScreenScaffold
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.intervention.InterventionSettingsScreen
import com.arrow2851.nudge.ui.lists.ListDetailScreen
import com.arrow2851.nudge.ui.lists.ListsEvent
import com.arrow2851.nudge.ui.lists.ListsOverviewScreen
import com.arrow2851.nudge.ui.lists.ListsViewModel
import com.arrow2851.nudge.ui.tasks.TasksScreen
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import com.arrow2851.nudge.ui.today.TodayDueItem
import com.arrow2851.nudge.ui.today.TodayEvent
import com.arrow2851.nudge.ui.today.TodayScreen
import com.arrow2851.nudge.ui.today.TodayViewModel
import kotlinx.coroutines.launch

private const val Phase7AreaRoute = "area/{areaId}"
private const val Phase7SectionRoute = "section/{sectionId}"
private const val Phase7ListRoute = "list/{listId}"
const val InterventionSettingsRoute = "interventions"

@Composable
fun NudgePhase7App(
    initialRoute: String = NudgeDestination.Today.route,
    openQuickAddInitially: Boolean = false,
    todayViewModel: TodayViewModel = hiltViewModel(),
    areasViewModel: AreasViewModel = hiltViewModel(),
    listsViewModel: ListsViewModel = hiltViewModel(),
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val selectedDestination = when {
        currentRoute == InterventionSettingsRoute -> NudgeDestination.Today
        currentRoute?.startsWith("area/") == true || currentRoute?.startsWith("section/") == true ->
            NudgeDestination.Areas
        currentRoute?.startsWith("list/") == true -> NudgeDestination.Lists
        else -> NudgeDestination.entries.firstOrNull { it.route == currentRoute }
            ?: NudgeDestination.Today
    }
    val screenTitle = if (currentRoute == InterventionSettingsRoute) {
        "Interventions"
    } else {
        selectedDestination.label
    }
    val todayState by todayViewModel.uiState.collectAsStateWithLifecycle()
    val areasState by areasViewModel.uiState.collectAsStateWithLifecycle()
    val listsState by listsViewModel.uiState.collectAsStateWithLifecycle()
    val listSuggestions by listsViewModel.suggestions.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    var showQuickAdd by remember { mutableStateOf(openQuickAddInitially) }
    var quickAddValue by remember { mutableStateOf("") }
    var taskCreateRequest by remember { mutableIntStateOf(0) }
    var areaCreateRequest by remember { mutableIntStateOf(0) }
    var choreCreateRequest by remember { mutableIntStateOf(0) }
    var listCreateRequest by remember { mutableIntStateOf(0) }
    var listItemCreateRequest by remember { mutableIntStateOf(0) }

    LaunchedEffect(todayViewModel, snackbarHostState) {
        todayViewModel.events.collect { event ->
            when (event) {
                is TodayEvent.Message -> snackbarHostState.showSnackbar(event.text)
                is TodayEvent.ItemCompleted -> {
                    val result = snackbarHostState.showSnackbar(
                        message = event.text,
                        actionLabel = "Undo",
                        withDismissAction = true,
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        todayViewModel.undoCompletion(event.undo)
                    }
                }
            }
        }
    }

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

    LaunchedEffect(listsViewModel, snackbarHostState) {
        listsViewModel.events.collect { event ->
            when (event) {
                is ListsEvent.Message -> snackbarHostState.showSnackbar(event.text)
                is ListsEvent.ItemChecked -> {
                    val result = snackbarHostState.showSnackbar(
                        message = event.text,
                        actionLabel = "Undo",
                        withDismissAction = true,
                    )
                    if (result == SnackbarResult.ActionPerformed) {
                        listsViewModel.undoCheck(event.mutation)
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
        selectedDestination == NudgeDestination.Lists && currentRoute == NudgeDestination.Lists.route ->
            "Add list"
        selectedDestination == NudgeDestination.Lists -> "Add list item"
        else -> "Quick add"
    }

    NudgeScreenScaffold(
        title = screenTitle,
        selectedDestination = selectedDestination,
        onDestinationSelected = navigateTo,
        snackbarHostState = snackbarHostState,
        actions = {
            if (currentRoute == NudgeDestination.Today.route) {
                IconButton(onClick = { navController.navigate(InterventionSettingsRoute) }) {
                    Icon(Icons.Default.Settings, contentDescription = "Intervention settings")
                }
            }
            if (currentRoute != InterventionSettingsRoute) {
                IconButton(
                    onClick = {
                        when {
                            selectedDestination == NudgeDestination.Tasks -> taskCreateRequest += 1
                            selectedDestination == NudgeDestination.Areas &&
                                currentRoute == NudgeDestination.Areas.route -> areaCreateRequest += 1
                            selectedDestination == NudgeDestination.Areas -> choreCreateRequest += 1
                            selectedDestination == NudgeDestination.Lists &&
                                currentRoute == NudgeDestination.Lists.route -> listCreateRequest += 1
                            selectedDestination == NudgeDestination.Lists -> listItemCreateRequest += 1
                            else -> showQuickAdd = true
                        }
                    },
                ) {
                    Icon(Icons.Default.Add, contentDescription = actionDescription)
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = initialRoute,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(NudgeDestination.Today.route) {
                TodayScreen(
                    state = todayState,
                    viewModel = todayViewModel,
                    onOpenTask = { navigateTo(NudgeDestination.Tasks) },
                    onOpenChore = { item: TodayDueItem ->
                        val sectionId = item.sectionId
                        if (sectionId == null) {
                            item.areaId?.let { navController.navigate("area/$it") }
                        } else {
                            navController.navigate("section/$sectionId")
                        }
                    },
                    onOpenList = { listId -> navController.navigate("list/$listId") },
                )
            }
            composable(NudgeDestination.Areas.route) {
                AreasOverviewScreen(
                    state = areasState,
                    createRequest = areaCreateRequest,
                    viewModel = areasViewModel,
                    onOpenArea = { areaId -> navController.navigate("area/$areaId") },
                )
            }
            composable(Phase7AreaRoute) { entry ->
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
            composable(Phase7SectionRoute) { entry ->
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
            composable(NudgeDestination.Lists.route) {
                ListsOverviewScreen(
                    state = listsState,
                    createRequest = listCreateRequest,
                    viewModel = listsViewModel,
                    onOpenList = { listId -> navController.navigate("list/$listId") },
                )
            }
            composable(Phase7ListRoute) { entry ->
                val listId = entry.arguments?.getString("listId").orEmpty()
                ListDetailScreen(
                    listId = listId,
                    state = listsState,
                    createItemRequest = listItemCreateRequest,
                    suggestions = listSuggestions,
                    viewModel = listsViewModel,
                    onBack = { navController.popBackStack() },
                )
            }
            composable(InterventionSettingsRoute) {
                InterventionSettingsScreen(onBack = { navController.popBackStack() })
            }
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
