package com.arrow2851.nudge.ui.backup

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.core.backup.LocalBackupService
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class BackupUiState(
    val busy: Boolean = false,
    val message: String? = null,
)

@HiltViewModel
class BackupViewModel @Inject constructor(
    private val backupService: LocalBackupService,
) : ViewModel() {
    private val _uiState = MutableStateFlow(BackupUiState())
    val uiState: StateFlow<BackupUiState> = _uiState.asStateFlow()

    fun exportTo(uri: Uri) {
        viewModelScope.launch {
            _uiState.update { it.copy(busy = true, message = null) }
            runCatching { backupService.exportTo(uri) }
                .onSuccess { summary ->
                    _uiState.update {
                        it.copy(
                            busy = false,
                            message = "Backup saved with ${summary.itemCount} active records.",
                        )
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(busy = false, message = error.message ?: "Backup failed")
                    }
                }
        }
    }

    fun restoreFrom(uri: Uri) {
        viewModelScope.launch {
            _uiState.update { it.copy(busy = true, message = null) }
            runCatching { backupService.restoreFrom(uri) }
                .onSuccess { summary ->
                    _uiState.update {
                        it.copy(
                            busy = false,
                            message = "Restored ${summary.itemCount} active records. Existing matching IDs were updated.",
                        )
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(busy = false, message = error.message ?: "Restore failed")
                    }
                }
        }
    }
}
