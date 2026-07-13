# Task and Chore Detail Milestone

## Status legend

- `[x]` Complete in the browser prototype
- `[~]` Partially complete
- `[ ]` Pending
- `[s]` Simulated until Android

## Current product split

One-time Tasks and recurring Chores intentionally use different levels of detail:

- One-time Tasks are lightweight checklist items.
- Chores retain richer scheduling, recurrence, grading, snooze, skip, and pause controls.

## One-time Task detail

- `[x]` Task detail route: `#/item/:taskId`
- `[x]` Lightweight title and status summary
- `[x]` Due-date summary
- `[x]` Regular, Main Task, or Subtask placement summary
- `[x]` Complete and reopen actions
- `[x]` Return to the Tasks checklist
- `[x]` Remove workflow status and priority management from Task detail
- `[x]` Preserve an undated task as undated when it is reopened
- `[ ]` Decide whether the standalone Task detail route is still necessary long term

Task naming, ordering, Main Task behavior, subtasks, and due-date changes are managed from the Tasks checklist.

## Chore detail

- `[x]` Chore detail route
- `[x]` Detail header and due status
- `[x]` Location and estimate
- `[x]` Due date, recurrence, schedule basis, next due, completion style, and notes
- `[x]` Edit chore title
- `[x]` Edit estimated duration
- `[x]` Edit recurrence preset
- `[x]` Edit notes
- `[x]` Toggle Nudge eligibility
- `[x]` Binary completion
- `[x]` Light, Moderate, and Deep completion
- `[x]` Recurrence-aware completion for daily, weekly, monthly, and every-N-days chores
- `[x]` Recurring chores advance to a future due date
- `[x]` Snooze to later today, tomorrow, this weekend, or next week
- `[x]` Reschedule using a date picker
- `[x]` Skip one recurring occurrence
- `[x]` Pause recurring chore
- `[x]` Resume recurring chore
- `[x]` Reopen a completed chore
- `[x]` Undo for supported changes
- `[x]` Today and Area/Section rows open detail
- `[x]` Section Reset uses the same recurrence-aware completion logic

## Current prototype limitations

- `[~]` Recurrence presets are intentionally limited
- `[~]` Monthly recurrence currently advances by 30 days in the prototype
- `[~]` Calendar-based versus completion-based scheduling is displayed but not fully configurable
- `[~]` Snooze labels use simplified prototype dates
- `[ ]` Move chores between Areas or Sections from detail
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

1. Open Today and tap a one-time Task.
2. Confirm the Task detail is lightweight and links to the checklist.
3. Complete and reopen an undated Task; confirm it remains undated.
4. Open `#/item/mirror` and record a graded Chore completion.
5. Confirm the weekly Chore advances instead of disappearing permanently.
6. Use Undo.
7. Snooze and reschedule a Chore.
8. Pause, resume, and skip a recurring Chore.
9. Edit Chore title, duration, recurrence, notes, and Nudge eligibility.
10. Run Section Reset and confirm recurring Chores advance correctly.

## Recommended next batch

After enough review of the simplified Tasks checklist, proceed to reusable Lists:

- Lists collection
- Dedicated list creation
- Reusable List detail
- Remembered suggestions
- Quantities and categories
- Duplicate handling
- Shopping/list session
