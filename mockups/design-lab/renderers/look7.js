import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

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

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="bu-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}">
      <span class="bu-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <span class="bu-main"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES / ${area.sections || 0} SECTIONS</small></span>
      <span class="bu-next">${next ? esc(next.title) : 'ALL CLEAR'}</span>
      <span class="bu-state" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
      <span class="bu-arrow" aria-hidden="true">↗</span>
    </button>`;
  }).join('');
}

function routineRow(item, areaName, areaId) {
  const completed = Boolean(item.completion);
  const sectionName = item.section || 'General';
  const action = completed ? 'reopen-routine' : 'complete-routine';
  const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
  const label = `${item.title}. ${statusText(item)}. ${sectionName || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `<div class="bu-routine ${completed ? 'completed' : ''}" aria-label="${esc(label)}">
    <button class="bu-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}"><span aria-hidden="true">${completed ? '✓' : '×'}</span></button>
    <button class="bu-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}">
      <span class="bu-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(sectionName || areaName)} / ${esc(item.repeat)} / ${item.minutes} MIN</small></span>
      <b class="bu-tag ${esc(item.status)}">${esc(statusText(item))}</b>
      <span class="bu-row-arrow" aria-hidden="true">→</span>
    </button>
  </div>`;
}

export function renderTodayBold(data) {
  if (!data.areas.length) {
    return `<section class="bu-page bu-today-page" aria-label="Today, new user">
      <header class="bu-header"><span>NUDGE / TODAY</span><h1>BUILD THE<br>SYSTEM.</h1><p>Add one Area. The first useful action appears after that.</p></header>
      <button class="bu-primary bu-empty-action" data-action="demo-add-area">+ ADD FIRST AREA</button>
    </section>`;
  }

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const first = queue[0] || null;

  if (!first) {
    return `<section class="bu-page bu-today-page" aria-label="Today, all clear">
      <header class="bu-header"><span>NUDGE / TODAY</span><h1>ALL<br>CLEAR.</h1><p>No overdue or due-today routines. Upcoming work stays available without becoming urgent.</p></header>
      <div class="bu-clear-panel"><strong>00</strong><span>ACTIVE PRIORITIES</span><p>Browse Areas when you want to plan ahead.</p></div>
      <button class="bu-secondary bu-wide-action" data-action="open-areas">OPEN AREAS</button>
    </section>`;
  }

  return `<section class="bu-page bu-today-page" aria-label="Today and Needs Attention">
    <header class="bu-header bu-header-grid"><div><span>NUDGE / TODAY</span><h1>ACT ON<br>ONE THING.</h1><p>The queue is visible. Only the first action needs a decision now.</p></div><div class="bu-counter" aria-label="${queue.length} routines need attention"><strong aria-hidden="true">${String(queue.length).padStart(2, '0')}</strong><span aria-hidden="true">IN QUEUE</span></div></header>
    <article class="bu-today-hero ${esc(first.status)}" aria-label="${esc(`Priority action: ${first.title}. ${first.areaName}. About ${first.minutes} minutes.`)}">
      <div class="bu-hero-band"><span>${first.status === 'overdue' ? 'PRIORITY / OVERDUE' : 'PRIORITY / TODAY'}</span><b>${first.minutes} MIN</b></div>
      <h2>${esc(first.title)}</h2>
      <p>${esc(first.areaName)} / ${esc(first.sectionName)} / ${esc(first.repeat)}</p>
      <div class="bu-hero-actions">
        <button class="bu-primary" data-action="complete-routine" data-area-id="${esc(first.areaId)}" data-chore-id="${esc(first.id)}">MARK COMPLETE</button>
        <button class="bu-secondary" data-area-id="${esc(first.areaId)}" data-section-id="${esc(first.sectionName)}" data-chore-id="${esc(first.id)}">OPEN DETAIL</button>
      </div>
    </article>
    ${queue.length > 1 ? `<section class="bu-block bu-today-list" aria-labelledby="bu-queue-heading"><div class="bu-block-title"><h2 id="bu-queue-heading">QUEUE</h2><span aria-label="${queue.length - 1} additional routines">${String(queue.length - 1).padStart(2, '0')}</span></div>${queue.slice(1).map(item => routineRow(item, item.areaName, item.areaId)).join('')}</section>` : ''}
  </section>`;
}

export function renderAreasBold(data) {
  if (!data.areas.length) return `<section class="bu-page" aria-label="Areas overview, new user"><header class="bu-header"><span>NUDGE / AREAS</span><h1>NO AREAS<br>YET.</h1><p>Start with one place you actually maintain. The system can grow later.</p></header><button class="bu-primary bu-empty-action" data-action="demo-add-area">+ ADD FIRST AREA</button></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="bu-page" aria-label="Areas overview"><header class="bu-header bu-header-grid"><div><span>NUDGE / AREAS</span><h1>HOUSEHOLD<br>CONTROL.</h1><p>Clear structure. Every Area visible. Choose what matters now.</p></div><div class="bu-counter" aria-label="${esc(summary)}"><strong aria-hidden="true">${String(attention).padStart(2, '0')}</strong><span aria-hidden="true">${attention ? 'NEED ATTENTION' : 'ALL CURRENT'}</span></div></header><div class="bu-table-head" aria-hidden="true"><span>#</span><span>AREA</span><span>NEXT</span><span>STATE</span><span></span></div><div class="bu-list">${areaRows(data.areas)}</div><button class="bu-add" data-action="demo-add-area">+ ADD AREA</button></section>`;
}

export function renderAreaDetailBold(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => !item.completion && ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="bu-page" aria-label="${esc(area.name)} Area detail">
    <button class="bu-back" data-action="back-areas">← AREAS</button>
    <header class="bu-detail"><div><span>AREA / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1></div><div aria-label="${attention.length} routines need attention"><strong aria-hidden="true">${String(attention.length).padStart(2, '0')}</strong><small aria-hidden="true">ATTENTION</small></div></header>
    <section class="bu-block" aria-labelledby="bu-now-heading"><div class="bu-block-title"><h2 id="bu-now-heading">NOW</h2><span aria-label="${attention.length} routines">${String(attention.length).padStart(2, '0')}</span></div>${attention.length ? attention.map(item => routineRow(item, area.name, area.id)).join('') : '<p class="bu-quiet">NO DUE ITEMS.</p>'}</section>
    <section class="bu-block" aria-labelledby="bu-sections-heading"><div class="bu-block-title"><h2 id="bu-sections-heading">SECTIONS</h2><span aria-label="${sections.length} sections">${String(sections.length).padStart(2, '0')}</span></div>${sections.map(name => {
      const routines = area.routines.filter(item => (item.section || 'General') === name);
      const waiting = routines.filter(item => !item.completion && ['overdue', 'today'].includes(item.status)).length;
      const state = routines.length ? `${routines.length} routines${waiting ? ` / ${waiting} waiting` : ''}` : 'Not configured';
      return `<button class="bu-section" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${state}.`)}"><span><strong>${esc(name)}</strong><small>${esc(state)}</small></span><span aria-hidden="true">${String(routines.length).padStart(2, '0')} →</span></button>`;
    }).join('') || `<button class="bu-section" data-area-id="${esc(area.id)}" data-section-id="General" aria-label="General. Standalone routines."><span><strong>GENERAL</strong><small>Standalone routines</small></span><span aria-hidden="true">→</span></button>`}</section>
    <section class="bu-block" aria-labelledby="bu-later-heading"><div class="bu-block-title"><h2 id="bu-later-heading">LATER / DONE</h2><span aria-label="${later.length} routines">${String(later.length).padStart(2, '0')}</span></div>${later.map(item => routineRow(item, area.name, area.id)).join('') || '<p class="bu-quiet">NO LATER ITEMS.</p>'}</section>
  </section>`;
}

export function renderSectionBold(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && ['overdue', 'today'].includes(item.status)).length;

  return `<section class="bu-page bu-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}">
    <button class="bu-back" data-action="back-area">← ${esc(area.name).toUpperCase()}</button>
    <header class="bu-detail"><div><span>SECTION / ${esc(area.id).toUpperCase()}</span><h1>${esc(sectionName)}</h1></div><div aria-label="${waiting} routines need attention"><strong aria-hidden="true">${String(waiting).padStart(2, '0')}</strong><small aria-hidden="true">WAITING</small></div></header>
    ${routines.length ? `<section class="bu-block" aria-labelledby="bu-section-routines-heading"><div class="bu-block-title"><h2 id="bu-section-routines-heading">ROUTINES</h2><span aria-label="${routines.length} routines">${String(routines.length).padStart(2, '0')}</span></div>${routines.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : `<div class="bu-empty-panel"><strong>00</strong><h2>NOT CONFIGURED.</h2><p>This Section can remain empty until a useful routine belongs here.</p></div>`}
  </section>`;
}

export function renderChoreBold(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');

  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `<section class="bu-page bu-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}">
    <button class="bu-back" data-action="back-section">← ${esc(sectionName).toUpperCase()}</button>
    <header class="bu-chore-header ${completed ? 'completed' : esc(routine.status)}"><span>CHORE / ${esc(area.id).toUpperCase()}</span><h1>${esc(routine.title)}</h1><p>${esc(area.name)} / ${esc(sectionName)}</p></header>
    ${completed
      ? `<div class="bu-completion-panel"><strong>DONE.</strong><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></div>`
      : `<div class="bu-status-panel ${esc(routine.status)}"><strong>${esc(status).toUpperCase()}</strong><span>EST. ${routine.minutes} MIN</span></div>`}
    <dl class="bu-facts">
      <div><dt>AREA</dt><dd>${esc(area.name)}</dd></div>
      <div><dt>SECTION</dt><dd>${esc(sectionName)}</dd></div>
      <div><dt>REPEAT</dt><dd>${esc(routine.repeat)}</dd></div>
      <div><dt>TIER</dt><dd>${esc(routine.tier || 'Light')}</dd></div>
      <div><dt>TIME</dt><dd>${routine.minutes} MIN</dd></div>
      <div><dt>STATUS</dt><dd>${esc(status)}</dd></div>
    </dl>
    <div class="bu-chore-actions">
      ${completed
        ? `<button class="bu-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">UNDO COMPLETION</button>`
        : `<button class="bu-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">MARK COMPLETE</button>`}
      <button class="bu-dismiss" data-action="back-section">BACK TO SECTION</button>
    </div>
  </section>`;
}

export function renderInterventionBold(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="bu-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="bu-marquee" aria-hidden="true">NUDGE / OPTIONAL CONTEXT SWITCH / ${item.minutes} MIN / ${esc(item.app).toUpperCase()}</div><div class="bu-intervention-body"><span class="bu-stop" aria-hidden="true">■</span><h1>PAUSE.<br>DECIDE.</h1><p>You can stay in ${esc(item.app)}, or redirect the next ${item.duration} minutes. Either choice is valid.</p><article aria-label="${esc(suggestion)}"><span aria-hidden="true">SUGGESTED ACTION</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} / ${item.duration} MIN</p></article></div><div class="bu-actions"><button class="bu-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">START THIS ACTION</button><button class="bu-secondary" data-action="different-demo">CHOOSE ANOTHER</button><button class="bu-dismiss" data-action="not-now-demo">STAY HERE</button></div></section>`;
}
