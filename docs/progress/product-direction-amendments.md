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
- [ ] Give Lists a dedicated list and list-item creation flow.
- [ ] Give Tasks a dedicated task creation flow.
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
