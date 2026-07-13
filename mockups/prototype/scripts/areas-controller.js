import { store } from './state.js';
import { router } from './router.js';
import { applyAreaTemplate, ensureAreasModel } from './areas.js';

const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');
let toastTimer = null;
let addContext = null;

const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

function showToast(message, undo = false) {
  clearTimeout(toastTimer);
  toastRoot.innerHTML = `<div class="toast ${undo ? 'action-toast' : ''}"><span>${esc(message)}</span>${undo ? '<button data-action="undo">UNDO</button>' : ''}</div>`;
  toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, undo ? 5200 : 2400);
}

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function dueState(option, recurrence) {
  if (option === 'as-needed' || recurrence === 'As needed') {
    return { due: 'As needed', dueDate: '', urgency: 'upcoming' };
  }
  const offsets = { today: 0, tomorrow: 1, week: 7 };
  const days = offsets[option] ?? 0;
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const dueDate = date.toISOString().slice(0, 10);
  if (days === 0) return { due: 'Today', dueDate, urgency: 'today' };
  if (days === 1) return { due: 'Tomorrow', dueDate, urgency: 'upcoming' };
  return {
    due: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
    dueDate,
    urgency: 'upcoming'
  };
}

function choreSheet(context) {
  const state = store.getState();
  const area = state.areas.find(item => item.id === context.areaId);
  const section = area?.subareas.find(item => item.id === context.sectionId);
  if (!area) return '';
  const sections = area.subareas.filter(item => !item.archived);
  const location = section
    ? `<div class="area-add-location"><small>Location</small><strong>${section.icon} ${esc(area.name)} › ${esc(section.name)}</strong></div>`
    : `<div class="field"><label for="area-chore-section">Section</label><select class="input" id="area-chore-section"><option value="">General ${esc(area.name)}</option>${sections.map(item => `<option value="${item.id}">${item.icon} ${esc(item.name)}</option>`).join('')}</select></div>`;
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet area-chore-sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${esc(area.name)}</p><h2>Add recurring chore${section ? ` to ${esc(section.name)}` : ''}</h2></div><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header>
    <div class="field"><label for="area-chore-title">Chore name</label><input class="input" id="area-chore-title" placeholder="Clean sink" autocomplete="off"></div>
    ${location}
    <div class="area-add-grid">
      <div class="field"><label for="area-chore-repeat">Repeat</label><select class="input" id="area-chore-repeat"><option>Weekly</option><option>Daily</option><option>Monthly</option><option>Every 30 days</option><option>Every 60 days</option><option>Every 90 days</option><option>As needed</option></select></div>
      <div class="field"><label for="area-chore-first-due">First due</label><select class="input" id="area-chore-first-due"><option value="today">Today</option><option value="tomorrow">Tomorrow</option><option value="week">Next week</option><option value="as-needed">As needed</option></select></div>
    </div>
    <details class="area-add-more"><summary>More options</summary><div class="area-add-more-grid"><div class="field"><label for="area-chore-minutes">Estimated minutes</label><input class="input" id="area-chore-minutes" type="number" min="1" max="240" value="10"></div><label class="toggle-row"><span><strong>Completion grading</strong><small>Offer Light, Moderate, and Deep when checking it off.</small></span><input type="checkbox" id="area-chore-grading"></label></div></details>
    <div class="area-add-buttons"><button class="button" data-action="save-area-chore-another">Add & another</button><button class="button primary" data-action="save-area-chore">Add chore</button></div>
  </section></div>`;
}

function openChoreSheet(context) {
  addContext = context;
  overlayRoot.innerHTML = choreSheet(context);
  requestAnimationFrame(() => document.querySelector('#area-chore-title')?.focus());
}

function saveChore(addAnother = false) {
  const input = document.querySelector('#area-chore-title');
  const title = input?.value.trim();
  if (!title) {
    input?.focus();
    showToast('Enter a chore name.');
    return;
  }
  const state = store.getState();
  const area = state.areas.find(item => item.id === addContext?.areaId);
  if (!area) return;
  const subareaId = addContext?.sectionId || document.querySelector('#area-chore-section')?.value || '';
  const section = area.subareas.find(item => item.id === subareaId);
  const recurrence = document.querySelector('#area-chore-repeat')?.value || 'Weekly';
  const firstDue = document.querySelector('#area-chore-first-due')?.value || 'today';
  store.addTask({
    id: `chore-${Date.now()}`,
    title,
    type: 'chore',
    areaId: area.id,
    subareaId,
    area: area.name,
    subarea: section?.name || '',
    minutes: Math.max(1, Number(document.querySelector('#area-chore-minutes')?.value) || 10),
    ...dueState(firstDue, recurrence),
    completed: false,
    grading: Boolean(document.querySelector('#area-chore-grading')?.checked),
    recurrence,
    nudge: true,
    scheduleBasis: 'completion',
    status: 'planned',
    createdAt: new Date().toISOString()
  });
  if (addAnother) {
    input.value = '';
    input.focus();
    showToast(`${title} added.`);
    return;
  }
  closeSheet();
  showToast(`${title} added.`, true);
}

function saveArea(target) {
  const name = document.querySelector('#area-name')?.value.trim();
  if (!name) {
    document.querySelector('#area-name')?.focus();
    showToast('Enter an area name.');
    return;
  }
  const areaId = target.dataset.areaId;
  const icon = document.querySelector('#area-icon')?.value || '📍';
  if (areaId) {
    store.updateArea(areaId, { name, icon });
    closeSheet();
    showToast(`${name} updated.`, true);
    return;
  }
  ensureAreasModel();
  const templateId = document.querySelector('#area-template')?.value || '';
  const includeChores = Boolean(document.querySelector('#include-starter-chores')?.checked && templateId);
  const includeSections = Boolean((document.querySelector('#include-suggested-sections')?.checked || includeChores) && templateId);
  const area = store.addArea({ name, icon, templateId, includeSuggestedSections: includeSections });
  let additions = { sections: 0, chores: 0 };
  if (templateId && includeChores) additions = applyAreaTemplate(area.id, templateId, { includeSections: false, includeChores: true });
  closeSheet();
  router.go(`areas/${area.id}`);
  showToast(includeChores ? `${name} added with ${additions.chores} starter chores.` : `${name} added.`, true);
}

function applyTemplate(target) {
  const result = applyAreaTemplate(target.dataset.areaId, target.dataset.templateId);
  closeSheet();
  if (!result.sections && !result.chores) showToast('Everything from this template is already added.');
  else showToast(`${result.sections} Sections and ${result.chores} chores added.`, true);
}

function syncTemplateSelection(select) {
  const template = store.getState().templates.find(item => item.id === select.value);
  if (!template) return;
  const name = document.querySelector('#area-name');
  if (name && !name.value.trim()) name.value = template.name;
  const icon = document.querySelector('#area-icon');
  if (icon) icon.value = template.icon;
  document.querySelectorAll('.icon-choice').forEach(button => button.classList.toggle('selected', button.dataset.icon === template.icon));
}

document.addEventListener('change', event => {
  if (event.target.id === 'area-template') syncTemplateSelection(event.target);
  if (event.target.id === 'area-chore-repeat' && event.target.value === 'As needed') {
    const due = document.querySelector('#area-chore-first-due');
    if (due) due.value = 'as-needed';
  }
}, { capture: true });

document.addEventListener('keydown', event => {
  if (event.target.id === 'area-chore-title' && event.key === 'Enter') {
    event.preventDefault();
    saveChore(true);
  }
}, { capture: true });

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (!['open-add-chore-for-area', 'open-add-chore-for-section', 'save-area-chore', 'save-area-chore-another', 'save-area-v2', 'apply-area-template-v2'].includes(action)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (action === 'open-add-chore-for-area') openChoreSheet({ areaId: target.dataset.areaId });
  if (action === 'open-add-chore-for-section') openChoreSheet({ areaId: target.dataset.areaId, sectionId: target.dataset.sectionId });
  if (action === 'save-area-chore') saveChore(false);
  if (action === 'save-area-chore-another') saveChore(true);
  if (action === 'save-area-v2') saveArea(target);
  if (action === 'apply-area-template-v2') applyTemplate(target);
}, { capture: true });