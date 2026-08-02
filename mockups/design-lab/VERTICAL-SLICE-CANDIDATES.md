# Interactive Vertical Slice Candidates

**Design Lab milestone:** `0.8.6`  
**Purpose:** Define comparable interactive-expansion options without implementing any of them.

## Evaluation criteria

Each candidate is judged by whether it:

- Represents a central Nudge behavior.
- Exercises several reusable components.
- Exposes meaningful differences among all active Looks.
- Can remain deterministic and isolated inside the Design Lab.
- Produces a clear scripted test path.
- Avoids premature production architecture.
- Provides enough learning to guide the next slice.

## Candidate 1 — Routine completion loop

### Flow

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete chore
→ Recurrence advances
→ Undo or reopen
```

### Behaviors covered

- Needs Attention prioritization.
- Area and Section navigation.
- Chore status and due-state presentation.
- Completion feedback.
- Recurrence advancement.
- Undo or reopen behavior.
- All-clear transition.
- Browser history and state restoration.

### Components covered

- Summary card or attention strip.
- Area row or card.
- Section row or card.
- Chore row.
- Chore-detail panel.
- Primary and secondary actions.
- Status labels.
- Completion animation or feedback.
- Toast or reversible confirmation.

### Why it is the recommended first slice

This flow is the clearest expression of Nudge's core promise: turn upkeep into a manageable next action without creating guilt. It also crosses enough screens to test whether each Look remains coherent during navigation rather than only in isolated screenshots.

### Main risks

- Recurrence rules can expand rapidly if not constrained.
- Today and Needs Attention could become overdesigned before the broader product model is settled.
- Look-specific completion feedback must not create different behavior.

### Boundary for the first implementation

Use only three recurrence tiers—Light, Moderate, and Deep—with deterministic next-date examples. Do not implement calendar synchronization, notifications, or complex scheduling exceptions.

## Candidate 2 — Task hierarchy loop

### Flow

```text
Tasks
→ Add empty task
→ Edit title
→ Mark as main task
→ Add subtasks
→ Reorder
→ Indent or unindent
→ Complete and reopen
```

### Behaviors covered

- Inline creation and editing.
- Main-task and subtask relationships.
- Drag or hold reordering.
- Swipe or explicit indent controls.
- Completion propagation.
- Completed-item grouping and hide/show behavior.

### Components covered

- Checklist row.
- Drag handle.
- Completion control.
- Editable title region.
- Optional time indicator.
- Settings disclosure.
- Main-task progress bar.
- Subtask add control.

### Strengths

- Directly tests the simple checklist model already defined for Nudge.
- High interaction density reveals whether each Look supports repeated daily use.
- Produces reusable task-row architecture.

### Risks

- Drag, swipe, keyboard reordering, and accessibility semantics are substantially more complex than routine completion.
- Could consume the entire prototype budget before Areas and Intervention are connected.
- Mobile gesture behavior is difficult to validate in the current environment.

### Recommended position

Second slice, after the shared interaction architecture and state model are proven by Candidate 1.

## Candidate 3 — Intervention-to-action loop

### Flow

```text
Intervention appears
→ Start suggested task
→ Focused completion view
→ Complete
→ Return to prior context
```

Alternative paths:

```text
Choose another
Not now
Dismiss without guilt
```

### Behaviors covered

- Optional interruption.
- Suggested-action selection.
- Alternative-action selection.
- Respectful dismissal.
- Focused task mode.
- Completion and return behavior.

### Components covered

- Intervention panel.
- Suggested-task card.
- Primary, alternative, and dismiss actions.
- Focused completion view.
- Timer or duration cue.
- Return-state confirmation.

### Strengths

- Most directly tests Nudge's differentiating emotional experience.
- Reveals tone differences among calm, bold, playful, tactile, and digital Looks.
- Small enough to prototype deeply.

### Risks

- Does not sufficiently test the broader information architecture by itself.
- Real operating-system app detection and redirection are outside the Design Lab boundary.
- A simulated trigger can make the flow feel more complete than it really is.

### Recommended position

Third slice, after Candidate 1 establishes real chores and navigation that the Intervention can point into.

## Candidate 4 — Reusable list loop

### Flow

```text
Lists
→ Open reusable grocery list
→ Add suggested item
→ Check items
→ Complete shopping session
→ Reset or reopen list
```

### Behaviors covered

- Reusable versus one-off list behavior.
- Suggestions.
- Add, check, uncheck, and reset.
- Completed-item placement.
- Empty and all-complete states.

### Components covered

- List card.
- Checklist item.
- Suggestion chip or row.
- Inline add control.
- Completed-items section.
- Reset or reuse action.

### Strengths

- Simple and practical.
- Useful for testing repeated checklist interactions without hierarchy.
- Good fit for playful, tactile, and utility Looks.

### Risks

- Less representative of the core Areas and recurrence model.
- May duplicate task-row work without resolving task hierarchy.
- Suggestions can imply intelligence or personalization that is not yet defined.

### Recommended position

Fourth slice, after Tasks establish the shared checklist primitives.

## Candidate 5 — Two-family comparison slice

This is an experimental implementation format rather than a separate product flow.

### Structure

Build Candidate 1 twice using two visual families:

- **Operational family:** Looks #1, #3, #7, and #9.
- **Calm and expressive family:** Looks #2, #4, #5, #6, and #8.

### Strengths

- Lower initial rendering burden than certifying all eight active Looks immediately.
- Tests whether two coherent design-system families are more practical than eight independent adapters.

### Risks

- Still creates an implicit grouping and prioritization decision.
- Look #1 is a protected reference and should not silently enter the new architecture.
- Family boundaries may obscure the distinct value of individual Looks.

### Recommendation

Do not use this as the default. Keep it as a fallback if the eight-adapter strategy proves technically disproportionate during architecture design.

## Recommended delivery sequence

1. **Routine completion loop** using one shared behavior core and eight active Look adapters.
2. **Task hierarchy loop** using the same semantic component and state boundaries.
3. **Intervention-to-action loop** connected to real routine and task destinations.
4. **Reusable list loop** built from established checklist primitives.

## Required scripted path for Candidate 1

Every active Look must support the same script:

1. Open Normal Day at Today or Needs Attention.
2. Open Kitchen.
3. Open Countertops & Surfaces.
4. Open Wipe countertops.
5. Mark it complete.
6. Verify the next recurrence state.
7. Return to the Area.
8. Verify attention count updates.
9. Undo or reopen the chore.
10. Switch Looks without losing semantic state.
11. Repeat under Heavy Backlog.
12. Repeat with Large Text and Long Content.

## Decision summary

**Recommended first slice:** Candidate 1 — Routine completion loop.

**Recommended expansion strategy:** One shared semantic behavior core with eight Design Lab visual adapters. The Look selector remains experimental and is not introduced as a product-facing theme feature.
