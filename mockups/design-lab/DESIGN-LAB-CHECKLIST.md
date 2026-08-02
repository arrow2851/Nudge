# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.8.7`  
**Purpose:** Maintain a complete gallery of genuinely different visual systems for the same Nudge product, then test pure directions without forcing premature elimination.

This file is the source of truth for scope, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or verified with the stated evidence
- `[~]` Implemented but awaiting real-device or assistive-technology evidence
- `[ ]` Not started
- `[!]` Decision required
- `[d]` Deferred

---

# 0. Operating agreement

When the user says **go**, continue to the next unchecked milestone without routine clarification.

The user delegated the first Look and the remaining Look order. Do not ask for another visual-selection decision during the recorded sequence.

A hard stop is required before:

- Changing the agreed Routine Completion Loop or later feature order
- Changing shared scenario meaning or comparison fairness
- Adding product functionality beyond the agreed slice
- Materially changing routing, storage, architecture, or deployment
- Editing the protected Look #1 prototype
- Introducing product-facing themes
- Merging into `main`
- Promoting dark variants into separate formal directions
- Allowing unrestricted style mixing within a screen

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

---

# 1. Safety and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged under `mockups/prototype/`
- [x] Keep experimental files under `mockups/design-lab/`
- [x] Isolate Design Lab query and session state
- [x] Keep visible experimental-build labels
- [x] Open a draft PR for centralized review history
- [ ] Do not merge before migration boundaries are explicitly reviewed

---

# 2. Shared comparison foundation

- [x] Shared shell and desktop/mobile review controls
- [x] Immutable fixture
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser Back/Forward and Reset Review State
- [x] Browser-native ES modules and per-Look renderers
- [x] Separate Look-specific styles
- [x] Labelled and phone-only capture modes
- [x] Validation harness
- [x] Look #1 comparison reference
- [x] Look #1 reference version sourced from shared configuration

## Shared screens

- [x] Areas overview
- [x] Representative Area detail
- [x] Intervention

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
- [x] Every Look exposes equivalent actions
- [x] Urgency meaning remains equivalent
- [x] No Look receives easier content or extra functionality
- [x] Look-specific wording may vary without changing meaning

---

# 3. Complete visual gallery

## Look #1 — Soft Practical Utility baseline

- [x] Protected production-reference role
- [x] Areas reference
- [x] Area-detail reference
- [x] Clearly labeled comparison-only Intervention extrapolation
- [~] Physical-device and actual screen-reader evidence pending

## Look #2 — Warm Editorial

- [x] Three shared screens and seven scenarios
- [x] Dedicated code-level quality pass
- [x] Included in 0.7.2 browser evidence

## Look #3 — Precision Minimal

- [x] Three shared screens and seven scenarios
- [x] Dedicated code-level quality pass
- [x] Included in 0.7.2 browser evidence

## Look #4 — Zen Focus

- [x] Three shared screens and seven scenarios
- [x] Dedicated code-level quality pass
- [x] Included in 0.7.2 browser evidence

## Look #5 — Playful Modular

- [x] Three shared screens and seven scenarios
- [x] Dedicated responsive, contrast, density, semantics, Large Text, and forced-colors quality pass
- [x] Dedicated quality stylesheet and evidence record
- [x] Included in 0.8.4 browser presentation evidence
- [~] Physical-device and actual screen-reader evidence pending

## Look #6 — Tactile Household

- [x] Three shared screens and seven scenarios
- [x] Dedicated code-level quality pass
- [x] Included in 0.7.2 browser evidence

## Look #7 — Bold Utility

- [x] Three shared screens and seven scenarios
- [x] Dedicated responsive, contrast, density, tone, semantics, Large Text, and forced-colors quality pass
- [x] Dedicated quality stylesheet and evidence record
- [x] Included in 0.8.4 browser presentation evidence
- [~] Physical-device and actual screen-reader evidence pending

## Look #8 — Ambient Glass

- [x] Three shared screens and seven scenarios
- [x] Dedicated responsive, contrast, transparency, fallback, performance-risk, semantics, and forced-colors quality pass
- [x] Dedicated quality stylesheet and evidence record
- [x] Included in 0.8.4 browser presentation evidence
- [~] Physical-device, actual screen-reader, and lower-end hardware paint evidence pending

## Look #9 — Retro Digital

- [x] Three shared screens and seven scenarios
- [x] Dedicated responsive, microtext, contrast, meter, semantics, Large Text, and forced-colors quality pass
- [x] Dedicated quality stylesheet and evidence record
- [x] Included in 0.8.4 browser presentation evidence
- [~] Physical-device and actual screen-reader evidence pending

---

# 4. Gallery policy

- [x] No direction must be rejected merely because another scores higher overall
- [x] Pure-Look prototypes remain allowed
- [x] Option A selected: one pure-Look vertical slice at a time
- [x] All other Looks remain preserved while one Look is implemented
- [x] Look order is a learning sequence, not a ranking
- [x] Look switching remains Design Lab-only
- [x] Unrestricted mixing within a screen remains prohibited
- [x] Dark variants remain deferred variants, not numbered Looks

---

# 5. Validation

- [x] Required-file checks
- [x] Relative-import checks
- [x] Shared fixture checks
- [x] Renderer export and routing checks
- [x] Version consistency checks encoded in the validator
- [x] Stylesheet load-order checks
- [x] CSS block-balance checks
- [x] Route matrix expanded to 168 active-Look combinations
- [x] Validator includes Look #5, #7, #8, and #9 quality layers
- [ ] Execute the updated validator in an exact complete checkout

---

# 6. Evidence

## Completed in version 0.7.2 for Looks #1, #2, #3, #4, and #6

- [x] Direct-route matrix
- [x] Canonical viewport checks
- [x] Stress-state routes
- [x] Long-content and Large-Text action reachability
- [x] Keyboard focus and Enter activation
- [x] Automated accessibility-tree inspection
- [x] Forced-colors and reduced-motion emulation
- [x] Canonical labelled captures

## Completed in the 0.8.4 evidence run for Looks #5, #7, #8, and #9

- [x] 84 direct routes across four Looks, seven scenarios, and three screens
- [x] 72 canonical viewport checks across six viewport sizes
- [x] 28 stress-scenario checks
- [x] Eight Long Content and Large Text action-reachability checks
- [x] Forced-colors and reduced-motion emulation
- [x] Keyboard focus visibility
- [x] No horizontal-overflow failures
- [x] No unnamed visible-button failures
- [x] Minimum tested in-preview control size of 48 × 48 px
- [x] Three nine-direction comparison contact sheets
- [x] Narrative and machine-readable repository evidence records

## Still required

- [ ] Exact complete-checkout validator execution
- [ ] Physical Android viewport checks
- [ ] Actual screen-reader smoke tests
- [ ] Ambient Glass lower-end hardware paint/compositing measurements
- [ ] Single-version browser rerun for every Look from one identical build

---

# 7. Interactive expansion

## Decisions completed

- [x] Select Option A — one pure-Look vertical slice at a time
- [x] Select Routine Completion Loop as the first flow
- [x] Delegate first Look and complete remaining order
- [x] Select Look #4 — Zen Focus first
- [x] Keep Look switching Design Lab-only
- [x] Keep prototype state isolated and deterministic
- [x] Keep Look #1 protected and outside the implementation sequence

## Pure-Look implementation order

1. [ ] Look #4 — Zen Focus
2. [ ] Look #3 — Precision Minimal
3. [ ] Look #5 — Playful Modular
4. [ ] Look #7 — Bold Utility
5. [ ] Look #6 — Tactile Household
6. [ ] Look #2 — Warm Editorial
7. [ ] Look #8 — Ambient Glass
8. [ ] Look #9 — Retro Digital

See `PURE-LOOK-IMPLEMENTATION-ORDER.md` for rationale and acceptance gates.

## Routine Completion Loop required in each Look

- [ ] Today / Needs Attention entry
- [ ] Areas → Area → Section → Chore detail navigation
- [ ] Complete chore
- [ ] Advance deterministic Light, Moderate, or Deep recurrence
- [ ] Update attention counts and all-clear state
- [ ] Undo or reopen
- [ ] Preserve valid state through browser Back and Forward
- [ ] Support Normal Day, Heavy Backlog, All Clear, New Area, Long Content, and Large Text
- [ ] Keep completion and undo keyboard reachable
- [ ] Keep primary actions reachable on short screens

## Later feature order after all eight Looks receive the Routine Completion Loop

1. [ ] Task hierarchy loop
2. [ ] Intervention-to-action loop
3. [ ] Reusable Lists loop

Use the same Look order for each later feature unless a documented technical dependency requires a change.

---

# 8. Milestone log

- [x] `0.1.0–0.2.1` — Branch, shared foundation, and Warm Editorial
- [x] `0.3.0` — Modular renderer architecture
- [x] `0.4.0–0.4.1` — Precision Minimal implementation and quality
- [x] `0.5.0–0.5.1` — Zen Focus implementation and quality
- [x] `0.6.0–0.6.1` — Tactile Household implementation and quality
- [x] `0.7.0–0.7.2` — Review tooling, Look #1 mapping, browser evidence, and shared interaction fix
- [x] `0.8.0` — Complete gallery with Looks #5, #7, #8, and #9
- [x] `0.8.1` — Look #5 Playful Modular quality pass
- [x] `0.8.2` — Look #7 Bold Utility quality pass
- [x] `0.8.3` — Look #8 Ambient Glass quality pass
- [x] `0.8.4` — Look #9 Retro Digital quality pass and completion of all per-Look code-level quality gates
- [x] `0.8.5` — Full-gallery browser evidence record, contact sheets, and repository status update
- [x] `0.8.6` — Interactive-expansion decision record and vertical-slice candidates
- [x] `0.8.7` — Option A implementation sequence delegated and locked

---

# 9. Current next actions

- [ ] Build the isolated deterministic state foundation for Look #4
- [ ] Add Today / Needs Attention and the Look #4 route chain
- [ ] Add Chore detail, completion, recurrence advance, and undo or reopen
- [ ] Validate Look #4 under Normal Day, Heavy Backlog, All Clear, New Area, Long Content, and Large Text
- [ ] Execute updated validation in an exact complete checkout when available
- [ ] Perform physical Android and actual screen-reader smoke tests when available
