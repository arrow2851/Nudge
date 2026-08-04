# Recurrence and Recommendation Engines

**Milestone:** Native Android Phase 8  
**Branch:** `feature/android-app-development`  
**Application version:** `0.8.0-dev`

## Purpose

Phase 8 moves recurrence maintenance and recommendation selection into explicit domain services. The engines remain local-first, deterministic, independently testable, and reusable by Today, background maintenance, and the later direct-intervention feature.

This phase does not request Usage Access, monitor foreground applications, launch interventions, block applications, or add notification behavior. Those Android-specific capabilities begin in Phase 9.

## Recurrence engine

`RecurrenceEngine` owns the recurrence calculations previously exposed only through the `ChoreRecurrence` object:

- Needs Attention, Coming Up, As Needed, and Paused grouping
- Daily or other interval schedules
- Weekly schedules with one or more weekdays
- Monthly schedules with safe shorter-month clamping
- Custom schedules backed by an interval, weekdays, or day of month
- Calendar-based catch-up to the next future occurrence
- Completion-based advancement from the completion timestamp
- Human-readable due labels

`ChoreRecurrence` remains as a compatibility facade so existing Areas, Today, repository, and test callers keep the same API while delegating to `DefaultRecurrenceEngine`.

## Recurrence maintenance

`RecurrenceMaintenancePlanner` identifies scheduled, active chores that have lost their derived `nextDueAt` value. It deliberately does not roll an overdue date forward: an overdue chore remains overdue until the user completes it or explicitly skips its occurrence.

`RecurrenceMaintenanceEngine` applies only planned repairs through the existing `ChoreRepository.saveChore` transaction boundary. As Needed, non-recurring, paused, archived, and already scheduled chores are not changed.

The maintenance logic uses existing Room tables and keeps `NudgeDatabase` at version 2.

## Recommendation engine

`RecommendationEngine` accepts a context and normalized Task or Chore candidates. Eligibility excludes candidates that are:

- Completed or cancelled
- Paused or blocked
- Disabled for nudges
- Snoozed beyond the current time
- Longer than the available time budget

Eligible candidates receive an inspectable score composed of:

- Due-date urgency and overdue age
- User priority
- Fit within the available duration
- Area or Section context match
- Quick-win preference for short actions
- Recent-suggestion penalty
- Repeated-dismissal penalty

Results use stable tie-breakers for deterministic tests and reproducible product behavior. Candidate adapters are available for both `Task` and `ChoreWithSchedule`.

## Repository-backed recommendations

`RecommendationReader` combines active Task trees and recurring Chores from their existing repositories, converts them to recommendation candidates, and returns ranked results. It is the stable read boundary for the later intervention coordinator.

Today's optional Quick Win now uses the same recommendation engine rather than maintaining a separate duration-only selector. The preference remains disabled by default.

## Background refresh

`DerivedDataRefreshEngine` combines recurrence repair and a top-candidate recommendation evaluation. `RefreshDerivedDataWorker` now executes that engine every twelve hours through the existing unique WorkManager schedule.

The worker:

- Requires no network connection
- Returns scanned and repaired recurrence counts as output data
- Returns the current top candidate identifiers for diagnostics
- Retries transient failures up to three attempts
- Reports a final error through WorkManager output data

No notification, widget, intervention, or user-visible mutation is performed by this worker.

## Verification coverage

### JVM tests

- Scheduled missing-due repair
- Paused, As Needed, and already scheduled preservation
- Compatibility-facade parity
- Eligibility and time-budget filtering
- Urgency and quick-win scoring
- Area and Section context scoring
- Recent-suggestion and dismissal rotation
- Deterministic ordering

### Android integration test

An in-memory Room test uses the real local Area, Task, and Chore repositories to verify that a derived-data refresh:

- Repairs a missing recurring due date
- Persists the repair through Room
- Ranks an eligible overdue Task first
- Excludes an over-budget Task

The existing migration, repository, navigation, Tasks, Areas, Lists, Today, and full emulator workflow suites remain regression coverage for this phase.

## Phase boundary

Phase 8 provides domain decisions and background maintenance only. Phase 9 may consume `RecommendationReader` from an intervention coordinator while separately implementing Android Usage Access onboarding, app-session calculation, limits, cooldowns, quiet hours, direct-navigation attempts, and compatibility fallbacks.
