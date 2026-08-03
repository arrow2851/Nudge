package com.arrow2851.nudge.ui.preview

import android.content.res.Configuration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeChip
import com.arrow2851.nudge.ui.components.NudgeListRow
import com.arrow2851.nudge.ui.components.NudgeTextField
import com.arrow2851.nudge.ui.theme.NudgeTheme

@Preview(name = "Design system · light", showBackground = true, widthDp = 412)
@Composable
private fun NudgeDesignSystemLightPreview() {
    NudgeTheme(darkTheme = false) {
        DesignSystemPreviewContent()
    }
}

@Preview(
    name = "Design system · dark",
    showBackground = true,
    widthDp = 412,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
)
@Composable
private fun NudgeDesignSystemDarkPreview() {
    NudgeTheme(darkTheme = true) {
        DesignSystemPreviewContent()
    }
}

@Preview(
    name = "Design system · large text",
    showBackground = true,
    widthDp = 412,
    fontScale = 1.6f,
)
@Composable
private fun NudgeDesignSystemLargeTextPreview() {
    NudgeTheme(darkTheme = false) {
        DesignSystemPreviewContent()
    }
}

@Composable
private fun DesignSystemPreviewContent() {
    var fieldValue by remember { mutableStateOf("Wipe countertops") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = "Nudge components",
            style = MaterialTheme.typography.headlineLarge,
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            NudgeChip(label = "Light")
            NudgeChip(label = "Due today")
        }
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            NudgeListRow(
                title = "Wipe stovetop",
                supportingText = "Kitchen · overdue",
                showDivider = true,
            )
            NudgeListRow(
                title = "Water houseplants",
                supportingText = "Living Room · today",
            )
        }
        NudgeTextField(
            value = fieldValue,
            onValueChange = { fieldValue = it },
            label = "Task name",
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            NudgeButton(text = "Save", onClick = {})
            NudgeButton(
                text = "Cancel",
                onClick = {},
                style = NudgeButtonStyle.Outlined,
            )
        }
        Spacer(Modifier.height(8.dp))
    }
}
