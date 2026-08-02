# Design Lab Browser Review Routes

Use these routes after starting the local server:

```bash
cd mockups/design-lab
python -m http.server 8080
```

Base URL:

```text
http://localhost:8080/
```

## Active gallery Looks

Replace `<LOOK>` with `2`, `3`, `4`, `5`, `6`, `7`, `8`, or `9`.

## Canonical screen routes

```text
?look=<LOOK>&screen=areas&scenario=normal
?look=<LOOK>&screen=area&area=kitchen&scenario=normal
?look=<LOOK>&screen=intervention&scenario=normal
```

## Stress scenarios

Run each route for all eight active gallery Looks.

| Scenario | Areas overview | Area detail | Intervention |
|---|---|---|---|
| Normal Day | `?look=<LOOK>&screen=areas&scenario=normal` | `?look=<LOOK>&screen=area&area=kitchen&scenario=normal` | `?look=<LOOK>&screen=intervention&scenario=normal` |
| Heavy Backlog | `?look=<LOOK>&screen=areas&scenario=backlog` | `?look=<LOOK>&screen=area&area=kitchen&scenario=backlog` | `?look=<LOOK>&screen=intervention&scenario=backlog` |
| New User | `?look=<LOOK>&screen=areas&scenario=new` | Area detail is intentionally unavailable | `?look=<LOOK>&screen=intervention&scenario=new` |
| All Clear | `?look=<LOOK>&screen=areas&scenario=clear` | `?look=<LOOK>&screen=area&area=kitchen&scenario=clear` | `?look=<LOOK>&screen=intervention&scenario=clear` |
| Large Household | `?look=<LOOK>&screen=areas&scenario=large` | `?look=<LOOK>&screen=area&area=work&scenario=large` | `?look=<LOOK>&screen=intervention&scenario=large` |
| Long Content | `?look=<LOOK>&screen=areas&scenario=long` | `?look=<LOOK>&screen=area&area=kitchen&scenario=long` | `?look=<LOOK>&screen=intervention&scenario=long` |
| Large Text | `?look=<LOOK>&screen=areas&scenario=large-text` | `?look=<LOOK>&screen=area&area=kitchen&scenario=large-text` | `?look=<LOOK>&screen=intervention&scenario=large-text` |

The active matrix contains **168 Look/screen/scenario combinations**.

## Look #1 reference routes

```text
look1-reference.html?screen=areas&scenario=normal
look1-reference.html?screen=area&area=kitchen&scenario=backlog
look1-reference.html?screen=intervention&scenario=normal
```

The Look #1 Intervention remains a visibly labeled comparison-only extrapolation.

## Invalid-route checks

```text
?look=999&screen=areas&scenario=normal
?look=2&screen=missing&scenario=normal
?look=2&screen=areas&scenario=missing
?look=2&screen=area&area=missing&scenario=normal
```

Expected behavior:

- Invalid Look falls back to Look #2.
- Invalid screen falls back to Areas.
- Invalid scenario falls back to Normal Day.
- Invalid Area shows the safe unsupported-state message.

## Browser history checks

1. Open an Areas route.
2. Open an Area card.
3. Change scenario.
4. Change Look.
5. Use browser Back repeatedly.
6. Use browser Forward repeatedly.

The Look, screen, scenario, and Area must follow the URL without stale content.

## Viewports

- 360 × 800
- 390 × 844
- 412 × 915
- 390 × 700 short viewport
- 844 × 390 landscape smoke test
- 1440 × 900 desktop review panel

## Evidence to record

For each Look, record console errors, horizontal overflow, clipped actions, wrapping problems, tab order, screen-reader output, strongest and weakest scenarios, and reusable components.

No ranking or elimination is required. Evidence may instead identify where each Look performs best and what controlled synthesis combinations are coherent.
