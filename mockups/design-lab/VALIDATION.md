# Design Lab Automated Validation

The Design Lab includes a dependency-free Node validation harness:

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

A successful run exits with status `0`. Failed invariants are printed with a `FAIL` prefix and exit with status `1`.

## What the validator checks

### Required structure

- Shared shell and controller files exist
- Renderers for Looks #2 through #9 exist
- The protected Look #1 comparison reference exists
- Existing and expanded gallery stylesheets exist
- The Look #5 dedicated quality stylesheet exists

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every Look renderer exports Areas, Area detail, and Intervention functions
- `app.js` references and routes every expected renderer

### Shared fixtures

- Exactly seven shared scenarios are present
- Every scenario contains Areas, routines, and Intervention data
- Every Area has a valid ID, name, and routine collection
- All active Looks consume the same fixture registry

### Routes

The validator covers:

- Looks `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`
- Screens `areas`, `area`, and `intervention`
- Scenarios `normal`, `backlog`, `new`, `clear`, `large`, `long`, and `large-text`

This produces **168 active-Look route combinations**.

### Version and entry point

- Version agreement between `config.js`, `quality.js`, `look1-reference.js`, `index.html`, `README.md`, and the master checklist
- `index.html` loads the original Look styles, `expanded-looks.css`, `look5-quality.css`, and review styles
- Stylesheet order is enforced so Look #5 quality overrides load after the expanded-gallery base and before capture-only review styles
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` remains the shared base for Looks #5, #7, #8, and #9
- `look5-quality.css` remains a separate auditable override layer
- All active stylesheets have balanced braces

## Code-level checks completed for version 0.8.1

- Look #5 renderer semantics were reviewed after the accessible-label changes
- `look5-quality.css` block balance was checked
- The validator was updated to require the file and its load order
- Contrast ratios were calculated for all alternating Look #5 card surfaces and key controls
- Shared scenarios, fixture data, and route meaning were not changed

## What static validation does not replace

The following still require browser or device evidence:

- Runtime console errors
- Browser Back and Forward behavior
- Keyboard tab order and activation
- Actual screen-reader output
- Phone, short-screen, landscape, and desktop layouts
- Visual overflow and clipping
- Real forced-colors presentation
- Blur and performance behavior for Ambient Glass
- Small-text readability for Retro Digital

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the complete gallery route set.
