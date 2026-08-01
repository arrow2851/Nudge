# Design Lab Changelog

## 0.4.1 — 2026-08-01

### Look #3 quality pass

- Added explicit 420 px and 370 px responsive reflow behavior
- Corrected Large Text behavior for fixed-size labels and content
- Increased undersized operational labels while preserving compact density
- Prevented long Area, routine, Section, app, and intervention metadata from causing horizontal overflow
- Added Area-row, attention-summary, detail-metric, Section-row, and routine-status semantics
- Added forced-colors support
- Documented contrast values and remaining actual-browser review work

## 0.4.0 — 2026-08-01

### Look #3 — Precision Minimal

- Added the second active Round 1 aesthetic
- Implemented Areas overview, representative Area detail, and Intervention
- Added compact grid-based information hierarchy and cobalt accent treatment
- Reused all shared fixtures, routes, scenarios, and simulated actions
- Added formal Precision Minimal principles and anti-patterns

## 0.3.0 — 2026-08-01

### Modular architecture

- Split the former monolithic controller into configuration, fixtures, utilities, routing state, review controls, and renderer modules
- Added a dedicated `renderers/` boundary so each new Look can own its presentation without duplicating shared data or routing
- Kept the shared scenario fixture immutable and cloned per render
- Preserved query-string routes, browser history, reset behavior, simulated actions, and Look #2 output
- Switched the Design Lab entry point to an ES module
- Updated build metadata to `0.3.0`

### Validation

- Passed syntax checks for every module
- Verified all relative imports resolve to existing files
- Kept every change under `mockups/design-lab/`

## 0.2.1 — 2026-08-01

### Look #2 quality pass

- Improved narrow-phone and Large Text handling
- Expanded critical touch targets
- Added keyboard focus, selected-state semantics, skip navigation, and reduced-motion handling
- Corrected low-contrast supporting and navigation text
- Documented remaining actual-device and assistive-technology checks

## 0.2.0 — 2026-08-01

### Shared foundation

- Added direct routes for Areas overview, Area detail, and Intervention
- Added browser Back and Forward support
- Preserved the active screen and scenario when switching Looks
- Added safe fallback behavior for invalid Look, screen, scenario, and Area values
- Added a Reset Review State control
- Added isolated Design Lab session storage with query parameters as the source of truth
- Added visible Experimental Design Lab labeling
- Added Design Lab version and build-date metadata

### Shared scenarios

- Added Large Household
- Added Long Content
- Added Large Text
- Added Work and Personal content
- Added long Area, Section, Chore, and Intervention labels
- Documented exact scenario purposes and expected states

### Look #2

- Added formal Warm Editorial principles, versatility rules, motion intent, and anti-patterns
- Continued to limit Round 1 actions to equivalent simulations

## 0.1.0 — 2026-08-01

- Created `feature/design-lab`
- Added the Design Lab shell
- Added Look #2 Warm Editorial Areas, Area detail, and Intervention auditions
- Added Normal Day, Heavy Backlog, New User, and All Clear scenarios
- Reserved Look #3 Precision Minimal, Look #4 Zen Focus, and Look #6 Tactile Household
- Added the master Design Lab checklist