# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 under `mockups/prototype/` on `main`  
**Experimental path:** `mockups/design-lab/`  
**Current version:** `0.5.0`  
**Current milestone:** Look #4 Zen Focus implemented; code-level quality pass next.

This is the persistent source of truth for Design Lab scope, order, progress, review gates, and plan changes. Versioned `CHECKLIST-PROGRESS-*.md` files provide additional build-level detail.

## Status

- `[x]` Complete
- `[~]` In progress or complete at code level with real-device review pending
- `[ ]` Not started
- `[d]` Deferred
- `[r]` Retired or rejected

---

# 0. Change control

## Hard-stop triggers

Stop before continuing when a request would:

- [ ] Add, remove, or replace a shortlisted Look
- [ ] Change the three shared Round 1 screens
- [ ] Change scenario meaning or comparison data after reviews begin
- [ ] Give one Look more functionality than another during the same round
- [ ] Change Nudge’s product hierarchy or approved functionality
- [ ] Expand a Look into the full app before the Round 1 selection gate
- [ ] Change routing, storage, deployment, or branch architecture materially
- [ ] Move experimental work outside `feature/design-lab`
- [ ] Merge experimental work into `main`
- [ ] Promote a deferred aesthetic
- [ ] Change scoring criteria after reviews begin
- [ ] Skip a review gate
- [ ] Discover a limitation that invalidates the comparison method
- [ ] Discover a missing major phase or material scope underestimate

When one occurs, respond only:

> **Hard stop: review the Design Lab decision required before I continue.**

After the user asks to review it, provide:

1. What changed
2. Why the current checklist no longer fits
3. Recommended adjustment
4. Impact on completed work and comparison fairness
5. The decision required

After approval:

- [ ] Update this checklist first
- [ ] Add a dated entry to `DECISIONS.md`
- [ ] Mark superseded work `[r]` where appropriate
- [ ] Reconfirm the next active milestone
- [ ] Resume implementation

Minor fixes, accessibility corrections, copy changes, and visual refinements that preserve scope may proceed without a hard stop.

---

# 1. Branch safety and governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged on `main`
- [x] Isolate all current work under `mockups/design-lab/`
- [x] Add Experimental Design Lab labeling
- [x] Keep Design Lab state separate from Look #1 state
- [x] Avoid language implying an experiment is selected for production
- [~] Recheck divergence from `main` during each milestone; final Round 1 recheck still required
- [ ] Define how later Look #1 functionality changes would be synchronized
- [ ] Add a branch-specific preview deployment that cannot replace production Pages
- [ ] Document the preview URL and refresh procedure
- [ ] Open a draft PR only when centralized review history becomes useful
- [ ] Do not merge until the final selection and migration plan are documented

---

# 2. Shared Design Lab foundation

## Architecture and documentation

- [x] Create the Design Lab review shell
- [x] Add shared fixtures and all seven scenarios
- [x] Add query-string routing for Look, screen, scenario, and Area
- [x] Add browser Back and Forward behavior
- [x] Add Reset Review State
- [x] Add safe invalid-route fallbacks
- [x] Add desktop and mobile review controls
- [x] Add version and build metadata
- [x] Split configuration, fixtures, utilities, state, controls, and per-Look renderers
- [x] Add `README.md`, `SCENARIOS.md`, `DECISIONS.md`, and `CHANGELOG.md`
- [x] Add design-direction documents for Looks #2, #3, and #4
- [x] Add code-level quality documents for Looks #2 and #3
- [ ] Add Look #4 quality document
- [ ] Add Look #6 direction and quality documents
- [ ] Add canonical `screenshots/` when review capture begins
- [ ] Add scorecards and a documented review-notes workflow

## Fairness rules

- [x] Use one shared immutable fixture
- [x] Clone scenario data before rendering
- [x] Preserve equivalent product meaning across Looks
- [x] Keep all Round 1 actions simulated
- [x] Preserve the same routes and review controls
- [x] Document intentional layout and tone differences for Looks #2, #3, and #4
- [x] Ensure Looks #2, #3, and #4 consume all seven scenarios
- [ ] Verify Look #6 consumes all seven scenarios
- [ ] Programmatically verify scenario counts and labels
- [ ] Confirm no aesthetic-specific fixture exception is needed after all four Looks exist

---

# 3. Shared Round 1 content

## Required screens

- [x] Areas overview
- [x] Representative Area detail, normally Kitchen
- [x] Intervention
- [x] Treat all three as scored screens
- [x] Keep Round 1 focused on visual-system validation

## Required scenarios

- [x] Normal Day
- [x] Heavy Backlog
- [x] New User
- [x] All Clear
- [x] Large Household
- [x] Long Content
- [x] Large Text
- [d] Dark Environment unless it can be tested fairly without creating separate dark-theme projects

## Required data coverage

- [x] Home Areas
- [x] Car maintenance
- [x] Work content
- [x] Personal content
- [x] Empty, all-clear, due, overdue, and as-needed states
- [x] Long Area, Section, Chore, and Intervention labels
- [x] Many Areas, Sections, and routines
- [x] Unconfigured Section

---

# 4. Look #1 reference baseline

- [ ] Document Look #1 visual principles
- [ ] Capture Look #1 Areas overview with shared content
- [ ] Capture Look #1 Area detail with shared content
- [ ] Capture or mock Look #1 Intervention with shared content
- [ ] Record strengths
- [ ] Record weaknesses and deferred nitpicks without changing Look #1
- [ ] Decide whether comparison mode embeds Look #1 or links separately
- [ ] Score Look #1 using the same rubric

---

# 5. Look #2 — Warm Editorial

## Direction and implementation

- [x] Define palette, typography, editorial hierarchy, icon intent, and motion intent
- [x] Document Home, Car, Personal, and Work support
- [x] Document anti-patterns
- [x] Implement Areas overview
- [x] Implement Area detail
- [x] Implement Intervention
- [x] Support all seven scenarios
- [x] Preserve shared routes and simulated actions

## Quality and review

- [x] Complete code-level narrow-phone handling
- [x] Complete code-level Long Content and Large Text handling
- [x] Correct blocking contrast issues
- [x] Add keyboard focus, semantics, and reduced-motion support
- [x] Expand critical touch targets
- [~] Actual phone, browser-keyboard, and screen-reader review pending
- [ ] Capture canonical screenshots
- [ ] Complete scorecard and qualitative notes
- [ ] Mark finalist, revise, hold, reject, or components-only

---

# 6. Look #3 — Precision Minimal

## Direction and implementation

- [x] Define strict grid, compact density, minimal ornament, and cobalt accent
- [x] Define sans-serif and monospaced roles
- [x] Define status, navigation, spacing, border, and intervention rules
- [x] Document anti-patterns and accessibility concerns
- [x] Implement Areas overview
- [x] Implement Area detail
- [x] Implement Intervention
- [x] Support all seven scenarios
- [x] Preserve shared routes and simulated actions

## Quality and review

- [x] Complete code-level 420 px and 370 px reflow
- [x] Complete Long Content and Large Text handling
- [x] Increase undersized operational labels
- [x] Add screen-reader summaries and forced-colors support
- [x] Preserve 44–46 px critical targets
- [~] Actual phone, browser-keyboard, console, and screen-reader review pending
- [ ] Capture canonical screenshots
- [ ] Complete scorecard and qualitative notes
- [ ] Mark finalist, revise, hold, reject, or components-only

---

# 7. Look #4 — Zen Focus

## Direction and implementation

- [x] Define calm progressive emphasis without hiding required information
- [x] Define soft neutral palette and restrained urgency colors
- [x] Define sans-serif typography, spacious hierarchy, and limited soft surfaces
- [x] Define one suggested starting point with the complete list retained below
- [x] Define choice-centered Intervention language
- [x] Document versatility and anti-patterns
- [x] Implement Areas overview
- [x] Implement Area detail
- [x] Implement Intervention
- [x] Support all seven scenarios
- [x] Preserve shared routes and simulated actions

## Quality and review

- [~] Initial 420 px, 370 px, Long Content, Large Text, and forced-colors handling included
- [~] Initial screen-reader summaries and 44–48 px targets included
- [ ] Verify Heavy Backlog does not become deceptively calm
- [ ] Verify Large Household does not require excessive scrolling
- [ ] Verify the recommended routine does not hide total attention
- [ ] Complete contrast and text-size audit
- [ ] Resolve blocking code-level issues
- [ ] Document Look #4 quality pass
- [ ] Complete actual phone, keyboard, console, and screen-reader review
- [ ] Capture canonical screenshots
- [ ] Complete scorecard and qualitative notes
- [ ] Mark finalist, revise, hold, reject, or components-only

---

# 8. Look #6 — Tactile Household

## Direction

- [ ] Define physical-label, index-card, and household-tool references
- [ ] Define palette and readable typography
- [ ] Define checkbox, switch, stamp, and completion treatments
- [ ] Define support for Car, Personal, Work, and abstract Areas
- [ ] Define a non-distracting Intervention
- [ ] Document anti-patterns, especially fake skeuomorphism and excessive decoration

## Implementation and quality

- [ ] Implement Areas overview
- [ ] Implement Area detail
- [ ] Implement Intervention
- [ ] Support all seven scenarios
- [ ] Preserve shared routes and simulated actions
- [ ] Verify dense lists remain readable
- [ ] Verify tactile controls remain accessible
- [ ] Verify decorative surfaces do not obscure information
- [ ] Complete code-level quality pass
- [ ] Complete actual-device and assistive-technology review
- [ ] Capture canonical screenshots
- [ ] Complete scorecard and qualitative notes
- [ ] Mark finalist, revise, hold, reject, or components-only

---

# 9. Deferred directions

- [d] Look #5 — Bold Modern Consumer
- [d] Look #7 — Dark Ambient as a standalone system
- [d] Look #8 — Friendly Illustrated Home
- [d] Look #9 — System Dashboard
- [d] Dark variants of finalist Looks
- [d] Additional aesthetics discovered during review

Promoting any deferred direction requires the hard-stop adjustment process.

---

# 10. Shared quality checks

## Responsive and device

- [~] 360 px rules exist for active Looks; real-device review pending
- [~] 390 px rules exist for active Looks; real-device review pending
- [~] 412 px rules exist for active Looks; real-device review pending
- [ ] Tall Android viewport
- [ ] Short constrained viewport
- [ ] Desktop review panel
- [ ] Mobile review controls
- [ ] Portrait orientation
- [ ] Landscape smoke test

## Accessibility

- [x] Shared visible keyboard focus
- [x] Shared selected-state semantics
- [x] Shared skip navigation
- [x] Color is not the only status indicator in implemented Looks
- [x] Reduced-motion fallback
- [~] Critical targets are approximately 44–48 px in implemented Looks; verify Look #6 later
- [~] Contrast reviewed for Looks #2 and #3; Look #4 and #6 pending
- [~] Large Text implemented for Looks #2, #3, and #4; full visual review pending
- [ ] Browser tab-order review
- [ ] Screen-reader smoke test
- [ ] Confirm all Intervention actions remain unambiguous across all Looks

## Technical

- [x] Browser-native ES-module architecture
- [x] No dependency on production Look #1 state
- [x] Current writes limited to Design Lab files
- [~] Static syntax and import checks performed during implementation
- [ ] Automated route smoke checks
- [ ] Browser console-error review
- [ ] Browser Back and Forward verification in a real browser
- [ ] HTML validation
- [ ] CSS validation beyond syntax smoke checks

---

# 11. Review rubric and tooling

Score each Look from 1–5 for:

- [ ] Clarity
- [ ] Calmness
- [ ] Speed
- [ ] Personality
- [ ] Density
- [ ] Scalability
- [ ] Intervention suitability
- [ ] Accessibility
- [ ] Versatility
- [ ] Daily preference

For each Look record:

- [ ] Numeric scores
- [ ] Best feature
- [ ] Biggest problem
- [ ] Most confusing element
- [ ] Most distinctive element
- [ ] Component worth borrowing
- [ ] Best and worst scenarios
- [ ] Round 1 recommendation

Tooling:

- [ ] Add Markdown or in-app scorecards
- [ ] Add review-notes workflow
- [ ] Allow copying or exporting scores
- [ ] Keep scores separate from demo state
- [ ] Preserve scores when switching Looks
- [ ] Add Reset Scores confirmation if stored in-app

---

# 12. Round 1 selection gate — mandatory hard stop

Do not start full vertical slices until all are complete:

- [ ] Looks #2, #3, #4, and #6 have equivalent screens
- [ ] All four support all seven scenarios
- [ ] Known quality limitations are documented
- [ ] Look #1 and all four alternatives have scorecards
- [ ] Findings are summarized
- [ ] Select approximately two or three finalists
- [ ] Mark non-finalists hold, reject, or components-only
- [ ] Decide whether any finalist needs one focused revision
- [ ] Decide whether synthesis remains allowed
- [ ] Update this checklist for selected finalists
- [ ] Add dated decision entry

At this gate use the one-line hard-stop response before continuing.

---

# 13. Round 2 — Interactive vertical slices

For every selected finalist:

- [ ] Today
- [ ] Areas
- [ ] Area detail
- [ ] Section detail
- [ ] Chore details
- [ ] Graded completion with Light, Moderate, and Deep
- [ ] Add Chore
- [ ] Tasks: add, edit, complete, reopen, reorder, and indent
- [ ] Reusable List: add, edit, complete, reopen, reorder, indent, and remembered suggestions
- [ ] Simulated Intervention: Start, different action, and Not Now
- [ ] Same fixture, product rules, errors, and empty states
- [ ] Document every intentional interaction divergence

---

# 14. Round 2 comparison and testing

- [ ] Side-by-side desktop previews
- [ ] Synchronized routes and scenarios
- [ ] Look #1 versus finalist comparison
- [ ] Finalist versus finalist comparison
- [ ] Single-phone Look toggle
- [ ] Screenshot-friendly mode
- [ ] Preserve true phone dimensions
- [ ] Complete the shared journey in every finalist
- [ ] Review on an actual phone
- [ ] Test all seven scenarios
- [ ] Record speed, mis-taps, confusion, fatigue, clutter, and hidden information
- [ ] Rescore finalists after repeated use
- [ ] Identify best Areas, dense checklist, creation/editing, and Intervention treatments

---

# 15. Optional synthesis

Only when review evidence supports it:

- [ ] Decide whether one finalist is sufficient without synthesis
- [ ] Identify transferable components
- [ ] Define one dominant visual system
- [ ] Define borrowed exceptions
- [ ] Confirm coherent typography, palette, spacing, and motion
- [ ] Build key screens first
- [ ] Compare against the strongest pure finalist
- [ ] Reject synthesis if identity or consistency weakens
- [ ] Document the result

Potential combinations remain deferred until evidence supports them:

- [d] Warm Editorial typography with Precision Minimal density
- [d] Zen Intervention with another organizer system
- [d] Tactile completion controls within a restrained system
- [d] Later Dark Ambient theme for the selected Look

---

# 16. Final selection and migration

- [ ] Equivalent finalist functionality
- [ ] Phone and accessibility review complete enough for selection
- [ ] Scores and notes complete
- [ ] Selected direction works for Home, Car, Personal, and Work
- [ ] Selected Intervention feels supportive
- [ ] Empty and dense states both scale
- [ ] Select one visual foundation or approved synthesis
- [ ] Document selected, rejected, and borrowed directions
- [ ] Decide whether Look #1 remains production baseline until native Android work
- [ ] Define exactly what may merge
- [ ] Create migration plan rather than replacing Look #1 ad hoc
- [ ] Add dated final decision entry

---

# 17. Branch closeout

- [ ] Preserve screenshots, scorecards, and decisions
- [ ] Mark rejected Looks without deleting history
- [ ] Remove abandoned temporary code only after preservation
- [ ] Update README with final outcome
- [ ] Update main documentation only after an approved merge plan
- [ ] Create focused PRs for reusable infrastructure and selected visual work
- [ ] Confirm `main` remains stable
- [ ] Tag or preserve final Design Lab branch state
- [ ] Decide whether the branch remains open for future exploration

---

# 18. Current next actions

- [x] Build shared foundation and scenarios
- [x] Implement and code-review Look #2 Warm Editorial
- [x] Implement and code-review Look #3 Precision Minimal
- [x] Define and implement Look #4 Zen Focus
- [~] Complete Look #4 code-level quality pass
- [ ] Define and implement Look #6 Tactile Household
- [ ] Complete Look #6 code-level quality pass
- [ ] Complete shared Round 1 real-device and accessibility checks
- [ ] Create scorecards and Look #1 baseline materials
- [ ] Hold the mandatory Round 1 selection gate
