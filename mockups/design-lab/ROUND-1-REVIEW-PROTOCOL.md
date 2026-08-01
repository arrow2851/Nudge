# Nudge Design Lab — Round 1 Review Protocol

This protocol creates comparable browser, device, accessibility, and screenshot evidence for Look #1 and Looks #2, #3, #4, and #6.

## 1. Local setup

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080` in a Chromium browser and Firefox. Use the same Design Lab commit and version for the entire scoring session.

## 2. Capture modes

Append one of these parameters to any Design Lab route:

- `capture=labelled` — hides review controls, fixes the phone frame at 390 × 844 on desktop, fixes the status time at 9:41, and adds a Look/screen/scenario/version evidence label.
- `capture=phone` — shows only the stable phone frame without the evidence label.

Examples:

```text
?look=2&screen=areas&scenario=normal&capture=labelled
?look=3&screen=area&area=kitchen&scenario=backlog&capture=labelled
?look=4&screen=intervention&scenario=normal&capture=phone
?look=6&screen=areas&scenario=large-text&capture=labelled
```

Capture mode is intentionally presentation-only. Use normal routes for interaction, history, keyboard, and responsive testing.

## 3. Canonical comparison routes

Review these three routes first for every active Look:

```text
?look=<LOOK>&screen=areas&scenario=normal
?look=<LOOK>&screen=area&area=kitchen&scenario=backlog
?look=<LOOK>&screen=intervention&scenario=normal
```

Then review these stress routes:

```text
?look=<LOOK>&screen=areas&scenario=new
?look=<LOOK>&screen=areas&scenario=clear
?look=<LOOK>&screen=areas&scenario=large
?look=<LOOK>&screen=area&area=kitchen&scenario=long
?look=<LOOK>&screen=intervention&scenario=long
?look=<LOOK>&screen=area&area=kitchen&scenario=large-text
?look=<LOOK>&screen=intervention&scenario=large-text
```

Replace `<LOOK>` with `2`, `3`, `4`, or `6`. Use `ROUND-1-ROUTES.md` for the full matrix.

## 4. Viewport matrix

| Purpose | CSS viewport |
|---|---:|
| Narrow Android-like phone | 360 × 800 |
| Canonical phone | 390 × 844 |
| Large Android-like phone | 412 × 915 |
| Short constrained phone | 390 × 700 |
| Landscape smoke test | 844 × 390 |
| Desktop review controls | 1440 × 900 |

At each phone viewport, verify that the final action and bottom navigation remain reachable through scrolling. Do not treat intentional vertical scrolling as failure.

## 5. Browser behavior checklist

Use normal routes rather than capture mode.

- Open every canonical route directly in a fresh tab.
- Switch Looks while preserving the current screen and scenario.
- Switch scenarios while on Areas and Intervention.
- Open Kitchen from Areas, then use browser Back and Forward.
- Use the in-app back action from Area detail.
- Use Reset Review State and verify the default route returns.
- Try invalid Look, screen, scenario, and Area values and verify safe fallback behavior.
- Click every simulated Round 1 action and verify a readable toast appears.
- Confirm no console errors during all preceding actions.

## 6. Keyboard-only walkthrough

Starting at the top of the page:

- Use the skip link to reach the phone preview.
- Tab through Look, screen, scenario, and reset controls.
- Confirm every focused control has a visible focus indicator.
- Confirm selected review controls expose `aria-pressed=true`.
- Confirm the active Areas navigation item exposes `aria-current=page`.
- Open an Area card using Enter and Space.
- Tab through completion, Section, and Intervention actions.
- Confirm focus never becomes trapped inside the phone preview or review panel.
- Confirm horizontal mobile control rows can still be reached and scrolled.

## 7. Screen-reader smoke test

Use one desktop screen reader and one mobile screen reader when available.

Verify:

- The current Look and scenario are reflected in the page title.
- Areas announce name, status, routine count, Section count, and next action without excessive duplication.
- Area-detail headings and groups form a logical reading order.
- Routine completion controls announce the routine they affect.
- Status is conveyed in text rather than color alone.
- Section rows announce configured or unconfigured state.
- Intervention time, app, suggested task, location, and actions are understandable.
- Toast feedback is announced once through the status live region.
- Whole-screen updates are not so verbose that route changes become unusable.

Record the screen reader, browser, operating system, and any announcement defects.

## 8. Forced-colors and reduced-motion review

In a browser that supports forced colors:

- Enable a high-contrast theme.
- Verify text, borders, check controls, active navigation, buttons, and status remain visible.
- Verify decorative material effects disappear without removing meaning.
- Verify no status depends on a background fill alone.

With reduced motion enabled:

- Switch Looks, scenarios, and routes.
- Confirm no essential state change depends on animation.

## 9. Stress-scenario evidence

For each Look, record pass, concern, or failure for:

- Heavy Backlog: all attention items remain accessible.
- New User: the first action is obvious and emotionally appropriate.
- All Clear: the interface remains useful without manufacturing urgency.
- Large Household: Work and Personal content still feels native.
- Long Content: labels wrap without hiding actions or statuses.
- Large Text: text enlarges without clipping or action loss.

## 10. Screenshot rules

Canonical evidence uses `capture=labelled` at a desktop browser viewport large enough to show the complete 390 × 844 phone frame.

Required core captures per Look:

1. Areas · Normal Day
2. Kitchen Area detail · Heavy Backlog
3. Intervention · Normal Day

Required stress captures where a concern is found:

- New User
- All Clear
- Large Household
- Long Content
- Large Text
- Narrow or short viewport
- Forced colors

Filename convention:

```text
look-<id>__<screen>__<scenario>__<viewport>__v0.7.0.png
```

Examples:

```text
look-3__areas__normal__390x844__v0.7.0.png
look-4__area-kitchen__backlog__390x844__v0.7.0.png
look-6__intervention__long__360x800__v0.7.0.png
```

Store approved evidence under `mockups/design-lab/screenshots/` only after captures are actually produced.

## 11. Scoring workflow

- Complete the full evidence order before assigning final scores.
- Fill qualitative notes before calculating totals.
- Score Look #1 using equivalent content and the same rubric.
- Use `ROUND-1-SCORECARD.md` as the source document.
- Do not modify comparison criteria after scoring begins without the documented hard stop.
- Do not begin Round 2 until finalists and non-finalist dispositions are explicitly recorded.

## 12. Evidence record

For each test session, record:

- Commit SHA and Design Lab version
- Browser and version
- Operating system
- Viewport or physical device
- Keyboard/screen-reader/forced-colors settings
- Route tested
- Result: Pass / Concern / Fail / Not tested
- Screenshot filename when applicable
- Concise observation and any blocking defect
