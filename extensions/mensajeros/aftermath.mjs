// A completed extraction leaves a person in the world, not another payment.
const copy=x=>JSON.parse(JSON.stringify(x));
const missionId='adasme-01';
const requireThat=(ok,message)=>{if(!ok)throw Error(message);};
function confirmed(w){const r=w.completed?.[missionId];return w.paid?.includes(missionId)&&w.effects?.includes(missionId)&&r?.provisional===false&&r.recipient==='Adasme · Vicuña Mackenna';}
export function rescueOutcome(run){return {mobility:run.rescued?.mode==='carry'?'carried':run.rescued?.mode==='escort'?'walking':'unknown',assisted:typeof run.rescued?.assisted==='boolean'?run.rescued.assisted:null,ammoGiven:[0,4].includes(run.rescued?.ammoGiven)?run.rescued.ammoGiven:null,combats:run.combats};}
function validOutcome(o){return o&&['carried','walking','unknown'].includes(o.mobility)&&[true,false,null].includes(o.assisted)&&[0,4,null].includes(o.ammoGiven)&&Number.isInteger(o.combats)&&o.combats>=0;}
export function refreshAftermath(w){
 w.aftermath??={version:1,rescueReturn:null};
 const a=w.aftermath;requireThat(a.version===1&&Object.hasOwn(a,'rescueReturn'),'Continuidad del regreso inválida.');
 if(!confirmed(w)){requireThat(a.rescueReturn===null,'El regreso no tiene una extracción confirmada.');return w;}
 if(!a.rescueReturn){
  const receipt=w.completed[missionId],oldRun=w.run?.mission===missionId&&w.run.status==='completed'?w.run:null;
  const outcome=receipt.rescueOutcome||(oldRun?rescueOutcome(oldRun):{mobility:'unknown',assisted:null,ammoGiven:null,combats:receipt.combats});
  requireThat(validOutcome(outcome),'Registro de extracción inválido.');
  a.rescueReturn={outcome:copy(outcome),approach:null,homeReached:false,closed:false};
 }
 const f=a.rescueReturn;
 requireThat(validOutcome(f.outcome)&&[null,'rest','account'].includes(f.approach)&&typeof f.homeReached==='boolean'&&typeof f.closed==='boolean'&&(!f.closed||(f.approach&&f.homeReached)),'Continuidad del regreso inválida.');
 const recorded=w.completed[missionId].rescueOutcome;
 if(recorded)requireThat(validOutcome(recorded)&&Object.keys(f.outcome).every(key=>f.outcome[key]===recorded[key]),'El regreso contradice el registro de extracción.');
 if(w.location==='heroes')f.homeReached=true;
 return w;
}
export function returnStatus(w){
 const f=w.aftermath?.rescueReturn;if(!f)return null;
 const safe=!w.run||!['active','failed'].includes(w.run.status);
 return {stage:!f.approach?'arrival':f.closed?'closed':f.homeReached?'followup':'waiting',safe,local:w.location==='vicuna',approach:f.approach};
}
export function answerReturn(data,source,choice){
 const status=returnStatus(source);requireThat(status&&status.safe,'Termina o devuelve el viaje antes de atender esta conversación.');
 requireThat((status.stage==='arrival'&&['rest','account'].includes(choice))||(status.stage==='followup'&&choice==='acknowledge'),'Esta respuesta ya está registrada o aún no está disponible.');
 const w=copy(source),f=w.aftermath.rescueReturn;
 if(choice==='acknowledge')f.closed=true;else f.approach=choice;
 return w;
}
export function returnScene(w){
 const status=returnStatus(w);if(!status)return null;
 const f=w.aftermath.rescueReturn,o=f.outcome,paragraphs=[];
 if(status.stage==='arrival'){
  paragraphs.push(status.local?'Adasme aparta las cajas del banco. El operativo se presenta mientras Bruno lo ayuda a acomodarse: «Darío. Antes de que me sigan diciendo el que faltaba». Pide que dejen su mochila donde pueda verla.':'Adasme envía un mensaje desde Vicuña Mackenna. El operativo se llama Darío. Ya está a resguardo y pidió conservar su mochila junto al banco. Adasme quiere acordar con el equipo cómo completar lo que falta del informe.');
  paragraphs.push(o.mobility==='carried'?'El registro deja claro que tuvieron que cargarlo. Darío quiere explicar dónde se separó del grupo, pero primero necesita que le acomoden la pierna. Adasme pide ayuda para atenderlo antes de seguir hablando.':o.mobility==='walking'?'Darío pudo volver caminando acompañado. Ahora le cuesta soltar las correas. Dice que quiere explicar lo ocurrido antes de que los demás decidan por qué se quedó atrás.':'El registro anterior confirma el regreso, pero no conserva cómo se encontraba ni qué ayuda recibió. Adasme no completa esos espacios de memoria: deja esas preguntas para Darío.');
  if(o.assisted===true)paragraphs.push('Adasme anota el agua y la comida que compartieron durante la extracción. «Eso también va en el parte. No quiero que quede solo la hora de llegada».');
  if(o.ammoGiven===4)paragraphs.push('Darío entrega las cuatro municiones que recibió al reunirse con los Mensajeros. Pide que vuelvan a la reserva de Vicuña; no quiere quedarse con equipo que otro está esperando.');
  paragraphs.push(o.combats>0?'Adasme separa el informe de los enfrentamientos del relato de Darío. «Tenemos que avisar de los contactos armados. Eso lo podemos contar nosotros; no hace falta que él responda por todo ahora».':'Adasme confirma que no hubo enfrentamientos durante la extracción. Cierra la cuenta de la recompensa y deja otra hoja sobre la mesa. «Ahora falta saber qué cambiamos para que no vuelva a pasar».');
  paragraphs.push('Darío acepta descansar si el equipo deja primero su versión. También ofrece ubicar el punto donde se separó, sin repetir todo el trayecto. La atención no depende de que declare.');
  return {title:status.local?'Después de traer a Darío':'El regreso de Darío',paragraphs,choices:[{id:'rest',label:'Dejar nuestra versión y aplazar sus preguntas'},{id:'account',label:'Reconstruir con Darío solo el punto de separación'}],note:'Las dos respuestas mantienen su atención. Se recordarán en la conversación posterior; el pago y el plazo del encargo ya están cerrados.'};
 }
 if(status.stage==='waiting')return {title:'Una respuesta pendiente',paragraphs:[f.approach==='rest'?'Adasme recibe la versión del equipo y deja pendiente la de Darío. Cuando él quiera hablar, podrá corregirla sin tener que justificar por qué necesitó descansar.':'Adasme registra solo el punto que Darío quiso señalar. Él recuerda haberse detenido a sujetar una caja mientras el resto pasaba. No le piden reconstruir ahora toda la extracción.','El próximo relevo llevará la respuesta a Los Héroes. Puedes recorrer el regreso desde el mapa; la conversación quedará disponible al terminar el viaje.'],choices:[],note:'Tu respuesta está guardada. No hace falta repetir la extracción.'};
 paragraphs.push('El relevo de Vicuña dejó una hoja para los Mensajeros en Los Héroes. Adasme escribió el encabezado; Darío añadió unas líneas al final.');
 paragraphs.push(f.approach==='rest'?'Darío leyó después el informe que dejaron. «Gracias por no hacerme responder ahí mismo. Hay una cosa que quiero corregir: no me fui del grupo. Me detuve con la caja y pensé que iban a esperarme». Adasme adjunta esa corrección, conservando también lo que vio el equipo.':'Darío revisó la marca que hicieron juntos en el plano. «Es ahí. Yo estaba sujetando la caja cuando dejaron de oírse los pasos. No quiero que el que vaya después tenga que elegir entre soltar la carga o quedarse solo». Adasme incorporó esa observación al parte.');
 paragraphs.push(o.mobility==='carried'?'La última línea es más corta: todavía necesita ayuda para moverse y no tiene fecha de salida. Por ahora revisa con otro compañero las correas de las cajas que van a llevar.':o.mobility==='walking'?'Darío pidió quedarse este turno revisando las correas con otro compañero. Haber podido volver a pie no significa que quiera salir otra vez de inmediato.':'La nota no añade un diagnóstico ni una fecha de salida. Darío pidió revisar las correas con otro compañero antes de volver a encargarse de una carga.');
 paragraphs.push(f.approach==='rest'?'Adasme añadió una segunda voz al informe. En el registro de Vicuña quedan la versión del equipo y la corrección de Darío; queda escrito cuándo dejó de oír al resto.':'Adasme cambió la hoja de salida del relevo: cada caja queda asignada a dos personas, y la revisión se hace antes de entrar al paso. Darío pidió esa tarea para el turno que sigue.');
 return {title:status.stage==='closed'?'Lo que quedó después del regreso':'La respuesta de Darío',paragraphs,choices:status.stage==='closed'?[]:[{id:'acknowledge',label:'Guardar la respuesta con el registro del equipo'}],note:status.stage==='closed'?'Conversación conservada. Puedes volver a leerla desde Adasme.':'Mensaje del relevo de Vicuña · puedes guardarlo junto al registro del equipo.'};
}
