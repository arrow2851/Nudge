package com.arrow2851.nudge.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navigation
import com.arrow2851.nudge.core.mutation.AppFeedbackEvent
import com.arrow2851.nudge.ui.areas.AreaDetailScreen
import com.arrow2851.nudge.ui.areas.AreasEvent
import com.arrow2851.nudge.ui.areas.AreasOverviewScreen
import com.arrow2851.nudge.ui.areas.AreasViewModel
import com.arrow2851.nudge.ui.areas.SectionDetailScreen
import com.arrow2851.nudge.ui.backup.BackupScreen
import com.arrow2851.nudge.ui.components.NudgeDestination
import com.arrow2851.nudge.ui.components.NudgeScreenScaffold
import com.arrow2851.nudge.ui.history.HistoryScreen
import com.arrow2851.nudge.ui.intervention.InterventionSettingsScreen
import com.arrow2851.nudge.ui.lists.ListDetailScreen
import com.arrow2851.nudge.ui.lists.ListsOverviewScreen
import com.arrow2851.nudge.ui.lists.ListsViewModel
import com.arrow2851.nudge.ui.quickadd.QuickAddSheet
import com.arrow2851.nudge.ui.settings.DisplayBehaviorScreen
import com.arrow2851.nudge.ui.settings.SettingsHomeScreen
import com.arrow2851.nudge.ui.settings.WidgetSettingsScreen
import com.arrow2851.nudge.ui.tasks.TasksScreen
import com.arrow2851.nudge.ui.today.TodayCompletionUndo
import com.arrow2851.nudge.ui.today.TodayDueItem
import com.arrow2851.nudge.ui.today.TodayEvent
import com.arrow2851.nudge.ui.today.TodayScreen
import com.arrow2851.nudge.ui.today.TodayViewModel
import kotlinx.coroutines.launch

private const val Phase7AreaRoute = "area/{areaId}"
private const val Phase7SectionRoute = "section/{sectionId}"
private const val Phase7ListRoute = "list/{listId}"
const val SettingsGraphRoute = "settings_graph"
const val SettingsHomeRoute = "settings"
const val InterventionSettingsRoute = "interventions"
const val HistoryRoute = "history"
const val DisplayBehaviorRoute = "display_behavior"
const val BackupRoute = "backup"
const val WidgetSettingsRoute = "widget_settings"

@Composable
fun NudgePhase7App(
    requestedRoute: String? = null,
    openQuickAddInitially: Boolean = false,
    todayViewModel: TodayViewModel = hiltViewModel(),
    areasViewModel: AreasViewModel = hiltViewModel(),
    listsViewModel: ListsViewModel = hiltViewModel(),
    shellViewModel: AppShellViewModel = hiltViewModel(),
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val selectedDestination = when {
        currentRoute?.startsWith("area/") == true || currentRoute?.startsWith("section/") == true ->
            NudgeDestination.Areas
        currentRoute?.startsWith("list/") == true -> NudgeDestination.Lists
        else -> NudgeDestination.entries.firstOrNull { it.route == currentRoute }
            ?: NudgeDestination.Today
    }
    val screenTitle = when (currentRoute) {
        SettingsHomeRoute -> "Settings"
        InterventionSettingsRoute -> "Interventions"
        HistoryRoute -> "History"
        DisplayBehaviorRoute -> "Display"
        BackupRoute -> "Backup"
        WidgetSettingsRoute -> "Widgets"
        else -> selectedDestination.label
    }
    val todayState by todayViewModel.uiState.collectAsStateWithLifecycle()
    val areasState by areasViewModel.uiState.collectAsStateWithLifecycle()
    val listsState by listsViewModel.uiState.collectAsStateWithLifecycle()
    val listSuggestions by listsViewModel.suggestions.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    var showQuickAdd by remember { mutableStateOf(openQuickAddInitially) }
    var taskCreateRequest by remember { mutableIntStateOf(0) }
    var areaCreateRequest by remember { mutableIntStateOf(0) }
    var choreCreateRequest by remember { mutableIntStateOf(0) }
    var listCreateRequest by remember { mutableIntStateOf(0) }
    var listItemCreateRequest by remember { mutableIntStateOf(0) }

    LaunchedEffect(requestedRoute) {
        if (requestedRoute != null && currentRoute != requestedRoute) {
            navController.navigate(requestedRoute) { launchSingleTop = true }
        }
    }

    LaunchedEffect(shellViewModel, snackbarHostState) {
        shellViewModel.feedback.collect { event ->
            when (event) {
                AppFeedbackEvent.DismissCurrent -> {
                    snackbarHostState.currentSnackbarData?.dismiss()
                }
                is AppFeedbackEvent.Message -> {
                    snackbarHostState.currentSnackbarData?.dismiss()
                    launch {
                        snackbarHostState.showSnackbar(
                            message = event.text,
                            withDismissAction = false,
                            duration = SnackbarDuration.Short,
                        )
                    }
                }
                is AppFeedbackEvent.UndoAvailable -> {
                    snackbarHostState.currentSnackbarData?.dismiss()
                    launch {
                        val result = snackbarHostState.showSnackbar(
                            message = event.text,
                            actionLabel = "Undo",
                            withDismissAction = false,
                            duration = SnackbarDuration.Short,
                        )
                        if (result == SnackbarResult.ActionPerformed) {
                            shellViewModel.undo(event.token)
                        }
                    }
                }
            }
        }
    }

    LaunchedEffect(todayViewModel, shellViewModel) {
        todayViewModel.events.collect { event ->
            when (event) {
                is TodayEvent.Message -> shellViewModel.mutationMessage(event.text)
                is TodayEvent.ItemCompleted -> when (val undo = event.undo) {
                    is TodayCompletionUndo.TaskCompletion ->
                        shellViewModel.registerTaskUndo(event.text, undo.mutation)
                    is TodayCompletionUndo.ChoreCompletion ->
                        shellViewModel.registerChoreUndo(event.text, undo.mutation)
                }
            }
        }
    }

    LaunchedEffect(areasViewModel, shellViewModel) {
        areasViewModel.events.collect { event ->
            when (event) {
                is AreasEvent.Message -> shellViewModel.mutationMessage(event.text)
                is AreasEvent.ChoreCompleted ->
                    shellViewModel.registerChoreUndo(event.text, event.mutation)
            }
        }
    }

    val navigateTo: (NudgeDestination) -> Unit = { destination ->
        shellViewModel.invalidateUndo()
        val returningHome = destination == NudgeDestination.Today
        navController.navigate(destination.route) {
            popUpTo(navController.graph.findStartDestination().id) {
                saveState = !returningHome
            }
            launchSingleTop = true
            restoreState = !returningHome
        }
    }

    val settingsRoutes = setOf(
        SettingsHomeRoute,
        InterventionSettingsRoute,
        HistoryRoute,
        DisplayBehaviorRoute,
        BackupRoute,
        WidgetSettingsRoute,
    )
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
                IconButton(
                    onClick = {
                        shellViewModel.invalidateUndo()
                        navController.navigate(SettingsHomeRoute) { launchSingleTop = true }
                    },
                ) {
                    Icon(Icons.Default.Settings, contentDescription = "Settings")
                }
            }
            if (currentRoute !in settingsRoutes) {
                IconButton(
                    onClick = {
                        shellViewModel.invalidateUndo()
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
            startDestination = NudgeDestination.Today.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(NudgeDestination.Today.route) {
                TodayScreen(
                    state = todayState,
                    viewModel = todayViewModel,
                    onOpenTask = { navigateTo(NudgeDestination.Tasks) },
                    onOpenChore = { item: TodayDueItem ->
                        shellViewModel.invalidateUndo()
                        val sectionId = item.sectionId
                        if (sectionId == null) {
                            item.areaId?.let { navController.navigate("area/$it") }
                        } else {
                            navController.navigate("section/$sectionId")
                        }
                    },
                    onOpenList = { listId ->
                        shellViewModel.invalidateUndo()
                        navController.navigate("list/$listId")
                    },
                )
            }
            composable(NudgeDestination.Areas.route) {
                AreasOverviewScreen(
                    state = areasState,
                    createRequest = areaCreateRequest,
                    viewModel = areasViewModel,
                    onOpenArea = { areaId ->
                        shellViewModel.invalidateUndo()
                        navController.navigate("area/$areaId")
                    },
                )
            }
            composable(Phase7AreaRoute) { entry ->
                val areaId = entry.arguments?.getString("areaId").orEmpty()
                AreaDetailScreen(
                    areaId = areaId,
                    state = areasState,
                    createChoreRequest = choreCreateRequest,
                    viewModel = areasViewModel,
                    onBack = {
                        shellViewModel.invalidateUndo()
                        navController.popBackStack()
                    },
                    onOpenSection = { sectionId ->
                        shellViewModel.invalidateUndo()
                        navController.navigate("section/$sectionId")
                    },
                )
            }
            composable(Phase7SectionRoute) { entry ->
                val sectionId = entry.arguments?.getString("sectionId").orEmpty()
                SectionDetailScreen(
                    sectionId = sectionId,
                    state = areasState,
                    createChoreRequest = choreCreateRequest,
                    viewModel = areasViewModel,
                    onBack = {
                        shellViewModel.invalidateUndo()
                        navController.popBackStack()
                    },
                )
            }
            composable(NudgeDestination.Tasks.route) {
                TasksScreen(createRequest = taskCreateRequest)
            }
            composable(NudgeDestination.Lists.route) {
                ListsOverviewScreen(
                    state = listsState,
                    createRequest = listCreateRequest,
                    viewModel = listsViewModel,
                    onOpenList = { listId ->
                        shellViewModel.invalidateUndo()
                        navController.navigate("list/$listId")
                    },
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
                    onBack = {
                        shellViewModel.invalidateUndo()
                        navController.popBackStack()
                    },
                )
            }
            navigation(
                startDestination = SettingsHomeRoute,
                route = SettingsGraphRoute,
            ) {
                composable(SettingsHomeRoute) {
                    SettingsHomeScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                        onOpenInterventions = {
                            shellViewModel.invalidateUndo()
                            navController.navigate(InterventionSettingsRoute)
                        },
                        onOpenHistory = {
                            shellViewModel.invalidateUndo()
                            navController.navigate(HistoryRoute)
                        },
                        onOpenDisplay = {
                            shellViewModel.invalidateUndo()
                            navController.navigate(DisplayBehaviorRoute)
                        },
                        onOpenBackup = {
                            shellViewModel.invalidateUndo()
                            navController.navigate(BackupRoute)
                        },
                        onOpenWidgets = {
                            shellViewModel.invalidateUndo()
                            navController.navigate(WidgetSettingsRoute)
                        },
                    )
                }
                composable(InterventionSettingsRoute) {
                    InterventionSettingsScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                    )
                }
                composable(HistoryRoute) {
                    HistoryScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                    )
                }
                composable(DisplayBehaviorRoute) {
                    DisplayBehaviorScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                    )
                }
                composable(BackupRoute) {
                    BackupScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                    )
                }
                composable(WidgetSettingsRoute) {
                    WidgetSettingsScreen(
                        onBack = {
                            shellViewModel.invalidateUndo()
                            navController.popBackStack()
                        },
                    )
                }
            }
        }
    }

    QuickAddSheet(
        visible = showQuickAdd,
        onDismiss = {
            shellViewModel.invalidateUndo()
            showQuickAdd = false
        },
        onSaved = { title -> shellViewModel.mutationMessage("Saved task: $title") },
        onError = { message -> shellViewModel.mutationMessage(message) },
    )
}
