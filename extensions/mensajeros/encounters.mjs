import {scriptAt,runAssignment} from './corridors.mjs';
// Authored situations have a place, a prerequisite and a remembered consequence.
// New runs opt in; already drawn encounters and legacy runs keep their original roll.
export const sectors = {
 norte:{name:'Abastecimiento del norte',nodes:['libertadores'],art:'day-valley-perimeter.webp',quiet:'Los cajones vacíos viajan hacia los cultivos. Bruno se aparta para dejar pasar la carretilla; aquí el regreso también lleva carga.'},
 centro:{name:'Red de refugios del centro',nodes:['plaza','uchile','heroes','moneda','republica'],art:'day-market.webp',quiet:'Junto al andén han separado las filas de abastecimiento y de relevos. Rocío comprueba el destino en la etiqueta antes de seguir.'},
 sur:{name:'Talleres y corredor de carga',nodes:['toesca','parque','rondizzoni','franklin','biobio','nuble'],art:'station-ruins.webp',quiet:'Se oyen herramientas detrás de los cierres. Tomás distingue los golpes regulares del taller y pide que no los confundan con pasos.'},
 enlace:{name:'Enlace de la Línea 6',nodes:['estadio','nunoa','ines','leones'],art:'day-station-entrance.webp',quiet:'Los relevos se cruzan con tablillas de destino. Rocío lee los cambios a mano: el horario impreso dejó de servir hace tiempo.'},
 oriente:{name:'Controles de la Línea 4',nodes:['vicuna','macul','las-torres','quilin','presidentes','grecia','orientales','egana','bolivar','gales','bilbao','colon','tobalaba','escotilla','provisorio'],art:'uno-corridor.webp',quiet:'El equipo espera el barrido de una luz antes de cruzar. Bruno sujeta los cierres de las mochilas para que no golpeen las barandas.'}
};
export function sectorFor(node){return Object.entries(sectors).find(([,s])=>s.nodes.includes(node))?.[0]||'centro';}
const choice=(id,label,result,extra={})=>({id,label,result,...extra});
const scenes=[
 {id:'norte-turnos',sector:'norte',at:['libertadores'],title:'El cajón que volvió vacío',text:'Una encargada de carga cuenta los cajones devueltos. Falta uno y nadie quiere firmar la salida. «Después dicen que perdimos comida nosotros». Bruno señala el número repetido en dos etiquetas. Ella le entrega la tablilla: necesita una corrección, no que le digan que se calme.',choices:[choice('revisar','Cotejar las etiquetas con ella · 3 min','Encuentran una etiqueta duplicada. La encargada corrige el registro delante de Bruno. «En Plaza pregunten por este turno; así no vuelven a cobrar el cajón».',{minutes:3}),choice('anotar','Anotar la discrepancia y seguir · 1 min','Rocío copia ambos números sin certificar la entrega. La encargada guarda el cajón aparte: el turno siguiente tendrá que revisarlo.',{minutes:1})]},
 {id:'plaza-turnos',sector:'centro',at:['plaza'],requires:'norte-turnos',title:'La cuenta llega a Plaza',text:'En la mesa de distribución vuelven a pedir el número del cajón. La encargada de turno tiene a tres personas esperando; quiere cerrar la cuenta antes de abrir otra fila.',choices:[choice('mostrar','Mostrar lo que registraron · 1 min','La encargada incorpora la anotación y deja a la vista quién revisó la carga. No tendrán que volver a contar la misma historia en el próximo relevo.',{minutes:1}),choice('seguir','Dejar la cuenta para el relevo y continuar','Rocío indica de dónde vienen. La encargada conserva la consulta abierta; no firma por una entrega que no ha comprobado.')]},
 {id:'centro-lista',sector:'centro',at:['uchile'],title:'Un nombre en dos listas',text:'Una mujer pregunta por su padre en la mesa de relevos. Figura como llegado en una hoja y pendiente en otra. «Si pasó, díganme hacia dónde». Tomás pide que lean las fechas antes de mandar a nadie a buscarlo.',choices:[choice('fechas','Comparar las fechas · 2 min','La llegada corresponde al turno anterior. La mujer decide esperar al relevo correcto. «Gracias por decirme lo que saben. Ya me hicieron ir a dos andenes».',{minutes:2}),choice('responsable','Buscar a quien lleva el registro · 1 min','Rocío deja la consulta en manos del responsable de la lista. La mujer se queda con él; el equipo sigue sin inventarle una respuesta.',{minutes:1})]},
 {id:'sur-carro',sector:'sur',at:['toesca','rondizzoni'],title:'No cabe otra carga',text:'Un mecánico intenta sacar una rueda de debajo de un carro. La escalera de servicio está libre, pero Bruno tendría que subir las mochilas una por una. «Si empujan ahora me pillan la mano», advierte el hombre. Pide que primero sostengan el eje.',choices:[choice('sostener','Sostener el eje y despejar el carro · 3 min','Bruno espera la señal antes de levantar. El mecánico saca la rueda y aparta el carro. «En Franklin todavía funciona el banco de pruebas. Si oyen un motor parejo, es nuestro».',{minutes:3}),choice('escalera','Usar la escalera · 1 min · desgaste 3','Suben las mochilas de a una. Desde arriba oyen al mecánico pedir ayuda a otro taller; el carro sigue obstruyendo el paso.',{minutes:1,wear:3})]},
 {id:'sur-bloqueo',sector:'sur',at:['franklin','biobio'],travelOnly:true,mandatory:true,electronic:true,category:'hostile',title:'El dron no abandona el paso',text:'El taller ha bajado la persiana a medias. Un dron atrapado entre las guías apunta al único corredor transitable. Tomás prueba el receptor y niega con la cabeza: responde por cable, no por radio. No hay un desvío que soporte la carga. Para cruzar hay que inutilizarlo; todavía pueden volver al andén anterior.',choices:[{id:'fight',label:'Inutilizar el dron y abrir el corredor',combat:true}],result:'El motor se detiene. Desde el taller levantan la persiana y desconectan el cable de control. El corredor queda abierto para los próximos viajes; el ruido del combate sí ha aumentado la vigilancia.'},
 {id:'l6-relevo',sector:'enlace',at:['estadio','nunoa'],title:'El relevo que no llegó',text:'Una mensajera mira las mochilas del grupo y pregunta si han visto a su reemplazo. Lleva dos turnos en el mismo banco. «Si me voy, dejan los paquetes aquí. Si me quedo, nadie avisa en mi casa». Rocío pregunta primero a quién hay que dar el aviso.',choices:[choice('llevar','Llevar un aviso al puesto de Los Leones · 1 min','La mensajera dicta un aviso corto y el número de su puesto. Rocío lo repite para comprobarlo. No promete traer a su reemplazo; sí entregar esas palabras.',{minutes:1}),choice('radio','Ayudarla a localizar una radio · 3 min','Tomás localiza el puesto que recibe mensajes. La mensajera consigue dejar el suyo antes de volver al banco; el grupo no asume otro recado.',{minutes:3})]},
 {id:'l6-aviso',sector:'enlace',at:['leones'],requires:'l6-relevo',when:'llevar',title:'Un recado sin paquete',text:'En Los Leones el operador pregunta quién envía el aviso. Rocío busca el número que anotó en el banco. Hay una fila para hablar; el mensaje puede entregarse por escrito.',choices:[choice('entregar','Entregar el aviso firmado · 1 min','El operador registra el puesto y repite el mensaje por el canal de relevos. Anota la hora, pero no confirma que la familia lo haya recibido. Rocío guarda ese límite junto al comprobante.',{minutes:1}),choice('esperar','Esperar la lectura por radio · 3 min','Escuchan al operador transmitir el aviso completo. Todavía falta una respuesta de destino. «Al menos ya salió de acá», dice Bruno al recoger el comprobante.',{minutes:3})]},
 {id:'oriente-control',sector:'oriente',at:['tobalaba','colon'],title:'Dos sellos para el mismo paso',text:'La guardia no reconoce el sello del relevo anterior. Rocío mantiene las manos lejos del cierre de su mochila. «Pueden verificar el destino sin abrir la carga». La guardia llama a una compañera: aquí no basta con que alguien del centro conozca al equipo.',choices:[choice('verificar','Esperar la verificación del sello · 3 min','La compañera reconoce el registro y anota la equivalencia. La guardia devuelve la etiqueta sin romper el cierre. Conservan la constancia para otro control de esta línea.',{minutes:3}),choice('inspeccion','Mostrar el inventario de las mochilas · 1 min','Bruno enumera el equipo propio mientras Rocío sostiene los sellos de la carga. La revisión termina sin abrir paquetes; el control anota que verificó las mochilas.',{minutes:1})]},
 {id:'oriente-bomba',sector:'oriente',at:['egana','grecia'],title:'La bomba trabaja en seco',text:'Una técnica ha cortado el paso junto a la bomba. «La encendieron sin revisar la toma». El agua alcanza la primera marca de la escalera; aún queda un borde seco. Tomás escucha el arranque fallido y pide que corten la corriente antes de acercarse.',choices:[choice('cortar','Ayudar a cortar y cebar la bomba · 3 min','La técnica desconecta la alimentación antes de abrir la toma. El motor vuelve a aspirar agua. Marca el borde seco para el siguiente relevo; aún no declara despejada toda la galería.',{minutes:3}),choice('borde','Cruzar por el borde seco · desgaste 2','Rocío cruza primero y señala dónde apoyar los pies. Pasan sin tocar la instalación. La técnica sigue esperando otra mano para abrir la toma.',{wear:2})]},
 {id:'oriente-bomba-vuelta',sector:'oriente',at:['egana','grecia'],requires:'oriente-bomba',title:'La marca de agua',text:'La técnica sigue midiendo el nivel. Reconoce las mochilas antes de que lleguen a la escalera.',choices:[choice('comprobar','Comprobar por dónde sigue abierto el paso · 1 min','La técnica señala la marca actual y el tramo que todavía no ha revisado. Bruno ajusta la carga para cruzar sin rozar la instalación.',{minutes:1})]},
 {id:'vicuna-recepcion',travelOnly:true,sector:'oriente',at:['vicuna','macul'],title:'Antes de la puerta',text:'Un auxiliar de Vicuña busca una etiqueta en un saco de ropa. «Me dejaron esto sin nombre y ahora todos preguntan si es suyo». No quiere otra promesa: pide que el equipo diga con quién viene a hablar antes de entrar.',choices:[choice('destino','Dar el nombre del contacto y esperar turno · 1 min','Rocío identifica al contacto. El auxiliar los sitúa en la fila correcta y vuelve al saco. Aquí una llegada empieza por saber quién se hará cargo de recibirla.',{minutes:1}),choice('etiqueta','Ayudar a encontrar la etiqueta · 2 min','Bruno sostiene el saco mientras el auxiliar revisa la costura interior. Encuentran un nombre; el auxiliar llama al destinatario antes de atender al equipo.',{minutes:2})]}
];
export function prepareEncounters(data){
 for(const s of scenes)data.events.push({...s,category:s.category||'decision',scripted:true,regional:true,regions:['centro','l6','oriente'],image:'../../backgrounds/'+sectors[s.sector].art});
 for(const [id,s]of Object.entries(sectors))data.events.push({id:'paso-'+id,category:'quiet',scripted:true,regional:true,passage:true,title:s.name,text:s.quiet,image:'../../backgrounds/'+s.art,choices:[{id:'continue',label:'Continuar'}]});
 return data;
}
export function restoreEncounters(w){
 w.encounters??={version:1,resolved:{}};
 const m=w.encounters;
 if(m.version!==1||!m.resolved||Array.isArray(m.resolved)||typeof m.resolved!=='object'||!Object.entries(m.resolved).every(([id,value])=>{const s=scenes.find(x=>x.id===id);return s&&(s.mandatory?value==='cleared':s.choices.some(c=>c.id===value));}))throw Error('Memoria del recorrido inválida.');
 if(w.run?.directorVersion!==undefined&&w.run.directorVersion!==1)throw Error('Versión de recorrido inválida.');
 return w;
}
export function directEncounter(data,w,source){
 const r=w.run,p=r.pending;
 if(data.content_version!=='2026-09-18.production.2'||r.directorVersion!==1||['rescue','delivery'].includes(p.category)||scriptAt(data,r,p.edgeIndex))return;
 if(source.run.rolls[p.edgeIndex]){
  if(w.encounters.resolved[p.id]){p.id='paso-'+sectorFor(p.to);p.category='quiet';r.rolls[p.edgeIndex]={id:p.id,category:p.category};}
  return;
 }
 const memory=w.encounters.resolved,travel=!!data.journeys[r.mission];
 const available=scenes.filter(s=>!memory[s.id]&&(!s.travelOnly||travel)&&s.at.includes(p.to)&&(!s.requires||memory[s.requires]&&(!s.when||memory[s.requires]===s.when)));
 // A departure from the northern depot introduces its account before reaching Plaza.
 if(p.from==='libertadores'&&!memory['norte-turnos'])available.unshift(scenes[0]);
 let scene=available[0];
 // Consecutive non-landmark incidents get a breather. Required corridors retain an encounter.
 if(!scene&&p.category!=='checkpoint'){
  const edge=data.routes[runAssignment(data,w).route].edges[p.edgeIndex];
  if(p.category==='quiet'||!edge.required_encounter&&r.history.length&&r.history.at(-1).category!=='quiet')scene={id:'paso-'+sectorFor(p.to),category:'quiet'};
 }
 if(scene){p.id=scene.id;p.category=scene.category||'decision';r.rolls[p.edgeIndex]={id:p.id,category:p.category};}
}
export function encounterText(data,w){
 const e=data.events.find(e=>e.id===w.run?.pending?.id);if(!e)return '';
 const m=w.encounters?.resolved||{};
 if(e.id==='plaza-turnos')return e.text+(m['norte-turnos']==='revisar'?' Bruno muestra la corrección que hizo con la encargada del norte.':'Rocío aclara que copiaron los números, pero no comprobaron la entrega.');
 if(e.id==='oriente-bomba-vuelta')return e.text+(m['oriente-bomba']==='cortar'?' La marca ha bajado desde que ayudaron a cebar la bomba. «Sigue funcionando», dice, y les muestra el borde libre.':'La marca sigue alta. «Conseguí ayuda después de que pasaron, pero todavía queda agua». Les pide que no bajen del borde seco.');
 return e.text;
}
export function rememberEncounter(data,w,p,option){
 const e=data.events.find(e=>e.id===p.id);if(!e?.regional)return;
 if(e.passage){w.run.log.push(e.text);w.run.lastEncounter={title:e.title,text:e.text};return;}
 if(e.mandatory&&p.combat?.phase!=='loot')return;
 w.encounters.resolved[e.id]=e.mandatory?'cleared':option.id;
 const text=e.mandatory?e.result:option.result;
 if(text){w.run.log.push(text);w.run.lastEncounter={title:e.title,text};}
}
export function passageReady(data,w){
 const p=w.run?.pending,e=data.events.find(e=>e.id===p?.id);
 return !!(w.run?.directorVersion===1&&w.run.status==='active'&&!p?.combat&&e?.passage&&e.choices.length===1);
}
export function routeWarning(data,w,route){
 return !w.encounters?.resolved['sur-bloqueo']&&route.nodes.some(n=>['franklin','biobio'].includes(n))?'Aviso del corredor de carga: un dron bloquea el paso entre los talleres. En el traslado habrá que combatir para cruzar; se puede retroceder, pero el humo y los desvíos no abren esa puerta.':'';
}
