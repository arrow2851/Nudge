# Look #8 — Ambient Glass Task Hierarchy

**Version:** `0.10.6`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the shared simple checklist behavior to Ambient Glass while treating transparency, blur, glow, and atmospheric depth as optional enhancement rather than semantic structure.

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

- Translucent header and summary surfaces with restrained atmospheric depth.
- Mostly solid task rows for reliable reading and lower compositing pressure.
- Separate controls for movement, completion, editing, options, and subtask creation.
- Main-task progress shown as text, percentage, and a blue-to-violet progress track.
- Subtasks use indentation plus a visible gradient hierarchy rail.
- Active, Main Tasks, and Completed counts remain readable without decorative effects.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on new task titles.
- One-level main-task and subtask relationships.
- Parent and child completion propagation.
- Disabling main-task mode releases subtasks as regular tasks.
- Drag hooks plus Move Up, Move Down, Indent, and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists across Looks #2 through #8.

## Transparency and performance boundary

- Blur is limited to high-value surfaces rather than every task row.
- Browsers without backdrop-filter receive solid surfaces.
- Reduced Transparency removes blur and atmospheric decoration.
- Forced Colors removes gradients, transparency, shadows, and decorative aurora.
- Task type, hierarchy, completion, progress, ordering, and controls remain understandable in solid mode.
- Lower-end hardware paint and compositing performance remains unmeasured and is not claimed.

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
- Physical-device gesture and paint-performance testing remain pending.

## Evidence boundary

Committed-source inspection and validator contracts cover renderer registration, shared actions, stylesheet order, responsive behavior, Reduced Transparency, no-backdrop-filter fallback, Forced Colors, Reduced Motion, and seven-Look state preservation. Exact complete-checkout execution, physical Android testing, actual screen-reader testing, and lower-end paint measurements remain pending.
