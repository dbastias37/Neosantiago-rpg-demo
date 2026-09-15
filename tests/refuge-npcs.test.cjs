const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'docs/metro-refugios/npcs.json')));

test('seven supplied portraits have unique identities and valid WebP assets', () => {
  assert.deepEqual(catalog.npcs.map(n => n.id).sort(),
    ['adasme', 'ana', 'beatriz', 'dr-romero', 'guzman', 'hmorales', 'jimenez']);
  for (const npc of catalog.npcs) {
    const portrait = npc.portrait;
    assert.match(portrait.src, /^characters\/encargos\/[a-z-]+\.webp$/);
    const bytes = fs.readFileSync(path.join(root, portrait.src));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.equal(bytes.length, portrait.bytes);
    assert.ok(bytes.length <= catalog.image_policy.max_bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), portrait.sha256);
  }
});

test('archived contacts remain inactive and recovered profiles reference valid refuges', () => {
  const model = JSON.parse(fs.readFileSync(path.join(root, 'docs/metro-refugios/modelo.json')));
  const refuges = new Set(model.nodes.map(n => n.id));
  assert.equal(catalog.runtime_enabled, false);
  for (const npc of catalog.npcs) {
    assert.equal(npc.enabled, false);
    assert.deepEqual(npc.mission_ids, []);
    if (npc.refuge_id !== null) assert.ok(refuges.has(npc.refuge_id));
    if (npc.profile_status === 'awaiting_prior_profile') {
      assert.equal(npc.refuge_id, null);
      assert.deepEqual(npc.roles, []);
    }
  }
});

test('campaign entry files do not load the archived catalog or portraits', () => {
  for (const file of fs.readdirSync(root).filter(f => /\.(html|js|css)$/.test(f))) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /characters\/encargos\/|metro-refugios\/npcs\.json/, file);
  }
});
