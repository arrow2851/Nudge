package com.arrow2851.nudge.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Immutable
data class NudgeSpacing(
    val x1: Dp = 4.dp,
    val x2: Dp = 8.dp,
    val x3: Dp = 12.dp,
    val x4: Dp = 16.dp,
    val x5: Dp = 20.dp,
    val x6: Dp = 24.dp,
    val x8: Dp = 32.dp,
)

object NudgeElevation {
    val None = 0.dp
    val Level1 = 2.dp
    val Level2 = 6.dp
}

object NudgeMotion {
    const val Fast = 140
    const val Normal = 220
}

object NudgeTouchTarget {
    val Minimum = 48.dp
}

internal val LocalNudgeSpacing = staticCompositionLocalOf { NudgeSpacing() }
internal val LocalNudgeSemanticColors = staticCompositionLocalOf { LightSemanticColors }
