# Native Android Development

**Branch:** `feature/android-app-development`  
**Package:** `com.arrow2851.nudge`  
**Minimum Android:** API 26  
**Compile and target Android:** API 37  
**Current milestone:** Phase 2 — Shared app shell and design system  
**Phase 1 status:** Completed and verified on August 3, 2026

This file is the persistent checklist for native application development. Update it whenever a build task changes state or a product decision alters the implementation order.

## Status legend

- `[x]` Completed and verified
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
- [x] Validate the Android Studio-compatible Gradle project model through CI configuration and compilation

### Core platform dependencies

- [x] Jetpack Compose and Material 3
- [x] Compose Compiler Gradle plugin
- [x] Navigation Compose
- [x] Hilt 2.59.2 with KSP and AGP 9 support
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
- [x] Keep product and navigation behavior outside `MainActivity`

### Foundation shell

- [x] Add initial Today destination
- [x] Add initial Areas destination
- [x] Add initial Tasks destination
- [x] Add initial Lists destination
- [x] Add temporary four-destination bottom navigation
- [x] Preserve destination state when switching tabs
- [x] Verify all four destinations through an emulator instrumentation test
- [ ] Replace temporary shell styling with the approved design system in Phase 2

### Testing and automation

- [x] Add JVM unit-test source set and smoke test
- [x] Add Android instrumentation-test source set
- [x] Add Compose launch and navigation smoke test
- [x] Add GitHub Actions Android build workflow
- [x] Pass dependency resolution and Gradle configuration in CI
- [x] Pass Android lint in CI
- [x] Pass JVM tests in CI
- [x] Assemble and retain a debug APK in CI
- [x] Boot an Android API 35 emulator in CI
- [x] Install and launch the debug app on the emulator
- [x] Pass the connected instrumentation test on the emulator
- [ ] Install on a physical Android device before the first internal release; this is a release/device-matrix validation item, not a Phase 1 blocker

### Phase 1 verification evidence

- [x] [Android CI run 13](https://github.com/arrow2851/Nudge/actions/runs/30787951345) completed successfully
- [x] Commit tested: `8974c3d1cb4c97286efb277b6043a72649b3b5c7`
- [x] Lint, JVM test, and assemble job: `91605231122`
- [x] Emulator install and navigation job: `91605844622`
- [x] Debug APK artifact: `8845999816`
- [x] Instrumentation reports artifact: `8846104367`
- [x] Downloaded APK SHA-256: `03fb9904e8030e43209c10d7206a2df0c150eaf09123bf9164269e9bb27878fe`

### Phase 1 exit criteria

- [x] GitHub Actions passes dependency resolution, configuration, lint, JVM tests, and debug assembly.
- [x] The Gradle project model configures and compiles successfully with the documented JDK, AGP, Gradle, and Android SDK versions.
- [x] The debug application installs and opens on an Android emulator.
- [x] Today, Areas, Tasks, and Lists can all be selected from the temporary navigation bar.
- [x] No product feature logic is coupled directly to `MainActivity`.

**Phase 1 is closed.** Native development proceeds to Phase 2.

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
