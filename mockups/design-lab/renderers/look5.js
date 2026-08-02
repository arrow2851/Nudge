import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

const iconFor = id => ({ kitchen: '✦', bathroom: '◌', 'living-room': '◇', bedroom: '☾', car: '↗', work: '▣', personal: '●' })[id] || '■';

function areaCards(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="pl-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}">
      <span class="pl-card-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span>
      <span class="pl-card-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} routines · ${area.sections || 'standalone'}${area.sections ? ' sections' : ''}</small><em>${next ? esc(next.title) : 'Ready to set up'}</em></span>
      <span class="pl-card-status" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
    </button>`;
  }).join('');
}

export function renderAreasPlayful(data) {
  if (!data.areas.length) {
    return `<section class="pl-page" aria-label="Areas overview, new user"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Build your little world.</h1><p>Start with one place you want to feel easier.</p></header><div class="pl-empty"><span aria-hidden="true">＋</span><h2>Add your first Area</h2><p>Home, Car, Work, Personal—anything can become a manageable block.</p><button class="pl-primary" data-action="demo-add-area">Create an Area</button></div></section>`;
  }
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="pl-page" aria-label="Areas overview"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Everything has a place.</h1><p>${attention ? `${attention} routines are asking for a little attention.` : 'Nothing urgent. Browse whenever it helps.'}</p></header><div class="pl-summary" aria-label="${esc(summary)}"><strong aria-hidden="true">${attention || '✓'}</strong><span aria-hidden="true">${attention ? 'small things to move forward' : 'all caught up'}</span></div><div class="pl-area-grid">${areaCards(data.areas)}</div><button class="pl-add" data-action="demo-add-area">＋ Add another Area</button></section>`;
}

function routineRows(items, areaName) {
  return items.map(item => {
    const status = dueLabel(item.status);
    return `<div class="pl-routine-row"><button class="pl-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span aria-hidden="true">✓</span></button><span class="pl-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span><span class="pl-pill ${esc(item.status)}" aria-label="Status: ${esc(status)}">${esc(status)}</span></div>`;
  }).join('');
}

export function renderAreaDetailPlayful(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="pl-page" aria-label="${esc(area.name)} Area detail"><button class="pl-back" data-action="back-areas">← All Areas</button><header class="pl-detail-header"><span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span><div><span class="pl-chip">AREA</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></div></header><section class="pl-block pl-attention" aria-labelledby="pl-attention-heading"><div class="pl-block-title"><h2 id="pl-attention-heading">Do these first</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="pl-quiet">Nothing is pressing right now.</p>'}</section><section class="pl-block" aria-labelledby="pl-sections-heading"><div class="pl-block-title"><h2 id="pl-sections-heading">Sections</h2><span aria-label="${sections.length} sections">${sections.length}</span></div><div class="pl-section-grid">${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; const state = count ? `${count} routines` : 'Not configured yet'; return `<button class="pl-section-card" data-action="section-demo" aria-label="${esc(name)}. ${esc(state)}."><span aria-hidden="true">▦</span><strong>${esc(name)}</strong><small>${state}</small></button>`; }).join('') || '<button class="pl-section-card" data-action="section-demo" aria-label="General. Standalone routines."><span aria-hidden="true">▦</span><strong>General</strong><small>Standalone routines</small></button>'}</div></section><section class="pl-block" aria-labelledby="pl-later-heading"><div class="pl-block-title"><h2 id="pl-later-heading">Later</h2><span aria-label="${later.length} routines">${later.length}</span></div>${routineRows(later, area.name) || '<p class="pl-quiet">No additional routines are waiting.</p>'}</section></section>`;
}

export function renderInterventionPlayful(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="pl-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="pl-orbit" aria-hidden="true"><span></span><b>↗</b></div><span class="pl-chip">A FRIENDLY PAUSE</span><h1>Want to swap screens for something small?</h1><p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Staying is okay. Switching is also okay.</p><article class="pl-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">TRY THIS</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article><div class="pl-actions"><button class="pl-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">Let’s do this</button><button class="pl-secondary" data-action="different-demo">Show another</button><button class="pl-dismiss" data-action="not-now-demo">Keep scrolling for now</button></div></section>`;
}
