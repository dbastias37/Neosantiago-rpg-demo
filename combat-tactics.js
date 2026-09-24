"use strict";
// Expedition tactics share the existing attack, XP, loot and battle presentation.
var combatWeaponRoster={merodeador:"knife",merodeador2:"pipe",merodeador3:"machete",merodeador4:"shotgun12",merodeador5:"revolver",agent:"pistol9",agent2:"rifle556",agent3:"knife",agent4:"shotgunLong"};
function combatCollectibleDrop(enemy,out){
  if(!battleState||battleState.collectibleAssigned)return;
  // One collectible per battle; drones may carry a copied memory module.
  var index=battleState.enemies.indexOf(enemy),bodies=battleState.enemies.map(function(e,i){return i});
  if(battleState.collectibleBody===undefined)battleState.collectibleBody=bodies[rand(0,bodies.length-1)];
  if(index!==battleState.collectibleBody)return;
  var group=enemy.lootGroup,ids=Object.keys(battleCollectibles).filter(function(id){return group==="drone"?id==="usb_agent"||id==="usb_surface":group==="agent"?id==="usb_agent"||id==="usb_surface":id!=="usb_agent"}),missing=ids.filter(function(id){return state.collection.indexOf(id)<0});
  var pool=missing.length?missing:ids,id=pool[rand(0,pool.length-1)];out.push({id:id,qty:1,status:"pending",collectible:true});battleState.collectibleAssigned=true
}
function takeCombatCollectible(drop){
  if(!drop||!drop.collectible||drop.status!=="pending")return false;
  if(state.collection.indexOf(drop.id)<0)state.collection.push(drop.id);
  drop.status="taken";battleState.log.push("Recolección: "+battleCollectibles[drop.id].name+" queda registrada en la galería.");return true
}
function collectionGallery(){
  var obtained=collectedIds();return'<p class="collection-intro">Objetos recuperados de los túneles y memorias de quienes vivieron a ambos lados del conflicto. Registra los cuerpos tras cada batalla para completar la colección. Los hallazgos no ocupan mochila.</p><div class="collection-grid">'+Object.keys(battleCollectibles).map(function(id){var d=battleCollectibles[id],found=obtained.indexOf(id)>=0;return'<article class="collection-card '+(found?'found':'unknown')+'" tabindex="0" aria-label="'+esc(found?d.name+": "+d.story:"Objeto sin recuperar")+'"><span class="collection-mark">'+(found?collectibleGlyph(id):"?")+'</span><b>'+esc(found?d.name:"Sin recuperar")+'</b><small>'+esc(found?d.type+" · "+d.source:"Registra más cuerpos")+'</small>'+(found?'<p>'+esc(d.story)+'</p>':'')+'</article>'}).join('')+'</div>'
}
function enemyCombatWeapon(type){return combatWeaponRoster[type]||null}
function gainSynergy(index,amount){
  var b=battleState;if(!b||b.phase!=="combat"||b.synergyExecuting||!state.party[index]||state.party[index].hp<=0)return;
  // Repeated hits by one ally count, but a full squad fills the bar faster.
  b.synergy=Math.min(100,(b.synergy||0)+amount);if(b.synergy===100&&!b.synergyAnnounced){b.synergyAnnounced=true;b.log.push("Sinergia al 100%. Los tres pueden coordinar una pasada.")}
}
function applyCombatBleeding(target,weapon,damage,critical){
  if(!target||target.hp<=0||target.mechanical||!weapon||damage<5)return;
  var id=weapon.category,cut=id==="melee"&&(weapon===gear("knife")||weapon===gear("machete"));
  var chance=cut?.34:id==="shotgun"?.28:weapon.ammo?.16:0;
  if(!chance||random()>chance+(critical?.17:0))return;
  var turns=id==="shotgun"?2:cut?3:2,loss=id==="shotgun"?3:2;
  if(!target.bleed)target.bleedDamage=0;
  target.bleed=Math.max(target.bleed||0,turns);target.bleedDamage=Math.max(target.bleedDamage||0,loss);
  battleState.log.push(target.name+" sangra por "+weapon.name+" ("+loss+" HP durante "+turns+" turnos).")
}
function tickEnemyBleeding(e){
  if(!e.bleed||e.hp<=0)return false;
  var before=e.hp,loss=e.bleedDamage||2;e.hp=Math.max(0,e.hp-loss);e.bleed--;state.stats.damageDealt+=before-e.hp;
  recordHp("enemy",battleState.enemies.indexOf(e),before,e.hp,e.maxHp);battleState.log.push(e.name+" pierde "+loss+" HP por sangrado.");
  if(e.hp<=0){battleState.log.push(e.name+" queda fuera de combate.");state.stats.enemies++;if(!livingEnemies().length)setSceneAmbience("ambience-battle-victory",AUDIO_CROSSFADE_MS);return true}return false
}
function tacticReady(p,id){return hasSkill(p,id)&&battleState.phase==="combat"&&battleState.round>=(battleState.tacticCooldown[p.id]||1)}
function tacticStrike(p,e,scale,bonus,label){
  if(!e||e.hp<=0)return false;
  var w=weaponFor(p);if(w.ammo&&!consumeFromBag(p,w.ammo)){battleState.log.push(p.name+" no tiene "+gear(w.ammo).name+"; cambia al cuchillo.");w=gear("knife")}else if(w.ammo)state.stats.shots++;
  state.stats.attacks++;var roll=d20(),critical=fieldCritical(p,roll),accuracy=w.accuracy+p.level+hungerPenalty(p)+personalAccuracyBonus(p)+bonus+weaponAccuracyPenalty(p,w);
  if(roll+accuracy<e.def){state.stats.misses++;combatNotice("ally",battleState.actor,"FALLÓ","miss");battleState.log.push(p.name+" falla "+label+" contra "+e.name+".");return false}
  state.stats.hits++;var damage=Math.max(2,Math.round((rand(w.damage[0],w.damage[1])+personalDamageBonus(p,e))*scale*(critical?1.75:1)));
  battleState.attackWeapon=w;try{fieldStrike(e,damage,p.name+" ejecuta "+label,battleState.actor,critical)}finally{battleState.attackWeapon=null}return true
}
function useBattleTactic(type,e){
  var b=battleState,p=state.party[b.actor];if(b.phase!=="combat"||b.busy||!p||p.hp<=0)return;
  if(type==="synergy"){
    if(b.synergy!==100||b.round<b.synergyReadyRound||state.party.some(function(a){return a.hp<=0})){toast("La sinergia necesita 100%, los tres aliados en pie y el enfriamiento completo");return}
    if(!e)return;b.synergy=0;b.synergyAnnounced=false;b.synergyReadyRound=b.round+3;b.synergyExecuting=true;b.log.push("Sinergia activada: Sara, Elías y Noa coordinan tres acciones.");
    // One activation uses the current actor's turn; each ally attacks exactly once.
    state.party.forEach(function(ally){if(!livingEnemies().length)return;var target=e.hp>0?e:livingEnemies()[0],oldActor=b.actor;b.actor=state.party.indexOf(ally);tacticStrike(ally,target,.7,1,"ataque sincronizado");b.actor=oldActor});b.synergyExecuting=false;
  }else{
    var id=type.slice(7),node=skillNode(p,id);if(!node||node.branch!=="Combate coordinado"||!tacticReady(p,id)){toast("Esta táctica todavía no está disponible");return}
    if(!e)return;
    var disarm=/disarm$/.test(id),double=/double$/.test(id),knock=/knock$/.test(id),distract=/distract$/.test(id),precision=/precision$/.test(id);
    if(disarm&&(!e.weapon||e.mechanical)){toast("El objetivo no lleva un arma que puedas quitar");return}
    b.tacticCooldown[p.id]=b.round+2;
    if(distract){e.distraction=1;gainSynergy(b.actor,25);b.log.push(p.name+" distrae a "+e.name+": −2 de precisión en su próximo ataque.")}
    else if(disarm){var roll=d20()+p.level+hungerPenalty(p)+(p.id==="noa"?3:2);if(roll>=e.def+2){var weapon=e.weapon;e.weapon=null;e.droppedWeapon=weapon;b.log.push(p.name+" desarma a "+e.name+". "+gear(weapon).name+" queda junto al cuerpo.");gainSynergy(b.actor,22)}else{b.log.push(p.name+" falla al quitar el arma de "+e.name+".");if(random()<.3){var before=p.hp;p.hp=Math.max(0,p.hp-rand(3,6));state.stats.damageTaken+=before-p.hp;recordHp("ally",b.actor,before,p.hp,p.maxHp);b.log.push(p.name+" se hiere durante el forcejeo.")}}}
    else if(double){for(var i=0;i<2&&e.hp>0;i++)tacticStrike(p,e,.62,0,"golpe doble · "+(i+1)+"/2")}
    else if(knock){if(tacticStrike(p,e,.72,0,"golpe de aturdimiento")&&e.hp>0&&random()<.65){e.stun=Math.max(e.stun,1);b.log.push(e.name+" pierde su siguiente turno.")}}
    else if(precision)tacticStrike(p,e,1.12,3,"golpe certero");
  }
  if(lethalFeedback()){settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});return}endPlayerTurn()
}
function renderBattleTactics(){
  var tray=$("tacticsTray"),b=battleState;if(!tray||!b)return;
  if(b.phase!=="combat"){tray.classList.add("hidden");return}var actor=state.party[b.actor],disabled=b.busy||!actor||actor.hp<=0;
  var nodes=(skillTrees[actor.id]||[]).filter(function(n){return n.branch==="Combate coordinado"&&hasSkill(actor,n.id)});
  tray.innerHTML=nodes.map(function(n){var remaining=Math.max(0,(b.tacticCooldown[actor.id]||1)-b.round),active=!remaining,disarm=/disarm$/.test(n.id),target=selectedEnemy(),sound=/precision$|double$|knock$/.test(n.id)?weaponSfxForActor():"combat-melee";return'<button type="button" data-tactic="'+n.id+'" data-sfx="'+sound+'" '+(disabled||!active||(disarm&&(!target||!target.weapon||target.mechanical))?'disabled':'')+' title="'+esc(n.desc)+'">'+esc(n.name)+(remaining?' · '+remaining+' ronda'+(remaining===1?'':'s'):'')+'</button>'}).join("");
  tray.classList.toggle("hidden",!nodes.length);tray.querySelectorAll("[data-tactic]").forEach(function(button){button.onclick=function(){combatAction("tactic:"+button.dataset.tactic)}});
  var synergy=$("activateSynergy");synergy.disabled=disabled||b.synergy!==100||b.round<b.synergyReadyRound||state.party.some(function(a){return a.hp<=0});synergy.title="Tres ataques en una acción · requiere 100% y los tres aliados en pie · enfriamiento de 2 rondas";
  synergy.textContent="Activar sinergia"+(b.round<b.synergyReadyRound?" · "+(b.synergyReadyRound-b.round)+" rondas":"");
  var meter=$("synergyFill");meter.style.height=(b.synergy||0)+"%";$("synergyValue").textContent=(b.synergy||0)+"%";
}
