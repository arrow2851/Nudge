# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.9.7`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.9.7 all-Look Routine Completion](CHECKLIST-PROGRESS-0.9.7.md)
- [Look #9 interactive Routine Completion Loop](LOOK-9-INTERACTIVE.md)
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
- [Decisions and feedback log](DECISIONS.md)
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

## Routine Completion complete in every active Look

The user selected **Option A**: build one pure-Look vertical slice at a time.

The completed sequence is:

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

Every active Look now implements:

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

Looks #2 through #9 share semantic completion state. Switching Looks changes presentation without resetting the route or routine result.

## Interactive milestones

- `0.9.0` — Look #4 Zen Focus
- `0.9.1` — Look #3 Precision Minimal
- `0.9.2` — Look #5 Playful Modular
- `0.9.3` — Look #7 Bold Utility
- `0.9.4` — Look #6 Tactile Household
- `0.9.5` — Look #2 Warm Editorial
- `0.9.6` — Look #8 Ambient Glass
- `0.9.7` — Look #9 Retro Digital and completion of the eight-Look sequence

## Validation boundary

The static validator now covers:

- Eight interactive Looks.
- Forty-eight interactive renderer exports.
- Eight dedicated interactive stylesheets.
- Shared completion, recurrence, Undo, route, and state-preservation hooks.
- Responsive, Large Text, forced-colors, and reduced-motion contracts.
- Ambient Glass reduced-transparency and no-backdrop-filter fallbacks.

Still pending:

- Exact complete-checkout validator execution.
- Exact complete-checkout interactive browser run.
- Physical Android testing.
- Actual screen-reader smoke testing.
- Lower-end Ambient Glass paint/compositing measurements.
- A single-version browser regression across every Look.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=9&screen=today&scenario=normal
?look=9&screen=area&area=kitchen&scenario=backlog
?look=9&screen=section&area=kitchen&section=Countertops%20%26%20Surfaces&scenario=normal
?look=9&screen=chore&area=kitchen&section=Countertops%20%26%20Surfaces&chore=kitchen-wipe-stovetop-1&scenario=normal
?look=4&screen=today&scenario=large-text
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Begin the **Task hierarchy loop** in Look #4 — Zen Focus, then continue through the delegated Look order unless a material scope or architecture decision requires a hard stop.
