# Nudge Areas — Style 2

This is a standalone comparison prototype for an **area-first** Areas experience. It does not replace or modify the existing prototype in `mockups/prototype`.

## Live review

- Style 2: `https://arrow2851.github.io/Nudge/mockups/areas-style-2/`
- Current prototype: `https://arrow2851.github.io/Nudge/`

## What this version tests

- Areas are the first navigation level: Kitchen, Bathroom, Living Room, Bedroom, and Car.
- Each Area shows its overall routine status and next relevant chore.
- Area detail combines due chores across Sections with a Section directory below.
- Empty Sections remain selectable and lead directly to setup.
- Section detail supports All, Due, Routine, As needed, and Completed filters.
- Chore setup keeps Area and Section contextual, with Repeat and First due as primary controls.
- Light, Moderate, and Deep are optional completion grades rather than frequency-navigation tiers.
- Add Area, Add Section, Add Chore, edit, pause, delete, completion grading, undo, and reset are interactive.
- Browser state uses the separate `nudge-areas-style-2-v1` local-storage key.

## Files

- `index.html` — comparison shell and mobile frame
- `styles.css` — standalone visual system
- `core.js` — seed data, state, status calculations, and shared row markup
- `views.js` — Areas, Area, Section, and Chore screens
- `sheets.js` — add/edit and completion-grade sheets
- `actions.js` — routing, filtering, persistence, and user interactions
