# Look #8 — Ambient Glass Interactive Routine Completion Loop

**Version:** `0.9.6`  
**Branch:** `feature/design-lab`  
**Status:** Implemented with source-level validation; exact-checkout browser, device, assistive-technology, and lower-end paint evidence remain pending.

## Scope

Look #8 implements the same Routine Completion Loop used by the other interactive gallery directions:

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

The implementation remains isolated to `mockups/design-lab/`. It does not add production storage, accounts, notifications, scheduling, deployment, or backend integration.

## Presentation

Ambient Glass expresses the shared behavior through:

- A quiet Today surface with one translucent priority card.
- Secondary routines held in a readable glass panel rather than hidden.
- Layered Area cards and Section panels with explicit text status.
- A focused Chore card with Area, Section, rhythm, tier, time, and status facts.
- A restrained completed-cycle panel with immediate Undo.
- Atmospheric aurora and orb decoration that never carries semantic meaning.

## Interaction contract

- Completion works from Today, Area, Section, and Chore detail.
- Completion opens or retains Chore detail so Undo is immediately available.
- Light, Moderate, and Deep recurrence labels use the shared deterministic prototype engine.
- Attention counts and All Clear derive from the same shared fixture and completion record.
- Browser-history routes preserve Look, scenario, Area, Section, and Chore identifiers.
- Switching among Looks #2 through #8 preserves semantic completion state.

## Accessibility and fallback contract

- Critical completion, detail, navigation, and Undo targets retain a 48 px minimum.
- Large Text actions reach 54 px and multi-column controls reflow.
- Completed state uses explicit text, a checkmark, and line-through rather than color alone.
- Focus-visible styling includes routine detail controls and Chore actions.
- Forced Colors removes decorative blur, gradients, and shadows.
- Reduced Motion disables animation and transition duration.
- Reduced Transparency hides aurora, glow, and orb decoration and uses solid panels.
- Browsers without backdrop-filter support receive solid panel backgrounds through `@supports not`.

## Rendering-risk boundary

The interactive layer limits backdrop blur to high-value hero surfaces and gives all critical panels opaque-enough or solid fallbacks. This reduces dependency on real-time compositing but does not prove acceptable performance on lower-end Android hardware.

Still required before making a hardware-performance claim:

- Physical lower-end Android testing.
- Paint and compositing measurements while scrolling Long Content and Large Household scenarios.
- Transparency-on versus solid-fallback comparison.
- Thermal and frame-pacing observation during repeated completion and navigation.

## Source-level checks

The static validator now requires:

- Six Look #8 renderer exports.
- `look8-interactive.css` in the audited stylesheet order.
- Completion, reopen, Section, and Chore identifiers.
- Forced Colors and Reduced Motion handling.
- Reduced Transparency and no-backdrop-filter fallbacks.
- Shared registration of Looks #2 through #8.

## Evidence not claimed

Version `0.9.6` does not claim:

- An exact complete-checkout validator execution.
- An exact complete-checkout browser interaction run.
- Physical Android validation.
- Actual screen-reader validation.
- Lower-end paint or compositing performance.
- A single-version browser regression across all Looks.

## Next direction

Look #9 — Retro Digital receives the same Routine Completion Loop next. The sequence remains a learning order, not a ranking or elimination decision.
