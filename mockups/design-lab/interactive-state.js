import { DESIGN_LAB } from './config.js';

const STORAGE_KEY = `${DESIGN_LAB.storageKey}:routine-completion-v1`;

function readStore() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // The current in-memory render still works when storage is unavailable.
  }
}

function nextLabelFor(routine) {
  if (routine.status === 'as-needed') return 'Available again whenever it is useful';
  if (routine.tier === 'Deep') return 'Next Deep cycle · in about 6 weeks';
  if (routine.tier === 'Moderate') return 'Next Moderate cycle · in about 2 weeks';
  return 'Next Light cycle · in about 3 days';
}

export function applyRoutineState(data, scenarioId) {
  const scenarioState = readStore()[scenarioId] || {};
  data.areas.forEach(area => {
    area.routines.forEach(routine => {
      const completion = scenarioState[routine.id];
      if (!completion) return;
      routine.originalStatus = completion.previousStatus;
      routine.status = completion.nextStatus;
      routine.completion = completion;
    });
  });
  return data;
}

export function completeRoutine(scenarioId, routine) {
  if (!routine?.id || routine.completion) return null;
  const store = readStore();
  const scenarioState = store[scenarioId] || {};
  const completion = {
    completed: true,
    previousStatus: routine.originalStatus || routine.status,
    nextStatus: routine.status === 'as-needed' ? 'as-needed' : 'upcoming',
    nextLabel: nextLabelFor(routine),
    completedLabel: 'Completed just now'
  };
  scenarioState[routine.id] = completion;
  store[scenarioId] = scenarioState;
  writeStore(store);
  return completion;
}

export function reopenRoutine(scenarioId, routineId) {
  const store = readStore();
  const scenarioState = store[scenarioId] || {};
  if (!Object.hasOwn(scenarioState, routineId)) return false;
  delete scenarioState[routineId];
  if (Object.keys(scenarioState).length) store[scenarioId] = scenarioState;
  else delete store[scenarioId];
  writeStore(store);
  return true;
}

export function findRoutine(data, areaId, choreId) {
  const area = data.areas.find(item => item.id === areaId);
  const routine = area?.routines.find(item => item.id === choreId);
  return { area: area || null, routine: routine || null };
}

export function clearInteractiveState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // No action needed.
  }
}
