# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.9.3`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.9.3 Look #7 interactive slice](CHECKLIST-PROGRESS-0.9.3.md)
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
5. Look #6 — Tactile Household — **next**
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

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

### 0.9.0 — Look #4 Zen Focus

Established the shared behavior contract with calm emphasis and one useful action at a time.

### 0.9.1 — Look #3 Precision Minimal

Applied the same behavior to a dense operational presentation with explicit metrics and compact metadata.

### 0.9.2 — Look #5 Playful Modular

Applied the shared behavior to colorful modular grouping and friendly reversible completion feedback.

### 0.9.3 — Look #7 Bold Utility

Applies the same behavior to a direct, high-contrast system:

- Large priority action and explicit queue count.
- Thick-rule Area, Section, and Chore structures.
- Separate completion and detail controls.
- Text-backed urgency states and a clear `DONE` panel.
- Immediate Undo with shared semantic state across Looks #3, #4, #5, and #7.
- Narrow-screen, Large Text, forced-colors, reduced-motion, and focus-visible treatment.

Direct cloning remains blocked by local DNS restrictions, so 0.9.3 does not claim an exact complete-checkout validator or browser run. See `LOOK-7-INTERACTIVE.md` for the complete evidence boundary.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=7&screen=today&scenario=normal
?look=7&screen=area&area=kitchen&scenario=backlog
?look=7&screen=section&area=kitchen&section=Countertops%20%26%20Surfaces&scenario=normal
?look=7&screen=chore&area=kitchen&section=Countertops%20%26%20Surfaces&chore=kitchen-wipe-stovetop-1&scenario=normal
?look=5&screen=today&scenario=large-text
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Implement the Routine Completion Loop in Look #6 — Tactile Household, preserving the shared behavior while testing physical-control cues and household-tool affordances.
