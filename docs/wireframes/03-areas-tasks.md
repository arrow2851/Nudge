# Areas and rooms

## 17. Areas

**Contains:** areas, due counts, subarea summaries, Add Area.

```text
┌─────────────────────────────────────┐
│ Areas                         +     │
│ ┌─────────────────────────────────┐ │
│ │ HOUSE                     7 due │ │
│ │ Kitchen 3 · Bedroom 2           │ │
│ │ Bathroom 1 · Living Room 1      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ CAR                       2 due │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ PERSONAL                  4 due │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Today  Areas   [+]   Lists   Tasks  │
└─────────────────────────────────────┘
```

## 18. Add or Edit Area Sheet

**Contains:** name, icon, optional room creation, save/archive/delete.

```text
┌─────────────────────────────────────┐
│ Add Area                       ✕    │
│ Name                                │
│ [ Basement                        ] │
│ Icon  [⌂] [🚗] [□] [★] [•••]       │
│                                     │
│ + Add subarea                       │
│                         [Save Area] │
└─────────────────────────────────────┘
```

## 19. Area Detail

**Contains:** progress, filters, subareas, general tasks, add.

```text
┌─────────────────────────────────────┐
│ ← House                       ⋮     │
│ 7 due · 13 completed this week      │
│ [Due] [All] [Chores] [Tasks]        │
│                                     │
│ Kitchen                       3 due ›│
│ Bedroom                       2 due ›│
│ Bathroom                      1 due ›│
│ Living Room                   1 due ›│
│                                     │
│ GENERAL HOUSE                       │
│ No pending tasks                    │
│                         [+ Add Task]│
└─────────────────────────────────────┘
```

## 20. Room Detail

**Contains:** room health, due chores, routines, tasks, Room Reset.

```text
┌─────────────────────────────────────┐
│ ← Kitchen                     ⋮     │
│ 3 due · Last reset 2 days ago       │
│ Deep clean due in 9 days            │
│ [       Start Kitchen Reset       ] │
│                                     │
│ DUE NOW                             │
│ ○ Take out trash               3m  │
│ ○ Wipe counters                5m  │
│ ROUTINE CHORES                      │
│ ○ Clean microwave             10m  │
│ ○ Mop floor                   15m  │
│ ONE-TIME TASKS                      │
│ ○ Replace cabinet handle      20m  │
│                         [+ Add Task]│
└─────────────────────────────────────┘
```

## 21. Room Reset

**Contains:** progress, current task, remaining sequence, Complete, Skip.

```text
┌─────────────────────────────────────┐
│ ✕ Kitchen Reset              1 of 4 │
│ ████████░░░░░░░░░░░░               │
│                                     │
│ CURRENT TASK                        │
│ Take out kitchen trash              │
│ About 3 minutes                     │
│                                     │
│ [             Complete            ] │
│ [Skip]                    [Add Note]│
│                                     │
│ UP NEXT                             │
│ • Wipe counters                     │
│ • Put dishes away                   │
│ • Sweep floor                       │
└─────────────────────────────────────┘
```

---

# Tasks and chores

## 22. Chore Detail

**Contains:** location, due, recurrence, duration, grading, history, start/complete/snooze.

```text
┌─────────────────────────────────────┐
│ ← Clean Kitchen               ⋮     │
│ House > Kitchen                     │
│ Due Saturday · Repeats weekly       │
│ Estimated time: 25 minutes          │
│ Completion grading enabled          │
│                                     │
│ [           Start Chore           ] │
│ [Complete]              [Snooze]    │
│                                     │
│ LAST: Moderate · 6 days ago         │
│ HISTORY                             │
│ Deep Jun 21 · Moderate Jun 14       │
│                                     │
│ Edit chore                          │
└─────────────────────────────────────┘
```

## 23. One-Time Task Detail

**Contains:** location, due, status, duration, notes, attachments, completion and status actions.

```text
┌─────────────────────────────────────┐
│ ← Replace cabinet handle      ⋮     │
│ House > Kitchen                     │
│ Due today · Planned · 20 minutes    │
│                                     │
│ [            Start Task           ] │
│ [Complete]          [Reschedule]    │
│                                     │
│ NOTES                               │
│ Replacement handle is in garage.    │
│                                     │
│ + Add photo or document             │
│ Mark as waiting                     │
│ Mark as blocked                     │
└─────────────────────────────────────┘
```

## 24. Completion Grade Sheet

**Contains:** Light, Moderate, Deep, descriptions, optional note.

```text
┌─────────────────────────────────────┐
│ How much did you complete?     ✕    │
│ Clean Kitchen                       │
│                                     │
│ [ LIGHT    Quick surface reset    ] │
│ [ MODERATE Normal thorough clean  ] │
│ [ DEEP     Detailed full clean    ] │
│                                     │
│ Add note                            │
└─────────────────────────────────────┘
```

## 25. Completion Confirmation

**Contains:** confirmation, grade, next date, next task, note, undo.

```text
┌─────────────────────────────────────┐
│                 ✓                   │
│         Kitchen completed           │
│        Moderate cleaning            │
│                                     │
│ Next due: Saturday, July 18         │
│                                     │
│ [       Choose Next Task          ] │
│ Add note                    Undo    │
└─────────────────────────────────────┘
```

## 26. Snooze or Reschedule Sheet

**Contains:** common delays, custom date, skip, pause recurrence.

```text
┌─────────────────────────────────────┐
│ Snooze “Clean Kitchen”         ✕    │
│ Later today                         │
│ Tomorrow                            │
│ This weekend                        │
│ Next week                           │
│ Choose date and time              › │
│ ─────────────────────────────────── │
│ Skip this occurrence               │
│ Pause recurring chore             › │
└─────────────────────────────────────┘
```

## 27. Tasks

**Contains:** status tabs, dated groups, filters, quick add.

```text
┌─────────────────────────────────────┐
│ Tasks                         🔍  ⋮ │
│ [Inbox] [Today] [Upcoming]          │
│ [Waiting] [Someday]                 │
│                                     │
│ TODAY                               │
│ ○ Return package              10m  │
│ ○ Call repair shop             5m  │
│ ○ Order bathroom handle        5m  │
│                                     │
│ UPCOMING                            │
│ ○ Take car for repairs       Sat   │
│ ○ Renew registration        Jul 30 │
│ WAITING                             │
│ ◌ Replacement shelf delivery       │
├─────────────────────────────────────┤
│ Today  Areas   [+]   Lists   Tasks  │
└─────────────────────────────────────┘
```

## 28. Task Filter and Sort Sheet

**Contains:** status, area, duration, priority, sort, reset/apply.

```text
┌─────────────────────────────────────┐
│ Filter and Sort                ✕    │
│ STATUS  ☑ Incomplete ☐ Waiting      │
│ AREA    All Areas                 › │
│ DURATION [Any] [≤5m] [≤15m] [≤30m] │
│ SORT BY ● Due ○ Priority ○ Shortest │
│                                     │
│ [Reset]                    [Apply]  │
└─────────────────────────────────────┘
```

---
