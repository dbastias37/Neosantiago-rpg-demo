/* Safe-boundary adapter. The campaign imports receipts, never courier inventory. */
'use strict';
function medicalEligible(){var n=state.expeditionRest&&state.expeditionRest.nights[1];return !!(NeoBridgeContext.variant&&gameSessionActive&&!state.finished&&state.refuge.active&&state.index===9&&state.flags.matiasAtRefuge&&n&&n.phase==='closed')}
function medicalSafe(){return !!(NeoBridgeContext.variant&&gameSessionActive&&!state.finished&&state.refuge.active&&!encounterSaveLocked&&!battleState&&!pendingNight())}
function medicalBlocked(){return !!(NeoBridgeContext.variant&&state.matiasBridge&&NeoCommunityBridge.blocked(state.matiasBridge))}
function medicalCommit(next){
  if(!medicalSafe())return false;
  try{NeoCommunityBridge.request(next);var snapshot=Object.assign({},state,{matiasBridge:next});localStorage.setItem(KEY,JSON.stringify(snapshot));state.matiasBridge=next;return true}
  catch(e){toast('No se pudo guardar el relevo. La solicitud anterior se conserva.');return false}
}
function syncMedicalBridge(){
  if(!medicalSafe()||!state.matiasBridge||state.matiasBridge.stage!=='requested')return;
  var next;
  try{next=NeoCommunityBridge.receive(state.matiasBridge,JSON.parse(localStorage.getItem(NeoBridgeContext.key('neosantiago.mensajeros.production.v1'))))}catch(e){return}
  medicalCommit(next);
}
function medicalText(){
  var b=state.matiasBridge;
  if(!b)return 'Sara sale de la posta con un papel doblado. «La fiebre bajó, pero aquí no tenemos todo lo que necesita. En Vicuña apartaron una reserva a su nombre. Los Mensajeros pueden traerla. Adasme coordina allí una búsqueda: le falta un hombre, Darío. Voy a pedirles que hablen con él, no a prometer que puedan hacerlo todo». '+(NeoBridgeContext.variant==='A'?'Si te haces cargo, el grupo esperará el relevo antes de salir. Puedes devolver la coordinación a la posta.':'Puedes seguir la expedición mientras viajan. Para aprovechar una nueva indicación de Matías tendrás que volver a escucharlo antes de pasar por República.');
  if(b.stage==='requested')return (b.delegated?'Sara deja la coordinación en manos de la posta. El grupo puede salir; la entrega sigue pendiente. ':'La solicitud quedó anotada. Matías permanece al cuidado de la posta. ')+(b.variant==='A'&&!b.delegated?'El grupo espera este relevo antes de salir. ':'')+'Los Mensajeros deben recoger la reserva en Vicuña y traerla a Los Héroes. Un encargo en curso debe terminar o devolverse antes de iniciar ese viaje. No hay una muerte por cuenta atrás.';
  if(b.stage==='delivered')return 'La posta confirma la recepción. El paquete lleva el nombre de Matías y el registro de Vicuña. Sara lo abre junto a la cama y coteja lo que llegó con su solicitud. «Ahora sí podemos continuar. Que se quede aquí; no está para volver a los túneles». Habla con él durante el siguiente relevo de la posta.';
  return (b.source==='rescue'?'«¿Darío? ¿Así se llama el que trajeron?», pregunta Matías. Sara asiente. Él vuelve a acomodar la manta antes de seguir. ':'Matías pregunta por el hombre que buscaba Adasme. Sara le dice que esta entrega no confirma su regreso. Él asiente sin insistir. ')+(state.index>10?'La indicación que añade sobre República llega después del paso del grupo. La entrega sigue importando, aunque ya no puede cambiar ese recorrido.':'Sobre el papel señala un hueco bajo la escalera de República. «Me confundí al explicarlo. La marca baja, no la de la pared. Desde ahí se puede ver el barrido antes de salir». Noa lo copia. Matías se queda en la posta; la indicación podrá usarse en La primera luz.')+(state.flags.matiasBridgeRouteUsed?' Noa ya utilizó esa indicación al cruzar República.':'');
}
function renderMedicalBridge(){
  var panel=$('medicalBridgePanel'),visible=medicalSafe()&&(medicalEligible()||!!state.matiasBridge);
  panel.classList.toggle('hidden',!visible);if(!visible)return;
  syncMedicalBridge();var b=state.matiasBridge;
  $('medicalBridgeText').textContent=medicalText();
  $('medicalAccept').classList.toggle('hidden',!!b);
  $('medicalCouriers').classList.toggle('hidden',!b||b.stage!=='requested');
  $('medicalDelegate').classList.toggle('hidden',!b||b.delegated||b.stage==='reviewed');
  $('medicalReview').classList.toggle('hidden',!b||b.stage!=='delivered');
  if(medicalBlocked()){$('leaveRefuge').disabled=true;$('refugeLeaveHint').textContent='Esperas el relevo de Matías. Puedes completar la entrega o devolver la coordinación a la posta.'}
}
function acceptMedicalBridge(){
  if(!medicalEligible()||state.matiasBridge)return false;
  var requestId;
  try{requestId=crypto.randomUUID()}catch(e){toast('Este navegador no permite crear una solicitud segura.');return false}
  var ok=medicalCommit(NeoCommunityBridge.create(requestId,NeoBridgeContext.variant));if(ok)renderRefuge();return ok;
}
function reviewMedicalBridge(){
  if(!medicalSafe()||!state.matiasBridge||state.matiasBridge.stage!=='delivered')return false;
  var ok=medicalCommit(NeoCommunityBridge.review(state.matiasBridge));if(ok)renderRefuge();return ok;
}
function delegateMedicalBridge(){
  if(!medicalSafe()||!state.matiasBridge)return false;
  var ok=medicalCommit(NeoCommunityBridge.delegate(state.matiasBridge));if(ok)renderRefuge();return ok;
}
function medicalBridgeEvent(ev,index){
  if(!NeoBridgeContext.variant||!state.matiasBridge)return ev;
  var result=Object.assign({},ev);
  // Parallel teams have no shared clock. Keep scene order without pretending their hours synchronize.
  if(ev.day===2)result.time='Después del relevo';
  if(index!==10||state.matiasBridge.stage!=='reviewed'||state.flags.matiasBridgeRouteUsed)return result;
  result.choices=ev.choices.concat([{label:'Observar desde el acceso que precisó Matías',hint:'Noa reconoce la marca baja. Esperan a cubierto el barrido del sensor. Solo está disponible antes de cruzar República.',cost:'Amenaza −2',title:'La marca junto al suelo',result:'Noa encuentra la pintura bajo el peldaño. Desde el hueco observan el primer sensor y suben sin salir de golpe a su barrido. La Alameda sigue pendiente: esta indicación no despeja el cruce. Sara guarda el papel para devolverlo a Matías. La posta sigue cuidándolo, pero esta vez pudieron entender lo que intentaba explicar.',fx:{threat:-2},flags:{matiasBridgeRouteUsed:true},_noaPath:'wait'}]);return result;
}
$('medicalAccept').addEventListener('click',acceptMedicalBridge);
$('medicalReview').addEventListener('click',reviewMedicalBridge);
$('medicalDelegate').addEventListener('click',delegateMedicalBridge);
$('medicalCouriers').addEventListener('click',function(){if(medicalSafe()&&state.matiasBridge){openActivityMenu();openCourierActivity()}});
