# Look #9 — Retro Digital Interactive Routine Completion Loop

**Version:** `0.9.7`  
**Branch:** `feature/design-lab`  
**Status:** Implemented with committed-source contract evidence; exact-checkout browser and device evidence remain pending.

## Purpose

Apply the shared Routine Completion behavior to Retro Digital without turning normal household upkeep into error handling or system failure language.

## Implemented flow

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention count updates
→ Undo completion
```

## Presentation

- Today uses an explicit but optional action queue.
- One selected routine is shown with separate Complete and Open Details controls.
- Areas use node rows and attention meters.
- Sections use directory-style entries.
- Chore detail uses a routine record, practical facts, completion log, and immediate Undo.
- Completed routines use text, `[✓]`, line-through, and status labels rather than color alone.
- Backlog is described as available work, not an error or failure state.

## Shared behavior preserved

- Stable routine IDs.
- Scenario-isolated session completion state.
- Light, Moderate, and Deep deterministic next-cycle labels.
- Completion from Today, Area, Section, and Chore detail.
- Browser-history-compatible Today, Area, Section, and Chore routes.
- Derived attention counts and All Clear behavior.
- Immediate Undo and previous-status restoration.
- Semantic completion state shared across Looks #2 through #9.

## Responsive and accessibility contract

- Critical actions retain a 48 px minimum target.
- Large Text actions reach 54 px.
- Narrow screens stack priority controls and Chore facts.
- Status is repeated in visible text.
- Focus-visible outlines are explicit.
- Forced-colors uses system colors and removes decorative status treatments.
- Reduced motion suppresses nonessential transitions and animation.

## Validation encoded

`validate-design-lab.mjs` now requires:

- Six Look #9 renderer exports.
- `look9-interactive.css`.
- Working complete, reopen, Section, and Chore hooks.
- `.rd-routine-open` and `.rd-chore-actions` contracts.
- Forced-colors and reduced-motion rules.
- Eight-Look shared interactive registration.

## Evidence boundary

Completed:

- Committed-source renderer inspection.
- Shared-controller registration.
- Route/export contract encoding.
- Stylesheet-order encoding.
- CSS block-balance contract.
- Responsive and accessibility hook inspection.

Still pending:

- Exact complete-checkout validator execution.
- Exact complete-checkout browser interaction run.
- Physical Android testing.
- Actual screen-reader smoke testing.
- Single-version browser regression across every Look.
- Ambient Glass lower-end paint/compositing measurements.

## Safety boundary

- All changes remain under `mockups/design-lab/`.
- Look #1 remains protected under `mockups/prototype/` on `main`.
- No production backend, account, notification, or app-storage integration.
- No merge into `main`.
