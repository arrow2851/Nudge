# Nudge

Nudge is an Android-first, local-first productivity app that organizes chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype is live and under active feature-by-feature development. The native Android implementation has not started yet.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)
- [Areas and Sections milestone notes](docs/progress/areas-and-rooms.md)
- [Task and Chore detail milestone notes](docs/progress/task-and-chore-details.md)
- [Tasks checklist milestone notes](docs/progress/tasks-destination.md)

### Implemented prototype slices

- Simplified Today screen with Due Today, Overdue, Lists, Recent Activity, grading, and Undo
- Optional Daily Progress and Quick Win preference flags, both off by default
- Four-destination bottom navigation without a global floating add action
- Areas screen with shipped defaults
- Template-conditioned House Sections
- Nested Area and Section detail navigation
- Add and edit Area
- Add and edit Section
- Contextual task/chore creation from an Area or Section
- Due-only Section Reset with completion, grading, skipping, and progress
- Task and Chore detail screens
- Snooze, reschedule, skip occurrence, pause/resume recurrence, reopen, and recurrence-aware Chore completion
- Single checklist-style Tasks destination
- Top and bottom task-add controls that create blank inline-editable tasks
- Drag handles, completion checkboxes, inline task titles, and compact settings controls
- Manual, alphabetical, and due-date ordering
- Main tasks, nested subtasks, subtask progress, drag-to-nest, and release-to-root behavior
- Simple task settings for Main Task and Due Date
- Preference flags for optional due shorthand and reversed task-row order

## Product pillars

- Areas and optional Sections such as `House > Kitchen`
- Recurring chores with calendar-based or completion-based cadence
- Optional Light, Moderate, and Deep completion grading
- Reusable lists that remember completed items for future suggestions
- A lightweight checklist for one-time tasks
- Direct app-usage intervention with compatibility fallbacks
- Contextual, destination-specific creation flows instead of one global add action
- Widgets, voice, and Gemini-assisted entry where they add real value
- Local-first core functionality with optional cloud features later

## Documentation

- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)
- [Areas and Sections milestone notes](docs/progress/areas-and-rooms.md)
- [Task and Chore detail milestone notes](docs/progress/task-and-chore-details.md)
- [Tasks checklist milestone notes](docs/progress/tasks-destination.md)
- [Product requirements](docs/product-requirements.md)
- [Screens and rough wireframes](docs/screens-and-wireframes.md)
- [Technical architecture](docs/technical-architecture.md)
- [Delivery roadmap](docs/roadmap.md)
- [Open questions](docs/open-questions.md)
- [Project decisions](docs/adr/README.md)
- [Interactive prototype source](mockups/prototype/README.md)

## Proposed Android stack

- Kotlin
- Jetpack Compose and Material 3
- Navigation Compose
- Room
- DataStore
- WorkManager
- Hilt
- Kotlin Serialization
- Jetpack Glance widgets
- UsageStatsManager for selected-app usage sessions
- Optional Gemini backend integration

## Repository structure

```text
nudge/
├── app/                         # Android application module (future)
├── core/                        # Shared model, database, domain, UI (future)
├── feature/                     # Feature modules (future)
├── mockups/
│   └── prototype/               # Live browser prototype
├── docs/
│   ├── adr/
│   ├── progress/
│   ├── wireframes/
│   ├── product-requirements.md
│   ├── screens-and-wireframes.md
│   ├── technical-architecture.md
│   ├── roadmap.md
│   └── open-questions.md
├── PROJECT-STATUS.md            # Persistent editable progress tracker
├── .github/ISSUE_TEMPLATE/
├── CONTRIBUTING.md
└── README.md
```

## Immediate next step

Review the simplified Tasks checklist after deployment. Once enough task feedback has accumulated, implement the reusable Lists destination with a dedicated Create List flow, remembered-item suggestions, quantities, categories, duplicate handling, shopping/list sessions, and list history.

## License

No license has been selected yet.
