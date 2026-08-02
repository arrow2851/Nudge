# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.10.7`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.10.7 all-Look Task hierarchy](CHECKLIST-PROGRESS-0.10.7.md)
- [Look #9 Task hierarchy implementation](LOOK-9-TASK-HIERARCHY.md)
- [Look #8 Task hierarchy implementation](LOOK-8-TASK-HIERARCHY.md)
- [Look #2 Task hierarchy implementation](LOOK-2-TASK-HIERARCHY.md)
- [Look #6 Task hierarchy implementation](LOOK-6-TASK-HIERARCHY.md)
- [Look #7 Task hierarchy implementation](LOOK-7-TASK-HIERARCHY.md)
- [Look #5 Task hierarchy implementation](LOOK-5-TASK-HIERARCHY.md)
- [Look #3 Task hierarchy implementation](LOOK-3-TASK-HIERARCHY.md)
- [Look #4 Task hierarchy implementation](LOOK-4-TASK-HIERARCHY.md)
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
- Design Lab routine and task state are isolated from Look #1 and production storage.
- Nothing should merge into `main` until migration boundaries are intentionally reviewed.

## Complete visual gallery

Look #1 remains the protected Soft Practical Utility baseline. Active gallery directions are Looks #2 through #9. Every direction remains preserved; the implementation order is a learning sequence, not a ranking or elimination list.

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

Shared rules include:

- A plus at the top and Add Task below the list.
- Left drag handle, separate completion control, editable title, optional time shorthand, settings disclosure, and a separate subtask plus.
- One-level main-task and subtask hierarchy.
- Completing every subtask completes the main task.
- Reopening a subtask reopens the main task.
- Turning off main-task mode releases subtasks as regular tasks.
- Completed items move to the bottom and may be hidden or shown.
- Pointer drag plus explicit Move, Indent, and Unindent controls.
- One shared scenario-isolated task state across all eight Looks.

### Look-specific treatment

- **Look #4 — Zen Focus:** calm cards, generous spacing, soft progress, and low-pressure language.
- **Look #3 — Precision Minimal:** compact operational table, Active/Main/Done metrics, fixed control columns, and explicit progress data.
- **Look #5 — Playful Modular:** colorful task blocks, friendly progress language, clear hierarchy rails, and positive—but non-scoring—feedback.
- **Look #7 — Bold Utility:** thick rules, direct controls, factual counts, and strong hierarchy rails without failure-state language.
- **Look #6 — Tactile Household:** paper task cards, drawer-like subtask grouping, and physical controls without defect-based language.
- **Look #2 — Warm Editorial:** a calm practical page and restrained progress notes without reflection or diary requirements.
- **Look #8 — Ambient Glass:** selective translucent surfaces with solid no-blur and Reduced Transparency fallbacks.
- **Look #9 — Retro Digital:** a neutral task directory with Available/Main/Complete counters and no error, fault, or failure language.

## Next feature sequence — Intervention-to-action

The next loop uses the same delegated pure-Look order:

1. Look #4 — Zen Focus — **next**
2. Look #3 — Precision Minimal
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
- Shared add, edit, complete, reopen, main-task, subtask, release, progress, reorder, indent, unindent, and visibility behavior.
- Cross-Look task-state preservation.
- Responsive, Large Text, Forced Colors, Increased Contrast, Reduced Motion, and Ambient Glass transparency fallbacks.
- Retro Digital language checks that reject error, fault, and failure terms in the task renderer.

Still pending:

- Exact complete-checkout validator execution.
- Exact complete-checkout interactive browser run.
- Physical Android testing, including drag/hold and swipe behavior.
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
?look=9&screen=tasks&scenario=normal
?look=9&screen=tasks&scenario=backlog
?look=9&screen=tasks&scenario=new
?look=9&screen=tasks&scenario=long
?look=9&screen=tasks&scenario=large-text
?look=8&screen=tasks&scenario=normal
?look=4&screen=intervention&scenario=normal
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Implement the Intervention-to-action loop in Look #4 — Zen Focus while preserving the existing Routine Completion and Task hierarchy behavior.
