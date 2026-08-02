# Look #9 — Retro Digital Task Hierarchy

**Version:** `0.10.7`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Complete the Task hierarchy sequence by applying the established simple checklist behavior to Retro Digital without turning normal unfinished work into system errors, faults, or failures.

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

## Retro Digital presentation

- A task directory with neutral Available, Main Tasks, and Complete counters.
- Monospaced task entries with explicit move, state, title, optional time, options, and subtask columns.
- Main-task progress shown as a numeric fraction, percentage, and segmented progress track.
- Subtasks use indentation plus a segmented green directory rail.
- Options use a compact directory of explicit actions.
- Completed entries remain below available entries unless hidden.
- Empty and all-clear states describe available actions rather than system health or user performance.

## Shared behavior preserved

- Scenario-isolated session state.
- Top and bottom empty-task creation.
- Immediate focus on newly created task titles.
- One-level main-task and subtask relationships.
- Parent and child completion propagation.
- Disabling main-task mode releases subtasks as regular tasks.
- Pointer drag hooks plus Move Up and Move Down controls.
- Explicit Indent and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists while switching among all eight active Looks.

## Language boundary

- Regular unfinished work is described as available, active, or incomplete—not error, fault, failure, malfunction, or repair.
- The user is offered actions rather than instructed to fix the system.
- Completion is recorded without points, streaks, rankings, rewards, or performance scoring.
- System styling is presentation only; it does not change task priority or meaning.

## Accessibility and responsive contract

- Critical controls retain at least 48 px dimensions.
- Editing, completion, reordering, options, and subtask creation remain separate targets.
- Large Text removes low-value columns and increases key action heights.
- Narrow layouts remove the optional time column before reducing title space.
- Completion uses `[✓]`, line-through, and accessible labels rather than color alone.
- Increased Contrast strengthens borders and rails.
- Forced Colors uses system colors.
- Reduced Motion removes disclosure transitions.

## Explicit exclusions

- No production persistence, accounts, collaboration, reminders, or notifications.
- No nested subtasks beyond one level.
- No deletion workflow.
- No production swipe implementation.
- No physical-device validation of drag, hold, or swipe behavior yet.

## Evidence boundary

Committed-source inspection and validator contracts cover the task route, renderer export, all-Look state registration, action hooks, stylesheet order, responsive behavior, increased contrast, Forced Colors, and Reduced Motion. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
