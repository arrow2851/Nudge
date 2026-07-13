# Areas and Sections Milestone

**Status:** Recurring-routine redesign implemented; phone review and refinement pending.

> The file keeps its original path for link stability. The user-facing hierarchy is **Area → Section**.

## Product boundary

- [x] Areas contains recurring chores and maintenance routines.
- [x] One-time Tasks remain in the separate Tasks destination.
- [x] A one-time Task may retain an Area reference internally, but it is not displayed or created from Areas.
- [x] Areas and Tasks are distinct product concepts for now.

## Design goal

Areas is designed for a large setup that is entered once and used repeatedly:

1. Add routines individually or in batches.
2. See where attention is needed without opening every Section.
3. Check a routine off with one prominent action.
4. Let recurrence automatically move it to its next due date.

## Implemented hierarchy

### Areas overview

- [x] Aggregate needs-attention summary.
- [x] Due and overdue counts use chores only.
- [x] Each Area shows total routines, Section count, and its next relevant routine.
- [x] Area cards prioritize attention rather than generic progress percentages.
- [x] Top and bottom Add Area controls.

### Area detail

- [x] Top-right Add Chore control.
- [x] Needs Attention appears before Section navigation.
- [x] Due and overdue chores can be checked off directly without opening their Section.
- [x] Chore rows identify their Section when shown at Area level.
- [x] Section cards show routine count, next routine, and due/overdue state.
- [x] General Area routines remain supported when no Section is selected.
- [x] Add Chore, Add Section, Use Template, and Edit Area actions.

### Section detail

- [x] Dense checklist-style routine rows.
- [x] Large left-side completion target.
- [x] Tap the routine text to open Chore details.
- [x] Due label remains visible at the right.
- [x] Groups for Needs Attention, Coming Up, As Needed, and Paused.
- [x] Compact summary for due, upcoming, and as-needed routines.
- [x] Top and bottom Add Chore controls.
- [x] Clear empty state that reinforces the Task/Area separation.

## Scalable setup

- [x] Add Chore flow creates recurring chores only.
- [x] Area-level creation includes optional Section selection.
- [x] Section-level creation fixes the Area and Section.
- [x] Simple Repeat and First Due controls.
- [x] Estimated duration and completion grading live under More Options.
- [x] `Add & another` supports rapid entry without closing the sheet.
- [x] Pressing Enter during entry adds the current chore and keeps the flow open.
- [x] Add Area may start empty or from a template.
- [x] Templates can add suggested Sections and starter chores.
- [x] Template starter due dates are staggered instead of making every routine due immediately.
- [x] Template application adds only missing Sections and chores.
- [x] House starter template.
- [x] Car starter template.

## Completion behavior

- [x] Checkbox completion is available directly in Area and Section lists.
- [x] Graded chores still open Light, Moderate, and Deep completion choices.
- [x] Daily, weekly, monthly, and every-N-days chores advance to the next due date.
- [x] As-needed chores become available again after completion instead of becoming permanent completed Tasks.
- [x] Undo remains available for supported completion and setup actions.

## Review targets

- [ ] Review Areas overview density on phone.
- [ ] Review whether next-routine text is sufficiently informative.
- [ ] Review completion-target size and accidental taps.
- [ ] Review whether Area-level Needs Attention is the right amount of duplication before Section navigation.
- [ ] Review General Area routine placement.
- [ ] Review Section group order and visual weight.
- [ ] Review the Add & another flow with the mobile keyboard.
- [ ] Review starter chore selection and staggered due dates.
- [ ] Review whether templates need per-routine selection before applying.
- [ ] Review visual polish after real usage feedback.

## Deferred work

- [ ] Archive and delete Areas.
- [ ] Archive and delete Sections.
- [ ] Reorder Areas and Sections.
- [ ] Move a Section between Areas.
- [ ] Move a Chore between Areas and Sections from its detail screen.
- [ ] Search when an Area or Section becomes very large.
- [ ] Optional guided Section routine mode, only if quick check-off is insufficient.
- [ ] Accessibility alternatives and automated interaction tests.
- [ ] Reconcile the master `PROJECT-STATUS.md` during tracker consolidation.

## Prototype paths

- Areas: `#/areas`
- House: `#/areas/house`
- Kitchen: `#/areas/house/kitchen`