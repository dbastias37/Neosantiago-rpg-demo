"use strict";
// Chapter registry: only authored chapters are playable. Future slots carry no invented story.
var campaignChapters=Object.freeze([
  {id:1,title:"La Voz",available:true}, {id:2,title:"La Cisterna",available:true},
  {id:3,title:"Capítulo 3",available:false}, {id:4,title:"Capítulo 4",available:false},
  {id:5,title:"Capítulo 5",available:false}
]);
function chapterProgress(){return state.campaignProgress||(state.campaignProgress={version:1,active:1,completed:{}})}
function inCisterna(){return !!state.campaignProgress&&state.campaignProgress.active===2}
function cisternaState(){return state.cisterna}
function cisternaIndex(key){return events.findIndex(function(ev){return ev.chapter===2&&ev.key===key})}
function cisternaFresh(){return {version:1,facts:{contact:"unverified",permission:"none",contactProposal:"not-offered",relationship:"unagreed",unoExposure:"none"},receipts:{},nights:{},attempts:1,resumeKey:"corridor",resolution:null}}
function normalizeCampaignChapters(){
  var p=chapterProgress(),ev=events[state.index];
  if(p.version!==1||![1,2].includes(p.active)||!p.completed||typeof p.completed!=="object"||Array.isArray(p.completed))throw Error("Campaña inválida");
  if((ev.chapter===2)!==(p.active===2))throw Error("Capítulo y escena no coinciden");
  if(!inCisterna())return;
  var c=cisternaState();
  if(!p.completed[1]||!c||c.version!==1||!c.facts||typeof c.facts!=="object"||Array.isArray(c.facts)||!c.receipts||typeof c.receipts!=="object"||Array.isArray(c.receipts)||!c.nights||typeof c.nights!=="object"||!Number.isInteger(c.attempts)||c.attempts<1||cisternaIndex(c.resumeKey)<0)throw Error("Visita inválida");
  Object.keys(c.receipts).forEach(function(key){var r=c.receipts[key];if(cisternaIndex(key)<0||!r||typeof r.option!=="string"||typeof r.result!=="string"||(r.next!==null&&cisternaIndex(r.next)<0))throw Error("Recibo de visita inválido")});
  Object.keys(c.nights).forEach(function(key){if(!["night1","night2"].includes(key)||!["share","keep"].includes(c.nights[key]))throw Error("Descanso de visita inválido")});
  if(c.resolution&&!["limited","letters","independent","closed","incomplete"].includes(c.resolution.kind))throw Error("Desenlace de visita inválido");
  if(state.finished!==!!c.resolution)throw Error("Cierre de visita inconsistente");
}
function chapterOneKind(){return state.finaleResolution?state.finaleResolution.kind:({return:"archive",trade:"pact",broadcast:"broadcast",fragment:"fragment",archive:"archive",testimony:"testimony",pact:"pact"}[state.ending]||"testimony")}
function startChapterTwo(){
  if(!gameSessionActive||!state.finished||inCisterna()||pending||battleState||encounterSaveLocked)return false;
  var progress=chapterProgress();
  progress.completed[1]={kind:chapterOneKind(),ending:state.ending,story:JSON.parse(JSON.stringify(endingNarrative(state.ending,endingTier(state.ending).id))),flags:JSON.parse(JSON.stringify(state.flags)),score:state.score};
  progress.active=2;state.cisterna=cisternaFresh();state.index=cisternaIndex("recovery");
  state.finished=false;state.ending=null;state.summarySeen=false;state.finalTier=null;state.score=0;state.activity="story";
  state.refuge.active=false;state.inhibitor.active=false;state.inhibitor.remainingMs=0;state.inhibitor.pendingContact=null;state.inhibitor.contactStarted=false;state.inhibitor.needsSync=false;
  ["final","summary","night","result","signalModal","signalWarningModal"].forEach(function(id){$(id).classList.add("hidden")});
  if(typeof hideActivities==="function")hideActivities();
  save();render();$("eventTitle").setAttribute("tabindex","-1");$("eventTitle").focus({preventScroll:true});return true;
}
function cisternaOpening(){
  return {
    broadcast:"Desde la emisión, al consejo llegan preguntas con nombres de lugares que algunos sabios no conocen. Una mujer pregunta si podrán leer los documentos de La Cisterna fuera de la sala. «Los antecedentes, sí», responde Varela. «La ruta todavía hay que revisarla». Las coordenadas privadas de Irene permanecen fuera de aquella emisión.",
    fragment:"Un vecino trae una transcripción con frases que nadie encuentra en el archivo. Sara lee el pasaje original y Elías deja una copia al lado. Varela pide distinguir lo comprobado de lo que se repite. El grupo conserva el archivo completo; la emisión solo llegó en parte.",
    pact:"La representante pregunta si las pruebas de la torre aclaran el cierre del sur. Elías explica que no puede consultarlas: están con Vera. Varela vuelve a las hojas nuevas de distribución. Noa recuerda que no le deben a Vera las direcciones de quienes encuentren.",
    archive:"Elías separa las pruebas de la torre de los registros nuevos. No permite que los reúnan bajo el mismo rótulo. La mujer que busca a Hernán señala ambas carpetas. «¿En alguna dice que siguen vivos?». Sara niega. «Por eso queremos ir». Los vecinos ya han visto el archivo que llegó de la torre.",
    testimony:"Sara ha escrito lo que recuerda de Irene. Elías corrige una sala y Noa añade una hora. El consejo conserva ese relato como testimonio. Las hojas de distribución hablan de otro lugar y otras fechas; no recuperan las pruebas que no llegaron de la torre."
  }[chapterProgress().completed[1].kind];
}
function cisternaIrene(){
  var f=chapterProgress().completed[1].flags;
  if(f.ireneDied)return "Sara conserva la confirmación de Irene antes de morir. Varela le pregunta si desea dejar su nombre en el registro. Ella pide que escriban también que la escucharon. Nadie ofrece una recompensa por esa respuesta.";
  if(f.irenePortable&&!f.ireneLostInEscape)return "Antes de salir, Sara comprueba que Irene quede bajo cuidado y conectada a la toma de energía. «¿Cuándo vuelven?», pregunta ella. Sara reconoce que no puede dar una hora exacta. No le pide que explique La Cisterna.";
  if(f.ireneLostInEscape)return "Noa anota el último punto donde vieron el soporte de Irene. No saben si UNO la recuperó después. Sara pide que mantengan abierta esa incertidumbre; haberla desconectado de la pared no significa que consiguieran rescatarla.";
  return "Irene quedó en la torre. Sara pide que el consejo conserve una búsqueda pendiente, sin prometer una nueva entrada. El grupo no afirma que murió ni que cumplió su petición.";
}
function cisternaChoice(id,label,hint,result,next,more){return Object.assign({id:id,label:label,hint:hint,title:label,result:result,next:next,cost:"Sin consumo",_cisterna:true},more||{})}
function cisternaEvent(ev){
  var c=cisternaState(),f=c.facts,copy=Object.assign({},ev,{choices:ev.choices.map(function(x){return Object.assign({},x)})}),r=c.receipts[ev.key];
  if(r&&!r.repeatable){copy.text=r.result;copy.choices=[cisternaChoice("receipt","Continuar desde lo registrado","Conserva lo decidido; no repite gastos ni entregas.",r.result,r.next,{receipt:true,finish:r.finish,incomplete:r.incomplete})];return copy}
  if(ev.key==="recovery")copy.text+="\n\n"+cisternaIrene();
  if(ev.key==="council"){
    copy.text=cisternaOpening()+"\n\n"+copy.text;
    if(chapterProgress().completed[1].kind==="pact")copy.choices.push(cisternaChoice("vera","Consultar a Vera antes de decidir el mandato","Cuesta 2 créditos. Solo ofrece su experiencia del comercio exterior; no devuelve el archivo.","Vera confirma que existen pequeños intercambios fuera de los ductos, sin dar una entrada de La Cisterna. «Una venta no es una alianza». Noa conserva la advertencia y no entrega información nueva.","council",{credits:2,action:"vera",condition:"vera-unused",repeatable:true,cost:"Créditos −2"}));
  }
  if(ev.key==="gate"&&f.mandate==="trade")copy.text+="\n\nSara anuncia desde el principio que llevan una propuesta de intercambio. No dice que exista un acuerdo.";
  if(ev.key==="night1"||ev.key==="night2"){
    var next=ev.key==="night1"?(f.permission==="reception"?"tour":"reception"):"proposal";
    if(f.permission!=="reception")copy.text=ev.key==="night1"?"Tomás señala una cubierta exterior desde la que pueden regresar al umbral por la mañana. No tienen permiso de entrar a las viviendas. Elías extiende el plano sobre una caja; Noa reparte las guardias. Sara vuelve a leer los nombres que lleva.":"Tomás lleva hasta el umbral el aviso de la revisión automática de las bodegas. Podrán salir por el corredor exterior. El grupo vuelve a la cubierta donde pasó la primera noche. Sara guarda las respuestas recibidas y cuenta las reservas.";
    copy.text+="\n\nLlevan "+stockCount("food")+" raciones y "+stockCount("water")+" reservas de agua. Atender las heridas permite recuperar 8 HP; quien esté agotado vuelve a 12, hasta su máximo.";
    copy.choices=[cisternaChoice("share",stockCount("food")?"Compartir una ración y descansar":"Descansar con lo que queda","Consume 1 ración y 1 agua si quedan. Con comida: energía +24. Sin comida: energía −8, moral −5. Sin agua: moral −8.","Reparten las reservas que quedan y terminan las curas. Después guardan los papeles y se acomodan para dormir.",next,{night:"share",cost:"Reservas de la noche"})];
    if(stockCount("food"))copy.choices.push(cisternaChoice("keep","Guardar la comida y descansar","Conservas la ración. Consume 1 agua si queda; energía −8 y moral −5. Sin agua: otros −8 de moral.","La ración queda sellada. Atienden las heridas y se acuestan sabiendo que el descanso no reemplaza la comida.",next,{night:"keep",cost:"Energía −8 · moral −5"}));
  }
  if(ev.key==="reception"&&f.permission!=="reception")copy.text="Teresa e Inés se sientan con el grupo en el umbral. No han mostrado las viviendas ni los cultivos por dentro.\n\n"+copy.text;
  if(ev.key==="occupation"){
    var kind=chapterProgress().completed[1].kind;
    copy.text+="\n\n"+(kind==="pact"?"Elías no lleva el archivo de la torre: su custodia sigue con Vera. La orden local que Teresa muestra es una fuente nueva.":kind==="testimony"?"Sara distingue lo que presenció en la torre de lo que Teresa cuenta ahora. Solo los registros locales permiten comprobar este episodio.":"Elías reconoce procedimientos de aislamiento presentes en las pruebas de Irene. Esa semejanza no le permite completar los nombres ni las órdenes que faltan aquí.");
  }
  if(ev.key==="letter"&&f.permission!=="reception")copy.choices.forEach(function(x){x.next="night2"});
  if(ev.key==="departure"){
    if(f.breachKnown)copy.text="Tomás acompaña al grupo hasta el límite exterior. Conservaron sus pertenencias, pero el permiso de visita está suspendido. No volverán a recepción para esperar.\n\n"+copy.text;
    else if(!f.exitMap)copy.text="El grupo reconoce desde fuera el corredor por el que llegó.\n\n"+copy.text;
    copy.choices=copy.choices.filter(function(x){return !(x.id==="wait"&&f.permission!=="reception")&&!(x.id==="board"&&!f.technicalKnowledge)});
  }
  if(ev.key==="return"){
    if(f.corridor==="helped"||f.corridor==="paid")copy.text+="\n\nLa vagoneta sigue junto a la pared. Los buscadores se fueron. El paso que abrieron permanece libre.";
    else if(f.corridor==="hostile")copy.text+="\n\nEvitan la galería del enfrentamiento. Noa guía al grupo por el tramo de inspección; no vuelven a buscar botín entre los restos.";
    else copy.text+="\n\nNoa reconoce la marca del conducto lateral y comprueba la salida antes de que crucen los demás.";
  }
  if(ev.key==="report"){
    if(!f.history)copy.text="Varela reúne al consejo. La visita acabó antes de que pudieran escuchar la historia completa de la ocupación o consultar los cultivos. Noa explica el contacto que sí tuvieron y el motivo de su salida. Nadie completa los vacíos con lo que esperaba encontrar.";
    if(!f.hernan)copy.text="La visita terminó antes de consultar los nombres. Sara se lo dice a la mujer que busca a Hernán. No trae una respuesta sobre él.\n\n"+copy.text.replace("Sara explica qué pudieron preguntar.","Sara explica por qué no pudieron preguntar.");
    if(f.letter)copy.text+="\n\n"+(f.letter==="opened"?"Sara entrega la carta y reconoce ante el destinatario que abrió el sobre. No lee su contenido ante el consejo.":"Sara entrega la carta cerrada a su destinatario.");
    if(f.privateReply)copy.text+="\n\nOtra familia recibe la respuesta autorizada: la persona vive, no desea contacto por ahora y pidió que no compartan dónde está.";
    if(f.breachKnown)copy.text+="\n\nNoa explica también por qué se suspendió la visita: "+cisternaBreachText(f.breach)+". Varela no puede presentarlo como una negativa inexplicable.";
  }
  if(ev.key==="conclusion")copy.text=cisternaStory(cisternaOutcome()).lead+"\n\n"+cisternaStory(cisternaOutcome()).refuge+"\n\n"+cisternaStory(cisternaOutcome()).group;
  return copy;
}
function cisternaBlocked(o){
  if(o.condition==="can-wait"&&cisternaState().facts.permission!=="reception")return "El permiso de recepción no está disponible";
  if(o.condition==="technical"&&!cisternaState().facts.technicalKnowledge)return "No aprendiste el circuito local";
  var f=cisternaState().facts;
  if(o.condition==="private-info"&&!f.unauthorizedMap&&!f.accessKnown&&!f.privateReply)return "No conoces datos privados que puedas entregar";
  if(o.condition==="vera-unused"&&f.veraConsulted)return "Consulta ya realizada";
  if(o.credits&&state.credits<o.credits)return "Faltan créditos";
  if(o.give){var needed=Object.values(o.give).reduce(function(a,b){return a+b},0),freed=Object.values(o.spend||{}).reduce(function(a,b){return a+b},0),space=state.party.reduce(function(a,p){return a+bagFree(p)},0);if(space+freed<needed)return "Falta espacio en las mochilas";}
  return "";
}
function chooseCisterna(i){
  if(state.finished||state.refuge.active||pending||battleState||decisionState)return;
  if(typeof fieldMaybeOffer==="function"&&fieldMaybeOffer())return;
  var ev=cisternaEvent(events[state.index]),o=ev.choices[i];if(!o||reason(o))return;
  save();encounterSaveLocked=true;
  if(o.combat){if(o.energy)drainHunger(o.energy);Object.assign(cisternaState().facts,o.combatFacts||{});startCombat(o.combat,o);return}
  completeCisternaChoice(o,o,[]);
}
function cisternaRest(key,mode,changes){
  var c=cisternaState();if(c.nights[key])return;
  var food=mode==="share"&&stockCount("food")>0,water=stockCount("water")>0,recovered=0;
  if(food){consumeStock("food");addStatItem("itemsUsed","food",1)}if(water){consumeStock("water");addStatItem("itemsUsed","water",1)}
  state.morale=clamp(state.morale+(food?0:-5)+(water?0:-8),0,100);
  state.party.forEach(function(p){var old=p.hp;p.hp=Math.min(p.maxHp,p.hp>0?p.hp+8:12);p.hunger=clamp(p.hunger+(food?24:-8),0,100);p.guard=0;p.bleed=0;recovered+=p.hp-old});
  state.engineeringUses=3;state.medicalUses=3;state.ordnanceUses=3;relaxPsyche(food&&water?2:1,food&&water?1:0);
  state.stats.rests++;state.stats.hpRestored+=recovered;state.stats.restHpRecovered+=recovered;c.nights[key]=mode;
  changes.push(["Reservas",(food?1:0)+" ración · "+(water?1:0)+" agua"],["Energía",food?"+24 por persona":"−8 por persona"],["Atención","+"+recovered+" HP entre el grupo"],["Moral",String((food?0:-5)+(water?0:-8))]);
}
function completeCisternaChoice(choice,out,extra){
  var c=cisternaState(),f=c.facts,ev=events[state.index],next=out.next===undefined?choice.next:out.next,changes=(extra||[]).slice(),text=out.result||choice.result;
  if(!choice.receipt){
    Object.keys(out.spend||{}).forEach(function(id){for(var n=0;n<out.spend[id];n++){consumeStock(id);addStatItem("itemsUsed",id,1)}changes.push([resName(id),"−"+out.spend[id]])});
    Object.keys(out.give||{}).forEach(function(id){placePartyItem(id,out.give[id]);changes.push([resName(id),"+"+out.give[id]])});
    if(out.credits){state.credits-=out.credits;changes.push(["Créditos","−"+out.credits])}
    if(out.energy&&!choice.combat){drainHunger(out.energy);changes.push(["Esfuerzo","Energía −"+out.energy+" antes de resistencia"])}
    if(out.morale){state.morale=clamp(state.morale+out.morale,0,100);changes.push(["Moral",String(out.morale)])}
    Object.assign(f,out.facts||{});pushUnique(state.docs,out.archive||[]);
    if(out.night)cisternaRest(ev.key,out.night,changes);
    if(out.action==="vera")f.veraConsulted=true;
    if(out.action==="secret-copy"){
      f.unauthorizedMap=true;
      if(random()<0.55){f.mapObserved=true;next="observed";text="Inés vuelve antes de que Elías termine el dibujo. Mira el plano abierto, después el cuaderno. Llama a Teresa.";}
      else text="Elías dobla su copia antes de que Inés vuelva. Nadie de La Cisterna ha visto lo que hizo. El grupo conserva un plano que no tenía permiso de copiar.";
    }
    if(out.action&&out.action.indexOf("report-")===0){
      f.report=out.action==="report-private"?"private-restricted":out.action==="report-request"?"new-request":"bounded";
      f.letterDelivered=!!f.letter;f.hernanReported=!!f.hernan;f.privateReplyDelivered=!!f.privateReply;
      if(out.action==="report-private")f.disclosed={map:!!f.unauthorizedMap,access:!!f.accessKnown,person:!!f.privateReply};
      if(f.contactProposal==="delivered")f.contactProposal="awaiting-ratification";
      if(f.report==="new-request")f.furtherVisitRequested=true;
    }
    // Every consequence is tied to the event that produced it; NPCs never read hidden flags.
    if(f.breachKnown){f.relationship="closed";f.contactProposal="suspended";}
    if(out.withdraw){c.resumeKey=ev.key==="gate"?"gate":"corridor";f.withdrawal=true;}
    if(next==="night1"&&f.breachKnown)next="departure";
    if(next==="report"&&!f.history&&!f.breachKnown)next="incomplete";
    if(out.night&&(state.morale<=0||state.party.some(function(p){return p.hunger<=0}))){
      c.resumeKey=next;f.withdrawal=true;next="incomplete";text+=" El grupo no reúne fuerzas para continuar. Sara pide volver por el corredor conocido antes de comprometer otra jornada.";
    }
    if(!out.repeatable&&!out.retryable&&!out.withdraw)c.receipts[ev.key]={option:choice.id,next:next,title:out.title||choice.title,result:text,finish:!!out.finish,incomplete:!!out.incomplete};
    changes=changes.concat(checkMissions());
    state.history.push({chapter:2,day:ev.day-3,loc:ev.loc,choice:choice.label,result:text});
  }
  pending={cisterna:true,next:next,finish:!!out.finish,incomplete:!!out.incomplete,refuge:!!out.refuge,preparation:!!out.preparation,dialogue:null,ending:null};
  showResult(out.title||choice.title,text,changes,null,null);render();
}
function advanceCisterna(){
  var p=pending;pending=null;encounterSaveLocked=false;$("result").classList.add("hidden");
  if(p.finish){finishCisterna(p.incomplete);return}
  state.index=cisternaIndex(p.next);if(state.index<0)throw Error("Escena siguiente de La Cisterna desconocida");
  save();render();
  if(p.refuge)openRefuge(p.preparation?"preparation":"chapter-transition");
}
function cisternaDefeat(fled){
  if(!inCisterna()||!battleState)return false;
  var choice=battleState.choice,ev=events[state.index],f=cisternaState().facts;
  state.stats.battles++;state.stats.retreats++;state.morale=clamp(state.morale-(fled?8:12),0,100);state.threat=clamp(state.threat+4,0,100);
  state.party.forEach(function(p){p.hp=Math.max(0,p.hp);p.guard=0;p.bleed=0});
  battleState=null;$("battle").classList.add("hidden");$("lootModal").classList.add("hidden");setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);
  var next=ev.key==="corridor"?"incomplete":"return";
  if(next==="incomplete")cisternaState().resumeKey="corridor";
  else {f.exit="retreat";f.unoExposure="patrol-transmission";}
  completeCisternaChoice(choice,{title:"Salir con el grupo",result:next==="incomplete"?"Noa cubre la retirada hacia el tramo mantenido. Han perdido el paso y vuelven agotados. La visita queda pendiente; no han averiguado qué ocurrió en La Cisterna.":"El grupo abandona las bodegas por la cobertura exterior. Tomás cerró el límite de las viviendas, como había avisado. Consiguen volver al corredor; la lectura de UNO ya fue enviada.",next:next,retryable:next==="incomplete"},[["Retirada","Moral −"+(fled?8:12)+" · amenaza +4"]]);
  return true;
}
function cisternaBreachText(reason){return {"pressure":"condicionaron la ayuda a la reincorporación", "side-entry":"intentaron entrar por un acceso prohibido", "map-copy":"copiaron un plano sin autorización", "disclosure":"distribuyeron información que habían prometido reservar"}[reason]||"incumplieron los límites que habían aceptado"}
function cisternaOutcome(){var f=cisternaState().facts;if(f.breachKnown)return "closed";if(f.relationship==="limited-pending")return "limited";if(f.relationship==="letters")return "letters";return "independent"}
function cisternaStory(kind){
  var f=cisternaState().facts,stories={
    limited:{title:"Una visita que podrá repetirse",lead:"La Cisterna aceptó presentar un contacto limitado en un punto exterior. El grupo llevó sus condiciones al consejo. Todavía falta ratificarlas; no se ha abierto un comercio ni una entrega de cosecha.",refuge:"El consejo acepta responder a la propuesta entera. Si quiere cambiarla, deberá volver a preguntar. Corrige el informe antiguo: sigue habiendo una comunidad, y ha elegido vivir independiente."},
    letters:{title:"Cartas entre dos comunidades",lead:"El grupo regresa con permiso para llevar la correspondencia autorizada. No hay comercio ni un punto permanente de visitas. La Cisterna conserva su forma de organizarse.",refuge:"Varela corrige el registro de la ciudadela y conserva el alcance del contacto. Que haya habitantes al otro lado no convierte su cosecha en una reserva de los Rotos."},
    independent:{title:"Sin acuerdo y en buenos términos",lead:"No se fijaron visitas futuras. Teresa aceptó una dirección de los Rotos para responder si lo desean. Haber averiguado qué ocurrió cumple el reconocimiento; no hace falta firmar un acuerdo para que el viaje haya servido.",refuge:"La representante de las reservas pregunta qué consiguieron. Sara explica lo que comprobaron. Varela deja escrito que la comunidad sigue habitada, independiente y sin autorización de contacto regular."},
    closed:{title:"Una puerta cerrada después de la visita",lead:"La comunidad suspendió el vínculo porque "+cisternaBreachText(f.breach)+". No hubo una emboscada ni una conquista. El grupo conserva sus pertenencias y los hechos que pudo comprobar.",refuge:"Noa explica el motivo ante el consejo. Las pruebas obtenidas con permiso siguen disponibles, pero no hay autorización para volver. Reparar la relación requerirá reconocer el daño y que los habitantes quieran conversar."},
    incomplete:{title:"La visita queda pendiente",lead:"El grupo regresó antes de reunir una respuesta suficiente. Conserva los documentos y el tramo reconocido. No presenta esa retirada como un reconocimiento completado.",refuge:"Varela mantiene abierta la visita. El consejo no declara muerta a la comunidad. Podrán preparar otra salida desde el punto pendiente, con los recursos y las pérdidas que quedaron."}
  };
  var s=Object.assign({},stories[kind]);
  s.group="Sara devuelve la lista. Noa deja el equipo sobre el banco. Elías tarda un momento en guardar los papeles. Cada uno vuelve con lo que pudo hacer y con lo que quedó pendiente.";
  if(f.cultivationLearned)s.group+=" Mara guarda el procedimiento que Inés autorizó compartir para mostrarlo a quienes trabajan en los cultivos.";
  if(f.seeds)s.group+=" El lote de semillas queda reservado para una prueba; no alcanza para abastecer un refugio.";
  if(f.hernan)s.refuge+=" La búsqueda de Hernán sigue sin respuesta"+(f.hernan==="query-left"?", con una consulta autorizada en La Cisterna.":".");
  if(f.letterDelivered)s.refuge+=f.letter==="opened"?" Sara entregó el sobre reconociendo que lo abrió.":" La carta llegó cerrada a su destinatario.";
  if(f.report==="private-restricted")s.refuge+=" El consejo conserva además datos que no estaban autorizados. La entrega indebida está registrada; la comunidad todavía no sabe de ella.";
  if(f.furtherVisitRequested)s.refuge+=" La solicitud de otra conversación sigue pendiente de una respuesta; no autoriza a enviar una delegación.";
  s.world=f.unoExposure==="none"?"No hubo una lectura ni un envío de UNO registrados durante la salida. La red sigue operando fuera de la ciudadela; su presencia no convierte a los habitantes en aliados del sistema.":f.unoExposure==="panel-reply"?"El tablero exterior envió una confirmación a UNO. Esa respuesta permanece registrada aunque el grupo haya cruzado sin combatir. No contiene un plano de las viviendas.":"La patrulla exterior transmitió una lectura del grupo. Ganar, huir o destruir su transmisor no retira el mensaje que ya salió. Esa exposición se conserva separada de la relación con la ciudadela.";
  s.world+=" La siguiente necesidad de los Rotos será sostener sus propios cultivos e infraestructura. La Cisterna permanece independiente.";
  return s;
}
function finishCisterna(incomplete){
  var c=cisternaState();if(c.resolution)return;
  var kind=incomplete?"incomplete":cisternaOutcome();c.resolution={version:1,kind:kind,story:cisternaStory(kind)};
  if(!incomplete)chapterProgress().completed[2]=JSON.parse(JSON.stringify(c.resolution));
  state.refuge.active=false;finish("cisterna-"+kind);
}
function retryCisterna(){
  if(!inCisterna()||!state.finished||!cisternaState().resolution||cisternaState().resolution.kind!=="incomplete")return false;
  var c=cisternaState();c.resolution=null;c.attempts++;delete c.receipts.incomplete;state.finished=false;state.ending=null;state.summarySeen=false;state.index=cisternaIndex(c.resumeKey);state.activity="story";
  ["final","summary","result"].forEach(function(id){$(id).classList.add("hidden")});
  if(typeof hideActivities==="function")hideActivities();openRefuge("chapter-retry");save();return true;
}
function chapterAction(){if(inCisterna())return retryCisterna();return startChapterTwo()}
function renderChapterActions(){
  var retry=inCisterna()&&cisternaState().resolution&&cisternaState().resolution.kind==="incomplete",available=state.finished&&(!inCisterna()||retry);
  ["finalNextChapter","summaryNextChapter"].forEach(function(id){$(id).classList.toggle("hidden",!available);$(id).textContent=retry?"Preparar otra visita":"Continuar al capítulo 2 · La Cisterna"});
  $("chapterAvailability").textContent=inCisterna()&&!retry?"Capítulo 2 de 5 · Los capítulos 3, 4 y 5 todavía no están disponibles.":"Campaña de cinco capítulos · La Voz y La Cisterna disponibles.";
}
function renderChapterContext(){
  if(!inCisterna()){$("progress").textContent="Situación "+(state.index+1)+" de 27";return}
  var ev=events[state.index],f=cisternaState().facts;
  $("day").textContent="Día "+String(ev.day-3).padStart(2,"0")+" / 03";$("stage").dataset.day=ev.day-3;
  $("chapter").textContent="Capítulo 2 · La Cisterna";$("progress").textContent=ev.part?"Escena "+ev.part+" de 12":"Transición desde La Voz";
  $("expeditionOrientation").classList.remove("hidden");$("expeditionSector").textContent="Sector actual: "+ev.loc+".";
  $("expeditionPurpose").textContent=ev.key==="incomplete"?"La visita está pendiente. Conserva lo comprobado y prepara otra salida.":f.returned?"Informar con lo que el grupo pudo comprobar y con los límites acordados.":"Averiguar qué ocurrió en La Cisterna. La visita no autoriza a incorporarla a la red de los Rotos.";
}
function cisternaMission(){
  var f=cisternaState().facts,steps=[!!f.records,!!f.departed,f.contact!=="unverified",!!f.history,!!f.returned,!!chapterProgress().completed[2]],count=steps.filter(Boolean).length;
  return {id:"cisterna",main:true,title:"La Cisterna",description:"Reconocer la comunidad y regresar con una respuesta fiel a la visita.",target:6,progress:count,reward:"Conocimiento y relaciones según lo ocurrido"};
}
function cisternaSignalHud(){
  var b=$("signalClock"),f=cisternaState().facts;b.className="signal-clock";b.disabled=true;
  $("signalTime").textContent=f.unoExposure==="none"?"EN ESPERA":"REGISTRO";$("signalStatus").textContent=f.unoExposure==="none"?"Vigilancia exterior":"Señal enviada a UNO";
  b.setAttribute("aria-label","La vigilancia se resuelve en los encuentros exteriores de La Cisterna");
}
function cisternaRefugeText(){
  if(!inCisterna())return;
  $("refugeTitle").textContent=cisternaState().attempts>1?"Preparar otra visita a La Cisterna":"Antes de partir hacia La Cisterna";
  $("refugeText").textContent="Siguen en Los Héroes. Revisen al grupo y las reservas que conservaron. El equipo, los créditos y las deudas de la expedición anterior permanecen.";
  $("refugeLeaveHint").textContent="Dos noches de viaje: compartir en cada una utiliza 1 ración y 1 agua. Hay alternativas con costos distintos durante el trayecto.";
  $("leaveRefuge").textContent="Continuar la visita a La Cisterna";
}
// Sources are distinct from the tower archives; acquiring one cannot restore lost evidence.
[
  ["cisternaRecords","Los registros de distribución","Dos hojas recuperadas cerca de Los Héroes.","Una baja del enlace de hace unos treinta años y una hoja posterior de mantenimiento local. Sugieren actividad después del cierre; no demuestran habitantes actuales."],
  ["cisternaTestimony","El testimonio de Teresa","Relato de una habitante que presenció la ocupación.","Un destacamento con autorizaciones de UNO ocupó las bodegas. Se retiró después de trasladar la distribución. Los habitantes recuperaron espacios y cerraron los conductos restantes. Teresa no conoce el destino de todos los detenidos ni las decisiones superiores."],
  ["cisternaOrder","La orden de salida","Copia local autorizada por Teresa.","El registro identifica el traslado del destacamento a otro corredor. Conserva su procedencia; se omitieron datos personales no autorizados. No explica por sí solo todas las desapariciones."],
  ["cisternaCultivation","La cubierta de los semilleros","Procedimiento compartido por Inés.","Los semilleros se protegen del frío con cubiertas y control del riego. El dibujo recibido describe el dispositivo; no contiene el trazado de depósitos, censos ni reservas. Adaptarlo requiere espacio, agua, materiales y trabajo propio."]
].forEach(function(row){archives[row[0]]=[row[1],row[2]];archiveTexts[row[0]]={classification:"La Cisterna · fuente identificada",source:row[2],date:"Visita del equipo de exploración",body:[row[3]]}});
$("finalNextChapter").addEventListener("click",chapterAction);
$("summaryNextChapter").addEventListener("click",chapterAction);
