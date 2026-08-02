# Pure-Look Interactive Implementation Order

**Design Lab milestone:** `0.8.7`  
**Approved strategy:** Option A — build one pure-Look vertical slice at a time  
**First product flow:** Routine Completion Loop

This sequence is an implementation and learning order, not a ranking or elimination list. Every active Look remains preserved in the gallery.

## Sequence

### 1. Look #4 — Zen Focus

**Why first:** Best fit with Nudge's low-pressure emotional model. It tests whether navigation, urgency, recurrence, completion, and undo can remain clear without becoming visually demanding.

**Primary learning:** Can the core behavior feel calm while still making the next action obvious?

### 2. Look #3 — Precision Minimal

**Why second:** Provides the strongest operational contrast to Zen Focus. It stress-tests dense information, repeated checklist use, and fast scanning after the behavior contract is established.

**Primary learning:** Can the same flow become more efficient without losing comprehension or emotional restraint?

### 3. Look #5 — Playful Modular

**Why third:** Tests household approachability, modular grouping, and friendly completion feedback after calm and operational baselines exist.

**Primary learning:** Can chores feel lighter and more inviting without becoming noisy or juvenile?

### 4. Look #7 — Bold Utility

**Why fourth:** Exercises the flow under the most direct high-contrast hierarchy and is especially useful for Heavy Backlog and urgent states.

**Primary learning:** Can a forceful visual system remain supportive rather than punitive?

### 5. Look #6 — Tactile Household

**Why fifth:** Introduces stronger physical-control metaphors and completion affordances after the underlying interaction behavior is stable.

**Primary learning:** Do tactile cues improve confidence and satisfaction without adding unnecessary visual weight?

### 6. Look #2 — Warm Editorial

**Why sixth:** Tests content-rich hierarchy, longer labels, recurrence explanations, and softer household storytelling after interaction density has been proven elsewhere.

**Primary learning:** Can an editorial tone support repeated task use without slowing action?

### 7. Look #8 — Ambient Glass

**Why seventh:** Carries the greatest transparency, compositing, and lower-end rendering risk. It should inherit a mature interaction contract before performance tuning begins.

**Primary learning:** Can a premium atmospheric treatment remain fast, legible, and practical?

### 8. Look #9 — Retro Digital

**Why last:** It is the most structurally and tonally divergent direction. Implementing it last makes it the strongest test of whether the established behavior can survive a highly distinctive presentation system.

**Primary learning:** How far can the visual language change without changing the product's meaning or usability?

## Per-Look delivery rule

Each Look receives the same Routine Completion Loop before a different product flow is introduced:

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

A Look is considered complete for this slice only after:

- Normal Day works.
- Heavy Backlog works.
- All Clear works.
- New or unconfigured Area works.
- Long Content works.
- Large Text works.
- Completion and undo are keyboard reachable.
- Browser Back and Forward preserve valid state.
- Primary actions remain reachable on short screens.
- No status depends on color alone.

## Feature order after all eight Looks receive the Routine Completion Loop

1. Task hierarchy loop.
2. Intervention-to-action loop.
3. Reusable Lists loop.

For each later feature, begin with Look #4 and apply the same Look order unless a documented technical dependency requires a change.

## Protected boundaries

- Look #1 remains a separate protected baseline and is not in this implementation sequence.
- No Look is deleted, rejected, or declared the permanent product design.
- Look switching remains a Design Lab review control, not a product-facing theme setting.
- Prototype state remains deterministic and isolated.
- No production backend or app storage integration.
- No merge into `main`.

## Automatic continuation rule

The user delegated Look selection and ordering. Routine `go` messages advance to the next unchecked implementation milestone in this sequence. A new hard stop is required only for a material scope, architecture, storage, deployment, protected-baseline, or merge decision.
