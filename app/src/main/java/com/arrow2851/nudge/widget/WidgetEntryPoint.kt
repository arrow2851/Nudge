package com.arrow2851.nudge.widget

import com.arrow2851.nudge.core.data.ListWorkflowRepository
import com.arrow2851.nudge.core.data.TaskRepository
import com.arrow2851.nudge.core.data.TaskWorkflowRepository
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent

@EntryPoint
@InstallIn(SingletonComponent::class)
interface WidgetEntryPoint {
    fun taskRepository(): TaskRepository
    fun taskWorkflowRepository(): TaskWorkflowRepository
    fun listWorkflowRepository(): ListWorkflowRepository
}
