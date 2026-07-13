# Reusable Lists Milestone

**Status:** First end-to-end browser-prototype slice implemented; visual review and refinement pending.

## Approved direction

- [x] Lists has its own purpose-built creation and item-entry flow.
- [x] Lists does not use the former global Quick Add action.
- [x] Reusable lists are intentionally simpler than Tasks and Areas.
- [x] Checked items leave the active list immediately.
- [x] Checked items remain in a remembered catalog for future suggestions.
- [x] Suggestions remain compact and do not obstruct typing.
- [x] A shopping/list session is optional rather than required for normal checking.

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
- [x] List name
- [x] List icon selection
- [x] Edit list name and icon
- [x] Direct routes such as `#/lists/groceries`
- [x] Today shortcuts open their specific lists

### Reusable list detail

- [x] Active item list
- [x] Dedicated inline Add Item field
- [x] Enter-key submission
- [x] Compact remembered suggestions
- [x] Suggestions filtered as the user types
- [x] Suggestions ranked by favorite, frequency, and recency fields
- [x] Add a remembered item again
- [x] Check an item off
- [x] Checked item disappears from active items
- [x] Checked item creates or updates its remembered catalog record
- [x] Usage count and last-used time update
- [x] Empty active-list state
- [x] Undo for supported changes

### Item details

- [x] Edit item name
- [x] Quantity
- [x] Unit
- [x] Category
- [x] Delete active item
- [x] Display compact quantity/category metadata

### Duplicate handling

- [x] Normalize names for exact duplicate detection
- [x] Increase quantity
- [x] Keep a separate line
- [x] Cancel by dismissing the sheet

### Shopping/list session

- [x] Start session
- [x] Persist active session in browser state
- [x] Track items checked during the session
- [x] Show checked and remaining counts
- [x] Finish-session summary
- [x] Preserve unchecked items
- [x] Move checked items into remembered history
- [x] Save last-session summary
- [x] Undo session start and finish

### Migration and persistence

- [x] Upgrade the earlier summary-only list cards without clearing local storage
- [x] Seed realistic Groceries and Household Restock examples
- [x] Persist active items, catalog, quantities, categories, and sessions

## Review targets

- [ ] Review Lists collection density.
- [ ] Review whether list cards should be rows or a grid.
- [ ] Review Add Item field height and placement.
- [ ] Review suggestion-chip density.
- [ ] Review whether suggestions should appear when the field is empty.
- [ ] Review checkbox size and spacing.
- [ ] Review whether item details should open from the whole row or only the chevron.
- [ ] Review quantity/unit formatting.
- [ ] Review category usefulness.
- [ ] Review whether normal checking and Session mode feel sufficiently different.
- [ ] Review Finish Session wording and summary.
- [ ] Review mobile keyboard behavior.
- [ ] Review the visual treatment after more of the prototype is available.

## Pending refinements

- [ ] Drag ordering for active list items.
- [ ] Drag ordering for lists.
- [ ] Pin and unpin lists.
- [ ] Archive list.
- [ ] Delete list with confirmation.
- [ ] Full remembered-catalog management screen.
- [ ] Favorite and unfavorite remembered items.
- [ ] Remove a remembered item.
- [ ] Merge duplicate remembered records.
- [ ] Fuzzy and typo-tolerant matching.
- [ ] Custom category management.
- [ ] Optional store field.
- [ ] Optional item notes.
- [ ] Recent-session history.
- [ ] Resume/recover interrupted session messaging.
- [ ] Accessibility review.
- [ ] Automated interaction tests.

## Prototype paths

- Lists collection: `#/lists`
- Groceries: `#/lists/groceries`
- Household Restock: `#/lists/restock`

## Recommended next batch

After this first Lists slice, the next major milestone is the Direct Intervention prototype:

1. Simulate Redirect control
2. Intervention screen
3. Start Task
4. Already Done
5. Different Task
6. Not Now
7. Focus Mode
8. Intervention settings and compatibility preview
