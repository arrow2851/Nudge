# Decision — Ambient Glass Intervention-to-action

**Version:** `0.11.6`  
**Date:** 2026-08-02

## Decision

Ambient Glass may use selective translucency, blur, glow, gradients, and atmospheric depth for the Intervention-to-action presentation only when the complete flow remains understandable with every effect removed.

## Required behavior

- The shared Prompt, Active, Completed, and Dismissed phases remain unchanged.
- Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today remain reversible.
- Continuing the current app remains a complete and valid choice.
- Routine Completion and Task hierarchy state remain unchanged.

## Presentation boundary

- State is communicated with explicit text, headings, facts, and controls.
- Aurora and orb elements are decorative and hidden in reduced-transparency and forced-colors modes.
- Blur is limited to high-value surfaces rather than every row.
- The main suggestion card remains mostly solid.
- No-backdrop-filter and Reduced Transparency modes use solid backgrounds.

## Motivation boundary

- No glow score, streak, points, ranking, performance measurement, countdown, monitoring, or negative dismissal state.
- Atmospheric polish must not make completion feel more morally valuable than continuing the current app.

## Evidence boundary

Source-level fallback and accessibility contracts are implemented. Lower-end paint/compositing measurements, exact-checkout browser execution, physical Android testing, and actual screen-reader testing remain pending.
