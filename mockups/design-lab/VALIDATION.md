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
- Dedicated quality stylesheets for Looks #5, #7, #8, and #9 exist

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every Look renderer exports Areas, Area detail, and Intervention functions
- `app.js` references and routes every expected renderer
- The Look #1 comparison reference imports the shared Design Lab version

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

- Version agreement between `config.js`, `quality.js`, `index.html`, `README.md`, and the master checklist
- The Look #1 reference sources its version from `config.js`
- `index.html` loads the original Look styles, expanded gallery base, all four added quality layers, and review styles
- Stylesheet order is enforced so quality overrides load after their base styles and before capture-only review styles
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` remains the shared base for Looks #5, #7, #8, and #9
- `look5-quality.css`, `look7-quality.css`, `look8-quality.css`, and `look9-quality.css` remain separate auditable override layers
- All active stylesheets have balanced braces when the validator runs in a complete checkout

## Code-level checks completed through version 0.8.4

- Every active direction has a dedicated code-level quality pass.
- Renderer semantics and accessible-label changes were reviewed for Looks #5, #7, #8, and #9.
- Contrast calculations were completed for the new directions' primary palettes.
- Narrow-screen, Large Text, long-content, touch-target, focus, forced-colors, and tone paths were reviewed in source.
- Ambient Glass includes blur reduction and fallback paths.
- Retro Digital includes corrected meter logic and microtext remediation.
- Shared scenarios, fixture data, route meaning, and product functionality were not changed.

## What static validation does not replace

The following still require browser or device evidence:

- Runtime console errors
- Browser Back and Forward behavior
- Keyboard tab order and activation
- Actual screen-reader output
- Phone, short-screen, landscape, and desktop layouts
- Visual overflow and clipping
- Real forced-colors presentation
- Ambient Glass paint and compositing behavior on lower-end hardware
- Retro Digital readability at different physical display brightness levels

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the complete gallery route set.
