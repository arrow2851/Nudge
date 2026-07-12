# Nudge Product Requirements

**Platform:** Android-first  
**Product stage:** Product and UX design  
**Architecture direction:** Local-first

## 1. Product vision

Nudge helps the user turn passive or excessive phone usage into small useful actions. It combines household chores, reusable lists, and one-time tasks in a compact interface that is faster to use than a conventional task manager.

The central experience is:

> You have spent your configured continuous-use limit in a selected app. Nudge redirects you to one relevant pending task that can be started immediately.

## 2. Goals

Nudge should:

- Capture a basic task in under ten seconds.
- Complete a binary task in one primary interaction.
- Organize responsibilities by flexible areas and optional subareas.
- Handle recurring chores and one-time tasks without duplicate clutter.
- Remember reusable list items after they are checked off.
- Recommend tasks based on urgency, time, place, duration, and dismissal history.
- Attempt a direct redirect when a selected app exceeds its configured usage limit.
- Provide a reliable compatibility fallback where Android blocks direct launches.
- Keep all core features usable offline and without an account.
- Make Gemini optional and reviewable.

## 3. Non-goals for the initial version

- Corporate project management
- Social productivity or competitive leaderboards
- Permanent blocking of essential applications
- Mandatory accounts or cloud synchronization
- Household sharing in version one
- Complex AI automation without confirmation

## 4. Core content types

### 4.1 Chores

Recurring or repeatable responsibilities such as taking out trash, cleaning a bathroom, washing a car, or replacing an air filter.

A chore may have:

- Area and optional subarea
- Recurrence
- Due date
- Estimated duration
- Priority
- Preferred time or context
- Optional completion grading
- Nudge eligibility
- Completion history

### 4.2 Reusable lists

Lists such as Groceries, Costco, Travel Packing, or Household Restock. Checked items leave the active list after the session but remain in a remembered catalog.

Remembered-item data may include:

- Display and normalized name
- Last used date
- Usage frequency
- Typical quantity and category
- Favorite status
- Common list or store

Typing suggestions must remain compact and non-obstructive.

### 4.3 One-time tasks

Non-recurring work such as repairing a car, ordering a replacement part, returning a package, or fixing something broken.

Suggested states:

- Inbox
- Planned
- In progress
- Waiting
- Blocked
- Completed
- Cancelled
- Someday

## 5. Location model

Nudge uses a flexible two-level hierarchy:

- **Area:** House, Car, Personal, Work, Outside, Storage
- **Subarea:** Kitchen, Bedroom, Bathroom, Interior, Maintenance

A task may belong to:

- No area
- An area only
- An area and subarea

Subareas are always optional.

## 6. Recurrence

### Presets

- Daily
- Every few days
- Weekly
- Every two weeks
- Monthly
- Quarterly
- Seasonal
- Every six months
- Yearly
- After completion
- When needed
- Custom

### Calendar-based recurrence

The next date stays aligned to the calendar. Example: trash bins every Tuesday.

### Completion-based recurrence

The next date is calculated from the actual completion. Example: replace a filter every 60 days after it is replaced.

Missed recurrences should normally remain a single overdue chore instead of creating many duplicate instances.

## 7. Completion grading

Binary chores are simply complete or incomplete.

Graded chores support:

- **Light:** quick reset or surface work
- **Moderate:** normal thorough completion
- **Deep:** detailed full completion

The MVP stores the selected grade in completion history while retaining one recurrence schedule. Grade-specific schedules may be added later.

## 8. Direct app-usage intervention

The user chooses distracting apps and a continuous-use limit for each.

Example:

- Instagram: 5 minutes
- Reddit: 10 minutes
- YouTube: 15 minutes

When the limit is reached, Nudge should attempt to open its intervention screen directly.

### Intervention hierarchy

1. Directly open Nudge when Android permits.
2. Use an explicitly enabled interruption surface where supported.
3. Use an appropriate heads-up or full-screen intervention where policy-compliant.
4. Fall back to a high-priority notification with immediate actions.

### Intervention actions

- Start Task
- Already Done
- Different Task
- Not Now
- Return to previous app, subject to strictness mode

### Strictness modes

- **Gentle:** immediate return remains available.
- **Balanced:** the user chooses an action before returning. Default.
- **Strict:** repeated bypasses may be delayed or limited, without blocking emergency or essential functionality.

### Session rules

A session begins when a selected app enters the foreground. It resets after the user leaves selected apps longer than a grace period, locks the screen, completes a suggested task, or pauses Nudge.

The user may choose whether selected apps share a combined distraction session.

## 9. Recommendation engine

Eligible items must be incomplete, unblocked, unsnoozed, enabled for nudges, and contextually reasonable.

Conceptual score:

```text
score =
    urgency
  + overdue weight
  + priority
  + duration fit
  + location relevance
  + time-of-day relevance
  + neglected-area bonus
  + quick-win bonus
  - recent-dismissal penalty
  - recent-recommendation penalty
  - context mismatch penalty
```

Controlled randomness among the top few candidates should prevent repetition.

## 10. Quick Add

Quick Add is available from the app, widgets, launcher shortcuts, notifications, intervention screen, voice, and Gemini.

Example input:

```text
Deep clean kitchen monthly
```

Detected chips:

```text
[Chore] [Kitchen] [Monthly] [Deep]
```

Default visible fields:

- Title
- Type
- Area

Expandable fields:

- Subarea
- Due date
- Recurrence
- Duration
- Grade support
- Priority
- Notes
- Reminder
- Context
- Nudge eligibility

## 11. Gemini integration

Gemini translates natural-language requests into validated structured actions.

Supported action concepts:

- Create chore
- Create task
- Create list
- Add list item
- Complete item
- Reschedule item
- Find tasks
- Create area or subarea

Bulk, destructive, recurring-schedule, and multi-item changes require review. Gemini remains optional and the core app must work without it.

## 12. Navigation

Primary bottom navigation:

1. Today
2. Areas
3. Quick Add
4. Lists
5. Tasks

Secondary access through More:

- Gemini
- Search
- History
- Insights
- Templates
- Archived items
- Settings

## 13. Widgets and quick access

Planned widgets:

- Small Quick Add
- Next Task
- Grocery List
- Today
- Pause Interventions

Other access points:

- Launcher shortcuts
- Quick Settings tiles
- Notification actions
- Voice input
- Optional NFC or QR room shortcuts later

## 14. Privacy

Nudge should:

- Store task data locally by default.
- Store only the app identifiers and duration data required for usage interventions.
- Never read messages, typed text, browsing content, or screen contents from monitored apps.
- Allow usage history deletion.
- Keep cloud sync and Gemini optional.
- Avoid selling or advertising against usage data.

## 15. Acceptance criteria

### Entry

- A task can be saved with only a title.
- Common area, cadence, and grade phrases can be inferred.
- Advanced fields are optional.

### Completion

- Binary tasks require one main action.
- Graded chores require at most one additional selection.
- Completion updates Today and widgets immediately.
- Undo is available.

### Reusable lists

- Completed session items leave the active list.
- They remain available as suggestions.
- Suggestions do not block typing.

### Intervention

- Users can choose monitored apps and per-app limits.
- Direct opening is attempted at the limit.
- A fallback is used when direct opening fails.
- Start, Complete, Different, and Postpone actions are available.
- Cooldowns and daily limits prevent excessive interruption.
