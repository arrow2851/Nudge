import { store } from './state.js';
import { router } from './router.js';

const screen = document.querySelector('#screen');

function removeDuplicateAreaRows() {
  const [root, areaId, sectionId] = router.getRoute().split('/');
  if (root !== 'areas' || !areaId || sectionId) return;
  const seen = new Set();
  screen.querySelectorAll('.area-chore-row').forEach(row => {
    const id = row.querySelector('[data-task-id]')?.dataset.taskId;
    if (!id) return;
    if (seen.has(id)) row.remove();
    else seen.add(id);
  });
  screen.querySelectorAll('.area-routine-group').forEach(group => {
    if (!group.querySelector('.area-chore-row')) group.remove();
  });
}

function schedule() {
  requestAnimationFrame(removeDuplicateAreaRows);
}

store.subscribe(schedule);
router.subscribe(schedule);
schedule();