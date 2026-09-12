const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');
function session(){
 const {document,window}=parseHTML(fs.readFileSync(root+'/neosantiago-demo.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};
 window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
 Object.defineProperty(window.HTMLElement.prototype,'scrollHeight',{configurable:true,get(){return 70}});
 Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return /Units$/.test(this.id)?400:800}});
 Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{configurable:true,get(){return /Units$/.test(this.id)?320:700}});
 const a=boot(new Map(),{document}),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;
 c.state.index=2;c.state.party.forEach(p=>p.hunger=100);
 c.choose(c.eventDisplay(c.events[2],2).choices.findIndex(o=>o.combat&&!c.reason(o)));
 assert.ok(c.battleState);return Object.assign(a,{document,click(node){node.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}))}});
}
function timer(a,predicate){const t=[...a.timers].find(([,t])=>!t.interval&&predicate(t));assert.ok(t,'Expected callback');a.timers.delete(t[0]);t[1].fn()}
test('campaign encounter loads cards, complete log and animated inventory without a laboratory',()=>{
 const a=session(),c=a.ctx,d=a.document;
 assert.equal(d.querySelectorAll('#allyUnits .unit').length,3);
 assert.equal(d.querySelectorAll('#allyUnits .stage-front').length,1);
 assert.equal(d.querySelectorAll('#stageStatus .stage-status-card').length,2);
 a.click(d.getElementById('itemsToggle'));assert.equal(d.getElementById('itemTray').classList.contains('hidden'),false);
 a.click(d.getElementById('closeStageInventory'));assert.ok(d.getElementById('closeStageInventory').classList.contains('action'));
 assert.ok(d.getElementById('itemTray').classList.contains('inventory-closing'));
 assert.equal(d.getElementById('itemTray').classList.contains('hidden'),false);
 timer(a,t=>t.ms===320);assert.ok(d.getElementById('itemTray').classList.contains('hidden'));
 const full='Elías dispara contra el agente de la Red UNO y falla porque la cobertura del enemigo reduce su posibilidad de impacto. La munición utilizada se descuenta de su mochila, pero el enemigo conserva todos sus puntos de vida y permanece en combate.';
 c.battleState.log.push(full);c.renderBattle();let n=0;
 while(d.getElementById('stageLogLines').lastElementChild.textContent!==full){assert.ok(++n<20);timer(a,t=>t.fn.name==='showNextLog')}
 assert.equal(d.getElementById('stageLogLines').lastElementChild.textContent,full);
 assert.equal(c.parent,undefined);assert.equal(c.labConfig,undefined);
});
test('misses, level ups and loot card selection use the campaign inventory',()=>{
 const a=session(),c=a.ctx,d=a.document;
 c.startCombat({title:'Encuentro múltiple',enemies:['merodeador','drone'],canFlee:true},{label:'test',_decisionChanges:[]});
 c.d20=()=>1;c.combatAction('attack');assert.match(d.querySelector('#allyUnits .stage-notice').textContent,/FALLÓ/);
 c.battleState.busy=false;c.addPersonalXp(0,50,'prueba');c.renderBattle();assert.match(d.querySelector('#allyUnits .stage-notice').textContent,/NIVEL 2/);
 assert.ok(c.battleState.log.some(x=>x.includes('+6 HP máximos')&&x.includes('precisión')));
 c.battleState.enemies.forEach(e=>e.hp=0);c.beginLootPhase();
 a.click(d.querySelector('#allyUnits .portrait'));assert.equal(c.battleState.looter,0);
 a.click(d.querySelector('[data-stage-target="1"]'));assert.equal(c.battleState.lootTarget,1);assert.equal(c.battleState.busy,false);
 a.click(d.querySelectorAll('#enemyUnits .loot-call')[1]);assert.equal(c.battleState.enemies[1].searching,true);
 assert.equal(c.battleState.busy,true);assert.match(d.getElementById('stageStatus').textContent,/Carga/);
});
test('victory returns to the campaign and retreat returns to refuge; callbacks cannot leak to a later battle',()=>{
 for(const exit of ['victory','retreat','restart']){
  const a=session(),c=a.ctx,d=a.document;
  a.click(d.getElementById('itemsToggle'));a.click(d.getElementById('closeStageInventory'));
  c.combatAction('defend');const oldBattle=c.battleState;
  if(exit==='victory'){oldBattle.busy=false;oldBattle.enemies.forEach(e=>e.hp=0);c.beginLootPhase();c.finishLooting();assert.equal(c.state.stats.wins,1);assert.ok(c.pending)}
  else if(exit==='retreat'){c.loseCombat(true);assert.ok(c.state.refuge.active)}
  else c.newGame();
  assert.equal(c.battleState,null);assert.ok(d.getElementById('battle').classList.contains('hidden'));
  assert.equal(d.getElementById('stageLogLines').textContent,'');
  assert.equal([...a.timers.values()].some(t=>t.fn.name==='showNextLog'||t.ms===320),false);
  c.startCombat({title:'Siguiente combate',enemies:['drone'],canFlee:true},{label:'test',_decisionChanges:[]});
  assert.notEqual(c.battleState,oldBattle);assert.equal(c.battleState.busy,false);
  assert.equal(d.querySelectorAll('#enemyUnits .unit').length,1);
  a.click(d.getElementById('itemsToggle'));assert.equal(d.getElementById('itemTray').classList.contains('hidden'),false);
 }
});
test('an entire campaign fight advances animated turns and preserves ammunition accounting',()=>{
 const a=session(),c=a.ctx;
 c.state.party.forEach(p=>{p.hp=500;p.maxHp=500});
 const ammo=()=>c.state.party.reduce((n,p)=>n+['ammo9','ammo556','shell12'].reduce((m,id)=>m+c.bagQty(p,id),0),0),before=ammo();
 let turns=0;
 while(c.battleState?.phase==='combat'&&turns++<100){
  c.combatAction('attack');let callbacks=0;
  while(c.battleState?.busy){assert.ok(++callbacks<200);timer(a,t=>true)}
 }
 assert.ok(turns<100);assert.equal(c.battleState.phase,'loot');assert.equal(before-ammo(),c.state.stats.shots);
 c.finishLooting();assert.equal(c.battleState,null);assert.equal(c.state.stats.wins,1);
});
test('advance drains narration, releases one turn and never chooses the next action',()=>{
 const a=session(),c=a.ctx,d=a.document,button=d.getElementById('stageAdvance');
 c.combatAction('defend');const actor=c.battleState.actor;
 let clicks=0;
 while(c.battleState.busy){assert.ok(++clicks<30);a.click(button)}
 assert.notEqual(c.battleState.actor,actor);
 const next=c.battleState.actor,logs=c.battleState.log.length;
 for(let i=0;i<10;i++)a.click(button);
 assert.equal(c.battleState.actor,next);assert.equal(c.battleState.log.length,logs);
 assert.equal(button.disabled,true);
});
test('Enter advances enemy narration without duplicating enemy attacks',()=>{
 const a=session(),c=a.ctx,d=a.document;
 c.state.party.forEach(p=>{p.hp=500;p.maxHp=500});
 c.battleState.acted=c.state.party.map(()=>true);c.enemyPhase();
 const round=c.battleState.round;let steps=0;
 while(c.battleState.busy){
  assert.ok(++steps<60);
  if(d.getElementById('stageAdvance').disabled)timer(a,t=>!t.interval);
  else{
   const e=new d.defaultView.Event('keydown',{bubbles:true,cancelable:true});
   Object.defineProperty(e,'key',{value:'Enter'});d.dispatchEvent(e);
   assert.ok(e.defaultPrevented);
  }
 }
 assert.equal(c.battleState.round,round+1);
 const actor=c.battleState.actor;
 const e=new d.defaultView.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperty(e,'key',{value:'Enter'});d.dispatchEvent(e);
 assert.equal(c.battleState.actor,actor);assert.equal(c.battleState.busy,false);
});
