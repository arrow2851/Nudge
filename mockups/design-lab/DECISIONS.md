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

**Status:** Historical planning recommendation; superseded by the Option A decision below.

**Recommended strategy at the time:** One shared semantic behavior core with eight Design Lab visual adapters.

**Recommended first slice:** Routine completion loop from Today or Needs Attention through Area, Section, Chore detail, completion, recurrence advancement, and undo or reopen.

**Recommended Look-switch boundary:** Design Lab review control only. Do not infer a user-facing theme feature.

**Recommended state boundary:** Deterministic isolated prototype state with no production integration.

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

## 2026-08-01 — First Look and remaining order delegated

**User decision:** The assistant should select the first Look and the complete remaining order. Future routine `go` messages should continue without asking the user to select again.

**Selected first Look:** Look #4 — Zen Focus.

**Reason:** It best represents Nudge's calm, low-pressure purpose and is the strongest first test of whether urgency, navigation, recurrence, completion, and undo can remain clear without becoming demanding.

**Implementation order:**

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

**Meaning of the order:** This is a learning and technical-risk sequence, not a ranking, elimination, or permanent product-design decision.

**Feature order after the Routine Completion Loop is implemented in all eight Looks:**

1. Task hierarchy loop.
2. Intervention-to-action loop.
3. Reusable Lists loop.

**Automatic continuation rule:** Routine `go` messages advance to the next unchecked milestone in `PURE-LOOK-IMPLEMENTATION-ORDER.md`. A hard stop is required only for a material change to scope, architecture, storage, deployment, Look #1 protection, product-facing themes, or merge status.

## 2026-08-01 — Look #4 establishes the interactive behavior contract

**Milestone:** Version `0.9.0` implements the Routine Completion Loop in Look #4 — Zen Focus.

**Behavior established:**

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention counts update
→ Undo or reopen
```

**State decision:** Completion records use a separate Design Lab session-storage namespace. Shared fixtures remain immutable; deterministic completion state is applied after cloning the selected scenario.

**Recurrence decision:** The prototype uses three semantic tiers—Light, Moderate, and Deep—with deterministic next-cycle labels. It does not attempt calendar synchronization or production scheduling rules.

**Reversibility decision:** Completion from any supported screen opens or retains Chore detail so Undo is immediately visible. Reopening deletes the completion record and restores the routine's prior fixture status.

**Route decision:** The Design Lab route contract now includes `today`, `section`, and `chore`, plus `area`, `section`, and `chore` identifiers in the query string.

**Validation decision:** The milestone may be marked implemented based on syntax, module, route, renderer, reconstructed-validator, and injected-Chromium smoke evidence. The exact-checkout limitation must remain explicit and physical-device or screen-reader evidence must not be inferred.

**Product boundary:** No Area creation, recurrence editing, notifications, backend, production persistence, task hierarchy, Lists, user-facing themes, Look #1 changes, or merge into `main` were introduced.

## 2026-08-01 — Look #3 applies the shared contract without duplicating behavior

**Milestone:** Version `0.9.1` implements the Routine Completion Loop in Look #3 — Precision Minimal.

**Presentation decision:** Precision Minimal uses a compact queue, explicit metrics, square completion controls, monospaced metadata, and a fact-table Chore detail. These are presentation differences only; completion, recurrence, Undo, routing, and fixture semantics remain shared.

**Cross-Look state decision:** Looks #3 and #4 are registered as interactive. Switching between them preserves the active route and completion state because the semantic state store is not owned by either renderer.

**Default review decision:** Version `0.9.1` opens on Look #3 Today so the newest slice is immediately reviewable. Reset Review State also returns to Look #3 Today for this milestone.

**Shared correction:** The `nextRoutine` helper now deprioritizes completed routines before status sorting. This prevents a completed routine that advanced to Upcoming from remaining the Area's preferred next action.

**Accessibility decision:** Dense presentation does not reduce target size. Critical controls remain at least 48 px, Large Text actions reach at least 54 px, row layouts stack when necessary, and status remains textual.

**Validation boundary:** The static validator now covers both interactive Looks, but direct cloning and exact-checkout browser execution remain DNS-blocked. No exact browser evidence, physical-device evidence, or screen-reader evidence is inferred.

**Next active Look:** Look #5 — Playful Modular. It must preserve the same behavioral contract while testing friendly modular grouping and completion feedback.

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
