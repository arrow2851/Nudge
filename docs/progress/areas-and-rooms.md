# Areas and Rooms Milestone

**Status:** First vertical slice implemented; refinement and second-half work pending.

## Approved product decisions

- [x] Ship with sensible default Areas.
- [x] Default Areas are House, Car, Personal, and Work.
- [x] Suggested rooms are conditioned on selecting or applying the shipped House template.
- [x] Custom Areas start empty unless a template is explicitly selected.
- [x] Room Reset includes only due and overdue items by default.
- [x] Maintenance percentage is not part of the product.
- [x] Templates are approved as a setup and expansion mechanism.

## Implemented in this slice

- [x] Persistent Area model
- [x] Persistent Room/Subarea model
- [x] Template model
- [x] Shipped default Areas
- [x] Shipped House room template
- [x] Areas overview screen
- [x] Area counts for due and overdue items
- [x] Area detail screen
- [x] Room cards with pending status
- [x] Room detail screen
- [x] Contextual Quick Add from Area
- [x] Contextual Quick Add from Room
- [x] Add Area flow
- [x] Edit Area flow
- [x] Add Room flow
- [x] Edit Room flow
- [x] Apply missing rooms from a template
- [x] Due-only Room Reset
- [x] Room Reset progress
- [x] Room Reset completion
- [x] Room Reset graded completion
- [x] Room Reset skip action
- [x] Nested browser routes for Areas and Rooms
- [x] Local browser persistence

## Review targets

- [ ] Review overall Areas visual hierarchy
- [ ] Review density of Area cards
- [ ] Review whether due and overdue counts are sufficient
- [ ] Review shipped House room list
- [ ] Review whether General House should appear as a normal room
- [ ] Review Add Area terminology
- [ ] Review template selection wording
- [ ] Review Area detail summary card
- [ ] Review Room detail grouping
- [ ] Review Room Reset interaction and visual focus
- [ ] Review mobile scrolling and button placement

## Remaining work in this milestone

- [ ] Archive Area
- [ ] Delete Area
- [ ] Confirm behavior when an Area contains items
- [ ] Reorder Areas
- [ ] Archive Room
- [ ] Delete Room
- [ ] Confirm behavior when a Room contains items
- [ ] Reorder Rooms
- [ ] Move Room between Areas
- [ ] Move item between Areas and Rooms
- [ ] Add Area search when the list becomes large
- [ ] Add Room empty states for each content section
- [ ] Add Include All Room Tasks option before Room Reset
- [ ] Persist active Room Reset session across refresh
- [ ] Add pause and resume to Room Reset
- [ ] Add Room Reset completion summary
- [ ] Add notes during Room Reset
- [ ] Add task and chore detail navigation
- [ ] Add recurrence-aware next-due behavior
- [ ] Add long-press or overflow actions where appropriate
- [ ] Add accessibility review
- [ ] Add automated syntax and route checks
- [ ] Reconcile completed items into `PROJECT-STATUS.md`

## Next recommended implementation batch

1. Task and Chore detail screens
2. Snooze and reschedule actions
3. Recurrence data structure and next-due calculation
4. Item movement between Areas and Rooms
5. Room Reset persistence and completion summary

## Prototype paths

- Areas: `#/areas`
- House: `#/areas/house`
- Kitchen: `#/areas/house/kitchen`
