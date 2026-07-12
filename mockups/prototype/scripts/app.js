import { store } from './state.js';
import { router } from './router.js';
import {
  renderAreas,
  renderAreaDetail,
  renderRoomDetail,
  areaSheetMarkup,
  roomSheetMarkup,
  templateSheetMarkup
} from './areas.js';

const screen = document.querySelector('#screen');
const bottomNav = document.querySelector('#bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  overdueExpanded: false,
  quickAddType: 'task',
  quickAddContext: null,
  toastTimer: null,
  undoTimer: null,
  resetSession: null
};

const icons = {
  today: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V20H4Z"/><path d="M9 20v-6h6v6"/></svg>',
  areas: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
  lists: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12h3M4 18h3"/></svg>',
  tasks: '<svg viewBox="0 0 24 24"><path d="M7 4h10v16H7z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>'
};

const navItems = [
  ['today', 'Today'],
  ['areas', 'Areas'],
  ['add-space', ''],
  ['lists', 'Lists'],
  ['tasks', 'Tasks']
];

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function pageHeader(title, subtitle, actions = true) {
  return `<header class="page-header">
    <div><p class="eyebrow">${new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h1>${title}</h1><p>${subtitle}</p></div>
    ${actions ? '<div class="header-actions"><button class="icon-button" data-action="search" aria-label="Search">⌕</button><button class="icon-button" data-route="more" aria-label="More">•••</button></div>' : ''}
  </header>`;
}

function locationText(task) {
  return [task.area, task.subarea].filter(Boolean).join(' › ');
}

function taskRow(task, overdue = false) {
  return `<button class="list-row ${overdue ? 'overdue' : ''}" data-action="request-complete" data-task-id="${task.id}">
    <span class="task-check">○</span>
    <span class="row-content"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(locationText(task))}${task.recurrence ? ` · ${escapeHtml(task.recurrence)}` : ''}</small>${overdue ? `<span class="due-label">${escapeHtml(task.due)}</span>` : ''}</span>
    <span class="row-meta">${task.minutes}m</span>
  </button>`;
}

function renderToday(state) {
  const openTasks = state.tasks.filter(task => !task.completed);
  const todayTasks = openTasks.filter(task => task.urgency === 'today');
  const overdueTasks = openTasks.filter(task => task.urgency === 'overdue');
  const quickCandidates = openTasks.filter(task => task.nudge);
  const quickWin = quickCandidates.length ? quickCandidates[state.quickWinIndex % quickCandidates.length] : null;
  const percentage = state.progress.totalToday ? Math.round((state.progress.completedToday / state.progress.totalToday) * 100) : 100;

  return `${pageHeader('Today', `Good morning, ${escapeHtml(state.user.name)}`)}
    <div class="today-stack">
      <section class="card soft" aria-label="Daily progress">
        <div class="progress-summary"><div><strong>${state.progress.completedToday} completed today</strong><div class="row-meta">A small task is enough.</div></div><strong>${state.progress.completedToday} / ${state.progress.totalToday}</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width:${percentage}%"></div></div>
      </section>
      <div class="section-heading"><h2>Quick Win</h2><span>${quickWin ? `${quickWin.minutes} min` : 'All clear'}</span></div>
      ${quickWin ? `<section class="card accent quick-win-card"><p class="eyebrow" style="color:inherit;opacity:.82">Recommended now</p><h2 style="position:relative;z-index:1;margin:.2rem 0 .35rem;font-size:1.45rem">${escapeHtml(quickWin.title)}</h2><p style="position:relative;z-index:1;margin:0 0 .8rem;opacity:.8">${escapeHtml(locationText(quickWin))}</p><div class="quick-win-meta"><span>${quickWin.minutes} minutes</span><span>${quickWin.type === 'chore' ? 'Chore' : 'Task'}</span>${quickWin.urgency === 'overdue' ? '<span>Overdue</span>' : '<span>Due today</span>'}</div><div class="quick-win-actions"><button class="button" data-action="start-task" data-task-id="${quickWin.id}">Start task</button><button class="button secondary-on-accent" data-action="request-complete" data-task-id="${quickWin.id}">Done</button><button class="button secondary-on-accent" data-action="cycle-quick-win">Another</button></div></section>` : `<section class="card"><strong>Nothing urgent right now.</strong><p class="row-meta">Add something new or review your backlog.</p></section>`}
      <div class="section-heading"><h2>Due today</h2><span>${todayTasks.length}</span></div>
      <section class="card today-list-card">${todayTasks.map(task => taskRow(task)).join('') || '<div class="empty-state" style="min-height:180px"><div><div class="empty-state-icon">✓</div><h2>Everything is done</h2><p>Your Today list is clear.</p></div></div>'}</section>
      <div class="section-heading"><h2>Overdue</h2><span>${overdueTasks.length}</span></div>
      <section class="card today-list-card"><button class="collapse-button" data-action="toggle-overdue" aria-expanded="${ui.overdueExpanded}"><span>${overdueTasks.length ? 'Review overdue tasks' : 'Nothing overdue'}</span><span>⌄</span></button>${ui.overdueExpanded ? overdueTasks.map(task => taskRow(task, true)).join('') : ''}</section>
      <div class="section-heading"><h2>Lists</h2><span>Quick access</span></div>
      <div class="list-shortcuts">${state.lists.map(list => `<button class="list-shortcut" data-route="lists" data-list-id="${list.id}"><span class="list-shortcut-icon">${list.icon}</span><strong>${escapeHtml(list.name)}</strong><small>${list.activeCount} active · ${escapeHtml(list.subtitle)}</small></button>`).join('')}</div>
      <div class="section-heading"><h2>Recent</h2><span>${state.activity.length}</span></div>
      <section class="card activity-card">${state.activity.slice(0, 4).map(item => `<div class="activity-row"><span class="activity-icon">${item.icon}</span><span class="activity-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span><span class="activity-time">${escapeHtml(item.time)}</span></div>`).join('')}</section>
    </div>`;
}

function placeholder(route) {
  const details = {
    lists: ['Lists', 'Reusable lists and remembered items.', '☷'],
    tasks: ['Tasks', 'One-time work, upcoming items, and waiting states.', '✓'],
    more: ['More', 'Settings, templates, insights, and supporting tools.', '•••']
  }[route] || ['Nudge', 'This route is ready for implementation.', 'N'];
  return `${pageHeader(details[0], details[1], route !== 'more')}<div class="empty-state"><div><div class="empty-state-icon">${details[2]}</div><h2>Foundation ready</h2><p>This destination is connected to the shared shell and is ready for its feature implementation.</p><button class="button primary" data-action="open-quick-add">Open Quick Add</button></div></div>`;
}

function renderResetSession(state) {
  const session = ui.resetSession;
  if (!session) return '';
  const area = state.areas.find(item => item.id === session.areaId);
  const room = area?.subareas.find(item => item.id === session.roomId);
  const task = state.tasks.find(item => item.id === session.taskIds[session.index]);
  if (!area || !room || !task) return '';
  const progress = session.index + 1;
  return `<div class="reset-screen"><header class="reset-header"><button class="icon-button" data-action="exit-room-reset">✕</button><div><strong>${escapeHtml(room.name)} Reset</strong><small>${progress} of ${session.taskIds.length}</small></div><span></span></header><div class="reset-progress"><span style="width:${Math.round(progress / session.taskIds.length * 100)}%"></span></div><main class="reset-main"><p class="eyebrow">Current task</p><h1>${escapeHtml(task.title)}</h1><p>${task.minutes} minutes · ${task.type === 'chore' ? 'Chore' : 'Task'}</p><button class="button primary block" data-action="complete-reset-task" data-task-id="${task.id}">Complete</button><button class="button ghost block" data-action="skip-reset-task">Skip</button></main><footer class="reset-up-next"><strong>Up next</strong>${session.taskIds.slice(session.index + 1, session.index + 4).map(id => { const next = state.tasks.find(item => item.id === id); return next ? `<span>${escapeHtml(next.title)}</span>` : ''; }).join('') || '<span>Finish the reset</span>'}</footer></div>`;
}

function renderNav(route) {
  const root = route.split('/')[0];
  bottomNav.innerHTML = navItems.map(([key, label]) => {
    if (key === 'add-space') return '<span class="nav-item add-space" aria-hidden="true">Add</span>';
    return `<button class="nav-item ${root === key ? 'active' : ''}" data-route="${key}">${icons[key]}<span>${label}</span></button>`;
  }).join('');
}

function render() {
  const route = router.getRoute();
  const [root, areaId, roomId] = route.split('/');
  const state = store.getState();
  document.documentElement.dataset.theme = state.user.theme;

  if (ui.resetSession) {
    screen.innerHTML = renderResetSession(state);
    bottomNav.innerHTML = '';
    document.querySelector('.fab').hidden = true;
    return;
  }

  document.querySelector('.fab').hidden = false;
  if (root === 'today') screen.innerHTML = renderToday(state);
  else if (root === 'areas' && roomId) screen.innerHTML = renderRoomDetail(state, areaId, roomId) || renderAreas(state, pageHeader);
  else if (root === 'areas' && areaId) screen.innerHTML = renderAreaDetail(state, areaId, pageHeader) || renderAreas(state, pageHeader);
  else if (root === 'areas') screen.innerHTML = renderAreas(state, pageHeader);
  else screen.innerHTML = placeholder(root);
  renderNav(route);
}

function showToast(message, allowUndo = false) {
  window.clearTimeout(ui.toastTimer);
  window.clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${allowUndo ? 'action-toast' : ''}"><span>${escapeHtml(message)}</span>${allowUndo ? '<button data-action="undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = window.setTimeout(() => { toastRoot.innerHTML = ''; }, allowUndo ? 5200 : 2400);
  if (allowUndo) ui.undoTimer = window.setTimeout(() => store.clearUndo(), 5500);
}

function closeSheet() { overlayRoot.innerHTML = ''; }

function parseQuickAdd(text, selectedType = ui.quickAddType) {
  const lower = text.toLowerCase();
  let type = selectedType;
  if (/\b(buy|grocery|groceries|milk|eggs|bread)\b/.test(lower) && selectedType === 'task') type = 'list';
  if (/\b(clean|wash|vacuum|mop|trash|replace filter)\b/.test(lower)) type = 'chore';
  let area = 'Personal';
  let areaId = 'personal';
  let subarea = '';
  let subareaId = '';
  const locations = [
    ['kitchen', 'House', 'house', 'Kitchen', 'kitchen'], ['bathroom', 'House', 'house', 'Bathroom', 'bathroom'], ['bedroom', 'House', 'house', 'Bedroom', 'bedroom'], ['garage', 'House', 'house', 'Garage', 'garage'], ['car', 'Car', 'car', '', ''], ['work', 'Work', 'work', '', '']
  ];
  locations.forEach(([word, detectedArea, detectedAreaId, detectedSubarea, detectedSubareaId]) => {
    if (lower.includes(word)) { area = detectedArea; areaId = detectedAreaId; subarea = detectedSubarea; subareaId = detectedSubareaId; }
  });
  if (ui.quickAddContext?.areaId) {
    const contextArea = store.getState().areas.find(item => item.id === ui.quickAddContext.areaId);
    const contextRoom = contextArea?.subareas.find(item => item.id === ui.quickAddContext.roomId);
    area = contextArea?.name || area;
    areaId = contextArea?.id || areaId;
    subarea = contextRoom?.name || '';
    subareaId = contextRoom?.id || '';
  }
  let recurrence = '';
  if (lower.includes('daily') || lower.includes('every day')) recurrence = 'Daily';
  else if (lower.includes('weekly') || lower.includes('every week')) recurrence = 'Weekly';
  else if (lower.includes('monthly') || lower.includes('every month')) recurrence = 'Monthly';
  const minuteMatch = lower.match(/(\d+)\s*(?:min|minute)/);
  const minutes = minuteMatch ? Number(minuteMatch[1]) : type === 'chore' ? 10 : 5;
  const grading = type === 'chore' && /\b(clean|wash|vacuum|mop|organize|wipe)\b/.test(lower);
  return { type, area, areaId, subarea, subareaId, recurrence, minutes, grading };
}

function detectedMarkup(parsed) {
  return `<small>Detected</small><div class="chip-row"><span class="chip selected">${parsed.type === 'list' ? 'List item' : parsed.type[0].toUpperCase() + parsed.type.slice(1)}</span><span class="chip">${escapeHtml(parsed.subarea || parsed.area)}</span>${parsed.recurrence ? `<span class="chip">${parsed.recurrence}</span>` : ''}<span class="chip">${parsed.minutes} min</span>${parsed.grading ? '<span class="chip">Graded</span>' : ''}</div>`;
}

function openQuickAdd(context = null) {
  ui.quickAddType = 'task';
  ui.quickAddContext = context;
  const state = store.getState();
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" role="dialog" aria-modal="true" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><h2>Quick Add</h2><button class="icon-button" data-action="close-sheet">✕</button></header><div class="chip-row"><button class="chip quick-type selected" data-action="select-quick-type" data-type="task">Task</button><button class="chip quick-type" data-action="select-quick-type" data-type="chore">Chore</button><button class="chip quick-type" data-action="select-quick-type" data-type="list">List item</button></div><div class="field"><label for="quick-title">What needs doing?</label><input class="input" id="quick-title" placeholder="Clean bathroom weekly" autocomplete="off"></div><div class="detected-preview" id="detected-preview">${detectedMarkup(parseQuickAdd(''))}</div><div class="field"><label for="quick-area">Area override</label><select class="input" id="quick-area"><option value="">Use detected area</option>${state.areas.filter(area => !area.archived).map(area => `<option value="${area.id}">${area.icon} ${escapeHtml(area.name)}</option>`).join('')}</select></div><button class="button primary block" data-action="save-quick-add">Add item</button></section></div>`;
  requestAnimationFrame(() => document.querySelector('#quick-title')?.focus());
}

function refreshQuickDetection() {
  const input = document.querySelector('#quick-title');
  const preview = document.querySelector('#detected-preview');
  if (input && preview) preview.innerHTML = detectedMarkup(parseQuickAdd(input.value));
}

function saveQuickAdd() {
  const input = document.querySelector('#quick-title');
  const areaOverride = document.querySelector('#quick-area');
  const title = input?.value.trim();
  if (!title) { input?.focus(); showToast('Enter a task name first.'); return; }
  const parsed = parseQuickAdd(title);
  if (parsed.type === 'list') { closeSheet(); showToast('List-item creation will be connected in the Lists feature batch.'); return; }
  let areaId = areaOverride?.value || parsed.areaId;
  let subareaId = areaOverride?.value ? '' : parsed.subareaId;
  if (ui.quickAddContext?.areaId) { areaId = ui.quickAddContext.areaId; subareaId = ui.quickAddContext.roomId || ''; }
  store.addTask({ id: `task-${Date.now()}`, title, type: parsed.type, areaId, subareaId, minutes: parsed.minutes, due: 'Today', urgency: 'today', completed: false, grading: parsed.grading, recurrence: parsed.recurrence, nudge: true });
  closeSheet();
  showToast(`${title} added.`, true);
}

function openGradeSheet(taskId, resetMode = false) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Completion</p><h2>How much did you complete?</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><p class="row-meta">${escapeHtml(task.title)}</p>${['Light|Quick reset or surface cleaning','Moderate|Normal, thorough cleaning','Deep|Detailed full cleaning'].map(option => { const [grade, copy] = option.split('|'); return `<button class="grade-option" data-action="${resetMode ? 'complete-reset-with-grade' : 'complete-with-grade'}" data-task-id="${task.id}" data-grade="${grade}"><span class="grade-badge">${grade[0]}</span><span><strong>${grade}</strong><small>${copy}</small></span></button>`; }).join('')}</section></div>`;
}

function requestComplete(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  if (task.grading) { openGradeSheet(taskId); return; }
  if (store.completeTask(taskId)) showToast(`${task.title} completed.`, true);
}

function completeWithGrade(taskId, grade) {
  store.completeTask(taskId, grade);
  closeSheet();
  showToast(`${grade} completion recorded.`, true);
}

function startRoomReset(areaId, roomId) {
  const taskIds = store.getState().tasks.filter(task => !task.completed && task.areaId === areaId && task.subareaId === roomId && (task.urgency === 'today' || task.urgency === 'overdue')).map(task => task.id);
  if (!taskIds.length) { showToast('Nothing is due in this room.'); return; }
  ui.resetSession = { areaId, roomId, taskIds, index: 0 };
  render();
}

function advanceReset() {
  if (!ui.resetSession) return;
  ui.resetSession.index += 1;
  if (ui.resetSession.index >= ui.resetSession.taskIds.length) {
    const state = store.getState();
    const area = state.areas.find(item => item.id === ui.resetSession.areaId);
    const room = area?.subareas.find(item => item.id === ui.resetSession.roomId);
    ui.resetSession = null;
    render();
    showToast(`${room?.name || 'Room'} reset complete.`);
  } else render();
}

function completeResetTask(taskId, grade = '') {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  if (task.grading && !grade) { openGradeSheet(taskId, true); return; }
  store.completeTask(taskId, grade);
  closeSheet();
  advanceReset();
}

function saveArea(target) {
  const name = document.querySelector('#area-name')?.value.trim();
  if (!name) { showToast('Enter an area name.'); return; }
  const areaId = target.dataset.areaId;
  const icon = document.querySelector('#area-icon')?.value || '📍';
  if (areaId) store.updateArea(areaId, { name, icon });
  else {
    const templateId = document.querySelector('#area-template')?.value || '';
    const includeSuggestedSubareas = Boolean(document.querySelector('#include-suggested-rooms')?.checked);
    const area = store.addArea({ name, icon, templateId, includeSuggestedSubareas });
    closeSheet(); router.go(`areas/${area.id}`); showToast(`${name} added.`, true); return;
  }
  closeSheet(); showToast(`${name} updated.`, true);
}

function saveRoom(target) {
  const name = document.querySelector('#room-name')?.value.trim();
  if (!name) { showToast('Enter a room name.'); return; }
  const icon = document.querySelector('#room-icon')?.value || '🚪';
  const { areaId, roomId } = target.dataset;
  if (roomId) store.updateSubarea(areaId, roomId, { name, icon });
  else store.addSubarea(areaId, { name, icon });
  closeSheet(); showToast(`${name} ${roomId ? 'updated' : 'added'}.`, true);
}

document.addEventListener('input', event => { if (event.target.id === 'quick-title') refreshQuickDetection(); });

document.addEventListener('click', event => {
  const target = event.target.closest('[data-route], [data-action]');
  if (!target) return;
  const route = target.dataset.route;
  if (route) { router.go(route); return; }
  const action = target.dataset.action;
  if (action === 'open-quick-add') openQuickAdd();
  if (action === 'open-quick-add-for-area') openQuickAdd({ areaId: target.dataset.areaId });
  if (action === 'open-quick-add-for-room') openQuickAdd({ areaId: target.dataset.areaId, roomId: target.dataset.roomId });
  if (action === 'close-sheet' && (!event.target.closest('[data-sheet]') || target.matches('.icon-button'))) closeSheet();
  if (action === 'save-quick-add') saveQuickAdd();
  if (action === 'select-quick-type') { ui.quickAddType = target.dataset.type; document.querySelectorAll('.quick-type').forEach(button => button.classList.toggle('selected', button === target)); refreshQuickDetection(); }
  if (action === 'request-complete') requestComplete(target.dataset.taskId);
  if (action === 'complete-with-grade') completeWithGrade(target.dataset.taskId, target.dataset.grade);
  if (action === 'start-task') showToast('Focus mode comes with the intervention batch.');
  if (action === 'cycle-quick-win') store.cycleQuickWin();
  if (action === 'toggle-overdue') { ui.overdueExpanded = !ui.overdueExpanded; render(); }
  if (action === 'open-add-area') overlayRoot.innerHTML = areaSheetMarkup(store.getState());
  if (action === 'open-edit-area') overlayRoot.innerHTML = areaSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'select-area-icon') { document.querySelector('#area-icon').value = target.dataset.icon; document.querySelectorAll('.icon-choice').forEach(button => button.classList.toggle('selected', button === target)); }
  if (action === 'save-area') saveArea(target);
  if (action === 'open-add-room') overlayRoot.innerHTML = roomSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'open-edit-room') overlayRoot.innerHTML = roomSheetMarkup(store.getState(), target.dataset.areaId, target.dataset.roomId);
  if (action === 'select-room-icon') { document.querySelector('#room-icon').value = target.dataset.icon; document.querySelectorAll('.icon-choice').forEach(button => button.classList.toggle('selected', button === target)); }
  if (action === 'save-room') saveRoom(target);
  if (action === 'open-template-sheet') overlayRoot.innerHTML = templateSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'apply-template') { store.applyTemplate(target.dataset.areaId, target.dataset.templateId); closeSheet(); showToast('Template applied.', true); }
  if (action === 'start-room-reset') startRoomReset(target.dataset.areaId, target.dataset.roomId);
  if (action === 'complete-reset-task') completeResetTask(target.dataset.taskId);
  if (action === 'complete-reset-with-grade') completeResetTask(target.dataset.taskId, target.dataset.grade);
  if (action === 'skip-reset-task') advanceReset();
  if (action === 'exit-room-reset') { ui.resetSession = null; render(); }
  if (action === 'undo' && store.undoLast()) showToast('Last change undone.');
  if (action === 'reset-demo') { store.reset(); ui.overdueExpanded = false; ui.resetSession = null; router.go('today'); showToast('Demo data reset.'); }
  if (action === 'search') showToast('Search will be implemented in its feature batch.');
});

store.subscribe(render);
router.subscribe(render);

const timeElement = document.querySelector('#status-time');
function updateClock() { timeElement.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()); }
updateClock();
window.setInterval(updateClock, 30000);
if (!location.hash) router.go('today');
render();