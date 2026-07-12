import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const bottomNav = document.querySelector('#bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  overdueExpanded: false,
  quickAddType: 'task',
  toastTimer: null,
  undoTimer: null
};

const icons = {
  today: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V20H4Z"/><path d="M9 20v-6h6v6"/></svg>',
  areas: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
  lists: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12h3M4 18h3"/></svg>',
  tasks: '<svg viewBox="0 0 24 24"><path d="M7 4h10v16H7z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>'
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
  const percentage = state.progress.totalToday
    ? Math.round((state.progress.completedToday / state.progress.totalToday) * 100)
    : 100;

  return `${pageHeader('Today', `Good morning, ${escapeHtml(state.user.name)}`)}
    <div class="today-stack">
      <section class="card soft" aria-label="Daily progress">
        <div class="progress-summary">
          <div><strong>${state.progress.completedToday} completed today</strong><div class="row-meta">A small task is enough.</div></div>
          <strong>${state.progress.completedToday} / ${state.progress.totalToday}</strong>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${percentage}%"></div></div>
      </section>

      <div class="section-heading"><h2>Quick Win</h2><span>${quickWin ? `${quickWin.minutes} min` : 'All clear'}</span></div>
      ${quickWin ? `<section class="card accent quick-win-card">
        <p class="eyebrow" style="color:inherit;opacity:.82">Recommended now</p>
        <h2 style="position:relative;z-index:1;margin:.2rem 0 .35rem;font-size:1.45rem">${escapeHtml(quickWin.title)}</h2>
        <p style="position:relative;z-index:1;margin:0 0 .8rem;opacity:.8">${escapeHtml(locationText(quickWin))}</p>
        <div class="quick-win-meta"><span>${quickWin.minutes} minutes</span><span>${quickWin.type === 'chore' ? 'Chore' : 'Task'}</span>${quickWin.urgency === 'overdue' ? '<span>Overdue</span>' : '<span>Due today</span>'}</div>
        <div class="quick-win-actions">
          <button class="button" data-action="start-task" data-task-id="${quickWin.id}">Start task</button>
          <button class="button secondary-on-accent" data-action="request-complete" data-task-id="${quickWin.id}">Done</button>
          <button class="button secondary-on-accent" data-action="cycle-quick-win">Another</button>
        </div>
      </section>` : `<section class="card"><strong>Nothing urgent right now.</strong><p class="row-meta">Add something new or review your backlog.</p></section>`}

      <div class="section-heading"><h2>Due today</h2><span>${todayTasks.length}</span></div>
      <section class="card today-list-card">
        ${todayTasks.map(task => taskRow(task)).join('') || '<div class="empty-state" style="min-height:180px"><div><div class="empty-state-icon">✓</div><h2>Everything is done</h2><p>Your Today list is clear.</p></div></div>'}
      </section>

      <div class="section-heading"><h2>Overdue</h2><span>${overdueTasks.length}</span></div>
      <section class="card today-list-card">
        <button class="collapse-button" data-action="toggle-overdue" aria-expanded="${ui.overdueExpanded}"><span>${overdueTasks.length ? 'Review overdue tasks' : 'Nothing overdue'}</span><span>⌄</span></button>
        ${ui.overdueExpanded ? overdueTasks.map(task => taskRow(task, true)).join('') : ''}
      </section>

      <div class="section-heading"><h2>Lists</h2><span>Quick access</span></div>
      <div class="list-shortcuts">
        ${state.lists.map(list => `<button class="list-shortcut" data-route="lists" data-list-id="${list.id}"><span class="list-shortcut-icon">${list.icon}</span><strong>${escapeHtml(list.name)}</strong><small>${list.activeCount} active · ${escapeHtml(list.subtitle)}</small></button>`).join('')}
      </div>

      <div class="section-heading"><h2>Recent</h2><span>${state.activity.length}</span></div>
      <section class="card activity-card">
        ${state.activity.slice(0, 4).map(item => `<div class="activity-row"><span class="activity-icon">${item.icon}</span><span class="activity-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span><span class="activity-time">${escapeHtml(item.time)}</span></div>`).join('')}
      </section>
    </div>`;
}

function placeholder(route) {
  const details = {
    areas: ['Areas', 'Organize responsibilities by place.', '⌂'],
    lists: ['Lists', 'Reusable lists and remembered items.', '☷'],
    tasks: ['Tasks', 'One-time work, upcoming items, and waiting states.', '✓'],
    more: ['More', 'Settings, templates, insights, and supporting tools.', '•••']
  }[route] || ['Nudge', 'This route is ready for implementation.', 'N'];

  return `${pageHeader(details[0], details[1], route !== 'more')}
    <div class="empty-state"><div><div class="empty-state-icon">${details[2]}</div><h2>Foundation ready</h2><p>This destination is connected to the shared shell and is ready for its feature implementation.</p><button class="button primary" data-action="open-quick-add">Open Quick Add</button></div></div>`;
}

function renderNav(route) {
  bottomNav.innerHTML = navItems.map(([key, label]) => {
    if (key === 'add-space') return '<span class="nav-item add-space" aria-hidden="true">Add</span>';
    return `<button class="nav-item ${route === key ? 'active' : ''}" data-route="${key}">${icons[key]}<span>${label}</span></button>`;
  }).join('');
}

function render() {
  const route = router.getRoute();
  const state = store.getState();
  document.documentElement.dataset.theme = state.user.theme;
  screen.innerHTML = route === 'today' ? renderToday(state) : placeholder(route);
  renderNav(route);
}

function showToast(message, allowUndo = false) {
  window.clearTimeout(ui.toastTimer);
  window.clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${allowUndo ? 'action-toast' : ''}"><span>${escapeHtml(message)}</span>${allowUndo ? '<button data-action="undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = window.setTimeout(() => { toastRoot.innerHTML = ''; }, allowUndo ? 5200 : 2400);
  if (allowUndo) ui.undoTimer = window.setTimeout(() => store.clearUndo(), 5500);
}

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function parseQuickAdd(text, selectedType = ui.quickAddType) {
  const lower = text.toLowerCase();
  let type = selectedType;
  if (/\b(buy|grocery|groceries|milk|eggs|bread)\b/.test(lower) && selectedType === 'task') type = 'list';
  if (/\b(clean|wash|vacuum|mop|trash|replace filter)\b/.test(lower)) type = 'chore';

  let area = 'Personal';
  let subarea = '';
  const locations = [
    ['kitchen', 'House', 'Kitchen'], ['bathroom', 'House', 'Bathroom'], ['bedroom', 'House', 'Bedroom'],
    ['garage', 'House', 'Garage'], ['car', 'Car', ''], ['work', 'Work', '']
  ];
  locations.forEach(([word, detectedArea, detectedSubarea]) => {
    if (lower.includes(word)) { area = detectedArea; subarea = detectedSubarea; }
  });

  let recurrence = '';
  if (lower.includes('daily') || lower.includes('every day')) recurrence = 'Daily';
  else if (lower.includes('weekly') || lower.includes('every week')) recurrence = 'Weekly';
  else if (lower.includes('monthly') || lower.includes('every month')) recurrence = 'Monthly';

  const minuteMatch = lower.match(/(\d+)\s*(?:min|minute)/);
  const minutes = minuteMatch ? Number(minuteMatch[1]) : type === 'chore' ? 10 : 5;
  const grading = type === 'chore' && /\b(clean|wash|vacuum|mop|organize)\b/.test(lower);
  return { type, area, subarea, recurrence, minutes, grading };
}

function detectedMarkup(parsed) {
  return `<small>Detected</small><div class="chip-row"><span class="chip selected">${parsed.type === 'list' ? 'List item' : parsed.type[0].toUpperCase() + parsed.type.slice(1)}</span><span class="chip">${escapeHtml(parsed.subarea || parsed.area)}</span>${parsed.recurrence ? `<span class="chip">${parsed.recurrence}</span>` : ''}<span class="chip">${parsed.minutes} min</span>${parsed.grading ? '<span class="chip">Graded</span>' : ''}</div>`;
}

function openQuickAdd() {
  ui.quickAddType = 'task';
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet">
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="quick-add-title" data-sheet>
      <div class="sheet-handle"></div>
      <header class="sheet-header"><h2 id="quick-add-title">Quick Add</h2><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header>
      <div class="chip-row" id="quick-type-row"><button class="chip quick-type selected" data-action="select-quick-type" data-type="task">Task</button><button class="chip quick-type" data-action="select-quick-type" data-type="chore">Chore</button><button class="chip quick-type" data-action="select-quick-type" data-type="list">List item</button></div>
      <div class="field"><label for="quick-title">What needs doing?</label><input class="input" id="quick-title" placeholder="Clean bathroom weekly" autocomplete="off"></div>
      <div class="detected-preview" id="detected-preview">${detectedMarkup(parseQuickAdd(''))}</div>
      <div class="field"><label for="quick-area">Area override</label><select class="input" id="quick-area"><option value="">Use detected area</option><option>House</option><option>Car</option><option>Personal</option><option>Work</option></select></div>
      <button class="button primary block" data-action="save-quick-add">Add item</button>
    </section>
  </div>`;
  requestAnimationFrame(() => document.querySelector('#quick-title')?.focus());
}

function refreshQuickDetection() {
  const input = document.querySelector('#quick-title');
  const preview = document.querySelector('#detected-preview');
  if (!input || !preview) return;
  preview.innerHTML = detectedMarkup(parseQuickAdd(input.value));
}

function saveQuickAdd() {
  const input = document.querySelector('#quick-title');
  const areaOverride = document.querySelector('#quick-area');
  const title = input?.value.trim();
  if (!title) {
    input?.focus();
    showToast('Enter a task name first.');
    return;
  }

  const parsed = parseQuickAdd(title);
  if (parsed.type === 'list') {
    closeSheet();
    showToast('List-item creation will be connected in the Lists feature batch.');
    return;
  }

  const task = {
    id: `task-${Date.now()}`,
    title,
    type: parsed.type,
    area: areaOverride?.value || parsed.area,
    subarea: areaOverride?.value ? '' : parsed.subarea,
    minutes: parsed.minutes,
    due: 'Today',
    urgency: 'today',
    completed: false,
    grading: parsed.grading,
    recurrence: parsed.recurrence,
    nudge: true
  };
  store.addTask(task);
  closeSheet();
  router.go('today');
  showToast(`${title} added.`, true);
}

function openGradeSheet(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Completion</p><h2>How much did you complete?</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <p class="row-meta" style="margin-top:-.5rem;margin-bottom:1rem">${escapeHtml(task.title)}</p>
    <button class="grade-option" data-action="complete-with-grade" data-task-id="${task.id}" data-grade="Light"><span class="grade-badge">L</span><span><strong>Light</strong><small>Quick reset or surface cleaning</small></span></button>
    <button class="grade-option" data-action="complete-with-grade" data-task-id="${task.id}" data-grade="Moderate"><span class="grade-badge">M</span><span><strong>Moderate</strong><small>Normal, thorough cleaning</small></span></button>
    <button class="grade-option" data-action="complete-with-grade" data-task-id="${task.id}" data-grade="Deep"><span class="grade-badge">D</span><span><strong>Deep</strong><small>Detailed full cleaning</small></span></button>
  </section></div>`;
}

function requestComplete(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  if (task.grading) {
    openGradeSheet(taskId);
    return;
  }
  if (store.completeTask(taskId)) showToast(`${task.title} completed.`, true);
}

function completeWithGrade(taskId, grade) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  store.completeTask(taskId, grade);
  closeSheet();
  showToast(`${grade} completion recorded.`, true);
}

function startTask(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  showToast(`${task.title} started. Focus mode comes with the intervention batch.`);
}

document.addEventListener('input', event => {
  if (event.target.id === 'quick-title') refreshQuickDetection();
});

document.addEventListener('click', event => {
  const target = event.target.closest('[data-route], [data-action]');
  if (!target) return;

  const route = target.dataset.route;
  if (route) {
    router.go(route);
    return;
  }

  const action = target.dataset.action;
  if (action === 'open-quick-add') openQuickAdd();
  if (action === 'close-sheet' && (!event.target.closest('[data-sheet]') || target.matches('.icon-button'))) closeSheet();
  if (action === 'save-quick-add') saveQuickAdd();
  if (action === 'select-quick-type') {
    ui.quickAddType = target.dataset.type;
    document.querySelectorAll('.quick-type').forEach(button => button.classList.toggle('selected', button === target));
    refreshQuickDetection();
  }
  if (action === 'request-complete') requestComplete(target.dataset.taskId);
  if (action === 'complete-with-grade') completeWithGrade(target.dataset.taskId, target.dataset.grade);
  if (action === 'start-task') startTask(target.dataset.taskId);
  if (action === 'cycle-quick-win') store.cycleQuickWin();
  if (action === 'toggle-overdue') { ui.overdueExpanded = !ui.overdueExpanded; render(); }
  if (action === 'undo') {
    if (store.undoLast()) showToast('Last change undone.');
  }
  if (action === 'reset-demo') {
    store.reset();
    ui.overdueExpanded = false;
    router.go('today');
    showToast('Demo data reset.');
  }
  if (action === 'search') showToast('Search will be implemented in its feature batch.');
});

store.subscribe(render);
router.subscribe(render);

const timeElement = document.querySelector('#status-time');
function updateClock() {
  timeElement.textContent = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
}
updateClock();
window.setInterval(updateClock, 30000);

if (!location.hash) router.go('today');
render();