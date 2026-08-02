export const clone = value => JSON.parse(JSON.stringify(value));

export const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

export function attentionCount(area) {
  return area.routines.filter(item => item.status === 'overdue' || item.status === 'today').length;
}

export function overdueCount(area) {
  return area.routines.filter(item => item.status === 'overdue').length;
}

export function statusFor(area) {
  const overdue = overdueCount(area);
  const due = area.routines.filter(item => item.status === 'today').length;
  if (overdue) return { className: 'overdue', label: `${overdue} overdue`, count: overdue };
  if (due) return { className: 'due', label: `${due} due today`, count: due };
  return { className: '', label: 'Up to date', count: 'Clear' };
}

export function nextRoutine(area) {
  const priority = { overdue: 0, today: 1, upcoming: 2, 'as-needed': 3 };
  return [...area.routines].sort((a, b) => {
    const completionDelta = Number(Boolean(a.completion)) - Number(Boolean(b.completion));
    return completionDelta || priority[a.status] - priority[b.status];
  })[0];
}

export function dueLabel(status) {
  if (status === 'overdue') return 'Overdue';
  if (status === 'today') return 'Today';
  if (status === 'as-needed') return 'As needed';
  return 'Upcoming';
}
