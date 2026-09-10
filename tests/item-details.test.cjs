const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');

function session(){
  const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  Object.defineProperty(document,'activeElement',{configurable:true,writable:true,value:null});
  window.HTMLElement.prototype.focus=function(){document.activeElement=this};
  window.HTMLElement.prototype.load=function(){};window.HTMLElement.prototype.pause=function(){};
  Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return 800}});
  Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{configurable:true,get(){return 700}});
  const a=boot(new Map(),{document}),c=a.ctx;
  c.newGame();while(!c.state.introCompleted){c.revealIntroText();c.advanceGameIntro()}
  c.continueRefugeHelp();c.acceptStarterKit();
  return Object.assign(a,{document,click(node){assert.ok(node,'Clickable node exists');node.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}))}})
}
function shown(a){return !a.document.getElementById('itemDetailModal').classList.contains('hidden')}
function back(a){a.click(a.document.getElementById('itemDetailBack'))}

test('shop pictures and names open read-only details; Back preserves the list and trade buttons still trade',()=>{
  const a=session(),c=a.ctx,d=a.document;
  const picture=d.querySelector('#tradeBuyList [data-item-detail="food"][role="button"]');
  const list=d.getElementById('tradeBuyList');list.scrollTop=125;
  const before=JSON.stringify(c.state);a.click(picture.querySelector('img'));
  assert.equal(shown(a),true);assert.equal(c.itemDetailState.id,'food');assert.equal(JSON.stringify(c.state),before);
  assert.equal(d.getElementById('refuge').hasAttribute('inert'),true);
  assert.deepEqual([...d.querySelectorAll('#itemDetailPrices tbody td')].map(n=>n.textContent),['6 fichas','2 fichas']);
  assert.match(d.getElementById('itemDetailPurpose').textContent,/40 puntos de energía/);
  assert.match(d.getElementById('itemDetailDisassembly').textContent,/no se puede desarmar/);
  back(a);assert.equal(shown(a),false);assert.equal(d.getElementById('refuge').hasAttribute('inert'),false);
  assert.equal(d.activeElement,picture);assert.equal(list.scrollTop,125);assert.equal(d.getElementById('tradeBuyList'),list);
  a.click(d.querySelector('#tradeBuyList [data-item-detail="food"] b'));assert.equal(shown(a),true);back(a);
  a.click(d.querySelector('[data-buy-item="food"]'));assert.equal(c.state.credits,0);assert.equal(c.state.stats.trades,1);assert.equal(shown(a),false);
  a.click(d.querySelector('#tradeSellList [data-item-detail="food"] [data-sell-item]'));
  assert.equal(c.state.credits,2);assert.equal(c.state.stats.trades,2);assert.equal(shown(a),false);
});

test('every object has its real image and description; salvage and unavailable prices stay truthful',()=>{
  const a=session(),c=a.ctx,d=a.document,before=JSON.stringify(c.state);
  for(const [id,item] of Object.entries(c.equipmentDefs)){
    assert.equal(c.openItemDetails(id),true);
    assert.equal(d.getElementById('itemDetailTitle').textContent,item.name);
    assert.ok(d.getElementById('itemDetailPurpose').textContent.includes(item.desc));
    const image=d.querySelector('#itemDetailImage img'),asset='items/'+(item.art||id)+'.webp';
    assert.ok(image.getAttribute('src').startsWith(asset));assert.ok(fs.existsSync(path.join(root,asset)));
    const recipe=c.disassemblyRecipe(id),rewards=[...d.querySelectorAll('#itemDetailDisassembly li')];
    assert.equal(rewards.length,recipe?Object.keys(recipe.rewards).length:0);
    if(recipe){
      for(const [index,[material,qty]] of Object.entries(recipe.rewards).entries()){
        assert.equal(rewards[index].querySelector('span:not(.item-art)').textContent,c.gear(material).name);
        assert.equal(rewards[index].querySelector('b').textContent,'×'+qty);
      }
      assert.match(d.getElementById('itemDetailDisassembly').textContent,/Requiere desbloquear Desarme fino/);
      assert.match(d.getElementById('itemDetailDisassembly').textContent,/fallas los tres intentos/);
    }
    if(item.kind==='mission')assert.match(d.getElementById('itemDetailPrices').textContent,/no se compra ni se vende/);
    back(a);
  }
  assert.equal(JSON.stringify(c.state),before);
  c.openItemDetails('scrap');assert.match(d.getElementById('itemDetailPrices').textContent,/No vende/);assert.match(d.getElementById('itemDetailPurpose').textContent,/reparar cascos y chalecos/);back(a);
  c.openItemDetails('rifle556');assert.deepEqual([...d.querySelectorAll('#itemDetailPrices tbody td')].map(n=>n.textContent),['30 fichas','15 fichas']);back(a);
  c.elias().skills.push('elias_disassemble');c.openItemDetails('radio');assert.match(d.getElementById('itemDetailDisassembly').textContent,/ya tiene Desarme fino/);back(a);
});

test('equipped gear, inventory and crafting cards can be inspected without changing equipment or consuming items',()=>{
  const a=session(),c=a.ctx,d=a.document;c.state.party[0].hp=10;c.openProfile(0);
  const before=JSON.stringify(c.state),content=d.getElementById('profileContent').innerHTML;
  for(const selector of ['.gear-slot [data-item-detail][role="button"]','.bag-item [data-item-detail][role="button"]']){
    const picture=d.querySelector(selector);a.click(picture);assert.equal(shown(a),true);back(a);
    assert.equal(d.activeElement,picture);assert.equal(d.getElementById('profileModal').classList.contains('hidden'),false);
    assert.equal(d.getElementById('profileContent').innerHTML,content);
  }
  assert.equal(JSON.stringify(c.state),before);
  a.click(d.querySelector('.bag-item[data-item-detail="meds"] [data-profile-use]'));
  assert.equal(c.state.party[0].hp,36);assert.equal(shown(a),false);
  c.setProfileTab(0,'crafting');const crafting=JSON.stringify(c.state);
  a.click(d.querySelector('.recipe-card [role="button"]'));assert.equal(shown(a),true);back(a);
  assert.equal(c.profileTab,'crafting');assert.equal(JSON.stringify(c.state),crafting);
});

test('loot inspection shows salvage without taking or destroying the object, then returns to the same loot',()=>{
  const a=session(),c=a.ctx,d=a.document;
  c.state.refuge.active=false;d.getElementById('refuge').classList.add('hidden');
  c.startCombat({title:'Encuentro de prueba',enemies:['drone'],canFlee:true},{label:'prueba',_decisionChanges:[]});
  c.battleState.enemies.forEach(e=>e.hp=0);c.beginLootPhase();c.battleState.looter=1;
  c.elias().skills.push('elias_disassemble');
  c.battleState.enemies[0].loot=[{id:'electronics',qty:2,status:'pending'}];c.renderLootModal(0);
  const picture=d.querySelector('.loot-drop [role="button"]'),before=JSON.stringify(c.state),loot=JSON.stringify(c.battleState.enemies[0].loot);
  a.click(picture);assert.equal(shown(a),true);assert.equal(c.disassemblyState,null);
  assert.equal(JSON.stringify(c.state),before);assert.equal(JSON.stringify(c.battleState.enemies[0].loot),loot);
  assert.match(d.getElementById('itemDetailDisassembly').textContent,/Componentes metálicos/);back(a);
  assert.equal(d.activeElement,picture);assert.equal(d.getElementById('lootModal').classList.contains('hidden'),false);
  assert.equal(c.battleState.openLoot,0);
  a.click(d.querySelector('[data-take-loot="0"]'));assert.equal(c.battleState.enemies[0].loot[0].status,'taken');assert.equal(shown(a),false);
});

test('keyboard inspection traps focus, blocks shortcuts, pauses the inhibitor and cleans up on restart',()=>{
  const a=session(),c=a.ctx,d=a.document,target=d.querySelector('#tradeBuyList [role="button"]');
  let prevented=false;c.itemDetailsKeydown({key:'Enter',target,preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(shown(a),true);
  const before=JSON.stringify(c.state);
  for(const key of ['1','2','3'])d.dispatchEvent(Object.assign(new d.defaultView.Event('keydown'),{key}));
  assert.equal(JSON.stringify(c.state),before);
  c.itemDetailsKeydown({key:'Tab',preventDefault(){}});assert.equal(d.activeElement,d.getElementById('itemDetailReading'));
  c.itemDetailsKeydown({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(d.activeElement,d.getElementById('itemDetailBack'));
  c.itemDetailsKeydown({key:'Escape',preventDefault(){}});assert.equal(d.activeElement,target);assert.equal(shown(a),false);
  c.state.refuge.active=false;d.getElementById('refuge').classList.add('hidden');
  c.state.inhibitor.active=true;c.state.inhibitor.remainingMs=90000;
  assert.equal(c.signalPauseActive(),false);c.openItemDetails('battery');assert.equal(c.signalPauseActive(),true);c.closeItemDetails();assert.equal(c.signalPauseActive(),false);
  c.openRefuge('fled');a.click(d.querySelector('#tradeBuyList [role="button"]'));c.newGame();
  assert.equal(c.itemDetailState,null);assert.equal(shown(a),false);assert.equal(d.getElementById('refuge').hasAttribute('inert'),false);
  assert.equal(c.openItemDetails('not-an-item'),false);
});
