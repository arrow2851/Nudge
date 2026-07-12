const STORAGE_KEY = 'nudge.prototype.v2';

export const defaultState = Object.freeze({
  user: { name: 'Omar', theme: 'light' },
  preferences: {
    compact: true,
    interventionsEnabled: true,
    interventionStrength: 'balanced'
  },
  progress: { completedToday: 4, totalToday: 7 },
  tasks: [
    { id: 'trash', title: 'Take out kitchen trash', area: 'House', subarea: 'Kitchen', minutes: 3, due: 'Today', completed: false },
    { id: 'mirror', title: 'Clean bathroom mirror', area: 'House', subarea: 'Bathroom', minutes: 5, due: 'Today', completed: false },
    { id: 'package', title: 'Return package', area: 'Personal', subarea: '', minutes: 10, due: 'Today', completed: false },
    { id: 'bins', title: 'Put trash bins outside', area: 'House', subarea: '', minutes: 4, due: 'Today', completed: false }
  ]
});

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return cloneDefaultState();
    return { ...cloneDefaultState(), ...JSON.parse(stored) };
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

  completeTask(taskId) {
    let newlyCompleted = false;
    const tasks = state.tasks.map(task => {
      if (task.id !== taskId || task.completed) return task;
      newlyCompleted = true;
      return { ...task, completed: true };
    });
    state = {
      ...state,
      tasks,
      progress: newlyCompleted
        ? { ...state.progress, completedToday: Math.min(state.progress.totalToday, state.progress.completedToday + 1) }
        : state.progress
    };
    notify();
  }
};
