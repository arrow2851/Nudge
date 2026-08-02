# Design Lab Changelog

## 0.8.4 — 2026-08-01

### Look #9 — Retro Digital quality pass

- Increased 6–8 px operational labels to readable standard sizes
- Increased completion controls to 48 × 48 px and critical actions to at least 48 px high
- Added explicit Large Text sizing and layout reflow
- Reflowed Area, routine, Section, meter, and Intervention layouts for narrow phones
- Corrected the status-meter fill to use the supplied percentage directly
- Lightened muted and structural tokens while retaining strong dark-theme contrast
- Added strong Look-specific focus indicators and long-content wrapping
- Improved Area, summary, routine-status, Section, timing, and suggested-task semantics
- Reframed command-heavy Intervention copy as an optional mode switch with `START TASK`, `SHOW ALTERNATE`, and `STAY HERE`
- Added higher-contrast and forced-colors behavior
- Added `look9-quality.css`, `LOOK-9-QUALITY.md`, and `CHECKLIST-PROGRESS-0.8.4.md`
- Extended validator coverage through the final quality stylesheet and load order
- Sourced the Look #1 comparison version from shared configuration
- Updated the Design Lab to `0.8.4`
- Completed dedicated code-level quality passes for every active gallery direction

## 0.8.3 — 2026-08-01

### Look #8 — Ambient Glass quality pass

- Increased microtext, metadata, status, and suggestion labels
- Increased completion controls and critical actions to accessible target sizes
- Added explicit narrow-screen and Large Text reflow
- Darkened gradient endpoints and muted text for stronger contrast
- Removed backdrop blur from repeated cards and panels
- Limited blur to focal surfaces and added solid unsupported-browser and reduced-transparency fallbacks
- Improved Area, summary, panel, Section, routine-status, and Intervention semantics
- Added stronger focus indicators, long-content wrapping, and forced-colors behavior
- Added `look8-quality.css`, `LOOK-8-QUALITY.md`, and `CHECKLIST-PROGRESS-0.8.3.md`
- Extended validator coverage to the Look #8 quality stylesheet and load order
- Updated the Design Lab to `0.8.3`

## 0.8.2 — 2026-08-01

### Look #7 — Bold Utility quality pass

- Increased 7–9 px operational labels to readable standard sizes
- Increased completion controls to 48 × 48 px and critical actions to at least 48 px high
- Reflowed the five-column Area table into multi-row narrow-screen and Large Text layouts
- Added strong Look-specific focus indicators
- Added long-content wrapping for Area, routine, Section, status, app, and action labels
- Darkened the action blue from `#2868ff` to `#174fc4`, raising white-text contrast to approximately `7.11:1`
- Improved Area, summary, routine-status, Section, and Intervention semantics
- Reframed `STOP. CHOOSE.` as `PAUSE. DECIDE.` and explicitly stated that staying or switching is valid
- Expanded forced-colors handling and removed nonessential shadows
- Added `look7-quality.css`, `LOOK-7-QUALITY.md`, and `CHECKLIST-PROGRESS-0.8.2.md`
- Extended validator coverage to the Look #7 quality stylesheet and load order
- Updated the Design Lab to `0.8.2`

## 0.8.1 — 2026-08-01

### Look #5 — Playful Modular quality pass

- Darkened muted text to clear small-text contrast targets on every alternating card color
- Increased very small metadata, status, recurrence, and suggestion labels
- Increased completion controls to 48 × 48 px and critical actions to at least 48 px high
- Added strong Look-specific keyboard focus indicators
- Reflowed Area status and routine status on narrow phone widths
- Added long-content wrapping for Area, Section, routine, recurrence, location, and action text
- Replaced ineffective inherited Large Text scaling with explicit fixed-size overrides and layout reflow
- Improved Area, summary, Section, routine-status, and Intervention semantics
- Added forced-colors system-color treatment and removed decorative color dependence
- Added `look5-quality.css`, `LOOK-5-QUALITY.md`, and `CHECKLIST-PROGRESS-0.8.1.md`
- Extended validator coverage to the quality stylesheet and load order
- Updated the Design Lab to `0.8.1`

## 0.8.0 — 2026-08-01

### Complete visual gallery

- Recorded the user decision to retain every direction rather than choose a single winner
- Removed the mandatory finalist-selection gate
- Promoted Look #5 — Playful Modular
- Promoted Look #7 — Bold Utility
- Promoted Look #8 — Ambient Glass
- Promoted Look #9 — Retro Digital
- Implemented Areas overview, representative Area detail, and Intervention for all four new Looks
- Reused all seven shared scenarios, routes, capture modes, history behavior, and simulated actions
- Added initial responsive, Large Text, long-content, reduced-motion, and forced-colors foundations
- Added `expanded-looks.css` and four dedicated renderer modules
- Expanded the active route matrix from 84 to 168 combinations
- Replaced the validator with an expanded-gallery validator covering Looks #2 through #9
- Added `EXPANDED-GALLERY-LOOKS.md` and `CHECKLIST-PROGRESS-0.8.0.md`
- Updated the gallery policy to allow pure Looks, separate feature experiments, and controlled synthesis
- Kept Look #1 protected and unchanged

## 0.7.2 — 2026-08-01

### Browser evidence and shared interaction fix

- Reconstructed the connected branch from draft PR #1 when direct cloning remained unavailable
- Executed direct-route, viewport, stress-state, Long Content, and Large Text checks for Look #1 and Looks #2, #3, #4, and #6
- Exercised navigation, History API return, reset, invalid fallback, and Intervention feedback
- Inspected keyboard focus, automated accessibility-tree output, forced colors, and reduced motion
- Captured canonical labelled screenshots
- Fixed root `html[data-look]` interception by scoping Look controls to `button[data-look]`
- Added the evidence report and provisional scorecard

## 0.7.0–0.7.1 — 2026-08-01

### Review preparation and baseline mapping

- Added labelled and phone-only capture modes
- Added the review protocol and shared scorecard
- Added the comparison-only Look #1 shared-fixture reference
- Documented the Look #1 Intervention limitation

## 0.6.0–0.6.1 — 2026-08-01

### Look #6 — Tactile Household

- Implemented the fourth original audition
- Added tactile maintenance-board, checklist, Section-drawer, and timer-panel treatments
- Completed its responsive, contrast, Large Text, semantics, and forced-colors quality pass
- Added the shared static validation foundation

## 0.5.0–0.5.1 — 2026-08-01

### Look #4 — Zen Focus

- Added calm progressive emphasis, one gentle starting point, and a choice-centered Intervention
- Completed responsive, density, Large Text, contrast, semantics, and forced-colors corrections

## 0.4.0–0.4.1 — 2026-08-01

### Look #3 — Precision Minimal

- Added compact operational hierarchy, aligned metadata, and a restrained cobalt accent
- Completed narrow-screen, long-content, Large Text, semantics, contrast, and forced-colors corrections

## 0.3.0 — 2026-08-01

### Modular architecture

- Split the controller into configuration, fixtures, utilities, routing state, review controls, and per-Look renderers
- Switched the Design Lab to browser-native ES modules

## 0.2.0–0.2.1 — 2026-08-01

### Shared foundation and Look #2 quality

- Added shared scenarios, routes, fairness rules, stress data, and visible experimental metadata
- Completed Look #2 responsive, accessibility, touch-target, focus, and contrast corrections

## 0.1.0 — 2026-08-01

- Created `feature/design-lab`
- Added the Design Lab shell and Look #2 — Warm Editorial
- Preserved Look #1 on `main`
