import { router } from './router.js';

document.addEventListener('click', event => {
  const row = event.target.closest('.list-row[data-action="request-complete"][data-task-id]');
  if (!row) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  router.go(`item/${row.dataset.taskId}`);
}, true);
