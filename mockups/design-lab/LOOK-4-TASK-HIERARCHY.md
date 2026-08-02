# Look #4 — Zen Focus Task Hierarchy Loop

**Milestone:** `0.10.0`  
**Branch:** `feature/design-lab`  
**Scope:** Isolated Design Lab prototype only

## Purpose

Apply the approved simple checklist model to Zen Focus without turning Tasks into a project-management system.

## Implemented flow

```text
Tasks
→ Add an empty task from the top or bottom
→ Edit the title inline
→ Complete or reopen
→ Open settings
→ Set as main task
→ Add subtasks
→ Track subtask progress
→ Reorder
→ Indent or unindent
→ Turn off main task and release subtasks
→ Hide or show completed items
```

## Row anatomy

Each task row keeps the agreed order:

1. Left drag handle.
2. Separate completion control.
3. Inline editable title.
4. Optional shorthand time indicator.
5. Settings disclosure.
6. Separate subtask plus control when the task is a main task.

The subtask plus is visually separated from the settings disclosure to reduce accidental activation.

## Hierarchy rules

- Nesting is limited to one level.
- Any regular top-level task can become a main task.
- A regular task may be indented under the previous task; the previous task becomes a main task automatically.
- A subtask may be unindented into a regular top-level task.
- Turning off main-task mode releases every subtask as a regular task immediately after the former main task.
- Main-task progress is derived from completed subtasks.
- Completing every subtask completes the main task.
- Reopening any subtask reopens the main task.
- Completing or reopening a main task applies the same state to all of its subtasks.

## Ordering rules

- Incomplete items remain above completed items.
- Completed items move to the bottom automatically.
- Reordering stays within the incomplete or completed group so completion grouping is not broken.
- Native drag and drop is provided for pointer review.
- Move Up and Move Down controls provide an explicit keyboard and assistive-technology alternative.
- Indent and Unindent controls provide an explicit alternative to swipe gestures.

## Creation and editing

- A plus button in the upper-right creates an empty task at the top.
- A second Add Task button below the list creates an empty task at the bottom of the incomplete group.
- Newly created tasks receive focus for immediate editing.
- Titles remain editable inline.

## Completion visibility

- Completed tasks remain available at the bottom by default.
- Hide Completed removes completed top-level tasks and completed subtasks from the visible list.
- Show Completed restores them without changing state.

## Scenario handling

The task hierarchy uses the same seven Design Lab scenarios:

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

Each scenario has isolated deterministic task state under the Design Lab session-storage namespace.

## Accessibility and responsive treatment

- Completion, settings, add, and explicit movement actions retain large touch targets.
- Every icon-only control has an accessible label.
- Settings disclose their expanded state.
- Main-task toggles expose pressed state.
- Completed state uses a checkmark, text decoration, ordering, and state—not color alone.
- Large Text reflows rows and hides the optional time shorthand before compressing the editable title.
- Forced Colors replaces decorative surfaces with system colors.
- Reduced Motion removes disclosure animation.

## Intentional boundaries

Not implemented in this milestone:

- Production persistence or account sync.
- Notifications or due-date scheduling.
- Nested subtasks beyond one level.
- Collaborative assignment.
- Destructive deletion.
- A user-facing theme system.
- Production mobile gesture handling.

## Validation boundary

Committed-source inspection and validator contracts cover:

- Tasks route registration.
- Isolated task state.
- Add and inline edit.
- Complete and reopen propagation.
- Main-task conversion and subtask release.
- Subtask addition and progress.
- Drag reorder hooks.
- Explicit Move, Indent, and Unindent controls.
- Completed-item grouping and hide/show.
- Responsive, Large Text, Forced Colors, and Reduced Motion hooks.

Still pending:

- Exact complete-checkout validator execution.
- Exact browser interaction run.
- Physical Android drag/hold and swipe testing.
- Actual screen-reader smoke testing.
- Single-version all-Look regression.

## Next implementation

Apply the same Task hierarchy behavior contract to Look #3 — Precision Minimal.
