const test=require('node:test'),assert=require('node:assert/strict');
const {setup,extraction,finish}=require('./courier-return-fixtures.cjs');
function material(w){return JSON.stringify({credits:w.credits,crew:w.crew,stock:w.stock,regions:w.regions,paid:w.paid,completed:w.completed,run:w.run});}
test('a return exists only after the confirmed extraction, never at rescue, failure or abandonment',async()=>{
 const {E,d}=await setup();let w=E.createWorld(d,{seed:1});assert.equal(E.returnStatus(w),null);w.progression.known.push('adasme-01');w=E.start(d,w,'adasme-01');w.run.rescued={mode:'carry',assisted:true,ammoGiven:0};assert.equal(E.returnStatus(E.restore(d,E.serialize(w))),null);w.run.status='failed';assert.equal(E.returnStatus(E.abandon(d,w)),null);assert.throws(()=>E.answerReturn(d,w,'rest'));
});
test('real extractions preserve walking/carrying, aid and ammunition in a durable receipt',async()=>{
 const modes=new Set();for(const seed of [1,4,18,2130])for(const aid of ['assist-ammo','none']){
  const {E,d,w}=await extraction({seed,aid}),o=w.aftermath.rescueReturn.outcome;modes.add(o.mobility);assert.equal(o.assisted,aid!=='none');assert.equal(o.ammoGiven,aid==='assist-ammo'?4:0);assert.deepEqual(o,w.run.receipt.rescueOutcome);assert.deepEqual(o,w.completed['adasme-01'].rescueOutcome);assert.deepEqual(E.restore(d,E.serialize(w)),w);const scene=E.returnScene(w).paragraphs.join(' ');assert.ok(scene.includes(o.mobility==='carried'?'tuvieron que cargarlo':'pudo volver caminando'));assert.equal(scene.includes('cuatro municiones'),aid==='assist-ammo');
 }assert.deepEqual([...modes].sort(),['carried','walking']);
});
test('the return distinguishes armed contacts without changing the paid combat outcome',async()=>{
 const {E,w}=await extraction({fight:true});assert.ok(w.run.combats>0);assert.match(E.returnScene(w).paragraphs.join(' '),/contactos armados/);assert.equal(w.completed['adasme-01'].bonus,0);
});
test('both responses persist once, leave all material systems untouched and wait for the return trip',async()=>{
 const {E,d,w}=await extraction();for(const choice of ['rest','account']){
  const before=material(w),next=E.answerReturn(d,w,choice);assert.equal(material(next),before);assert.equal(w.aftermath.rescueReturn.approach,null);assert.equal(E.returnStatus(next).stage,'waiting');assert.deepEqual(E.restore(d,E.serialize(next)),next);assert.throws(()=>E.answerReturn(d,next,'rest'),/registrada/);assert.throws(()=>E.answerReturn(d,next,'acknowledge'),/disponible/);assert.equal(E.returnScene(next).choices.length,0);
 }
});
test('travelling to Los Héroes unlocks distinct later scenes; closing is explicit and never pays again',async()=>{
 const {E,d,w}=await extraction();for(const choice of ['rest','account']){
  let next=E.answerReturn(d,w,choice);next=E.travelHeroes(d,next);assert.equal(E.returnStatus(next).safe,false);assert.throws(()=>E.answerReturn(d,next,'acknowledge'),/viaje/);next=finish(E,d,next);assert.equal(E.returnStatus(next).stage,'followup');const scene=E.returnScene(next);assert.match(scene.paragraphs.join(' '),choice==='rest'?/segunda voz/:/cada caja queda asignada/);assert.equal(next.aftermath.rescueReturn.closed,false);const before=material(next);next=E.answerReturn(d,next,'acknowledge');assert.equal(material(next),before);assert.equal(E.returnStatus(next).stage,'closed');assert.ok(!E.nextLead(d,next).includes('respuesta de Darío'));assert.equal(E.returnScene(next).choices.length,0);assert.deepEqual(E.restore(d,E.serialize(next)),next);assert.throws(()=>E.answerReturn(d,next,'acknowledge'));
 }
});
test('the conversation may be deferred until after reaching home without demanding another journey',async()=>{
 const {E,d,w}=await extraction();let next=finish(E,d,E.travelHeroes(d,w));assert.equal(E.returnStatus(next).stage,'arrival');assert.equal(E.returnStatus(next).local,false);assert.match(E.returnScene(next).paragraphs[0],/envía un mensaje/);next=E.answerReturn(d,next,'rest');assert.equal(E.returnStatus(next).stage,'followup');
});
test('legacy completion migrates once using the saved rescue when available',async()=>{
 const {E,d,w}=await extraction();delete w.aftermath;delete w.completed['adasme-01'].rescueOutcome;delete w.run.receipt.rescueOutcome;const raw=E.serialize(w),next=E.restore(d,raw);assert.equal(next.aftermath.rescueReturn.outcome.mobility,w.run.rescued.mode==='carry'?'carried':'walking');assert.equal(material(next),material(w));assert.deepEqual(E.restore(d,E.serialize(next)),next);
});
test('legacy receipts without a remaining rescue run leave missing details unknown and remain playable at home',async()=>{
 const {E,d,w}=await extraction();let next=finish(E,d,E.travelHeroes(d,w));delete next.aftermath;delete next.completed['adasme-01'].rescueOutcome;next=E.restore(d,E.serialize(next));assert.equal(next.aftermath.rescueReturn.outcome.mobility,'unknown');assert.equal(next.aftermath.rescueReturn.outcome.assisted,null);assert.match(E.returnScene(next).paragraphs.join(' '),/no conserva cómo/);assert.equal(E.returnStatus(E.answerReturn(d,next,'account')).stage,'followup');
});
test('malformed facts and unsupported outcomes are rejected; reset clears the returned person',async()=>{
 const {E,d,w}=await extraction();for(const mutate of [x=>x.aftermath.version=9,x=>x.aftermath.rescueReturn.approach='invented',x=>x.aftermath.rescueReturn.closed=true,x=>x.aftermath.rescueReturn.outcome.mobility='healed',x=>x.paid=[]]){const bad=structuredClone(w);mutate(bad);assert.throws(()=>E.restore(d,E.serialize(bad)));}assert.equal(E.returnStatus(E.createWorld(d)),null);
});

test('arriving at Los Héroes through another completed assignment opens the message immediately',async()=>{
 const {E,d,w}=await extraction();let next=E.answerReturn(d,w,'rest');next=finish(E,d,E.start(d,next,'ana-01'));assert.equal(next.location,'heroes');assert.equal(E.returnStatus(next).stage,'followup');assert.equal(E.returnScene(next).choices[0].id,'acknowledge');
});
test('a saved fact cannot silently contradict the recorded extraction outcome',async()=>{
 const {E,d,w}=await extraction();w.aftermath.rescueReturn.outcome.assisted=!w.aftermath.rescueReturn.outcome.assisted;assert.throws(()=>E.restore(d,E.serialize(w)),/contradice/);
});
