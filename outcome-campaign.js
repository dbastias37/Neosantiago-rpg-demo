'use strict';
// Called at the existing loseCombat seam. Combat/refuge/finale still apply their own costs.
function recordCampaignCombatOutcome(fled) {
  if (!battleState || typeof NeoOutcomes === 'undefined') return false;
  var result = NeoOutcomes.record(state.outcomes, {
    id: 'campaign:combat:' + state.index + ':' + (Number(state.stats.battles) + 1),
    kind: NeoOutcomes.kinds.defeat,
    source: 'campaign', missionId: 'campaign', stageIndex: state.index,
    reason: fled ? 'retreat' : 'exhaustion'
  });
  state.outcomes = result.ledger;
  return result.applied;
}

(function (root) {
  var busy = false;
  function stableBoundary() {
    if (!gameSessionActive || encounterSaveLocked || battleState || pending || decisionState || npcDialogueState || routeNarrativeState || signalGameState || state.finished) throw new Error('La operación necesita un punto de guardado estable, fuera de encuentros.');
    if (state.activity === 'couriers') throw new Error('Esta operación pertenece a Expedición.');
  }
  function commit(next) {
    // Write before swapping memory. On quota/write errors the active state survives.
    var previous = localStorage.getItem(KEY), serialized = JSON.stringify(next);
    if (previous !== null) localStorage.setItem(KEY + '.outcomes-backup', previous);
    localStorage.setItem(KEY, serialized); state = next;
  }
  function canReload() {
    if (!root.location || typeof root.location.reload !== 'function') throw new Error('No se puede reiniciar la vista de campaña.');
  }
  function reload() { canReload(); root.location.reload(); }
  function capture(slot, operationId) {
    stableBoundary(); commit(NeoOutcomes.captureRecovery(state, slot, operationId)); return true;
  }
  function recover(slot) {
    if (busy) return false;
    canReload();
    var next = NeoOutcomes.restoreRecovery(state, slot), previous = state, wasActive = gameSessionActive;
    try {
      if (!load(JSON.stringify(next))) throw new Error('El punto de recuperación no es una partida válida.');
      next = state;
    } finally { state = previous; }
    busy = true;
    try { commit(next); gameSessionActive = false; reload(); return true; }
    catch (error) { busy = false; gameSessionActive = wasActive; throw error; }
  }
  function menu() {
    if (busy) return false;
    // Leave the collapsed save intact so Continue can reopen its recovery screen.
    canReload(); var wasActive = gameSessionActive; busy = true; gameSessionActive = false;
    try { reload(); return true; } catch (error) { busy = false; gameSessionActive = wasActive; throw error; }
  }
  function resume() {
    var ledger = NeoOutcomes.normalize(state.outcomes);
    if (!ledger.activeGameOver) return false;
    var event = ledger.events.find(function (entry) { return entry.id === ledger.activeGameOver; });
    NeoOutcomeScreen.show({ ledger: ledger, summary: event && event.summary, onRecover: recover, onMenu: menu });
    return true;
  }
  root.NeoCampaignOutcomes = Object.freeze({
    prepare: function (operationId) { return capture('preOperation', operationId); },
    checkpoint: function (operationId) { return capture('checkpoint', operationId); },
    failMission: function (descriptor) {
      stableBoundary();
      var result = NeoOutcomes.apply(state, Object.assign({}, descriptor, { kind: NeoOutcomes.kinds.mission, source: 'campaign' }));
      if (result.applied) { commit(result.state); toast(NeoOutcomes.labels[NeoOutcomes.kinds.mission]); }
      return result.applied;
    },
    collapse: function (descriptor) {
      stableBoundary();
      var result = NeoOutcomes.apply(state, Object.assign({}, descriptor, { kind: NeoOutcomes.kinds.collapse, source: 'campaign' }));
      if (result.applied) commit(result.state); resume(); return result.applied;
    },
    recover: recover, menu: menu, resume: resume
  });
  root.resumeCampaignOutcome = resume;
})(globalThis);
