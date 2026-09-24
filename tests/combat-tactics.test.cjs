const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');
function encounter(roster=['merodeador','agent']){
 const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.party.forEach(p=>{p.hunger=100;p.hp=p.maxHp});
 c.startCombat({title:'Ensayo de combate',enemies:roster,canFlee:true},{label:'ensayo',_decisionChanges:[]});
 return c;
}
test('one collectible belongs to one body, costs no bag space and survives a compatible save',()=>{
 const c=encounter(['merodeador','drone','agent']);
 const loot=c.battleState.enemies.flatMap(e=>c.generateLoot(e));
 const drops=loot.filter(x=>x.collectible);assert.equal(drops.length,1);
 const free=c.bagFree(c.state.party[0]);assert.equal(c.takeCombatCollectible(drops[0]),true);
 assert.equal(c.bagFree(c.state.party[0]),free);assert.ok(c.collectionGallery().includes('collection-card found'));
 c.save();const restored=boot(new Map([[c.KEY,c.localStorage.getItem(c.KEY)]]));assert.equal(restored.ctx.load(),true);
 assert.deepEqual([...restored.ctx.state.collection],[drops[0].id]);
});
test('disarm removes an actual weapon, guarantees its loot and has risk on failure',()=>{
 const c=encounter(['merodeador']);const e=c.battleState.enemies[0],p=c.state.party[1];
 p.skills.push('elias_disarm');c.battleState.actor=1;e.hp=300;e.maxHp=300;c.d20=()=>20;
 const weapon=e.weapon;c.combatAction('tactic:elias_disarm');assert.equal(e.weapon,null);assert.equal(e.droppedWeapon,weapon);
 assert.ok(c.generateLoot(e).some(drop=>drop.id===weapon));assert.equal(c.battleState.tacticCooldown.elias,3);
 const second=encounter(['merodeador']);second.state.party[1].skills.push('elias_disarm');second.battleState.actor=1;
 second.d20=()=>1;second.random=()=>0;const hp=second.state.party[1].hp;
 second.combatAction('tactic:elias_disarm');assert.ok(second.state.party[1].hp<hp);assert.ok(second.battleState.enemies[0].weapon);
});
test('full synergy spends one turn for exactly three attempted attacks and then cools down',()=>{
 const c=encounter(['agent']);const e=c.battleState.enemies[0];e.hp=e.maxHp=500;e.def=0;c.d20=()=>15;c.rand=(a)=>a;
 c.battleState.synergy=100;c.combatAction('synergy');
 assert.equal(c.state.stats.attacks,3);assert.equal(c.battleState.synergy,0);
 assert.equal(c.battleState.synergyReadyRound,4);assert.equal(c.battleState.actor,1);
});
test('bleeding depends on weapon, ticks for enemies and has stronger shotgun wounds',()=>{
 const c=encounter(['agent']);const e=c.battleState.enemies[0];e.hp=100;e.maxHp=100;c.random=()=>0;
 c.applyCombatBleeding(e,c.gear('crowbar'),12,false);assert.equal(e.bleed,undefined);
 c.applyCombatBleeding(e,c.gear('shotgun12'),12,false);assert.equal(e.bleed,2);assert.equal(e.bleedDamage,3);
 assert.equal(c.tickEnemyBleeding(e),false);assert.equal(e.hp,97);assert.equal(e.bleed,1);
});
test('the loot modal takes a collectible from a full bag and the gallery reveals its story',()=>{
 const {document,window}=parseHTML(fs.readFileSync(root+'/neosantiago-demo.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
 const c=boot(new Map(),{document}).ctx;c.gameSessionActive=true;c.startCombat({title:'Recolección',enemies:['merodeador']},{label:'ensayo',_decisionChanges:[]});
 const p=c.state.party[0],e=c.battleState.enemies[0];p.bag.push({id:'scrap',qty:c.bagFree(p)});e.hp=0;c.beginLootPhase();c.battleState.looter=0;e.looted=true;
 e.loot=[{id:'metro_ticket',qty:1,status:'pending',collectible:true}];c.renderLootModal(0);
 assert.match(document.getElementById('lootItems').textContent,/Boleto del Metro/);
 assert.equal(document.getElementById('takeAllLoot').classList.contains('hidden'),false);
 c.takeAllLoot();assert.equal(e.loot[0].status,'taken');assert.equal(c.bagFree(p),0);
 c.openPanel('collection');assert.match(document.getElementById('drawerContent').textContent,/Nos vemos en República/);
});
