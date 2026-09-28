const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');

function displayed(app,id){
  const index=app.ctx.events.findIndex(event=>event.id===id);
  return app.ctx.eventDisplay(app.ctx.events[index],index);
}

test('attributed lines leave narration for a named cue while a written message remains text',()=>{
  const app=boot(),story=app.nodes.get('eventText');
  assert.equal(story.children.filter(child=>child.className==='story-voice-cue').length,1);
  assert.equal(story.textContent.includes('Puedo entregarles'),false);
  assert.equal(app.ctx.sceneVoiceCollect(displayed(app,'d1-camp')).length,0);
  assert.match(displayed(app,'d1-camp').text,/«ellos recuperan sus núcleos»/);
  assert.deepEqual(Array.from(app.ctx.sceneVoiceCollect(displayed(app,'d1-council')),line=>line.speaker),['elder','elder']);
});

test('route, negotiation, clinic and Irene speech follows the displayed branch',()=>{
  const app=boot(),{ctx}=app;
  assert.deepEqual(Array.from(ctx.sceneVoiceCollect(displayed(app,'d2-vera')),line=>line.speaker),['sara','vera']);
  ctx.state.party[0].hp=0;
  assert.equal(ctx.sceneVoiceCollect(displayed(app,'d2-vera')).length,0);
  assert.equal(ctx.sceneVoiceCollect(displayed(app,'d2-republica')).length,0);
  ctx.state.party[0].hp=44;
  assert.equal(ctx.sceneVoiceCollect(displayed(app,'d2-republica')).length,2);
  ctx.state.flags.liraDead=true;
  assert.equal(ctx.sceneVoiceCollect(displayed(app,'d2-exposed-core')).length,0);
  assert.equal(ctx.sceneVoiceCollect(displayed(app,'d3-irene'))[0].speaker,'operator');
});

test('the modal shows exact Mara text, prevents a background decision and remembers it on replay',()=>{
  const app=boot(),{ctx,nodes}=app;
  ctx.gameSessionActive=true;ctx.state.introCompleted=true;
  nodes.get('titleScreen').classList.add('hidden');
  const cue=nodes.get('eventText').children.find(child=>child.className==='story-voice-cue');
  assert.equal(ctx.openSceneVoice(0,cue),true);
  assert.equal(nodes.get('sceneVoiceName').textContent,'Mara');
  assert.equal(nodes.get('sceneVoiceText').textContent,'Puedo entregarles una de estas dos cosas. Lo demás se queda en el puesto');
  assert.match(nodes.get('sceneVoicePortrait').src,/mara-trader\.webp/);
  const oldInventory=JSON.stringify(ctx.state.res);
  ctx.choose(0);
  assert.equal(JSON.stringify(ctx.state.res),oldInventory);
  ctx.playSceneVoice();
  assert.match(nodes.get('sceneVoiceStatus').textContent,/aún no está grabada/);
  ctx.closeSceneVoice();
  assert.equal(ctx.state.sceneVoiceSeen.VO_MARA_D1_SIGNAL_01,true);
  assert.equal(nodes.get('sceneVoiceModal').classList.contains('hidden'),true);
});

test('advance keeps the two council lines in order and closes after the last one',()=>{
  const app=boot(),{ctx,nodes}=app;
  ctx.gameSessionActive=true;ctx.state.introCompleted=true;
  nodes.get('titleScreen').classList.add('hidden');
  ctx.state.index=ctx.events.findIndex(event=>event.id==='d1-council');ctx.render();
  assert.equal(ctx.openSceneVoice(0),true);
  assert.equal(nodes.get('sceneVoiceCounter').textContent,'1 / 2');
  assert.equal(nodes.get('sceneVoiceName').textContent,'Varela');
  ctx.advanceSceneVoice();
  assert.equal(nodes.get('sceneVoiceText').textContent,'Necesitamos que sigan saliendo a cazar');
  assert.equal(nodes.get('sceneVoiceCounter').textContent,'2 / 2');
  ctx.advanceSceneVoice();
  assert.equal(nodes.get('sceneVoiceModal').classList.contains('hidden'),true);
});

test('real event cue opens the portrait modal and its close control returns to the event',()=>{
  const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{root}=require('./runtime-harness.cjs');
  const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  const app=boot(new Map(),{document}),{ctx}=app;
  ctx.gameSessionActive=true;ctx.state.introCompleted=true;
  for(const id of ['titleScreen','start','gameIntro'])document.getElementById(id).classList.add('hidden');
  const click=selector=>document.querySelector(selector).dispatchEvent(new window.Event('click',{bubbles:true}));
  click('#eventText .story-voice-cue');
  assert.equal(document.getElementById('sceneVoiceModal').classList.contains('hidden'),false);
  assert.equal(document.getElementById('sceneVoiceName').textContent,'Mara');
  assert.match(document.getElementById('sceneVoicePortrait').src,/mara-trader\.webp/);
  click('#sceneVoiceClose');
  assert.equal(document.getElementById('sceneVoiceModal').classList.contains('hidden'),true);
});
