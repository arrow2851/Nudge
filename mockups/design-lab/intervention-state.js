const INTERVENTION_STORAGE_KEY = 'nudge-design-lab-intervention-action-v1';

const clone = value => typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value));

const statusPriority = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };

function readStore() {
  try {
    return JSON.parse(sessionStorage.getItem(INTERVENTION_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    sessionStorage.setItem(INTERVENTION_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // The in-memory result remains usable when storage is unavailable.
  }
}

function suggestion(id, task, location, duration) {
  return {
    id,
    task: task || 'Choose one useful action',
    location: location || 'Nudge',
    duration: Number.isFinite(Number(duration)) ? Number(duration) : 2
  };
}

function uniqueSuggestions(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = `${item.task}::${item.location}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function routineSuggestions(data) {
  return (data.areas || [])
    .flatMap(area => area.routines.map(routine => ({ area, routine })))
    .filter(({ routine }) => !routine.completion)
    .sort((a, b) => (statusPriority[a.routine.status] ?? 9) - (statusPriority[b.routine.status] ?? 9))
    .map(({ area, routine }) => suggestion(
      `routine-${area.id}-${routine.id}`,
      routine.title,
      routine.section ? `${area.name} · ${routine.section}` : area.name,
      routine.minutes
    ));
}

export function interventionSuggestions(data) {
  const primary = suggestion(
    'scenario-primary',
    data.intervention?.task,
    data.intervention?.location,
    data.intervention?.duration
  );
  const setupAlternatives = (data.areas || []).length ? [] : [
    suggestion('setup-area', 'Name one area you want to keep up with', 'Nudge setup', 2),
    suggestion('setup-task', 'Add one task you already plan to do', 'Nudge setup', 2)
  ];
  return uniqueSuggestions([primary, ...routineSuggestions(data), ...setupAlternatives]).slice(0, 8);
}

function initialState(scenario) {
  return {
    scenario,
    suggestionIndex: 0,
    phase: 'prompt',
    activeSuggestion: null,
    startedLabel: null,
    completedLabel: null
  };
}

function normalize(raw, scenario, suggestionCount) {
  const state = raw && typeof raw === 'object' ? raw : initialState(scenario);
  const allowedPhases = new Set(['prompt', 'active', 'completed', 'dismissed']);
  state.scenario = scenario;
  state.suggestionIndex = Number.isInteger(state.suggestionIndex) && suggestionCount
    ? Math.abs(state.suggestionIndex) % suggestionCount
    : 0;
  state.phase = allowedPhases.has(state.phase) ? state.phase : 'prompt';
  state.activeSuggestion = state.activeSuggestion?.task ? state.activeSuggestion : null;
  state.startedLabel = state.startedLabel || null;
  state.completedLabel = state.completedLabel || null;
  if ((state.phase === 'active' || state.phase === 'completed') && !state.activeSuggestion) {
    state.phase = 'prompt';
  }
  return state;
}

function stateFor(data, scenario) {
  const store = readStore();
  const suggestions = interventionSuggestions(data);
  const state = normalize(store[scenario], scenario, suggestions.length);
  if (!store[scenario]) {
    store[scenario] = state;
    writeStore(store);
  }
  return { store, state, suggestions };
}

function mutate(data, scenario, change) {
  const { store, state, suggestions } = stateFor(data, scenario);
  const result = change(state, suggestions);
  store[scenario] = state;
  writeStore(store);
  return { state: clone(state), result };
}

function selectedSuggestion(state, suggestions) {
  return state.activeSuggestion || suggestions[state.suggestionIndex] || suggestions[0];
}

export function applyInterventionState(data, scenario) {
  const { state, suggestions } = stateFor(data, scenario);
  const current = selectedSuggestion(state, suggestions);
  return {
    ...data,
    intervention: {
      ...data.intervention,
      ...current,
      suggestions: clone(suggestions),
      suggestionIndex: state.suggestionIndex,
      phase: state.phase,
      startedLabel: state.startedLabel,
      completedLabel: state.completedLabel
    }
  };
}

export function showNextInterventionSuggestion(data, scenario) {
  return mutate(data, scenario, (state, suggestions) => {
    state.suggestionIndex = suggestions.length
      ? (state.suggestionIndex + 1) % suggestions.length
      : 0;
    state.phase = 'prompt';
    state.activeSuggestion = null;
    state.startedLabel = null;
    state.completedLabel = null;
    return suggestions[state.suggestionIndex] || null;
  });
}

export function startInterventionAction(data, scenario) {
  return mutate(data, scenario, (state, suggestions) => {
    state.activeSuggestion = clone(suggestions[state.suggestionIndex] || suggestions[0]);
    if (!state.activeSuggestion) return null;
    state.phase = 'active';
    state.startedLabel = 'Started now';
    state.completedLabel = null;
    return clone(state.activeSuggestion);
  });
}

export function completeInterventionAction(data, scenario) {
  return mutate(data, scenario, state => {
    if (state.phase !== 'active' || !state.activeSuggestion) return false;
    state.phase = 'completed';
    state.completedLabel = 'Completed just now';
    return true;
  });
}

export function reopenInterventionAction(data, scenario) {
  return mutate(data, scenario, state => {
    if (state.phase !== 'completed' || !state.activeSuggestion) return false;
    state.phase = 'active';
    state.completedLabel = null;
    return true;
  });
}

export function undoInterventionStart(data, scenario) {
  return mutate(data, scenario, state => {
    if (!['active', 'completed'].includes(state.phase)) return false;
    state.phase = 'prompt';
    state.activeSuggestion = null;
    state.startedLabel = null;
    state.completedLabel = null;
    return true;
  });
}

export function dismissIntervention(data, scenario) {
  return mutate(data, scenario, state => {
    state.phase = 'dismissed';
    state.activeSuggestion = null;
    state.startedLabel = null;
    state.completedLabel = null;
    return true;
  });
}

export function resumeIntervention(data, scenario) {
  return mutate(data, scenario, state => {
    state.phase = 'prompt';
    return true;
  });
}

export function clearInterventionState() {
  try {
    sessionStorage.removeItem(INTERVENTION_STORAGE_KEY);
  } catch {
    // No action needed.
  }
}
