# Design Lab Changelog

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
