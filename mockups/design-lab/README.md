# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.11.5`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.11.5 Look #2 Intervention-to-action](CHECKLIST-PROGRESS-0.11.5.md)
- [Look #2 Intervention-to-action implementation](LOOK-2-INTERVENTION-ACTION.md)
- [Look #6 Intervention-to-action implementation](LOOK-6-INTERVENTION-ACTION.md)
- [Look #7 Intervention-to-action implementation](LOOK-7-INTERVENTION-ACTION.md)
- [Look #5 Intervention-to-action implementation](LOOK-5-INTERVENTION-ACTION.md)
- [Look #3 Intervention-to-action implementation](LOOK-3-INTERVENTION-ACTION.md)
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

## Complete feature loops

### Routine Completion — 8 of 8 complete

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

### Task hierarchy — 8 of 8 complete

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
→ Release subtasks
→ Hide or show completed
```

## Intervention-to-action — 6 of 8 Looks

Versions `0.11.0` through `0.11.5` implement the shared intervention contract in Looks #4, #3, #5, #7, #6, and #2:

```text
Prompt
→ Start action
→ Active
→ Complete
→ Reopen or Undo start

Prompt
→ Next option
→ Deterministic alternative

Prompt
→ Not now
→ Dismissed
→ Show suggestion again
```

Shared behavior includes:

- Separate scenario-isolated intervention state.
- Prompt, Active, Completed, and Dismissed phases.
- Scenario-first suggestions with deterministic routine-based alternatives.
- Setup-safe alternatives when no Areas exist.
- Reversible Start, Complete, Reopen, Undo, Next, Dismiss, Resume, and Return-to-Today actions.
- Reset Review State clears intervention state.
- Routine Completion and Task hierarchy state remain unchanged.
- No live usage tracking, app blocking, timers, notifications, accounts, or backend integration.

### Look-specific treatment

- **Look #4 — Zen Focus:** one quiet choice at a time, calm action cards, and low-pressure language.
- **Look #3 — Precision Minimal:** explicit phase labels, source/elapsed/action metrics, compact facts, and direct controls without scoring or compliance judgments.
- **Look #5 — Playful Modular:** friendly modular cards, option and context blocks, positive but non-scoring completion language, and a neutral kept-scrolling state.
- **Look #7 — Bold Utility:** high-contrast status blocks and direct controls without error, alarm, failure, or noncompliance framing.
- **Look #6 — Tactile Household:** optional action cards, tray and drawer-pull cues, a completion slip, and physical organization without defect or repair language.
- **Look #2 — Warm Editorial:** practical editorial context, one featured action entry, and explicit no-journaling or explanation requirements.

Switching among Looks #2 through #7 changes presentation without resetting the intervention phase or selected suggestion.

## Intervention-to-action sequence

1. Look #4 — Zen Focus — **implemented**
2. Look #3 — Precision Minimal — **implemented**
3. Look #5 — Playful Modular — **implemented**
4. Look #7 — Bold Utility — **implemented**
5. Look #6 — Tactile Household — **implemented**
6. Look #2 — Warm Editorial — **implemented**
7. Look #8 — Ambient Glass — **next**
8. Look #9 — Retro Digital

Reusable Lists follows after Intervention-to-action is implemented across all Looks.

## Validation boundary

The static validator now covers:

- Eight Routine Completion Looks and forty-eight routine renderer exports.
- Eight Task hierarchy renderers and dedicated stylesheets.
- Shared Intervention phase engine and deterministic alternatives.
- Six pure-Look intervention renderers and dedicated style layers.
- Start, Next, Dismiss, Resume, Complete, Reopen, Undo, and Return-to-Today actions.
- Cross-Look intervention-state preservation.
- Warm Editorial no-journaling language and no-writing-input checks.
- Playful Modular non-scoring language.
- Bold Utility pressure-language exclusions.
- Tactile Household defect and repair-language exclusions.
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
?look=2&screen=intervention&scenario=normal
?look=2&screen=intervention&scenario=backlog
?look=2&screen=intervention&scenario=new
?look=2&screen=intervention&scenario=long
?look=2&screen=intervention&scenario=large-text
?look=6&screen=intervention&scenario=normal
?look=7&screen=intervention&scenario=normal
?look=5&screen=intervention&scenario=normal
?look=3&screen=intervention&scenario=normal
?look=4&screen=intervention&scenario=normal
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Implement the same Intervention-to-action behavior contract in Look #8 — Ambient Glass with required solid transparency fallbacks.
