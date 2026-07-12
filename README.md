# Nudge

Nudge is an Android-first, local-first productivity app that organizes household chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

The interactive browser prototype is live and under active feature-by-feature development. The native Android implementation has not started yet.

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Master project roadmap and progress tracker](PROJECT-STATUS.md)

## Product pillars

- Areas and optional subareas such as `House > Kitchen`
- Recurring chores with calendar-based or completion-based cadence
- Optional Light, Moderate, and Deep completion grading
- Reusable lists that remember completed items for future suggestions
- One-time tasks for repairs, errands, orders, and other TODOs
- Direct app-usage intervention with compatibility fallbacks
- Fast Quick Add, gestures, widgets, voice, and Gemini-assisted entry
- Local-first core functionality with optional cloud features later

## Documentation

- [Master project roadmap and progress tracker](PROJECT-STATUS.md)
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

Continue the ordered build plan in [PROJECT-STATUS.md](PROJECT-STATUS.md), beginning with the Areas and Rooms feature batch.

## License

No license has been selected yet.
