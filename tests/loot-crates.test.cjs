const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');
const json=x=>JSON.parse(JSON.stringify(x));
function session(storage=new Map()){
  const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  Object.defineProperty(document,'activeElement',{configurable:true,writable:true,value:null});
  window.HTMLElement.prototype.focus=function(){document.activeElement=this};
  window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
  const a=boot(storage,{document}),c=a.ctx;c.gameSessionActive=true;c.state.introCompleted=true;
  for(const n of document.querySelectorAll('.overlay,.title-screen,.drawer'))n.classList.add('hidden');
  return Object.assign(a,{document,click(node){assert.ok(node);node.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}))}});
}
function encounter(type='electronic'){
  const a=session(),c=a.ctx;c.state.index=2;
  c.pending={ending:null,returnToRefuge:null,dialogue:null,dialogueSeen:true};
  c.pending.crate={version:1,index:2,type,location:'Estación Los Héroes',phase:'help',helpReturn:'playing',board:c.crateBoard(2),failures:0,spareUsed:false,lastProbe:null,history:[],drops:c.crateRewards(type),owner:0,message:'',outcome:null};
  c.openPendingCrate();return a;
}
function flash(a){const id=a.ctx.crateFlashTimer,t=a.timers.get(id);assert.ok(t);a.timers.delete(id);t.fn()}
function solve(c){const b=c.activeCrate().board;for(let bits=0;bits<1<<b.masks.length;bits++){let value=b.initial;b.masks.forEach((m,i)=>{if(bits&(1<<i))value^=m});if(value===b.target){for(let i=0;i<b.masks.length;i++)if(!!(bits&(1<<i))!==!!(b.switches&(1<<i)))c.toggleCrateSwitch(i);return}}throw Error('No solution')}
function wrong(c){const b=c.activeCrate().board;for(let i=0;i<b.masks.length;i++){const v=b.current^b.masks[i];if(v!==b.target&&v!==c.activeCrate().lastProbe){c.toggleCrateSwitch(i);c.probeCrate();return}}throw Error('Cannot produce wrong guess')}

test('generated boards have one reachable solution, at least two switches, even for constant RNG',()=>{
  const c=session().ctx;
  for(let day=1;day<=3;day++)for(let trial=0;trial<100;trial++){
    const b=c.crateBoard(day),solutions=[];for(let bits=0;bits<1<<b.masks.length;bits++){
      let n=b.initial;b.masks.forEach((mask,i)=>{if(bits&(1<<i))n^=mask});if(n===b.target)solutions.push(bits);
    }
    assert.equal(solutions.length,1);assert.ok(c.cratePopcount(solutions[0])>=2);assert.notEqual(b.initial,b.target);
  }
  c.random=()=>0;assert.ok(c.crateBoard(3));
});
test('context filters exclude flight, failed checks, conversations and incompatible types; cooldown persists',()=>{
  const c=session().ctx,station=c.events[2],gal=c.events[5];
  assert.equal(c.crateCandidate(station,station.choices[1],station.choices[1]),'electronic');
  assert.equal(c.crateCandidate(station,station.choices[2],station.choices[2]),null);
  assert.equal(c.crateCandidate(gal,gal.choices[0],gal.choices[0].roll.fail),null);
  assert.equal(c.crateCandidate(gal,gal.choices[1],gal.choices[1]),'medical');
  c.state.index=2;c.random=()=>0;c.pending={dialogue:{npc:'mara'}};c.prepareCrate(station.choices[1],station.choices[1]);assert.equal(c.pending.crate,undefined);
  c.pending={};c.prepareCrate(station.choices[1],station.choices[1]);assert.ok(c.pending.crate);
  c.pending={};c.prepareCrate(station.choices[1],station.choices[1]);assert.equal(c.pending.crate,undefined);
  c.state.index=5;c.crateStore().lastIndex=4;c.prepareCrate(gal.choices[1],gal.choices[1]);assert.equal(c.pending.crate,undefined);
});
test('real decision opens help before next scene; reload retains paid cost and closes only once',()=>{
  const a=session(),c=a.ctx;c.state.index=2;c.random=()=>0;
  const before=c.stockCount('battery');c.choose(1);assert.equal(c.stockCount('battery'),before-1);
  c.advance();assert.equal(c.state.index,2);assert.equal(c.activeCrate().phase,'help');assert.equal(c.encounterSaveLocked,false);
  const b=session(a.storage),d=b.ctx;d.continueGame();assert.equal(d.stockCount('battery'),before-1);assert.equal(d.activeCrate().phase,'help');
  d.leaveCrate();assert.equal(d.state.index,3);assert.equal(d.activeCrate(),null);d.leaveCrate();assert.equal(d.state.index,3);
  const e=session(a.storage).ctx;e.continueGame();assert.equal(e.state.index,3);assert.equal(e.activeCrate(),null);
});
test('all three crates show help before play and buttons toggle lights without using attempts',()=>{
  for(const type of ['electronic','ammo','medical']){
    const a=encounter(type),c=a.ctx,d=a.document;assert.equal(c.activeCrate().phase,'help');
    a.click(d.getElementById('cratePrimary'));assert.equal(c.activeCrate().phase,'playing');
    const before=c.activeCrate().board.current;a.click(d.querySelector('[data-crate-switch="0"]'));
    assert.notEqual(c.activeCrate().board.current,before);assert.equal(c.activeCrate().failures,0);
    assert.equal(d.querySelector('[data-crate-switch="0"]').getAttribute('aria-pressed'),'true');
    c.crateHelp();assert.equal(c.activeCrate().phase,'help');c.cratePrimary();assert.equal(c.activeCrate().failures,0);
    assert.match(d.getElementById('crateArt').style.backgroundImage,/crates\//);
  }
});
test('fifth wrong combination flashes, offers one spare; one more wrong check seals permanently',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();
  for(let i=0;i<4;i++){wrong(c);assert.equal(c.activeCrate().phase,'playing');assert.equal(c.activeCrate().failures,i+1)}
  wrong(c);assert.equal(c.activeCrate().phase,'blown');assert.equal(c.activeCrate().failures,5);
  assert.equal(a.nodes.get('crateModal').classList.contains('fuse-flash'),true);
  const before=json(c.activeCrate());c.probeCrate();c.toggleCrateSwitch(0);c.leaveCrate();assert.deepEqual(json(c.activeCrate()),before);
  flash(a);assert.equal(c.activeCrate().phase,'failed');assert.match(a.nodes.get('crateFailureText').textContent,/Elías tiene un fusible/);
  c.cratePrimary();assert.equal(c.activeCrate().spareUsed,true);assert.equal(c.activeCrate().phase,'playing');
  wrong(c);flash(a);assert.equal(c.activeCrate().phase,'sealed');assert.equal(c.activeCrate().failures,6);
  c.cratePrimary();assert.equal(c.activeCrate().phase,'sealed');assert.equal(a.nodes.get('cratePrimary').classList.contains('hidden'),true);
  c.leaveCrate();assert.equal(c.crateStore().checked['2'],'sealed');assert.equal(c.state.index,3);
});
test('reload during fuse flash resumes failure and cannot restore spent attempts or spare',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();for(let i=0;i<5;i++)wrong(c);
  const b=session(a.storage),d=b.ctx;d.continueGame();assert.equal(d.activeCrate().phase,'failed');assert.equal(d.activeCrate().failures,5);
  d.cratePrimary();const e=session(a.storage);e.ctx.continueGame();assert.equal(e.ctx.activeCrate().spareUsed,true);
  wrong(e.ctx);const f=session(a.storage);f.ctx.continueGame();assert.equal(f.ctx.activeCrate().phase,'sealed');
});
test('spare can open the original puzzle; rewards were fixed before play and survive reload',()=>{
  const a=encounter('medical'),c=a.ctx,initial=json(c.activeCrate());c.cratePrimary();for(let i=0;i<5;i++)wrong(c);flash(a);c.cratePrimary();
  assert.equal(c.activeCrate().board.target,initial.board.target);solve(c);c.probeCrate();
  assert.equal(c.activeCrate().phase,'loot');assert.deepEqual(json(c.activeCrate().drops),initial.drops);
  assert.equal(a.nodes.get('crateArt').classList.contains('opened'),true);
  const b=session(a.storage);b.ctx.continueGame();assert.equal(b.ctx.activeCrate().phase,'loot');assert.deepEqual(json(b.ctx.activeCrate().drops),initial.drops);
});
test('unchanged guess and repeated input cannot consume multiple attempts',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();c.probeCrate();assert.equal(c.activeCrate().failures,1);c.probeCrate();c.probeCrate();assert.equal(c.activeCrate().failures,1);
  solve(c);c.probeCrate();const snapshot=JSON.stringify(c.state);c.probeCrate();c.cratePrimary();assert.equal(JSON.stringify(c.state),snapshot);
});
test('loot fits available capacity, can be split among allies, inspected and never collected twice',()=>{
  const a=encounter('ammo'),c=a.ctx,d=a.document;c.cratePrimary();solve(c);c.probeCrate();
  const chest=c.activeCrate();chest.drops=[{id:'ammo9',qty:4,status:'pending'}];
  c.state.party[0].bag=[{id:'food',qty:c.bagCapacity(c.state.party[0])-1}];chest.owner=0;c.renderCrate();
  a.click(d.querySelector('[data-crate-info="ammo9"]'));assert.equal(c.itemDetailState.id,'ammo9');assert.equal(d.getElementById('crateModal').hasAttribute('inert'),true);
  c.closeItemDetails();const before=c.state.stats.loot;a.click(d.querySelector('[data-crate-take="0"]'));assert.equal(chest.drops[0].taken,1);assert.equal(c.bagFree(c.state.party[0]),0);
  a.click(d.querySelector('[data-crate-owner="1"]'));a.click(d.getElementById('crateAll'));assert.equal(chest.drops[0].taken,4);assert.equal(c.state.stats.loot,before+4);
  const b=session(a.storage);b.ctx.continueGame();b.ctx.takeAllCrateLoot();assert.equal(b.ctx.state.stats.loot,before+4);
  b.ctx.leaveCrate();assert.equal(b.ctx.state.index,3);assert.equal(b.ctx.activeCrate(),null);
});
test('full bags do not lose loot; leaving uncollected items requires an explicit second press',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();solve(c);c.probeCrate();
  c.state.party.forEach(p=>p.bag=[{id:'scrap',qty:c.bagCapacity(p)}]);const before=json(c.activeCrate().drops);c.takeAllCrateLoot();assert.deepEqual(json(c.activeCrate().drops),before);
  c.leaveCrate();assert.ok(c.activeCrate());assert.equal(c.state.index,2);c.leaveCrate();assert.equal(c.state.index,3);
});
test('timer, browser Back and narrative shortcuts cannot bypass the chest; new game invalidates timers',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=10000;
  c.signalGlobalTick();assert.equal(c.state.inhibitor.remainingMs,10000);assert.equal(c.openSignalHack('manual'),false);
  c.advance();assert.equal(c.state.index,2);c.NeoBackNavigation.handleBack();assert.equal(c.state.index,2);
  const snapshot=JSON.stringify(c.state);for(const key of ['1','2','3'])a.document.dispatchEvent(Object.assign(new a.document.defaultView.Event('keydown'),{key}));assert.equal(JSON.stringify(c.state),snapshot);
  for(let i=0;i<5;i++)wrong(c);const callback=a.timers.get(c.crateFlashTimer).fn;c.newGame();const fresh=JSON.stringify(c.state);callback();assert.equal(JSON.stringify(c.state),fresh);assert.equal(c.crateVisible(),false);
});
test('loot tables use existing objects with contextual restrictions and uncommon weapons',()=>{
  const c=session().ctx,allowed={electronic:['battery','electronics','emp','pulseCore'],ammo:['ammo9','ammo556','shell12','grenade','pistol9','revolver','shotgun12','rifle556'],medical:['bandage','medkit','meds','stimulant']};let weapons=0;
  for(let i=0;i<600;i++)for(const type of Object.keys(allowed))for(const drop of c.crateRewards(type)){
    assert.ok(allowed[type].includes(drop.id));assert.ok(c.gear(drop.id));assert.ok(fs.existsSync(path.join(root,'items',(c.gear(drop.id).art||drop.id)+'.webp')));assert.ok(drop.qty>0);
    if(c.gear(drop.id).kind==='weapon')weapons++;
  }
  assert.ok(weapons>0&&weapons<60);assert.ok(c.disassemblyRecipe('battery'));assert.match(c.itemPurpose('battery'),/90 segundos/);
  assert.equal(c.tradeCatalog.battery.buy,8);assert.equal(c.tradeCatalog.battery.sell,4);
});
