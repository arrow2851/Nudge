import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

const iconFor = id => ({
  kitchen: '✦',
  bathroom: '◌',
  'living-room': '◇',
  bedroom: '☾',
  car: '↗',
  work: '▣',
  personal: '●'
})[id] || '■';

const priority = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };

function allRoutines(areas) {
  return areas.flatMap(area => area.routines.map(routine => ({
    ...routine,
    areaId: area.id,
    areaName: area.name,
    sectionName: routine.section || 'General'
  })));
}

function statusText(item) {
  return item.completion ? 'Done just now' : dueLabel(item.status);
}

function areaCards(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="pl-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}">
      <span class="pl-card-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span>
      <span class="pl-card-copy">
        <strong>${esc(area.name)}</strong>
        <small>${area.routines.length} routines · ${area.sections || 'standalone'}${area.sections ? ' sections' : ''}</small>
        <em>${next ? esc(next.title) : 'Everything here is clear'}</em>
      </span>
      <span class="pl-card-status" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
    </button>`;
  }).join('');
}

function routineRow(item, areaName, areaId) {
  const completed = Boolean(item.completion);
  const sectionName = item.section || 'General';
  const action = completed ? 'reopen-routine' : 'complete-routine';
  const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
  const label = `${item.title}. ${statusText(item)}. ${sectionName || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `<div class="pl-routine-row ${completed ? 'completed' : ''}" aria-label="${esc(label)}">
    <button class="pl-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}">
      <span aria-hidden="true">${completed ? '✓' : ''}</span>
    </button>
    <button class="pl-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}">
      <span class="pl-routine-copy">
        <strong>${esc(item.title)}</strong>
        <small>${esc(sectionName || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small>
      </span>
      <span class="pl-pill ${esc(item.status)}">${esc(statusText(item))}</span>
    </button>
  </div>`;
}

export function renderTodayPlayful(data) {
  if (!data.areas.length) {
    return `<section class="pl-page pl-today-page" aria-label="Today, new user">
      <header class="pl-header"><span class="pl-chip">TODAY</span><h1>Start with one easy place.</h1><p>Add an Area first, then Nudge can surface one manageable action at a time.</p></header>
      <div class="pl-empty"><span aria-hidden="true">＋</span><h2>Your first block starts here</h2><p>No big setup session required. One useful Area is enough.</p><button class="pl-primary" data-action="demo-add-area">Create an Area</button></div>
    </section>`;
  }

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const next = queue[0] || null;

  if (!next) {
    return `<section class="pl-page pl-today-page" aria-label="Today, all clear">
      <header class="pl-header"><span class="pl-chip">TODAY</span><h1>You cleared the bright spots.</h1><p>Nothing is overdue or due today. Browse Areas whenever something would help.</p></header>
      <div class="pl-clear-card"><span aria-hidden="true">✓</span><div><strong>All caught up</strong><p>As-needed and upcoming routines are still available without creating pressure.</p></div></div>
      <button class="pl-secondary pl-wide-action" data-action="open-areas">Browse Areas</button>
    </section>`;
  }

  return `<section class="pl-page pl-today-page" aria-label="Today and Needs Attention">
    <header class="pl-header"><span class="pl-chip">TODAY</span><h1>${queue.length === 1 ? 'One small win is ready.' : `${queue.length} small wins are ready.`}</h1><p>Pick one. The rest can wait.</p></header>
    <article class="pl-today-hero ${esc(next.status)}" aria-label="${esc(`Suggested first action: ${next.title}. ${next.areaName}. About ${next.minutes} minutes.`)}">
      <div class="pl-hero-top"><span>${next.status === 'overdue' ? 'A good place to start' : 'Ready for today'}</span><b>${next.minutes} min</b></div>
      <span class="pl-card-icon" aria-hidden="true">${iconFor(next.areaId)}</span>
      <h2>${esc(next.title)}</h2>
      <p>${esc(next.areaName)} · ${esc(next.sectionName)} · ${esc(next.repeat)}</p>
      <div class="pl-hero-actions">
        <button class="pl-primary" data-action="complete-routine" data-area-id="${esc(next.areaId)}" data-chore-id="${esc(next.id)}">Mark complete</button>
        <button class="pl-secondary" data-area-id="${esc(next.areaId)}" data-section-id="${esc(next.sectionName)}" data-chore-id="${esc(next.id)}">Open details</button>
      </div>
    </article>
    ${queue.length > 1 ? `<section class="pl-block pl-today-list" aria-labelledby="pl-next-heading"><div class="pl-block-title"><h2 id="pl-next-heading">Also waiting</h2><span aria-label="${queue.length - 1} routines">${queue.length - 1}</span></div>${queue.slice(1).map(item => routineRow(item, item.areaName, item.areaId)).join('')}</section>` : ''}
  </section>`;
}

export function renderAreasPlayful(data) {
  if (!data.areas.length) {
    return `<section class="pl-page" aria-label="Areas overview, new user"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Build your little world.</h1><p>Start with one place you want to feel easier.</p></header><div class="pl-empty"><span aria-hidden="true">＋</span><h2>Add your first Area</h2><p>Home, Car, Work, Personal—anything can become a manageable block.</p><button class="pl-primary" data-action="demo-add-area">Create an Area</button></div></section>`;
  }
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="pl-page" aria-label="Areas overview"><header class="pl-header"><span class="pl-chip">AREAS</span><h1>Everything has a place.</h1><p>${attention ? `${attention} routines are asking for a little attention.` : 'Nothing urgent. Browse whenever it helps.'}</p></header><div class="pl-summary" aria-label="${esc(summary)}"><strong aria-hidden="true">${attention || '✓'}</strong><span aria-hidden="true">${attention ? 'small things to move forward' : 'all caught up'}</span></div><div class="pl-area-grid">${areaCards(data.areas)}</div><button class="pl-add" data-action="demo-add-area">＋ Add another Area</button></section>`;
}

export function renderAreaDetailPlayful(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `<section class="pl-page" aria-label="${esc(area.name)} Area detail">
    <button class="pl-back" data-action="back-areas">← All Areas</button>
    <header class="pl-detail-header"><span class="pl-card-icon" aria-hidden="true">${iconFor(area.id)}</span><div><span class="pl-chip">AREA</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></div></header>
    <section class="pl-block pl-attention" aria-labelledby="pl-attention-heading"><div class="pl-block-title"><h2 id="pl-attention-heading">Do these first</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? attention.map(item => routineRow(item, area.name, area.id)).join('') : '<p class="pl-quiet">Nothing is pressing right now.</p>'}</section>
    <section class="pl-block" aria-labelledby="pl-sections-heading"><div class="pl-block-title"><h2 id="pl-sections-heading">Sections</h2><span aria-label="${sections.length} sections">${sections.length}</span></div><div class="pl-section-grid">${sections.map(name => {
      const routines = area.routines.filter(item => (item.section || 'General') === name);
      const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;
      const state = routines.length ? `${routines.length} routines${waiting ? ` · ${waiting} waiting` : ''}` : 'Not configured yet';
      return `<button class="pl-section-card" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${state}.`)}"><span aria-hidden="true">▦</span><strong>${esc(name)}</strong><small>${state}</small></button>`;
    }).join('') || `<button class="pl-section-card" data-area-id="${esc(area.id)}" data-section-id="General" aria-label="General. Standalone routines."><span aria-hidden="true">▦</span><strong>General</strong><small>Standalone routines</small></button>`}</div></section>
    <section class="pl-block" aria-labelledby="pl-later-heading"><div class="pl-block-title"><h2 id="pl-later-heading">Later and done</h2><span aria-label="${later.length} routines">${later.length}</span></div>${later.map(item => routineRow(item, area.name, area.id)).join('') || '<p class="pl-quiet">No additional routines are waiting.</p>'}</section>
  </section>`;
}

export function renderSectionPlayful(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;
  const configured = routines.length > 0;

  return `<section class="pl-page pl-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}">
    <button class="pl-back" data-action="back-area">← ${esc(area.name)}</button>
    <header class="pl-detail-header"><span class="pl-card-icon" aria-hidden="true">▦</span><div><span class="pl-chip">SECTION</span><h1>${esc(sectionName)}</h1><p>${configured ? `${routines.length} routines · ${waiting} waiting` : 'Not configured yet'}</p></div></header>
    ${configured ? `<section class="pl-block pl-section-routines" aria-labelledby="pl-section-routines-heading"><div class="pl-block-title"><h2 id="pl-section-routines-heading">In this block</h2><span aria-label="${routines.length} routines">${routines.length}</span></div>${routines.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : `<div class="pl-empty pl-compact-empty"><span aria-hidden="true">◇</span><h2>Nothing lives here yet</h2><p>This Section can stay empty until a useful routine belongs here.</p></div>`}
  </section>`;
}

export function renderChorePlayful(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');

  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `<section class="pl-page pl-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}">
    <button class="pl-back" data-action="back-section">← ${esc(sectionName)}</button>
    <header class="pl-chore-header ${completed ? 'completed' : esc(routine.status)}">
      <span class="pl-chip">CHORE</span>
      <span class="pl-card-icon" aria-hidden="true">${completed ? '✓' : iconFor(area.id)}</span>
      <h1>${esc(routine.title)}</h1>
      <p>${esc(area.name)} · ${esc(sectionName)}</p>
    </header>
    ${completed ? `<div class="pl-completion-card"><span aria-hidden="true">★</span><div><strong>Nice—this one moved forward.</strong><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></div></div>` : `<div class="pl-chore-prompt ${esc(routine.status)}"><strong>${esc(status)}</strong><p>About ${routine.minutes} minutes. Start when it feels useful.</p></div>`}
    <dl class="pl-chore-facts">
      <div><dt>Area</dt><dd>${esc(area.name)}</dd></div>
      <div><dt>Section</dt><dd>${esc(sectionName)}</dd></div>
      <div><dt>Repeat</dt><dd>${esc(routine.repeat)}</dd></div>
      <div><dt>Tier</dt><dd>${esc(routine.tier || 'Light')}</dd></div>
      <div><dt>Time</dt><dd>About ${routine.minutes} minutes</dd></div>
      <div><dt>Status</dt><dd>${esc(status)}</dd></div>
    </dl>
    <div class="pl-chore-actions">
      ${completed
        ? `<button class="pl-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Undo completion</button>`
        : `<button class="pl-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Mark complete</button>`}
      <button class="pl-dismiss" data-action="back-section">Back to Section</button>
    </div>
  </section>`;
}

export function renderInterventionPlayful(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="pl-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="pl-orbit" aria-hidden="true"><span></span><b>↗</b></div><span class="pl-chip">A FRIENDLY PAUSE</span><h1>Want to swap screens for something small?</h1><p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Staying is okay. Switching is also okay.</p><article class="pl-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">TRY THIS</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article><div class="pl-actions"><button class="pl-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">Let’s do this</button><button class="pl-secondary" data-action="different-demo">Show another</button><button class="pl-dismiss" data-action="not-now-demo">Keep scrolling for now</button></div></section>`;
}
