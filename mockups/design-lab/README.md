# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.7.1`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.7.1 Look #1 baseline mapping](CHECKLIST-PROGRESS-0.7.1.md)
- [Look #1 — Soft Practical Utility baseline](LOOK-1-SOFT-PRACTICAL-UTILITY.md)
- [Round 1 review protocol](ROUND-1-REVIEW-PROTOCOL.md)
- [Round 1 scorecard](ROUND-1-SCORECARD.md)
- [Round 1 active-Look route matrix](ROUND-1-ROUTES.md)
- [Automated validation guide](VALIDATION.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial](LOOK-2-WARM-EDITORIAL.md) and [quality pass](LOOK-2-QUALITY.md)
- [Look #3 — Precision Minimal](LOOK-3-PRECISION-MINIMAL.md) and [quality pass](LOOK-3-QUALITY.md)
- [Look #4 — Zen Focus](LOOK-4-ZEN-FOCUS.md) and [quality pass](LOOK-4-QUALITY.md)
- [Look #6 — Tactile Household](LOOK-6-TACTILE-HOUSEHOLD.md) and [quality pass](LOOK-6-QUALITY.md)
- [Decisions and feedback log](DECISIONS.md)
- [Design Lab changelog](CHANGELOG.md)

The checklist remains the source of truth for scope, progress, review gates, and plan adjustments.

## Safety boundary

- The protected Look #1 prototype remains under `mockups/prototype/` on `main` and is unchanged.
- Experimental and comparison-only files remain under `mockups/design-lab/`.
- Design Lab state is isolated from Look #1.
- Nothing should merge into `main` until selection and migration decisions are recorded.

## Round 1 directions

Baseline:

- Look #1 — Soft Practical Utility

Active auditions:

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

All active auditions use the same three scored moments and seven scenarios. They have completed code-level responsive, accessibility, contrast, long-content, and Large Text passes. Browser, device, keyboard, screen-reader, forced-colors, screenshot, and comparative evidence remains pending.

## Look #1 comparison reference

`look1-reference.html` maps the shared fixture into the protected prototype's existing green, white-card, rounded-control visual language without editing `mockups/prototype/`.

Routes:

```text
look1-reference.html?screen=areas&scenario=normal
look1-reference.html?screen=area&area=kitchen&scenario=backlog
look1-reference.html?screen=intervention&scenario=normal
```

The Look #1 Intervention is visibly labeled as a **comparison-only extrapolation** because the current prototype does not contain an equivalent screen. Read `LOOK-1-SOFT-PRACTICAL-UTILITY.md` before scoring it.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

The validator covers required files, imports, fixture invariants, renderer wiring, 84 active-Look route combinations, the Look #1 reference, invalid-route fallbacks, state storage, version consistency, HTML references, stylesheet order, and CSS balance.

This session could syntax-check the relevant JavaScript and CSS but could not clone GitHub into a complete local checkout because DNS resolution for GitHub was unavailable. Full-checkout execution remains pending evidence.

## Capture modes

Append one of these parameters to an active-Look or Look #1 reference route:

- `capture=labelled` — stable 390 × 844 evidence frame with Look, screen, scenario, and version label.
- `capture=phone` — clean phone frame without the evidence label.

Examples:

```text
?look=2&screen=areas&scenario=normal&capture=labelled
?look=4&screen=intervention&scenario=normal&capture=phone
look1-reference.html?screen=area&area=kitchen&scenario=backlog&capture=labelled
```

Use normal routes for interaction, responsive, browser-history, keyboard, and accessibility testing. Follow `ROUND-1-REVIEW-PROTOCOL.md` and record results in `ROUND-1-SCORECARD.md`.

## Round 1 fairness rule

Every direction is reviewed against the same fixture, screens, scenarios, evidence order, and scoring criteria. The Look #1 Intervention limitation must remain explicit. No direction receives additional functionality during Round 1.

## Next work

Execute the validator in a complete checkout, run the browser/device/accessibility protocol, capture canonical evidence, fill the scorecard, and summarize borrowable components. Do not begin Round 2 until the mandatory selection decision is reviewed and recorded.
