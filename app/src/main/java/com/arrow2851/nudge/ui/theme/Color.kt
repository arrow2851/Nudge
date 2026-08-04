package com.arrow2851.nudge.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

internal object NudgePalette {
    val Green = Color(0xFF216B4D)
    val GreenStrong = Color(0xFF15543A)
    val GreenSoft = Color(0xFFDFF3E8)
    val GreenDark = Color(0xFF67C493)
    val GreenDarkStrong = Color(0xFF8BD7AD)
    val GreenDarkSoft = Color(0xFF183C2B)

    val Background = Color(0xFFEDF2EE)
    val Surface = Color(0xFFFFFFFF)
    val SurfaceSoft = Color(0xFFF5F8F5)
    val Text = Color(0xFF17211B)
    val Muted = Color(0xFF667169)
    val Border = Color(0xFFDCE5DE)

    val DarkBackground = Color(0xFF111713)
    val DarkSurface = Color(0xFF19211C)
    val DarkSurfaceSoft = Color(0xFF212C25)
    val DarkText = Color(0xFFEEF5F0)
    val DarkMuted = Color(0xFFA8B5AC)
    val DarkBorder = Color(0xFF334139)

    val Warning = Color(0xFFA96016)
    val WarningSoft = Color(0xFFFFF0D8)
    val Danger = Color(0xFFA33D3D)
    val Success = Color(0xFF277A55)
}

@Immutable
data class NudgeSemanticColors(
    val success: Color,
    val onSuccess: Color,
    val successContainer: Color,
    val onSuccessContainer: Color,
    val warning: Color,
    val onWarning: Color,
    val warningContainer: Color,
    val onWarningContainer: Color,
)

internal val LightSemanticColors = NudgeSemanticColors(
    success = NudgePalette.Success,
    onSuccess = Color.White,
    successContainer = Color(0xFFDDF3E8),
    onSuccessContainer = Color(0xFF123D2B),
    warning = NudgePalette.Warning,
    onWarning = Color.White,
    warningContainer = NudgePalette.WarningSoft,
    onWarningContainer = Color(0xFF4A2908),
)

internal val DarkSemanticColors = NudgeSemanticColors(
    success = Color(0xFF73D3A0),
    onSuccess = Color(0xFF063820),
    successContainer = Color(0xFF17472F),
    onSuccessContainer = Color(0xFFC5F6D9),
    warning = Color(0xFFFFB86B),
    onWarning = Color(0xFF4A2800),
    warningContainer = Color(0xFF53350F),
    onWarningContainer = Color(0xFFFFDDB7),
)
