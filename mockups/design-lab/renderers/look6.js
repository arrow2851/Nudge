import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function priorityRoutine(areas) {
  const order = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };
  return areas
    .flatMap(area => area.routines.map(routine => ({ ...routine, areaId: area.id, areaName: area.name })))
    .sort((a, b) => order[a.status] - order[b.status])[0] || null;
}

function tactileStatus(area) {
  const status = statusFor(area);
  if (status.className === 'overdue') return { ...status, phrase: 'Service overdue' };
  if (status.className === 'due') return { ...status, phrase: 'Due today' };
  return { ...status, phrase: 'In good order' };
}

function areaCards(areas) {
  return areas.map((area, index) => {
    const status = tactileStatus(area);
    const next = nextRoutine(area);
    const accessible = `${area.name}. ${status.label}. ${area.routines.length} routines${area.sections ? ` and ${area.sections} sections` : ''}. ${next ? `Next routine: ${next.title}.` : ''}`;
    return `
      <button class="th-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(accessible)}">
        <span class="th-card-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <span class="th-area-copy">
          <strong>${esc(area.name)}</strong>
          <small>${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ' · standalone'}</small>
        </span>
        <span class="th-area-next">
          <small>Next on card</small>
          <strong>${next ? esc(next.title) : 'No routines configured'}</strong>
        </span>
        <span class="th-stamp ${status.className || 'clear'}">${esc(status.phrase)}</span>
        <span class="th-card-handle" aria-hidden="true">›</span>
      </button>`;
  }).join('');
}

export function renderAreasTactile(data) {
  if (!data.areas.length) {
    return `
      <section class="th-page th-empty-page">
        <header class="th-header">
          <span class="th-label">NUDGE MAINTENANCE BOARD</span>
          <h1>Set up one useful station.</h1>
          <p>Add Home, Car, Work, Personal, or any Area you want to keep in order.</p>
        </header>
        <div class="th-empty-card">
          <span class="th-paperclip" aria-hidden="true"></span>
          <strong>No Area cards yet</strong>
          <p>Start with the place that would make daily life easier.</p>
          <button class="th-primary" data-action="demo-add-area">Create first Area card</button>
        </div>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const focus = priorityRoutine(data.areas);
  return `
    <section class="th-page">
      <header class="th-header">
        <span class="th-label">NUDGE MAINTENANCE BOARD</span>
        <h1>Your Area cards</h1>
        <p>Recurring care, filed where it belongs.</p>
      </header>
      <section class="th-summary-board" aria-label="${attention ? `${attention} routines need attention across ${affected} areas.` : 'All important routines are current.'}">
        <div><span>FLAGGED</span><strong>${String(attention).padStart(2, '0')}</strong></div>
        <div><span>AREAS</span><strong>${String(data.areas.length).padStart(2, '0')}</strong></div>
        <p>${attention ? `${affected} ${affected === 1 ? 'Area has' : 'Areas have'} something ready for attention.` : 'Everything important is in good order.'}</p>
      </section>
      ${focus ? `
        <article class="th-next-card ${esc(focus.status)}">
          <span class="th-tab">NEXT USEFUL JOB</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.areaName)} · about ${focus.minutes} minutes</p>
          <button data-area-id="${esc(focus.areaId)}">Open Area card</button>
        </article>` : ''}
      <section class="th-card-stack" aria-label="All Area cards">
        ${areaCards(data.areas)}
      </section>
      <button class="th-add" data-action="demo-add-area">+ Add Area card</button>
    </section>`;
}

function routineRow(item, areaName) {
  const fullLabel = `${item.title}. ${dueLabel(item.status)}. ${item.section || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `
    <div class="th-routine-row ${esc(item.status)}">
      <button class="th-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span aria-hidden="true"></span></button>
      <span class="th-routine-copy">
        <strong>${esc(item.title)}</strong>
        <small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small>
      </span>
      <span class="th-status-tag ${esc(item.status)}" aria-label="${esc(fullLabel)}">${esc(dueLabel(item.status))}</span>
    </div>`;
}

export function renderAreaDetailTactile(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const focus = attention[0] || later[0] || null;
  const remainingAttention = focus ? attention.filter(item => item !== focus) : attention;
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `
    <section class="th-page th-detail-page">
      <button class="th-back" data-action="back-areas">← Maintenance board</button>
      <header class="th-detail-header">
        <span class="th-label">AREA SERVICE CARD</span>
        <div class="th-title-plate">
          <h1>${esc(area.name)}</h1>
          <div><span>${String(area.routines.length).padStart(2, '0')} routines</span><span>${String(sections.length).padStart(2, '0')} sections</span></div>
        </div>
      </header>
      ${focus ? `
        <article class="th-job-card ${esc(focus.status)}">
          <span class="th-tab">${attention.length ? 'ON THE BENCH' : 'READY WHEN NEEDED'}</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.section || area.name)} · ${esc(focus.repeat)} · about ${focus.minutes} minutes</p>
          <button class="th-primary" data-action="complete-demo">Mark job complete</button>
        </article>` : ''}
      ${remainingAttention.length ? `
        <section class="th-block">
          <div class="th-block-label"><span>FLAGGED JOBS</span><b>${remainingAttention.length}</b></div>
          ${remainingAttention.map(item => routineRow(item, area.name)).join('')}
        </section>` : ''}
      <section class="th-block">
        <div class="th-block-label"><span>SECTION DRAWERS</span><b>${sections.length}</b></div>
        ${sections.map(name => {
          const count = area.routines.filter(item => item.section === name).length;
          const label = `${name}. ${count ? `${count} routines.` : 'Not configured yet.'}`;
          return `<button class="th-section-row" data-action="section-demo" aria-label="${esc(label)}"><span class="th-drawer-pull" aria-hidden="true"></span><span><strong>${esc(name)}</strong><small>${count ? `${count} routines` : 'Not configured yet'}</small></span><span aria-hidden="true">›</span></button>`;
        }).join('') || '<button class="th-section-row" data-action="section-demo"><span class="th-drawer-pull" aria-hidden="true"></span><span><strong>General</strong><small>Standalone routines</small></span><span aria-hidden="true">›</span></button>'}
      </section>
      <section class="th-block">
        <div class="th-block-label"><span>LATER / AS NEEDED</span><b>${later.filter(item => item !== focus).length}</b></div>
        ${later.filter(item => item !== focus).map(item => routineRow(item, area.name)).join('') || '<p class="th-quiet">No additional jobs are filed here.</p>'}
      </section>
    </section>`;
}

export function renderInterventionTactile(data) {
  const item = data.intervention;
  return `
    <section class="th-intervention">
      <div class="th-timer-panel" aria-label="${item.minutes} minutes spent in ${esc(item.app)}">
        <span class="th-panel-label">CURRENT SESSION</span>
        <strong>${String(item.minutes).padStart(2, '0')}</strong>
        <small>MIN · ${esc(item.app).toUpperCase()}</small>
        <span class="th-panel-light" aria-hidden="true"></span>
      </div>
      <div class="th-intervention-copy">
        <span class="th-label">A PRACTICAL PAUSE</span>
        <h1>Want to switch tasks for a moment?</h1>
        <p>You can stay where you are. Nudge is only offering one small job that may feel good to finish.</p>
      </div>
      <article class="th-ticket">
        <span class="th-ticket-hole" aria-hidden="true"></span>
        <span class="th-tab">SUGGESTED JOB</span>
        <h2>${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      <div class="th-actions">
        <button class="th-primary" data-action="start-demo">Start this job</button>
        <button class="th-secondary" data-action="different-demo">Pull another card</button>
        <button class="th-dismiss" data-action="not-now-demo">Not now</button>
      </div>
    </section>`;
}
