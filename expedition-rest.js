// End-of-day preparation is saved separately from the next scene's checkpoint.
// One receipt per night: reading, reloading and repeated input cannot spend twice.
function restLedger(){return state.expeditionRest||(state.expeditionRest={version:1,nights:{}})}
function pendingNight(){var nights=restLedger().nights;return Object.keys(nights).map(function(k){return nights[k]}).find(function(n){return n.phase!=="closed"})||null}
function normalizeExpeditionRest(){
  var ledger=restLedger();if(ledger.version!==1||!ledger.nights||typeof ledger.nights!=="object"||Array.isArray(ledger.nights))throw Error("Descanso inválido");
  Object.keys(ledger.nights).forEach(function(key){var n=ledger.nights[key];
    if(!n||!["1","2"].includes(key)||n.day!==Number(key)||!["planning","settled","closed"].includes(n.phase)||![null,"fled","exhausted","morale"].includes(n.returnToRefuge)||typeof n.context!=="string")throw Error("Noche inválida");
    if(n.returnAccount!==undefined&&typeof n.returnAccount!=="string")throw Error("Registro de regreso inválido");
    normalizeNightConversations(n);
    if(n.phase==="closed"&&currentDay()<=n.day)throw Error("Descanso futuro");
    if(n.phase!=="closed"&&state.index!==events.findIndex(function(e){return e.day===n.day+1}))throw Error("Noche fuera de jornada");
    if(n.phase==="planning"){if(n.receipt!==null||n.choice!==null)throw Error("Descanso sin confirmar");}
    else if(!["share","save-food"].includes(n.choice)||!n.receipt||typeof n.receipt.text!=="string"||!Array.isArray(n.receipt.changes)||!n.receipt.changes.every(function(c){return Array.isArray(c)&&c.length===2&&c.every(function(v){return typeof v==="string"})}))throw Error("Recibo nocturno inválido");
  });
  if(Object.values(ledger.nights).filter(function(n){return n.phase!=="closed"}).length>1)throw Error("Dos noches pendientes");
}
function nightForecast(mode){
  var food=mode!=="save-food"&&stockCount("food")>0,water=stockCount("water")>0;
  return {food:food?1:0,water:water?1:0,energy:food?24:-8,morale:(food?0:-5)+(water?0:-8)};
}
function expeditionReserveText(){
  var day=currentDay(),left=events.slice(state.index).filter(function(e){return e.day===day}).length;
  return "Día "+day+" de 3 · "+left+" situaciones principales por resolver hoy. Los desvíos se añaden a ese recorrido. Las horas acompañan las escenas; leer no adelanta el día. "+(day<3?"Al cerrar la jornada, compartir comida utiliza 1 ración y 1 agua para todo el grupo. Llevan "+stockCount("food")+" raciones y "+stockCount("water")+" reservas de agua. Sin comida: energía −8 y moral −5; sin agua: moral −8. Podrás decidir antes de consumirlas.":"Esta es la última jornada: no hay otro consumo nocturno automático antes del desenlace. Conserva suministros para las heridas, la energía y las decisiones del trayecto.");
}
// Recall only observed outcomes. This text is captured in the existing night
// receipt; it neither changes flags nor infers an NPC's recovery from treatment.
function firstNightConsequences(){
  var f=state.flags,lines=[];
  if(f.matiasAtRefuge)lines.push("Matías quedó en la enfermería de Línea 1. En el registro de regreso figura la entrega a la posta, no un alta: sigue necesitando atención. La próxima salida tendrá que contar con ese traslado, como ya acordaron al volver.");
  else if(f.matiasRadioAlly)lines.push("El receptor de Matías sigue sobre la mesa. El grupo comprueba el canal que acordaron mantener abierto; no lo confunde con una confirmación de que esté a salvo.");
  else if(f.usedMatiasAsDecoy)lines.push("La frecuencia que usaron para desviar el rastreo queda anotada junto a la ruta. Les permitió seguir; no les dice qué ocurrió después con Matías. Su situación sigue sin confirmarse.");
  else if(f.leftSupplies)lines.push("Dejaron provisiones junto a Matías. La hoja conserva ese hecho, pero no lo cuenta entre quienes llegaron al refugio. Todavía no saben qué ocurrió después de cerrar la puerta.");
  else if(f.abandonedMatias)lines.push("Conservaron la frecuencia y dejaron a Matías en la farmacia. El registro mantiene su ubicación; no hay una confirmación de su regreso ni de su muerte.");
  else if(f.savedMatias||f.carriedMatias)lines.push("La atención a Matías queda registrada, pero no hay una llegada confirmada a la enfermería. Haberlo atendido no permite dar por terminado el rescate.");
  var pumpStates=[f.pumpSecured,f.pumpLost,f.pumpAbandoned].filter(Boolean).length;
  if(pumpStates>1)lines.push("Las anotaciones de la casa de bombas no coinciden. El grupo deja esa duda junto al plano; no presenta el paso como asegurado.");
  else if(f.pumpSecured)lines.push("En el plano queda marcada la bomba que dejaron funcionando. El registro distingue ese acceso de los tramos que aún no revisaron; no promete que todo el recorrido esté despejado.");
  else if(f.pumpLost)lines.push("La casa de bombas quedó fuera del control del grupo. El aviso se conserva junto al recorrido de vuelta: nadie debe preparar otra salida suponiendo que aseguraron ese acceso.");
  else if(f.pumpAbandoned)lines.push("Marcaron la casa de bombas y siguieron sin asegurarla. El plano conserva la ubicación como trabajo pendiente; todavía no hay una noticia que permita darla por recuperada o destruida.");
  return lines.join("\n\n");
}
function nightContext(day){
  var f=state.flags,awake=state.party.every(function(p){return p.hp>0});
  var firstNight=day===1?firstNightConsequences():"";
  if(!awake)return "En el refugio apartan una mesa para atender a quienes volvieron agotados. Las mochilas quedan al alcance del grupo. Antes de repartir las reservas, alguien cuenta qué comida y agua trajeron de vuelta."+(firstNight?"\n\n"+firstNight:"");
  if(day===1)return "De vuelta en Línea 1, el grupo deja las mochilas junto a la mesa. Sara deja las vendas usadas aparte y pide que nadie se acueste con una herida sin revisar. Elías acerca su cuaderno, pero Noa le hace sitio junto a la comida: «Primero sentémonos». Noa revisa las correas mientras Sara cuenta los suministros. Quieren saber con qué podrán salir mañana, antes de prometer otra ayuda."+(firstNight?"\n\n"+firstNight:"");
  return "Elías extiende las hojas recuperadas y busca dónde apoyar el receptor sin mojar los papeles. Noa deja su arma a un lado para repartir las reservas. "+(f.liraDead?"Sara se detiene al llegar a la anotación de Lira. «Esto no lo arreglamos durmiendo». Elías conserva el registro; no intenta convertirlo en una buena noticia.":f.savedMerodeadora?"Sara vuelve a la anotación de Lira. «La atendimos. No escribas que ya se recuperó». Elías corrige la línea y deja espacio para lo que aún no saben.":"Sara le pide que distinga lo que vieron de lo que suponen. «Mañana vamos a decidir con esas hojas». Elías tacha una conclusión y conserva la pregunta.");
}
function showNight(){
  var n=pendingNight();if(!n)return false;var settled=n.phase==="settled",f=settled?null:nightForecast("share");
  $("nightTitle").textContent="De vuelta en el refugio · noche del día "+n.day;
  $("nightText").textContent=n.context;
  $("nightExplanation").textContent=settled?n.receipt.text:"Todavía no se han consumido reservas. Una ración se comparte entre los tres; también se utiliza 1 agua si queda. Puedes conservar la comida para mañana, con el costo de energía y moral indicado. Leer esta conversación no consume tiempo.";
  var rows=settled?n.receipt.changes:[["Reservas disponibles",stockCount("food")+" raciones · "+stockCount("water")+" aguas"],["Si comparten",f.food+" ración · "+f.water+" agua"],["Energía por persona",(f.energy>0?"+":"")+f.energy+" · entre 0 y 100"],["Moral del grupo",String(f.morale)],["Atención nocturna","+8 HP; agotados vuelven a 12, hasta su máximo"],["Talleres","Se reponen a 3 acciones cada uno"]];
  $("nightChanges").innerHTML=rows.map(function(x){return '<div class="result-chip">'+esc(x[0])+'<strong>'+esc(x[1])+'</strong></div>'}).join("");
  $("nightShare").classList.toggle("hidden",settled);$("nightShare").textContent=stockCount("food")?"Compartir una ración y descansar":"Descansar con lo que queda";
  $("nightKeep").classList.toggle("hidden",settled||!stockCount("food"));$("nightKeep").textContent="Guardar la comida · energía −8 · moral "+nightForecast("save-food").morale;
  $("nextDay").classList.toggle("hidden",!settled);$("nextDay").textContent=n.day===1||n.returnToRefuge||state.morale<10||state.party.some(function(p){return p.hp<10||p.hunger<10})?"Preparar al equipo en el refugio":"Comenzar el día "+(n.day+1);
  renderNightConversation();$("night").classList.remove("hidden");$("nightReading").scrollTop=0;$("nightReading").focus({preventScroll:true});return true;
}
function prepareNight(day,returnToRefuge){
  if(![1,2].includes(day)||state.finished||state.index!==events.findIndex(function(e){return e.day===day+1}))return false;
  var ledger=restLedger();if(ledger.nights[day])return showNight();
  state.inhibitor.active=false;state.inhibitor.remainingMs=0;state.inhibitor.exposed=true;state.inhibitor.needsSync=true;state.inhibitor.exposedMoves=0;
  ledger.nights[day]={day:day,phase:"planning",returnToRefuge:returnToRefuge||null,choice:null,receipt:null,context:nightContext(day)+(day===2&&typeof veraNightContext==="function"&&veraNightContext()?"\n\n"+veraNightContext():""),conversations:{}};
  if(day===1)ledger.nights[day].returnAccount=firstNightConsequences();
  nightCompanion=null;
  save();render();renderSignalHud();return showNight();
}
function settleNight(mode){
  var n=pendingNight();if(!n||n.phase!=="planning"||!["share","save-food"].includes(mode)||mode==="save-food"&&!stockCount("food"))return false;
  var f=nightForecast(mode),morale=state.morale,changes=[],recovered=0;
  if(f.food){consumeStock("food");addStatItem("itemsUsed","food",1)}if(f.water){consumeStock("water");addStatItem("itemsUsed","water",1)}
  state.morale=clamp(state.morale+f.morale,0,100);state.engineeringUses=3;state.medicalUses=3;state.ordnanceUses=3;
  changes.push(["Reservas consumidas",f.food+" ración · "+f.water+" agua"],["Moral",String(state.morale-morale)]);
  state.party.forEach(function(p){var hp=p.hp,energy=p.hunger;p.hp=Math.min(p.maxHp,p.hp>0?p.hp+8:12);p.hunger=clamp(p.hunger+f.energy,0,100);p.guard=0;p.bleed=0;recovered+=p.hp-hp;changes.push([p.name,"HP +"+(p.hp-hp)+" · energía "+(p.hunger-energy>=0?"+":"")+(p.hunger-energy)]);});
  relaxPsyche(f.food&&f.water?2:1,f.food&&f.water?1:0);state.stats.rests++;state.stats.restHpRecovered+=recovered;state.stats.hpRestored+=recovered;
  var text=mode==="save-food"?"La ración queda sellada en la mochila. El descanso permite atender las heridas, pero el grupo saldrá con menos energía. Han conservado comida para otra necesidad; el esfuerzo de esta noche también queda registrado.":f.food?"Reparten la ración mientras terminan las curas. Después guardan los papeles y se acomodan para dormir.":"Revisan las mochilas una segunda vez. No queda comida para repartir. Pueden atender las heridas y dormir, pero eso no reemplaza una ración.";
  text+=f.water?" Comparten una reserva de agua.":" Tampoco queda agua: la sed pesa sobre la moral del grupo.";
  changes.push(["Talleres profesionales","3 acciones por taller"]);n.phase="settled";n.choice=mode;n.receipt={text:text,changes:changes};
  state.history.push({kind:"rest",day:n.day,loc:"Refugio · cierre de jornada",choice:mode==="save-food"?"Conservar la ración":"Descansar con las reservas disponibles",result:text});
  save();render();showNight();return true;
}
function continueAfterNight(){
  var n=pendingNight();if(!n||n.phase!=="settled")return false;n.phase="closed";$("night").classList.add("hidden");
  var reason=n.returnToRefuge||(state.morale<10?"morale":state.party.some(function(p){return p.hp<10||p.hunger<10})?"exhausted":null);
  if(reason)openRefuge(reason);else if(n.day===1)openRefuge("preparation");else{save();render();setTimeout(function(){openSignalHack("newday")},260)}return true;
}
function nightKeydown(e){
  if($("night").classList.contains("hidden"))return false;
  if(e.key==="Tab"){var controls=[$("nightReading"),...$("nightPeople").querySelectorAll("button"),...$("nightConversation").querySelectorAll("button"),$("nightShare"),$("nightKeep"),$("nextDay")].filter(function(b){return !b.classList.contains("hidden")&&!b.disabled}),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  if(e.key==="Escape"||["1","2","3","4"].includes(e.key))e.preventDefault();return true;
}
$("nightShare").addEventListener("click",function(){settleNight("share")});
$("nightKeep").addEventListener("click",function(){settleNight("save-food")});
