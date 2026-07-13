# Areas and Sections Milestone

**Status:** First vertical slice implemented; refinement and second-half work pending.

> Historical note: this file keeps its original path for link stability. The approved product term is now **Section**, not Room.

## Approved product decisions

- [x] Ship with sensible default Areas.
- [x] Default Areas are House, Car, Personal, and Work.
- [x] Suggested Sections are conditioned on selecting or applying the shipped House template.
- [x] Custom Areas start empty unless a template is explicitly selected.
- [x] Section Reset includes only due and overdue items by default.
- [x] Maintenance percentage is not part of the product.
- [x] Templates are approved as a setup and expansion mechanism.
- [x] The hierarchy shown to users is `Area → Section`.
- [x] “Room” is no longer the generic product term.
- [x] Area and Section pages own their task/chore creation flow.
- [x] There is no global floating Quick Add action.

## Implemented in this slice

- [x] Persistent Area model
- [x] Persistent Section/Subarea model
- [x] Template model
- [x] Shipped default Areas
- [x] Shipped House Section template
- [x] Areas overview screen
- [x] Area counts for due and overdue items
- [x] Area detail screen
- [x] Section cards with pending status
- [x] Section detail screen
- [x] Contextual task/chore creation from Area
- [x] Optional Section selection when adding from Area
- [x] Contextual task/chore creation from Section
- [x] Add Area flow
- [x] Edit Area flow
- [x] Add Section flow
- [x] Edit Section flow
- [x] Apply missing Sections from a template
- [x] Due-only Section Reset
- [x] Section Reset progress
- [x] Section Reset completion
- [x] Section Reset graded completion
- [x] Section Reset skip action
- [x] Nested browser routes for Areas and Sections
- [x] Local browser persistence

## Review targets

- [ ] Review overall Areas visual hierarchy
- [ ] Review density of Area cards
- [ ] Review whether due and overdue counts are sufficient
- [ ] Review shipped House Section list
- [ ] Review whether General House should appear as a normal Section
- [ ] Review Add Area terminology
- [ ] Review template selection wording
- [ ] Review Area detail summary card
- [ ] Review Section detail grouping
- [ ] Review Section Reset interaction and visual focus
- [ ] Review contextual Add Task or Chore flow
- [ ] Review mobile scrolling and button placement

## Remaining work in this milestone

- [ ] Archive Area
- [ ] Delete Area
- [ ] Confirm behavior when an Area contains items
- [ ] Reorder Areas
- [ ] Archive Section
- [ ] Delete Section
- [ ] Confirm behavior when a Section contains items
- [ ] Reorder Sections
- [ ] Move Section between Areas
- [ ] Move item between Areas and Sections
- [ ] Add Area search when the list becomes large
- [ ] Add Section empty states for each content group
- [ ] Add Include All Section Tasks option before Section Reset
- [ ] Persist active Section Reset session across refresh
- [ ] Add pause and resume to Section Reset
- [ ] Add Section Reset completion summary
- [ ] Add notes during Section Reset
- [x] Add task and chore detail navigation
- [x] Add recurrence-aware next-due behavior
- [ ] Add long-press or overflow actions where appropriate
- [ ] Add accessibility review
- [ ] Add automated syntax and route checks
- [ ] Reconcile completed items into `PROJECT-STATUS.md`

## Next recommended implementation batch

1. Full Tasks destination
2. Task-specific creation flow
3. Waiting and Blocked states
4. Item movement between Areas and Sections
5. Section Reset persistence and completion summary

## Prototype paths

- Areas: `#/areas`
- House: `#/areas/house`
- Kitchen Section: `#/areas/house/kitchen`
