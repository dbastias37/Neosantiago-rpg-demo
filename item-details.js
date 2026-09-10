// Read-only object inspection. Prices and salvage outputs come from the game catalogs.
var itemDetailState=null;

function itemDetailAttributes(id){
  return gear(id)?'data-item-detail="'+esc(id)+'"':""
}
function itemPurpose(id){
  var d=gear(id),lines=[d.desc],products=[];
  if(d.kind==="weapon")lines.push("Equípala desde la ficha del aliado. "+(d.ammo?"Utiliza "+gear(d.ammo).name.toLowerCase()+" de su mochila para disparar.":"Se utiliza cuerpo a cuerpo y no gasta munición."));
  if(d.kind==="ammo")lines.push("Se utiliza desde la mochila del aliado que lleva el arma compatible.");
  if(d.slot==="head"||d.slot==="body")lines.push("Equípalo para reducir el daño recibido. Si su durabilidad llega a cero, deja de proteger hasta que lo repares.");
  if(d.slot==="backpack")lines.push("Equípala para ampliar la capacidad del aliado. Cada unidad guardada ocupa un espacio.");
  if(["food","meds","medkit","bandage","stimulant","traumaKit"].indexOf(id)>=0)lines.push("Se consume al utilizarlo desde la ficha del aliado. La recuperación no supera su salud o energía máximas.");
  if(id==="scrap")lines.push("También se utiliza para reparar cascos y chalecos desde las fichas de los aliados.");
  if(id==="battery")lines.push("Puedes gastar una celda desde el inhibidor para ampliar su cobertura.");
  workshopRecipes.forEach(function(recipe){if(recipe.cost[id]&&products.indexOf(gear(recipe.id).name)<0)products.push(gear(recipe.id).name)});
  if(products.length)lines.push("Material para fabricar: "+products.join(", ")+". Las recetas pueden requerir habilidades y otros materiales.");
  return lines.join("\n\n")
}
function itemFacts(id){
  var d=gear(id),facts=[];
  if(d.damage)facts.push(["Daño base",d.damage[0]+"–"+d.damage[1]]);
  if(d.accuracy!==undefined)facts.push(["Precisión base","+"+d.accuracy]);
  if(d.ammo)facts.push(["Munición",gear(d.ammo).name]);
  if(d.defense)facts.push(["Defensa base","+"+d.defense]);
  if(d.maxDurability)facts.push(["Durabilidad máxima",d.maxDurability]);
  if(d.capacity)facts.push(["Capacidad",d.capacity+" espacios"]);
  return facts.map(function(f){return'<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>'}).join("")
}
function itemPricesHtml(id){
  var d=gear(id),rows=[];
  [{name:"Mara",catalog:tradeCatalog},{name:"El Armero",catalog:armorerCatalog}].forEach(function(merchant){
    var offer=merchant.catalog[id];if(!offer||d.kind==="mission")return;
    rows.push('<tr><th scope="row">'+merchant.name+'</th><td>'+(offer.buy?offer.buy+" fichas":"No vende")+'</td><td>'+(offer.sell?offer.sell+" fichas":"No compra")+'</td></tr>')
  });
  return rows.length?'<table><caption>Precios por unidad</caption><thead><tr><th scope="col">Puesto</th><th scope="col">Comprar<br><small>Pagas</small></th><th scope="col">Vender<br><small>Recibes</small></th></tr></thead><tbody>'+rows.join("")+'</tbody></table><p class="item-detail-note">La compra depende del stock del puesto y del espacio disponible en las mochilas.</p>':'<p>Este objeto no se compra ni se vende en los puestos del refugio.</p>'
}
function itemDisassemblyHtml(id){
  var recipe=disassemblyRecipe(id);
  if(!recipe)return'<p>Este objeto no se puede desarmar.</p>';
  return'<p>Al desarmar correctamente una unidad, recuperas:</p><ul class="item-detail-rewards">'+rewardList(recipe).map(function(reward){
    return'<li>'+itemArt(reward.id,gear(reward.id).name)+'<span>'+esc(gear(reward.id).name)+'</span><b>×'+reward.qty+'</b></li>'
  }).join("")+'</ul><p class="item-detail-note">'+(eliasCanDisassemble()?"Elías ya tiene Desarme fino.":"Requiere desbloquear Desarme fino en las habilidades de Elías.")+" El desarme consume una unidad del objeto. Si fallas los tres intentos, se destruye sin entregar materiales. Las piezas se guardan en la mochila de Elías, que necesita espacio para recibirlas.</p>"
}
function openItemDetails(id,opener){
  var d=gear(id);if(!d||itemDetailState)return false;
  var background=opener&&opener.closest?opener.closest(".overlay"):null;
  if(background&&background.classList.contains("hidden"))return false;
  if(opener&&opener.closest&&opener.closest("[inert]"))return false;
  itemDetailState={id:id,opener:opener||null,background:background};
  $("itemDetailTitle").textContent=d.name;
  $("itemDetailImage").innerHTML=itemArt(id,d.name);
  $("itemDetailPurpose").textContent=itemPurpose(id);
  $("itemDetailFacts").innerHTML=itemFacts(id);
  $("itemDetailFacts").classList.toggle("hidden",!$("itemDetailFacts").innerHTML);
  $("itemDetailPrices").innerHTML=itemPricesHtml(id);
  $("itemDetailDisassembly").innerHTML=itemDisassemblyHtml(id);
  if(background)background.setAttribute("inert","");
  $("itemDetailModal").classList.remove("hidden");$("itemDetailReading").scrollTop=0;
  $("itemDetailBack").focus({preventScroll:true});playSfx("ui-open-panel");return true
}
function closeItemDetails(restoreFocus){
  var previous=itemDetailState;itemDetailState=null;$("itemDetailModal").classList.add("hidden");
  if(!previous)return false;
  if(previous.background)previous.background.removeAttribute("inert");
  var opener=previous.opener;
  if(restoreFocus!==false&&opener&&opener.isConnected!==false&&opener.focus&&(!previous.background||!previous.background.classList.contains("hidden")))opener.focus({preventScroll:true});
  return true
}
function itemDetailsKeydown(e){
  if(itemDetailState){
    if(e.key==="Escape"){e.preventDefault();closeItemDetails();return true}
    if(e.key==="Tab"){
      var first=$("itemDetailReading"),last=$("itemDetailBack"),active=document.activeElement;
      if(active!==first&&active!==last){e.preventDefault();first.focus()}
      else if(e.shiftKey&&active===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}
    }
    return true
  }
  var target=e.target&&e.target.closest?e.target.closest('[data-item-detail][role="button"]'):null;
  if(target&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openItemDetails(target.dataset.itemDetail,target);return true}
  return false
}
document.addEventListener("click",function(e){
  if(itemDetailState)return;
  var target=e.target&&e.target.closest?e.target:null,card=target&&target.closest("[data-item-detail]");
  // Action buttons keep their existing purpose: inspecting a card never buys, uses or discards it.
  if(!card||target.closest("button,a,input,select,textarea"))return;
  var opener=card.getAttribute("role")==="button"?card:card.querySelector('[data-item-detail][role="button"]');
  openItemDetails(card.dataset.itemDetail,opener||card)
});
document.getElementById("itemDetailBack").addEventListener("click",function(){closeItemDetails()});
