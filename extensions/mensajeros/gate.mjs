const host=parent.NeoCourierGateHost;
if(!host)throw Error('La compuerta necesita un encargo activo.');
const $=selector=>document.querySelector(selector);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const dialog=$('#resultDialog');
let view=null,current=null,documentIndex=0,mobileView='panel',lastKey='',resultShownFor='';

function family(){return current.family==='archivo'?{number:'02',plate:'AT · 06 / RESERVA'}:{number:'01',plate:'MT · 417 A'};}
function state(){return view.session;}
function refresh(){
  const next=host.current();if(!next)return false;
  if(next.key!==lastKey){lastKey=next.key;documentIndex=0;mobileView='panel';resultShownFor='';closeResult();}
  view=next;current=next.puzzle;return true;
}
function renderStory(){
  $('#gateTitle').textContent=current.title;
  $('#gateLocation').textContent=current.location;
  $('#difficulty').textContent=current.difficulty.toUpperCase();
  $('#caseNumber').textContent=family().number;
  $('#fileNumber').textContent=family().number+' / '+current.id.toUpperCase().replaceAll('-',' · ');
  $('#story').innerHTML=`<h2 class="story-title">${escapeHTML(current.title)}</h2><p class="story-copy">${escapeHTML(current.intro)}</p>`;
  $('#documentTabs').innerHTML=current.documents.map((d,i)=>`<button data-document="${i}" aria-pressed="${documentIndex===i}" aria-controls="documentBody">${escapeHTML(d.label)}</button>`).join('');
  const evidence=current.documents[documentIndex];
  $('#documentBody').innerHTML=`<h3>${escapeHTML(evidence.title)}</h3>${evidence.paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}${evidence.rows?`<table class="evidence-table" aria-label="${escapeHTML(evidence.title)}"><tbody>${evidence.rows.map(([label,value])=>`<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(value)}</td></tr>`).join('')}</tbody></table>`:''}`;
  renderHints();
}
function renderHints(){
  const s=state();
  $('#hintArea').innerHTML=`<button class="hint-button" data-action="hint" ${s.hints===3||['intro','success'].includes(s.phase)?'disabled':''}>${s.hints===3?'Pistas consultadas':s.hints?'Otra pista':'Necesito una pista'}</button><small>${s.hints} / 3 · sin penalización</small>${current.hints.slice(0,s.hints).map((h,i)=>`<p class="hint"><b>${pad(i+1)}</b>${escapeHTML(h)}</p>`).join('')}<button class="secondary mobile-evidence-link" data-view="panel">Volver al panel</button>`;
}
const screws='<i class="screw tl"></i><i class="screw tr"></i><i class="screw bl"></i><i class="screw br"></i>';
function keypad(disabled){
  return `<div class="keypad" role="group" aria-label="Teclado numérico de acceso">${['1','2','3','4','5','6','7','8','9','erase','0','enter'].map(key=>{
    const command=['erase','enter'].includes(key),label=key==='erase'?'Borrar cifra':key==='enter'?'Validar clave':`Número ${key}`;
    return `<button class="key ${command?'command':''} ${key==='enter'?'enter':''}" data-action="${key==='enter'?'submit':key==='erase'?'erase':'digit'}" ${!command?`data-digit="${key}"`:''} aria-label="${label}" ${disabled?'disabled':''}>${key==='erase'?'BOR':key==='enter'?'ENT':key}</button>`;
  }).join('')}</div>`;
}
function numericPanel(){
  const s=state(),f=family(),active=s.phase==='active';
  const display=Array.from({length:current.digits},(_,i)=>`<span class="${s.digits[i]===undefined?'empty':''}">${s.digits[i]??'_'}</span>`).join('');
  return `<div class="cabinet ${current.family==='archivo'?'archive':''} ${s.phase==='intro'?'is-intro':''}">${screws}<div class="cabinet-heading"><strong>${current.family==='archivo'?'CONTROL DE ACCESO':'ACCESO DE PERSONAL'}</strong><span class="serial">${f.plate}<br>RED INTERIOR</span></div><div class="display-frame"><div class="lcd-label">${current.digits} CIFRAS / ${s.phase==='success'?'AUTORIZADO':'IDENTIFICACIÓN'}</div><div class="digits ${current.digits===6?'six':''}" aria-label="Clave introducida: ${escapeHTML(s.digits||'vacía')}">${display}</div><div class="lcd-status">${s.phase==='success'?'CIERRE LIBERADO':s.phase==='locked'?'CONTROL BLOQUEADO':active?'ESPERANDO CLAVE':'SISTEMA EN ESPERA'}</div></div><div class="lamp-row"><span class="lamp-label"><i class="lamp red"></i>CIERRE</span><span class="lamp-label"><i class="lamp ${s.solved?'on':''}"></i>ACCESO</span><span>${s.remaining} / ${current.attempts}</span></div>${keypad(!active)}<p class="cabinet-note">${escapeHTML(current.inscription)}</p><div class="device-bottom"><span>MANTENIMIENTO · METRO</span><span>2130 / RESERVA</span></div></div>`;
}
function renderPanel(){
  const s=state(),previous=document.activeElement?.dataset;
  $('#location').textContent=current.location.toUpperCase();
  $('#phaseLabel').textContent=({intro:'EN ESPERA',active:'EN EXAMEN',failed:'RECHAZADO',locked:'BLOQUEADO',success:'ABIERTO'})[s.phase];
  const arrival=s.phase==='intro'?'<div class="arrival"><span class="eyebrow">COMPUERTA LOCALIZADA</span><p>El desvío continúa detrás de una antigua puerta de personal. El panel conserva alimentación y junto al marco quedaron los registros necesarios.</p><button class="primary" data-action="start">Examinar panel</button></div>':'';
  const terminal=['success','locked'].includes(s.phase);
  $('#stage').innerHTML=`${arrival}<p class="instruction">${escapeHTML(current.instruction)}</p>${numericPanel()}<p class="feedback" role="status">${escapeHTML(s.feedback)}</p>${terminal?'<button class="secondary result-return" data-action="result">Ver resultado</button>':''}<button class="secondary mobile-evidence-link" data-view="evidence">Leer relato y evidencias</button>`;
  $('#attempts').innerHTML=Array.from({length:current.attempts},(_,i)=>`<span class="attempt-dot ${i>=s.remaining?'spent':''}" aria-hidden="true"></span>`).join('')+`<span class="attempt-label">${s.remaining} / ${current.attempts}</span>`;
  $('#attempts').setAttribute('aria-label',`${s.remaining} ${s.remaining===1?'intento restante':'intentos restantes'} de ${current.attempts}`);
  if(previous?.action&&!dialog.open){const q=`[data-action="${previous.action}"]${previous.digit?`[data-digit="${previous.digit}"]`:''}:not(:disabled)`;$('#stage').querySelector(q)?.focus({preventScroll:true});}
}
function setView(next){
  mobileView=next;$('#workgrid').dataset.mobileView=next;
  document.querySelectorAll('.mobile-switch [data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===next)));
}
function renderAll(){renderStory();renderPanel();setView(mobileView);}
function closeResult(){if(dialog.open)dialog.close();document.body.classList.remove('modal-open');}
function openResult(force=false){
  const s=state();if(!['failed','locked','success'].includes(s.phase))return;
  const signature=`${lastKey}:${s.phase}:${s.remaining}`;if(!force&&signature===resultShownFor&&dialog.open)return;resultShownFor=signature;
  const success=s.phase==='success',locked=s.phase==='locked';
  const heading=success?'Compuerta abierta.':locked?'Intentos agotados.':'Código rechazado.';
  const visual=success?'<div class="door-scene" aria-label="Animación de la compuerta abriéndose"><div class="door-leaf"></div><div class="door-leaf right"></div></div>':`<div class="failure-display"><span class="failure-mark" aria-hidden="true">×</span><div><strong>ACCESO DENEGADO</strong><small>${s.remaining?`${s.remaining} ${s.remaining===1?'INTENTO DISPONIBLE':'INTENTOS DISPONIBLES'}`:'CONTROL BLOQUEADO · DESVÍO CERRADO'}</small></div></div>`;
  $('#resultBody').innerHTML=`<section class="outcome ${success?'success':'failure'}"><div class="outcome-head"><span>${success?'COMPROBACIÓN ACEPTADA':'COMPROBACIÓN FALLIDA'} / ${family().number}</span><button class="outcome-close" data-action="dismiss-result" aria-label="Cerrar resultado">×</button></div>${visual}<h2 id="resultTitle" tabindex="-1">${heading}</h2><p>${escapeHTML(success?current.success:s.lastReason||'La compuerta permanece cerrada.')}</p>${success?'<p class="success-stamp">GALERÍA DE SERVICIO / PASO HABILITADO</p>':s.remaining?`<p>${s.remaining===1?'Te queda':'Te quedan'} <strong>${s.remaining} ${s.remaining===1?'intento':'intentos'}</strong>. Puedes revisar los documentos antes de probar otra vez.</p>`:'<p>El control ya no acepta claves. Regresa al encuentro y elige otra forma de atravesar el tramo.</p>'}<div class="outcome-actions">${success?'<button class="primary" data-action="cross">Cruzar la compuerta</button><button class="secondary" data-action="review">Revisar evidencias</button>':locked?'<button class="primary danger-return" data-action="leave">Volver al encuentro</button>': '<button class="primary" data-action="retry">Volver al panel</button><button class="secondary" data-action="review">Revisar evidencias</button>'}</div>${success||locked?`<details class="resolution"><summary>Ver resolución del acertijo</summary><p>${escapeHTML(current.explanation)}</p></details>`:''}</section>`;
  if(!dialog.open)dialog.showModal();document.body.classList.add('modal-open');$('#resultTitle').focus({preventScroll:true});
}
function applyAction(action){
  const before=state().phase;if(!host.act(action))return;
  refresh();renderAll();const after=state().phase;
  const announced=state().feedback||(action.type==='hint'?current.hints[state().hints-1]:action.type==='start'?current.instruction:'');if(announced)$('#announcer').textContent=announced;
  if(after!==before&&['failed','locked','success'].includes(after))openResult(true);
  if(action.type==='start')$('#stage .key:not(:disabled)')?.focus({preventScroll:true});
}
function leave(){closeResult();host.close();}
function sync(){if(!refresh())return;renderAll();if(['failed','locked','success'].includes(state().phase))openResult();else closeResult();}
document.addEventListener('click',event=>{
  const target=event.target.closest('button');if(!target||target.disabled)return;
  if(target.id==='leaveGate'){leave();return;}
  if(target.dataset.document!==undefined){documentIndex=Number(target.dataset.document);renderStory();$('#documentTabs').querySelector(`[data-document="${documentIndex}"]`)?.focus({preventScroll:true});return;}
  if(target.dataset.view){setView(target.dataset.view);return;}
  const type=target.dataset.action;if(!type)return;
  if(type==='result'){openResult(true);return;}
  if(type==='dismiss-result'){closeResult();if(state().phase==='failed')applyAction({type:'continue'});return;}
  if(type==='retry'||type==='review'){closeResult();if(state().phase==='failed')applyAction({type:'continue'});if(type==='review'){setView('evidence');$('#documentTabs button')?.focus({preventScroll:true});}return;}
  if(type==='cross'){closeResult();host.complete();return;}
  if(type==='leave'){leave();return;}
  applyAction({type,digit:target.dataset.digit});
});
dialog.addEventListener('cancel',event=>{event.preventDefault();if(state().phase==='locked'){leave();return;}closeResult();if(state().phase==='failed')applyAction({type:'continue'});});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.addEventListener('keydown',event=>{
  if(dialog.open||event.ctrlKey||event.metaKey||event.altKey||event.target.matches('input,textarea,select')||state().phase!=='active')return;
  if(/^\d$/.test(event.key)){event.preventDefault();applyAction({type:'digit',digit:event.key});}
  else if(event.key==='Backspace'){event.preventDefault();applyAction({type:'erase'});}
  else if(event.key==='Delete'){event.preventDefault();applyAction({type:'clear'});}
  else if(event.key==='Enter'&&(!event.target.closest('button')||event.target.closest('.key'))){event.preventDefault();applyAction({type:'submit'});}
});
host.ready({sync,back(){if(dialog.open){dialog.dispatchEvent(new Event('cancel',{cancelable:true}));return true;}leave();return true;}});
sync();
