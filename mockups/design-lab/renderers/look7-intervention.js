import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'AVAILABLE',
    active: 'ACTIVE',
    completed: 'COMPLETE',
    dismissed: 'DISMISSED'
  }[phase] || 'AVAILABLE';
}

function positionLabel(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${String((item.suggestionIndex || 0) + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

function factGrid(item, phase) {
  return `
    <dl class="bu-intervention-facts">
      <div><dt>SOURCE APP</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>FIXTURE PAUSE</dt><dd>${item.minutes} MIN</dd></div>
      <div><dt>ACTION EST.</dt><dd>${item.duration} MIN</dd></div>
      <div><dt>OPTION</dt><dd>${positionLabel(item)}</dd></div>
      <div><dt>STATE</dt><dd>${phaseLabel(phase)}</dd></div>
    </dl>`;
}

function promptView(item) {
  return `
    <div class="bu-intervention-content">
      <header class="bu-intervention-heading">
        <span>NUDGE / OPTIONAL SWITCH</span>
        <h1>CHOOSE THE<br>NEXT SCREEN.</h1>
        <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Continue there or use this option. Both choices are valid.</p>
      </header>
      <article class="bu-intervention-card prompt" aria-labelledby="bu-intervention-title">
        <div class="bu-intervention-band"><span>OPTION ${positionLabel(item)}</span><b>${item.duration} MIN</b></div>
        <h2 id="bu-intervention-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${factGrid(item, 'prompt')}
      <p class="bu-intervention-boundary">NO SCORE. NO PENALTY. NO REQUIREMENT TO SWITCH.</p>
    </div>
    <div class="bu-intervention-actions">
      <button class="bu-primary" data-action="start-intervention">START THIS ACTION</button>
      <button class="bu-secondary" data-action="next-intervention">SHOW ANOTHER OPTION</button>
      <button class="bu-dismiss" data-action="dismiss-intervention">CONTINUE CURRENT APP</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="bu-intervention-content">
      <header class="bu-intervention-heading">
        <span>NUDGE / ACTION ACTIVE</span>
        <h1>ACTION<br>OPEN.</h1>
        <p>This prototype remembers the selected action. It does not start a timer, monitor activity, block an app, or add a production Task.</p>
      </header>
      <article class="bu-intervention-card active" aria-labelledby="bu-active-title">
        <div class="bu-intervention-band"><span>${esc(item.startedLabel || 'STARTED NOW')}</span><b>ACTIVE</b></div>
        <h2 id="bu-active-title">${esc(item.task)}</h2>
        <p>${esc(item.location)} / EST. ${item.duration} MIN</p>
      </article>
      ${factGrid(item, 'active')}
      <p class="bu-intervention-boundary">NO COUNTDOWN. COMPLETION REMAINS OPTIONAL.</p>
    </div>
    <div class="bu-intervention-actions">
      <button class="bu-primary" data-action="complete-intervention">MARK ACTION COMPLETE</button>
      <button class="bu-secondary" data-action="undo-intervention">UNDO START</button>
      <button class="bu-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="bu-intervention-content">
      <header class="bu-intervention-heading">
        <span>NUDGE / ACTION COMPLETE</span>
        <h1>ONE ACTION<br>COMPLETE.</h1>
        <p>The result belongs only to this intervention prototype. It did not alter a recurring routine or your Tasks checklist.</p>
      </header>
      <article class="bu-intervention-card completed" aria-labelledby="bu-completed-title">
        <div class="bu-intervention-band"><span>${esc(item.completedLabel || 'COMPLETED')}</span><b>✓ COMPLETE</b></div>
        <h2 id="bu-completed-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${factGrid(item, 'completed')}
      <p class="bu-intervention-boundary">NO POINTS, STREAKS, RANKING, OR PERFORMANCE SCORE.</p>
    </div>
    <div class="bu-intervention-actions">
      <button class="bu-secondary" data-action="reopen-intervention">REOPEN ACTION</button>
      <button class="bu-secondary" data-action="undo-intervention">UNDO START</button>
      <button class="bu-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="bu-intervention-content">
      <header class="bu-intervention-heading">
        <span>NUDGE / SWITCH DISMISSED</span>
        <h1>CURRENT APP<br>CONTINUES.</h1>
        <p>No action was started. No Task, reminder, follow-up, penalty, warning, or missed-opportunity state was created.</p>
      </header>
      <article class="bu-intervention-card dismissed" role="status">
        <div class="bu-intervention-band"><span>NO CHANGE</span><b>VALID CHOICE</b></div>
        <h2>${esc(item.app)} remains outside Nudge.</h2>
        <p>Reopen the suggestion only when it would be useful.</p>
      </article>
      ${factGrid(item, 'dismissed')}
      <p class="bu-intervention-boundary">DISMISSAL IS A COMPLETE RESPONSE, NOT A FAILED ACTION.</p>
    </div>
    <div class="bu-intervention-actions">
      <button class="bu-secondary" data-action="resume-intervention">SHOW SUGGESTION AGAIN</button>
      <button class="bu-dismiss" data-action="return-today">RETURN TO TODAY</button>
    </div>`;
}

export function renderInterventionBoldAction(data) {
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
    <section class="bu-intervention bu-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      <div class="bu-intervention-marquee" aria-hidden="true">OPTIONAL SWITCH / ${phaseLabel(phase)} / ${esc(item.app).toUpperCase()} / ${item.minutes} MIN</div>
      ${content}
    </section>`;
}
