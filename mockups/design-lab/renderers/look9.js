import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const meterLevel = `${Math.min(4, attentionCount(area)) * 25}%`;
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="rd-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}"><span class="rd-slot" aria-hidden="true">A${index + 1}</span><span class="rd-copy" aria-hidden="true"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES · ${area.sections || 0} SECTIONS</small><em>${next ? esc(next.title) : 'NO ROUTINE DATA'}</em></span><span class="rd-meter" aria-hidden="true"><i style="--level:${meterLevel}"></i><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span></button>`;
  }).join('');
}

export function renderAreasRetro(data) {
  if (!data.areas.length) return `<section class="rd-page" aria-label="Areas overview, new user"><header class="rd-header"><span>NUDGE OS / AREAS</span><h1>NO AREA DATA</h1><p>Initialize one place to begin routine tracking.</p></header><div class="rd-empty"><div aria-hidden="true">[ + ]</div><h2>CREATE FIRST AREA</h2><button class="rd-primary" data-action="demo-add-area">INITIALIZE AREA</button></div></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="rd-page" aria-label="Areas overview"><header class="rd-header rd-header-grid"><div><span>NUDGE OS / AREAS</span><h1>HOME SYSTEM</h1><p>Routine map online.</p></div><div class="rd-display" aria-label="${esc(summary)}"><small aria-hidden="true">ATTENTION</small><strong aria-hidden="true">${String(attention).padStart(2, '0')}</strong><em aria-hidden="true">${attention ? 'ACTION READY' : 'SYSTEM CLEAR'}</em></div></header><div class="rd-command">SELECT AREA // ${data.areas.length} AVAILABLE</div><div class="rd-list">${areaRows(data.areas)}</div><button class="rd-add" data-action="demo-add-area">[ + ADD AREA ]</button></section>`;
}

function routineRows(items, areaName) {
  return items.map((item, index) => {
    const status = dueLabel(item.status);
    return `<div class="rd-routine"><span class="rd-line" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><button class="rd-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span aria-hidden="true">[ ]</span></button><span class="rd-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} // ${esc(item.repeat)} // ${item.minutes} MIN</small></span><b class="rd-tag ${esc(item.status)}" aria-label="Status: ${esc(status)}">${esc(status).toUpperCase()}</b></div>`;
  }).join('');
}

export function renderAreaDetailRetro(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="rd-page" aria-label="${esc(area.name)} Area detail"><button class="rd-back" data-action="back-areas">&lt; AREAS</button><header class="rd-detail"><span>AREA NODE / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1><p>${area.routines.length} ROUTINES // ${sections.length} SECTIONS</p></header><section class="rd-block" aria-labelledby="rd-now-heading"><div class="rd-block-title"><h2 id="rd-now-heading">QUEUE: NOW</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="rd-quiet">NO ACTIVE ALERTS</p>'}</section><section class="rd-block" aria-labelledby="rd-sections-heading"><div class="rd-block-title"><h2 id="rd-sections-heading">SECTION DIRECTORY</h2><span aria-label="${sections.length} sections">${sections.length}</span></div>${sections.map((name, index) => { const count = area.routines.filter(item => item.section === name).length; const state = count ? `${count} routines` : 'Not configured'; return `<button class="rd-section" data-action="section-demo" aria-label="${esc(name)}. ${esc(state)}."><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><strong aria-hidden="true">${esc(name)}</strong><small aria-hidden="true">${state.toUpperCase()}</small><b aria-hidden="true">&gt;</b></button>`; }).join('') || '<button class="rd-section" data-action="section-demo" aria-label="General. Standalone routines."><span aria-hidden="true">01</span><strong aria-hidden="true">GENERAL</strong><small aria-hidden="true">STANDALONE ROUTINES</small><b aria-hidden="true">&gt;</b></button>'}</section><section class="rd-block" aria-labelledby="rd-later-heading"><div class="rd-block-title"><h2 id="rd-later-heading">QUEUE: LATER</h2><span aria-label="${later.length} routines">${later.length}</span></div>${routineRows(later, area.name) || '<p class="rd-quiet">QUEUE EMPTY</p>'}</section></section>`;
}

export function renderInterventionRetro(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="rd-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="rd-scan" aria-hidden="true"></div><div class="rd-alert" aria-label="Current session: ${item.minutes} minutes in ${esc(item.app)}"><span aria-hidden="true">CONTEXT TIMER</span><strong aria-hidden="true">${String(item.minutes).padStart(2, '0')}:00</strong><small aria-hidden="true">${esc(item.app).toUpperCase()}</small></div><h1>SWITCH MODE?</h1><p>YOUR CURRENT SESSION CAN CONTINUE. A SMALL ALTERNATIVE IS AVAILABLE.</p><article class="rd-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">OPTIONAL TASK</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} // ${item.duration} MIN</p></article><div class="rd-actions"><button class="rd-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">START TASK</button><button class="rd-secondary" data-action="different-demo">SHOW ALTERNATE</button><button class="rd-dismiss" data-action="not-now-demo">STAY HERE</button></div></section>`;
}
