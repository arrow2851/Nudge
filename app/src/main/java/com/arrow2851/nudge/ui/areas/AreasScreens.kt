package com.arrow2851.nudge.ui.areas

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.ChoreGroup
import com.arrow2851.nudge.core.model.ChoreRecurrence
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.RecurrenceUnit
import com.arrow2851.nudge.core.model.ScheduleBasis
import com.arrow2851.nudge.ui.components.NudgeButton
import com.arrow2851.nudge.ui.components.NudgeButtonStyle
import com.arrow2851.nudge.ui.components.NudgeCard
import com.arrow2851.nudge.ui.components.NudgeEmptyState
import com.arrow2851.nudge.ui.components.NudgeSectionLabel
import com.arrow2851.nudge.ui.theme.nudgeSpacing
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun AreasOverviewScreen(
    state: AreasUiState,
    createRequest: Int,
    viewModel: AreasViewModel,
    onOpenArea: (String) -> Unit,
) {
    var showAreaEditor by rememberSaveable { mutableStateOf(false) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createRequest) {
        if (createRequest > lastHandledCreate) {
            lastHandledCreate = createRequest
            showAreaEditor = true
        }
    }

    when (state) {
        AreasUiState.Loading -> CareLoading()
        is AreasUiState.Error -> CareError(state.message)
        is AreasUiState.Ready -> {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("areas-overview"),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item {
                    NudgeSectionLabel("RECURRING CARE")
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                    Text(
                        "Keep recurring care visible.",
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(MaterialTheme.nudgeSpacing.x2))
                    Text(
                        if (state.attentionCount == 0) {
                            "Nothing is demanding attention right now."
                        } else {
                            "${state.attentionCount} routines need attention across ${state.areas.size} areas."
                        },
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                if (state.areas.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "No recurring-care Areas yet",
                            message = "Start empty or use a House or Car template.",
                            actionLabel = "Add Area",
                            onAction = { showAreaEditor = true },
                            icon = { Icon(Icons.Default.LocationOn, contentDescription = null) },
                        )
                    }
                } else {
                    item {
                        NudgeCard(modifier = Modifier.fillMaxWidth()) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                            ) {
                                Column {
                                    Text("Needs attention", style = MaterialTheme.typography.titleMedium)
                                    Text(
                                        "${state.attentionCount} due or overdue",
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    )
                                }
                                Text(
                                    "${state.totalChores} routines",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = MaterialTheme.colorScheme.primary,
                                )
                            }
                        }
                    }

                    items(state.areas, key = { it.area.id }) { area ->
                        AreaOverviewCard(
                            item = area,
                            onOpen = { onOpenArea(area.area.id) },
                            onMoveUp = { viewModel.moveArea(area.area.id, -1) },
                            onMoveDown = { viewModel.moveArea(area.area.id, 1) },
                        )
                    }
                }

                item {
                    NudgeButton(
                        text = "Add Area",
                        onClick = { showAreaEditor = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add-area-bottom"),
                        style = NudgeButtonStyle.Outlined,
                        leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                    )
                }
            }

            AreaEditorSheet(
                visible = showAreaEditor,
                onDismiss = { showAreaEditor = false },
                onSave = { name, template ->
                    viewModel.createArea(name, template)
                    showAreaEditor = false
                },
            )
            state.recoverableError?.let { CareErrorBanner(it, viewModel::dismissRecoverableError) }
        }
    }
}

@Composable
fun AreaDetailScreen(
    areaId: String,
    state: AreasUiState,
    createChoreRequest: Int,
    viewModel: AreasViewModel,
    onBack: () -> Unit,
    onOpenSection: (String) -> Unit,
) {
    val ready = state as? AreasUiState.Ready
    val item = ready?.area(areaId)
    var showAreaEditor by rememberSaveable { mutableStateOf(false) }
    var showSectionEditor by rememberSaveable { mutableStateOf(false) }
    var showTemplate by rememberSaveable { mutableStateOf(false) }
    var selectedChoreId by rememberSaveable { mutableStateOf<String?>(null) }
    var showNewChore by rememberSaveable { mutableStateOf(false) }
    var gradeChoreId by rememberSaveable { mutableStateOf<String?>(null) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createChoreRequest) {
        if (createChoreRequest > lastHandledCreate) {
            lastHandledCreate = createChoreRequest
            showNewChore = true
        }
    }

    when {
        state == AreasUiState.Loading -> CareLoading()
        state is AreasUiState.Error -> CareError(state.message)
        item == null -> CareError("Area not found.")
        else -> {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("area-detail-${item.area.name}"),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item {
                    TextButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = null)
                        Text("All Areas")
                    }
                    Text(
                        item.area.name,
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "${item.chores.size} routines · ${item.sections.size} sections · ${item.needsAttention.size} need attention",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        NudgeButton(
                            text = "Add Chore",
                            onClick = { showNewChore = true },
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Tonal,
                        )
                        NudgeButton(
                            text = "Add Section",
                            onClick = { showSectionEditor = true },
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Outlined,
                        )
                    }
                    Spacer(Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        NudgeButton(
                            text = "Use Template",
                            onClick = { showTemplate = true },
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Outlined,
                        )
                        NudgeButton(
                            text = "Edit Area",
                            onClick = { showAreaEditor = true },
                            modifier = Modifier.weight(1f),
                            style = NudgeButtonStyle.Text,
                        )
                    }
                }

                if (item.needsAttention.isNotEmpty()) {
                    item { NudgeSectionLabel("NEEDS ATTENTION") }
                    items(item.needsAttention, key = { "attention-${it.chore.id}" }) { chore ->
                        ChoreCareRow(
                            chore = chore,
                            now = ready.now,
                            sectionName = item.sections.firstOrNull { it.id == chore.chore.sectionId }?.name,
                            onComplete = {
                                if (chore.chore.supportsGrading) gradeChoreId = chore.chore.id
                                else viewModel.completeChore(chore.chore.id)
                            },
                            onOpen = { selectedChoreId = chore.chore.id },
                        )
                    }
                }

                val general = item.sectionChores(null)
                if (general.isNotEmpty()) {
                    item { NudgeSectionLabel("GENERAL AREA") }
                    items(general, key = { "general-${it.chore.id}" }) { chore ->
                        ChoreCareRow(
                            chore = chore,
                            now = ready.now,
                            onComplete = {
                                if (chore.chore.supportsGrading) gradeChoreId = chore.chore.id
                                else viewModel.completeChore(chore.chore.id)
                            },
                            onOpen = { selectedChoreId = chore.chore.id },
                        )
                    }
                }

                if (item.sections.isNotEmpty()) {
                    item { NudgeSectionLabel("SECTIONS") }
                    items(item.sections, key = { it.id }) { section ->
                        val chores = item.sectionChores(section.id)
                        SectionOverviewCard(
                            sectionName = section.name,
                            chores = chores,
                            now = ready.now,
                            onOpen = { onOpenSection(section.id) },
                            onMoveUp = { viewModel.moveSection(section.id, -1) },
                            onMoveDown = { viewModel.moveSection(section.id, 1) },
                        )
                    }
                }

                item {
                    NudgeButton(
                        text = "Add Chore to ${item.area.name}",
                        onClick = { showNewChore = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add-chore-bottom"),
                        style = NudgeButtonStyle.Outlined,
                        leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                    )
                }
            }

            AreaEditorSheet(
                visible = showAreaEditor,
                existingName = item.area.name,
                onDismiss = { showAreaEditor = false },
                onSave = { name, _ ->
                    viewModel.renameArea(item.area.id, name)
                    showAreaEditor = false
                },
                onArchive = {
                    viewModel.archiveArea(item.area.id)
                    showAreaEditor = false
                    onBack()
                },
            )
            SectionEditorSheet(
                visible = showSectionEditor,
                onDismiss = { showSectionEditor = false },
                onSave = { name ->
                    viewModel.createSection(item.area.id, name)
                    showSectionEditor = false
                },
            )
            TemplateDialog(
                visible = showTemplate,
                onDismiss = { showTemplate = false },
                onApply = { template ->
                    viewModel.applyTemplate(item.area.id, template)
                    showTemplate = false
                },
            )

            val selected = selectedChoreId?.let(ready::chore)
            val newDraft = newChoreDraft(item.area.id, null, ready.now)
            ChoreEditorSheet(
                visible = showNewChore || selected != null,
                initial = selected?.let(::draftFromChore) ?: newDraft,
                existing = selected,
                sections = item.sections,
                onDismiss = {
                    showNewChore = false
                    selectedChoreId = null
                },
                onSave = { draft ->
                    viewModel.saveChore(draft)
                    showNewChore = false
                    selectedChoreId = null
                },
                onPause = selected?.let { chore ->
                    { paused -> viewModel.setPaused(chore.chore.id, paused) }
                },
                onSkip = selected?.let { chore ->
                    { viewModel.skipOccurrence(chore.chore.id) }
                },
                onMoveUp = selected?.let { chore ->
                    { viewModel.moveChore(chore.chore.id, -1) }
                },
                onMoveDown = selected?.let { chore ->
                    { viewModel.moveChore(chore.chore.id, 1) }
                },
                onArchive = selected?.let { chore ->
                    {
                        viewModel.archiveChore(chore.chore.id)
                        selectedChoreId = null
                    }
                },
            )

            val gradeChore = gradeChoreId?.let(ready::chore)
            GradeCompletionDialog(
                choreTitle = gradeChore?.chore?.title,
                onDismiss = { gradeChoreId = null },
                onGrade = { grade ->
                    gradeChore?.let { viewModel.completeChore(it.chore.id, grade) }
                    gradeChoreId = null
                },
            )
            ready.recoverableError?.let { CareErrorBanner(it, viewModel::dismissRecoverableError) }
        }
    }
}

@Composable
fun SectionDetailScreen(
    sectionId: String,
    state: AreasUiState,
    createChoreRequest: Int,
    viewModel: AreasViewModel,
    onBack: () -> Unit,
) {
    val ready = state as? AreasUiState.Ready
    val item = ready?.section(sectionId)
    var selectedChoreId by rememberSaveable { mutableStateOf<String?>(null) }
    var showNewChore by rememberSaveable { mutableStateOf(false) }
    var showSectionEditor by rememberSaveable { mutableStateOf(false) }
    var gradeChoreId by rememberSaveable { mutableStateOf<String?>(null) }
    var lastHandledCreate by rememberSaveable { mutableIntStateOf(0) }

    LaunchedEffect(createChoreRequest) {
        if (createChoreRequest > lastHandledCreate) {
            lastHandledCreate = createChoreRequest
            showNewChore = true
        }
    }

    when {
        state == AreasUiState.Loading -> CareLoading()
        state is AreasUiState.Error -> CareError(state.message)
        item == null -> CareError("Section not found.")
        else -> {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("section-detail-${item.section.name}"),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                item {
                    TextButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = null)
                        Text(item.area.name)
                    }
                    Text(
                        item.section.name,
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "${item.grouped(ChoreGroup.NeedsAttention).size} due · ${item.grouped(ChoreGroup.ComingUp).size} upcoming · ${item.grouped(ChoreGroup.AsNeeded).size} as needed",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.height(8.dp))
                    NudgeButton(
                        text = "Edit Section",
                        onClick = { showSectionEditor = true },
                        style = NudgeButtonStyle.Text,
                    )
                }

                ChoreGroup.entries.forEach { group ->
                    val chores = item.grouped(group)
                    if (chores.isNotEmpty()) {
                        item { NudgeSectionLabel(groupLabel(group)) }
                        items(chores, key = { "${group.name}-${it.chore.id}" }) { chore ->
                            ChoreCareRow(
                                chore = chore,
                                now = ready.now,
                                onComplete = {
                                    if (chore.chore.supportsGrading) gradeChoreId = chore.chore.id
                                    else viewModel.completeChore(chore.chore.id)
                                },
                                onOpen = { selectedChoreId = chore.chore.id },
                            )
                        }
                    }
                }

                if (item.chores.isEmpty()) {
                    item {
                        NudgeEmptyState(
                            title = "No recurring chores here yet",
                            message = "One-time items belong in Tasks. Add only routines that should return.",
                            actionLabel = "Add Chore",
                            onAction = { showNewChore = true },
                        )
                    }
                }

                item {
                    NudgeButton(
                        text = "Add Chore to ${item.section.name}",
                        onClick = { showNewChore = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("add-section-chore-bottom"),
                        style = NudgeButtonStyle.Outlined,
                        leadingIcon = { Icon(Icons.Default.Add, contentDescription = null) },
                    )
                }
            }

            SectionEditorSheet(
                visible = showSectionEditor,
                existingName = item.section.name,
                onDismiss = { showSectionEditor = false },
                onSave = { name ->
                    viewModel.renameSection(item.section.id, name)
                    showSectionEditor = false
                },
                onArchive = {
                    viewModel.archiveSection(item.section.id)
                    showSectionEditor = false
                    onBack()
                },
            )

            val selected = selectedChoreId?.let(ready::chore)
            ChoreEditorSheet(
                visible = showNewChore || selected != null,
                initial = selected?.let(::draftFromChore)
                    ?: newChoreDraft(item.area.id, item.section.id, ready.now),
                existing = selected,
                sections = ready.area(item.area.id)?.sections.orEmpty(),
                onDismiss = {
                    showNewChore = false
                    selectedChoreId = null
                },
                onSave = { draft ->
                    viewModel.saveChore(draft)
                    showNewChore = false
                    selectedChoreId = null
                },
                onPause = selected?.let { chore ->
                    { paused -> viewModel.setPaused(chore.chore.id, paused) }
                },
                onSkip = selected?.let { chore ->
                    { viewModel.skipOccurrence(chore.chore.id) }
                },
                onMoveUp = selected?.let { chore ->
                    { viewModel.moveChore(chore.chore.id, -1) }
                },
                onMoveDown = selected?.let { chore ->
                    { viewModel.moveChore(chore.chore.id, 1) }
                },
                onArchive = selected?.let { chore ->
                    {
                        viewModel.archiveChore(chore.chore.id)
                        selectedChoreId = null
                    }
                },
            )

            val gradeChore = gradeChoreId?.let(ready::chore)
            GradeCompletionDialog(
                choreTitle = gradeChore?.chore?.title,
                onDismiss = { gradeChoreId = null },
                onGrade = { grade ->
                    gradeChore?.let { viewModel.completeChore(it.chore.id, grade) }
                    gradeChoreId = null
                },
            )
            ready.recoverableError?.let { CareErrorBanner(it, viewModel::dismissRecoverableError) }
        }
    }
}

@Composable
private fun AreaOverviewCard(
    item: AreaCareItem,
    onOpen: () -> Unit,
    onMoveUp: () -> Unit,
    onMoveDown: () -> Unit,
) {
    NudgeCard(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("area-card-${item.area.name}"),
        onClick = onOpen,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                Icons.Default.LocationOn,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(32.dp),
            )
            Column(modifier = Modifier.weight(1f).padding(start = 12.dp)) {
                Text(item.area.name, style = MaterialTheme.typography.titleLarge)
                Text(
                    "${item.chores.size} routines · ${item.sections.size} sections",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    when {
                        item.needsAttention.isNotEmpty() -> "${item.needsAttention.size} need attention"
                        item.nextRelevant != null -> "Next: ${item.nextRelevant?.chore?.title}"
                        item.asNeeded.isNotEmpty() -> "${item.asNeeded.size} available as needed"
                        else -> "All clear"
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (item.needsAttention.isNotEmpty()) {
                        MaterialTheme.colorScheme.error
                    } else {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    },
                )
            }
            Text("›", style = MaterialTheme.typography.headlineMedium)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            TextButton(onClick = onMoveUp) { Text("Move up") }
            TextButton(onClick = onMoveDown) { Text("Move down") }
        }
    }
}

@Composable
private fun SectionOverviewCard(
    sectionName: String,
    chores: List<ChoreWithSchedule>,
    now: Long,
    onOpen: () -> Unit,
    onMoveUp: () -> Unit,
    onMoveDown: () -> Unit,
) {
    val attention = chores.count { ChoreRecurrence.group(it, now) == ChoreGroup.NeedsAttention }
    NudgeCard(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("section-card-$sectionName"),
        onClick = onOpen,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text(sectionName, style = MaterialTheme.typography.titleLarge)
                Text(
                    "${chores.size} routines · ${if (attention == 0) "all clear" else "$attention need attention"}",
                    color = if (attention > 0) MaterialTheme.colorScheme.error
                    else MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Text("›", style = MaterialTheme.typography.headlineMedium)
        }
        Row {
            TextButton(onClick = onMoveUp) { Text("Move up") }
            TextButton(onClick = onMoveDown) { Text("Move down") }
        }
    }
}

@Composable
private fun ChoreCareRow(
    chore: ChoreWithSchedule,
    now: Long,
    sectionName: String? = null,
    onComplete: () -> Unit,
    onOpen: () -> Unit,
) {
    NudgeCard(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("chore-row-${chore.chore.title}"),
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(
                onClick = onComplete,
                enabled = !chore.chore.isPaused,
                modifier = Modifier.testTag("complete-chore-${chore.chore.title}"),
            ) {
                Icon(
                    Icons.Default.Check,
                    contentDescription = "Complete ${chore.chore.title}",
                    tint = if (chore.chore.isPaused) MaterialTheme.colorScheme.outline
                    else MaterialTheme.colorScheme.primary,
                )
            }
            TextButton(
                onClick = onOpen,
                modifier = Modifier.weight(1f),
            ) {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        chore.chore.title,
                        modifier = Modifier.fillMaxWidth(),
                        style = MaterialTheme.typography.titleMedium,
                    )
                    val supporting = listOfNotNull(
                        sectionName,
                        chore.chore.estimatedMinutes?.let { "$it min" },
                    ).joinToString(" · ")
                    if (supporting.isNotEmpty()) {
                        Text(
                            supporting,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
            Text(
                ChoreRecurrence.dueLabel(chore, now),
                style = MaterialTheme.typography.labelMedium,
                color = when (ChoreRecurrence.group(chore, now)) {
                    ChoreGroup.NeedsAttention -> MaterialTheme.colorScheme.error
                    else -> MaterialTheme.colorScheme.onSurfaceVariant
                },
            )
        }
    }
}

@Composable
private fun CareLoading() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun CareError(message: String) {
    Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
        NudgeEmptyState(
            title = "Recurring care is unavailable",
            message = message,
        )
    }
}

@Composable
private fun CareErrorBanner(message: String, onDismiss: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        contentAlignment = Alignment.TopCenter,
    ) {
        NudgeCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(message, modifier = Modifier.weight(1f))
                TextButton(onClick = onDismiss) { Text("Dismiss") }
            }
        }
    }
}

internal fun newChoreDraft(areaId: String, sectionId: String?, now: Long): ChoreDraft =
    ChoreDraft(
        areaId = areaId,
        sectionId = sectionId,
        recurrenceType = RecurrenceType.Weekly,
        intervalValue = 1,
        intervalUnit = RecurrenceUnit.Weeks,
        scheduleBasis = ScheduleBasis.Calendar,
        firstDueAt = now,
    )

internal fun draftFromChore(chore: ChoreWithSchedule): ChoreDraft = ChoreDraft(
    id = chore.chore.id,
    title = chore.chore.title,
    description = chore.chore.description.orEmpty(),
    areaId = chore.chore.areaId,
    sectionId = chore.chore.sectionId,
    estimatedMinutes = chore.chore.estimatedMinutes,
    recurrenceType = chore.schedule?.recurrenceType ?: RecurrenceType.WhenNeeded,
    intervalValue = chore.schedule?.intervalValue ?: 1,
    intervalUnit = chore.schedule?.intervalUnit ?: RecurrenceUnit.Weeks,
    scheduleBasis = chore.schedule?.scheduleBasis ?: ScheduleBasis.Calendar,
    firstDueAt = chore.chore.nextDueAt,
    supportsGrading = chore.chore.supportsGrading,
    defaultGrade = chore.chore.defaultGrade.takeIf { it != CompletionGrade.None }
        ?: CompletionGrade.Moderate,
    isPaused = chore.chore.isPaused,
)

internal fun formatCareDate(epochMillis: Long): String =
    Instant.ofEpochMilli(epochMillis)
        .atZone(ZoneId.systemDefault())
        .toLocalDate()
        .format(DateTimeFormatter.ofPattern("MMM d, yyyy"))

private fun groupLabel(group: ChoreGroup): String = when (group) {
    ChoreGroup.NeedsAttention -> "NEEDS ATTENTION"
    ChoreGroup.ComingUp -> "COMING UP"
    ChoreGroup.AsNeeded -> "AS NEEDED"
    ChoreGroup.Paused -> "PAUSED"
}
