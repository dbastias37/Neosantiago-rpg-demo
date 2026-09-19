"use strict";

// Read only the durable delivery receipt. Neither team writes the other's save.
// A fact is learned at a safe boundary; its benefit is spent on an explicit departure.
var WORLD_COURIER_KEY="neosantiago.mensajeros.production.v1";
var WORLD_MORALES_FACT="morales-corridor-report";
var worldNewsOpen=false;

function worldContinuityReceipt(text){
  try{
    var source=JSON.parse(text),id="morales-01",r=source&&source.completed&&source.completed[id];
    if(!source||source.schema!==1||source.mode!=="production"||source.contentVersion!=="2026-09-18.production.2"||
      !Array.isArray(source.paid)||source.paid.indexOf(id)<0||!Array.isArray(source.effects)||source.effects.indexOf(id)<0||
      !r||r.provisional!==false||r.recipient!=="H. Morales · Los Héroes"||
      !Number.isFinite(r.amount)||r.amount<0||!Number.isFinite(r.minutes)||r.minutes<0||
      !Number.isFinite(r.combats)||r.combats<0)return null;
    var flags=Array.isArray(r.flags)?r.flags:[],detour=flags.indexOf("desvio_identificado")>=0,watch=flags.indexOf("patron_registrado")>=0;
    // Older receipts without the observations remain news, not an invented safe route.
    return {sourceMission:id,approach:detour&&!watch?"detour":watch&&!detour?"watch":"summary"};
  }catch(e){return null}
}
function normalizeWorldContinuity(){
  var source=state.worldContinuity,f=source&&source.version===1&&source.facts&&source.facts[WORLD_MORALES_FACT];
  state.worldContinuity={version:1,facts:{}};
  if(!f||f.sourceMission!=="morales-01"||["detour","watch","summary"].indexOf(f.approach)<0)return;
  var used=f.used===true;
  state.worldContinuity.facts[WORLD_MORALES_FACT]={
    sourceMission:"morales-01",approach:f.approach,
    receivedDay:Number.isInteger(f.receivedDay)&&f.receivedDay>=1&&f.receivedDay<=3?f.receivedDay:null,
    receivedIndex:Number.isInteger(f.receivedIndex)&&f.receivedIndex>=0&&f.receivedIndex<events.length?f.receivedIndex:null,
    read:f.read===true,prepared:!used&&f.approach!=="summary"&&f.prepared===true,used:used,
    usedDay:used&&Number.isInteger(f.usedDay)?f.usedDay:null,
    usedIndex:used&&Number.isInteger(f.usedIndex)?f.usedIndex:null,
    threatReduced:used?clamp(Number(f.threatReduced)||0,0,f.approach==="detour"?6:4):0
  };
}
function worldMoralesFact(){return state.worldContinuity&&state.worldContinuity.facts&&state.worldContinuity.facts[WORLD_MORALES_FACT]||null}
function syncWorldContinuity(){
  if(!gameSessionActive||encounterSaveLocked||battleState)return false;
  if(worldMoralesFact())return false;
  var receipt;
  try{receipt=worldContinuityReceipt(localStorage.getItem(WORLD_COURIER_KEY))}catch(e){return false}
  if(!receipt)return false;
  if(!state.worldContinuity||state.worldContinuity.version!==1)normalizeWorldContinuity();
  state.worldContinuity.facts[WORLD_MORALES_FACT]={sourceMission:receipt.sourceMission,approach:receipt.approach,
    receivedDay:currentDay(),receivedIndex:state.index,read:false,prepared:false,used:false,usedDay:null,usedIndex:null,threatReduced:0};
  save();return true;
}
function worldReportReduction(f){return f.approach==="detour"?6:f.approach==="watch"?4:0}
function worldReportStatus(f){
  if(f.used)return "Salida preparada con el informe · día "+f.usedDay+" · Amenaza −"+f.threatReduced;
  if(f.approach==="summary")return "Entrega confirmada · faltan las observaciones del recorrido";
  if(state.finished)return "Informe recibido después del cierre de la expedición";
  return (f.prepared?"Plan preparado":"Informe disponible")+" · próxima salida: hasta −"+worldReportReduction(f)+" de amenaza · un solo uso";
}
function renderWorldContinuity(){
  var f=worldMoralesFact(),entry=$("worldNewsEntry");entry.classList.toggle("hidden",!f);
  if(!f)return;
  $("worldNewsStatus").textContent=worldReportStatus(f);
  $("worldNewsButton").textContent=f.read?"Releer el informe de Morales":"Morales dejó un informe · hablar con Noa";
  if(activeRefugeNpc()==="mara")$("traderDialogue").textContent=f.used?
    "«Dejé la copia de Morales con los planos. Si vuelve a cambiar el corredor, habrá que salir a revisarlo otra vez.»":
    "«Morales dejó una copia de lo que trajeron Rocío, Tomás y Bruno. Está junto al plano. Revísenla con Noa antes de salir.»";
}
function worldReportScene(f){
  if(f.used)return "Noa despliega el informe por el mismo doblez que hicieron antes de salir. La anotación del recorrido sigue junto a las marcas de Morales.\n\n—Esto nos sirvió para preparar esa salida. No sabemos si el corredor sigue igual.\n\nSara guarda la hoja entre los planos que conviene conservar. La información no se ha perdido; tampoco pueden contar con que vuelva a protegerlos sin otra revisión.";
  if(f.prepared)return "Noa deja el plano abierto sobre las mochilas. Elías comprueba el punto que han señalado; Sara recoge sus cosas para que puedan salir juntos.\n\n—Lo usamos al salir —dice Noa—. Si cambiamos de equipo un rato, el plano se queda aquí.\n\nLa preparación está acordada. Todavía no han abierto la compuerta.";
  if(f.approach==="summary")return "Mara conserva la confirmación de que los Mensajeros entregaron el informe a Morales. Noa busca las observaciones del recorrido, pero no están en la copia.\n\n—Sabemos que lo entregaron. No sabemos qué vieron. Con esto no puedo cambiarles la ruta.\n\nSara deja el registro junto al plano. La entrega queda reconocida, aunque esta copia no alcanza para preparar una salida distinta.";
  var observation=f.approach==="detour"?
    "El informe distingue las pisadas de las marcas de arrastre. Los Mensajeros siguieron el desvío y dejaron señalado dónde se separan. Noa compara ese punto con el acceso que pensaban usar.\n\n—Por aquí podemos salir sin cruzarnos de frente con ese paso. Rocío, Tomás y Bruno tuvieron que acercarse para comprobarlo.":
    "Los Mensajeros observaron el cruce desde el andén y anotaron cómo se repartían los movimientos. Noa pone la hoja al lado del plano; no hay un desvío comprobado, pero sí un patrón que pueden vigilar antes de salir.\n\n—Esperamos bajo techo y revisamos si sigue ocurriendo lo mismo. No quiero que salgamos solo porque el papel dice que se puede.";
  return "Mara aparta una caja para que puedan extender el informe de Morales. Sara sostiene una esquina mientras Elías busca un lápiz.\n\n"+observation+"\n\nSara pregunta si eso basta para volver sin problemas. Noa niega con la cabeza.\n\n—Basta para preparar mejor la salida. Lo que encontremos después habrá que resolverlo allá.";
}
function renderWorldNews(){
  var f=worldMoralesFact();if(!f)return;
  $("worldNewsText").textContent=worldReportScene(f);
  $("worldNewsEffect").textContent=worldReportStatus(f);
  $("worldNewsPrepare").classList.toggle("hidden",f.prepared||f.used||f.approach==="summary"||state.finished);
  $("worldNewsClose").textContent=f.prepared||f.used||f.approach==="summary"||state.finished?"Volver al refugio":"Guardar para después";
}
function openWorldNews(){
  if(!state.refuge.active||battleState||encounterSaveLocked||state.activity==="couriers"||state.activity==="hub"||
    !$("refugeHelpModal").classList.contains("hidden")||!$("logisticsModal").classList.contains("hidden"))return false;
  var f=worldMoralesFact();if(!f)return false;
  f.read=true;worldNewsOpen=true;save();renderWorldNews();
  $("refuge").setAttribute("inert","");$("worldNewsModal").classList.remove("hidden");$("worldNewsReading").scrollTop=0;$("worldNewsReading").focus({preventScroll:true});return true;
}
function closeWorldNews(restoreFocus){
  var wasOpen=worldNewsOpen;worldNewsOpen=false;$("worldNewsModal").classList.add("hidden");
  if(wasOpen){$("refuge").removeAttribute("inert");if(state.refuge.active){renderWorldContinuity();if(restoreFocus!==false)$("worldNewsButton").focus({preventScroll:true})}}
}
function prepareWorldDeparture(){
  var f=worldMoralesFact();
  if(!worldNewsOpen||!state.refuge.active||state.finished||!f||f.used||f.prepared||!worldReportReduction(f))return false;
  f.prepared=true;save();renderWorldNews();renderWorldContinuity();$("worldNewsClose").focus({preventScroll:true});return true;
}
function useWorldDeparture(){
  var f=worldMoralesFact();
  if(!state.refuge.active||!refugeCanLeave()||state.finished||!f||!f.prepared||f.used)return "";
  var reduction=Math.min(state.threat,worldReportReduction(f));
  state.threat-=reduction;f.prepared=false;f.used=true;f.usedDay=currentDay();f.usedIndex=state.index;f.threatReduced=reduction;
  return "Noa guía la salida con el informe de Morales. Amenaza −"+reduction+". El grupo todavía necesita sincronizar el inhibidor.";
}
function worldNewsKeydown(e){
  if(!worldNewsOpen)return false;
  if(e.key==="Escape"){e.preventDefault();closeWorldNews();return true}
  if(e.key==="Tab"){
    var first=$("worldNewsReading"),last=$("worldNewsPrepare").classList.contains("hidden")?$("worldNewsClose"):$("worldNewsPrepare");
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
  return true;
}
$("worldNewsButton").addEventListener("click",openWorldNews);
$("worldNewsClose").addEventListener("click",function(){closeWorldNews()});
$("worldNewsPrepare").addEventListener("click",prepareWorldDeparture);
