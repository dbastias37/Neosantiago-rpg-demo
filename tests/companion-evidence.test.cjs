const test=require('node:test'),assert=require('node:assert/strict'),{boot,root}=require('./runtime-harness.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
function session(agreement='dudas',options={}){
 const a=boot(new Map(),options),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.starterKitGiven=true;c.state.activity='story';
 for(const id of ['titleScreen','start','gameIntro','refuge','storyPrelude','activityMenu'])a.nodes.get(id).classList.add('hidden');
 c.state.index=9;c.prepareNight(1);if(agreement)c.answerNightCompanion('elias',agreement);c.settleNight('share');c.continueAfterNight();c.confirmLeaveRefuge();c.state.index=c.evidenceIndex();c.save();c.render();return a;
}
function current(c){return c.eventDisplay(c.events[c.state.index],c.state.index)}
function prepare(c,method){
 if(method==='credential')c.placePartyItem('unoCard',1);
 if(method==='core'&&!c.hasPartyItem('droneCore'))c.placePartyItem('droneCore',1);
 if(method==='ally')c.state.flags.unit7Ally=true;
 if(method==='infiltrated')c.state.flags.unit7Infiltrated=true;
 if(method==='h12'){c.state.flags.h12Controlled=true;c.state.flags.h12RouteCompleted=true;}
 if(method==='relay')c.state.flags.rosaCivilNetwork=true;
 if(method==='unread')c.state.party[1].hp=0;
 c.save();c.render();
}
function act(a,method,outcome='complete'){
 const c=a.ctx;prepare(c,method);const i=current(c).choices.findIndex(o=>o._nodeMethod===method);assert.ok(i>=0,method);assert.equal(c.reason(current(c).choices[i]),'');c.choose(i);
 if(method==='core'){
  const g=c.decisionState;assert.equal(g.phase,'ready');c.random=()=>outcome==='partial'?.99999:0;c.resolveDecision();const timer=a.timers.get(c.decisionFinishTimer);assert.ok(timer);timer.fn();assert.equal(c.evidenceRecord().outcome,outcome);
 }
 assert.ok(c.pending);return c.evidenceRecord();
}
function respond(a,report){const c=a.ctx;if(c.decisionState)c.continueDecision();else c.advance();assert.equal(c.npcDialogueState.dialogue.npc,'elias');c.revealNpcDialogueText();const i=c.npcDialogueState.options.findIndex(o=>o._evidenceReport===report);c.selectNpcDialogueChoice(i);assert.equal(c.evidenceRecord().report,report);c.closeNpcDialogueAndContinue();}
function gameplay(c){return JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,threat:c.state.threat,stats:c.state.stats,seed:c.state.seed,faction:c.state.factionPoints})}
test('every access method and agreement preserve actual archives, costs, flags and the outcome scope',()=>{
 for(const agreement of [null,'dudas','explicar'])for(const method of ['credential','core','ally','infiltrated','h12','origin','relay'])for(const outcome of method==='core'?['complete','partial']:['complete']){
  const a=session(agreement),c=a.ctx,r=act(a,method,outcome);assert.equal(r.method,method);assert.equal(r.agreement,agreement);assert.deepEqual(plain(r.files),Array.from(c.evidenceFiles(method,r.outcome)));
  for(const id of r.files)assert.ok(c.state.docs.includes(id));if(method==='core')assert.equal(c.hasPartyItem('droneCore'),false);if(method==='credential')assert.equal(c.hasPartyItem('unoCard'),true);if(method==='relay'){assert.equal(c.state.flags.relayPrepared,true);assert.ok(!r.files.includes('names'))}
  assert.ok(a.nodes.get('resultText').textContent.includes(r.response));if(method==='core')assert.ok(a.nodes.get('decisionResolutionText').textContent.includes(r.response));
  if(method==='origin')assert.match(c.evidenceFact(r),/no confirma que ella siga viva/);if(r.outcome==='partial')assert.ok(!c.state.docs.includes('names'));
  if(!agreement)assert.doesNotMatch(r.response,/como acordaron|explicó antes/);
  respond(a,'bounded');if(c.pending)c.continuePendingAdvance();const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.evidenceRecord().method,method);assert.equal(b.evidenceRecord().report,'bounded');
 }
});
test('report choices change memory and history without adding stats, sympathy points or a fictitious mission',()=>{
 for(const report of ['bounded','search']){
  const a=session(),c=a.ctx;act(a,'origin');c.advance();c.revealNpcDialogueText();const before=gameplay(c),i=c.npcDialogueState.options.findIndex(o=>o._evidenceReport===report);c.selectNpcDialogueChoice(i);assert.equal(gameplay(c),before);assert.equal(c.evidenceRecord().report,report);assert.match(c.state.history.at(-1).dialogue,/Elías/);c.selectNpcDialogueChoice(1-i);assert.equal(c.evidenceRecord().report,report);assert.equal(gameplay(c),before);
  c.closeNpcDialogueAndContinue();if(c.pending)c.continuePendingAdvance();c.state.index=18;c.prepareNight(2);const scene=c.companionConversation('elias',c.pendingNight());assert.match(scene.text,report==='bounded'?/decidieron dejar por escrito/:/preguntas que decidieron conservar/);assert.equal(c.answerNightCompanion('elias','revisar'),true);const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.pendingNight().conversations.elias.text,scene.text);
 }
});
test('failed copying cannot erase older knowledge or manufacture a newly recovered list',()=>{
 const a=session(),c=a.ctx;c.state.docs.push('names','origin');const r=act(a,'core','partial');assert.deepEqual(plain(r.files),['protocol']);assert.ok(r.priorFiles.includes('names'));assert.ok(c.state.docs.includes('names'));assert.ok(c.state.docs.includes('origin'));assert.match(r.response,/documentos recuperados antes siguen/);assert.match(c.evidenceNightReflection(),/No quería volver con tan poco/);
});
test('unread dossiers do not reveal their full first paragraph and acquired files retain a source-specific note',()=>{
 const a=session(),c=a.ctx,before=JSON.stringify(c.state);c.openContextArchive('origin');assert.doesNotMatch(a.nodes.get('archiveDocBody').innerHTML,/operadora de soporte vital conservó acceso/);assert.match(a.nodes.get('archiveDocBody').innerHTML,/Todavía no pudieron leer/);assert.match(c.contextArchiveHtml('origin'),/aún no ha sido recuperado/);assert.equal(JSON.stringify(c.state),before);c.closeArchive();act(a,'origin');c.openArchive('origin');assert.match(a.nodes.get('archiveDocBody').innerHTML,/Nota de la consulta/);assert.match(a.nodes.get('archiveDocBody').innerHTML,/no confirma que ella siga viva/);
 const b=session().ctx;b.state.docs.push('origin');b.openContextArchive('origin');assert.match(b.$('archiveDocBody').innerHTML,/operadora de soporte vital conservó acceso/);
});
test('rendering stays pure and revised prose does not change psychological effects or targets',()=>{
 for(const method of ['credential','core','ally','infiltrated','h12','origin','relay']){
  const a=session(),c=a.ctx;prepare(c,method);const before=JSON.stringify(c.state),base=JSON.stringify(c.events[13]),ev=current(c);current(c);c.render();assert.equal(JSON.stringify(c.state),before);assert.equal(JSON.stringify(c.events[13]),base);
  const x=ev.choices.find(o=>o._nodeMethod===method),choices=x.roll?[x.roll.success,x.roll.fail]:[x];for(const o of choices){assert.deepEqual(plain(c.inferPsychImpulse(o)),plain(c.inferPsychImpulse(o._mechanicsSource)));assert.deepEqual(Array.from(c.psychTargets(o),p=>p.id),Array.from(c.psychTargets(o._mechanicsSource),p=>p.id));assert.deepEqual(plain(o.fx),plain(o._mechanicsSource.fx));}
 }
});
test('exhausted allies do not speak and an exhausted engineer has a viable exit without fabricated knowledge',()=>{
 const a=session(),c=a.ctx;act(a,'unread');assert.equal(c.evidenceRecord().witnessed,false);assert.deepEqual(plain(c.evidenceRecord().files),[]);assert.equal(c.pending.dialogue,null);assert.equal(c.state.flags.relayPrepared,undefined);assert.match(c.evidenceNightReflection(),/necesitaba recuperarse/);
 for(const person of [0,2]){const b=session(),d=b.ctx;d.state.party[person].hp=0;act(b,'origin');assert.equal(d.evidenceRecord().witnessed,false);assert.equal(d.pending.dialogue,null);assert.doesNotMatch(b.nodes.get('resultText').textContent,/Sara le pide/);assert.doesNotMatch(d.evidenceNightReflection(),/Me preguntaste|Sara acerca la taza/);}
 const b=session(),d=b.ctx;prepare(d,'core');d.choose(current(d).choices.findIndex(o=>o._nodeMethod==='core'));d.state.party[1].hp=0;const before=gameplay(d);d.resolveDecision();assert.equal(gameplay(d),before);assert.equal(d.evidenceRecord(),null);
});
test('pending downloads and their report roll back together, including the seed and core, until the encounter commits',()=>{
 const a=session(),c=a.ctx;prepare(c,'core');const seed=c.state.seed;act(a,'core','partial');c.continueDecision();c.revealNpcDialogueText();c.selectNpcDialogueChoice(0);const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.evidenceRecord(),null);assert.equal(b.state.seed,seed);assert.equal(b.hasPartyItem('droneCore'),true);
 c.closeNpcDialogueAndContinue();if(c.pending)c.continuePendingAdvance();const d=boot(a.storage).ctx;assert.equal(d.load(),true);assert.equal(d.evidenceRecord().outcome,'partial');assert.equal(d.evidenceRecord().report,'bounded');assert.equal(d.hasPartyItem('droneCore'),false);
});
test('Irene only confirms a living person when the meeting is chosen, without changing her consent choices',()=>{
 for(const report of ['bounded','search']){
  const a=session(),c=a.ctx;act(a,'origin');respond(a,report);if(c.pending)c.continuePendingAdvance();c.state.index=24;c.save();const before=JSON.stringify(c.state),ev=current(c);assert.match(ev.text,/Esta vez hay una mujer/);assert.equal(JSON.stringify(c.state),before);assert.equal(c.evidenceRecord().verified,false);c.choose(0);assert.equal(c.evidenceRecord().verified,true);assert.equal(c.pending.dialogue,c.ireneFinalDialogue);assert.equal(c.ireneFinalDialogue.nodes.consent.options.length,4);assert.match(c.evidenceArchiveNote('origin'),/Después, el grupo encontró a Irene viva/);
  const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.evidenceRecord().verified,false);
 }
});
test('old saves acquire no invented consultation; invalid memory is rejected without replacing the stored save',()=>{
 const a=session(),c=a.ctx;act(a,'origin');respond(a,'bounded');if(c.pending)c.continuePendingAdvance();const valid=a.storage.get(c.KEY);
 const old=JSON.parse(valid);delete old.companionCommitments.information;a.storage.set(c.KEY,JSON.stringify(old));const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.evidenceRecord(),null);assert.equal(b.evidenceNightReflection(),'');
 for(const change of [r=>r.agreement='explicar',r=>r.files.push('names'),r=>r.priorFiles=['secret'],r=>r.outcome='complete',r=>r.method='oracle',r=>r.report='certainty',r=>r.verified=true,r=>r.witnessed=false]){const raw=JSON.parse(valid);change(raw.companionCommitments.information);const text=JSON.stringify(raw);a.storage.set(c.KEY,text);assert.equal(boot(a.storage).ctx.load(),false);assert.equal(a.storage.get(c.KEY),text);}
 c.newGame();assert.equal(c.evidenceRecord(),null);
});
test('a resolved node restored at its scene cannot replay the relay, awards or resource consumption',()=>{
 const a=session(),c=a.ctx;act(a,'relay');respond(a,'bounded');if(c.pending)c.continuePendingAdvance();c.state.index=13;c.save();const d=boot(a.storage).ctx;assert.equal(d.load(),true);d.gameSessionActive=true;assert.equal(current(d).choices.length,1);const before=gameplay(d);d.choose(0);assert.equal(gameplay(d),before);assert.equal(d.pending.dialogue,null);d.continuePendingAdvance();assert.equal(d.state.index,14);
});
test('real controls open the established Elías dialogue and save the selected report',()=>{
 const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
 const a=session('explicar',{document}),c=a.ctx,click=s=>document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true}));assert.match(document.getElementById('eventText').textContent,/Primero el riesgo/);click('[data-choice="2"]');click('#advance');assert.equal(document.getElementById('npcDialogueName').textContent,'Elías');assert.match(document.getElementById('npcDialoguePortrait').src,/portraits\/elias.webp/);c.revealNpcDialogueText();click('[data-dialogue-choice="1"]');assert.equal(c.evidenceRecord().report,'search');assert.match(document.getElementById('npcDialogueText').textContent,/Quiero que la busquemos/);click('#dialogueContinue');
});
