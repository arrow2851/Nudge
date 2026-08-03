# Nudge Master Product Roadmap and Progress Tracker

**Project:** Nudge  
**Current platform:** Interactive browser prototype  
**Future platform:** Native Android application  
**Repository:** `arrow2851/Nudge`  
**Live prototype:** <https://arrow2851.github.io/Nudge/>

This document is the persistent, editable source of truth for product scope, progress, implementation order, and approval status. Update it whenever a feature changes state, a new requirement is added, or a design decision changes.

---

## Status legend

- `[x]` Completed and working
- `[~]` Partially completed or implemented as a prototype
- `[s]` Simulated because native Android capabilities are required
- `[ ]` Not started
- `[!]` Needs review, revision, or a product decision
- `[d]` Deferred to a later release
- `[b]` Blocked by another task or decision

A feature should only be marked `[x]` when the design is approved, the flow works end to end, relevant states exist, data persists correctly, and the feature has been reviewed on mobile.

---

# 1. Current-state expectations

## What the current prototype is

The current version is a browser-based interactive product prototype intended to validate:

- Visual direction
- Information hierarchy
- Navigation
- Task and chore workflows
- Reusable-list behavior
- Intervention concepts
- Interaction speed
- Wording and density
- Product logic before Android development

## Completed foundation

- [x] GitHub repository established
- [x] Product requirements documented
- [x] Technical architecture documented
- [x] Initial data model documented
- [x] Delivery roadmap documented
- [x] Full screen inventory documented
- [x] Seventy-three rough ASCII screen/state concepts documented
- [x] Browser prototype folder created
- [x] GitHub Pages deployment configured
- [x] Live prototype accessible from phone
- [x] Shared visual design tokens created
- [x] Shared mobile app shell created
- [x] Bottom navigation created
- [x] Hash-based routing created
- [x] Browser persistence created with `localStorage`
- [x] Shared buttons, cards, chips, rows, sheets, fields, progress bars, empty states, and toasts created
- [x] Today screen implemented
- [x] Daily progress implemented
- [x] Quick Win card implemented
- [x] Quick Win cycling implemented
- [x] Due Today section implemented
- [x] Overdue section implemented
- [x] Active Lists preview implemented
- [x] Recent Activity preview implemented
- [x] Quick Add implemented
- [x] Basic natural-language metadata detection implemented
- [x] Binary task completion implemented
- [x] Light, Moderate, and Deep completion grading implemented
- [x] Undo behavior implemented
- [x] Demo-data reset implemented

## Placeholder routes

- [~] Areas
- [~] Lists
- [~] Tasks
- [~] More
- [~] Search
- [~] Settings entry points
- [~] Intervention controls
- [~] Gemini controls

## Simulated until native Android

- [s] Distracting-app detection
- [s] Continuous-use timer
- [s] Direct app redirection
- [s] Usage Access permission
- [s] Android background-launch restrictions
- [s] Android notifications
- [s] Android widgets
- [s] Driving, phone-call, and meeting detection
- [s] Real Gemini API calls
- [s] Voice transcription
- [s] Cloud synchronization

## Current prototype limitations

- It does not monitor actual Android apps.
- It does not redirect from Instagram, YouTube, Reddit, or other apps.
- It does not access Android usage statistics.
- It does not send real Android notifications.
- It does not create real home-screen widgets.
- It does not use a production database.
- It does not use a real Gemini backend.
- It is not a native installable Android application.
- It is not Play Store ready.
- Its visual design is not frozen.

---

# 2. Master ordered execution checklist

## Phase 0 — Product governance

- [x] Create repository
- [x] Add requirements, architecture, screen inventory, wireframes, roadmap, open questions, and ADRs
- [x] Add persistent project tracker
- [ ] Add changelog
- [ ] Define prototype and Android version numbering
- [ ] Define GitHub milestone and issue-label taxonomy
- [ ] Create milestones for each prototype phase
- [ ] Create milestones for Android phases
- [ ] Add design-revision issue template
- [ ] Add product-decision issue template
- [ ] Add compatibility-report issue template
- [ ] Add accessibility-report issue template
- [ ] Define what counts as design approval
- [ ] Define what counts as functional approval
- [ ] Track Approved / Needs Revision per feature
- [ ] Maintain an ideas backlog that does not interrupt the active milestone
- [ ] Keep rejected ideas documented
- [ ] Add before-and-after screenshots for major revisions

## Phase 1 — Prototype infrastructure

### Repository and deployment

- [x] Create `mockups/prototype/`
- [x] Create readable HTML, CSS, and JavaScript structure
- [x] Remove obsolete fragment loader
- [x] Add prototype README
- [x] Configure GitHub Pages
- [x] Confirm mobile access
- [ ] Add `assets/`, `screenshots/`, `fixtures/`, and `tests/`
- [ ] Add favicon and optional web-app manifest
- [ ] Add formatting and linting
- [ ] Add HTML, CSS, and JavaScript checks in GitHub Actions
- [ ] Add deployment-status badge
- [ ] Display prototype version, build date, and commit SHA in review panel
- [ ] Add pull-request preview deployment if needed

### Routing

- [x] Today route
- [x] Areas route
- [x] Lists route
- [x] Tasks route
- [x] More route
- [ ] Nested area and room routes
- [ ] Task and chore detail routes
- [ ] Reusable-list route
- [ ] Shopping-session state
- [ ] Intervention route
- [ ] Focus Mode route
- [ ] Gemini route
- [ ] Settings routes
- [ ] History, Insights, Templates, and Archived routes
- [ ] Not Found route
- [ ] Browser Back handling
- [ ] Scroll-position restoration
- [ ] Deep-link handling

### State management

- [x] Browser state store
- [x] `localStorage` persistence
- [x] Default demo state
- [x] State reset
- [x] Task completion updates
- [x] Recent-activity updates
- [x] Undo snapshots
- [ ] State schema versioning and migrations
- [ ] Corrupted-state recovery
- [ ] Data import/export
- [ ] Clear-all-data flow
- [ ] Separate domain state from UI state
- [ ] Event history
- [ ] Recurrence engine
- [ ] Recommendation engine
- [ ] List-suggestion engine
- [ ] Intervention-session engine
- [ ] Settings store
- [ ] Feature flags
- [ ] Mock clock controls for time-dependent tests

### Demo scenarios

- [ ] Normal day
- [ ] Empty Today
- [ ] Heavy overdue backlog
- [ ] All tasks completed
- [ ] New user with no areas or chores
- [ ] Grocery list with remembered items
- [ ] Duplicate grocery items
- [ ] No eligible intervention task
- [ ] Permission missing
- [ ] Gemini offline
- [ ] Very long names and very large lists
- [ ] Many areas and rooms
- [ ] Dark theme and large-text scenarios

## Phase 2 — Design system

### Foundations

- [x] Core color, spacing, radius, shadow, and motion tokens
- [x] Light and dark theme tokens
- [ ] Contrast review
- [ ] Final typography scale and line heights
- [ ] Icon size scale
- [ ] Standard page padding
- [ ] Compact versus comfortable density
- [ ] Material 3 token mapping
- [ ] Semantic colors for overdue, waiting, blocked, due soon, and completed
- [ ] Focus-outline, disabled, loading, and skeleton styles

### Components

- [x] Primary, secondary, ghost, danger, and icon buttons
- [x] Cards, chips, list rows, progress bar, bottom sheet, inputs, empty state, and toast
- [ ] Checkbox, radio, toggle, and segmented control
- [ ] Date, time, duration, and recurrence pickers
- [ ] Search field and suggestion dropdown
- [ ] Context, priority, due-status, and task-type badges
- [ ] Grade selector and Snackbar with Undo
- [ ] Dialogs and destructive confirmation
- [ ] Quantity stepper and timer controls
- [ ] Swipe and reorder visuals
- [ ] Loading spinner and skeletons
- [ ] Inline errors and permission rows
- [ ] Setting rows, chart cards, widget frames, and notification preview

### Interaction standards

- [ ] Define tap, long-press, swipe, double-tap, and drag behavior
- [ ] Define sheet dismissal and confirmation behavior
- [ ] Define Undo and auto-dismiss durations
- [ ] Define animation and reduced-motion behavior
- [ ] Define keyboard, scrolling, and error-recovery behavior
- [ ] Define future Android haptic intent

## Phase 3 — Today and daily workflow

### Header and progress

- [x] Header, greeting, Search, and More controls
- [x] Daily progress count and progress bar
- [ ] Dynamic greeting and local date
- [ ] Pause/offline indicators
- [ ] Decide how recurring chores, list items, and graded completions count
- [ ] Handle zero scheduled tasks and tasks added mid-day
- [ ] Optional redirected-minutes metric
- [ ] Progress-detail view

### Quick Win

- [x] Card, task, location, duration, Start, Complete, and Another
- [x] Basic cycling
- [ ] Real recommendation scoring
- [ ] Overdue, duration, priority, location, and time-of-day weighting
- [ ] Dismissal and recent-suggestion penalties
- [ ] Respect blocked, snoozed, and context-incompatible tasks
- [ ] No-eligible-task state
- [ ] “Do not suggest” and “Why this task?”
- [ ] Controlled randomness and recommendation history

### Due and overdue

- [x] Due Today rows and completion
- [x] Expandable Overdue section
- [ ] Urgency, priority, and manual sorting
- [ ] Time-specific, recurring, waiting, and blocked indicators
- [ ] Swipe, long press, and detail navigation
- [ ] Empty and large-list states
- [ ] Days-overdue label and severity styling
- [ ] Snooze, reschedule, skip occurrence, and bulk-reschedule
- [ ] Recurring overdue rules and backlog-clearing flow

### Active Lists and Recent Activity

- [x] Active Lists preview and counts
- [x] Recent Activity feed
- [ ] Navigate to selected list
- [ ] Pinned and recently used ordering
- [ ] Quick list-item add from Today
- [ ] Timestamps, source, intervention, and list-session activity
- [ ] Full History link and Undo from activity

### Quick Add

- [x] Add task/chore and infer basic type, area, room, recurrence, duration, and grading
- [x] Display detected metadata and support Undo
- [ ] Editable metadata chips
- [ ] Manual type and list selection
- [ ] Due date/time and priority parsing
- [ ] Expanded recurrence parsing and schedule basis
- [ ] Notes, context tags, and Nudge eligibility
- [ ] Duplicate detection and remembered suggestions
- [ ] Microphone and Gemini handoff
- [ ] Keyboard submission, validation, recent suggestions, and contextual defaults
- [ ] Complete advanced form

### Completion

- [x] Binary and graded completion
- [x] Progress and Recent Activity update
- [x] Undo
- [ ] Completion note, actual duration, and source
- [ ] Next-due calculation and recurrence history
- [ ] Confirmation screen and auto-dismiss
- [ ] Follow-up task, partial completion, reopen, edit, and delete record

## Phase 4 — Areas and rooms

- [~] Areas route exists
- [ ] Area cards, due counts, room previews, and custom areas
- [ ] Add, edit, archive, delete, and reorder areas
- [ ] Handle tasks when area is archived/deleted
- [ ] Area Detail with filters and General section
- [ ] Add/edit/archive/delete/reorder/move rooms
- [ ] Room status, overdue count, last reset, and deep-clean status
- [ ] Room Detail with Due Now, Routine Chores, One-Time Tasks, and Recent
- [ ] Add Task/Chore from room
- [ ] Room Reset with ordered tasks, progress, skip, grade, pause, resume, finish, and persistence

## Phase 5 — Chores and one-time tasks

### Chores

- [~] Basic type, grading, and recurrence text
- [ ] Formal recurrence object and interval rules
- [ ] Calendar- versus completion-based cadence
- [ ] Days of week, day of month, seasonal, pause, skip, and when-needed mode
- [ ] Preferred time, context tags, supplies, blocked state, and Nudge eligibility
- [ ] Chore Detail with history, Start, Complete, Snooze, Skip, Pause, Edit, Archive, Delete, and Duplicate

### Tasks

- [~] Basic task, area, and estimate
- [ ] Due date/time, priority, status, waiting/blocked reason, project, notes, attachments, reminders, and context
- [ ] Task Detail with Start, Complete, Reschedule, Waiting, Blocked, Edit, Archive, Delete, Duplicate, and history

## Phase 6 — Reusable lists

- [~] Lists route and Today preview
- [ ] Full Lists screen, pinning, counts, last-used date, ordering, search, and empty state
- [ ] Create/Edit List settings
- [ ] Reusable List Detail with active, checked, recent, favorite, quantity, unit, category, store, note, reorder, and delete
- [ ] Remembered-item catalog with frequency, recency, typical quantity, category, store, and fuzzy search
- [ ] Non-obstructive suggestions
- [ ] Exact and normalized duplicate handling
- [ ] Shopping session with remaining/completed sections, add during session, Undo, finish, summary, persistence, and recovery

## Phase 7 — Direct intervention

### Prototype

- [ ] Simulate Redirect control
- [ ] Intervention screen with app, duration, recommended task, Start, Already Done, Different Task, and Not Now
- [ ] Return to previous screen and record event
- [ ] Update redirected-minutes metric
- [ ] No-eligible-task, permission-missing, and fallback-notification states
- [ ] Alternative-task list and filters
- [ ] Not Now options, cooldown, and reason tracking
- [ ] Focus Mode timer, pause/resume, completion, grade, exit, persistence, and reduced-distraction design
- [ ] Intervention Settings for apps, duration, strictness, cooldown, quiet hours, daily maximum, and exclusions

### Android later

- [d] Installed-app selection and Usage Access onboarding
- [d] UsageStatsManager session detection and grace period
- [d] Combined app sessions and Intervention Coordinator
- [d] Direct foreground launch attempt and compatibility fallback
- [d] Notification/overlay evaluation
- [d] Manufacturer testing, battery guidance, and reliability telemetry

## Phase 8 — Tasks screen

- [~] Route exists
- [ ] Inbox, Today, Upcoming, Waiting, Blocked, Someday, and Completed
- [ ] Filtering by status, location, due state, duration, priority, type, recurrence, context, and Nudge eligibility
- [ ] Sorting by due date, priority, duration, recency, manual order, area, and recommendation score
- [ ] Grouping, search, Quick Add, bulk actions, empty states, and swipe actions

## Phase 9 — Search

- [~] Search icon exists
- [ ] Search screen and recent searches
- [ ] Search tasks, chores, areas, rooms, lists, active items, remembered items, and history
- [ ] Grouping, filtering, highlights, typo tolerance, no-results state, and quick actions

## Phase 10 — History

- [~] Limited Recent Activity exists
- [ ] Full History with date grouping and filters
- [ ] Task/chore completions, grades, list sessions, intervention events, Quick Add, snooze, and reschedule events
- [ ] Search, edit/delete completion, reopen, empty state, and export

## Phase 11 — Templates

- [ ] Kitchen, Bathroom, Bedroom, Living Room, Laundry, Car, Grocery, Household Restock, and Travel templates
- [ ] Custom templates
- [ ] Preview, selection, destination, recurrence override, duplicate avoidance, edit/delete, and import/export

## Phase 12 — Insights

- [ ] Weekly/monthly completions and redirected minutes
- [ ] Intervention acceptance and bypasses
- [ ] Areas maintained, postponed tasks, overdue trend, grade distribution, completion delay, and reused list items
- [ ] Date range, charts, empty state, privacy explanation, and anti-guilt design
- [!] Decide whether streaks or gamification belong in Nudge

## Phase 13 — Gemini prototype

- [ ] Gemini Input with text, voice placeholder, examples, recent commands, send, cancel, and offline state
- [ ] Simulated functions for create/update/search/complete operations
- [ ] Validation for fields, recurrence, dates, areas, lists, ambiguity, and multi-action commands
- [ ] Review screen with edit/remove/confirm individually or all
- [ ] Strong confirmation for destructive and bulk actions
- [ ] Result screen with success, partial failure, Undo, open item, retry, and history
- [d] Secure real backend, rate limits, API-key protection, function calling, privacy, and real voice later

## Phase 14 — Settings

- [~] More route exists
- [ ] Main Settings navigation
- [ ] Intervention, Tasks and Chores, Lists, Gemini, Notifications, Permissions, Appearance, Widgets, Data, Privacy, About, and Help
- [ ] Task defaults, grade labels, schedule basis, week start, Undo window, and Nudge defaults
- [ ] List memory, suggestions, duplicate behavior, sorting, grouping, and session defaults
- [ ] Theme, density, reduced motion, high contrast, completed-item display, and font preview
- [ ] Export/import, clear histories, reset, delete all data, backup status, and confirmation flows

## Phase 15 — Onboarding

- [ ] Splash and Welcome
- [ ] Areas and optional rooms
- [ ] Starter chores
- [ ] Distracting-app selection
- [ ] Usage Access and redirect education
- [ ] Strictness, app limits, combined sessions, daily maximum, and quiet hours
- [ ] First task and first list
- [ ] Widget introduction and Finish Setup
- [ ] Resume interrupted onboarding and skip monitoring
- [ ] Run core app without permissions
- [ ] Permission-denied and accessibility paths

## Phase 16 — Widgets and quick access

- [ ] Prototype widget gallery for Quick Add, Next Task, Grocery, Today, and Pause Nudges
- [ ] Resize, theme, empty, and paused states
- [d] Jetpack Glance implementation later
- [d] Launcher shortcuts, Quick Settings tile, voice, and NFC/QR evaluation later

## Phase 17 — Empty, error, and edge states

- [ ] Empty states for every primary route and collection
- [ ] No Quick Win and no eligible intervention task
- [ ] Corrupted storage, invalid data, duplicates, missing references, permission failures, redirect failures, notification failures, Gemini failures, and unknown routes
- [ ] Long names, large datasets, missing durations, recurrence edge cases, repeated dismissals, interrupted sessions, browser reloads, clock/time-zone changes, and daylight saving

## Phase 18 — Accessibility

- [ ] Heading order, labels, keyboard navigation, visible focus, screen-reader review, contrast, and non-color status
- [ ] Touch target sizes, large text, 200% zoom, reduced motion, high contrast, focus trapping, and error announcements
- [ ] Gesture alternatives and timer accessibility
- [ ] TalkBack and Android font-scale plan

## Phase 19 — Responsive/device testing

- [ ] Small, standard, and large Android phones
- [ ] Foldable and landscape states
- [ ] Safe areas, browser chrome, keyboard, bottom-sheet behavior, and short heights
- [ ] Dark, high contrast, and slow-device behavior
- [ ] Android Chrome, Samsung Internet, desktop browsers, and iPhone Safari for review compatibility

## Phase 20 — Automated prototype quality

- [ ] Formatting, linting, and unit tests
- [ ] Recurrence, recommendation, state migration, completion, Undo, Quick Add, duplicates, suggestions, cooldown, and routing tests
- [ ] Browser end-to-end, screenshot regression, and accessibility tests
- [ ] GitHub Actions validation and deployment blocking on failure

## Phase 21 — Review and approval

For each primary area:

- [ ] Review
- [ ] Revise
- [ ] Approve

Apply this sequence to:

- [ ] Today
- [ ] Areas and Rooms
- [ ] Tasks and Chores
- [ ] Lists and Shopping
- [ ] Intervention and Focus Mode
- [ ] Search, History, Templates, and Insights
- [ ] Gemini
- [ ] Settings and Onboarding
- [ ] Widgets and edge states
- [ ] Full end-to-end prototype
- [ ] Freeze Prototype Design v1
- [ ] Document intentional Android deviations

## Phase 22 — Native Android preparation

- [d] Create Kotlin/Compose project and package name
- [d] Configure Material 3, Navigation, Hilt, Room, DataStore, WorkManager, serialization, tests, CI, signing, and build variants
- [d] Define modules, entities, repositories, use cases, ViewModels, UI state, navigation, recurrence, recommendation, intervention, Gemini, sync, and widget adapters
- [d] Implement database entities and migrations
- [d] Translate every approved prototype screen to Compose

## Phase 23 — Android permissions and compatibility

- [d] Usage Access education and status
- [d] Notification permission and battery guidance
- [d] Direct-redirect compatibility test and fallback
- [d] Privacy disclosures and Accessibility Service avoidance review
- [d] Pixel, Samsung, OnePlus, Motorola, and required manufacturer testing
- [d] Android-version compatibility matrix and troubleshooting

## Phase 24 — Security and privacy

- [ ] Data-minimization, retention, deletion, export, analytics, and logging policies
- [ ] Gemini data flow and backend threat model
- [ ] Cloud-backup encryption and account deletion
- [ ] Privacy policy, terms if needed, and Play Store Data Safety preparation
- [ ] Secret management, rate limits, abuse protection, and secure backend controls

## Phase 25 — Performance and battery

- [d] Startup, database, rendering, widgets, usage monitor, timer, battery, and memory measurements
- [d] Background and notification optimization
- [d] Process death, reboot, long-session, and large-dataset tests

## Phase 26 — Beta and release

- [d] Internal alpha and personal daily use
- [d] Closed beta and structured feedback
- [d] Crash, data-loss, intervention, and battery fixes
- [d] Accessibility and privacy reviews
- [d] Play Store assets, description, support, policy forms, submission, feedback, release, monitoring, and hotfix process

---

# 3. High-level functionality and flow matrix

| Area | Status | Current expectation |
|---|---:|---|
| Repository and documentation | `[x]` | Active source of truth |
| GitHub Pages deployment | `[x]` | Live and automatic from `main` |
| Design system foundation | `[~]` | Core tokens/components exist; full system pending |
| App shell and bottom navigation | `[x]` | Working |
| Today | `[~]` | Functional first version; approval and edge states pending |
| Quick Add | `[~]` | Basic intelligent parsing; advanced editing pending |
| Completion and grading | `[~]` | Working; recurrence and richer metadata pending |
| Areas and rooms | `[~]` | Route only |
| Chore and task details | `[ ]` | Pending |
| Tasks management | `[~]` | Route only |
| Reusable lists | `[~]` | Preview only |
| Shopping session | `[ ]` | Pending |
| Search | `[~]` | Control only |
| Full History | `[ ]` | Pending |
| Templates | `[ ]` | Pending |
| Insights | `[ ]` | Pending |
| Intervention prototype | `[ ]` | Pending |
| Real Android intervention | `[s]` | Native stage |
| Focus Mode | `[ ]` | Pending |
| Gemini prototype | `[ ]` | Pending |
| Real Gemini integration | `[s]` | Backend/native stage |
| Settings | `[~]` | Route/entry points only |
| Onboarding | `[ ]` | Pending |
| Widget gallery | `[ ]` | Pending |
| Real Android widgets | `[s]` | Native stage |
| Accessibility pass | `[ ]` | Pending |
| Automated tests | `[ ]` | Pending |
| Prototype design freeze | `[ ]` | Pending |
| Native Android app | `[d]` | Begins after approved prototype |

---

# 4. Immediate build order

1. [ ] Areas screen
2. [ ] Add/Edit Area
3. [ ] Area Detail
4. [ ] Add/Edit Subarea
5. [ ] Room Detail
6. [ ] Room Reset
7. [ ] Chore Detail
8. [ ] One-Time Task Detail
9. [ ] Tasks screen
10. [ ] Filter and Sort
11. [ ] Lists screen
12. [ ] Create/Edit List
13. [ ] Reusable List Detail
14. [ ] Remembered Suggestions
15. [ ] Shopping Session
16. [ ] Direct Intervention
17. [ ] Different Task
18. [ ] Not Now
19. [ ] Focus Mode
20. [ ] Intervention Settings
21. [ ] Search
22. [ ] History
23. [ ] Templates
24. [ ] Insights
25. [ ] Gemini Input
26. [ ] Gemini Review
27. [ ] Settings
28. [ ] Onboarding
29. [ ] Widget Gallery
30. [ ] Empty and Error States
31. [ ] Accessibility pass
32. [ ] Responsive-device pass
33. [ ] End-to-end review
34. [ ] Prototype v1 freeze
35. [ ] Begin Android implementation

---

# 5. Progress summary

## Browser prototype

Estimated overall completion: **approximately 15–20%**.

The infrastructure and Today foundation are strong, but most major product areas are still pending.

## Native Android application

Estimated overall completion: **approximately 0–3%**.

The product and architecture are documented, but the native Android codebase has not yet been created.

---

# 6. Definition of prototype completion

The browser prototype is complete when:

- [ ] Every primary route is implemented.
- [ ] Every major flow works end to end.
- [ ] Core data persists safely.
- [ ] Major empty and error states exist.
- [ ] All primary screens work on a phone.
- [ ] A realistic day can be completed using the prototype.
- [ ] Areas, rooms, chores, tasks, and reusable lists are manageable.
- [ ] Intervention and Focus Mode can be simulated.
- [ ] Gemini actions can be simulated and reviewed.
- [ ] Settings and onboarding are complete.
- [ ] Accessibility and responsive passes are complete.
- [ ] Design revisions have been reviewed and approved.
- [ ] Prototype Design v1 is frozen as the Android reference.

# 7. Definition of Android MVP completion

The Android MVP is complete when:

- [ ] Core tasks, chores, areas, rooms, and lists work offline.
- [ ] Room and DataStore persistence are stable.
- [ ] Recurrence calculations are tested.
- [ ] Usage Access onboarding works.
- [ ] Selected-app session detection works.
- [ ] Direct intervention is attempted where permitted.
- [ ] Notification fallback works.
- [ ] Cooldowns and quiet hours work.
- [ ] Widgets work.
- [ ] Battery impact is acceptable.
- [ ] Data survives process death and reboot.
- [ ] Accessibility checks pass.
- [ ] Privacy requirements are met.
- [ ] Closed-beta feedback is addressed.
- [ ] The app is ready for Play Store review.

---

# 8. Update rules

When updating this file:

1. Change status markers only when the actual implementation state changes.
2. Add new requirements under the correct phase rather than creating disconnected notes.
3. Mark uncertain product choices with `[!]`.
4. Mark native-only work with `[s]` or `[d]` until Android development begins.
5. Never mark a prototype feature complete merely because a screen exists; the end-to-end flow and states must work.
6. Record major scope changes in an ADR and link them here.
7. Keep the Immediate Build Order current after every completed feature batch.
