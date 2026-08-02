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

function areaRows(areas) {
  return areas.map((area, index) => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const meterLevel = `${Math.min(4, attentionCount(area)) * 25}%`;
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="rd-area ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}"><span class="rd-slot" aria-hidden="true">A${index + 1}</span><span class="rd-copy" aria-hidden="true"><strong>${esc(area.name)}</strong><small>${area.routines.length} ROUTINES · ${area.sections || 0} SECTIONS</small><em>${next ? esc(next.title) : 'ALL ROUTINES CURRENT'}</em></span><span class="rd-meter" aria-hidden="true"><i style="--level:${meterLevel}"></i><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span></button>`;
  }).join('');
}

function routineRows(items, areaName, fallbackAreaId) {
  return items.map((item, index) => {
    const completed = Boolean(item.completion);
    const status = statusText(item);
    const sectionName = item.section || item.sectionName || 'General';
    const areaId = item.areaId || fallbackAreaId;
    const action = completed ? 'reopen-routine' : 'complete-routine';
    const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
    return `<div class="rd-routine ${completed ? 'completed' : ''}"><span class="rd-line" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><button class="rd-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}"><span aria-hidden="true">${completed ? '[✓]' : '[ ]'}</span></button><button class="rd-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}"><span class="rd-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(sectionName || areaName)} // ${esc(item.repeat)} // ${item.minutes} MIN</small></span><b class="rd-tag ${esc(item.status)}">${esc(status).toUpperCase()}</b></button></div>`;
  }).join('');
}

export function renderTodayRetro(data) {
  if (!data.areas.length) return `<section class="rd-page rd-today-page" aria-label="Today, new user"><header class="rd-header"><span>NUDGE OS / TODAY</span><h1>READY TO BEGIN</h1><p>Create one Area. The next manageable routine will appear here.</p></header><div class="rd-empty"><div aria-hidden="true">[ + ]</div><h2>NO AREA DATA YET</h2><p>One useful place is enough to initialize the system.</p><button class="rd-primary" data-action="demo-add-area">INITIALIZE AREA</button></div></section>`;

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && ['overdue', 'today'].includes(item.status))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const focus = queue[0] || null;

  if (!focus) return `<section class="rd-page rd-today-page" aria-label="Today, all clear"><header class="rd-header rd-header-grid"><div><span>NUDGE OS / TODAY</span><h1>QUEUE CLEAR</h1><p>No routines are overdue or due today.</p></div><div class="rd-display" aria-label="System clear"><small aria-hidden="true">STATUS</small><strong aria-hidden="true">OK</strong><em aria-hidden="true">NO ACTION REQUIRED</em></div></header><div class="rd-clear"><span aria-hidden="true">[✓]</span><div><strong>IMPORTANT ROUTINES CURRENT</strong><p>Upcoming and as-needed routines remain available in Areas.</p></div></div><button class="rd-secondary rd-wide-action" data-action="open-areas">OPEN AREA DIRECTORY</button></section>`;

  return `<section class="rd-page rd-today-page" aria-label="Today and Needs Attention"><header class="rd-header rd-header-grid"><div><span>NUDGE OS / TODAY</span><h1>ACTION QUEUE</h1><p>One useful routine is selected. Other entries remain available without alarm.</p></div><div class="rd-display" aria-label="${queue.length} routines need attention"><small aria-hidden="true">READY</small><strong aria-hidden="true">${String(queue.length).padStart(2, '0')}</strong><em aria-hidden="true">OPTIONAL ACTIONS</em></div></header><article class="rd-priority ${esc(focus.status)}" aria-label="${esc(`Priority routine: ${focus.title}. ${focus.areaName}. About ${focus.minutes} minutes.`)}"><div class="rd-priority-head"><span>SELECTED ROUTINE</span><b>${focus.status === 'overdue' ? 'OVERDUE' : 'DUE TODAY'}</b></div><h2>${esc(focus.title)}</h2><p>${esc(focus.areaName)} // ${esc(focus.sectionName)} // ${focus.minutes} MIN</p><div class="rd-priority-actions"><button class="rd-primary" data-action="complete-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">COMPLETE ROUTINE</button><button class="rd-secondary" data-area-id="${esc(focus.areaId)}" data-section-id="${esc(focus.sectionName)}" data-chore-id="${esc(focus.id)}">OPEN DETAILS</button></div></article>${queue.length > 1 ? `<section class="rd-block rd-today-queue"><div class="rd-block-title"><h2>ADDITIONAL QUEUE</h2><span>${queue.length - 1}</span></div>${routineRows(queue.slice(1), 'Today', focus.areaId)}</section>` : ''}</section>`;
}

export function renderAreasRetro(data) {
  if (!data.areas.length) return `<section class="rd-page" aria-label="Areas overview, new user"><header class="rd-header"><span>NUDGE OS / AREAS</span><h1>READY TO BEGIN</h1><p>Initialize one place to begin routine tracking.</p></header><div class="rd-empty"><div aria-hidden="true">[ + ]</div><h2>CREATE FIRST AREA</h2><button class="rd-primary" data-action="demo-add-area">INITIALIZE AREA</button></div></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const summary = attention ? `${attention} routines need attention.` : 'All important routines are current.';
  return `<section class="rd-page" aria-label="Areas overview"><header class="rd-header rd-header-grid"><div><span>NUDGE OS / AREAS</span><h1>HOME SYSTEM</h1><p>Routine map online.</p></div><div class="rd-display" aria-label="${esc(summary)}"><small aria-hidden="true">ATTENTION</small><strong aria-hidden="true">${String(attention).padStart(2, '0')}</strong><em aria-hidden="true">${attention ? 'ACTION READY' : 'SYSTEM CLEAR'}</em></div></header><div class="rd-command">SELECT AREA // ${data.areas.length} AVAILABLE</div><div class="rd-list">${areaRows(data.areas)}</div><button class="rd-add" data-action="demo-add-area">[ + ADD AREA ]</button></section>`;
}

export function renderAreaDetailRetro(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => !item.completion && ['overdue', 'today'].includes(item.status));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  const focus = priorityRoutine([{ ...area, routines: area.routines }]);
  return `<section class="rd-page" aria-label="${esc(area.name)} Area detail"><button class="rd-back" data-action="back-areas">&lt; AREAS</button><header class="rd-detail"><span>AREA NODE / ${esc(area.id).toUpperCase()}</span><h1>${esc(area.name)}</h1><p>${area.routines.length} ROUTINES // ${sections.length} SECTIONS</p></header>${focus ? `<article class="rd-priority rd-area-priority ${esc(focus.status)}"><div class="rd-priority-head"><span>NEXT ROUTINE</span><b>${esc(statusText(focus)).toUpperCase()}</b></div><h2>${esc(focus.title)}</h2><p>${esc(focus.sectionName)} // ${esc(focus.repeat)} // ${focus.minutes} MIN</p><div class="rd-priority-actions"><button class="rd-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(focus.id)}">COMPLETE ROUTINE</button><button class="rd-secondary" data-area-id="${esc(area.id)}" data-section-id="${esc(focus.sectionName)}" data-chore-id="${esc(focus.id)}">OPEN DETAILS</button></div></article>` : ''}<section class="rd-block" aria-labelledby="rd-now-heading"><div class="rd-block-title"><h2 id="rd-now-heading">QUEUE: NOW</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? routineRows(attention.filter(item => item.id !== focus?.id), area.name, area.id) || '<p class="rd-quiet">SELECTED ROUTINE SHOWN ABOVE</p>' : '<p class="rd-quiet">NO ACTIVE REMINDERS</p>'}</section><section class="rd-block" aria-labelledby="rd-sections-heading"><div class="rd-block-title"><h2 id="rd-sections-heading">SECTION DIRECTORY</h2><span aria-label="${sections.length} sections">${sections.length}</span></div>${sections.map((name, index) => { const count = area.routines.filter(item => (item.section || 'General') === name).length; const waiting = area.routines.filter(item => (item.section || 'General') === name && !item.completion && ['overdue', 'today'].includes(item.status)).length; const state = count ? `${count} routines${waiting ? ` // ${waiting} ready` : ''}` : 'Not configured'; return `<button class="rd-section" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(name)}. ${esc(state)}."><span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><strong>${esc(name)}</strong><small>${state.toUpperCase()}</small><b aria-hidden="true">&gt;</b></button>`; }).join('')}</section><section class="rd-block" aria-labelledby="rd-later-heading"><div class="rd-block-title"><h2 id="rd-later-heading">QUEUE: LATER / DONE</h2><span aria-label="${later.length} routines">${later.length}</span></div>${routineRows(later.filter(item => item.id !== focus?.id), area.name, area.id) || '<p class="rd-quiet">QUEUE EMPTY</p>'}</section></section>`;
}

export function renderSectionRetro(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && ['overdue', 'today'].includes(item.status)).length;
  return `<section class="rd-page rd-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}"><button class="rd-back" data-action="back-area">&lt; ${esc(area.name).toUpperCase()}</button><header class="rd-detail"><span>SECTION NODE</span><h1>${esc(sectionName)}</h1><p>${routines.length} ROUTINES // ${waiting} READY NOW</p></header><section class="rd-block"><div class="rd-block-title"><h2>ROUTINE DIRECTORY</h2><span>${routines.length}</span></div>${routines.length ? routineRows(routines, area.name, area.id) : '<p class="rd-quiet">NO ROUTINES CONFIGURED. THIS SECTION CAN REMAIN EMPTY.</p>'}</section></section>`;
}

export function renderChoreRetro(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');
  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `<section class="rd-page rd-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}"><button class="rd-back" data-action="back-section">&lt; ${esc(sectionName).toUpperCase()}</button><article class="rd-chore-card ${completed ? 'completed' : esc(routine.status)}"><div class="rd-priority-head"><span>ROUTINE RECORD</span><b>${completed ? 'COMPLETED' : 'AVAILABLE'}</b></div><span class="rd-record-id">ID // ${esc(routine.id).toUpperCase()}</span><h1>${esc(routine.title)}</h1><p>${esc(area.name)} // ${esc(sectionName)}</p><strong class="rd-record-status">${esc(status).toUpperCase()}</strong></article>${completed ? `<section class="rd-completion-log"><span aria-hidden="true">[✓]</span><div><strong>COMPLETION SAVED</strong><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></div></section>` : `<section class="rd-system-note"><strong>ROUTINE READY</strong><p>This is an optional next action. Estimated time: ${routine.minutes} minutes.</p></section>`}<dl class="rd-chore-facts"><div><dt>AREA</dt><dd>${esc(area.name)}</dd></div><div><dt>SECTION</dt><dd>${esc(sectionName)}</dd></div><div><dt>RHYTHM</dt><dd>${esc(routine.repeat)}</dd></div><div><dt>TIER</dt><dd>${esc(routine.tier || 'Light')}</dd></div><div><dt>TIME</dt><dd>${routine.minutes} MIN</dd></div><div><dt>STATUS</dt><dd>${esc(status)}</dd></div></dl><div class="rd-chore-actions">${completed ? `<button class="rd-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">UNDO COMPLETION</button>` : `<button class="rd-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">COMPLETE ROUTINE</button>`}</div></section>`;
}

export function renderInterventionRetro(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="rd-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="rd-scan" aria-hidden="true"></div><div class="rd-alert" aria-label="Current session: ${item.minutes} minutes in ${esc(item.app)}"><span aria-hidden="true">CONTEXT TIMER</span><strong aria-hidden="true">${String(item.minutes).padStart(2, '0')}:00</strong><small aria-hidden="true">${esc(item.app).toUpperCase()}</small></div><h1>SWITCH MODE?</h1><p>YOUR CURRENT SESSION CAN CONTINUE. A SMALL ALTERNATIVE IS AVAILABLE.</p><article class="rd-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">OPTIONAL TASK</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} // ${item.duration} MIN</p></article><div class="rd-actions"><button class="rd-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">START TASK</button><button class="rd-secondary" data-action="different-demo">SHOW ALTERNATE</button><button class="rd-dismiss" data-action="not-now-demo">STAY HERE</button></div></section>`;
}
