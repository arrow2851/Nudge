import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const toastRoot = document.querySelector('#toast-root');

const ui = {
  gesture: null,
  suppressClickUntil: 0,
  toastTimer: null
};

const clone = value => JSON.parse(JSON.stringify(value));
const routeRoot = () => router.getRoute().split('/')[0];

function showToast(message) {
  clearTimeout(ui.toastTimer);
  toastRoot.innerHTML = `<div class="toast"><span>${message}</span></div>`;
  ui.toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, 2200);
}

function taskContext(target) {
  if (routeRoot() !== 'tasks') return null;
  const card = target.closest('[data-task-drag-source]');
  if (!card || target.closest('.task-checkbox, .task-subtask-add, [data-new-task-input]')) return null;
  const node = card.closest('.checklist-shell[data-task-id]');
  if (!node) return null;
  const isRoot = !node.parentElement?.closest('.subtask-list');
  const previousRoot = isRoot
    ? [...node.parentElement.children].slice(0, [...node.parentElement.children].indexOf(node)).reverse().find(element => element.matches('.checklist-shell[data-task-id]'))
    : null;
  return {
    kind: 'task',
    id: card.dataset.taskId,
    source: card,
    dragNode: node,
    isRoot,
    previousId: previousRoot?.dataset.taskId || ''
  };
}

function listContext(target) {
  if (routeRoot() !== 'lists' || !router.getRoute().split('/')[1]) return null;
  const row = target.closest('[data-list-row]');
  if (!row || target.closest('.simple-list-check, .list-subitem-add, [data-new-list-item-input]')) return null;
  const subitemNode = row.closest('.list-subitem-shell');
  const rootNode = row.closest('.list-item-tree[data-item-id]');
  const dragNode = subitemNode || rootNode;
  if (!dragNode) return null;
  const isRoot = Boolean(rootNode && !subitemNode);
  const previousRoot = isRoot
    ? [...rootNode.parentElement.children].slice(0, [...rootNode.parentElement.children].indexOf(rootNode)).reverse().find(element => element.matches('.list-item-tree[data-item-id]'))
    : null;
  return {
    kind: 'list',
    id: row.dataset.itemId,
    listId: row.dataset.listId,
    source: row,
    dragNode,
    isRoot,
    previousId: previousRoot?.dataset.itemId || ''
  };
}

function contextFor(target) {
  return taskContext(target) || listContext(target);
}

function taskById(id, state = store.getState()) {
  return state.tasks.find(task => task.id === id);
}

function listAndItem(listId, itemId, state = store.getState()) {
  const list = state.lists.find(entry => entry.id === listId);
  return { list, item: list?.items.find(entry => entry.id === itemId) };
}

function swipeEligibility(context) {
  if (!context.isRoot) return { allowed: false, label: 'Already a subitem' };
  if (!context.previousId) return { allowed: false, label: 'Nothing above' };
  if (context.kind === 'task') {
    const state = store.getState();
    const hasChildren = state.tasks.some(task => task.parentTaskId === context.id);
    return hasChildren
      ? { allowed: false, label: 'Move subtasks first' }
      : { allowed: true, label: 'Make subtask' };
  }
  const { list } = listAndItem(context.listId, context.id);
  const hasChildren = list?.items.some(item => item.parentItemId === context.id);
  return hasChildren
    ? { allowed: false, label: 'Move subitems first' }
    : { allowed: true, label: 'Make subitem' };
}

function makeSwipeCue(context, label) {
  const cue = document.createElement('div');
  cue.className = 'gesture-swipe-cue';
  cue.textContent = label;
  const rect = context.source.getBoundingClientRect();
  cue.style.height = `${rect.height}px`;
  context.dragNode.classList.add('gesture-swipe-host');
  context.dragNode.insertBefore(cue, context.dragNode.firstChild);
  return cue;
}

function beginSwipe(event) {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode) return;
  clearTimeout(gesture.holdTimer);
  const eligibility = swipeEligibility(gesture.context);
  gesture.mode = 'swipe';
  gesture.allowed = eligibility.allowed;
  gesture.cue = makeSwipeCue(gesture.context, eligibility.label);
  gesture.context.source.classList.add('gesture-swiping');
  document.body.classList.add('gesture-active');
  try { gesture.context.source.setPointerCapture?.(gesture.pointerId); } catch (_) {}
  event.preventDefault();
}

function makePlaceholder(node) {
  const rect = node.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.className = 'gesture-drop-placeholder';
  placeholder.style.height = `${rect.height}px`;
  placeholder.style.width = `${rect.width}px`;
  node.parentElement.insertBefore(placeholder, node);
  return { placeholder, rect };
}

function beginDrag() {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode) return;
  gesture.mode = 'drag';
  const { placeholder, rect } = makePlaceholder(gesture.context.dragNode);
  gesture.placeholder = placeholder;
  gesture.originRect = rect;
  const node = gesture.context.dragNode;
  node.classList.add('gesture-floating');
  node.style.position = 'fixed';
  node.style.left = `${rect.left}px`;
  node.style.top = `${rect.top}px`;
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
  node.style.margin = '0';
  node.style.zIndex = '999';
  node.style.pointerEvents = 'none';
  document.body.classList.add('gesture-active');
  try { gesture.context.source.setPointerCapture?.(gesture.pointerId); } catch (_) {}
  navigator.vibrate?.(8);
}

function validTaskTarget(context, targetId) {
  const state = store.getState();
  const dragged = taskById(context.id, state);
  const target = taskById(targetId, state);
  if (!dragged || !target || dragged.id === target.id) return false;
  const oldParent = dragged.parentTaskId || '';
  const targetParent = target.parentTaskId || '';
  if (!oldParent && targetParent) return false;
  if (oldParent && targetParent && oldParent !== targetParent) return false;
  return true;
}

function validListTarget(context, targetId) {
  const { list, item: dragged } = listAndItem(context.listId, context.id);
  const target = list?.items.find(item => item.id === targetId);
  if (!list || !dragged || !target || dragged.id === target.id) return false;
  const oldParent = dragged.parentItemId || '';
  const targetParent = target.parentItemId || '';
  if (!oldParent && targetParent) return false;
  if (oldParent && targetParent && oldParent !== targetParent) return false;
  return true;
}

function targetFromPoint(context, x, y) {
  const element = document.elementFromPoint(x, y);
  if (context.kind === 'task') {
    const node = element?.closest('.checklist-shell[data-task-id]');
    const id = node?.dataset.taskId || '';
    return id && validTaskTarget(context, id) ? { id, node } : null;
  }
  const row = element?.closest('[data-list-row]');
  const id = row?.dataset.itemId || '';
  if (!id || row.dataset.listId !== context.listId || !validListTarget(context, id)) return null;
  const node = row.closest('.list-subitem-shell') || row.closest('.list-item-tree[data-item-id]');
  return node ? { id, node } : null;
}

function updateDrag(event) {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode !== 'drag') return;
  event.preventDefault();
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  gesture.context.dragNode.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  const target = targetFromPoint(gesture.context, event.clientX, event.clientY);
  if (!target) {
    gesture.targetId = '';
    return;
  }
  const rect = target.node.getBoundingClientRect();
  const after = event.clientY > rect.top + rect.height / 2;
  const parent = target.node.parentElement;
  const reference = after ? target.node.nextSibling : target.node;
  if (reference !== gesture.placeholder) parent.insertBefore(gesture.placeholder, reference);
  gesture.targetId = target.id;
  gesture.placeAfter = after;
}

function reindexTasks(tasks, parentId) {
  const siblings = tasks
    .filter(task => (task.parentTaskId || '') === parentId)
    .sort((a, b) => Number(a.checklistOrder || 0) - Number(b.checklistOrder || 0));
  const orders = new Map(siblings.map((task, index) => [task.id, index * 10]));
  return tasks.map(task => orders.has(task.id) ? { ...task, checklistOrder: orders.get(task.id) } : task);
}

function recalcTaskParent(tasks, parentId) {
  if (!parentId) return tasks;
  const children = tasks.filter(task => task.parentTaskId === parentId);
  if (!children.length) return tasks;
  const completed = children.every(task => task.completed);
  return tasks.map(task => task.id === parentId ? {
    ...task,
    completed,
    status: completed ? 'completed' : 'planned',
    completedAt: completed ? new Date().toISOString() : ''
  } : task);
}

function moveTask(context, targetId, placeAfter) {
  const current = store.getState();
  const dragged = taskById(context.id, current);
  const target = taskById(targetId, current);
  if (!dragged || !target || !validTaskTarget(context, targetId)) return;
  const oldParent = dragged.parentTaskId || '';
  const newParent = target.parentTaskId || '';
  let tasks = current.tasks.map(task => task.id === dragged.id ? {
    ...task,
    parentTaskId: newParent,
    isMainTask: newParent ? false : task.isMainTask
  } : task);
  const siblings = tasks
    .filter(task => task.id !== dragged.id && (task.parentTaskId || '') === newParent)
    .sort((a, b) => Number(a.checklistOrder || 0) - Number(b.checklistOrder || 0));
  const targetIndex = siblings.findIndex(task => task.id === target.id);
  siblings.splice(Math.max(0, targetIndex + (placeAfter ? 1 : 0)), 0, tasks.find(task => task.id === dragged.id));
  const orders = new Map(siblings.map((task, index) => [task.id, index * 10]));
  tasks = tasks.map(task => orders.has(task.id) ? { ...task, checklistOrder: orders.get(task.id) } : task);
  tasks = reindexTasks(tasks, oldParent);
  tasks = recalcTaskParent(tasks, oldParent);
  tasks = recalcTaskParent(tasks, newParent);
  store.setState({
    tasks,
    preferences: { ...current.preferences, taskSortMode: 'manual' },
    lastUndo: { label: 'Task moved', snapshot: clone(current) }
  });
}

function reindexListItems(items, parentId) {
  const siblings = items
    .filter(item => (item.parentItemId || '') === parentId)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  const orders = new Map(siblings.map((item, index) => [item.id, index * 10]));
  return items.map(item => orders.has(item.id) ? { ...item, order: orders.get(item.id) } : item);
}

function recalcListParent(items, parentId) {
  if (!parentId) return items;
  const children = items.filter(item => item.parentItemId === parentId);
  if (!children.length) return items;
  const completed = children.every(item => item.completed);
  return items.map(item => item.id === parentId ? {
    ...item,
    completed,
    completedAt: completed ? new Date().toISOString() : ''
  } : item);
}

function moveListItem(context, targetId, placeAfter) {
  const current = store.getState();
  const { list, item: dragged } = listAndItem(context.listId, context.id, current);
  const target = list?.items.find(item => item.id === targetId);
  if (!list || !dragged || !target || !validListTarget(context, targetId)) return;
  const oldParent = dragged.parentItemId || '';
  const newParent = target.parentItemId || '';
  let items = list.items.map(item => item.id === dragged.id ? {
    ...item,
    parentItemId: newParent,
    isMainItem: newParent ? false : item.isMainItem
  } : item);
  const siblings = items
    .filter(item => item.id !== dragged.id && (item.parentItemId || '') === newParent)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  const targetIndex = siblings.findIndex(item => item.id === target.id);
  siblings.splice(Math.max(0, targetIndex + (placeAfter ? 1 : 0)), 0, items.find(item => item.id === dragged.id));
  const orders = new Map(siblings.map((item, index) => [item.id, index * 10]));
  items = items.map(item => orders.has(item.id) ? { ...item, order: orders.get(item.id) } : item);
  items = reindexListItems(items, oldParent);
  items = recalcListParent(items, oldParent);
  items = recalcListParent(items, newParent);
  store.setState({
    lists: current.lists.map(entry => entry.id === list.id ? { ...entry, items } : entry),
    lastUndo: { label: 'List item moved', snapshot: clone(current) }
  });
}

function indentTask(context) {
  const current = store.getState();
  const task = taskById(context.id, current);
  const parent = taskById(context.previousId, current);
  if (!task || !parent) return;
  const children = current.tasks.filter(item => item.parentTaskId === parent.id);
  const nextOrder = children.length ? Math.max(...children.map(item => Number(item.checklistOrder || 0))) + 10 : 0;
  let tasks = current.tasks.map(item => {
    if (item.id === parent.id) return { ...item, isMainTask: true };
    if (item.id === task.id) return { ...item, parentTaskId: parent.id, isMainTask: false, checklistOrder: nextOrder };
    return item;
  });
  tasks = recalcTaskParent(tasks, parent.id);
  store.setState({
    tasks,
    preferences: { ...current.preferences, taskSortMode: 'manual' },
    lastUndo: { label: 'Task indented', snapshot: clone(current) }
  });
  showToast(`Moved under ${parent.title || 'the item above'}.`);
}

function indentListItem(context) {
  const current = store.getState();
  const { list, item } = listAndItem(context.listId, context.id, current);
  const parent = list?.items.find(entry => entry.id === context.previousId);
  if (!list || !item || !parent) return;
  const children = list.items.filter(entry => entry.parentItemId === parent.id);
  const nextOrder = children.length ? Math.max(...children.map(entry => Number(entry.order || 0))) + 10 : 0;
  let items = list.items.map(entry => {
    if (entry.id === parent.id) return { ...entry, isMainItem: true };
    if (entry.id === item.id) return { ...entry, parentItemId: parent.id, isMainItem: false, order: nextOrder };
    return entry;
  });
  items = recalcListParent(items, parent.id);
  store.setState({
    lists: current.lists.map(entry => entry.id === list.id ? { ...entry, items } : entry),
    lastUndo: { label: 'List item indented', snapshot: clone(current) }
  });
  showToast(`Moved under ${parent.name || 'the item above'}.`);
}

function updateSwipe(event) {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode !== 'swipe') return;
  event.preventDefault();
  const raw = Math.max(0, event.clientX - gesture.startX);
  const distance = raw > 108 ? 108 + (raw - 108) * .18 : raw;
  gesture.distance = distance;
  gesture.context.source.style.transform = `translate3d(${distance}px, 0, 0)`;
  const armed = gesture.allowed && distance >= 58;
  if (armed !== gesture.armed) {
    gesture.armed = armed;
    gesture.context.source.classList.toggle('gesture-swipe-armed', armed);
    if (armed) navigator.vibrate?.(8);
  }
}

function cleanupGesture(animateBack = false) {
  const gesture = ui.gesture;
  if (!gesture) return;
  clearTimeout(gesture.holdTimer);
  document.body.classList.remove('gesture-active');

  const finish = () => {
    gesture.cue?.remove();
    gesture.context.dragNode.classList.remove('gesture-swipe-host');
    gesture.context.source.classList.remove('gesture-swiping', 'gesture-swipe-armed');
    gesture.context.source.style.transform = '';
    gesture.context.source.style.transition = '';
    gesture.placeholder?.remove();
    const node = gesture.context.dragNode;
    node.classList.remove('gesture-floating');
    node.style.position = '';
    node.style.left = '';
    node.style.top = '';
    node.style.width = '';
    node.style.height = '';
    node.style.margin = '';
    node.style.zIndex = '';
    node.style.pointerEvents = '';
    node.style.transform = '';
  };

  if (animateBack && gesture.mode === 'swipe') {
    gesture.context.source.style.transition = 'transform 180ms ease';
    gesture.context.source.style.transform = 'translate3d(0, 0, 0)';
    setTimeout(finish, 190);
  } else {
    finish();
  }
}

function finishGesture(event) {
  const gesture = ui.gesture;
  if (!gesture || event.pointerId !== gesture.pointerId) return;
  clearTimeout(gesture.holdTimer);
  if (gesture.mode === 'drag') {
    const targetId = gesture.targetId;
    const placeAfter = gesture.placeAfter;
    const context = gesture.context;
    cleanupGesture(false);
    ui.gesture = null;
    ui.suppressClickUntil = Date.now() + 350;
    if (targetId) {
      if (context.kind === 'task') moveTask(context, targetId, placeAfter);
      else moveListItem(context, targetId, placeAfter);
    }
    return;
  }

  if (gesture.mode === 'swipe') {
    const shouldIndent = gesture.allowed && gesture.distance >= 58;
    const context = gesture.context;
    cleanupGesture(!shouldIndent);
    ui.gesture = null;
    ui.suppressClickUntil = Date.now() + 350;
    if (shouldIndent) {
      if (context.kind === 'task') indentTask(context);
      else indentListItem(context);
    }
    return;
  }

  ui.gesture = null;
}

document.addEventListener('pointerdown', event => {
  const context = contextFor(event.target);
  if (!context) return;
  event.stopImmediatePropagation();
  ui.gesture = {
    context,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    mode: '',
    distance: 0,
    targetId: '',
    placeAfter: false,
    armed: false,
    holdTimer: setTimeout(beginDrag, 155)
  };
}, { capture: true });

document.addEventListener('pointermove', event => {
  const gesture = ui.gesture;
  if (!gesture || event.pointerId !== gesture.pointerId) return;
  event.stopImmediatePropagation();
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;

  if (!gesture.mode && dx > 7 && Math.abs(dx) > Math.abs(dy) * 1.05) beginSwipe(event);
  if (!gesture.mode && Math.hypot(dx, dy) > 10) {
    clearTimeout(gesture.holdTimer);
    ui.gesture = null;
    return;
  }

  if (gesture.mode === 'swipe') updateSwipe(event);
  if (gesture.mode === 'drag') updateDrag(event);
}, { capture: true, passive: false });

document.addEventListener('pointerup', event => {
  if (!ui.gesture || event.pointerId !== ui.gesture.pointerId) return;
  event.stopImmediatePropagation();
  finishGesture(event);
}, { capture: true });

document.addEventListener('pointercancel', event => {
  if (!ui.gesture || event.pointerId !== ui.gesture.pointerId) return;
  event.stopImmediatePropagation();
  cleanupGesture(true);
  ui.gesture = null;
}, { capture: true });

document.addEventListener('click', event => {
  if (Date.now() < ui.suppressClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, { capture: true });