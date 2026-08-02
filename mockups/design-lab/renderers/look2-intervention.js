import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'Available note',
    active: 'In progress',
    completed: 'Completed',
    dismissed: 'Set aside'
  }[phase] || 'Available note';
}

function positionLabel(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${(item.suggestionIndex || 0) + 1} of ${total}`;
}

function facts(item, phase) {
  return `
    <dl class="ed-intervention-facts">
      <div><dt>Current app</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>Fixture pause</dt><dd>${item.minutes} minutes</dd></div>
      <div><dt>Action estimate</dt><dd>About ${item.duration} minutes</dd></div>
      <div><dt>Suggestion</dt><dd>${positionLabel(item)}</dd></div>
      <div><dt>State</dt><dd>${phaseLabel(phase)}</dd></div>
    </dl>`;
}

function promptView(item) {
  return `
    <div class="ed-intervention-content">
      <header class="ed-intervention-heading">
        <div class="kicker">Nudge · An optional pause</div>
        <h1>One practical thing, if it helps.</h1>
        <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Continue there or use this small suggestion. Either choice is complete.</p>
      </header>
      <article class="ed-intervention-entry prompt" aria-labelledby="ed-intervention-title">
        <div class="ed-intervention-meta"><span>Suggestion ${positionLabel(item)}</span><span>${item.duration} min</span></div>
        <h2 id="ed-intervention-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item, 'prompt')}
      <p class="ed-intervention-boundary">No reflection, journal entry, score, reminder, or requirement is created.</p>
    </div>
    <div class="ed-intervention-actions">
      <button class="primary-action" data-action="start-intervention">Begin this small action</button>
      <button class="secondary-action" data-action="next-intervention">Show another suggestion</button>
      <button class="text-action" data-action="dismiss-intervention">Continue in the current app</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="ed-intervention-content">
      <header class="ed-intervention-heading">
        <div class="kicker">Nudge · Action in progress</div>
        <h1>The practical step is open.</h1>
        <p>This prototype remembers only the selected action. It does not start a timer, monitor activity, block an app, or add a production Task.</p>
      </header>
      <article class="ed-intervention-entry active" aria-labelledby="ed-active-title">
        <div class="ed-intervention-meta"><span>${esc(item.startedLabel || 'Started now')}</span><span>In progress</span></div>
        <h2 id="ed-active-title">${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      ${facts(item, 'active')}
      <p class="ed-intervention-boundary">There is no countdown and no obligation to finish.</p>
    </div>
    <div class="ed-intervention-actions">
      <button class="primary-action" data-action="complete-intervention">Mark this action complete</button>
      <button class="secondary-action" data-action="undo-intervention">Undo the start</button>
      <button class="text-action" data-action="return-today">Return to Today</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="ed-intervention-content">
      <header class="ed-intervention-heading">
        <div class="kicker">Nudge · Action completed</div>
        <h1>One small action moved forward.</h1>
        <p>This completion belongs only to the intervention prototype. It did not change a recurring routine or the Tasks checklist.</p>
      </header>
      <article class="ed-intervention-entry completed" aria-labelledby="ed-completed-title">
        <div class="ed-intervention-meta"><span>${esc(item.completedLabel || 'Completed')}</span><span>✓ Complete</span></div>
        <h2 id="ed-completed-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item, 'completed')}
      <p class="ed-intervention-boundary">No points, streak, reflection prompt, ranking, or performance measure was added.</p>
    </div>
    <div class="ed-intervention-actions">
      <button class="secondary-action" data-action="reopen-intervention">Reopen this action</button>
      <button class="secondary-action" data-action="undo-intervention">Undo the start</button>
      <button class="text-action" data-action="return-today">Return to Today</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="ed-intervention-content">
      <header class="ed-intervention-heading">
        <div class="kicker">Nudge · Suggestion set aside</div>
        <h1>Continue where you are.</h1>
        <p>No action was started. No Task, reminder, follow-up, penalty, journal entry, or missed-opportunity state was created.</p>
      </header>
      <article class="ed-intervention-entry dismissed" role="status">
        <div class="ed-intervention-meta"><span>No change</span><span>Valid choice</span></div>
        <h2>${esc(item.app)} continues outside Nudge.</h2>
        <p>Return to the suggestion only when it would be useful.</p>
      </article>
      ${facts(item, 'dismissed')}
      <p class="ed-intervention-boundary">Setting the suggestion aside is a complete response. Nothing needs to be written or explained.</p>
    </div>
    <div class="ed-intervention-actions">
      <button class="secondary-action" data-action="resume-intervention">Show the suggestion again</button>
      <button class="text-action" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionEditorialAction(data) {
  const item = data.intervention;
  const phase = item.phase || 'prompt';
  const content = phase === 'active'
    ? activeView(item)
    : phase === 'completed'
      ? completedView(item)
      : phase === 'dismissed'
        ? dismissedView(item)
        : promptView(item);

  return `
    <section class="ed-page ed-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      ${content}
    </section>`;
}
