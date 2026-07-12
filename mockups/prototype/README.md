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

## Current foundation

The first implementation batch provides:

- Responsive mobile device shell
- Desktop review controls
- Hash-based navigation
- Persistent browser state through `localStorage`
- Live status-bar clock
- Shared design tokens
- Light and dark theme tokens
- Reusable buttons, cards, chips, list rows, progress indicators, sheets, fields, empty states, and toasts
- Bottom navigation and floating Quick Add action
- Working Quick Add sheet
- Working task completion and demo reset behavior
- Connected placeholder routes for Areas, Lists, Tasks, and More

## Structure

```text
mockups/prototype/
├── index.html
├── README.md
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── components.css
└── scripts/
    ├── app.js
    ├── router.js
    └── state.js
```

## Design-system responsibilities

- `tokens.css` owns colors, typography sizes, spacing, radii, shadows, device dimensions, and motion timing.
- `base.css` owns document reset, review layout, phone frame, status bar, scrolling behavior, navigation placement, and mobile breakpoints.
- `components.css` owns reusable controls and feedback components.

Feature-specific styles should be added only when a shared component cannot express the design cleanly.

## State and routing

- `state.js` is the temporary browser equivalent of a future Android `ViewModel + StateFlow + Room/DataStore` implementation.
- `router.js` provides simple hash routes that can later map to Navigation Compose destinations.
- `app.js` renders the shell and coordinates interactions.

## Prototype limitations

The following remain simulated until the Android build:

- `UsageStatsManager` app detection
- Background/direct activity launch permissions
- Android notifications and widgets
- Real Gemini API requests
- Room and DataStore persistence
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
| Toast | Snackbar |
| Simulated redirect | UsageStatsManager + intervention coordinator |
| Local Gemini parser | Gemini function calling through a secure backend |

## Next implementation batch

The next focused batch is the complete Today experience:

- Daily progress
- Quick Win behavior
- Due Today
- Overdue section
- Active lists
- Recent activity
- Quick Add metadata detection
- Completion grading and Undo
