package com.arrow2851.nudge.ui.lists

import com.arrow2851.nudge.core.data.ListItemArchiveMutation
import com.arrow2851.nudge.core.data.ListItemCheckMutation
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.ThemeMode
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.mutation.AppFeedbackEvent
import com.arrow2851.nudge.core.mutation.AppMutationCoordinator
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.flow.first
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
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class ListsViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before
    fun setUp() = Dispatchers.setMain(dispatcher)

    @After
    fun tearDown() = Dispatchers.resetMain()

    @Test
    fun creatingReusableListUpdatesRepositoryBackedState() = runTest(dispatcher) {
        val repository = FakeListWorkflowRepository()
        val viewModel = viewModel(repository, AppMutationCoordinator())
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        viewModel.createList("Groceries", true)
        advanceUntilIdle()

        val ready = viewModel.uiState.value as ListsUiState.Ready
        assertEquals("Groceries", ready.lists.single().list.name)
        assertTrue(ready.lists.single().list.isReusable)
    }

    @Test
    fun checkingItemRegistersAtomicUndoAndMovesItToCompleted() = runTest(dispatcher) {
        val repository = FakeListWorkflowRepository()
        val list = repository.createList("Groceries", true)
        val item = repository.addItem(list.id, "Milk")
        val coordinator = AppMutationCoordinator()
        val viewModel = viewModel(repository, coordinator)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()
        val event = async(UnconfinedTestDispatcher(testScheduler)) {
            coordinator.events.filterIsInstance<AppFeedbackEvent.UndoAvailable>().first()
        }

        viewModel.toggleItem(item.id)
        advanceUntilIdle()

        val checkedEvent = event.await()
        var ready = viewModel.uiState.value as ListsUiState.Ready
        assertEquals(1, ready.lists.single().completedCount)
        assertTrue(coordinator.performUndo(checkedEvent.token))
        advanceUntilIdle()
        ready = viewModel.uiState.value as ListsUiState.Ready
        assertEquals(1, ready.lists.single().activeCount)
        assertEquals(0, ready.lists.single().completedCount)
    }

    private fun viewModel(
        repository: FakeListWorkflowRepository,
        coordinator: AppMutationCoordinator,
    ) = ListsViewModel(
        repository = repository,
        preferencesRepository = FakeListPreferencesRepository(),
        mutationCoordinator = coordinator,
        timeProvider = object : TimeProvider {
            override fun nowEpochMillis(): Long = 5_000L
        },
    )
}

private class FakeListWorkflowRepository : ListWorkflowRepository {
    private val state = MutableStateFlow<List<ReusableListWithItems>>(emptyList())
    private var next = 0

    override fun observeLists(): Flow<List<ReusableListWithItems>> = state
    override fun observeList(listId: String): Flow<ReusableListWithItems?> =
        flowOf(state.value.firstOrNull { it.list.id == listId })
    override fun observeSuggestions(query: String, limit: Int): Flow<List<ListCatalogItem>> =
        flowOf(emptyList())

    override suspend fun createList(name: String, isReusable: Boolean): ReusableList {
        val list = ReusableList(
            id = "list-${++next}",
            name = name,
            isReusable = isReusable,
            sortOrder = next.toLong(),
            createdAt = 1L,
            updatedAt = 1L,
        )
        state.value += ReusableListWithItems(list, emptyList())
        return list
    }

    override suspend fun saveList(list: ReusableList) {
        state.value = state.value.map { if (it.list.id == list.id) it.copy(list = list) else it }
    }

    override suspend fun moveList(listId: String, direction: Int) = Unit
    override suspend fun reorderList(listId: String, targetListId: String) = Unit

    override suspend fun archiveList(listId: String) {
        state.value = state.value.filterNot { it.list.id == listId }
    }

    override suspend fun addItem(
        listId: String,
        name: String,
        quantity: String?,
        parentItemId: String?,
        catalogItemId: String?,
    ): ListItem {
        val item = ListItem(
            id = "item-${++next}",
            listId = listId,
            parentItemId = parentItemId,
            catalogItemId = catalogItemId,
            name = name,
            quantity = quantity,
            sortOrder = next.toLong(),
            addedAt = 1L,
            updatedAt = 1L,
        )
        state.value = state.value.map {
            if (it.list.id == listId) it.copy(items = it.items + item) else it
        }
        return item
    }

    override suspend fun saveItem(item: ListItem) {
        state.value = state.value.map { list ->
            list.copy(items = list.items.map { if (it.id == item.id) item else it })
        }
    }

    override suspend fun setItemChecked(itemId: String, checked: Boolean): ListItemCheckMutation {
        val checkedAt = 2L.takeIf { checked }
        val previous = state.value.flatMap { it.items }.first { it.id == itemId }.checkedAt
        state.value = state.value.map { list ->
            list.copy(
                items = list.items.map {
                    if (it.id == itemId) it.copy(isChecked = checked, checkedAt = checkedAt) else it
                },
            )
        }
        return ListItemCheckMutation(itemId, previous, checkedAt)
    }

    override suspend fun undoCheck(mutation: ListItemCheckMutation) {
        state.value = state.value.map { list ->
            list.copy(
                items = list.items.map { item ->
                    if (item.id == mutation.itemId) {
                        item.copy(
                            isChecked = mutation.previousCheckedAt != null,
                            checkedAt = mutation.previousCheckedAt,
                        )
                    } else {
                        item
                    }
                },
            )
        }
    }

    override suspend fun moveItem(itemId: String, direction: Int) = Unit
    override suspend fun reorderItem(itemId: String, targetItemId: String) = Unit
    override suspend fun indentItem(itemId: String) = Unit
    override suspend fun unindentItem(itemId: String) = Unit

    override suspend fun archiveItem(itemId: String): ListItemArchiveMutation {
        val item = state.value.flatMap { it.items }.first { it.id == itemId }
        state.value = state.value.map { list ->
            list.copy(items = list.items.filterNot { it.id == itemId })
        }
        return ListItemArchiveMutation(item, emptyMap(), "history-$itemId")
    }

    override suspend fun undoArchive(mutation: ListItemArchiveMutation) {
        state.value = state.value.map { list ->
            if (list.list.id == mutation.item.listId) {
                list.copy(items = list.items + mutation.item)
            } else {
                list
            }
        }
    }

    override suspend fun resetCheckedItems(listId: String) = Unit
    override suspend fun clearCheckedItems(listId: String) = Unit
}

private class FakeListPreferencesRepository : PreferencesRepository {
    private val state = MutableStateFlow(AppPreferences())
    override val preferences: Flow<AppPreferences> = state

    override suspend fun setThemeMode(value: ThemeMode) {
        state.value = state.value.copy(themeMode = value)
    }

    override suspend fun setShowDueShorthand(value: Boolean) {
        state.value = state.value.copy(showDueShorthand = value)
    }

    override suspend fun setHideCompletedItems(value: Boolean) {
        state.value = state.value.copy(hideCompletedItems = value)
    }

    override suspend fun setDailyProgressEnabled(value: Boolean) {
        state.value = state.value.copy(dailyProgressEnabled = value)
    }

    override suspend fun setQuickWinEnabled(value: Boolean) {
        state.value = state.value.copy(quickWinEnabled = value)
    }

    override suspend fun setDemoDataEnabled(value: Boolean) {
        state.value = state.value.copy(demoDataEnabled = value)
    }

    override suspend fun setItemHandedness(value: ItemHandedness) {
        state.value = state.value.copy(itemHandedness = value)
    }
}
