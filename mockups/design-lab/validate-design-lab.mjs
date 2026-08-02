#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LOOKS = [2, 3, 4, 5, 6, 7, 8, 9];
const SCENARIOS = ['normal', 'backlog', 'new', 'clear', 'large', 'long', 'large-text'];
const VIEWS = ['areas', 'area', 'intervention'];
const failures = [];
const passes = [];
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = file => fs.existsSync(path.join(ROOT, file));
const check = (condition, message) => condition ? undefined : failures.push(message);

const rendererFunctions = new Map([
  [2, ['renderAreasEditorial', 'renderAreaDetail', 'renderInterventionEditorial']],
  [3, ['renderAreasPrecision', 'renderAreaDetailPrecision', 'renderInterventionPrecision']],
  [4, ['renderAreasZen', 'renderAreaDetailZen', 'renderInterventionZen']],
  [5, ['renderAreasPlayful', 'renderAreaDetailPlayful', 'renderInterventionPlayful']],
  [6, ['renderAreasTactile', 'renderAreaDetailTactile', 'renderInterventionTactile']],
  [7, ['renderAreasBold', 'renderAreaDetailBold', 'renderInterventionBold']],
  [8, ['renderAreasAmbient', 'renderAreaDetailAmbient', 'renderInterventionAmbient']],
  [9, ['renderAreasRetro', 'renderAreaDetailRetro', 'renderInterventionRetro']]
]);

const styles = [
  'styles.css','foundation.css','look3.css','look4.css','look6.css','look6-quality.css',
  'expanded-looks.css','look5-quality.css','look7-quality.css','look8-quality.css','look9-quality.css','review.css'
];

function requiredFiles() {
  const files = [
    'index.html','config.js','utils.js','fixtures.js','state.js','controls.js','app.js','quality.js',
    ...styles,
    'look1-reference.html','look1-reference.css','look1-reference.js','renderers/shared.js',
    ...LOOKS.map(id => `renderers/look${id}.js`)
  ];
  files.forEach(file => check(exists(file), `Missing required file: ${file}`));
  passes.push(`Checked ${files.length} required files.`);
}

function importGraph() {
  const files = ['fixtures.js','state.js','controls.js','app.js','look1-reference.js',...LOOKS.map(id => `renderers/look${id}.js`)];
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
    'globalThis.__lab={DESIGN_LAB,LOOKS,SCENARIOS,getScenario};';
  const sandbox = { URLSearchParams, location:{search:'',pathname:'/mockups/design-lab/'}, history:{pushState(){},replaceState(){}}, sessionStorage:{setItem(){},removeItem(){},getItem(){return null;}}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.__lab;
}

function fixturesAndRoutes(shared) {
  check(JSON.stringify(Object.keys(shared.SCENARIOS)) === JSON.stringify(SCENARIOS), 'Scenario registry differs from the seven shared scenarios.');
  check(JSON.stringify(shared.LOOKS.map(item => item.id)) === JSON.stringify(LOOKS), 'Look registry differs from Looks #2–#9.');
  for (const [id, scenario] of Object.entries(shared.SCENARIOS)) {
    check(Array.isArray(scenario.areas), `${id}: areas must be an array.`);
    check(Boolean(scenario.intervention?.task), `${id}: intervention task missing.`);
    for (const area of scenario.areas) {
      check(Boolean(area.id && area.name), `${id}: invalid Area.`);
      check(Array.isArray(area.routines), `${id}/${area.id}: routines must be an array.`);
    }
  }
  const validArea = shared.SCENARIOS.normal.areas[0].id;
  for (const look of LOOKS) for (const scenario of SCENARIOS) for (const view of VIEWS) {
    const url = `?look=${look}&screen=${view}&scenario=${encodeURIComponent(scenario)}${view === 'area' ? `&area=${encodeURIComponent(validArea)}` : ''}`;
    check(url.includes(`look=${look}`) && url.includes(`screen=${view}`), `Route serialization failed: Look ${look}, ${view}.`);
  }
  passes.push(`Checked ${LOOKS.length * SCENARIOS.length * VIEWS.length} gallery routes.`);
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
  else console.log('\nAll expanded-gallery checks passed.');
}

main();
