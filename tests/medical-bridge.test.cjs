const test=require('node:test'),assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {boot}=require('./runtime-harness.cjs');
const {setup,finish,extraction}=require('./courier-return-fixtures.cjs');
require('../community-bridge.js');
const B=globalThis.NeoCommunityBridge,copy=x=>JSON.parse(JSON.stringify(x));
const request=variant=>B.create(randomUUID(),variant||'B');
function campaign(variant='B',storage=new Map()){
 const a=boot(storage,{search:'?bridgeLab='+variant}),c=a.ctx;c.crypto={randomUUID};
 c.gameSessionActive=true;c.state.introCompleted=c.state.storyPreludeSeen=c.state.starterKitGiven=c.state.economyHelpSeen=true;
 c.state.flags.matiasAtRefuge=true;c.state.flags.savedMatias=true;c.state.index=8;c.pending={ending:null,returnToRefuge:null};c.continuePendingAdvance();c.settleNight('share');c.continueAfterNight();return a;
}
function gameplay(c){const s=copy(c.state);delete s.matiasBridge;return s}

test('context isolates A, B, production and nested shared views',()=>{
 const a=campaign('A'),b=campaign('B'),p=boot();assert.notEqual(a.ctx.KEY,b.ctx.KEY);assert.notEqual(a.ctx.KEY,p.ctx.KEY);assert.equal(p.ctx.KEY,'neosantiago2130_demo_v3');
 assert.equal(a.ctx.acceptMedicalBridge(),true);assert.equal(b.ctx.acceptMedicalBridge(),true);assert.equal(p.ctx.acceptMedicalBridge(),false);
 const fs=require('node:fs'),vm=require('node:vm');const top={NeoBridgeContext:a.ctx.NeoBridgeContext};top.parent=top;const ctx={URL,location:{search:''},parent:{parent:top}};vm.runInNewContext(fs.readFileSync('bridge-context.js','utf8'),ctx);assert.equal(ctx.NeoBridgeContext.variant,'A');
});
test('only a confirmed Matias rescue after the closed first night can request the episode',()=>{
 for(const invalidate of [c=>{c.state.flags.matiasAtRefuge=false},c=>{c.state.index=10},c=>{c.state.finished=true},c=>{c.state.refuge.active=false},c=>{c.state.expeditionRest.nights[1].phase='settled'}]){const {ctx:c}=campaign();invalidate(c);assert.equal(c.acceptMedicalBridge(),false);assert.equal(c.state.matiasBridge,undefined)}
});
test('A waits on an accepted commitment, B leaves; delegation releases A without fabricating care',()=>{
 for(const variant of ['A','B']){const {ctx:c}=campaign(variant),before=gameplay(c);assert.equal(c.acceptMedicalBridge(),true);assert.deepEqual(gameplay(c),before);assert.equal(c.refugeCanLeave(),variant==='B');assert.equal(c.delegateMedicalBridge(),true);assert.equal(c.refugeCanLeave(),true);assert.equal(c.state.matiasBridge.stage,'requested');assert.deepEqual(gameplay(c),before)}
});
test('failed campaign writes preserve the exact request and never release the gate',()=>{
 const a=campaign('A'),c=a.ctx,before=JSON.stringify(c.state);const set=c.localStorage.setItem;c.localStorage.setItem=()=>{throw Error('quota')};assert.equal(c.acceptMedicalBridge(),false);assert.equal(JSON.stringify(c.state),before);c.localStorage.setItem=set;c.acceptMedicalBridge();const saved=JSON.stringify(c.state);c.localStorage.setItem=()=>{throw Error('quota')};assert.equal(c.delegateMedicalBridge(),false);assert.equal(JSON.stringify(c.state),saved);assert.equal(c.refugeCanLeave(),false);
});
test('commission introduces only Adasme and preserves a pending assignment and its physical location',async()=>{
 const {E,d}=await setup();let w=E.start(d,E.createWorld(d,{seed:2130}),'relevo-01');w=E.advance(d,w);const before=copy(w);w=B.join(w,request(),randomUUID());
 assert.deepEqual(w.run,before.run);assert.equal(w.location,before.location);assert.deepEqual(w.paid,[]);assert.deepEqual(w.completed,{});assert.equal(E.missionOpen(d,w,'adasme-01'),true);assert.equal(E.missionOpen(d,w,'jimenez-01'),false);
 assert.doesNotMatch(E.assignment(d,w,'adasme-01').briefing,/enlace de Jiménez confirmado/);assert.throws(()=>E.travelMedical(d,w));assert.throws(()=>B.collect(w));assert.deepEqual(E.restore(d,E.serialize(w)),w);
});
test('fresh couriers travel to Vicuña and back with protected cargo, no rescue or free payment',async()=>{
 const {E,d}=await setup(),r=request();let w=B.join(E.createWorld(d,{seed:2130}),r,randomUUID());const credits=w.credits;
 assert.throws(()=>B.collect(w));w=E.travelMedical(d,w);assert.equal(w.run.kind,'travel');assert.throws(()=>B.collect(w));w=finish(E,d,w);assert.equal(w.location,'vicuna');
 const before=copy(w);w=B.collect(w);const after=copy(w);delete after.matiasBridge;delete before.matiasBridge;assert.deepEqual(after,before);assert.deepEqual(B.collect(w),w);assert.throws(()=>B.deliver(w));
 w=finish(E,d,E.travelHeroes(d,w));w=B.deliver(w);assert.equal(w.credits,credits);assert.deepEqual(w.paid,[]);assert.deepEqual(B.deliver(w),w);assert.equal(B.receive(r,w).source,'direct');assert.deepEqual(E.restore(d,E.serialize(w)),w);
});
test('an already paid rescue keeps its payment and yields a distinct medical receipt',async()=>{
 const {E,d,w:rescued}=await extraction(),r=request();let w=B.collect(B.join(rescued,r,randomUUID()));const credits=w.credits,payment=copy(w.completed['adasme-01']);w=finish(E,d,E.travelHeroes(d,w));w=B.deliver(w);assert.equal(B.receive(r,w).source,'rescue');assert.equal(w.credits,credits);assert.deepEqual(w.completed['adasme-01'],payment);assert.throws(()=>E.start(d,w,'adasme-01'));assert.equal(w.paid.filter(x=>x==='adasme-01').length,1);
});
test('fresh contextual teams can combine the actual rescue and medical return without prerequisite payments',async()=>{
 const {E,d}=await setup();for(const seed of [1,2130,42]){
  const r=request();let w=B.join(E.createWorld(d,{seed}),r,randomUUID());w=finish(E,d,E.travelToMission(d,w,'adasme-01'));assert.equal(w.location,'tobalaba');
  w=finish(E,d,E.start(d,w,'adasme-01'));assert.ok(w.run.rescued);assert.deepEqual(w.paid,['adasme-01']);const amount=w.credits;
  w=B.collect(w);w=finish(E,d,E.travelHeroes(d,w));w=B.deliver(w);assert.equal(B.receive(r,w).source,'rescue');assert.equal(w.credits,amount);assert.deepEqual(w.paid,['adasme-01']);assert.equal(w.location,'heroes');
 }
});
test('foreign, provisional and incompatible receipts cannot advance a campaign',async()=>{
 const {E,d}=await setup(),r=request();let w=B.join(E.createWorld(d),r,randomUUID());w.location='vicuna';w=B.collect(w);w.location='heroes';w=B.deliver(w);
 for(const mutate of [x=>{x.schema=99},x=>{x.mode='laboratory'},x=>{x.contentVersion='future'},x=>{x.matiasBridge.requestId=randomUUID()},x=>{x.matiasBridge.stage='collected'},x=>{x.matiasBridge.recipient='Otro refugio'},x=>{x.matiasBridge.source='rescue'},x=>{x.matiasBridge.courierId=null}]){const bad=copy(w);mutate(bad);assert.throws(()=>B.receive(r,bad))}
 assert.throws(()=>B.join(w,request(),randomUUID()));
});
test('physical receipt imports once, does not change inventories or first-night memory and unlocks only a new choice',async()=>{
 const a=campaign('A'),c=a.ctx;c.acceptMedicalBridge();const before=gameplay(c),{E,d}=await setup();let w=B.join(E.createWorld(d),copy(c.state.matiasBridge),randomUUID());w.location='vicuna';w=B.collect(w);w.location='heroes';w=B.deliver(w);const raw=E.serialize(w);a.storage.set(c.WORLD_COURIER_KEY,raw);
 c.renderRefuge();assert.equal(c.state.matiasBridge.stage,'delivered');assert.equal(c.refugeCanLeave(),false);assert.deepEqual(gameplay(c),before);assert.equal(c.reviewMedicalBridge(),true);assert.equal(c.reviewMedicalBridge(),false);assert.equal(c.refugeCanLeave(),true);assert.deepEqual(gameplay(c),before);assert.equal(a.storage.get(c.WORLD_COURIER_KEY),raw);
 const c2=boot(a.storage,{search:'?bridgeLab=A'}).ctx;assert.equal(c2.load(),true);assert.equal(c2.state.matiasBridge.stage,'reviewed');const original=c2.events[10],episode=c2.state.matiasBridge;delete c2.state.matiasBridge;const previousChoices=copy(c2.eventDisplay(original,10).choices);c2.state.matiasBridge=episode;const scene=c2.eventDisplay(original,10);assert.equal(scene.choices.length,original.choices.length+1);assert.deepEqual(copy(scene.choices.slice(0,-1)),previousChoices);
 const option=scene.choices.at(-1),threat=c2.state.threat;c2.state.index=10;c2.recordNoaRouteDecision(option);c2.apply(option);assert.equal(c2.state.threat,threat-2);assert.equal(c2.eventDisplay(original,10).choices.some(x=>x.flags?.matiasBridgeRouteUsed),false);assert.equal(c2.state.flags.matiasAtRefuge,true);assert.equal(c2.state.companionCommitments.route.departure.path,'wait');assert.doesNotThrow(()=>c2.normalizeNoaRoute());
});
test('late receipt preserves past route and a finished ending never imports new facts',async()=>{
 const a=campaign(),c=a.ctx;c.acceptMedicalBridge();const {E,d}=await setup();let w=B.join(E.createWorld(d),copy(c.state.matiasBridge),randomUUID());w.location='vicuna';w=B.collect(w);w.location='heroes';w=B.deliver(w);a.storage.set(c.WORLD_COURIER_KEY,E.serialize(w));
 c.state.finished=true;const before=JSON.stringify(c.state);c.syncMedicalBridge();assert.equal(JSON.stringify(c.state),before);c.state.finished=false;c.state.index=11;c.syncMedicalBridge();c.reviewMedicalBridge();assert.match(c.medicalText(),/después del paso/);assert.equal(c.eventDisplay(c.events[11],11).choices.length,c.events[11].choices.length);assert.equal(c.state.flags.matiasBridgeRouteUsed,undefined);
});
test('optional malformed fields reject loading atomically while old saves do not acquire an episode',async()=>{
 const a=campaign(),c=a.ctx,old=JSON.stringify(c.state);assert.equal(c.load(old),true);assert.equal(c.state.matiasBridge,undefined);const prior=c.state,bad=JSON.parse(old);bad.matiasBridge={version:99};assert.equal(c.load(JSON.stringify(bad)),false);assert.equal(c.state,prior);
 const {E,d}=await setup(),w=E.createWorld(d);assert.equal(E.restore(d,E.serialize(w)).matiasBridge,undefined);w.matiasBridge={version:99};assert.throws(()=>E.restore(d,E.serialize(w)));
});
test('new lab game clears only its own courier scope and creates no implicit episode',()=>{
 const a=campaign('A'),c=a.ctx;c.acceptMedicalBridge();a.storage.set(c.WORLD_COURIER_KEY,'old courier');a.storage.set('neosantiago.mensajeros.production.v1','production');a.storage.set('neosantiago.lab.bridge.B.neosantiago.mensajeros.production.v1','B');c.newGame();assert.equal(a.storage.has(c.WORLD_COURIER_KEY),false);assert.equal(a.storage.get('neosantiago.mensajeros.production.v1'),'production');assert.equal(a.storage.get('neosantiago.lab.bridge.B.neosantiago.mensajeros.production.v1'),'B');assert.equal(c.state.matiasBridge,undefined);
});

test('a route already agreed with Noa cannot be replaced by a late medical option',()=>{
 const {ctx:c}=campaign();c.acceptMedicalBridge();c.state.matiasBridge={...c.state.matiasBridge,stage:'reviewed',courierId:randomUUID(),source:'direct'};c.state.index=10;
 const choice=c.eventDisplay(c.events[10],10).choices[0];c.recordNoaRouteDecision(choice);assert.equal(c.medicalRoutePassed(),true);assert.equal(c.eventDisplay(c.events[10],10).choices.some(x=>x.flags?.matiasBridgeRouteUsed),false);assert.match(c.medicalText(),/después del paso/);
});

test('the existing expedition orientation explains the live medical handoff before República',()=>{
 const a=campaign(),c=a.ctx;c.acceptMedicalBridge();
 assert.equal(JSON.parse(a.storage.get(c.KEY)).sceneId,'d2-drone-pulse');
 c.state.refuge.active=false;c.renderExpeditionOrientation(c.events[9]);
 assert.match(a.nodes.get('expeditionPurpose').textContent,/reserva médica sigue en camino/);
 assert.equal(a.nodes.get('expeditionOrientation').classList.contains('hidden'),false);
 c.state.matiasBridge={...c.state.matiasBridge,stage:'reviewed',courierId:randomUUID(),source:'direct'};
 c.state.index=10;c.renderExpeditionOrientation(c.events[10]);
 assert.match(a.nodes.get('expeditionPurpose').textContent,/marca baja/);
 c.state.index=11;c.renderExpeditionOrientation(c.events[11]);
 assert.equal(a.nodes.get('expeditionOrientation').classList.contains('hidden'),true);
});
test('courier UI does not claim collection when persistence fails; retry writes once',async()=>{
 const {E,d}=await setup(),{medicalUI}=await import('../extensions/mensajeros/medical-bridge-ui.mjs');let w=B.join(E.createWorld(d),request(),randomUUID());w.location='vicuna';w=E.restore(d,E.serialize(w));const before=copy(w),messages=[];
 globalThis.NeoBridgeContext={variant:'B',key:x=>x};globalThis.localStorage={setItem(){throw Error('quota')}};
 try{
  const ui=medicalUI({data:d,E,getWorld:()=>w,setWorld:x=>{w=x},canWrite:()=>true,render(){},open(){},close(){},announce:t=>messages.push(t),esc:String,image:()=>''});
  const button={hasAttribute:()=>false,dataset:{medicalAction:'collect'}};ui.handle(button);assert.deepEqual(w,before);assert.match(messages[0],/No se confirmó/);
  let raw;globalThis.localStorage.setItem=(key,value)=>{raw=value};ui.handle(button);assert.equal(w.matiasBridge.stage,'collected');const saved=raw;ui.handle(button);assert.equal(raw,saved);assert.deepEqual(E.restore(d,raw),w);
 }finally{delete globalThis.NeoBridgeContext;delete globalThis.localStorage;}
});
test('the labelled lab fixture remains a valid closed night without a fabricated episode',()=>{
 const fs=require('node:fs'),raw=fs.readFileSync('labs/community-bridge/campaign-fixture.json','utf8'),a=boot(new Map(),{search:'?bridgeLab=B'});assert.equal(a.ctx.load(raw),true);a.ctx.gameSessionActive=true;assert.equal(a.ctx.medicalEligible(),true);assert.equal(a.ctx.state.matiasBridge,undefined);
});
test('second-night memory records only the confirmed handover and never rewrites the first night',()=>{
 for(const source of ['direct','rescue']){
  const a=campaign(),c=a.ctx,first=JSON.stringify(c.state.expeditionRest.nights[1]);c.acceptMedicalBridge();c.state.matiasBridge={...c.state.matiasBridge,stage:'reviewed',courierId:randomUUID(),source};
  c.state.index=c.events.findIndex(e=>e.day===3);c.prepareNight(2,null);const context=c.pendingNight().context;assert.match(context,/Matías recibió su reserva/);assert.equal(context.includes('regreso de Darío a Vicuña'),source==='rescue');assert.equal(JSON.stringify(c.state.expeditionRest.nights[1]),first);
  c.state.matiasBridge.source=source==='direct'?'rescue':'direct';c.showNight();assert.equal(c.pendingNight().context,context);assert.equal(boot(a.storage,{search:'?bridgeLab=B'}).ctx.load(),true);
 }
});
