import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

const ATTENTION_STATUSES = new Set(['overdue', 'today']);

function statusToken(item) {
  const label = item.completion ? item.completion.completedLabel : dueLabel(item.status);
  const token = item.completion ? 'completed' : item.status;
  return `<span class="pm-status pm-${esc(token)}" aria-label="Status: ${esc(label)}">${esc(label)}</span>`;
}

function allRoutines(areas) {
  const order = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };
  return areas
    .flatMap(area => area.routines.map(routine => ({ ...routine, areaId: area.id, areaName: area.name })))
    .sort((a, b) => {
      const completionDelta = Number(Boolean(a.completion)) - Number(Boolean(b.completion));
      return completionDelta || order[a.status] - order[b.status] || a.title.localeCompare(b.title);
    });
}

function areaRows(areas) {
  return areas.map(area => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const nextTitle = next ? next.title : 'No routines configured';
    const structure = area.sections ? `${area.sections} sections` : 'standalone area';
    const ariaLabel = `${area.name}. ${status.label}. Next routine: ${nextTitle}. ${area.routines.length} routines, ${structure}.`;
    return `
      <button class="pm-area-row ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(ariaLabel)}">
        <span class="pm-area-main">
          <strong>${esc(area.name)}</strong>
          <small>${area.routines.length} routines${area.sections ? ` / ${area.sections} sections` : ' / standalone'}</small>
        </span>
        <span class="pm-area-next">${esc(nextTitle)}</span>
        <span class="pm-area-state"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
        <span class="pm-arrow" aria-hidden="true">→</span>
      </button>`;
  }).join('');
}

function routineRows(items, areaName) {
  return items.map(item => {
    const section = item.section || areaName;
    const completed = Boolean(item.completion);
    const checkboxLabel = completed ? `Reopen ${item.title}` : `Complete ${item.title}`;
    const action = completed ? 'reopen-routine' : 'complete-routine';
    const details = `${section} / ${item.tier || 'Light'} / ${item.repeat} / ${item.minutes} min`;
    return `
      <div class="pm-routine-row ${completed ? 'completed' : ''}">
        <button class="pm-check" data-action="${action}" data-area-id="${esc(item.areaId || '')}" data-chore-id="${esc(item.id)}" aria-label="${esc(checkboxLabel)}" aria-pressed="${completed}"><span aria-hidden="true">${completed ? '✓' : ''}</span></button>
        <button class="pm-routine-open" data-area-id="${esc(item.areaId || '')}" data-section-id="${esc(item.section || 'General')}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}. ${details}.`)}">
          <span class="pm-routine-main"><strong>${esc(item.title)}</strong><small>${esc(details)}</small></span>
          ${statusToken(item)}
        </button>
      </div>`;
  }).join('');
}

export function renderTodayPrecision(data) {
  const routines = allRoutines(data.areas);
  const attention = routines.filter(item => !item.completion && ATTENTION_STATUSES.has(item.status));
  const completed = routines.filter(item => item.completion);
  const focus = attention[0] || routines.find(item => !item.completion) || null;
  const affected = new Set(attention.map(item => item.areaId)).size;

  if (!data.areas.length) {
    return `
      <section class="pm-page pm-today-page" aria-label="Today empty state">
        <header class="pm-header">
          <div class="pm-kicker">NUDGE / TODAY</div>
          <h1>Nothing configured</h1>
          <p>Add one area to create a useful next action.</p>
        </header>
        <div class="pm-empty">
          <span class="pm-index" aria-hidden="true">00</span>
          <h2>No active routines</h2>
          <p>The first setup action remains intentionally simple.</p>
          <button class="pm-primary" data-action="demo-add-area">Open setup</button>
        </div>
      </section>`;
  }

  return `
    <section class="pm-page pm-today-page" aria-label="Precision Minimal Today overview">
      <header class="pm-header pm-header-grid">
        <div>
          <div class="pm-kicker">NUDGE / TODAY</div>
          <h1>${attention.length ? 'Needs attention' : 'All current'}</h1>
          <p>${attention.length ? `${attention.length} active routines across ${affected} ${affected === 1 ? 'area' : 'areas'}.` : 'No due or overdue routines remain.'}</p>
        </div>
        <div class="pm-summary" aria-label="${attention.length} active routines">
          <strong>${String(attention.length).padStart(2, '0')}</strong>
          <span>${attention.length ? 'active now' : 'clear'}</span>
        </div>
      </header>
      ${focus ? `
        <section class="pm-focus-panel ${esc(focus.status)}" aria-label="Next action: ${esc(focus.title)} in ${esc(focus.areaName)}">
          <div class="pm-focus-meta"><span>01 / NEXT ACTION</span><span>${focus.minutes} MIN</span></div>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.areaName)} / ${esc(focus.section || 'General')} / ${esc(focus.tier || 'Light')}</p>
          <div class="pm-focus-actions">
            <button class="pm-primary" data-area-id="${esc(focus.areaId)}" data-section-id="${esc(focus.section || 'General')}" data-chore-id="${esc(focus.id)}">Open detail</button>
            ${focus.completion ? `<button class="pm-secondary" data-action="reopen-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">Reopen</button>` : `<button class="pm-secondary" data-action="complete-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">Complete now</button>`}
          </div>
        </section>` : `
        <section class="pm-clear-panel" aria-label="All clear">
          <span aria-hidden="true">00</span><div><strong>Queue clear</strong><p>As-needed routines remain available in Areas.</p></div>
        </section>`}
      <section class="pm-block" aria-label="Attention queue">
        <div class="pm-block-title"><h2>Queue</h2><span>${attention.length}</span></div>
        ${attention.length ? routineRows(attention.map(item => ({ ...item, areaId: item.areaId })), '') : '<p class="pm-quiet">No due or overdue routines.</p>'}
      </section>
      ${completed.length ? `
        <section class="pm-block" aria-label="Completed this session">
          <div class="pm-block-title"><h2>Completed</h2><span>${completed.length}</span></div>
          ${routineRows(completed.map(item => ({ ...item, areaId: item.areaId })), '')}
        </section>` : ''}
      <button class="pm-add" data-action="open-areas">View all areas</button>
    </section>`;
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
          <span class="pm-index" aria-hidden="true">00</span>
          <h2>No areas configured</h2>
          <p>Add Home, Car, Personal, Work, or another place you want to maintain.</p>
          <button class="pm-primary" data-action="demo-add-area">Add first area</button>
        </div>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const summaryLabel = attention
    ? `${attention} routines need attention across ${affected} ${affected === 1 ? 'area' : 'areas'}.`
    : 'All important routines are current.';
  return `
    <section class="pm-page">
      <header class="pm-header pm-header-grid">
        <div>
          <div class="pm-kicker">NUDGE / AREAS</div>
          <h1>Areas</h1>
          <p>Recurring care, organized by place.</p>
        </div>
        <div class="pm-summary" aria-label="${esc(summaryLabel)}">
          <strong>${String(attention).padStart(2, '0')}</strong>
          <span>${attention ? `attention / ${affected} areas` : 'all current'}</span>
        </div>
      </header>
      <div class="pm-column-head" aria-hidden="true"><span>Area</span><span>Next routine</span><span>Status</span><span></span></div>
      <div class="pm-area-table">${areaRows(data.areas)}</div>
      <button class="pm-add" data-action="demo-add-area">+ Add area</button>
    </section>`;
}

export function renderAreaDetailPrecision(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const enriched = area.routines.map(item => ({ ...item, areaId: area.id }));
  const attention = enriched.filter(item => !item.completion && ATTENTION_STATUSES.has(item.status));
  const later = enriched.filter(item => item.completion || !ATTENTION_STATUSES.has(item.status));
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `
    <section class="pm-page">
      <button class="pm-back" data-action="back-areas">← Areas</button>
      <header class="pm-detail-header">
        <div><div class="pm-kicker">AREA / ${esc(area.id).toUpperCase()}</div><h1>${esc(area.name)}</h1><p>${area.routines.length} recurring routines</p></div>
        <div class="pm-detail-metrics" aria-label="${attention.length} routines need attention. ${sections.length} sections."><span><b>${String(attention.length).padStart(2, '0')}</b><small>attention</small></span><span><b>${String(sections.length).padStart(2, '0')}</b><small>sections</small></span></div>
      </header>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Needs attention</h2><span>${attention.length}</span></div>
        ${attention.length ? routineRows(attention, area.name) : '<p class="pm-quiet">No due or overdue routines.</p>'}
      </section>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Sections</h2><span>${sections.length}</span></div>
        ${sections.map(name => {
          const count = area.routines.filter(item => (item.section || 'General') === name).length;
          const sectionState = count ? `${count} routines` : 'Not configured';
          return `<button class="pm-section-row" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(name)}. ${esc(sectionState)}."><span><strong>${esc(name)}</strong><small>${sectionState}</small></span><span aria-hidden="true">${String(count).padStart(2, '0')} →</span></button>`;
        }).join('')}
      </section>
      <section class="pm-block">
        <div class="pm-block-title"><h2>Later / completed</h2><span>${later.length}</span></div>
        ${later.length ? routineRows(later, area.name) : '<p class="pm-quiet">No later routines.</p>'}
      </section>
    </section>`;
}

export function renderSectionPrecision(data, requestedAreaId, requestedSectionId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSectionId || 'General';
  const routines = area.routines
    .filter(item => (item.section || 'General') === sectionName)
    .map(item => ({ ...item, areaId: area.id }));
  const configured = routines.length > 0;

  return `
    <section class="pm-page pm-section-page" aria-label="${esc(`${area.name}, ${sectionName} section`)}">
      <button class="pm-back" data-action="back-area">← ${esc(area.name)}</button>
      <header class="pm-detail-header">
        <div><div class="pm-kicker">SECTION / ${esc(area.id).toUpperCase()}</div><h1>${esc(sectionName)}</h1><p>${configured ? `${routines.length} recurring ${routines.length === 1 ? 'routine' : 'routines'}` : 'Not configured'}</p></div>
        <div class="pm-detail-metrics"><span><b>${String(routines.filter(item => !item.completion && ATTENTION_STATUSES.has(item.status)).length).padStart(2, '0')}</b><small>attention</small></span><span><b>${String(routines.length).padStart(2, '0')}</b><small>total</small></span></div>
      </header>
      ${configured ? `
        <section class="pm-block">
          <div class="pm-block-title"><h2>Routines</h2><span>${routines.length}</span></div>
          ${routineRows(routines, area.name)}
        </section>` : `
        <div class="pm-empty pm-section-empty">
          <span class="pm-index" aria-hidden="true">00</span>
          <h2>Section not configured</h2>
          <p>This state stays visible without creating pressure to finish setup now.</p>
        </div>`}
    </section>`;
}

export function renderChorePrecision(data, requestedAreaId, requestedSectionId, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');
  const sectionName = routine.section || requestedSectionId || 'General';
  const completed = Boolean(routine.completion);
  const currentLabel = completed ? routine.completion.completedLabel : dueLabel(routine.status);
  const nextLabel = completed ? routine.completion.nextLabel : 'Completion advances the deterministic recurrence cycle.';

  return `
    <section class="pm-page pm-chore-page" aria-label="${esc(`${routine.title} chore detail`)}">
      <button class="pm-back" data-action="back-section">← ${esc(sectionName)}</button>
      <header class="pm-header">
        <div class="pm-kicker">CHORE / ${esc(area.id).toUpperCase()}</div>
        <h1>${esc(routine.title)}</h1>
        <p>${esc(area.name)} / ${esc(sectionName)}</p>
      </header>
      <section class="pm-chore-status ${completed ? 'completed' : esc(routine.status)}" aria-label="Current status: ${esc(currentLabel)}">
        <div><span>STATUS</span><strong>${esc(currentLabel)}</strong></div>
        <b>${completed ? '✓' : String(routine.minutes).padStart(2, '0')}</b>
      </section>
      <dl class="pm-facts">
        <div><dt>Recurrence tier</dt><dd>${esc(routine.tier || 'Light')}</dd></div>
        <div><dt>Schedule</dt><dd>${esc(routine.repeat)}</dd></div>
        <div><dt>Estimated time</dt><dd>${routine.minutes} minutes</dd></div>
        <div><dt>Next state</dt><dd>${esc(nextLabel)}</dd></div>
      </dl>
      <div class="pm-chore-actions">
        ${completed
          ? `<button class="pm-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Undo completion</button>`
          : `<button class="pm-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Mark complete</button>`}
        <button class="pm-dismiss" data-action="back-section">Return to section</button>
      </div>
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
        <article class="pm-suggestion" aria-labelledby="pm-suggestion-title">
          <span>Suggested action</span>
          <h2 id="pm-suggestion-title">${esc(item.task)}</h2>
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
