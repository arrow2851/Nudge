import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  pendingFocusListId: '',
  inlineEditingId: '',
  inlineValue: '',
  selectingSuggestion: false,
  toastTimer: null,
  undoTimer: null,
  gesture: null,
  suppressClickUntil: 0
};

const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));
const clone = value => JSON.parse(JSON.stringify(value));
const normalizeName = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const nowIso = () => new Date().toISOString();

const seedData = {
  groceries: {
    items: ['Milk', 'Eggs', 'Bananas', 'Chicken breast', 'Spinach', 'Yogurt'],
    catalog: [['Bread', 8], ['Rice', 5], ['Coffee', 4], ['Tomatoes', 7], ['Frozen salmon', 3]]
  },
  restock: {
    items: ['Paper towels', 'Dish soap'],
    catalog: [['Trash bags', 6], ['Laundry detergent', 4], ['Toilet paper', 7], ['Sponges', 3]]
  }
};

function makeItem(id, name, order = 0, parentItemId = '') {
  return {
    id,
    name,
    normalizedName: normalizeName(name),
    order,
    parentItemId,
    isMainItem: false,
    completed: false,
    completedAt: '',
    createdAt: nowIso()
  };
}

function makeCatalogItem(id, name, timesUsed = 1) {
  return {
    id,
    name,
    normalizedName: normalizeName(name),
    timesUsed,
    lastUsedAt: new Date(Date.now() - timesUsed * 86400000).toISOString()
  };
}

function normalizeList(list, index) {
  const seed = seedData[list.id] || { items: [], catalog: [] };
  const sourceItems = Array.isArray(list.items)
    ? list.items
    : seed.items.map((name, itemIndex) => makeItem(`${list.id}-item-${itemIndex}`, name, itemIndex * 10));
  const sourceCatalog = Array.isArray(list.catalog)
    ? list.catalog
    : seed.catalog.map(([name, timesUsed], catalogIndex) => makeCatalogItem(`${list.id}-catalog-${catalogIndex}`, name, timesUsed));

  const ids = new Set(sourceItems.map((item, itemIndex) => item.id || `${list.id}-item-${itemIndex}`));
  const items = sourceItems.map((item, itemIndex) => ({
    id: item.id || `${list.id}-item-${itemIndex}`,
    name: item.name || item.title || '',
    normalizedName: normalizeName(item.name || item.title || ''),
    order: Number.isFinite(item.order) ? item.order : itemIndex * 10,
    parentItemId: item.parentItemId && ids.has(item.parentItemId) ? item.parentItemId : '',
    isMainItem: Boolean(item.isMainItem),
    completed: Boolean(item.completed),
    completedAt: item.completedAt || '',
    createdAt: item.createdAt || nowIso()
  }));
  const mainIds = new Set(items.filter(item => item.isMainItem).map(item => item.id));
  const repairedItems = items.map(item => item.parentItemId && !mainIds.has(item.parentItemId)
    ? { ...item, parentItemId: '' }
    : item);

  const catalog = sourceCatalog.map((item, catalogIndex) => ({
    id: item.id || `${list.id}-catalog-${catalogIndex}`,
    name: item.name || 'Item',
    normalizedName: normalizeName(item.name || 'Item'),
    timesUsed: Number(item.timesUsed || 1),
    lastUsedAt: item.lastUsedAt || nowIso()
  }));

  return {
    id: list.id || `list-${Date.now()}-${index}`,
    name: list.name || 'Untitled list',
    icon: list.icon || '☷',
    archived: Boolean(list.archived),
    pinned: list.pinned !== false,
    order: Number.isFinite(list.order) ? list.order : index * 10,
    createdAt: list.createdAt || nowIso(),
    lastUsedAt: list.lastUsedAt || '',
    items: repairedItems,
    catalog
  };
}

let ensuringModel = false;
function ensureListsModel() {
  if (ensuringModel) return;
  const state = store.getState();
  const version = Number(state.preferences?.listsModelVersion || 0);
  const normalized = (state.lists || []).map(normalizeList);
  const preferences = {
    ...state.preferences,
    listsModelVersion: 4,
    listCheckboxOnRight: state.preferences?.listCheckboxOnRight === true,
    showCompletedListItems: state.preferences?.showCompletedListItems !== false
  };
  const changed = version < 4
    || JSON.stringify(normalized) !== JSON.stringify(state.lists)
    || JSON.stringify(preferences) !== JSON.stringify(state.preferences);
  if (!changed) return;
  ensuringModel = true;
  store.setState({ lists: normalized, preferences });
  ensuringModel = false;
}

function activeLists(state = store.getState()) {
  return (state.lists || [])
    .filter(list => !list.archived)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || Number(a.order || 0) - Number(b.order || 0));
}

function currentList() {
  const [, listId] = router.getRoute().split('/');
  return store.getState().lists.find(list => list.id === listId && !list.archived);
}

function orderedSiblings(list, parentItemId = '') {
  return list.items
    .filter(item => (item.parentItemId || '') === parentItemId)
    .sort((a, b) => Number(a.completed) - Number(b.completed)
      || Number(a.order || 0) - Number(b.order || 0)
      || new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
}

function activeCount(list) {
  return list.items.filter(item => !item.completed).length;
}

function listCard(list) {
  const active = activeCount(list);
  const remembered = list.catalog.length;
  return `<button class="reusable-list-card" data-route="lists/${list.id}">
    <span class="reusable-list-icon">${esc(list.icon)}</span>
    <span class="reusable-list-copy"><strong>${esc(list.name)}</strong><small>${active} active${remembered ? ` · ${remembered} remembered` : ''}</small></span>
    <span class="reusable-list-count">${active}</span><span class="reusable-list-arrow">›</span>
  </button>`;
}

function renderCollection() {
  const parts = router.getRoute().split('/');
  if (parts[0] !== 'lists' || parts[1]) return;
  const lists = activeLists();
  screen.innerHTML = `<header class="page-header lists-header"><div><p class="eyebrow">Reusable</p><h1>Lists</h1><p>Simple lists that remember what you use.</p></div><button class="icon-button" data-action="open-create-list" aria-label="Create list">+</button></header>
    <div class="reusable-list-collection">${lists.map(listCard).join('') || `<div class="lists-empty"><span>☷</span><h2>No lists yet</h2><p>Create a reusable list for groceries, restocking, packing, or anything else.</p></div>`}</div>
    <button class="lists-bottom-add" data-action="open-create-list"><span>+</span> New list</button>`;
}

function suggestionMatches(list, query, editingItemId) {
  const activeNames = new Set(list.items.filter(item => item.id !== editingItemId).map(item => item.normalizedName));
  const normalized = normalizeName(query);
  return [...list.catalog]
    .filter(item => !activeNames.has(item.normalizedName))
    .filter(item => !normalized || item.normalizedName.includes(normalized))
    .sort((a, b) => Number(b.timesUsed || 0) - Number(a.timesUsed || 0)
      || new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0))
    .slice(0, 5);
}

function historySuggestionsMarkup(list, itemId, query, mode = 'inline') {
  const suggestions = suggestionMatches(list, query, itemId);
  if (!suggestions.length) return '';
  const action = mode === 'sheet' ? 'apply-sheet-history-suggestion' : 'apply-inline-history-suggestion';
  return `<div class="history-suggestions"><small>${query.trim() ? 'From history' : 'Used before'}</small><div>${suggestions.map(item => `<button data-action="${action}" data-list-id="${list.id}" data-item-id="${itemId}" data-catalog-id="${item.id}">${esc(item.name)}</button>`).join('')}</div></div>`;
}

function progressFor(item, list) {
  const children = list.items.filter(child => child.parentItemId === item.id);
  return {
    children,
    percent: children.length ? Math.round(children.filter(child => child.completed).length / children.length * 100) : 0
  };
}

function listItemRow(list, item, isSubitem = false) {
  const inlineEditing = ui.inlineEditingId === item.id;
  const checkboxRight = store.getState().preferences?.listCheckboxOnRight === true;
  const { children, percent } = progressFor(item, list);
  return `<div class="simple-list-item-shell ${isSubitem ? 'list-subitem-shell' : ''}" data-list-shell data-list-id="${list.id}" data-item-id="${item.id}">
    <div class="simple-list-item ${item.completed ? 'completed' : ''} ${checkboxRight ? 'checkbox-right' : ''}" data-list-row data-list-id="${list.id}" data-item-id="${item.id}">
      ${item.isMainItem && children.length ? `<span class="list-subitem-progress" style="width:${percent}%"></span>` : ''}
      <button class="simple-list-check ${item.completed ? 'checked' : ''}" data-action="toggle-list-item-complete" data-list-id="${list.id}" data-item-id="${item.id}" aria-label="${item.completed ? 'Reopen' : 'Check off'} ${esc(item.name || 'item')}">${item.completed ? '✓' : ''}</button>
      ${inlineEditing
        ? `<input class="simple-list-item-input" data-new-list-item-input data-list-id="${list.id}" data-item-id="${item.id}" value="${esc(ui.inlineValue)}" placeholder="New item" aria-label="New item name">`
        : `<button class="simple-list-item-text" data-action="open-list-item-sheet" data-list-id="${list.id}" data-item-id="${item.id}">${esc(item.name || 'New item')}</button>`}
      ${item.isMainItem ? `<button class="list-subitem-add" data-action="add-list-subitem" data-list-id="${list.id}" data-item-id="${item.id}" aria-label="Add subitem to ${esc(item.name || 'main item')}">+</button>` : ''}
    </div>
    ${inlineEditing ? `<div class="history-suggestions-slot">${historySuggestionsMarkup(list, item.id, ui.inlineValue, 'inline')}</div>` : ''}
  </div>`;
}

function itemTree(list, item) {
  const children = orderedSiblings(list, item.id);
  return `<div class="list-item-tree" data-list-tree data-item-id="${item.id}">
    ${listItemRow(list, item)}
    ${children.length ? `<div class="list-subitems">${children.map(child => listItemRow(list, child, true)).join('')}</div>` : ''}
  </div>`;
}

function renderListDetail() {
  const parts = router.getRoute().split('/');
  if (parts[0] !== 'lists' || !parts[1]) return;
  const list = currentList();
  if (!list) return router.go('lists');
  const showCompleted = store.getState().preferences?.showCompletedListItems !== false;
  const roots = orderedSiblings(list).filter(item => showCompleted || !item.completed);
  const active = activeCount(list);
  screen.innerHTML = `<div class="list-detail-screen">
    <header class="list-detail-header"><button class="icon-button" data-route="lists" aria-label="Back">←</button><button class="list-title-button" data-action="open-list-settings" data-list-id="${list.id}" aria-label="Edit ${esc(list.name)}"><p class="eyebrow">${esc(list.icon)} Reusable list</p><h1>${esc(list.name)}</h1><span>${active} active</span></button><button class="icon-button list-top-add" data-action="add-empty-list-item" data-list-id="${list.id}" aria-label="Add item">+</button></header>
    <div class="list-simple-summary"><span>${active} remaining</span><button class="completed-visibility-toggle" data-action="toggle-completed-list-items">${showCompleted ? 'Hide completed' : 'Show completed'}</button></div>
    <div class="simple-list-items">${roots.map(item => itemTree(list, item)).join('') || `<div class="list-detail-empty"><span>✓</span><h2>List is clear</h2><p>Add something new or reuse a remembered item while typing.</p></div>`}</div>
    <button class="lists-bottom-add list-item-bottom-add" data-action="add-empty-list-item" data-list-id="${list.id}"><span>+</span> Add item</button>
  </div>`;
  focusPendingInput(list.id);
}

function renderLists() {
  if (router.getRoute().split('/')[0] !== 'lists') return;
  if (router.getRoute().split('/')[1]) renderListDetail();
  else renderCollection();
}

function showToast(message, allowUndo = false) {
  clearTimeout(ui.toastTimer);
  clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${allowUndo ? 'action-toast' : ''}"><span>${esc(message)}</span>${allowUndo ? '<button data-action="lists-undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, allowUndo ? 5200 : 2400);
  if (allowUndo) ui.undoTimer = setTimeout(() => store.clearUndo(), 5500);
}

function closeSheet() { overlayRoot.innerHTML = ''; }
function slug(value) { return normalizeName(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `list-${Date.now()}`; }

function createListSheet() {
  const icons = ['🛒', '🧺', '✈️', '📦', '🎒', '📝', '🎁', '☷'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Lists</p><h2>New reusable list</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><div class="field"><label for="new-list-name">Name</label><input class="input" id="new-list-name" placeholder="Costco"></div><input type="hidden" id="new-list-icon" value="🛒"><div class="list-icon-picker">${icons.map((icon, index) => `<button class="${index === 0 ? 'selected' : ''}" data-action="select-list-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><button class="button primary block" data-action="save-new-list">Create list</button></section></div>`;
}

function listSettingsSheet(listId) {
  const list = store.getState().lists.find(item => item.id === listId);
  if (!list) return '';
  const icons = ['🛒', '🧺', '✈️', '📦', '🎒', '📝', '🎁', '☷'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">List settings</p><h2>${esc(list.name)}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><div class="field"><label for="edit-list-name">Name</label><input class="input" id="edit-list-name" value="${esc(list.name)}"></div><input type="hidden" id="edit-list-icon" value="${esc(list.icon)}"><div class="list-icon-picker">${icons.map(icon => `<button class="${icon === list.icon ? 'selected' : ''}" data-action="select-edit-list-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><button class="button primary block" data-action="save-list-settings" data-list-id="${list.id}">Save changes</button></section></div>`;
}

function listItemSheet(listId, itemId) {
  const list = store.getState().lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return '';
  const isSubitem = Boolean(item.parentItemId);
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet checklist-settings-sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">List item</p><h2>Edit item</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="list-item-sheet-name">Item name</label><input class="input" id="list-item-sheet-name" data-list-id="${list.id}" data-item-id="${item.id}" value="${esc(item.name)}"></div>
    <div id="list-item-sheet-suggestions">${historySuggestionsMarkup(list, item.id, item.name, 'sheet')}</div>
    <label class="toggle-row ${isSubitem ? 'disabled-setting' : ''}"><span><strong>Main item</strong><small>${isSubitem ? 'Move this item out before making it a main item.' : item.isMainItem ? 'This item can contain subitems.' : 'Allow subitems under this item.'}</small></span><input type="checkbox" data-action="toggle-main-list-item" data-list-id="${list.id}" data-item-id="${item.id}" ${item.isMainItem ? 'checked' : ''} ${isSubitem ? 'disabled' : ''}></label>
  </section></div>`;
}

function saveNewList() {
  const name = document.querySelector('#new-list-name')?.value.trim();
  if (!name) return void document.querySelector('#new-list-name')?.focus();
  const current = store.getState();
  const base = slug(name);
  let id = base;
  let suffix = 2;
  while (current.lists.some(list => list.id === id)) id = `${base}-${suffix++}`;
  const list = normalizeList({ id, name, icon: document.querySelector('#new-list-icon')?.value || '☷', items: [], catalog: [], order: current.lists.length * 10, pinned: true }, current.lists.length);
  store.setState({
    lists: [...current.lists, list],
    activity: [{ id: `activity-${Date.now()}`, title: name, detail: 'List created', time: 'Just now', icon: '+' }, ...current.activity].slice(0, 8),
    lastUndo: { label: `${name} created`, snapshot: clone(current) }
  });
  closeSheet();
  router.go(`lists/${id}`);
  showToast(`${name} created.`, true);
}

function nextItemOrder(list, parentItemId = '') {
  const siblings = list.items.filter(item => (item.parentItemId || '') === parentItemId);
  return siblings.length ? Math.max(...siblings.map(item => Number(item.order || 0))) + 10 : 0;
}

function addBlankListItem(listId, parentItemId = '') {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const parent = list?.items.find(item => item.id === parentItemId);
  if (!list) return;
  const actualParentId = parent?.isMainItem ? parentItemId : '';
  const id = `list-item-${Date.now()}`;
  const item = makeItem(id, '', nextItemOrder(list, actualParentId), actualParentId);
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items: [...entry.items, item] } : entry),
    lastUndo: { label: 'List item added', snapshot: clone(current) }
  });
  ui.inlineEditingId = id;
  ui.inlineValue = '';
  ui.pendingFocusListId = listId;
  requestAnimationFrame(renderListDetail);
}

function removeBlankItem(listId, itemId) {
  store.setState(state => ({ lists: state.lists.map(list => list.id === listId ? { ...list, items: list.items.filter(item => item.id !== itemId) } : list) }));
}

function commitItemName(listId, itemId, rawName, closeAfter = false) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return;
  const name = String(rawName || '').trim();
  if (!name) {
    if (!item.name) removeBlankItem(listId, itemId);
    else showToast('Item name cannot be empty.');
    return;
  }
  const normalizedName = normalizeName(name);
  if (list.items.some(entry => entry.id !== itemId && entry.normalizedName === normalizedName)) return showToast('That item is already on the list.');
  const wasBlank = !item.name;
  store.setState(state => ({
    lists: state.lists.map(entry => entry.id === listId ? { ...entry, items: entry.items.map(active => active.id === itemId ? { ...active, name, normalizedName } : active) } : entry),
    activity: wasBlank ? [{ id: `activity-${Date.now()}`, title: name, detail: `Added to ${list.name}`, time: 'Just now', icon: '+' }, ...state.activity].slice(0, 8) : state.activity,
    lastUndo: { label: `${name} updated`, snapshot: clone(current) }
  }));
  ui.inlineEditingId = '';
  ui.inlineValue = '';
  if (closeAfter) closeSheet();
  showToast(wasBlank ? `${name} added.` : 'Item updated.', true);
}

function focusPendingInput(listId) {
  if (ui.pendingFocusListId !== listId || !ui.inlineEditingId) return;
  requestAnimationFrame(() => {
    const input = document.querySelector(`[data-new-list-item-input][data-item-id="${ui.inlineEditingId}"]`);
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    ui.pendingFocusListId = '';
  });
}

function rememberCompleted(catalog, items) {
  let remembered = [...catalog];
  items.filter(item => item.name).forEach(item => {
    const existing = remembered.find(entry => entry.normalizedName === item.normalizedName);
    remembered = existing
      ? remembered.map(entry => entry.id === existing.id ? { ...entry, name: item.name, timesUsed: Number(entry.timesUsed || 0) + 1, lastUsedAt: nowIso() } : entry)
      : [...remembered, makeCatalogItem(`catalog-${Date.now()}-${item.id}`, item.name, 1)];
  });
  return remembered;
}

function descendantsOf(itemId, items) {
  const children = items.filter(item => item.parentItemId === itemId);
  return children.flatMap(child => [child.id, ...descendantsOf(child.id, items)]);
}

function completionItem(item, completed) {
  return { ...item, completed, completedAt: completed ? nowIso() : '' };
}

function recalculateListAncestors(items, parentId) {
  let updated = items;
  let currentParentId = parentId;
  while (currentParentId) {
    const parent = updated.find(item => item.id === currentParentId);
    if (!parent) break;
    const children = updated.filter(item => item.parentItemId === currentParentId);
    const completed = children.length > 0 && children.every(child => child.completed);
    updated = updated.map(item => item.id === currentParentId ? completionItem(item, completed) : item);
    currentParentId = parent.parentItemId || '';
  }
  return updated;
}

function toggleListItemComplete(listId, itemId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return;
  const completed = !item.completed;
  const cascadeIds = new Set([itemId, ...descendantsOf(itemId, list.items)]);
  const newlyCompleted = completed ? list.items.filter(entry => cascadeIds.has(entry.id) && !entry.completed) : [];
  let items = list.items.map(entry => cascadeIds.has(entry.id) ? completionItem(entry, completed) : entry);
  items = recalculateListAncestors(items, item.parentItemId || '');
  const catalog = completed ? rememberCompleted(list.catalog, newlyCompleted) : list.catalog;
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items, catalog, lastUsedAt: completed ? nowIso() : entry.lastUsedAt } : entry),
    activity: [{ id: `activity-${Date.now()}`, title: item.name || 'Untitled item', detail: completed ? `Completed in ${list.name}` : `Reopened in ${list.name}`, time: 'Just now', icon: completed ? '✓' : '↶' }, ...current.activity].slice(0, 8),
    lastUndo: { label: completed ? 'List item completed' : 'List item reopened', snapshot: clone(current) }
  });
  showToast(completed ? 'Item completed.' : 'Item reopened.', true);
}

function saveListSettings(listId) {
  const name = document.querySelector('#edit-list-name')?.value.trim();
  if (!name) return showToast('Enter a list name.');
  const current = store.getState();
  store.setState({
    lists: current.lists.map(list => list.id === listId ? { ...list, name, icon: document.querySelector('#edit-list-icon')?.value || list.icon } : list),
    lastUndo: { label: `${name} updated`, snapshot: clone(current) }
  });
  closeSheet();
  showToast('List updated.', true);
}

function toggleMainListItem(listId, itemId, enabled) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item || item.parentItemId) return;
  const children = list.items.filter(child => child.parentItemId === itemId);
  const rootOrder = Number(item.order || 0);
  const items = list.items.map(entry => {
    if (entry.id === itemId) return { ...entry, isMainItem: enabled };
    if (!enabled && entry.parentItemId === itemId) {
      const offset = children.findIndex(child => child.id === entry.id) + 1;
      return { ...entry, parentItemId: '', order: rootOrder + offset };
    }
    return entry;
  });
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items } : entry),
    lastUndo: { label: enabled ? 'Main item enabled' : 'Subitems released', snapshot: clone(current) }
  });
  closeSheet();
  showToast(enabled ? 'Main item enabled.' : children.length ? 'Subitems moved into the main list.' : 'Main item disabled.', true);
}

function reindex(items, parentItemId) {
  const siblings = items.filter(item => (item.parentItemId || '') === parentItemId).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  const order = new Map(siblings.map((item, index) => [item.id, index * 10]));
  return items.map(item => order.has(item.id) ? { ...item, order: order.get(item.id) } : item);
}

function moveItem(listId, draggedId, targetId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const dragged = list?.items.find(item => item.id === draggedId);
  const target = list?.items.find(item => item.id === targetId);
  if (!list || !dragged || !target || draggedId === targetId) return;
  const oldParent = dragged.parentItemId || '';
  const newParent = target.parentItemId || '';
  let items = list.items.map(item => item.id === draggedId ? { ...item, parentItemId: newParent, isMainItem: newParent ? false : item.isMainItem } : item);
  const siblings = items.filter(item => item.id !== draggedId && (item.parentItemId || '') === newParent).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  const targetIndex = siblings.findIndex(item => item.id === targetId);
  siblings.splice(Math.max(0, targetIndex), 0, items.find(item => item.id === draggedId));
  const orders = new Map(siblings.map((item, index) => [item.id, index * 10]));
  items = items.map(item => orders.has(item.id) ? { ...item, order: orders.get(item.id) } : item);
  items = reindex(items, oldParent);
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items } : entry),
    lastUndo: { label: 'List item moved', snapshot: clone(current) }
  });
  showToast('Item moved.', true);
}

function indentListItem(listId, itemId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item || item.parentItemId) return;
  if (list.items.some(child => child.parentItemId === itemId)) return showToast('Move its subitems out before indenting this item.');
  const siblings = orderedSiblings(list, '');
  const index = siblings.findIndex(entry => entry.id === itemId);
  if (index <= 0) return;
  const parent = siblings[index - 1];
  let items = list.items.map(entry => {
    if (entry.id === parent.id) return { ...entry, isMainItem: true };
    if (entry.id === itemId) return { ...entry, parentItemId: parent.id, isMainItem: false, order: nextItemOrder(list, parent.id) };
    return entry;
  });
  items = recalculateListAncestors(items, parent.id);
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items } : entry),
    lastUndo: { label: 'List item indented', snapshot: clone(current) }
  });
  showToast(`Moved under ${parent.name || 'the item above'}.`, true);
}

function refreshInlineSuggestions(input) {
  ui.inlineValue = input.value;
  const list = store.getState().lists.find(entry => entry.id === input.dataset.listId);
  const slot = input.closest('[data-list-shell]')?.querySelector('.history-suggestions-slot');
  if (list && slot) slot.innerHTML = historySuggestionsMarkup(list, input.dataset.itemId, input.value, 'inline');
}

function refreshSheetSuggestions(input) {
  const list = store.getState().lists.find(entry => entry.id === input.dataset.listId);
  const slot = document.querySelector('#list-item-sheet-suggestions');
  if (list && slot) slot.innerHTML = historySuggestionsMarkup(list, input.dataset.itemId, input.value, 'sheet');
}

function applySuggestion(listId, itemId, catalogId, mode) {
  const list = store.getState().lists.find(entry => entry.id === listId);
  const suggestion = list?.catalog.find(item => item.id === catalogId);
  ui.selectingSuggestion = false;
  if (!suggestion) return;
  if (mode === 'sheet') commitItemName(listId, itemId, suggestion.name, true);
  else commitItemName(listId, itemId, suggestion.name);
}

function clearGestureClasses() {
  screen.querySelectorAll('.list-dragging-item, .list-drop-before, .list-swiping-right').forEach(element => element.classList.remove('list-dragging-item', 'list-drop-before', 'list-swiping-right'));
}

function beginDrag() {
  if (!ui.gesture || ui.gesture.active || ui.gesture.swiping) return;
  ui.gesture.active = true;
  ui.gesture.row.classList.add('list-dragging-item');
  try { ui.gesture.row.setPointerCapture?.(ui.gesture.pointerId); } catch (_) {}
  document.body.classList.add('list-item-dragging');
}

function updateDrag(event) {
  if (!ui.gesture?.active || event.pointerId !== ui.gesture.pointerId) return;
  event.preventDefault();
  screen.querySelectorAll('.list-drop-before').forEach(element => element.classList.remove('list-drop-before'));
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const row = element?.closest('[data-list-row]');
  if (!row || row.dataset.itemId === ui.gesture.itemId || row.dataset.listId !== ui.gesture.listId) return void (ui.gesture.targetId = '');
  row.classList.add('list-drop-before');
  ui.gesture.targetId = row.dataset.itemId;
}

function endGesture(event) {
  if (!ui.gesture || event.pointerId !== ui.gesture.pointerId) return;
  clearTimeout(ui.gesture.timer);
  const gesture = ui.gesture;
  if (gesture.active) {
    try { gesture.row.releasePointerCapture?.(event.pointerId); } catch (_) {}
    if (gesture.targetId) moveItem(gesture.listId, gesture.itemId, gesture.targetId);
    document.body.classList.remove('list-item-dragging');
    ui.suppressClickUntil = Date.now() + 300;
  } else if (gesture.swiping) {
    gesture.row.style.transform = '';
    if (gesture.dx > 56) indentListItem(gesture.listId, gesture.itemId);
    ui.suppressClickUntil = Date.now() + 300;
  }
  clearGestureClasses();
  ui.gesture = null;
}

function cancelPendingGesture() {
  if (!ui.gesture || ui.gesture.active || ui.gesture.swiping) return;
  clearTimeout(ui.gesture.timer);
  ui.gesture = null;
}

document.addEventListener('pointerdown', event => {
  const suggestion = event.target.closest('[data-action="apply-inline-history-suggestion"], [data-action="apply-sheet-history-suggestion"]');
  if (suggestion) { ui.selectingSuggestion = true; return; }
  if (router.getRoute().split('/')[0] !== 'lists') return;
  const row = event.target.closest('[data-list-row]');
  if (!row || event.target.closest('.simple-list-check') || event.target.closest('.list-subitem-add') || event.target.matches('[data-new-list-item-input]')) return;
  ui.gesture = {
    active: false, swiping: false, dx: 0, listId: row.dataset.listId, itemId: row.dataset.itemId,
    pointerId: event.pointerId, row, startX: event.clientX, startY: event.clientY, targetId: '', timer: setTimeout(beginDrag, 170)
  };
});

document.addEventListener('pointermove', event => {
  if (!ui.gesture) return;
  const dx = event.clientX - ui.gesture.startX;
  const dy = event.clientY - ui.gesture.startY;
  if (!ui.gesture.active && !ui.gesture.swiping && dx > 14 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    clearTimeout(ui.gesture.timer);
    ui.gesture.swiping = true;
    ui.gesture.row.classList.add('list-swiping-right');
  }
  if (ui.gesture.swiping) {
    event.preventDefault();
    ui.gesture.dx = Math.max(0, dx);
    ui.gesture.row.style.transform = `translateX(${Math.min(ui.gesture.dx, 88)}px)`;
    return;
  }
  if (!ui.gesture.active) {
    if (Math.hypot(dx, dy) > 8) cancelPendingGesture();
    return;
  }
  updateDrag(event);
}, { passive: false });

document.addEventListener('pointerup', endGesture);
document.addEventListener('pointercancel', endGesture);

document.addEventListener('input', event => {
  if (event.target.matches('[data-new-list-item-input]')) refreshInlineSuggestions(event.target);
  if (event.target.id === 'list-item-sheet-name') refreshSheetSuggestions(event.target);
});

document.addEventListener('focusout', event => {
  if (ui.selectingSuggestion) return;
  if (event.target.matches('[data-new-list-item-input]')) commitItemName(event.target.dataset.listId, event.target.dataset.itemId, event.target.value);
  if (event.target.id === 'list-item-sheet-name') commitItemName(event.target.dataset.listId, event.target.dataset.itemId, event.target.value);
});

document.addEventListener('keydown', event => {
  if (event.target.matches('[data-new-list-item-input]')) {
    if (event.key === 'Enter') { event.preventDefault(); event.target.blur(); }
    if (event.key === 'Escape') { ui.inlineEditingId = ''; ui.inlineValue = ''; removeBlankItem(event.target.dataset.listId, event.target.dataset.itemId); }
  }
  if (event.target.id === 'list-item-sheet-name' && event.key === 'Enter') { event.preventDefault(); event.target.blur(); }
});

document.addEventListener('click', event => {
  if (Date.now() < ui.suppressClickUntil) { event.preventDefault(); return; }
  const target = event.target.closest('[data-action]');
  if (!target || router.getRoute().split('/')[0] !== 'lists') return;
  const action = target.dataset.action;
  if (action === 'open-create-list') { overlayRoot.innerHTML = createListSheet(); requestAnimationFrame(() => document.querySelector('#new-list-name')?.focus()); }
  if (action === 'select-list-icon') {
    document.querySelector('#new-list-icon').value = target.dataset.icon;
    document.querySelectorAll('.list-icon-picker button').forEach(button => button.classList.toggle('selected', button === target));
  }
  if (action === 'save-new-list') saveNewList();
  if (action === 'open-list-settings') overlayRoot.innerHTML = listSettingsSheet(target.dataset.listId);
  if (action === 'select-edit-list-icon') {
    document.querySelector('#edit-list-icon').value = target.dataset.icon;
    document.querySelectorAll('.list-icon-picker button').forEach(button => button.classList.toggle('selected', button === target));
  }
  if (action === 'save-list-settings') saveListSettings(target.dataset.listId);
  if (action === 'add-empty-list-item') addBlankListItem(target.dataset.listId);
  if (action === 'add-list-subitem') addBlankListItem(target.dataset.listId, target.dataset.itemId);
  if (action === 'toggle-list-item-complete') toggleListItemComplete(target.dataset.listId, target.dataset.itemId);
  if (action === 'open-list-item-sheet') overlayRoot.innerHTML = listItemSheet(target.dataset.listId, target.dataset.itemId);
  if (action === 'toggle-main-list-item') toggleMainListItem(target.dataset.listId, target.dataset.itemId, target.checked);
  if (action === 'apply-inline-history-suggestion') applySuggestion(target.dataset.listId, target.dataset.itemId, target.dataset.catalogId, 'inline');
  if (action === 'apply-sheet-history-suggestion') applySuggestion(target.dataset.listId, target.dataset.itemId, target.dataset.catalogId, 'sheet');
  if (action === 'toggle-completed-list-items') store.updatePreferences({ showCompletedListItems: store.getState().preferences?.showCompletedListItems === false });
  if (action === 'lists-undo' && store.undoLast()) showToast('Last change undone.');
});

window.addEventListener('hashchange', () => { ui.inlineEditingId = ''; ui.inlineValue = ''; requestAnimationFrame(renderLists); });
store.subscribe(() => { ensureListsModel(); requestAnimationFrame(renderLists); });
ensureListsModel();
requestAnimationFrame(renderLists);