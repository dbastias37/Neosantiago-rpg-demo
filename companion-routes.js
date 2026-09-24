// Noa's agreement is tested by a route and the obstacle actually met there.
// Rendering is pure. Outcomes commit with their existing campaign encounter.
function noaRouteIndex(){return NeoCampaignScenes.index(events,'d2-republica')}
function noaCrossingIndex(){return NeoCampaignScenes.index(events,'d2-alameda')}
function noaAgreement(){return state.expeditionRest?.nights[1]?.conversations?.noa?.choice||null}
function noaRouteRecord(){return state.companionCommitments?.route||null}
function noaCanConverse(){return state.party.every(function(p){return p.hp>0})}
function noaPathName(path){return {marks:"los patios marcados",avenue:"la salida a la avenida",wait:"la espera bajo la reja"}[path]}
function companionRouteEvent(ev,index){
 if(state.finished)return ev;
 var r=noaRouteRecord(),awake=noaCanConverse();
 if(index===noaRouteIndex()){
  if(r)return Object.assign({},ev,{text:r.departure.response,choices:[{label:"Continuar por la ruta ya elegida",hint:"No vuelve a aplicar los costos de salida.",cost:"Sin consumo adicional",title:"El rumbo registrado",result:r.departure.response,fx:{},_noDialogue:true,_noaRecorded:true}]});
  var agreement=noaAgreement(),text=ev.text+" Las marcas del muro señalan patios hacia la Alameda. El mapa no muestra si siguen conectados.";
  if(awake)text+=" "+(agreement==="motivo"?"Noa mantiene la mano sobre la reja. «Anoche quedamos en decir por qué. ¿Buscamos dónde cubrirnos, salimos rápido o esperamos a ver cómo patrullan?»":agreement==="regreso"?"Noa comprueba que la escalera siga despejada. «Me pidieron que avisara cuándo volver. Si al salir nos cubren desde dos alturas, no voy a seguir de frente sin que revisemos otra entrada». ":"Noa no abre todavía. «Puedo buscar el paso, pero necesito saber qué estamos tratando de evitar». ")+" Elías quiere acercarse a la señal; no sabe cuánto tiempo seguirá transmitiendo. Sara prefiere llegar con fuerzas para ayudar. Noa señala los patios: «Las marcas son una pista. No he visto qué hay al otro lado».";
  var labels=["Buscar cobertura siguiendo las marcas","Priorizar la señal y salir por la avenida","Observar la patrulla antes de salir"],paths=["marks","avenue","wait"];
  var results=["Siguen las marcas entre patios. Noa encuentra muros que cubren la marcha, pero el último paso desemboca al costado de la Alameda. La señal de una casa está en la vereda opuesta; todavía falta cruzar.","Abren la reja para acercarse a la señal sin buscar otro paso. Al llegar a la Alameda, un punto azul cambia de rumbo sobre las fachadas. Haber elegido salir rápido no obliga a cruzar de frente.","Esperan bajo la reja hasta ver alejarse la patrulla local. Elías escucha otra repetición de la señal antes de guardar el receptor. Salen hacia la Alameda; el intervalo que observaron no les dice qué encontrarán allí."];
  return Object.assign({},ev,{text:text,choices:ev.choices.map(function(c,i){return Object.assign({},c,{label:labels[i],_noaPath:paths[i],result:results[i],title:i===2?"Un intervalo en la vigilancia":c.title,hint:["Avanza por cobertura parcial. Las marcas no garantizan un cruce seguro. Amenaza −2; moral +2.","Acepta exposición para acercarse a la señal. Amenaza +5.","Deja pasar la patrulla de la escalera; no despeja toda la Alameda. Moral −3; amenaza −3."][i]})})});
 }
 if(index!==noaCrossingIndex()||!r)return ev;
 if(r.crossing)return Object.assign({},ev,{text:r.crossing.response,choices:[{label:"Continuar después del cruce registrado",hint:"No repite el combate ni consume otro núcleo.",cost:"Sin consumo adicional",title:"El cruce ya resuelto",result:r.crossing.response,fx:{},_noDialogue:true,_noaRecorded:true}]});
 var arrival={marks:"Los patios los han cubierto hasta aquí, pero no ofrecen un paso hasta la otra vereda.",avenue:"La salida directa los dejó frente al tramo abierto que ahora vigilan los drones.",wait:"La patrulla que dejaron pasar vigilaba la escalera. Estas dos unidades cubren otro tramo; esperar allí no despejó este cruce."}[r.departure.path];
 var text=ev.text+" "+arrival;
 if(r.setbacks)text+=" Ya intentaron combatir aquí y tuvieron que volver al refugio. Los drones siguen bloqueando el cruce; preparar otra salida no resolvió este tramo.";
 if(awake)text+=" "+(r.agreement==="regreso"&&r.departure.witnessed?"Noa se detiene. «Esto es lo que dije en la escalera: uno abajo y otro arriba. Por aquí no quiero seguir de frente. Podemos buscar el paso por debajo». ":"Noa se agacha junto a la entrada de un subterráneo. «Hasta aquí llegaba lo que habíamos visto. Abajo podemos evitar la línea de tiro, pero vamos a tener que cargar el equipo entre derrumbes». ")+(state.flags.unit7Ally||state.flags.unit7Infiltrated?"Elías señala el enlace con S-7. «Todavía tenemos su ayuda para despejar la calle». Noa espera a ver si los drones responden.":"Elías revisa si conservan un núcleo que sirva de señuelo. Sara pregunta quién cubrirá al grupo si deciden combatir.");
 return Object.assign({},ev,{text:text,choices:ev.choices.map(function(c){
  var action=c.combat?"fight":c.flags?.undergroundDetour?"detour":"signal";
  var method=action!=="signal"?null:c.flags?.unit7RescueCorridor?"ally":c.flags?.unit7FalseRouteWorked?"infiltrated":"core";
  return Object.assign({},c,{_noaObstacle:action,_noaMethod:method,_noaWarned:awake,hint:c.hint+(action==="fight"?(awake?" Mantiene el cruce por arriba pese a la objeción de Noa.":" Mantiene el cruce por arriba."):action==="detour"?" Cambia el acceso; no regresa al refugio.":" Despeja la línea de tiro antes de cruzar." )});
 })});
}
function recordNoaRouteDecision(choice){
 if(choice._noaPath&&state.index===noaRouteIndex()&&!noaRouteRecord()){
  state.companionCommitments??={version:1,care:null};
  var awake=noaCanConverse(),path=choice._noaPath,agreement=noaAgreement();
  var response=!awake?"Queda anotado el motivo de la ruta. El grupo no estaba en condiciones de conversarlo entre los tres; no lo registran como un acuerdo con Noa.":path==="marks"?"Noa adelanta unos pasos para revisar el primer patio. «Buscamos cobertura, entonces. Si las marcas terminan en una pared, paramos a mirar de nuevo». Sara espera a que compruebe el paso antes de entrar.":path==="avenue"?"Elías explica que quiere acercarse mientras la señal siga repitiéndose. Noa abre la reja. «Entiendo el motivo. Sigo prefiriendo los patios. Si hay que cambiar, lo decimos antes de cruzar». ":"Sara pide observar un recorrido antes de exponer al grupo. Noa se sienta donde puede ver la reja. Elías deja el receptor encendido; acepta esperar, aunque sigue pendiente de cada repetición.";
  state.companionCommitments.route={agreement:agreement,departure:{path:path,witnessed:awake,response:response},crossing:null,setbacks:0,lastSetback:null};return response;
 }
 var r=noaRouteRecord();if(!choice._noaObstacle||state.index!==noaCrossingIndex()||!r||r.crossing)return "";
 var awake=noaCanConverse(),action=choice._noaObstacle;
 var response=!awake||!choice._noaWarned?"El grupo supera el cruce. No todos pudieron participar de la conversación; no se registra una aprobación de Noa.":action==="detour"?"Noa comprueba la entrada del subterráneo. Sara pasa primero las mochilas y Elías ayuda a bajarlas. «Esto también cuesta», dice Noa al levantar la suya. «Por lo menos no seguimos como si esos drones no estuvieran». ":action==="fight"?"Noa espera a que dejen de caer restos antes de cruzar. «Salió. Yo había propuesto otra entrada». No discute la victoria; pide que Elías no anote que los tres habían preferido combatir.":"Noa observa cómo se alejan los drones antes de dar paso al grupo. «Ahora sí cambió algo». Cruzan la calle despejada; no tuvieron que convencerla de que la línea de tiro era segura mientras seguía ocupada.";
 r.crossing={action:action,method:choice._noaMethod,warned:choice._noaWarned,witnessed:awake,response:response};return response;
}
function recordNoaRouteSetback(choice,fled){
 var r=noaRouteRecord();if(!r||r.crossing||state.index!==noaCrossingIndex()||choice?._noaObstacle!=="fight")return "";
 r.setbacks++;r.lastSetback=fled?"fled":"exhausted";
 return "El intento de cruzar combatiendo termina en el refugio. La Alameda sigue pendiente. El registro conserva este regreso; al volver podrán elegir otra entrada o intentar de nuevo el enfrentamiento.";
}
function noaRouteNightReflection(){
 var r=noaRouteRecord();if(!r)return "";
 var text="Noa abre el mapa por la Alameda. "+(r.departure.witnessed?"«Salimos por "+noaPathName(r.departure.path)+"».":"El registro indica que salieron por "+noaPathName(r.departure.path)+"; no lo presenta como un acuerdo que no pudieron conversar.");
 if(r.setbacks)text+=" Antes de resolver el cruce tuvieron que regresar al refugio "+r.setbacks+(r.setbacks===1?" vez":" veces")+" tras intentar combatir.";
 if(!r.crossing)return text+" El registro no confirma cómo resolvieron ese cruce. Noa no completa la parte que falta con una suposición.";
 text+=" "+{detour:r.crossing.warned?"«Cambiamos al subterráneo cuando vimos los drones. Me dolían los hombros de cargar, pero pude decir por dónde no quería pasar».":"El grupo cruzó por los subterráneos. No habían podido conversar antes de bajar.",fight:r.crossing.warned?"«Cruzamos después de combatir. Yo había propuesto bajar. Ganar no significa que haya dejado de pensar que había otra opción».":"El registro confirma que combatieron para cruzar; no conserva una conversación previa entre los tres.",signal:r.crossing.method==="core"?"«Gastamos un núcleo para apartarlos. Cruzamos después de comprobar que el señuelo funcionaba».":"«S-7 despejó el cruce. Esperamos a ver retirarse a los drones antes de salir»."}[r.crossing.action];
 if(!r.crossing.witnessed)text+=" Cuando terminaron el cruce no todos podían conversar. Lo hablan ahora; no se atribuye una aprobación anterior.";
 if(r.agreement==="regreso"&&r.departure.witnessed)text+=" «Lo de avisar el límite era para momentos como ese. Cambiar de entrada y volver al refugio son decisiones distintas. Necesito poder pedir cualquiera de las dos».";
 else if(r.agreement==="motivo"&&r.departure.witnessed)text+=" «Esta vez supe el motivo antes de abrir camino. Quiero poder discutirlo también la próxima».";
 return text;
}
function normalizeNoaRoute(){
 var ledger=state.companionCommitments;ledger.route??=null;var r=ledger.route;if(r===null)return;
 if(!r||typeof r!=="object"||Array.isArray(r)||![null,"motivo","regreso"].includes(r.agreement)||r.agreement!==noaAgreement()||!r.departure||!["marks","avenue","wait"].includes(r.departure.path)||typeof r.departure.witnessed!=="boolean"||typeof r.departure.response!=="string"||state.index<noaRouteIndex())throw Error("Acuerdo de ruta inválido");
 if(!Number.isSafeInteger(r.setbacks)||r.setbacks<0||![null,"fled","exhausted"].includes(r.lastSetback)||(r.setbacks===0)!==(r.lastSetback===null)||r.setbacks>0&&state.index<noaCrossingIndex())throw Error("Regreso de ruta inválido");
 if(r.crossing!==null){var c=r.crossing;if(!c||!["fight","detour","signal"].includes(c.action)||typeof c.warned!=="boolean"||typeof c.witnessed!=="boolean"||typeof c.response!=="string"||state.index<noaCrossingIndex()||(c.action==="signal"?!["core","ally","infiltrated"].includes(c.method):c.method!==null))throw Error("Cruce de ruta inválido");}
}
