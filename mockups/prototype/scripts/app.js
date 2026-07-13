import { store } from './state.js';
import { router } from './router.js';
import { renderAreas, renderAreaDetail, renderRoomDetail, areaSheetMarkup, roomSheetMarkup, templateSheetMarkup } from './areas.js';
import { renderTaskDetail, taskEditSheet, snoozeSheet, rescheduleSheet } from './task-details.js';
import { completeItem, updateTask, snoozeTask, rescheduleTask, skipOccurrence, togglePause, reopenTask } from './task-actions.js';

const screen = document.querySelector('#screen');
const bottomNav = document.querySelector('#bottom-nav');
const overlayRoot = document.querySelector('#overlay-root');
const toastRoot = document.querySelector('#toast-root');
const ui = { overdueExpanded: false, quickAddType: 'task', quickAddContext: null, toastTimer: null, undoTimer: null, resetSession: null };

const icons = {
  today: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V20H4Z"/><path d="M9 20v-6h6v6"/></svg>',
  areas: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
  lists: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12h3M4 18h3"/></svg>',
  tasks: '<svg viewBox="0 0 24 24"><path d="M7 4h10v16H7z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>'
};
const navItems = [['today','Today'],['areas','Areas'],['add-space',''],['lists','Lists'],['tasks','Tasks']];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

function pageHeader(title, subtitle, actions = true) {
  return `<header class="page-header"><div><p class="eyebrow">${new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'}).format(new Date())}</p><h1>${title}</h1><p>${subtitle}</p></div>${actions ? '<div class="header-actions"><button class="icon-button" data-action="search">⌕</button><button class="icon-button" data-route="more">•••</button></div>' : ''}</header>`;
}
function locationText(task) { return [task.area, task.subarea].filter(Boolean).join(' › '); }
function taskRow(task, overdue = false) {
  return `<button class="list-row ${overdue ? 'overdue' : ''}" data-route="item/${task.id}"><span class="task-check">○</span><span class="row-content"><strong>${esc(task.title)}</strong><small>${esc(locationText(task))}${task.recurrence ? ` · ${esc(task.recurrence)}` : ''}</small>${overdue ? `<span class="due-label">${esc(task.due)}</span>` : ''}</span><span class="row-meta">${task.minutes}m ›</span></button>`;
}
function renderToday(state) {
  const open = state.tasks.filter(task => !task.completed && !task.paused);
  const today = open.filter(task => task.urgency === 'today');
  const overdue = open.filter(task => task.urgency === 'overdue');
  const candidates = open.filter(task => task.nudge);
  const quick = candidates.length ? candidates[state.quickWinIndex % candidates.length] : null;
  const pct = state.progress.totalToday ? Math.round(state.progress.completedToday / state.progress.totalToday * 100) : 100;
  return `${pageHeader('Today',`Good morning, ${esc(state.user.name)}`)}<div class="today-stack">
    <section class="card soft"><div class="progress-summary"><div><strong>${state.progress.completedToday} completed today</strong><div class="row-meta">A small task is enough.</div></div><strong>${state.progress.completedToday} / ${state.progress.totalToday}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></section>
    <div class="section-heading"><h2>Quick Win</h2><span>${quick ? `${quick.minutes} min` : 'All clear'}</span></div>
    ${quick ? `<section class="card accent quick-win-card"><p class="eyebrow" style="color:inherit;opacity:.82">Recommended now</p><h2>${esc(quick.title)}</h2><p>${esc(locationText(quick))}</p><div class="quick-win-meta"><span>${quick.minutes} minutes</span><span>${quick.type === 'chore' ? 'Chore' : 'Task'}</span><span>${quick.urgency === 'overdue' ? 'Overdue' : quick.due}</span></div><div class="quick-win-actions"><button class="button" data-route="item/${quick.id}">Open</button><button class="button secondary-on-accent" data-action="request-complete" data-task-id="${quick.id}">Done</button><button class="button secondary-on-accent" data-action="cycle-quick-win">Another</button></div></section>` : '<section class="card"><strong>Nothing urgent right now.</strong></section>'}
    <div class="section-heading"><h2>Due today</h2><span>${today.length}</span></div><section class="card today-list-card">${today.map(task => taskRow(task)).join('') || '<div class="empty-state" style="min-height:180px"><div><div class="empty-state-icon">✓</div><h2>Everything is done</h2><p>Your Today list is clear.</p></div></div>'}</section>
    <div class="section-heading"><h2>Overdue</h2><span>${overdue.length}</span></div><section class="card today-list-card"><button class="collapse-button" data-action="toggle-overdue"><span>${overdue.length ? 'Review overdue tasks' : 'Nothing overdue'}</span><span>⌄</span></button>${ui.overdueExpanded ? overdue.map(task => taskRow(task,true)).join('') : ''}</section>
    <div class="section-heading"><h2>Lists</h2><span>Quick access</span></div><div class="list-shortcuts">${state.lists.map(list => `<button class="list-shortcut" data-route="lists"><span class="list-shortcut-icon">${list.icon}</span><strong>${esc(list.name)}</strong><small>${list.activeCount} active · ${esc(list.subtitle)}</small></button>`).join('')}</div>
    <div class="section-heading"><h2>Recent</h2><span>${state.activity.length}</span></div><section class="card activity-card">${state.activity.slice(0,4).map(item => `<div class="activity-row"><span class="activity-icon">${item.icon}</span><span class="activity-copy"><strong>${esc(item.title)}</strong><small>${esc(item.detail)}</small></span><span class="activity-time">${esc(item.time)}</span></div>`).join('')}</section>
  </div>`;
}
function placeholder(route) {
  const details = { lists:['Lists','Reusable lists and remembered items.','☷'], tasks:['Tasks','One-time work, upcoming items, and waiting states.','✓'], more:['More','Settings, templates, insights, and supporting tools.','•••'] }[route] || ['Nudge','Ready for implementation.','N'];
  return `${pageHeader(details[0],details[1],route !== 'more')}<div class="empty-state"><div><div class="empty-state-icon">${details[2]}</div><h2>Foundation ready</h2><p>This destination is connected and ready for its feature implementation.</p><button class="button primary" data-action="open-quick-add">Open Quick Add</button></div></div>`;
}
function renderResetSession(state) {
  const session = ui.resetSession;
  const area = state.areas.find(item => item.id === session?.areaId);
  const room = area?.subareas.find(item => item.id === session?.roomId);
  const task = state.tasks.find(item => item.id === session?.taskIds[session.index]);
  if (!session || !area || !room || !task) return '';
  const progress = session.index + 1;
  return `<div class="reset-screen"><header class="reset-header"><button class="icon-button" data-action="exit-room-reset">✕</button><div><strong>${esc(room.name)} Reset</strong><small>${progress} of ${session.taskIds.length}</small></div><span></span></header><div class="reset-progress"><span style="width:${Math.round(progress/session.taskIds.length*100)}%"></span></div><main class="reset-main"><p class="eyebrow">Current task</p><h1>${esc(task.title)}</h1><p>${task.minutes} minutes · ${task.type === 'chore' ? 'Chore' : 'Task'}</p><button class="button primary block" data-action="complete-reset-task" data-task-id="${task.id}">Complete</button><button class="button ghost block" data-action="skip-reset-task">Skip</button></main><footer class="reset-up-next"><strong>Up next</strong>${session.taskIds.slice(session.index+1,session.index+4).map(id => { const next=state.tasks.find(item=>item.id===id); return next ? `<span>${esc(next.title)}</span>` : ''; }).join('') || '<span>Finish the reset</span>'}</footer></div>`;
}
function renderNav(route) {
  const root = route.split('/')[0];
  bottomNav.innerHTML = navItems.map(([key,label]) => key === 'add-space' ? '<span class="nav-item add-space">Add</span>' : `<button class="nav-item ${root===key?'active':''}" data-route="${key}">${icons[key]}<span>${label}</span></button>`).join('');
}
function render() {
  const route = router.getRoute();
  const [root, second, third] = route.split('/');
  const state = store.getState();
  document.documentElement.dataset.theme = state.user.theme;
  if (ui.resetSession) { screen.innerHTML = renderResetSession(state); bottomNav.innerHTML=''; document.querySelector('.fab').hidden=true; return; }
  document.querySelector('.fab').hidden=false;
  if (root==='today') screen.innerHTML=renderToday(state);
  else if (root==='item') screen.innerHTML=renderTaskDetail(state,second) || renderToday(state);
  else if (root==='areas' && third) screen.innerHTML=renderRoomDetail(state,second,third) || renderAreas(state,pageHeader);
  else if (root==='areas' && second) screen.innerHTML=renderAreaDetail(state,second,pageHeader) || renderAreas(state,pageHeader);
  else if (root==='areas') screen.innerHTML=renderAreas(state,pageHeader);
  else screen.innerHTML=placeholder(root);
  renderNav(route);
}
function showToast(message, undo=false) {
  clearTimeout(ui.toastTimer); clearTimeout(ui.undoTimer);
  toastRoot.innerHTML=`<div class="toast ${undo?'action-toast':''}"><span>${esc(message)}</span>${undo?'<button data-action="undo">UNDO</button>':''}</div>`;
  ui.toastTimer=setTimeout(()=>toastRoot.innerHTML='',undo?5200:2400);
  if(undo) ui.undoTimer=setTimeout(()=>store.clearUndo(),5500);
}
function closeSheet(){ overlayRoot.innerHTML=''; }
function parseQuickAdd(text, selectedType=ui.quickAddType){
  const lower=text.toLowerCase(); let type=selectedType;
  if(/\b(buy|grocery|groceries|milk|eggs|bread)\b/.test(lower)&&selectedType==='task') type='list';
  if(/\b(clean|wash|vacuum|mop|trash|replace filter)\b/.test(lower)) type='chore';
  let area='Personal',areaId='personal',subarea='',subareaId='';
  [['kitchen','House','house','Kitchen','kitchen'],['bathroom','House','house','Bathroom','bathroom'],['bedroom','House','house','Bedroom','bedroom'],['garage','House','house','Garage','garage'],['car','Car','car','',''],['work','Work','work','','']].forEach(([word,a,aid,s,sid])=>{if(lower.includes(word)){area=a;areaId=aid;subarea=s;subareaId=sid;}});
  if(ui.quickAddContext?.areaId){const a=store.getState().areas.find(x=>x.id===ui.quickAddContext.areaId);const r=a?.subareas.find(x=>x.id===ui.quickAddContext.roomId);area=a?.name||area;areaId=a?.id||areaId;subarea=r?.name||'';subareaId=r?.id||'';}
  let recurrence=''; if(lower.includes('daily')||lower.includes('every day')) recurrence='Daily'; else if(lower.includes('weekly')||lower.includes('every week')) recurrence='Weekly'; else if(lower.includes('monthly')||lower.includes('every month')) recurrence='Monthly';
  const match=lower.match(/(\d+)\s*(?:min|minute)/); const minutes=match?Number(match[1]):type==='chore'?10:5; const grading=type==='chore'&&/\b(clean|wash|vacuum|mop|organize|wipe)\b/.test(lower);
  return {type,area,areaId,subarea,subareaId,recurrence,minutes,grading};
}
function detectedMarkup(p){return `<small>Detected</small><div class="chip-row"><span class="chip selected">${p.type==='list'?'List item':p.type[0].toUpperCase()+p.type.slice(1)}</span><span class="chip">${esc(p.subarea||p.area)}</span>${p.recurrence?`<span class="chip">${p.recurrence}</span>`:''}<span class="chip">${p.minutes} min</span>${p.grading?'<span class="chip">Graded</span>':''}</div>`;}
function openQuickAdd(context=null){ui.quickAddType='task';ui.quickAddContext=context;const state=store.getState();overlayRoot.innerHTML=`<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><h2>Quick Add</h2><button class="icon-button" data-action="close-sheet">✕</button></header><div class="chip-row"><button class="chip quick-type selected" data-action="select-quick-type" data-type="task">Task</button><button class="chip quick-type" data-action="select-quick-type" data-type="chore">Chore</button><button class="chip quick-type" data-action="select-quick-type" data-type="list">List item</button></div><div class="field"><label>What needs doing?</label><input class="input" id="quick-title" placeholder="Clean bathroom weekly"></div><div class="detected-preview" id="detected-preview">${detectedMarkup(parseQuickAdd(''))}</div><div class="field"><label>Area override</label><select class="input" id="quick-area"><option value="">Use detected area</option>${state.areas.filter(a=>!a.archived).map(a=>`<option value="${a.id}">${a.icon} ${esc(a.name)}</option>`).join('')}</select></div><button class="button primary block" data-action="save-quick-add">Add item</button></section></div>`;requestAnimationFrame(()=>document.querySelector('#quick-title')?.focus());}
function saveQuickAdd(){const input=document.querySelector('#quick-title');const title=input?.value.trim();if(!title){showToast('Enter a task name first.');return;}const p=parseQuickAdd(title);if(p.type==='list'){closeSheet();showToast('List-item creation comes in the Lists batch.');return;}let areaId=document.querySelector('#quick-area')?.value||p.areaId;let subareaId=document.querySelector('#quick-area')?.value?'':p.subareaId;if(ui.quickAddContext?.areaId){areaId=ui.quickAddContext.areaId;subareaId=ui.quickAddContext.roomId||'';}store.addTask({id:`task-${Date.now()}`,title,type:p.type,areaId,subareaId,minutes:p.minutes,due:'Today',urgency:'today',completed:false,grading:p.grading,recurrence:p.recurrence,nudge:true,scheduleBasis:p.recurrence?'completion':'none'});closeSheet();showToast(`${title} added.`,true);}
function openGradeSheet(taskId,reset=false){const task=store.getState().tasks.find(x=>x.id===taskId);if(!task)return;overlayRoot.innerHTML=`<div class="sheet-backdrop" data-action="close-sheet"><section class="sheet" data-sheet><div class="sheet-handle"></div><header class="sheet-header"><div><p class="eyebrow">Completion</p><h2>How much did you complete?</h2></div><button class="icon-button" data-action="close-sheet">✕</button></header><p class="row-meta">${esc(task.title)}</p>${[['Light','Quick reset or surface cleaning'],['Moderate','Normal, thorough cleaning'],['Deep','Detailed full cleaning']].map(([g,c])=>`<button class="grade-option" data-action="${reset?'complete-reset-with-grade':'complete-with-grade'}" data-task-id="${task.id}" data-grade="${g}"><span class="grade-badge">${g[0]}</span><span><strong>${g}</strong><small>${c}</small></span></button>`).join('')}</section></div>`;}
function requestComplete(id){const task=store.getState().tasks.find(x=>x.id===id);if(!task)return;if(task.grading){openGradeSheet(id);return;}if(completeItem(id))showToast(`${task.title} completed.`,true);}
function startRoomReset(areaId,roomId){const ids=store.getState().tasks.filter(t=>!t.completed&&!t.paused&&t.areaId===areaId&&t.subareaId===roomId&&['today','overdue'].includes(t.urgency)).map(t=>t.id);if(!ids.length){showToast('Nothing is due in this room.');return;}ui.resetSession={areaId,roomId,taskIds:ids,index:0};render();}
function advanceReset(){if(!ui.resetSession)return;ui.resetSession.index++;if(ui.resetSession.index>=ui.resetSession.taskIds.length){const s=store.getState();const a=s.areas.find(x=>x.id===ui.resetSession.areaId);const r=a?.subareas.find(x=>x.id===ui.resetSession.roomId);ui.resetSession=null;render();showToast(`${r?.name||'Room'} reset complete.`);}else render();}
function completeResetTask(id,grade=''){const task=store.getState().tasks.find(x=>x.id===id);if(!task)return;if(task.grading&&!grade){openGradeSheet(id,true);return;}completeItem(id,grade);closeSheet();advanceReset();}
function saveArea(target){const name=document.querySelector('#area-name')?.value.trim();if(!name){showToast('Enter an area name.');return;}const id=target.dataset.areaId,icon=document.querySelector('#area-icon')?.value||'📍';if(id)store.updateArea(id,{name,icon});else{const area=store.addArea({name,icon,templateId:document.querySelector('#area-template')?.value||'',includeSuggestedSubareas:Boolean(document.querySelector('#include-suggested-rooms')?.checked)});closeSheet();router.go(`areas/${area.id}`);showToast(`${name} added.`,true);return;}closeSheet();showToast(`${name} updated.`,true);}
function saveRoom(target){const name=document.querySelector('#room-name')?.value.trim();if(!name){showToast('Enter a room name.');return;}const icon=document.querySelector('#room-icon')?.value||'🚪';const {areaId,roomId}=target.dataset;if(roomId)store.updateSubarea(areaId,roomId,{name,icon});else store.addSubarea(areaId,{name,icon});closeSheet();showToast(`${name} ${roomId?'updated':'added'}.`,true);}
function saveTaskEdit(id){const title=document.querySelector('#edit-task-title')?.value.trim();if(!title){showToast('Enter a title.');return;}updateTask(id,{title,minutes:Math.max(1,Number(document.querySelector('#edit-task-minutes')?.value)||5),recurrence:document.querySelector('#edit-task-recurrence')?.value||'',notes:document.querySelector('#edit-task-notes')?.value.trim()||'',nudge:Boolean(document.querySelector('#edit-task-nudge')?.checked)});closeSheet();showToast('Changes saved.',true);}

document.addEventListener('input',e=>{if(e.target.id==='quick-title'){const p=document.querySelector('#detected-preview');if(p)p.innerHTML=detectedMarkup(parseQuickAdd(e.target.value));}});
document.addEventListener('click',e=>{
  const target=e.target.closest('[data-route],[data-action]');if(!target)return;
  if(target.dataset.route){router.go(target.dataset.route);return;}
  const action=target.dataset.action;
  if(action==='detail-back') history.length>1?history.back():router.go('today');
  if(action==='open-quick-add')openQuickAdd(); if(action==='open-quick-add-for-area')openQuickAdd({areaId:target.dataset.areaId}); if(action==='open-quick-add-for-room')openQuickAdd({areaId:target.dataset.areaId,roomId:target.dataset.roomId});
  if(action==='close-sheet'&&(!e.target.closest('[data-sheet]')||target.matches('.icon-button')))closeSheet();
  if(action==='save-quick-add')saveQuickAdd(); if(action==='select-quick-type'){ui.quickAddType=target.dataset.type;document.querySelectorAll('.quick-type').forEach(b=>b.classList.toggle('selected',b===target));}
  if(action==='request-complete')requestComplete(target.dataset.taskId); if(action==='complete-with-grade'){completeItem(target.dataset.taskId,target.dataset.grade);closeSheet();showToast(`${target.dataset.grade} completion recorded.`,true);} if(action==='start-task')showToast('Focus mode comes with the intervention batch.');
  if(action==='open-edit-task')overlayRoot.innerHTML=taskEditSheet(store.getState(),target.dataset.taskId); if(action==='save-task-edit')saveTaskEdit(target.dataset.taskId);
  if(action==='open-snooze-sheet')overlayRoot.innerHTML=snoozeSheet(target.dataset.taskId); if(action==='apply-snooze'){snoozeTask(target.dataset.taskId,target.dataset.snooze);closeSheet();showToast('Task snoozed.',true);}
  if(action==='open-reschedule-sheet')overlayRoot.innerHTML=rescheduleSheet(target.dataset.taskId); if(action==='apply-reschedule'){const date=document.querySelector('#reschedule-date')?.value;if(!date){showToast('Choose a date.');return;}rescheduleTask(target.dataset.taskId,date);closeSheet();showToast('Due date updated.',true);}
  if(action==='skip-occurrence'){skipOccurrence(target.dataset.taskId);showToast('Occurrence skipped.',true);} if(action==='toggle-pause-task'){togglePause(target.dataset.taskId);showToast('Recurrence updated.',true);} if(action==='reopen-task'){reopenTask(target.dataset.taskId);showToast('Task reopened.',true);}
  if(action==='cycle-quick-win')store.cycleQuickWin(); if(action==='toggle-overdue'){ui.overdueExpanded=!ui.overdueExpanded;render();}
  if(action==='open-add-area')overlayRoot.innerHTML=areaSheetMarkup(store.getState()); if(action==='open-edit-area')overlayRoot.innerHTML=areaSheetMarkup(store.getState(),target.dataset.areaId); if(action==='select-area-icon'){document.querySelector('#area-icon').value=target.dataset.icon;document.querySelectorAll('.icon-choice').forEach(b=>b.classList.toggle('selected',b===target));} if(action==='save-area')saveArea(target);
  if(action==='open-add-room')overlayRoot.innerHTML=roomSheetMarkup(store.getState(),target.dataset.areaId); if(action==='open-edit-room')overlayRoot.innerHTML=roomSheetMarkup(store.getState(),target.dataset.areaId,target.dataset.roomId); if(action==='select-room-icon'){document.querySelector('#room-icon').value=target.dataset.icon;document.querySelectorAll('.icon-choice').forEach(b=>b.classList.toggle('selected',b===target));} if(action==='save-room')saveRoom(target);
  if(action==='open-template-sheet')overlayRoot.innerHTML=templateSheetMarkup(store.getState(),target.dataset.areaId); if(action==='apply-template'){store.applyTemplate(target.dataset.areaId,target.dataset.templateId);closeSheet();showToast('Template applied.',true);}
  if(action==='start-room-reset')startRoomReset(target.dataset.areaId,target.dataset.roomId); if(action==='complete-reset-task')completeResetTask(target.dataset.taskId); if(action==='complete-reset-with-grade')completeResetTask(target.dataset.taskId,target.dataset.grade); if(action==='skip-reset-task')advanceReset(); if(action==='exit-room-reset'){ui.resetSession=null;render();}
  if(action==='undo'&&store.undoLast())showToast('Last change undone.'); if(action==='reset-demo'){store.reset();ui.overdueExpanded=false;ui.resetSession=null;router.go('today');showToast('Demo data reset.');} if(action==='search')showToast('Search will be implemented in its feature batch.');
});
store.subscribe(render);router.subscribe(render);
const timeElement=document.querySelector('#status-time');function updateClock(){timeElement.textContent=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date());}updateClock();setInterval(updateClock,30000);if(!location.hash)router.go('today');render();
