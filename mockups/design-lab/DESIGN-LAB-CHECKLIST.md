# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.6.1`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final direction.

This file is the source of truth for scope, order, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or code-level verified
- `[~]` Partially complete; usually awaiting real-browser, device, or comparative evidence
- `[ ]` Not started
- `[!]` Decision required
- `[b]` Blocked
- `[d]` Deferred unless promoted through plan adjustment
- `[r]` Rejected or superseded, retained for history

---

# 0. Change-control agreement

A hard stop is required before any change that alters:

- [ ] The shortlisted Looks
- [ ] The three shared Round 1 screens
- [ ] Shared scenario meaning or comparison fairness
- [ ] Core Nudge hierarchy or behavior
- [ ] Branch, routing, storage, deployment, or scoring architecture
- [ ] A review gate or Round 2 participants
- [ ] Any merge into `main`
- [ ] Promotion of a deferred aesthetic
- [ ] A major omitted phase or newly discovered technical limitation

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

After approval, update this checklist and `DECISIONS.md` before implementation resumes. Minor bugs, accessibility fixes, copy changes, validation infrastructure, and visual refinements may proceed without a hard stop.

---

# 1. Safety boundaries and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged on `main`
- [x] Keep experimental files under `mockups/design-lab/`
- [x] Add visible Experimental Design Lab and build labels
- [x] Keep Design Lab state separate from Look #1
- [x] Confirm the branch remains ahead of and not behind `main` during implementation
- [ ] Recheck divergence before Round 1 scoring
- [ ] Define how later Look #1 functionality changes are incorporated
- [ ] Add a branch-specific preview deployment
- [ ] Confirm preview deployment cannot replace production GitHub Pages
- [ ] Document preview URL and refresh procedure
- [ ] Open a draft PR only when centralized review history is useful
- [ ] Do not merge before final selection and migration planning

---

# 2. Shared Design Lab foundation

## Structure and behavior

- [x] Landing page and shared review shell
- [x] Desktop and mobile review controls
- [x] Shared immutable fixtures and seven scenarios
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser Back/Forward implementation
- [x] Reset Review State and invalid-route fallback
- [x] Browser-native ES modules
- [x] Per-Look renderer boundaries
- [x] Separate Look-specific stylesheets
- [x] README, scenarios, decisions, changelog, direction documents, quality notes, and progress logs
- [x] Dependency-free validation harness in `validate-design-lab.mjs`
- [x] Validation documentation in `VALIDATION.md`
- [x] Shared browser route matrix in `ROUND-1-ROUTES.md`
- [ ] Add screenshot-friendly presentation mode
- [ ] Add `screenshots/` when canonical captures begin
- [ ] Add shared assets only when truly reused across Looks

## Comparison fairness

- [x] One fixture shared by all shortlisted Looks
- [x] Clone scenario data before rendering
- [x] Same three screens for all Looks
- [x] Same seven scenarios for all Looks
- [x] Same simulated Round 1 actions
- [x] Presentation and tone may change without changing meaning
- [x] Direction and intentional differences documented for Looks #2, #3, #4, and #6
- [x] Fixture counts, labels, required fields, and statuses covered programmatically
- [x] No aesthetic-specific fixture exception exists

---

# 3. Shared Round 1 content

## Scored screens

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

- [x] Overdue and due-today content
- [x] Upcoming and as-needed content
- [x] Empty and all-clear states
- [x] Unconfigured Section
- [x] Home and Car content
- [x] Work and Personal content
- [x] Long Area, Section, Chore, app, and Intervention labels
- [x] Many Areas, Sections, routines, and backlog items

---

# 4. Look #1 — Soft Practical Utility baseline

- [ ] Write concise visual principles
- [ ] Map equivalent shared content to Areas overview
- [ ] Map equivalent shared content to Area detail
- [ ] Capture or mock an equivalent Intervention
- [ ] Record strengths, weaknesses, and unresolved nitpicks
- [ ] Decide whether comparison embeds or separately links Look #1
- [ ] Score Look #1 as the production baseline

---

# 5. Look #2 — Warm Editorial

## Direction and implementation

- [x] Define palette, typography, editorial hierarchy, icon intent, motion intent, versatility, and anti-patterns
- [x] Implement all three screens and seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] Narrow-phone and long-content protection
- [x] Large Text handling
- [x] Contrast corrections
- [x] Critical touch targets
- [x] Focus, selected-state, navigation, and live-region semantics
- [x] Reduced-motion handling
- [~] Actual-device, keyboard, screen-reader, and comparative evidence pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Best and worst scenario
- [ ] Finalist, revise, hold, or reject status

---

# 6. Look #3 — Precision Minimal

## Direction and implementation

- [x] Define strict grid, compact density, cobalt accent, typography roles, navigation, urgency treatment, humane Intervention tone, and anti-patterns
- [x] Implement all three screens and seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] 420 px and 370 px reflow
- [x] Long-content and dense-data protection
- [x] Large Text handling
- [x] Small-label and contrast review
- [x] Screen-reader summaries and forced-colors support
- [x] Critical touch targets
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Best and worst scenario
- [ ] Finalist, revise, hold, or reject status

---

# 7. Look #4 — Zen Focus

## Direction and implementation

- [x] Define calm progressive emphasis, soft neutral palette, restrained urgency, typography, spacing, versatility, and anti-patterns
- [x] Keep one suggested start while retaining the complete information picture
- [x] Implement all three screens and seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] Preserve every backlog item and full Area access
- [x] Narrow-phone and dense-row reflow
- [x] Large Text handling
- [x] Long-content wrapping
- [x] Decorative positioning corrections
- [x] Contrast review
- [x] Richer Area, routine, Section, focus, suggestion, and Intervention semantics
- [x] Forced-colors support and critical touch targets
- [x] All Clear avoids artificial urgency
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Best and worst scenario
- [ ] Finalist, revise, hold, or reject status

---

# 8. Look #6 — Tactile Household

## Direction and implementation

- [x] Define physical labels, practical controls, card organization, tactile cues, typography, palette, versatility, Intervention tone, and anti-patterns
- [x] Avoid photorealism, fake skeuomorphism, and decorative ambiguity
- [x] Implement all three screens and seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] Responsive and overflow pass
- [x] Contrast and essential-text review
- [x] Large Text behavior that overrides narrow-screen reductions
- [x] Dense routine/status reflow
- [x] Accessibility semantics and touch targets
- [x] Strong keyboard focus treatment
- [x] Decorative-readability review
- [x] Forced-colors decoration suppression
- [x] Blocking-issue resolution
- [~] Actual-browser, keyboard, screen-reader, and comparative evidence pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Best and worst scenario
- [ ] Finalist, revise, hold, or reject status

---

# 9. Shared static, fixture, import, and route validation

## Automated harness

- [x] Add a no-dependency Node validation script
- [x] Verify every required file exists
- [x] Verify every local JavaScript import target exists
- [x] Verify every linked stylesheet and script exists
- [x] Verify stylesheet loading order
- [x] Verify all Look IDs have renderer exports and routing branches
- [x] Verify all seven scenario IDs resolve
- [x] Verify every scenario includes required Area, routine, and Intervention fields
- [x] Verify supported routine statuses and positive durations
- [x] Verify expected attention counts and Large Household size
- [x] Verify scenario cloning and unknown-scenario fallback
- [x] Generate and validate 84 Look/screen/scenario route combinations
- [x] Verify Area query serialization and removal from non-Area routes
- [x] Verify invalid route fallbacks
- [x] Verify push/replace history behavior and isolated session storage
- [x] Verify version consistency across core metadata files
- [x] Check CSS brace balance
- [x] Syntax-check the validator itself
- [x] Document the browser/device checks that static validation cannot replace
- [~] Execute the validator against a complete local or CI checkout; this session cannot resolve GitHub for cloning

## Browser review preparation

- [x] Document canonical and stress routes for all four Looks
- [x] Document invalid-route checks
- [x] Document browser Back/Forward procedure
- [x] Document required phone, short, landscape, and desktop viewports
- [x] Document evidence fields to capture

---

# 10. Shared browser, device, and accessibility evidence

## Responsive and device

- [~] Static 360 px, 390 px, and 412 px rules complete; visual walkthrough pending
- [ ] Tall Android-like viewport
- [ ] Short constrained viewport
- [ ] Desktop review panel
- [ ] Mobile review selector
- [ ] Portrait walkthrough
- [ ] Landscape smoke test

## Browser behavior

- [ ] Run `node validate-design-lab.mjs` in a complete checkout
- [ ] No console errors during core routes
- [ ] Direct links load correctly
- [ ] Browser Back and Forward work correctly
- [ ] Reset Review State works correctly
- [ ] Look and scenario switching preserve equivalent state
- [ ] Invalid routes fall back safely

## Accessibility

- [x] Visible code-level focus treatment
- [x] Approximate 44–48 px critical touch targets
- [x] Textual status in addition to color
- [x] Code-level contrast corrections
- [x] Meaningful labels and selected-state semantics
- [x] Explicit Large Text support
- [x] Reduced-motion and forced-colors foundations
- [ ] Keyboard-only walkthrough
- [ ] Logical tab order verification
- [ ] Screen-reader smoke test
- [ ] Forced-colors visual inspection
- [ ] Intervention actions remain unambiguous in every Look

## Stress content

- [x] Required stress states exist in the fixture
- [x] Every Look has code-level dense-data and overflow handling
- [ ] Visually verify every stress scenario in every Look

---

# 11. Review preparation and evidence capture

## Canonical screenshots

- [ ] Define exact viewport and capture rules
- [ ] Add screenshot-friendly mode
- [ ] Capture Areas Normal Day for Looks #1, #2, #3, #4, and #6
- [ ] Capture Kitchen Heavy Backlog
- [ ] Capture Intervention Normal Day
- [ ] Capture New User, All Clear, Large Household, Long Content, and Large Text evidence
- [ ] Store captures under `screenshots/`
- [ ] Label every image with Look, screen, scenario, viewport, and version

## Shared scorecard

Score each Look from 1–5 for:

- [ ] Clarity
- [ ] Calmness
- [ ] Speed
- [ ] Personality
- [ ] Density
- [ ] Scalability
- [ ] Intervention suitability
- [ ] Accessibility
- [ ] Versatility across Home, Car, Personal, and Work
- [ ] Daily preference

Record for every Look:

- [ ] Best feature
- [ ] Biggest problem
- [ ] Most confusing element
- [ ] Most distinctive element
- [ ] Component worth borrowing
- [ ] Best-performing scenario
- [ ] Worst-performing scenario
- [ ] Final Round 1 recommendation

## Review tooling

- [ ] Add Markdown or in-app scorecard
- [ ] Add documented notes workflow
- [ ] Allow score copying or export
- [ ] Keep scores separate from demo state
- [ ] Preserve scores across Look switching
- [ ] Add Reset Scores confirmation if scores are stored in-app

---

# 12. Round 1 selection gate — mandatory hard stop

Do not begin Round 2 until:

- [x] All four shortlisted Looks have equivalent screens and scenarios
- [ ] Quality limitations are documented and review evidence is sufficient
- [ ] Look #1 and all shortlisted Looks have scorecards
- [ ] Findings and borrowable components are summarized
- [ ] Approximately two or three finalists are selected
- [ ] Non-finalists are marked hold, reject, or components-only
- [ ] Focused finalist revisions, if any, are defined
- [ ] Synthesis remains allowed or is rejected
- [ ] Checklist and decision log are updated

When the selection decision is required, use the one-line hard stop and wait for review.

---

# 13. Round 2 — Interactive vertical slices

Each finalist must support:

- [ ] Today → Areas → Kitchen → representative Section → Chore detail
- [ ] Graded completion and Light/Moderate/Deep selection
- [ ] Add a Chore
- [ ] Task add, edit, complete, reopen, reorder, and indent
- [ ] Reusable List add, edit, complete, reopen, reorder, indent, and suggestions
- [ ] Simulated Intervention: Start, choose another, and Not Now
- [ ] Same fixture, errors, empty states, recurrence, and product boundaries

Look-specific navigation, layout, density, editing surfaces, typography, icons, motion, and equivalent-tone wording remain evaluable differences.

---

# 14. Round 2 comparison mode

- [ ] Side-by-side desktop previews
- [ ] Synchronized routes and scenarios without shared mutable state
- [ ] Look #1 versus finalist
- [ ] Finalist versus finalist
- [ ] Single-phone Look toggle
- [ ] Screenshot-friendly mode
- [ ] Clear Look labels and true phone dimensions

---

# 15. Round 2 usability and preference review

- [ ] Complete the shared journey in each finalist
- [ ] Review on an actual phone
- [ ] Test all seven scenarios
- [ ] Time useful actions and record mis-taps
- [ ] Score finalists again
- [ ] Compare initial preference with repeated-use preference
- [ ] Identify fatigue, clutter, hidden information, and decoration problems
- [ ] Identify best Intervention, dense checklist, Areas, and creation treatment

---

# 16. Synthesis exploration

Only when review evidence supports it:

- [ ] Decide whether a pure finalist is sufficient
- [ ] Identify transferable components and a dominant visual system
- [ ] Define borrowed exceptions
- [ ] Confirm coherent typography, palette, spacing, and motion
- [ ] Build key screens before full synthesis
- [ ] Compare synthesis with the strongest pure finalist
- [ ] Reject synthesis if identity or consistency weakens
- [ ] Document the decision

Potential evidence-led combinations remain deferred: Editorial typography with Precision density, Zen Intervention with another organizer, and restrained Tactile controls inside another system.

---

# 17. Final selection gate

- [ ] Equivalent finalist or synthesis functionality
- [ ] Phone and accessibility evidence sufficient for selection
- [ ] Scores and qualitative notes complete
- [ ] Works across Home, Car, Personal, and Work
- [ ] Supportive Intervention and scalable empty/dense states
- [ ] Select one visual foundation
- [ ] Decide whether Look #1 remains production baseline until Android work
- [ ] Document selected, rejected, and borrowed directions
- [ ] Define merge boundaries and migration plan

---

# 18. Branch closeout and preservation

- [ ] Preserve canonical screenshots, scorecards, and decisions
- [ ] Mark rejected Looks without deleting history
- [ ] Remove temporary code only after preservation
- [ ] Update final README and approved main documentation
- [ ] Create focused PRs for reusable infrastructure and selected visual work
- [ ] Confirm `main` remains stable
- [ ] Tag or preserve the final branch state
- [ ] Decide whether the branch remains open for later exploration

---

# 19. Milestone log

Detailed decisions live in [`DECISIONS.md`](DECISIONS.md).

- [x] `0.1.0` — Branch, shell, shortlist, and Warm Editorial audition
- [x] `0.2.0–0.2.1` — Shared scenarios, routes, fairness, and Warm Editorial quality
- [x] `0.3.0` — Modular per-Look architecture
- [x] `0.4.0–0.4.1` — Precision Minimal implementation and quality
- [x] `0.5.0–0.5.1` — Zen Focus implementation and quality
- [x] `0.6.0–0.6.1` — Tactile Household implementation and quality
- [x] `0.6.1 validation foundation` — Automated fixture, import, renderer, route, version, and CSS checks plus browser route matrix

---

# 20. Current next actions

- [x] Implement and code-review Looks #2, #3, #4, and #6
- [x] Add shared static, fixture, import, and route validation tooling
- [x] Prepare browser/device/accessibility review routes
- [~] Execute automated validation against a complete checkout
- [ ] Perform browser, device, keyboard, screen-reader, and forced-colors review
- [ ] Add scorecards and screenshot-friendly mode
- [ ] Capture canonical comparison evidence
- [ ] Score Look #1 and all shortlisted Looks
- [!] Hold the mandatory Round 1 selection gate before any full-app expansion
