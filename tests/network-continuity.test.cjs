const test=require('node:test'),assert=require('node:assert/strict');
const {setup,finish}=require('./courier-return-fixtures.cjs');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const ready=import('../extensions/mensajeros/continuity.mjs');
test('completed early contacts retain observed outcomes without replaying the request or changing the save',async()=>{
 const {E,d}=await setup(),{completedContact}=await ready;
 for(const [id,npc,pattern] of [['romero-01','dr-romero',/Julián/],['ana-01','ana',/confirmación para Ana/],['morales-01','hmorales',/Noa/]]){
  let w=finish(E,d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),id),id));
  if(npc==='hmorales')w.progression.known=w.progression.known.filter(x=>x!=='relevo-01');
  const before=E.serialize(w),account=completedContact(d,w,npc);
  assert.ok(account);assert.match(account.paragraphs.join(' '),pattern);assert.ok(account.receipts.includes(id));assert.equal(E.serialize(w),before);
  w.location='plaza';assert.deepEqual(completedContact(d,w,npc),account);
 }
});
test('unpaid, provisional and unfinished requests cannot become remembered deliveries; legacy facts remain unknown',async()=>{
 const {E,d}=await setup(),{completedContact}=await ready;
 let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'romero-01'),'romero-01');
 assert.equal(completedContact(d,w,'dr-romero'),null);w=finish(E,d,w);
 w.completed['romero-01'].provisional=true;assert.equal(completedContact(d,w,'dr-romero'),null);
 w.completed['romero-01'].provisional=false;w.completed['romero-01'].corridorVersion=1;
 assert.match(completedContact(d,w,'dr-romero').paragraphs.join(' '),/no conserva todos los detalles/);
});
test('pending reports take precedence over the all-deliveries conclusion and clear only after physical return',async()=>{
 const {E,d}=await setup();let w=finish(E,d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'jimenez-01'),'jimenez-01'));
 assert.match(E.nextLead(d,w),/Queda llevar a Jiménez/);
 w=E.restore(d,E.serialize(w));assert.match(E.nextLead(d,w),/Queda llevar a Jiménez/);
 w=E.visitJimenez(d,w);assert.match(E.nextLead(d,w),/Queda llevar a Jiménez/);
 w=finish(E,d,w);assert.doesNotMatch(E.nextLead(d,w),/Queda llevar a Jiménez/);
});
test('Inés stays at the central post; the operations relay has a distinct identity',async()=>{
 const {d}=await setup();assert.match(d.missions['beatriz-01'].briefing,/Luz/);
 assert.match(d.beatrizScripted['beatriz-01:1'].text,/Inés/);
 assert.match(d.missions['jimenez-01'].briefing,/Teresa/);
 assert.doesNotMatch(JSON.stringify(d.jimenezScripted),/Inés/);
});
