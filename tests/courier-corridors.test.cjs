const test=require('node:test'),assert=require('node:assert/strict');
const {setup,finish}=require('./courier-return-fixtures.cjs');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const clone=structuredClone;
function step(E,d,w,id){const pending=E.advance(d,w);assert.ok(E.options(d,pending).some(o=>o.id===id),id);return E.restore(d,E.serialize(E.choose(d,pending,id)));}
function first(E,d,a='confirm',b='windows'){
 let w=E.start(d,E.createWorld(d,{seed:1}),'relevo-01');
 w=step(E,d,w,a);w=step(E,d,w,b);return step(E,d,w,'deliver');
}
// production.json retains the exact earlier mission/script definitions. Use
// those to construct pre-update saves, not new indices with invented payments.
function legacyData(d){const old=clone(d);Object.assign(old.missions,clone(d.legacyMissions));old.corridorScripted=clone(old.scripted);for(const [id,m]of Object.entries(old.legacyJourneys))old.journeys[id]=m;return old;}
function unversioned(w){const old=clone(w);const strip=r=>{if(!r)return;delete r.corridorVersion;strip(r.checkpoint?.snapshot);};strip(old.run);Object.values(old.completed).forEach(strip);return JSON.stringify(old);}

test('all first agreements connect three posts, pay at Plaza and start either successor without an empty return',async()=>{
 const {E,d}=await setup();
 for(const a of ['confirm','return-message'])for(const b of ['windows','pairs']){
  const w=first(E,d,a,b),r=w.run.receipt;
  assert.equal(w.location,'plaza');assert.equal(r.penalty,0);assert.equal(w.paid.length,1);assert.equal(r.corridorVersion,2);
  assert.equal(w.run.minutes,18+(a==='confirm'?4:1)+(b==='windows'?3:5));
  assert.match(r.narration,a==='confirm'?/Elena recibió/:/respuesta pendiente/);
  assert.match(E.communityMemory(w,'plaza').join(' '),b==='windows'?/ventanas/:/acompañantes/);
  for(const id of ['romero-01','morales-01']){assert.equal(E.departurePlan(d,w,id).journey,null);assert.equal(E.start(d,w,id).location,'plaza');}
  assert.deepEqual(E.restore(d,E.serialize(w)),w);assert.throws(()=>E.choose(d,w,'deliver'));assert.throws(()=>E.start(d,w,'relevo-01'));
 }
});
test('a proposal or abandoned agreement cannot become community memory or open later work',async()=>{
 const {E,d}=await setup();let w=E.start(d,E.createWorld(d,{seed:1}),'relevo-01');
 assert.match(E.currentPurpose(d,w),/La Moneda/);w=step(E,d,w,'return-message');assert.match(w.run.lastEncounter.text,/no equivale/);
 w=step(E,d,w,'pairs');assert.match(w.run.lastEncounter.text,/acompañantes/);assert.deepEqual(E.communityMemory(w,'plaza'),[]);
 w=E.abandon(d,w);assert.deepEqual(w.paid,[]);assert.deepEqual(w.progression.known,['relevo-01']);assert.deepEqual(E.communityMemory(w,'uchile'),[]);
});
test('medical choices spend only team supplies and keep treatment, referral and handover distinct on arrival',async()=>{
 const {E,d}=await setup();
 for(const pickup of ['count','witness'])for(const aid of ['treat','signal'])for(const handover of ['copy','escort']){
  let w=E.start(d,first(E,d),'romero-01');assert.deepEqual(w.run.cargo,{});
  w=step(E,d,w,pickup);assert.deepEqual(w.run.cargo,{'medical-case':1});const kits=w.run.supplies.medkit;
  w=step(E,d,w,aid);assert.equal(w.run.supplies.medkit||0,kits-(aid==='treat'?1:0));assert.deepEqual(w.run.cargo,{'medical-case':1});
  w=step(E,d,w,handover);w=step(E,d,w,'deliver');const r=w.run.receipt;
  assert.equal(r.penalty,0);assert.equal(w.location,'republica');assert.match(r.narration,aid==='treat'?/revisión/:/visita pendiente/);
  assert.match(r.narration,handover==='escort'?/vino con ustedes/:/siguiente turno/);
  assert.equal(E.communityMemory(w,'republica').length,1);assert.equal(E.price(d,w,'medkit'),6);assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('the injured guard has a reachable referral when the team has no medkit',async()=>{
 const {E,d}=await setup();let w=step(E,d,E.start(d,first(E,d),'romero-01'),'count');
 for(const c of w.run.party)c.bag=c.bag.filter(x=>x.id!=='medkit');
 w=E.advance(d,E.restore(d,E.serialize(w)));
 assert.equal(E.optionAvailable(w,E.options(d,w).find(o=>o.id==='treat')),false);
 w=E.choose(d,w,'signal');assert.ok(w.run.flags.includes('romero_avisado'));assert.deepEqual(w.run.cargo,{'medical-case':1});
});
test('survey reaches the workshop boundary, keeps breathing room automatic, and preserves evidence flags for Noa',async()=>{
 const {E,d}=await setup();
 for(const observation of ['trace','observe'])for(const passage of ['cart','packs']){
  let w=E.start(d,first(E,d),'morales-01');w=step(E,d,w,observation);
  for(let i=0;i<2;i++){w=E.advance(d,w);assert.equal(E.passageReady(d,w),true);w=E.choose(d,w,'continue');}
  w=step(E,d,w,passage);w=step(E,d,w,'notice');w=step(E,d,w,'continue');w=step(E,d,w,'deliver');
  assert.equal(w.location,'heroes');assert.equal(w.run.receipt.penalty,0);assert.ok(w.progression.visited.includes('parque'));assert.ok(!w.progression.visited.includes('rondizzoni'));
  assert.ok(w.completed['morales-01'].flags.includes(observation==='trace'?'desvio_identificado':'patron_registrado'));
  assert.match(w.run.receipt.narration,passage==='cart'?/peso sin verificar/:/dos mochilas/);
  assert.equal(E.communityMemory(w,'toesca').length,1);
 }
});
test('each old active encounter, failed checkpoint and abandoned position survives the update',async()=>{
 const {E,d}=await setup(),old=legacyData(d);
 for(const id of ['relevo-01','romero-01','morales-01','ana-01']){
  let w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),id),id);w.run.corridorVersion=1;w.run.checkpoint.snapshot.corridorVersion=1;
  w=E.advance(old,w);
  for(const status of ['active','failed','abandoned']){
   const saved=clone(w);saved.run.status=status;
   const loaded=E.restore(d,unversioned(saved));assert.deepEqual(E.route(d,loaded),E.route(old,saved));assert.deepEqual(loaded.run.pending,saved.run.pending);assert.equal(loaded.location,saved.location);assert.equal(loaded.run.minutes,saved.run.minutes);assert.deepEqual(loaded.paid,[]);
   assert.deepEqual(E.restore(d,E.serialize(loaded)),loaded);
   if(status==='failed'){const retry=E.retry(d,loaded);assert.equal(retry.run.corridorVersion,1);assert.equal(E.here(d,retry).id,loaded.run.checkpoint.node);}
   if(status==='active'){
    const done=finish(E,d,loaded);assert.equal(done.run.receipt.gross,old.missions[id].reward.base);assert.equal(done.location,old.routes[old.missions[id].route].nodes.at(-1));assert.equal(done.run.receipt.corridorVersion,1);assert.deepEqual(E.communityMemory(done,done.location),[]);
    const restored=E.restore(d,unversioned(done));assert.equal(restored.credits,done.credits);assert.equal(E.departurePlan(d,restored,id).legs,old.routes[old.missions[id].route].edges.length);
   }
  }
 }
});
test('a saved approach to old Romero still arrives at República and the next job uses its new origin',async()=>{
 const {E,d}=await setup(),old=legacyData(d);let w=E.travelToMission(old,connectedWorld(E,old,{seed:1}),'romero-01');
 w.run.corridorVersion=1;w.run.checkpoint.snapshot.corridorVersion=1;w=E.advance(old,w);
 const loaded=E.restore(d,unversioned(w));assert.deepEqual(loaded.run.pending,w.run.pending);assert.deepEqual(E.route(d,loaded).nodes,['heroes','republica']);
 const done=finish(E,d,loaded);assert.equal(done.location,'republica');assert.deepEqual(done.paid,[]);assert.equal(E.departurePlan(d,done,'romero-01').destination,'plaza');
 assert.throws(()=>E.start(d,done,'romero-01'),/Plaza/);
});
test('revisiting an agreed post exposes its remembered arrangement without another reward',async()=>{
 const {E,d}=await setup();let w=first(E,d,'return-message','pairs');const credits=w.credits;
 w=E.start(d,w,'romero-01');w=step(E,d,w,'count');assert.ok(w.run.log.some(x=>x.includes('acompañantes del paso')));assert.equal(w.credits,credits);
 const before=w.run.log.filter(x=>x.includes('acompañantes del paso')).length;w=E.restore(d,E.serialize(w));w=E.learn(d,w,'rocio','trail');
 assert.equal(w.run.log.filter(x=>x.includes('acompañantes del paso')).length,before);
});

test('families and their belongings reach reception with both means of assistance remembered',async()=>{
 const {E,d}=await setup();
 for(const register of ['verify','contact'])for(const luggage of ['share','strap']){
  let w=finish(E,d,E.start(d,first(E,d),'romero-01'));
  w=finish(E,d,E.travelToMission(d,w,'ana-01'));w=E.start(d,w,'ana-01');
  w=step(E,d,w,register);w=step(E,d,w,luggage);w=step(E,d,w,'deliver');
  assert.equal(w.location,'heroes');assert.equal(w.run.receipt.penalty,0);
  assert.match(w.run.receipt.narration,luggage==='share'?/Está todo/:/correa reparada/);
  assert.match(E.communityMemory(w,'heroes').join(' '),luggage==='share'?/Bruno/:/Tomás/);
  assert.ok(E.missionOpen(d,w,'guzman-01'));assert.ok(E.missionOpen(d,w,'beatriz-01'));
 }
});
