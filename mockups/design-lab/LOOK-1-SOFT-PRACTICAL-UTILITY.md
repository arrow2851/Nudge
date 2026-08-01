# Look #1 — Soft Practical Utility Baseline

Look #1 is the protected production-direction prototype under `mockups/prototype/` on `main`. The Design Lab does not modify it.

## Source-of-truth traits

The baseline uses:

- A soft green application background with white and lightly tinted surfaces
- A dark green primary action color and pale green supporting surfaces
- Inter/system sans-serif typography
- Rounded cards, controls, icon tiles, pills, and a large-radius phone frame
- Familiar Android-style navigation and direct utility controls
- Moderate density with strong card separation and generous touch targets
- Textual overdue, due-today, upcoming, and as-needed status treatment
- Practical creation, completion, and template affordances rather than decorative visual storytelling

These traits are grounded in the existing prototype tokens, base shell, components, and Areas implementation.

## Baseline strengths to evaluate

- Clear, familiar mobile-product structure
- Strong action discoverability
- Straightforward status and count presentation
- Broad suitability across Home, Car, Personal, and Work
- Existing interactive depth beyond the Round 1 auditions
- Conservative visual language that should tolerate repeated use

## Baseline risks to evaluate

- May feel generic beside more distinctive directions
- Card stacking can become visually repetitive in large households
- Moderate padding can reduce scan speed under dense backlogs
- Green accent may carry too much hierarchy responsibility
- Existing prototype content is not identical to the shared Design Lab fixture

## Equivalent comparison mapping

The comparison-only reference page is:

```text
look1-reference.html
```

It imports the same shared fixture used by Looks #2, #3, #4, and #6.

### Areas overview

Maps the shared fixture into the existing baseline patterns:

- Page header
- Attention summary strip
- Rounded Area cards
- Icon tiles
- Routine and Section counts
- Next-routine text
- Due/overdue count badges
- Top-level Add Area affordance

### Representative Area detail

Maps Kitchen into the existing baseline patterns:

- Compact back/header treatment
- Attention summary
- Rounded completion rows
- Due status pills
- Section cards
- Later and as-needed routines

### Intervention

The protected Look #1 prototype does not currently contain an Intervention screen.

The reference page therefore includes a clearly labeled **comparison-only extrapolation** using the existing baseline visual language:

- Green primary accent
- White and pale-green cards
- Rounded buttons and icon tile
- Direct, practical wording
- Explicit Start, alternative, and Not Now actions

This extrapolation is evidence for visual comparison only. It is not an approved Look #1 product screen and must not be represented as existing production functionality.

## Reference routes

```text
look1-reference.html?screen=areas&scenario=normal
look1-reference.html?screen=area&area=kitchen&scenario=backlog
look1-reference.html?screen=intervention&scenario=normal
```

Append `capture=labelled` or `capture=phone` for evidence capture.

## Fairness rule

Score Look #1 using the same evidence order and scorecard as every audition. Record the Intervention limitation explicitly when assigning Intervention suitability and overall recommendation scores.
