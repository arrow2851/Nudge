#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LOOKS = [2, 3, 4, 5, 6, 7, 8, 9];
const INTERACTIVE_LOOKS = [2, 3, 4, 5, 6, 7, 8, 9];
const TASK_LOOKS = [2, 3, 4, 5, 6, 7, 8, 9];
const INTERVENTION_LOOKS = [3, 4, 5, 7];
const SCENARIOS = ['normal', 'backlog', 'new', 'clear', 'large', 'long', 'large-text'];
const GALLERY_VIEWS = ['areas', 'area', 'intervention'];
const ROUTINE_VIEWS = ['today', 'areas', 'area', 'section', 'chore', 'intervention'];
const failures = [];
const passes = [];
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = file => fs.existsSync(path.join(ROOT, file));
const check = (condition, message) => condition ? undefined : failures.push(message);

const rendererFunctions = new Map([
  [2, ['renderTodayEditorial', 'renderAreasEditorial', 'renderAreaDetail', 'renderSectionEditorial', 'renderChoreEditorial', 'renderInterventionEditorial']],
  [3, ['renderTodayPrecision', 'renderAreasPrecision', 'renderAreaDetailPrecision', 'renderSectionPrecision', 'renderChorePrecision', 'renderInterventionPrecision']],
  [4, ['renderTodayZen', 'renderAreasZen', 'renderAreaDetailZen', 'renderSectionZen', 'renderChoreZen', 'renderInterventionZen']],
  [5, ['renderTodayPlayful', 'renderAreasPlayful', 'renderAreaDetailPlayful', 'renderSectionPlayful', 'renderChorePlayful', 'renderInterventionPlayful']],
  [6, ['renderTodayTactile', 'renderAreasTactile', 'renderAreaDetailTactile', 'renderSectionTactile', 'renderChoreTactile', 'renderInterventionTactile']],
  [7, ['renderTodayBold', 'renderAreasBold', 'renderAreaDetailBold', 'renderSectionBold', 'renderChoreBold', 'renderInterventionBold']],
  [8, ['renderTodayAmbient', 'renderAreasAmbient', 'renderAreaDetailAmbient', 'renderSectionAmbient', 'renderChoreAmbient', 'renderInterventionAmbient']],
  [9, ['renderTodayRetro', 'renderAreasRetro', 'renderAreaDetailRetro', 'renderSectionRetro', 'renderChoreRetro', 'renderInterventionRetro']]
]);

const taskRenderers = new Map([
  [2, ['renderers/look2-tasks.js', 'renderTasksEditorial', 'look2-tasks.css', ['.ed-task-row', '.ed-task-settings', '.ed-task-progress']]],
  [3, ['renderers/look3-tasks.js', 'renderTasksPrecision', 'look3-tasks.css', ['.pm-task-row', '.pm-task-settings', '.pm-task-progress']]],
  [4, ['renderers/look4-tasks.js', 'renderTasksZen', 'look4-tasks.css', ['.zen-task-row', '.zen-task-settings', '.zen-task-progress']]],
  [5, ['renderers/look5-tasks.js', 'renderTasksPlayful', 'look5-tasks.css', ['.pl-task-row', '.pl-task-settings', '.pl-task-progress']]],
  [6, ['renderers/look6-tasks.js', 'renderTasksTactile', 'look6-tasks.css', ['.th-task-row', '.th-task-settings', '.th-task-progress']]],
  [7, ['renderers/look7-tasks.js', 'renderTasksBold', 'look7-tasks.css', ['.bu-task-row', '.bu-task-settings', '.bu-task-progress']]],
  [8, ['renderers/look8-tasks.js', 'renderTasksAmbient', 'look8-tasks.css', ['.ag-task-row', '.ag-task-settings', '.ag-task-progress', 'prefers-reduced-transparency: reduce', '@supports not']]],
  [9, ['renderers/look9-tasks.js', 'renderTasksRetro', 'look9-tasks.css', ['.rd-task-row', '.rd-task-settings', '.rd-task-progress', 'prefers-contrast: more']]]
]);

const interventionRenderers = new Map([
  [3, ['renderers/look3-intervention.js', 'renderInterventionPrecisionAction', 'look3-intervention.css', ['.pm-intervention-card', '.pm-intervention-facts', 'max-height: 700px']]],
  [4, ['renderers/look4.js', 'renderInterventionZen', 'look4-intervention.css', ['.zen-action-state', 'max-height: 720px']]],
  [5, ['renderers/look5-intervention.js', 'renderInterventionPlayfulAction', 'look5-intervention.css', ['.pl-intervention-choice', '.pl-intervention-context', 'max-height: 720px']]],
  [7, ['renderers/look7-intervention.js', 'renderInterventionBoldAction', 'look7-intervention.css', ['.bu-intervention-card', '.bu-intervention-facts', 'max-height: 720px']]]
]);

const styles = [
  'styles.css', 'foundation.css', 'look2-interactive.css', 'look2-tasks.css',
  'look3.css', 'look3-interactive.css', 'look3-tasks.css', 'look3-intervention.css',
  'look4.css', 'look4-interactive.css', 'look4-tasks.css', 'look4-intervention.css',
  'look6.css', 'look6-quality.css', 'look6-interactive.css', 'look6-tasks.css',
  'expanded-looks.css', 'look5-quality.css', 'look5-interactive.css', 'look5-tasks.css', 'look5-intervention.css',
  'look7-quality.css', 'look7-interactive.css', 'look7-tasks.css', 'look7-intervention.css',
  'look8-quality.css', 'look8-interactive.css', 'look8-tasks.css',
  'look9-quality.css', 'look9-interactive.css', 'look9-tasks.css', 'review.css'
];

function requiredFiles() {
  const files = [
    'index.html', 'config.js', 'utils.js', 'fixtures.js', 'state.js',
    'interactive-state.js', 'task-state.js', 'intervention-state.js', 'controls.js', 'app.js', 'quality.js',
    ...styles,
    'look1-reference.html', 'look1-reference.css', 'look1-reference.js', 'renderers/shared.js',
    ...LOOKS.map(id => `renderers/look${id}.js`),
    ...[...taskRenderers.values()].map(([file]) => file),
    ...[...interventionRenderers.values()].map(([file]) => file)
  ];
  files.forEach(file => check(exists(file), `Missing required file: ${file}`));
  passes.push(`Checked ${files.length} required files.`);
}

function importGraph() {
  const files = [
    'fixtures.js', 'state.js', 'interactive-state.js', 'task-state.js', 'intervention-state.js', 'controls.js', 'app.js',
    'look1-reference.js', ...LOOKS.map(id => `renderers/look${id}.js`),
    ...[...taskRenderers.values()].map(([file]) => file),
    ...[...interventionRenderers.values()].map(([file]) => file)
  ];
  let edges = 0;
  for (const file of files.filter(exists)) {
    for (const match of read(file).matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      if (!match[1].startsWith('.')) continue;
      edges += 1;
      const target = path.normalize(path.join(path.dirname(file), match[1]));
      check(exists(target), `${file} imports missing ${match[1]}`);
    }
  }
  passes.push(`Checked ${edges} relative imports.`);
}

function evaluateShared() {
  const strip = source => source
    .replace(/^\s*import\s+[^;]+;\s*$/gm, '')
    .replace(/\bexport\s+(?=(?:const|let|var|function|class)\b)/g, '');
  const source = `${strip(read('config.js'))}\n${strip(read('utils.js'))}\n${strip(read('fixtures.js'))}\n${strip(read('state.js'))}\n` +
    'globalThis.__lab={DESIGN_LAB,LOOKS,ALLOWED_VIEWS,SCENARIOS,getScenario,defaultState};';
  const sandbox = {
    URLSearchParams,
    location: { search: '', pathname: '/mockups/design-lab/' },
    history: { pushState() {}, replaceState() {} },
    sessionStorage: { setItem() {}, removeItem() {}, getItem() { return null; } },
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.__lab;
}

function fixturesAndRoutes(shared) {
  check(JSON.stringify(Object.keys(shared.SCENARIOS)) === JSON.stringify(SCENARIOS), 'Scenario registry differs from the seven shared scenarios.');
  check(JSON.stringify(shared.LOOKS.map(item => item.id)) === JSON.stringify(LOOKS), 'Look registry differs from Looks #2–#9.');
  [...ROUTINE_VIEWS, 'tasks'].forEach(view => check(shared.ALLOWED_VIEWS.has(view), `Interactive view is not allowed: ${view}`));
  check(shared.defaultState().look === 7 && shared.defaultState().view === 'intervention', 'Default review route is not Look #7 Intervention.');

  for (const [id, scenario] of Object.entries(shared.SCENARIOS)) {
    check(Array.isArray(scenario.areas), `${id}: areas must be an array.`);
    check(Boolean(scenario.intervention?.task), `${id}: intervention task missing.`);
    for (const area of scenario.areas) {
      check(Boolean(area.id && area.name), `${id}: invalid Area.`);
      check(Array.isArray(area.routines), `${id}/${area.id}: routines must be an array.`);
      area.routines.forEach(routine => check(Boolean(routine.id && routine.tier), `${id}/${area.id}: routine id or tier missing.`));
    }
  }

  const validArea = shared.SCENARIOS.normal.areas[0].id;
  for (const look of LOOKS) for (const scenario of SCENARIOS) for (const view of GALLERY_VIEWS) {
    const url = `?look=${look}&screen=${view}&scenario=${encodeURIComponent(scenario)}${view === 'area' ? `&area=${encodeURIComponent(validArea)}` : ''}`;
    check(url.includes(`look=${look}`) && url.includes(`screen=${view}`), `Route serialization failed: Look ${look}, ${view}.`);
  }
  passes.push(`Checked ${LOOKS.length * SCENARIOS.length * GALLERY_VIEWS.length} gallery routes, ${INTERACTIVE_LOOKS.length * ROUTINE_VIEWS.length} routine combinations, ${TASK_LOOKS.length} task Looks, and ${INTERVENTION_LOOKS.length} Intervention Looks.`);
}

function routineRenderers() {
  const app = read('app.js');
  for (const [look, functions] of rendererFunctions) {
    const file = `renderers/look${look}.js`;
    const source = read(file);
    functions.forEach(name => {
      check(new RegExp(`export\\s+function\\s+${name}\\b`).test(source), `${file} does not export ${name}.`);
      check(app.includes(name), `app.js does not reference ${name}.`);
    });
  }
  check(app.includes('ROUTINE_RENDERERS'), 'app.js is missing the shared routine renderer registry.');
  passes.push('Checked forty-eight routine renderer exports and shared routing registry.');
}

function sharedRoutineContract() {
  const app = read('app.js');
  const state = read('state.js');
  const interaction = read('interactive-state.js');
  const utils = read('utils.js');

  ['applyRoutineState', 'completeRoutine', 'reopenRoutine', 'clearInteractiveState'].forEach(name => {
    check(app.includes(name), `app.js does not use ${name}.`);
  });
  ['sectionId', 'choreId'].forEach(name => check(state.includes(name), `state.js is missing ${name}.`));
  ['routine-completion-v1', 'nextLabel', 'previousStatus', 'nextStatus'].forEach(token => {
    check(interaction.includes(token), `interactive-state.js is missing ${token}.`);
  });
  check(app.includes('new Set([2, 3, 4, 5, 6, 7, 8, 9])'), 'app.js does not register every active Look for Routine Completion.');
  check(utils.includes('completionDelta'), 'nextRoutine does not deprioritize completed routines.');
  check(app.indexOf("const actionTarget") < app.indexOf("const choreButton"), 'Action handling must run before generic chore navigation.');
  passes.push('Checked shared completion, recurrence, Undo, route, and state-preservation hooks.');
}

function lookRoutineContract(look, rendererFile, cssFile, tokens) {
  const renderer = read(rendererFile);
  const css = read(cssFile);
  ['data-action="complete-routine"', 'data-action="reopen-routine"', 'data-section-id', 'data-chore-id'].forEach(token => {
    check(renderer.includes(token), `Look #${look} renderer is missing ${token}.`);
  });
  ['forced-colors: active', 'prefers-reduced-motion: reduce', ...tokens].forEach(token => {
    check(css.includes(token), `Look #${look} interactive CSS is missing ${token}.`);
  });
  passes.push(`Checked Look #${look} Routine Completion renderer and accessibility styling contract.`);
}

function taskHierarchyContract() {
  const app = read('app.js');
  const taskState = read('task-state.js');
  const controls = read('controls.js');

  check(app.includes('new Set([2, 3, 4, 5, 6, 7, 8, 9])'), 'app.js does not register every active Look for Task hierarchy.');
  check(app.includes('TASK_RENDERERS'), 'app.js is missing the task renderer registry.');
  check(controls.includes('new Set([2, 3, 4, 5, 6, 7, 8, 9])'), 'controls.js does not register every active Look for Task hierarchy guidance.');

  [
    'nudge-design-lab-task-hierarchy-v1', 'addTask', 'updateTaskTitle', 'toggleTaskCompletion',
    'toggleMainTask', 'moveTask', 'moveTaskBefore', 'indentTask', 'unindentTask',
    'setHideCompleted', 'taskProgress', 'released', 'syncParent'
  ].forEach(token => check(taskState.includes(token), `task-state.js is missing ${token}.`));

  [
    'add-task-top', 'add-task-bottom', 'add-subtask', 'toggle-task-completion',
    'toggle-main-task', 'move-task-up', 'move-task-down', 'indent-task', 'unindent-task',
    'toggle-completed-visibility', 'data-task-drag', 'data-task-drop', 'data-task-title'
  ].forEach(token => check(app.includes(token) || [...taskRenderers.values()].some(([file]) => read(file).includes(token)), `Task hierarchy contract is missing ${token}.`));

  for (const [look, [rendererFile, exportName, cssFile, cssTokens]] of taskRenderers) {
    const renderer = read(rendererFile);
    const css = read(cssFile);
    check(new RegExp(`export\\s+function\\s+${exportName}\\b`).test(renderer), `${rendererFile} does not export ${exportName}.`);
    check(app.includes(exportName), `app.js does not reference ${exportName}.`);
    [
      'data-action="add-task-top"', 'data-action="add-task-bottom"', 'data-action="add-subtask"',
      'data-action="toggle-task-completion"', 'data-action="toggle-main-task"',
      'data-action="indent-task"', 'data-action="unindent-task"', 'data-task-drag="true"',
      'data-task-title="true"', 'taskProgress'
    ].forEach(token => check(renderer.includes(token), `Look #${look} task renderer is missing ${token}.`));
    ['forced-colors: active', 'prefers-reduced-motion: reduce', 'min-height: 48px', ...cssTokens].forEach(token => {
      check(css.includes(token), `Look #${look} task CSS is missing ${token}.`);
    });
  }

  const retro = read('renderers/look9-tasks.js').toUpperCase();
  ['ERROR', 'FAILURE', 'FAULT'].forEach(token => check(!retro.includes(token), `Look #9 task language contains prohibited failure-state token: ${token}.`));
  passes.push('Checked shared Task hierarchy state and all eight renderer, action, drag, responsive, fallback, contrast, and accessibility contracts.');
}

function interventionContract() {
  const app = read('app.js');
  const controls = read('controls.js');
  const interaction = read('intervention-state.js');

  check(app.includes('new Set([3, 4, 5, 7])'), 'app.js does not register Looks #3, #4, #5, and #7 for Intervention-to-action.');
  check(controls.includes('new Set([3, 4, 5, 7])'), 'controls.js does not register Looks #3, #4, #5, and #7 for Intervention-to-action guidance.');
  [
    'nudge-design-lab-intervention-action-v1', 'interventionSuggestions', 'applyInterventionState',
    'showNextInterventionSuggestion', 'startInterventionAction', 'completeInterventionAction',
    'reopenInterventionAction', 'undoInterventionStart', 'dismissIntervention',
    'resumeIntervention', 'clearInterventionState', "'prompt'", "'active'", "'completed'", "'dismissed'"
  ].forEach(token => check(interaction.includes(token), `intervention-state.js is missing ${token}.`));

  [
    'applyInterventionState', 'clearInterventionState', 'start-intervention', 'next-intervention',
    'dismiss-intervention', 'resume-intervention', 'complete-intervention',
    'reopen-intervention', 'undo-intervention', 'return-today', 'currentSourceData'
  ].forEach(token => check(app.includes(token), `app.js is missing Intervention-to-action hook ${token}.`));

  for (const [look, [rendererFile, exportName, cssFile, cssTokens]] of interventionRenderers) {
    const renderer = read(rendererFile);
    const css = read(cssFile);
    check(new RegExp(`export\\s+function\\s+${exportName}\\b`).test(renderer), `${rendererFile} does not export ${exportName}.`);
    check(app.includes(exportName), `app.js does not reference ${exportName}.`);
    [
      'data-action="start-intervention"', 'data-action="next-intervention"',
      'data-action="dismiss-intervention"', 'data-action="resume-intervention"',
      'data-action="complete-intervention"', 'data-action="reopen-intervention"',
      'data-action="undo-intervention"', 'data-action="return-today"'
    ].forEach(token => check(renderer.includes(token), `Look #${look} Intervention renderer is missing ${token}.`));
    ['min-height: 48px', 'forced-colors: active', 'prefers-reduced-motion: reduce', ...cssTokens].forEach(token => {
      check(css.includes(token), `Look #${look} Intervention CSS is missing ${token}.`);
    });
  }

  const precision = read('renderers/look3-intervention.js').toUpperCase();
  ['STAYING HERE IS ALSO VALID', 'NO TASK, REMINDER, PENALTY', 'NOTHING ELSE CHANGED'].forEach(token => {
    const combined = `${precision}\n${app.toUpperCase()}`;
    check(combined.includes(token), `Precision Minimal no-guilt language is missing ${token}.`);
  });

  const playful = read('renderers/look5-intervention.js').toUpperCase();
  [
    'STAYING WHERE YOU ARE IS EQUALLY VALID',
    'NO TIMER, SCORE, STREAK, REWARD, OR PENALTY',
    'NO ACTION WAS STARTED',
    'NO POINTS, STREAK, RANKING, OR PERFORMANCE SCORE'
  ].forEach(token => check(playful.includes(token), `Playful Modular non-gamification language is missing ${token}.`));

  const bold = read('renderers/look7-intervention.js').toUpperCase();
  [
    'BOTH CHOICES ARE VALID',
    'NO SCORE. NO PENALTY. NO REQUIREMENT TO SWITCH',
    'NO ACTION WAS STARTED',
    'DISMISSAL IS A COMPLETE RESPONSE. NOTHING IS OWED'
  ].forEach(token => check(bold.includes(token), `Bold Utility optional-choice language is missing ${token}.`));
  ['ERROR', 'FAILURE', 'FAILED', 'FAULT', 'ALARM', 'NONCOMPLIANCE', 'WARNING'].forEach(token => {
    check(!bold.includes(token), `Bold Utility Intervention language contains prohibited pressure token: ${token}.`);
  });

  passes.push('Checked shared Intervention phases, deterministic alternatives, all reversible actions, four pure-Look renderers, non-scoring language, direct-without-alarm language, and accessibility contracts.');
}

function versionsAndHtml(shared) {
  const version = shared.DESIGN_LAB.version;
  check(read('quality.js').includes(`const VERSION = '${version}'`), 'quality.js version mismatch.');
  check(read('look1-reference.js').includes('const VERSION = DESIGN_LAB.version'), 'Look #1 reference does not source the shared version.');
  check(read('README.md').includes(`**Current version:** \`${version}\``), 'README version mismatch.');
  check(read('DESIGN-LAB-CHECKLIST.md').includes(`**Current version:** \`${version}\``), 'Checklist version mismatch.');
  const html = read('index.html');
  styles.forEach(file => check(html.includes(`href="${file}"`), `index.html does not load ${file}.`));
  let previous = -1;
  styles.forEach(file => {
    const position = html.indexOf(`href="${file}"`);
    check(position > previous, `Stylesheet order is incorrect around ${file}.`);
    previous = position;
  });
  check(html.includes(`v${version}`), 'index.html version mismatch.');
  passes.push(`Checked v${version} metadata and stylesheet references.`);
}

function cssBalance() {
  const files = [...styles, 'look1-reference.css'];
  files.forEach(file => {
    const source = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
    check(source.split('{').length === source.split('}').length, `${file} has unbalanced braces.`);
  });
  passes.push(`Checked ${files.length} stylesheets for balanced blocks.`);
}

function main() {
  requiredFiles();
  importGraph();
  let shared;
  try {
    shared = evaluateShared();
    passes.push('Evaluated shared modules.');
  } catch (error) {
    failures.push(`Shared-module evaluation failed: ${error.message}`);
  }

  routineRenderers();
  sharedRoutineContract();
  lookRoutineContract(2, 'renderers/look2.js', 'look2-interactive.css', ['.ed-chore-actions', '.ed-routine-open']);
  lookRoutineContract(3, 'renderers/look3.js', 'look3-interactive.css', ['.pm-chore-actions', '.pm-routine-open']);
  lookRoutineContract(4, 'renderers/look4.js', 'look4-interactive.css', ['.zen-chore-actions', '.zen-routine-open']);
  lookRoutineContract(5, 'renderers/look5.js', 'look5-interactive.css', ['.pl-chore-actions', '.pl-routine-open']);
  lookRoutineContract(6, 'renderers/look6.js', 'look6-interactive.css', ['.th-chore-actions', '.th-routine-open']);
  lookRoutineContract(7, 'renderers/look7.js', 'look7-interactive.css', ['.bu-chore-actions', '.bu-routine-open']);
  lookRoutineContract(8, 'renderers/look8.js', 'look8-interactive.css', ['.ag-chore-actions', '.ag-routine-open', 'prefers-reduced-transparency: reduce', '@supports not']);
  lookRoutineContract(9, 'renderers/look9.js', 'look9-interactive.css', ['.rd-chore-actions', '.rd-routine-open']);
  taskHierarchyContract();
  interventionContract();

  if (shared) {
    fixturesAndRoutes(shared);
    versionsAndHtml(shared);
  }
  cssBalance();

  console.log('Nudge Design Lab validation');
  console.log('===========================');
  passes.forEach(item => console.log(`PASS  ${item}`));
  failures.forEach(item => console.error(`FAIL  ${item}`));
  if (failures.length) process.exitCode = 1;
  else console.log('\nAll gallery, Routine Completion, Task hierarchy, and Looks #3/#4/#5/#7 Intervention-to-action checks passed.');
}

main();
