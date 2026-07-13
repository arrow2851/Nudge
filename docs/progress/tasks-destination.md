# Tasks Destination Milestone

**Status:** First complete browser-prototype slice implemented; review and refinement pending.

## Product direction

- [x] Tasks has its own dedicated creation workflow.
- [x] Tasks does not use a global Quick Add button.
- [x] The Tasks destination can display both one-time tasks and chores for centralized review.
- [x] The dedicated Add Task flow creates one-time tasks only.
- [x] Area and Section assignment are optional.
- [x] Workflow status and due timing are modeled separately.

## Implemented

- [x] Tasks destination route
- [x] Inbox view
- [x] Today view
- [x] Upcoming view
- [x] Waiting view
- [x] Blocked view
- [x] Completed view
- [x] Live count for each view
- [x] Dedicated Add Task sheet
- [x] Starting status selection
- [x] Due-date presets
- [x] Custom due-date selection
- [x] Priority selection
- [x] Optional Area assignment
- [x] Optional Section assignment
- [x] Estimated duration
- [x] Notes
- [x] Nudge eligibility
- [x] Local search within the selected view
- [x] Area filter
- [x] Task/chore type filter
- [x] Priority filter
- [x] Duration filter
- [x] Due-date sorting
- [x] Priority sorting
- [x] Shortest-first sorting
- [x] Recently-added sorting
- [x] Alphabetical sorting
- [x] Group by due date
- [x] Group by Area
- [x] Group by priority
- [x] View-specific empty states
- [x] Filtered-result empty state
- [x] Quick completion from task rows
- [x] Task-row status menu
- [x] Task-detail integration
- [x] Status editing from task detail
- [x] Priority editing from task detail
- [x] Area and Section reassignment from task detail
- [x] Recurrence-aware completion remains shared with Today and Areas
- [x] Undo for creation, completion, status changes, and edits
- [x] Existing prototype data upgraded without clearing local storage
- [x] Sample Inbox, Waiting, Blocked, and Completed records added once for review

## Review targets

- [ ] Review whether six horizontally scrolling views feel too dense.
- [ ] Review whether Today should include overdue work or keep it separate.
- [ ] Review whether chores should remain visible in the Tasks destination by default.
- [ ] Review Add Task field density.
- [ ] Review whether Inbox should be the default Tasks view instead of Today.
- [ ] Review priority colors and visibility.
- [ ] Review quick-complete and overflow control placement.
- [ ] Review filtering terminology.
- [ ] Review sorting and grouping controls.
- [ ] Review empty-state wording.
- [ ] Review mobile keyboard behavior.
- [ ] Review task-card information density.

## Pending refinements

- [ ] Add bulk selection.
- [ ] Add bulk rescheduling.
- [ ] Add bulk status changes.
- [ ] Add manual ordering.
- [ ] Add saved filters.
- [ ] Add status reasons as structured fields.
- [ ] Add reminder times.
- [ ] Add Someday view if still desired.
- [ ] Add Cancelled state if still desired.
- [ ] Add archive and deletion.
- [ ] Add destructive confirmations.
- [ ] Add swipe actions.
- [ ] Add long-press actions.
- [ ] Add task duplication.
- [ ] Add attachments.
- [ ] Add full accessibility review.
- [ ] Add automated route and interaction tests.

## Prototype paths

- Tasks default: `#/tasks`
- Inbox: `#/tasks/inbox`
- Today: `#/tasks/today`
- Upcoming: `#/tasks/upcoming`
- Waiting: `#/tasks/waiting`
- Blocked: `#/tasks/blocked`
- Completed: `#/tasks/completed`

## Recommended next batch

The next main feature batch is reusable Lists:

1. Lists collection screen
2. Dedicated Create List flow
3. Reusable List detail
4. Add-item field and remembered suggestions
5. Item quantities and categories
6. Duplicate handling
7. Shopping/list session
8. Completion history and remembered-item catalog
