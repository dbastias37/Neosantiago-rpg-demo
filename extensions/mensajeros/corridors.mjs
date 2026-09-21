import {jimenezMemory} from './jimenez.mjs';
import {guzmanMemory} from './guzman.mjs';
import {beatrizMemory} from './beatriz.mjs';
// Early assignments are authored journeys. Keep the previous definitions for
// a team already on the road: an update must never move its cargo or checkpoint.
import {reversePath} from './network.mjs';
const copy=x=>JSON.parse(JSON.stringify(x));
const choice=(id,label,result,extra={})=>({id,label,result,...extra});
export function assignment(data,w,id){
 const record=w.run?.mission===id&&w.run.status!=='abandoned'?w.run:w.completed?.[id];
 const m=record?.corridorVersion===1&&(data.legacyMissions?.[id]||data.legacyJourneys?.[id])||id==='jimenez-01'&&record&&record.jimenezVersion!==1&&data.jimenezLegacyMission||id==='guzman-01'&&record&&record.guzmanVersion!==1&&data.guzmanLegacyMission||id==='beatriz-01'&&record&&record.beatrizVersion!==1&&data.beatrizLegacyMission||data.missions[id]||data.journeys?.[id];
 const payment=record?.rewardTerms||(record&&data.previousTerms?.[id]&&(record.corridorVersion===1&&data.legacyMissions[id]?data.legacyMissions[id]:data.previousTerms[id]));
 return payment?{...m,reward:payment.reward,late_step_minutes:payment.late_step_minutes,late_penalty:payment.late_penalty}:m;
}
export function runAssignment(data,w){const r=w.run;if(r?.corridorVersion===1){const m=data.legacyMissions?.[r.mission]||data.legacyJourneys?.[r.mission];if(m)return r.rewardTerms?{...m,...r.rewardTerms}:m;}return assignment(data,w,r?.mission);}
export function scriptAt(data,r,index){if(r.jimenezVersion===1&&data.jimenezScripted?.[r.mission+':'+index])return data.jimenezScripted[r.mission+':'+index];if(r.guzmanVersion===1&&data.guzmanScripted?.[r.mission+':'+index])return data.guzmanScripted[r.mission+':'+index];if(r.beatrizVersion===1&&data.beatrizScripted?.[r.mission+':'+index])return data.beatrizScripted[r.mission+':'+index];return (r.corridorVersion===2?data.corridorScripted:data.scripted)?.[r.mission+':'+index]||null;}
export function prepareCorridors(d){
 d.legacyMissions={};d.corridorScripted=copy(d.scripted);
 for(const id of ['relevo-01','romero-01','morales-01','ana-01']){
  d.legacyMissions[id]=copy(d.missions[id]);
  for(const key of Object.keys(d.corridorScripted))if(key.startsWith(id+':'))delete d.corridorScripted[key];
 }
 function route(id,nodes){
  // Use established connections only. No invented Metro links or new shortcuts.
  const edges=nodes.slice(1).map((to,i)=>{
   const from=nodes[i],all=Object.values(d.routes).flatMap(r=>r.edges);
   let edge=all.find(e=>e.from===from&&e.to===to);
   if(!edge){const back=all.find(e=>e.from===to&&e.to===from);if(back)edge={...back,from,to,...(back.path?{path:reversePath(back.path)}:{})};}
   if(!edge)throw Error('Corredor sin conexión: '+from+' / '+to);
   return {...edge,minutes:6,wear:2,risk:'low'};
  });
  d.routes[id]={id,nodes,edges};return id;
 }
 Object.assign(d.missions['relevo-01'],{
  name:'El turno que no alcanza',route:route('relevo-corredor',['heroes','moneda','uchile','plaza']),recipient:'Ana · Plaza de Armas',
  reward:{base:18,stealth_bonus:0},time_limit:32,
  summary:'Conecta Los Héroes con Plaza de Armas: averigua por qué falta un relevo y acuerda cómo compartir el paso entre abastecimiento y familias.',
  briefing:'La Moneda pide reemplazos, la posta necesita recibir carga y Ana espera gente en Plaza. Cada puesto manda una lista distinta. No puedo sacar otro grupo de acá sin saber dónde lo van a dejar esperando. Hablen con los dos puestos y lleven el acuerdo a Ana. Ella cierra la cuenta y les paga allá; no tienen que volver solo para traerme un papel.',
  introduction:'Tu primera salida une tres puestos que dependen entre sí. El recorrido termina en Plaza, donde podrás escoger el siguiente trabajo.',
  delivery_text:'Ana tiene un banco ocupado por sacos y otro por personas que esperan pasar. Antes de recibir la hoja pregunta quién va primero y quién avisará al resto. «Si esto cambia, díganmelo ahora. Ya mandé una vez a una familia a un puesto que no la esperaba».',
  dialogues:{success:'Voy a trabajar con lo que acordaron, no con la lista de ayer. Aquí dejaron propuestas Romero y Morales. Elijan a quién pueden ayudar; las dos salen desde Plaza.'},
  effect:'El corredor central queda coordinado. Desde Plaza puedes llevar la reserva a República o reconocer el acceso a los talleres. Ana conserva el acuerdo del paso.'
 });
 Object.assign(d.missions['romero-01'],{
  name:'Una reserva, tres puestos',route:route('romero-corredor',['plaza','uchile','moneda','heroes','republica']),
  pickup:{node:'uchile',cargo:{'medical-case':1}},time_limit:46,
  summary:'Recoge la reserva de la posta y llévala a República. En el camino hay un vigía esperando atención y un relevo que necesita saber qué puede prometer.',
  briefing:'Dejé la solicitud con Ana para que puedan salir desde Plaza. La reserva está en Universidad de Chile. La necesitamos en República, pero el vigía de La Moneda lleva pidiendo un cambio de vendaje desde ayer. Pueden usar el botiquín del equipo o traerme su ubicación para mandar a alguien. El estuche va sellado: no alcanza para repartirlo sin saber qué falta después.',
  introduction:'La solicitud de Romero viajó con el relevo. Ana te la entrega aquí; el encargo cruza el corredor y termina en la posta de República.',
  delivery_text:'Romero comprueba el precinto mientras una auxiliar despeja una bandeja. «Antes de guardar esto: ¿qué pasó con el vigía?». No pregunta cuántas estaciones cruzaron. Necesita saber si puede empezar a trabajar aquí o debe mandar a alguien de inmediato.',
  dialogues:{success:'La reserva está completa. Dejen la hoja de atención junto al estuche; el próximo turno necesita las dos cosas.'},
  effect:'La reserva queda registrada en República. Los botiquines pasan a costar 6 créditos en Los Héroes; la posta recuerda qué atención quedó pendiente.',
  lead:'Entrega en Plaza el acuerdo entre puestos para recibir la solicitud de Romero.'
 });
 Object.assign(d.missions['morales-01'],{
  name:'Hasta donde llega el carro',route:route('morales-corredor',['plaza','uchile','moneda','heroes','toesca','parque','toesca','heroes']),time_limit:64,
  summary:'Lleva las observaciones de la posta hasta el acceso de los talleres. Comprueba por dónde cabe una carga y regresa a Los Héroes con límites que otros puedan usar.',
  briefing:'Ana tiene mi hoja de reconocimiento. Salgan desde Plaza y recojan las marcas de la posta. Después de Los Héroes, sigan hasta Parque O’Higgins: dicen que se puede pasar con un carro, pero nadie puso el ancho ni dijo de cuándo era el aviso. Comprueben lo que puedan y vuelvan hasta acá. No me escriban «despejado» si solo pasó una persona. La copia para Noa debe decir exactamente qué vieron.',
  introduction:'La propuesta de Morales está en Plaza. El reconocimiento amplía tu mapa hacia Toesca y Parque O’Higgins, en el borde de los talleres.',
  delivery_text:'Morales retira una flecha del plano cuando ve el ancho anotado. Un cargador espera a su lado con las correas puestas. «Díganme si llevo el carro o las mochilas. Lo que me cuesta es enterarme abajo».',
  lead:'Entrega el acuerdo en Plaza para recoger la hoja de reconocimiento de Morales.'
 });
 Object.assign(d.missions['ana-01'],{
  name:'Cruzar con lo que queda',
  summary:'Acompaña el primer grupo desde Plaza hasta Los Héroes. El acuerdo ya existe; ahora hay que conseguir que las personas y sus pertenencias puedan cruzar.',
  briefing:'Una cosa es acordar el paso y otra salir con todo lo que te queda. Dos familias están listas. Una lleva a su madre; la otra trae herramientas para trabajar al llegar. Yo me quedo recibiendo carga. Acompáñenlas hasta Los Héroes y entreguen este registro a quien las reciba. Si una lista no coincide, aclárenlo antes de dejar a alguien esperando solo.',
  delivery_text:'La responsable de Los Héroes busca sitio para el grupo. Una mujer pregunta dónde puede sentar a su madre; el hombre de las herramientas no suelta el bolso hasta que le señalan una mesa. La responsable recibe el registro después de indicarles dónde dejar las cosas.',
  dialogues:{success:'Están recibidos. Voy a anotar quién necesita ayuda en la siguiente salida. Ana tendrá la confirmación con nuestro relevo.'},
  introduction:'La entrega anterior permitió preparar esta salida. Ana necesita acompañantes para llevar a las familias por el corredor que ya conoces.'
 });
 const add=(key,id,title,text,choices,extra={})=>{d.corridorScripted[key]={id,title,text,choices,corridor:true,...extra};};
 add('relevo-01:0','corredor-relevo','No se fue sin avisar',
  'Elena cuenta los nombres del relevo de La Moneda y vuelve a empezar. Falta su hermano. «Si se quedó trabajando, que me avise a mí también». Rocío ofrece esperar la respuesta del depósito. Bruno señala a los dos guardias que deben salir hacia la posta: pueden llevar la consulta firmada sin detenerlos. Elena quiere una respuesta; los guardias quieren terminar el turno.',[
   choice('confirm','Esperar con Elena la respuesta · 4 min','El depósito responde: su hermano sigue allí ordenando una descarga. Elena pide que la incluyan en el próximo aviso. Rocío lo escribe delante de ella.',{minutes:4,flag:'relevo_confirmado'}),
   choice('return-message','Llevar la consulta con el relevo · 1 min','Elena firma la consulta y deja el número del puesto. Bruno la guarda separada del horario: entregar esa pregunta no equivale a saber dónde está su hermano.',{minutes:1,flag:'pregunta_relevo'})
  ]);
 add('ana-01:0','corredor-familias','La lista no camina sola',
  'En la posta, Inés encuentra dos nombres que no están en su copia. La mujer que sostiene a su madre se acerca a la mesa. «No la voy a dejar acá mientras arreglan una hoja». Rocío puede contrastar ambas listas con las familias o pedir confirmación al puesto de Ana. Inés ofrece un banco: nadie tendrá que esperar de pie ni separado mientras lo aclaran.',[
   choice('verify','Contrastar las listas con las familias · 5 min','Rocío lee los nombres con quienes viajan y deja ambas listas corregidas. La mujer vuelve a acomodar a su madre antes de salir; ahora las dos figuran en la misma recepción.',{minutes:5,flag:'acuerdo_verificado'}),
   choice('contact','Pedir confirmación al puesto de Ana · 3 min','El puesto de Ana confirma los dos nombres. Inés los adjunta a su copia con la procedencia del aviso. El grupo puede seguir junto; queda registrado quién aclaró la diferencia.',{minutes:3,flag:'acuerdo_confirmado'})
  ]);
 add('ana-01:1','corredor-bolso','No son cosas que sobren',
  'Antes de La Moneda se rompe una correa del bolso de herramientas. Su dueño lo recoge antes de que Bruno pueda ayudar. «Si llego sin esto, ¿con qué voy a trabajar?». No pide abandonar nada. Pueden repartir el peso entre el equipo o detenerse a rehacer la correa. La mujer con su madre espera a un lado; tampoco quiere que el grupo vuelva a separarse.',[
   choice('share','Repartir las herramientas entre el equipo · 2 min · desgaste 3','El dueño cuenta las herramientas antes de repartirlas. Bruno repite quién lleva cada una. Siguen juntos; devolverán el contenido delante de él al llegar.',{minutes:2,wear:3,flag:'herramientas_repartidas'}),
   choice('strap','Rehacer la correa con su dueño · 4 min','Tomás sostiene el extremo mientras el dueño rehace el nudo y prueba el peso. «Así sí». Vuelve a ponerse el bolso; el grupo sale cuando la madre está lista.',{minutes:4,flag:'correa_reparada'})
  ]);
 add('relevo-01:1','corredor-posta','La carga y quienes esperan',
  'En Universidad de Chile, un carro ocupa el único pasillo ancho. Inés, la encargada, sostiene una taza que se le ha enfriado. «Me piden sacar a las familias y recibir comida a la misma hora. Uno de esos grupos tiene que esperar». Rocío propone turnos separados. Bruno ofrece organizar grupos pequeños que crucen junto a cada carga; requerirá acompañarlos. Inés acepta ambos arreglos si Ana se hace cargo al otro extremo.',[
   choice('windows','Acordar turnos separados de paso · 3 min','Inés anota una ventana para la carga y otra para las familias. Tendrán que esperar su turno, pero nadie necesita abandonar su puesto para acompañarlas.',{minutes:3,flag:'paso_turnos'}),
   choice('pairs','Organizar grupos acompañados · 5 min','Separan grupos que caben junto al carro. Inés apunta cuántos acompañantes debe poner Plaza. Las familias podrán salir antes; Ana tendrá que sacar gente de recepción.',{minutes:5,flag:'paso_acompanado'})
  ]);
 add('romero-01:0','reserva-recuento','Lo que queda en la posta',
  'Inés pone el estuche sobre una mesa y pide que cuenten los cierres con ella. «La última entrega salió bien. Después faltó una caja y tuve que responder por las dos». El contenido está sellado; pueden cotejar los números exteriores con el registro o pedir que firme también el relevo que lo recibió. Nadie necesita abrirlo.',[
   choice('count','Cotejar números y dejar copia · 3 min','Rocío coteja los números exteriores. Inés se queda una copia: podrá acreditar lo que salió sin depender de que el equipo vuelva.',{minutes:3,flag:'reserva_cotejada'}),
   choice('witness','Buscar al relevo que recibió el estuche · 5 min','El relevo firma la salida junto a Inés. Él recuerda el bulto; ella conserva la hora. La responsabilidad deja de recaer solo en su firma.',{minutes:5,flag:'reserva_testigo'})
  ]);
 add('romero-01:1','reserva-vigia','Todavía tiene que volver a casa',
  'El vigía de La Moneda se llama Julián. Aparta una silla con el pie para no mover el brazo. «No necesito que me lleven. Necesito que alguien me cambie esto antes de tomar el relevo». El estuche de Romero sigue sellado. Bruno puede ayudar con un botiquín del equipo; Rocío puede dejar la ubicación y la petición para que Romero organice la visita. Julián no quiere figurar como atendido si solo dejaron un aviso.',[
   choice('treat','Cambiar el vendaje con el botiquín del equipo · 4 min','Bruno cambia el vendaje con permiso de Julián. Él flexiona los dedos y se queda sentado. Rocío anota la atención hecha y la revisión todavía pendiente; no lo declara listo para trabajar.',{cost:{medkit:1},minutes:4,flag:'vigia_asistido'}),
   choice('signal','Registrar dónde espera y llevar el aviso · 2 min','Julián indica el banco donde esperará. Rocío escribe «atención pendiente» y se lo lee. «Eso. Que después no manden a otro pensando que yo ya salí».',{minutes:2,flag:'romero_avisado'})
  ]);
 add('romero-01:2','reserva-relevo','La pregunta del siguiente turno',
  'En Los Héroes, la auxiliar que prepara el relevo pregunta por qué una nota viaja fuera del estuche. Rocío explica que contiene una petición de atención. La auxiliar ofrece copiarla aquí o ir con ellos hasta República para recibir directamente las indicaciones. Si sale, otra persona tendrá que cubrirle la mesa.',[
   choice('copy','Dejar una copia para el siguiente turno · 2 min','La auxiliar copia el estado de la atención y permanece en su mesa. Romero recibirá la nota original; este turno ya sabe a quién consultar.',{minutes:2,flag:'posta_copia'}),
   choice('escort','Esperar que la auxiliar consiga relevo y acompañarla · 4 min','Una compañera acepta cubrir la mesa. La auxiliar camina con el equipo hasta República para hacerse cargo de las indicaciones de Romero.',{minutes:4,flag:'posta_enlace'})
  ]);
 const old=copy(d.scripted['morales-01:1']);old.id='corredor-marcas';old.corridor=true;
 old.choices[0].result='Rocío recorre el desvío y señala dónde vuelve a unirse al paso. Anota por separado las huellas y el arrastre; no atribuye ambos a un mismo grupo.';
 old.choices[1].result='Desde el andén registran la dirección y el momento en que cambian las marcas. El interior del desvío queda sin revisar. Bruno dibuja ese límite en la hoja.';
 d.corridorScripted['morales-01:0']=old;
 add('morales-01:3','corredor-medida','La medida que falta',
  'En Toesca, Celso intenta meter un carro vacío por una abertura. La rueda roza una plancha doblada. «Ayer me dijeron que estaba abierto. El que pasó llevaba una bolsa». Bruno puede ayudar a sujetar la plancha mientras Celso prueba el ancho. Rocío propone medir el borde y señalar el paso solo para carga a mano. Ambas comprobaciones servirán, pero no para el mismo trabajo.',[
   choice('cart','Sujetar la plancha y probar con el carro · 5 min · desgaste 3','Bruno sujeta la plancha mientras Celso hace pasar el carro vacío. Marcan el ancho y la necesidad de dos personas. Eso no prueba cuánto peso aguanta el suelo.',{minutes:5,wear:3,flag:'paso_carro'}),
   choice('packs','Medir el paso para mochilas · 3 min','Rocío mide el borde y cruza sin tocar la plancha. La hoja autoriza planificar carga a mano; el paso del carro queda sin comprobar.',{minutes:3,flag:'paso_mochilas'})
  ]);
 add('morales-01:4','corredor-limite','Hasta aquí llegó la revisión',
  'En Parque O’Higgins, una trabajadora pregunta si el informe también cubre el tramo de Rondizzoni. Rocío niega: no han llegado hasta allá. «Entonces déjenlo claro en el cartel. El último decía ruta abierta y cada uno entendió una cosa». Pueden dejar una copia con las limitaciones o marcar el límite junto a ella en el acceso.',[
   choice('notice','Dejar copia con fecha y límite · 2 min','La trabajadora fija la copia junto al acceso. El aviso termina en Parque O’Higgins; el tramo siguiente sigue pendiente de reconocimiento.',{minutes:2,flag:'limite_copiado'}),
   choice('mark','Marcar juntos el final del reconocimiento · 4 min','Rocío y la trabajadora sitúan la marca donde acaba lo observado. El cartel remite a la hoja de medidas para preparar una carga.',{minutes:4,flag:'limite_marcado'})
  ]);
 // Two quiet crossings let the observation settle. They have no confirmation
 // modal in the brisk travel flow and never reroll into filler combat.
 for(const [index,text]of [[1,'Rocío mantiene la hoja abierta hasta salir de la posta. Bruno le pide que agregue la hora: cuando otro grupo lea esas marcas, el corredor puede haber cambiado.'],[2,'Al pasar por Los Héroes, el equipo avisa que seguirá hacia los talleres. Morales señala el espacio vacío después de Toesca. «Lo que no revisen, déjenlo vacío».'],[5,'De vuelta en Toesca, Celso pregunta si el aviso llega hasta los talleres. Rocío le muestra el límite en Parque O’Higgins. Él cambia de hombro las correas y prepara solo el tramo comprobado.']])
  add('morales-01:'+index,'corredor-respiro-'+index,'La hoja sigue con el equipo',text,[{id:'continue',label:'Continuar'}],{category:'quiet',passage:true});
 for(const e of Object.values(d.corridorScripted))if(!d.events.some(x=>x.id===e.id))d.events.push({...e,category:e.category||'decision',scripted:true,regions:['centro'],image:'../../backgrounds/'+(e.id.startsWith('corredor-m')||e.id==='corredor-limite'?'station-ruins.webp':'day-market.webp')});
 return d;
}
export function restoreCorridors(data,w){
 const check=r=>{
  if(!r)return;
  if(data.legacyMissions[r.mission]||data.legacyJourneys?.[r.mission])r.corridorVersion??=1;
  if(r.corridorVersion!==undefined&&![1,2].includes(r.corridorVersion))throw Error('Versión de encargo inválida.');
  if(r.checkpoint?.snapshot){r.checkpoint.snapshot.corridorVersion??=r.corridorVersion;check(r.checkpoint.snapshot);}
 };
 check(w.run);
 for(const [id,r]of Object.entries(w.completed||{}))if(data.legacyMissions[id]){r.corridorVersion??=1;if(![1,2].includes(r.corridorVersion))throw Error('Versión de entrega inválida.');}
 return w;
}
export function rememberCorridor(data,w,p,o){
 const e=data.events.find(e=>e.id===p.id);if(!e?.corridor||w.run.pending)return;
 const text=e.passage?e.text:o.result;
 if(text){w.run.log.push(text);w.run.lastEncounter={title:e.title,text};}
}
export function arrivalAccount(r){
 if(r.corridorVersion!==2)return null;
 const f=r.flags||[],has=x=>f.includes(x);
 if(r.mission==='relevo-01')return [
  has('relevo_confirmado')?'Ana lee que Elena recibió la respuesta del depósito. «Bien. No la voy a mandar a preguntar de nuevo».':'Ana separa la consulta de Elena del horario. La entrega al relevo que va hacia el depósito; en la hoja sigue diciendo «respuesta pendiente».',
  has('paso_turnos')?'Con Inés acordaron turnos separados. Ana fija las dos ventanas en la mesa y explica a las familias cuánto tendrán que esperar. Una mujer protesta por perder el primer grupo; Ana le reserva lugar en el siguiente.':'Ana llama a dos acompañantes y deja parte de la carga sin ordenar. Las primeras familias salen con ellos. «Podemos hacerlo así, pero habrá menos manos aquí mientras vuelven».',
  'La hoja queda en Plaza. El próximo trabajo puede empezar aquí; el pago no exige desandar el corredor.'
 ].join(' ');
 if(r.mission==='romero-01')return [
  has('vigia_asistido')?'Romero lee lo que hicieron por Julián y tacha solo el cambio de vendaje. Deja pendiente una revisión. «No le prometan que mañana está para otro turno».':'Romero encuentra la ubicación de Julián y escribe una visita pendiente. «Voy a mandar a alguien. Que el relevo no lo cuente como disponible todavía».',
  has('posta_enlace')?'La auxiliar que vino con ustedes toma las indicaciones y pregunta quién cubrirá su mesa hasta que vuelva. Romero acuerda ese relevo antes de pedirle otra salida.':'Romero añade las indicaciones a la copia que quedará para el siguiente turno. El aviso está registrado; nadie afirma que Julián ya haya sido atendido.',
  has('reserva_cotejada')?'El número del estuche coincide con la copia de Inés. La auxiliar archiva la recepción junto al registro de salida.':'Romero conserva la firma del relevo junto a la de Inés. Si falta material, tendrán dónde empezar a revisar.'
 ].join(' ');
 if(r.mission==='morales-01')return [
  has('desvio_identificado')?'Rocío muestra dónde comprobó que el desvío se reúne con el corredor.':'Rocío distingue las marcas observadas del interior que no revisaron.',
  has('paso_carro')?'El cargador lee la prueba de Toesca y busca otra persona para sujetar la plancha. Morales anota «carro vacío; peso sin verificar». No ofrece el paso como una ruta segura para cualquier carga.':'El cargador deja el carro junto a la pared y prepara dos mochilas. Morales anota que no se comprobó el paso de ruedas; hará falta otro viaje para eso.',
  has('limite_marcado')?'El informe describe la marca que dejaron con la trabajadora en Parque O’Higgins.':'La copia fijada en Parque O’Higgins deja constancia de dónde terminó la revisión.',
  'Morales conserva las limitaciones en la copia para Noa. El tramo hacia Rondizzoni queda pendiente; haberlo dibujado en un plano no lo convierte en un lugar recorrido.'
 ].join(' ');
 if(r.mission==='ana-01')return [
  has('acuerdo_verificado')?'La responsable de Los Héroes recibe las dos listas corregidas y llama a las familias por sus nombres.':'La responsable adjunta la confirmación del puesto de Ana al registro de llegada. Ya no necesita mandar a las familias a preguntar otra vez.',
  has('herramientas_repartidas')?'Bruno deja las herramientas sobre la mesa, una por una. Su dueño las cuenta y vuelve a guardarlas. «Está todo».':'El dueño deja el bolso en la mesa y prueba otra vez la correa reparada. Pide un sitio donde colgarlo para no volver a cargarlo mientras espera.',
  'La mujer sienta a su madre junto al banco de recepción. Pregunta a qué hora podrán comer. La responsable le explica el turno antes de cerrar la hoja; llegar no significa saber cómo funciona este lugar.'
 ].join(' ');
 return null;
}
// Only confirmed receipts give communities knowledge. Opening a choice, failing
// or abandoning a job cannot make its intended outcome true elsewhere.
export function communityMemory(w,node){
 const read=id=>w.paid.includes(id)&&w.completed[id]?.provisional===false&&w.completed[id]?.corridorVersion===2?w.completed[id].flags||[]:null;
 const relay=read('relevo-01'),medical=read('romero-01'),survey=read('morales-01'),families=read('ana-01'),lines=[...beatrizMemory(w,node),...guzmanMemory(w,node),...jimenezMemory(w,node)];
 if(relay&&['plaza','uchile'].includes(node))lines.push(relay.includes('paso_turnos')?'El puesto sigue usando las ventanas que acordaron: una para carga y otra para familias. La siguiente salida está escrita junto a la lista.':'En la lista del puesto figuran los acompañantes del paso compartido. Ana tiene que cubrir sus tareas cada vez que salen con una familia.');
 if(medical&&node==='republica')lines.push(medical.includes('vigia_asistido')?'En la hoja de Julián figura el vendaje que cambió Bruno. La revisión sigue pendiente; el registro no lo da de alta.':'La petición de Julián sigue en la hoja de visitas pendientes. La auxiliar busca quién puede ir; recibir la reserva no resolvió por sí solo esa atención.');
 if(survey&&['toesca','heroes'].includes(node))lines.push(survey.includes('paso_carro')?'La hoja de Toesca pide dos personas para el carro y conserva la advertencia sobre el peso. Los cargadores consultan esa medida antes de salir.':'La hoja de Toesca señala carga a mano. Han apartado el carro hasta comprobar el paso de ruedas; las mochilas llevan etiquetas separadas.');
 if(families&&node==='heroes')lines.push(families.includes('herramientas_repartidas')?'El hombre de las herramientas reconoce a Bruno en recepción y le muestra dónde guardó el bolso que trajeron entre todos.':'En recepción, el dueño del bolso le acerca a Tomás la correa para que toque el nudo que repararon. Ya encontró dónde dejar las herramientas mientras se acomoda.');
 return lines;
}
export function currentPurpose(data,w){
 const r=w.run;if(!r||r.status!=='active'||r.corridorVersion!==2)return '';
 const i=r.pending?.edgeIndex??r.index;
 if(r.mission==='jimenez-01'&&r.jimenezVersion===1)return i===0?'Aclarar qué registró operaciones':i<11?'Llevar el módulo hasta el relevo de Tobalaba':i===11?'Distinguir recepción de respuesta en la prueba':'Entregar el módulo y los límites de la prueba en Los Leones';
 if(r.mission==='guzman-01'&&r.guzmanVersion===1)return i===0?'Conservar la identificación del rotor reparado':i<6?'Transportar las piezas por L6 hasta el enlace de Franklin':i<11?'Llegar a la posta con las indicaciones de montaje':i===11?'Revisar la sujeción del sensor antes de entrar a Plaza':'Entregar las piezas y registrar qué se probó en Plaza';
 if(r.mission==='beatriz-01'&&r.beatrizVersion===1)return ['Llegar a la posta sin confundir la cuenta de los cajones con los nutrientes','Recoger el envase y registrar lo que se pudo comprobar','Volver con Luz y preparar la recepción del siguiente turno','Entregar la reserva a Beatriz con las comprobaciones y dudas'][i]||'';
 if(r.mission==='relevo-01')return ['Escuchar al relevo de La Moneda','Acordar el paso en la posta','Entregar a Ana un acuerdo que pueda cumplir'][i]||'';
 if(r.mission==='romero-01')return ['Recoger y registrar el estuche sellado','Resolver qué ayuda recibirá Julián','Preparar la continuidad de su atención','Entregar reserva y nota de atención a Romero'][i]||'';
 if(r.mission==='ana-01')return ['Aclarar la recepción sin separar a las familias','Cruzar con las personas y sus pertenencias','Acompañar al grupo hasta quien lo recibe'][i]||'';
 if(r.mission==='morales-01')return i===0?'Comprobar las marcas de la posta':i<4?'Llegar a Toesca y comprobar qué carga puede pasar':i===4?'Fijar el límite del reconocimiento en Parque O’Higgins':'Volver a Morales con lo comprobado y lo pendiente';
 return '';
}
