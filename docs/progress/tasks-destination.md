# Tasks Checklist Milestone

**Status:** Unified checklist behavior implemented; visual and gesture review pending.

## Superseded direction

The earlier multi-view Tasks manager and the earlier row with a permanent drag handle or chevron are no longer approved.

## Approved product direction

- [x] Tasks is one checklist.
- [x] Top-right `+` and bottom `+ Add task` both create a blank inline-editable task.
- [x] Inline editing is used only during creation.
- [x] Tapping an existing task opens its bottom-sheet editor.
- [x] Existing task editing contains Task name, Main Task, and Due Date.
- [x] The normal row is Checkbox → Task text → optional gray due shorthand → optional Main Task `+`.
- [x] There is no permanent drag handle or chevron.
- [x] Holding the row reorders it.
- [x] Swiping a root task to the right makes it a subtask of the task immediately above.
- [x] If there is no eligible task above, the row returns to its position without changing hierarchy.
- [x] The item above automatically becomes a Main Task when indentation succeeds.
- [x] Manual order is the default.
- [x] Alphabetical and Due Date ordering remain available.

## Parent and subtask behavior

- [x] Main Tasks have a separate `+` for adding a subtask.
- [x] Subtasks appear indented under their Main Task.
- [x] A thin bar above a Main Task shows subtask completion.
- [x] Completing a Main Task completes every subtask.
- [x] Reopening a Main Task reopens every subtask.
- [x] Completing every subtask automatically completes the Main Task.
- [x] Reopening any subtask automatically reopens the Main Task.
- [x] Turning off Main Task releases its subtasks into the root checklist.
- [x] Long-dragging a subtask among root tasks releases it to the root level.
- [x] A Main Task containing subtasks cannot be indented beneath another item.

## Completed items

- [x] Completed root tasks move below active root tasks.
- [x] Completed subtasks move below active subtasks within their parent.
- [x] Tasks includes a Hide Completed / Show Completed toggle.
- [x] Hiding completed tasks hides completed root groups.
- [x] Completed subtasks under an unfinished Main Task remain visible at the bottom of that Main Task.
- [x] The completed-item visibility preference persists locally.

## Due dates

- [x] Due Date exists only for Tasks, not reusable List items.
- [x] Set, Change, and Clear Due Date actions are supported.
- [x] Optional shorthand supports Today, days remaining, weeks remaining, and days late.
- [x] Due shorthand is light gray and separate from the title.
- [ ] Expose `Show task due-date shorthand` in Settings.

## Future Settings requirements

- [ ] Show task due-date shorthand.
- [ ] Reverse task-row control order.
- [ ] Persist selected Manual / A–Z / Due ordering mode.
- [x] Persist Show Completed / Hide Completed.

## Review targets

- [ ] Review right-swipe distance and snap-back animation.
- [ ] Review hold duration before drag begins.
- [ ] Review conflict prevention between tap, swipe, and hold.
- [ ] Review parent/subtask indentation.
- [ ] Review thin progress-bar visibility.
- [ ] Review automatic parent completion.
- [ ] Review completed-item visibility toggle placement.
- [ ] Review long names and narrow screens.
- [ ] Review due shorthand once Settings exposes it.
- [ ] Review the overall visual polish later.

## Pending refinements

- [ ] Add stronger drag preview and edge auto-scroll.
- [ ] Add keyboard-accessible reordering and hierarchy controls.
- [ ] Add an explicit accessible way to release one subtask without dragging.
- [ ] Add archive/delete behavior only if still needed.
- [ ] Add automated interaction tests.
- [ ] Reconcile the master `PROJECT-STATUS.md` during the next tracker consolidation pass.

## Prototype path

- Tasks checklist: `#/tasks`

## Recommended next batch

The next major milestone remains the Direct Intervention prototype.