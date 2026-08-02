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
  return item.completion ? 'Completed just now' : dueLabel(item.status);
}

function priorityRoutine(areas) {
  return allRoutines(areas)
    .filter(item => !item.completion)
    .sort((a, b) => priority[a.status] - priority[b.status])[0] || null;
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
    const accessible = `${area.name}. ${status.label}. ${area.routines.length} routines${area.sections ? ` and ${area.sections} sections` : ''}. ${next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.'}`;
    return `
      <button class="th-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(accessible)}">
        <span class="th-card-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <span class="th-area-copy">
          <strong>${esc(area.name)}</strong>
          <small>${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ' · standalone'}</small>
        </span>
        <span class="th-area-next">
          <small>Next on card</small>
          <strong>${next ? esc(next.title) : 'Everything here is clear'}</strong>
        </span>
        <span class="th-stamp ${status.className || 'clear'}">${esc(status.phrase)}</span>
        <span class="th-card-handle" aria-hidden="true">›</span>
      </button>`;
  }).join('');
}

function routineRow(item, areaName, areaId) {
  const completed = Boolean(item.completion);
  const sectionName = item.section || 'General';
  const action = completed ? 'reopen-routine' : 'complete-routine';
  const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
  const fullLabel = `${item.title}. ${statusText(item)}. ${sectionName || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `
    <div class="th-routine-row ${esc(item.status)} ${completed ? 'completed' : ''}" aria-label="${esc(fullLabel)}">
      <button class="th-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}"><span aria-hidden="true">${completed ? '✓' : ''}</span></button>
      <button class="th-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}">
        <span class="th-routine-copy">
          <strong>${esc(item.title)}</strong>
          <small>${esc(sectionName || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small>
        </span>
        <span class="th-status-tag ${esc(item.status)}">${esc(statusText(item))}</span>
      </button>
    </div>`;
}

export function renderTodayTactile(data) {
  if (!data.areas.length) {
    return `
      <section class="th-page th-empty-page" aria-label="Today, new user">
        <header class="th-header"><span class="th-label">TODAY'S WORK BOARD</span><h1>Set up one useful station.</h1><p>Add an Area card first. Nudge will file the next manageable job here.</p></header>
        <div class="th-empty-card"><span class="th-paperclip" aria-hidden="true"></span><strong>No work cards yet</strong><p>One useful Area is enough to begin.</p><button class="th-primary" data-action="demo-add-area">Create first Area card</button></div>
      </section>`;
  }

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const focus = queue[0] || null;

  if (!focus) {
    return `
      <section class="th-page th-today-page" aria-label="Today, all clear">
        <header class="th-header"><span class="th-label">TODAY'S WORK BOARD</span><h1>Board is in good order.</h1><p>No jobs are overdue or due today.</p></header>
        <article class="th-clear-ticket"><span class="th-stamp clear">Inspection passed</span><h2>Nothing requires service now</h2><p>Upcoming and as-needed cards remain filed in Areas without creating pressure.</p></article>
        <button class="th-secondary th-wide-action" data-action="open-areas">Open maintenance board</button>
      </section>`;
  }

  return `
    <section class="th-page th-today-page" aria-label="Today and Needs Attention">
      <header class="th-header"><span class="th-label">TODAY'S WORK BOARD</span><h1>${queue.length === 1 ? 'One job is on the bench.' : `${queue.length} jobs are on the bench.`}</h1><p>Start with the top card. The rest stay filed until you are ready.</p></header>
      <article class="th-work-order ${esc(focus.status)}" aria-label="${esc(`Priority job: ${focus.title}. ${focus.areaName}. About ${focus.minutes} minutes.`)}">
        <div class="th-work-order-head"><span>WORK ORDER 01</span><b>${focus.status === 'overdue' ? 'OVERDUE' : 'DUE TODAY'}</b></div>
        <span class="th-tab">NEXT USEFUL JOB</span>
        <h2>${esc(focus.title)}</h2>
        <p>${esc(focus.areaName)} · ${esc(focus.sectionName)} · about ${focus.minutes} minutes</p>
        <div class="th-work-order-actions">
          <button class="th-primary" data-action="complete-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">Mark job complete</button>
          <button class="th-secondary" data-area-id="${esc(focus.areaId)}" data-section-id="${esc(focus.sectionName)}" data-chore-id="${esc(focus.id)}">Open job card</button>
        </div>
      </article>
      ${queue.length > 1 ? `<section class="th-block th-today-queue"><div class="th-block-label"><span>WAITING CARDS</span><b>${queue.length - 1}</b></div>${queue.slice(1).map(item => routineRow(item, item.areaName, item.areaId)).join('')}</section>` : ''}
    </section>`;
}

export function renderAreasTactile(data) {
  if (!data.areas.length) {
    return `
      <section class="th-page th-empty-page" aria-label="Areas overview, new user">
        <header class="th-header"><span class="th-label">NUDGE MAINTENANCE BOARD</span><h1>Set up one useful station.</h1><p>Add Home, Car, Work, Personal, or any Area you want to keep in order.</p></header>
        <div class="th-empty-card"><span class="th-paperclip" aria-hidden="true"></span><strong>No Area cards yet</strong><p>Start with the place that would make daily life easier.</p><button class="th-primary" data-action="demo-add-area">Create first Area card</button></div>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const focus = priorityRoutine(data.areas);
  return `
    <section class="th-page" aria-label="Areas overview">
      <header class="th-header"><span class="th-label">NUDGE MAINTENANCE BOARD</span><h1>Your Area cards</h1><p>Recurring care, filed where it belongs.</p></header>
      <section class="th-summary-board" aria-label="${attention ? `${attention} routines need attention across ${affected} areas.` : 'All important routines are current.'}">
        <div><span>FLAGGED</span><strong>${String(attention).padStart(2, '0')}</strong></div>
        <div><span>AREAS</span><strong>${String(data.areas.length).padStart(2, '0')}</strong></div>
        <p>${attention ? `${affected} ${affected === 1 ? 'Area has' : 'Areas have'} something ready for attention.` : 'Everything important is in good order.'}</p>
      </section>
      ${focus ? `<article class="th-next-card ${esc(focus.status)}"><span class="th-tab">NEXT USEFUL JOB</span><h2>${esc(focus.title)}</h2><p>${esc(focus.areaName)} · about ${focus.minutes} minutes</p><button data-area-id="${esc(focus.areaId)}">Open Area card</button></article>` : ''}
      <section class="th-card-stack" aria-label="All Area cards">${areaCards(data.areas)}</section>
      <button class="th-add" data-action="demo-add-area">+ Add Area card</button>
    </section>`;
}

export function renderAreaDetailTactile(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'));
  const later = area.routines.filter(item => !attention.includes(item));
  const focus = attention[0] || later.find(item => !item.completion) || null;
  const remainingAttention = focus ? attention.filter(item => item !== focus) : attention;
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);

  return `
    <section class="th-page th-detail-page" aria-label="${esc(area.name)} Area detail">
      <button class="th-back" data-action="back-areas">← Maintenance board</button>
      <header class="th-detail-header"><span class="th-label">AREA SERVICE CARD</span><div class="th-title-plate"><h1>${esc(area.name)}</h1><div><span>${String(area.routines.length).padStart(2, '0')} routines</span><span>${String(sections.length).padStart(2, '0')} sections</span></div></div></header>
      ${focus ? `<article class="th-job-card ${esc(focus.status)}"><span class="th-tab">${attention.length ? 'ON THE BENCH' : 'READY WHEN NEEDED'}</span><h2>${esc(focus.title)}</h2><p>${esc(focus.section || area.name)} · ${esc(focus.repeat)} · about ${focus.minutes} minutes</p><div class="th-job-actions"><button class="th-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(focus.id)}">Mark job complete</button><button class="th-secondary" data-area-id="${esc(area.id)}" data-section-id="${esc(focus.section || 'General')}" data-chore-id="${esc(focus.id)}">Open job card</button></div></article>` : ''}
      ${remainingAttention.length ? `<section class="th-block"><div class="th-block-label"><span>FLAGGED JOBS</span><b>${remainingAttention.length}</b></div>${remainingAttention.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : ''}
      <section class="th-block"><div class="th-block-label"><span>SECTION DRAWERS</span><b>${sections.length}</b></div>${sections.map(name => {
        const routines = area.routines.filter(item => (item.section || 'General') === name);
        const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;
        const state = routines.length ? `${routines.length} routines${waiting ? ` · ${waiting} flagged` : ''}` : 'Not configured yet';
        return `<button class="th-section-row" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${state}.`)}"><span class="th-drawer-pull" aria-hidden="true"></span><span><strong>${esc(name)}</strong><small>${state}</small></span><span aria-hidden="true">›</span></button>`;
      }).join('') || `<button class="th-section-row" data-area-id="${esc(area.id)}" data-section-id="General"><span class="th-drawer-pull" aria-hidden="true"></span><span><strong>General</strong><small>Standalone routines</small></span><span aria-hidden="true">›</span></button>`}</section>
      <section class="th-block"><div class="th-block-label"><span>LATER / COMPLETED</span><b>${later.filter(item => item !== focus).length}</b></div>${later.filter(item => item !== focus).map(item => routineRow(item, area.name, area.id)).join('') || '<p class="th-quiet">No additional jobs are filed here.</p>'}</section>
    </section>`;
}

export function renderSectionTactile(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;

  return `
    <section class="th-page th-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}">
      <button class="th-back" data-action="back-area">← ${esc(area.name)} service card</button>
      <header class="th-detail-header"><span class="th-label">SECTION DRAWER</span><div class="th-title-plate"><h1>${esc(sectionName)}</h1><div><span>${String(routines.length).padStart(2, '0')} routines</span><span>${String(waiting).padStart(2, '0')} flagged</span></div></div></header>
      ${routines.length ? `<section class="th-block th-section-jobs"><div class="th-block-label"><span>FILED JOB CARDS</span><b>${routines.length}</b></div>${routines.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : `<div class="th-empty-card th-compact-empty"><span class="th-drawer-pull" aria-hidden="true"></span><strong>Drawer is empty</strong><p>This Section can stay unconfigured until a useful job belongs here.</p></div>`}
    </section>`;
}

export function renderChoreTactile(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');

  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `
    <section class="th-page th-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}">
      <button class="th-back" data-action="back-section">← ${esc(sectionName)} drawer</button>
      <article class="th-service-ticket ${completed ? 'completed' : esc(routine.status)}">
        <div class="th-service-ticket-head"><span>JOB CARD</span><b>${completed ? 'CLOSED' : 'OPEN'}</b></div>
        <span class="th-tab">${completed ? 'SERVICE COMPLETE' : 'ROUTINE SERVICE'}</span>
        <h1>${esc(routine.title)}</h1>
        <p>${esc(area.name)} · ${esc(sectionName)}</p>
        <span class="th-stamp ${completed ? 'clear' : routine.status === 'today' ? 'due' : esc(routine.status)}">${esc(status)}</span>
      </article>
      ${completed ? `<section class="th-completion-slip"><span aria-hidden="true">✓</span><div><strong>Job card closed</strong><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></div></section>` : `<section class="th-job-note"><strong>${esc(status)}</strong><p>Estimated bench time: about ${routine.minutes} minutes.</p></section>`}
      <dl class="th-chore-facts">
        <div><dt>Area card</dt><dd>${esc(area.name)}</dd></div>
        <div><dt>Drawer</dt><dd>${esc(sectionName)}</dd></div>
        <div><dt>Service interval</dt><dd>${esc(routine.repeat)}</dd></div>
        <div><dt>Care tier</dt><dd>${esc(routine.tier || 'Light')}</dd></div>
        <div><dt>Bench time</dt><dd>About ${routine.minutes} minutes</dd></div>
        <div><dt>Job status</dt><dd>${esc(status)}</dd></div>
      </dl>
      <div class="th-chore-actions">
        ${completed
          ? `<button class="th-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Reopen job card</button>`
          : `<button class="th-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Mark job complete</button>`}
      </div>
    </section>`;
}

export function renderInterventionTactile(data) {
  const item = data.intervention;
  return `
    <section class="th-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}">
      <div class="th-timer-panel" aria-label="${item.minutes} minutes spent in ${esc(item.app)}"><span class="th-panel-label">CURRENT SESSION</span><strong>${String(item.minutes).padStart(2, '0')}</strong><small>MIN · ${esc(item.app).toUpperCase()}</small><span class="th-panel-light" aria-hidden="true"></span></div>
      <div class="th-intervention-copy"><span class="th-label">A PRACTICAL PAUSE</span><h1>Want to switch tasks for a moment?</h1><p>You can stay where you are. Nudge is only offering one small job that may feel good to finish.</p></div>
      <article class="th-ticket" aria-label="${esc(`Suggested job: ${item.task}. ${item.location}. About ${item.duration} minutes.`)}"><span class="th-ticket-hole" aria-hidden="true"></span><span class="th-tab">SUGGESTED JOB</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article>
      <div class="th-actions"><button class="th-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">Start this job</button><button class="th-secondary" data-action="different-demo">Pull another card</button><button class="th-dismiss" data-action="not-now-demo">Not now</button></div>
    </section>`;
}
