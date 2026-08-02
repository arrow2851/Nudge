# Look #4 — Zen Focus Intervention-to-action

**Version:** `0.11.0`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Turn the existing intervention suggestion into a concrete, reversible action flow without introducing app blocking, surveillance, penalties, timers, or production integrations.

## Implemented flow

```text
Intervention prompt
→ Start suggestion
→ Active action state
→ Complete
→ Reopen

Intervention prompt
→ Show another option
→ Deterministic next suggestion

Intervention prompt
→ Stay here for now
→ Quiet dismissed state
→ Show suggestion again
```

## Shared behavior

- Scenario-isolated session state.
- Deterministic suggestion list beginning with the scenario fixture.
- Additional suggestions derived from available scenario routines.
- Setup-safe alternatives when a scenario has no Areas.
- Four semantic phases: Prompt, Active, Completed, and Dismissed.
- Start creates a concrete action state within the Intervention screen.
- Completion can be reopened immediately.
- Start can be undone without affecting routines or tasks.
- Different suggestion cycles without penalty.
- Not Now changes no task or routine state.
- Reset Review State clears intervention state.

## Zen Focus presentation

- One quiet decision at a time.
- Existing pause mark and suggestion card remain recognizable.
- Active and completed states use calm status cards.
- Dismissal explicitly confirms that nothing changed.
- No countdown, productivity score, streak, warning, or urgency escalation.
- Actions remain clearly separated and full-width.

## Product boundary

- The Design Lab does not detect or block real applications.
- The displayed app and elapsed minutes come from deterministic scenario fixtures.
- No usage data is recorded.
- No notification, reminder, account, or backend behavior is added.
- Starting an intervention action does not silently create a production Task.
- Completion is isolated from Routine Completion and Task Hierarchy state.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Short-screen layouts reduce decorative spacing before reducing action clarity.
- Narrow layouts stack status-card content.
- Completed state uses a checkmark and explicit text.
- Forced Colors uses system colors.
- Reduced Motion removes nonessential animation and transitions.
- Visible keyboard focus remains present.

## Evidence boundary

Committed-source inspection and validator contracts cover the shared phase engine, deterministic alternatives, renderer actions, reset integration, stylesheet order, responsive hooks, and accessibility fallbacks.

Still pending:

- Exact complete-checkout validator execution.
- Exact browser interaction testing.
- Physical Android presentation testing.
- Actual screen-reader smoke testing.
- Real app-usage or intervention-trigger integration, which is intentionally outside this Design Lab slice.
