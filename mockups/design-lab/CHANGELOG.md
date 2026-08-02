# Design Lab Changelog

## 0.10.6 — 2026-08-02

### Look #8 — Ambient Glass Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look8-tasks.js` and `look8-tasks.css`
- Added translucent high-value surfaces with mostly solid task rows
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved separate drag, completion, title, optional time, options, and subtask controls
- Added Active, Main Tasks, and Completed summary counts
- Added main-task progress text, percentage, and blue-to-violet progress track
- Preserved one-level hierarchy, completion propagation, and subtask release
- Preserved pointer drag plus Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item grouping and Hide/Show Completed
- Preserved shared task state across Looks #2 through #8
- Limited blur to high-value surfaces rather than every task row
- Added no-backdrop-filter and Reduced Transparency solid fallbacks
- Added Forced Colors and Reduced Motion handling
- Extended validation to seven task Looks and seven task stylesheets
- Added `LOOK-8-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.6.md`
- Set Look #9 — Retro Digital as the final Task hierarchy implementation
- Kept lower-end paint/compositing measurements, exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.5 — 2026-08-02

### Look #2 — Warm Editorial Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look2-tasks.js` and `look2-tasks.css`
- Added a calm practical task page with Active, Main Tasks, and Completed summary counts
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved separate drag, completion, title, optional time, options, and subtask controls
- Added main-task progress count, percentage, and quiet progress track
- Preserved one-level hierarchy, completion propagation, and subtask release
- Preserved pointer drag plus Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item grouping and Hide/Show Completed
- Preserved shared task state across Looks #2 through #7
- Kept editorial context practical without reflection or diary requirements
- Extended validation to six task Looks and six task stylesheets
- Added `LOOK-2-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.5.md`
- Set Look #8 — Ambient Glass as the next Task hierarchy implementation
- Kept production persistence, notifications, collaboration, nested subtasks, deletion, and production gestures outside the Design Lab boundary
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.4 — 2026-08-02

### Look #6 — Tactile Household Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look6-tasks.js` and `look6-tasks.css`
- Added paper-like task cards, drawer-style subtask grouping, and physical-looking controls
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved separate drag, completion, title, optional time, options, and subtask controls
- Added Active Cards, Main Tasks, and Filed Done summary counts
- Added main-task completion statement, percentage, and progress track
- Preserved one-level hierarchy, completion propagation, and subtask release
- Preserved pointer drag plus Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item grouping and Hide/Show Completed
- Preserved shared task state across Looks #3, #4, #5, #6, and #7
- Kept physical household metaphors organizational rather than defect-based
- Extended validation to five task Looks and five task stylesheets
- Added `LOOK-6-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.4.md`
- Set Look #2 — Warm Editorial as the next Task hierarchy implementation
- Kept production persistence, notifications, collaboration, nested subtasks, deletion, and production gestures outside the Design Lab boundary
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.3 — 2026-08-02

### Look #7 — Bold Utility Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look7-tasks.js` and `look7-tasks.css`
- Added a high-contrast task register with Active, Main, and Done counts
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved separate drag, completion, title, optional time, settings, and subtask controls
- Added main-task progress fraction, percentage, and progress track
- Preserved one-level hierarchy, completion propagation, and subtask release
- Preserved pointer drag plus Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item grouping and Hide/Show Completed
- Preserved shared task state across Looks #3, #4, #5, and #7
- Kept direct language factual without treating active work as failure
- Extended validation to four task Looks and four task stylesheets
- Added `LOOK-7-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.3.md`
- Set Look #6 — Tactile Household as the next Task hierarchy implementation
- Kept production persistence, notifications, collaboration, nested subtasks, deletion, and production gestures outside the Design Lab boundary
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.2 — 2026-08-02

### Look #5 — Playful Modular Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look5-tasks.js` and `look5-tasks.css`
- Added colorful modular task cards with Active, Main, and Done summary blocks
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved separate drag, completion, title, optional time, settings, and subtask controls
- Added friendly progress language and a visible progress track
- Preserved one-level hierarchy, completion propagation, and subtask release
- Preserved pointer drag plus Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item grouping and Hide/Show Completed
- Preserved shared task state across Looks #3, #4, and #5
- Kept positive feedback free of points, streaks, rewards, and scoring
- Extended validation to three task Looks and three task stylesheets
- Added `LOOK-5-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.2.md`
- Set Look #7 — Bold Utility as the next Task hierarchy implementation
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.1 — 2026-08-02

### Look #3 — Precision Minimal Task hierarchy loop

- Reused the shared scenario-isolated Task hierarchy state engine
- Added `renderers/look3-tasks.js` and `look3-tasks.css`
- Added a compact operational task register with Active, Main, and Done metrics
- Preserved top and bottom empty-task creation with immediate inline editing focus
- Preserved the agreed row anatomy: drag handle, completion control, editable title, optional time shorthand, settings disclosure, and separate subtask plus
- Preserved one-level main-task and subtask relationships
- Added explicit progress count, percentage, and progress track
- Preserved completion propagation between main tasks and subtasks
- Preserved subtask release when main-task mode is turned off
- Preserved pointer drag hooks and explicit Move Up, Move Down, Indent, and Unindent controls
- Preserved completed-item bottom grouping and Hide/Show Completed
- Preserved task state while switching between Looks #3 and #4
- Refactored the app controller to shared routine and task renderer registries
- Extended validation to two task Looks, both task renderers, both task stylesheets, and cross-Look state hooks
- Added `LOOK-3-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.1.md`
- Set Look #5 — Playful Modular as the next Task hierarchy implementation
- Kept production persistence, notifications, collaboration, nested subtasks, deletion, and mobile gesture implementation outside the Design Lab boundary
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.10.0 — 2026-08-02

### Look #4 — Zen Focus Task hierarchy loop

- Added the Tasks route and made Look #4 Tasks the active review entry
- Added a separate scenario-isolated `task-state.js` store
- Added top and bottom empty-task creation with immediate inline editing focus
- Added the agreed row anatomy: drag handle, completion control, editable title, optional time shorthand, settings disclosure, and separate subtask plus
- Added one-level main-task and subtask relationships
- Added subtask progress counts and progress bar
- Added completion propagation between main tasks and subtasks
- Added subtask release when main-task mode is turned off
- Added native pointer drag reorder hooks
- Added explicit Move Up, Move Down, Indent, and Unindent controls
- Added completed-item bottom grouping and Hide/Show Completed
- Added Normal, Backlog, New User, All Clear, Large Household, Long Content, and Large Text task fixtures
- Added `renderers/look4-tasks.js` and `look4-tasks.css`
- Extended validation for task state, Tasks routing, all hierarchy actions, responsive behavior, Forced Colors, and Reduced Motion
- Added `LOOK-4-TASK-HIERARCHY.md` and `CHECKLIST-PROGRESS-0.10.0.md`
- Set Look #3 — Precision Minimal as the next Task hierarchy implementation
- Kept production persistence, notifications, collaboration, nested subtasks, and mobile gesture implementation outside the Design Lab boundary
- Kept exact-checkout browser, Android gesture, and screen-reader evidence pending
- Kept Look #1 and `main` unchanged

## 0.9.7 — 2026-08-01

### Look #9 — Retro Digital Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Retro Digital Today / Needs Attention with one selected routine and an explicit optional queue
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with separate Complete and detail controls
- Added routine records, practical facts, completion logs, and immediate Undo
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #2 through #9
- Preserved per-routine Area routing in mixed Today queues
- Added `look9-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Extended the validator to eight interactive Looks, forty-eight interactive renderer exports, eight interactive stylesheets, and shared state hooks
- Added `LOOK-9-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.7.md`
- Completed the Routine Completion Loop sequence across all eight active Looks
- Set Look #4 Task hierarchy as the next automatic implementation milestone
- Kept exact-checkout browser, Android, screen-reader, single-version regression, and Ambient Glass paint evidence pending
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.6 — 2026-08-01

### Look #8 — Ambient Glass Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Ambient Glass Today / Needs Attention with one translucent priority card and a secondary queue
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with separate Complete and detail controls
- Added Chore facts and restrained completed-cycle feedback with immediate Undo
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #2 through #8
- Added `look8-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Added Reduced Transparency and no-backdrop-filter solid fallbacks
- Limited blur to high-value surfaces while keeping semantic panels readable without transparency
- Extended the validator to cover seven interactive Looks, forty-two interactive renderer exports, seven interactive stylesheets, and shared state hooks
- Added `LOOK-8-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.6.md`
- Set Look #9 — Retro Digital as the final Routine Completion implementation
- Kept lower-end Ambient Glass paint and compositing measurements explicitly pending
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.5 — 2026-08-01

### Look #2 — Warm Editorial Routine Completion Loop

- Reused the shared deterministic Routine Completion state engine
- Added Warm Editorial Today / Needs Attention as a quiet daily page with one featured entry
- Added interactive Area, Section, and Chore routes
- Replaced static completion placeholders with separate Complete and detail controls
- Added contextual Chore facts and a restrained completed-entry state with immediate Reopen
- Preserved deterministic Light, Moderate, and Deep recurrence advancement
- Preserved derived attention-count and All Clear updates
- Preserved browser-history-compatible route state
- Preserved semantic completion state while switching among Looks #2 through #7
- Added `look2-interactive.css` with narrow-screen, Large Text, focus, forced-colors, and reduced-motion handling
- Extended the validator to cover six interactive Looks, thirty-six interactive renderer exports, six interactive stylesheets, and shared state hooks
- Added `LOOK-2-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.5.md`
- Set Look #8 — Ambient Glass as the next interactive implementation
- Documented that direct cloning and exact-checkout browser execution remain DNS-blocked
- Kept Look #1, `main`, production storage, and backend behavior unchanged

## 0.9.4 — 2026-08-01

### Look #6 — Tactile Household Routine Completion Loop

- Added Today work board, Area service cards, Section drawers, Chore job cards, completion slips, and Reopen
- Added `look6-interactive.css`
- Expanded shared state and validation to five interactive Looks
- Added `LOOK-6-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.4.md`

## 0.9.3 — 2026-08-01

### Look #7 — Bold Utility Routine Completion Loop

- Added direct Today priority, explicit queue counts, thick-rule navigation, `DONE` state, and Undo
- Added `look7-interactive.css`
- Expanded shared state and validation to four interactive Looks
- Added `LOOK-7-INTERACTIVE.md` and `CHECKLIST-PROGRESS-0.9.3.md`

## 0.9.2 — 2026-08-01

### Look #5 — Playful Modular Routine Completion Loop

- Added friendly Today priority, modular navigation, positive reversible completion feedback, and `look5-interactive.css`
- Expanded shared state and validation to three interactive Looks

## 0.9.1 — 2026-08-01

### Look #3 — Precision Minimal Routine Completion Loop

- Added compact Today, Area, Section, and Chore interaction with explicit metrics
- Corrected `nextRoutine` so completed routines are deprioritized
- Added `look3-interactive.css`

## 0.9.0 — 2026-08-01

### Look #4 — Zen Focus Routine Completion Loop

- Established the shared deterministic Routine Completion behavior contract
- Added Today, Area, Section, Chore, completion, recurrence advancement, attention updates, Undo, and `interactive-state.js`
- Added `look4-interactive.css`

## 0.8.7 — 2026-08-01

- Recorded Option A and the delegated order: Looks #4, #3, #5, #7, #6, #2, #8, and #9
- Set routine `go` messages to continue automatically through the sequence

## 0.8.6 — 2026-08-01

- Added the interactive-expansion strategy record and vertical-slice candidates

## 0.8.5 — 2026-08-01

- Recorded browser presentation evidence for Looks #5, #7, #8, and #9
- Added contact sheets and narrative/machine-readable evidence records

## 0.8.0–0.8.4 — 2026-08-01

- Completed the full active gallery for Looks #2 through #9
- Completed dedicated code-level quality passes for Looks #5, #7, #8, and #9

## 0.1.0–0.7.2 — 2026-08-01

- Created the isolated Design Lab branch and shared comparison foundation
- Added Looks #2, #3, #4, and #6 with quality passes
- Added review tooling, Look #1 mapping, browser evidence, and shared interaction fixes