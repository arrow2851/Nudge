import { esc } from '../utils.js';

function phaseLabel(phase) {
  return {
    prompt: 'READY IF USEFUL',
    active: 'IN MOTION',
    completed: 'MOVED FORWARD',
    dismissed: 'KEPT SCROLLING'
  }[phase] || 'READY IF USEFUL';
}

function suggestionPosition(item) {
  const total = Math.max(1, item.suggestions?.length || 1);
  return `${(item.suggestionIndex || 0) + 1} of ${total}`;
}

function contextBlocks(item, phase) {
  return `
    <div class="pl-intervention-context" aria-label="Suggestion details">
      <div><span>FROM</span><strong>${esc(item.app)}</strong></div>
      <div><span>PAUSE</span><strong>${item.minutes} min</strong></div>
      <div><span>ACTION</span><strong>${item.duration} min</strong></div>
      <div><span>STATE</span><strong>${phaseLabel(phase)}</strong></div>
    </div>`;
}

function promptView(item) {
  return `
    <div class="pl-intervention-main">
      <div class="pl-intervention-orbit prompt" aria-hidden="true"><span></span><b>↗</b></div>
      <span class="pl-chip">A FRIENDLY PAUSE</span>
      <h1>Try one small switch?</h1>
      <p>You have been in ${esc(item.app)} for ${item.minutes} minutes. This option is here if it helps; staying where you are is equally valid.</p>
      <article class="pl-intervention-choice prompt" aria-labelledby="pl-intervention-choice-title">
        <div class="pl-intervention-choice-top"><span>OPTION ${suggestionPosition(item)}</span><b>${item.duration} MIN</b></div>
        <div class="pl-intervention-choice-icon" aria-hidden="true">✦</div>
        <h2 id="pl-intervention-choice-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${contextBlocks(item, 'prompt')}
      <p class="pl-intervention-boundary">No timer, score, streak, reward, or penalty is created.</p>
    </div>
    <div class="pl-intervention-actions">
      <button class="pl-primary" data-action="start-intervention">Start this small action</button>
      <button class="pl-secondary" data-action="next-intervention">Show another option</button>
      <button class="pl-dismiss" data-action="dismiss-intervention">Keep scrolling for now</button>
    </div>`;
}

function activeView(item) {
  return `
    <div class="pl-intervention-main">
      <div class="pl-intervention-orbit active" aria-hidden="true"><span></span><b>→</b></div>
      <span class="pl-chip">ACTION OPEN</span>
      <h1>One small thing is in motion.</h1>
      <p>Nudge remembers the action state only inside this prototype. Nothing is timed, monitored, blocked, or added to your production Tasks.</p>
      <article class="pl-intervention-choice active" aria-labelledby="pl-active-choice-title">
        <div class="pl-intervention-choice-top"><span>${esc(item.startedLabel || 'STARTED NOW')}</span><b>${item.duration} MIN</b></div>
        <div class="pl-intervention-choice-icon" aria-hidden="true">→</div>
        <h2 id="pl-active-choice-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${contextBlocks(item, 'active')}
      <p class="pl-intervention-boundary">There is no countdown and no requirement to finish.</p>
    </div>
    <div class="pl-intervention-actions">
      <button class="pl-primary" data-action="complete-intervention">Mark this complete</button>
      <button class="pl-secondary" data-action="undo-intervention">Undo start</button>
      <button class="pl-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function completedView(item) {
  return `
    <div class="pl-intervention-main">
      <div class="pl-intervention-orbit completed" aria-hidden="true"><span></span><b>✓</b></div>
      <span class="pl-chip">SMALL ACTION COMPLETE</span>
      <h1>That moved forward.</h1>
      <p>The completion belongs only to this intervention prototype. It did not change a recurring routine or your Tasks checklist.</p>
      <article class="pl-intervention-choice completed" aria-labelledby="pl-completed-choice-title">
        <div class="pl-intervention-choice-top"><span>${esc(item.completedLabel || 'COMPLETED')}</span><b>DONE</b></div>
        <div class="pl-intervention-choice-icon" aria-hidden="true">✓</div>
        <h2 id="pl-completed-choice-title">${esc(item.task)}</h2>
        <p>${esc(item.location)}</p>
      </article>
      ${contextBlocks(item, 'completed')}
      <p class="pl-intervention-boundary">No points, streak, ranking, or performance score was added.</p>
    </div>
    <div class="pl-intervention-actions">
      <button class="pl-secondary" data-action="reopen-intervention">Reopen this action</button>
      <button class="pl-secondary" data-action="undo-intervention">Undo start</button>
      <button class="pl-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

function dismissedView(item) {
  return `
    <div class="pl-intervention-main">
      <div class="pl-intervention-orbit dismissed" aria-hidden="true"><span></span><b>•</b></div>
      <span class="pl-chip">PAUSE CLOSED</span>
      <h1>Keep scrolling. Nothing changed.</h1>
      <p>No action was started. No task, reminder, follow-up, penalty, or missed-opportunity state was created.</p>
      <article class="pl-intervention-choice dismissed" role="status">
        <div class="pl-intervention-choice-top"><span>NO CHANGE</span><b>OPTIONAL</b></div>
        <div class="pl-intervention-choice-icon" aria-hidden="true">•</div>
        <h2>${esc(item.app)} stays outside Nudge.</h2>
        <p>The suggestion remains available only if you choose to reopen it.</p>
      </article>
      ${contextBlocks(item, 'dismissed')}
      <p class="pl-intervention-boundary">Choosing not now is a complete and valid response.</p>
    </div>
    <div class="pl-intervention-actions">
      <button class="pl-secondary" data-action="resume-intervention">Show the suggestion again</button>
      <button class="pl-dismiss" data-action="return-today">Return to Today</button>
    </div>`;
}

export function renderInterventionPlayfulAction(data) {
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
    <section class="pl-intervention pl-intervention-action ${esc(phase)}" aria-label="${esc(`Intervention state ${phaseLabel(phase)} after ${item.minutes} minutes in ${item.app}`)}">
      <div class="pl-intervention-statusline">
        <span>NUDGE / OPTIONAL SWITCH</span>
        <strong>${phaseLabel(phase)}</strong>
      </div>
      ${phaseContent}
    </section>`;
}
