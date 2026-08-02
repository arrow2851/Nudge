# Look #7 — Bold Utility Task Hierarchy

**Version:** `0.10.3`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the established simple checklist behavior to Bold Utility without adding project-management scope or treating normal unfinished work as failure.

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
→ Release subtasks when main-task mode is removed
→ Hide or show completed
```

## Presentation

- Strong task register with Active, Main, and Done counts.
- Separate controls for movement, completion, editing, settings, and subtask creation.
- Main-task progress shown as a fraction, percentage, and progress bar.
- Subtasks use indentation plus a visible blue hierarchy rail.
- Settings use direct action labels in a high-contrast grid.
- Completed tasks stay visible below active tasks unless hidden.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on new task titles.
- One-level main-task and subtask relationships.
- Parent and child completion propagation.
- Disabling main-task mode releases subtasks as regular tasks.
- Drag hooks plus Move Up, Move Down, Indent, and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists across Looks #3, #4, #5, and #7.

## Tone boundary

- Active tasks are not described as errors or failures.
- Counts describe task state without adding urgency.
- Completion does not use points, streaks, rewards, or scoring.
- Empty and completed states avoid shame-based language.

## Accessibility and responsive contract

- Critical controls retain at least 48 px dimensions.
- Large Text removes the optional time column and increases action heights.
- Narrow layouts remove optional time before reducing title space.
- Completion uses a checkmark and line-through in addition to color.
- Forced Colors uses system colors.
- Reduced Motion removes disclosure transitions.

## Explicit exclusions

- No production persistence, accounts, collaboration, reminders, or notifications.
- No nested subtasks beyond one level.
- No deletion workflow.
- No production swipe implementation.
- Physical-device gesture testing remains pending.

## Evidence boundary

Committed-source inspection and validator contracts cover renderer registration, shared actions, stylesheet order, responsive hooks, accessibility fallbacks, and four-Look state preservation. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
