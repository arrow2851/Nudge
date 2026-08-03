# Nudge Master Product Roadmap and Progress Tracker

**Project:** Nudge  
**Current platform:** Interactive browser prototype plus verified native Android foundation  
**Native milestone:** Phase 4 — Tasks vertical slice  
**Repository:** `arrow2851/Nudge`  
**Live prototype:** <https://arrow2851.github.io/Nudge/>

This document remains the master product-scope tracker. Detailed native implementation status and evidence live in `docs/progress/android-development.md`.

## Native Android milestone summary

- [x] Phase 1 — Android project foundation, CI, APK, and emulator verification
- [x] Phase 2 — Production Compose shell, design system, accessibility, and shared components
- [x] Phase 3 — Domain models, Room database, repositories, DataStore, WorkManager boundary, fixtures, and persistence tests
- [ ] Phase 4 — Complete repository-backed Tasks vertical slice
- [ ] Phase 5 — Areas, Sections, and recurring Chores
- [ ] Phase 6 — Reusable Lists
- [ ] Phase 7 — Today aggregation
- [ ] Phase 8 — Recurrence and recommendation engines
- [ ] Phase 9 — Direct Android intervention
- [ ] Phase 10 — Notifications, widgets, shortcuts, and backup
- [ ] Phase 11 — Release hardening

Phase 3 verification:

- Android CI run `30826025127`
- Tested commit `c5aa9d7d1f45095194f900f56a5a9767e549223e`
- Room version-1 schema committed under `app/schemas`
- Repository, migration-schema, deterministic-seed, navigation, and modal tests passed on Android API 35

For product behavior, feature scope, and browser-prototype history, use the documents under `docs/`, especially:

- `docs/product-requirements.md`
- `docs/progress/product-direction-amendments.md`
- `docs/progress/tasks-destination.md`
- `docs/progress/areas-and-rooms.md`
- `docs/progress/lists-destination.md`

The prior detailed browser-prototype tracker was intentionally consolidated here because native execution now has its own verified checklist and the older duplicated status list had become stale.
