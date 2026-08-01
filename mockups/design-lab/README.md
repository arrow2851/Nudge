# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.5.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.5.0](CHECKLIST-PROGRESS-0.5.0.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial direction](LOOK-2-WARM-EDITORIAL.md)
- [Look #2 quality pass](LOOK-2-QUALITY.md)
- [Look #3 — Precision Minimal direction](LOOK-3-PRECISION-MINIMAL.md)
- [Look #3 quality pass](LOOK-3-QUALITY.md)
- [Look #4 — Zen Focus direction](LOOK-4-ZEN-FOCUS.md)
- [Decisions and feedback log](DECISIONS.md)
- [Design Lab changelog](CHANGELOG.md)

The checklist and versioned progress entries are the persistent source of truth for scope, progress, review gates, and plan adjustments. Material changes require a hard stop and an approved checklist adjustment before implementation continues.

## Safety boundary

- Existing Look #1 remains under `mockups/prototype/` and is unchanged.
- Experimental work lives under `mockups/design-lab/`.
- Design Lab state uses separate query parameters and session storage.
- No Design Lab work should be merged into `main` until a review decision is documented.

## Round 1 — Visual auditions

Every aesthetic is judged using the same three product moments:

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

Three active Round 1 auditions are implemented:

### Look #2 — Warm Editorial

- Household-journal character
- Editorial hierarchy and restrained cards
- All shared screens and scenarios
- Code-level responsive and accessibility quality pass complete

### Look #3 — Precision Minimal

- Compact table-like hierarchy
- Monospaced operational metadata and cobalt accent
- All shared screens and scenarios
- Code-level responsive and accessibility quality pass complete

### Look #4 — Zen Focus

- One calm suggested starting point with the full status picture retained below
- Spacious Area detail with progressive emphasis
- Choice-centered Intervention
- All shared screens and scenarios
- Initial responsive, Large Text, screen-reader, and forced-colors handling included

Look #6 remains the next audition.

## Architecture

The Design Lab uses browser-native ES modules without a build step:

- `config.js` — version, Look registry, and allowed screens
- `fixtures.js` — shared immutable fixture and scenarios
- `utils.js` — escaping, cloning, and shared status calculations
- `state.js` — query routing, browser history, and isolated review state
- `controls.js` — shared review-panel controls
- `renderers/look2.js` — Warm Editorial
- `renderers/look3.js` — Precision Minimal
- `renderers/look4.js` — Zen Focus
- `renderers/shared.js` — queued-Look and safe fallback presentation
- `styles.css` — Warm Editorial and shared shell styling
- `look3.css` — Precision Minimal styling
- `look4.css` — Zen Focus styling
- `app.js` — event and rendering coordinator
- `quality.js` — accessibility semantics and review metadata

Every aesthetic consumes the same fixture, routes, scenario meanings, and simulated Round 1 actions.

## Run locally

```bash
cd mockups/design-lab
python -m http.server 8080
```

Open `http://localhost:8080`.

Example routes:

```text
?look=2&screen=areas&scenario=normal
?look=3&screen=area&area=kitchen&scenario=long
?look=4&screen=areas&scenario=backlog
?look=4&screen=area&area=work&scenario=large
?look=4&screen=intervention&scenario=large-text
```

## Round 1 fairness rule

Layout, typography, color, density, icons, and tone may change when product meaning remains equivalent. No Look receives additional functionality during the same review round.

## Next audition work

Complete Look #4’s responsive, accessibility, contrast, and blocking-quality review. Then define and implement Look #6 — Tactile Household. Do not expand any Look into the full app until the Round 1 finalists are selected.