# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.7.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.7.0 review preparation](CHECKLIST-PROGRESS-0.7.0.md)
- [Automated validation guide](VALIDATION.md)
- [Round 1 route matrix](ROUND-1-ROUTES.md)
- [Round 1 review protocol](ROUND-1-REVIEW-PROTOCOL.md)
- [Round 1 scorecard](ROUND-1-SCORECARD.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial direction](LOOK-2-WARM-EDITORIAL.md)
- [Look #2 quality pass](LOOK-2-QUALITY.md)
- [Look #3 — Precision Minimal direction](LOOK-3-PRECISION-MINIMAL.md)
- [Look #3 quality pass](LOOK-3-QUALITY.md)
- [Look #4 — Zen Focus direction](LOOK-4-ZEN-FOCUS.md)
- [Look #4 quality pass](LOOK-4-QUALITY.md)
- [Look #6 — Tactile Household direction](LOOK-6-TACTILE-HOUSEHOLD.md)
- [Look #6 quality pass](LOOK-6-QUALITY.md)
- [Decisions and feedback log](DECISIONS.md)
- [Design Lab changelog](CHANGELOG.md)

The checklist remains the source of truth for scope, progress, review gates, and plan adjustments. Material changes require a pause, checklist review, and approved plan update before implementation continues.

## Safety boundary

- Existing Look #1 remains under `mockups/prototype/` and is unchanged.
- Experimental work remains under `mockups/design-lab/`.
- Design Lab state is isolated from Look #1.
- No Design Lab work should be merged into `main` until selection and migration decisions are recorded.

## Round 1 visual auditions

Every active aesthetic uses the same three scored product moments:

1. **Areas overview** — hierarchy, density, status, navigation, and scalability.
2. **Representative Area detail** — routine density, status treatment, and Section hierarchy.
3. **Intervention** — emotional tone, clarity, and supportive behavior.

Shared scenarios:

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

Active directions:

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

All four shortlisted Looks have equivalent Round 1 screens and scenarios and have completed code-level responsive, accessibility, contrast, long-content, and Large Text passes. Browser, device, keyboard, screen-reader, forced-colors, and comparative evidence remains pending.

## Architecture

The Design Lab uses browser-native ES modules without an application build step:

- `config.js` — version, Look registry, and allowed screens
- `fixtures.js` — shared immutable fixture and scenarios
- `utils.js` — escaping, cloning, and shared status calculations
- `state.js` — query routing, browser history, and isolated review state
- `controls.js` — shared review-panel controls
- `renderers/look2.js` — Warm Editorial presentation
- `renderers/look3.js` — Precision Minimal presentation
- `renderers/look4.js` — Zen Focus presentation
- `renderers/look6.js` — Tactile Household presentation
- `renderers/shared.js` — safe fallback presentation
- `styles.css` and `foundation.css` — shared shell and Warm Editorial styling
- `look3.css`, `look4.css`, `look6.css` — Look-specific styling
- `look6-quality.css` — Look #6 quality corrections
- `review.css` — labelled and phone-only screenshot layouts
- `app.js` — event and rendering coordinator
- `quality.js` — semantics, review metadata, and capture-mode labeling
- `validate-design-lab.mjs` — dependency-free fixture, import, renderer, route, version, HTML-reference, and CSS validation

Each aesthetic owns its presentation while consuming the same fixture and route state.

## Run locally

```bash
cd mockups/design-lab
python -m http.server 8080
```

Open `http://localhost:8080`.

## Run automated validation

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

The validator covers required files, imports, fixture invariants, renderer exports, 84 Look/screen/scenario route combinations, invalid-route fallbacks, state storage, version consistency, HTML references, stylesheet order, and CSS brace balance.

The validator has been syntax-checked, but this session could not execute it against a complete checkout because GitHub cloning was unavailable. The full-checkout run remains pending evidence.

## Review and capture modes

Use [`ROUND-1-REVIEW-PROTOCOL.md`](ROUND-1-REVIEW-PROTOCOL.md) for the exact browser, viewport, keyboard, screen-reader, forced-colors, stress, and screenshot procedure.

Append one of these parameters to a direct route:

- `capture=labelled` — stable 390 × 844 desktop phone frame with Look, screen, scenario, and version label.
- `capture=phone` — clean phone frame without the evidence label.

Examples:

```text
?look=2&screen=areas&scenario=normal&capture=labelled
?look=3&screen=area&area=kitchen&scenario=backlog&capture=labelled
?look=4&screen=intervention&scenario=normal&capture=phone
?look=6&screen=areas&scenario=large-text&capture=labelled
```

Use normal routes for interaction, responsive, browser-history, keyboard, and accessibility testing. Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the full route matrix and [`ROUND-1-SCORECARD.md`](ROUND-1-SCORECARD.md) for scoring.

## Round 1 fairness rule

Every active Look uses the same fixture, screens, scenarios, and simulated actions. Layout, typography, color, density, icons, and tone may change when meaning remains equivalent. No Look receives additional functionality during the same review round.

## Next work

Execute the shared browser/device/accessibility protocol, capture canonical and concern-specific evidence, map equivalent Look #1 evidence, and complete the scorecard. Do not begin Round 2 until the mandatory selection decision is reviewed and recorded.
