const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {parseHTML}=require('linkedom');
async function setup(){
 const E=await import('../extensions/mensajeros/production.mjs'),data=E.prepare(JSON.parse(fs.readFileSync('extensions/mensajeros/production.json')));
 let world=E.createWorld(data,{seed:3}),view,closed=false,error='';world.credits=100;world.crew[0].hp=10;
 const {document,window}=parseHTML(fs.readFileSync('neosantiago-demo.html','utf8'));window.HTMLElement.prototype.focus=function(){};
 const host={data,world:()=>world,close:()=>closed=true,profile(){},ready:v=>view=v,error:()=>error,transact(fn,...args){try{world=fn(data,world,...args);return true;}catch(e){error=e.message;return false;}}};
 const code=fs.readFileSync('extensions/mensajeros/refuge-adapter.mjs','utf8').replace("import * as E from './production.mjs';",'').replaceAll('import.meta.url',JSON.stringify('https://game.test/extensions/mensajeros/refuge-adapter.mjs'));
 vm.runInNewContext(code,{E,URL,document,parent:{NeoCourierRefugeHost:host}});view.open();
 return {document,E,data,view,world:()=>world,closed:()=>closed,click(selector){const b=document.querySelector(selector);assert.ok(b,selector);assert.ok(!b.disabled);if(b.onclick)b.onclick();else b.dispatchEvent(new window.Event('click',{bubbles:true}));}};
}
test('shared refuge trades into the selected courier bag and preserves campaign state separation',async()=>{
 const a=await setup(),d=a.document;assert.equal(d.getElementById('refuge').classList.contains('hidden'),false);
 assert.match(d.getElementById('traderPortrait').src,/mara-trader/);assert.equal(d.querySelectorAll('.refuge-ally').length,3);
 a.click('[data-member-select="tomas"]');const qty=()=>a.world().crew.find(c=>c.id==='tomas').bag.filter(x=>x.id==='water').reduce((n,x)=>n+x.qty,0),before=qty(),offer=a.data.shop.find(x=>x.id==='water');
 a.click('[data-buy="water"]');assert.equal(qty(),before+offer.qty);assert.equal(a.world().credits,100-offer.price);
 a.click('[data-sell="water"][data-member="tomas"]');assert.equal(qty(),before+offer.qty-1);
 a.click('#npcTabArmorer');assert.match(d.getElementById('traderPortrait').src,/armero-trader/);assert.equal(d.getElementById('tradeBuyTitle').textContent,'Banco del Armero');
 a.click('#refugeRest');assert.ok(a.world().crew.every(c=>c.hp===c.maxHp));
 a.click('#refugeEconomyHelp');assert.equal(d.getElementById('refuge').inert,true);a.view.back();assert.equal(d.getElementById('refuge').inert,false);assert.equal(a.closed(),false);
 a.click('#leaveRefuge');assert.equal(a.closed(),true);
});
test('shop errors leave credits and inventories unchanged and stay visible',async()=>{
 const a=await setup();a.world().crew[0].bag=[{id:'water',qty:100}];const before=JSON.stringify(a.world());
 a.click('[data-buy="water"]');assert.equal(JSON.stringify(a.world()),before);assert.match(a.document.getElementById('refugeMessage').textContent,/espacio/);
});
