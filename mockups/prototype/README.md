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
- Outer-page scrolling disabled on mobile; normal scrolling is contained inside the app screen

## Today

- Due Today
- Expandable Overdue
- List shortcuts
- Recent activity
- Optional Daily Progress and Quick Win, both off by default
- Completion grading and Undo

## Areas and Sections

- Shipped default Areas
- Template-conditioned Sections
- Area and Section detail
- Contextual task/chore creation
- Due-only Section Reset

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
- Dragging near the screen edges supports gradual auto-scroll
- The item above automatically becomes a Main item after successful indentation
- Main items have a separate `+` for adding subitems
- Subitems appear indented
- Main items show a thin completion bar
- Completing a Main item completes all subitems
- Completing all subitems completes the Main item
- Reopening one subitem reopens the Main item
- Completed root items move below active root items
- Completed children move below active children inside their parent
- Show Completed / Hide Completed controls
- Completed children remain visible beneath unfinished parents

## Task-only behavior

- Task name, Main Task, and Due Date in one editor
- Manual, A–Z, and Due ordering
- Optional light-gray due shorthand
- Future reversed row-order preference
- Reorder and indent operations affect one-time Tasks only, never Chores

## List-only behavior

- List item name, history suggestions, and Main Item in one editor
- History suggestions during inline creation and existing-item editing
- Completing an item updates remembered history
- Exact active duplicates are prevented simply
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

Swipe distance, hold duration, gesture conflict handling, keyboard behavior, accessibility alternatives, and final visual polish still require native-device review.

## Next implementation batch

The next focused batch is the Direct Intervention prototype:

- Simulate Redirect
- Intervention screen
- Start Task
- Already Done
- Different Task
- Not Now
- Focus Mode
- Intervention settings and compatibility preview