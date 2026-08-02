# Design Lab Checklist Progress — 0.8.5

This milestone records browser presentation evidence for Looks #5, #7, #8, and #9 and completes the first full-gallery comparison set without changing product behavior or the protected Look #1 prototype.

## Completed

- [x] Execute 84 direct routes across four Looks, seven scenarios, and three screens
- [x] Execute 72 canonical viewport checks across six viewport sizes
- [x] Execute 28 Areas stress-scenario checks
- [x] Verify eight Long Content and Large Text Intervention action-reachability cases
- [x] Verify forced-colors and reduced-motion activation for all four new Looks
- [x] Verify keyboard focus visibility for all four new Looks
- [x] Confirm no horizontal-overflow failures in the tested matrix
- [x] Confirm no unnamed visible buttons in the tested matrix
- [x] Confirm a minimum tested in-preview control size of 48 × 48 px
- [x] Generate nine-direction contact sheets for Areas, Area detail, and Intervention
- [x] Add `FULL-GALLERY-EVIDENCE-0.8.4.md`
- [x] Add `FULL-GALLERY-EVIDENCE-0.8.4.json`
- [x] Update Design Lab metadata to `0.8.5`
- [x] Keep all repository changes under `mockups/design-lab/`
- [x] Keep `main` and the protected Look #1 prototype unchanged

## Evidence boundary

The new-Look run used retained committed renderer and base-style files with a reconstructed shared scenario and quality-delta harness because an exact complete checkout was unavailable and Chromium navigation was administrator-blocked. This milestone does not claim that `validate-design-lab.mjs` ran against an exact complete 0.8.4 or 0.8.5 checkout.

The three contact sheets and the full binary evidence archive remain available as external downloadable artifacts. The repository stores the narrative report and machine-readable summary.

## Still pending

- [ ] Run `node validate-design-lab.mjs` in an exact complete checkout
- [ ] Perform physical Android-device checks
- [ ] Perform actual screen-reader smoke testing
- [ ] Measure Ambient Glass paint and compositing behavior on lower-end hardware
- [ ] Rerun every Look from one identical build when a deployable preview or exact checkout becomes available

## Next active milestone

Prepare the interactive-expansion decision record and define candidate vertical slices without implementing one until the dominant pure-Look, feature-specific variant, or controlled-synthesis direction is intentionally chosen.
