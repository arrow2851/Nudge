import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'AVAILABLE',
    active: 'ACTIVE',
    completed: 'COMPLETE',
    dismissed: 'SET ASIDE'
  }[phase] || 'AVAILABLE';
}

function optionPosition(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${String((item.suggestionIndex || 0) + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function systemFacts(item, phase) {
  return `
    <dl class="rd-intervention-facts" aria-label="Optional action record">
      <div><dt>SOURCE APP</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>FIXTURE SNAPSHOT</dt><dd>${String(item.minutes).padStart(2, '0')} MIN</dd></div>
      <div><dt>ACTION ESTIMATE</dt><dd>${String(item.duration).padStart(2, '0')} MIN</dd></div>
      <div><dt>OPTION</dt><dd>${optionPosition(item)}</dd></div>
      <div><dt>STATE</dt><dd>${phaseLabel(phase)}</dd></div>
    </dl>`;
}

function actionRecord(item, phase, recordLabel, marker) {
  const titleId = `rd-intervention-${phase}-title`;
  return `
    <article class="rd-intervention-record ${phase}" aria-labelledby="${titleId}">
      <div class="rd-intervention-record-head"><span>${esc(recordLabel)}</span><b>${marker}</b></div>
      <span class="rd-intervention-record-id">ACTION // ${optionPosition(item)}</span>
      <h2 id="${titleId}">${esc(item.task)}</h2>
      <p>${esc(item.location)} // EST. ${item.duration} MIN</p>
    </article>`;
}

function promptView(item) {
  return `
    <div class="rd-intervention-main">
      <header class="rd-intervention-heading">
        <span>NUDGE OS / OPTIONAL SWITCH</span>
        <h1>ACTION AVAILABLE</h1>
        <p>You can continue using ${esc(item.app)} or open this action. Both choices are valid.</p>
      </header>
      <div class="rd-intervention-snapshot" aria-label="Fixture snapshot, not live monitoring">
        <span>FIXTURE SNAPSHOT</span>
        <strong>${String(item.minutes).padStart(2, '0')}</strong>
        <small>MIN IN ${esc(item.app).toUpperCase()} // NOT A LIVE TIMER</small>
      </div>
      ${actionRecord(item, 'prompt', 'OPTIONAL ACTION', 'READY')}
      ${systemFacts(item, 'prompt')}
      <p class="rd-intervention-boundary">NO MONITORING // NO BLOCKING // NO SCORE // NO PENALTY</p>
    </div>
    <div class="rd-intervention-actions">
      <button class="rd-primary" data-action="start-intervention">OPEN ACTION</button>
      <button class="rd-secondary" data-action="next-intervention">SHOW ALTERNATE</button>
      <button class="rd-dismiss" data-action="dismiss-intervention">CONTINUE CURRENT APP</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="rd-intervention-main">
      <header class="rd-intervention-heading">
        <span>NUDGE OS / ACTION ACTIVE</span>
        <h1>ACTION OPEN</h1>
        <p>The prototype stores this action state only. It does not time activity, inspect another app, send notifications, or create a production Task.</p>
      </header>
      ${actionRecord(item, 'active', item.startedLabel || 'STARTED NOW', 'ACTIVE')}
      ${systemFacts(item, 'active')}
      <p class="rd-intervention-boundary">NO COUNTDOWN // COMPLETION OPTIONAL // RETURN AVAILABLE</p>
    </div>
    <div class="rd-intervention-actions">
      <button class="rd-primary" data-action="complete-intervention">MARK COMPLETE</button>
      <button class="rd-secondary" data-action="undo-intervention">UNDO START</button>
      <button class="rd-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="rd-intervention-main">
      <header class="rd-intervention-heading">
        <span>NUDGE OS / ACTION COMPLETE</span>
        <h1>RECORD COMPLETE</h1>
        <p>This completion belongs only to the intervention prototype. Recurring routines and Tasks remain unchanged.</p>
      </header>
      ${actionRecord(item, 'completed', item.completedLabel || 'COMPLETED', '[✓] COMPLETE')}
      ${systemFacts(item, 'completed')}
      <p class="rd-intervention-boundary">NO POINTS // NO STREAK // NO RANKING // NO PERFORMANCE SCORE</p>
    </div>
    <div class="rd-intervention-actions">
      <button class="rd-secondary" data-action="reopen-intervention">REOPEN ACTION</button>
      <button class="rd-secondary" data-action="undo-intervention">UNDO START</button>
      <button class="rd-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="rd-intervention-main">
      <header class="rd-intervention-heading">
        <span>NUDGE OS / ACTION SET ASIDE</span>
        <h1>SESSION CONTINUES</h1>
        <p>No action was started. No Task, reminder, follow-up, penalty, overdue state, or missed-opportunity state was created.</p>
      </header>
      <article class="rd-intervention-record dismissed" role="status">
        <div class="rd-intervention-record-head"><span>NO CHANGE</span><b>VALID CHOICE</b></div>
        <span class="rd-intervention-record-id">CURRENT APP // CONTINUES</span>
        <h2>${esc(item.app)} remains outside Nudge.</h2>
        <p>Restore the suggestion only when it would be useful.</p>
      </article>
      ${systemFacts(item, 'dismissed')}
      <p class="rd-intervention-boundary">SET ASIDE IS A COMPLETE RESPONSE // NOTHING IS OWED</p>
    </div>
    <div class="rd-intervention-actions">
      <button class="rd-secondary" data-action="resume-intervention">RESTORE SUGGESTION</button>
      <button class="rd-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

export function renderInterventionRetroAction(data) {
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
    <section class="rd-intervention rd-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention ${phaseLabel(phase)} after ${item.minutes} fixture minutes in ${item.app}`)}">
      <div class="rd-intervention-statusline" aria-hidden="true">
        <span>NUDGE OS // OPTIONAL ACTION</span>
        <strong>${phaseLabel(phase)}</strong>
      </div>
      ${content}
    </section>`;
}
