# Nudge Interactive Prototype

This folder contains the mobile-first browser prototype used to validate Nudge before native Android implementation.

## Run locally

Because the prototype uses JavaScript modules, serve this folder through a local HTTP server rather than opening `index.html` directly.

```bash
cd mockups/prototype
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Implemented foundation

- Responsive mobile device shell
- Desktop review controls
- Hash-based navigation
- Persistent browser state through `localStorage`
- Live status-bar clock
- Shared design tokens
- Light and dark theme tokens
- Reusable buttons, cards, chips, list rows, progress indicators, sheets, fields, empty states, and toasts
- Four-destination bottom navigation: Today, Areas, Lists, and Tasks
- No global floating add action
- Connected routes for Today, Areas, Area detail, Section detail, Item detail, Lists, Tasks, and More

## Current Today workflow

- Simple list-first default layout
- Due Today section
- Expandable Overdue section
- Active-list shortcuts
- Recent activity feed
- Optional Daily Progress preference, off by default
- Optional Quick Win preference, off by default
- Binary task completion
- Light, Moderate, and Deep completion grading
- Undo for supported changes
- Persistent activity and progress data

## Areas and Sections

- Shipped default Areas
- Template-conditioned Sections
- Area overview and detail
- Section overview and detail
- Add and edit Area
- Add and edit Section
- Contextual task/chore creation from an Area
- Optional Section assignment when adding from an Area
- Contextual task/chore creation from a Section
- Due-only Section Reset
- Section Reset completion, grading, skipping, and progress

## Task and Chore details

- Task and Chore detail routes
- Edit title, status, priority, Area, Section, duration, recurrence, notes, and Nudge eligibility
- Snooze and reschedule
- Skip occurrence
- Pause and resume recurrence
- Reopen completed tasks
- Recurrence-aware completion

## Tasks destination

- Inbox, Today, Upcoming, Waiting, Blocked, and Completed views
- Dedicated one-time task creation
- Starting status, due date, priority, Area, Section, duration, notes, and Nudge eligibility
- View-specific counts
- Local search
- Area, type, priority, and duration filters
- Due, priority, duration, date-added, and title sorting
- Due-date, Area, and priority grouping
- Quick completion
- Status changes
- Shared detail-screen integration
- View-specific and filtered empty states
- One-time model upgrade for existing prototype data

## Creation-flow rule

Each main destination owns its own creation experience:

- Areas and Sections create tasks or chores in context.
- Tasks creates one-time tasks through its dedicated form.
- Lists will receive a dedicated list and list-item creation flow.
- The former generic Quick Add flow is intentionally removed.

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
│   └── tasks.css
└── scripts/
    ├── app.js
    ├── areas.js
    ├── router.js
    ├── state.js
    ├── task-actions.js
    ├── task-details.js
    └── tasks.js
```

## Design-system responsibilities

- `tokens.css` owns colors, typography sizes, spacing, radii, shadows, device dimensions, and motion timing.
- `base.css` owns document reset, review layout, phone frame, status bar, scrolling behavior, navigation placement, and mobile breakpoints.
- `components.css` owns reusable controls and feedback components.
- Feature styles contain only layout and interaction rules that are specific to their screens.

## State and routing

- `state.js` is the temporary browser equivalent of a future Android `ViewModel + StateFlow + Room/DataStore` implementation.
- `router.js` provides hash routes that can later map to Navigation Compose destinations.
- `app.js` renders the shell and coordinates cross-feature interactions.
- `tasks.js` owns the Tasks route, task-view state, creation, filtering, sorting, grouping, and task-specific status controls.
- The internal field name `subareas` remains temporarily for stored-data compatibility; the user-facing term is Section.

## Prototype limitations

The following remain simulated until the Android build:

- `UsageStatsManager` app detection
- Background/direct activity launch permissions
- Android notifications and widgets
- Real Gemini API requests
- Room database and DataStore persistence
- Driving, call, meeting, and device-context detection

## Android translation map

| Prototype | Android implementation |
|---|---|
| JavaScript page renderer | Jetpack Compose screen/composable |
| Browser state store | ViewModel + StateFlow |
| `localStorage` | Room + DataStore |
| CSS design tokens | Material 3 theme tokens |
| Hash router | Navigation Compose |
| Bottom sheet | Material 3 `ModalBottomSheet` |
| Toast with Undo | Snackbar with action |
| Simulated redirect | UsageStatsManager + intervention coordinator |
| Local metadata parser | Deterministic parser with optional Gemini assistance |

## Next implementation batch

The next focused batch is reusable Lists:

- Lists collection screen
- Dedicated Create List flow
- Reusable List detail
- Remembered-item suggestions
- Quantities and categories
- Duplicate handling
- Shopping/list session
- List history and remembered-item catalog
