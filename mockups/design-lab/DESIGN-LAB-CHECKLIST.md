# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.8.6`  
**Purpose:** Maintain a complete gallery of genuinely different visual systems for the same Nudge product, then test pure directions and controlled synthesis without forcing premature elimination.

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

A hard stop is required before:

- Changing the three shared comparison screens
- Changing shared scenario meaning or comparison fairness
- Adding product functionality beyond the agreed comparison scope
- Materially changing branch, routing, storage, architecture, or deployment
- Editing the protected Look #1 prototype
- Merging into `main`
- Promoting dark variants into separate formal directions
- Allowing unrestricted style mixing within a screen
- Beginning interactive vertical-slice implementation before the prepared strategy is approved

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

The user has approved Looks #5, #7, #8, and #9 and removed the former mandatory finalist-selection gate.

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
- [x] Separate feature experiments may use different Looks
- [x] Controlled synthesis is allowed
- [x] Controlled synthesis requires one dominant system
- [x] Every borrowed component must be documented
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

The former requirement to select two or three finalists before interactive work is removed.

## Planning completed

- [x] Prepare the interactive-expansion decision record
- [x] Define pure-Look, feature-specific, shared-core multi-Look, and fallback family strategies
- [x] Define candidate vertical slices
- [x] Recommend the Routine completion loop first
- [x] Recommend one shared semantic behavior core with eight Design Lab visual adapters
- [x] Recommend keeping Look switching inside the Design Lab only
- [x] Recommend isolated deterministic prototype state
- [x] Define semantic and Look-owned presentation boundaries
- [x] Define cross-Look scripted acceptance criteria
- [x] Define explicit first-slice exclusions

## Decision required

- [!] Approve the recommended four-part package or select an explicit alternative

Recommended package:

1. Shared behavior core with eight Design Lab visual adapters.
2. Routine completion loop first.
3. Look switching remains a Design Lab review control only.
4. Prototype state remains isolated and deterministic.

## Vertical-slice implementation remains blocked

- [ ] Today / Needs Attention → Areas → Area → Section → Chore detail
- [ ] Complete, advance recurrence, undo, and reopen
- [ ] Preserve semantic state while switching Looks
- [ ] Add Normal Day, Heavy Backlog, All Clear, New Area, Long Content, and Large Text states
- [ ] Add browser-history and Reset Review State behavior
- [ ] Run the scripted path across all eight active Looks

## Later slices

- [ ] Task add, edit, complete, reopen, reorder, main-task, and subtask flow
- [ ] Intervention Start, alternative, Not Now, focused completion, and return flow
- [ ] Reusable Lists, suggestions, check, reset, and reopen flow

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

---

# 9. Current next actions

- [!] Review and approve the interactive-expansion strategy
- [ ] Execute updated validation in an exact complete checkout when available
- [ ] Perform physical Android and actual screen-reader smoke tests when available
- [ ] Begin the approved vertical slice only after the hard stop is resolved
