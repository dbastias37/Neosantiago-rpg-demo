import {communityNetwork,conversation,placeHeader,contactCard,knownCommunityContacts} from './community.mjs?v=3-jimenez';
import {dossier} from './dossier.mjs?v=3-jimenez';
import {animateRoute} from './travel.mjs?v=1';
import * as E from './production.mjs?v=18-jimenez';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=p=>new URL(p,import.meta.url).href;
const data=E.prepare(await fetch(new URL('./production.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('No se pudo cargar el catálogo');return r.json();}));
let world=E.createWorld(data,{seed:crypto.getRandomValues(new Uint32Array(1))[0]}),warning='',selected='relevo-01',zoom=1,busy=false,loadError=false,selectedCrew='rocio',selectedVendor='mara';
try{const text=localStorage.getItem(data.save_key);if(text)world=E.restore(data,text);}catch(err){loadError=true;warning='El guardado no se pudo abrir. Se conserva intacto. '+err.message;}
if(world.run&&data.missions[world.run.mission])selected=world.run.mission;
const mapSource=await fetch(new URL('./map.svg',import.meta.url)).then(r=>r.text());$('map').innerHTML=mapSource;const svg=$('map').querySelector('svg');svg.setAttribute('role','group');svg.setAttribute('aria-label','Mapa de refugios y recorrido de Los Mensajeros');svg.querySelector('#hotspots')?.remove();svg.querySelector('#routeGlow')?.remove();
// Production draws only the network introduced by completed work. The full atlas stays in the laboratory.
for(const child of [...svg.children])if(!['style','defs'].includes(child.tagName.toLowerCase()))child.remove();
const ns='http://www.w3.org/2000/svg',layer=document.createElementNS(ns,'g');layer.id='missionLayer';svg.append(layer);
const dialog=$('dialog'),itemDialog=$('itemDialog'),risks={low:'Baja',medium:'Media',high:'Alta'};
function save(){if(loadError)return;try{localStorage.setItem(data.save_key,E.serialize(world));$('saveStatus').textContent='Progreso guardado en este navegador';}catch{$('saveStatus').textContent='No se pudo guardar en este navegador.';}}
function sound(path){try{const a=new Audio(asset('../../audio/'+path));a.volume=.22;a.play().catch(()=>{});}catch{}}
function apply(fn,...args){try{if(loadError)throw Error(warning);world=fn(data,world,...args);save();render();return true;}catch(err){announce(err.message);return false;}}
function announce(text){$('announcement').textContent=text;$('saveStatus').textContent=text;}
function image(p,alt,cls=''){return `<img src="${asset(p)}" alt="${esc(alt)}" class="${cls}" loading="eager" decoding="async">`;}
function open(kicker,html,view=''){if(busy)return;dialog.classList.toggle('assignment-dossier',view==='dossier');dialog.classList.toggle('community-view',view==='community');$('dialogKicker').textContent=kicker;$('dialogBody').innerHTML=html;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;$('dialogBody').scrollTop=0;$('dialogTitle')?.focus({preventScroll:true});}
function close(d){if(d.open)d.close();}
for(const d of [dialog,itemDialog]){d.addEventListener('cancel',e=>{e.preventDefault();close(d);});}
function party(){return world.run?.status==='active'?world.run.party:world.crew;}
function member(id){return party().find(x=>x.id===id);}
function def(id){return data.crew.find(x=>x.id===id);}
function dname(id){return def(id).name.split(' ')[0];}
function totals(){return party().reduce((out,c)=>{for(const x of c.bag)out[x.id]=(out[x.id]||0)+x.qty;return out;},{});}
function itemRows(stock){return Object.entries(stock||{}).filter(([,n])=>n>0).map(([id,n])=>`<button class="item-row" data-item="${id}">${image(data.items[id].image,data.items[id].name)}<span>${esc(data.items[id].name)}</span><b>×${n}</b></button>`).join('')||'<p class="empty">Sin objetos en esta categoría.</p>';}
function itemModal(id){const i=data.items[id];$('itemBody').innerHTML=`<div class="item-detail">${image(i.image,i.name)}<div><span class="chip">${i.kind==='cargo'?'CARGA PROTEGIDA':i.kind.toUpperCase()}</span><h2 id="itemTitle">${esc(i.name)}</h2><p>${esc(i.description)}</p><dl><dt>Comercio</dt><dd>${i.kind==='cargo'?'No disponible':'Mara o el Armero en Los Héroes · venta '+E.salePrice(data,id)+' créditos'}</dd><dt>Fabricación</dt><dd>Los Mensajeros no fabrican ni desarman</dd><dt>Uso</dt><dd>${i.slot?'Puede equiparse desde la ficha del Mensajero':i.heal?'Puede usarse desde su mochila':i.kind==='cargo'?'Entrega al destinatario':'Viaje, combate o comercio'}</dd></dl></div></div>`;if(!itemDialog.open)itemDialog.showModal();}
function catalog(id=selected){
 const view=dossier(data,world,id,{image,itemRows,progressHTML});
 if(view.selected)selected=view.selected;
 open('LOS MENSAJEROS / RED DE REFUGIOS',view.html,'dossier');
}
function offer(id){
 if(!E.missionOpen(data,world,id)){announce('Este contacto aún no ha abierto su encargo.');return;}
 selected=id;if(!world.run)render();catalog(id);
}
function itineraryHTML(route,startIndex=0,current=false){return `<ol class="route-list">${route.nodes.slice(startIndex).map((id,j)=>{const i=j+startIndex,n=data.nodes[id],edge=route.edges[i];return `<li class="${current&&i===world.run?.index?'active':''}"><span class="number">${String(j+1).padStart(2,'0')}</span><span>${esc(n.name)}</span><small>${edge?edge.minutes+' min al próximo punto':'Destino'}</small></li>`;}).join('')}</ol>`;}
function displayRoute(preview){
 if(preview&&!E.missionOpen(data,world,preview)){announce('Primero debes abrir este contacto.');return;}
 const m=preview?E.assignment(data,world,preview):world.run?E.mission(data,world):data.missions[selected],r=data.routes[m.route];
 const current=world.run?.mission===m.id,plan=m.type==='travel'?null:E.departurePlan(data,world,m.id),startIndex=current?(world.run.startIndex||0):world.completed[m.id]?.startIndex??plan?.index??0,limit=current?(world.run.timeLimit??m.time_limit):world.completed[m.id]?.timeLimit??plan?.limit??m.time_limit;
 open('ITINERARIO / '+m.issuer,`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">${esc(m.name)}</h2><p>Tiempo base: ${r.edges.slice(startIndex).reduce((n,e)=>n+e.minutes,0)} min.${m.type==='travel'?' Puede haber encuentros en cada tramo.'+(m.purpose==='assignment'?' El encargo todavía no ha comenzado.':m.purpose==='visit'?' La visita no tiene recompensa.':' El mercado abre al llegar a Los Héroes.'):' Plazo con margen: '+limit+' min.'}</p>${m.type==='travel'&&E.routeWarning(data,world,r)?'<p class="time-warning">'+esc(E.routeWarning(data,world,r))+'</p>':''}${itineraryHTML(r,startIndex,current)}</div><div class="dialog-actions"><button ${preview?'data-offer="'+m.id+'"':'data-close="dialog"'} class="primary">${preview?'Volver al encargo':'Volver'}</button></div>`);
}
function approach(id){
 const plan=E.departurePlan(data,world,id),m=data.missions[id];
 if(!plan?.journey||world.paid.includes(id)){announce('No hay un traslado pendiente para este encargo.');return;}
 const rt=data.routes[plan.journey.route],stock=totals();
 open('ANTES DEL ENCARGO',`<div class="dialog-body"><div class="hero-brief">${image(m.portrait,m.issuer)}<div><h2 id="dialogTitle" tabindex="-1">Llegar a ${esc(data.nodes[plan.destination].name)}</h2><p>${esc(m.issuer)} coordina la preparación en ${esc(data.nodes[plan.destination].name)}. ${m.pickup?'La carga se recoge después en '+esc(data.nodes[m.pickup.node].name)+', durante el encargo.':'Los suministros previstos se reciben al aceptar el encargo.'} Por ahora viajas con tus mochilas.</p><p>Sales de ${esc(data.nodes[world.location].name)}. ${counted(rt.edges.length,'tramo','tramos')} · ${rt.edges.reduce((n,e)=>n+e.minutes,0)} minutos de desplazamiento base.</p></div></div><p>Puede haber encuentros, combate y desgaste. El plazo de ${plan.limit} minutos del encargo empieza solo cuando lo aceptes en destino.</p><p class="time-warning">Llevan ${counted(stock.food||0,'ración','raciones')}, ${counted(stock.water||0,'reserva de agua','reservas de agua')} y ${counted(stock.medkit||0,'botiquín','botiquines')}. Revisa sus heridas y el equipo antes de salir.</p>${E.routeWarning(data,world,rt)?'<p class="time-warning">'+esc(E.routeWarning(data,world,rt))+'</p>':''}${itineraryHTML(rt)}</div><div class="dialog-actions"><button data-offer="${id}">Volver</button><button id="cargoCrewButton">Revisar equipo</button>${E.atHeroes(data,world)?'<button data-heroes>Mara / Armero</button>':''}<button data-start-approach="${id}" class="primary">Viajar al encuentro</button></div>`);
}

function nodeInfo(id){
 if(!E.knownNodes(data,world).includes(id))return;
 const n=data.nodes[id],people=knownContacts().filter(c=>c.refuge===id),memory=E.communityMemory(world,id);
 open('RED DE REFUGIOS / '+n.name,`<div class="community-body">${placeHeader(data,world,id)}<section class="community-situation" aria-label="Situación de la comunidad"><span class="eyebrow">${n.checkpoint?'EN ESTE PUESTO':'EN EL RECORRIDO'}</span><p>${n.checkpoint?'Punto de control: registra recuperación y permite gestionar el equipo.':'Estación o instancia posible.'}</p>${memory.map(line=>'<p class="good">'+esc(line)+'</p>').join('')}${id==='plaza'&&world.effects.includes('guzman-01')?'<p class="good">La guardia funciona con las piezas que trajiste. Al descansar aquí, la posta pone el agua y la ración; conservas las tuyas. La recuperación y los 10 minutos son los habituales.</p>':''}${id==='heroes'?'<p>Aquí puedes hablar con Mara y el Armero. Durante un encargo debes llegar físicamente por la ruta.</p>':''}</section>${people.length?'<h3 class="community-section-title">CONTACTOS DEL REFUGIO</h3><div class="community-people">'+people.map(c=>contactCard(c,image)).join('')+'</div>':'<p class="muted">Todavía no hay contactos conocidos en este punto.</p>'}</div><div class="dialog-actions"><button data-communities>Ver refugios</button><button data-close="dialog">Volver al mapa</button></div>`,'community');
}
function contact(id){
 const c=knownContacts().find(x=>x.id===id),missions=E.knownMissions(data,world).filter(x=>x.npc===id),m=missions.find(x=>!world.paid.includes(x.id))||missions.at(-1);
 if(!c||!m)return;if(id==='jimenez'&&E.jimenezMemory(world,'vicuna').length){openJimenez();return;}if(id==='guzman'&&E.guzmanMemory(world,'leones').length){openGuzman();return;}if(id==='beatriz'&&E.beatrizMemory(world,'libertadores').length){openBeatriz();return;}if(id==='adasme'&&E.returnStatus(world)){openReturn();return;}
 open('CONTACTO DE LA COMUNIDAD',conversation({portrait:c.image,name:c.name,place:data.nodes[c.refuge]?.name,title:c.name,body:'<p>«'+esc(m.briefing)+'»</p>',note:world.location===c.refuge?'El equipo se encuentra en este refugio.':'Contacto de la red. Revisa el encargo para conocer el punto de preparación y el traslado necesario.',image})+`<div class="dialog-actions"><button data-community-node="${c.refuge}">Volver al refugio</button><button data-offer="${m.id}" class="primary">Ver encargo</button></div>`,'community');
}
function openJimenez(){
 const local=world.location==='vicuna'&&!world.run?.pending,lines=E.jimenezMemory(world,'vicuna'),canTravel=!local&&!['active','failed'].includes(world.run?.status);
 open('VICUÑA MACKENNA / OPERACIONES',conversation({portrait:data.missions['jimenez-01'].portrait,name:'Jiménez',place:local?'Vicuña Mackenna':'Informe de Los Leones',title:local?'Lo que sigue sin confirmarse':'Un informe para Jiménez',body:lines.map(line=>'<p>'+esc(line)+'</p>').join(''),note:!local?'Lleva la recepción a Vicuña Mackenna para hablar con Jiménez. El viaje usa tus suministros y puede tener encuentros; no vuelve a pagar el encargo.':'',image})+`<div class="dialog-actions"><button data-community-node="vicuna">Volver al refugio</button><button data-receipt="jimenez-01">Ver entrega</button>${canTravel?'<button data-jimenez-visit class="primary">Viajar a operaciones</button>':''}</div>`,'community');
}
function openGuzman(){
 const local=world.location==='leones'&&!world.run?.pending,lines=E.guzmanMemory(world,'leones'),canTravel=!local&&!['active','failed'].includes(world.run?.status);
 open('LOS LEONES / TALLERES',conversation({portrait:data.missions['guzman-01'].portrait,name:'Guzmán',place:local?'Los Leones':'Comprobante de Plaza',title:local?'Lo que encontró la técnica':'Una recepción para Guzmán',body:lines.map(line=>'<p>'+esc(line)+'</p>').join(''),note:!local?'Lleva la recepción a Los Leones para hablar con Guzmán. El viaje usa tus suministros y puede tener encuentros; no vuelve a pagar el encargo.':'',image})+`<div class="dialog-actions"><button data-community-node="leones">Volver al refugio</button><button data-receipt="guzman-01">Ver entrega</button>${canTravel?'<button data-guzman-visit class="primary">Viajar a los talleres</button>':''}</div>`,'community');
}
function openBeatriz(){
 const local=world.location==='libertadores'&&!world.run?.pending,lines=E.beatrizMemory(world,'libertadores'),canTravel=!local&&!['active','failed'].includes(world.run?.status);
 open('LOS LIBERTADORES / HUERTOS',conversation({portrait:data.missions['beatriz-01'].portrait,name:'Beatriz',place:local?'Los Libertadores':'Registro de la última visita',title:local?'Beatriz y el siguiente turno':'Lo que quedó en los huertos',body:lines.map(line=>'<p>'+esc(line)+'</p>').join(''),note:!local?'Para volver a hablar con Beatriz, el equipo debe viajar a Los Libertadores. Conserva sus heridas y suministros; el recorrido puede tener encuentros. La visita no entrega otro pago.':'',image})+`<div class="dialog-actions"><button data-community-node="libertadores">Volver al refugio</button><button data-receipt="beatriz-01">Ver entrega</button>${canTravel?'<button data-beatriz-visit class="primary">Viajar a los huertos</button>':''}</div>`,'community');
}
function contacts(){open('RED DE REFUGIOS',communityNetwork(data,world,image),'community');}
function restModal(){const f=E.rewardForecast(data,world);open('PUNTO DE DESCANSO',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">Recuperar al grupo</h2><p>${E.shelteredPlaza(data,world)?'La guardia de Plaza cubre al equipo y la posta pone el agua y la ración. No consumes las tuyas.':'Consume 1 ración y 1 agua.'} Recupera resistencia y 12 HP por persona. Avanza 10 minutos.</p><p class="time-warning">Pago estimado: ${f?f.amount+' créditos · plazo '+f.limit+' min.':'Sin recompensa por viaje. El descanso añade 10 minutos.'}</p></div><div class="dialog-actions"><button data-close="dialog">Seguir</button><button data-rest-confirm class="primary">Descansar</button></div>`);}
function returnEntry(){
 const status=E.returnStatus(world);if(!status)return '';
 const label=({arrival:'El regreso de Darío',waiting:'Respuesta pendiente en Los Héroes',followup:'Llegó una respuesta de Darío',closed:'Recordar el regreso de Darío'})[status.stage];
 return `<button data-return-story class="${status.stage==='arrival'||status.stage==='followup'?'primary':'text-button'}" ${status.safe?'':'disabled'}>${esc(label)}</button>`;
}
function openReturn(){
 const status=E.returnStatus(world);if(!status)return;
 if(!status.safe){announce('Termina o devuelve el viaje antes de atender esta conversación.');return;}
 const scene=E.returnScene(world),portrait=data.missions['adasme-01'].portrait;
 open('VICUÑA MACKENNA / DESPUÉS DE LA EXTRACCIÓN',conversation({portrait,name:'Adasme',place:status.local?'En Vicuña Mackenna':'Mensaje de Vicuña Mackenna',title:scene.title,body:scene.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join(''),note:scene.note,image})+`<div class="dialog-actions"><button data-close="dialog">${scene.choices.length?'Responder después':'Volver al mapa'}</button>${scene.choices.map(c=>`<button data-return-answer="${c.id}" class="primary">${esc(c.label)}</button>`).join('')}${status.stage==='waiting'&&!E.atHeroes(data,world)?'<button data-heroes>Preparar regreso a Los Héroes</button>':''}</div>`,'community');
}
const creditText=text=>String(text||'').replace(/\bfichas\b/g,'créditos').replace(/\bFichas\b/g,'Créditos');
function receipt(id=world.run?.mission){const r=world.completed[id];if(!r)return;open(id==='adasme-01'?'EXTRACCIÓN COMPLETADA':'ENCARGO ENTREGADO',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">${esc(E.assignment(data,world,id).name)}</h2>${r.narration?'<p>'+esc(r.narration)+'</p>':''}<p>«${esc(r.dialogue)}»</p><div class="outcome"><span>Pago final</span><strong>${r.amount} créditos</strong><span>${r.minutes} min · plazo ${r.timeLimit} min</span></div>${r.penalty?`<p class="bad">Demora: −${r.penalty} créditos sobre ${r.gross}.</p>`:'<p class="good">Entrega dentro del plazo: sin descuento.</p>'}<p>${esc(creditText(r.effect))}</p>${r.opened?.length?'<section class="network-progress"><h3>La entrega abrió nuevos trabajos</h3>'+r.opened.filter(id=>data.missions[id]).map(id=>'<p><strong>'+esc(data.missions[id].name)+'</strong> · '+data.routes[data.missions[id].route].edges.length+' tramos</p><p>'+esc(data.missions[id].introduction)+'</p>').join('')+'</section>':''}</div><div class="dialog-actions"><button data-close="dialog">Mapa</button><button data-catalog class="primary">Elegir próximo encargo</button>${id==='adasme-01'?returnEntry():''}${E.atHeroes(data,world)?'':'<button data-heroes>Viajar a Los Héroes</button>'}</div>`);}
function pendingModal(){if(busy)return;
 const r=world.run,p=r?.pending;if(!p||r.status!=='active')return;if(p.combat){close(dialog);renderBattle();return;}
 const e=E.eventFor(data,world);let title=e?.title||'',text=E.encounterText(data,world),art=e?.image||'../../backgrounds/station-ruins.webp';
 if(p.category==='checkpoint'){title='Un lugar para detenerse';text=p.to==='plaza'&&world.effects.includes('guzman-01')?'La torreta completa el giro. El guardia reconoce al equipo y los deja entrar mientras atiende a otro relevo. El banco que reservó Ana está libre; la posta pondrá agua y una ración si necesitan descansar.':'Llegan a '+data.nodes[p.to].name+'. Al entrar se registra el punto de control.';}else if(p.category==='rescue'){title='Darío está aquí';text=p.injured?'Darío está sentado detrás de las cajas. Intentó levantarse al oír al equipo, pero no pudo apoyar la pierna. Pide que revisen el cierre de su mochila antes de cargarlo: ahí guardó los papeles del relevo.':'Darío sale de detrás de las cajas al reconocer las voces. Puede caminar acompañado. Pregunta si el resto llegó con la carga; todavía no entiende en qué momento dejaron de esperarlo.';}else if(p.category==='delivery'){title=r.mission==='adasme-01'?'Darío vuelve a Vicuña':'El destinatario espera';text=E.mission(data,world).delivery_text;}
 if(p.category==='checkpoint'){const memory=E.communityMemory(world,p.to);if(memory.length)text+=' '+memory.join(' ');}
 const buttons=E.options(data,world).map(o=>`<button data-choice="${o.id}" ${!E.optionAvailable(world,o)?'disabled':''} class="${o.combat?'danger':''}">${esc(o.label)}</button>`).join('');
 open('EN RUTA / '+data.nodes[p.to].name,`<div class="dialog-body">${image(art,'Escena del recorrido','event-art')}<div class="eyebrow">${({quiet:'PASO TRANQUILO',decision:'DECISIÓN',hostile:'CONTACTO HOSTIL',opportunity:'HALLAZGO',checkpoint:'PUNTO DE CONTROL',rescue:'EXTRACCIÓN',delivery:r.mission==='adasme-01'?'REGRESO':'ENTREGA'})[p.category]}</div><h2 id="dialogTitle" tabindex="-1">${esc(title)}</h2><p>${esc(text)}</p><div class="choices">${buttons}</div></div>`);
}
function crewHTML(){return `<div class="crew-mini">${party().map(c=>`<button data-crew="${c.id}">${image(def(c.id).image,def(c.id).name)}<span><b>${dname(c.id)}</b><small>${c.hp}/${c.maxHp} HP · Nv. ${c.level} · Mochila ${E.bagUsed(c)}/${E.bagCapacity(data,c)}</small></span></button>`).join('')}</div>`;}
function crewModal(id=selectedCrew){
 if(busy||world.run?.pending?.combat)return;
 selectedCrew=id;close(dialog);close(itemDialog);
 $('profileLayer').classList.remove('hidden');
 if(profileView)profileView.open(id);
 else if($('profileLayer').getAttribute('src')==='about:blank')$('profileLayer').src=new URL('./profile.html?v=16-credits',import.meta.url).href;
}
function cargoModal(){
 const r=world.run,m=r?E.mission(data,world):data.missions[selected];
 open('CARGA Y SUMINISTROS',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">Inventario del viaje</h2><div class="cargo-columns"><section><h3>Carga del encargo</h3><p>${r?'Objetos destinados a la entrega.':'Carga prevista al aceptar el encargo.'} Se mantienen separados de las mochilas del equipo.</p><div id="cargo">${itemRows(r?r.cargo:m.cargo)}</div></section><section><h3>Equipo de viaje</h3><p>Suministros repartidos entre las mochilas de los Mensajeros.</p><div id="supplies">${itemRows(r?.status==='active'?r.supplies:totals())}</div></section></div></div><div class="dialog-actions"><button id="cargoCrewButton">Gestionar equipo</button><button data-close="dialog" class="primary">Volver al mapa</button></div>`);
}
let refugeView=null;
window.NeoCourierRefugeHost={data,world:()=>world,transact:apply,error:()=>$('saveStatus').textContent,
 profile:crewModal,
 close(){$('refugeLayer').classList.add('hidden');$('heroesButton').focus({preventScroll:true});},
 ready(view){refugeView=view;if(!$('refugeLayer').classList.contains('hidden'))view.open();}
};
let profileView=null;
window.NeoCourierProfileHost={data,world:()=>world,announce,
 transact(fn,...args){const ok=window.NeoCourierCombatHost.transact(fn,...args);if(!ok)profileView?.message($('saveStatus').textContent);return ok;},
 refresh:()=>render(),
 close(){$('profileLayer').classList.add('hidden');if(!$('refugeLayer').classList.contains('hidden'))refugeView?.open();else $('crewButton').focus({preventScroll:true});},
 ready(view){profileView=view;if(!$('profileLayer').classList.contains('hidden'))view.open(selectedCrew);}
};
function heroes(){
 if(!E.atHeroes(data,world)){
  if(!world.run||!['active','failed'].includes(world.run.status))open('VIAJE AL REFUGIO',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">Viajar a Los Héroes</h2><p>Sales desde ${esc(data.nodes[world.location]?.name)}. El recorrido tiene ${data.routes[E.marketJourney(data,world).route].edges.length} tramos y ${data.routes[E.marketJourney(data,world).route].edges.reduce((n,e)=>n+e.minutes,0)} minutos de desplazamiento base.</p><p>Puede haber encuentros y combates. Conservas tus mochilas y heridas; Mara y el Armero estarán disponibles al llegar.</p>${E.routeWarning(data,world,data.routes[E.marketJourney(data,world).route])?'<p class="time-warning">'+esc(E.routeWarning(data,world,data.routes[E.marketJourney(data,world).route]))+'</p>':''}</div><div class="dialog-actions"><button data-close="dialog">Cancelar</button><button data-travel-heroes class="primary">Viajar</button></div>`);
  else announce('Durante el viaje debes llegar físicamente a Los Héroes. Continúa por la ruta o devuelve el encargo para organizar el regreso.');return;
 }
 close(dialog);close(itemDialog);$('refugeLayer').classList.remove('hidden');
 if(refugeView)refugeView.open();
 else if($('refugeLayer').getAttribute('src')==='about:blank')$('refugeLayer').src=new URL('./refuge.html?v=16-credits',import.meta.url).href;
}
function help(){open('GUÍA DE ENCARGOS',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">La misma supervivencia, otro equipo</h2><div class="help-sections"><section><h3>Empieza cerca de casa</h3><p>Tu primer trabajo tiene tres tramos: Los Héroes, La Moneda, Universidad de Chile y entrega en Plaza de Armas. Para los siguientes, revisa el traslado al refugio de preparación: llegar no acepta automáticamente el encargo ni entrega su carga. Al entregar, otros contactos abrirán encargos y el mapa mostrará sus recorridos. Puedes revisar el itinerario antes de aceptar. No necesitas completar todos los encargos de una zona para avanzar: algunas entregas abren caminos alternativos.</p></section><section><h3>Combate y equipo</h3><p>La batalla usa la misma disposición de la exploración: aliados, amenazas, turno, objetivo, acciones y registro. Cada Mensajero lleva arma, protección y mochila. Puedes equipar, usar y transferir objetos. No fabrican.</p></section><section><h3>Saqueo</h3><p>Al vencer, elige quién registra cada amenaza. Cada objeto ocupa espacio y cada unidad agrega un minuto.</p></section><section><h3>Los Héroes</h3><p>Mara compra loot y vende suministros; el Armero ofrece armas y chalecos. Debes estar en Los Héroes para comerciar. Entre encargos, el regreso se recorre por el mapa y puede tener encuentros y combates. Durante un encargo puedes comprar cuando su ruta llega al refugio.</p></section><section><h3>Tiempo y recompensa</h3><p>Los minutos representan desplazamientos y acciones. Superar el plazo descuenta créditos por bloques de cinco minutos, hasta la mitad del pago. Leer o cerrar el juego no consume tiempo.</p></section><section><h3>Tomás</h3><p>Es ciego y falla más ataques. Escuchar prepara su siguiente golpe cercano; reconoce desvíos y guía retiradas. El ruido electrónico reduce esas ventajas.</p></section></div></div><div class="dialog-actions"><button data-help-done class="primary">Entendido</button></div>`);}
let combatView=null;
window.NeoCourierCombatHost={data,world:()=>world,announce,
 transact(fn,...args){try{if(loadError)throw Error(warning);world=fn(data,world,...args);save();return true;}catch(error){announce(error.message);return false;}},
 refresh:()=>render(),ready(view){combatView=view;renderBattle();}
};
window.NeoCourierVisibility=active=>combatView?.setActive(active);
$('battleLayer').src=new URL('./combat.html?v=1',import.meta.url).href;
function renderBattle(){
 const active=world.run?.status==='active'&&!!world.run?.pending?.combat;
 $('battleLayer').classList.toggle('hidden',!active);
 if(active){close(dialog);close(itemDialog);}
 combatView?.sync();
}
function pathFor(edge){const a=data.nodes[edge.from],b=data.nodes[edge.to];return edge.path||`M${a.x} ${a.y}L${b.x} ${b.y}`;}
function svgEl(tag,attrs){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
function knownContacts(){return knownCommunityContacts(data,world);}
function counted(n,one,many){return n+' '+(n===1?one:many);}
function progressHTML(){return `<section class="network-progress" aria-label="Progreso de la red"><span class="eyebrow">LA RED QUE VAS ABRIENDO</span><p><strong>${counted(world.paid.length,'entrega','entregas')}</strong> · ${counted(E.knownMissions(data,world).length,'encargo conocido','encargos conocidos')} · ${counted(world.progression.visited.length,'lugar visitado','lugares visitados')}</p><p>${esc(E.nextLead(data,world))}</p></section>`;}
function fitMap(){
 const nodes=E.knownNodes(data,world).map(id=>data.nodes[id]),xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y);
 const width=Math.max(420,Math.max(...xs)-Math.min(...xs)+180)/zoom,height=Math.max(240,Math.max(...ys)-Math.min(...ys)+150)/zoom;
 const current=data.nodes[world.location]||data.nodes.heroes,cx=zoom>1?current.x:(Math.min(...xs)+Math.max(...xs))/2,cy=zoom>1?current.y:(Math.min(...ys)+Math.max(...ys))/2;
 svg.setAttribute('viewBox',`${cx-width/2} ${cy-height/2} ${width} ${height}`);
 $('mapZoomValue').textContent=Math.round(zoom*100)+'%';
 $('zoomOut').disabled=zoom<=1;$('zoomIn').disabled=zoom>=2.5;
}
function mapRender(){
 const m=world.run?E.mission(data,world):data.missions[selected],rt=data.routes[m.route];layer.replaceChildren();
 $('mapNetworkCount').textContent=String(E.knownNodes(data,world).length).padStart(2,'0')+' puntos';
 $('mapDestination').textContent=data.nodes[rt.nodes.at(-1)].name;
 $('mapDestination').title=data.nodes[rt.nodes.at(-1)].name;
 const drawn=new Set();for(const mission of E.knownMissions(data,world))for(const e of data.routes[mission.route].edges){const key=[e.from,e.to].sort().join(':');if(drawn.has(key))continue;drawn.add(key);layer.append(svgEl('path',{d:pathFor(e),class:'route-known',fill:'none'}));}
 rt.edges.forEach((e,i)=>{if(i>=(world.run?.startIndex||0))layer.append(svgEl('path',{d:pathFor(e),class:'route-selected',fill:'none','data-edge':i}));});
 E.knownNodes(data,world).forEach(id=>{const n=data.nodes[id],visited=world.progression.visited.includes(id),el=svgEl(n.checkpoint?'rect':'circle',n.checkpoint?{x:n.x-7,y:n.y-7,width:14,height:14}:{cx:n.x,cy:n.y,r:5});el.setAttribute('class',(n.checkpoint?'control-point':'instance-point')+(visited?' visited':''));el.setAttribute('role','button');el.setAttribute('aria-label',n.name+(visited?' · visitado':' · recorrido abierto'));const title=svgEl('title',{});title.textContent=n.name;el.append(title);el.setAttribute('tabindex','0');el.addEventListener('click',()=>nodeInfo(id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();nodeInfo(id);}});layer.append(el);
 const dense=n.line==='L4',left=n.x>=977,label=svgEl('text',{x:dense?n.x+(left?-12:12):n.x,y:dense?n.y+4:n.y+(id==='moneda'?30:-18),class:'route-station-label back','text-anchor':dense?(left?'end':'start'):'middle'});label.textContent=n.name;layer.append(label);
 });
 {const r=world.run,n=data.nodes[r?.pending&&!busy?r.pending.to:!r||!['active','failed'].includes(r.status)?world.location:rt.nodes[r.index]],marker=svgEl('circle',{cx:n.x,cy:n.y,r:9,class:'messenger'});marker.id='messenger';layer.append(marker);}
 fitMap();
}
function render(){
 const r=world.run,m=r?E.mission(data,world):data.missions[selected],node=r&&['active','failed'].includes(r.status)?E.here(data,world):data.nodes[world.location]||data.nodes[data.routes[m.route].nodes[0]],forecast=r?E.rewardForecast(data,world):null;
 if($('networkProgress'))$('networkProgress').innerHTML=progressHTML();
 $('brief').innerHTML=`<div class="mission-portrait">${image(m.portrait,m.issuer)}<span class="portrait-name">${esc(m.issuer)}</span></div><span class="chip">${r?({active:'EN CURSO',completed:m.type==='travel'?'EN DESTINO':m.id==='adasme-01'?'DE REGRESO':'ENTREGADO',failed:'VIAJE INTERRUMPIDO',abandoned:m.type==='travel'?'VIAJE DETENIDO':'DEVUELTO'})[r.status]:'DISPONIBLE'}</span><h2>${esc(m.name)}</h2><p>${esc(m.summary)}</p>${m.type==='travel'?'<button class="primary" data-journey-route>Ver recorrido</button>':'<button class="primary" data-offer="'+m.id+'">Ver encargo</button>'}${r&&['active','failed'].includes(r.status)?'<button class="text-button" data-abandon>'+(m.type==='travel'?'Detener viaje':'Devolver encargo')+'</button>':''}`;
 $('brief').insertAdjacentHTML('beforeend',returnEntry());
 $('location').textContent=r?.pending?(busy?'En tránsito a ':'')+data.nodes[r.pending.to].name:node.name;mapRender();$('crewSummary').innerHTML=crewHTML();const count=stock=>Object.values(stock||{}).reduce((n,q)=>n+q,0);$('cargoSummary').textContent=counted(count(r?r.cargo:m.cargo),'objeto de entrega','objetos de entrega')+' · '+count(r?.status==='active'?r.supplies:totals())+' suministros';
 $('status').innerHTML=r?`<div class="meter-label"><span>Resistencia</span><b>${r.condition}%</b></div><div class="progress"><span style="width:${r.condition}%"></span></div>${forecast?`<div class="deadline ${forecast.penalty?'late':''}"><span>${forecast.minutes} / ${forecast.limit} min</span><b>Pago estimado ${forecast.amount} créditos</b><small>${forecast.penalty?'Descuento actual −'+forecast.penalty:'Dentro del plazo'}</small></div>`:`<div class="deadline"><span>${r.minutes} min de viaje</span><b>Destino: ${esc(data.nodes[m.destination||'heroes'].name)}</b><small>${m.purpose==='assignment'?'El encargo se acepta al llegar':m.purpose==='visit'?'Visita a los huertos · sin pago':'Mercado disponible al llegar'}</small></div>`}<div class="status-data"><div>Combates<b>${r.combats}</b></div><div>Evitados<b>${r.evaded}</b></div><div>Créditos<b>${world.credits}</b></div></div>`:`<p>${world.location==='heroes'?'El equipo está en Los Héroes.':'Viaja a Los Héroes para preparar al equipo.'}</p><b>${world.credits} créditos</b>`;
 const edge=r?E.nextEdge(data,world):null,risk=edge?E.effectiveRisk(data,world,edge):'low';
 $('travel').innerHTML=!r?'<p>Consulta los encargos o visita Los Héroes.</p><button data-catalog class="primary">Consultar encargos</button>':r.status==='completed'?(m.type==='travel'?'<p class="good">Llegaste a '+esc(data.nodes[m.destination||'heroes'].name)+'.</p>'+(m.purpose==='visit'?'<button data-contact="'+(m.visitContact||'beatriz')+'" class="primary">Hablar con '+(m.visitContact==='jimenez'?'Jiménez':m.visitContact==='guzman'?'Guzmán':'Beatriz')+'</button>':m.assignment?'<button data-offer="'+m.assignment+'" class="primary">Revisar encargo de '+esc(m.issuer)+'</button>':'<button data-heroes class="primary">Hablar con Mara / Armero</button>')+'<button data-catalog>Consultar encargos</button>':'<p class="good">'+(m.id==='adasme-01'?'El grupo volvió con Darío.':'Encargo entregado.')+'</p><button data-receipt="'+r.mission+'" class="primary">Ver resultado</button><button data-catalog>Elegir próximo encargo</button>'):r.status==='failed'?'<p>El grupo no puede continuar.</p><button id="retryButton" class="primary">Reintentar desde '+esc(data.nodes[r.checkpoint.node].name)+'</button>':r.status==='abandoned'?'<p>'+(m.type==='travel'?'Viaje detenido en '+esc(world.location&&data.nodes[world.location].name)+'.':'Encargo devuelto.')+'</p><button data-heroes class="primary">Viajar a Los Héroes</button>':`<div class="eyebrow">${esc(E.sectors[E.sectorFor(node.id)].name)}</div>${E.currentPurpose(data,world)?'<p class="travel-purpose"><strong>Ahora:</strong> '+esc(E.currentPurpose(data,world))+'</p>':''}<div class="travel-head"><span>${r.index-(r.startIndex||0)}/${E.route(data,world).edges.length-(r.startIndex||0)} · próximo tramo ${edge?.minutes||0} min</span><span class="risk-${risk}">Amenaza ${risks[risk]}</span></div><div class="progress"><span style="width:${100*(r.index-(r.startIndex||0))/(E.route(data,world).edges.length-(r.startIndex||0))}%"></span></div><div class="travel-actions"><button id="advanceButton" class="primary" ${busy?'disabled':''}>${r.pending?'Resolver instancia':'Avanzar a '+esc(data.nodes[edge.to].name)}</button>${!r.pending?'<button id="advanceUntilButton" title="Se detiene ante decisiones y descansos. Conserva el tiempo y el desgaste del recorrido.">Viajar hasta el próximo encuentro</button>':''}${!r.pending&&node.rest?'<button id="restButton">Descansar · 10 min</button>':''}${!r.pending&&node.id==='heroes'?'<button data-heroes>Hablar con Mara / Armero</button>':''}</div>`;
 if(r?.lastEncounter)$('travel').insertAdjacentHTML('afterbegin','<section class="travel-outcome" tabindex="0" aria-label="Resultado del encuentro" aria-live="polite"><strong>'+esc(r.lastEncounter.title)+'</strong><p>'+esc(r.lastEncounter.text)+'</p></section>');
 $('journal').innerHTML=(r?.log||['La red de encargos espera.']).slice(-10).map(x=>'<p>'+esc(creditText(x))+'</p>').join('');renderBattle();
}
async function animateAdvance(brisk=false){
 if(busy)return;
 if(world.run?.pending){pendingModal();return;}
 busy=true;
 if(!apply(E.advance)){busy=false;render();return;}
 if(world.run.status!=='active'){busy=false;render();return;}
 const run=world.run,pending=run.pending,destination=data.nodes[pending.to];
 const current=()=>world.run===run&&run.pending===pending&&run.status==='active';
 const marker=$('messenger'),path=layer.querySelector('[data-edge="'+run.index+'"]');
 $('advanceButton').disabled=true;$('advanceButton').textContent='En camino a '+destination.name+'…';
 try{
  const arrived=await animateRoute({path,marker,destination,brisk,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,isCurrent:current});
  busy=false;
  if(arrived&&current()){
   if(E.passageReady(data,world)){const passage=E.eventFor(data,world);if(apply(E.choose,'continue')){announce(passage.text);if(brisk&&world.run.status==='active'&&!E.here(data,world).checkpoint&&!E.here(data,world).rest){await animateAdvance(true);}else $('advanceButton')?.focus({preventScroll:true});}}
   else{render();pendingModal();}
  }
 }catch(error){busy=false;render();announce('No se pudo mostrar el recorrido. Pulsa Resolver instancia para continuar.');}
}
document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||busy)return;
 if(b.dataset.approach){approach(b.dataset.approach);return;}if(b.dataset.startApproach){if(apply(E.travelToMission,b.dataset.startApproach)){close(dialog);announce('Viaje iniciado. El encargo se acepta al llegar.');}return;}
 if(b.hasAttribute('data-jimenez-visit')){if(apply(E.visitJimenez)){close(dialog);announce('Viaje a operaciones iniciado.');}return;}
 if(b.hasAttribute('data-guzman-visit')){if(apply(E.visitGuzman)){close(dialog);announce('Viaje a los talleres iniciado.');}return;}
 if(b.hasAttribute('data-beatriz-visit')){if(apply(E.visitBeatriz)){close(dialog);announce('Viaje a los huertos iniciado.');}return;}
 if(b.hasAttribute('data-return-story')){openReturn();return;}if(b.dataset.returnAnswer){if(apply(E.answerReturn,b.dataset.returnAnswer))openReturn();return;}
 if(b.dataset.close){close($(b.dataset.close));return;}if(b.dataset.item){itemModal(b.dataset.item);return;}if(b.hasAttribute('data-catalog')||b.id==='catalogButton'){catalog();return;}if(b.dataset.offer){offer(b.dataset.offer);return;}if(b.dataset.accept){if(apply(E.start,b.dataset.accept)){close(dialog);announce('Encargo aceptado.');}return;}if(b.hasAttribute('data-resume')){close(dialog);return;}if(b.dataset.receipt){receipt(b.dataset.receipt);return;}
 if(b.dataset.choice){
  if(apply(E.choose,b.dataset.choice)){
   close(dialog);sound('ui/click-metal.mp3');
   if(world.run?.pending?.combat)renderBattle();
   else if(world.run?.status==='completed'&&E.mission(data,world).type!=='travel')receipt();
   else if(world.run?.status==='active'&&world.run.pending)pendingModal();
   else ($('advanceButton')||$('retryButton'))?.focus({preventScroll:true});
  }
  return;
 }
 if(b.id==='advanceUntilButton'){animateAdvance(true);return;}if(b.id==='advanceButton'){animateAdvance();return;}if(b.id==='routeButton'||b.hasAttribute('data-journey-route')){displayRoute();return;}if(b.id==='restButton'){restModal();return;}if(b.hasAttribute('data-rest-confirm')){if(apply(E.rest))close(dialog);return;}if(b.id==='retryButton'){apply(E.retry);return;}
 if(b.hasAttribute('data-abandon')){if(E.mission(data,world).type==='travel'){open('DETENER VIAJE',`<div class="dialog-body"><h2 id="dialogTitle">¿Detener el viaje?</h2><p>El grupo permanece en ${esc(E.here(data,world).name)}. Conserva sus heridas, objetos y la vigilancia del corredor.</p></div><div class="dialog-actions"><button data-close="dialog">Seguir</button><button data-abandon-confirm class="danger">Detener</button></div>`);return;}open('DEVOLVER ENCARGO',`<div class="dialog-body"><h2 id="dialogTitle">¿Devolver el encargo?</h2><p>No habrá pago. La vigilancia provocada permanece.</p></div><div class="dialog-actions"><button data-close="dialog">Seguir</button><button data-abandon-confirm class="danger">Devolver</button></div>`);return;}if(b.hasAttribute('data-abandon-confirm')){if(apply(E.abandon))close(dialog);return;}
 if(b.dataset.previewRoute){displayRoute(b.dataset.previewRoute);return;}if(b.dataset.communityNode){nodeInfo(b.dataset.communityNode);return;}if(b.hasAttribute('data-communities')){contacts();return;}if(b.dataset.contact){contact(b.dataset.contact);return;}if(b.id==='contactsButton'){contacts();return;}
 if(b.id==='crewButton'||b.id==='cargoCrewButton'){crewModal();return;}if(b.dataset.crew){crewModal(b.dataset.crew);return;}if(b.id==='cargoButton'){cargoModal();return;}
 if(b.id==='heroesButton'||b.hasAttribute('data-heroes')){heroes();return;}if(b.hasAttribute('data-travel-heroes')){if(apply(E.travelHeroes)){selectedVendor='mara';close(dialog);announce('Viaje iniciado. Avanza por el mapa hasta Los Héroes.');}return;}if(b.dataset.vendor){selectedVendor=b.dataset.vendor;heroes();return;}if(b.dataset.shopMember){selectedCrew=b.dataset.shopMember;heroes();return;}if(b.dataset.buy){if(apply(E.buy,b.dataset.buy,b.dataset.member))heroes();return;}if(b.dataset.sell){if(apply(E.sell,b.dataset.sell,b.dataset.member))heroes();return;}if(b.hasAttribute('data-recover')){if(apply(E.recover))heroes();return;}
 if(b.id==='journalButton'){open('REGISTRO DE VIAJE',`<div class="dialog-body"><h2 id="dialogTitle" tabindex="-1">El recorrido del grupo</h2>${(world.run?.log||['La red de encargos espera.']).map(x=>'<p>'+esc(creditText(x))+'</p>').join('')}</div><div class="dialog-actions"><button data-close="dialog" class="primary">Volver al mapa</button></div>`);return;}
 if(b.id==='helpButton'){help();return;}if(b.hasAttribute('data-help-done')){world.helpSeen=true;save();close(dialog);return;}
 if(b.id==='resetCouriers'){open('REINICIAR ENCARGOS',`<div class="dialog-body"><h2 id="dialogTitle">¿Reiniciar?</h2><p>Se borrará el progreso de Los Mensajeros. La expedición conservará los informes que ya recibió y sus ayudas usadas; repetir una entrega no las repone.</p></div><div class="dialog-actions"><button data-close="dialog">Cancelar</button><button data-reset-confirm class="danger">Reiniciar</button></div>`);return;}if(b.hasAttribute('data-reset-confirm')){world=E.createWorld(data,{seed:crypto.getRandomValues(new Uint32Array(1))[0]});loadError=false;selected='relevo-01';zoom=1;save();render();catalog();return;}
 if(['zoomIn','zoomOut','resetMap'].includes(b.id)){zoom=b.id==='resetMap'?1:Math.max(1,Math.min(2.5,zoom+(b.id==='zoomIn'?.25:-.25)));fitMap();}
});
$('bootStatus').hidden=!loadError;render();if(loadError)announce(warning);else if(!world.helpSeen)help();else if(!world.run)catalog();window.NeoCourierBack=()=>{if(!$('profileLayer').classList.contains('hidden')){if(profileView)return profileView.back();window.NeoCourierProfileHost.close();return true;}if(!$('battleLayer').classList.contains('hidden'))return combatView?.back()??true;if(!$('refugeLayer').classList.contains('hidden')){if(refugeView)return refugeView.back();window.NeoCourierRefugeHost.close();return true;}if(itemDialog.open){close(itemDialog);return true;}if(dialog.open){close(dialog);return true;}return false;};
