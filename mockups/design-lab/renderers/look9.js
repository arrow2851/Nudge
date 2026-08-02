import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const meterLevel = `${Math.min(4, attentionCount(area)) * 25}%`;
    return `<button class="rd-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(`${area.name}. ${status.label}. ${next ? `Next routine: ${next.title}.` : ''}`)}"><span class="rd-slot">A${index + 1}</span><span class="rd-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES · ${area.sections || 0} SECTIONS</small><em>${next ? esc(next.title) : 'NO ROUTINE DATA'}</em></span><span class="rd-meter"><i style="--level:${meterLevel}" aria-hidden="true"></i><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span></button>`;
  }).join('');
}

export function renderAreasRetro(data) {
  if (!data.areas.length) return `<section class="rd-page"><header class="rd-header"><span>NUDGE OS / AREAS</span><h1>NO AREA DATA</h1><p>Initialize one place to begin routine tracking.</p></header><div class="rd-empty"><div aria-hidden="true">[ + ]</div><h2>CREATE FIRST AREA</h2><button class="rd-primary" data-action="demo-add-area">INITIALIZE</button></div></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  return `<section class="rd-page"><header class="rd-header rd-header-grid"><div><span>NUDGE OS / AREAS</span><h1>HOME SYSTEM</h1><p>Routine map online.</p></div><div class="rd-display"><small>ATTENTION</small><strong>${String(attention).padStart(2, '0')}</strong><em>${attention ? 'ACTION READY' : 'SYSTEM CLEAR'}</em></div></header><div class="rd-command">SELECT AREA // ${data.areas.length} AVAILABLE</div><div class="rd-list">${areaRows(data.areas)}</div><button class="rd-add" data-action="demo-add-area">[ + ADD AREA ]</button></section>`;
}

function routineRows(items, areaName) {
  return items.map((item, index) => `<div class="rd-routine"><span class="rd-line">${String(index + 1).padStart(2, '0')}</span><button class="rd-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}">[ ]</button><span class="rd-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} // ${esc(item.repeat)} // ${item.minutes} MIN</small></span><b class="rd-tag ${esc(item.status)}">${esc(dueLabel(item.status)).toUpperCase()}</b></div>`).join('');
}

export function renderAreaDetailRetro(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="rd-page"><button class="rd-back" data-action="back-areas">&lt; AREAS</button><header class="rd-detail"><span>AREA NODE / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1><p>${area.routines.length} ROUTINES // ${sections.length} SECTIONS</p></header><section class="rd-block"><div class="rd-block-title"><h2>QUEUE: NOW</h2><span>${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="rd-quiet">NO ACTIVE ALERTS</p>'}</section><section class="rd-block"><div class="rd-block-title"><h2>SECTION DIRECTORY</h2><span>${sections.length}</span></div>${sections.map((name, index) => { const count = area.routines.filter(item => item.section === name).length; return `<button class="rd-section" data-action="section-demo"><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(name)}</strong><small>${count ? `${count} ROUTINES` : 'NOT CONFIGURED'}</small><b aria-hidden="true">&gt;</b></button>`; }).join('') || '<button class="rd-section" data-action="section-demo"><span>01</span><strong>GENERAL</strong><small>STANDALONE ROUTINES</small><b>&gt;</b></button>'}</section><section class="rd-block"><div class="rd-block-title"><h2>QUEUE: LATER</h2><span>${later.length}</span></div>${routineRows(later, area.name) || '<p class="rd-quiet">QUEUE EMPTY</p>'}</section></section>`;
}

export function renderInterventionRetro(data) {
  const item = data.intervention;
  return `<section class="rd-intervention"><div class="rd-scan" aria-hidden="true"></div><div class="rd-alert"><span>CONTEXT TIMER</span><strong>${String(item.minutes).padStart(2, '0')}:00</strong><small>${esc(item.app).toUpperCase()}</small></div><h1>SWITCH MODE?</h1><p>CURRENT SESSION CAN CONTINUE. OPTIONAL ACTION AVAILABLE.</p><article class="rd-suggestion"><span>RECOMMENDED TASK</span><h2>${esc(item.task)}</h2><p>${esc(item.location)} // ${item.duration} MIN</p></article><div class="rd-actions"><button class="rd-primary" data-action="start-demo">EXECUTE TASK</button><button class="rd-secondary" data-action="different-demo">LOAD ALTERNATE</button><button class="rd-dismiss" data-action="not-now-demo">CONTINUE SESSION</button></div></section>`;
}
