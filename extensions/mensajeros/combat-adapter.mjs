import * as E from './production.mjs';

// The courier engine owns every transition and save. Exploration owns the view.
const host = parent.NeoCourierCombatHost;
if (!host) throw Error('Abre el combate desde Encargos.');
const data = host.data, $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = p => new URL(p, import.meta.url).href;
const definition = id => data.crew.find(p => p.id === id);
const current = () => host.world();
const combat = () => current().run?.pending?.combat;
const options = () => E.options(data, current());
let encounter = null, logStart = 0, pendingTurn = null;
function script(path) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script'); s.src = new URL('../../' + path, import.meta.url).href;
    s.onload = resolve; s.onerror = () => reject(Error('No se pudo cargar ' + path)); document.body.append(s);
  });
}
function transact(fn, ...args) { return host.transact(fn, ...args); }
function image(path, alt, cls = '', width = 590, height = 885) {
  return `<img src="${esc(path)}" alt="${esc(alt)}" class="${cls}" width="${width}" height="${height}" decoding="async">`;
}
Object.assign(window, {
  $, esc, state: {party: []}, battleState: null, lootInterval: null,
  clamp: (n,a,b) => Math.max(a,Math.min(b,n)), xpNeeded: () => 60,
  bagUsed: E.bagUsed, bagCapacity: p => E.bagCapacity(data,p),
  bagFree: p => E.bagCapacity(data,p)-E.bagUsed(p),
  gear: id => data.items[id] ? {...data.items[id], desc:data.items[id].description} : null,
  hungerPenalty: () => 0, weaponFor: p => data.items[p.equipment.weapon],
  psychState: () => ({name:'Estable',tone:''}), weaponAccuracyPenalty: () => 0,
  gearDurability: () => 100, lootDisassembleAction: () => '', itemDetailAttributes: () => '',
  portraitArt(path, alt, extra) {
    const id = path.split('/').pop().replace('.webp','');
    const person = definition(id), enemy = window.battleState?.enemies.find(e => e.type === id);
    return '<div class="portrait">' + image(person ? asset(person.image) : enemy ? asset(enemy.image) : new URL(path,document.baseURI).href,alt,'portrait-art '+(extra||''))+'</div>';
  },
  itemArt(id,alt) { return '<span class="item-art">'+image(asset(data.items[id].image),alt,'',256,256)+'</span>'; },
  toast(text) { const b=window.battleState;if(b){b.log.push(text);window.renderBattle();}host.announce(text); },
  endPlayerTurn() { pendingTurn = null;sync(); },
  generateLoot(enemy) {
    transact(E.revealLoot, window.battleState.enemies.indexOf(enemy));
    return drops(combat().enemies[window.battleState.enemies.indexOf(enemy)]);
  },
  renderCombatItems(p,disabled) {
    const usable = options().filter(o=>['heal','smoke-retreat','trap-retreat'].includes(o.id)&&Object.keys(o.cost||{}).every(id=>current().run.supplies[id]>0));
    $('itemTray').innerHTML = usable.map(o=>`<button class="item-action" data-courier-choice="${o.id}" ${disabled||!E.optionAvailable(current(),o)?'disabled':''}>${image(asset(data.items[Object.keys(o.cost)[0]].image),'','',34,34)}<span>${esc(o.label)}</span><b>${current().run.supplies[Object.keys(o.cost)[0]]}</b></button>`).join('') || `<p class="empty">${esc(p.name)} no lleva objetos utilizables.</p>`;
    $('itemsToggle').disabled = disabled;
  },
  takeLoot(index) { collect(index); }, takeAllLoot() { collect(null); },
  discardLoot(index) {
    const b=window.battleState,drop=b?.enemies[b.openLoot]?.loot[index];if(!drop||drop.status!=='pending')return;
    if(transact(E.discardLoot,b.openLoot,drop.id)){window.playSfx('loot-discard');refreshLoot();}
  },
  closeLootModal(preservePending = false) {
    const b=window.battleState;if(!b)return;
    if (!preservePending && b.openLoot != null) {
      for (const drop of b.enemies[b.openLoot].loot.filter(x=>x.status==='pending')) transact(E.discardLoot,b.openLoot,drop.id);
      syncEnemies();
    }
    $('lootModal').classList.add('hidden');b.openLoot=null;window.playSfx('loot-exit');
    if(!preservePending && b.enemies.every(e=>e.looted&&window.pendingLootUnits(e.loot)===0))window.finishLooting();else window.renderBattle();
  },
  finishLooting() {
    if(!window.battleState||window.battleState.busy)return;
    if(transact(E.finishLoot)){window.playSfx('loot-exit');exit();host.refresh();}
  }
});
await script('combat-common.js?v=1');
await script('combat-stage.js?v=3-field');
window.loadAudioRoutes();
window.audioUnlocked=true;
const tray=document.createElement('div');tray.id='fieldSkillTray';tray.className='hidden';tray.setAttribute('aria-label','Habilidades disponibles');document.querySelector('.combat-console').append(tray);window.fieldSkillTray=tray;
function closeSkills(){tray.classList.add('hidden');document.querySelector('[data-action="skill"]').setAttribute('aria-expanded','false');}
function skills(){
  const b=window.battleState;if(!b||b.busy||b.phase!=='combat')return;
  if(!tray.classList.contains('hidden')){closeSkills();return;}
  $('itemTray').classList.add('hidden');
  const p=window.state.party[b.actor];
  tray.innerHTML='<strong>Habilidades de '+esc(p.name)+'</strong>'+options().filter(o=>['skill','listen','melee','guided-retreat'].includes(o.id)).map(o=>`<button type="button" data-courier-choice="${o.id}" ${!E.optionAvailable(current(),o)?'disabled':''}>${esc(o.label)}</button>`).join('')+'<button type="button" data-close-skills>Cerrar habilidades</button>';
  tray.classList.remove('hidden');document.querySelector('[data-action="skill"]').setAttribute('aria-expanded','true');tray.querySelector('button:not([disabled])').focus();
}
function drops(e){return e.loot.map(x=>({...x,qty:x.qty||x.originalQty||1,status:x.qty>0?'pending':x.status||'taken'}));}
function syncParty(){window.state.party=current().run.party.map(p=>({...p,name:definition(p.id).name.split(' ')[0],role:definition(p.id).role}));}
function syncEnemies(){
  const b=window.battleState;
  b.enemies=combat().enemies.map((e,i)=>({...b.enemies[i],...e,type:e.id==='drone'?'drone':e.id==='scout'?'merodeador':'merodeador2',role:e.id==='drone'?'Vigilancia mecánica':e.id==='scout'?'Asaltante de los túneles':'Vigía armado',stun:e.stunned?1:0,looted:!!e.searched,searching:false,lootMs:e.id==='drone'?2300:e.id==='scout'?1800:1600,loot:drops(e)}));
}
function refreshLoot(){
  const b=window.battleState,index=b.openLoot;syncParty();syncEnemies();window.renderBattle();window.renderLootModal(index);
}
function collect(index){
  const b=window.battleState;if(!b||b.busy||b.openLoot==null)return;
  const drop=index===null?null:b.enemies[b.openLoot].loot[index];if(index!==null&&drop?.status!=='pending')return;
  const ok=transact(E.collectLoot,b.openLoot,window.state.party[b.looter].id,drop?.id??null);
  b.lootMessage=ok?'':'No cabe todo el loot seleccionado. Elige objetos que quepan o cambia de saqueador.';
  if(ok)window.playSfx('loot-take');refreshLoot();
}
function exit(){
  window.resetCombatPresentation();clearInterval(window.lootInterval);window.stopLoopSfx('loot-loop');window.setSceneAmbience(null,250);
  window.battleState=null;encounter=null;pendingTurn=null;closeSkills();$('lootModal').classList.add('hidden');$('battle').classList.add('hidden');
}
function sync(){
  const r=current().run,c=combat();if(!c||r.status!=='active'){exit();return;}
  const key=r.mission+':'+r.combatSerial+':'+r.pending.edgeIndex;
  if(encounter!==key){
    exit();encounter=key;logStart=Math.max(0,r.log.length-1);
    window.battleState={config:{canFlee:true},actor:c.actor,target:c.target,phase:c.phase,round:c.round,looter:null,lootTarget:null,openLoot:null,skillUsed:{},busy:false,feedback:[],criticalFeedback:[],log:[],enemies:[]};
    $('battleTitle').textContent=E.eventFor(data,current())?.title||'Contacto en '+data.nodes[r.pending.to].name;
    $('battleBrief').textContent='Contacto en '+data.nodes[r.pending.to].name+'.';$('battle').dataset.scene='station';
  }
  if(pendingTurn||window.battleState.busy)return;
  const b=window.battleState,was=b.phase;syncParty();syncEnemies();
  Object.assign(b,{actor:c.actor,target:c.target,phase:c.phase,round:c.round,log:r.log.slice(logStart)});
  if(was!==b.phase){closeSkills();$('itemTray').classList.add('hidden');}
  $('battle').classList.remove('hidden');window.renderBattle();
  window.setSceneAmbience(c.phase==='loot'?'ambience-battle-victory':'ambience-battle',window.AUDIO_CROSSFADE_MS);
}
function choose(id){
  const b=window.battleState;if(!b||b.busy||pendingTurn||b.phase!=='combat')return;
  const option=options().find(o=>o.id===id);if(!option||!E.optionAvailable(current(),option))return;
  const oldParty=window.state.party,oldEnemies=b.enemies,oldActor=b.actor;
  if(!transact(E.choose,id))return;
  const weapon=data.items[oldParty[oldActor].equipment.weapon];
  window.playSfx(id==='fire'?(weapon.ammo==='ammo556'?'combat-shot-rifle':'combat-shot-9mm'):id==='melee'?'combat-melee':id==='cover'?'combat-defend':id.includes('retreat')?'combat-flee':id==='heal'?'hp-medical-use':id==='skill'&&oldParty[oldActor].id==='tomas'?'combat-skill-elias':'ui-click');
  closeSkills();$('itemTray').classList.add('hidden');
  if(!combat()||current().run.status!=='active'){exit();host.refresh();return;}
  syncParty();syncEnemies();
  oldParty.forEach((p,i)=>window.recordHp('ally',i,p.hp,window.state.party[i].hp,p.maxHp));
  oldEnemies.forEach((e,i)=>window.recordHp('enemy',i,e.hp,b.enemies[i].hp,e.maxHp));
  const newLogs=current().run.log.slice(logStart),actionLog=newLogs.slice(b.log.length);
  if(actionLog.some(x=>x.includes('crítico'))){window.playSfx('combat-critical');b.criticalFeedback.push({index:b.target,pIndex:oldActor});}
  if(actionLog.some(x=>x.includes('falla')))b.visualNotices=[{side:'ally',index:oldActor,kind:'miss',text:'FALLÓ'}];
  b.log=newLogs;pendingTurn=true;
  // The shared narration gate prevents double input; progress was already saved.
  window.endPlayerTurn();
}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
  window.unlockAudioAmbience();
  const action=button.dataset.action;
  if(action==='skill'){skills();return;}
  choose(action==='attack'?(options().some(o=>o.id==='fire'&&E.optionAvailable(current(),o))?'fire':'melee'):action==='defend'?'cover':'retreat');
}));
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled||!window.battleState)return;window.unlockAudioAmbience();
  if(button.dataset.courierChoice)choose(button.dataset.courierChoice);
  if(button.hasAttribute('data-close-skills'))closeSkills();
});
document.addEventListener('pointerover',event=>{const b=event.target.closest('button');if(b&&!b.disabled&&!b.contains(event.relatedTarget))window.playSfx('ui-hover');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!$('lootModal').classList.contains('hidden'))window.closeLootModal(true);else closeSkills();}});
$('itemsToggle').addEventListener('click',closeSkills);
$('takeAllLoot').onclick=()=>window.takeAllLoot();$('closeLoot').onclick=()=>window.closeLootModal();$('finishLoot').onclick=()=>window.finishLooting();
// Target changes stay in the saved encounter as well as the shared view.
const searchBody=window.beginLoot;
window.beginLoot=index=>{const b=window.battleState;if(b&&!b.busy&&b.looter!==null&&!b.enemies[index]?.looted)window.playSfx('loot-search');searchBody(index);};
const selectTarget=window.stageSelectTarget;
window.stageSelectTarget=index=>{if(window.battleState&&!window.battleState.busy){if(window.battleState.phase==='combat'&&!transact(E.target,index))return;window.playSfx('combat-target');selectTarget(index);}};
window.NeoCourierCombat={sync,setActive(active){if(active){window.audioUnlocked=true;sync();}else{window.setSceneAmbience(null);window.stopLoopSfx('loot-loop');}},back(){if(!$('lootModal').classList.contains('hidden'))window.closeLootModal(true);else closeSkills();return true;}};
host.ready(window.NeoCourierCombat);sync();
