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

function areaCards(areas) {
  return areas.map(area => {
    const status = statusFor(area);
    const next = nextRoutine(area);
    const structure = area.sections ? `${area.sections} sections` : 'standalone Area';
    const nextLabel = next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.';
    const label = `${area.name}. ${status.label}. ${area.routines.length} routines, ${structure}. ${nextLabel}`;
    return `<button class="ag-area-card ${status.className}" data-area-id="${esc(area.id)}" aria-label="${esc(label)}">
      <span class="ag-glow" aria-hidden="true"></span>
      <span class="ag-copy"><strong>${esc(area.name)}</strong><small>${area.routines.length} routines · ${area.sections || 'standalone'}${area.sections ? ' sections' : ''}</small><em>${next ? esc(next.title) : 'Everything here is clear'}</em></span>
      <span class="ag-status" aria-hidden="true"><b>${esc(status.count)}</b><small>${esc(status.label)}</small></span>
    </button>`;
  }).join('');
}

function routineRow(item, areaName, areaId) {
  const completed = Boolean(item.completion);
  const sectionName = item.section || 'General';
  const action = completed ? 'reopen-routine' : 'complete-routine';
  const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
  const label = `${item.title}. ${statusText(item)}. ${sectionName || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `<div class="ag-routine ${completed ? 'completed' : ''}" aria-label="${esc(label)}">
    <button class="ag-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}"><span aria-hidden="true">${completed ? '✓' : ''}</span></button>
    <button class="ag-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}">
      <span class="ag-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(sectionName || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
      <em class="${esc(item.status)}">${esc(statusText(item))}</em>
    </button>
  </div>`;
}

export function renderTodayAmbient(data) {
  if (!data.areas.length) {
    return `<section class="ag-page ag-today-page" aria-label="Today, new user"><div class="ag-aurora" aria-hidden="true"></div>
      <header class="ag-header"><span>TODAY</span><h1>Begin with one calm corner.</h1><p>Add an Area first. Nudge will surface one manageable routine here.</p></header>
      <div class="ag-empty"><div aria-hidden="true">＋</div><h2>Create your first Area</h2><p>One useful place is enough to begin.</p><button class="ag-primary" data-action="demo-add-area">Add an Area</button></div>
    </section>`;
  }

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const focus = queue[0] || null;

  if (!focus) {
    return `<section class="ag-page ag-today-page" aria-label="Today, all clear"><div class="ag-aurora" aria-hidden="true"></div>
      <header class="ag-header"><span>TODAY</span><h1>The surface is clear.</h1><p>No routines are overdue or due today.</p></header>
      <article class="ag-clear-panel"><span aria-hidden="true">✓</span><div><strong>Nothing urgent right now</strong><p>Upcoming and as-needed routines remain available in Areas without creating pressure.</p></div></article>
      <button class="ag-secondary ag-wide-action" data-action="open-areas">Browse Areas</button>
    </section>`;
  }

  return `<section class="ag-page ag-today-page" aria-label="Today and Needs Attention"><div class="ag-aurora" aria-hidden="true"></div>
    <header class="ag-header"><span>TODAY</span><h1>${queue.length === 1 ? 'One gentle next step.' : `${queue.length} gentle next steps.`}</h1><p>Choose one. The rest can stay softly in view.</p></header>
    <article class="ag-focus-card ${esc(focus.status)}" aria-label="${esc(`Suggested first action: ${focus.title}. ${focus.areaName}. About ${focus.minutes} minutes.`)}">
      <span class="ag-focus-orb" aria-hidden="true"></span>
      <div class="ag-focus-meta"><span>${focus.status === 'overdue' ? 'A useful place to begin' : 'Ready for today'}</span><b>${focus.minutes} min</b></div>
      <h2>${esc(focus.title)}</h2><p>${esc(focus.areaName)} · ${esc(focus.sectionName)} · ${esc(focus.repeat)}</p>
      <div class="ag-focus-actions"><button class="ag-primary" data-action="complete-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">Mark complete</button><button class="ag-secondary" data-area-id="${esc(focus.areaId)}" data-section-id="${esc(focus.sectionName)}" data-chore-id="${esc(focus.id)}">Open details</button></div>
    </article>
    ${queue.length > 1 ? `<section class="ag-panel ag-today-queue" aria-labelledby="ag-waiting-heading"><div class="ag-panel-title"><h2 id="ag-waiting-heading">Also waiting</h2><span aria-label="${queue.length - 1} routines">${queue.length - 1}</span></div>${queue.slice(1).map(item => routineRow(item, item.areaName, item.areaId)).join('')}</section>` : ''}
  </section>`;
}

export function renderAreasAmbient(data) {
  if (!data.areas.length) return `<section class="ag-page" aria-label="Areas overview, new user"><div class="ag-aurora" aria-hidden="true"></div><header class="ag-header"><span>AREAS</span><h1>Create a calmer map of your life.</h1><p>Begin with one place and let the structure grow naturally.</p></header><div class="ag-empty"><div aria-hidden="true">＋</div><h2>Add your first Area</h2><p>Home, Car, Work, Personal, or anywhere else that benefits from gentle upkeep.</p><button class="ag-primary" data-action="demo-add-area">Add an Area</button></div></section>`;
  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  const summary = attention ? `${attention} routines across ${affected} areas need attention.` : 'All important routines are current.';
  return `<section class="ag-page" aria-label="Areas overview"><div class="ag-aurora" aria-hidden="true"></div><header class="ag-header"><span>AREAS</span><h1>Your spaces, softly organized.</h1><p>${attention ? `${attention} routines across ${affected} areas could use attention.` : 'Everything important is current.'}</p></header><div class="ag-summary" aria-label="${esc(summary)}"><span aria-hidden="true">◌</span><div aria-hidden="true"><strong>${attention || 'Clear'}</strong><small>${attention ? 'gentle reminders waiting' : 'nothing urgent right now'}</small></div></div><div class="ag-area-stack">${areaCards(data.areas)}</div><button class="ag-add" data-action="demo-add-area">＋ Add Area</button></section>`;
}

export function renderAreaDetailAmbient(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const attention = area.routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'));
  const later = area.routines.filter(item => !attention.includes(item));
  const sections = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sections.includes(area.unconfigured)) sections.push(area.unconfigured);
  return `<section class="ag-page" aria-label="${esc(area.name)} Area detail"><div class="ag-aurora" aria-hidden="true"></div><button class="ag-back" data-action="back-areas">← Areas</button><header class="ag-detail"><span>AREA</span><h1>${esc(area.name)}</h1><p>${area.routines.length} routines · ${sections.length} sections</p></header><section class="ag-panel" aria-labelledby="ag-attention-heading"><div class="ag-panel-title"><h2 id="ag-attention-heading">Needs attention</h2><span aria-label="${attention.length} routines">${attention.length}</span></div>${attention.length ? attention.map(item => routineRow(item, area.name, area.id)).join('') : '<p class="ag-quiet">Nothing pressing. This area can rest.</p>'}</section><section class="ag-panel" aria-labelledby="ag-sections-heading"><div class="ag-panel-title"><h2 id="ag-sections-heading">Sections</h2><span aria-label="${sections.length} sections">${sections.length}</span></div>${sections.map(name => { const routines = area.routines.filter(item => (item.section || 'General') === name); const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length; const state = routines.length ? `${routines.length} routines${waiting ? ` · ${waiting} waiting` : ''}` : 'Not configured'; return `<button class="ag-section" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${state}.`)}"><span><strong>${esc(name)}</strong><small>${state}</small></span><b aria-hidden="true">›</b></button>`; }).join('') || `<button class="ag-section" data-area-id="${esc(area.id)}" data-section-id="General" aria-label="General. Standalone routines."><span><strong>General</strong><small>Standalone routines</small></span><b aria-hidden="true">›</b></button>`}</section><section class="ag-panel" aria-labelledby="ag-later-heading"><div class="ag-panel-title"><h2 id="ag-later-heading">Later and completed</h2><span aria-label="${later.length} routines">${later.length}</span></div>${later.map(item => routineRow(item, area.name, area.id)).join('') || '<p class="ag-quiet">No later routines.</p>'}</section></section>`;
}

export function renderSectionAmbient(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;
  return `<section class="ag-page ag-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}"><div class="ag-aurora" aria-hidden="true"></div><button class="ag-back" data-action="back-area">← ${esc(area.name)}</button><header class="ag-detail"><span>SECTION</span><h1>${esc(sectionName)}</h1><p>${routines.length ? `${routines.length} routines · ${waiting} waiting` : 'Not configured yet'}</p></header>${routines.length ? `<section class="ag-panel ag-section-routines" aria-labelledby="ag-section-routines-heading"><div class="ag-panel-title"><h2 id="ag-section-routines-heading">In this section</h2><span aria-label="${routines.length} routines">${routines.length}</span></div>${routines.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : `<div class="ag-empty ag-compact-empty"><div aria-hidden="true">◌</div><h2>This section is open</h2><p>It can remain empty until a useful routine belongs here.</p></div>`}</section>`;
}

export function renderChoreAmbient(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');
  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `<section class="ag-page ag-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}"><div class="ag-aurora" aria-hidden="true"></div><button class="ag-back" data-action="back-section">← ${esc(sectionName)}</button>
    <article class="ag-chore-card ${completed ? 'completed' : esc(routine.status)}"><span class="ag-focus-orb" aria-hidden="true">${completed ? '✓' : ''}</span><span class="ag-kicker">CHORE</span><h1>${esc(routine.title)}</h1><p>${esc(area.name)} · ${esc(sectionName)}</p><strong class="ag-chore-status">${esc(status)}</strong></article>
    ${completed ? `<section class="ag-completion-panel"><span aria-hidden="true">✓</span><div><strong>Complete for this cycle</strong><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></div></section>` : `<section class="ag-context-panel"><strong>${esc(status)}</strong><p>About ${routine.minutes} minutes. Begin when it feels useful.</p></section>`}
    <dl class="ag-chore-facts"><div><dt>Area</dt><dd>${esc(area.name)}</dd></div><div><dt>Section</dt><dd>${esc(sectionName)}</dd></div><div><dt>Rhythm</dt><dd>${esc(routine.repeat)}</dd></div><div><dt>Tier</dt><dd>${esc(routine.tier || 'Light')}</dd></div><div><dt>Time</dt><dd>About ${routine.minutes} minutes</dd></div><div><dt>Status</dt><dd>${esc(status)}</dd></div></dl>
    <div class="ag-chore-actions">${completed ? `<button class="ag-secondary" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Undo completion</button>` : `<button class="ag-primary" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Mark complete</button>`}</div>
  </section>`;
}

export function renderInterventionAmbient(data) {
  const item = data.intervention;
  const suggestion = `Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`;
  return `<section class="ag-intervention" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}"><div class="ag-aurora" aria-hidden="true"></div><div class="ag-breath" aria-hidden="true"><span></span></div><span class="ag-kicker">A QUIET MOMENT</span><h1>Would a small change of pace help?</h1><p>You have spent ${item.minutes} minutes in ${esc(item.app)}. There is no penalty for staying.</p><article class="ag-suggestion" aria-label="${esc(suggestion)}"><span aria-hidden="true">SUGGESTED NEXT STEP</span><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article><div class="ag-actions"><button class="ag-primary" data-action="start-demo" aria-label="Start ${esc(item.task)}">Start gently</button><button class="ag-secondary" data-action="different-demo">Another option</button><button class="ag-dismiss" data-action="not-now-demo">Stay here</button></div></section>`;
}
