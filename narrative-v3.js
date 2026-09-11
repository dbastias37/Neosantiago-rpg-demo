"use strict";
// Stage 1: authored route, persistent facts and graph use the same scene definitions.
function narrativeState(){
  if(!state.narrative||state.narrative.version!==1)state.narrative={version:1,routes:{}};
  return state.narrative;
}
function narrativeRouteLog(id){var n=narrativeState();return n.routes[id]||(n.routes[id]={visited:[],choices:[],completed:false})}
function narrativeNormalize(){
  var f=state.flags;
  if(f.unit7Shutdown){f.unit7Ally=false;f.unit7Infiltrated=false;f.unit7Sheltered=false}
  if(f.line1OfficiallyRegistered&&(f.h12Line1Hidden||f.h12CommuneBlind)){f.line1ConcealmentRevoked=true;f.h12Line1Hidden=false}
  if(f.liraBrotherLost){f.liraBrotherRecovered=false;f.liraPartialTrust=false;f.liraDistrust=true}
  if(f.tookLivingCore||f.betrayedLira){f.liraDead=true;f.savedMerodeadora=false;f.liraTrust=false}
  if(f.liraDistrust||f.liraDead){f.liraAlliance=false;f.liraSafeRoute=false;f.exilesReturnAid=false}
}
function narrativeBlocked(c){
  var q=c.narrativeRequires,f=state.flags;if(!q)return false;
  return !!((q.all&&!q.all.every(function(k){return !!f[k]}))||(q.any&&!q.any.some(function(k){return !!f[k]}))||(q.none&&q.none.some(function(k){return !!f[k]})));
}
var narrativeMapRoute="liraExiledCore";
function narrativeVisit(id,index){
  var def=routeNarrativeDef(id);if(!def||!def.graphVersion)return;
  var log=narrativeRouteLog(id),scene=def.scenes[index];if(log.visited.indexOf(scene.id)<0)log.visited.push(scene.id);log.closed=log.closed||{};log.closed[scene.id]=scene.options.filter(function(o){return narrativeBlocked(o)}).map(function(o){return {id:o.id,reason:o.closedReason||"Este camino no está disponible por lo ocurrido antes."}});
}
function narrativeRecord(id,index,opt){
  var def=routeNarrativeDef(id);if(!def||!def.graphVersion)return;
  var log=narrativeRouteLog(id);if(log.choices.indexOf(opt.id)<0)log.choices.push(opt.id);if(opt.end)log.completed=true;
}
(function defineLiraChapter(){
  var def=routeNarrativeDefs.liraExiledCore,clinic=def.scenes[1],recovery=def.scenes[2];def.graphVersion=1;
  def.scenes[0].lines=["Lira se detiene ante una luz roja y nos obliga a agacharnos. Hay una camilla volcada junto al riel. Tiene sangre seca en una de las correas.","«Lo trajeron por aquí ayer. Mi hermano lleva una placa en el pecho, como yo. Si ven una luz azul, no disparen». Sara le pregunta si puede caminar. Lira tarda en contestar: «Cuando se lo llevaron, sí». Noa mira el sensor. «Primero tenemos que pasar esto». "];
  clinic.lines=["El hombre de la camilla respira con ayuda de una máquina. Lira le toma la mano. Él aprieta un dedo, apenas. Sara aparta a Elías del conector: «Ese núcleo también mantiene su corazón. No lo desenchufes». ","La sala de recuperación está al otro lado del corredor. Sara puede prepararlo con medicina; Elías puede alimentar el soporte durante el traslado con una batería. El terminal ofrece otra posibilidad: abrir el registro para buscar un acceso de emergencia. «Está conectado a UNO», advierte Elías. Lira sigue sosteniendo la mano de su hermano. «Díganme qué necesitan. Pero sáquenlo de aquí». "];
  clinic.options[0].nextScene=2;clinic.options[1].nextScene=3;clinic.options[2].nextScene=4;
  clinic.options[2].victory.result="La patrulla cae. Elías encuentra un soporte de emergencia bajo la camilla y lo conecta antes de cortar la alimentación de la clínica. Pueden mover al herido, pero la descarga ha quemado el lector de recuerdos.";
  recovery.lines=["Sara conecta la camilla al soporte de la cámara y comprueba dos veces la respiración. «Ya podemos dejar de correr». Lira se sienta en el suelo, junto a su hermano, sin soltarle la mano.","Él abre los ojos cuando Elías enciende el lector. Aparecen nombres y un camino hacia Nodo 14. «¿Quieres que lo apague?», pregunta Sara. El hombre asiente. Lira mira a Elías: «Ya viste por dónde seguir. Déjalo descansar». La copia todavía es posible, pero él acaba de decir que no."];
  var protect=recovery.options[0],copy=recovery.options[1],extract=recovery.options[2];
  protect.label="Apagar el lector y ayudar a Lira";protect.hint="Su hermano se queda conectado al soporte de recuperación.";
  protect.result="Elías apaga la proyección. Sara acomoda una manta bajo la nuca del herido. Antes de despedirse, Lira dibuja el acceso a Nodo 14 en un trozo de cartón. «Si llegan a la cámara de la torre, digan que vienen conmigo». Noa guarda el cartón sin doblarlo.";
  copy.label="Copiar el registro pese a su negativa";copy.hint="El lector puede copiarlo sin extraer el núcleo, pero enviará una identificación a UNO.";
  copy.result="«Te pidió que pararas». Lira desconecta el lector cuando termina la copia. Su hermano sigue respirando. Elías guarda los nombres y la ruta, pero ella se queda junto a la camilla. «No voy a guiarlos. Ya tienen lo que vinieron a buscar».";
  copy.flags.liraDistrust=true;copy.flags.liraPartialTrust=false;
  extract.label="Desconectar el núcleo y llevárselo";extract.hint="Sin el núcleo, su hermano morirá. Lira está junto a la camilla.";
  extract.result="Sara dice «no» antes de que el conector se suelte. La máquina pierde el ritmo. Lira intenta reconectarla, primero con las manos y después con todo su peso sobre la camilla. El núcleo cabe en la mochila. Cuando se marchan, ella todavía no se ha vuelto a mirarlos.";
  function clone(o){return JSON.parse(JSON.stringify(o))}
  var portable=clone(recovery);portable.title="Hasta que vuelva la corriente";portable.lines=["La batería llega a la cámara con el indicador parpadeando. Elías busca una toma compatible mientras Sara sostiene el conector contra el pecho del herido. «No lo muevas ahora». Lira arrastra la camilla hasta el soporte de pared.","El corazón recupera su ritmo. El lector de archivos permanece apagado: la batería no alcanza para las dos cosas. Lira saca un lápiz. «La ruta puedo dibujarla yo. Dejen que esta máquina haga lo suyo». "];portable.options=[clone(protect),clone(extract)];portable.options[0].label="Conectar el soporte y guardar la ruta de Lira";portable.closedPaths="La batería se agotó durante el traslado. El lector de recuerdos no tiene alimentación.";
  var forced=clone(recovery);forced.title="El lector quemado";forced.lines=["Elías llega con el soporte de emergencia pegado a la camilla. Sara lo conecta a la pared. Detrás quedan los disparos, una puerta doblada y el terminal que usaron para abrir el registro.","Lira señala el cable fundido del lector. «Nos encontraron por eso». Elías empieza a explicar cómo se propagó la señal y se detiene. «Lo sé. Lo siento». Ella aparta la mirada. «Ayuda a Sara. Después hablamos». Los recuerdos ya no pueden copiarse aquí."];forced.options=[clone(protect),clone(extract)];forced.options[0].label="Ayudar a Sara a terminar el rescate";forced.options[0].result="Elías sostiene el soporte mientras Sara asegura los cables. Lira espera a que su hermano vuelva a apretarle un dedo. Luego dibuja la ruta. «Váyanse por aquí. No prometo ir con ustedes». El grupo sale con un camino y una conversación pendiente.";forced.options[0].flags={liraBrotherRecovered:true,liraPartialTrust:true};forced.closedPaths="La conexión con UNO quemó el lector durante el asalto. Los recuerdos no pueden copiarse aquí.";
  portable.lines.push(portable.closedPaths);forced.lines.push(forced.closedPaths);
  def.scenes.push(portable,forced);
  var ids=["tunnel","clinic","recovery","portable","damaged"];
  def.scenes.forEach(function(scene,i){scene.id="lira."+ids[i];scene.untimed=true;scene.graphColumn=i<2?i:2;scene.options.forEach(function(opt,j){opt.id=scene.id+"."+j;opt.narrativeRequires={none:["liraDead","liraBrotherLost","liraRescueAbandoned"]}})});
})();
function narrativeRouteFailure(route){
  if(!route||route.id!=="liraExiledCore")return "";
  narrativeRouteLog(route.id).interrupted=true;state.flags.liraRescueAbandoned=true;
  state.index=Math.min(state.index+1,events.length-1);
  return "Sara arrastra a Elías hacia la salida. Noa cierra la puerta mientras Lira se queda al otro lado. No pueden volver a entrar con la patrulla encima. Al llegar al refugio, ninguno sabe si logró sacar a su hermano. El rescate quedó interrumpido; esa oportunidad no se repetirá.";
}
function narrativeEvent(ev){
  narrativeNormalize();var f=state.flags;
  if(ev.title==="El núcleo expuesto"&&(f.liraBrotherRecovered||f.liraBrotherLost)){
    ev=Object.assign({},ev,{text:f.liraBrotherLost?"Lira está herida junto a una camilla. Reconoce al grupo y busca su arma. «No se acerquen». Sara se detiene en la puerta: el hermano que dejaron morir no está aquí, y ninguna venda va a borrar aquello.":"Lira ha vuelto a la clínica a buscar material para su hermano. Una patrulla la alcanzó antes de que pudiera salir. Sara reconoce la tela con que sujetaron juntos el soporte. Lira señala la herida: «Él está a salvo. Ahora ayúdame a cerrar esto»."});
  }
  if(ev.title==="Los exiliados regresan"){
    ev=Object.assign({},ev,{choices:ev.choices.map(function(c){
      if(!(c.flags&&c.flags.exileAlliance))return c;
      return Object.assign({},c,{narrativeRequires:{none:["liraDead","liraDistrust","liraBrotherLost"]}});
    })});
    if(f.liraDead)ev.text="Los exiliados llegan sin Lira. Uno reconoce el núcleo que el grupo le quitó en la clínica. «Eso era lo que la mantenía viva». Nadie baja las armas. Elías deja de buscar en sus archivos: estos hombres no están pidiendo una prueba.";
  }
  return ev;
}
// No inferred playthrough for legacy saves: only actions recorded by this version are highlighted.
function narrativeGraph(id){
  if(id==="towerFinale"&&typeof finaleGraph==="function")return finaleGraph();
  var def=routeNarrativeDef(id),log=(state.narrative&&state.narrative.routes[id])||{visited:[],choices:[]},nodes=[],edges=[];
  def.scenes.forEach(function(s){
    var seen=log.visited.indexOf(s.id)>=0;
    nodes.push({id:s.id,column:s.graphColumn,label:seen?s.title:"Escena no descubierta",seen:seen,status:seen?"Visitada":"Sin descubrir"});
    s.options.forEach(function(o){var blocked=!!(log.closed&&log.closed[s.id]&&log.closed[s.id].some(function(b){return b.id===o.id})),chosen=log.choices.indexOf(o.id)>=0,target=o.end?o.id+".end":def.scenes[o.nextScene].id;
      if(o.end)nodes.push({id:target,column:3,label:chosen?o.label:blocked?"Camino cerrado":"Desenlace no descubierto",seen:chosen,status:chosen?"Vivido":blocked?"No disponible en esa escena":"Sin descubrir"});
      edges.push({from:s.id,to:target,label:seen?o.label:"",chosen:chosen,combat:!!o.combat,blocked:blocked});
    });
  });
  return{title:def.title,nodes:nodes,edges:edges,legacy:!state.narrative||!state.narrative.routes[id],completed:!!log.completed,interrupted:!!log.interrupted,closed:log.closed||{}};
}
function drawNarrativeMap(canvas,id){
  var links=(typeof narrativeLinks==="undefined"?[]:narrativeLinks).filter(function(link){return state.flags[link.flag]&&(link.from===id||link.to===id)});
  var graph=narrativeGraph(id),ctx=canvas.getContext("2d"),width=2400,height=1500+links.length*65;
  canvas.width=width;canvas.height=height;ctx.fillStyle="#101b22";ctx.fillRect(0,0,width,height);
  ctx.fillStyle="#e9e7dc";ctx.font="bold 42px sans-serif";ctx.fillText("NEOSANTIAGO 2130 · MAPA DE DECISIONES",70,82);
  ctx.font="28px sans-serif";ctx.fillText(graph.title+" · "+(graph.interrupted?"Ruta interrumpida":graph.completed?"Ruta completada":"Recorrido registrado"),70,131);
  ctx.font="22px sans-serif";ctx.fillStyle="#a9bcc6";ctx.fillText("Trazo claro: acción elegida · Trazo gris: alternativa · Los nombres desconocidos permanecen ocultos",70,177);
  var columns=[[],[],[],[]],positions={};graph.nodes.forEach(function(n){columns[n.column].push(n)});
  columns.forEach(function(list,col){list.forEach(function(n,row){positions[n.id]={x:70+col*585,y:240+(row+.5)*(1120/list.length)-58}})});
  graph.edges.slice().sort(function(a,b){return Number(a.chosen)-Number(b.chosen)}).forEach(function(e){var a=positions[e.from],b=positions[e.to];ctx.beginPath();ctx.moveTo(a.x+420,a.y+58);ctx.bezierCurveTo(a.x+505,a.y+58,b.x-85,b.y+58,b.x,b.y+58);ctx.strokeStyle=e.chosen?"#70d5e1":"#394b57";ctx.lineWidth=e.chosen?5:2;ctx.stroke();ctx.beginPath();ctx.moveTo(b.x,b.y+58);ctx.lineTo(b.x-10,b.y+52);ctx.lineTo(b.x-10,b.y+64);ctx.closePath();ctx.fillStyle=ctx.strokeStyle;ctx.fill()});
  function wrap(text,x,y,max){var words=text.split(/\s+/),line="",row=0;words.forEach(function(w){if(ctx.measureText(line+w).width>max&&line){ctx.fillText(line.trim(),x,y+row*27);line="";row++}line+=w+" "});ctx.fillText(line.trim(),x,y+row*27)}
  graph.nodes.forEach(function(n){var p=positions[n.id];ctx.fillStyle=n.seen?"#193a44":"#192730";ctx.fillRect(p.x,p.y,420,116);ctx.strokeStyle=n.seen?"#70d5e1":"#475c68";ctx.lineWidth=2;ctx.strokeRect(p.x,p.y,420,116);ctx.fillStyle=n.seen?"#e9f5f5":"#a9bcc6";ctx.font="bold 23px sans-serif";wrap(n.label,p.x+18,p.y+31,384);ctx.font="18px sans-serif";ctx.fillStyle="#a9bcc6";ctx.fillText(n.status,p.x+18,p.y+99);var selected=graph.edges.filter(function(e){return e.from===n.id&&e.chosen}).map(function(e){return e.label});if(selected.length){ctx.font="20px sans-serif";ctx.fillStyle="#70d5e1";wrap(selected.join(" · "),p.x+4,p.y+145,416)}});
  ctx.font="20px sans-serif";ctx.fillStyle="#a9bcc6";ctx.fillText("Mapa del capítulo · Las conexiones representan la ruta; elegir un combate no garantiza alcanzar la escena siguiente.",70,1430);
  if(graph.legacy)ctx.fillText("Sin registro de esta ruta: las partidas anteriores conservan sus consecuencias, pero no reconstruyen decisiones no guardadas.",70,1465);
  links.forEach(function(link,i){ctx.fillStyle="#70d5e1";ctx.font="22px sans-serif";ctx.fillText("Conexión vivida · "+link.text,70,1530+i*65)});
  return graph;
}
function downloadDecisionMap(){
  try{var canvas=document.createElement("canvas");var selectedRoute=narrativeMapRoute;drawNarrativeMap(canvas,selectedRoute);canvas.toBlob(function(blob){
    if(!blob){toast("No se pudo preparar la imagen. Inténtalo de nuevo.");return}
    var url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="NeoSantiago-mapa-de-decisiones-"+(selectedRoute==="liraExiledCore"?"Lira":selectedRoute==="towerFinale"?"Desenlace":selectedRoute)+".png";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},30000);
  },"image/png")}catch(e){toast("No se pudo descargar el mapa en este navegador.")}
}
function narrativeMapPanel(){
  var graph=narrativeGraph(narrativeMapRoute),selectors=Object.keys(routeNarrativeDefs).map(function(id){return '<option value="'+esc(id)+'" '+(id===narrativeMapRoute?'selected':'')+'>'+esc(routeNarrativeDefs[id].title)+'</option>'}).join("");
  if(typeof finaleGraph==="function")selectors+='<option value="towerFinale" '+(narrativeMapRoute==="towerFinale"?'selected':'')+'>El desenlace de la torre</option>';
  var connections=(typeof narrativeLinks==="undefined"?[]:narrativeLinks).filter(function(link){return state.flags[link.flag]&&(link.to===narrativeMapRoute||link.from===narrativeMapRoute)});
  var closed=Object.keys(graph.closed).map(function(id){return graph.closed[id].map(function(b){return '<p>'+esc(b.reason)+'</p>'}).join("")}).join("");
  return '<article class="drawer-item"><strong>Mapa de decisiones</strong><p>Elige un capítulo para ver y descargar tu recorrido. Los nombres de escenas desconocidas permanecen ocultos.</p><label for="decisionMapChapter">Capítulo</label><select id="decisionMapChapter">'+selectors+'</select><button id="downloadDecisionMap">Descargar mapa de decisiones PNG</button></article><div style="overflow-x:auto"><canvas id="decisionMapPreview" role="img" aria-label="Mapa horizontal del capítulo. Recorrido y conexiones descritos debajo." style="width:960px;max-width:none;height:600px"></canvas></div>'+connections.map(function(link){return '<article class="drawer-item"><strong>Una decisión anterior tuvo efecto aquí</strong><p>'+esc(link.text)+'</p></article>'}).join("")+(closed?'<article class="drawer-item"><strong>Caminos que quedaron cerrados</strong>'+closed+'</article>':'')+graph.nodes.filter(function(n){return n.seen}).map(function(n){return '<article class="drawer-item"><strong>'+esc(n.label)+'</strong><p>'+esc(graph.edges.filter(function(e){return e.from===n.id&&e.chosen}).map(function(e){return e.label+(e.combat?" (intento con combate)":"")}).join("; ")||n.status)+'</p></article>'}).join("");
}

function narrativeDialogue(dialogue){
  if(dialogue!==branchDialogueDefs.liraWounded)return dialogue;
  var f=state.flags;
  if(f.liraCoreCopied)return {npc:"lira",kicker:"Una herida no borra la otra",lines:["«Pueden curarme», dice Lira. «Eso no les devuelve el permiso que él les negó». Elías mantiene las manos lejos del lector. Sara termina el vendaje sin pedirle que los acompañe."],options:[{label:"Respetar su distancia",hint:"El grupo se marcha sin recuperar su confianza."}]};
  if(f.liraPartialTrust&&!f.liraDistrust)return {npc:"lira",kicker:"Volver a hablar",lines:["Lira observa a Sara guardar las vendas. «Podrían haber seguido de largo». Elías se sienta junto a la puerta. «Lo de la clínica fue culpa mía. Abrí el registro sin saber quién estaba escuchando». Lira lo deja terminar. «Mi hermano sigue vivo. Si vuelven a tocar una máquina cerca de nosotros, primero me avisan»."],options:[{label:"Aceptar y pedir que los guíe",hint:"Reconoces el error; Lira acepta ayudar después de haber salvado a su hermano y atendido su herida.",flags:{liraTrust:true,liraAlliance:true,liraSafeRoute:true,exilesReturnAid:true,liraPartialTrust:false}},{label:"Despedirse sin pedir más",hint:"Conservan el camino que ya conocen."}]};
  if(!f.liraBrotherRecovered&&!f.liraBrotherLost)return dialogue;
  return {npc:"lira",kicker:"Lo que pasó entre ustedes",lines:f.liraBrotherLost?["Lira despierta y aparta la mano de Sara. «Esto no cambia lo que hicieron». Sara deja una venda limpia a su alcance. «Lo sé». No pide una ruta ni una despedida."]:["Lira mira la venda nueva. «Mi hermano está en la cámara. Preguntó por la mujer que no soltaba el soporte». Sara sonríe apenas. «Dile que siga respirando. Con eso me conformo»."],options:[{label:"Dejarla descansar",hint:"El grupo continúa hacia la torre."}]};
}
