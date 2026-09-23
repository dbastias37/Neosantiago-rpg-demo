const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const O = require('../outcomes-v3.js');
const { boot } = require('./runtime-harness.cjs');
const json = value => JSON.parse(JSON.stringify(value));
const defeat = { id: 'combat:1', kind: O.kinds.defeat, source: 'campaign', missionId: 'intro', reason: 'exhaustion' };
const collapse = { id: 'operation:collapse', kind: O.kinds.collapse, source: 'campaign', reason: 'network-collapse', operationId: 'last-line', irreversible: true };

function prepared() {
  let state = { version: 3, credits: 10, xp: 4, party: [{ hp: 30, bag: [{ id: 'ammo9', qty: 4 }] }], flags: {}, receipts: [] };
  state = O.captureRecovery(state, 'preOperation', 'last-line');
  state.credits = 8; state.flags.opened = true;
  return O.captureRecovery(state, 'checkpoint', 'last-line');
}

test('V0.2 absence remains optional; all three levels are explicit and defeat is retryable', () => {
  assert.deepEqual(O.normalize(undefined), O.fresh());
  const result = O.record(undefined, defeat);
  assert.equal(result.applied, true); assert.equal(result.event.kind, 'expedition-failed');
  assert.equal(O.missionAvailable(result.ledger, 'intro'), true);
  assert.deepEqual(result.ledger.failedMissions, {}); assert.equal(result.ledger.activeGameOver, null);
  assert.equal(O.labels[defeat.kind], 'EXPEDICIÓN FALLIDA');
});

test('a repeated callback creates no second event; a reused id with different meaning fails', () => {
  const first = O.record(undefined, defeat);
  const again = O.record(json(first.ledger), defeat);
  assert.equal(again.applied, false); assert.deepEqual(again.ledger, first.ledger);
  assert.throws(() => O.record(first.ledger, { ...defeat, reason: 'retreat' }), /otro hecho/);
});

test('mission failure requires declared irreversibility, persists and never changes resources', () => {
  const legacy = { credits: 7, xp: 8, flags: { trust: true }, party: [] };
  const failure = { ...defeat, id: 'rescue:lost', kind: O.kinds.mission, reason: 'critical-object-lost' };
  assert.throws(() => O.apply(legacy, failure), /explícitamente/);
  const next = O.apply(legacy, { ...failure, irreversible: true }).state;
  assert.equal(O.missionAvailable(json(next.outcomes), 'intro'), false);
  const { outcomes, ...unchanged } = next; assert.deepEqual(unchanged, legacy);
  assert.equal(O.record(next.outcomes, { ...failure, id: 'another-callback', irreversible: true }).applied, false);
  assert.deepEqual(legacy, { credits: 7, xp: 8, flags: { trust: true }, party: [] });
});

test('collapse cannot use ordinary death or an absent recovery point', () => {
  assert.throws(() => O.record(undefined, { ...collapse, reason: 'hp-zero' }), /colapso/);
  assert.throws(() => O.record(undefined, { ...collapse, irreversible: false }), /explícitamente/);
  assert.throws(() => O.record(undefined, collapse), /checkpoint/);
  assert.deepEqual(O.recoveryActions(undefined), []);
});

test('recovery restores the complete snapshot, consumes terminal state and can be attempted again', () => {
  let state = prepared();
  state.credits = 900; state.xp = 999; state.receipts.push('must-rollback'); state.party[0].bag[0].qty = 100; state.flags.later = true;
  state = O.apply(state, collapse).state;
  const before = json(state);
  assert.deepEqual(O.recoveryActions(state.outcomes).map(x => x.id), ['checkpoint', 'preOperation', 'menu']);
  const checkpoint = O.restoreRecovery(state, 'checkpoint');
  assert.equal(checkpoint.credits, 8); assert.equal(checkpoint.xp, 4); assert.deepEqual(checkpoint.receipts, []);
  assert.equal(checkpoint.party[0].bag[0].qty, 4); assert.deepEqual(checkpoint.flags, { opened: true });
  assert.equal(checkpoint.outcomes.activeGameOver, null); assert.deepEqual(state, before);
  assert.throws(() => O.restoreRecovery(checkpoint, 'checkpoint'), /No hay/);
  // A new terminal attempt can recover either retained slot, with no snapshot nesting.
  const retry = O.apply(checkpoint, collapse).state;
  const start = O.restoreRecovery(retry, 'preOperation');
  assert.equal(start.credits, 10); assert.deepEqual(start.flags, {});
  for (const slot of Object.values(start.outcomes.recovery)) assert.deepEqual(slot.snapshot.outcomes.recovery, {});
});

test('a new operation cannot borrow the earlier operation recovery and malformed ledgers are rejected', () => {
  const next = O.captureRecovery(prepared(), 'checkpoint', 'other-operation');
  assert.deepEqual(Object.keys(next.outcomes.recovery), ['checkpoint']);
  assert.throws(() => O.apply(next, collapse), /operación conservada/);
  assert.throws(() => O.normalize({ ...O.fresh(), version: 99 }), /no compatible/);
  assert.throws(() => O.normalize({ ...O.fresh(), activeGameOver: 'missing' }), /sin hecho/);
  const crossed = prepared().outcomes; crossed.recovery.preOperation.operationId = 'elsewhere';
  assert.throws(() => O.normalize(crossed), /operaciones diferentes/);
  const nested = prepared().outcomes; nested.recovery.checkpoint.snapshot.outcomes.recovery = { old: {} };
  assert.throws(() => O.normalize(nested), /recursivo/);
  const missingRecovery = O.apply(prepared(), collapse).state.outcomes; missingRecovery.recovery = {};
  assert.throws(() => O.normalize(missingRecovery), /punto válido/);
});

test('mission ids are data, including prototype-like names', () => {
  const result = O.record(undefined, { ...defeat, kind: O.kinds.mission, missionId: '__proto__', irreversible: true });
  assert.equal(O.missionAvailable(json(result.ledger), '__proto__'), false);
  assert.equal(O.missionAvailable(result.ledger, 'toString'), true);
  assert.equal({}.id, undefined);
});

function campaign() {
  const a = boot(), c = a.ctx;
  c.gameSessionActive = true; c.state.introCompleted = true; c.state.activity = 'story'; c.state.storyPreludeSeen = true;
  c.NeoOutcomeScreen = { show: options => { a.screen = options; }, isOpen: () => !!a.screen };
  a.reloads = 0; c.location.reload = () => { a.reloads++; };
  c.save(); return a;
}

test('actual campaign defeat records once and existing refuge consequences still apply', () => {
  const a = campaign(), c = a.ctx;
  c.state.index = 0; c.state.morale = 60; c.state.threat = 5;
  c.battleState = { choice: {}, config: {}, enemies: [] };
  const credits = c.state.credits;
  c.loseCombat(false); c.loseCombat(false);
  assert.equal(c.state.stats.battles, 1); assert.equal(c.state.stats.retreats, 1);
  assert.equal(c.state.outcomes.events.length, 1); assert.equal(c.state.outcomes.activeGameOver, null);
  assert.equal(c.state.refuge.active, true); assert.equal(c.state.credits, credits);
  assert.match(c.state.refuge.message, /EXPEDICIÓN FALLIDA/);
  c.battleState = { choice: {}, config: {}, enemies: [] }; c.loseCombat(false);
  assert.equal(c.state.outcomes.events.length, 2); assert.notEqual(c.state.outcomes.events[0].id, c.state.outcomes.events[1].id);
  const saved = boot(a.storage).ctx; assert.equal(saved.load(), true); assert.equal(saved.state.outcomes.events.length, 2);
});

test('existing tower defeat still advances instead of creating a Game Over', () => {
  const a = campaign(), c = a.ctx;
  c.state.index = 23; c.state.finaleRevision = 1; c.battleState = { choice: c.eventDisplay(c.events[23],23).choices[0], config: {}, enemies: [] };
  c.loseCombat(false);
  assert.equal(c.state.flags.antennaLost, true); assert.equal(c.state.outcomes.events.length, 1);
  assert.equal(c.state.outcomes.activeGameOver, null); assert.equal(a.screen, undefined);
});

test('dormant campaign operation persists collapse, resumes recovery screen, and rolls back resources once', () => {
  const a = campaign(), c = a.ctx;
  c.state.credits = 10; c.NeoCampaignOutcomes.prepare('operation');
  c.state.credits = 7; c.NeoCampaignOutcomes.checkpoint('operation');
  c.state.credits = 100;
  const declaration = { id: 'operation:collapse', operationId: 'operation', reason: 'network-collapse', irreversible: true, summary: 'La red perdió su último relevo.' };
  assert.equal(c.NeoCampaignOutcomes.collapse(declaration), true); assert.ok(a.screen);
  assert.equal(c.signalPauseActive(), true);
  const beforeBack = JSON.stringify(c.state); assert.equal(c.NeoBackNavigation.handleBack(), false); assert.equal(JSON.stringify(c.state), beforeBack);
  const saved = a.storage.get(c.KEY), b = boot(a.storage); let resumed = null;
  b.ctx.NeoOutcomeScreen = { show: value => { resumed = value; }, isOpen: () => !!resumed };
  b.ctx.location.reload = () => {};
  b.ctx.continueGame(); assert.ok(resumed); assert.equal(b.ctx.state.outcomes.activeGameOver, declaration.id);
  b.ctx.NeoCampaignOutcomes.recover('checkpoint');
  assert.equal(b.ctx.state.credits, 7); assert.equal(b.ctx.state.outcomes.activeGameOver, null);
  assert.equal(b.ctx.NeoCampaignOutcomes.recover('checkpoint'), false);
  assert.equal(JSON.parse(a.storage.get(c.KEY)).credits, 7);
  assert.equal(a.storage.get(c.KEY + '.outcomes-backup'), saved);
  assert.equal(a.storage.has('neosantiago.mensajeros.production.v1'), false);
});

test('menu keeps the collapsed save, unsafe capture is rejected, and failed storage writes leave memory intact', () => {
  const a = campaign(), c = a.ctx;
  c.battleState = {}; assert.throws(() => c.NeoCampaignOutcomes.prepare('unsafe'), /estable/); c.battleState = null;
  c.NeoCampaignOutcomes.prepare('operation'); c.NeoCampaignOutcomes.collapse({ id: 'lost', operationId: 'operation', reason: 'network-collapse', irreversible: true });
  const collapsed = a.storage.get(c.KEY); c.NeoCampaignOutcomes.menu();
  assert.equal(a.storage.get(c.KEY), collapsed); assert.equal(a.reloads, 1);
  const b = campaign(), d = b.ctx, previous = JSON.stringify(d.state);
  d.localStorage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => d.NeoCampaignOutcomes.prepare('full'), /quota/); assert.equal(JSON.stringify(d.state), previous);
});

test('malformed saved outcomes reject load atomically without deleting the original', () => {
  const a = campaign(), c = a.ctx, previous = c.state;
  const broken = JSON.stringify({ ...json(c.state), outcomes: { version: 99 } }); a.storage.set(c.KEY, broken);
  assert.equal(c.load(), false); assert.equal(c.state, previous); assert.equal(a.storage.get(c.KEY), broken);
});

test('production courier exhaustion stays retryable, ledger survives reload and repeated attempts', async () => {
  const E = await import('../extensions/mensajeros/production.mjs');
  const { connectedWorld, atOrigin } = require('./courier-fixtures.cjs');
  const data = E.prepare(JSON.parse(fs.readFileSync(path.join(__dirname, '../extensions/mensajeros/production.json'), 'utf8')));
  let w;
  for (let seed = 0; seed < 100; seed++) {
    w = E.advance(data, E.start(data, atOrigin(data, connectedWorld(E, data, { seed }), 'adasme-01'), 'adasme-01'));
    if (E.options(data, w).some(x => x.id === 'fight')) break;
  }
  w = E.choose(data, w, 'fight');
  w.run.party.forEach((p, i) => { p.hp = i === w.run.party.length - 1 ? 1 : 0; }); w.run.pending.combat.actor = w.run.party.length - 1;
  const credits = w.credits;
  w = E.choose(data, w, 'cover');
  assert.equal(w.run.status, 'failed'); assert.equal(w.outcomes.events[0].kind, O.kinds.defeat);
  assert.equal(O.missionAvailable(w.outcomes, w.run.mission), true); assert.equal(w.outcomes.activeGameOver, null);
  assert.equal(w.credits, credits); assert.match(w.run.log.at(-1), /EXPEDICIÓN FALLIDA/);
  w = E.restore(data, E.serialize(w)); assert.equal(w.outcomes.events.length, 1);
  const retried = E.retry(data, w); assert.equal(retried.run.status, 'active'); assert.equal(retried.outcomes.events.length, 1);
  assert.throws(() => E.retry(data, retried), /reintento/);
  // Existing retry keeps alert and paid receipts unchanged; the new module grants nothing.
  assert.deepEqual(retried.regions, w.regions); assert.deepEqual(retried.paid, w.paid); assert.equal(retried.credits, credits);
  const { recordInterruption } = await import('../extensions/mensajeros/outcomes.mjs');
  retried.run.status = 'failed'; recordInterruption(retried); recordInterruption(retried);
  assert.equal(retried.outcomes.events.length, 2);
});


test('a corrupt recovery snapshot is rejected before overwriting the collapsed campaign', () => {
  const a = campaign(), c = a.ctx;
  c.NeoCampaignOutcomes.prepare('operation');
  c.state.outcomes.recovery.preOperation.snapshot.version = 999;
  c.NeoCampaignOutcomes.collapse({ id: 'lost', operationId: 'operation', reason: 'network-collapse', irreversible: true });
  const before = a.storage.get(c.KEY), previous = c.state;
  assert.throws(() => c.NeoCampaignOutcomes.recover('preOperation'), /partida válida/);
  assert.equal(c.state, previous); assert.equal(a.storage.get(c.KEY), before); assert.equal(c.gameSessionActive, true);
});
