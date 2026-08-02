# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.8.6`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.8.6 interactive expansion planning](CHECKLIST-PROGRESS-0.8.6.md)
- [Interactive expansion decision record](INTERACTIVE-EXPANSION-DECISION.md)
- [Vertical slice candidates](VERTICAL-SLICE-CANDIDATES.md)
- [Full-gallery browser evidence report](FULL-GALLERY-EVIDENCE-0.8.4.md)
- [Machine-readable evidence summary](FULL-GALLERY-EVIDENCE-0.8.4.json)
- [Expanded gallery directions](EXPANDED-GALLERY-LOOKS.md)
- [Look #5 quality pass](LOOK-5-QUALITY.md)
- [Look #7 quality pass](LOOK-7-QUALITY.md)
- [Look #8 quality pass](LOOK-8-QUALITY.md)
- [Look #9 quality pass](LOOK-9-QUALITY.md)
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

Every active Look uses the same three screens, seven scenarios, routes, history behavior, capture modes, and simulated actions.

## Gallery policy

A later prototype may use one pure Look, separate Look variants for different experiments, or controlled synthesis with one dominant visual foundation and documented borrowed components.

Unrestricted mixing within a single screen remains prohibited because it weakens coherence and makes evaluation meaningless.

## Quality and evidence status

All active directions from Look #2 through Look #9 have completed dedicated code-level quality passes.

Looks #1, #2, #3, #4, and #6 were included in the 0.7.2 browser evidence run. Looks #5, #7, #8, and #9 completed the 0.8.4 browser presentation matrix recorded in the full-gallery evidence report. Together, the two runs provide browser evidence for every gallery direction, although they were not executed from one identical build.

The new-Look matrix passed 84 direct routes, 72 viewport checks, 28 stress checks, eight Long Content and Large Text reachability checks, four media-emulation checks, and four keyboard-focus checks. No tested route produced horizontal overflow or an unnamed visible button, and the minimum tested in-preview control size was 48 × 48 px.

The exact complete-checkout validator, physical Android checks, actual screen-reader smoke testing, and a single-version all-Look rerun remain pending. The evidence report states the reconstruction boundary in full.

Look #1 remains a protected comparison reference. Its Intervention is visibly labeled as a comparison-only extrapolation because the protected prototype does not contain an equivalent screen.

## Interactive expansion recommendation

The prepared decision package recommends:

1. One shared semantic behavior core with eight Design Lab visual adapters.
2. The Routine completion loop as the first vertical slice.
3. Look switching as a Design Lab review control only, not a product-facing theme feature.
4. Isolated deterministic prototype state with no production integration.

No vertical slice has been implemented. This is a material architecture and scope decision and remains intentionally blocked pending approval.

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

Approve the recommended interactive-expansion package or select an explicit alternative. Do not implement routing, state, or a vertical slice before that decision.
