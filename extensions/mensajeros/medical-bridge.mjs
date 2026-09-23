import '../../community-bridge.js';
export const bridge=globalThis.NeoCommunityBridge;
export function contextualAdasme(m,w){
 if(m?.id!=='adasme-01'||!w.matiasBridge||w.paid.includes('jimenez-01'))return m;
 return {...m,lead:'Los Héroes necesita transportar una reserva de Vicuña. Adasme también busca a Darío.',introduction:'La posta presentó al equipo ante Adasme. La reserva médica está apartada en Vicuña; recogerla no exige completar el rescate.',briefing:'Tengo la solicitud de Los Héroes. La posta dejó la reserva a nombre de Matías; pueden recogerla aquí aunque no acepten la búsqueda. Nos falta Darío: perdió contacto entre Los Leones y Tobalaba. Busquen en el refugio provisorio. Los demás están desplegados y no puedo mandarlos de vuelta. Si aceptan, les prestamos tres bombas de humo y un inhibidor con veinte minutos de batería. El relevo de Tobalaba tiene copia de esta solicitud y puede entregarles ese equipo. Si no puede caminar, habrá que cargarlo. Vuelvan a Vicuña con él; después pueden llevar la reserva a Los Héroes.'};
}
export function prepareMedicalVisits(data){
 for(const [id,m] of Object.entries(data.journeys))if(id.startsWith('visit-jimenez-')){
  const key='medical-'+m.origin;
  data.journeys[key]={...m,id:key,purpose:'medical',assignment:undefined,visitContact:undefined,issuer:'Posta de Vicuña',name:'La reserva de Vicuña',recipient:'Posta de Vicuña',summary:'Recoge la reserva destinada a Matías. Viajas con tus suministros; la entrega requiere volver físicamente a Los Héroes.'};
 }
 return data;
}
