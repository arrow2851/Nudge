const VALID_ROUTES = new Set(['today', 'areas', 'lists', 'tasks', 'more']);

function normalizeRoute(value) {
  const route = String(value || '').replace(/^#\/?/, '').split('/')[0];
  return VALID_ROUTES.has(route) ? route : 'today';
}

let currentRoute = normalizeRoute(location.hash);
const listeners = new Set();

function emit() {
  currentRoute = normalizeRoute(location.hash);
  listeners.forEach(listener => listener(currentRoute));
}

window.addEventListener('hashchange', emit);

export const router = {
  getRoute() {
    return currentRoute;
  },

  go(route) {
    const next = normalizeRoute(route);
    if (next === currentRoute && location.hash) {
      emit();
      return;
    }
    location.hash = `#/${next}`;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
