// These are remembered conversations, not approval points or free recovery.
var nightCompanion=null;
var companionVoices={
 sara:{name:"Sara",opening:"Sara intenta cerrar una caja de vendas que ya no ordena bien. «Cuando alguien pide ayuda, me miran a mí. Puedo decir qué necesita. No puedo decidir sola a quién dejamos sin nada». Aparta la caja para que vean lo que queda.",choices:[
  {id:"compartir",label:"Pedir que la decisión de ayudar se discuta entre los tres",reply:"«Entonces no esperen a que yo diga que no». Sara deja la caja abierta sobre la mesa. Quiere que el límite sea responsabilidad del grupo, también cuando a alguien le moleste.",later:"Sara vuelve a poner las reservas a la vista. «Ayer dijimos que esto lo decidiríamos entre los tres. Quiero que siga siendo así cuando estemos apurados». No da por cumplido el acuerdo solo porque lo hablaron."},
  {id:"limites",label:"Pedirle que diga con claridad cuándo faltan medios",reply:"Sara cuenta las vendas antes de responder. «Lo voy a decir. Pero si no alcanza, no me pidan que prometa que alcanzará». Elías acerca la caja para ayudarla a cerrar.",later:"Sara enumera primero lo que falta. «Me pidieron que avisara el límite. Este es». Después pregunta qué conservarán para volver, sin fingir que hay una reserva que no tienen."}
 ]},
 elias:{name:"Elías",opening:"Elías ha escrito una explicación y luego la ha tachado. «Si dejo una duda en el cuaderno, parece que no hice mi trabajo. Si pongo una respuesta antes de tenerla, alguien puede salir a buscarla». Sara le pregunta cuál de las dos cosas está haciendo ahora. Él gira la hoja para que la lean.",choices:[
  {id:"dudas",label:"Dejar por escrito qué sigue sin comprobarse",reply:"Elías separa las observaciones de las suposiciones. «Esto sí lo puedo sostener». Mantiene la pregunta debajo; todavía le incomoda entregarla sin una respuesta.",later:"Elías ha dejado una columna para lo que no pudieron comprobar. «Esta era la parte que no queríamos borrar». Les pide revisar los huecos antes de decidir qué contarán al regreso."},
  {id:"explicar",label:"Pedirle que explique los riesgos antes de dar una recomendación",reply:"«Bien. Pero déjenme terminar cuando no sea una respuesta corta». Elías prueba la explicación en voz alta y Noa le señala dónde dejó de entenderlo. Vuelve a empezar por esa parte.",later:"Elías empieza por el riesgo que sí puede explicar. Se detiene antes de recomendar una acción. «¿Hasta aquí se entiende?». Espera la respuesta en vez de continuar llenando el silencio."}
 ]},
 noa:{name:"Noa",opening:"Noa ha aflojado una correa que le dejó una marca en el hombro. Mira el recorrido del regreso. «Puedo ir delante. Lo que me cansa es enterarme después de por qué teníamos que pasar por ahí». No pide decidir por los demás; pide conocer el motivo antes de abrir camino.",choices:[
  {id:"motivo",label:"Acordar explicar el motivo antes de cambiar de rumbo",reply:"Noa asiente y vuelve al recorrido. «Aunque después no estemos de acuerdo». Señala el último punto donde podrían volver; quiere discutirlo mientras todavía hay una salida.",later:"Noa pide el motivo de cada desvío antes de marcarlo. «Quedamos en hablarlo antes». Escucha la explicación completa; eso no significa que todos los caminos le parezcan aceptables."},
  {id:"regreso",label:"Pedirle que haga explícito cuándo conviene volver",reply:"«Lo voy a decir. No me dejen hablando sola cuando pase». Noa señala la ruta de vuelta y entrega el lápiz. También quiere saber qué estaría dispuesto a abandonar el resto.",later:"Noa marca la vuelta antes de hablar del destino. «Me pidieron que dijera cuándo regresar. Quiero saber si vamos a escuchar eso cuando todavía quede algo por encontrar»."}
 ]}
};
function companionConversation(id,n){
 var voice=companionVoices[id];if(!voice||!n)return null;
 if(n.day===1)return {text:voice.opening,choices:voice.choices};
 var old=restLedger().nights[1]?.conversations?.[id],previous=voice.choices.find(function(c){return c.id===old?.choice});
 var text=previous?previous.later:voice.opening+" Anoche no hablaron de esto; todavía pueden hacerlo antes de salir otra vez.";
 if(id==="sara"&&state.flags.liraDead)text+=" Al nombrar a Lira, Sara baja la voz. «Lo que pasó no cambia por acordar algo ahora».";
 return {text:text,choices:[
  {id:"sostener",label:"Mantener ese criterio y preguntar qué le preocupa ahora",reply:id==="sara"?"«Que una urgencia decida por nosotros». Sara pide dejar las reservas a mano para poder revisarlas juntos.":id==="elias"?"«Que al contarlo después parezca que siempre supimos qué hacer». Elías conserva las dudas junto al registro, también las que resultaron incómodas.":"«Que demos por hecho que yo siempre voy a poder seguir». Noa vuelve a aflojar la correa y pide revisar el regreso con el resto."},
  {id:"revisar",label:"Admitir que el criterio puede necesitar cambios",reply:id==="sara"?"Sara se toma un momento. «Cambiarlo no me molesta. Enterarme cuando ya prometimos algo, sí». Pide hablar de cada necesidad antes de comprometer reservas.":id==="elias"?"«Podemos cambiar la explicación si aparece algo nuevo». Elías deja espacio en la hoja. No borra lo que habían entendido hasta ahora.":"Noa aparta el lápiz. «Puedo cambiar de rumbo. Necesito que me lo digan antes de estar ahí». Les pide revisar juntos el siguiente tramo."}
 ]};
}
function normalizeNightConversations(n){
 n.conversations??={};
 if(typeof n.conversations!=="object"||!n.conversations||Array.isArray(n.conversations))throw Error("Conversaciones inválidas");
 Object.entries(n.conversations).forEach(function(entry){var id=entry[0],c=entry[1],voice=companionVoices[id];
  var ids=n.day===1?voice?.choices.map(function(x){return x.id}):["sostener","revisar"];
  if(!voice||!c||!ids.includes(c.choice)||typeof c.text!=="string"||typeof c.reply!=="string"||typeof c.label!=="string")throw Error("Respuesta nocturna inválida");
 });
}
function renderNightConversation(){
 var n=pendingNight();if(!n)return;
 var buttons=Object.entries(companionVoices).map(function(entry){var id=entry[0],v=entry[1],awake=state.party.some(function(p){return p.id===id&&p.hp>0});return '<button class="secondary" data-night-person="'+id+'" aria-pressed="'+(nightCompanion===id)+'" '+(!awake?'disabled':'')+'>'+esc(v.name)+(n.conversations?.[id]?' · conversación guardada':!awake?' · necesita atención':'')+'</button>'}).join('');
 $("nightPeople").innerHTML=buttons;
 var scene=companionConversation(nightCompanion,n),saved=n.conversations?.[nightCompanion];
 $("nightConversation").innerHTML=!scene?'':('<h3>'+esc(companionVoices[nightCompanion].name)+'</h3><p>'+esc(saved?saved.text:scene.text)+'</p>'+(saved?'<p><strong>'+esc(saved.label)+'</strong></p><p role="status">'+esc(saved.reply)+'</p>':'<div class="buttons">'+scene.choices.map(function(c){return '<button class="secondary" data-night-reply="'+c.id+'">'+esc(c.label)+'</button>'}).join('')+'</div>'));
}
function answerNightCompanion(id,choice){
 var n=pendingNight(),person=state.party.find(function(p){return p.id===id});
 if(!n||!person||person.hp<=0||n.conversations?.[id])return false;
 var scene=companionConversation(id,n),answer=scene?.choices.find(function(c){return c.id===choice});if(!answer)return false;
 n.conversations??={};n.conversations[id]={choice:choice,text:scene.text,label:answer.label,reply:answer.reply};
 save();renderNightConversation();$("nightPeople").querySelector('[data-night-person="'+id+'"]')?.focus();return true;
}
$("nightPeople").addEventListener("click",function(e){var id=e.target.closest("button")?.dataset.nightPerson;if(!id)return;nightCompanion=id;renderNightConversation();$("nightPeople").querySelector('[data-night-person="'+id+'"]')?.focus();});
$("nightConversation").addEventListener("click",function(e){var choice=e.target.closest("button")?.dataset.nightReply;if(choice)answerNightCompanion(nightCompanion,choice);});
