# Reusable Lists Milestone

**Status:** Simplified checklist version implemented; visual review and refinement pending.

## Approved direction

- [x] Lists has its own purpose-built creation and item-entry flow.
- [x] Lists does not use the former global Quick Add action.
- [x] Each active item contains only a checkbox and editable text.
- [x] Tapping item text edits it inline.
- [x] Holding an item allows it to be dragged into a new position.
- [x] There are no per-item controls on the right side.
- [x] Checking an item removes it from the active list immediately.
- [x] Checked items remain remembered for future reuse.
- [x] Remembered suggestions remain small and optional.
- [x] Shopping/list sessions are not part of the product.
- [x] Quantity, unit, category, and item-detail sheets are not part of the default list flow.

## Superseded design

The earlier prototype included quantities, units, categories, duplicate-choice sheets, item-side controls, and an optional shopping session. That direction is no longer approved and has been removed from the active prototype.

## Implemented

### List collection

- [x] Lists destination
- [x] Reusable-list cards
- [x] Live active-item counts
- [x] Remembered-item counts
- [x] Top-right New List action
- [x] Bottom New List action
- [x] Empty collection state
- [x] Create List sheet
- [x] List name and icon selection
- [x] Edit list name and icon
- [x] Direct routes such as `#/lists/groceries`
- [x] Today shortcuts open their specific lists

### Simple list detail

- [x] Dedicated Add Item field
- [x] Enter-key submission
- [x] Checkbox on the left of every active item
- [x] Tap item text to edit inline
- [x] Enter or focus loss saves item text
- [x] Escape cancels editing
- [x] Hold and drag an item to reorder it
- [x] Visible before/after drop indicator
- [x] Checked item disappears from active items
- [x] Checked item creates or updates its remembered record
- [x] Compact remembered suggestions
- [x] Suggestions filter while typing
- [x] Suggestions rank primarily by reuse count and recency
- [x] Add a remembered item again
- [x] Exact active duplicates are prevented with a simple message
- [x] Empty active-list state
- [x] Undo for add, edit, check, and move

### Migration and persistence

- [x] Upgrade earlier list records without clearing local storage
- [x] Remove session state from migrated list records
- [x] Reduce active items to name, order, and timestamps
- [x] Preserve remembered names and reuse history
- [x] Seed realistic Groceries and Household Restock examples

## Review targets

- [ ] Review Lists collection density.
- [ ] Review list-card visual styling.
- [ ] Review Add Item field height and placement.
- [ ] Review whether suggestions should appear when the field is empty.
- [ ] Review checkbox size and spacing.
- [ ] Review item-row height and border treatment.
- [ ] Review inline editing behavior with the mobile keyboard.
- [ ] Review hold duration before dragging begins.
- [ ] Review drag feedback and drop-target visibility.
- [ ] Review whether checked items need a temporary animation before disappearing.
- [ ] Review the overall visual polish after more features exist.

## Pending refinements

- [ ] Drag ordering for the list collection itself.
- [ ] Pin and unpin lists.
- [ ] Archive list.
- [ ] Delete list with confirmation.
- [ ] Decide how an active item is deleted without adding a permanent right-side control.
- [ ] Full remembered-catalog management, only if later proven necessary.
- [ ] Remove a remembered item.
- [ ] Merge duplicate remembered records.
- [ ] Fuzzy and typo-tolerant suggestion matching.
- [ ] Drag auto-scroll for long lists.
- [ ] Keyboard-accessible move-up and move-down alternatives.
- [ ] Accessibility review.
- [ ] Automated interaction tests.

## Prototype paths

- Lists collection: `#/lists`
- Groceries: `#/lists/groceries`
- Household Restock: `#/lists/restock`

## Recommended next batch

After reviewing this simplified list flow, the next major milestone is the Direct Intervention prototype:

1. Simulate Redirect control
2. Intervention screen
3. Start Task
4. Already Done
5. Different Task
6. Not Now
7. Focus Mode
8. Intervention settings and compatibility preview
