const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function session(){const a=boot();a.ctx.gameSessionActive=true;a.ctx.state.introCompleted=true;for(const n of a.nodes.values())n.classList.add('hidden');return a}
function terminalIrene(c,index){c.state.index=24;c.choose(0);c.advance();c.revealNpcDialogueText();c.selectNpcDialogueChoice(0);c.revealNpcDialogueText();c.selectNpcDialogueChoice(index)}
function battle(c,index,choice){c.state.index=index;const ev=c.eventDisplay(c.events[index],index);c.choose(choice);assert.ok(c.battleState);return ev}
function close(c){c.state.index=26;c.pending=null;c.battleState=null;c.render()}
test('five closures arise from facts; morale, threat and direct menu input cannot select another ending',()=>{
 const cases=[['broadcast',{towerEvidenceCopied:true,relayPrepared:true,antennaHeld:true}],['fragment',{towerEvidenceCopied:true,relayPrepared:true,weakBroadcast:true}],['pact',{towerEvidenceCopied:true,veraExtractionReserved:true}],['archive',{towerEvidenceCopied:true}],['testimony',{}]];
 for(const [kind,flags]of cases)for(const morale of [0,100]){const a=session(),c=a.ctx;c.state.flags=flags;c.state.morale=morale;c.state.threat=100-morale;close(c);assert.equal(c.state.ending,kind);assert.equal(c.endingTier(kind).id,'normal');assert.equal(c.eventDisplay(c.events[26],26).choices.length,0);const before=JSON.stringify(c.state);c.choose(2);c.render();assert.equal(JSON.stringify(c.state),before);assert.equal(JSON.parse(a.storage.get(c.KEY)).ending,kind)}
});
test('Vera agreement is prepared earlier and physical relay realignment cancels it',()=>{
 const c=session().ctx;c.state.index=17;c.choose(3);assert.ok(c.state.flags.veraExtractionReserved);assert.equal(c.pending.dialogue,null);c.advance();c.state.index=20;c.placePartyItem('battery',1);c.choose(3);assert.equal(c.state.flags.relayPrepared,true);assert.equal(c.state.flags.veraExtractionReserved,false);
});
test('Irene speaks before any copy or irreversible effect; consent and the consequence are displayed separately',()=>{
 const a=session(),c=a.ctx;c.state.index=24;c.choose(0);assert.ok(!c.state.flags.ireneDied);assert.ok(!c.state.flags.towerEvidenceCopied);c.advance();assert.match(c.npcDialogueState.lines[0],/Yo puse la señal/);c.revealNpcDialogueText();c.selectNpcDialogueChoice(0);assert.match(c.npcDialogueState.lines.join(' '),/no podrá revertirlo/);assert.ok(!c.state.flags.ireneDied);c.revealNpcDialogueText();c.selectNpcDialogueChoice(1);assert.ok(c.state.flags.ireneDied);assert.ok(c.state.flags.towerEvidenceCopied);assert.match(a.nodes.get('npcDialogueText').textContent,/Cuando el soporte se detiene/);const before=JSON.stringify(c.state);c.selectNpcDialogueChoice(2);assert.equal(JSON.stringify(c.state),before);
});
test('Irene portable support consumes a real battery and refusing to copy cannot produce evidence',()=>{
 const c=session().ctx;c.state.index=24;const portable=c.ireneFinalDialogue.nodes.consent.options[0];c.removePartyItem('battery',100);assert.ok(c.reason(portable));c.placePartyItem('battery',1);terminalIrene(c,0);assert.equal(c.stockCount('battery'),0);assert.equal(c.state.flags.irenePortable,true);
 const d=session().ctx;terminalIrene(d,3);assert.ok(!d.state.flags.towerEvidenceCopied);close(d);assert.equal(d.state.ending,'testimony');
});
test('holding a position completes on the required round, grants no loot or imaginary enemy deaths, and cannot repeat',()=>{
 for(const [choice,rounds]of [[0,3],[3,2]]){const a=session(),c=a.ctx;battle(c,23,choice);const enemies=c.state.stats.enemies,loot=c.state.stats.loot;c.battleState.round=rounds-1;assert.equal(c.finaleObjectiveRound(),false);c.battleState.round=rounds;assert.equal(c.finaleObjectiveRound(),true);assert.equal(c.battleState,null);assert.equal(c.state.stats.enemies,enemies);assert.equal(c.state.stats.loot,loot);assert.equal(c.pending.crate,undefined);const before=JSON.stringify(c.state);assert.equal(c.finaleObjectiveRound(),false);assert.equal(JSON.stringify(c.state),before);if(choice===3){assert.ok(c.state.flags.safeExit);assert.ok(c.state.flags.antennaLost)}else assert.ok(c.state.flags.antennaHeld)}
});
test('tower defeat continues to Irene with an unusable antenna instead of replaying the siege',()=>{
 const a=session(),c=a.ctx;battle(c,23,0);c.state.party.forEach(p=>p.hp=0);c.state.morale=0;c.loseCombat(false);assert.ok(c.state.flags.antennaLost);assert.equal(c.state.refuge.active,false);assert.equal(c.pending.returnToRefuge,null);assert.ok(c.state.party.every(p=>p.hp>=1));c.advance();assert.equal(c.state.index,24);assert.equal(c.state.refuge.active,false);
});
test('last retreat preserves copy and Irene only with a prepared exit; lost tower files are removed without deleting earlier documents',()=>{
 for(const safe of [true,false]){const c=session().ctx;c.state.docs=['signal'];c.placePartyItem('battery',1);terminalIrene(c,0);c.closeNpcDialogueAndContinue();c.state.flags.safeExit=safe;battle(c,25,2);c.loseCombat(true);assert.equal(c.state.flags.towerEvidenceLost,!safe);assert.equal(c.state.flags.ireneLostInEscape,!safe);if(!safe)assert.deepEqual(Array.from(c.state.docs),['signal']);c.advance();assert.equal(c.state.ending,safe?'archive':'testimony');assert.match(c.state.finaleResolution.story.group,safe?/Irene entra/:/quedó atrás/)}
});
test('old completed saves retain their original ending; ongoing old tower saves migrate actual copied and transmitted facts',()=>{
 const a=session(),c=a.ctx;c.state.index=26;c.state.finished=true;c.state.ending='return';delete c.state.finaleRevision;c.save();const old=boot(a.storage).ctx;assert.ok(old.load());assert.equal(old.state.finaleRevision,0);assert.equal(old.state.ending,'return');
 c.state.finished=false;c.state.flags={carryTruth:true};c.save();const ongoing=boot(a.storage).ctx;ongoing.gameSessionActive=true;assert.ok(ongoing.load());ongoing.render();assert.equal(ongoing.state.ending,'archive');assert.ok(ongoing.state.flags.ireneDied);
 c.state.flags={fullBroadcast:true};c.save();const broadcast=boot(a.storage).ctx;broadcast.gameSessionActive=true;assert.ok(broadcast.load());broadcast.render();assert.equal(broadcast.state.ending,'broadcast');
});
test('reload before resolving Irene restores the checkpoint; completed resolution and payment persist without duplication',()=>{
 const a=session(),c=a.ctx;c.state.index=24;c.save();terminalIrene(c,1);const checkpoint=boot(a.storage).ctx;assert.ok(checkpoint.load());assert.equal(checkpoint.state.index,24);assert.ok(!checkpoint.state.flags.ireneDied);
 c.closeNpcDialogueAndContinue();c.state.flags.veraExtractionReserved=true;close(c);const saved=JSON.stringify(c.state.finaleResolution),food=c.stockCount('food');const loaded=boot(a.storage).ctx;loaded.gameSessionActive=true;assert.ok(loaded.load());loaded.render();assert.equal(JSON.stringify(loaded.state.finaleResolution),saved);assert.equal(loaded.stockCount('food'),food);
});
test('the downloadable tower graph uses the same resolved ending and masks the other closures',()=>{
 const c=session().ctx;c.state.flags={towerEvidenceCopied:true};close(c);const graph=c.narrativeGraph('towerFinale');assert.equal(graph.nodes.filter(n=>n.column===3&&n.seen).length,1);assert.equal(graph.nodes.find(n=>n.seen&&n.column===3).label,c.state.finaleResolution.story.title);c.narrativeMapRoute='towerFinale';assert.match(c.narrativeMapPanel(),/El desenlace de la torre/);
});
test('the real enemy round loop resolves the hold objective and the ending screen exposes its map download',()=>{
 const a=session(),c=a.ctx;battle(c,23,3);c.random=()=>0;c.battleState.round=2;c.enemyPhase();
 for(let n=0;c.battleState&&n<100;n++){const next=Array.from(a.timers.entries()).find(([,t])=>!t.interval);assert.ok(next,'pending combat callback');a.timers.delete(next[0]);next[1].fn()}
 assert.equal(c.battleState,null);assert.ok(c.state.flags.evacuationPrepared);c.pending=null;close(c);assert.equal(a.nodes.get('downloadFinalMap').classList.contains('hidden'),false);assert.equal(a.nodes.get('downloadSummaryMap').classList.contains('hidden'),false);
});
