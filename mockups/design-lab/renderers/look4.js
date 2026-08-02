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

function sectionNames(area) {
  const names = [...new Set(area.routines.map(item => item.section || 'General'))];
  if (area.unconfigured && !names.includes(area.unconfigured)) names.push(area.unconfigured);
  return names;
}

function routineLocation(area, routine) {
  return routine.section || area.name;
}

function routinePathAttributes(area, routine) {
  return `data-area-id="${esc(area.id)}" data-section-id="${esc(routine.section || 'General')}" data-chore-id="${esc(routine.id)}"`;
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

function routineRow(item, area) {
  const status = item.completion ? 'Completed' : dueLabel(item.status);
  const details = `${routineLocation(area, item)}. ${item.repeat}. ${item.tier} tier. About ${item.minutes} minutes.`;
  return `
    <div class="zen-routine-row ${esc(item.status)} ${item.completion ? 'completed' : ''}" aria-label="${esc(`${item.title}. ${status}. ${details}`)}">
      <button class="zen-check" data-action="${item.completion ? 'reopen-routine' : 'complete-routine'}" ${routinePathAttributes(area, item)} aria-label="${item.completion ? 'Reopen' : 'Complete'} ${esc(item.title)}"><span aria-hidden="true">${item.completion ? '✓' : ''}</span></button>
      <button class="zen-routine-open" ${routinePathAttributes(area, item)}>
        <span class="zen-routine-copy"><strong>${esc(item.title)}</strong><small>${esc(routineLocation(area, item))} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
        <span class="zen-routine-status">${esc(status)}</span>
      </button>
    </div>`;
}

export function renderTodayZen(data) {
  const attention = data.areas.flatMap(area => area.routines
    .filter(item => item.status === 'overdue' || item.status === 'today')
    .map(item => ({ area, routine: item })));
  const focus = attention[0] || null;

  return `
    <section class="zen-page zen-today-page" aria-label="Today and Needs Attention">
      <header class="zen-header">
        <span class="zen-eyebrow">Today</span>
        <h1>${attention.length ? 'One useful thing is enough.' : 'Nothing needs you right now.'}</h1>
        <p>${attention.length ? `${attention.length} routines are asking for attention. Choose one, or leave them for later.` : 'Your recurring routines have moved forward. As-needed actions remain available without urgency.'}</p>
      </header>
      ${focus ? `
        <article class="zen-focus-card ${esc(focus.routine.status)}" aria-label="${esc(`Suggested start: ${focus.routine.title} in ${focus.area.name}`)}">
          <span class="zen-focus-label">A gentle place to start</span>
          <h2>${esc(focus.routine.title)}</h2>
          <p>${esc(focus.area.name)} · ${esc(routineLocation(focus.area, focus.routine))} · about ${focus.routine.minutes} minutes</p>
          <button ${routinePathAttributes(focus.area, focus.routine)}>Open this chore</button>
        </article>` : `
        <article class="zen-clear-card" role="status">
          <span aria-hidden="true">✓</span>
          <div><strong>All clear</strong><p>Completing a routine advances it to its next cycle. You can reopen it from the chore detail if needed.</p></div>
        </article>`}
      <section class="zen-group" aria-label="Needs attention list">
        <div class="zen-section-heading"><span>Needs attention</span><small aria-label="${attention.length} routines">${attention.length}</small></div>
        ${attention.length ? attention.map(({ area, routine }) => routineRow(routine, area)).join('') : '<p class="zen-quiet">No overdue or due-today routines remain.</p>'}
      </section>
      <button class="zen-add" data-action="open-areas">Browse all areas</button>
    </section>`;
}

export function renderAreasZen(data) {
  if (!data.areas.length) {
    return `
      <section class="zen-page zen-empty-page" aria-label="Areas empty state">
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
  const focusLabel = attention ? 'A gentle place to start' : 'Available when useful';
  return `
    <section class="zen-page" aria-label="Zen Focus Areas overview">
      <header class="zen-header">
        <span class="zen-eyebrow">Your spaces</span>
        <h1>${attention ? 'A few things are asking for attention.' : 'Everything important can rest.'}</h1>
        <p>${attention ? `${attention} routines across ${affected} ${affected === 1 ? 'area' : 'areas'}. You only need to begin with one.` : 'As-needed routines remain nearby without creating urgency.'}</p>
      </header>
      ${focus ? `
        <article class="zen-focus-card ${esc(focus.status)}" aria-label="${esc(`${focusLabel}: ${focus.title} in ${focus.areaName}, about ${focus.minutes} minutes`)}">
          <span class="zen-focus-label">${focusLabel}</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(focus.areaName)} · about ${focus.minutes} minutes</p>
          <button data-area-id="${esc(focus.areaId)}" aria-label="${esc(`Open ${focus.areaName} to view ${focus.title}`)}">Open ${esc(focus.areaName)}</button>
        </article>` : ''}
      <section class="zen-area-list" aria-label="All areas">
        <div class="zen-section-heading"><span>All areas</span><small aria-label="${data.areas.length} areas">${data.areas.length}</small></div>
        ${areaCards(data.areas)}
      </section>
      <button class="zen-add" data-action="demo-add-area">Add another area</button>
    </section>`;
}

export function renderAreaDetailZen(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const focus = attention[0] || later[0] || null;
  const remainingAttention = focus ? attention.filter(item => item !== focus) : attention;
  const remainingLater = later.filter(item => item !== focus);
  const sections = sectionNames(area);

  return `
    <section class="zen-page zen-detail-page" aria-label="${esc(`${area.name} area detail`)}">
      <button class="zen-back" data-action="back-areas">← All areas</button>
      <header class="zen-detail-header">
        <span class="zen-eyebrow">Area</span>
        <h1>${esc(area.name)}</h1>
        <p>${attention.length ? `${attention.length} need attention` : 'Nothing pressing'} · ${area.routines.length} recurring routines</p>
      </header>
      ${focus ? `
        <section class="zen-start-card ${esc(focus.status)}" aria-label="${esc(`${attention.length ? 'Start here' : 'Available when useful'}: ${focus.title}. ${routineLocation(area, focus)}. ${focus.repeat}. About ${focus.minutes} minutes.`)}">
          <span>${attention.length ? 'Start here' : 'Available when useful'}</span>
          <h2>${esc(focus.title)}</h2>
          <p>${esc(routineLocation(area, focus))} · ${esc(focus.repeat)} · about ${focus.minutes} minutes</p>
          <button class="zen-primary" ${routinePathAttributes(area, focus)} aria-label="Open ${esc(focus.title)}">Open chore</button>
        </section>` : ''}
      ${remainingAttention.length ? `
        <section class="zen-group" aria-label="Also needs attention">
          <div class="zen-section-heading"><span>Also needs attention</span><small aria-label="${remainingAttention.length} routines">${remainingAttention.length}</small></div>
          ${remainingAttention.map(item => routineRow(item, area)).join('')}
        </section>` : ''}
      <section class="zen-group" aria-label="Sections">
        <div class="zen-section-heading"><span>Sections</span><small aria-label="${sections.length} sections">${sections.length}</small></div>
        ${sections.map(name => {
          const count = area.routines.filter(item => (item.section || 'General') === name).length;
          const countText = count ? `${count} routines` : 'Not configured yet';
          return `<button class="zen-section-row" data-area-id="${esc(area.id)}" data-section-id="${esc(name)}" aria-label="${esc(`${name}. ${countText}`)}"><span><strong>${esc(name)}</strong><small>${countText}</small></span><span aria-hidden="true">›</span></button>`;
        }).join('')}
      </section>
      <section class="zen-group" aria-label="Later and as needed">
        <div class="zen-section-heading"><span>Later and as needed</span><small aria-label="${remainingLater.length} routines">${remainingLater.length}</small></div>
        ${remainingLater.map(item => routineRow(item, area)).join('') || '<p class="zen-quiet">Nothing else is waiting here.</p>'}
      </section>
    </section>`;
}

export function renderSectionZen(data, requestedAreaId, requestedSectionId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');
  const sectionName = requestedSectionId || 'General';
  const routines = area.routines.filter(item => (item.section || 'General') === sectionName);
  const isKnown = sectionNames(area).includes(sectionName);
  if (!isKnown) return renderUnsupported('That section does not exist in this area.');
  const attention = routines.filter(item => item.status === 'overdue' || item.status === 'today').length;

  return `
    <section class="zen-page zen-section-page" aria-label="${esc(`${sectionName} section in ${area.name}`)}">
      <button class="zen-back" data-action="back-area">← ${esc(area.name)}</button>
      <header class="zen-detail-header">
        <span class="zen-eyebrow">${esc(area.name)} · Section</span>
        <h1>${esc(sectionName)}</h1>
        <p>${routines.length ? `${routines.length} routines · ${attention ? `${attention} need attention` : 'nothing pressing'}` : 'No routines configured yet'}</p>
      </header>
      <section class="zen-group" aria-label="Routines in ${esc(sectionName)}">
        ${routines.length ? routines.map(item => routineRow(item, area)).join('') : `
          <article class="zen-empty-section">
            <span aria-hidden="true">○</span>
            <h2>This section can stay empty.</h2>
            <p>Add a routine only when it would make the space easier to maintain.</p>
          </article>`}
      </section>
    </section>`;
}

export function renderChoreZen(data, requestedAreaId, requestedSectionId, requestedChoreId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  const routine = area?.routines.find(item => item.id === requestedChoreId);
  if (!area || !routine) return renderUnsupported('That chore does not exist in this scenario.');
  const sectionName = routine.section || requestedSectionId || 'General';
  const status = routine.completion ? 'Completed' : dueLabel(routine.status);

  return `
    <section class="zen-page zen-chore-page" aria-label="${esc(`${routine.title} chore detail`)}">
      <button class="zen-back" data-action="back-section">← ${esc(sectionName)}</button>
      <header class="zen-detail-header">
        <span class="zen-eyebrow">${esc(area.name)} · ${esc(sectionName)}</span>
        <h1>${esc(routine.title)}</h1>
        <p>${esc(status)} · about ${routine.minutes} minutes</p>
      </header>
      ${routine.completion ? `
        <article class="zen-completion-card" role="status">
          <span class="zen-completion-mark" aria-hidden="true">✓</span>
          <div><strong>${esc(routine.completion.completedLabel)}</strong><p>${esc(routine.completion.nextLabel)}</p></div>
        </article>` : `
        <article class="zen-chore-prompt ${esc(routine.status)}">
          <span>${esc(status)}</span>
          <h2>Ready when you are.</h2>
          <p>Completing this will move it out of Needs Attention and advance its recurrence.</p>
        </article>`}
      <dl class="zen-chore-facts">
        <div><dt>Frequency tier</dt><dd>${esc(routine.tier)}</dd></div>
        <div><dt>Recurrence</dt><dd>${esc(routine.repeat)}</dd></div>
        <div><dt>Estimated time</dt><dd>${routine.minutes} minutes</dd></div>
        <div><dt>Current state</dt><dd>${esc(status)}</dd></div>
      </dl>
      <div class="zen-chore-actions">
        ${routine.completion ? `
          <button class="zen-secondary" data-action="reopen-routine" ${routinePathAttributes(area, routine)}>Undo completion</button>
          <button class="zen-dismiss" data-action="back-section">Return to section</button>` : `
          <button class="zen-primary" data-action="complete-routine" ${routinePathAttributes(area, routine)}>Mark complete</button>
          <button class="zen-dismiss" data-action="back-section">Not now</button>`}
      </div>
    </section>`;
}

function interventionSuggestion(item, label = 'One useful option') {
  return `
    <article class="zen-suggestion" aria-label="${esc(`Suggested action: ${item.task}. ${item.location}. About ${item.duration} minutes.`)}">
      <span>${label}</span>
      <h2>${esc(item.task)}</h2>
      <p>${esc(item.location)} · about ${item.duration} minutes</p>
    </article>`;
}

function interventionPrompt(item) {
  return `
    <div class="zen-intervention-copy">
      <span class="zen-eyebrow">A small pause</span>
      <h1>Would stepping away help?</h1>
      <p>You have spent ${item.minutes} minutes in ${esc(item.app)}. There is no penalty for staying. This is simply a chance to choose again.</p>
    </div>
    ${interventionSuggestion(item)}
    <div class="zen-actions">
      <button class="zen-primary" data-action="start-intervention">Start this</button>
      <button class="zen-secondary" data-action="next-intervention">Show another option</button>
      <button class="zen-dismiss" data-action="dismiss-intervention">Stay here for now</button>
    </div>`;
}

function interventionActive(item) {
  return `
    <div class="zen-intervention-copy">
      <span class="zen-eyebrow">A small action</span>
      <h1>You chose a place to begin.</h1>
      <p>${esc(item.startedLabel || 'Started now')}. Nothing is being timed or monitored. Continue only while this still feels useful.</p>
    </div>
    ${interventionSuggestion(item, 'Active now')}
    <article class="zen-action-state active" role="status">
      <span aria-hidden="true">○</span>
      <div><strong>Ready in front of you</strong><p>The suggestion is now a concrete action state. You can complete it, choose something else, or undo the start.</p></div>
    </article>
    <div class="zen-actions">
      <button class="zen-primary" data-action="complete-intervention">Mark this complete</button>
      <button class="zen-secondary" data-action="next-intervention">Choose something else</button>
      <button class="zen-dismiss" data-action="undo-intervention">Undo start</button>
    </div>`;
}

function interventionCompleted(item) {
  return `
    <div class="zen-intervention-copy">
      <span class="zen-eyebrow">Action complete</span>
      <h1>That small step is finished.</h1>
      <p>${esc(item.completedLabel || 'Completed just now')}. Nothing else is required, and the completion can be reopened immediately.</p>
    </div>
    ${interventionSuggestion(item, 'Completed action')}
    <article class="zen-action-state completed" role="status">
      <span aria-hidden="true">✓</span>
      <div><strong>Complete for now</strong><p>This completion is isolated to the Design Lab and does not change production tasks or routines.</p></div>
    </article>
    <div class="zen-actions">
      <button class="zen-secondary" data-action="reopen-intervention">Reopen this action</button>
      <button class="zen-secondary" data-action="next-intervention">Choose another option</button>
      <button class="zen-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function interventionDismissed(item) {
  return `
    <div class="zen-intervention-copy">
      <span class="zen-eyebrow">Pause dismissed</span>
      <h1>Staying here is a valid choice.</h1>
      <p>No task was started, no penalty was added, and no reminder is waiting. You can reopen the suggestion whenever it would help.</p>
    </div>
    <article class="zen-action-state dismissed" role="status">
      <span aria-hidden="true">—</span>
      <div><strong>Nothing changed</strong><p>${esc(item.app)} remains your current context. The Design Lab does not block or monitor the app.</p></div>
    </article>
    <div class="zen-actions">
      <button class="zen-secondary" data-action="resume-intervention">Show the suggestion again</button>
      <button class="zen-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionZen(data) {
  const item = data.intervention;
  const content = item.phase === 'active'
    ? interventionActive(item)
    : item.phase === 'completed'
      ? interventionCompleted(item)
      : item.phase === 'dismissed'
        ? interventionDismissed(item)
        : interventionPrompt(item);
  return `
    <section class="zen-intervention zen-intervention-action" aria-label="${esc(`Intervention after ${item.minutes} minutes in ${item.app}. State: ${item.phase}.`)}">
      <div class="zen-pause-mark" aria-hidden="true"><span></span></div>
      ${content}
    </section>`;
}
