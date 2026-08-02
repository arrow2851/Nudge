# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.8.2`  
**Purpose:** Maintain a complete gallery of genuinely different visual systems for the same Nudge product, then test pure directions and controlled synthesis without forcing premature elimination.

This file is the source of truth for scope, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or verified with the stated evidence
- `[~]` Implemented but awaiting dedicated quality or real-device evidence
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

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

The user has already approved promotion of Looks #5, #7, #8, and #9 and has removed the prior mandatory finalist-selection gate.

---

# 1. Safety and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged under `mockups/prototype/`
- [x] Keep all experimental files under `mockups/design-lab/`
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

- [x] Areas, Area detail, and Intervention implemented
- [x] Seven scenarios supported
- [x] Dedicated code-level quality pass completed
- [x] Included in 0.7.2 browser evidence

## Look #3 — Precision Minimal

- [x] Areas, Area detail, and Intervention implemented
- [x] Seven scenarios supported
- [x] Dedicated code-level quality pass completed
- [x] Included in 0.7.2 browser evidence

## Look #4 — Zen Focus

- [x] Areas, Area detail, and Intervention implemented
- [x] Seven scenarios supported
- [x] Dedicated code-level quality pass completed
- [x] Included in 0.7.2 browser evidence

## Look #5 — Playful Modular

- [x] Direction defined
- [x] Areas implemented
- [x] Area detail implemented
- [x] Intervention implemented
- [x] Seven scenarios supported
- [x] Initial narrow-screen, Large Text, long-content, reduced-motion, and forced-colors foundations
- [x] Dedicated responsive, contrast, density, semantics, and blocking-quality pass
- [x] Dedicated quality stylesheet and evidence record
- [ ] Browser and device evidence

## Look #6 — Tactile Household

- [x] Areas, Area detail, and Intervention implemented
- [x] Seven scenarios supported
- [x] Dedicated code-level quality pass completed
- [x] Included in 0.7.2 browser evidence

## Look #7 — Bold Utility

- [x] Direction defined
- [x] Areas implemented
- [x] Area detail implemented
- [x] Intervention implemented
- [x] Seven scenarios supported
- [x] Initial narrow-screen, Large Text, long-content, reduced-motion, and forced-colors foundations
- [x] Dedicated responsive, contrast, density, tone, semantics, and blocking-quality pass
- [x] Dedicated quality stylesheet and evidence record
- [ ] Browser and device evidence

## Look #8 — Ambient Glass

- [x] Direction defined
- [x] Areas implemented
- [x] Area detail implemented
- [x] Intervention implemented
- [x] Seven scenarios supported
- [x] Initial narrow-screen, Large Text, long-content, reduced-motion, and forced-colors foundations
- [ ] Dedicated responsive, contrast, performance-risk, semantics, and blocking-quality pass
- [ ] Browser and device evidence

## Look #9 — Retro Digital

- [x] Direction defined
- [x] Areas implemented
- [x] Area detail implemented
- [x] Intervention implemented
- [x] Seven scenarios supported
- [x] Initial narrow-screen, Large Text, long-content, reduced-motion, and forced-colors foundations
- [ ] Dedicated responsive, small-text, contrast, semantics, and blocking-quality pass
- [ ] Browser and device evidence

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
- [x] Version consistency checks
- [x] CSS block-balance checks
- [x] Route matrix expanded from 84 to 168 active-Look combinations
- [x] New renderer files passed local `node --check`
- [x] Expanded gallery and Look-specific quality styles passed local brace-balance checking
- [ ] Execute updated validator in a complete checkout

---

# 6. Evidence

## Completed for Looks #1, #2, #3, #4, and #6 in version 0.7.2

- [x] Direct-route matrix
- [x] Canonical viewport checks
- [x] Stress-state routes
- [x] Long-content and Large-Text action reachability
- [x] Keyboard focus and Enter activation
- [x] Automated accessibility-tree inspection
- [x] Forced-colors and reduced-motion emulation
- [x] Canonical labelled captures

## Still required

- [ ] Repeat browser evidence for Looks #5, #7, #8, and #9
- [ ] Physical Android viewport checks
- [ ] Actual screen-reader smoke tests
- [ ] Comparative contact sheets for all nine directions including Look #1

---

# 7. Interactive expansion

The old requirement to select two or three finalists before interactive work is removed.

Future interactive work may proceed as a pure-Look vertical slice, multiple smaller feature-specific Look experiments, or a controlled synthesis vertical slice.

Each interactive slice must preserve the same product behavior and support:

- [ ] Today → Areas → Area → Section → Chore detail
- [ ] Add and complete chores
- [ ] Light, Moderate, and Deep recurrence
- [ ] Task add, edit, complete, reopen, reorder, and indent
- [ ] Reusable Lists and suggestions
- [ ] Intervention Start, alternative, and Not Now actions
- [ ] Empty, error, and recurring states

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

---

# 9. Current next actions

- [ ] Complete Look #8 quality pass
- [ ] Complete Look #9 quality pass
- [ ] Execute updated 168-route validation and browser evidence
- [ ] Prepare full-gallery contact sheets
- [ ] Decide later whether interactive expansion uses pure Looks, feature-specific variants, or controlled synthesis
