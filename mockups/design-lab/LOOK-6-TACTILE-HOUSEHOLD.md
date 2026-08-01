# Look #6 — Tactile Household

**Design Lab version:** `0.6.0`  
**Branch:** `feature/design-lab`  
**Round:** 1 visual audition

## Intent

Tactile Household should feel like a dependable household toolboard: labeled drawers, index cards, check marks, stamped statuses, and controls that look ready to press. It must remain a digital interface rather than a literal imitation of wood, paper, or machinery.

The emotional target is:

- practical
- familiar
- satisfying
- organized
- warm without becoming cute
- distinctive without slowing routine use

## Core principles

### 1. Controls should look usable

Buttons, check controls, tabs, and rows receive clear edges, depth, and pressed-state intent. Decoration must reinforce affordance rather than compete with it.

### 2. Use materials as hierarchy

The interface uses a restrained material vocabulary:

- warm workbench background
- light card and label surfaces
- dark ink
- utility green for primary actions
- brick red for overdue
- ochre for due today
- muted blue for informational hardware

The effect comes from borders, offsets, and subtle shadows—not photographic textures.

### 3. Labels organize the system

Area names, Section names, and statuses resemble durable labels or stamped tags. Long names must wrap rather than shrink into illegibility.

### 4. Tactility must scale beyond chores

Home, Car, Work, and Personal content all use the same language of stations, cards, routines, and labels. The aesthetic must not assume every Area is a room.

### 5. Keep the Intervention humane

The Intervention may resemble a small timer or control panel, but the copy remains supportive. It must never look like an alarm, lockout screen, or punishment device.

## Typography

- Inter remains the primary readable face.
- JetBrains Mono is limited to stamped labels, counts, and short metadata.
- Headings are sturdy and compact rather than decorative.
- Essential text never uses distressed, handwritten, or novelty fonts.

## Shape and spacing

- Cards use moderate radii with offset shadows.
- Label tabs may overlap card borders when they improve grouping.
- Rows retain at least 44 px critical interaction targets.
- Dense scenarios reduce decorative spacing before reducing readable text.

## Status treatment

Status is always communicated through words and structure as well as color.

- Overdue: brick-red stamped label
- Due today: ochre stamped label
- Current: utility-green or neutral label
- As needed / upcoming: muted neutral label

## Areas overview

The overview behaves like a labeled maintenance board:

- summary strip at the top
- one card per Area
- clear routine and Section counts
- next useful routine shown on every populated Area
- visible status tag
- direct Area affordance

The Large Household scenario must remain a scannable stack rather than a decorative grid.

## Area detail

The Area detail resembles a clipboard or service card:

- Area label and counts at the top
- one priority routine on a raised card
- remaining routines in durable checklist rows
- Sections shown as labeled drawer rows
- later and as-needed routines remain visible

## Intervention

The Intervention resembles a small, calm timer panel:

- elapsed-app time is visible but not alarming
- suggested action appears on a removable-looking task card
- Start is the strongest control
- Choose another is secondary
- Not now remains easy to reach and nonjudgmental

## Completion intent for Round 2

A completed check should feel mechanically satisfying through a brief press, mark, and settle animation. No confetti, bouncing, or reward noise is required.

## Anti-patterns

Avoid:

- fake wood grain, leather, torn paper, tape, or photorealistic textures
- decorative screws on every component
- shadows so strong that dense lists become noisy
- tiny label-maker typography
- novelty switches for actions that should be ordinary buttons
- alarm colors or lockout language in the Intervention
- household-only metaphors that make Work or Personal feel misplaced
- hidden information in drawers or cards during Round 1

## Accessibility requirements

- critical targets remain approximately 44–48 px
- status is expressed in text
- long labels wrap
- Large Text increases fixed-size labels and content
- forced-colors mode preserves boundaries and controls
- screen-reader labels summarize the full Area, routine, and Section meaning
- decorative hardware remains hidden from assistive technology

## Round 1 fairness

Look #6 consumes the exact same shared scenarios, routes, meanings, and simulated actions as Looks #2–#4. Its tactile appearance does not grant additional functionality.