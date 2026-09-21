const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
const visible=(a,id)=>!a.nodes.get(id).classList.contains('hidden');
function tick(a,ms){const item=[...a.timers].find(([,t])=>!t.interval&&t.ms===ms);assert.ok(item,'scheduled '+ms);a.timers.delete(item[0]);item[1].fn()}
function key(a,value){a.listeners.keydown.forEach(fn=>fn({key:value,preventDefault(){},stopImmediatePropagation(){}}))}
test('Iniciar plays the ordered opening and enters the story without restarting music',()=>{
 const a=boot(),c=a.ctx;c.enterTitleScreen();const music=c.audioLoopInstances['ambience-title'];
 assert.ok(music);assert.equal(visible(a,'cinematicIntro'),true);assert.equal(c.gameSessionActive,false);
 const count=c.cinematicTimers.length;c.enterTitleScreen();assert.equal(c.cinematicTimers.length,count);
 for(const [ms,id] of [[500,'cinematicLogo'],[4900,null],[7500,'cinematicCredit'],[10100,null],[11700,'cinematicTitle'],[17300,null]]){
  tick(a,ms);for(const card of ['cinematicLogo','cinematicCredit','cinematicTitle'])assert.equal(a.nodes.get(card).classList.contains('visible'),card===id);
 }
 tick(a,18900);assert.equal(visible(a,'gameIntro'),true);assert.equal(visible(a,'start'),false);assert.equal(c.state.introCompleted,false);
 assert.equal(c.audioLoopInstances['ambience-title'],music);tick(a,1500);assert.equal(visible(a,'cinematicIntro'),false);assert.equal(c.cinematicRunning,false);
});
test('keyboard starts music and skip cancels every pending cinematic stage',()=>{
 const a=boot();key(a,'Enter');assert.ok(a.ctx.audioLoopInstances['ambience-title']);const ids=Array.from(a.ctx.cinematicTimers);
 key(a,'Escape');assert.equal(visible(a,'gameIntro'),true);ids.forEach(id=>assert.equal(a.timers.has(id),false));
 key(a,'Escape');tick(a,1500);assert.equal(a.ctx.cinematicRunning,false);
});
test('opening preserves an existing save and offers Continue instead of resetting it',()=>{
 const a=boot();a.ctx.newGame();a.ctx.state.credits=27;a.ctx.save();const before=a.storage.get(a.ctx.KEY);
 const b=boot(a.storage);b.ctx.enterTitleScreen();tick(b,18900);tick(b,1500);
 assert.equal(visible(b,'start'),true);assert.equal(b.storage.get(b.ctx.KEY),before);assert.equal(b.ctx.gameSessionActive,false);
 b.ctx.continueGame();assert.equal(b.ctx.state.credits,27);assert.equal(visible(b,'gameIntro'),true);
});
