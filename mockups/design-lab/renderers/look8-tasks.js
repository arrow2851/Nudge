import { esc } from '../utils.js';
import { taskProgress } from '../task-state.js';

function sortedTasks(tasks) {
  return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
}

function taskPath(item, parentId = '') {
  return `data-task-id="${esc(item.id)}" data-parent-id="${esc(parentId)}"`;
}

function taskSettings(item, parentId, state, index, total) {
  if (state.openSettingsId !== item.id) return '';
  const isSubtask = Boolean(parentId);
  return `
    <section class="ag-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <header><span>Task options</span><strong>${isSubtask ? 'Subtask' : item.main ? 'Main task' : 'Regular task'}</strong></header>
      <p>${isSubtask ? 'Move this item within the group or return it to the main list.' : item.main ? 'Turning off main-task mode returns each subtask to the regular list.' : 'Keep this independent, make it a main task, or place it under the previous task.'}</p>
      <div class="ag-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>Make regular task</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>Place under previous</button>` : ''}`}
        <button data-action="move-task-up" ${taskPath(item, parentId)} ${index === 0 ? 'disabled' : ''}>Move up</button>
        <button data-action="move-task-down" ${taskPath(item, parentId)} ${index === total - 1 ? 'disabled' : ''}>Move down</button>
      </div>
    </section>`;
}

function taskRow(item, state, { parentId = '', index = 0, total = 1 } = {}) {
  const isSubtask = Boolean(parentId);
  const title = item.title || 'Untitled task';
  const settingsOpen = state.openSettingsId === item.id;
  return `
    <div class="ag-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="ag-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder"><span aria-hidden="true">⋮⋮</span></button>
      <button class="ag-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="ag-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="New task">
      <span class="ag-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '—')}</span>
      <button class="ag-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} options for ${esc(title)}">›</button>
      ${item.main && !isSubtask ? `<button class="ag-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="ag-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="ag-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="ag-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <div><span>Main task progress</span><strong>${progress.done} of ${progress.total} complete</strong></div>
          <b>${progress.percent}%</b>
          <div class="ag-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="ag-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="ag-task-quiet">No visible subtasks. Use + to add a smaller step.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksAmbient(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="ag-page ag-tasks-page" aria-label="Tasks checklist">
      <div class="ag-task-aurora" aria-hidden="true"></div>
      <header class="ag-task-header">
        <div>
          <span>Tasks · shared checklist</span>
          <h1>${remainingCount ? 'A clear view of what remains.' : 'The task view is clear.'}</h1>
          <p>${remainingCount ? 'Edit directly, complete what is finished, and keep the rest visible without pressure.' : 'Add another task when there is something useful to track.'}</p>
        </div>
        <button class="ag-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <div class="ag-task-summary" aria-label="Task summary">
        <div><strong>${remainingCount}</strong><span>Active</span></div>
        <div><strong>${mainCount}</strong><span>Main tasks</span></div>
        <div><strong>${completedCount}</strong><span>Completed</span></div>
      </div>

      <div class="ag-task-toolbar">
        <span>${state.tasks.length} ${state.tasks.length === 1 ? 'task' : 'tasks'} in this view</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'Show completed' : 'Hide completed'}</button>
      </div>

      <div class="ag-task-columns" aria-hidden="true"><span>Move</span><span>Done</span><span>Task</span><span>Time</span><span>More</span><span>Sub</span></div>

      <section class="ag-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="ag-task-empty">
            <span aria-hidden="true">✓</span>
            <div><h2>${state.tasks.length ? 'Completed tasks are hidden.' : 'No tasks have been added.'}</h2><p>${state.tasks.length ? 'Show completed tasks or add another one.' : 'Either plus control creates an empty editable row.'}</p></div>
          </article>`}
      </section>

      <button class="ag-task-bottom-add" data-action="add-task-bottom">＋ Add task</button>
      <p class="ag-task-note">Drag to reorder. Options also provide Move, Indent, and Unindent controls.</p>
    </section>`;
}
