# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.2.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Look #2 — Warm Editorial direction](LOOK-2-WARM-EDITORIAL.md)
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

Look #2 is the active audition. It includes:

- Areas overview
- Direct-linked Area detail
- Intervention screen
- Desktop and mobile review controls
- Shared scenario switching
- Browser Back and Forward support
- Reset Review State
- Safe fallback for invalid routes
- Version and experimental-build labeling
- Reserved entries for Looks #3, #4, and #6

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
?look=2&screen=intervention&scenario=long
?look=3&screen=areas&scenario=large
```

## Round 1 fairness rule

Every active Look must use the same shared fixture and scenarios. Layout, typography, color, density, icons, and tone may change when meaning remains equivalent. No Look receives additional functionality during the same review round.

## Next audition work

Complete Look #2 phone-width and blocking-quality checks, then implement Look #3 — Precision Minimal using the exact same screens and scenarios. Do not expand Look #2 into the full app until the Round 1 finalists are selected.
