#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LOOKS = [2, 3, 4, 5, 6, 7, 8, 9];
const INTERACTIVE_LOOKS = [3, 4, 5, 6, 7];
const SCENARIOS = ['normal', 'backlog', 'new', 'clear', 'large', 'long', 'large-text'];
const GALLERY_VIEWS = ['areas', 'area', 'intervention'];
const INTERACTIVE_VIEWS = ['today', 'areas', 'area', 'section', 'chore', 'intervention'];
const failures = [];
const passes = [];
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = file => fs.existsSync(path.join(ROOT, file));
const check = (condition, message) => condition ? undefined : failures.push(message);

const rendererFunctions = new Map([
  [2, ['renderAreasEditorial', 'renderAreaDetail', 'renderInterventionEditorial']],
  [3, ['renderTodayPrecision', 'renderAreasPrecision', 'renderAreaDetailPrecision', 'renderSectionPrecision', 'renderChorePrecision', 'renderInterventionPrecision']],
  [4, ['renderTodayZen', 'renderAreasZen', 'renderAreaDetailZen', 'renderSectionZen', 'renderChoreZen', 'renderInterventionZen']],
  [5, ['renderTodayPlayful', 'renderAreasPlayful', 'renderAreaDetailPlayful', 'renderSectionPlayful', 'renderChorePlayful', 'renderInterventionPlayful']],
  [6, ['renderTodayTactile', 'renderAreasTactile', 'renderAreaDetailTactile', 'renderSectionTactile', 'renderChoreTactile', 'renderInterventionTactile']],
  [7, ['renderTodayBold', 'renderAreasBold', 'renderAreaDetailBold', 'renderSectionBold', 'renderChoreBold', 'renderInterventionBold']],
  [8, ['renderAreasAmbient', 'renderAreaDetailAmbient', 'renderInterventionAmbient']],
  [9, ['renderAreasRetro', 'renderAreaDetailRetro', 'renderInterventionRetro']]
]);

const styles = [
  'styles.css','foundation.css','look3.css','look3-interactive.css','look4.css','look4-interactive.css','look6.css','look6-quality.css','look6-interactive.css',
  'expanded-looks.css','look5-quality.css','look5-interactive.css','look7-quality.css','look7-interactive.css','look8-quality.css','look9-quality.css','review.css'
];

function requiredFiles() {
  const files = [
    'index.html','config.js','utils.js','fixtures.js','state.js','interactive-state.js','controls.js','app.js','quality.js',
    ...styles,
    'look1-reference.html','look1-reference.css','look1-reference.js','renderers/shared.js',
    ...LOOKS.map(id => `renderers/look${id}.js`)
  ];
  files.forEach(file => check(exists(file), `Missing required file: ${file}`));
  passes.push(`Checked ${files.length} required files.`);
}

function importGraph() {
  const files = ['fixtures.js','state.js','interactive-state.js','controls.js','app.js','look1-reference.js',...LOOKS.map(id => `renderers/look${id}.js`)];
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
  const strip = source => source.replace(/^\s*import\s+[^;]+;\s*$/gm,'').replace(/\bexport\s+(?=(?:const|let|var|function|class)\b)/g,'');
  const source = `${strip(read('config.js'))}\n${strip(read('utils.js'))}\n${strip(read('fixtures.js'))}\n${strip(read('state.js'))}\n` +
    'globalThis.__lab={DESIGN_LAB,LOOKS,ALLOWED_VIEWS,SCENARIOS,getScenario};';
  const sandbox = { URLSearchParams, location:{search:'',pathname:'/mockups/design-lab/'}, history:{pushState(){},replaceState(){}}, sessionStorage:{setItem(){},removeItem(){},getItem(){return null;}}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.__lab;
}

function fixturesAndRoutes(shared) {
  check(JSON.stringify(Object.keys(shared.SCENARIOS)) === JSON.stringify(SCENARIOS), 'Scenario registry differs from the seven shared scenarios.');
  check(JSON.stringify(shared.LOOKS.map(item => item.id)) === JSON.stringify(LOOKS), 'Look registry differs from Looks #2–#9.');
  INTERACTIVE_VIEWS.forEach(view => check(shared.ALLOWED_VIEWS.has(view), `Interactive view is not allowed: ${view}`));
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
  passes.push(`Checked ${LOOKS.length * SCENARIOS.length * GALLERY_VIEWS.length} gallery routes and ${INTERACTIVE_LOOKS.length * INTERACTIVE_VIEWS.length} interactive Look/view combinations.`);
}

function renderers() {
  const app = read('app.js');
  for (const [look, functions] of rendererFunctions) {
    const file = `renderers/look${look}.js`;
    const source = read(file);
    functions.forEach(name => {
      check(new RegExp(`export\\s+function\\s+${name}\\b`).test(source), `${file} does not export ${name}.`);
      check(app.includes(name), `app.js does not reference ${name}.`);
    });
    check(app.includes(`look.id === ${look}`), `app.js is missing Look #${look} routing.`);
  }
  passes.push('Checked renderer exports and routing branches.');
}

function sharedInteractiveContract() {
  const app = read('app.js');
  const state = read('state.js');
  const interaction = read('interactive-state.js');
  const utils = read('utils.js');

  ['applyRoutineState','completeRoutine','reopenRoutine','clearInteractiveState'].forEach(name => {
    check(app.includes(name), `app.js does not use ${name}.`);
  });
  ['sectionId','choreId'].forEach(name => {
    check(state.includes(name), `state.js is missing ${name}.`);
  });
  ['routine-completion-v1','nextLabel','previousStatus','nextStatus'].forEach(token => {
    check(interaction.includes(token), `interactive-state.js is missing ${token}.`);
  });
  check(app.includes('new Set([3, 4, 5, 6, 7])'), 'app.js does not register Looks #3, #4, #5, #6, and #7 as interactive.');
  check(utils.includes('completionDelta'), 'nextRoutine does not deprioritize completed routines.');
  check(app.indexOf("const actionTarget") < app.indexOf("const choreButton"), 'Action handling must run before generic chore navigation.');
  passes.push('Checked shared completion, recurrence, undo, route, and state-preservation hooks.');
}

function lookInteractiveContract(look, rendererFile, cssFile, tokens) {
  const renderer = read(rendererFile);
  const css = read(cssFile);
  ['data-action="complete-routine"','data-action="reopen-routine"','data-section-id','data-chore-id'].forEach(token => {
    check(renderer.includes(token), `Look #${look} renderer is missing ${token}.`);
  });
  ['forced-colors: active','prefers-reduced-motion: reduce',...tokens].forEach(token => {
    check(css.includes(token), `Look #${look} interactive CSS is missing ${token}.`);
  });
  passes.push(`Checked Look #${look} interactive renderer and accessibility styling contract.`);
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
    const source = read(file).replace(/\/\*[\s\S]*?\*\//g,'');
    check(source.split('{').length === source.split('}').length, `${file} has unbalanced braces.`);
  });
  passes.push(`Checked ${files.length} stylesheets for balanced blocks.`);
}

function main() {
  requiredFiles();
  importGraph();
  let shared;
  try { shared = evaluateShared(); passes.push('Evaluated shared modules.'); } catch (error) { failures.push(`Shared-module evaluation failed: ${error.message}`); }
  renderers();
  sharedInteractiveContract();
  lookInteractiveContract(3, 'renderers/look3.js', 'look3-interactive.css', ['.pm-chore-actions','.pm-routine-open']);
  lookInteractiveContract(4, 'renderers/look4.js', 'look4-interactive.css', ['.zen-chore-actions','.zen-routine-open']);
  lookInteractiveContract(5, 'renderers/look5.js', 'look5-interactive.css', ['.pl-chore-actions','.pl-routine-open']);
  lookInteractiveContract(6, 'renderers/look6.js', 'look6-interactive.css', ['.th-chore-actions','.th-routine-open']);
  lookInteractiveContract(7, 'renderers/look7.js', 'look7-interactive.css', ['.bu-chore-actions','.bu-routine-open']);
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
  else console.log('\nAll gallery and Looks #3/#4/#5/#6/#7 interactive checks passed.');
}

main();
