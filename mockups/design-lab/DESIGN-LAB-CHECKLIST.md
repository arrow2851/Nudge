# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.9.7`  
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
- [x] Isolate Design Lab query and session state
- [x] Keep visible experimental-build labels
- [x] Keep draft PR #1 as the centralized review record
- [ ] Do not merge before migration boundaries are explicitly reviewed

---

# 2. Shared gallery foundation

- [x] Shared shell and review controls
- [x] Immutable fixture with seven scenarios
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

- [x] Every Look consumes the same fixture
- [x] Equivalent actions within each implemented slice
- [x] Equivalent urgency meaning
- [x] No Look receives easier content or extra functionality
- [x] Wording may vary without changing meaning

---

# 3. Gallery and interactive status

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

# 4. Shared interactive foundation

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

---

# 5. Validation and evidence

- [x] Required-file and relative-import checks encoded
- [x] Fixture and renderer-export checks encoded
- [x] Version and stylesheet-order checks encoded
- [x] CSS block-balance checks encoded
- [x] 168-route gallery matrix encoded
- [x] Interactive route contract encoded for Looks #2 through #9
- [x] Interactive stylesheets required for Looks #2 through #9
- [x] Forty-eight interactive renderer exports required
- [x] Shared completion, recurrence, Undo, and state hooks checked
- [x] Responsive, Large Text, Forced Colors, and Reduced Motion hooks encoded
- [x] Ambient Glass solid-fallback and Reduced Transparency hooks encoded
- [ ] Exact complete-checkout validator execution
- [ ] Exact complete-checkout interactive browser run
- [ ] Physical Android viewport checks
- [ ] Actual screen-reader smoke tests
- [ ] Ambient Glass lower-end hardware paint measurements
- [ ] Single-version browser rerun for every Look

---

# 6. Pure-Look implementation order

1. [x] Look #4 — Zen Focus
2. [x] Look #3 — Precision Minimal
3. [x] Look #5 — Playful Modular
4. [x] Look #7 — Bold Utility
5. [x] Look #6 — Tactile Household
6. [x] Look #2 — Warm Editorial
7. [x] Look #8 — Ambient Glass
8. [x] Look #9 — Retro Digital

See `PURE-LOOK-IMPLEMENTATION-ORDER.md` for rationale and acceptance gates.

## Routine Completion Loop progress

- [x] Today / Needs Attention — implemented in 8 of 8 Looks
- [x] Area → Section → Chore navigation — implemented in 8 of 8 Looks
- [x] Complete and advance recurrence — implemented in 8 of 8 Looks
- [x] Update attention counts and All Clear — implemented in 8 of 8 Looks
- [x] Undo or reopen — implemented in 8 of 8 Looks
- [x] Browser-history-compatible routes — implemented in 8 of 8 Looks
- [x] Shared scenarios and Large Text — implemented in 8 of 8 Looks
- [x] Keyboard-reachable completion and Undo — implemented in 8 of 8 Looks

## Later feature order

1. [ ] Task hierarchy loop
2. [ ] Intervention-to-action loop
3. [ ] Reusable Lists loop

Use the same Look order unless a documented technical dependency requires a change.

---

# 7. Milestone log

- [x] `0.1.0–0.8.7` — Gallery foundation, all Looks, quality passes, evidence, and delegated pure-Look sequence
- [x] `0.9.0` — Look #4 Zen Focus Routine Completion Loop
- [x] `0.9.1` — Look #3 Precision Minimal Routine Completion Loop
- [x] `0.9.2` — Look #5 Playful Modular Routine Completion Loop
- [x] `0.9.3` — Look #7 Bold Utility Routine Completion Loop
- [x] `0.9.4` — Look #6 Tactile Household Routine Completion Loop
- [x] `0.9.5` — Look #2 Warm Editorial Routine Completion Loop
- [x] `0.9.6` — Look #8 Ambient Glass Routine Completion Loop
- [x] `0.9.7` — Look #9 Retro Digital and completion of the eight-Look Routine Completion sequence

---

# 8. Current next actions

- [ ] Begin Look #4 Task hierarchy loop
- [ ] Implement simple checklist creation and editing
- [ ] Implement reorder handle and completion control separation
- [ ] Implement main task and subtask behavior
- [ ] Implement indent and unindent behavior
- [ ] Preserve current Routine Completion routes and state
- [ ] Keep exact-checkout, Android, and screen-reader evidence pending until actually performed
