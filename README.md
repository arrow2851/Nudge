# Nudge

Nudge is an Android-first, local-first productivity app that organizes recurring chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype is live and under active feature-by-feature development. The native Android implementation has not started yet.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)
- [Areas and Sections milestone notes](docs/progress/areas-and-rooms.md)
- [Task and Chore detail milestone notes](docs/progress/task-and-chore-details.md)
- [Tasks checklist milestone notes](docs/progress/tasks-destination.md)
- [Reusable Lists milestone notes](docs/progress/lists-destination.md)

### Implemented prototype slices

- Simplified Today screen with Due Today, Overdue, Lists, Recent Activity, grading, and Undo
- Optional Daily Progress and Quick Win preference flags, both off by default
- Four-destination bottom navigation without a global floating add action
- Areas redesigned as a recurring-chore and maintenance system
- One-time Tasks kept separate from Areas
- Areas overview showing where attention is needed
- Area-level quick completion before Section navigation
- Dense Section routine checklists grouped by Needs Attention, Coming Up, As Needed, and Paused
- Top and bottom chore-add controls with Add & another for rapid setup
- House and Car templates that add missing Sections and starter chores without duplicating existing setup
- Staggered starter due dates so applying a template does not make every routine immediately due
- Reusable As-needed chores that remain available after completion
- Task and Chore details with recurrence-aware Chore behavior
- Single checklist-style Tasks destination
- Reusable Lists collection and list-detail routes
- Shared Task/List item behavior: inline-only creation, tap-to-edit sheets, hold-to-reorder, and swipe-right indentation
- Main Task and Main List item subitems with thin completion progress
- Parent completion cascades to children; child completion recalculates the parent
- Completed root items move to the bottom with Show/Hide Completed controls
- Task-only Due Date and optional gray due shorthand
- List history suggestions during creation and existing-item editing

## Product pillars

- Areas and optional Sections for recurring chores and maintenance
- A separate lightweight checklist for one-time Tasks
- Recurring chores with calendar-based or completion-based cadence
- Optional Light, Moderate, and Deep completion grading
- Reusable lists that remember completed items for future suggestions
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
- [Reusable Lists milestone notes](docs/progress/lists-destination.md)
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

Review the redesigned Areas, House, and Kitchen flows on a phone. The next major build milestone after this review is the Direct Intervention prototype.

## License

No license has been selected yet.