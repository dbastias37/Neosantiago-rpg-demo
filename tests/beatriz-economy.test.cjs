const test=require('node:test'),assert=require('node:assert/strict');
const {setup,finish}=require('./courier-return-fixtures.cjs');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const clone=structuredClone;
function choose(E,d,w,id){return E.restore(d,E.serialize(E.choose(d,E.advance(d,w),id)));}
function reserve(E,d,{seal='seal',handover='explain',seed=1}={}){
 let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed}),'beatriz-01'),'beatriz-01');
 w=E.advance(d,w);w=E.choose(d,w,E.options(d,w).find(o=>E.optionAvailable(w,o)&&!o.combat).id);
 w=choose(E,d,w,seal);assert.deepEqual(w.run.cargo,{nutrients:1});
 w=choose(E,d,w,handover);return choose(E,d,w,'deliver');
}
test('nutrient handling and the apprentice handover produce four distinct confirmed arrivals',async()=>{
 const {E,d}=await setup();
 for(const seal of ['seal','secure'])for(const handover of ['explain','together']){
  const w=reserve(E,d,{seal,handover}),r=w.completed['beatriz-01'];
  assert.equal(r.beatrizVersion,1);assert.equal(w.location,'libertadores');assert.equal(r.gross,14);
  assert.match(r.narration,seal==='seal'?/aro que ajustó Tomás/:/aro pendiente/);
  assert.match(r.narration,handover==='explain'?/dos columnas/:/preguntas/);
  assert.equal(E.price(d,w,'food'),3);assert.deepEqual(w.run.cargo,{});
  assert.equal(w.beatrizFollowup.returned,false);assert.deepEqual(E.restore(d,E.serialize(w)),w);
  assert.throws(()=>E.choose(d,w,'deliver'));assert.throws(()=>E.start(d,w,'beatriz-01'));
 }
});
test('a later physical visit remembers the handover without a second payment or price reduction',async()=>{
 const {E,d}=await setup();
 for(const handover of ['explain','together']){
  let w=reserve(E,d,{handover}),balance=w.credits,receipt=clone(w.completed['beatriz-01']);
  assert.throws(()=>E.visitBeatriz(d,w),/ya está/);
  w=finish(E,d,E.travelHeroes(d,w));assert.equal(w.beatrizFollowup.left,true);assert.equal(w.beatrizFollowup.returned,false);
  assert.doesNotMatch(E.beatrizMemory(w,'libertadores').join(' '),/Al volver/);
  w=E.visitBeatriz(d,w);assert.equal(E.rewardForecast(d,w),null);assert.equal(E.mission(d,w).purpose,'visit');
  assert.throws(()=>E.visitBeatriz(d,w),/Termina/);
  w=finish(E,d,w);assert.equal(w.location,'libertadores');assert.equal(w.beatrizFollowup.returned,true);
  assert.match(E.beatrizMemory(w,'libertadores').join(' '),handover==='explain'?/recibirlo yo/:/necesita a las dos/);
  assert.equal(w.credits,balance);assert.deepEqual(w.completed['beatriz-01'],receipt);assert.equal(E.price(d,w,'food'),3);
  assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('unfinished and abandoned reserves never create Beatriz knowledge or visits',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'beatriz-01'),'beatriz-01');
 assert.deepEqual(E.beatrizMemory(w,'libertadores'),[]);w=E.abandon(d,w);
 assert.deepEqual(E.beatrizMemory(w,'libertadores'),[]);assert.equal(w.beatrizFollowup,undefined);
 assert.throws(()=>E.visitBeatriz(d,w),/Primero entrega/);assert.equal(w.credits,0);
});
test('reduced contracts require choosing between supplies and equipment; no buy/sell arbitrage',async()=>{
 const {E,d}=await setup();
 const max=Object.values(d.missions).reduce((n,m)=>n+m.reward.base+m.reward.stealth_bonus,0);
 assert.equal(max,134);assert.ok(d.missions['relevo-01'].reward.base<d.shop.find(x=>x.id==='medkit').price);
 assert.ok(d.missions['guzman-01'].reward.base<d.shop.find(x=>x.id==='rifle556').price);
 assert.ok(d.missions['adasme-01'].reward.stealth_bonus>0);
 const w=connectedWorld(E,d);w.effects=['romero-01','beatriz-01'];
 for(const offer of d.shop)assert.ok(E.salePrice(d,offer.id)*offer.qty<E.price(d,w,offer.id),offer.id);
 let first=finish(E,d,E.start(d,E.createWorld(d,{seed:1}),'relevo-01'));
 first=finish(E,d,E.travelHeroes(d,first));const credits=first.credits;
 assert.ok(credits>=E.price(d,first,'water'));first=E.buy(d,first,'water','tomas');assert.equal(first.credits,credits-4);
 assert.throws(()=>E.buy(d,first,'rifle556','rocio'),/créditos/);
});
test('pre-update contracts keep their pending scenes, payment, penalties and checkpoints',async()=>{
 const {E,d}=await setup(),old=clone(d);
 for(const [id,t]of Object.entries(d.previousTerms))Object.assign(old.missions[id],clone(t));
 old.missions['beatriz-01']=clone(d.beatrizLegacyMission);
 for(const id of ['relevo-01','beatriz-01','adasme-01']){
  let w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),id),id);
  w=E.advance(old,w);
  const strip=r=>{if(!r)return;delete r.rewardTerms;delete r.beatrizVersion;strip(r.checkpoint?.snapshot);};strip(w.run);
  const loaded=E.restore(d,E.serialize(w));assert.deepEqual(loaded.run.pending,w.run.pending);
  assert.deepEqual(E.mission(d,loaded).reward,old.missions[id].reward);
  assert.equal(E.mission(d,loaded).late_penalty,2);assert.equal(loaded.run.minutes,w.run.minutes);
  assert.deepEqual(loaded.run.checkpoint.snapshot.rewardTerms.reward,old.missions[id].reward);
  const done=finish(E,d,loaded);assert.equal(done.run.receipt.gross,old.missions[id].reward.base+old.missions[id].reward.stealth_bonus);
  if(id==='beatriz-01'){assert.deepEqual(E.beatrizMemory(done,'libertadores'),[]);assert.equal(done.run.receipt.beatrizVersion,0);}
 }
});
test('new reduced contracts preserve their terms through save, late delivery and retry',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'beatriz-01'),'beatriz-01');
 w=E.restore(d,E.serialize(w));assert.equal(E.mission(d,w).reward.base,14);
 w.run.status='failed';w=E.retry(d,w);assert.equal(E.mission(d,w).reward.base,14);assert.equal(w.run.beatrizVersion,1);
 w.run.minutes=150;const done=finish(E,d,w);assert.equal(done.run.receipt.penalty,7);assert.equal(done.credits,7);
 const saved=E.serialize(done),restored=E.restore(d,saved);assert.equal(restored.credits,7);assert.deepEqual(restored.completed,done.completed);
});
