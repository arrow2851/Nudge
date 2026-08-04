package com.arrow2851.nudge.ui.intervention

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.arrow2851.nudge.InterventionActivity
import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.domain.RecommendationContext
import com.arrow2851.nudge.core.domain.RecommendationReader
import com.arrow2851.nudge.core.intervention.InterventionSettingsRepository
import com.arrow2851.nudge.core.model.CompletionGrade
import com.arrow2851.nudge.core.model.TimeProvider
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class InterventionPromptUiState(
    val sourcePackage: String = "",
    val usageMinutes: Int = 0,
    val recommendationId: String = "",
    val recommendationTitle: String = "Take a small useful action",
    val recommendationKind: String = "Task",
    val estimatedMinutes: Int = 5,
    val score: Int = 0,
    val busy: Boolean = false,
    val completed: Boolean = false,
    val message: String? = null,
)

@HiltViewModel
class InterventionPromptViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val taskRepository: TaskRepository,
    private val choreRepository: ChoreRepository,
    private val settingsRepository: InterventionSettingsRepository,
    private val recommendationReader: RecommendationReader,
    private val timeProvider: TimeProvider,
) : ViewModel() {
    private val _uiState = MutableStateFlow(
        InterventionPromptUiState(
            sourcePackage = savedStateHandle[InterventionActivity.ExtraSourcePackage] ?: "",
            usageMinutes = savedStateHandle[InterventionActivity.ExtraUsageMinutes] ?: 0,
            recommendationId = savedStateHandle[InterventionActivity.ExtraRecommendationId] ?: "",
            recommendationTitle = savedStateHandle[InterventionActivity.ExtraRecommendationTitle]
                ?: "Take a small useful action",
            recommendationKind = savedStateHandle[InterventionActivity.ExtraRecommendationKind]
                ?: "Task",
            estimatedMinutes = savedStateHandle[InterventionActivity.ExtraEstimatedMinutes] ?: 5,
            score = savedStateHandle[InterventionActivity.ExtraScore] ?: 0,
        ),
    )
    val uiState: StateFlow<InterventionPromptUiState> = _uiState.asStateFlow()

    fun complete() {
        val current = _uiState.value
        if (current.recommendationId.isBlank() || current.busy) return
        viewModelScope.launch {
            _uiState.update { it.copy(busy = true, message = null) }
            runCatching {
                if (current.recommendationKind.equals("Chore", ignoreCase = true)) {
                    val chore = choreRepository.observeChore(current.recommendationId).first()
                        ?: error("Chore is no longer available")
                    val grade = when {
                        !chore.chore.supportsGrading -> CompletionGrade.None
                        chore.chore.defaultGrade != CompletionGrade.None -> chore.chore.defaultGrade
                        else -> CompletionGrade.Moderate
                    }
                    choreRepository.completeChore(current.recommendationId, grade)
                } else {
                    taskRepository.setCompleted(
                        current.recommendationId,
                        timeProvider.nowEpochMillis(),
                    )
                }
            }.onSuccess {
                _uiState.update {
                    it.copy(busy = false, completed = true, message = "Marked complete")
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(busy = false, message = error.message ?: "Could not complete item")
                }
            }
        }
    }

    fun different() {
        val current = _uiState.value
        if (current.busy) return
        viewModelScope.launch {
            _uiState.update { it.copy(busy = true, message = null) }
            runCatching {
                if (current.recommendationId.isNotBlank()) {
                    settingsRepository.recordDismissal(current.recommendationId)
                }
                val settings = settingsRepository.settings.first()
                val runtime = settingsRepository.runtime.first()
                val recommendation = recommendationReader.select(
                    RecommendationContext(
                        now = timeProvider.nowEpochMillis(),
                        maximumMinutes = settings.maximumTaskMinutes,
                        recentSuggestionIds = runtime.recentSuggestionIds.toSet() +
                            current.recommendationId,
                        dismissalCounts = runtime.dismissalCounts,
                    ),
                )
                recommendation to settings.maximumTaskMinutes
            }.onSuccess { (recommendation, fallbackMinutes) ->
                if (recommendation == null) {
                    _uiState.update {
                        it.copy(busy = false, message = "No other eligible action right now")
                    }
                } else {
                    _uiState.update {
                        it.copy(
                            busy = false,
                            recommendationId = recommendation.candidate.id,
                            recommendationTitle = recommendation.candidate.title,
                            recommendationKind = recommendation.candidate.kind.name,
                            estimatedMinutes = recommendation.candidate.estimatedMinutes
                                ?: fallbackMinutes,
                            score = recommendation.score.total,
                            message = null,
                        )
                    }
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(busy = false, message = error.message ?: "Could not find another action")
                }
            }
        }
    }

    fun dismiss() {
        val id = _uiState.value.recommendationId
        if (id.isBlank()) return
        viewModelScope.launch { settingsRepository.recordDismissal(id) }
    }
}
