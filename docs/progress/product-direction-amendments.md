# Product Direction Amendments

This file records approved changes that override older roadmap or wireframe language until the master tracker is fully reconciled.

## 2026-07-12 — Simplified Today and contextual creation

### Approved

- [x] Remove the Daily Progress card from Today by default.
- [x] Remove Quick Win from Today by default.
- [x] Preserve Daily Progress as an optional future setting.
- [x] Preserve Quick Win as an optional future setting.
- [x] Default both optional Today features to off.
- [x] Remove the global floating `+` / Quick Add action.
- [x] Remove the empty center slot from bottom navigation.
- [x] Use four equal primary destinations: Today, Areas, Lists, and Tasks.
- [x] Give Areas a contextual task/chore creation flow.
- [x] Give Sections a contextual task/chore creation flow.
- [x] Give Lists a dedicated list and list-item creation flow.
- [x] Give Tasks a dedicated checklist creation flow.
- [x] Use `Area → Section` as the user-facing hierarchy.
- [x] Stop using “Room” as the generic product term.
- [x] Keep the internal `subareas` storage field temporarily for migration compatibility.

### Settings backlog

When Settings is implemented, add:

- [ ] `Show daily progress on Today`
- [ ] `Show Quick Win on Today`
- [ ] Explanatory copy that both are optional and off by default
- [ ] Live preview or immediate Today refresh after toggling
- [ ] Persist both preferences locally

### Validation checklist

- [ ] Confirm Today opens directly to Due Today without excessive empty space.
- [ ] Confirm no floating add button appears on any route.
- [ ] Confirm bottom navigation uses four evenly sized destinations.
- [ ] Confirm Areas can add a task or chore with Area fixed.
- [ ] Confirm Area-level creation can optionally assign a Section.
- [ ] Confirm Section-level creation fixes both Area and Section.
- [ ] Confirm Lists does not expose the former generic Quick Add flow.
- [ ] Confirm Tasks does not expose the former generic Quick Add flow.
- [ ] Confirm all visible Area hierarchy wording uses “Section.”

## 2026-07-12 — Replace task manager with a checklist

### Superseded

The earlier Tasks design with Inbox, Today, Upcoming, Waiting, Blocked, Completed, filters, priorities, grouping, and a dense creation form is no longer approved.

A later checklist draft also used a permanent drag handle, always-visible inline text input, and a permanent `>` details button. Those row controls are now superseded as well.

### Approved

- [x] Use one checklist instead of multiple workflow views.
- [x] Add a task using `+` at the top right or `+ Add task` below the checklist.
- [x] Create an empty task and immediately open its bottom-sheet editor.
- [x] Default row order is Checkbox → Task text area with optional due shorthand → Optional Subtask Add.
- [x] Do not show a permanent drag handle.
- [x] Do not show a permanent `>` details button.
- [x] Tap the task text area to open the bottom-sheet editor.
- [x] Edit the task name inside the same bottom sheet as Main Task and Due Date.
- [x] Hold the task row to reorder it.
- [x] Use manual order by default.
- [x] Support alphabetical ordering.
- [x] Support due-date ordering with alphabetical secondary sorting.
- [x] Support main tasks and nested subtasks.
- [x] Show subtask completion using a thin progress bar attached to the main task card.
- [x] Turning off Main Task releases its subtasks into the root checklist.
- [x] Dragging onto the lower portion of a main task can create a subtask.
- [x] Dragging a subtask onto a regular root task returns it to the root checklist.
- [x] Use only Task Name, Main Task, and Due Date in the simple task editor.
- [x] When a due date exists, show Clear and Change actions.
- [x] Keep optional due shorthand inside the text region on the right in light gray.
- [x] Keep the task title and due shorthand in separate layout columns so they do not overlap.
- [x] Remove workflow status and priority from one-time Task detail.
- [x] Keep richer recurrence controls for Chores only.

### Settings backlog

- [ ] `Show task due-date shorthand`
- [ ] `Reverse task-row control order`
- [ ] Persist the selected Manual / A–Z / Due ordering mode
- [ ] Decide whether completed tasks remain visible, collapse, or can be hidden

### Validation checklist

- [ ] Confirm both add controls create an empty task and open its editor.
- [ ] Confirm task-name edits persist from the bottom sheet.
- [ ] Confirm completion and reopening work.
- [ ] Confirm tapping the row opens editing without a chevron.
- [ ] Confirm holding the row starts dragging without a permanent handle.
- [ ] Confirm dragging into and out of main tasks works on a phone.
- [ ] Confirm turning off Main Task releases every subtask.
- [ ] Confirm the progress bar matches completed subtasks.
- [ ] Confirm due-date Set, Change, and Clear work.
- [ ] Confirm alphabetical and due-date ordering match the approved rules.
- [ ] Confirm due shorthand stays blank while its preference is off.
- [ ] Confirm due shorthand never overlaps long task text.
- [ ] Confirm reversing the row later does not reverse text entry direction.

## 2026-07-12 — Simplify reusable Lists

### Superseded

The earlier Lists design with a permanent Add Item section, quantity, unit, category, item-detail controls, duplicate-choice sheets, and shopping/list sessions is no longer approved.

### Approved

- [x] Use one simple active checklist per reusable list.
- [x] Place only a checkbox and item text in each active item row.
- [x] Do not place item controls or a chevron on the right.
- [x] Add items using `+` at the top right or `+ Add item` below the current items.
- [x] Either Add Item control creates a blank inline-editable item.
- [x] Do not show a permanent Add Item input section.
- [x] Tap item text to edit it inline.
- [x] Show clean remembered-history suggestions directly beneath the item being edited.
- [x] Filter suggestions while the user types.
- [x] Selecting a suggestion fills the item currently being edited.
- [x] Hold an item to drag it into a different position.
- [x] Checking an item removes it from the active list.
- [x] Preserve the checked name in remembered history for future suggestions.
- [x] Prevent an exact active duplicate with a simple message instead of a decision sheet.
- [x] Remove session mode completely.
- [x] Remove quantity, unit, and category from the default active-item experience.
- [x] Keep checkboxes on the left by default.

### Settings backlog

- [ ] `Place List checkboxes on the right`
- [ ] Apply the preference to every reusable list immediately
- [ ] Preserve normal left-to-right text editing when checkbox placement changes

### Validation checklist

- [ ] Confirm the top and bottom Add Item controls both create a blank focused row.
- [ ] Confirm every active item contains only the checkbox and item text.
- [ ] Confirm tapping text enters inline editing.
- [ ] Confirm history suggestions appear only while editing.
- [ ] Confirm edited text persists after Enter or focus loss.
- [ ] Confirm selecting a history suggestion fills and saves the active row.
- [ ] Confirm checking removes the item immediately.
- [ ] Confirm checked items can later be suggested again.
- [ ] Confirm holding and dragging changes item order on a phone.
- [ ] Confirm there is no Start Session or Finish Session action.
- [ ] Confirm there are no right-side per-item controls.
- [ ] Confirm migrated browser state no longer retains active session behavior.
