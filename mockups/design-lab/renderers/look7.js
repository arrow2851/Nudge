import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    return `<button class="bu-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(`${area.name}. ${status.label}. ${next ? `Next: ${next.title}.` : ''}`)}"><span class="bu-index">${String(index + 1).padStart(2, '0')}</span><span class="bu-main"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES / ${area.sections || 0} SECTIONS</small></span><span class="bu-next">${next ? esc(next.title) : 'NO ROUTINES'}</span><span class="bu-state"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span><span class="bu-arrow" aria-hidden="true">↗</span></button>`;
  }).join('');
}

export function renderAreasBold(data) {
  if (!data.areas.length) return `<section class="bu-page"><header class="bu-header"><span>NUDGE / AREAS</span><h1>NO AREAS.<br>START ONE.</h1><p>Build the system around the places you actually maintain.</p></header><button class="bu-primary bu-empty-action" data-action="demo-add-area">+ ADD FIRST AREA</button></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  return `<section class="bu-page"><header class="bu-header bu-header-grid"><div><span>NUDGE / AREAS</span><h1>HOUSEHOLD<br>CONTROL.</h1><p>Clear structure. No decoration. Everything visible.</p></div><div class="bu-counter"><strong>${String(attention).padStart(2, '0')}</strong><span>${attention ? 'NEED ATTENTION' : 'ALL CURRENT'}</span></div></header><div class="bu-table-head" aria-hidden="true"><span>#</span><span>AREA</span><span>NEXT</span><span>STATE</span><span></span></div><div class="bu-list">${areaRows(data.areas)}</div><button class="bu-add" data-action="demo-add-area">+ ADD AREA</button></section>`;
}

function routineRows(items, areaName) {
  return items.map(item => `<div class="bu-routine"><button class="bu-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}">×</button><span><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} / ${esc(item.repeat)} / ${item.minutes} MIN</small></span><b class="bu-tag ${esc(item.status)}">${esc(dueLabel(item.status))}</b></div>`).join('');
}

export function renderAreaDetailBold(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="bu-page"><button class="bu-back" data-action="back-areas">← AREAS</button><header class="bu-detail"><div><span>AREA / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1></div><div><strong>${String(attention.length).padStart(2, '0')}</strong><small>ATTENTION</small></div></header><section class="bu-block"><div class="bu-block-title"><h2>NOW</h2><span>${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="bu-quiet">NO DUE ITEMS.</p>'}</section><section class="bu-block"><div class="bu-block-title"><h2>SECTIONS</h2><span>${sections.length}</span></div>${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; return `<button class="bu-section" data-action="section-demo"><strong>${esc(name)}</strong><span>${String(count).padStart(2, '0')} →</span></button>`; }).join('') || '<button class="bu-section" data-action="section-demo"><strong>GENERAL</strong><span>→</span></button>'}</section><section class="bu-block"><div class="bu-block-title"><h2>LATER</h2><span>${later.length}</span></div>${routineRows(later, area.name) || '<p class="bu-quiet">NO LATER ITEMS.</p>'}</section></section>`;
}

export function renderInterventionBold(data) {
  const item = data.intervention;
  return `<section class="bu-intervention"><div class="bu-marquee">NUDGE / CONTEXT SWITCH / ${item.minutes} MIN / ${esc(item.app).toUpperCase()}</div><div class="bu-intervention-body"><span class="bu-stop" aria-hidden="true">■</span><h1>STOP.<br>CHOOSE.</h1><p>You can stay in ${esc(item.app)}. Or redirect the next ${item.duration} minutes.</p><article><span>SUGGESTED ACTION</span><h2>${esc(item.task)}</h2><p>${esc(item.location)} / ${item.duration} MIN</p></article></div><div class="bu-actions"><button class="bu-primary" data-action="start-demo">START ACTION</button><button class="bu-secondary" data-action="different-demo">CHOOSE ANOTHER</button><button class="bu-dismiss" data-action="not-now-demo">NOT NOW</button></div></section>`;
}
