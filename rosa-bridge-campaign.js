'use strict';
function rosaBridgeAvailable(){
  var n=state.expeditionRest&&state.expeditionRest.nights[2],f=state.flags;
  return gameSessionActive&&!state.finished&&state.index===18&&n&&n.phase==='closed'&&f.iaraAtSafeHouse&&!!(f.rosaSafeHouseMarked||f.rosaCivilNetwork)&&!f.rosaDebtClosed;
}
function rosaBridgeEligible(){return medicalSafe()&&rosaBridgeAvailable()}
function rosaBridgeCommit(next){
  if(!medicalSafe())return false;
  try{NeoRosaBridge.request(next);localStorage.setItem(KEY,JSON.stringify(Object.assign({},state,{rosaBridge:next})));state.rosaBridge=next;return true}
  catch(e){toast('No se pudo guardar la recepción. Se conserva el registro anterior.');return false}
}
function syncRosaBridge(){
  if(!medicalSafe()||!state.rosaBridge||state.rosaBridge.stage!=='requested')return;
  var next;try{next=NeoRosaBridge.receive(state.rosaBridge,JSON.parse(localStorage.getItem(WORLD_COURIER_KEY)))}catch(e){return}
  rosaBridgeCommit(next);
}
function rosaBridgeRoutePassed(){var f=state.flags;return state.index>18||!!(f.rescuedStrangers||f.lostStrangers||f.silentSurface)}
function rosaBridgeText(){
  var b=state.rosaBridge;
  if(!b)return 'Noa deja la petición de Rosa junto a las mochilas. «Iara durmió. Nos quedamos en la casa, pero necesito saber quién va a abrir si tenemos que bajar con más gente». Ana prepara una salida de familias desde Plaza de Armas. Los Mensajeros pueden acompañarlas y dejar acordada otra recepción en Los Héroes. El grupo puede seguir hacia la torre; si esperas la confirmación antes de cruzar la avenida, tendrás a quién enviar a los civiles que encuentres.';
  if(b.stage==='requested')return 'La nota de Rosa está en manos del relevo. Los Mensajeros deben recoger el añadido de Ana en Plaza de Armas y presentarlo en Los Héroes después de confirmar su encargo. Si ya acompañaron a las familias, solo falta llevar ese añadido. Rosa e Iara siguen en la casa. Puedes salir mientras se coordina la recepción.';
  if(b.stage==='delivered')return 'La responsable de Los Héroes deja la copia sobre la mesa. «A las familias de Ana ya las recibimos. Si baja más gente por esas marcas, que pregunten aquí. No los manden de puerta en puerta». Noa acerca el plano. Falta acordar con el grupo cómo usar ese relevo.';
  return (b.method==='lists'?'Rocío dejó las dos listas cotejadas con las familias. ':b.method==='contact'?'El puesto de Ana confirmó los nombres del grupo. ':'La recepción conserva la entrega anterior, sin detalles sobre cómo se corrigieron las listas. ')+(state.flags.rosaBridgeRouteUsed?'Los civiles de la avenida alcanzaron el relevo. ':rosaBridgeRoutePassed()?'La confirmación llegó después de cruzar la avenida; no cambia lo que ocurrió allí. ':'Noa marca la bajada hacia el relevo civil. Podrán guiar allí a los desconocidos de la avenida, aunque tendrán que cubrir la retirada. ')+'Rosa e Iara permanecen en la casa segura. Tener una recepción acordada no significa que ya se hayan trasladado.';
}
function renderRosaBridge(){
  var panel=$('rosaBridgePanel');if(!panel)return;
  var visible=medicalSafe()&&(rosaBridgeEligible()||!!state.rosaBridge);panel.classList.toggle('hidden',!visible);if(!visible)return;
  syncRosaBridge();var b=state.rosaBridge;$('rosaBridgeText').textContent=rosaBridgeText();
  $('rosaAccept').classList.toggle('hidden',!!b);$('rosaCouriers').classList.toggle('hidden',!b||b.stage!=='requested');$('rosaReview').classList.toggle('hidden',!b||b.stage!=='delivered');
}
function acceptRosaBridge(){
  if(!rosaBridgeEligible()||state.rosaBridge)return false;
  var requestId;try{requestId=crypto.randomUUID()}catch(e){toast('No se pudo identificar la solicitud.');return false}
  var ok=rosaBridgeCommit(NeoRosaBridge.create(requestId));if(ok)renderRefuge();return ok;
}
function reviewRosaBridge(){
  if(!medicalSafe()||!state.rosaBridge||state.rosaBridge.stage!=='delivered')return false;
  var ok=rosaBridgeCommit(NeoRosaBridge.review(state.rosaBridge));if(ok)renderRefuge();return ok;
}
function rosaBridgeEvent(ev,index){
  var f=state.flags;
  if(index===12&&f.iaraAtSafeHouse&&(f.rosaSafeHouseMarked||f.rosaCivilNetwork)&&!f.rosaDebtClosed)return Object.assign({},ev,{text:ev.text+' Entre los papeles hay una petición de Rosa para Ana: si las familias de las casas deben bajar, alguien tiene que recibirlas al otro extremo. Noa guarda una copia para coordinarlo con los Mensajeros al volver al refugio.'});
  if(!state.rosaBridge||index!==18||state.rosaBridge.stage!=='reviewed'||rosaBridgeRoutePassed()||state.flags.rosaBridgeRouteUsed)return ev;
  return Object.assign({},ev,{choices:ev.choices.concat([{label:'Guiar a los civiles hasta el relevo acordado con Ana',hint:'Hay quien los reciba al bajar. Noa cubrirá la retirada mientras Sara los guía; la patrulla seguirá en la avenida. No obtienes el código de la torre.',cost:'Agua −1 · Amenaza +3',req:{water:1},title:'Alguien espera abajo',result:'Sara reparte agua y pide que bajen juntos. Noa atrae el visor hacia el otro extremo de la galería; cuando vuelve, la última mujer ya está junto a la responsable del relevo. «Vienen por el acuerdo de Ana», dice Sara. La puerta se abre. El grupo sigue hacia la torre por una salida lateral. La patrulla permanece arriba: han sacado a esas personas, no despejado la avenida.',fx:{water:-1,threat:3,morale:3},flags:{rescuedStrangers:true,rosaBridgeRouteUsed:true}}])});
}
$('rosaAccept').addEventListener('click',acceptRosaBridge);
$('rosaReview').addEventListener('click',reviewRosaBridge);
$('rosaCouriers').addEventListener('click',function(){if(medicalSafe()&&state.rosaBridge){openActivityMenu();openCourierActivity('rosa')}});
