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
function encounter(type='electronic',phase='help'){
  const a=session(),c=a.ctx;c.state.index=2;
  c.pending={ending:null,returnToRefuge:null,dialogue:null,dialogueSeen:true};
  c.pending.crate={version:2,index:2,type,location:'Estación Los Héroes',phase:'waiting',helpReturn:null,board:c.crateBoard(2),moves:0,spareUsed:false,history:[],drops:c.crateRewards(type),owner:0,message:'',outcome:null};
  c.openPendingCrate();if(phase==='waiting')return a;notice(a);if(phase==='found')return a;c.cratePrimary();return a;
}
function flash(a){const id=a.ctx.crateFlashTimer,t=a.timers.get(id);assert.ok(t);a.timers.delete(id);t.fn()}
function notice(a){const id=a.ctx.crateNoticeTimer,t=a.timers.get(id);assert.ok(t);assert.equal(t.ms,1000);a.timers.delete(id);t.fn()}
function unlock(a){const id=a.ctx.crateSuccessTimer,t=a.timers.get(id);assert.ok(t);assert.equal(t.ms,1500);a.timers.delete(id);t.fn()}
function solve(c){const b=c.activeCrate().board;for(let bits=0;bits<1<<b.masks.length;bits++){let value=b.initial;b.masks.forEach((m,i)=>{if(bits&(1<<i))value^=m});if(value===b.target){for(let i=0;i<b.masks.length;i++)if(!!(bits&(1<<i))!==!!(b.switches&(1<<i)))c.toggleCrateSwitch(i);return}}throw Error('No solution')}
function wrong(c){const b=c.activeCrate().board;for(let i=0;i<b.masks.length;i++){if((b.current^b.masks[i])!==b.target){c.toggleCrateSwitch(i);return}}throw Error('Cannot produce wrong move')}

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
  assert.equal(c.crateCandidate(station,station.choices[2],station.choices[2]),'electronic');
  const retreat=c.events[4].choices[2];assert.equal(c.crateCandidate(c.events[4],retreat,retreat),null);
  assert.equal(c.crateCandidate(gal,gal.choices[0],gal.choices[0].roll.fail),null);
  assert.equal(c.crateCandidate(gal,gal.choices[1],gal.choices[1]),'medical');
  c.state.index=2;c.random=()=>0;c.pending={dialogue:{npc:'mara'}};c.prepareCrate(station.choices[1],station.choices[1]);assert.equal(c.pending.crate,undefined);
  c.pending={};c.prepareCrate(station.choices[1],station.choices[1]);assert.ok(c.pending.crate);
  c.pending={};c.prepareCrate(station.choices[1],station.choices[1]);assert.equal(c.pending.crate,undefined);
  c.state.index=5;c.crateStore().lastIndex=4;c.prepareCrate(gal.choices[1],gal.choices[1]);assert.equal(c.pending.crate,undefined);
});
test('22 expedition situations can actually queue a contextual crate without opening narrative dialogs',()=>{
  const c=session().ctx,covered=[];
  c.events.forEach((ev,index)=>{
    const available=ev.choices.some(choice=>{
      const out=choice.roll?choice.roll.success:choice.combat?choice.victory:choice;
      c.state=c.fresh();c.state.index=index;c.pending={dialogue:c.contextualDialogueFor(choice,out)};
      c.prepareCrate(choice,out);
      return !!c.pending.crate;
    });
    if(available)covered.push(index);
  });
  assert.deepEqual(covered,[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22,23,25]);
});
test('first compatible decision guarantees a box before Matias for both quiet and combat approaches',()=>{
  const c=session().ctx,station=c.events[2];
  for(const choice of station.choices){
    c.state=c.fresh();c.state.index=2;c.random=()=>.99;c.pending={};
    c.prepareCrate(choice,choice.combat?choice.victory:choice);
    assert.ok(c.pending.crate,choice.label);assert.equal(c.pending.crate.type,'electronic');
  }
});
test('subsequent encounters use 50 percent odds, preserve cooldown and cannot reroll a decision',()=>{
  const c=session().ctx,ev=c.events[10],choice=ev.choices[0];
  for(const [roll,appears] of [[.49,true],[.50,false],[.99,false]]){
    c.state=c.fresh();c.state.index=10;c.crateStore().lastIndex=2;c.pending={};c.random=()=>roll;
    c.prepareCrate(choice,choice);assert.equal(!!c.pending.crate,appears);
    c.pending={};c.random=()=>0;c.prepareCrate(choice,choice);assert.equal(c.pending.crate,undefined);
  }
  c.state=c.fresh();c.state.index=10;c.crateStore().lastIndex=8;c.pending={};c.random=()=>0;
  c.prepareCrate(choice,choice);assert.equal(c.pending.crate,undefined);
});
test('saved expeditions past Matias with no previous box get the first box at the next compatible place',()=>{
  const a=session(),c=a.ctx;c.state.index=10;c.crateStore().checked={'2':true,'5':true,'6':true};c.save();
  const b=session(a.storage),d=b.ctx;d.continueGame();d.random=()=>.99;
  const ev=d.events[10],choice=ev.choices[0];d.pending={};d.prepareCrate(choice,choice);
  assert.ok(d.pending.crate);assert.equal(d.pending.crate.location,'Escalera República');
});
test('real decision keeps its consequence readable, then waits one second for discovery; reload preserves cost',()=>{
  const a=session(),c=a.ctx;c.state.index=2;c.random=()=>0;
  const before=c.stockCount('battery');c.choose(1);assert.equal(c.stockCount('battery'),before-1);
  assert.equal(a.document.getElementById('result').classList.contains('hidden'),false);assert.equal(c.activeCrate(),null);assert.equal(c.crateNoticeTimer,null);
  c.advance();assert.equal(c.state.index,2);assert.equal(c.activeCrate().phase,'waiting');assert.equal(c.encounterSaveLocked,false);
  const b=session(a.storage),d=b.ctx;d.continueGame();assert.equal(d.stockCount('battery'),before-1);assert.equal(d.activeCrate().phase,'waiting');
  notice(b);assert.equal(d.activeCrate().phase,'found');assert.equal(d.npcDialogueState,null);assert.equal(d.routeNarrativeState,null);
  const found=session(a.storage).ctx;found.continueGame();assert.equal(found.activeCrate().phase,'found');assert.equal(found.crateNoticeTimer,null);
  d.cratePrimary();assert.equal(d.activeCrate().phase,'help');
  d.leaveCrate();assert.equal(d.state.index,3);assert.equal(d.activeCrate(),null);d.leaveCrate();assert.equal(d.state.index,3);
  const e=session(a.storage).ctx;e.continueGame();assert.equal(e.state.index,3);assert.equal(e.activeCrate(),null);
});
test('all supply types announce their location before help and the delayed notice cannot be bypassed',()=>{
  for(const type of ['electronic','ammo','medical']){
    const a=encounter(type,'waiting'),c=a.ctx,d=a.document;
    assert.equal(d.querySelector('.crate-shell').classList.contains('hidden'),true);
    assert.equal(d.getElementById('crateScreen-help').classList.contains('hidden'),true);
    c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=10000;c.signalGlobalTick();assert.equal(c.state.inhibitor.remainingMs,10000);
    let blocked=false;c.crateKeydown({key:'Tab',preventDefault(){blocked=true}});assert.equal(blocked,true);assert.equal(d.activeElement.id,'crateModal');
    const before=JSON.stringify(c.state);c.cratePrimary();c.toggleCrateSwitch(0);c.advance();c.leaveCrate();c.NeoBackNavigation.handleBack();assert.equal(JSON.stringify(c.state),before);
    notice(a);assert.equal(c.activeCrate().phase,'found');assert.equal(d.querySelector('.crate-shell').classList.contains('hidden'),false);
    assert.equal(d.getElementById('crateScreen-found').classList.contains('hidden'),false);
    assert.match(d.getElementById('crateScreen-found').textContent,/Suministro encontrado/);
    assert.equal(d.getElementById('crateLocation').textContent,'Estación Los Héroes');assert.equal(d.getElementById('crateTitle').textContent,c.crateTypes[type].title);
    assert.equal(d.getElementById('crateFoundHint').textContent,c.crateTypes[type].hint);assert.equal(d.activeElement.id,'cratePrimary');
    a.click(d.getElementById('cratePrimary'));assert.equal(c.activeCrate().phase,'help');assert.equal(c.activeCrate().moves,0);
  }
});
test('leaving a discovered supply continues once without opening its puzzle or granting loot',()=>{
  const a=encounter('ammo','found'),c=a.ctx,bags=json(c.state.party.map(p=>p.bag));
  c.leaveCrate();assert.equal(c.state.index,3);assert.equal(c.activeCrate(),null);assert.equal(c.crateStore().checked['2'],'left');
  c.leaveCrate();assert.equal(c.state.index,3);assert.deepEqual(json(c.state.party.map(p=>p.bag)),bags);
});
test('all three crates explain ten moves, charge every switch activation and preserve moves through help',()=>{
  for(const type of ['electronic','ammo','medical']){
    const a=encounter(type),c=a.ctx,d=a.document;assert.equal(c.activeCrate().phase,'help');
    assert.match(d.getElementById('crateScreen-help').textContent,/10 movimientos/);
    a.click(d.getElementById('cratePrimary'));assert.equal(c.activeCrate().phase,'playing');
    assert.equal(d.getElementById('cratePrimary').classList.contains('hidden'),true);
    assert.equal(d.activeElement.dataset.crateSwitch,'0');
    const before=c.activeCrate().board.current;a.click(d.querySelector('[data-crate-switch="0"]'));
    assert.notEqual(c.activeCrate().board.current,before);assert.equal(c.activeCrate().moves,1);
    assert.match(d.getElementById('crateAttempts').textContent,/9 movimientos restantes/);
    assert.equal(d.querySelector('[data-crate-switch="0"]').getAttribute('aria-pressed'),'true');
    a.click(d.querySelector('[data-crate-switch="0"]'));assert.equal(c.activeCrate().board.current,before);assert.equal(c.activeCrate().moves,2);
    c.crateHelp();assert.equal(c.activeCrate().phase,'help');c.toggleCrateSwitch(0);c.cratePrimary();assert.equal(c.activeCrate().moves,2);
    assert.match(d.getElementById('crateArt').style.backgroundImage,/crates\//);
  }
});
test('ten unsuccessful moves burn each fuse, then permanently fail loot without granting items',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();
  const bags=json(c.state.party.map(p=>p.bag)),loot=c.state.stats.loot;
  for(let i=0;i<9;i++){wrong(c);assert.equal(c.activeCrate().phase,'playing');assert.equal(c.activeCrate().moves,i+1)}
  assert.match(a.document.getElementById('crateAttempts').textContent,/1 movimiento restante/);
  wrong(c);assert.equal(c.activeCrate().phase,'blown');assert.equal(c.activeCrate().moves,10);
  assert.equal(a.nodes.get('crateModal').classList.contains('fuse-flash'),true);
  const before=json(c.activeCrate());c.cratePrimary();c.toggleCrateSwitch(0);c.leaveCrate();assert.deepEqual(json(c.activeCrate()),before);
  flash(a);assert.equal(c.activeCrate().phase,'failed');assert.match(a.nodes.get('crateFailureText').textContent,/Elías tiene un fusible/);
  c.cratePrimary();assert.equal(c.activeCrate().spareUsed,true);assert.equal(c.activeCrate().phase,'playing');
  assert.equal(c.activeCrate().moves,0);assert.deepEqual(json(c.activeCrate().board),before.board);
  for(let i=0;i<9;i++){wrong(c);assert.equal(c.activeCrate().phase,'playing');assert.equal(c.activeCrate().moves,i+1)}
  wrong(c);flash(a);assert.equal(c.activeCrate().phase,'sealed');assert.equal(c.activeCrate().moves,10);
  assert.equal(a.document.getElementById('crateFailureTitle').textContent,'LOOT FALLIDO');
  c.cratePrimary();assert.equal(c.activeCrate().phase,'sealed');assert.equal(a.nodes.get('cratePrimary').classList.contains('hidden'),true);
  c.takeAllCrateLoot();assert.deepEqual(json(c.state.party.map(p=>p.bag)),bags);assert.equal(c.state.stats.loot,loot);
  c.leaveCrate();assert.equal(c.crateStore().checked['2'],'sealed');assert.equal(c.state.index,3);
});
test('reload during either fuse flash resumes failure and cannot restore spent moves or spare',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();for(let i=0;i<10;i++)wrong(c);
  const b=session(a.storage),d=b.ctx;d.continueGame();assert.equal(d.activeCrate().phase,'failed');assert.equal(d.activeCrate().moves,10);
  d.cratePrimary();const e=session(a.storage);e.ctx.continueGame();assert.equal(e.ctx.activeCrate().spareUsed,true);
  assert.equal(e.ctx.activeCrate().moves,0);
  for(let i=0;i<10;i++)wrong(e.ctx);const f=session(a.storage);f.ctx.continueGame();assert.equal(f.ctx.activeCrate().phase,'sealed');assert.equal(f.ctx.activeCrate().moves,10);
});
test('spare can open the original puzzle; rewards were fixed before play and survive reload',()=>{
  const a=encounter('medical'),c=a.ctx,initial=json(c.activeCrate());c.cratePrimary();for(let i=0;i<10;i++)wrong(c);flash(a);c.cratePrimary();
  assert.equal(c.activeCrate().board.target,initial.board.target);solve(c);unlock(a);
  assert.equal(c.activeCrate().phase,'loot');assert.deepEqual(json(c.activeCrate().drops),initial.drops);
  assert.equal(a.nodes.get('crateArt').classList.contains('opened'),true);
  const b=session(a.storage);b.ctx.continueGame();assert.equal(b.ctx.activeCrate().phase,'loot');assert.deepEqual(json(b.ctx.activeCrate().drops),initial.drops);
});
test('invalid switch input and non-switch actions spend no moves; solved crates ignore further input',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();
  for(const i of [-1,.5,99,NaN])c.toggleCrateSwitch(i);
  c.cratePrimary();c.renderCrate();assert.equal(c.activeCrate().moves,0);
  solve(c);assert.equal(c.activeCrate().phase,'unlocking');assert.ok(c.activeCrate().moves<=5);
  const snapshot=JSON.stringify(c.state);c.toggleCrateSwitch(0);c.cratePrimary();assert.equal(JSON.stringify(c.state),snapshot);
  unlock(a);assert.equal(c.activeCrate().phase,'loot');
});
test('the correct tenth move opens automatically on either fuse instead of burning it',()=>{
  for(const spare of [false,true]){
    const a=encounter(),c=a.ctx,chest=c.activeCrate();
    chest.board={count:5,masks:[3,6,12,24],initial:1,current:1,target:4,switches:0};c.cratePrimary();
    if(spare){for(let i=0;i<10;i++)wrong(c);flash(a);c.cratePrimary()}
    for(let i=0;i<8;i++)c.toggleCrateSwitch(2);
    c.toggleCrateSwitch(0);assert.equal(chest.phase,'playing');assert.equal(chest.moves,9);
    c.toggleCrateSwitch(1);assert.equal(chest.phase,'unlocking');assert.equal(chest.moves,10);assert.equal(chest.spareUsed,spare);
    assert.equal(a.document.getElementById('crateModal').classList.contains('fuse-flash'),false);
    unlock(a);assert.equal(chest.phase,'loot');
    assert.equal(a.document.activeElement.id,'crateLeave');
  }
});
test('success keeps both light rows visible in green for 1.5 seconds before exposing any loot',()=>{
  for(const type of ['electronic','ammo','medical']){
    const a=encounter(type),c=a.ctx,d=a.document;c.cratePrimary();const drops=json(c.activeCrate().drops);solve(c);
    assert.equal(c.activeCrate().phase,'unlocking');assert.equal(d.getElementById('crateModal').classList.contains('success-flash'),true);
    assert.equal(d.getElementById('crateScreen-playing').classList.contains('hidden'),false);assert.equal(d.getElementById('crateScreen-loot').classList.contains('hidden'),true);
    assert.equal(d.querySelectorAll('.crate-lamp').length,c.activeCrate().board.count*2);assert.equal(d.getElementById('crateArt').classList.contains('opened'),false);
    assert.ok([...d.querySelectorAll('[data-crate-switch]')].every(button=>button.disabled));assert.equal(d.getElementById('crateLeave').disabled,true);
    const before=JSON.stringify(c.state);c.toggleCrateSwitch(0);c.takeAllCrateLoot();c.leaveCrate();c.advance();c.crateHelp();assert.equal(JSON.stringify(c.state),before);
    unlock(a);assert.equal(c.activeCrate().phase,'loot');assert.equal(d.getElementById('crateModal').classList.contains('success-flash'),false);
    assert.equal(d.getElementById('crateScreen-loot').classList.contains('hidden'),false);assert.equal(d.getElementById('crateArt').classList.contains('opened'),true);
    assert.deepEqual(json(c.activeCrate().drops),drops);assert.equal(d.activeElement.id,'crateLeave');
  }
});
test('reloading the green flash preserves success, movement cost and rewards, then opens once',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();solve(c);const solved=json(c.activeCrate());
  const b=session(a.storage),d=b.ctx;d.continueGame();assert.equal(d.activeCrate().phase,'unlocking');
  assert.equal(d.activeCrate().moves,solved.moves);assert.deepEqual(json(d.activeCrate().drops),solved.drops);
  const callback=b.timers.get(d.crateSuccessTimer).fn;unlock(b);const before=JSON.stringify(d.state);callback();assert.equal(JSON.stringify(d.state),before);
  assert.equal(d.activeCrate().phase,'loot');
});
test('new game invalidates both discovery and successful unlock callbacks',()=>{
  for(const phase of ['waiting','unlocking']){
    const a=encounter('medical',phase==='waiting'?'waiting':'help'),c=a.ctx;
    if(phase==='unlocking'){c.cratePrimary();solve(c)}
    const callback=a.timers.get(phase==='waiting'?c.crateNoticeTimer:c.crateSuccessTimer).fn;
    c.newGame();const before=JSON.stringify(c.state);callback();assert.equal(JSON.stringify(c.state),before);assert.equal(c.crateVisible(),false);
    assert.equal(c.crateNoticeTimer,null);assert.equal(c.crateSuccessTimer,null);assert.equal(a.document.getElementById('crateModal').classList.contains('success-flash'),false);
  }
});
test('reload and reopened help preserve every movement and the board on both fuses',()=>{
  const a=encounter();a.ctx.cratePrimary();for(let i=0;i<4;i++)wrong(a.ctx);
  const board=json(a.ctx.activeCrate().board),b=session(a.storage),c=b.ctx;c.continueGame();
  assert.equal(c.activeCrate().moves,4);assert.deepEqual(json(c.activeCrate().board),board);
  assert.equal(b.document.activeElement.dataset.crateSwitch,'0');
  c.crateHelp();const d=session(a.storage).ctx;d.continueGame();d.cratePrimary();assert.equal(d.activeCrate().moves,4);
  for(let i=0;i<6;i++)wrong(d);
  const e=session(a.storage).ctx;e.continueGame();e.cratePrimary();for(let i=0;i<7;i++)wrong(e);e.crateHelp();
  const f=session(a.storage).ctx;f.continueGame();f.cratePrimary();assert.equal(f.activeCrate().moves,7);assert.equal(f.activeCrate().spareUsed,true);
  for(let i=0;i<3;i++)wrong(f);assert.equal(f.activeCrate().phase,'blown');
});
test('legacy check-based saves migrate once without changing loot, board or consumed fuses',()=>{
  for(const [phase,spareUsed] of [['help',false],['playing',false],['playing',true],['failed',false],['blown',false],['blown',true],['sealed',true],['loot',true]]){
    const a=encounter(),c=a.ctx,chest=c.activeCrate();
    Object.assign(chest,{version:1,phase,spareUsed,failures:spareUsed?6:3,lastProbe:chest.board.current,message:'Solo queda una comprobación.'});delete chest.moves;
    const drops=json(chest.drops),board=json(chest.board);c.save();
    const b=session(a.storage),d=b.ctx;d.continueGame();const restored=d.activeCrate();
    assert.equal(restored.version,2);assert.equal(restored.spareUsed,spareUsed);assert.equal(restored.message,'');
    assert.equal(restored.phase,phase==='blown'?(spareUsed?'sealed':'failed'):phase);
    assert.deepEqual(json(restored.drops),drops);assert.deepEqual(json(restored.board),board);
    assert.equal(restored.moves,['failed','blown','sealed'].includes(phase)?10:0);
    if(phase==='playing'){wrong(d);const e=session(a.storage).ctx;e.continueGame();assert.equal(e.activeCrate().moves,1)}
  }
});
test('loot fits available capacity, can be split among allies, inspected and never collected twice',()=>{
  const a=encounter('ammo'),c=a.ctx,d=a.document;c.cratePrimary();solve(c);unlock(a);
  const chest=c.activeCrate();chest.drops=[{id:'ammo9',qty:4,status:'pending'}];
  c.state.party[0].bag=[{id:'food',qty:c.bagCapacity(c.state.party[0])-1}];chest.owner=0;c.renderCrate();
  a.click(d.querySelector('[data-crate-info="ammo9"]'));assert.equal(c.itemDetailState.id,'ammo9');assert.equal(d.getElementById('crateModal').hasAttribute('inert'),true);
  c.closeItemDetails();const before=c.state.stats.loot;a.click(d.querySelector('[data-crate-take="0"]'));assert.equal(chest.drops[0].taken,1);assert.equal(c.bagFree(c.state.party[0]),0);
  a.click(d.querySelector('[data-crate-owner="1"]'));a.click(d.getElementById('crateAll'));assert.equal(chest.drops[0].taken,4);assert.equal(c.state.stats.loot,before+4);
  const b=session(a.storage);b.ctx.continueGame();b.ctx.takeAllCrateLoot();assert.equal(b.ctx.state.stats.loot,before+4);
  b.ctx.leaveCrate();assert.equal(b.ctx.state.index,3);assert.equal(b.ctx.activeCrate(),null);
});
test('full bags do not lose loot; leaving uncollected items requires an explicit second press',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();solve(c);unlock(a);
  c.state.party.forEach(p=>p.bag=[{id:'scrap',qty:c.bagCapacity(p)}]);const before=json(c.activeCrate().drops);c.takeAllCrateLoot();assert.deepEqual(json(c.activeCrate().drops),before);
  c.leaveCrate();assert.ok(c.activeCrate());assert.equal(c.state.index,2);c.leaveCrate();assert.equal(c.state.index,3);
});
test('timer, browser Back and narrative shortcuts cannot bypass the chest; new game invalidates timers',()=>{
  const a=encounter(),c=a.ctx;c.cratePrimary();c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=10000;
  c.signalGlobalTick();assert.equal(c.state.inhibitor.remainingMs,10000);assert.equal(c.openSignalHack('manual'),false);
  c.advance();assert.equal(c.state.index,2);c.NeoBackNavigation.handleBack();assert.equal(c.state.index,2);
  const snapshot=JSON.stringify(c.state);for(const key of ['1','2','3'])a.document.dispatchEvent(Object.assign(new a.document.defaultView.Event('keydown'),{key}));assert.equal(JSON.stringify(c.state),snapshot);
  for(let i=0;i<10;i++)wrong(c);const callback=a.timers.get(c.crateFlashTimer).fn;c.newGame();const fresh=JSON.stringify(c.state);callback();assert.equal(JSON.stringify(c.state),fresh);assert.equal(c.crateVisible(),false);
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
