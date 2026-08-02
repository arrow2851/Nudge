# Decision — 0.11.4 Tactile Household Intervention

## Decision

Use physical card, tray, drawer-pull, clip, tab, and filing metaphors to make the optional action tangible, while prohibiting language that suggests the household, user, or current app is broken, defective, failed, or awaiting repair.

## Product boundary

- The suggestion is an optional action card, not a work order or repair requirement.
- Picking up the card creates only an isolated prototype action state.
- Leaving the card in the tray is a complete and valid response.
- Filing the card complete creates no grade, service rating, score, streak, rank, or performance measure.
- The flow does not monitor activity, start a timer, block an app, create a production Task, or schedule a reminder.

## Presentation

- Prompt: Available Card
- Active: Card in Hand
- Completed: Filed Complete
- Dismissed: Returned to Tray

## Accessibility boundary

Every phase retains explicit text, independent controls, 48 px minimum actions, narrow- and short-screen reflow, Large Text support, visible focus, Forced Colors, and Reduced Motion handling.

## Sequence result

Intervention-to-action is implemented in five of eight active Looks. Look #2 — Warm Editorial is next.
