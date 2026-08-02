# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.11.4`  
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
- [x] Seven shared scenarios
- [x] Deterministic routine, task, and intervention fixtures
- [x] Query routing and browser history
- [x] Reset Review State
- [x] Pure-Look renderers and styles
- [x] Labelled and phone-only capture modes
- [x] Validation harness
- [x] Look #1 protected comparison reference
- [d] Dark Environment as a later variant study

---

# 3. Routine Completion

- [x] Shared deterministic completion state
- [x] Today, Area, Section, and Chore routes
- [x] Completion, recurrence advancement, attention updates, and Undo
- [x] Cross-Look state preservation
- [x] Complete in Looks #2 through #9
- [~] Exact browser, physical-device, and screen-reader evidence pending

---

# 4. Task hierarchy

- [x] Separate scenario-isolated task state
- [x] Add and inline edit
- [x] Complete and reopen
- [x] One-level main task and subtasks
- [x] Progress and completion propagation
- [x] Subtask release
- [x] Pointer drag and explicit movement controls
- [x] Indent and unindent
- [x] Completed-item grouping and hide/show
- [x] Cross-Look state preservation
- [x] Complete in Looks #2 through #9
- [d] Production swipe gestures, deeper nesting, deletion, sync, collaboration, and notifications

---

# 5. Shared Intervention-to-action foundation

- [x] Separate scenario-isolated intervention storage namespace
- [x] Deterministic suggestion list beginning with the scenario fixture
- [x] Routine-derived alternatives
- [x] Setup-safe alternatives for scenarios without Areas
- [x] Prompt, Active, Completed, and Dismissed phases
- [x] Start creates a concrete prototype action state
- [x] Complete and reopen
- [x] Undo Start
- [x] Next suggestion cycles deterministically
- [x] Not Now changes no routine or task state
- [x] Dismissed state can resume
- [x] Reset Review State clears intervention state
- [x] Raw scenario data remains the source for stable cycling
- [x] Routine and task state remain intact
- [d] Real app-usage detection, blocking, redirect enforcement, timers, notifications, accounts, or backend integration

---

# 6. Validation and evidence

- [x] Required-file and relative-import checks encoded
- [x] Fixture, renderer-export, version, stylesheet-order, and CSS-balance checks encoded
- [x] 168-route gallery matrix encoded
- [x] Forty-eight Routine Completion renderer exports required
- [x] Eight Task hierarchy renderers and stylesheets required
- [x] Shared Intervention phase and deterministic-suggestion contract checked
- [x] Looks #3, #4, #5, #6, and #7 intervention renderer and stylesheet contracts checked
- [x] Start, Next, Dismiss, Resume, Complete, Reopen, Undo, Return, and Reset hooks checked
- [x] Playful Modular non-scoring language checked
- [x] Bold Utility pressure-language exclusions checked
- [x] Tactile Household defect and repair-language exclusions checked
- [x] Responsive, short-screen, Large Text, Forced Colors, Increased Contrast, and Reduced Motion hooks encoded
- [x] Ambient Glass solid fallbacks and Retro Digital language checks encoded
- [ ] Exact complete-checkout validator execution
- [ ] Exact complete-checkout interactive browser run
- [ ] Physical Android viewport and gesture checks
- [ ] Actual screen-reader smoke tests
- [ ] Ambient Glass lower-end hardware paint measurements
- [ ] Single-version browser rerun for every Look

---

# 7. Pure-Look implementation order

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

---

# 8. Intervention-to-action sequence

1. [x] Look #4 — Zen Focus
2. [x] Look #3 — Precision Minimal
3. [x] Look #5 — Playful Modular
4. [x] Look #7 — Bold Utility
5. [x] Look #6 — Tactile Household
6. [ ] Look #2 — Warm Editorial — **next**
7. [ ] Look #8 — Ambient Glass
8. [ ] Look #9 — Retro Digital

Shared behaviors currently implemented in 5 of 8 Looks:

- [~] Optional prompt and deterministic suggestion
- [~] Start to concrete action state
- [~] Completion and reopen
- [~] Undo Start
- [~] Next suggestion
- [~] Optional Not Now and resume
- [~] Scenario-isolated state
- [~] Cross-Look state preservation
- [~] Existing routine and task state preserved
- [~] No scoring, compliance measurement, defect framing, or negative dismissal state

Reusable Lists begins only after Intervention-to-action is complete across all eight Looks.

---

# 9. Milestone log

- [x] `0.1.0–0.8.7` — Gallery foundation and pure-Look quality sequence
- [x] `0.9.0–0.9.7` — Routine Completion across all active Looks
- [x] `0.10.0–0.10.7` — Task hierarchy across all active Looks
- [x] `0.11.0` — Look #4 Zen Focus Intervention-to-action
- [x] `0.11.1` — Look #3 Precision Minimal Intervention-to-action
- [x] `0.11.2` — Look #5 Playful Modular Intervention-to-action
- [x] `0.11.3` — Look #7 Bold Utility Intervention-to-action
- [x] `0.11.4` — Look #6 Tactile Household Intervention-to-action

---

# 10. Current next actions

- [ ] Implement Intervention-to-action in Look #2 — Warm Editorial
- [ ] Preserve shared intervention state across Looks #3, #4, #5, #6, and #7
- [ ] Preserve Routine Completion and Task hierarchy state
- [ ] Keep suggestions optional, reversible, and non-guilt-based
- [ ] Extend validator coverage through Look #2
- [ ] Keep exact-checkout, Android, screen-reader, single-version regression, and Ambient Glass paint evidence pending until actually performed
