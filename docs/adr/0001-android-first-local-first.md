# ADR-0001: Android-first and local-first

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The defining feature depends on Android app-usage information, direct intervention behavior, notifications, widgets, and quick settings. Core household data should remain useful without connectivity or an account.

## Decision

Build Nudge as a native Android application using Kotlin and Jetpack Compose. Store core data locally with Room and preferences with DataStore. Make accounts, synchronization, and cloud backup optional later additions.

## Consequences

### Positive

- Best access to Android platform capabilities
- Fast offline operation
- No sign-up friction
- Strong privacy baseline
- Simpler initial backend requirements

### Negative

- iOS is not part of the initial implementation
- Multi-device synchronization is deferred
- Database migration discipline is required
