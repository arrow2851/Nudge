# Changelog — 0.11.6

## Look #8 — Ambient Glass Intervention-to-action

- Reused the shared scenario-isolated intervention state engine
- Added `renderers/look8-intervention.js` and `look8-intervention.css`
- Added Available, Active, Complete, and Set Aside phase views
- Preserved Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today actions
- Preserved shared intervention state across Looks #2 through #8
- Added current-app, fixture-pause, action-estimate, suggestion-position, and state facts
- Limited blur to the heading and facts surfaces while keeping the suggestion card mostly solid
- Added no-backdrop-filter solid fallbacks
- Added Reduced Transparency mode that removes blur, shadows, aurora, and decorative orbs
- Added narrow-screen, short-screen, Large Text, visible-focus, Forced Colors, and Reduced Motion handling
- Added validator checks for the renderer, stylesheet, solid fallbacks, and decorative-transparency language
- Set Look #9 — Retro Digital as the final Intervention-to-action implementation
- Kept lower-end Ambient Glass paint and compositing evidence explicitly pending
- Kept Look #1, `main`, production storage, live usage tracking, blocking, timers, notifications, and backend behavior unchanged
