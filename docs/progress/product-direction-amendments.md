# Product Direction Amendments

This file records approved changes that override older roadmap, wireframe, and prototype language until the master tracker is fully reconciled. Later sections override earlier sections when they conflict.

## 2026-07-12 — Simplified Today and contextual creation

### Approved

- [x] Remove Daily Progress and Quick Win from Today by default.
- [x] Preserve both as optional future Settings controls.
- [x] Remove the global floating Quick Add action.
- [x] Use four equal destinations: Today, Areas, Lists, and Tasks.
- [x] Give each destination its own creation flow.
- [x] Use `Area → Section` as the user-facing hierarchy.
- [x] Keep internal `subareas` temporarily for migration compatibility.

### Settings backlog

- [ ] Show daily progress on Today.
- [ ] Show Quick Win on Today.

## 2026-07-12 — Replace the task manager with a checklist

### Superseded

The multi-view Tasks manager, workflow statuses, priorities, filters, permanent drag handle, and permanent chevron are not approved.

### Approved

- [x] Use one checklist.
- [x] Add from the top-right or bottom control.
- [x] Use checkbox-left, task text, optional gray due shorthand, and optional Main Task `+`.
- [x] Tap an existing task to open a bottom-sheet editor.
- [x] Hold a row to reorder it.
- [x] Keep Task name, Main Task, and Due Date as the simple editor fields.
- [x] Preserve Manual, A–Z, and Due ordering.
- [x] Keep richer recurrence behavior for Chores only.

### Settings backlog

- [ ] Show task due-date shorthand.
- [ ] Reverse task-row control order.
- [ ] Persist selected Manual / A–Z / Due order.

## 2026-07-12 — Simplify reusable Lists

### Superseded

Permanent Add Item input, quantity, unit, category, item-detail chevrons, duplicate-choice sheets, and shopping sessions are not approved.

### Approved

- [x] Add from the top-right or bottom control.
- [x] New items begin as blank inline-editable rows.
- [x] Keep checkbox-left and text-only default rows.
- [x] Preserve remembered history for suggestions.
- [x] Keep exact duplicate prevention simple.
- [x] Keep checkboxes on the left by default.

### Settings backlog

- [ ] Place List checkboxes on the right.

## 2026-07-12 — Unify Task and List item behavior

This section supersedes any earlier statement that List items disappear when completed, that existing List items edit inline, that new Tasks immediately open a bottom sheet, or that drag-to-nest is the primary hierarchy gesture.

### Shared item model

- [x] Tasks and reusable List items use the same default interaction model.
- [x] Both are inline editable only while first being added.
- [x] Tapping an existing item opens its bottom-sheet editor.
- [x] Holding an item reorders it.
- [x] Swiping a root item to the right makes it a subitem of the item immediately above.
- [x] If no eligible item is above, the row slides back without changing hierarchy.
- [x] Successful right swipe automatically marks the item above as a Main item.
- [x] Main items have a separate `+` control for adding subitems.
- [x] Subitems are visually nested.
- [x] Main items show a thin completion bar above the row.

### Shared completion rules

- [x] Completing a Main item completes every subitem.
- [x] Reopening a Main item reopens every subitem.
- [x] Completing every subitem automatically completes the Main item.
- [x] Reopening any subitem automatically reopens the Main item.
- [x] Completed root items move below active root items.
- [x] Completed subitems move below active subitems within their parent.
- [x] Tasks and Lists each have a Show Completed / Hide Completed control.
- [x] Hiding completed root items does not hide completed subitems beneath an unfinished Main item.

### Task-only difference

- [x] Tasks may have a Due Date.
- [x] Tasks may show optional gray due shorthand.
- [x] Reusable List items do not have Due Dates.

### List-only history behavior

- [x] Completing List items records their names in reusable history.
- [x] History suggestions appear during new-item inline entry.
- [x] History suggestions also appear in the existing-item bottom sheet.

### Validation checklist

- [ ] Confirm swipe-right indent works reliably on phone.
- [ ] Confirm the first root item snaps back with no hierarchy change.
- [ ] Confirm tap, swipe, and hold do not accidentally trigger one another.
- [ ] Confirm completing a parent completes all children.
- [ ] Confirm completing all children completes the parent.
- [ ] Confirm reopening one child reopens the parent.
- [ ] Confirm completed root items move to the bottom.
- [ ] Confirm hidden completed children remain visible under an unfinished parent.
- [ ] Confirm List history suggestions work in both creation and editing.
- [ ] Confirm Task Due Date remains the only functional difference between the two item types.