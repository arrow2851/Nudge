import { LOOKS } from './config.js';
import { getScenario } from './fixtures.js';
import { renderReviewControls } from './controls.js';
import { clearStoredState, commitState, defaultState, readStateFromLocation } from './state.js';
import { applyRoutineState, clearInteractiveState, completeRoutine, findRoutine, reopenRoutine } from './interactive-state.js';
import {
  applyInterventionState,
  clearInterventionState,
  completeInterventionAction,
  dismissIntervention,
  reopenInterventionAction,
  resumeIntervention,
  showNextInterventionSuggestion,
  startInterventionAction,
  undoInterventionStart
} from './intervention-state.js';
import {
  addTask,
  clearTaskState,
  getTaskState,
  indentTask,
  moveTask,
  moveTaskBefore,
  setHideCompleted,
  toggleMainTask,
  toggleTaskCompletion,
  toggleTaskSettings,
  unindentTask,
  updateTaskTitle
} from './task-state.js';
import { renderAreaDetail, renderAreasEditorial, renderChoreEditorial, renderInterventionEditorial, renderSectionEditorial, renderTodayEditorial } from './renderers/look2.js';
import { renderTasksEditorial } from './renderers/look2-tasks.js';
import { renderAreaDetailPrecision, renderAreasPrecision, renderChorePrecision, renderSectionPrecision, renderTodayPrecision } from './renderers/look3.js';
import { renderInterventionPrecisionAction } from './renderers/look3-intervention.js';
import { renderTasksPrecision } from './renderers/look3-tasks.js';
import { renderAreaDetailZen, renderAreasZen, renderChoreZen, renderInterventionZen, renderSectionZen, renderTodayZen } from './renderers/look4.js';
import { renderTasksZen } from './renderers/look4-tasks.js';
import { renderAreaDetailPlayful, renderAreasPlayful, renderChorePlayful, renderSectionPlayful, renderTodayPlayful } from './renderers/look5.js';
import { renderInterventionPlayfulAction } from './renderers/look5-intervention.js';
import { renderTasksPlayful } from './renderers/look5-tasks.js';
import { renderAreaDetailTactile, renderAreasTactile, renderChoreTactile, renderInterventionTactile, renderSectionTactile, renderTodayTactile } from './renderers/look6.js';
import { renderTasksTactile } from './renderers/look6-tasks.js';
import { renderAreaDetailBold, renderAreasBold, renderChoreBold, renderInterventionBold, renderSectionBold, renderTodayBold } from './renderers/look7.js';
import { renderTasksBold } from './renderers/look7-tasks.js';
import { renderAreaDetailAmbient, renderAreasAmbient, renderChoreAmbient, renderInterventionAmbient, renderSectionAmbient, renderTodayAmbient } from './renderers/look8.js';
import { renderTasksAmbient } from './renderers/look8-tasks.js';
import { renderAreaDetailRetro, renderAreasRetro, renderChoreRetro, renderInterventionRetro, renderSectionRetro, renderTodayRetro } from './renderers/look9.js';
import { renderTasksRetro } from './renderers/look9-tasks.js';
import { renderUnsupported } from './renderers/shared.js';
import { esc } from './utils.js';

const INTERACTIVE_LOOKS = new Set([2, 3, 4, 5, 6, 7, 8, 9]);
const TASK_HIERARCHY_LOOKS = new Set([2, 3, 4, 5, 6, 7, 8, 9]);
const INTERVENTION_ACTION_LOOKS = new Set([3, 4, 5]);

const ROUTINE_RENDERERS = new Map([
  [2, { today: renderTodayEditorial, areas: renderAreasEditorial, area: renderAreaDetail, section: renderSectionEditorial, chore: renderChoreEditorial, intervention: renderInterventionEditorial }],
  [3, { today: renderTodayPrecision, areas: renderAreasPrecision, area: renderAreaDetailPrecision, section: renderSectionPrecision, chore: renderChorePrecision, intervention: renderInterventionPrecisionAction }],
  [4, { today: renderTodayZen, areas: renderAreasZen, area: renderAreaDetailZen, section: renderSectionZen, chore: renderChoreZen, intervention: renderInterventionZen }],
  [5, { today: renderTodayPlayful, areas: renderAreasPlayful, area: renderAreaDetailPlayful, section: renderSectionPlayful, chore: renderChorePlayful, intervention: renderInterventionPlayfulAction }],
  [6, { today: renderTodayTactile, areas: renderAreasTactile, area: renderAreaDetailTactile, section: renderSectionTactile, chore: renderChoreTactile, intervention: renderInterventionTactile }],
  [7, { today: renderTodayBold, areas: renderAreasBold, area: renderAreaDetailBold, section: renderSectionBold, chore: renderChoreBold, intervention: renderInterventionBold }],
  [8, { today: renderTodayAmbient, areas: renderAreasAmbient, area: renderAreaDetailAmbient, section: renderSectionAmbient, chore: renderChoreAmbient, intervention: renderInterventionAmbient }],
  [9, { today: renderTodayRetro, areas: renderAreasRetro, area: renderAreaDetailRetro, section: renderSectionRetro, chore: renderChoreRetro, intervention: renderInterventionRetro }]
]);

const TASK_RENDERERS = new Map([
  [2, renderTasksEditorial],
  [3, renderTasksPrecision],
  [4, renderTasksZen],
  [5, renderTasksPlayful],
  [6, renderTasksTactile],
  [7, renderTasksBold],
  [8, renderTasksAmbient],
  [9, renderTasksRetro]
]);

let state = readStateFromLocation();
let currentSourceData = null;
let currentData = null;
let currentTasks = null;
let draggedTask = null;

const elements = {
  screen: document.querySelector('#screen'),
  lookControls: document.querySelector('#look-controls'),
  screenControls: document.querySelector('#screen-controls'),
  scenarioControls: document.querySelector('#scenario-controls'),
  toastRoot: document.querySelector('#toast-root')
};

function renderRoutine(lookId, data) {
  const renderer = ROUTINE_RENDERERS.get(lookId)?.[state.view];
  if (!renderer) return renderUnsupported('This interactive screen is implemented in every active Design Lab Look.');
  if (state.view === 'area') return renderer(data, state.areaId, renderUnsupported);
  if (state.view === 'section') return renderer(data, state.areaId, state.sectionId, renderUnsupported);
  if (state.view === 'chore') return renderer(data, state.areaId, state.sectionId, state.choreId, renderUnsupported);
  return renderer(data);
}

function renderLook(look, data, tasks) {
  if (state.view === 'tasks') {
    const renderer = TASK_RENDERERS.get(look.id);
    return renderer
      ? renderer(tasks)
      : renderUnsupported('Task hierarchy is implemented in every active Design Lab Look.');
  }
  return renderRoutine(look.id, data);
}

function syncBottomNavigation() {
  const areasActive = ['areas', 'area', 'section', 'chore'].includes(state.view);
  document.querySelectorAll('[data-nav]').forEach(button => {
    const active = button.dataset.nav === 'today'
      ? state.view === 'today'
      : button.dataset.nav === 'areas'
        ? areasActive
        : button.dataset.nav === 'tasks'
          ? state.view === 'tasks'
          : false;
    button.classList.toggle('active', active);
  });
}

function resetPath() {
  state.areaId = null;
  state.sectionId = null;
  state.choreId = null;
}

function normalizeStateForData(data) {
  if (state.view === 'tasks' || !['area', 'section', 'chore'].includes(state.view)) return;
  const area = data.areas.find(item => item.id === state.areaId);
  if (!area) {
    state.view = INTERACTIVE_LOOKS.has(state.look) ? 'today' : 'areas';
    resetPath();
    return;
  }

  if (state.view === 'section') {
    const sections = new Set(area.routines.map(item => item.section || 'General'));
    if (area.unconfigured) sections.add(area.unconfigured);
    if (!sections.has(state.sectionId)) {
      state.view = 'area';
      state.sectionId = null;
    }
  }

  if (state.view === 'chore') {
    const routine = area.routines.find(item => item.id === state.choreId);
    if (!routine) {
      state.view = state.sectionId ? 'section' : 'area';
      state.choreId = null;
    } else if (!state.sectionId) {
      state.sectionId = routine.section || 'General';
    }
  }
}

function render({ routeAction = 'none' } = {}) {
  currentSourceData = applyRoutineState(getScenario(state.scenario), state.scenario);
  currentData = applyInterventionState(currentSourceData, state.scenario);
  currentTasks = getTaskState(state.scenario);
  normalizeStateForData(currentData);
  const look = renderReviewControls(state, currentData, elements);
  document.documentElement.dataset.textScale = currentData.textScale || 'normal';
  document.documentElement.dataset.look = String(look.id);
  elements.screen.innerHTML = renderLook(look, currentData, currentTasks);
  elements.screen.scrollTop = 0;
  syncBottomNavigation();
  if (routeAction === 'push') commitState(state);
  if (routeAction === 'replace') commitState(state, { replace: true });
}

function showToast(message) {
  elements.toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { elements.toastRoot.innerHTML = ''; }, 2600);
}

function focusTask(id) {
  requestAnimationFrame(() => {
    const input = [...document.querySelectorAll('input[data-task-title]')]
      .find(element => element.dataset.taskId === id);
    input?.focus();
    input?.select();
  });
}

function resetReviewState() {
  state = defaultState();
  clearStoredState();
  clearInteractiveState();
  clearTaskState();
  clearInterventionState();
  render({ routeAction: 'push' });
  showToast('Design Lab, routine, task, and intervention state reset.');
}

function setView(view) {
  state.view = view;
  resetPath();
  render({ routeAction: 'push' });
}

function openArea(areaId) {
  state.view = 'area';
  state.areaId = areaId;
  state.sectionId = null;
  state.choreId = null;
  render({ routeAction: 'push' });
}

function openSection(areaId, sectionId) {
  state.view = 'section';
  state.areaId = areaId;
  state.sectionId = sectionId || 'General';
  state.choreId = null;
  render({ routeAction: 'push' });
}

function openChore(areaId, sectionId, choreId) {
  state.view = 'chore';
  state.areaId = areaId;
  state.sectionId = sectionId || 'General';
  state.choreId = choreId;
  render({ routeAction: 'push' });
}

function routineFromTarget(target) {
  return findRoutine(currentData, target.dataset.areaId || state.areaId, target.dataset.choreId || state.choreId);
}

function taskIdFromTarget(target) {
  return target.dataset.taskId;
}

function interventionEnabled() {
  return INTERVENTION_ACTION_LOOKS.has(state.look) && state.view === 'intervention';
}

function runAction(action, target) {
  const actions = {
    'back-areas': () => setView('areas'),
    'open-areas': () => setView('areas'),
    'back-area': () => openArea(state.areaId),
    'back-section': () => state.sectionId ? openSection(state.areaId, state.sectionId) : openArea(state.areaId),
    'return-today': () => setView('today'),
    'reset-review': resetReviewState,
    'reset-route': resetReviewState,
    'complete-routine': () => {
      const { area, routine } = routineFromTarget(target);
      const completion = completeRoutine(state.scenario, routine);
      if (!area || !routine || !completion) return;
      const routeChanged = state.view !== 'chore' || state.choreId !== routine.id;
      state.view = 'chore';
      state.areaId = area.id;
      state.sectionId = routine.section || 'General';
      state.choreId = routine.id;
      render({ routeAction: routeChanged ? 'push' : 'none' });
      showToast(`Completed. ${completion.nextLabel}.`);
    },
    'reopen-routine': () => {
      const { routine } = routineFromTarget(target);
      if (!routine || !reopenRoutine(state.scenario, routine.id)) return;
      render();
      showToast('Completion undone. The routine is back in its previous state.');
    },
    'start-intervention': () => {
      if (!interventionEnabled()) return;
      const { result } = startInterventionAction(currentSourceData, state.scenario);
      if (!result) return;
      render();
      showToast(`Started: ${result.task}.`);
    },
    'next-intervention': () => {
      if (!interventionEnabled()) return;
      const { result } = showNextInterventionSuggestion(currentSourceData, state.scenario);
      render();
      if (result) showToast(`Another option: ${result.task}.`);
    },
    'dismiss-intervention': () => {
      if (!interventionEnabled()) return;
      dismissIntervention(currentSourceData, state.scenario);
      render();
      showToast('Suggestion dismissed. Nothing else changed.');
    },
    'resume-intervention': () => {
      if (!interventionEnabled()) return;
      resumeIntervention(currentSourceData, state.scenario);
      render();
    },
    'complete-intervention': () => {
      if (!interventionEnabled()) return;
      if (!completeInterventionAction(currentSourceData, state.scenario).result) return;
      render();
      showToast('Small action completed.');
    },
    'reopen-intervention': () => {
      if (!interventionEnabled()) return;
      if (!reopenInterventionAction(currentSourceData, state.scenario).result) return;
      render();
      showToast('Action reopened.');
    },
    'undo-intervention': () => {
      if (!interventionEnabled()) return;
      if (!undoInterventionStart(currentSourceData, state.scenario).result) return;
      render();
      showToast('Start undone. The suggestion is available again.');
    },
    'add-task-top': () => {
      const { result } = addTask(state.scenario, { position: 'top' });
      render();
      if (result) focusTask(result);
    },
    'add-task-bottom': () => {
      const { result } = addTask(state.scenario, { position: 'bottom' });
      render();
      if (result) focusTask(result);
    },
    'add-subtask': () => {
      const { result } = addTask(state.scenario, { parentId: taskIdFromTarget(target) });
      render();
      if (result) focusTask(result);
    },
    'toggle-task-completion': () => {
      const { result } = toggleTaskCompletion(state.scenario, taskIdFromTarget(target));
      render();
      showToast(result ? 'Task completed.' : 'Task reopened.');
    },
    'toggle-task-settings': () => {
      toggleTaskSettings(state.scenario, taskIdFromTarget(target));
      render();
    },
    'toggle-main-task': () => {
      const { result } = toggleMainTask(state.scenario, taskIdFromTarget(target));
      render();
      if (result?.released) showToast(`${result.released} subtasks became regular tasks.`);
      else showToast(result?.main ? 'Main task enabled.' : 'Main task disabled.');
    },
    'move-task-up': () => {
      if (moveTask(state.scenario, taskIdFromTarget(target), -1).result) render();
    },
    'move-task-down': () => {
      if (moveTask(state.scenario, taskIdFromTarget(target), 1).result) render();
    },
    'indent-task': () => {
      const moved = indentTask(state.scenario, taskIdFromTarget(target)).result;
      render();
      showToast(moved ? 'Task moved under the previous task.' : 'This task cannot be indented here.');
    },
    'unindent-task': () => {
      const moved = unindentTask(state.scenario, taskIdFromTarget(target)).result;
      render();
      showToast(moved ? 'Subtask became a regular task.' : 'This task is already at the top level.');
    },
    'toggle-completed-visibility': () => {
      setHideCompleted(state.scenario, target.dataset.hideCompleted === 'true');
      render();
    },
    'demo-add-area': () => showToast('Area creation remains outside this interactive slice.'),
    'start-demo': () => showToast('Intervention-to-action is currently implemented in Looks #3, #4, and #5.'),
    'different-demo': () => showToast('Alternative suggestion behavior is currently implemented in Looks #3, #4, and #5.'),
    'not-now-demo': () => showToast('Intervention dismissed without guilt.')
  };
  actions[action]?.();
}

document.addEventListener('input', event => {
  const title = event.target.closest('input[data-task-title]');
  if (!title) return;
  updateTaskTitle(state.scenario, title.dataset.taskId, title.value);
});

document.addEventListener('dragstart', event => {
  const handle = event.target.closest('[data-task-drag]');
  if (!handle) return;
  draggedTask = { id: handle.dataset.taskId, parentId: handle.dataset.parentId || '' };
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedTask.id);
});

document.addEventListener('dragover', event => {
  const target = event.target.closest('[data-task-drop]');
  if (!target || !draggedTask || (target.dataset.parentId || '') !== draggedTask.parentId) return;
  event.preventDefault();
  target.classList.add('drag-over');
});

document.addEventListener('dragleave', event => {
  event.target.closest('[data-task-drop]')?.classList.remove('drag-over');
});

document.addEventListener('drop', event => {
  const target = event.target.closest('[data-task-drop]');
  document.querySelectorAll('.drag-over').forEach(item => item.classList.remove('drag-over'));
  if (!target || !draggedTask) return;
  event.preventDefault();
  const moved = moveTaskBefore(
    state.scenario,
    draggedTask.id,
    target.dataset.taskId,
    draggedTask.parentId,
    target.dataset.parentId || ''
  ).result;
  draggedTask = null;
  if (moved) render();
});

document.addEventListener('dragend', () => {
  draggedTask = null;
  document.querySelectorAll('.drag-over').forEach(item => item.classList.remove('drag-over'));
});

document.addEventListener('click', event => {
  const lookButton = event.target.closest('button[data-look]');
  if (lookButton) {
    const requested = Number(lookButton.dataset.look);
    state.look = LOOKS.some(look => look.id === requested) ? requested : 5;
    render({ routeAction: 'push' });
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    setView(viewButton.dataset.view);
    return;
  }

  const scenarioButton = event.target.closest('[data-scenario]');
  if (scenarioButton) {
    state.scenario = scenarioButton.dataset.scenario;
    render({ routeAction: 'push' });
    return;
  }

  const actionTarget = event.target.closest('[data-action]');
  if (actionTarget) {
    runAction(actionTarget.dataset.action, actionTarget);
    return;
  }

  const choreButton = event.target.closest('[data-chore-id]');
  if (choreButton) {
    openChore(choreButton.dataset.areaId || state.areaId, choreButton.dataset.sectionId || state.sectionId, choreButton.dataset.choreId);
    return;
  }

  const sectionButton = event.target.closest('[data-section-id]');
  if (sectionButton) {
    openSection(sectionButton.dataset.areaId || state.areaId, sectionButton.dataset.sectionId);
    return;
  }

  const areaButton = event.target.closest('[data-area-id]');
  if (areaButton) {
    openArea(areaButton.dataset.areaId);
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    if (nav.dataset.nav === 'today') setView('today');
    else if (nav.dataset.nav === 'areas') setView('areas');
    else if (nav.dataset.nav === 'tasks') setView('tasks');
    else showToast('Reusable Lists follow after the Intervention-to-action loop.');
  }
});

window.addEventListener('popstate', () => {
  state = readStateFromLocation();
  render();
});

document.querySelector('#status-time').textContent = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit'
}).format(new Date());

render({ routeAction: 'replace' });
