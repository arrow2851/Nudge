import { LOOKS } from './config.js';
import { getScenario } from './fixtures.js';
import { renderReviewControls } from './controls.js';
import { clearStoredState, commitState, defaultState, readStateFromLocation } from './state.js';
import { renderAreaDetail, renderAreasEditorial, renderInterventionEditorial } from './renderers/look2.js';
import { renderAreaDetailPrecision, renderAreasPrecision, renderInterventionPrecision } from './renderers/look3.js';
import { renderAreaDetailZen, renderAreasZen, renderInterventionZen } from './renderers/look4.js';
import { renderAreaDetailTactile, renderAreasTactile, renderInterventionTactile } from './renderers/look6.js';
import { renderUnsupported } from './renderers/shared.js';
import { esc } from './utils.js';

let state = readStateFromLocation();

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
    if (state.view === 'intervention') return renderInterventionZen(data);
    if (state.view === 'area') return renderAreaDetailZen(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasZen(data);
  }

  if (look.id === 6) {
    if (state.view === 'intervention') return renderInterventionTactile(data);
    if (state.view === 'area') return renderAreaDetailTactile(data, state.areaId, renderUnsupported);
    if (state.view === 'areas') return renderAreasTactile(data);
  }

  return renderUnsupported('The requested screen is not part of the Round 1 audition.');
}

function render({ routeAction = 'none' } = {}) {
  const data = getScenario(state.scenario);
  const look = renderReviewControls(state, data, elements);
  document.documentElement.dataset.textScale = data.textScale || 'normal';
  document.documentElement.dataset.look = String(look.id);
  elements.screen.innerHTML = renderLook(look, data);
  elements.screen.scrollTop = 0;
  if (routeAction === 'push') commitState(state);
  if (routeAction === 'replace') commitState(state, { replace: true });
}

function showToast(message) {
  elements.toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { elements.toastRoot.innerHTML = ''; }, 2200);
}

function resetReviewState() {
  state = defaultState();
  clearStoredState();
  render({ routeAction: 'push' });
  showToast('Design Lab review state reset.');
}

function setView(view) {
  state.view = view;
  state.areaId = null;
  render({ routeAction: 'push' });
}

document.addEventListener('click', event => {
  const lookButton = event.target.closest('[data-look]');
  if (lookButton) {
    const requested = Number(lookButton.dataset.look);
    state.look = LOOKS.some(look => look.id === requested) ? requested : 2;
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
    const data = getScenario(state.scenario);
    if (state.view === 'area' && !data.areas.some(area => area.id === state.areaId)) {
      state.view = 'areas';
      state.areaId = null;
    }
    render({ routeAction: 'push' });
    return;
  }

  const areaButton = event.target.closest('[data-area-id]');
  if (areaButton) {
    state.view = 'area';
    state.areaId = areaButton.dataset.areaId;
    render({ routeAction: 'push' });
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.nav === 'areas') setView('areas');
    else showToast('Round 1 is focused on Areas and the intervention moment.');
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  const actions = {
    'back-areas': () => setView('areas'),
    'reset-review': resetReviewState,
    'reset-route': resetReviewState,
    'complete-demo': () => showToast('Completion feedback will be tested in the interactive vertical-slice round.'),
    'demo-add-area': () => showToast('The audition tests the visual system; full creation comes in Round 2.'),
    'section-demo': () => showToast('Section detail follows after the visual finalists are selected.'),
    'start-demo': () => showToast('Task accepted. Nudge would open its focused completion view.'),
    'different-demo': () => showToast('A short alternative-task list would appear here.'),
    'not-now-demo': () => showToast('Intervention dismissed without guilt.')
  };
  actions[action]?.();
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
