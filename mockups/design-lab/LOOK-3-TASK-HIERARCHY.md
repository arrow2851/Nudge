# Look #3 — Precision Minimal Task Hierarchy

**Version:** `0.10.1`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the established simple checklist behavior to Precision Minimal without changing task semantics or adding product scope.

## Implemented flow

```text
Tasks
→ Add empty task
→ Edit inline
→ Complete or reopen
→ Set as main task
→ Add subtasks
→ Track progress
→ Reorder
→ Indent or unindent
→ Turn off main-task mode and release subtasks
→ Hide or show completed
```

## Precision Minimal presentation

- A compact task register with explicit Active, Main, and Done metrics.
- Fixed operational columns for move, completion, title, optional time, settings, and subtask creation.
- Square completion controls and monospaced metadata.
- Main-task progress shown as count, percentage, and progress track.
- Subtasks use a visible accent rail rather than relying on indentation alone.
- Settings use a compact control grid with explicit task type labels.
- Completed tasks remain visible below active tasks unless hidden.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on a newly created title.
- One-level main-task and subtask relationships.
- Parent/child completion propagation.
- Main-task removal releases subtasks as regular tasks.
- Pointer drag hooks plus Move Up and Move Down controls.
- Explicit Indent and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists while switching between Looks #3 and #4.

## Accessibility and responsive contract

- Completion, settings, add, and fallback movement actions retain at least 48 px height.
- Separate controls prevent opening settings, editing, reordering, and completion from becoming one ambiguous target.
- Large Text removes low-value columns and increases action heights.
- Narrow layouts hide the optional time column before reducing task-title space.
- Completion uses text decoration, a checkmark, and control state rather than color alone.
- Forced Colors uses system colors.
- Reduced Motion removes disclosure transitions.

## Explicit exclusions

- No production persistence, accounts, collaboration, reminders, or notifications.
- No nested subtasks beyond one level.
- No production gesture implementation for swipe indentation.
- No physical-device validation of drag, hold, or swipe behavior yet.
- No deletion workflow in this slice.

## Evidence boundary

Committed-source inspection and validator contracts cover the task route, renderer export, shared actions, stylesheet order, responsive hooks, and accessibility fallbacks. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
