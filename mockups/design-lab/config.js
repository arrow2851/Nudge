export const DESIGN_LAB = Object.freeze({
  version: '0.8.4',
  buildDate: '2026-08-01',
  branch: 'feature/design-lab',
  storageKey: 'nudge-design-lab-review-v1'
});

export const LOOKS = Object.freeze([
  { id: 2, name: 'Warm Editorial', status: 'Gallery direction', description: 'A calm household journal with practical utility underneath.' },
  { id: 3, name: 'Precision Minimal', status: 'Gallery direction', description: 'Strict alignment, dense information, and a single sharp accent.' },
  { id: 4, name: 'Zen Focus', status: 'Gallery direction', description: 'Quiet screens that reveal one useful action at a time.' },
  { id: 5, name: 'Playful Modular', status: 'Quality-passed gallery direction', description: 'Colorful blocks and friendly controls that make upkeep feel approachable.' },
  { id: 6, name: 'Tactile Household', status: 'Gallery direction', description: 'Physical labels, controls, and satisfying household-tool cues.' },
  { id: 7, name: 'Bold Utility', status: 'Quality-passed gallery direction', description: 'High-contrast structure, thick rules, and unapologetically direct hierarchy.' },
  { id: 8, name: 'Ambient Glass', status: 'Quality-passed gallery direction', description: 'Soft translucent layers, atmospheric depth, and calm modern polish.' },
  { id: 9, name: 'Retro Digital', status: 'Quality-passed gallery direction', description: 'A friendly home operating system with segmented displays and terminal cues.' }
]);

export const ALLOWED_VIEWS = new Set(['areas', 'area', 'intervention']);

export const ROUND_ONE_CONTROLS = Object.freeze([
  ['areas', 'Areas'],
  ['intervention', 'Intervention']
]);
