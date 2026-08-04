# Android Phases 9–11 closeout

**Branch:** `feature/android-app-development`  
**Development version:** `0.10.0-dev`  
**Implementation CI:** Android CI #350, run `30881020756`  
**Status:** Code-complete for the emulator-verifiable scope; physical-device and store-release gates remain.

## Phase 9 — Direct Android intervention

### Completed

- [x] Explicit Usage Access onboarding
- [x] Notification permission onboarding on supported Android versions
- [x] Installed launcher-app discovery and user selection
- [x] Local `UsageStatsManager` event reader
- [x] Deterministic selected-app session calculation
- [x] Screen-off and non-selected-app session reset
- [x] Optional combined sessions across selected apps
- [x] Gentle, Balanced, and Strict modes
- [x] Configurable usage threshold
- [x] Configurable maximum suggested-action duration
- [x] Quiet hours
- [x] Per-prompt cooldown
- [x] Daily prompt maximum
- [x] Timed pause
- [x] Shared recommendation-engine integration
- [x] Recent-suggestion and dismissal-history integration
- [x] Opt-in visible foreground monitoring service
- [x] Notification-based compatibility path
- [x] Start, Different, Not now, and Pause actions
- [x] Focus screen with countdown
- [x] Complete recommended Task or Chore from the intervention
- [x] Compatibility diagnostics screen
- [x] JVM tests for session and safeguard logic

### Deliberate compatibility decisions

- Nudge does not use an Accessibility Service.
- Nudge does not request draw-over-other-apps permission.
- Nudge does not force an Activity over another foreground app.
- The intervention is delivered through a high-priority notification that the user taps.
- Monitoring is always visible through a foreground-service notification.
- Monitoring does not automatically restart after reboot until physical-device behavior is validated.

## Phase 10 — Notifications, actions, and quick access

### Completed

- [x] Monitoring notification
- [x] Intervention notification
- [x] Start action
- [x] Different Task action
- [x] Not now action
- [x] Pause for one hour action
- [x] Quick Add home-screen widget
- [x] Pause Interventions home-screen widget
- [x] Quick Add launcher shortcut
- [x] Intervention Settings launcher shortcut
- [x] Global Quick Add writes a real one-time Task
- [x] Optional Android system voice transcription for Quick Add
- [x] Safe fallback when system voice input is unavailable
- [x] Quick Add persistence covered by the emulator regression

### Later enhancements

- [ ] Data-rich Today widget
- [ ] Next Task widget
- [ ] Grocery/List widget
- [ ] Quick Settings tiles
- [ ] Rich notification completion controls for every domain type

These are enhancements rather than blockers for a closed beta. They need dedicated update scheduling, widget-state, and device-launcher testing.

## Phase 11 — Testing, backup, and release hardening

### Completed in code and automation

- [x] Android Auto Backup remains enabled for Room and DataStore
- [x] User-controlled JSON export through Android's document picker
- [x] Additive JSON restore
- [x] Portable backup includes active Areas, Sections, Tasks, Main Task flags, Chores, schedules, Lists, List Items, and app preferences
- [x] Backup format versioning and newer-format rejection
- [x] Backup/restore user interface
- [x] Privacy and intervention behavior documented
- [x] Physical-device release checklist documented
- [x] Lint passes
- [x] JVM unit tests pass
- [x] Room schema and migration checks pass
- [x] Debug APK assembles
- [x] Full Android emulator regression passes
- [x] APK, schema, verification, and instrumentation artifacts are produced by CI

### Remaining manual release gates

- [ ] Install and test the APK on a physical Samsung device
- [ ] Test on Pixel, Motorola, and at least one additional manufacturer
- [ ] Validate Android 12 through the current target-version matrix
- [ ] Measure battery impact with monitoring enabled
- [ ] Verify behavior after Usage Access revocation
- [ ] Verify behavior when notifications are disabled
- [ ] Verify selected-app switching and screen-off behavior on physical devices
- [ ] Verify manufacturer battery-optimization guidance
- [ ] Complete TalkBack, switch-access, and large-text review
- [ ] Review Google Play foreground-service declarations and policy copy
- [ ] Create production privacy policy
- [ ] Configure release signing
- [ ] Produce and test signed release build upgrades
- [ ] Create store listing assets
- [ ] Run closed beta and collect compatibility reports

## Gemini and cloud boundary

A real Gemini implementation is intentionally not included in this pass. It requires a secure backend gateway, protected credentials, rate and cost controls, structured function schemas, privacy copy, and user confirmation before mutations. No Gemini or OpenAI API key should be embedded in the APK.

## Verification evidence

Android CI #350, run `30881020756`, passed both jobs on commit `0217c67f67f4cf4fde3b1349de2b6124df76c8a6`:

- **Lint, test, and assemble** — job `91902260494`
- **Emulator install and navigation smoke test** — job `91903240383`

The emulator regression includes the production navigation shell and complete Tasks, recurring-care, reusable-Lists, Today, database, recurrence, recommendation, and persistent Quick Add workflows.

## Current product status

The organizer, recurrence, recommendation, intervention, quick-access foundation, voice-assisted Quick Add, and portable backup are implemented. Nudge is suitable for physical-device testing and a controlled internal alpha. It is not yet Play Store ready because manufacturer compatibility, battery, accessibility, policy, signing, and closed-beta work cannot be completed through emulator automation alone.
