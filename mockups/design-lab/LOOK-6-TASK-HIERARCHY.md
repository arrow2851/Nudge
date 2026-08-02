# Look #6 — Tactile Household Task Hierarchy

**Version:** `0.10.4`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the established simple checklist behavior to Tactile Household using physical organization cues without implying that the user, household, or unfinished work is broken.

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

- Paper-like task cards arranged on a household task board.
- Separate physical-looking controls for movement, completion, editing, options, and subtask creation.
- Main-task progress shown as a clipped label, completion statement, percentage, and progress track.
- Subtasks appear inside a labeled drawer with indentation and a blue hierarchy rail.
- Settings use work-card language and explicit movement actions.
- Completed cards remain filed below active cards unless hidden.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on new task titles.
- One-level main-task and subtask relationships.
- Parent and child completion propagation.
- Disabling main-task mode releases subtasks as regular tasks.
- Drag hooks plus Move Up, Move Down, Indent, and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists across Looks #3, #4, #5, #6, and #7.

## Tone boundary

- Cards, drawers, filing, and work-board metaphors organize tasks; they do not describe the household as damaged.
- Active tasks are not repair failures or inspection problems.
- Completion feedback is satisfying but does not use points, streaks, rewards, or scoring.
- Empty and completed states avoid shame-based language.

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

Committed-source inspection and validator contracts cover renderer registration, shared actions, stylesheet order, responsive hooks, accessibility fallbacks, and five-Look state preservation. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
