export const STORAGE_KEY = 'neo2130:lab:compuertas:v1';
export const pairKey = (a, b) => [Number(a), Number(b)].sort((x, y) => x - y).join('-');
export const validPair = pair => Array.isArray(pair) && pair.length === 2 && pair.every(n => Number.isInteger(n) && n >= 1 && n <= 6) && pair[0] !== pair[1];

export function freshSession(puzzle) {
  return { id: puzzle.id, phase: 'intro', digits: '', remaining: puzzle.attempts, hints: 0, bridges: [], readings: [], meter: null, feedback: '', lastReason: '', solved: false };
}

// Resistencia equivalente de una red de seis bornes. Inyectar 1 A y resolver
// las tensiones nodales hace que los puentes en paralelo cambien la lectura.
export function resistance(puzzle, bridges, start, end, omittedEdge = null) {
  if (start === end) return 0;
  const edges = puzzle.edges.filter(([a,b]) => !omittedEdge || pairKey(a,b) !== pairKey(...omittedEdge));
  edges.push(...bridges.map(([a,b]) => [a,b,0.1]));
  const reached = new Set([start]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [a,b] of edges) {
      if (reached.has(a) && !reached.has(b)) { reached.add(b); changed = true; }
      if (reached.has(b) && !reached.has(a)) { reached.add(a); changed = true; }
    }
  }
  if (!reached.has(end)) return Infinity;
  const nodes = [...reached].filter(n => n !== end);
  const index = new Map(nodes.map((n,i) => [n,i]));
  const n = nodes.length;
  const matrix = Array.from({ length: n }, () => Array(n + 1).fill(0));
  matrix[index.get(start)][n] = 1;
  for (const [a,b,r] of edges) {
    if (!reached.has(a) || !reached.has(b)) continue;
    const i = index.get(a), j = index.get(b), conductance = 1 / r;
    if (i !== undefined) matrix[i][i] += conductance;
    if (j !== undefined) matrix[j][j] += conductance;
    if (i !== undefined && j !== undefined) { matrix[i][j] -= conductance; matrix[j][i] -= conductance; }
  }
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) if (Math.abs(matrix[row][col]) > Math.abs(matrix[pivot][col])) pivot = row;
    [matrix[col], matrix[pivot]] = [matrix[pivot], matrix[col]];
    const divisor = matrix[col][col];
    if (Math.abs(divisor) < 1e-10) return Infinity;
    for (let j = col; j <= n; j++) matrix[col][j] /= divisor;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = matrix[row][col];
      for (let j = col; j <= n; j++) matrix[row][j] -= factor * matrix[col][j];
    }
  }
  return Math.max(0, matrix[index.get(start)][n]);
}

export function diagnose(puzzle, bridges) {
  if (bridges.length > puzzle.maxBridges || bridges.some(b => !validPair(b))) return { ok: false, reason: 'Configuración de puentes inválida.' };
  for (const [a,b] of puzzle.isolated) {
    if (Number.isFinite(resistance(puzzle, bridges, a, b))) return { ok: false, reason: `Hay contacto entre ${a} y ${b}. Esos circuitos deben permanecer separados.` };
  }
  for (const [a,b,max] of puzzle.required) {
    const value = resistance(puzzle, bridges, a, b);
    if (!Number.isFinite(value)) return { ok: false, reason: `La orden no llega de ${a} a ${b}. El recorrido sigue abierto.` };
    if (value > max + 1e-8) return { ok: false, reason: `La resistencia de ${a} a ${b} supera ${max} Ω. El cierre no recibe una señal suficiente.` };
  }
  for (const protection of puzzle.protected) {
    const [a,b] = puzzle.required[protection.route];
    if (Number.isFinite(resistance(puzzle, bridges, a, b, protection.edge))) return { ok: false, reason: `Quedó fuera del recorrido: ${protection.name}. Hay continuidad, pero un puente evita ese componente.` };
  }
  return { ok: true, reason: 'Recorrido comprobado. Cierre liberado.' };
}

export function transition(previous, puzzle, action) {
  const state = { ...previous, bridges: previous.bridges.map(p => [...p]), readings: [...previous.readings] };
  if (action.type === 'reset') return freshSession(puzzle);
  if (action.type === 'start' && state.phase === 'intro') { state.phase = 'active'; return state; }
  if (action.type === 'continue' && state.phase === 'failed') { state.phase = 'active'; state.digits = ''; state.feedback = ''; return state; }
  if (action.type === 'hint' && ['active','failed','locked'].includes(state.phase)) { state.hints = Math.min(puzzle.hints.length, state.hints + 1); return state; }
  if (state.phase !== 'active') return state;
  if (action.type === 'digit') {
    const digit = String(action.digit);
    if (!/^\d$/.test(digit) || (puzzle.kind === 'circuit' && !/^[1-6]$/.test(digit))) return state;
    if (puzzle.kind === 'circuit' && state.digits.length === 2) state.digits = '';
    if (state.digits.length < puzzle.digits) state.digits += digit;
    state.feedback = '';
  }
  if (action.type === 'erase') { state.digits = state.digits.slice(0,-1); state.feedback = ''; }
  if (action.type === 'clear') { state.digits = ''; state.feedback = ''; }
  if (action.type === 'remove' && puzzle.kind === 'circuit') { state.bridges = state.bridges.filter(pair => pairKey(...pair) !== action.key); state.meter = null; state.feedback = 'Puente retirado. Puedes volver a medir.'; }
  if (['measure','bridge'].includes(action.type) && puzzle.kind === 'circuit') {
    const pair = state.digits.split('').map(Number);
    if (!validPair(pair)) { state.feedback = 'Selecciona dos puntos distintos del 1 al 6.'; return state; }
    if (action.type === 'measure') {
      const r = resistance(puzzle, state.bridges, ...pair);
      state.meter = { pair, value: Number.isFinite(r) ? r : null };
      state.readings = [{ ...state.meter, bridges: state.bridges.length }, ...state.readings].slice(0,8);
      state.feedback = r === Infinity ? 'Circuito abierto. No hay continuidad.' : r > 2 ? 'Hay contacto, pero la resistencia es alta.' : 'Continuidad. Comprueba también el recorrido completo.';
    } else if (state.bridges.some(b => pairKey(...b) === pairKey(...pair))) {
      state.feedback = 'Ese puente ya está instalado.';
    } else if (state.bridges.length >= puzzle.maxBridges) {
      state.feedback = 'No quedan puentes. Retira uno antes de cambiarlo.';
    } else {
      state.bridges.push(pair.sort((a,b) => a-b)); state.meter = null; state.feedback = `Puente ${pair.join('–')} instalado. Mide para comprobarlo.`; state.digits = '';
    }
  }
  if (action.type === 'submit') {
    if (puzzle.kind === 'numeric' && state.digits.length !== puzzle.digits) { state.feedback = `Faltan cifras: la clave tiene ${puzzle.digits}. Este intento no se descuenta.`; return state; }
    const result = puzzle.kind === 'circuit' ? diagnose(puzzle, state.bridges) : { ok: state.digits === puzzle.answer, reason: 'La clave no coincide con el registro del acceso. Revisa las evidencias antes de volver a probar.' };
    state.remaining--;
    state.lastReason = result.reason;
    state.solved = result.ok;
    state.phase = result.ok ? 'success' : state.remaining > 0 ? 'failed' : 'locked';
    state.feedback = '';
  }
  return state;
}

export function restoreSession(puzzle, saved) {
  const clean = freshSession(puzzle);
  if (!saved || saved.id !== puzzle.id || !['intro','active','failed','locked','success'].includes(saved.phase)) return clean;
  if (!Number.isInteger(saved.remaining) || saved.remaining < 0 || saved.remaining > puzzle.attempts) return clean;
  if (saved.phase === 'success' && saved.solved !== true) return clean;
  if (saved.phase === 'failed' && (saved.remaining === 0 || saved.remaining === puzzle.attempts)) return clean;
  if (['intro','active'].includes(saved.phase) && saved.remaining === 0) return clean;
  if (saved.phase === 'locked' && saved.remaining !== 0) return clean;
  clean.phase = saved.phase; clean.remaining = saved.remaining; clean.solved = saved.phase === 'success';
  clean.digits = typeof saved.digits === 'string' && /^\d*$/.test(saved.digits) ? saved.digits.slice(0,puzzle.digits) : '';
  clean.hints = Number.isInteger(saved.hints) ? Math.max(0,Math.min(puzzle.hints.length,saved.hints)) : 0;
  if (puzzle.kind === 'circuit') {
    const used = new Set();
    clean.bridges = (Array.isArray(saved.bridges) ? saved.bridges : []).filter(pair => {
      if (!validPair(pair) || used.has(pairKey(...pair))) return false;
      used.add(pairKey(...pair)); return true;
    }).slice(0,puzzle.maxBridges);
  }
  clean.lastReason = typeof saved.lastReason === 'string' ? saved.lastReason.slice(0,300) : '';
  return clean;
}
