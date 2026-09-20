import { FAMILIES, PUZZLES } from './puzzles.mjs';
import { STORAGE_KEY, freshSession, restoreSession, transition, pairKey } from './core.mjs';

const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = number => String(number).padStart(2,'0');
let stored = {};
let saving = true;
try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { saving = false; }
const sessions = new Map(PUZZLES.map(p => [p.id,restoreSession(p,stored.sessions?.[p.id])]));
let hashId = '';
try { hashId = decodeURIComponent(location.hash.slice(1)); } catch { /* Un fragmento inválido no impide iniciar. */ }
let current = PUZZLES.find(p => p.id === hashId) || PUZZLES.find(p => p.id === stored.last) || PUZZLES[0];
let documentIndex = 0;
let soundOn = false;
let audioContext;
let mobileView = 'panel';
let logOpen = false;
const dialog = $('#resultDialog');

function state() { return sessions.get(current.id); }
function family() { return FAMILIES.find(f => f.id === current.family); }
function save() {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify({ version:1,last:current.id,sessions:Object.fromEntries(sessions) })); saving = true; } catch { saving = false; }
  $('#saveStatus').textContent = saving ? 'El progreso se guarda en este navegador. Leer y medir no consumen intentos.' : 'Guardado no disponible en este navegador. Puedes jugar; el progreso durará esta sesión.';
}

function tone(type) {
  if (!soundOn) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if (audioContext.state === 'suspended') audioContext.resume().catch(()=>{});
    const tones = type === 'success' ? [392,494,587] : type === 'failed' ? [150,110] : type === 'measure' ? [740] : [280];
    tones.forEach((freq,i) => {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      const start = audioContext.currentTime + i * .13;
      oscillator.type = type === 'failed' ? 'triangle' : 'sine'; oscillator.frequency.value = freq;
      gain.gain.setValueAtTime(0,start); gain.gain.linearRampToValueAtTime(.035,start+.012); gain.gain.exponentialRampToValueAtTime(.001,start+.12);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(start); oscillator.stop(start+.14);
    });
  } catch { /* El sonido nunca bloquea un panel. */ }
}

function renderNavigation() {
  const count = PUZZLES.filter(p=>sessions.get(p.id).solved).length;
  $('#totalSolved').textContent = `${pad(count)} / 15`;
  $('#families').innerHTML = FAMILIES.map(f => {
    const complete = PUZZLES.filter(p=>p.family===f.id&&sessions.get(p.id).solved).length;
    return `<button class="family" data-family="${f.id}" aria-pressed="${f.id===current.family}" style="--preview:url('assets/${f.id}.webp')"><span class="family-index">${f.number}</span><span><strong>${f.name}</strong><small>${f.subtitle}</small></span><span class="family-count">${complete}/5</span></button>`;
  }).join('');
  const cases = PUZZLES.filter(p=>p.family===current.family);
  $('#caseSelect').innerHTML = cases.map((p,i)=>`<option value="${p.id}"${p.id===current.id?' selected':''}>${pad(i+1)} · ${escapeHTML(p.title)}${sessions.get(p.id).solved?' · Resuelto':''}</option>`).join('');
  $('#caseCount').textContent = `${pad(cases.indexOf(current)+1)} / 05`;
  $('#difficulty').textContent = current.difficulty;
  $('#fileNumber').textContent = `${family().number}.${pad(cases.indexOf(current)+1)}`;
}

function renderStory() {
  $('#story').innerHTML = `<h2 class="story-title">${escapeHTML(current.title)}</h2><p class="story-copy">${escapeHTML(current.intro)}</p>`;
  $('#documentTabs').innerHTML = current.documents.map((d,i)=>`<button data-document="${i}" aria-pressed="${documentIndex===i}" aria-controls="documentBody">${escapeHTML(d.label)}</button>`).join('');
  const evidence = current.documents[documentIndex];
  $('#documentBody').innerHTML = `<h3>${escapeHTML(evidence.title)}</h3>${evidence.paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}${evidence.rows?`<table class="evidence-table" aria-label="${escapeHTML(evidence.title)}"><tbody>${evidence.rows.map(([label,value])=>`<tr><th scope="row">${escapeHTML(label)}</th><td>${escapeHTML(value)}</td></tr>`).join('')}</tbody></table>`:''}`;
  renderHints();
}

function renderHints() {
  const s = state();
  $('#hintArea').innerHTML = `<button class="hint-button" data-action="hint" ${s.hints===3||['intro','success'].includes(s.phase)?'disabled':''}>${s.hints===3?'Pistas consultadas':s.hints?'Otra pista':'Necesito una pista'}</button><small>${s.hints} / 3 · sin penalización</small>${current.hints.slice(0,s.hints).map((h,i)=>`<p class="hint"><b>${pad(i+1)}</b>${escapeHTML(h)}</p>`).join('')}<button class="secondary mobile-evidence-link" data-view="panel">Volver al panel</button>`;
}

const screws = '<i class="screw tl"></i><i class="screw tr"></i><i class="screw bl"></i><i class="screw br"></i>';
function keypad(isCircuit, disabled) {
  return `<div class="keypad" role="group" aria-label="${isCircuit?'Teclado numérico del medidor':'Teclado numérico de acceso'}">${['1','2','3','4','5','6','7','8','9','erase','0','enter'].map(key=> {
    const command = ['erase','enter'].includes(key);
    const unavailable = disabled || (isCircuit && ['0','7','8','9'].includes(key));
    const label = key==='erase'?'Borrar cifra':key==='enter'?(isCircuit?'Medir continuidad':'Validar clave'):`Número ${key}`;
    return `<button class="key ${command?'command':''} ${key==='enter'?'enter':''}" data-action="${key==='enter'?(isCircuit?'measure':'submit'):key==='erase'?'erase':'digit'}" ${!command?`data-digit="${key}"`:''} aria-label="${label}" ${unavailable?'disabled':''}>${key==='erase'?'BOR':key==='enter'?(isCircuit?'MED':'ENT'):key}</button>`;
  }).join('')}</div>`;
}

function numericPanel() {
  const s=state(), f=family(), active=s.phase==='active';
  const display=Array.from({length:current.digits},(_,i)=>`<span class="${s.digits[i]===undefined?'empty':''}">${s.digits[i]??'_'}</span>`).join('');
  return `<div class="cabinet ${f.id==='archivo'?'archive':''} ${s.phase==='intro'?'is-intro':''}">${screws}<div class="cabinet-heading"><strong>${f.id==='archivo'?'CONTROL DE ACCESO':'ACCESO DE PERSONAL'}</strong><span class="serial">${f.plate}<br>RED INTERIOR</span></div><div class="display-frame"><div class="lcd-label">${current.digits} CIFRAS / ${s.phase==='success'?'AUTORIZADO':'IDENTIFICACIÓN'}</div><div class="digits ${current.digits===6?'six':''}" aria-label="Clave introducida: ${escapeHTML(s.digits||'vacía')}">${display}</div><div class="lcd-status">${s.phase==='success'?'CIERRE LIBERADO':s.phase==='locked'?'CONTROL BLOQUEADO':active?'ESPERANDO CLAVE':'SISTEMA EN ESPERA'}</div></div><div class="lamp-row"><span class="lamp-label"><i class="lamp red"></i>CIERRE</span><span class="lamp-label"><i class="lamp ${s.solved?'on':''}"></i>ACCESO</span><span>${s.remaining} / ${current.attempts}</span></div>${keypad(false,!active)}<p class="cabinet-note">${escapeHTML(current.inscription)}</p><div class="device-bottom"><span>MANTENIMIENTO · METRO</span><span>2130 / RESERVA</span></div></div>`;
}

const coordinates={1:[75,44],2:[250,44],3:[425,44],4:[75,159],5:[250,159],6:[425,159]};
function circuitPanel() {
  const s=state(), active=s.phase==='active';
  const wires=s.bridges.map((pair,i)=> {
    const [x1,y1]=coordinates[pair[0]], [x2,y2]=coordinates[pair[1]];
    const curve=y1===y2?(y1<100?100:95):Math.max(y1,y2)+30;
    const path=`M${x1} ${y1} C${x1} ${curve},${x2} ${curve},${x2} ${y2}`;
    return `<path class="wire-shadow" d="${path}"/><path class="wire" stroke="${i?'#8cc7c5':'#d9aa60'}" d="${path}"/>`;
  }).join('');
  const terminals=Object.entries(coordinates).map(([number,[x,y]])=>`<button class="terminal ${s.digits.includes(number)?'selected':''}" style="left:${x/5}%;top:${y/2.14}%" data-action="digit" data-digit="${number}" aria-label="Punto ${number}" aria-pressed="${s.digits.includes(number)}" ${!active?'disabled':''}>${number}<small>PT ${number}</small></button>`).join('');
  const measured=s.meter, value=measured?(measured.value===null?'OL':`${measured.value.toFixed(1)} Ω`):'— —';
  const angle=!measured?-72:measured.value===null?-72:measured.value>2?-30:62;
  return `<div class="cabinet circuit">${screws}<div class="cabinet-heading"><strong>DIAGNÓSTICO<br>DE CONTINUIDAD</strong><span class="serial">DC · 24 / SERVICIO<br>${current.maxBridges} PUENTE${current.maxBridges>1?'S':''} DISPONIBLE${current.maxBridges>1?'S':''}</span></div><div class="terminal-board" role="group" aria-label="Bornes del gabinete"><svg class="wires" viewBox="0 0 500 214" preserveAspectRatio="none" aria-hidden="true">${wires}</svg>${terminals}<span class="board-label">BORNERA / CONTROL AISLADO</span></div><div class="diagnostic-deck"><div class="meter"><div class="meter-top"><span>COMPROBADOR</span><span>Ω</span></div><div class="gauge" aria-hidden="true"><i class="needle" style="--angle:${angle}deg"></i></div><output class="meter-value" aria-label="Lectura del medidor">${value}</output><span class="meter-pair">${measured?`PUNTOS ${measured.pair.join(' – ')}`:'SIN MEDICIÓN'}</span></div><div><div class="probe-digits" aria-label="Puntos seleccionados: ${escapeHTML(s.digits||'ninguno')}">${s.digits.padEnd(2,'_').split('').join(' ')}</div>${keypad(true,!active)}</div></div><div class="circuit-actions"><button class="device-action" data-action="measure" ${!active?'disabled':''}>MEDIR</button><button class="device-action" data-action="bridge" ${!active?'disabled':''}>INSTALAR PUENTE</button><button class="device-action activate" data-action="submit" ${!active?'disabled':''}>PROBAR CIERRE</button></div><div class="bridge-list"><span>PUENTES ${s.bridges.length}/${current.maxBridges}</span>${s.bridges.map(pair=>`<button class="bridge-chip" data-action="remove" data-key="${pairKey(...pair)}" aria-label="Retirar puente ${pair.join(' a ')}" ${!active?'disabled':''}>${pair.join(' — ')} &nbsp; ×</button>`).join('')}</div><p class="cabinet-note">${escapeHTML(current.inscription)}</p></div>`;
}

function renderPanel() {
  const s=state();
  const previousFocus=document.activeElement?.dataset;
  const focusAction=previousFocus?.action,focusDigit=previousFocus?.digit,focusKey=previousFocus?.key;
  $('#location').textContent=current.location.toUpperCase();
  const statuses={intro:'EN ESPERA',active:'EN EXAMEN',failed:'RECHAZADO',locked:'BLOQUEADO',success:'ABIERTO'};
  $('#phaseLabel').textContent=statuses[s.phase];
  const arrival=s.phase==='intro'?`<div class="arrival"><span class="eyebrow">COMPUERTA LOCALIZADA</span><p>El panel conserva alimentación. Examina los documentos junto a la puerta antes de probar.</p><button class="primary" data-action="start">Examinar panel</button></div>`:'';
  const instruction=current.kind==='circuit'?'Elige dos puntos con el teclado o tocando los bornes. <b>Medir es gratis.</b>':'Lee las evidencias e introduce la clave. <b>ENT</b> confirma; <b>BOR</b> borra una cifra.';
  const terminal=['success','locked'].includes(s.phase);
  const readings=current.kind==='circuit'&&s.readings.length?`<details class="readings" ${logOpen?'open':''}><summary>Registro de mediciones (${s.readings.length})</summary>${s.readings.map(r=>`<div class="reading-row"><span>${r.pair.join(' — ')} <small>· ${r.bridges} puente${r.bridges===1?'':'s'}</small></span><strong>${r.value===null?'OL':r.value.toFixed(1)+' Ω'}</strong></div>`).join('')}</details>`:'';
  $('#stage').innerHTML=`${arrival}<p class="instruction">${escapeHTML(current.instruction)}</p>${current.kind==='circuit'?circuitPanel():numericPanel()}<p class="feedback" role="status">${escapeHTML(s.feedback)}</p>${terminal?'<button class="secondary result-return" data-action="result">Ver resultado</button>':''}<button class="secondary mobile-evidence-link" data-view="evidence">Leer relato y evidencias</button>${readings}`;
  $('#benchInstruction').innerHTML=instruction;
  $('#attempts').innerHTML=Array.from({length:current.attempts},(_,i)=>`<span class="attempt-dot ${i>=s.remaining?'spent':''}" aria-hidden="true"></span>`).join('')+`<span class="attempt-label">${s.remaining} / ${current.attempts}</span>`;
  $('#attempts').setAttribute('aria-label',`${s.remaining} intentos restantes de ${current.attempts}`);
  $('.readings')?.addEventListener('toggle',event=>{logOpen=event.target.open;});
  if(focusAction&&!dialog.open) {
    const selector=`[data-action="${focusAction}"]${focusDigit?`[data-digit="${focusDigit}"]`:''}${focusKey?`[data-key="${focusKey}"]`:''}:not(:disabled)`;
    $('#stage').querySelector(selector)?.focus({preventScroll:true});
  }
}

function setView(view) {
  mobileView=view;
  $('#workgrid').dataset.mobileView=view;
  document.querySelectorAll('.mobile-switch [data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
}

function renderAll() {renderNavigation();renderStory();renderPanel();setView(mobileView);save();}

function selectCase(id) {
  const puzzle=PUZZLES.find(p=>p.id===id);if(!puzzle)return;
  closeResult();current=puzzle;documentIndex=0;logOpen=false;setView('panel');
  try {history.replaceState(null,'',`#${puzzle.id}`);}catch{/* Las copias locales pueden tener un origen opaco. */}
  renderAll();
}

function applyAction(action) {
  const before=state();
  const next=transition(before,current,action);
  sessions.set(current.id,next);
  renderPanel();renderHints();renderNavigation();save();
  const announced=next.feedback|| (action.type==='hint'?current.hints[next.hints-1]:action.type==='start'?current.instruction:'');
  if(announced)$('#announcer').textContent=announced;
  if(action.type==='digit'||action.type==='bridge')tone('key');
  if(action.type==='measure')tone('measure');
  if(next.phase!==before.phase&&['failed','locked','success'].includes(next.phase)) {tone(next.solved?'success':'failed');openResult();}
  if(action.type==='start')$('#stage').querySelector('.key:not(:disabled)')?.focus({preventScroll:true});
}

function closeResult() {if(dialog.open)dialog.close();document.body.classList.remove('modal-open');}
function openResult() {
  const s=state();if(!['failed','locked','success'].includes(s.phase))return;
  const success=s.phase==='success',terminal=success||s.phase==='locked';
  const heading=success?'Compuerta abierta.':s.phase==='locked'?'Intentos agotados.':current.kind==='circuit'?'El cierre no responde.':'Código rechazado.';
  const visual=success?'<div class="door-scene" aria-label="Animación de la compuerta abriéndose"><div class="door-leaf"></div><div class="door-leaf right"></div></div>':`<div class="failure-display"><span class="failure-mark" aria-hidden="true">×</span><div><strong>ACCESO DENEGADO</strong><small>${s.remaining?`${s.remaining} INTENTOS DISPONIBLES`:'CONTROL BLOQUEADO · CASO FINALIZADO'}</small></div></div>`;
  $('#resultBody').innerHTML=`<section class="outcome ${success?'success':'failure'}"><div class="outcome-head"><span>${success?'COMPROBACIÓN ACEPTADA':'COMPROBACIÓN FALLIDA'} / ${family().number}</span><button class="outcome-close" data-action="dismiss-result" aria-label="Cerrar resultado">×</button></div>${visual}<h2 id="resultTitle" tabindex="-1">${heading}</h2><p>${escapeHTML(success?current.success:s.lastReason||'La compuerta permanece cerrada.')}</p>${success?'<p class="success-stamp">GALERÍA DE SERVICIO / PASO HABILITADO</p>':s.remaining?`<p>Te quedan <strong>${s.remaining} intentos</strong>. Puedes revisar los documentos${current.kind==='circuit'?' y volver a medir':''} antes de probar otra vez.</p>`:'<p>La compuerta permanece cerrada. En este laboratorio puedes reiniciar el caso o probar otro acceso.</p>'}<div class="outcome-actions">${!terminal?'<button class="primary" data-action="retry">Volver al panel</button><button class="secondary" data-action="review">Revisar evidencias</button>':`<button class="primary" data-action="${success?'next':'restart'}">${success?'Probar siguiente caso':'Reiniciar este caso'}</button><button class="secondary" data-action="${success?'restart':'next'}">${success?'Volver a jugar este caso':'Probar otro caso'}</button>`}</div>${terminal?`<details class="resolution"><summary>Ver resolución del acertijo</summary><p>${escapeHTML(current.explanation)}</p></details>`:''}</section>`;
  if(!dialog.open)dialog.showModal();document.body.classList.add('modal-open');
  $('#resultTitle').focus({preventScroll:true});
}

document.addEventListener('click',event=> {
  const target=event.target.closest('button');if(!target||target.disabled)return;
  if(target.dataset.family) {const chosen=PUZZLES.find(p=>p.family===target.dataset.family);selectCase(chosen.id);return;}
  if(target.dataset.document!==undefined) {documentIndex=Number(target.dataset.document);renderStory();$('#documentTabs').querySelector(`[data-document="${documentIndex}"]`)?.focus({preventScroll:true});return;}
  if(target.dataset.view) {setView(target.dataset.view);if(target.closest('#stage')||target.closest('#hintArea'))$('.mobile-switch').scrollIntoView({block:'start',behavior:'smooth'});return;}
  const type=target.dataset.action;if(!type)return;
  if(type==='result'){openResult();return;}
  if(type==='dismiss-result'){closeResult();if(state().phase==='failed')applyAction({type:'continue'});return;}
  if(type==='retry'||type==='review'){closeResult();applyAction({type:'continue'});if(type==='review'){setView('evidence');$('#documentTabs button')?.focus({preventScroll:true});}return;}
  if(type==='restart'){closeResult();applyAction({type:'reset'});return;}
  if(type==='next'){selectCase(PUZZLES[(PUZZLES.indexOf(current)+1)%PUZZLES.length].id);return;}
  applyAction({type,digit:target.dataset.digit,key:target.dataset.key});
});
$('#caseSelect').addEventListener('change',event=>selectCase(event.target.value));
$('#resetCase').addEventListener('click',()=>{closeResult();applyAction({type:'reset'});});
$('#soundToggle').addEventListener('click',event=>{soundOn=!soundOn;event.currentTarget.setAttribute('aria-pressed',String(soundOn));event.currentTarget.textContent=soundOn?'Sonido encendido':'Sonido apagado';tone('key');});
$('#mobileToggle').addEventListener('click',event=>{const mobile=$('#lab').classList.toggle('mobile-preview');event.currentTarget.setAttribute('aria-pressed',String(mobile));event.currentTarget.textContent=mobile?'Vista escritorio':'Vista móvil';});
dialog.addEventListener('cancel',event=>{event.preventDefault();closeResult();if(state().phase==='failed')applyAction({type:'continue'});});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.addEventListener('keydown',event=> {
  if(dialog.open||event.ctrlKey||event.metaKey||event.altKey||event.target.matches('select,input,textarea')||state().phase!=='active')return;
  if(/^\d$/.test(event.key)){event.preventDefault();applyAction({type:'digit',digit:event.key});}
  else if(event.key==='Backspace'){event.preventDefault();applyAction({type:'erase'});}
  else if(event.key==='Delete'){event.preventDefault();applyAction({type:'clear'});}
  else if(event.key==='Enter'&&(!event.target.closest('button')||event.target.closest('.key'))){event.preventDefault();applyAction({type:current.kind==='circuit'?'measure':'submit'});}
});
window.addEventListener('hashchange',()=>{try{const id=decodeURIComponent(location.hash.slice(1));if(id!==current.id)selectCase(id);}catch{}});
renderAll();
