# Nudge Interactive Prototype

This folder contains the mobile-first browser prototype used to validate Nudge before native Android implementation.

## Run locally

```bash
cd mockups/prototype
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Implemented foundation

- Responsive mobile shell and desktop review controls
- Hash-based navigation
- Persistent browser state through `localStorage`
- Shared design tokens and reusable UI components
- Four primary destinations: Today, Areas, Lists, and Tasks
- No global floating add action

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

Tasks and reusable List items now share the same core interaction model:

- Top-right and bottom add controls
- New items are inline editable only while being created
- Existing items open a bottom-sheet editor when tapped
- Checkbox on the left by default
- Hold the row to reorder it
- Swipe a root item right to make it a subitem of the item immediately above
- The item above automatically becomes a Main item
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
│   └── lists.css
└── scripts/
    ├── app.js
    ├── areas.js
    ├── router.js
    ├── state.js
    ├── task-actions.js
    ├── task-details.js
    ├── tasks.js
    ├── lists.js
    └── lists-integration.js
```

## Prototype limitations

The following remain simulated until Android development:

- App-usage detection and direct redirect behavior
- Android notifications and widgets
- Real Gemini API requests
- Room/DataStore persistence
- Driving, call, meeting, and device-context detection

Swipe distance, drag hold duration, gesture conflict handling, auto-scroll, accessibility alternatives, and visual polish still require native-device review.

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