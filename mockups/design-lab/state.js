import { ALLOWED_VIEWS, DESIGN_LAB, LOOKS } from './config.js';
import { SCENARIOS } from './fixtures.js';

export function defaultState() {
  return { look: 2, view: 'areas', scenario: 'normal', areaId: null };
}

export function readStateFromLocation() {
  const params = new URLSearchParams(location.search);
  const look = Number(params.get('look'));
  const view = params.get('screen');
  const scenario = params.get('scenario');
  const areaId = params.get('area');

  return {
    look: LOOKS.some(item => item.id === look) ? look : 2,
    view: ALLOWED_VIEWS.has(view) ? view : 'areas',
    scenario: Object.hasOwn(SCENARIOS, scenario) ? scenario : 'normal',
    areaId: areaId || null
  };
}

export function urlForState(state) {
  const params = new URLSearchParams();
  params.set('look', state.look);
  params.set('screen', state.view);
  params.set('scenario', state.scenario);
  if (state.view === 'area' && state.areaId) params.set('area', state.areaId);
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
