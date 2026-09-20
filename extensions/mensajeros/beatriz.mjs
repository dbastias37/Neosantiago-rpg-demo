// The sealed reserve, its handling and the handover are different facts.
const copy=x=>JSON.parse(JSON.stringify(x));
export function prepareBeatriz(d){
 d.beatrizLegacyMission=copy(d.missions['beatriz-01']);
 Object.assign(d.missions['beatriz-01'],{
  beatrizVersion:1,
  briefing:'Todavía tenemos cultivos, pero queda poco nutriente. La reserva está en Universidad de Chile. Luz está aprendiendo a preparar las mezclas y yo llevo dos turnos revisándolo todo: si falta una indicación, tiene que esperarme. Recojan el envase sin abrirlo. Ella volverá con ustedes desde Plaza; cuéntenle lo que hayan comprobado, también lo que siga pendiente.',
  summary:'Recoge la reserva sellada y vuelve a los huertos. El siguiente turno necesita saber cómo llegó el envase y qué falta revisar.',
  delivery_text:'Beatriz aparta una bandeja para apoyar el envase. Luz deja su cuaderno al lado. «Antes de mezclar nada, díganme qué encontraron en la posta y cómo lo trajeron». «No quiero mandar a Luz a mezclar con una duda que pudimos resolver aquí».',
  dialogues:{success:'La reserva queda aquí. Revisaré la mezcla con Luz antes de usarla. Mantengo el precio acordado para sus raciones; esta entrega no nos deja provisiones de sobra.'}
 });
 d.beatrizScripted={
  'beatriz-01:1':{id:'beatriz-envase',title:'Lo que se puede comprobar',text:'Inés entrega el envase en Universidad de Chile. Tomás recorre el aro exterior con los dedos: está flojo, pero el precinto interior sigue cerrado. La etiqueta coincide con la reserva solicitada. Pueden ajustar el aro o sujetar el envase para que no se mueva. Ninguna de las dos cosas permite comprobar la mezcla sin abrirla.',choices:[
   {id:'seal',label:'Tomás ajusta y comprueba el aro · 4 min',minutes:4,flag:'sello_revisado',result:'Tomás ajusta el aro y vuelve a comprobarlo. Rocío anota la etiqueta y el cierre revisado. El precinto interior queda intacto; el contenido sigue pendiente de revisión en los huertos.'},
   {id:'secure',label:'Bruno sujeta el envase durante el regreso · desgaste 2',wear:2,flag:'carga_asegurada',result:'Bruno sujeta el envase con las correas y asume el peso para que no golpee los bordes. Rocío anota que el aro sigue pendiente de ajuste. El precinto interior no se abre.'}
  ]},
  'beatriz-01:2':{id:'beatriz-relevo',title:'Luz también tiene que saber',text:'En Plaza, Luz espera para volver con el equipo. Lleva escrito el orden de preparación, pero no sabe qué revisaron en la posta. «Cuando Beatriz sale, todos me preguntan a mí. No quiero firmar algo que no sé». Pueden repasar con ella las comprobaciones antes de salir o llevar la revisión directamente a Beatriz. Luz viajará con ellos en ambos casos.',choices:[
   {id:'explain',label:'Repasar con Luz lo comprobado y lo pendiente · 4 min',minutes:4,flag:'beatriz_relevo_preparado',result:'Rocío distingue la etiqueta, el precinto y la forma de transportar el envase. Luz lo escribe en dos columnas: comprobado y pendiente. Se reserva la preparación de la mezcla para revisarla con Beatriz.'},
   {id:'together',label:'Pedir la revisión conjunta al llegar · 1 min',minutes:1,flag:'beatriz_revision_conjunta',result:'Luz escribe sus preguntas sin firmar la recepción. El equipo acuerda plantearlas delante de Beatriz. Así podrán salir antes, pero el siguiente turno tendrá que esperar esa explicación.'}
  ]}
 };
 for(const e of Object.values(d.beatrizScripted))d.events.push({...e,category:'decision',scripted:true,corridor:true,regions:['centro'],image:'../../backgrounds/day-market.webp'});
 return d;
}
export function prepareBeatrizVisits(d){
 for(const j of Object.values(d.journeys).filter(j=>j.assignment==='beatriz-01')){
  const id='visit-beatriz-'+j.origin;
  d.journeys[id]={...j,id,purpose:'visit',name:'Volver a los huertos',summary:'Visita a Beatriz después de la entrega. Viajas con tus suministros; la visita no paga otra recompensa.'};
 }
 return d;
}
export function beatrizArrival(r){
 if(r.mission!=='beatriz-01'||r.beatrizVersion!==1)return null;
 const f=r.flags||[];
 return [
  f.includes('sello_revisado')?'Beatriz comprueba el aro que ajustó Tomás. Rocío le entrega la etiqueta registrada y aclara que no abrieron el precinto. «Entonces reviso la mezcla aquí. No voy a darla por probada porque el envase llegó cerrado».':'Bruno sostiene el envase mientras Beatriz ajusta el aro pendiente. Ella revisa las correas antes de retirarlas. «Lo trajeron sujeto. Eso me sirve saberlo; la mezcla todavía la revisamos nosotras».',
  f.includes('beatriz_relevo_preparado')?'Luz lee sus dos columnas y Beatriz corrige una indicación de preparación. Podrá recibir el siguiente envase con esa lista, aunque todavía harán juntas la mezcla. Beatriz le pide que conserve también las dudas.':'Luz abre el cuaderno por sus preguntas. Beatriz detiene la preparación para responderlas una por una; el relevo espera junto a la mesa. «Hiciste bien en no firmar sin saber. La próxima vez, tráeme también lo que sí comprobaron».',
  'Beatriz anota la reserva para los cultivos que ya tienen y tacha la recogida pendiente. Luz le pide que se quede mientras termina de copiar las indicaciones para el relevo.'
 ].join(' ');
}
function receipt(w){const r=w.completed?.['beatriz-01'];return w.paid.includes('beatriz-01')&&r?.provisional===false&&r.beatrizVersion===1?r:null;}
export function refreshBeatriz(w){
 if(!receipt(w))return w;
 w.beatrizFollowup??={version:1,left:false,returned:false};
 const f=w.beatrizFollowup;
 if(f.version!==1||typeof f.left!=='boolean'||typeof f.returned!=='boolean'||f.returned&&!f.left)throw Error('Seguimiento de Beatriz inválido.');
 if(w.location!=='libertadores')f.left=true;
 else if(f.left&&!w.run?.pending&&w.run?.status!=='failed')f.returned=true;
 return w;
}
export function beatrizMemory(w,node){
 const r=receipt(w);if(!r||node!=='libertadores')return [];
 const prepared=r.flags.includes('beatriz_relevo_preparado');
 if(!w.beatrizFollowup?.returned)return ['La reserva entregada está registrada en los huertos. '+(prepared?'Luz conserva la lista de lo comprobado y lo pendiente.':'Luz dejó sus preguntas en la mesa de preparación para revisarlas con Beatriz.')];
 return [prepared?'Al volver, Luz les muestra la lista junto a la mesa de recepción. Ha añadido una casilla para quien revisa el cierre. «Esto sí puedo recibirlo yo. La mezcla todavía la hago con Beatriz».':'Al volver, Beatriz llama a Luz antes de recibir otro envase. Han dejado sus preguntas junto a la mesa y las repasan con quien trae la carga. El relevo todavía necesita a las dos para cerrar la revisión.',r.flags.includes('sello_revisado')?'Luz le acerca a Tomás el envase que está revisando y le pregunta dónde comprobar el aro. La hoja de preparación sigue junto a la mesa; Beatriz le pide que anote también quién recibe cada reserva.':'Bruno reconoce las correas dobladas junto a la mesa. Beatriz las ha apartado para el siguiente transporte y mantiene una nota: sujetar el envase no sustituye revisar su cierre.'];
}
