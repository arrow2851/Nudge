import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  suggestionQuery: '',
  pendingDuplicate: null,
  pendingFocusListId: '',
  toastTimer: null,
  undoTimer: null
};

const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const clone = value => JSON.parse(JSON.stringify(value));
const normalizeName = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const nowIso = () => new Date().toISOString();

const seedData = {
  groceries: {
    items: [
      ['milk', 'Milk', 1, 'gallon', 'Dairy'],
      ['eggs', 'Eggs', 1, 'dozen', 'Dairy'],
      ['bananas', 'Bananas', 6, '', 'Produce'],
      ['chicken-breast', 'Chicken breast', 2, 'lb', 'Meat'],
      ['spinach', 'Spinach', 1, 'bag', 'Produce'],
      ['yogurt', 'Yogurt', 4, '', 'Dairy']
    ],
    catalog: [
      ['bread', 'Bread', 8, 1, 'loaf', 'Bakery'],
      ['rice', 'Rice', 5, 1, 'bag', 'Pantry'],
      ['coffee', 'Coffee', 4, 1, 'bag', 'Pantry'],
      ['tomatoes', 'Tomatoes', 7, 4, '', 'Produce'],
      ['salmon', 'Frozen salmon', 3, 1, 'bag', 'Frozen']
    ]
  },
  restock: {
    items: [
      ['paper-towels', 'Paper towels', 1, 'pack', 'Paper goods'],
      ['dish-soap', 'Dish soap', 1, 'bottle', 'Cleaning']
    ],
    catalog: [
      ['trash-bags', 'Trash bags', 6, 1, 'box', 'Cleaning'],
      ['laundry-detergent', 'Laundry detergent', 4, 1, 'bottle', 'Laundry'],
      ['toilet-paper', 'Toilet paper', 7, 1, 'pack', 'Paper goods'],
      ['sponges', 'Sponges', 3, 1, 'pack', 'Cleaning']
    ]
  }
};

function makeItem(id, name, quantity = 1, unit = '', category = '') {
  return {
    id,
    name,
    normalizedName: normalizeName(name),
    quantity,
    unit,
    category,
    createdAt: nowIso()
  };
}

function makeCatalogItem(id, name, timesUsed = 1, quantity = 1, unit = '', category = '') {
  return {
    id,
    name,
    normalizedName: normalizeName(name),
    timesUsed,
    quantity,
    unit,
    category,
    favorite: false,
    lastUsedAt: new Date(Date.now() - timesUsed * 86400000).toISOString()
  };
}

function normalizeList(list, index) {
  const seed = seedData[list.id] || { items: [], catalog: [] };
  const items = Array.isArray(list.items)
    ? list.items.map((item, itemIndex) => ({
        ...makeItem(item.id || `${list.id}-item-${itemIndex}`, item.name || item.title || 'Item'),
        ...item,
        normalizedName: item.normalizedName || normalizeName(item.name || item.title)
      }))
    : seed.items.map(values => makeItem(`${list.id}-${values[0]}`, ...values.slice(1)));
  const catalog = Array.isArray(list.catalog)
    ? list.catalog.map((item, itemIndex) => ({
        ...makeCatalogItem(item.id || `${list.id}-catalog-${itemIndex}`, item.name || 'Item'),
        ...item,
        normalizedName: item.normalizedName || normalizeName(item.name)
      }))
    : seed.catalog.map(values => makeCatalogItem(`${list.id}-catalog-${values[0]}`, ...values.slice(1)));
  return {
    id: list.id || `list-${Date.now()}-${index}`,
    name: list.name || 'Untitled list',
    icon: list.icon || '☷',
    archived: Boolean(list.archived),
    pinned: list.pinned !== false,
    order: Number.isFinite(list.order) ? list.order : index * 10,
    createdAt: list.createdAt || nowIso(),
    lastUsedAt: list.lastUsedAt || '',
    session: list.session?.active ? list.session : null,
    lastSession: list.lastSession || null,
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
  const changed = version < 1 || JSON.stringify(normalized) !== JSON.stringify(state.lists);
  if (!changed) return;
  ensuringModel = true;
  store.setState({
    lists: normalized,
    preferences: { ...state.preferences, listsModelVersion: 1 }
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

function itemMeta(item) {
  const quantity = Number(item.quantity || 1);
  const parts = [];
  if (quantity !== 1 || item.unit) parts.push(`${quantity}${item.unit ? ` ${item.unit}` : ''}`);
  if (item.category) parts.push(item.category);
  return parts.join(' · ');
}

function listCard(list) {
  const active = list.items.length;
  const last = list.lastUsedAt
    ? `Used ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(list.lastUsedAt))}`
    : list.catalog.length ? `${list.catalog.length} remembered` : 'New reusable list';
  return `<button class="reusable-list-card" data-route="lists/${list.id}">
    <span class="reusable-list-icon">${esc(list.icon)}</span>
    <span class="reusable-list-copy"><strong>${esc(list.name)}</strong><small>${active} active · ${esc(last)}</small></span>
    <span class="reusable-list-count">${active}</span><span class="reusable-list-arrow">›</span>
  </button>`;
}

function renderCollection() {
  if (router.getRoute().split('/')[0] !== 'lists' || router.getRoute().split('/')[1]) return;
  const lists = activeLists();
  screen.innerHTML = `<header class="page-header lists-header"><div><p class="eyebrow">Reusable</p><h1>Lists</h1><p>Check items off now. Reuse them later.</p></div><button class="icon-button" data-action="open-create-list" aria-label="Create list">+</button></header>
    <div class="reusable-list-collection">${lists.map(listCard).join('') || `<div class="lists-empty"><span>☷</span><h2>No lists yet</h2><p>Create a reusable list for groceries, restocking, packing, or anything else.</p></div>`}</div>
    <button class="lists-bottom-add" data-action="open-create-list"><span>+</span> New list</button>`;
}

function suggestionMatches(list, query) {
  const activeNames = new Set(list.items.map(item => item.normalizedName));
  const normalized = normalizeName(query);
  return [...list.catalog]
    .filter(item => !activeNames.has(item.normalizedName))
    .filter(item => !normalized || item.normalizedName.includes(normalized))
    .sort((a, b) => Number(b.favorite) - Number(a.favorite)
      || Number(b.timesUsed || 0) - Number(a.timesUsed || 0)
      || new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0))
    .slice(0, 6);
}

function suggestionMarkup(list) {
  const suggestions = suggestionMatches(list, ui.suggestionQuery);
  if (!suggestions.length) return '';
  return `<div class="remembered-suggestions"><small>${ui.suggestionQuery ? 'Suggestions' : 'Add again'}</small><div>${suggestions.map(item => `<button data-action="add-remembered-item" data-list-id="${list.id}" data-catalog-id="${item.id}"><span>+</span>${esc(item.name)}${item.quantity && item.quantity !== 1 ? `<i>${item.quantity}${item.unit ? ` ${esc(item.unit)}` : ''}</i>` : ''}</button>`).join('')}</div></div>`;
}

function listItemRow(list, item) {
  const meta = itemMeta(item);
  return `<div class="reusable-item-row">
    <button class="reusable-check" data-action="check-list-item" data-list-id="${list.id}" data-item-id="${item.id}" aria-label="Check off ${esc(item.name)}"></button>
    <button class="reusable-item-main" data-action="open-list-item-settings" data-list-id="${list.id}" data-item-id="${item.id}"><strong>${esc(item.name)}</strong>${meta ? `<small>${esc(meta)}</small>` : ''}</button>
    <button class="reusable-item-more" data-action="open-list-item-settings" data-list-id="${list.id}" data-item-id="${item.id}" aria-label="Edit ${esc(item.name)}">›</button>
  </div>`;
}

function renderListDetail() {
  if (router.getRoute().split('/')[0] !== 'lists' || !router.getRoute().split('/')[1]) return;
  const list = currentList();
  if (!list) {
    router.go('lists');
    return;
  }
  const session = list.session?.active ? list.session : null;
  const sessionCopy = session
    ? `<div class="list-session-banner"><div><strong>Session active</strong><small>${session.checked?.length || 0} checked · ${list.items.length} remaining</small></div><button class="button primary" data-action="finish-list-session" data-list-id="${list.id}">Finish</button></div>`
    : '';
  screen.innerHTML = `<div class="list-detail-screen">
    <header class="list-detail-header"><button class="icon-button" data-route="lists" aria-label="Back">←</button><div><p class="eyebrow">${esc(list.icon)} Reusable list</p><h1>${esc(list.name)}</h1><p>${list.items.length} active</p></div><button class="icon-button" data-action="open-list-settings" data-list-id="${list.id}" aria-label="List settings">•••</button></header>
    ${sessionCopy}
    <div class="list-add-box"><div class="list-add-row"><input id="list-item-input" value="${esc(ui.suggestionQuery)}" placeholder="Add an item" autocomplete="off" aria-label="Add item to ${esc(list.name)}"><button data-action="add-list-item" data-list-id="${list.id}">+</button></div>${suggestionMarkup(list)}</div>
    <div class="list-detail-toolbar"><span>${list.items.length} ${list.items.length === 1 ? 'item' : 'items'}</span>${session ? '' : `<button data-action="start-list-session" data-list-id="${list.id}" ${list.items.length ? '' : 'disabled'}>Start session</button>`}</div>
    <div class="reusable-items">${list.items.map(item => listItemRow(list, item)).join('') || `<div class="list-detail-empty"><span>✓</span><h2>List is clear</h2><p>Add something new or reuse a remembered item above.</p></div>`}</div>
  </div>`;
  if (ui.pendingFocusListId === list.id) {
    requestAnimationFrame(() => document.querySelector('#list-item-input')?.focus());
    ui.pendingFocusListId = '';
  }
}

function renderLists() {
  const root = router.getRoute().split('/')[0];
  if (root !== 'lists') return;
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
  ui.pendingDuplicate = null;
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

function itemSettingsSheet(listId, itemId) {
  const list = store.getState().lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return '';
  const categories = ['', 'Produce', 'Dairy', 'Meat', 'Frozen', 'Pantry', 'Bakery', 'Cleaning', 'Paper goods', 'Laundry', 'Other'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">List item</p><h2>${esc(item.name)}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><div class="field"><label for="edit-list-item-name">Name</label><input class="input" id="edit-list-item-name" value="${esc(item.name)}"></div><div class="two-field-grid"><div class="field"><label for="edit-list-item-quantity">Quantity</label><input class="input" id="edit-list-item-quantity" type="number" min="0.1" step="0.1" value="${Number(item.quantity || 1)}"></div><div class="field"><label for="edit-list-item-unit">Unit</label><input class="input" id="edit-list-item-unit" value="${esc(item.unit || '')}" placeholder="pack, lb, bottle"></div></div><div class="field"><label for="edit-list-item-category">Category</label><select class="input" id="edit-list-item-category">${categories.map(category => `<option value="${esc(category)}" ${category === (item.category || '') ? 'selected' : ''}>${esc(category || 'None')}</option>`).join('')}</select></div><div class="sheet-action-row"><button class="button danger" data-action="delete-list-item" data-list-id="${list.id}" data-item-id="${item.id}">Delete</button><button class="button primary" data-action="save-list-item-settings" data-list-id="${list.id}" data-item-id="${item.id}">Save</button></div></section></div>`;
}

function duplicateSheet(list, existing, draft) {
  ui.pendingDuplicate = { listId: list.id, existingId: existing.id, draft };
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Already on ${esc(list.name)}</p><h2>${esc(existing.name)}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><p class="row-meta">Choose how to handle the duplicate.</p><button class="grade-option" data-action="increase-duplicate-quantity"><span class="grade-badge">+</span><span><strong>Increase quantity</strong><small>${Number(existing.quantity || 1)} → ${Number(existing.quantity || 1) + Number(draft.quantity || 1)}</small></span></button><button class="grade-option" data-action="keep-duplicate-line"><span class="grade-badge">Ⅱ</span><span><strong>Keep another line</strong><small>Add it as a separate item</small></span></button></section></div>`;
}

function finishSessionSheet(list) {
  const checked = list.session?.checked || [];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Session complete</p><h2>${esc(list.name)}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><div class="session-summary-number">${checked.length}</div><p class="session-summary-copy">${checked.length === 1 ? 'item checked off' : 'items checked off'} · ${list.items.length} remaining</p>${checked.length ? `<div class="session-checked-list">${checked.slice(0, 8).map(item => `<span>✓ ${esc(item.name)}</span>`).join('')}</div>` : ''}<button class="button primary block" data-action="confirm-finish-list-session" data-list-id="${list.id}">Finish session</button></section></div>`;
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

function draftFromCatalog(item) {
  return {
    name: item.name,
    normalizedName: item.normalizedName,
    quantity: Number(item.quantity || 1),
    unit: item.unit || '',
    category: item.category || ''
  };
}

function addDraftToList(listId, draft, allowDuplicate = false) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  if (!list || !draft.name.trim()) return;
  const normalized = normalizeName(draft.name);
  const existing = list.items.find(item => item.normalizedName === normalized);
  if (existing && !allowDuplicate) {
    overlayRoot.innerHTML = duplicateSheet(list, existing, { ...draft, normalizedName: normalized });
    return;
  }
  const item = makeItem(`list-item-${Date.now()}`, draft.name.trim(), Number(draft.quantity || 1), draft.unit || '', draft.category || '');
  item.normalizedName = normalized;
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
  const list = store.getState().lists.find(entry => entry.id === listId);
  const catalog = list?.catalog.find(item => item.normalizedName === normalizeName(name));
  addDraftToList(listId, catalog ? draftFromCatalog(catalog) : { name, quantity: 1, unit: '', category: '' });
}

function addRememberedItem(listId, catalogId) {
  const list = store.getState().lists.find(entry => entry.id === listId);
  const item = list?.catalog.find(entry => entry.id === catalogId);
  if (!list || !item) return;
  addDraftToList(listId, draftFromCatalog(item));
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
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        timesUsed: Number(entry.timesUsed || 0) + 1,
        lastUsedAt: nowIso()
      } : entry)
    : [...list.catalog, makeCatalogItem(`catalog-${Date.now()}`, item.name, 1, item.quantity, item.unit, item.category)];
  const session = list.session?.active
    ? { ...list.session, checked: [...(list.session.checked || []), { name: item.name, quantity: item.quantity, unit: item.unit }] }
    : list.session;
  store.setState(state => ({
    lists: state.lists.map(entry => entry.id === listId ? {
      ...entry,
      items: entry.items.filter(active => active.id !== itemId),
      catalog: remembered,
      session,
      lastUsedAt: nowIso()
    } : entry),
    activity: [{ id: `activity-${Date.now()}`, title: item.name, detail: `Checked off ${list.name}`, time: 'Just now', icon: '✓' }, ...state.activity].slice(0, 8),
    lastUndo: { label: `${item.name} checked`, snapshot: clone(current) }
  }));
  showToast(`${item.name} checked off.`, true);
}

function saveItemSettings(listId, itemId) {
  const name = document.querySelector('#edit-list-item-name')?.value.trim();
  if (!name) {
    showToast('Enter an item name.');
    return;
  }
  const current = store.getState();
  const changes = {
    name,
    normalizedName: normalizeName(name),
    quantity: Math.max(0.1, Number(document.querySelector('#edit-list-item-quantity')?.value) || 1),
    unit: document.querySelector('#edit-list-item-unit')?.value.trim() || '',
    category: document.querySelector('#edit-list-item-category')?.value || ''
  };
  store.setState(state => ({
    lists: state.lists.map(list => list.id === listId ? { ...list, items: list.items.map(item => item.id === itemId ? { ...item, ...changes } : item) } : list),
    lastUndo: { label: `${name} updated`, snapshot: clone(current) }
  }));
  closeSheet();
  showToast('Item updated.', true);
}

function deleteListItem(listId, itemId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  const item = list?.items.find(entry => entry.id === itemId);
  if (!list || !item) return;
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, items: entry.items.filter(active => active.id !== itemId) } : entry),
    lastUndo: { label: `${item.name} deleted`, snapshot: clone(current) }
  });
  closeSheet();
  showToast(`${item.name} deleted.`, true);
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

function startListSession(listId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  if (!list || !list.items.length) return;
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, session: { active: true, startedAt: nowIso(), checked: [] } } : entry),
    lastUndo: { label: `${list.name} session started`, snapshot: clone(current) }
  });
  showToast('Session started.', true);
}

function confirmFinishSession(listId) {
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === listId);
  if (!list?.session?.active) return;
  const endedAt = nowIso();
  const summary = { startedAt: list.session.startedAt, endedAt, checked: list.session.checked || [], remaining: list.items.length };
  store.setState({
    lists: current.lists.map(entry => entry.id === listId ? { ...entry, session: null, lastSession: summary, lastUsedAt: endedAt } : entry),
    activity: [{ id: `activity-${Date.now()}`, title: list.name, detail: `${summary.checked.length} items completed`, time: 'Just now', icon: '✓' }, ...current.activity].slice(0, 8),
    lastUndo: { label: `${list.name} session finished`, snapshot: clone(current) }
  });
  closeSheet();
  showToast('Session finished.', true);
}

function resolveDuplicate(increase) {
  const pending = ui.pendingDuplicate;
  if (!pending) return;
  const current = store.getState();
  const list = current.lists.find(entry => entry.id === pending.listId);
  const existing = list?.items.find(item => item.id === pending.existingId);
  if (!list || !existing) return;
  if (increase) {
    const quantity = Number(existing.quantity || 1) + Number(pending.draft.quantity || 1);
    store.setState({
      lists: current.lists.map(entry => entry.id === list.id ? { ...entry, items: entry.items.map(item => item.id === existing.id ? { ...item, quantity } : item) } : entry),
      lastUndo: { label: `${existing.name} quantity increased`, snapshot: clone(current) }
    });
    closeSheet();
    ui.suggestionQuery = '';
    showToast('Quantity increased.', true);
  } else {
    closeSheet();
    addDraftToList(list.id, pending.draft, true);
  }
}

document.addEventListener('input', event => {
  if (event.target.id !== 'list-item-input') return;
  ui.suggestionQuery = event.target.value;
  renderListDetail();
  requestAnimationFrame(() => {
    const input = document.querySelector('#list-item-input');
    if (!input) return;
    input.focus();
    input.setSelectionRange(ui.suggestionQuery.length, ui.suggestionQuery.length);
  });
});

document.addEventListener('keydown', event => {
  if (event.target.id === 'list-item-input' && event.key === 'Enter') {
    event.preventDefault();
    const list = currentList();
    if (list) addTypedItem(list.id);
  }
});

document.addEventListener('click', event => {
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
  if (action === 'open-list-item-settings') overlayRoot.innerHTML = itemSettingsSheet(target.dataset.listId, target.dataset.itemId);
  if (action === 'save-list-item-settings') saveItemSettings(target.dataset.listId, target.dataset.itemId);
  if (action === 'delete-list-item') deleteListItem(target.dataset.listId, target.dataset.itemId);
  if (action === 'increase-duplicate-quantity') resolveDuplicate(true);
  if (action === 'keep-duplicate-line') resolveDuplicate(false);
  if (action === 'start-list-session') startListSession(target.dataset.listId);
  if (action === 'finish-list-session') {
    const list = store.getState().lists.find(entry => entry.id === target.dataset.listId);
    if (list) overlayRoot.innerHTML = finishSessionSheet(list);
  }
  if (action === 'confirm-finish-list-session') confirmFinishSession(target.dataset.listId);
  if (action === 'lists-undo' && store.undoLast()) showToast('Last change undone.');
});

window.addEventListener('hashchange', () => {
  ui.suggestionQuery = '';
  requestAnimationFrame(renderLists);
});
store.subscribe(() => {
  ensureListsModel();
  requestAnimationFrame(renderLists);
});

ensureListsModel();
requestAnimationFrame(renderLists);
