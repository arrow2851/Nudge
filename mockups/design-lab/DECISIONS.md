# Design Lab Decisions and Feedback Log

This file records review decisions, intentional interaction differences, plan adjustments, and reusable findings. Material scope changes still require the pause-and-review process defined in `DESIGN-LAB-CHECKLIST.md`.

## 2026-08-01 — Design Lab branch and shared comparison rules

**Decision:** Create `feature/design-lab`; keep experimental files under `mockups/design-lab/`; preserve Look #1 on `main`.

**Shared scenarios:** Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text.

**Fairness rule:** Look-specific presentation and wording may vary, but fixture content, urgency meaning, and action availability remain equivalent.

## 2026-08-01 — Keep every visual direction

**User decision:** Retain every numbered direction rather than eliminate Looks.

**Result:** Looks #2 through #9 remain active gallery directions. Look #1 remains the protected baseline.

**Mixing rule:** Pure Looks and documented controlled synthesis remain allowed; unrestricted style mixing within one screen is prohibited.

## 2026-08-01 — Option A selected for interactive expansion

**User decision:** Build one pure-Look vertical slice at a time.

**Delegated order:**

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

This is a learning and technical-risk sequence, not a ranking or permanent product-design decision.

**Later feature order:** Task hierarchy, Intervention-to-action, then Reusable Lists.

**Automatic continuation:** Routine `go` messages advance to the next unchecked milestone. A hard stop remains required for material scope, architecture, storage, deployment, Look #1, product-theme, or merge decisions.

## 2026-08-01 — Shared Routine Completion behavior contract

**Established in:** Version `0.9.0`, Look #4 — Zen Focus.

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

**State:** Completion records use a separate Design Lab session-storage namespace. Shared fixtures remain immutable.

**Recurrence:** The prototype uses deterministic Light, Moderate, and Deep next-cycle labels without production scheduling or calendar integration.

**Reversibility:** Completing from any supported screen opens or retains Chore detail so Undo remains immediately available.

**Routes:** The route contract includes `today`, `section`, and `chore`, with Area, Section, and Chore identifiers in the query string.

**Evidence boundary:** Exact-checkout, physical-device, and screen-reader evidence remain separate from committed-source contract inspection.

## 2026-08-01 — Look #3 applies the contract with operational density

**Milestone:** Version `0.9.1`.

**Presentation:** Compact queue, explicit metrics, square controls, monospaced metadata, and a fact-table Chore detail.

**Shared correction:** `nextRoutine` deprioritizes completed routines before status sorting.

## 2026-08-01 — Look #5 adds friendly modular feedback

**Milestone:** Version `0.9.2`.

**Presentation:** Colorful priority hero, modular Area and Section cards, separate completion/detail controls, and positive reversible feedback.

**Tone boundary:** Friendly language may make the action feel lighter, but it must not trivialize backlog or imply guilt.

## 2026-08-01 — Look #7 uses directness without alarm

**Milestone:** Version `0.9.3`.

**Presentation:** One large priority action, explicit queue counters, thick rules, high-contrast status panels, and a compact fact-grid Chore detail.

**Tone boundary:** Bold hierarchy may be direct, but it must not shame the user, imply failure, or turn backlog into an alarm.

## 2026-08-01 — Look #6 makes care tangible without implying brokenness

**Milestone:** Version `0.9.4`.

**Presentation:** Work orders, service cards, Section drawers, inspection stamps, job facts, completion slips, and Reopen job card.

**Tone boundary:** Physical maintenance metaphors may make work concrete, but they must not suggest that the user, household, or Area is defective.

## 2026-08-01 — Look #2 provides context without creating a diary obligation

**Milestone:** Version `0.9.5` implements the Routine Completion Loop in Look #2 — Warm Editorial.

**Presentation:** Today becomes a quiet daily page with one featured entry, secondary routines remain as additional notes, Sections read as smaller collections, and Chore detail combines narrative context with practical facts.

**Tone boundary:** Editorial language may add warmth and meaning, but it must not make routine completion feel like journaling homework, require reflection, or obscure the actual action and status.

**Action separation:** Routine entries use separate completion and detail targets. Opening an entry does not complete it.

**Reversibility:** The completed screen closes the entry with restrained feedback and immediately presents `Reopen this entry`.

**Cross-Look state:** Looks #2 through #7 share semantic completion state. Visual switching changes presentation only.

**Accessibility:** Completed state uses text, a checkmark, and line-through. Critical targets retain the 48 px floor; Large Text actions reach 54 px; forced-colors uses system colors.

**Validation boundary:** The validator now encodes six interactive Looks and requires `look2-interactive.css`, but exact-checkout execution remains pending because direct cloning is DNS-blocked.

**Next active Look:** Look #8 — Ambient Glass. It must preserve the same behavior while testing translucent hierarchy, solid fallbacks, and lower-end rendering risk.

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
