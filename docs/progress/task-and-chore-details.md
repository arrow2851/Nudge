# Task and Chore Detail Milestone

## Status legend

- `[x]` Complete in the browser prototype
- `[~]` Partially complete
- `[ ]` Pending
- `[s]` Simulated until Android

## Completed in this batch

- `[x]` Task detail route: `#/item/:taskId`
- `[x]` Chore detail route
- `[x]` Deep links for sample task and chore
- `[x]` Detail header with item type and status
- `[x]` Location, estimate, due, recurrence, schedule basis, next due, completion style, and notes
- `[x]` Edit task or chore title
- `[x]` Edit estimated duration
- `[x]` Edit recurrence preset
- `[x]` Edit notes
- `[x]` Toggle Nudge eligibility
- `[x]` Binary completion
- `[x]` Light, Moderate, and Deep completion
- `[x]` Recurrence-aware completion for daily, weekly, monthly, and every-N-days chores
- `[x]` One-time tasks remain completed
- `[x]` Recurring chores advance to a future due date
- `[x]` Snooze to later today, tomorrow, this weekend, or next week
- `[x]` Reschedule using a date picker
- `[x]` Skip one recurring occurrence
- `[x]` Pause recurring chore
- `[x]` Resume recurring chore
- `[x]` Reopen a completed task
- `[x]` Undo for task-management changes
- `[x]` Today task rows open details
- `[x]` Area and Section task rows open details
- `[x]` Section Reset uses the same recurrence-aware completion logic

## Current prototype limitations

- `[~]` Recurrence presets are intentionally limited
- `[~]` Monthly recurrence currently advances by 30 days in the prototype
- `[~]` Calendar-based versus completion-based scheduling is displayed but not fully configurable
- `[~]` Snooze labels use simplified prototype dates
- `[ ]` Move item between Areas or Sections
- `[ ]` Change item type between Task and Chore
- `[ ]` Priority
- `[ ]` Waiting status
- `[ ]` Blocked status
- `[ ]` Reminder time
- `[ ]` Attachments
- `[ ]` Full completion-history timeline
- `[ ]` Archive
- `[ ]` Delete
- `[ ]` Duplicate
- `[ ]` Destructive confirmation dialogs
- `[ ]` Advanced recurrence builder
- `[ ]` True calendar-month calculations
- `[ ]` Missed-occurrence policy
- `[ ]` Seasonal recurrence

## Review targets

Test these flows after deployment:

1. Open Today and tap a task row.
2. Open `#/item/mirror` and record a graded completion.
3. Confirm the weekly chore advances instead of disappearing permanently.
4. Use Undo.
5. Snooze a task.
6. Reschedule a task with the date picker.
7. Pause and resume a recurring chore.
8. Skip an occurrence.
9. Edit title, duration, recurrence, notes, and Nudge eligibility.
10. Open House > Kitchen Section and confirm item rows navigate to details.
11. Run Section Reset and confirm recurring chores advance correctly.

## Recommended next batch

The next batch should implement the full Tasks destination:

- Inbox
- Today
- Upcoming
- Waiting
- Blocked
- Completed
- Filters
- Sorting
- Grouping
- Task-detail integration
- Task-specific creation flow
- Empty states
