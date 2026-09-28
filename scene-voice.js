"use strict";

// Only attributed speech in the main event paragraph belongs here. Existing
// conversation, consequence, night and route modals keep their own presentation.
// A quotation absent from the current branch never creates a dialogue cue.
var sceneVoiceCatalog={
  "d1-signal":[
    ["mara","VO_MARA_D1_SIGNAL_01","Puedo entregarles una de estas dos cosas. Lo demás se queda en el puesto"]
  ],
  "d1-council":[
    ["elder","VO_VARELA_D1_COUNCIL_01","Si encuentran merodeadores, no hablen de ellos delante de los que aún no han subido"],
    ["elder","VO_VARELA_D1_COUNCIL_02","Necesitamos que sigan saliendo a cazar"]
  ],
  "d2-republica":[
    ["noa","VO_NOA_D2_ROUTE_REASON","Anoche quedamos en decir por qué. ¿Buscamos dónde cubrirnos, salimos rápido o esperamos a ver cómo patrullan?"],
    ["noa","VO_NOA_D2_ROUTE_RETURN","Me pidieron que avisara cuándo volver. Si al salir nos cubren desde dos alturas, no voy a seguir de frente sin que revisemos otra entrada"],
    ["noa","VO_NOA_D2_ROUTE_DEFAULT","Puedo buscar el paso, pero necesito saber qué estamos tratando de evitar"],
    ["noa","VO_NOA_D2_ROUTE_MARKS","Las marcas son una pista. No he visto qué hay al otro lado"]
  ],
  "d2-alameda":[
    ["noa","VO_NOA_D2_CROSSING_RETURN","Esto es lo que dije en la escalera: uno abajo y otro arriba. Por aquí no quiero seguir de frente. Podemos buscar el paso por debajo"],
    ["noa","VO_NOA_D2_CROSSING_DEFAULT","Hasta aquí llegaba lo que habíamos visto. Abajo podemos evitar la línea de tiro, pero vamos a tener que cargar el equipo entre derrumbes"],
    ["elias","VO_ELIAS_D2_CROSSING_S7","Todavía tenemos su ayuda para despejar la calle"]
  ],
  "d2-node14":[
    ["elias","VO_ELIAS_D2_NODE_RECORD","Eso dice su registro. No es alguien contestando"],
    ["elias","VO_ELIAS_D2_NODE_DOUBTS","Voy a dejar las dudas como quedamos. Si hay nombres, quiero mirar también de cuándo son"],
    ["elias","VO_ELIAS_D2_NODE_RISK","Primero el riesgo, como me pidieron: el injerto consume el núcleo aunque falle; si falla, además avisa a la red"],
    ["elias","VO_ELIAS_D2_NODE_READ","Puedo intentar leerlo. No sé si lo que encontremos seguirá siendo cierto afuera"],
    ["sara","VO_SARA_D2_NODE_SEARCH","Si hay alguien esperando, necesito saber dónde"],
    ["noa","VO_NOA_D2_NODE_QUESTION","Y yo necesito saber si vamos a buscar a una persona o a comprobar una anotación"],
    ["elias","VO_ELIAS_D2_NODE_MOMENT","Dame un momento"],
    ["sara","VO_SARA_D2_NODE_START","Nos sirve para empezar"],
    ["elias","VO_ELIAS_D2_NODE_PENDING","Dejo esto pendiente, como acordamos anoche"],
    ["elias","VO_ELIAS_D2_NODE_LIMIT","Hasta aquí pude comprobar"]
  ],
  "d2-exposed-core":[
    ["lira","VO_LIRA_D2_CORE_ELIAS","A él no"],
    ["lira","VO_LIRA_D2_CORE_WARNING","No se acerquen"],
    ["lira","VO_LIRA_D2_CORE_BROTHER","Él está a salvo. Ahora ayúdame a cerrar esto"],
    ["sara","VO_SARA_D2_CORE_TOGETHER","Anoche dijimos que no iba a decidir esto sola"],
    ["sara","VO_SARA_D2_CORE_LIMITS","Me pidieron que dijera cuándo faltan medios. Revisemos con qué vamos a salir de aquí"],
    ["sara","VO_SARA_D2_CORE_DEFAULT","Antes de prometerle algo, veamos qué podemos hacer"],
    ["sara","VO_SARA_D2_CORE_AFTER_EXTRACT","Dije que la necesitaba para respirar"],
    ["sara","VO_SARA_D2_CORE_AFTER_AGREEMENT","Anoche quedamos en hablarlo entre los tres. Decidirlo sin preguntar sigue dejándome a mí la respuesta frente a la camilla"],
    ["sara","VO_SARA_D2_CORE_AFTER_WATER","No pongas que la atendimos"],
    ["sara","VO_SARA_D2_CORE_AFTER_LIMITS","Ese era el límite que quería dejar claro"]
  ],
  "d2-vera":[
    ["sara","VO_SARA_D2_VERA_QUESTION","¿Quién vive donde quieres entrar?"],
    ["vera","VO_VERA_D2_REPLY","Eso me lo tienen que decir ustedes"]
  ],
  "d3-irene":[
    ["operator","VO_IRENE_D3_BEFORE_FILE","Antes de tocar nada, escúchenme"]
  ]
};

// Later voice integration can assign a recorded source by stable audio ID.
// Until then the exact text is readable and no synthesized or placeholder voice plays.
var sceneVoiceAudioSources={};
var sceneVoiceLines=[],sceneVoicePosition=0,sceneVoiceOpener=null,sceneVoiceTimer=null;

function sceneVoiceCollect(event){
  var definitions=sceneVoiceCatalog[event.id]||[],lines=[];
  String(event.text||"").replace(/«([^»]+)»/g,function(_,quote){
    var match=definitions.find(function(def){return def[2]===quote});
    if(match)lines.push({speaker:match[0],id:match[1],text:quote});
    return _;
  });
  return lines;
}

function renderSceneVoice(event,node){
  var lines=sceneVoiceCollect(event),byText=Object.create(null),cursor=0,source=String(event.text||""),fragment=document.createDocumentFragment(),quoted=/«([^»]+)»\.?/g,found;
  sceneVoiceLines=lines;
  lines.forEach(function(line){(byText[line.text]??=[]).push(line)});
  while((found=quoted.exec(source))){
    fragment.appendChild(document.createTextNode(source.slice(cursor,found.index)));
    var line=byText[found[1]]&&byText[found[1]].shift();
    if(line){
      var button=document.createElement("button"),person=npcDialogueDefs[line.speaker];
      button.type="button";button.className="story-voice-cue";button.textContent=person.name+" · diálogo";
      button.setAttribute("aria-label","Abrir diálogo de "+person.name+": "+line.text);
      button.addEventListener("click",function(){openSceneVoice(lines.indexOf(line),button)});
      fragment.appendChild(button);
    }else fragment.appendChild(document.createTextNode(found[0]));
    cursor=quoted.lastIndex;
  }
  fragment.appendChild(document.createTextNode(source.slice(cursor)));
  node.replaceChildren(fragment);
  scheduleSceneVoice();
}

function sceneVoiceAvailable(){
  if(!gameSessionActive||!state.introCompleted||state.finished||state.refuge.active||pending||battleState||decisionState||!sceneVoiceLines.length)return false;
  if(state.activity&&state.activity!=="story")return false;
  if(typeof activityVisible==="function"&&activityVisible())return false;
  if(Array.prototype.some.call(document.querySelectorAll(".overlay:not(.hidden)"),function(node){return node.id!=="sceneVoiceModal"}))return false;
  return !["titleScreen","start","gameIntro","storyPrelude","battle","result","night","final","summary","refuge","activityMenu","courierScreen","worldNewsModal","logisticsModal","signalModal","signalWarningModal","npcDialogueModal","routeNarrativeModal","drawer","archiveModal","audioClueModal","profileModal","lootModal"].some(function(id){var node=document.getElementById(id);return node&&!node.classList.contains("hidden")});
}

function scheduleSceneVoice(){
  clearTimeout(sceneVoiceTimer);
  if(!sceneVoiceLines.length)return;
  sceneVoiceTimer=setTimeout(maybeOpenSceneVoice,420);
}
function maybeOpenSceneVoice(){
  if(!sceneVoiceAvailable()||!$("sceneVoiceModal").classList.contains("hidden"))return;
  var seen=state.sceneVoiceSeen||{},first=sceneVoiceLines.findIndex(function(line){return !seen[line.id]});
  if(first>=0)openSceneVoice(first,null);
}
function stopSceneVoiceAudio(){
  var player=$("sceneVoiceAudio");if(player.pause)player.pause();player.removeAttribute("src");if(player.load)player.load();
  $("sceneVoicePlay").textContent="▶ Reproducir";
}
function showSceneVoiceLine(){
  stopSceneVoiceAudio();var line=sceneVoiceLines[sceneVoicePosition],person=npcDialogueDefs[line.speaker];
  $("sceneVoiceName").textContent=person.name;$("sceneVoiceRole").textContent=person.role;
  $("sceneVoicePortrait").src=assetUrl(person.portrait);$("sceneVoicePortrait").alt="Retrato de "+person.name;
  $("sceneVoiceText").textContent=line.text;
  $("sceneVoiceStatus").textContent=sceneVoiceAudioSources[line.id]?"Pulsa Reproducir para escuchar esta línea.":"Voz pendiente de grabación. Puedes leer la línea completa.";
  $("sceneVoiceCounter").textContent=(sceneVoicePosition+1)+" / "+sceneVoiceLines.length;
  $("sceneVoiceNext").textContent=sceneVoicePosition<sceneVoiceLines.length-1?"Avanzar":"Continuar";
}
function openSceneVoice(position,opener){
  if(!sceneVoiceLines[position]||!sceneVoiceAvailable())return false;
  sceneVoiceOpener=opener||null;sceneVoicePosition=position;
  if(!state.sceneVoiceSeen||typeof state.sceneVoiceSeen!=="object"||Array.isArray(state.sceneVoiceSeen))state.sceneVoiceSeen={};
  sceneVoiceLines.forEach(function(line){state.sceneVoiceSeen[line.id]=true});save();
  showSceneVoiceLine();$("sceneVoiceModal").classList.remove("hidden");$("sceneVoicePlay").focus({preventScroll:true});return true;
}
function closeSceneVoice(restoreFocus){
  if($("sceneVoiceModal").classList.contains("hidden"))return;
  stopSceneVoiceAudio();$("sceneVoiceModal").classList.add("hidden");
  if(restoreFocus!==false&&sceneVoiceOpener&&sceneVoiceOpener.isConnected)sceneVoiceOpener.focus({preventScroll:true});
  sceneVoiceOpener=null;
}
function advanceSceneVoice(){
  if(sceneVoicePosition>=sceneVoiceLines.length-1){closeSceneVoice();return}
  sceneVoicePosition++;showSceneVoiceLine();$("sceneVoicePlay").focus({preventScroll:true});
}
function playSceneVoice(){
  var line=sceneVoiceLines[sceneVoicePosition],src=line&&sceneVoiceAudioSources[line.id];
  if(!src){$("sceneVoiceStatus").textContent="Esta voz aún no está grabada. La línea aparece completa en el panel.";return}
  var player=$("sceneVoiceAudio");
  if(!player.paused){player.pause();$("sceneVoicePlay").textContent="▶ Reproducir";return}
  if(!player.getAttribute("src"))player.src=src;
  player.play().then(function(){$("sceneVoicePlay").textContent="Ⅱ Pausar";$("sceneVoiceStatus").textContent="Reproduciendo la línea de "+npcDialogueDefs[line.speaker].name+"."}).catch(function(){$("sceneVoiceStatus").textContent="La grabación no está disponible. Puedes leer el texto."});
}
function sceneVoiceKeydown(event){
  if($("sceneVoiceModal").classList.contains("hidden"))return;
  if(event.key==="Escape"){event.preventDefault();event.stopImmediatePropagation();closeSceneVoice();return}
  if(event.key==="Tab"){
    var buttons=[$("sceneVoiceClose"),$("sceneVoicePlay"),$("sceneVoiceNext")],first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  // Number shortcuts must never select a decision behind this dialog.
  if(["1","2","3","4"].includes(event.key)){event.preventDefault();event.stopImmediatePropagation()}
}
function initSceneVoice(){
  $("sceneVoicePlay").addEventListener("click",playSceneVoice);
  $("sceneVoiceNext").addEventListener("click",advanceSceneVoice);
  $("sceneVoiceClose").addEventListener("click",function(){closeSceneVoice()});
  $("sceneVoiceModal").addEventListener("click",function(event){if(event.target===this)closeSceneVoice()});
  $("sceneVoiceAudio").addEventListener("ended",function(){$("sceneVoicePlay").textContent="▶ Reproducir";$("sceneVoiceStatus").textContent="Línea terminada. Puedes reproducirla otra vez o avanzar."});
  document.addEventListener("keydown",sceneVoiceKeydown,true);
}
