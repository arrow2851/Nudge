# Design Lab Automated Validation

The Design Lab includes a dependency-free Node validation harness:

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

A successful run exits with status `0`. Failed invariants are printed with a `FAIL` prefix and exit with status `1`.

## What the validator checks

### Required structure

- Shared shell, controller, routine state, task state, and intervention state files exist
- Routine renderers for Looks #2 through #9 exist
- Task renderers for Looks #2 through #9 exist
- The Look #4 Intervention stylesheet exists
- The protected Look #1 comparison reference exists
- Every required base, quality, interaction, task, intervention, and review stylesheet exists

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every Look renderer exports the six Routine Completion screens
- Every active Look exports its Task hierarchy screen
- `app.js` references the shared routine and task renderer registries
- `app.js` imports the shared intervention state engine
- The Look #1 comparison reference imports the shared Design Lab version

### Shared fixtures and state

- Exactly seven shared scenarios are present
- Every scenario contains Areas, routines, and Intervention data
- Every Area has a valid ID, name, and routine collection
- Routine, task, and intervention state use separate storage namespaces
- Intervention suggestions begin with the scenario fixture and add deterministic routine-based alternatives
- Scenarios without Areas receive setup-safe alternatives
- Intervention phases are limited to Prompt, Active, Completed, and Dismissed

### Routes

The validator covers:

- Looks `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`
- Routine screens `today`, `areas`, `area`, `section`, `chore`, and `intervention`
- Task screen `tasks` for all eight active Looks
- Scenarios `normal`, `backlog`, `new`, `clear`, `large`, `long`, and `large-text`
- Look #4 Intervention as the default review route for version `0.11.0`

The original gallery route matrix remains **168 active-Look combinations**. Routine Completion, Task hierarchy, and Intervention-to-action contracts are checked in addition to that matrix.

### Routine Completion

- Forty-eight renderer exports are required across eight Looks
- Completion, recurrence advancement, Undo, route state, and cross-Look state hooks remain present
- Every Look retains dedicated responsive and accessibility styling contracts
- Ambient Glass retains Reduced Transparency and no-backdrop-filter fallbacks

### Task hierarchy

- `task-state.js` contains the separate storage namespace and one-level hierarchy model
- All eight task renderers expose equivalent controls and actions
- All eight task stylesheets retain 48 px action heights, Large Text handling, Forced Colors, and Reduced Motion
- Pointer drag hooks and explicit Move, Indent, and Unindent fallbacks remain present
- Completed-item grouping and Hide/Show Completed remain encoded
- Ambient Glass requires solid transparency fallbacks
- Retro Digital requires Increased Contrast support and neutral non-failure language

### Intervention-to-action

- `intervention-state.js` contains the separate storage namespace
- Suggestion cycling is deterministic and based on raw scenario data
- Start, Next, Dismiss, Resume, Complete, Reopen, Undo, and Return-to-Today hooks remain present
- Reset Review State clears intervention state
- Look #4 renders Prompt, Active, Completed, and Dismissed states
- Starting or completing an intervention does not silently alter routine or task state
- The Look #4 intervention stylesheet retains 48 px actions, 54 px Large Text actions, short-screen handling, Forced Colors, and Reduced Motion
- No-guilt language confirms that staying, dismissing, and changing the suggestion carry no penalty

### Version and entry point

- Version agreement between `config.js`, `quality.js`, `index.html`, `README.md`, and the master checklist
- The Look #1 reference sources its version from `config.js`
- Stylesheet order is enforced so the Look #4 Intervention layer loads after its base, interaction, and task layers
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` remains the shared base for Looks #5, #7, #8, and #9
- Quality and feature layers remain separate and auditable
- `look2-tasks.css` through `look9-tasks.css` remain pure-Look task layers
- `look4-intervention.css` remains a pure Zen Focus intervention layer
- All active stylesheets have balanced braces when the validator runs in a complete checkout

## Evidence boundary

The current committed-source contract is recorded through version `0.11.0`. Direct repository cloning remains blocked by local DNS restrictions, so the exact complete-checkout validator and browser run have not been claimed.

Static validation does not replace:

- Runtime console-error checks
- Browser Back and Forward behavior
- Keyboard tab order and activation
- Actual screen-reader output
- Phone, short-screen, landscape, and desktop layouts
- Visual overflow and clipping
- Physical Android drag, hold, and swipe behavior
- Real forced-colors and increased-contrast presentation
- Real app-usage detection or blocking, which is intentionally outside this Design Lab slice
- Ambient Glass paint and compositing behavior on lower-end hardware
- A single-version browser regression across every Look

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the original gallery route set.
