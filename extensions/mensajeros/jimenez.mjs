// Reports reach operations with the crew; legacy contracts retain their original account.
const copy=x=>JSON.parse(JSON.stringify(x));
export function prepareJimenez(d){
 d.jimenezLegacyMission=copy(d.missions['jimenez-01']);
 Object.assign(d.missions['jimenez-01'],{jimenezVersion:1,
  summary:'Lleva el módulo a Los Leones y registra qué puede comprobarse del enlace en Tobalaba. Un relevo necesita saber si sus avisos llegan.',
  briefing:'Inés lleva dos turnos esperando que le confirmen un aviso. Desde aquí oímos fragmentos, pero ella no sabe si alguien los recibió. Le dije que esperara antes de mover al relevo y ahora no puedo aclararle por ese canal cuánto más. Lleven el módulo a los talleres y hagan una lectura en Tobalaba. No transmitan nombres ni horarios. Si solo pueden escuchar, escríbanlo así: necesito saber qué falta, no una firma que diga que todo funciona.',
  delivery_text:'La técnica de Los Leones pide la hoja de Tobalaba antes de conectar el módulo. «Necesito separar lo que escucharon de lo que consiguió volver. Inés puede estar oyendo ruido y nosotros llamándolo enlace».',
  dialogues:{success:'El módulo queda en el banco y la lectura, registrada. La técnica distingue recepción de respuesta; todavía falta comprobar el recorrido completo con Vicuña.',issuer_report:'Tráiganme la copia cuando vuelvan. Quiero saber qué pudieron comprobar antes de cambiar las instrucciones del relevo.'}
 });
 d.missions['adasme-01'].briefing=d.missions['adasme-01'].briefing.replace('Con el enlace de Jiménez confirmado','Con la entrega del módulo de Jiménez registrada');
 d.jimenezScripted={
  'jimenez-01:0':{id:'jimenez-relevo',title:'La hoja de Inés',text:'Antes de dejar Vicuña, Rocío encuentra dos horas distintas anotadas junto al mismo aviso. Inés escribió una al transmitir; Jiménez añadió la otra cuando creyó oírlo. Bruno tiene el módulo sujeto a la mochila. Tomás pregunta si deben copiar el registro completo para que la técnica compare ambos momentos o llevar solamente la lectura nueva, dejando esta discrepancia sin resolver.',choices:[
   {id:'copy-times',label:'Comparar las anotaciones con Jiménez y copiarlas · 4 min',minutes:4,flag:'jimenez_horas_copiadas',result:'Jiménez señala qué hora anotó él. Rocío conserva ambas y escribe quién registró cada una. No pueden demostrar que correspondan al mismo mensaje. La técnica tendrá los datos para revisarlo, sin convertir la diferencia en un retraso confirmado.'},
   {id:'mark-gap',label:'Marcar la discrepancia como pendiente y salir · 1 min',minutes:1,flag:'jimenez_horas_pendientes',result:'Rocío escribe que las horas no se contrastaron. Jiménez conserva el registro original en Vicuña. La técnica recibirá la lectura nueva, pero necesitará esos papeles para compararla con los avisos anteriores.'}
  ]},
  'jimenez-01:11':{id:'jimenez-prueba',title:'Escuchar no es recibir respuesta',text:'En Tobalaba, Tomás capta una voz cortada y dos golpes de prueba. El relevo local espera detrás del muro de servicio. «A veces escuchamos Vicuña, pero desde allá no nos contestan», explica la operadora. Rocío separa en la hoja recepción y respuesta. Pueden registrar lo que entra sin emitir, o trasladar el equipo bajo la cobertura y pedir una devolución breve al puesto local. Ninguna opción comprueba por sí sola todo el enlace hasta Vicuña.',choices:[
   {id:'passive',label:'Registrar la recepción sin transmitir · 5 min',minutes:5,flag:'lectura_pasiva',result:'Tomás anota las interrupciones que oye. No encienden el transmisor. Rocío marca «recepción observada; respuesta no probada». No han emitido para esta prueba, pero tampoco pueden asegurar que los avisos del relevo lleguen a destino.'},
   {id:'shield',label:'Probar una respuesta local desde cobertura · desgaste 2 / 3 min',wear:2,minutes:3,flag:'enlace_probado',result:'Bruno lleva el módulo hasta el hueco protegido y sostiene el cable mientras Tomás emite dos pulsos, sin nombres ni horarios. El puesto local devuelve la secuencia. Rocío anota lugar y alcance: respuesta local comprobada; Vicuña sigue pendiente. La cobertura no convierte la emisión en indetectable.'}
  ]}
 };
 for(const e of Object.values(d.jimenezScripted))d.events.push({...e,category:'decision',scripted:true,corridor:true,regions:['oriente'],image:'../../backgrounds/station-ruins.webp'});
 return d;
}
export function prepareJimenezVisits(d){
 for(const j of Object.values(d.journeys).filter(j=>j.assignment==='jimenez-01')){
  const id='visit-jimenez-'+j.origin;
  d.journeys[id]={...j,id,purpose:'visit',visitContact:'jimenez',name:'Volver a operaciones',summary:'Lleva a Jiménez el informe de Los Leones. El viaje usa tus suministros y no paga otra recompensa.'};
 }
 return d;
}
export function jimenezArrival(r){
 if(r.mission!=='jimenez-01'||r.jimenezVersion!==1)return null;
 const f=r.flags||[];
 return [f.includes('jimenez_horas_copiadas')?'La técnica pone las dos horas junto a la lectura nueva. «Gracias por anotar quién escribió cada una. Todavía no sabemos si era el mismo aviso; no voy a calcular un retraso con esto».':'La técnica lee que las horas quedaron pendientes en Vicuña. Deja una casilla abierta para pedir el registro original. «Con la lectura nueva puedo empezar. Para comparar los avisos anteriores me falta esa hoja».',
 f.includes('enlace_probado')?'Tomás explica la devolución de los dos pulsos. La técnica registra respuesta local en Tobalaba y pregunta si habló con Vicuña. «No». Ella deja ese tramo sin confirmar.':'Tomás muestra los cortes que anotó sin transmitir. La técnica registra recepción y deja la respuesta sin comprobar. «Escuchar una voz no me dice si esa persona puede oírnos».',
 'La técnica conecta el módulo al banco y confirma que enciende. Reserva la comprobación con Vicuña para una prueba coordinada; nadie firma todavía que el canal completo esté disponible. Prepara una copia para operaciones. El préstamo de inhibidor previsto para futuros encargos se mantiene: no depende de dar por reparada la comunicación.',
 'Rocío guarda la copia. Jiménez todavía no conoce esta recepción. Podrán llevársela al volver físicamente a Vicuña Mackenna.'
 ].join(' ');
}
function receipt(w){const r=w.completed?.['jimenez-01'];return w.paid.includes('jimenez-01')&&r?.provisional===false&&r.jimenezVersion===1?r:null;}
export function refreshJimenez(w){
 if(!receipt(w))return w;
 w.jimenezFollowup??={version:1,returned:false};
 const f=w.jimenezFollowup;
 if(f.version!==1||typeof f.returned!=='boolean')throw Error('Seguimiento de Jiménez inválido.');
 if(w.location==='vicuna'&&!w.run?.pending&&w.run?.status!=='failed')f.returned=true;
 return w;
}
export function jimenezMemory(w,node){
 const r=receipt(w);if(!r||!['vicuna','leones'].includes(node))return [];
 if(node==='leones')return ['El módulo encendió en el banco. La hoja distingue recepción, respuesta local y comprobación con Vicuña; el canal completo sigue pendiente de una prueba coordinada.'];
 if(!w.jimenezFollowup?.returned)return ['El equipo conserva el informe de Los Leones. Jiménez aún no lo ha recibido; hay que llevarlo a operaciones en Vicuña Mackenna.'];
 return [r.flags.includes('jimenez_horas_copiadas')?'Jiménez reconoce las dos anotaciones. «Esta es mía. Oí el final y di por hecho que era el aviso de Inés». Rocío señala que la técnica no pudo confirmar que fuera el mismo. Él corrige su registro: oído parcialmente, sin confirmación.':'Jiménez saca el registro que quedó en Vicuña. Rocío le muestra la casilla pendiente. Él separa la hoja para la próxima comunicación con los talleres. «Tendría que haberles dado esto junto con el módulo».',
 r.flags.includes('enlace_probado')?'Tomás explica que el puesto local devolvió los pulsos. Jiménez pregunta si eso basta para cambiar de canal al relevo. Rocío señala el tramo sin probar. «Entonces todavía no», responde él.':'Tomás explica que escucharon sin transmitir. Jiménez lee «respuesta no probada» y deja el canal fuera de las instrucciones de cambio. «Esto no es un fallo de ustedes. Es lo que todavía no sabemos».',
 'Jiménez tacha «esperar confirmación» en la copia de instrucciones y escribe que, si el aviso no recibe respuesta, el relevo debe conservar la última instrucción confirmada y entregar el parte en el puesto. «A Inés le pedí que esperara algo que quizá no podía llegar». Deja la corrección para el próximo relevo; el equipo no ha visto que Inés la reciba ni que el enlace quede reparado.'];
}
