# Look #5 — Playful Modular Task Hierarchy

**Version:** `0.10.2`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `task-state.js`

## Purpose

Apply the approved simple checklist contract to Playful Modular without introducing gamification, priorities, or deeper project-management behavior.

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

## Playful Modular presentation

- Task groups appear as colorful modular cards.
- Active, Main, and Done counts use three clearly labeled summary blocks.
- Main-task progress uses friendly “little steps” language with a visible progress track.
- Subtasks use indentation plus a coral rail so hierarchy is not communicated by spacing alone.
- Completion uses a checkmark, line-through, and mint-filled control.
- Settings remain compact but use approachable labels and a visible options block.
- Empty and all-clear states stay positive without implying that productivity is a game or score.

## Shared behavior preserved

- Scenario-isolated task state.
- Top and bottom empty-task creation.
- Immediate focus on newly created titles.
- Separate reorder, completion, editing, settings, and subtask controls.
- One-level main-task and subtask hierarchy.
- Parent/child completion propagation.
- Main-task removal releases subtasks as regular tasks.
- Pointer drag plus explicit Move Up and Move Down controls.
- Explicit Indent and Unindent controls.
- Completed-item grouping and hide/show behavior.
- State persists while switching among Looks #3, #4, and #5.

## Tone boundary

Friendly shapes, color, and language may reduce friction, but routine backlog must not become points, streaks, rewards, penalties, or a judgment of the user. Counts describe the list; they do not score performance.

## Accessibility and responsive contract

- Critical controls retain at least 48 px height.
- Completion, editing, settings, and subtask creation remain separate targets.
- Narrow layouts remove the optional time indicator before compressing the editable title.
- Large Text stacks summary blocks and increases actions to 54 px.
- Completed state does not depend on mint color alone.
- Forced Colors uses system colors.
- Reduced Motion removes disclosure transitions.

## Explicit exclusions

- No production persistence, accounts, collaboration, reminders, or notifications.
- No deletion workflow.
- No nested subtasks beyond one level.
- No points, streaks, rewards, or performance scoring.
- No production swipe-indentation implementation.

## Evidence boundary

Committed-source inspection and validator contracts cover route registration, renderer export, shared actions, stylesheet order, responsive hooks, and accessibility fallbacks. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
