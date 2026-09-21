const test=require('node:test'),assert=require('node:assert/strict');
const {setup,finish}=require('./courier-return-fixtures.cjs');
const {connectedWorld,atOrigin,solveGate}=require('./courier-fixtures.cjs');
function delivery(E,d,mark='copy-times',lead='shield'){
 let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'jimenez-01'),'jimenez-01');
 while(w.run.status==='active'){
  if(!w.run.pending){if(E.here(d,w).rest&&w.run.condition<78&&!w.run.rested.includes(w.run.index)&&w.run.supplies.food&&w.run.supplies.water)w=E.rest(d,w);w=E.advance(d,w);}
  const p=w.run.pending;
  if(p?.combat?.phase==='loot'){w=E.finishLoot(d,w);continue;}
  const os=E.options(d,w).filter(o=>E.optionAvailable(w,o));
  const o=os.find(o=>o.id===(p.id==='jimenez-relevo'?mark:p.id==='jimenez-prueba'?lead:'__none'))||os.find(o=>['scout','jam-skill','avoid','continue','fire','melee'].includes(o.id))||os[0];
  assert.ok(o);w=E.choose(d,w,o.id);w=solveGate(E,d,w);w=E.restore(d,E.serialize(w));
 }
 assert.equal(w.run.status,'completed');return w;
}
test('four Jimenez receptions preserve cargo, real choices and the existing reward/effect',async()=>{
 const {E,d}=await setup();
 for(const mark of ['copy-times','mark-gap'])for(const lead of ['shield','passive']){
  const w=delivery(E,d,mark,lead),r=w.completed['jimenez-01'];
  assert.equal(r.jimenezVersion,1);assert.equal(r.gross,20);assert.equal(w.location,'leones');assert.deepEqual(w.run.cargo,{});
  assert.match(r.narration,mark==='copy-times'?/dos horas junto/:/horas quedaron pendientes/);
  assert.match(r.narration,lead==='shield'?/devolución de los dos pulsos/:/cortes que anotó/);
  assert.ok(w.effects.includes("jimenez-01"));assert.equal(w.jimenezFollowup.returned,false);
  assert.throws(()=>E.start(d,w,'jimenez-01'));assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('Jimenez only learns the result after a physical return, without another payment',async()=>{
 const {E,d}=await setup();let w=delivery(E,d),credits=w.credits,receipt=structuredClone(w.completed['jimenez-01']);
 assert.match(E.jimenezMemory(w,'vicuna').join(' '),/aún no lo ha recibido/);
 w=E.visitJimenez(d,w);assert.equal(E.rewardForecast(d,w),null);assert.throws(()=>E.visitJimenez(d,w),/Termina/);
 w=finish(E,d,w);assert.equal(w.location,'vicuna');assert.equal(w.jimenezFollowup.returned,true);
 assert.match(E.jimenezMemory(w,'vicuna').join(' '),/reconoce las dos anotaciones/);assert.equal(w.credits,credits);assert.deepEqual(w.completed['jimenez-01'],receipt);
 assert.throws(()=>E.visitJimenez(d,w),/ya está/);assert.deepEqual(E.restore(d,E.serialize(w)),w);
});
test('unfinished, abandoned and pre-update contracts do not invent new operations knowledge',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'jimenez-01'),'jimenez-01');
 w=E.choose(d,E.advance(d,w),'copy-times');w=E.abandon(d,w);
 assert.deepEqual(E.jimenezMemory(w,'vicuna'),[]);assert.throws(()=>E.visitJimenez(d,w),/Primero/);
 const old=structuredClone(d);old.missions['jimenez-01']=old.jimenezLegacyMission;
 w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),'jimenez-01'),'jimenez-01');w=E.advance(old,w);
 const before=structuredClone(w.run.pending);w=E.restore(d,E.serialize(w));assert.deepEqual(w.run.pending,before);assert.equal(E.mission(d,w).briefing,d.jimenezLegacyMission.briefing);
 w=finish(E,d,w);assert.equal(w.completed['jimenez-01'].jimenezVersion,0);assert.deepEqual(E.jimenezMemory(w,'vicuna'),[]);assert.equal(w.jimenezFollowup,undefined);
});
test('retry retains the new version and checkpoint decisions; new worlds have no follow-up',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'jimenez-01'),'jimenez-01');
 w.run.status='failed';w=E.retry(d,w);assert.equal(w.run.jimenezVersion,1);assert.equal(E.eventFor(d,E.advance(d,w)).id,'jimenez-relevo');
 assert.equal(E.createWorld(d).jimenezFollowup,undefined);
});
