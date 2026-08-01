# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.6.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.6.0](CHECKLIST-PROGRESS-0.6.0.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial direction](LOOK-2-WARM-EDITORIAL.md)
- [Look #2 quality pass](LOOK-2-QUALITY.md)
- [Look #3 — Precision Minimal direction](LOOK-3-PRECISION-MINIMAL.md)
- [Look #3 quality pass](LOOK-3-QUALITY.md)
- [Look #4 — Zen Focus direction](LOOK-4-ZEN-FOCUS.md)
- [Look #4 quality pass](LOOK-4-QUALITY.md)
- [Look #6 — Tactile Household direction](LOOK-6-TACTILE-HOUSEHOLD.md)
- [Decisions and feedback log](DECISIONS.md)
- [Design Lab changelog](CHANGELOG.md)

The checklist is the persistent source of truth for scope, progress, review gates, and plan adjustments. Material changes require a pause, a full checklist review, and an approved plan update before implementation continues.

## Safety boundary

- Existing Look #1 remains under `mockups/prototype/` and is unchanged.
- Experimental work lives under `mockups/design-lab/`.
- Design Lab review state uses its own query parameters and session-storage key.
- No Design Lab work should be merged into `main` until a review decision is made.

## Round 1 — Visual auditions

Each aesthetic is judged using the same three product moments:

1. **Areas overview** — hierarchy, density, status, navigation, and scalability.
2. **Representative Area detail** — routine density, status treatment, and Section hierarchy.
3. **Intervention** — emotional tone, clarity, and whether Nudge feels supportive rather than punitive.

Shared scenarios:

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

## Shortlisted directions

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

## Current implementation

All four shortlisted Round 1 auditions are implemented.

### Look #2 — Warm Editorial

- Areas overview
- Direct-linked Area detail
- Intervention
- All shared scenarios
- Responsive, accessibility, contrast, and Large Text corrections

### Look #3 — Precision Minimal

- Compact table-like Areas overview
- Direct-linked Area detail
- Direct but humane Intervention
- All shared scenarios
- Responsive, accessibility, forced-colors, long-content, and Large Text corrections

### Look #4 — Zen Focus

- Calm Areas overview with one suggested starting point and the full Area list
- Area detail with Start Here, complete attention visibility, Sections, and later routines
- Choice-centered Intervention
- All shared scenarios
- Responsive, contrast, Large Text, forced-colors, long-content, and screen-reader corrections

### Look #6 — Tactile Household

- Labeled maintenance-board Areas overview
- Area service card with raised priority job, checklist rows, and Section drawers
- Timer-panel Intervention with a removable-looking suggestion card
- All shared scenarios
- Initial narrow-phone, Long Content, Large Text, semantics, and forced-colors handling

Shared functionality includes desktop and mobile review controls, browser Back and Forward, Reset Review State, route fallbacks, isolated review state, and experimental-build labeling.

## Architecture

The Design Lab uses browser-native ES modules without a build step:

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
- `styles.css` — Warm Editorial and shared app-shell styling
- `look3.css` — Precision Minimal styling scoped to Look #3
- `look4.css` — Zen Focus styling scoped to Look #4
- `look6.css` — Tactile Household styling scoped to Look #6
- `app.js` — event and rendering coordinator
- `quality.js` — accessibility semantics and review metadata

Each aesthetic owns its presentation while consuming the same shared fixture and state.

## Run locally

```bash
cd mockups/design-lab
python -m http.server 8080
```

Open `http://localhost:8080`.

Example review routes:

```text
?look=2&screen=areas&scenario=normal
?look=3&screen=area&area=kitchen&scenario=long
?look=4&screen=intervention&scenario=backlog
?look=6&screen=areas&scenario=large
?look=6&screen=area&area=kitchen&scenario=large-text
?look=6&screen=intervention&scenario=long
```

## Round 1 fairness rule

Every active Look uses the same shared fixture and scenarios. Layout, typography, color, density, icons, and tone may change when meaning remains equivalent. No Look receives additional functionality during the same review round.

## Next audition work

Complete Look #6's responsive, accessibility, contrast, dense-data, and blocking-quality pass. Then run the shared Round 1 static and browser review work before the mandatory selection gate. Do not begin Round 2 until the selection decision is recorded.