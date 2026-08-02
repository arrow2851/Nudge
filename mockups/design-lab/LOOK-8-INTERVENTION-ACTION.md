# Look #8 — Ambient Glass Intervention-to-action

**Version:** `0.11.6`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the shared optional intervention flow to Ambient Glass while treating transparency, blur, glow, and atmospheric depth as decorative enhancement rather than required structure.

## Implemented flow

```text
Prompt
→ Start action
→ Active
→ Complete
→ Reopen or Undo start

Prompt
→ Show another option
→ Deterministic alternative

Prompt
→ Continue current app
→ Set Aside
→ Show suggestion again
```

## Ambient Glass presentation

- Available, Active, Complete, and Set Aside states.
- One calm suggestion card with explicit title, location, estimate, and state.
- Current-app, fixture-pause, action-estimate, suggestion-position, and state facts.
- Selective translucent treatment on the heading, facts, and secondary controls.
- Mostly solid suggestion cards for stable readability.
- Decorative aurora and orb elements that do not carry meaning.

## Shared behavior preserved

- Separate scenario-isolated intervention state.
- Deterministic alternatives beginning with the scenario fixture.
- Setup-safe suggestions when a scenario contains no Areas.
- Reversible Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today actions.
- Routine Completion and Task hierarchy state remain unchanged.
- State persists across Looks #2 through #8.

## Transparency boundary

- Transparency is decorative and never communicates state alone.
- Every phase includes explicit text and structure.
- Browsers without backdrop-filter support receive solid surfaces.
- Reduced Transparency removes blur, shadows, aurora, and decorative orbs.
- Forced Colors removes atmospheric effects and uses system colors.
- Lower-end paint and compositing performance remains unmeasured and is not claimed.

## Product boundary

- Continuing the current app is a complete and valid choice.
- No live usage tracking, app blocking, redirect enforcement, timer, monitoring, reminder, or notification is added.
- Starting or completing the intervention does not create or change a production Task.
- No points, streaks, rankings, glow scores, performance measurement, or negative dismissal state is created.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Narrow layouts stack fact labels and values.
- Short layouts reduce spacing without hiding actions.
- Completion uses explicit text and a checkmark rather than color or glow alone.
- Visible keyboard focus, Forced Colors, Reduced Motion, Reduced Transparency, and no-backdrop-filter fallbacks are encoded.

## Evidence boundary

Committed-source inspection and validator contracts cover renderer registration, the shared action set, stylesheet order, responsive behavior, solid fallbacks, Reduced Transparency, Forced Colors, and cross-Look state preservation. Exact complete-checkout execution, physical Android testing, actual screen-reader testing, single-version regression, and lower-end paint measurements remain pending.
