const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const source=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../extensions/mensajeros/production.json')));
async function setup(){const E=await import('../extensions/mensajeros/production.mjs');return {E,d:E.prepare(source)}}
function step(E,d,w){
 if(!w.run.pending)w=E.advance(d,w);
 if(w.run.pending?.combat?.phase==='loot')return E.finishLoot(d,w);
 const available=E.options(d,w).filter(o=>E.optionAvailable(w,o));
 const option=w.run.pending?.combat?available.find(o=>o.id==='fire')||available.find(o=>o.id==='melee'):available.find(o=>o.id==='scout')||available.find(o=>o.id==='echo-path')||available.find(o=>o.id==='jam-skill')||available.find(o=>o.id==='avoid')||available.find(o=>o.id==='continue')||available.find(o=>o.id==='assist')||available[0];
 assert.ok(option,'available route action');return E.choose(d,w,option.id);
}
function finish(E,d,w){let turns=0;while(w.run.status==='active'&&turns++<400)w=E.restore(d,E.serialize(step(E,d,w)));assert.ok(turns<400);assert.equal(w.run.status,'completed',w.run.log.join('\n'));return w;}
test('Line 4 visits all eleven real intermediate stations in both directions and keeps Jiménez at Tobalaba',async()=>{
 const {E,d}=await setup(),names=['Vicuña Mackenna','Macul','Las Torres','Quilín','Los Presidentes','Grecia','Los Orientales','Plaza Egaña','Simón Bolívar','Príncipe de Gales','Francisco Bilbao','Cristóbal Colón','Tobalaba'];
 const r=d.routes['adasme-oriente'];assert.deepEqual(r.nodes.slice(0,13).map(id=>d.nodes[id].name),names);assert.deepEqual(r.nodes.slice(16).map(id=>d.nodes[id].name),names.toReversed());
 assert.ok(r.edges.filter(e=>e.line==='L4').every(e=>e.kind==='adjacent_station'));assert.equal(r.edges.length,28);
 let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'jimenez-01'),'jimenez-01');w.run.index=11;w.location='colon';w=E.advance(d,w);
 assert.equal(w.run.pending.to,'tobalaba');assert.equal(w.run.pending.id,'jimenez-frecuencia');assert.ok(E.options(d,w).some(o=>o.id==='passive'));
});
test('market travel follows existing connections from every station and respects the Baquedano closure',async()=>{
 const {E,d}=await setup();
 for(const node of Object.keys(d.nodes).filter(id=>id!=='heroes')){
  let w=connectedWorld(E,d,{seed:4});w.location=node;w.credits=30;const before=JSON.stringify(w);w=E.travelHeroes(d,w);const route=E.route(d,w);
  assert.equal(w.location,node);if(node!=='plaza')assert.throws(()=>E.start(d,{...w,run:null},'morales-01'),/Viaja a Plaza de Armas/);assert.equal(route.nodes[0],node);assert.equal(route.nodes.at(-1),'heroes');assert.equal(E.atHeroes(d,w),false);assert.throws(()=>E.buy(d,w,'water','rocio'),/Los Héroes/);assert.throws(()=>E.sell(d,w,'ammo9','rocio'),/Los Héroes/);assert.throws(()=>E.recover(d,w),/Los Héroes/);
  assert.equal(w.credits,30);assert.deepEqual(w.crew,JSON.parse(before).crew);assert.equal(E.rewardForecast(d,w),null);
  assert.ok(!route.nodes.includes('baquedano'));route.edges.forEach((e,i)=>{assert.equal(e.from,route.nodes[i]);assert.equal(e.to,route.nodes[i+1]);});
  assert.deepEqual(E.restore(d,E.serialize(w)),w);
 }
 const trip=d.routes[d.journeys['market-vicuna'].route].nodes;assert.ok(trip.includes('macul')&&trip.includes('leones')&&trip.includes('franklin'));
});
test('even the final market leg can trigger battle; only victory and finishing loot open trade, with no mission reward',async()=>{
 const {E,d}=await setup();let w;
 for(let seed=1;seed<100;seed++){w=connectedWorld(E,d,{seed});w.location='republica';w.credits=50;w=E.advance(d,E.travelHeroes(d,w));if(w.run.pending.category==='hostile')break;}
 assert.equal(w.run.pending.category,'hostile');assert.equal(w.run.pending.to,'heroes');assert.equal(E.atHeroes(d,w),false);
 w=E.choose(d,w,'fight');w=E.restore(d,E.serialize(w));
 while(w.run.pending.combat.phase==='combat')w=step(E,d,w);
 assert.equal(E.atHeroes(d,w),false);assert.throws(()=>E.buy(d,w,'food','rocio'),/Los Héroes/);
 const enemy=w.run.pending.combat.enemies[0],item=enemy.loot[0].id;w=E.takeLoot(d,w,0,'tomas',item);
 const hp=w.run.party.map(c=>c.hp),minutes=w.run.minutes;
 w=E.finishLoot(d,w);assert.equal(w.location,'heroes');assert.equal(w.run.status,'completed');assert.ok(E.atHeroes(d,w));assert.equal(w.hubVisits,1);assert.equal(w.credits,50);assert.deepEqual(w.paid,[]);assert.deepEqual(w.completed,{});assert.deepEqual(w.effects,[]);
 assert.deepEqual(w.crew.map(c=>c.hp),hp);assert.ok(w.crew[1].bag.some(x=>x.id===item));assert.equal(w.run.minutes,minutes);
 w=E.buy(d,w,'food','tomas');assert.equal(w.credits,45);assert.throws(()=>E.travelHeroes(d,w),/ya está/);assert.throws(()=>E.advance(d,w),/activo/);
});
test('market encounters persist through reload and retry, and stopping never teleports the group',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:4});w.location='leones';w=E.travelHeroes(d,w);const initial=w.location;w=E.advance(d,w);const pending=structuredClone(w.run.pending);w=E.restore(d,E.serialize(w));assert.deepEqual(w.run.pending,pending);
 w.run.status='failed';w.run.party.forEach(c=>c.hp=0);w.regions.l6=3;const rolls=structuredClone(w.run.rolls);w=E.retry(d,w);assert.deepEqual(w.run.rolls,rolls);assert.equal(w.regions.l6,3);assert.ok(w.run.party.every(c=>c.hp>0));assert.equal(E.atHeroes(d,w),false);
 w=E.abandon(d,w);assert.equal(w.location,initial);assert.equal(E.atHeroes(d,w),false);
});
test('independent market trips finish, preserve earlier receipts and never award another mission payment',async()=>{
 const {E,d}=await setup();
 for(const origin of ['plaza','libertadores','leones','vicuna']){
  let w=connectedWorld(E,d,{seed:1});w.location=origin;w.credits=30;w.paid=['ana-01'];w.completed={'ana-01':{amount:30,corridorVersion:1}};w.effects=['ana-01'];
  w=finish(E,d,E.travelHeroes(d,w));assert.equal(E.atHeroes(d,w),true,origin);assert.equal(w.credits,30);assert.deepEqual(w.completed,{'ana-01':{amount:30,corridorVersion:1}});assert.deepEqual(w.paid,['ana-01']);
 }
});
function legacy(E){
 const old=structuredClone(source);old.content_version='2026-09-18.production.1';for(const [id,n]of Object.entries(old.nodes))if(n.line==='L4')delete old.nodes[id];
 const direct={from:'vicuna',to:'tobalaba',risk:'medium',line:'L4 · tramo agrupado',minutes:8,kind:'grouped_corridor',region:'oriente'};
 const r=old.routes['adasme-oriente'];r.edges=[direct,...r.edges.slice(12,16),{...direct,from:'tobalaba',to:'vicuna'}];r.nodes=['vicuna','tobalaba','escotilla','provisorio','escotilla','tobalaba','vicuna'];
 old.routes['jimenez-enlace'].edges=[direct,old.routes['jimenez-enlace'].edges.at(-1)];old.routes['jimenez-enlace'].nodes=['vicuna','tobalaba','leones'];
 old.scripted['jimenez-01:0']=old.scripted['jimenez-01:11'];delete old.scripted['jimenez-01:11'];return E.prepare(old);
}
test('old pending battles, loot and checkpoint saves migrate without rerolling, resetting HP or charging another leg',async()=>{
 const {E,d}=await setup(),old=legacy(E);let w;
 for(let seed=0;seed<100;seed++){w=E.advance(old,E.start(old,atOrigin(old,connectedWorld(E,old,{seed}),'adasme-01'),'adasme-01'));if(w.run.pending.category==='hostile')break;}
 w=E.choose(old,w,'fight');w=E.choose(old,w,'fire');const combat=structuredClone(w.run.pending.combat),hp=w.run.party.map(c=>c.hp),minutes=w.run.minutes;
 let n=E.restore(d,E.serialize(w));assert.equal(n.run.index,11);assert.equal(n.run.pending.from,'colon');assert.equal(n.run.pending.to,'tobalaba');assert.deepEqual(n.run.pending.combat,combat);assert.deepEqual(n.run.party.map(c=>c.hp),hp);assert.equal(n.run.minutes,minutes);assert.deepEqual(n.run.rolls[11],w.run.rolls[0]);assert.equal(n.run.checkpoint.snapshot.index,0);assert.deepEqual(E.restore(d,E.serialize(n)),n);
 while(w.run.pending.combat.phase==='combat')w=step(E,old,w);w=E.revealLoot(old,w,0);n=E.restore(d,E.serialize(w));assert.equal(n.run.pending.combat.phase,'loot');assert.equal(n.run.pending.combat.enemies[0].searched,true);
 n.run.status='failed';n=E.retry(d,n);assert.equal(n.run.index,0);assert.equal(E.nextEdge(d,n).to,'macul');assert.equal(n.run.rolls[11].id,w.run.rolls[0].id);
});
test('legacy extraction progress maps repeated stations correctly and returns through the expanded Line 4',async()=>{
 const {E,d}=await setup(),old=legacy(E),positions=[0,12,13,14,15,16,28];
 for(let index=0;index<7;index++){
  let w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),'adasme-01'),'adasme-01');w.run.index=index;w.location=old.routes['adasme-oriente'].nodes[index];if(index===6)w.run.status='completed';
  const n=E.restore(d,E.serialize(w));assert.equal(n.run.index,positions[index]);assert.equal(E.here(d,n).id,E.here(old,w).id);if(index===5)assert.equal(E.nextEdge(d,n).to,'colon');
 }
 let w=E.advance(old,E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),'jimenez-01'),'jimenez-01'));w=E.restore(d,E.serialize(w));assert.equal(w.run.pending.id,'jimenez-frecuencia');assert.equal(w.run.index,11);
});
test('reverse paths retain the metro curves instead of cutting across the map',async()=>{
 const {reversePath}=await import('../extensions/mensajeros/network.mjs');assert.equal(reversePath('M750 204L771 225Q780 234 780 247V278'),'M780 278L780 247Q780 234 771 225L750 204');
});

test('random market encounters never borrow the fixed scenes from another assignment',async()=>{
 const {E,d}=await setup(),fixed=new Set(Object.values(d.scripted).map(e=>e.id));
 for(const risk of ['low','medium','high'])d.weights[risk]=[0,100,0,0];
 for(const origin of ['leones','colon','moneda'])for(let seed=1;seed<=30;seed++){
  let w=connectedWorld(E,d,{seed});w.location=origin;w=E.advance(d,E.travelHeroes(d,w));
  assert.equal(w.run.pending.category,'decision');assert.ok(!fixed.has(w.run.pending.id),w.run.pending.id);
 }
});
test('a paid legacy extraction retains its original deadline and penalty after the route expansion',async()=>{
 const {E,d}=await setup(),old=legacy(E);let w=E.start(old,atOrigin(old,connectedWorld(E,old,{seed:1}),'adasme-01'),'adasme-01');
 w.run.index=6;w.run.status='completed';w.run.minutes=52;w.run.receipt={gross:70,amount:64,late:12,penalty:6,timeLimit:40,minutes:52};w.credits=64;w.completed['adasme-01']=structuredClone(w.run.receipt);w.paid=['adasme-01'];
 w=E.restore(d,E.serialize(w));assert.deepEqual(E.rewardForecast(d,w),{gross:70,amount:64,late:12,penalty:6,limit:40,minutes:52});assert.equal(w.credits,64);assert.equal(w.run.index,28);
});

test('north checkpoint approaches and the south corridor cannot silently skip their required encounters',async()=>{
 const {E,d}=await setup();
 for(let seed=1;seed<=100;seed++){
  let north=E.advance(d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed}),'beatriz-01'),'beatriz-01'));
  assert.equal(north.run.pending.to,'plaza');assert.ok(['decision','hostile','opportunity'].includes(north.run.pending.category));
  assert.deepEqual(E.restore(d,E.serialize(north)).run.pending,north.run.pending);
  // Return journeys reverse the south route while retaining encounter requirements.
  let w=connectedWorld(E,d,{seed});w.location='franklin';w=E.travelHeroes(d,w);
  const r=E.route(d,w),index=r.edges.findIndex(e=>e.from==='parque'&&e.to==='toesca');assert.ok(index>=0);
  w.run.index=index;w.location='parque';w=E.advance(d,w);
  assert.ok(['decision','hostile','opportunity'].includes(w.run.pending.category));
  const journey=d.routes[d.journeys['market-libertadores'].route];assert.ok(journey.edges[0].required_encounter);
 }
 const forward=d.routes['guzman-plaza'].edges.find(e=>e.from==='parque'&&e.to==='toesca');assert.equal(forward.required_encounter,true);
});
