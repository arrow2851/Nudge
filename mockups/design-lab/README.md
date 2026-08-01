# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.7.2`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.7.2 evidence milestone](CHECKLIST-PROGRESS-0.7.2.md)
- [Round 1 evidence report](ROUND-1-EVIDENCE-0.7.2.md)
- [Provisional Round 1 scorecard](ROUND-1-SCORECARD-0.7.2.md)
- [Look #1 — Soft Practical Utility baseline](LOOK-1-SOFT-PRACTICAL-UTILITY.md)
- [Round 1 review protocol](ROUND-1-REVIEW-PROTOCOL.md)
- [Blank scorecard template](ROUND-1-SCORECARD.md)
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

All active auditions use the same three scored moments and seven scenarios.

## Evidence status

The 0.7.2 evidence pass completed:

- 105 direct routes
- 90 canonical viewport checks
- 35 stress-state routes
- 10 long/Large-Text action-reachability checks
- keyboard focus and Enter activation
- automated accessibility-tree inspection
- forced-colors and reduced-motion emulation
- 15 canonical labelled captures

The browser pass found and corrected a shared click-routing defect: root `html[data-look]` intercepted non-Look clicks. Look handling and semantics are now scoped to `button[data-look]`.

Physical-device and actual screen-reader testing remain pending. Read `ROUND-1-EVIDENCE-0.7.2.md` for exact results and limitations.

## Look #1 comparison reference

`look1-reference.html` maps the shared fixture into the protected prototype's existing green, white-card, rounded-control visual language without editing `mockups/prototype/`.

Routes:

```text
look1-reference.html?screen=areas&scenario=normal
look1-reference.html?screen=area&area=kitchen&scenario=backlog
look1-reference.html?screen=intervention&scenario=normal
```

The Look #1 Intervention is visibly labeled as a **comparison-only extrapolation** because the current prototype does not contain an equivalent screen.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Capture modes

Append one of these parameters to an active-Look or Look #1 reference route:

- `capture=labelled` — stable 390 × 844 evidence frame with Look, screen, scenario, and version label.
- `capture=phone` — clean phone frame without the evidence label.

Use normal routes for interaction, responsive, browser-history, keyboard, and accessibility testing.

## Provisional review result

The automated and visual evidence provisionally ranks Look #3 and Look #4 as the strongest finalist candidates, with Look #2 as a credible focused-revision third candidate or component source. Look #1 remains the protected comparator, and Look #6 is provisionally Components only.

No finalist decision has been recorded. The mandatory Round 1 selection gate must be reviewed before Round 2 begins.
