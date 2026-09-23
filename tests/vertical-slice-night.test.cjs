const test = require('node:test');
const assert = require('node:assert/strict');
const {boot} = require('./runtime-harness.cjs');

function session() {
  const app = boot(), c = app.ctx;
  c.gameSessionActive = true;
  c.state.introCompleted = c.state.storyPreludeSeen = c.state.starterKitGiven = true;
  c.state.activity = 'story';
  for (const node of app.nodes.values()) node.classList.add('hidden');
  return app;
}

// Exercise the real pharmacy decision, conversation, optional rescue and night
// boundary. Starting at this encounter isolates continuity, not survival balance.
function finishPharmacy(kind) {
  const app = session(), c = app.ctx;
  c.state.index = c.events.findIndex(e => e.title === 'El hombre bajo el mostrador');
  c.choose(kind === 'supplies' ? 1 : kind === 'abandoned' ? 2 : 0);
  for (let step = 0; step < 100 && !c.pendingNight(); step++) {
    if (c.npcDialogueState) {
      c.revealNpcDialogueText();
      if (c.npcDialogueState.selected) c.closeNpcDialogueAndContinue();
      else c.selectNpcDialogueChoice(c.npcDialogueState.nodeId === 'exit' ?
        kind === 'radio' ? 1 : kind === 'decoy' ? 2 : 0 : 0);
    } else if (c.routeNarrativeState) {
      if (c.routeNarrativeState.finished) c.advanceRouteNarrative();
      else { c.revealRouteNarrativeText(); c.selectRouteNarrativeChoice(0); }
    } else if (c.activeCrate()) {
      if (c.activeCrate().phase === 'waiting') app.timers.get(c.crateNoticeTimer).fn();
      else c.leaveCrate();
    } else if (c.pending) c.advance();
    else assert.fail('The pharmacy lost its continuation before the night.');
  }
  assert.equal(c.pendingNight()?.day, 1);
  return app;
}

test('first-night receipt distinguishes real Matías arrival, radio, supplies, abandonment and decoy', () => {
  for (const [kind, expected] of [
    ['rescue', /Matías quedó en la enfermería de Línea 1/],
    ['radio', /no lo confunde con una confirmación de que esté a salvo/],
    ['supplies', /Dejaron provisiones junto a Matías/],
    ['abandoned', /dejaron a Matías en la farmacia/],
    ['decoy', /no les dice qué ocurrió después con Matías/]
  ]) {
    const app = finishPharmacy(kind), c = app.ctx, text = c.pendingNight().context;
    assert.match(text, expected, kind);
    assert.equal(!!c.state.flags.matiasAtRefuge, kind === 'rescue');
    if (kind !== 'rescue') assert.doesNotMatch(text, /Matías quedó en la enfermería/);
    const restored = boot(app.storage).ctx;
    restored.continueGame();
    assert.equal(restored.pendingNight().context, text);
  }
});

test('first night recalls the actual pump result without making unobserved infrastructure claims', () => {
  for (const [choice, expected] of [
    ['victory', /bomba que dejaron funcionando/],
    ['failure', /quedó fuera del control del grupo/],
    ['continue', /siguieron sin asegurarla/]
  ]) {
    const app = session(), c = app.ctx;
    const pump = c.events.find(e => e.title === 'El guardián reconstruido');
    c.apply(choice === 'victory' ? pump.choices[0].victory :
      choice === 'failure' ? pump.choices[1].roll.fail : pump.choices[2]);
    const before = JSON.stringify(c.state);
    assert.match(c.firstNightConsequences(), expected);
    assert.equal(JSON.stringify(c.state), before, 'Reading consequences has no gameplay effects');
  }
  const app = session(), c = app.ctx;
  c.state.flags = {savedMatias:true, carriedMatias:true};
  assert.match(c.firstNightConsequences(), /no hay una llegada confirmada/);
  assert.doesNotMatch(c.firstNightConsequences(), /Matías quedó en la enfermería/);
  c.state.flags = {pumpSecured:true, pumpLost:true};
  assert.match(c.firstNightConsequences(), /anotaciones.*no coinciden/);
});

test('night consequences remain a saved account after reload, do not duplicate costs and preserve legacy text', () => {
  const app = finishPharmacy('rescue'), c = app.ctx;
  const context = c.pendingNight().context;
  const before = JSON.stringify(c.state);
  c.showNight(); c.showNight();
  assert.equal(JSON.stringify(c.state), before);
  c.state.flags.matiasAtRefuge = false;
  c.state.flags.pumpLost = true;
  c.showNight();
  assert.equal(c.pendingNight().context, context, 'An existing night is never rewritten from new flags');
  c.settleNight('share');
  const settled = JSON.stringify(c.state);
  assert.equal(c.settleNight('share'), false);
  assert.equal(JSON.stringify(c.state), settled);
  const stored = JSON.parse(app.storage.get(c.KEY));
  stored.expeditionRest.nights[1].context = 'Texto de una noche guardada en V0.2.';
  app.storage.set(c.KEY, JSON.stringify(stored));
  const restored = boot(app.storage).ctx;
  restored.continueGame();
  assert.equal(restored.pendingNight().context, stored.expeditionRest.nights[1].context);
  assert.equal(restored.pendingNight().phase, 'settled');
});

test('a depleted group keeps confirmed return facts without making fallen companions speak', () => {
  const app = session(), c = app.ctx;
  c.state.party[0].hp = 0;
  c.state.flags = {matiasAtRefuge:true, pumpAbandoned:true};
  const text = c.nightContext(1);
  assert.match(text, /atender a quienes volvieron agotados/);
  assert.match(text, /Matías quedó en la enfermería/);
  assert.match(text, /sin asegurarla/);
  assert.doesNotMatch(text, /Sara deja las vendas|Sara cuenta los suministros/);
});
