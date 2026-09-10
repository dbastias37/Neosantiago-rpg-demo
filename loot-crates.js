"use strict";

// A complete, serializable encounter. Only explicit combination checks spend tries.
var crateTypes={
  electronic:{title:"Suministros electrónicos",mark:"TECNOLOGÍA · RED UNO",art:"electronic-pair",hint:"Celdas, circuitos y tecnología recuperable."},
  ammo:{title:"Caja de munición",mark:"RESERVA DE CAMPO",art:"ammo-pair",hint:"Munición, armamento escaso y cargas explosivas."},
  medical:{title:"Suministros médicos",mark:"EQUIPO SANITARIO",art:"medical-pair",hint:"Vendajes, botiquines y medicina conservada."}
};
var crateFlashTimer=null;
function crateStore(){
  if(!state.lootCrates)state.lootCrates={checked:{},lastIndex:-10,active:null};
  return state.lootCrates;
}
function activeCrate(){return state.lootCrates&&state.lootCrates.active}
function crateVisible(){return !$("crateModal").classList.contains("hidden")}
function cratePopcount(n){var count=0;while(n){count+=n&1;n>>>=1}return count}
function crateBoard(day){
  var count=day>=3?6:5,order=Array.from({length:count},function(_,i){return i});
  if(day>=2)for(var i=count-1;i>0;i--){var j=rand(0,i),v=order[i];order[i]=order[j];order[j]=v}
  // Edges of a path form an independent basis: every generated target is reachable.
  var masks=order.slice(1).map(function(n,i){return (1<<n)|(1<<order[i])});
  var initial=rand(1,(1<<count)-2),solution=rand(1,(1<<masks.length)-1);
  if(cratePopcount(solution)<2)solution|=3;
  var target=initial;masks.forEach(function(mask,i){if(solution&(1<<i))target^=mask});
  return {count:count,masks:masks,initial:initial,target:target,current:initial,switches:0};
}
function crateRewards(type){
  var drops=[],add=function(id,qty){addLootDrop(drops,id,qty)};
  if(type==="electronic"){
    add("battery",rand(1,2));add("electronics",rand(1,2));
    var extra=random();if(extra<.20)add("emp",1);else if(extra<.55)add("pulseCore",1);
  }else if(type==="ammo"){
    var calibres=["ammo9","ammo556","shell12"],first=rand(0,2);
    add(calibres[first],first===2?rand(2,3):rand(3,5));
    if(random()<.45)add(calibres[(first+1)%3],rand(1,2));
    if(random()<.18)add("grenade",1);
    if(random()<.04)add(["pistol9","revolver","shotgun12","rifle556"][rand(0,3)],1);
  }else{
    add("bandage",rand(1,2));add(random()<.30?"medkit":"meds",1);
    if(random()<.15)add("stimulant",1);
  }
  return drops;
}
function crateCandidate(ev,choice,out){
  if(!ev||!choice||!out||choice.ending||choice._routeNarrative||choice._signalTracking)return null;
  if(choice.roll&&out!==choice.roll.success)return null;
  if(choice.combat&&out!==choice.victory)return null;
  var label=choice.label||"",title=ev.title;
  // Explicit story actions, not keywords guessed from a background image.
  if(title==="La puerta sellada"&&/^(Alimentar el lector|Forzar el mecanismo)$/.test(label))return "electronic";
  if(title==="Agua sobre los rieles"&&/^(Cruzar asegurados con una cuerda|Cortar la corriente antes de cruzar)$/.test(label))return "medical";
  if(title==="El campamento apagado"&&label==="Registrar el campamento")return "ammo";
  if(title==="El guardián reconstruido"&&choice.combat)return "electronic";
  if(title==="El pulso del dron"&&choice.combat)return "electronic";
  if(title==="La mesa para cuatro"&&label==="Tomar suministros y marcharse")return "medical";
  if(title==="La máquina que recuerda"&&!/solo el origen/.test(label))return "electronic";
  if(title==="El núcleo expuesto"&&label==="Extraer el núcleo")return "medical";
  if(title==="Los cascos morados"&&choice.combat)return "ammo";
  if(title==="El nido de vigilancia"&&choice.combat)return "electronic";
  if(title==="Los muertos sin núcleo"&&label==="Registrar equipo de la Red UNO")return "ammo";
  return null;
}
function prepareCrate(choice,out){
  if(!pending||pending.dialogue||pending.ending||pending.returnToRefuge||state.morale<=0||state.refuge.active)return;
  var ev=eventDisplay(events[state.index],state.index),type=crateCandidate(ev,choice,out),store=crateStore(),key=String(state.index);
  if(!type||store.checked[key])return;
  store.checked[key]=true;
  if(state.index-store.lastIndex<3||random()>=.25)return;
  store.lastIndex=state.index;
  pending.crate={version:1,index:state.index,type:type,location:ev.loc,phase:"help",helpReturn:"playing",board:crateBoard(ev.day),failures:0,spareUsed:false,lastProbe:null,history:[],drops:crateRewards(type),owner:Math.max(0,state.party.findIndex(function(p){return p.hp>0})),message:"",outcome:null};
}
function openPendingCrate(){
  if(!pending||!pending.crate)return false;
  crateStore().active=pending.crate;delete pending.crate;
  // Commit both the resolved decision and its continuation, never either alone.
  encounterSaveLocked=false;save();showCrate();return true;
}
function showCrate(){
  if(!activeCrate())return;
  $("crateModal").classList.remove("hidden");renderCrate();signalLastTick=Date.now();
  $(activeCrate().phase==="loot"||activeCrate().phase==="sealed"?"crateLeave":"cratePrimary").focus({preventScroll:true});
}
function resumeCrate(){
  var c=activeCrate();if(!c)return false;
  pending={ending:null,returnToRefuge:null,dialogue:null,dialogueSeen:true};
  if(c.phase==="blown")c.phase=c.spareUsed?"sealed":"failed";
  showCrate();save();return true;
}
function resetCrateUI(){
  clearTimeout(crateFlashTimer);crateFlashTimer=null;$("crateModal").classList.add("hidden");
  $("crateModal").classList.remove("fuse-flash");
}
function crateLampRow(bits,count,label){
  var lamps="";for(var i=0;i<count;i++)lamps+='<span class="crate-lamp-cell"><i class="crate-lamp '+(bits&(1<<i)?'on':'off')+'" aria-hidden="true"></i><span>'+(i+1)+'</span><span class="sr-only">'+(bits&(1<<i)?'encendida':'apagada')+'</span></span>';
  return '<div class="crate-lamp-caption">'+label+'</div><div class="crate-lamps" style="--lamp-count:'+count+'">'+lamps+'</div>';
}
function renderCrate(){
  var c=activeCrate();if(!c)return;var def=crateTypes[c.type],b=c.board,phase=c.phase;
  $("crateModal").dataset.phase=phase;$("crateModal").dataset.type=c.type;
  $("crateTitle").textContent=def.title;$("crateLocation").textContent=c.location;
  $("crateMark").textContent=def.mark;
  $("crateArt").style.backgroundImage='url("'+assetUrl('crates/'+def.art+'.webp')+'")';
  $("crateArt").classList.toggle("opened",phase==="loot");
  $("crateArt").setAttribute("aria-label",def.title+(phase==="loot"?", abierta":", cerrada"));
  $("crateSeal").textContent=phase==="loot"?"CIERRE LIBERADO":phase==="failed"||phase==="sealed"?"FUSIBLE QUEMADO":"CIERRE ELECTRÓNICO";
  ["help","playing","failed","loot"].forEach(function(p){$("crateScreen-"+p).classList.toggle("hidden",p==="playing"?phase!=="playing"&&phase!=="blown":p==="failed"?phase!=="failed"&&phase!=="sealed":phase!==p)});
  $("crateHelp").classList.toggle("hidden",phase!=="playing");
  $("crateMessage").textContent=c.message||"";
  $("crateLeave").textContent=phase==="loot"?"Volver a expedición":"Dejar caja";
  $("cratePrimary").disabled=phase==="blown";
  $("crateLeave").disabled=phase==="blown";
  $("cratePrimary").classList.toggle("hidden",phase==="sealed"||phase==="loot");
  $("cratePrimary").textContent=phase==="help"?(c.helpReturn==="playing"&&c.failures?"Volver al panel":"Iniciar puzzle"):phase==="failed"?"Intentar otra vez":"Probar combinación";
  if(phase==="playing"||phase==="blown"){
    $("crateLights").innerHTML=crateLampRow(b.target,b.count,"OBJETIVO")+crateLampRow(b.current,b.count,"ESTADO ACTUAL");
    $("crateSwitches").innerHTML=b.masks.map(function(mask,i){var numbers=[];for(var n=0;n<b.count;n++)if(mask&(1<<n))numbers.push(n+1);var on=!!(b.switches&(1<<i));return '<button type="button" class="crate-switch '+(on?'active':'')+'" data-crate-switch="'+i+'" aria-pressed="'+on+'" '+(phase==="blown"?'disabled':'')+'><b>'+String.fromCharCode(65+i)+'</b><span><i aria-hidden="true"></i><small>Cambia '+numbers.join(' y ')+'</small></span></button>'}).join("");
    $("crateAttempts").innerHTML='<span>'+(c.spareUsed?'FUSIBLE DE REPUESTO':'FUSIBLE PRINCIPAL')+'</span><strong>'+(c.spareUsed?'ÚLTIMA OPORTUNIDAD':(5-c.failures)+' pruebas restantes')+'</strong>';
    $("crateHistory").textContent=c.history.length?'Última prueba: '+c.history[c.history.length-1].matches+' de '+b.count+' luces correctas.':'';
  }
  if(phase==="failed"||phase==="sealed"){
    $("crateFailureTitle").textContent=phase==="sealed"?"CAJA BLOQUEADA":"APERTURA FALLIDA";
    $("crateFailureText").textContent=phase==="sealed"?'El fusible de repuesto también se quemó. El cierre quedó inutilizado y la caja permanece sellada.': 'El fusible se reventó tras cinco combinaciones incorrectas. Elías tiene un fusible de repuesto. Piensa bien la combinación: tienes una oportunidad más.';
  }
  if(phase==="loot")renderCrateLoot();
}
function toggleCrateSwitch(i){
  var c=activeCrate();if(!c||c.phase!=="playing"||!Number.isInteger(i)||!c.board.masks[i])return;
  c.board.current^=c.board.masks[i];c.board.switches^=1<<i;c.message="";playSfx("ui-click");save();renderCrate();
  var btn=$("crateSwitches").querySelector('[data-crate-switch="'+i+'"]');if(btn)btn.focus({preventScroll:true});
}
function probeCrate(){
  var c=activeCrate();if(!c||c.phase!=="playing")return;
  if(c.lastProbe===c.board.current){c.message="Cambia la combinación antes de volver a probar.";renderCrate();return}
  c.lastProbe=c.board.current;
  if(c.board.current===c.board.target){c.phase="loot";c.outcome="opened";c.message="Cierre liberado. Elige quién recoge los suministros.";playSfx("loot-found");save();renderCrate();$("crateLeave").focus();return}
  c.failures++;c.history.push({pattern:c.board.current,matches:c.board.count-cratePopcount(c.board.current^c.board.target)});
  c.message="Combinación incorrecta. Revisa el patrón y los interruptores.";
  if(c.spareUsed||c.failures>=5){
    c.phase="blown";c.message="Sobrecarga. El fusible se ha quemado.";if(c.spareUsed)c.outcome="sealed";
    save();renderCrate();$("crateModal").classList.add("fuse-flash");playSfx("ui-error");
    clearTimeout(crateFlashTimer);crateFlashTimer=setTimeout(function(){
      if(activeCrate()!==c||c.phase!=="blown")return;
      c.phase=c.spareUsed?"sealed":"failed";c.message="";$("crateModal").classList.remove("fuse-flash");save();renderCrate();$(c.spareUsed?"crateLeave":"cratePrimary").focus();
    },1500);return;
  }
  playSfx("ui-error");save();renderCrate();
}
function cratePrimary(){
  var c=activeCrate();if(!c)return;
  if(c.phase==="help"){c.phase=c.helpReturn||"playing";c.message="";save();renderCrate();return}
  if(c.phase==="failed"&&!c.spareUsed){c.spareUsed=true;c.phase="playing";c.lastProbe=null;c.message="Fusible de repuesto instalado. Solo queda una comprobación.";playSfx("ui-click");save();renderCrate();return}
  probeCrate();
}
function crateHelp(){var c=activeCrate();if(!c||c.phase!=="playing")return;c.helpReturn=c.phase;c.phase="help";save();renderCrate();$("cratePrimary").focus()}
function renderCrateLoot(){
  var c=activeCrate(),p=state.party[c.owner];
  $("crateOwners").innerHTML=state.party.map(function(member,i){return '<button type="button" data-crate-owner="'+i+'" aria-pressed="'+(c.owner===i)+'" '+(member.hp<=0?'disabled':'')+'><strong>'+esc(member.name)+'</strong><small>'+bagFree(member)+' espacios libres</small></button>'}).join("");
  $("crateDrops").innerHTML=c.drops.map(function(drop,i){var d=gear(drop.id),left=drop.qty-(drop.taken||0);return '<div class="crate-drop '+(!left?'taken':'')+'"><button type="button" class="crate-item-info" data-crate-info="'+drop.id+'" aria-label="Ver ficha de '+esc(d.name)+'">'+itemArt(drop.id,d.name)+'<span>'+esc(d.name)+'<small>'+(left?'×'+left:'Recogido')+'</small></span></button>'+(left?'<button type="button" class="crate-take" data-crate-take="'+i+'" '+(!p||p.hp<=0||bagFree(p)<1?'disabled':'')+'>Recoger</button>':'<span class="crate-taken">LISTO</span>')+'</div>'}).join("");
  $("crateAll").disabled=!p||p.hp<=0||bagFree(p)===0||c.drops.every(function(d){return (d.taken||0)>=d.qty});
  $("crateAll").textContent="Recoger lo que quepa";
}
function takeCrateDrop(i,quiet){
  var c=activeCrate();if(!c||c.phase!=="loot")return 0;
  var d=c.drops[i],p=state.party[c.owner];if(!d||!p||p.hp<=0)return 0;
  var qty=Math.min(d.qty-(d.taken||0),bagFree(p));if(qty<=0)return 0;
  if(!addToBag(p,d.id,qty))return 0;
  d.taken=(d.taken||0)+qty;recordLoot(d.id,qty);checkMissions();
  c.message=gear(d.id).name+" ×"+qty+" guardado en la mochila de "+p.name+".";
  save();if(!quiet){playSfx("loadout-transfer");renderMini();renderCrate()}return qty;
}
function takeAllCrateLoot(){var c=activeCrate();if(!c||c.phase!=="loot")return;c.drops.forEach(function(_,i){takeCrateDrop(i,true)});playSfx("loadout-transfer");renderMini();renderCrate()}
function leaveCrate(){
  var c=activeCrate();if(!c||c.phase==="blown")return;
  if(c.phase==="loot"&&c.drops.some(function(d){return (d.taken||0)<d.qty})&&!c.confirmLeave){c.confirmLeave=true;c.message="Quedan objetos en la caja. Pulsa otra vez para dejarlos y continuar.";renderCrate();return}
  var store=crateStore();store.checked[String(c.index)]=c.outcome||"left";store.active=null;
  resetCrateUI();signalLastTick=Date.now();
  if(pending)continuePendingAdvance();else save();
}
function crateBack(){
  var c=activeCrate();if(!c)return false;
  if(c.phase==="help"&&c.helpReturn==="playing"){cratePrimary();return true}
  // Back must never discard the chest or spend the last chance implicitly.
  return false;
}
function crateKeydown(e){
  if(!crateVisible())return false;
  if(e.key==="Escape"){e.preventDefault();crateBack();return true}
  if(e.key==="Tab"){
    var controls=Array.prototype.filter.call($("crateModal").querySelectorAll('button:not([disabled]),[tabindex="0"]'),function(el){return !el.closest('.hidden')});
    var first=controls[0],last=controls[controls.length-1];
    if(first&&(e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===last)){e.preventDefault();(e.shiftKey?last:first).focus()}
  }
  return true;
}
$("cratePrimary").addEventListener("click",cratePrimary);
$("crateLeave").addEventListener("click",leaveCrate);
$("crateHelp").addEventListener("click",crateHelp);
$("crateAll").addEventListener("click",takeAllCrateLoot);
$("crateModal").addEventListener("click",function(e){
  var btn=e.target.closest&&e.target.closest('button');if(!btn||btn.disabled)return;
  if(btn.dataset.crateSwitch!==undefined)toggleCrateSwitch(Number(btn.dataset.crateSwitch));
  if(btn.dataset.crateOwner!==undefined&&activeCrate()&&activeCrate().phase==="loot"){var i=Number(btn.dataset.crateOwner);if(state.party[i]&&state.party[i].hp>0){activeCrate().owner=i;activeCrate().confirmLeave=false;save();renderCrate()}}
  if(btn.dataset.crateTake!==undefined){if(activeCrate())activeCrate().confirmLeave=false;takeCrateDrop(Number(btn.dataset.crateTake))}
  if(btn.dataset.crateInfo)openItemDetails(btn.dataset.crateInfo,btn);
});
