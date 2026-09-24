import '../../rosa-bridge.js';
export const rosaBridge=globalThis.NeoRosaBridge;
export function contextualAna(m,w){
 if(m?.id!=='ana-01'||!w.rosaBridge||w.paid.includes('ana-01'))return m;
 return {...m,lead:'Rosa pidió acordar una recepción para su red. Ana prepara una salida desde Plaza.',introduction:'La nota de Rosa presentó al equipo ante Ana. Su hija sigue en la casa segura; las familias que esperan esta salida son otras.',briefing:'Rosa me hizo llegar su nota. Quiere saber quién recibirá a la gente de las casas si necesita bajar. Lleven primero el añadido que dejé en la mesa. Estas dos familias ya están listas para salir: una lleva a su madre; la otra trae herramientas para trabajar. Acompáñenlas a Los Héroes y aclaren cualquier diferencia en las listas. Después presenten el añadido a la responsable. No les voy a decir a los de arriba que está resuelto antes de que alguien firme al otro extremo.'};
}
export function prepareRosaVisits(data){
 for(const [id,m] of Object.entries(data.journeys))if(id.startsWith('approach-ana-01-')){
  const key='rosa-'+m.origin;data.journeys[key]={...m,id:key,purpose:'rosa',assignment:undefined,name:'Una puerta para volver',summary:'Habla con Ana en Plaza y recoge el añadido de Rosa. Conservas suministros y heridas; la recepción se confirma en Los Héroes.'};
 }
 return data;
}
