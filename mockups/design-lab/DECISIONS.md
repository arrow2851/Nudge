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

## 2026-08-01 — Look #4 establishes the interactive behavior contract

**Milestone:** Version `0.9.0` implements the Routine Completion Loop in Look #4 — Zen Focus.

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

**Routes:** The Design Lab route contract includes `today`, `section`, and `chore`, with Area, Section, and Chore identifiers in the query string.

**Evidence boundary:** Reconstructed-validator and injected-browser evidence may support implementation status, but exact-checkout, physical-device, and screen-reader evidence must remain explicit and separate.

## 2026-08-01 — Look #3 applies the contract without duplicating behavior

**Milestone:** Version `0.9.1` implements the Routine Completion Loop in Look #3 — Precision Minimal.

**Presentation:** Compact queue, explicit metrics, square controls, monospaced metadata, and a fact-table Chore detail.

**Shared state:** Switching between Looks #3 and #4 preserves route and completion state because semantic state is renderer-independent.

**Shared correction:** `nextRoutine` deprioritizes completed routines before status sorting.

**Accessibility:** Dense presentation does not reduce critical targets below 48 px; Large Text and status-label requirements remain intact.

## 2026-08-01 — Look #5 adds friendly modular feedback

**Milestone:** Version `0.9.2` implements the Routine Completion Loop in Look #5 — Playful Modular.

**Presentation:** A colorful priority hero, secondary queue, modular Area and Section cards, separate completion/detail controls, and positive completed-state feedback.

**Tone boundary:** Friendly language may make the action feel lighter, but it must not trivialize backlog, alter urgency, or imply guilt when work remains.

**Reversibility:** Positive feedback never hides Undo. Completing from Today, Area, or Section still opens Chore detail with the same shared completion record.

**Cross-Look state:** Looks #3, #4, and #5 share semantic completion state. Switching visual systems changes presentation only.

**Accessibility:** Color is decorative and supplemental. Completed state also uses explicit text, a checkmark, and line-through; critical targets retain the 48 px floor.

## 2026-08-01 — Look #7 uses directness without changing Nudge's tone contract

**Milestone:** Version `0.9.3` implements the Routine Completion Loop in Look #7 — Bold Utility.

**Presentation:** One large priority action, explicit queue counters, thick rules, square controls, high-contrast status panels, and a compact fact-grid Chore detail.

**Tone boundary:** Bold hierarchy may be direct, but it must not shame the user, imply failure, or turn backlog into an alarm. The interface exposes priority while preserving choice.

**Action separation:** Routine rows use separate completion and detail targets. The full row does not accidentally complete a chore.

**Reversibility:** The completed screen states `DONE` and immediately presents Undo. Completion from Today, Area, or Section opens the same shared Chore detail state.

**Cross-Look state:** Looks #3, #4, #5, and #7 share semantic completion state. Visual switching does not reset or duplicate behavior.

**Accessibility:** Urgency colors are always repeated in text. Critical targets retain the 48 px floor; Large Text actions reach 54 px; forced-colors removes decorative shadows.

**Validation boundary:** The validator now encodes four interactive Looks and requires `look7-interactive.css`, but exact-checkout execution remains pending because direct cloning is DNS-blocked.

**Next active Look:** Look #6 — Tactile Household. It must preserve the same behavior while testing physical-control cues and household-tool affordances.

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
