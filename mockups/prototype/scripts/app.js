import { store } from './state.js';
import { router } from './router.js';
import { renderAreas, renderAreaDetail, renderSectionDetail, areaSheetMarkup, sectionSheetMarkup, templateSheetMarkup } from './areas.js';
import { renderTaskDetail, taskEditSheet, snoozeSheet, rescheduleSheet } from './task-details.js';
import { completeItem, updateTask, snoozeTask, rescheduleTask, skipOccurrence, togglePause, reopenTask } from './task-actions.js';

const screen = document.querySelector('#screen');
const bottomNav = document.querySelector('#bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');
const ui = {
  overdueExpanded: false,
  areaItemType: 'task',
  addContext: null,
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

const navItems = [['today', 'Today'], ['areas', 'Areas'], ['lists', 'Lists'], ['tasks', 'Tasks']];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

function pageHeader(title, subtitle, actions = true) {
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  return `<header class="page-header"><div><p class="eyebrow">${date}</p><h1>${title}</h1><p>${subtitle}</p></div>${actions ? '<div class="header-actions"><button class="icon-button" data-action="search" aria-label="Search">⌕</button><button class="icon-button" data-route="more" aria-label="More">•••</button></div>' : ''}</header>`;
}

function locationText(task) {
  return [task.area, task.subarea].filter(Boolean).join(' › ');
}

function taskRow(task, overdue = false) {
  return `<button class="list-row ${overdue ? 'overdue' : ''}" data-route="item/${task.id}"><span class="task-check">○</span><span class="row-content"><strong>${esc(task.title)}</strong><small>${esc(locationText(task))}${task.recurrence ? ` · ${esc(task.recurrence)}` : ''}</small>${overdue ? `<span class="due-label">${esc(task.due)}</span>` : ''}</span><span class="row-meta">${task.minutes}m ›</span></button>`;
}

function renderProgress(state) {
  const percentage = state.progress.totalToday
    ? Math.round(state.progress.completedToday / state.progress.totalToday * 100)
    : 100;
  return `<section class="card soft"><div class="progress-summary"><div><strong>${state.progress.completedToday} completed today</strong><div class="row-meta">A small task is enough.</div></div><strong>${state.progress.completedToday} / ${state.progress.totalToday}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${percentage}%"></div></div></section>`;
}

function renderQuickWin(state, openTasks) {
  const candidates = openTasks.filter(task => task.nudge);
  const quick = candidates.length ? candidates[state.quickWinIndex % candidates.length] : null;
  return `<div class="section-heading"><h2>Quick Win</h2><span>${quick ? `${quick.minutes} min` : 'All clear'}</span></div>${quick ? `<section class="card accent quick-win-card"><p class="eyebrow" style="color:inherit;opacity:.82">Recommended now</p><h2>${esc(quick.title)}</h2><p>${esc(locationText(quick))}</p><div class="quick-win-meta"><span>${quick.minutes} minutes</span><span>${quick.type === 'chore' ? 'Chore' : 'Task'}</span><span>${quick.urgency === 'overdue' ? 'Overdue' : quick.due}</span></div><div class="quick-win-actions"><button class="button" data-route="item/${quick.id}">Open</button><button class="button secondary-on-accent" data-action="request-complete" data-task-id="${quick.id}">Done</button><button class="button secondary-on-accent" data-action="cycle-quick-win">Another</button></div></section>` : '<section class="card"><strong>Nothing urgent right now.</strong></section>'}`;
}

function renderToday(state) {
  const openTasks = state.tasks.filter(task => !task.completed && !task.paused);
  const today = openTasks.filter(task => task.urgency === 'today');
  const overdue = openTasks.filter(task => task.urgency === 'overdue');
  const optionalProgress = state.preferences?.showTodayProgress === true ? renderProgress(state) : '';
  const optionalQuickWin = state.preferences?.showQuickWin === true ? renderQuickWin(state, openTasks) : '';

  return `${pageHeader('Today', `Good morning, ${esc(state.user.name)}`)}<div class="today-stack">
    ${optionalProgress}
    ${optionalQuickWin}
    <div class="section-heading"><h2>Due today</h2><span>${today.length}</span></div>
    <section class="card today-list-card">${today.map(task => taskRow(task)).join('') || '<div class="empty-state" style="min-height:180px"><div><div class="empty-state-icon">✓</div><h2>Everything is done</h2><p>Your Today list is clear.</p></div></div>'}</section>
    <div class="section-heading"><h2>Overdue</h2><span>${overdue.length}</span></div>
    <section class="card today-list-card"><button class="collapse-button" data-action="toggle-overdue" aria-expanded="${ui.overdueExpanded}"><span>${overdue.length ? 'Review overdue tasks' : 'Nothing overdue'}</span><span>⌄</span></button>${ui.overdueExpanded ? overdue.map(task => taskRow(task, true)).join('') : ''}</section>
    <div class="section-heading"><h2>Lists</h2><span>Quick access</span></div>
    <div class="list-shortcuts">${state.lists.map(list => `<button class="list-shortcut" data-route="lists"><span class="list-shortcut-icon">${list.icon}</span><strong>${esc(list.name)}</strong><small>${list.activeCount} active · ${esc(list.subtitle)}</small></button>`).join('')}</div>
    <div class="section-heading"><h2>Recent</h2><span>${state.activity.length}</span></div>
    <section class="card activity-card">${state.activity.slice(0, 4).map(item => `<div class="activity-row"><span class="activity-icon">${item.icon}</span><span class="activity-copy"><strong>${esc(item.title)}</strong><small>${esc(item.detail)}</small></span><span class="activity-time">${esc(item.time)}</span></div>`).join('')}</section>
  </div>`;
}

function placeholder(route) {
  const details = {
    lists: ['Lists', 'Reusable lists and remembered items.', '☷', 'List creation and item entry will use a dedicated Lists workflow.'],
    tasks: ['Tasks', 'One-time work, upcoming items, and waiting states.', '✓', 'Task creation will use a dedicated Tasks workflow.'],
    more: ['More', 'Settings, templates, insights, and supporting tools.', '•••', 'Settings will include optional Today progress and Quick Win controls.']
  }[route] || ['Nudge', 'Ready for implementation.', 'N', 'This destination is ready for its feature implementation.'];
  return `${pageHeader(details[0], details[1], route !== 'more')}<div class="empty-state"><div><div class="empty-state-icon">${details[2]}</div><h2>Feature-specific flow pending</h2><p>${details[3]}</p></div></div>`;
}

function renderResetSession(state) {
  const session = ui.resetSession;
  const area = state.areas.find(item => item.id === session?.areaId);
  const section = area?.subareas.find(item => item.id === session?.sectionId);
  const task = state.tasks.find(item => item.id === session?.taskIds[session.index]);
  if (!session || !area || !section || !task) return '';
  const progress = session.index + 1;
  return `<div class="reset-screen"><header class="reset-header"><button class="icon-button" data-action="exit-section-reset">✕</button><div><strong>${esc(section.name)} Reset</strong><small>${progress} of ${session.taskIds.length}</small></div><span></span></header><div class="reset-progress"><span style="width:${Math.round(progress / session.taskIds.length * 100)}%"></span></div><main class="reset-main"><p class="eyebrow">Current task</p><h1>${esc(task.title)}</h1><p>${task.minutes} minutes · ${task.type === 'chore' ? 'Chore' : 'Task'}</p><button class="button primary block" data-action="complete-reset-task" data-task-id="${task.id}">Complete</button><button class="button ghost block" data-action="skip-reset-task">Skip</button></main><footer class="reset-up-next"><strong>Up next</strong>${session.taskIds.slice(session.index + 1, session.index + 4).map(id => { const next = state.tasks.find(item => item.id === id); return next ? `<span>${esc(next.title)}</span>` : ''; }).join('') || '<span>Finish the reset</span>'}</footer></div>`;
}

function renderNav(route) {
  const root = route.split('/')[0];
  bottomNav.innerHTML = navItems.map(([key, label]) => `<button class="nav-item ${root === key ? 'active' : ''}" data-route="${key}">${icons[key]}<span>${label}</span></button>`).join('');
}

function render() {
  const route = router.getRoute();
  const [root, second, third] = route.split('/');
  const state = store.getState();
  document.documentElement.dataset.theme = state.user.theme;

  if (ui.resetSession) {
    screen.innerHTML = renderResetSession(state);
    bottomNav.innerHTML = '';
    return;
  }

  if (root === 'today') screen.innerHTML = renderToday(state);
  else if (root === 'item') screen.innerHTML = renderTaskDetail(state, second) || renderToday(state);
  else if (root === 'areas' && third) screen.innerHTML = renderSectionDetail(state, second, third) || renderAreas(state, pageHeader);
  else if (root === 'areas' && second) screen.innerHTML = renderAreaDetail(state, second, pageHeader) || renderAreas(state, pageHeader);
  else if (root === 'areas') screen.innerHTML = renderAreas(state, pageHeader);
  else screen.innerHTML = placeholder(root);
  renderNav(route);
}

function showToast(message, undo = false) {
  clearTimeout(ui.toastTimer);
  clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${undo ? 'action-toast' : ''}"><span>${esc(message)}</span>${undo ? '<button data-action="undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, undo ? 5200 : 2400);
  if (undo) ui.undoTimer = setTimeout(() => store.clearUndo(), 5500);
}

function closeSheet() {
  overlayRoot.innerHTML = '';
}

function parseAreaItem(text, selectedType = ui.areaItemType) {
  const lower = text.toLowerCase();
  let type = selectedType;
  if (/\b(clean|wash|vacuum|mop|trash|replace filter|wipe|organize)\b/.test(lower)) type = 'chore';
  let recurrence = '';
  if (lower.includes('daily') || lower.includes('every day')) recurrence = 'Daily';
  else if (lower.includes('weekly') || lower.includes('every week')) recurrence = 'Weekly';
  else if (lower.includes('monthly') || lower.includes('every month')) recurrence = 'Monthly';
  const minuteMatch = lower.match(/(\d+)\s*(?:min|minute)/);
  const minutes = minuteMatch ? Number(minuteMatch[1]) : type === 'chore' ? 10 : 5;
  const grading = type === 'chore' && /\b(clean|wash|vacuum|mop|organize|wipe)\b/.test(lower);
  return { type, recurrence, minutes, grading };
}

function detectedAreaItemMarkup(parsed) {
  return `<small>Detected</small><div class="chip-row"><span class="chip selected">${parsed.type === 'chore' ? 'Chore' : 'Task'}</span>${parsed.recurrence ? `<span class="chip">${parsed.recurrence}</span>` : ''}<span class="chip">${parsed.minutes} min</span>${parsed.grading ? '<span class="chip">Graded</span>' : ''}</div>`;
}

function openAreaItemAdd(context) {
  const state = store.getState();
  const area = state.areas.find(item => item.id === context.areaId);
  const section = area?.subareas.find(item => item.id === context.sectionId);
  if (!area) return;
  ui.areaItemType = 'task';
  ui.addContext = context;
  const activeSections = area.subareas.filter(item => !item.archived);
  const locationControl = section
    ? `<div class="detected-preview"><small>Location</small><div class="chip-row"><span class="chip selected">${esc(area.name)} › ${esc(section.name)}</span></div></div>`
    : `<div class="field"><label for="area-item-section">Section</label><select class="input" id="area-item-section"><option value="">General ${esc(area.name)}</option>${activeSections.map(item => `<option value="${item.id}">${item.icon} ${esc(item.name)}</option>`).join('')}</select></div>`;

  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${esc(area.name)}</p><h2>Add task or chore${section ? ` to ${esc(section.name)}` : ''}</h2></div><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header><div class="chip-row"><button class="chip area-item-type selected" data-action="select-area-item-type" data-type="task">Task</button><button class="chip area-item-type" data-action="select-area-item-type" data-type="chore">Chore</button></div><div class="field"><label for="area-item-title">What needs doing?</label><input class="input" id="area-item-title" placeholder="Clean counters weekly for 5 minutes" autocomplete="off"></div><div class="detected-preview" id="area-item-detected">${detectedAreaItemMarkup(parseAreaItem(''))}</div>${locationControl}<button class="button primary block" data-action="save-area-item">Add to ${esc(section?.name || area.name)}</button></section></div>`;
  requestAnimationFrame(() => document.querySelector('#area-item-title')?.focus());
}

function saveAreaItem() {
  const input = document.querySelector('#area-item-title');
  const title = input?.value.trim();
  if (!title) {
    input?.focus();
    showToast('Enter a task or chore name.');
    return;
  }
  const parsed = parseAreaItem(title);
  const areaId = ui.addContext?.areaId;
  const subareaId = ui.addContext?.sectionId || document.querySelector('#area-item-section')?.value || '';
  store.addTask({
    id: `task-${Date.now()}`,
    title,
    type: parsed.type,
    areaId,
    subareaId,
    minutes: parsed.minutes,
    due: 'Today',
    urgency: 'today',
    completed: false,
    grading: parsed.grading,
    recurrence: parsed.recurrence,
    nudge: true,
    scheduleBasis: parsed.recurrence ? 'completion' : 'none'
  });
  closeSheet();
  showToast(`${title} added.`, true);
}

function openGradeSheet(taskId, reset = false) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  overlayRoot.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Completion</p><h2>How much did you complete?</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><p class="row-meta">${esc(task.title)}</p>${[['Light', 'Quick reset or surface cleaning'], ['Moderate', 'Normal, thorough cleaning'], ['Deep', 'Detailed full cleaning']].map(([grade, copy]) => `<button class="grade-option" data-action="${reset ? 'complete-reset-with-grade' : 'complete-with-grade'}" data-task-id="${task.id}" data-grade="${grade}"><span class="grade-badge">${grade[0]}</span><span><strong>${grade}</strong><small>${copy}</small></span></button>`).join('')}</section></div>`;
}

function requestComplete(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  if (task.grading) {
    openGradeSheet(taskId);
    return;
  }
  if (completeItem(taskId)) showToast(`${task.title} completed.`, true);
}

function startSectionReset(areaId, sectionId) {
  const taskIds = store.getState().tasks
    .filter(task => !task.completed && !task.paused && task.areaId === areaId && task.subareaId === sectionId && ['today', 'overdue'].includes(task.urgency))
    .map(task => task.id);
  if (!taskIds.length) {
    showToast('Nothing is due in this section.');
    return;
  }
  ui.resetSession = { areaId, sectionId, taskIds, index: 0 };
  render();
}

function advanceReset() {
  if (!ui.resetSession) return;
  ui.resetSession.index += 1;
  if (ui.resetSession.index >= ui.resetSession.taskIds.length) {
    const state = store.getState();
    const area = state.areas.find(item => item.id === ui.resetSession.areaId);
    const section = area?.subareas.find(item => item.id === ui.resetSession.sectionId);
    ui.resetSession = null;
    render();
    showToast(`${section?.name || 'Section'} reset complete.`);
  } else render();
}

function completeResetTask(taskId, grade = '') {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  if (task.grading && !grade) {
    openGradeSheet(taskId, true);
    return;
  }
  completeItem(taskId, grade);
  closeSheet();
  advanceReset();
}

function saveArea(target) {
  const name = document.querySelector('#area-name')?.value.trim();
  if (!name) {
    showToast('Enter an area name.');
    return;
  }
  const areaId = target.dataset.areaId;
  const icon = document.querySelector('#area-icon')?.value || '📍';
  if (areaId) store.updateArea(areaId, { name, icon });
  else {
    const area = store.addArea({
      name,
      icon,
      templateId: document.querySelector('#area-template')?.value || '',
      includeSuggestedSections: Boolean(document.querySelector('#include-suggested-sections')?.checked)
    });
    closeSheet();
    router.go(`areas/${area.id}`);
    showToast(`${name} added.`, true);
    return;
  }
  closeSheet();
  showToast(`${name} updated.`, true);
}

function saveSection(target) {
  const name = document.querySelector('#section-name')?.value.trim();
  if (!name) {
    showToast('Enter a section name.');
    return;
  }
  const icon = document.querySelector('#section-icon')?.value || '🚪';
  const { areaId, sectionId } = target.dataset;
  if (sectionId) store.updateSubarea(areaId, sectionId, { name, icon });
  else store.addSubarea(areaId, { name, icon });
  closeSheet();
  showToast(`${name} ${sectionId ? 'updated' : 'added'}.`, true);
}

function saveTaskEdit(taskId) {
  const title = document.querySelector('#edit-task-title')?.value.trim();
  if (!title) {
    showToast('Enter a title.');
    return;
  }
  updateTask(taskId, {
    title,
    minutes: Math.max(1, Number(document.querySelector('#edit-task-minutes')?.value) || 5),
    recurrence: document.querySelector('#edit-task-recurrence')?.value || '',
    notes: document.querySelector('#edit-task-notes')?.value.trim() || '',
    nudge: Boolean(document.querySelector('#edit-task-nudge')?.checked)
  });
  closeSheet();
  showToast('Changes saved.', true);
}

document.addEventListener('input', event => {
  if (event.target.id === 'area-item-title') {
    const preview = document.querySelector('#area-item-detected');
    if (preview) preview.innerHTML = detectedAreaItemMarkup(parseAreaItem(event.target.value));
  }
});

document.addEventListener('click', event => {
  const target = event.target.closest('[data-route], [data-action]');
  if (!target) return;
  if (target.dataset.route) {
    router.go(target.dataset.route);
    return;
  }

  const action = target.dataset.action;
  if (action === 'detail-back') history.length > 1 ? history.back() : router.go('today');
  if (action === 'open-add-item-for-area') openAreaItemAdd({ areaId: target.dataset.areaId });
  if (action === 'open-add-item-for-section') openAreaItemAdd({ areaId: target.dataset.areaId, sectionId: target.dataset.sectionId });
  if (action === 'close-sheet' && (!event.target.closest('[data-sheet]') || target.matches('.icon-button'))) closeSheet();
  if (action === 'select-area-item-type') {
    ui.areaItemType = target.dataset.type;
    document.querySelectorAll('.area-item-type').forEach(button => button.classList.toggle('selected', button === target));
    const input = document.querySelector('#area-item-title');
    const preview = document.querySelector('#area-item-detected');
    if (input && preview) preview.innerHTML = detectedAreaItemMarkup(parseAreaItem(input.value));
  }
  if (action === 'save-area-item') saveAreaItem();
  if (action === 'request-complete') requestComplete(target.dataset.taskId);
  if (action === 'complete-with-grade') {
    completeItem(target.dataset.taskId, target.dataset.grade);
    closeSheet();
    showToast(`${target.dataset.grade} completion recorded.`, true);
  }
  if (action === 'start-task') showToast('Focus mode comes with the intervention batch.');
  if (action === 'open-edit-task') overlayRoot.innerHTML = taskEditSheet(store.getState(), target.dataset.taskId);
  if (action === 'save-task-edit') saveTaskEdit(target.dataset.taskId);
  if (action === 'open-snooze-sheet') overlayRoot.innerHTML = snoozeSheet(target.dataset.taskId);
  if (action === 'apply-snooze') {
    snoozeTask(target.dataset.taskId, target.dataset.snooze);
    closeSheet();
    showToast('Task snoozed.', true);
  }
  if (action === 'open-reschedule-sheet') overlayRoot.innerHTML = rescheduleSheet(target.dataset.taskId);
  if (action === 'apply-reschedule') {
    const date = document.querySelector('#reschedule-date')?.value;
    if (!date) {
      showToast('Choose a date.');
      return;
    }
    rescheduleTask(target.dataset.taskId, date);
    closeSheet();
    showToast('Due date updated.', true);
  }
  if (action === 'skip-occurrence') {
    skipOccurrence(target.dataset.taskId);
    showToast('Occurrence skipped.', true);
  }
  if (action === 'toggle-pause-task') {
    togglePause(target.dataset.taskId);
    showToast('Recurrence updated.', true);
  }
  if (action === 'reopen-task') {
    reopenTask(target.dataset.taskId);
    showToast('Task reopened.', true);
  }
  if (action === 'cycle-quick-win') store.cycleQuickWin();
  if (action === 'toggle-overdue') {
    ui.overdueExpanded = !ui.overdueExpanded;
    render();
  }
  if (action === 'open-add-area') overlayRoot.innerHTML = areaSheetMarkup(store.getState());
  if (action === 'open-edit-area') overlayRoot.innerHTML = areaSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'select-area-icon') {
    document.querySelector('#area-icon').value = target.dataset.icon;
    document.querySelectorAll('.icon-choice').forEach(button => button.classList.toggle('selected', button === target));
  }
  if (action === 'save-area') saveArea(target);
  if (action === 'open-add-section') overlayRoot.innerHTML = sectionSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'open-edit-section') overlayRoot.innerHTML = sectionSheetMarkup(store.getState(), target.dataset.areaId, target.dataset.sectionId);
  if (action === 'select-section-icon') {
    document.querySelector('#section-icon').value = target.dataset.icon;
    document.querySelectorAll('.icon-choice').forEach(button => button.classList.toggle('selected', button === target));
  }
  if (action === 'save-section') saveSection(target);
  if (action === 'open-template-sheet') overlayRoot.innerHTML = templateSheetMarkup(store.getState(), target.dataset.areaId);
  if (action === 'apply-template') {
    store.applyTemplate(target.dataset.areaId, target.dataset.templateId);
    closeSheet();
    showToast('Template applied.', true);
  }
  if (action === 'start-section-reset') startSectionReset(target.dataset.areaId, target.dataset.sectionId);
  if (action === 'complete-reset-task') completeResetTask(target.dataset.taskId);
  if (action === 'complete-reset-with-grade') completeResetTask(target.dataset.taskId, target.dataset.grade);
  if (action === 'skip-reset-task') advanceReset();
  if (action === 'exit-section-reset') {
    ui.resetSession = null;
    render();
  }
  if (action === 'undo' && store.undoLast()) showToast('Last change undone.');
  if (action === 'reset-demo') {
    store.reset();
    ui.overdueExpanded = false;
    ui.resetSession = null;
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
setInterval(updateClock, 30000);
if (!location.hash) router.go('today');
render();