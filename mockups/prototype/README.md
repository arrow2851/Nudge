# Nudge Interactive Prototype

This folder contains the mobile-first browser prototype used to validate Nudge before native Android implementation.

## Run locally

```bash
cd mockups/prototype
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Implemented foundation

- Full-width, full-dynamic-height mobile shell
- Desktop review controls
- Hash-based navigation
- Persistent browser state through `localStorage`
- Shared design tokens and reusable UI components
- Four primary destinations: Today, Areas, Lists, and Tasks
- No global floating add action
- Mobile safe-area support
- Outer-page scrolling disabled on mobile; normal scrolling stays inside the app screen

## Today

- Due Today
- Expandable Overdue
- List shortcuts
- Recent activity
- Optional Daily Progress and Quick Win, both off by default
- Completion grading and Undo

## Areas and Sections

Areas is now the recurring-routine system, not a second Tasks manager.

- Only recurring Chores and maintenance appear in Areas
- One-time Tasks remain in the Tasks destination
- Areas overview shows total routines, due/overdue state, and the next relevant routine
- Area detail starts with due and overdue chores across all Sections
- Area-level checkboxes allow completion before navigating into a Section
- Section cards show routine counts and attention state
- Section detail groups Needs Attention, Coming Up, As Needed, and Paused
- Large left-side checkboxes support quick completion
- Tapping a routine opens richer Chore detail
- Top and bottom Add Chore controls
- Area-level entry can assign a Section
- `Add & another` and Enter-key submission support rapid setup
- Repeat and First Due are the primary creation controls
- Duration and completion grading are under More Options
- House and Car templates add missing Sections and starter chores
- Template due dates are staggered to avoid making every starter routine due at once
- As-needed chores remain reusable after completion

## Task and Chore details

- Lightweight one-time Task detail
- Richer recurring Chore detail
- Chore snooze, reschedule, skip, pause, grading, and recurrence-aware completion

## Shared Task and List item behavior

Tasks and reusable List items share the same core interaction model:

- Top-right and bottom add controls
- New items are inline editable only while being created
- Existing items open a bottom-sheet editor when tapped
- Checkbox on the left by default
- Swipe a root item right to make it a subitem of the item immediately above
- The row follows the finger during the swipe
- A revealed action label describes the pending indentation
- Ineligible swipes visibly snap back
- Hold the row to lift it into a floating, dimmed reorder preview
- A dashed placeholder shows the prospective drop position
- Neighboring rows animate into provisional positions
- Dragging near screen edges supports gradual auto-scroll
- Main items support nested subitems and completion progress
- Completed root items move below active items with Show/Hide Completed controls

## Task-only behavior

- Task name, Main Task, and Due Date in one editor
- Manual, A–Z, and Due ordering
- Optional light-gray due shorthand
- Reorder and indent operations affect one-time Tasks only, never Chores

## List-only behavior

- List item name, history suggestions, and Main Item in one editor
- History suggestions during inline creation and existing-item editing
- Completing an item updates remembered history
- Future preference for right-side List checkboxes
- No sessions, quantities, units, or categories

## Structure

```text
mockups/prototype/
├── index.html
├── README.md
├── styles/
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   ├── today.css
│   ├── areas.css
│   ├── task-detail.css
│   ├── tasks.css
│   ├── lists.css
│   └── checklist-gestures.css
└── scripts/
    ├── app.js
    ├── areas.js
    ├── areas-controller.js
    ├── router.js
    ├── state.js
    ├── task-actions.js
    ├── task-details.js
    ├── tasks.js
    ├── lists.js
    ├── checklist-gestures-v3.js
    └── lists-integration.js
```

## Prototype limitations

The following remain simulated until Android development:

- App-usage detection and direct redirect behavior
- Android notifications and widgets
- Real Gemini API requests
- Room/DataStore persistence
- Driving, call, meeting, and device-context detection

Phone interaction, keyboard behavior, accessibility alternatives, and final visual polish still require native-device review.

## Next implementation batch

Review the redesigned Areas, House, and Kitchen paths. The next focused milestone is the Direct Intervention prototype.