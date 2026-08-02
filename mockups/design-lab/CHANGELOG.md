# Design Lab Changelog

## 0.9.1 — 2026-08-01

### Look #3 — Precision Minimal Routine Completion Loop

- Reused the deterministic Routine Completion state engine introduced in 0.9.0
- Added Precision Minimal Today / Needs Attention with explicit queue and Area counts
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with working Complete and Reopen controls
- Added compact Chore status, recurrence, schedule, duration, and next-state facts
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching between Looks #3 and #4
- Added `look3-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Raised Precision Minimal critical controls to at least 48 px and Large Text actions to at least 54 px
- Corrected `nextRoutine` so completed routines are deprioritized after advancing to Upcoming
- Expanded the validator to cover two interactive Looks, twelve interactive renderer exports, both interactive stylesheets, and shared state hooks
- Added `LOOK-3-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.1.md`
- Set Look #5 — Playful Modular as the next interactive implementation
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.0 — 2026-08-01

### Look #4 — Zen Focus Routine Completion Loop

- Added isolated deterministic interactive state under a dedicated session-storage namespace
- Added stable routine identifiers and prototype Light, Moderate, and Deep recurrence tiers
- Expanded route state to Today, Area, Section, and Chore detail
- Implemented Today / Needs Attention for Zen Focus
- Implemented Area → Section → Chore navigation
- Implemented completion from Today, Area, Section, and Chore detail
- Advanced completed routines to deterministic next-cycle states
- Recalculated attention counts and All Clear from the updated state
- Added immediate Undo or reopen behavior
- Changed direct completion to open completed Chore detail so Undo remains visible
- Added browser-history-compatible Section and Chore query parameters
- Added `interactive-state.js` and `look4-interactive.css`
- Added narrow-screen, short-screen, landscape, Large Text, forced-colors, and reduced-motion treatment
- Raised critical interactive targets to at least 48 px
- Extended the validator for the six-view Look #4 interaction contract
- Completed syntax, module, route, renderer, reconstructed-validator, and injected-Chromium smoke checks
- Added `LOOK-4-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.0.md`
- Documented the injected-reconstruction evidence boundary; exact-checkout browser validation remains pending
- Set Look #3 — Precision Minimal as the next interactive implementation
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.8.7 — 2026-08-01

### Pure-Look implementation order

- Recorded the user's delegation of the first Look and the complete remaining order
- Selected Look #4 — Zen Focus for the first Routine Completion Loop
- Set the remaining order to Looks #3, #5, #7, #6, #2, #8, and #9
- Clarified that the order is a learning and technical-risk sequence, not a ranking or elimination list
- Added `PURE-LOOK-IMPLEMENTATION-ORDER.md`
- Added `CHECKLIST-PROGRESS-0.8.7.md`
- Resolved the visual-selection hard stop
- Set routine `go` messages to advance through the recorded sequence
- Set later feature order to Task hierarchy, Intervention-to-action, then Reusable Lists
- Kept Look #1 protected and outside the implementation sequence
- Kept Look switching Design Lab-only
- Kept prototype state isolated and deterministic
- Did not merge into `main`

## 0.8.6 — 2026-08-01

### Interactive expansion planning

- Added `INTERACTIVE-EXPANSION-DECISION.md`
- Added `VERTICAL-SLICE-CANDIDATES.md`
- Added `CHECKLIST-PROGRESS-0.8.6.md`
- Compared pure-Look, feature-specific, shared-core multi-Look, and two-family fallback strategies
- Recommended one shared semantic behavior core with eight Design Lab visual adapters
- Recommended the Routine completion loop as the first vertical slice
- Recommended keeping Look switching inside the Design Lab rather than adding a product-facing theme setting
- Recommended deterministic isolated prototype state with no production integration
- Defined semantic-layer and Look-owned presentation boundaries
- Defined the scripted cross-Look acceptance path
- Defined explicit first-slice exclusions
- Recorded the pending architecture decision in `DECISIONS.md`
- Updated README, checklist, build labels, and Design Lab metadata to `0.8.6`
- Did not implement routing, state, or a vertical slice
- Kept the protected Look #1 prototype and `main` unchanged

## 0.8.5 — 2026-08-01

### Full-gallery browser evidence record

- Added browser presentation evidence for Looks #5, #7, #8, and #9
- Recorded 84/84 direct routes, 72/72 viewport checks, 28/28 stress checks, 8/8 Long Content and Large Text reachability checks, 4/4 media-emulation checks, and 4/4 keyboard-focus checks
- Confirmed no tested horizontal-overflow or unnamed-visible-button failures
- Confirmed a minimum tested in-preview control size of 48 × 48 px
- Generated nine-direction comparison contact sheets for Areas, Area detail, and Intervention
- Added `FULL-GALLERY-EVIDENCE-0.8.4.md` and `FULL-GALLERY-EVIDENCE-0.8.4.json`
- Added `CHECKLIST-PROGRESS-0.8.5.md`
- Updated gallery status, checklist, README, build labels, and Look metadata
- Documented that the run used a reconstructed harness rather than an exact complete checkout
- Left exact validator execution, physical Android testing, actual screen-reader testing, lower-end Ambient Glass performance testing, and a single-build all-Look rerun pending
- Kept every repository change under `mockups/design-lab/`
- Kept `main` and the protected Look #1 prototype unchanged

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
