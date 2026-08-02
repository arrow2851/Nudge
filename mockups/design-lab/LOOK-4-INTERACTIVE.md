# Look #4 — Zen Focus Interactive Routine Completion Loop

**Design Lab version:** `0.9.0`  
**Branch:** `feature/design-lab`  
**Status:** Implemented and smoke-tested in the isolated Design Lab

## Purpose

This milestone turns Look #4 from a static comparison direction into the first pure-Look interactive vertical slice. The flow tests whether Nudge can make household upkeep actionable without becoming demanding or guilt-driven.

## Implemented flow

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention counts update
→ Undo or reopen
```

## Routes

Look #4 supports six routed views:

- `today`
- `areas`
- `area`
- `section`
- `chore`
- `intervention`

The interactive path uses `area`, `section`, and `chore` query parameters. Browser Back and Forward restore the routed view while completion state remains independently stored for the current browser session.

Example:

```text
?look=4&screen=chore&scenario=normal&area=kitchen&section=Countertops%20%26%20Surfaces&chore=kitchen-wipe-stovetop-1
```

## Deterministic state boundary

The slice uses a separate Design Lab session-storage namespace:

```text
nudge-design-lab-review-v1:routine-completion-v1
```

No production data, application storage, account state, network service, or backend contract is used.

Each routine receives a deterministic identifier and one of three prototype recurrence tiers inferred from the existing fixture:

- Light
- Moderate
- Deep

Completing a routine stores its previous status, next status, completion label, and deterministic next-cycle label. Reopening removes that completion record and restores the original fixture state.

## Completion behavior

Completion performs all of the following:

1. Marks the selected routine complete.
2. Moves overdue or due-today work to the upcoming state.
3. Recalculates Today and Area attention counts from the resulting data.
4. Displays the advanced recurrence state on Chore detail.
5. Keeps Undo immediately available.
6. Preserves the completion while navigating within the same scenario.

Completing from Today, Area detail, or Section opens the completed Chore detail so the reversible state is visible immediately.

## Supported scenario states

- Normal Day
- Heavy Backlog
- New User
- All Clear
- Large Household
- Long Content
- Large Text

The same fixture remains authoritative. Interactive completion state is applied after cloning the selected scenario, so the shared source data is not mutated.

## Accessibility and responsive behavior

- Completion and Undo use native buttons.
- Critical interactive controls meet a 48 × 48 px target floor.
- Visible focus indicators are provided.
- Status is written in text and is not communicated by color alone.
- Long labels use wrapping rather than horizontal clipping.
- Chore facts and routine rows reflow on narrow phones.
- Large Text increases operational copy and stacks status content.
- Forced-colors treatment uses system colors.
- Reduced-motion treatment disables nonessential transitions and animation.

## Validation performed

Source and module checks:

- `node --check` passed for state, interactive state, controls, application controller, Look #4 renderer, and validator files.
- Deterministic completion, persistence, application, and reopen behavior passed module-level tests.
- Route parsing and serialization passed for Area, Section, and Chore paths.
- Renderer checks passed for Today, Areas, Area detail, Section, Chore detail, completed state, and Undo markup.
- The reconstructed validator passed required-file, import, fixture, renderer, route, interactive-contract, version, stylesheet-order, and CSS-balance checks.

Browser presentation and interaction smoke checks:

- Today → Areas → Area → Section → Chore navigation.
- Completion and immediate completed-state presentation.
- Undo and original-state restoration.
- Direct completion from Today opening reversible Chore detail.
- Browser-history route behavior.
- New User and All Clear states.
- Long Content and Large Text.
- Keyboard Enter activation.
- Forced colors and reduced motion.
- 360 × 800, 390 × 844, 412 × 915, 390 × 667, and 844 × 390 viewports.
- No tested horizontal-overflow failure.
- Critical tested controls at or above 48 px.

## Evidence boundary

The browser smoke run used an injected reconstruction of the committed modules because direct repository checkout and local navigation remain restricted in the execution environment. It validates the committed interaction contract and presentation fragments, but it is not represented as an exact complete-checkout browser run.

Still pending:

- Exact complete-checkout validator execution.
- Physical Android testing.
- Actual screen-reader smoke testing.
- Single-build all-Look browser regression.

## Explicit exclusions

- Area or routine creation.
- Editing recurrence rules.
- Calendar or notification integration.
- Production persistence or backend integration.
- Task hierarchy.
- Intervention-to-action behavior.
- Reusable Lists.
- User-facing theme selection.
- Look #1 changes.
- Merge into `main`.

## Subsequent shared-contract status

Version `0.9.1` implemented the same Routine Completion Loop in Look #3 — Precision Minimal. Looks #3 and #4 now share the deterministic semantic state, so completing or reopening a routine in either Look is reflected when switching to the other Look.

The next implementation in the recorded sequence is Look #5 — Playful Modular.
