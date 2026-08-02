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
    <div class="pm-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <div class="pm-task-settings-head">
        <strong>Task controls</strong>
        <span>${isSubtask ? 'SUBTASK' : item.main ? 'MAIN TASK' : 'REGULAR TASK'}</span>
      </div>
      <p>${isSubtask ? 'Move this item independently or return it to the main list.' : item.main ? 'Turning off main-task mode releases every subtask as a regular task.' : 'Keep this independent, promote it, or place it under the previous task.'}</p>
      <div class="pm-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>Make regular task</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>Indent under previous</button>` : ''}`}
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
    <div class="pm-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="pm-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder" title="Drag to reorder"><span aria-hidden="true">⋮⋮</span></button>
      <button class="pm-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="pm-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="New task">
      <span class="pm-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '—')}</span>
      <button class="pm-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} settings for ${esc(title)}">›</button>
      ${item.main && !isSubtask ? `<button class="pm-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="pm-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="pm-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="pm-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <span>SUBTASK PROGRESS</span>
          <strong>${progress.done}/${progress.total}</strong>
          <div class="pm-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
          <b>${progress.percent}%</b>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="pm-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="pm-task-quiet">NO VISIBLE SUBTASKS — USE + TO ADD ONE</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksPrecision(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="pm-page pm-tasks-page" aria-label="Tasks checklist">
      <header class="pm-task-header">
        <div>
          <span class="pm-kicker">TASKS / ACTIVE QUEUE</span>
          <h1>${remainingCount ? 'Task register' : 'Queue clear'}</h1>
          <p>${remainingCount ? 'Edit directly. Completed work is retained below active work.' : 'Add a task from either plus control when another item needs tracking.'}</p>
        </div>
        <button class="pm-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <div class="pm-task-metrics" aria-label="Task summary">
        <div><strong>${String(remainingCount).padStart(2, '0')}</strong><span>ACTIVE</span></div>
        <div><strong>${String(mainCount).padStart(2, '0')}</strong><span>MAIN</span></div>
        <div><strong>${String(completedCount).padStart(2, '0')}</strong><span>DONE</span></div>
      </div>

      <div class="pm-task-toolbar">
        <span>${state.tasks.length} TOTAL ITEMS</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'SHOW COMPLETED' : 'HIDE COMPLETED'}</button>
      </div>

      <div class="pm-task-columns" aria-hidden="true">
        <span>MOVE</span><span>DONE</span><span>TASK</span><span>TIME</span><span>MORE</span><span>SUB</span>
      </div>

      <section class="pm-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="pm-task-empty">
            <span>00</span>
            <h2>${state.tasks.length ? 'Completed items are hidden.' : 'No tasks recorded.'}</h2>
            <p>${state.tasks.length ? 'Show completed items or create a new task.' : 'Both plus controls create an empty editable row.'}</p>
          </article>`}
      </section>

      <button class="pm-task-bottom-add" data-action="add-task-bottom">＋ ADD TASK</button>
      <p class="pm-task-gesture-note">DRAG HANDLE TO REORDER · SETTINGS PROVIDE MOVE / INDENT / UNINDENT</p>
    </section>`;
}
