const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {parseHTML}=require('linkedom');
const {boot,root}=require('./runtime-harness.cjs');

test('optional world reading opens at the premise, navigates every section and preserves the run',()=>{
  const a=boot(),c=a.ctx;c.newGame();c.showGameIntro(2);
  const before=JSON.stringify(c.state),saved=a.storage.get(c.KEY),timer=c.introTypeTimer;
  a.nodes.get('openWorldLore').listeners.click[0]();
  assert.equal(a.nodes.get('lorePanelOpening').classList.contains('hidden'),false);
  assert.equal(a.nodes.get('lorePanelHistory').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('gameIntro').getAttribute('inert'),'');
  a.timers.get(timer).fn();assert.equal(a.nodes.get('introText').textContent,'');
  for(const section of ['Tunnels','Governance','History','Factions','Extracts','Opening']){
    const tab=a.nodes.get('loreTab'+section);tab.listeners.click[0]();
    assert.equal(tab.getAttribute('aria-selected'),'true');
    const panel=a.nodes.get(tab.getAttribute('aria-controls'));
    assert.equal(panel.classList.contains('hidden'),false);
    assert.equal(panel.getAttribute('aria-labelledby'),tab.id);
    assert.equal([...a.nodes.values()].filter(n=>n.id.startsWith('lorePanel')&&!n.classList.contains('hidden')).length,1);
  }
  for(const key of ['1','2','3','Enter'])a.listeners.keydown.forEach(fn=>fn({key,preventDefault(){}}));
  assert.equal(JSON.stringify(c.state),before);assert.equal(a.storage.get(c.KEY),saved);
  a.listeners.keydown.forEach(fn=>fn({key:'Escape',preventDefault(){}}));
  assert.equal(a.nodes.get('worldLoreModal').classList.contains('hidden'),true);
  assert.equal(a.nodes.get('gameIntro').getAttribute('inert'),undefined);
  assert.equal(c.document.activeElement,a.nodes.get('openWorldLore'));
  assert.equal(c.introStep,2);a.timers.get(timer).fn();assert.ok(a.nodes.get('introText').textContent.length>0);
});

test('world reading keeps keyboard focus inside visible controls, including the novel link',()=>{
  const {document,window}=parseHTML(fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8'));
  let focused;Object.defineProperty(document,'activeElement',{get:()=>focused});
  window.HTMLElement.prototype.focus=function(){focused=this};
  window.HTMLElement.prototype.load=function(){};
  window.HTMLElement.prototype.pause=function(){};
  const {ctx:c}=boot(new Map(),{document});c.newGame();c.openWorldLore(document.getElementById('openWorldLore'));
  const close=document.getElementById('closeWorldLore');
  const link=document.querySelector('#lorePanelOpening a');
  assert.equal(link.getAttribute('href'),'https://neo2130.onrender.com/');
  close.focus();let prevented=false;
  c.worldLoreKeydown({key:'Tab',shiftKey:true,preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(document.activeElement,link);
  c.worldLoreKeydown({key:'Tab',preventDefault(){}});assert.equal(document.activeElement,close);
  c.switchWorldLore('extracts');document.getElementById('closeWorldLoreBottom').focus();
  c.worldLoreKeydown({key:'Tab',preventDefault(){}});assert.equal(document.activeElement,close);
});
