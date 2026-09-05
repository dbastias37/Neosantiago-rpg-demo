const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {boot, root} = require('./runtime-harness.cjs');
function session() {
  const a = boot();
  a.ctx.gameSessionActive = true;
  a.ctx.state.introCompleted = true;
  for (const node of a.nodes.values()) node.classList.add('hidden');
  return a;
}
const json = value => JSON.parse(JSON.stringify(value));
function routeOptions(c) {
  c.revealRouteNarrativeText();
  while(c.routeNarrativeState.lineIndex < c.routeNarrativeState.lines.length-1) {
    c.advanceRouteNarrative(); c.revealRouteNarrativeText();
  }
}
test('opening/closing the title screen cannot overwrite an existing expedition', () => {
  const a = session(); a.ctx.state.index = 12; a.ctx.save();
  const before = a.storage.get(a.ctx.KEY), b = boot(a.storage);
  b.ctx.save();
  b.ctx.document.hidden = true;
  b.listeners.visibilitychange.forEach(fn => fn());
  assert.equal(b.storage.get(b.ctx.KEY),before);
});
test('reload of an unfinished decision restores a coherent checkpoint', () => {
  const a = session(), c = a.ctx;
  c.save(); const checkpoint = a.storage.get(c.KEY), batteries = c.stockCount('battery');
  c.choose(0); assert.equal(c.stockCount('battery'), batteries+1); assert.ok(c.pending);
  c.save(); assert.equal(a.storage.get(c.KEY), checkpoint);
  const b = boot(a.storage); b.ctx.continueGame(); b.ctx.choose(0);
  assert.equal(b.ctx.stockCount('battery'), batteries+1);
  b.ctx.advance();
  const saved = JSON.parse(a.storage.get(c.KEY));
  assert.equal(saved.index,1); assert.equal(saved.flags.choseBattery,true);
  assert.equal(saved.history.length,1);
});
test('combat damage and loot cannot be saved without their unresolved encounter', () => {
  const a = session(), c = a.ctx; c.state.index = 2; c.save();
  const checkpoint = a.storage.get(c.KEY);
  const ev = c.eventDisplay(c.events[2],2), i = ev.choices.findIndex(o=>o.combat&&!c.reason(o));
  assert.ok(i>=0); c.choose(i); assert.ok(c.battleState);
  c.state.party[0].hp--; c.placePartyItem('scrap',1); c.save();
  assert.equal(a.storage.get(c.KEY),checkpoint);
  c.loseCombat(true);
  assert.equal(JSON.parse(a.storage.get(c.KEY)).refuge.active,true);
  assert.equal(c.encounterSaveLocked,false);
});
test('terminal NPC answers cannot be reopened to collect incompatible consequences', () => {
  const a = session(), c = a.ctx;
  c.openNpcDialogue(c.branchDialogueDefs.rosaWater); c.setNpcDialogueNode('route');
  c.npcDialogueState.lineIndex=c.npcDialogueState.lines.length-1; c.revealNpcDialogueText();
  c.selectNpcDialogueChoice(1);
  const before=JSON.stringify(c.state);
  c.advanceNpcDialogueText(); c.selectNpcDialogueChoice(2);
  assert.equal(JSON.stringify(c.state),before);
  assert.equal(c.state.flags.rosaEscortAccepted,true);
  assert.equal(c.state.flags.erasedRosaMarks,undefined);
  assert.equal(a.nodes.get('npcDialogueChoices').classList.contains('hidden'),true);
});
test('NPC node transitions still permit the next answer', () => {
  const c=session().ctx; c.openNpcDialogue(c.branchDialogueDefs.rosaWater);
  c.npcDialogueState.lineIndex=c.npcDialogueState.lines.length-1; c.revealNpcDialogueText();
  c.selectNpcDialogueChoice(0);
  assert.equal(c.npcDialogueState.selected,false);
  c.revealNpcDialogueText(); c.npcDialogueState.lineIndex=c.npcDialogueState.lines.length-1;
  c.selectNpcDialogueChoice(0); assert.ok(c.state.flags.rosaTaughtDoorMark);
});
test('drawer and input controls consume no narrative choice through number shortcuts', () => {
  const a=session(), c=a.ctx; c.openPanel('inventory');
  const before=JSON.stringify(c.state);
  a.listeners.keydown.forEach(fn=>fn({key:'1',preventDefault(){}}));
  assert.equal(JSON.stringify(c.state),before);
  c.closePanel();
  a.listeners.keydown.forEach(fn=>fn({key:'1',target:{tagName:'INPUT'},preventDefault(){}}));
  assert.equal(JSON.stringify(c.state),before);
  a.listeners.keydown.forEach(fn=>fn({key:'1',target:{tagName:'BODY'},preventDefault(){}}));
  assert.ok(c.pending);
});
test('all routes have valid exits and combat victories; completed routes commit once', () => {
  const catalog=boot().ctx;
  assert.equal(catalog.events.length,27); assert.equal(Object.keys(catalog.routeNarrativeDefs).length,7);
  for(const [id,def] of Object.entries(catalog.routeNarrativeDefs)) {
    for(const [index,scene] of def.scenes.entries()) {
      assert.ok(fs.existsSync(root+'/'+scene.image));
      for(const opt of scene.options) {
        if(!opt.end) assert.ok(def.scenes[opt.nextScene??index+1],id);
        if(opt.combat) assert.ok(opt.victory,id);
      }
    }
    const a=session(), c=a.ctx; c.choose(0);
    const checkpoint=a.storage.get(c.KEY); c.openRouteNarrative(id,0);
    let steps=0;
    while(c.routeNarrativeState&&!c.routeNarrativeState.finished&&steps++<10) {
      routeOptions(c);
      const scene=c.currentRouteNarrativeScene();
      const choice=scene.options.findIndex(o=>!o.combat&&!c.reason(o));
      assert.ok(choice>=0,id); c.selectRouteNarrativeChoice(choice);
      assert.equal(a.storage.get(c.KEY),checkpoint,id);
    }
    assert.ok(c.routeNarrativeState.finished,id);
    c.finishRouteNarrative();
    assert.equal(JSON.parse(a.storage.get(c.KEY)).index,1,id);
    assert.equal(c.encounterSaveLocked,false,id);
  }
});
test('a route reaching zero morale returns to refuge at its existing exit', () => {
  const a=session(),c=a.ctx; c.choose(0); c.openRouteNarrative('rosaIaraRoute',2);
  c.state.morale=0; c.finishRouteNarrative();
  assert.equal(c.state.refuge.active,true); assert.equal(c.state.refuge.reason,'morale');
});
test('confirmed signal alarms survive reload without double-counting', () => {
  const a=session(),c=a.ctx; c.openSignalHack('manual'); c.startSignalChallenge();
  for(let i=0;i<3;i++)c.signalInput(Object.keys(c.signalArrows).find(k=>k!==c.signalGameState.sequence[c.signalGameState.input]));
  assert.equal(c.signalGameState.screen,'failed'); assert.equal(c.state.stats.signalAlarms,1);
  const b=boot(a.storage); b.ctx.continueGame();
  assert.ok(b.ctx.battleState.choice._signalTracking);
  assert.equal(b.ctx.state.stats.signalAlarms,1); assert.equal(b.ctx.state.stats.trackingCombats,1);
  b.ctx.save(); const d=boot(a.storage); d.ctx.continueGame();
  assert.equal(d.ctx.state.stats.signalAlarms,1); assert.equal(d.ctx.state.stats.trackingCombats,1);
  d.ctx.winCombat();
  assert.equal(JSON.parse(a.storage.get(c.KEY)).inhibitor.pendingContact,null);
});
test('exposed movement contact survives reload and clears on retreat', () => {
  const a=session(),c=a.ctx; c.state.threat=61; c.registerExposedMovement();
  const b=boot(a.storage); b.ctx.continueGame();
  assert.ok(b.ctx.battleState); assert.equal(b.ctx.state.stats.signalAlarms,1);
  b.ctx.loseCombat(true);
  const saved=JSON.parse(a.storage.get(c.KEY));
  assert.equal(saved.inhibitor.pendingContact,null); assert.equal(saved.refuge.active,true);
});
test('signal clock pauses in reading, inventory, refuge and combat', () => {
  const a=session(),c=a.ctx; c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=10000;
  assert.equal(c.signalPauseActive(),false);
  for(const id of ['npcDialogueModal','routeNarrativeModal','archiveModal','profileModal','drawer']) {
    a.nodes.get(id).classList.remove('hidden');assert.equal(c.signalPauseActive(),true,id);
    a.nodes.get(id).classList.add('hidden');
  }
  c.state.refuge.active=true;assert.equal(c.signalPauseActive(),true);c.state.refuge.active=false;
  c.battleState={};assert.equal(c.signalPauseActive(),true);
});
test('a delayed loot callback cannot mutate a later battle', () => {
  const a=session(),c=a.ctx;
  const config={title:'test',brief:'',enemies:['drone']}, choice={title:'test'};
  c.startCombat(config,choice); c.beginLootPhase();c.battleState.looter=0;
  c.beginLoot(0);
  const callback=[...a.timers.values()].find(t=>!t.interval&&t.ms===2300).fn;
  c.newGame();c.startCombat(config,choice);c.beginLootPhase();
  const before=JSON.stringify(c.battleState), seed=c.state.seed;
  callback();assert.equal(JSON.stringify(c.battleState),before);assert.equal(c.state.seed,seed);
});
test('disassembly consumes one unit of a loot stack, matching backpack disassembly', () => {
  const c=session().ctx;
  c.battleState={enemies:[{loot:[{id:'electronics',qty:2,status:'pending'}]}]};
  const s={source:{type:'loot',enemyIndex:0,dropIndex:0,id:'electronics'},success:true};
  assert.equal(c.consumeDisassemblySource(s),true);
  assert.equal(c.battleState.enemies[0].loot[0].qty,1);
  assert.equal(c.battleState.enemies[0].loot[0].status,'pending');
  c.consumeDisassemblySource(s);assert.equal(c.battleState.enemies[0].loot[0].status,'disassembled');
  assert.equal(c.consumeDisassemblySource(s),false);
});
test('inventory capacity, crafting costs and unavailable combat items remain enforced', () => {
  const c=session().ctx,p=c.state.party[0];
  p.bag=[{id:'cloth',qty:c.bagCapacity(p)}];
  assert.equal(c.addToBag(p,'meds',1),false);
  assert.equal(c.transferBagItem(1,0,0,1),false);
  const before=c.stockCount('cloth');c.craftItem(0,'bandage');
  assert.equal(c.stockCount('cloth'),before-2);assert.equal(c.bagQty(p,'bandage'),1);
  assert.ok(c.bagUsed(p)<=c.bagCapacity(p));
  const snapshot=JSON.stringify(c.state);c.craftItem(0,'traumaKit');
  assert.equal(JSON.stringify(c.state),snapshot);
  assert.equal(c.combatItemUsable(p,'grenade',{mechanical:true}),false);
});
test('mission rewards remain unique across repeated evaluation', () => {
  const c=session().ctx;c.state.stats.signalSuccesses=2;c.checkMissions();
  const before=JSON.stringify(c.state);c.checkMissions();assert.equal(JSON.stringify(c.state),before);
});
test('invalid indices are rejected before rendering', () => {
  for(const index of [null,undefined,1.5,'2',-1,27]) {
    const a=boot();a.storage.set(a.ctx.KEY,JSON.stringify({...json(a.ctx.state),index}));
    assert.equal(a.ctx.load(),false,String(index));
  }
});
test('route combats apply entry and victory effects once and resume the right scene', () => {
  const catalog=boot().ctx;
  for(const [id,def] of Object.entries(catalog.routeNarrativeDefs))for(const [index,scene] of def.scenes.entries())for(const [i,opt] of scene.options.entries()) {
    if(!opt.combat)continue;
    const a=session(),c=a.ctx;c.choose(0);c.openRouteNarrative(id,index);routeOptions(c);
    c.state.threat=20;c.selectRouteNarrativeChoice(i);assert.ok(c.battleState,id);
    assert.equal(c.state.threat,20+(opt.fx?.threat||0),id);
    c.winCombat();
    assert.equal(c.state.threat,20+(opt.fx?.threat||0)+(opt.victory.fx?.threat||0),id);
    assert.equal(c.routeNarrativeState.id,id);
    assert.equal(c.routeNarrativeState.sceneIndex,opt.nextScene??index+1);
    assert.equal(c.encounterSaveLocked,true);
  }
});
test('a normal fight preserves ammunition accounting and HP bounds', () => {
  const a=session(),c=a.ctx;c.state.index=2;
  c.choose(c.eventDisplay(c.events[2],2).choices.findIndex(o=>o.combat&&!c.reason(o)));
  const ammunition=()=>c.state.party.reduce((n,p)=>n+['ammo9','ammo556','shell12'].reduce((m,id)=>m+c.bagQty(p,id),0),0);
  const before=ammunition();let turns=0;
  while(c.battleState?.phase==='combat'&&turns++<100) {
    c.combatAction('attack');
    for(let flush=0;flush<10;flush++) {
      const next=[...a.timers.entries()].find(([,t])=>!t.interval&&(t.ms===680||t.ms===160));
      if(!next)break;a.timers.delete(next[0]);next[1].fn();
    }
  }
  assert.ok(turns<100);assert.equal(before-ammunition(),c.state.stats.shots);
  assert.ok(c.state.stats.attacks>0);
  for(const p of c.state.party)assert.ok(p.hp>=0&&p.hp<=p.maxHp);
});
test('three correct signal sequences grant coverage once; stale transitions cannot enter a new game', () => {
  const a=session(),c=a.ctx;c.openSignalHack('manual');c.startSignalChallenge();
  for(let round=0;round<3;round++) {
    for(const key of [...c.signalGameState.sequence])c.signalInput(key);
    if(round<2) {
      const [id,t]=[...a.timers.entries()].find(([,t])=>!t.interval&&t.ms===360);
      a.timers.delete(id);t.fn();
    }
  }
  assert.equal(c.state.stats.signalSuccesses,1);assert.equal(c.state.inhibitor.remainingMs,270000);
  c.signalPrimaryAction();assert.equal(c.state.stats.signalSuccesses,1);
  c.openSignalHack('manual');c.startSignalChallenge();for(const key of [...c.signalGameState.sequence])c.signalInput(key);
  const stale=[...a.timers.values()].find(t=>!t.interval&&t.ms===360).fn;
  c.newGame();a.nodes.get('gameIntro').classList.add('hidden');c.openSignalHack('manual');c.startSignalChallenge();
  for(const key of [...c.signalGameState.sequence])c.signalInput(key);
  const current=JSON.stringify(c.signalGameState);stale();assert.equal(JSON.stringify(c.signalGameState),current);
});
test('day transition and all final choices commit their effects once', () => {
  const a=session(),c=a.ctx;c.state.index=8;c.encounterSaveLocked=true;
  c.pending={ending:null,returnToRefuge:null};c.continuePendingAdvance();
  assert.equal(c.state.index,9);assert.equal(c.state.stats.rests,1);
  const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.state.stats.rests,1);
  for(let i=0;i<3;i++) {
    const d=session(),s=d.ctx;s.state.index=26;
    const choice=s.eventDisplay(s.events[26],26).choices[i];
    if(choice.req)for(const [id,qty] of Object.entries(choice.req)) {
      if(id==='water')s.state.res.water=qty;else s.placePartyItem(id,qty);
    }
    for(const id of choice.reqAll||[])s.placePartyItem(id,1);
    if(choice.reqAny?.length)s.placePartyItem(choice.reqAny[0],1);
    assert.equal(s.reason(choice),'');s.choose(i);s.advance();
    for(let step=0;s.npcDialogueState&&step<10;step++) {
      s.npcDialogueState.lineIndex=s.npcDialogueState.lines.length-1;s.revealNpcDialogueText();
      if(s.npcDialogueState.selected||!s.npcDialogueState.options.length)s.closeNpcDialogueAndContinue();
      else s.selectNpcDialogueChoice(s.npcDialogueState.options.findIndex(o=>!o.combat&&!s.reason(o)));
    }
    assert.equal(s.state.finished,true);assert.equal(s.encounterSaveLocked,false);
    assert.equal(JSON.parse(d.storage.get(s.KEY)).ending,choice.ending);
  }
});
