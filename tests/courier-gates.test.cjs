const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../extensions/mensajeros/production.json')));
async function setup(){
 const E=await import('../extensions/mensajeros/production.mjs'),d=E.prepare(source);let w;
 for(let seed=0;seed<200;seed++){
  w=E.advance(d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed}),'adasme-01'),'adasme-01'));
  if(w.run.pending.category==='hostile'&&!E.eventFor(d,w).mandatory)break;
 }
 return {E,d,w};
}
function enter(E,d,w,code){for(const digit of code)w=E.gateAction(d,w,{type:'digit',digit});return E.gateAction(d,w,{type:'submit'});}

test('hostile and ordinary detours open one of the ten existing numeric cases before resolving',async()=>{
 const {E,d,w:hostile}=await setup();
 for(const id of ['echo-path','scout','avoid'])assert.equal(E.options(d,hostile).find(o=>o.id===id)?.gate,'numeric');
 const before={index:hostile.run.index,minutes:hostile.run.minutes,condition:hostile.run.condition,used:structuredClone(hostile.run.used)};
 let w=E.choose(d,hostile,'echo-path'),gate=E.currentGate(d,w);
 assert.ok(gate);assert.equal(gate.puzzle.kind,'numeric');assert.equal(gate.session.phase,'intro');assert.equal(w.run.index,before.index);assert.equal(w.run.minutes,before.minutes);assert.equal(w.run.condition,before.condition);assert.deepEqual(w.run.used,before.used);
 assert.deepEqual(E.currentGate(d,E.restore(d,E.serialize(w))),gate);
 const decision=structuredClone(hostile);decision.run.pending.id='reja';decision.run.pending.category='decision';decision.run.rolls[decision.run.index]={id:'reja',category:'decision'};
 assert.equal(E.options(d,decision).find(o=>o.id==='detour').gate,'numeric');
 assert.ok(E.currentGate(d,E.choose(d,decision,'detour')));
});

test('partial codes, hints and attempts persist; success applies the original detour exactly once',async()=>{
 const {E,d,w:sourceWorld}=await setup();const before=structuredClone(sourceWorld);
 let w=E.choose(d,sourceWorld,'echo-path');w=E.gateAction(d,w,{type:'start'});w=E.gateAction(d,w,{type:'hint'});w=E.gateAction(d,w,{type:'digit',digit:'0'});
 const saved=E.restore(d,E.serialize(w));assert.deepEqual(E.currentGate(d,saved),E.currentGate(d,w));
 const gate=E.currentGate(d,w);w=E.gateAction(d,w,{type:'clear'});w=enter(E,d,w,gate.puzzle.answer);
 assert.equal(E.currentGate(d,w).session.phase,'success');assert.equal(w.run.index,before.run.index);assert.equal(w.run.used.echo,undefined);
 w=E.completeGate(d,w);assert.equal(w.run.index,before.run.index+1);assert.equal(w.run.used.echo,1);assert.equal(w.run.condition,before.run.condition-(E.eventFor(d,before)?.electronic?6:2));assert.equal(E.currentGate(d,w),null);
 assert.throws(()=>E.completeGate(d,w),/compuerta/);
});

test('four wrong codes lock only that gate and leave combat available',async()=>{
 const {E,d,w:sourceWorld}=await setup();let w=E.choose(d,sourceWorld,'scout');w=E.gateAction(d,w,{type:'start'});const answer=E.currentGate(d,w).puzzle.answer,wrong=answer==='0'.repeat(answer.length)?'1'.repeat(answer.length):'0'.repeat(answer.length);
 for(let attempt=1;attempt<=4;attempt++){
  w=enter(E,d,w,wrong);w=E.restore(d,E.serialize(w));const gate=E.currentGate(d,w);
  assert.equal(gate.session.remaining,4-attempt);assert.equal(gate.session.phase,attempt===4?'locked':'failed');
  if(attempt<4)w=E.gateAction(d,w,{type:'continue'});
 }
 const options=E.options(d,w),scout=options.find(o=>o.id==='scout');assert.equal(E.optionAvailable(w,scout),false);assert.ok(options.some(o=>o.combat&&E.optionAvailable(w,o)));assert.throws(()=>E.completeGate(d,w),/todavía no/);
 w=E.choose(d,w,options.find(o=>o.combat).id);assert.ok(w.run.pending.combat);assert.equal(E.currentGate(d,w),null);
});

test('production exposes the complete numeric pool and rejects laboratory resets',async()=>{
 const {E,d,w:sourceWorld}=await setup();const puzzles=await import('../labs/compuertas/puzzles.mjs');assert.equal(puzzles.PUZZLES.filter(p=>p.kind==='numeric').length,10);
 const w=E.choose(d,sourceWorld,'scout');assert.throws(()=>E.gateAction(d,w,{type:'reset'}),/no disponible/);
});
