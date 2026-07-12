const STORAGE_KEY = 'nudge.prototype.v4';

const houseRooms = [
  ['kitchen', 'Kitchen', '🍳'],
  ['living-room', 'Living Room', '🛋️'],
  ['dining-room', 'Dining Room', '🍽️'],
  ['bathroom', 'Bathroom', '🛁'],
  ['bedroom', 'Bedroom', '🛏️'],
  ['office', 'Office', '💻'],
  ['laundry', 'Laundry', '🧺'],
  ['garage', 'Garage', '🧰'],
  ['hallway', 'Hallway', '🚪'],
  ['general', 'General House', '🏠']
];

export const defaultState = Object.freeze({
  user: { name: 'Omar', theme: 'light' },
  preferences: {
    compact: true,
    interventionsEnabled: true,
    interventionStrength: 'balanced'
  },
  progress: { completedToday: 4, totalToday: 9 },
  quickWinIndex: 0,
  templates: [
    {
      id: 'default-house',
      name: 'House',
      icon: '🏠',
      description: 'Common rooms for a typical home.',
      suggestedSubareas: houseRooms.map(([id, name, icon]) => ({ id, name, icon }))
    },
    {
      id: 'default-car',
      name: 'Car',
      icon: '🚗',
      description: 'A simple area without required subdivisions.',
      suggestedSubareas: []
    },
    {
      id: 'default-personal',
      name: 'Personal',
      icon: '👤',
      description: 'Errands and responsibilities that are not tied to a place.',
      suggestedSubareas: []
    },
    {
      id: 'default-work',
      name: 'Work',
      icon: '💼',
      description: 'Work-related tasks and routines.',
      suggestedSubareas: []
    }
  ],
  areas: [
    {
      id: 'house',
      name: 'House',
      icon: '🏠',
      templateId: 'default-house',
      archived: false,
      subareas: houseRooms.map(([id, name, icon], index) => ({ id, name, icon, order: index, archived: false }))
    },
    { id: 'car', name: 'Car', icon: '🚗', templateId: 'default-car', archived: false, subareas: [] },
    { id: 'personal', name: 'Personal', icon: '👤', templateId: 'default-personal', archived: false, subareas: [] },
    { id: 'work', name: 'Work', icon: '💼', templateId: 'default-work', archived: false, subareas: [] }
  ],
  tasks: [
    { id: 'trash', title: 'Take out kitchen trash', type: 'chore', areaId: 'house', subareaId: 'kitchen', area: 'House', subarea: 'Kitchen', minutes: 3, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: 'As needed', nudge: true },
    { id: 'mirror', title: 'Clean bathroom mirror', type: 'chore', areaId: 'house', subareaId: 'bathroom', area: 'House', subarea: 'Bathroom', minutes: 5, due: 'Today', urgency: 'today', completed: false, grading: true, recurrence: 'Weekly', nudge: true },
    { id: 'package', title: 'Return package', type: 'task', areaId: 'personal', subareaId: '', area: 'Personal', subarea: '', minutes: 10, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: '', nudge: true },
    { id: 'bins', title: 'Put trash bins outside', type: 'chore', areaId: 'house', subareaId: 'general', area: 'House', subarea: 'General House', minutes: 4, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: 'Weekly', nudge: true },
    { id: 'filter', title: 'Replace HVAC filter', type: 'chore', areaId: 'house', subareaId: 'general', area: 'House', subarea: 'General House', minutes: 8, due: '2 days overdue', urgency: 'overdue', completed: false, grading: false, recurrence: 'Every 60 days', nudge: true },
    { id: 'registration', title: 'Schedule car registration renewal', type: 'task', areaId: 'car', subareaId: '', area: 'Car', subarea: '', minutes: 12, due: '5 days overdue', urgency: 'overdue', completed: false, grading: false, recurrence: '', nudge: true },
    { id: 'counters', title: 'Wipe kitchen counters', type: 'chore', areaId: 'house', subareaId: 'kitchen', area: 'House', subarea: 'Kitchen', minutes: 5, due: 'Tomorrow', urgency: 'upcoming', completed: false, grading: true, recurrence: 'Daily', nudge: true },
    { id: 'dishwasher', title: 'Empty dishwasher', type: 'chore', areaId: 'house', subareaId: 'kitchen', area: 'House', subarea: 'Kitchen', minutes: 4, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: 'As needed', nudge: true },
    { id: 'faucet', title: 'Replace cabinet handle', type: 'task', areaId: 'house', subareaId: 'kitchen', area: 'House', subarea: 'Kitchen', minutes: 20, due: 'This weekend', urgency: 'upcoming', completed: false, grading: false, recurrence: '', nudge: false }
  ],
  lists: [
    { id: 'groceries', name: 'Groceries', icon: '🛒', activeCount: 6, subtitle: 'Last used yesterday' },
    { id: 'restock', name: 'Household Restock', icon: '🧺', activeCount: 2, subtitle: 'Paper towels, dish soap' }
  ],
  activity: [
    { id: 'a1', title: 'Kitchen counters', detail: 'Light clean', time: '8:40 AM', icon: '✓' },
    { id: 'a2', title: 'Put dishes away', detail: 'Completed', time: '8:25 AM', icon: '✓' },
    { id: 'a3', title: 'Milk', detail: 'Added to Groceries', time: '7:55 AM', icon: '+' }
  ],
  lastUndo: null
});

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function mergeState(stored) {
  const base = cloneDefaultState();
  return {
    ...base,
    ...stored,
    user: { ...base.user, ...(stored.user || {}) },
    preferences: { ...base.preferences, ...(stored.preferences || {}) },
    progress: { ...base.progress, ...(stored.progress || {}) },
    templates: Array.isArray(stored.templates) ? stored.templates : base.templates,
    areas: Array.isArray(stored.areas) ? stored.areas : base.areas,
    tasks: Array.isArray(stored.tasks) ? stored.tasks : base.tasks,
    lists: Array.isArray(stored.lists) ? stored.lists : base.lists,
    activity: Array.isArray(stored.activity) ? stored.activity : base.activity
  };
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return cloneDefaultState();
    return mergeState(JSON.parse(stored));
  } catch (error) {
    console.warn('Unable to restore prototype state.', error);
    return cloneDefaultState();
  }
}

let state = loadState();
const listeners = new Set();

function snapshot() {
  return JSON.parse(JSON.stringify(state));
}

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach(listener => listener(state));
}

function activityFor(task, grade) {
  return {
    id: `activity-${Date.now()}`,
    title: task.title,
    detail: grade ? `${grade} completion` : 'Completed',
    time: 'Just now',
    icon: '✓'
  };
}

function slug(value) {
  return String(value || 'item').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `item-${Date.now()}`;
}

function areaNames(areaId, subareaId = '') {
  const area = state.areas.find(item => item.id === areaId);
  const subarea = area?.subareas?.find(item => item.id === subareaId);
  return { area: area?.name || '', subarea: subarea?.name || '' };
}

export const store = {
  getState() { return state; },

  setState(updater) {
    const next = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...next };
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  reset() {
    state = cloneDefaultState();
    notify();
  },

  cycleQuickWin() {
    const eligible = state.tasks.filter(task => !task.completed && task.nudge);
    if (!eligible.length) return;
    state = { ...state, quickWinIndex: (state.quickWinIndex + 1) % eligible.length };
    notify();
  },

  addTask(task) {
    const previous = snapshot();
    const names = areaNames(task.areaId, task.subareaId);
    const normalized = { ...task, area: task.area || names.area, subarea: task.subarea || names.subarea };
    state = {
      ...state,
      tasks: [...state.tasks, normalized],
      progress: normalized.urgency === 'today'
        ? { ...state.progress, totalToday: state.progress.totalToday + 1 }
        : state.progress,
      activity: [{ id: `activity-${Date.now()}`, title: normalized.title, detail: 'Added', time: 'Just now', icon: '+' }, ...state.activity].slice(0, 8),
      lastUndo: { label: `${normalized.title} added`, snapshot: previous }
    };
    notify();
  },

  completeTask(taskId, grade = '') {
    const task = state.tasks.find(item => item.id === taskId);
    if (!task || task.completed) return false;
    const previous = snapshot();
    state = {
      ...state,
      tasks: state.tasks.map(item => item.id === taskId ? { ...item, completed: true, completedAt: new Date().toISOString(), completionGrade: grade } : item),
      progress: task.urgency === 'today'
        ? { ...state.progress, completedToday: Math.min(state.progress.totalToday, state.progress.completedToday + 1) }
        : state.progress,
      activity: [activityFor(task, grade), ...state.activity].slice(0, 8),
      lastUndo: { label: `${task.title} completed`, snapshot: previous }
    };
    notify();
    return true;
  },

  addArea({ name, icon = '📍', templateId = '', includeSuggestedSubareas = false }) {
    const previous = snapshot();
    const idBase = slug(name);
    let id = idBase;
    let suffix = 2;
    while (state.areas.some(area => area.id === id)) id = `${idBase}-${suffix++}`;
    const template = state.templates.find(item => item.id === templateId);
    const subareas = includeSuggestedSubareas && template
      ? template.suggestedSubareas.map((item, index) => ({ ...item, order: index, archived: false }))
      : [];
    const area = { id, name, icon, templateId, archived: false, subareas };
    state = {
      ...state,
      areas: [...state.areas, area],
      activity: [{ id: `activity-${Date.now()}`, title: name, detail: 'Area added', time: 'Just now', icon: '+' }, ...state.activity].slice(0, 8),
      lastUndo: { label: `${name} added`, snapshot: previous }
    };
    notify();
    return area;
  },

  updateArea(areaId, changes) {
    const previous = snapshot();
    state = {
      ...state,
      areas: state.areas.map(area => area.id === areaId ? { ...area, ...changes } : area),
      tasks: state.tasks.map(task => task.areaId === areaId ? { ...task, area: changes.name || task.area } : task),
      lastUndo: { label: 'Area updated', snapshot: previous }
    };
    notify();
  },

  addSubarea(areaId, { name, icon = '🚪' }) {
    const previous = snapshot();
    const area = state.areas.find(item => item.id === areaId);
    if (!area) return null;
    const idBase = slug(name);
    let id = idBase;
    let suffix = 2;
    while (area.subareas.some(item => item.id === id)) id = `${idBase}-${suffix++}`;
    const subarea = { id, name, icon, order: area.subareas.length, archived: false };
    state = {
      ...state,
      areas: state.areas.map(item => item.id === areaId ? { ...item, subareas: [...item.subareas, subarea] } : item),
      lastUndo: { label: `${name} added`, snapshot: previous }
    };
    notify();
    return subarea;
  },

  updateSubarea(areaId, subareaId, changes) {
    const previous = snapshot();
    state = {
      ...state,
      areas: state.areas.map(area => area.id === areaId
        ? { ...area, subareas: area.subareas.map(item => item.id === subareaId ? { ...item, ...changes } : item) }
        : area),
      tasks: state.tasks.map(task => task.areaId === areaId && task.subareaId === subareaId ? { ...task, subarea: changes.name || task.subarea } : task),
      lastUndo: { label: 'Room updated', snapshot: previous }
    };
    notify();
  },

  applyTemplate(areaId, templateId) {
    const template = state.templates.find(item => item.id === templateId);
    const area = state.areas.find(item => item.id === areaId);
    if (!template || !area) return;
    const previous = snapshot();
    const existing = new Set(area.subareas.map(item => item.name.toLowerCase()));
    const additions = template.suggestedSubareas
      .filter(item => !existing.has(item.name.toLowerCase()))
      .map((item, index) => ({ ...item, order: area.subareas.length + index, archived: false }));
    state = {
      ...state,
      areas: state.areas.map(item => item.id === areaId ? { ...item, templateId, subareas: [...item.subareas, ...additions] } : item),
      lastUndo: { label: `${template.name} template applied`, snapshot: previous }
    };
    notify();
  },

  undoLast() {
    if (!state.lastUndo?.snapshot) return false;
    state = { ...state.lastUndo.snapshot, lastUndo: null };
    notify();
    return true;
  },

  clearUndo() {
    if (!state.lastUndo) return;
    state = { ...state, lastUndo: null };
    notify();
  }
};