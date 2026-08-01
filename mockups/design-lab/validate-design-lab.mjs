#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE);
const EXPECTED_LOOKS = [2, 3, 4, 6];
const EXPECTED_SCENARIOS = ['normal', 'backlog', 'new', 'clear', 'large', 'long', 'large-text'];
const EXPECTED_VIEWS = ['areas', 'area', 'intervention'];
const ALLOWED_STATUSES = new Set(['overdue', 'today', 'upcoming', 'as-needed']);
const failures = [];
const notes = [];

const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(ROOT, relative));
const fail = message => failures.push(message);
const pass = message => notes.push(message);

function assert(condition, message) {
  if (!condition) fail(message);
}

function stripModuleSyntax(source) {
  return source
    .replace(/^\s*import\s+[^;]+;\s*$/gm, '')
    .replace(/\bexport\s+(?=(?:const|let|var|function|class)\b)/g, '');
}

function evaluateSharedModules() {
  const config = stripModuleSyntax(read('config.js'));
  const utils = stripModuleSyntax(read('utils.js'));
  const fixtures = stripModuleSyntax(read('fixtures.js'));
  const state = stripModuleSyntax(read('state.js'));
  const source = `${config}\n${utils}\n${fixtures}\n${state}\n` +
    `globalThis.__designLab = { DESIGN_LAB, LOOKS, ALLOWED_VIEWS, ROUND_ONE_CONTROLS, BASE_AREAS, SCENARIOS, getScenario, defaultState, readStateFromLocation, urlForState, commitState, clearStoredState };`;

  const storage = new Map();
  const historyCalls = [];
  const sandbox = {
    URLSearchParams,
    location: { search: '', pathname: '/mockups/design-lab/' },
    history: {
      pushState(stateValue, unused, url) { historyCalls.push({ method: 'pushState', stateValue, url }); },
      replaceState(stateValue, unused, url) { historyCalls.push({ method: 'replaceState', stateValue, url }); }
    },
    sessionStorage: {
      setItem(key, value) { storage.set(key, value); },
      removeItem(key) { storage.delete(key); },
      getItem(key) { return storage.get(key) ?? null; }
    },
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'design-lab-shared-modules.js' });
  return { ...sandbox.__designLab, sandbox, storage, historyCalls };
}

function validateRequiredFiles() {
  const required = [
    'index.html', 'config.js', 'utils.js', 'fixtures.js', 'state.js', 'controls.js', 'app.js', 'quality.js',
    'styles.css', 'foundation.css', 'look3.css', 'look4.css', 'look6.css', 'look6-quality.css',
    'renderers/look2.js', 'renderers/look3.js', 'renderers/look4.js', 'renderers/look6.js', 'renderers/shared.js'
  ];
  required.forEach(file => assert(exists(file), `Missing required file: ${file}`));
  if (!failures.length) pass(`Required-file check passed (${required.length} files).`);
}

function validateImportGraph() {
  const jsFiles = [
    'config.js', 'utils.js', 'fixtures.js', 'state.js', 'controls.js', 'app.js', 'quality.js',
    'renderers/look2.js', 'renderers/look3.js', 'renderers/look4.js', 'renderers/look6.js', 'renderers/shared.js'
  ].filter(exists);
  const importPattern = /from\s+['"]([^'"]+)['"]/g;
  let edgeCount = 0;
  for (const file of jsFiles) {
    const source = read(file);
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) continue;
      edgeCount += 1;
      const target = path.normalize(path.join(path.dirname(file), specifier));
      assert(exists(target), `${file} imports missing module ${specifier} (${target})`);
    }
  }
  if (!failures.length) pass(`Relative import graph passed (${edgeCount} edges).`);
}

function validateHtmlReferences(version) {
  const html = read('index.html');
  const localReferences = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)]
    .map(match => match[1])
    .filter(value => !/^(?:https?:|#|data:)/.test(value));
  localReferences.forEach(reference => assert(exists(reference), `index.html references missing file: ${reference}`));

  const requiredOrder = ['styles.css', 'foundation.css', 'look3.css', 'look4.css', 'look6.css', 'look6-quality.css'];
  let lastIndex = -1;
  for (const stylesheet of requiredOrder) {
    const current = html.indexOf(`href="${stylesheet}"`);
    assert(current >= 0, `index.html does not load ${stylesheet}`);
    assert(current > lastIndex, `Stylesheet order is incorrect around ${stylesheet}`);
    lastIndex = current;
  }
  assert(html.includes('type="module" src="app.js"'), 'index.html must load app.js as an ES module.');
  assert(html.includes('src="quality.js"'), 'index.html must load quality.js.');
  assert(html.includes(`v${version}`), `index.html does not display current version v${version}.`);
  if (!failures.length) pass(`HTML reference and stylesheet-order checks passed (${localReferences.length} local references).`);
}

function attentionCount(areas) {
  return areas.reduce((sum, area) => sum + area.routines.filter(routine => routine.status === 'overdue' || routine.status === 'today').length, 0);
}

function validateFixtures(shared) {
  const scenarioKeys = Object.keys(shared.SCENARIOS);
  assert(JSON.stringify(scenarioKeys) === JSON.stringify(EXPECTED_SCENARIOS), `Scenario keys differ. Expected ${EXPECTED_SCENARIOS.join(', ')}; received ${scenarioKeys.join(', ')}.`);

  const ids = new Set();
  for (const [scenarioId, scenario] of Object.entries(shared.SCENARIOS)) {
    assert(typeof scenario.label === 'string' && scenario.label, `${scenarioId}: missing label.`);
    assert(typeof scenario.purpose === 'string' && scenario.purpose, `${scenarioId}: missing purpose.`);
    assert(typeof scenario.expected === 'string' && scenario.expected, `${scenarioId}: missing expected description.`);
    assert(Array.isArray(scenario.areas), `${scenarioId}: areas must be an array.`);
    assert(scenario.intervention && typeof scenario.intervention === 'object', `${scenarioId}: missing intervention.`);
    for (const area of scenario.areas) {
      assert(typeof area.id === 'string' && area.id, `${scenarioId}: Area missing id.`);
      assert(typeof area.name === 'string' && area.name, `${scenarioId}/${area.id}: Area missing name.`);
      assert(Number.isInteger(area.sections) && area.sections >= 0, `${scenarioId}/${area.id}: sections must be a non-negative integer.`);
      assert(Array.isArray(area.routines), `${scenarioId}/${area.id}: routines must be an array.`);
      const key = `${scenarioId}:${area.id}`;
      assert(!ids.has(key), `${scenarioId}: duplicate Area id ${area.id}.`);
      ids.add(key);
      for (const routine of area.routines) {
        assert(typeof routine.title === 'string' && routine.title, `${scenarioId}/${area.id}: routine missing title.`);
        assert(typeof routine.repeat === 'string' && routine.repeat, `${scenarioId}/${area.id}/${routine.title}: missing repeat.`);
        assert(Number.isFinite(routine.minutes) && routine.minutes > 0, `${scenarioId}/${area.id}/${routine.title}: minutes must be positive.`);
        assert(ALLOWED_STATUSES.has(routine.status), `${scenarioId}/${area.id}/${routine.title}: unsupported status ${routine.status}.`);
      }
    }
    const intervention = scenario.intervention;
    ['app', 'task', 'location'].forEach(field => assert(typeof intervention[field] === 'string' && intervention[field], `${scenarioId}: intervention.${field} is required.`));
    ['minutes', 'duration'].forEach(field => assert(Number.isFinite(intervention[field]) && intervention[field] > 0, `${scenarioId}: intervention.${field} must be positive.`));
  }

  assert(attentionCount(shared.SCENARIOS.normal.areas) === 3, 'Normal Day must contain 3 attention routines.');
  assert(attentionCount(shared.SCENARIOS.backlog.areas) === 7, 'Heavy Backlog must contain 7 attention routines.');
  assert(shared.SCENARIOS.new.areas.length === 0, 'New User must contain no Areas.');
  assert(attentionCount(shared.SCENARIOS.clear.areas) === 0, 'All Clear must contain no overdue or due-today routines.');
  assert(shared.SCENARIOS.large.areas.length === 9, 'Large Household must contain 9 Areas.');
  assert(attentionCount(shared.SCENARIOS.large.areas) === 8, 'Large Household must contain 8 attention routines.');
  assert(shared.SCENARIOS['large-text'].textScale === 'large', 'Large Text must set textScale to large.');

  const first = shared.getScenario('normal');
  first.areas[0].name = 'MUTATED';
  const second = shared.getScenario('normal');
  assert(second.areas[0].name !== 'MUTATED', 'getScenario must return a deep clone, not shared mutable state.');
  const fallback = shared.getScenario('not-real');
  assert(fallback.label === shared.SCENARIOS.normal.label, 'Unknown scenarios must fall back to Normal Day.');
  if (!failures.length) pass(`Fixture invariants passed (${scenarioKeys.length} scenarios, ${ids.size} scenario-specific Areas).`);
}

function validateRenderersAndRouting(shared) {
  const app = read('app.js');
  const rendererExpectations = new Map([
    [2, ['renderAreasEditorial', 'renderAreaDetail', 'renderInterventionEditorial']],
    [3, ['renderAreasPrecision', 'renderAreaDetailPrecision', 'renderInterventionPrecision']],
    [4, ['renderAreasZen', 'renderAreaDetailZen', 'renderInterventionZen']],
    [6, ['renderAreasTactile', 'renderAreaDetailTactile', 'renderInterventionTactile']]
  ]);
  for (const [look, functions] of rendererExpectations) {
    const rendererFile = look === 2 ? 'renderers/look2.js' : `renderers/look${look}.js`;
    const source = read(rendererFile);
    functions.forEach(functionName => {
      assert(new RegExp(`export\\s+function\\s+${functionName}\\b`).test(source), `${rendererFile} does not export ${functionName}.`);
      assert(app.includes(functionName), `app.js does not reference ${functionName}.`);
    });
    assert(app.includes(`look.id === ${look}`), `app.js has no routing branch for Look #${look}.`);
  }

  const validArea = shared.SCENARIOS.normal.areas[0].id;
  for (const look of EXPECTED_LOOKS) {
    for (const scenario of EXPECTED_SCENARIOS) {
      for (const view of EXPECTED_VIEWS) {
        shared.sandbox.location.search = `?look=${look}&screen=${view}&scenario=${scenario}${view === 'area' ? `&area=${validArea}` : ''}`;
        const parsed = shared.readStateFromLocation();
        assert(parsed.look === look, `Route parse failed for Look #${look}.`);
        assert(parsed.view === view, `Route parse failed for ${view}.`);
        assert(parsed.scenario === scenario, `Route parse failed for scenario ${scenario}.`);
        if (view === 'area') assert(parsed.areaId === validArea, `Area route did not preserve area=${validArea}.`);
        const url = shared.urlForState(parsed);
        assert(url.includes(`look=${look}`) && url.includes(`screen=${view}`) && url.includes(`scenario=${encodeURIComponent(scenario)}`), `Route serialization failed for Look #${look}, ${view}, ${scenario}.`);
        if (view !== 'area') assert(!url.includes('area='), `Non-Area route unexpectedly serialized area= for ${view}.`);
      }
    }
  }

  shared.sandbox.location.search = '?look=999&screen=invalid&scenario=missing&area=ghost';
  const invalid = shared.readStateFromLocation();
  assert(invalid.look === 2 && invalid.view === 'areas' && invalid.scenario === 'normal', 'Invalid route values must fall back to Look #2 / Areas / Normal Day.');

  shared.historyCalls.length = 0;
  shared.commitState({ look: 6, view: 'intervention', scenario: 'long', areaId: null });
  assert(shared.historyCalls.at(-1)?.method === 'pushState', 'commitState must push by default.');
  shared.commitState({ look: 6, view: 'areas', scenario: 'normal', areaId: null }, { replace: true });
  assert(shared.historyCalls.at(-1)?.method === 'replaceState', 'commitState must replace when requested.');
  assert(shared.storage.has(shared.DESIGN_LAB.storageKey), 'commitState must persist isolated Design Lab state when storage is available.');
  shared.clearStoredState();
  assert(!shared.storage.has(shared.DESIGN_LAB.storageKey), 'clearStoredState must remove isolated Design Lab state.');
  if (!failures.length) pass(`Renderer and route matrix passed (${EXPECTED_LOOKS.length * EXPECTED_SCENARIOS.length * EXPECTED_VIEWS.length} route combinations).`);
}

function validateVersionConsistency(shared) {
  const version = shared.DESIGN_LAB.version;
  assert(/^\d+\.\d+\.\d+$/.test(version), `Invalid semantic version: ${version}`);
  const quality = read('quality.js');
  assert(quality.includes(`const VERSION = '${version}'`), `quality.js version does not match config.js (${version}).`);
  const readme = read('README.md');
  assert(readme.includes(`**Current version:** \`${version}\``), `README.md version does not match config.js (${version}).`);
  const checklist = read('DESIGN-LAB-CHECKLIST.md');
  assert(checklist.includes(`**Current version:** \`${version}\``), `DESIGN-LAB-CHECKLIST.md version does not match config.js (${version}).`);
  validateHtmlReferences(version);
  if (!failures.length) pass(`Version consistency passed (v${version}).`);
}

function validateCssBalance() {
  const cssFiles = ['styles.css', 'foundation.css', 'look3.css', 'look4.css', 'look6.css', 'look6-quality.css'];
  for (const file of cssFiles) {
    const source = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
    let balance = 0;
    for (const character of source) {
      if (character === '{') balance += 1;
      if (character === '}') balance -= 1;
      if (balance < 0) break;
    }
    assert(balance === 0, `${file} has unbalanced braces (balance ${balance}).`);
  }
  if (!failures.length) pass(`CSS brace-balance checks passed (${cssFiles.length} stylesheets).`);
}

function main() {
  validateRequiredFiles();
  validateImportGraph();
  let shared;
  try {
    shared = evaluateSharedModules();
    pass('Shared modules evaluated successfully in an isolated VM context.');
  } catch (error) {
    fail(`Shared module evaluation failed: ${error.stack || error.message}`);
  }
  if (shared) {
    validateFixtures(shared);
    validateRenderersAndRouting(shared);
    validateVersionConsistency(shared);
  }
  validateCssBalance();

  console.log('Nudge Design Lab validation');
  console.log('===========================');
  notes.forEach(message => console.log(`PASS  ${message}`));
  if (failures.length) {
    failures.forEach(message => console.error(`FAIL  ${message}`));
    console.error(`\n${failures.length} validation failure${failures.length === 1 ? '' : 's'}.`);
    process.exitCode = 1;
  } else {
    console.log('\nAll static, fixture, import, renderer, route, version, and CSS checks passed.');
  }
}

main();
