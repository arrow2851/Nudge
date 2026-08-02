# Design Lab Automated Validation

The Design Lab includes a dependency-free Node validation harness:

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

A successful run exits with status `0`. Failed invariants are printed with a `FAIL` prefix and exit with status `1`.

## What the validator checks

### Required structure

- Shared shell, controller, routine state, and task state files exist
- Routine renderers for Looks #2 through #9 exist
- Task renderers for Looks #2 through #9 exist
- The protected Look #1 comparison reference exists
- Every required base, quality, interaction, task, and review stylesheet exists

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every Look renderer exports the six Routine Completion screens
- Every active Look exports its Task hierarchy screen
- `app.js` references the shared routine and task renderer registries
- The Look #1 comparison reference imports the shared Design Lab version

### Shared fixtures and state

- Exactly seven shared scenarios are present
- Every scenario contains Areas, routines, and Intervention data
- Every Area has a valid ID, name, and routine collection
- All active Looks consume the same routine fixture registry
- Task state uses a separate scenario-isolated storage namespace
- Task actions include add, edit, complete, reopen, main-task toggle, subtask creation, release, reorder, indent, unindent, and completed visibility

### Routes

The validator covers:

- Looks `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`
- Routine screens `today`, `areas`, `area`, `section`, `chore`, and `intervention`
- Task screen `tasks` for all eight active Looks
- Scenarios `normal`, `backlog`, `new`, `clear`, `large`, `long`, and `large-text`

The original gallery route matrix remains **168 active-Look combinations**. Routine Completion and Task hierarchy contracts are checked in addition to that matrix.

### Routine Completion

- Forty-eight renderer exports are required across eight Looks
- Completion, recurrence advancement, Undo, route state, and cross-Look state hooks remain present
- Every Look retains dedicated responsive and accessibility styling contracts
- Ambient Glass retains Reduced Transparency and no-backdrop-filter fallbacks

### Task hierarchy

- `task-state.js` contains the separate storage namespace and one-level hierarchy model
- All eight active Looks are registered as Task hierarchy Looks
- All eight task renderers expose equivalent controls and actions
- All eight task stylesheets retain 48 px action heights, Large Text handling, Forced Colors, and Reduced Motion
- Pointer drag hooks and explicit Move, Indent, and Unindent fallbacks remain present
- Completed-item grouping and Hide/Show Completed remain encoded
- Ambient Glass task styling requires Reduced Transparency and no-backdrop-filter solid fallbacks
- Retro Digital task styling requires Increased Contrast support
- Retro Digital task renderer is checked for prohibited error, fault, and failure terminology
- The default review route opens Look #9 Tasks in version `0.10.7`

### Version and entry point

- Version agreement between `config.js`, `quality.js`, `index.html`, `README.md`, and the master checklist
- The Look #1 reference sources its version from `config.js`
- Stylesheet order is enforced so each task layer loads after its Look's base, quality, and interaction layers
- `app.js` loads as an ES module

### Stylesheets

- Existing Look styles remain present
- `expanded-looks.css` remains the shared base for Looks #5, #7, #8, and #9
- Quality and interaction layers remain separate and auditable
- `look2-tasks.css` through `look9-tasks.css` remain pure-Look task layers
- All active stylesheets have balanced braces when the validator runs in a complete checkout

## Evidence boundary

The current committed-source contract is recorded through version `0.10.7`. Direct repository cloning remains blocked by local DNS restrictions, so the exact complete-checkout validator and browser run have not been claimed.

Static validation does not replace:

- Runtime console-error checks
- Browser Back and Forward behavior
- Keyboard tab order and activation
- Actual screen-reader output
- Phone, short-screen, landscape, and desktop layouts
- Visual overflow and clipping
- Physical Android drag, hold, and swipe behavior
- Real forced-colors and increased-contrast presentation
- Ambient Glass paint and compositing behavior on lower-end hardware
- A single-version browser regression across every Look

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the original gallery route set.
