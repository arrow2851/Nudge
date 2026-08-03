# Native Android Development

**Branch:** `feature/android-app-development`  
**Package:** `com.arrow2851.nudge`  
**Minimum Android:** API 26  
**Compile and target Android:** API 37  
**Current milestone:** Phase 8 — Recurrence and recommendation engines  
**Phase 1 status:** Completed and verified on August 3, 2026  
**Phase 2 status:** Completed and verified on August 3, 2026  
**Phase 3 status:** Completed and verified on August 3, 2026  
**Phase 4 status:** Completed and verified on August 3, 2026  
**Phase 5 status:** Completed and verified on August 3, 2026  
**Phase 6 status:** Completed and verified on August 3, 2026  
**Phase 7 status:** Completed and verified on August 3, 2026

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

**Phase 2 is closed.**

## Phase 3 — Local data foundation

### Domain and persistence conventions

- [x] Define immutable domain models for Areas, Sections, Tasks, Chores, Chore Schedules, Completions, Reusable Lists, List Items, catalog suggestions, and preferences
- [x] Finalize **Section** as the persisted Area subdivision name
- [x] Use UUID-compatible string identifiers
- [x] Use UTC epoch-millisecond timestamps
- [x] Use sparse `Long` ordering with a 1,024-point insertion gap
- [x] Represent completion with nullable timestamps and status where applicable
- [x] Represent normal deletion through nullable archive timestamps
- [x] Add explicit Room converters for enums and weekday sets

### Room database

- [x] Create entities and relationship models for all Phase 3 domains
- [x] Add foreign keys and query indices
- [x] Create observable DAO queries using `Flow`
- [x] Add stable ordering and active/archive filtering to UI-facing queries
- [x] Create `NudgeDatabase` version 1
- [x] Enable Room schema export through the Room Gradle plugin
- [x] Commit `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/1.json`
- [x] Create the centralized `NudgeMigrations.All` registration point
- [x] Document the no-destructive-fallback migration policy

### Repositories and application services

- [x] Create repository interfaces independent of Room
- [x] Create Room-backed local repository implementations
- [x] Add entity/domain mappings
- [x] Add transactional Chore and Schedule persistence
- [x] Add DataStore-backed application preferences
- [x] Add injected ID and time providers
- [x] Add Hilt database, DAO, repository, DataStore, time, ID, and scheduler bindings
- [x] Add Hilt-enabled WorkManager configuration
- [x] Add the unique periodic maintenance scheduling boundary
- [x] Keep recurrence and reminder mutations out of the worker until their domain phase

### Fixtures and verification

- [x] Add deterministic Area, Section, Task, Chore, List, List Item, and catalog fixtures
- [x] Add transactional and idempotent database seeding
- [x] Add JVM convention and converter tests
- [x] Add in-memory Room repository integration tests
- [x] Test Area/Section ordering and relationships
- [x] Test Task completion state and timestamps
- [x] Test reusable-list items and catalog suggestions
- [x] Test deterministic seed idempotency
- [x] Add exported-schema creation validation with `MigrationTestHelper`
- [x] Retain generated Room schemas as a CI artifact
- [x] Preserve the Phase 2 navigation and modal emulator tests

### Phase 3 verification evidence

- [x] [Android CI run 97](https://github.com/arrow2851/Nudge/actions/runs/30826025127) completed successfully
- [x] Commit tested: `c5aa9d7d1f45095194f900f56a5a9767e549223e`
- [x] Lint, JVM tests, schema export, and assemble job: `91727740611`
- [x] Repository, schema, seed, navigation, and modal emulator job: `91729098110`
- [x] Debug APK artifact: `8861007957`
- [x] Room schemas artifact: `8861008650`
- [x] Verification reports artifact: `8861009401`
- [x] Instrumentation reports artifact: `8861930353`
- [x] Downloaded APK SHA-256: `c0a7bb64b3fc0cef9f36bfc3a4360988b514d2f9101f38c3dc9a73ff3ad5b60c`

### Phase 3 exit criteria

- [x] Every approved core item type has a domain model and local persistence representation.
- [x] Room relations, observable queries, repositories, Hilt bindings, and DataStore preferences compile and pass lint.
- [x] Database version 1 has a committed exported schema and documented explicit-migration policy.
- [x] Deterministic fixtures seed transactionally and do not duplicate existing data.
- [x] WorkManager and Hilt expose a stable boundary for later recurrence and reminder work.
- [x] Repository behavior and schema creation pass on an Android emulator.
- [x] The application still installs, launches, navigates, and opens shared modal UI after the data layer is added.

**Phase 3 is closed.**

## Phase 4 — Tasks vertical slice

### Repository-backed checklist

- [x] Replace the Tasks foundation content with repository-backed observable state
- [x] Add destination-specific top app-bar task creation
- [x] Add bottom inline task creation
- [x] Create an empty editable task immediately and archive abandoned empty rows
- [x] Add inline title editing with keyboard submission
- [x] Add checkbox completion and snackbar Undo
- [x] Move completed root tasks below active tasks
- [x] Add Show/Hide Completed behavior backed by DataStore preferences
- [x] Add loading, empty, fatal-error, and recoverable-mutation states

### Task details and hierarchy

- [x] Add task details bottom sheet
- [x] Add optional due date and gray due shorthand
- [x] Add explicit Main Task state without overloading the presence of children
- [x] Add one-level subtasks and contextual subtask creation
- [x] Add thin subtask progress and completed-count summary
- [x] Cascade parent completion and reopening to children
- [x] Recalculate parent completion when children change
- [x] Release subtasks as regular root tasks when Main Task is disabled
- [x] Release children safely when a Main Task is archived

### Ordering and gestures

- [x] Add hold-and-drag reordering using sparse ordering values
- [x] Add repository rebalance fallback after hierarchy changes
- [x] Add swipe-right indentation under the previous task
- [x] Add swipe-left unindentation
- [x] Add accessible move, indent, and unindent custom actions
- [x] Keep hierarchy and ordering rules transactional in the repository rather than Compose

### Room migration

- [x] Upgrade `NudgeDatabase` from version 1 to version 2
- [x] Add the additive `task_main_flags` table
- [x] Commit `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/2.json`
- [x] Add explicit migration 1→2 without destructive fallback
- [x] Verify migration preserves existing task rows
- [x] Verify fresh version-2 schema creation

### Tests and verification

- [x] Add ViewModel tests for creation, completion Undo, and due shorthand
- [x] Add repository tests for completion synchronization
- [x] Add repository tests for Main Task release behavior
- [x] Add repository tests for indent and unindent behavior
- [x] Add emulator coverage for task creation, completion, Undo, Main Task conversion, and subtask creation
- [x] Preserve navigation and shared quick-add tests

### Phase 4 verification evidence

- [x] [Android CI run 142](https://github.com/arrow2851/Nudge/actions/runs/30834579590) completed successfully
- [x] Commit tested: `0465385fdb37e71b72d5d85c5b2ab830efd71c08`
- [x] Lint, JVM tests, schema export, and assemble job: `91756518325`
- [x] Migration, repository, and complete Tasks workflow emulator job: `91757773903`
- [x] Debug APK artifact: `8864424313`
- [x] Room schemas artifact: `8864424608`
- [x] Verification reports artifact: `8864424865`
- [x] Instrumentation reports artifact: `8864641748`
- [x] Downloaded APK SHA-256: `aa96869376872a2e4bfc99117add1560b9d6db6cff63ef39d5e54e63e054b7ad`

### Phase 4 exit criteria

- [x] Tasks render entirely from repository-backed local data and survive process recreation through Room.
- [x] Creation, editing, completion, Undo, due dates, completed visibility, archive, ordering, and hierarchy mutations are persisted.
- [x] Main Task and subtask completion rules are transactional and verified.
- [x] Room migration 1→2 preserves user task data and the version-2 schema is committed.
- [x] Gesture behavior has accessible non-gesture alternatives.
- [x] Lint, unit tests, schema generation, APK assembly, migration tests, repository tests, navigation, and the complete Tasks workflow pass in CI.

**Phase 4 is closed.**

## Phase 5 — Areas, Sections, and recurring Chores

### Repository-backed recurring care

- [x] Replace the Areas foundation content with repository-backed state
- [x] Implement Area overview attention summaries
- [x] Add loading, empty, fatal-error, and recoverable-mutation states
- [x] Keep Area, Section, Chore, Schedule, and Completion mutations transactional
- [x] Use safe Room upserts so edits preserve schedules and completion history

### Areas and Sections

- [x] Add Area creation, editing, ordering, and archiving
- [x] Add optional Section creation, editing, ordering, and archiving
- [x] Release Section chores safely to the Area General group when a Section is archived
- [x] Archive an Area and its recurring-care contents transactionally
- [x] Add idempotent House and Car templates
- [x] Keep the Car template Section-free by design

### Recurring Chores and schedules

- [x] Implement recurring Chore creation and editing
- [x] Support Area-level General chores without a Section
- [x] Add daily, weekly, monthly, custom interval, and As Needed schedules
- [x] Add calendar-based and completion-based schedule behavior
- [x] Preserve calendar cadence while catching up to the next future occurrence
- [x] Clamp monthly schedules safely for shorter months
- [x] Add paused, resumed, skipped-occurrence, and As Needed states
- [x] Make long Chore editor sheets scrollable on compact screens

### Completion and grading

- [x] Add Light, Moderate, and Deep completion grading
- [x] Record completion history and advance recurrence transactionally
- [x] Add snackbar Undo for graded completion
- [x] Add Area-level quick completion before Section navigation
- [x] Group Section routines into Needs Attention, Coming Up, As Needed, and Paused

### Phase 5 tests and verification

- [x] Add recurrence calendar tests
- [x] Add Areas ViewModel orchestration tests
- [x] Add Room repository tests for templates, grading, completion, Undo, Section release, and Area archive
- [x] Verify migration 1→2 preserves existing Areas, Sections, Chores, schedules, and completion history
- [x] Add complete House-template, graded-completion, and As Needed emulator workflow
- [x] Preserve Tasks, navigation, and quick-add regression coverage

### Phase 5 verification evidence

- [x] [Android CI run 219](https://github.com/arrow2851/Nudge/actions/runs/30854956621) completed successfully
- [x] Commit tested: `82c00934aecccc2c27404c627e4478ac7090b1c9`
- [x] Lint, unit tests, schema export, and assemble job: `91823691051`
- [x] Migration, repository, navigation, Tasks, recurring-care, and Lists emulator job: `91824929244`
- [x] Debug APK artifact: `8872210708`
- [x] Room schemas artifact: `8872211212`
- [x] Verification reports artifact: `8872211752`
- [x] Instrumentation reports artifact: `8872402961`

### Phase 5 exit criteria

- [x] Areas, optional Sections, recurring Chores, schedules, completion history, and templates render from repository-backed Room state.
- [x] Calendar-based and completion-based cadence behavior is deterministic and tested.
- [x] Completion grading, recurrence advancement, pause/resume, skip, As Needed, and Undo are persisted.
- [x] Section and Area archive behavior preserves or archives child data according to the approved product rules.
- [x] Room remains at version 2 because recurring-care tables already existed; migration-preservation tests verify existing recurring-care data survives 1→2.
- [x] Lint, JVM tests, schema generation, APK assembly, migration tests, repository tests, navigation, and the complete recurring-care emulator workflow pass in CI.

**Phase 5 is closed.**

## Phase 6 — Reusable Lists

### Repository-backed Lists

- [x] Replace the Lists foundation content with repository-backed state
- [x] Add reusable and one-off List creation, editing, ordering, and archiving
- [x] Add destination-specific top app-bar creation for Lists and List Items
- [x] Add bottom contextual List and Item creation controls
- [x] Add loading, empty, fatal-error, and recoverable-mutation states

### List Items and hierarchy

- [x] Add List Item creation and editing
- [x] Add optional quantity or note
- [x] Add checkbox completion and snackbar Undo
- [x] Group active and checked items
- [x] Add one level of subitems
- [x] Add move, indent, unindent, and accessible non-gesture alternatives
- [x] Release children safely when a parent item is removed
- [x] Preserve unchecked children when checked parents are cleared
- [x] Add reusable-list Return Checked behavior
- [x] Add Clear Checked behavior

### Learned suggestions

- [x] Learn catalog suggestions only when an item is newly checked
- [x] Normalize names for cross-list matching
- [x] Rank suggestions by favorite, use count, recency, and name
- [x] Restore the preferred quantity when a suggestion is selected
- [x] Filter active duplicates from the suggestion picker
- [x] Keep completely new items available without requiring a suggestion

### Phase 6 tests and verification

- [x] Add Lists ViewModel tests for creation and completion events
- [x] Add Room repository tests for suggestion learning, Undo, hierarchy, ordering, reset, clear, and archive
- [x] Verify migration 1→2 preserves Lists, catalog history, quantities, and checked state
- [x] Add complete emulator coverage for reusable List creation, quantity, completion, Undo, learned suggestion, and quantity restoration
- [x] Preserve Tasks, recurring-care, navigation, and quick-add regression coverage

### Phase 6 verification evidence

- [x] [Android CI run 219](https://github.com/arrow2851/Nudge/actions/runs/30854956621) completed successfully
- [x] Commit tested: `82c00934aecccc2c27404c627e4478ac7090b1c9`
- [x] Lint, unit tests, schema export, and assemble job: `91823691051`
- [x] Twenty-one-test emulator job: `91824929244`
- [x] Debug APK artifact: `8872210708`
- [x] Room schemas artifact: `8872211212`
- [x] Verification reports artifact: `8872211752`
- [x] Instrumentation reports artifact: `8872402961`

### Phase 6 exit criteria

- [x] Reusable and one-off Lists render entirely from repository-backed Room state.
- [x] List creation, editing, ordering, archive, item quantities, completion, Undo, hierarchy, reset, and clear are persisted.
- [x] Checked items populate ranked cross-list suggestions and restore preferred quantities.
- [x] Parent removal and completed-item clearing preserve unchecked children according to the approved hierarchy rules.
- [x] Room remains at version 2 because List tables already existed; migration-preservation tests verify existing List data survives 1→2.
- [x] Lint, JVM tests, schema generation, APK assembly, migration tests, repository tests, navigation, and all 21 emulator tests pass in CI.

**Phase 6 is closed.**

## Phase 7 — Today aggregation

### Cross-domain Today read model

- [x] Replace the Today foundation content with repository-backed observable state
- [x] Aggregate active Tasks, recurring Chores, reusable Lists, and completion history
- [x] Group scheduled work deterministically into Due Today and Overdue using the device timezone
- [x] Exclude paused and As Needed Chores from scheduled urgency
- [x] Add Area and Section context to recurring-care rows
- [x] Add loading, empty, fatal-error, and recoverable-mutation states
- [x] Keep Room at version 2 by adding only a read-only completion-history DAO

### Today sections and actions

- [x] Add Due Today with direct Task and Chore completion
- [x] Add collapsible Overdue review
- [x] Add reusable and one-off List quick access
- [x] Add Recent Activity across completed Tasks, graded Chores, and checked List Items
- [x] Add Task completion and snackbar Undo
- [x] Add Chore completion, Light/Moderate/Deep grading, recurrence advancement, and snackbar Undo
- [x] Navigate Today rows to Tasks, Areas, Sections, and List detail routes

### Optional guidance

- [x] Preserve Daily Progress as a preference-gated card that remains off by default
- [x] Preserve Quick Win as a preference-gated card that remains off by default
- [x] Select Quick Win from nudge-eligible overdue or due-today work
- [x] Prefer the shortest estimated action, then urgency and stable title ordering
- [x] Keep optional guidance absent from the default Today experience

### Phase 7 tests and verification

- [x] Add Today ViewModel tests for due classification, List summaries, activity, progress, and Quick Win
- [x] Add Today ViewModel tests for Task and graded-Chore completion and Undo
- [x] Add a complete on-device Today workflow using independently created data
- [x] Verify Due Today, Lists, Recent Activity, completion, snackbar Undo, and item restoration
- [x] Preserve all Tasks, recurring-care, Lists, navigation, quick-add, migration, and repository regression coverage

### Phase 7 verification evidence

- [x] [Android CI run 229](https://github.com/arrow2851/Nudge/actions/runs/30861757348) completed successfully
- [x] Commit tested: `1d59e26d5283fafd31b92b56dcbe1c2d24cfee78`
- [x] Lint, JVM tests, schema export, and assemble job: `91845035216`
- [x] Twenty-two-test emulator job: `91846041839`
- [x] Debug APK artifact: `8874696475`
- [x] Room schemas artifact: `8874696728`
- [x] Verification reports artifact: `8874697017`
- [x] Instrumentation reports artifact: `8874860518`

### Phase 7 exit criteria

- [x] Today renders entirely from repository-backed Tasks, recurring-care, Lists, preferences, and completion history.
- [x] Due Today and Overdue classification is deterministic in the device timezone and excludes paused or As Needed work.
- [x] Lists and Recent Activity expose useful cross-domain context without duplicating source-of-truth mutations.
- [x] Task and Chore completion, Chore grading, recurrence advancement, and Undo reuse existing transactional repositories.
- [x] Daily Progress and Quick Win remain optional and disabled by default.
- [x] Room remains at version 2 because Today adds only a read model over existing tables.
- [x] Lint, JVM tests, schema generation, APK assembly, migration tests, repository tests, navigation, and all 22 emulator tests pass in CI.

**Phase 7 is closed.** Native development proceeds to Phase 8: recurrence and recommendation engines.

## Implementation order after Phase 7

1. Recurrence and recommendation engines
2. Direct Android intervention
3. Notifications, widgets, shortcuts, and backup
4. Release hardening
