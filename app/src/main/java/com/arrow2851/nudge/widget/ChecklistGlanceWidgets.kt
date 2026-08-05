package com.arrow2851.nudge.widget

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.Button
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.ActionParameters
import androidx.glance.action.actionParametersOf
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import com.arrow2851.nudge.MainActivity
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.Task
import dagger.hilt.android.EntryPointAccessors
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext

private val WidgetBackground = ColorProvider(Color(0xFFFFF8F3))
private val WidgetText = ColorProvider(Color(0xFF27211E))
private val WidgetMuted = ColorProvider(Color(0xFF6D625C))
private val WidgetAccent = ColorProvider(Color(0xFF7B4D36))

private val TaskIdKey = ActionParameters.Key<String>("task_id")
private val ListIdKey = ActionParameters.Key<String>("list_id")
private val ListItemIdKey = ActionParameters.Key<String>("list_item_id")

class TasksChecklistWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val entryPoint = widgetEntryPoint(context)
        val tasks = withContext(Dispatchers.IO) {
            entryPoint.taskRepository()
                .observeTaskNodes()
                .first()
                .map { it.task }
                .filter { it.completedAt == null }
                .take(6)
        }
        provideContent {
            ChecklistWidgetFrame(
                title = "Tasks",
                subtitle = if (tasks.isEmpty()) "Nothing active" else "${tasks.size} quick items",
                openIntent = destinationIntent(context, "nudge://tasks"),
                addIntent = destinationIntent(context, "nudge://quick-add"),
            ) {
                tasks.forEach { task -> TaskWidgetRow(task) }
            }
        }
    }
}

class TasksChecklistWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = TasksChecklistWidget()
}

class ReusableListChecklistWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val entryPoint = widgetEntryPoint(context)
        val list = withContext(Dispatchers.IO) {
            val lists = entryPoint.listWorkflowRepository().observeLists().first()
            lists.firstOrNull { it.list.isReusable } ?: lists.firstOrNull()
        }
        provideContent {
            val listId = list?.list?.id
            ChecklistWidgetFrame(
                title = list?.list?.name ?: "Reusable List",
                subtitle = if (list == null) {
                    "Create a list in Nudge"
                } else {
                    "${list.items.count { !it.isChecked }} active · ${list.items.count { it.isChecked }} checked"
                },
                openIntent = destinationIntent(
                    context,
                    listId?.let { "nudge://list/$it" } ?: "nudge://lists",
                ),
                addIntent = destinationIntent(
                    context,
                    listId?.let { "nudge://list/$it" } ?: "nudge://lists",
                ),
            ) {
                list?.items
                    ?.filter { it.parentItemId == null }
                    ?.sortedWith(compareBy<ListItem>({ it.isChecked }, { it.sortOrder }))
                    ?.take(6)
                    ?.forEach { item -> ListWidgetRow(item) }
            }
        }
    }
}

class ReusableListChecklistWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = ReusableListChecklistWidget()
}

@Composable
private fun ChecklistWidgetFrame(
    title: String,
    subtitle: String,
    openIntent: Intent,
    addIntent: Intent,
    content: @Composable () -> Unit,
) {
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(WidgetBackground)
            .padding(14.dp),
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxWidth()
                .clickable(actionStartActivity(openIntent)),
        ) {
            Text(
                text = title,
                style = TextStyle(
                    color = WidgetText,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                ),
            )
            Text(
                text = subtitle,
                style = TextStyle(color = WidgetMuted, fontSize = 12.sp),
            )
        }
        Spacer(GlanceModifier.height(6.dp))
        Button(
            text = "+ Add",
            onClick = actionStartActivity(addIntent),
        )
        Spacer(GlanceModifier.height(8.dp))
        content()
    }
}

@Composable
private fun TaskWidgetRow(task: Task) {
    Row(
        modifier = GlanceModifier
            .fillMaxWidth()
            .padding(top = 5.dp, bottom = 5.dp)
            .clickable(
                actionRunCallback<ToggleTaskWidgetAction>(
                    actionParametersOf(TaskIdKey to task.id),
                ),
            ),
    ) {
        Text(
            text = "○",
            style = TextStyle(color = WidgetAccent, fontSize = 18.sp),
        )
        Spacer(GlanceModifier.width(8.dp))
        Text(
            text = task.title.ifBlank { "New task" },
            style = TextStyle(color = WidgetText, fontSize = 14.sp),
        )
    }
}

@Composable
private fun ListWidgetRow(item: ListItem) {
    Row(
        modifier = GlanceModifier
            .fillMaxWidth()
            .padding(top = 5.dp, bottom = 5.dp)
            .clickable(
                actionRunCallback<ToggleListItemWidgetAction>(
                    actionParametersOf(
                        ListIdKey to item.listId,
                        ListItemIdKey to item.id,
                    ),
                ),
            ),
    ) {
        Text(
            text = if (item.isChecked) "✓" else "○",
            style = TextStyle(
                color = if (item.isChecked) WidgetMuted else WidgetAccent,
                fontSize = 18.sp,
            ),
        )
        Spacer(GlanceModifier.width(8.dp))
        Column {
            Text(
                text = item.name,
                style = TextStyle(
                    color = if (item.isChecked) WidgetMuted else WidgetText,
                    fontSize = 14.sp,
                ),
            )
            item.quantity?.let {
                Text(
                    text = it,
                    style = TextStyle(color = WidgetMuted, fontSize = 11.sp),
                )
            }
        }
    }
}

class ToggleTaskWidgetAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters,
    ) {
        val taskId = parameters[TaskIdKey] ?: return
        widgetEntryPoint(context).taskWorkflowRepository().toggleCompletion(taskId)
        TasksChecklistWidget().update(context, glanceId)
    }
}

class ToggleListItemWidgetAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters,
    ) {
        val listId = parameters[ListIdKey] ?: return
        val itemId = parameters[ListItemIdKey] ?: return
        val repository = widgetEntryPoint(context).listWorkflowRepository()
        val item = repository.observeList(listId).first()?.items?.firstOrNull { it.id == itemId }
            ?: return
        repository.setItemChecked(itemId, !item.isChecked)
        ReusableListChecklistWidget().update(context, glanceId)
    }
}

private fun widgetEntryPoint(context: Context): WidgetEntryPoint =
    EntryPointAccessors.fromApplication(
        context.applicationContext,
        WidgetEntryPoint::class.java,
    )

private fun destinationIntent(context: Context, uri: String): Intent =
    Intent(context, MainActivity::class.java).apply {
        data = Uri.parse(uri)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
