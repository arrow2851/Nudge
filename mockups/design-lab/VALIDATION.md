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
- `index.html` loads the existing styles, `expanded-looks.css`, and review styles
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` is loaded after the original Look styles and before review capture overrides
- All active stylesheets have balanced braces

## Local checks completed for version 0.8.0

- `renderers/look5.js` passed `node --check`
- `renderers/look7.js` passed `node --check`
- `renderers/look8.js` passed `node --check`
- `renderers/look9.js` passed `node --check`
- The updated validator passed `node --check`
- `expanded-looks.css` had balanced opening and closing blocks

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
