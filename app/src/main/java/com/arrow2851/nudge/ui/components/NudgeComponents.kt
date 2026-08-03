package com.arrow2851.nudge.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.width
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.ui.theme.NudgeElevation
import com.arrow2851.nudge.ui.theme.NudgeTouchTarget
import com.arrow2851.nudge.ui.theme.nudgeSpacing

enum class NudgeButtonStyle {
    Primary,
    Tonal,
    Outlined,
    Text,
}

@Composable
fun NudgeButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: NudgeButtonStyle = NudgeButtonStyle.Primary,
    enabled: Boolean = true,
    leadingIcon: (@Composable () -> Unit)? = null,
) {
    val content: @Composable RowScope.() -> Unit = {
        if (leadingIcon != null) {
            leadingIcon()
            Spacer(Modifier.width(MaterialTheme.nudgeSpacing.x2))
        }
        Text(text)
    }
    val sizedModifier = modifier.sizeIn(minHeight = NudgeTouchTarget.Minimum)

    when (style) {
        NudgeButtonStyle.Primary -> Button(
            onClick = onClick,
            modifier = sizedModifier,
            enabled = enabled,
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
            content = content,
        )
        NudgeButtonStyle.Tonal -> FilledTonalButton(
            onClick = onClick,
            modifier = sizedModifier,
            enabled = enabled,
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
            content = content,
        )
        NudgeButtonStyle.Outlined -> OutlinedButton(
            onClick = onClick,
            modifier = sizedModifier,
            enabled = enabled,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
            contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
            content = content,
        )
        NudgeButtonStyle.Text -> TextButton(
            onClick = onClick,
            modifier = sizedModifier,
            enabled = enabled,
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
            content = content,
        )
    }
}

@Composable
fun NudgeCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    contentPadding: PaddingValues = PaddingValues(16.dp),
    content: @Composable ColumnScope.() -> Unit,
) {
    val interactiveModifier = if (onClick == null) {
        Modifier
    } else {
        Modifier
            .semantics { role = Role.Button }
            .clickable(onClick = onClick)
            .sizeIn(minHeight = NudgeTouchTarget.Minimum)
    }

    Surface(
        modifier = modifier.then(interactiveModifier),
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.onSurface,
        tonalElevation = NudgeElevation.Level1,
        shadowElevation = NudgeElevation.Level1,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
    ) {
        Column(
            modifier = Modifier.padding(contentPadding),
            content = content,
        )
    }
}

@Composable
fun NudgeListRow(
    title: String,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
    showDivider: Boolean = false,
) {
    val interactiveModifier = if (onClick == null) {
        Modifier
    } else {
        Modifier
            .semantics { role = Role.Button }
            .clickable(onClick = onClick)
    }

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .then(interactiveModifier)
                .sizeIn(minHeight = 64.dp)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (leading != null) {
                Box(
                    modifier = Modifier.size(NudgeTouchTarget.Minimum),
                    contentAlignment = Alignment.Center,
                ) {
                    leading()
                }
                Spacer(Modifier.width(8.dp))
            }
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.Center,
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                if (supportingText != null) {
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = supportingText,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            if (trailing != null) {
                Spacer(Modifier.width(12.dp))
                Box(
                    modifier = Modifier.sizeIn(
                        minWidth = NudgeTouchTarget.Minimum,
                        minHeight = NudgeTouchTarget.Minimum,
                    ),
                    contentAlignment = Alignment.Center,
                ) {
                    trailing()
                }
            }
        }
        if (showDivider) {
            HorizontalDivider(
                modifier = Modifier.padding(start = if (leading == null) 16.dp else 72.dp),
                color = MaterialTheme.colorScheme.outlineVariant,
            )
        }
    }
}

@Composable
fun NudgeChip(
    label: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
    leadingIcon: (@Composable () -> Unit)? = null,
) {
    AssistChip(
        onClick = onClick,
        modifier = modifier.sizeIn(minHeight = 40.dp),
        label = { Text(label) },
        leadingIcon = leadingIcon,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
    )
}

@Composable
fun NudgeTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    placeholder: String? = null,
    singleLine: Boolean = true,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth(),
        label = { Text(label) },
        supportingText = supportingText?.let { text -> { Text(text) } },
        placeholder = placeholder?.let { text -> { Text(text) } },
        singleLine = singleLine,
        shape = MaterialTheme.shapes.medium,
    )
}

@Composable
fun NudgeEmptyState(
    title: String,
    message: String,
    modifier: Modifier = Modifier,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
    icon: (@Composable () -> Unit)? = null,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        if (icon != null) {
            Surface(
                shape = MaterialTheme.shapes.large,
                color = MaterialTheme.colorScheme.primaryContainer,
                contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
            ) {
                Box(
                    modifier = Modifier.size(64.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    icon()
                }
            }
            Spacer(Modifier.height(16.dp))
        }
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        if (actionLabel != null && onAction != null) {
            Spacer(Modifier.height(20.dp))
            NudgeButton(
                text = actionLabel,
                onClick = onAction,
                style = NudgeButtonStyle.Tonal,
            )
        }
    }
}

@Composable
fun NudgeConfirmDialog(
    visible: Boolean,
    title: String,
    message: String,
    confirmLabel: String,
    dismissLabel: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
) {
    if (!visible) return

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = { Text(message) },
        confirmButton = {
            TextButton(onClick = onConfirm) {
                Text(confirmLabel)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(dismissLabel)
            }
        },
        shape = MaterialTheme.shapes.large,
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NudgeBottomSheet(
    visible: Boolean,
    onDismiss: () -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    if (!visible) return

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        shape = MaterialTheme.shapes.extraLarge,
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp),
            content = content,
        )
    }
}

@Composable
fun NudgeSnackbarHost(
    hostState: SnackbarHostState,
    modifier: Modifier = Modifier,
) {
    SnackbarHost(
        hostState = hostState,
        modifier = modifier.padding(12.dp),
    )
}

@Composable
fun NudgeSectionLabel(
    text: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text = text.uppercase(),
        modifier = modifier,
        style = MaterialTheme.typography.labelMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
}
