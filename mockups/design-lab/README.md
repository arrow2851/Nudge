# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.4.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.4.0](CHECKLIST-PROGRESS-0.4.0.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial direction](LOOK-2-WARM-EDITORIAL.md)
- [Look #2 quality pass](LOOK-2-QUALITY.md)
- [Look #3 — Precision Minimal direction](LOOK-3-PRECISION-MINIMAL.md)
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
2. **Representative Area detail** — routine density, status treatment, and section hierarchy.
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

Two active Round 1 auditions are implemented:

### Look #2 — Warm Editorial

- Areas overview
- Direct-linked Area detail
- Intervention
- All shared scenarios
- Responsive and accessibility corrections

### Look #3 — Precision Minimal

- Compact table-like Areas overview
- Direct-linked Area detail
- Direct but humane Intervention
- All shared scenarios
- Dedicated Look-specific stylesheet

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
- `renderers/shared.js` — queued-Look and safe fallback presentation
- `styles.css` — Warm Editorial and shared app-shell styling
- `look3.css` — Precision Minimal styling scoped to Look #3
- `app.js` — event and rendering coordinator
- `quality.js` — accessibility semantics and review metadata

Each new aesthetic receives its own renderer and optional Look-specific stylesheet while consuming the same shared fixture and state.

## Run locally

```bash
cd mockups/design-lab
python -m http.server 8080
```

Open `http://localhost:8080`.

Example review routes:

```text
?look=2&screen=areas&scenario=normal
?look=2&screen=area&area=kitchen&scenario=backlog
?look=3&screen=areas&scenario=large
?look=3&screen=area&area=kitchen&scenario=long
?look=3&screen=intervention&scenario=normal
```

## Round 1 fairness rule

Every active Look must use the same shared fixture and scenarios. Layout, typography, color, density, icons, and tone may change when meaning remains equivalent. No Look receives additional functionality during the same review round.

## Next audition work

Complete the Look #3 responsive, accessibility, and blocking-quality pass. Then define and implement Look #4 — Zen Focus using the exact same screens, scenarios, routes, and simulated actions.
