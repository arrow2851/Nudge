# Nudge Design Lab

The Design Lab compares alternate visual systems without changing the approved Look #1 prototype.

**Current version:** `0.8.7`  
**Development branch:** `feature/design-lab`

## Project tracking

- [Master Design Lab execution checklist](DESIGN-LAB-CHECKLIST.md)
- [Latest checklist progress — 0.8.7 pure-Look order](CHECKLIST-PROGRESS-0.8.7.md)
- [Pure-Look implementation order](PURE-LOOK-IMPLEMENTATION-ORDER.md)
- [Interactive expansion decision record](INTERACTIVE-EXPANSION-DECISION.md)
- [Vertical slice candidates](VERTICAL-SLICE-CANDIDATES.md)
- [Full-gallery browser evidence report](FULL-GALLERY-EVIDENCE-0.8.4.md)
- [Machine-readable evidence summary](FULL-GALLERY-EVIDENCE-0.8.4.json)
- [Expanded gallery directions](EXPANDED-GALLERY-LOOKS.md)
- [Decisions and feedback log](DECISIONS.md)
- [Look #1 — Soft Practical Utility baseline](LOOK-1-SOFT-PRACTICAL-UTILITY.md)
- [Shared scenario definitions](SCENARIOS.md)
- [Automated validation guide](VALIDATION.md)
- [Design Lab changelog](CHANGELOG.md)

## Safety boundary

- The protected Look #1 prototype remains under `mockups/prototype/` on `main` and is unchanged.
- Experimental and comparison-only files remain under `mockups/design-lab/`.
- Design Lab state is isolated from Look #1.
- Nothing should merge into `main` until migration boundaries are intentionally reviewed.

## Complete visual gallery

Baseline reference:

- Look #1 — Soft Practical Utility

Active gallery directions:

- Look #2 — Warm Editorial
- Look #3 — Precision Minimal
- Look #4 — Zen Focus
- Look #5 — Playful Modular
- Look #6 — Tactile Household
- Look #7 — Bold Utility
- Look #8 — Ambient Glass
- Look #9 — Retro Digital

Every direction remains preserved. The implementation sequence below is not a ranking or elimination list.

## Quality and evidence status

All active directions from Look #2 through Look #9 have completed dedicated code-level quality passes.

Looks #1, #2, #3, #4, and #6 were included in the 0.7.2 browser evidence run. Looks #5, #7, #8, and #9 completed the 0.8.4 browser presentation matrix. Together, the two runs provide browser evidence for every gallery direction, although they were not executed from one identical build.

The exact complete-checkout validator, physical Android checks, actual screen-reader smoke testing, and a single-version all-Look rerun remain pending.

## Approved interactive strategy

The user selected **Option A**: build one pure-Look vertical slice at a time.

The assistant was delegated responsibility for the first Look and all remaining ordering. Routine `go` messages now advance automatically through this sequence:

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

The first flow in every Look is the Routine Completion Loop:

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

After all eight Looks receive this flow, the feature order is Task hierarchy, Intervention-to-action, then Reusable Lists.

Look switching remains a Design Lab review control, prototype state remains isolated and deterministic, and Look #1 remains outside the implementation sequence.

## Run locally

```bash
cd mockups/design-lab
node validate-design-lab.mjs
python -m http.server 8080
```

Open `http://localhost:8080`.

## Example routes

```text
?look=4&screen=areas&scenario=normal
?look=3&screen=area&area=kitchen&scenario=backlog
?look=5&screen=intervention&scenario=long
?look=9&screen=areas&scenario=large-text
```

Append `capture=labelled` for an evidence frame or `capture=phone` for a clean phone frame.

## Next work

Begin the Look #4 Routine Completion Loop foundation: isolated deterministic state, Today / Needs Attention, Area and Section navigation, Chore detail, completion, recurrence advance, and undo or reopen.
