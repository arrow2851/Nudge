package com.arrow2851.nudge.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.data.PreferencesRepository
import com.arrow2851.nudge.core.model.AppPreferences
import com.arrow2851.nudge.core.model.ItemHandedness
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val preferencesRepository: PreferencesRepository,
) : ViewModel() {
    val preferences: StateFlow<AppPreferences> = preferencesRepository.preferences.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000L),
        initialValue = AppPreferences(),
    )

    fun setHandedness(value: ItemHandedness) {
        viewModelScope.launch { preferencesRepository.setItemHandedness(value) }
    }

    fun setHideCompleted(value: Boolean) {
        viewModelScope.launch { preferencesRepository.setHideCompletedItems(value) }
    }

    fun setShowDueShorthand(value: Boolean) {
        viewModelScope.launch { preferencesRepository.setShowDueShorthand(value) }
    }

    fun setDailyProgress(value: Boolean) {
        viewModelScope.launch { preferencesRepository.setDailyProgressEnabled(value) }
    }

    fun setQuickWin(value: Boolean) {
        viewModelScope.launch { preferencesRepository.setQuickWinEnabled(value) }
    }
}
