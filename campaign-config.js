"use strict";
// V0.2 equipment, progression and economy configuration. Values and synchronous globals are preserved.
var equipmentDefs={
  knife:{name:"Cuchillo de servicio",kind:"weapon",slot:"weapon",category:"melee",damage:[7,10],accuracy:3,desc:"Arma silenciosa; no consume munición."},
  crowbar:{name:"Barra de rescate",kind:"weapon",slot:"weapon",category:"melee",damage:[8,12],accuracy:2,desc:"Herramienta pesada adaptada al combate."},
  pipe:{name:"Fierro de andén",kind:"weapon",slot:"weapon",category:"melee",damage:[7,11],accuracy:1,art:"crowbar",desc:"Tubo recuperado de una baranda del metro."},
  machete:{name:"Machete de servicio",kind:"weapon",slot:"weapon",category:"melee",damage:[10,14],accuracy:1,art:"knife",desc:"Filo de mantenimiento; sus cortes pueden causar sangrado."},
  pistol9:{name:"Pistola 9 mm de la Red UNO",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[14,20],accuracy:4,desc:"Arma corta compatible con munición 9 mm."},
  revolver:{name:"Revólver recuperado",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[17,23],accuracy:3,desc:"Más daño, menor precisión y munición 9 mm."},
  shotgun12:{name:"Escopeta recortada",kind:"weapon",slot:"weapon",category:"shotgun",ammo:"shell12",damage:[22,30],accuracy:1,desc:"Gran impacto a corta distancia; utiliza cartuchos calibre 12."},
  shotgunLong:{name:"Escopeta de corredera",kind:"weapon",slot:"weapon",category:"shotgun",ammo:"shell12",damage:[20,27],accuracy:3,art:"shotgun12",desc:"Escopeta de patrulla recuperada; utiliza cartuchos calibre 12."},
  rifle556:{name:"Carabina 5,56",kind:"weapon",slot:"weapon",category:"rifle",ammo:"ammo556",damage:[19,26],accuracy:4,desc:"Arma larga precisa; utiliza munición 5,56."},
  helmetWork:{name:"Casco de faena",kind:"gear",slot:"head",defense:1,maxDurability:8,desc:"Protección industrial ligera."},
  helmetRiot:{name:"Casco antidisturbios",kind:"gear",slot:"head",defense:2,maxDurability:12,desc:"Blindaje de la Red UNO para cabeza y rostro."},
  vestLight:{name:"Chaleco reforzado",kind:"gear",slot:"body",defense:1,maxDurability:10,desc:"Placas recuperadas cosidas al arnés."},
  vestTactical:{name:"Chaleco táctico de la Red UNO",kind:"gear",slot:"body",defense:2,maxDurability:16,desc:"Protección balística de patrulla."},
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
  battery:{name:"Celda de energía",kind:"resource",stack:true,desc:"Celda portátil que alimenta tecnología, fabricación de EMP y cobertura de emergencia del inhibidor."},
  scrap:{name:"Componentes metálicos",kind:"material",stack:true,desc:"Tornillos, placas y mecanismos reutilizables recuperados del equipo enemigo."},
  cloth:{name:"Tela recuperada",kind:"material",stack:true,desc:"Retazos resistentes obtenidos del equipo de los merodeadores."},
  electronics:{name:"Materiales electrónicos",kind:"material",stack:true,desc:"Placas, bobinas y circuitos recuperados de tecnología de la Red UNO."},
  pulseCore:{name:"Núcleo de pulso",kind:"material",stack:true,desc:"Emisor compacto necesario para fabricar cargas EMP."},
  tool:{name:"Herramienta multipropósito",kind:"mission",desc:"Llave, cortador y puente eléctrico de Elías."},
  unoCard:{name:"Credencial de la Red UNO",kind:"mission",desc:"Acceso limitado a terminales y puertas de servicio."},
  droneCore:{name:"Núcleo de dron",kind:"mission",desc:"Memoria y transmisor de una unidad de vigilancia."},
  routeMap:{name:"Mapa de rutas",kind:"mission",desc:"Pasos de servicio borrados de los planos del refugio."},
  radio:{name:"Módulo de radio",kind:"mission",desc:"Amplía una transmisión o la convierte en un pulso dirigido."}
};
var skillTrees={
  sara:[
    {id:"sara_distract",branch:"Combate coordinado",tier:1,cost:1,minLevel:1,name:"Señuelo médico",desc:"Distrae a un enemigo: su próximo ataque pierde precisión y el grupo gana sinergia. Reutilizable tras 2 rondas."},
    {id:"sara_knock",branch:"Combate coordinado",tier:2,cost:1,minLevel:2,requires:"sara_distract",name:"Punto de presión",desc:"Intenta aturdir a un enemigo durante su siguiente turno. Puede fallar."},
    {id:"sara_precision",branch:"Combate coordinado",tier:3,cost:2,minLevel:3,requires:"sara_knock",name:"Pulso certero",desc:"Ataque de precisión con el arma equipada; consume munición si corresponde."},
    {id:"sara_fieldcare",branch:"Medicina de campo",tier:1,cost:1,minLevel:1,name:"Manos firmes",desc:"La habilidad de Sara recupera 4 HP adicionales."},
    {id:"sara_triage",branch:"Medicina de campo",tier:2,cost:1,minLevel:2,requires:"sara_fieldcare",name:"Triaje de túnel",desc:"La atención de Sara también detiene el sangrado de todo el grupo."},
    {id:"sara_reanimate",branch:"Medicina de campo",tier:3,cost:2,minLevel:3,requires:"sara_triage",name:"Pulso de retorno",desc:"Una vez por combate, Sara puede devolver a un aliado agotado con 14 HP."},
    {id:"sara_pharmacy",branch:"Biofabricación",tier:1,cost:1,minLevel:1,name:"Farmacia de campaña",desc:"Desbloquea la receta del Botiquín sellado."},
    {id:"sara_stimulant",branch:"Biofabricación",tier:2,cost:1,minLevel:2,requires:"sara_pharmacy",name:"Catalizador Roto",desc:"Desbloquea el Estimulante Roto para recuperar HP y energía."},
    {id:"sara_trauma",branch:"Biofabricación",tier:3,cost:2,minLevel:3,requires:"sara_stimulant",name:"Cirugía de superficie",desc:"Desbloquea el Kit de trauma, la mejor curación fuera de combate."}
  ],
  elias:[
    {id:"elias_disarm",branch:"Combate coordinado",tier:1,cost:1,minLevel:1,name:"Desarme improvisado",desc:"Intenta quitar el arma de un enemigo humano. Si falla, puede quedar herido."},
    {id:"elias_double",branch:"Combate coordinado",tier:2,cost:1,minLevel:2,requires:"elias_disarm",name:"Doble impacto",desc:"Dos golpes de menor potencia contra el objetivo, con una sola acción."},
    {id:"elias_knock",branch:"Combate coordinado",tier:3,cost:2,minLevel:3,requires:"elias_double",name:"Cierre de circuito",desc:"Un golpe que puede aturdir incluso a una unidad mecánica."},
    {id:"elias_reinforce",branch:"Ingeniería táctica",tier:1,cost:1,minLevel:1,name:"Placas cruzadas",desc:"El equipo corporal operativo de Elías concede +1 de defensa adicional."},
    {id:"elias_ballistics",branch:"Ingeniería táctica",tier:2,cost:1,minLevel:2,requires:"elias_reinforce",name:"Calibración balística",desc:"Elías elimina su penalización al usar armas de fuego."},
    {id:"elias_overcharge",branch:"Ingeniería táctica",tier:3,cost:2,minLevel:3,requires:"elias_ballistics",name:"Sobrecarga violeta",desc:"Su habilidad EMP causa más daño y aturde por dos turnos."},
    {id:"elias_disassemble",branch:"Taller de la Red UNO",tier:1,cost:1,minLevel:1,name:"Desarme fino",desc:"Permite desarmar tecnología y armas recuperadas mediante un minijuego de precisión."},
    {id:"elias_armor",branch:"Taller de la Red UNO",tier:1,cost:1,minLevel:1,name:"Matriz balística",desc:"Desbloquea la fabricación del Chaleco táctico de la Red UNO."},
    {id:"elias_helmet",branch:"Taller de la Red UNO",tier:2,cost:1,minLevel:2,requires:"elias_armor",name:"Visor de patrulla",desc:"Desbloquea la fabricación del Casco antidisturbios."},
    {id:"elias_rifle",branch:"Taller de la Red UNO",tier:3,cost:2,minLevel:3,requires:"elias_helmet",name:"Banco de armas",desc:"Desbloquea la fabricación de una Carabina 5,56."}
  ],
  noa:[
    {id:"noa_precision",branch:"Combate coordinado",tier:1,cost:1,minLevel:1,name:"Golpe certero",desc:"Disparo o ataque de precisión con el arma equipada; consume munición si corresponde."},
    {id:"noa_double",branch:"Combate coordinado",tier:2,cost:1,minLevel:2,requires:"noa_precision",name:"Dos tiempos",desc:"Dos ataques de menor potencia; los disparos consumen dos cartuchos."},
    {id:"noa_disarm",branch:"Combate coordinado",tier:3,cost:2,minLevel:3,requires:"noa_double",name:"Mano rápida",desc:"Intenta robar el arma de un enemigo humano. Si falla, puede quedar herida."},
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
  knife:{buy:6,sell:2},crowbar:{buy:8,sell:3},pipe:{buy:7,sell:2},machete:{buy:12,sell:5},pistol9:{buy:24,sell:10},revolver:{buy:28,sell:12},shotgun12:{buy:38,sell:17},shotgunLong:{buy:42,sell:19},rifle556:{buy:44,sell:20}
};
var disassemblyRecipes={
  battery:{difficulty:"Celda aislada",window:18,speed:2.3,rewards:{electronics:1,scrap:1}},
  droneCore:{difficulty:"Preciso",window:15,speed:2.6,rewards:{electronics:2,pulseCore:1,battery:1}},
  radio:{difficulty:"Delicado",window:17,speed:2.4,rewards:{electronics:2,scrap:1,battery:1}},
  unoCard:{difficulty:"Fino",window:18,speed:2.2,rewards:{electronics:1,scrap:1}},
  emp:{difficulty:"Inestable",window:13,speed:2.9,rewards:{electronics:1,pulseCore:1}},
  grenade:{difficulty:"Riesgoso",window:12,speed:3.1,rewards:{scrap:1}},
  pistol9:{difficulty:"Mecánico",window:18,speed:2.3,rewards:{scrap:2,electronics:1}},
  revolver:{difficulty:"Mecánico",window:17,speed:2.4,rewards:{scrap:2,ammo9:1}},
  shotgun12:{difficulty:"Pesado",window:16,speed:2.2,rewards:{scrap:3,shell12:1}},
  shotgunLong:{difficulty:"Pesado",window:16,speed:2.2,rewards:{scrap:3,shell12:1}},
  rifle556:{difficulty:"Complejo",window:15,speed:2.6,rewards:{scrap:3,electronics:1,ammo556:1}},
  helmetRiot:{difficulty:"Blindaje",window:18,speed:2.1,rewards:{scrap:2,electronics:1}},
  vestTactical:{difficulty:"Blindaje",window:17,speed:2.2,rewards:{scrap:3,cloth:1}},
  electronics:{difficulty:"Circuito armado",window:19,speed:2.1,rewards:{scrap:1}},
  pulseCore:{difficulty:"Núcleo sellado",window:14,speed:2.8,rewards:{electronics:1,battery:1}}
};
function tradeStockForDay(day){var stock={};Object.keys(tradeCatalog).forEach(function(id){var item=tradeCatalog[id];if(item.buy)stock[id]=Math.max(0,(item.base||0)+(day>=2&&id==="medkit"?1:0)+(day===3&&["meds","ammo556","battery"].indexOf(id)>=0?1:0))});return stock}
function armorerStockForDay(day){return{knife:1,crowbar:1,pipe:1,machete:day>=2?1:0,pistol9:1,revolver:day>=2?1:0,shotgun12:1,shotgunLong:day>=2?1:0,rifle556:day>=3?1:0}}
var missionDefs=[
  {id:"signal",main:true,title:"Encontrar el origen de la señal",target:27,reward:"El desenlace depende de las rutas, las pruebas y lo que sobreviva en la torre."},
  {id:"squad",title:"Nadie queda atrás",description:"Gana un combate con Sara, Elías y Noa todavía en pie.",target:1,reward:"Moral +6"},
  {id:"salvage",title:"Reserva de superficie",description:"Recupera 8 unidades de loot desde enemigos derrotados.",target:8,reward:"Ración +1 · Medicina +1"},
  {id:"archives",title:"Reconstruir la verdad",description:"Recupera 5 archivos sobre la Red UNO y las comunidades ocultas.",target:5,reward:"Amenaza −6"},
  {id:"veteran",title:"Aprender a sobrevivir",description:"Haz que cualquier aliado alcance Lvl. 2.",target:1,reward:"Energía +10 para el grupo"},
  {id:"ghost",title:"Fuera del mapa",description:"Completa 2 sincronizaciones del inhibidor sin activar una alarma.",target:2,reward:"Amenaza −4 · Electrónica +1"}
];
