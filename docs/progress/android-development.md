# Native Android Development

**Branch:** `feature/android-app-development`  
**Package:** `com.arrow2851.nudge`  
**Minimum Android:** API 26  
**Compile and target Android:** API 37  
**Current milestone:** Phase 1 — Android foundation

This file is the persistent checklist for native application development. Update it whenever a build task changes state or a product decision alters the implementation order.

## Status legend

- `[x]` Completed in the branch
- `[~]` Implemented but awaiting build, device, or product validation
- `[ ]` Not started
- `[!]` Needs a decision or correction
- `[b]` Blocked

## Phase 1 — Android foundation

### Repository and build

- [x] Create `feature/android-app-development` from `main`
- [x] Add Android Gradle project settings
- [x] Add a single `app` module
- [x] Set application ID and namespace to `com.arrow2851.nudge`
- [x] Set minimum SDK to API 26
- [x] Set compile and target SDK to API 37
- [x] Configure Java 17
- [x] Configure Gradle 9.5 with distribution checksum verification
- [x] Add cross-platform Gradle bootstrap scripts with wrapper-JAR verification
- [x] Add centralized Gradle version catalog
- [x] Enable Gradle build cache and configuration cache
- [x] Confirm Android and build outputs are ignored by Git

### Core platform dependencies

- [x] Jetpack Compose and Material 3
- [x] Compose Compiler Gradle plugin
- [x] Navigation Compose
- [x] Hilt with KSP
- [x] Room with KSP and schema export location
- [x] DataStore Preferences
- [x] WorkManager
- [x] Kotlin Serialization
- [x] Lifecycle runtime and ViewModel Compose support

### Application entry point

- [x] Add Hilt-enabled `Application`
- [x] Add single Compose `MainActivity`
- [x] Enable edge-to-edge drawing
- [x] Add minimal light and dark launch themes
- [x] Add initial Compose `MaterialTheme`
- [x] Add launcher manifest entry
- [x] Add Android backup and device-transfer rules

### Foundation shell

- [x] Add initial Today destination
- [x] Add initial Areas destination
- [x] Add initial Tasks destination
- [x] Add initial Lists destination
- [x] Add temporary four-destination bottom navigation
- [x] Preserve destination state when switching tabs
- [ ] Replace temporary shell styling with the approved design system in Phase 2

### Testing and automation

- [x] Add JVM unit-test source set and smoke test
- [x] Add Android instrumentation-test source set
- [x] Add Compose launch smoke test
- [x] Add GitHub Actions Android build workflow
- [~] Pass dependency resolution and Gradle configuration in CI
- [~] Pass Android lint in CI
- [~] Pass JVM tests in CI
- [~] Assemble a debug APK in CI
- [ ] Run instrumentation test on an emulator
- [ ] Install and open the debug APK on a physical Android device

### Phase 1 exit criteria

Phase 1 is complete when:

1. GitHub Actions passes lint, unit tests, and debug assembly.
2. The project opens and syncs in Android Studio.
3. The debug application installs and opens on an emulator or phone.
4. Today, Areas, Tasks, and Lists can be selected from the temporary navigation bar.
5. No product feature logic is coupled directly to `MainActivity`.

## Phase 2 — Shared app shell and design system

- [ ] Translate approved prototype tokens into Compose tokens
- [ ] Finalize Nudge color roles
- [ ] Finalize typography scale
- [ ] Finalize spacing, corner, elevation, and motion tokens
- [ ] Create shared screen scaffold
- [ ] Create production bottom navigation
- [ ] Add common buttons, rows, cards, chips, fields, sheets, dialogs, snackbars, and empty states
- [ ] Add accessibility semantics and minimum touch targets
- [ ] Add large-text and dark-theme test states
- [ ] Add screenshot or visual-regression strategy

## Implementation order after Phase 2

1. Local data foundation
2. Tasks vertical slice
3. Areas, Sections, and recurring Chores
4. Reusable Lists
5. Today aggregation
6. Recurrence and recommendation engines
7. Direct Android intervention
8. Notifications, widgets, shortcuts, and backup
9. Release hardening
