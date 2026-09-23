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
    assert.deepEqual(JSON.parse(storage.get(key)), expected);
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

test('new campaign states do not share mutable bags, flags or progression records', () => {
  const c = boot().ctx, first = c.fresh(), second = c.fresh();
  first.party[0].bag[0].qty = 999;
  first.flags.fixtureMutation = true;
  first.expeditionRest.nights[1] = {phase: 'settled'};
  assert.equal(second.party[0].bag[0].qty, 6);
  assert.equal(second.flags.fixtureMutation, undefined);
  assert.deepEqual(plain(second.expeditionRest.nights), {});
});
