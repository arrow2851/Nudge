# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.6.0`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final direction.

This file is the source of truth for scope, order, progress, review gates, and decisions.

## Status legend

- `[x]` Completed or code-level verified
- `[~]` Partially complete; usually awaiting real-browser or comparative evidence
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
- [ ] Branch, routing, storage, or deployment architecture
- [ ] The scoring process after scoring begins
- [ ] A review gate or Round 2 participants
- [ ] Any merge into `main`
- [ ] Promotion of a deferred aesthetic
- [ ] A major omitted phase or newly discovered technical limitation

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

After approval, update this checklist and `DECISIONS.md` before implementation resumes. Minor bugs, accessibility fixes, copy changes, and visual refinements may proceed without a hard stop.

---

# 1. Safety boundaries and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged on `main`
- [x] Keep all current experimental files under `mockups/design-lab/`
- [x] Add visible Experimental Design Lab and build labels
- [x] Keep Design Lab browser state separate from Look #1
- [x] Verify the branch remains ahead of and not behind `main` during implementation
- [ ] Recheck divergence before the Round 1 review gate
- [ ] Define how later Look #1 functionality changes would be incorporated
- [ ] Add a branch-specific preview deployment
- [ ] Confirm preview deployment cannot replace production GitHub Pages
- [ ] Document preview URL and refresh procedure
- [ ] Open a draft PR only when centralized review history becomes useful
- [ ] Do not merge before the final selection and migration plan

---

# 2. Shared Design Lab foundation

## Structure

- [x] Landing page, shared shell, and mobile/desktop controls
- [x] Shared immutable fixtures and scenarios
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser Back/Forward implementation
- [x] Reset Review State and invalid-route fallback
- [x] Modular ES architecture: config, fixtures, utilities, state, controls, per-Look renderers
- [x] README, scenario specification, decisions log, changelog, and versioned progress notes
- [ ] Add automated route and fixture smoke checks
- [ ] Add screenshot-friendly presentation mode
- [ ] Add `assets/` only when shared assets are introduced
- [ ] Add `screenshots/` when canonical captures begin

## Comparison fairness

- [x] One fixture and seven scenarios shared by active Looks
- [x] Clone scenario data before rendering
- [x] Keep Round 1 actions simulated and equivalent
- [x] Allow presentation and tone differences without changing meaning
- [x] Document intentional differences for Looks #2, #3, #4, and #6
- [ ] Verify fixture counts and labels programmatically
- [x] Confirm no aesthetic-specific fixture exception after all four Looks exist

---

# 3. Shared Round 1 audition content

## Screens

- [x] Areas overview
- [x] Representative Area detail, normally Kitchen
- [x] Intervention
- [x] Treat all three as scored screens
- [x] Prevent full-app expansion before finalist selection

## Scenarios

- [x] Normal Day
- [x] Heavy Backlog
- [x] New User
- [x] All Clear
- [x] Large Household
- [x] Long Content
- [x] Large Text
- [d] Dark Environment unless later promoted through plan adjustment

## Fixture coverage

- [x] Overdue and due-today content
- [x] Upcoming and as-needed content
- [x] Empty and all-clear states
- [x] Unconfigured Section
- [x] Car maintenance
- [x] Work and Personal Areas
- [x] Long Area, Section, Chore, and Intervention labels
- [x] Many Areas, Sections, routines, and backlog items

---

# 4. Look #1 reference baseline

- [ ] Write concise Look #1 visual principles
- [ ] Capture Areas overview using equivalent content
- [ ] Capture Area detail using equivalent content
- [ ] Capture or mock equivalent Intervention content
- [ ] Record strengths, weaknesses, and unresolved nitpicks
- [ ] Decide whether final comparison embeds or separately links Look #1
- [ ] Score Look #1 as the baseline

---

# 5. Look #2 — Warm Editorial

## Direction and implementation

- [x] Define palette, typography, editorial hierarchy, icon intent, motion intent, and anti-patterns
- [x] Define support for Home, Car, Personal, and Work
- [x] Implement all three Round 1 screens
- [x] Implement all seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] Narrow-phone and long-content protection
- [x] Explicit Large Text handling
- [x] Contrast corrections
- [x] Critical touch targets
- [x] Keyboard focus, selected-state, navigation, and live-region semantics
- [x] Reduced-motion handling
- [~] Actual-device, keyboard, screen-reader, and comparative review pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, and borrowable components
- [ ] Finalist, revise, hold, or reject status

---

# 6. Look #3 — Precision Minimal

## Direction and implementation

- [x] Define strict grid, compact density, cobalt accent, typography roles, navigation, urgency treatment, and anti-patterns
- [x] Define humane non-corporate Intervention tone
- [x] Implement all three Round 1 screens
- [x] Implement all seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] 420 px and 370 px reflow
- [x] Long-content and dense-data protection
- [x] Explicit Large Text handling
- [x] Small-label and contrast review
- [x] Screen-reader summaries and forced-colors support
- [x] Critical touch targets
- [~] Actual-browser, keyboard, screen-reader, and comparative review pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, and borrowable components
- [ ] Finalist, revise, hold, or reject status

---

# 7. Look #4 — Zen Focus

## Direction and implementation

- [x] Define calm progressive emphasis without hiding required information
- [x] Define soft neutral palette, restrained urgency, typography, spacing, and anti-patterns
- [x] Keep one suggested starting point with the complete Area and routine picture below it
- [x] Implement all three Round 1 screens
- [x] Implement all seven scenarios
- [x] Preserve shared routes and simulated actions

## Code-level quality

- [x] Preserve every backlog item and full Area access
- [x] Narrow-phone and dense-row reflow
- [x] Explicit Large Text handling for fixed-size content
- [x] Long-content wrapping
- [x] Correct empty-orbit and pause-mark positioning
- [x] Correct overdue contrast and review remaining palette roles
- [x] Area, routine, Section, focus-card, suggestion, and Intervention semantics
- [x] Forced-colors support and critical touch targets
- [x] Use `Available when useful` rather than urgent language in All Clear
- [~] Actual-browser, keyboard, screen-reader, and comparative review pending

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, and borrowable components
- [ ] Finalist, revise, hold, or reject status

---

# 8. Look #6 — Tactile Household

## Direction definition

- [x] Confirm physical labels, controls, index-card organization, and satisfying tactile cues
- [x] Define restrained palette and non-photorealistic material references
- [x] Define readable typography
- [x] Define checkbox, status-stamp, raised-button, card, and Section-drawer treatments
- [x] Define support beyond household content
- [x] Define a supportive timer-panel Intervention where novelty does not distract
- [x] Document anti-patterns: fake skeuomorphism, excessive decoration, and unclear affordances

## Round 1 implementation

- [x] Areas overview using the shared fixture
- [x] Representative Area detail
- [x] Intervention
- [x] All seven scenarios
- [x] Shared route and simulated-action behavior
- [x] Initial dense-list and long-content fallback
- [x] Initial Large Text and narrow-phone handling
- [x] Initial semantics and forced-colors handling

## Code-level quality

- [~] Responsive and overflow pass
- [~] Contrast and essential-text review
- [~] Accessibility semantics and touch targets
- [~] Decorative performance and readability review
- [~] Blocking-issue resolution
- [ ] Actual-browser, keyboard, screen-reader, and comparative review

## Round 1 review

- [ ] Canonical screenshots
- [ ] Shared scorecard
- [ ] Best feature, biggest weakness, and borrowable components
- [ ] Finalist, revise, hold, or reject status

---

# 9. Deferred aesthetic directions

- [d] Look #5 — Bold Modern Consumer
- [d] Look #7 — Dark Ambient as a standalone system
- [d] Look #8 — Friendly Illustrated Home
- [d] Look #9 — System Dashboard
- [d] Dark variants of finalists
- [d] Additional aesthetics discovered during review

Promotion requires a hard stop, explanation of the shortlist gap, and equivalent Round 1 scope.

---

# 10. Review rubric and feedback capture

## Shared 1–5 scores

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

## Per-Look notes

- [ ] Best feature
- [ ] Biggest problem
- [ ] Most confusing element
- [ ] Most distinctive element
- [ ] Component worth borrowing
- [ ] Best and worst scenario
- [ ] Final Round 1 recommendation

## Tooling

- [ ] Add Markdown or in-app scorecard
- [ ] Add documented notes workflow
- [ ] Allow score copying or export
- [ ] Keep review scores separate from demo state
- [ ] Preserve scores across Look switching
- [ ] Add Reset Scores confirmation if stored in-app

---

# 11. Shared Round 1 quality checks

## Responsive and device

- [~] 360 px, 390 px, and 412 px static rules exist for all four Looks; Look #6 quality review and real-browser evidence pending
- [ ] Tall Android-like viewport
- [ ] Short constrained viewport
- [ ] Desktop review panel
- [ ] Mobile review selector
- [ ] Portrait walkthrough
- [ ] Landscape smoke test

## Accessibility

- [x] Visible focus treatment
- [x] Approximate 44–48 px critical touch targets in implemented foundations
- [x] Textual status in addition to color
- [~] Code-level contrast correction complete for Looks #2–#4; Look #6 pass pending
- [x] Meaningful labels and selected-state semantics
- [x] Explicit Large Text scenario support in all four Looks
- [x] Reduced-motion and forced-colors foundations
- [~] Browser tab order, keyboard operation, and screen-reader smoke tests pending

## Content and stress

- [x] Fixture contains every required stress state
- [x] All four Looks include initial overflow and dense-data handling
- [ ] Visually verify every stress state in every completed Look

## Technical

- [x] HTML parser, CSS balance, and JavaScript syntax checks completed during prior milestones
- [ ] Run a current full static check after the Look #6 quality pass
- [ ] Confirm no console errors during all core routes
- [ ] Verify browser Back/Forward in a browser
- [ ] Add route-level automated checks
- [x] No dependency on Look #1 state
- [x] No current writes outside Design Lab

---

# 12. Round 1 selection gate — mandatory hard stop

Do not begin Round 2 until:

- [x] All four shortlisted Looks have equivalent screens and scenarios
- [ ] Quality checks are complete or limitations documented
- [ ] Look #1 and all shortlisted Looks have scorecards
- [ ] Findings and borrowable components are summarized
- [ ] Approximately two or three finalists are selected
- [ ] Non-finalists are marked hold, reject, or components-only
- [ ] Focused finalist revisions, if any, are defined
- [ ] Synthesis remains allowed or is rejected
- [ ] Checklist and decision log are updated

---

# 13. Round 2 — Interactive vertical slices

Each finalist must support:

- [ ] Today → Areas → Kitchen → representative Section → Chore detail
- [ ] Graded completion and Light/Moderate/Deep selection
- [ ] Add a Chore
- [ ] Task add, edit, complete, reopen, reorder, and indent
- [ ] Reusable List add, edit, complete, reopen, reorder, indent, and suggestions
- [ ] Simulated Intervention: start, choose another, and Not Now
- [ ] Same fixture, errors, empty states, recurrence, and product boundaries

Look-specific navigation, layout, density, editing surface, typography, icons, motion, and equivalent-tone wording remain evaluable differences.

---

# 14. Round 2 comparison mode

- [ ] Side-by-side desktop previews
- [ ] Synchronized routes and scenarios without shared mutable state
- [ ] Look #1 versus finalist and finalist versus finalist
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
- [ ] Build key screens before a full synthesis
- [ ] Compare synthesis with the strongest pure finalist
- [ ] Reject synthesis if identity or consistency weakens
- [ ] Document the decision

Potential evidence-led combinations remain deferred: Editorial typography with Precision density, Zen Intervention with another organizer, and Tactile controls in a restrained system.

---

# 17. Final selection gate

- [ ] Equivalent finalist or synthesis functionality
- [ ] Phone and accessibility review sufficient for selection
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

# 19. Decision and milestone log

Detailed decisions live in [`DECISIONS.md`](DECISIONS.md).

- [x] `0.1.0` — Branch, shell, shortlist, and initial Warm Editorial audition
- [x] `0.2.0` — Shared scenarios, routes, reset, and fairness foundation
- [x] `0.2.1` — Warm Editorial code-level quality pass
- [x] `0.3.0` — Modular per-Look architecture
- [x] `0.4.0–0.4.1` — Precision Minimal implementation and quality pass
- [x] `0.5.0–0.5.1` — Zen Focus implementation and quality pass
- [x] `0.6.0` — Tactile Household implementation; all shortlisted Round 1 auditions now exist

---

# 20. Current next actions

- [x] Shared fixture and modular architecture
- [x] Implement and code-review Look #2 Warm Editorial
- [x] Implement and code-review Look #3 Precision Minimal
- [x] Implement and code-review Look #4 Zen Focus
- [x] Define and implement Look #6 Tactile Household
- [ ] Complete Look #6 code-level quality review
- [ ] Run current full static checks across all four Looks
- [ ] Complete shared Round 1 browser/device/accessibility checks
- [ ] Build scorecards and capture canonical screenshots
- [ ] Score Look #1 and all shortlisted Looks
- [!] Hold the mandatory Round 1 selection gate before full-app expansion
