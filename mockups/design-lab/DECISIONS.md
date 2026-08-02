# Design Lab Decisions and Feedback Log

This file records review decisions, intentional interaction differences, plan adjustments, and reusable findings. Material scope changes still require the pause-and-review process defined in `DESIGN-LAB-CHECKLIST.md`.

## 2026-08-01 — Design Lab branch and shared comparison rules

**Decision:** Create `feature/design-lab`; keep experimental files under `mockups/design-lab/`; preserve Look #1 on `main`.

**Shared scenarios:** Normal Day, Heavy Backlog, New User, All Clear, Large Household, Long Content, and Large Text.

**Fairness rule:** Look-specific presentation and wording may vary, but fixture content, urgency meaning, and action availability remain equivalent.

## 2026-08-01 — Keep every visual direction

**User decision:** Retain every numbered direction rather than eliminate Looks.

**Result:** Looks #2 through #9 remain active gallery directions. Look #1 remains the protected baseline.

**Mixing rule:** Pure Looks and documented controlled synthesis remain allowed; unrestricted style mixing within one screen is prohibited.

## 2026-08-01 — Option A selected for interactive expansion

**User decision:** Build one pure-Look vertical slice at a time.

**Delegated order:**

1. Look #4 — Zen Focus
2. Look #3 — Precision Minimal
3. Look #5 — Playful Modular
4. Look #7 — Bold Utility
5. Look #6 — Tactile Household
6. Look #2 — Warm Editorial
7. Look #8 — Ambient Glass
8. Look #9 — Retro Digital

This is a learning and technical-risk sequence, not a ranking or permanent product-design decision.

**Later feature order:** Task hierarchy, Intervention-to-action, then Reusable Lists.

**Automatic continuation:** Routine `go` messages advance to the next unchecked milestone. A hard stop remains required for material scope, architecture, storage, deployment, Look #1, product-theme, or merge decisions.

## 2026-08-01 — Shared Routine Completion behavior contract

**Established in:** Version `0.9.0`, Look #4 — Zen Focus.

```text
Today / Needs Attention
→ Areas
→ Area detail
→ Section
→ Chore detail
→ Complete
→ Recurrence advances
→ Attention counts update
→ Undo or reopen
```

**State:** Completion records use a separate Design Lab session-storage namespace. Shared fixtures remain immutable.

**Recurrence:** The prototype uses deterministic Light, Moderate, and Deep next-cycle labels without production scheduling or calendar integration.

**Reversibility:** Completing from any supported screen opens or retains Chore detail so Undo remains immediately available.

**Routes:** The route contract includes `today`, `section`, and `chore`, with Area, Section, and Chore identifiers in the query string.

**Evidence boundary:** Exact-checkout, physical-device, and screen-reader evidence remain separate from committed-source contract inspection.

## 2026-08-01 — Look #3 applies the contract with operational density

**Milestone:** Version `0.9.1`.

**Presentation:** Compact queue, explicit metrics, square controls, monospaced metadata, and a fact-table Chore detail.

**Shared correction:** `nextRoutine` deprioritizes completed routines before status sorting.

## 2026-08-01 — Look #5 adds friendly modular feedback

**Milestone:** Version `0.9.2`.

**Presentation:** Colorful priority hero, modular Area and Section cards, separate completion/detail controls, and positive reversible feedback.

**Tone boundary:** Friendly language may make the action feel lighter, but it must not trivialize backlog or imply guilt.

## 2026-08-01 — Look #7 uses directness without alarm

**Milestone:** Version `0.9.3`.

**Presentation:** One large priority action, explicit queue counters, thick rules, high-contrast status panels, and a compact fact-grid Chore detail.

**Tone boundary:** Bold hierarchy may be direct, but it must not shame the user, imply failure, or turn backlog into an alarm.

## 2026-08-01 — Look #6 makes care tangible without implying brokenness

**Milestone:** Version `0.9.4`.

**Presentation:** Work orders, service cards, Section drawers, inspection stamps, job facts, completion slips, and Reopen job card.

**Tone boundary:** Physical maintenance metaphors may make work concrete, but they must not suggest that the user, household, or Area is defective.

## 2026-08-01 — Look #2 provides context without creating a diary obligation

**Milestone:** Version `0.9.5` implements the Routine Completion Loop in Look #2 — Warm Editorial.

**Presentation:** Today becomes a quiet daily page with one featured entry, secondary routines remain as additional notes, Sections read as smaller collections, and Chore detail combines narrative context with practical facts.

**Tone boundary:** Editorial language may add warmth and meaning, but it must not make routine completion feel like journaling homework, require reflection, or obscure the actual action and status.

**Action separation:** Routine entries use separate completion and detail targets. Opening an entry does not complete it.

**Reversibility:** The completed screen closes the entry with restrained feedback and immediately presents `Reopen this entry`.

**Cross-Look state:** Looks #2 through #7 share semantic completion state. Visual switching changes presentation only.

**Accessibility:** Completed state uses text, a checkmark, and line-through. Critical targets retain the 48 px floor; Large Text actions reach 54 px; forced-colors uses system colors.

## 2026-08-01 — Look #8 treats transparency as enhancement, not structure

**Milestone:** Version `0.9.6` implements the Routine Completion Loop in Look #8 — Ambient Glass.

**Presentation:** Today uses one translucent priority surface, additional routines remain in readable panels, Area and Section navigation retains atmospheric depth, and Chore detail combines a focused card with practical facts and restrained completed-cycle feedback.

**Semantic boundary:** Aurora, glow, blur, gradients, and translucent depth are decorative. Urgency, completion, recurrence, and navigation remain understandable through text, structure, borders, and controls when every decorative effect is removed.

**Fallback requirement:** Browsers without backdrop-filter support and users requesting reduced transparency receive solid panel backgrounds. Forced Colors removes decorative effects and uses system colors.

**Performance boundary:** Blur is limited to high-value surfaces rather than every row. This reduces compositing pressure but does not constitute lower-end hardware evidence.

**Reversibility:** Completion opens or retains Chore detail and immediately exposes `Undo completion`.

**Cross-Look state:** Looks #2 through #8 share semantic completion state. Visual switching changes presentation only.

**Accessibility:** Completed state uses explicit text, checkmark, and line-through; critical targets retain the 48 px floor; Large Text actions reach 54 px.

## 2026-08-01 — Look #9 uses system clarity without failure language

**Milestone:** Version `0.9.7` implements the Routine Completion Loop in Look #9 — Retro Digital and completes the flow across all eight active Looks.

**Presentation:** Today uses an optional action queue, Areas use node rows and attention meters, Sections use a directory, and Chore detail uses a routine record, practical facts, and a completion log.

**Tone boundary:** Terminal and system language may improve clarity, but normal backlog must not be described as an error, malfunction, or failed state. The user is offered available actions rather than commanded to repair the system.

**Action separation:** Every routine row has separate completion and detail targets. Opening a routine never completes it.

**Queue integrity:** Mixed Today queues retain each routine's own Area identifier so navigation and completion always affect the correct record.

**Reversibility:** Completion opens or retains Chore detail and immediately presents `UNDO COMPLETION`.

**Cross-Look state:** Looks #2 through #9 share semantic completion state. Visual switching changes presentation only.

**Accessibility:** Completed state uses text, `[✓]`, and line-through. Critical targets retain the 48 px floor; Large Text actions reach 54 px; Forced Colors uses system colors; Reduced Motion suppresses nonessential transitions.

**Validation boundary:** The validator now encodes eight interactive Looks, forty-eight interactive renderer exports, eight interaction stylesheets, and shared state hooks. Exact-checkout, physical Android, actual screen-reader, single-version browser regression, and Ambient Glass paint evidence remain pending.

**Sequence result:** The Routine Completion Loop is complete across all active Looks. The next recorded feature loop is Task hierarchy, beginning with Look #4 — Zen Focus.

## 2026-08-02 — Task hierarchy remains a simple checklist

**Milestone:** Version `0.10.0` implements the first Task hierarchy loop in Look #4 — Zen Focus.

**Product boundary:** Tasks remain a checklist rather than becoming a project-management workspace. The primary row contains only a drag handle, completion control, editable title, optional time shorthand, settings disclosure, and a separate subtask plus when applicable.

**Creation:** A plus in the upper-right and an Add Task action below the list both create empty editable tasks. New tasks receive focus immediately.

**Hierarchy depth:** The Design Lab supports one level of subtasks only. Nested subtasks beyond that level remain outside the approved simple model.

**Main-task rule:** Any regular task can become a main task. Turning off main-task mode releases every subtask as a regular top-level task immediately after the former main task.

**Completion rule:** Completing every subtask completes the main task. Reopening any subtask reopens the main task. Completing or reopening the main task applies the same state to its subtasks.

**Ordering rule:** Incomplete items remain above completed items. Reordering is constrained within the incomplete or completed group so the completed-bottom rule remains stable.

**Gesture boundary:** Native pointer drag is included for review. Explicit Move Up, Move Down, Indent, and Unindent controls are the accessible fallback and the reliable prototype path. Production touch hold and swipe behavior require physical-device validation and remain deferred.

**State boundary:** Task hierarchy uses a separate scenario-isolated Design Lab session-storage namespace. It does not alter routine fixtures, production persistence, or account data.

**Visibility:** Completed items remain at the bottom by default and can be hidden or shown without changing their state.

**Validation boundary:** Source-level validation checks the Tasks route, state module, add/edit actions, main/subtask rules, progress, reorder hooks, explicit movement controls, completed grouping, hide/show, responsive hooks, Forced Colors, and Reduced Motion. Exact-checkout browser, Android gesture, and actual screen-reader evidence remain pending.

## 2026-08-02 — Precision Minimal applies the shared checklist without adding scope

**Milestone:** Version `0.10.1` implements the Task hierarchy loop in Look #3 — Precision Minimal.

**Presentation:** The same checklist becomes an operational register with Active, Main, and Done counts; fixed control columns; compact settings; and explicit progress count, percentage, and track.

**Semantic parity:** Look #3 does not add priority, assignments, due-date scheduling, deletion, or deeper nesting. It exposes the same actions and state transitions as Look #4.

**Cross-Look state:** Looks #3 and #4 render the same task state. Editing, completing, reordering, indenting, or changing hierarchy in one Look remains visible after switching to the other.

**Responsive priority:** The optional time column is removed before the editable task-title area is compressed. Large Text removes the column header and retains full-width editing and 54 px action heights.

**Accessibility:** Subtasks use both indentation and an accent rail. Completion uses a checkmark and line-through. Drag remains optional because explicit Move, Indent, and Unindent controls remain available.

**Controller decision:** Routine screens and Tasks now use shared renderer registries. This reduces duplicated route branches while keeping pure-Look renderers independent.

**Validation boundary:** The validator now requires two task renderers, two task stylesheets, the shared task engine, both Look registrations, cross-Look state hooks, and responsive/accessibility tokens. Exact-checkout execution, Android gesture testing, and actual screen-reader evidence remain pending.

## 2026-08-02 — Playful Modular uses warmth without scoring

**Milestone:** Version `0.10.2` implements the Task hierarchy loop in Look #5 — Playful Modular.

**Presentation:** The shared checklist becomes colorful modular cards with Active, Main, and Done summary blocks, friendly progress wording, and a visible hierarchy rail.

**Motivation boundary:** Positive visual feedback is allowed, but points, streaks, rewards, rankings, and performance scoring remain outside the product model.

**Semantic parity:** Look #5 exposes the same task controls and state transitions as Looks #3 and #4. It does not add priority, assignments, deletion, deeper nesting, or scheduling.

**Responsive priority:** Optional time information disappears before the title area is compressed. Large Text retains clear editing and action targets.

**Cross-Look state:** Looks #3, #4, and #5 render the same task state.

## 2026-08-02 — Bold Utility uses directness without failure language

**Milestone:** Version `0.10.3` implements the Task hierarchy loop in Look #7 — Bold Utility.

**Presentation:** The shared checklist becomes a thick-rule register with factual Active, Main, and Done counts, large square controls, direct settings labels, and a strong subtask rail.

**Tone boundary:** Active tasks are not errors, alarms, or failures. Counts describe the list without creating urgency beyond the underlying task state.

**Semantic parity:** Look #7 keeps the exact shared hierarchy, completion, release, movement, and visibility behavior. It adds no priority system, assignments, scoring, deletion, deeper nesting, or scheduling.

**Accessibility:** Completion uses a checkmark and line-through. Drag remains optional because Move, Indent, and Unindent actions remain available. Critical controls retain the 48 px floor.

**Cross-Look state:** Looks #3, #4, #5, and #7 render the same task state.

**Validation boundary:** The validator now requires four task renderers, four task stylesheets, the shared state engine, all four registrations, and responsive/accessibility hooks. Exact-checkout execution, Android gesture testing, and actual screen-reader evidence remain pending.

## 2026-08-02 — Tactile Household organizes work without defect language

**Milestone:** Version `0.10.4` implements the Task hierarchy loop in Look #6 — Tactile Household.

**Presentation:** The shared checklist becomes paper-like task cards with drawer-style subtask grouping, physical-looking controls, and Active Cards, Main Tasks, and Filed Done counts.

**Metaphor boundary:** Cards, drawers, clips, and filing language organize work. They must not suggest that the user, household, or task list is broken, defective, or in need of repair.

**Semantic parity:** Look #6 preserves the shared add, edit, hierarchy, completion, release, movement, and visibility behavior without adding maintenance-specific task functionality.

**Accessibility:** The physical appearance does not replace labels or state. Completion uses a checkmark and line-through, and explicit movement controls remain available.

**Cross-Look state:** Looks #3, #4, #5, #6, and #7 render the same task state.

## 2026-08-02 — Warm Editorial provides context without reflection requirements

**Milestone:** Version `0.10.5` implements the Task hierarchy loop in Look #2 — Warm Editorial.

**Presentation:** The shared checklist becomes a calm practical page with serif titles, restrained Active, Main Tasks, and Completed facts, quiet progress notes, and a simple hierarchy rule.

**Editorial boundary:** Warmth and context may improve readability, but Tasks must not become a diary. The user is never asked to explain, reflect on, or narrate completion.

**Semantic parity:** Look #2 keeps the same add, edit, hierarchy, completion, release, movement, and visibility behavior. It adds no notes field, reflection prompt, scoring, priority system, assignments, deletion, deeper nesting, or scheduling.

**Responsive priority:** Optional time disappears before task-title space is reduced. Large Text retains clear editing and 54 px actions.

**Accessibility:** Completion uses a checkmark and line-through; subtasks use indentation plus a visible mustard rule; drag remains optional because Move, Indent, and Unindent actions remain available.

**Cross-Look state:** Looks #2 through #7 render the same task state.

**Validation boundary:** The validator now requires six task renderers, six task stylesheets, the shared state engine, all six registrations, and responsive/accessibility hooks. Exact-checkout execution, Android gesture testing, and actual screen-reader evidence remain pending.

**Next active Look:** Look #8 — Ambient Glass, with transparency retained as an enhancement rather than a dependency.

## Feedback entry template

```text
## YYYY-MM-DD — Look # / review title

Scenario and screen:
Strongest element:
Biggest weakness:
Most confusing element:
Component worth borrowing:
Intentional differences observed:
Score summary:
Recommendation:
Follow-up checklist items:
```