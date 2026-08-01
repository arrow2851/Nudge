# Round 1 Browser Review Routes

Use these routes after starting the local server:

```bash
cd mockups/design-lab
python -m http.server 8080
```

Base URL:

```text
http://localhost:8080/
```

## Canonical screen routes

Replace `<LOOK>` with `2`, `3`, `4`, or `6`.

```text
?look=<LOOK>&screen=areas&scenario=normal
?look=<LOOK>&screen=area&area=kitchen&scenario=normal
?look=<LOOK>&screen=intervention&scenario=normal
```

## Stress scenarios

Run each route for all four Looks.

| Scenario | Areas overview | Area detail | Intervention |
|---|---|---|---|
| Normal Day | `?look=<LOOK>&screen=areas&scenario=normal` | `?look=<LOOK>&screen=area&area=kitchen&scenario=normal` | `?look=<LOOK>&screen=intervention&scenario=normal` |
| Heavy Backlog | `?look=<LOOK>&screen=areas&scenario=backlog` | `?look=<LOOK>&screen=area&area=kitchen&scenario=backlog` | `?look=<LOOK>&screen=intervention&scenario=backlog` |
| New User | `?look=<LOOK>&screen=areas&scenario=new` | Area detail is intentionally unavailable | `?look=<LOOK>&screen=intervention&scenario=new` |
| All Clear | `?look=<LOOK>&screen=areas&scenario=clear` | `?look=<LOOK>&screen=area&area=kitchen&scenario=clear` | `?look=<LOOK>&screen=intervention&scenario=clear` |
| Large Household | `?look=<LOOK>&screen=areas&scenario=large` | `?look=<LOOK>&screen=area&area=work&scenario=large` | `?look=<LOOK>&screen=intervention&scenario=large` |
| Long Content | `?look=<LOOK>&screen=areas&scenario=long` | `?look=<LOOK>&screen=area&area=kitchen&scenario=long` | `?look=<LOOK>&screen=intervention&scenario=long` |
| Large Text | `?look=<LOOK>&screen=areas&scenario=large-text` | `?look=<LOOK>&screen=area&area=kitchen&scenario=large-text` | `?look=<LOOK>&screen=intervention&scenario=large-text` |

## Invalid-route checks

These routes must recover without a blank screen or uncaught error:

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

Review the canonical and stress routes at:

- 360 × 800
- 390 × 844
- 412 × 915
- 360 × 640 short viewport
- 915 × 412 landscape smoke test
- Desktop with the Design Lab control panel visible

## Evidence to record

For each Look, record:

- Console errors
- Horizontal overflow
- Clipped or hidden actions
- Broken wrapping
- Tab-order problems
- Screen-reader duplication or missing context
- Strongest scenario
- Weakest scenario
- Best feature
- Biggest weakness
- Components worth borrowing
