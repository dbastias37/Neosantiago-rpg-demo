const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./runtime-harness.cjs');
function night(day=1){const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.starterKitGiven=true;c.state.activity='story';c.state.index=day===1?9:18;c.prepareNight(day);return a;}
function resources(c){return JSON.stringify({party:c.state.party,res:c.state.res,stats:c.state.stats,credits:c.state.credits,morale:c.state.morale,history:c.state.history});}
test('all six first-night responses persist once, cost nothing and produce distinct second-night memories',()=>{
 for(const id of ['sara','elias','noa'])for(const index of [0,1]){
  const a=night(),c=a.ctx,voice=c.companionVoices[id],answer=voice.choices[index],before=resources(c);
  assert.equal(c.answerNightCompanion(id,answer.id),true);assert.equal(resources(c),before);assert.equal(c.answerNightCompanion(id,voice.choices[1-index].id),false);
  const b=boot(a.storage),d=b.ctx;d.continueGame();assert.equal(d.pendingNight().conversations[id].choice,answer.id);assert.equal(d.pendingNight().conversations[id].reply,answer.reply);
  d.settleNight('share');d.continueAfterNight();d.state.index=18;d.prepareNight(2);assert.ok(d.companionConversation(id,d.pendingNight()).text.includes(answer.later));
  const after=resources(d);assert.equal(d.answerNightCompanion(id,'sostener'),true);assert.equal(resources(d),after);assert.equal(d.pendingNight().conversations[id].choice,'sostener');
 }
});
test('silence, exhaustion and old nights are handled without invented agreements or compulsory conversation',()=>{
 const a=night(),c=a.ctx;c.state.party[0].hp=0;assert.equal(c.answerNightCompanion('sara','compartir'),false);c.showNight();assert.match(a.nodes.get('nightPeople').innerHTML,/necesita atención/);
 c.settleNight('share');assert.equal(c.answerNightCompanion('sara','limites'),true);c.continueAfterNight();c.state.index=18;c.prepareNight(2);
 assert.match(c.companionConversation('elias',c.pendingNight()).text,/Anoche no hablaron/);c.state.flags.liraDead=true;assert.match(c.companionConversation('sara',c.pendingNight()).text,/Lo que pasó no cambia/);
 c.settleNight('share');c.continueAfterNight();assert.equal(c.answerNightCompanion('noa','sostener'),false);
 const raw=JSON.parse(a.storage.get(c.KEY));for(const n of Object.values(raw.expeditionRest.nights))delete n.conversations;a.storage.set(c.KEY,JSON.stringify(raw));const b=boot(a.storage);assert.equal(b.ctx.load(),true);assert.equal(Object.keys(b.ctx.restLedger().nights[1].conversations).length,0);
});
test('invalid conversation saves are rejected without replacing the saved file',()=>{
 for(const record of [{missing:{choice:'x',text:'',reply:'',label:''}},{sara:{choice:'sostener',text:'',reply:'',label:''}},{sara:{choice:'limites',text:1,reply:'',label:''}}]){
  const a=night(),c=a.ctx,raw=JSON.parse(a.storage.get(c.KEY));raw.expeditionRest.nights[1].conversations=record;const text=JSON.stringify(raw);a.storage.set(c.KEY,text);assert.equal(boot(a.storage).ctx.load(),false);assert.equal(a.storage.get(c.KEY),text);
 }
});
test('rendered companion buttons save the chosen reply, survive rerender and stay within the night focus loop',()=>{
 const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{root}=require('./runtime-harness.cjs');const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));let focused;Object.defineProperty(document,'activeElement',{get:()=>focused});window.HTMLElement.prototype.focus=function(){focused=this};
 const a=boot(new Map(),{document}),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.index=9;c.prepareNight(1);
 const click=s=>document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true}));click('[data-night-person="noa"]');assert.ok(document.querySelector('[data-night-reply="regreso"]'));click('[data-night-reply="regreso"]');assert.equal(c.pendingNight().conversations.noa.choice,'regreso');assert.equal(document.querySelectorAll('[data-night-reply]').length,0);
 c.showNight();assert.match(document.getElementById('nightConversation').textContent,/No me dejen hablando sola/);document.getElementById('nightKeep').focus();c.nightKeydown({key:'Tab',preventDefault(){}});assert.equal(document.activeElement.id,'nightReading');
});
