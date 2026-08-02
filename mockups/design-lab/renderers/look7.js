import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="bu-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}"><span class="bu-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="bu-main"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES / ${area.sections || 0} SECTIONS</small></span><span class="bu-next">${next ? esc(next.title) : 'NO ROUTINES'}</span><span class="bu-state" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span><span class="bu-arrow" aria-hidden="true">↗</span></button>`;
  }).join('');
}

export function renderAreasBold(data) {
  if (!data.areas.length) return `<section class="bu-page" aria-label="Areas overview, new user"><header class="bu-header"><span>NUDGE / AREAS</span><h1>NO AREAS<br>YET.</h1><p>Start with one place you actually maintain. The system can grow later.</p></header><button class="bu-primary bu-empty-action" data-action="demo-add-area">+ ADD FIRST AREA</button></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="bu-page" aria-label="Areas overview"><header class="bu-header bu-header-grid"><div><span>NUDGE / AREAS</span><h1>HOUSEHOLD<br>CONTROL.</h1><p>Clear structure. Every Area visible. Choose what matters now.</p></div><div class="bu-counter" aria-label="${esc(summary)}"><strong aria-hidden="true">${String(attention).padStart(2, '0')}</strong><span aria-hidden="true">${attention ? 'NEED ATTENTION' : 'ALL CURRENT'}</span></div></header><div class="bu-table-head" aria-hidden="true"><span>#</span><span>AREA</span><span>NEXT</span><span>STATE</span><span></span></div><div class="bu-list">${areaRows(data.areas)}</div><button class="bu-add" data-action="demo-add-area">+ ADD AREA</button></section>`;
}

function routineRows(items, areaName) {
  return items.map(item => {
    const status = dueLabel(item.status);
    return `<div class="bu-routine"><button class="bu-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span aria-hidden="true">×</span></button><span class="bu-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} / ${esc(item.repeat)} / ${item.minutes} MIN</small></span><b class="bu-tag ${esc(item.status)}" aria-label="Status: ${esc(status)}">${esc(status)}</b></div>`;
  }).join('');
}

export function renderAreaDetailBold(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="bu-page" aria-label="${esc(area.name)} Area detail"><button class="bu-back" data-action="back-areas">← AREAS</button><header class="bu-detail"><div><span>AREA / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1></div><div aria-label="${attention.length} routines need attention"><strong aria-hidden="true">${String(attention.length).padStart(2, '0')}</strong><small aria-hidden="true">ATTENTION</small></div></header><section class="bu-block" aria-labelledby="bu-now-heading"><div class="bu-block-title"><h2 id="bu-now-heading">NOW</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="bu-quiet">NO DUE ITEMS.</p>'}</section><section class="bu-block" aria-labelledby="bu-sections-heading"><div class="bu-block-title"><h2 id="bu-sections-heading">SECTIONS</h2><span aria-label="${sections.length} sections">${sections.length}</span></div>${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; const state = count ? `${count} routines` : 'Not configured'; return `<button class="bu-section" data-action="section-demo" aria-label="${esc(name)}. ${esc(state)}."><strong>${esc(name)}</strong><span aria-hidden="true">${String(count).padStart(2, '0')} →</span></button>`; }).join('') || '<button class="bu-section" data-action="section-demo" aria-label="General. Standalone routines."><strong>GENERAL</strong><span aria-hidden="true">→</span></button>'}</section><section class="bu-block" aria-labelledby="bu-later-heading"><div class="bu-block-title"><h2 id="bu-later-heading">LATER</h2><span aria-label="${later.length} routines">${later.length}</span></div>${routineRows(later, area.name) || '<p class="bu-quiet">NO LATER ITEMS.</p>'}</section></section>`;
}

export function renderInterventionBold(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="bu-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="bu-marquee" aria-hidden="true">NUDGE / OPTIONAL CONTEXT SWITCH / ${item.minutes} MIN / ${esc(item.app).toUpperCase()}</div><div class="bu-intervention-body"><span class="bu-stop" aria-hidden="true">■</span><h1>PAUSE.<br>DECIDE.</h1><p>You can stay in ${esc(item.app)}, or redirect the next ${item.duration} minutes. Either choice is valid.</p><article aria-label="${esc(suggestion)}"><span aria-hidden="true">SUGGESTED ACTION</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} / ${item.duration} MIN</p></article></div><div class="bu-actions"><button class="bu-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">START THIS ACTION</button><button class="bu-secondary" data-action="different-demo">CHOOSE ANOTHER</button><button class="bu-dismiss" data-action="not-now-demo">STAY HERE</button></div></section>`;
}
