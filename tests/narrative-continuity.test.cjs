const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function session(){const a=boot();a.ctx.gameSessionActive=true;a.ctx.state.introCompleted=true;for(const n of a.nodes.values())n.classList.add('hidden');return a}
test('Ortega never offers a living-Lira claim after her death, including stale save flags',()=>{
 for(const death of ['liraDead','tookLivingCore','betrayedLira']){
  const a=session(),c=a.ctx;c.state.flags={savedMerodeadora:true,[death]:true};c.openNpcDialogue(c.branchDialogueDefs.ortegaLine);
  assert.ok(!a.nodes.get('npcDialogueChoices').innerHTML.includes('Decir que Lira sigue viva'));
  c.revealNpcDialogueText();const before=JSON.stringify(c.state);c.selectNpcDialogueChoice(1);assert.equal(JSON.stringify(c.state),before);
  assert.match(a.nodes.get('npcDialogueChoices').innerHTML,/data-dialogue-choice="2"/);
 }
 const a=session(),c=a.ctx;c.state.flags.savedMerodeadora=true;c.openNpcDialogue(c.branchDialogueDefs.ortegaLine);assert.match(a.nodes.get('npcDialogueChoices').innerHTML,/Decir que Lira sigue viva/);
});
test('Ortega cannot negotiate an unknown route and a private promise cannot open Varela archives',()=>{
 const a=session(),c=a.ctx;c.openNpcDialogue(c.branchDialogueDefs.ortegaLine);c.setNpcDialogueNode('doctrine');assert.ok(!a.nodes.get('npcDialogueChoices').innerHTML.includes('Ofrecer borrar'));
 c.state.flags.liraTowerRoute=true;c.renderNpcDialogueChoices();assert.match(a.nodes.get('npcDialogueChoices').innerHTML,/Ofrecer borrar/);
 assert.equal(c.contextualDialogueFor({flags:{partyOwnsTruth:true}},{}),null);
 assert.equal(c.contextualDialogueFor({flags:{knowsExiles:true}},{}),c.branchDialogueDefs.varelaArchives);
});
// Narrative integration, not a survival/balance simulation: battles are won explicitly;
// party health/energy are replenished between scenes. No event index or story flag is injected.
for(const copy of [true,false])test('continuous campaign through encounters, conversations and automatic '+(copy?'archive':'testimony'),()=>{
 const a=session(),c=a.ctx,visited=new Set();
 for(let step=0;step<500&&!c.state.finished;step++){
  c.state.party.forEach(p=>{p.hp=p.maxHp;p.hunger=100});c.state.morale=Math.max(30,c.state.morale);
  if(c.battleState){c.winCombat();continue}
  if(c.routeNarrativeState){if(c.routeNarrativeState.finished){c.advanceRouteNarrative();continue}c.revealRouteNarrativeText();const opts=c.currentRouteNarrativeScene().options;const i=opts.findIndex(o=>!c.reason(o));assert.ok(i>=0);c.selectRouteNarrativeChoice(i);continue}
  if(c.npcDialogueState){c.revealNpcDialogueText();if(c.npcDialogueState.selected){c.closeNpcDialogueAndContinue();continue}const opts=c.npcDialogueState.options;const i=c.state.index===24&&c.npcDialogueState.nodeId==='consent'?(copy?1:3):opts.findIndex(o=>!c.reason(o)&&!o.combat);assert.ok(i>=0);c.selectNpcDialogueChoice(i);continue}
  if(c.activeCrate()){if(c.activeCrate().phase==="waiting"){const timer=a.timers.get(c.crateNoticeTimer);assert.ok(timer);timer.fn();}else c.leaveCrate();continue}
  if(c.pending){c.advance();continue}
  if(c.state.refuge.active){c.acceptStarterKit();c.restAtRefuge();c.rejoinAtRefuge();c.confirmLeaveRefuge();continue}
  visited.add(c.state.index);const choices=c.eventDisplay(c.events[c.state.index],c.state.index).choices;
  const i=choices.findIndex(o=>!c.reason(o)&&!o.roll);assert.ok(i>=0,'legal deterministic choice at '+c.state.index);c.choose(i);
 }
 assert.ok(c.state.finished,'campaign terminates '+JSON.stringify({index:c.state.index,npc:c.npcDialogueState&&[c.npcDialogueState.nodeId,c.npcDialogueState.selected],route:c.routeNarrativeState&&c.routeNarrativeState.sceneIndex,crate:c.activeCrate(),refuge:c.state.refuge.active}));assert.equal(visited.size,26);assert.equal(c.state.ending,copy?'archive':'testimony');assert.equal(c.state.index,26);
 const saved=boot(a.storage).ctx;assert.ok(saved.load());assert.equal(saved.state.ending,c.state.ending);assert.deepEqual(JSON.parse(JSON.stringify(saved.state.finaleResolution)),JSON.parse(JSON.stringify(c.state.finaleResolution)));
});
