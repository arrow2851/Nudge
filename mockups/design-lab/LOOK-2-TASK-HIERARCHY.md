# Look #2 — Warm Editorial Task Hierarchy

**Version:** `0.10.5`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the established simple checklist behavior to Warm Editorial without requiring reflection, journaling, or extra writing beyond the task title.

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

## Warm Editorial presentation

- A calm practical page with restrained serif headings and readable task rows.
- Active, Main Tasks, and Completed summary counts presented as simple page facts.
- Main-task progress described as a count, percentage, and quiet progress line.
- Subtasks use indentation plus a mustard hierarchy rule.
- Settings use plain-language actions and a compact two-column layout.
- Completed tasks remain below active tasks unless hidden.
- Empty-state language remains practical and does not request reflection.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on new task titles.
- One-level main-task and subtask relationships.
- Parent and child completion propagation.
- Disabling main-task mode releases subtasks as regular tasks.
- Pointer drag hooks plus Move Up and Move Down controls.
- Explicit Indent and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists across Looks #2, #3, #4, #5, #6, and #7.

## Tone boundary

- Editorial language adds calm context but does not turn Tasks into a diary.
- Users are not asked to explain, reflect on, or narrate task completion.
- Incomplete work is not framed as a personal shortcoming.
- Completion does not use points, streaks, rewards, or scoring.

## Accessibility and responsive contract

- Critical controls retain at least 48 px dimensions.
- Editing, completion, reordering, options, and subtask creation remain separate targets.
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

Committed-source inspection and validator contracts cover renderer registration, shared actions, stylesheet order, responsive hooks, accessibility fallbacks, and six-Look state preservation. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
