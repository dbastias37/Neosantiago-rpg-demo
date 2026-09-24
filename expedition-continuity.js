"use strict";
// Presentation only: current authored sector, no inferred metro connections or
// future scenes. Titles are existing catalog keys, not new save identifiers.
var firstDayOrientation = {
  "La señal imposible": "Decidir qué reserva pedir antes de seguir la señal.",
  "Lo que no dicen los sabios": "Acordar con qué información y compromiso saldrá el grupo.",
  "La puerta sellada": "Elegir cómo cruzar el acceso y qué recurso arriesgar.",
  "El peso de una ración": "Decidir si las reservas del grupo pueden ayudar a la familia.",
  "Tres luces rojas": "Decidir cómo atravesar el enlace ante quienes lo controlan.",
  "Agua sobre los rieles": "Encontrar un paso por la galería sin perder de vista las reservas.",
  "El campamento apagado": "Decidir cuánto investigar y qué dejar intacto.",
  "El guardián reconstruido": "Valorar si pueden asegurar la casa de bombas o deben seguir.",
  "El hombre bajo el mostrador": "Decidir qué ayuda pueden ofrecer a Matías antes de regresar."
};
function renderExpeditionOrientation(ev) {
  var panel = $("expeditionOrientation"), purpose = ev.day === 1 && firstDayOrientation[events[state.index].title];
  panel.classList.toggle("hidden", !purpose);
  if (!purpose) return;
  $("expeditionSector").textContent = "Sector actual: " + ev.loc + ".";
  $("expeditionPurpose").textContent = purpose;
}
function firstDayReturnAccount() {
  var n = state.expeditionRest && state.expeditionRest.nights[1];
  // No retroactive account for old saves, later days or ordinary field visits.
  return n && n.phase === "closed" && state.index === events.findIndex(function(e){return e.day === 2})
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
