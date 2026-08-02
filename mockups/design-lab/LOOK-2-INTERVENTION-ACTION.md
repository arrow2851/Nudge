# Look #2 — Warm Editorial Intervention-to-action

**Version:** `0.11.5`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the shared optional intervention flow to Warm Editorial while keeping the experience practical. Editorial context may improve readability, but the user is never asked to journal, reflect, explain, or write a response.

## Shared flow

```text
Prompt
→ Start action
→ Active
→ Complete
→ Reopen or Undo start

Prompt
→ Another suggestion
→ Deterministic alternative

Prompt
→ Continue current app
→ Dismissed
→ Show suggestion again
```

## Warm Editorial presentation

- Available Note, In Progress, Completed, and Set Aside states.
- Serif-led practical headings with restrained explanatory copy.
- A single suggestion entry with current app, fixture pause, estimate, suggestion position, and state facts.
- Direct full-width actions separated from the editorial content.
- Completed state uses a checkmark and explicit text.
- Dismissed state confirms that nothing needs to be written or explained.

## Product boundary

- Editorial language adds context but does not create journaling homework.
- No reflection prompt, note field, diary entry, explanation request, or emotional check-in is required.
- Continuing the current app is an equally complete choice.
- Starting does not create a production Task.
- Completion does not alter recurring routines or the Tasks checklist.
- No timer, monitoring, blocking, reminder, notification, score, streak, ranking, or performance measure is created.

## Shared behavior preserved

- Scenario-isolated intervention state.
- Deterministic suggestion cycling beginning with the scenario fixture.
- Setup-safe alternatives when no Areas exist.
- Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today.
- Reset Review State clears intervention state.
- State persists across Looks #2, #3, #4, #5, #6, and #7.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Narrow screens stack fact labels and values.
- Short screens reduce spacing without removing actions.
- Completion meaning does not depend on color.
- Forced Colors uses system colors.
- Reduced Motion removes nonessential animation and transitions.
- Keyboard focus remains visible.

## Explicit exclusions

- No live app-use detection or redirect enforcement.
- No app blocking or countdown.
- No production persistence, accounts, notifications, or backend integration.
- No writing or reflection workflow.
- No physical-device or actual screen-reader evidence claimed yet.

## Evidence boundary

Committed-source validation covers renderer registration, phase views, reversible actions, stylesheet order, no-writing-input checks, optional-choice language, responsive behavior, Forced Colors, and Reduced Motion. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
