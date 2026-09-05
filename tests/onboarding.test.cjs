const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {boot,root} = require('./runtime-harness.cjs');
function next(c){c.revealIntroText();c.advanceGameIntro()}
function reachMara(c){while(c.introStep<c.introPages.length-1)next(c)}

test('prologue and guide precede Mara, and her explanation precedes the shop',()=>{
  const a=boot(),c=a.ctx;c.newGame();
  for(let i=0;i<c.introPages.length;i++){
    assert.equal(c.introStep,i);assert.equal(c.state.refuge.active,false);
    assert.equal(a.nodes.get('refuge').classList.contains('hidden'),true);
    assert.equal(c.state.starterKitGiven,false);assert.equal(c.state.credits,0);
    assert.equal(a.nodes.get('introActions').classList.contains('ready'),false);
    if(i===3)assert.equal(a.nodes.get('introNext').textContent,'Comenzar');
    c.revealIntroText();assert.equal(a.nodes.get('introActions').classList.contains('ready'),true);
    c.advanceGameIntro();
  }
  assert.equal(c.state.refuge.active,true);assert.equal(c.state.introCompleted,true);
  assert.equal(c.state.refuge.visits,1);assert.equal(c.introTypeTimer,null);
  assert.equal(a.nodes.get('gameIntro').classList.contains('hidden'),true);
  c.advanceGameIntro();c.completeIntro();assert.equal(c.state.refuge.visits,1);
  c.acceptStarterKit();const supplies=JSON.stringify(c.state.party);const credit=c.state.credits;
  c.acceptStarterKit();assert.equal(JSON.stringify(c.state.party),supplies);assert.equal(c.state.credits,credit);
});
test('unfinished introduction resumes its page, completed saves resume the existing refuge',()=>{
  const a=boot(),c=a.ctx;c.newGame();reachMara(c);
  const b=boot(a.storage);b.ctx.continueGame();
  assert.equal(b.ctx.introStep,c.introPages.length-1);assert.equal(b.ctx.state.refuge.active,false);
  next(b.ctx);b.ctx.acceptStarterKit();const credits=b.ctx.state.credits;
  const d=boot(a.storage);d.ctx.continueGame();
  assert.equal(d.ctx.state.refuge.active,true);assert.equal(d.ctx.state.refuge.visits,1);
  assert.equal(d.ctx.state.credits,credits);assert.equal(d.ctx.state.starterKitGiven,true);
  assert.equal(d.nodes.get('gameIntro').classList.contains('hidden'),true);
});
test('legacy saves skip the prologue and invalid unfinished pages are bounded',()=>{
  const a=boot();a.ctx.newGame();
  let save=JSON.parse(a.storage.get(a.ctx.KEY));delete save.introPage;delete save.introCompleted;
  a.storage.set(a.ctx.KEY,JSON.stringify(save));const b=boot(a.storage);b.ctx.continueGame();
  assert.equal(b.ctx.state.introCompleted,true);assert.equal(b.nodes.get('gameIntro').classList.contains('hidden'),true);
  save.introCompleted=false;save.introPage=1000;a.storage.set(a.ctx.KEY,JSON.stringify(save));
  const d=boot(a.storage);d.ctx.continueGame();assert.equal(d.ctx.introStep,d.ctx.introPages.length-1);
});
test('typing pauses for hidden pages and lore; navigating and restarting cancel the previous interval',()=>{
  const a=boot(),c=a.ctx;c.newGame();const first=c.introTypeTimer;
  c.document.hidden=true;a.timers.get(first).fn();assert.equal(a.nodes.get('introText').textContent,'');
  c.document.hidden=false;c.openWorldLore(a.nodes.get('openWorldLore'));a.timers.get(first).fn();
  assert.equal(a.nodes.get('introText').textContent,'');c.closeWorldLore();
  a.timers.get(first).fn();assert.ok(a.nodes.get('introText').textContent.length>0);
  c.advanceGameIntro();assert.equal(c.introStep,0);assert.equal(a.timers.has(first),false);
  c.advanceGameIntro();const second=c.introTypeTimer;c.newGame();
  assert.equal(a.timers.has(second),false);assert.equal(c.introStep,0);
  const current=c.introTypeTimer;c.openRefuge('start');assert.equal(a.timers.has(current),false);
});
test('typing completes naturally and reduced motion exposes the same actions immediately',()=>{
  const a=boot(),c=a.ctx;c.newGame();
  for(let i=0;i<2000&&c.introTypeTimer;i++)a.timers.get(c.introTypeTimer).fn();
  assert.equal(c.introTypeTimer,null);assert.equal(a.nodes.get('introText').textContent,c.introPages[0].text);
  assert.equal(c.document.activeElement,a.nodes.get('introNext'));
  c.matchMedia=()=>({matches:true});c.showGameIntro(1);
  assert.equal(c.introTypeTimer,null);assert.equal(a.nodes.get('introText').textContent,c.introPages[1].text);
  assert.equal(a.nodes.get('introActions').classList.contains('ready'),true);
});
test('intro consumes expedition shortcuts and keeps tab navigation in the window',()=>{
  const a=boot(),c=a.ctx;c.newGame();
  const before=JSON.stringify(c.state);
  for(const key of ['1','2','3'])a.listeners.keydown.forEach(fn=>fn({key,target:a.nodes.get('introReveal'),preventDefault(){}}));
  assert.equal(JSON.stringify(c.state),before);
  a.nodes.get('openWorldLore').focus();let prevented=false;
  c.introKeydown({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(c.document.activeElement,a.nodes.get('introReading'));
});
test('simplified departure preserves readiness checks and starts only one signal tutorial',()=>{
  const a=boot(),c=a.ctx;c.newGame();reachMara(c);next(c);
  assert.equal(c.confirmLeaveRefuge(),false);c.acceptStarterKit();
  assert.equal(c.leaveRefuge(),true);assert.equal(a.nodes.get('logisticsModal').classList.contains('hidden'),false);
  c.state.morale=0;assert.equal(c.confirmLeaveRefuge(),false);assert.equal(c.state.refuge.active,true);
  c.state.morale=64;assert.equal(c.confirmLeaveRefuge(),true);assert.equal(c.confirmLeaveRefuge(),false);
  assert.equal(c.state.logisticsSeen,true);
  const starts=[...a.timers.values()].filter(t=>t.ms===260);assert.equal(starts.length,1);starts[0].fn();
  assert.equal(a.nodes.get('signalModal').classList.contains('hidden'),false);
});
test('prologue backgrounds and Mara portrait use existing assets',()=>{
  const a=boot();for(const page of a.ctx.introPages){
    if(page.speaker)assert.equal(page.image,'characters/mara-trader.webp');else assert.ok(page.image.startsWith('backgrounds/'));assert.ok(fs.existsSync(path.join(root,page.image)));
  }
});
test('help pauses typing, changes no run state and resumes at the same introduction page',()=>{
  const a=boot(),c=a.ctx;c.newGame();c.showGameIntro(2);
  const timer=c.introTypeTimer;a.timers.get(timer).fn();
  const text=a.nodes.get('introText').textContent,before=JSON.stringify(c.state);
  c.openGameHelp();assert.equal(a.nodes.get('gameHelpModal').classList.contains('hidden'),false);
  assert.equal(a.nodes.get('gameIntro').getAttribute('inert'),'');
  a.timers.get(timer).fn();assert.equal(a.nodes.get('introText').textContent,text);
  for(let i=0;i<c.gameHelpPages.length;i++)c.showGameHelpPage(i);
  assert.equal(JSON.stringify(c.state),before);assert.equal(c.introStep,2);
  let prevented=false;c.introKeydown({key:'Escape',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(c.document.activeElement,a.nodes.get('openGameHelp'));
  assert.equal(a.nodes.get('gameIntro').getAttribute('inert'),undefined);
  a.timers.get(timer).fn();assert.ok(a.nodes.get('introText').textContent.length>text.length);
});
test('help controls close the last page, block expedition shortcuts and reset on new game',()=>{
  const a=boot(),c=a.ctx;c.newGame();c.openGameHelp();
  const before=JSON.stringify(c.state);
  for(const key of ['1','2','3'])a.listeners.keydown.forEach(fn=>fn({key,preventDefault(){}}));
  assert.equal(JSON.stringify(c.state),before);
  a.nodes.get('gameHelpNext').focus();let prevented=false;
  c.introKeydown({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(c.document.activeElement,a.nodes.get('closeGameHelp'));
  c.showGameHelpPage(c.gameHelpPages.length-1);
  a.nodes.get('gameHelpNext').listeners.click.forEach(fn=>fn());
  assert.equal(a.nodes.get('gameHelpModal').classList.contains('hidden'),true);
  c.openGameHelp();c.newGame();
  assert.equal(a.nodes.get('gameHelpModal').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('gameIntro').getAttribute('inert'),undefined);
  assert.equal(c.introStep,0);
});
test('Mara has her own portrait and returning to the prologue restores the landscape image mode',()=>{
  const a=boot(),c=a.ctx;c.newGame();reachMara(c);
  assert.equal(a.nodes.get('introScene').classList.contains('is-speaker'),true);
  assert.ok(a.nodes.get('introImage').src.includes('characters/mara-trader.webp'));
  assert.equal(c.state.refuge.active,false);c.showGameIntro(0);
  assert.equal(a.nodes.get('introScene').classList.contains('is-speaker'),false);
  assert.ok(a.nodes.get('introImage').src.includes('backgrounds/day-alameda.webp'));
});
