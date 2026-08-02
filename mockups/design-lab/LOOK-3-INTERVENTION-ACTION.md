# Look #3 — Precision Minimal Intervention-to-action

**Version:** `0.11.1`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the established Intervention-to-action behavior to Precision Minimal while preserving optionality, reversibility, and the separation between intervention state, recurring routines, and the Tasks checklist.

## Implemented flow

```text
Prompt
→ Start action
→ Active
→ Mark complete
→ Completed
→ Reopen or Undo start

Prompt
→ Next option
→ Deterministic alternative

Prompt
→ Not now
→ Dismissed
→ Show suggestion again
```

## Precision Minimal presentation

- Compact intervention register with explicit phase labels.
- Source app, elapsed time, action estimate, and suggestion position shown as factual metrics.
- Available, Active, Complete, and Dismissed states use separate structural treatments.
- A single blue accent identifies the primary action without implying urgency.
- Completed state uses a checkmark and text in addition to color.
- Dismissed state explicitly records that no Task, reminder, penalty, or follow-up was created.

## Shared behavior preserved

- Separate scenario-isolated intervention storage.
- Scenario fixture remains the first suggestion.
- Deterministic alternatives derive from available routines.
- Setup-safe alternatives remain available in the New User scenario.
- Start creates a concrete prototype action state.
- Complete, Reopen, Undo Start, Next Option, Not Now, Resume, and Return to Today remain available.
- Reset Review State clears intervention state.
- Routine completion and Task hierarchy state remain unchanged.
- State persists when switching between Looks #3 and #4.

## Metrics boundary

- Elapsed app time comes from the fixture and is not live usage tracking.
- Action duration is an estimate, not a timer.
- Suggestion position is navigation information, not a ranking.
- No productivity score, compliance rate, streak, penalty, or performance judgment is created.

## Accessibility and responsive contract

- Critical actions retain at least 48 px heights.
- Large Text raises actions to 54 px and expands facts and action titles.
- Narrow layouts stack the phase count and fact grid before content becomes compressed.
- Short screens reduce decorative spacing while preserving every action.
- Forced Colors uses system colors.
- Reduced Motion removes transitions and animation.
- Visible focus is retained for keyboard review.

## Explicit exclusions

- No real app-usage detection or redirect enforcement.
- No app blocking, timers, notifications, or background tracking.
- No automatic production Task creation.
- No backend, account, or production persistence integration.
- No guilt, shame, scoring, failure, or compliance state.

## Evidence boundary

Committed-source inspection and validator contracts cover the shared phase engine, all reversible actions, renderer registration, stylesheet order, responsive hooks, accessibility fallbacks, and shared state across Looks #3 and #4. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
