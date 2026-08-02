import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function areaCards(areas) {
  return areas.map(area => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="ag-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}"><span class="ag-glow" aria-hidden="true"></span><span class="ag-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} routines · ${area.sections || 'standalone'}${area.sections ? ' sections' : ''}</small><em>${next ? esc(next.title) : 'Ready when you are'}</em></span><span class="ag-status" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span></button>`;
  }).join('');
}

export function renderAreasAmbient(data) {
  if (!data.areas.length) return `<section class="ag-page" aria-label="Areas overview, new user"><div class="ag-aurora" aria-hidden="true"></div><header class="ag-header"><span>AREAS</span><h1>Create a calmer map of your life.</h1><p>Begin with one place and let the structure grow naturally.</p></header><div class="ag-empty"><div aria-hidden="true">＋</div><h2>Add your first Area</h2><p>Home, Car, Work, Personal, or anywhere else that benefits from gentle upkeep.</p><button class="ag-primary" data-action="demo-add-area">Add an Area</button></div></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const summary = attention ? `${attention} routines across ${affected} areas need attention.` : 'All important routines are current.';
  return `<section class="ag-page" aria-label="Areas overview"><div class="ag-aurora" aria-hidden="true"></div><header class="ag-header"><span>AREAS</span><h1>Your spaces, softly organized.</h1><p>${attention ? `${attention} routines across ${affected} areas could use attention.` : 'Everything important is current.'}</p></header><div class="ag-summary" aria-label="${esc(summary)}"><span aria-hidden="true">◌</span><div aria-hidden="true"><strong>${attention || 'Clear'}</strong><small>${attention ? 'gentle reminders waiting' : 'nothing urgent right now'}</small></div></div><div class="ag-area-stack">${areaCards(data.areas)}</div><button class="ag-add" data-action="demo-add-area">＋ Add Area</button></section>`;
}

function routineRows(items, areaName) {
  return items.map(item => {
    const status = dueLabel(item.status);
    return `<div class="ag-routine"><button class="ag-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span aria-hidden="true">✓</span></button><span class="ag-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span><em class="${esc(item.status)}" aria-label="Status: ${esc(status)}">${esc(status)}</em></div>`;
  }).join('');
}

export function renderAreaDetailAmbient(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="ag-page" aria-label="${esc(area.name)} Area detail"><div class="ag-aurora" aria-hidden="true"></div><button class="ag-back" data-action="back-areas">← Areas</button><header class="ag-detail"><span>AREA</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></header><section class="ag-panel" aria-labelledby="ag-attention-heading"><div class="ag-panel-title"><h2 id="ag-attention-heading">Needs attention</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="ag-quiet">Nothing pressing. This area can rest.</p>'}</section><section class="ag-panel" aria-labelledby="ag-sections-heading"><div class="ag-panel-title"><h2 id="ag-sections-heading">Sections</h2><span aria-label="${sections.length} sections">${sections.length}</span></div>${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; const state = count ? `${count} routines` : 'Not configured'; return `<button class="ag-section" data-action="section-demo" aria-label="${esc(name)}. ${esc(state)}."><span aria-hidden="true"><strong>${esc(name)}</strong><small>${state}</small></span><b aria-hidden="true">›</b></button>`; }).join('') || '<button class="ag-section" data-action="section-demo" aria-label="General. Standalone routines."><span aria-hidden="true"><strong>General</strong><small>Standalone routines</small></span><b aria-hidden="true">›</b></button>'}</section><section class="ag-panel" aria-labelledby="ag-later-heading"><div class="ag-panel-title"><h2 id="ag-later-heading">Later</h2><span aria-label="${later.length} routines">${later.length}</span></div>${routineRows(later, area.name) || '<p class="ag-quiet">No later routines.</p>'}</section></section>`;
}

export function renderInterventionAmbient(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="ag-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="ag-aurora" aria-hidden="true"></div><div class="ag-breath" aria-hidden="true"><span></span></div><span class="ag-kicker">A QUIET MOMENT</span><h1>Would a small change of pace help?</h1><p>You have spent ${item.minutes} minutes in ${esc(item.app)}. There is no penalty for staying.</p><article class="ag-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">SUGGESTED NEXT STEP</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article><div class="ag-actions"><button class="ag-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">Start gently</button><button class="ag-secondary" data-action="different-demo">Another option</button><button class="ag-dismiss" data-action="not-now-demo">Stay here</button></div></section>`;
}
