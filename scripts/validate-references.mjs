// Literal local asset/module references. Dynamic constructed paths require browser QA.
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
export const repo=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ignored=new Set(['.git','node_modules','test-results','test-results-entry-review','playwright-report','docs','tests','scripts']);
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(ignored.has(entry.name))continue;const p=resolve(dir,entry.name);if(entry.isDirectory())files.push(...await walk(p));else if(['PROVENANCE.json','audio-catalog.js'].includes(entry.name))continue;else if(/\.(?:js|mjs|html|css|json)$/.test(entry.name)&&!/^package/.test(entry.name))files.push(p);}return files;}
async function exists(p){try{return(await stat(p)).isFile();}catch{return false;}}
export async function inspectReferences(root=repo){
 const records=new Map();
 for(const file of await walk(root)){
  const source=relative(root,file).split(sep).join('/'),content=await readFile(file,'utf8');
  const refs=new Set([...content.matchAll(/["'`(]((?:\.\.?\/|\/?(?:audio|assets|backgrounds|items|portraits|extensions|labs|runtime)\/)?[a-zA-Z0-9_@./-]+\.(?:mp3|wav|ogg|webp|png|jpg|jpeg|svg|woff2|css|mjs|js|json|html)(?:\?[^"'`\s)]*)?)["'`)]/g)].map(m=>m[1]));
  for(const ref of refs){
   const clean=ref.split(/[?#]/)[0];if(/^[a-z]+:/i.test(clean))continue;
   // Bare prose examples and file extension fragments are not a URL.
   if(!clean.includes('/')&&(!['.html','.css'].includes(extname(file))||clean.startsWith('-')))continue;
   if(clean==='ui/click-metal.mp3'&&source==='extensions/mensajeros/play.mjs')continue; // sound() prefixes audio/; checked by browser QA
   const base=source==='labs/expedicion-ab/data.json'?root:dirname(file); // This catalog's image() explicitly resolves at ../../.
   const candidate=resolve(clean.startsWith('/')?root:base,clean.replace(/^\//,''));
   if(!candidate.startsWith(root+sep))continue;
   const resolved=candidate;
   const path=relative(root,resolved).split(sep).join('/'),key=`${source}|${ref}`;
   records.set(key,{source,reference:ref,path,exists:await exists(resolved)});
  }
 }
 return [...records.values()].sort((a,b)=>a.path.localeCompare(b.path)||a.source.localeCompare(b.source));
}
export function newMissingReferences(refs,baseline){
 const signature=r=>`${r.source}|${r.reference}|${r.path}`;
 const accepted=new Set([...baseline.missing,...(baseline.reviewedMigrations||[])].map(signature));
 return refs.filter(r=>!r.exists&&!accepted.has(signature(r)));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const refs=await inspectReferences(),missing=refs.filter(r=>!r.exists);
 const baseline=JSON.parse(await readFile(resolve(repo,'docs/v0.3/reference-debt.json'),'utf8'));
 const fresh=newMissingReferences(refs,baseline);
 console.log(`References: ${refs.length} literal references; ${new Set(missing.map(r=>r.path)).size} inherited missing paths; ${fresh.length} new missing references.`);
 if(fresh.length){console.error(fresh.map(r=>`${r.source}: ${r.reference} → ${r.path}`).join('\n'));process.exitCode=1;}
}
