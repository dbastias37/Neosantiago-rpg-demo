// Knowledge has a source and a scope. A successful download is not a rescue.
function evidenceIndex(){return events.findIndex(function(e){return e.title==="La máquina que recuerda"})}
function evidenceAgreement(){return state.expeditionRest?.nights[1]?.conversations?.elias?.choice||null}
function evidenceRecord(){return state.companionCommitments?.information||null}
function evidenceTogether(){return state.party.every(function(p){return p.hp>0})}
function evidenceEngineerReady(){return state.party.some(function(p){return p.id==="elias"&&p.hp>0})}
function evidenceFiles(method,outcome){
 if(outcome==="unread")return [];
 if(outcome==="partial"||method==="relay")return ["protocol"];
 if(method==="origin")return ["origin"];
 return method==="credential"?["protocol","names"]:["protocol","names","sonar"];
}
function evidenceFact(r){
 if(r.outcome==="unread")return "Salieron del Nodo 14 sin consultar el terminal. Elías necesitaba recuperarse; no hay una descarga nueva que interpretar.";
 if(r.outcome==="partial")return "La consulta quemó el núcleo y solo permitió recuperar el protocolo. La alerta llegó a la red; los nombres no se copiaron en este intento.";
 if(r.method==="relay")return "Programaron un canal para los contactos y conservaron el protocolo. No enviaron nombres ni copiaron el listado de refugios en esta consulta.";
 if(r.method==="origin")return "La bitácora vincula la transmisión con una operadora conectada a soporte vital. La hora es ilegible; leerla no confirma que ella siga viva ahora.";
 return "Recuperaron el protocolo y el listado del nodo, actualizado dieciocho meses atrás"+(r.files.includes("sonar")?", además de datos de rastreo":"")+". Es una copia legible, no un censo actual de supervivientes.";
}
function evidenceMethod(c){
 if(c.id==="tower.prepare-relay")return "relay";
 if(c.decisionId==="memory")return "core";
 if(c.flags?.h12Node14Access)return "h12";
 if(c.flags?.unit7Node14Access)return state.flags.unit7Ally?"ally":"infiltrated";
 if(c.flags?.knowOrigin)return "origin";
 if(c.flags?.fullAccess)return "credential";
 return null;
}
function companionEvidenceEvent(ev,index){
 if(state.finished)return ev;
 var r=evidenceRecord();
 if(index===24&&r)return Object.assign({},ev,{text:ev.text+" "+(r.method==="origin"?"Elías reconoce la referencia al soporte de la bitácora. Esta vez hay una mujer que los mira desde la cama; la grabación no podía decirles cómo la encontrarían.":"Elías cierra las notas del Nodo 14. Ningún listado le había dicho cómo encontrarían a la persona de esta sala.")+(r.report==="search"?" Sara deja la mochila donde pueda abrirla sin apartarse de Irene.":r.report==="bounded"?" Noa le hace espacio a Sara junto a la cama. Ahora pueden preguntarle a ella.":""),choices:ev.choices.map(function(c){return Object.assign({},c,{_evidenceVerification:true})})});
 if(index!==evidenceIndex())return ev;
 if(r)return Object.assign({},ev,{text:r.response,choices:[{label:"Continuar con lo que ya quedó registrado",hint:"Conserva la consulta y sus costos; no vuelve a descargar ni consumir un núcleo.",title:"La consulta registrada",result:r.response,fx:{},_noDialogue:true,_evidenceRecorded:true}]});
 if(!evidenceEngineerReady())return Object.assign({},ev,{text:ev.text+" Elías no puede trabajar con el terminal. El grupo conserva lo que ya sabía; no hará pasar una consulta pendiente por un hallazgo.",choices:[{label:"Continuar sin consultar el terminal",hint:"No obtiene archivos del nodo ni prepara el relé. Conserva el equipo y lo recuperado antes.",title:"El terminal queda pendiente",result:"Se apartan del terminal sin abrir otra sesión. La información que ya llevaban sigue con el grupo.",fx:{},_nodeMethod:"unread",_nodeOutcome:"unread",_noDialogue:true}]});
 var text=ev.text+" El terminal repite «identidades activas» sin mostrar una fecha. Elías baja el volumen. «Eso dice su registro. No es alguien contestando».";
 if(evidenceTogether()){
  text+=" Elías sostiene el conector, pero aún no lo inserta. "+(evidenceAgreement()==="dudas"?"«Voy a dejar las dudas como quedamos. Si hay nombres, quiero mirar también de cuándo son». ":evidenceAgreement()==="explicar"?"«Primero el riesgo, como me pidieron: el injerto consume el núcleo aunque falle; si falla, además avisa a la red». ":"«Puedo intentar leerlo. No sé si lo que encontremos seguirá siendo cierto afuera». ");
  text+=" Sara acerca el cuaderno. «Si hay alguien esperando, necesito saber dónde». Elías busca cómo responder sin prometerle una dirección útil. Noa sujeta el cable para que no arrastre: «Y yo necesito saber si vamos a buscar a una persona o a comprobar una anotación».";
 }else text+=" Elías revisa el conector. No todos pueden participar de la conversación; dejará anotado qué consiguió leer y qué quedó pendiente.";
 return Object.assign({},ev,{text:text,choices:ev.choices.map(function(c){
  var method=evidenceMethod(c);if(!method)return c;
  var out=Object.assign({},c,{_nodeMethod:method,_nodeOutcome:method==="origin"?"origin":method==="relay"?"relay":"complete",_mechanicsSource:c});
  if(method==="core")out.roll=Object.assign({},c.roll,{success:Object.assign({},c.roll.success,{_nodeOutcome:"complete",_mechanicsSource:c.roll.success,result:"El núcleo permite copiar los archivos y queda inutilizado al terminar. Elías abre la lista: hay nombres y ubicaciones, pero la actualización tiene dieciocho meses. Sara empieza a señalar una dirección y se detiene al ver la fecha."}),fail:Object.assign({},c.roll.fail,{_nodeOutcome:"partial",_mechanicsSource:c.roll.fail,result:"El contacto se calienta y Elías retira la mano. El núcleo ya no responde. En el lector solo quedó el protocolo; el indicador de envío confirma que una alerta salió del nodo. Elías busca otra vez la lista, aunque sabe que no terminó de copiarse."})});
  else if(method==="origin")out.result="Elías copia la bitácora: vincula la señal con una operadora conectada a soporte vital cerca de la torre. Sara le pide la fecha. La hora del último registro no se puede leer. «No puedo decirte cómo está ahora», responde él, y conserva la referencia para buscarla.";
  else if(method!=="relay")out.result={credential:"El lector acepta la credencial. La pantalla saluda a la técnica a quien pertenecía; nadie responde por ella. Elías copia el protocolo y el listado. Sara alcanza a preguntar por una comunidad antes de ver la fecha: dieciocho meses atrás.",ally:"S-7 presenta su registro de rescate y el nodo permite la copia. Elías revisa los nombres junto a la unidad. El acceso funcionó; la fecha del listado sigue siendo de hace dieciocho meses.",infiltrated:"La autorización de S-7 llega como una consulta de mantenimiento. Elías guarda la copia antes de cerrar el enlace. Revisa las fechas con Sara: tener acceso desde dentro no hizo más reciente el listado.",h12:"H-12 autoriza la consulta y Elías copia los archivos sin consumir un núcleo. Sara encuentra el encabezado del listado: fue actualizado dieciocho meses atrás. Elías lo conserva junto a los nombres para no perder esa advertencia."}[method];
  if(!evidenceTogether()){
   if(out.roll){[out.roll.success,out.roll.fail].forEach(function(result){result.result=evidenceFact({method:method,outcome:result._nodeOutcome,files:evidenceFiles(method,result._nodeOutcome)});});}
   else out.result=evidenceFact({method:method,outcome:out._nodeOutcome,files:evidenceFiles(method,out._nodeOutcome)});
  }
  out.hint=c.hint+(method==="origin"?" La bitácora es una pista; no comprueba su estado actual.":method==="relay"?" Prepara el canal, no recupera una lista nueva ni transmite pruebas.":method==="core"?" Consume el núcleo con éxito o fallo. Copia completa no significa datos actuales.":" Acceso al archivo no confirma quién sigue vivo hoy.");return out;
 })});
}
function evidenceBlocked(c){return c._nodeMethod&&c._nodeMethod!=="unread"&&!evidenceEngineerReady()?"Elías necesita recuperarse antes de consultar el nodo":""}
function evidenceDialogue(r){
 var question=r.outcome==="partial"?"Elías vuelve a probar el conector apagado. Sara le toca la mano para que lo deje. «Ya lo vimos. Guarda lo que sí salió». Él suelta la pieza. Le cuesta aceptar que no hay una segunda copia escondida en el lector.":r.method==="relay"?"Elías repasa las frecuencias programadas. Sara pregunta si alguien respondió. «No he enviado la llamada todavía», dice. Noa le pide que lo anote así antes de guardar el receptor.":r.method==="origin"?"Sara permanece junto al cuaderno. «Si soy yo la que está conectada, prefiero que vengan, aunque no estén seguros». Elías asiente. «También yo. Solo no quiero escribir que la vimos». Noa espera con la mochila puesta; quiere acordar qué están buscando antes de salir.":"Sara pasa el dedo por una fila sin arrancar la hoja. «En dieciocho meses puede haber nacido alguien ahí». Elías iba a descartar la dirección por antigua y deja el lápiz sobre el cuaderno. Noa les pide conservar también la fecha: entrar a buscar sigue teniendo un costo.";
 return {npc:"elias",kicker:"Antes de guardar el cuaderno",lines:[question],options:[
  {label:"Dejar por escrito lo comprobado y lo que falta saber",hint:"Conserva las dudas junto a esta consulta. No modifica la ruta ni concede recursos.",_evidenceReport:"bounded",result:"Elías escribe qué pudieron leer y debajo qué falta comprobar. Sara le pide que deje espacio para agregar noticias. Noa sostiene la hoja hasta que él termina; después vuelven a guardar el equipo."},
  {label:r.method==="origin"?"Conservar la pista como motivo para buscar a la operadora":"Conservar preguntas de búsqueda junto al registro",hint:"Expresa qué quieren averiguar al seguir la expedición; no confirma supervivientes ni abre una misión adicional.",_evidenceReport:"search",result:r.method==="origin"?"Sara pide anotar la referencia al soporte. «Quiero que la busquemos». Elías escribe la petición y deja la hora ilegible al lado. Noa les hace sitio para recoger las mochilas; aceptan avanzar sin decir que saben cómo la encontrarán.":"Sara pide que las preguntas no queden fuera de la hoja al guardar la copia. Elías las anota debajo de lo recuperado. Noa comprueba que no hayan convertido una dirección antigua o un archivo pendiente en un rescate confirmado."}
 ]};
}
function recordEvidenceDecision(choice,out){
 var r=evidenceRecord();
 if(choice._evidenceVerification&&state.index===24&&r&&!r.verified){r.verified=true;return "La presencia de Irene en la sala queda confirmada. Todavía deben escuchar qué quiere que hagan por ella.";}
 if(!choice._nodeMethod||state.index!==evidenceIndex()||r)return "";
 var outcome=out._nodeOutcome||choice._nodeOutcome,method=choice._nodeMethod;
 r={agreement:evidenceAgreement(),method:method,outcome:outcome,files:evidenceFiles(method,outcome),priorFiles:state.docs.filter(function(id){return ["protocol","names","sonar","origin"].includes(id)}),witnessed:evidenceTogether()&&method!=="unread",response:"",report:null,verified:false};
 r.response=!r.witnessed?evidenceFact(r):outcome==="partial"?"Elías no recoge todavía el lector. «Dame un momento», le dice a Noa.":method==="origin"?"Sara anota la referencia al soporte. Quiere salir, pero espera a que Elías termine de explicar qué pudo leer.":method==="relay"?"Noa espera a que Elías desconecte el cable. Sara mira las frecuencias anotadas y pregunta cuándo podrán usarlas.":"Sara vuelve al encabezado de la lista. «Nos sirve para empezar». Elías conserva la fecha junto a la copia; no quiere que alguien salga siguiendo esos datos como si fueran de hoy.";
 if(r.priorFiles.some(function(id){return !r.files.includes(id)}))r.response+=" Los documentos recuperados antes siguen disponibles; esta consulta no los borra.";
 if(r.witnessed&&r.agreement==="dudas")r.response+=" «Dejo esto pendiente, como acordamos anoche», dice Elías, señalando lo que no pudo comprobar.";
 else if(r.witnessed&&r.agreement==="explicar")r.response+=" Elías repasa lo que explicó antes de conectar. «Hasta aquí pude comprobar». Noa espera a que termine antes de recoger el cable.";
 state.companionCommitments??={version:1,care:null,route:null};state.companionCommitments.information=r;
 if(r.witnessed)choice._dialogue=evidenceDialogue(r);else choice._noDialogue=true;
 return r.response;
}
function recordEvidenceReport(opt){
 var r=evidenceRecord();if(!r||!r.witnessed||r.report||state.index!==evidenceIndex()||!["bounded","search"].includes(opt._evidenceReport))return false;
 r.report=opt._evidenceReport;return true;
}
function evidenceNightReflection(){
 var r=evidenceRecord();if(!r)return "";
 var text="Elías abre el cuaderno por el Nodo 14. "+evidenceFact(r);
 if(!r.witnessed)text+=" Ahora revisa lo recuperado sin atribuir al grupo una conversación que no pudo tener entonces.";
 else if(r.outcome==="partial")text+=" «Volví a buscar la lista aunque vi que la copia había fallado». Deja el conector quemado lejos de la taza. «No quería volver con tan poco».";
 else if(r.method==="origin")text+=" «Me preguntaste cómo estaba y no pude contestar». Sara acerca la taza antes de responder. «Te pregunté porque quería saber. No para que me dijeras que sí».";
 else if(r.method==="relay")text+=" «Dejamos a quién llamar. Todavía falta tener algo que enviar». Comprueba las frecuencias antes de cerrar esa página.";
 else if(r.outcome!=="unread")text+=" «Me alivió que abriera. Casi guardé la lista sin mirar la fecha». Sara le devuelve la hoja con el encabezado visible.";
 if(r.witnessed&&r.report==="bounded")text+=" Mantiene las dudas que decidieron dejar por escrito. «Si aparece otra versión, la pongo al lado».";
 else if(r.witnessed&&r.report==="search")text+=" Las preguntas que decidieron conservar siguen debajo de lo recuperado. Noa pregunta cuál podrán comprobar al llegar a la torre.";
 if(r.verified)text+=" El encuentro posterior con Irene ya confirmó su presencia en la torre; eso no procedía de la descarga del nodo.";
 return text;
}
function evidenceArchiveNote(id){var r=evidenceRecord();if(!r||!r.files.includes(id))return "";return "Nota de la consulta del Nodo 14: "+evidenceFact(r)+(r.verified?" Después, el grupo encontró a Irene viva en la torre. Esa comprobación pertenece al encuentro, no al archivo.":"")}
function evidenceArchivePreview(id){
 if(state.index!==evidenceIndex()&&!evidenceRecord()||!["protocol","names","origin","sonar"].includes(id)||archiveUnlocked(id))return null;
 return {summary:"Este archivo aún no ha sido recuperado.",body:["El terminal muestra una entrada para este expediente. Todavía no pudieron leer ni comprobar su contenido.","Elegir una consulta determina qué archivos podrán recuperar. Una lectura parcial o preparar el relé no equivale a descargar todos los registros."]};
}
function normalizeEvidence(){
 var ledger=state.companionCommitments;ledger.information??=null;var r=ledger.information;if(r===null)return;
 var methods=["credential","core","ally","infiltrated","h12","origin","relay","unread"],outcomes=r?.method==="core"?["complete","partial"]:[r?.method==="origin"?"origin":r?.method==="relay"?"relay":r?.method==="unread"?"unread":"complete"];
 if(!r||typeof r!=="object"||Array.isArray(r)||!methods.includes(r.method)||!outcomes.includes(r.outcome)||![null,"dudas","explicar"].includes(r.agreement)||r.agreement!==evidenceAgreement()||typeof r.witnessed!=="boolean"||typeof r.response!=="string"||typeof r.verified!=="boolean"||state.index<evidenceIndex()||r.verified&&state.index<24)throw Error("Consulta del nodo inválida");
 if(JSON.stringify(r.files)!==JSON.stringify(evidenceFiles(r.method,r.outcome))||!Array.isArray(r.priorFiles)||new Set(r.priorFiles).size!==r.priorFiles.length||!r.priorFiles.every(function(id){return ["protocol","names","sonar","origin"].includes(id)}))throw Error("Archivos del nodo inválidos");
 if(![null,"bounded","search"].includes(r.report)||!r.witnessed&&r.report!==null||r.method==="unread"&&r.witnessed)throw Error("Conversación del nodo inválida");
}
