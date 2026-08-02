# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.8.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.8.0 expanded gallery](CHECKLIST-PROGRESS-0.8.0.md)
- [Expanded gallery directions](EXPANDED-GALLERY-LOOKS.md)
- [Decisions and feedback log](DECISIONS.md)
- [Round 1 evidence report](ROUND-1-EVIDENCE-0.7.2.md)
- [Look #1 — Soft Practical Utility baseline](LOOK-1-SOFT-PRACTICAL-UTILITY.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Automated validation guide](VALIDATION.md)
- [Design Lab changelog](CHANGELOG.md)

## Safety boundary

- The protected Look #1 prototype remains under `mockups/prototype/` on `main` and is unchanged.
- Experimental and comparison-only files remain under `mockups/design-lab/`.
- Design Lab state is isolated from Look #1.
- Nothing should merge into `main` until migration boundaries are intentionally reviewed.

## Complete visual gallery

Baseline reference:

- Look #1 — Soft Practical Utility

Active gallery directions:

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #5 — Playful Modular
- Look #6 — Tactile Household
- Look #7 — Bold Utility
- Look #8 — Ambient Glass
- Look #9 — Retro Digital

The user explicitly chose to retain every direction rather than select a single winner. The former mandatory finalist-selection gate is no longer active.

Every active Look uses the same:

- Areas overview
- Representative Area detail
- Intervention
- Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text scenarios
- Routes, browser-history behavior, capture modes, and simulated actions

## Gallery policy

A later prototype may use:

- One pure Look throughout.
- Separate Look variants for different experiments.
- Controlled synthesis with one dominant visual foundation and explicitly documented borrowed components.

Unrestricted mixing within a single screen remains prohibited because it weakens coherence and makes evaluation meaningless.

## Evidence status

Looks #2, #3, #4, and #6 completed dedicated code-level quality passes and the 0.7.2 browser evidence run.

Looks #5, #7, #8, and #9 now have initial responsive, Large Text, long-content, reduced-motion, and forced-colors foundations. Their dedicated quality passes and full browser/device evidence are still pending.

## Look #1 comparison reference

`look1-reference.html` maps the shared fixture into the protected prototype's existing green, white-card, rounded-control visual language without editing `mockups/prototype/`.

The Look #1 Intervention is visibly labeled as a **comparison-only extrapolation** because the protected prototype does not contain an equivalent screen.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=5&screen=areas&scenario=normal
?look=7&screen=area&area=kitchen&scenario=backlog
?look=8&screen=intervention&scenario=long
?look=9&screen=areas&scenario=large-text
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Complete dedicated quality passes for Looks #5, #7, #8, and #9, then extend browser and device evidence across the complete eight-Look gallery.
