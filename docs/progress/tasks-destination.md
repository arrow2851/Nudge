# Tasks Checklist Milestone

**Status:** Simplified checklist direction implemented; visual review and refinement pending.

## Superseded direction

The earlier multi-view Tasks design is intentionally discarded. The following are no longer part of the default Tasks experience:

- Inbox, Today, Upcoming, Waiting, Blocked, and Completed tabs
- Search and filtering
- Priority and workflow-status controls
- Grouping and bulk workflow actions
- Dense Add Task form
- Task cards with badges and metadata rows
- Permanent drag handle
- Permanent chevron/details button
- Always-visible inline text input

Historical commits may still contain those implementations, but they are not the approved product direction.

## Approved product direction

- [x] Tasks is a single checklist.
- [x] Tasks has no global Quick Add dependency.
- [x] A `+` button appears at the top right.
- [x] Another `+ Add task` control appears below the current checklist.
- [x] Either add control creates a blank task and opens its bottom-sheet editor.
- [x] Manual order is the default.
- [x] Tasks can also be ordered alphabetically.
- [x] Tasks can also be ordered by due date, then alphabetically.
- [x] Default row order is Checkbox → Task text area with optional due shorthand → Optional Subtask Add.
- [x] The task row has no permanent drag handle.
- [x] The task row has no permanent `>` control.
- [x] Tapping the task text area opens the bottom-sheet editor.
- [x] Holding the task row allows it to be dragged and reordered.
- [x] Due-date shorthand is the only optional information on the right side of the text area.
- [x] Due shorthand remains visually separate from the task title and does not overlap it.
- [x] A future Settings option can reverse the task-row control order.
- [x] A future Settings option controls due-date shorthand visibility.

## Implemented checklist row

- [x] Completion checkbox on the left by default
- [x] Tappable task text area
- [x] Bottom-sheet task-name editing
- [x] Bottom-sheet Main Task setting
- [x] Bottom-sheet Due Date setting
- [x] Optional light-gray due shorthand on the far right of the text area
- [x] Separate `+` segment for main tasks
- [x] Hold the row to begin dragging
- [x] Completed tasks remain visible and move below active tasks
- [x] Persistent browser state
- [x] Undo for supported checklist changes

## Main tasks and subtasks

- [x] A regular root task can be marked as a main task.
- [x] A main task receives a dedicated subtask-add control.
- [x] Subtasks appear visually nested under the main task.
- [x] Main-task progress is shown with a thin bar attached to the top of the card.
- [x] Progress is calculated from completed subtasks.
- [x] Turning off Main Task releases all subtasks into the root checklist.
- [x] Released subtasks retain their task records.
- [x] A subtask cannot become a main task until moved back to the root.
- [x] Holding and dragging a task over the lower part of a main task nests it as a subtask.
- [x] Dragging a subtask onto a normal root task returns it to the root checklist.
- [x] Dragging or nesting switches ordering back to Manual.
- [x] A main task that already contains subtasks cannot itself become a subtask.

## Due dates

- [x] Task editing shows `Set due date` when no date exists.
- [x] Setting a due date opens the native date picker.
- [x] When a date exists, editing shows Clear and Change.
- [x] Clear removes the due date.
- [x] Change reopens the date picker.
- [x] Due ordering places undated tasks last and uses alphabetical order as the secondary sort.
- [x] Optional shorthand supports Today, days remaining, weeks remaining, and days late.
- [ ] Expose the shorthand preference in Settings.

## Future Settings requirements

- [ ] Show task due-date shorthand
- [ ] Reverse task-row control order
- [ ] Remember selected task ordering mode
- [ ] Decide whether completed tasks remain visible, collapse, or can be hidden

## One-time Task detail behavior

- [x] One-time Task detail no longer exposes the discarded workflow-status and priority system.
- [x] One-time Task detail shows a lightweight summary.
- [x] One-time Task detail links back to the checklist for editing and organization.
- [x] Rich recurrence controls remain available for Chores only.

## Review targets

- [ ] Review checkbox size and left padding.
- [ ] Review row height and text readability.
- [ ] Review the bottom-sheet title-editing flow.
- [ ] Review whether completed tasks should remain visible by default.
- [ ] Review the Manual / A–Z / Due control placement.
- [ ] Review the visual distinction of the main-task `+` segment.
- [ ] Review subtask indentation.
- [ ] Review thin progress-bar visibility.
- [ ] Review hold duration before dragging begins.
- [ ] Review drag-to-nest behavior on a phone.
- [ ] Review drag-to-root behavior on a phone.
- [ ] Review whether completing a main task should affect its subtasks.
- [ ] Review whether completing every subtask should automatically complete the main task.
- [ ] Review long task names and narrow screens.
- [ ] Review reversed layout once Settings exposes it.
- [ ] Review due shorthand once Settings exposes it.

## Pending refinements

- [ ] Add an explicit root drop zone at the end of the checklist.
- [ ] Add keyboard-accessible reorder alternatives.
- [ ] Add non-drag controls for moving a task into or out of a main task.
- [ ] Add stronger drag preview and auto-scroll near screen edges.
- [ ] Decide how abandoned blank tasks should be cleaned up.
- [ ] Add archive/delete behavior if still needed.
- [ ] Add full accessibility review.
- [ ] Add automated checklist interaction tests.
- [ ] Reconcile this approved direction into `PROJECT-STATUS.md`.

## Prototype path

- Tasks checklist: `#/tasks`

## Recommended next batch

The next major milestone is the Direct Intervention prototype:

1. Simulate Redirect control
2. Intervention screen
3. Start Task
4. Already Done
5. Different Task
6. Not Now
7. Focus Mode
8. Intervention settings and compatibility preview
