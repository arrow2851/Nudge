# Look #6 — Tactile Household Intervention-to-action

**Version:** `0.11.4`  
**Status:** Implemented in the isolated Design Lab  
**Shared behavior source:** `intervention-state.js`

## Purpose

Apply the shared reversible Intervention-to-action behavior to Tactile Household using physical card, tray, drawer-pull, and filing cues without implying that the household or user needs repair.

## Shared flow

```text
Available Card
→ Pick up action card
→ Card in Hand
→ File complete
→ Take back out or Undo start

Available Card
→ Pull another card
→ Deterministic alternative

Available Card
→ Leave card in tray
→ Returned to Tray
→ Pull suggestion card again
```

## Tactile presentation

- Optional action tray with a physical drawer pull and status label.
- Paper-like action card with a clip, tab, card number, and estimated duration.
- Available, Active, Completed, and Dismissed states expressed as Available Card, Card in Hand, Filed Complete, and Returned to Tray.
- Completed state includes a clipped completion slip without a score or service rating.
- Dismissed state returns the card to the tray and confirms that nothing is owed.
- Source app, fixture pause, action estimate, card position, and state remain visible as practical card facts.

## Shared behavior preserved

- Separate scenario-isolated intervention state.
- Deterministic scenario-first and routine-derived suggestions.
- Setup-safe suggestions when no Areas exist.
- Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today actions.
- Reset Review State clears intervention state.
- Routine Completion and Task hierarchy state remain unchanged.
- Intervention state persists across Looks #3, #4, #5, #6, and #7.

## Language boundary

- The optional action is a card, not a repair order.
- The current app and household are not described as broken, defective, failed, or requiring repair.
- Leaving the card in the tray is a complete response.
- Completion adds no score, grade, service rating, streak, rank, or performance measurement.
- No countdown, monitoring, app blocking, production Task, reminder, or follow-up is created.

## Accessibility and responsive contract

- Critical actions retain at least 48 px height.
- Large Text actions reach 54 px.
- Narrow screens stack the board label, facts, and completion slip.
- Short screens reduce decorative spacing while retaining every action.
- Completion uses explicit text and a checkmark in addition to styling.
- Visible keyboard focus remains present.
- Forced Colors uses system colors.
- Reduced Motion removes nonessential transitions and animations.

## Evidence boundary

Committed-source inspection and validator contracts cover the renderer export, shared actions, registration, stylesheet order, language boundary, responsive hooks, and accessibility fallbacks. Exact complete-checkout execution, physical Android testing, and actual screen-reader testing remain pending.
