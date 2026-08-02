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

function routineRow(item, areaName, areaId) {
  const completed = Boolean(item.completion);
  const sectionName = item.section || 'General';
  const action = completed ? 'reopen-routine' : 'complete-routine';
  const actionLabel = completed ? `Undo completion of ${item.title}` : `Complete ${item.title}`;
  const label = `${item.title}. ${statusText(item)}. ${sectionName || areaName}. ${item.repeat}. About ${item.minutes} minutes.`;
  return `
    <div class="ed-routine-row ${completed ? 'completed' : ''}" aria-label="${esc(label)}">
      <button class="editorial-check" data-action="${action}" data-area-id="${esc(areaId)}" data-chore-id="${esc(item.id)}" aria-label="${esc(actionLabel)}"><span aria-hidden="true">${completed ? '✓' : ''}</span></button>
      <button class="ed-routine-open" data-area-id="${esc(areaId)}" data-section-id="${esc(sectionName)}" data-chore-id="${esc(item.id)}" aria-label="${esc(`Open ${item.title}`)}">
        <span class="routine-copy"><strong>${esc(item.title)}</strong><small>${esc(sectionName || areaName)} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
        <span class="due-stamp ${esc(item.status)}">${esc(statusText(item))}</span>
      </button>
    </div>`;
}

export function renderTodayEditorial(data) {
  if (!data.areas.length) {
    return `
      <section class="ed-page ed-today-page" aria-label="Today, new user">
        <header class="editorial-header"><div class="kicker">Nudge · Today</div><h1>A gentle place to begin.</h1><p>Add one Area first. Your next manageable routine will appear here when it is useful.</p></header>
        <div class="header-line"></div>
        <section class="coming-soon"><div class="poster"><div class="section-label">First page</div><h1>No daily notes yet</h1><p>One useful Area is enough to start writing a calmer household rhythm.</p><button class="primary-action" data-action="demo-add-area">Add your first Area</button></div></section>
      </section>`;
  }

  const queue = allRoutines(data.areas)
    .filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'))
    .sort((a, b) => priority[a.status] - priority[b.status]);
  const focus = queue[0] || null;

  if (!focus) {
    return `
      <section class="ed-page ed-today-page" aria-label="Today, all clear">
        <header class="editorial-header"><div class="kicker">Nudge · Today</div><h1>Nothing needs your attention today.</h1><p>The important routines are current. Upcoming and as-needed care can stay quietly in Areas.</p></header>
        <div class="header-line"></div>
        <article class="ed-clear-note"><div class="section-label">Today’s note</div><h2>The page is clear.</h2><p>There is no need to create work simply to fill the space.</p></article>
        <button class="secondary-action ed-wide-action" data-action="open-areas">Browse your Areas</button>
      </section>`;
  }

  return `
    <section class="ed-page ed-today-page" aria-label="Today and Needs Attention">
      <header class="editorial-header"><div class="kicker">Nudge · Today</div><h1>${queue.length === 1 ? 'One useful thing is waiting.' : `${queue.length} useful things are waiting.`}</h1><p>Begin with one entry. Everything else can remain on the page for later.</p></header>
      <div class="header-line"></div>
      <article class="ed-feature-note ${esc(focus.status)}" aria-label="${esc(`Suggested first routine: ${focus.title}. ${focus.areaName}. About ${focus.minutes} minutes.`)}">
        <div class="ed-feature-meta"><span class="section-label">A good place to begin</span><span>${focus.minutes} min</span></div>
        <h2>${esc(focus.title)}</h2>
        <p>${esc(focus.areaName)} · ${esc(focus.sectionName)} · ${esc(focus.repeat)}</p>
        <div class="ed-feature-actions">
          <button class="primary-action" data-action="complete-routine" data-area-id="${esc(focus.areaId)}" data-chore-id="${esc(focus.id)}">Mark complete</button>
          <button class="secondary-action" data-area-id="${esc(focus.areaId)}" data-section-id="${esc(focus.sectionName)}" data-chore-id="${esc(focus.id)}">Read details</button>
        </div>
      </article>
      ${queue.length > 1 ? `<section class="routine-group ed-today-list" aria-labelledby="ed-waiting-heading"><div class="routine-group-header"><h2 id="ed-waiting-heading">Also on today’s page</h2><span>${queue.length - 1}</span></div>${queue.slice(1).map(item => routineRow(item, item.areaName, item.areaId)).join('')}</section>` : ''}
    </section>`;
}

export function renderAreasEditorial(data) {
  if (!data.areas.length) {
    return `
      <section class="ed-page" aria-label="Areas overview, new user">
        <header class="editorial-header"><div class="kicker">Nudge · Areas</div><h1>Make the place yours.</h1><p>Begin with one space. You can add its recurring care a little at a time.</p></header>
        <div class="header-line"></div>
        <section class="coming-soon"><div class="poster"><div class="section-label">A blank beginning</div><h1>No Areas yet</h1><p>Add Home, Car, Personal, Work, or a place that makes sense only to you.</p><button class="primary-action" data-action="demo-add-area">Add your first Area</button></div></section>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  return `
    <section class="ed-page" aria-label="Areas overview">
      <header class="editorial-header"><div class="kicker">Nudge · Areas</div><h1>The places you care for.</h1><p>Recurring chores and maintenance, organized by where they belong.</p></header>
      <div class="header-line"></div>
      <section class="attention-note" aria-label="${attention ? `${attention} routines need attention across ${affected} Areas.` : 'Everything important is current.'}"><strong>${attention ? `${attention} routines need attention.` : 'Everything important is current.'}</strong><p>${attention ? `They are spread across ${affected} ${affected === 1 ? 'Area' : 'Areas'}. Start wherever feels easiest.` : 'As-needed routines remain available without creating urgency.'}</p></section>
      <section class="area-index"><div class="area-index-heading"><span class="section-label">Your Areas</span><span>${data.areas.length} places</span></div>
        ${data.areas.map(area => {
          const status = statusFor(area);
          const next = nextRoutine(area);
          const label = `${area.name}. ${status.label}. ${area.routines.length} routines${area.sections ? ` and ${area.sections} sections` : ''}. ${next ? `Next routine: ${next.title}.` : 'No incomplete routines configured.'}`;
          return `<article class="area-entry ${status.className}"><button data-area-id="${esc(area.id)}" aria-label="${esc(label)}"><span><span class="area-name"><strong>${esc(area.name)}</strong><i aria-hidden="true"></i></span><span class="area-meta">${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ' · standalone Area'}</span><span class="area-next">${next ? `${status.label} · ${esc(next.title)}` : 'Everything here is clear'}</span></span><span class="area-count" aria-hidden="true">${status.count}</span></button></article>`;
        }).join('')}
      </section>
      <button class="add-area" data-action="demo-add-area">+ Add another Area</button>
    </section>`;
}

export function renderAreaDetail(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That Area does not exist in this scenario.');

  const attention = area.routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today'));
  const later = area.routines.filter(item => !attention.includes(item));
  const sectionNames = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !sectionNames.includes(area.unconfigured)) sectionNames.push(area.unconfigured);

  return `
    <section class="ed-page" aria-label="${esc(area.name)} Area detail">
      <div class="back-row"><button class="back-button" data-action="back-areas">← All Areas</button></div>
      <header class="area-detail-intro"><div class="section-label">Area overview</div><h1>${esc(area.name)}</h1><p>${attention.length ? `${attention.length} need attention` : 'Up to date'} · ${area.routines.length} recurring routines</p></header>
      <section class="routine-group" aria-labelledby="ed-attention-heading"><div class="routine-group-header"><h2 id="ed-attention-heading">Needs attention</h2><span>${attention.length}</span></div>${attention.length ? attention.map(item => routineRow(item, area.name, area.id)).join('') : '<p class="quiet-copy">Nothing is pressing here. Browse a Section or use an as-needed routine.</p>'}</section>
      <section class="routine-group" aria-labelledby="ed-sections-heading"><div class="routine-group-header"><h2 id="ed-sections-heading">Sections</h2><span>${sectionNames.length}</span></div>${sectionNames.map(name => {
        const routines = area.routines.filter(item => (item.section || 'General') === name);
        const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;
        const state = routines.length ? `${routines.length} routines${waiting ? ` · ${waiting} waiting` : ''}` : 'Not configured yet';
        return `<button class="section-link" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${state}.`)}"><span><strong>${esc(name)}</strong><br><small>${state}</small></span><span aria-hidden="true">→</span></button>`;
      }).join('') || `<button class="section-link" data-area-id="${esc(area.id)}" data-section-id="General"><span><strong>General</strong><br><small>Standalone routines</small></span><span aria-hidden="true">→</span></button>`}</section>
      <section class="routine-group" aria-labelledby="ed-later-heading"><div class="routine-group-header"><h2 id="ed-later-heading">Coming later and completed</h2><span>${later.length}</span></div>${later.map(item => routineRow(item, area.name, area.id)).join('') || '<p class="quiet-copy">No additional routines are filed here.</p>'}</section>
    </section>`;
}

export function renderSectionEditorial(data, requestedAreaId, requestedSection, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That Area does not exist in this scenario.');
  const sectionName = requestedSection || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const waiting = routines.filter(item => !item.completion && (item.status === 'overdue' || item.status === 'today')).length;

  return `
    <section class="ed-page ed-section-page" aria-label="${esc(`${sectionName} Section in ${area.name}`)}">
      <div class="back-row"><button class="back-button" data-action="back-area">← ${esc(area.name)}</button></div>
      <header class="area-detail-intro"><div class="section-label">Section notes</div><h1>${esc(sectionName)}</h1><p>${routines.length ? `${routines.length} routines · ${waiting} waiting` : 'This Section is still open for future routines.'}</p></header>
      ${routines.length ? `<section class="routine-group" aria-labelledby="ed-section-routines"><div class="routine-group-header"><h2 id="ed-section-routines">In this Section</h2><span>${routines.length}</span></div>${routines.map(item => routineRow(item, area.name, area.id)).join('')}</section>` : `<section class="coming-soon ed-compact-empty"><div class="poster"><div class="section-label">An open page</div><h1>Nothing is written here yet.</h1><p>This Section can stay empty until a useful routine belongs in it.</p></div></section>`}
    </section>`;
}

export function renderChoreEditorial(data, requestedAreaId, requestedSection, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That routine does not exist in this scenario.');

  const sectionName = requestedSection || routine.section || 'General';
  const completed = Boolean(routine.completion);
  const status = statusText(routine);
  return `
    <section class="ed-page ed-chore-page" aria-label="${esc(`${routine.title} Chore detail`)}">
      <div class="back-row"><button class="back-button" data-action="back-section">← ${esc(sectionName)}</button></div>
      <article class="ed-chore-entry ${completed ? 'completed' : esc(routine.status)}">
        <div class="ed-entry-meta"><span class="section-label">Routine entry</span><span>${esc(status)}</span></div>
        <h1>${esc(routine.title)}</h1>
        <p>${esc(area.name)} · ${esc(sectionName)}</p>
      </article>
      ${completed ? `<section class="ed-completion-note"><div class="section-label">Entry closed</div><h2>A small thing moved forward.</h2><p>${esc(routine.completion.completedLabel)}. ${esc(routine.completion.nextLabel)}.</p></section>` : `<section class="ed-context-note"><div class="section-label">For context</div><p>This usually takes about ${routine.minutes} minutes. Begin when it feels useful.</p></section>`}
      <dl class="ed-chore-facts">
        <div><dt>Area</dt><dd>${esc(area.name)}</dd></div>
        <div><dt>Section</dt><dd>${esc(sectionName)}</dd></div>
        <div><dt>Rhythm</dt><dd>${esc(routine.repeat)}</dd></div>
        <div><dt>Care tier</dt><dd>${esc(routine.tier || 'Light')}</dd></div>
        <div><dt>Time</dt><dd>About ${routine.minutes} minutes</dd></div>
        <div><dt>Status</dt><dd>${esc(status)}</dd></div>
      </dl>
      <div class="ed-chore-actions">${completed ? `<button class="secondary-action" data-action="reopen-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Reopen this entry</button>` : `<button class="primary-action" data-action="complete-routine" data-area-id="${esc(area.id)}" data-chore-id="${esc(routine.id)}">Mark complete</button>`}</div>
    </section>`;
}

export function renderInterventionEditorial(data) {
  const item = data.intervention;
  return `
    <section class="intervention-screen" aria-label="Nudge intervention after ${item.minutes} minutes in ${esc(item.app)}">
      <div class="intervention-top"><span class="intervention-kicker">A useful pause</span><span>${item.minutes} min on ${esc(item.app)}</span></div>
      <div class="intervention-rule"></div>
      <h1>You have been here for a little while.</h1>
      <p class="lead">No judgment. This may be a good moment to step away and finish one small thing.</p>
      <article class="suggestion-card" aria-label="${esc(`Suggested now: ${item.task}. ${item.location}. About ${item.duration} minutes.`)}"><div class="section-label">Suggested now</div><h2 aria-hidden="true">${esc(item.task)}</h2><p aria-hidden="true">${esc(item.location)} · about ${item.duration} minutes</p></article>
      <div class="intervention-actions"><button class="primary-action" data-action="start-demo" aria-label="Start ${esc(item.task)}">Start this</button><button class="secondary-action" data-action="different-demo">Choose something else</button><button class="text-action" data-action="not-now-demo">Not now</button></div>
    </section>`;
}
