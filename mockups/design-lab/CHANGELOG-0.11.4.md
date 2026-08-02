# Design Lab Changelog — 0.11.4

## 0.11.4 — 2026-08-02

### Look #6 — Tactile Household Intervention-to-action loop

- Reused the shared scenario-isolated intervention state engine.
- Added `renderers/look6-intervention.js` and `look6-intervention.css`.
- Added Available Card, Card in Hand, Filed Complete, and Returned to Tray presentations for the shared four phases.
- Added Start, Next, Dismiss, Resume, Complete, Reopen, Undo Start, and Return-to-Today actions.
- Added source-app, fixture-pause, action-estimate, card-position, and state facts.
- Added optional action-tray, paper-card, clip, drawer-pull, tab, and completion-slip cues.
- Preserved intervention phase and suggestion while switching among Looks #3, #4, #5, #6, and #7.
- Preserved Routine Completion and Task hierarchy state.
- Kept physical metaphors organizational rather than defect- or repair-based.
- Kept completion free of scoring, grading, service ratings, rankings, and performance measurement.
- Added narrow-screen, short-screen, Large Text, Forced Colors, visible-focus, and Reduced Motion handling.
- Extended validation to five intervention renderers and five dedicated style layers.
- Added `LOOK-6-INTERVENTION-ACTION.md` and `CHECKLIST-PROGRESS-0.11.4.md`.
- Set Look #2 — Warm Editorial as the next Intervention-to-action implementation.
- Kept real app detection, blocking, timers, notifications, accounts, backend integration, and production persistence outside the Design Lab boundary.
- Kept exact-checkout browser, physical Android, screen-reader, single-version regression, and Ambient Glass paint evidence pending.
- Kept Look #1 and `main` unchanged.
