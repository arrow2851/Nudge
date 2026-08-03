# Local Data Foundation

Phase 3 establishes Nudge's local-first persistence boundary. Feature screens consume domain repositories and observable flows; they do not depend directly on Room or DataStore.

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

## Room schema version 1

Tables:

- `areas`
- `sections`
- `tasks`
- `chores`
- `chore_schedules`
- `completions`
- `reusable_lists`
- `list_catalog_items`
- `list_items`

Foreign keys protect Area/Section, parent/subitem, Chore/Schedule, List/Item, and completion-history relationships. UI-facing DAO queries return `Flow` and apply active/archive filtering and stable ordering.

The generated schema is committed at:

`app/schemas/com.arrow2851.nudge.core.database.NudgeDatabase/1.json`

## Migration policy

1. `exportSchema` remains enabled.
2. The Room Gradle plugin writes schemas under `app/schemas`.
3. Every schema JSON file is committed to source control.
4. Every database version increase includes an explicit auto-migration or manual `Migration` object.
5. Migration tests use `MigrationTestHelper` and the committed schemas.
6. Production database construction never calls destructive-migration fallback.
7. A migration must preserve user data unless an ADR explicitly approves a destructive development-only reset before public release.

Version 1 has no migration objects because it is the initial schema. `NudgeMigrations.All` is the single registration point for future migrations.

## Repositories

- `AreaRepository`
- `TaskRepository`
- `ChoreRepository`
- `CompletionRepository`
- `ReusableListRepository`
- `PreferencesRepository`

Room-backed implementations map entities to immutable domain models. DataStore stores lightweight application preferences such as theme, completed-item visibility, due-date shorthand, optional Daily Progress, optional Quick Win, and demo-data state.

## Background-work boundary

`MaintenanceScheduler` owns unique periodic WorkManager registration. `RefreshDerivedDataWorker` is Hilt-created and intentionally performs no recurrence mutation yet. Phase 3 establishes the stable scheduling and injection boundary; the recurrence and reminder phases attach their tested domain actions to this worker later.

## Fixtures and tests

`DemoSeedData` uses fixed IDs, ordering, and timestamps for development, screenshots, and deterministic tests. `DatabaseSeeder.seedIfEmpty()` is transactional and idempotent.

Validation includes:

- JVM convention and converter tests
- In-memory Room repository integration tests
- Area/Section ordering and relationship tests
- Task completion state and timestamp tests
- Reusable-list item and suggestion tests
- Seed idempotency tests
- Exported-schema creation validation with `MigrationTestHelper`
- Existing app-shell navigation and modal interaction tests

## Verified evidence

Phase 3 was verified on August 3, 2026:

- Android CI run: `30826025127`
- Tested code commit: `c5aa9d7d1f45095194f900f56a5a9767e549223e`
- Lint, JVM tests, schema export, and APK job: `91727740611`
- Repository, schema, seed, and UI emulator job: `91729098110`
- Debug APK artifact: `8861007957`
- Room schemas artifact: `8861008650`
- Instrumentation reports artifact: `8861930353`
