# Interactive Expansion Decision Record

**Design Lab milestone:** `0.8.6`  
**Status:** Decision prepared; implementation intentionally blocked pending approval  
**Branch:** `feature/design-lab`

## Why a decision is required

The visual-gallery phase proved that Nudge can support multiple coherent visual systems. The next phase changes the nature of the work: it introduces real interaction state, navigation, completion behavior, recurrence, task hierarchy, and reusable components.

That work should not begin until the relationship between product behavior and the eight active visual directions is explicit. Otherwise, implementation could accidentally:

- Turn one Look into the de facto product winner.
- Duplicate behavior eight times and create inconsistent bugs.
- Mix visual systems without a coherent rule.
- Add a user-facing theme feature that was never approved.
- Create storage, routing, or architecture that is difficult to migrate.

## Decisions required before implementation

Four decisions are intentionally grouped into one implementation gate.

### Decision 1 — Expansion strategy

#### Option A: One pure-Look vertical slice

Build the first complete interaction flow in one selected Look.

**Advantages**

- Lowest initial implementation cost.
- Fastest path to a deep prototype.
- Simplest visual and component architecture.

**Disadvantages**

- Conflicts with the user's preference to retain every direction.
- Risks turning the first Look into an accidental permanent choice.
- Provides no proof that behavior can remain shared across Looks.

**Use when:** The immediate goal is speed and one presentation direction is acceptable.

#### Option B: Feature-specific visual variants

Use different Looks for different experimental surfaces—for example, a dense Look for Tasks and a calm Look for Intervention.

**Advantages**

- Lets each Look work where it is strongest.
- Avoids implementing every screen eight times.
- Can reveal which visual qualities belong to which product moments.

**Disadvantages**

- Can feel like several unrelated apps.
- Makes navigation transitions harder to evaluate.
- Creates ambiguity over whether the variants are experiments or the intended product.

**Use when:** The goal is component discovery rather than a coherent end-to-end experience.

#### Option C: Shared behavior core with eight Design Lab theme adapters — recommended

Build one semantic interaction tree and one state model. Each Look supplies presentation tokens and a limited set of Look-specific layout adapters. The Look switch remains a Design Lab review control, not a user-facing product preference.

**Advantages**

- Preserves every visual direction.
- Prevents behavior from being copied eight times.
- Makes cross-Look comparison fair because routes, states, and actions are identical.
- Allows a pure Look or controlled synthesis to be chosen later without rewriting product behavior.
- Exposes which designs require legitimate structural exceptions.

**Disadvantages**

- Higher initial architecture cost.
- Some highly distinctive Looks cannot be expressed through tokens alone.
- Requires strict boundaries between semantic components and visual adapters.
- Eight-Look regression testing remains substantial.

**Use when:** The goal is to retain the complete gallery while building credible interaction depth.

### Decision 2 — First vertical slice

Candidate slices are detailed in [`VERTICAL-SLICE-CANDIDATES.md`](VERTICAL-SLICE-CANDIDATES.md).

**Recommended first slice:** Routine completion loop.

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Updated recurrence and next-action state
```

This is the best first slice because it crosses the app's core information architecture, tests urgency without guilt, exercises completion feedback, and gives every Look enough structure to demonstrate its strengths.

### Decision 3 — Look switching exposure

#### Option A: Design Lab only — recommended

The reviewer can switch Looks inside the experimental build. No theme selector appears in the product UI.

#### Option B: Product-facing themes

Users can choose among Looks in Settings.

This is a new product feature, creates preference storage and migration requirements, and should not be inferred from the user's desire to preserve the experiments.

**Recommendation:** Keep Look switching in the Design Lab only until user-facing themes are separately approved.

### Decision 4 — Prototype state boundary

#### Option A: Isolated deterministic prototype state — recommended

Use local seeded fixtures and session/local state inside `mockups/design-lab/`. Do not connect production services or alter application storage.

#### Option B: Production-like persistence

Introduce durable local schemas, data migration, or backend-shaped service boundaries.

**Recommendation:** Keep the first vertical slice isolated and deterministic. Define semantic state interfaces, but defer permanent storage and production routing.

## Recommended decision package

Approve all four together:

1. **Strategy:** Shared behavior core with eight Design Lab theme adapters.
2. **First slice:** Routine completion loop.
3. **Look switch:** Design Lab review control only.
4. **State:** Isolated deterministic prototype state with no production integration.

## Proposed implementation boundaries after approval

### Shared semantic layer

- One route and state model.
- One action vocabulary.
- One accessibility structure.
- One set of fixture scenarios.
- One completion and recurrence model.
- One test contract across every Look.

### Look-owned presentation layer

- Color, typography, spacing, borders, elevation, icon treatment, and motion intent.
- Approved layout adapters where a Look's structure genuinely differs.
- Look-specific copy tone only when semantic meaning remains equivalent.
- No Look-specific product functionality.

### First-slice states

- Normal day.
- Heavy backlog.
- All clear.
- New or unconfigured Area.
- Long content.
- Large Text.
- Chore incomplete.
- Chore completing.
- Chore completed.
- Recurrence advanced.
- Safe undo or reopen state.

### Explicit exclusions

- Production backend integration.
- Account synchronization.
- Notifications or operating-system app blocking.
- User-facing theme selection.
- Full Tasks hierarchy.
- Full reusable Lists.
- Dark variants.
- Editing the protected Look #1 prototype.
- Merging into `main`.

## Acceptance gates for the first interactive slice

- Identical behavior and action availability across all active Looks.
- No duplicated Look-specific business logic.
- Browser Back and Forward preserve state correctly.
- Completion and undo are keyboard reachable.
- Large Text does not hide the primary action.
- Long names and recurrence labels do not overflow horizontally.
- Status is never represented by color alone.
- Every Look can complete the same scripted test path.
- Look switching does not reset the semantic interaction state unless Reset Review State is used.
- Look #1 remains a separate protected reference unless an explicit decision promotes it into the shared interactive architecture.

## Hard-stop rule

Implementation of the vertical slice is a material architecture and scope decision. It must not begin until the recommended package or an alternative package is intentionally approved.
