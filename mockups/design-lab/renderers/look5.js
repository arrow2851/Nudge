import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

const iconFor = id => ({ kitchen: '✦', bathroom: '◌', 'living-room': '◇', bedroom: '☾', car: '↗', work: '▣', personal: '●' })[id] || '■';

function areaCards(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const label = `${area.name}. ${status.label}. ${next ? `Next routine: ${next.title}.` : 'No routines configured.'}`;
    return `<button class="pl-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}">
      <span class="pl-card-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span>
      <span class="pl-card-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} routines · ${area.sections || 'standalone'}${area.sections ? ' sections' : ''}</small><em>${next ? esc(next.title) : 'Ready to set up'}</em></span>
      <span class="pl-card-status"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
    </button>`;
  }).join('');
}

export function renderAreasPlayful(data) {
  if (!data.areas.length) {
    return `<section class="pl-page"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Build your little world.</h1><p>Start with one place you want to feel easier.</p></header><div class="pl-empty"><span aria-hidden="true">＋</span><h2>Add your first Area</h2><p>Home, Car, Work, Personal—anything can become a manageable block.</p><button class="pl-primary" data-action="demo-add-area">Create an Area</button></div></section>`;
  }
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  return `<section class="pl-page"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Everything has a place.</h1><p>${attention ? `${attention} routines are asking for a little attention.` : 'Nothing urgent. Browse whenever it helps.'}</p></header><div class="pl-summary"><strong>${attention || '✓'}</strong><span>${attention ? 'small things to move forward' : 'all caught up'}</span></div><div class="pl-area-grid">${areaCards(data.areas)}</div><button class="pl-add" data-action="demo-add-area">＋ Add another Area</button></section>`;
}

function routineRows(items, areaName) {
  return items.map(item => `<div class="pl-routine-row"><button class="pl-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}">✓</button><span class="pl-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span><span class="pl-pill ${esc(item.status)}">${esc(dueLabel(item.status))}</span></div>`).join('');
}

export function renderAreaDetailPlayful(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="pl-page"><button class="pl-back" data-action="back-areas">← All Areas</button><header class="pl-detail-header"><span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span><div><span class="pl-chip">AREA</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></div></header><section class="pl-block pl-attention"><div class="pl-block-title"><h2>Do these first</h2><span>${attention.length}</span></div>${attention.length ? routineRows(attention, area.name) : '<p class="pl-quiet">Nothing is pressing right now.</p>'}</section><section class="pl-block"><div class="pl-block-title"><h2>Sections</h2><span>${sections.length}</span></div><div class="pl-section-grid">${sections.map(name => { const count = area.routines.filter(item => item.section === name).length; return `<button class="pl-section-card" data-action="section-demo"><span aria-hidden="true">▦</span><strong>${esc(name)}</strong><small>${count ? `${count} routines` : 'Not configured yet'}</small></button>`; }).join('') || '<button class="pl-section-card" data-action="section-demo"><span aria-hidden="true">▦</span><strong>General</strong><small>Standalone routines</small></button>'}</div></section><section class="pl-block"><div class="pl-block-title"><h2>Later</h2><span>${later.length}</span></div>${routineRows(later, area.name) || '<p class="pl-quiet">No additional routines are waiting.</p>'}</section></section>`;
}

export function renderInterventionPlayful(data) {
  const item = data.intervention;
  return `<section class="pl-intervention"><div class="pl-orbit" aria-hidden="true"><span></span><b>↗</b></div><span class="pl-chip">A FRIENDLY PAUSE</span><h1>Want to swap screens for something small?</h1><p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Staying is okay. Switching is also okay.</p><article class="pl-suggestion"><span>TRY THIS</span><h2>${esc(item.task)}</h2><p>${esc(item.location)} · about ${item.duration} minutes</p></article><div class="pl-actions"><button class="pl-primary" data-action="start-demo">Let’s do this</button><button class="pl-secondary" data-action="different-demo">Show another</button><button class="pl-dismiss" data-action="not-now-demo">Keep scrolling for now</button></div></section>`;
}
