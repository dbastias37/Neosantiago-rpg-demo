import '../../outcomes-v3.js';
const Outcomes = globalThis.NeoOutcomes;

// The legacy status "failed" still means an interrupted, retryable journey.
// This projection records it without changing checkpoints, penalties or rewards.
export function recordInterruption(world, reason = 'exhaustion') {
  const run = world.run;
  if (run?.status !== 'failed') return world;
  const result = Outcomes.record(world.outcomes, {
    id: ['courier', run.mission, run.outcomeAttempt || 0, run.combatSerial || 0, run.index, reason].join(':'),
    kind: Outcomes.kinds.defeat, source: 'courier', missionId: run.mission, stageIndex: run.index, reason
  });
  world.outcomes = result.ledger;
  if (result.applied) run.log.push('EXPEDICIÓN FALLIDA · El encargo sigue pendiente. Puedes reorganizarte desde el último punto de control.');
  return world;
}
export function normalizeOutcomes(world) {
  if (world.outcomes != null) world.outcomes = Outcomes.normalize(world.outcomes);
  return world;
}
export function nextOutcomeAttempt(world) { return Outcomes.normalize(world.outcomes).sequence; }
