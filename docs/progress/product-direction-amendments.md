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

## 2026-07-13 — Mobile gesture feedback and full-screen shell

### Approved interaction feedback

- [x] A right swipe moves the item with the finger instead of waiting until release.
- [x] The space revealed behind the item shows the pending indentation action.
- [x] An eligible swipe visibly arms after crossing the indentation threshold.
- [x] An ineligible swipe visibly returns to its original position.
- [x] Holding an item lifts the complete item or Main-item group into a floating preview.
- [x] The floating preview is dimmed and slightly desaturated.
- [x] A dashed placeholder shows the potential destination.
- [x] Neighboring items animate into provisional positions as the placeholder moves.
- [x] Dragging near the top or bottom supports gradual auto-scroll.
- [x] Task gestures update one-time Task records only and never alter Chores.

### Approved mobile-shell behavior

- [x] The mobile prototype uses the full dynamic viewport height.
- [x] The outer webpage does not scroll on mobile.
- [x] Only the app content screen scrolls during normal use.
- [x] App scrolling is locked while a swipe or drag is active.
- [x] Safe-area insets are respected.

## 2026-07-13 — Redesign Areas as recurring routines

This section supersedes the earlier Area design that mixed one-time Tasks and Chores, used task/chore creation from Area pages, and treated Section Reset as the primary completion flow.

### Product boundary

- [x] Areas represents recurring chores and maintenance routines.
- [x] One-time Tasks remain in the separate Tasks destination.
- [x] A Task may retain an Area reference internally without appearing in Areas.
- [x] Area creation and Section creation no longer create one-time Tasks.

### Information hierarchy

- [x] Areas overview answers where attention is needed.
- [x] Area detail shows due and overdue chores across the Area before Section navigation.
- [x] Section detail acts as a dense routine checklist.
- [x] Progress percentages are not the primary Area signal.
- [x] Due, overdue, next routine, recurrence, and location are the primary tracking information.

### Quick completion

- [x] Chores can be checked off directly from Area detail.
- [x] Chores can be checked off directly from Section detail.
- [x] Graded chores retain the Light, Moderate, and Deep completion sheet.
- [x] Recurring completion advances to the next due date.
- [x] As-needed chores remain reusable after completion.

### Scalable setup

- [x] Top and bottom Add Chore controls.
- [x] Area-level creation can assign a Section.
- [x] Section-level creation fixes the Area and Section.
- [x] Repeat and First Due are the primary fields.
- [x] Duration and grading are under More Options.
- [x] Add & another keeps the entry flow open for rapid setup.
- [x] Pressing Enter adds the current chore and continues entry.
- [x] Templates can add Sections and starter chores in one operation.
- [x] Templates add only missing structure and routines.
- [x] Starter due dates are staggered rather than all due immediately.
- [x] House and Car starter templates are provided.

### Validation checklist

- [ ] Confirm old one-time House, Car, Personal, and Work Tasks do not appear in Areas.
- [ ] Confirm those Tasks remain in Tasks.
- [ ] Confirm Area-level checkboxes are comfortable and do not accidentally open details.
- [ ] Confirm Section grouping remains useful with a large number of routines.
- [ ] Confirm Add & another works well with the mobile keyboard.
- [ ] Confirm templates do not duplicate existing Sections or chores.
- [ ] Confirm starter due dates feel sensible rather than arbitrary.
- [ ] Decide whether guided Section Reset is still useful after quick check-off testing.