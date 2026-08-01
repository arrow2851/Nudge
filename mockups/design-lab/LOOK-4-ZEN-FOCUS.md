# Look #4 — Zen Focus

**Status:** Active Round 1 audition  
**Design Lab version:** `0.5.0`  
**Branch:** `feature/design-lab`

## Purpose

Zen Focus tests whether Nudge can reduce overwhelm by presenting one useful starting point while keeping the complete status picture close at hand. It is intentionally quieter and more spacious than Warm Editorial and Precision Minimal.

## Emotional target

- Calm without becoming vague
- Supportive without resembling a wellness exercise
- Spacious without hiding important information
- Encouraging without implying guilt or failure
- Gentle enough for an interruption, practical enough for daily maintenance

## Core principles

### One useful starting point

The interface may recommend one routine first, but it must not remove access to the rest of the Areas, Sections, or due states.

### Progressive emphasis, not hidden data

Secondary information receives less visual weight rather than being placed behind unnecessary taps. The user can still scan the complete Area list and all required routines.

### Quiet hierarchy

Large headings, restrained dividers, soft surfaces, and limited status color create a calmer reading order. Urgency remains available through labels, counts, and wording.

### Choice without pressure

The Intervention explicitly leaves the user free to remain in the current app. Nudge offers a decision point rather than issuing a warning or punishment.

## Visual system

### Palette

- Fogged sage-white background
- Near-black green text
- Muted sage for primary actions and active navigation
- Soft blue as an optional secondary accent
- Clay and muted amber for overdue and due-today states
- Pale green-gray dividers and surfaces

### Typography

- Clean sans-serif throughout
- Large but restrained headings
- Comfortable body line-height
- No monospaced operational layer
- Small uppercase eyebrow labels used sparingly

### Shape and surfaces

- Rounded recommendation and suggestion panels
- Flat rows for the complete Area and routine lists
- Circular or orbital motifs only as quiet framing devices
- Soft shadows limited to the primary focus card
- Minimum 44–48 px interactive targets

## Screen strategy

### Areas overview

- A calm summary describes total attention without dramatizing it.
- One priority routine becomes the suggested starting point.
- Every Area remains visible in a quieter complete list below.
- Heavy Backlog must still reveal the true quantity and affected Areas.

### Area detail

- One routine receives a Start Here treatment.
- Additional due routines remain immediately visible.
- Sections and later routines remain on the same page.
- Empty and all-clear states should feel intentional rather than unfinished.

### Intervention

- The first question is whether stepping away would help.
- The user is told there is no penalty for staying.
- The suggested task is presented as one useful option.
- Actions remain Start, another option, and stay here for now.

## Versatility

The system must work for:

- Home Areas and chores
- Car maintenance
- Personal administration and health routines
- Work and study upkeep

Wording should avoid making every Area sound like a room or every routine sound like self-care.

## Anti-patterns

- Hiding overdue work to preserve calmness
- Excessive empty space that forces unnecessary scrolling
- Meditation language, breathing prompts, or therapeutic claims
- Pale low-contrast text
- Replacing concrete status with ambiguous mood language
- Making the suggested action appear mandatory
- Turning every control into a large card
- Decorative animation during an intervention

## Round 1 implementation differences

Compared with Look #2 and Look #3, Look #4 intentionally changes:

- The Areas header from index/dashboard language to a calm summary
- The top-level hierarchy by elevating one routine as a starting point
- Area rows into quieter, more spacious records
- Area detail into Start Here, additional attention, Sections, and later groups
- Intervention wording to emphasize choice and non-judgment
- Navigation active state into a soft pill rather than a rule or text-only state

The fixture, routes, scenario meanings, actions, and Round 1 functionality remain equivalent.