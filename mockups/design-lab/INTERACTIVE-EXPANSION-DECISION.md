# Interactive Expansion Decision Record

**Design Lab milestone:** `0.8.7`  
**Status:** Approved; visual-selection gate resolved  
**Branch:** `feature/design-lab`

## Approved strategy

The user selected **Option A: one pure-Look vertical slice at a time**.

The visual gallery remains intact. Implementing one Look first does not reject, delete, merge, or permanently select that design.

## Delegated selection

The user delegated the first Look and the complete remaining order to the assistant and stated that future routine messages will simply say `go`.

### Selected implementation order

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

The rationale and acceptance gates are recorded in [`PURE-LOOK-IMPLEMENTATION-ORDER.md`](PURE-LOOK-IMPLEMENTATION-ORDER.md).

This is a learning and technical-risk sequence, not a ranking or elimination list.

## First vertical slice

The first interactive implementation is the **Routine Completion Loop** in Look #4 — Zen Focus.

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Updated recurrence and next-action state
→ Undo or reopen
```

## Why Look #4 begins

Zen Focus best represents Nudge's low-pressure emotional model. It is the strongest first test of whether the product can make urgency, navigation, completion, recurrence, and undo clear without becoming visually demanding or guilt-driven.

Look #3 follows immediately afterward to test the same behavior under a denser operational system.

## Approved state boundary

The first slice uses isolated deterministic prototype state inside `mockups/design-lab/`.

Approved:

- Seeded local fixtures.
- Temporary session or local prototype state.
- Explicit semantic state interfaces.
- Browser-history behavior.
- Reset Review State.

Not approved:

- Production backend integration.
- Account synchronization.
- Permanent data migration.
- Notifications or operating-system app blocking.
- Production application storage changes.

## Look switching boundary

Look switching remains a **Design Lab review control**. It is not introduced as a user-facing product theme feature.

Under Option A, the first slice is implemented and certified in one Look at a time. Gallery switching may continue to show the existing static directions, but unfinished Looks must not imply that they contain the interactive slice.

## Look #1 boundary

Look #1 remains the protected baseline under `mockups/prototype/` and is outside the pure-Look implementation sequence.

Promoting Look #1 into the interactive architecture would require a separate explicit decision.

## Routine Completion Loop states

Each Look must eventually support:

- Normal Day.
- Heavy Backlog.
- All Clear.
- New or unconfigured Area.
- Long Content.
- Large Text.
- Chore incomplete.
- Chore completing.
- Chore completed.
- Recurrence advanced.
- Safe undo or reopen.

## Acceptance gates for each Look

- The full scripted path is usable from Today through undo or reopen.
- Completion and undo are keyboard reachable.
- Browser Back and Forward preserve valid state.
- Large Text does not hide the primary action.
- Long names and recurrence labels do not overflow horizontally.
- Status is never represented by color alone.
- Primary actions remain reachable on short screens.
- Product meaning remains equivalent to the approved flow.
- No production integration is introduced.

## Later feature order

After every active Look receives the Routine Completion Loop:

1. Task hierarchy loop.
2. Intervention-to-action loop.
3. Reusable Lists loop.

The same Look order applies to later features unless a documented technical dependency requires a change.

## Automatic continuation rule

Routine `go` messages advance to the next unchecked milestone in the recorded sequence without another visual-selection question.

A hard stop is still required before:

- Changing the agreed flow or feature order.
- Introducing material routing, storage, architecture, or deployment changes outside the isolated prototype boundary.
- Editing Look #1.
- Adding product-facing themes.
- Merging into `main`.

## Next active milestone

Build the Look #4 Routine Completion Loop foundation: deterministic state model, Today / Needs Attention entry, Area and Section navigation, Chore detail, completion, recurrence advancement, and undo or reopen.
