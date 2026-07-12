const STORAGE_KEY = 'nudge.prototype.v3';

export const defaultState = Object.freeze({
  user: { name: 'Omar', theme: 'light' },
  preferences: {
    compact: true,
    interventionsEnabled: true,
    interventionStrength: 'balanced'
  },
  progress: { completedToday: 4, totalToday: 9 },
  quickWinIndex: 0,
  tasks: [
    { id: 'trash', title: 'Take out kitchen trash', type: 'chore', area: 'House', subarea: 'Kitchen', minutes: 3, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: 'As needed', nudge: true },
    { id: 'mirror', title: 'Clean bathroom mirror', type: 'chore', area: 'House', subarea: 'Bathroom', minutes: 5, due: 'Today', urgency: 'today', completed: false, grading: true, recurrence: 'Weekly', nudge: true },
    { id: 'package', title: 'Return package', type: 'task', area: 'Personal', subarea: '', minutes: 10, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: '', nudge: true },
    { id: 'bins', title: 'Put trash bins outside', type: 'chore', area: 'House', subarea: '', minutes: 4, due: 'Today', urgency: 'today', completed: false, grading: false, recurrence: 'Weekly', nudge: true },
    { id: 'filter', title: 'Replace HVAC filter', type: 'chore', area: 'House', subarea: 'General', minutes: 8, due: '2 days overdue', urgency: 'overdue', completed: false, grading: false, recurrence: 'Every 60 days', nudge: true },
    { id: 'registration', title: 'Schedule car registration renewal', type: 'task', area: 'Car', subarea: '', minutes: 12, due: '5 days overdue', urgency: 'overdue', completed: false, grading: false, recurrence: '', nudge: true }
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

export const store = {
  getState() {
    return state;
  },

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
    const snapshot = JSON.parse(JSON.stringify(state));
    state = {
      ...state,
      tasks: [...state.tasks, task],
      progress: task.urgency === 'today'
        ? { ...state.progress, totalToday: state.progress.totalToday + 1 }
        : state.progress,
      activity: [{ id: `activity-${Date.now()}`, title: task.title, detail: 'Added', time: 'Just now', icon: '+' }, ...state.activity].slice(0, 8),
      lastUndo: { label: `${task.title} added`, snapshot }
    };
    notify();
  },

  completeTask(taskId, grade = '') {
    const task = state.tasks.find(item => item.id === taskId);
    if (!task || task.completed) return false;
    const snapshot = JSON.parse(JSON.stringify(state));
    const tasks = state.tasks.map(item => item.id === taskId
      ? { ...item, completed: true, completedAt: new Date().toISOString(), completionGrade: grade }
      : item);
    state = {
      ...state,
      tasks,
      progress: task.urgency === 'today'
        ? { ...state.progress, completedToday: Math.min(state.progress.totalToday, state.progress.completedToday + 1) }
        : state.progress,
      activity: [activityFor(task, grade), ...state.activity].slice(0, 8),
      lastUndo: { label: `${task.title} completed`, snapshot }
    };
    notify();
    return true;
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