# Nudge Design Lab — Master Execution Checklist

**Branch:** `feature/design-lab`  
**Protected baseline:** Look #1 in `mockups/prototype/` on `main`  
**Design Lab path:** `mockups/design-lab/`  
**Current version:** `0.7.0`  
**Purpose:** Compare genuinely different visual systems for the same Nudge product before selecting or synthesizing a final direction.

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

A hard stop is required before changing:

- [ ] The shortlisted Looks
- [ ] The three shared Round 1 screens
- [ ] Shared scenario meaning or comparison fairness
- [ ] Core Nudge hierarchy or behavior
- [ ] Branch, routing, storage, or deployment architecture materially
- [ ] Scoring criteria after scoring begins
- [ ] Review gates or Round 2 participants
- [ ] Any merge into `main`
- [ ] Promotion of a deferred aesthetic
- [ ] A major omitted phase or newly discovered technical limitation

Required one-line response:

> **Hard stop: review the Design Lab decision required before I continue.**

After approval, update this checklist and `DECISIONS.md` before implementation resumes. Minor bugs, accessibility fixes, copy changes, test infrastructure, capture tooling, and visual refinements may proceed without a hard stop.

---

# 1. Safety boundaries and branch governance

- [x] Create `feature/design-lab` from `main`
- [x] Keep Look #1 unchanged on `main`
- [x] Keep experimental files under `mockups/design-lab/`
- [x] Add visible Experimental Design Lab and build labels
- [x] Keep Design Lab state separate from Look #1
- [x] Confirm the branch remains ahead of and not behind `main` during implementation
- [ ] Recheck divergence immediately before Round 1 scoring
- [ ] Define how later Look #1 functionality changes are incorporated
- [ ] Add a branch-specific preview deployment
- [ ] Confirm preview deployment cannot replace production GitHub Pages
- [ ] Document preview URL and refresh procedure
- [ ] Open a draft PR only when centralized review history is useful
- [ ] Do not merge before final selection and migration planning

---

# 2. Shared Design Lab foundation

## Structure and behavior

- [x] Landing page, shared shell, and desktop/mobile controls
- [x] Shared immutable fixtures and seven scenarios
- [x] Query routing for Look, screen, scenario, and Area
- [x] Browser Back/Forward implementation
- [x] Reset Review State and invalid-route fallback
- [x] Browser-native ES modules
- [x] Per-Look renderer boundaries
- [x] Separate Look-specific stylesheets
- [x] README, scenarios, decisions, changelog, direction documents, quality notes, and progress logs
- [x] Add dependency-free route and fixture validation harness
- [x] Add screenshot-friendly labelled and phone-only presentation modes
- [ ] Add `screenshots/` when canonical captures actually begin
- [ ] Add shared assets only when truly reused across Looks

## Comparison fairness

- [x] One fixture shared by all shortlisted Looks
- [x] Clone scenario data before rendering
- [x] Same three screens for all Looks
- [x] Same seven scenarios for all Looks
- [x] Same simulated Round 1 actions
- [x] Presentation and tone may change without changing meaning
- [x] Direction and intentional differences documented for Looks #2, #3, #4, and #6
- [~] Programmatic fixture-count and label verification is implemented; complete-checkout execution pending
- [~] Programmatic check for aesthetic-specific fixture exceptions is implemented; execution pending

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
- [ ] Complete shared scorecard
- [ ] Record best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Record best and worst scenario
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

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
- [ ] Complete shared scorecard
- [ ] Record best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Record best and worst scenario
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

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
- [ ] Complete shared scorecard
- [ ] Record best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Record best and worst scenario
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

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
- [ ] Complete shared scorecard
- [ ] Record best feature, biggest weakness, confusing element, distinctive element, and borrowable components
- [ ] Record best and worst scenario
- [ ] Assign Finalist, Revise, Hold, Reject, or Components-only status

---

# 9. Shared static and route validation

## Validation tooling

- [x] Add `validate-design-lab.mjs` without external dependencies
- [x] Cover required files and local import targets
- [x] Cover linked stylesheets and required DOM hooks
- [x] Cover all Look IDs, renderer exports, and `app.js` routing
- [x] Cover scenario IDs, required fields, statuses, durations, counts, and clone behavior
- [x] Cover 84 Look/screen/scenario route combinations
- [x] Cover representative Area routes and invalid-route fallbacks
- [x] Cover history methods and isolated session storage
- [x] Cover version consistency, stylesheet order, HTML references, and CSS brace balance
- [x] Syntax-check the validator itself
- [~] Execute the validator against a complete checkout; unavailable in this session because GitHub cloning could not resolve

## Browser-required validation

- [ ] Confirm no console errors during all core routes
- [ ] Verify direct routes load in a real browser
- [ ] Verify Back/Forward in a real browser
- [ ] Verify Reset Review State in a real browser
- [ ] Verify Look/scenario switching in a real browser
- [ ] Verify invalid-route fallback presentation in a real browser

---

# 10. Shared browser, device, and accessibility evidence

## Responsive and device

- [~] Static 360 px, 390 px, and 412 px rules complete; visual walkthrough pending
- [ ] 360 × 800 narrow Android-like viewport
- [ ] 390 × 844 canonical phone viewport
- [ ] 412 × 915 large Android-like viewport
- [ ] 390 × 700 short constrained viewport
- [ ] 844 × 390 landscape smoke test
- [ ] 1440 × 900 desktop review panel
- [ ] Mobile review selector walkthrough

## Browser behavior

- [ ] No console errors during core routes
- [ ] Direct links load correctly
- [ ] Browser Back and Forward work correctly
- [ ] Reset Review State works correctly
- [ ] Look and scenario switching preserve equivalent state
- [ ] Invalid routes fall back safely
- [ ] Simulated actions produce readable toast feedback

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
- [ ] Reduced-motion browser inspection
- [ ] Intervention actions remain unambiguous in every Look

## Stress content

- [x] Required stress states exist in the fixture
- [x] Every Look has code-level dense-data and overflow handling
- [ ] Visually verify Heavy Backlog in every Look
- [ ] Visually verify New User in every Look
- [ ] Visually verify All Clear in every Look
- [ ] Visually verify Large Household in every Look
- [ ] Visually verify Long Content in every Look
- [ ] Visually verify Large Text in every Look

---

# 11. Review preparation and evidence capture

## Capture tooling

- [x] Define exact viewport and capture rules
- [x] Add `capture=labelled` stable evidence mode
- [x] Add `capture=phone` clean phone mode
- [x] Add automatic Look, screen, scenario, and version label
- [x] Fix capture time at 9:41
- [x] Keep capture mode presentation-only and separate from demo state
- [x] Define evidence filename convention
- [ ] Capture Areas Normal Day for Looks #1, #2, #3, #4, and #6
- [ ] Capture Kitchen Heavy Backlog
- [ ] Capture Intervention Normal Day
- [ ] Capture concern-specific New User, All Clear, Large Household, Long Content, Large Text, narrow, short, and forced-colors evidence
- [ ] Store approved captures under `screenshots/`

## Shared scorecard

- [x] Add Markdown scorecard for Look #1 and Looks #2, #3, #4, and #6
- [x] Define 1–5 anchors
- [x] Include Clarity, Calmness, Speed, Personality, Density, Scalability, Intervention suitability, Accessibility, Versatility, and Daily preference
- [x] Include qualitative findings and borrowable-component fields
- [x] Include ranking, finalist, disposition, focused-revision, and synthesis fields
- [x] Keep scores separate from demo state
- [x] Keep the Markdown scorecard directly copyable
- [d] In-app score persistence, export, and Reset Scores unless Markdown proves insufficient
- [ ] Fill all scores and qualitative fields

## Review protocol

- [x] Document local setup and validation command
- [x] Document canonical and stress route order
- [x] Document viewport matrix
- [x] Document browser-history, switching, reset, invalid-route, and console checks
- [x] Document keyboard and screen-reader smoke tests
- [x] Document forced-colors and reduced-motion checks
- [x] Document evidence-record fields
- [ ] Execute the protocol and record results

---

# 12. Round 1 selection gate — mandatory hard stop

Do not begin Round 2 until:

- [x] All four shortlisted Looks have equivalent screens and scenarios
- [ ] Quality limitations are documented and review evidence is sufficient
- [ ] Look #1 and all shortlisted Looks have completed scorecards
- [ ] Findings and borrowable components are summarized
- [ ] Approximately two or three finalists are selected
- [ ] Non-finalists are marked Hold, Reject, or Components only
- [ ] Focused finalist revisions, if any, are defined
- [ ] Synthesis remains allowed, rejected, or explicitly deferred
- [ ] Checklist and decision log are updated

When the selection decision is required, use the one-line hard stop and wait for review.

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
- [x] `0.6.0–0.6.1` — Tactile Household implementation, quality, and validation foundation
- [x] `0.7.0` — Capture modes, review protocol, and shared scorecard

---

# 20. Current next actions

- [x] Implement and code-review Looks #2, #3, #4, and #6
- [x] Add shared static, fixture, import, and route validation tooling
- [x] Prepare browser/device/accessibility review routes and protocol
- [x] Add scorecard and screenshot-friendly modes
- [ ] Execute the validator in a complete checkout
- [ ] Execute browser/device/keyboard/screen-reader/forced-colors evidence review
- [ ] Capture canonical comparison evidence
- [ ] Map and capture equivalent Look #1 evidence
- [ ] Fill the scorecard and summarize borrowable components
- [!] Hold the mandatory Round 1 selection gate before any full-app expansion
