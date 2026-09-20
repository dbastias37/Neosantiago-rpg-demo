const { test } = require('node:test');
const assert = require('node:assert/strict');
const modules = Promise.all([import('../labs/compuertas/puzzles.mjs'), import('../labs/compuertas/core.mjs')]);

test('El laboratorio ofrece cinco casos completos en cada uno de los tres paneles', async () => {
  const [{ PUZZLES, FAMILIES }] = await modules;
  assert.equal(new Set(PUZZLES.map(p=>p.id)).size,15);
  for(const family of FAMILIES) assert.equal(PUZZLES.filter(p=>p.family===family.id).length,5);
  for(const p of PUZZLES) {
    assert.equal(p.documents.length,3); assert.equal(p.hints.length,3);
    if(p.kind==='numeric') assert.match(p.answer,new RegExp(`^\\d{${p.digits}}$`));
  }
});
test('Los diez códigos conservan ceros, rechazan vacíos y abren con la solución narrativa', async () => {
  const [{ PUZZLES }, { freshSession, transition }] = await modules;
  for(const p of PUZZLES.filter(p=>p.kind==='numeric')) {
    let s=transition(freshSession(p),p,{type:'start'});
    s=transition(s,p,{type:'submit'}); assert.equal(s.remaining,4); assert.equal(s.phase,'active');
    for(const digit of p.answer) s=transition(s,p,{type:'digit',digit});
    assert.equal(s.digits,p.answer);
    s=transition(s,p,{type:'submit'}); assert.equal(s.phase,'success',p.id); assert.equal(s.solved,true);
    const settled=transition(s,p,{type:'submit'}); assert.equal(settled.remaining,3);
  }
});
test('Cuatro fallos bloquean; cambiar de caso y recargar no reinicia los intentos',async()=>{
  const [{PUZZLES},{freshSession,transition,restoreSession}]=await modules; const p=PUZZLES[0];
  let s=transition(freshSession(p),p,{type:'start'});
  for(let attempt=0;attempt<4;attempt++) {
    for(const digit of '9999') s=transition(s,p,{type:'digit',digit});
    s=transition(s,p,{type:'submit'});
    assert.equal(s.phase,attempt===3?'locked':'failed'); assert.equal(s.remaining,3-attempt);
    s=restoreSession(p,JSON.parse(JSON.stringify(s)));
    s=transition(s,p,{type:'continue'});
  }
  assert.equal(s.phase,'locked'); assert.equal(transition(s,p,{type:'digit',digit:'1'}).digits,'9999');
  s=transition(s,p,{type:'reset'}); assert.equal(s.remaining,4); assert.equal(s.phase,'intro');
});
test('Cada reparación propuesta abre y se rechazan puentes que anulan fusibles o cruzan redes',async()=>{
  const [{PUZZLES},{diagnose}]=await modules;
  for(const p of PUZZLES.filter(p=>p.kind==='circuit')) {
    assert.equal(diagnose(p,[]).ok,false,p.id); assert.equal(diagnose(p,p.sampleSolution).ok,true,p.id);
    const [a,b]=p.required[0]; assert.equal(diagnose(p,[[a,b]]).ok,false,`${p.id}: atajo sin protección`);
  }
  const reversible=PUZZLES.find(p=>p.id==='continuidad-doble');
  assert.equal(diagnose(reversible,[[2,4],[3,5]]).ok,true);
  const separated=PUZZLES.find(p=>p.id==='continuidad-dos-redes');
  assert.equal(diagnose(separated,[[1,2],[4,5]]).ok,false);
});
test('Mediciones equivalentes incluyen los puentes y no consumen intentos',async()=>{
  const [{PUZZLES},{freshSession,transition,resistance}]=await modules;
  const p=PUZZLES.find(p=>p.id==='continuidad-resistencia');
  assert.ok(Math.abs(resistance(p,[],1,4)-18.5)<1e-8);
  assert.ok(Math.abs(resistance(p,[[2,3]],1,4)-(0.5+1/(1/18+1/0.1)))<1e-8);
  let s=transition(freshSession(p),p,{type:'start'});
  for(const digit of '23')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'measure'});assert.equal(s.remaining,4);assert.ok(s.meter.value>17);
  s=transition(s,p,{type:'bridge'});assert.equal(s.remaining,4);assert.equal(s.bridges.length,1);
  for(const digit of '14')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'measure'});assert.ok(s.meter.value<2);
  s=transition(s,p,{type:'submit'});assert.equal(s.phase,'success');
});
test('Terminales inválidos, puentes repetidos y guardados dañados se controlan',async()=>{
  const [{PUZZLES},{freshSession,transition,restoreSession}]=await modules;
  const p=PUZZLES.find(p=>p.kind==='circuit');let s=transition(freshSession(p),p,{type:'start'});
  s=transition(s,p,{type:'digit',digit:'9'});assert.equal(s.digits,'');
  for(const digit of '22')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'bridge'});assert.equal(s.bridges.length,0);
  for(const digit of '23')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'bridge'});
  for(const digit of '32')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'bridge'});assert.equal(s.bridges.length,1);
  for(const digit of '56')s=transition(s,p,{type:'digit',digit});
  s=transition(s,p,{type:'bridge'});assert.equal(s.bridges.length,1);
  s=transition(s,p,{type:'remove',key:'2-3'});assert.equal(s.bridges.length,0);
  assert.equal(restoreSession(p,{...s,remaining:-1}).phase,'intro');
  assert.deepEqual(restoreSession(p,{...s,bridges:[[0,7],[1,1],[2,3],[3,2]]}).bridges,[[2,3]]);
});
