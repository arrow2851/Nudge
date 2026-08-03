# Nudge

Nudge is an Android-first, local-first productivity app that organizes recurring chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype remains the product and interaction reference. Native Android Phases 1–3 are complete and verified on `feature/android-app-development`. Development now proceeds to Phase 4: the complete Tasks vertical slice.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Native Android development checklist](docs/progress/android-development.md)
- [Compose design system](docs/design-system.md)
- [Local data foundation](docs/local-data-foundation.md)
- [Android development pull request](https://github.com/arrow2851/Nudge/pull/2)
- [Verified Phase 3 Android CI run](https://github.com/arrow2851/Nudge/actions/runs/30826025127)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)

### Verified native Android foundation

- Kotlin and Jetpack Compose application module
- Material 3 and Navigation Compose
- Hilt dependency injection with KSP and AGP 9 support
- API 26 minimum and API 37 compile/target configuration
- Java 17, AGP 9.3, and Gradle 9.5 build configuration
- Hilt-enabled application and single Compose activity
- GitHub Actions lint, test, assemble, schema, APK artifact, and emulator workflow

### Verified Compose design system

- Approved prototype colors mapped to light and dark Material 3 roles
- Nudge-specific success and warning semantic colors
- Shared typography, spacing, shapes, elevations, touch targets, and motion timings
- Production Today, Areas, Tasks, and Lists navigation shell
- Reusable buttons, cards, rows, chips, fields, empty states, dialogs, sheets, snackbars, and section labels
- Canonical light, dark, and 160% font-scale preview states
- Preview-driven visual-regression strategy documented in `docs/design-system.md`

### Verified local data foundation

- Immutable domain models for Areas, Sections, Tasks, Chores, Schedules, Completions, Lists, List Items, catalog suggestions, and preferences
- UUID-compatible IDs, UTC epoch-millisecond timestamps, sparse ordering, completion timestamps, and archive conventions
- Room database version 1 with nine related tables, foreign keys, indices, converters, DAOs, and observable `Flow` queries
- Committed Room schema at `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/1.json`
- Explicit migration registration and no-destructive-fallback policy
- Repository interfaces separated from Room-backed implementations
- DataStore-backed application preferences
- Hilt modules for database, DAOs, repositories, DataStore, time, IDs, and WorkManager
- Hilt-enabled periodic maintenance boundary for future recurrence and reminders
- Deterministic transactional seed fixtures
- JVM convention tests, Room repository integration tests, schema creation validation, and emulator verification

### Implemented browser-prototype slices

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
- Reusable As-needed chores that remain available after completion
- Task and Chore details with recurrence-aware Chore behavior
- Single checklist-style Tasks destination
- Reusable Lists collection and list-detail routes
- Shared Task/List item behavior: inline creation, tap-to-edit sheets, hold-to-reorder, and swipe-right indentation
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

## Android build

Requirements:

- JDK 17
- Android SDK platform 37
- Android SDK build tools 37.0.0

macOS or Linux:

```bash
bash ./gradlew :app:assembleDebug
```

Windows:

```bat
gradlew.bat :app:assembleDebug
```

Connected emulator test:

```bash
bash ./gradlew :app:connectedDebugAndroidTest
```

The bootstrap scripts download the official Gradle wrapper JAR only when it is missing and verify its published SHA-256 checksum before execution.

## Documentation

- [Native Android development checklist](docs/progress/android-development.md)
- [Compose design system](docs/design-system.md)
- [Local data foundation](docs/local-data-foundation.md)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)
- [Areas and Sections milestone notes](docs/progress/areas-and-rooms.md)
- [Task and Chore detail milestone notes](docs/progress/task-and-chore-details.md)
- [Tasks checklist milestone notes](docs/progress/tasks-destination.md)
- [Reusable Lists milestone notes](docs/progress/lists-destination.md)
- [Product requirements](docs/product-requirements.md)
- [Technical architecture](docs/technical-architecture.md)
- [Delivery roadmap](docs/roadmap.md)
- [Open questions](docs/open-questions.md)
- [Project decisions](docs/adr/README.md)
- [Interactive prototype source](mockups/prototype/README.md)

## Android stack

- Kotlin with AGP built-in Kotlin support
- Jetpack Compose and Material 3
- Navigation Compose
- Room
- DataStore
- WorkManager
- Hilt
- Kotlin Serialization
- Jetpack Glance widgets later
- UsageStatsManager for selected-app usage sessions later
- Optional Gemini backend integration later

## Repository structure

```text
nudge/
├── app/                         # Native Android application module
│   └── schemas/                 # Committed Room schema history
├── gradle/                      # Version catalog and wrapper configuration
├── mockups/
│   └── prototype/               # Live browser prototype
├── docs/
│   ├── adr/
│   ├── progress/
│   │   └── android-development.md
│   ├── design-system.md
│   ├── local-data-foundation.md
│   ├── product-requirements.md
│   ├── technical-architecture.md
│   └── roadmap.md
├── PROJECT-STATUS.md            # Master product tracker
├── .github/workflows/           # Prototype deployment and Android CI
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

## Immediate next step

Begin Phase 4 by replacing the Tasks foundation screen with repository-backed state and implementing the full checklist workflow: inline creation, editing, completion, subtasks, ordering, indentation, due dates, preferences, Undo, and tests.

## License

No license has been selected yet.
