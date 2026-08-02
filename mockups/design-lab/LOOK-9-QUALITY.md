# Look #9 — Retro Digital Quality Pass

**Version:** `0.8.4`  
**Scope:** Code-level responsive, readability, contrast, semantics, touch-target, and forced-colors review.

## Quality risks found

- Operational labels were commonly rendered at 6–8 px.
- The completion target was only 39 × 39 px.
- Area, routine, and Section layouts used dense columns that would crowd on narrow screens and with Large Text.
- The status meter renderer supplied a percentage while the CSS multiplied it again, producing an invalid fill calculation.
- Several visible counts and status clusters could be repeated unnecessarily by assistive technology.
- The terminal-like copy needed to remain optional and humane rather than sounding like a system failure or command.

## Corrections

### Readability

- Raised operational labels to at least 10 px in the standard comparison frame.
- Raised primary row labels to 12 px.
- Added explicit Large Text sizes for headings, metadata, statuses, controls, and Intervention content.
- Lightened the muted token from `#8bad9b` to `#9fc0ad` and the structural line token from `#3b5148` to `#587165`.

### Contrast

The original palette was already strong:

- Muted text on the main background: approximately `7.10:1`
- Muted text on panels: approximately `6.06:1`
- Red status text on panels: approximately `5.30:1`
- Green, amber, and primary text all exceed `9.6:1` on panel surfaces

The token adjustments increase separation further while preserving the dark operating-system character.

### Touch and keyboard

- Increased completion controls to 48 × 48 px.
- Increased primary, secondary, dismiss, add, and back actions to at least 48 px high.
- Added 4 px white focus indicators with 3 px offsets.
- Large Text actions use at least 54 px height.

### Responsive and Large Text

- Converted Area rows to two-stage layouts below 420 px.
- Moved the status meter beneath Area information on narrow screens.
- Reflowed routine status labels beneath routine metadata.
- Simplified routine rows further below 370 px by hiding decorative line numbers.
- Reflowed Section metadata and chevrons into stable three-column layouts.
- Added explicit Large Text layouts rather than relying on inherited scaling.

### Semantics

- Area buttons now expose one complete accessible label and hide duplicated visual status clusters.
- Summary displays expose one concise announcement.
- Completion controls include the routine name.
- Routine statuses are announced as statuses.
- Section controls expose their name and configured state once.
- Intervention timing and suggested-task cards expose concise labels without repeating their visible contents.

### Meter and decorative behavior

- Corrected the meter fill to use the supplied percentage directly.
- Added `prefers-contrast: more` tokens and stronger panel borders.
- Removed scan-line decoration in forced-colors mode.
- Replaced color-dependent panels and controls with system colors in forced-colors mode.

### Intervention tone

- Preserved the `SWITCH MODE?` identity.
- Clarified that the current session may continue.
- Changed command-heavy labels to `START TASK`, `SHOW ALTERNATE`, and `STAY HERE`.
- Reframed the suggestion as an optional task rather than a mandatory execution request.

## Verification completed

- Renderer structure and semantics reviewed after the update.
- Contrast ratios calculated for the main text, muted, green, amber, and red tokens.
- Narrow-screen, Large Text, long-content, focus, touch-target, meter, and forced-colors paths reviewed in source.
- Validator updated to require `look9-quality.css` and enforce stylesheet ordering.
- Shared fixtures, route meaning, and product functionality were not changed.

## Evidence still required

- Complete-checkout validator execution
- Real browser viewport and overflow review
- Physical Android review
- Keyboard-only browser run
- Actual screen-reader smoke test
- Forced-colors screenshot review
- Dark-display readability review under different brightness settings

This milestone is a completed code-level quality pass, not a claim that physical-device or assistive-technology testing has occurred.
