# Look #5 — Playful Modular Intervention-to-action

**Version:** `0.11.2`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the established reversible Intervention-to-action behavior to Playful Modular without turning the experience into a game, score, streak, or reward system.

## Implemented flow

```text
Prompt
→ Start this small action
→ Active
→ Mark complete
→ Reopen or Undo start

Prompt
→ Show another option
→ Deterministic next suggestion

Prompt
→ Keep scrolling for now
→ Dismissed
→ Show the suggestion again
```

## Playful Modular presentation

- Bright modular surfaces and friendly language make the option approachable.
- Prompt, Active, Completed, and Dismissed states use distinct cards and status chips.
- Context blocks show source app, fixture pause length, action estimate, and current phase.
- A visible option counter identifies deterministic suggestion position.
- Completion is acknowledged clearly without points or celebratory performance language.
- Dismissal becomes a calm “kept scrolling” state rather than a missed opportunity.

## Shared behavior preserved

- Separate scenario-isolated intervention state.
- Deterministic suggestion order derived from the scenario and available routines.
- Setup-safe alternatives when no Areas exist.
- Start, Complete, Reopen, Undo Start, Next, Dismiss, Resume, and Return-to-Today actions.
- Intervention state persists while switching among Looks #3, #4, and #5.
- Routine Completion and Task Hierarchy state remain unchanged.
- Reset Review State clears intervention state.

## Non-gamification boundary

- No points, streaks, rewards, badges, rankings, levels, or performance scores.
- No penalty or negative state for staying in the current app.
- No missed-opportunity language after dismissal.
- No countdown or completion requirement after starting.
- Friendly colors and shapes communicate structure, not achievement value.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Narrow layouts stack the context blocks before reducing action clarity.
- Short screens reduce decorative spacing while retaining all actions.
- Active, Completed, and Dismissed states use text and structure in addition to color.
- Forced Colors uses system colors.
- Reduced Motion removes nonessential transitions and animation.
- Visible keyboard focus remains present on every action.

## Explicit exclusions

- No real app-usage detection or app blocking.
- No redirect enforcement, production timer, notification, or reminder.
- No production Task creation.
- No accounts, backend, collaboration, or production persistence.
- No points, streaks, rewards, scoring, or compliance measurement.

## Evidence boundary

Committed-source inspection and validator contracts cover the shared phase engine, renderer registration, reversible actions, stylesheet order, non-gamification language, responsive hooks, and accessibility fallbacks. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
