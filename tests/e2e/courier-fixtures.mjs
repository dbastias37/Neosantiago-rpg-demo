import {readFile} from 'node:fs/promises';
import * as E from '../../extensions/mensajeros/production.mjs';
const data=E.prepare(JSON.parse(await readFile(new URL('../../extensions/mensajeros/production.json',import.meta.url),'utf8')));
// Uses the production engine to serialize a legitimate, deterministic detour.
// Discovery and origin are arranged; this is not a complete campaign playthrough.
export async function gateSave(){
 for(let seed=0;seed<200;seed++){
  let world=E.createWorld(data,{seed});world.progression.known=Object.keys(data.missions);world.location=data.routes[data.missions['adasme-01'].route].nodes[0];
  world=E.advance(data,E.start(data,world,'adasme-01'));
  if(world.run.pending.category!=='hostile'||E.eventFor(data,world).mandatory)continue;
  world=E.choose(data,world,'echo-path');const gate=E.currentGate(data,world);
  if(gate)return {key:data.save_key,save:E.serialize(world),answer:gate.puzzle.answer};
 }
 throw Error('No production gate fixture found');
}
