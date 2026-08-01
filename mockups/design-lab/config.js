export const DESIGN_LAB = Object.freeze({
  version: '0.7.0',
  buildDate: '2026-08-01',
  branch: 'feature/design-lab',
  storageKey: 'nudge-design-lab-review-v1'
});

export const LOOKS = Object.freeze([
  { id: 2, name: 'Warm Editorial', status: 'Active audition', description: 'A calm household journal with practical utility underneath.' },
  { id: 3, name: 'Precision Minimal', status: 'Active audition', description: 'Strict alignment, dense information, and a single sharp accent.' },
  { id: 4, name: 'Zen Focus', status: 'Active audition', description: 'Quiet screens that reveal one useful action at a time.' },
  { id: 6, name: 'Tactile Household', status: 'Active audition', description: 'Physical labels, controls, and satisfying household-tool cues.' }
]);

export const ALLOWED_VIEWS = new Set(['areas', 'area', 'intervention']);

export const ROUND_ONE_CONTROLS = Object.freeze([
  ['areas', 'Areas'],
  ['intervention', 'Intervention']
]);
