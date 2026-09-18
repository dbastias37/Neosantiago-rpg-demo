// Passive module. No DOM, campaign globals, storage or timers. Only the local lab calls it.
export const SAVE_VERSION = 1;
const copy = value => JSON.parse(JSON.stringify(value));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const requireThat = (ok, message) => { if (!ok) throw new Error(message); };
function fraction(text) {
  let h = 2166136261;
  for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
export function createWorld(data, {mode, seed = 2130} = {}) {
  requireThat(mode === 'laboratory', 'La expansión solo admite inicio explícito en laboratorio.');
  return {schema: SAVE_VERSION, contentVersion:data.content_version, seed, credits:0, regions:{l6:0,centro:0,oriente:0}, paid:[], completed:{}, run:null};
}
export function mission(data, world) { return data.missions[world.run?.mission] || data.journeys?.[world.run?.mission]; }
export function route(data, world) { return data.routes[mission(data, world)?.route]; }
export function here(data, world) { return data.nodes[route(data, world)?.nodes[world.run.index]]; }
export function nextEdge(data, world) { return route(data, world)?.edges[world.run.index] || null; }
export function effectiveRisk(data, world, edge = nextEdge(data, world)) {
  if (!edge) return 'low';
  return ['low','medium','high'][clamp(['low','medium','high'].indexOf(edge.risk) + Math.floor((world.regions[edge.region] || 0) / 2),0,2)];
}
function active(world) { requireThat(world.run?.status === 'active', 'No hay un viaje activo.'); }
function log(run, message) { run.log.push(message); if (run.log.length > 80) run.log.shift(); }
function time(run, minutes) {
  run.minutes += minutes;
  if (run.jammerOn) {
    run.battery = Math.max(0, run.battery - minutes);
    if (!run.battery) { run.jammerOn = false; log(run,'La batería del inhibidor se agotó. La misión continúa.'); }
  }
}
function pay(run, costs = {}) {
  for (const [id, qty] of Object.entries(costs)) requireThat((run.supplies[id] || 0) >= qty, 'Falta '+id+'.');
  for (const [id, qty] of Object.entries(costs)) run.supplies[id] -= qty;
}
function wear(run, amount) {
  run.condition = Math.max(0, run.condition - amount);
  if (!run.condition) { run.status = 'failed'; log(run,'El grupo no puede continuar. Puedes reintentar desde el punto de control.'); }
}
function checkpoint(data, world) {
  const run = world.run, node = here(data, world);
  if (!node.checkpoint || run.status !== 'active') return;
  const {checkpoint:ignored, rolls, log:history, ...snapshot} = run;
  run.checkpoint = {node:node.id, snapshot:copy(snapshot)};
  log(run,'Punto de control: '+node.name+'.');
}
export function start(data, source, id) {
  requireThat(data.missions[id] || data.journeys?.[id], 'Misión desconocida.');
  requireThat(source.run?.status !== 'active', 'Termina o abandona el viaje actual antes de aceptar otro.');
  requireThat(!source.paid.includes(id), 'Este encargo ya fue entregado.');
  const world = copy(source), m = data.missions[id] || data.journeys[id];
  world.run = {mission:id,status:'active',index:0,pending:null,cargo:copy(m.cargo),supplies:{...m.test_loadout,...m.issued},condition:100,minutes:0,battery:m.issued.jammer?20:0,jammerOn:false,combats:0,evaded:0,history:[],rolls:{},rested:[],rescued:null,log:['Encargo aceptado: '+m.name+'.'],checkpoint:null,receipt:null};
  checkpoint(data, world); return world;
}
function roll(data, world, edge, index) {
  const run = world.run;
  if (run.rolls[index]) return copy(run.rolls[index]);
  const node = data.nodes[edge.to], m = mission(data, world);
  let result;
  if (m.type!=='travel' && index === route(data, world).edges.length - 1) result = {category:'delivery',id:'delivery'};
  else if (m.type!=='travel' && node.kind === 'rescue' && !run.rescued) result = {category:'rescue',id:'rescue',injured:fraction(world.seed+':injury')<0.5};
  else if (m.type!=='travel' && node.checkpoint) result = {category:'checkpoint',id:'checkpoint'};
  else {
    const weights = [...data.weights[effectiveRisk(data, world, edge)]];
    if (run.history.slice(-2).length === 2 && run.history.slice(-2).every(x=>x.category==='hostile')) {weights[0] += weights[2];weights[2] = 0;}
    const salt=m.type==='travel'?':trip-'+run.travelSerial:'';
    let value = fraction(world.seed+':'+run.mission+':'+index+':'+world.regions[edge.region]+salt)*100, category = 'quiet';
    for (let i=0;i<weights.length;i++) { value -= weights[i]; if(value<0) {category=data.categories[i];break;} }
    let pool = data.events.filter(e=>!e.scripted && e.category===category && e.regions.includes(edge.region));
    const fresh = pool.filter(e=>!run.history.slice(-data.rules.event_cooldown).some(h=>h.id===e.id));
    if(fresh.length) pool=fresh;
    const event = pool[Math.floor(fraction(world.seed+':event:'+run.mission+':'+index+salt)*pool.length)];
    result = {category,id:event.id};
  }
  run.rolls[index] = copy(result); return result;
}
export function advance(data, source) {
  const world=copy(source);active(world);const run=world.run;
  requireThat(!run.pending,'Resuelve primero la instancia actual.');
  const edge=nextEdge(data,world);requireThat(edge,'Ya estás en el destino.');
  const draw=roll(data,world,edge,run.index);
  run.pending={...draw,edgeIndex:run.index,from:edge.from,to:edge.to,combat:null};
  time(run,edge.minutes + (run.rescued?.mode==='carry'?2:0));
  wear(run,(edge.wear??data.rules.travel_wear) + (run.rescued?.mode==='carry'?(edge.carry_wear??data.rules.carry_wear):0));
  log(run,'En camino a '+data.nodes[edge.to].name+'.');return world;
}
export function eventFor(data, world) { return data.events.find(e=>e.id===world.run?.pending?.id) || null; }
export function options(data, world) {
  const p=world.run?.pending;
  if(!p || world.run.status!=='active')return [];
  if(p.combat)return [{id:'fire',label:'Disparar · 2 municiones',cost:{ammo556:2}},{id:'melee',label:'Ataque cercano · mayor desgaste'},{id:'smoke-retreat',label:'Retirarse con humo · 1 bomba',cost:{smoke:1}},{id:'retreat',label:'Retirada por desvío · desgaste 12 / 6 min'}];
  if(p.category==='rescue')return [{id:p.injured?'carry':'escort',label:p.injured?'Cargar al compañero':'Acompañar al compañero'},{id:'assist',label:'Asistir y '+(p.injured?'cargar':'acompañar')+' · 1 agua / 1 ración',cost:{food:1,water:1}},{id:'assist-ammo',label:'Asistir, entregar 4 municiones y regresar',cost:{food:1,water:1,ammo556:4}}];
  if(p.category==='delivery')return [{id:'deliver',label:mission(data,world).type==='delivery'?'Entregar a los técnicos':'Entregar al compañero a Adasme'}];
  if(p.category==='checkpoint')return [{id:'continue',label:'Entrar al punto de control'}];
  return eventFor(data,world)?.choices || [];
}
export function optionAvailable(world, option) {
  return Object.entries(option.cost||{}).every(([id,qty])=>(world.run.supplies[id]||0)>=qty) && (!option.requires_jammer || (world.run.jammerOn && world.run.battery >= option.minutes));
}
function arrive(data,world) {
  const run=world.run,p=run.pending;
  if(run.status!=='active')return;
  run.history.push({id:p.id,category:p.category,node:p.to});run.index=p.edgeIndex+1;run.pending=null;
  log(run,'Llegada a '+here(data,world).name+'.');checkpoint(data,world);
}
function complete(data,world) {
  const run=world.run,m=mission(data,world);
  requireThat(!world.paid.includes(m.id),'La recompensa ya fue pagada.');
  if(m.type==='delivery') {
    for(const [id,qty]of Object.entries(m.cargo))requireThat(run.cargo[id]===qty,'La entrega está incompleta.');
    run.cargo={};
  } else requireThat(run.rescued,'No has recuperado al compañero.');
  const bonus=run.combats===0?m.reward.stealth_bonus:0;
  const dialogue=m.type==='delivery'?m.dialogues.success:m.dialogues[run.combats?'combat':'stealth'];
  run.receipt={amount:m.reward.base+bonus,bonus,recipient:m.recipient,dialogue:dialogue+(run.rescued?.mode==='carry'?' '+m.dialogues.carried:''),combats:run.combats,evaded:run.evaded,provisional:true};
  world.credits+=run.receipt.amount;world.paid.push(m.id);world.completed[m.id]=copy(run.receipt);
  run.index=route(data,world).nodes.length-1;run.pending=null;run.status='completed';run.jammerOn=false;log(run,'Entrega completada. Recompensa de prueba: '+run.receipt.amount+' fichas.');
}
export function choose(data,source,id) {
  const world=copy(source);active(world);const run=world.run,p=run.pending;
  requireThat(p,'No hay instancia pendiente.');
  const option=options(data,world).find(o=>o.id===id);
  requireThat(option,'Opción desconocida.');requireThat(optionAvailable(world,option),'No tienes los recursos necesarios.');
  pay(run,option.cost);
  if(p.combat) {
    if(id==='smoke-retreat'||id==='retreat') {
      time(run,id==='retreat'?6:1);wear(run,id==='retreat'?12:0);run.evaded++;log(run,'Retirada: la alerta del combate permanece.');arrive(data,world);return world;
    }
    p.combat.round++;
    const damage=id==='fire'?12:7;p.combat.hp=Math.max(0,p.combat.hp-damage);
    time(run,1);log(run,'El grupo inflige '+damage+' de daño.');
    if(!p.combat.hp){log(run,'Paso despejado.');arrive(data,world);return world;}
    const incoming=(id==='melee'?10:6)+Math.floor(fraction(world.seed+':hit:'+p.edgeIndex+':'+p.combat.round)*4);
    wear(run,incoming);log(run,'El grupo recibe '+incoming+' de desgaste.');return world;
  }
  if(option.combat) {
    const edge=nextEdge(data,world);run.combats++;world.regions[edge.region]=Math.min(data.rules.max_region_alert,world.regions[edge.region]+data.rules.combat_alert);
    p.combat={hp:30,maxHp:30,round:0};log(run,'Combate iniciado. Aumenta la vigilancia del corredor '+edge.region+'.');return world;
  }
  if(p.category==='delivery'){complete(data,world);return world;}
  if(p.category==='rescue') {
    run.rescued={injured:p.injured,mode:p.injured?'carry':'escort',assisted:id.startsWith('assist'),ammoGiven:id==='assist-ammo'?4:0};
    log(run,p.injured?'El compañero no puede caminar. El grupo lo carga.':'El compañero puede caminar acompañado.');time(run,id.startsWith('assist')?4:2);
  } else {
    time(run,option.minutes||0);wear(run,option.wear||0);
    for(const [item,qty]of Object.entries(option.gain||{}))run.supplies[item]=(run.supplies[item]||0)+qty;
    if(p.category==='hostile')run.evaded++;
  }
  log(run,option.label+'.');arrive(data,world);return world;
}
export function rest(data,source) {
  const world=copy(source);active(world);const run=world.run,node=here(data,world);
  requireThat(!run.pending&&node.rest,'No puedes descansar aquí.');
  requireThat(!run.rested.includes(run.index),'Ya descansaste en esta parada.');
  requireThat(run.condition<100,'El grupo ya está recuperado.');
  pay(run,{food:1,water:1});time(run,data.rules.rest_minutes);run.condition=Math.min(100,run.condition+data.rules.rest_heal);run.rested.push(run.index);
  log(run,'Descanso: −1 agua, −1 ración; recuperación parcial.');checkpoint(data,world);return world;
}
export function toggleJammer(data,source) {
  const world=copy(source);active(world);const run=world.run;
  requireThat(run.supplies.jammer&&run.battery>0,'No hay batería disponible.');
  run.jammerOn=!run.jammerOn;log(run,run.jammerOn?'Inhibidor encendido.':'Inhibidor apagado.');return world;
}
export function retry(data,source) {
  const world=copy(source),run=world.run;
  requireThat(run?.status==='failed'&&run.checkpoint,'No hay un reintento disponible.');
  const saved=run.checkpoint;
  // Threat and combat count remain: retrying cannot erase a noisy extraction.
  world.run={...copy(saved.snapshot),checkpoint:copy(saved),rolls:copy(run.rolls),combats:Math.max(run.combats,saved.snapshot.combats),log:[...run.log,'Reintento desde '+data.nodes[saved.node].name+'. La vigilancia se conserva.']};return world;
}
export function abandon(data,source) {
  const world=copy(source);requireThat(world.run&&['active','failed'].includes(world.run.status),'No hay encargo que abandonar.');
  world.run.status='abandoned';world.run.jammerOn=false;log(world.run,'Encargo abandonado en el laboratorio.');return world;
}
export function serialize(world) { return JSON.stringify(world); }
export function restore(data,text) {
  const w=JSON.parse(text);
  requireThat(w&&w.schema===SAVE_VERSION&&w.contentVersion===data.content_version,'Guardado incompatible.');
  requireThat(Number.isFinite(w.seed)&&Number.isFinite(w.credits)&&w.credits>=0&&Array.isArray(w.paid)&&w.completed&&w.regions,'Guardado inválido.');
  requireThat(Object.keys(w.regions).every(k=>['l6','centro','oriente'].includes(k))&&['l6','centro','oriente'].every(k=>Number.isInteger(w.regions[k])&&w.regions[k]>=0&&w.regions[k]<=6),'Amenaza inválida.');
  requireThat(w.paid.every(id=>data.missions[id])&&new Set(w.paid).size===w.paid.length,'Recompensas inválidas.');
  if(w.run){
    const r=w.run,m=mission(data,w),rt=data.routes[m?.route];
    requireThat(rt&&Number.isInteger(r.index)&&r.index>=0&&r.index<rt.nodes.length,'Recorrido inválido.');
    requireThat(['active','failed','completed','abandoned'].includes(r.status)&&Number.isFinite(r.condition)&&r.condition>=0&&r.condition<=100&&Number.isFinite(r.battery)&&r.battery>=0&&r.battery<=20&&Array.isArray(r.log)&&Array.isArray(r.history)&&Array.isArray(r.rested)&&r.rolls,'Estado inválido.');
    for(const stock of [r.cargo,r.supplies])requireThat(stock&&Object.entries(stock).every(([id,n])=>data.items[id]&&Number.isInteger(n)&&n>=0),'Inventario inválido.');
    requireThat(Number.isInteger(r.combats)&&r.combats>=0&&Number.isInteger(r.evaded)&&r.evaded>=0&&Number.isFinite(r.minutes)&&r.minutes>=0,'Contadores inválidos.');
    if(r.pending){const p=r.pending,e=rt.edges[r.index];requireThat(e&&p.edgeIndex===r.index&&p.from===e.from&&p.to===e.to&&(data.events.some(x=>x.id===p.id&&x.category===p.category)||['checkpoint','rescue','delivery'].includes(p.id)&&p.id===p.category),'Encuentro inválido.');}
  }
  return w;
}
