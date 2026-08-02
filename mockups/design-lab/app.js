import { LOOKS } from './config.js';
import { getScenario } from './fixtures.js';
import { renderReviewControls } from './controls.js';
import { clearStoredState, commitState, defaultState, readStateFromLocation } from './state.js';
import { renderAreaDetail, renderAreasEditorial, renderInterventionEditorial } from './renderers/look2.js';
import { renderAreaDetailPrecision, renderAreasPrecision, renderInterventionPrecision } from './renderers/look3.js';
import { renderAreaDetailZen, renderAreasZen, renderInterventionZen } from './renderers/look4.js';
import { renderAreaDetailPlayful, renderAreasPlayful, renderInterventionPlayful } from './renderers/look5.js';
import { renderAreaDetailTactile, renderAreasTactile, renderInterventionTactile } from './renderers/look6.js';
import { renderAreaDetailBold, renderAreasBold, renderInterventionBold } from './renderers/look7.js';
import { renderAreaDetailAmbient, renderAreasAmbient, renderInterventionAmbient } from './renderers/look8.js';
import { renderAreaDetailRetro, renderAreasRetro, renderInterventionRetro } from './renderers/look9.js';
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

  return renderUnsupported('The requested screen is not part of the Design Lab gallery.');
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
  const lookButton = event.target.closest('button[data-look]');
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
    else showToast('The gallery is focused on Areas and the intervention moment.');
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  const actions = {
    'back-areas': () => setView('areas'),
    'reset-review': resetReviewState,
    'reset-route': resetReviewState,
    'complete-demo': () => showToast('Completion feedback will be tested in a later interactive round.'),
    'demo-add-area': () => showToast('The gallery tests visual systems; full creation comes in a later interactive round.'),
    'section-demo': () => showToast('Section detail will be added during interactive expansion.'),
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
