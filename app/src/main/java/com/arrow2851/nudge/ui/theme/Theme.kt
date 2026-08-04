package com.arrow2851.nudge.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

private val LightColors = lightColorScheme(
    primary = NudgePalette.Green,
    onPrimary = Color.White,
    primaryContainer = NudgePalette.GreenSoft,
    onPrimaryContainer = Color(0xFF123D2B),
    secondary = Color(0xFF52665A),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFDDE9E1),
    onSecondaryContainer = Color(0xFF26372D),
    tertiary = NudgePalette.Warning,
    onTertiary = Color.White,
    tertiaryContainer = NudgePalette.WarningSoft,
    onTertiaryContainer = Color(0xFF4A2908),
    background = NudgePalette.Background,
    onBackground = NudgePalette.Text,
    surface = NudgePalette.Surface,
    onSurface = NudgePalette.Text,
    surfaceVariant = NudgePalette.SurfaceSoft,
    onSurfaceVariant = NudgePalette.Muted,
    outline = Color(0xFF7C8980),
    outlineVariant = NudgePalette.Border,
    error = NudgePalette.Danger,
    onError = Color.White,
    errorContainer = Color(0xFFFFDAD8),
    onErrorContainer = Color(0xFF410006),
)

private val DarkColors = darkColorScheme(
    primary = NudgePalette.GreenDark,
    onPrimary = Color(0xFF073823),
    primaryContainer = NudgePalette.GreenDarkSoft,
    onPrimaryContainer = Color(0xFFC8F4DA),
    secondary = Color(0xFFB8CCBE),
    onSecondary = Color(0xFF24372B),
    secondaryContainer = Color(0xFF354A3D),
    onSecondaryContainer = Color(0xFFD5E9DA),
    tertiary = Color(0xFFFFB86B),
    onTertiary = Color(0xFF4A2800),
    tertiaryContainer = Color(0xFF53350F),
    onTertiaryContainer = Color(0xFFFFDDB7),
    background = NudgePalette.DarkBackground,
    onBackground = NudgePalette.DarkText,
    surface = NudgePalette.DarkSurface,
    onSurface = NudgePalette.DarkText,
    surfaceVariant = NudgePalette.DarkSurfaceSoft,
    onSurfaceVariant = NudgePalette.DarkMuted,
    outline = Color(0xFF89968D),
    outlineVariant = NudgePalette.DarkBorder,
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    errorContainer = Color(0xFF93000A),
    onErrorContainer = Color(0xFFFFDAD6),
)

private val NudgeShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(24.dp),
    extraLarge = RoundedCornerShape(32.dp),
)

val MaterialTheme.nudgeSpacing: NudgeSpacing
    @Composable
    @ReadOnlyComposable
    get() = LocalNudgeSpacing.current

val MaterialTheme.nudgeSemanticColors: NudgeSemanticColors
    @Composable
    @ReadOnlyComposable
    get() = LocalNudgeSemanticColors.current

@Composable
fun NudgeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalNudgeSpacing provides NudgeSpacing(),
        LocalNudgeSemanticColors provides if (darkTheme) DarkSemanticColors else LightSemanticColors,
    ) {
        MaterialTheme(
            colorScheme = if (darkTheme) DarkColors else LightColors,
            typography = NudgeTypography,
            shapes = NudgeShapes,
            content = content,
        )
    }
}
