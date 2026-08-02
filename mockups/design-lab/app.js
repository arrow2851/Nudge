import { LOOKS } from './config.js';
import { getScenario } from './fixtures.js';
import { renderReviewControls } from './controls.js';
import { clearStoredState, commitState, defaultState, readStateFromLocation } from './state.js';
import { applyRoutineState, clearInteractiveState, completeRoutine, findRoutine, reopenRoutine } from './interactive-state.js';
import { renderAreaDetail, renderAreasEditorial, renderInterventionEditorial } from './renderers/look2.js';
import { renderAreaDetailPrecision, renderAreasPrecision, renderInterventionPrecision } from './renderers/look3.js';
import { renderAreaDetailZen, renderAreasZen, renderChoreZen, renderInterventionZen, renderSectionZen, renderTodayZen } from './renderers/look4.js';
import { renderAreaDetailPlayful, renderAreasPlayful, renderInterventionPlayful } from './renderers/look5.js';
import { renderAreaDetailTactile, renderAreasTactile, renderInterventionTactile } from './renderers/look6.js';
import { renderAreaDetailBold, renderAreasBold, renderInterventionBold } from './renderers/look7.js';
import { renderAreaDetailAmbient, renderAreasAmbient, renderInterventionAmbient } from './renderers/look8.js';
import { renderAreaDetailRetro, renderAreasRetro, renderInterventionRetro } from './renderers/look9.js';
import { renderUnsupported } from './renderers/shared.js';
import { esc } from './utils.js';

let state = readStateFromLocation();
let currentData = null;

const elements = {
  screen: document.querySelector('#screen'),
  lookControls: document.querySelector('#look-controls'),
  screenControls: document.querySelector('#screen-controls'),
  scenarioControls: document.querySelector('#scenario-controls'),
  toastRoot: document.querySelector('#toast-root')
};

function renderLook(look, data) {
  if (look.id === 2) {
    if (state.view === 'intervention') return renderInterventionEditorial(data);
    if (state.view === 'area') return renderAreaDetail(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasEditorial(data);
  }

  if (look.id === 3) {
    if (state.view === 'intervention') return renderInterventionPrecision(data);
    if (state.view === 'area') return renderAreaDetailPrecision(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasPrecision(data);
  }

  if (look.id === 4) {
    if (state.view === 'today') return renderTodayZen(data);
    if (state.view === 'intervention') return renderInterventionZen(data);
    if (state.view === 'chore') return renderChoreZen(data, state.areaId, state.sectionId, state.choreId, renderUnsupported);
    if (state.view === 'section') return renderSectionZen(data, state.areaId, state.sectionId, renderUnsupported);
    if (state.view === 'area') return renderAreaDetailZen(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasZen(data);
  }

  if (look.id === 5) {
    if (state.view === 'intervention') return renderInterventionPlayful(data);
    if (state.view === 'area') return renderAreaDetailPlayful(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasPlayful(data);
  }

  if (look.id === 6) {
    if (state.view === 'intervention') return renderInterventionTactile(data);
    if (state.view === 'area') return renderAreaDetailTactile(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasTactile(data);
  }

  if (look.id === 7) {
    if (state.view === 'intervention') return renderInterventionBold(data);
    if (state.view === 'area') return renderAreaDetailBold(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasBold(data);
  }

  if (look.id === 8) {
    if (state.view === 'intervention') return renderInterventionAmbient(data);
    if (state.view === 'area') return renderAreaDetailAmbient(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasAmbient(data);
  }

  if (look.id === 9) {
    if (state.view === 'intervention') return renderInterventionRetro(data);
    if (state.view === 'area') return renderAreaDetailRetro(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasRetro(data);
  }

  return renderUnsupported('This interactive screen is currently implemented only for Look #4 — Zen Focus.');
}

function syncBottomNavigation() {
  const areasActive = ['areas', 'area', 'section', 'chore'].includes(state.view);
  document.querySelectorAll('[data-nav]').forEach(button => {
    const active = button.dataset.nav === 'today' ? state.view === 'today' : button.dataset.nav === 'areas' ? areasActive : false;
    button.classList.toggle('active', active);
  });
}

function normalizeStateForData(data) {
  if (!['area', 'section', 'chore'].includes(state.view)) return;
  const area = data.areas.find(item => item.id === state.areaId);
  if (!area) {
    state.view = state.look === 4 ? 'today' : 'areas';
    state.areaId = null;
    state.sectionId = null;
    state.choreId = null;
    return;
  }
  if (state.view === 'section') {
    const sections = new Set(area.routines.map(item => item.section || 'General'));
    if (area.unconfigured) sections.add(area.unconfigured);
    if (!sections.has(state.sectionId)) {
      state.view = 'area';
      state.sectionId = null;
    }
  }
  if (state.view === 'chore' && !area.routines.some(item => item.id === state.choreId)) {
    state.view = state.sectionId ? 'section' : 'area';
    state.choreId = null;
  }
}

function render({ routeAction = 'none' } = {}) {
  currentData = applyRoutineState(getScenario(state.scenario), state.scenario);
  normalizeStateForData(currentData);
  const look = renderReviewControls(state, currentData, elements);
  document.documentElement.dataset.textScale = currentData.textScale || 'normal';
  document.documentElement.dataset.look = String(look.id);
  elements.screen.innerHTML = renderLook(look, currentData);
  elements.screen.scrollTop = 0;
  syncBottomNavigation();
  if (routeAction === 'push') commitState(state);
  if (routeAction === 'replace') commitState(state, { replace: true });
}

function showToast(message) {
  elements.toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { elements.toastRoot.innerHTML = ''; }, 2600);
}

function resetPath() {
  state.areaId = null;
  state.sectionId = null;
  state.choreId = null;
}

function resetReviewState() {
  state = defaultState();
  clearStoredState();
  clearInteractiveState();
  render({ routeAction: 'push' });
  showToast('Design Lab and routine completion state reset.');
}

function setView(view) {
  if (view === 'today' && state.look !== 4) {
    showToast('Today interaction is currently available in Look #4 — Zen Focus.');
    return;
  }
  state.view = view;
  resetPath();
  render({ routeAction: 'push' });
}

function openArea(areaId) {
  state.view = 'area';
  state.areaId = areaId;
  state.sectionId = null;
  state.choreId = null;
  render({ routeAction: 'push' });
}

function openSection(areaId, sectionId) {
  state.view = 'section';
  state.areaId = areaId;
  state.sectionId = sectionId || 'General';
  state.choreId = null;
  render({ routeAction: 'push' });
}

function openChore(areaId, sectionId, choreId) {
  state.view = 'chore';
  state.areaId = areaId;
  state.sectionId = sectionId || 'General';
  state.choreId = choreId;
  render({ routeAction: 'push' });
}

function routineFromTarget(target) {
  return findRoutine(currentData, target.dataset.areaId || state.areaId, target.dataset.choreId || state.choreId);
}

function runAction(action, target) {
  const actions = {
    'back-areas': () => setView('areas'),
    'open-areas': () => setView('areas'),
    'back-area': () => openArea(state.areaId),
    'back-section': () => state.sectionId ? openSection(state.areaId, state.sectionId) : openArea(state.areaId),
    'reset-review': resetReviewState,
    'reset-route': resetReviewState,
    'complete-routine': () => {
      const { routine } = routineFromTarget(target);
      const completion = completeRoutine(state.scenario, routine);
      if (!completion) return;
      render();
      showToast(`Completed. ${completion.nextLabel}.`);
    },
    'reopen-routine': () => {
      const { routine } = routineFromTarget(target);
      if (!routine || !reopenRoutine(state.scenario, routine.id)) return;
      render();
      showToast('Completion undone. The routine is back in its previous state.');
    },
    'demo-add-area': () => showToast('Area creation remains outside this first interactive slice.'),
    'start-demo': () => showToast('The Intervention-to-action loop follows after Routine Completion is implemented across all Looks.'),
    'different-demo': () => showToast('Alternative suggestions belong to the later Intervention slice.'),
    'not-now-demo': () => showToast('Intervention dismissed without guilt.')
  };
  actions[action]?.();
}

document.addEventListener('click', event => {
  const lookButton = event.target.closest('button[data-look]');
  if (lookButton) {
    const requested = Number(lookButton.dataset.look);
    state.look = LOOKS.some(look => look.id === requested) ? requested : 4;
    if (state.look !== 4 && ['today', 'section', 'chore'].includes(state.view)) {
      state.view = 'areas';
      resetPath();
    }
    render({ routeAction: 'push' });
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }

  const scenarioButton = event.target.closest('[data-scenario]');
  if (scenarioButton) {
    state.scenario = scenarioButton.dataset.scenario;
    render({ routeAction: 'push' });
    return;
  }

  const actionTarget = event.target.closest('[data-action]');
  if (actionTarget) {
    runAction(actionTarget.dataset.action, actionTarget);
    return;
  }

  const choreButton = event.target.closest('[data-chore-id]');
  if (choreButton) {
    openChore(choreButton.dataset.areaId || state.areaId, choreButton.dataset.sectionId || state.sectionId, choreButton.dataset.choreId);
    return;
  }

  const sectionButton = event.target.closest('[data-section-id]');
  if (sectionButton) {
    openSection(sectionButton.dataset.areaId || state.areaId, sectionButton.dataset.sectionId);
    return;
  }

  const areaButton = event.target.closest('[data-area-id]');
  if (areaButton) {
    openArea(areaButton.dataset.areaId);
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.nav === 'today') setView('today');
    else if (nav.dataset.nav === 'areas') setView('areas');
    else showToast('This pure-Look slice currently covers Today and Areas.');
  }
});

window.addEventListener('popstate', () => {
  state = readStateFromLocation();
  render();
});

document.querySelector('#status-time').textContent = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit'
}).format(new Date());

render({ routeAction: 'replace' });
