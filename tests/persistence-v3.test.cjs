const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {boot} = require('./runtime-harness.cjs');

const key = 'neosantiago2130_demo_v3';
const plain = value => JSON.parse(JSON.stringify(value));
const fixture = name => fs.readFileSync(path.join(__dirname, 'fixtures/v0.2', name + '.json'), 'utf8');

for (const name of ['campaign-new', 'campaign-retreat']) {
  test('V0.2 fixture ' + name + ' restores all approved state without schema or key migration', () => {
    const text = fixture(name), expected = JSON.parse(text);
    const storage = new Map([[key, text], ['neosantiago.mensajeros.production.v1', '{"otherTeam":"untouched"}']]);
    const a = boot(storage), c = a.ctx;
    assert.equal(c.KEY, key);
    assert.equal(c.load(), true);
    assert.deepEqual(plain(c.state), expected);
    assert.equal(storage.get(key), text, 'reading a save must not rewrite it');
    c.gameSessionActive = true;
    c.save();
    assert.deepEqual(JSON.parse(storage.get(key)), {...expected,sceneId:c.events[expected.index].id}, 'the first write adds only the optional stable scene anchor');
    assert.equal(storage.get('neosantiago.mensajeros.production.v1'), '{"otherTeam":"untouched"}');
    assert.equal(storage.size, 2, 'the extraction introduces no new save namespace');
  });
}

test('a continued V0.2 retreat keeps its refuge, earned consequences and next event', () => {
  const text = fixture('campaign-retreat'), expected = JSON.parse(text);
  const a = boot(new Map([[key, text]])), c = a.ctx;
  c.continueGame();
  assert.equal(c.gameSessionActive, true);
  assert.equal(c.state.index, 2);
  assert.equal(c.state.refuge.active, true);
  assert.equal(c.state.refuge.reason, 'fled');
  assert.equal(a.nodes.get('refuge').classList.contains('hidden'), false);
  assert.deepEqual(plain(c.state.flags), expected.flags);
  assert.equal(c.state.stats.retreats, expected.stats.retreats);
  assert.deepEqual(plain(c.state.party), expected.party);
});

test('stable scene identifiers migrate both numeric V0.2 saves and newer anchored saves after catalog insertion', () => {
  const c = boot().ctx, scenes = c.NeoCampaignScenes;
  assert.equal(scenes.validate(c.events), true);
  assert.deepEqual(plain(scenes.legacyIds), plain(c.events.map(e => e.id)));
  const inserted = [{id:'d1-added-between',day:1,title:'Nueva situación'},...c.events];
  assert.equal(scenes.validate(inserted), true);
  assert.equal(scenes.resolve(inserted,{index:2,campaignRevision:3}),3);
  assert.equal(scenes.resolve(inserted,{index:0,campaignRevision:3,sceneId:'d3-avenue'}),19);
  assert.equal(scenes.resolve(inserted,{index:0,campaignRevision:0}),1);
  assert.equal(scenes.resolve(inserted,{index:999,campaignRevision:3}),-1);
  assert.equal(scenes.resolve(inserted,{index:1,campaignRevision:3,sceneId:'invented'}),-1);
  assert.throws(()=>scenes.validate(inserted.concat(inserted[0])),/duplicado/);
  assert.throws(()=>scenes.validate(inserted.filter(e=>e.id!=='d2-republica')),/migración/);
});

test('invalid scene anchors reject atomically, while a resumed legacy save gains an anchor only when written', () => {
  const old=fixture('campaign-retreat'),storage=new Map([[key,old]]),c=boot(storage).ctx;
  assert.equal(c.load(),true);
  assert.equal(storage.get(key),old);
  const before=c.state;
  const bad=JSON.stringify({...JSON.parse(old),sceneId:'d9-fabricated'});
  storage.set(key,bad);
  assert.equal(c.load(),false);
  assert.equal(c.state,before);
  assert.equal(storage.get(key),bad);
  storage.set(key,old);
  c.gameSessionActive=true;c.save();
  assert.equal(JSON.parse(storage.get(key)).sceneId,'d1-gate');
  assert.equal(c.load(),true);
  assert.equal(c.state.index,2);
  assert.equal(c.state.sceneId,undefined,'runtime state has no stale scene ID when progress changes');
});

test('new campaign states do not share mutable bags, flags or progression records', () => {
  const c = boot().ctx, first = c.fresh(), second = c.fresh();
  first.party[0].bag[0].qty = 999;
  first.flags.fixtureMutation = true;
  first.expeditionRest.nights[1] = {phase: 'settled'};
  assert.equal(second.party[0].bag[0].qty, 6);
  assert.equal(second.flags.fixtureMutation, undefined);
  assert.deepEqual(plain(second.expeditionRest.nights), {});
});

test('a rejected save keeps the active campaign intact and preserves the original stored bytes', () => {
  const a = boot(), c = a.ctx;
  c.gameSessionActive = true;
  c.state.index = 1;
  c.state.flags.alreadyPlaying = true;
  const previous = c.state, expected = plain(previous);
  const invalid = JSON.parse(fixture('campaign-retreat'));
  invalid.party[0].bag = {}; // Rejected after load has begun constructing the replacement state.
  const text = JSON.stringify(invalid);
  a.storage.set(key, text);
  assert.equal(c.load(), false);
  assert.equal(c.state, previous, 'failed restoration must not replace the active state object');
  assert.deepEqual(plain(c.state), expected);
  assert.equal(a.storage.get(key), text, 'a rejected save remains available for recovery');
});
