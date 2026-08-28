"use strict";
var ASSET_REVISION="39";

var enemyDefs={
  merodeador:{name:"Merodeador",role:"Asaltante de los túneles",hp:40,attack:[7,11],accuracy:1,def:11,armor:0,mechanical:false,lootMs:1800,lootGroup:"merodeador",xp:18},
  merodeador2:{name:"Acechador",role:"Rastreador merodeador",hp:36,attack:[6,10],accuracy:2,def:12,armor:0,mechanical:false,lootMs:1600,lootGroup:"merodeador",xp:18},
  merodeador3:{name:"Reconstruido",role:"Vanguardia con exoesqueleto",hp:46,attack:[8,12],accuracy:1,def:11,armor:1,mechanical:false,lootMs:2600,lootGroup:"merodeador",xp:23},
  merodeador4:{name:"Rastreadora",role:"Cazadora de núcleos",hp:38,attack:[7,11],accuracy:2,def:12,armor:0,mechanical:false,lootMs:1900,lootGroup:"merodeador",xp:20},
  merodeador5:{name:"Guardián exiliado",role:"Veterano de superficie",hp:50,attack:[9,13],accuracy:2,def:12,armor:1,mechanical:false,lootMs:2800,lootGroup:"merodeador",xp:25},
  drone:{name:"Dron UNO",role:"Vigilancia mecánica",hp:46,attack:[7,11],accuracy:2,def:12,armor:1,mechanical:true,lootMs:2300,lootGroup:"drone",xp:22},
  agent:{name:"Agente UNO",role:"Unidad de contención",hp:60,attack:[8,13],accuracy:3,def:13,armor:2,mechanical:false,lootMs:3000,lootGroup:"agent",xp:28},
  agent2:{name:"Tirador UNO",role:"Unidad de precisión",hp:50,attack:[9,14],accuracy:4,def:13,armor:1,mechanical:false,lootMs:2700,lootGroup:"agent",xp:27},
  agent3:{name:"Rastreador UNO",role:"Especialista SONAR",hp:54,attack:[8,12],accuracy:3,def:14,armor:1,mechanical:false,lootMs:2900,lootGroup:"agent",xp:29},
  agent4:{name:"Comandante morado",role:"Guardia de perímetro",hp:68,attack:[10,15],accuracy:4,def:14,armor:2,mechanical:false,lootMs:3400,lootGroup:"agent",xp:35}
};
var equipmentDefs={
  knife:{name:"Cuchillo de servicio",kind:"weapon",slot:"weapon",category:"melee",damage:[7,10],accuracy:3,desc:"Arma silenciosa; no consume munición."},
  crowbar:{name:"Barra de rescate",kind:"weapon",slot:"weapon",category:"melee",damage:[8,12],accuracy:2,desc:"Herramienta pesada adaptada al combate."},
  pistol9:{name:"Pistola UNO 9 mm",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[8,12],accuracy:4,desc:"Arma corta compatible con munición 9 mm."},
  revolver:{name:"Revólver recuperado",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[10,14],accuracy:3,desc:"Más daño, menor precisión y munición 9 mm."},
  shotgun12:{name:"Escopeta recortada",kind:"weapon",slot:"weapon",category:"shotgun",ammo:"shell12",damage:[12,18],accuracy:2,desc:"Gran impacto; utiliza cartuchos calibre 12."},
  rifle556:{name:"Carabina 5,56",kind:"weapon",slot:"weapon",category:"rifle",ammo:"ammo556",damage:[11,16],accuracy:4,desc:"Arma larga precisa; utiliza munición 5,56."},
  helmetWork:{name:"Casco de faena",kind:"gear",slot:"head",defense:1,maxDurability:8,desc:"Protección industrial ligera."},
  helmetRiot:{name:"Casco antidisturbios",kind:"gear",slot:"head",defense:2,maxDurability:12,desc:"Blindaje UNO para cabeza y rostro."},
  vestLight:{name:"Chaleco reforzado",kind:"gear",slot:"body",defense:1,maxDurability:10,desc:"Placas recuperadas cosidas al arnés."},
  vestTactical:{name:"Chaleco táctico UNO",kind:"gear",slot:"body",defense:2,maxDurability:16,desc:"Protección balística de patrulla."},
  packMedic:{name:"Mochila médica",kind:"gear",slot:"backpack",capacity:14,desc:"Catorce espacios de carga; cada unidad ocupa un espacio."},
  packRig:{name:"Mochila técnica",kind:"gear",slot:"backpack",capacity:18,desc:"Dieciocho espacios de carga; cada unidad ocupa un espacio."},
  packHunt:{name:"Mochila de caza",kind:"gear",slot:"backpack",capacity:14,desc:"Catorce espacios de carga; cada unidad ocupa un espacio."},
  packExpedition:{name:"Mochila de expedición",kind:"gear",slot:"backpack",capacity:24,desc:"Bastidor reforzado y veinticuatro espacios de carga."},
  ammo9:{name:"Munición 9 mm",kind:"ammo",stack:true,desc:"Cartuchos para pistolas y revólveres."},
  shell12:{name:"Cartuchos calibre 12",kind:"ammo",stack:true,desc:"Munición para escopetas."},
  ammo556:{name:"Munición 5,56",kind:"ammo",stack:true,desc:"Munición para carabinas y rifles."},
  meds:{name:"Medicina",kind:"consumable",stack:true,desc:"Restaura 26 HP."},
  medkit:{name:"Botiquín sellado",kind:"consumable",stack:true,desc:"Restaura 40 HP fuera de combate."},
  bandage:{name:"Vendaje de presión",kind:"consumable",stack:true,desc:"Restaura 14 HP y detiene el sangrado."},
  stimulant:{name:"Estimulante Roto",kind:"consumable",stack:true,art:"meds",desc:"Recupera 10 HP y 30 de energía fuera de combate."},
  traumaKit:{name:"Kit de trauma",kind:"consumable",stack:true,art:"medkit",desc:"Tratamiento avanzado que restaura 54 HP fuera de combate."},
  emp:{name:"Carga EMP",kind:"consumable",stack:true,desc:"Daña y aturde unidades mecánicas."},
  grenade:{name:"Granada improvisada",kind:"consumable",stack:true,desc:"Daña a todos los enemigos."},
  empMk2:{name:"Carga de arco EMP",kind:"consumable",stack:true,art:"emp",desc:"Descarga avanzada: 34 de daño y dos turnos de aturdimiento mecánico."},
  grenadeMk2:{name:"Granada de metralla",kind:"consumable",stack:true,art:"grenade",desc:"Carga avanzada que inflige 22 de daño a todos los enemigos."},
  food:{name:"Ración sellada",kind:"consumable",stack:true,desc:"Recupera 40 puntos de energía fuera de combate."},
  battery:{name:"Celda de energía",kind:"resource",stack:true,desc:"Alimenta tecnología y descargas EMP."},
  scrap:{name:"Componentes metálicos",kind:"material",stack:true,desc:"Tornillos, placas y mecanismos reutilizables recuperados del equipo enemigo."},
  cloth:{name:"Tela recuperada",kind:"material",stack:true,desc:"Retazos resistentes obtenidos del equipo de los merodeadores."},
  electronics:{name:"Materiales electrónicos",kind:"material",stack:true,desc:"Placas, bobinas y circuitos recuperados de tecnología UNO."},
  pulseCore:{name:"Núcleo de pulso",kind:"material",stack:true,desc:"Emisor compacto necesario para fabricar cargas EMP."},
  tool:{name:"Herramienta multipropósito",kind:"mission",desc:"Llave, cortador y puente eléctrico de Elías."},
  unoCard:{name:"Credencial UNO",kind:"mission",desc:"Acceso limitado a terminales y puertas de servicio."},
  droneCore:{name:"Núcleo de dron",kind:"mission",desc:"Memoria y transmisor de una unidad de vigilancia."},
  routeMap:{name:"Mapa de rutas",kind:"mission",desc:"Pasos de servicio borrados de los planos del refugio."},
  radio:{name:"Módulo de radio",kind:"mission",desc:"Amplía una transmisión o la convierte en un pulso dirigido."}
};
var skillTrees={
  sara:[
    {id:"sara_fieldcare",branch:"Medicina de campo",tier:1,cost:1,minLevel:1,name:"Manos firmes",desc:"La habilidad de Sara recupera 4 HP adicionales."},
    {id:"sara_triage",branch:"Medicina de campo",tier:2,cost:1,minLevel:2,requires:"sara_fieldcare",name:"Triaje de túnel",desc:"La atención de Sara también detiene el sangrado de todo el grupo."},
    {id:"sara_reanimate",branch:"Medicina de campo",tier:3,cost:2,minLevel:3,requires:"sara_triage",name:"Pulso de retorno",desc:"Una vez por combate, Sara puede devolver a un aliado agotado con 14 HP."},
    {id:"sara_pharmacy",branch:"Biofabricación",tier:1,cost:1,minLevel:1,name:"Farmacia de campaña",desc:"Desbloquea la receta del Botiquín sellado."},
    {id:"sara_stimulant",branch:"Biofabricación",tier:2,cost:1,minLevel:2,requires:"sara_pharmacy",name:"Catalizador Roto",desc:"Desbloquea el Estimulante Roto para recuperar HP y energía."},
    {id:"sara_trauma",branch:"Biofabricación",tier:3,cost:2,minLevel:3,requires:"sara_stimulant",name:"Cirugía de superficie",desc:"Desbloquea el Kit de trauma, la mejor curación fuera de combate."}
  ],
  elias:[
    {id:"elias_reinforce",branch:"Ingeniería táctica",tier:1,cost:1,minLevel:1,name:"Placas cruzadas",desc:"El equipo corporal operativo de Elías concede +1 de defensa adicional."},
    {id:"elias_ballistics",branch:"Ingeniería táctica",tier:2,cost:1,minLevel:2,requires:"elias_reinforce",name:"Calibración balística",desc:"Elías elimina su penalización al usar armas de fuego."},
    {id:"elias_overcharge",branch:"Ingeniería táctica",tier:3,cost:2,minLevel:3,requires:"elias_ballistics",name:"Sobrecarga violeta",desc:"Su habilidad EMP causa más daño y aturde por dos turnos."},
    {id:"elias_armor",branch:"Taller UNO",tier:1,cost:1,minLevel:1,name:"Matriz balística",desc:"Desbloquea la fabricación del Chaleco táctico UNO."},
    {id:"elias_helmet",branch:"Taller UNO",tier:2,cost:1,minLevel:2,requires:"elias_armor",name:"Visor de patrulla",desc:"Desbloquea la fabricación del Casco antidisturbios."},
    {id:"elias_rifle",branch:"Taller UNO",tier:3,cost:2,minLevel:3,requires:"elias_helmet",name:"Banco de armas",desc:"Desbloquea la fabricación de una Carabina 5,56."}
  ],
  noa:[
    {id:"noa_marksman",branch:"Caza de superficie",tier:1,cost:1,minLevel:1,name:"Pulso de cazadora",desc:"Noa obtiene +1 de precisión en todos sus ataques."},
    {id:"noa_hunter",branch:"Caza de superficie",tier:2,cost:1,minLevel:2,requires:"noa_marksman",name:"Golpe limpio",desc:"Los impactos de Noa infligen 2 de daño adicional."},
    {id:"noa_execution",branch:"Caza de superficie",tier:3,cost:2,minLevel:3,requires:"noa_hunter",name:"Ventana de ejecución",desc:"Noa inflige 4 de daño adicional a enemigos bajo 35% de HP."},
    {id:"noa_ordnance",branch:"Artificiería",tier:1,cost:1,minLevel:1,name:"Mezcla estable",desc:"Desbloquea la Granada de metralla avanzada."},
    {id:"noa_emp",branch:"Artificiería",tier:2,cost:1,minLevel:2,requires:"noa_ordnance",name:"Carga de arco",desc:"Desbloquea una EMP avanzada con aturdimiento prolongado."},
    {id:"noa_ammo",branch:"Artificiería",tier:3,cost:2,minLevel:3,requires:"noa_emp",name:"Banco de recarga",desc:"Desbloquea lotes escasos de munición 9 mm, 5,56 y calibre 12."}
  ]
};
var workshopRecipes=[
  {owner:"elias",id:"helmetWork",cost:{scrap:2},note:"Protección 1 · Durabilidad 8"},
  {owner:"elias",id:"vestLight",cost:{scrap:3},note:"Protección 1 · Durabilidad 10"},
  {owner:"elias",id:"packExpedition",cost:{scrap:3,battery:1},note:"Capacidad 24 espacios"},
  {owner:"elias",id:"vestTactical",skill:"elias_armor",cost:{scrap:5,electronics:1},xp:12,note:"Protección 2 · Durabilidad 16"},
  {owner:"elias",id:"helmetRiot",skill:"elias_helmet",cost:{scrap:4,electronics:1},xp:14,note:"Protección 2 · Durabilidad 12"},
  {owner:"elias",id:"rifle556",skill:"elias_rifle",cost:{scrap:5,electronics:2},xp:18,note:"Carabina precisa · utiliza munición 5,56"},
  {owner:"sara",id:"bandage",cost:{cloth:2},note:"Restaura 14 HP y detiene sangrado"},
  {owner:"sara",id:"meds",cost:{cloth:3,scrap:1,water:1},note:"Restaura 26 HP · preparación de campaña"},
  {owner:"sara",id:"medkit",skill:"sara_pharmacy",cost:{cloth:4,scrap:2,water:1},xp:12,note:"Restaura 40 HP fuera de combate"},
  {owner:"sara",id:"stimulant",skill:"sara_stimulant",cost:{meds:1,electronics:1,water:1},xp:14,note:"Recupera 10 HP y 30 de energía"},
  {owner:"sara",id:"traumaKit",skill:"sara_trauma",cost:{medkit:1,cloth:2,electronics:1},xp:18,note:"Restaura 54 HP fuera de combate"},
  {owner:"noa",id:"grenade",cost:{scrap:2,electronics:1},note:"14 de daño a todos los enemigos"},
  {owner:"noa",id:"emp",cost:{electronics:2,pulseCore:1,battery:1},note:"22 de daño y aturdimiento mecánico"},
  {owner:"noa",id:"grenadeMk2",skill:"noa_ordnance",cost:{scrap:3,electronics:2},xp:12,note:"22 de daño a todos los enemigos"},
  {owner:"noa",id:"empMk2",skill:"noa_emp",cost:{electronics:3,pulseCore:1,battery:2},xp:14,note:"34 de daño · aturdimiento prolongado"},
  {owner:"noa",id:"ammo9",skill:"noa_ammo",qty:3,cost:{scrap:1,electronics:1},xp:16,note:"Lote recuperado de 3 cartuchos 9 mm"},
  {owner:"noa",id:"ammo556",skill:"noa_ammo",qty:2,cost:{scrap:1,electronics:1},xp:16,note:"Lote recuperado de 2 cartuchos 5,56"},
  {owner:"noa",id:"shell12",skill:"noa_ammo",qty:2,cost:{scrap:2,electronics:1},xp:16,note:"Lote recuperado de 2 cartuchos calibre 12"}
];
var tradeCatalog={
  cloth:{buy:4,sell:1,base:4},bandage:{buy:7,sell:3,base:2},meds:{buy:11,sell:5,base:1},medkit:{buy:18,sell:8,base:0},food:{buy:6,sell:2,base:3},
  ammo9:{buy:2,sell:1,base:5},ammo556:{buy:3,sell:1,base:4},shell12:{buy:4,sell:1,base:2},battery:{buy:8,sell:4,base:1},
  scrap:{sell:2},electronics:{sell:4},pulseCore:{sell:9},
  helmetWork:{sell:7},helmetRiot:{sell:13},vestLight:{sell:8},vestTactical:{sell:15},packExpedition:{sell:14},emp:{sell:7},grenade:{sell:6}
};
var armorerCatalog={
  scrap:{sell:2},electronics:{sell:4},pulseCore:{sell:9},
  knife:{buy:6,sell:2},crowbar:{buy:8,sell:3},pistol9:{buy:18,sell:9},revolver:{buy:22,sell:11},shotgun12:{buy:26,sell:13},rifle556:{buy:30,sell:15}
};
function tradeStockForDay(day){var stock={};Object.keys(tradeCatalog).forEach(function(id){var item=tradeCatalog[id];if(item.buy)stock[id]=Math.max(0,(item.base||0)+(day>=2&&id==="medkit"?1:0)+(day===3&&["meds","ammo556","battery"].indexOf(id)>=0?1:0))});return stock}
function armorerStockForDay(day){return{knife:1,crowbar:1,pistol9:1,revolver:day>=2?1:0,shotgun12:day>=2?1:0,rifle556:day>=3?1:0}}
var missionDefs=[
  {id:"signal",main:true,title:"Encontrar el origen de la señal",target:27,reward:"Desbloquea la decisión final sobre Neo Santiago."},
  {id:"squad",title:"Nadie queda atrás",description:"Gana un combate con Sara, Elías y Noa todavía en pie.",target:1,reward:"Moral +6"},
  {id:"salvage",title:"Reserva de superficie",description:"Recupera 8 unidades de botín desde enemigos derrotados.",target:8,reward:"Ración +1 · Medicina +1"},
  {id:"archives",title:"Reconstruir la verdad",description:"Recupera 5 archivos sobre UNO y las comunidades ocultas.",target:5,reward:"Amenaza −6"},
  {id:"veteran",title:"Aprender a sobrevivir",description:"Haz que cualquier aliado alcance Lvl. 2.",target:1,reward:"Energía +10 para el grupo"}
];

function fresh(){return{version:3,campaignRevision:3,inventoryRevision:5,progressionRevision:1,introCompleted:false,logisticsSeen:false,index:0,threat:18,morale:64,credits:0,factionPoints:0,tradeStock:tradeStockForDay(1),tradeStockDay:1,armorerStock:armorerStockForDay(1),armorerStockDay:1,starterKitGiven:false,refuge:{active:false,reason:null,rested:false,rejoined:false,visits:0,npc:"mara",message:""},summarySeen:false,finalTier:null,score:0,engineeringUses:3,medicalUses:3,ordnanceUses:3,res:{food:0,water:4,meds:0,ammo:0,battery:0},cons:{bandage:0,emp:0,grenade:0},party:[
  {id:"sara",name:"Sara",role:"Médico",hp:44,maxHp:44,hunger:82,xp:0,level:1,skills:[],guard:0,bleed:0,categories:["sidearm","melee"],equipment:{head:null,body:"vestLight",weapon:"pistol9",backpack:"packMedic"},durability:{head:null,body:10},bag:[{id:"ammo9",qty:6},{id:"bandage",qty:1},{id:"meds",qty:1},{id:"food",qty:2}]},
  {id:"elias",name:"Elías",role:"Ingeniero",hp:40,maxHp:40,hunger:76,xp:0,level:1,skills:[],guard:0,bleed:0,categories:["sidearm","shotgun","rifle","melee"],equipment:{head:"helmetWork",body:null,weapon:"crowbar",backpack:"packRig"},durability:{head:8,body:null},bag:[{id:"shell12",qty:4},{id:"emp",qty:1},{id:"food",qty:1},{id:"battery",qty:1},{id:"tool",qty:1}]},
  {id:"noa",name:"Noa",role:"Cazadora",hp:38,maxHp:38,hunger:88,xp:0,level:1,skills:[],guard:0,bleed:0,categories:["rifle","sidearm","melee"],equipment:{head:null,body:"vestLight",weapon:"rifle556",backpack:"packHunt"},durability:{head:null,body:10},bag:[{id:"ammo556",qty:6},{id:"grenade",qty:1},{id:"food",qty:1}]}
],inv:[],docs:["signal"],flags:{},missionRewards:{},history:[],stats:{battles:0,wins:0,enemies:0,loot:0,lootItems:{},fullSquadWins:0,criticals:0,retreats:0,refugeVisits:0,trades:0,creditsEarned:0,attacks:0,hits:0,misses:0,shots:0,damageDealt:0,damageTaken:0,medicineUsed:0,hpRestored:0,restHpRecovered:0,rests:0,skillsUsed:0,revives:0,defends:0,crafts:0,craftedItems:{},itemsUsed:{},xpFromHits:0,xpFromCrafting:0,xpFromVictories:0,factionEarned:0,factionSpent:0,skillsUnlocked:0},seed:2130,ending:null,finished:false}}

var state=fresh(),pending=null,battleState=null,transferDraft=null,toastTimer=null,lootInterval=null,archiveOpener=null,worldLoreOpener=null,introStep=0,profileTab="inventory";
var loreSections={history:["loreTabHistory","lorePanelHistory"],tunnels:["loreTabTunnels","lorePanelTunnels"],governance:["loreTabGovernance","lorePanelGovernance"],factions:["loreTabFactions","lorePanelFactions"],extracts:["loreTabExtracts","lorePanelExtracts"]};
var factionSections={rotos:["factionTabRotos","factionPanelRotos"],hunters:["factionTabHunters","factionPanelHunters"],uno:["factionTabUno","factionPanelUno"],agents:["factionTabAgents","factionPanelAgents"],marauders:["factionTabMarauders","factionPanelMarauders"],valley:["factionTabValley","factionPanelValley"]};
function clamp(n,a,b){return Math.min(b,Math.max(a,n))}
function random(){state.seed=(state.seed*1664525+1013904223)>>>0;return state.seed/4294967296}
function d20(){return Math.floor(random()*20)+1}
function rand(a,b){return Math.floor(random()*(b-a+1))+a}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function load(){
  try{
    var x=JSON.parse(localStorage.getItem(KEY)),base=fresh(),baseParty=base.party,baseRes=base.res,baseCons=base.cons,baseStats=base.stats,baseRefuge=base.refuge,baseEngineeringUses=base.engineeringUses,baseMedicalUses=base.medicalUses,baseOrdnanceUses=base.ordnanceUses;
    if(!x||x.version!==3||x.index<0||x.index>=events.length)return false;
    if(!x.campaignRevision){var oldRoute=[0,2,8,9,13,17,18,23,26];x.index=oldRoute[x.index]===undefined?0:oldRoute[x.index]}
    state=Object.assign(base,x);state.campaignRevision=3;state.inventoryRevision=5;state.progressionRevision=1;state.introCompleted=x.introCompleted===undefined?true:!!x.introCompleted;state.logisticsSeen=!!x.logisticsSeen;state.res=Object.assign(baseRes,x.res||{});state.cons=Object.assign(baseCons,x.cons||{});state.stats=Object.assign(baseStats,x.stats||{});state.stats.lootItems=Object.assign({},baseStats.lootItems,(x.stats&&x.stats.lootItems)||{});state.stats.craftedItems=Object.assign({},baseStats.craftedItems,(x.stats&&x.stats.craftedItems)||{});state.stats.itemsUsed=Object.assign({},baseStats.itemsUsed,(x.stats&&x.stats.itemsUsed)||{});state.missionRewards=Object.assign({},x.missionRewards||{});state.refuge=Object.assign(baseRefuge,x.refuge||{});state.refuge.npc=state.refuge.npc==="armorer"?"armorer":"mara";state.credits=Math.max(0,Number(x.credits)||0);state.factionPoints=Math.max(0,Number(x.factionPoints)||0);state.starterKitGiven=x.starterKitGiven===undefined?true:!!x.starterKitGiven;state.summarySeen=!!(x.summarySeen||x.epilogueSeen);state.finalTier=x.finalTier||null;state.score=Math.max(0,Number(x.score)||0);state.tradeStockDay=Number(x.tradeStockDay)||((events[x.index]||events[0]).day);state.tradeStock=Object.assign(tradeStockForDay(state.tradeStockDay),x.tradeStock||{});state.armorerStockDay=Number(x.armorerStockDay)||((events[x.index]||events[0]).day);state.armorerStock=Object.assign(armorerStockForDay(state.armorerStockDay),x.armorerStock||{});state.engineeringUses=clamp(Number.isFinite(Number(x.engineeringUses))?Number(x.engineeringUses):baseEngineeringUses,0,3);state.medicalUses=clamp(Number.isFinite(Number(x.medicalUses))?Number(x.medicalUses):baseMedicalUses,0,3);state.ordnanceUses=clamp(Number.isFinite(Number(x.ordnanceUses))?Number(x.ordnanceUses):baseOrdnanceUses,0,3);
    state.party=baseParty.map(function(p,i){var saved=(x.party||[])[i]||{},baseRole=p.role,baseMaxHp=p.maxHp,baseHunger=p.hunger,baseEquipment=p.equipment,baseDurability=p.durability,baseCategories=p.categories,baseBag=p.bag,merged=Object.assign(p,saved),savedHp=Number(saved.hp),savedHunger=Number(saved.hunger);merged.level=Math.max(1,Number(merged.level)||1);merged.skills=Array.isArray(saved.skills)?saved.skills.filter(function(id){return(skillTrees[merged.id]||[]).some(function(node){return node.id===id})}):[];merged.role=baseRole;merged.maxHp=baseMaxHp+(merged.level-1)*6;merged.hp=clamp(Number.isFinite(savedHp)?savedHp:merged.maxHp,0,merged.maxHp);merged.hunger=clamp(Number.isFinite(savedHunger)?savedHunger:baseHunger,0,100);merged.equipment=Object.assign({},baseEquipment,saved.equipment||{});merged.durability=Object.assign({},baseDurability,saved.durability||{});["head","body"].forEach(function(slot){var d=gear(merged.equipment[slot]);if(d&&d.maxDurability&&!Number.isFinite(Number(merged.durability[slot])))merged.durability[slot]=d.maxDurability;if(!d)merged.durability[slot]=null});merged.categories=baseCategories.slice();merged.bag=(saved.bag||baseBag).map(function(entry){var d=gear(entry.id),out={id:entry.id,qty:entry.qty};if(d&&d.maxDurability)out.durability=clamp(Number.isFinite(Number(entry.durability))?Number(entry.durability):d.maxDurability,0,d.maxDurability);return out});return merged});
    redistributeOverflow();migrateLegacyInventory();redistributeOverflow();return true
  }catch{return false}
}
function pushUnique(list,values){(values||[]).forEach(function(v){if(list.indexOf(v)<0)list.push(v)})}
function resName(k){return{food:"Alimento",water:"Agua",meds:"Medicina",ammo:"Munición",battery:"Batería"}[k]||k}
function esc(v){return String(v).replace(/[&<>'"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]})}
function gear(id){return id&&equipmentDefs[id]?equipmentDefs[id]:null}
function assetUrl(path){return path+(path.indexOf("?")>=0?"&":"?")+"v="+ASSET_REVISION}
function retryAsset(img){var attempt=Number(img.dataset.assetRetry||0);if(attempt>=2)return;attempt++;img.dataset.assetRetry=attempt;setTimeout(function(){img.src=assetUrl(img.dataset.assetPath)+"&retry="+attempt},160*attempt)}
globalThis.retryAsset=retryAsset;
function assetImage(path,alt,className,width,height){return'<img class="'+esc(className||"")+'" src="'+esc(assetUrl(path))+'" data-asset-path="'+esc(path)+'" data-asset-retry="0" onerror="retryAsset(this)" alt="'+esc(alt||"")+'" width="'+width+'" height="'+height+'" loading="eager" decoding="async">'}
function itemArt(id,alt,extra){var d=gear(id),art=d&&d.art?d.art:id;return id?'<span class="item-art '+(extra||"")+'">'+assetImage("items/"+art+".webp",alt||"","",256,256)+"</span>":'<span class="item-art empty-art '+(extra||"")+'" aria-hidden="true">—</span>'}
function portraitArt(path,alt,extra){return'<div class="portrait">'+assetImage(path,alt,"portrait-art "+(extra||""),590,885)+"</div>"}
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
  if(name.indexOf("ambience")===0)return .16;
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
function buttonFromEvent(event){var target=event&&event.target;return target&&target.closest?target.closest("button"):null}
function hoverSfxForButton(button){
  if(!button||button.disabled)return null;
  if(button.dataset.choice!==undefined)return"decision-hover";
  if(button.dataset.lootEnemy!==undefined)return"loot-hover";
  if(button.dataset.target!==undefined)return"combat-target-hover";
  return"ui-hover"
}
function weaponSfxForActor(){
  var p=battleState&&state.party[battleState.actor],weapon=gear(p&&p.equipment.weapon);
  if(!weapon)return"combat-melee";
  if(weapon.category==="rifle")return"combat-shot-rifle";
  if(weapon.category==="shotgun")return"combat-shot-shotgun";
  if(weapon.category==="sidearm")return"combat-shot-9mm";
  return"combat-melee"
}
function combatSkillSfx(){
  var actor=battleState&&state.party[battleState.actor];
  if(!actor)return"ui-click";
  if(actor.id==="sara")return"hp-heal";
  if(actor.id==="elias")return"combat-skill-elias";
  if(actor.id==="noa")return"combat-skill-noa";
  return"ui-click"
}
function craftSfx(id){
  var recipe=(workshopRecipes||[]).filter(function(r){return r.id===id})[0];
  if(recipe&&recipe.owner==="sara")return"craft-medical";
  if(recipe&&recipe.owner==="noa")return"craft-tech";
  return"craft-basic"
}
function clickSfxForButton(button){
  if(!button)return null;
  if(button.disabled)return"ui-disabled";
  var id=button.id||"",data=button.dataset||{},text=(button.textContent||"").toLowerCase();
  if(data.sfx)return data.sfx;
  if(data.choice!==undefined){if(text.indexOf("combate")>=0)return"decision-combat";if(text.indexOf("moral")>=0||button.classList.contains("danger"))return"decision-danger";return"decision-confirm"}
  if(data.action==="attack")return weaponSfxForActor();
  if(data.action==="skill")return combatSkillSfx();
  if(data.action==="defend")return"combat-defend";
  if(data.action==="flee")return"combat-flee";
  if(data.combatItem!==undefined){if(data.combatItem.indexOf("emp")>=0)return"combat-emp";if(data.combatItem.indexOf("grenade")>=0)return"combat-grenade";if(data.combatItem==="food")return"loadout-food";return"hp-medical-use"}
  if(data.target!==undefined)return"combat-target";
  if(data.lootEnemy!==undefined)return"loot-search";
  if(data.takeLoot!==undefined)return"loot-take";
  if(data.discardLoot!==undefined)return"loot-discard";
  if(data.profile!==undefined||data.refugeProfile!==undefined)return"loadout-open";
  if(data.profileTab!==undefined)return"ui-tab";
  if(data.transferOpen!==undefined)return"loadout-transfer";
  if(data.transferTarget!==undefined)return"loadout-transfer";
  if(data.equip!==undefined)return"loadout-equip";
  if(data.profileUse!==undefined)return null;
  if(data.repair!==undefined)return"loadout-repair";
  if(data.craft!==undefined)return craftSfx(data.craft);
  if(data.unlockSkill!==undefined)return"skill-unlock";
  if(data.openArchive!==undefined)return"archive-open";
  if(data.openWorldLore!==undefined)return"lore-open";
  if(data.panel!==undefined)return"ui-open-panel";
  if(data.sellItem!==undefined)return"trade-sell";
  if(data.buyItem!==undefined){var offer=gear(data.buyItem);return offer&&offer.kind==="weapon"?"trade-weapon":"trade-buy"}
  if(id==="enterTitle")return"start-title-enter";
  if(id==="newGame"||id==="restart")return"start-new-game";
  if(id==="continueGame")return"start-load-game";
  if(id==="openWorldLore")return"lore-open";
  if(id==="closeWorldLore"||id==="closeWorldLoreBottom")return"ui-close-panel";
  if(id.indexOf("loreTab")===0||id.indexOf("factionTab")===0)return"lore-tab";
  if(id==="introNext"||id==="introBack")return"lore-page";
  if(id==="introStart"||id==="leaveRefuge"||id==="confirmLogistics")return"start-expedition";
  if(id==="advance")return"decision-result";
  if(id==="nextDay"||id==="refugeRest")return"refuge-rest";
  if(id==="finalContinue")return"ending-summary";
  if(id==="downloadPng")return"ui-download";
  if(id==="npcTabMara"||id==="npcTabArmorer")return"refuge-npc";
  if(id==="starterKit")return"refuge-supply";
  if(id==="refugeRejoin")return"refuge-ready";
  if(id==="itemsToggle")return"loadout-tray";
  if(id==="takeAllLoot")return"loot-take-all";
  if(id==="finishLoot")return"loot-exit";
  if(id==="closeLoot")return"loot-exit";
  if(id==="closeDrawer"||id==="closeProfile"||id==="closeTransfer"||id==="closeArchive"||id==="closeArchiveBottom")return"ui-close-panel";
  return"ui-click"
}
function installAudioHooks(){
  if(typeof document==="undefined"||!document.addEventListener)return;
  document.addEventListener("pointerover",function(event){var button=buttonFromEvent(event);if(!button||button===audioHoverButton)return;audioHoverButton=button;var sfx=hoverSfxForButton(button);if(sfx)playSfx(sfx)},true);
  document.addEventListener("pointerout",function(event){var button=buttonFromEvent(event);if(button===audioHoverButton){try{if(event.relatedTarget&&button.contains(event.relatedTarget))return}catch{}audioHoverButton=null}},true);
  document.addEventListener("click",function(event){var button=buttonFromEvent(event),sfx=clickSfxForButton(button);if(sfx)playSfx(sfx);if(button)unlockAudioAmbience()},true)
}
globalThis.playSfx=playSfx;
globalThis.startLoopSfx=startLoopSfx;
globalThis.stopLoopSfx=stopLoopSfx;
function bagCapacity(p){var pack=gear(p.equipment.backpack);return pack&&pack.capacity?pack.capacity:4}
function bagUsed(p){return p&&p.bag?p.bag.reduce(function(sum,entry){return sum+Math.max(1,Number(entry.qty)||1)},0):0}
function bagFree(p){return Math.max(0,bagCapacity(p)-bagUsed(p))}
function bagQty(p,id){var entry=p.bag.filter(function(x){return x.id===id})[0];return entry?entry.qty:0}
function canReceive(p,id,qty){return !!(p&&bagFree(p)>=Math.max(1,Number(qty)||1))}
function ammoTotal(){return state.res.ammo+state.party.reduce(function(total,p){return total+bagQty(p,"ammo9")+bagQty(p,"shell12")+bagQty(p,"ammo556")},0)}
function stockCount(id){
  if(id==="water")return state.res.water||0;
  return state.party.reduce(function(sum,p){return sum+bagQty(p,id)},0)
}
function addStatItem(bucket,id,qty){qty=Math.max(1,Number(qty)||1);if(!state.stats[bucket])state.stats[bucket]={};state.stats[bucket][id]=(state.stats[bucket][id]||0)+qty}
function recordHealing(amount,medical){amount=Math.max(0,Number(amount)||0);state.stats.hpRestored+=amount;if(medical)state.stats.medicineUsed++}
function recordLoot(id,qty){qty=Math.max(1,Number(qty)||1);state.stats.loot+=qty;addStatItem("lootItems",id,qty)}
function consumeFromBag(p,id){var i=p.bag.findIndex(function(x){return x.id===id});if(i<0)return false;p.bag[i].qty--;if(p.bag[i].qty<=0)p.bag.splice(i,1);return true}
function consumeStock(id,preferred){
  if(id==="water"&&(state.res.water||0)>0){state.res.water--;return true}
  var order=[];if(preferred!==undefined&&state.party[preferred])order.push(state.party[preferred]);state.party.forEach(function(p){if(order.indexOf(p)<0)order.push(p)});
  for(var i=0;i<order.length;i++)if(consumeFromBag(order[i],id))return true;return false
}
function addToBag(p,id,qty,durability){
  var d=gear(id),entry=p&&p.bag.filter(function(x){return x.id===id})[0];qty=Math.max(1,Number(qty)||1);if(!canReceive(p,id,qty))return false;
  if(entry&&d&&d.stack){entry.qty+=qty;return true}
  var next={id:id,qty:qty};if(d&&d.maxDurability)next.durability=clamp(Number.isFinite(Number(durability))?Number(durability):d.maxDurability,0,d.maxDurability);p.bag.push(next);return true
}
function carrierOrder(id){var preferred={meds:0,medkit:0,bandage:0,food:0,tool:1,battery:1,unoCard:1,droneCore:1,radio:1,routeMap:2,ammo9:0,shell12:1,ammo556:2,grenade:2,emp:2,electronics:2,pulseCore:2},first=preferred[id]===undefined?0:preferred[id],order=[first];state.party.forEach(function(p,i){if(order.indexOf(i)<0)order.push(i)});return order}
function placePartyItem(id,qty,durability){
  qty=Math.max(1,Number(qty)||1);var d=gear(id),order=carrierOrder(id),remaining=qty;
  for(var i=0;i<order.length&&remaining>0;i++){var p=state.party[order[i]],amount=Math.min(remaining,bagFree(p));if(amount<=0)continue;if(d&&d.stack){addToBag(p,id,amount,durability);remaining-=amount}else while(remaining>0&&canReceive(p,id,1)){addToBag(p,id,1,durability);remaining--}}
  return remaining<=0
}
function hasPartyItem(id){return state.party.some(function(p){return bagQty(p,id)>0})}
function removePartyItem(id,qty){qty=qty||1;for(var n=0;n<qty;n++){var carrier=state.party.filter(function(p){return bagQty(p,id)>0})[0];if(!carrier||!consumeFromBag(carrier,id))return false}return true}
function migrateLegacyInventory(){
  (state.inv||[]).forEach(function(id){if(!hasPartyItem(id))placePartyItem(id,1)});state.inv=[];
  var pools={food:state.res.food||0,meds:state.res.meds||0,battery:state.res.battery||0,bandage:state.cons.bandage||0,emp:state.cons.emp||0,grenade:state.cons.grenade||0};
  Object.keys(pools).forEach(function(id){if(pools[id]>0)placePartyItem(id,pools[id])});if((state.res.ammo||0)>0)placePartyItem("ammo9",state.res.ammo*4);
  state.res.food=0;state.res.meds=0;state.res.ammo=0;state.res.battery=0;state.cons.bandage=0;state.cons.emp=0;state.cons.grenade=0
}
function redistributeOverflow(){
  state.party.forEach(function(p,pIndex){var guard=0;while(bagUsed(p)>bagCapacity(p)&&guard++<200){var entry=p.bag[p.bag.length-1],moved=false;if(!entry)break;for(var i=0;i<state.party.length;i++){if(i===pIndex||!canReceive(state.party[i],entry.id,1))continue;if(addToBag(state.party[i],entry.id,1,entry.durability)){entry.qty--;if(entry.qty<=0)p.bag.pop();moved=true;break}}if(!moved)break}})
}
function currentDay(){var ev=events[Math.min(state.index,events.length-1)]||events[0];return ev?ev.day:1}
function refreshTradeStock(){var day=currentDay();if(state.tradeStockDay!==day){state.tradeStock=tradeStockForDay(day);state.tradeStockDay=day}if(state.armorerStockDay!==day){state.armorerStock=armorerStockForDay(day);state.armorerStockDay=day}}
function activeRefugeNpc(){return state.refuge&&state.refuge.npc==="armorer"?"armorer":"mara"}
function merchantCatalog(npc){return npc==="armorer"?armorerCatalog:tradeCatalog}
function merchantStock(npc){return npc==="armorer"?state.armorerStock:state.tradeStock}
var refugeNpcs={
  mara:{name:"Mara «La Rielera»",role:"Recuperadora · Economato",portrait:"characters/mara-trader.webp",alt:"Mara, encargada de suministros e intercambios del refugio"},
  armorer:{name:"El Armero",role:"Forjador · Recuperador balístico",portrait:"characters/armero-trader.webp",alt:"El Armero, forjador y recuperador de armas del refugio"}
};
function refugeReasonData(reason){return{
  start:["Último control antes de salir","Mara organiza el lote comunitario y el Armero revisa el banco de piezas del Andén 4. La expedición no cruzará la compuerta hasta comprobar que todos pueden regresar por su propio pie."],
  fled:["Retirada táctica","El grupo decidió cortar el combate. Volver conserva sus vidas, pero el fracaso pesa sobre la moral y la amenaza aprende una parte de su ruta."],
  exhausted:["Todos quedaron fuera de combate","No están muertos: el pulso sigue ahí, débil. Los arrastraron hasta la Línea 1 y ahora necesitan descanso, medicina y una nueva preparación antes de intentarlo otra vez."],
  morale:["La cohesión llegó a cero","Las discusiones quebraron la marcha. Nadie seguirá hacia la superficie hasta reagruparse, atender a los heridos y decidir qué recursos todavía vale la pena conservar."]
}[reason]||["Regreso al Andén 4","El refugio permite reorganizar las mochilas, atender heridas y negociar los materiales recuperados antes de volver a la expedición."]}
function refugeCanLeave(){return state.starterKitGiven&&state.morale>=10&&state.party.every(function(p){return p.hp>=10&&p.hunger>=10})}
function refugePartyHtml(p,i){var status=p.hp<=0?"Agotado":p.hp<10?"Crítico":p.hunger<10?"Sin energía":"Listo",bad=status!=="Listo",ready=hasUnspentSkill(p);return'<button class="refuge-ally '+(bad?'critical ':'')+(ready?'skill-ready':'')+'" data-refuge-profile="'+i+'"><span class="refuge-ally-photo">'+assetImage("portraits/"+p.id+".webp",p.name,"",590,885)+'</span><span><b>'+esc(p.name)+" · "+esc(status)+'</b><small>Lvl. '+p.level+' · '+p.hp+" / "+p.maxHp+" HP · Energía "+p.hunger+"% · Mochila "+bagUsed(p)+"/"+bagCapacity(p)+'</small>'+(ready?'<strong class="skill-ready-copy">Habilidad disponible</strong>':'')+'</span><em>Gestionar</em></button>'}
function weaponTradeNote(d){return d&&d.kind==="weapon"?"Daño "+d.damage[0]+"–"+d.damage[1]+" · Precisión +"+d.accuracy+(d.ammo?" · "+gear(d.ammo).name:" · Sin munición"):"Ocupa 1 espacio"}
function renderTradeSell(){var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),cards=[];state.party.forEach(function(p,pIndex){p.bag.forEach(function(entry,bagIndex){var d=gear(entry.id),offer=catalog[entry.id];if(!d||!offer||!offer.sell||d.kind==="mission")return;cards.push('<article class="trade-card '+(d.kind==="weapon"?'weapon-offer':'')+'">'+itemArt(entry.id,d.name,"small")+'<span><b>'+esc(d.name)+(entry.qty>1?" ×"+entry.qty:"")+'</b><small>'+esc(p.name)+" · "+(d.kind==="weapon"?weaponTradeNote(d):"entrega 1 unidad")+'</small></span><em>+'+offer.sell+' fichas</em><button data-sell-item="'+pIndex+'-'+bagIndex+'">Entregar</button></article>')})});return cards.length?cards.join(""):npc==="armorer"?'<p class="empty">No llevas armas ni componentes que el Armero pueda recuperar.</p>':'<p class="empty">No llevas materiales ni equipo que Mara acepte.</p>'}
function renderTradeBuy(){var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stock=merchantStock(npc),cards=[];Object.keys(stock).forEach(function(id){var qty=Math.max(0,Number(stock[id])||0),d=gear(id),offer=catalog[id];if(!d||!offer||!offer.buy)return;cards.push('<article class="trade-card '+(d.kind==="weapon"?'weapon-offer ':'')+(!qty?'sold-out':'')+'">'+itemArt(id,d.name,"small")+'<span><b>'+esc(d.name)+'</b><small>Stock '+qty+' · '+weaponTradeNote(d)+'</small></span><em>−'+offer.buy+' fichas</em><button data-buy-item="'+id+'" '+(!qty?'disabled':'')+'>'+(qty?(npc==="armorer"?'Encargar':'Recibir'):'Agotado')+'</button></article>')});return cards.join("")}
function renderRefuge(){
  if(!state.refuge||!state.refuge.active)return;refreshTradeStock();var data=refugeReasonData(state.refuge.reason),canLeave=refugeCanLeave(),npc=activeRefugeNpc(),npcData=refugeNpcs[npc],portrait=$("traderPortrait");$("refugeTitle").textContent=data[0];$("refugeText").textContent=data[1];portrait.src=assetUrl(npcData.portrait);portrait.dataset.assetPath=npcData.portrait;portrait.alt=npcData.alt;$("traderName").textContent=npcData.name;$("traderRole").textContent=npcData.role;$("npcTabMara").classList.toggle("active",npc==="mara");$("npcTabMara").setAttribute("aria-selected",npc==="mara"?"true":"false");$("npcTabArmorer").classList.toggle("active",npc==="armorer");$("npcTabArmorer").setAttribute("aria-selected",npc==="armorer"?"true":"false");$("traderDialogue").textContent=npc==="armorer"?(state.refuge.reason==="exhausted"?'“No necesitan más potencia. Necesitan un arma que no falle cuando vuelvan a ponerse de pie.”':'“Nada de esto salió entero de una fábrica. Yo elijo lo que todavía sirve y vuelvo a darle propósito.”'):(state.refuge.reason==="start"?'“Tomen lo justo. Lo que vuelva en sus mochilas puede convertirse en otra oportunidad.”':state.refuge.reason==="exhausted"?'“Afuera parecían cadáveres. Aquí siguen siendo una deuda que podemos pagar.”':'“Yo cambio objetos, no milagros. Descansen, repartan medicina y elijan qué vale más.”');$("tradeCredits").textContent=state.credits+" fichas";$("tradeSectionTitle").textContent=npc==="armorer"?"Banco de armas reconstruidas":"Economía de intercambio";$("tradeSectionHint").textContent=npc==="armorer"?"Stock único por día · equipa desde la ficha del aliado":"Una operación mueve una unidad";$("tradeSellTitle").textContent=npc==="armorer"?"Armas y piezas recuperadas":"Tus rescates";$("tradeBuyTitle").textContent=npc==="armorer"?"Banco del Armero":"Reservas de Mara";$("tradeBuyAction").textContent=npc==="armorer"?"Encargar":"Recibir";$("refugeParty").innerHTML=state.party.map(refugePartyHtml).join("");$("tradeSellList").innerHTML=renderTradeSell();$("tradeBuyList").innerHTML=renderTradeBuy();$("starterKit").classList.toggle("hidden",state.starterKitGiven||npc!=="mara");$("refugeRest").disabled=!!state.refuge.rested;$("refugeRejoin").disabled=!!state.refuge.rejoined;$("leaveRefuge").disabled=!canLeave;$("refugeLeaveHint").textContent=canLeave?"El grupo está en condiciones de volver a la expedición. Gestiona a un aliado para equipar cualquier arma nueva.":!state.starterKitGiven?"Recibe el lote inicial de Mara antes de abrir la compuerta.":state.morale<10?"La moral debe llegar al menos a 10%.":"Todos necesitan al menos 10 HP y 10% de energía.";$("refugeMessage").textContent=state.refuge.message||"";$("refugeMessage").classList.toggle("hidden",!state.refuge.message);
  Array.prototype.forEach.call(document.querySelectorAll("[data-refuge-profile]"),function(b){b.addEventListener("click",function(){openProfile(Number(b.dataset.refugeProfile))})});Array.prototype.forEach.call(document.querySelectorAll("[data-sell-item]"),function(b){b.addEventListener("click",function(){var parts=b.dataset.sellItem.split("-");sellTradeItem(Number(parts[0]),Number(parts[1]))})});Array.prototype.forEach.call(document.querySelectorAll("[data-buy-item]"),function(b){b.addEventListener("click",function(){buyTradeItem(b.dataset.buyItem)})})
}
function switchRefugeNpc(npc){if(!state.refuge||!state.refuge.active||["mara","armorer"].indexOf(npc)<0)return false;state.refuge.npc=npc;state.refuge.message="";renderRefuge();save();return true}
function openRefuge(reason,restoring){
  setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);
  if(!restoring){var visits=(state.refuge&&state.refuge.visits||0)+1;state.refuge={active:true,reason:reason,rested:false,rejoined:false,visits:visits,npc:"mara",message:""};state.stats.refugeVisits++;}else{state.refuge.active=true;state.refuge.reason=reason||state.refuge.reason;state.refuge.npc=state.refuge.npc==="armorer"?"armorer":"mara"}
  state.party.forEach(function(p){p.guard=0;p.bleed=0});refreshTradeStock();battleState=null;pending=null;clearInterval(lootInterval);["gameIntro","worldLoreModal","battle","result","night","lootModal","logisticsModal","final","summary"].forEach(function(id){$(id).classList.add("hidden")});$("refuge").classList.remove("hidden");renderRefuge();save()
}
function acceptStarterKit(){if(!state.refuge.active||state.starterKitGiven)return;[{id:"cloth",qty:2},{id:"scrap",qty:2},{id:"food",qty:1},{id:"bandage",qty:1},{id:"ammo9",qty:2},{id:"ammo556",qty:2}].forEach(function(drop){placePartyItem(drop.id,drop.qty)});state.credits+=6;state.starterKitGiven=true;state.refuge.message="Mara entrega 10 unidades de suministros y 6 fichas para un intercambio de emergencia.";renderRefuge();renderMini();save()}
function restAtRefuge(){if(!state.refuge.active||state.refuge.rested)return;var recovered=0;state.party.forEach(function(p){var before=p.hp;p.hp=p.hp<=0?Math.min(p.maxHp,12):Math.min(p.maxHp,p.hp+8);recovered+=p.hp-before;p.hunger=clamp(p.hunger+25,0,100);p.guard=0;p.bleed=0});state.stats.rests++;state.stats.restHpRecovered+=recovered;state.stats.hpRestored+=recovered;state.refuge.rested=true;state.refuge.message="El grupo descansa: los agotados vuelven a 12 HP, los demás recuperan 8 HP y todos ganan 25% de energía.";renderRefuge();renderMini();save()}
function rejoinAtRefuge(){if(!state.refuge.active||state.refuge.rejoined)return;var shared=stockCount("food")>0;if(shared){consumeStock("food");addStatItem("itemsUsed","food",1)}var gain=shared?14:state.morale===0?10:6;state.morale=clamp(state.morale+gain,0,100);if(shared)state.party.forEach(function(p){p.hunger=clamp(p.hunger+8,0,100)});state.refuge.rejoined=true;state.refuge.message=shared?"Comparten una ración: moral +14 y energía +8.":"Revisan la retirada y acuerdan volver juntos: moral +"+gain+".";renderRefuge();renderMini();save()}
function sellTradeItem(pIndex,bagIndex){if(!state.refuge.active)return;var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stock=merchantStock(npc),p=state.party[pIndex],entry=p&&p.bag[bagIndex],offer=entry&&catalog[entry.id],d=entry&&gear(entry.id);if(!p||!entry||!offer||!offer.sell||d.kind==="mission")return;var id=entry.id,value=offer.sell;entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);state.credits+=value;state.stats.trades++;state.stats.creditsEarned+=value;if(offer.buy)stock[id]=(stock[id]||0)+1;state.refuge.message=p.name+" entrega "+d.name+" a "+(npc==="armorer"?"El Armero":"Mara")+" y recibe "+value+" fichas.";renderRefuge();renderMini();save()}
function buyTradeItem(id){if(!state.refuge.active)return;var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stockMap=merchantStock(npc),offer=catalog[id],d=gear(id),stock=Math.max(0,Number(stockMap[id])||0);if(!offer||!offer.buy||!d||!stock)return;if(state.credits<offer.buy){state.refuge.message="No hay fichas suficientes para recibir "+d.name+".";renderRefuge();return}if(!placePartyItem(id,1)){state.refuge.message="Las mochilas están llenas. Libera un espacio antes de comerciar.";renderRefuge();return}state.credits-=offer.buy;stockMap[id]--;state.stats.trades++;state.refuge.message=(npc==="armorer"?"El Armero entrega ":"Mara entrega ")+d.name+" a cambio de "+offer.buy+" fichas. Abre la ficha de un aliado para equiparlo.";renderRefuge();renderMini();save()}
function logisticsRowsHtml(){
  var rows=[
    ["Alimento",stockCount("food"),"La noche consume una ración si existe. Si no hay alimento, baja la moral y la energía recuperada es menor."],
    ["Agua",stockCount("water"),"Se consume al cerrar una jornada. Sin agua, la moral cae con más fuerza y el refugio se siente menos seguro."],
    ["Medicina",stockCount("meds")+stockCount("bandage")+stockCount("medkit")+stockCount("traumaKit"),"Permite levantar HP fuera de combate. Si alguien queda agotado, conviene curarlo antes de volver a salir."],
    ["Munición",ammoTotal(),"Cada disparo consume el cartucho correcto: 9 mm, 5,56 o calibre 12. Sin balas, el personaje cambia a arma blanca."],
    ["Componentes metálicos",stockCount("scrap"),"Sirven para reparar cascos/chalecos y fabricar equipo. Los merodeadores suelen soltar chatarra y tela."],
    ["Tela recuperada",stockCount("cloth"),"Sara la usa para vendas, medicina y botiquines. Si la gastas en una decisión, puede faltar para curar después."],
    ["Electrónica",stockCount("electronics"),"Material clave para granadas avanzadas, EMP y piezas UNO. Se obtiene sobre todo de drones y agentes."],
    ["Núcleos de pulso",stockCount("pulseCore"),"Permiten crear cargas EMP. Son escasos: si los gastas, quizá no puedas frenar drones más adelante."],
    ["Moral",state.morale+"%","Retirarse o tomar decisiones duras la reduce. Si llega a 0%, el grupo vuelve al refugio obligado."],
    ["Amenaza",state.threat+"%","Disparos, explosiones y rutas expuestas la elevan. Con amenaza alta, los finales y combates se vuelven más peligrosos."]
  ];
  return rows.map(function(row){return'<article class="logistics-card"><span>'+esc(row[0])+'</span><b>'+esc(row[1])+'</b><p>'+esc(row[2])+'</p></article>'}).join("")
}
function showLogisticsBriefing(){
  $("logisticsCards").innerHTML=logisticsRowsHtml();
  $("logisticsWarning").textContent=stockCount("food")<=1?"Te queda poco alimento: ayudar a otros o gastarlo puede afectar la noche.":stockCount("meds")+stockCount("bandage")+stockCount("medkit")+stockCount("traumaKit")<=1?"Tienes poca medicina: si alguien cae, el refugio dependerá del descanso o del crafteo.":stockCount("scrap")<2?"Tienes pocos componentes: reparar equipo será difícil si los chalecos o cascos se rompen.":"Revisa qué llevas: cada decisión puede gastar algo que después necesitarás para pelear, curar o reparar.";
  $("logisticsModal").classList.remove("hidden");
  $("confirmLogistics").focus()
}
function closeLogisticsBriefing(){$("logisticsModal").classList.add("hidden")}
function confirmLeaveRefuge(){
  if(!state.refuge.active)return false;state.logisticsSeen=true;state.refuge.active=false;state.refuge.reason=null;state.refuge.message="";$("logisticsModal").classList.add("hidden");$("refuge").classList.add("hidden");save();render();toast("El grupo vuelve a la expedición");return true
}
function leaveRefuge(){if(!state.refuge.active)return false;if(!refugeCanLeave()){state.refuge.message=!state.starterKitGiven?"Primero recibe el lote de salida.":state.morale<10?"El grupo no puede salir con la moral por debajo de 10%.":"Nadie sale agotado: recupera a todos hasta 10 HP y 10% de energía.";renderRefuge();return false}showLogisticsBriefing();return true}
function xpNeeded(p){return 50+(p.level-1)*35}
function energyResist(p){return Math.min(3,Math.max(0,p.level-1))}
function hasSkill(p,id){return !!(p&&Array.isArray(p.skills)&&p.skills.indexOf(id)>=0)}
function skillNode(p,id){return(skillTrees[p&&p.id]||[]).filter(function(node){return node.id===id})[0]||null}
function skillRequirement(p,node){if(!p||!node)return"Habilidad desconocida";if(hasSkill(p,node.id))return"Adquirida";if(p.level<node.minLevel)return"Requiere Lvl. "+node.minLevel;if(node.requires&&!hasSkill(p,node.requires)){var previous=skillNode(p,node.requires);return"Requiere "+(previous?previous.name:"habilidad anterior")}if(state.factionPoints<node.cost)return"Faltan "+(node.cost-state.factionPoints)+" puntos de facción";return"Disponible"}
function canUnlockSkill(p,node){return !!(p&&node&&!hasSkill(p,node.id)&&p.level>=node.minLevel&&(!node.requires||hasSkill(p,node.requires))&&state.factionPoints>=node.cost)}
function hasUnspentSkill(p){return state.factionPoints>0&&(skillTrees[p.id]||[]).some(function(node){return canUnlockSkill(p,node)})}
function awardFactionPoints(amount,reason){amount=Math.max(0,Number(amount)||0);if(!amount)return[];state.factionPoints+=amount;state.stats.factionEarned+=amount;return[["Puntos de facción","+"+amount+(reason?" · "+reason:"")]]}
function unlockSkill(pIndex,id){if(battleState)return false;var p=state.party[pIndex],node=skillNode(p,id);if(!canUnlockSkill(p,node)){toast(p&&node?skillRequirement(p,node):"Habilidad no disponible");return false}state.factionPoints-=node.cost;p.skills.push(node.id);state.stats.factionSpent+=node.cost;state.stats.skillsUnlocked++;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast(p.name+" desbloquea "+node.name);return true}
function storyDecisionBenefit(out){var fx=out&&out.fx||{},flags=out&&out.flags||{},flagPattern=/(save|rescu|truth|verdad|trust|confia|alliance|alianza|help|ayud|spare|perdon|free|liber|access|acceso|truce|tregua|returnRoute|clearAvenue|towerCode)/i;return Number(fx.morale)>=3||Number(fx.threat)<=-3||!!(out&&out.archive&&out.archive.length)||Object.keys(flags).some(function(key){return flags[key]&&flagPattern.test(key)})}
function addPersonalXp(pIndex,amount,source){
  var p=state.party[pIndex];if(!p||amount<=0)return[];p.xp+=amount;var leveled=[];
  if(battleState){battleState.xpEarned[pIndex]=(battleState.xpEarned[pIndex]||0)+amount;battleState.log.push(p.name+" obtiene "+amount+" XP"+(source?" por "+source:"")+".")}
  while(p.xp>=xpNeeded(p)){p.xp-=xpNeeded(p);p.level++;p.maxHp+=6;p.hp=Math.min(p.maxHp,p.hp+6);leveled.push(p.name+" alcanza Lvl. "+p.level+": +6 HP máximo y −1 al gasto de energía.");if(battleState)battleState.levelUps.push(p.name+" · Lvl. "+p.level)}
  return leveled
}
function missionDescription(def){if(!def.main)return def.description;if(state.index<9)return"Traza una ruta segura desde la Línea 1 hasta la superficie.";if(state.index<18)return"Descubre quién utiliza la red UNO para mantener viva la transmisión.";return"Alcanza la Torre 6 y decide qué verdad regresará a los refugios."}
function missionProgress(def){if(def.id==="signal")return state.finished?def.target:Math.min(def.target,state.index+1);if(def.id==="squad")return Math.min(def.target,state.stats.fullSquadWins||0);if(def.id==="salvage")return Math.min(def.target,state.stats.loot||0);if(def.id==="archives")return Math.min(def.target,state.docs.length);if(def.id==="veteran")return state.party.some(function(p){return p.level>=2})?1:0;return 0}
function rewardMission(def){
  if(def.id==="squad")state.morale=clamp(state.morale+6,0,100);
  else if(def.id==="salvage"){placePartyItem("food",1);placePartyItem("meds",1)}
  else if(def.id==="archives")state.threat=clamp(state.threat-6,0,100);
  else if(def.id==="veteran")state.party.forEach(function(p){p.hunger=clamp(p.hunger+10,0,100)});
  state.missionRewards[def.id]=true
}
function checkMissions(){var changes=[];missionDefs.filter(function(def){return !def.main}).forEach(function(def){if(!state.missionRewards[def.id]&&missionProgress(def)>=def.target){rewardMission(def);changes.push(["Misión cumplida",def.title+" · "+def.reward])}});return changes}
function missionCardHtml(def){var progress=missionProgress(def),done=progress>=def.target,percent=Math.round(100*progress/def.target);return'<article class="drawer-item mission-card '+(def.main?"main ":"")+(done?"completed":"")+'"><span class="mission-type">'+(def.main?"Misión principal":done?"Completada":"Misión secundaria")+'</span><h3>'+esc(def.title)+'</h3><p>'+esc(missionDescription(def))+'</p><div class="mission-track"><span style="width:'+percent+'%"></span></div><div class="mission-meta"><span>'+progress+' / '+def.target+'</span><span>'+percent+'%</span></div><div class="mission-reward">Recompensa · '+esc(def.reward)+'</div></article>'}
function weaponFor(p){var d=gear(p.equipment.weapon);return d&&d.kind==="weapon"?d:gear("knife")}
function gearDurability(p,slot){var d=gear(p.equipment[slot]);if(!d||!d.maxDurability)return null;var value=Number(p.durability&&p.durability[slot]);return Number.isFinite(value)?clamp(value,0,d.maxDurability):d.maxDurability}
function gearDefense(p){var base=["head","body"].reduce(function(sum,slot){var d=gear(p.equipment[slot]),dur=gearDurability(p,slot);return sum+(d&&d.defense&&dur>0?d.defense:0)},0);return base+(p&&p.id==="elias"&&base>0&&hasSkill(p,"elias_reinforce")?1:0)}
function hungerPenalty(p){return p.hunger<=10?-4:p.hunger<=35?-2:0}
function weaponAccuracyPenalty(p,w){return p&&p.id==="elias"&&w&&w.kind==="weapon"&&w.ammo&&!hasSkill(p,"elias_ballistics")?-2:0}
function personalAccuracyBonus(p){return p&&p.id==="noa"&&hasSkill(p,"noa_marksman")?1:0}
function personalDamageBonus(p,e){if(!p||p.id!=="noa")return 0;return(hasSkill(p,"noa_hunter")?2:0)+(hasSkill(p,"noa_execution")&&e&&e.hp/e.maxHp<=.35?4:0)}
function drainHunger(amount){state.party.forEach(function(p){p.hunger=clamp(p.hunger-Math.max(1,amount-energyResist(p)),0,100)})}
function damageArmor(p,wear){var slots=["head","body"].filter(function(slot){var d=gear(p.equipment[slot]);return d&&d.maxDurability&&gearDurability(p,slot)>0});if(!slots.length)return;var slot=slots[rand(0,slots.length-1)],d=gear(p.equipment[slot]),before=gearDurability(p,slot);p.durability[slot]=Math.max(0,before-wear);battleState.log.push(d.name+" de "+p.name+" pierde "+(before-p.durability[slot])+" de durabilidad.");if(p.durability[slot]===0)battleState.log.push(d.name+" queda inutilizable hasta que Elías lo repare.")}
function weaponLabel(p){var w=weaponFor(p),ammo=w.ammo?" · "+bagQty(p,w.ammo)+" cart.":" · cuerpo a cuerpo";return w.name+ammo}
function repairCost(p,slot){var d=gear(p.equipment[slot]),dur=gearDurability(p,slot);if(!d||!d.maxDurability||dur>=d.maxDurability)return 0;return dur===0||d.maxDurability-dur>=Math.ceil(d.maxDurability/2)?2:1}
function repairReady(p,slot){var cost=repairCost(p,slot);return cost>0&&state.party[1].hp>0&&state.engineeringUses>0&&hasPartyItem("tool")&&stockCount("scrap")>=cost}
function slotHtml(label,pIndex,slot){var p=state.party[pIndex],id=p.equipment[slot],d=gear(id),dur=d&&d.maxDurability?gearDurability(p,slot):null,cost=repairCost(p,slot),durability=d&&d.maxDurability?'<span class="durability-copy"><span>Durabilidad</span><b>'+dur+'/'+d.maxDurability+'</b></span><span class="durability-bar"><span style="width:'+Math.round(100*dur/d.maxDurability)+'%"></span></span>'+(cost?'<button class="repair-btn" data-repair="'+slot+'" '+(!repairReady(p,slot)?'disabled':'')+'>Reparar · '+cost+' comp.</button>':""):"";return'<div class="gear-slot"><span class="slot-name">'+esc(label)+'</span>'+itemArt(id,d&&d.name)+ '<span class="gear-copy"><strong>'+esc(d?d.name:"Vacío")+'</strong><small>'+esc(d?d.desc:"Sin equipar")+'</small>'+durability+'</span></div>'}
function canEquip(p,d){return d&&d.slot&&(d.kind!=="weapon"||p.categories.indexOf(d.category)>=0)}
function profileItemUsable(p,id){return id==="food"?p.hunger<100:id==="stimulant"?p.hp<p.maxHp||p.hunger<100:id==="meds"||id==="medkit"||id==="traumaKit"?p.hp<p.maxHp:id==="bandage"?p.hp<p.maxHp||p.bleed>0:false}
function recipeCostText(recipe){return Object.keys(recipe.cost).map(function(id){var names={scrap:"componentes",cloth:"tela",water:"agua",electronics:"electrónica",pulseCore:"núcleos de pulso"},d=gear(id);return recipe.cost[id]+" "+(names[id]||(d?d.name.toLowerCase():id))}).join(" · ")}
function professionUses(id){return id==="elias"?state.engineeringUses:id==="sara"?state.medicalUses:id==="noa"?state.ordnanceUses:0}
function craftOutputFits(p,recipe){return bagFree(p)+Object.keys(recipe.cost).reduce(function(sum,id){return sum+(id==="water"?0:Math.min(bagQty(p,id),recipe.cost[id]))},0)>=Math.max(1,Number(recipe.qty)||1)}
function canCraft(p,recipe){return !!(p&&recipe&&p.id===recipe.owner&&(!recipe.skill||hasSkill(p,recipe.skill))&&p.hp>0&&professionUses(p.id)>0&&(p.id!=="elias"||hasPartyItem("tool"))&&craftOutputFits(p,recipe)&&Object.keys(recipe.cost).every(function(id){return stockCount(id)>=recipe.cost[id]}))}
function profileVitalFill(kind,value,max,feedback,extraClass){var to=Math.round(100*value/max),active=feedback&&feedback.kind===kind;if(!active)return'<span class="vital-fill '+kind+' '+(extraClass||"")+'" style="width:'+to+'%"></span>';var from=Math.round(100*feedback.from/max);return'<span class="vital-fill '+kind+' '+(extraClass||"")+' vital-shift" style="--vital-from:'+from+'%;--vital-to:'+to+'%;width:'+to+'%"></span>'}
function profileVitalFloat(feedback){if(!feedback||feedback.delta<=0)return"";return'<span class="profile-vital-float '+feedback.kind+'" aria-live="polite">+'+feedback.delta+' '+(feedback.kind==="hp"?"HP":"ENERGÍA")+'</span>'}
function professionWorkshopHtml(p){
  var recipes=workshopRecipes.filter(function(recipe){return recipe.owner===p.id&&(!recipe.skill||hasSkill(p,recipe.skill))});if(!recipes.length)return"";
  var cards=recipes.map(function(recipe){var d=gear(recipe.id),ready=canCraft(p,recipe),qty=Math.max(1,Number(recipe.qty)||1);return'<article class="recipe-card">'+itemArt(recipe.id,d.name)+'<span><b>'+esc(d.name)+(qty>1?' ×'+qty:'')+'</b><small>'+esc(recipe.note)+'</small><em>'+esc(recipeCostText(recipe))+'</em></span><button data-craft="'+recipe.id+'" '+(!ready?'disabled':'')+'>Fabricar · +'+(recipe.xp||8)+' XP</button></article>'}).join("");
  var sara=p.id==="sara",noa=p.id==="noa",title=sara?"Mesa médica de Sara":noa?"Banco de explosivos de Noa":"Taller de Elías",description=sara?"Preparar medicina consume una acción médica. La tela se recupera de merodeadores.":noa?"Fabrica granadas y cargas EMP con chatarra electrónica recuperada.":"Reparar o fabricar consume una acción técnica. El uso de armas de fuego tiene −2 de precisión.",meta=sara?state.medicalUses+" / 3 acciones · "+stockCount("cloth")+" tela · "+stockCount("water")+" agua":noa?state.ordnanceUses+" / 3 acciones · "+stockCount("electronics")+" electrónica · "+stockCount("pulseCore")+" núcleos":state.engineeringUses+" / 3 acciones · "+stockCount("scrap")+" componentes · "+(hasPartyItem("tool")?"herramientas listas":"sin herramientas");
  return'<section class="workshop '+(sara?'medical-workshop':noa?'ordnance-workshop':'engineering-workshop')+'"><div class="workshop-head"><span><b>'+title+'</b><small>'+description+'</small></span><em>'+meta+'</em></div><div class="recipe-grid">'+cards+'</div></section>'
}
function skillTreeHtml(p){
  var nodes=skillTrees[p.id]||[],branches=[];nodes.forEach(function(node){if(branches.indexOf(node.branch)<0)branches.push(node.branch)});
  var columns=branches.map(function(branch){var branchNodes=nodes.filter(function(node){return node.branch===branch});return'<section class="skill-branch"><h4>'+esc(branch)+'</h4><div class="skill-path">'+branchNodes.map(function(node){var unlocked=hasSkill(p,node.id),available=canUnlockSkill(p,node),status=skillRequirement(p,node);return'<article class="skill-node tier-'+node.tier+' '+(unlocked?'unlocked':available?'available':'locked')+'"><span class="skill-tier">0'+node.tier+'</span><div><b>'+esc(node.name)+'</b><p>'+esc(node.desc)+'</p><small>'+esc(status)+' · '+node.cost+' PF</small></div><button data-unlock-skill="'+node.id+'" '+(!available?'disabled':'')+'>'+(unlocked?'Adquirida':'Desbloquear')+'</button></article>'}).join('')+'</div></section>'}).join('');
  return'<section class="skill-tree"><div class="skill-tree-head"><span><b>Árbol de habilidades</b><small>Los puntos son compartidos: especializa al grupo según la ruta de esta partida.</small></span><em>Puntos de facción <strong>'+state.factionPoints+'</strong></em></div><div class="skill-branches">'+columns+'</div></section>'
}
function profileTabsHtml(p){var tabs=[{id:"inventory",label:"Equipamiento"},{id:"crafting",label:"Crafteo"},{id:"skills",label:"Habilidades"}];return'<nav class="profile-tabs" role="tablist" aria-label="Secciones del loadout">'+tabs.map(function(tab){var active=profileTab===tab.id,alert=tab.id==="skills"&&hasUnspentSkill(p)?'<span class="profile-tab-alert">'+state.factionPoints+'</span>':"";return'<button id="profileTab-'+tab.id+'" role="tab" aria-selected="'+(active?'true':'false')+'" aria-controls="profilePane-'+tab.id+'" tabindex="'+(active?'0':'-1')+'" class="'+(active?'active':'')+'" data-profile-tab="'+tab.id+'">'+tab.label+alert+'</button>'}).join('')+'</nav>'}
function setProfileTab(i,tab,focusTab){if(["inventory","crafting","skills"].indexOf(tab)<0)return;profileTab=tab;renderProfile(i);if(focusTab){var button=$("profileTab-"+tab);if(button)button.focus()}}
function renderProfile(i,feedback){
  var p=state.party[i];if(!p)return;$('profileTitle').textContent=p.name+" · "+p.role;
  var bag=p.bag.length?p.bag.map(function(entry,index){var d=gear(entry.id),equip=canEquip(p,d),usable=profileItemUsable(p,entry.id),label=d&&d.kind==="weapon"&&p.categories.indexOf(d.category)<0?"Incompatible":"Equipar",targets=state.party.some(function(other,j){return j!==i&&canReceive(other,entry.id,1)}),units=Math.max(1,Number(entry.qty)||1),dur=d&&d.maxDurability?' · Durabilidad '+entry.durability+'/'+d.maxDurability:"",actions=(d&&d.slot?'<button class="equip-btn" data-equip="'+index+'" '+(!equip?'disabled':'')+'>'+esc(label)+'</button>':"")+(usable||["food","meds","bandage","medkit"].indexOf(entry.id)>=0?'<button class="profile-use-btn" data-profile-use="'+index+'" '+(!usable?'disabled':'')+'>Usar</button>':"")+'<button class="transfer-open-btn" data-transfer-open="'+index+'" '+(!targets?'disabled':'')+'>Transferir</button>';return'<article class="bag-item">'+itemArt(entry.id,d&&d.name)+'<span class="bag-copy"><b>'+esc((d?d.name:entry.id)+(entry.qty>1?" ×"+entry.qty:""))+'</b><small>'+esc((d?d.desc:"Objeto recuperado")+dur)+'</small><em>'+units+' espacio'+(units===1?'':'s')+'</em></span><div class="bag-actions">'+actions+'</div></article>'}).join(""):'<p class="empty">La mochila está vacía.</p>';
  var hungerClass=p.hunger<=10?"critical":p.hunger<=35?"low":"",skills=skillTreeHtml(p),workshop=professionWorkshopHtml(p),inventory='<div class="loadout-inventory"><div class="loadout-side">'+slotHtml("Arma",i,"weapon")+slotHtml("Mochila",i,"backpack")+'</div><div class="bag-panel"><div class="bag-head"><span>Inventario personal</span><b>'+bagUsed(p)+' / '+bagCapacity(p)+' espacios</b></div><div class="bag-slots">'+bag+'</div></div></div>';
  $('profileContent').innerHTML='<div class="loadout-grid"><div class="loadout-side">'+slotHtml("Cabeza",i,"head")+slotHtml("Cuerpo",i,"body")+'</div><div class="loadout-person">'+assetImage("characters/"+p.id+"-loadout.webp",p.name+", "+p.role,"loadout-character-art",768,1152)+profileVitalFloat(feedback)+'<div class="profile-vitals '+(feedback?'fx-'+feedback.kind:"")+'"><div class="vital-row hp-row"><span>HP</span><div class="vital-track">'+profileVitalFill("hp",p.hp,p.maxHp,feedback,"")+'</div><b>'+p.hp+'/'+p.maxHp+'</b></div><div class="vital-row energy-row"><span>Energía</span><div class="vital-track">'+profileVitalFill("energy",p.hunger,100,feedback,hungerClass)+'</div><b>'+p.hunger+'%</b></div><div class="person-stats"><div class="person-stat">Rango<b>Lvl. '+p.level+'</b></div><div class="person-stat">XP<b>'+p.xp+'/'+xpNeeded(p)+'</b></div><div class="person-stat">Resistencia<b>−'+energyResist(p)+' gasto</b></div><div class="person-stat">Defensa<b>+'+gearDefense(p)+'</b></div></div></div></div><section class="loadout-hub">'+profileTabsHtml(p)+'<div id="profilePane-inventory" role="tabpanel" aria-labelledby="profileTab-inventory" class="profile-pane inventory '+(profileTab==="inventory"?'active':'')+'">'+inventory+'</div><div id="profilePane-crafting" role="tabpanel" aria-labelledby="profileTab-crafting" class="profile-pane crafting '+(profileTab==="crafting"?'active':'')+'">'+workshop+'</div><div id="profilePane-skills" role="tabpanel" aria-labelledby="profileTab-skills" class="profile-pane skills '+(profileTab==="skills"?'active':'')+'">'+skills+'</div></section></div>';
  Array.prototype.forEach.call(document.querySelectorAll("[data-equip]"),function(b){b.addEventListener("click",function(){equipBagItem(i,Number(b.dataset.equip))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile-use]"),function(b){b.addEventListener("click",function(){useProfileItem(i,Number(b.dataset.profileUse))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-open]"),function(b){b.addEventListener("click",function(){openTransferModal(i,Number(b.dataset.transferOpen))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-repair]"),function(b){b.addEventListener("click",function(){repairEquipment(i,b.dataset.repair)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-craft]"),function(b){b.addEventListener("click",function(){craftItem(i,b.dataset.craft)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-unlock-skill]"),function(b){b.addEventListener("click",function(){unlockSkill(i,b.dataset.unlockSkill)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile-tab]"),function(b){b.addEventListener("click",function(){setProfileTab(i,b.dataset.profileTab,true)});b.addEventListener("keydown",function(e){var order=["inventory","crafting","skills"],current=order.indexOf(b.dataset.profileTab),next=current;if(e.key==="ArrowRight")next=(current+1)%order.length;else if(e.key==="ArrowLeft")next=(current+order.length-1)%order.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=order.length-1;else return;e.preventDefault();setProfileTab(i,order[next],true)})})
}
function transferTargetHtml(fromIndex,bagIndex,toIndex){
  var to=state.party[toIndex],used=bagUsed(to),capacity=bagCapacity(to),free=bagFree(to),can=free>=1;
  return'<button class="transfer-target" data-transfer-target="'+toIndex+'" '+(!can?'disabled':'')+'><span><b>'+esc(to.name)+'</b><small>'+esc(to.role)+' · '+used+'/'+capacity+' espacios ocupados</small></span><em>'+free+' libre'+(free===1?'':'s')+'</em></button>'
}
function renderTransferModal(){
  if(!transferDraft)return;var from=state.party[transferDraft.fromIndex],entry=from&&from.bag[transferDraft.bagIndex],d=entry&&gear(entry.id);if(!from||!entry){closeTransferModal();return}
  var units=Math.max(1,Number(entry.qty)||1),max=d&&d.stack?units:1,targets=state.party.map(function(_,j){return j!==transferDraft.fromIndex?transferTargetHtml(transferDraft.fromIndex,transferDraft.bagIndex,j):""}).join("");
  $("transferObject").innerHTML=itemArt(entry.id,d&&d.name)+'<span><b>'+esc((d?d.name:entry.id)+(entry.qty>1?" ×"+entry.qty:""))+'</b><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>Sale desde '+esc(from.name)+'</em></span>';
  $("transferQty").max=max;$("transferQty").value=Math.min(max,Math.max(1,Number($("transferQty").value)||1));$("transferQty").disabled=max===1;
  $("transferTargets").innerHTML=targets||'<p class="empty">No hay otro aliado disponible.</p>';
  $("transferMessage").classList.toggle("hidden",state.party.some(function(_,j){return j!==transferDraft.fromIndex&&bagFree(state.party[j])>0}));
  Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-target]"),function(b){b.addEventListener("click",function(){confirmTransferTarget(Number(b.dataset.transferTarget))})})
}
function openTransferModal(fromIndex,bagIndex){
  if(battleState)return;var from=state.party[fromIndex],entry=from&&from.bag[bagIndex];if(!from||!entry){toast("No se pudo abrir la transferencia");return}
  transferDraft={fromIndex:fromIndex,bagIndex:bagIndex};$("transferModal").classList.remove("hidden");$("transferQty").value=1;renderTransferModal();$("transferQty").focus()
}
function confirmTransferTarget(toIndex){
  if(!transferDraft)return;var qty=Number($("transferQty").value)||1;if(transferBagItem(transferDraft.fromIndex,transferDraft.bagIndex,toIndex,qty))closeTransferModal()
}
function closeTransferModal(){
  transferDraft=null;if($("transferModal"))$("transferModal").classList.add("hidden")
}
function openProfile(i){if(battleState)return;profileTab="inventory";renderProfile(i);$('profileModal').classList.remove('hidden');$('closeProfile').focus()}
function closeProfile(){closeTransferModal();$('profileModal').classList.add('hidden');if(state.refuge.active)renderRefuge()}
function equipBagItem(pIndex,bagIndex){
  var p=state.party[pIndex],entry=p&&p.bag[bagIndex],d=entry&&gear(entry.id);if(!p||!entry||!canEquip(p,d)){toast("Ese superviviente no domina esa categoría");return}
  var old=p.equipment[d.slot],oldDur=d.slot==="head"||d.slot==="body"?gearDurability(p,d.slot):null,newDur=d.maxDurability?(Number.isFinite(Number(entry.durability))?Number(entry.durability):d.maxDurability):null,futureUsed=bagUsed(p)-1+(old?1:0);if(d.slot==="backpack"&&d.capacity<futureUsed){toast("La mochila nueva no puede contener la carga resultante");return}
  var nextId=entry.id;entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);if(old&&!addToBag(p,old,1,oldDur)){addToBag(p,nextId,1,newDur);toast("No hay espacio para guardar el equipo anterior");return}
  p.equipment[d.slot]=nextId;if(d.slot==="head"||d.slot==="body")p.durability[d.slot]=newDur;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast(d.name+" equipado por "+p.name)
}
function useProfileItem(pIndex,bagIndex){
  if(battleState)return;var p=state.party[pIndex],entry=p&&p.bag[bagIndex],id=entry&&entry.id;if(!p||!entry||!profileItemUsable(p,id)){toast("Ese objeto no puede utilizarse ahora");return}var message="",feedback;
  if(id==="food"){var beforeHunger=p.hunger;p.hunger=clamp(p.hunger+40,0,100);feedback={kind:"energy",from:beforeHunger,to:p.hunger,delta:p.hunger-beforeHunger};message=p.name+" recupera "+feedback.delta+" de energía"}
  else if(id==="stimulant"){var stimulantHp=p.hp,stimulantEnergy=p.hunger;p.hp=Math.min(p.maxHp,p.hp+10);p.hunger=clamp(p.hunger+30,0,100);feedback={kind:p.hp>stimulantHp?"hp":"energy",from:p.hp>stimulantHp?stimulantHp:stimulantEnergy,to:p.hp>stimulantHp?p.hp:p.hunger,delta:p.hp>stimulantHp?p.hp-stimulantHp:p.hunger-stimulantEnergy};recordHealing(p.hp-stimulantHp,true);message=p.name+" recupera "+(p.hp-stimulantHp)+" HP y "+(p.hunger-stimulantEnergy)+" de energía"}
  else{var before=p.hp,heal=id==="traumaKit"?54:id==="medkit"?40:id==="meds"?26:14;p.hp=Math.min(p.maxHp,p.hp+heal);if(id==="bandage")p.bleed=0;feedback={kind:"hp",from:before,to:p.hp,delta:p.hp-before};recordHealing(feedback.delta,true);message=p.name+" recupera "+feedback.delta+" HP"+(id==="bandage"?" y detiene el sangrado":"")}
  if(id==="food")playSfx("loadout-food");else playSfx("hp-medical-use");
  addStatItem("itemsUsed",id,1);
  entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);save();renderMini();renderProfile(pIndex,feedback);if(state.refuge.active)renderRefuge();toast(message)
}
function transferBagItem(fromIndex,bagIndex,toIndex,qty){
  if(battleState)return false;var from=state.party[fromIndex],to=state.party[toIndex],entry=from&&from.bag[bagIndex],d=entry&&gear(entry.id),available=entry?Math.max(1,Number(entry.qty)||1):0,amount=Math.max(1,Math.floor(Number(qty)||1));if(!from||!to||!entry){toast("No se pudo transferir el objeto");renderProfile(fromIndex);return false}if(!d||!d.stack)amount=1;amount=Math.min(amount,available);if(bagFree(to)<amount){toast("La mochila de "+to.name+" solo tiene "+bagFree(to)+" espacio"+(bagFree(to)===1?"":"s"));renderProfile(fromIndex);if(transferDraft)renderTransferModal();return false}if(!addToBag(to,entry.id,amount,entry.durability)){toast("No se pudo transferir el objeto");return false}entry.qty-=amount;if(entry.qty<=0)from.bag.splice(bagIndex,1);playSfx("loadout-transfer");save();renderMini();renderProfile(fromIndex);if(state.refuge.active)renderRefuge();toast((d?d.name:entry.id)+" ×"+amount+" transferido a "+to.name);return true
}
function repairEquipment(pIndex,slot){
  if(battleState)return;var p=state.party[pIndex],d=p&&gear(p.equipment[slot]),cost=p&&repairCost(p,slot);if(!p||!d||!repairReady(p,slot)){toast("El taller no puede realizar esa reparación");return}for(var n=0;n<cost;n++)consumeStock("scrap",1);var before=gearDurability(p,slot);p.durability[slot]=Math.min(d.maxDurability,before+Math.ceil(d.maxDurability/2));state.engineeringUses--;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast("Elías repara "+d.name+": "+before+" → "+p.durability[slot])
}
function craftItem(pIndex,id){
  if(battleState)return;var p=state.party[pIndex],recipe=workshopRecipes.filter(function(x){return x.id===id&&p&&x.owner===p.id})[0],d=gear(id);if(!recipe||!canCraft(p,recipe)){toast("Faltan recursos, espacio, habilidad o acciones profesionales");return}var qty=Math.max(1,Number(recipe.qty)||1),xp=recipe.xp||8;Object.keys(recipe.cost).forEach(function(costId){for(var n=0;n<recipe.cost[costId];n++)consumeStock(costId,pIndex)});addToBag(p,id,qty);state.stats.crafts++;addStatItem("craftedItems",id,qty);state.stats.xpFromCrafting+=xp;var levels=addPersonalXp(pIndex,xp,"fabricar "+d.name);if(p.id==="sara")state.medicalUses--;else if(p.id==="noa")state.ordnanceUses--;else state.engineeringUses--;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast((p.id==="sara"?"Sara prepara ":p.name+" fabrica ")+d.name+(qty>1?" ×"+qty:"")+" · +"+xp+" XP"+(levels.length?" · "+levels[0]:""))
}
function reason(c){
  var k;if(c.req){for(k in c.req)if(stockCount(k)<c.req[k])return"Falta "+resName(k).toLowerCase()}
  if(c.reqItems&&!c.reqItems.every(function(x){return hasPartyItem(x)}))return"Falta un objeto";
  if(c.reqAny&&!c.reqAny.some(function(x){return hasPartyItem(x)}))return"Falta tecnología";
  if(c.reqFlags&&!c.reqFlags.some(function(x){return !!state.flags[x]}))return"Ruta no descubierta";
  return""
}
function apply(o){
  var changes=[];Object.keys(o.fx||{}).forEach(function(k){var v=o.fx[k];if(k==="threat"){state.threat=clamp(state.threat+v,0,100);changes.push(["Amenaza",v>0?"+"+v:String(v)])}else if(k==="morale"){state.morale=clamp(state.morale+v,0,100);changes.push(["Moral",v>0?"+"+v:String(v)])}else if(k==="water"){state.res.water=Math.max(0,state.res.water+v);changes.push(["Agua",v>0?"+"+v:String(v)])}else{var id=k==="ammo"?"ammo9":k,qty=Math.abs(v)*(k==="ammo"?4:1);if(v>0)placePartyItem(id,qty);else removePartyItem(id,qty);changes.push([resName(k),v>0?"+"+qty:String(-qty)])}});
  (o.add||[]).forEach(function(x){if(!hasPartyItem(x))placePartyItem(x,1)});(o.remove||[]).forEach(function(x){removePartyItem(x,1)});pushUnique(state.docs,o.archive);Object.assign(state.flags,o.flags||{});
  (o.add||[]).forEach(function(x){var d=gear(x);if(items[x]||d)changes.push(["Objeto",items[x]?items[x][1]:d.name])});(o.archive||[]).forEach(function(x){if(archives[x])changes.push(["Archivo",archives[x][0]])});return changes.slice(0,6)
}

function choose(i){
  if(pending||battleState)return;var ev=events[state.index],c=ev.choices[i];if(!c||reason(c))return;
  drainHunger(4);
  if(c.combat){startCombat(c.combat,c);return}
  var out=c,roll=null;if(c.roll){roll=d20();out=roll+(c.roll.bonus||0)>=c.roll.dc?c.roll.success:c.roll.fail}
  completeChoice(c,out,roll,c.roll)
}
function completeChoice(choice,out,roll,check,extra){
  var ev=events[state.index],changes=(extra||[]).concat(apply(out)),factionReward=storyDecisionBenefit(out)?1:0,missionChanges=checkMissions();if(factionReward)changes=awardFactionPoints(factionReward,"decisión con impacto").concat(changes);changes=missionChanges.concat(changes);if(choice.ending)state.ending=choice.ending;
  state.history.push({day:ev.day,loc:ev.loc,choice:choice.label,result:out.title||choice.title,faction:factionReward});pending={ending:choice.ending||null,returnToRefuge:null};
  if(state.morale<=0&&!choice.ending){pending.returnToRefuge="morale";changes.unshift(["Cohesión","Regreso obligatorio al refugio"])}
  showResult(out.title||choice.title,out.result||choice.result,changes,roll,check);render();save()
}
function showResult(title,text,changes,roll,check){
  $("resultKicker").textContent=roll===null?"Consecuencia":"Prueba · Dificultad "+check.dc;
  $("resultTitle").textContent=title;$("resultText").textContent=text;$("roll").classList.toggle("hidden",roll===null);
  if(roll!==null)$("rollValue").textContent=check.bonus?roll+"+"+check.bonus:roll;
  $("resultChanges").innerHTML=(changes.length?changes:[["Registro","Actualizado"]]).slice(0,6).map(function(x){return'<div class="result-chip">'+esc(x[0])+"<strong>"+esc(x[1])+"</strong></div>"}).join("");
  $("result").classList.remove("hidden");$("advance").focus()
}
function advance(){
  if(!pending)return;setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);var ending=pending.ending,returnToRefuge=pending.returnToRefuge;pending=null;$("result").classList.add("hidden");if(ending){finish(ending);return}
  var oldDay=events[state.index].day;state.index++;if(returnToRefuge){openRefuge(returnToRefuge);return}if(events[state.index].day!==oldDay){night(oldDay)}else{save();render()}
}
function night(day){
  var hadFood=stockCount("food")>0,hadWater=stockCount("water")>0;if(hadFood){consumeStock("food");addStatItem("itemsUsed","food",1)}if(hadWater)consumeStock("water");var penalty=(hadFood?0:5)+(hadWater?0:8);state.morale=clamp(state.morale-penalty,0,100);state.engineeringUses=3;state.medicalUses=3;state.ordnanceUses=3;
  var recovered=0;state.party.forEach(function(p){var before=p.hp;p.hp=Math.min(p.maxHp,p.hp>0?p.hp+8:12);recovered+=p.hp-before;p.hunger=clamp(p.hunger+(hadFood?24:-8),0,100);p.guard=0;p.bleed=0});state.stats.rests++;state.stats.restHpRecovered+=recovered;state.stats.hpRestored+=recovered;
  $("nightTitle").textContent=day===1?"La noche bajo Los Héroes":"La última noche del refugio";
  $("nightText").textContent=penalty?"El grupo cura sus heridas, pero la falta de suministros convierte cada decisión en una discusión.":"El grupo comparte una ración, atiende sus heridas y ordena la información. Afuera, UNO continúa buscando la señal.";
  $("nightChanges").innerHTML=[["Alimento común",hadFood?"−1":"Agotado"],["Energía",hadFood?"+24":"−8"],["Recuperación","+8 HP"],["Talleres profesionales","3 acciones"]].map(function(x){return'<div class="result-chip">'+x[0]+"<strong>"+x[1]+"</strong></div>"}).join("");
  $("night").classList.remove("hidden");save();render()
}
function completedMissionCount(){return missionDefs.filter(function(def){return !def.main&&missionProgress(def)>=def.target}).length}
function endingTier(kind){
  if(kind==="trade"||state.morale<25||state.threat>=92)return{id:"bad",label:"Final malo"};
  if(kind==="broadcast"&&state.morale>=50&&state.threat<=82||kind==="return"&&state.morale>=70&&state.threat<=50)return{id:"good",label:"Final bueno"};
  return{id:"normal",label:"Final normal"}
}
function endingNarrative(kind,tierId){
  var choice={broadcast:"La verdad fue transmitida a todos los refugios.",return:"Los archivos fueron llevados al consejo de los Rotos.",trade:"Los archivos fueron negociados con los Cosechadores."}[kind]||"La expedición decidió el destino de los archivos.";
  var endings={
    good:{title:"La ciudad vuelve a contestar",lead:choice+" La expedición no solo regresó: cambió el equilibrio de NeoSantiago.",refuge:"El Andén 4 recibe información, rutas y pruebas suficientes para dejar de depender de la versión de UNO. Mara distribuye copias y suministros entre varias familias; destruir un solo archivo ya no bastará para devolverlos al silencio.",group:"Sara, Elías y Noa regresan con heridas y desacuerdos, pero todavía confían entre sí. Sus decisiones los convierten en la primera patrulla capaz de volver a la superficie por voluntad propia y no por una orden del consejo.",world:"La señal se transforma en una red de voces. Refugios desconocidos responden, los merodeadores dejan de ser una historia simple y UNO pierde el control absoluto de la memoria de Santiago. La siguiente expedición partirá hacia una ciudad despierta."},
    normal:{title:"Una verdad incompleta",lead:choice+" El refugio sobrevive, aunque el viaje deja preguntas y deudas que nadie puede resolver todavía.",refuge:"La Línea 1 gana tiempo y conserva parte de lo descubierto, pero las rutas quedaron expuestas y los recursos siguen siendo escasos. El consejo acepta preparar otra salida antes de decidir cuánto de la verdad puede soportar la comunidad.",group:"El grupo vuelve completo, pero no intacto. Las retiradas, los secretos y las decisiones difíciles cambian la relación entre Sara, Elías y Noa. Seguirán trabajando juntos porque todavía se necesitan, no porque estén de acuerdo.",world:"UNO mantiene el control de gran parte de la superficie. Algunos refugios escucharon la señal y otros solo recibieron fragmentos. NeoSantiago conoce ahora una grieta en el sistema, pero aún no sabe si utilizarla para liberarse o para sobrevivir un día más."},
    bad:{title:"El precio del silencio",lead:choice+" La expedición termina, pero la verdad deja de pertenecer a quienes arriesgaron la vida para encontrarla.",refuge:"El Andén 4 recibe suministros y una calma temporal, pero queda atado a nuevas deudas. Mara comprende que el refugio sobrevivió esta vez a cambio de entregar rutas, nombres o poder de negociación a una fuerza externa.",group:"Sara, Elías y Noa regresan agotados y sin una versión común de lo ocurrido. Nadie murió, pero la confianza quedó quebrada. Cada uno conserva una parte distinta de la historia y teme lo que los otros podrían hacer con ella.",world:"UNO conserva la ventaja mientras los Cosechadores convierten la información en mercancía. La señal se apaga, los demás refugios siguen aislados y NeoSantiago aprende que incluso la verdad puede ser utilizada como otra forma de control."}
  };return endings[tierId]
}
function calculateScore(kind,tierId){
  var s=state.stats,level=Math.max.apply(null,state.party.map(function(p){return p.level})),tierBonus={good:2000,normal:900,bad:0}[tierId]||0;
  return Math.max(0,Math.round(state.history.length*80+s.wins*650+s.enemies*180+s.loot*45+state.docs.length*180+completedMissionCount()*400+s.hits*28+s.criticals*140+s.damageDealt*3+level*220+s.skillsUnlocked*150+s.factionEarned*45+state.morale*9+(100-state.threat)*6+tierBonus-s.retreats*260))
}
function scoreRank(score){return score>=9000?"S":score>=7200?"A":score>=5600?"B":score>=4000?"C":"D"}
function namedItemList(bucket){return Object.keys(bucket||{}).filter(function(id){return bucket[id]>0}).sort(function(a,b){return bucket[b]-bucket[a]}).map(function(id){var d=gear(id);return{name:d?d.name:id,qty:bucket[id]}})}
function buildRunReport(){
  var tier=endingTier(state.ending),outcome=endingNarrative(state.ending,tier.id),score=calculateScore(state.ending,tier.id),s=state.stats;
  return{tier:tier,outcome:outcome,score:score,rank:scoreRank(score),combat:[["Combates ganados",s.wins+" / "+s.battles],["Golpes realizados",s.attacks],["Golpes acertados",s.hits],["Golpes fallados",s.misses],["Golpes críticos",s.criticals],["Balas utilizadas",s.shots],["Daño causado",s.damageDealt],["Daño recibido",s.damageTaken],["Enemigos neutralizados",s.enemies],["Aliados reanimados",s.revives]],survival:[["Medicina utilizada",s.medicineUsed],["HP recuperado",s.hpRestored],["Descansos",s.rests],["Retiradas",s.retreats],["Visitas al refugio",s.refugeVisits],["Trueques",s.trades],["Objetos fabricados",s.crafts],["XP por fabricar",s.xpFromCrafting]],exploration:[["Botín recuperado",s.loot],["Archivos descubiertos",state.docs.length],["Decisiones tomadas",state.history.length],["Misiones cumplidas",completedMissionCount()+" / 4"],["Puntos de facción ganados",s.factionEarned],["Habilidades adquiridas",s.skillsUnlocked],["Puntos sin gastar",state.factionPoints],["Moral final",state.morale+"%"],["Amenaza final",state.threat+"%"]],loot:namedItemList(s.lootItems),used:namedItemList(s.itemsUsed),crafted:namedItemList(s.craftedItems),decisions:state.history.slice()}
}
function animateScore(target){var step=0,total=32;function tick(){step++;var progress=step/total,eased=1-Math.pow(1-progress,3);$("finalScoreValue").textContent=Math.round(target*eased).toLocaleString("es-CL");if(step<total)setTimeout(tick,24)}tick()}
function finish(kind){
  state.finished=true;state.ending=kind;var tier=endingTier(kind),story=endingNarrative(kind,tier.id),score=calculateScore(kind,tier.id),level=Math.max.apply(null,state.party.map(function(p){return p.level}));state.finalTier=tier.id;state.score=score;
  playSfx(tier.id==="good"?"ending-good":tier.id==="bad"?"ending-bad":"ending-neutral");
  $("finalTier").textContent=tier.label;$("finalTier").className="ending-badge "+tier.id;$("finalTitle").textContent=story.title;$("finalText").textContent=story.lead;$("finalRefuge").textContent=story.refuge;$("finalGroup").textContent=story.group;$("finalWorld").textContent=story.world;$("finalRank").textContent="Rango "+scoreRank(score);$("finalStats").innerHTML=[["Moral",state.morale+"%"],["Amenaza",state.threat+"%"],["Combates",state.stats.wins+" / "+state.stats.battles],["Botín",state.stats.loot],["Misiones",completedMissionCount()+" / 4"],["Nivel máximo","Lvl. "+level]].map(function(x){return'<div class="result-chip">'+x[0]+"<strong>"+x[1]+"</strong></div>"}).join("");$("summary").classList.add("hidden");$("final").classList.remove("hidden");animateScore(score);save()
}
function metricSection(title,rows){return'<section class="summary-block"><h3>'+esc(title)+'</h3><div class="summary-metrics">'+rows.map(function(row){return'<div><span>'+esc(row[0])+'</span><b>'+esc(row[1])+'</b></div>'}).join("")+'</div></section>'}
function itemSummary(title,list){return'<section class="summary-block"><h3>'+esc(title)+'</h3><div class="summary-items">'+(list.length?list.map(function(item){return'<span><b>'+esc(item.qty)+'</b>'+esc(item.name)+'</span>'}).join(""):'<p class="empty">Sin registros en esta categoría.</p>')+'</div></section>'}
function showRunSummary(){
  if(!state.finished||!state.ending)return;var report=buildRunReport();$("final").classList.add("hidden");$("summaryTier").textContent=report.tier.label;$("summaryTier").className="ending-badge "+report.tier.id;$("summaryScore").textContent=report.score.toLocaleString("es-CL")+" puntos · Rango "+report.rank;$("summaryMetrics").innerHTML=metricSection("Combate",report.combat)+metricSection("Supervivencia",report.survival)+metricSection("Expedición",report.exploration);$("summaryInventory").innerHTML=itemSummary("Todo lo saqueado",report.loot)+itemSummary("Objetos utilizados",report.used)+itemSummary("Objetos fabricados",report.crafted);$("summaryDecisions").innerHTML=report.decisions.length?report.decisions.map(function(entry,i){return'<article><b>'+String(i+1).padStart(2,"0")+'</b><span><strong>Día '+entry.day+' · '+esc(entry.loc)+'</strong><small>'+esc(entry.choice)+' → '+esc(entry.result)+'</small></span></article>'}).join(""):'<p class="empty">No hay decisiones registradas.</p>';state.summarySeen=true;state.score=report.score;$("summary").classList.remove("hidden");save()
}
function canvasWrap(ctx,text,x,y,maxWidth,lineHeight,maxLines){var words=String(text).split(/\s+/),line="",lines=0;for(var i=0;i<words.length;i++){var test=line?line+" "+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=words[i];if(maxLines&&lines>=maxLines)return y}else line=test}if(line&&(!maxLines||lines<maxLines)){ctx.fillText(line,x,y);y+=lineHeight}return y}
function canvasHeading(ctx,title,y,color){ctx.fillStyle=color;ctx.font="700 24px Arial";ctx.fillText(title.toUpperCase(),90,y);ctx.fillStyle="rgba(255,255,255,.16)";ctx.fillRect(90,y+16,1420,2);return y+54}
function downloadResultPng(){
  if(!state.finished)return;var report=buildRunReport(),canvas=document.createElement("canvas"),lootRows=Math.max(report.loot.length,report.used.length,report.crafted.length),height=3100+report.decisions.length*100+Math.ceil(lootRows/2)*50;canvas.width=1600;canvas.height=height;var ctx=canvas.getContext("2d"),accent=report.tier.id==="good"?"#75d3d7":report.tier.id==="bad"?"#df4a4a":"#d9a15c",gradient=ctx.createLinearGradient(0,0,1600,height);gradient.addColorStop(0,"#07100f");gradient.addColorStop(.55,"#090d0c");gradient.addColorStop(1,"#030504");ctx.fillStyle=gradient;ctx.fillRect(0,0,1600,height);ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.strokeRect(42,42,1516,height-84);ctx.fillStyle="#75d3d7";ctx.font="700 23px Arial";ctx.fillText("NEOSANTIAGO 2130 · REGISTRO DE EXPEDICIÓN",90,115);ctx.fillStyle=accent;ctx.font="800 32px Arial";ctx.fillText(report.tier.label.toUpperCase(),90,185);ctx.fillStyle="#f2bd73";ctx.font="800 66px Arial";ctx.fillText(report.outcome.title.toUpperCase(),90,270);ctx.fillStyle="#e7e2d8";ctx.font="700 54px Arial";ctx.fillText(report.score.toLocaleString("es-CL")+" PUNTOS",90,360);ctx.fillStyle=accent;ctx.font="800 88px Arial";ctx.textAlign="right";ctx.fillText("RANGO "+report.rank,1510,360);ctx.textAlign="left";ctx.fillStyle="#cfcac0";ctx.font="28px Georgia";var y=430;y=canvasWrap(ctx,report.outcome.lead,90,y,1420,42,4)+30;
  [["EL REFUGIO",report.outcome.refuge],["EL GRUPO",report.outcome.group],["NEOSANTIAGO",report.outcome.world]].forEach(function(section){ctx.fillStyle=accent;ctx.font="700 22px Arial";ctx.fillText(section[0],90,y);y+=38;ctx.fillStyle="#d9d5cc";ctx.font="25px Georgia";y=canvasWrap(ctx,section[1],90,y,1420,38,5)+22});
  y=canvasHeading(ctx,"Resumen de la partida",y+12,accent);var allMetrics=report.combat.concat(report.survival,report.exploration),cols=3,colWidth=470;allMetrics.forEach(function(row,i){var col=i%cols,rowIndex=Math.floor(i/cols),mx=90+col*colWidth,my=y+rowIndex*70;ctx.fillStyle="#8f9690";ctx.font="19px Arial";ctx.fillText(String(row[0]).toUpperCase(),mx,my);ctx.fillStyle="#f2bd73";ctx.font="700 30px Arial";ctx.fillText(String(row[1]),mx,my+34)});y+=Math.ceil(allMetrics.length/cols)*70+30;
  y=canvasHeading(ctx,"Inventario de la expedición",y,accent);var inventoryGroups=[["SAQUEADO",report.loot],["UTILIZADO",report.used],["FABRICADO",report.crafted]];inventoryGroups.forEach(function(group){ctx.fillStyle="#75d3d7";ctx.font="700 20px Arial";ctx.fillText(group[0],90,y);y+=32;ctx.fillStyle="#d9d5cc";ctx.font="22px Arial";var copy=group[1].length?group[1].map(function(item){return item.name+" ×"+item.qty}).join(" · "):"Sin registros";y=canvasWrap(ctx,copy,90,y,1420,34,6)+20});
  y=canvasHeading(ctx,"Cómo se dio la historia · decisiones",y+10,accent);ctx.font="21px Arial";report.decisions.forEach(function(entry,i){ctx.fillStyle=accent;ctx.fillText(String(i+1).padStart(2,"0"),90,y);ctx.fillStyle="#e7e2d8";ctx.font="700 21px Arial";ctx.fillText("DÍA "+entry.day+" · "+String(entry.loc).toUpperCase(),145,y);ctx.font="21px Arial";ctx.fillStyle="#bdb9b0";y=canvasWrap(ctx,entry.choice+" → "+entry.result,145,y+30,1365,30,2)+30});ctx.fillStyle="#75d3d7";ctx.font="700 19px Arial";ctx.fillText("FIN DE LA DEMO · PARTIDA GUARDADA EN TU DISPOSITIVO",90,height-92);
  function trigger(url,revoke){var link=document.createElement("a");link.href=url;link.download="NeoSantiago-2130-"+report.tier.id+"-"+report.score+"-puntos.png";document.body.appendChild(link);link.click();link.remove();if(revoke)setTimeout(function(){URL.revokeObjectURL(url)},800)}
  if(canvas.toBlob)canvas.toBlob(function(blob){if(blob)trigger(URL.createObjectURL(blob),true)},"image/png");else trigger(canvas.toDataURL("image/png"),false)
}

function startCombat(config,choice){
  var ev=events[state.index];state.party.forEach(function(p){p.guard=0});battleState={config:config,choice:choice,phase:"combat",round:1,actor:0,target:0,looter:null,lootTaken:0,acted:{},skillUsed:{},xpEarned:{},levelUps:[],busy:false,feedback:[],criticalFeedback:[],log:["Contacto en "+ev.loc+"."]};
  state.party.forEach(function(p){var penalty=hungerPenalty(p);if(penalty)battleState.log.push(p.name+" entra fatigado por falta de energía: "+penalty+" a precisión.")});
  var rosters=config.encounters&&config.encounters.length?config.encounters:config.enemies?[config.enemies]:[],roster=rosters[rand(0,rosters.length-1)]||[];
  battleState.enemies=roster.map(function(id,i){var d=enemyDefs[id];return{id:id+"-"+i,type:id,lootGroup:d.lootGroup||id,name:d.name,role:d.role,hp:d.hp,maxHp:d.hp,attack:d.attack.slice(),accuracy:d.accuracy,def:d.def,armor:d.armor,mechanical:d.mechanical,lootMs:d.lootMs,xp:d.xp,stun:0,looted:false,searching:false,progress:0,loot:[]}});
  battleState.log.push("Contacto confirmado: "+battleState.enemies.map(function(e){return e.name}).join(", ")+".");setSceneAmbience("ambience-battle",AUDIO_CROSSFADE_MS);
  battleState.actor=firstAvailableActor();$("battle").dataset.day=ev.day;$("battleTitle").textContent=config.title;$("battleBrief").textContent=config.brief;$("battle").classList.remove("hidden");$("itemTray").classList.add("hidden");if(beginActorTurn())renderBattle()
}
function firstAvailableActor(){for(var i=0;i<state.party.length;i++)if(state.party[i].hp>0&&!battleState.acted[i])return i;return-1}
function livingEnemies(){return battleState.enemies.filter(function(e){return e.hp>0})}
function selectedEnemy(){var alive=livingEnemies();if(!alive.length)return null;var e=battleState.enemies[battleState.target];if(!e||e.hp<=0){battleState.target=battleState.enemies.indexOf(alive[0]);e=alive[0]}return e}
function beginActorTurn(){
  var p=state.party[battleState.actor];if(!p)return false;if(p.bleed>0){var before=p.hp,index=battleState.actor;p.hp=Math.max(0,p.hp-2);state.stats.damageTaken+=before-p.hp;recordHp("ally",index,before,p.hp,p.maxHp);p.bleed--;battleState.log.push(p.name+" pierde 2 HP por sangrado.");if(p.hp<=0){battleState.acted[index]=true;settleLethal(function(){var next=firstAvailableActor();if(next<0){enemyPhase();return}battleState.actor=next;if(beginActorTurn())renderBattle()});return false}}return true
}
function statusHtml(tags){return'<div class="status-tags">'+(tags.length?tags.map(function(x){return'<span class="tag '+x[1]+'">'+esc(x[0])+'</span>'}).join(""):'<span class="tag">Estable</span>')+'</div>'}
function recordHp(side,index,from,to,max,damageSfx){
  if(!battleState||from===to)return;if(to>from)playSfx(from<=0&&side==="ally"?"hp-revive":"hp-heal");else if(to<=0)playSfx(side==="ally"?"hp-ally-down":"hp-enemy-down");else if(damageSfx==="none"){}else if(damageSfx)playRandomSfx(damageSfx);else playSfx(side==="ally"?"hp-ally-damage":"hp-enemy-damage");var fx=battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0];if(fx){fx.to=to;fx.delta+=to-from}else battleState.feedback.push({side:side,index:index,from:from,to:to,max:max,delta:to-from})
}
function hpFeedback(side,index){return battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0]||null}
function criticalFeedback(index){return battleState.criticalFeedback.filter(function(x){return x.index===index})[0]||null}
function recordCritical(index,pIndex){playSfx("combat-critical");battleState.criticalFeedback.push({index:index,pIndex:pIndex});state.stats.criticals++;addPersonalXp(pIndex,4,"un golpe crítico")}
function hpBar(hp,max,fx){var to=Math.round(100*hp/max);if(!fx)return'<span style="width:'+to+'%"></span>';var from=Math.round(100*fx.from/fx.max);return'<span class="hp-shift" style="--hp-from:'+from+'%;--hp-to:'+to+'%;width:'+to+'%"></span>'}
function hpFloat(fx){if(!fx)return"";var heal=fx.delta>0,amount=Math.abs(fx.delta);return'<span class="hp-float '+(heal?'heal':'damage')+'">'+(heal?'+':'−')+amount+' HP</span>'}
function lethalFeedback(){return battleState&&battleState.feedback.some(function(x){return x.to<=0})}
function settleLethal(next){
  var current=battleState;if(!current)return;current.busy=true;renderBattle();setTimeout(function(){if(battleState!==current)return;var alive=livingEnemies(),target=current.enemies[current.target];if(alive.length&&(!target||target.hp<=0))current.target=current.enemies.indexOf(alive[0]);renderBattle();setTimeout(function(){if(battleState===current){current.busy=false;next()}},160)},680)
}
function allyUnitHtml(p,i,lootPhase){
  var need=xpNeeded(p),xp=Math.round(100*p.xp/need),tags=[],fx=hpFeedback("ally",i),falling=p.hp<=0&&fx,selected=lootPhase&&battleState.looter===i;
  var fatigue=hungerPenalty(p),weapon=weaponFor(p);if(p.hp<=0)tags.push(["Agotado","bad"]);if(p.bleed)tags.push(["Sangrado "+p.bleed,"bad"]);if(fatigue)tags.push([p.hunger<=10?"Energía crítica · −4":"Fatiga · precisión −2","bad"]);if(weaponAccuracyPenalty(p,weapon))tags.push(["Arma de fuego · precisión −2","bad"]);if(gear(p.equipment.head)&&gearDurability(p,"head")===0||gear(p.equipment.body)&&gearDurability(p,"body")===0)tags.push(["Equipo roto","bad"]);if(p.guard)tags.push(["Cobertura +"+p.guard,"good"]);if(!lootPhase&&i===battleState.actor&&p.hp>0)tags.push(["Actúa","good"]);if(lootPhase&&p.hp>0)tags.push([selected?"Saqueador":"Disponible",selected?"good":""]);
  var tag=lootPhase&&p.hp>0?"button":"article",attrs=lootPhase&&p.hp>0?' data-looter="'+i+'"':"";
  return'<'+tag+' class="unit '+(!lootPhase&&i===battleState.actor&&p.hp>0?"active ":"")+(lootPhase&&p.hp>0?"looter-choice ":"")+(selected?"looter-selected ":"")+(p.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal":"fx-damage"):"")+'"'+attrs+'>'+hpFloat(fx)+portraitArt("portraits/"+p.id+".webp",p.name,"ally-portrait-art")+'<div class="unit-info"><h3>'+esc(p.name)+'</h3><small>'+esc(p.role)+' · Lvl. '+p.level+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(p.hp,p.maxHp,fx)+'</div><b>'+p.hp+'/'+p.maxHp+'</b></div><div class="barline"><span>XP</span><div class="bar xp"><span style="width:'+xp+'%"></span></div><b>'+p.xp+'/'+need+'</b></div>'+statusHtml(tags)+'</div></'+tag+'>'
}
function enemyUnitHtml(e,i,lootPhase){
  var tags=[],fx=hpFeedback("enemy",i),critical=criticalFeedback(i),falling=e.hp<=0&&fx;if(e.stun)tags.push(["Aturdido","bad"]);if(e.armor)tags.push(["Armadura "+e.armor,""]);
  var enemyPortrait=portraitArt("portraits/"+e.type+".webp",e.name,e.type==="drone"?"enemy-drone-art":"");
  if(lootPhase){var stateClass=e.looted?"looted":e.searching?"":"lootable",overlay=e.looted?'<span class="loot-done">REGISTRADO</span>':e.searching?'<div class="corpse-search"><b>Registrando <span id="lootProgressText-'+i+'">'+e.progress+'%</span></b><div class="search-track"><span id="lootProgressBar-'+i+'" style="width:'+e.progress+'%"></span></div></div>':'<span class="loot-call">SAQUEAR</span>';return'<button class="unit corpse '+stateClass+'" '+(!e.looted&&!e.searching?'data-loot-enemy="'+i+'"':'disabled')+'>'+overlay+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>Cuerpo sin señales vitales</small><div class="barline"><span>HP</span><div class="bar"><span style="width:0%"></span></div><b>0/'+e.maxHp+'</b></div>'+statusHtml([[e.looted?"Registrado":"Botín posible",e.looted?"":"good"]])+'</div></button>'}
  return'<button class="unit '+(i===battleState.target&&!falling?"target ":"")+(e.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal ":"fx-damage "):"")+(critical?"critical-hit ":"")+'" data-target="'+i+'" '+(e.hp<=0?'disabled':'')+'>'+hpFloat(fx)+(critical?'<span class="critical-flash">GOLPE CRÍTICO<b>+4 XP · '+esc(state.party[critical.pIndex].name)+'</b></span>':"")+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>'+esc(e.role)+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(e.hp,e.maxHp,fx)+'</div><b>'+e.hp+'/'+e.maxHp+'</b></div>'+statusHtml(tags)+'</div></button>'
}
function combatItemUsable(p,kind,target){if(!p||bagQty(p,kind)<=0)return false;if(kind==="meds")return p.hp>0&&p.hp<p.maxHp;if(kind==="bandage")return p.hp>0&&(p.hp<p.maxHp||p.bleed>0);if(kind==="emp"||kind==="empMk2")return !!(target&&target.mechanical);return kind==="grenade"||kind==="grenadeMk2"}
function renderCombatItems(p,disabled){
  var target=selectedEnemy(),kinds=["meds","bandage","emp","empMk2","grenade","grenadeMk2"],carried=kinds.filter(function(kind){return bagQty(p,kind)>0});
  $("itemTray").innerHTML=carried.length?carried.map(function(kind){var d=gear(kind),usable=combatItemUsable(p,kind,target),art=d&&d.art?d.art:kind;return'<button class="item-action" data-combat-item="'+kind+'" '+(disabled||!usable?'disabled':'')+'>'+assetImage("items/"+art+".webp","","",34,34)+'<span>'+esc(d.name)+'</span><b>'+bagQty(p,kind)+'</b></button>'}).join(""):'<p class="empty">'+esc(p.name)+" no lleva objetos utilizables en su mochila.</p>";
  $("itemsToggle").disabled=disabled||!carried.length;Array.prototype.forEach.call(document.querySelectorAll("[data-combat-item]"),function(b){b.addEventListener("click",function(){useCombatItem(b.dataset.combatItem)})})
}
function renderBattle(){
  if(!battleState)return;var lootPhase=battleState.phase==="loot",actor=state.party[battleState.actor],disabled=lootPhase||battleState.busy||!actor||actor.hp<=0;
  $("battleRound").textContent=lootPhase?"Zona asegurada":"Ronda "+String(battleState.round).padStart(2,"0");$("turnLabel").textContent=lootPhase?(battleState.looter===null?"Elige quién saquea":"Saquea "+state.party[battleState.looter].name):(actor?"Turno de "+actor.name:"Respuesta enemiga");
  $("allyUnits").innerHTML=state.party.map(function(p,i){return allyUnitHtml(p,i,lootPhase)}).join("");
  $("enemyUnits").innerHTML=battleState.enemies.map(function(e,i){return enemyUnitHtml(e,i,lootPhase)}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-target]"),function(b){b.addEventListener("click",function(){battleState.target=Number(b.dataset.target);renderBattle()})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-looter]"),function(b){b.addEventListener("click",function(){selectLooter(Number(b.dataset.looter))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-loot-enemy]"),function(b){b.addEventListener("click",function(){beginLoot(Number(b.dataset.lootEnemy))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-action]"),function(b){var spent=b.dataset.action==="skill"&&battleState.skillUsed[battleState.actor];b.disabled=disabled||(b.dataset.action==="flee"&&!battleState.config.canFlee)||!!spent;b.title=spent?"Habilidad agotada en este combate":""});
  $("turnControls").classList.toggle("hidden",lootPhase);$("lootControls").classList.toggle("hidden",!lootPhase);$("finishLoot").disabled=lootPhase&&battleState.busy;if(lootPhase)$("lootInstruction").textContent=battleState.looter===null?"Selecciona un aliado con vida y después el cuerpo que registrará.":state.party[battleState.looter].name+" está listo. Puedes cambiar de saqueador antes de abrir otro cuerpo.";
  if(!lootPhase&&actor)renderCombatItems(actor,disabled);else $("itemsToggle").disabled=true;
  $("combatLog").innerHTML=battleState.log.slice(-7).map(function(x){return'<p>› '+esc(x)+'</p>'}).join("");$("combatLog").scrollTop=$("combatLog").scrollHeight;battleState.feedback=[];battleState.criticalFeedback=[]
}
function strike(enemy,damage,label,pIndex,critical){var dealt=Math.max(1,damage-enemy.armor),before=enemy.hp,index=battleState.enemies.indexOf(enemy);enemy.hp=Math.max(0,enemy.hp-dealt);var lethalHit=before>0&&enemy.hp<=0;state.stats.damageDealt+=before-enemy.hp;if(lethalHit&&!critical)playRandomSfx("combat-hit-normal");recordHp("enemy",index,before,enemy.hp,enemy.maxHp,critical||lethalHit?"none":"combat-hit-normal");if(before>0&&before-enemy.hp>0){state.stats.xpFromHits+=3;addPersonalXp(pIndex,3,"un impacto certero")}if(critical)recordCritical(index,pIndex);battleState.log.push(label+": "+dealt+" de daño a "+enemy.name+(critical?". Golpe crítico.":"."));if(before>0&&enemy.hp<=0){battleState.log.push(enemy.name+" queda fuera de combate.");state.stats.enemies++;addPersonalXp(pIndex,enemy.xp,"derribar a "+enemy.name);if(!livingEnemies().length)setSceneAmbience("ambience-battle-victory",AUDIO_CROSSFADE_MS)}}
function combatAction(type){
  if(!battleState||battleState.phase!=="combat"||battleState.busy)return;var p=state.party[battleState.actor],e=selectedEnemy();if(!p||p.hp<=0)return;
  if(type==="flee"){loseCombat(true);return}
  if(type==="defend"){state.stats.defends++;p.guard=8+p.level;battleState.log.push(p.name+" toma cobertura y prepara la respuesta.");endPlayerTurn();return}
  if(!e)return;
  if(type==="attack"){
    state.stats.attacks++;var w=weaponFor(p);if(w.ammo){if(!consumeFromBag(p,w.ammo)){battleState.log.push(p.name+" no tiene "+gear(w.ammo).name+" y cambia al cuchillo.");w=gear("knife")}else state.stats.shots++}var fatigue=hungerPenalty(p),training=weaponAccuracyPenalty(p,w),bonus=w.accuracy+p.level+fatigue+training+personalAccuracyBonus(p),roll=d20(),hit=roll+bonus>=e.def;if(hit){state.stats.hits++;var critical=roll===20,dmg=rand(w.damage[0],w.damage[1])+personalDamageBonus(p,e);if(critical)dmg=Math.floor(dmg*1.75);strike(e,dmg,p.name+" usa "+w.name,battleState.actor,critical)}else{state.stats.misses++;battleState.log.push(p.name+" falla con "+w.name+"."+(training?" Su falta de entrenamiento con armas de fuego reduce la precisión en 2.":"")+(fatigue?" La falta de energía reduce su precisión en "+Math.abs(fatigue)+".":""))}
  }else if(type==="skill"){
    if(battleState.skillUsed[battleState.actor]){toast("La habilidad ya fue utilizada en este combate");return}
    if(p.id==="sara"&&!state.party.some(function(a){return a.hp>0&&(a.hp<a.maxHp||a.bleed>0)})&&!(hasSkill(p,"sara_reanimate")&&state.party.some(function(a){return a.hp<=0}))){toast("Nadie necesita atención médica");return}
    battleState.skillUsed[battleState.actor]=true;state.stats.skillsUsed++;
    if(p.id==="sara"){var downed=hasSkill(p,"sara_reanimate")?state.party.filter(function(a){return a.hp<=0})[0]:null;if(downed){var reviveIndex=state.party.indexOf(downed);downed.hp=Math.min(downed.maxHp,14);downed.hunger=Math.max(downed.hunger,20);downed.bleed=0;state.stats.revives++;recordHealing(downed.hp,false);recordHp("ally",reviveIndex,0,downed.hp,downed.maxHp);battleState.log.push("Sara activa Pulso de retorno: "+downed.name+" vuelve con "+downed.hp+" HP.")}else{var target=state.party.filter(function(a){return a.hp>0}).sort(function(a,b){return a.hp/a.maxHp-b.hp/b.maxHp})[0],heal=12+p.level*2+(hasSkill(p,"sara_fieldcare")?4:0),before=target.hp;target.hp=Math.min(target.maxHp,target.hp+heal);target.bleed=0;if(hasSkill(p,"sara_triage"))state.party.forEach(function(a){a.bleed=0});recordHealing(target.hp-before,false);recordHp("ally",state.party.indexOf(target),before,target.hp,target.maxHp);battleState.log.push("Sara atiende a "+target.name+": +"+(target.hp-before)+" HP"+(hasSkill(p,"sara_triage")?" y estabiliza el sangrado del grupo.":"."))}}
    else if(p.id==="elias"&&e.mechanical&&bagQty(p,"battery")>0){state.stats.attacks++;state.stats.hits++;consumeFromBag(p,"battery");addStatItem("itemsUsed","battery",1);e.stun=hasSkill(p,"elias_overcharge")?2:1;strike(e,(hasSkill(p,"elias_overcharge")?24:16)+p.level*2,"Elías descarga una batería EMP",battleState.actor,false)}
    else if(p.id==="elias"){state.stats.attacks++;var techFatigue=hungerPenalty(p),techRoll=d20(),techCritical=techRoll===20;if(techRoll+3+p.level+techFatigue>=e.def){state.stats.hits++;strike(e,Math.floor((10+p.level)*(techCritical?1.75:1)),"Elías encuentra un punto débil",battleState.actor,techCritical)}else{state.stats.misses++;battleState.log.push("Elías no logra abrir la defensa de "+e.name+"."+(techFatigue?" La fatiga afecta su pulso.":""))}}
    else{state.stats.attacks++;var precision=weaponFor(p),hasAmmo=!precision.ammo||consumeFromBag(p,precision.ammo),skillWeapon=hasAmmo?precision:gear("knife"),skillFatigue=hungerPenalty(p),skillRoll=d20(),skillCritical=skillRoll===20,skillBonus=skillWeapon.accuracy+p.level+2+skillFatigue+personalAccuracyBonus(p),skillDamage=(hasAmmo?14:8)+p.level+rand(0,4)+personalDamageBonus(p,e);if(precision.ammo&&hasAmmo)state.stats.shots++;if(skillRoll+skillBonus>=e.def){state.stats.hits++;strike(e,Math.floor(skillDamage*(skillCritical?1.75:1)),hasAmmo?"Noa ejecuta un disparo preciso con "+precision.name:"Noa cambia al cuchillo",battleState.actor,skillCritical)}else{state.stats.misses++;battleState.log.push("Noa falla su ataque preciso contra "+e.name+"."+(skillFatigue?" La fatiga desvía su ataque.":""))}}
  }
  if(lethalFeedback()){settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});return}endPlayerTurn()
}
function endPlayerTurn(){
  if(!battleState)return;$("itemTray").classList.add("hidden");battleState.acted[battleState.actor]=true;var next=firstAvailableActor();if(next>=0){battleState.actor=next;if(beginActorTurn())renderBattle();return}enemyPhase()
}
function enemyPhase(){
  if(!battleState)return;battleState.busy=true;livingEnemies().forEach(function(e){
    if(e.stun){e.stun=Math.max(0,e.stun-1);battleState.log.push(e.name+" pierde el turno por la descarga EMP.");return}
    var live=state.party.filter(function(p){return p.hp>0});if(!live.length)return;var weakest=live.slice().sort(function(a,b){return a.hp/a.maxHp-b.hp/b.maxHp})[0],target=random()<.3?weakest:live[rand(0,live.length-1)],index=state.party.indexOf(target),attackRoll=d20(),hit=attackRoll+(e.accuracy||0)>=11;if(!hit){battleState.log.push(e.name+" falla su ataque contra "+target.name+".");return}var before=target.hp,raw=rand(e.attack[0],e.attack[1])+(attackRoll===20?3:0),cover=target.guard||0,armor=gearDefense(target),armorBlocked=Math.min(raw,armor),coverBlocked=Math.min(cover,Math.max(0,raw-armorBlocked)),blocked=armorBlocked+coverBlocked,damage=Math.max(0,raw-blocked);target.guard=Math.max(0,cover-coverBlocked);target.hp=Math.max(0,target.hp-damage);var lethalAllyHit=before>0&&target.hp<=0;state.stats.damageTaken+=before-target.hp;if(lethalAllyHit&&attackRoll!==20)playRandomSfx("combat-enemy-hit-normal");recordHp("ally",index,before,target.hp,target.maxHp,attackRoll===20||lethalAllyHit?"none":"combat-enemy-hit-normal");if(attackRoll===20)playSfx("combat-critical");battleState.log.push(e.name+" ataca a "+target.name+": "+damage+" de daño recibido."+(attackRoll===20?" Golpe crítico.":""));if(blocked)battleState.log.push(target.name+" bloquea "+blocked+" entre cobertura y equipo.");if(armor>0&&damage>0)damageArmor(target,attackRoll===20?2:1);if(e.lootGroup==="merodeador"&&damage>=4&&target.hp>0&&random()<.24){target.bleed=2;battleState.log.push(target.name+" comienza a sangrar.")}
  });
  var continueRound=function(){if(!state.party.some(function(p){return p.hp>0})){loseCombat(false);return}battleState.round++;battleState.acted={};battleState.actor=firstAvailableActor();battleState.busy=false;if(beginActorTurn())renderBattle()};if(lethalFeedback()){settleLethal(continueRound);return}continueRound()
}
function beginLootPhase(){
  if(!battleState)return;battleState.phase="loot";setSceneAmbience("ambience-battle-victory",AUDIO_CROSSFADE_MS);battleState.busy=false;battleState.looter=null;battleState.feedback=[];battleState.log.push("No quedan hostiles. Selecciona quién registrará los cuerpos.");$("itemTray").classList.add("hidden");renderBattle()
}
function selectLooter(i){if(!battleState||battleState.phase!=="loot"||battleState.busy||!state.party[i]||state.party[i].hp<=0)return;battleState.looter=i;battleState.log.push(state.party[i].name+" se prepara para saquear.");renderBattle()}
function addLootDrop(list,id,qty){var found=list.filter(function(x){return x.id===id})[0];if(found)found.qty+=qty;else list.push({id:id,qty:qty,status:"pending"})}
function generateLoot(enemy){
  var group=enemy.lootGroup||enemy.type,out=[];if(group==="merodeador"){addLootDrop(out,"cloth",rand(1,2));addLootDrop(out,"scrap",rand(1,2));if(random()<.36)addLootDrop(out,"ammo9",rand(1,2));if(random()<.12)addLootDrop(out,"shell12",1);if(random()<.24)addLootDrop(out,"food",1);if(random()<.14)addLootDrop(out,"bandage",1);if(random()<.10)addLootDrop(out,"knife",1);if(random()<.06)addLootDrop(out,"crowbar",1);if(random()<.04)addLootDrop(out,"revolver",1);if(random()<.025){addLootDrop(out,"shotgun12",1);addLootDrop(out,"shell12",rand(1,2))}if(random()<.018)addLootDrop(out,"grenade",1)}
  else if(group==="drone"){addLootDrop(out,"electronics",rand(1,2));addLootDrop(out,"scrap",1);if(random()<.38)addLootDrop(out,"pulseCore",1);if(random()<.22)addLootDrop(out,"battery",1)}
  else{addLootDrop(out,"scrap",rand(1,2));addLootDrop(out,"electronics",1);if(random()<.20)addLootDrop(out,"pulseCore",1);if(random()<.34)addLootDrop(out,"ammo556",rand(1,2));if(random()<.18)addLootDrop(out,"ammo9",rand(1,2));if(random()<.14)addLootDrop(out,"shell12",1);if(random()<.16)addLootDrop(out,random()<.25?"meds":"bandage",1);if(random()<.08)addLootDrop(out,random()<.45?"pistol9":random()<.75?"rifle556":"shotgun12",1);if(random()<.045)addLootDrop(out,random()<.5?"helmetRiot":"vestTactical",1);if(random()<.02)addLootDrop(out,"grenade",1)}return out
}
function beginLoot(i){
  if(!battleState||battleState.phase!=="loot"||battleState.busy)return;if(battleState.looter===null){toast("Primero selecciona quién saquea");return}var e=battleState.enemies[i];if(!e||e.looted||e.searching)return;
  e.searching=true;e.progress=0;battleState.busy=true;battleState.log.push(state.party[battleState.looter].name+" registra a "+e.name+".");renderBattle();startLoopSfx("loot-loop",220);var step=Math.max(2,Math.round(10000/e.lootMs));clearInterval(lootInterval);lootInterval=setInterval(function(){if(!battleState||battleState.phase!=="loot")return;e.progress=Math.min(96,e.progress+step);var bar=$("lootProgressBar-"+i),label=$("lootProgressText-"+i);if(bar)bar.style.width=e.progress+"%";if(label)label.textContent=e.progress+"%"},100);
  setTimeout(function(){if(!battleState||battleState.phase!=="loot"){stopLoopSfx("loot-loop",160);return}clearInterval(lootInterval);stopLoopSfx("loot-loop",180);e.progress=100;e.searching=false;e.looted=true;e.loot=generateLoot(e);battleState.lootMessage="";battleState.busy=false;playSfx("loot-found");renderBattle();renderLootModal(i)},e.lootMs)
}
function pendingLootUnits(loot){return(loot||[]).reduce(function(sum,drop){return sum+(drop.status==="pending"?Math.max(1,Number(drop.qty)||1):0)},0)}
function canTakeAllLoot(p,loot){
  var pending=pendingLootUnits(loot);return !!(p&&pending>0&&pending<=bagFree(p))
}
function renderLootModal(enemyIndex){
  if(!battleState)return;var e=battleState.enemies[enemyIndex],p=state.party[battleState.looter],used=bagUsed(p),capacity=bagCapacity(p),free=bagFree(p),percent=Math.round(100*used/capacity),pending=pendingLootUnits(e.loot);battleState.openLoot=enemyIndex;$("lootTitle").textContent=e.name+" · botín";$("lootOwner").textContent=p.name+" registra el cuerpo";$("lootCapacityText").textContent=used+" / "+capacity+" espacios ocupados";$("lootCapacityPercent").textContent=percent+"%";$("lootCapacityBar").style.width=percent+"%";$("lootCapacity").classList.toggle("full",free===0);$("lootGuidance").textContent=pending>free?"No cabe todo el botín. Selecciona cada uno de los objetos que quieres llevar.":"Selecciona los objetos que quieres llevar o recoge todo el botín disponible.";$("lootMessage").textContent=battleState.lootMessage||"";$("lootMessage").classList.toggle("hidden",!battleState.lootMessage);
  $("lootItems").innerHTML=e.loot.map(function(drop,i){var d=gear(drop.id),done=drop.status!=="pending",units=Math.max(1,Number(drop.qty)||1);return'<article class="loot-drop '+(done?drop.status:"")+'">'+itemArt(drop.id,d&&d.name)+'<span class="loot-drop-copy"><strong>'+esc((d?d.name:drop.id)+(drop.qty>1?" ×"+drop.qty:""))+'</strong><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>Ocupa '+units+' espacio'+(units===1?'':'s')+'</em></span><div class="loot-buttons"><button data-take-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="taken"?"Tomado":"Tomar")+'</button><button class="discard" data-discard-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="discarded"?"Descartado":"Descartar")+'</button></div></article>'}).join("");
  $("takeAllLoot").textContent="Saquear todo · "+pending+" espacios";$("takeAllLoot").classList.toggle("hidden",pending===0);Array.prototype.forEach.call(document.querySelectorAll("[data-take-loot]"),function(b){b.addEventListener("click",function(){takeLoot(Number(b.dataset.takeLoot))})});Array.prototype.forEach.call(document.querySelectorAll("[data-discard-loot]"),function(b){b.addEventListener("click",function(){discardLoot(Number(b.dataset.discardLoot))})});$("lootModal").classList.remove("hidden");$("closeLoot").focus()
}
function takeLoot(i){if(!battleState)return;var e=battleState.enemies[battleState.openLoot],drop=e&&e.loot[i],p=state.party[battleState.looter],free=bagFree(p),units=drop?Math.max(1,Number(drop.qty)||1):0,d=drop&&gear(drop.id);if(!drop||drop.status!=="pending")return;if(free===0){battleState.lootMessage="La mochila está llena. No puedes recoger más botín.";renderLootModal(battleState.openLoot);return}if(units>free){battleState.lootMessage="No caben las "+units+" unidades de "+(d?d.name:drop.id)+". Solo "+(free===1?"queda 1 espacio libre":"quedan "+free+" espacios libres")+".";renderLootModal(battleState.openLoot);return}if(!addToBag(p,drop.id,units)){battleState.lootMessage="La mochila está llena. No puedes recoger más botín.";renderLootModal(battleState.openLoot);return}drop.status="taken";battleState.lootMessage="";recordLoot(drop.id,units);battleState.lootTaken+=units;renderLootModal(battleState.openLoot)}
function takeAllLoot(){
  if(!battleState)return;var e=battleState.enemies[battleState.openLoot],p=state.party[battleState.looter];if(!e)return;var pending=pendingLootUnits(e.loot),free=bagFree(p);if(!canTakeAllLoot(p,e.loot)){battleState.lootMessage=free===0?"La mochila está llena. No puedes saquear todo.":"No se puede saquear todo: el botín ocupa "+pending+" espacios y solo "+(free===1?"queda 1 espacio libre":"quedan "+free+" espacios libres")+". Selecciona cada uno de los objetos que quieres llevar.";renderLootModal(battleState.openLoot);return}
  var taken=0;e.loot.forEach(function(drop){if(drop.status!=="pending")return;var units=Math.max(1,Number(drop.qty)||1);addToBag(p,drop.id,units);drop.status="taken";recordLoot(drop.id,units);battleState.lootTaken+=units;taken+=units});battleState.lootMessage="";renderLootModal(battleState.openLoot);toast(p.name+" guarda todo el botín · "+taken+" unidades")
}
function discardLoot(i){if(!battleState)return;var e=battleState.enemies[battleState.openLoot],drop=e&&e.loot[i];if(!drop||drop.status!=="pending")return;drop.status="discarded";battleState.lootMessage="";renderLootModal(battleState.openLoot)}
function closeLootModal(){
  if(!battleState)return;var e=battleState.enemies[battleState.openLoot];if(e)e.loot.forEach(function(x){if(x.status==="pending")x.status="discarded"});$("lootModal").classList.add("hidden");battleState.openLoot=null;if(battleState.enemies.every(function(x){return x.looted}))finishLooting();else renderBattle()
}
function finishLooting(){if(!battleState||battleState.phase!=="loot"||battleState.busy)return;clearInterval(lootInterval);stopLoopSfx("loot-loop",160);$("lootModal").classList.add("hidden");winCombat()}
function winCombat(){
  stopLoopSfx("loot-loop",160);
  var b=battleState,choice=b.choice,out=choice.victory||choice;state.stats.battles++;state.stats.wins++;if(state.party.every(function(p){return p.hp>0}))state.stats.fullSquadWins++;state.party.forEach(function(p,i){if(p.hp>0){state.stats.xpFromVictories+=5;addPersonalXp(i,5,"sobrevivir al combate")}});awardFactionPoints(1,"combate ganado");var xpSummary=state.party.map(function(p,i){return(b.xpEarned[i]||0)>0?p.name+" +"+b.xpEarned[i]:""}).filter(Boolean).join(" · "),extra=[["Victoria","Hostiles neutralizados"],["Puntos de facción","+1 · combate ganado"],["XP personal",xpSummary||"Sin XP de combate"],["Botín",b.lootTaken?b.lootTaken+" objetos":"Sin recoger"]];if(b.levelUps.length)extra.push(["Subida de nivel",b.levelUps.join(", ")]);battleState=null;setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);$("battle").classList.add("hidden");$("lootModal").classList.add("hidden");completeChoice(choice,out,null,null,extra)
}
function loseCombat(fled){
  stopLoopSfx("loot-loop",160);
  if(!battleState)return;var moraleCost=fled?8:12,threatCost=fled?4:6;state.stats.battles++;state.stats.retreats++;state.morale=clamp(state.morale-moraleCost,0,100);state.threat=clamp(state.threat+threatCost,0,100);state.party.forEach(function(p){p.guard=0;p.bleed=0});battleState=null;pending=null;$("battle").classList.add("hidden");openRefuge(fled?"fled":"exhausted");state.refuge.message=fled?"Retirarse cuesta "+moraleCost+" de moral y aumenta "+threatCost+" la amenaza. La situación sigue pendiente.":"El grupo completo quedó agotado: moral −"+moraleCost+" y amenaza +"+threatCost+". Descansa o utiliza medicina antes de regresar.";renderRefuge();save()
}
function useCombatItem(kind){
  if(!battleState||battleState.phase!=="combat"||battleState.busy)return;var p=state.party[battleState.actor],e=selectedEnemy(),before;if(!combatItemUsable(p,kind,e)){toast(p.name+" no puede usar ese objeto ahora");return}addStatItem("itemsUsed",kind,1);if(kind==="meds"){consumeFromBag(p,"meds");before=p.hp;p.hp=Math.min(p.maxHp,p.hp+26);recordHealing(p.hp-before,true);recordHp("ally",battleState.actor,before,p.hp,p.maxHp);battleState.log.push(p.name+" usa su medicina: +"+(p.hp-before)+" HP.")}
  else if(kind==="bandage"){consumeFromBag(p,"bandage");before=p.hp;p.hp=Math.min(p.maxHp,p.hp+14);recordHealing(p.hp-before,true);recordHp("ally",battleState.actor,before,p.hp,p.maxHp);p.bleed=0;battleState.log.push(p.name+" aplica su vendaje: +"+(p.hp-before)+" HP y sangrado detenido.")}
  else if(kind==="emp"||kind==="empMk2"){consumeFromBag(p,kind);e.stun=kind==="empMk2"?2:1;strike(e,kind==="empMk2"?34:22,p.name+" activa "+gear(kind).name,battleState.actor,false)}
  else if(kind==="grenade"||kind==="grenadeMk2"){consumeFromBag(p,kind);state.threat=clamp(state.threat+(kind==="grenadeMk2"?7:5),0,100);livingEnemies().forEach(function(x){strike(x,kind==="grenadeMk2"?22:14,p.name+" lanza "+gear(kind).name,battleState.actor,false)});battleState.log.push("El estruendo aumenta la amenaza.")}
  else return;$("itemTray").classList.add("hidden");if(lethalFeedback()){settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});return}endPlayerTurn()
}

function render(){
  var ev=events[state.index];$("day").textContent="Día "+String(ev.day).padStart(2,"0")+" / 03";$("time").textContent=ev.time;$("threatValue").textContent=state.threat+"%";$("threatBar").style.width=state.threat+"%";$("stage").dataset.day=ev.day;$("chapter").textContent=chapters[ev.day];$("location").textContent=ev.loc;$("progress").textContent="Situación "+(state.index+1)+" de "+events.length;$("eventType").textContent=ev.type;$("eventTitle").textContent=ev.title;$("eventText").textContent=ev.text;
  $("choices").innerHTML=ev.choices.map(function(c,i){var why=reason(c);return'<button class="choice" data-choice="'+i+'" '+(why?"disabled":"")+'><span class="num">'+(i+1)+'</span><span><strong>'+esc(c.label)+"</strong><small>"+esc(why||c.hint)+"</small></span><span class=\"cost\">"+esc(c.cost||"")+"</span></button>"}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-choice]"),function(b){b.addEventListener("click",function(){choose(Number(b.dataset.choice))})});renderMini()
}
function renderMini(){
  $("groupMini").innerHTML=state.party.map(function(p,i){var head=gear(p.equipment.head),body=gear(p.equipment.body),pack=gear(p.equipment.backpack),portrait="portraits/"+p.id+".webp",ready=hasUnspentSkill(p);return'<button class="member '+(ready?'skill-ready':'')+'" data-profile="'+i+'"><span class="avatar">'+assetImage(portrait,p.name,"",590,885)+'</span><span><strong>'+esc(p.name)+"</strong><small>"+esc(p.role)+" · Lvl. "+p.level+" · Energía "+p.hunger+'%</small>'+(ready?'<span class="skill-ready-copy">Habilidad disponible</span>':'')+'</span><em>'+p.hp+"/"+p.maxHp+' HP</em><span class="ally-peek"><span class="peek-photo">'+assetImage(portrait,p.name,"",590,885)+'</span><span class="peek-data"><b>'+esc(weaponLabel(p))+'</b><span>'+esc((head?head.name:"Sin casco")+" · "+(body?body.name:"Sin chaleco")+" · "+(pack?bagUsed(p)+"/"+bagCapacity(p)+" espacios":"Sin mochila"))+'</span></span></span></button>'}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile]"),function(b){b.addEventListener("click",function(){openProfile(Number(b.dataset.profile))})});
  var r=[["Alimento",stockCount("food")],["Agua",stockCount("water")],["Medicina",stockCount("meds")],["Munición",ammoTotal()],["Tela",stockCount("cloth")],["Batería",stockCount("battery")],["Fichas",state.credits],["Puntos facción",state.factionPoints],["Moral",state.morale+"%"]],main=missionDefs[0],progress=missionProgress(main),percent=Math.round(100*progress/main.target),openMissions=missionDefs.filter(function(def){return !def.main&&missionProgress(def)<def.target}).length;
  $("resourceMini").innerHTML=r.map(function(x){return'<div class="resource"><span>'+x[0]+"</span><b>"+x[1]+"</b></div>"}).join("");$("missionMini").innerHTML='<strong>'+esc(main.title)+'</strong><p>'+esc(missionDescription(main))+'</p><div class="mission-track"><span style="width:'+percent+'%"></span></div><small><span>'+progress+' / '+main.target+'</span><span>'+percent+'%</span></small>';$("missionCount").textContent=openMissions;$("archiveCount").textContent=state.docs.length
}
function openArchive(id,opener){
  var summary=archives[id],doc=archiveTexts[id];if(!summary||!doc)return;archiveOpener=opener||null;$("archiveDocClass").textContent=doc.classification;$("archiveDocTitle").textContent=summary[0];$("archiveDocSource").textContent=doc.source;$("archiveDocDate").textContent=doc.date;$("archiveDocSummary").textContent=summary[1];$("archiveDocBody").innerHTML=doc.body.map(function(p){return"<p>"+esc(p)+"</p>"}).join("");$("archiveModal").classList.remove("hidden");$("archiveReaderScroll").scrollTop=0;$("closeArchive").focus()
}
function closeArchive(){if($("archiveModal").classList.contains("hidden"))return;$("archiveModal").classList.add("hidden");if(archiveOpener&&archiveOpener.focus)archiveOpener.focus();archiveOpener=null}
function switchWorldLore(section){if(!loreSections[section])section="history";Object.keys(loreSections).forEach(function(key){var ids=loreSections[key],active=key===section,tab=$(ids[0]),panel=$(ids[1]);tab.classList.toggle("active",active);tab.setAttribute("aria-selected",active?"true":"false");panel.classList.toggle("hidden",!active)});$("worldLoreScroll").scrollTop=0}
function switchFaction(section){if(!factionSections[section])section="rotos";Object.keys(factionSections).forEach(function(key){var ids=factionSections[key],active=key===section,tab=$(ids[0]),panel=$(ids[1]);tab.classList.toggle("active",active);tab.setAttribute("aria-selected",active?"true":"false");panel.classList.toggle("hidden",!active)});$("worldLoreScroll").scrollTop=0}
function openWorldLore(opener){worldLoreOpener=opener||null;closePanel();switchWorldLore("history");switchFaction("rotos");$("worldLoreModal").classList.remove("hidden");$("closeWorldLore").focus()}
function closeWorldLore(){if($("worldLoreModal").classList.contains("hidden"))return;$("worldLoreModal").classList.add("hidden");if(worldLoreOpener&&worldLoreOpener.focus)worldLoreOpener.focus();worldLoreOpener=null}
function openPanel(type){
  var list=[],title,html="";if(type==="missions"){title="Misiones";html=missionDefs.map(missionCardHtml).join("")}
  else if(type==="archive"){title="Archivo";html='<article class="drawer-item archive-entry world-entry"><span class="archive-entry-copy"><strong>Archivo de mundo: NeoSantiago 2130</strong><small>Historia, vida bajo tierra, Gobernanza, UNO, facciones, tácticas y extractos reales de La ciudad de los rotos.</small></span><button data-open-world-lore>Conocer la historia</button></article>'+(state.docs.length?state.docs.map(function(id){var summary=archives[id],doc=archiveTexts[id];if(!summary||!doc)return"";return'<article class="drawer-item archive-entry"><span class="archive-entry-copy"><strong>'+esc(summary[0])+'</strong><small>'+esc(summary[1])+'</small></span><button data-open-archive="'+esc(id)+'">Leer archivo</button></article>'}).join(""):'<p class="empty">Todavía no has recuperado archivos. Explora, investiga y elige rutas que revelen información.</p>')}
  else if(type==="group"){title="Grupo";state.party.forEach(function(p){list.push([p.name+" · "+p.role+" · Lvl. "+p.level,p.hp+"/"+p.maxHp+" HP · "+p.xp+"/"+xpNeeded(p)+" XP · Energía "+p.hunger+"% · Resistencia al gasto "+energyResist(p)+". "+weaponLabel(p)+". Habilidades "+p.skills.length+"/6."])});list.push(["Puntos de facción: "+state.factionPoints,"Se comparten entre los tres perfiles; invertirlos define la especialización de esta partida."]);list.push(["Estado colectivo: "+state.morale+"%",state.morale>=60?"El grupo todavía confía en sus decisiones compartidas.":"Las decisiones están erosionando la confianza."])}
  else{title="Historial";state.history.slice().reverse().forEach(function(x){list.push(["Día "+x.day+" · "+x.loc,x.choice+". "+x.result+"."])})}
  if(type!=="missions"&&type!=="archive")html=list.length?list.map(function(x){return'<article class="drawer-item"><strong>'+esc(x[0])+"</strong><p>"+esc(x[1])+"</p></article>"}).join(""):'<p class="empty">Todavía no hay registros en esta sección.</p>';
  $("drawerTitle").textContent=title;$("drawerContent").innerHTML=html;Array.prototype.forEach.call(document.querySelectorAll("[data-open-archive]"),function(b){b.addEventListener("click",function(){openArchive(b.dataset.openArchive,b)})});Array.prototype.forEach.call(document.querySelectorAll("[data-open-world-lore]"),function(b){b.addEventListener("click",function(){openWorldLore($("archiveNav"))})});$("shade").classList.remove("hidden");$("drawer").classList.remove("hidden");$("closeDrawer").focus()
}
function closePanel(){$("shade").classList.add("hidden");$("drawer").classList.add("hidden")}
function toast(msg){clearTimeout(toastTimer);$("toast").textContent=msg;$("toast").classList.remove("hidden");toastTimer=setTimeout(function(){$("toast").classList.add("hidden")},1800)}
function showGameIntro(step){introStep=step===1?1:0;$("introLore").classList.toggle("hidden",introStep!==0);$("introRules").classList.toggle("hidden",introStep!==1);$("introTrackWorld").classList.toggle("active",introStep===0);$("introTrackRules").classList.toggle("active",introStep===1);$("introTrackRefuge").classList.remove("active");$("gameIntro").classList.remove("hidden");(introStep?$("introBack"):$("introNext")).focus()}
function completeIntro(){if(state.introCompleted)return;state.introCompleted=true;$("introTrackRules").classList.remove("active");$("introTrackRefuge").classList.add("active");$("gameIntro").classList.add("hidden");save();openRefuge("start");toast("Mara espera en el Andén 4")}
function showTitleScreen(){
  $("start").classList.add("hidden");$("titleScreen").classList.remove("hidden");$("titleScreen").classList.remove("leaving");$("enterTitle").focus()
}
function enterTitleScreen(){
  var title=$("titleScreen");if(title.classList.contains("hidden")||title.classList.contains("leaving"))return;
  title.classList.add("leaving");setTimeout(function(){title.classList.add("hidden");title.classList.remove("leaving");$("start").classList.remove("hidden");(!$("continueGame").classList.contains("hidden")?$("continueGame"):$("newGame")).focus()},560)
}
function newGame(){state=fresh();pending=null;battleState=null;archiveOpener=null;worldLoreOpener=null;clearInterval(lootInterval);["titleScreen","start","gameIntro","worldLoreModal","battle","final","summary","refuge","profileModal","transferModal","lootModal","logisticsModal","archiveModal"].forEach(function(id){$(id).classList.add("hidden")});render();save();showGameIntro(0)}
function continueGame(){if(!load()){newGame();return}$("titleScreen").classList.add("hidden");$("start").classList.add("hidden");render();if(!state.introCompleted)showGameIntro(0);else if(state.finished&&state.ending){if(state.summarySeen)showRunSummary();else finish(state.ending)}else if(state.refuge.active)openRefuge(state.refuge.reason,true);else toast("Partida restaurada")}

loadAudioRoutes();
installAudioHooks();
$("enterTitle").addEventListener("click",enterTitleScreen);$("newGame").addEventListener("click",newGame);$("continueGame").addEventListener("click",continueGame);$("openWorldLore").addEventListener("click",function(){openWorldLore($("openWorldLore"))});$("closeWorldLore").addEventListener("click",closeWorldLore);$("closeWorldLoreBottom").addEventListener("click",closeWorldLore);Object.keys(loreSections).forEach(function(key){$(loreSections[key][0]).addEventListener("click",function(){switchWorldLore(key)})});Object.keys(factionSections).forEach(function(key){$(factionSections[key][0]).addEventListener("click",function(){switchFaction(key)})});$("introNext").addEventListener("click",function(){showGameIntro(1)});$("introBack").addEventListener("click",function(){showGameIntro(0)});$("introStart").addEventListener("click",completeIntro);$("advance").addEventListener("click",advance);$("nextDay").addEventListener("click",function(){$("night").classList.add("hidden");if(state.morale<=0)openRefuge("morale");else{save();render()}});$("finalContinue").addEventListener("click",showRunSummary);$("downloadPng").addEventListener("click",downloadResultPng);$("restart").addEventListener("click",newGame);$("npcTabMara").addEventListener("click",function(){switchRefugeNpc("mara")});$("npcTabArmorer").addEventListener("click",function(){switchRefugeNpc("armorer")});$("starterKit").addEventListener("click",acceptStarterKit);$("refugeRest").addEventListener("click",restAtRefuge);$("refugeRejoin").addEventListener("click",rejoinAtRefuge);$("leaveRefuge").addEventListener("click",leaveRefuge);$("closeLogistics").addEventListener("click",closeLogisticsBriefing);$("backToRefuge").addEventListener("click",closeLogisticsBriefing);$("confirmLogistics").addEventListener("click",confirmLeaveRefuge);$("logisticsModal").addEventListener("click",function(e){if(e.target===$("logisticsModal"))closeLogisticsBriefing()});$("closeDrawer").addEventListener("click",closePanel);$("shade").addEventListener("click",closePanel);$("closeProfile").addEventListener("click",closeProfile);$("closeTransfer").addEventListener("click",closeTransferModal);$("transferModal").addEventListener("click",function(e){if(e.target===$("transferModal"))closeTransferModal()});$("closeLoot").addEventListener("click",closeLootModal);$("closeArchive").addEventListener("click",closeArchive);$("closeArchiveBottom").addEventListener("click",closeArchive);$("takeAllLoot").addEventListener("click",takeAllLoot);$("finishLoot").addEventListener("click",finishLooting);$("itemsToggle").addEventListener("click",function(){if(battleState&&battleState.phase==="combat")$("itemTray").classList.toggle("hidden")});
Array.prototype.forEach.call(document.querySelectorAll("[data-panel]"),function(b){b.addEventListener("click",function(){openPanel(b.dataset.panel)})});
Array.prototype.forEach.call(document.querySelectorAll("[data-action]"),function(b){b.addEventListener("click",function(){combatAction(b.dataset.action)})});
Array.prototype.forEach.call(document.querySelectorAll("[data-combat-item]"),function(b){b.addEventListener("click",function(){useCombatItem(b.dataset.combatItem)})});
document.addEventListener("keydown",function(e){if(!$("titleScreen").classList.contains("hidden")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();enterTitleScreen();return}if(e.key==="Escape"&&!$("worldLoreModal").classList.contains("hidden")){closeWorldLore();return}if(e.key==="Escape"&&!$("archiveModal").classList.contains("hidden")){closeArchive();return}if(e.key==="Escape"&&!$("transferModal").classList.contains("hidden")){closeTransferModal();return}if(e.key==="Escape"&&!$("logisticsModal").classList.contains("hidden")){closeLogisticsBriefing();return}if(e.key==="Escape"&&!battleState){closePanel();closeProfile()}if(battleState||!$("titleScreen").classList.contains("hidden")||!$("start").classList.contains("hidden")||!$("gameIntro").classList.contains("hidden")||!$("worldLoreModal").classList.contains("hidden")||!$("result").classList.contains("hidden")||!$("night").classList.contains("hidden")||!$("final").classList.contains("hidden")||!$("summary").classList.contains("hidden")||!$("refuge").classList.contains("hidden")||!$("profileModal").classList.contains("hidden")||!$("logisticsModal").classList.contains("hidden")||!$("archiveModal").classList.contains("hidden"))return;if(["1","2","3"].indexOf(e.key)>=0)choose(Number(e.key)-1)});
try{var saved=JSON.parse(localStorage.getItem(KEY));if(saved&&saved.version===3)$("continueGame").classList.remove("hidden")}catch{}
render();
showTitleScreen();
