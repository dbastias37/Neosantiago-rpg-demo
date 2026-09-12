"use strict";
// The ending is a persisted consequence of preparation, siege and evidence custody.
function usesNarrativeFinale(){return state.finaleRevision===1}
function finaleEvent(ev,index){
  if(!usesNarrativeFinale())return ev;
  var f=state.flags,choices=ev.choices.slice();
  if(index===13){choices.push({id:"tower.prepare-relay",label:"Preparar un enlace entre refugios",hint:"Deja programados destinatarios para la antena. Necesitarás conservar la consola y copiar las pruebas en la torre.",narrativeRequires:{any:["rosaCivilNetwork","unit7Ally","unit7Infiltrated"]},cost:"Red de contactos",title:"Un canal esperando respuesta",result:"Elías programa la ruta de entrega. No transmite nombres ni ubicaciones: deja una llamada que los contactos de la expedición podrán reconocer cuando la torre responda. Sara comprueba que ninguna dirección privada haya quedado en el mensaje.",archive:["protocol"],flags:{relayPrepared:true},fx:{threat:2}})}
  if(index===17){choices.push({id:"tower.vera-contract",label:"Reservar la extracción con Vera",hint:"Vera aporta radio y escolta a cambio del archivo que recuperes. El canal queda reservado para ella; cambiarlo después cancelará el acuerdo.",cost:"Compromiso de entregar los archivos",narrativeRequires:{none:["huntersHostile"]},title:"Un lugar de encuentro",result:"Vera sintoniza una frecuencia y marca una escalera bajo la torre. «Los saco por aquí. El archivo viene conmigo». Elías deja el receptor en ese canal. Sara pregunta qué ocurrirá con los nombres. «Eso lo hablamos cuando los tengan», responde Vera.",add:["radio"],flags:{veraExtractionReserved:true,relayPrepared:false},_noDialogue:true})}
  if(index===20){choices.push({id:"tower.align-relay",label:"Alinear el relé con la red civil",hint:"Prepara la difusión de pruebas sin coordenadas privadas. Cancelará la extracción de Vera si la habías reservado. La antena aún tendrá que resistir el asedio.",req:{battery:1},cost:"Batería −1",title:"Una frecuencia compartida",result:"Elías conecta la batería y deja una llamada abierta a las frecuencias civiles. Noa oye una respuesta breve desde abajo: alguien recibió la prueba de enlace. El grupo tendrá que sostener la antena para enviar algo más.",fx:{battery:-1,threat:3},flags:{relayPrepared:true,veraExtractionReserved:false,relayRealigned:true}})}
  if(index===23){
    choices[0]=Object.assign({},choices[0],{label:"Sostener la consola mientras se alinean los canales",hint:"Resiste tres rondas completas o derrota a la patrulla. La antena quedará disponible para el canal que preparaste.",combat:Object.assign({},choices[0].combat,{objectiveRounds:3,brief:"Protege la consola durante tres rondas. Cuando los canales se alineen, las compuertas podrán separar al grupo de la patrulla."}),victory:{title:"El enlace queda asegurado",result:"Elías confirma la alineación y baja las compuertas. Noa se aparta de la puerta con los oídos zumbando. La consola sigue encendida. El destino del canal es el que prepararon antes de entrar; todavía faltan las pruebas de Irene.",flags:{antennaHeld:true,antennaLost:false},fx:{morale:4,threat:8}}});
    choices.push({id:"tower.evacuation",label:"Cubrir a Elías mientras abre la salida de mantenimiento",hint:"Resiste dos rondas o derrota a la patrulla. Asegura la retirada y el transporte de archivos; abandonarás la consola de transmisión.",cost:"Combate · salida de emergencia",combat:{title:"La salida bajo la antena",brief:"Resiste dos rondas mientras Elías abre el acceso. El grupo abandona la consola para asegurar una salida desde el soporte vital.",enemies:["agent2","drone"],objectiveRounds:2,canFlee:true},victory:{title:"Una salida para los que vienen detrás",result:"La cerradura salta. Noa sostiene la puerta y Sara marca el acceso con una venda. La antena queda al otro lado de los disparos, pero ahora hay un camino por donde transportar a una persona y sus archivos.",flags:{evacuationPrepared:true,safeExit:true,antennaHeld:false,antennaLost:true},fx:{morale:2,threat:5}}});
    ev=Object.assign({},ev,{text:ev.text+" "+(f.veraExtractionReserved?"El receptor sigue reservado a Vera. Su escolta espera el archivo por la salida acordada.":f.relayPrepared?"El relé civil está preparado. Perder esta consola impedirá enviar el archivo completo.":"No hay un relé de difusión preparado. Aunque conserven la consola, tendrán que sacar las pruebas físicamente.")});
  }
  if(index===24)return Object.assign({},ev,{text:"Irene está despierta. Sigue con los ojos la mano de Sara hasta que esta se aparta del interruptor. «Antes de tocar nada, escúchenme». Elías deja el lector sobre la mesa. A través del vidrio aún se ven las luces del asedio.",choices:[{id:"tower.listen-irene",label:"Sentarse junto a Irene",hint:"Escucharla antes de decidir sobre el archivo y el soporte vital.",title:"La voz fuera de la grabación",result:"Sara acerca una silla. «Te escuchamos». Irene respira despacio hasta poder responder.",_dialogue:ireneFinalDialogue}]});
  if(index===26)return Object.assign({},ev,{type:"Desenlace",title:"Después de la última puerta",text:"El grupo deja atrás la cámara. Lo que consiguió sostener en la torre empieza a tener consecuencias fuera de ella.",choices:[]});
  return Object.assign({},ev,{choices:choices});
}
var ireneFinalDialogue={npc:"operator",kicker:"Antes de tocar el soporte",start:"start",nodes:{
 start:{lines:["«Yo puse la señal», dice Irene. «La repetición era lo único que no revisaban». Sara le pregunta cuánto tiempo lleva aquí. Irene mira la ventana y no contesta enseguida.","«El archivo tiene las órdenes de aislamiento y los nombres de quienes desaparecieron. También direcciones de familias que siguen escondidas. Pueden copiar las pruebas sin entregar esas direcciones»."],options:[
  {label:"Preguntar qué quiere que ocurra con ella",hint:"Escuchar su petición.",next:"consent"},
  {label:"Preguntar si pueden trasladarla",hint:"Sara revisará lo que necesita el soporte portátil.",next:"consent"},
  {label:"Preguntar cómo proteger a las familias del archivo",hint:"Separar pruebas y ubicaciones privadas.",flags:{operatorFilteredNames:true},next:"consent"}
 ]},
 consent:{lines:["Sara encuentra un soporte portátil. «Con una batería podemos sacarte de esta sala. El camino es peligroso». Irene le pide que la mire. «Si pueden llevarme, llévenme. Si no, no quiero quedarme conectada para que vuelvan a usarme». ","Sara explica que retirar el soporte detendrá su respiración y que no podrá revertirlo. Irene confirma que lo entiende. «Copien primero. Después quédense conmigo». Elías muestra el lector: ha separado las pruebas de las coordenadas privadas. Todavía no ha enviado ni desconectado nada."],options:[
  {id:"tower.irene-portable",label:"Conectar el soporte portátil y llevar a Irene",hint:"Copia las pruebas y prepara su traslado. Su supervivencia dependerá de conseguir salir de la torre.",req:{battery:1},cost:"Batería −1",fx:{battery:-1,morale:3},archive:["origin","names","protocol","exiles"],flags:{towerEvidenceCopied:true,irenePortable:true,ireneConsentHeard:true},result:"Sara espera a que el soporte portátil tome el ritmo antes de soltar el cable de pared. Irene le aprieta la muñeca. «No me sueltes al pasar la puerta». Elías cierra la copia y guarda el lector dentro de la chaqueta."},
  {id:"tower.irene-release",label:"Copiar las pruebas y cumplir su petición",hint:"Irene ha pedido no quedar en manos de UNO. Desconectarla causará su muerte; no es reversible.",cost:"Irreversible",archive:["origin","names","protocol","exiles"],flags:{towerEvidenceCopied:true,ireneDied:true,ireneConsentHeard:true},result:"Elías confirma la copia y se aparta. Sara pregunta una última vez. Irene asiente. Cuando el soporte se detiene, Sara permanece junto a ella hasta que ya no hay nada más que esperar. Noa abre la puerta sin decir que deben darse prisa."},
  {id:"tower.irene-stay",label:"Copiar las pruebas y mantener el soporte conectado",hint:"La deja viva en la sala, aunque ella pidió no seguir cautiva. El grupo se lleva una copia; no habrá traslado.",archive:["origin","names","protocol","exiles"],flags:{towerEvidenceCopied:true,ireneLeft:true,ireneConsentHeard:true},result:"Sara aparta la mano del interruptor. «No puedo». Irene mira hacia la ventana. Elías guarda las pruebas. La máquina sigue marcando cada respiración cuando el grupo abandona la habitación."},
  {id:"tower.irene-leave",label:"Retirarse sin intervenir ni copiar",hint:"Deja a Irene conectada y renuncia a las pruebas de la torre. Conservarán solamente lo que supieron antes de llegar.",flags:{ireneLeft:true,ireneNoCopy:true,ireneConsentHeard:true},result:"Noa mira la puerta y después al grupo. Nadie se acerca al lector. Al salir, Sara escucha que Irene empieza otra vez la frase de la señal. Esta vez sabe quién la dice."}
 ]}
}};
function finaleOutcome(){
  var f=state.flags;if(f.legacyTransmission)return "broadcast";var copy=!!f.towerEvidenceCopied&&!f.towerEvidenceLost;
  if(copy&&f.relayPrepared&&f.antennaHeld&&!f.antennaLost)return "broadcast";
  if(copy&&f.relayPrepared&&f.weakBroadcast&&!f.antennaLost)return "fragment";
  if(copy&&f.veraExtractionReserved&&!f.huntersHostile)return "pact";
  if(copy)return "archive";
  return "testimony";
}
function finaleStory(kind){
  var f=state.flags,stories={
   broadcast:{title:"Alguien contesta",lead:"El receptor se enciende mientras Noa sostiene la última puerta. La consola envía las pruebas por el relé que Elías preparó antes del asedio. Una voz interrumpe la estática: «Recibido». Luego otra pide que repitan un nombre. Sara se queda quieta un segundo. Ya no están escuchando una grabación.",refuge:"Mara recibe una copia de las órdenes de aislamiento. Las deja sobre la mesa del andén antes de llamar al consejo. Los vecinos empiezan a reconocer nombres; ninguno necesita permiso para seguir leyendo.",world:"Las pruebas circulan entre los contactos del relé. Las coordenadas privadas permanecen fuera de la emisión. UNO todavía controla calles y recursos, pero destruir la torre ya no le permitirá borrar todas las copias."},
   fragment:{title:"Lo que alcanzó a salir",lead:"El canal de mantenimiento sostiene apenas unas líneas. Elías envía las órdenes y oye una confirmación antes de que la frecuencia se corte. No insiste: guarda el archivo completo y alcanza a los demás en la escalera.",refuge:"Al volver al andén, Mara ya ha oído parte del mensaje. Elías conecta el lector para completar lo que la interferencia dejó fuera. Algunas familias recibieron las pruebas; otras siguen esperando una señal.",world:"La antena no sostuvo una difusión completa. La copia física permite continuar el trabajo desde abajo, pero todavía habrá que llegar a quienes no pudieron escuchar."},
   pact:{title:"La escalera de Vera",lead:"Dos golpes llegan desde la salida acordada. La escolta de Vera espera donde señaló en el mercado. Noa reconoce la frecuencia del receptor. Elías entrega el archivo para que abran el paso: el precio se decidió antes de entrar a la torre, y ahora ha llegado el momento de pagarlo.",refuge:"Vera cumple la extracción y envía los suministros pactados. Mara pregunta por las pruebas. El grupo explica dónde quedaron. El consejo recibe noticias de Irene, pero no dispone del archivo de la torre para decidir cómo publicarlo.",world:"Vera controla la copia recuperada en la torre. Los documentos obtenidos antes del encuentro permanecen con sus dueños; no se borran por el trato. La información nueva vuelve a depender de alguien que puede cobrar por dejarla pasar."},
   archive:{title:"El lector bajo la chaqueta",lead:"La torre queda a oscuras detrás del grupo. Elías protege el lector con las dos manos mientras baja. No hubo una difusión operativa ni una extracción acordada que se llevara las pruebas. Sara comprueba que el archivo siga abriendo antes de acercarse a la puerta del refugio.",refuge:"Mara despeja un sitio en la mesa. Esta vez Elías conecta el lector delante de los vecinos, antes de llevarlo al consejo. Las pruebas llegaron por el camino que el grupo consiguió conservar; la ciudad todavía no las ha oído.",world:"UNO no sabe cuántas copias sobrevivieron. Fuera de Línea 1, la noticia dependerá de los contactos y las rutas que sigan abiertos. Conservar el archivo fue el desenlace de esta expedición; compartirlo será trabajo de los que quedaron vivos."},
   testimony:{title:"Contarlo sin la máquina",lead:"Al llegar al andén, Elías vacía la mochila. No aparece una copia de las pruebas de la torre. Sara pide papel y empieza por el nombre de Irene. Noa corrige una hora. Se interrumpen, comparan lo que recuerdan y vuelven a empezar.",refuge:"Mara escucha hasta el final antes de llamar a los vecinos. El relato no sustituye al archivo perdido o abandonado. Los documentos que el grupo recuperó antes de la torre siguen disponibles, pero no prueban todo lo que vieron allí.",world:"La ciudad no recibió una emisión de las pruebas de Irene. UNO conserva ese archivo o sus restos. La expedición vuelve con testigos y con preguntas que ya no puede responder conectando un lector."}
  };
  var story=Object.assign({},stories[kind]||stories.testimony);
  if(f.legacyTransmission){story.lead="Las pruebas ya habían salido por el enlace reparado de Irene. Al abandonar la torre, el grupo conserva la certeza de que aquella emisión ocurrió: lo que pase con el equipo durante la retirada no puede retirarla de quienes la escucharon.";story.world="La emisión anterior a esta actualización permanece como un hecho de la expedición. El grupo no controla quién recibió cada fragmento ni cuántas copias llegaron a conservarse."}
  story.group=f.towerRetreat?"La retirada dejó al grupo exhausto. Se turnan para cargar el equipo y para sostener a quien se queda atrás. Nadie llama victoria a haber salido, aunque haber salido importa.":"Noa deja el arma junto a la puerta. Elías sigue comprobando las conexiones aunque ya no hagan falta. Sara se sienta al fin. Cada uno tarda un tiempo distinto en darse cuenta de que no necesita volver a subir hoy.";
  if(f.ireneDied)story.group+=" Sara dice el nombre de Irene al contar que murió después de confirmar su petición. Nadie vuelve a describirla como una pieza del sistema.";
  else if(f.irenePortable)story.group+=f.ireneLostInEscape?" El soporte de Irene quedó atrás durante la retirada. El grupo no sabe si la Red UNO alcanzó a recuperarla; Sara no permite que la den por salvada.":" Irene entra en el refugio conectada al soporte portátil. Sara lleva la camilla hasta una toma de energía. Por primera vez, la voz de la señal necesita una cama.";
  else if(f.ireneLeft||!f.ireneConsentHeard)story.group+=" Irene quedó en la torre. El grupo no puede asegurar qué ocurrió con ella cuando la Red UNO volvió a ocupar las salas.";
  if(f.matiasAtRefuge)story.refuge+=" Matías se incorpora en la enfermería cuando los oye volver. Sara le pide que no se levante todavía.";
  if(f.rosaWarnedCommunities)story.world+=" Los avisos de Rosa ya habían permitido salir a varias familias antes de que cambiara el rastreo.";
  if(f.liraDead)story.world+=" Lira no regresará. Los exiliados recuerdan quién le quitó el núcleo.";
  else if(f.liraBrotherLost)story.world+=" Lira conserva el nombre de su hermano y la memoria de quienes lo desconectaron. La llegada del grupo no repara esa pérdida.";
  else if(f.liraAlliance)story.world+=" Lira mantiene abierto el paso que prometió; su hermano sigue en la cámara de recuperación.";
  if(f.unit7Sheltered)story.world+=" S-7 permanece oculto con los nombres que alcanzaron a salvar.";
  if(f.line1ConcealmentRevoked)story.refuge+=" El registro civil reconoce Línea 1 y también revela su acceso. El borrado de H-12 ya no basta para esconderla.";
  if(f.ortegaPerimeterOpened)story.world+=" En el distrito de Ortega, las familias siguen cruzando el perímetro abierto.";
  else if(f.ortegaResidentControl)story.world+=" Los residentes conservan las llaves y los controles de sus viviendas.";
  else if(f.ortegaLine1Protected)story.refuge+=" El corredor de Ortega sigue reservado a Línea 1; las otras comunidades no recibieron ese paso.";
  if(f.erasedCitizensRestored)story.world+=" Los nombres que Vega restituyó permanecen en el registro, incluso si las pruebas de la torre no llegaron a todos.";
  else if(f.identityRegistryDestroyed)story.world+=" El registro destruido ya no puede reutilizar a los muertos. Las identidades que nadie copió siguen perdidas.";
  if(f.unit7Ally&&!f.unit7Shutdown)story.world+=" S-7 continúa usando los accesos que recuperaron juntos para abrir conductos de mantenimiento.";
  return story;
}
function resolveNarrativeFinale(){
  if(!usesNarrativeFinale()||state.index!==26||pending||battleState)return false;
  if(state.finished)return true;
  var kind=finaleOutcome(),story=finaleStory(kind);
  state.finaleResolution={version:1,kind:kind,story:story};
  if(kind==="pact")apply({fx:{food:3,ammo:2}});
  state.history.push({day:3,loc:"Torre repetidora 6",choice:"Consecuencia de la expedición",result:story.title});
  encounterSaveLocked=false;state.refuge.active=false;$("choices").innerHTML="";$("result").classList.add("hidden");
  finish(kind);return true;
}
function finaleDefeat(fled){
  if(!usesNarrativeFinale()||!battleState||battleState.choice._signalTracking||state.index<22||state.index>25)return false;
  var index=state.index,choice=battleState.choice,f=state.flags,out;
  if(index===22)out={title:"Un paso de servicio",result:"El grupo abandona el corredor y atraviesa un conducto de mantenimiento. Tardan en poder incorporarse al otro lado. Han llegado al interior de la torre, pero la puerta principal permanece en manos de la patrulla.",flags:{towerServiceEntry:true}};
  else if(index===23)out={title:"La consola queda atrás",result:"El grupo se repliega hacia el soporte vital. Cuando vuelve a cerrar una puerta entre ellos y la patrulla, la consola ya no responde. El canal de difusión se perdió. Todavía pueden encontrar a Irene y tratar de sacar sus pruebas.",flags:{antennaHeld:false,antennaLost:true,weakBroadcast:false}};
  else {var safe=!!(f.evacuationPrepared||f.safeExit||f.exilePassage);out={title:"La última puerta",result:safe?"Noa encuentra el acceso que habían asegurado. El grupo abandona la cámara por allí; conserva la copia y puede arrastrar el soporte portátil si lo lleva. Los exiliados recuperan los núcleos.":"La retirada separa al grupo de su equipo. Cuando consiguen salir, el lector ha quedado dentro de la cámara. Si Irene venía con ellos, su soporte también quedó al otro lado. Nadie logra volver a abrir la puerta.",flags:{exilesRecoveredCores:true,towerEvidenceLost:!safe,ireneLostInEscape:!!f.irenePortable&&!safe,antennaHeld:false,antennaLost:true}}}
  if(out.flags.towerEvidenceLost&&state.narrative&&Array.isArray(state.narrative.beforeTowerDocs))state.docs=state.narrative.beforeTowerDocs.slice();
  out.fx={morale:fled?-5:-8,threat:4};out.flags.towerRetreat=true;
  state.stats.battles++;state.stats.retreats++;state.party.forEach(function(p){p.hp=Math.max(1,p.hp);p.guard=0;p.bleed=0});
  battleState=null;$("battle").classList.add("hidden");$("lootModal").classList.add("hidden");setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);
  completeChoice(choice,out,null,null);return true;
}
function finaleObjectiveRound(){
  var b=battleState;if(!b||!b.config.objectiveRounds||b.round<b.config.objectiveRounds||!state.party.some(function(p){return p.hp>0}))return false;
  fieldRecordVictory(b);var choice=b.choice;state.stats.battles++;state.stats.wins++;state.stats.objectivesHeld=(state.stats.objectivesHeld||0)+1;
  state.party.forEach(function(p){p.guard=0;p.bleed=0});battleState=null;
  if(typeof resetCombatPresentation==="function")resetCombatPresentation();
  $("battle").classList.add("hidden");setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);
  completeChoice(choice,choice.victory,null,null,fieldVictoryRows().concat([["Objetivo", "Posición sostenida"]]));return true;
}

function finaleBeforeEvidence(opt){
  if(!usesNarrativeFinale()||!opt.flags||!opt.flags.towerEvidenceCopied)return;
  var n=narrativeState();if(!Array.isArray(n.beforeTowerDocs))n.beforeTowerDocs=state.docs.slice();
}
function migrateNarrativeFinale(saved){
  if(saved.finaleRevision||saved.finished)return;var f=state.flags;
  if(f.carryTruth){f.towerEvidenceCopied=true;f.ireneDied=true;f.ireneConsentHeard=true}
  if(f.fullBroadcast){f.towerEvidenceCopied=true;f.legacyTransmission=true;f.ireneLeft=true}
  if(f.leftOperator)f.ireneLeft=true;
}

function finaleGraph(){
  var f=state.flags,res=state.finaleResolution,kind=res&&res.kind,prepared=state.index>20,sieged=state.index>23,evidence=state.index>24;
  var channel=f.relayPrepared?"El relé civil quedó preparado":f.veraExtractionReserved?"La extracción de Vera quedó reservada":"No quedó un canal de entrega preparado";
  var nodes=[{id:"tower.channel",column:0,label:prepared?channel:"Preparación no descubierta",seen:prepared,status:prepared?"Preparación conservada":"Sin descubrir"},
   {id:"tower.siege",column:1,label:sieged?(f.antennaLost?"La consola quedó fuera de alcance":f.antennaHeld?"La antena quedó operativa":f.weakBroadcast?"Solo quedó el canal de mantenimiento":"La antena no quedó asegurada"):"Asedio no descubierto",seen:sieged,status:sieged?"Estado de la torre":"Sin descubrir"},
   {id:"tower.evidence",column:2,label:evidence?(f.towerEvidenceLost?"La copia se perdió en la retirada":f.towerEvidenceCopied?"El grupo conservó las pruebas":"El grupo salió sin copiar las pruebas"):"Archivo no descubierto",seen:evidence,status:evidence?"Custodia del archivo":"Sin descubrir"}];
  var edges=[{from:"tower.channel",to:"tower.siege",label:"",chosen:sieged},{from:"tower.siege",to:"tower.evidence",label:"",chosen:evidence}];
  ["broadcast","fragment","pact","archive","testimony"].forEach(function(id){var seen=kind===id;nodes.push({id:"tower.end."+id,column:3,label:seen?res.story.title:"Desenlace no descubierto",seen:seen,status:seen?"Vivido":"Sin descubrir"});edges.push({from:"tower.evidence",to:"tower.end."+id,label:"",chosen:seen})});
  return {title:"El desenlace de la torre",nodes:nodes,edges:edges,completed:!!res,legacy:false,closed:{}};
}

function downloadFinaleMap(){if(!state.finaleResolution)return;narrativeMapRoute="towerFinale";downloadDecisionMap()}
document.getElementById("downloadFinalMap").addEventListener("click",downloadFinaleMap);
document.getElementById("downloadSummaryMap").addEventListener("click",downloadFinaleMap);
