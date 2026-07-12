# Technical Architecture

## 1. Platform and stack

- Native Android
- Kotlin
- Jetpack Compose
- Material 3
- Navigation Compose
- Room
- DataStore
- WorkManager
- Hilt
- Kotlin Serialization
- Jetpack Glance
- Retrofit or Ktor Client
- Optional secure Gemini backend

## 2. Architectural approach

```text
┌────────────────────────────────────────────┐
│ UI Layer                                   │
│ Compose screens, widgets, notifications,   │
│ intervention UI, Quick Add, voice          │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│ Presentation Layer                         │
│ ViewModels, navigation, UI/form state,     │
│ intervention state                         │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│ Domain Layer                               │
│ Recommendation, recurrence, completion,    │
│ session timing, intervention coordination, │
│ list suggestions, command validation       │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────▼─────────────────────┐
│ Data Layer                                 │
│ Repositories, Room, DataStore, usage data, │
│ Gemini gateway, backup/sync adapter        │
└───────────────┬──────────────────┬─────────┘
                │                  │
┌───────────────▼────────┐ ┌───────▼────────┐
│ Android components    │ │ External        │
│ UsageStatsManager     │ │ Gemini API      │
│ WorkManager           │ │ Optional sync   │
│ Notifications         │ │ Optional backup │
│ Glance widgets        │ │                 │
└───────────────────────┘ └────────────────┘
```

## 3. Suggested modules

```text
app
core-model
core-domain
core-database
core-data
core-ui
core-notifications
core-usage-monitor
core-widgets
feature-today
feature-areas
feature-tasks
feature-chores
feature-lists
feature-quick-add
feature-intervention
feature-gemini
feature-settings
feature-insights
```

A single application module may be used during the prototype, followed by incremental modularization.

## 4. Local-first data model

### Area

```text
id
name
icon
sort_order
is_archived
created_at
updated_at
```

### Subarea

```text
id
area_id
name
icon
sort_order
is_archived
created_at
updated_at
```

### Item

```text
id
type: CHORE | TASK
title
description
area_id
subarea_id
status
priority
estimated_minutes
due_at
include_in_nudges
created_at
updated_at
completed_at
archived_at
```

### ChoreSchedule

```text
item_id
recurrence_type
interval_value
interval_unit
days_of_week
day_of_month
schedule_basis: CALENDAR | COMPLETION
next_due_at
supports_grading
default_grade
```

### Completion

```text
id
item_id
completed_at
grade: NONE | LIGHT | MODERATE | DEEP
duration_minutes
note
source: APP | WIDGET | INTERVENTION | NOTIFICATION | GEMINI
```

### ReusableList

```text
id
name
icon
is_reusable
sort_order
created_at
updated_at
archived_at
```

### ListCatalogItem

```text
id
normalized_name
display_name
category
default_quantity
times_used
last_used_at
favorite
```

### ListEntry

```text
id
list_id
catalog_item_id
custom_name
quantity
is_checked
added_at
checked_at
sort_order
```

### NudgeRule

```text
id
package_name
trigger_minutes
cooldown_minutes
daily_limit
strictness
enabled
```

### UsageSession

```text
id
package_name
started_at
last_seen_at
ended_at
duration_seconds
triggered
```

### NudgeEvent

```text
id
package_name
usage_session_id
triggered_at
recommended_item_id
intervention_method
response
responded_at
```

### Snooze

```text
id
item_id
until_at
reason
```

### ContextTag and cross-reference

```text
ContextTag(id, name, icon)
ItemContextCrossRef(item_id, context_tag_id)
```

## 5. Direct intervention architecture

The Intervention Coordinator:

1. Confirms the selected app and session duration.
2. Checks quiet hours, cooldowns, and daily limits.
3. Resolves current context.
4. Selects a recommended task.
5. Records the intervention attempt.
6. Attempts direct navigation.
7. Uses the best available fallback when blocked.

```kotlin
suspend fun handleUsageLimitReached(
    packageName: String,
    sessionDuration: Duration
) {
    if (!rulesRepository.isSelectedApp(packageName)) return
    if (quietHoursManager.isQuietTime()) return
    if (cooldownManager.isCoolingDown(packageName)) return
    if (dailyLimitManager.hasReachedLimit()) return

    val context = contextResolver.resolve(packageName)
    val task = recommendationEngine.selectTask(context) ?: return

    nudgeRepository.recordTriggered(
        packageName = packageName,
        taskId = task.id,
        sessionDuration = sessionDuration
    )

    val result = interventionLauncher.tryOpenDirectly(task)
    if (!result.wasSuccessful) {
        fallbackInterventionLauncher.show(task)
    }
}
```

Possible results:

```kotlin
sealed interface InterventionResult {
    data object OpenedDirectly : InterventionResult
    data object OverlayDisplayed : InterventionResult
    data object NotificationDisplayed : InterventionResult
    data class Failed(val reason: String) : InterventionResult
}
```

## 6. Recommendation engine

```kotlin
fun selectNudgeTask(
    context: RecommendationContext,
    candidates: List<Task>
): Task? {
    val eligible = candidates.filter { task ->
        !task.isCompleted &&
        !task.isArchived &&
        !task.isBlocked &&
        !task.isSnoozed &&
        task.includeInNudges &&
        task.estimatedMinutes <= context.maximumMinutes &&
        contextMatcher.matches(task, context)
    }

    val scored = eligible.map { task ->
        ScoredTask(
            task = task,
            score = urgencyScore(task) +
                overdueScore(task) +
                priorityScore(task) +
                durationFitScore(task, context) +
                locationScore(task, context) +
                timeOfDayScore(task, context) +
                neglectedAreaScore(task) +
                quickWinScore(task) -
                recentSuggestionPenalty(task) -
                dismissalPenalty(task)
        )
    }

    return weightedRandomFromTop(
        scored.sortedByDescending { it.score }.take(3)
    )
}
```

## 7. Background work

WorkManager responsibilities may include:

- Due-date refresh
- Reminder scheduling
- Database cleanup
- Backup
- Deferred sync
- Widget refresh

Usage monitoring and direct-intervention behavior require careful testing against modern Android background restrictions and manufacturer battery policies.

## 8. Gemini backend

The production Android application should not permanently embed a private model API credential.

A small backend should:

- Authenticate requests
- Apply rate limits
- Call Gemini
- Validate tool/function responses
- Return proposed actions
- Avoid retaining unnecessary content

Possible implementations:

- Cloud Run + FastAPI
- Cloud Run + Ktor
- Firebase Cloud Functions

## 9. Testing

### Unit

- Recurrence calculations
- Recommendation scoring
- Usage-session timing
- Cooldowns and daily limits
- Grade persistence
- List suggestions
- Duplicate handling
- Gemini action validation

### Integration

- Room repositories
- WorkManager
- Widget refresh
- Notification actions
- Intervention coordinator
- Permission-state changes

### Device matrix

- Pixel
- Samsung Galaxy
- OnePlus
- Motorola
- Multiple supported Android versions
- Battery-optimization configurations

Direct-intervention success and fallback behavior must be recorded per tested device.
