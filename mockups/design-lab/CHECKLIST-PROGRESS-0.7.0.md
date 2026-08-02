# Design Lab Checklist Progress — 0.7.0

This entry records shared Round 1 review preparation. It does not select finalists, change scoring criteria, alter comparison scenarios, or begin Round 2.

## Completed

- [x] Add `capture=labelled` screenshot mode with stable 390 × 844 desktop phone framing
- [x] Add `capture=phone` clean phone-frame mode
- [x] Add automatic Look, screen, scenario, and version evidence labels
- [x] Fix capture-mode status time at 9:41 for comparable screenshots
- [x] Preserve normal routes for responsive and interaction testing
- [x] Define canonical, stress, invalid-route, keyboard, screen-reader, forced-colors, and reduced-motion review steps
- [x] Define exact viewport matrix: 360 × 800, 390 × 844, 412 × 915, 390 × 700, 844 × 390, and 1440 × 900
- [x] Add shared 1–5 score matrix for Look #1 and Looks #2, #3, #4, and #6
- [x] Add qualitative findings, borrowable-component, ranking, finalist, disposition, focused-revision, and synthesis fields
- [x] Keep scores in Markdown and separate from Design Lab demo state
- [x] Add evidence filename and storage conventions
- [x] Update Design Lab version to `0.7.0`

## Added files

- `review.css` — stable labelled and phone-only capture layouts
- `ROUND-1-REVIEW-PROTOCOL.md` — browser, device, accessibility, stress, and evidence procedure
- `ROUND-1-SCORECARD.md` — shared quantitative and qualitative review template

## Remaining evidence

- [ ] Run `validate-design-lab.mjs` in a complete checkout
- [ ] Complete browser-console, Back/Forward, reset, switching, and invalid-route tests
- [ ] Complete phone, short-viewport, landscape, and desktop-panel walkthroughs
- [ ] Complete keyboard-only and logical-tab-order walkthroughs
- [ ] Complete screen-reader and forced-colors smoke tests
- [ ] Capture canonical and concern-specific screenshots
- [ ] Map equivalent Look #1 evidence
- [ ] Fill scorecards and qualitative findings

## Next active milestone

Execute the browser/device/accessibility evidence protocol and capture canonical comparison evidence. Do not begin Round 2 until the mandatory selection gate is reviewed and recorded.
