const test=require('node:test'),assert=require('node:assert/strict'),{boot,root}=require('./runtime-harness.cjs');
// Fixtures isolate branches; narrative-continuity traverses both scenes from a new game.
function session(agreement='motivo',options={}){
 const a=boot(new Map(),options),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.starterKitGiven=true;c.state.activity='story';
 for(const id of ['titleScreen','start','gameIntro','refuge','storyPrelude','activityMenu'])a.nodes.get(id).classList.add('hidden');
 c.state.index=9;c.prepareNight(1);if(agreement)c.answerNightCompanion('noa',agreement);c.settleNight('share');c.continueAfterNight();c.state.index=c.noaRouteIndex();c.save();c.render();return a;
}
function current(c){return c.eventDisplay(c.events[c.state.index],c.state.index)}
function choose(c,key,value){const i=current(c).choices.findIndex(o=>o[key]===value);assert.ok(i>=0);assert.equal(c.reason(current(c).choices[i]),'');c.choose(i);}
function depart(c,path='marks'){choose(c,'_noaPath',path);assert.ok(c.pending);c.continuePendingAdvance();assert.equal(c.state.index,c.noaCrossingIndex());}
function cross(c,action){choose(c,'_noaObstacle',action);if(action==='fight'){assert.ok(c.battleState);c.winCombat()}assert.ok(c.pending);}
test('three reasons produce different approaches, preserve costs and never claim the whole route is safe',()=>{
 for(const agreement of [null,'motivo','regreso'])for(const path of ['marks','avenue','wait']){
  const a=session(agreement),c=a.ctx,before=JSON.stringify(c.state),base=JSON.stringify(c.events[c.state.index]);const ev=current(c);current(c);c.render();assert.equal(JSON.stringify(c.state),before);assert.equal(JSON.stringify(c.events[c.state.index]),base);
  const i=['marks','avenue','wait'].indexOf(path);assert.deepEqual(JSON.parse(JSON.stringify(ev.choices[i].fx)),JSON.parse(JSON.stringify(c.events[c.state.index].choices[i].fx)));
  if(!agreement)assert.doesNotMatch(ev.text,/Anoche quedamos|Me pidieron/);
  depart(c,path);const r=c.noaRouteRecord();assert.equal(r.agreement,agreement);assert.equal(r.departure.path,path);assert.equal(r.crossing,null);assert.match(current(c).text,{marks:/no ofrecen un paso/,avenue:/salida directa/,wait:/no despejó este cruce/}[path]);
  assert.equal(c.state.flags[{marks:'safeHouseRoute',avenue:'surfaceExposed',wait:'timedPatrol'}[path]],true);
  const restored=boot(a.storage).ctx;assert.equal(restored.load(),true);assert.equal(restored.noaRouteRecord().departure.path,path);
 }
});
test('all agreements and approaches remember actual detour, victory or decoy without adding relationship rewards',()=>{
 for(const agreement of [null,'motivo','regreso'])for(const path of ['marks','avenue','wait'])for(const action of ['detour','fight','signal']){
  const a=session(agreement),c=a.ctx;depart(c,path);if(action==='signal')c.apply({add:['droneCore']});const core=c.hasPartyItem('droneCore');cross(c,action);
  const r=c.noaRouteRecord();assert.equal(r.crossing.action,action);assert.equal(r.crossing.warned,true);assert.equal(r.crossing.method,action==='signal'?'core':null);assert.ok(a.nodes.get('resultText').textContent.includes(r.crossing.response));assert.ok(c.state.history.at(-1).result.includes(r.crossing.response));
  if(action==='signal'){assert.equal(core,true);assert.equal(c.hasPartyItem('droneCore'),false)}
  c.continuePendingAdvance();c.state.index=18;c.prepareNight(2);const scene=c.companionConversation('noa',c.pendingNight());assert.match(scene.text,{detour:/Cambiamos al subterráneo/,fight:/Yo había propuesto bajar/,signal:/Gastamos un núcleo/}[action]);
  if(!agreement)assert.doesNotMatch(scene.text,/Esta vez supe el motivo|Lo de avisar el límite/);
  const before=JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,faction:c.state.factionPoints});assert.equal(c.answerNightCompanion('noa','revisar'),true);assert.equal(JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,faction:c.state.factionPoints}),before);
  const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.pendingNight().conversations.noa.text,scene.text);
 }
});
test('S-7 alternatives retain their actual cost, context and method instead of claiming a core was spent',()=>{
 for(const [flag,method] of [['unit7Ally','ally'],['unit7Infiltrated','infiltrated']]){
  const a=session('regreso'),c=a.ctx;c.state.flags[flag]=true;c.state.flags.unit7RouteCompleted=true;c.state.flags.matiasLateStart=true;const ev=current(c);assert.match(ev.text,/S-7/);assert.equal(ev.time,c.narrativeRememberedEvent(c.legacyEventDisplay(c.events[c.state.index],c.state.index),c.state.index).time);
  depart(c);const choice=current(c).choices[1];assert.equal(choice._noaMethod,method);assert.equal(c.reason(choice),'');assert.equal(choice.remove,undefined);cross(c,'signal');assert.equal(c.noaRouteRecord().crossing.method,method);assert.match(c.noaRouteNightReflection(),/S-7 despejó/);assert.doesNotMatch(c.noaRouteNightReflection(),/Gastamos un núcleo/);
 }
});
test('reload rolls back unresolved encounters; committed route, inventory and result remain atomic',()=>{
 const a=session(),c=a.ctx;choose(c,'_noaPath','avenue');let b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.noaRouteRecord(),null);assert.equal(b.state.index,10);
 c.continuePendingAdvance();c.apply({add:['droneCore']});c.save();const before=c.state.party.map(p=>p.hunger);cross(c,'signal');b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.noaRouteRecord().crossing,null);assert.equal(b.hasPartyItem('droneCore'),true);assert.deepEqual(Array.from(b.state.party,p=>p.hunger),Array.from(before));
 const history=c.state.history.length;c.choose(1);assert.equal(c.state.history.length,history);c.continuePendingAdvance();b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.noaRouteRecord().crossing.action,'signal');assert.equal(b.hasPartyItem('droneCore'),false);assert.equal(b.state.index,12);
});
test('retreat and defeat persist a failed attempt, leave the crossing open and allow a different route on return',()=>{
 for(const fled of [true,false]){
  const a=session('regreso'),c=a.ctx;depart(c,'avenue');choose(c,'_noaObstacle','fight');c.loseCombat(fled);assert.equal(c.state.index,11);assert.equal(c.state.refuge.active,true);assert.equal(c.noaRouteRecord().crossing,null);assert.equal(c.noaRouteRecord().setbacks,1);assert.equal(c.noaRouteRecord().lastSetback,fled?'fled':'exhausted');assert.match(c.state.refuge.message,/Alameda sigue pendiente/);
  const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.noaRouteRecord().setbacks,1);assert.match(current(b).text,/tuvieron que volver/);
  c.restAtRefuge();c.rejoinAtRefuge();assert.equal(c.confirmLeaveRefuge(),true);cross(c,'detour');assert.match(c.noaRouteNightReflection(),/regresar al refugio 1 vez/);assert.match(c.noaRouteNightReflection(),/Cambiamos al subterráneo/);
 }
});
test('exhaustion cannot invent an objection or agreement, including recovery during combat',()=>{
 const a=session('regreso'),c=a.ctx;c.state.party[2].hp=0;assert.doesNotMatch(current(c).text,/Noa comprueba|Me pidieron/);depart(c);assert.equal(c.noaRouteRecord().departure.witnessed,false);assert.doesNotMatch(current(c).text,/Noa se detiene|Noa se agacha/);
 choose(c,'_noaObstacle','fight');c.state.party.forEach(p=>p.hp=p.maxHp);c.winCombat();assert.equal(c.noaRouteRecord().crossing.warned,false);assert.match(c.noaRouteRecord().crossing.response,/no se registra una aprobación/);assert.doesNotMatch(c.noaRouteNightReflection(),/Yo había propuesto bajar|Lo de avisar el límite/);
});
test('older saves receive no inferred memory, malformed records never replace the stored save and new game resets it',()=>{
 const a=session(),c=a.ctx;depart(c);cross(c,'detour');c.continuePendingAdvance();const valid=a.storage.get(c.KEY);
 for(const change of [s=>delete s.companionCommitments,s=>delete s.companionCommitments.route]){const raw=JSON.parse(valid);change(raw);a.storage.set(c.KEY,JSON.stringify(raw));const b=boot(a.storage).ctx;assert.equal(b.load(),true);assert.equal(b.noaRouteRecord(),null);assert.equal(b.noaRouteNightReflection(),'');}
 for(const change of [r=>r.agreement='regreso',r=>r.departure.path='teleport',r=>r.departure.witnessed=1,r=>r.setbacks=-1,r=>r.lastSetback='fled',r=>r.crossing.action='rescued',r=>r.crossing.method='core',r=>delete r.crossing.warned]){const raw=JSON.parse(valid);change(raw.companionCommitments.route);const text=JSON.stringify(raw);a.storage.set(c.KEY,text);assert.equal(boot(a.storage).ctx.load(),false);assert.equal(a.storage.get(c.KEY),text);}
 c.newGame();assert.equal(c.noaRouteRecord(),null);
});
test('a stored resolved scene only continues, without repeated costs, combat or route rewards',()=>{
 const a=session(),c=a.ctx;depart(c);cross(c,'detour');c.continuePendingAdvance();c.state.index=11;c.save();const b=boot(a.storage).ctx;assert.equal(b.load(),true);b.gameSessionActive=true;assert.equal(current(b).choices.length,1);const before=JSON.stringify({party:b.state.party,res:b.state.res,morale:b.state.morale,threat:b.state.threat,faction:b.state.factionPoints});b.choose(0);assert.equal(JSON.stringify({party:b.state.party,res:b.state.res,morale:b.state.morale,threat:b.state.threat,faction:b.state.factionPoints}),before);assert.equal(b.battleState,null);b.continuePendingAdvance();assert.equal(b.state.index,12);
});
test('rendered route choices resolve into the contextual next scene through actual buttons',()=>{
 const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
 const a=session('regreso',{document}),c=a.ctx;const click=s=>document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true}));assert.match(document.getElementById('eventText').textContent,/Me pidieron que avisara/);assert.equal(document.querySelectorAll('#choices button').length,3);click('[data-choice="1"]');assert.equal(c.noaRouteRecord().departure.path,'avenue');click('#advance');assert.equal(c.state.index,11);assert.match(document.getElementById('eventText').textContent,/Noa se detiene/);assert.equal(document.querySelector('[data-choice="1"]').hasAttribute('disabled'),true);click('[data-choice="2"]');assert.equal(c.noaRouteRecord().crossing.action,'detour');assert.match(document.getElementById('resultText').textContent,/Sara pasa primero las mochilas/);
});
