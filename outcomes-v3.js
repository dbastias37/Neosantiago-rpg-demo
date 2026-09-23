(function (root, factory) {
  'use strict';
  var api = factory();
  root.NeoOutcomes = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Shared contracts, not a second combat engine. This module grants no resources.
  var KINDS = Object.freeze({ defeat: 'expedition-failed', mission: 'mission-failed', collapse: 'network-collapsed' });
  var LABELS = Object.freeze({ 'expedition-failed': 'EXPEDICIÓN FALLIDA', 'mission-failed': 'MISIÓN FALLIDA', 'network-collapsed': 'LA RED CAYÓ' });
  var SLOTS = ['checkpoint', 'preOperation'];
  var own = function (o, key) { return Object.prototype.hasOwnProperty.call(o, key); };
  var object = function (v) { return !!v && typeof v === 'object' && !Array.isArray(v); };
  var copy = function (v) { return JSON.parse(JSON.stringify(v)); };
  function need(condition, message) { if (!condition) throw new Error(message); }
  function text(value, name) { need(typeof value === 'string' && value.trim().length > 0 && value.length <= 500, 'Outcome ' + name + ' inválido.'); return value; }
  function fresh() { return { version: 1, sequence: 0, events: [], failedMissions: {}, activeGameOver: null, recovery: {} }; }
  function normalizedEvent(value) {
    need(object(value) && own(LABELS, value.kind), 'Tipo de desenlace inválido.');
    var event = { id: text(value.id, 'id'), kind: value.kind, source: text(value.source, 'source'), reason: text(value.reason, 'reason') };
    if (value.missionId != null) event.missionId = text(value.missionId, 'missionId');
    if (Number.isInteger(value.stageIndex) && value.stageIndex >= 0) event.stageIndex = value.stageIndex;
    if (value.kind !== KINDS.defeat) {
      need(value.irreversible === true, 'Una consecuencia irreversible debe declararse explícitamente.');
      event.irreversible = true;
    }
    if (value.kind === KINDS.mission) need(event.missionId, 'Una misión fallida necesita missionId.');
    if (value.kind === KINDS.collapse) {
      need(value.reason === 'network-collapse', 'Game Over se reserva al colapso irreversible de la red.');
      event.operationId = text(value.operationId, 'operationId');
    }
    if (value.summary != null) event.summary = text(value.summary, 'summary');
    return event;
  }
  function normalize(value) {
    if (value == null) return fresh();
    need(object(value) && value.version === 1, 'Versión de desenlaces no compatible; conserva el guardado original.');
    need(Array.isArray(value.events), 'Registro de desenlaces inválido.');
    var out = fresh(), seen = new Set();
    value.events.forEach(function (raw) {
      var event = normalizedEvent(raw);
      need(!seen.has(event.id), 'Registro de desenlaces duplicado.');
      seen.add(event.id); out.sequence += 1; event.sequence = out.sequence; out.events.push(event);
      if (event.kind === KINDS.mission) Object.defineProperty(out.failedMissions, event.missionId, { value: event.id, enumerable: true, writable: true, configurable: true });
    });
    if (value.activeGameOver != null) {
      var collapse = out.events.find(function (event) { return event.id === value.activeGameOver && event.kind === KINDS.collapse; });
      need(collapse, 'Game Over sin hecho irreversible.'); out.activeGameOver = collapse.id;
    }
    if (value.recovery != null) {
      need(object(value.recovery), 'Puntos de recuperación inválidos.');
      SLOTS.forEach(function (slot) {
        if (!own(value.recovery, slot)) return;
        var checkpoint = value.recovery[slot];
        need(object(checkpoint) && object(checkpoint.snapshot), 'Snapshot de recuperación inválido.');
        text(checkpoint.operationId, 'operationId');
        // No recursive snapshot trees or an already-collapsed world may be a recovery point.
        need(!checkpoint.snapshot.outcomes || (!checkpoint.snapshot.outcomes.activeGameOver && !Object.keys(checkpoint.snapshot.outcomes.recovery || {}).length), 'Snapshot de recuperación recursivo o colapsado.');
        out.recovery[slot] = copy(checkpoint);
      });
    }
    var operations = new Set(Object.keys(out.recovery).map(function (slot) { return out.recovery[slot].operationId; }));
    need(operations.size <= 1, 'Los checkpoints pertenecen a operaciones diferentes.');
    if (out.activeGameOver) {
      var active = out.events.find(function (event) { return event.id === out.activeGameOver; });
      need(operations.size === 1 && operations.has(active.operationId), 'Game Over sin un punto válido de su operación.');
    }
    return out;
  }
  function record(value, descriptor) {
    var ledger = normalize(value), event = normalizedEvent(descriptor);
    var existing = ledger.events.find(function (entry) { return entry.id === event.id; });
    if (existing) {
      var comparison = copy(existing); delete comparison.sequence;
      need(JSON.stringify(comparison) === JSON.stringify(event), 'El identificador del desenlace ya pertenece a otro hecho.');
      return { ledger: ledger, applied: false, event: existing };
    }
    need(!ledger.activeGameOver, 'Resuelve el Game Over antes de registrar nuevos hechos.');
    if (event.kind === KINDS.mission && own(ledger.failedMissions, event.missionId)) return { ledger: ledger, applied: false, event: ledger.events.find(function (e) { return e.id === ledger.failedMissions[event.missionId]; }) };
    if (event.kind === KINDS.collapse) {
      need(SLOTS.some(function (slot) { return own(ledger.recovery, slot); }), 'Antes del colapso guarda un checkpoint o un estado previo a la operación.');
      need(Object.keys(ledger.recovery).every(function (slot) { return ledger.recovery[slot].operationId === event.operationId; }), 'El colapso no pertenece a la operación conservada.');
    }
    event.sequence = ++ledger.sequence; ledger.events.push(event);
    if (event.kind === KINDS.mission) Object.defineProperty(ledger.failedMissions, event.missionId, { value: event.id, enumerable: true, writable: true, configurable: true });
    if (event.kind === KINDS.collapse) ledger.activeGameOver = event.id;
    return { ledger: ledger, applied: true, event: event };
  }
  function apply(state, descriptor) {
    need(object(state), 'Estado de juego inválido.');
    var result = record(state.outcomes, descriptor), next = copy(state); next.outcomes = result.ledger;
    return { state: next, applied: result.applied, event: result.event };
  }
  function captureRecovery(state, slot, operationId) {
    need(object(state) && SLOTS.includes(slot), 'Destino de recuperación inválido.'); text(operationId, 'operationId');
    var next = copy(state), ledger = normalize(state.outcomes);
    need(!ledger.activeGameOver, 'No se puede capturar un estado ya colapsado.');
    if (Object.keys(ledger.recovery).some(function (key) { return ledger.recovery[key].operationId !== operationId; })) ledger.recovery = {};
    var snapshot = copy(state), snapshotLedger = normalize(state.outcomes); snapshotLedger.recovery = {};
    snapshot.outcomes = snapshotLedger;
    ledger.recovery[slot] = { operationId: operationId, snapshot: snapshot }; next.outcomes = ledger;
    return next;
  }
  function recoveryActions(value) {
    var ledger = normalize(value);
    if (!ledger.activeGameOver) return [];
    return SLOTS.filter(function (slot) { return own(ledger.recovery, slot); }).map(function (slot) {
      return { id: slot, label: slot === 'checkpoint' ? 'Reintentar checkpoint' : 'Cargar antes de la operación' };
    }).concat([{ id: 'menu', label: 'Menú principal' }]);
  }
  function restoreRecovery(state, slot) {
    var ledger = normalize(state && state.outcomes);
    need(ledger.activeGameOver, 'No hay un Game Over pendiente.');
    need(SLOTS.includes(slot) && own(ledger.recovery, slot), 'No existe ese punto de recuperación.');
    // Restore the entire world together: resources, XP, flags and receipts never merge.
    // Consuming the active outcome before another action prevents double-click recovery.
    var snapshot = copy(ledger.recovery[slot].snapshot);
    snapshot.outcomes = normalize(snapshot.outcomes);
    snapshot.outcomes.recovery = copy(ledger.recovery);
    return snapshot;
  }
  function missionAvailable(value, missionId) { return !own(normalize(value).failedMissions, missionId); }
  return Object.freeze({ version: 1, kinds: KINDS, labels: LABELS, fresh: fresh, normalize: normalize, record: record, apply: apply, captureRecovery: captureRecovery, restoreRecovery: restoreRecovery, recoveryActions: recoveryActions, missionAvailable: missionAvailable });
});
