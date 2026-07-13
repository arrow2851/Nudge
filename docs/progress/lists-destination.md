# Reusable Lists Milestone

**Status:** Unified checklist behavior implemented; visual and gesture review pending.

## Approved direction

- [x] Lists has its own List creation flow.
- [x] List items now behave like Task items except they have no Due Date.
- [x] Top-right `+` and bottom `+ Add item` both create a blank inline-editable item.
- [x] Inline editing is used only during creation.
- [x] Tapping an existing item opens a bottom-sheet editor.
- [x] The editor contains Item name, history suggestions, and Main Item.
- [x] The normal row is Checkbox → Item text → optional Main Item `+`.
- [x] There are no permanent right-side item options.
- [x] Checkbox is on the left by default.
- [x] A future preference may place List checkboxes on the right.
- [x] Holding the row reorders it.
- [x] Swiping a root item to the right makes it a subitem of the item immediately above.
- [x] If there is no eligible item above, the row returns to its position without changing hierarchy.
- [x] The item above automatically becomes a Main Item when indentation succeeds.

## Parent and subitem behavior

- [x] Main Items have a separate `+` for adding a subitem.
- [x] Subitems appear indented under their Main Item.
- [x] A thin bar above a Main Item shows subitem completion.
- [x] Completing a Main Item completes every subitem.
- [x] Reopening a Main Item reopens every subitem.
- [x] Completing every subitem automatically completes the Main Item.
- [x] Reopening any subitem automatically reopens the Main Item.
- [x] Turning off Main Item releases its subitems into the root list.
- [x] Long-dragging a subitem among root items releases it to the root level.
- [x] A Main Item containing subitems cannot be indented beneath another item.

## Completed items and history

- [x] Completed items remain stored instead of disappearing.
- [x] Completed root items move below active root items.
- [x] Completed subitems move below active subitems within their parent.
- [x] Lists includes a Hide Completed / Show Completed toggle.
- [x] Hiding completed items hides completed root groups.
- [x] Completed subitems under an unfinished Main Item remain visible at the bottom of that Main Item.
- [x] Completing an item updates remembered history.
- [x] History suggestions appear during inline creation and in the existing-item editor.
- [x] Suggestions filter from remembered history as text changes.
- [x] Exact active duplicates are prevented with a simple message.

## List collection

- [x] Lists destination and reusable-list cards.
- [x] Active counts exclude completed items.
- [x] Remembered-item counts.
- [x] Top and bottom New List controls.
- [x] List name and icon creation/editing.
- [x] Today shortcuts open the selected list and show active counts only.

## Removed concepts

- [x] No shopping/list sessions.
- [x] No quantity, unit, or category fields.
- [x] No duplicate-choice sheet.
- [x] No permanent Add Item input section.
- [x] No permanent per-item chevron or option cell.

## Future Settings requirements

- [ ] Place List checkboxes on the right.
- [ ] Apply checkbox placement immediately to every reusable list.
- [x] Persist Show Completed / Hide Completed.

## Review targets

- [ ] Review right-swipe distance and snap-back animation.
- [ ] Review hold duration before drag begins.
- [ ] Review conflict prevention between tap, swipe, and hold.
- [ ] Review history suggestions in the bottom sheet.
- [ ] Review Main Item terminology.
- [ ] Review parent/subitem indentation.
- [ ] Review thin progress-bar visibility.
- [ ] Review automatic parent completion.
- [ ] Review completed-item visibility toggle placement.
- [ ] Review the overall visual polish later.

## Pending refinements

- [ ] Drag ordering for the List collection itself.
- [ ] Pin, archive, and delete Lists only if later needed.
- [ ] Add stronger drag preview and edge auto-scroll.
- [ ] Add keyboard-accessible reordering and hierarchy controls.
- [ ] Add an explicit accessible way to release one subitem without dragging.
- [ ] Add fuzzy and typo-tolerant history matching.
- [ ] Add automated interaction tests.
- [ ] Reconcile the master `PROJECT-STATUS.md` during the next tracker consolidation pass.

## Prototype paths

- Lists collection: `#/lists`
- Groceries: `#/lists/groceries`
- Household Restock: `#/lists/restock`

## Recommended next batch

The next major milestone remains the Direct Intervention prototype.