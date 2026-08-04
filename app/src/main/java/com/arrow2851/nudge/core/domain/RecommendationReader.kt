package com.arrow2851.nudge.core.domain

import com.arrow2851.nudge.core.data.ChoreRepository
import com.arrow2851.nudge.core.data.TaskRepository
import javax.inject.Inject
import kotlinx.coroutines.flow.first

class RecommendationReader @Inject constructor(
    private val taskRepository: TaskRepository,
    private val choreRepository: ChoreRepository,
    private val recommendationEngine: DefaultRecommendationEngine,
) {
    suspend fun rank(
        context: RecommendationContext,
        limit: Int = 3,
    ): List<ScoredRecommendation> {
        val taskCandidates = taskRepository.observeTaskNodes()
            .first()
            .flatMap { node -> listOf(node.task) + node.subtasks }
            .map { it.toRecommendationCandidate() }
        val choreCandidates = choreRepository.observeChoresWithSchedules()
            .first()
            .map { it.toRecommendationCandidate() }
        return recommendationEngine.rank(
            context = context,
            candidates = taskCandidates + choreCandidates,
            limit = limit,
        )
    }

    suspend fun select(context: RecommendationContext): ScoredRecommendation? =
        rank(context = context, limit = 1).firstOrNull()
}
