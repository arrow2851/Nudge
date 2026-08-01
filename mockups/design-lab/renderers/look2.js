import { attentionCount, dueLabel, esc, nextRoutine, statusFor } from '../utils.js';

function dueStamp(item) {
  return `<span class="due-stamp ${item.status}">${dueLabel(item.status)}</span>`;
}

export function renderAreasEditorial(data) {
  if (!data.areas.length) {
    return `
      <header class="editorial-header">
        <div class="kicker">Nudge · Areas</div>
        <h1>Make the place yours.</h1>
        <p>Begin with one space. You can add its recurring care a little at a time.</p>
      </header>
      <div class="header-line"></div>
      <section class="coming-soon">
        <div class="poster">
          <div class="section-label">A blank beginning</div>
          <h1>No areas yet</h1>
          <p>Add Home, Car, Personal, Work, or a place that makes sense only to you.</p>
          <button class="primary-action" data-action="demo-add-area">Add your first area</button>
        </div>
      </section>`;
  }

  const attention = data.areas.reduce((sum, area) => sum + attentionCount(area), 0);
  const affected = data.areas.filter(area => attentionCount(area)).length;
  return `
    <header class="editorial-header">
      <div class="kicker">Nudge · Areas</div>
      <h1>The places you care for.</h1>
      <p>Recurring chores and maintenance, organized by where they belong.</p>
    </header>
    <div class="header-line"></div>
    <section class="attention-note">
      <strong>${attention ? `${attention} routines need attention.` : 'Everything important is current.'}</strong>
      <p>${attention
        ? `They are spread across ${affected} ${affected === 1 ? 'area' : 'areas'}. Start wherever feels easiest.`
        : 'As-needed routines remain available without creating urgency.'}</p>
    </section>
    <section class="area-index">
      <div class="area-index-heading">
        <span class="section-label">Your areas</span>
        <span>${data.areas.length} places</span>
      </div>
      ${data.areas.map(area => {
        const status = statusFor(area);
        const next = nextRoutine(area);
        return `
          <article class="area-entry ${status.className}">
            <button data-area-id="${esc(area.id)}">
              <span>
                <span class="area-name"><strong>${esc(area.name)}</strong><i></i></span>
                <span class="area-meta">${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ' · standalone area'}</span>
                <span class="area-next">${next ? `${status.label} · ${esc(next.title)}` : 'No routines configured'}</span>
              </span>
              <span class="area-count">${status.count}</span>
            </button>
          </article>`;
      }).join('')}
    </section>
    <button class="add-area" data-action="demo-add-area">+ Add another area</button>`;
}

export function renderAreaDetail(data, requestedAreaId, renderUnsupported) {
  const area = data.areas.find(item => item.id === requestedAreaId);
  if (!area) return renderUnsupported('That area does not exist in this scenario.');

  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const sectionNames = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sectionNames.includes(area.unconfigured)) sectionNames.push(area.unconfigured);

  const rows = items => items.map(item => `
    <div class="routine-row">
      <button class="editorial-check" data-action="complete-demo" aria-label="Complete ${esc(item.title)}"></button>
      <span class="routine-copy"><strong>${esc(item.title)}</strong><small>${esc(item.section || area.name)} · ${esc(item.repeat)} · ${item.minutes} min</small></span>
      ${dueStamp(item)}
    </div>`).join('');

  return `
    <div class="back-row"><button class="back-button" data-action="back-areas">← All areas</button></div>
    <header class="area-detail-intro">
      <div class="section-label">Area overview</div>
      <h1>${esc(area.name)}</h1>
      <p>${attention.length ? `${attention.length} need attention` : 'Up to date'} · ${area.routines.length} recurring routines</p>
    </header>
    <section class="routine-group">
      <div class="routine-group-header"><h2>Needs attention</h2><span>${attention.length}</span></div>
      ${attention.length ? rows(attention) : '<p class="quiet-copy">Nothing is pressing here. Browse a section or use an as-needed routine.</p>'}
    </section>
    <section class="routine-group">
      <div class="routine-group-header"><h2>Sections</h2><span>${sectionNames.length}</span></div>
      ${sectionNames.map(name => {
        const count = area.routines.filter(item => item.section === name).length;
        return `<button class="section-link" data-action="section-demo"><span><strong>${esc(name)}</strong><br><small>${count ? `${count} routines` : 'Not configured · Tap to begin'}</small></span><span>→</span></button>`;
      }).join('') || '<button class="section-link" data-action="section-demo"><span><strong>General</strong><br><small>Standalone routines</small></span><span>→</span></button>'}
    </section>
    <section class="routine-group">
      <div class="routine-group-header"><h2>Coming later</h2><span>${later.length}</span></div>
      ${rows(later)}
    </section>`;
}

export function renderInterventionEditorial(data) {
  const item = data.intervention;
  return `
    <section class="intervention-screen">
      <div class="intervention-top"><span class="intervention-kicker">A useful pause</span><span>${item.minutes} min on ${esc(item.app)}</span></div>
      <div class="intervention-rule"></div>
      <h1>You have been here for a little while.</h1>
      <p class="lead">No judgment. This may be a good moment to step away and finish one small thing.</p>
      <article class="suggestion-card">
        <div class="section-label">Suggested now</div>
        <h2>${esc(item.task)}</h2>
        <p>${esc(item.location)} · about ${item.duration} minutes</p>
      </article>
      <div class="intervention-actions">
        <button class="primary-action" data-action="start-demo">Start this</button>
        <button class="secondary-action" data-action="different-demo">Choose something else</button>
        <button class="text-action" data-action="not-now-demo">Not now</button>
      </div>
    </section>`;
}
