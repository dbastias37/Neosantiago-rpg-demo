const test=require('node:test'),assert=require('node:assert/strict');
const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const {setup,finish}=require('./courier-return-fixtures.cjs');

test('remote contacts require a physical approach; previews do not mutate or reveal locked contacts',async()=>{
 const {E,d}=await setup();const fresh=E.createWorld(d,{seed:1}),raw=E.serialize(fresh);
 assert.equal(E.departurePlan(d,fresh,'romero-01'),null);assert.equal(E.approachJourney(d,fresh,'adasme-01'),null);
 assert.throws(()=>E.travelToMission(d,fresh,'romero-01'),/contacto/);assert.equal(E.serialize(fresh),raw);
 const w=finish(E,d,E.start(d,fresh,'relevo-01')),before=E.serialize(w),plan=E.departurePlan(d,w,'romero-01');
 assert.equal(plan.destination,'republica');assert.deepEqual(d.routes[plan.journey.route].nodes,['heroes','republica']);
 assert.throws(()=>E.start(d,w,'romero-01'),/Viaja a República/);assert.equal(E.serialize(w),before);
 assert.equal(E.approachJourney(d,w,'adasme-01'),null);assert.ok(!E.knownNodes(d,w).includes('vicuna'));
});

test('approach preserves wounds and owned supplies, resolves arrival, and starts no assignment or payment',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:1});w.crew[0].hp=21;
 const crew=structuredClone(w.crew),known=[...w.progression.known],journey=E.travelToMission(d,w,'romero-01');
 assert.equal(journey.location,'heroes');assert.deepEqual(journey.run.party,crew);assert.deepEqual(journey.run.borrowedStock,{});assert.deepEqual(journey.run.cargo,{});assert.equal(journey.run.timeLimit,null);assert.equal(E.rewardForecast(d,journey),null);
 assert.throws(()=>E.start(d,journey,'romero-01'));assert.throws(()=>E.travelToMission(d,journey,'ana-01'),/Termina/);
 const pending=E.advance(d,journey),saved=E.restore(d,E.serialize(pending));assert.deepEqual(saved,pending);assert.equal(saved.location,'heroes');assert.notEqual(saved.run.pending.category,'delivery');
 w=finish(E,d,saved);assert.equal(w.location,'republica');assert.equal(w.run.status,'completed');assert.ok(w.run.minutes>0);assert.deepEqual(w.paid,[]);assert.deepEqual(w.completed,{});assert.deepEqual(w.effects,[]);assert.deepEqual(w.progression.known,known);assert.equal(w.credits,0);assert.equal(w.hubVisits,0);assert.deepEqual(w.run.cargo,{});
 assert.equal(E.atMissionOrigin(d,w,'romero-01'),true);assert.deepEqual(E.restore(d,E.serialize(w)),w);
 const accepted=E.start(d,w,'romero-01');assert.equal(accepted.run.minutes,0);assert.equal(accepted.run.timeLimit,d.missions['romero-01'].time_limit);assert.equal(accepted.run.startIndex,0);assert.equal(accepted.location,'republica');assert.deepEqual(accepted.run.cargo,{});assert.ok(Object.keys(accepted.run.borrowedStock).length>0);
});

test('hostile final approach keeps contact inaccessible through combat and loot until the passage resolves',async()=>{
 const {E,d}=await setup();let w;
 for(let seed=1;seed<100;seed++){w=E.advance(d,E.travelToMission(d,connectedWorld(E,d,{seed}),'romero-01'));if(w.run.pending.category==='hostile')break;}
 assert.equal(w.run.pending.category,'hostile');w=E.choose(d,w,'fight');assert.throws(()=>E.start(d,w,'romero-01'));
 for(let i=0;i<100&&w.run.pending?.combat?.phase==='combat';i++)w=E.choose(d,w,E.options(d,w).some(o=>o.id==='fire')?'fire':'melee');
 assert.equal(w.run.pending.combat.phase,'loot');assert.equal(w.location,'heroes');assert.equal(w.run.status,'active');assert.throws(()=>E.start(d,w,'romero-01'));
 w=E.restore(d,E.serialize(w));w=E.finishLoot(d,w);assert.equal(w.location,'republica');assert.equal(w.run.status,'completed');assert.equal(E.start(d,w,'romero-01').run.mission,'romero-01');
});

test('the rescue uses the nearest preparation point without inventing visits or skipping its return',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:2130});w.location='leones';
 const plan=E.departurePlan(d,w,'adasme-01');assert.equal(plan.destination,'tobalaba');assert.deepEqual(d.routes[plan.journey.route].nodes,['leones','tobalaba']);assert.equal(plan.index,12);assert.equal(plan.legs,16);assert.equal(plan.limit,116);
 w=finish(E,d,E.travelToMission(d,w,'adasme-01'));assert.equal(w.location,'tobalaba');assert.ok(!w.progression.visited.includes('vicuna'));
 w=E.start(d,w,'adasme-01');assert.equal(w.run.index,12);assert.equal(w.run.startIndex,12);assert.equal(w.run.checkpoint.node,'tobalaba');assert.equal(w.run.timeLimit,116);assert.equal(w.run.minutes,0);assert.ok(!w.progression.visited.includes('macul'));assert.ok(!w.progression.visited.includes('vicuna'));assert.equal(E.nextEdge(d,w).to,'escotilla');
 assert.deepEqual(E.restore(d,E.serialize(w)),w);w=finish(E,d,w);assert.equal(w.location,'vicuna');assert.ok(w.run.rescued);assert.equal(w.run.receipt.startIndex,12);assert.equal(w.run.receipt.timeLimit,116);assert.ok(['walking','carried'].includes(w.run.receipt.rescueOutcome.mobility));assert.equal(E.rewardForecast(d,w).limit,116);assert.equal(w.paid.filter(id=>id==='adasme-01').length,1);
});

test('starting at Vicuña keeps the full extraction and a moving mission keeps its accepted itinerary',async()=>{
 const {E,d}=await setup();let w=E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'adasme-01'),'adasme-01');
 assert.equal(w.run.startIndex,0);assert.equal(w.run.timeLimit,140);w=E.advance(d,w);
 const o=E.options(d,w).find(o=>E.optionAvailable(w,o)&&['scout','avoid','continue'].includes(o.id))||E.options(d,w).find(o=>E.optionAvailable(w,o));w=E.choose(d,w,o.id);
 assert.equal(w.location,'macul');assert.equal(E.departurePlan(d,w,'adasme-01').index,0);assert.equal(E.departurePlan(d,w,'adasme-01').limit,140);
});

test('retry restores the real approach checkpoint and its rolls; abandonment starts the next path from that stop',async()=>{
 const {E,d}=await setup();let w=E.travelToMission(d,connectedWorld(E,d,{seed:1}),'ana-01');
 w=E.advance(d,w);const o=E.options(d,w).find(o=>E.optionAvailable(w,o)&&['scout','avoid','continue'].includes(o.id))||E.options(d,w).find(o=>E.optionAvailable(w,o));w=E.choose(d,w,o.id);
 assert.equal(w.location,'moneda');const stopped=E.abandon(d,w);assert.equal(stopped.location,'moneda');assert.equal(d.routes[E.departurePlan(d,stopped,'romero-01').journey.route].nodes[0],'moneda');
 w.run.status='failed';const rolls=structuredClone(w.run.rolls);w=E.retry(d,w);assert.equal(w.location,w.run.checkpoint.node);assert.equal(w.location,'heroes');assert.deepEqual(w.run.rolls,rolls);assert.deepEqual(E.restore(d,E.serialize(w)),w);
});

test('Tobalaba retries retain their incorporation index and separate clock, and invalid starts are rejected',async()=>{
 const {E,d}=await setup();let w=connectedWorld(E,d,{seed:1});w.location='tobalaba';w=E.start(d,w,'adasme-01');const initial=structuredClone(w);w=E.advance(d,w);w.run.status='failed';w.location='escotilla';w=E.retry(d,E.restore(d,E.serialize(w)));
 assert.equal(w.location,'tobalaba');assert.equal(w.run.index,12);assert.equal(w.run.startIndex,12);assert.equal(w.run.timeLimit,116);assert.equal(w.run.minutes,0);assert.deepEqual(E.restore(d,E.serialize(w)),w);
 for(const index of [-1,1,13,12.5]){const bad=structuredClone(initial);bad.run.startIndex=index;assert.throws(()=>E.restore(d,JSON.stringify(bad)),/incorporación/);}
});

test('pre-update active positions and checkpoints are restored without relocating or adding an approach',async()=>{
 const {E,d}=await setup();let w=E.advance(d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:1}),'adasme-01'),'adasme-01'));
 delete w.run.startIndex;delete w.run.checkpoint.snapshot.startIndex;
 assert.deepEqual(E.restore(d,E.serialize(w)),w);const completed=finish(E,d,w);assert.equal(completed.location,'vicuna');assert.equal(completed.run.receipt.timeLimit,140);
 assert.throws(()=>E.travelToMission(d,completed,'adasme-01'),/entregado/);
});
