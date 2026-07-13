import { store } from './state.js';

const clone = value => JSON.parse(JSON.stringify(value));

function addActivity(state, task, detail, icon = '•') {
  return [{ id: `activity-${Date.now()}`, title: task.title, detail, time: 'Just now', icon }, ...state.activity].slice(0, 8);
}

function recurrenceDays(recurrence = '') {
  const normalized = recurrence.toLowerCase();
  if (normalized === 'daily') return 1;
  if (normalized === 'weekly') return 7;
  if (normalized === 'monthly') return 30;
  const match = normalized.match(/every\s+(\d+)\s+days?/);
  return match ? Number(match[1]) : 0;
}

function dateLabel(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined }).format(date);
}

function normalizeStatusChanges(task, changes) {
  const next = { ...changes };
  if (!changes.status) return next;
  if (changes.status === 'inbox') {
    Object.assign(next, { completed: false, due: '', dueDate: '', urgency: 'none', snoozedUntil: '' });
  }
  if (changes.status === 'planned') {
    const invalidDueLabel = ['Waiting', 'Blocked', 'Completed'].includes(task.due);
    const explicitDue = typeof changes.due === 'string' && changes.due && !['Waiting', 'Blocked', 'Completed'].includes(changes.due);
    const due = explicitDue ? changes.due : invalidDueLabel ? '' : task.due || '';
    const urgency = changes.urgency || (due ? task.urgency === 'none' ? 'upcoming' : task.urgency : 'none');
    const dueDate = changes.dueDate !== undefined ? changes.dueDate : invalidDueLabel ? '' : task.dueDate || '';
    Object.assign(next, { completed: false, due, dueDate, urgency });
  }
  if (changes.status === 'waiting') {
    Object.assign(next, { completed: false, due: 'Waiting', dueDate: '', urgency: 'none', nudge: false });
  }
  if (changes.status === 'blocked') {
    Object.assign(next, { completed: false, due: 'Blocked', dueDate: '', urgency: 'none', nudge: false });
  }
  if (changes.status === 'completed') {
    Object.assign(next, { completed: true, urgency: 'none', nudge: false, completedAt: changes.completedAt || new Date().toISOString() });
  }
  return next;
}

export function completeItem(taskId, grade = '') {
  const current = store.getState();
  const task = current.tasks.find(item => item.id === taskId);
  if (!task || task.completed) return false;
  const previous = clone(current);
  const days = recurrenceDays(task.recurrence);
  const asNeeded = task.type === 'chore' && task.recurrence?.toLowerCase() === 'as needed';
  const completedAt = new Date().toISOString();
  const next = days ? new Date(Date.now() + days * 86400000) : null;
  const updated = asNeeded
    ? {
        ...task,
        status: 'planned',
        completed: false,
        completedAt,
        completionGrade: grade,
        due: 'As needed',
        dueDate: '',
        nextDueLabel: 'As needed',
        urgency: 'upcoming',
        lastCompletedAt: completedAt,
        snoozedUntil: '',
        skippedAt: ''
      }
    : days
      ? {
          ...task,
          status: 'planned',
          completed: false,
          completedAt,
          completionGrade: grade,
          due: dateLabel(next),
          nextDueLabel: dateLabel(next),
          urgency: 'upcoming',
          lastCompletedAt: completedAt,
          snoozedUntil: '',
          skippedAt: ''
        }
      : { ...task, status: 'completed', completed: true, completedAt, completionGrade: grade, urgency: 'none', nudge: false };
  const detail = asNeeded
    ? `${grade ? `${grade} · ` : ''}Completed · Available as needed`
    : days
      ? `${grade ? `${grade} · ` : ''}Completed · Next ${dateLabel(next)}`
      : grade ? `${grade} completion` : 'Completed';
  store.setState(state => ({
    tasks: state.tasks.map(item => item.id === taskId ? updated : item),
    progress: task.urgency === 'today' ? { ...state.progress, completedToday: Math.min(state.progress.totalToday, state.progress.completedToday + 1) } : state.progress,
    activity: addActivity(state, task, detail, '✓'),
    lastUndo: { label: `${task.title} completed`, snapshot: previous }
  }));
  return true;
}

export function updateTask(taskId, changes) {
  const current = store.getState();
  const task = current.tasks.find(item => item.id === taskId);
  if (!task) return false;
  const previous = clone(current);
  const normalizedChanges = normalizeStatusChanges(task, changes);
  store.setState(state => ({
    tasks: state.tasks.map(item => item.id === taskId ? { ...item, ...normalizedChanges } : item),
    activity: addActivity(state, task, 'Updated', '✎'),
    lastUndo: { label: `${task.title} updated`, snapshot: previous }
  }));
  return true;
}

export function snoozeTask(taskId, option) {
  const map = { 'later-today': ['Later today', 0], tomorrow: ['Tomorrow', 1], weekend: ['This weekend', 3], 'next-week': ['Next week', 7] };
  const [label, days] = map[option] || ['Tomorrow', 1];
  const date = new Date(Date.now() + days * 86400000);
  return updateTask(taskId, { status: 'planned', completed: false, due: label, urgency: 'upcoming', snoozedUntil: date.toISOString() });
}

export function rescheduleTask(taskId, isoDate) {
  if (!isoDate) return false;
  const date = new Date(`${isoDate}T12:00:00`);
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(date); target.setHours(0,0,0,0);
  const diff = Math.round((target - today) / 86400000);
  const urgency = diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'upcoming';
  const due = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : dateLabel(date);
  return updateTask(taskId, { status: 'planned', completed: false, due, dueDate: isoDate, urgency, snoozedUntil: '' });
}

export function skipOccurrence(taskId) {
  const current = store.getState();
  const task = current.tasks.find(item => item.id === taskId);
  if (!task || !task.recurrence) return false;
  const days = recurrenceDays(task.recurrence) || 7;
  const next = new Date(Date.now() + days * 86400000);
  return updateTask(taskId, { status: 'planned', due: dateLabel(next), nextDueLabel: dateLabel(next), urgency: 'upcoming', skippedAt: new Date().toISOString() });
}

export function togglePause(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  return task ? updateTask(taskId, { paused: !task.paused, nudge: task.paused ? task.nudge !== false : false }) : false;
}

export function reopenTask(taskId) {
  const task = store.getState().tasks.find(item => item.id === taskId);
  if (!task) return false;
  let urgency = 'none';
  if (task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${task.dueDate}T00:00:00`);
    const diff = Math.round((due - today) / 86400000);
    urgency = diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'upcoming';
  } else if (task.due === 'Today') urgency = 'today';
  else if (task.due) urgency = 'upcoming';
  return updateTask(taskId, {
    status: 'planned',
    completed: false,
    completedAt: '',
    completionGrade: '',
    urgency,
    due: task.due === 'Completed' ? '' : task.due || '',
    nudge: true
  });
}