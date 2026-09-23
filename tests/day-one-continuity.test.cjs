const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function session(){const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=c.state.storyPreludeSeen=c.state.starterKitGiven=c.state.economyHelpSeen=true;c.state.activity='story';for(const n of a.nodes.values())n.classList.add('hidden');return a;}
function arrive(c,reason=null){c.state.index=c.events.findIndex(e=>e.day===2)-1;c.pending={ending:null,returnToRefuge:reason};c.continuePendingAdvance();}
function resources(c){return JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,credits:c.state.credits,rests:c.state.stats.rests,items:c.state.stats.itemsUsed,history:c.state.history});}

test('first night leads to preparation without a second heal, ration, reward or skipped scene',()=>{
 const a=session(),c=a.ctx;c.state.party.forEach(p=>p.hp=20);arrive(c);c.settleNight('share');const paid=resources(c);
 assert.equal(c.continueAfterNight(),true);assert.equal(c.state.refuge.reason,'preparation');assert.equal(c.state.refuge.active,true);assert.equal(c.state.refuge.rested,true);assert.equal(c.state.refuge.rejoined,true);assert.equal(c.state.stats.refugeVisits,1);assert.equal(resources(c),paid);
 c.restAtRefuge();c.rejoinAtRefuge();c.choose(0);assert.equal(c.continueAfterNight(),false);assert.equal(resources(c),paid);assert.equal(c.state.index,9);
 assert.equal(a.nodes.get('refugeRest').disabled,true);assert.equal(a.nodes.get('refugeRejoin').disabled,true);assert.match(a.nodes.get('leaveRefuge').textContent,/día 2/);
 assert.equal(c.confirmLeaveRefuge(),true);assert.equal(c.confirmLeaveRefuge(),false);assert.equal(c.state.index,9);assert.equal(resources(c),paid);
});

test('saving a food ration stays meaningful at the new preparation stop',()=>{
 const a=session(),c=a.ctx;arrive(c);c.settleNight('save-food');const paid=resources(c),energy=c.state.party.map(p=>p.hunger);c.continueAfterNight();c.restAtRefuge();c.rejoinAtRefuge();assert.equal(resources(c),paid);assert.deepEqual(c.state.party.map(p=>p.hunger),energy);
 const b=boot(a.storage).ctx;b.continueGame();assert.equal(b.state.refuge.reason,'preparation');b.restAtRefuge();b.rejoinAtRefuge();assert.equal(resources(b),paid);
});

test('return account remains a saved observation through trader switches and reloads',()=>{
 const a=session(),c=a.ctx;c.state.flags={leftSupplies:true,pumpAbandoned:true};arrive(c);const account=c.pendingNight().returnAccount;c.settleNight('share');c.continueAfterNight();assert.match(account,/no lo cuenta entre quienes llegaron/);assert.match(account,/sin asegurarla/);
 c.state.flags.matiasAtRefuge=true;c.switchRefugeNpc('armorer');assert.equal(a.nodes.get('refugeReturnText').textContent,account);assert.doesNotMatch(account,/Matías quedó en la enfermería/);
 const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.nodes.get('refugeReturnText').textContent,account);assert.equal(b.ctx.state.refuge.npc,'armorer');assert.equal(b.ctx.state.stats.refugeVisits,1);
});

test('day-two shop purchases survive preparation reload and do not restock when switching activities',()=>{
 const a=session(),c=a.ctx;arrive(c);c.settleNight('share');c.continueAfterNight();const stock=c.state.tradeStock.food,credits=c.state.credits=20;c.buyTradeItem('food');assert.equal(c.state.tradeStock.food,stock-1);const after=resources(c),remaining=c.state.credits;assert.ok(remaining<credits);
 c.switchRefugeNpc('armorer');c.switchRefugeNpc('mara');c.openActivityMenu();c.resumeStoryActivity();assert.equal(c.state.tradeStock.food,stock-1);assert.equal(resources(c),after);
 const b=boot(a.storage).ctx;b.continueGame();assert.equal(b.state.tradeStock.food,stock-1);assert.equal(b.state.credits,remaining);assert.equal(b.state.stats.refugeVisits,1);
});

test('legacy pending nights retain their text and closed legacy nights are never reopened',()=>{
 const a=session(),c=a.ctx;arrive(c);c.settleNight('share');const old=JSON.parse(a.storage.get(c.KEY));delete old.expeditionRest.nights[1].returnAccount;old.expeditionRest.nights[1].context='Noche V0.2 guardada.';a.storage.set(c.KEY,JSON.stringify(old));
 const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.pendingNight().context,'Noche V0.2 guardada.');const before=resources(b.ctx);b.ctx.continueAfterNight();assert.equal(resources(b.ctx),before);assert.equal(b.nodes.get('refugeReturnAccount').classList.contains('hidden'),true);
 b.ctx.confirmLeaveRefuge();const d=boot(a.storage).ctx;d.continueGame();assert.equal(d.pendingNight(),null);assert.equal(d.state.refuge.active,false);assert.equal(d.state.index,9);assert.equal(resources(d),before);
});

test('malformed optional return accounts reject loading without touching the original save or active state',()=>{
 const a=session(),c=a.ctx;arrive(c);const original=c.state,raw=JSON.parse(a.storage.get(c.KEY));raw.expeditionRest.nights[1].returnAccount={rescued:true};const bytes=JSON.stringify(raw);a.storage.set(c.KEY,bytes);assert.equal(c.load(),false);assert.equal(c.state,original);assert.equal(a.storage.get(c.KEY),bytes);
});

test('retreat recovery remains available and a later defeat does not inherit preparation locks',()=>{
 const a=session(),c=a.ctx;arrive(c);c.settleNight('share');c.continueAfterNight();c.confirmLeaveRefuge();c.state.party.forEach(p=>{p.hp=0;p.hunger=0});c.state.morale=0;c.removePartyItem('food',100);c.openRefuge('exhausted');assert.equal(c.state.refuge.rested,false);assert.equal(c.state.refuge.rejoined,false);c.restAtRefuge();c.rejoinAtRefuge();assert.equal(c.refugeCanLeave(),true);assert.equal(c.state.stats.rests,2);assert.equal(a.nodes.get('refugeRest').textContent,'Descansar y estabilizar');
});

test('orientation reads the present sector without leaking future locations or mutating the save',()=>{
 const a=session(),c=a.ctx;const locations=[];for(let i=0;i<9;i++){c.state.index=i;const ev=c.eventDisplay(c.events[i],i),before=JSON.stringify(c.state);c.renderExpeditionOrientation(ev);assert.equal(JSON.stringify(c.state),before);assert.equal(a.nodes.get('expeditionOrientation').classList.contains('hidden'),false);assert.equal(a.nodes.get('expeditionSector').textContent,'Sector actual: '+ev.loc+'.');assert.ok(a.nodes.get('expeditionPurpose').textContent);locations.push(ev.loc);}
 c.state.index=9;c.renderExpeditionOrientation(c.events[9]);assert.equal(a.nodes.get('expeditionOrientation').classList.contains('hidden'),true);assert.equal(new Set(locations).size,9);
});
