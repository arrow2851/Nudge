# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)

The checklist is the persistent source of truth for scope, progress, review gates, and plan adjustments. Material changes require a pause, a full checklist review, and an approved plan update before implementation continues.

## Safety boundary

- Development branch: `feature/design-lab`
- Existing Look #1 remains under `mockups/prototype/` and is unchanged.
- Experimental work lives under `mockups/design-lab/`.
- No Design Lab work should be merged into `main` until a review decision is made.

## Round 1 — Visual auditions

Each aesthetic is judged first using the same two product moments:

1. **Areas overview** — hierarchy, density, status, navigation, and scalability.
2. **Intervention** — emotional tone, clarity, and whether Nudge feels supportive rather than punitive.

The same scenarios are reused across every look:

- Normal day
- Heavy backlog
- New user
- All clear

## Shortlisted directions

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #6 — Tactile Household

## Current implementation

Look #2 is the active audition. It includes:

- Areas overview
- Area detail
- Intervention screen
- Desktop and mobile review controls
- Shared scenario switching
- Query-string state for look, screen, and scenario
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
?look=2&screen=areas&scenario=backlog
?look=2&screen=intervention&scenario=normal
?look=3&screen=areas&scenario=normal
```

## Next audition work

Build Look #3 — Precision Minimal using the exact same screens and scenarios. Do not expand Look #2 into the full app until the first-round visual finalists are selected.
