# Look #7 — Bold Utility Interactive Routine Completion Loop

**Design Lab version:** `0.9.3`  
**Branch:** `feature/design-lab`  
**Status:** Implemented in the isolated Design Lab; exact-checkout browser evidence pending

## Purpose

This milestone applies the established Routine Completion behavior to Look #7 while testing whether a forceful, high-contrast visual system can expose backlog and urgency without changing the underlying low-pressure Nudge behavior.

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

- Direct Today queue with one large priority action.
- Explicit numeric backlog counters.
- Thick rules, square controls, and high-contrast status panels.
- Separate completion and detail targets on every routine row.
- Area and Section summaries that expose waiting counts.
- Chore detail with a compact fact grid for Area, Section, recurrence, tier, duration, and status.
- Strong completed-state panel labelled `DONE` with immediate Undo.
- Urgency colors repeated in text so meaning never depends on color alone.

## Shared behavior preserved

Look #7 uses the same semantic state engine as Looks #3, #4, and #5:

- Stable routine identifiers.
- Scenario-isolated session state.
- Deterministic Light, Moderate, and Deep next-cycle labels.
- Completion from Today, Area, Section, or Chore detail.
- Derived attention counts and All Clear state.
- Browser-history-compatible Area, Section, and Chore routes.
- Shared completion state when switching among interactive Looks.
- Reopen by removing the completion record and restoring the prior fixture status.

## Scenario handling

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

## Accessibility and responsive treatment

- Native buttons for completion, navigation, and Undo.
- Separate 48 px completion controls and large detail targets.
- Strong `:focus-visible` outlines.
- Text accompanies overdue, today, completed, and all-clear states.
- Routine rows, hero actions, counters, facts, and status panels reflow on narrow phones.
- Large Text stacks action groups and raises critical actions to at least 54 px.
- Forced-colors treatment removes decorative shadows and uses system colors.
- Reduced-motion treatment disables nonessential transitions and animation.

## Validation performed

- Committed-source inspection of all six Look #7 renderer exports.
- Renderer contract inspection for Today, Areas, Area detail, Section, Chore detail, completed state, and Undo markup.
- Controller registration inspection for Looks #3, #4, #5, and #7.
- Stylesheet load-order inspection placing `look7-interactive.css` after `look7-quality.css`.
- CSS block-balance and required accessibility-token checks are encoded in the updated validator.
- Shared action-before-navigation ordering remains intact.

## Evidence boundary

Direct repository cloning remains blocked by DNS in the execution environment. This milestone therefore does not claim an exact complete-checkout validator or browser run.

Still pending:

- Exact complete-checkout validator and browser execution.
- Physical Android viewport checks.
- Actual screen-reader smoke testing.
- Single-version browser regression across every interactive Look.

## Explicit exclusions

- Area or routine creation.
- Editing recurrence rules.
- Calendar or notification integration.
- Production persistence or backend integration.
- Task hierarchy.
- Intervention-to-action behavior.
- Reusable Lists.
- User-facing theme selection.
- Look #1 changes.
- Merge into `main`.

## Next implementation

Look #6 — Tactile Household receives the same Routine Completion Loop next, testing physical-control cues and household-tool affordances without changing semantic behavior.
