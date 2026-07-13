import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  suggestionQuery: '',
  pendingFocusListId: '',
  editingItemId: '',
  toastTimer: null,
  undoTimer: null,
  drag: null,
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

function makeItem(id, name, order = 0) {
  return {
    id,
    name,
    normalizedName: normalizeName(name),
    order,
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

  const items = sourceItems.map((item, itemIndex) => ({
    id: item.id || `${list.id}-item-${itemIndex}`,
    name: item.name || item.title || 'Item',
    normalizedName: normalizeName(item.name || item.title || 'Item'),
    order: Number.isFinite(item.order) ? item.order : itemIndex * 10,
    createdAt: item.createdAt || nowIso()
  }));

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
    items,
    catalog
  };
}

let ensuringModel = false;
function ensureListsModel() {
  if (ensuringModel) return;
  const state = store.getState();
  const version = Number(state.preferences?.listsModelVersion || 0);
  const normalized = (state.lists || []).map(normalizeList);
  const changed = version < 2 || JSON.stringify(normalized) !== JSON.stringify(state.lists);
  if (!changed) return;
  ensuringModel = true;
  store.setState({
    lists: normalized,
    preferences: { ...state.preferences, listsModelVersion: 2 }
  });
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

function orderedItems(list) {
  return [...list.items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function listCard(list) {
  const active = list.items.length;
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

function suggestionMatches(list, query) {
  const activeNames = new Set(list.items.map(item => item.normalizedName));
  const normalized = normalizeName(query);
  return [...list.catalog]
    .filter(item => !activeNames.has(item.normalizedName))
    .filter(item => !normalized || item.normalizedName.includes(normalized))
    .sort((a, b) => Number(b.timesUsed || 0) - Number(a.timesUsed || 0)
      || new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0))
    .slice(0, 5);
}

function suggestionMarkup(list) {
  const suggestions = suggestionMatches(list, ui.suggestionQuery);
  if (!suggestions.length) return '';
  return `<div class="remembered-suggestions"><small>${ui.suggestionQuery ? 'Suggestions' : 'Add again'}</small><div>${suggestions.map(item => `<button data-action="add-remembered-item" data-list-id="${list.id}" data-catalog-id="${item.id}"><span>+</span>${esc(item.name)}</button>`).join('')}</div></div>`;
}

function listItemRow(list, item) {
  const editing = ui.editingItemId === item.id;
  return `<div class="simple-list-item" data-list-row data-list-id="${list.id}" data-item-id="${item.id}">
    <button class="simple-list-check" data-action="check-list-item" data-list-id="${list.id}" data-item-id="${item.id}" aria-label="Check off ${esc(item.name)}"></button>
    ${editing
      ? `<input class="simple-list-item-input" data-list-item-input data-list-id="${list.id}" data-item-id="${item.id}" value="${esc(item.name)}" aria-label="Edit ${esc(item.name)}">`
      : `<button class="simple-list-item-text" data-action="edit-list-item" data-list-id="${list.id}" data-item-id="${item.id}">${esc(item.name)}</button>`}
  </div>`;
}

function renderListDetail() {
  const parts = router.getRoute().split('/');
  if (parts[0] !== 'lists' || !parts[1]) return;
  const list = currentList();
  if (!list) {
    router.go('lists');
    return;
  }
  const items = orderedItems(list);
  screen.innerHTML = `<div class="list-detail-screen">
    <header class="list-detail-header"><button class="icon-button" data-route="lists" aria-label="Back">←</button><div><p class="eyebrow">${esc(list.icon)} Reusable list</p><h1>${esc(list.name)}</h1><p>${items.length} active</p></div><button class="icon-button" data-action="open-list-settings" data-list-id="${list.id}" aria-label="List settings">•••</button></header>
    <div class="list-add-box"><div class="list-add-row"><input id="list-item-input" value="${esc(ui.suggestionQuery)}" placeholder="Add an item" autocomplete="off" aria-label="Add item to ${esc(list.name)}"><button data-action="add-list-item" data-list-id="${list.id}" aria-label="Add item">+</button></div>${suggestionMarkup(list)}</div>
    <div class="list-simple-summary"><span>${items.length} ${items.length === 1 ? 'item' : 'items'}</span><small>Hold an item to move it</small></div>
    <div class="simple-list-items">${items.map(item => listItemRow(list, item)).join('') || `<div class="list-detail-empty"><span>✓</span><h2>List is clear</h2><p>Add something new or reuse a remembered item above.</p></div>`}</div>
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

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function slug(value) {
  return normalizeName(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `list-${Date.now()}`;
}

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

function saveNewList() {
  const name = document.querySelector('#new-list-name')?.value.trim();
  if (!name) {
    document.querySelector('#new-list-name')?.focus();
    showToast('Enter a list name.');
    return;
  }
  const current = store.getState();
  const base = slug(name);
  let id = base;
  let suffix = 2;
  while (current.lists.some(list => list.id === id)) id = `${base}-${suffix++}`;
  const list = normalizeList({
    id,
    name,
    icon: document.querySelector('#new-list-icon')?.value || '☷',
    items: [],
    catalog: [],
    order: current.lists.length * 10,
    pinned: true
  }, current.lists.length);
  store.setState({
    lists: [...current.lists, list],
    activity: [{ id: `activity-${Date.now()}`, title: name, detail: 'List created', time: 'Just now', icon: '+' }, ...current.activity].slice(0, 8),
    lastUndo: { label: `${name} created`, snapshot: clone(current) }
  });
  closeSheet();
  ui.pendingFocusListId = id;
  router.go(`lists/${id}`);
  showToast(`${name} created.`, true);
}

function nextItemOrder(list) {
  return list.items.length ? Math.max(...list.items.map(item => Number(item.order || 0))) + 10 : 0;
}

function addNameToList(listId, name) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const trimmed = String(name || '').trim();
  if (!list || !trimmed) return;
  const normalized = normalizeName(trimmed);
  if (list.items.some(item => item.normalizedName === normalized)) {
    showToast('That item is already on the list.');
    return;
  }
  const catalogItem = list.catalog.find(item => item.normalizedName === normalized);
  const displayName = catalogItem?.name || trimmed;
  const item = makeItem(`list-item-${Date.now()}`, displayName, nextItemOrder(list));
  store.setState(state => ({
    lists: state.lists.map(entry => entry.id === listId ? { ...entry, items: [...entry.items, item] } : entry),
    activity: [{ id: `activity-${Date.now()}`, title: item.name, detail: `Added to ${list.name}`, time: 'Just now', icon: '+' }, ...state.activity].slice(0, 8),
    lastUndo: { label: `${item.name} added`, snapshot: clone(current) }
  }));
  ui.suggestionQuery = '';
  showToast(`${item.name} added.`, true);
}

function addTypedItem(listId) {
  const input = document.querySelector('#list-item-input');
  const name = input?.value.trim();
  if (!name) {
    input?.focus();
    return;
  }
  addNameToList(listId, name);
}

function addRememberedItem(listId, catalogId) {
  const list = store.getState().lists.find(entry => entry.id === listId);
  const item = list?.catalog.find(entry => entry.id === catalogId);
  if (item) addNameToList(listId, item.name);
}

function checkListItem(listId, itemId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return;
  const existingCatalog = list.catalog.find(entry => entry.normalizedName === item.normalizedName);
  const remembered = existingCatalog
    ? list.catalog.map(entry => entry.id === existingCatalog.id ? {
        ...entry,
        name: item.name,
        timesUsed: Number(entry.timesUsed || 0) + 1,
        lastUsedAt: nowIso()
      } : entry)
    : [...list.catalog, makeCatalogItem(`catalog-${Date.now()}`, item.name, 1)];
  store.setState(state => ({
    lists: state.lists.map(entry => entry.id === listId ? {
      ...entry,
      items: entry.items.filter(active => active.id !== itemId),
      catalog: remembered,
      lastUsedAt: nowIso()
    } : entry),
    activity: [{ id: `activity-${Date.now()}`, title: item.name, detail: `Checked off ${list.name}`, time: 'Just now', icon: '✓' }, ...state.activity].slice(0, 8),
    lastUndo: { label: `${item.name} checked`, snapshot: clone(current) }
  }));
  showToast(`${item.name} checked off.`, true);
}

function beginEditing(listId, itemId) {
  ui.editingItemId = itemId;
  renderListDetail();
  requestAnimationFrame(() => {
    const input = document.querySelector(`[data-list-item-input][data-item-id="${itemId}"]`);
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  });
}

function saveItemName(input) {
  const { listId, itemId } = input.dataset;
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return;
  const name = input.value.trim();
  ui.editingItemId = '';
  if (!name) {
    showToast('Item name cannot be empty.');
    renderListDetail();
    return;
  }
  const normalizedName = normalizeName(name);
  const duplicate = list.items.some(entry => entry.id !== itemId && entry.normalizedName === normalizedName);
  if (duplicate) {
    showToast('That item is already on the list.');
    renderListDetail();
    return;
  }
  if (name === item.name) {
    renderListDetail();
    return;
  }
  store.setState(state => ({
    lists: state.lists.map(entry => entry.id === listId ? {
      ...entry,
      items: entry.items.map(active => active.id === itemId ? { ...active, name, normalizedName } : active)
    } : entry),
    lastUndo: { label: `${name} updated`, snapshot: clone(current) }
  }));
  showToast('Item updated.', true);
}

function saveListSettings(listId) {
  const name = document.querySelector('#edit-list-name')?.value.trim();
  if (!name) {
    showToast('Enter a list name.');
    return;
  }
  const current = store.getState();
  store.setState({
    lists: current.lists.map(list => list.id === listId ? { ...list, name, icon: document.querySelector('#edit-list-icon')?.value || list.icon } : list),
    lastUndo: { label: `${name} updated`, snapshot: clone(current) }
  });
  closeSheet();
  showToast('List updated.', true);
}

function focusPendingInput(listId) {
  if (ui.pendingFocusListId !== listId) return;
  requestAnimationFrame(() => document.querySelector('#list-item-input')?.focus());
  ui.pendingFocusListId = '';
}

function moveItem(listId, draggedId, targetId, placeAfter) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  if (!list || draggedId === targetId) return;
  const ordered = orderedItems(list);
  const dragged = ordered.find(item => item.id === draggedId);
  if (!dragged) return;
  const without = ordered.filter(item => item.id !== draggedId);
  const targetIndex = without.findIndex(item => item.id === targetId);
  if (targetIndex < 0) return;
  without.splice(targetIndex + (placeAfter ? 1 : 0), 0, dragged);
  const reordered = without.map((item, index) => ({ ...item, order: index * 10 }));
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items: reordered } : entry),
    lastUndo: { label: 'List item moved', snapshot: clone(current) }
  });
  showToast('Item moved.', true);
}

function clearDropClasses() {
  screen.querySelectorAll('.list-dragging-item, .list-drop-before, .list-drop-after').forEach(element => {
    element.classList.remove('list-dragging-item', 'list-drop-before', 'list-drop-after');
  });
}

function beginDrag() {
  if (!ui.drag || ui.drag.active) return;
  const row = ui.drag.row;
  ui.drag.active = true;
  row.classList.add('list-dragging-item');
  row.setPointerCapture?.(ui.drag.pointerId);
  document.body.classList.add('list-item-dragging');
  document.activeElement?.blur();
}

function cancelPendingDrag() {
  if (!ui.drag || ui.drag.active) return;
  clearTimeout(ui.drag.timer);
  ui.drag = null;
}

function updateDrag(event) {
  if (!ui.drag?.active || event.pointerId !== ui.drag.pointerId) return;
  event.preventDefault();
  screen.querySelectorAll('.list-drop-before, .list-drop-after').forEach(element => {
    element.classList.remove('list-drop-before', 'list-drop-after');
  });
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const row = element?.closest('[data-list-row]');
  if (!row || row.dataset.itemId === ui.drag.itemId || row.dataset.listId !== ui.drag.listId) {
    ui.drag.targetId = '';
    return;
  }
  const rect = row.getBoundingClientRect();
  const placeAfter = event.clientY > rect.top + rect.height / 2;
  row.classList.add(placeAfter ? 'list-drop-after' : 'list-drop-before');
  ui.drag.targetId = row.dataset.itemId;
  ui.drag.placeAfter = placeAfter;
}

function endDrag(event) {
  if (!ui.drag || event.pointerId !== ui.drag.pointerId) return;
  clearTimeout(ui.drag.timer);
  const drag = ui.drag;
  if (drag.active) {
    try { drag.row.releasePointerCapture?.(event.pointerId); } catch (_) { /* pointer capture may already be released */ }
    clearDropClasses();
    document.body.classList.remove('list-item-dragging');
    ui.suppressClickUntil = Date.now() + 300;
    if (drag.targetId) moveItem(drag.listId, drag.itemId, drag.targetId, drag.placeAfter);
  }
  ui.drag = null;
}

document.addEventListener('pointerdown', event => {
  if (router.getRoute().split('/')[0] !== 'lists') return;
  const row = event.target.closest('[data-list-row]');
  if (!row || event.target.closest('.simple-list-check') || event.target.matches('[data-list-item-input]')) return;
  ui.drag = {
    active: false,
    listId: row.dataset.listId,
    itemId: row.dataset.itemId,
    pointerId: event.pointerId,
    row,
    startX: event.clientX,
    startY: event.clientY,
    targetId: '',
    placeAfter: false,
    timer: setTimeout(beginDrag, 220)
  };
});

document.addEventListener('pointermove', event => {
  if (!ui.drag) return;
  if (!ui.drag.active) {
    const distance = Math.hypot(event.clientX - ui.drag.startX, event.clientY - ui.drag.startY);
    if (distance > 8) cancelPendingDrag();
    return;
  }
  updateDrag(event);
}, { passive: false });

document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

document.addEventListener('input', event => {
  if (event.target.id !== 'list-item-input') return;
  ui.suggestionQuery = event.target.value;
  renderListDetail();
  requestAnimationFrame(() => {
    const input = document.querySelector('#list-item-input');
    input?.focus();
    input?.setSelectionRange(ui.suggestionQuery.length, ui.suggestionQuery.length);
  });
});

document.addEventListener('focusout', event => {
  if (event.target.matches('[data-list-item-input]')) saveItemName(event.target);
});

document.addEventListener('keydown', event => {
  if (event.target.id === 'list-item-input' && event.key === 'Enter') {
    event.preventDefault();
    const list = currentList();
    if (list) addTypedItem(list.id);
  }
  if (!event.target.matches('[data-list-item-input]')) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    event.target.blur();
  }
  if (event.key === 'Escape') {
    ui.editingItemId = '';
    renderListDetail();
  }
});

document.addEventListener('click', event => {
  if (Date.now() < ui.suppressClickUntil) {
    event.preventDefault();
    return;
  }
  const target = event.target.closest('[data-action]');
  if (!target || router.getRoute().split('/')[0] !== 'lists') return;
  const action = target.dataset.action;
  if (action === 'open-create-list') {
    overlayRoot.innerHTML = createListSheet();
    requestAnimationFrame(() => document.querySelector('#new-list-name')?.focus());
  }
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
  if (action === 'add-list-item') addTypedItem(target.dataset.listId);
  if (action === 'add-remembered-item') addRememberedItem(target.dataset.listId, target.dataset.catalogId);
  if (action === 'check-list-item') checkListItem(target.dataset.listId, target.dataset.itemId);
  if (action === 'edit-list-item') beginEditing(target.dataset.listId, target.dataset.itemId);
  if (action === 'lists-undo' && store.undoLast()) showToast('Last change undone.');
});

window.addEventListener('hashchange', () => {
  ui.suggestionQuery = '';
  ui.editingItemId = '';
  requestAnimationFrame(renderLists);
});

store.subscribe(() => {
  ensureListsModel();
  requestAnimationFrame(renderLists);
});

ensureListsModel();
requestAnimationFrame(renderLists);
