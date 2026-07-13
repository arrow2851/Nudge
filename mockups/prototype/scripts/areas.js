import { store } from './state.js';

const templateLibrary = [
  {
    id: 'default-house',
    name: 'House',
    icon: '🏠',
    description: 'Common home sections plus a practical starter set of recurring chores.',
    suggestedSubareas: [
      ['kitchen', 'Kitchen', '🍳'], ['living-room', 'Living Room', '🛋️'], ['dining-room', 'Dining Room', '🍽️'],
      ['bathroom', 'Bathroom', '🛁'], ['bedroom', 'Bedroom', '🛏️'], ['office', 'Office', '💻'],
      ['laundry', 'Laundry', '🧺'], ['garage', 'Garage', '🧰'], ['hallway', 'Hallway', '🚪'], ['general', 'General House', '🏠']
    ].map(([id, name, icon]) => ({ id, name, icon })),
    suggestedChores: [
      { title: 'Wipe kitchen counters', sectionId: 'kitchen', recurrence: 'Daily', minutes: 5, grading: true, startInDays: 0 },
      { title: 'Empty dishwasher', sectionId: 'kitchen', recurrence: 'As needed', minutes: 4, startInDays: 0 },
      { title: 'Clean kitchen sink', sectionId: 'kitchen', recurrence: 'Weekly', minutes: 10, grading: true, startInDays: 1 },
      { title: 'Mop kitchen floor', sectionId: 'kitchen', recurrence: 'Weekly', minutes: 15, grading: true, startInDays: 4 },
      { title: 'Vacuum living room', sectionId: 'living-room', recurrence: 'Weekly', minutes: 15, grading: true, startInDays: 2 },
      { title: 'Dust living room surfaces', sectionId: 'living-room', recurrence: 'Weekly', minutes: 10, grading: true, startInDays: 5 },
      { title: 'Clean bathroom mirror', sectionId: 'bathroom', recurrence: 'Weekly', minutes: 5, grading: true, startInDays: 0 },
      { title: 'Clean toilet', sectionId: 'bathroom', recurrence: 'Weekly', minutes: 10, grading: true, startInDays: 2 },
      { title: 'Replace bathroom towels', sectionId: 'bathroom', recurrence: 'Weekly', minutes: 5, startInDays: 3 },
      { title: 'Change bedding', sectionId: 'bedroom', recurrence: 'Weekly', minutes: 10, startInDays: 6 },
      { title: 'Vacuum bedroom', sectionId: 'bedroom', recurrence: 'Weekly', minutes: 15, grading: true, startInDays: 4 },
      { title: 'Clear office desk', sectionId: 'office', recurrence: 'Weekly', minutes: 10, startInDays: 1 },
      { title: 'Wash clothes', sectionId: 'laundry', recurrence: 'As needed', minutes: 45, startInDays: 0 },
      { title: 'Sweep garage', sectionId: 'garage', recurrence: 'Monthly', minutes: 20, grading: true, startInDays: 14 },
      { title: 'Put trash bins outside', sectionId: 'general', recurrence: 'Weekly', minutes: 4, startInDays: 0 },
      { title: 'Replace HVAC filter', sectionId: 'general', recurrence: 'Every 60 days', minutes: 8, startInDays: 30 }
    ]
  },
  {
    id: 'default-car',
    name: 'Car',
    icon: '🚗',
    description: 'Simple interior, exterior, and maintenance routines.',
    suggestedSubareas: [
      { id: 'interior', name: 'Interior', icon: '🪑' },
      { id: 'exterior', name: 'Exterior', icon: '🚘' },
      { id: 'maintenance', name: 'Maintenance', icon: '🧰' }
    ],
    suggestedChores: [
      { title: 'Clear trash from car', sectionId: 'interior', recurrence: 'As needed', minutes: 5, startInDays: 0 },
      { title: 'Vacuum car interior', sectionId: 'interior', recurrence: 'Monthly', minutes: 20, grading: true, startInDays: 7 },
      { title: 'Wash car exterior', sectionId: 'exterior', recurrence: 'Monthly', minutes: 30, grading: true, startInDays: 14 },
      { title: 'Check tire pressure', sectionId: 'maintenance', recurrence: 'Monthly', minutes: 8, startInDays: 3 },
      { title: 'Check vehicle fluids', sectionId: 'maintenance', recurrence: 'Monthly', minutes: 10, startInDays: 10 },
      { title: 'Rotate tires', sectionId: 'maintenance', recurrence: 'Every 90 days', minutes: 45, startInDays: 45 }
    ]
  },
  {
    id: 'default-personal', name: 'Personal', icon: '👤',
    description: 'A blank recurring-routine Area that can be customized.', suggestedSubareas: [], suggestedChores: []
  },
  {
    id: 'default-work', name: 'Work', icon: '💼',
    description: 'A blank recurring-routine Area that can be customized.', suggestedSubareas: [], suggestedChores: []
  }
];

const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));
const clone = value => JSON.parse(JSON.stringify(value));
const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const slug = value => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`;

let ensuring = false;
export function ensureAreasModel() {
  if (ensuring) return;
  const state = store.getState();
  const version = Number(state.preferences?.areasModelVersion || 0);
  const existing = new Map((state.templates || []).map(template => [template.id, template]));
  const defaults = templateLibrary.map(template => ({ ...existing.get(template.id), ...template }));
  const custom = (state.templates || []).filter(template => !templateLibrary.some(item => item.id === template.id));
  const templates = [...defaults, ...custom];
  const preferences = { ...state.preferences, areasModelVersion: 2 };
  if (version >= 2 && JSON.stringify(templates) === JSON.stringify(state.templates)) return;
  ensuring = true;
  store.setState({ templates, preferences });
  ensuring = false;
}

store.subscribe(ensureAreasModel);
ensureAreasModel();

function dateState(startInDays = 0, recurrence = '') {
  if (recurrence.toLowerCase() === 'as needed') return { due: 'As needed', dueDate: '', urgency: 'upcoming' };
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + Number(startInDays || 0));
  const dueDate = date.toISOString().slice(0, 10);
  if (Number(startInDays) === 0) return { due: 'Today', dueDate, urgency: 'today' };
  if (Number(startInDays) === 1) return { due: 'Tomorrow', dueDate, urgency: 'upcoming' };
  return {
    due: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
    dueDate,
    urgency: 'upcoming'
  };
}

export function applyAreaTemplate(areaId, templateId, options = {}) {
  ensureAreasModel();
  const current = store.getState();
  const area = current.areas.find(item => item.id === areaId);
  const template = current.templates.find(item => item.id === templateId);
  if (!area || !template) return { sections: 0, chores: 0 };
  const includeSections = options.includeSections !== false;
  const includeChores = options.includeChores !== false;
  const previous = clone(current);
  const existingNames = new Set(area.subareas.filter(item => !item.archived).map(item => normalize(item.name)));
  const sectionAdditions = includeSections
    ? (template.suggestedSubareas || []).filter(item => !existingNames.has(normalize(item.name))).map((item, index) => ({
        ...item,
        id: area.subareas.some(section => section.id === item.id) ? `${item.id}-${Date.now()}-${index}` : item.id,
        order: area.subareas.length + index,
        archived: false
      }))
    : [];
  const allSections = [...area.subareas, ...sectionAdditions];
  const sectionFor = sectionId => {
    const templateSection = (template.suggestedSubareas || []).find(item => item.id === sectionId);
    return allSections.find(item => item.id === sectionId)
      || allSections.find(item => templateSection && normalize(item.name) === normalize(templateSection.name));
  };
  const existingChores = new Set(current.tasks
    .filter(item => item.type === 'chore' && item.areaId === areaId)
    .map(item => normalize(item.title)));
  const taskIds = new Set(current.tasks.map(item => item.id));
  const choreAdditions = includeChores ? (template.suggestedChores || [])
    .filter(item => !existingChores.has(normalize(item.title)))
    .map((item, index) => {
      const section = sectionFor(item.sectionId);
      let id = `chore-${areaId}-${slug(item.title)}`;
      let suffix = 2;
      while (taskIds.has(id)) id = `chore-${areaId}-${slug(item.title)}-${suffix++}`;
      taskIds.add(id);
      return {
        id,
        title: item.title,
        type: 'chore',
        areaId,
        subareaId: section?.id || '',
        area: area.name,
        subarea: section?.name || '',
        minutes: Number(item.minutes || 10),
        ...dateState(item.startInDays, item.recurrence),
        completed: false,
        grading: Boolean(item.grading),
        recurrence: item.recurrence || 'Weekly',
        nudge: true,
        scheduleBasis: 'completion',
        status: 'planned',
        createdAt: new Date(Date.now() + index).toISOString()
      };
    }) : [];

  store.setState({
    areas: current.areas.map(item => item.id === areaId ? {
      ...item,
      templateId,
      subareas: [...item.subareas, ...sectionAdditions]
    } : item),
    tasks: [...current.tasks, ...choreAdditions],
    activity: [{
      id: `activity-${Date.now()}`,
      title: area.name,
      detail: `${sectionAdditions.length} sections · ${choreAdditions.length} routines added`,
      time: 'Just now',
      icon: '✦'
    }, ...current.activity].slice(0, 8),
    lastUndo: { label: `${template.name} setup applied`, snapshot: previous }
  });
  return { sections: sectionAdditions.length, chores: choreAdditions.length };
}

function choresFor(state, areaId, sectionId = null) {
  return state.tasks.filter(item => item.type === 'chore'
    && !item.completed
    && item.areaId === areaId
    && (sectionId === null || item.subareaId === sectionId));
}

function counts(chores) {
  return {
    total: chores.length,
    due: chores.filter(item => !item.paused && item.urgency === 'today').length,
    overdue: chores.filter(item => !item.paused && item.urgency === 'overdue').length,
    paused: chores.filter(item => item.paused).length
  };
}

function attention(chores) {
  return chores
    .filter(item => !item.paused && ['overdue', 'today'].includes(item.urgency))
    .sort((a, b) => Number(b.urgency === 'overdue') - Number(a.urgency === 'overdue') || (a.title || '').localeCompare(b.title || ''));
}

function later(chores) {
  return chores
    .filter(item => !item.paused && !['overdue', 'today'].includes(item.urgency) && normalize(item.recurrence) !== 'as needed')
    .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || (a.title || '').localeCompare(b.title || ''));
}

function asNeeded(chores) {
  return chores.filter(item => !item.paused && (normalize(item.recurrence) === 'as needed' || normalize(item.due) === 'as needed'));
}

function headerDate() {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
}

function dueText(item) {
  if (item.paused) return 'Paused';
  if (item.urgency === 'overdue') return item.due || 'Overdue';
  return item.due || 'No due date';
}

function choreRow(item, showLocation = false) {
  const location = showLocation ? [item.subarea || item.area].filter(Boolean).join(' · ') : '';
  const meta = [location, item.recurrence, item.minutes ? `${item.minutes} min` : ''].filter(Boolean).join(' · ');
  return `<div class="area-chore-row ${item.urgency === 'overdue' ? 'overdue' : ''} ${item.paused ? 'paused' : ''}">
    <button class="area-chore-check" data-action="request-complete" data-task-id="${item.id}" ${item.paused ? 'disabled' : ''} aria-label="Complete ${esc(item.title)}">✓</button>
    <button class="area-chore-content" data-route="item/${item.id}">
      <strong>${esc(item.title)}</strong>
      <small>${esc(meta || 'Recurring chore')}</small>
    </button>
    <span class="area-chore-due ${item.urgency === 'overdue' ? 'overdue' : ''}">${esc(dueText(item))}</span>
  </div>`;
}

function choreGroup(title, items, options = {}) {
  if (!items.length) return '';
  return `<section class="area-routine-group"><div class="section-heading"><h2>${esc(title)}</h2><span>${items.length}</span></div><div class="area-chore-list">${items.map(item => choreRow(item, options.showLocation)).join('')}</div></section>`;
}

function areaCard(area, state) {
  const chores = choresFor(state, area.id);
  const summary = counts(chores);
  const sections = area.subareas.filter(item => !item.archived);
  const next = attention(chores)[0] || later(chores)[0] || asNeeded(chores)[0];
  return `<article class="area-overview-card">
    <button class="area-overview-main" data-route="areas/${area.id}">
      <span class="area-card-icon">${area.icon}</span>
      <span class="area-overview-copy"><strong>${esc(area.name)}</strong><small>${summary.total} routine${summary.total === 1 ? '' : 's'} · ${sections.length} section${sections.length === 1 ? '' : 's'}</small>${next ? `<em>${summary.overdue ? `${summary.overdue} overdue · ` : summary.due ? `${summary.due} due · ` : 'Next · '}${esc(next.title)}</em>` : '<em>No routines set up yet</em>'}</span>
      <span class="area-overview-count ${summary.overdue ? 'overdue' : summary.due ? 'due' : ''}">${summary.overdue || summary.due || '✓'}</span>
    </button>
    <button class="area-card-menu" data-action="open-edit-area" data-area-id="${area.id}" aria-label="Edit ${esc(area.name)}">•••</button>
  </article>`;
}

export function renderAreas(state) {
  ensureAreasModel();
  const activeAreas = state.areas.filter(area => !area.archived);
  const allChores = activeAreas.flatMap(area => choresFor(state, area.id));
  const summary = counts(allChores);
  return `<header class="page-header areas-page-header"><div><p class="eyebrow">${headerDate()}</p><h1>Areas</h1><p>Recurring chores and maintenance. One-time Tasks stay separate.</p></div><button class="icon-button areas-add-top" data-action="open-add-area" aria-label="Add area">+</button></header>
    <section class="areas-attention-strip ${summary.overdue ? 'has-overdue' : ''}"><div><strong>${summary.due + summary.overdue ? `${summary.due + summary.overdue} need attention` : 'Everything is on track'}</strong><small>${summary.overdue ? `${summary.overdue} overdue · ` : ''}${summary.total} routines across ${activeAreas.length} areas</small></div><span>${summary.overdue || summary.due || '✓'}</span></section>
    <div class="area-overview-grid">${activeAreas.map(area => areaCard(area, state)).join('')}</div>
    <button class="areas-bottom-add" data-action="open-add-area"><span>+</span> Add area</button>`;
}

export function renderAreaDetail(state, areaId) {
  const area = state.areas.find(item => item.id === areaId && !item.archived);
  if (!area) return null;
  const chores = choresFor(state, area.id);
  const needsAttention = attention(chores);
  const sections = area.subareas.filter(item => !item.archived).sort((a, b) => a.order - b.order);
  const general = chores.filter(item => !item.subareaId);
  return `<header class="detail-header area-detail-header">
      <button class="icon-button" data-route="areas" aria-label="Back to Areas">←</button>
      <button class="detail-title area-title-button" data-action="open-edit-area" data-area-id="${area.id}"><span>${area.icon}</span><div><h1>${esc(area.name)}</h1><p>${chores.length} recurring routine${chores.length === 1 ? '' : 's'}</p></div></button>
      <button class="icon-button" data-action="open-add-chore-for-area" data-area-id="${area.id}" aria-label="Add chore">+</button>
    </header>
    ${needsAttention.length
      ? choreGroup('Needs attention', needsAttention, { showLocation: true })
      : `<section class="area-clear-card"><span>✓</span><div><strong>Nothing needs attention</strong><small>Upcoming routines are still tracked inside each Section.</small></div></section>`}
    <div class="section-heading"><h2>Sections</h2><span>${sections.length}</span></div>
    <div class="area-section-list">${sections.map(section => {
      const sectionChores = choresFor(state, area.id, section.id);
      const sectionSummary = counts(sectionChores);
      const next = attention(sectionChores)[0] || later(sectionChores)[0] || asNeeded(sectionChores)[0];
      return `<button class="area-section-card" data-route="areas/${area.id}/${section.id}">
        <span class="area-section-icon">${section.icon}</span>
        <span class="area-section-copy"><strong>${esc(section.name)}</strong><small>${sectionChores.length} routine${sectionChores.length === 1 ? '' : 's'}${next ? ` · ${esc(next.title)}` : ''}</small></span>
        <span class="area-section-status ${sectionSummary.overdue ? 'overdue' : sectionSummary.due ? 'due' : ''}">${sectionSummary.overdue ? `${sectionSummary.overdue} overdue` : sectionSummary.due ? `${sectionSummary.due} due` : 'Clear'}</span>
      </button>`;
    }).join('') || `<div class="area-empty-compact"><span>${area.icon}</span><strong>No Sections yet</strong><small>Add a Section, or keep routines in General ${esc(area.name)}.</small></div>`}</div>
    ${general.length ? choreGroup(`General ${area.name}`, [...attention(general), ...later(general), ...asNeeded(general)]) : ''}
    <div class="area-setup-actions">
      <button class="button primary" data-action="open-add-chore-for-area" data-area-id="${area.id}">+ Add chore</button>
      <button class="button" data-action="open-add-section" data-area-id="${area.id}">+ Add section</button>
      <button class="button" data-action="open-template-sheet" data-area-id="${area.id}">Use template</button>
      <button class="button ghost" data-action="open-edit-area" data-area-id="${area.id}">Edit area</button>
    </div>`;
}

export function renderSectionDetail(state, areaId, sectionId) {
  const area = state.areas.find(item => item.id === areaId && !item.archived);
  const section = area?.subareas.find(item => item.id === sectionId && !item.archived);
  if (!area || !section) return null;
  const chores = choresFor(state, areaId, sectionId);
  const due = attention(chores);
  const upcoming = later(chores);
  const available = asNeeded(chores);
  const paused = chores.filter(item => item.paused);
  return `<header class="detail-header area-detail-header">
      <button class="icon-button" data-route="areas/${area.id}" aria-label="Back to ${esc(area.name)}">←</button>
      <button class="detail-title area-title-button" data-action="open-edit-section" data-area-id="${area.id}" data-section-id="${section.id}"><span>${section.icon}</span><div><h1>${esc(section.name)}</h1><p>${esc(area.name)} · ${chores.length} routines</p></div></button>
      <button class="icon-button" data-action="open-add-chore-for-section" data-area-id="${area.id}" data-section-id="${section.id}" aria-label="Add chore">+</button>
    </header>
    <section class="section-routine-summary"><div><strong>${due.length}</strong><small>Need attention</small></div><div><strong>${upcoming.length}</strong><small>Coming up</small></div><div><strong>${available.length}</strong><small>As needed</small></div></section>
    ${choreGroup('Needs attention', due)}
    ${!due.length ? `<section class="area-clear-card"><span>✓</span><div><strong>${esc(section.name)} is clear</strong><small>Nothing is due or overdue right now.</small></div></section>` : ''}
    ${choreGroup('Coming up', upcoming)}
    ${choreGroup('As needed', available)}
    ${choreGroup('Paused', paused)}
    ${!chores.length ? `<div class="empty-state area-routine-empty"><div><div class="empty-state-icon">${section.icon}</div><h2>No routines yet</h2><p>Add recurring chores here. One-time Tasks remain in Tasks.</p></div></div>` : ''}
    <button class="areas-bottom-add" data-action="open-add-chore-for-section" data-area-id="${area.id}" data-section-id="${section.id}"><span>+</span> Add chore</button>`;
}

export function areaSheetMarkup(state, areaId = '') {
  ensureAreasModel();
  const area = state.areas.find(item => item.id === areaId);
  const editing = Boolean(area);
  const icons = ['🏠', '🚗', '👤', '💼', '📦', '🌳', '📍'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${editing ? 'Edit' : 'New'} area</p><h2>${editing ? esc(area.name) : 'Add an area'}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="area-name">Name</label><input class="input" id="area-name" value="${editing ? esc(area.name) : ''}" placeholder="House"></div>
    <div class="field"><label>Icon</label><div class="icon-choice-row">${icons.map(icon => `<button class="icon-choice ${(area?.icon || '📍') === icon ? 'selected' : ''}" data-action="select-area-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><input type="hidden" id="area-icon" value="${area?.icon || '📍'}"></div>
    ${editing ? '' : `<div class="field"><label for="area-template">Start from</label><select class="input" id="area-template"><option value="">Empty custom area</option>${store.getState().templates.map(template => `<option value="${template.id}">${template.icon} ${esc(template.name)}</option>`).join('')}</select></div><label class="toggle-row"><span><strong>Add suggested Sections</strong><small>Creates the template structure in one step.</small></span><input type="checkbox" id="include-suggested-sections" checked></label><label class="toggle-row"><span><strong>Add starter chores</strong><small>Adds only missing routines and staggers their first due dates.</small></span><input type="checkbox" id="include-starter-chores" checked></label>`}
    <button class="button primary block" data-action="save-area-v2" data-area-id="${areaId}">${editing ? 'Save changes' : 'Add area'}</button>
  </section></div>`;
}

export function sectionSheetMarkup(state, areaId, sectionId = '') {
  const area = state.areas.find(item => item.id === areaId);
  const section = area?.subareas.find(item => item.id === sectionId);
  const icons = ['🍳', '🛋️', '🍽️', '🛁', '🛏️', '💻', '🧺', '🧰', '🚪', '📍'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${section ? 'Edit' : 'New'} section</p><h2>${section ? esc(section.name) : `Add to ${esc(area?.name || 'area')}`}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="section-name">Name</label><input class="input" id="section-name" value="${section ? esc(section.name) : ''}" placeholder="Kitchen"></div>
    <div class="field"><label>Icon</label><div class="icon-choice-row">${icons.map(icon => `<button class="icon-choice ${(section?.icon || '🚪') === icon ? 'selected' : ''}" data-action="select-section-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><input type="hidden" id="section-icon" value="${section?.icon || '🚪'}"></div>
    <button class="button primary block" data-action="save-section" data-area-id="${areaId}" data-section-id="${sectionId}">${section ? 'Save changes' : 'Add section'}</button>
  </section></div>`;
}

export function templateSheetMarkup(state, areaId) {
  ensureAreasModel();
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Templates</p><h2>Add structure and routines</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <p class="sheet-intro">Templates add only missing Sections and chores. Existing setup stays untouched.</p>
    ${store.getState().templates.map(template => `<button class="template-option" data-action="apply-area-template-v2" data-area-id="${areaId}" data-template-id="${template.id}" ${(template.suggestedSubareas?.length || template.suggestedChores?.length) ? '' : 'disabled'}><span>${template.icon}</span><div><strong>${esc(template.name)}</strong><small>${template.suggestedSubareas?.length || 0} Sections · ${template.suggestedChores?.length || 0} starter chores</small><p>${esc(template.description || '')}</p></div></button>`).join('')}
  </section></div>`;
}