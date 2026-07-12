# Open Product and Engineering Questions

These decisions should be resolved before or during low-fidelity mockups and technical prototyping.

## Product

1. Final app name: Nudge or another name?
2. Should `More` be a bottom-navigation destination or opened from Today?
3. Should the default intervention mode be Balanced?
4. Should task timers count upward, count down, or remain hidden by default?
5. Should checked list items remain visible until the user explicitly finishes a session?
6. Should one-off tasks and chores share one database entity in the first implementation?
7. How should tasks without an estimated duration be treated during quick recommendations?
8. Should strict mode delay the Return action, limit repeated bypasses, or both?

## Android intervention feasibility

1. Which Android versions will be supported?
2. What direct-launch techniques remain policy-compliant for the intended distribution method?
3. Is a floating overlay worth supporting as an explicitly enabled fallback?
4. What behavior is acceptable on devices that aggressively restrict background work?
5. How should combined sessions behave during brief switches to system apps or messages?
6. Which essential apps and system states should always suppress interventions?

## Data and recurrence

1. Should recurring chores create occurrence records or use a single rolling due date?
2. How should early completion affect calendar-based schedules?
3. Should a Deep completion satisfy pending Light and Moderate requirements once grade-specific schedules exist?
4. Should the remembered list catalog be global or per list?
5. How should spelling variants and duplicate catalog items be merged?

## Gemini

1. Which Gemini model and backend hosting option should be used?
2. Should simple single-item additions support optional auto-confirmation?
3. How long, if at all, should AI command history be retained?
4. Should offline deterministic parsing handle common phrases before invoking Gemini?

## Repository and release

1. Public or private repository?
2. License selection
3. Package/application ID
4. Minimum SDK and target SDK
5. CI requirements before application code begins
