# Local Data Foundation

Phase 3 established Nudge's local-first persistence boundary. Feature screens consume domain repositories and observable flows; they do not depend directly on Room or DataStore. Phase 4 extended that boundary with transactional Main Task metadata and the first production feature migration.

## Naming decision

The approved product language is **Area → Section**. Older design documents may still say Subarea or Room. The persisted model uses `Section`, and future import adapters must translate older names at the boundary.

## Persistence conventions

- IDs are UUID-compatible strings. Deterministic fixtures use readable stable IDs.
- All timestamps are UTC Unix epoch milliseconds in `Long` columns.
- `createdAt` is immutable after creation.
- Every mutation updates `updatedAt`.
- Completion is represented by nullable `completedAt` plus the task status where applicable.
- User-owned records are archived with nullable `archivedAt`; normal feature flows do not hard-delete them.
- Ordered collections use sparse `Long` values with a default gap of 1,024 so inserts and drag reordering usually avoid rewriting every row.
- Enum values are persisted by stable enum names through explicit Room converters.

## Room schema version 2

Tables:

- `areas`
- `sections`
- `tasks`
- `task_main_flags`
- `chores`
- `chore_schedules`
- `completions`
- `reusable_lists`
- `list_catalog_items`
- `list_items`

Foreign keys protect Area/Section, task hierarchy, explicit Main Task flags, Chore/Schedule, List/Item, and completion-history relationships. UI-facing DAO queries return `Flow` and apply active/archive filtering and stable ordering.

Generated schemas are committed at:

- `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/1.json`
- `app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/2.json`

## Migration policy

1. `exportSchema` remains enabled.
2. The Room Gradle plugin writes schemas under `app/schemas`.
3. Every schema JSON file is committed to source control.
4. Every database version increase includes an explicit auto-migration or manual `Migration` object.
5. Migration tests use `MigrationTestHelper` and the committed schemas.
6. Production database construction never calls destructive-migration fallback.
7. A migration must preserve user data unless an ADR explicitly approves a destructive development-only reset before public release.

`NudgeMigrations.All` remains the single registration point. Migration 1→2 adds only `task_main_flags`, preserving all existing task rows and relationships.

## Repositories

- `AreaRepository`
- `TaskRepository`
- `ChoreRepository`
- `CompletionRepository`
- `ReusableListRepository`
- `PreferencesRepository`

Room-backed implementations map entities to immutable domain models. DataStore stores lightweight application preferences such as theme, completed-item visibility, due-date shorthand, optional Daily Progress, optional Quick Win, and demo-data state.

The Task repository now owns transactional hierarchy behavior: parent/child completion synchronization, Main Task release, ordering, indentation, unindentation, and safe archive behavior. Compose never directly mutates task tables.

## Background-work boundary

`MaintenanceScheduler` owns unique periodic WorkManager registration. `RefreshDerivedDataWorker` is Hilt-created and intentionally performs no recurrence mutation yet. Later recurrence and reminder phases attach tested domain actions to this worker.

## Fixtures and tests

`DemoSeedData` uses fixed IDs, ordering, and timestamps for development, screenshots, and deterministic tests. `DatabaseSeeder.seedIfEmpty()` is transactional and idempotent.

Validation includes:

- JVM convention, converter, ViewModel, and due-shorthand tests
- In-memory Room repository integration tests
- Area/Section ordering and relationship tests
- Task completion, hierarchy, ordering, and Main Task release tests
- Reusable-list item and suggestion tests
- Seed idempotency tests
- Fresh schema creation validation with `MigrationTestHelper`
- Migration 1→2 task-preservation validation
- App-shell navigation, shared modal, and complete Tasks workflow emulator tests

## Verified evidence

Phase 3 foundation verification:

- Android CI run: `30826025127`
- Tested code commit: `c5aa9d7d1f45095194f900f56a5a9767e549223e`

Phase 4 schema and feature migration verification:

- Android CI run: `30834579590`
- Tested code commit: `0465385fdb37e71b72d5d85c5b2ab830efd71c08`
- Lint, JVM tests, schema export, and APK job: `91756518325`
- Migration, repository, and Tasks workflow emulator job: `91757773903`
- Debug APK artifact: `8864424313`
- Room schemas artifact: `8864424608`
- Instrumentation reports artifact: `8864641748`
