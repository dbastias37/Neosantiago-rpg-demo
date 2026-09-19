const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function session(){const a=boot(),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.storyPreludeSeen=true;c.state.starterKitGiven=true;c.state.activity='story';for(const n of a.nodes.values())n.classList.add('hidden');return a;}
function arrive(a,day=1,reason=null){const c=a.ctx;c.state.index=c.events.findIndex(e=>e.day===day+1)-1;c.pending={ending:null,returnToRefuge:reason};c.encounterSaveLocked=true;c.continuePendingAdvance();}
function snapshot(c){return JSON.stringify({party:c.state.party,res:c.state.res,morale:c.state.morale,stats:c.state.stats,history:c.state.history,uses:[c.state.medicalUses,c.state.engineeringUses,c.state.ordnanceUses]});}

test('night pauses before spending, forecasts both resources, blocks next scene and survives reload',()=>{
 const a=session(),c=a.ctx,before=snapshot(c);arrive(a);assert.equal(snapshot(c),before);assert.equal(c.pendingNight().phase,'planning');assert.match(a.nodes.get('nightChanges').innerHTML,/1 ración · 1 agua/);assert.equal(c.continueAfterNight(),false);
 c.choose(0);assert.equal(snapshot(c),before);const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.pendingNight().phase,'planning');assert.equal(b.nodes.get('night').classList.contains('hidden'),false);assert.equal(snapshot(b.ctx),before);assert.equal(b.ctx.signalPauseActive(),true);
});

test('sharing consumes one food and water for the group, shows capped recovery, persists a receipt and pays once',()=>{
 const a=session(),c=a.ctx;c.state.party[0].hp=0;c.state.party[1].hp=10;c.state.party[2].hp=c.state.party[2].maxHp-2;c.state.party.forEach(p=>p.hunger=95);c.state.medicalUses=0;
 const food=c.stockCount('food'),water=c.stockCount('water');arrive(a);assert.equal(c.settleNight('share'),true);assert.equal(c.stockCount('food'),food-1);assert.equal(c.stockCount('water'),water-1);assert.equal(c.state.stats.itemsUsed.water,1);assert.equal(c.state.stats.restHpRecovered,22);assert.equal(c.state.party[0].hp,12);assert.equal(c.state.party[1].hp,18);assert.equal(c.state.party[2].hp,c.state.party[2].maxHp);assert.ok(c.state.party.every(p=>p.hunger===100));assert.match(a.nodes.get('nightChanges').innerHTML,/energía \+5/);assert.equal(c.state.medicalUses,3);
 const after=snapshot(c);assert.equal(c.settleNight('share'),false);c.night(1);assert.equal(snapshot(c),after);
 const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.pendingNight().phase,'settled');assert.equal(snapshot(b.ctx),after);assert.equal(b.ctx.settleNight('save-food'),false);assert.equal(b.ctx.continueAfterNight(),true);assert.equal(b.ctx.continueAfterNight(),false);assert.equal(b.ctx.pendingNight(),null);assert.equal(snapshot(b.ctx),after);
});

test('conserving food is a real tradeoff without hidden water or morality bonuses',()=>{
 const a=session(),c=a.ctx,food=c.stockCount('food'),water=c.stockCount('water'),energy=c.state.party.map(p=>p.hunger),morale=c.state.morale;arrive(a);c.settleNight('save-food');assert.equal(c.stockCount('food'),food);assert.equal(c.stockCount('water'),water-1);assert.equal(c.state.morale,morale-5);c.state.party.forEach((p,i)=>assert.equal(p.hunger,energy[i]-8));assert.equal(c.state.stats.itemsUsed.food,undefined);assert.equal(c.pendingNight().choice,'save-food');assert.match(c.pendingNight().receipt.text,/ración queda sellada/);
});

test('all supply combinations have accurate costs and no negative inventory',()=>{
 for(const food of [0,1])for(const water of [0,1]){const a=session(),c=a.ctx;c.removePartyItem('food',100);if(food)c.placePartyItem('food',1);c.state.res.water=water;const morale=c.state.morale;arrive(a);const forecast=c.nightForecast('share');assert.equal(forecast.food,food);assert.equal(forecast.water,water);c.settleNight('share');assert.equal(c.stockCount('food'),0);assert.equal(c.stockCount('water'),0);assert.equal(c.state.morale,morale-(food?0:5)-(water?0:8));assert.equal(c.state.stats.rests,1);assert.match(a.nodes.get('nightChanges').innerHTML,new RegExp(food+' ración · '+water+' agua'));}
});

test('a retreat on a day boundary cannot skip the night and returns to refuge after acknowledging',()=>{
 const a=session(),c=a.ctx;arrive(a,1,'fled');assert.equal(c.state.refuge.active,false);assert.equal(c.pendingNight().returnToRefuge,'fled');const b=boot(a.storage);b.ctx.continueGame();b.ctx.settleNight('share');assert.equal(b.ctx.state.stats.rests,1);b.ctx.continueAfterNight();assert.equal(b.ctx.state.refuge.active,true);assert.equal(b.ctx.state.refuge.reason,'fled');assert.equal(b.ctx.pendingNight(),null);assert.equal(b.ctx.state.index,9);
});

test('a depleted group can recover at refuge after the night without money or spare supplies',()=>{
 const a=session(),c=a.ctx;c.removePartyItem('food',100);c.state.res.water=0;c.state.morale=4;c.state.credits=0;c.state.party.forEach(p=>{p.hp=0;p.hunger=0});arrive(a);c.settleNight('share');c.continueAfterNight();assert.equal(c.state.refuge.active,true);assert.equal(c.refugeCanLeave(),false);c.restAtRefuge();c.rejoinAtRefuge();assert.equal(c.refugeCanLeave(),true);assert.equal(c.state.credits,0);assert.equal(c.confirmLeaveRefuge(),true);
});

test('night prose remembers facts without inventing safety or reversing Lira death',()=>{
 const a=session(),c=a.ctx;c.state.flags.matiasRadioAlly=true;arrive(a);assert.match(c.pendingNight().context,/no lo confunde con una confirmación/);c.settleNight('share');c.continueAfterNight();c.state.flags.liraDead=true;c.state.flags.savedMerodeadora=true;arrive(a,2);assert.match(c.pendingNight().context,/no lo arreglamos durmiendo/);assert.doesNotMatch(c.pendingNight().context,/La atendimos/);const before=c.pendingNight().context;c.state.flags.liraDead=false;c.showNight();assert.equal(c.pendingNight().context,before);
});

test('second night closes once, reserve forecast changes by day, and legacy saves do not replay past nights',()=>{
 const a=session(),c=a.ctx;assert.match(c.expeditionReserveText(),/9 situaciones/);assert.match(c.expeditionReserveText(),/1 ración y 1 agua para todo el grupo/);arrive(a,2);c.settleNight('share');c.continueAfterNight();assert.match(c.expeditionReserveText(),/no hay otro consumo nocturno/);c.save();const old=JSON.parse(a.storage.get(c.KEY));delete old.expeditionRest;a.storage.set(c.KEY,JSON.stringify(old));const b=boot(a.storage);b.ctx.continueGame();assert.equal(b.ctx.pendingNight(),null);assert.equal(b.ctx.state.stats.rests,1);assert.equal(b.ctx.stockCount('water'),c.stockCount('water'));assert.deepEqual(Object.keys(b.ctx.state.expeditionRest.nights),[]);
});

test('night focus and numeric shortcuts cannot trigger a campaign choice or silently confirm rest',()=>{
 const a=session(),c=a.ctx;arrive(a);a.nodes.get('nightReading').classList.remove('hidden');const before=snapshot(c);let prevented=0;
 for(const key of ['Escape','1','2','3'])assert.equal(c.nightKeydown({key,preventDefault(){prevented++}}),true);assert.equal(prevented,4);assert.equal(snapshot(c),before);
 a.nodes.get('nightKeep').focus();c.nightKeydown({key:'Tab',preventDefault(){}});assert.equal(c.document.activeElement,a.nodes.get('nightReading'));c.nightKeydown({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(c.document.activeElement,a.nodes.get('nightKeep'));
});

test('activity switching resumes the pending night and a new game clears it',()=>{
 const a=session(),c=a.ctx;arrive(a);c.openActivityMenu();c.resumeStoryActivity();assert.equal(c.pendingNight().phase,'planning');assert.equal(a.nodes.get('night').classList.contains('hidden'),false);c.newGame();assert.equal(c.pendingNight(),null);assert.equal(c.settleNight('share'),false);assert.equal(c.state.stats.rests,0);
});

test('malformed night receipts and impossible pending days are rejected without replacing stored data',()=>{
 for(const change of [n=>n.phase='paid',n=>n.day=2,n=>n.choice='share',n=>{n.phase='settled';n.choice='share';n.receipt={text:'x',changes:[null]}}]){const a=session();arrive(a);const raw=JSON.parse(a.storage.get(a.ctx.KEY));change(raw.expeditionRest.nights[1]);const text=JSON.stringify(raw);a.storage.set(a.ctx.KEY,text);assert.equal(boot(a.storage).ctx.load(),false);assert.equal(a.storage.get(a.ctx.KEY),text);}
});

test('real DOM controls confirm a rest only once, keep the reading panel and reveal the next-day action',()=>{
 const fs=require('node:fs'),path=require('node:path'),{parseHTML}=require('linkedom'),{root}=require('./runtime-harness.cjs');
 const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));let focused;Object.defineProperty(document,'activeElement',{get:()=>focused});window.HTMLElement.prototype.focus=function(){focused=this};
 const a=boot(new Map(),{document}),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;c.state.starterKitGiven=true;c.state.activity='story';document.querySelectorAll('.overlay,.title-screen').forEach(n=>n.classList.add('hidden'));arrive(a);
 const click=id=>document.getElementById(id).dispatchEvent(new window.Event('click',{bubbles:true}));
 assert.equal(document.getElementById('night').getAttribute('aria-labelledby'),'nightTitle');assert.equal(document.activeElement.id,'nightReading');assert.ok(document.getElementById('nextDay').classList.contains('hidden'));assert.ok(document.getElementById('nightChanges').textContent.includes('1 ración · 1 agua'));
 click('nightKeep');click('nightShare');assert.equal(c.state.stats.rests,1);assert.equal(c.pendingNight().choice,'save-food');assert.ok(document.getElementById('nightKeep').classList.contains('hidden'));assert.ok(!document.getElementById('nextDay').classList.contains('hidden'));assert.equal(document.activeElement.id,'nightReading');click('nextDay');assert.ok(document.getElementById('night').classList.contains('hidden'));assert.equal(c.pendingNight(),null);
});
