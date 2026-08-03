# Native Android Development

**Branch:** `feature/android-app-development`  
**Package:** `com.arrow2851.nudge`  
**Minimum Android:** API 26  
**Compile and target Android:** API 37  
**Current milestone:** Phase 3 — Local data foundation  
**Phase 1 status:** Completed and verified on August 3, 2026  
**Phase 2 status:** Completed and verified on August 3, 2026

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
- [x] Replace temporary shell styling with the approved design system in Phase 2

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

**Phase 1 is closed.**

## Phase 2 — Shared app shell and design system

### Theme and tokens

- [x] Translate approved browser-prototype tokens into Compose tokens
- [x] Finalize light and dark Material 3 color roles
- [x] Add Nudge-specific success and warning semantic roles
- [x] Finalize the 12–32 sp typography hierarchy with system font scaling
- [x] Finalize the 4–32 dp spacing scale
- [x] Finalize shared 12, 16, 24, and 32 dp shape roles
- [x] Finalize shared elevation levels
- [x] Finalize 140 ms fast and 220 ms normal motion timings
- [x] Add JVM contract tests for spacing, touch-target, and motion tokens

### Shared app shell

- [x] Create `NudgeScreenScaffold`
- [x] Create the production four-destination bottom navigation
- [x] Replace letter placeholders with semantic Material icons
- [x] Keep destination state restoration and single-top navigation
- [x] Add the shared top app bar and destination-specific action slot
- [x] Add shared snackbar hosting
- [x] Apply the production shell to Today, Areas, Tasks, and Lists

### Shared components

- [x] Add primary, tonal, outlined, and text buttons
- [x] Add shared bordered surface cards
- [x] Add reusable list rows with optional leading, trailing, and divider content
- [x] Add shared chips
- [x] Add shared outlined text fields
- [x] Add shared empty states
- [x] Add shared confirmation dialogs
- [x] Add shared modal bottom sheets
- [x] Add shared snackbars
- [x] Add shared section labels

### Accessibility and visual validation

- [x] Enforce a 48 dp minimum interactive touch target in shared components
- [x] Add explicit navigation semantics
- [x] Avoid duplicate descriptions for decorative icons
- [x] Add canonical light-theme component preview
- [x] Add canonical dark-theme component preview
- [x] Add canonical 160% font-scale component preview
- [x] Document the preview-driven visual-regression baseline strategy
- [x] Document the future stable-screen screenshot baseline process
- [x] Verify destination navigation through semantics on an emulator
- [x] Verify the shared quick-add bottom sheet and field on an emulator

### Phase 2 verification evidence

- [x] [Android CI run 42](https://github.com/arrow2851/Nudge/actions/runs/30821406558) completed successfully
- [x] Commit tested: `d719f73662c75beaa6c09cb081f3ec0e67a8ee2a`
- [x] Lint, token tests, and assemble job: `91711982382`
- [x] Emulator shell and quick-add job: `91713172922`
- [x] Debug APK artifact: `8859115008`
- [x] Verification reports artifact: `8859115695`
- [x] Instrumentation reports artifact: `8859310348`

### Phase 2 exit criteria

- [x] Approved prototype colors, type hierarchy, spacing, shapes, elevation, and motion are represented by reusable Compose tokens.
- [x] Today, Areas, Tasks, and Lists use one production app scaffold and bottom navigation implementation.
- [x] Common controls, surfaces, rows, fields, modal surfaces, feedback, and empty states are available as shared components.
- [x] Interactive shared components meet the 48 dp minimum target and navigation is semantically addressable.
- [x] Light, dark, and large-text review states exist and the visual-regression process is documented.
- [x] Lint, JVM tests, debug assembly, emulator installation, navigation, and modal interaction all pass in CI.

**Phase 2 is closed.** Native development proceeds to Phase 3: the local data foundation.

## Phase 3 — Local data foundation

- [ ] Define domain models for Areas, Sections, Chores, Tasks, Lists, and List Items
- [ ] Define stable IDs, ordering, completion, archive, and timestamp conventions
- [ ] Create Room entities and relationship models
- [ ] Create DAOs and observable queries
- [ ] Create Room database and migrations policy
- [ ] Create repository interfaces and local implementations
- [ ] Add Hilt database and repository modules
- [ ] Add DataStore-backed application preferences
- [ ] Add WorkManager scheduling boundary for recurrence and reminders
- [ ] Add deterministic seed fixtures for development and screenshot states
- [ ] Add repository and migration tests

## Implementation order after Phase 3

1. Tasks vertical slice
2. Areas, Sections, and recurring Chores
3. Reusable Lists
4. Today aggregation
5. Recurrence and recommendation engines
6. Direct Android intervention
7. Notifications, widgets, shortcuts, and backup
8. Release hardening
