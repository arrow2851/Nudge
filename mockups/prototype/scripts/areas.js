function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function openTasksFor(state, areaId, subareaId = null) {
  return state.tasks.filter(task => !task.completed && task.areaId === areaId && (subareaId === null || task.subareaId === subareaId));
}

function counts(tasks) {
  return {
    due: tasks.filter(task => task.urgency === 'today').length,
    overdue: tasks.filter(task => task.urgency === 'overdue').length,
    upcoming: tasks.filter(task => task.urgency === 'upcoming').length
  };
}

function statPills(summary) {
  const items = [];
  if (summary.due) items.push(`<span class="area-stat due">${summary.due} due</span>`);
  if (summary.overdue) items.push(`<span class="area-stat overdue">${summary.overdue} overdue</span>`);
  if (!items.length) items.push('<span class="area-stat clear">Nothing due</span>');
  return items.join('');
}

export function renderAreas(state, pageHeader) {
  const activeAreas = state.areas.filter(area => !area.archived);
  return `${pageHeader('Areas', 'Organize responsibilities into broad categories.')}
    <div class="area-toolbar">
      <p>${activeAreas.length} areas</p>
      <button class="button primary compact-button" data-action="open-add-area">+ Add area</button>
    </div>
    <div class="area-grid">
      ${activeAreas.map(area => {
        const tasks = openTasksFor(state, area.id);
        const summary = counts(tasks);
        const activeSections = area.subareas.filter(section => !section.archived);
        return `<article class="area-card">
          <button class="area-card-main" data-route="areas/${area.id}">
            <span class="area-card-icon">${area.icon}</span>
            <span class="area-card-copy">
              <strong>${escapeHtml(area.name)}</strong>
              <small>${activeSections.length ? `${activeSections.length} ${activeSections.length === 1 ? 'section' : 'sections'}` : 'No sections'}</small>
            </span>
            <span class="area-card-arrow">›</span>
          </button>
          <div class="area-card-footer">
            <div class="area-stats">${statPills(summary)}</div>
            <button class="area-menu-button" data-action="open-edit-area" data-area-id="${area.id}" aria-label="Edit ${escapeHtml(area.name)}">•••</button>
          </div>
        </article>`;
      }).join('')}
    </div>
    <section class="template-callout">
      <span class="template-callout-icon">✦</span>
      <div><strong>Start useful, then customize</strong><p>Shipped defaults can provide sensible sections. Custom areas stay empty unless you apply a template.</p></div>
    </section>`;
}

export function renderAreaDetail(state, areaId, pageHeader) {
  const area = state.areas.find(item => item.id === areaId && !item.archived);
  if (!area) return null;
  const areaTasks = openTasksFor(state, area.id);
  const summary = counts(areaTasks);
  const sections = area.subareas.filter(section => !section.archived).sort((a, b) => a.order - b.order);
  const unassigned = areaTasks.filter(task => !task.subareaId);

  return `<header class="detail-header">
      <button class="icon-button" data-route="areas" aria-label="Back to Areas">←</button>
      <div class="detail-title"><span>${area.icon}</span><div><h1>${escapeHtml(area.name)}</h1><p>${sections.length ? `${sections.length} sections` : 'Area without sections'}</p></div></div>
      <button class="icon-button" data-action="open-edit-area" data-area-id="${area.id}" aria-label="Edit area">•••</button>
    </header>
    <section class="area-summary-card">
      <div><strong>${summary.due + summary.overdue}</strong><small>Needs attention</small></div>
      <div><strong>${summary.due}</strong><small>Due today</small></div>
      <div><strong>${summary.overdue}</strong><small>Overdue</small></div>
    </section>
    <div class="section-heading"><h2>${sections.length ? 'Sections' : 'Tasks and chores'}</h2><span>${sections.length || areaTasks.length}</span></div>
    ${sections.length ? `<div class="room-list">
      ${sections.map(section => {
        const sectionTasks = openTasksFor(state, area.id, section.id);
        const sectionSummary = counts(sectionTasks);
        return `<button class="room-card" data-route="areas/${area.id}/${section.id}">
          <span class="room-icon">${section.icon}</span>
          <span class="room-copy"><strong>${escapeHtml(section.name)}</strong><small>${sectionTasks.length ? `${sectionTasks.length} open item${sectionTasks.length === 1 ? '' : 's'}` : 'Nothing pending'}</small></span>
          <span class="room-stats">${sectionSummary.overdue ? `<b>${sectionSummary.overdue} overdue</b>` : sectionSummary.due ? `<b>${sectionSummary.due} due</b>` : '<b class="clear-text">Clear</b>'}<i>›</i></span>
        </button>`;
      }).join('')}
    </div>` : `<section class="card today-list-card">${areaTasks.map(taskRow).join('') || emptyArea(area)}</section>`}
    ${sections.length && unassigned.length ? `<div class="section-heading"><h2>General ${escapeHtml(area.name)}</h2><span>${unassigned.length}</span></div><section class="card today-list-card">${unassigned.map(taskRow).join('')}</section>` : ''}
    <div class="area-actions">
      <button class="button primary" data-action="open-add-section" data-area-id="${area.id}">+ Add section</button>
      ${area.templateId !== 'default-house' || sections.length < 5 ? `<button class="button" data-action="open-template-sheet" data-area-id="${area.id}">Apply template</button>` : ''}
      <button class="button" data-action="open-add-item-for-area" data-area-id="${area.id}">+ Add task or chore</button>
    </div>`;
}

export function renderSectionDetail(state, areaId, sectionId) {
  const area = state.areas.find(item => item.id === areaId && !item.archived);
  const section = area?.subareas.find(item => item.id === sectionId && !item.archived);
  if (!area || !section) return null;
  const tasks = openTasksFor(state, areaId, sectionId);
  const due = tasks.filter(task => task.urgency === 'today' || task.urgency === 'overdue');
  const routines = tasks.filter(task => task.type === 'chore' && task.urgency === 'upcoming');
  const oneTime = tasks.filter(task => task.type === 'task' && task.urgency === 'upcoming');
  const resetCount = due.length;
  const resetMinutes = due.reduce((total, task) => total + task.minutes, 0);

  return `<header class="detail-header">
      <button class="icon-button" data-route="areas/${area.id}" aria-label="Back to ${escapeHtml(area.name)}">←</button>
      <div class="detail-title"><span>${section.icon}</span><div><h1>${escapeHtml(section.name)}</h1><p>${escapeHtml(area.name)}</p></div></div>
      <button class="icon-button" data-action="open-edit-section" data-area-id="${area.id}" data-section-id="${section.id}" aria-label="Edit section">•••</button>
    </header>
    <section class="reset-card">
      <div class="reset-card-copy"><p class="eyebrow">Section reset</p><h2>${resetCount ? `${resetCount} due item${resetCount === 1 ? '' : 's'}` : 'Section is clear'}</h2><p>${resetCount ? `About ${resetMinutes} minutes using due tasks only.` : 'There is nothing due right now.'}</p></div>
      <button class="button primary" data-action="start-section-reset" data-area-id="${area.id}" data-section-id="${section.id}" ${resetCount ? '' : 'disabled'}>Start reset</button>
    </section>
    ${renderTaskSection('Due now', due)}
    ${renderTaskSection('Routine chores', routines)}
    ${renderTaskSection('One-time tasks', oneTime)}
    ${!tasks.length ? `<div class="empty-state room-empty"><div><div class="empty-state-icon">${section.icon}</div><h2>No items here yet</h2><p>Add a chore or one-time task for ${escapeHtml(section.name)}.</p></div></div>` : ''}
    <div class="area-actions"><button class="button primary" data-action="open-add-item-for-section" data-area-id="${area.id}" data-section-id="${section.id}">+ Add task or chore</button><button class="button" data-action="open-edit-section" data-area-id="${area.id}" data-section-id="${section.id}">Edit section</button></div>`;
}

function taskRow(task) {
  return `<button class="list-row ${task.urgency === 'overdue' ? 'overdue' : ''}" data-route="item/${task.id}">
    <span class="task-check">○</span><span class="row-content"><strong>${escapeHtml(task.title)}</strong><small>${task.recurrence || (task.type === 'task' ? 'One-time task' : 'Chore')}</small>${task.urgency === 'overdue' ? `<span class="due-label">${escapeHtml(task.due)}</span>` : ''}</span><span class="row-meta">${task.minutes}m ›</span>
  </button>`;
}

function renderTaskSection(title, tasks) {
  if (!tasks.length) return '';
  return `<div class="section-heading"><h2>${title}</h2><span>${tasks.length}</span></div><section class="card today-list-card">${tasks.map(taskRow).join('')}</section>`;
}

function emptyArea(area) {
  return `<div class="empty-state area-empty"><div><div class="empty-state-icon">${area.icon}</div><h2>No items yet</h2><p>Add chores or one-time tasks directly to ${escapeHtml(area.name)}.</p></div></div>`;
}

export function areaSheetMarkup(state, areaId = '') {
  const area = state.areas.find(item => item.id === areaId);
  const editing = Boolean(area);
  const icons = ['🏠', '🚗', '👤', '💼', '📦', '🌳', '📍'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${editing ? 'Edit' : 'New'} area</p><h2>${editing ? escapeHtml(area.name) : 'Add an area'}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="area-name">Name</label><input class="input" id="area-name" value="${editing ? escapeHtml(area.name) : ''}" placeholder="Home"></div>
    <div class="field"><label>Icon</label><div class="icon-choice-row">${icons.map(icon => `<button class="icon-choice ${(area?.icon || '📍') === icon ? 'selected' : ''}" data-action="select-area-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><input type="hidden" id="area-icon" value="${area?.icon || '📍'}"></div>
    ${editing ? '' : `<div class="field"><label for="area-template">Start from</label><select class="input" id="area-template"><option value="">Empty custom area</option>${state.templates.map(template => `<option value="${template.id}">${template.icon} ${escapeHtml(template.name)} default</option>`).join('')}</select></div><label class="toggle-row"><span><strong>Add suggested sections</strong><small>Only applies when the selected template includes sections.</small></span><input type="checkbox" id="include-suggested-sections"></label>`}
    <button class="button primary block" data-action="save-area" data-area-id="${areaId}">${editing ? 'Save changes' : 'Add area'}</button>
  </section></div>`;
}

export function sectionSheetMarkup(state, areaId, sectionId = '') {
  const area = state.areas.find(item => item.id === areaId);
  const section = area?.subareas.find(item => item.id === sectionId);
  const icons = ['🍳', '🛋️', '🍽️', '🛁', '🛏️', '💻', '🧺', '🧰', '🚪', '📍'];
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">${section ? 'Edit' : 'New'} section</p><h2>${section ? escapeHtml(section.name) : `Add to ${escapeHtml(area?.name || 'area')}`}</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label for="section-name">Name</label><input class="input" id="section-name" value="${section ? escapeHtml(section.name) : ''}" placeholder="Kitchen"></div>
    <div class="field"><label>Icon</label><div class="icon-choice-row">${icons.map(icon => `<button class="icon-choice ${(section?.icon || '🚪') === icon ? 'selected' : ''}" data-action="select-section-icon" data-icon="${icon}">${icon}</button>`).join('')}</div><input type="hidden" id="section-icon" value="${section?.icon || '🚪'}"></div>
    <button class="button primary block" data-action="save-section" data-area-id="${areaId}" data-section-id="${sectionId}">${section ? 'Save changes' : 'Add section'}</button>
  </section></div>`;
}

export function templateSheetMarkup(state, areaId) {
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet role="dialog" aria-modal="true">
    <div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Templates</p><h2>Add suggested structure</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header>
    <p class="sheet-intro">Templates only add missing sections. Existing sections and items stay untouched.</p>
    ${state.templates.map(template => `<button class="template-option" data-action="apply-template" data-area-id="${areaId}" data-template-id="${template.id}" ${template.suggestedSubareas.length ? '' : 'disabled'}><span>${template.icon}</span><div><strong>${escapeHtml(template.name)}</strong><small>${template.suggestedSubareas.length ? `${template.suggestedSubareas.length} suggested sections` : 'No section template needed'}</small><p>${escapeHtml(String(template.description || '').replace(/\brooms\b/gi, 'sections'))}</p></div></button>`).join('')}
  </section></div>`;
}