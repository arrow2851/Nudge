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
        val initialRoute = when (destination) {
            "interventions" -> InterventionSettingsRoute
            else -> NudgeDestination.Today.route
        }
        val openQuickAdd = destination == "quick-add" ||
            intent?.getBooleanExtra(ExtraOpenQuickAdd, false) == true
        setContent {
            NudgeTheme {
                NudgePhase7App(
                    initialRoute = initialRoute,
                    openQuickAddInitially = openQuickAdd,
                )
            }
        }
    }

    companion object {
        const val ExtraOpenQuickAdd = "open_quick_add"
    }
}
