const DESIGN_LAB = Object.freeze({
  version: '0.2.0',
  buildDate: '2026-08-01',
  branch: 'feature/design-lab',
  storageKey: 'nudge-design-lab-review-v1'
});

const looks = Object.freeze([
  { id: 2, name: 'Warm Editorial', status: 'Active audition', description: 'A calm household journal with practical utility underneath.' },
  { id: 3, name: 'Precision Minimal', status: 'Next audition', description: 'Strict alignment, dense information, and a single sharp accent.' },
  { id: 4, name: 'Zen Focus', status: 'Planned', description: 'Quiet screens that reveal one useful action at a time.' },
  { id: 6, name: 'Tactile Household', status: 'Planned', description: 'Physical labels, controls, and satisfying household-tool cues.' }
]);

const clone = value => JSON.parse(JSON.stringify(value));
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const baseAreas = Object.freeze([
  {
    id: 'kitchen', name: 'Kitchen', sections: 4,
    routines: [
      { title: 'Wipe stovetop', section: 'Countertops & Surfaces', repeat: 'Every 3 days', minutes: 6, status: 'overdue' },
      { title: 'Descale kettle', section: 'Appliances', repeat: 'Every 6 weeks', minutes: 15, status: 'today' },
      { title: 'Sweep floor', section: 'Floor', repeat: 'As needed', minutes: 8, status: 'as-needed' },
      { title: 'Check pantry dates', section: 'Cabinets & Storage', repeat: 'Monthly', minutes: 15, status: 'upcoming' }
    ]
  },
  {
    id: 'bathroom', name: 'Bathroom', sections: 3,
    routines: [
      { title: 'Clean bathroom mirror', section: 'Sink & Counter', repeat: 'Weekly', minutes: 5, status: 'upcoming' },
      { title: 'Clean tub and shower', section: 'Tub & Shower', repeat: 'Every 2 weeks', minutes: 25, status: 'upcoming' }
    ]
  },
  {
    id: 'living-room', name: 'Living Room', sections: 3,
    routines: [
      { title: 'Water houseplants', section: 'Tidying', repeat: 'Weekly', minutes: 8, status: 'today' },
      { title: 'Vacuum sofa', section: 'Upholstery', repeat: 'Monthly', minutes: 15, status: 'upcoming' }
    ]
  },
  {
    id: 'bedroom', name: 'Bedroom', sections: 2,
    routines: [
      { title: 'Return loose clothes', section: 'Closet', repeat: 'As needed', minutes: 6, status: 'as-needed' }
    ],
    unconfigured: 'Bed & Surfaces'
  },
  {
    id: 'car', name: 'Car', sections: 0,
    routines: [
      { title: 'Check tire pressure', section: '', repeat: 'Monthly', minutes: 8, status: 'upcoming' },
      { title: 'Clear trash from car', section: '', repeat: 'As needed', minutes: 5, status: 'as-needed' }
    ]
  }
]);

function buildLargeHousehold() {
  const areas = clone(baseAreas);
  areas.push(
    {
      id: 'laundry-utility', name: 'Laundry & Utility Room', sections: 6,
      routines: [
        { title: 'Move clothes to dryer', section: 'Laundry', repeat: 'As needed', minutes: 3, status: 'today' },
        { title: 'Clean dryer lint housing', section: 'Appliances', repeat: 'Monthly', minutes: 12, status: 'upcoming' },
        { title: 'Check detergent and cleaning supplies', section: 'Storage', repeat: 'Every 2 weeks', minutes: 6, status: 'upcoming' },
        { title: 'Wipe washer and dryer surfaces', section: 'Surfaces', repeat: 'Weekly', minutes: 7, status: 'overdue' },
        { title: 'Sweep utility-room floor', section: 'Floor', repeat: 'Weekly', minutes: 8, status: 'upcoming' }
      ]
    },
    {
      id: 'work', name: 'Work', sections: 5,
      routines: [
        { title: 'Clear downloads and temporary working files', section: 'Digital Workspace', repeat: 'Weekly', minutes: 10, status: 'today' },
        { title: 'Review follow-ups from the previous workday', section: 'Planning', repeat: 'Weekdays', minutes: 8, status: 'upcoming' },
        { title: 'Reset desk surface and charging area', section: 'Desk', repeat: 'Weekly', minutes: 7, status: 'as-needed' }
      ]
    },
    {
      id: 'personal', name: 'Personal', sections: 4,
      routines: [
        { title: 'Refill weekly medication organizer', section: 'Health', repeat: 'Weekly', minutes: 8, status: 'upcoming' },
        { title: 'Back up important personal documents', section: 'Administration', repeat: 'Monthly', minutes: 12, status: 'upcoming' }
      ]
    },
    {
      id: 'patio-entry', name: 'Patio, Balcony & Entryway', sections: 7,
      routines: [
        { title: 'Sweep entryway and shake out mats', section: 'Entryway', repeat: 'Weekly', minutes: 10, status: 'overdue' },
        { title: 'Water outdoor plants', section: 'Plants', repeat: 'Every 3 days', minutes: 12, status: 'today' },
        { title: 'Wipe outdoor table and chair arms', section: 'Furniture', repeat: 'As needed', minutes: 8, status: 'as-needed' }
      ]
    }
  );
  return areas;
}

function buildLongContent() {
  const areas = clone(baseAreas);
  areas[0].name = 'Kitchen, Breakfast Nook & Shared Food Preparation Space';
  areas[0].sections = 9;
  areas[0].routines.unshift({
    title: 'Remove everything from the primary food-preparation counter, clean underneath it, and return only the items used every day',
    section: 'Countertops, Small Appliances & Frequently Used Preparation Surfaces',
    repeat: 'Every 2 weeks',
    minutes: 24,
    status: 'overdue'
  });
  areas[0].routines.push(
    { title: 'Clean the refrigerator door seals and the narrow channels where crumbs and moisture collect', section: 'Refrigerator & Freezer', repeat: 'Monthly', minutes: 18, status: 'upcoming' },
    { title: 'Review rarely used pantry ingredients before the next grocery order and move soon-to-expire items forward', section: 'Pantry, Dry Goods & Household Food Storage', repeat: 'Monthly', minutes: 20, status: 'upcoming' },
    { title: 'Wash reusable grocery bags and return them to the place where they are most likely to be remembered', section: 'Reusable Bags & Shopping Supplies', repeat: 'Monthly', minutes: 15, status: 'as-needed' },
    { title: 'Deep-clean the narrow space between the refrigerator, wall, and neighboring cabinet', section: 'Hidden Gaps & Hard-to-Reach Areas', repeat: 'Every 3 months', minutes: 30, status: 'upcoming' }
  );
  areas.push({
    id: 'work-personal-admin',
    name: 'Work, Study & Personal Administration',
    sections: 8,
    routines: [
      { title: 'Review unresolved messages that require a decision rather than a quick acknowledgment', section: 'Communication & Follow-up', repeat: 'Weekdays', minutes: 12, status: 'today' },
      { title: 'Archive completed project material without deleting anything that may be needed for compliance or future reference', section: 'Files, Records & Reference Material', repeat: 'Monthly', minutes: 20, status: 'upcoming' }
    ]
  });
  return areas;
}

const scenarios = Object.freeze({
  normal: {
    label: 'Normal day',
    purpose: 'Tests everyday hierarchy with a small, believable amount of attention.',
    expected: '3 routines need attention across 2 areas.',
    areas: clone(baseAreas),
    intervention: { app: 'Instagram', minutes: 7, task: 'Wipe the stovetop', location: 'Kitchen', duration: 6 }
  },
  backlog: {
    label: 'Heavy backlog',
    purpose: 'Tests urgency, scanning, and emotional pressure when several areas are behind.',
    expected: '7 routines need attention across 4 areas.',
    areas: (() => {
      const areas = clone(baseAreas);
      areas[0].routines.push({ title: 'Mop kitchen floor', section: 'Floor', repeat: 'Weekly', minutes: 15, status: 'overdue' });
      areas[1].routines.unshift({ title: 'Empty bathroom bin', section: 'Sink & Counter', repeat: 'Weekly', minutes: 4, status: 'overdue' });
      areas[1].routines.push({ title: 'Mop bathroom floor', section: 'Floor', repeat: 'Weekly', minutes: 12, status: 'today' });
      areas[3].routines.push({ title: 'Change bedding', section: 'Bed & Surfaces', repeat: 'Weekly', minutes: 10, status: 'overdue' });
      return areas;
    })(),
    intervention: { app: 'YouTube', minutes: 18, task: 'Empty the bathroom bin', location: 'Bathroom', duration: 4 }
  },
  new: {
    label: 'New user',
    purpose: 'Tests onboarding, empty-state tone, and whether the first action is obvious.',
    expected: 'No areas and no configured routines.',
    areas: [],
    intervention: { app: 'Reddit', minutes: 5, task: 'Add your first useful action', location: 'Nudge setup', duration: 2 }
  },
  clear: {
    label: 'All clear',
    purpose: 'Tests whether the product still feels useful when nothing is urgent.',
    expected: 'No overdue or due-today routines.',
    areas: clone(baseAreas).map(area => ({
      ...area,
      routines: area.routines.map(routine => ({
        ...routine,
        status: routine.status === 'as-needed' ? 'as-needed' : 'upcoming'
      }))
    })),
    intervention: { app: 'Instagram', minutes: 6, task: 'Choose a small task for later', location: 'Nothing urgent', duration: 2 }
  },
  large: {
    label: 'Large household',
    purpose: 'Tests many areas, many sections, non-household content, and long scrolling.',
    expected: '9 areas including Work and Personal, with 8 routines needing attention.',
    areas: buildLargeHousehold(),
    intervention: { app: 'Instagram', minutes: 11, task: 'Clear temporary working files', location: 'Work · Digital Workspace', duration: 10 }
  },
  long: {
    label: 'Long content',
    purpose: 'Tests wrapping, truncation, dense section names, and unusually descriptive routines.',
    expected: 'Long area, section, chore, and intervention labels without lost actions.',
    areas: buildLongContent(),
    intervention: {
      app: 'YouTube',
      minutes: 14,
      task: 'Review unresolved messages that require a decision rather than a quick acknowledgment',
      location: 'Work, Study & Personal Administration · Communication & Follow-up',
      duration: 12
    }
  },
  'large-text': {
    label: 'Large text',
    purpose: 'Tests content at an enlarged interface text scale.',
    expected: 'Critical labels and actions remain visible at approximately 125% text scale.',
    textScale: 'large',
    areas: clone(baseAreas),
    intervention: { app: 'Instagram', minutes: 7, task: 'Wipe the stovetop', location: 'Kitchen', duration: 6 }
  }
});

const allowedViews = new Set(['areas', 'area', 'intervention']);

function initialState() {
  const params = new URLSearchParams(location.search);
  const look = Number(params.get('look'));
  const view = params.get('screen');
  const scenario = params.get('scenario');
  const areaId = params.get('area');

  return {
    look: looks.some(item => item.id === look) ? look : 2,
    view: allowedViews.has(view) ? view : 'areas',
    scenario: Object.hasOwn(scenarios, scenario) ? scenario : 'normal',
    areaId: areaId || null
  };
}

let state = initialState();

const screen = document.querySelector('#screen');
const lookControls = document.querySelector('#look-controls');
const screenControls = document.querySelector('#screen-controls');
const scenarioControls = document.querySelector('#scenario-controls');
const toastRoot = document.querySelector('#toast-root');

function scenarioData() {
  return clone(scenarios[state.scenario] || scenarios.normal);
}

function attentionCount(area) {
  return area.routines.filter(item => item.status === 'overdue' || item.status === 'today').length;
}

function overdueCount(area) {
  return area.routines.filter(item => item.status === 'overdue').length;
}

function statusFor(area) {
  const overdue = overdueCount(area);
  const due = area.routines.filter(item => item.status === 'today').length;
  if (overdue) return { className: 'overdue', label: `${overdue} overdue`, count: overdue };
  if (due) return { className: 'due', label: `${due} due today`, count: due };
  return { className: '', label: 'Up to date', count: 'Clear' };
}

function nextRoutine(area) {
  const priority = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };
  return [...area.routines].sort((a, b) => priority[a.status] - priority[b.status])[0];
}

function dueStamp(item) {
  const text = item.status === 'overdue'
    ? 'Overdue'
    : item.status === 'today'
      ? 'Today'
      : item.status === 'as-needed'
        ? 'As needed'
        : 'Upcoming';
  return `<span class="due-stamp ${item.status}">${text}</span>`;
}

function renderAreasEditorial(data) {
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

function renderAreaDetail(data, requestedAreaId) {
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
      ${attention.length
        ? rows(attention)
        : '<p class="quiet-copy">Nothing is pressing here. Browse a section or use an as-needed routine.</p>'}
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

function renderInterventionEditorial(data) {
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

function renderFutureLook(look) {
  return `
    <header class="editorial-header">
      <div class="kicker">Look #${look.id} · Design Lab</div>
      <h1>${esc(look.name)}</h1>
      <p>${esc(look.description)}</p>
    </header>
    <div class="header-line"></div>
    <section class="coming-soon">
      <div class="poster">
        <div class="section-label">Queued audition</div>
        <h1>The same data. A different philosophy.</h1>
        <p>This visual direction will use the exact Areas, Area detail, and intervention scenarios established in the shared fixture.</p>
        <ul>
          <li>Current screen and scenario remain selected when switching Looks</li>
          <li>Counts and product meaning remain equivalent</li>
          <li>Placement may change only to support the aesthetic</li>
          <li>Look #1 remains unchanged on main</li>
        </ul>
      </div>
    </section>`;
}

function renderUnsupported(message) {
  return `
    <header class="editorial-header">
      <div class="kicker">Design Lab route</div>
      <h1>This preview could not be opened.</h1>
      <p>${esc(message)}</p>
    </header>
    <div class="header-line"></div>
    <section class="coming-soon">
      <div class="poster">
        <div class="section-label">Safe fallback</div>
        <h1>Return to Areas</h1>
        <p>The review state was not changed outside the Design Lab.</p>
        <button class="primary-action" data-action="reset-route">Open the default audition</button>
      </div>
    </section>`;
}

function urlForState() {
  const params = new URLSearchParams();
  params.set('look', state.look);
  params.set('screen', state.view);
  params.set('scenario', state.scenario);
  if (state.view === 'area' && state.areaId) params.set('area', state.areaId);
  return `${location.pathname}?${params}`;
}

function commitRoute({ replace = false } = {}) {
  const method = replace ? 'replaceState' : 'pushState';
  history[method]({ ...state }, '', urlForState());
  try {
    sessionStorage.setItem(DESIGN_LAB.storageKey, JSON.stringify(state));
  } catch {
    // Query parameters remain the source of truth when storage is unavailable.
  }
}

function renderControls(data) {
  lookControls.innerHTML = looks.map(look => `
    <button class="look-button ${state.look === look.id ? 'active' : ''}" data-look="${look.id}">
      <span class="look-number">#${look.id}</span>
      <strong>${esc(look.name)}</strong>
      <small>${esc(look.status)}</small>
    </button>`).join('');

  screenControls.innerHTML = [
    ['areas', 'Areas'],
    ['intervention', 'Intervention']
  ].map(([id, label]) => {
    const active = state.view === id || (id === 'areas' && state.view === 'area');
    return `<button class="${active ? 'active' : ''}" data-view="${id}">${label}</button>`;
  }).join('');

  scenarioControls.innerHTML = Object.entries(scenarios).map(([id, scenario]) => `
    <button class="${state.scenario === id ? 'active' : ''}" data-scenario="${id}" title="${esc(scenario.purpose)}">${esc(scenario.label)}</button>`).join('');

  const look = looks.find(item => item.id === state.look) || looks[0];
  document.querySelector('#look-kicker').textContent = `Look #${look.id}`;
  document.querySelector('#look-name').textContent = look.name;
  document.querySelector('#look-description').textContent = look.description;
  document.querySelector('#scenario-purpose').textContent = `${data.label}: ${data.purpose}`;
  document.querySelector('#build-meta').textContent = `v${DESIGN_LAB.version} · ${DESIGN_LAB.buildDate}`;
}

function render({ routeAction = 'none' } = {}) {
  const look = looks.find(item => item.id === state.look) || looks[0];
  const data = scenarioData();
  document.documentElement.dataset.textScale = data.textScale || 'normal';
  renderControls(data);

  if (look.id !== 2) {
    screen.innerHTML = renderFutureLook(look);
  } else if (state.view === 'intervention') {
    screen.innerHTML = renderInterventionEditorial(data);
  } else if (state.view === 'area') {
    screen.innerHTML = renderAreaDetail(data, state.areaId);
  } else if (state.view === 'areas') {
    screen.innerHTML = renderAreasEditorial(data);
  } else {
    screen.innerHTML = renderUnsupported('The requested screen is not part of the Round 1 audition.');
  }

  screen.scrollTop = 0;
  if (routeAction === 'push') commitRoute();
  if (routeAction === 'replace') commitRoute({ replace: true });
}

function showToast(message) {
  toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toastRoot.innerHTML = ''; }, 2200);
}

function resetReviewState() {
  state = { look: 2, view: 'areas', scenario: 'normal', areaId: null };
  try {
    sessionStorage.removeItem(DESIGN_LAB.storageKey);
  } catch {
    // No action needed.
  }
  render({ routeAction: 'push' });
  showToast('Design Lab review state reset.');
}

document.addEventListener('click', event => {
  const lookButton = event.target.closest('[data-look]');
  if (lookButton) {
    state.look = Number(lookButton.dataset.look);
    render({ routeAction: 'push' });
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    state.view = viewButton.dataset.view;
    state.areaId = null;
    render({ routeAction: 'push' });
    return;
  }

  const scenarioButton = event.target.closest('[data-scenario]');
  if (scenarioButton) {
    state.scenario = scenarioButton.dataset.scenario;
    const data = scenarioData();
    if (state.view === 'area' && !data.areas.some(area => area.id === state.areaId)) {
      state.view = 'areas';
      state.areaId = null;
    }
    render({ routeAction: 'push' });
    return;
  }

  const areaButton = event.target.closest('[data-area-id]');
  if (areaButton) {
    state.view = 'area';
    state.areaId = areaButton.dataset.areaId;
    render({ routeAction: 'push' });
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.nav === 'areas') {
      state.view = 'areas';
      state.areaId = null;
      render({ routeAction: 'push' });
    } else {
      showToast('Round 1 is focused on Areas and the intervention moment.');
    }
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'back-areas') {
    state.view = 'areas';
    state.areaId = null;
    render({ routeAction: 'push' });
  } else if (action === 'reset-review') {
    resetReviewState();
  } else if (action === 'reset-route') {
    resetReviewState();
  } else if (action === 'complete-demo') {
    showToast('Completion feedback will be tested in the interactive vertical-slice round.');
  } else if (action === 'demo-add-area') {
    showToast('The audition tests the visual system; full creation comes in Round 2.');
  } else if (action === 'section-demo') {
    showToast('Section detail follows after the visual finalists are selected.');
  } else if (action === 'start-demo') {
    showToast('Task accepted. Nudge would open its focused completion view.');
  } else if (action === 'different-demo') {
    showToast('A short alternative-task list would appear here.');
  } else if (action === 'not-now-demo') {
    showToast('Intervention dismissed without guilt.');
  }
});

window.addEventListener('popstate', () => {
  state = initialState();
  render();
});

document.querySelector('#status-time').textContent = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit'
}).format(new Date());

render({ routeAction: 'replace' });
