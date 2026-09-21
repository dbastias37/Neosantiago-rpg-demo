const fs=require('node:fs'),path=require('node:path');
const {connectedWorld,atOrigin,solveGate}=require('./courier-fixtures.cjs');
exports.setup=async()=>{const E=await import('../extensions/mensajeros/production.mjs');return {E,d:E.prepare(JSON.parse(fs.readFileSync(path.join(__dirname,'../extensions/mensajeros/production.json'))))};};
function finish(E,d,source,{aid='assist',fight=false}={}){
 let w=source,fought=false;
 for(let i=0;i<500&&w.run.status==='active';i++){
  if(!w.run.pending){if(E.here(d,w).rest&&w.run.condition<78&&!w.run.rested.includes(w.run.index)&&w.run.supplies.food&&w.run.supplies.water)w=E.rest(d,w);w=E.advance(d,w);}
  if(w.run.status!=='active')break;
  if(w.run.pending?.combat?.phase==='loot'){w=E.finishLoot(d,w);continue;}
  const os=E.options(d,w).filter(o=>E.optionAvailable(w,o));let o;
  if(w.run.pending.combat)o=os.find(o=>o.id==='fire')||os.find(o=>o.id==='melee');
  else if(w.run.pending.category==='rescue')o=aid==='none'?os.find(o=>['carry','escort'].includes(o.id)):os.find(o=>o.id===aid);
  else if(fight&&!fought&&w.run.pending.category==='hostile'){o=os.find(o=>o.combat);fought=true;}
  o??=os.find(o=>['scout','jam-skill','avoid','continue'].includes(o.id))||os[0];
  if(!o)throw Error('No action on '+w.run.index);w=E.choose(d,w,o.id);w=solveGate(E,d,w);w=E.restore(d,E.serialize(w));
 }
 if(w.run.status!=='completed')throw Error(w.run.log.join('\n'));return w;
}
exports.finish=finish;
exports.extraction=async function(options={}){const {E,d}=await exports.setup();return {E,d,w:finish(E,d,E.start(d,atOrigin(d,connectedWorld(E,d,{seed:options.seed??2130}),'adasme-01'),'adasme-01'),options)};};
