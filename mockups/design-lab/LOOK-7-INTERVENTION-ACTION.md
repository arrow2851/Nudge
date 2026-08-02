# Look #7 — Bold Utility Intervention-to-action

**Version:** `0.11.3`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the shared reversible Intervention-to-action flow to Bold Utility using direct hierarchy and explicit controls without framing continued app use as an error, failure, alarm, or noncompliance state.

## Implemented flow

```text
Available suggestion
→ Start action
→ Active
→ Complete
→ Reopen or Undo start

Available suggestion
→ Show another option
→ Deterministic alternative

Available suggestion
→ Continue current app
→ Dismissed
→ Show suggestion again
```

## Bold Utility presentation

- High-contrast Available, Active, Complete, and Dismissed states.
- Thick-rule headings and direct full-width actions.
- Source app, fixture pause, estimated action time, option position, and phase facts.
- Explicit distinction between prototype intervention completion and recurring routines or Tasks.
- Strong completion marking without points, streaks, rankings, or performance scoring.
- Dismissed state confirms the current app continues and nothing is owed.

## Shared behavior preserved

- Separate scenario-isolated intervention state.
- Deterministic scenario-first and routine-derived suggestions.
- Setup-safe suggestions when no Areas exist.
- Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today actions.
- Reset Review State clears intervention state.
- Routine Completion and Task hierarchy state remain unchanged.
- State persists while switching among Looks #3, #4, #5, and #7.

## Tone boundary

- Direct hierarchy does not imply urgency beyond the fixture.
- Continuing the current app is an equally valid choice.
- No error, failure, fault, alarm, warning, or noncompliance language appears in the intervention renderer.
- No score, penalty, requirement, missed-opportunity state, or follow-up is created.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Narrow layouts stack facts before compressing essential copy.
- Short-screen mode reduces spacing without removing actions.
- Completion uses text and a checkmark beyond color.
- Visible keyboard focus, Forced Colors, and Reduced Motion are supported.

## Explicit exclusions

- No live app-usage detection.
- No blocking or redirect enforcement.
- No timers, countdowns, monitoring, notifications, accounts, or backend integration.
- No automatic production Task creation.
- No points, streaks, rewards, rankings, compliance scores, or shame states.

## Evidence boundary

Committed-source inspection and validator contracts cover the renderer export, shared action set, stylesheet order, responsive hooks, accessibility modes, optional-choice language, and prohibited pressure-language checks. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
