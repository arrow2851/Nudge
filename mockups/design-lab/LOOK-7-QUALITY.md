# Look #7 — Bold Utility Quality Pass

Version `0.8.2` completes the dedicated code-level responsive, contrast, density, tone, semantics, and blocking-quality review for Look #7.

## Blocking issues found

- Operational labels were commonly 7–9 px.
- The completion control was only 42 × 42 px.
- The five-column Area table compressed poorly on narrow screens and under Large Text.
- Status and metadata could crowd long Area and routine names.
- The Intervention headline `STOP. CHOOSE.` read as an alarm rather than a supportive decision point.
- The original blue action surface barely cleared normal-text contrast and left little tolerance for rendering variation.
- Forced-colors handling did not fully restore boundaries and system control colors.

## Corrections

### Readability and contrast

- Increased operational labels to a 10 px minimum in the standard scale.
- Increased primary names, routine names, Section names, and quiet text to 12 px minimums.
- Increased body copy to 12 px with a 1.55 line height.
- Darkened the action blue from `#2868ff` to `#174fc4`.
- White on the new blue measures approximately `7.11:1`.
- Black on the red action surface measures approximately `5.78:1`.
- Black on yellow measures approximately `13.32:1`.
- Black on the cream background measures approximately `16.60:1`.

### Touch and keyboard behavior

- Increased primary actions and Back controls to at least 48 px high.
- Increased the completion control to 48 × 48 px.
- Added 4 px visible focus outlines to all critical interactive controls.

### Narrow screens and dense content

- Converted the desktop five-column Area row into a multi-row mobile layout.
- Moved the next routine and status into dedicated rows rather than compressing them.
- Stacked the summary counter and Area-detail metric at narrow widths.
- Reflowed routine status tags below content at 370 px and under Large Text.
- Added `overflow-wrap: anywhere` to long Area, routine, Section, Intervention, and action labels.
- Allowed the marquee to wrap instead of clipping long app/context labels.

### Large Text

- Added explicit Large Text sizes for fixed-size labels and headings.
- Reflowed Area rows, detail metrics, routine statuses, and Intervention controls.
- Increased Large Text controls to at least 54 px high.
- Kept the bold hierarchy while preventing dense table compression.

### Semantics

- Added complete Area labels with status, routine count, structure, and next routine.
- Hid duplicate visual status counters from assistive technology.
- Added status labels to routine tags.
- Added contextual labels to summary counters and Area-detail metrics.
- Added Section labels with routine counts or configuration state.
- Added contextual Intervention and suggested-action labels.
- Added the suggested routine name to the Start action.

### Tone

- Changed `STOP. CHOOSE.` to `PAUSE. DECIDE.`.
- Replaced command-style supporting copy with an explicit statement that either staying or switching is valid.
- Replaced `NOT NOW` with `STAY HERE`.
- Preserved the decisive Bold Utility visual language without introducing guilt or alarm.

### Forced colors

- Restored Canvas and CanvasText surfaces and boundaries for Area rows, metrics, routines, tags, and suggestion panels.
- Restored ButtonFace and ButtonText for actions.
- Removed decorative shadows that do not survive high-contrast rendering reliably.

## Scenario review

Static source review covered Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text through the shared rendering paths.

- Heavy Backlog retains strong scanning without relying on color alone.
- Large Household keeps every Area visible and scrollable.
- Long Content can wrap instead of truncating action labels.
- Large Text no longer preserves the compressed desktop table.
- New User retains a single obvious first action.
- All Clear retains the strong counter while announcing an accurate non-urgent summary.

## Evidence boundary

Completed:

- Source-level responsive and overflow review.
- Code-level semantic review.
- Contrast calculations.
- Touch-target review.
- Forced-colors and Large Text path review.
- Renderer and quality-stylesheet integration.

Still pending:

- Full-checkout validator execution.
- Real browser console and screenshot review.
- Physical phone and landscape review.
- Keyboard-only browser run.
- Actual screen-reader testing.
- Windows High Contrast visual review.

No known code-level blocker remains for Look #7.
