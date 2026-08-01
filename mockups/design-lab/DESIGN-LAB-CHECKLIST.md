# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.7.2`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final direction.

This file is the source of truth for scope, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or verified with the stated evidence
- `[~]` Partially complete or limited by the stated environment
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

Required response:

> **Hard stop: review the Design Lab decision required before I continue.**

Minor bugs, accessibility fixes, copy changes, test infrastructure, capture tooling, baseline mapping, and visual refinements may proceed without a hard stop when scope and comparison meaning remain unchanged.

---

# 1. Safety and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged under `mockups/prototype/`
- [x] Keep experimental and comparison-only files under `mockups/design-lab/`
- [x] Isolate Design Lab query and session state
- [x] Keep visible experimental-build labels
- [x] Open draft PR #1 for centralized review history without requesting merge
- [x] Verify the branch remains ahead of and not behind `main` during implementation
- [ ] Recheck divergence immediately before the selection decision
- [ ] Define how future Look #1 product changes are incorporated
- [ ] Add a branch-specific preview deployment without replacing production Pages
- [ ] Do not merge before final selection and migration planning

---

# 2. Shared Design Lab foundation

- [x] Shared shell and desktop/mobile review controls
- [x] Immutable fixture and seven scenarios
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser History API implementation
- [x] Reset Review State and invalid-route fallback
- [x] Browser-native ES modules and per-Look renderers
- [x] Separate Look-specific stylesheets
- [x] Documentation, decisions, changelog, quality notes, and progress logs
- [x] Dependency-free validation harness
- [x] Labelled and phone-only capture modes
- [x] Shared scorecard and review protocol
- [x] Canonical screenshot package and contact sheets prepared

## Comparison fairness

- [x] One shared fixture for all active Looks and the Look #1 reference
- [x] Same Areas, Area detail, and Intervention moments
- [x] Same seven scenarios and evidence order
- [x] Same Round 1 meaning and equivalent simulated actions
- [x] Presentation and tone may differ without changing meaning
- [x] Look #1 Intervention limitation remains explicitly labeled
- [x] Programmatic fixture, route, and renderer fairness checks executed in the isolated checkout

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

# 4. Direction implementation and evidence

## Look #1 — Soft Practical Utility baseline

- [x] Document visual principles, strengths, and risks
- [x] Map the shared fixture to Areas and Kitchen reference screens
- [x] Add a clearly labeled comparison-only Intervention extrapolation
- [x] Keep the reference separate from the active Look selector
- [x] Reuse shared scenarios, Large Text, and capture modes
- [x] Execute route, viewport, stress, keyboard, AX-tree, and media-emulation evidence
- [x] Capture three canonical screenshots
- [x] Add provisional score with the Intervention limitation explicitly discounted
- [~] Physical-device and actual screen-reader evidence pending

## Look #2 — Warm Editorial

- [x] Direction, versatility, anti-patterns, screens, and scenarios implemented
- [x] Responsive, Large Text, contrast, touch-target, focus, semantic, and reduced-motion pass
- [x] Execute route, viewport, stress, keyboard, AX-tree, and media-emulation evidence
- [x] Capture three canonical screenshots
- [x] Complete provisional score and qualitative findings
- [~] Physical-device and actual screen-reader evidence pending

## Look #3 — Precision Minimal

- [x] Direction, density, typography, Intervention tone, screens, and scenarios implemented
- [x] Narrow-screen, long-content, Large Text, contrast, semantics, forced-colors, and touch-target pass
- [x] Execute route, viewport, stress, keyboard, AX-tree, and media-emulation evidence
- [x] Capture three canonical screenshots
- [x] Complete provisional score and qualitative findings
- [~] Physical-device and actual screen-reader evidence pending

## Look #4 — Zen Focus

- [x] Calm progressive emphasis, complete information retention, screens, and scenarios implemented
- [x] Narrow-screen, dense-row, Large Text, wrapping, contrast, semantics, forced-colors, and touch-target pass
- [x] Execute route, viewport, stress, keyboard, AX-tree, and media-emulation evidence
- [x] Capture three canonical screenshots
- [x] Complete provisional score and qualitative findings
- [~] Physical-device and actual screen-reader evidence pending

## Look #6 — Tactile Household

- [x] Practical tactile direction, versatility, screens, and scenarios implemented
- [x] Responsive, overflow, contrast, Large Text, dense-row, semantics, focus, decorative-readability, and forced-colors pass
- [x] Execute route, viewport, stress, keyboard, AX-tree, and media-emulation evidence
- [x] Capture three canonical screenshots
- [x] Complete provisional score and qualitative findings
- [~] Physical-device and actual screen-reader evidence pending

---

# 5. Static, route, and browser validation

## Static and route checks

- [x] Validate required files and relative imports
- [x] Validate linked stylesheets and HTML references
- [x] Validate renderer exports and active-Look routing
- [x] Validate fixture fields, statuses, counts, cloning, and fallbacks
- [x] Validate 84 active-Look route combinations
- [x] Validate the equivalent 21 Look #1 reference routes
- [x] Validate version consistency and CSS brace balance

## Browser evidence

- [x] Execute **105 / 105** direct routes
- [x] Execute **90 / 90** canonical viewport checks
- [x] Execute **35 / 35** stress-state routes
- [x] Verify **10 / 10** Long Content and Large Text action groups remain reachable after scrolling
- [x] Detect and fix root `data-look` click interception
- [x] Verify Area navigation and History API return path after the fix
- [x] Verify Look switching preserves the Heavy Backlog scenario
- [x] Verify Reset Review State returns Look #2 · Areas · Normal Day
- [x] Verify invalid-route fallback
- [x] Verify Intervention toast feedback
- [x] Verify selected-state semantics
- [~] Native HTTP-origin browser Back/Forward remains untested because local/file navigation was blocked; the same state and `popstate` path passed in the isolated harness

## Accessibility and media evidence

- [x] Visible keyboard focus in all sampled controls
- [x] Keyboard Enter opens the focused Kitchen Area
- [x] Automated accessibility tree contains 28 named buttons and zero unnamed buttons in the audited dense route
- [x] Forced-colors emulation completed for all five directions without runtime errors
- [x] Reduced-motion emulation completed for all five directions without runtime errors
- [ ] Physical-device viewport review
- [ ] NVDA or JAWS smoke test
- [ ] VoiceOver or TalkBack smoke test
- [ ] Physical forced-colors/high-contrast inspection

---

# 6. Evidence capture and scorecard

- [x] Define viewport, route, screenshot, and filename rules
- [x] Add automatic Look/screen/scenario/version labels
- [x] Capture Areas · Normal Day for all five directions
- [x] Capture Kitchen · Heavy Backlog for all five directions
- [x] Capture Intervention · Normal Day for all five directions
- [x] Prepare Areas, Kitchen, and Intervention contact sheets
- [x] Prepare ZIP containing all 15 canonical captures
- [x] Add `ROUND-1-EVIDENCE-0.7.2.md`
- [x] Add `ROUND-1-SCORECARD-0.7.2.md`
- [x] Record best feature, biggest problem, confusing element, distinctive element, borrowable component, best/worst scenario, and repeated-use concern for every direction
- [x] Record provisional ranking and finalist recommendation
- [ ] Product owner reviews captures and confirms or changes the scores
- [ ] Product owner selects approximately two or three finalists

---

# 7. Round 1 selection gate — mandatory hard stop

Completed prerequisites:

- [x] All shortlisted Looks have equivalent screens and scenarios
- [x] Look #1 has equivalent comparison routes with its limitation documented
- [x] Browser and stress evidence is documented
- [x] Provisional scorecards and borrowable components are summarized
- [x] Provisional finalist recommendation is documented

Decision items:

- [!] Confirm approximately two or three finalists
- [!] Mark non-finalists Hold, Reject, or Components only
- [!] Confirm focused revisions before Round 2
- [!] Allow, reject, or defer synthesis
- [!] Update `DECISIONS.md` with the product-owner decision

Do not begin Round 2 until these items are reviewed. Use the required one-line hard stop.

---

# 8. Round 2 — Interactive vertical slices

Each selected finalist must support:

- [ ] Today → Areas → Kitchen → representative Section → Chore detail
- [ ] Graded completion and Light/Moderate/Deep selection
- [ ] Add a Chore
- [ ] Task add, edit, complete, reopen, reorder, and indent
- [ ] Reusable List add, edit, complete, reopen, reorder, indent, and suggestions
- [ ] Simulated Intervention: Start, choose another, and Not Now
- [ ] Same fixture, errors, empty states, recurrence, and product boundaries

---

# 9. Round 2 comparison, synthesis, and final selection

- [ ] Side-by-side synchronized previews
- [ ] Look #1 versus finalist and finalist versus finalist
- [ ] Actual-phone shared journey and timing review
- [ ] Rescore finalists and compare initial versus repeated-use preference
- [ ] Decide whether a pure finalist is sufficient
- [ ] Define a coherent synthesis only when evidence supports it
- [ ] Select one visual foundation or approved synthesis
- [ ] Define merge boundaries and migration plan

Potential evidence-led combinations remain deferred: Editorial typography with Precision density, Zen Intervention with another organizer, and restrained Tactile controls inside another system.

---

# 10. Branch closeout and preservation

- [ ] Preserve final screenshots, scorecards, and decisions
- [ ] Mark rejected Looks without deleting history
- [ ] Confirm `main` remains stable
- [ ] Create focused PRs for reusable infrastructure and selected visual work
- [ ] Tag or preserve the final branch state

---

# 11. Milestone log

- [x] `0.1.0` — Branch, shell, shortlist, and Warm Editorial audition
- [x] `0.2.0–0.2.1` — Shared scenarios, routes, fairness, and Warm Editorial quality
- [x] `0.3.0` — Modular per-Look architecture
- [x] `0.4.0–0.4.1` — Precision Minimal implementation and quality
- [x] `0.5.0–0.5.1` — Zen Focus implementation and quality
- [x] `0.6.0–0.6.1` — Tactile Household implementation, quality, and validation foundation
- [x] `0.7.0` — Capture modes, review protocol, and shared scorecard
- [x] `0.7.1` — Look #1 shared-fixture reference and baseline mapping
- [x] `0.7.2` — Browser evidence, click-routing correction, canonical captures, and provisional scoring

---

# 12. Current next action

- [!] Hold the mandatory Round 1 selection gate before any finalist revisions or full-app expansion.
