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
    <section class="bu-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <header><strong>CONTROLS</strong><span>${isSubtask ? 'SUBTASK' : item.main ? 'MAIN TASK' : 'REGULAR TASK'}</span></header>
      <p>${isSubtask ? 'Move this item or return it to the main task list.' : item.main ? 'Turning off main-task mode releases every subtask as a regular task.' : 'Keep this independent, make it a main task, or place it under the previous task.'}</p>
      <div class="bu-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>MAKE REGULAR TASK</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'TURN OFF MAIN TASK' : 'SET AS MAIN TASK'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>INDENT UNDER PREVIOUS</button>` : ''}`}
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
    <div class="bu-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="bu-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder"><span aria-hidden="true">↕</span></button>
      <button class="bu-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : '×'}</span></button>
      <input class="bu-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="NEW TASK">
      <span class="bu-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '—')}</span>
      <button class="bu-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} settings for ${esc(title)}">→</button>
      ${item.main && !isSubtask ? `<button class="bu-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="bu-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="bu-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="bu-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <span>MAIN TASK PROGRESS</span>
          <strong>${String(progress.done).padStart(2, '0')} / ${String(progress.total).padStart(2, '0')}</strong>
          <div class="bu-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
          <b>${progress.percent}%</b>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="bu-subtask-list" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="bu-task-quiet">NO VISIBLE SUBTASKS. USE + TO ADD ONE.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksBold(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="bu-page bu-tasks-page" aria-label="Tasks checklist">
      <header class="bu-task-header">
        <div><span>NUDGE / TASKS</span><h1>${remainingCount ? 'TASKS IN\nMOTION.' : 'QUEUE\nCLEAR.'}</h1><p>${remainingCount ? 'One list. Direct controls. Completed work stays below active work.' : 'Add another task when there is something useful to track.'}</p></div>
        <button class="bu-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <div class="bu-task-summary" aria-label="Task summary">
        <div><strong>${String(remainingCount).padStart(2, '0')}</strong><span>ACTIVE</span></div>
        <div><strong>${String(mainCount).padStart(2, '0')}</strong><span>MAIN</span></div>
        <div><strong>${String(completedCount).padStart(2, '0')}</strong><span>DONE</span></div>
      </div>

      <div class="bu-task-toolbar">
        <strong>${String(state.tasks.length).padStart(2, '0')} TOTAL</strong>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'SHOW COMPLETED' : 'HIDE COMPLETED'}</button>
      </div>

      <div class="bu-task-columns" aria-hidden="true"><span>MOVE</span><span>DONE</span><span>TASK</span><span>TIME</span><span>MORE</span><span>SUB</span></div>

      <section class="bu-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="bu-task-empty">
            <strong>00</strong>
            <h2>${state.tasks.length ? 'COMPLETED ITEMS HIDDEN.' : 'NO TASKS YET.'}</h2>
            <p>${state.tasks.length ? 'Show completed items or add another task.' : 'Use either plus control to create an empty editable row.'}</p>
          </article>`}
      </section>

      <button class="bu-task-bottom-add" data-action="add-task-bottom">＋ ADD TASK</button>
      <p class="bu-task-note">DRAG TO REORDER. SETTINGS PROVIDE MOVE / INDENT / UNINDENT.</p>
    </section>`;
}
