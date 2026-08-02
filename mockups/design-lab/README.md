# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.9.6`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.9.6 Look #8 interactive slice](CHECKLIST-PROGRESS-0.9.6.md)
- [Look #8 interactive Routine Completion Loop](LOOK-8-INTERACTIVE.md)
- [Look #2 interactive Routine Completion Loop](LOOK-2-INTERACTIVE.md)
- [Look #6 interactive Routine Completion Loop](LOOK-6-INTERACTIVE.md)
- [Look #7 interactive Routine Completion Loop](LOOK-7-INTERACTIVE.md)
- [Look #5 interactive Routine Completion Loop](LOOK-5-INTERACTIVE.md)
- [Look #3 interactive Routine Completion Loop](LOOK-3-INTERACTIVE.md)
- [Look #4 interactive Routine Completion Loop](LOOK-4-INTERACTIVE.md)
- [Pure-Look implementation order](PURE-LOOK-IMPLEMENTATION-ORDER.md)
- [Interactive expansion decision record](INTERACTIVE-EXPANSION-DECISION.md)
- [Full-gallery browser evidence report](FULL-GALLERY-EVIDENCE-0.8.4.md)
- [Expanded gallery directions](EXPANDED-GALLERY-LOOKS.md)
- [Decisions and feedback log](DECISIONS.md)
- [Look #1 — Soft Practical Utility baseline](LOOK-1-SOFT-PRACTICAL-UTILITY.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Automated validation guide](VALIDATION.md)
- [Design Lab changelog](CHANGELOG.md)

## Safety boundary

- The protected Look #1 prototype remains under `mockups/prototype/` on `main` and is unchanged.
- Experimental files remain under `mockups/design-lab/`.
- Design Lab state is isolated from Look #1 and production storage.
- Nothing should merge into `main` until migration boundaries are intentionally reviewed.

## Complete visual gallery

Look #1 remains the protected Soft Practical Utility baseline. Active gallery directions are Looks #2 through #9. Every direction remains preserved; the implementation order is a learning sequence, not a ranking or elimination list.

All active directions have completed dedicated code-level quality passes. Browser presentation evidence exists cumulatively across versions 0.7.2 and 0.8.4, although it was not executed from one identical build.

The exact complete-checkout validator, physical Android checks, actual screen-reader smoke testing, and a single-version all-Look rerun remain pending.

## Approved interactive strategy

The user selected **Option A**: build one pure-Look vertical slice at a time.

Routine `go` messages advance automatically through this sequence:

1. Look #4 — Zen Focus — **implemented**
2. Look #3 — Precision Minimal — **implemented**
3. Look #5 — Playful Modular — **implemented**
4. Look #7 — Bold Utility — **implemented**
5. Look #6 — Tactile Household — **implemented**
6. Look #2 — Warm Editorial — **implemented**
7. Look #8 — Ambient Glass — **implemented**
8. Look #9 — Retro Digital — **next**

The first flow in every Look is the Routine Completion Loop:

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention count updates
→ Undo or reopen
```

After all eight Looks receive this flow, the feature order is Task hierarchy, Intervention-to-action, then Reusable Lists.

Look switching remains a Design Lab review control, prototype state remains isolated and deterministic, and Look #1 remains outside the implementation sequence.

## Interactive slices completed

- `0.9.0` — Look #4 Zen Focus: calm emphasis and one useful action at a time.
- `0.9.1` — Look #3 Precision Minimal: dense operational hierarchy and explicit metrics.
- `0.9.2` — Look #5 Playful Modular: colorful grouping and friendly reversible feedback.
- `0.9.3` — Look #7 Bold Utility: direct high-contrast hierarchy without guilt or alarm.
- `0.9.4` — Look #6 Tactile Household: work orders, service cards, drawers, and job-card completion.
- `0.9.5` — Look #2 Warm Editorial: a quiet daily page, contextual entries, and restrained completion notes.
- `0.9.6` — Look #8 Ambient Glass: translucent hierarchy with solid fallbacks and restrained completed-cycle feedback.

Looks #2 through #8 now share semantic completion state. Switching Looks changes presentation without resetting the route or routine result.

Direct cloning remains blocked by local DNS restrictions, so 0.9.6 does not claim an exact complete-checkout validator or browser run. Lower-end Ambient Glass paint and compositing measurements also remain pending. See `LOOK-8-INTERACTIVE.md` for the complete evidence boundary.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=8&screen=today&scenario=normal
?look=8&screen=area&area=kitchen&scenario=backlog
?look=8&screen=section&area=kitchen&section=Countertops%20%26%20Surfaces&scenario=normal
?look=8&screen=chore&area=kitchen&section=Countertops%20%26%20Surfaces&chore=kitchen-wipe-stovetop-1&scenario=normal
?look=2&screen=today&scenario=large-text
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Implement the Routine Completion Loop in Look #9 — Retro Digital, preserving the shared behavior while testing terminal-like density, explicit system status, and friendly command language.
