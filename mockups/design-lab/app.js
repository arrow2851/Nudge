const looks = [
  { id: 2, name: 'Warm Editorial', status: 'Active audition', description: 'A calm household journal with practical utility underneath.' },
  { id: 3, name: 'Precision Minimal', status: 'Next audition', description: 'Strict alignment, dense information, and a single sharp accent.' },
  { id: 4, name: 'Zen Focus', status: 'Planned', description: 'Quiet screens that reveal one useful action at a time.' },
  { id: 6, name: 'Tactile Household', status: 'Planned', description: 'Physical labels, controls, and satisfying household-tool cues.' }
];

const baseAreas = [
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
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const scenarios = {
  normal: {
    label: 'Normal day',
    areas: clone(baseAreas),
    intervention: { app: 'Instagram', minutes: 7, task: 'Wipe the stovetop', location: 'Kitchen', duration: 6 }
  },
  backlog: {
    label: 'Heavy backlog',
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
    areas: [],
    intervention: { app: 'Reddit', minutes: 5, task: 'Add your first useful action', location: 'Nudge setup', duration: 2 }
  },
  clear: {
    label: 'All clear',
    areas: clone(baseAreas).map(area => ({
      ...area,
      routines: area.routines.map(routine => ({ ...routine, status: routine.status === 'as-needed' ? 'as-needed' : 'upcoming' }))
    })),
    intervention: { app: 'Instagram', minutes: 6, task: 'Choose a small task for later', location: 'Nothing urgent', duration: 2 }
  }
};

const state = {
  look: Number(new URLSearchParams(location.search).get('look')) || 2,
  view: new URLSearchParams(location.search).get('screen') || 'areas',
  scenario: new URLSearchParams(location.search).get('scenario') || 'normal',
  areaId: null
};

const screen = document.querySelector('#screen');
const lookControls = document.querySelector('#look-controls');
const screenControls = document.querySelector('#screen-controls');
const scenarioControls = document.querySelector('#scenario-controls');
const toastRoot = document.querySelector('#toast-root');

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
  const text = item.status === 'overdue' ? 'Overdue' : item.status === 'today' ? 'Today' : item.status === 'as-needed' ? 'As needed' : 'Upcoming';
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
      <p>${attention ? `They are spread across ${affected} ${affected === 1 ? 'area' : 'areas'}. Start wherever feels easiest.` : 'As-needed routines remain available without creating urgency.'}</p>
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
            <button data-area-id="${area.id}">
              <span>
                <span class="area-name"><strong>${area.name}</strong><i></i></span>
                <span class="area-meta">${area.routines.length} routines${area.sections ? ` · ${area.sections} sections` : ' · standalone area'}</span>
                <span class="area-next">${next ? `${status.label} · ${next.title}` : 'No routines configured'}</span>
              </span>
              <span class="area-count">${status.count}</span>
            </button>
          </article>`;
      }).join('')}
    </section>
    <button class="add-area" data-action="demo-add-area">+ Add another area</button>`;
}

function renderAreaDetail(data, areaId) {
  const area = data.areas.find(item => item.id === areaId) || data.areas[0];
  if (!area) return renderAreasEditorial(data);
  const attention = area.routines.filter(item => item.status === 'overdue' || item.status === 'today');
  const later = area.routines.filter(item => item.status !== 'overdue' && item.status !== 'today');
  const sectionNames = [...new Set(area.routines.map(item => item.section).filter(Boolean))];
  if (area.unconfigured && !sectionNames.includes(area.unconfigured)) sectionNames.push(area.unconfigured);

  const rows = items => items.map(item => `
    <div class="routine-row">
      <button class="editorial-check" data-action="complete-demo" aria-label="Complete ${item.title}"></button>
      <span class="routine-copy"><strong>${item.title}</strong><small>${item.section || area.name} · ${item.repeat} · ${item.minutes} min</small></span>
      ${dueStamp(item)}
    </div>`).join('');

  return `
    <div class="back-row"><button class="back-button" data-action="back-areas">← All areas</button></div>
    <header class="area-detail-intro">
      <div class="section-label">Area overview</div>
      <h1>${area.name}</h1>
      <p>${attention.length ? `${attention.length} need attention` : 'Up to date'} · ${area.routines.length} recurring routines</p>
    </header>
    <section class="routine-group">
      <div class="routine-group-header"><h2>Needs attention</h2><span>${attention.length}</span></div>
      ${attention.length ? rows(attention) : '<p style="color:var(--muted);font-size:11px;line-height:1.6">Nothing is pressing here. Browse a section or use an as-needed routine.</p>'}
    </section>
    <section class="routine-group">
      <div class="routine-group-header"><h2>Sections</h2><span>${sectionNames.length}</span></div>
      ${sectionNames.map(name => {
        const count = area.routines.filter(item => item.section === name).length;
        return `<button class="section-link" data-action="section-demo"><span><strong>${name}</strong><br><small>${count ? `${count} routines` : 'Not configured · Tap to begin'}</small></span><span>→</span></button>`;
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
      <div class="intervention-top"><span class="intervention-kicker">A useful pause</span><span>${item.minutes} min on ${item.app}</span></div>
      <div class="intervention-rule"></div>
      <h1>You have been here for a little while.</h1>
      <p class="lead">No judgment. This may be a good moment to step away and finish one small thing.</p>
      <article class="suggestion-card">
        <div class="section-label">Suggested now</div>
        <h2>${item.task}</h2>
        <p>${item.location} · about ${item.duration} minutes</p>
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
      <h1>${look.name}</h1>
      <p>${look.description}</p>
    </header>
    <div class="header-line"></div>
    <section class="coming-soon">
      <div class="poster">
        <div class="section-label">Queued audition</div>
        <h1>The same data. A different philosophy.</h1>
        <p>This visual direction will use the exact Areas and intervention scenarios already established for Look #2.</p>
        <ul>
          <li>Same content and urgency states</li>
          <li>Same phone dimensions and review controls</li>
          <li>Layout changes allowed when they reinforce the aesthetic</li>
          <li>No changes to Look #1 on main</li>
        </ul>
      </div>
    </section>`;
}

function syncUrl() {
  const params = new URLSearchParams();
  params.set('look', state.look);
  params.set('screen', state.view);
  params.set('scenario', state.scenario);
  history.replaceState(null, '', `${location.pathname}?${params}`);
}

function renderControls() {
  lookControls.innerHTML = looks.map(look => `
    <button class="look-button ${state.look === look.id ? 'active' : ''}" data-look="${look.id}">
      <span class="look-number">#${look.id}</span>
      <strong>${look.name}</strong>
      <small>${look.status}</small>
    </button>`).join('');

  screenControls.innerHTML = [
    ['areas', 'Areas'],
    ['intervention', 'Intervention']
  ].map(([id, label]) => `<button class="${state.view === id ? 'active' : ''}" data-view="${id}">${label}</button>`).join('');

  scenarioControls.innerHTML = Object.entries(scenarios).map(([id, scenario]) => `
    <button class="${state.scenario === id ? 'active' : ''}" data-scenario="${id}">${scenario.label}</button>`).join('');

  const look = looks.find(item => item.id === state.look) || looks[0];
  document.querySelector('#look-kicker').textContent = `Look #${look.id}`;
  document.querySelector('#look-name').textContent = look.name;
  document.querySelector('#look-description').textContent = look.description;
}

function render() {
  const look = looks.find(item => item.id === state.look) || looks[0];
  const data = scenarios[state.scenario] || scenarios.normal;
  renderControls();

  if (look.id !== 2) {
    screen.innerHTML = renderFutureLook(look);
  } else if (state.view === 'intervention') {
    screen.innerHTML = renderInterventionEditorial(data);
  } else if (state.areaId) {
    screen.innerHTML = renderAreaDetail(data, state.areaId);
  } else {
    screen.innerHTML = renderAreasEditorial(data);
  }

  screen.scrollTop = 0;
  syncUrl();
}

function showToast(message) {
  toastRoot.innerHTML = `<div class="toast">${message}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toastRoot.innerHTML = ''; }, 2200);
}

document.addEventListener('click', event => {
  const lookButton = event.target.closest('[data-look]');
  if (lookButton) {
    state.look = Number(lookButton.dataset.look);
    state.areaId = null;
    render();
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    state.view = viewButton.dataset.view;
    state.areaId = null;
    render();
    return;
  }

  const scenarioButton = event.target.closest('[data-scenario]');
  if (scenarioButton) {
    state.scenario = scenarioButton.dataset.scenario;
    state.areaId = null;
    render();
    return;
  }

  const areaButton = event.target.closest('[data-area-id]');
  if (areaButton) {
    state.areaId = areaButton.dataset.areaId;
    render();
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.nav === 'areas') {
      state.view = 'areas';
      state.areaId = null;
      render();
    } else {
      showToast('Round 1 is focused on Areas and the intervention moment.');
    }
    return;
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'back-areas') {
    state.areaId = null;
    render();
  } else if (action === 'complete-demo') {
    showToast('Completion feedback will be tested in the interactive vertical-slice round.');
  } else if (action === 'demo-add-area') {
    showToast('The audition is testing the visual system; full creation comes in Round 2.');
  } else if (action === 'section-demo') {
    showToast('Section detail will be included after the visual finalists are selected.');
  } else if (action === 'start-demo') {
    showToast('Task accepted. Nudge would open its focused completion view.');
  } else if (action === 'different-demo') {
    showToast('A short alternative-task list would appear here.');
  } else if (action === 'not-now-demo') {
    showToast('Intervention dismissed without guilt.');
  }
});

document.querySelector('#status-time').textContent = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit'
}).format(new Date());

render();
