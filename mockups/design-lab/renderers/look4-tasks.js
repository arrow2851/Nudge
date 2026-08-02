import { esc } from '../utils.js';
import { taskProgress } from '../task-state.js';

function sortedTasks(tasks) {
  return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
}

function taskPath(item, parentId = '') {
  return `data-task-id="${esc(item.id)}" data-parent-id="${esc(parentId)}"`;
}

function movementFor(item, visibleItems) {
  const peers = visibleItems.filter(candidate => candidate.completed === item.completed);
  return {
    index: peers.findIndex(candidate => candidate.id === item.id),
    total: peers.length
  };
}

function taskSettings(item, parentId, state, index, total, canIndent) {
  if (state.openSettingsId !== item.id) return '';
  const isSubtask = Boolean(parentId);
  return `
    <div class="zen-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <div class="zen-task-setting-copy">
        <strong>Task settings</strong>
        <small>${isSubtask ? 'This is currently a subtask.' : item.main ? 'This task can contain subtasks.' : 'Keep it simple or make it a main task.'}</small>
      </div>
      ${isSubtask ? `
        <button data-action="unindent-task" ${taskPath(item, parentId)}>Make regular task</button>` : `
        <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
        ${!item.main && canIndent ? `<button data-action="indent-task" ${taskPath(item)}>Make subtask of previous</button>` : ''}`}
      <div class="zen-task-move-controls" aria-label="Move task">
        <button data-action="move-task-up" ${taskPath(item, parentId)} ${index === 0 ? 'disabled' : ''}>Move up</button>
        <button data-action="move-task-down" ${taskPath(item, parentId)} ${index === total - 1 ? 'disabled' : ''}>Move down</button>
      </div>
    </div>`;
}

function taskRow(item, state, { parentId = '', index = 0, total = 1, canIndent = false } = {}) {
  const isSubtask = Boolean(parentId);
  const title = item.title || 'Untitled task';
  const settingsOpen = state.openSettingsId === item.id;
  return `
    <div class="zen-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="zen-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder" title="Drag to reorder"><span aria-hidden="true">⋮⋮</span></button>
      <button class="zen-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="zen-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="New task">
      <span class="zen-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time)}</span>
      <button class="zen-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} settings for ${esc(title)}">›</button>
      ${item.main && !isSubtask ? `<button class="zen-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="zen-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total, canIndent)}`;
}

function mainTask(item, state, visibleItems) {
  const progress = taskProgress(item);
  const movement = movementFor(item, visibleItems);
  const itemIndex = visibleItems.findIndex(candidate => candidate.id === item.id);
  const previous = visibleItems[itemIndex - 1];
  const canIndent = Boolean(previous && previous.completed === item.completed && !item.children.length);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="zen-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="zen-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <div><strong>${progress.total ? `${progress.done} of ${progress.total} subtasks` : 'No subtasks yet'}</strong><span>${progress.percent}%</span></div>
          <span class="zen-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></span>
        </div>` : ''}
      ${taskRow(item, state, { ...movement, canIndent })}
      ${item.main ? `
        <div class="zen-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map(child => {
            const childMovement = movementFor(child, visibleChildren);
            return taskRow(child, state, {
              parentId: item.id,
              ...childMovement
            });
          }).join('') || '<p class="zen-task-quiet">No visible subtasks. Use the plus button to add one.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksZen(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;

  return `
    <section class="zen-page zen-tasks-page" aria-label="Tasks checklist">
      <header class="zen-task-header">
        <div>
          <span class="zen-eyebrow">Tasks</span>
          <h1>${remainingCount ? 'A simple list for what matters now.' : 'Your list is clear.'}</h1>
          <p>${remainingCount ? `${remainingCount} regular or main tasks remain. Completed items move to the bottom.` : 'Add another task whenever something needs a place to live.'}</p>
        </div>
        <button class="zen-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <div class="zen-task-toolbar">
        <span>${state.tasks.length} total · ${completedCount} completed</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'Show completed' : 'Hide completed'}</button>
      </div>

      <section class="zen-task-list" aria-label="Task list">
        ${visible.length ? visible.map(item => mainTask(item, state, visible)).join('') : `
          <article class="zen-task-empty">
            <span aria-hidden="true">✓</span>
            <h2>${state.tasks.length ? 'Completed tasks are hidden.' : 'Nothing here yet.'}</h2>
            <p>${state.tasks.length ? 'Show completed items or add a new task.' : 'Use either plus button to create an empty editable task.'}</p>
          </article>`}
      </section>

      <button class="zen-task-bottom-add" data-action="add-task-bottom">＋ Add task</button>
      <p class="zen-task-gesture-note">Drag the left handle to reorder. Settings also provide Move, Indent, and Unindent controls.</p>
    </section>`;
}
