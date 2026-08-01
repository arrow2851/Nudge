# Design Lab Automated Validation

The Design Lab includes a dependency-free Node validation harness:

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

A successful run exits with status `0`. Any failed invariant is printed with a `FAIL` prefix and exits with status `1`.

## What the validator checks

### Required structure

- Shared shell and controller files exist
- All four Look renderers exist
- All active Look stylesheets exist
- Look #6 quality overrides exist and load after the base stylesheet

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every renderer exports its expected Areas, Area detail, and Intervention functions
- `app.js` imports and routes every expected renderer

### Shared fixtures

- Exactly seven shared scenarios are present
- Every scenario has labels, purpose, expected behavior, Areas, routines, and Intervention data
- Area IDs are unique within each scenario
- Routine statuses use the supported status set
- Durations and recurrence data are valid
- Normal Day has 3 attention routines
- Heavy Backlog has 7 attention routines
- New User has no Areas
- All Clear has no overdue or due-today routines
- Large Household has 9 Areas and 8 attention routines
- Large Text enables the enlarged text scale
- `getScenario()` returns a deep clone
- Unknown scenarios fall back to Normal Day

### Routes and state

The validator exercises all combinations of:

- Looks `2`, `3`, `4`, and `6`
- Screens `areas`, `area`, and `intervention`
- Scenarios `normal`, `backlog`, `new`, `clear`, `large`, `long`, and `large-text`

This produces **84 route combinations**. It verifies parsing, serialization, Area query handling, invalid-route fallbacks, browser-history method selection, isolated session storage, and reset behavior.

### Version and entry point

- Semantic version formatting
- Version agreement between `config.js`, `quality.js`, `index.html`, `README.md`, and the master checklist
- Local HTML references resolve
- Stylesheets load in the required order
- `app.js` loads as an ES module

### Stylesheets

- All active stylesheets have balanced braces
- The Look #6 quality stylesheet remains last among Look-specific stylesheets

## What this does not replace

The validator does not replace a real-browser review. The following still require browser or device evidence:

- Console errors during actual rendering
- Browser Back and Forward behavior
- Keyboard tab order and activation
- Screen-reader output
- 360 px, 390 px, 412 px, short, tall, and landscape layouts
- Visual overflow, clipping, and text wrapping
- Comparative preference scoring

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the browser review route set.
