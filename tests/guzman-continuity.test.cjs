const test=require('node:test'),assert=require('node:assert/strict');
const {setup,finish}=require('./courier-return-fixtures.cjs');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
function delivery(E,d,mark='copy-mark',lead='secure-lead'){
 let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'guzman-01'),'guzman-01');
 while(w.run.status==='active'){
  if(!w.run.pending){if(E.here(d,w).rest&&w.run.condition<78&&!w.run.rested.includes(w.run.index)&&w.run.supplies.food&&w.run.supplies.water)w=E.rest(d,w);w=E.advance(d,w);}
  const p=w.run.pending;
  if(p?.combat?.phase==='loot'){w=E.finishLoot(d,w);continue;}
  const os=E.options(d,w).filter(o=>E.optionAvailable(w,o));
  const o=os.find(o=>o.id===(p.id==='guzman-casquillo'?mark:p.id==='guzman-conector'?lead:'__none'))||os.find(o=>['scout','jam-skill','avoid','continue','fire','melee'].includes(o.id))||os[0];
  assert.ok(o);w=E.restore(d,E.serialize(E.choose(d,w,o.id)));
 }
 assert.equal(w.run.status,'completed');return w;
}
test('four Guzman receptions preserve cargo, real choices and the existing reward/effect',async()=>{
 const {E,d}=await setup();
 for(const mark of ['copy-mark','keep-paired'])for(const lead of ['secure-lead','report-lead']){
  const w=delivery(E,d,mark,lead),r=w.completed['guzman-01'];
  assert.equal(r.guzmanVersion,1);assert.equal(r.gross,20);assert.equal(w.location,'plaza');assert.deepEqual(w.run.cargo,{});
  assert.match(r.narration,mark==='copy-mark'?/número en la hoja/:/sin soltar la etiqueta/);
  assert.match(r.narration,lead==='secure-lead'?/volvió a fijar/:/alimentación cortada/);
  assert.equal(E.shelteredPlaza(d,w),true);assert.equal(w.guzmanFollowup.returned,false);
  assert.throws(()=>E.start(d,w,'guzman-01'));assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('Guzman only learns the result after a physical return, without another payment',async()=>{
 const {E,d}=await setup();let w=delivery(E,d),credits=w.credits,receipt=structuredClone(w.completed['guzman-01']);
 assert.match(E.guzmanMemory(w,'leones').join(' '),/todavía no ha escuchado/);
 w=E.visitGuzman(d,w);assert.equal(E.rewardForecast(d,w),null);assert.throws(()=>E.visitGuzman(d,w),/Termina/);
 w=finish(E,d,w);assert.equal(w.location,'leones');assert.equal(w.guzmanFollowup.returned,true);
 assert.match(E.guzmanMemory(w,'leones').join(' '),/soldador/);assert.equal(w.credits,credits);assert.deepEqual(w.completed['guzman-01'],receipt);
 assert.throws(()=>E.visitGuzman(d,w),/ya está/);assert.deepEqual(E.restore(d,E.serialize(w)),w);
});
test('unfinished, abandoned and pre-update contracts do not invent new workshop knowledge',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'guzman-01'),'guzman-01');
 w=E.choose(d,E.advance(d,w),'copy-mark');w=E.abandon(d,w);
 assert.deepEqual(E.guzmanMemory(w,'leones'),[]);assert.throws(()=>E.visitGuzman(d,w),/Primero/);
 const old=structuredClone(d);old.missions['guzman-01']=old.guzmanLegacyMission;
 w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),'guzman-01'),'guzman-01');w=E.advance(old,w);
 const before=structuredClone(w.run.pending);w=E.restore(d,E.serialize(w));assert.deepEqual(w.run.pending,before);assert.equal(E.mission(d,w).briefing,d.guzmanLegacyMission.briefing);
 w=finish(E,d,w);assert.equal(w.completed['guzman-01'].guzmanVersion,0);assert.deepEqual(E.guzmanMemory(w,'leones'),[]);assert.equal(w.guzmanFollowup,undefined);
});
test('retry retains the new version and checkpoint decisions; new worlds have no follow-up',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'guzman-01'),'guzman-01');
 w.run.status='failed';w=E.retry(d,w);assert.equal(w.run.guzmanVersion,1);assert.equal(E.eventFor(d,E.advance(d,w)).id,'guzman-casquillo');
 assert.equal(E.createWorld(d).guzmanFollowup,undefined);
});
