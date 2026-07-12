# Direct intervention

## 36. Direct Intervention

**Contains:** monitored app, duration, one recommended task, primary and bypass actions.

```text
┌─────────────────────────────────────┐
│           5-MINUTE RESET            │
│ Instagram has been open for 5 min.  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ QUICK WIN · 3 MIN               │ │
│ │ Take out kitchen trash          │ │
│ │ House > Kitchen                 │ │
│ │ [          Start Task         ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Already Done]   [Different Task]  │
│              Not Now                │
└─────────────────────────────────────┘
```

## 37. Different Task

**Contains:** three alternatives, durations, locations, Show More.

```text
┌─────────────────────────────────────┐
│ ← Choose another task               │
│ ○ Wipe bathroom mirror         4m  │
│   House > Bathroom                  │
│ ○ Put dishes away              5m  │
│   House > Kitchen                   │
│ ○ Order replacement cable      3m  │
│   Personal                          │
│                                     │
│ [        Show More Tasks          ] │
└─────────────────────────────────────┘
```

## 38. Not Now Sheet

**Contains:** snooze intervals, pause, legitimate-use reason, app settings, return.

```text
┌─────────────────────────────────────┐
│ Not now                        ✕    │
│ Remind me in 10 minutes             │
│ Remind me in 30 minutes             │
│ Pause for 1 hour                    │
│ Pause until tomorrow                │
│ This app is needed right now        │
│ Increase Instagram’s limit        › │
│ Stop monitoring Instagram         › │
│ Return to Instagram                 │
└─────────────────────────────────────┘
```

## 39. Focus Task

**Contains:** one task, optional timer, Complete, Pause, Exit.

```text
┌─────────────────────────────────────┐
│ ✕                             Pause │
│                                     │
│      Take out kitchen trash         │
│         About 3 minutes             │
│                                     │
│              02:41                  │
│                                     │
│ [             Complete            ] │
│          Timer is optional          │
└─────────────────────────────────────┘
```

## 40. No Eligible Task

**Contains:** limit reached, add quick task, take break, return.

```text
┌─────────────────────────────────────┐
│           TIME FOR A RESET          │
│ You reached your Instagram limit.   │
│ No quick tasks are available.       │
│                                     │
│ [        Add a Quick Task         ] │
│ [Take a 5-minute break]             │
│ Return to Instagram                 │
└─────────────────────────────────────┘
```

## 41. Compatibility Fallback Notification

**System surface:** recommended task with Start, Done, Different, Later.

```text
┌─────────────────────────────────────┐
│ Nudge · 5-minute reset              │
│ Take out kitchen trash · 3 min      │
│ [Start] [Done] [Different] [Later]  │
└─────────────────────────────────────┘
```

---

# Gemini

## 42. Gemini Input

**Contains:** prompt area, voice, examples, send.

```text
┌─────────────────────────────────────┐
│ ← Ask Nudge                         │
│ What would you like to add or do?   │
│ [ Add milk, eggs, and bananas to  ] │
│ [ groceries and clean the bathroom] │
│ [ Saturday.                       ] │
│                                     │
│ [🎤 Speak]                  [Send]  │
│ TRY SAYING                          │
│ “What can I do in 10 minutes?”      │
│ “Create a monthly car checklist.”   │
└─────────────────────────────────────┘
```

## 43. Gemini Processing

**Contains:** request summary, progress, Cancel.

```text
┌─────────────────────────────────────┐
│ ← Ask Nudge                         │
│ Understanding your request...       │
│                •••                  │
│                                     │
│ “Add milk, eggs, bananas and clean  │
│ the bathroom Saturday.”             │
│                                     │
│              Cancel                 │
└─────────────────────────────────────┘
```

## 44. Gemini Review

**Contains:** proposed actions, per-item Edit, Confirm All, Cancel.

```text
┌─────────────────────────────────────┐
│ ← Review Changes                    │
│ GROCERIES                           │
│ + Milk                         Edit │
│ + Eggs                         Edit │
│ + Bananas                      Edit │
│                                     │
│ NEW CHORE                           │
│ Clean bathroom · Saturday           │
│ House > Bathroom               Edit │
│                                     │
│ [          Confirm All            ] │
│ Cancel                              │
└─────────────────────────────────────┘
```

## 45. Gemini Result

**Contains:** successful changes, Done, Undo.

```text
┌─────────────────────────────────────┐
│                 ✓                   │
│ 4 changes completed                 │
│ • Milk added to Groceries           │
│ • Eggs added to Groceries           │
│ • Bananas added to Groceries        │
│ • Bathroom chore created            │
│                                     │
│ [Done]                       [Undo] │
└─────────────────────────────────────┘
```

---
