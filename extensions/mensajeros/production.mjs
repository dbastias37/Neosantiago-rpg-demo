import {rosaBridge,prepareRosaVisits} from './rosa-bridge.mjs';
import {bridge,prepareMedicalVisits} from './medical-bridge.mjs';
import {recordInterruption,normalizeOutcomes,nextOutcomeAttempt} from './outcomes.mjs';
import {prepareJimenez,prepareJimenezVisits,jimenezArrival,refreshJimenez,jimenezMemory} from './jimenez.mjs';
export {jimenezMemory} from './jimenez.mjs';
import {prepareGuzman,prepareGuzmanVisits,guzmanArrival,refreshGuzman,guzmanMemory} from './guzman.mjs';
export {guzmanMemory} from './guzman.mjs';
import {prepareEconomy,restoreTerms,terms} from './economy.mjs';
import {prepareBeatriz,prepareBeatrizVisits,beatrizArrival,refreshBeatriz,beatrizMemory} from './beatriz.mjs';
export {beatrizMemory} from './beatriz.mjs';
import {prepareCorridors,restoreCorridors,scriptAt,rememberCorridor,arrivalAccount,communityMemory,assignment} from './corridors.mjs';
export {communityMemory,currentPurpose,assignment} from './corridors.mjs';
import {prepareEncounters,restoreEncounters,directEncounter,rememberEncounter} from './encounters.mjs';
export {encounterText,passageReady,routeWarning,sectorFor,sectors} from './encounters.mjs';
import {rescueOutcome,refreshAftermath} from './aftermath.mjs';
export {answerReturn,returnScene,returnStatus} from './aftermath.mjs';
// Los Mensajeros: transitions, combat, loot, equipment and economy kept separate from the campaign save.
import {missionOpen,refreshProgression,restoreProgression} from './progression.mjs';
export {missionOpen,knownMissions,knownNodes,nextLead} from './progression.mjs';
import * as Base from './engine.mjs';
import {prepareJourneys,migrateNetworkSave,entryPoints} from './network.mjs';
import {PUZZLES} from '../../labs/compuertas/puzzles.mjs';
import {freshSession,restoreSession,transition} from '../../labs/compuertas/core.mjs';
export {mission,route,here,nextEdge,effectiveRisk,eventFor,serialize} from './engine.mjs';
const copy=x=>JSON.parse(JSON.stringify(x));
const need=(ok,msg)=>{if(!ok)throw Error(msg);};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function definition(data,id){return data.crew.find(c=>c.id===id);}
function has(member,id){return !!member?.skills?.includes(id);}
function bagCount(member,id){return (member?.bag||[]).filter(x=>x.id===id).reduce((n,x)=>n+x.qty,0);}
export function bagUsed(member){return (member?.bag||[]).reduce((n,x)=>n+x.qty,0);}
export function bagCapacity(data,member){return (definition(data,member.id)?.capacity||10)+Math.max(0,member.level-1);}
function addBag(data,member,id,qty=1){
 need(data.items[id]&&qty>0,'Objeto desconocido.');need(bagUsed(member)+qty<=bagCapacity(data,member),'La mochila de '+definition(data,member.id).name+' no tiene espacio.');
 const item=data.items[id],entry=item.stack!==false&&member.bag.find(x=>x.id===id);if(entry)entry.qty+=qty;else member.bag.push({id,qty});
}
function removeBag(member,id,qty=1){
 need(bagCount(member,id)>=qty,'El objeto no está en esa mochila.');
 for(let i=member.bag.length-1;i>=0&&qty;i--){const x=member.bag[i];if(x.id!==id)continue;const n=Math.min(qty,x.qty);x.qty-=n;qty-=n;if(!x.qty)member.bag.splice(i,1);}
}
function partyTotals(party){const out={};for(const c of party||[])for(const x of c.bag||[])out[x.id]=(out[x.id]||0)+x.qty;return out;}
function firstSpace(data,party,qty=1){return party.find(c=>bagUsed(c)+qty<=bagCapacity(data,c));}
function distribute(data,party,id,qty){while(qty>0){const c=firstSpace(data,party);need(c,'Las mochilas del equipo están llenas.');const room=bagCapacity(data,c)-bagUsed(c),n=Math.min(room,qty);addBag(data,c,id,n);qty-=n;}}
function removeFromParty(party,id,qty){for(const c of party){const n=Math.min(qty,bagCount(c,id));if(n){removeBag(c,id,n);qty-=n;}if(!qty)return;}need(false,'Faltan suministros.');}
function sync(r){r.supplies=partyTotals(r.party);return r.supplies;}
function mirrorChanges(data,r,before){
 for(const id of new Set([...Object.keys(before),...Object.keys(r.supplies)])){
  const delta=(r.supplies[id]||0)-(before[id]||0);
  if(delta>0){distribute(data,r.party,id,delta);r.ownedStock[id]=(r.ownedStock[id]||0)+delta;}
  if(delta<0)removeFromParty(r.party,id,-delta);
 }
 sync(r);
}
function spend(r,cost={}){for(const [id,n]of Object.entries(cost))need((r.supplies[id]||0)>=n,'Faltan suministros.');for(const [id,n]of Object.entries(cost))removeFromParty(r.party,id,n);sync(r);}
function gainOwned(data,r,member,id,qty){addBag(data,member,id,qty);r.ownedStock[id]=(r.ownedStock[id]||0)+qty;sync(r);}
function time(r,n){r.minutes+=n;if(r.jammerOn){r.battery=Math.max(0,r.battery-n);if(!r.battery){r.jammerOn=false;r.log.push('La batería del inhibidor se agotó.');}}}
function random(w,salt){let n=2166136261;for(const c of String(w.seed)+salt)n=Math.imul(n^c.charCodeAt(0),16777619);return(n>>>0)/4294967296;}
const NUMERIC_GATES=PUZZLES.filter(p=>p.kind==='numeric');
function detourGateOption(option){return ['detour','scout','echo-path'].includes(option.id)||(option.id==='avoid'&&/desv[ií]o|paso lateral|otro acceso|rodear/i.test(option.label));}
function gatePuzzle(id){return NUMERIC_GATES.find(p=>p.id===id);}
function gateKey(w){const p=w.run.pending;return [w.run.mission,p.edgeIndex,p.id].join(':');}
function selectGate(w){return NUMERIC_GATES[Math.floor(random(w,'gate:'+gateKey(w))*NUMERIC_GATES.length)];}
function createGate(w,choice){const puzzle=selectGate(w);return {version:1,key:gateKey(w),puzzle:puzzle.id,choice,session:freshSession(puzzle)};}
function validatedGate(data,w){
 const gate=w.run?.pending?.gate,puzzle=gatePuzzle(gate?.puzzle);need(gate?.version===1&&gate.key===gateKey(w)&&puzzle&&typeof gate.choice==='string','Compuerta inválida.');
 need(options(data,w).some(o=>o.id===gate.choice&&o.gate==='numeric'),'Desvío de compuerta inválido.');
 gate.session=restoreSession(puzzle,gate.session);return {gate,puzzle};
}
function memberBase(data,c){const d=definition(data,c.id);c.skills??=[];c.bag??=copy(d.bag||[]);c.equipment={...(d.equipment||{}),...(c.equipment||{})};return c;}
function ownedParty(data,r){
 const keep={};for(const [id,n]of Object.entries(r.ownedStock||{}))keep[id]=Math.min(n,r.supplies[id]||0);
 for(const id of Object.keys(r.supplies)){const remove=(r.supplies[id]||0)-(keep[id]||0);if(remove>0)removeFromParty(r.party,id,remove);}
 sync(r);return r.party;
}
export function prepare(data){
 const d=copy(data);for(const m of Object.values(d.missions))m.test_loadout=m.loadout;
 for(const e of Object.values(d.scripted))d.events.push({...e,scripted:true,category:'decision',regions:['centro','oriente','l6']});
 const legacy=prepareJourneys(copy(d));
 const prepared=prepareJimenezVisits(prepareGuzmanVisits(prepareBeatrizVisits(prepareJourneys(prepareEncounters(prepareJimenez(prepareGuzman(prepareEconomy(prepareBeatriz(prepareCorridors(d))))))))));
 prepared.legacyJourneys={};
 for(const [id,m]of Object.entries(legacy.journeys)){const route='legacy-'+m.route;prepared.legacyJourneys[id]={...m,route};prepared.routes[route]={...legacy.routes[m.route],id:route};}
 return prepareRosaVisits(prepareMedicalVisits(prepared));
}
export function createWorld(data,{seed=Date.now()}={}){
 const w=Base.createWorld(data,{mode:'laboratory',seed});
 return refreshProgression(data,{...w,encounters:{version:1,resolved:{}},aftermath:{version:1,rescueReturn:null},progression:{version:1,known:[],visited:['heroes']},mode:'production',crew:data.crew.map(c=>memberBase(data,{id:c.id,hp:c.maxHp,maxHp:c.maxHp,xp:0,level:1,skills:[],bag:copy(c.bag||[]),equipment:copy(c.equipment||{})})),stock:{},effects:[],helpSeen:false,location:'heroes',hubVisits:0});
}
export function start(data,source,id){
 need(data.missions[id],'Encargo desconocido.');
 need(source.run?.status!=='failed','Reintenta o devuelve el encargo interrumpido.');
 need(missionOpen(data,source,id),'Este contacto todavía no te ha abierto su encargo. Completa primero un trabajo cercano.');
 need(!source.paid.includes(id),'Este encargo ya fue entregado.');
 const entry=entryPoints(data,id).find(p=>p.node===source.location);
 need(entry,'Viaja a '+entryPoints(data,id).map(p=>data.nodes[p.node].name).join(' o ')+' antes de aceptar este encargo.');
 const origin=id==='ana-01'&&source.rosaBridge?.stage==='requested'?rosaBridge.collect(source):source;
 const w=Base.start(data,origin,id),r=w.run,m=data.missions[id],issued=copy(r.supplies);
 r.outcomeAttempt=nextOutcomeAttempt(w);r.jimenezVersion=m.jimenezVersion||0;r.guzmanVersion=m.guzmanVersion||0;r.rewardTerms=terms(m);r.beatrizVersion=m.beatrizVersion||0;restoreEncounters(w);r.corridorVersion=2;r.directorVersion=1;r.startIndex=entry.index;r.index=entry.index;
 r.party=copy(w.crew).map(c=>memberBase(data,{...c,hp:Math.max(c.hp,Math.ceil(c.maxHp*.4))}));
 // Migrate any old shared reserve into individual bags before leaving the hub.
 for(const [key,n]of Object.entries(w.stock||{}))distribute(data,r.party,key,n);
 r.used={};r.ownedStock=partyTotals(r.party);r.borrowedStock=copy(issued);r.flags=[];r.withdrawn=false;r.pickupDone=!m.pickup;r.combatSerial=0;r.timeLimit=entryDeadline(data,id,entry.index);r.rewardPenalty=0;
 for(const [key,n]of Object.entries(issued))distribute(data,r.party,key,n);
 r.supplies=partyTotals(r.party);w.stock={};w.location=Base.here(data,w).id;
 if(w.effects.includes('jimenez-01')&&!r.supplies.jammer){distribute(data,r.party,'jammer',1);r.borrowedStock.jammer=(r.borrowedStock.jammer||0)+1;r.supplies=partyTotals(r.party);r.battery=20;}
 if(m.pickup)r.cargo={};
 r.checkpoint={node:Base.here(data,w).id,snapshot:copy({...r,checkpoint:null})};r.log=['Preparación en '+Base.here(data,w).name+'. '+(Object.keys(issued).length?'El equipo recibe la carga y los préstamos indicados en el expediente.':'El encargo no incluye provisiones prestadas; el equipo sale con sus propias mochilas.')];return refreshProgression(data,w);
}
function updateCheckpoint(data,w){
 const r=w.run;if(r?.status!=='active'||r.pending)return;
 w.location=Base.here(data,w).id;refreshProgression(data,w);refreshAftermath(w);refreshBeatriz(w);refreshGuzman(w);refreshJimenez(w);
 const echoes=communityMemory(w,w.location),memoryKey='community-'+r.index;
 if(echoes.length&&!r.used[memoryKey]){r.used[memoryKey]=true;r.log.push(...echoes);if(!r.lastEncounter)r.lastEncounter={title:'Lo que quedó en este puesto',text:echoes.join(' ')};}
 if(w.location==='plaza'&&w.effects.includes('guzman-01')&&!r.used['plaza-'+r.index]){r.used['plaza-'+r.index]=true;r.log.push('La torreta de Plaza sigue girando. El guardia reconoce al equipo y señala el banco que dejó Ana: hay agua y una ración para descansar sin gastar las propias.');}
 if(Base.mission(data,w).type==='travel'&&r.index===Base.route(data,w).edges.length){
  r.status='completed';r.jammerOn=false;w.crew=copy(r.party);if(w.location==='heroes')w.hubVisits=(w.hubVisits||0)+1;
  r.log.push(['medical','rosa'].includes(Base.mission(data,w).purpose)?'Llegada a '+Base.here(data,w).name+'. La solicitud se presenta al contacto; el traslado no tiene pago.':Base.mission(data,w).purpose==='visit'?'Llegada a '+Base.here(data,w).name+'. El contacto puede recibir al equipo; esta visita no tiene pago.':Base.mission(data,w).purpose==='assignment'?'Llegada a '+Base.here(data,w).name+'. Revisa la propuesta de '+Base.mission(data,w).issuer+' antes de aceptar. Todavía no has recibido la carga.':'Llegada a Los Héroes. Mara y el Armero ya pueden atender al grupo.');return;
 }
 if(Base.here(data,w).checkpoint){const {checkpoint,rolls,log,...snapshot}=r;r.checkpoint={node:Base.here(data,w).id,snapshot:copy(snapshot)};}
}
export function advance(data,source){
 let w=Base.advance(data,source),r=w.run,p=r.pending;r.withdrawn=false;const scene=scriptAt(data,r,p.edgeIndex);
 if(scene){Object.assign(p,{id:scene.id,category:scene.category||'decision'});r.rolls[p.edgeIndex]={id:scene.id,category:scene.category||'decision'};}
 directEncounter(data,w,source);r.lastEncounter=null;
 if(r.rescued?.mode==='carry'&&r.party.find(x=>x.id==='bruno')?.hp>0&&r.status==='active')r.condition=Math.min(100,r.condition+(has(r.party.find(x=>x.id==='bruno'),'carry')?2:1));
 w.location=p.from;return recordInterruption(w);
}
export function optionAvailable(w,o){return Base.optionAvailable(w,o)&&(!o.requiresCrew||w.run.party.some(p=>p.id===o.requiresCrew&&p.hp>0))&&(!o.once||(w.run.used[o.once]||0)<(o.limit||1))&&!(o.gate&&w.run.pending?.gate?.session?.phase==='locked');}
function weapon(data,actor){return data.items[actor?.equipment?.weapon]||null;}
export function options(data,w){
 const r=w.run,p=r?.pending;if(!p||r.status!=='active')return [];
 if(p.combat){
  if(p.combat.phase==='loot')return [];
  const actor=r.party[p.combat.actor],c=definition(data,actor.id),gun=weapon(data,actor),opts=[];
  if(gun?.weapon==='firearm')opts.push({id:'fire',label:'Disparar '+gun.name+' · 1 '+data.items[gun.ammo].name,cost:{[gun.ammo]:1}});
  opts.push({id:'melee',label:'Ataque cercano'});
  if(actor.id==='tomas')opts.push({id:'listen',label:'Escuchar · prepara el próximo golpe cercano'});
  opts.push({id:'cover',label:'Cubrirse · reduce el próximo daño'},{id:'skill',label:c.id==='rocio'?'Marcar al enemigo':c.id==='tomas'?'Interferir · anula una respuesta':'Proteger a todo el grupo',once:'combat-'+r.combatSerial+'-'+c.id});
  if(r.supplies.medkit)opts.push({id:'heal',label:'Usar botiquín · recuperar hasta '+(has(actor,'aid')?32:24)+' HP',cost:{medkit:1}});
  opts.push({id:'smoke-retreat',label:'Retirarse con humo · 1 bomba',cost:{smoke:1}},{id:'trap-retreat',label:'Dejar trampa y retirarse · 1 trampa',cost:{trap:1}});
  if(r.party.some(x=>x.id==='tomas'&&x.hp>0))opts.push({id:'guided-retreat',label:'Tomás guía la retirada · desgaste '+(has(r.party.find(x=>x.id==='tomas'),'exit')?2:5)+(Base.eventFor(data,w)?.electronic?' + 4 por ruido':'')});
  opts.push({id:'retreat',label:'Retirada al último andén · desgaste 12'});return opts;
 }
 let opts=Base.options(data,w).map(copy);if(p.category==='delivery')opts[0].label=r.mission==='adasme-01'?'Acompañar a Darío hasta Adasme':'Entregar a '+Base.mission(data,w).recipient;
 if(p.category==='hostile'){
  if(Base.eventFor(data,w)?.mandatory)return [...opts,{id:'withdraw',label:'Volver al andén · el paso seguirá bloqueado'}];
  opts.unshift({id:'scout',label:'Rocío busca un paso silencioso · compuerta · 1 uso por encargo',requiresCrew:'rocio',once:'scout',limit:has(r.party.find(x=>x.id==='rocio'),'trail')?2:1},{id:'decoy',label:'Distraer con un señuelo · 1 unidad',cost:{decoy:1}});
  if(Base.eventFor(data,w)?.electronic)opts.unshift({id:'jam-skill',label:'Tomás confunde el sensor · 1 uso por encargo',requiresCrew:'tomas',once:'jam'});
  opts.unshift({id:'echo-path',label:'Tomás escucha y encuentra un desvío · compuerta'+(Base.eventFor(data,w)?.electronic?' · ruido: desgaste 6':' · desgaste 2'),requiresCrew:'tomas',once:'echo',limit:has(r.party.find(x=>x.id==='tomas'),'echo')?2:1});opts.push({id:'withdraw',label:'Retroceder al andén · el paso seguirá bloqueado'});
 }
 return opts.map(o=>detourGateOption(o)?{...o,gate:'numeric',label:o.label.includes('compuerta')?o.label:o.label+' · compuerta'}:o);
}
function lootFor(w,electronic,serial,index){
 const entries=electronic?[['electronics',1],['scrap',1],...(random(w,'battery:'+serial+':'+index)<.55?[['battery',1]]:[])]:[['scrap',1],[random(w,'ammo:'+serial+':'+index)<.5?'ammo9':'ammo556',1+Math.floor(random(w,'qty:'+serial+':'+index)*2)],...(random(w,'medical:'+serial+':'+index)<.4?[['bandage',1]]:[])];
 return entries.map(([id,qty])=>({id,qty}));
}
function openCombat(data,w){
 const r=w.run,p=r.pending,e=Base.nextEdge(data,w),electronic=!!Base.eventFor(data,w)?.electronic;r.combats++;r.combatSerial++;w.regions[e.region]=Math.min(6,w.regions[e.region]+1);
 const enemy=(id,name,hp,img,index)=>({id,name,hp,maxHp:hp,image:'../../portraits/'+img,stunned:false,loot:lootFor(w,electronic,r.combatSerial,index)});
 p.combat={phase:'combat',actor:r.party.findIndex(x=>x.hp>0),target:0,turn:0,round:1,covered:[],marked:null,enemies:electronic?[enemy('drone','Dron Red UNO',36,'drone.webp',0)]:[enemy('scout','Merodeador',26,'merodeador.webp',0),enemy('guard','Vigía armado',24,'merodeador2.webp',1)]};r.log.push('Contacto armado. La vigilancia del corredor aumenta.');if(p.combat.actor<0){r.status='failed';recordInterruption(w);}
}
export function target(data,source,index){const w=copy(source),c=w.run?.pending?.combat;need(c?.phase==='combat'&&Number.isInteger(index)&&c.enemies[index]?.hp>0,'Objetivo no disponible.');c.target=index;return w;}
function arrive(data,w){const r=w.run,p=r.pending;rememberEncounter(data,w,p,{});r.history.push({id:p.id,category:p.category,node:p.to});r.index=p.edgeIndex+1;r.pending=null;w.location=Base.here(data,w).id;r.log.push('Llegada a '+Base.here(data,w).name+'.');updateCheckpoint(data,w);}
function retreat(w,wear=0){const r=w.run;r.condition=Math.max(0,r.condition-wear);r.pending=null;r.withdrawn=true;r.status=r.condition?'active':'failed';r.log.push('Retroceden al andén anterior. Conservan carga, heridas y vigilancia; el paso sigue pendiente.');recordInterruption(w,'retreat');}
export function hitChance(data,w,id){
 const r=w.run,c=r.pending.combat,a=r.party[c.actor],gear=weapon(data,a);let miss=id==='fire'?.08:.15;
 if(a.id==='tomas')miss=(id==='fire'?.55:.4)+(Base.eventFor(data,w)?.electronic?.15:0)-(id==='melee'&&c.listening?(has(a,'focus')?.3:.2):0);
 if(has(a,'aim'))miss-=.05;if(id==='fire')miss-=gear?.accuracy||0;return clamp(1-miss,.05,.97);
}
function addCombatXp(r,amount){for(const c of r.party){c.xp+=amount;while(c.xp>=60){c.xp-=60;c.level++;c.maxHp+=5;c.hp=Math.min(c.maxHp,c.hp+5);}}}
function combatTurn(data,w,id){
 const r=w.run,c=r.pending.combat,actor=r.party[c.actor],def=definition(data,actor.id),enemy=c.enemies[c.target];
 if(['retreat','smoke-retreat','trap-retreat','guided-retreat'].includes(id)){time(r,id==='retreat'?6:1);retreat(w,id==='retreat'?12:id==='guided-retreat'?(has(r.party.find(x=>x.id==='tomas'),'exit')?2:5)+(Base.eventFor(data,w)?.electronic?4:0):0);return w;}
 c.turn++;time(r,1);
 if(id==='heal'){actor.hp=Math.min(actor.maxHp,actor.hp+(has(actor,'aid')?32:24));r.log.push(def.name+' usa un botiquín.');}
 else if(id==='listen'){c.listening=true;r.log.push('Tomás escucha los movimientos. Prepara su próximo golpe cercano; el ruido puede confundirlo.');}
 else if(id==='cover'){c.covered.push(actor.id);r.log.push(def.name+' se cubre.');}
 else if(id==='skill'){
  r.used['combat-'+r.combatSerial+'-'+actor.id]=true;if(actor.id==='rocio'){c.marked=enemy.id;c.markBonus=has(actor,'mark')?12:8;r.log.push('Rocío marca al objetivo.');}if(actor.id==='tomas'){enemy.stunned=true;r.log.push('Tomás interrumpe la respuesta del objetivo.');}if(actor.id==='bruno'){c.covered=r.party.map(x=>x.id);c.coverFactor=has(actor,'guard')?.25:.4;r.log.push('Bruno protege al equipo.');}
 }else{
  const chance=hitChance(data,w,id),hit=random(w,r.mission+':'+r.index+':'+r.combatSerial+':'+c.turn+':hit')<chance;if(actor.id==='tomas'&&id==='melee')c.listening=false;
  const crit=random(w,c.turn+':'+r.index+':crit')<.12,gear=weapon(data,actor),gearDamage=id==='fire'?(gear?.damage||0):(gear?.weapon==='melee'?gear.damage||0:0),damage=hit?Math.max(1,def.attack+(actor.level-1)*2+gearDamage+(id==='fire'?1:-3)+(crit?5:0)+(c.marked===enemy.id?(c.markBonus||8):0)):0;
  if(c.marked===enemy.id)c.marked=null;enemy.hp=Math.max(0,enemy.hp-damage);r.log.push(def.name+(hit?' inflige '+damage+(crit?' de daño crítico':' de daño')+' a '+enemy.name+'.':' falla el ataque.'));
 }
 if(c.enemies.every(e=>e.hp===0)){c.phase='loot';c.actor=-1;addCombatXp(r,8*c.enemies.length);r.log.push('Amenazas neutralizadas. Elige quién registra los cuerpos o abandona el saqueo.');return w;}
 if(!c.enemies[c.target].hp)c.target=c.enemies.findIndex(e=>e.hp>0);const next=r.party.findIndex((x,i)=>i>c.actor&&x.hp>0);if(next>=0){c.actor=next;return w;}
 for(const [i,e]of c.enemies.entries()){
  if(!e.hp)continue;if(e.stunned){e.stunned=false;r.log.push(e.name+' pierde su respuesta.');continue;}const alive=r.party.filter(x=>x.hp>0);if(!alive.length)break;const t=alive[Math.floor(random(w,r.index+':'+c.round+':'+i+':target')*alive.length)];
  const armor=data.items[t.equipment?.body]?.armor||0;let damage=Math.max(1,7+Math.floor(random(w,c.round+':'+i+':damage')*5)-armor);if(c.covered.includes(t.id))damage=Math.ceil(damage*(c.coverFactor||.4));t.hp=Math.max(0,t.hp-damage);r.log.push(e.name+' hiere a '+definition(data,t.id).name+' · '+damage+' HP.');
 }
 c.covered=[];c.coverFactor=.4;c.round++;c.actor=r.party.findIndex(x=>x.hp>0);if(c.actor<0){r.status='failed';r.log.push('El equipo cae agotado. El último punto de control permite reorganizarse.');}return recordInterruption(w);
}
export function choose(data,source,id){
 need(source.run?.status==='active','No hay un encargo activo.');const option=options(data,source).find(o=>o.id===id);need(option,'Acción no disponible.');need(optionAvailable(source,option),'No se cumplen los requisitos de esta acción.');let w=copy(source),r=w.run,p=r.pending;
 if(option.gate==='numeric'){
  if(!p.gate){p.gate=createGate(w,id);r.log.push('El desvío termina ante una compuerta de servicio. El panel todavía conserva alimentación.');}
  const {gate}=validatedGate(data,w);gate.choice=id;
  if(gate.session.phase!=='success')return w;
 }else if(p.gate)delete p.gate;
 if(p.combat){spend(r,option.cost);return combatTurn(data,w,id);}if(option.combat){openCombat(data,w);return w;}if(id==='withdraw'){time(r,2);retreat(w);return w;}
 if(['scout','jam-skill','decoy','echo-path'].includes(id)){spend(r,option.cost);if(option.once)r.used[option.once]=(Number(r.used[option.once])||0)+1;if(id==='echo-path'){r.condition=Math.max(0,r.condition-(Base.eventFor(data,w)?.electronic?6:2));if(!r.condition){r.status='failed';return recordInterruption(w);}}r.evaded++;time(r,2);r.log.push(option.label+'.');arrive(data,w);return w;}
 const wasDelivery=p.category==='delivery',pickup=Base.mission(data,w).pickup,before=copy(r.supplies);w=Base.choose(data,w,id);r=w.run;mirrorChanges(data,r,before);if(!r.pending){rememberEncounter(data,w,p,option);rememberCorridor(data,w,p,option);}
 if(option.flag){r.flags.push(option.flag);r.log.push('Registrado: '+option.label+'.');}if(pickup&&!r.pickupDone&&Base.here(data,w).id===pickup.node){r.cargo=copy(pickup.cargo);r.pickupDone=true;r.log.push('Carga recogida y sellada para el destinatario.');}
 if(wasDelivery&&r.status==='completed'){
  const m=Base.mission(data,w),gross=r.receipt.amount,late=Math.max(0,r.minutes-(r.timeLimit??m.time_limit)),penalty=Math.min(Math.floor(gross*.5),Math.ceil(late/m.late_step_minutes)*m.late_penalty);w.credits-=penalty;r.receipt.amount-=penalty;r.receipt.gross=gross;r.receipt.timeLimit=r.timeLimit??m.time_limit;r.receipt.minutes=r.minutes;r.receipt.late=late;r.receipt.penalty=penalty;r.receipt.provisional=false;r.receipt.effect=m.effect;r.receipt.flags=copy(r.flags);r.receipt.startIndex=r.startIndex||0;
  r.receipt.narration=m.delivery_reaction||'';
  r.receipt.corridorVersion=r.corridorVersion||1;r.receipt.rewardTerms=copy(r.rewardTerms);r.receipt.beatrizVersion=r.beatrizVersion||0;r.receipt.guzmanVersion=r.guzmanVersion||0;r.receipt.jimenezVersion=r.jimenezVersion||0;
  if(r.mission==='relevo-01'&&r.corridorVersion!==2)r.receipt.narration=(r.flags.includes('relevo_confirmado')?'Rocío confirma que el hermano quedó ayudando en el depósito. Morales anota que el próximo grupo debe avisar antes de salir. ':'Bruno entrega la pregunta de la mujer. Morales pide al siguiente relevo que lleve la respuesta: el hermano se quedó ayudando en el depósito. ');
  r.receipt.narration=jimenezArrival(r)??guzmanArrival(r)??beatrizArrival(r)??arrivalAccount(r)??r.receipt.narration;
  if(r.mission==='adasme-01')r.receipt.rescueOutcome=rescueOutcome(r);
  const previouslyOpen=[...w.progression.known];refreshProgression(data,w);r.receipt.opened=w.progression.known.filter(id=>!previouslyOpen.includes(id));w.completed[r.mission]=copy(r.receipt);w.effects.push(r.mission);
  addCombatXp(r,35);w.crew=copy(ownedParty(data,r));w.location=Base.here(data,w).id;if(r.mission==='morales-01')w.regions.centro=Math.max(0,w.regions.centro-1);r.log[r.log.length-1]='Entrega completada · '+r.receipt.amount+' créditos'+(penalty?' tras descontar '+penalty+' por demora':' sin descuento por demora')+'. '+r.receipt.effect;
 }
 refreshProgression(data,w);refreshAftermath(w);refreshBeatriz(w);refreshGuzman(w);refreshJimenez(w);updateCheckpoint(data,w);return recordInterruption(w);
}
export function currentGate(data,w){
 if(!w.run?.pending?.gate)return null;const snapshot=copy(w),{gate,puzzle}=validatedGate(data,snapshot);return {key:gate.key,choice:gate.choice,puzzle:copy(puzzle),session:copy(gate.session)};
}
export function gateAction(data,source,action){
 need(source.run?.status==='active'&&source.run.pending?.gate,'No hay una compuerta activa.');
 need(action&&['start','continue','hint','digit','erase','clear','submit'].includes(action.type),'Acción de panel no disponible.');
 const w=copy(source),r=w.run,{gate,puzzle}=validatedGate(data,w),before=gate.session.phase;
 gate.session=transition(gate.session,puzzle,action);
 if(action.type==='start'&&before==='intro')r.log.push('El equipo examina la inscripción y los documentos que quedaron junto al panel.');
 if(gate.session.phase!==before&&gate.session.phase==='failed')r.log.push('La compuerta rechaza la clave. Quedan '+gate.session.remaining+' intentos.');
 if(gate.session.phase!==before&&gate.session.phase==='locked')r.log.push('El panel agota sus intentos y bloquea este desvío. El grupo tendrá que buscar otra salida.');
 if(gate.session.phase!==before&&gate.session.phase==='success')r.log.push('La clave coincide con el registro. La compuerta libera la galería de servicio.');
 return w;
}
export function completeGate(data,source){
 need(source.run?.status==='active'&&source.run.pending?.gate,'No hay una compuerta activa.');
 const checked=copy(source),{gate}=validatedGate(data,checked);need(gate.session.phase==='success','La compuerta todavía no está abierta.');return choose(data,checked,gate.choice);
}
export function lootRemaining(w){const c=w.run?.pending?.combat;return c?.phase==='loot'?c.enemies.reduce((n,e)=>n+e.loot.reduce((a,x)=>a+x.qty,0),0):0;}
export function canLoot(data,w,memberId,itemId){const r=w.run,c=r?.pending?.combat,m=r?.party.find(x=>x.id===memberId);return !!(c?.phase==='loot'&&m?.hp>0&&data.items[itemId]&&bagUsed(m)<bagCapacity(data,m));}
export function takeLoot(data,source,enemyIndex,memberId,itemId){
 const w=copy(source),r=w.run,c=r?.pending?.combat,e=c?.enemies[enemyIndex],drop=e?.loot.find(x=>x.id===itemId&&x.qty>0),m=r?.party.find(x=>x.id===memberId);need(c?.phase==='loot'&&drop&&m?.hp>0,'Saqueo no disponible.');need(canLoot(data,w,memberId,itemId),'La mochila elegida está llena.');gainOwned(data,r,m,itemId,1);drop.qty--;time(r,1);r.log.push(definition(data,m.id).name+' recupera '+data.items[itemId].name+'.');return w;
}
export function finishLoot(data,source){const w=copy(source),r=w.run,c=r?.pending?.combat;need(c?.phase==='loot','No hay saqueo pendiente.');const left=lootRemaining(w);if(left)r.log.push('Dejan '+left+' unidad'+(left===1?'':'es')+' de loot para no perder más tiempo.');arrive(data,w);return w;}
export function shelteredPlaza(data,w){return !!(w.effects.includes('guzman-01')&&(w.run?Base.here(data,w)?.id:w.location)==='plaza');}
export function rest(data,source){
 let w=source;
 if(w.effects.includes('ana-01')&&Base.here(data,w).id==='uchile'&&w.run.rested.filter(x=>x===w.run.index).length===1&&!w.run.used.anaRest){
  w=copy(w);w.run.used.anaRest=true;w.run.rested=w.run.rested.filter(x=>x!==w.run.index);
 }
 const before=copy(w.run.supplies),sheltered=shelteredPlaza(data,w);
 // The common engine still owns duration, healing and once-per-stop checks.
 const restData=sheltered?{...data,nodes:{...data.nodes,plaza:{...data.nodes.plaza,rest_cost:{}}}}:data;
 w=Base.rest(restData,w);
 if(sheltered){
  const at=w.run.log.findLastIndex(line=>line.startsWith('Descanso:'));
  if(at>=0)w.run.log[at]='Descanso bajo la guardia de Plaza: la posta pone agua y ración. Recuperación habitual; 10 minutos.';
 }
 mirrorChanges(data,w.run,before);w.run.party.forEach(c=>c.hp=Math.min(c.maxHp,c.hp+12));updateCheckpoint(data,w);return w;
}
export function toggleJammer(data,w){return Base.toggleJammer(data,w);}
export function retry(data,w){const next=Base.retry(data,w);next.run.party.forEach(c=>c.hp=Math.max(c.hp,Math.ceil(c.maxHp*.5)));for(const [id,n]of Object.entries(w.run.used))next.run.used[id]=Math.max(Number(next.run.used[id])||0,Number(n)||0);next.run.combatSerial=w.run.combatSerial;next.run.outcomeAttempt=nextOutcomeAttempt(w);next.location=Base.here(data,next).id;return next;}
export function abandon(data,w){const next=Base.abandon(data,w);next.crew=copy(ownedParty(data,next.run));next.location=Base.here(data,next).id;next.run.log[next.run.log.length-1]=Base.mission(data,next).type==='travel'?'Viaje detenido. El grupo permanece en '+data.nodes[next.location].name+'.':'Encargo devuelto a la red de relevos. No hay recompensa.';return next;}
export function atHeroes(data,w){return w.run&&['active','failed'].includes(w.run.status)?w.run.status==='active'&&!w.run.pending&&Base.here(data,w).id==='heroes':w.location==='heroes';}
export function marketJourney(data,w){return data.journeys['market-'+w.location]||null;}
export function entryDeadline(data,id,index){return data.missions[id].time_limit-data.routes[data.missions[id].route].edges.slice(0,index).reduce((sum,e)=>sum+e.minutes,0);}
export function atMissionOrigin(data,w,id){return !!data.missions[id]&&entryPoints(data,id).some(p=>p.node===w.location)&&!['active','failed'].includes(w.run?.status);}
export function approachJourney(data,w,id){return missionOpen(data,w,id)&&!w.paid.includes(id)?data.journeys['approach-'+id+'-'+w.location]||null:null;}
export function departurePlan(data,w,id){
 if(!missionOpen(data,w,id))return null;
 const current=w.run?.mission===id&&['active','failed'].includes(w.run.status)?w.run:null,receipt=w.completed[id],record=receipt||current;
 if(record){const index=record.startIndex||0,m=assignment(data,w,id),rt=data.routes[m.route];return {journey:null,destination:rt.nodes[index],index,limit:record.timeLimit??m.time_limit,legs:rt.edges.length-index};}
 const entry=entryPoints(data,id).find(p=>p.node===w.location),journey=entry?null:approachJourney(data,w,id),index=entry?.index??journey?.entryIndex;
 if(index===undefined)return null;
 return {journey,destination:entry?.node||journey.destination,index,limit:entryDeadline(data,id,index),legs:data.routes[data.missions[id].route].edges.length-index};
}
function beginTravel(data,source,journey){
 const w=Base.start(data,source,journey.id),r=w.run;
 restoreEncounters(w);r.outcomeAttempt=nextOutcomeAttempt(w);r.corridorVersion=2;r.directorVersion=1;r.kind='travel';r.travelSerial=w.travelSerial=(w.travelSerial||0)+1;r.party=copy(w.crew);
 for(const [id,n]of Object.entries(w.stock||{}))distribute(data,r.party,id,n);
 w.stock={};r.ownedStock=partyTotals(r.party);r.borrowedStock={};r.supplies=partyTotals(r.party);
 r.flags=[];r.used={};r.withdrawn=false;r.pickupDone=true;r.combatSerial=0;r.timeLimit=null;r.rewardPenalty=0;
 r.battery=r.supplies.jammer?20:0;
 r.log=['Salida desde '+data.nodes[source.location].name+' hacia '+data.nodes[journey.destination||'heroes'].name+'.'];
 r.checkpoint={node:source.location,snapshot:copy({...r,checkpoint:null})};
 if(!r.party.some(c=>c.hp>0))r.status='failed';
 return recordInterruption(refreshProgression(data,w));
}
export function travelToMission(data,source,id){
 need(!source.run||!['active','failed'].includes(source.run.status),'Termina o devuelve el encargo antes de iniciar otro viaje.');
 need(missionOpen(data,source,id),'Este contacto todavía no ha abierto su encargo.');
 need(!source.paid.includes(id),'Este encargo ya fue entregado.');
 need(!atMissionOrigin(data,source,id),'El equipo ya está en el punto de preparación.');
 const journey=approachJourney(data,source,id);need(journey,'No hay un trayecto disponible hasta ese punto de preparación.');
 return beginTravel(data,source,journey);
}
export function travelRosa(data,source){
 rosaBridge.cargo(source.rosaBridge);need(rosaBridge.idle(source),'Termina o devuelve el viaje antes de visitar a Ana.');
 need(source.rosaBridge.stage==='requested','El añadido ya fue recogido.');
 const journey=data.journeys['rosa-'+source.location];need(journey,'El equipo ya está en Plaza o no hay un recorrido disponible.');
 return beginTravel(data,source,journey);
}
export function travelMedical(data,source){
 bridge.cargo(source.matiasBridge);need(bridge.idle(source),"Termina o devuelve el viaje antes de recoger la reserva.");
 need(source.matiasBridge.stage==='requested',"La reserva ya fue recogida.");
 const journey=data.journeys['medical-'+source.location];need(journey,"El equipo ya está en Vicuña o no hay un recorrido disponible.");
 return beginTravel(data,source,journey);
}
export function visitJimenez(data,source){
 need(jimenezMemory(source,'vicuna').length,'Primero entrega el módulo de Jiménez.');
 need(!source.run||!['active','failed'].includes(source.run.status),'Termina o devuelve el encargo antes de visitar operaciones.');
 need(source.location!=='vicuna','El equipo ya está en operaciones.');
 const journey=data.journeys['visit-jimenez-'+source.location];need(journey,'No hay un recorrido disponible a operaciones.');
 return beginTravel(data,source,journey);
}
export function visitGuzman(data,source){
 need(guzmanMemory(source,'leones').length,'Primero entrega las piezas de Guzmán.');
 need(!source.run||!['active','failed'].includes(source.run.status),'Termina o devuelve el encargo antes de visitar los talleres.');
 need(source.location!=='leones','El equipo ya está en los talleres.');
 const journey=data.journeys['visit-guzman-'+source.location];need(journey,'No hay un recorrido disponible a los talleres.');
 return beginTravel(data,source,journey);
}
export function visitBeatriz(data,source){
 need(beatrizMemory(source,'libertadores').length,'Primero entrega la reserva de Beatriz.');
 need(!source.run||!['active','failed'].includes(source.run.status),'Termina o devuelve el encargo antes de visitar los huertos.');
 need(source.location!=='libertadores','El equipo ya está en los huertos.');
 const journey=data.journeys['visit-beatriz-'+source.location];need(journey,'No hay un recorrido disponible a los huertos.');
 return beginTravel(data,source,journey);
}
export function travelHeroes(data,source){
 need(!source.run||!['active','failed'].includes(source.run.status),'Termina o devuelve el encargo antes de viajar a Los Héroes.');
 need(!atHeroes(data,source),'El grupo ya está en Los Héroes.');
 const journey=marketJourney(data,source);need(journey,'No existe un camino abierto hasta Los Héroes.');
 return beginTravel(data,source,journey);
}
export function price(data,w,id){const s=data.shop.find(x=>x.id===id);need(s,'Suministro desconocido.');return id==='medkit'&&w.effects.includes('romero-01')?6:id==='food'&&w.effects.includes('beatriz-01')?3:s.price;}
export function salePrice(data,id){const item=data.shop.find(x=>x.id===id);return item?Math.max(1,Math.floor(item.price/item.qty/2)):data.items[id]?.kind==='weapon'?5:data.items[id]?.kind==='armor'?6:1;}
export function canResupply(data,w){return atHeroes(data,w);}
function activeParty(w){return w.run?.status==='active'?w.run.party:w.crew;}
export function buy(data,source,id,memberId){
 const w=copy(source);need(atHeroes(data,w),'Viaja a Los Héroes para comerciar.');const offer=data.shop.find(x=>x.id===id);need(offer,'Suministro desconocido.');const party=activeParty(w),member=party.find(x=>x.id===(memberId||party[0].id)),cost=price(data,w,id);need(member,'Mensajero desconocido.');need(w.credits>=cost,'No tienes suficientes créditos.');need(bagUsed(member)+offer.qty<=bagCapacity(data,member),'Esa mochila no tiene espacio.');w.credits-=cost;addBag(data,member,id,offer.qty);if(w.run?.status==='active'){w.run.ownedStock[id]=(w.run.ownedStock[id]||0)+offer.qty;sync(w.run);updateCheckpoint(data,w);}return w;
}
export function sell(data,source,id,memberId){
 const w=copy(source);need(atHeroes(data,w),'Viaja a Los Héroes para comerciar.');const party=activeParty(w),member=party.find(x=>x.id===(memberId||party[0].id));need(member&&data.items[id]&&data.items[id].kind!=='cargo','Ese objeto no puede venderse.');need(bagCount(member,id)>0,'El objeto no está en esa mochila.');if(w.run?.status==='active')need((w.run.ownedStock[id]||0)>0,'Los suministros prestados no se venden.');removeBag(member,id,1);if(w.run?.status==='active'){w.run.ownedStock[id]--;sync(w.run);updateCheckpoint(data,w);}w.credits+=salePrice(data,id);return w;
}
export function recover(data,source){const w=copy(source);need(atHeroes(data,w),'Viaja a Los Héroes para recuperarte.');const party=activeParty(w);need(party.some(c=>c.hp<c.maxHp),'El equipo ya está recuperado.');need(w.credits>=8,'Necesitas 8 créditos.');w.credits-=8;party.forEach(c=>c.hp=c.maxHp);if(w.run?.status==='active')updateCheckpoint(data,w);return w;}
export function heal(data,source,id){const w=copy(source),r=w.run;need(r?.status==='active'&&!r.pending,'Resuelve el encuentro antes de atender al equipo.');const c=r.party.find(c=>c.id===id);need(c&&c.hp<c.maxHp,'Ese Mensajero no necesita un botiquín.');spend(r,{medkit:1});c.hp=Math.min(c.maxHp,c.hp+24);updateCheckpoint(data,w);return w;}
export function useItem(data,source,memberId,id){const w=copy(source),party=activeParty(w),m=party.find(x=>x.id===memberId),item=data.items[id];need(!w.run?.pending?.combat,'Usa el inventario de combate durante una batalla.');need(m&&(item?.kind==='medical'||id==='medkit'),'Ese objeto no puede usarse.');need(bagCount(m,id)>0&&m.hp<m.maxHp,'No puedes usarlo ahora.');removeBag(m,id,1);m.hp=Math.min(m.maxHp,m.hp+(item.heal||(id==='medkit'?24:14)));if(w.run?.status==='active'){w.run.ownedStock[id]=Math.max(0,(w.run.ownedStock[id]||0)-1);sync(w.run);updateCheckpoint(data,w);}return w;}
export function transfer(data,source,fromId,toId,id,qty=1){
 const w=copy(source),party=activeParty(w),from=party.find(x=>x.id===fromId),to=party.find(x=>x.id===toId);
 need(!w.run?.pending?.combat,'Termina el combate antes de transferir equipo.');
 need(Number.isInteger(qty)&&qty>0&&from&&to&&from!==to&&bagCount(from,id)>=qty,'Transferencia no disponible.');
 need(bagUsed(to)+qty<=bagCapacity(data,to),'La mochila de destino no tiene espacio suficiente.');
 removeBag(from,id,qty);addBag(data,to,id,qty);if(w.run?.status==='active'){sync(w.run);updateCheckpoint(data,w);}return w;
}
export function discardItem(data,source,memberId,id,qty=1){
 const w=copy(source),m=activeParty(w).find(x=>x.id===memberId),item=data.items[id];
 need(!w.run?.pending?.combat,'Termina el combate antes de descartar equipo.');
 need(m&&item&&item.kind!=='cargo'&&item.discard!==false,'Este objeto está protegido y no se puede descartar.');
 need(Number.isInteger(qty)&&qty>0&&bagCount(m,id)>=qty,'Ese objeto no está disponible.');
 removeBag(m,id,qty);if(w.run?.status==='active'){w.run.ownedStock[id]=Math.max(0,(w.run.ownedStock[id]||0)-qty);sync(w.run);updateCheckpoint(data,w);}return w;
}
export function equip(data,source,memberId,id){
 const w=copy(source),party=activeParty(w),m=party.find(x=>x.id===memberId),item=data.items[id];need(m&&item?.slot&&bagCount(m,id)>0,'Ese equipo no está disponible.');const old=m.equipment[item.slot];removeBag(m,id,1);if(old)addBag(data,m,old,1);m.equipment[item.slot]=id;if(w.run?.status==='active'){sync(w.run);updateCheckpoint(data,w);}return w;
}
export function skillPoints(c){return c.level-(c.skills||[]).length;}
export function learn(data,source,memberId,skillId){const w=copy(source);need(!w.run||w.run.status!=='active'||(!w.run.pending&&Base.here(data,w).checkpoint),'Aprende habilidades en un punto de control.');const party=activeParty(w),c=party.find(x=>x.id===memberId),skill=data.skillTrees[memberId]?.find(x=>x.id===skillId);need(c&&skill,'Habilidad desconocida.');need(!has(c,skillId)&&skillPoints(c)>0,'No hay puntos disponibles o ya aprendiste la habilidad.');need(!skill.requires||has(c,skill.requires),'Aprende primero la habilidad anterior.');c.skills=[...(c.skills||[]),skillId];if(w.run?.status==='active')updateCheckpoint(data,w);return w;}
export function rewardForecast(data,w){const r=w.run,m=Base.mission(data,w);if(!r||!m||m.type==='travel')return null;if(r.status==='completed'&&r.receipt?.gross!==undefined){const p=r.receipt;return{gross:p.gross,amount:p.amount,late:p.late,penalty:p.penalty,limit:p.timeLimit,minutes:p.minutes};}const gross=m.reward.base+(r.combats===0?m.reward.stealth_bonus:0),late=Math.max(0,r.minutes-(r.timeLimit??m.time_limit)),penalty=Math.min(Math.floor(gross*.5),Math.ceil(late/m.late_step_minutes)*m.late_penalty);return{gross,amount:gross-penalty,late,penalty,limit:r.timeLimit??m.time_limit,minutes:r.minutes};}
export function restore(data,text){
 const migrated=restoreTerms(data,restoreCorridors(data,JSON.parse(migrateNetworkSave(data,text))));
 const w=Base.restore(data,JSON.stringify(migrated));if(w.matiasBridge!==undefined)bridge.cargo(w.matiasBridge);if(w.rosaBridge!==undefined)rosaBridge.cargo(w.rosaBridge);need(w.mode==='production'&&Array.isArray(w.crew)&&Array.isArray(w.effects)&&w.stock,'Guardado de encargos inválido.');w.location??=(w.run&&Base.here(data,w)?.id)||'heroes';w.hubVisits??=0;
 for(const c of w.crew)memberBase(data,c);
 if(w.run){const r=w.run;
  if(r.startIndex!==undefined)need(Number.isInteger(r.startIndex)&&r.startIndex>=0&&r.startIndex<=r.index&&!!data.missions[r.mission]&&(Base.mission(data,w).entry_points||[{index:0}]).some(p=>p.index===r.startIndex),'Punto de incorporación inválido.');
  r.party.forEach(c=>memberBase(data,c));r.ownedStock??=copy(w.stock||{});r.borrowedStock??={};r.flags??=[];r.used??={};r.timeLimit??=(Base.mission(data,w).time_limit??null);r.rewardPenalty??=0;
  if(!r.party.some(c=>c.bag?.length)){for(const [id,n]of Object.entries(r.supplies||{}))distribute(data,r.party,id,n);}sync(r);
  const combat=r.pending?.combat;if(combat){combat.phase??='combat';combat.enemies.forEach((e,i)=>e.loot??=lootFor(w,e.id==='drone',r.combatSerial||0,i));}
  if(r.pending?.gate)validatedGate(data,w);
  if(r.checkpoint?.snapshot?.party)r.checkpoint.snapshot.party.forEach(c=>memberBase(data,c));
 }
 for(const party of [w.crew,w.run?.party,w.run?.checkpoint?.snapshot?.party].filter(Boolean)){
  need(Array.isArray(party)&&party.length===3&&new Set(party.map(x=>x.id)).size===3,'Equipo inválido.');for(const c of party){need(data.crew.some(x=>x.id===c.id)&&Number.isInteger(c.hp)&&c.hp>=0&&c.hp<=c.maxHp&&Number.isInteger(c.level)&&c.level>0&&Number.isInteger(c.xp)&&c.xp>=0,'Estado de Mensajero inválido.');need(Array.isArray(c.bag)&&bagUsed(c)<=bagCapacity(data,c)&&c.bag.every(x=>data.items[x.id]&&Number.isInteger(x.qty)&&x.qty>0),'Mochila inválida.');need(Array.isArray(c.skills)&&new Set(c.skills).size===c.skills.length&&c.skills.length<=c.level&&c.skills.every(id=>{const s=data.skillTrees[c.id]?.find(s=>s.id===id);return s&&(!s.requires||c.skills.includes(s.requires));}),'Habilidades inválidas.');}
 }
 return normalizeOutcomes(refreshJimenez(refreshGuzman(refreshBeatriz(refreshAftermath(restoreProgression(data,restoreEncounters(w)))))));
}
export function craft(){throw Error('Los Mensajeros no pueden fabricar. Compra suministros en Los Héroes.');}

// Corpse search and discard persist alongside the encounter, without regenerating drops.
export function revealLoot(data,source,enemyIndex){
 const w=copy(source),c=w.run?.pending?.combat,e=c?.enemies[enemyIndex];
 need(w.run?.status==='active'&&c?.phase==='loot'&&e,'No hay un cuerpo disponible.');
 e.searched=true;return w;
}
export function discardLoot(data,source,enemyIndex,itemId){
 const w=copy(source),c=w.run?.pending?.combat,e=c?.enemies[enemyIndex],drop=e?.loot.find(x=>x.id===itemId&&x.qty>0);
 need(w.run?.status==='active'&&c?.phase==='loot'&&drop,'Ese objeto ya no está disponible.');
 drop.originalQty=drop.qty;drop.qty=0;drop.status='discarded';return w;
}
export function collectLoot(data,source,enemyIndex,memberId,itemId=null){
 const c=source.run?.pending?.combat,e=c?.enemies[enemyIndex],p=source.run?.party.find(x=>x.id===memberId);
 need(source.run?.status==='active'&&c?.phase==='loot'&&e&&p?.hp>0,'Selecciona un saqueador con vida.');
 const drops=e.loot.filter(x=>x.qty>0&&(itemId===null||x.id===itemId));
 need(drops.length,'Ese objeto ya no está disponible.');
 need(drops.reduce((n,x)=>n+x.qty,0)<=bagCapacity(data,p)-bagUsed(p),'No cabe todo el loot seleccionado en la mochila.');
 let w=source;
 for(const drop of drops){const qty=drop.qty;for(let i=0;i<qty;i++)w=takeLoot(data,w,enemyIndex,memberId,drop.id);
  const taken=w.run.pending.combat.enemies[enemyIndex].loot.find(x=>x.id===drop.id);taken.originalQty=qty;taken.status='taken';}
 return w;
}
