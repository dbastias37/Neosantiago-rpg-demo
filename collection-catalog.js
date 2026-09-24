"use strict";
// Shared catalogue for Exploración and Encargos.
var battleCollectibles={
  metro_ticket:{name:"Boleto del Metro",type:"Objeto chileno",mark:"M",source:"Túneles",story:"Un boleto de cartón de la antigua red. Alguien anotó al reverso: «Nos vemos en República». La cita siguió viajando mucho después del último tren."},
  bip_card:{name:"Tarjeta bip!",type:"Objeto chileno",mark:"bip!",source:"Merodeadores",story:"Una tarjeta rayada con el saldo borrado. Su dueño la llevaba colgada como identificación, aun cuando ya no quedaban torniquetes operativos."},
  cueca_tape:{name:"Casete de cueca",type:"Objeto chileno",mark:"▶",source:"Túneles",story:"Una cinta rotulada a mano: «Para el dieciocho». Tiene una cara grabada sobre la otra; ambas conservan la voz de una familia reunida."},
  feria_token:{name:"Ficha de feria",type:"Objeto chileno",mark:"F",source:"Merodeadores",story:"La ficha de una balanza que usaban en una feria de barrio. Los puestos desaparecieron; el pequeño número estampado recuerda un oficio compartido."},
  copper_key:{name:"Llave de cobre",type:"Objeto chileno",mark:"⌁",source:"Túneles",story:"La llave abre un candado de una antigua bodega. El cobre se pulió de tanto pasar de mano en mano durante las primeras evacuaciones."},
  football_pin:{name:"Prendedor de fútbol",type:"Objeto chileno",mark:"11",source:"Merodeadores",story:"Una insignia gastada de una pichanga barrial. La guardaban como señal de pertenencia, incluso quienes nunca habían visto esa cancha."},
  usb_marauder:{name:"Memoria: el paso de Franklin",type:"Memoria USB",mark:"USB",source:"Merodeador",story:"Registro de voz, sin nombre: «No nacimos saqueadores. Primero vendíamos agua en Franklin. Después nos cerraron el paso y empezamos a cobrar por cruzar». Una versión de la historia desde el otro lado del túnel."},
  usb_surface:{name:"Memoria: una ventana abierta",type:"Memoria USB",mark:"USB",source:"Habitante de superficie",story:"Diario de una habitante de la superficie: «Hoy apagaron las pantallas de la manzana. Aprendí a reconocer a mis vecinos por sus voces antes de volver a mirarles la cara»."},
  usb_agent:{name:"Memoria: cuna de la Red",type:"Memoria USB",mark:"USB",source:"Agente de la Red UNO",story:"Archivo de ingreso: «Nací en un distrito de la gobernanza mundial. Me enseñaron que abajo solo quedaban amenazas. En mi primera guardia oí cantar a una niña detrás de la compuerta»."}
};
function collectibleGlyph(id){
  var shapes={
    metro_ticket:'<rect x="8" y="17" width="48" height="30" rx="3"/><path d="M13 27h38M16 36h14m8 0h10"/><circle cx="33" cy="36" r="2"/>',
    bip_card:'<rect x="8" y="15" width="48" height="34" rx="5"/><path d="M13 22h38M15 35h12m10-3a5 5 0 0 1 0 9"/><circle cx="23" cy="37" r="2"/>',
    cueca_tape:'<rect x="9" y="15" width="46" height="34" rx="3"/><rect x="15" y="20" width="34" height="14" rx="2"/><circle cx="22" cy="27" r="4"/><circle cx="42" cy="27" r="4"/><path d="M17 42h30l-4 7H21z"/>',
    feria_token:'<circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="18"/><path d="M24 22h19M24 22v21m0-10h16"/>',
    copper_key:'<circle cx="23" cy="22" r="11"/><circle cx="23" cy="22" r="4"/><path d="m31 30 19 19h6v-6h-6v-6h-6L31 24"/>',
    football_pin:'<path d="M32 8 50 16v19c0 13-10 19-18 23-8-4-18-10-18-23V16z"/><circle cx="32" cy="31" r="10"/><path d="m32 24-6 5 2 7h8l2-7z"/>',
    usb_marauder:'<rect x="18" y="19" width="28" height="38" rx="4"/><path d="M23 19V8h18v11M27 8v7m10-7v7M26 44h12"/><circle cx="32" cy="34" r="3"/>',
    usb_surface:'<rect x="18" y="19" width="28" height="38" rx="4"/><path d="M23 19V8h18v11M27 8v7m10-7v7M25 42h14m-7-15v11m-5-5h10"/>',
    usb_agent:'<rect x="18" y="19" width="28" height="38" rx="4"/><path d="M23 19V8h18v11M27 8v7m10-7v7M25 42h14m-7-16 7 8-7 8-7-8z"/>'
  };return'<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+(shapes[id]||'')+'</svg>'
}
function courierCollectionIds(){
  try{var raw=localStorage.getItem(NeoBridgeContext.key("neosantiago.mensajeros.production.v1"));var saved=JSON.parse(raw);return Array.isArray(saved&&saved.collection)?saved.collection.filter(function(id){return !!battleCollectibles[id]}):[]}catch(e){return []}
}
function collectedIds(){return Array.from(new Set((state.collection||[]).concat(courierCollectionIds())))}
