# Decision — Retro Digital Intervention Language

**Version:** `0.11.7`  
**Status:** Accepted for the Design Lab

## Decision

Retro Digital may use operating-system, record, directory, and segmented-display cues, but every intervention state must remain neutral and optional.

The elapsed value is a deterministic fixture snapshot, not a live timer or monitoring claim.

## Required language boundary

- Continuing the current app is valid.
- Setting the action aside is a complete response.
- Active does not imply monitoring.
- Complete does not create a score or performance measure.
- Dismissed does not create an overdue, missed-opportunity, or follow-up state.

The renderer must not use error, failure, fault, alarm, warning, or failed-process framing for ordinary user choices.

## Scope boundary

No real app usage detection, app blocking, countdowns, notifications, production Task creation, accounts, backend integration, scoring, or production persistence is added.

## Sequence decision

With Look #9 complete, Intervention-to-action is closed across all eight active Looks. The next delegated feature loop is Reusable Lists, beginning with Look #4 — Zen Focus.
