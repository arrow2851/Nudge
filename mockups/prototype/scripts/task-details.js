const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function metaRow(label, value) {
  return `<div class="detail-meta-row"><span>${esc(label)}</span><strong>${esc(value || 'Not set')}</strong></div>`;
}

function taskStatus(task) {
  if (task.completed || task.status === 'completed') return 'Completed';
  if (task.paused) return 'Paused';
  if (task.status === 'inbox') return 'Inbox';
  if (task.status === 'waiting') return 'Waiting';
  if (task.status === 'blocked') return 'Blocked';
  if (task.urgency === 'overdue') return 'Overdue';
  return task.due || 'Planned';
}

export function renderTaskDetail(state, taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return '';
  const area = state.areas.find(item => item.id === task.areaId);
  const section = area?.subareas?.find(item => item.id === task.subareaId);
  const location = [area?.name || task.area, section?.name || task.subarea].filter(Boolean).join(' › ');
  const kind = task.type === 'chore' ? 'Chore' : 'Task';
  const status = taskStatus(task);
  const manageable = !task.completed;
  return `<div class="detail-screen">
    <header class="detail-topbar"><button class="icon-button" data-action="detail-back" aria-label="Back">←</button><div><p class="eyebrow">${kind}</p><h1>${esc(task.title)}</h1></div><button class="icon-button" data-action="open-edit-task" data-task-id="${task.id}" aria-label="Edit">✎</button></header>
    <div class="detail-status-row"><span class="status-pill ${task.urgency === 'overdue' ? 'danger' : ''}">${esc(status)}</span><span class="status-pill">${esc((task.priority || 'medium')[0].toUpperCase() + (task.priority || 'medium').slice(1))} priority</span>${task.recurrence ? `<span class="status-pill">${esc(task.recurrence)}</span>` : ''}${task.nudge ? '<span class="status-pill">Nudge eligible</span>' : ''}</div>
    <section class="card detail-hero"><div><small>Location</small><strong>${esc(location || 'Unassigned')}</strong></div><div><small>Estimate</small><strong>${esc(task.minutes)} min</strong></div></section>
    <section class="card detail-meta">
      ${metaRow('Status', status)}
      ${metaRow('Due', task.due)}
      ${metaRow('Priority', `${(task.priority || 'medium')[0].toUpperCase()}${(task.priority || 'medium').slice(1)}`)}
      ${metaRow('Recurrence', task.recurrence || 'None')}
      ${metaRow('Schedule basis', task.scheduleBasis || (task.recurrence ? 'Completion-based' : 'Not applicable'))}
      ${metaRow('Next due', task.nextDueLabel || task.due)}
      ${metaRow('Completion style', task.grading ? 'Light / Moderate / Deep' : 'Done / Not done')}
      ${metaRow('Notes', task.notes || 'None')}
    </section>
    ${manageable ? `<section class="detail-primary-actions"><button class="button primary block" data-action="request-complete" data-task-id="${task.id}" ${['waiting','blocked'].includes(task.status) ? 'disabled' : ''}>Mark complete</button><button class="button block" data-action="start-task" data-task-id="${task.id}" ${['waiting','blocked'].includes(task.status) ? 'disabled' : ''}>Start ${kind.toLowerCase()}</button></section>` : `<section class="card soft"><strong>Completed</strong><p class="row-meta">${esc(task.completionGrade || 'Done')}${task.completedAt ? ` · ${new Date(task.completedAt).toLocaleString()}` : ''}</p><button class="button block" data-action="reopen-task" data-task-id="${task.id}">Reopen</button></section>`}
    <div class="section-heading"><h2>Manage</h2><span>${kind}</span></div>
    <section class="card action-list">
      <button class="list-row" data-action="open-task-status" data-task-id="${task.id}"><span class="row-icon">⇄</span><span class="row-content"><strong>Change status</strong><small>Inbox, planned, waiting, or blocked</small></span><span>›</span></button>
      <button class="list-row" data-action="open-snooze-sheet" data-task-id="${task.id}" ${task.completed ? 'disabled' : ''}><span class="row-icon">⏰</span><span class="row-content"><strong>Snooze</strong><small>Move it out of the way temporarily</small></span><span>›</span></button>
      <button class="list-row" data-action="open-reschedule-sheet" data-task-id="${task.id}" ${task.completed ? 'disabled' : ''}><span class="row-icon">📅</span><span class="row-content"><strong>Reschedule</strong><small>Choose a new due date</small></span><span>›</span></button>
      ${task.type === 'chore' && task.recurrence ? `<button class="list-row" data-action="skip-occurrence" data-task-id="${task.id}"><span class="row-icon">↷</span><span class="row-content"><strong>Skip this occurrence</strong><small>Keep the recurring chore</small></span><span>›</span></button><button class="list-row" data-action="toggle-pause-task" data-task-id="${task.id}"><span class="row-icon">${task.paused ? '▶' : 'Ⅱ'}</span><span class="row-content"><strong>${task.paused ? 'Resume recurrence' : 'Pause recurrence'}</strong><small>${task.paused ? 'Start scheduling it again' : 'Stop future due dates temporarily'}</small></span><span>›</span></button>` : ''}
    </section>
  </div>`;
}

function sectionOptions(state, areaId, selected = '') {
  const area = state.areas.find(item => item.id === areaId);
  return `<option value="">No section</option>${(area?.subareas || []).filter(item => !item.archived).map(item => `<option value="${item.id}" ${item.id === selected ? 'selected' : ''}>${item.icon} ${esc(item.name)}</option>`).join('')}`;
}

export function taskEditSheet(state, taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return '';
  const status = task.completed ? 'completed' : task.status || 'planned';
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet task-create-sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><h2>Edit ${task.type === 'chore' ? 'chore' : 'task'}</h2><button class="icon-button" data-action="close-sheet">✕</button></header>
    <div class="field"><label>Title</label><input class="input" id="edit-task-title" value="${esc(task.title)}"></div>
    <div class="two-field-grid"><div class="field"><label>Status</label><select class="input" id="edit-task-status">${[['inbox','Inbox'],['planned','Planned'],['waiting','Waiting'],['blocked','Blocked'],['completed','Completed']].map(([value,label]) => `<option value="${value}" ${status === value ? 'selected' : ''}>${label}</option>`).join('')}</select></div><div class="field"><label>Priority</label><select class="input" id="edit-task-priority">${['high','medium','low'].map(value => `<option value="${value}" ${(task.priority || 'medium') === value ? 'selected' : ''}>${value[0].toUpperCase()}${value.slice(1)}</option>`).join('')}</select></div></div>
    <div class="two-field-grid"><div class="field"><label>Area</label><select class="input" id="edit-task-area"><option value="">Unassigned</option>${state.areas.filter(area => !area.archived).map(area => `<option value="${area.id}" ${task.areaId === area.id ? 'selected' : ''}>${area.icon} ${esc(area.name)}</option>`).join('')}</select></div><div class="field"><label>Section</label><select class="input" id="edit-task-section" ${task.areaId ? '' : 'disabled'}>${sectionOptions(state, task.areaId, task.subareaId)}</select></div></div>
    <div class="field"><label>Estimated minutes</label><input class="input" id="edit-task-minutes" type="number" min="1" value="${task.minutes || 5}"></div>
    <div class="field"><label>Recurrence</label><select class="input" id="edit-task-recurrence"><option value="">None</option>${['As needed','Daily','Weekly','Monthly','Every 60 days'].map(value => `<option ${task.recurrence === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
    <div class="field"><label>Notes</label><textarea class="input textarea" id="edit-task-notes" placeholder="Optional notes">${esc(task.notes || '')}</textarea></div>
    <label class="toggle-row"><span><strong>Include in nudges</strong><small>Allow this item to be suggested</small></span><input id="edit-task-nudge" type="checkbox" ${task.nudge ? 'checked' : ''}></label>
    <button class="button primary block" data-action="save-task-edit" data-task-id="${task.id}">Save changes</button>
  </section></div>`;
}

export function snoozeSheet(taskId) {
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><h2>Snooze</h2><button class="icon-button" data-action="close-sheet">✕</button></header>${[['Later today','later-today'],['Tomorrow','tomorrow'],['This weekend','weekend'],['Next week','next-week']].map(([label,value]) => `<button class="grade-option" data-action="apply-snooze" data-task-id="${taskId}" data-snooze="${value}"><span class="grade-badge">⏰</span><span><strong>${label}</strong><small>Temporarily remove from the current queue</small></span></button>`).join('')}</section></div>`;
}

export function rescheduleSheet(taskId) {
  return `<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><h2>Reschedule</h2><button class="icon-button" data-action="close-sheet">✕</button></header><div class="field"><label>New due date</label><input class="input" id="reschedule-date" type="date"></div><button class="button primary block" data-action="apply-reschedule" data-task-id="${taskId}">Save new date</button></section></div>`;
}
