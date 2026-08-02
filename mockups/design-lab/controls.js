import { DESIGN_LAB, LOOKS, ROUND_ONE_CONTROLS } from './config.js';
import { SCENARIOS } from './fixtures.js';
import { esc } from './utils.js';

const INTERACTIVE_LOOKS = new Set([3, 4, 5, 6, 7]);

export function renderReviewControls(state, data, elements) {
  elements.lookControls.innerHTML = LOOKS.map(look => `
    <button class="look-button ${state.look === look.id ? 'active' : ''}" data-look="${look.id}">
      <span class="look-number">#${look.id}</span>
      <strong>${esc(look.name)}</strong>
      <small>${esc(look.status)}</small>
    </button>`).join('');

  elements.screenControls.innerHTML = ROUND_ONE_CONTROLS.map(([id, label]) => {
    const active = state.view === id || (id === 'areas' && ['area', 'section', 'chore'].includes(state.view));
    const unavailable = id === 'today' && !INTERACTIVE_LOOKS.has(state.look);
    return `<button class="${active ? 'active' : ''}" data-view="${id}" ${unavailable ? 'aria-describedby="scenario-purpose"' : ''}>${label}</button>`;
  }).join('');

  elements.scenarioControls.innerHTML = Object.entries(SCENARIOS).map(([id, scenario]) => `
    <button class="${state.scenario === id ? 'active' : ''}" data-scenario="${id}" title="${esc(scenario.purpose)}">${esc(scenario.label)}</button>`).join('');

  const look = LOOKS.find(item => item.id === state.look) || LOOKS[0];
  document.querySelector('#look-kicker').textContent = `Look #${look.id}`;
  document.querySelector('#look-name').textContent = look.name;
  document.querySelector('#look-description').textContent = look.description;
  document.querySelector('#scenario-purpose').textContent = `${data.label}: ${data.purpose}${!INTERACTIVE_LOOKS.has(state.look) ? ' Today interaction is currently implemented only in Looks #3, #4, #5, #6, and #7.' : ''}`;
  document.querySelector('#build-meta').textContent = `v${DESIGN_LAB.version} · ${DESIGN_LAB.buildDate}`;
  return look;
}
