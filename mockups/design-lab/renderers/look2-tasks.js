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
    <section class="ed-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <header>
        <span>Task options</span>
        <strong>${isSubtask ? 'Subtask' : item.main ? 'Main task' : 'Regular task'}</strong>
      </header>
      <p>${isSubtask ? 'Move this item within the group or return it to the main list.' : item.main ? 'Turning off main-task mode returns each subtask to the regular list.' : 'Keep this task independent, make it a main task, or place it under the previous task.'}</p>
      <div class="ed-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>Make regular task</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>Place under previous task</button>` : ''}`}
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
    <div class="ed-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="ed-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder"><span aria-hidden="true">⋮⋮</span></button>
      <button class="ed-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="ed-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="New task">
      <span class="ed-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '—')}</span>
      <button class="ed-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} options for ${esc(title)}">›</button>
      ${item.main && !isSubtask ? `<button class="ed-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="ed-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="ed-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="ed-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <div><span>Main task progress</span><strong>${progress.done} of ${progress.total} complete</strong></div>
          <b>${progress.percent}%</b>
          <div class="ed-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="ed-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="ed-task-quiet">No visible subtasks. Use + when a smaller step would help.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksEditorial(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="ed-page ed-tasks-page" aria-label="Tasks checklist">
      <header class="ed-task-header">
        <div>
          <span class="ed-task-kicker">Tasks · household notes</span>
          <h1>${remainingCount ? 'A practical list for now.' : 'The list is clear.'}</h1>
          <p>${remainingCount ? 'Edit directly, check off what is finished, and leave the rest for later.' : 'Add another task only when there is something useful to remember.'}</p>
        </div>
        <button class="ed-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <dl class="ed-task-summary" aria-label="Task summary">
        <div><dt>Active</dt><dd>${remainingCount}</dd></div>
        <div><dt>Main tasks</dt><dd>${mainCount}</dd></div>
        <div><dt>Completed</dt><dd>${completedCount}</dd></div>
      </dl>

      <div class="ed-task-toolbar">
        <span>${state.tasks.length} ${state.tasks.length === 1 ? 'task' : 'tasks'} in this list</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'Show completed' : 'Hide completed'}</button>
      </div>

      <div class="ed-task-columns" aria-hidden="true"><span>Move</span><span>Done</span><span>Task</span><span>Time</span><span>More</span><span>Sub</span></div>

      <section class="ed-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="ed-task-empty">
            <span>List note</span>
            <h2>${state.tasks.length ? 'Completed tasks are hidden.' : 'Nothing has been added yet.'}</h2>
            <p>${state.tasks.length ? 'Show completed tasks or add a new one.' : 'Either plus control creates an empty row ready for a title.'}</p>
          </article>`}
      </section>

      <button class="ed-task-bottom-add" data-action="add-task-bottom">＋ Add task</button>
      <p class="ed-task-note">Drag to reorder. Task options also provide Move, Indent, and Unindent controls.</p>
    </section>`;
}
