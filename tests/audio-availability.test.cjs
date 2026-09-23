const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const policy=require('../audio-availability.js');
const catalog=require('../audio-catalog.js');
const {audit,catalogFor}=require('../scripts/audit-audio.cjs');
const routes=JSON.parse(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8').match(/<script id="audioRoutes"[^>]*>([\s\S]*?)<\/script>/)[1]);

test('audio audit includes every physical asset, known missing voice and courier map path',()=>{
  const report=audit();
  assert.deepEqual(catalogFor(report),catalog,'regenerate the audio audit when assets or paths change');
  assert.ok(report.assets.some(a=>a.path==='audio/lore/voice/hunter-mother.mp3'&&a.status==='missing'&&a.priority==='P1'));
  assert.ok(report.assets.find(a=>a.path==='audio/ui/click-metal.mp3').references.some(r=>r.source==='extensions/mensajeros/play.mjs'&&r.kind==='sound-call'));
  for(const file of catalog.existing)assert.ok(fs.statSync(path.join(root,file)).size>0,file);
  for(const file of catalog.missing)assert.ok(!fs.existsSync(path.join(root,file))||fs.statSync(path.join(root,file)).size===0,file);
});

test('known absent variants never reach Audio while available variations remain intact',()=>{
  const before=JSON.stringify(routes);
  const hits=policy.resolve('combat-hit-normal',routes,{},catalog);
  assert.equal(hits.length,4);
  assert.ok(hits.every(file=>catalog.existing.includes(file)));
  for(const event of Object.keys(routes)){
    assert.ok(policy.resolve(event,routes,{},catalog).every(file=>!catalog.missing.includes(file)),event);
  }
  assert.equal(JSON.stringify(routes),before,'resolution must not mutate approved route data');
});

test('same-purpose feedback fallback uses existing assets; voices, ambience, weapons and errors never become clicks',()=>{
  assert.deepEqual(policy.resolve('ui-close-panel',routes,{},catalog),['audio/archive/file-close.mp3']);
  assert.deepEqual(policy.resolve('loot-take-all',routes,{},catalog),policy.resolve('loot-take',routes,{},catalog));
  for(const name of ['combat-shot-rifle','combat-melee','hp-ally-down','ui-error','ambience-archive','unknown','voice-missing'])assert.deepEqual(policy.resolve(name,routes,{},catalog),[],name);
  assert.equal(policy.knownMissing('audio/lore/voice/hunter-mother.mp3?v=3',catalog),true);
});

test('future authorized paths are not blocked by a stale allowlist and network rejections are respected',()=>{
  const extra={'future-confirm':'audio/ui/future-confirm.mp3'};
  assert.deepEqual(policy.resolve('future-confirm',extra,{},catalog),['audio/ui/future-confirm.mp3']);
  assert.deepEqual(policy.resolve('future-confirm',extra,{'audio/ui/future-confirm.mp3':true},catalog),[]);
  assert.deepEqual(policy.resolve('ui-close-panel',routes,{'audio/archive/file-close.mp3':true},catalog),[]);
});

test('shared playback retries the next available variant after a network error without skipping it',()=>{
  const calls=[],players=[];
  const ctx={console,NeoAudioCatalog:catalog,Audio:function(file){calls.push(file);this.handlers={};this.addEventListener=(event,fn)=>{this.handlers[event]=fn;};this.play=()=>Promise.resolve();players.push(this);}};
  ctx.globalThis=ctx;vm.createContext(ctx);
  for(const file of ['audio-availability.js','combat-common.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
  ctx.audioRoutes={'combat-hit-normal':['audio/combat/hit-normal-1.mp3','audio/combat/hit-normal-2.mp3']};
  ctx.playSfx('combat-hit-normal');players[0].handlers.error();
  assert.deepEqual(calls,['audio/combat/hit-normal-1.mp3','audio/combat/hit-normal-2.mp3']);
  players[1].handlers.error();
  assert.equal(calls.length,2,'all failed assets stop retrying');
});

test('shared runtime playback only requests present assets for every declared event',()=>{
  const calls=[];
  const ctx={console,NeoAudioCatalog:catalog,Audio:function(file){calls.push(file);this.addEventListener=()=>{};this.play=()=>Promise.resolve();}};
  ctx.globalThis=ctx;vm.createContext(ctx);
  for(const file of ['audio-availability.js','combat-common.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
  ctx.audioRoutes=routes;
  for(const event of Object.keys(routes))ctx.playSfx(event);
  assert.ok(calls.length>40);
  assert.ok(calls.every(file=>catalog.existing.includes(file)));
});

test('missing voice keeps its transcript, suppresses the request and can return to an existing recording',()=>{
  const {boot}=require('./runtime-harness.cjs');
  const app=boot(),player=app.nodes.get('audioCluePlayer'),button=app.nodes.get('audioCluePlay');
  let plays=0;player.play=()=>{plays++;return Promise.resolve();};
  app.ctx.openAudioClue('signal-start');
  assert.match(player.src,/audio\/lore\/voice\/signal-start\.mp3/);
  assert.equal(button.disabled,false);
  app.ctx.openAudioClue('hunter-mother');
  assert.equal(player.src,undefined,'the previous recording is detached and missing voice is never requested');
  assert.equal(button.disabled,true);
  assert.match(app.nodes.get('audioClueTranscript').textContent,/segunda luz/);
  assert.match(app.nodes.get('audioClueStatus').textContent,/transcripción/);
  assert.equal(app.nodes.get('audioClueModal').classList.contains('hidden'),false);
  assert.equal(app.ctx.document.activeElement.id,'closeAudioClue');
  app.ctx.toggleAudioClue();assert.equal(plays,0);
  app.ctx.openAudioClue('signal-start');
  assert.equal(button.disabled,false);
  assert.match(player.src,/signal-start\.mp3/);
});
