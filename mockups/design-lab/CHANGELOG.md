# Design Lab Changelog

## 0.9.4 — 2026-08-01

### Look #6 — Tactile Household Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Tactile Household Today / Needs Attention with a work board, top work order, and waiting cards
- Added interactive Area, Section, and Chore routes
- Converted service cards and Section drawers into real navigation controls
- Replaced static completion placeholders with separate working Complete and job-card controls
- Added service intervals, bench-time labels, job facts, completion slips, and immediate Reopen
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #3, #4, #5, #6, and #7
- Added `look6-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Extended the validator to cover five interactive Looks, thirty interactive renderer exports, five interactive stylesheets, and shared state hooks
- Added `LOOK-6-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.4.md`
- Set Look #2 — Warm Editorial as the next interactive implementation
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.3 — 2026-08-01

### Look #7 — Bold Utility Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Bold Utility Today / Needs Attention with one priority action and an explicit queue count
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with separate working Complete and detail controls
- Added thick-rule Chore facts, status panels, and a clear `DONE` state with immediate Undo
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #3, #4, #5, and #7
- Added `look7-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Extended the validator to cover four interactive Looks, twenty-four interactive renderer exports, four interactive stylesheets, and shared state hooks
- Added `LOOK-7-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.3.md`
- Set Look #6 — Tactile Household as the next interactive implementation
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.2 — 2026-08-01

### Look #5 — Playful Modular Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Playful Modular Today / Needs Attention with a friendly priority hero and secondary queue
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with working Complete and Reopen controls
- Added modular Chore facts and positive completed-state feedback with immediate Undo
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #3, #4, and #5
- Added `look5-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Extended the validator to cover three interactive Looks, eighteen interactive renderer exports, three interactive stylesheets, and shared state hooks
- Added `LOOK-5-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.2.md`
- Set Look #7 — Bold Utility as the next interactive implementation
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.1 — 2026-08-01

### Look #3 — Precision Minimal Routine Completion Loop

- Applied the shared Routine Completion behavior to a dense operational presentation
- Added Today, Area, Section, and Chore routes with compact metrics and metadata
- Added working Complete and Reopen controls
- Added `look3-interactive.css`
- Corrected `nextRoutine` so completed routines are deprioritized
- Expanded validation to Looks #3 and #4
- Added `LOOK-3-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.1.md`

## 0.9.0 — 2026-08-01

### Look #4 — Zen Focus Routine Completion Loop

- Established the shared deterministic Routine Completion behavior contract
- Added Today, Area, Section, and Chore routes
- Added completion, recurrence advancement, attention updates, and immediate Undo
- Added `interactive-state.js` and `look4-interactive.css`
- Added source, route, reconstructed-validator, and injected-browser evidence records
- Added `LOOK-4-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.0.md`

## 0.8.7 — 2026-08-01

### Pure-Look implementation order

- Recorded Option A and the delegated order: Looks #4, #3, #5, #7, #6, #2, #8, and #9
- Added `PURE-LOOK-IMPLEMENTATION-ORDER.md`
- Set routine `go` messages to continue automatically through the sequence

## 0.8.6 — 2026-08-01

### Interactive expansion planning

- Added the strategy decision record and vertical-slice candidates
- Defined the Routine Completion Loop and explicit first-slice exclusions

## 0.8.5 — 2026-08-01

### Full-gallery browser evidence record

- Recorded browser presentation evidence for Looks #5, #7, #8, and #9
- Added contact sheets and narrative/machine-readable evidence records
- Kept the reconstructed-harness limitation explicit

## 0.8.4 — 2026-08-01

- Completed Look #9 — Retro Digital quality pass
- Completed dedicated code-level quality gates for every active gallery direction

## 0.8.3 — 2026-08-01

- Completed Look #8 — Ambient Glass quality pass

## 0.8.2 — 2026-08-01

- Completed Look #7 — Bold Utility quality pass

## 0.8.1 — 2026-08-01

- Completed Look #5 — Playful Modular quality pass

## 0.8.0 — 2026-08-01

- Promoted Looks #5, #7, #8, and #9
- Completed the active gallery for Looks #2 through #9
- Expanded the route matrix and validation coverage

## 0.7.0–0.7.2 — 2026-08-01

- Added review tooling, capture modes, Look #1 mapping, browser evidence, and the shared interaction fix

## 0.6.0–0.6.1 — 2026-08-01

- Added and quality-passed Look #6 — Tactile Household

## 0.5.0–0.5.1 — 2026-08-01

- Added and quality-passed Look #4 — Zen Focus

## 0.4.0–0.4.1 — 2026-08-01

- Added and quality-passed Look #3 — Precision Minimal

## 0.3.0 — 2026-08-01

- Added modular renderer architecture and browser-native ES modules

## 0.2.0–0.2.1 — 2026-08-01

- Added shared scenarios, routes, fairness rules, stress data, and Look #2 quality corrections

## 0.1.0 — 2026-08-01

- Created `feature/design-lab`
- Added Look #2 — Warm Editorial
- Preserved Look #1 on `main`
