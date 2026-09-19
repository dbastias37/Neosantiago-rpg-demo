const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {boot,root}=require('./runtime-harness.cjs');
const {parseHTML}=require('linkedom');
const copy=x=>JSON.parse(JSON.stringify(x));
const content=JSON.parse(fs.readFileSync(path.join(root,'extensions/mensajeros/production.json'),'utf8'));
const EReady=import('../extensions/mensajeros/production.mjs');

async function delivery(approach='trace'){
  const E=await EReady,d=E.prepare(content);let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:2130}),'morales-01'),'morales-01'),snapshots=[];
  for(let i=0;i<100&&w.run.status==='active';i++){
    snapshots.push(E.serialize(w));
    if(!w.run.pending)w=E.advance(d,w);
    const options=E.options(d,w).filter(o=>E.optionAvailable(w,o));
    const action=options.find(o=>o.id===approach)||options.find(o=>o.id==='scout')||options.find(o=>o.id==='jam-skill')||options.find(o=>o.id==='avoid')||options.find(o=>o.id==='continue')||options.find(o=>!o.combat);
    assert.ok(action,'The courier route has a reachable noncombat action');
    w=E.choose(d,w,action.id);w=E.restore(d,E.serialize(w));
  }
  assert.equal(w.run.status,'completed');
  return {E,d,w,raw:E.serialize(w),snapshots};
}
function start(a=boot()){
  const c=a.ctx;c.newGame();while(!c.state.introCompleted){c.revealIntroText();c.advanceGameIntro()}
  c.resumeStoryActivity();c.finishStoryPrelude();c.continueRefugeHelp();c.acceptStarterKit();return a;
}
function unchangedGameplay(c){const s=copy(c.state);delete s.worldContinuity;return s}
function receive(a,raw){a.storage.set(a.ctx.WORLD_COURIER_KEY,raw);a.ctx.openActivityMenu();a.ctx.resumeStoryActivity();return a.ctx.worldMoralesFact()}

test('a real delivery crosses from courier receipts into the refuge without transferring money, bags or time',async()=>{
  const {raw,w}=await delivery(),a=start(),c=a.ctx,before=unchangedGameplay(c);
  const f=receive(a,raw);
  assert.equal(f.approach,'detour');assert.equal(f.receivedDay,1);assert.equal(f.receivedIndex,0);
  assert.deepEqual(unchangedGameplay(c),before);
  assert.equal(a.storage.get(c.WORLD_COURIER_KEY),raw);
  assert.equal(JSON.parse(raw).credits,w.credits);
  assert.match(a.nodes.get('traderDialogue').textContent,/Rocío, Tomás y Bruno/);
  assert.equal(a.nodes.get('worldNewsEntry').classList.contains('hidden'),false);
  for(let i=0;i<3;i++){c.openActivityMenu();c.resumeStoryActivity();assert.equal(c.syncWorldContinuity(),false)}
  assert.deepEqual(unchangedGameplay(c),before);
});

test('accepting, travelling, abandoning or failing the assignment cannot create a world fact',async()=>{
  const {E,d,snapshots}=await delivery(),a=start(),c=a.ctx;
  for(const raw of snapshots){a.storage.set(c.WORLD_COURIER_KEY,raw);assert.equal(c.syncWorldContinuity(),false)}
  let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:2130}),'morales-01'),'morales-01');
  a.storage.set(c.WORLD_COURIER_KEY,E.serialize(E.abandon(d,w)));assert.equal(c.syncWorldContinuity(),false);
  w.run.status='failed';w.run.condition=0;a.storage.set(c.WORLD_COURIER_KEY,E.serialize(w));assert.equal(c.syncWorldContinuity(),false);
  assert.equal(c.worldMoralesFact(),null);
});

test('only a durable, final production receipt is imported; broken or foreign storage is untouched',async()=>{
  const {w}=await delivery();
  const variants=[null,'broken JSON',{version:3}, {...w,mode:'laboratory'}, {...w,schema:99}, {...w,contentVersion:'future'}, {...w,paid:[]}, {...w,effects:[]}, {...w,completed:{}}];
  for(const change of [{provisional:true},{amount:-1},{recipient:'Other refuge'},{minutes:'5'},{combats:null}]){const bad=copy(w);Object.assign(bad.completed['morales-01'],change);variants.push(bad)}
  for(const variant of variants){const a=start(),c=a.ctx,raw=typeof variant==='string'?variant:JSON.stringify(variant),before=JSON.stringify(c.state);a.storage.set(c.WORLD_COURIER_KEY,raw);assert.equal(c.syncWorldContinuity(),false);assert.equal(JSON.stringify(c.state),before);assert.equal(a.storage.get(c.WORLD_COURIER_KEY),raw)}
  const a=start();a.ctx.localStorage.getItem=()=>{throw Error('Storage unavailable')};assert.equal(a.ctx.syncWorldContinuity(),false);
});

test('detour and observation keep their distinct evidence, dialogue and one-departure benefits',async()=>{
  for(const [choice,approach,reduction,word]of [['trace','detour',6,'desvío'],['observe','watch',4,'patrón']]){
    const {raw}=await delivery(choice),a=start(),c=a.ctx;receive(a,raw);const before=unchangedGameplay(c);
    assert.equal(c.worldMoralesFact().approach,approach);assert.equal(c.openWorldNews(),true);
    assert.match(a.nodes.get('worldNewsText').textContent,new RegExp(word));
    c.closeWorldNews();assert.deepEqual(unchangedGameplay(c),before);assert.equal(c.worldMoralesFact().prepared,false);
    c.openWorldNews();assert.equal(c.prepareWorldDeparture(),true);assert.equal(c.prepareWorldDeparture(),false);
    assert.deepEqual(unchangedGameplay(c),before);c.closeWorldNews();c.showLogisticsBriefing();
    assert.match(a.nodes.get('logisticsWarning').textContent,new RegExp(String(reduction)));
    assert.equal(c.confirmLeaveRefuge(),true);assert.equal(c.state.threat,before.threat-reduction);
    assert.equal(c.worldMoralesFact().used,true);assert.equal(c.worldMoralesFact().threatReduced,reduction);
    assert.equal(c.confirmLeaveRefuge(),false);assert.equal(c.state.threat,before.threat-reduction);
    assert.equal(c.state.factionPoints,before.factionPoints);assert.equal(c.state.credits,before.credits);
  }
});

test('cancelled or invalid departures keep the plan; the actual reduction respects the threat floor',async()=>{
  const {raw}=await delivery(),a=start(),c=a.ctx;receive(a,raw);c.openWorldNews();c.prepareWorldDeparture();c.closeWorldNews();
  c.leaveRefuge();c.closeLogisticsBriefing();assert.equal(c.worldMoralesFact().used,false);
  c.state.morale=0;assert.equal(c.confirmLeaveRefuge(),false);assert.equal(c.worldMoralesFact().prepared,true);
  c.state.morale=64;c.state.threat=2;assert.equal(c.confirmLeaveRefuge(),true);assert.equal(c.state.threat,0);
  assert.equal(c.worldMoralesFact().threatReduced,2);
});

test('prepared and used plans survive reload, revisits and a courier-only reset without another grant',async()=>{
  const {raw}=await delivery(),a=start();receive(a,raw);a.ctx.openWorldNews();a.ctx.prepareWorldDeparture();a.ctx.closeWorldNews();
  const b=boot(a.storage),c=b.ctx;c.continueGame();assert.equal(c.worldMoralesFact().prepared,true);
  const before=c.state.threat;c.confirmLeaveRefuge();assert.equal(c.state.threat,before-6);
  const saved=boot(a.storage);saved.ctx.continueGame();assert.equal(saved.ctx.worldMoralesFact().used,true);
  saved.storage.delete(c.WORLD_COURIER_KEY);saved.ctx.openRefuge('fled');
  assert.equal(saved.ctx.worldMoralesFact().used,true);saved.ctx.closeRefugeHelp(false);
  saved.ctx.openWorldNews();assert.equal(saved.ctx.prepareWorldDeparture(),false);saved.ctx.closeWorldNews();
  saved.ctx.confirmLeaveRefuge();assert.equal(saved.ctx.state.threat,before-6);
  const another=await delivery('observe');saved.storage.set(c.WORLD_COURIER_KEY,another.raw);saved.ctx.openRefuge('fled');
  assert.equal(saved.ctx.worldMoralesFact().approach,'detour');assert.equal(saved.ctx.worldMoralesFact().used,true);
  assert.equal(saved.ctx.state.threat,before-6);
});

test('a full New game removes the report and closes its UI; an old button cannot prepare the new run',async()=>{
  const {raw}=await delivery(),a=start(),c=a.ctx;receive(a,raw);c.openWorldNews();c.prepareWorldDeparture();c.newGame();
  assert.equal(c.worldMoralesFact(),null);assert.equal(c.worldNewsOpen,false);assert.equal(c.prepareWorldDeparture(),false);
  assert.equal(a.nodes.get('worldNewsModal').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('refuge').getAttribute('inert'),undefined);
  assert.equal(a.storage.has(c.WORLD_COURIER_KEY),false);assert.equal(c.state.threat,18);
});

test('old saves migrate without replaying history; a late report records when this expedition receives it',async()=>{
  const {raw}=await delivery(),a=start();a.ctx.state.index=12;a.ctx.save();
  const old=JSON.parse(a.storage.get(a.ctx.KEY));delete old.worldContinuity;a.storage.set(a.ctx.KEY,JSON.stringify(old));
  const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.worldMoralesFact(),null);
  const history=JSON.stringify(b.ctx.state.history);receive(b,raw);
  assert.equal(b.ctx.worldMoralesFact().receivedIndex,12);assert.equal(b.ctx.worldMoralesFact().receivedDay,2);
  assert.equal(JSON.stringify(b.ctx.state.history),history);
});

test('a receipt without observations is acknowledged without inventing a detour or granting a plan',async()=>{
  const {w}=await delivery();delete w.completed['morales-01'].flags;
  const a=start(),c=a.ctx;receive(a,JSON.stringify(w));assert.equal(c.worldMoralesFact().approach,'summary');
  c.openWorldNews();assert.match(a.nodes.get('worldNewsText').textContent,/no están en la copia/);
  assert.equal(c.prepareWorldDeparture(),false);assert.equal(c.worldMoralesFact().prepared,false);
});

test('the title screen, an unresolved encounter and a completed campaign cannot grant a departure benefit',async()=>{
  const {raw}=await delivery(),a=boot(),c=a.ctx;a.storage.set(c.WORLD_COURIER_KEY,raw);
  assert.equal(c.syncWorldContinuity(),false);start(a);a.storage.set(c.WORLD_COURIER_KEY,raw);
  c.encounterSaveLocked=true;assert.equal(c.syncWorldContinuity(),false);c.encounterSaveLocked=false;
  c.battleState={};assert.equal(c.syncWorldContinuity(),false);c.battleState=null;
  c.syncWorldContinuity();c.state.finished=true;c.openWorldNews();assert.equal(c.prepareWorldDeparture(),false);
  assert.equal(c.useWorldDeparture(),'');
});

test('the report traps focus, blocks expedition shortcuts and returns to its button on Escape',async()=>{
  const {raw}=await delivery(),{document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  let focused;Object.defineProperty(document,'activeElement',{get:()=>focused});
  window.HTMLElement.prototype.focus=function(){focused=this};window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
  const a=start(boot(new Map(),{document})),c=a.ctx;receive(a,raw);document.getElementById('worldNewsButton').click();
  assert.equal(c.worldNewsOpen,true);assert.equal(document.getElementById('refuge').hasAttribute('inert'),true);
  const before=JSON.stringify(c.state);
  for(const key of ['1','2','3']){const event=new window.Event('keydown');Object.defineProperty(event,'key',{value:key});document.dispatchEvent(event)}
  assert.equal(JSON.stringify(c.state),before);
  c.worldNewsKeydown({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(focused.id,'worldNewsPrepare');
  c.worldNewsKeydown({key:'Tab',preventDefault(){}});assert.equal(focused.id,'worldNewsReading');
  c.prepareWorldDeparture();assert.equal(focused.id,'worldNewsClose');c.worldNewsKeydown({key:'Tab',preventDefault(){}});assert.equal(focused.id,'worldNewsReading');
  c.worldNewsKeydown({key:'Escape',preventDefault(){}});assert.equal(focused.id,'worldNewsButton');assert.equal(document.getElementById('refuge').hasAttribute('inert'),false);
});
