import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function statusToken(item) {
  return `<span class="pm-status pm-${esc(item.status)}">${esc(dueLabel(item.status))}</span>`;
}

function areaRows(areas) {
  return areas.map(area => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    return `
      <button class="pm-area-row ${status.className}" data-area-id="${esc(area.id)}">
        <span class="pm-area-main">
          <strong>${esc(area.name)}</strong>
          <small>${area.routines.length} routines${area.sections ? ` / ${area.sections} sections` : ' / standalone'}</small>
        </span>
        <span class="pm-area-next">${next ? esc(next.title) : 'No routines configured'}</span>
        <span class="pm-area-state"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
        <span class="pm-arrow" aria-hidden="true">→</span>
      </button>`;
  }).join('');
}

export function renderAreasPrecision(data) {
  if (!data.areas.length) {
    return `
      <section class="pm-page">
        <header class="pm-header">
          <div class="pm-kicker">NUDGE / AREAS</div>
          <h1>Areas</h1>
          <p>Recurring care, organized by place.</p>
        </header>
        <div class="pm-empty">
          <span class="pm-index">00</span>
          <h2>No areas configured</h2>
          <p>Add Home, Car, Personal, Work, or another place you want to maintain.</p>
          <button class="pm-primary" data-action="demo-add-area">Add first area</button>
        </div>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  return `
    <section class="pm-page">
      <header class="pm-header pm-header-grid">
        <div>
          <div class="pm-kicker">NUDGE / AREAS</div>
          <h1>Areas</h1>
          <p>Recurring care, organized by place.</p>
        </div>
        <div class="pm-summary">
          <strong>${String(attention).padStart(2, '0')}</strong>
          <span>${attention ? `attention / ${affected} areas` : 'all current'}</span>
        </div>
      </header>
      <div class="pm-column-head"><span>Area</span><span>Next routine</span><span>Status</span><span></span></div>
      <div class="pm-area-table">${areaRows(data.areas)}</div>
      <button class="pm-add" data-action="demo-add-area">+ Add area</button>
    </section>`;
}

function routineRows(items, areaName) {
  return items.map(item => `
    <div class="pm-routine-row">
      <button class="pm-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span></span></button>
      <span class="pm-routine-main"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} / ${esc(item.repeat)} / ${item.minutes} min</small></span>
      ${statusToken(item)}
    </div>`).join('');
}

export function renderAreaDetailPrecision(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `
    <section class="pm-page">
      <button class="pm-back" data-action="back-areas">← Areas</button>
      <header class="pm-detail-header">
        <div><div class="pm-kicker">AREA / ${esc(area.id).toUpperCase()}</div><h1>${esc(area.name)}</h1><p>${area.routines.length} recurring routines</p></div>
        <div class="pm-detail-metrics"><span><b>${String(attention.length).padStart(2, '0')}</b><small>attention</small></span><span><b>${String(sections.length).padStart(2, '0')}</b><small>sections</small></span></div>
      </header>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Needs attention</h2><span>${attention.length}</span></div>
        ${attention.length ? routineRows(attention, area.name) : '<p class="pm-quiet">No due or overdue routines.</p>'}
      </section>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Sections</h2><span>${sections.length}</span></div>
        ${sections.map(name => {
          const count = area.routines.filter(item => item.section === name).length;
          return `<button class="pm-section-row" data-action="section-demo"><span><strong>${esc(name)}</strong><small>${count ? `${count} routines` : 'Not configured'}</small></span><span>${String(count).padStart(2, '0')} →</span></button>`;
        }).join('') || '<button class="pm-section-row" data-action="section-demo"><span><strong>General</strong><small>Standalone routines</small></span><span>→</span></button>'}
      </section>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Later</h2><span>${later.length}</span></div>
        ${routineRows(later, area.name)}
      </section>
    </section>`;
}

export function renderInterventionPrecision(data) {
  const item = data.intervention;
  return `
    <section class="pm-intervention">
      <div class="pm-intervention-meta"><span>NUDGE / PAUSE</span><span>${item.minutes} MIN / ${esc(item.app).toUpperCase()}</span></div>
      <div class="pm-intervention-body">
        <div class="pm-signal" aria-hidden="true"></div>
        <h1>Pause here?</h1>
        <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. No judgment—this may be a useful time to switch context.</p>
        <article class="pm-suggestion">
          <span>Suggested action</span>
          <h2>${esc(item.task)}</h2>
          <div><b>${esc(item.location)}</b><b>${item.duration} min</b></div>
        </article>
      </div>
      <div class="pm-intervention-actions">
        <button class="pm-primary" data-action="start-demo">Start suggested action</button>
        <button class="pm-secondary" data-action="different-demo">Choose another</button>
        <button class="pm-dismiss" data-action="not-now-demo">Not now</button>
      </div>
    </section>`;
}
