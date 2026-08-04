package com.arrow2851.nudge.ui.areas

import com.arrow2851.nudge.core.data.AreaRepository
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaTemplateKind
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreCompletionMutation
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.IdGenerator
import com.arrow2851.nudge.core.model.RecurrenceType
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.TemplateApplyResult
import com.arrow2851.nudge.core.model.TimeProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AreasViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setUp() = Dispatchers.setMain(dispatcher)

    @After
    fun tearDown() = Dispatchers.resetMain()

    @Test
    fun creatingAreaCanApplyTemplate() = runTest(dispatcher) {
        val areas = FakeAreaRepository()
        val chores = FakeChoreRepository()
        val viewModel = viewModel(areas, chores)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        viewModel.createArea("House", AreaTemplateKind.House)
        advanceUntilIdle()

        assertEquals("House", areas.areas.value.single().name)
        assertEquals(AreaTemplateKind.House, areas.lastTemplate)
    }

    @Test
    fun savingDraftUsesOneIdentifierForChoreAndSchedule() = runTest(dispatcher) {
        val area = Area("area", "House", sortOrder = 0, createdAt = 1, updatedAt = 1)
        val areas = FakeAreaRepository(listOf(area))
        val chores = FakeChoreRepository()
        val viewModel = viewModel(areas, chores)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        viewModel.saveChore(
            ChoreDraft(
                title = "Clean sink",
                areaId = area.id,
                recurrenceType = RecurrenceType.Weekly,
            ),
        )
        advanceUntilIdle()

        val saved = chores.saved
        assertNotNull(saved)
        assertEquals(saved?.chore?.id, saved?.schedule?.choreId)
    }

    private fun viewModel(areas: FakeAreaRepository, chores: FakeChoreRepository) = AreasViewModel(
        areaRepository = areas,
        choreRepository = chores,
        idGenerator = object : IdGenerator {
            private var next = 0
            override fun newId(): String = "id-${++next}"
        },
        timeProvider = object : TimeProvider {
            override fun nowEpochMillis(): Long = 2_000L
        },
    )
}

private class FakeAreaRepository(initial: List<Area> = emptyList()) : AreaRepository {
    val areas = MutableStateFlow(initial)
    private val sections = MutableStateFlow<List<Section>>(emptyList())
    var lastTemplate: AreaTemplateKind? = null

    override fun observeAreas(): Flow<List<Area>> = areas
    override fun observeSections(): Flow<List<Section>> = sections
    override fun observeArea(areaId: String): Flow<AreaWithSections?> = flowOf(null)
    override suspend fun saveArea(area: Area) {
        areas.value = areas.value.filterNot { it.id == area.id } + area
    }
    override suspend fun saveSection(section: Section) {
        sections.value = sections.value.filterNot { it.id == section.id } + section
    }
    override suspend fun createArea(name: String, icon: String?): Area {
        val area = Area("area-${areas.value.size}", name, icon, areas.value.size.toLong(), 1, 1)
        areas.value += area
        return area
    }
    override suspend fun createSection(areaId: String, name: String, icon: String?): Section {
        val section = Section("section", areaId, name, icon, 0, 1, 1)
        sections.value += section
        return section
    }
    override suspend fun moveArea(areaId: String, direction: Int) = Unit
    override suspend fun moveSection(sectionId: String, direction: Int) = Unit
    override suspend fun applyTemplate(areaId: String, kind: AreaTemplateKind): TemplateApplyResult {
        lastTemplate = kind
        return TemplateApplyResult(4, 7)
    }
    override suspend fun archiveArea(areaId: String, archivedAt: Long) {
        areas.value = areas.value.filterNot { it.id == areaId }
    }
    override suspend fun archiveSection(sectionId: String, archivedAt: Long) {
        sections.value = sections.value.filterNot { it.id == sectionId }
    }
}

private class FakeChoreRepository : ChoreRepository {
    private val chores = MutableStateFlow<List<ChoreWithSchedule>>(emptyList())
    var saved: ChoreWithSchedule? = null

    override fun observeChores(): Flow<List<Chore>> = flowOf(emptyList())
    override fun observeChoresWithSchedules(): Flow<List<ChoreWithSchedule>> = chores
    override fun observeChoresForArea(areaId: String): Flow<List<Chore>> = flowOf(emptyList())
    override fun observeChoresForAreaWithSchedules(areaId: String): Flow<List<ChoreWithSchedule>> = chores
    override fun observeChoresForSection(sectionId: String): Flow<List<ChoreWithSchedule>> = chores
    override fun observeChore(choreId: String): Flow<ChoreWithSchedule?> = flowOf(null)
    override suspend fun saveChore(chore: ChoreWithSchedule) {
        saved = chore
        chores.value = chores.value.filterNot { it.chore.id == chore.chore.id } + chore
    }
    override suspend fun completeChore(choreId: String, grade: CompletionGrade) =
        ChoreCompletionMutation(choreId, "completion", null, null, grade)
    override suspend fun undoCompletion(mutation: ChoreCompletionMutation) = Unit
    override suspend fun setPaused(choreId: String, paused: Boolean) = Unit
    override suspend fun skipOccurrence(choreId: String) = Unit
    override suspend fun moveChore(choreId: String, direction: Int) = Unit
    override suspend fun archiveChore(choreId: String, archivedAt: Long) = Unit
}
