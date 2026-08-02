import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'AVAILABLE',
    active: 'ACTIVE',
    completed: 'COMPLETE',
    dismissed: 'DISMISSED'
  }[phase] || 'AVAILABLE';
}

function suggestionPosition(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${String((item.suggestionIndex || 0) + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function facts(item) {
  return `
    <dl class="pm-intervention-facts">
      <div><dt>Source app</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>Elapsed</dt><dd>${item.minutes} min</dd></div>
      <div><dt>Action estimate</dt><dd>${item.duration} min</dd></div>
      <div><dt>Suggestion</dt><dd>${suggestionPosition(item)}</dd></div>
    </dl>`;
}

function promptView(item) {
  return `
    <div class="pm-intervention-body">
      <div class="pm-signal" aria-hidden="true"></div>
      <div class="pm-intervention-title-row">
        <div><span>OPTIONAL CONTEXT SWITCH</span><h1>Pause here?</h1></div>
        <strong>${suggestionPosition(item)}</strong>
      </div>
      <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. This is an optional chance to choose a small action; staying here is also valid.</p>
      <article class="pm-intervention-card" aria-labelledby="pm-intervention-action-title">
        <div class="pm-intervention-card-head"><span>AVAILABLE ACTION</span><b>${item.duration} MIN</b></div>
        <h2 id="pm-intervention-action-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item)}
    </div>
    <div class="pm-intervention-actions">
      <button class="pm-primary" data-action="start-intervention">Start action</button>
      <button class="pm-secondary" data-action="next-intervention">Next option</button>
      <button class="pm-dismiss" data-action="dismiss-intervention">Not now</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="pm-intervention-body">
      <div class="pm-signal active" aria-hidden="true"></div>
      <div class="pm-intervention-title-row">
        <div><span>ACTION STATE</span><h1>Active now.</h1></div>
        <strong>01</strong>
      </div>
      <p>The action is open in Nudge only. No timer, app block, background tracking, or production Task was created.</p>
      <article class="pm-intervention-card active" aria-labelledby="pm-active-action-title">
        <div class="pm-intervention-card-head"><span>${esc(item.startedLabel || 'STARTED NOW')}</span><b>${item.duration} MIN</b></div>
        <h2 id="pm-active-action-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item)}
    </div>
    <div class="pm-intervention-actions">
      <button class="pm-primary" data-action="complete-intervention">Mark complete</button>
      <button class="pm-secondary" data-action="undo-intervention">Undo start</button>
      <button class="pm-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="pm-intervention-body">
      <div class="pm-signal completed" aria-hidden="true"></div>
      <div class="pm-intervention-title-row">
        <div><span>ACTION STATE</span><h1>Action complete.</h1></div>
        <strong aria-hidden="true">✓</strong>
      </div>
      <p>This completion belongs only to the intervention prototype. It did not change recurring routines or the Tasks checklist.</p>
      <article class="pm-intervention-card completed" aria-labelledby="pm-completed-action-title">
        <div class="pm-intervention-card-head"><span>${esc(item.completedLabel || 'COMPLETED')}</span><b>COMPLETE</b></div>
        <h2 id="pm-completed-action-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${facts(item)}
    </div>
    <div class="pm-intervention-actions">
      <button class="pm-secondary" data-action="reopen-intervention">Reopen action</button>
      <button class="pm-secondary" data-action="undo-intervention">Undo start</button>
      <button class="pm-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="pm-intervention-body">
      <div class="pm-signal dismissed" aria-hidden="true"></div>
      <div class="pm-intervention-title-row">
        <div><span>INTERVENTION STATE</span><h1>Dismissed.</h1></div>
        <strong>00</strong>
      </div>
      <p>No action was started. No task, reminder, penalty, or follow-up was created.</p>
      <article class="pm-intervention-card dismissed" role="status">
        <div class="pm-intervention-card-head"><span>NO CHANGE</span><b>OPTIONAL</b></div>
        <h2>Continue as you were.</h2>
        <p>${esc(item.app)} remains outside this prototype.</p>
      </article>
    </div>
    <div class="pm-intervention-actions">
      <button class="pm-secondary" data-action="resume-intervention">Show suggestion again</button>
      <button class="pm-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionPrecisionAction(data) {
  const item = data.intervention;
  const phase = item.phase || 'prompt';
  const phaseContent = phase === 'active'
    ? activeView(item)
    : phase === 'completed'
      ? completedView(item)
      : phase === 'dismissed'
        ? dismissedView(item)
        : promptView(item);

  return `
    <section class="pm-intervention pm-intervention-action" aria-label="${esc(`Intervention state ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      <div class="pm-intervention-meta">
        <span>NUDGE / INTERVENTION</span>
        <span>${phaseLabel(phase)} / ${item.minutes} MIN / ${esc(item.app).toUpperCase()}</span>
      </div>
      ${phaseContent}
    </section>`;
}
