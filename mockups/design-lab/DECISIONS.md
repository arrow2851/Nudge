# Design Lab Decisions and Feedback Log

This file records review decisions, intentional interaction differences, plan adjustments, and reusable findings. Material scope changes still require the pause-and-review process defined in `DESIGN-LAB-CHECKLIST.md`.

## 2026-08-01 — Design Lab branch and initial shortlist

**Reason:** Explore alternate visual systems without destabilizing the approved Look #1 prototype.

**Decision:** Create `feature/design-lab`; keep all experimental files under `mockups/design-lab/`; preserve Look #1 on `main`.

**Shortlist:**

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

**Round 1 screens:** Areas overview, representative Area detail, and Intervention.

**Next active milestone:** Finish the shared fixture and Look #2 stress-state readiness, then implement Look #3.

## 2026-08-01 — Shared Round 1 fixture

**Reason:** Every Look requires equivalent content and stress states for a fair visual comparison.

**Decision:** Use seven shared scenarios: Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text.

**Comparison rule:** Scenario objects are cloned before rendering. Look-specific code cannot mutate the fixture used by another Look.

**Intentional differences allowed:** Placement, typography, color, density, iconography, motion intent, and wording tone where semantic meaning remains equivalent.

**Differences not allowed during Round 1:** Additional functionality, easier data, fewer states, altered urgency, or different action availability.

## 2026-08-01 — Look #2 Round 1 interaction boundaries

**Areas overview:** Flat editorial index rather than Look #1 card treatment.

**Area detail:** Editorial section rules and flat routine rows; functionality remains simulated at the same Round 1 level.

**Intervention:** Full-screen editorial pause with nonjudgmental copy and three equivalent actions: Start, Choose something else, and Not now.

**Creation and completion:** Remain simulated until finalist vertical slices. This prevents Look #2 from receiving more functionality than later Round 1 Looks.

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
