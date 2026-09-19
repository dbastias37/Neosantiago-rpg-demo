// A negotiation records what was actually exchanged, not an inferred moral label.
function veraIndex(){return events.findIndex(function(e){return e.title==="El precio de la ruta"})}
function veraTrade(){return state.companionCommitments?.trade||null}
function veraTogether(){return state.party.every(function(p){return p.hp>0})}
function veraHasList(){return archiveUnlocked("names")}
function veraRoom(kind){return hasPartyItem("radio")||state.party.some(function(p){return bagFree(p)>0||kind==="work"&&bagQty(p,"scrap")>0})}
function veraBlocked(c){
 var kind=c._veraTrade||c._veraAttempt;
 if(!kind)return "";
 if(state.index!==veraIndex()||veraTrade())return "El trato ya no está disponible";
 if(kind==="list"&&!veraHasList())return "No han recuperado el listado de refugios";
 if(kind==="work"&&!state.party.some(function(p){return p.id==="elias"&&p.hp>0}))return "Elías necesita recuperarse para reparar la bomba";
 if(!["leave","caught"].includes(kind)&&!veraRoom(kind))return "Libera un espacio para la radio antes del intercambio";
 return "";
}
function veraOption(kind){
 var options={
  debt:{label:"Pedir que reconozca la ayuda a los cazadores",hint:"Requiere haber ayudado en el andén o rescatado al cazador. Recibe radio sin revelar ubicaciones.",reqFlags:["huntersTrust","savedHunter"],fx:{threat:-4,morale:4},flags:{huntersAlliance:true,veraHonorsHunterDebt:true},add:["radio"],result:"El cazador de guardia confirma la ayuda que recibió su gente. Vera deja de discutir el precio. «Eso se paga», dice, y acerca el módulo sin pedir una dirección."},
  work:{label:"Reparar la bomba de agua a cambio de la radio",hint:"Utiliza 1 chatarra y requiere a Elías en condiciones. No entrega ubicaciones.",cost:"Chatarra −1",req:{scrap:1},fx:{scrap:-1,morale:2,threat:-2},flags:{veraWorkTrade:true},add:["radio"],result:"Elías reemplaza el contacto roto con la pieza que traían. La bomba vuelve a mover agua y Vera llena un vaso antes de entregar el módulo. «Tenía a dos personas turnándose con esa palanca». Lo prueba una vez más; no les pide nombres."},
  line1:{label:"Revelar el acceso de su propio refugio en Línea 1",hint:"Vera conocerá cómo llegar a su comunidad. Obtiene radio; no puede retirar lo que ella aprenda.",cost:"Moral −10 · amenaza −2",fx:{morale:-10,threat:-2},flags:{soldRefuge:true,veraLine1Disclosed:true},add:["radio"],result:"Señalan el acceso por el que vuelve su propia comunidad. Vera lo copia en una hoja aparte antes de acercar el módulo. Ya puede llegar hasta allí sin que el grupo la guíe."},
  list:{label:"Entregar una copia del listado antiguo de refugios",hint:"Requiere el expediente recuperado. Entrega sus ubicaciones registradas, de hace 18 meses, sin confirmar quién vive allí ahora.",cost:"Moral −6 · amenaza −1",fx:{morale:-6,threat:-1},flags:{soldRefuge:true,veraOldListDisclosed:true},add:["radio"],result:"Elías conserva el encabezado con la fecha de hace dieciocho meses al hacer la copia. Vera revisa las ubicaciones. «Esto no me dice quién sigue ahí». Aun así, acepta el registro como punto de partida y entrega el módulo. El grupo conserva su documento; ya no es el único que puede usarlo."},
  leave:{label:"Terminar la conversación sin hacer un trato",hint:"Continúa sin una radio nueva ni la ayuda de Vera. Conserva materiales y ubicaciones.",cost:"Amenaza +2",fx:{threat:2},flags:{veraDealDeclined:true},result:"Vera retira el módulo de la mesa. Noa recoge el equipo y busca el paso hacia la salida. El grupo continúa sin su cobertura; las mochilas y los papeles siguen con sus dueños."}
 };
 var o=Object.assign({},options[kind]);o._veraTrade=kind;o._mechanicsSource={fx:o.fx};return o;
}
function veraTermsDialogue(mode){
 var information=mode==="information",lines=information?["Vera desplaza el módulo hasta el centro de la mesa. «No me sirve una dirección que se les ocurrió recién». El acceso de Línea 1 lo conocen porque viven allí. Entregarlo afecta a quienes los esperan abajo.",veraHasList()?"También conservan el listado de refugios, fechado dieciocho meses atrás. Vera acepta revisar una copia con esa advertencia. No ofrece devolver lo aprendido si después se arrepienten.":"No llevan el listado recuperado de refugios. Haber oído hablar de otras comunidades no les permite inventar una dirección. Pueden hablar de su propio acceso o cerrar la conversación."]:["Vera deja una pieza rota junto al módulo. «La bomba está fallando. Puedo pagar trabajo». Uno de sus guardias se queda junto a la mesa; si ayudaron a los cazadores, también puede reconocer esa deuda.","«No les voy a pedir una dirección por arreglarla», añade. Sara mira la pieza y después las reservas. Noa pregunta qué pasa si no aceptan nada. Vera guarda el lápiz: «Se van sin mi ayuda». "];
 if(!veraTogether())lines=information?["Vera espera una oferta concreta: el acceso que el grupo conoce de Línea 1 o, si lo recuperó, el listado antiguo. No todos están en condiciones de discutirlo entre sí. Todavía pueden retirarse sin entregar información."]:["Vera ofrece intercambiar la radio por la reparación de la bomba o reconocer una ayuda previa a los cazadores. No todos pueden conversar entre sí. Reparar requiere que Elías esté en condiciones; retirarse sigue siendo posible."];
 return {npc:"vera",kicker:information?"Qué información sale de sus manos":"Otra forma de pagar",lines:lines,options:information?[veraOption("line1"),veraOption("list"),veraOption("leave")]:[veraOption("debt"),veraOption("work"),veraOption("leave")]};
}
function veraNegotiationEvent(ev,index){
 var r=veraTrade();
 if(index===20&&r?.kind==="contract"&&!r.cancelled)return Object.assign({},ev,{choices:ev.choices.map(function(c){return c.id==="tower.align-relay"?Object.assign({},c,{_veraCancel:true,hint:c.hint+" Vera dejará de ser la extracción acordada."}):c})});
 if(index!==veraIndex()||state.finished)return ev;
 if(r)return Object.assign({},ev,{text:r.response,choices:[{label:"Continuar después del trato registrado",hint:"No vuelve a entregar ubicaciones, consumir materiales ni recibir otra radio.",title:"Lo que ya se acordó",result:r.response,fx:{},_noDialogue:true,_veraRecorded:true}]});
 var base=ev.choices.find(function(c){return c.decisionId==="coordinates"}),contract=ev.choices.find(function(c){return c.id==="tower.vera-contract"});
 var text="Vera hace sitio en una mesa que comparte con una bomba desmontada. Un guardia acerca dos recipientes vacíos y ella los aparta con el pie. Necesita pasos por donde mover agua y provisiones sin perder otro turno cargando a mano. Ofrece un módulo de radio y su cobertura a cambio de información útil.";
 if(veraTogether())text+=" Sara mantiene cerrado el cuaderno. «¿Quién vive donde quieres entrar?». Vera le devuelve la pregunta: «Eso me lo tienen que decir ustedes». Noa mira el módulo; les serviría en la torre. Elías recuerda que una ubicación escrita no dice cómo está hoy la gente que vive allí.";
 else text+=" No todos están en condiciones de discutir la oferta. Vera no pide una respuesta inmediata; pueden revisar las condiciones o seguir sin su ayuda.";
 if(hasPartyItem("radio"))text+=" Ya llevan una radio: el trato puede darles cobertura o reservar un canal, no una segunda unidad.";
 text+=" Pueden negociar con trabajo o una deuda real, elegir qué información entregar, intentar engañarla o comprometer los archivos futuros de la torre.";
 var bluff=Object.assign({},base,{_veraAttempt:"bluff",_mechanicsSource:base,hint:"Intenta conseguir la radio sin dar una ubicación real. Si falla, Vera se vuelve hostil; no obtiene el módulo.",roll:Object.assign({},base.roll,{success:Object.assign({},base.roll.success,{_veraTrade:"bluff",_mechanicsSource:base.roll.success,result:"Vera compara el trazado con sus marcas y acepta la ruta falsa. Guarda la hoja sin saber que no conduce a la comunidad que le prometieron. El grupo consigue el módulo, pero no puede saber quién tendrá que recorrer después ese desvío."}),fail:Object.assign({},base.roll.fail,{_veraTrade:"caught",_mechanicsSource:base.roll.fail,result:"Vera detiene el lápiz en un cruce. «Estos túneles no conectan». Retira el módulo y llama al guardia. El grupo se marcha sin la radio ni su cobertura; ella conserva el recuerdo del engaño, no una ubicación verdadera."})})});
 var choices=[bluff,{label:"Negociar sin entregar ubicaciones",hint:"Puede invocar una ayuda real, reparar con 1 chatarra o retirarse. Abrir la conversación aún no hace el intercambio.",title:"El cuaderno queda cerrado",result:"Vera deja el mapa a un lado y muestra la pieza de la bomba. Todavía no ha entregado la radio ni recibido un pago.",fx:{},_mechanicsSource:{},_veraOpening:true,_dialogue:veraTermsDialogue("work")},{label:"Revisar qué información podrían entregar",hint:"Distingue su propio acceso del listado antiguo, si lo recuperaron. Todavía puede negarse al trato.",title:"Antes de abrir el mapa",result:"Vera espera mientras revisan lo que realmente conocen. Ninguna ubicación ha salido todavía de sus manos.",fx:{},_mechanicsSource:{},_veraOpening:true,_dialogue:veraTermsDialogue("information")}];
 if(contract)choices.push(Object.assign({},contract,{_veraTrade:"contract",_mechanicsSource:contract,hint:"Recibe radio y reserva escolta a cambio de las pruebas que consiga sacar de la torre. Cancela el relé civil preparado. Todavía no entrega archivos ni ubicaciones.",result:"Vera prueba una frecuencia y señala la escalera donde esperará su escolta. «Si salen con el archivo, me lo entregan». Elías pregunta por las direcciones privadas. «No forman parte del pago», acuerdan. La radio queda en ese canal; la copia nueva de las pruebas será de Vera si cumplen el trato."}));
 return Object.assign({},ev,{text:text,choices:choices});
}
function recordVeraTrade(opt){
 if(!opt._veraTrade||state.index!==veraIndex()||veraTrade())return false;
 var kind=opt._veraTrade,r={kind:kind,source:kind==="line1"?"home":kind==="list"?"archive-names":null,witnessed:veraTogether(),hadRadio:hasPartyItem("radio"),cancelled:false,response:opt.result};
 if(kind==="list"&&!veraHasList())return false;
 if(!r.witnessed)r.response=veraTradeFact(r);
 else if(r.hadRadio&&!["leave","caught"].includes(kind))r.response={
  debt:"El guardia confirma la ayuda que recibió su gente. Vera reconoce la deuda y acuerda dar cobertura al grupo. Comprueba la frecuencia en la radio que ya llevan.",
  work:"Elías reemplaza el contacto roto con la pieza que traían. La bomba vuelve a mover agua. Vera llena un vaso, reconoce el trabajo y acuerda darles cobertura. Usan la radio que ya llevaban.",
  line1:"El grupo señala su propio acceso de Línea 1. Vera lo copia en una hoja aparte y confirma el trato usando la radio que ya llevan. Ahora conoce esa entrada sin necesitar que la guíen.",
  list:"Elías entrega la copia con su fecha de hace dieciocho meses. Vera acepta que no confirma quién sigue ahí. Guarda el listado y comprueba la frecuencia en la radio del grupo para darles cobertura.",
  bluff:"Vera acepta el trazado falso y lo guarda para mandarlo a revisar. Comprueba la frecuencia en la radio que ya lleva el grupo y les ofrece su cobertura. No ha descubierto el engaño.",
  contract:"Vera reserva su escolta a cambio de las pruebas que consigan sacar de la torre, sin direcciones privadas. Deja la radio que ya llevan en el canal acordado. El relé civil anterior deja de ser la vía preparada."
 }[kind];
 if(!["leave","caught"].includes(kind)&&r.hadRadio)r.response+=" No reciben una segunda unidad.";
 state.companionCommitments??={version:1,care:null};state.companionCommitments.trade=r;opt.result=r.response;return true;
}
function recordVeraDecision(choice,out){
 var r=veraTrade();if(choice._veraCancel&&r?.kind==="contract"&&!r.cancelled&&out.flags?.veraExtractionReserved===false){r.cancelled=true;return "Elías retira del receptor la frecuencia acordada con Vera. Desde ahora tendrán que salir sin esa extracción. No le habían entregado los archivos futuros.";}
 if(!out._veraTrade||!recordVeraTrade(out))return "";
 r=veraTrade();
 if(r.kind==="bluff"||r.kind==="caught")choice._dialogue={npc:"vera",kicker:r.kind==="bluff"?"El mapa que se lleva":"La oferta se cierra",lines:[r.kind==="bluff"?"Vera dobla la hoja y la guarda con sus recorridos del día. «Voy a mandar a alguien a revisar». No ha descubierto la mentira. El grupo oye lo que piensa hacer con ella antes de salir.":"Vera deja la mano sobre el módulo. «No voy a mandar a nadie por un túnel que no existe». El guardia abre la salida. No ofrece un segundo premio por haberla escuchado."],options:[{label:"Recoger el equipo y salir",hint:"Conserva lo ocurrido. No añade otra recompensa.",result:r.kind==="bluff"?"El grupo sale con la radio y sin saber a quién enviará Vera por el recorrido inventado.":"Se alejan del puesto sin la radio de Vera. El intento de engaño queda registrado.",_mechanicsSource:{}}]};
 return "";
}
function veraTradeFact(r){
 return {line1:"Vera conserva el acceso de Línea 1. Cambiar de opinión ahora no borra lo que le entregaron.",list:"Vera tiene una copia del listado de hace dieciocho meses. El grupo conserva el suyo, pero ya no controla quién consultará esas ubicaciones.",work:"La bomba del puesto volvió a funcionar con una pieza del grupo. Pagaron el módulo con trabajo y chatarra, sin entregar ubicaciones en ese trato.",debt:"Vera reconoció la ayuda a los cazadores. La radio no se pagó con una dirección.",leave:"Dejaron el puesto sin aceptar un intercambio. Conservan los datos, pero no cuentan con la cobertura que Vera ofrecía.",bluff:"Vera se quedó con un recorrido inventado. No conocen a quién enviará a comprobarlo.",caught:"Vera detectó el engaño. No entregó el módulo y cerró su ayuda al grupo.",contract:"La frecuencia de Vera quedó reservada para salir de la torre. El pago será la copia de las pruebas que consigan recuperar, sin las direcciones privadas."}[r.kind];
}
function veraNightContext(){
 var r=veraTrade();if(!r)return "";var fact=veraTradeFact(r);
 if(!r.witnessed)return "Al preparar el descanso revisan el trato con Vera. "+fact+" No lo presentan como una decisión que los tres hubieran podido discutir.";
 var exchange=r.kind==="line1"?"Sara pregunta quién se lo dirá a Mara. Noa deja de ordenar la mochila. «Tenemos que decir qué entrada marcamos». Elías busca la hoja donde anotarlo.":r.kind==="list"?"Elías recuerda que conservó la fecha en la copia. Sara asiente. «La fecha no les avisa a los que puedan seguir viviendo ahí». Él no la quita de la anotación.":r.kind==="contract"?"Sara pide repetir qué prometieron. Elías distingue las pruebas de las direcciones privadas. Noa señala que la escolta depende de que consigan salir con la copia; todavía no es un rescate cumplido.":r.kind==="bluff"?"Noa vuelve al cruce que inventaron. «Dijo que iba a mandar a alguien». Sara pregunta si podrán avisar. Ninguno tiene una respuesta que pueda prometer esta noche.":r.kind==="work"?"Elías se limpia las manos antes de abrir el cuaderno. Noa aparta el módulo para hacerle sitio. Sara pregunta cuánto material les quedó; repararla resolvió el trato, no todas las necesidades del grupo.":r.kind==="debt"?"Noa prueba la radio con el volumen bajo. Sara le pide que la apague un momento: quiere sentarse sin otra voz encima. Elías deja el aparato al alcance para revisarlo después.":"Noa revisa el siguiente tramo sin el apoyo de Vera. Sara deja espacio para el mapa entre las reservas; todavía tienen que ponerse de acuerdo sobre cómo seguir.";
 return fact+" "+exchange;
}
function veraFinaleStory(story,kind){
 var r=veraTrade();if(!r)return story;story=Object.assign({},story);
 if(r.kind==="line1")story.refuge+=" Al contar el trato, Mara pregunta exactamente qué entrada conoce Vera. El grupo señala la misma que le entregó. No hay noticias de un ataque; tampoco pueden afirmar que el acceso siga siendo secreto.";
 else if(r.kind==="list")story.refuge+=" Elías explica que Vera recibió el listado antiguo. Mara pregunta quién podría seguir en esas direcciones. El grupo no tiene una comprobación reciente ni da por hecho que todas estén vacías.";
 else if(r.kind==="contract")story.refuge+=kind==="pact"?" El pago corresponde a las pruebas; las direcciones privadas quedaron fuera del acuerdo.":r.cancelled?" El grupo cuenta que cambió el canal y canceló la extracción de Vera antes de llegar a la torre. La reserva no se presenta como una ayuda recibida.":" El acuerdo con Vera no se concretó como extracción con entrega de archivos. Haberlo reservado no equivale a haberlo cumplido.";
 else if(r.kind==="bluff")story.world+=" El recorrido falso quedó en manos de Vera. No llegaron noticias que permitan asegurar qué ocurrió con quienes ella pensara enviar.";
 return story;
}
function normalizeVeraTrade(){
 var ledger=state.companionCommitments;ledger.trade??=null;var r=ledger.trade;if(r===null)return;
 if(!r||typeof r!=="object"||Array.isArray(r)||!["line1","list","work","debt","leave","bluff","caught","contract"].includes(r.kind)||r.source!==(r.kind==="line1"?"home":r.kind==="list"?"archive-names":null)||typeof r.witnessed!=="boolean"||typeof r.hadRadio!=="boolean"||typeof r.cancelled!=="boolean"||typeof r.response!=="string"||state.index<veraIndex()||r.cancelled&&(r.kind!=="contract"||state.index<20))throw Error("Trato de Vera inválido");
}
