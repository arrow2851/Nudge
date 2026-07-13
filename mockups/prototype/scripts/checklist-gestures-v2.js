import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');
const toastRoot = document.querySelector('#toast-root');
const ui = { gesture: null, suppressClickUntil: 0, toastTimer: null };
const clone = value => JSON.parse(JSON.stringify(value));

function showToast(message) {
  clearTimeout(ui.toastTimer);
  const toast = document.createElement('div');
  toast.className = 'toast';
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);
  toastRoot.replaceChildren(toast);
  ui.toastTimer = setTimeout(() => toastRoot.replaceChildren(), 2200);
}

function taskContext(target) {
  if (router.getRoute().split('/')[0] !== 'tasks') return null;
  const source = target.closest('[data-task-drag-source]');
  if (!source || target.closest('.task-checkbox, .task-subtask-add, [data-new-task-input]')) return null;
  const dragNode = source.closest('.checklist-shell[data-task-id]');
  if (!dragNode) return null;
  const isRoot = !dragNode.parentElement?.closest('.subtask-list');
  const siblings = isRoot ? [...dragNode.parentElement.children].filter(node => node.matches('.checklist-shell[data-task-id]')) : [];
  const index = siblings.indexOf(dragNode);
  return {
    kind: 'task',
    id: source.dataset.taskId,
    source,
    dragNode,
    isRoot,
    previousId: index > 0 ? siblings[index - 1].dataset.taskId : ''
  };
}

function listContext(target) {
  const route = router.getRoute().split('/');
  if (route[0] !== 'lists' || !route[1]) return null;
  const source = target.closest('[data-list-row]');
  if (!source || target.closest('.simple-list-check, .list-subitem-add, [data-new-list-item-input]')) return null;
  const subitemNode = source.closest('.list-subitem-shell');
  const rootNode = source.closest('.list-item-tree[data-item-id]');
  const dragNode = subitemNode || rootNode;
  if (!dragNode) return null;
  const isRoot = Boolean(rootNode && !subitemNode);
  const siblings = isRoot ? [...rootNode.parentElement.children].filter(node => node.matches('.list-item-tree[data-item-id]')) : [];
  const index = siblings.indexOf(rootNode);
  return {
    kind: 'list',
    id: source.dataset.itemId,
    listId: source.dataset.listId,
    source,
    dragNode,
    isRoot,
    previousId: index > 0 ? siblings[index - 1].dataset.itemId : ''
  };
}

function contextFor(target) {
  return taskContext(target) || listContext(target);
}

function modelFor(context, state = store.getState()) {
  if (context.kind === 'task') {
    return {
      items: state.tasks,
      parentField: 'parentTaskId',
      mainField: 'isMainTask',
      orderField: 'checklistOrder',
      nameField: 'title'
    };
  }
  const list = state.lists.find(entry => entry.id === context.listId);
  return {
    list,
    items: list?.items || [],
    parentField: 'parentItemId',
    mainField: 'isMainItem',
    orderField: 'order',
    nameField: 'name'
  };
}

function saveItems(context, current, items, label) {
  if (context.kind === 'task') {
    store.setState({
      tasks: items,
      preferences: { ...current.preferences, taskSortMode: 'manual' },
      lastUndo: { label, snapshot: clone(current) }
    });
    return;
  }
  store.setState({
    lists: current.lists.map(list => list.id === context.listId ? { ...list, items } : list),
    lastUndo: { label, snapshot: clone(current) }
  });
}

function setCompletion(context, item, completed) {
  if (context.kind === 'task') {
    return {
      ...item,
      completed,
      status: completed ? 'completed' : 'planned',
      completedAt: completed ? new Date().toISOString() : '',
      urgency: completed ? 'none' : item.urgency
    };
  }
  return { ...item, completed, completedAt: completed ? new Date().toISOString() : '' };
}

function recalcParent(context, items, parentId) {
  if (!parentId) return items;
  const { parentField } = modelFor(context);
  const children = items.filter(item => (item[parentField] || '') === parentId);
  if (!children.length) return items;
  const completed = children.every(item => item.completed);
  return items.map(item => item.id === parentId ? setCompletion(context, item, completed) : item);
}

function reindex(context, items, parentId) {
  const { parentField, orderField } = modelFor(context);
  const siblings = items
    .filter(item => (item[parentField] || '') === parentId)
    .sort((a, b) => Number(a[orderField] || 0) - Number(b[orderField] || 0));
  const order = new Map(siblings.map((item, index) => [item.id, index * 10]));
  return items.map(item => order.has(item.id) ? { ...item, [orderField]: order.get(item.id) } : item);
}

function swipeEligibility(context) {
  if (!context.isRoot) return { allowed: false, label: 'Already a subitem' };
  if (!context.previousId) return { allowed: false, label: 'Nothing above' };
  const { items, parentField } = modelFor(context);
  const hasChildren = items.some(item => item[parentField] === context.id);
  return hasChildren
    ? { allowed: false, label: context.kind === 'task' ? 'Move subtasks first' : 'Move subitems first' }
    : { allowed: true, label: context.kind === 'task' ? 'Make subtask' : 'Make subitem' };
}

function indent(context) {
  const current = store.getState();
  const { items, parentField, mainField, orderField, nameField } = modelFor(context, current);
  const item = items.find(entry => entry.id === context.id);
  const parent = items.find(entry => entry.id === context.previousId);
  if (!item || !parent) return;
  const children = items.filter(entry => entry[parentField] === parent.id);
  const nextOrder = children.length ? Math.max(...children.map(entry => Number(entry[orderField] || 0))) + 10 : 0;
  let updated = items.map(entry => {
    if (entry.id === parent.id) return { ...entry, [mainField]: true };
    if (entry.id === item.id) return { ...entry, [parentField]: parent.id, [mainField]: false, [orderField]: nextOrder };
    return entry;
  });
  updated = recalcParent(context, updated, parent.id);
  saveItems(context, current, updated, context.kind === 'task' ? 'Task indented' : 'List item indented');
  showToast(`Moved under ${parent[nameField] || 'the item above'}.`);
}

function validTarget(context, targetId) {
  const { items, parentField } = modelFor(context);
  const dragged = items.find(item => item.id === context.id);
  const target = items.find(item => item.id === targetId);
  if (!dragged || !target || dragged.id === target.id) return false;
  const oldParent = dragged[parentField] || '';
  const targetParent = target[parentField] || '';
  if (!oldParent && targetParent) return false;
  if (oldParent && targetParent && oldParent !== targetParent) return false;
  return true;
}

function moveItem(context, targetId, placeAfter) {
  const current = store.getState();
  const { items, parentField, mainField, orderField } = modelFor(context, current);
  const dragged = items.find(item => item.id === context.id);
  const target = items.find(item => item.id === targetId);
  if (!dragged || !target || !validTarget(context, targetId)) return;
  const oldParent = dragged[parentField] || '';
  const newParent = target[parentField] || '';
  let updated = items.map(item => item.id === dragged.id ? {
    ...item,
    [parentField]: newParent,
    [mainField]: newParent ? false : item[mainField]
  } : item);
  const siblings = updated
    .filter(item => item.id !== dragged.id && (item[parentField] || '') === newParent)
    .sort((a, b) => Number(a[orderField] || 0) - Number(b[orderField] || 0));
  const targetIndex = siblings.findIndex(item => item.id === target.id);
  siblings.splice(Math.max(0, targetIndex + (placeAfter ? 1 : 0)), 0, updated.find(item => item.id === dragged.id));
  const order = new Map(siblings.map((item, index) => [item.id, index * 10]));
  updated = updated.map(item => order.has(item.id) ? { ...item, [orderField]: order.get(item.id) } : item);
  updated = reindex(context, updated, oldParent);
  updated = recalcParent(context, updated, oldParent);
  updated = recalcParent(context, updated, newParent);
  saveItems(context, current, updated, context.kind === 'task' ? 'Task moved' : 'List item moved');
}

function makeSwipeCue(context, label) {
  const cue = document.createElement('div');
  cue.className = 'gesture-swipe-cue';
  cue.textContent = label;
  cue.style.height = `${context.source.getBoundingClientRect().height}px`;
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

function beginDrag() {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode) return;
  gesture.mode = 'drag';
  const node = gesture.context.dragNode;
  const rect = node.getBoundingClientRect();
  const placeholder = document.createElement('div');
  placeholder.className = 'gesture-drop-placeholder';
  placeholder.style.height = `${rect.height}px`;
  placeholder.style.width = `${rect.width}px`;
  node.parentElement.insertBefore(placeholder, node);
  gesture.placeholder = placeholder;
  gesture.originRect = rect;
  node.classList.add('gesture-floating');
  Object.assign(node.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    zIndex: '999',
    pointerEvents: 'none'
  });
  document.body.classList.add('gesture-active');
  try { gesture.context.source.setPointerCapture?.(gesture.pointerId); } catch (_) {}
  navigator.vibrate?.(8);
}

function targetNodeForElement(context, element) {
  if (context.kind === 'task') {
    const node = element.closest?.('.checklist-shell[data-task-id]');
    const id = node?.dataset.taskId || '';
    return id && validTarget(context, id) ? { id, node } : null;
  }
  const row = element.closest?.('[data-list-row]');
  const id = row?.dataset.itemId || '';
  if (!id || row.dataset.listId !== context.listId || !validTarget(context, id)) return null;
  const node = row.closest('.list-subitem-shell') || row.closest('.list-item-tree[data-item-id]');
  return node ? { id, node } : null;
}

function targetFromPoint(context, x, y) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.classList?.contains('gesture-drop-placeholder')) continue;
    const target = targetNodeForElement(context, element);
    if (target && target.node !== context.dragNode && !context.dragNode.contains(target.node)) return target;
  }
  return null;
}

function captureLayout(parent) {
  if (!parent) return new Map();
  return new Map([...parent.children]
    .filter(node => !node.classList.contains('gesture-drop-placeholder') && !node.classList.contains('gesture-floating'))
    .map(node => [node, node.getBoundingClientRect()]));
}

function animateLayout(before) {
  requestAnimationFrame(() => {
    before.forEach((oldRect, node) => {
      if (!node.isConnected) return;
      const newRect = node.getBoundingClientRect();
      const delta = oldRect.top - newRect.top;
      if (Math.abs(delta) < 1) return;
      node.style.transition = 'none';
      node.style.transform = `translateY(${delta}px)`;
      requestAnimationFrame(() => {
        node.style.transition = 'transform 145ms ease';
        node.style.transform = '';
        setTimeout(() => { node.style.transition = ''; }, 170);
      });
    });
  });
}

function movePlaceholder(gesture, target, placeAfter) {
  const oldParent = gesture.placeholder.parentElement;
  const newParent = target.node.parentElement;
  const oldLayout = captureLayout(oldParent);
  const newLayout = oldParent === newParent ? oldLayout : captureLayout(newParent);
  const reference = placeAfter ? target.node.nextSibling : target.node;
  if (reference !== gesture.placeholder) newParent.insertBefore(gesture.placeholder, reference);
  animateLayout(oldLayout);
  if (oldParent !== newParent) animateLayout(newLayout);
}

function autoScroll(y) {
  const rect = screen.getBoundingClientRect();
  if (y < rect.top + 54) screen.scrollBy({ top: -9, behavior: 'auto' });
  if (y > rect.bottom - 54) screen.scrollBy({ top: 9, behavior: 'auto' });
}

function updateDrag(event) {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode !== 'drag') return;
  event.preventDefault();
  const dx = event.clientX - gesture.startX;
  const dy = event.clientY - gesture.startY;
  gesture.context.dragNode.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  autoScroll(event.clientY);
  const target = targetFromPoint(gesture.context, event.clientX, event.clientY);
  if (!target) return;
  const rect = target.node.getBoundingClientRect();
  const placeAfter = event.clientY > rect.top + rect.height / 2;
  if (target.id !== gesture.targetId || placeAfter !== gesture.placeAfter) {
    movePlaceholder(gesture, target, placeAfter);
    gesture.targetId = target.id;
    gesture.placeAfter = placeAfter;
  }
}

function updateSwipe(event) {
  const gesture = ui.gesture;
  if (!gesture || gesture.mode !== 'swipe') return;
  event.preventDefault();
  const raw = Math.max(0, event.clientX - gesture.startX);
  const distance = raw > 112 ? 112 + (raw - 112) * .18 : raw;
  gesture.distance = distance;
  gesture.context.source.style.transform = `translate3d(${distance}px, 0, 0)`;
  const armed = gesture.allowed && distance >= 54;
  if (armed !== gesture.armed) {
    gesture.armed = armed;
    gesture.context.source.classList.toggle('gesture-swipe-armed', armed);
    if (armed) navigator.vibrate?.(8);
  }
}

function cleanup(animateBack = false) {
  const gesture = ui.gesture;
  if (!gesture) return;
  clearTimeout(gesture.holdTimer);
  document.body.classList.remove('gesture-active');
  const finish = () => {
    gesture.cue?.remove();
    gesture.placeholder?.remove();
    gesture.context.dragNode.classList.remove('gesture-swipe-host', 'gesture-floating');
    gesture.context.source.classList.remove('gesture-swiping', 'gesture-swipe-armed');
    gesture.context.source.style.transform = '';
    gesture.context.source.style.transition = '';
    const node = gesture.context.dragNode;
    for (const property of ['position', 'left', 'top', 'width', 'height', 'margin', 'zIndex', 'pointerEvents', 'transform']) node.style[property] = '';
  };
  if (animateBack && gesture.mode === 'swipe') {
    gesture.context.source.style.transition = 'transform 180ms ease';
    gesture.context.source.style.transform = 'translate3d(0, 0, 0)';
    setTimeout(finish, 190);
  } else finish();
}

function finishGesture(event) {
  const gesture = ui.gesture;
  if (!gesture || event.pointerId !== gesture.pointerId) return;
  clearTimeout(gesture.holdTimer);
  if (gesture.mode === 'drag') {
    const { context, targetId, placeAfter } = gesture;
    cleanup(false);
    ui.gesture = null;
    ui.suppressClickUntil = Date.now() + 350;
    if (targetId) moveItem(context, targetId, placeAfter);
    return;
  }
  if (gesture.mode === 'swipe') {
    const shouldIndent = gesture.allowed && gesture.distance >= 54;
    const context = gesture.context;
    cleanup(!shouldIndent);
    ui.gesture = null;
    ui.suppressClickUntil = Date.now() + 350;
    if (shouldIndent) indent(context);
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
  if (!gesture.mode && dx > 6 && Math.abs(dx) > Math.abs(dy)) beginSwipe(event);
  if (!gesture.mode && Math.hypot(dx, dy) > 11) {
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
  cleanup(true);
  ui.gesture = null;
}, { capture: true });

document.addEventListener('click', event => {
  if (Date.now() < ui.suppressClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, { capture: true });