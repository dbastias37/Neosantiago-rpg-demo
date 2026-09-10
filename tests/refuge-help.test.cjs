const test = require('node:test');
const assert = require('node:assert/strict');
const {boot} = require('./runtime-harness.cjs');

function click(a, id) { a.nodes.get(id).listeners.click.forEach(fn => fn()); }
function enterShop(a) {
  const c = a.ctx;
  c.newGame();
  while (!c.state.introCompleted) { c.revealIntroText(); c.advanceGameIntro(); }
}
function visible(a, id) { return !a.nodes.get(id).classList.contains('hidden'); }
function pulse(a, id) { return a.nodes.get(id).classList.contains('refuge-action-hint'); }

test('opening the shop explains the economy before granting any loot and restores focus on Continue', () => {
  const a = boot(), c = a.ctx; enterShop(a);
  assert.equal(visible(a, 'refugeHelpModal'), true);
  assert.equal(c.refugeHelpTopic, 'economy');
  assert.equal(c.state.starterKitGiven, false);
  assert.equal(c.state.credits, 0);
  assert.equal(c.document.activeElement, a.nodes.get('refugeHelpContinue'));
  assert.equal(a.nodes.get('refuge').getAttribute('inert'), '');
  const party = JSON.stringify(c.state.party);
  click(a, 'refugeHelpContinue');
  assert.equal(c.state.economyHelpSeen, true);
  assert.equal(JSON.stringify(c.state.party), party);
  assert.equal(c.state.credits, 0);
  assert.equal(visible(a, 'refugeHelpModal'), false);
  assert.equal(a.nodes.get('refuge').getAttribute('inert'), undefined);
  assert.equal(c.document.activeElement, a.nodes.get('starterKit'));
  click(a, 'starterKit');
  assert.equal(c.state.credits, 6);
  assert.equal(pulse(a, 'starterKit'), false);
});

test('rest waits for Continue, applies once without payment and stays in the shop', () => {
  const a = boot(), c = a.ctx; enterShop(a); click(a, 'refugeHelpContinue'); click(a, 'starterKit');
  c.state.party[0].hp = 0; c.state.party[1].hp = 10; c.state.party[2].hp = c.state.party[2].maxHp - 2;
  c.state.party.forEach(p => { p.hunger = 90; p.psyche.stress = 5; });
  const before = JSON.stringify(c.state), bags = JSON.stringify(c.state.party.map(p => p.bag));
  click(a, 'refugeRest'); click(a, 'refugeRest');
  assert.equal(c.refugeHelpTopic, 'rest');
  assert.equal(JSON.stringify(c.state), before);
  click(a, 'refugeHelpContinue');
  assert.equal(c.state.party[0].hp, 12); assert.equal(c.state.party[1].hp, 18);
  assert.equal(c.state.party[2].hp, c.state.party[2].maxHp);
  assert.equal(c.state.party.every(p => p.hunger === 100 && p.psyche.stress < 5), true);
  assert.equal(c.state.stats.rests, 1); assert.equal(c.state.stats.restHpRecovered, 22);
  assert.equal(c.state.credits, 6); assert.equal(c.state.morale, 64);
  assert.equal(JSON.stringify(c.state.party.map(p => p.bag)), bags);
  assert.equal(c.state.refuge.active, true); assert.equal(visible(a, 'refuge'), true);
  assert.equal(visible(a, 'logisticsModal'), false);
  assert.equal(visible(a, 'refugeHelpModal'), false);
  assert.equal(a.nodes.get('refugeRest').disabled, true); assert.equal(pulse(a, 'refugeRest'), false);
  const rested = JSON.stringify(c.state);
  click(a, 'refugeHelpContinue'); click(a, 'refugeRest');
  assert.equal(JSON.stringify(c.state), rested); assert.equal(visible(a, 'refugeHelpModal'), false);
  click(a, 'refugeEconomyHelp');
  assert.equal(c.refugeHelpTopic, 'economy');
  assert.match(a.nodes.get('refugeHelpText').textContent, /Ya recibiste/);
  click(a, 'refugeHelpContinue');
  const clothOwner = c.state.party.findIndex(p => p.bag.some(e => e.id === 'cloth'));
  const clothIndex = c.state.party[clothOwner].bag.findIndex(e => e.id === 'cloth');
  c.sellTradeItem(clothOwner, clothIndex); c.buyTradeItem('bandage');
  assert.equal(c.state.stats.trades, 2);
  assert.equal(c.leaveRefuge(), true); assert.equal(c.confirmLeaveRefuge(), true);
  assert.equal(c.state.refuge.active, false);
});

test('help consumes shortcuts, traps focus and Escape cancels a pending rest', () => {
  const a = boot(), c = a.ctx; enterShop(a); click(a, 'refugeHelpContinue'); click(a, 'refugeRest');
  const before = JSON.stringify(c.state);
  for (const key of ['1', '2', '3']) a.listeners.keydown.forEach(fn => fn({key, preventDefault() {}}));
  assert.equal(JSON.stringify(c.state), before);
  let prevented = false;
  c.refugeHelpKeydown({key: 'Tab', preventDefault() { prevented = true; }});
  assert.equal(prevented, true); assert.equal(c.document.activeElement, a.nodes.get('refugeHelpReading'));
  c.refugeHelpKeydown({key: 'Tab', shiftKey: true, preventDefault() {}});
  assert.equal(c.document.activeElement, a.nodes.get('refugeHelpContinue'));
  c.refugeHelpKeydown({key: 'Escape', preventDefault() {}});
  assert.equal(c.document.activeElement, a.nodes.get('refugeRest'));
  assert.equal(a.nodes.get('refuge').getAttribute('inert'), undefined);
  click(a, 'refugeHelpContinue'); assert.equal(JSON.stringify(c.state), before);
});

test('economy help persists across saves, migrates old saves and never confirms a rest on reload or restart', () => {
  const a = boot(); enterShop(a);
  const unread = boot(a.storage); unread.ctx.continueGame(); assert.equal(unread.ctx.refugeHelpTopic, 'economy');
  click(unread, 'refugeHelpContinue'); click(unread, 'refugeRest');
  const restored = boot(a.storage), c = restored.ctx; c.continueGame();
  assert.equal(c.refugeHelpTopic, null); assert.equal(c.state.refuge.rested, false);
  assert.equal(c.state.stats.rests, 0); assert.equal(c.state.economyHelpSeen, true);
  click(restored, 'refugeRest'); c.newGame();
  assert.equal(c.refugeHelpTopic, null); assert.equal(visible(restored, 'refugeHelpModal'), false);
  assert.equal(restored.nodes.get('refuge').getAttribute('inert'), undefined);
  const fresh = JSON.stringify(c.state); click(restored, 'refugeHelpContinue'); assert.equal(JSON.stringify(c.state), fresh);
  const legacy = JSON.parse(unread.storage.get(unread.ctx.KEY));
  delete legacy.economyHelpSeen; legacy.introCompleted = true; legacy.refuge.active = true; legacy.starterKitGiven = true;
  unread.storage.set(unread.ctx.KEY, JSON.stringify(legacy));
  const migrated = boot(unread.storage); migrated.ctx.continueGame();
  assert.equal(migrated.ctx.refugeHelpTopic, 'economy');
  assert.match(migrated.nodes.get('refugeHelpText').textContent, /Ya recibiste/);
});

test('only available buttons pulse; a return visit highlights the newly available actions', () => {
  const a = boot(), c = a.ctx; enterShop(a); click(a, 'refugeHelpContinue');
  for (const id of ['starterKit', 'refugeRest', 'refugeRejoin']) assert.equal(pulse(a, id), true);
  c.switchRefugeNpc('armorer'); assert.equal(pulse(a, 'starterKit'), false);
  c.switchRefugeNpc('mara'); assert.equal(pulse(a, 'starterKit'), true);
  click(a, 'starterKit'); click(a, 'refugeRest'); click(a, 'refugeHelpContinue'); click(a, 'refugeRejoin');
  for (const id of ['starterKit', 'refugeRest', 'refugeRejoin']) assert.equal(pulse(a, id), false);
  c.openRefuge('fled');
  assert.equal(visible(a, 'refugeHelpModal'), false);
  assert.equal(pulse(a, 'starterKit'), false); assert.equal(pulse(a, 'refugeRest'), true); assert.equal(pulse(a, 'refugeRejoin'), true);
});
