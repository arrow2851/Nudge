# Nudge Compose Design System

This document defines the shared native Android design layer introduced in Phase 2. The browser prototype remains the interaction reference; the Compose implementation is the reusable production contract.

## Source tokens

The native tokens map directly from `mockups/prototype/styles/tokens.css`:

- Brand green: `#216B4D`
- Light background: `#EDF2EE`
- Light surface: `#FFFFFF`
- Soft light surface: `#F5F8F5`
- Dark background: `#111713`
- Dark surface: `#19211C`
- Dark soft surface: `#212C25`
- Spacing: 4, 8, 12, 16, 20, 24, and 32 dp
- Corner radii: 12, 16, and 24 dp for common components
- Motion: 140 ms fast and 220 ms normal

Material 3 semantic roles are used for standard colors. Nudge-specific success and warning roles are exposed separately through `MaterialTheme.nudgeSemanticColors`.

## Typography

The prototype specifies Inter with system fallbacks. The Android app uses the platform sans-serif family so no font binary is bundled. The scale preserves the approved 12, 14, 16, 18, 20, 24, and 32 sp hierarchy and uses system font scaling.

## Shared components

The following components are the default building blocks for future feature slices:

- `NudgeScreenScaffold`
- `NudgeBottomNavigation`
- `NudgeButton`
- `NudgeCard`
- `NudgeListRow`
- `NudgeChip`
- `NudgeTextField`
- `NudgeEmptyState`
- `NudgeConfirmDialog`
- `NudgeBottomSheet`
- `NudgeSnackbarHost`
- `NudgeSectionLabel`

Feature code should extend these components or add a documented shared primitive instead of duplicating colors, shapes, spacing, or interaction behavior.

## Accessibility contract

- Interactive controls must provide at least a 48 dp touch target.
- Navigation destinations have explicit semantic descriptions.
- Decorative icons use no duplicate content description.
- Text uses sp and must remain functional with system font scaling.
- Components must be reviewed in light, dark, and 160% font-scale preview states.
- Color cannot be the only indicator of meaning.

## Visual-regression strategy

Phase 2 establishes a preview-driven baseline:

1. `NudgeDesignSystemPreviews.kt` contains the canonical light, dark, and large-text component states.
2. Each shared-component change must be reviewed against all three previews before merge.
3. Navigation and modal behavior remain covered by emulator instrumentation tests.
4. When feature screens begin producing stable data states, screenshot baselines will be added per destination and uploaded from CI as review artifacts.
5. Baseline changes must be intentional and described in the pull request; screenshots are never updated only to silence a failure.

The preview matrix is the Phase 2 visual contract. Automated pixel comparison is deferred until stable feature-screen fixtures exist, avoiding noisy baselines for placeholder content.

## Usage rule

No product feature logic belongs in `MainActivity` or the design-system package. Screens own feature state; shared components own presentation and reusable interaction behavior.
