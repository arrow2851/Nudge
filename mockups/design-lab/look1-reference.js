import { getScenario } from './fixtures.js';

const VERSION = '0.8.1';
const params = new URLSearchParams(location.search);
const allowedScreens = new Set(['areas', 'area', 'intervention']);
const screenId = allowedScreens.has(params.get('screen')) ? params.get('screen') : 'areas';
const scenarioId = params.get('scenario') || 'normal';
const areaId = params.get('area') || 'kitchen';
const capture = params.get('capture');
const data = getScenario(scenarioId);
const screen = document.querySelector('#screen');
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const statusOrder = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };

if (capture === 'labelled' || capture === 'phone') document.documentElement.dataset.capture = capture;
if (data.textScale === 'large') document.documentElement.dataset.textScale = 'large';

function attention(items) {
  return items.filter(item => item.status === 'overdue' || item.status === 'today');
}

function dueLabel(status) {
  return ({ overdue: 'Overdue', today: 'Today', upcoming: 'Upcoming', 'as-needed': 'As needed' })[status] || status;
}

function nextRoutine(area) {
  return [...area.routines].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])[0] || null;
}

function pageHeader(title, subtitle) {
  return `<header class="page-header"><div><p class="eyebrow">Look #1 baseline</p><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><button class="icon-button" aria-label="More options">•••</button></header>`;
}

function areaCard(area) {
  const flagged = attention(area.routines);
  const next = nextRoutine(area);
  const icon = ({ kitchen: '🍳', bathroom: '🛁', 'living-room': '🛋️', bedroom: '🛏️', car: '🚗', work: '💼', personal: '👤' })[area.id] || '□';
  const statusClass = flagged.some(item => item.status === 'overdue') ? 'overdue' : flagged.length ? 'due' : '';
  const count = flagged.length || '✓';
  return `<article class="area-card">
    <a class="area-main" href="?screen=area&area=${encodeURIComponent(area.id)}&scenario=${encodeURIComponent(scenarioId)}${capture ? `&capture=${capture}` : ''}" aria-label="Open ${esc(area.name)}">
      <span class="area-icon" aria-hidden="true">${icon}</span>
      <span class="area-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} routines · ${area.sections || 0} sections</small><em>${next ? `${flagged.length ? `${flagged.length} need attention · ` : 'Next · '}${esc(next.title)}` : 'No routines set up yet'}</em></span>
      <span class="area-count ${statusClass}">${count}</span>
    </a>
    <button class="card-menu" aria-label="Edit ${esc(area.name)}">•••</button>
  </article>`;
}

function renderAreas() {
  if (!data.areas.length) {
    return `${pageHeader('Areas', 'Recurring chores and maintenance, organized by place.')}
      <section class="empty-card"><span>＋</span><h2>Add your first Area</h2><p>Start with Home, Car, Work, Personal, or any place you want to keep in order.</p><button class="button primary">Add Area</button></section>`;
  }
  const flagged = data.areas.flatMap(area => attention(area.routines));
  const overdue = flagged.filter(item => item.status === 'overdue').length;
  return `${pageHeader('Areas', 'Recurring chores and maintenance, organized by place.')}
    <section class="attention-strip ${overdue ? 'has-overdue' : ''}"><div><strong>${flagged.length ? `${flagged.length} routines need attention` : 'Everything is in good order'}</strong><small>${flagged.length ? 'Open an Area to review what is due.' : 'As-needed routines are still available when useful.'}</small></div><span>${flagged.length || '✓'}</span></section>
    <section class="area-grid" aria-label="All Areas">${data.areas.map(areaCard).join('')}</section>
    <button class="bottom-add"><span>＋</span>Add Area</button>`;
}

function routineRow(item, areaName) {
  return `<div class="routine-row ${item.status === 'overdue' ? 'overdue' : ''}">
    <button class="routine-check" aria-label="Complete ${esc(item.title)}">✓</button>
    <span class="routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
    <span class="due-pill ${item.status === 'overdue' ? 'overdue' : ''}">${esc(dueLabel(item.status))}</span>
  </div>`;
}

function renderArea() {
  const area = data.areas.find(item => item.id === areaId) || data.areas[0];
  if (!area) return renderAreas();
  const flagged = attention(area.routines);
  const later = area.routines.filter(item => !flagged.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<header class="detail-header"><a class="icon-button" href="?screen=areas&scenario=${encodeURIComponent(scenarioId)}${capture ? `&capture=${capture}` : ''}" aria-label="Back to Areas">←</a><div><span aria-hidden="true">🍳</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></div><button class="icon-button" aria-label="More options">•••</button></header>
    ${flagged.length ? `<section class="attention-strip has-overdue"><div><strong>${flagged.length} need attention</strong><small>Complete a routine or open it for details.</small></div><span>${flagged.length}</span></section>` : '<section class="clear-card"><span>✓</span><div><strong>Nothing pressing</strong><small>Upcoming and as-needed routines remain below.</small></div></section>'}
    ${flagged.length ? `<div class="section-heading"><h2>Needs attention</h2><span>${flagged.length}</span></div><section class="routine-list">${flagged.map(item => routineRow(item, area.name)).join('')}</section>` : ''}
    <div class="section-heading"><h2>Sections</h2><span>${sections.length}</span></div>
    <section class="section-list">${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; return `<button class="section-card"><span class="section-icon">□</span><span><strong>${esc(name)}</strong><small>${count ? `${count} routines` : 'Not configured yet'}</small></span><b>${count || '＋'}</b></button>`; }).join('') || '<button class="section-card"><span class="section-icon">□</span><span><strong>General</strong><small>Standalone routines</small></span><b>›</b></button>'}</section>
    <div class="section-heading"><h2>Later and as needed</h2><span>${later.length}</span></div>
    <section class="routine-list">${later.map(item => routineRow(item, area.name)).join('') || '<div class="quiet-card">No additional routines are waiting.</div>'}</section>`;
}

function renderIntervention() {
  const item = data.intervention;
  return `<section class="intervention">
    <span class="mock-label">Comparison-only extrapolation</span>
    <div class="pause-icon" aria-hidden="true">↗</div>
    <p class="eyebrow">A small reset</p>
    <h1>Ready to choose what happens next?</h1>
    <p class="lead">You have spent ${item.minutes} minutes in ${esc(item.app)}. Stay here, or switch to one practical action.</p>
    <article class="accent-card"><p class="eyebrow">Suggested now</p><h2>${esc(item.task)}</h2><p>${esc(item.location)} · about ${item.duration} minutes</p></article>
    <div class="intervention-actions"><button class="button primary">Start this task</button><button class="button">Choose another</button><button class="text-button">Not now</button></div>
    <p class="mock-note">The protected Look #1 prototype does not currently contain an Intervention screen. This mock applies its existing green, white-card, rounded-control visual language without asserting approved product behavior.</p>
  </section>`;
}

screen.innerHTML = screenId === 'intervention' ? renderIntervention() : screenId === 'area' ? renderArea() : renderAreas();
document.querySelector('#scenario-select').value = Object.hasOwn({ normal:1, backlog:1, new:1, clear:1, large:1, long:1, 'large-text':1 }, scenarioId) ? scenarioId : 'normal';
document.querySelector('#scenario-select').addEventListener('change', event => {
  const next = new URLSearchParams(location.search);
  next.set('scenario', event.target.value);
  location.search = next.toString();
});
document.querySelectorAll('[data-screen-link]').forEach(link => link.classList.toggle('active', link.dataset.screenLink === screenId));

const captureHeader = document.querySelector('#capture-header');
if (capture === 'labelled') {
  const scenarioLabel = document.querySelector('#scenario-select').selectedOptions[0]?.textContent || scenarioId;
  captureHeader.innerHTML = `<strong>Look #1 — Soft Practical Utility</strong><span>${screenId === 'area' ? `Area detail · ${esc(areaId)}` : esc(screenId)} · ${esc(scenarioLabel)} · v${VERSION}</span>`;
}

document.title = `Nudge Design Lab — Look #1 · ${screenId}`;
