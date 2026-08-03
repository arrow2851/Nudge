# Nudge

Nudge is an Android-first, local-first productivity app that organizes recurring chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype remains the product and interaction reference. Native Android development has begun on `feature/android-app-development`, with the Phase 1 project foundation, dependency stack, launch shell, tests, and CI configuration now in place.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Native Android development checklist](docs/progress/android-development.md)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
- [Current product-direction amendments](docs/progress/product-direction-amendments.md)
- [Areas and Sections milestone notes](docs/progress/areas-and-rooms.md)
- [Task and Chore detail milestone notes](docs/progress/task-and-chore-details.md)
- [Tasks checklist milestone notes](docs/progress/tasks-destination.md)
- [Reusable Lists milestone notes](docs/progress/lists-destination.md)

### Native Android foundation

- Kotlin and Jetpack Compose application module
- Material 3 and Navigation Compose
- Hilt dependency injection with KSP
- Room, DataStore, WorkManager, and Kotlin Serialization dependencies
- API 26 minimum and API 37 compile/target configuration
- Java 17 and Gradle 9.5 build configuration
- Verified Gradle bootstrap scripts
- Hilt-enabled application and single Compose activity
- Temporary Today, Areas, Tasks, and Lists navigation shell
- JVM and Compose instrumentation smoke tests
- GitHub Actions lint, test, assemble, and APK artifact workflow

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

## Android build

Requirements:

- JDK 17
- Android SDK platform 37
- Android SDK build tools 36.0.0

macOS or Linux:

```bash
bash ./gradlew :app:assembleDebug
```

Windows:

```bat
gradlew.bat :app:assembleDebug
```

The bootstrap scripts download the official Gradle wrapper JAR only when it is missing and verify its published SHA-256 checksum before execution.

## Documentation

- [Native Android development checklist](docs/progress/android-development.md)
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
├── gradle/                      # Version catalog and wrapper configuration
├── mockups/
│   └── prototype/               # Live browser prototype
├── docs/
│   ├── adr/
│   ├── progress/
│   │   └── android-development.md
│   ├── wireframes/
│   ├── product-requirements.md
│   ├── screens-and-wireframes.md
│   ├── technical-architecture.md
│   ├── roadmap.md
│   └── open-questions.md
├── PROJECT-STATUS.md            # Master product tracker
├── .github/workflows/           # Prototype deployment and Android CI
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

## Immediate next step

Pass the Phase 1 CI build and verify installation on an emulator or physical phone. Development then moves to Phase 2: the shared Compose app shell and approved Nudge design system.

## License

No license has been selected yet.
