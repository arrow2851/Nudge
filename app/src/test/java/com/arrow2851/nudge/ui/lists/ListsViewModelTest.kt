package com.arrow2851.nudge.ui.lists

import com.arrow2851.nudge.core.data.ListItemCheckMutation
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.TimeProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
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
        val viewModel = viewModel(repository)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()

        viewModel.createList("Groceries", true)
        advanceUntilIdle()

        val ready = viewModel.uiState.value as ListsUiState.Ready
        assertEquals("Groceries", ready.lists.single().list.name)
        assertTrue(ready.lists.single().list.isReusable)
    }

    @Test
    fun checkingItemEmitsUndoMutationAndMovesItToCompleted() = runTest(dispatcher) {
        val repository = FakeListWorkflowRepository()
        val list = repository.createList("Groceries", true)
        val item = repository.addItem(list.id, "Milk")
        val viewModel = viewModel(repository)
        backgroundScope.launch(UnconfinedTestDispatcher(testScheduler)) { viewModel.uiState.collect {} }
        advanceUntilIdle()
        val event = async(UnconfinedTestDispatcher(testScheduler)) { viewModel.events.first() }

        viewModel.toggleItem(item.id)
        advanceUntilIdle()

        val checkedEvent = event.await() as ListsEvent.ItemChecked
        assertEquals(item.id, checkedEvent.mutation.itemId)
        val ready = viewModel.uiState.value as ListsUiState.Ready
        assertEquals(1, ready.lists.single().completedCount)
    }

    private fun viewModel(repository: FakeListWorkflowRepository) = ListsViewModel(
        repository = repository,
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
        setItemChecked(mutation.itemId, mutation.previousCheckedAt != null)
    }

    override suspend fun moveItem(itemId: String, direction: Int) = Unit
    override suspend fun indentItem(itemId: String) = Unit
    override suspend fun unindentItem(itemId: String) = Unit
    override suspend fun archiveItem(itemId: String) = Unit
    override suspend fun resetCheckedItems(listId: String) = Unit
    override suspend fun clearCheckedItems(listId: String) = Unit
}
