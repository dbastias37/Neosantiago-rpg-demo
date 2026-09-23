#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {resolve: resolveAudio} = require('../audio-availability.js');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['.git', 'node_modules', 'tests', 'docs', 'labs', 'scripts', 'artifacts', 'test-results', 'playwright-report']);
const extensions = /\.(?:js|mjs|html|json|css)$/i;
const audioExtensions = /\.(?:mp3|wav|ogg|m4a|aac|flac|webm)$/i;
function walk(folder, accept, skip = new Set()) {
  return fs.readdirSync(path.join(root, folder), {withFileTypes: true}).sort((a,b) => a.name.localeCompare(b.name)).flatMap(entry => {
    if (skip.has(entry.name)) return [];
    const rel = path.posix.join(folder, entry.name);
    return entry.isDirectory() ? walk(rel, accept, skip) : accept(rel) ? [rel] : [];
  });
}
function priority(file, events) {
  if (/audio\/lore\/voice\//.test(file)) return 'P1';
  if (events.some(id => id === 'ambience-battle-victory') || /audio\/(?:combat|hp|loot|trade|loadout|refuge|crafting|skills|decision|ui|archive|lore)\//.test(file)) return 'P0';
  if (events.some(id => id.startsWith('start-'))) return 'P1';
  if (/audio\/ambience\//.test(file)) return 'P2';
  return 'P1';
}
function audit() {
  const files = walk('', file => extensions.test(file) && !/^(?:package(?:-lock)?\.json|audio-catalog\.js)$/.test(file), excluded);
  const html = fs.readFileSync(path.join(root, 'neosantiago-demo.html'), 'utf8');
  const routes = JSON.parse(html.match(/<script id="audioRoutes"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const refs = new Map();
  function add(file, source, index, text, kind) {
    const normalized = path.posix.normalize(file.replace(/[?#].*$/, '')).replace(/^(?:\.\.\/)+/, '').replace(/^\.\//, '');
    const location = {source, line: text.slice(0,index).split('\n').length, kind};
    const list = refs.get(normalized) || [];
    if (!list.some(ref => ref.source === source && ref.line === location.line && ref.kind === kind)) list.push(location);
    refs.set(normalized, list);
  }
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of text.matchAll(/["'`]((?:\.\.\/|\.\/)*audio\/[A-Za-z0-9_./-]+\.(?:mp3|wav|ogg|m4a|aac|flac|webm)(?:\?[^"'`\s]*)?)["'`]/g)) add(match[1],file,match.index,text,'literal');
    // The courier map constructs ../../audio/ + a literal sound argument.
    if (/function sound\(path\).*?audio\//.test(text)) {
      for (const match of text.matchAll(/\bsound\(['"]([^'"]+\.(?:mp3|wav|ogg))['"]\)/g)) add('audio/'+match[1],file,match.index,text,'sound-call');
    }
  }
  const allAudioFiles = walk('audio', () => true);
  const existing = allAudioFiles.filter(file => audioExtensions.test(file));
  const paths = [...new Set([...existing, ...refs.keys()])].sort();
  const assets = paths.map(file => {
    const full = path.join(root,file), exists = fs.existsSync(full), bytes = exists ? fs.statSync(full).size : 0;
    const events = Object.entries(routes).filter(([,value]) => (Array.isArray(value) ? value : [value]).includes(file)).map(([key])=>key);
    return {path:file,status:exists && bytes > 0 ? 'existing' : 'missing',bytes,priority:priority(file,events),events,references:refs.get(file)||[]};
  });
  const catalog = {version:1,existing:assets.filter(a=>a.status==='existing').map(a=>a.path),missing:assets.filter(a=>a.status==='missing').map(a=>a.path)};
  const eventCoverage = Object.entries(routes).map(([id,value]) => {
    const declared = Array.isArray(value) ? value : [value];
    const native = declared.filter(file => catalog.existing.includes(file));
    const playable = resolveAudio(id,routes,{},catalog);
    return {id,declared,playable,status:native.length ? 'original' : playable.length ? 'fallback' : 'pending'};
  });
  const summary = {existing:catalog.existing.length,missing:catalog.missing.length,referenced:assets.filter(a=>a.references.length).length,existingBytes:assets.reduce((sum,a)=>sum+a.bytes,0),events:eventCoverage.length,eventsOriginal:eventCoverage.filter(e=>e.status==='original').length,eventsFallback:eventCoverage.filter(e=>e.status==='fallback').length,eventsPending:eventCoverage.filter(e=>e.status==='pending').length,missingByPriority:Object.fromEntries(['P0','P1','P2'].map(p=>[p,assets.filter(a=>a.status==='missing'&&a.priority===p).length]))};
  return {schemaVersion:1,scope:'Production source files, shared runtime and extensions/mensajeros. Tests, docs, scripts, labs and generated catalog excluded. Literal audio paths plus courier sound-call construction.',summary,sourceFiles:files,assets,eventCoverage,nonAudioFiles:allAudioFiles.filter(file=>!audioExtensions.test(file))};
}
function catalogFor(report) {
  return {version:1,existing:report.assets.filter(a=>a.status==='existing').map(a=>a.path),missing:report.assets.filter(a=>a.status==='missing').map(a=>a.path)};
}
function markdown(report) {
  const s=report.summary;
  return `# Auditoría de audio V0.3\n\nGenerado con \`node scripts/audit-audio.cjs\`. Inventario físico y referencias de producción, incluidos los adaptadores y el mapa de Los Mensajeros. No se descargaron ni generaron sonidos. La existencia de un archivo no certifica su licencia ni su adecuación artística.\n\n${s.existing} archivos de audio existentes (${s.existingBytes.toLocaleString('en-US')} bytes), ${s.missing} rutas faltantes: P0 ${s.missingByPriority.P0}, P1 ${s.missingByPriority.P1}, P2 ${s.missingByPriority.P2}. ${s.events} eventos declarados: ${s.eventsOriginal} con audio original, ${s.eventsFallback} con sustitución explícita usando archivos existentes y ${s.eventsPending} pendientes sin sustitución. Las voces se cuentan como assets separados.\n\n## Criterio\n\nP0: feedback de acciones, combate, daño, loot, comercio, refugio y controles. P1: presentación, introducción, cierre y voces con transcripción disponible. P2: ambientación. La victoria de combate es P0 aunque su archivo viva en ambience. Las referencias incluyen archivo y línea; son auditables, no una promesa de que cada rama se ejecute en cada sesión. El escaneo excluye laboratorios, documentos, tests y archivos generados y reconoce el constructor de rutas de audio del mapa de Encargos. Los valores construidos dinámicamente a partir de nombres de evento se resuelven contra el catálogo JSON de audioRoutes.\n\n## Comportamiento\n\n\`audio-catalog.js\` registra archivos presentes y ausencias conocidas. \`audio-availability.js\` conserva variantes disponibles, evita solicitar ausencias conocidas y reutiliza exclusivamente eventos compatibles de UI, inventario, daño y loot. No reemplaza disparos, melee, caída de aliados/enemigos, error, derrota, voces o ambientación por clics. Los errores de carga descubiertos en ejecución también se omiten. Una ruta nueva desconocida sigue disponible para que agregar un archivo autorizado no exija ampliar una allowlist a mano; regenerar esta auditoría actualiza el inventario.\n\nNo se introducen cambios de guardado. Música/ambiente y SFX conservan sus niveles actuales. Falta una escucha humana para aprobar balance y sustituciones; no existe todavía una mezcla con controles independientes.\n\n## Deuda imprescindible\n\nLos disparos de los tres tipos, melee y caídas de aliados/enemigos siguen necesitando archivos. La derrota y el colapso de la red requieren diseño sonoro autorizado: el catálogo vigente no declara un evento específico de derrota. No se inventa una ruta como si ya existiera. La transcripción permanece disponible para cada voz faltante. Las sustituciones son feedback provisional; no cierran la deuda artística ni cumplen por sí solas el estándar final del vertical slice.\n\n## Inventario exacto\n\n| Archivo | Estado | Prioridad | Bytes | Eventos | Referencias |\n|---|---|---|---:|---|---|\n${report.assets.map(a=>`| \`${a.path}\` | ${a.status==='existing'?'Existe':'Falta'} | ${a.priority} | ${a.bytes} | ${a.events.join(', ')||'Voz / ruta directa'} | ${a.references.map(r=>'\`'+r.source+':'+r.line+'\` ('+r.kind+')').join('<br>')||'Sin referencia de producción'} |`).join('\n')}\n\n## Cobertura por evento\n\n| Evento | Estado | Archivos que resolverá |\n|---|---|---|\n${report.eventCoverage.map(e=>`| \`${e.id}\` | ${e.status} | ${e.playable.map(p=>'\`'+p+'\`').join('<br>')||'Pendiente; sin request conocido fallido'} |`).join('\n')}\n\n## Archivos que no son audio\n\n${report.nonAudioFiles.map(p=>'\`'+p+'\`').join(', ')||'Ninguno'}. No se consideran assets reproducibles.\n\nEl JSON adjunto conserva todos los registros y fuentes escaneadas. Tras agregar o cambiar assets o referencias, regenerar los informes y el catálogo; \`node scripts/audit-audio.cjs --check\` detecta catálogos físicos obsoletos.\n`;
}
function main() {
  const report=audit(),catalog=catalogFor(report),catalogPath=path.join(root,'audio-catalog.js');
  const output='/* Generated by node scripts/audit-audio.cjs. Do not edit by hand. */\n(function(root){var catalog='+JSON.stringify(catalog,null,2)+';root.NeoAudioCatalog=Object.freeze(catalog);if(typeof module!=="undefined"&&module.exports)module.exports=root.NeoAudioCatalog;})(typeof globalThis!=="undefined"?globalThis:this);\n';
  if(process.argv.includes('--check')) {
    if(!fs.existsSync(catalogPath)||fs.readFileSync(catalogPath,'utf8')!==output) {console.error('Audio catalog is stale. Run node scripts/audit-audio.cjs.');process.exitCode=1;return;}
  } else {
    fs.mkdirSync(path.join(root,'docs/v0.3'),{recursive:true});
    fs.writeFileSync(catalogPath,output);
    fs.writeFileSync(path.join(root,'docs/v0.3/audio-audit.json'),JSON.stringify(report,null,2)+'\n');
    fs.writeFileSync(path.join(root,'docs/v0.3/audio-audit.md'),markdown(report));
  }
  console.log(JSON.stringify(report.summary));
}
if(require.main===module)main();
module.exports={audit,catalogFor};
