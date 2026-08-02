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
    <section class="rd-task-settings" aria-label="Options for ${esc(item.title || 'untitled task')}">
      <header><strong>OPTION DIRECTORY</strong><span>${isSubtask ? 'SUBTASK' : item.main ? 'MAIN TASK' : 'REGULAR TASK'}</span></header>
      <p>${isSubtask ? 'Move this entry or return it to the main directory.' : item.main ? 'Turning off main-task mode returns each subtask to the regular task directory.' : 'Keep this entry independent, make it a main task, or place it under the preceding task.'}</p>
      <div class="rd-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>MAKE REGULAR TASK</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'TURN OFF MAIN TASK' : 'SET AS MAIN TASK'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>PLACE UNDER PREVIOUS</button>` : ''}`}
        <button data-action="move-task-up" ${taskPath(item, parentId)} ${index === 0 ? 'disabled' : ''}>MOVE UP</button>
        <button data-action="move-task-down" ${taskPath(item, parentId)} ${index === total - 1 ? 'disabled' : ''}>MOVE DOWN</button>
      </div>
    </section>`;
}

function taskRow(item, state, { parentId = '', index = 0, total = 1 } = {}) {
  const isSubtask = Boolean(parentId);
  const title = item.title || 'Untitled task';
  const settingsOpen = state.openSettingsId === item.id;
  return `
    <div class="rd-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="rd-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder"><span aria-hidden="true">::</span></button>
      <button class="rd-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '[✓]' : '[ ]'}</span></button>
      <input class="rd-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="NEW TASK ENTRY">
      <span class="rd-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '--')}</span>
      <button class="rd-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} options for ${esc(title)}">&gt;</button>
      ${item.main && !isSubtask ? `<button class="rd-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">[+]</button>` : '<span class="rd-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="rd-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="rd-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <span>MAIN TASK STATUS</span>
          <strong>${String(progress.done).padStart(2, '0')} / ${String(progress.total).padStart(2, '0')}</strong>
          <div class="rd-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
          <b>${String(progress.percent).padStart(3, '0')}%</b>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="rd-subtask-directory" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="rd-task-quiet">NO VISIBLE SUBTASKS // USE [+] TO ADD ONE</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksRetro(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="rd-page rd-tasks-page" aria-label="Tasks checklist">
      <header class="rd-task-header">
        <div>
          <span>NUDGE OS / TASK DIRECTORY</span>
          <h1>${remainingCount ? 'TASK DIRECTORY' : 'DIRECTORY CLEAR'}</h1>
          <p>${remainingCount ? 'Available entries appear before completed entries. Every action remains optional.' : 'Add another task whenever there is something useful to track.'}</p>
        </div>
        <button class="rd-task-top-add" data-action="add-task-top" aria-label="Add task at top">[+]</button>
      </header>

      <div class="rd-task-display" aria-label="Task summary">
        <div><small>AVAILABLE</small><strong>${String(remainingCount).padStart(2, '0')}</strong></div>
        <div><small>MAIN TASKS</small><strong>${String(mainCount).padStart(2, '0')}</strong></div>
        <div><small>COMPLETE</small><strong>${String(completedCount).padStart(2, '0')}</strong></div>
      </div>

      <div class="rd-task-command">
        <span>DIRECTORY // ${String(state.tasks.length).padStart(2, '0')} TOTAL ENTRIES</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'SHOW COMPLETE' : 'HIDE COMPLETE'}</button>
      </div>

      <div class="rd-task-columns" aria-hidden="true"><span>MOVE</span><span>STATE</span><span>TASK ENTRY</span><span>TIME</span><span>OPT</span><span>SUB</span></div>

      <section class="rd-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="rd-task-empty">
            <strong>[ 00 ]</strong>
            <h2>${state.tasks.length ? 'COMPLETE ENTRIES HIDDEN' : 'DIRECTORY READY'}</h2>
            <p>${state.tasks.length ? 'Show completed entries or add a new task.' : 'Either add control creates an empty editable task entry.'}</p>
          </article>`}
      </section>

      <button class="rd-task-bottom-add" data-action="add-task-bottom">[ + ADD TASK ]</button>
      <p class="rd-task-note">DRAG HANDLE TO REORDER // OPTIONS INCLUDE MOVE, INDENT, AND UNINDENT</p>
    </section>`;
}
