package com.arrow2851.nudge.core.data

import com.arrow2851.nudge.core.database.AreaEntity
import com.arrow2851.nudge.core.database.AreaWithSectionsEntity
import com.arrow2851.nudge.core.database.ChoreEntity
import com.arrow2851.nudge.core.database.ChoreScheduleEntity
import com.arrow2851.nudge.core.database.ChoreWithScheduleEntity
import com.arrow2851.nudge.core.database.CompletionEntity
import com.arrow2851.nudge.core.database.ListCatalogItemEntity
import com.arrow2851.nudge.core.database.ListItemEntity
import com.arrow2851.nudge.core.database.ReusableListEntity
import com.arrow2851.nudge.core.database.ReusableListWithItemsEntity
import com.arrow2851.nudge.core.database.SectionEntity
import com.arrow2851.nudge.core.database.TaskEntity
import com.arrow2851.nudge.core.model.Area
import com.arrow2851.nudge.core.model.AreaWithSections
import com.arrow2851.nudge.core.model.Chore
import com.arrow2851.nudge.core.model.ChoreSchedule
import com.arrow2851.nudge.core.model.ChoreWithSchedule
import com.arrow2851.nudge.core.model.Completion
import com.arrow2851.nudge.core.model.ListCatalogItem
import com.arrow2851.nudge.core.model.ListItem
import com.arrow2851.nudge.core.model.ReusableList
import com.arrow2851.nudge.core.model.ReusableListWithItems
import com.arrow2851.nudge.core.model.Section
import com.arrow2851.nudge.core.model.Task

internal fun Area.toEntity() = AreaEntity(
    id = id,
    name = name,
    icon = icon,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun AreaEntity.toDomain() = Area(
    id = id,
    name = name,
    icon = icon,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun Section.toEntity() = SectionEntity(
    id = id,
    areaId = areaId,
    name = name,
    icon = icon,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun SectionEntity.toDomain() = Section(
    id = id,
    areaId = areaId,
    name = name,
    icon = icon,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun AreaWithSectionsEntity.toDomain() = AreaWithSections(
    area = area.toDomain(),
    sections = sections
        .filter { it.archivedAt == null }
        .sortedBy(SectionEntity::sortOrder)
        .map(SectionEntity::toDomain),
)

internal fun Task.toEntity() = TaskEntity(
    id = id,
    title = title,
    description = description,
    parentTaskId = parentTaskId,
    areaId = areaId,
    sectionId = sectionId,
    status = status,
    priority = priority,
    estimatedMinutes = estimatedMinutes,
    dueAt = dueAt,
    includeInNudges = includeInNudges,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    completedAt = completedAt,
    archivedAt = archivedAt,
)

internal fun TaskEntity.toDomain() = Task(
    id = id,
    title = title,
    description = description,
    parentTaskId = parentTaskId,
    areaId = areaId,
    sectionId = sectionId,
    status = status,
    priority = priority,
    estimatedMinutes = estimatedMinutes,
    dueAt = dueAt,
    includeInNudges = includeInNudges,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    completedAt = completedAt,
    archivedAt = archivedAt,
)

internal fun Chore.toEntity() = ChoreEntity(
    id = id,
    title = title,
    description = description,
    areaId = areaId,
    sectionId = sectionId,
    priority = priority,
    estimatedMinutes = estimatedMinutes,
    includeInNudges = includeInNudges,
    supportsGrading = supportsGrading,
    defaultGrade = defaultGrade,
    nextDueAt = nextDueAt,
    isPaused = isPaused,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun ChoreEntity.toDomain() = Chore(
    id = id,
    title = title,
    description = description,
    areaId = areaId,
    sectionId = sectionId,
    priority = priority,
    estimatedMinutes = estimatedMinutes,
    includeInNudges = includeInNudges,
    supportsGrading = supportsGrading,
    defaultGrade = defaultGrade,
    nextDueAt = nextDueAt,
    isPaused = isPaused,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun ChoreSchedule.toEntity() = ChoreScheduleEntity(
    choreId = choreId,
    recurrenceType = recurrenceType,
    intervalValue = intervalValue,
    intervalUnit = intervalUnit,
    daysOfWeek = daysOfWeek,
    dayOfMonth = dayOfMonth,
    scheduleBasis = scheduleBasis,
)

internal fun ChoreScheduleEntity.toDomain() = ChoreSchedule(
    choreId = choreId,
    recurrenceType = recurrenceType,
    intervalValue = intervalValue,
    intervalUnit = intervalUnit,
    daysOfWeek = daysOfWeek,
    dayOfMonth = dayOfMonth,
    scheduleBasis = scheduleBasis,
)

internal fun ChoreWithScheduleEntity.toDomain() = ChoreWithSchedule(
    chore = chore.toDomain(),
    schedule = schedule?.toDomain(),
)

internal fun Completion.toEntity() = CompletionEntity(
    id = id,
    taskId = taskId,
    choreId = choreId,
    completedAt = completedAt,
    grade = grade,
    durationMinutes = durationMinutes,
    note = note,
    source = source,
)

internal fun CompletionEntity.toDomain() = Completion(
    id = id,
    taskId = taskId,
    choreId = choreId,
    completedAt = completedAt,
    grade = grade,
    durationMinutes = durationMinutes,
    note = note,
    source = source,
)

internal fun ReusableList.toEntity() = ReusableListEntity(
    id = id,
    name = name,
    icon = icon,
    isReusable = isReusable,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun ReusableListEntity.toDomain() = ReusableList(
    id = id,
    name = name,
    icon = icon,
    isReusable = isReusable,
    sortOrder = sortOrder,
    createdAt = createdAt,
    updatedAt = updatedAt,
    archivedAt = archivedAt,
)

internal fun ListItem.toEntity() = ListItemEntity(
    id = id,
    listId = listId,
    parentItemId = parentItemId,
    catalogItemId = catalogItemId,
    name = name,
    quantity = quantity,
    isChecked = isChecked,
    sortOrder = sortOrder,
    addedAt = addedAt,
    updatedAt = updatedAt,
    checkedAt = checkedAt,
    archivedAt = archivedAt,
)

internal fun ListItemEntity.toDomain() = ListItem(
    id = id,
    listId = listId,
    parentItemId = parentItemId,
    catalogItemId = catalogItemId,
    name = name,
    quantity = quantity,
    isChecked = isChecked,
    sortOrder = sortOrder,
    addedAt = addedAt,
    updatedAt = updatedAt,
    checkedAt = checkedAt,
    archivedAt = archivedAt,
)

internal fun ListCatalogItem.toEntity() = ListCatalogItemEntity(
    id = id,
    normalizedName = normalizedName,
    displayName = displayName,
    category = category,
    defaultQuantity = defaultQuantity,
    timesUsed = timesUsed,
    lastUsedAt = lastUsedAt,
    favorite = favorite,
)

internal fun ListCatalogItemEntity.toDomain() = ListCatalogItem(
    id = id,
    normalizedName = normalizedName,
    displayName = displayName,
    category = category,
    defaultQuantity = defaultQuantity,
    timesUsed = timesUsed,
    lastUsedAt = lastUsedAt,
    favorite = favorite,
)

internal fun ReusableListWithItemsEntity.toDomain() = ReusableListWithItems(
    list = list.toDomain(),
    items = items
        .filter { it.archivedAt == null }
        .sortedWith(compareBy<ListItemEntity>({ it.isChecked }, { it.sortOrder }))
        .map(ListItemEntity::toDomain),
)
