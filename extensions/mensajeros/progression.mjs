import {pendingReport} from './continuity.mjs';
import {assignment,runAssignment} from './corridors.mjs';
import {returnStatus} from './aftermath.mjs';
// Discovery is separate from payment: opening a contact never fabricates a receipt.
export function missionOpen(data,world,id){return !!data.missions[id]&&!!world.progression?.known.includes(id);}
export function refreshProgression(data,world){
 const p=world.progression;
 for(const m of Object.values(data.missions)){
  const requirements=m.requires_any||[];
  if((!requirements.length||requirements.some(id=>world.paid.includes(id)))&&!p.known.includes(m.id))p.known.push(m.id);
 }
 const r=world.run,route=r&&(data.routes[runAssignment(data,world)?.route]);
 const visited=[world.location,...(route?route.nodes.slice(r.startIndex||0,r.index+1):[])];
 for(const id of visited)if(data.nodes[id]&&!p.visited.includes(id))p.visited.push(id);
 return world;
}
export function restoreProgression(data,world){
 if(!world.progression){
  // Keep the assignment the player accepted before gating existed, including a retry.
  world.progression={version:1,known:[...new Set([...world.paid,world.run?.mission].filter(id=>data.missions[id]))],visited:['heroes']};
 }
 const p=world.progression;
 if(p.version!==1||!Array.isArray(p.known)||!Array.isArray(p.visited)||p.known.some(id=>!data.missions[id])||p.visited.some(id=>!data.nodes[id])||new Set(p.known).size!==p.known.length||new Set(p.visited).size!==p.visited.length)throw Error('Progreso de la red inválido.');
 return refreshProgression(data,world);
}
export function knownMissions(data,world){return Object.values(data.missions).filter(m=>missionOpen(data,world,m.id)).map(m=>assignment(data,world,m.id));}
export function knownNodes(data,world){
 const routes=knownMissions(data,world).map(m=>data.routes[m.route]);
 if(world.run)routes.push(data.routes[runAssignment(data,world).route]);
 return [...new Set([...world.progression.visited,world.location,...routes.flatMap(r=>r.nodes)])];
}
export function nextLead(data,world){
 const aftermath=returnStatus(world);
 if(aftermath&&aftermath.stage!=='closed')return aftermath.stage==='arrival'?'Darío está a resguardo. Queda pendiente la conversación de regreso con Adasme.':aftermath.stage==='waiting'?'El próximo relevo llevará la respuesta de Darío a Los Héroes. Recorre el regreso para recibirla.':'Llegó la respuesta de Darío. Puedes leerla desde su registro de regreso o consultar a Adasme.';
 const report=pendingReport(world);if(report)return report;
 const locked=Object.values(data.missions).find(m=>!missionOpen(data,world,m.id)&&(m.requires_any||[]).some(id=>missionOpen(data,world,id)));
 if(!locked)return world.paid.length===Object.keys(data.missions).length?'La red de esta versión está atendida. Puedes revisar sus resultados y regresar a la expedición.':'Los contactos abiertos conservan sus encargos: elige a quién ayudar.';
 return locked.lead;
}
