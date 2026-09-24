"use strict";
// Presentation only: current authored sector, no inferred metro connections or
// future scenes. Purpose text follows authored scene IDs, not mutable titles.
var firstDayOrientation = {
  "d1-signal": "Decidir qué reserva pedir antes de seguir la señal.",
  "d1-council": "Acordar con qué información y compromiso saldrá el grupo.",
  "d1-gate": "Elegir cómo cruzar el acceso y qué recurso arriesgar.",
  "d1-ration": "Decidir si las reservas del grupo pueden ayudar a la familia.",
  "d1-red-lights": "Decidir cómo atravesar el enlace ante quienes lo controlan.",
  "d1-flood": "Encontrar un paso por la galería sin perder de vista las reservas.",
  "d1-camp": "Decidir cuánto investigar y qué dejar intacto.",
  "d1-pump": "Valorar si pueden asegurar la casa de bombas o deben seguir.",
  "d1-matias": "Decidir qué ayuda pueden ofrecer a Matías antes de regresar."
};
function communityRoutePurpose(id){
  if(id==='d2-drone-pulse'||id==='d2-republica'){
    var medical=state.matiasBridge;
    if(!medical)return '';
    if(medical.stage==='reviewed'&&!medicalRoutePassed())return 'Noa lleva la corrección de Matías: observa la marca baja antes de cruzar República. La atención de Matías continúa en Los Héroes.';
    if(medical.stage==='requested')return 'La reserva médica sigue en camino con los Mensajeros. Puedes continuar; una indicación nueva solo serviría si se confirma antes de salir de República.';
    if(medical.stage==='delivered')return 'La posta recibió la reserva para Matías. Habla con él en Los Héroes antes de cruzar República si quieres aprovechar su indicación.';
    return '';
  }
  if(id==='d3-avenue'){
    var rosa=state.rosaBridge;
    if(!rosa)return '';
    if(rosa.stage==='reviewed'&&!rosaBridgeRoutePassed())return 'El acuerdo de Ana permite guiar a los civiles hasta Los Héroes gastando agua. Noa cubrirá la retirada; la patrulla permanecerá en la avenida.';
    if(rosa.stage==='requested')return 'Rosa e Iara siguen en la casa segura. El relevo civil aún no está confirmado; decide cómo ayudar a los desconocidos con los medios disponibles.';
    if(rosa.stage==='delivered')return 'El relevo llegó a Los Héroes, pero falta revisarlo con Noa. Decide el cruce con los recursos y rutas ya confirmados.';
  }
  return '';
}
function renderExpeditionOrientation(ev) {
  var panel = $("expeditionOrientation"), id=events[state.index].id, purpose = ev.day === 1 ? firstDayOrientation[id] : communityRoutePurpose(id);
  panel.classList.toggle("hidden", !purpose);
  if (!purpose) return;
  $("expeditionSector").textContent = "Sector actual: " + ev.loc + ".";
  $("expeditionPurpose").textContent = purpose;
}
function firstDayReturnAccount() {
  var n = state.expeditionRest && state.expeditionRest.nights[1];
  // No retroactive account for old saves, later days or ordinary field visits.
  return n && n.phase === "closed" && NeoCampaignScenes.at(events,state.index,'d2-drone-pulse')
    && typeof n.returnAccount === "string" ? n.returnAccount : "";
}
function renderExpeditionPreparation() {
  var day=events[state.index].day, preparing = state.refuge.reason === "preparation", account = firstDayReturnAccount();
  $("refugeReturnAccount").classList.toggle("hidden", !account);
  $("refugeRest").textContent = preparing ? "Descanso nocturno aplicado" : "Descansar y estabilizar";
  if (preparing) {
    if(day===3){$("refugeTitle").textContent="Antes de subir a la torre";$("refugeText").textContent="El grupo terminó la segunda noche. Queda revisar las reservas y los mensajes de la red antes de volver a la superficie.";}
    $("refugeRest").disabled = true;
    $("refugeRejoin").disabled = true;
    $("refugeRejoin").textContent = "Equipo reunido durante la noche";
    if (activeRefugeNpc() === "mara") $("traderDialogue").textContent = "«Revisen lo que les queda antes de salir. Si necesitan cambiar algo, vemos qué alcanza con lo que trajeron.»";
    $("refugeLeaveHint").textContent = "El descanso y las reservas de la noche ya están registrados. Revisa mochilas y equipo; comerciar es opcional y conserva los precios del puesto.";
  }
  $("leaveRefuge").textContent = preparing ? "Preparar salida · día "+day : "Volver a la expedición";
}

$("refugeReturnButton").addEventListener("click", function(){openRefugeHelp("return", $("refugeReturnButton"))});
