// Workshop knowledge travels with the crew. Only confirmed new deliveries unlock this follow-up.
const copy=x=>JSON.parse(JSON.stringify(x));
export function prepareGuzman(d){
 d.guzmanLegacyMission=copy(d.missions['guzman-01']);
 Object.assign(d.missions['guzman-01'],{guzmanVersion:1,
  briefing:'El rotor marcado tiene el casquillo cambiado. Lo probé en el banco, con una carga menor que la torreta de Plaza. No tengo otro para mandarles. Ana necesita sacar al guardia que lleva dos turnos en el acceso, pero no quiero que alguien lea «probado» y lo deje funcionando sin vigilar. Lleven las piezas y la hoja. Si necesitan hablar conmigo después de montarlas, vuelvan con lo que hayan visto; no me sirve que me digan solamente que llegaron.',
  summary:'Lleva los dos rotores y el sensor a Plaza. Conserva las indicaciones de Guzmán para que los técnicos distingan la prueba de taller de la puesta en servicio.',
  delivery_text:'La técnica de Plaza aparta las herramientas y pide la hoja antes de abrir las cajas. El guardia espera junto al acceso. «Voy a montar las piezas. Díganme qué revisó Guzmán y qué pasó durante el viaje; después hacemos el giro con alguien mirando».',
  dialogues:{success:'El giro y la detección funcionan en la prueba de recepción. Dejamos anotado lo que falta observar durante el turno. El guardia puede ir a comer: otra persona se queda en su puesto.',issuer_report:'Traigan la hoja de recepción cuando vuelvan a los talleres. Necesito saber qué encontraron al montarlas.'}
 });
 d.guzmanScripted={
  'guzman-01:0':{id:'guzman-casquillo',title:'La marca en el rotor',text:'En el primer andén, Bruno apoya la caja para cambiar de hombro. La etiqueta del rotor reparado se ha doblado bajo la correa. Rocío recuerda la advertencia de Guzmán: en el banco no pudo reproducir el peso de la torreta. Tomás encuentra la etiqueta al tacto y pregunta si la técnica de Plaza podrá reconocer esa pieza cuando las dos estén fuera de la caja.',choices:[
   {id:'copy-mark',label:'Copiar la marca y el límite de la prueba en la hoja · 3 min',minutes:3,flag:'guzman_marca_copiada',result:'Rocío copia el número y escribe «prueba de banco, carga menor». Bruno coloca la etiqueta encima de la tapa. La advertencia podrá leerse aunque las cajas se separen durante el montaje.'},
   {id:'keep-paired',label:'Bruno mantiene juntas la pieza y su etiqueta · desgaste 2',wear:2,flag:'guzman_etiqueta_sujeta',result:'Bruno cambia las correas para que la etiqueta no vuelva a quedar debajo. Tendrá que llevar esa caja en la mano en los pasos estrechos. Rocío acuerda entregar la pieza directamente a la técnica, sin dejarla entre las otras.'}
  ]},
  'guzman-01:11':{id:'guzman-conector',title:'El cierre del sensor',text:'En Universidad de Chile, Bruno abre la tapa exterior para revisar la carga antes del último tramo. Una abrazadera del cable se ha soltado. Tomás comprueba que el conector sigue encajado, pero no puede probar la detección sin alimentarlo. Rocío mira la hora: pueden volver a fijar el cable aquí o llevarlo sujeto y pedir que la técnica lo revise antes de conectar la torreta.',choices:[
   {id:'secure-lead',label:'Fijar el cable y anotar lo ocurrido · 4 min',minutes:4,flag:'guzman_cable_fijado',result:'Tomás recoloca la abrazadera mientras Bruno sostiene el sensor. Rocío anota dónde la encontraron suelta. El cable ya no tira del conector; la prueba eléctrica queda para Plaza.'},
   {id:'report-lead',label:'Sujetar el cable y avisar antes de conectarlo · 1 min',minutes:1,flag:'guzman_conector_pendiente',result:'Bruno mantiene el cable junto a la carcasa para el último tramo. Rocío escribe la revisión pendiente al principio de la hoja. Entregarán el sensor en mano y avisarán antes de que lo conecten.'}
  ]}
 };
 for(const e of Object.values(d.guzmanScripted))d.events.push({...e,category:'decision',scripted:true,corridor:true,regions:['l6','centro'],image:'../../backgrounds/station-ruins.webp'});
 return d;
}
export function prepareGuzmanVisits(d){
 for(const j of Object.values(d.journeys).filter(j=>j.assignment==='guzman-01')){
  const id='visit-guzman-'+j.origin;
  d.journeys[id]={...j,id,purpose:'visit',visitContact:'guzman',name:'Volver a los talleres',summary:'Lleva a Guzmán la recepción de Plaza. Viajas con tus propios suministros; esta conversación no paga otra recompensa.'};
 }
 return d;
}
export function guzmanArrival(r){
 if(r.mission!=='guzman-01'||r.guzmanVersion!==1)return null;
 const f=r.flags||[];
 return [f.includes('guzman_marca_copiada')?'La técnica encuentra el número en la hoja y separa el rotor reparado. «Esto es lo que necesitaba: cuál probar primero y con qué carga lo revisaron».':'Bruno entrega la caja sin soltar la etiqueta. Rocío explica qué rotor tiene el casquillo cambiado. La técnica copia el número antes de llevar las piezas al montaje. «Si separo las cajas, no quiero perder esta indicación».',
 f.includes('guzman_cable_fijado')?'Tomás señala la abrazadera que volvió a fijar. La técnica revisa el conector antes de dar corriente y anota el ajuste en la recepción.':'Rocío avisa del cierre suelto antes de que conecten el sensor. La técnica deja la alimentación cortada, fija el cable y revisa el conector. El guardia espera mientras termina.',
 'La torreta completa el giro y el sensor responde durante la prueba. La técnica deja una observación para revisar el casquillo al terminar el turno; una prueba corta no confirma cuánto durará. Llama al relevo para que el guardia pueda comer. Ana libera el banco para los Mensajeros y mantiene el descanso abastecido de la posta.',
 'Rocío recibe una copia con la prueba realizada y la revisión pendiente. Podrán llevársela a Guzmán cuando vuelvan a Los Leones; la recepción no le ha llegado todavía.'
 ].join(' ');
}
function receipt(w){const r=w.completed?.['guzman-01'];return w.paid.includes('guzman-01')&&r?.provisional===false&&r.guzmanVersion===1?r:null;}
export function refreshGuzman(w){
 if(!receipt(w))return w;
 w.guzmanFollowup??={version:1,returned:false};
 const f=w.guzmanFollowup;
 if(f.version!==1||typeof f.returned!=='boolean')throw Error('Seguimiento de Guzmán inválido.');
 if(w.location==='leones'&&!w.run?.pending&&w.run?.status!=='failed')f.returned=true;
 return w;
}
export function guzmanMemory(w,node){
 const r=receipt(w);if(!r||!['leones','plaza'].includes(node))return [];
 if(node==='plaza')return ['La hoja de recepción identifica el rotor reparado y deja pendiente observar su casquillo durante el turno. El giro y la detección se probaron al recibir las piezas; ese resultado no certifica que nunca volverán a fallar.'];
 if(!w.guzmanFollowup?.returned)return ['El equipo conserva la copia de recepción de Plaza. Guzmán todavía no ha escuchado qué encontraron al montar las piezas. Para llevarle el informe hay que volver a Los Leones.'];
 return [r.flags.includes('guzman_marca_copiada')?'Guzmán deja el soldador en el soporte y lee la copia. Reconoce el número del rotor y la advertencia que copiaron. «Me preguntaron si estaba probado y dije que sí. Tendría que haber explicado de entrada cómo lo probé».':'Guzmán lee que Bruno entregó la etiqueta junto al rotor. Busca una punta de marcar en el cajón. «La próxima va escrita también en la carcasa. No puedo pedirles que lleven una pieza en la mano todo el camino para que no se pierda un número».',
 r.flags.includes('guzman_cable_fijado')?'Tomás le explica dónde volvió a fijar la abrazadera. Guzmán le acerca una carcasa vacía para que señale el punto y lo anota en la hoja de embalaje. «Esto lo puedo revisar antes de cerrar las cajas».':'Rocío le cuenta que dejaron la abrazadera para la técnica de Plaza. Guzmán pregunta si dieron corriente antes de revisarla. Al saber que no, anota el cierre en su hoja de embalaje. «Prefiero recibir esta observación a enterarme cuando el sensor deje de responder».',
 'Bruno le cuenta que vio salir al guardia a comer. Guzmán pregunta por el rotor después del turno. Rocío señala la casilla pendiente: no se quedaron hasta entonces. Él deja la copia junto al banco, sin marcar esa revisión como hecha. «Está bien. Eso todavía tenemos que averiguarlo».'];
}
