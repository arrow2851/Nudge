import { store } from './state.js';
import { router } from './router.js';
import { updateTask } from './task-actions.js';

const screen = document.querySelector('#screen');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  toastTimer: null,
  undoTimer: null,
  gesture: null,
  suppressClickUntil: 0,
  inlineEditingId: '',
  inlineValue: '',
  pendingFocusId: ''
};

const removedPrototypeSeeds = new Set([
  'tasks-inbox-dentist',
  'tasks-waiting-repair',
  'tasks-blocked-shelf',
  'tasks-completed-filter'
]);

const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));
const clone = value => JSON.parse(JSON.stringify(value));

function normalizeChecklistTask(task, index, validIds) {
  const invalidDue = ['Waiting', 'Blocked', 'Completed'].includes(task.due);
  const parentTaskId = task.parentTaskId && validIds.has(task.parentTaskId) ? task.parentTaskId : '';
  return {
    ...task,
    status: task.completed ? 'completed' : 'planned',
    due: invalidDue ? '' : task.due || '',
    dueDate: invalidDue ? '' : task.dueDate || '',
    urgency: task.completed ? 'none' : invalidDue ? 'none' : task.urgency || 'none',
    completed: Boolean(task.completed),
    completedAt: task.completedAt || '',
    parentTaskId,
    isMainTask: Boolean(task.isMainTask),
    checklistOrder: Number.isFinite(task.checklistOrder) ? task.checklistOrder : index * 10,
    createdAt: task.createdAt || new Date(Date.now() + index).toISOString()
  };
}

let ensuringModel = false;
function ensureChecklistModel() {
  if (ensuringModel) return;
  const state = store.getState();
  const version = Number(state.preferences?.checklistModelVersion || 0);
  const retained = state.tasks.filter(task => !removedPrototypeSeeds.has(task.id));
  const validIds = new Set(retained.map(task => task.id));
  const normalized = retained.map((task, index) => normalizeChecklistTask(task, index, validIds));
  const mainIds = new Set(normalized.filter(task => task.isMainTask).map(task => task.id));
  const repaired = normalized.map(task => task.parentTaskId && !mainIds.has(task.parentTaskId)
    ? { ...task, parentTaskId: '' }
    : task);
  const preferences = {
    ...state.preferences,
    checklistModelVersion: 4,
    taskSortMode: state.preferences?.taskSortMode || 'manual',
    showTaskDueShorthand: state.preferences?.showTaskDueShorthand === true,
    reverseTaskItemLayout: state.preferences?.reverseTaskItemLayout === true,
    showCompletedTasks: state.preferences?.showCompletedTasks !== false
  };
  const changed = version < 4
    || retained.length !== state.tasks.length
    || JSON.stringify(repaired) !== JSON.stringify(state.tasks)
    || JSON.stringify(preferences) !== JSON.stringify(state.preferences);
  if (!changed) return;
  ensuringModel = true;
  store.setState({ tasks: repaired, preferences });
  ensuringModel = false;
}

function taskRecords(state = store.getState()) {
  return state.tasks.filter(task => task.type === 'task' && !task.archived);
}

function dueTimestamp(task) {
  if (task.dueDate) return new Date(`${task.dueDate}T12:00:00`).getTime();
  if (task.due === 'Today') return new Date().setHours(12, 0, 0, 0);
  if (task.due === 'Tomorrow') return new Date(Date.now() + 86400000).setHours(12, 0, 0, 0);
  return Number.MAX_SAFE_INTEGER;
}

function sortedSiblings(tasks, parentTaskId = '') {
  const mode = store.getState().preferences?.taskSortMode || 'manual';
  return tasks
    .filter(task => (task.parentTaskId || '') === parentTaskId)
    .sort((a, b) => {
      const completion = Number(a.completed) - Number(b.completed);
      if (completion) return completion;
      if (mode === 'alphabetical') return (a.title || '').localeCompare(b.title || '');
      if (mode === 'due') return dueTimestamp(a) - dueTimestamp(b) || (a.title || '').localeCompare(b.title || '');
      return Number(a.checklistOrder || 0) - Number(b.checklistOrder || 0)
        || new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });
}

function dueShorthand(task) {
  if (store.getState().preferences?.showTaskDueShorthand !== true) return '';
  if (!task.dueDate) {
    if (task.due === 'Today') return 'Today';
    if (task.due === 'Tomorrow') return '1d';
    return '';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T00:00:00`);
  const days = Math.round((due - today) / 86400000);
  if (days < 0) return `${Math.abs(days)}d late`;
  if (days === 0) return 'Today';
  if (days < 14) return `${days}d`;
  return `${Math.ceil(days / 7)}w`;
}

function progressFor(task, allTasks) {
  const children = allTasks.filter(item => item.parentTaskId === task.id);
  return {
    children,
    percent: children.length ? Math.round(children.filter(item => item.completed).length / children.length * 100) : 0
  };
}

function checklistRow(task, allTasks, isSubtask = false) {
  const { children, percent } = progressFor(task, allTasks);
  const reversed = store.getState().preferences?.reverseTaskItemLayout === true;
  const shorthand = dueShorthand(task);
  const inlineEditing = ui.inlineEditingId === task.id;
  return `<div class="checklist-card ${task.completed ? 'completed' : ''} ${isSubtask ? 'subtask-card' : ''} ${reversed ? 'reverse-layout' : ''}" data-task-drag-source data-task-id="${task.id}">
    ${task.isMainTask && children.length ? `<span class="subtask-progress" style="width:${percent}%"></span>` : ''}
    <div class="checklist-row">
      <button class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle-checklist-complete" data-task-id="${task.id}" aria-label="${task.completed ? 'Reopen' : 'Complete'} ${esc(task.title || 'task')}">${task.completed ? '✓' : ''}</button>
      ${inlineEditing
        ? `<input class="task-new-inline-input" data-new-task-input data-task-id="${task.id}" value="${esc(ui.inlineValue)}" placeholder="New task" aria-label="New task name">`
        : `<button class="task-content" data-action="open-checklist-settings" data-task-id="${task.id}" aria-label="Edit ${esc(task.title || 'new task')}"><span class="task-title">${esc(task.title || 'New task')}</span><span class="task-due-shorthand">${esc(shorthand)}</span></button>`}
      ${task.isMainTask ? `<button class="task-subtask-add" data-action="add-subtask" data-task-id="${task.id}" aria-label="Add subtask to ${esc(task.title || 'main task')}">+</button>` : ''}
    </div>
  </div>`;
}

function taskTree(task, allTasks) {
  const children = sortedSiblings(allTasks, task.id);
  return `<div class="checklist-shell ${task.isMainTask ? 'main-task-shell' : ''}" data-task-id="${task.id}">
    ${checklistRow(task, allTasks)}
    ${children.length ? `<div class="subtask-list">${children.map(child => `<div class="checklist-shell" data-task-id="${child.id}">${checklistRow(child, allTasks, true)}</div>`).join('')}</div>` : ''}
  </div>`;
}

function renderTasks() {
  if (router.getRoute().split('/')[0] !== 'tasks') return;
  const state = store.getState();
  const tasks = taskRecords(state);
  const showCompleted = state.preferences?.showCompletedTasks !== false;
  const roots = sortedSiblings(tasks).filter(task => showCompleted || !task.completed);
  const mode = state.preferences?.taskSortMode || 'manual';
  screen.innerHTML = `<header class="page-header checklist-header"><div><p class="eyebrow">Checklist</p><h1>Tasks</h1><p>${tasks.filter(task => !task.completed).length} remaining</p></div><button class="icon-button checklist-top-add" data-action="add-empty-task" aria-label="Add task">+</button></header>
    <div class="checklist-tools">
      <div class="checklist-sort" role="group" aria-label="Task order">${[['manual', 'Manual'], ['alphabetical', 'A–Z'], ['due', 'Due']].map(([value, label]) => `<button class="${mode === value ? 'active' : ''}" data-action="set-checklist-sort" data-sort="${value}">${label}</button>`).join('')}</div>
      <button class="completed-visibility-toggle" data-action="toggle-completed-tasks">${showCompleted ? 'Hide completed' : 'Show completed'}</button>
    </div>
    <div class="checklist-list" data-checklist-list>${roots.map(task => taskTree(task, tasks)).join('')}</div>
    <button class="checklist-bottom-add" data-action="add-empty-task"><span>+</span> Add task</button>`;
  focusPendingTask();
}

function showToast(message, allowUndo = false) {
  clearTimeout(ui.toastTimer);
  clearTimeout(ui.undoTimer);
  toastRoot.innerHTML = `<div class="toast ${allowUndo ? 'action-toast' : ''}"><span>${esc(message)}</span>${allowUndo ? '<button data-action="tasks-undo">UNDO</button>' : ''}</div>`;
  ui.toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, allowUndo ? 5200 : 2400);
  if (allowUndo) ui.undoTimer = setTimeout(() => store.clearUndo(), 5500);
}

function closeSheet() { overlayRoot.innerHTML = ''; }

function nextOrder(parentTaskId = '') {
  const siblings = taskRecords().filter(task => (task.parentTaskId || '') === parentTaskId);
  return siblings.length ? Math.max(...siblings.map(task => Number(task.checklistOrder || 0))) + 10 : 0;
}

function focusPendingTask() {
  if (!ui.pendingFocusId) return;
  requestAnimationFrame(() => {
    const input = screen.querySelector(`[data-new-task-input][data-task-id="${ui.pendingFocusId}"]`);
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    ui.pendingFocusId = '';
  });
}

function addBlankTask(parentTaskId = '') {
  const current = store.getState();
  const id = `task-${Date.now()}`;
  const parent = current.tasks.find(task => task.id === parentTaskId);
  const actualParentId = parent?.isMainTask ? parentTaskId : '';
  const newTask = {
    id, title: '', type: 'task', areaId: '', subareaId: '', area: '', subarea: '', minutes: 0,
    due: '', dueDate: '', urgency: 'none', status: 'planned', completed: false, completedAt: '',
    grading: false, recurrence: '', nudge: true, notes: '', parentTaskId: actualParentId,
    isMainTask: false, checklistOrder: nextOrder(actualParentId), createdAt: new Date().toISOString()
  };
  store.setState({ tasks: [...current.tasks, newTask], lastUndo: { label: 'Task added', snapshot: clone(current) } });
  ui.inlineEditingId = id;
  ui.inlineValue = '';
  ui.pendingFocusId = id;
  requestAnimationFrame(renderTasks);
}

function removeBlankTask(taskId) {
  store.setState(state => ({ tasks: state.tasks.filter(task => task.id !== taskId) }));
}

function commitInlineTask(input) {
  const taskId = input.dataset.taskId;
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  const title = input.value.trim();
  ui.inlineEditingId = '';
  ui.inlineValue = '';
  if (!title) {
    if (!task.title) removeBlankTask(taskId);
    else renderTasks();
    return;
  }
  updateTask(taskId, { title });
}

function descendantsOf(taskId, tasks) {
  const children = tasks.filter(task => task.parentTaskId === taskId);
  return children.flatMap(child => [child.id, ...descendantsOf(child.id, tasks)]);
}

function completionFields(item, completed) {
  return {
    ...item,
    completed,
    status: completed ? 'completed' : 'planned',
    completedAt: completed ? new Date().toISOString() : '',
    urgency: completed ? 'none' : item.dueDate ? item.urgency || 'upcoming' : item.due === 'Today' ? 'today' : item.due === 'Tomorrow' ? 'upcoming' : 'none'
  };
}

function recalculateAncestors(tasks, parentId) {
  let updated = tasks;
  let currentParentId = parentId;
  while (currentParentId) {
    const parent = updated.find(task => task.id === currentParentId);
    if (!parent) break;
    const children = updated.filter(task => task.parentTaskId === currentParentId);
    const completed = children.length > 0 && children.every(child => child.completed);
    updated = updated.map(task => task.id === currentParentId ? completionFields(task, completed) : task);
    currentParentId = parent.parentTaskId || '';
  }
  return updated;
}

function toggleComplete(taskId) {
  const current = store.getState();
  const task = current.tasks.find(item => item.id === taskId);
  if (!task) return;
  const completed = !task.completed;
  const cascadeIds = new Set([taskId, ...descendantsOf(taskId, current.tasks)]);
  let tasks = current.tasks.map(item => cascadeIds.has(item.id) ? completionFields(item, completed) : item);
  tasks = recalculateAncestors(tasks, task.parentTaskId || '');
  store.setState({
    tasks,
    activity: [{ id: `activity-${Date.now()}`, title: task.title || 'Untitled task', detail: completed ? 'Completed' : 'Reopened', time: 'Just now', icon: completed ? '✓' : '↶' }, ...current.activity].slice(0, 8),
    lastUndo: { label: completed ? 'Task completed' : 'Task reopened', snapshot: clone(current) }
  });
  showToast(completed ? 'Task completed.' : 'Task reopened.', true);
}

function focusTaskSheetTitle() {
  requestAnimationFrame(() => {
    const input = document.querySelector('#checklist-task-title');
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function openTaskSheet(taskId, focusTitle = false) {
  overlayRoot.innerHTML = checklistSettingsSheet(taskId);
  if (focusTitle) focusTaskSheetTitle();
}

function saveTaskSheetTitle(input) {
  const taskId = input.dataset.taskId;
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return;
  const title = input.value.trim();
  if (title && title !== task.title) updateTask(taskId, { title });
}

function checklistSettingsSheet(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return '';
  const hasDue = Boolean(task.dueDate || task.due);
  const isSubtask = Boolean(task.parentTaskId);
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet checklist-settings-sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Task</p><h2>Edit task</h2></div><button class="icon-button" data-action="close-sheet" aria-label="Close">✕</button></header>
    <div class="field task-title-field"><label for="checklist-task-title">Task name</label><input class="input" id="checklist-task-title" data-task-id="${task.id}" value="${esc(task.title || '')}" placeholder="New task"></div>
    <label class="toggle-row ${isSubtask ? 'disabled-setting' : ''}"><span><strong>Main task</strong><small>${isSubtask ? 'Move this task out before making it a main task.' : task.isMainTask ? 'This task can contain subtasks.' : 'Allow subtasks under this task.'}</small></span><input type="checkbox" data-action="toggle-main-task" data-task-id="${task.id}" ${task.isMainTask ? 'checked' : ''} ${isSubtask ? 'disabled' : ''}></label>
    <div class="simple-setting-block"><div><strong>Due date</strong><small>${hasDue ? esc(task.due || task.dueDate) : 'No due date'}</small></div>${hasDue ? `<div class="simple-setting-actions"><button class="button" data-action="clear-task-due" data-task-id="${task.id}">Clear</button><button class="button primary" data-action="open-task-date-picker" data-task-id="${task.id}">Change</button></div>` : `<button class="button primary block" data-action="open-task-date-picker" data-task-id="${task.id}">Set due date</button>`}</div>
  </section></div>`;
}

function datePickerSheet(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return '';
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true"><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Due date</p><h2>${esc(task.title || 'Untitled task')}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><div class="field"><label for="checklist-due-date">Date</label><input class="input" id="checklist-due-date" type="date" value="${esc(task.dueDate || '')}"></div><button class="button primary block" data-action="save-task-due" data-task-id="${task.id}">Save due date</button></section></div>`;
}

function dateLabel(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  const days = Math.round((compare - today) / 86400000);
  if (days === 0) return { due: 'Today', urgency: 'today' };
  if (days === 1) return { due: 'Tomorrow', urgency: 'upcoming' };
  return { due: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date), urgency: days < 0 ? 'overdue' : 'upcoming' };
}

function saveDueDate(taskId) {
  const isoDate = document.querySelector('#checklist-due-date')?.value;
  if (!isoDate) return showToast('Choose a date.');
  const label = dateLabel(isoDate);
  updateTask(taskId, { dueDate: isoDate, due: label.due, urgency: label.urgency, status: 'planned', completed: false });
  closeSheet();
  showToast('Due date saved.', true);
}

function clearDueDate(taskId) {
  updateTask(taskId, { dueDate: '', due: '', urgency: 'none' });
  closeSheet();
  showToast('Due date cleared.', true);
}

function toggleMainTask(taskId, enabled) {
  const current = store.getState();
  const task = current.tasks.find(item => item.id === taskId);
  if (!task || task.parentTaskId) return;
  const children = current.tasks.filter(item => item.parentTaskId === taskId);
  const rootOrder = Number(task.checklistOrder || 0);
  const updatedTasks = current.tasks.map(item => {
    if (item.id === taskId) return { ...item, isMainTask: enabled };
    if (!enabled && item.parentTaskId === taskId) {
      const offset = children.findIndex(child => child.id === item.id) + 1;
      return { ...item, parentTaskId: '', checklistOrder: rootOrder + offset };
    }
    return item;
  });
  store.setState({ tasks: updatedTasks, lastUndo: { label: enabled ? 'Main task enabled' : 'Subtasks released', snapshot: clone(current) } });
  closeSheet();
  showToast(enabled ? 'Main task enabled.' : children.length ? 'Subtasks moved into the main checklist.' : 'Main task disabled.', true);
}

function reindex(tasks, parentTaskId) {
  const siblings = tasks.filter(task => (task.parentTaskId || '') === parentTaskId)
    .sort((a, b) => Number(a.checklistOrder || 0) - Number(b.checklistOrder || 0));
  const order = new Map(siblings.map((task, index) => [task.id, index * 10]));
  return tasks.map(task => order.has(task.id) ? { ...task, checklistOrder: order.get(task.id) } : task);
}

function moveTask(draggedId, targetId) {
  const current = store.getState();
  const dragged = current.tasks.find(task => task.id === draggedId);
  const target = current.tasks.find(task => task.id === targetId);
  if (!dragged || !target || dragged.id === target.id) return;
  const oldParent = dragged.parentTaskId || '';
  const newParent = target.parentTaskId || '';
  let tasks = current.tasks.map(task => task.id === draggedId ? { ...task, parentTaskId: newParent, isMainTask: newParent ? false : task.isMainTask } : task);
  const siblings = tasks.filter(task => task.id !== draggedId && (task.parentTaskId || '') === newParent)
    .sort((a, b) => Number(a.checklistOrder || 0) - Number(b.checklistOrder || 0));
  const targetIndex = siblings.findIndex(task => task.id === targetId);
  siblings.splice(Math.max(0, targetIndex), 0, tasks.find(task => task.id === draggedId));
  const newOrders = new Map(siblings.map((task, index) => [task.id, index * 10]));
  tasks = tasks.map(task => newOrders.has(task.id) ? { ...task, checklistOrder: newOrders.get(task.id) } : task);
  tasks = reindex(tasks, oldParent);
  store.setState({ tasks, preferences: { ...current.preferences, taskSortMode: 'manual' }, lastUndo: { label: 'Task moved', snapshot: clone(current) } });
  showToast('Task moved.', true);
}

function indentTask(taskId) {
  const current = store.getState();
  const tasks = taskRecords(current);
  const task = tasks.find(item => item.id === taskId);
  if (!task || task.parentTaskId) return;
  if (tasks.some(item => item.parentTaskId === taskId)) return showToast('Move its subtasks out before indenting this task.');
  const siblings = sortedSiblings(tasks, '');
  const index = siblings.findIndex(item => item.id === taskId);
  if (index <= 0) return;
  const parent = siblings[index - 1];
  let updated = current.tasks.map(item => {
    if (item.id === parent.id) return { ...item, isMainTask: true };
    if (item.id === taskId) return { ...item, parentTaskId: parent.id, isMainTask: false, checklistOrder: nextOrder(parent.id) };
    return item;
  });
  updated = recalculateAncestors(updated, parent.id);
  store.setState({ tasks: updated, preferences: { ...current.preferences, taskSortMode: 'manual' }, lastUndo: { label: 'Task indented', snapshot: clone(current) } });
  showToast(`Moved under ${parent.title || 'the item above'}.`, true);
}

function clearGestureClasses() {
  screen.querySelectorAll('.drop-before, .dragging, .swiping-right').forEach(element => element.classList.remove('drop-before', 'dragging', 'swiping-right'));
}

function beginDrag() {
  if (!ui.gesture || ui.gesture.active || ui.gesture.swiping) return;
  ui.gesture.active = true;
  ui.gesture.shell.classList.add('dragging');
  try { ui.gesture.source.setPointerCapture?.(ui.gesture.pointerId); } catch (_) {}
  document.body.classList.add('checklist-dragging');
}

function updateDrag(event) {
  if (!ui.gesture?.active || event.pointerId !== ui.gesture.pointerId) return;
  event.preventDefault();
  screen.querySelectorAll('.drop-before').forEach(element => element.classList.remove('drop-before'));
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const shell = element?.closest('.checklist-shell[data-task-id]');
  if (!shell || shell.dataset.taskId === ui.gesture.taskId) return void (ui.gesture.targetId = '');
  shell.classList.add('drop-before');
  ui.gesture.targetId = shell.dataset.taskId;
}

function endGesture(event) {
  if (!ui.gesture || event.pointerId !== ui.gesture.pointerId) return;
  clearTimeout(ui.gesture.timer);
  const gesture = ui.gesture;
  if (gesture.active) {
    try { gesture.source.releasePointerCapture?.(event.pointerId); } catch (_) {}
    if (gesture.targetId) moveTask(gesture.taskId, gesture.targetId);
    document.body.classList.remove('checklist-dragging');
    ui.suppressClickUntil = Date.now() + 300;
  } else if (gesture.swiping) {
    gesture.source.style.transform = '';
    if (gesture.dx > 56) indentTask(gesture.taskId);
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
  if (router.getRoute().split('/')[0] !== 'tasks') return;
  const card = event.target.closest('[data-task-drag-source]');
  if (!card || event.target.closest('.task-checkbox') || event.target.closest('.task-subtask-add') || event.target.matches('[data-new-task-input]')) return;
  const shell = card.closest('.checklist-shell');
  if (!shell) return;
  ui.gesture = {
    active: false, swiping: false, dx: 0, taskId: card.dataset.taskId, pointerId: event.pointerId,
    source: card, shell, startX: event.clientX, startY: event.clientY, targetId: '', timer: setTimeout(beginDrag, 170)
  };
});

document.addEventListener('pointermove', event => {
  if (!ui.gesture) return;
  const dx = event.clientX - ui.gesture.startX;
  const dy = event.clientY - ui.gesture.startY;
  if (!ui.gesture.active && !ui.gesture.swiping && dx > 14 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    clearTimeout(ui.gesture.timer);
    ui.gesture.swiping = true;
    ui.gesture.source.classList.add('swiping-right');
  }
  if (ui.gesture.swiping) {
    event.preventDefault();
    ui.gesture.dx = Math.max(0, dx);
    ui.gesture.source.style.transform = `translateX(${Math.min(ui.gesture.dx, 88)}px)`;
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
  if (event.target.matches('[data-new-task-input]')) ui.inlineValue = event.target.value;
});

document.addEventListener('focusout', event => {
  if (event.target.matches('[data-new-task-input]')) commitInlineTask(event.target);
  if (event.target.id === 'checklist-task-title') saveTaskSheetTitle(event.target);
});

document.addEventListener('keydown', event => {
  if (event.target.matches('[data-new-task-input]')) {
    if (event.key === 'Enter') { event.preventDefault(); event.target.blur(); }
    if (event.key === 'Escape') { ui.inlineEditingId = ''; ui.inlineValue = ''; removeBlankTask(event.target.dataset.taskId); }
    return;
  }
  if (event.target.id !== 'checklist-task-title') return;
  if (event.key === 'Enter') { event.preventDefault(); event.target.blur(); }
  if (event.key === 'Escape') {
    const task = store.getState().tasks.find(item => item.id === event.target.dataset.taskId);
    event.target.value = task?.title || '';
    event.target.blur();
  }
});

document.addEventListener('click', event => {
  if (Date.now() < ui.suppressClickUntil) { event.preventDefault(); return; }
  const target = event.target.closest('[data-action]');
  if (!target || router.getRoute().split('/')[0] !== 'tasks') return;
  const action = target.dataset.action;
  if (action === 'add-empty-task') addBlankTask();
  if (action === 'add-subtask') addBlankTask(target.dataset.taskId);
  if (action === 'toggle-checklist-complete') toggleComplete(target.dataset.taskId);
  if (action === 'open-checklist-settings') openTaskSheet(target.dataset.taskId);
  if (action === 'toggle-main-task') toggleMainTask(target.dataset.taskId, target.checked);
  if (action === 'open-task-date-picker') overlayRoot.innerHTML = datePickerSheet(target.dataset.taskId);
  if (action === 'save-task-due') saveDueDate(target.dataset.taskId);
  if (action === 'clear-task-due') clearDueDate(target.dataset.taskId);
  if (action === 'toggle-completed-tasks') store.updatePreferences({ showCompletedTasks: store.getState().preferences?.showCompletedTasks === false });
  if (action === 'set-checklist-sort') store.updatePreferences({ taskSortMode: target.dataset.sort });
  if (action === 'tasks-undo' && store.undoLast()) showToast('Last change undone.');
});

window.addEventListener('hashchange', () => requestAnimationFrame(renderTasks));
store.subscribe(() => { ensureChecklistModel(); requestAnimationFrame(renderTasks); });
ensureChecklistModel();
requestAnimationFrame(renderTasks);