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
- The Look #5, Look #7, and Look #8 dedicated quality stylesheets exist

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
- `index.html` loads the original Look styles, `expanded-looks.css`, Look #5, Look #7, and Look #8 quality styles, and review styles
- Stylesheet order is enforced so quality overrides load after the expanded-gallery base and before capture-only review styles
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` remains the shared base for Looks #5, #7, #8, and #9
- `look5-quality.css`, `look7-quality.css`, and `look8-quality.css` remain separate auditable override layers
- All active stylesheets have balanced braces when the validator runs in a complete checkout

## Code-level checks completed for version 0.8.3

- Look #8 renderer structure and accessible-label changes were reviewed.
- The validator was updated to require `look8-quality.css` and its load order.
- Contrast ratios were calculated for the original and corrected gradient endpoints and muted text.
- Narrow-screen, Large Text, long-content, touch-target, transparency, fallback, and forced-colors paths were reviewed in source.
- Repeated backdrop blur was removed from Area cards and panels; only a few focal surfaces retain reduced blur.
- Solid fallbacks were added for unsupported backdrop filtering and reduced-transparency preferences.
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
- Physical-device paint, compositing, and scrolling performance for Ambient Glass
- Small-text readability for Retro Digital

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the complete gallery route set.
