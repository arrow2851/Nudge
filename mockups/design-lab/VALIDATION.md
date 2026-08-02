# Design Lab Automated Validation

The Design Lab includes a dependency-free Node validation harness:

```bash
cd mockups/design-lab
node validate-design-lab.mjs
```

A successful run exits with status `0`. Failed invariants are printed with a `FAIL` prefix and exit with status `1`.

## What the validator checks

### Required structure

- Shared shell, controller, routine, task, and intervention state files exist
- Routine renderers for Looks #2 through #9 exist
- Task renderers for all eight active Looks exist
- Dedicated Intervention-to-action renderers/styles exist for Looks #3 and #4
- The protected Look #1 comparison reference exists
- Every required stylesheet exists and loads in the expected order

### Import graph

- Every relative JavaScript import resolves to an existing file
- Every Look exports the six Routine Completion screens
- Every active Look exports its Task hierarchy screen
- `app.js` references routine, task, and implemented intervention renderers
- The Look #1 comparison reference imports the shared Design Lab version

### Shared fixtures and state

- Exactly seven shared scenarios are present
- Every scenario contains Areas, routines, and Intervention data
- Routine, task, and intervention state use separate storage namespaces
- Intervention suggestions begin with the scenario fixture and add deterministic routine-based alternatives
- Scenarios without Areas receive setup-safe alternatives
- Intervention phases are limited to Prompt, Active, Completed, and Dismissed

### Routes

The validator covers Looks #2 through #9, all Routine Completion routes, Tasks for all eight Looks, and all seven scenarios. It also requires Look #3 Intervention as the default review route for version `0.11.1`.

### Routine Completion and Task hierarchy

- Forty-eight routine renderer exports remain required
- Eight task renderers and eight task stylesheets remain required
- Shared completion, recurrence, hierarchy, movement, and state-preservation hooks remain present
- Ambient Glass solid transparency fallbacks remain required
- Retro Digital Increased Contrast and neutral non-failure language remain required

### Intervention-to-action

- `intervention-state.js` contains the separate storage namespace and four-phase model
- Suggestion cycling uses raw scenario data and remains deterministic
- Start, Next, Dismiss, Resume, Complete, Reopen, Undo, Return-to-Today, and Reset hooks remain present
- Looks #3 and #4 are registered as Intervention-to-action Looks
- Both pure-Look renderers expose the equivalent action set
- Both dedicated style contracts retain 48 px actions, Large Text handling, short-screen behavior, Forced Colors, visible focus, and Reduced Motion
- Starting or completing an intervention does not alter routine or task state
- No-guilt language confirms that staying, dismissing, and changing the suggestion carry no penalty
- Precision Minimal metrics remain descriptive rather than evaluative

### Version and stylesheets

- Version agreement between `config.js`, `quality.js`, `index.html`, `README.md`, and the master checklist
- Intervention styles load after their respective base, interaction, and task layers
- All active stylesheets have balanced braces when the validator runs in a complete checkout

## Evidence boundary

The committed-source contract is recorded through version `0.11.1`. Direct repository cloning remains blocked by local DNS restrictions, so the exact complete-checkout validator and browser run have not been claimed.

Static validation does not replace runtime console checks, browser navigation testing, keyboard review, actual screen-reader output, physical Android presentation, real forced-colors behavior, or a single-version browser regression across every Look. Lower-end Ambient Glass paint measurements also remain pending.

Use [`ROUND-1-ROUTES.md`](ROUND-1-ROUTES.md) for the original gallery route set.
