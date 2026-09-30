const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
const plain=x=>JSON.parse(JSON.stringify(x));
function completed(kind='archive',irene={irenePortable:true}){
  const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.storyPreludeSeen=true;c.state.starterKitGiven=true;c.state.economyHelpSeen=true;c.state.logisticsSeen=true;c.state.activity='story';
  c.state.index=26;c.state.flags={...irene};c.state.finaleResolution={version:1,kind,story:c.finaleStory(kind)};c.finish(kind);return a;
}
function start(kind,irene){const a=completed(kind,irene);assert.equal(a.ctx.startChapterTwo(),true);return a;}
function select(c,id){
  const ev=c.eventDisplay(c.events[c.state.index],c.state.index),i=ev.choices.findIndex(o=>o.id===id);
  assert.ok(i>=0,ev.key+' offers '+id);assert.equal(c.reason(ev.choices[i]),'',ev.key+' allows '+id);c.choose(i);return ev;
}
function step(c,id){select(c,id);assert.ok(c.pending,id+' has a result');c.advance();}
function prepared(c){if(c.state.refuge.active){c.restAtRefuge();c.rejoinAtRefuge();assert.equal(c.confirmLeaveRefuge(),true);}}
const defaults={recovery:'prepare',records:'recover',council:'recognition',packing:'depart',corridor:'pay',gate:'visit',refusal:'accept',insist:'accept',night1:'share',tour:'observe',reception:'terms',occupation:'listen',evidence:'copy',families:'leave-query',letter:'sealed',workshop:'keep',teaching:'learn',plan:'respect',observed:'destroy',night2:'share',proposal:'limited',farewell:'seeds',departure:'long-way',board:'back',return:'home',report:'bounded',disclosure:'restrict',conclusion:'finish',incomplete:'pending'};
function walk(c,overrides={},until){for(let n=0;n<90&&!c.state.finished;n++){prepared(c);const key=c.events[c.state.index].key;if(key===until)return;step(c,overrides[key]||defaults[key]);}if(until)assert.equal(c.events[c.state.index].key,until);else assert.ok(c.state.finished);}

test('five real chapter-one outcomes unlock the same new records without rewriting the old ending or equipment',()=>{
 for(const kind of ['broadcast','fragment','pact','archive','testimony']){
  const a=completed(kind),c=a.ctx,party=plain(c.state.party),flags=plain(c.state.flags),old=plain(c.state.finaleResolution),credits=c.state.credits;
  assert.equal(c.startChapterTwo(),true);assert.equal(c.startChapterTwo(),false);assert.deepEqual(plain(c.state.party),party);assert.deepEqual(plain(c.state.flags),flags);assert.deepEqual(plain(c.state.finaleResolution),old);assert.equal(c.state.credits,credits);
  assert.equal(c.chapterProgress().completed[1].kind,kind);assert.match(c.cisternaOpening(),{broadcast:/coordenadas privadas/,fragment:/archivo completo/,pact:/están con Vera/,archive:/vecinos ya han visto/,testimony:/no recuperan las pruebas/}[kind]);
  walk(c,{},'council');assert.ok(c.state.docs.includes('cisternaRecords'));assert.equal(c.state.flags.towerEvidenceCopied,undefined);
 }
});
test('Irene fate is independent from evidence custody and never resurrected',()=>{
 for(const [flags,re]of [[{ireneDied:true},/antes de morir/],[{irenePortable:true},/quede bajo cuidado/],[{irenePortable:true,ireneLostInEscape:true},/no significa que consiguieran rescatarla/],[{ireneLeft:true},/Irene quedó en la torre/]]){
  const c=start('testimony',flags).ctx;assert.match(c.cisternaIrene(),re);assert.deepEqual(plain(c.chapterProgress().completed[1].flags),flags);
 }
});
test('limited contact, letters and no future contact all complete recognition while preserving independence',()=>{
 for(const [proposal,kind]of [['limited','limited'],['letters','letters'],['none','independent']]){
  const a=start(),c=a.ctx;walk(c,{proposal});assert.equal(c.state.cisterna.resolution.kind,kind);assert.equal(c.state.cisterna.facts.unoExposure,'none');assert.ok(c.chapterProgress().completed[2]);assert.match(c.state.cisterna.resolution.story.world,/permanece independiente/);assert.equal(c.chapterProgress().completed[1].kind,'archive');
  const before=JSON.stringify(c.state);c.choose(0);c.advance();assert.equal(JSON.stringify(c.state),before);
  assert.equal(c.startChapterTwo(),false);assert.equal(c.retryCisterna(),false);assert.deepEqual(Array.from(c.campaignChapters.filter(x=>x.available).map(x=>x.id)),[1,2]);
 }
});
test('the outside visit learns history and carries letters without fabricating access to crops or workshop',()=>{
 const c=start().ctx;walk(c,{gate:'outside',proposal:'letters'});const f=c.state.cisterna.facts;
 assert.equal(f.contact,'outside');assert.equal(f.history,true);assert.equal(f.cultivationSeen,undefined);assert.equal(f.cultivationLearned,undefined);assert.equal(f.technicalKnowledge,undefined);assert.equal(f.accessKnown,undefined);assert.equal(c.state.cisterna.resolution.kind,'letters');
});
test('known pressure or prohibited entry closes the relationship instead of annexing the settlement',()=>{
 for(const choices of [{refusal:'insist',insist:'pressure'},{gate:'side'}]){
  const c=start().ctx;walk(c,choices);assert.equal(c.state.cisterna.resolution.kind,'closed');assert.equal(c.state.cisterna.facts.breachKnown,true);assert.equal(c.state.cisterna.facts.permission,'suspended');assert.equal(c.state.cisterna.facts.cultivationSeen,undefined);
 }
});
test('voluntary retreat can resume; completed corridor payment and recovery are not granted again',()=>{
 const a=start(),c=a.ctx;walk(c,{gate:'leave'});assert.equal(c.state.cisterna.resolution.kind,'incomplete');assert.equal(c.chapterProgress().completed[2],undefined);const battery=c.stockCount('battery'),records=c.state.docs.length;
 assert.equal(c.retryCisterna(),true);assert.equal(c.events[c.state.index].key,'gate');prepared(c);assert.equal(c.stockCount('battery'),battery);assert.equal(c.state.docs.length,records);walk(c);assert.equal(c.state.cisterna.resolution.kind,'limited');
 const d=start().ctx;walk(d,{corridor:'withdraw'});d.retryCisterna();prepared(d);assert.equal(d.events[d.state.index].key,'corridor');assert.ok(d.eventDisplay(d.events[d.state.index]).choices.some(o=>o.id==='pay'));walk(d);assert.equal(d.state.cisterna.resolution.kind,'limited');
});
test('first-night exhaustion resumes after the settled night instead of charging the same night twice',()=>{
 const c=start().ctx;walk(c,{},'night1');c.removePartyItem('food',100);c.state.party.forEach(p=>p.hunger=2);step(c,'share');assert.equal(c.events[c.state.index].key,'incomplete');step(c,'pending');const rests=c.state.stats.rests,water=c.stockCount('water');c.retryCisterna();prepared(c);assert.equal(c.events[c.state.index].key,'tour');assert.equal(c.stockCount('water'),water);assert.equal(c.state.stats.rests,rests+1);assert.equal(c.state.cisterna.nights.night1,'share');
});
test('secret copying has witnessed and hidden outcomes, with disclosure knowledge recorded only when it travels',()=>{
 for(const [random,report,disclosure,kind,known]of [[0,'bounded','restrict','closed',true],[.99,'bounded','restrict','limited',undefined],[.99,'disclose','restrict','limited',undefined],[.99,'disclose','publish','closed',true]]){
  const c=start().ctx;walk(c,{},'plan');c.random=()=>random;walk(c,{plan:'copy-secret',report,disclosure});assert.equal(c.state.cisterna.resolution.kind,kind);assert.equal(c.state.cisterna.facts.breachKnown,known);
  if(random===0)assert.equal(c.state.cisterna.facts.unauthorizedMap,false);
  else assert.equal(c.state.cisterna.facts.unauthorizedMap,true);
  if(disclosure==='publish')assert.equal(c.state.cisterna.facts.breach,'disclosure');
 }
});
test('a gift is optional, barter costs once, knowledge does not require payment and seeds are unique',()=>{
 for(const choice of ['gift','barter','keep']){
  const c=start().ctx;c.placePartyItem('scrap',2);walk(c,{},'workshop');const scrap=c.stockCount('scrap'),food=c.stockCount('food');step(c,choice);assert.equal(c.stockCount('scrap'),scrap-(choice==='keep'?0:1));assert.equal(c.stockCount('food'),food+(choice==='barter'?1:0));step(c,'learn');assert.ok(c.state.cisterna.facts.cultivationLearned);walk(c);assert.equal(c.state.cisterna.facts.seeds,true);const after=plain(c.state.party);c.finishCisterna(false);assert.deepEqual(plain(c.state.party),after);
 }
});
test('UNO exposure is independent of diplomacy; board requires real local knowledge and battery',()=>{
 const c=start().ctx;c.placePartyItem('battery',1);walk(c,{},'departure');step(c,'board');const qty=c.stockCount('battery');step(c,'connect');assert.equal(c.stockCount('battery'),qty-1);walk(c);assert.equal(c.state.cisterna.resolution.kind,'limited');assert.equal(c.state.cisterna.facts.unoExposure,'panel-reply');
 const d=start().ctx;walk(d,{teaching:'decline'},'departure');assert.ok(!d.cisternaEvent(d.events[d.state.index]).choices.some(o=>o.id==='board'));
});
test('real shared combat defeat at the corridor allows retry; exit defeat preserves transmission and witnessed facts',()=>{
 for(const at of ['corridor','departure']){
  const c=start().ctx;walk(c,{},at);select(c,'fight');assert.ok(c.battleState);assert.equal(c.battleState.config.enemies.length,at==='corridor'?2:1);c.state.party.forEach(p=>p.hp=0);c.loseCombat(false);assert.equal(c.battleState,null);assert.ok(c.state.party.every(p=>p.hp>=0));c.advance();
  if(at==='corridor'){assert.equal(c.events[c.state.index].key,'incomplete');step(c,'pending');c.retryCisterna();prepared(c);assert.equal(c.events[c.state.index].key,'corridor');}
  else {assert.equal(c.events[c.state.index].key,'return');walk(c);assert.equal(c.state.cisterna.facts.unoExposure,'patrol-transmission');assert.equal(c.state.cisterna.resolution.kind,'limited');}
 }
});
test('shared combat victory commits the proper next scene without a repeatable loot encounter',()=>{
 const c=start().ctx;walk(c,{},'departure');select(c,'fight');c.winCombat();assert.ok(c.pending.cisterna);c.advance();assert.equal(c.events[c.state.index].key,'return');assert.equal(c.state.cisterna.facts.unoExposure,'patrol-transmission');assert.equal(c.state.cisterna.receipts.departure.option,'fight');walk(c);assert.equal(c.state.cisterna.resolution.kind,'limited');
});
test('every stable chapter boundary restores; reading and reloading a result cannot persist half a choice',()=>{
 const a=start(),c=a.ctx;let checks=0;
 for(let n=0;n<90&&!c.state.finished;n++){
  prepared(c);c.save();const before=a.storage.get(c.KEY),ev=c.events[c.state.index];select(c,defaults[ev.key]);assert.equal(a.storage.get(c.KEY),before,'checkpoint stays atomic at '+ev.key);
  const prior=boot(a.storage).ctx;assert.equal(prior.load(),true,'pre-choice '+ev.key);assert.equal(prior.state.index,c.state.index);
  c.advance();const loaded=boot(a.storage).ctx;assert.equal(loaded.load(),true,'post-choice '+ev.key);assert.deepEqual(plain(loaded.state.cisterna),plain(c.state.cisterna));checks++;
 }
 assert.ok(checks>=24);const d=boot(a.storage).ctx;d.continueGame();assert.equal(d.state.cisterna.resolution.kind,'limited');
});
test('legacy completed saves are recognized without granting a replacement tower archive; invalid chapter saves fail atomically',()=>{
 const a=completed(),c=a.ctx;c.state.ending='trade';delete c.state.finaleResolution;delete c.state.finaleRevision;c.save();const d=boot(a.storage).ctx;d.gameSessionActive=true;assert.equal(d.load(),true);d.startChapterTwo();assert.equal(d.chapterProgress().completed[1].kind,'pact');assert.equal(d.state.flags.towerEvidenceCopied,undefined);
 const bad=plain(d.state);bad.campaignProgress.active=1;const old=d.state;assert.equal(d.load(JSON.stringify({...bad,sceneId:d.events[d.state.index].id})),false);assert.equal(d.state,old);
});
test('new game clears both chapters while completed previous chapter records remain unchanged through a visit',()=>{
 const c=start().ctx,old=JSON.stringify(c.chapterProgress().completed[1]);walk(c,{proposal:'none'});assert.equal(JSON.stringify(c.chapterProgress().completed[1]),old);c.newGame();assert.equal(c.inCisterna(),false);assert.equal(c.state.cisterna,undefined);assert.deepEqual(plain(c.chapterProgress().completed),{});
});
