import { store } from './state.js';
import { router } from './router.js';

function activeLists() {
  return (store.getState().lists || [])
    .filter(list => !list.archived)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || Number(a.order || 0) - Number(b.order || 0));
}

function patchTodayShortcuts() {
  if (router.getRoute().split('/')[0] !== 'today') return;
  const buttons = [...document.querySelectorAll('.list-shortcuts .list-shortcut')];
  const lists = activeLists();
  buttons.forEach((button, index) => {
    const list = lists[index];
    if (!list) {
      button.remove();
      return;
    }
    button.dataset.route = `lists/${list.id}`;
    const icon = button.querySelector('.list-shortcut-icon');
    const title = button.querySelector('strong');
    const meta = button.querySelector('small');
    if (icon) icon.textContent = list.icon || '☷';
    if (title) title.textContent = list.name;
    if (meta) {
      const count = Array.isArray(list.items)
        ? list.items.filter(item => !item.completed).length
        : Number(list.activeCount || 0);
      const remembered = Array.isArray(list.catalog) ? list.catalog.length : 0;
      meta.textContent = `${count} active${remembered ? ` · ${remembered} remembered` : ''}`;
    }
  });
}

function schedulePatch() {
  requestAnimationFrame(patchTodayShortcuts);
}

store.subscribe(schedulePatch);
window.addEventListener('hashchange', schedulePatch);
schedulePatch();