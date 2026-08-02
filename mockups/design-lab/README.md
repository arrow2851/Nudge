# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.11.0`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.11.0 Look #4 Intervention-to-action](CHECKLIST-PROGRESS-0.11.0.md)
- [Look #4 Intervention-to-action implementation](LOOK-4-INTERVENTION-ACTION.md)
- [All-Look Task hierarchy progress](CHECKLIST-PROGRESS-0.10.7.md)
- [All-Look Routine Completion progress](CHECKLIST-PROGRESS-0.9.7.md)
- [Pure-Look implementation order](PURE-LOOK-IMPLEMENTATION-ORDER.md)
- [Interactive expansion decision record](INTERACTIVE-EXPANSION-DECISION.md)
- [Full-gallery browser evidence report](FULL-GALLERY-EVIDENCE-0.8.4.md)
- [Decisions and feedback log](DECISIONS.md)
- [Automated validation guide](VALIDATION.md)
- [Design Lab changelog](CHANGELOG.md)

## Safety boundary

- The protected Look #1 prototype remains under `mockups/prototype/` on `main` and is unchanged.
- Experimental files remain under `mockups/design-lab/`.
- Design Lab routine, task, and intervention state are isolated from Look #1 and production storage.
- Nothing should merge into `main` until migration boundaries are intentionally reviewed.

## Complete visual gallery

Look #1 remains the protected Soft Practical Utility baseline. Active gallery directions are Looks #2 through #9. Every direction remains preserved; implementation order is a learning sequence, not a ranking or elimination list.

## Routine Completion — 8 of 8 complete

Every active Look implements:

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention count updates
→ Undo or reopen
```

The eight Looks share semantic routine-completion state. Switching Looks changes presentation without resetting the route or routine result.

## Task hierarchy — 8 of 8 complete

Versions `0.10.0` through `0.10.7` implement the approved simple checklist model in all active Looks:

```text
Tasks
→ Add empty task
→ Edit inline
→ Complete or reopen
→ Set as main task
→ Add subtasks
→ Track progress
→ Reorder
→ Indent or unindent
→ Release subtasks when main-task mode is removed
→ Hide or show completed items
```

Shared rules include separate controls, one hierarchy level, completion propagation, subtask release, completed-item grouping, explicit movement alternatives, and one scenario-isolated state across all eight Looks.

## Intervention-to-action — 1 of 8 Looks

Version `0.11.0` establishes the shared Intervention-to-action contract in Look #4 — Zen Focus:

```text
Prompt
→ Start suggestion
→ Active action
→ Complete
→ Reopen

Prompt
→ Different suggestion
→ Deterministic next option

Prompt
→ Not Now
→ Quiet dismissed state
→ Show suggestion again
```

Shared behavior now includes:

- A separate scenario-isolated intervention state namespace.
- Deterministic alternatives derived from the scenario suggestion and available routines.
- Setup-safe alternatives when no Areas exist.
- Prompt, Active, Completed, and Dismissed phases.
- Immediate completion, reopen, undo-start, dismissal, and resume actions.
- Reset Review State clears intervention state.
- Starting an action does not silently modify Routine Completion or Task Hierarchy state.
- No production app blocking, usage tracking, timers, notifications, accounts, or backend integration.

### Look #4 treatment

Zen Focus presents one quiet decision at a time. Active, completed, and dismissed states use calm status cards. Dismissal explicitly confirms that nothing changed and no penalty was added.

## Intervention-to-action sequence

1. Look #4 — Zen Focus — **implemented**
2. Look #3 — Precision Minimal — **next**
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

Reusable Lists follows after Intervention-to-action is implemented across all Looks.

## Validation boundary

The static validator now covers:

- Eight Routine Completion Looks and forty-eight routine renderer exports.
- Eight Task hierarchy renderers and eight dedicated task stylesheets.
- Shared Task hierarchy behavior and cross-Look state preservation.
- The shared Intervention phase engine and deterministic alternatives.
- Look #4 Start, Next, Dismiss, Resume, Complete, Reopen, Undo, and Return-to-Today actions.
- Intervention reset integration and dedicated stylesheet order.
- Responsive, short-screen, Large Text, Forced Colors, and Reduced Motion contracts.
- Ambient Glass transparency fallbacks and Retro Digital language checks.

Still pending:

- Exact complete-checkout validator execution.
- Exact complete-checkout interactive browser run.
- Physical Android testing.
- Actual screen-reader smoke testing.
- Lower-end Ambient Glass paint/compositing measurements.
- A single-version browser regression across every Look.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=4&screen=intervention&scenario=normal
?look=4&screen=intervention&scenario=backlog
?look=4&screen=intervention&scenario=new
?look=4&screen=intervention&scenario=long
?look=4&screen=intervention&scenario=large-text
?look=9&screen=tasks&scenario=normal
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Implement the same Intervention-to-action behavior contract in Look #3 — Precision Minimal.
