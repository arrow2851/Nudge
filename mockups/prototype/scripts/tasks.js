import { store } from './state.js';
import { router } from './router.js';
import { completeItem, updateTask } from './task-actions.js';

const screen = document.querySelector('#screen');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  search: '',
  area: 'all',
  type: 'all',
  priority: 'all',
  duration: 'all',
  sort: 'due',
  group: 'none',
  toastTimer: null,
  undoTimer: null
};

const views = [
  ['inbox', 'Inbox'],
  ['today', 'Today'],
  ['upcoming', 'Upcoming'],
  ['waiting', 'Waiting'],
  ['blocked', 'Blocked'],
  ['completed', 'Completed']
];

const priorityWeight = { high: 0, medium: 1, low: 2 };
const dueWeight = { overdue: 0, today: 1, upcoming: 2, none: 3 };
const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizedStatus(task) {
  if (task.completed || task.status === 'completed') return 'completed';
  if (['inbox', 'planned', 'waiting', 'blocked'].includes(task.status)) return task.status;
  if (task.type === 'task' && !task.due && !task.dueDate) return 'inbox';
  return 'planned';
}

function normalizeTask(task, index = 0) {
  const status = normalizedStatus(task);
  return {
    priority: 'medium',
    status,
    createdAt: task.createdAt || `2026-07-${String(Math.min(index + 1, 28)).padStart(2, '0')}T12:00:00.000Z`,
    archived: false,
    ...task,
    status,
    completed: status === 'completed' || Boolean(task.completed)
  };
}

function seedTasks() {
  return [
    {
      id: 'tasks-inbox-dentist', title: 'Book annual dental appointment', type: 'task',
      areaId: 'personal', subareaId: '', area: 'Personal', subarea: '', minutes: 10,
      due: '', urgency: 'none', status: 'inbox', priority: 'medium', completed: false,
      grading: false, recurrence: '', nudge: true, notes: '', prototypeSeed: true,
      createdAt: '2026-07-12T14:00:00.000Z'
    },
    {
      id: 'tasks-waiting-repair', title: 'Confirm car repair appointment', type: 'task',
      areaId: 'car', subareaId: '', area: 'Car', subarea: '', minutes: 5,
      due: 'Waiting', urgency: 'none', status: 'waiting', priority: 'medium', completed: false,
      grading: false, recurrence: '', nudge: false, notes: 'Waiting for the mechanic to call back.', prototypeSeed: true,
      createdAt: '2026-07-10T15:30:00.000Z'
    },
    {
      id: 'tasks-blocked-shelf', title: 'Install garage storage shelf', type: 'task',
      areaId: 'house', subareaId: 'garage', area: 'House', subarea: 'Garage', minutes: 45,
      due: 'Blocked', urgency: 'none', status: 'blocked', priority: 'high', completed: false,
      grading: false, recurrence: '', nudge: false, notes: 'Need wall anchors before starting.', prototypeSeed: true,
      createdAt: '2026-07-08T18:00:00.000Z'
    },
    {
      id: 'tasks-completed-filter', title: 'Order replacement air filters', type: 'task',
      areaId: 'house', subareaId: 'general', area: 'House', subarea: 'General House', minutes: 8,
      due: 'Completed', urgency: 'none', status: 'completed', priority: 'low', completed: true,
      completedAt: '2026-07-11T19:20:00.000Z', grading: false, recurrence: '', nudge: false,
      notes: '', prototypeSeed: true, createdAt: '2026-07-05T16:00:00.000Z'
    }
  ];
}

let ensuringModel = false;
function ensureTaskModel() {
  if (ensuringModel) return;
  const state = store.getState();
  const version = Number(state.preferences?.tasksModelVersion || 0);
  const normalized = state.tasks.map(normalizeTask);
  const shouldSeed = version < 1;
  const existing = new Set(normalized.map(task => task.id));
  const additions = shouldSeed ? seedTasks().filter(task => !existing.has(task.id)) : [];
  const changed = shouldSeed || normalized.some((task, index) => JSON.stringify(task) !== JSON.stringify(state.tasks[index]));
  if (!changed) return;
  ensuringModel = true;
  store.setState(current => ({
    tasks: [...normalized, ...additions],
    preferences: { ...current.preferences, tasksModelVersion: 1 }
  }));
  ensuringModel = false;
}

function currentView() {
  const [, view] = router.getRoute().split('/');
  return views.some(([key]) => key === view) ? view : 'today';
}

function countForView(tasks, view) {
  return tasks.filter(task => matchesView(task, view)).length;
}

function matchesView(task, view) {
  const status = normalizedStatus(task);
  if (view === 'inbox') return status === 'inbox' && !task.archived;
  if (view === 'today') return status === 'planned' && !task.paused && ['today', 'overdue'].includes(task.urgency);
  if (view === 'upcoming') return status === 'planned' && !task.paused && task.urgency === 'upcoming';
  if (view === 'waiting') return status === 'waiting';
  if (view === 'blocked') return status === 'blocked';
  if (view === 'completed') return status === 'completed';
  return false;
}

function matchesFilters(task) {
  const text = `${task.title} ${task.area || ''} ${task.subarea || ''} ${task.notes || ''}`.toLowerCase();
  if (ui.search && !text.includes(ui.search.toLowerCase())) return false;
  if (ui.area !== 'all' && task.areaId !== ui.area) return false;
  if (ui.type !== 'all' && task.type !== ui.type) return false;
  if (ui.priority !== 'all' && task.priority !== ui.priority) return false;
  if (ui.duration === 'quick' && Number(task.minutes || 0) > 10) return false;
  if (ui.duration === 'medium' && (Number(task.minutes || 0) <= 10 || Number(task.minutes || 0) > 30)) return false;
  if (ui.duration === 'long' && Number(task.minutes || 0) <= 30) return false;
  return true;
}

function dueSortValue(task) {
  const urgency = dueWeight[task.urgency] ?? 3;
  const date = task.dueDate ? new Date(`${task.dueDate}T12:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
  return urgency * 1e15 + date;
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (ui.sort === 'priority') return (priorityWeight[a.priority] ?? 1) - (priorityWeight[b.priority] ?? 1) || dueSortValue(a) - dueSortValue(b);
    if (ui.sort === 'shortest') return Number(a.minutes || 0) - Number(b.minutes || 0) || dueSortValue(a) - dueSortValue(b);
    if (ui.sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (ui.sort === 'title') return a.title.localeCompare(b.title);
    return dueSortValue(a) - dueSortValue(b) || (priorityWeight[a.priority] ?? 1) - (priorityWeight[b.priority] ?? 1);
  });
}

function groupLabel(task) {
  if (ui.group === 'area') return task.area || 'Unassigned';
  if (ui.group === 'priority') return `${task.priority[0].toUpperCase()}${task.priority.slice(1)} priority`;
  if (ui.group === 'date') {
    if (task.urgency === 'overdue') return 'Overdue';
    if (task.urgency === 'today') return 'Today';
    if (task.urgency === 'upcoming') return task.due || 'Upcoming';
    return 'No due date';
  }
  return '';
}

function groupTasks(tasks) {
  if (ui.group === 'none') return [['', tasks]];
  const map = new Map();
  tasks.forEach(task => {
    const label = groupLabel(task);
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(task);
  });
  return [...map.entries()];
}

function statusLabel(task) {
  const status = normalizedStatus(task);
  return { inbox: 'Inbox', planned: task.urgency === 'overdue' ? 'Overdue' : task.due || 'Planned', waiting: 'Waiting', blocked: 'Blocked', completed: 'Completed' }[status];
}

function taskCard(task) {
  const location = [task.area, task.subarea].filter(Boolean).join(' › ') || 'Unassigned';
  const canComplete = !task.completed && !['waiting', 'blocked'].includes(normalizedStatus(task));
  return `<article class="task-card-row ${task.urgency === 'overdue' ? 'overdue' : ''}">
    <button class="task-card-main" data-route="item/${task.id}">
      <span class="priority-marker ${esc(task.priority)}" aria-label="${esc(task.priority)} priority"></span>
      <span class="task-card-copy"><strong>${esc(task.title)}</strong><small>${esc(location)} · ${Number(task.minutes || 0)} min</small><span class="task-badge-row"><i>${esc(statusLabel(task))}</i><i>${task.type === 'chore' ? 'Chore' : 'Task'}</i>${task.priority === 'high' ? '<i class="high">High priority</i>' : ''}</span></span>
      <span class="task-card-arrow">›</span>
    </button>
    <div class="task-card-actions">
      ${canComplete ? `<button class="task-row-action complete" data-action="tasks-complete" data-task-id="${task.id}" aria-label="Complete ${esc(task.title)}">✓</button>` : ''}
      <button class="task-row-action" data-action="open-task-status" data-task-id="${task.id}" aria-label="Change status for ${esc(task.title)}">•••</button>
    </div>
  </article>`;
}

function emptyState(view, filtered) {
  const copy = filtered
    ? ['No matching items', 'Try clearing a filter or changing your search.']
    : {
        inbox: ['Inbox is clear', 'New unscheduled tasks will appear here.'],
        today: ['Nothing due today', 'There are no open or overdue items in this view.'],
        upcoming: ['Nothing upcoming', 'Scheduled work will appear here.'],
        waiting: ['Nothing waiting', 'Tasks that depend on someone else will appear here.'],
        blocked: ['Nothing blocked', 'Tasks that cannot proceed will appear here.'],
        completed: ['No completed items', 'Finished work will appear here.']
      }[view];
  return `<div class="tasks-empty"><span>✓</span><h2>${copy[0]}</h2><p>${copy[1]}</p>${filtered ? '<button class="button" data-action="clear-task-filters">Clear filters</button>' : ''}</div>`;
}

function activeFilterCount() {
  return [ui.area, ui.type, ui.priority, ui.duration].filter(value => value !== 'all').length;
}

function renderTasks() {
  if (router.getRoute().split('/')[0] !== 'tasks') return;
  const state = store.getState();
  const view = currentView();
  const allTasks = state.tasks.filter(task => !task.archived);
  const viewTasks = allTasks.filter(task => matchesView(task, view));
  const visible = sortTasks(viewTasks.filter(matchesFilters));
  const groups = groupTasks(visible);
  const filtered = Boolean(ui.search || activeFilterCount());
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  screen.innerHTML = `<header class="page-header tasks-header"><div><p class="eyebrow">${date}</p><h1>Tasks</h1><p>Plan, track, and resolve actionable work.</p></div><button class="button primary compact-button" data-action="open-task-create">+ Add task</button></header>
    <nav class="task-view-tabs" aria-label="Task views">${views.map(([key, label]) => `<button class="${view === key ? 'active' : ''}" data-route="tasks/${key}"><span>${label}</span><b>${countForView(allTasks, key)}</b></button>`).join('')}</nav>
    <div class="task-search-row"><label class="task-search"><span>⌕</span><input id="task-search-input" value="${esc(ui.search)}" placeholder="Search this view" aria-label="Search tasks"></label><button class="task-control ${activeFilterCount() ? 'active' : ''}" data-action="open-task-filters">Filter${activeFilterCount() ? ` (${activeFilterCount()})` : ''}</button><button class="task-control" data-action="open-task-sort">Sort</button></div>
    <div class="tasks-result-summary"><span>${visible.length} ${visible.length === 1 ? 'item' : 'items'}</span><span>${esc(ui.sort === 'due' ? 'Due order' : ui.sort)}${ui.group !== 'none' ? ` · Grouped by ${esc(ui.group)}` : ''}</span></div>
    <div class="task-groups">${visible.length ? groups.map(([label, tasks]) => `<section class="task-group">${label ? `<div class="task-group-heading"><h2>${esc(label)}</h2><span>${tasks.length}</span></div>` : ''}<div class="task-card-list">${tasks.map(taskCard).join('')}</div></section>`).join('') : emptyState(view, filtered)}</div>`;
}

function sectionOptions(state, areaId, selected = '') {
  const area = state.areas.find(item => item.id === areaId);
  return `<option value="">No section</option>${(area?.subareas || []).filter(item => !item.archived).map(item => `<option value="${item.id}" ${item.id === selected ? 'selected' : ''}>${item.icon} ${esc(item.name)}</option>`).join('')}`;
}

function taskCreateSheet() {
  const state = store.getState();
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet task-create-sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Tasks</p><h2>Add a one-time task</h2></div><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header>
    <div class="field"><label for="create-task-title">Task</label><input class="input" id="create-task-title" placeholder="Return package" autocomplete="off"></div>
    <div class="two-field-grid"><div class="field"><label for="create-task-status">Starting status</label><select class="input" id="create-task-status"><option value="inbox">Inbox</option><option value="planned">Planned</option><option value="waiting">Waiting</option><option value="blocked">Blocked</option></select></div><div class="field"><label for="create-task-priority">Priority</label><select class="input" id="create-task-priority"><option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option></select></div></div>
    <div class="two-field-grid"><div class="field"><label for="create-task-due">Due</label><select class="input" id="create-task-due"><option value="none">No due date</option><option value="today">Today</option><option value="tomorrow">Tomorrow</option><option value="weekend">This weekend</option><option value="custom">Choose date</option></select></div><div class="field"><label for="create-task-date">Date</label><input class="input" id="create-task-date" type="date" disabled></div></div>
    <div class="two-field-grid"><div class="field"><label for="create-task-area">Area</label><select class="input" id="create-task-area"><option value="">Unassigned</option>${state.areas.filter(area => !area.archived).map(area => `<option value="${area.id}">${area.icon} ${esc(area.name)}</option>`).join('')}</select></div><div class="field"><label for="create-task-section">Section</label><select class="input" id="create-task-section" disabled><option value="">No section</option></select></div></div>
    <div class="field"><label for="create-task-minutes">Estimated minutes</label><input class="input" id="create-task-minutes" type="number" min="1" value="10"></div>
    <div class="field"><label for="create-task-notes">Notes</label><textarea class="input textarea" id="create-task-notes" placeholder="Optional context"></textarea></div>
    <label class="toggle-row"><span><strong>Include in nudges</strong><small>Allow this task to be suggested later</small></span><input id="create-task-nudge" type="checkbox" checked></label>
    <button class="button primary block" data-action="save-created-task">Add task</button>
  </section></div>`;
}

function filterSheet() {
  const state = store.getState();
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Tasks</p><h2>Filter this view</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="task-filter-area">Area</label><select class="input" id="task-filter-area"><option value="all">All areas</option>${state.areas.filter(area => !area.archived).map(area => `<option value="${area.id}" ${ui.area === area.id ? 'selected' : ''}>${area.icon} ${esc(area.name)}</option>`).join('')}</select></div>
    <div class="field"><label for="task-filter-type">Type</label><select class="input" id="task-filter-type"><option value="all">Tasks and chores</option><option value="task" ${ui.type === 'task' ? 'selected' : ''}>Tasks only</option><option value="chore" ${ui.type === 'chore' ? 'selected' : ''}>Chores only</option></select></div>
    <div class="field"><label for="task-filter-priority">Priority</label><select class="input" id="task-filter-priority"><option value="all">All priorities</option>${['high', 'medium', 'low'].map(value => `<option value="${value}" ${ui.priority === value ? 'selected' : ''}>${value[0].toUpperCase()}${value.slice(1)}</option>`).join('')}</select></div>
    <div class="field"><label for="task-filter-duration">Duration</label><select class="input" id="task-filter-duration"><option value="all">Any duration</option><option value="quick" ${ui.duration === 'quick' ? 'selected' : ''}>10 minutes or less</option><option value="medium" ${ui.duration === 'medium' ? 'selected' : ''}>11–30 minutes</option><option value="long" ${ui.duration === 'long' ? 'selected' : ''}>More than 30 minutes</option></select></div>
    <div class="sheet-action-row"><button class="button" data-action="clear-task-filters">Clear</button><button class="button primary" data-action="apply-task-filters">Apply filters</button></div>
  </section></div>`;
}

function sortSheet() {
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Tasks</p><h2>Sort and group</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="task-sort">Sort by</label><select class="input" id="task-sort">${[['due', 'Due date'], ['priority', 'Priority'], ['shortest', 'Shortest first'], ['newest', 'Recently added'], ['title', 'Title']].map(([value, label]) => `<option value="${value}" ${ui.sort === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
    <div class="field"><label for="task-group">Group by</label><select class="input" id="task-group">${[['none', 'No grouping'], ['date', 'Due date'], ['area', 'Area'], ['priority', 'Priority']].map(([value, label]) => `<option value="${value}" ${ui.group === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div>
    <button class="button primary block" data-action="apply-task-sort">Apply</button>
  </section></div>`;
}

function statusSheet(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return '';
  const options = [['inbox', 'Inbox', 'Remove the due date'], ['planned', 'Planned', 'Keep it active'], ['waiting', 'Waiting', 'Depends on someone else'], ['blocked', 'Blocked', 'Cannot proceed yet']];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${esc(task.title)}</p><h2>Change status</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>${options.map(([value, label, copy]) => `<button class="grade-option" data-action="set-task-status" data-task-id="${taskId}" data-status="${value}"><span class="grade-badge">${label[0]}</span><span><strong>${label}</strong><small>${copy}</small></span></button>`).join('')}</section></div>`;
}

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function showToast(message, allowUndo = false) {
  clearTimeout(ui.toastTimer);
  clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${allowUndo ? 'action-toast' : ''}"><span>${esc(message)}</span>${allowUndo ? '<button data-action="tasks-undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, allowUndo ? 5200 : 2400);
  if (allowUndo) ui.undoTimer = setTimeout(() => store.clearUndo(), 5500);
}

function dueFromForm() {
  const choice = document.querySelector('#create-task-due')?.value || 'none';
  const custom = document.querySelector('#create-task-date')?.value || '';
  if (choice === 'today') return { due: 'Today', urgency: 'today', dueDate: new Date().toISOString().slice(0, 10) };
  if (choice === 'tomorrow') {
    const date = new Date(Date.now() + 86400000);
    return { due: 'Tomorrow', urgency: 'upcoming', dueDate: date.toISOString().slice(0, 10) };
  }
  if (choice === 'weekend') return { due: 'This weekend', urgency: 'upcoming', dueDate: '' };
  if (choice === 'custom' && custom) {
    const target = new Date(`${custom}T12:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const compare = new Date(target); compare.setHours(0, 0, 0, 0);
    const diff = Math.round((compare - today) / 86400000);
    return { due: diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(target), urgency: diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'upcoming', dueDate: custom };
  }
  return { due: '', urgency: 'none', dueDate: '' };
}

function saveCreatedTask() {
  const title = document.querySelector('#create-task-title')?.value.trim();
  if (!title) {
    document.querySelector('#create-task-title')?.focus();
    showToast('Enter a task name.');
    return;
  }
  let status = document.querySelector('#create-task-status')?.value || 'inbox';
  const due = dueFromForm();
  if (status === 'planned' && due.urgency === 'none') status = 'inbox';
  if (status === 'inbox' && due.urgency !== 'none') status = 'planned';
  if (['waiting', 'blocked'].includes(status)) {
    due.due = status === 'waiting' ? 'Waiting' : 'Blocked';
    due.urgency = 'none';
    due.dueDate = '';
  }
  const state = store.getState();
  const areaId = document.querySelector('#create-task-area')?.value || '';
  const subareaId = document.querySelector('#create-task-section')?.value || '';
  const area = state.areas.find(item => item.id === areaId);
  const section = area?.subareas.find(item => item.id === subareaId);
  store.addTask({
    id: `task-${Date.now()}`,
    title,
    type: 'task',
    areaId,
    subareaId,
    area: area?.name || '',
    subarea: section?.name || '',
    minutes: Math.max(1, Number(document.querySelector('#create-task-minutes')?.value) || 10),
    ...due,
    status,
    priority: document.querySelector('#create-task-priority')?.value || 'medium',
    completed: false,
    grading: false,
    recurrence: '',
    nudge: ['waiting', 'blocked'].includes(status) ? false : Boolean(document.querySelector('#create-task-nudge')?.checked),
    notes: document.querySelector('#create-task-notes')?.value.trim() || '',
    createdAt: new Date().toISOString()
  });
  closeSheet();
  router.go(status === 'inbox' ? 'tasks/inbox' : status === 'waiting' ? 'tasks/waiting' : status === 'blocked' ? 'tasks/blocked' : due.urgency === 'upcoming' ? 'tasks/upcoming' : 'tasks/today');
  showToast(`${title} added.`, true);
}

function setStatus(taskId, status) {
  const changes = { status, completed: status === 'completed' };
  if (status === 'inbox') Object.assign(changes, { due: '', dueDate: '', urgency: 'none', snoozedUntil: '' });
  if (status === 'planned') {
    const task = store.getState().tasks.find(item => item.id === taskId);
    Object.assign(changes, task?.due ? { urgency: task.urgency === 'none' ? 'today' : task.urgency } : { due: 'Today', urgency: 'today' });
  }
  if (status === 'waiting') Object.assign(changes, { due: 'Waiting', dueDate: '', urgency: 'none', nudge: false });
  if (status === 'blocked') Object.assign(changes, { due: 'Blocked', dueDate: '', urgency: 'none', nudge: false });
  updateTask(taskId, changes);
  closeSheet();
  showToast('Status updated.', true);
}

function saveExtendedEdit(taskId) {
  const title = document.querySelector('#edit-task-title')?.value.trim();
  if (!title) {
    showToast('Enter a title.');
    return;
  }
  const state = store.getState();
  const areaId = document.querySelector('#edit-task-area')?.value || '';
  const subareaId = document.querySelector('#edit-task-section')?.value || '';
  const area = state.areas.find(item => item.id === areaId);
  const section = area?.subareas.find(item => item.id === subareaId);
  const status = document.querySelector('#edit-task-status')?.value || normalizedStatus(state.tasks.find(item => item.id === taskId) || {});
  updateTask(taskId, {
    title,
    minutes: Math.max(1, Number(document.querySelector('#edit-task-minutes')?.value) || 5),
    recurrence: document.querySelector('#edit-task-recurrence')?.value || '',
    notes: document.querySelector('#edit-task-notes')?.value.trim() || '',
    nudge: Boolean(document.querySelector('#edit-task-nudge')?.checked),
    priority: document.querySelector('#edit-task-priority')?.value || 'medium',
    status,
    completed: status === 'completed',
    areaId,
    subareaId,
    area: area?.name || '',
    subarea: section?.name || ''
  });
  closeSheet();
  showToast('Changes saved.', true);
}

function refreshSectionSelect(areaSelectId, sectionSelectId, selected = '') {
  const areaId = document.querySelector(`#${areaSelectId}`)?.value || '';
  const select = document.querySelector(`#${sectionSelectId}`);
  if (!select) return;
  select.innerHTML = sectionOptions(store.getState(), areaId, selected);
  select.disabled = !areaId;
}

function clearFilters() {
  ui.area = 'all';
  ui.type = 'all';
  ui.priority = 'all';
  ui.duration = 'all';
  ui.search = '';
  closeSheet();
  renderTasks();
}

function handleClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'open-task-create') {
    overlayRoot.innerHTML = taskCreateSheet();
    requestAnimationFrame(() => document.querySelector('#create-task-title')?.focus());
  }
  if (action === 'save-created-task') saveCreatedTask();
  if (action === 'open-task-filters') overlayRoot.innerHTML = filterSheet();
  if (action === 'apply-task-filters') {
    ui.area = document.querySelector('#task-filter-area')?.value || 'all';
    ui.type = document.querySelector('#task-filter-type')?.value || 'all';
    ui.priority = document.querySelector('#task-filter-priority')?.value || 'all';
    ui.duration = document.querySelector('#task-filter-duration')?.value || 'all';
    closeSheet();
    renderTasks();
  }
  if (action === 'clear-task-filters') clearFilters();
  if (action === 'open-task-sort') overlayRoot.innerHTML = sortSheet();
  if (action === 'apply-task-sort') {
    ui.sort = document.querySelector('#task-sort')?.value || 'due';
    ui.group = document.querySelector('#task-group')?.value || 'none';
    closeSheet();
    renderTasks();
  }
  if (action === 'open-task-status') overlayRoot.innerHTML = statusSheet(target.dataset.taskId);
  if (action === 'set-task-status') setStatus(target.dataset.taskId, target.dataset.status);
  if (action === 'tasks-complete') {
    const task = store.getState().tasks.find(item => item.id === target.dataset.taskId);
    if (task && completeItem(task.id)) showToast(`${task.title} completed.`, true);
  }
  if (action === 'tasks-undo') {
    if (store.undoLast()) showToast('Last change undone.');
  }
}

document.addEventListener('click', handleClick);
document.addEventListener('click', event => {
  const target = event.target.closest('[data-action="save-task-edit"]');
  if (!target) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  saveExtendedEdit(target.dataset.taskId);
}, true);

document.addEventListener('input', event => {
  if (event.target.id === 'task-search-input') {
    ui.search = event.target.value;
    renderTasks();
    requestAnimationFrame(() => {
      const input = document.querySelector('#task-search-input');
      if (input) {
        input.focus();
        input.setSelectionRange(ui.search.length, ui.search.length);
      }
    });
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'create-task-area') refreshSectionSelect('create-task-area', 'create-task-section');
  if (event.target.id === 'create-task-due') {
    const date = document.querySelector('#create-task-date');
    if (date) date.disabled = event.target.value !== 'custom';
  }
  if (event.target.id === 'edit-task-area') refreshSectionSelect('edit-task-area', 'edit-task-section');
});

window.addEventListener('hashchange', () => requestAnimationFrame(renderTasks));
store.subscribe(() => {
  ensureTaskModel();
  requestAnimationFrame(renderTasks);
});

ensureTaskModel();
requestAnimationFrame(renderTasks);
