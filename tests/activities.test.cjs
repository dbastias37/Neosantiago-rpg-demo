const {connectedWorld}=require('./courier-fixtures.cjs');
const test=require('node:test'),assert=require('node:assert/strict');const {boot}=require('./runtime-harness.cjs');
function intro(c){c.newGame();while(!c.state.introCompleted){c.revealIntroText();c.advanceGameIntro()}}
test('the mission briefing precedes the supply handoff and starts only after the player continues',()=>{const a=boot(),c=a.ctx;intro(c);assert.equal(c.state.activity,'hub');assert.equal(c.state.refuge.active,false);assert.equal(c.state.starterKitGiven,false);assert.equal(c.activityVisible(),true);c.resumeStoryActivity();assert.equal(a.nodes.get('storyPrelude').classList.contains('hidden'),false);assert.equal(c.state.refuge.active,false);assert.equal(c.state.storyPreludeSeen,false);c.finishStoryPrelude();assert.equal(c.state.storyPreludeSeen,true);assert.equal(c.state.activity,'story');assert.equal(c.state.refuge.active,true);assert.equal(c.state.refuge.visits,1);});
test('courier mode pauses campaign signal and preserves campaign decisions, stats and inventory',()=>{const a=boot(),c=a.ctx;intro(c);c.resumeStoryActivity();c.finishStoryPrelude();c.acceptStarterKit();c.state.flags.keep='unchanged';c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=123456;const before=JSON.stringify({...c.state,activity:undefined});c.openActivityMenu();c.openCourierActivity();assert.equal(c.signalPauseActive(),true);c.signalGlobalTick();assert.equal(JSON.stringify({...c.state,activity:undefined}),before);assert.match(a.nodes.get('courierFrame').getAttribute('src'),/play.html/);c.returnToActivities();c.resumeStoryActivity();assert.equal(JSON.stringify({...c.state,activity:undefined}),before);});
test('reload opens the selected courier activity without consuming story resources',()=>{const a=boot();intro(a.ctx);a.ctx.openCourierActivity();const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.state.activity,'couriers');assert.equal(b.nodes.get('courierScreen').classList.contains('hidden'),false);assert.equal(b.ctx.state.starterKitGiven,false);assert.equal(b.ctx.state.refuge.visits,0);});
const courierKey='neosantiago.mensajeros.production.v1';
test('New game resets both saves and unloads the old courier session before reopening',()=>{
 const a=boot();intro(a.ctx);a.ctx.openCourierActivity();
 a.ctx.state.flags.oldDecision=true;a.ctx.save();
 a.storage.set(courierKey,'old courier progress');a.storage.set(courierKey+'.backup','old backup');
 a.storage.set('unrelated.preference','keep');
 const oldFrame=a.nodes.get('courierFrame');let audioActive=true;
 oldFrame.contentWindow={NeoCourierVisibility(active){audioActive=active},oldWorld:{credits:999}};
 a.nodes.get('newGame').listeners.click.forEach(fn=>fn());
 assert.equal(a.storage.has(courierKey),false);assert.equal(a.storage.has(courierKey+'.backup'),false);
 assert.equal(a.storage.get('unrelated.preference'),'keep');
 assert.equal(a.ctx.state.flags.oldDecision,undefined);
 assert.equal(JSON.parse(a.storage.get(a.ctx.KEY)).flags.oldDecision,undefined);
 assert.equal(a.ctx.activityVisible(),false);assert.equal(a.ctx.state.introCompleted,false);
 const frame=a.nodes.get('courierFrame');assert.notEqual(frame,oldFrame);
 assert.equal(frame.getAttribute('src'),undefined);assert.equal(frame.contentWindow,undefined);assert.equal(audioActive,false);
 while(!a.ctx.state.introCompleted){a.ctx.revealIntroText();a.ctx.advanceGameIntro()}
 a.ctx.openCourierActivity();assert.match(frame.getAttribute('src'),/play.html/);
 assert.equal(a.storage.has(courierKey),false);
});
test('Continue restores campaign and preserves an in-progress courier journey byte for byte',async()=>{
 const fs=require('node:fs'),E=await import('../extensions/mensajeros/production.mjs');
 const d=E.prepare(JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../extensions/mensajeros/production.json'))));
 let w=E.advance(d,E.start(d,connectedWorld(E,d,{seed:4}),'adasme-01'));
 w.credits=37;w.crew[0].xp=21;w.run.party[0].hp-=7;
 const courierSave=E.serialize(w),a=boot();intro(a.ctx);a.ctx.openCourierActivity();
 a.ctx.state.flags.oldDecision=true;a.ctx.save();a.storage.set(d.save_key,courierSave);
 a.storage.set(d.save_key+'.backup','previous courier backup');
 const b=boot(a.storage);b.nodes.get('continueGame').listeners.click.forEach(fn=>fn());
 assert.equal(b.ctx.state.flags.oldDecision,true);assert.equal(b.ctx.state.activity,'couriers');
 assert.equal(b.storage.get(d.save_key),courierSave);
 assert.deepEqual(E.restore(d,b.storage.get(d.save_key)),w);
 assert.equal(b.storage.get(d.save_key+'.backup'),'previous courier backup');
});
test('Continue never deletes progress when the campaign save is missing or unreadable',()=>{
 for(const saved of [undefined,'invalid JSON']){
  const a=boot();a.storage.set(courierKey,'courier progress');
  if(saved!==undefined)a.storage.set(a.ctx.KEY,saved);
  a.ctx.continueGame();
  assert.equal(a.storage.get(courierKey),'courier progress');assert.equal(a.storage.get(a.ctx.KEY),saved);
  assert.equal(a.ctx.gameSessionActive,false);
 }
});
test('a storage failure prevents a partial new campaign from being started',()=>{
 const a=boot();intro(a.ctx);a.ctx.state.flags.keep=true;a.ctx.save();
 a.storage.set(courierKey,'courier progress');
 const before=a.storage.get(a.ctx.KEY),frame=a.nodes.get('courierFrame');
 a.ctx.localStorage.removeItem=()=>{throw Error('Storage denied')};a.ctx.newGame();
 assert.equal(a.storage.get(a.ctx.KEY),before);assert.equal(a.storage.get(courierKey),'courier progress');
 assert.equal(a.nodes.get('courierFrame'),frame);assert.equal(a.ctx.state.flags.keep,true);
});
