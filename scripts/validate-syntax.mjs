import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
const ignored=new Set(['.git','node_modules','test-results','test-results-entry-review','playwright-report']);
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){if(ignored.has(e.name))continue;const p=join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(/\.(?:c?js|mjs|html|json)$/.test(p))out.push(p);}return out;}
let checked=0;const errors=[];
for(const file of await walk('.')){
 try{
  if(/\.(?:c?js|mjs)$/.test(file)){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);checked++;}
  else if(file.endsWith('.json')){JSON.parse(await readFile(file,'utf8'));checked++;}
  else {const html=await readFile(file,'utf8');for(const [i,m] of [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].entries()){
   if(/\bsrc\s*=/.test(m[1]))continue;if(/application\/(?:ld\+)?json/.test(m[1]))JSON.parse(m[2]);
   else if(/type\s*=\s*["']module/.test(m[1])){const r=spawnSync(process.execPath,['--input-type=module','--check'],{input:m[2],encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
   else new vm.Script(m[2],{filename:`${file}:inline-${i+1}`});checked++;
  }}
 }catch(e){errors.push(`${file}: ${e.message}`);}
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Syntax OK: ${checked} scripts, inline blocks and JSON documents.`);
