# Design Lab Decisions and Feedback Log

This file records review decisions, intentional interaction differences, plan adjustments, and reusable findings. Material scope changes still require the pause-and-review process defined in `DESIGN-LAB-CHECKLIST.md`.

## 2026-08-01 — Design Lab branch and initial shortlist

**Reason:** Explore alternate visual systems without destabilizing the approved Look #1 prototype.

**Decision:** Create `feature/design-lab`; keep all experimental files under `mockups/design-lab/`; preserve Look #1 on `main`.

**Initial shortlist:**

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

**Round 1 screens:** Areas overview, representative Area detail, and Intervention.

## 2026-08-01 — Shared comparison fixture

**Reason:** Every Look requires equivalent content and stress states for a fair comparison.

**Decision:** Use seven shared scenarios: Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text.

**Comparison rule:** Scenario objects are cloned before rendering. Look-specific code cannot mutate the fixture used by another Look.

**Intentional differences allowed:** Placement, typography, color, density, iconography, motion intent, and wording tone where semantic meaning remains equivalent.

**Differences not allowed:** Additional functionality, easier data, fewer states, altered urgency, or different action availability.

## 2026-08-01 — Keep every visual direction

**User decision:** The user likes all current directions and does not want to choose a single Look or eliminate the others.

**Plan adjustment:** Promote every deferred numbered direction and treat the Design Lab as a complete gallery rather than a forced finalist funnel.

**New active directions:**

- Look #5 — Playful Modular
- Look #7 — Bold Utility
- Look #8 — Ambient Glass
- Look #9 — Retro Digital

**Result:** Looks #2 through #9 are all active gallery directions. Look #1 remains the protected baseline reference.

**Selection rule removed:** The previous requirement to choose two or three finalists before continuing is no longer active.

**Replacement rule:** A future interactive prototype may preserve a pure Look, use different Looks for separate experimental variants, or use controlled synthesis. Controlled synthesis requires one dominant system and documented borrowed components. Unrestricted mixing within a screen is not allowed.

**Dark variants:** Still deferred as variants rather than separate numbered Looks unless explicitly promoted later.

## 2026-08-01 — Interactive expansion package prepared

**Status:** Pending user decision; no implementation started.

**Recommended strategy:** One shared semantic behavior core with eight Design Lab visual adapters.

**Recommended first slice:** Routine completion loop from Today or Needs Attention through Area, Section, Chore detail, completion, recurrence advancement, and undo or reopen.

**Recommended Look-switch boundary:** Design Lab review control only. Do not infer a user-facing theme feature.

**Recommended state boundary:** Deterministic isolated prototype state with no production integration.

**Reason:** This package preserves every visual direction without duplicating product behavior eight times or making one Look an accidental permanent winner.

**Hard stop:** Implementation requires explicit approval because it introduces material routing, state, component, and architecture commitments.

**Decision documents:**

- `INTERACTIVE-EXPANSION-DECISION.md`
- `VERTICAL-SLICE-CANDIDATES.md`

## 2026-08-01 — Option A selected for interactive expansion

**User decision:** Build one pure-Look vertical slice first.

**Approved strategy:** Option A — one selected Look receives the first complete interactive Routine Completion Loop.

**What remains unchanged:**

- The other Looks remain preserved in the visual gallery.
- Selecting the first implementation Look does not reject or delete any other direction.
- Look switching is not being introduced as a user-facing theme feature.
- Prototype state remains isolated and deterministic.
- Look #1 remains protected and is not eligible unless separately promoted.
- Nothing is merged into `main`.

**Remaining implementation gate:** Select the first active Look from Looks #2 through #9.

**Recommendation:** Look #4 — Zen Focus. It has the strongest fit with Nudge's low-pressure emotional model and should expose whether the Routine Completion Loop can remain calm while still supporting clear navigation, recurrence, completion, and undo.

**Secondary recommendation:** Look #3 — Precision Minimal if the priority is operational density and fast repeated checklist use rather than emotional tone.

**Status:** Option A is approved; implementation remains blocked only until the first Look is selected.

## Feedback entry template

```text
## YYYY-MM-DD — Look # / review title

Scenario and screen:
Strongest element:
Biggest weakness:
Most confusing element:
Component worth borrowing:
Intentional differences observed:
Score summary:
Recommendation:
Follow-up checklist items:
```
