const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');

function visible(a,id){return !a.nodes.get(id).classList.contains('hidden')}

test('Iniciar opens the game menu immediately by click and Enter',()=>{
  const click=boot();
  assert.equal(visible(click,'titleScreen'),true);
  assert.equal(visible(click,'start'),false);
  click.nodes.get('enterTitle').listeners.click.forEach(fn=>fn());
  assert.equal(visible(click,'titleScreen'),false);
  assert.equal(visible(click,'start'),true);
  assert.equal(click.ctx.document.activeElement,click.nodes.get('newGame'));

  const keyboard=boot();
  let prevented=false;
  keyboard.listeners.keydown.forEach(fn=>fn({key:'Enter',preventDefault(){prevented=true},stopImmediatePropagation(){}}));
  assert.equal(prevented,true);
  assert.equal(visible(keyboard,'titleScreen'),false);
  assert.equal(visible(keyboard,'start'),true);
});
