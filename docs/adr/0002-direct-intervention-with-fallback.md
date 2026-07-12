# ADR-0002: Direct intervention with compatibility fallback

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The intended behavior is stronger than a normal reminder. When a selected app exceeds its configured continuous-use limit, the user should be redirected into Nudge and presented with a useful pending task. Android restricts background activity launches and device manufacturers apply different background policies.

## Decision

Treat direct opening of the Nudge intervention screen as the primary desired experience, but implement a fallback hierarchy rather than assuming it will work on every supported device.

Fallback order:

1. Direct intervention screen
2. Explicitly enabled interruption surface where supported
3. Policy-compliant heads-up or full-screen presentation where appropriate
4. High-priority notification with Start, Done, Different, and Later actions

Nudge will include a compatibility test and clearly communicate the active intervention method.

## Consequences

### Positive

- Product behavior matches the intended decisive interruption where possible
- The feature degrades gracefully instead of silently failing
- Device-specific reliability can be measured

### Negative

- Additional onboarding and troubleshooting screens are needed
- Behavior may vary across Android versions and manufacturers
- Play Store policy and platform restrictions require continuing review
