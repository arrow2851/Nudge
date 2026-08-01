import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function priorityRoutine(areas) {
  const order = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };
  return areas
    .flatMap(area => area.routines.map(routine => ({ ...routine, areaId: area.id, areaName: area.name })))
    .sort((a, b) => order[a.status] - order[b.status])[0] || null;
}

function calmStatus(area) {
  const status = statusFor(area);
  if (status.className === 'overdue') return { ...status, phrase: 'Needs a little care' };
  if (status.className === 'due') return { ...status, phrase: 'Something for today' };
  return { ...status, phrase: 'Quiet for now' };
}

function areaCards(areas) {
  return areas.map(area => {
    const status = calmStatus(area);
    const next = nextRoutine(area);
    const accessible = `${area.name}. ${status.label}. ${area.routines.length} routines${area.sections ? ` and ${area.sections} sections` : ''}. ${next ? `Next: ${next.title}.` : ''}`;
    return `
      <button class="zen-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(accessible)}">
        <span class="zen-area-copy">
          <strong>${esc(area.name)}</strong>
          <small>${status.phrase}</small>
        </span>
        <span class="zen-area-detail">
          <span>${next ? esc(next.title) : 'No routines configured'}</span>
          <small>${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ''}</small>
        </span>
        <span class="zen-area-count">${status.count}</span>
        <span class="zen-chevron" aria-hidden="true">›</span>
      </button>`;
  }).join('');
}

export function renderAreasZen(data) {
  if (!data.areas.length) {
    return `
      <section class="zen-page zen-empty-page">
        <header class="zen-header">
          <span class="zen-eyebrow">Areas</span>
          <h1>Begin with one place.</h1>
          <p>You do not need to organize everything at once. Add the place that would help most today.</p>
        </header>
        <div class="zen-empty-orbit" aria-hidden="true"><span></span></div>
        <button class="zen-primary" data-action="demo-add-area">Add your first area</button>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const focus = priorityRoutine(data.areas);
  return `
    <section class="zen-page">
      <header class="zen-header">
        <span class="zen-eyebrow">Your spaces</span>
        <h1>${attention ? 'A few things are asking for attention.' : 'Everything important can rest.'}</h1>
        <p>${attention ? `${attention} routines across ${affected} ${affected === 1 ? 'area' : 'areas'}. You only need to begin with one.` : 'As-needed routines remain nearby without creating urgency.'}</p>
      </header>
      ${focus ? `
        <article class="zen-focus-card ${esc(focus.status)}">
          <span class="zen-focus-label">A gentle place to start</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.areaName)} · about ${focus.minutes} minutes</p>
          <button data-area-id="${esc(focus.areaId)}">Open ${esc(focus.areaName)}</button>
        </article>` : ''}
      <section class="zen-area-list" aria-label="All areas">
        <div class="zen-section-heading"><span>All areas</span><small>${data.areas.length}</small></div>
        ${areaCards(data.areas)}
      </section>
      <button class="zen-add" data-action="demo-add-area">Add another area</button>
    </section>`;
}

function routineRow(item, areaName) {
  const label = `${item.title}. ${dueLabel(item.status)}. ${item.section || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `
    <div class="zen-routine-row ${esc(item.status)}">
      <button class="zen-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"><span></span></button>
      <span class="zen-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
      <span class="zen-routine-status" aria-label="${esc(label)}">${esc(dueLabel(item.status))}</span>
    </div>`;
}

export function renderAreaDetailZen(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const focus = attention[0] || later[0] || null;
  const remainingAttention = focus ? attention.filter(item => item !== focus) : attention;
  const sections = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `
    <section class="zen-page zen-detail-page">
      <button class="zen-back" data-action="back-areas">← All areas</button>
      <header class="zen-detail-header">
        <span class="zen-eyebrow">Area</span>
        <h1>${esc(area.name)}</h1>
        <p>${attention.length ? `${attention.length} need attention` : 'Nothing pressing'} · ${area.routines.length} recurring routines</p>
      </header>
      ${focus ? `
        <section class="zen-start-card ${esc(focus.status)}">
          <span>${attention.length ? 'Start here' : 'Available when useful'}</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.section || area.name)} · ${esc(focus.repeat)} · about ${focus.minutes} minutes</p>
          <button class="zen-primary" data-action="complete-demo">Mark complete</button>
        </section>` : ''}
      ${remainingAttention.length ? `
        <section class="zen-group">
          <div class="zen-section-heading"><span>Also needs attention</span><small>${remainingAttention.length}</small></div>
          ${remainingAttention.map(item => routineRow(item, area.name)).join('')}
        </section>` : ''}
      <section class="zen-group">
        <div class="zen-section-heading"><span>Sections</span><small>${sections.length}</small></div>
        ${sections.map(name => {
          const count = area.routines.filter(item => item.section === name).length;
          return `<button class="zen-section-row" data-action="section-demo"><span><strong>${esc(name)}</strong><small>${count ? `${count} routines` : 'Not configured yet'}</small></span><span aria-hidden="true">›</span></button>`;
        }).join('') || '<button class="zen-section-row" data-action="section-demo"><span><strong>General</strong><small>Standalone routines</small></span><span aria-hidden="true">›</span></button>'}
      </section>
      <section class="zen-group">
        <div class="zen-section-heading"><span>Later and as needed</span><small>${later.filter(item => item !== focus).length}</small></div>
        ${later.filter(item => item !== focus).map(item => routineRow(item, area.name)).join('') || '<p class="zen-quiet">Nothing else is waiting here.</p>'}
      </section>
    </section>`;
}

export function renderInterventionZen(data) {
  const item = data.intervention;
  return `
    <section class="zen-intervention">
      <div class="zen-pause-mark" aria-hidden="true"><span></span></div>
      <div class="zen-intervention-copy">
        <span class="zen-eyebrow">A small pause</span>
        <h1>Would stepping away help?</h1>
        <p>You have spent ${item.minutes} minutes in ${esc(item.app)}. There is no penalty for staying. This is simply a chance to choose again.</p>
      </div>
      <article class="zen-suggestion">
        <span>One useful option</span>
        <h2>${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      <div class="zen-actions">
        <button class="zen-primary" data-action="start-demo">Start this</button>
        <button class="zen-secondary" data-action="different-demo">Show another option</button>
        <button class="zen-dismiss" data-action="not-now-demo">Stay here for now</button>
      </div>
    </section>`;
}
