# Android intervention, quick access, backup, and release boundary

This document describes the native Android behavior introduced after the organizer and recommendation engines. It is intentionally explicit about permissions, reliability, privacy, and the work that still requires physical-device validation.

## Intervention approach

Nudge does not use an accessibility service, draw-over-other-apps permission, or a forced blocking overlay. Android restricts background activity launches, so the reliable compatibility path is:

1. The user explicitly grants Usage Access.
2. The user selects distracting apps and starts monitoring.
3. A visible foreground-service notification remains present while monitoring is enabled.
4. Usage events are read locally to calculate the current selected-app session.
5. The existing recommendation engine chooses an eligible Task or Chore.
6. Nudge posts a notification with **Start**, **Different**, and **Not now** actions.
7. The user taps the notification to open the focused intervention screen.

The intervention screen provides a simple focus timer, completion, alternative-task selection, and dismissal. Completing a Task or Chore uses the same repositories as the rest of the app.

## User controls

The settings screen includes:

- Explicit enable and disable controls
- Installed launcher-app selection
- Gentle, Balanced, and Strict modes
- App-use limit
- Maximum suggested-action duration
- Per-prompt cooldown
- Daily prompt maximum
- Optional combined sessions across selected apps
- Quiet-hour presets
- One-hour pause from the monitoring notification or home-screen widget
- A compatibility check that reports whether Usage Access works and whether a selected app is currently detected

Monitoring never starts merely because the app is installed. It requires permission, at least one selected app, notification access on supported Android versions, and an explicit start action.

## Session and recommendation behavior

- A session begins when a selected app moves to the foreground.
- A non-selected foreground app ends the session.
- Turning the screen off ends the session.
- Combined-session mode can bridge a short switch between selected apps.
- Quiet hours, pauses, cooldowns, and daily maximums are evaluated before reserving a recommendation.
- Recently suggested and repeatedly dismissed items are penalized by the shared recommendation engine.
- An overdue item remains overdue until completion or explicit skip.

## Privacy

- Usage events remain on the device.
- Nudge does not upload an app-usage history.
- No account is required for intervention monitoring.
- The monitoring notification clearly indicates when the foreground service is active.
- Portable backup files are created only when the user selects an Android document destination.

## Quick access

The native app includes:

- A **Quick Add** home-screen widget
- A **Pause interventions for one hour** home-screen widget
- A **Quick Add** launcher shortcut
- An **Interventions** launcher shortcut
- Notification actions for Start, Different, Not now, and Pause

Additional data-rich widgets such as Today, Next Task, and Grocery remain later enhancements because they require update scheduling and broader widget-specific UI testing.

## Backup behavior

Android Auto Backup and device transfer remain enabled for the complete Room database and DataStore preferences.

Nudge also provides a user-controlled JSON export and restore flow for active organizer data:

- Areas and Sections
- Tasks and Main Task flags
- Chores and schedules
- Lists and list items
- App preferences

Restore is additive: matching IDs are updated and missing records are inserted. Unrelated existing records are not erased. The portable JSON format currently excludes completion-history events; those remain in the full Android system backup.

## Compatibility and release boundary

The implementation can be compiled and tested on an emulator, but intervention reliability must still be validated on physical devices because manufacturers differ in background-process and battery-management behavior.

Before public release, complete at least:

- Samsung, Pixel, Motorola, and one additional manufacturer test pass
- Android 12 through the current target-version matrix
- Screen-off, app-switching, reboot, permission-revocation, and notification-disabled scenarios
- Foreground-service battery-impact measurement
- Large-text, TalkBack, and switch-access review
- Privacy-policy and Google Play foreground-service declaration review
- Signed release build and upgrade test
- Closed beta with compatibility-report collection

The app does not automatically restart monitoring after a device reboot. Requiring the user to reopen Nudge and start monitoring avoids hidden persistence until reboot behavior and manufacturer testing are approved.

## Gemini boundary

Real Gemini or voice-assisted entry is not included in the local Android completion pass. A production implementation requires a secure backend gateway, credentials, rate limits, privacy copy, cost controls, structured function schemas, and confirmation for proposed mutations. No API key should be embedded in the APK.
