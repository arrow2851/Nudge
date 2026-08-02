const TASK_STORAGE_KEY = 'nudge-design-lab-task-hierarchy-v1';

const clone = value => typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value));

const task = (id, title, options = {}) => ({
  id,
  title,
  completed: Boolean(options.completed),
  main: Boolean(options.main),
  time: options.time || '',
  children: (options.children || []).map(child => task(child.id, child.title, child))
});

const NORMAL_TASKS = [
  task('weekend-errands', 'Plan weekend errands', {
    main: true,
    time: '25m',
    children: [
      { id: 'grocery-list', title: 'Make grocery list', completed: true, time: '8m' },
      { id: 'pharmacy-stop', title: 'Plan pharmacy stop', time: '10m' },
      { id: 'car-wash', title: 'Schedule car wash' }
    ]
  }),
  task('reply-landlord', 'Reply to landlord', { time: '10m' }),
  task('book-dentist', 'Book dentist appointment'),
  task('expense-report', 'Submit expense report', { completed: true, time: '5m' })
];

function groupCompleted(items) {
  return [
    ...items.filter(item => !item.completed),
    ...items.filter(item => item.completed)
  ];
}

function groupState(state) {
  state.tasks.forEach(item => { item.children = groupCompleted(item.children); });
  state.tasks = groupCompleted(state.tasks);
}

function seedTasks(scenario) {
  if (scenario === 'new') return [];
  if (scenario === 'clear') {
    return NORMAL_TASKS.map(item => {
      const copy = clone(item);
      copy.completed = true;
      copy.children.forEach(child => { child.completed = true; });
      return copy;
    });
  }
  if (scenario === 'backlog') {
    return [
      ...clone(NORMAL_TASKS),
      task('insurance-paperwork', 'Finish insurance paperwork', { time: '30m' }),
      task('closet-reset', 'Closet reset', {
        main: true,
        time: '45m',
        children: [
          { id: 'closet-donate', title: 'Fill donation bag' },
          { id: 'closet-fold', title: 'Refold top shelf' },
          { id: 'closet-shoes', title: 'Return shoes to rack' },
          { id: 'closet-laundry', title: 'Move laundry to hamper', completed: true }
        ]
      }),
      task('renew-library', 'Renew library books')
    ];
  }
  if (scenario === 'large') {
    return [
      ...clone(NORMAL_TASKS),
      task('family-calendar', 'Update family calendar', {
        main: true,
        time: '20m',
        children: [
          { id: 'calendar-school', title: 'Add school dates', completed: true },
          { id: 'calendar-medical', title: 'Add appointments' },
          { id: 'calendar-birthdays', title: 'Add birthdays' }
        ]
      }),
      task('return-package', 'Return package', { time: '15m' }),
      task('replace-filter', 'Order replacement air filter'),
      task('call-electrician', 'Call electrician')
    ];
  }
  if (scenario === 'long') {
    return [
      task('travel-prep', 'Prepare everything needed for the upcoming weekend trip without forgetting the small items that usually get left behind', {
        main: true,
        time: '1h',
        children: [
          { id: 'travel-documents', title: 'Place identification, reservations, and confirmation numbers together in the travel folder', completed: true },
          { id: 'travel-chargers', title: 'Collect phone, watch, laptop, and portable battery chargers' },
          { id: 'travel-snacks', title: 'Pack water and a few easy snacks for the drive' }
        ]
      }),
      task('follow-up-email', 'Send the detailed follow-up email with the revised timeline and all outstanding questions', { time: '20m' }),
      task('storage-bin', 'Measure the hallway storage space before ordering replacement bins')
    ];
  }
  return clone(NORMAL_TASKS);
}

function initialState(scenario) {
  const state = {
    scenario,
    nextId: 100,
    hideCompleted: false,
    openSettingsId: null,
    tasks: seedTasks(scenario)
  };
  groupState(state);
  return state;
}

function readStore() {
  try {
    return JSON.parse(sessionStorage.getItem(TASK_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    sessionStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // The in-memory result remains usable when storage is unavailable.
  }
}

function normalize(state, scenario) {
  const safe = state && Array.isArray(state.tasks) ? state : initialState(scenario);
  safe.scenario = scenario;
  safe.nextId = Number.isFinite(safe.nextId) ? safe.nextId : 100;
  safe.hideCompleted = Boolean(safe.hideCompleted);
  safe.openSettingsId = safe.openSettingsId || null;
  safe.tasks = safe.tasks.map(item => task(item.id, item.title ?? '', item));
  groupState(safe);
  return safe;
}

export function getTaskState(scenario) {
  const store = readStore();
  const state = normalize(store[scenario], scenario);
  if (!store[scenario]) {
    store[scenario] = state;
    writeStore(store);
  }
  return clone(state);
}

function mutate(scenario, change) {
  const store = readStore();
  const state = normalize(store[scenario], scenario);
  const result = change(state);
  groupState(state);
  store[scenario] = state;
  writeStore(store);
  return { state: clone(state), result };
}

function topIndex(state, id) {
  return state.tasks.findIndex(item => item.id === id);
}

function parentFor(state, id) {
  return state.tasks.find(item => item.children.some(child => child.id === id)) || null;
}

function findTask(state, id) {
  const top = state.tasks.find(item => item.id === id);
  if (top) return { task: top, parent: null };
  const parent = parentFor(state, id);
  return { task: parent?.children.find(child => child.id === id) || null, parent };
}

function syncParent(parent) {
  if (!parent?.children.length) return;
  parent.completed = parent.children.every(child => child.completed);
}

function newTask(state) {
  const id = `task-${state.scenario}-${state.nextId++}`;
  return task(id, '', { time: '', main: false });
}

export function addTask(scenario, { parentId = null, position = 'bottom' } = {}) {
  return mutate(scenario, state => {
    const created = newTask(state);
    if (parentId) {
      const parent = state.tasks.find(item => item.id === parentId);
      if (!parent) return null;
      parent.main = true;
      parent.completed = false;
      parent.children.push(created);
    } else if (position === 'top') {
      state.tasks.unshift(created);
    } else {
      const firstCompleted = state.tasks.findIndex(item => item.completed);
      if (firstCompleted < 0) state.tasks.push(created);
      else state.tasks.splice(firstCompleted, 0, created);
    }
    state.openSettingsId = null;
    return created.id;
  });
}

export function updateTaskTitle(scenario, id, title) {
  return mutate(scenario, state => {
    const found = findTask(state, id).task;
    if (!found) return false;
    found.title = title;
    return true;
  });
}

export function toggleTaskCompletion(scenario, id) {
  return mutate(scenario, state => {
    const found = findTask(state, id);
    if (!found.task) return false;
    const next = !found.task.completed;
    found.task.completed = next;
    if (!found.parent && found.task.children.length) {
      found.task.children.forEach(child => { child.completed = next; });
    }
    if (found.parent) syncParent(found.parent);
    return next;
  });
}

export function toggleMainTask(scenario, id) {
  return mutate(scenario, state => {
    const index = topIndex(state, id);
    if (index < 0) return { changed: false, released: 0 };
    const item = state.tasks[index];
    if (!item.main) {
      item.main = true;
      item.completed = item.children.length ? item.children.every(child => child.completed) : item.completed;
      return { changed: true, released: 0, main: true };
    }
    const released = item.children.map(child => ({ ...child, main: false, children: [] }));
    item.main = false;
    item.children = [];
    state.tasks.splice(index + 1, 0, ...released);
    return { changed: true, released: released.length, main: false };
  });
}

export function toggleTaskSettings(scenario, id) {
  return mutate(scenario, state => {
    state.openSettingsId = state.openSettingsId === id ? null : id;
    return state.openSettingsId;
  });
}

export function moveTask(scenario, id, direction) {
  return mutate(scenario, state => {
    const parent = parentFor(state, id);
    const list = parent ? parent.children : state.tasks;
    const item = list.find(candidate => candidate.id === id);
    if (!item) return false;
    const peers = list.filter(candidate => candidate.completed === item.completed);
    const peerIndex = peers.findIndex(candidate => candidate.id === id);
    const targetPeer = peers[peerIndex + direction];
    if (!targetPeer) return false;
    const itemIndex = list.findIndex(candidate => candidate.id === id);
    const targetIndex = list.findIndex(candidate => candidate.id === targetPeer.id);
    list[itemIndex] = targetPeer;
    list[targetIndex] = item;
    return true;
  });
}

export function moveTaskBefore(scenario, sourceId, targetId, sourceParentId = '', targetParentId = '') {
  return mutate(scenario, state => {
    if ((sourceParentId || '') !== (targetParentId || '') || sourceId === targetId) return false;
    const parent = sourceParentId ? state.tasks.find(item => item.id === sourceParentId) : null;
    const list = parent ? parent.children : state.tasks;
    const sourceIndex = list.findIndex(item => item.id === sourceId);
    const targetIndex = list.findIndex(item => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || list[sourceIndex].completed !== list[targetIndex].completed) return false;
    const [item] = list.splice(sourceIndex, 1);
    const adjustedTarget = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    list.splice(adjustedTarget, 0, item);
    return true;
  });
}

export function indentTask(scenario, id) {
  return mutate(scenario, state => {
    const index = topIndex(state, id);
    if (index <= 0) return false;
    const item = state.tasks[index];
    if (item.children.length) return false;
    const parent = state.tasks[index - 1];
    if (parent.completed !== item.completed) return false;
    state.tasks.splice(index, 1);
    parent.main = true;
    item.main = false;
    parent.children.push(item);
    syncParent(parent);
    return true;
  });
}

export function unindentTask(scenario, id) {
  return mutate(scenario, state => {
    const parentIndex = state.tasks.findIndex(item => item.children.some(child => child.id === id));
    if (parentIndex < 0) return false;
    const parent = state.tasks[parentIndex];
    const childIndex = parent.children.findIndex(child => child.id === id);
    const [child] = parent.children.splice(childIndex, 1);
    child.main = false;
    child.children = [];
    state.tasks.splice(parentIndex + 1, 0, child);
    if (!parent.children.length) parent.main = false;
    else syncParent(parent);
    return true;
  });
}

export function setHideCompleted(scenario, hideCompleted) {
  return mutate(scenario, state => {
    state.hideCompleted = Boolean(hideCompleted);
    return state.hideCompleted;
  });
}

export function clearTaskState() {
  try {
    sessionStorage.removeItem(TASK_STORAGE_KEY);
  } catch {
    // No action needed.
  }
}

export function taskProgress(item) {
  const total = item.children.length;
  const done = item.children.filter(child => child.completed).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
}
