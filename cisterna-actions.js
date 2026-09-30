"use strict";
// Physical work has a price; consent and political boundaries are never rolled.
(function deepenCisternaActions(){
 function scene(key){return CISTERNA_EVENTS.find(function(e){return e.key===key})}
 function edit(key,id,patch){Object.assign(scene(key).choices.find(function(o){return o.id===id}),patch)}
 function add(key,o){scene(key).choices.push(Object.assign({_cisterna:true},o))}
 function check(mode,lead,quote,good,bad){return {mode:mode,lead:lead,quote:quote,waiting:"El grupo sostiene la maniobra…",good:good,bad:bad}}
 var impacts={
  recovery:{prepare:"Preparar al grupo"},records:{recover:"Nuevo archivo"},
  council:{recognition:"Mandato de reconocimiento",trade:"Oferta de 1 componente"},
  packing:{equipment:"Revisar reservas"},corridor:{withdraw:"Visita pendiente"},
  gate:{visit:"Acceso a recepción",outside:"Solo conversación exterior",side:"Permiso suspendido",leave:"Visita pendiente"},
  refusal:{accept:"Respeta la independencia",ask:"Escuchar sus motivos",insist:"Segunda negativa"},
  insist:{accept:"Retirar la petición",pressure:"Relación suspendida"},
  reception:{terms:"Límites acordados"},occupation:{listen:"Testimonio de Teresa"},
  evidence:{testimony:"Sin copia documental"},families:{unknown:"Búsqueda sin resolver"},
  letter:{sealed:"Privacidad conservada",read:"Privacidad vulnerada"},
  workshop:{keep:"Materiales para el regreso"},teaching:{decline:"Sin procedimiento técnico"},
  plan:{respect:"Acuerdo respetado"},observed:{destroy:"Copia eliminada · relación cerrada",retain:"Copia conservada · relación cerrada"},
  proposal:{limited:"Contacto por ratificar",letters:"Solo correspondencia",none:"Sin visitas futuras"},
  farewell:{decline:"Sin lote de semillas"},departure:{board:"Revisar el circuito"},board:{back:"Elegir otra salida"},
  report:{bounded:"Informe autorizado",'ask-again':"Nueva petición pendiente",disclose:"Entrega de datos privados"},
  disclosure:{restrict:"Incumplimiento reservado",publish:"Difusión · relación cerrada"},
  conclusion:{finish:"Cerrar reconocimiento"},incomplete:{pending:"Preparar otra visita"}
 };
 Object.keys(impacts).forEach(function(key){Object.keys(impacts[key]).forEach(function(id){edit(key,id,{impact:impacts[key][id]})})});
 edit("corridor","help",{morale:2,xp:{elias:4},actor:"elias",hint:"Gastas 1 componente y 4 de energía. El paso queda libre; moral +2 y Elías +4 XP por liberar el freno."});
 add("corridor",{
  id:"lever",decisionId:"cisterna-lever",label:"Improvisar una palanca con Elías",actor:"elias",reqItems:["tool"],onceFlag:"leverAttempted",
  hint:"La herramienta se conserva. Éxito: energía −6 y Elías +6 XP. Fallo: energía −10, hasta 4 HP de Elías y moral −2; tendrás que elegir otra solución. Un intento.",
  energy:6,next:"gate",facts:{leverAttempted:true},
  checkScene:check("technical","Elías muestra desde su lado dónde puede apoyar la herramienta sin tocar el cabrestante de los buscadores. Uno sujeta la vagoneta; Noa vigila que no se suelte hacia Sara. Si el apoyo cede, tendrán que detenerse y pagar, usar una pieza o tomar otro camino.","«La pieza asegura el freno. Con esto puedo intentar liberarlo, pero no te prometo que aguante». — Elías",["Paso","El freno cede","Cruzas sin entregar batería ni componente. Energía −6 y Elías +6 XP."],["Atasco","La palanca resbala","El paso sigue cerrado. Energía −10, moral −2 y hasta 4 HP de Elías. La herramienta se conserva; deberás elegir otra solución."]),
  roll:{dc:12,bonus:2,success:{title:"Un apoyo que resiste",result:"Elías mantiene la herramienta atravesada mientras el hombre retira el seguro. La rueda gira y Noa ayuda a sostener la carga hasta dejar libre el ancho del paso. Sara le pide a Elías que abra la mano antes de guardar la herramienta; le tiembla por el esfuerzo, pero no está herido. Cruzan con las piezas todavía en las mochilas.",facts:{corridor:"helped"},xp:{elias:6}},fail:{title:"El apoyo se deshace",result:"El óxido del soporte cede antes que el freno. La palanca golpea la mano de Elías y Sara lo aparta del mecanismo. El buscador vuelve a poner el seguro. No acepta otro intento con ese apoyo. Todavía pueden entregar la batería, emplear un componente, rodear o regresar a prepararse.",energy:10,morale:-2,damage:{elias:4},next:"corridor",retryable:true}}
 });
 edit("tour","observe",{label:"Recorrer los cultivos y las acequias con Inés",energy:3,hint:"Energía −3. Conoces el funcionamiento general y llegas al taller; no obtienes inventarios ni planos privados."});
 add("tour",{id:"rest",label:"Esperar en recepción para recuperar el aliento",hint:"Recuperas 6 de energía. Renuncias a recorrer los cultivos, trabajar en el taller y estudiar el circuito durante esta visita.",recoverEnergy:6,facts:{skipWorkshop:true,cultivationSeen:true},impact:"Sin recorrido técnico",title:"Quedarse en el banco",result:"Sara pide una pausa. Inés señala el camino de vuelta a recepción y explica que después debe seguir con el riego. Elías guarda la libreta. Se sientan, aflojan las correas y dejan pasar el turno del recorrido. Teresa podrá contarles la historia del lugar cuando vuelvan a reunirse.",next:"reception"});
 edit("evidence","copy",{energy:3,faction:1,hint:"Energía −3 por cotejar y copiar. Obtienes la orden autorizada y 1 punto de facción por recuperar la prueba; no contiene datos privados.",result:"Elías copia la orden mientras Sara lee en voz alta los números que él acaba de escribir. En una fecha han saltado un renglón; Teresa lo advierte antes de que cierren el cuaderno. Repiten la comprobación con la hoja a la vista. Cuando terminan, pueden explicar de dónde salió cada dato que se llevan."});
 edit("families","leave-query",{energy:2,hint:"Energía −2 por revisar la descripción y preparar la consulta con Teresa. No confirma la muerte ni la supervivencia de Hernán.",result:"Sara revisa con Teresa cada detalle de la descripción. Tacha una edad que la hermana calculó sin estar segura y conserva la cicatriz. Preparan una copia para la carpeta local y otra para explicar qué dejaron preguntado. La búsqueda queda abierta, sin prometer cuándo habrá una respuesta."});
 scene("workshop").text+="\n\nElías encuentra un punto donde intentar ajustar el cierre sin sustituirlo. Inés le deja examinarlo y abre su caja de trabajo. «Si consigues dejarlo regulado, puedo cambiarte esta venda por la mano de obra». Elías comprueba el eje: un mal ajuste puede saltar bajo presión. También pueden hacer el intercambio de la pieza, ayudar sin cobrar o conservar todo para la vuelta.";
 edit("workshop","gift",{energy:4,morale:3,faction:1,actor:"elias",xp:{elias:4},hint:"Componente −1 y energía −4. Moral +3, 1 punto de facción y Elías +4 XP por instalarlo. No obliga a la comunidad a aceptar ningún acuerdo.",result:"Elías entrega el componente y se queda a instalarlo con Inés. Ella aísla el ramal mientras él retira el cierre viejo. Sara sujeta la lámpara; Noa acerca el recipiente para el agua que queda dentro. Prueban la unión antes de recoger las herramientas. Inés les da las gracias y vuelve a anotar su turno de riego. El grupo retoma la visita con una pieza menos y el alivio de haber dejado ese trabajo resuelto, sin pedir una firma a cambio."});
 edit("workshop","barter",{energy:2,hint:"Componente −1 y energía −2 por comprobar e instalar la pieza; recibes 1 ración. El intercambio no compromete cosechas futuras.",result:"Inés pone una ración sellada sobre la mesa y Elías deja el componente al lado. Comprueban la medida antes de cerrar el trato. Ella realiza el montaje; él sostiene el ramal y revisa que la pieza quede asentada. Cuando terminan la prueba, cada uno guarda lo que acordaron recibir. Inés anota la salida en su cuaderno. Elías no añade ninguna promesa sobre la próxima cosecha."});
 add("workshop",{
  id:"repair",decisionId:"cisterna-repair",label:"Regular el cierre a cambio de una venda",actor:"elias",profession:"engineeringUses",reqItems:["tool"],energy:6,give:{bandage:1},next:"teaching",
  hint:"Requiere herramienta y gasta 1 acción de ingeniería. Éxito: energía −6, venda +1 y Elías +8 XP. Fallo: energía −8 y hasta 3 HP de Elías, sin recompensa. No utiliza componentes.",
  checkScene:check("technical","Inés aísla el ramal antes de que Elías toque el cierre. Él puede regular el eje con su herramienta, conservando el componente para el regreso. La prueba gastará una acción de ingeniería. Si la pieza salta, Inés volverá a dejar el ramal aislado y esperará su turno de taller.","«La probamos juntos antes de abrir el agua». — Inés",["Ajuste","El cierre queda regulado","Energía −6, 1 acción de ingeniería, venda +1 y Elías +8 XP."],["Salto","La pieza no sostiene el ajuste","Energía −8 y 1 acción de ingeniería. Elías pierde hasta 3 HP; no recibes la venda."]),
  roll:{dc:12,bonus:3,success:{title:"El último cuarto de vuelta",result:"Elías pide que abran el agua poco a poco. La primera prueba deja escapar un hilo; corrige un cuarto de vuelta y espera a que vuelva la presión. Inés comprueba la unión con un paño seco antes de darla por buena. Entrega la venda acordada. Elías guarda la herramienta y el componente que ya no hizo falta utilizar.",facts:{materials:"repair",repairSucceeded:true},xp:{elias:8},pulse:{pragmatism:1,stress:-1}},fail:{title:"Dejarlo asegurado",result:"La pieza salta cuando vuelve la presión. Elías retira la mano tarde y se golpea contra el borde. Inés cierra de nuevo el ramal y comprueba que haya quedado seguro. No entrega la venda: la reparación sigue pendiente. Sara mira la mano de Elías antes de permitir que guarde la herramienta. Podrán seguir con la explicación cuando se haya repuesto.",energy:8,give:{},damage:{elias:3},facts:{materials:"repair-failed"},pulse:{stress:1}}}
 });
 scene("teaching").text+="\n\nInés tiene una bandeja vacía para ensayar. No basta con llevarse un dibujo: Elías debe montar la cubierta y comprobar cómo queda el aire por debajo. Sara le pregunta cuánto esfuerzo le queda para el regreso. Pueden quedarse a practicar o dar por terminada la visita al taller.";
 edit("teaching","learn",{label:"Practicar el montaje y anotar el procedimiento",actor:"elias",energy:4,xp:{elias:6},hint:"Energía −4 y Elías +6 XP. Aprendes el procedimiento y el circuito útil para el tablero exterior. No exige haber entregado materiales.",result:"Inés deja que Elías monte primero la cubierta. Le hace desmontar un apoyo que taparía la ventilación y espera a que lo corrija. Después revisan juntos el dibujo. Elías marca por separado el ramal del cierre y pregunta cómo reconocerlo desde el exterior. Guarda únicamente los esquemas autorizados, con el nombre de Inés como fuente."});
 edit("plan","copy-secret",{energy:4,pulse:{stress:1},hint:"Energía −4 y tensión +1. Hay un 55% de riesgo de que Inés vuelva y vea la copia. Si no te ve, el incumplimiento permanece oculto hasta que la información circule."});
 scene("farewell").text+="\n\nEl envoltorio alcanza para guardarlas aquí. Para el camino húmedo, Elías propone usar una tela de las mochilas. Si prefieren conservarla, tendrá que llevar el paquete protegido bajo la ropa y apartarlo cada vez que apoyen el equipo. Inés espera mientras deciden si pueden hacerse cargo del lote.";
 edit("farewell","seeds",{label:"Envolver las semillas con una tela del grupo",req:{cloth:1},spend:{cloth:1},hint:"Tela −1. Proteges el lote para el regreso sin sumar esfuerzo. Es una entrega de prueba para Los Héroes, no alimento.",result:"Elías dobla la tela alrededor del paquete y lo deja en la parte seca de la mochila. Inés le pide que no lo abra hasta estar bajo techo. Sara comprueba los sobres mientras Noa guarda el cartón del tramo exterior."});
 add("farewell",{id:"carry",label:"Llevar el paquete protegido bajo la ropa",hint:"Energía −4 por el cuidado adicional durante el transporte. Conservas la tela y recibes el mismo lote de prueba.",energy:4,facts:{seeds:true,reportPermission:true,exitMap:true},title:"Un paquete que llevar con cuidado",result:"Elías ajusta el paquete bajo la ropa y prueba a agacharse sin doblarlo. Tendrá que quitarse la mochila cada vez que revise si sigue seco. Inés acepta la solución y le entrega la nota de conservación. No reciben más semillas por haber elegido el transporte más incómodo.",next:"departure"});
 // Existing choices keep their IDs: receipts in old saves still settle old costs.
})();
function cisternaCost(o){
 var rows=[];
 Object.keys(o.spend||{}).forEach(function(id){rows.push(resName(id)+" −"+o.spend[id])});
 if(o.credits)rows.push("Créditos −"+o.credits);
 if(o.energy)rows.push("Energía −"+o.energy+(o.roll?" o más":""));
 if(o.recoverEnergy)rows.push("Energía +"+o.recoverEnergy);
 if(o.profession)rows.push("Ingeniería −1");
 if(o.morale)rows.push("Moral "+(o.morale>0?"+":"")+o.morale);
 Object.keys(o.give||{}).forEach(function(id){rows.push(resName(id)+" +"+o.give[id]+(o.roll?" si resulta":""))});
 if(o.faction)rows.push("Facción +"+o.faction);
 if(!rows.length&&o.cost&&o.cost!=="Sin consumo")rows.push(o.cost);
 return rows.join(" · ")||o.impact||(o.archive?"Archivo autorizado":o.finish?"Cerrar informe":"Continuar relato");
}
