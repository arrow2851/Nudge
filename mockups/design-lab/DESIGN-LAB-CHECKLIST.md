# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current Design Lab version:** `0.2.0`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final visual direction.

This is the persistent source of truth for Design Lab scope, execution order, progress, review gates, and decisions. Update it whenever an item changes state or an approved plan adjustment is made.

---

## Status legend

- `[x]` Completed and verified
- `[~]` In progress or partially implemented
- `[ ]` Not started
- `[!]` Requires review or a decision
- `[b]` Blocked
- `[d]` Deferred unless promoted through plan adjustment
- `[r]` Rejected or retired, retained for history

---

# 0. Change-control agreement

The checklist is intended to anticipate the complete Design Lab effort, but it is not immutable. Pause before continuing whenever a proposed change materially affects the experiment, architecture, workload, shortlist, or comparison fairness.

## Changes requiring a hard stop and full checklist review

- [ ] Add or remove a shortlisted Look
- [ ] Replace an aesthetic with a substantially different direction
- [ ] Change the shared Round 1 screen set
- [ ] Change shared scenario meaning after reviews begin
- [ ] Expand one Look into a full app before Round 1 selection
- [ ] Introduce functionality not established by Look #1
- [ ] Change the core Nudge product hierarchy or behavior
- [ ] Change routing, storage, deployment, or branch architecture materially
- [ ] Move experimental work outside `feature/design-lab`
- [ ] Merge experimental work into `main`
- [ ] Promote a deferred aesthetic
- [ ] Change scoring criteria after reviews begin
- [ ] Skip a review gate
- [ ] Discover a limitation that invalidates the planned comparison method
- [ ] Discover a missing major phase or material scope underestimate

## One-line hard-stop response

When a decision is required, respond only:

> **Hard stop: review the Design Lab decision required before I continue.**

Then provide the full plan-adjustment explanation only after the user opens or asks for the decision.

## Full plan-adjustment format

> **Design Lab plan adjustment required**
>
> **What changed:**  
> **Why the current checklist no longer fits:**  
> **Recommended adjustment:**  
> **Impact:**  
> **Decision needed:**

After approval:

- [ ] Update this checklist first
- [ ] Add a dated entry to `DECISIONS.md`
- [ ] Mark superseded items `[r]` or rewrite with an explanatory note
- [ ] Reconfirm the next active milestone
- [ ] Resume implementation only after the plan is reflected here

Minor bug fixes, accessibility corrections, copy corrections, and visual refinements that do not change scope may proceed without a hard stop.

---

# 1. Safety boundaries and branch governance

- [x] Create `feature/design-lab` from the latest `main`
- [x] Keep Look #1 under `mockups/prototype/` unchanged
- [x] Create isolated `mockups/design-lab/`
- [x] Document the safety boundary
- [x] Confirm the branch started ahead of and not behind `main`
- [x] Keep current Design Lab commits limited to experimental files
- [ ] Recheck divergence from `main` before every major review round
- [ ] Define how later Look #1 functionality updates are incorporated
- [ ] Add a branch-specific preview deployment
- [ ] Confirm the preview cannot replace production GitHub Pages
- [ ] Document preview URL and refresh procedure
- [x] Add version and build-date information to the review panel
- [x] Add a visible `Experimental Design Lab` label on desktop and mobile
- [x] Avoid links or wording implying an experimental Look is selected
- [ ] Open a draft PR only when centralized review history is useful
- [ ] Do not merge until final selection or synthesis is documented

---

# 2. Shared Design Lab foundation

## Structure and documentation

- [x] Create Design Lab landing page
- [x] Create shared stylesheet
- [x] Create shared controller and fixture
- [x] Add README and local-run instructions
- [x] Add this master checklist
- [x] Add `SCENARIOS.md`
- [x] Add `DECISIONS.md`
- [x] Add `CHANGELOG.md`
- [x] Add Look #2 direction document
- [x] Add Design Lab version `0.2.0`
- [ ] Split the controller into data, routing, renderers, and controls before Look #3 if maintainability requires it
- [ ] Add `assets/` when shared icons, textures, or illustrations are introduced
- [ ] Add `screenshots/` when canonical review captures begin
- [ ] Add per-Look scorecards or a shared scorecard file

## Shared behavior

- [x] Support query-string state for Look, screen, scenario, and Area
- [x] Provide desktop review controls
- [x] Provide mobile review controls
- [x] Reserve Looks #2, #3, #4, and #6
- [x] Preserve the current screen when switching Looks
- [x] Preserve the current scenario when switching Looks
- [x] Support browser Back and Forward
- [x] Support direct links to Areas, Area detail, and Intervention
- [x] Reset scroll to a sensible top position after route changes
- [x] Add Reset Review State
- [x] Keep Design Lab state separate from Look #1
- [x] Clone scenario state before rendering to isolate Looks
- [x] Add invalid-value and unsupported-route fallback
- [ ] Add route-level automated smoke checks
- [ ] Add optional screenshot-friendly presentation mode

## Comparison fairness

- [x] Formalize one shared fixture for every Look
- [x] Prevent Look-specific fixture mutation
- [x] Document equivalent product meaning and allowed tone variation
- [x] Keep Round 1 actions simulated for every Look
- [x] Document Look #2 intentional placement differences
- [x] Avoid giving Look #2 additional Round 1 functionality
- [ ] Verify counts and labels programmatically
- [ ] Verify every implemented Look consumes all scenarios
- [ ] Document every later Look's intentional interaction differences

---

# 3. Shared Round 1 audition content

## Required screens

- [x] Finalize Round 1 as:
  - [x] Areas overview
  - [x] Representative Area detail, normally Kitchen
  - [x] Intervention
- [x] Treat Area detail as a scored screen
- [x] Keep Round 1 limited to visual-aesthetic validation

## Required scenarios

- [x] Normal Day
- [x] Heavy Backlog
- [x] New User
- [x] All Clear
- [x] Large Household
- [x] Long Content
- [x] Large Text
- [d] Dark Environment unless later testing shows it can be fair without turning each Look into a dark-theme project
- [x] Define scenario purposes
- [x] Define expected counts and states
- [x] Document fairness rules

## Shared product data coverage

- [x] Kitchen with overdue and due-today routines
- [x] Bathroom with upcoming and backlog states
- [x] Living Room with a due-today routine
- [x] Bedroom with an unconfigured Section
- [x] Car maintenance
- [x] Long Area name
- [x] Long Section name
- [x] Long Chore name
- [x] Area with many Sections
- [x] Area with many routines
- [x] Work content
- [x] Personal content
- [ ] Confirm the fixture needs no aesthetic-specific exception after all four Looks exist

---

# 4. Look #1 reference baseline

Look #1 remains the approved functional baseline and is not rebuilt inside the Design Lab unless required for synchronized comparison.

- [ ] Write a concise Look #1 visual-principles reference
- [ ] Capture Look #1 Areas overview using the shared Normal Day content
- [ ] Capture Look #1 Area detail using the shared content
- [ ] Capture or mock Look #1 Intervention with identical content
- [ ] Record Look #1 strengths
- [ ] Record Look #1 weaknesses and open nitpicks without fixing them
- [ ] Decide whether comparison mode embeds Look #1 or links separately
- [ ] Ensure Look #1 is scored as the baseline

---

# 5. Look #2 — Warm Editorial

## Direction definition

- [x] Name the direction `Warm Editorial`
- [x] Establish warm ivory, charcoal-green, olive, terracotta, and mustard roles
- [x] Use serif display typography with sans-serif body text
- [x] Use editorial labels, rules, and restrained cards
- [x] Define the emotional target as calm, thoughtful, and practical
- [x] Document design principles
- [x] Document anti-patterns
- [x] Define Home, Car, Personal, and Work support
- [x] Define icon intent
- [x] Define motion and completion-feedback intent
- [x] Define later sheet, form, and destructive-action styling

## Round 1 implementation

- [x] Implement Areas overview
- [x] Implement Area detail
- [x] Implement Intervention
- [x] Support Normal Day
- [x] Support Heavy Backlog
- [x] Support New User
- [x] Support All Clear
- [x] Support Large Household
- [x] Support Long Content
- [x] Support Large Text
- [x] Support direct route switching
- [~] Verify all states at phone widths
- [~] Verify Intervention remains clear and actionable
- [~] Verify editorial typography retains practical density
- [~] Verify Work and Personal do not feel visually out of place
- [ ] Resolve only blocking issues before review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark finalist, revise, hold, or reject

---

# 6. Look #3 — Precision Minimal

## Direction definition

- [ ] Confirm strict grid, compact density, minimal ornament, and one sharp accent
- [ ] Define palette and light/dark assumptions
- [ ] Define sans-serif and monospaced typography roles
- [ ] Define border, radius, and spacing system
- [ ] Define navigation treatment
- [ ] Define status and urgency treatment
- [ ] Define a humane, non-corporate Intervention tone
- [ ] Document anti-patterns and accessibility concerns

## Round 1 implementation

- [ ] Implement Areas overview with the shared fixture
- [ ] Implement representative Area detail
- [ ] Implement Intervention
- [ ] Implement all shared scenarios
- [ ] Preserve shared route and scenario behavior
- [ ] Verify dense data remains readable
- [ ] Verify empty and all-clear states feel intentional
- [ ] Verify the Intervention remains humane
- [ ] Resolve only blocking issues before review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark finalist, revise, hold, or reject

---

# 7. Look #4 — Zen Focus

## Direction definition

- [ ] Confirm large calm spaces, one dominant action, and progressive disclosure
- [ ] Define soft neutral palette and restrained urgency colors
- [ ] Define typography and spacing
- [ ] Define how secondary information is revealed
- [ ] Define a compact-density fallback
- [ ] Define the gentle useful-pause Intervention
- [ ] Document anti-patterns, especially hidden status and excessive emptiness

## Round 1 implementation

- [ ] Implement Areas overview
- [ ] Implement representative Area detail
- [ ] Implement Intervention
- [ ] Implement all shared scenarios
- [ ] Verify Heavy Backlog remains usable
- [ ] Verify Large Household and Long Content preserve clarity
- [ ] Verify attention remains quickly discoverable
- [ ] Resolve only blocking issues before review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark finalist, revise, hold, or reject

---

# 8. Look #6 — Tactile Household

## Direction definition

- [ ] Confirm physical labels, controls, index-card organization, and tactile cues
- [ ] Define palette and material references
- [ ] Define readable typography
- [ ] Define checkbox, switch, stamp, and completion treatments
- [ ] Define support beyond household content
- [ ] Define an Intervention where novelty is not distracting
- [ ] Document anti-patterns, especially fake skeuomorphism and excessive decoration

## Round 1 implementation

- [ ] Implement Areas overview
- [ ] Implement representative Area detail
- [ ] Implement Intervention
- [ ] Implement all shared scenarios
- [ ] Verify tactile controls remain accessible
- [ ] Verify dense lists scale
- [ ] Verify decorative surfaces do not reduce readability
- [ ] Resolve only blocking issues before review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark finalist, revise, hold, or reject

---

# 9. Deferred aesthetic directions

These remain documented but unimplemented unless promoted through the full plan-adjustment process.

- [d] Look #5 — Bold Modern Consumer
- [d] Look #7 — Dark Ambient as a standalone system
- [d] Look #8 — Friendly Illustrated Home
- [d] Look #9 — System Dashboard
- [d] Dark variants of finalist Looks
- [d] Additional aesthetics discovered during review

For any promoted direction:

- [ ] Explain the shortlist gap it fills
- [ ] Explain why an existing Look cannot answer the same question
- [ ] Update Round 1 scope
- [ ] Add equivalent implementation and scoring items before work

---

# 10. Review rubric and feedback capture

## Shared 1–5 scoring categories

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

## Per-Look feedback

- [ ] Numeric score by category
- [ ] Best feature
- [ ] Biggest problem
- [ ] Most confusing element
- [ ] Most distinctive element
- [ ] Component worth borrowing
- [ ] Best-performing scenario
- [ ] Worst-performing scenario
- [ ] Final Round 1 recommendation

## Review tooling

- [ ] Add a Markdown or in-app scorecard
- [ ] Add a documented notes workflow
- [ ] Allow copying or exporting scores
- [ ] Keep scores separate from demo state
- [ ] Add Reset Scores confirmation if scores are stored in-app
- [ ] Preserve scores when switching Looks

---

# 11. Round 1 quality checks

## Responsive and device

- [ ] 360 px phone
- [ ] 390 px phone
- [ ] 412 px phone
- [ ] Tall Android viewport
- [ ] Short constrained viewport
- [ ] Desktop review panel
- [ ] Mobile review selector
- [ ] Portrait
- [ ] Landscape smoke test

## Accessibility

- [~] Visible keyboard focus treatment
- [ ] Approximate 44–48 px touch targets
- [ ] Color is not the only status indicator
- [ ] Contrast review
- [ ] Logical tab order
- [ ] Screen-reader labels
- [~] Large Text scenario
- [ ] Reduced-motion fallback
- [ ] Intervention actions remain unambiguous

## Content and stress

- [x] Long Area names available
- [x] Long Section names available
- [x] Long Chore names available
- [x] Zero items available
- [x] One and few-item states available
- [x] Many-item state available
- [x] Multiple overdue counts available
- [x] All Clear available
- [x] Unconfigured Section available
- [x] Work and Personal content available
- [x] Dense backlog available
- [ ] Visually verify each case in every Look

## Technical

- [ ] HTML validation
- [ ] CSS syntax check
- [x] JavaScript syntax check for shared controller
- [ ] No console errors during core flows
- [ ] Query routes load directly in a browser
- [ ] Browser Back verified in a browser
- [x] No dependency on Look #1 state
- [x] No writes outside Design Lab during this batch

---

# 12. Round 1 selection gate

Do not begin full vertical-slice expansion until this gate is complete.

- [ ] Every shortlisted Look has equivalent screens
- [ ] Every shortlisted Look supports every required scenario
- [ ] Quality checks are complete or limitations documented
- [ ] Every Look has a scorecard
- [ ] Look #1 is scored
- [ ] Findings are summarized
- [ ] Select approximately two or three finalists
- [ ] Mark non-finalists hold, reject, or components-only
- [ ] Decide whether a finalist needs one focused revision
- [ ] Decide whether synthesis remains allowed
- [ ] Update this checklist based on finalists
- [ ] Add a dated decision entry

This gate is a mandatory hard stop because Round 2 participants cannot be finalized in advance.

---

# 13. Round 2 — Interactive vertical slices

The exact finalist Looks will be inserted after the Round 1 gate.

## Shared journey

- [ ] Open Today
- [ ] Open Areas
- [ ] Open Kitchen
- [ ] Open a representative Section
- [ ] Open Chore details
- [ ] Complete a graded Chore
- [ ] Select Light, Moderate, or Deep
- [ ] Add a Chore
- [ ] Open Tasks
- [ ] Add, edit, complete, reopen, reorder, and indent a Task
- [ ] Open a reusable List
- [ ] Add, edit, complete, reopen, reorder, and indent a List item
- [ ] Trigger a simulated Intervention
- [ ] Start the suggestion
- [ ] Request a different action
- [ ] Choose Not Now

## Shared functionality rules

- [ ] Preserve Look #1 product boundaries
- [ ] Areas contains recurring Chores and maintenance only
- [ ] One-time Tasks remain in Tasks
- [ ] Lists preserve remembered suggestions
- [ ] Completion rules match Look #1
- [ ] Recurrence and graded completion match Look #1
- [ ] Same fixture across finalists
- [ ] Same actions across finalists
- [ ] Same error and empty states across finalists

## Look-specific freedom

Finalists may vary:

- [ ] Navigation presentation
- [ ] Header placement
- [ ] Cards versus flat rows
- [ ] Density and spacing
- [ ] Add-action placement
- [ ] Sheet versus full-page editing
- [ ] Typography and icons
- [ ] Completion feedback
- [ ] Motion
- [ ] Intervention tone with equivalent meaning

Every meaningful divergence must be documented.

---

# 14. Round 2 comparison mode

- [ ] Side-by-side desktop previews
- [ ] Synchronized routes
- [ ] Synchronized scenarios
- [ ] Optional synchronized test action without shared mutable state
- [ ] Look #1 versus finalist
- [ ] Finalist versus finalist
- [ ] Single-phone toggle on mobile
- [ ] Preserve route when switching Looks
- [ ] Screenshot-friendly mode
- [ ] Clear Look labels
- [ ] Preserve true phone dimensions

---

# 15. Round 2 usability and preference review

- [ ] Complete the shared journey in every finalist
- [ ] Time key actions where useful
- [ ] Record mis-taps and navigation confusion
- [ ] Review on an actual phone
- [ ] Test all seven scenarios
- [ ] Score finalists again
- [ ] Record initial preference
- [ ] Record preference after repeated use
- [ ] Identify fatigue, clutter, hidden information, or excessive decoration
- [ ] Identify best Intervention
- [ ] Identify best dense checklist
- [ ] Identify best Areas treatment
- [ ] Identify best creation and editing treatment

---

# 16. Synthesis exploration

This phase occurs only when review evidence supports combining systems.

- [ ] Decide whether one finalist is strong enough without synthesis
- [ ] Identify transferable components
- [ ] Define a dominant visual system
- [ ] Define borrowed exceptions
- [ ] Confirm coherent typography, palette, spacing, and motion
- [ ] Build key comparison screens first
- [ ] Compare synthesis against the strongest pure finalist
- [ ] Reject synthesis if identity or consistency weakens
- [ ] Document the decision

Potential combinations, only if evidence supports them:

- [d] Warm Editorial typography with Precision Minimal density
- [d] Zen Intervention with another organizer system
- [d] Tactile completion controls in a restrained system
- [d] A later Dark Ambient theme for the selected Look

---

# 17. Final selection gate

- [ ] Equivalent functionality across finalists or synthesis candidates
- [ ] Phone review complete
- [ ] Accessibility review sufficient for selection
- [ ] Scores and notes complete
- [ ] Works for Home, Car, Personal, and Work
- [ ] Intervention feels supportive
- [ ] Empty and dense states both scale
- [ ] Remaining nonblocking nitpicks identified
- [ ] Select one visual foundation
- [ ] Decide whether Look #1 remains production baseline until Android work
- [ ] Document selected, rejected, and borrowed directions
- [ ] Add dated final decision entry
- [ ] Define what will and will not merge
- [ ] Create a migration plan rather than replacing Look #1 ad hoc

---

# 18. Branch closeout and preservation

- [ ] Preserve canonical screenshots for every completed Look
- [ ] Preserve scorecards and decisions
- [ ] Mark rejected Looks without deleting history
- [ ] Remove abandoned temporary code only after preservation
- [ ] Update README with final outcome
- [ ] Update main project documentation only after an approved merge plan
- [ ] Create focused PRs for reusable infrastructure and selected visual work
- [ ] Confirm `main` remains stable
- [ ] Tag or preserve the final branch state
- [ ] Decide whether the branch remains open for future exploration

---

# 19. Decision and plan-adjustment log

The detailed log lives in [`DECISIONS.md`](DECISIONS.md).

## 2026-08-01 — Initial Design Lab direction

- [x] Preserve Look #1 on `main`
- [x] Create `feature/design-lab`
- [x] Shortlist Looks #2, #3, #4, and #6
- [x] Define Round 1 screens
- [x] Make Look #2 the first active audition

## 2026-08-01 — Shared fixture foundation v0.2

- [x] Add Large Household, Long Content, and Large Text
- [x] Add direct Area routes and browser history
- [x] Add reset and route fallbacks
- [x] Document fairness, scenarios, and Look #2 principles
- [x] Keep all changes within `mockups/design-lab/`

---

# 20. Current next actions

- [x] Finish Round 1 shared-fixture rules
- [x] Finish Look #2 stress-scenario implementation
- [~] Complete Look #2 responsive, accessibility, and blocking-quality checks
- [ ] Split shared controller before Look #3 if needed
- [ ] Define Look #3 Precision Minimal
- [ ] Implement Look #3 audition
- [ ] Implement Look #4 audition
- [ ] Implement Look #6 audition
- [ ] Complete Round 1 quality checks
- [ ] Score Look #1 and all shortlisted Looks
- [ ] Hold the Round 1 selection gate before full-app expansion
