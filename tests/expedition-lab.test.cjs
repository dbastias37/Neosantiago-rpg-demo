const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {boot, root} = require('./runtime-harness.cjs');
const labKey = 'neosantiago2130_expedicion_lab_v1';
const mainKey = 'neosantiago2130_demo_v3';

// State/interaction double, not a browser layout test.
function lab(storage = new Map(), search = '') {
  const app = boot(storage), {ctx, nodes} = app, doc = ctx.document;
  const make = doc.createElement;
  function node() {
    const n = make(); n.children = []; n.isConnected = true;
    n.appendChild = function (child) {
      if (child.owner) child.owner.children = child.owner.children.filter(x => x !== child);
      n.children.push(child); child.owner = n; return child;
    };
    n.insertBefore = function (child, before) {
      if (child.owner) child.owner.children = child.owner.children.filter(x => x !== child);
      const i = n.children.indexOf(before); n.children.splice(i < 0 ? n.children.length : i, 0, child); child.owner = n;
    };
    Object.defineProperty(n, 'firstChild', {get:() => n.children[0]});
    return n;
  }
  doc.createElement = node;
  const nav = node(), play = node(), side = node(), where = node(), brand = node();
  const actions = ['archive','missions','group','history'].map(type => {
    const n = node(); n.dataset.panel = type;
    n.addEventListener('click', () => ctx.openPanel(type)); nav.appendChild(n); return n;
  });
  nav.querySelector = selector => actions.find(n => selector.includes('"' + n.dataset.panel + '"'));
  doc.querySelector = selector => ({'.nav':nav,'.play':play,'.side':side,'.where':where,'.brand':brand})[selector] || node();
  let portraits = [], markup = '';
  const group = nodes.get('groupMini');
  Object.defineProperty(group, 'innerHTML', {get:() => markup, set:value => {
    markup = value;
    portraits = [...value.matchAll(/data-profile="(\d+)"/g)].map(match => {
      const p = node(); p.dataset.profile = match[1]; return p;
    });
  }});
  group.querySelectorAll = () => portraits;
  doc.querySelectorAll = selector => selector === '[data-profile]' ? portraits : [];
  nodes.get('drawerContent').insertBefore = function (child) {this.children.unshift(child)};
  ctx.MutationObserver = class {observe(){}};
  ctx.URLSearchParams = URLSearchParams;
  ctx.location = {search,href:'https://example.test/expedicion-lab.html' + search};
  ctx.history = {replaceState(){}};
  ctx.KEY = labKey;
  app.run(fs.readFileSync(path.join(root,'expedicion-lab.js'),'utf8'));
  return {...app,nav,play,side,portraits:() => portraits};
}

test('lab starts at the station with its own save and leaves the main save byte-for-byte intact', () => {
  const storage = new Map([[mainKey,'existing-main-save']]);
  const app = lab(storage);
  assert.equal(storage.get(mainKey),'existing-main-save');
  assert.equal(JSON.parse(storage.get(labKey)).index,2);
  assert.equal(app.ctx.state.starterKitGiven,true);
  assert.equal(app.nodes.get('titleScreen').classList.contains('hidden'),true);
  assert.equal(app.nav.children.length,3);
  assert.deepEqual(app.nav.children.map(n => n.dataset.panel),['missions','archive','history']);
  assert.equal(app.side.hidden,true);
});
test('all portrait actions open the real inventory and supplies opens current resources', () => {
  const app = lab();
  for (let i=0;i<3;i++) {
    const portrait = app.portraits()[i];
    assert.match(portrait.innerHTML,/member-health/);
    assert.match(portrait.innerHTML,new RegExp(app.ctx.state.party[i].name));
    portrait.listeners.click[0]();
    assert.equal(app.nodes.get('profileModal').classList.contains('hidden'),false);
    assert.match(app.nodes.get('profileContent').innerHTML,/loadout-grid/);
    app.ctx.closeProfile();
  }
  app.ctx.openPanel('group');
  assert.equal(app.nodes.get('drawerTitle').textContent,'Suministros y grupo');
  assert.match(app.nodes.get('drawerContent').children[0].innerHTML,/Alimento/);
  assert.equal(app.nodes.get('drawer').classList.contains('hidden'),false);
});
test('lab reload preserves health, supplies and progress without granting another starter kit', () => {
  const first = lab(); first.ctx.state.index = 3; first.ctx.state.party[0].hp = 29; first.ctx.save();
  const credits = first.ctx.state.credits;
  const second = lab(first.storage);
  assert.equal(second.ctx.state.index,3);
  assert.equal(second.ctx.state.party[0].hp,29);
  assert.equal(second.ctx.state.credits,credits);
});
test('reset clears only the lab checkpoint, while ordinary campaign decisions remain live', () => {
  const storage = new Map([[mainKey,'keep-me']]);
  const first = lab(storage); first.ctx.state.index=4; first.ctx.save();
  const second = lab(storage,'?reset=1');
  assert.equal(second.ctx.state.index,2);
  assert.equal(storage.get(mainKey),'keep-me');
  second.ctx.choose(0);
  assert.ok(second.ctx.battleState);
  assert.equal(second.nodes.get('battle').classList.contains('hidden'),false);
});
