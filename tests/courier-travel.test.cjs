const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {parseHTML}=require('linkedom'),root=path.resolve(__dirname,'..');
async function session({saved,reduced=false}={}){
 const E=await import('../extensions/mensajeros/production.mjs'),{animateRoute}=await import('../extensions/mensajeros/travel.mjs');
 const raw=JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')),data=E.prepare(raw);
 const world=saved||E.start(data,E.createWorld(data,{seed:2130}),'adasme-01');world.helpSeen=true;
 const storage=new Map([[data.save_key,E.serialize(world)]]);
 const {document,window}=parseHTML(fs.readFileSync(root+'/extensions/mensajeros/play.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};
 window.HTMLElement.prototype.showModal=function(){this.open=true};window.HTMLElement.prototype.close=function(){this.open=false};
 // Model the SVG geometry API. The production browser supplies the curved metro path.
 const sampled=[];window.Element.prototype.getTotalLength=()=>600;
 window.Element.prototype.getPointAtLength=n=>{sampled.push(n);return{x:945+(794-945)*n/600,y:519+(160-519)*n/600}};
 let clock=0;const frames=[];
 const ctx={E,URL,document,console,crypto:{getRandomValues:a=>a},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:reduced}),setTimeout,clearTimeout,performance:{now:()=>clock},requestAnimationFrame:fn=>frames.push(fn),fetch:async url=>({ok:true,json:async()=>raw,text:async()=>fs.readFileSync(root+'/extensions/mensajeros/map.svg','utf8')})};ctx.window=ctx;
 ctx.animateRoute=args=>animateRoute({...args,requestFrame:fn=>frames.push(fn),now:()=>clock});vm.createContext(ctx);
 const code=fs.readFileSync(root+'/extensions/mensajeros/play.mjs','utf8').replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',JSON.stringify('https://game.test/extensions/mensajeros/play.mjs'));
 await vm.runInContext('(async()=>{'+code+'})()',ctx);
 return {document,data,storage,sampled,world:()=>E.restore(data,storage.get(data.save_key)),click(selector='#advanceButton'){document.querySelector(selector).dispatchEvent(new window.Event('click',{bubbles:true}))},async frame(ms){clock=ms;const batch=frames.splice(0);batch.forEach(fn=>fn(ms));await Promise.resolve();}};
}
test('Vicuña–Tobalaba follows the full unfilled path, blinks for 1 second, then opens the encounter once',async()=>{
 const a=await session(),d=a.document,before=a.world().run.minutes;a.click();a.click();
 const marker=d.getElementById('messenger'),travel=d.querySelector('#missionLayer path[data-edge="0"]');
 assert.equal(travel.getAttribute('fill'),'none');assert.ok([...d.querySelectorAll('#missionLayer path')].every(p=>p.getAttribute('fill')==='none'));
 assert.equal(a.world().run.minutes,before+8);assert.equal(d.getElementById('advanceButton').disabled,true);
 await a.frame(900);assert.equal(d.getElementById('dialog').open,undefined);assert.equal(marker.getAttribute('cx'),'869.5');
 await a.frame(1800);assert.equal(marker.getAttribute('cx'),'794');assert.equal(marker.getAttribute('cy'),'160');assert.ok(marker.classList.contains('arriving'));
 assert.equal(d.getElementById('dialog').open,undefined);await a.frame(2799);assert.equal(d.getElementById('dialog').open,undefined);
 await a.frame(2800);assert.equal(d.getElementById('dialog').open,true);assert.equal(d.getElementById('messenger').getAttribute('cx'),'794');assert.equal(d.getElementById('advanceButton').disabled,false);
 assert.equal(Math.max(...a.sampled),600);assert.equal(a.world().run.minutes,before+8);
});
test('reduced motion still waits one second at the destination before revealing the encounter',async()=>{
 const a=await session({reduced:true});a.click();await a.frame(0);assert.equal(a.document.getElementById('messenger').getAttribute('cx'),'794');
 await a.frame(999);assert.equal(a.document.getElementById('dialog').open,undefined);await a.frame(1000);assert.equal(a.document.getElementById('dialog').open,true);
});
test('reload of a pending encounter keeps the marker at its destination and does not charge travel again',async()=>{
 const a=await session();a.click();const w=a.world(),b=await session({saved:w});
 assert.equal(b.document.getElementById('messenger').getAttribute('cx'),'794');b.click();assert.equal(b.document.getElementById('dialog').open,true);assert.equal(b.world().run.minutes,w.run.minutes);
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
 let saved;for(let seed=0;seed<100;seed++){saved=E.advance(data,E.start(data,E.createWorld(data,{seed}),'adasme-01'));if(saved.run.pending.category==='hostile')break;}
 const a=await session({saved});a.click();assert.equal(a.document.getElementById('dialog').open,true);
 a.click('[data-choice="fight"]');assert.ok(a.world().run.pending.combat);
 assert.equal(a.document.getElementById('dialog').open,false);
 assert.equal(a.document.getElementById('battleLayer').classList.contains('hidden'),false);
});
