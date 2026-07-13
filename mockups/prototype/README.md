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

- Lightweight one-time Task detail with completion and a return to the checklist
- Richer Chore detail with recurrence, snooze, reschedule, skip, pause, and grading behavior
- Recurrence-aware Chore completion
- Reopen completed items

## Tasks checklist

- One checklist instead of workflow tabs
- `+` at the top right
- `+ Add task` below the checklist
- Both controls create a blank task and open the bottom-sheet editor
- Checkbox on the left by default
- Tappable task text area
- No permanent drag handle
- No permanent `>` details button
- Task name, Main Task, and Due Date share one bottom-sheet editor
- Optional light-gray due shorthand on the far right of the task text area
- Task title and due shorthand use separate layout columns and do not overlap
- Hold the task row to reorder it
- Manual ordering by default
- Alphabetical ordering
- Due-date ordering with alphabetical secondary sorting
- Main-task toggle
- Separate subtask-add segment for main tasks
- Nested subtasks
- Thin main-task progress bar based on completed subtasks
- Drag onto a main task to create a subtask
- Drag a subtask back among root tasks to release it
- Turning off Main Task releases all subtasks into the root checklist
- Due-date Set, Change, and Clear actions
- Preference flags for due shorthand and reversed row layout
- Completed tasks remain visible below active tasks for the current review version

## Reusable Lists

- Reusable-list collection with top and bottom New List actions
- `+` at the top right of each list
- `+ Add item` below the active items
- Both controls create a blank inline-editable item
- No permanent Add Item input section
- Checkbox on the left of every active item by default
- Future preference support for moving List checkboxes to the right
- No right-side per-item controls
- Tap item text to edit inline
- Clean remembered-history suggestions appear directly below the item being edited
- Suggestions filter while typing and fill the active row when selected
- Hold an item to reorder it
- Checked items disappear from the active list
- Checked names remain remembered for later suggestions
- Simple exact-duplicate prevention
- No shopping or list-session mode
- No quantity, unit, category, or active-item detail sheet

## Creation-flow rule

Each main destination owns its own creation experience:

- Areas and Sections create tasks or chores in context.
- Tasks creates blank checklist items and opens their lightweight editor.
- Lists creates reusable lists and blank inline list items.
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

## Design-system responsibilities

- `tokens.css` owns colors, typography sizes, spacing, radii, shadows, device dimensions, and motion timing.
- `base.css` owns document reset, review layout, phone frame, status bar, scrolling behavior, navigation placement, and mobile breakpoints.
- `components.css` owns reusable controls and feedback components.
- Feature styles contain only layout and interaction rules that are specific to their screens.

## State and routing

- `state.js` is the temporary browser equivalent of a future Android `ViewModel + StateFlow + Room/DataStore` implementation.
- `router.js` provides hash routes that can later map to Navigation Compose destinations.
- `app.js` renders the shell and coordinates cross-feature interactions.
- `tasks.js` owns task-checklist rendering, bottom-sheet editing, ordering, main/subtask relationships, due settings, and hold-to-drag behavior.
- `lists.js` owns reusable-list creation, top/bottom blank-item creation, inline editing, history suggestions, checking, and item reordering.
- `lists-integration.js` keeps Today list shortcuts synchronized with richer list records.
- The internal field name `subareas` remains temporarily for stored-data compatibility; the user-facing term is Section.

## Prototype limitations

The following remain simulated until the Android build:

- `UsageStatsManager` app detection
- Background/direct activity launch permissions
- Android notifications and widgets
- Real Gemini API requests
- Room database and DataStore persistence
- Driving, call, meeting, and device-context detection

Checklist drag behavior is implemented for phone review, but still requires broader device, accessibility, auto-scroll, and edge-case testing. Hold duration is a prototype value and should be tuned during native Android testing.

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
| Pointer-based checklist drag | Compose reorderable list and gesture handling |
| Simulated redirect | UsageStatsManager + intervention coordinator |

## Next implementation batch

Review the revised Tasks and Lists flows after deployment. The next focused batch is the Direct Intervention prototype:

- Simulate Redirect
- Intervention screen
- Start Task
- Already Done
- Different Task
- Not Now
- Focus Mode
- Intervention settings and compatibility preview
