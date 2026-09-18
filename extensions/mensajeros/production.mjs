// Production activity: pure transitions and a separate save from the narrative campaign.
import * as Base from './engine.mjs';
export {mission, route, here, nextEdge, effectiveRisk, eventFor, serialize} from './engine.mjs';
const copy=x=>JSON.parse(JSON.stringify(x));
const need=(ok,msg)=>{if(!ok)throw Error(msg);};
export function prepare(data){
 const d=copy(data);for(const m of Object.values(d.missions))m.test_loadout=m.loadout;
 for(const e of Object.values(d.scripted))d.events.push({...e,category:'decision',regions:['centro','oriente','l6']});
 return d;
}
export function createWorld(data,{seed=Date.now()}={}){
 const w=Base.createWorld(data,{mode:'laboratory',seed});
 return {...w,mode:'production',crew:data.crew.map(c=>({id:c.id,hp:c.maxHp,maxHp:c.maxHp,xp:0,level:1,skills:[]})),stock:{},effects:[],helpSeen:false};
}
export function start(data,source,id){
 need(source.run?.status!=='failed','Reintenta o devuelve el encargo interrumpido.');
 const w=Base.start(data,source,id),r=w.run,m=data.missions[id];
 // Every assignment begins at its issuing relay. Travel inside an assignment never teleports.
 r.party=copy(w.crew).map(c=>({...c,hp:Math.max(c.hp,Math.ceil(c.maxHp*.4))}));r.used={};r.ownedStock=copy(w.stock);r.flags=[];r.withdrawn=false;r.pickupDone=!m.pickup;r.combatSerial=0;
 if(m.pickup)r.cargo={};
 for(const [k,v]of Object.entries(w.stock))r.supplies[k]=(r.supplies[k]||0)+v;
 w.stock={};
 if(w.effects.includes('jimenez-01')){r.supplies.jammer=1;r.battery=20;}
 r.checkpoint.snapshot=copy({...r,checkpoint:null});
 r.log.push('La red de relevos reúne al equipo en '+Base.here(data,w).name+'.');
 return w;
}
function updateCheckpoint(data,w){
 if(w.run?.status==='active'&&!w.run.pending&&Base.here(data,w).checkpoint){
  const {checkpoint,rolls,log,...snapshot}=w.run;
  w.run.checkpoint={node:Base.here(data,w).id,snapshot:copy(snapshot)};
 }
}
export function advance(data,source){
 let w=Base.advance(data,source),r=w.run,p=r.pending;
 r.withdrawn=false;
 const scene=data.scripted[r.mission+':'+p.edgeIndex];
 if(scene){Object.assign(p,{id:scene.id,category:'decision'});r.rolls[p.edgeIndex]={id:scene.id,category:'decision'};}
 if(r.rescued?.mode==='carry'&&r.party.find(x=>x.id==='bruno')?.hp>0&&r.status==='active')r.condition=Math.min(100,r.condition+(has(r.party.find(x=>x.id==='bruno'),'carry')?2:1));
 return w;
}
export function optionAvailable(w,o){
 return Base.optionAvailable(w,o)&&(!o.requiresCrew||w.run.party.some(p=>p.id===o.requiresCrew&&p.hp>0))&&(!o.once||(w.run.used[o.once]||0)<(o.limit||1));
}
export function options(data,w){
 const r=w.run,p=r?.pending;if(!p||r.status!=='active')return [];
 if(p.combat){
  const actor=r.party[p.combat.actor],c=data.crew.find(x=>x.id===actor.id);
  return [{id:'fire',label:'Disparar · 2 municiones',cost:{ammo556:2}},{id:'melee',label:'Ataque cercano'},...(actor.id==='tomas'?[{id:'listen',label:'Escuchar · prepara el próximo golpe cercano'}]:[]),{id:'cover',label:'Cubrirse · reduce el próximo daño'},{id:'skill',label:c.id==='rocio'?'Marcar al enemigo':c.id==='tomas'?'Interferir · anula una respuesta':'Proteger a todo el grupo',once:'combat-'+r.combatSerial+'-'+c.id},...(r.supplies.medkit?[{id:'heal',label:'Usar botiquín · recuperar hasta 24 HP',cost:{medkit:1}}]:[]),{id:'smoke-retreat',label:'Retirarse con humo · 1 bomba',cost:{smoke:1}},{id:'trap-retreat',label:'Dejar trampa y retirarse · 1 trampa',cost:{trap:1}},...(r.party.some(x=>x.id==='tomas'&&x.hp>0)?[{id:'guided-retreat',label:'Tomás guía la retirada · desgaste '+(has(r.party.find(x=>x.id==='tomas'),'exit')?2:5)+(Base.eventFor(data,w)?.electronic?' + 4 por ruido':'')}]:[]),{id:'retreat',label:'Retirada al último andén · desgaste 12'}];
 }
 let opts=Base.options(data,w).map(copy);
 if(p.category==='delivery')opts[0].label='Entregar a '+data.missions[r.mission].recipient;
 if(p.category==='hostile'){
  opts.unshift({id:'scout',label:'Rocío busca un paso silencioso · 1 uso por encargo',requiresCrew:'rocio',once:'scout',limit:has(r.party.find(x=>x.id==='rocio'),'trail')?2:1}, {id:'decoy',label:'Distraer con un señuelo · 1 unidad',cost:{decoy:1}});
  if(Base.eventFor(data,w)?.electronic)opts.unshift({id:'jam-skill',label:'Tomás confunde el sensor · 1 uso por encargo',requiresCrew:'tomas',once:'jam'});
  opts.unshift({id:'echo-path',label:'Tomás escucha y encuentra un desvío'+(Base.eventFor(data,w)?.electronic?' · ruido: desgaste 6':' · desgaste 2'),requiresCrew:'tomas',once:'echo',limit:has(r.party.find(x=>x.id==='tomas'),'echo')?2:1});
  opts.push({id:'withdraw',label:'Retroceder al andén · el paso seguirá bloqueado'});
 }
 return opts;
}
function spend(r,cost={}){for(const [k,n]of Object.entries(cost)){need(r.supplies[k]>=n,'Faltan suministros.');r.supplies[k]-=n;}}
function time(r,n){r.minutes+=n;if(r.jammerOn){r.battery=Math.max(0,r.battery-n);if(!r.battery)r.jammerOn=false;}}
function arrive(data,w){const r=w.run,p=r.pending;r.history.push({id:p.id,category:p.category,node:p.to});r.index=p.edgeIndex+1;r.pending=null;r.log.push('Llegada a '+Base.here(data,w).name+'.');updateCheckpoint(data,w);}
function retreat(w,wear=0){const r=w.run;r.condition=Math.max(0,r.condition-wear);r.pending=null;r.withdrawn=true;r.status=r.condition?'active':'failed';r.log.push('Retroceden al andén anterior. Conservan carga, heridas y vigilancia; el paso sigue pendiente.');}
function random(w,salt){let n=2166136261;for(const c of String(w.seed)+salt)n=Math.imul(n^c.charCodeAt(0),16777619);return(n>>>0)/4294967296;}
function openCombat(data,w){
 const r=w.run,p=r.pending,e=Base.nextEdge(data,w),electronic=Base.eventFor(data,w)?.electronic;
 r.combats++;r.combatSerial++;w.regions[e.region]=Math.min(6,w.regions[e.region]+1);
 const enemy=(id,name,hp,img)=>({id,name,hp,maxHp:hp,image:'../../portraits/'+img,stunned:false});
 p.combat={actor:r.party.findIndex(x=>x.hp>0),target:0,turn:0,round:1,covered:[],marked:null,enemies:electronic?[enemy('drone','Dron Red UNO',36,'drone.webp')]:[enemy('scout','Merodeador',26,'merodeador.webp'),enemy('guard','Vigía armado',24,'merodeador2.webp')]};
 r.log.push('Contacto armado. La vigilancia del corredor aumenta.');
 if(p.combat.actor<0)r.status='failed';
}
export function target(data,source,index){const w=copy(source),c=w.run?.pending?.combat;need(c&&Number.isInteger(index)&&c.enemies[index]?.hp>0,'Objetivo no disponible.');c.target=index;return w;}
function combatTurn(data,w,id){
 const r=w.run,c=r.pending.combat,actor=r.party[c.actor],def=data.crew.find(x=>x.id===actor.id),enemy=c.enemies[c.target];
 if(['retreat','smoke-retreat','trap-retreat','guided-retreat'].includes(id)){time(r,id==='retreat'?6:1);retreat(w,id==='retreat'?12:id==='guided-retreat'?(has(r.party.find(x=>x.id==='tomas'),'exit')?2:5)+(Base.eventFor(data,w)?.electronic?4:0):0);return w;}
 c.turn++;time(r,1);
 if(id==='heal'){actor.hp=Math.min(actor.maxHp,actor.hp+(has(actor,'aid')?32:24));r.log.push(def.name+' usa un botiquín.');}
 else if(id==='listen'){c.listening=true;r.log.push('Tomás escucha los movimientos. Prepara su próximo golpe cercano; el ruido puede confundirlo.');}
 else if(id==='cover'){c.covered.push(actor.id);r.log.push(def.name+' se cubre.');}
 else if(id==='skill'){
  r.used['combat-'+r.combatSerial+'-'+actor.id]=true;
  if(actor.id==='rocio'){c.marked=enemy.id;c.markBonus=has(actor,'mark')?12:8;r.log.push('Rocío marca al objetivo: el siguiente ataque gana daño adicional.');}
  if(actor.id==='tomas'){enemy.stunned=true;r.log.push('Tomás interrumpe la respuesta del objetivo.');}
  if(actor.id==='bruno'){c.covered=r.party.map(x=>x.id);c.coverFactor=has(actor,'guard')?.25:.4;r.log.push('Bruno protege al equipo durante la siguiente respuesta.');}
 }else{
  const chance=hitChance(data,w,id);
  const hit=random(w,r.mission+':'+r.index+':'+r.combatSerial+':'+c.turn+':hit')<chance;
  if(actor.id==='tomas'&&id==='melee')c.listening=false;
  const crit=random(w,c.turn+':'+r.index+':crit')<.12;
  const damage=hit?Math.max(1,def.attack+(actor.level-1)*2+(id==='fire'?4:-3)+(crit?5:0)+(c.marked===enemy.id?(c.markBonus||8):0)):0;
  if(c.marked===enemy.id)c.marked=null;
  enemy.hp=Math.max(0,enemy.hp-damage);r.log.push(def.name+(hit?' inflige '+damage+(crit?' de daño crítico':' de daño')+' a '+enemy.name+'.':' falla el ataque.'));
 }
 if(c.enemies.every(e=>e.hp===0)){
  r.log.push('Paso despejado. Recuperan 2 municiones y 1 agua.');r.supplies.ammo556=(r.supplies.ammo556||0)+2;r.supplies.water=(r.supplies.water||0)+1;r.ownedStock.ammo556=(r.ownedStock.ammo556||0)+2;r.ownedStock.water=(r.ownedStock.water||0)+1;
  const salvage=Base.eventFor(data,w)?.electronic?'electronics':'scrap';r.supplies[salvage]=(r.supplies[salvage]||0)+2;r.ownedStock[salvage]=(r.ownedStock[salvage]||0)+2;r.log.push('Material recuperado: '+data.items[salvage].name+' ×2.');
  arrive(data,w);return w;
 }
 if(!c.enemies[c.target].hp)c.target=c.enemies.findIndex(e=>e.hp>0);
 const next=r.party.findIndex((x,i)=>i>c.actor&&x.hp>0);
 if(next>=0){c.actor=next;return w;}
 for(const [i,e]of c.enemies.entries()){
  if(!e.hp)continue;if(e.stunned){e.stunned=false;r.log.push(e.name+' pierde su respuesta.');continue;}
  const alive=r.party.filter(x=>x.hp>0);if(!alive.length)break;
  const t=alive[Math.floor(random(w,r.index+':'+c.round+':'+i+':target')*alive.length)];
  let damage=7+Math.floor(random(w,c.round+':'+i+':damage')*5);if(c.covered.includes(t.id))damage=Math.ceil(damage*(c.coverFactor||.4));
  t.hp=Math.max(0,t.hp-damage);r.log.push(e.name+' hiere a '+data.crew.find(x=>x.id===t.id).name+' · '+damage+' HP.');
 }
 c.covered=[];c.coverFactor=.4;c.round++;c.actor=r.party.findIndex(x=>x.hp>0);
 if(c.actor<0){r.status='failed';r.log.push('El equipo cae agotado. El último punto de control permite reorganizarse.');}
 return w;
}
export function choose(data,source,id){
 need(source.run?.status==='active','No hay un encargo activo.');
 const option=options(data,source).find(o=>o.id===id);need(option,'Acción no disponible.');need(optionAvailable(source,option),'No se cumplen los requisitos de esta acción.');
 let w=copy(source),r=w.run,p=r.pending;
 if(p.combat){spend(r,option.cost);return combatTurn(data,w,id);}
 if(option.combat){openCombat(data,w);return w;}
 if(id==='withdraw'){time(r,2);retreat(w);return w;}
 if(['scout','jam-skill','decoy','echo-path'].includes(id)){
  spend(r,option.cost);if(option.once)r.used[option.once]=(Number(r.used[option.once])||0)+1;if(id==='echo-path'){r.condition=Math.max(0,r.condition-(Base.eventFor(data,w)?.electronic?6:2));if(!r.condition){r.status='failed';return w;}}r.evaded++;time(r,2);r.log.push(option.label+'.');arrive(data,w);return w;
 }
 const wasDelivery=p.category==='delivery',pickup=data.missions[r.mission].pickup;
 w=Base.choose(data,w,id);r=w.run;
 if(option.flag){r.flags.push(option.flag);r.log.push('Registrado: '+option.label+'.');}
 if(pickup&&!r.pickupDone&&Base.here(data,w).id===pickup.node){r.cargo=copy(pickup.cargo);r.pickupDone=true;r.log.push('Carga recogida y sellada para el destinatario.');}
 if(wasDelivery&&r.status==='completed'){
  r.receipt.provisional=false;r.receipt.effect=data.missions[r.mission].effect;r.receipt.flags=copy(r.flags);
  w.completed[r.mission]=copy(r.receipt);w.effects.push(r.mission);
  for(const [id,n]of Object.entries(r.ownedStock))w.stock[id]=(w.stock[id]||0)+Math.min(n,r.supplies[id]||0);
  w.crew=copy(r.party).map(c=>{c.xp+=35;while(c.xp>=60){c.xp-=60;c.level++;c.maxHp+=5;c.hp=Math.min(c.maxHp,c.hp+5);}return c;});
  if(r.mission==='morales-01')w.regions.centro=Math.max(0,w.regions.centro-1);
  r.log[r.log.length-1]='Entrega completada · '+r.receipt.amount+' fichas. '+r.receipt.effect;
 }
 updateCheckpoint(data,w);return w;
}
export function rest(data,source){
 let w=source;
 if(w.effects.includes('ana-01')&&Base.here(data,w).id==='uchile'&&w.run.rested.filter(x=>x===w.run.index).length===1&&!w.run.used.anaRest){w=copy(w);w.run.used.anaRest=true;w.run.rested=w.run.rested.filter(x=>x!==w.run.index);}
 w=Base.rest(data,w);w.run.party.forEach(c=>c.hp=Math.min(c.maxHp,c.hp+12));updateCheckpoint(data,w);return w;
}
export function toggleJammer(data,w){return Base.toggleJammer(data,w);}
export function retry(data,w){const next=Base.retry(data,w);next.run.party.forEach(c=>c.hp=Math.max(c.hp,Math.ceil(c.maxHp*.5)));for(const [id,n]of Object.entries(w.run.used))next.run.used[id]=Math.max(Number(next.run.used[id])||0,Number(n)||0);next.run.combatSerial=w.run.combatSerial;return next;}
export function abandon(data,w){const next=Base.abandon(data,w);next.crew=copy(next.run.party);next.run.log[next.run.log.length-1]='Encargo devuelto a la red de relevos. No hay recompensa.';return next;}
export function price(data,w,id){const s=data.shop.find(x=>x.id===id);return id==='medkit'&&w.effects.includes('romero-01')?6:id==='food'&&w.effects.includes('beatriz-01')?3:s.price;}
export function canResupply(data,w){return !w.run||!['active','failed'].includes(w.run.status)||(w.run.status==='active'&&!w.run.pending&&Base.here(data,w).checkpoint);}
export function buy(data,source,id){
 const w=copy(source);need(canResupply(data,w),'El abastecimiento está disponible en los puntos de control.');
 const item=data.shop.find(x=>x.id===id);need(item,'Suministro desconocido.');const cost=price(data,w,id);need(w.credits>=cost,'No tienes suficientes fichas.');
 const stock=w.run?.status==='active'?w.run.supplies:w.stock;need((stock[id]||0)+item.qty<=30,'Capacidad máxima: 30 unidades por suministro.');w.credits-=cost;stock[id]=(stock[id]||0)+item.qty;if(w.run?.status==='active')w.run.ownedStock[id]=(w.run.ownedStock[id]||0)+item.qty;updateCheckpoint(data,w);return w;
}
export function recover(data,source){const w=copy(source);need(!w.run||!['active','failed'].includes(w.run.status),'Recupera al grupo en una posta durante el encargo.');need(w.crew.some(c=>c.hp<c.maxHp),'El equipo ya está recuperado.');need(w.credits>=8,'Necesitas 8 fichas.');w.credits-=8;w.crew.forEach(c=>c.hp=c.maxHp);return w;}
export function heal(data,source,id){const w=copy(source),r=w.run;need(r?.status==='active'&&!r.pending,'Resuelve el encuentro antes de atender al equipo.');const c=r.party.find(c=>c.id===id);need(c&&c.hp<c.maxHp,'Ese Mensajero no necesita un botiquín.');spend(r,{medkit:1});c.hp=Math.min(c.maxHp,c.hp+24);updateCheckpoint(data,w);return w;}
export function restore(data,text){
 const w=Base.restore(data,text);need(w.mode==='production'&&Array.isArray(w.crew)&&Array.isArray(w.effects)&&w.stock,'Guardado de encargos inválido.');
 for(const party of [w.crew,...(w.run?[w.run.party]:[])]){
  need(Array.isArray(party)&&party.length===3&&new Set(party.map(x=>x.id)).size===3,'Equipo inválido.');
  for(const c of party)need(data.crew.some(x=>x.id===c.id)&&Number.isInteger(c.hp)&&c.hp>=0&&c.hp<=c.maxHp&&Number.isInteger(c.level)&&c.level>0&&Number.isInteger(c.xp)&&c.xp>=0,'Estado de Mensajero inválido.');
 }
 for(const [id,n]of Object.entries(w.stock))need(data.items[id]&&Number.isInteger(n)&&n>=0,'Reserva inválida.');
 if(w.run){const r=w.run;need(r.used&&r.ownedStock&&Array.isArray(r.flags)&&r.checkpoint?.snapshot?.party,'Punto de control inválido.');const c=r.pending?.combat;if(c){need(Array.isArray(c.enemies)&&c.enemies.length>0&&Number.isInteger(c.actor)&&c.actor>=-1&&c.actor<3&&Number.isInteger(c.target)&&c.target>=0&&c.target<c.enemies.length,'Combate inválido.');for(const e of c.enemies)need(Number.isFinite(e.hp)&&e.hp>=0&&e.hp<=e.maxHp,'Enemigo inválido.');}}
 for(const party of [w.crew,w.run?.party,w.run?.checkpoint?.snapshot?.party].filter(Boolean))for(const c of party){c.skills??=[];need(Array.isArray(c.skills)&&new Set(c.skills).size===c.skills.length&&c.skills.length<=c.level&&c.skills.every(id=>{const s=data.skillTrees[c.id]?.find(s=>s.id===id);return s&&(!s.requires||c.skills.includes(s.requires));}),'Habilidades inválidas.');}
 return w;
}

function has(member,id){return !!member?.skills?.includes(id);}
export function skillPoints(c){return c.level-(c.skills||[]).length;}
export function hitChance(data,w,id){
 const r=w.run,c=r.pending.combat,a=r.party[c.actor];
 let miss=id==='fire'?.08:.15;
 if(a.id==='tomas')miss=(id==='fire'?.55:.4)+(Base.eventFor(data,w)?.electronic?.15:0)-(id==='melee'&&c.listening?(has(a,'focus')?.3:.2):0);
 if(has(a,'aim'))miss-=.05;
 return Math.max(.05,Math.min(.97,1-miss));
}
export function learn(data,source,memberId,skillId){
 const w=copy(source);need(canResupply(data,w),'Aprende habilidades en un punto de control.');
 const active=w.run?.status==='active',party=active?w.run.party:w.crew,c=party.find(x=>x.id===memberId),skill=data.skillTrees[memberId]?.find(x=>x.id===skillId);
 need(c&&skill,'Habilidad desconocida.');need(!has(c,skillId)&&skillPoints(c)>0,'No hay puntos disponibles o ya aprendiste la habilidad.');need(!skill.requires||has(c,skill.requires),'Aprende primero la habilidad anterior.');
 c.skills=[...(c.skills||[]),skillId];updateCheckpoint(data,w);return w;
}
export function sell(data,source,id){
 const w=copy(source);need(canResupply(data,w),'Vende en un punto de control.');need(data.items[id]&&data.items[id].kind!=='cargo','La carga protegida no se vende.');
 const active=w.run?.status==='active',stock=active?w.run.supplies:w.stock;
 need((stock[id]||0)>0&&(!active||(w.run.ownedStock[id]||0)>0),'Solo puedes vender objetos propios o recuperados.');
 stock[id]--;if(active)w.run.ownedStock[id]--;w.credits+=salePrice(data,id);updateCheckpoint(data,w);return w;
}
export function salePrice(data,id){const item=data.shop.find(x=>x.id===id);return item?Math.max(1,Math.floor(item.price/item.qty/2)):1;}
export function craft(){throw Error('Los Mensajeros no pueden fabricar. Compra suministros en las postas.');}
