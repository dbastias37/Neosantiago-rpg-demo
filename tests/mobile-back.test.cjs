const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');
const source=fs.readFileSync(path.join(root,'mobile-back.js'),'utf8');

function session(intro=false){
  const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  Object.defineProperty(document,'activeElement',{configurable:true,writable:true,value:null});
  window.HTMLElement.prototype.focus=function(){document.activeElement=this};
  window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return 800}});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{configurable:true,get(){return 700}});
  const a=boot(new Map(),{document}),c=a.ctx;
  // linkedom has no layout engine; model the page's stacking levels explicitly.
  const z={titleScreen:90,drawer:55,worldLoreModal:72,signalWarningModal:73,signalModal:74,
    decisionModal:74,decisionOutcomeModal:75,disassemblyModal:76,npcDialogueModal:68,
    routeNarrativeModal:69,gameHelpModal:170,refugeHelpModal:170,itemDetailModal:220};
  c.getComputedStyle=node=>({zIndex:String(z[node.id]||50)});
  c.newGame();
  if(!intro){while(!c.state.introCompleted){c.revealIntroText();c.advanceGameIntro()}c.continueRefugeHelp();c.acceptStarterKit()}
  const windowEvents={};c.addEventListener=(type,fn)=>(windowEvents[type] ||= []).push(fn);
  const emit=(type,event={})=>(windowEvents[type]||[]).forEach(fn=>fn(event));
  let cursor=1;
  const url='https://game.example/neosantiago-demo.html?campaign=demo#play';
  const entries=[{url:'https://previous.example/',state:null},{url,state:{campaign:'demo'}}];
  c.history={
    get state(){return entries[cursor].state},get length(){return entries.length},
    replaceState(state,title,next){entries[cursor]={state,url:next||entries[cursor].url}},
    pushState(state,title,next){const current=entries[cursor].url;entries.splice(++cursor);entries.push({state,url:next||current})},
    back(){if(cursor>0){cursor--;emit('popstate',{state:entries[cursor].state})}}
  };
  a.run('window.NeoBackNavigation=null');a.run(source);
  const click=node=>node.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));
  return Object.assign(a,{document,window,emit,click,entries,url:()=>entries[cursor].url,
    shown:id=>!document.getElementById(id).classList.contains('hidden'),
    arm:()=>click(document.body),back:()=>c.history.back()});
}
function expedition(a){a.ctx.state.refuge.active=false;a.document.getElementById('refuge').classList.add('hidden')}
function combat(a,enemies=['drone']){
  expedition(a);a.ctx.startCombat({title:'Prueba de regreso',enemies,canFlee:true},{label:'Prueba',_decisionChanges:[]});
}

test('Back is armed by interaction, reuses one guard and never reaches the previous site',()=>{
  const a=session(),c=a.ctx;
  assert.equal(c.history.length,2);a.emit('pageshow');assert.equal(c.history.length,2);
  a.arm();assert.equal(c.history.length,3);assert.equal(c.history.state.campaign,'demo');
  const before=JSON.stringify(c.state);
  for(let i=0;i<30;i++){a.back();a.arm();a.emit('pageshow',{persisted:true})}
  assert.equal(c.history.length,3);assert.equal(c.history.state.__neoGameBackV1,'guard');
  assert.equal(a.url(),'https://game.example/neosantiago-demo.html?campaign=demo#play');
  assert.equal(a.shown('refuge'),true);assert.equal(JSON.stringify(c.state),before);
  // Reloading the module in a fresh document reuses its existing guard.
  a.run('window.NeoBackNavigation=null');a.run(source);a.emit('pageshow');a.arm();assert.equal(c.history.length,3);
});

test('Back closes item details, then the backpack, then stays at the refuge',()=>{
  const a=session(),c=a.ctx,d=a.document;a.arm();c.openProfile(0);
  const picture=d.querySelector('#profileContent [data-item-detail][role="button"]');
  a.click(picture);assert.equal(a.shown('itemDetailModal'),true);
  const before=JSON.stringify(c.state);a.back();
  assert.equal(a.shown('itemDetailModal'),false);assert.equal(c.itemDetailState,null);
  assert.equal(a.shown('profileModal'),true);assert.equal(d.getElementById('profileModal').hasAttribute('inert'),false);
  assert.equal(d.activeElement,picture);a.back();assert.equal(a.shown('profileModal'),false);
  a.back();assert.equal(a.shown('refuge'),true);assert.equal(JSON.stringify(c.state),before);
  expedition(a);c.openProfile(0);a.back();assert.equal(a.shown('profileModal'),false);
  a.back();assert.equal(c.state.refuge.active,false);assert.equal(c.history.length,3);
});

test('Back cancels rest help, transfers and discards without spending or losing anything',()=>{
  const a=session(),c=a.ctx;a.arm();const before=JSON.stringify(c.state);
  c.openRefugeHelp('rest');a.back();assert.equal(a.shown('refugeHelpModal'),false);
  assert.equal(c.refugeHelpTopic,null);assert.equal(a.document.getElementById('refuge').hasAttribute('inert'),false);
  c.openProfile(0);c.openTransferModal(0,0);a.back();assert.equal(c.transferDraft,null);
  assert.equal(a.shown('profileModal'),true);c.openDiscardModal(0,0);a.back();
  assert.equal(c.discardDraft,null);assert.equal(a.shown('profileModal'),true);
  assert.equal(JSON.stringify(c.state),before);
});

test('intro help closes first, then Back goes to the previous intro page without skipping preparation',()=>{
  const a=session(true),c=a.ctx;a.arm();c.showGameIntro(2);c.openGameHelp();a.back();
  assert.equal(a.shown('gameHelpModal'),false);assert.equal(c.introStep,2);
  a.back();assert.equal(c.introStep,1);a.back();assert.equal(c.introStep,0);
  a.back();assert.equal(c.introStep,0);assert.equal(c.state.introCompleted,false);
  assert.equal(a.shown('gameIntro'),true);
});

test('required scenes and pending decisions block Back; an unstarted decision can be cancelled',()=>{
  const a=session(),c=a.ctx,d=a.document;a.arm();expedition(a);
  c.decisionState={phase:'ready',opener:d.body};d.getElementById('decisionModal').classList.remove('hidden');
  a.back();assert.equal(c.decisionState,null);assert.equal(a.shown('decisionModal'),false);
  for(const id of ['decisionModal','decisionOutcomeModal','npcDialogueModal','routeNarrativeModal','signalWarningModal','result','night','final','summary','titleScreen']){
    c.decisionState={phase:'resolving'};d.getElementById(id).classList.remove('hidden');
    const before=JSON.stringify(c.state);a.back();assert.equal(a.shown(id),true,id);
    assert.equal(c.decisionState.phase,'resolving');assert.equal(JSON.stringify(c.state),before);
    d.getElementById(id).classList.add('hidden');
  }
});

test('Back uses combat inventory close animation and never flees or ends the turn',()=>{
  const a=session(),c=a.ctx,d=a.document;a.arm();combat(a);
  const before=JSON.stringify(c.battleState),state=JSON.stringify(c.state);
  a.click(d.getElementById('itemsToggle'));assert.equal(a.shown('itemTray'),true);
  a.back();assert.equal(d.getElementById('itemTray').classList.contains('inventory-closing'),true);
  assert.equal(d.getElementById('itemsToggle').getAttribute('aria-expanded'),'false');
  a.back();for(const timer of a.timers.values())if(timer.ms===320)timer.fn();
  assert.equal(a.shown('itemTray'),false);a.back();assert.equal(a.shown('battle'),true);
  assert.equal(JSON.stringify(c.battleState),before);assert.equal(JSON.stringify(c.state),state);
});

test('Back preserves pending loot, which reopens without rerolling, even after closing another body',()=>{
  const a=session(),c=a.ctx,d=a.document;a.arm();combat(a,['drone','drone']);
  c.battleState.enemies.forEach(e=>{e.hp=0;e.looted=true;e.loot=[{id:'electronics',qty:1,status:'pending'}]});
  c.beginLootPhase();c.selectLooter(1);c.renderLootModal(0);
  const before=JSON.stringify(c.state),loot=c.battleState.enemies[0].loot;
  a.click(d.querySelector('#lootItems [role="button"]'));a.back();assert.equal(a.shown('lootModal'),true);
  a.back();assert.equal(a.shown('lootModal'),false);assert.equal(c.battleState.openLoot,null);
  assert.equal(loot[0].status,'pending');assert.equal(JSON.stringify(c.state),before);
  assert.match(d.getElementById('enemyUnits').textContent,/VER LOOT/);
  c.generateLoot=()=>{throw Error('Returning to loot must not generate new drops')};
  a.click(d.querySelector('#enemyUnits [data-loot-enemy="0"]'));
  assert.equal(a.shown('lootModal'),true);assert.equal(c.battleState.enemies[0].loot,loot);
  a.back();c.beginLoot(1);c.closeLootModal();
  assert.ok(c.battleState);assert.equal(loot[0].status,'pending');
  assert.equal(c.battleState.enemies[1].loot[0].status,'discarded');
  c.beginLoot(0);c.takeAllLoot();assert.equal(loot[0].status,'taken');
  c.closeLootModal();assert.equal(c.battleState,null);
});

test('Back does not choose exposure or cancel a signal challenge, but can preserve an existing signal',()=>{
  const a=session(),c=a.ctx;a.arm();expedition(a);
  c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=90000;c.openSignalHack('manual');
  const before=JSON.stringify(c.state);a.back();assert.equal(c.signalGameState,null);
  assert.equal(JSON.stringify(c.state),before);
  c.openSignalHack('manual');c.signalGameState.screen='game';a.back();assert.equal(a.shown('signalModal'),true);
  c.closeSignalHack(false);c.state.inhibitor.active=false;c.openSignalHack('departure');
  a.back();assert.equal(a.shown('signalModal'),true);assert.equal(c.signalGameState.source,'departure');
});

test('missing or denied History APIs leave the game functional',()=>{
  const a=boot();assert.equal(a.ctx.NeoBackNavigation.arm(),false);
  const b=session();b.ctx.history.pushState=()=>{throw Error('History denied by host')};
  assert.equal(b.ctx.NeoBackNavigation.arm(),false);assert.doesNotThrow(()=>b.arm());
  assert.equal(b.shown('refuge'),true);
});
