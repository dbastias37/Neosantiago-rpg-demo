const {connectedWorld,atOrigin}=require('./courier-fixtures.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {parseHTML}=require('linkedom'),root=path.resolve(__dirname,'..');
async function session({saved,reduced=false}={}){
 const E=await import('../extensions/mensajeros/production.mjs'),{animateRoute}=await import('../extensions/mensajeros/travel.mjs');
 const raw=JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')),data=E.prepare(raw);
 const world=saved||E.start(data,atOrigin(data,connectedWorld(E,data,{seed:2130}),'adasme-01'),'adasme-01');world.helpSeen=true;
 const storage=new Map([[data.save_key,E.serialize(world)]]);
 const {document,window}=parseHTML(fs.readFileSync(root+'/extensions/mensajeros/play.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};
 window.HTMLElement.prototype.showModal=function(){this.open=true};window.HTMLElement.prototype.close=function(){this.open=false};
 // Model the SVG geometry API. The production browser supplies the curved metro path.
 const sampled=[];window.Element.prototype.getTotalLength=()=>600;
 window.Element.prototype.getPointAtLength=n=>{sampled.push(n);return{x:945+(977-945)*n/600,y:519+(487-519)*n/600}};
 let clock=0;const frames=[];
 const ctx={E,URL,document,console,crypto:{getRandomValues:a=>a},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:reduced}),setTimeout,clearTimeout,performance:{now:()=>clock},requestAnimationFrame:fn=>frames.push(fn),fetch:async url=>({ok:true,json:async()=>raw,text:async()=>fs.readFileSync(root+'/extensions/mensajeros/map.svg','utf8')})};ctx.window=ctx;
 ctx.animateRoute=args=>animateRoute({...args,requestFrame:fn=>frames.push(fn),now:()=>clock});vm.createContext(ctx);
 const code=fs.readFileSync(root+'/extensions/mensajeros/play.mjs','utf8').replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',JSON.stringify('https://game.test/extensions/mensajeros/play.mjs'));
 await vm.runInContext('(async()=>{'+code+'})()',ctx);
 return {document,data,storage,sampled,world:()=>E.restore(data,storage.get(data.save_key)),click(selector='#advanceButton'){document.querySelector(selector).dispatchEvent(new window.Event('click',{bubbles:true}))},async frame(ms){clock=ms;const batch=frames.splice(0);batch.forEach(fn=>fn(ms));await Promise.resolve();}};
}
test('Vicuña–Macul follows the full unfilled path, blinks for 1 second, then opens the encounter once',async()=>{
 const a=await session(),d=a.document,before=a.world().run.minutes;a.click();a.click();
 const marker=d.getElementById('messenger'),travel=d.querySelector('#missionLayer path[data-edge="0"]');
 assert.equal(travel.getAttribute('fill'),'none');assert.ok([...d.querySelectorAll('#missionLayer path')].every(p=>p.getAttribute('fill')==='none'));
 assert.equal(a.world().run.minutes,before+2);assert.equal(d.getElementById('advanceButton').disabled,true);
 await a.frame(900);assert.equal(d.getElementById('dialog').open,undefined);assert.equal(marker.getAttribute('cx'),'961');
 await a.frame(1800);assert.equal(marker.getAttribute('cx'),'977');assert.equal(marker.getAttribute('cy'),'487');assert.ok(marker.classList.contains('arriving'));
 assert.equal(d.getElementById('dialog').open,undefined);await a.frame(2799);assert.equal(d.getElementById('dialog').open,undefined);
 await a.frame(2800);assert.equal(d.getElementById('dialog').open,true);assert.equal(d.getElementById('messenger').getAttribute('cx'),'977');assert.equal(d.getElementById('advanceButton').disabled,false);
 assert.equal(Math.max(...a.sampled),600);assert.equal(a.world().run.minutes,before+2);
});
test('reduced motion still waits one second at the destination before revealing the encounter',async()=>{
 const a=await session({reduced:true});a.click();await a.frame(0);assert.equal(a.document.getElementById('messenger').getAttribute('cx'),'977');
 await a.frame(999);assert.equal(a.document.getElementById('dialog').open,undefined);await a.frame(1000);assert.equal(a.document.getElementById('dialog').open,true);
});
test('reload of a pending encounter keeps the marker at its destination and does not charge travel again',async()=>{
 const a=await session();a.click();const w=a.world(),b=await session({saved:w});
 assert.equal(b.document.getElementById('messenger').getAttribute('cx'),'977');b.click();assert.equal(b.document.getElementById('dialog').open,true);assert.equal(b.world().run.minutes,w.run.minutes);
});
test('a cancelled journey cannot reveal an encounter after the run changes',async()=>{
 const {animateRoute}=await import('../extensions/mensajeros/travel.mjs');let valid=true;const frames=[];
 const {document}=parseHTML('<svg><circle id="m"/></svg>'),marker=document.getElementById('m');
 const completed=animateRoute({path:{getTotalLength:()=>100,getPointAtLength:n=>({x:n,y:0})},marker,destination:{x:100,y:0},now:()=>0,requestFrame:fn=>frames.push(fn),isCurrent:()=>valid});
 frames.shift()(900);assert.ok(marker.classList.contains('arriving'));valid=false;frames.shift()(1900);assert.equal(await completed,false);assert.equal(marker.classList.contains('arriving'),false);
});

test('resolving an encounter closes its dialog and the next leg still waits for travel and arrival',async()=>{
 const a=await session(),d=a.document;a.click();await a.frame(1800);await a.frame(2800);
 assert.equal(d.getElementById('dialog').open,true);
 a.click('#dialog .choices button:not([disabled])');
 assert.equal(a.world().run.pending,null);assert.equal(a.world().run.index,1);
 assert.equal(d.getElementById('dialog').open,false);
 assert.match(d.getElementById('advanceButton').textContent,/Avanzar a/);
 a.click();assert.equal(d.getElementById('dialog').open,false);
 await a.frame(4600);assert.equal(d.getElementById('dialog').open,false);
 await a.frame(5600);assert.equal(d.getElementById('dialog').open,true);
 assert.equal(a.world().run.pending.edgeIndex,1);
});
test('choosing combat dismisses the encounter dialog before showing the battle',async()=>{
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 let saved;for(let seed=0;seed<100;seed++){saved=E.advance(data,E.start(data,atOrigin(data,connectedWorld(E,data,{seed}),'adasme-01'),'adasme-01'));if(saved.run.pending.category==='hostile')break;}
 const a=await session({saved});a.click();assert.equal(a.document.getElementById('dialog').open,true);
 a.click('[data-choice="fight"]');assert.ok(a.world().run.pending.combat);
 assert.equal(a.document.getElementById('dialog').open,false);
 assert.equal(a.document.getElementById('battleLayer').classList.contains('hidden'),false);
});

test('cargo and supplies open separately without stretching the map or advancing the mission',async()=>{
 const a=await session(),d=a.document,before=a.storage.get(a.data.save_key);
 assert.equal(d.querySelectorAll('.cargo-panel .item-row').length,0);assert.ok(d.getElementById('cargoSummary').textContent.includes('suministros'));
 a.click('#cargoButton');assert.equal(d.getElementById('dialog').open,true);assert.ok(d.querySelector('#dialog #cargo'));assert.ok(d.querySelector('#dialog #supplies .item-row'));
 a.click('#supplies .item-row');assert.equal(d.getElementById('itemDialog').open,true);a.click('#itemDialog [data-close="itemDialog"]');assert.equal(d.getElementById('dialog').open,true);
 a.click('#dialogBody [data-close="dialog"]');assert.equal(d.getElementById('dialog').open,false);assert.equal(a.storage.get(a.data.save_key),before);
 a.click('#crewButton');assert.equal(d.getElementById('profileLayer').classList.contains('hidden'),false);assert.match(d.getElementById('profileLayer').src,/profile.html/);assert.equal(d.getElementById('dialog').open,false);
});

test('the market button starts a visible journey and a hostile arrival cannot open the shops early',async()=>{
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));let world;
 for(let seed=1;seed<100;seed++){world=connectedWorld(E,data,{seed});world.location='republica';if(E.advance(data,E.travelHeroes(data,world)).run.pending.category==='hostile')break;}
 const a=await session({saved:world}),d=a.document;a.click('#dialog [data-close="dialog"]');a.click('#heroesButton');
 assert.match(d.getElementById('dialogBody').textContent,/1 tramos/);a.click('[data-travel-heroes]');
 assert.equal(a.world().location,'republica');assert.equal(a.world().run.status,'active');assert.equal(d.getElementById('dialog').open,false);assert.equal(d.querySelectorAll('[data-buy]').length,0);assert.ok(d.getElementById('messenger'));
 a.click();await a.frame(1800);assert.equal(d.getElementById('dialog').open,false);await a.frame(2800);assert.equal(d.getElementById('dialog').open,true);
 a.click('[data-choice="fight"]');assert.ok(a.world().run.pending.combat);assert.equal(d.getElementById('battleLayer').classList.contains('hidden'),false);assert.equal(d.getElementById('dialog').open,false);assert.equal(E.atHeroes(data,a.world()),false);
});
test('finishing a market journey renders arrival and opens both vendors without a fake reward or deadline',async()=>{
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 let w=connectedWorld(E,data,{seed:1});w.location='republica';w.credits=50;w=E.advance(data,E.travelHeroes(data,w));
 const option=E.options(data,w).find(o=>o.id==='scout')||E.options(data,w).find(o=>o.id==='continue')||E.options(data,w).find(o=>E.optionAvailable(w,o)&&!o.combat);w=E.choose(data,w,option.id);
 assert.equal(w.run.status,'completed');const a=await session({saved:w}),d=a.document;
 assert.match(d.getElementById('travel').textContent,/Llegaste a Los Héroes/);assert.doesNotMatch(d.getElementById('status').textContent,/undefined|NaN|Pago estimado/);
 a.click('#travel [data-heroes]');assert.equal(d.getElementById('refugeLayer').classList.contains('hidden'),false);assert.match(d.getElementById('refugeLayer').src,/refuge.html/);assert.equal(d.getElementById('dialog').open,undefined);
});

test('the compact layout keeps the full travel journal accessible in a closable dialog',async()=>{
 const a=await session(),d=a.document;
 a.click('#journalButton');
 assert.equal(d.getElementById('dialog').open,true);
 assert.equal(d.getElementById('dialogTitle').textContent,'El recorrido del grupo');
 for(const line of a.world().run.log)assert.ok(d.getElementById('dialogBody').textContent.includes(line));
 a.click('#dialogBody [data-close="dialog"]');
 assert.equal(d.getElementById('dialog').open,false);
 assert.ok(d.getElementById('advanceButton'));
});

test('fresh interface exposes one local offer and two map nodes; contacts do not reveal the distant atlas',async()=>{
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 const a=await session({saved:E.createWorld(data,{seed:1}),reduced:true}),d=a.document;
 assert.equal(d.querySelectorAll('#dialogBody [data-offer]').length,1);assert.equal(d.querySelector('#dialogBody [data-offer]').dataset.offer,'relevo-01');
 assert.equal(d.querySelectorAll('#missionLayer [role="button"]').length,2);assert.ok(!d.querySelector('#map').textContent.includes('Vicuña'));
 a.click('#contactsButton');assert.equal(d.querySelectorAll('[data-contact]').length,1);assert.equal(d.querySelector('[data-contact]').dataset.contact,'hmorales');
 a.click('[data-contact]');a.click('[data-offer="relevo-01"]');a.click('[data-preview-route]');assert.match(d.querySelector('#dialogBody').textContent,/La Moneda/);assert.ok(!d.querySelector('#dialogBody').textContent.includes('Los Leones'));
});
test('first delivery reveals its two successors in the receipt and map, survives reload, and reset hides them again',async()=>{
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 const a=await session({saved:E.createWorld(data,{seed:1}),reduced:true}),d=a.document;
 a.click('[data-offer="relevo-01"]');a.click('[data-accept]');a.click();await a.frame(0);await a.frame(1000);a.click('[data-choice="confirm"]');a.click();await a.frame(1001);await a.frame(2001);a.click('[data-choice="deliver"]');
 assert.equal(a.world().paid.length,1);assert.match(d.querySelector('#dialogBody').textContent,/Rocío confirma/);assert.ok(!d.querySelector('#dialogBody').textContent.includes('«Rocío confirma'));assert.match(d.querySelector('#dialogBody').textContent,/«Ya sé a qué hora/);assert.match(d.querySelector('#dialogBody').textContent,/La entrega abrió nuevos trabajos/);assert.match(d.querySelector('#dialogBody').textContent,/Reserva de emergencia/);assert.ok(d.querySelector('#map').textContent.includes('República'));assert.ok(!d.querySelector('#map').textContent.includes('Vicuña'));
 const restored=await session({saved:a.world(),reduced:true});restored.click('#catalogButton');assert.equal(restored.document.querySelectorAll('#dialogBody [data-offer]').length,3);
 a.click('[data-catalog]');a.click('[data-filter="available"]');assert.equal(d.querySelectorAll('#dialogBody [data-offer]').length,2);
 a.click('#resetCouriers');a.click('[data-reset-confirm]');assert.equal(d.querySelectorAll('#dialogBody [data-offer]').length,1);assert.equal(d.querySelectorAll('#missionLayer [role="button"]').length,2);assert.equal(a.world().paid.length,0);
});

test('Adasme opens the return scene, postponing does not choose, and reload preserves a single response',async()=>{
 const {extraction}=require('./courier-return-fixtures.cjs'),{w}=await extraction();const a=await session({saved:w}),d=a.document;
 a.click('#contactsButton');a.click('[data-contact="adasme"]');assert.match(d.querySelector('#dialogBody').textContent,/Después de traer a Darío/);assert.ok(!d.querySelector('#dialogBody [data-offer]'));a.click('#dialogBody [data-close]');assert.equal(a.world().aftermath.rescueReturn.approach,null);
 a.click('#brief [data-return-story]');a.click('[data-return-answer="rest"]');assert.match(d.querySelector('#dialogBody').textContent,/Una respuesta pendiente/);assert.equal(d.querySelectorAll('[data-return-answer]').length,0);assert.ok(d.querySelector('#dialogBody [data-heroes]'));
 const b=await session({saved:a.world()});b.click('#brief [data-return-story]');assert.match(b.document.querySelector('#dialogBody').textContent,/deja pendiente la de Darío/);assert.equal(b.world().credits,w.credits);
});
test('a later message is available from the main panel and remains readable through Adasme after closing',async()=>{
 const {extraction,finish}=require('./courier-return-fixtures.cjs'),{E,d,w}=await extraction();let saved=finish(E,d,E.travelHeroes(d,E.answerReturn(d,w,'account')));const a=await session({saved}),doc=a.document;
 assert.match(doc.querySelector('#brief [data-return-story]').textContent,/Llegó una respuesta/);a.click('#brief [data-return-story]');assert.match(doc.querySelector('#dialogBody').textContent,/cada caja queda asignada a dos personas/);a.click('[data-return-answer="acknowledge"]');assert.equal(a.world().aftermath.rescueReturn.closed,true);assert.equal(doc.querySelectorAll('[data-return-answer]').length,0);a.click('#dialogBody [data-close]');a.click('#contactsButton');a.click('[data-contact="adasme"]');assert.match(doc.querySelector('#dialogBody').textContent,/Lo que quedó después del regreso/);
});

test('remote offer previews the approach without moving; arrival exposes acceptance and a fresh assignment clock',async()=>{
 const {setup,finish}=require('./courier-return-fixtures.cjs'),{E,d:data}=await setup();let saved=finish(E,data,E.start(data,E.createWorld(data,{seed:1}),'relevo-01'));
 const a=await session({saved,reduced:true}),d=a.document,before=E.serialize(a.world());
 a.click('#catalogButton');a.click('[data-offer="romero-01"]');assert.ok(!d.querySelector('[data-accept]'));assert.ok(d.querySelector('[data-approach="romero-01"]'));
 a.click('[data-approach]');assert.match(d.querySelector('#dialogBody').textContent,/Llegar a República/);assert.match(d.querySelector('#dialogBody').textContent,/1 tramos/);assert.match(d.querySelector('#dialogBody').textContent,/cuando lo aceptes/);assert.equal(E.serialize(a.world()),before);
 a.click('[data-start-approach]');assert.equal(a.world().location,'heroes');assert.equal(a.world().run.kind,'travel');assert.doesNotMatch(d.querySelector('#status').textContent,/Pago estimado/);
 a.click();await a.frame(0);await a.frame(1000);assert.ok(a.world().run.pending);assert.ok(!d.querySelector('[data-accept]'));
 const option=E.options(data,a.world()).find(o=>E.optionAvailable(a.world(),o)&&['scout','avoid','continue'].includes(o.id))||E.options(data,a.world()).find(o=>E.optionAvailable(a.world(),o));a.click('[data-choice="'+option.id+'"]');
 assert.equal(a.world().location,'republica');assert.equal(a.world().run.status,'completed');assert.deepEqual(a.world().paid,['relevo-01']);assert.match(d.querySelector('#travel').textContent,/Llegaste a República/);
 a.click('#travel [data-offer]');assert.ok(d.querySelector('[data-accept="romero-01"]'));assert.ok(!d.querySelector('[data-approach]'));a.click('[data-accept]');assert.equal(a.world().run.minutes,0);assert.equal(a.world().run.mission,'romero-01');assert.equal(a.world().location,'republica');
});
test('Tobalaba acceptance shows only the actual extraction legs, deadline and zero progress after reload',async()=>{
 const {setup}=require('./courier-return-fixtures.cjs'),{E,d:data}=await setup();let saved=connectedWorld(E,data,{seed:1});saved.location='tobalaba';
 const a=await session({saved}),d=a.document;a.click('[data-offer="adasme-01"]');assert.match(d.querySelector('#dialogBody').textContent,/116 minutos/);a.click('[data-preview-route]');assert.equal(d.querySelectorAll('.route-list li').length,17);assert.equal(d.querySelector('.route-list li').textContent.includes('Tobalaba'),true);
 a.click('#catalogButton');a.click('[data-offer="adasme-01"]');a.click('[data-accept]');assert.match(d.querySelector('#travel').textContent,/0\/16/);assert.match(d.querySelector('#status').textContent,/0 \/ 116 min/);assert.equal(d.querySelectorAll('#missionLayer path.route-selected').length,16);
 const b=await session({saved:a.world()});assert.match(b.document.querySelector('#travel').textContent,/0\/16/);assert.equal(b.world().run.index,12);assert.ok(!b.world().progression.visited.includes('macul'));
});
