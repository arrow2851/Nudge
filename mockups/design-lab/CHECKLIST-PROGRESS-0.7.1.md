# Design Lab Checklist Progress — 0.7.1

This milestone maps the protected Look #1 baseline to the shared Round 1 comparison without changing `mockups/prototype/`, the shortlist, scenario meaning, or the selection gate.

## Completed

- [x] Document Look #1 Soft Practical Utility principles, strengths, risks, and source-of-truth traits
- [x] Add `look1-reference.html` as a comparison-only page outside the active Look selector
- [x] Reuse the shared Design Lab fixture and all seven scenarios
- [x] Map equivalent Areas overview and Kitchen Area detail states
- [x] Add a visibly labeled comparison-only Intervention extrapolation
- [x] Support labelled and phone-only capture modes
- [x] Support narrow-phone, Large Text, focus, forced-colors, and reduced-motion foundations
- [x] Add Look #1 routes and limitations to the review protocol
- [x] Add the limitation to the shared scorecard
- [x] Extend static validation coverage to the Look #1 reference files and shared-fixture import
- [x] Update Design Lab metadata to `0.7.1`
- [x] Keep every change under `mockups/design-lab/`

## Validation performed

- `look1-reference.js` passed `node --check` locally before commit
- `look1-reference.css` had balanced braces locally before commit
- The reference page imports `fixtures.js` rather than defining Look-specific scenario data
- The protected prototype remains unchanged

## Remaining evidence

- Complete-checkout validator execution
- Real-browser route and console checks
- Phone viewport and landscape walkthroughs
- Keyboard and screen-reader smoke tests
- Forced-colors inspection
- Canonical and concern-specific screenshots
- Completed Look #1 and audition scorecards

## Next active milestone

Execute the shared evidence protocol, capture the five-direction comparison set, and complete the scorecard before the mandatory Round 1 selection gate.
