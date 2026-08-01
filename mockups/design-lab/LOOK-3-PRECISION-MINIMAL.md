# Look #3 — Precision Minimal

**Round:** 1 visual audition  
**Branch:** `feature/design-lab`  
**Shared screens:** Areas overview, representative Area detail, Intervention  
**Shared scenarios:** All Design Lab fixtures

## Design intent

Precision Minimal treats Nudge as a calm, high-efficiency utility. The interface should feel deliberate, exact, and mature without becoming cold, corporate, or punitive.

## Core principles

1. **Alignment carries hierarchy.** Use a strict column grid, consistent baselines, and predictable row geometry.
2. **Information before decoration.** Status, next action, recurrence, and location remain visible without relying on cards or illustration.
3. **One sharp accent.** Electric cobalt identifies active controls and primary action; urgency still uses text and restrained semantic color.
4. **Compact but not cramped.** More information is visible than in Warm Editorial, but touch targets remain accessible.
5. **Numbers are operational.** Counts, durations, and status metadata use monospaced typography.
6. **Intervention remains humane.** The tone is direct and respectful, never disciplinary or system-warning-like.

## Visual system

### Palette

- Canvas: near-white `#f7f7f5`
- Primary ink: near-black `#161719`
- Secondary ink: slate `#5d6268`
- Hairline: `#d9dbde`
- Soft surface: `#eceef0`
- Accent: electric cobalt `#315cff`
- Overdue: deep brick `#a33a32`
- Due today: dark amber `#806000`

### Typography

- Primary UI: Inter or system sans-serif
- Operational metadata: JetBrains Mono or system monospace
- No serif display typography
- Titles use weight and spacing rather than decorative size changes

### Shape and surface

- Square or 2–4 px radii
- No floating cards in primary lists
- No decorative shadows inside the application
- Thin borders, section rules, and subtle filled selection states

### Navigation

- Bottom navigation remains for functional equivalence in Round 1
- Active destination uses a compact cobalt top rule and stronger text
- Icons and labels remain small but readable

### Status treatment

- Status is represented by text, count, position, and color
- Overdue and due-today rows receive restrained left-edge markers
- Clear states remain intentional rather than visually empty

## Screen behavior

### Areas overview

- Compact operational header with total attention count
- Column labels establish the table structure
- Every Area row exposes name, routine/section count, next routine, and status
- No separate decorative summary card

### Area detail

- Header exposes attention and routine totals
- Due routines appear first in a dense checklist
- Section rows behave like an index table
- Upcoming and as-needed routines remain visible below

### Intervention

- Full-screen, direct hierarchy
- Usage duration is acknowledged without alarm language
- Suggested action appears as a focused work item rather than a motivational card
- Primary, alternate, and dismiss actions remain clearly separated

## Motion and feedback

- Short, linear, functional transitions
- No bounce, celebratory flourish, or ambient movement
- Completion may use a brief check transition and row collapse in Round 2
- Reduced motion should remove all nonessential transition

## Accessibility requirements

- Minimum practical target height around 44 px
- Monospaced text is limited to metadata, never long prose
- Hairlines must retain sufficient contrast
- Accent is never the only indicator of selection or urgency
- Long content must wrap rather than disappear behind ellipsis when meaning would be lost

## Anti-patterns

- Corporate dashboard language
- Excessively tiny text justified as density
- Pure black-on-white glare without softened surfaces
- Red warning blocks that make chores feel like incidents
- Monospaced body paragraphs
- Decorative metrics without action value
- Removing whitespace until rows become difficult to touch

## Versatility

The system intentionally avoids household-coded decoration. The same row and metadata grammar should work for Home, Car, Personal, Work, and future abstract Areas.

## Round 1 comparison question

Can Nudge feel substantially faster and more scalable than Look #2 while still remaining calm enough for repeated daily use and respectful enough during an intervention?
