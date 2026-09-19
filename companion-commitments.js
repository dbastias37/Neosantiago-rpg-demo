// One observed scene connects a night conversation to an action and its aftermath.
// Discussion saves immediately; the decision commits with the existing encounter.
var carePanelActive=false;
function careIndex(){return events.findIndex(function(e){return e.title==="El núcleo expuesto"})}
function careAgreement(){return state.expeditionRest?.nights[1]?.conversations?.sara?.choice||null}
function careRecord(){return state.companionCommitments?.care||null}
function careAwake(){return state.party.every(function(p){return p.hp>0})}
function careApplicable(index){return index===careIndex()&&!state.finished&&!state.flags.liraDead}
function careReserveText(){
 var meds=stockCount("meds"),water=stockCount("water");
 return "Reservas del grupo: "+meds+" medicina"+(meds===1?"":"s")+" y "+water+" reservas de agua. "+(meds===0?"No hay medicina para atenderla.":meds===1?"Atenderla utilizará la última medicina que llevan.":"Atenderla utiliza 1 medicina; quedarán "+(meds-1)+".")+" Dejar agua utiliza 1 reserva y no equivale a tratar la herida.";
}
function companionCareEvent(ev,index){
 if(index!==careIndex()||state.finished)return ev;
 if(state.flags.liraDead)return Object.assign({},ev,{text:"En la clínica queda la camilla de Lira. El grupo sabe que murió; no hay una segunda oportunidad de atenderla. Elías reconoce los conectores y se aparta. Todavía deben continuar hacia la torre.",choices:[{label:"Dejar la camilla y continuar",hint:"Lira sigue muerta. No se reciben recursos ni se vuelve a extraer su núcleo.",cost:"Sin recursos",title:"La camilla vacía",result:"Salen de la clínica. Lo que ocurrió con Lira permanece en el registro del grupo.",fx:{},_noDialogue:true}]});
 var agreement=careAgreement(),record=careRecord(),text=ev.text;
 if(record?.decision)return Object.assign({},ev,{text:record.response,choices:[{label:"Continuar después de la decisión registrada",hint:"Conserva lo ocurrido y los recursos ya utilizados.",cost:"Sin consumo adicional",title:"La decisión permanece",result:record.response,fx:{},_noDialogue:true}]});
 if(careAwake())text+=" "+(record?.discussion?"Sara deja las reservas a la vista, como acaban de hablar. Todavía falta decidir qué harán.":agreement==="compartir"?"Sara deja la mochila entre los tres. «Anoche dijimos que no iba a decidir esto sola». Noa se queda junto a la puerta, sin dar todavía la señal de salida.":agreement==="limites"?"Sara revisa la mochila antes de acercarse. «Me pidieron que dijera cuándo faltan medios. Revisemos con qué vamos a salir de aquí».":"Sara deja la mochila en el suelo. «Antes de prometerle algo, veamos qué podemos hacer». ");
 text+=" "+careReserveText();
 var choices=ev.choices.map(function(c,i){var out=Object.assign({},c,{_careAction:["treat","extract","water"][i]});
  if(i===0){out.hint="Utiliza 1 medicina del grupo. "+(stockCount("meds")===1?"Es la última que llevan.":"No garantiza que Lira ya esté recuperada.");out.result="Sara utiliza la medicina y termina la atención. Lira vuelve a hablar, pero aún no puede acompañarlos. Señala la torre y les advierte que UNO utiliza los núcleos de los exiliados como balizas.";}
  if(i===1)out.hint="Extraerlo mata a Lira. Conversarlo no cambia esa consecuencia.";
  if(i===2){out.hint="Deja 1 agua a su alcance. La herida queda sin tratar y el equipo continúa.";out.result="Dejan el agua al alcance de Lira. Ella conserva el núcleo, pero sigue herida. El grupo sale sin saber si conseguirá otra ayuda.";}
  return out;
 });
 choices.push({label:"Retirarse sin tocar el núcleo",hint:"Conserva las reservas. Lira queda herida; no se confirma qué le ocurrirá después.",cost:"Moral −2",title:"La ayuda que no dieron",result:"El grupo deja la camilla y vuelve al corredor sin llevarse el núcleo. Lira sigue herida. No anotan que esté a salvo ni que haya muerto: se marchan sin resolverlo.",fx:{morale:-2},flags:{leftLiraUntreated:true},_careAction:"leave",_noDialogue:true});
 return Object.assign({},ev,{text:text,choices:choices});
}
function careDiscussionLines(){
 var a=careAgreement(),meds=stockCount("meds"),water=stockCount("water");
 return [a==="compartir"?"Sara abre la mochila. «Gracias por parar. Lo que dije anoche era esto: mirarla a ella, mirar lo que queda y decidir entre los tres». No pide que todos quieran lo mismo.":a==="limites"?"Sara cuenta lo que queda sin apartar los ojos de la camilla. «Esto es lo que puedo ofrecer con lo que tenemos. No quiero prometer una recuperación que todavía no puedo asegurar».":"Sara hace sitio junto a su mochila. «No hemos acordado cómo resolver algo así. Podemos empezar por decir qué necesita cada uno». ",
  meds===0?"Sara comprueba el estuche vacío. «No tengo medicina para tratarla. Si nos vamos, no digamos que ya la atendimos». ":meds===1?"Sara sostiene la última medicina. «Si la uso con Lira, no queda otra para el regreso». Noa le pide que no la guarde todavía: quiere escucharla antes de decidir.":"Sara separa una medicina. «Con esta puedo atenderla; quedarían "+(meds-1)+" para nosotros». Noa revisa el corredor mientras ella explica lo que puede hacer.",
  "Noa señala la puerta. «Puedo vigilar mientras la atiendes. Si seguimos, salgamos sabiendo a quién dejamos aquí». Elías mira el conector. «El núcleo mantiene su respiración. Quitarlo no es otra forma de ayudar». ",
  water?"Elías deja el agua a la vista. «Podemos dejarle una reserva, pero no reemplaza la medicina». Sara asiente. Todavía no han gastado nada ni decidido por Lira.":"No queda agua para dejar junto a la camilla. Sara deja de buscar una reserva que no trajeron. Todavía no han gastado nada. Retirarse sigue siendo posible; extraer el núcleo no es una obligación."];
}
function careOtherSurfaceOpen(){return (typeof activityVisible==="function"&&activityVisible())||(typeof fieldVisible==="function"&&fieldVisible())||!!itemDetailState||["titleScreen","start","gameIntro","worldLoreModal","night","final","summary","profileModal","transferModal","discardModal","disassemblyModal","lootModal","logisticsModal","archiveModal","audioClueModal","npcDialogueModal","routeNarrativeModal","drawer"].some(function(id){return !$(id).classList.contains("hidden")})}
function canDiscussCare(){return gameSessionActive&&careApplicable(state.index)&&!careRecord()?.decision&&careAwake()&&!pending&&!battleState&&!decisionState&&!encounterSaveLocked&&!state.refuge.active&&!(typeof pendingNight==="function"&&pendingNight())&&(!state.activity||state.activity==="story")&&!careOtherSurfaceOpen()&&!signalModalVisible()&&!signalWarningVisible()}
function discussCare(){
 if(!canDiscussCare())return false;
 state.companionCommitments??={version:1,care:null};
 var record=careRecord();if(!record){record={agreement:careAgreement(),discussion:null,decision:null,response:null,witnessed:null};state.companionCommitments.care=record;}
 if(!record.discussion)record.discussion={meds:stockCount("meds"),water:stockCount("water"),lines:careDiscussionLines()};
 save();render();openPanel("care");return true;
}
function careDiscussionHTML(){
 var d=careRecord()?.discussion;if(!d)return '<p>No hay una conversación registrada en esta escena.</p>';
 return '<article class="drawer-item"><strong>Antes de decidir</strong>'+d.lines.map(function(line){return '<p>'+esc(line)+'</p>'}).join('')+'<p class="muted">Al conversar llevaban '+d.meds+' medicinas y '+d.water+' aguas. '+esc(careReserveText())+'</p><p>La conversación no consume recursos ni avanza la expedición. Cierra este panel para elegir qué hacer.</p></article>';
}
function companionCareBlocked(c){return c._careAction==="treat"&&!state.party.some(function(p){return p.id==="sara"&&p.hp>0})?"Sara necesita recuperarse antes de atenderla":""}
function renderCompanionCare(){
 var visible=careApplicable(state.index)&&!careRecord()?.decision,node=$("careDiscussion");node.classList.toggle("hidden",!visible);
 $("careDiscussionButton").textContent=careRecord()?.discussion?"Volver a leer la conversación":"Revisar las reservas con el equipo";
 $("careDiscussionButton").disabled=!careAwake()||!!pending||!!battleState;
 $("careDiscussionNote").textContent=careAwake()?"Puedes hablar antes de elegir. Conversar no utiliza suministros ni resuelve la situación.":"El grupo necesita recuperarse para conversar. No se atribuirá un acuerdo a quienes están agotados.";
}
function recordCareDecision(choice){
 if(!choice._careAction||!careApplicable(state.index)||careRecord()?.decision)return "";
 state.companionCommitments??={version:1,care:null};
 var r=careRecord()||{agreement:careAgreement(),discussion:null,decision:null,response:null,witnessed:null};
 r.decision=choice._careAction;r.witnessed=careAwake();
 var result="";
 if(r.witnessed){
  if(r.decision==="extract")result="Sara se aparta del conector. «Dije que la necesitaba para respirar». "+(r.discussion?"Haber escuchado su objeción no la convierte en un acuerdo.":r.agreement==="compartir"?"La decisión se tomó sin la conversación que habían acordado.":"No llama tratamiento a lo que acaba de ocurrir.");
  else if(r.agreement==="compartir"&&!r.discussion)result="Sara cierra la mochila. «Anoche quedamos en hablarlo entre los tres. Decidirlo sin preguntar sigue dejándome a mí la respuesta frente a la camilla». ";
  else if(r.discussion)result=r.decision==="treat"?"Noa cubre la puerta mientras Sara termina. Elías vuelve a contar las reservas. Anota la medicina utilizada junto al nombre de Lira; Sara le pide que deje espacio para saber cómo sigue.":r.decision==="water"?"Sara comprueba que Lira pueda alcanzar el agua. «No pongas que la atendimos», le dice a Elías. Él anota exactamente lo que dejaron.":"Noa espera a Sara en la puerta. Elías registra que se marcharon sin tratar la herida. Sara se queda un momento junto a la camilla antes de seguirlos.";
  else if(r.agreement==="limites")result="Sara vuelve a contar lo que queda. «Ese era el límite que quería dejar claro». Elías registra la decisión sin convertirla en una recuperación confirmada.";
  else result="Sara pide a Elías que anote lo que hicieron, sin asegurar qué pasará con Lira después de que se vayan.";
 }else result="El grupo no estaba en condiciones de conversar entre los tres. Queda registrada la acción en la clínica, sin presentarla como un acuerdo compartido.";
 r.response=result;state.companionCommitments.care=r;return result;
}
function careNightReflection(){
 var r=careRecord();if(!r?.decision)return "";
 if(state.flags.liraDead&&r.decision!=="extract")return "Sara señala la anotación de la clínica. «Seguía viva cuando terminamos aquí. Después le quitaron el núcleo». No permite que la primera decisión tape la que vino después.";
 var fact={treat:"«Usamos una medicina con Lira. Eso sí lo hicimos. De su recuperación todavía no sabemos».",water:"«Le dejamos agua. La herida quedó sin tratar».",leave:"«Nos fuimos sin tratarla. No sabemos qué pasó después».",extract:r.discussion?"«Le quitaron el núcleo y murió. Haberlo hablado no cambia eso».":"«Le quitaron el núcleo y murió. Eso es lo que debe quedar escrito»."}[r.decision];
 var process=!r.witnessed?" No presenta aquella decisión como una conversación que el grupo no pudo tener.":r.agreement==="compartir"&&!r.discussion?" Sara deja el cuaderno abierto. «Yo había pedido decidirlo entre los tres. No quiero que el próximo acuerdo vuelva a quedarse en esta mesa».":r.discussion&&r.decision!=="extract"?" «Esta vez paramos y escuchamos. Quiero que podamos hacerlo también cuando la respuesta sea incómoda». Elías conserva la anotación.":r.decision==="extract"?" Sara no acepta que se escriba como una decisión de atención médica.":" Sara pide conservar esa diferencia en el registro antes de hablar de mañana.";
 return "Sara vuelve a la decisión de la clínica. "+fact+process;
}
function normalizeCompanionCommitments(){
 state.companionCommitments??={version:1,care:null};var ledger=state.companionCommitments,r=ledger.care;
 if(ledger.version!==1||r!==null&&(!r||typeof r!=="object"||Array.isArray(r)))throw Error("Registro de acuerdos inválido");if(typeof normalizeNoaRoute==="function")normalizeNoaRoute();if(typeof normalizeEvidence==="function")normalizeEvidence();if(!r)return;
 if(![null,"compartir","limites"].includes(r.agreement)||r.agreement!==careAgreement()||![null,"treat","extract","water","leave"].includes(r.decision)||![null,true,false].includes(r.witnessed))throw Error("Decisión de clínica inválida");
 if(r.discussion!==null){var d=r.discussion;if(!d||![d.meds,d.water].every(function(n){return Number.isInteger(n)&&n>=0})||!Array.isArray(d.lines)||d.lines.length!==4||!d.lines.every(function(s){return typeof s==="string"}))throw Error("Conversación de clínica inválida");}
 if(state.index<careIndex()||!r.decision&&(state.index!==careIndex()||!r.discussion||r.response!==null||r.witnessed!==null)||r.decision&&(typeof r.response!=="string"||typeof r.witnessed!=="boolean"))throw Error("Acuerdo fuera de escena");
}
function carePanelClosed(){if(!carePanelActive)return;carePanelActive=false;if(!$("careDiscussion").classList.contains("hidden"))$("careDiscussionButton").focus()}
function carePanelKeydown(e){
 if(!carePanelActive||$("drawer").classList.contains("hidden"))return false;
 if(e.key==="Escape"){e.preventDefault();closePanel();return true;}
 if(e.key==="Tab"){var controls=Array.from($("drawer").querySelectorAll('button,a[href],[tabindex="0"]')).filter(function(n){return !n.disabled&&!n.closest('.hidden')}),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
 if(["1","2","3","4"].includes(e.key))e.preventDefault();return true;
}
$("careDiscussionButton").addEventListener("click",discussCare);
