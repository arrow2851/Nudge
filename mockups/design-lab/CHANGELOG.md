# Design Lab Changelog

## 0.7.2 — 2026-08-01

### Round 1 browser evidence

- Reconstructed the connected branch from draft PR #1 when direct cloning remained unavailable
- Executed 105 direct routes, 90 canonical viewport checks, and 35 stress-state routes
- Verified Long Content and Large Text action reachability after scrolling
- Exercised Area navigation, History API return, Look/scenario preservation, reset, invalid fallback, and Intervention feedback
- Verified visible keyboard focus and Enter activation of a focused Area
- Inspected the automated accessibility tree and found zero unnamed buttons in the audited dense route
- Emulated forced colors and reduced motion for all five directions without runtime errors
- Captured 15 canonical labelled screenshots
- Found and fixed root `html[data-look]` interception by scoping Look controls and semantics to `button[data-look]`
- Added `ROUND-1-EVIDENCE-0.7.2.md` and `ROUND-1-SCORECARD-0.7.2.md`
- Recorded Look #3 and Look #4 as provisional finalist recommendations pending the mandatory product-owner gate
- Updated the Design Lab to `0.7.2`

## 0.7.1 — 2026-08-01

### Look #1 baseline mapping

- Documented the protected Soft Practical Utility visual system, strengths, risks, and comparison rules
- Added `look1-reference.html`, `look1-reference.js`, and `look1-reference.css` under Design Lab without modifying `mockups/prototype/`
- Reused the shared fixture and all seven scenarios for equivalent baseline evidence
- Added Areas overview and Kitchen Area detail reference screens
- Added a visibly labeled comparison-only Intervention extrapolation because the current prototype has no Intervention screen
- Added labelled and phone-only capture support for Look #1
- Added Look #1 routes and evidence limitations to the review protocol and scorecard
- Extended validation coverage to the Look #1 reference files, shared-fixture import, screens, scenarios, HTML references, CSS, and version metadata
- Updated the Design Lab to `0.7.1`

## 0.7.0 — 2026-08-01

### Round 1 review preparation

- Added `capture=labelled` evidence mode with a stable 390 × 844 desktop phone frame
- Added `capture=phone` clean phone-frame mode
- Added automatic Look, screen, scenario, and version evidence labels
- Fixed capture-mode status time at 9:41 for comparable screenshots
- Added `ROUND-1-REVIEW-PROTOCOL.md` with browser, device, keyboard, screen-reader, forced-colors, reduced-motion, stress, and screenshot procedures
- Added `ROUND-1-SCORECARD.md` with shared 1–5 criteria and qualitative decision fields for Look #1 and Looks #2, #3, #4, and #6
- Added exact viewport and evidence filename conventions
- Kept capture mode presentation-only and separate from demo state
- Updated the Design Lab to `0.7.0`

## 0.6.1 — 2026-08-01

### Shared validation foundation

- Added dependency-free `validate-design-lab.mjs`
- Added required-file and relative-import checks
- Added renderer export and `app.js` routing checks for Looks #2, #3, #4, and #6
- Added shared fixture field, status, duration, count, clone, and fallback checks
- Added validation for 84 Look/screen/scenario route combinations
- Added invalid-route, Area-query, history-method, and isolated-storage checks
- Added version, HTML-reference, stylesheet-order, and CSS brace-balance checks
- Added `VALIDATION.md` and `ROUND-1-ROUTES.md`
- Syntax-checked the validator
- Documented that a complete-checkout execution remains pending because this session could not resolve GitHub for cloning

### Look #6 quality pass

- Darkened muted text where the darkest tactile gradient did not meet the small-text contrast target
- Corrected Large Text scaling across fixed-size headings, cards, labels, metadata, rows, status tags, and actions
- Ensured Large Text rules override 360 px reductions
- Reflowed the summary board and routine status tags on narrow screens
- Stacked long timer-panel metadata at very narrow widths
- Added overflow protection for Area, routine, Section, app, stamp, and Intervention content
- Added stronger Look-specific keyboard focus indicators
- Simplified Tactile routine status screen-reader announcements
- Removed nonessential perforation, paperclip, ticket-hole, and dashed-card details in forced-colors mode
- Added `look6-quality.css` and `LOOK-6-QUALITY.md`
- Updated the Design Lab to `0.6.1`

## 0.6.0 — 2026-08-01

### Look #6 — Tactile Household

- Added the fourth and final shortlisted Round 1 aesthetic
- Implemented Areas overview, representative Area detail, and Intervention
- Added labeled maintenance-board cards, raised checklist controls, stamped statuses, and Section-drawer rows
- Added a restrained warm material palette without photorealistic texture
- Added a supportive timer-panel Intervention with clear Start, alternative, and Not Now actions
- Reused all shared fixtures, routes, scenarios, and simulated actions
- Added initial narrow-phone, dense-list, Long Content, Large Text, screen-reader-summary, and forced-colors handling
- Added formal Tactile Household principles, versatility rules, and anti-patterns

## 0.5.1 — 2026-08-01

### Look #4 quality pass

- Corrected fixed-size Large Text behavior
- Added narrow-phone routine and status reflow
- Preserved every backlog item and full Area access
- Added long-content wrapping and richer semantics
- Corrected decorative positioning and overdue contrast
- Extended forced-colors handling

## 0.5.0 — 2026-08-01

### Look #4 — Zen Focus

- Added the third active Round 1 aesthetic
- Implemented Areas overview, Area detail, and Intervention
- Added one calm suggested starting point while retaining the complete information picture
- Added progressive emphasis, soft neutral roles, and a choice-centered Intervention
- Reused every shared fixture, route, scenario, and simulated action

## 0.4.1 — 2026-08-01

### Look #3 quality pass

- Added explicit narrow-phone reflow
- Corrected fixed-size Large Text behavior
- Improved small operational labels and long-content protection
- Added richer semantics and forced-colors support

## 0.4.0 — 2026-08-01

### Look #3 — Precision Minimal

- Added the second active Round 1 aesthetic
- Implemented Areas overview, Area detail, and Intervention
- Added compact grid hierarchy, cobalt accent treatment, and formal direction rules
- Reused every shared fixture, route, scenario, and simulated action

## 0.3.0 — 2026-08-01

### Modular architecture

- Split the monolithic controller into configuration, fixtures, utilities, state, controls, and per-Look renderer modules
- Added immutable shared fixtures and dedicated renderer boundaries
- Preserved query routing, browser history, reset behavior, and simulated actions
- Switched the Design Lab entry point to browser-native ES modules

## 0.2.1 — 2026-08-01

### Look #2 quality pass

- Improved narrow-phone and Large Text handling
- Expanded critical touch targets
- Added keyboard focus, selected-state semantics, skip navigation, and reduced-motion handling
- Corrected low-contrast supporting text

## 0.2.0 — 2026-08-01

### Shared foundation

- Added direct routes, browser Back and Forward, reset behavior, route fallbacks, and isolated review state
- Added visible Experimental Design Lab and version metadata
- Added Large Household, Long Content, Large Text, Work, Personal, and long-label fixture coverage
- Formalized comparison fairness and Warm Editorial direction rules

## 0.1.0 — 2026-08-01

- Created `feature/design-lab`
- Added the Design Lab shell
- Added Look #2 Warm Editorial
- Added the initial shared scenarios
- Reserved Looks #3, #4, and #6
- Added the master execution checklist
