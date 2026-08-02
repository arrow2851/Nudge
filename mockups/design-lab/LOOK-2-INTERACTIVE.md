# Look #2 — Warm Editorial Interactive Routine Completion Loop

**Design Lab version:** `0.9.5`  
**Branch:** `feature/design-lab`  
**Status:** Implemented in the isolated Design Lab; exact-checkout browser evidence pending

## Purpose

This milestone applies the established Routine Completion behavior to Warm Editorial while testing whether household work can be presented as calm context and manageable entries rather than a dashboard, alarm, or score.

## Implemented flow

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention counts update
→ Undo or reopen
```

## Look-owned presentation

- Today is presented as a quiet daily page with one featured entry.
- Secondary work remains visible as additional entries without competing with the first action.
- Areas retain the existing journal index and narrative context.
- Sections read as smaller collections of household notes.
- Chore detail uses an editorial entry, contextual note, and compact fact table.
- Completion closes the entry with restrained feedback and keeps `Reopen this entry` immediately available.
- Status remains explicit in text rather than depending on decorative color or prose alone.

## Shared behavior preserved

Look #2 uses the same semantic state engine as the other interactive Looks:

- Stable routine identifiers.
- Scenario-isolated session state.
- Deterministic Light, Moderate, and Deep next-cycle labels.
- Completion from Today, Area, Section, or Chore detail.
- Derived attention counts and All Clear state.
- Browser-history-compatible Area, Section, and Chore routes.
- Shared completion state when switching among interactive Looks.
- Reopen by deleting the completion record and restoring the prior fixture status.

## Scenario handling

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

## Accessibility and responsive treatment

- Separate completion and detail buttons prevent accidental completion.
- Critical controls have a 48 px minimum target; Large Text actions use at least 54 px.
- Strong `:focus-visible` treatment is included.
- Routine, Area, Section, and fact content can wrap without horizontal clipping.
- Narrow screens stack feature actions, routine metadata, and Chore facts.
- Completed state uses text, a checkmark, and line-through rather than color alone.
- Forced-colors uses system colors and removes decorative surface treatment.
- Reduced-motion removes nonessential transitions and animation.

## Validation performed

Committed-source inspection confirmed:

- Six Look #2 renderer exports are present and referenced by the controller.
- Today, Areas, Area detail, Section, Chore detail, completed state, and Undo markup are implemented.
- Look #2 is registered in the shared interactive-Look set.
- Action handling still occurs before generic Chore navigation.
- `look2-interactive.css` is loaded after the shared editorial base styles.
- The validator requires Look #2’s six exports, interaction stylesheet, completion controls, responsive hooks, forced-colors handling, and reduced-motion handling.

## Evidence boundary

Direct repository cloning remains blocked by DNS in the execution environment. This milestone therefore does not claim an exact complete-checkout validator run or browser run.

Still pending:

- Exact complete-checkout validator and browser execution.
- Physical Android viewport checks.
- Actual screen-reader smoke testing.
- Single-version cross-Look browser regression.

## Explicit exclusions

- No production persistence, backend, account, notification, or calendar integration.
- No Area or recurrence editing.
- No task hierarchy or reusable Lists.
- No product-facing theme selector.
- No Look #1 changes.
- No merge into `main`.
