import {rosaBridge as bridge} from './rosa-bridge.mjs';
import {conversation} from './community.mjs';
export function rosaUI({data,E,getWorld,setWorld,canWrite,render,open,close,announce,esc,image}){
 const context=globalThis.NeoBridgeContext;
 function commit(fn){
  if(!canWrite())return false;
  try{const next=fn(getWorld());localStorage.setItem(data.save_key,E.serialize(next));setWorld(next);render();return true;}
  catch(err){announce('No se confirmó el cambio: '+err.message);return false;}
 }
 function sync(){
  if(!context?.key||!canWrite())return;
  try{
   const s=JSON.parse(localStorage.getItem(context.key('neosantiago2130_demo_v3')));
   if(s?.version!==3||s.finished||!s.flags?.iaraAtSafeHouse||!s.rosaBridge||s.rosaBridge.stage!=='requested'||getWorld().rosaBridge)return;
   const next=bridge.join(getWorld(),s.rosaBridge,crypto.randomUUID());localStorage.setItem(data.save_key,E.serialize(next));setWorld(next);
  }catch(err){announce('La solicitud de Rosa no pudo incorporarse. Se conserva el guardado: '+err.message);}
 }
 function entry(){const b=getWorld().rosaBridge;return b?`<div class="return-entry"><p>Rosa · ${esc({requested:'Hablar con Ana en Plaza',collected:'Confirmar recepción en Los Héroes',delivered:'Recepción acordada'}[b.stage])}</p><button data-rosa-open>Una puerta para volver</button></div>`:'';}
 function show(){
  const w=getWorld(),b=w.rosaBridge;if(!b)return;
  const idle=bridge.idle(w),paid=w.paid.includes('ana-01');let text,actions;
  if(b.stage==='requested'){
   text='Ana guarda la nota de Rosa junto al registro. «La niña pudo dormir. Ahora Rosa quiere saber dónde van a recibir a quienes bajen de las casas. Yo puedo preparar la salida; necesito que en Los Héroes alguien se haga cargo al llegar». '+(paid?'Las familias que acompañaste ya tienen su llegada registrada. Falta llevar este añadido para el próximo relevo.':'Dos familias están listas para salir desde Plaza. Puedes acompañarlas con el encargo de Ana y llevar el añadido en el mismo viaje. Rosa e Iara no viajan con ellas.');
   actions=w.location==='plaza'?`<button data-rosa-action="collect" class="primary" ${idle?'':'disabled'}>Recoger el añadido de Ana</button>`:`<button data-rosa-action="travel" class="primary" ${idle?'':'disabled'}>Viajar a Plaza de Armas</button>`;
  }else if(b.stage==='collected'){
   text='Rocío guarda el añadido detrás de la lista. «No voy a dar esto por acordado hasta que lo reciban». '+(paid?'La llegada del primer grupo está confirmada. Puedes presentar el añadido al volver a Los Héroes; no hay que repetir la escolta.':'Primero hay que acompañar a las familias del encargo de Ana. El añadido viaja con ellas y se presenta por separado al llegar.');
   actions=!paid?'<button data-offer="ana-01" class="primary">Preparar la escolta de Ana</button>':w.location==='heroes'?`<button data-rosa-action="deliver" class="primary" ${idle?'':'disabled'}>Acordar la recepción para la red de Rosa</button>`:`<button data-rosa-action="return" class="primary" ${idle?'':'disabled'}>Preparar regreso a Los Héroes</button>`;
  }else{
   text='La responsable lee el añadido y señala su puesto en el plano. «Que pregunten aquí. Si viene alguien con una niña o cargando a otra persona, no lo manden a buscarme por todo el refugio». Rocío conserva la copia para Noa. '+(b.method==='lists'?'Los nombres de las familias quedaron cotejados en ambas listas.':b.method==='contact'?'El puesto de Ana confirmó los nombres que faltaban.':'El registro anterior confirma la llegada de las familias, sin conservar cómo se aclararon las listas.')+' Rosa e Iara siguen en la casa: este acuerdo prepara una recepción, no confirma su traslado.';
   actions='<button data-rosa-action="campaign" class="primary">Llevar la confirmación a la expedición</button>';
  }
  const note=!idle?'Resuelve, reintenta o devuelve el viaje actual antes de preparar otro. La solicitud no sustituye tu encargo.':b.stage==='delivered'?'La expedición podrá consultar la copia en el refugio. No se vuelve a pagar el encargo.':'El añadido se conserva al retirarse y no ocupa una mochila. Cambiar de actividad no lo entrega: hay que recorrer el trayecto.';
  open('RELEVO CIVIL',conversation({portrait:data.missions['ana-01'].portrait,name:b.stage==='delivered'?'Recepción de Los Héroes':'Ana · nota para el relevo',place:b.stage==='delivered'?'Copia de la recepción':w.location==='plaza'?'Plaza de Armas':'Solicitud de Plaza de Armas',title:'Una puerta para volver',body:'<p>'+esc(text)+'</p>',note,image})+`<div class="dialog-actions">${actions}<button data-close="dialog">Volver al mapa</button></div>`,'community');
 }
 function handle(button){
  if(button.hasAttribute('data-rosa-open')){sync();show();return true;}
  const action=button.dataset.rosaAction;if(!action)return false;
  if(action==='campaign'){close();parent.postMessage({type:'neo-courier-return'},location.origin);return true;}
  if(action==='return')return false;
  const actions={collect:bridge.collect,deliver:bridge.deliver,travel:w=>E.travelRosa(data,w)};
  if(actions[action]&&commit(actions[action])){if(action==='travel'){close();announce('El equipo recorre el camino a Plaza de Armas.');}else show();}return true;
 }
 return {sync,entry,show,handle};
}
