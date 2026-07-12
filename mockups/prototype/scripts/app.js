import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const bottomNav = document.querySelector('#bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

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

function pageHeader(title, subtitle, actions = true) {
  return `<header class="page-header">
    <div><p class="eyebrow">Nudge</p><h1>${title}</h1><p>${subtitle}</p></div>
    ${actions ? '<div class="header-actions"><button class="icon-button" data-action="search" aria-label="Search">⌕</button><button class="icon-button" data-route="more" aria-label="More">•••</button></div>' : ''}
  </header>`;
}

function renderToday(state) {
  const openTasks = state.tasks.filter(task => !task.completed);
  const quickWin = openTasks[0];
  const percentage = Math.round((state.progress.completedToday / state.progress.totalToday) * 100);

  return `${pageHeader('Today', 'Good morning, Omar')}
    <section class="card soft" aria-label="Daily progress">
      <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:.65rem">
        <div><strong>${state.progress.completedToday} completed</strong><div class="row-meta">Keep the momentum light.</div></div>
        <strong>${state.progress.completedToday} / ${state.progress.totalToday}</strong>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${percentage}%"></div></div>
    </section>

    <div class="section-heading"><h2>Quick Win</h2><span>${quickWin ? `${quickWin.minutes} min` : 'All clear'}</span></div>
    ${quickWin ? `<section class="card accent">
      <p class="eyebrow" style="color:inherit;opacity:.82">${quickWin.minutes}-minute reset</p>
      <h2 style="margin:.2rem 0 .35rem;font-size:1.45rem">${quickWin.title}</h2>
      <p style="margin:0 0 1.2rem;opacity:.78">${[quickWin.area, quickWin.subarea].filter(Boolean).join(' › ')}</p>
      <button class="button block" data-action="complete-task" data-task-id="${quickWin.id}">Mark complete</button>
    </section>` : `<section class="card"><strong>Nothing urgent right now.</strong><p class="row-meta">Add something new or review your backlog.</p></section>`}

    <div class="section-heading"><h2>Due today</h2><span>${openTasks.length}</span></div>
    <section class="card">
      ${openTasks.map(task => `<button class="list-row" data-action="complete-task" data-task-id="${task.id}">
        <span class="row-icon">○</span>
        <span class="row-content"><strong>${task.title}</strong><small>${[task.area, task.subarea].filter(Boolean).join(' › ')}</small></span>
        <span class="row-meta">${task.minutes}m</span>
      </button>`).join('') || '<div class="empty-state"><div><div class="empty-state-icon">✓</div><h2>Everything is done</h2><p>Your Today list is clear.</p></div></div>'}
    </section>`;
}

function placeholder(route) {
  const details = {
    areas: ['Areas', 'Organize responsibilities by place.', '⌂'],
    lists: ['Lists', 'Reusable lists and remembered items.', '☷'],
    tasks: ['Tasks', 'One-time work, upcoming items, and waiting states.', '✓'],
    more: ['More', 'Settings, templates, insights, and supporting tools.', '•••']
  }[route];

  return `${pageHeader(details[0], details[1], route !== 'more')}
    <div class="empty-state">
      <div>
        <div class="empty-state-icon">${details[2]}</div>
        <h2>Foundation ready</h2>
        <p>This destination is connected to the shared shell and is ready for its feature implementation.</p>
        <button class="button primary" data-action="open-quick-add">Open Quick Add</button>
      </div>
    </div>`;
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

function showToast(message) {
  toastRoot.innerHTML = `<div class="toast">${message}</div>`;
  window.setTimeout(() => { toastRoot.innerHTML = ''; }, 2200);
}

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function openQuickAdd() {
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet">
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="quick-add-title" data-sheet>
      <div class="sheet-handle"></div>
      <header class="sheet-header"><h2 id="quick-add-title">Quick Add</h2><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header>
      <div class="chip-row"><span class="chip selected">Task</span><span class="chip">Chore</span><span class="chip">List item</span></div>
      <div class="field"><label for="quick-title">What needs doing?</label><input class="input" id="quick-title" placeholder="Clean bathroom weekly" autofocus></div>
      <div class="field"><label for="quick-area">Area</label><select class="input" id="quick-area"><option>House</option><option>Car</option><option>Personal</option><option>Work</option></select></div>
      <button class="button primary block" data-action="save-quick-add">Add item</button>
    </section>
  </div>`;
  requestAnimationFrame(() => document.querySelector('#quick-title')?.focus());
}

function saveQuickAdd() {
  const input = document.querySelector('#quick-title');
  const area = document.querySelector('#quick-area');
  const title = input?.value.trim();
  if (!title) {
    input?.focus();
    showToast('Enter a task name first.');
    return;
  }
  store.setState(state => ({
    tasks: [...state.tasks, {
      id: `task-${Date.now()}`,
      title,
      area: area?.value || 'Personal',
      subarea: '',
      minutes: 5,
      due: 'Today',
      completed: false
    }],
    progress: { ...state.progress, totalToday: state.progress.totalToday + 1 }
  }));
  closeSheet();
  router.go('today');
  showToast(`${title} added.`);
}

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
  if (action === 'complete-task') {
    store.completeTask(target.dataset.taskId);
    showToast('Task completed.');
  }
  if (action === 'reset-demo') {
    store.reset();
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
