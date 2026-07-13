const VALID_ROOTS = new Set(['today', 'areas', 'item', 'lists', 'tasks', 'more']);

function normalizeRoute(value) {
  const cleaned = String(value || '').replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');
  if (!cleaned) return 'today';
  const [root] = cleaned.split('/');
  return VALID_ROOTS.has(root) ? cleaned : 'today';
}

let currentRoute = normalizeRoute(location.hash);
const listeners = new Set();

function emit() {
  currentRoute = normalizeRoute(location.hash);
  listeners.forEach(listener => listener(currentRoute));
}

window.addEventListener('hashchange', emit);

export const router = {
  getRoute() { return currentRoute; },
  getParts() { return currentRoute.split('/'); },
  go(route) {
    const next = normalizeRoute(route);
    if (next === currentRoute && location.hash) { emit(); return; }
    location.hash = `#/${next}`;
  },
  back(fallback = 'today') {
    if (history.length > 1) history.back();
    else this.go(fallback);
  },
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
};
