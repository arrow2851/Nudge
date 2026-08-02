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
    <section class="th-task-settings" aria-label="Settings for ${esc(item.title || 'untitled task')}">
      <div class="th-task-settings-label"><span>WORK CARD OPTIONS</span><b>${isSubtask ? 'SUBTASK' : item.main ? 'MAIN TASK' : 'TASK'}</b></div>
      <p>${isSubtask ? 'Move this card within its group or return it to the main task stack.' : item.main ? 'Turning off main-task mode returns each subtask to the regular task stack.' : 'Keep this card independent, make it a main task, or file it under the previous task.'}</p>
      <div class="th-task-settings-grid">
        ${isSubtask ? `
          <button data-action="unindent-task" ${taskPath(item, parentId)}>Return to task stack</button>` : `
          <button data-action="toggle-main-task" ${taskPath(item)} aria-pressed="${item.main}">${item.main ? 'Turn off main task' : 'Set as main task'}</button>
          ${!item.main && index > 0 ? `<button data-action="indent-task" ${taskPath(item)}>File under previous task</button>` : ''}`}
        <button data-action="move-task-up" ${taskPath(item, parentId)} ${index === 0 ? 'disabled' : ''}>Move card up</button>
        <button data-action="move-task-down" ${taskPath(item, parentId)} ${index === total - 1 ? 'disabled' : ''}>Move card down</button>
      </div>
    </section>`;
}

function taskRow(item, state, { parentId = '', index = 0, total = 1 } = {}) {
  const isSubtask = Boolean(parentId);
  const title = item.title || 'Untitled task';
  const settingsOpen = state.openSettingsId === item.id;
  return `
    <div class="th-task-row ${isSubtask ? 'subtask' : ''} ${item.completed ? 'completed' : ''}" ${taskPath(item, parentId)} data-task-drop="true">
      <button class="th-task-drag" draggable="true" data-task-drag="true" ${taskPath(item, parentId)} aria-label="Drag ${esc(title)} to reorder"><span class="th-task-grip" aria-hidden="true"></span></button>
      <button class="th-task-check" data-action="toggle-task-completion" ${taskPath(item, parentId)} aria-label="${item.completed ? 'Reopen' : 'Complete'} ${esc(title)}"><span aria-hidden="true">${item.completed ? '✓' : ''}</span></button>
      <input class="th-task-title" value="${esc(item.title)}" data-task-title="true" ${taskPath(item, parentId)} aria-label="Task name" placeholder="Write task name">
      <span class="th-task-time" aria-label="${item.time ? `Time indicator ${esc(item.time)}` : 'No time indicator'}">${esc(item.time || '—')}</span>
      <button class="th-task-disclosure" data-action="toggle-task-settings" ${taskPath(item, parentId)} aria-expanded="${settingsOpen}" aria-label="${settingsOpen ? 'Close' : 'Open'} settings for ${esc(title)}"><span class="th-task-drawer-pull" aria-hidden="true"></span></button>
      ${item.main && !isSubtask ? `<button class="th-task-subtask-add" data-action="add-subtask" ${taskPath(item)} aria-label="Add subtask to ${esc(title)}">＋</button>` : '<span class="th-task-add-spacer" aria-hidden="true"></span>'}
    </div>
    ${taskSettings(item, parentId, state, index, total)}`;
}

function taskCluster(item, state, index, total) {
  const progress = taskProgress(item);
  const visibleChildren = state.hideCompleted
    ? item.children.filter(child => !child.completed)
    : sortedTasks(item.children);
  return `
    <article class="th-task-cluster ${item.main ? 'main-task' : ''} ${item.completed ? 'completed' : ''}" data-task-cluster="${esc(item.id)}">
      ${item.main ? `
        <div class="th-task-progress" aria-label="${progress.done} of ${progress.total} subtasks complete">
          <span class="th-task-progress-tab">MAIN TASK</span>
          <div><strong>${progress.done} of ${progress.total} subtasks complete</strong><small>${progress.percent}% filed as done</small></div>
          <div class="th-task-progress-track" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
        </div>` : ''}
      ${taskRow(item, state, { index, total })}
      ${item.main ? `
        <div class="th-subtask-drawer" aria-label="Subtasks for ${esc(item.title || 'untitled task')}">
          <div class="th-subtask-drawer-label"><span class="th-drawer-pull" aria-hidden="true"></span><b>SUBTASK DRAWER</b></div>
          ${visibleChildren.map((child, childIndex) => taskRow(child, state, {
            parentId: item.id,
            index: childIndex,
            total: visibleChildren.length
          })).join('') || '<p class="th-task-quiet">No visible subtasks. Use + to add one.</p>'}
        </div>` : ''}
    </article>`;
}

export function renderTasksTactile(state) {
  const ordered = sortedTasks(state.tasks);
  const visible = state.hideCompleted ? ordered.filter(item => !item.completed) : ordered;
  const completedCount = state.tasks.filter(item => item.completed).length;
  const remainingCount = state.tasks.filter(item => !item.completed).length;
  const mainCount = state.tasks.filter(item => item.main).length;

  return `
    <section class="th-page th-tasks-page" aria-label="Tasks checklist">
      <header class="th-task-header">
        <div><span class="th-label">HOUSEHOLD TASK BOARD</span><h1>${remainingCount ? 'Task cards ready when you are.' : 'Task board is clear.'}</h1><p>${remainingCount ? 'Keep the useful next steps together. Completed cards stay filed below active cards.' : 'Add another card whenever there is something worth remembering.'}</p></div>
        <button class="th-task-top-add" data-action="add-task-top" aria-label="Add task at top">＋</button>
      </header>

      <section class="th-task-summary" aria-label="Task summary">
        <div><span>ACTIVE CARDS</span><strong>${String(remainingCount).padStart(2, '0')}</strong></div>
        <div><span>MAIN TASKS</span><strong>${String(mainCount).padStart(2, '0')}</strong></div>
        <div><span>FILED DONE</span><strong>${String(completedCount).padStart(2, '0')}</strong></div>
      </section>

      <div class="th-task-toolbar">
        <span class="th-panel-label">TASK CARD STACK · ${String(state.tasks.length).padStart(2, '0')}</span>
        <button data-action="toggle-completed-visibility" data-hide-completed="${!state.hideCompleted}" aria-pressed="${state.hideCompleted}">${state.hideCompleted ? 'Show completed cards' : 'Hide completed cards'}</button>
      </div>

      <div class="th-task-columns" aria-hidden="true"><span>MOVE</span><span>DONE</span><span>TASK CARD</span><span>TIME</span><span>OPTIONS</span><span>SUB</span></div>

      <section class="th-task-list" aria-label="Task list">
        ${visible.length ? visible.map((item, index) => taskCluster(item, state, index, visible.length)).join('') : `
          <article class="th-task-empty">
            <span class="th-paperclip" aria-hidden="true"></span>
            <strong>${state.tasks.length ? 'Completed cards are filed away.' : 'No task cards yet.'}</strong>
            <p>${state.tasks.length ? 'Show completed cards or add a new one.' : 'Use either plus control to create an empty editable card.'}</p>
          </article>`}
      </section>

      <button class="th-task-bottom-add" data-action="add-task-bottom">＋ Add task card</button>
      <p class="th-task-note">Drag a card to reorder. Options also provide Move, Indent, and Unindent.</p>
    </section>`;
}
