package com.arrow2851.nudge.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.HistoryRepository
import com.arrow2851.nudge.core.model.ItemHistoryEntry
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class HistoryViewModel @Inject constructor(
    private val historyRepository: HistoryRepository,
) : ViewModel() {
    val history: StateFlow<List<ItemHistoryEntry>> = historyRepository.observeHistory().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000L),
        initialValue = emptyList(),
    )

    fun delete(historyId: String) {
        viewModelScope.launch { historyRepository.deleteEntry(historyId) }
    }

    fun clearAll() {
        viewModelScope.launch { historyRepository.clearAll() }
    }
}
