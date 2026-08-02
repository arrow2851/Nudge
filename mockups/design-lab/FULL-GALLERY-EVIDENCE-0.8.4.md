# Nudge Full-Gallery Browser Evidence — 0.8.4

**Date:** 2026-08-01  
**Branch under review:** `feature/design-lab`  
**Scope:** Looks #5, #7, #8, and #9 plus full-gallery contact sheets

## Result

The new gallery directions completed the browser presentation evidence matrix with no blocking layout, overflow, accessible-name, touch-target, focus, or emulated-media failures in the tested harness.

| Evidence group | Passed | Total |
|---|---:|---:|
| Direct routes: 4 Looks × 7 scenarios × 3 screens | 84 | 84 |
| Canonical routes across six viewports | 72 | 72 |
| Areas stress-scenario checks | 28 | 28 |
| Long Content and Large Text Intervention action reachability | 8 | 8 |
| Forced Colors + Reduced Motion emulation | 4 | 4 |
| Keyboard focus visibility | 4 | 4 |

Additional automated observations:

- No direct route produced horizontal overflow.
- No tested direct route produced an unnamed visible button.
- The minimum visible in-preview button width and height were both 48 px for every new Look.
- Long Content and Large Text Intervention actions remained reachable after scrolling.
- Forced Colors and Reduced Motion media queries activated for all four new Looks without introducing overflow.

## Viewports

Each new Look's canonical Areas, Area detail, and Intervention routes was tested at:

- 360 × 800
- 390 × 844
- 412 × 915
- 390 × 700
- 844 × 390 landscape
- 1440 × 900 desktop

## Scenarios

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

## Contact sheets

Three nine-direction comparison sheets were generated:

1. Areas — All Clear
2. Area detail — Long Content
3. Intervention — Large Text

The sheets use scenario-matched archived 0.7.2 browser evidence for Looks #1, #2, #3, #4, and #6. Looks #5, #7, #8, and #9 use fresh 0.8.4 captures from this run.

The binary contact sheets and complete downloadable evidence archive were retained outside the repository because the available GitHub contents connector accepts UTF-8 text files only. The committed machine-readable summary records the same tested counts and limitations.

## Reconstruction boundary

A direct checkout could not be cloned because the execution environment could not resolve or connect to GitHub. The earlier exact evidence checkout was no longer retained; only its archived evidence images remained. Chromium also rejected `http://`, localhost, and `file://` navigation under administrator policy.

The new-Look evidence therefore used:

- Retained committed renderer and base-style files for Looks #5, #7, #8, and #9.
- The documented shared seven-scenario contract.
- A locally reconstructed quality-delta layer matching the committed 0.8.1–0.8.4 corrections.
- Chromium pages populated through Playwright `setContent`, avoiding prohibited navigation while still executing real layout, responsive CSS, focus styling, media emulation, and screenshots.

This is strong browser presentation evidence for the four new Looks, but it is **not** represented as an execution of `validate-design-lab.mjs` against an exact complete 0.8.4 repository checkout.

## Cumulative gallery coverage

The previous 0.7.2 evidence run covered Look #1 and active Looks #2, #3, #4, and #6. This 0.8.4 run covers Looks #5, #7, #8, and #9. Together, the two runs provide browser evidence for every gallery direction, although they were not all executed from one identical build.

## Still pending

- Exact complete-checkout execution of `node validate-design-lab.mjs`
- Physical Android-device checks
- Actual screen-reader smoke testing
- DevTools paint/compositing measurements for Ambient Glass on lower-end hardware
- A single-version browser rerun of all Looks after a deployable preview or exact checkout becomes available
