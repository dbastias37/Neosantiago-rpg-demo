const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'..');
async function battle(saved){
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 let world=saved,stored='',errors=[],refreshes=0;
 if(!world){for(let seed=0;seed<100;seed++){world=E.advance(data,E.start(data,atOrigin(data,connectedWorld(E,data,{seed}),'adasme-01'),'adasme-01'));if(world.run.pending.category==='hostile')break;}world=E.choose(data,world,'fight');}
 const {document,window}=parseHTML(fs.readFileSync(root+'/neosantiago-demo.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};
 Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return /Units$/.test(this.id)?400:800}});
 Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{configurable:true,get(){return /Units$/.test(this.id)?320:700}});
 const timers=new Map(),sounds=[];let timerId=0;
 const host={data,world:()=>world,announce:t=>errors.push(t),refresh:()=>refreshes++,ready:()=>{},transact(fn,...args){try{world=fn(data,world,...args);stored=E.serialize(world);return true;}catch(e){errors.push(e.message);return false;}}};
 const ctx={console,E,URL,document,parent:{NeoCourierCombatHost:host},innerHeight:900,matchMedia:()=>({matches:false}),addEventListener(){},setTimeout(fn,ms){timers.set(++timerId,{fn,ms});return timerId},clearTimeout:id=>timers.delete(id),setInterval(fn,ms){timers.set(++timerId,{fn,ms,interval:true});return timerId},clearInterval:id=>timers.delete(id),Audio:function(src){sounds.push(src);this.volume=0;this.addEventListener=()=>{};this.play=()=>Promise.resolve();this.pause=()=>{};}};
 ctx.window=ctx;vm.createContext(ctx);
 const append=document.body.append.bind(document.body);document.body.append=node=>{append(node);if(node.tagName==='SCRIPT'){vm.runInContext(fs.readFileSync(root+'/'+new URL(node.src).pathname.split('/').pop(),'utf8'),ctx);node.onload();}};
 const code=fs.readFileSync(root+'/extensions/mensajeros/combat-adapter.mjs','utf8').replace("import * as E from './production.mjs';",'').replaceAll('import.meta.url',JSON.stringify('https://game.test/extensions/mensajeros/combat-adapter.mjs'));
 await vm.runInContext('(async()=>{'+code+'})()',ctx);
 function click(selector){const el=document.querySelector(selector);assert.ok(el,selector);if(el.onclick)el.onclick();else el.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));}
 function drain(){let n=0;while(ctx.battleState?.busy){assert.ok(++n<100,'turn finishes');const entry=[...timers].find(([,t])=>!t.interval);assert.ok(entry,'pending callback');timers.delete(entry[0]);entry[1].fn();}}
 return {ctx,document,E,data,world:()=>world,stored:()=>stored,errors,sounds,timers,click,drain,refreshes:()=>refreshes};
}
test('couriers mount the shared Exploration cards and controls, skills, inventory and audio',async()=>{
 const a=await battle(),d=a.document,c=a.ctx;
 assert.equal(d.querySelectorAll('#allyUnits .unit').length,3);assert.equal(d.querySelectorAll('#allyUnits .stage-front').length,1);
 assert.match(d.querySelector('#allyUnits').textContent,/Rocío/);assert.match(d.querySelector('#allyUnits img').src,/characters\/mensajeros\/rocio.webp/);
 assert.deepEqual([...d.querySelectorAll('#turnControls .actions button')].map(b=>b.textContent),['Atacar','Habilidad','Activar sinergia','Defender','Inventario','Retirarse']);
 a.click('[data-action="skill"]');assert.match(d.querySelector('#fieldSkillTray').textContent,/Marcar al enemigo/);
 a.click('[data-courier-choice="skill"]');assert.ok(c.battleState.busy);a.drain();assert.equal(a.world().run.pending.combat.actor,1);
 a.click('[data-action="skill"]');assert.match(d.querySelector('#fieldSkillTray').textContent,/Escuchar/);
 a.click('[data-courier-choice="listen"]');a.drain();assert.equal(a.world().run.pending.combat.actor,2);
 a.click('#itemsToggle');assert.equal(d.querySelector('#itemTray').classList.contains('hidden'),false);
 assert.ok(a.sounds.some(s=>s.endsWith('ambience/battle-loop.mp3')));assert.deepEqual(a.errors,[]);
});
test('attack commits ammunition once, narration blocks double attacks, reload resumes the saved actor',async()=>{
 const a=await battle(),ammo=a.world().run.supplies.ammo9;
 a.click('[data-action="attack"]');a.click('[data-action="attack"]');
 assert.equal(a.world().run.supplies.ammo9,ammo-1);assert.ok(a.ctx.battleState.busy);
 const reload=await battle(a.E.restore(a.data,a.stored()));assert.equal(reload.ctx.battleState.actor,1);
 a.drain();assert.equal(a.ctx.battleState.actor,1);assert.deepEqual(a.errors,[]);
});
test('courier tactical tray and animated synergy meter drive saved engine actions',async()=>{
 const a=await battle(),c=a.ctx,d=a.document,w=a.world();
 assert.ok(d.querySelector('.synergy-meter'));assert.equal(d.querySelector('#activateSynergy').disabled,true);
 w.run.party[0].skills.push('tactic-aim');c.NeoCourierCombat.sync();
 assert.match(d.querySelector('#tacticsTray').textContent,/Golpe certero/);
 a.click('[data-courier-choice="tactic-aim"]');a.drain();assert.equal(a.world().run.pending.combat.actor,1);
 const b=await battle();b.world().run.pending.combat.synergy=100;b.world().run.pending.combat.enemies.forEach(e=>{e.hp=200;e.maxHp=200});b.ctx.NeoCourierCombat.sync();
 assert.equal(b.document.querySelector('#activateSynergy').disabled,false);
 assert.equal(b.document.querySelector('.synergy-meter').getAttribute('aria-valuenow'),'100');
 b.click('#activateSynergy');b.drain();assert.equal(b.world().run.pending.combat.synergy,0);
 assert.equal(b.world().run.log.filter(x=>/ inflige | falla el ataque/.test(x)).length,3);
 const reload=await battle(b.E.restore(b.data,b.stored()));assert.equal(reload.world().run.pending.combat.synergyReadyRound,4);
});
test('victory searches bodies with the same loot modal, persists collection and discard, and returns to route',async()=>{
 const a=await battle();let turns=0;
 while(a.ctx.battleState.phase==='combat'&&turns++<50){a.click('[data-action="attack"]');a.drain();}
 assert.ok(turns<50);assert.equal(a.ctx.battleState.phase,'loot');
 a.ctx.selectLooter(0);a.ctx.beginLoot(0);assert.ok(a.ctx.battleState.busy);a.drain();
 assert.equal(a.document.querySelector('#lootModal').classList.contains('hidden'),false);
 assert.ok(a.world().run.pending.combat.enemies[0].searched);assert.ok(a.sounds.some(s=>s.includes('battle-victory')));
 const before=a.world().run.minutes,drop=a.ctx.battleState.enemies[0].loot[0];a.ctx.takeLoot(0);
 assert.equal(a.world().run.minutes,before+drop.qty);assert.equal(a.world().run.pending.combat.enemies[0].loot[0].qty,0);
 const persisted=a.E.restore(a.data,a.stored());
 const reload=await battle(persisted);reload.ctx.selectLooter(1);reload.ctx.beginLoot(0);
 assert.equal(reload.ctx.battleState.busy,false);assert.equal(reload.document.querySelector('#lootModal').classList.contains('hidden'),false);
 assert.equal(reload.ctx.battleState.enemies[0].loot[0].status,'taken');
 reload.ctx.discardLoot(1);assert.equal(reload.E.restore(reload.data,reload.stored()).run.pending.combat.enemies[0].loot[1].status,'discarded');reload.ctx.closeLootModal(true);reload.ctx.finishLooting();assert.equal(reload.world().run.pending,null);assert.equal(reload.ctx.battleState,null);assert.equal(reload.refreshes(),1);
 assert.deepEqual(a.errors,[]);
});
test('full bags reject an atomic take-all without losing loot or charging time; retreat exits cleanly',async()=>{
 const a=await battle();let w=a.world();w.run.pending.combat.phase='loot';w.run.pending.combat.enemies.forEach(e=>e.hp=0);w.run.party[0].bag=[{id:'scrap',qty:a.E.bagCapacity(a.data,w.run.party[0])}];
 const before=JSON.stringify(w);assert.throws(()=>a.E.collectLoot(a.data,w,0,'rocio'),/cabe/);assert.equal(JSON.stringify(w),before);
 const b=await battle();b.click('[data-action="flee"]');assert.equal(b.ctx.battleState,null);assert.equal(b.world().run.pending,null);assert.equal(b.world().run.withdrawn,true);assert.deepEqual(b.errors,[]);
});

test('courier mobile arrows select looter and body through the shared presentation',async()=>{
 const a=await battle();let turns=0;
 while(a.ctx.battleState.phase==='combat'&&turns++<50){a.click('[data-action="attack"]');a.drain();}
 assert.equal(a.ctx.battleState.phase,'loot');
 a.click('.stage-card-arrow--ally.next');assert.equal(a.ctx.battleState.looter,0);
 a.click('.stage-card-arrow--ally.next');assert.equal(a.ctx.battleState.looter,1);
 const b=a.ctx.battleState,target=b.lootTarget;
 a.click('.stage-card-arrow--enemy.next');assert.equal(b.lootTarget,(target+1)%b.enemies.length);
 assert.equal(b.busy,false);assert.equal(b.enemies.some(e=>e.searching),false);
 a.ctx.beginLoot(b.lootTarget);a.drain();assert.equal(a.document.querySelector('#lootModal').classList.contains('hidden'),false);
 assert.deepEqual(a.errors,[]);
});
