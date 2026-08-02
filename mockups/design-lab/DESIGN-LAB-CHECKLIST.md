# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.11.0`  
**Purpose:** Preserve the complete visual gallery while implementing equivalent pure-Look product slices in the delegated order.

## Status legend

- `[x]` Completed or verified with the stated evidence
- `[~]` Implemented but awaiting exact-checkout, device, or assistive-technology evidence
- `[ ]` Not started
- `[!]` Decision required
- `[d]` Deferred

---

# 0. Operating agreement

When the user says **go**, continue to the next unchecked milestone without routine clarification.

The user delegated the complete Look order. Use the same order for later feature loops unless a documented technical dependency requires a change.

A hard stop is required before changing the agreed feature scope, scenarios, routing/storage architecture, Look #1, product-facing themes, deployment, or merge status.

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

---

# 1. Safety and governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged under `mockups/prototype/`
- [x] Keep experimental files under `mockups/design-lab/`
- [x] Isolate Design Lab query, routine, task, and intervention state
- [x] Keep visible experimental-build labels
- [x] Keep draft PR #1 as the centralized review record
- [ ] Do not merge before migration boundaries are explicitly reviewed

---

# 2. Shared gallery foundation

- [x] Shared shell and review controls
- [x] Immutable routine fixture with seven scenarios
- [x] Deterministic task fixture with the same seven scenarios
- [x] Deterministic intervention fixture with the same seven scenarios
- [x] Query routing and browser history
- [x] Reset Review State
- [x] Per-Look renderers and styles
- [x] Labelled and phone-only capture modes
- [x] Validation harness
- [x] Look #1 protected comparison reference

## Shared scenarios

- [x] Normal Day
- [x] Heavy Backlog
- [x] New User
- [x] All Clear
- [x] Large Household
- [x] Long Content
- [x] Large Text
- [d] Dark Environment as a later variant study

## Fairness rules

- [x] Every Look consumes equivalent fixture meaning
- [x] Equivalent actions within each implemented slice
- [x] Equivalent urgency meaning
- [x] No Look receives easier content or extra functionality
- [x] Wording may vary without changing meaning

---

# 3. Gallery and Routine Completion status

## Look #1 — Soft Practical Utility

- [x] Protected baseline reference
- [~] Physical-device and actual screen-reader evidence pending

## Looks #2 through #9

Each active Look has:

- [x] Gallery screens and all seven scenarios
- [x] Dedicated quality pass
- [x] Today / Needs Attention
- [x] Area → Section → Chore navigation
- [x] Completion, recurrence advancement, attention updates, and Undo
- [x] Dedicated interactive stylesheet and implementation record
- [x] Shared semantic completion state
- [~] Exact-checkout browser, physical-device, and screen-reader evidence pending

Additional Look #8 boundary:

- [x] Reduced-transparency and no-backdrop-filter solid fallbacks
- [~] Lower-end paint/compositing evidence pending

---

# 4. Shared Routine Completion foundation

- [x] Stable routine identifiers
- [x] Light, Moderate, and Deep tier metadata
- [x] Deterministic next-cycle labels
- [x] Scenario-isolated session completion store
- [x] Complete and reopen actions
- [x] Previous-status restoration
- [x] Today, Area, Section, and Chore routes
- [x] Browser-history-compatible serialization
- [x] Reset clears route and completion state
- [x] State persists while switching among all active Looks
- [x] Completed routines are deprioritized by `nextRoutine`
- [x] Direct Chore routes infer Section when omitted
- [x] Action handling occurs before generic Chore navigation
- [x] Mixed Today queues preserve each routine's Area identifier

## Routine Completion Loop progress

1. [x] Look #4 — Zen Focus
2. [x] Look #3 — Precision Minimal
3. [x] Look #5 — Playful Modular
4. [x] Look #7 — Bold Utility
5. [x] Look #6 — Tactile Household
6. [x] Look #2 — Warm Editorial
7. [x] Look #8 — Ambient Glass
8. [x] Look #9 — Retro Digital

---

# 5. Task hierarchy foundation

- [x] Tasks route and bottom-navigation entry
- [x] Separate scenario-isolated task storage namespace
- [x] Top and bottom empty-task creation
- [x] Inline editable title
- [x] Separate drag handle and completion control
- [x] Optional shorthand time indicator
- [x] Settings disclosure
- [x] Main-task toggle
- [x] Separate subtask plus control
- [x] One-level main-task and subtask model
- [x] Derived subtask progress
- [x] Main and subtask completion propagation
- [x] Turning off main-task mode releases subtasks
- [x] Pointer drag reorder hooks
- [x] Explicit Move Up and Move Down controls
- [x] Explicit Indent and Unindent controls
- [x] Completed items grouped at the bottom
- [x] Hide Completed and Show Completed
- [x] Reset clears task state
- [x] Task state persists while switching among all eight active Looks
- [d] Production mobile swipe implementation
- [d] Nested subtasks beyond one level
- [d] Production persistence, sync, collaboration, and notifications
- [d] Deletion workflow

## Task hierarchy loop progress

1. [x] Look #4 — Zen Focus
2. [x] Look #3 — Precision Minimal
3. [x] Look #5 — Playful Modular
4. [x] Look #7 — Bold Utility
5. [x] Look #6 — Tactile Household
6. [x] Look #2 — Warm Editorial
7. [x] Look #8 — Ambient Glass
8. [x] Look #9 — Retro Digital

---

# 6. Shared Intervention-to-action foundation

- [x] Separate scenario-isolated intervention storage namespace
- [x] Deterministic suggestion list beginning with the scenario fixture
- [x] Additional suggestions derived from available routines
- [x] Setup-safe alternatives for scenarios without Areas
- [x] Prompt phase
- [x] Active phase
- [x] Completed phase
- [x] Dismissed phase
- [x] Start creates a concrete action state
- [x] Complete and reopen actions
- [x] Undo Start
- [x] Different suggestion cycles deterministically
- [x] Not Now changes no routine or task state
- [x] Dismissed state can resume the suggestion
- [x] Reset Review State clears intervention state
- [x] Raw scenario data remains the source for stable cycling
- [x] Existing Routine Completion and Task Hierarchy state remain intact
- [d] Real app-usage detection
- [d] App blocking or redirect enforcement
- [d] Production timers, reminders, notifications, accounts, or backend integration

---

# 7. Validation and evidence

- [x] Required-file and relative-import checks encoded
- [x] Fixture and renderer-export checks encoded
- [x] Version and stylesheet-order checks encoded
- [x] CSS block-balance checks encoded
- [x] 168-route gallery matrix encoded
- [x] Interactive route contract encoded for Looks #2 through #9
- [x] Forty-eight Routine Completion renderer exports required
- [x] Shared completion, recurrence, Undo, and state hooks checked
- [x] Shared Task hierarchy state and action contract checked
- [x] Eight task renderers and eight dedicated task stylesheets required
- [x] Shared Intervention phase and deterministic-suggestion contract checked
- [x] Look #4 Start, Next, Dismiss, Resume, Complete, Reopen, Undo, and Return actions checked
- [x] Intervention reset integration checked
- [x] Look #4 dedicated intervention stylesheet required
- [x] Responsive, short-screen, Large Text, Forced Colors, Increased Contrast, and Reduced Motion hooks encoded
- [x] Ambient Glass solid-fallback and Reduced Transparency hooks encoded
- [x] Retro Digital task-language checks reject error, fault, and failure terms
- [ ] Exact complete-checkout validator execution
- [ ] Exact complete-checkout interactive browser run
- [ ] Physical Android viewport checks
- [ ] Physical Android drag/hold and swipe checks
- [ ] Actual screen-reader smoke tests
- [ ] Ambient Glass lower-end hardware paint measurements
- [ ] Single-version browser rerun for every Look

---

# 8. Pure-Look implementation order

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

See `PURE-LOOK-IMPLEMENTATION-ORDER.md` for rationale and acceptance gates.

---

# 9. Intervention-to-action sequence

1. [x] Look #4 — Zen Focus
2. [ ] Look #3 — Precision Minimal — **next**
3. [ ] Look #5 — Playful Modular
4. [ ] Look #7 — Bold Utility
5. [ ] Look #6 — Tactile Household
6. [ ] Look #2 — Warm Editorial
7. [ ] Look #8 — Ambient Glass
8. [ ] Look #9 — Retro Digital

Shared behaviors currently implemented in 1 of 8 Looks:

- [~] Optional prompt and deterministic suggestion
- [~] Start to concrete action state
- [~] Completion and reopen
- [~] Undo Start
- [~] Different suggestion
- [~] Guilt-free Not Now and resume
- [~] Scenario-isolated state
- [~] Existing routine and task state preserved

Reusable Lists begins only after Intervention-to-action is complete across all eight Looks.

---

# 10. Milestone log

- [x] `0.1.0–0.8.7` — Gallery foundation, all Looks, quality passes, evidence, and delegated pure-Look sequence
- [x] `0.9.0–0.9.7` — Routine Completion Loop implemented across all eight active Looks
- [x] `0.10.0–0.10.7` — Task hierarchy implemented across all eight active Looks
- [x] `0.11.0` — Look #4 Zen Focus Intervention-to-action loop

---

# 11. Current next actions

- [ ] Implement the Intervention-to-action contract in Look #3 — Precision Minimal
- [ ] Preserve existing intervention state while switching between implemented Intervention Looks
- [ ] Preserve existing Routine Completion and Task Hierarchy state
- [ ] Keep suggestions optional, reversible, and non-guilt-based
- [ ] Extend validator coverage through Look #3 Intervention-to-action
- [ ] Keep exact-checkout, Android, screen-reader, single-version regression, and Ambient Glass paint evidence pending until actually performed
