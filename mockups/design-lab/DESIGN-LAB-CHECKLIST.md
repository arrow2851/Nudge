# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Purpose:** Compare genuinely different design systems for the same Nudge product before selecting or synthesizing a final visual direction.

This is the persistent source of truth for Design Lab scope, execution order, progress, review gates, and decisions. It should be updated whenever a checklist item changes state or an approved plan adjustment is made.

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

The checklist is intended to anticipate the full Design Lab effort, but it is not immutable. We will **pause before continuing** whenever a proposed change materially affects the experiment, architecture, workload, or comparison fairness.

## Changes that require a full checklist review

- [ ] Adding or removing a shortlisted Look
- [ ] Replacing an aesthetic with a substantially different direction
- [ ] Changing the shared audition screens
- [ ] Changing the shared demo data or scenario definitions in a way that affects comparison fairness
- [ ] Expanding one Look into a full app before Round 1 selection
- [ ] Introducing functionality that Look #1 does not already establish
- [ ] Changing the product hierarchy or core Nudge behavior rather than only its presentation
- [ ] Changing the Design Lab architecture, routing, storage, or deployment approach
- [ ] Moving work out of `feature/design-lab`
- [ ] Merging any experimental work into `main`
- [ ] Discovering a technical limitation that invalidates a planned comparison method
- [ ] Discovering that the checklist omits a major phase or materially underestimates the work
- [ ] Promoting a deferred aesthetic such as Bold Consumer, Dark Ambient, Illustrated Home, or System Dashboard
- [ ] Changing the scoring criteria or selection process after reviews have begun
- [ ] Skipping a review gate or beginning the next round without an explicit decision

## Required pause message

When one of the above occurs, do not quietly patch the checklist and continue. Present a full planning prompt using this structure:

> **Design Lab plan adjustment required**
>
> **What changed:** A clear description of the new information, request, or limitation.
>
> **Why the current checklist no longer fully fits:** The affected assumptions, phases, comparison rules, or deliverables.
>
> **Recommended adjustment:** The proposed additions, removals, reordered work, and any items that should become deferred or rejected.
>
> **Impact:** Effects on completed work, fairness between Looks, branch structure, testing, and expected remaining scope.
>
> **Decision needed:** The specific direction that must be approved before implementation continues.

After approval:

- [ ] Update this checklist first
- [ ] Add a dated entry to the Decision and Plan-Adjustment Log
- [ ] Mark superseded items `[r]` or rewrite them with an explanatory note
- [ ] Reconfirm the next active milestone
- [ ] Resume implementation only after the checklist reflects the new plan

Minor bug fixes, accessibility corrections, copy corrections, and visual refinements that do not change scope may be recorded directly without a full plan review.

---

# 1. Safety boundaries and branch governance

- [x] Create `feature/design-lab` from the latest `main`
- [x] Keep Look #1 under `mockups/prototype/` unchanged
- [x] Create isolated `mockups/design-lab/` directory
- [x] Document the safety boundary in the Design Lab README
- [x] Confirm the branch is ahead of and not behind `main` at initial creation
- [ ] Recheck divergence from `main` before each major review round
- [ ] Decide how updates from `main` will be incorporated if Look #1 functionality changes during the experiment
- [ ] Keep Design Lab commits limited to experimental files unless a plan adjustment approves otherwise
- [ ] Add a branch-specific preview deployment
- [ ] Confirm preview deployment cannot replace the production GitHub Pages site
- [ ] Document preview URL and refresh procedure
- [ ] Add build/version/commit information to the review panel
- [ ] Add a visible `Experimental Design Lab` label in every preview
- [ ] Prevent accidental links that imply an experimental Look is the selected production design
- [ ] Open a draft pull request only when the branch needs centralized review history
- [ ] Do not merge into `main` until the final selection or synthesis decision is documented

---

# 2. Shared Design Lab foundation

## Structure

- [x] Create Design Lab landing page
- [x] Create shared stylesheet
- [x] Create shared JavaScript controller and demo data
- [x] Add README with scope and local-run instructions
- [x] Add this master checklist
- [ ] Split shared data, routing, Look rendering, scenarios, and review controls into maintainable modules if the single file becomes difficult to manage
- [ ] Add `assets/` for shared icons, textures, and illustrations
- [ ] Add `screenshots/` for approved review captures
- [ ] Add `notes/` or a single decision log for feedback summaries
- [ ] Add a simple version number for the Design Lab
- [ ] Add a changelog for meaningful review builds

## Shared behavior

- [x] Support query-string state for Look, screen, and scenario
- [x] Provide desktop review controls
- [x] Provide mobile-accessible review controls
- [x] Reserve selectors for Looks #2, #3, #4, and #6
- [ ] Preserve the current screen when switching Looks
- [ ] Preserve the current scenario when switching Looks
- [ ] Support browser Back and Forward navigation
- [ ] Support direct links to every audition screen and scenario
- [ ] Restore sensible scroll position when switching Looks
- [ ] Add Reset Review State control
- [ ] Keep Design Lab state separate from Look #1 browser state
- [ ] Keep each Look's interactive test state isolated where needed
- [ ] Add corrupted-state fallback
- [ ] Add Not Found or unsupported-route handling

## Comparison fairness

- [x] Use the same base Area and routine data for Look #2
- [ ] Formalize a single shared fixture consumed by every Look
- [ ] Prevent Look-specific data mutations from affecting other Looks
- [ ] Keep wording semantically equivalent across Looks unless tone is the design variable being tested
- [ ] Keep core actions equivalent across Looks
- [ ] Document every intentional placement or interaction difference
- [ ] Avoid giving one Look more complete functionality during the same review round
- [ ] Verify counts, due states, labels, and scenarios match across all active Looks

---

# 3. Shared audition content

## Round 1 screens

Every shortlisted aesthetic must initially demonstrate the same product moments:

- [x] Areas overview shell available
- [x] Area detail available for Look #2
- [x] Intervention screen available for Look #2
- [ ] Finalize the exact Round 1 screen set as:
  - [ ] Areas overview
  - [ ] One representative Area detail, preferably Kitchen
  - [ ] Intervention screen
- [ ] Decide whether Area detail remains a scored screen or only a supporting interaction
- [ ] Keep Round 1 limited to visual-aesthetic validation rather than full app completion

## Shared scenarios

- [x] Normal Day scenario
- [x] Heavy Backlog scenario
- [x] New User scenario
- [x] All Clear scenario
- [ ] Add Large Household scenario
- [ ] Add Long Content scenario
- [ ] Add Large Text scenario
- [ ] Add Dark Environment scenario only if it can be tested fairly without turning every Look into a dark theme
- [ ] Define exact expected counts and item states for every scenario
- [ ] Document why each scenario exists and what weakness it is intended to expose

## Shared product data

- [x] Kitchen with overdue and due routines
- [x] Bathroom with upcoming routines
- [x] Living Room with a due-today routine
- [x] Bedroom with an unconfigured section
- [x] Car with maintenance routines
- [ ] Add at least one long Area name
- [ ] Add at least one long Chore name
- [ ] Add at least one Area with many Sections
- [ ] Add at least one Section with many routines
- [ ] Add Work or Personal content to ensure the aesthetic is not exclusively household-coded
- [ ] Confirm the same data supports every selected Look without aesthetic-specific exceptions

---

# 4. Look #1 reference baseline

Look #1 remains the approved functional baseline and is not rebuilt inside the Design Lab unless needed for synchronized comparison.

- [ ] Document the Look #1 visual principles in a concise reference sheet
- [ ] Capture Look #1 Areas overview screenshot using the shared scenario
- [ ] Capture Look #1 Area detail screenshot using the shared scenario
- [ ] Capture or mock the Look #1 intervention treatment using identical content
- [ ] Record strengths of Look #1
- [ ] Record weaknesses or open nitpicks without fixing them during Round 1
- [ ] Decide whether Design Lab comparison mode embeds Look #1 or links to it separately
- [ ] Ensure Look #1 remains a valid selectable reference during final scoring

---

# 5. Look #2 — Warm Editorial

## Direction definition

- [x] Name the direction `Warm Editorial`
- [x] Establish warm ivory, charcoal, olive, and terracotta palette
- [x] Use serif display typography with clean sans-serif supporting text
- [x] Use editorial labels, rules, and restrained card treatment
- [x] Define the emotional target as calm, thoughtful, and household-journal-like
- [ ] Document design principles and anti-patterns
- [ ] Define how the direction supports Home, Car, Personal, and Work
- [ ] Define icon style
- [ ] Define motion and completion-feedback style
- [ ] Define sheet, form, and destructive-action styling for later rounds

## Round 1 implementation

- [x] Implement Areas overview
- [x] Implement Area detail
- [x] Implement Intervention screen
- [x] Support Normal, Backlog, New User, and All Clear scenarios
- [x] Support route switching between audition screens
- [ ] Complete Large Household scenario
- [ ] Complete Long Content scenario
- [ ] Verify all states on a phone-width viewport
- [ ] Verify intervention remains clear and actionable
- [ ] Verify typography does not reduce information density excessively
- [ ] Verify Work and Personal content does not feel out of place
- [ ] Resolve only blocking visual or interaction issues before Round 1 review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the Design Lab rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark as finalist, revise, hold, or reject

---

# 6. Look #3 — Precision Minimal

## Direction definition

- [ ] Confirm visual principles: strict grid, compact density, minimal ornament, one sharp accent
- [ ] Define palette and light/dark assumptions
- [ ] Define sans-serif and monospaced typography roles
- [ ] Define border, radius, and spacing system
- [ ] Define navigation treatment
- [ ] Define status and urgency treatment
- [ ] Define intervention tone so it does not feel punitive or corporate
- [ ] Document anti-patterns and accessibility concerns

## Round 1 implementation

- [ ] Implement Areas overview using the shared fixture
- [ ] Implement representative Area detail
- [ ] Implement Intervention screen
- [ ] Implement all shared scenarios
- [ ] Preserve shared route and scenario behavior
- [ ] Verify dense data remains readable
- [ ] Verify empty and all-clear states do not feel unfinished
- [ ] Verify the intervention remains humane
- [ ] Resolve only blocking issues before Round 1 review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark as finalist, revise, hold, or reject

---

# 7. Look #4 — Zen Focus

## Direction definition

- [ ] Confirm visual principles: large calm spaces, one dominant action, progressive disclosure
- [ ] Define soft neutral palette and restrained urgency colors
- [ ] Define typography and spacing system
- [ ] Define how hidden secondary information is revealed
- [ ] Define compact-density fallback for large data
- [ ] Define intervention treatment centered on a gentle useful pause
- [ ] Document anti-patterns, especially excessive emptiness or hidden status

## Round 1 implementation

- [ ] Implement Areas overview using the shared fixture
- [ ] Implement representative Area detail
- [ ] Implement Intervention screen
- [ ] Implement all shared scenarios
- [ ] Verify the Heavy Backlog state remains usable
- [ ] Verify Large Household and Long Content do not collapse the calm aesthetic
- [ ] Verify users can still quickly identify everything requiring attention
- [ ] Resolve only blocking issues before Round 1 review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark as finalist, revise, hold, or reject

---

# 8. Look #6 — Tactile Household

## Direction definition

- [ ] Confirm visual principles: physical labels, controls, index-card organization, satisfying tactile cues
- [ ] Define palette and material references
- [ ] Define typography without sacrificing readability
- [ ] Define checkbox, switch, stamp, and completion treatments
- [ ] Define how the aesthetic expands beyond household chores to Car, Personal, and Work
- [ ] Define intervention treatment without novelty becoming distracting
- [ ] Document anti-patterns, especially fake skeuomorphism and excessive decoration

## Round 1 implementation

- [ ] Implement Areas overview using the shared fixture
- [ ] Implement representative Area detail
- [ ] Implement Intervention screen
- [ ] Implement all shared scenarios
- [ ] Verify tactile controls remain accessible and understandable
- [ ] Verify the aesthetic scales to dense lists
- [ ] Verify decorative surfaces do not reduce performance or readability
- [ ] Resolve only blocking issues before Round 1 review

## Round 1 review

- [ ] Capture canonical screenshots
- [ ] Score against the shared rubric
- [ ] Record strongest element
- [ ] Record biggest weakness
- [ ] Record components worth borrowing
- [ ] Mark as finalist, revise, hold, or reject

---

# 9. Deferred aesthetic directions

These are documented but should not be implemented unless promoted through the full plan-adjustment process.

- [d] Look #5 — Bold Modern Consumer
- [d] Look #7 — Dark Ambient as a standalone system
- [d] Look #8 — Friendly Illustrated Home
- [d] Look #9 — System Dashboard
- [d] Dark variants of finalist Looks
- [d] Additional aesthetic concepts discovered during review

For each deferred direction that is later promoted:

- [ ] Explain which current shortlist gap it fills
- [ ] Explain why existing Looks cannot answer the same design question
- [ ] Update total Round 1 scope and review schedule
- [ ] Add equivalent implementation and scoring tasks before work begins

---

# 10. Review rubric and feedback capture

## Shared scoring categories

Score each Look from 1–5 using the same definitions:

- [ ] Clarity — Can the user immediately identify what needs attention?
- [ ] Calmness — Does the interface feel supportive rather than stressful?
- [ ] Speed — Can a user complete or start an action quickly?
- [ ] Personality — Is the product visually memorable and coherent?
- [ ] Density — Is enough information visible without crowding?
- [ ] Scalability — Can it support many Areas, Sections, and routines?
- [ ] Intervention suitability — Does the interruption feel appropriate?
- [ ] Accessibility — Are text, controls, states, and contrast understandable?
- [ ] Versatility — Does it suit Home, Car, Personal, and Work?
- [ ] Daily preference — Would the reviewer willingly use it every day?

## Feedback format

For each Look record:

- [ ] Numeric score by category
- [ ] Best feature
- [ ] Biggest problem
- [ ] Most confusing element
- [ ] Most distinctive element
- [ ] Component or pattern worth borrowing
- [ ] Scenario where the Look performs best
- [ ] Scenario where the Look performs worst
- [ ] Final Round 1 recommendation

## Review tooling

- [ ] Add scorecard to the desktop review panel or create a linked Markdown scorecard
- [ ] Add notes field or documented review workflow
- [ ] Allow exporting or copying scores
- [ ] Keep review data separate from app demo state
- [ ] Add Reset Scores control with confirmation
- [ ] Prevent early scores from being lost when another Look is opened

---

# 11. Round 1 quality checks

## Responsive and device checks

- [ ] 360 px-wide phone
- [ ] 390 px-wide phone
- [ ] 412 px-wide phone
- [ ] Tall Android viewport
- [ ] Short viewport with keyboard-like vertical constraint
- [ ] Desktop review panel
- [ ] Mobile review selector
- [ ] Portrait orientation
- [ ] Landscape smoke test

## Accessibility checks

- [ ] Touch targets are at least approximately 44–48 px where practical
- [ ] Color is not the only status indicator
- [ ] Text contrast review
- [ ] Visible keyboard focus states
- [ ] Logical tab order
- [ ] Screen-reader labels for meaningful controls
- [ ] Large text does not hide critical actions
- [ ] Reduced-motion fallback for animations
- [ ] Intervention actions remain unambiguous

## Content and stress checks

- [ ] Long Area names
- [ ] Long Section names
- [ ] Long Chore names
- [ ] Zero items
- [ ] One item
- [ ] Many items
- [ ] Multiple overdue counts
- [ ] All clear
- [ ] Unconfigured Area or Section
- [ ] Work/Personal content
- [ ] Extremely dense backlog

## Technical checks

- [ ] HTML validation
- [ ] CSS syntax check
- [ ] JavaScript syntax check
- [ ] No console errors during core flows
- [ ] Query routes load directly
- [ ] Browser Back works
- [ ] No dependency on production Look #1 state
- [ ] No accidental writes outside the Design Lab directory

---

# 12. Round 1 selection gate

Do not begin full vertical-slice expansion until this gate is complete.

- [ ] Every shortlisted Look has equivalent Round 1 screens
- [ ] Every shortlisted Look supports the same required scenarios
- [ ] Quality checks are complete or known limitations are documented
- [ ] Each Look has a completed scorecard
- [ ] Look #1 has been scored as the baseline
- [ ] Review findings have been summarized
- [ ] Select approximately two or three finalists
- [ ] Explicitly mark non-finalists as hold, reject, or source-of-components-only
- [ ] Decide whether any finalist needs one focused revision before Round 2
- [ ] Decide whether the final product may synthesize components from multiple Looks
- [ ] Update this checklist based on the selected finalists
- [ ] Add a dated decision-log entry

This gate is itself a mandatory plan-review point because the number and identity of Round 2 Looks cannot be finalized in advance.

---

# 13. Round 2 — Interactive vertical slices

The exact finalist Looks will be inserted after the Round 1 selection gate.

## Shared Round 2 journey

Each finalist must support the same end-to-end journey:

- [ ] Open Today
- [ ] Open Areas
- [ ] Open Kitchen
- [ ] Open Appliances or another representative Section
- [ ] Open Chore details
- [ ] Complete a graded Chore
- [ ] Select Light, Moderate, or Deep
- [ ] Add a new Chore
- [ ] Open the Tasks checklist
- [ ] Add, edit, complete, reopen, reorder, and indent a Task
- [ ] Open a reusable List
- [ ] Add, edit, complete, reopen, reorder, and indent a List item
- [ ] Trigger a simulated intervention
- [ ] Start the suggested action
- [ ] Request a different action
- [ ] Choose Not Now

## Shared functionality rules

- [ ] Preserve Look #1 product boundaries
- [ ] Areas contains recurring Chores and maintenance only
- [ ] One-time Tasks stay in Tasks
- [ ] Lists preserve remembered-item suggestions
- [ ] Completion rules match the approved prototype
- [ ] Recurrence and graded-completion behavior match the approved prototype
- [ ] Same shared data fixture across finalists
- [ ] Same supported actions across finalists
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
- [ ] Motion style
- [ ] Intervention wording tone within equivalent meaning

Every meaningful interaction divergence must be documented so it can be evaluated rather than mistaken for missing functionality.

---

# 14. Round 2 comparison mode

- [ ] Implement side-by-side desktop previews
- [ ] Synchronize routes between previews
- [ ] Synchronize scenarios between previews
- [ ] Optionally synchronize selected test action without sharing mutable state
- [ ] Allow Look #1 versus finalist comparison
- [ ] Allow finalist versus finalist comparison
- [ ] Add single-phone toggle comparison on mobile
- [ ] Preserve the current route when switching Looks
- [ ] Add screenshot-friendly presentation mode
- [ ] Add labels that clearly identify each Look
- [ ] Verify the comparison shell does not distort mobile dimensions

---

# 15. Round 2 usability and preference review

- [ ] Complete the shared vertical-slice journey in every finalist
- [ ] Time key actions where useful
- [ ] Record mis-taps or navigation confusion
- [ ] Review on an actual phone
- [ ] Test Normal Day
- [ ] Test Heavy Backlog
- [ ] Test New User
- [ ] Test All Clear
- [ ] Test Large Household
- [ ] Test Long Content
- [ ] Test Large Text
- [ ] Score every finalist again
- [ ] Record which aesthetic is preferred initially
- [ ] Record which aesthetic is preferred after repeated use
- [ ] Identify fatigue, clutter, hidden information, or overly decorative behavior
- [ ] Identify the best intervention treatment
- [ ] Identify the best dense checklist treatment
- [ ] Identify the best Areas treatment
- [ ] Identify the best creation and editing treatment

---

# 16. Synthesis exploration

This phase occurs only if review evidence supports combining systems.

- [ ] Decide whether one finalist is strong enough without synthesis
- [ ] Identify transferable components rather than mixing aesthetics indiscriminately
- [ ] Create a proposed synthesis specification
- [ ] Define the dominant visual system
- [ ] Define which borrowed components are exceptions
- [ ] Confirm typography, palette, spacing, and motion remain coherent
- [ ] Build only the key comparison screens first
- [ ] Compare synthesis against the strongest pure finalist
- [ ] Reject synthesis if it weakens identity or consistency
- [ ] Document the decision

Potential combinations to evaluate only if supported by evidence:

- [d] Warm Editorial typography with Precision Minimal list density
- [d] Zen intervention treatment with another Look's organizer screens
- [d] Tactile completion controls within a restrained broader system
- [d] A finalist's light design with a later Dark Ambient theme

---

# 17. Final selection gate

- [ ] All finalists or synthesis candidates have equivalent functionality
- [ ] Phone review is complete
- [ ] Accessibility review is complete enough for selection
- [ ] Review scores and qualitative notes are complete
- [ ] The selected direction works for Home, Car, Personal, and Work
- [ ] The selected intervention treatment feels supportive
- [ ] The selected system scales to both empty and dense states
- [ ] Identify any remaining design nitpicks that do not block selection
- [ ] Select one visual foundation
- [ ] Decide whether Look #1 remains the production baseline until Android work or whether selected design work should be ported back
- [ ] Document selected, rejected, and borrowed directions
- [ ] Add dated final decision-log entry
- [ ] Define exactly what will and will not be merged into `main`
- [ ] Create a migration plan rather than directly replacing Look #1 ad hoc

---

# 18. Branch closeout and preservation

- [ ] Preserve canonical screenshots for every completed Look
- [ ] Preserve scorecards and decision notes
- [ ] Mark rejected Looks clearly without deleting their history
- [ ] Remove abandoned temporary code only after screenshots and notes are saved
- [ ] Update Design Lab README with final outcome
- [ ] Update main project documentation only after an approved merge plan
- [ ] Create a focused pull request for selected reusable infrastructure, if any
- [ ] Create a separate focused pull request for any selected visual direction port
- [ ] Confirm `main` remains stable
- [ ] Tag or otherwise preserve the final Design Lab branch state
- [ ] Decide whether the branch remains open for future aesthetic exploration

---

# 19. Decision and plan-adjustment log

## 2026-08-01 — Design Lab branch and initial shortlist

**Decision:** Create `feature/design-lab` and preserve Look #1 on `main`.  
**Shortlist:** Warm Editorial, Precision Minimal, Zen Focus, and Tactile Household.  
**Round 1 focus:** Areas overview, representative Area detail, and Intervention using shared scenarios.  
**Current active Look:** Look #2 — Warm Editorial.

## Future entries

Add each entry using:

```text
## YYYY-MM-DD — Decision title

Reason:
Decision:
Checklist changes:
Impact on completed work:
Next active milestone:
```

---

# 20. Current next actions

- [~] Finish the Round 1 foundation and shared-fixture rules
- [~] Finish Look #2 Warm Editorial stress states and review readiness
- [ ] Implement Look #3 Precision Minimal audition
- [ ] Implement Look #4 Zen Focus audition
- [ ] Implement Look #6 Tactile Household audition
- [ ] Complete Round 1 quality checks
- [ ] Score Look #1 and all shortlisted Looks
- [ ] Hold the Round 1 selection gate before any full-app expansion
