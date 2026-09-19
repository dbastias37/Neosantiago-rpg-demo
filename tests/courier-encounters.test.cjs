const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {setup,finish}=require('./courier-return-fixtures.cjs'),{connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
test('Libertadores–Vicuña preserves every physical leg with varied local scenes, breathers and one compulsory blockade',async()=>{
 const {E,d}=await setup();for(const seed of [1,4,18,2130]){
  let w=connectedWorld(E,d,{seed});w.location='libertadores';const start=E.travelToMission(d,w,'jimenez-01'),rt=E.route(d,start);w=finish(E,d,start);
  assert.equal(w.location,'vicuna');assert.equal(w.run.index,27);assert.deepEqual(w.run.history.map(e=>e.node),rt.nodes.slice(1));assert.equal(w.paid.length,0);assert.equal(w.credits,0);
  const local=w.run.history.filter(e=>d.events.some(x=>x.id===e.id&&x.regional&&!x.passage));assert.ok(local.length>=9);assert.equal(new Set(local.map(x=>x.id)).size,local.length);
  assert.deepEqual(new Set(local.map(e=>d.events.find(x=>x.id===e.id).sector)),new Set(['norte','centro','sur','enlace','oriente']));
  assert.ok(w.run.history.filter(e=>e.category==='quiet').length>=10);assert.equal(w.encounters.resolved['sur-bloqueo'],'cleared');assert.ok(w.run.combats>=1);assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('a wired blockade rejects every bypass, allows genuine retreat, and reload cannot change the draw',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:1});w.location='rondizzoni';w=E.advance(d,E.travelToMission(d,w,'guzman-01'));
 assert.equal(w.run.pending.id,'sur-bloqueo');assert.match(E.routeWarning(d,w,E.route(d,w)),/habrá que combatir/);
 assert.deepEqual(E.options(d,w).map(o=>o.id),['fight','withdraw']);for(const id of ['scout','jam-skill','echo-path','decoy','avoid'])assert.throws(()=>E.choose(d,w,id),/disponible/);
 const index=w.run.index;w=E.choose(d,w,'withdraw');assert.equal(w.run.index,index);assert.equal(w.location,'rondizzoni');assert.ok(!w.encounters.resolved['sur-bloqueo']);
 w=E.advance(d,E.restore(d,E.serialize(w)));assert.equal(w.run.pending.id,'sur-bloqueo');w=E.choose(d,w,'fight');w=E.choose(d,w,'guided-retreat');assert.equal(w.run.index,index);assert.equal(w.run.combats,1);
 w=E.advance(d,w);assert.equal(w.run.pending.id,'sur-bloqueo');assert.deepEqual(E.restore(d,E.serialize(w)).run.pending,w.run.pending);
});
test('winning opens the blockade permanently, including checkpoint rewind, without replaying combat loot',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:4});w.location='rondizzoni';w=E.advance(d,E.travelToMission(d,w,'guzman-01'));w=E.choose(d,w,'fight');
 while(w.run.pending.combat.phase==='combat'){const opts=E.options(d,w).filter(o=>E.optionAvailable(w,o));w=E.choose(d,w,(opts.find(o=>o.id==='fire')||opts.find(o=>o.id==='melee')).id);}
 assert.ok(!w.encounters.resolved['sur-bloqueo']);w=E.finishLoot(d,w);assert.equal(w.encounters.resolved['sur-bloqueo'],'cleared');assert.match(w.run.lastEncounter.text,/corredor queda abierto/);assert.equal(E.routeWarning(d,w,E.route(d,w)),'');
 w.run.status='failed';w=E.retry(d,w);assert.equal(w.encounters.resolved['sur-bloqueo'],'cleared');w=E.advance(d,w);assert.equal(E.passageReady(d,w),true);assert.equal(w.run.combats,1);assert.ok(!E.options(d,w).some(o=>o.combat));
});
test('regional decisions have distinct persistent replies and later scenes acknowledge what was actually done',async()=>{
 const {E,d}=await setup();for(const decision of ['revisar','anotar']){
  let w=connectedWorld(E,d,{seed:1});w.location='libertadores';w=E.advance(d,E.travelHeroes(d,w));assert.equal(w.run.pending.id,'norte-turnos');w=E.choose(d,w,decision);
  assert.equal(w.encounters.resolved['norte-turnos'],decision);const reply=w.run.lastEncounter.text;w=E.restore(d,E.serialize(w));assert.equal(w.run.lastEncounter.text,reply);
  w=E.abandon(d,w);w=finish(E,d,E.travelHeroes(d,w));w=E.travelToMission(d,w,'beatriz-01');
  while(w.run.status==='active'){if(!w.run.pending)w=E.advance(d,w);if(w.run.pending.id==='plaza-turnos')break;
   const opts=E.options(d,w).filter(o=>E.optionAvailable(w,o));w=E.choose(d,w,(opts.find(o=>['continue','avoid','scout'].includes(o.id))||opts[0]).id);
  }
  assert.equal(w.run.pending.id,'plaza-turnos');assert.match(E.encounterText(d,w),decision==='revisar'?/corrección que hizo/:/no comprobaron/);
 }
});
test('legacy runs and already pending encounters keep their original rules and charge no extra leg on restore',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'adasme-01'),'adasme-01');delete w.encounters;delete w.run.directorVersion;delete w.run.checkpoint.snapshot.directorVersion;
 const restored=E.restore(d,E.serialize(w));assert.equal(restored.run.directorVersion,undefined);w=E.advance(d,restored);const pending=structuredClone(w.run.pending),minutes=w.run.minutes;
 assert.deepEqual(E.restore(d,E.serialize(w)).run.pending,pending);assert.equal(E.restore(d,E.serialize(w)).run.minutes,minutes);assert.equal(E.passageReady(d,w),false);
 for(const patch of [{version:9,resolved:{}},{version:1,resolved:{'sur-bloqueo':'skipped'}},{version:1,resolved:{missing:'x'}}]){const bad=structuredClone(w);bad.encounters=patch;assert.throws(()=>E.restore(d,E.serialize(bad)),/Memoria/);}
});
test('all regional scenes offer a resource-free action, valid artwork and no mandatory fight during the extraction',async()=>{
 const {E,d}=await setup();for(const e of d.events.filter(e=>e.regional)){
  assert.ok(fs.existsSync(path.resolve(__dirname,'../extensions/mensajeros',e.image)),e.id);assert.ok(e.choices.some(o=>!o.cost));
 }
 const w=finish(E,d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:2130}),'adasme-01'),'adasme-01'));
 assert.ok(w.run.history.some(e=>e.category==='rescue'));assert.ok(!w.run.history.some(e=>e.id==='sur-bloqueo'));assert.equal(w.run.combats,0);assert.ok(w.run.receipt.gross>=d.missions['adasme-01'].reward.base);
});
