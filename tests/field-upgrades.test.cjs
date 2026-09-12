const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
function core(enemies=['drone','drone','merodeador']){const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.party.forEach(p=>{p.hp=p.maxHp=500;p.hunger=100});c.startCombat({title:'Prueba',enemies,canFlee:true},{label:'test',_decisionChanges:[]});c.battleState.enemies.forEach(e=>{e.hp=e.maxHp=500;e.def=0;e.armor=0});c.d20=()=>15;c.rand=(a,b)=>a;return a}
function equip(c,id,owner='sara'){c.fieldStore().selected.push({id,owner})}
function ui(storage=new Map()){
 const {document,window}=parseHTML(fs.readFileSync(root+'/neosantiago-demo.html','utf8'));
 Object.defineProperty(document,'activeElement',{configurable:true,writable:true,value:null});window.HTMLElement.prototype.focus=function(){document.activeElement=this};window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
 const a=boot(storage,{document}),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;document.querySelectorAll('.overlay,.title-screen,.drawer').forEach(n=>n.classList.add('hidden'));
 return Object.assign(a,{document,click(n){assert.ok(n);n.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}))},key(key){const e=new window.Event('keydown',{bubbles:true,cancelable:true});Object.defineProperty(e,'key',{value:key});document.dispatchEvent(e);return e}})
}
function runTimer(a,id){const t=a.timers.get(id);assert.ok(t);a.timers.delete(id);t.fn()}

test('four milestone offers have no duplicates, persist across reload and do not consume narrative RNG',()=>{
 const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;
 c.fieldStore().seed=1234;const storySeed=c.state.seed;
 const offers=[];
 for(const index of [3,9,16,22]){c.state.index=index;const offer=c.fieldPrepareOffer();assert.equal(offer.ids.length,3);assert.equal(new Set(offer.ids).size,3);offers.push(plain(offer.ids));assert.equal(c.state.seed,storySeed);const saved=plain(c.fieldStore());assert.equal(c.load(),true);assert.deepEqual(plain(c.fieldStore()),saved);const id=c.fieldStore().offer.ids[0],owner=c.fieldEligible(c.fieldById[id])[0].id;assert.equal(c.fieldSelect(id,owner),true);assert.equal(c.fieldSelect(id,owner),false)}
 assert.equal(c.fieldDue(),false);assert.equal(new Set(c.fieldStore().selected.map(x=>x.id)).size,4);assert.equal(c.fieldPrepareOffer(),null);
 const b=boot().ctx;b.state.index=3;b.fieldStore().seed=99999;assert.notDeepEqual(plain(b.fieldPrepareOffer().ids),offers[0]);
});
test('a victory unlocks the first upgrade early; invalid and legacy saves are normalized',()=>{
 const c=boot().ctx;c.gameSessionActive=true;c.state.stats.wins=1;assert.ok(c.fieldPrepareOffer());c.state.fieldUpgrades={selected:[{id:'arc',owner:'sara'},{id:'plate',owner:'sara'},{id:'plate',owner:'noa'},{id:'bad',owner:'sara'}],offer:{tier:0,ids:['bad']},stats:{healed:-10}};c.fieldNormalize();assert.deepEqual(plain(c.fieldStore().selected),[{id:'plate',owner:'sara'}]);assert.equal(c.fieldStore().offer,null);assert.equal(c.fieldStore().stats.healed,0);delete c.state.fieldUpgrades;c.save();assert.equal(c.load(),true);assert.equal(c.fieldStore().selected.length,0);
});
test('triple attack spends ammunition per shot, cannot repeat and resets next combat',()=>{
 const c=core().ctx;equip(c,'triple');const p=c.state.party[0],ammo=c.bagQty(p,'ammo9'),hp=c.battleState.enemies[0].hp;
 assert.equal(c.fieldActivate('triple'),true);assert.equal(c.bagQty(p,'ammo9'),ammo-3);assert.equal(c.state.stats.shots,3);assert.equal(c.state.stats.attacks,3);assert.ok(c.battleState.enemies[0].hp<hp);assert.ok(c.fieldStore().stats.bonusDamage>0);
 c.battleState.actor=0;c.battleState.busy=false;assert.equal(c.fieldActivate('triple'),false);
 c.startCombat({title:'Otra',enemies:['drone']},{label:'test',_decisionChanges:[]});assert.equal(c.fieldUsed(p,'triple'),false);
});
test('triple stops at death, insufficient ammo and busy state never spend or advance',()=>{
 const c=core().ctx;equip(c,'triple');const p=c.state.party[0];c.battleState.enemies[0].hp=1;const ammo=c.bagQty(p,'ammo9');c.fieldActivate('triple');assert.equal(c.bagQty(p,'ammo9'),ammo-1);assert.equal(c.state.stats.enemies,1);
 const d=core().ctx;equip(d,'triple');d.state.party[0].bag=d.state.party[0].bag.filter(x=>x.id!=='ammo9');const snapshot=JSON.stringify(d.state);assert.equal(d.fieldActivate('triple'),false);assert.equal(JSON.stringify(d.state),snapshot);d.battleState.busy=true;assert.equal(d.fieldActivate('triple'),false);
});
test('sweep hits distinct living enemies only, including selected priority and independent misses',()=>{
 const c=core().ctx;equip(c,'sweep');c.battleState.target=2;const rolls=[15,1,15];c.battleState.enemies.forEach(e=>e.def=12);c.d20=()=>rolls.shift();c.fieldActivate('sweep');assert.ok(c.battleState.enemies[2].hp<500);assert.equal(c.battleState.enemies[0].hp,500);assert.ok(c.battleState.enemies[1].hp<500);assert.equal(c.state.stats.shots,3);assert.equal(c.state.stats.hits,2);assert.equal(c.state.stats.misses,1);
 const d=core(['drone']).ctx;equip(d,'sweep');assert.equal(d.fieldActivate('sweep'),false);
});
test('calibrated 19 critical never bypasses defense; opening is consumed even on a miss',()=>{
 const c=core().ctx;equip(c,'sight');equip(c,'opener');c.d20=()=>19;c.battleState.enemies[0].def=999;c.combatAction('attack');assert.equal(c.state.stats.criticals,0);assert.equal(c.fieldCombat().first.sara,true);
 c.battleState.actor=0;c.battleState.busy=false;c.battleState.enemies[0].def=0;c.combatAction('attack');assert.equal(c.state.stats.criticals,1);assert.equal(c.fieldStore().stats.activations,2);
});
test('breach requires a different ally, is consumed once and secondary arcs do not proc',()=>{
 const c=core().ctx;equip(c,'breach');equip(c,'cover','elias');const e=c.battleState.enemies[0];c.strike(e,20,'test',0,true);assert.equal(e.fieldBreach,'sara');c.strike(e,20,'test',0,false);assert.equal(e.fieldBreach,'sara');const hp=e.hp;c.strike(e,20,'test',1,false);assert.equal(hp-e.hp,25);assert.equal(e.fieldBreach,null);assert.ok(e.fieldSuppressed);delete e.fieldSuppressed;c.fieldStrike(e,20,'secondary',1,false,{secondary:true});assert.equal(e.fieldSuppressed,undefined);
});
test('knife fallback improves only an out-of-ammo normal attack',()=>{
 const a=core().ctx,b=core().ctx;equip(a,'knife');a.state.party[0].bag=[];b.state.party[0].bag=[];a.combatAction('attack');b.combatAction('attack');assert.ok(a.state.stats.damageDealt>b.state.stats.damageDealt);assert.equal(a.state.stats.shots,0);assert.equal(a.fieldStore().stats.activations,1);
});
test('capacitor works without a battery and arc reaches exactly one other machine without stun',()=>{
 const c=core().ctx;equip(c,'capacitor','elias');equip(c,'arc','elias');c.battleState.actor=1;c.state.party[1].bag=[];c.combatAction('skill');assert.equal(c.battleState.enemies[0].stun,1);assert.ok(c.battleState.enemies[1].hp<500);assert.equal(c.battleState.enemies[1].stun,0);assert.equal(c.battleState.enemies[2].hp,500);assert.equal(c.fieldStore().stats.batteries,1);assert.equal(c.bagQty(c.state.party[1],'battery'),0);assert.equal(c.state.stats.itemsUsed.battery,undefined);
});
test('EMP still spends a carried battery without capacitor and does not chain without arc',()=>{
 const c=core().ctx;c.battleState.actor=1;const n=c.bagQty(c.state.party[1],'battery');c.combatAction('skill');assert.equal(c.bagQty(c.state.party[1],'battery'),n-1);assert.equal(c.state.stats.itemsUsed.battery,1);assert.equal(c.battleState.enemies[1].hp,500);
});
test('plate and pulse combine once, do not spend on zero damage, and track actual HP saved',()=>{
 const c=core().ctx,p=c.state.party[0];equip(c,'plate');c.fieldCombat().pulse.sara=true;assert.equal(c.fieldIncoming(p,0),0);assert.equal(c.fieldUsed(p,'plate'),false);assert.equal(c.fieldIncoming(p,20),7);assert.equal(c.fieldStore().stats.prevented,13);assert.equal(c.fieldIncoming(p,20),20);
});
test('Sara shares bounded healing and protects the primary patient only once',()=>{
 const c=core().ctx;equip(c,'pulse');equip(c,'shared');c.state.party[1].hp=100;c.state.party[2].hp=498;c.combatAction('skill');assert.equal(c.state.party[2].hp,500);assert.equal(c.fieldStore().stats.healed,2);assert.ok(c.fieldCombat().pulse.elias);assert.equal(c.fieldCombat().pulse.noa,undefined);assert.equal(c.fieldStore().stats.activations,2);
});
test('suppression applies to the next actual enemy attack, not an EMP-stunned turn',()=>{
 const a=core(['drone']),c=a.ctx,e=c.battleState.enemies[0];e.fieldSuppressed=true;e.stun=1;c.enemyPhase();let timer=[...a.timers.entries()].find(([,t])=>t.ms===450);runTimer(a,timer[0]);assert.ok(e.fieldSuppressed);assert.equal(e.stun,0);
 c.battleState.busy=false;e.accuracy=0;c.d20=()=>1;c.enemyPhase();timer=[...a.timers.entries()].find(([,t])=>t.ms===450);runTimer(a,timer[0]);assert.equal(e.fieldSuppressed,undefined);
});
test('cards support detail/back, owner selection and single confirmation without narrative shortcuts',()=>{
 const a=ui(),c=a.ctx,d=a.document;c.state.index=3;assert.equal(c.fieldMaybeOffer(),true);assert.equal(d.querySelectorAll('.field-card').length,3);const id=c.fieldStore().offer.ids[0];a.click(d.querySelector('[data-field-detail="'+id+'"]'));assert.equal(c.fieldDetailId,id);assert.equal(c.fieldStore().selected.length,0);a.key('Escape');assert.equal(c.fieldDetailId,null);assert.equal(c.fieldVisible(),true);const index=c.state.index;a.key('1');assert.equal(c.state.index,index);const select=d.querySelector('[data-field-owner="'+id+'"]');const owner=select.querySelector('option').value;Object.defineProperty(select,'value',{value:owner,configurable:true});a.click(d.querySelector('[data-field-choose="'+id+'"]'));assert.equal(c.fieldStore().selected.length,1);assert.equal(c.fieldVisible(),false);c.fieldOpen('owned');assert.equal(d.querySelectorAll('.field-card').length,1);assert.match(d.getElementById('fieldCards').textContent,/Equipada/);c.fieldBack();assert.equal(c.fieldVisible(),false);
});
test('offers wait for safe scenes, resume unchanged, pause inhibitor and defer restore hack',()=>{
 const a=ui(),c=a.ctx,d=a.document;c.state.index=3;c.pending={};assert.equal(c.fieldMaybeOffer(),false);c.pending=null;c.encounterSaveLocked=true;assert.equal(c.fieldMaybeOffer(),false);c.encounterSaveLocked=false;d.getElementById('crateModal').classList.remove('hidden');assert.equal(c.fieldMaybeOffer(),false);d.getElementById('crateModal').classList.add('hidden');assert.equal(c.fieldMaybeOffer(),true);const ids=plain(c.fieldStore().offer.ids);c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=10000;assert.equal(c.signalPauseActive(),true);c.openSignalHack('restore');assert.equal(c.fieldDeferredSignal,'restore');assert.ok(d.getElementById('signalModal').classList.contains('hidden'));c.save();const b=ui(a.storage);assert.equal(b.ctx.load(),true);assert.deepEqual(plain(b.ctx.fieldStore().offer.ids),ids);assert.equal(b.ctx.fieldMaybeOffer(),true);
});
test('skill menu preserves original ability and gives independent use counts to upgrades',()=>{
 const a=ui(),c=a.ctx,d=a.document;equip(c,'triple');c.startCombat({title:'Prueba',enemies:['drone','drone']},{label:'test',_decisionChanges:[]});a.click(d.querySelector('[data-action="skill"]'));assert.equal(c.fieldSkillTray.classList.contains('hidden'),false);assert.ok(d.querySelector('[data-field-base]'));assert.ok(d.querySelector('[data-field-active="triple"]'));c.battleState.enemies[0].hp=500;c.d20=()=>15;a.click(d.querySelector('[data-field-active="triple"]'));assert.equal(c.fieldUsed(c.state.party[0],'triple'),true);assert.equal(c.battleState.skillUsed[0],undefined);assert.equal(c.fieldSkillTray.classList.contains('hidden'),true);
});
test('reset removes pending UI and a new run clears upgrades; summary includes their effects',()=>{
 const a=ui(),c=a.ctx;c.state.index=3;c.fieldMaybeOffer();equip(c,'plate');const report=c.buildRunReport();assert.ok(report.exploration.some(row=>row[0]==='Mejoras equipadas'));assert.match(c.fieldSummaryHTML(),/Placa reactiva/);c.newGame();assert.equal(c.fieldVisible(),false);assert.equal(c.fieldStore().selected.length,0);assert.equal(c.fieldStore().offer,null);assert.equal(c.fieldDetailId,null);
});
