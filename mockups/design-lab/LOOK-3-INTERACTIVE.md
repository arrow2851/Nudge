# Look #3 — Precision Minimal Interactive Routine Completion Loop

**Design Lab milestone:** `0.9.1`  
**Status:** Implemented in the isolated Design Lab  
**Behavior source:** Shared deterministic Routine Completion state introduced in `0.9.0`

## Purpose

Look #3 is the second pure-Look implementation in the approved sequence. It applies the same Routine Completion behavior proven in Look #4 to a denser, faster-scanning operational interface.

This is not a new product flow. The comparison is specifically intended to reveal how the same behavior feels when information density, alignment, explicit counts, and compact metadata receive greater emphasis.

## Implemented route chain

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention count updates
→ Undo or reopen
```

## Precision Minimal presentation decisions

- Compact operational Today queue with explicit counts.
- One high-priority action panel followed by a dense routine table.
- Square completion controls rather than Zen Focus circles.
- Monospaced status, duration, tier, and route metadata.
- Explicit Area, Section, attention, and total metrics.
- Chore facts presented as a compact definition table.
- Cobalt reserved for navigation, completion, and strong state confirmation.
- Overdue and due-today states remain text-labelled and do not depend on color alone.

## Shared behavior retained

Look #3 uses the same implementation as Look #4 for:

- Stable routine identifiers.
- Light, Moderate, and Deep tier assignment.
- Deterministic next-cycle labels.
- Session-isolated completion state.
- Previous-status restoration during Undo.
- URL route serialization.
- Browser Back and Forward compatibility.
- Scenario-specific state isolation.
- Reset Review State behavior.

Completing a routine in Look #3 and switching to Look #4 preserves the completed state because the behavior belongs to the shared prototype state rather than a Look-specific renderer.

## Screens and states

### Today / Needs Attention

- Active routine count and affected-Area count.
- Primary next-action panel.
- Dense attention queue.
- Completed-this-session queue with reopen controls.
- New User and no-routine setup state.
- All-current heading with optional non-urgent work still available.

### Area

- Attention and Section metrics.
- Attention queue.
- Navigable Section rows.
- Later and completed routines.

### Section

- Attention and total metrics.
- Navigable routine rows.
- Unconfigured Section state without setup pressure.

### Chore detail

- Explicit status panel.
- Recurrence tier, schedule, duration, and next-state facts.
- Complete or Undo action.
- Return to Section action.

## Accessibility and responsive behavior

- Critical controls are at least 48 × 48 px.
- Large Text raises critical actions to at least 54 px.
- Dense routine rows reflow into stacked layouts on narrow screens.
- Chore facts reflow from two columns to one.
- Status labels remain visible and textual.
- Focus-visible styling uses a strong cobalt outline.
- Forced-colors mode retains structural borders and completion state.
- Reduced-motion mode removes nonessential transitions and animation.
- Long labels wrap rather than clip horizontally.

## Shared correction discovered during implementation

The shared `nextRoutine` helper previously sorted only by due status. A completed routine advances to Upcoming, so it could incorrectly remain an Area's displayed next routine. The helper now deprioritizes completed routines before applying status priority. This correction benefits every interactive Look.

## Validation completed

- Required exports and application routing were added for Today, Section, and Chore.
- The static validator now covers both interactive Looks and both dedicated interactive stylesheets.
- The validator checks shared completion, recurrence, Undo, route, state-preservation, and completion-aware next-routine hooks.
- Renderer markup contains completion, reopen, Section, and Chore interaction hooks.
- Responsive, Large Text, forced-colors, reduced-motion, focus, and touch-target rules are present in the committed stylesheet.
- Manual committed-source review covered Normal Day, Heavy Backlog, New User, All Clear, Long Content, and Large Text branches.

## Evidence limitation

Direct repository cloning and exact-checkout browser execution remain blocked by local DNS restrictions. This milestone therefore does not claim an exact complete-checkout browser run, physical Android evidence, or an actual screen-reader test.

## Boundaries preserved

- Look #1 remains untouched.
- No production backend or app storage was introduced.
- Look switching remains Design Lab-only.
- The other Looks remain preserved.
- Nothing was merged into `main`.
