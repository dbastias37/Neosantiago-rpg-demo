"use strict";
// Chapter prerequisites and causal links; map and play share these definitions.
var narrativeLinks=[
 {from:"rosaIaraRoute",to:"matiasRescue",flag:"matiasUsedRosaPassage",text:"Las marcas de Rosa permitieron trasladar a Matías por una entrada cubierta."},
 {from:"matiasRescue",to:"unit7LastOrder",flag:"unit7UsedMatiasFrequency",text:"La frecuencia que conservó Matías permitió ocultar a S-7."},
 {from:"unit7LastOrder",to:"unit12InvisibleMap",flag:"h12UsedUnit7",text:"S-7 identificó el intervalo de mantenimiento de H-12."},
 {from:"rosaIaraRoute",to:"unit12InvisibleMap",flag:"rosaWarnedCommunities",text:"Rosa recibió las ubicaciones copiadas de H-12 y pudo avisar a las comunidades."},
 {from:"unit12InvisibleMap",to:"vegaDeadNames",flag:"line1ConcealmentRevoked",text:"Registrar Línea 1 volvió a revelar el refugio que H-12 había ocultado."},
 {from:"vegaDeadNames",to:"ortegaObedientCity",flag:"ortegaRecognizedResidents",text:"Los nombres restaurados por Vega permitieron que los residentes recuperaran sus controles."}
];
(function defineChapters(){
  var d=routeNarrativeDefs;
  function requires(option,all,why){option.narrativeRequires={all:all};option.closedReason=why}
  function add(id,index,o){d[id].scenes[index].options.push(o)}
  function lines(id,index,text){d[id].scenes[index].lines=text}
  add("matiasRescue",1,{label:"Seguir las marcas que enseñó Rosa",hint:"El paso cubierto evita exponer la fiebre de Matías al cielo.",narrativeRequires:{all:["rosaSafeHouseMarked"]},closedReason:"Rosa no compartió el código de las casas seguras.",fx:{threat:-4,morale:2},flags:{matiasUsedRosaPassage:true},nextScene:2});
  add("unit7LastOrder",0,{label:"Usar la frecuencia que entregó Matías",hint:"El patrón disfraza el aviso de S-7 como una lectura de fiebre.",narrativeRequires:{all:["matiasFeverSignal"]},closedReason:"No conservaste la frecuencia de Matías.",fx:{threat:-4,morale:1},flags:{unit7UsedMatiasFrequency:true},nextScene:1});
  add("unit12InvisibleMap",0,{label:"Esperar la señal de mantenimiento de S-7",hint:"S-7 reconoce cuándo H-12 deja de barrer la avenida.",narrativeRequires:{all:["unit7Ally","unit7OriginalOrderRestored"],none:["unit7Shutdown"]},closedReason:"S-7 no está disponible con su memoria de mantenimiento completa.",fx:{threat:-4,morale:1},flags:{h12UsedUnit7:true},nextScene:1});
  add("ortegaObedientCity",1,{label:"Devolver los controles con los nombres restaurados",hint:"Las identidades que recuperó Vega permiten reconocer a los habitantes.",narrativeRequires:{all:["erasedCitizensRestored"]},closedReason:"Los nombres civiles siguen borrados.",fx:{threat:2,morale:4},archive:["names"],flags:{ortegaRecognizedResidents:true,ortegaResidentRegistryCopied:true},nextScene:2});
  var s7=d.unit7LastOrder;
  lines("unit7LastOrder",2,["S-7 reproduce una grabación antigua: su propia cámara entrando en un hospital lleno de humo. No busca credenciales. Sigue los gritos.","«Esa orden sigue aquí», dice. Elías retira el cable del terminal. «Y la de entregarnos también». La unidad tarda unos segundos en contestar. «No voy a cumplirla». Noa baja el arma, aunque no llega a guardarla."]);
  var partial=JSON.parse(JSON.stringify(s7.scenes[2]));partial.title="Los nombres que alcanzan a quedar";partial.lines=["S-7 intenta abrir el registro de evacuación y vuelve al mismo error. Los nombres están a salvo; las instrucciones que los acompañaban no pudieron recuperarse.","«No recuerdo cómo los saqué». Sara le muestra la lista. «Pero sabemos que salieron». Elías señala un conducto sin señal: puede dejarlo allí con la copia. S-7 no podrá guiarlos hacia Nodo 14. Todavía puede quedarse con esos nombres."];
  partial.options=[{label:"Dejar a S-7 a salvo con la copia",hint:"La unidad conserva los nombres; no recupera los accesos que se perdieron.",fx:{morale:3},archive:["names"],flags:{unit7RouteCompleted:true,unit7Sheltered:true},end:true,result:"S-7 entra en el conducto. Antes de cerrar la reja, Sara vuelve a escuchar la primera fila de nombres. Esta vez la unidad consigue terminarla."},JSON.parse(JSON.stringify(s7.scenes[2].options[2]))];
  s7.scenes.push(partial);s7.scenes[1].options[1].nextScene=3;
  requires(s7.scenes[2].options[0],["unit7OriginalOrderRestored"],"La orden original no se reconstruyó.");
  requires(s7.scenes[2].options[1],["unit7OriginalOrderRestored"],"Sin memoria completa, S-7 no puede sostener una identidad infiltrada.");
  requires(d.unit12InvisibleMap.scenes[2].options[1],["h12Line1Isolated"],"No separaste Línea 1 del resto del mapa; ahora no hay tiempo para un borrado selectivo.");
  requires(d.vegaDeadNames.scenes[2].options[0],["vegaErasedNamesCopied"],"Sin la copia completa, la bóveda no puede restituir todos los nombres antes de que llegue la patrulla.");
  d.ortegaObedientCity.scenes[2].options[1].narrativeRequires={any:["ortegaBlockSurveillanceOff","ortegaResidentRegistryCopied"]};
  d.ortegaObedientCity.scenes[2].options[1].closedReason="No liberaste los lectores ni identificaste a los residentes que recibirían el control.";
  // Announce irreversible preparation costs before the player chooses.
  d.unit7LastOrder.scenes[1].options[1].hint="Salva la lista, pero renuncia a restaurar sus accesos: S-7 necesitará quedarse a salvo.";
  d.unit12InvisibleMap.scenes[1].options[1].hint="Preparar este filtro es necesario para ocultar solo Línea 1 más adelante.";
  d.vegaDeadNames.scenes[1].options[0].hint="Esta copia es necesaria para restituir todas las identidades desde la bóveda.";
  d.ortegaObedientCity.scenes[1].options[2].hint="Cruzar sin intervenir impide entregar después el control directamente a los residentes.";
  lines("rosaIaraRoute",1,["Rosa se detiene ante una puerta oxidada. Noa señala otra, más cerca de la escalera. Ella niega con la cabeza y le muestra dos rayas bajo el marco.","«Esta la revisaron ayer. La de arriba tiene una marca nueva; puede haber alguien esperando». Iara se mueve bajo la manta. Rosa le acomoda la cabeza antes de seguir hablando. «Ayúdenme con la puerta. No quiero despertarla». "]);
  lines("rosaIaraRoute",2,["Rosa deja a Iara sobre un colchón seco. Espera hasta oírla respirar sin esfuerzo y recién entonces vuelve a la mesa. Noa le acerca una silla.","«Puedo enseñarles las entradas que usamos. O avisar a las otras casas de que van a pasar». Busca bajo una tabla y saca munición envuelta en tela. «Esto también les puede servir. Pero algo tengo que dejar para los que vienen después». "]);
  lines("matiasRescue",2,["Matías intenta sentarse cuando Sara termina de vendarlo. Ella le apoya una mano en el hombro. «Hoy no». Él mira las mochilas junto a la puerta. «Ustedes sí van a salir». ","Pide su chaqueta. En los bolsillos quedan una ampolla, un receptor y un mapa. Le cuesta hablar mucho rato seguido, así que Sara le acerca cada cosa para que señale. «El receptor guarda el barrido que escuché. Si lo reconocen arriba, escóndanse antes de que cambie». "]);
  lines("vegaDeadNames",2,["La puerta de la bóveda tiembla con el primer golpe. Vega busca su nombre en la pantalla. Elías le hace sitio frente al teclado.","«Podemos devolver los nombres si trajimos la copia», dice Elías. «Registrar el refugio es más rápido, pero quedará su dirección. Y si rompemos esto, nadie va a recuperar lo que no hayamos sacado». Noa mira la puerta. «Una de esas cosas. Ya». "]);
  lines("ortegaObedientCity",2,["Ortega se quita el sello del guante y lo pone junto al panel. Nadie lo recoge. Al otro lado del vidrio, una mujer espera con dos niños a que la puerta cambie de color.","«Puedo abrir el perímetro», dice. «Entregarles los controles requiere que hayamos preparado las viviendas. También puedo mantener el cordón y sacar solo a los suyos». Sara mira a la mujer del vidrio. «Entonces explíquele usted por qué ella se queda». "]);
  var endings={
    matiasRescue:["Matías deja la ampolla en la palma de Sara. Ella revisa el sello y la guarda junto a las vendas. «Esta vez no la gastes en mí», dice él. Sara no le promete nada.","Elías escucha el receptor hasta reconocer dos pulsos cortos. Matías le indica cuándo empieza el barrido. «Ahí tienen que estar bajo techo». Elías repite el patrón para asegurarse de haber entendido.","Noa extiende el cartón sobre la cama. Matías corrige con el dedo una entrada que se derrumbó. Ella tacha el paso antes de doblarlo. «Bien. Por ahí no vamos»."],
    rosaIaraRoute:["Rosa dibuja tres marcas y hace que Noa las repita. «Si falta la raya de abajo, no entren». Noa guarda el papel en un bolsillo distinto al de la munición.","Rosa moja un trozo de tela y lo cuelga junto a la puerta. «La casa de enfrente lo verá al amanecer. Después las otras». Sara vuelve a mirar a Iara antes de despedirse.","Noa cuenta los cartuchos y deja el envoltorio sobre la mesa. Rosa se lo devuelve. «Para que no suenen al caminar». Ninguna de las dos menciona otra deuda."],
    unit7LastOrder:["Elías borra la orden de retorno. S-7 espera una confirmación que ya no llega. Después abre una rejilla junto al suelo. «Por aquí». Noa mira dentro antes de seguirlo.","S-7 vuelve a conectarse. Su voz adopta el tono uniforme de las patrullas: «Sector vacío». Elías ve las tres siluetas todavía encendidas en su pantalla y corta el enlace antes de sonreír.","El motor pierde altura hasta tocar el suelo. Elías retira el núcleo. Sara espera una última palabra de la unidad, pero solo queda el ruido del agua en el conducto."],
    unit12InvisibleMap:["Las siluetas desaparecen del mapa. Noa observa un dron seguir de largo sobre una ventana iluminada. Elías rompe el enlace para impedir que se restaure desde la azotea. La respuesta de UNO llegará por otro lado.","Línea 1 se apaga en la pantalla. Las otras marcas siguen encendidas. Sara reconoce una junto al andén donde encontraron a Rosa y se queda mirándola hasta que Elías guarda el lector.","Elías desvía el barrido. Una familia cruza bajo el dron sin que suene la alarma. Noa se queda detrás del panel. «Cuando nos vayamos, ¿quién sigue mirando esto?». Elías aún no tiene una respuesta."],
    vegaDeadNames:["Los expedientes recuperan sus nombres, uno tras otro. Vega encuentra el suyo y lo lee en voz baja. Al otro lado de la puerta, el lector de la patrulla empieza a rechazar sus propias órdenes.","El panel confirma el registro de Línea 1 y despliega el acceso al refugio. Noa se acerca a la pantalla. «Ahora saben por dónde entramos». Nadie vuelve a llamar invisible a esa puerta.","Vega sostiene el interruptor mientras Elías corta la alimentación. Las filas de nombres desaparecen. Sara revisa lo que alcanzaron a copiar antes de permitir que apaguen la última pantalla."],
    ortegaObedientCity:["Ortega abre el perímetro. La mujer del vidrio espera a que alguien se lo repita y después hace pasar primero a los niños. Por el comunicador llega una orden de cierre. Ortega lo deja sobre el panel.","Las puertas empiezan a abrirse desde dentro. Una vecina prueba dos veces el control de su casa. Cuando Ortega intenta explicarle el sistema, ella le pide las llaves del armario eléctrico.","Ortega marca una salida para Línea 1. Noa memoriza el acceso. La mujer continúa al otro lado del vidrio mientras el grupo cruza hacia la torre."]
  };
  Object.keys(endings).forEach(function(id){d[id].scenes[2].options.forEach(function(o,i){o.result=endings[id][i]})});
  partial.options[1].result=endings.unit7LastOrder[2];
  Object.keys(d).forEach(function(id){var def=d[id];def.graphVersion=1;def.scenes.forEach(function(s,i){s.id=s.id||id+"."+i;s.graphColumn=i<2?i:2;s.untimed=true;s.options.forEach(function(o,j){o.id=o.id||s.id+"."+j})})});
})();
function narrativeChapterScene(scene,id,index){
  var copy=Object.assign({},scene,{lines:scene.lines.slice()}),f=state.flags;
  if(id==="unit12InvisibleMap"&&index===2&&f.h12CommunitiesCopied&&f.rosaCivilNetwork)copy.lines.push("Sara reconoce las casas del mapa. «Rosa puede avisarles antes del apagón». Noa prepara una copia para dejarla en el buzón de la red civil.");
  if(id==="vegaDeadNames"&&index===2&&f.h12Line1Hidden)copy.lines.push("Noa señala Línea 1. «La borramos del rastreo de H-12. Si escribimos aquí la dirección, volverán a encontrarla». ");
  var closed=scene.options.filter(function(o){return narrativeBlocked(o)&&o.closedReason}).map(function(o){return o.closedReason});
  if(closed.length)copy.lines.push(closed.join(" "));
  return copy;
}
function narrativeChapterEffects(o){
  var f=state.flags,changed=o.flags||{};
  if(changed.unit7Shutdown){f.unit7Ally=false;f.unit7Infiltrated=false;f.unit7Sheltered=false}
  if(changed.unit7OriginalOrderRestored)f.unit7MemoryIncomplete=false;
  if(changed.line1OfficiallyRegistered&&(f.h12Line1Hidden||f.h12CommuneBlind)){f.line1ConcealmentRevoked=true;f.h12Line1Hidden=false}
  if(changed.h12CommuneBlind&&f.h12CommunitiesCopied&&f.rosaCivilNetwork)f.rosaWarnedCommunities=true;
  // NPC knowledge records witnessed exchanges, not omniscience.
  var n=narrativeState();n.knowledge=n.knowledge||{};
  function knows(who,fact){var list=n.knowledge[who]||(n.knowledge[who]=[]);if(list.indexOf(fact)<0)list.push(fact)}
  if(changed.liraBrotherLost)knows("lira","brotherKilled");
  if(changed.liraCoreCopied)knows("lira","copyWithoutConsent");
  if(changed.rosaWarnedCommunities||f.rosaWarnedCommunities)knows("rosa","communitiesLocated");
  if(changed.soldRefuge)knows("vera","refugeLocation");
  if(changed.erasedCitizensRestored)knows("vega","namesRestored");
}

function narrativeRememberedEvent(ev,index){
  var f=state.flags;
  // Shift the whole second day together; returning from a detour never moves the clock backward.
  if(ev.day===2&&f.matiasLateStart){var base=events[index].time.split(":"),minutes=Number(base[0])*60+Number(base[1])+165;ev=Object.assign({},ev,{time:String(Math.floor(minutes/60)).padStart(2,"0")+":"+String(minutes%60).padStart(2,"0")})}
  if(ev.title==="El núcleo expuesto"&&f.liraCoreCopied)ev=Object.assign({},ev,{text:"Lira está herida junto a la camilla. Reconoce a Elías y tapa el conector con la mano. «A él no». Sara deja su mochila en el suelo y se acerca sola. Lira acepta que le cierre la herida; no ha olvidado la copia que hicieron contra la voluntad de su hermano."});
  if(ev.title==="La primera luz"&&f.unit7Sheltered)ev=Object.assign({},ev,{text:"El grupo sale sin S-7. La unidad quedó en un conducto aislado, con los nombres que alcanzaron a salvar. Elías consulta el plano de superficie: los accesos que faltan tendrán que encontrarlos solos."});
  if(ev.title==="La máquina que recuerda"&&f.rosaWarnedCommunities)ev=Object.assign({},ev,{text:ev.text+" En una pared exterior hay una marca fresca de la red civil. El aviso enviado a Rosa llegó antes que el grupo. Sara encuentra una manta abandonada junto a la salida; aquí alguien tuvo tiempo de marcharse."});
  return ev;
}
