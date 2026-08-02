import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'AVAILABLE',
    active: 'ACTIVE',
    completed: 'COMPLETE',
    dismissed: 'SET ASIDE'
  }[phase] || 'AVAILABLE';
}

function positionLabel(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${(item.suggestionIndex || 0) + 1} of ${total}`;
}

function facts(item, phase) {
  return `
    <dl class="ag-intervention-facts">
      <div><dt>Current app</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>Fixture pause</dt><dd>${item.minutes} min</dd></div>
      <div><dt>Action estimate</dt><dd>${item.duration} min</dd></div>
      <div><dt>Suggestion</dt><dd>${positionLabel(item)}</dd></div>
      <div><dt>State</dt><dd>${phaseLabel(phase)}</dd></div>
    </dl>`;
}

function promptView(item) {
  return `
    <div class="ag-intervention-aurora" aria-hidden="true"></div>
    <div class="ag-intervention-content">
      <header class="ag-intervention-heading">
        <span class="ag-kicker">A QUIET OPTION</span>
        <h1>Would a small change of pace help?</h1>
        <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Continue there or choose this small action. Either choice is complete.</p>
      </header>
      <article class="ag-intervention-card prompt" aria-labelledby="ag-intervention-title">
        <div class="ag-intervention-card-meta"><span>SUGGESTION ${positionLabel(item)}</span><b>${item.duration} MIN</b></div>
        <span class="ag-intervention-orb" aria-hidden="true"></span>
        <h2 id="ag-intervention-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item, 'prompt')}
      <p class="ag-intervention-boundary">Transparency is decorative. No timer, monitoring, reminder, score, or requirement is created.</p>
    </div>
    <div class="ag-intervention-actions">
      <button class="ag-primary" data-action="start-intervention">Start this small action</button>
      <button class="ag-secondary" data-action="next-intervention">Show another option</button>
      <button class="ag-dismiss" data-action="dismiss-intervention">Continue in the current app</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="ag-intervention-aurora" aria-hidden="true"></div>
    <div class="ag-intervention-content">
      <header class="ag-intervention-heading">
        <span class="ag-kicker">ACTION ACTIVE</span>
        <h1>The small action is open.</h1>
        <p>This prototype remembers only the selected option. It does not time, monitor, block, redirect, or add anything to production Tasks.</p>
      </header>
      <article class="ag-intervention-card active" aria-labelledby="ag-active-title">
        <div class="ag-intervention-card-meta"><span>${esc(item.startedLabel || 'STARTED NOW')}</span><b>ACTIVE</b></div>
        <span class="ag-intervention-orb" aria-hidden="true"></span>
        <h2 id="ag-active-title">${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      ${facts(item, 'active')}
      <p class="ag-intervention-boundary">There is no countdown and no obligation to finish.</p>
    </div>
    <div class="ag-intervention-actions">
      <button class="ag-primary" data-action="complete-intervention">Mark this action complete</button>
      <button class="ag-secondary" data-action="undo-intervention">Undo the start</button>
      <button class="ag-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="ag-intervention-aurora" aria-hidden="true"></div>
    <div class="ag-intervention-content">
      <header class="ag-intervention-heading">
        <span class="ag-kicker">ACTION COMPLETE</span>
        <h1>One small action moved forward.</h1>
        <p>This result belongs only to the intervention prototype. Recurring routines and the Tasks checklist remain unchanged.</p>
      </header>
      <article class="ag-intervention-card completed" aria-labelledby="ag-completed-title">
        <div class="ag-intervention-card-meta"><span>${esc(item.completedLabel || 'COMPLETED')}</span><b>✓ COMPLETE</b></div>
        <span class="ag-intervention-orb" aria-hidden="true">✓</span>
        <h2 id="ag-completed-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item, 'completed')}
      <p class="ag-intervention-boundary">No points, streak, ranking, glow score, or performance measure was added.</p>
    </div>
    <div class="ag-intervention-actions">
      <button class="ag-secondary" data-action="reopen-intervention">Reopen this action</button>
      <button class="ag-secondary" data-action="undo-intervention">Undo the start</button>
      <button class="ag-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="ag-intervention-aurora" aria-hidden="true"></div>
    <div class="ag-intervention-content">
      <header class="ag-intervention-heading">
        <span class="ag-kicker">SUGGESTION SET ASIDE</span>
        <h1>Continue where you are.</h1>
        <p>No action was started. No Task, reminder, follow-up, penalty, or missed-opportunity state was created.</p>
      </header>
      <article class="ag-intervention-card dismissed" role="status">
        <div class="ag-intervention-card-meta"><span>NO CHANGE</span><b>VALID CHOICE</b></div>
        <span class="ag-intervention-orb" aria-hidden="true"></span>
        <h2>${esc(item.app)} continues outside Nudge.</h2>
        <p>Bring the suggestion back only when it would be useful.</p>
      </article>
      ${facts(item, 'dismissed')}
      <p class="ag-intervention-boundary">Setting the suggestion aside is a complete response. Nothing is owed.</p>
    </div>
    <div class="ag-intervention-actions">
      <button class="ag-secondary" data-action="resume-intervention">Show the suggestion again</button>
      <button class="ag-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionAmbientAction(data) {
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
    <section class="ag-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      ${content}
    </section>`;
}
