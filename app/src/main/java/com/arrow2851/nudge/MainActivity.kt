package com.arrow2851.nudge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.arrow2851.nudge.ui.InterventionSettingsRoute
import com.arrow2851.nudge.ui.NudgePhase7App
import com.arrow2851.nudge.ui.components.NudgeDestination
import com.arrow2851.nudge.ui.theme.NudgeTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val destination = intent?.data?.host
        val requestedRoute = when (destination) {
            "interventions" -> InterventionSettingsRoute
            "tasks" -> NudgeDestination.Tasks.route
            "lists" -> NudgeDestination.Lists.route
            "list" -> intent?.data?.pathSegments?.firstOrNull()?.let { "list/$it" }
            else -> null
        }
        val openQuickAdd = destination == "quick-add" ||
            intent?.getBooleanExtra(ExtraOpenQuickAdd, false) == true
        setContent {
            NudgeTheme {
                NudgePhase7App(
                    requestedRoute = requestedRoute,
                    openQuickAddInitially = openQuickAdd,
                )
            }
        }
    }

    companion object {
        const val ExtraOpenQuickAdd = "open_quick_add"
    }
}
