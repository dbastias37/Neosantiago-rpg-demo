const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function session(){const a=boot();a.ctx.gameSessionActive=true;a.ctx.state.introCompleted=true;for(const n of a.nodes.values())n.classList.add('hidden');return a}
function prepare(id){
  const a=session(),c=a.ctx;
  if(id==='recoveredNames'){c.state.flags.vegaRouteCompleted=true;c.state.flags.identityRegistryDestroyed=true;c.state.flags.vegaErasedNamesCopied=true}
  let found;
  for(let index=0;index<c.events.length;index++){
    const ev=c.eventDisplay(c.events[index],index),i=ev.choices.findIndex(o=>o.decisionId===id);
    if(i>=0){found={index,i,choice:ev.choices[i]};break}
  }
  assert.ok(found,id);c.state.index=found.index;
  for(const [key,n]of Object.entries(found.choice.req||{}))c.placePartyItem(key,n);
  for(const key of found.choice.reqItems||[])if(!c.hasPartyItem(key))c.placePartyItem(key,1);
  assert.equal(c.reason(found.choice),'',id);a.choice=found.choice;a.choiceIndex=found.i;return a;
}
function settle(a,outcome){
  const c=a.ctx;c.choose(a.choiceIndex);assert.equal(c.decisionState.phase,'ready');
  const ch=c.decisionState.probability.chances;
  c.random=()=>outcome===0?0:outcome===1?(ch[0]+ch[1]/2)/100:.999999;
  c.resolveDecision();const token=c.decisionFinishTimer,t=a.timers.get(token);a.timers.delete(token);t.fn();
  assert.equal(c.decisionState.selected,outcome);
}
test('all 13 checks and the conditional Vega check have unique scene identities',()=>{
  const c=boot().ctx,ids=c.events.flatMap(e=>e.choices.filter(o=>o.roll).map(o=>o.decisionId));
  assert.equal(ids.length,13);assert.equal(new Set(ids).size,13);assert.equal(Object.keys(c.decisionScenes).length,14);
  for(const id of Object.keys(c.decisionScenes)){
    const a=prepare(id),scene=c.decisionScenes[id];assert.ok(scene.lead&&scene.quote&&scene.waiting);
    assert.ok(a.choice.roll.success&&a.choice.roll.fail);
    if(scene.alarm)for(const enemy of scene.alarm.enemies)assert.ok(c.enemyDefs[enemy],enemy);
  }
});
test('probabilities match displayed sectors for every mood combination and exclude exhausted allies',()=>{
  const c=prepare('credential').ctx;
  const psyche={estable:{},sereno:{stress:-2},empatico:{empathy:4},resuelto:{resolve:4},pragmatico:{pragmatism:4},tenso:{stress:4},culpa:{stress:4,empathy:3},rabia:{stress:4,resolve:3},frio:{pragmatism:4,empathy:-2}};
  const choice=c.events[14].choices[1],states=Object.keys(psyche);
  function setMood(p,key){p.psyche={stress:0,empathy:0,resolve:0,pragmatism:0,...psyche[key]}}
  for(const x of states)for(const y of states)for(const z of states){
    [x,y,z].forEach((key,i)=>setMood(c.state.party[i],key));const p=c.decisionProbability(choice);
    assert.equal(p.chances.reduce((a,b)=>a+b),100);assert.equal(p.base,45);
    assert.equal(p.chances[0],45+p.members.reduce((n,m)=>n+m.bonus,0));assert.ok(p.chances.every(n=>n>0));
  }
  c.state.party.forEach(p=>setMood(p,'sereno'));assert.equal(c.decisionProbability(choice).chances[0],60);
  c.state.party[0].hp=0;const p=c.decisionProbability(choice);assert.equal(p.chances[0],55);assert.equal(p.members[0].bonus,0);assert.equal(p.members[0].available,false);
  c.state.party[0].hp=10;setMood(c.state.party[0],'empatico');assert.equal(c.decisionProbability(choice).members[0].bonus,0);
  assert.equal(c.decisionProbability(c.events[1].choices[1]).members[0].bonus,5);
});
test('opening, returning and number shortcuts cannot charge costs or select behind the modal',()=>{
  const a=prepare('lure'),c=a.ctx,before=JSON.stringify(c.state);c.choose(a.choiceIndex);
  c.state.inhibitor.active=true;assert.equal(c.signalPauseActive(),true);c.state.inhibitor.active=false;
  a.listeners.keydown.forEach(fn=>fn({key:'1',preventDefault(){}}));c.choose(0);
  assert.equal(JSON.stringify(c.state),before);assert.equal(c.openSignalHack('manual'),false);
  c.closeDecision();assert.equal(c.decisionState,null);assert.equal(JSON.stringify(c.state),before);
});
test('each noncombat outcome applies only its own effects once and resumes existing progression',()=>{
  for(const id of Object.keys(boot().ctx.decisionScenes))for(const index of [0,1]){
    const a=prepare(id),c=a.ctx,out=index===0?a.choice.roll.success:a.choice.roll.fail;
    const beforeThreat=c.state.threat,beforeBattery=c.stockCount('battery'),beforeCore=c.hasPartyItem('droneCore');
    settle(a,index);assert.ok(c.pending,id);assert.equal(c.state.history.length,1,id);
    assert.equal(c.state.threat,Math.max(0,Math.min(100,beforeThreat+(out.fx?.threat||0))),id);
    if(out.fx?.battery)assert.equal(c.stockCount('battery'),beforeBattery+out.fx.battery,id);
    if(beforeCore&&out.remove?.includes('droneCore'))assert.equal(c.hasPartyItem('droneCore'),false,id);
    for(const [flag,value]of Object.entries(out.flags||{}))assert.equal(c.state.flags[flag],value,id);
    const game=c.decisionState,snapshot=JSON.stringify(c.state);c.revealDecision(game);c.resolveDecision();c.choose(0);
    assert.equal(JSON.stringify(c.state),snapshot,id);const original=c.state.index;c.continueDecision();assert.equal(c.decisionState,null);
    if(c.npcDialogueState)assert.equal(c.state.index,original,id);else assert.equal(c.state.index,original+1,id);
    const post=JSON.stringify(c.state);c.continueDecision();assert.equal(JSON.stringify(c.state),post,id);
  }
});
test('every alarm has real opponents, consumes resources once and retains its outcome through victory',()=>{
  for(const [id,scene]of Object.entries(boot().ctx.decisionScenes)){
    if(!scene.alarm)continue;const a=prepare(id),c=a.ctx,battery=c.stockCount('battery');settle(a,2);
    const applied=JSON.stringify(c.state),game=c.decisionState;c.revealDecision(game);assert.equal(JSON.stringify(c.state),applied,id);
    const paidBattery=c.stockCount('battery');assert.equal(paidBattery,battery+(a.choice.roll.fail.fx?.battery||0),id);
    c.continueDecision();assert.ok(c.battleState,id);assert.equal(c.battleState.enemies.length,scene.alarm.enemies.length,id);
    assert.equal(c.stockCount('battery'),paidBattery,id);assert.equal(c.encounterSaveLocked,true,id);
    c.winCombat();assert.equal(c.stockCount('battery'),paidBattery,id);assert.equal(c.state.history.length,1,id);assert.ok(c.pending,id);
    for(const [flag,value]of Object.entries(scene.alarm.winFlags||{}))assert.equal(c.state.flags[flag],value,id);
    if(id==='credential')assert.equal(c.state.flags.trackerCredential,undefined);
    const original=c.state.index;c.advance();assert.equal(c.state.index,original+1,id);assert.equal(c.encounterSaveLocked,false,id);
  }
});
test('an alarm retreat remains at the encounter and saves the actual cost only once',()=>{
  const a=prepare('lure'),c=a.ctx,before=c.stockCount('battery');settle(a,2);c.continueDecision();c.loseCombat(true);
  const saved=JSON.parse(a.storage.get(c.KEY));assert.equal(saved.refuge.active,true);assert.equal(saved.index,7);assert.equal(c.stockCount('battery'),before-1);assert.equal(saved.flags.pumpLost,true);
  const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.stockCount('battery'),before-1);assert.equal(b.ctx.state.refuge.active,true);
});
test('reloading an unresolved roulette restores its seed and prevents reward accumulation',()=>{
  const a=prepare('council'),c=a.ctx;c.state.seed=123;c.choose(a.choiceIndex);c.resolveDecision();
  const selected=c.decisionState.selected,checkpoint=a.storage.get(c.KEY),hunger=c.state.party[0].hunger;
  c.resolveDecision();assert.equal(c.state.party[0].hunger,hunger);c.save();assert.equal(a.storage.get(c.KEY),checkpoint);
  const b=boot(a.storage),d=b.ctx;d.continueGame();d.choose(a.choiceIndex);d.resolveDecision();assert.equal(d.decisionState.selected,selected);
  const t=b.timers.get(d.decisionFinishTimer);b.timers.delete(d.decisionFinishTimer);t.fn();d.save();assert.equal(a.storage.get(c.KEY),checkpoint);
  assert.equal(d.state.history.length,1);
});
test('stale animation callbacks cannot apply a result to a new game',()=>{
  const a=prepare('credential'),c=a.ctx;c.choose(a.choiceIndex);c.resolveDecision();
  const callback=a.timers.get(c.decisionFinishTimer).fn,spin=a.timers.get(c.decisionAnimationTimer).fn;
  c.newGame();const before=JSON.stringify(c.state);callback();spin();assert.equal(JSON.stringify(c.state),before);assert.equal(c.decisionState,null);
});
test('Tab recovers focus inside the modal after the resolving button becomes disabled',()=>{
  const a=prepare('council'),c=a.ctx;c.choose(a.choiceIndex);c.resolveDecision();
  let focused=false,prevented=false;
  const summary={getClientRects:()=>[{}],focus(){focused=true;c.document.activeElement=this}};
  a.nodes.get('decisionModal').querySelectorAll=()=>[summary];c.document.activeElement=c.document.body;
  c.decisionKeydown({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(focused,true);assert.equal(prevented,true);assert.equal(c.document.activeElement,summary);
});
test('reduced motion still resolves once and the wheel stops inside the selected sector',()=>{
  for(const reduced of [true,false])for(const index of [0,1,2]){
    const a=prepare('credential'),c=a.ctx;c.matchMedia=()=>({matches:reduced});settle(a,index);
    const g=c.decisionState,opt=g.options[index],landing=((360-g.target%360)%360+360)%360;
    assert.ok(landing>opt.start&&landing<opt.end);assert.equal(c.state.history.length,index===2?0:1);
    assert.equal(c.decisionFinishTimer,null);assert.equal(c.decisionAnimationTimer,null);
  }
});
test('the physical mishap is nonlethal and the old Vega replacements keep their own logic',()=>{
  const a=prepare('rails'),c=a.ctx;c.state.party[1].hp=3;settle(a,1);assert.equal(c.state.party[1].hp,1);assert.equal(c.state.stats.damageTaken,2);
  for(const flag of ['ortegaFinalAid','vegaAuthorizedProfilesCopied']){
    const b=session().ctx;b.state.flags[flag]=true;
    if(flag==='vegaAuthorizedProfilesCopied')b.state.flags.vegaRouteCompleted=true;
    const index=flag==='ortegaFinalAid'?23:22,ev=b.eventDisplay(b.events[index],index);
    const replaced=ev.choices.filter(o=>!o.roll);for(const choice of replaced)assert.equal(b.decisionScene(choice),null);
  }
});
test('results open in a dedicated window and the new button continues every outcome once',()=>{
  for(const index of [0,1,2]){
    const a=prepare('credential'),c=a.ctx;settle(a,index);
    assert.equal(a.nodes.get('decisionOutcomeModal').classList.contains('hidden'),false);
    assert.equal(a.nodes.get('decisionResolution').scrollTop,0);
    assert.equal(c.document.activeElement,a.nodes.get('decisionOutcomeContinue'));
    assert.equal(a.nodes.get('decisionModal').getAttribute('inert'),'');
    assert.equal(a.nodes.get('decisionModal').getAttribute('aria-hidden'),'true');
    assert.equal(c.signalPauseActive(),true);
    c.closeDecision();assert.ok(c.decisionState);
    const confirm=a.nodes.get('decisionOutcomeContinue').listeners.click;
    assert.equal(confirm.length,1);confirm[0]();
    assert.equal(a.nodes.get('decisionOutcomeModal').classList.contains('hidden'),true);
    assert.equal(a.nodes.get('decisionModal').getAttribute('inert'),undefined);
    assert.equal(a.nodes.get('decisionModal').getAttribute('aria-modal'),'true');
    const after=JSON.stringify(c.state);confirm[0]();assert.equal(JSON.stringify(c.state),after);
  }
});
test('resolved keyboard focus stays in the result window; restart removes both layers',()=>{
  const a=prepare('council'),c=a.ctx;settle(a,0);
  const button=a.nodes.get('decisionOutcomeContinue');button.getClientRects=()=>[{}];
  a.nodes.get('decisionOutcomeModal').querySelectorAll=()=>[button];
  a.nodes.get('decisionModal').querySelectorAll=()=>{throw Error('Focus must not return to the underlying wheel')};
  let prevented=false;c.document.activeElement=a.nodes.get('decisionConfirm');
  c.decisionKeydown({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(c.document.activeElement,button);
  c.newGame();assert.equal(c.decisionState,null);
  assert.equal(a.nodes.get('decisionOutcomeModal').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('decisionModal').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('decisionModal').getAttribute('aria-hidden'),undefined);
});
