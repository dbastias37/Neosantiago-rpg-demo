const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {randomUUID}=require('node:crypto');
const {boot}=require('./runtime-harness.cjs');
const {setup,finish}=require('./courier-return-fixtures.cjs');
require('../rosa-bridge.js');require('../community-bridge.js');
const B=globalThis.NeoRosaBridge,copy=x=>JSON.parse(JSON.stringify(x));
function campaign(){
 const a=boot(),c=a.ctx;c.crypto={randomUUID};c.load(fs.readFileSync('labs/community-bridge/campaign-fixture.json','utf8'));c.gameSessionActive=true;
 c.state.flags.iaraAtSafeHouse=true;c.state.flags.rosaCivilNetwork=true;c.state.index=18;c.state.refuge.active=false;c.prepareNight(2,null);c.settleNight('share');c.continueAfterNight();return a;
}
async function completed(){const {E,d}=await setup(),r=B.create(randomUUID());let w=B.join(E.createWorld(d,{seed:2130}),r,randomUUID());w=finish(E,d,E.travelRosa(d,w));w=B.collect(w);w=finish(E,d,E.start(d,w,'ana-01'));return {E,d,r,w:B.deliver(w)};}

test('Rosa enters actual third-day preparation after closing the night, not day two or a rescue replay',()=>{
 const a=campaign(),c=a.ctx;assert.equal(c.state.refuge.active,true);assert.equal(c.state.refuge.reason,'preparation');assert.equal(c.state.refuge.rested,true);assert.equal(c.pendingNight(),null);assert.equal(c.rosaBridgeEligible(),true);assert.equal(c.acceptRosaBridge(),true);assert.equal(c.acceptRosaBridge(),false);assert.equal(c.refugeCanLeave(),true);assert.match(a.nodes.get('leaveRefuge').textContent,/día 3/);assert.equal(c.state.flags.iaraAtSafeHouse,true);assert.equal(c.state.rosaBridge.stage,'requested');
 for(const mutate of [c=>c.state.index=9,c=>c.state.flags.iaraAtSafeHouse=false,c=>c.state.flags.rosaDebtClosed=true,c=>c.state.flags.rosaCivilNetwork=false,c=>c.state.finished=true,c=>c.state.expeditionRest.nights[2].phase='settled']){const c=campaign().ctx;mutate(c);assert.equal(c.acceptRosaBridge(),false);assert.equal(c.state.rosaBridge,undefined);}
});
test('fresh team introduces only Ana, travels and escorts real families before confirming Rosa reception',async()=>{
 const {E,d}=await setup();for(const seed of [1,42,2130]){
  const r=B.create(randomUUID());let w=B.join(E.createWorld(d,{seed}),r,randomUUID());assert.deepEqual(w.paid,[]);assert.deepEqual(w.progression.known,['relevo-01','ana-01']);assert.throws(()=>B.collect(w));assert.throws(()=>B.deliver(w));
  w=finish(E,d,E.travelRosa(d,w));assert.equal(w.location,'plaza');assert.match(w.run.log.at(-1),/Plaza de Armas/);assert.doesNotMatch(w.run.log.at(-1),/Llegada a Los Héroes/);
  w=E.start(d,w,'ana-01');assert.equal(w.rosaBridge.stage,'collected');assert.throws(()=>B.deliver(w));w=finish(E,d,w);assert.equal(w.location,'heroes');assert.deepEqual(w.paid,['ana-01']);const credits=w.credits,crew=copy(w.crew),r0=copy(w.completed['ana-01']);w=B.deliver(w);assert.equal(w.credits,credits);assert.deepEqual(w.crew,crew);assert.deepEqual(w.completed['ana-01'],r0);assert.deepEqual(B.deliver(w),w);assert.equal(B.receive(r,w).stage,'delivered');assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
});
test('completed Ana escort gets a new physical addendum without a second payment or escort',async()=>{
 const {E,d,w:old}=await completed(),r=B.create(randomUUID());let w=copy(old);delete w.rosaBridge;const credits=w.credits,receipt=copy(w.completed['ana-01']);
 w=B.join(w,r,randomUUID());assert.throws(()=>B.deliver(w));w=finish(E,d,E.travelRosa(d,w));w=B.collect(w);w=finish(E,d,E.travelHeroes(d,w));w=B.deliver(w);assert.deepEqual(w.paid,['ana-01']);assert.equal(w.credits,credits);assert.deepEqual(w.completed['ana-01'],receipt);assert.equal(B.receive(r,w).stage,'delivered');assert.throws(()=>E.start(d,w,'ana-01'));
});
test('pending and interrupted assignments remain intact when receiving both community requests',async()=>{
 const {E,d}=await setup();let w=E.advance(d,E.start(d,E.createWorld(d,{seed:42}),'relevo-01')),before=copy(w);
 w=B.join(w,B.create(randomUUID()),randomUUID());w=globalThis.NeoCommunityBridge.join(w,globalThis.NeoCommunityBridge.create(randomUUID(),'B'),randomUUID());assert.deepEqual(w.run,before.run);assert.equal(w.location,before.location);assert.deepEqual(w.paid,[]);assert.throws(()=>E.travelRosa(d,w));assert.throws(()=>B.collect(w));assert.deepEqual(E.restore(d,E.serialize(w)),w);
 w.run.status='failed';assert.throws(()=>E.travelRosa(d,w));assert.throws(()=>B.deliver(w));const abandoned=E.abandon(d,w);assert.equal(abandoned.rosaBridge.requestId,w.rosaBridge.requestId);assert.equal(abandoned.matiasBridge.requestId,w.matiasBridge.requestId);
});
test('Rosa rejects foreign, provisional, missing and incompatible confirmations',async()=>{
 const {r,w}=await completed();for(const mutate of [x=>x.schema=99,x=>x.mode='laboratory',x=>x.contentVersion='future',x=>x.rosaBridge.requestId=randomUUID(),x=>x.rosaBridge.stage='collected',x=>x.rosaBridge.method='invented',x=>x.completed['ana-01'].provisional=true,x=>x.paid=[],x=>x.effects=[],x=>x.completed['ana-01'].recipient='Other']){const bad=copy(w);mutate(bad);assert.throws(()=>B.receive(r,bad));}
 assert.throws(()=>B.join(w,B.create(randomUUID()),randomUUID()));
});
test('confirmed receipt is imported once and gives a costly optional rescue, never tower access or Rosa relocation',async()=>{
 const a=campaign(),c=a.ctx;c.acceptRosaBridge();const {E,d,w:done}=await completed(),w=copy(done);w.rosaBridge.requestId=c.state.rosaBridge.requestId;a.storage.set(c.WORLD_COURIER_KEY,E.serialize(w));const before=copy(c.state);c.syncRosaBridge();assert.equal(c.state.rosaBridge.stage,'delivered');assert.equal(c.reviewRosaBridge(),true);assert.equal(c.reviewRosaBridge(),false);const after=copy(c.state);delete before.rosaBridge;delete after.rosaBridge;assert.deepEqual(after,before);
 const choices=c.eventDisplay(c.events[18],18).choices,option=choices.at(-1);assert.equal(choices.length,c.events[18].choices.length+1);assert.deepEqual(copy(choices.slice(0,-1)),copy(c.events[18].choices));assert.equal(option.req.water,1);c.apply(option);assert.equal(c.state.flags.rescuedStrangers,true);assert.equal(c.state.flags.rosaBridgeRouteUsed,true);assert.equal(c.state.flags.towerCode,undefined);assert.equal(c.state.flags.clearAvenue,undefined);assert.equal(c.state.flags.iaraAtSafeHouse,true);assert.equal(c.eventDisplay(c.events[18],18).choices.some(o=>o.flags?.rosaBridgeRouteUsed),false);assert.equal(a.storage.get(c.WORLD_COURIER_KEY),E.serialize(w));
});
test('late or already chosen avenue cannot be rewritten, and a closed ending imports nothing',async()=>{
 const {E,d,w:done}=await completed();for(const mutate of [c=>c.state.index=19,c=>c.state.flags.silentSurface=true,c=>c.state.flags.rescuedStrangers=true]){
  const a=campaign(),c=a.ctx;c.acceptRosaBridge();const w=copy(done);w.rosaBridge.requestId=c.state.rosaBridge.requestId;a.storage.set(c.WORLD_COURIER_KEY,E.serialize(w));mutate(c);c.syncRosaBridge();c.reviewRosaBridge();assert.equal(c.eventDisplay(c.events[18],18).choices.some(o=>o.flags?.rosaBridgeRouteUsed),false);assert.match(c.rosaBridgeText(),/después de cruzar/);
 }
 const a=campaign(),c=a.ctx;c.acceptRosaBridge();const w=copy(done);w.rosaBridge.requestId=c.state.rosaBridge.requestId;a.storage.set(c.WORLD_COURIER_KEY,E.serialize(w));c.state.finished=true;const before=JSON.stringify(c.state);c.syncRosaBridge();assert.equal(JSON.stringify(c.state),before);
});
test('legacy saves do not acquire a request; malformed optional records preserve the loaded campaign',async()=>{
 const a=campaign(),c=a.ctx,raw=JSON.stringify(c.state);assert.equal(c.load(raw),true);assert.equal(c.state.rosaBridge,undefined);const old=c.state,bad=JSON.parse(raw);bad.rosaBridge={version:77};assert.equal(c.load(JSON.stringify(bad)),false);assert.equal(c.state,old);
 const {E,d}=await setup(),w=E.createWorld(d);assert.equal(E.restore(d,E.serialize(w)).rosaBridge,undefined);w.rosaBridge={version:77};assert.throws(()=>E.restore(d,E.serialize(w)));c.localStorage.setItem=()=>{throw Error('quota')};assert.equal(c.acceptRosaBridge(),false);assert.equal(c.state.rosaBridge,undefined);
});
test('courier reception never reports success on a failed storage write',async()=>{
 const {E,d,w:delivered}=await completed(),{rosaUI}=await import('../extensions/mensajeros/rosa-bridge-ui.mjs');let w=copy(delivered);w.rosaBridge={...w.rosaBridge,stage:'collected',recipient:null,method:null};const before=copy(w),messages=[];
 globalThis.NeoBridgeContext={key:x=>x};globalThis.localStorage={setItem(){throw Error('quota')}};
 try{const ui=rosaUI({data:d,E,getWorld:()=>w,setWorld:x=>{w=x},canWrite:()=>true,render(){},open(){},close(){},announce:t=>messages.push(t),esc:String,image:()=>''}),button={hasAttribute:()=>false,dataset:{rosaAction:'deliver'}};ui.handle(button);assert.deepEqual(w,before);assert.match(messages[0],/No se confirmó/);let raw;globalThis.localStorage.setItem=(key,value)=>{raw=value};ui.handle(button);assert.equal(w.rosaBridge.stage,'delivered');assert.deepEqual(E.restore(d,raw),w);}finally{delete globalThis.NeoBridgeContext;delete globalThis.localStorage;}
});
