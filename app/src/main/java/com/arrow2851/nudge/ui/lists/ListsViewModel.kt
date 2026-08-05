package com.arrow2851.nudge.ui.lists

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.model.ItemHandedness
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.TimeProvider
import com.arrow2851.nudge.core.mutation.AppMutationCoordinator
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class ListItemNode(
    val item: ListItem,
    val children: List<ListItem>,
)

data class ListOverviewItem(
    val list: ReusableList,
    val items: List<ListItem>,
) {
    val activeCount: Int
        get() = items.count { !it.isChecked }
    val completedCount: Int
        get() = items.count { it.isChecked }
    val rootNodes: List<ListItemNode>
        get() = items
            .filter { it.parentItemId == null }
            .map { root ->
                ListItemNode(
                    item = root,
                    children = items.filter { it.parentItemId == root.id },
                )
            }
    val activeNodes: List<ListItemNode>
        get() = rootNodes.filter { !it.item.isChecked }
    val completedNodes: List<ListItemNode>
        get() = rootNodes.filter { it.item.isChecked }
}

sealed interface ListsUiState {
    data object Loading : ListsUiState
    data class Ready(
        val lists: List<ListOverviewItem>,
        val hideCompleted: Boolean,
        val handedness: ItemHandedness,
        val recoverableError: String? = null,
    ) : ListsUiState {
        fun list(listId: String): ListOverviewItem? = lists.firstOrNull { it.list.id == listId }
        fun item(itemId: String): ListItem? = lists.firstNotNullOfOrNull { overview ->
            overview.items.firstOrNull { it.id == itemId }
        }
    }
    data class Error(val message: String) : ListsUiState
}

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class ListsViewModel @Inject constructor(
    private val repository: ListWorkflowRepository,
    private val preferencesRepository: PreferencesRepository,
    private val mutationCoordinator: AppMutationCoordinator,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val recoverableError = MutableStateFlow<String?>(null)
    private val suggestionQuery = MutableStateFlow("")

    val uiState: StateFlow<ListsUiState> = combine(
        repository.observeLists(),
        preferencesRepository.preferences,
        recoverableError,
    ) { lists, preferences, error ->
        ListsUiState.Ready(
            lists = lists.map { ListOverviewItem(it.list, it.items) },
            hideCompleted = preferences.hideCompletedItems,
            handedness = preferences.itemHandedness,
            recoverableError = error,
        ) as ListsUiState
    }
        .onStart { emit(ListsUiState.Loading) }
        .catch { throwable ->
            emit(ListsUiState.Error(throwable.message ?: "Lists could not be loaded."))
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000L),
            initialValue = ListsUiState.Loading,
        )

    val suggestions: StateFlow<List<ListCatalogItem>> = suggestionQuery
        .flatMapLatest { query -> repository.observeSuggestions(query) }
        .catch { emit(emptyList()) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000L),
            initialValue = emptyList(),
        )

    fun setSuggestionQuery(value: String) {
        suggestionQuery.value = value
    }

    fun createList(name: String, isReusable: Boolean) {
        mutate {
            repository.createList(name, isReusable)
            mutationCoordinator.showMessage("List added")
        }
    }

    fun updateList(listId: String, name: String, isReusable: Boolean) {
        mutate {
            val current = ready()?.list(listId)?.list ?: return@mutate
            repository.saveList(
                current.copy(
                    name = name.trim(),
                    icon = if (isReusable) "refresh" else "checklist",
                    isReusable = isReusable,
                    updatedAt = timeProvider.nowEpochMillis(),
                ),
            )
            mutationCoordinator.showMessage("List updated")
        }
    }

    fun moveList(listId: String, direction: Int) {
        mutate { repository.moveList(listId, direction) }
    }

    fun reorderList(listId: String, targetListId: String) {
        mutate { repository.reorderList(listId, targetListId) }
    }

    fun archiveList(listId: String) {
        mutate {
            repository.archiveList(listId)
            mutationCoordinator.showMessage("List archived")
        }
    }

    fun addItem(
        listId: String,
        name: String,
        quantity: String? = null,
        parentItemId: String? = null,
        catalogItemId: String? = null,
    ) {
        mutate {
            repository.addItem(listId, name, quantity, parentItemId, catalogItemId)
            mutationCoordinator.showMessage("Item added")
        }
    }

    fun updateItem(itemId: String, name: String, quantity: String?) {
        mutate {
            val current = ready()?.item(itemId) ?: return@mutate
            repository.saveItem(
                current.copy(
                    name = name.trim(),
                    quantity = quantity?.trim()?.ifEmpty { null },
                    updatedAt = timeProvider.nowEpochMillis(),
                ),
            )
        }
    }

    fun toggleItem(itemId: String) {
        mutate {
            val current = ready()?.item(itemId) ?: return@mutate
            val mutation = repository.setItemChecked(itemId, !current.isChecked)
            mutationCoordinator.registerUndo(
                if (current.isChecked) "Item restored" else "Item checked",
            ) {
                repository.undoCheck(mutation)
            }
        }
    }

    fun moveItem(itemId: String, direction: Int) {
        mutate { repository.moveItem(itemId, direction) }
    }

    fun reorderItem(itemId: String, targetItemId: String) {
        mutate { repository.reorderItem(itemId, targetItemId) }
    }

    fun indentItem(itemId: String) {
        mutate { repository.indentItem(itemId) }
    }

    fun unindentItem(itemId: String) {
        mutate { repository.unindentItem(itemId) }
    }

    fun archiveItem(itemId: String) {
        mutate {
            val mutation = repository.archiveItem(itemId)
            mutationCoordinator.registerUndo("Item deleted") {
                repository.undoArchive(mutation)
            }
        }
    }

    fun setHideCompleted(hide: Boolean) {
        mutate { preferencesRepository.setHideCompletedItems(hide) }
    }

    fun dismissRecoverableError() {
        recoverableError.value = null
    }

    private fun ready(): ListsUiState.Ready? = uiState.value as? ListsUiState.Ready

    private fun mutate(block: suspend () -> Unit) {
        viewModelScope.launch {
            mutationCoordinator.beginMutation()
            runCatching { block() }
                .onFailure { throwable ->
                    recoverableError.value = throwable.message ?: "That list change could not be saved."
                }
        }
    }
}
