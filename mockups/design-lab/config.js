export const DESIGN_LAB = Object.freeze({
  version: '0.10.2',
  buildDate: '2026-08-02',
  branch: 'feature/design-lab',
  storageKey: 'nudge-design-lab-review-v1'
});

export const LOOKS = Object.freeze([
  { id: 2, name: 'Warm Editorial', status: 'Routine Completion Loop implemented', description: 'A calm household journal with practical utility underneath.' },
  { id: 3, name: 'Precision Minimal', status: 'Routine Completion and Task hierarchy implemented', description: 'Strict alignment, dense information, and a single sharp accent.' },
  { id: 4, name: 'Zen Focus', status: 'Routine Completion and Task hierarchy implemented', description: 'Quiet screens that reveal one useful action at a time.' },
  { id: 5, name: 'Playful Modular', status: 'Routine Completion and Task hierarchy implemented', description: 'Colorful blocks and friendly controls that make upkeep feel approachable.' },
  { id: 6, name: 'Tactile Household', status: 'Routine Completion Loop implemented', description: 'Physical labels, controls, and satisfying household-tool cues.' },
  { id: 7, name: 'Bold Utility', status: 'Next Task hierarchy implementation', description: 'High-contrast structure, thick rules, and unapologetically direct hierarchy.' },
  { id: 8, name: 'Ambient Glass', status: 'Routine Completion Loop implemented', description: 'Soft translucent layers, atmospheric depth, and calm modern polish.' },
  { id: 9, name: 'Retro Digital', status: 'Routine Completion Loop implemented', description: 'A friendly home operating system with segmented displays and terminal cues.' }
]);

export const ALLOWED_VIEWS = new Set(['today', 'areas', 'area', 'section', 'chore', 'tasks', 'intervention']);

export const ROUND_ONE_CONTROLS = Object.freeze([
  ['today', 'Today'],
  ['areas', 'Areas'],
  ['tasks', 'Tasks'],
  ['intervention', 'Intervention']
]);
