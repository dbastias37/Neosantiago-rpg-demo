/* Shared Exploration combat presentation, loot search and audio.
 * Both activities supply their own state and inventory operations. */
var audioRoutes={},audioMissing={},audioHoverButton=null,audioLoopInstances={},audioLoopFades={},audioUnlocked=false,sceneAmbienceRoutes=["ambience-title","ambience-battle","ambience-battle-victory"],AUDIO_CROSSFADE_MS=1600;
function loadAudioRoutes(){
  try{
    var node=$("audioRoutes"),parsed=node&&node.textContent?JSON.parse(node.textContent):{};
    Object.keys(parsed||{}).forEach(function(key){var value=parsed[key],clean;if(typeof value==="string"&&value)audioRoutes[key]=value;else if(Array.isArray(value)){clean=value.filter(function(path){return typeof path==="string"&&path});if(clean.length)audioRoutes[key]=clean}})
  }catch{}
}
function audioRouteList(name){
  var route=audioRoutes[name];
  if(Array.isArray(route))return route.slice();
  if(typeof route==="string"&&route)return[route];
  if(name!=="ui-click")return audioRouteList("ui-click");
  return[]
}
function sfxVolume(name){
  if(!name)return .3;
  if(name.indexOf("hover")>=0)return .12;
  if(name.indexOf("ambience")===0)return .24;
  if(name==="loot-search")return .34;
  if(name==="loot-loop")return .24;
  if(name.indexOf("shot")>=0||name.indexOf("grenade")>=0||name.indexOf("emp")>=0)return .42;
  if(name.indexOf("hp-")===0||name.indexOf("combat-")===0)return .34;
  if(name.indexOf("error")>=0||name.indexOf("disabled")>=0)return .24;
  return .28
}
function playAudioRoute(name,options,index){
  var routes=audioRouteList(name),path;options=options||{};index=index||0;
  if(!routes.length||typeof Audio==="undefined")return false;
  if(index>=routes.length)return false;
  if(options.random){var available=routes.filter(function(route){return !audioMissing[route]});if(!available.length)return false;path=available[Math.floor(Math.random()*available.length)]}else{path=routes[index];if(audioMissing[path])return playAudioRoute(name,options,index+1)}
  try{
    var sound=new Audio(path),nextSound;sound.preload="auto";sound.volume=options.volume!==undefined?options.volume:sfxVolume(name);sound.loop=!!options.loop;
    sound.addEventListener("error",function(){audioMissing[path]=true;if(options.loop)delete audioLoopInstances[name];nextSound=playAudioRoute(name,options,options.random?0:index+1);if(options.loop&&nextSound)audioLoopInstances[name]=nextSound},{once:true});
    var started=sound.play();if(started&&started.catch)started.catch(function(){});
    return sound
  }catch{audioMissing[path]=true;return playAudioRoute(name,options,index+1)}
}
function playSfx(name){
  var randomNames=["loot-take"];
  return !!playAudioRoute(name,{loop:false,random:randomNames.indexOf(name)>=0})
}
function playRandomSfx(name){
  return !!playAudioRoute(name,{loop:false,random:true})
}
function fadeLoopVolume(name,target,ms,after){
  var sound=audioLoopInstances[name],from;if(!sound)return false;clearInterval(audioLoopFades[name]);target=clamp(target,0,1);if(!ms){sound.volume=target;if(after)after();return true}from=sound.volume;var started=Date.now();audioLoopFades[name]=setInterval(function(){var progress=clamp((Date.now()-started)/ms,0,1),eased=progress<.5?2*progress*progress:1-Math.pow(-2*progress+2,2)/2;sound.volume=from+(target-from)*eased;if(progress>=1){clearInterval(audioLoopFades[name]);delete audioLoopFades[name];sound.volume=target;if(after)after()}},40);return true
}
function startLoopSfx(name,fadeMs){
  var target=sfxVolume(name),sound,randomLoop=name==="loot-loop";if(audioLoopInstances[name]){fadeLoopVolume(name,target,fadeMs||0);return true}sound=playAudioRoute(name,{loop:true,volume:fadeMs?0:target,random:randomLoop});if(!sound)return false;audioLoopInstances[name]=sound;if(fadeMs)fadeLoopVolume(name,target,fadeMs);return true
}
function stopLoopSfx(name,fadeMs){
  var sound=audioLoopInstances[name];if(!sound)return false;clearInterval(audioLoopFades[name]);delete audioLoopFades[name];if(fadeMs){return fadeLoopVolume(name,0,fadeMs,function(){try{sound.pause();sound.currentTime=0}catch{}delete audioLoopInstances[name]})}try{sound.pause();sound.currentTime=0}catch{}delete audioLoopInstances[name];return true
}
function setSceneAmbience(name,fadeMs){
  sceneAmbienceRoutes.forEach(function(key){if(key!==name)stopLoopSfx(key,fadeMs||0)});if(name&&audioUnlocked)startLoopSfx(name,fadeMs||0)
}
function unlockAudioAmbience(){
  audioUnlocked=true;if(battleState&&battleState.phase==="combat")setSceneAmbience("ambience-battle");else if(battleState&&battleState.phase==="loot")setSceneAmbience("ambience-battle-victory");else setSceneAmbience("ambience-title")
}

function statusHtml(tags){return'<div class="status-tags">'+(tags.length?tags.map(function(x){return'<span class="tag '+x[1]+'">'+esc(x[0])+'</span>'}).join(""):'<span class="tag">Estable</span>')+'</div>'}

function recordHp(side,index,from,to,max,damageSfx){
  if(!battleState||from===to)return;if(to>from)playSfx(from<=0&&side==="ally"?"hp-revive":"hp-heal");else if(to<=0)playSfx(side==="ally"?"hp-ally-down":"hp-enemy-down");else if(damageSfx==="none"){}else if(damageSfx)playRandomSfx(damageSfx);else playSfx(side==="ally"?"hp-ally-damage":"hp-enemy-damage");var fx=battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0];if(fx){fx.to=to;fx.delta+=to-from}else battleState.feedback.push({side:side,index:index,from:from,to:to,max:max,delta:to-from})
}

function hpFeedback(side,index){return battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0]||null}

function criticalFeedback(index){return battleState.criticalFeedback.filter(function(x){return x.index===index})[0]||null}

function hpBar(hp,max,fx){var to=Math.round(100*hp/max);if(!fx)return'<span style="width:'+to+'%"></span>';var from=Math.round(100*fx.from/fx.max);return'<span class="hp-shift" style="--hp-from:'+from+'%;--hp-to:'+to+'%;width:'+to+'%"></span>'}

function hpFloat(fx){if(!fx)return"";var heal=fx.delta>0,amount=Math.abs(fx.delta);return'<span class="hp-float '+(heal?'heal':'damage')+'">'+(heal?'+':'−')+amount+' HP</span>'}

function bagUsageBar(p){
  var used=bagUsed(p),capacity=bagCapacity(p),free=bagFree(p),pct=capacity?clamp(Math.round(100*used/capacity),0,100):100,mode=free<=0?"full":pct>=80?"warn":"";return'<div class="barline bagline '+mode+'" title="Mochila '+used+' de '+capacity+' espacios · '+pct+'% utilizado"><span>Moch</span><div class="bar bag"><span style="width:'+pct+'%"></span></div><b>'+pct+'%</b></div>'
}

function allyUnitHtml(p,i,lootPhase){
  var need=xpNeeded(p),xp=Math.round(100*p.xp/need),tags=[],fx=hpFeedback("ally",i),falling=p.hp<=0&&fx,selected=lootPhase&&battleState.looter===i,bagLine=lootPhase?bagUsageBar(p):"";
  var fatigue=hungerPenalty(p),weapon=weaponFor(p),mind=psychState(p);tags.push([mind.name,mind.tone]);if(p.hp<=0)tags.push(["Agotado","bad"]);if(p.bleed)tags.push(["Sangrado "+p.bleed,"bad"]);if(fatigue)tags.push([p.hunger<=10?"Energía crítica · −4":"Fatiga · precisión −2","bad"]);if(weaponAccuracyPenalty(p,weapon))tags.push(["Arma de fuego · precisión −2","bad"]);if(gear(p.equipment.head)&&gearDurability(p,"head")===0||gear(p.equipment.body)&&gearDurability(p,"body")===0)tags.push(["Equipo roto","bad"]);if(p.guard)tags.push(["Cobertura +"+p.guard,"good"]);if(!lootPhase&&i===battleState.actor&&p.hp>0)tags.push(["Actúa","good"]);if(lootPhase&&p.hp>0)tags.push([selected?"Saqueador":"Disponible",selected?"good":""]);
  var tag=lootPhase&&p.hp>0?"button":"article",attrs=lootPhase&&p.hp>0?' data-looter="'+i+'"':"";
  return'<'+tag+' class="unit '+(lootPhase?"loot-mode ":"")+(!lootPhase&&i===battleState.actor&&p.hp>0?"active ":"")+(lootPhase&&p.hp>0?"looter-choice ":"")+(selected?"looter-selected ":"")+(p.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal":"fx-damage"):"")+'"'+attrs+'>'+hpFloat(fx)+portraitArt("portraits/"+p.id+".webp",p.name,"ally-portrait-art")+'<div class="unit-info"><h3>'+esc(p.name)+'</h3><small>'+esc(p.role)+' · Lvl. '+p.level+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(p.hp,p.maxHp,fx)+'</div><b>'+p.hp+'/'+p.maxHp+'</b></div><div class="barline"><span>XP</span><div class="bar xp"><span style="width:'+xp+'%"></span></div><b>'+p.xp+'/'+need+'</b></div>'+bagLine+statusHtml(tags)+'</div></'+tag+'>'
}

function enemyUnitHtml(e,i,lootPhase){
  var tags=[],fx=hpFeedback("enemy",i),critical=criticalFeedback(i),falling=e.hp<=0&&fx;if(e.stun)tags.push(["Aturdido","bad"]);if(e.armor)tags.push(["Armadura "+e.armor,""]);
  var enemyPortrait=portraitArt("portraits/"+e.type+".webp",e.name,e.type==="drone"?"enemy-drone-art":"");
  if(lootPhase){
    var pending=e.looted&&pendingLootUnits(e.loot)>0,available=!e.searching&&(!e.looted||pending),stateClass=pending?"lootable":e.looted?"looted":e.searching?"":"lootable";
    var overlay=pending?'<span class="loot-call">VER LOOT</span>':e.looted?'<span class="loot-done">REGISTRADO</span>':e.searching?'<div class="corpse-search"><b>Registrando <span id="lootProgressText-'+i+'">'+e.progress+'%</span></b><div class="search-track"><span id="lootProgressBar-'+i+'" style="width:'+e.progress+'%"></span></div></div>':'<span class="loot-call">SAQUEAR</span>';
    return'<button class="unit corpse '+stateClass+'" '+(available?'data-loot-enemy="'+i+'"':'disabled')+'>'+overlay+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>Cuerpo sin señales vitales</small><div class="barline"><span>HP</span><div class="bar"><span style="width:0%"></span></div><b>0/'+e.maxHp+'</b></div>'+statusHtml([[pending?"Loot pendiente":e.looted?"Registrado":"Loot disponible",available?"good":""]])+'</div></button>'
  }
  return'<button class="unit '+(i===battleState.target&&!falling?"target ":"")+(e.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal ":"fx-damage "):"")+(critical?"critical-hit ":"")+'" data-target="'+i+'" '+(e.hp<=0?'disabled':'')+'>'+hpFloat(fx)+(critical?'<span class="critical-flash">GOLPE CRÍTICO<b>+4 XP · '+esc(state.party[critical.pIndex].name)+'</b></span>':"")+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>'+esc(e.role)+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(e.hp,e.maxHp,fx)+'</div><b>'+e.hp+'/'+e.maxHp+'</b></div>'+statusHtml(tags)+'</div></button>'
}

function renderBattle(){
  if(battleState&&battleState.config.objectiveRounds)$("battleBrief").textContent=battleState.config.brief+" Ronda "+battleState.round+" de "+battleState.config.objectiveRounds+".";
  if(!battleState)return;var lootPhase=battleState.phase==="loot",actor=state.party[battleState.actor],disabled=lootPhase||battleState.busy||!actor||actor.hp<=0;
  $("battleRound").textContent=lootPhase?"Zona asegurada":"Ronda "+String(battleState.round).padStart(2,"0");$("turnLabel").textContent=lootPhase?(battleState.looter===null?"Elige quién saquea":"Saquea "+state.party[battleState.looter].name):(actor?"Turno de "+actor.name:"Respuesta enemiga");
  $("allyUnits").innerHTML=state.party.map(function(p,i){return allyUnitHtml(p,i,lootPhase)}).join("");
  $("enemyUnits").innerHTML=battleState.enemies.map(function(e,i){return enemyUnitHtml(e,i,lootPhase)}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-target]"),function(b){b.onclick=function(){battleState.target=Number(b.dataset.target);renderBattle()}});
  Array.prototype.forEach.call(document.querySelectorAll("[data-looter]"),function(b){b.onclick=function(){selectLooter(Number(b.dataset.looter))}});
  Array.prototype.forEach.call(document.querySelectorAll("[data-loot-enemy]"),function(b){b.onclick=function(){beginLoot(Number(b.dataset.lootEnemy))}});
  Array.prototype.forEach.call(document.querySelectorAll("[data-action]"),function(b){var spent=b.dataset.action==="skill"&&battleState.skillUsed[battleState.actor]&&!(typeof fieldHasActive==="function"&&fieldHasActive(actor));b.disabled=disabled||(b.dataset.action==="flee"&&!battleState.config.canFlee)||!!spent;b.title=spent?"Habilidad agotada en este combate":""});
  $("turnControls").classList.toggle("hidden",lootPhase);$("lootControls").classList.toggle("hidden",!lootPhase);$("finishLoot").disabled=lootPhase&&battleState.busy;if(lootPhase)$("lootInstruction").textContent=battleState.looter===null?"Selecciona un aliado con vida y después el cuerpo que registrará.":state.party[battleState.looter].name+" está listo. Puedes cambiar de saqueador antes de abrir otro cuerpo.";
  if(!lootPhase&&actor)renderCombatItems(actor,disabled);else $("itemsToggle").disabled=true;
  $("combatLog").innerHTML=battleState.log.slice(-7).map(function(x){return'<p>› '+esc(x)+'</p>'}).join("");$("combatLog").scrollTop=$("combatLog").scrollHeight;battleState.feedback=[];battleState.criticalFeedback=[]
}

function selectLooter(i){if(!battleState||battleState.phase!=="loot"||battleState.busy||!state.party[i]||state.party[i].hp<=0)return;battleState.looter=i;battleState.log.push(state.party[i].name+" se prepara para saquear.");renderBattle()}

function beginLoot(i){
  if(!battleState||battleState.phase!=="loot"||battleState.busy)return;if(battleState.looter===null){toast("Primero selecciona quién saquea");return}var currentBattle=battleState,e=currentBattle.enemies[i];if(!e||e.searching)return;if(e.looted){if(pendingLootUnits(e.loot)>0)renderLootModal(i);return;}
  e.searching=true;e.progress=0;battleState.busy=true;battleState.log.push(state.party[battleState.looter].name+" registra a "+e.name+".");renderBattle();startLoopSfx("loot-loop",220);var step=Math.max(2,Math.round(10000/e.lootMs));clearInterval(lootInterval);lootInterval=setInterval(function(){if(battleState!==currentBattle||currentBattle.phase!=="loot")return;e.progress=Math.min(96,e.progress+step);var bar=$("lootProgressBar-"+i),label=$("lootProgressText-"+i);if(bar)bar.style.width=e.progress+"%";if(label)label.textContent=e.progress+"%"},100);
  setTimeout(function(){if(battleState!==currentBattle||currentBattle.phase!=="loot")return;clearInterval(lootInterval);stopLoopSfx("loot-loop",180);e.progress=100;e.searching=false;e.looted=true;e.loot=generateLoot(e);battleState.lootMessage="";battleState.busy=false;playSfx("loot-found");renderBattle();renderLootModal(i)},e.lootMs)
}

function pendingLootUnits(loot){return(loot||[]).reduce(function(sum,drop){return sum+(drop.status==="pending"?Math.max(1,Number(drop.qty)||1):0)},0)}

function canTakeAllLoot(p,loot){
  var pending=pendingLootUnits(loot);return !!(p&&pending>0&&pending<=bagFree(p))
}

function renderLootModal(enemyIndex){
  if(!battleState)return;var e=battleState.enemies[enemyIndex],p=state.party[battleState.looter],used=bagUsed(p),capacity=bagCapacity(p),free=bagFree(p),percent=Math.round(100*used/capacity),pending=pendingLootUnits(e.loot);battleState.openLoot=enemyIndex;$("lootTitle").textContent=e.name+" · loot";$("lootOwner").textContent=p.name+" registra el cuerpo";$("lootCapacityText").textContent=used+" / "+capacity+" espacios ocupados";$("lootCapacityPercent").textContent=percent+"%";$("lootCapacityBar").style.width=percent+"%";$("lootCapacity").classList.toggle("full",free===0);$("lootGuidance").textContent=pending>free?"No cabe todo el loot. Selecciona cada uno de los objetos que quieres llevar.":"Selecciona los objetos que quieres llevar o recoge todo el loot disponible.";$("lootMessage").textContent=battleState.lootMessage||"";$("lootMessage").classList.toggle("hidden",!battleState.lootMessage);
  $("lootItems").innerHTML=e.loot.map(function(drop,i){var d=gear(drop.id),done=drop.status!=="pending",units=Math.max(1,Number(drop.qty)||1),dis=lootDisassembleAction(i,drop),status=drop.status==="disassembled"?"Desarmado por Elías":drop.status==="broken"?"Elemento roto":"Ocupa "+units+" espacio"+(units===1?'':'s');return'<article '+itemDetailAttributes(drop.id)+' class="loot-drop '+(done?drop.status:"")+'">'+itemArt(drop.id,d&&d.name,"",true)+'<span class="loot-drop-copy"><strong>'+esc((d?d.name:drop.id)+(drop.qty>1?" ×"+drop.qty:""))+'</strong><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>'+esc(status)+'</em></span><div class="loot-buttons '+(dis?'has-disassembly':'')+'"><button data-take-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="taken"?"Tomado":"Tomar")+'</button>'+dis+'<button class="discard" data-discard-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="discarded"?"Descartado":"Descartar")+'</button></div></article>'}).join("");
  $("takeAllLoot").textContent="Saquear todo · "+pending+" espacios";$("takeAllLoot").classList.toggle("hidden",pending===0);Array.prototype.forEach.call(document.querySelectorAll("[data-take-loot]"),function(b){b.addEventListener("click",function(){takeLoot(Number(b.dataset.takeLoot))})});Array.prototype.forEach.call(document.querySelectorAll("[data-disassemble-loot]"),function(b){b.addEventListener("click",function(){openDisassemblyFromLoot(Number(b.dataset.disassembleLoot))})});Array.prototype.forEach.call(document.querySelectorAll("[data-discard-loot]"),function(b){b.addEventListener("click",function(){discardLoot(Number(b.dataset.discardLoot))})});$("lootModal").classList.remove("hidden");$("closeLoot").focus()
}
