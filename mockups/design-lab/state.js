import { ALLOWED_VIEWS, DESIGN_LAB, LOOKS } from './config.js';
import { SCENARIOS } from './fixtures.js';

export function defaultState() {
  return {
    look: 9,
    view: 'tasks',
    scenario: 'normal',
    areaId: null,
    sectionId: null,
    choreId: null
  };
}

export function readStateFromLocation() {
  const params = new URLSearchParams(location.search);
  const look = Number(params.get('look'));
  const view = params.get('screen');
  const scenario = params.get('scenario');

  return {
    look: LOOKS.some(item => item.id === look) ? look : 9,
    view: ALLOWED_VIEWS.has(view) ? view : 'tasks',
    scenario: Object.hasOwn(SCENARIOS, scenario) ? scenario : 'normal',
    areaId: params.get('area') || null,
    sectionId: params.get('section') || null,
    choreId: params.get('chore') || null
  };
}

export function urlForState(state) {
  const params = new URLSearchParams();
  params.set('look', state.look);
  params.set('screen', state.view);
  params.set('scenario', state.scenario);
  if (['area', 'section', 'chore'].includes(state.view) && state.areaId) params.set('area', state.areaId);
  if (['section', 'chore'].includes(state.view) && state.sectionId) params.set('section', state.sectionId);
  if (state.view === 'chore' && state.choreId) params.set('chore', state.choreId);
  return `${location.pathname}?${params}`;
}

export function commitState(state, { replace = false } = {}) {
  const method = replace ? 'replaceState' : 'pushState';
  history[method]({ ...state }, '', urlForState(state));
  try {
    sessionStorage.setItem(DESIGN_LAB.storageKey, JSON.stringify(state));
  } catch {
    // Query parameters remain authoritative when storage is unavailable.
  }
}

export function clearStoredState() {
  try {
    sessionStorage.removeItem(DESIGN_LAB.storageKey);
  } catch {
    // No action needed.
  }
}
