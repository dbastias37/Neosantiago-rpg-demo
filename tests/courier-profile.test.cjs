const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {parseHTML}=require('linkedom'),root=path.resolve(__dirname,'..');
async function profile(saved){
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync(root+'/extensions/mensajeros/production.json')));
 let world=saved||E.createWorld(data,{seed:2130}),stored='',view,closed=false;const errors=[],sounds=[];
 const {document,window}=parseHTML(fs.readFileSync(root+'/neosantiago-demo.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};const base=document.createElement('base');base.setAttribute('href','https://game.test/');document.head.prepend(base);
 const host={data,world:()=>world,announce:()=>{},refresh:()=>{},close:()=>{closed=true},ready:v=>view=v,transact(fn,...args){try{world=fn(data,world,...args);stored=E.serialize(world);return true;}catch(e){errors.push(e.message);return false;}}};
 const ctx={console,E,URL,document,parent:{NeoCourierProfileHost:host},setTimeout:()=>1,clearTimeout(){},Audio:function(src){sounds.push(src);this.play=()=>Promise.resolve();}};ctx.window=ctx;vm.createContext(ctx);
 const append=document.body.append.bind(document.body);document.body.append=node=>{append(node);if(node.tagName==='SCRIPT'){vm.runInContext(fs.readFileSync(root+'/'+new URL(node.src).pathname.split('/').pop(),'utf8'),ctx);node.onload();}};
 const code=fs.readFileSync(root+'/extensions/mensajeros/profile-adapter.mjs','utf8').replace("import * as E from './production.mjs';",'').replaceAll('import.meta.url',JSON.stringify('https://game.test/extensions/mensajeros/profile-adapter.mjs'));
 await vm.runInContext('(async()=>{'+code+'})()',ctx);view.open('rocio');
 return {ctx,document,E,data,view,errors,sounds,world:()=>world,stored:()=>stored,closed:()=>closed,click(selector){const el=document.querySelector(selector);assert.ok(el,selector);assert.ok(!el.disabled,selector+' enabled');if(el.onclick)el.onclick();else el.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));}};
}
test('couriers render the actual Exploration loadout, tabs, slots, portraits and item inspection',async()=>{
 const a=await profile(),d=a.document;
 assert.equal(d.querySelector('#profileModal').classList.contains('hidden'),false);
 assert.equal(d.querySelectorAll('#profileContent .profile-switch').length,3);
 assert.equal(d.querySelectorAll('#profileContent .gear-slot').length,4);
 assert.match(d.querySelector('.loadout-character-art').src,/characters\/mensajeros\/rocio.webp/);
 assert.deepEqual([...d.querySelectorAll('[data-profile-tab]')].map(el=>el.textContent.replace(/\d/g,'')),['Equipamiento','Crafteo','Habilidades']);
 a.click('[data-profile-switch="1"]');assert.match(d.querySelector('#profileTitle').textContent,/Tomás/);
 a.click('[data-psych-toggle]');assert.match(d.querySelector('.psych-panel-body').textContent,/Ciego/);
 a.click('[data-profile-tab="skills"]');assert.match(d.querySelector('#profilePane-skills').textContent,/Memoria acústica/);
 assert.match(d.querySelector('#profilePane-skills').textContent,/1 PH/);
 a.click('[data-profile-tab="inventory"]');a.click('.gear-slot .item-art[data-item-detail="knife"]');
 assert.equal(d.querySelector('#itemDetailModal').classList.contains('hidden'),false);assert.match(d.querySelector('#itemDetailTitle').textContent,/Cuchillo/);
 assert.equal(d.querySelector('#profileModal').hasAttribute('inert'),true);a.click('#itemDetailBack');assert.equal(d.querySelector('#profileModal').hasAttribute('inert'),false);
 a.click('#closeProfile');assert.equal(a.closed(),true);assert.ok(a.sounds.some(s=>s.endsWith('audio/ui/open-panel.mp3')));assert.deepEqual(a.errors,[]);
});
test('shared transfer quantity, confirmation, healing, equipment and skills persist without touching campaign state',async()=>{
 const a=await profile(),d=a.document;
 a.click('[data-transfer-open="0"]');d.querySelector('#transferQty').value='3';a.click('[data-transfer-target="1"]');
 assert.equal(a.world().crew[0].bag.find(x=>x.id==='ammo9').qty,1);assert.equal(a.world().crew[1].bag.find(x=>x.id==='ammo9').qty,3);
 assert.equal(d.querySelector('#transferModal').classList.contains('hidden'),true);
 a.click('[data-profile-switch="1"]');a.click('[data-discard-profile="1"]');a.click('#cancelDiscard');assert.equal(a.world().crew[1].bag.find(x=>x.id==='ammo9').qty,3);
 a.click('[data-discard-profile="1"]');a.click('#confirmDiscard');assert.ok(!a.world().crew[1].bag.some(x=>x.id==='ammo9'));
 a.world().crew[0].hp-=20;a.view.open('rocio');a.click('[data-profile-use="1"]');assert.equal(a.world().crew[0].hp,42);assert.match(d.querySelector('.profile-vital-float').textContent,/14 HP/);
 a.world().crew[0].bag.push({id:'vestTactical',qty:1});a.view.open('rocio');a.click('[data-equip="1"]');assert.equal(a.world().crew[0].equipment.body,'vestTactical');assert.ok(a.world().crew[0].bag.some(x=>x.id==='vestLight'));
 a.click('[data-profile-tab="skills"]');a.click('[data-unlock-skill="trail"]');assert.ok(a.world().crew[0].skills.includes('trail'));assert.equal(d.querySelector('[data-unlock-skill="trail"]').disabled,true);
 const saved=a.E.restore(a.data,a.stored()),reload=await profile(saved);assert.equal(reload.world().crew[0].equipment.body,'vestTactical');assert.equal(reload.world().crew[0].hp,42);assert.ok(reload.world().crew[0].skills.includes('trail'));assert.deepEqual(a.errors,[]);
});
test('full bags reject quantity transfers atomically and protected supplies cannot be discarded',async()=>{
 const a=await profile();let w=a.E.start(a.data,a.world(),'guzman-01'),before=JSON.stringify(w),cargo=JSON.stringify(w.run.cargo);
 assert.throws(()=>a.E.discardItem(a.data,w,'rocio','rotor'),/protegido/);assert.throws(()=>a.E.discardItem(a.data,w,'tomas','water'),/protegido/);
 assert.equal(JSON.stringify(w),before);w.run.party[1].bag=[{id:'scrap',qty:a.E.bagCapacity(a.data,w.run.party[1])-1}];before=JSON.stringify(w);
 assert.throws(()=>a.E.transfer(a.data,w,'rocio','tomas','ammo9',2),/espacio/);assert.equal(JSON.stringify(w),before);
 assert.throws(()=>a.E.transfer(a.data,w,'rocio','tomas','ammo9',-1),/disponible/);
 w=a.E.discardItem(a.data,w,'rocio','ammo9',2);assert.equal(JSON.stringify(w.run.cargo),cargo);assert.equal(w.run.supplies.ammo9,2);
 assert.equal(a.E.restore(a.data,a.E.serialize(w)).run.party[0].bag.find(x=>x.id==='ammo9').qty,2);
});
test('medkits heal from the shared profile and choices retain protected mission supplies',async()=>{
 const a=await profile();a.world().crew[0].bag.push({id:'medkit',qty:1});let w=a.E.start(a.data,a.world(),'adasme-01');const p=w.run.party.find(p=>p.bag.some(x=>x.id==='medkit'));
 assert.ok(p);p.hp-=30;const hp=p.hp,cargo=JSON.stringify(w.run.cargo),stock=w.run.supplies.medkit;
 w=a.E.useItem(a.data,w,p.id,'medkit');assert.equal(w.run.party.find(x=>x.id===p.id).hp,hp+24);assert.equal(w.run.supplies.medkit||0,stock-1);assert.equal(JSON.stringify(w.run.cargo),cargo);
});
