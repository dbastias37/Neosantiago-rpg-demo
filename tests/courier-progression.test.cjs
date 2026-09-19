const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../extensions/mensajeros/production.json')));
async function setup(){const E=await import('../extensions/mensajeros/production.mjs');return {E,d:E.prepare(source)};}
function finish(E,d,w,choice){
 for(let i=0;i<400&&w.run.status==='active';i++){
  if(!w.run.pending){
   if(E.here(d,w).rest&&w.run.condition<78&&!w.run.rested.includes(w.run.index)&&(E.shelteredPlaza(d,w)||w.run.supplies.food&&w.run.supplies.water))w=E.rest(d,w);
   w=E.advance(d,w);
  }
  if(w.run.pending?.combat?.phase==='loot'){w=E.finishLoot(d,w);continue;}
  if(w.run.status!=='active')break;
  const options=E.options(d,w).filter(o=>E.optionAvailable(w,o));
  const o=w.run.pending.combat?(options.find(o=>o.id==='fire')||options.find(o=>o.id==='melee')):options.find(o=>o.id===choice)||options.find(o=>['scout','jam-skill','avoid','continue','assist'].includes(o.id))||options[0];
  assert.ok(o);w=E.restore(d,E.serialize(E.choose(d,w,o.id)));
 }
 assert.equal(w.run.status,'completed',w.run.log.join('\n'));return w;
}
function deliver(E,d,w,id,choice){if(!E.atMissionOrigin(d,w,id))w=finish(E,d,E.travelToMission(d,w,id));return finish(E,d,E.start(d,w,id),choice);}
test('fresh team sees only the three-post corridor, with distant missions enforced in the engine',async()=>{
 const {E,d}=await setup(),w=E.createWorld(d,{seed:1});assert.deepEqual(E.knownMissions(d,w).map(m=>m.id),['relevo-01']);assert.deepEqual(new Set(E.knownNodes(d,w)),new Set(['heroes','moneda','uchile','plaza']));
 for(const id of Object.keys(d.missions).filter(id=>id!=='relevo-01'))assert.throws(()=>E.start(d,w,id),/contacto/);
 assert.equal(d.routes[d.missions['relevo-01'].route].edges.length,3);assert.deepEqual(E.restore(d,E.serialize(w)),w);
});
test('both first choices pay once, remember the response and introduce the same nearby jobs without creating their receipts',async()=>{
 const {E,d}=await setup();for(const choice of ['confirm','return-message']){
  const w=deliver(E,d,E.createWorld(d,{seed:1}),'relevo-01',choice);assert.equal(w.run.combats,0);assert.equal(w.location,'plaza');assert.equal(w.credits,18);assert.deepEqual(new Set(w.run.receipt.opened),new Set(['romero-01','morales-01']));assert.deepEqual(Object.keys(w.completed),['relevo-01']);assert.ok(w.run.receipt.narration.includes(choice==='confirm'?'Elena recibió':'respuesta pendiente'));assert.throws(()=>E.start(d,w,'relevo-01'),/entregado/);assert.deepEqual(new Set(w.progression.visited),new Set(['heroes','moneda','uchile','plaza']));assert.equal(w.run.minutes,choice==='confirm'?25:22);
 }
});
test('accepting, abandoning or retrying the first job never opens contacts',async()=>{
 const {E,d}=await setup();let w=E.start(d,E.createWorld(d,{seed:1}),'relevo-01');w=E.choose(d,E.advance(d,w),'confirm');assert.equal(w.progression.known.length,1);w=E.abandon(d,w);assert.equal(w.progression.known.length,1);w=finish(E,d,E.travelHeroes(d,w));w=E.start(d,w,'relevo-01');w.run.status='failed';w.run.condition=0;w=E.retry(d,w);assert.deepEqual(w.progression.known,['relevo-01']);assert.deepEqual(w.paid,[]);
});
test('either nearby delivery opens Ana: no mandatory completion of both branches',async()=>{
 const {E,d}=await setup();for(const id of ['romero-01','morales-01']){
  let w=deliver(E,d,E.createWorld(d,{seed:1}),'relevo-01');w=deliver(E,d,w,id);assert.ok(E.missionOpen(d,w,'ana-01'));assert.ok(!E.missionOpen(d,w,'guzman-01'));assert.equal(w.paid.length,2);assert.deepEqual(w.run.receipt.opened,['ana-01']);
 }
});
test('an uninterrupted new-game chain reaches the north, workshops, relay and rescue without deadlocks',async()=>{
 const {E,d}=await setup();for(const seed of [1,4,18,2130]){let w=E.createWorld(d,{seed});
 for(const id of ['relevo-01','romero-01','ana-01','beatriz-01','guzman-01','jimenez-01','adasme-01','morales-01']){
  assert.ok(E.missionOpen(d,w,id),id);w=deliver(E,d,w,id);assert.equal(w.paid.filter(x=>x===id).length,1);
 }
 assert.equal(w.paid.length,8);assert.match(E.nextLead(d,w),/conversación de regreso/);assert.ok(w.crew.every(c=>c.hp>0));}
});
test('legacy active, failed and abandoned runs retain route, encounter and retry access without invented payments',async()=>{
 const {E,d}=await setup();for(const status of ['active','failed','abandoned']){
  let w=E.advance(d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'adasme-01'),'adasme-01'));w.run.status=status;delete w.progression;
  const before=structuredClone(w),restored=E.restore(d,JSON.stringify(w));assert.deepEqual(restored.run,before.run);assert.deepEqual(restored.paid,[]);assert.equal(restored.credits,before.credits);assert.ok(E.missionOpen(d,restored,'adasme-01'));assert.ok(!E.missionOpen(d,restored,'jimenez-01'));assert.deepEqual(w,before);
  if(status==='failed')assert.equal(E.retry(d,restored).run.status,'active');
 }
});
test('legacy final receipts open their next contact once and keep prior rewards',async()=>{
 const {E,d}=await setup();let w=deliver(E,d,connectedWorld(E,d,{seed:1}),'guzman-01');delete w.progression;const restored=E.restore(d,JSON.stringify(w));assert.ok(E.missionOpen(d,restored,'jimenez-01'));assert.equal(restored.credits,w.credits);assert.deepEqual(restored.completed,w.completed);assert.deepEqual(E.restore(d,E.serialize(restored)),restored);
});
test('unopened contacts cannot leak via known nodes; old return journeys remain navigable',async()=>{
 const {E,d}=await setup();let w=E.createWorld(d,{seed:1});assert.ok(!E.knownNodes(d,w).includes('vicuna'));w=connectedWorld(E,d,{seed:1});w.location='vicuna';w=E.travelHeroes(d,w);delete w.progression;w=E.restore(d,JSON.stringify(w));assert.ok(E.knownNodes(d,w).includes('vicuna'));assert.equal(E.route(d,w).nodes.at(-1),'heroes');assert.ok(!E.missionOpen(d,w,'adasme-01'));
});
test('only restored Plaza supplies rest, at the normal duration and once per stop, without changing bags',async()=>{
 const {E,d}=await setup();let done=deliver(E,d,connectedWorld(E,d,{seed:1}),'guzman-01');let w=E.start(d,done,'ana-01');w.run.condition=60;w.run.party.forEach(c=>{c.hp=10;c.bag=c.bag.filter(i=>!['food','water'].includes(i.id))});w=E.restore(d,E.serialize(w));
 assert.equal(E.shelteredPlaza(d,w),true);const before=structuredClone(w),next=E.rest(d,w);assert.equal(next.run.minutes,before.run.minutes+10);assert.equal(next.run.condition,Math.min(100,60+d.rules.rest_heal));assert.deepEqual(next.run.party.map(c=>c.bag),before.run.party.map(c=>c.bag));assert.ok(next.run.party.every(c=>c.hp===22));assert.ok(next.run.log.some(line=>line.includes('la posta pone agua')));assert.ok(!next.run.log.some(line=>line.includes('−1 agua')));assert.throws(()=>E.rest(d,next),/Ya descansaste/);assert.deepEqual(E.restore(d,E.serialize(next)),next);
 const without=structuredClone(w);without.effects=[];assert.throws(()=>E.rest(d,without),/Falta/);without.effects=['guzman-01'];without.run.index=1;without.location='uchile';assert.equal(E.shelteredPlaza(d,without),false);assert.throws(()=>E.rest(d,without),/Falta/);
});
test('returning to repaired Plaza acknowledges the delivery and keeps the acknowledgement after reload',async()=>{
 const {E,d}=await setup();let w=deliver(E,d,connectedWorld(E,d,{seed:1}),'guzman-01');w=finish(E,d,E.travelToMission(d,w,'beatriz-01'));w=E.start(d,w,'beatriz-01');w=E.advance(d,w);assert.equal(w.run.pending.to,'plaza');const options=E.options(d,w).filter(o=>E.optionAvailable(w,o));let o=options.find(o=>['continue','scout','jam-skill','avoid'].includes(o.id))||options[0];assert.ok(o);w=E.choose(d,w,o.id);assert.equal(E.here(d,w).id,'plaza');assert.equal(w.run.log.filter(x=>x.includes('La torreta de Plaza')).length,1);w=E.restore(d,E.serialize(w));assert.equal(w.run.log.filter(x=>x.includes('La torreta de Plaza')).length,1);
});
test('reset removes discoveries and infrastructure; malformed discovery saves are rejected',async()=>{
 const {E,d}=await setup(),w=E.createWorld(d,{seed:1});for(const patch of [{known:['missing']},{visited:['missing']},{version:99},{known:['relevo-01','relevo-01']}]){const bad=structuredClone(w);Object.assign(bad.progression,patch);assert.throws(()=>E.restore(d,JSON.stringify(bad)),/Progreso/);}assert.deepEqual(w.effects,[]);assert.deepEqual(w.progression.known,['relevo-01']);
});
