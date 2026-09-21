const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');

test('both production entries identify V0.2 without changing the courier save version',()=>{
 const main=fs.readFileSync('neosantiago-demo.html','utf8'),couriers=fs.readFileSync('extensions/mensajeros/play.html','utf8');
 const data=JSON.parse(fs.readFileSync('extensions/mensajeros/production.json','utf8'));
 assert.match(main,/<title>NeoSantiago 2130 — V0\.2<\/title>/);
 assert.match(main,/Versión 0\.2 · Demo narrativa/);
 assert.match(couriers,/<title>Neo Santiago 2130 · Los Mensajeros · V0\.2<\/title>/);
 assert.match(couriers,/RED DE ENCARGOS · V0\.2/);
 assert.equal(data.release_version,'0.2');assert.equal(data.balance_status,'v0.2_reviewed');
 assert.equal(data.content_version,'2026-09-18.production.2');assert.equal(data.save_key,'neosantiago.mensajeros.production.v1');
});

test('release notes retain V0.2 and record numeric gates in courier production',()=>{
 const notes=fs.readFileSync('docs/version-0.2.md','utf8'),report=fs.readFileSync('INFORME-CONTINUIDAD-V0.2.md','utf8'),engine=fs.readFileSync('extensions/mensajeros/production.mjs','utf8'),entry=fs.readFileSync('extensions/mensajeros/play.html','utf8');
 assert.match(notes,/V0\.2 cierra el bloque narrativo y de sistemas/);assert.match(notes,/dos paneles numéricos/);assert.match(notes,/390 pruebas/);
 assert.match(report,/Estado vigente — entrega 18: cierre de V0\.2/);assert.match(report,/compuertas numéricas en los desvíos/);assert.match(report,/vuelve a ser visual/);
 assert.match(engine,/labs\/compuertas\/puzzles\.mjs/);assert.match(engine,/labs\/compuertas\/core\.mjs/);assert.match(entry,/id="gateLayer"/);
});
