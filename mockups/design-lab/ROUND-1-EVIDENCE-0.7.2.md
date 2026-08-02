# Nudge Design Lab — Round 1 Evidence 0.7.2

**Date:** 2026-08-01  
**Branch:** `feature/design-lab`  
**Draft review PR:** #1  
**Directions:** Look #1 baseline and Looks #2, #3, #4, and #6

## Evidence environment

The connected repository could be read and updated, but direct GitHub cloning and browser navigation to local/file URLs were blocked by the execution environment. The Design Lab was therefore reconstructed from the draft PR patch into an isolated local bundle and executed in headless Chromium with the same shared fixture, JavaScript modules, CSS, routes, and capture markup.

External Google Fonts were unavailable in the isolated browser. Installed Inter and standard fallbacks were used. This is sufficient for structural, responsive, interaction, overflow, and comparative hierarchy evidence, but final typography preference should still be reviewed in the normal preview environment.

## Blocking issue found and corrected

The browser pass found that the root `<html>` element and the Look selector buttons both used `data-look`. The global handler used:

```js
event.target.closest('[data-look]')
```

Because every preview control is inside `<html data-look="…">`, clicks that were not directly on a Look button resolved to the root element and were handled as Look switches. This intercepted Area navigation, scenario and screen controls, reset, bottom navigation, and Intervention actions.

The handler and semantic synchronizer now target only `button[data-look]`. Post-fix interaction checks passed.

## Automated browser results

| Check | Result |
|---|---:|
| Static required-file/import/fixture/route/version/CSS validation | Pass |
| Direct routes across 5 directions × 3 screens × 7 scenarios | **105 / 105** |
| Canonical viewport checks across six viewport sizes | **90 / 90** |
| Stress-state routes | **35 / 35** |
| Long Content and Large Text action reachability after scrolling | **10 / 10** |
| Canonical labelled captures | **15 / 15** |
| Accessibility-tree buttons without names | **0 of 28** |
| Keyboard focus samples with visible focus | **14 / 14** |
| Keyboard Enter opens the focused Area | Pass |
| Forced-colors emulation without runtime errors | **5 / 5 directions** |
| Reduced-motion emulation without runtime errors | **5 / 5 directions** |

No horizontal overflow was detected in the document or phone screen during the route, viewport, or stress matrices.

## Post-fix interaction evidence

- Opening Kitchen changes the route to `screen=area&area=kitchen`.
- Returning through the history-state path restores Areas.
- Switching from Look #2 to Look #4 preserves the Heavy Backlog scenario.
- Reset Review State restores Look #2 · Areas · Normal Day.
- Intervention Start produces the expected live-region toast.
- Active Look controls expose `aria-pressed="true"`.
- Active Areas navigation exposes `aria-current="page"`.
- Invalid Look, screen, scenario, and Area values fall back to Look #2 · Areas · Normal Day.
- Keyboard Enter on the focused Kitchen row opens Kitchen.

## Canonical captures

The evidence package contains three labelled captures for each direction:

1. Areas · Normal Day
2. Kitchen Area detail · Heavy Backlog
3. Intervention · Normal Day

A ZIP contains all 15 captures. Three contact sheets provide direct five-direction comparison for the scored moments.

## Visual stress findings

### Look #1 — Soft Practical Utility

- Strongest familiar card hierarchy and clearest conventional controls.
- New User and ordinary Areas states are immediately understandable.
- Card repetition becomes vertically heavy in Large Household and Long Content.
- Intervention evidence remains comparison-only; the production baseline has no approved equivalent.

### Look #2 — Warm Editorial

- Strong personality and calm editorial hierarchy.
- Area lists remain readable at scale, though display headings consume more vertical space in Long Content and Large Text.
- Intervention is humane and clear but visually less immediate than the strongest action-led treatments.

### Look #3 — Precision Minimal

- Fastest scanning and strongest Large Household/Long Content scalability.
- Dense aligned metadata performs well without horizontal overflow.
- The operational tone is less emotionally warm, and some monospaced supporting text requires deliberate attention.

### Look #4 — Zen Focus

- Calmest Intervention and strongest single-next-action framing.
- All required information remains available beneath the focus treatment.
- The focus card costs vertical density in Large Household and Long Content, but content remains reachable.

### Look #6 — Tactile Household

- Most distinctive material identity and clear physical-control metaphor.
- Decorative structure consumes the most space in dense and long-content states.
- Work and Personal content are understandable, but the maintenance-board metaphor feels less naturally universal than Looks #3 or #4.

## Evidence limitations still open

- No physical Android or iOS device was available.
- No actual NVDA, JAWS, VoiceOver, or TalkBack session was performed.
- Native browser Back/Forward could not be exercised against a normal HTTP origin because local/file navigation was blocked; the same History API state and `popstate` path was exercised in the isolated harness.
- Forced colors and reduced motion were emulated rather than inspected on a physical configured system.
- Final preference scoring still requires the product owner's review of the captures and repeated-use expectations.

These limitations do not invalidate the structural browser evidence, but they remain open before a final production migration decision.
