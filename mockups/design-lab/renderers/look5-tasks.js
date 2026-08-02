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
    <div class="pl-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <div class="pl-task-settings-copy">
        <span aria-hidden="true">⚙</span>
        <div><strong>Task options</strong><small>${isSubtask ? 'This task currently lives under a main task.' : item.main ? 'This task can hold one level of subtasks.' : 'Keep it independent or group it with related work.'}</small></div>
      </div>
      <div class="pl-task-settings-actions">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>Make regular task</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>Move under previous</button>` : ''}`}
        <button data-action="move-task-up" ${taskPath(item, parentId)} ${index === 0 ? 'disabled' : ''}>Move up</button>
        <button data-action="move-task-down" ${taskPath(item, parentId)} ${index === total - 1 ? 'disabled' : ''}>Move down</button>
      </div>
    </div>`;
}

function taskRow(item, state, { parentId = '', index = 0, total = 1 } = {}) {
  const isSubtask = Boolean(parentId);
  const title = item.title || 'Untitled task';
  const settingsOpen = state.openSettingsId === item.id;
  return `
    <div class="pl-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="pl-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder" title="Drag to reorder"><span aria-hidden="true">⋮⋮</span></button>
      <button class="pl-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="pl-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="New task">
      <span class="pl-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time)}</span>
      <button class="pl-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} settings for ${esc(title)}">›</button>
      ${item.main && !isSubtask ? `<button class="pl-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="pl-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="pl-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="pl-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <div class="pl-task-progress-copy"><span aria-hidden="true">✦</span><div><strong>${progress.total ? `${progress.done} of ${progress.total} little steps` : 'Ready for little steps'}</strong><small>${progress.percent}% complete</small></div></div>
          <span class="pl-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></span>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="pl-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="pl-task-quiet">No visible subtasks yet. Use the plus button when one would help.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksPlayful(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="pl-page pl-tasks-page" aria-label="Tasks checklist">
      <header class="pl-task-header">
        <div><span class="pl-chip">TASKS</span><h1>${remainingCount ? 'A few useful blocks.' : 'Your task blocks are clear.'}</h1><p>${remainingCount ? 'Edit, group, and check things off without turning the list into a project plan.' : 'Add another task whenever something needs a small place to land.'}</p></div>
        <button class="pl-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <div class="pl-task-summary" aria-label="Task summary">
        <div class="active"><strong>${remainingCount}</strong><span>still moving</span></div>
        <div class="main"><strong>${mainCount}</strong><span>main tasks</span></div>
        <div class="done"><strong>${completedCount}</strong><span>checked off</span></div>
      </div>

      <div class="pl-task-toolbar">
        <span>${state.tasks.length} total task blocks</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'Show completed' : 'Hide completed'}</button>
      </div>

      <section class="pl-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="pl-task-empty">
            <span aria-hidden="true">✓</span>
            <h2>${state.tasks.length ? 'Completed blocks are tucked away.' : 'No task blocks yet.'}</h2>
            <p>${state.tasks.length ? 'Show completed items or add something new.' : 'Either plus button creates an empty editable task.'}</p>
          </article>`}
      </section>

      <button class="pl-task-bottom-add" data-action="add-task-bottom">＋ Add task</button>
      <p class="pl-task-gesture-note">Drag the left handle to reorder. Task options also include Move, Indent, and Unindent.</p>
    </section>`;
}
