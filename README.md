# Nudge

Nudge is an Android-first, local-first productivity app that organizes recurring chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype remains the product and interaction reference. Native Android Phases 1–6 are complete and verified on `feature/android-app-development`. Development now proceeds to Phase 7: Today aggregation.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Native Android development checklist](docs/progress/android-development.md)
- [Compose design system](docs/design-system.md)
- [Local data foundation](docs/local-data-foundation.md)
- [Android development pull request](https://github.com/arrow2851/Nudge/pull/2)
- [Verified Phase 5–6 Android CI run](https://github.com/arrow2851/Nudge/actions/runs/30854956621)
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
- Reusable buttons, cards, rows, chips, fields, empty states, dialogs, scrollable sheets, snackbars, and section labels
- Canonical light, dark, and 160% font-scale preview states
- Preview-driven visual-regression strategy documented in `docs/design-system.md`

### Verified local data foundation

- Immutable domain models for Areas, Sections, Tasks, Chores, Schedules, Completions, Lists, List Items, catalog suggestions, and preferences
- UUID-compatible IDs, UTC epoch-millisecond timestamps, sparse ordering, completion timestamps, and archive conventions
- Room database version 2 with explicit schema history and migration 1→2
- Committed Room schemas under `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/`
- Explicit migration registration and no-destructive-fallback policy
- Repository interfaces separated from Room-backed implementations
- DataStore-backed application preferences
- Hilt modules for database, DAOs, repositories, DataStore, time, IDs, and WorkManager
- Hilt-enabled periodic maintenance boundary for future recurrence and reminders
- Deterministic transactional seed fixtures
- JVM convention tests, Room repository integration tests, schema creation validation, and emulator verification

### Verified native Tasks vertical slice

- Repository-backed one-time checklist with process-safe Room persistence
- Destination-specific task creation from the app bar and bottom of the list
- Immediate empty-row creation with inline keyboard editing
- Completion and reopening with snackbar Undo
- Active and completed grouping with DataStore-backed Show/Hide Completed
- Task details sheet, optional due date, and gray due shorthand
- Explicit Main Task state with one level of subtasks
- Thin subtask progress and parent/child completion synchronization
- Releasing subtasks as regular tasks when Main Task is disabled
- Hold-and-drag ordering with repository rebalance fallback
- Swipe indent and unindent with accessible action alternatives
- Additive Room migration 1→2 that preserves existing tasks
- Unit, repository, migration, navigation, and complete emulator workflow tests

### Verified native recurring-care vertical slice

- Repository-backed Areas overview with attention summaries
- Area creation, editing, ordering, archiving, and House/Car templates
- Optional Sections with creation, editing, ordering, archiving, and safe child release
- Recurring Chore creation and editing with General-area support
- Daily, weekly, monthly, custom interval, and As Needed schedules
- Calendar-based and completion-based cadence behavior
- Light, Moderate, and Deep completion grading
- Completion history, recurrence advancement, and snackbar Undo
- Area-level quick completion and Section groups for Needs Attention, Coming Up, As Needed, and Paused
- Scrollable long-form Chore editor sheets
- Repository, recurrence, migration-preservation, ViewModel, and emulator workflow tests

### Verified native reusable Lists vertical slice

- Repository-backed reusable and one-off Lists overview
- Contextual List and List Item creation
- Optional quantity or note per item
- Active and checked grouping with checked-item Undo
- One-level subitems with move, indent, unindent, and safe parent removal behavior
- Reusable-list Return Checked and Clear Checked actions
- Learned catalog suggestions from completed items
- Suggestion ranking by favorite, use count, and recency
- Preferred quantity restoration when a suggestion is selected
- Safe Room upserts, sparse ordering, and archive conventions
- Migration preservation for Lists, catalog history, quantities, and checked state
- ViewModel, repository, migration, navigation, and complete emulator workflow tests

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
- Reusable As Needed chores that remain available after completion
- Task and Chore details with recurrence-aware Chore behavior
- Single checklist-style Tasks destination
- Reusable Lists collection and list-detail routes
- Shared Task/List item behavior: inline creation, tap-to-edit sheets, ordering, and indentation
- Main Task and List item subitems
- Parent completion cascades to children; child completion recalculates the parent where applicable
- Completed root items move to the bottom with visibility controls
- Task-only Due Date and optional gray due shorthand
- List history suggestions during item creation

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

Begin Phase 7 by replacing the Today foundation screen with a repository-backed aggregation of overdue and due-now Tasks, recurring Chores, relevant Lists, recent activity, completion grading, and Undo.

## License

No license has been selected yet.
