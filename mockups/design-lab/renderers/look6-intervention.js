import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'AVAILABLE CARD',
    active: 'CARD IN HAND',
    completed: 'FILED COMPLETE',
    dismissed: 'RETURNED TO TRAY'
  }[phase] || 'AVAILABLE CARD';
}

function positionLabel(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${(item.suggestionIndex || 0) + 1} of ${total}`;
}

function cardFacts(item, phase) {
  return `
    <dl class="th-intervention-facts">
      <div><dt>Source app</dt><dd>${esc(item.app)}</dd></div>
      <div><dt>Fixture pause</dt><dd>${item.minutes} min</dd></div>
      <div><dt>Action estimate</dt><dd>${item.duration} min</dd></div>
      <div><dt>Card</dt><dd>${positionLabel(item)}</dd></div>
      <div><dt>State</dt><dd>${phaseLabel(phase)}</dd></div>
    </dl>`;
}

function promptView(item) {
  return `
    <div class="th-intervention-content">
      <div class="th-intervention-board-label"><span class="th-drawer-pull" aria-hidden="true"></span><strong>OPTIONAL ACTION TRAY</strong><b>${phaseLabel('prompt')}</b></div>
      <header class="th-intervention-heading">
        <span class="th-label">A USEFUL CARD, IF WANTED</span>
        <h1>Pick up one small action?</h1>
        <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. Keep using it or pick up this card. Either choice is complete.</p>
      </header>
      <article class="th-intervention-card prompt" aria-labelledby="th-intervention-title">
        <span class="th-paperclip" aria-hidden="true"></span>
        <div class="th-intervention-card-head"><span>CARD ${positionLabel(item)}</span><b>${item.duration} MIN</b></div>
        <span class="th-tab">READY WHEN USEFUL</span>
        <h2 id="th-intervention-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${cardFacts(item, 'prompt')}
      <p class="th-intervention-boundary">No timer, score, service grade, reminder, or requirement is created.</p>
    </div>
    <div class="th-intervention-actions">
      <button class="th-primary" data-action="start-intervention">Pick up this action card</button>
      <button class="th-secondary" data-action="next-intervention">Pull another card</button>
      <button class="th-dismiss" data-action="dismiss-intervention">Leave the card in the tray</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="th-intervention-content">
      <div class="th-intervention-board-label"><span class="th-drawer-pull" aria-hidden="true"></span><strong>OPTIONAL ACTION TRAY</strong><b>${phaseLabel('active')}</b></div>
      <header class="th-intervention-heading">
        <span class="th-label">ACTION CARD OPEN</span>
        <h1>The card is in hand.</h1>
        <p>This prototype remembers the selected card only. Nothing is timed, monitored, blocked, or added to production Tasks.</p>
      </header>
      <article class="th-intervention-card active" aria-labelledby="th-active-title">
        <span class="th-paperclip" aria-hidden="true"></span>
        <div class="th-intervention-card-head"><span>${esc(item.startedLabel || 'STARTED NOW')}</span><b>OPEN</b></div>
        <span class="th-tab">IN HAND</span>
        <h2 id="th-active-title">${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      ${cardFacts(item, 'active')}
      <p class="th-intervention-boundary">There is no countdown and no requirement to finish the card.</p>
    </div>
    <div class="th-intervention-actions">
      <button class="th-primary" data-action="complete-intervention">File this card complete</button>
      <button class="th-secondary" data-action="undo-intervention">Return card to available</button>
      <button class="th-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="th-intervention-content">
      <div class="th-intervention-board-label"><span class="th-drawer-pull" aria-hidden="true"></span><strong>OPTIONAL ACTION TRAY</strong><b>${phaseLabel('completed')}</b></div>
      <header class="th-intervention-heading">
        <span class="th-label">CARD FILED</span>
        <h1>One small action is complete.</h1>
        <p>This completion belongs only to the intervention prototype. Recurring routines and the Tasks checklist remain unchanged.</p>
      </header>
      <article class="th-intervention-card completed" aria-labelledby="th-completed-title">
        <span class="th-paperclip" aria-hidden="true"></span>
        <div class="th-intervention-card-head"><span>${esc(item.completedLabel || 'COMPLETED')}</span><b>✓ FILED</b></div>
        <span class="th-tab">COMPLETE</span>
        <h2 id="th-completed-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
        <div class="th-completion-slip" role="status"><strong>Filed complete</strong><span>No score or service rating added</span></div>
      </article>
      ${cardFacts(item, 'completed')}
      <p class="th-intervention-boundary">No points, streak, ranking, grade, or performance measure was added.</p>
    </div>
    <div class="th-intervention-actions">
      <button class="th-secondary" data-action="reopen-intervention">Take this card back out</button>
      <button class="th-secondary" data-action="undo-intervention">Undo card start</button>
      <button class="th-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="th-intervention-content">
      <div class="th-intervention-board-label"><span class="th-drawer-pull" aria-hidden="true"></span><strong>OPTIONAL ACTION TRAY</strong><b>${phaseLabel('dismissed')}</b></div>
      <header class="th-intervention-heading">
        <span class="th-label">CARD LEFT IN TRAY</span>
        <h1>Keep using the current app.</h1>
        <p>No action was started. No Task, reminder, follow-up, penalty, service note, or missed-opportunity state was created.</p>
      </header>
      <article class="th-intervention-card dismissed" role="status">
        <span class="th-drawer-pull th-card-pull" aria-hidden="true"></span>
        <div class="th-intervention-card-head"><span>NO CHANGE</span><b>VALID CHOICE</b></div>
        <span class="th-tab">BACK IN TRAY</span>
        <h2>${esc(item.app)} continues outside Nudge.</h2>
        <p>Pull the suggestion card out again only when it would be useful.</p>
      </article>
      ${cardFacts(item, 'dismissed')}
      <p class="th-intervention-boundary">Leaving the card in the tray is a complete response. Nothing is owed.</p>
    </div>
    <div class="th-intervention-actions">
      <button class="th-secondary" data-action="resume-intervention">Pull the suggestion card again</button>
      <button class="th-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionTactileAction(data) {
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
    <section class="th-intervention th-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      ${content}
    </section>`;
}
