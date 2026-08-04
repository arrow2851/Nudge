# Nudge

Nudge is an Android-first, local-first productivity app that organizes recurring chores, one-time tasks, and reusable lists, then redirects excessive time in selected distracting apps toward a small useful action.

## Current status

Native Android Phases 1–10 are implemented on `feature/android-app-development`. Phase 11 is complete for the code and emulator-verifiable scope. The remaining work is physical-device compatibility, battery, accessibility, policy, signing, and closed-beta validation.

**Current development version:** `0.10.0-dev`

- [Live interactive prototype](https://arrow2851.github.io/Nudge/)
- [Android development checklist](docs/progress/android-development.md)
- [Phases 9–11 closeout](docs/progress/android-phases-9-11.md)
- [Intervention and release boundary](docs/intervention-and-release.md)
- [Recurrence and recommendation engines](docs/recurrence-and-recommendations.md)
- [Compose design system](docs/design-system.md)
- [Local data foundation](docs/local-data-foundation.md)
- [Android development pull request](https://github.com/arrow2851/Nudge/pull/2)

## Implemented native application

### Organizer

- Production Compose navigation for Today, Areas, Tasks, and Lists
- Repository-backed Room persistence with explicit migrations
- One-time Tasks with due dates, Main Tasks, subtasks, ordering, indentation, completion, reopening, and Undo
- Areas and optional Sections for recurring care
- Daily, weekly, monthly, custom interval, and As Needed Chores
- Calendar-based and completion-based recurrence
- Light, Moderate, and Deep completion grading
- Reusable and one-off Lists
- List subitems, quantities, checked-item return, learned suggestions, and duplicate-safe behavior
- Today aggregation for due, overdue, active Lists, and recent activity

### Recurrence and recommendations

- Injectable recurrence service for labels, grouping, and next-occurrence calculations
- Scheduled-Chore due-date repair without silently moving overdue work forward
- Deterministic Task and Chore recommendation ranking
- Urgency, priority, duration, location, quick-win, recency, and dismissal factors
- Shared recommendation engine for Today Quick Win and interventions
- Twelve-hour offline WorkManager maintenance

### Direct Android intervention

- Explicit Usage Access and notification onboarding
- Installed launcher-app selection
- Local usage-event reading and deterministic continuous-session calculation
- Optional combined sessions across selected apps
- Gentle, Balanced, and Strict modes
- Configurable usage limit and suggested-action size
- Cooldown, quiet hours, daily maximum, and timed pause
- Opt-in visible foreground monitoring service
- Notification-based prompts with Start, Different, Not now, and Pause actions
- Focus screen with countdown
- Task or Chore completion from the intervention
- Compatibility diagnostics

Nudge deliberately does not use an Accessibility Service, a forced overlay, or an unreliable background Activity launch. Android usage data remains on the device.

### Quick access and voice

- Quick Add home-screen widget
- Pause Interventions home-screen widget
- Quick Add launcher shortcut
- Intervention Settings launcher shortcut
- Persistent global Quick Add that creates a real Task
- Optional Android system voice transcription with an unavailable-service fallback

### Backup and restore

- Android Auto Backup for the full Room database and DataStore preferences
- User-controlled portable JSON export
- Additive JSON restore through Android's document picker
- Portable backup of active Areas, Sections, Tasks, Main Task flags, Chores, schedules, Lists, List Items, and app preferences

The portable JSON currently excludes completion-history events. Those remain covered by Android's full system backup.

## Verification

Android CI #350, run `30881020756`, passed on commit `0217c67f67f4cf4fde3b1349de2b6124df76c8a6`:

- Lint
- JVM unit tests
- Room schema and migration verification
- Debug APK assembly
- Complete API 35 emulator installation and regression suite
- APK, Room schema, verification-report, and instrumentation-report artifacts

The regression covers production navigation and complete Tasks, recurring-care, reusable-Lists, Today, database, recurrence, recommendation, and persistent Quick Add workflows.

## Remaining before public release

The current build is appropriate for physical-device testing and a controlled internal alpha. It is not Play Store ready yet.

Remaining release gates include:

- Samsung, Pixel, Motorola, and another manufacturer test pass
- Android-version compatibility matrix
- Foreground-monitoring battery measurement
- Permission-revocation and notification-disabled testing
- Manufacturer battery-optimization guidance
- TalkBack, switch-access, and large-text review
- Google Play foreground-service and privacy-policy review
- Release signing and upgrade testing
- Store assets
- Closed beta and compatibility-report collection

Additional Today, Next Task, and Grocery widgets and Quick Settings tiles are useful later enhancements rather than blockers for the internal alpha.

## Gemini boundary

Real Gemini or cloud-assisted mutation is intentionally not part of the local completion pass. A production implementation requires a secure backend gateway, protected credentials, rate and cost controls, structured function schemas, privacy copy, and explicit user confirmation. No AI provider key should be embedded in the APK.

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

## Product pillars

- Areas and optional Sections for recurring chores and maintenance
- A separate lightweight checklist for one-time Tasks
- Recurring Chores with calendar-based or completion-based cadence
- Optional Light, Moderate, and Deep completion grading
- Reusable Lists that remember completed items for future suggestions
- Direct app-usage intervention with compatibility-safe delivery
- Contextual creation flows instead of one global floating action button
- Local-first core functionality with optional cloud features later
