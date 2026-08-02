# Look #6 — Tactile Household Interactive Routine Completion Loop

**Design Lab version:** `0.9.4`  
**Branch:** `feature/design-lab`  
**Status:** Implemented in the isolated Design Lab; exact-checkout browser evidence pending

## Purpose

This milestone applies the established Routine Completion behavior to Look #6 while testing whether physical household-tool metaphors can make recurring work feel concrete, understandable, and satisfying without implying that unfinished chores are failures.

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

- Today's work board with a top work order and filed waiting cards.
- Area service cards and Section-drawer navigation.
- Separate 48 px completion control and job-card detail surface.
- Job cards, service intervals, bench-time labels, inspection stamps, and drawer pulls.
- Closed job-card presentation with a completion slip and immediate Reopen action.
- Text labels accompany every tactile stamp and status color.

## Shared behavior preserved

Look #6 uses the same semantic state engine as Looks #3, #4, #5, and #7:

- Stable routine identifiers.
- Scenario-isolated session state.
- Deterministic Light, Moderate, and Deep next-cycle labels.
- Completion from Today, Area, Section, or Chore detail.
- Derived attention counts and All Clear state.
- Browser-history-compatible Area, Section, and Chore routes.
- Shared completion state when switching among interactive Looks.
- Reopen restores the prior fixture status by removing the completion record.

## Scenario handling

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

## Accessibility and responsive treatment

- Native buttons for completion, navigation, and Reopen.
- Critical controls retain the established 48 px target floor.
- Strong `:focus-visible` treatment.
- Completed state uses text, checkmark, stamp, and line-through rather than color alone.
- Work-order actions, routine rows, and job facts stack on narrow phones.
- Large Text raises primary actions to at least 54 px and converts fact grids to one column.
- Forced colors removes decorative shadows and uses system colors.
- Reduced motion disables nonessential animation and transitions.

## Validation performed

- Committed-source inspection confirmed all six Look #6 renderer exports.
- Renderer contract includes Today, Areas, Area detail, Section, Chore detail, completed state, and Reopen markup.
- The shared controller registers Looks #3, #4, #5, #6, and #7 as interactive.
- Action handling remains before generic Chore navigation.
- `look6-interactive.css` is loaded after the base and Look #6 quality layers.
- Validator source requires the Look #6 interactive stylesheet and accessibility hooks.
- Stylesheet braces and required responsive/media-query hooks were inspected at source level.

## Evidence boundary

Direct repository cloning remains blocked by DNS in the execution environment. This milestone therefore does not claim an exact complete-checkout validator run or browser run.

Still pending:

- Exact complete-checkout validator and browser execution.
- Physical Android viewport checks.
- Actual screen-reader smoke testing.
- Single-version browser regression across every interactive Look.

## Explicit exclusions

- Area or routine creation.
- Recurrence editing or calendar integration.
- Notifications, production persistence, or backend behavior.
- Task hierarchy.
- Intervention-to-action behavior.
- Reusable Lists.
- Product-facing themes.
- Look #1 changes.
- Merge into `main`.

## Next implementation

Look #2 — Warm Editorial receives the same Routine Completion Loop next, testing calmer journal-like hierarchy and narrative context without making routine completion less direct.
