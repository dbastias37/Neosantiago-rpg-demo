import {bridge} from './medical-bridge.mjs';
import {conversation} from './community.mjs';

export function medicalUI({data,E,getWorld,setWorld,canWrite,render,open,close,announce,esc,image}){
 const context=globalThis.NeoBridgeContext;
 function commit(fn){
  if(!(context?.policy||context?.variant)||!canWrite())return false;
  try{const next=fn(getWorld());localStorage.setItem(data.save_key,E.serialize(next));setWorld(next);render();return true;}
  catch(err){announce('No se confirmó el cambio: '+err.message);return false;}
 }
 function sync(){
  if(!(context?.policy||context?.variant)||!canWrite())return;
  try{
   const s=JSON.parse(localStorage.getItem(context.key('neosantiago2130_demo_v3')));
   if(s?.version!==3||s.finished||!s.flags?.matiasAtRefuge||!s.matiasBridge||s.matiasBridge.variant!==(context.policy||context.variant)||s.matiasBridge.stage!=='requested')return;
   if(getWorld().matiasBridge)return;
   const next=bridge.join(getWorld(),s.matiasBridge,crypto.randomUUID());
   localStorage.setItem(data.save_key,E.serialize(next));setWorld(next);
  }catch(err){announce('La solicitud no pudo incorporarse. Se conserva el guardado: '+err.message);}
 }
 function entry(){
  const b=getWorld().matiasBridge;if(!(context?.policy||context?.variant)||!b)return '';
  const status={requested:'Recoger en Vicuña',collected:'Llevar a Los Héroes',delivered:'Recepción confirmada'}[b.stage];
  return `<div class="return-entry"><p>Matías · ${esc(status)}</p><button data-medical-open>La reserva de Vicuña</button></div>`;
 }
 function show(){
  const w=getWorld(),b=w.matiasBridge;if(!(context?.policy||context?.variant)||!b)return;
  const idle=bridge.idle(w),rescued=bridge.rescued(w),local=w.location==='vicuna'&&idle;
  let text='',actions='';
  if(b.stage==='requested'){
   text=local?(rescued?'Adasme firma el registro de salida. «La posta me pidió que les diera esto para Matías. Y gracias por traer a Darío. Ya lo están atendiendo». Aparta el paquete del equipo devuelto: el pago del rescate quedó registrado por separado.':'Adasme busca el nombre en el registro de la posta. «Matías. Sí, aquí está. Pueden llevárselo. Yo todavía necesito encontrar a Darío; si pueden hacer la búsqueda, hablen conmigo antes de salir».'):'La posta de Los Héroes pidió trasladar una reserva para Matías. Está apartada en Vicuña Mackenna. Adasme necesita además recuperar a Darío, un operativo incomunicado. Pueden combinar los viajes o recoger primero la reserva; la atención de Matías no depende de aceptar el rescate.';
   actions=local?'<button data-medical-action="collect" class="primary">Recoger la reserva</button>':`<button data-medical-action="travel" ${idle?'':'disabled'}>Viajar a la posta de Vicuña</button>`;
   if(!rescued)actions='<button data-offer="adasme-01" class="primary">Conocer la búsqueda de Darío</button>'+actions;
  }else if(b.stage==='collected'){
   text='Rocío revisa la etiqueta antes de ajustar la correa. «Esto va a la posta de Los Héroes». Bruno deja el bulto por encima del equipo que pueden necesitar en el camino. La reserva viaja como carga protegida: no es un botiquín para el grupo, no se vende ni se gasta en combate. Si interrumpen el viaje, conserva la ubicación del equipo.';
   actions=w.location==='heroes'?`<button data-medical-action="deliver" class="primary" ${idle?'':'disabled'}>Entregar a la posta de Los Héroes</button>`:`<button data-medical-action="return" ${idle?'':'disabled'}>Preparar regreso a Los Héroes</button>`;
   if(local&&!rescued)actions+='<button data-offer="adasme-01">Hablar con Adasme sobre Darío</button>';
  }else{
   text='La encargada de la posta coteja el nombre de Matías y firma la recepción. Rocío conserva una copia. «Gracias. Lo estaban esperando». El paquete queda aquí; el grupo de Sara podrá consultar la entrega al volver al refugio. '+(b.source==='rescue'?'El registro también confirma que Darío volvió a Vicuña.':'La recepción no confirma el destino de Darío.');
   actions='<button data-medical-action="campaign" class="primary">Volver a la expedición</button>';
  }
  const note=!idle?'Hay un viaje en curso o interrumpido. Resuélvelo, reinténtalo o usa «Devolver encargo» antes de iniciar otro traslado. La solicitud no reemplaza ese progreso.':b.stage==='requested'?'El traslado conserva suministros y heridas. El plazo del rescate empieza solo si aceptas ese encargo.':b.stage==='collected'?'La reserva se entrega al llegar. Volver al menú de actividades no transporta la carga.':'Recepción guardada una sola vez. No transfiere créditos ni objetos a las mochilas de la expedición.';
  open('RELEVO DE LA POSTA',conversation({portrait:b.stage==='delivered'?'../../items/medkit.webp':data.missions['adasme-01'].portrait,name:b.stage==='delivered'?'Posta de Los Héroes':'Adasme',place:local?'Vicuña Mackenna':b.stage==='delivered'?'Recepción conservada':'Solicitud del relevo',title:'La reserva de Vicuña',body:'<p>'+esc(text)+'</p>',note,image})+`<div class="dialog-actions">${actions}<button data-close="dialog">Volver al mapa</button></div>`,'community');
 }
 function handle(button){
  if(button.hasAttribute('data-medical-open')){sync();show();return true;}
  const action=button.dataset.medicalAction;if(!action)return false;
  if(action==='campaign'){close();parent.postMessage({type:'neo-courier-return'},location.origin);return true;}
  // Reuse the existing return preparation window (supplies, route, hazards).
  if(action==='return')return false;
  const actions={collect:bridge.collect,deliver:bridge.deliver,travel:w=>E.travelMedical(data,w)};
  if(actions[action]&&commit(actions[action])){if(action==='travel'){close();announce('El equipo viaja a Vicuña con sus suministros.');}else show();}
  return true;
 }
 return {sync,entry,show,handle};
}
