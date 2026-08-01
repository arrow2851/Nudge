# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.7.1`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final direction.

This file is the source of truth for scope, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or code-level verified
- `[~]` Implemented but awaiting real-browser, device, assistive-technology, or comparative evidence
- `[ ]` Not started
- `[!]` Decision required
- `[d]` Deferred unless promoted through plan adjustment
- `[r]` Rejected or superseded, retained for history

---

# 0. Change-control agreement

A hard stop is required before changing:

- [ ] The shortlisted Looks or Look #1 baseline role
- [ ] The three shared Round 1 screens
- [ ] Shared scenario meaning or comparison fairness
- [ ] Core Nudge hierarchy or behavior
- [ ] Branch, routing, storage, or deployment architecture materially
- [ ] Scoring criteria after scoring begins
- [ ] Review gates or Round 2 participants
- [ ] Any merge into `main`
- [ ] Promotion of a deferred aesthetic

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

Minor bugs, accessibility fixes, copy changes, test infrastructure, capture tooling, baseline mapping, and visual refinements may proceed without a hard stop when scope and comparison meaning remain unchanged.

---

# 1. Safety and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged under `mockups/prototype/`
- [x] Keep all experimental and comparison-only files under `mockups/design-lab/`
- [x] Isolate Design Lab query and session state
- [x] Keep visible experimental-build labels
- [x] Verify the branch remains ahead of and not behind `main` throughout implementation
- [ ] Recheck divergence immediately before scoring
- [ ] Define how future Look #1 product changes are incorporated
- [ ] Add a branch-specific preview deployment without replacing production Pages
- [ ] Open a draft PR only when centralized review history is useful
- [ ] Do not merge before final selection and migration planning

---

# 2. Shared Design Lab foundation

- [x] Shared shell and desktop/mobile review controls
- [x] Immutable fixture and seven scenarios
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser Back/Forward implementation
- [x] Reset Review State and invalid-route fallback
- [x] Browser-native ES modules and per-Look renderers
- [x] Separate Look-specific stylesheets
- [x] Documentation, decisions, changelog, quality notes, and progress logs
- [x] Dependency-free validation harness
- [x] Labelled and phone-only capture modes
- [x] Shared Markdown scorecard and review protocol
- [ ] Add `screenshots/` only after real captures begin

## Comparison fairness

- [x] One shared fixture for all active Looks and the Look #1 reference
- [x] Same Areas, Area detail, and Intervention moments
- [x] Same seven scenarios and evidence order
- [x] Same Round 1 meaning and equivalent simulated actions
- [x] Presentation and tone may differ without changing meaning
- [x] Look #1 Intervention limitation remains explicitly labeled
- [~] Programmatic fairness checks implemented; complete-checkout execution pending

---

# 3. Shared Round 1 content

## Screens

- [x] Areas overview
- [x] Representative Area detail, normally Kitchen
- [x] Intervention
- [x] Prevent full-app expansion before finalist selection

## Scenarios

- [x] Normal Day
- [x] Heavy Backlog
- [x] New User
- [x] All Clear
- [x] Large Household
- [x] Long Content
- [x] Large Text
- [d] Dark Environment unless promoted through plan adjustment

## Fixture coverage

- [x] Overdue, due-today, upcoming, and as-needed content
- [x] Empty and all-clear states
- [x] Unconfigured Section
- [x] Home, Car, Work, and Personal content
- [x] Long Area, Section, routine, app, and Intervention labels
- [x] Dense household and backlog states

---

# 4. Look #1 — Soft Practical Utility baseline

- [x] Document visual principles and source-of-truth traits
- [x] Record expected strengths and risks
- [x] Map the shared fixture to an Areas overview reference
- [x] Map the shared fixture to a Kitchen Area detail reference
- [x] Add a clearly labeled comparison-only Intervention extrapolation
- [x] Keep the reference separate from the active Look selector
- [x] Reuse shared scenarios, Large Text, capture modes, and forced-colors foundations
- [x] Add baseline routes to the review protocol and scorecard
- [~] Code-level syntax and CSS checks complete; browser evidence pending
- [ ] Capture canonical and stress evidence
- [ ] Score Look #1 and explicitly account for the Intervention limitation

---

# 5. Look #2 — Warm Editorial

- [x] Direction, versatility, and anti-patterns documented
- [x] All three screens and seven scenarios implemented
- [x] Shared routes and simulated actions preserved
- [x] Responsive, Large Text, contrast, touch-target, focus, semantic, and reduced-motion pass
- [~] Actual-device, keyboard, screen-reader, and comparative evidence pending
- [ ] Capture evidence and complete scorecard fields
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

---

# 6. Look #3 — Precision Minimal

- [x] Direction, density, typography, Intervention tone, and anti-patterns documented
- [x] All three screens and seven scenarios implemented
- [x] Shared routes and simulated actions preserved
- [x] Narrow-screen, long-content, Large Text, contrast, semantics, forced-colors, and touch-target pass
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending
- [ ] Capture evidence and complete scorecard fields
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

---

# 7. Look #4 — Zen Focus

- [x] Calm progressive emphasis and anti-patterns documented
- [x] Complete information retained beneath the suggested start
- [x] All three screens and seven scenarios implemented
- [x] Narrow-screen, dense-row, Large Text, wrapping, contrast, semantics, forced-colors, and touch-target pass
- [x] All Clear avoids artificial urgency
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending
- [ ] Capture evidence and complete scorecard fields
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

---

# 8. Look #6 — Tactile Household

- [x] Practical tactile direction, versatility, and anti-patterns documented
- [x] All three screens and seven scenarios implemented
- [x] Responsive, overflow, contrast, Large Text, dense-row, semantics, focus, decorative-readability, and forced-colors pass
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending
- [ ] Capture evidence and complete scorecard fields
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

---

# 9. Static and route validation

- [x] Add `validate-design-lab.mjs` without external dependencies
- [x] Validate required files and relative imports
- [x] Validate linked stylesheets and HTML references
- [x] Validate renderer exports and active-Look routing
- [x] Validate fixture fields, statuses, counts, cloning, and fallbacks
- [x] Validate 84 active-Look route combinations
- [x] Validate history methods and isolated session storage
- [x] Validate Look #1 reference files, fixture import, screens, scenarios, and extrapolation label
- [x] Validate version consistency and CSS brace balance
- [x] Syntax-check the validator and new reference JavaScript locally
- [~] Execute the complete validator against a full checkout; cloning remains unavailable in this session

---

# 10. Browser, device, and accessibility evidence

## Viewports

- [ ] 360 × 800 narrow Android-like phone
- [ ] 390 × 844 canonical phone
- [ ] 412 × 915 large Android-like phone
- [ ] 390 × 700 short constrained phone
- [ ] 844 × 390 landscape smoke test
- [ ] 1440 × 900 desktop review panel

## Browser behavior

- [ ] Direct links load without console errors
- [ ] Back/Forward and in-app back behave correctly
- [ ] Reset Review State returns the default route
- [ ] Look and scenario switching preserve equivalent state
- [ ] Invalid routes fall back safely
- [ ] Simulated actions provide readable feedback
- [ ] Look #1 reference screen/scenario links and capture modes behave correctly

## Accessibility

- [x] Code-level focus, touch-target, contrast, textual-status, selected-state, Large Text, reduced-motion, and forced-colors foundations
- [ ] Keyboard-only walkthrough and tab-order verification
- [ ] Desktop and mobile screen-reader smoke tests
- [ ] Forced-colors visual inspection
- [ ] Reduced-motion browser inspection
- [ ] Intervention actions remain unambiguous in every direction

## Stress evidence

- [ ] Heavy Backlog
- [ ] New User
- [ ] All Clear
- [ ] Large Household
- [ ] Long Content
- [ ] Large Text

---

# 11. Review preparation and evidence capture

- [x] Define viewport, route, and screenshot rules
- [x] Add `capture=labelled` and `capture=phone`
- [x] Fix capture time at 9:41
- [x] Add automatic Look/screen/scenario/version labels
- [x] Define evidence filename convention
- [x] Add Look #1 baseline reference and routes
- [x] Add shared scorecard with rating anchors and qualitative fields
- [x] Keep scores separate from demo state
- [x] Document browser, keyboard, screen-reader, forced-colors, reduced-motion, and evidence-record procedures
- [ ] Capture Areas Normal Day for Looks #1, #2, #3, #4, and #6
- [ ] Capture Kitchen Heavy Backlog
- [ ] Capture Intervention Normal Day
- [ ] Capture concern-specific stress evidence
- [ ] Store approved captures under `screenshots/`
- [ ] Fill all scores, qualitative notes, rankings, and borrowable components

---

# 12. Round 1 selection gate — mandatory hard stop

Do not begin Round 2 until:

- [x] All four shortlisted Looks have equivalent screens and scenarios
- [x] Look #1 has equivalent comparison routes with its limitation documented
- [ ] Review evidence is sufficient
- [ ] Look #1 and all shortlisted Looks have completed scorecards
- [ ] Findings and borrowable components are summarized
- [ ] Approximately two or three finalists are selected
- [ ] Non-finalists are marked Hold, Reject, or Components only
- [ ] Focused finalist revisions are defined
- [ ] Synthesis is allowed, rejected, or deferred
- [ ] Checklist and decision log are updated

When this selection decision is required, use the one-line hard stop and wait for review.

---

# 13. Round 2 — Interactive vertical slices

Each selected finalist must support:

- [ ] Today → Areas → Kitchen → representative Section → Chore detail
- [ ] Graded completion and Light/Moderate/Deep selection
- [ ] Add a Chore
- [ ] Task add, edit, complete, reopen, reorder, and indent
- [ ] Reusable List add, edit, complete, reopen, reorder, indent, and suggestions
- [ ] Simulated Intervention: Start, choose another, and Not Now
- [ ] Same fixture, errors, empty states, recurrence, and product boundaries

---

# 14. Round 2 comparison and usability

- [ ] Side-by-side synchronized previews
- [ ] Look #1 versus finalist and finalist versus finalist
- [ ] Single-phone Look toggle and screenshot mode
- [ ] Complete the shared journey on an actual phone
- [ ] Test all scenarios and record timing/mis-taps
- [ ] Rescore finalists and compare initial versus repeated-use preference

---

# 15. Synthesis exploration

Only when evidence supports it:

- [ ] Decide whether a pure finalist is sufficient
- [ ] Identify a dominant system and transferable components
- [ ] Define coherent borrowed exceptions
- [ ] Build key synthesis screens before full expansion
- [ ] Compare synthesis with the strongest pure finalist
- [ ] Reject synthesis if identity or consistency weakens

Potential evidence-led combinations remain deferred: Editorial typography with Precision density, Zen Intervention with another organizer, and restrained Tactile controls inside another system.

---

# 16. Final selection and closeout

- [ ] Phone and accessibility evidence sufficient for selection
- [ ] Scores and qualitative notes complete
- [ ] Select one visual foundation or approved synthesis
- [ ] Decide whether Look #1 remains the production baseline until Android work
- [ ] Document selected, rejected, and borrowed directions
- [ ] Define merge boundaries and migration plan
- [ ] Preserve screenshots, scorecards, and decisions
- [ ] Mark rejected Looks without deleting history
- [ ] Confirm `main` remains stable
- [ ] Tag or preserve the final branch state

---

# 17. Milestone log

- [x] `0.1.0` — Branch, shell, shortlist, and Warm Editorial audition
- [x] `0.2.0–0.2.1` — Shared scenarios, routes, fairness, and Warm Editorial quality
- [x] `0.3.0` — Modular per-Look architecture
- [x] `0.4.0–0.4.1` — Precision Minimal implementation and quality
- [x] `0.5.0–0.5.1` — Zen Focus implementation and quality
- [x] `0.6.0–0.6.1` — Tactile Household implementation, quality, and validation foundation
- [x] `0.7.0` — Capture modes, review protocol, and shared scorecard
- [x] `0.7.1` — Look #1 shared-fixture reference and baseline mapping

---

# 18. Current next actions

- [x] Implement and code-review Looks #2, #3, #4, and #6
- [x] Add validation, capture modes, review protocol, and scorecard
- [x] Map equivalent Look #1 evidence without modifying the protected prototype
- [ ] Execute the validator in a complete checkout
- [ ] Execute browser/device/keyboard/screen-reader/forced-colors evidence review
- [ ] Capture canonical comparison evidence
- [ ] Fill the scorecard and summarize borrowable components
- [!] Hold the mandatory Round 1 selection gate before any full-app expansion
