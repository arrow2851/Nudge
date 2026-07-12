# Widgets

## 63. Small Quick Add

```text
┌───────────────────────────┐
│ Nudge                     │
│ [+ Task]   [+ List Item]  │
└───────────────────────────┘
```

## 64. Next Task

```text
┌─────────────────────────────────────┐
│ NEXT · 3 MIN                        │
│ Take out kitchen trash              │
│ [Done]       [Start]      [Another] │
└─────────────────────────────────────┘
```

## 65. Grocery

```text
┌─────────────────────────────────────┐
│ GROCERIES · 6                       │
│ □ Milk                              │
│ □ Eggs                              │
│ □ Bananas                           │
│ [+ Add Item]             [Open List]│
└─────────────────────────────────────┘
```

## 66. Today

```text
┌─────────────────────────────────────┐
│ TODAY · 4 OF 7 DONE                 │
│ ○ Take out trash                    │
│ ○ Return package                    │
│ ○ Clean bathroom mirror             │
│             [+ Quick Add]           │
└─────────────────────────────────────┘
```

## 67. Pause Interventions

```text
┌─────────────────────────────┐
│ NUDGES ACTIVE               │
│ [Pause 1 Hour]              │
└─────────────────────────────┘
```

Paused:

```text
┌─────────────────────────────┐
│ NUDGES PAUSED               │
│ 47 minutes remaining        │
│ [Resume]                    │
└─────────────────────────────┘
```

---

# Shared states

## 68. Empty Today

```text
┌─────────────────────────────────────┐
│                 ✓                   │
│ Nothing due right now               │
│ Add something new or choose a task  │
│ from your backlog.                  │
│ [Add Something]                     │
│ [Show Backlog]                      │
└─────────────────────────────────────┘
```

## 69. Empty Area

```text
┌─────────────────────────────────────┐
│ ← Garage                            │
│ No tasks in Garage yet              │
│ Add chores, repairs, or other work. │
│ [+ Add Task]                        │
│ [Use Template]                      │
└─────────────────────────────────────┘
```

## 70. Empty List

```text
┌─────────────────────────────────────┐
│ ← Groceries                         │
│ Your grocery list is empty          │
│ [ Add item...                     ] │
│ RECENTLY USED                       │
│ + Milk  + Eggs  + Bananas           │
└─────────────────────────────────────┘
```

## 71. Permission Missing

```text
┌─────────────────────────────────────┐
│ App monitoring is paused            │
│ Usage Access is disabled.           │
│ [Restore Usage Access]              │
│ Continue without monitoring         │
└─────────────────────────────────────┘
```

## 72. Offline Gemini

```text
┌─────────────────────────────────────┐
│ Gemini is unavailable               │
│ An internet connection is required. │
│ You can still add items manually.   │
│ [Use Quick Add]             [Retry] │
└─────────────────────────────────────┘
```

## 73. Undo Snackbar

```text
┌─────────────────────────────────────┐
│ Kitchen trash completed      UNDO   │
└─────────────────────────────────────┘
```

---

# Wireframe priority

## Priority 1

1. Today
2. Universal Quick Add
3. Advanced Add or Edit
4. Direct Intervention
5. Different Task
6. Not Now
7. Focus Task
8. Completion Grade
9. Areas
10. Room Detail
11. Tasks
12. Reusable List Detail
13. List Suggestions
14. Intervention Settings
15. Next Task Widget

## Priority 2

- Onboarding
- Chore Detail
- One-Time Task Detail
- Room Reset
- Shopping Session
- Gemini Input and Review
- Permissions and Compatibility
- History
- Templates

## Priority 3

- Insights
- Appearance
- Data and Backup
- Archived Items
- Empty and error states

## Implementation consolidation opportunities

- Add and Edit share the same form.
- Chore and Task details share common components.
- Gemini processing is a state of Gemini Input.
- Shopping Session may be a mode of List Detail.
- Completion Confirmation can be an overlay rather than a permanent route.
- Empty/error views are states rather than separate navigation destinations.
