const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./runtime-harness.cjs');
// Place a real night response before the target scene. Full-campaign traversal is
// covered separately; these fixtures isolate agreements and inventory boundaries.
function session(agreement='compartir',options={}){
 const a=boot(new Map(),options),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.starterKitGiven=true;c.state.activity='story';
 for(const id of ['titleScreen','start','gameIntro','refuge','storyPrelude','activityMenu'])a.nodes.get(id).classList.add('hidden');
 c.state.index=9;c.prepareNight(1);if(agreement)c.answerNightCompanion('sara',agreement);c.settleNight('share');c.continueAfterNight();c.state.index=c.careIndex();c.save();c.render();return a;
}
function stock(c,meds,water){c.removePartyItem('meds',100);if(meds)c.placePartyItem('meds',meds);c.state.res.water=water;c.save();c.render();}
function resources(c){return JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,threat:c.state.threat,stats:c.state.stats,history:c.state.history,seed:c.state.seed,index:c.state.index,faction:c.state.factionPoints});}
function act(c,id){const choices=c.eventDisplay(c.events[c.state.index],c.state.index).choices,index=choices.findIndex(o=>o._careAction===id);assert.ok(index>=0);c.choose(index);assert.ok(c.pending);}
test('discussion reads actual reserves, pauses the signal clock and changes no resources or progress',()=>{
 for(const meds of [0,1,2]){const a=session(),c=a.ctx;stock(c,meds,1);const before=resources(c);assert.equal(c.discussCare(),true);assert.equal(resources(c),before);assert.equal(c.signalPauseActive(),true);assert.equal(c.careRecord().discussion.meds,meds);assert.equal(c.careRecord().discussion.water,1);
  assert.match(a.nodes.get('drawerContent').innerHTML,meds===0?/No tengo medicina/:meds===1?/última medicina/:/quedarían 1/);assert.ok(!a.nodes.get('drawer').classList.contains('hidden'));c.closePanel();assert.equal(c.document.activeElement.id,'careDiscussionButton');
  const saved=JSON.stringify(c.careRecord());assert.equal(c.discussCare(),true);assert.equal(JSON.stringify(c.careRecord()),saved);assert.equal(resources(c),before);
 }
});
test('all clinic actions distinguish discussion from unilateral choice and persist the actual outcome',()=>{
 for(const agreement of ['compartir','limites',null])for(const talked of [false,true])for(const decision of ['treat','water','leave','extract']){
  const a=session(agreement),c=a.ctx;stock(c,1,1);if(talked){c.discussCare();c.closePanel();}const before=c.stockCount('meds');act(c,decision);
  assert.equal(c.careRecord().decision,decision);assert.equal(c.careRecord().agreement,agreement);assert.equal(!!c.careRecord().discussion,talked);assert.equal(c.stockCount('meds'),before-(decision==='treat'?1:0));assert.equal(c.stockCount('water'),decision==='water'?0:1);
  assert.ok(a.nodes.get('resultText').textContent.includes(c.careRecord().response));assert.ok(c.state.history.at(-1).result.includes(c.careRecord().response));
  if(agreement==='compartir'&&!talked&&decision!=='extract')assert.match(c.careRecord().response,/sin preguntar/);
  if(!agreement)assert.doesNotMatch(c.careRecord().response,/Anoche quedamos/);
  assert.equal(!!c.state.flags.liraDead,decision==='extract');assert.equal(c.discussCare(),false);
  c.continuePendingAdvance();const b=boot(a.storage);assert.equal(b.ctx.load(),true);assert.equal(b.ctx.careRecord().decision,decision);assert.equal(b.ctx.stockCount('meds'),c.stockCount('meds'));assert.equal(b.ctx.discussCare(),false);
 }
});
test('no medicine or water leaves a nonviolent exit and blocked choices cannot spend absent resources',()=>{
 const a=session(),c=a.ctx;stock(c,0,0);const ev=c.eventDisplay(c.events[c.state.index],c.state.index);assert.equal(ev.choices.length,4);assert.ok(c.reason(ev.choices[0]));assert.ok(c.reason(ev.choices[2]));assert.equal(c.reason(ev.choices[3]),'');
 const before=resources(c);c.choose(0);c.choose(2);assert.equal(resources(c),before);act(c,'leave');assert.equal(c.state.flags.leftLiraUntreated,true);assert.equal(c.state.flags.liraDead,undefined);assert.equal(c.state.flags.savedMerodeadora,undefined);assert.equal(c.stockCount('meds'),0);assert.equal(c.stockCount('water'),0);
 assert.match(a.nodes.get('resultText').textContent,/sin resolverlo/);
});
test('second night recalls treatment, water, departure or death instead of a generic promise',()=>{
 for(const [decision,pattern] of [['treat',/Usamos una medicina/],['water',/Le dejamos agua/],['leave',/Nos fuimos sin tratarla/],['extract',/murió/]]){
  const a=session(),c=a.ctx;stock(c,1,1);c.discussCare();c.closePanel();act(c,decision);c.continuePendingAdvance();c.state.index=18;c.prepareNight(2);
  const scene=c.companionConversation('sara',c.pendingNight());assert.match(scene.text,pattern);assert.equal(c.answerNightCompanion('sara','revisar'),true);
  const b=boot(a.storage);assert.equal(b.ctx.load(),true);assert.equal(b.ctx.pendingNight().conversations.sara.text,scene.text);
 }
});
test('a later betrayal cannot be presented as successful care and dead Lira cannot be treated again',()=>{
 const a=session(),c=a.ctx;stock(c,1,1);act(c,'treat');c.apply({flags:{betrayedLira:true}});assert.equal(c.state.flags.liraDead,true);assert.match(c.careNightReflection(),/Después le quitaron el núcleo/);assert.doesNotMatch(c.careNightReflection(),/Usamos una medicina/);
 const ev=c.eventDisplay(c.events[c.state.index],c.state.index);assert.equal(ev.choices.length,1);assert.ok(!ev.choices[0]._careAction);assert.deepEqual(Object.keys(ev.choices[0].fx),[]);assert.match(ev.text,/sabe que murió/);
});
test('reload preserves the consultation, rolls back an uncommitted scene and commits its consequence only once',()=>{
 const a=session(),c=a.ctx;stock(c,1,1);c.discussCare();c.closePanel();const before=resources(c);act(c,'water');const b=boot(a.storage),d=b.ctx;assert.equal(d.load(),true);d.gameSessionActive=true;
 assert.equal(resources(d),before);assert.ok(d.careRecord().discussion);assert.equal(d.careRecord().decision,null);
 act(d,'water');const history=d.state.history.length;d.choose(2);assert.equal(d.state.history.length,history);d.continuePendingAdvance();
 const final=boot(a.storage);assert.equal(final.ctx.load(),true);assert.equal(final.ctx.state.index,16);assert.equal(final.ctx.stockCount('water'),0);assert.equal(final.ctx.careRecord().decision,'water');
});
test('exhausted members and other game surfaces cannot create a shared conversation',()=>{
 for(const block of [c=>c.state.party[0].hp=0,c=>c.state.party[1].hp=0,c=>c.state.refuge.active=true,c=>c.state.activity='couriers',c=>c.state.index=14,c=>c.state.finished=true,c=>c.encounterSaveLocked=true,c=>c.$('titleScreen').classList.remove('hidden')]){
  const a=session(),c=a.ctx;block(c);const before=JSON.stringify(c.state);assert.equal(c.discussCare(),false);assert.equal(JSON.stringify(c.state),before);
 }
 const a=session(),c=a.ctx;c.state.party[0].hp=0;const ev=c.eventDisplay(c.events[c.state.index],c.state.index);assert.match(c.reason(ev.choices[0]),/Sara necesita recuperarse/);act(c,'leave');assert.equal(c.careRecord().witnessed,false);assert.match(c.careRecord().response,/sin presentarla como un acuerdo/);
});
test('legacy saves gain no invented agreements, invalid records are preserved for recovery, and new game clears memory',()=>{
 const a=session(null),c=a.ctx;delete c.state.companionCommitments;c.save();const b=boot(a.storage);assert.equal(b.ctx.load(),true);assert.equal(b.ctx.careRecord(),null);
 c.discussCare();c.closePanel();const valid=a.storage.get(c.KEY);
 for(const change of [r=>r.agreement='limites',r=>r.discussion.meds=-1,r=>r.discussion.lines=[1],r=>r.decision='rescued',r=>r.response='inventado']){
  const raw=JSON.parse(valid);change(raw.companionCommitments.care);const text=JSON.stringify(raw);a.storage.set(c.KEY,text);assert.equal(boot(a.storage).ctx.load(),false);assert.equal(a.storage.get(c.KEY),text);
 }
 c.newGame();assert.equal(c.careRecord(),null);assert.equal(c.discussCare(),false);
});
test('real controls display the discussion, trap shortcuts, restore focus and keep the fourth exit clickable',()=>{
 const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{root}=require('./runtime-harness.cjs');const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));let focused;Object.defineProperty(document,'activeElement',{get:()=>focused});window.HTMLElement.prototype.focus=function(){focused=this};
 const a=session('compartir',{document}),c=a.ctx;stock(c,0,0);const click=s=>document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true}));click('#careDiscussionButton');assert.equal(c.carePanelActive,true);assert.ok(document.getElementById('drawerContent').textContent.includes('No tengo medicina'));const before=resources(c);let prevented=0;c.carePanelKeydown({key:'4',preventDefault(){prevented++}});assert.equal(prevented,1);assert.equal(resources(c),before);
 c.carePanelKeydown({key:'Escape',preventDefault(){}});assert.equal(document.activeElement.id,'careDiscussionButton');click('[data-choice="3"]');assert.equal(c.careRecord().decision,'leave');assert.ok(document.getElementById('resultText').textContent.includes('sin tratar la herida'));
});
