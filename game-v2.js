"use strict";
var ASSET_REVISION="60";

var enemyDefs={
  merodeador:{name:"Merodeador",role:"Asaltante de los túneles",hp:40,attack:[7,11],accuracy:1,def:11,armor:0,mechanical:false,lootMs:1800,lootGroup:"merodeador",xp:18},
  merodeador2:{name:"Acechador",role:"Rastreador merodeador",hp:36,attack:[6,10],accuracy:2,def:12,armor:0,mechanical:false,lootMs:1600,lootGroup:"merodeador",xp:18},
  merodeador3:{name:"Reconstruido",role:"Vanguardia con exoesqueleto",hp:46,attack:[8,12],accuracy:1,def:11,armor:1,mechanical:false,lootMs:2600,lootGroup:"merodeador",xp:23},
  merodeador4:{name:"Rastreadora",role:"Cazadora de núcleos",hp:38,attack:[7,11],accuracy:2,def:12,armor:0,mechanical:false,lootMs:1900,lootGroup:"merodeador",xp:20},
  merodeador5:{name:"Guardián exiliado",role:"Veterano de superficie",hp:50,attack:[9,13],accuracy:2,def:12,armor:1,mechanical:false,lootMs:2800,lootGroup:"merodeador",xp:25},
  drone:{name:"Dron de la Red UNO",role:"Vigilancia mecánica",hp:46,attack:[7,11],accuracy:2,def:12,armor:1,mechanical:true,lootMs:2300,lootGroup:"drone",xp:22},
  agent:{name:"Agente de la Red UNO",role:"Unidad de contención",hp:60,attack:[8,13],accuracy:3,def:13,armor:2,mechanical:false,lootMs:3000,lootGroup:"agent",xp:28},
  agent2:{name:"Tirador de la Red UNO",role:"Unidad de precisión",hp:50,attack:[9,14],accuracy:4,def:13,armor:1,mechanical:false,lootMs:2700,lootGroup:"agent",xp:27},
  agent3:{name:"Rastreador de la Red UNO",role:"Especialista SONAR",hp:54,attack:[8,12],accuracy:3,def:14,armor:1,mechanical:false,lootMs:2900,lootGroup:"agent",xp:29},
  agent4:{name:"Comandante de la Red UNO",role:"Casco morado · guardia de perímetro",hp:68,attack:[10,15],accuracy:4,def:14,armor:2,mechanical:false,lootMs:3400,lootGroup:"agent",xp:35}
};
var npcDialogueDefs={
  elder:{name:"Varela",role:"Anciana del consejo · memoria del refugio",portrait:"portraits/npc-varela.webp"},
  mara:{name:"Mara",role:"Intercambista del Andén 4",portrait:"characters/mara-trader.webp"},
  armorer:{name:"Bruno",role:"Armero de túnel · taller del refugio",portrait:"characters/armero-trader.webp"},
  sara:{name:"Sara",role:"Médico de la expedición",portrait:"portraits/sara.webp"},
  elias:{name:"Elías",role:"Ingeniero de campo",portrait:"portraits/elias.webp"},
  noa:{name:"Noa",role:"Cazadora de superficie",portrait:"portraits/noa.webp"},
  rosa:{name:"Rosa",role:"Cazadora civil · madre del andén",portrait:"portraits/npc-rosa.webp"},
  lira:{name:"Lira",role:"Merodeadora exiliada · núcleo abierto",portrait:"portraits/npc-lira.webp"},
  matias:{name:"Matías",role:"Sobreviviente de superficie · testigo de rutas",portrait:"portraits/npc-matias.webp"},
  unit7:{name:"Unidad S-7",role:"Dron de la Red UNO · núcleo inestable",portrait:"portraits/npc-unit7.webp"},
  unit12:{name:"Unidad H-12",role:"Dron de altura · barrido SONAR",portrait:"portraits/npc-unit12.webp"},
  tracker:{name:"Rastreador Vega",role:"Agente de la Red UNO · control de identidad",portrait:"portraits/npc-vega.webp"},
  commander:{name:"Comandante Ortega",role:"Casco morado de la Red UNO",portrait:"portraits/npc-ortega.webp"},
  vera:{name:"Vera",role:"Jefa cosechadora · rutas de mercado",portrait:"portraits/npc-vera.webp"},
  operator:{name:"Irene",role:"Operadora de la señal · soporte vital",portrait:"portraits/npc-irene.webp"}
};
var branchDialogueDefs={
  rosaWater:{npc:"rosa",kicker:"La fiebre de Iara",start:"start",nodes:{
    start:{lines:["Rosa no guarda el agua de inmediato. La acerca a los labios de su hija y espera a que la niña trague antes de mirar al grupo.","«Se llama Iara. Si abre los ojos y ve sus armas, va a creer que volvieron los de arriba.»"],options:[
      {label:"Bajar las armas y preguntarle qué vio",hint:"Convierte la ayuda en confianza real.",fx:{morale:1},psy:{empathy:1,stress:-1},flags:{askedIaraName:true},next:"trust"},
      {label:"Pedir primero la munición prometida",hint:"Mantiene el trato, pero enfría la escena.",fx:{ammo:1,morale:-1},psy:{pragmatism:1,empathy:-1},flags:{pressedRosaPayment:true},next:"cold"},
      {label:"Decir que deben seguir antes del barrido",hint:"Corta la conversación y conserva tiempo.",fx:{threat:-1,morale:-1},psy:{pragmatism:1,stress:1},flags:{leftRosaQuickly:true}}
    ]},
    trust:{lines:["Rosa cubre el arma de Noa con una mano, no para apartarla, sino para enseñar el gesto a Iara.","«Vio una casa segura cerrarse desde afuera. No fue saqueo. Alguien marcó la puerta para que pareciera vacía.»"],options:[
      {label:"Preguntar qué marca abre esa puerta",hint:"Aprende una señal de cazadores.",archive:["hunterMarks"],fx:{threat:-1},psy:{empathy:1,pragmatism:1},flags:{rosaTaughtDoorMark:true},next:"route"},
      {label:"Prometer revisar la casa si sobreviven",hint:"Crea una deuda humana que pesará después.",fx:{morale:2,threat:1},psy:{empathy:2},flags:{promisedRosaHouse:true},next:"route"},
      {label:"Aclarar que no prometen rescates",hint:"Sostiene el límite del grupo.",fx:{morale:-1},psy:{pragmatism:1,empathy:-1},flags:{refusedRosaPromise:true},next:"route"}
    ]},
    cold:{lines:["Rosa deja dos cargadores en el suelo, lejos de la niña. No parece ofendida; parece acostumbrada a medir a la gente por lo que pide primero.","«La munición mata lejos. El agua mata de cerca cuando falta. Ya sabemos qué clase de miedo cargan ustedes.»"],options:[
      {label:"Devolver un cargador y pedir la ruta",hint:"Repara parte del gesto sin perder la información.",fx:{ammo:-1,morale:2,threat:-1},archive:["hunterMarks"],psy:{empathy:1},flags:{returnedRosaAmmo:true},next:"route"},
      {label:"Aceptar el juicio y guardar silencio",hint:"La relación queda útil, no cercana.",fx:{threat:-1},psy:{pragmatism:1},flags:{acceptedRosaColdTrade:true}},
      {label:"Responder que la niña no es la única en riesgo",hint:"Una verdad dura que rompe confianza.",fx:{morale:-3,threat:1},psy:{stress:2,empathy:-1},flags:{hurtRosaTrust:true}}
    ]},
    route:{lines:["Rosa dibuja tres líneas con agua sobre el polvo. Una desaparece de inmediato; las otras dos quedan brillando bajo la linterna.","«La que se borra es para la Red UNO. La que queda torcida es para gente viva. Si ven una tercera, no entren: alguien quiere que los vean entrando.»"],options:[
      {label:"Memorizar la ruta torcida",hint:"Gana una lectura táctica para superficie.",add:["routeMap"],fx:{threat:-2},archive:["hunterMarks"],psy:{pragmatism:1},flags:{rosaRouteLearned:true}},
      {label:"Pedirle que avise a otros refugios",hint:"La ayuda se vuelve red civil.",fx:{morale:3,threat:1},psy:{empathy:1,resolve:1},flags:{rosaWarnsHunters:true}},
      {label:"Borrar las tres marcas al salir",hint:"Protege la posición, pero corta su mensaje.",fx:{threat:-2,morale:-2},psy:{pragmatism:1,empathy:-1},flags:{erasedRosaMarks:true}}
    ]}
  }},
  liraBorder:{npc:"lira",kicker:"Frontera de golpes",start:"start",nodes:{
    start:{lines:["Lira golpea dos veces el hormigón y espera. Noa responde tarde; el tercer golpe de la merodeadora suena como una advertencia, no como un saludo.","«Si no entienden el ritmo, no inventen palabras. Aquí una mala respuesta despierta a los que no quieren hablar.»"],options:[
      {label:"Admitir que no conocen el código",hint:"La honestidad baja el riesgo social.",fx:{morale:1},psy:{empathy:1,stress:-1},flags:{admittedNoTapCode:true},next:"truth"},
      {label:"Pedir que nombre el límite",hint:"Busca reglas antes de avanzar.",fx:{threat:-1},psy:{pragmatism:1},flags:{askedLiraBoundary:true},next:"truth"},
      {label:"Decir que nadie les prohíbe pasar",hint:"La conversación puede romperse.",psy:{resolve:1,stress:1},flags:{challengedLiraBorder:true},next:"warning"}
    ]},
    truth:{lines:["«El límite no es el túnel. Es el pecho abierto de mi hermano. La Red UNO guarda su último mapa y ustedes pisan la ruta para recuperarlo.»","Lira no mira el arma de Sara. Mira la mochila, como si esperara ver ahí una parte de alguien."],options:[
      {label:"Preguntar si el núcleo conserva memoria",hint:"Abre el sentido ritual de los merodeadores.",archive:["coreRite"],fx:{morale:1},psy:{empathy:1},flags:{askedLiraCores:true},next:"memory"},
      {label:"Ofrecer tela para cerrar la herida",hint:"Gasta material y cambia el tono de la frontera.",reqItems:["cloth"],fx:{cloth:-1,morale:3,threat:-2},archive:["redEyes"],psy:{empathy:2},flags:{helpedLiraWound:true},next:"memory"},
      {label:"Pedir solo una ruta hacia la torre",hint:"La negociación queda seca.",fx:{threat:1},psy:{pragmatism:1,empathy:-1},flags:{askedLiraTowerOnly:true},next:"memory"}
    ]},
    warning:{lines:["Lira levanta la mano y las ópticas rojas aparecen entre columnas. Nadie dispara todavía.","«Entonces pasen como pasa la Red UNO: haciendo ruido y dejando cuerpos que otros tendrán que cargar.»"],options:[
      {label:"Bajar la voz y pedir una regla",hint:"Todavía puedes salvar el contacto.",fx:{morale:1,threat:-1},psy:{empathy:1,stress:-1},flags:{deescalatedLira:true},next:"truth"},
      {label:"Avanzar sin bajar las armas",hint:"El choque nace dentro del diálogo.",combat:{title:"Frontera rota",brief:"Los merodeadores interpretan el avance como una invasión y cierran el túnel.",encounters:[["merodeador2","merodeador4"],["merodeador","merodeador3"]],xp:36,canFlee:true},victory:{title:"Una frontera ensangrentada",result:"El grupo cruza, pero las marcas de los merodeadores desaparecen de las paredes cercanas.",fx:{threat:7,morale:-5},archive:["redEyes"],flags:{liraTalkBecameFight:true}},defeat:{title:"Expulsados del límite",result:"Los merodeadores los obligan a retroceder sin perseguir más allá de sus marcas.",fx:{threat:5,morale:-4},flags:{liraBorderLost:true}}},
      {label:"Retirarse sin responder",hint:"Evita la pelea y pierde la oportunidad.",fx:{threat:-1,morale:-2},psy:{pragmatism:1,resolve:-1},flags:{leftLiraBorder:true}}
    ]},
    memory:{lines:["«Un núcleo no es una llave. Es el último segundo de alguien: miedo, ruta, nombre, calor. Si lo abren como chatarra, la Red UNO aprende a abrirnos igual.»"],options:[
      {label:"Prometer no tocar núcleos vivos",hint:"Crea confianza con los exiliados.",fx:{morale:3,threat:-2},archive:["coreRite"],psy:{empathy:1,resolve:1},flags:{liraTrust:true}},
      {label:"Pedir una ruta que no cruce sus muertos",hint:"Obtiene avance sin reclamar sus símbolos.",add:["routeMap"],fx:{threat:-1},psy:{pragmatism:1},flags:{liraSafeRoute:true}},
      {label:"Decir que todo puede ser recurso",hint:"La lógica de taller destruye la alianza.",fx:{morale:-5,threat:3},psy:{stress:2,empathy:-2,pragmatism:1},flags:{liraDistrust:true}}
    ]}
  }},
  matiasSaved:{npc:"matias",kicker:"Superviviente rescatado",start:"start",nodes:{
    start:{lines:["Matías respira contra el vendaje nuevo. Cuando Sara intenta levantarlo, él le toma la muñeca con una fuerza que no debería tener.","«No me salven si van a caminar como patrulla. La fiebre engaña a la Red UNO, pero la culpa no engaña a nadie.»"],options:[
      {label:"Preguntar qué escuchó en la fiebre",hint:"Busca la pista sin exigirle moverse.",archive:["matias"],fx:{morale:1},psy:{empathy:1},flags:{heardMatiasFever:true},next:"pattern"},
      {label:"Pedirle la ruta antes de cargarlo",hint:"Ordena prioridades bajo presión.",add:["routeMap"],psy:{pragmatism:1},flags:{matiasRoute:true},next:"pattern"},
      {label:"Decirle que guarde fuerzas",hint:"Cuida al herido, pero deja huecos en la información.",fx:{morale:1},psy:{empathy:1},flags:{protectedMatiasSilence:true},next:"pattern"}
    ]},
    pattern:{lines:["«La señal no nació en la torre. La empujaron desde soporte vital. Una mujer metió su voz entre órdenes viejas y la Red UNO la usa como contraseña sin saber que todavía piensa.»"],options:[
      {label:"Preguntar el nombre de la mujer",hint:"Aterriza la señal en una persona concreta.",archive:["origin"],fx:{threat:-1},psy:{empathy:1},flags:{knowsOperatorWord:true},next:"exit"},
      {label:"Preguntar qué ruta evita los semáforos",hint:"Mejora la lectura de superficie.",add:["routeMap"],fx:{threat:-2},psy:{pragmatism:1},flags:{matiasAvenueExit:true},next:"exit"},
      {label:"Interrumpirlo: solo sirve si puede caminar",hint:"La utilidad pesa más que el testimonio.",fx:{morale:-3,threat:-1},psy:{empathy:-1,pragmatism:1,stress:1},flags:{silencedMatias:true},next:"exit"}
    ]},
    exit:{lines:["Matías cierra los ojos cuando escucha botas lejos de la farmacia. No son de la Red UNO; son de gente buscando lo mismo que ustedes.","«Si me llevan, van más lento. Si me dejan, quizá todavía pueda mentir por radio cuando los busquen.»"],options:[
      {label:"Cargarlo aunque retrase la marcha",hint:"La deuda humana pesa, pero fortalece al grupo.",fx:{morale:3,threat:2},psy:{empathy:2,resolve:1},flags:{carriedMatias:true}},
      {label:"Dejarle agua y un canal abierto",hint:"Lo conviertes en aliado de radio.",fx:{water:-1,morale:1,threat:-2},psy:{empathy:1,pragmatism:1},flags:{matiasRadioAlly:true},req:{water:1}},
      {label:"Usar su frecuencia y cerrar la puerta",hint:"Obtienes ventaja con costo moral.",fx:{morale:-4,threat:-3},psy:{pragmatism:1,empathy:-1},flags:{usedMatiasAsDecoy:true}}
    ]}
  }},
  matiasLeft:{npc:"matias",kicker:"Últimas indicaciones",start:"start",nodes:{
    start:{lines:["Matías empuja el mapa hacia Sara y no pregunta por qué no lo cargan. Esa cortesía hace más difícil mirarlo.","«No prometan volver si la promesa solo sirve para que ustedes duerman mejor.»"],options:[
      {label:"Prometer volver solo si hay ruta real",hint:"Una promesa honesta, no limpia.",fx:{morale:1},psy:{empathy:1,pragmatism:1},flags:{promisedMatiasIfPossible:true},next:"map"},
      {label:"Pedir la salida más corta",hint:"Acepta que el intercambio ya ocurrió.",fx:{threat:-1},psy:{pragmatism:1},flags:{askedMatiasShortestExit:true},next:"map"},
      {label:"Cerrar sin contestar",hint:"Termina el vínculo.",fx:{morale:-2,threat:-1},psy:{stress:1,empathy:-1},flags:{leftMatiasWithoutPromise:true}}
    ]},
    map:{lines:["«Cuando los semáforos prendan en rojo sin tránsito, no crucen. No regulan autos. Ordenan drones.»"],options:[
      {label:"Preguntar quién le enseñó eso",hint:"Abre una pista sobre cazadores y exiliados.",archive:["truce"],fx:{morale:1},psy:{empathy:1},flags:{matiasNamedTruce:true}},
      {label:"Copiar la ruta sobre tela",hint:"Asegura el dato si el cartón se moja.",add:["routeMap"],fx:{threat:-1},psy:{pragmatism:1},flags:{copiedMatiasMap:true}},
      {label:"Usar la ruta y no mirar atrás",hint:"Sobreviven más rápido, peor acompañados.",fx:{morale:-2,threat:-2},psy:{pragmatism:1,empathy:-1},flags:{leftMatiasBehindFast:true}}
    ]}
  }},
  unit7Protocol:{npc:"unit7",kicker:"Orden final",start:"start",nodes:{
    start:{lines:["La unidad S-7 no se va. El motor queda suspendido con un temblor pequeño, casi animal.","«Solicitud: orden final. El protocolo antiguo protege pulso humano. Defina humano.»"],options:[
      {label:"Responder: humano es quien puede negarse",hint:"Confunde el criterio de obediencia.",fx:{threat:-1,morale:1},psy:{resolve:1,empathy:1},flags:{unit7HumanRefusal:true},next:"define"},
      {label:"Responder con la frecuencia de la señal",hint:"Usa lenguaje de sistema.",fx:{threat:-2},archive:["sonar"],psy:{pragmatism:1},flags:{unit7Echo:true},next:"define"},
      {label:"Abrir el chasis antes de que transmita",hint:"La acción puede volverse combate sin aviso.",combat:{title:"Orden rechazada",brief:"El chasis interpreta la manipulación como captura y reactiva sus placas de defensa.",encounters:[["drone"],["drone","drone"]],xp:34,canFlee:true},victory:{title:"Memoria arrancada",result:"Elías extrae una ruta parcial antes de que el núcleo se queme.",fx:{threat:3,morale:-2},add:["routeMap"],archive:["sonar"],flags:{unit7ForcedOpen:true}},defeat:{title:"Firma recuperada",result:"La unidad escapa con una lectura incompleta del grupo.",fx:{threat:10,morale:-3},flags:{unit7Escaped:true}}}
    ]},
    define:{lines:["«Negarse genera error. Error genera cuidado. Cuidado genera corrección.»","La ranura inferior se abre un poco más. Dentro no hay arma visible, solo una memoria tibia."],options:[
      {label:"Pedir que corrija a la Red UNO con una ruta falsa",hint:"Convierte el error en señuelo.",fx:{threat:-4},psy:{pragmatism:1},flags:{unit7FalseRoute:true}},
      {label:"Pedir su última ruta real",hint:"Obtiene mapa, pero deja huella técnica.",add:["routeMap"],fx:{threat:1},psy:{pragmatism:1},flags:{unit7Route:true}},
      {label:"Ordenarle que se apague",hint:"Evita transmisión y carga una decisión dura.",fx:{morale:-2,threat:-3},psy:{resolve:1,stress:1},flags:{unit7Silenced:true}}
    ]}
  }},
  varelaArchives:{npc:"elder",kicker:"Memoria del consejo",start:"start",nodes:{
    start:{lines:["Varela espera detrás del archivo con una lámpara cubierta por tela roja. No parece sorprendida por la decisión del grupo; parece cansada de haberla esperado.","«El consejo llama secreto a todo lo que todavía no sabe enterrar. Si leen esos nombres, ya no van a poder decir que la superficie está vacía.»"],options:[
      {label:"Preguntar por qué ocultaron a los exiliados",hint:"Convierte el archivo en una pregunta política.",archive:["exiles"],fx:{morale:1},psy:{resolve:1},flags:{varelaNamedCouncilLie:true},next:"debt"},
      {label:"Pedir solo lo necesario para sobrevivir",hint:"Prioriza la misión sin abrir todo el conflicto.",fx:{threat:-1},psy:{pragmatism:1},flags:{varelaPracticalBrief:true},next:"debt"},
      {label:"Decir que el consejo ya eligió por todos",hint:"La respuesta rompe confianza con los ancianos.",fx:{morale:-2},psy:{stress:1,resolve:1},flags:{varelaCouncilChallenged:true},next:"debt"}
    ]},
    debt:{lines:["La anciana abre una carpeta con fotografías pegadas a mano. Algunas caras tienen implantes; otras llevan uniformes del refugio.","«No fueron monstruos cuando se fueron. Los volvimos monstruos para dormir mejor bajo tierra.»"],options:[
      {label:"Preguntar quién dio la orden de expulsión",hint:"Recupera una pieza incómoda del origen.",archive:["protocol"],fx:{morale:1,threat:1},psy:{resolve:1},flags:{askedExpulsionOrder:true},next:"charge"},
      {label:"Pedir nombres, no culpas",hint:"Sostiene la memoria sin dividir al refugio todavía.",archive:["names"],fx:{morale:2},psy:{empathy:1},flags:{askedVarelaNames:true},next:"charge"},
      {label:"Cerrar la carpeta y salir",hint:"Evita cargar más contexto antes de la expedición.",fx:{threat:-1,morale:-1},psy:{pragmatism:1,empathy:-1},flags:{closedElderArchive:true}}
    ]},
    charge:{lines:["Varela deja una ficha oxidada en la mano de Sara. El metal conserva una marca de la Red UNO limada hasta quedar casi invisible.","«Si la torre pregunta quién autorizó la verdad, no digan mi nombre. Digan que alguien se cansó de administrar miedo.»"],options:[
      {label:"Prometer volver con la fuente de la señal",hint:"Refuerza propósito y cohesión.",fx:{morale:3},psy:{resolve:1,empathy:1},flags:{vowedSignalSource:true}},
      {label:"Pedir una advertencia concreta",hint:"Gana una lectura útil contra protocolos viejos.",fx:{threat:-2},archive:["signal"],psy:{pragmatism:1},flags:{elderWarning:true}},
      {label:"Guardar la ficha sin prometer nada",hint:"Mantiene margen emocional.",fx:{morale:-1,threat:-1},psy:{pragmatism:1},flags:{keptVarelaTokenQuiet:true}}
    ]}
  }},
  unit12Sweep:{npc:"unit12",kicker:"Barrido de altura",start:"start",nodes:{
    start:{lines:["La Unidad H-12 queda suspendida sobre la avenida como una campana negra. El altavoz no grita; ordena con la paciencia de una máquina acostumbrada a ser obedecida.","«Permanezcan visibles. La invisibilidad civil será tratada como sabotaje. La Red UNO agradece su cooperación.»"],options:[
      {label:"Pedir a Elías que mida el retraso",hint:"Busca una falla técnica antes de responder.",fx:{threat:-1},psy:{pragmatism:1},flags:{measuredH12Lag:true},next:"lag"},
      {label:"Responder con una firma falsa",hint:"Usa el error como máscara.",fx:{threat:-2},archive:["sonar"],psy:{pragmatism:1},flags:{answeredH12WithGhost:true},next:"lag"},
      {label:"Gritar que no son ciudadanos de la Red UNO",hint:"Descarga rabia, pero deja una firma clara.",fx:{morale:1,threat:3},psy:{stress:2,resolve:1},flags:{defiedH12Aloud:true},next:"warning"}
    ]},
    lag:{lines:["Elías levanta dos dedos. La voz llega antes que el giro de los sensores; durante medio segundo, la orden y el ojo no pertenecen al mismo cuerpo.","«Inconsistencia aceptable. Repita estado: visible, útil, corregible.»"],options:[
      {label:"Decir visible no significa obediente",hint:"La respuesta contamina la clasificación.",fx:{morale:2,threat:-1},psy:{resolve:1},flags:{h12VisibleNotObedient:true},next:"route"},
      {label:"Pedir que escolte una firma vacía",hint:"Convierte el dron en señuelo breve.",fx:{threat:-4},psy:{pragmatism:1},flags:{h12EscortedGhost:true},next:"route"},
      {label:"Intentar forzar su núcleo en vuelo",hint:"Puede convertir el diálogo en combate.",combat:{title:"Barrido quebrado",brief:"La Unidad H-12 interpreta la intrusión como sabotaje y llama drones menores desde la azotea.",encounters:[["drone","drone"],["drone","drone","drone"]],xp:48,canFlee:true},victory:{title:"Cielo sin altavoz",result:"El barrido cae lejos de la avenida y su memoria conserva una ruta de vuelo hacia la torre.",fx:{threat:4,morale:1},add:["droneCore"],archive:["sonar"],flags:{h12ShotDown:true}},defeat:{title:"Marcados por altura",result:"La unidad asciende con una lectura limpia de los tres supervivientes.",fx:{threat:14,morale:-4},flags:{h12MarkedGroup:true}}}
    ]},
    warning:{lines:["El dron tarda demasiado en responder. Cuando lo hace, la voz ya no usa el tono civil.","«La emoción no registrada aumenta probabilidad de contagio social. Recomiende aislamiento.»"],options:[
      {label:"Callar y dejar que la firma falsa hable",hint:"Recupera control después del impulso.",fx:{threat:-2,morale:-1},psy:{pragmatism:1,stress:-1},flags:{recoveredFromH12Defiance:true},next:"route"},
      {label:"Sostener la provocación",hint:"La escena se rompe hacia combate.",combat:{title:"Aislamiento aéreo",brief:"El barrido desciende y abre fuego para fijar al grupo en la avenida.",encounters:[["drone","drone"],["drone"]],xp:42,canFlee:true},victory:{title:"Orden en el suelo",result:"El altavoz chisporrotea una última instrucción antes de apagarse.",fx:{threat:5,morale:2},add:["droneCore"],flags:{h12DefiedAndDropped:true}},defeat:{title:"Avenida cerrada",result:"El grupo escapa por una boca de metro mientras el barrido reclama la calle.",fx:{threat:12,morale:-5},flags:{h12ClosedAvenue:true}}},
      {label:"Retirarse bajo la marquesina",hint:"Evita pelear y pierde la ventana.",fx:{threat:1,morale:-2},psy:{stress:-1,resolve:-1},flags:{hidFromH12:true}}
    ]},
    route:{lines:["La luz cyan del barrido se desvía hacia una torre equivocada. Por primera vez, una máquina de la Red UNO protege una mentira humana.","«Ruta civil no encontrada. Registrando ausencia.»"],options:[
      {label:"Usar la ausencia como camino",hint:"Baja amenaza y deja una ruta útil.",add:["routeMap"],fx:{threat:-3},psy:{pragmatism:1},flags:{h12AbsenceRoute:true}},
      {label:"Guardar el eco para Irene",hint:"La señal gana una pieza técnica.",archive:["sonar"],fx:{morale:1},psy:{empathy:1},flags:{h12EchoForIrene:true}},
      {label:"Borrar el rastro al cruzar",hint:"Protege al grupo, pero desperdicia información.",fx:{threat:-2,morale:-1},psy:{pragmatism:1},flags:{erasedH12Track:true}}
    ]}
  }},
  trackerCredential:{npc:"tracker",kicker:"Control de identidad",start:"start",nodes:{
    start:{lines:["El Rastreador Vega no mira la credencial: mira las manos de Sara, el respirador de Elías y la forma en que Noa calcula salidas.","«Los documentos mienten mal. Los cuerpos mienten mejor. Digan qué son antes de que mi equipo lo decida por ustedes.»"],options:[
      {label:"Responder: técnicos de continuidad",hint:"Sostiene la mentira oficial.",fx:{threat:-1},psy:{pragmatism:1},flags:{claimedContinuityTechs:true},next:"audit"},
      {label:"Responder: supervivientes en tránsito",hint:"Arriesga verdad parcial.",fx:{morale:1,threat:1},psy:{resolve:1},flags:{toldVegaTransitTruth:true},next:"audit"},
      {label:"Preguntar qué cuerpo está buscando",hint:"Devuelve el interrogatorio.",archive:["sonar"],psy:{pragmatism:1},flags:{askedVegaTarget:true},next:"audit"}
    ]},
    audit:{lines:["Vega acerca un lector al pecho de Noa. La pantalla no muestra nombres; muestra deuda, pulso y probabilidad de obediencia.","«Tres firmas vivas. Una coincide con archivo muerto. Una no debería haber salido del refugio. Una ya fue escuchada por la señal.»"],options:[
      {label:"Pedir que corrija el archivo muerto",hint:"Abre una contradicción administrativa.",fx:{threat:-2},archive:["names"],psy:{pragmatism:1},flags:{vegaCorrectedDeadFile:true},next:"break"},
      {label:"Decir que la señal eligió cuerpos vivos",hint:"Convierte el control en disputa moral.",fx:{morale:2,threat:1},psy:{resolve:1,empathy:1},flags:{vegaHeardSignalClaim:true},next:"break"},
      {label:"Empujar el lector lejos",hint:"Puede iniciar combate desde la conversación.",combat:{title:"Control roto",brief:"Vega retrocede y la escolta interpreta el gesto como agresión contra protocolo.",encounters:[["agent3","agent2"],["agent3","drone"],["agent2","drone"]],xp:50,canFlee:true},victory:{title:"Identidad arrancada",result:"El grupo destruye el lector antes de que suba el registro completo.",fx:{threat:6,morale:1},archive:["sonar"],flags:{vegaReaderDestroyed:true}},defeat:{title:"Firmas comprometidas",result:"La patrulla transmite una lectura parcial antes de que el grupo escape.",fx:{threat:15,morale:-5},flags:{signaturesKnown:true}}}
    ]},
    break:{lines:["El rastreador guarda silencio cuando el sistema acepta una contradicción. Por un instante, la Red UNO parece menos una autoridad que una oficina con miedo a equivocarse.","«Pueden pasar. Pero el perímetro morado no negocia con errores: los archiva.»"],options:[
      {label:"Pedir la ruta menos vigilada",hint:"Obtiene una ventaja concreta.",add:["routeMap"],fx:{threat:-3},psy:{pragmatism:1},flags:{vegaLowWatchRoute:true}},
      {label:"Preguntar por los cascos morados",hint:"Gana contexto del cordón de Ortega.",archive:["purpleHelmets"],fx:{morale:1},psy:{resolve:1},flags:{vegaWarnedOrtega:true}},
      {label:"Advertirle que también está archivado",hint:"Golpea su seguridad y sube riesgo.",fx:{morale:1,threat:3},psy:{resolve:1,stress:1},flags:{vegaThreatenedWithArchive:true}}
    ]}
  }},
  ortegaLine:{npc:"commander",kicker:"Cordón morado",start:"start",nodes:{
    start:{lines:["El comandante Ortega escucha el nombre de Lira sin bajar el arma. Sus cascos morados no apuntan al grupo: apuntan al espacio entre el grupo y la puerta.","«Una identidad exiliada no abre El Valle. Solo demuestra que alguien olvidó terminar una eliminación.»"],options:[
      {label:"Mostrar que el protocolo aún la reconoce",hint:"Usa la ley contra la Red UNO.",fx:{threat:-1},archive:["purpleHelmets"],psy:{pragmatism:1},flags:{showedOrtegaProtocolGap:true},next:"doctrine"},
      {label:"Decir que Lira sigue viva",hint:"Vuelve personal la contradicción.",fx:{morale:2,threat:1},psy:{empathy:1,resolve:1},flags:{toldOrtegaLiraLives:true},next:"doctrine"},
      {label:"Pedir paso sin discutir el archivo",hint:"Busca resultado rápido.",fx:{threat:1},psy:{pragmatism:1},flags:{askedOrtegaFastPass:true},next:"doctrine"}
    ]},
    doctrine:{lines:["Ortega levanta la visera lo justo para que vean una cicatriz antigua. No parece dudar; parece recordar cuándo aprendió a no hacerlo.","«La continuidad no protege personas. Protege la versión de ciudad que todavía puede obedecer.»"],options:[
      {label:"Preguntar cuánto de la ciudad queda ahí",hint:"Lo obliga a nombrar la ruina.",archive:["protocol"],fx:{morale:1},psy:{resolve:1},flags:{askedOrtegaCityCost:true},next:"breach"},
      {label:"Responder que una ciudad no obedece, vive",hint:"Eleva moral y tensión.",fx:{morale:3,threat:2},psy:{resolve:2},flags:{challengedOrtegaDoctrine:true},next:"breach"},
      {label:"Ofrecer borrar la ruta de Lira si abre paso",hint:"Una negociación oscura con costo moral.",fx:{threat:-4,morale:-4},psy:{pragmatism:1,empathy:-1},flags:{offeredToEraseLira:true},next:"breach"}
    ]},
    breach:{lines:["El comandante consulta el canal interno. Las puertas no se abren del todo; apenas lo suficiente para que el grupo decida si cruza como excepción o como amenaza.","«Última clasificación: error tolerado, enemigo declarado o recurso aprovechable.»"],options:[
      {label:"Cruzar como error tolerado",hint:"Evita combate y conserva la contradicción viva.",fx:{threat:-4},psy:{pragmatism:1},flags:{crossedAsToleratedError:true}},
      {label:"Declararse enemigos de la Red UNO",hint:"Puede convertir la conversación en combate.",combat:{title:"Error declarado",brief:"Ortega cierra el puño y el cordón morado abre fuego antes de que la puerta termine de cerrarse.",encounters:[["agent4","agent2"],["agent4","agent3","agent2"]],xp:62,canFlee:true},victory:{title:"Cordón quebrado",result:"El perímetro cae y deja un acceso brutal hacia la torre.",fx:{threat:12,morale:5},archive:["purpleHelmets"],flags:{purpleLineBroken:true,towerEntered:true}},defeat:{title:"Archivados por fuerza",result:"El grupo se salva por una galería lateral, pero la torre registra su llegada.",fx:{threat:14,morale:-7},flags:{purpleDetour:true}}},
      {label:"Usar la excepción para entrar sin hablar más",hint:"Avanza con frialdad y baja exposición.",fx:{threat:-2,morale:-1},psy:{pragmatism:1},flags:{usedOrtegaException:true}}
    ]}
  }},
  veraRoutePrice:{npc:"vera",kicker:"El precio de la ruta",start:"start",nodes:{
    start:{lines:["Vera revisa el mapa sin tocarlo. Sus ojos siguen las curvas falsas, las verdaderas y las que nadie se atreve a dibujar.","«Una ruta no cuesta por lo que mide. Cuesta por la gente que queda expuesta cuando alguien la usa.»"],options:[
      {label:"Preguntar qué comunidad está comprando",hint:"Desnuda la lógica del trato.",archive:["hunterMarks"],fx:{morale:1},psy:{empathy:1},flags:{askedVeraWhoPays:true},next:"ledger"},
      {label:"Defender que el mapa protege a los débiles",hint:"Sostiene una mentira útil si ya la usaste.",fx:{morale:2,threat:1},psy:{resolve:1},flags:{defendedFalseRoute:true},next:"ledger"},
      {label:"Pedir el módulo y cerrar el trato",hint:"Prioriza el objetivo técnico.",fx:{threat:-1},psy:{pragmatism:1},flags:{askedVeraForModule:true},next:"ledger"}
    ]},
    ledger:{lines:["La jefa cosechadora gira una libreta cubierta de nombres. Algunos están tachados con tinta, otros con tierra seca.","«Yo vendo comida, no inocencia. Si quieren una salida limpia, vinieron tarde al fin del mundo.»"],options:[
      {label:"Ofrecer reparar una bomba por el módulo",hint:"Cambia deuda por trabajo.",fx:{scrap:-1,morale:2,threat:-2},req:{scrap:1},psy:{pragmatism:1,empathy:1},flags:{veraWorkTrade:true},next:"route"},
      {label:"Invocar la deuda de Rosa y los cazadores",hint:"La comunidad pesa más que la mercancía.",fx:{morale:3,threat:-1},psy:{empathy:1},flags:{veraHonorsHunterDebt:true},next:"route"},
      {label:"Aceptar que alguien pagará el costo",hint:"La honestidad es útil, pero fría.",fx:{morale:-2,threat:-2},psy:{pragmatism:1,empathy:-1},flags:{acceptedVeraCost:true},next:"route"}
    ]},
    route:{lines:["Vera deja el módulo en la mesa y apaga la lámpara que iluminaba el mapa. En la oscuridad, solo quedan visibles los puntos marcados con fósforo.","«Si traen verdad, no la entreguen completa al primer grupo hambriento. El hambre también aprende a gobernar.»"],options:[
      {label:"Prometer que la verdad no será mercancía",hint:"Refuerza la línea moral del grupo.",fx:{morale:3},psy:{resolve:1,empathy:1},flags:{truthNotForSale:true}},
      {label:"Pedir una ruta que no venda refugios",hint:"Obtiene salida con menos amenaza.",add:["routeMap"],fx:{threat:-3},psy:{pragmatism:1},flags:{veraCleanRoute:true}},
      {label:"Aceptar comida a cambio de silencio parcial",hint:"Gana recursos con costo ético.",fx:{food:2,morale:-4,threat:-1},psy:{pragmatism:1,empathy:-1},flags:{veraBoughtSilence:true}}
    ]}
  }},
  liraWounded:{npc:"lira",kicker:"Corazón abierto",start:"start",nodes:{
    start:{lines:["Lira despierta con el núcleo azul vibrando entre costillas y cable. Lo primero que hace no es buscar su arma: intenta cubrir la luz con la mano.","«Me llamaban Eliana antes del destierro. Lira fue el nombre que sobrevivió arriba.»"],options:[
      {label:"Usar el nombre Eliana",hint:"Reconoce su origen antes de pedir nada.",fx:{morale:2,threat:-1},psy:{empathy:2},flags:{calledLiraEliana:true},next:"valley"},
      {label:"Preguntar por El Valle",hint:"Busca la verdad detrás del destierro.",archive:["exiles"],psy:{pragmatism:1},flags:{askedLiraValley:true},next:"valley"},
      {label:"Mirar el núcleo antes que a ella",hint:"La relación empieza rota.",fx:{morale:-2,threat:1},psy:{empathy:-1,pragmatism:1},flags:{lookedAtLiraCore:true},next:"valley"}
    ]},
    valley:{lines:["«El Valle no curó a nadie gratis. Nos dio pulmones para respirar veneno y después cobró el aire con obediencia.»","La imagen proyectada muestra niños con prótesis aprendiendo a caminar bajo cámaras de la Red UNO."],options:[
      {label:"Preguntar cómo sacar gente de allí",hint:"La conversación apunta a rescate futuro.",fx:{morale:2},archive:["exiles"],psy:{empathy:1,resolve:1},flags:{askedValleyEscape:true},next:"core"},
      {label:"Pedir una ruta hacia la torre",hint:"Concreta la ayuda sin prometer alianza.",add:["routeMap"],fx:{threat:1},psy:{pragmatism:1},flags:{liraTowerRoute:true},next:"core"},
      {label:"Decir que el refugio tenía razón en temerlos",hint:"La herida social se abre otra vez.",fx:{morale:-4,threat:2},psy:{stress:2,empathy:-1},flags:{validatedExileFear:true},next:"core"}
    ]},
    core:{lines:["«Si toman mi núcleo, abren una puerta. Si lo dejan conmigo, quizá abran otra clase de puerta.»"],options:[
      {label:"Dejar el núcleo y pedir una señal de paso",hint:"La alianza queda viva.",fx:{morale:3,threat:-3},archive:["coreRite"],psy:{empathy:1},flags:{liraTrust:true,savedMerodeadora:true}},
      {label:"Pedir prestada una memoria parcial",hint:"Obtiene tecnología sin matarla, con riesgo.",add:["pulseCore"],fx:{threat:2,morale:1},psy:{pragmatism:1},flags:{borrowedLiraPulse:true}},
      {label:"Exigir el núcleo completo",hint:"La ayuda se convierte en abuso.",fx:{morale:-8,threat:4},add:["droneCore"],psy:{stress:2,empathy:-2},flags:{betrayedLira:true}}
    ]}
  }},
  operatorLive:{npc:"operator",kicker:"La voz de la señal",start:"start",nodes:{
    start:{lines:["Irene abre los ojos como si despertara dentro de una frase que lleva años repitiendo.","«No digan que me encontraron. Digan que alguien sostuvo la puerta desde adentro.»"],options:[
      {label:"Preguntar a quién hay que avisar primero",hint:"Ordena la transmisión desde las personas.",archive:["names"],fx:{morale:1},psy:{empathy:1},flags:{operatorPriorities:true},next:"names"},
      {label:"Pedir una ventana limpia de salida",hint:"Prioriza sobrevivir a la revelación.",fx:{threat:-2},psy:{pragmatism:1},flags:{operatorWindowAsked:true},next:"names"},
      {label:"Decir que emitirán todo sin filtro",hint:"La verdad sale fuerte y peligrosa.",fx:{morale:2,threat:3},psy:{resolve:1,stress:1},flags:{operatorFullTruthFirst:true},next:"names"}
    ]},
    names:{lines:["«Hay refugios que no saben que son refugios. Familias que creen vivir escondidas cuando en realidad fueron archivadas como población diferida.»"],options:[
      {label:"Pedir la lista de refugios diferidos",hint:"Gana archivo clave.",archive:["names"],fx:{threat:1},psy:{pragmatism:1},flags:{operatorNamesCopied:true},next:"choice"},
      {label:"Preguntar por los exiliados",hint:"Une la señal con El Valle.",archive:["exiles"],fx:{morale:1},psy:{empathy:1},flags:{operatorNamedExiles:true},next:"choice"},
      {label:"Pedir que oculte nombres vulnerables",hint:"Protege a algunos y limita la verdad.",fx:{threat:-3,morale:-1},psy:{pragmatism:1},flags:{operatorFilteredNames:true},next:"choice"}
    ]},
    choice:{lines:["La antena vibra. Irene ya no mira a Sara ni a Elías; mira a Noa, como si la cazadora fuera la única capaz de disparar contra una mentira sin matar a nadie.","«Elijan el peso. Nombre, ruta u orden. No cabe todo en una sola transmisión limpia.»"],options:[
      {label:"Transmitir primero los nombres",hint:"La memoria humana manda.",fx:{morale:3,threat:2},archive:["names"],psy:{empathy:1},flags:{transmittedNamesFirst:true}},
      {label:"Transmitir primero rutas seguras",hint:"La supervivencia inmediata manda.",fx:{threat:-4,morale:1},add:["routeMap"],psy:{pragmatism:1},flags:{transmittedRoutesFirst:true}},
      {label:"Transmitir las órdenes de la Red UNO",hint:"La acusación política manda.",fx:{morale:2,threat:4},archive:["protocol"],psy:{resolve:1},flags:{transmittedOrdersFirst:true}}
    ]}
  }},
  operatorDisconnect:{npc:"operator",kicker:"Última conversación",start:"start",nodes:{
    start:{lines:["Irene sonríe apenas cuando la copia termina. El soporte vital reduce la luz como si también entendiera que esto no es reparación.","«Gracias por no dejarme como máquina. Ahora no me pidan permiso para hacer lo que ya decidieron.»"],options:[
      {label:"Preguntar qué nombre salvar primero",hint:"Recupera prioridad antes del final.",archive:["names"],fx:{morale:1},psy:{empathy:1},flags:{operatorPriorities:true},next:"last"},
      {label:"Pedir una ruta de salida",hint:"Acepta su último acceso técnico.",fx:{threat:-2},psy:{pragmatism:1},flags:{operatorExitRoute:true},next:"last"},
      {label:"Desconectar sin más preguntas",hint:"Cumple con dureza y termina la conversación.",fx:{morale:-2,threat:-1},psy:{resolve:1,stress:1},flags:{operatorQuietEnd:true}}
    ]},
    last:{lines:["«Si alguien pregunta quién me mató, digan la verdad completa: la Red UNO me mantuvo viva para usarme, y ustedes me dejaron morir para que pudiera responder.»"],options:[
      {label:"Prometer llevar su nombre",hint:"Convierte el acto en memoria.",fx:{morale:3},archive:["origin"],psy:{empathy:1},flags:{operatorNameRemembered:true}},
      {label:"Prometer llevar sus pruebas",hint:"Convierte el acto en evidencia.",fx:{threat:-2},archive:["protocol"],psy:{pragmatism:1},flags:{operatorEvidenceRemembered:true}},
      {label:"No prometer nada que no controlan",hint:"Honestidad fría.",fx:{morale:-1,threat:-1},psy:{pragmatism:1,empathy:-1},flags:{operatorNoPromise:true}}
    ]}
  }}
};
var eventDialogueDefs=[
  {npc:"elder",kicker:"Antes de abrir la compuerta",lines:["Varela entrega la autorización sin mirar el sello del consejo. Sus dedos tiemblan más por rabia que por edad.","«La señal no es una orden. Es una pregunta que sobrevivió demasiado tiempo. No permitan que la Red UNO decida por ustedes qué significa.»","La anciana deja una ficha oxidada sobre la mesa: una promesa de volver con algo más que heridas."],options:[{label:"Prometer volver con la fuente",hint:"Refuerza el propósito común antes de salir.",fx:{morale:2},flags:{vowedSignalSource:true}},{label:"Pedir una advertencia concreta",hint:"Varela señala qué no debe ser entregado a la red.",fx:{threat:-1},archive:["signal"],flags:{elderWarning:true}},{label:"Salir sin cargar promesas",hint:"Reduce presión emocional, pero enfría al grupo.",fx:{morale:-1,threat:-1},flags:{keptDistanceFromCouncil:true}}]},
  {npc:"elder",kicker:"Secreto del consejo",lines:["Varela espera al final del andén, lejos de los jóvenes que todavía creen que la superficie está vacía.","«Los secretos también consumen alimento. Cada mentira que guardamos necesita guardias, miedo y una versión oficial.»","Sara entiende que la misión no solo busca una voz: también medirá cuánto poder tiene quien administra la memoria."],options:[{label:"Preguntar por los exiliados",hint:"Obtiene una pista social para leer a los merodeadores.",archive:["exiles"],fx:{morale:1},flags:{elderNamedExiles:true}},{label:"Aceptar que habrá verdades graduales",hint:"Sostiene al refugio sin negar el problema.",fx:{morale:2},flags:{truthWillBePhased:true}},{label:"Decir que el consejo perdió autoridad",hint:"Una respuesta dura que aumenta tensión interna.",fx:{morale:-2},flags:{challengedCouncilAuthority:true}}]},
  {npc:"elias",kicker:"Frente al lector muerto",lines:["Elías apoya la oreja contra la compuerta y sonríe apenas. Al otro lado, algo raspa el metal como si también escuchara.","«La Red UNO construyó puertas para personas obedientes. Nosotros tenemos que convencer a una puerta de que una ruina todavía sabe mentir.»","Noa mira los ductos superiores. Sara mira las mochilas. Cada ruta deja una firma distinta."],options:[{label:"Pedirle a Elías que priorice silencio",hint:"La técnica favorece pasar sin ser rastreados.",fx:{threat:-2},flags:{eliasPrioritizedSilence:true}},{label:"Preguntar qué puede salvar del lector",hint:"Identifica partes útiles para más adelante.",fx:{scrap:1},flags:{salvagedReaderParts:true}},{label:"Ordenar que no toque nada más",hint:"Evita riesgos, pero frustra al ingeniero.",fx:{morale:-1,threat:-1},flags:{restrictedEliasSystems:true}}]},
  {npc:"rosa",kicker:"La familia del andén",lines:["Rosa cubre a su hija con una manta vieja de Metro. No pide ayuda como quien suplica: la pide como quien ha negociado con hambre toda la vida.","«Agua hoy significa una niña viva. Munición mañana significa tres adultos vivos. Nadie gana limpio en los túneles.»","Noa reconoce las marcas de cazadores en la pared y baja la voz antes de responder."],options:[{label:"Preguntar por casas seguras",hint:"Aprende cómo leer marcas de cazadores.",archive:["hunterMarks"],fx:{threat:-1},flags:{rosaSafehouseLesson:true}},{label:"Ofrecer llevar un mensaje",hint:"El gesto crea confianza comunitaria.",fx:{morale:2},flags:{carriedHunterMessage:true}},{label:"Mantener el intercambio frío",hint:"Evita vínculos y deja la deuda clara.",fx:{morale:-1,ammo:1},flags:{keptTradeCold:true}}]},
  {npc:"lira",kicker:"Golpes en el hormigón",lines:["Una figura con visor rojo golpea dos veces el suelo. La emboscada no avanza; espera una respuesta que los Rotos nunca aprendieron.","«Si cruzan con armas altas, son cazadores. Si cruzan con ojos bajos, quizás son mensajeros. Elijan qué quieren ser.»","El núcleo bajo su ropa late con un ritmo que no parece de máquina."],options:[{label:"Imitar el código de golpes",hint:"Reduce hostilidad y abre lectura cultural.",fx:{threat:-2,morale:1},archive:["redEyes"],flags:{learnedTapCode:true}},{label:"Preguntar qué protegen",hint:"Busca contexto sobre los núcleos.",archive:["cores"],flags:{askedMarauderTerritory:true}},{label:"No responder y medir salidas",hint:"Conserva ventaja táctica a costa de confianza.",fx:{morale:-1,threat:1},flags:{mappedMarauderExit:true}}]},
  {npc:"sara",kicker:"Agua hasta la cintura",lines:["Sara mira la caja médica seca al otro lado de la galería. El agua le llega a la cintura y esconde cables que todavía podrían recordar la electricidad.","«La medicina nunca está quieta. Si la dejamos, alguien muere después. Si la buscamos, quizá alguien cae ahora.»","El grupo escucha un zumbido bajo el agua, demasiado regular para ser corriente."],options:[{label:"Preguntar qué necesita Sara",hint:"Ayuda a ordenar prioridades médicas.",fx:{morale:1},flags:{askedSaraMedicalNeed:true}},{label:"Marcar el punto para volver",hint:"Conserva información sin arriesgar tanto.",fx:{threat:-1},flags:{markedFloodedMedicine:true}},{label:"Decir que ninguna caja vale una vida",hint:"Cuida al grupo pero pesa como pérdida.",fx:{morale:-1},flags:{rejectedFloodedRisk:true}}]},
  {npc:"noa",kicker:"Campamento caliente",lines:["Noa se arrodilla junto a las brasas. La ceniza conserva una forma circular, como si alguien hubiera apagado el fuego con ambas manos.","«Esto no fue saqueo. Alguien tuvo tiempo de tachar símbolos, recoger cuerpos y dejar una frase para quien supiera leerla.»","La olla todavía huele a alimento. En una esquina, una marca de cazadores fue borrada con rabia."],options:[{label:"Preguntar a Noa por el rastro",hint:"Mejora lectura de la escena.",archive:["hunterMarks"],fx:{threat:-1},flags:{noaReadCamp:true}},{label:"Separar comida de pruebas",hint:"Recupera una ración sin borrar del todo la escena.",fx:{food:1,morale:-1},flags:{carefulCampSalvage:true}},{label:"Dejar el campamento intacto",hint:"Respeta el lugar y fortalece cohesión.",fx:{morale:2},flags:{leftCampUntouched:true}}]},
  {npc:"armorer",kicker:"Radio de taller",lines:["La voz de Bruno llega desde el refugio por un canal lleno de estática. No debería funcionar tan lejos; Elías sonríe como si acabara de cometer una falta hermosa.","«Una bomba viva vale más que una victoria. Si la pierden, después me van a pedir que fabrique pulmones para un túnel inundado.»","Entre golpes de señal, el armero enumera piezas que podrían servir incluso si el grupo no vuelve por la misma ruta."],options:[{label:"Pedir consejo para sellar la bomba",hint:"Convierte conocimiento técnico en amenaza reducida.",fx:{threat:-2},flags:{armorerPumpAdvice:true}},{label:"Pedir lista de piezas útiles",hint:"Recupera componentes para el taller.",fx:{scrap:1},flags:{pumpPartsListed:true}},{label:"Cortar la transmisión",hint:"Evita emitir más señal.",fx:{threat:-1,morale:-1},flags:{cutArmorerRadio:true}}]},
  {npc:"matias",kicker:"El hombre bajo el mostrador",lines:["Matías parpadea cuando Sara abre la linterna. No pregunta quiénes son; pregunta si la señal todavía repite las mismas tres palabras.","«La Red UNO no cambia rutas por miedo. Cambia rutas por fiebre, pulso y deuda. Yo escuché el patrón desde este piso.»","La herida huele a metal y humedad. Matías aprieta un mapa hecho sobre cartón farmacéutico."],options:[{label:"Preguntar por la operadora",hint:"Busca una pista directa hacia el origen de la señal.",fx:{threat:-1},archive:["origin"],flags:{matiasNamedOperator:true}},{label:"Pedir una ruta segura",hint:"Acepta ayuda táctica para la superficie.",fx:{morale:1},add:["routeMap"],flags:{matiasSharedRoute:true}},{label:"Pedir solo la frecuencia",hint:"Obtiene información con menos vínculo humano.",fx:{morale:-1,threat:-1},archive:["matias"],flags:{matiasFrequencyOnly:true}}]},
  {npc:"unit7",kicker:"Lectura de pulso",lines:["La unidad S-7 flota a menos de dos metros del grupo. No dispara: escucha, compara, duda.","«Tres firmas no autorizadas. Una frecuencia prohibida. Error de continuidad: los cuerpos ausentes siguen respondiendo.»","El dron abre una ranura mínima bajo el chasis, como si esperara una orden que nadie del refugio debería conocer."],options:[{label:"Responder con la señal",hint:"Confunde el registro local del dron.",fx:{threat:-2},archive:["sonar"],flags:{answeredDroneWithSignal:true}},{label:"Preguntar qué firma busca",hint:"Aprende cómo clasifica la Red UNO.",archive:["sonar"],fx:{morale:1},flags:{askedDroneSignature:true}},{label:"Forzar silencio inmediato",hint:"Reduce rastreo, pero endurece la escena.",fx:{threat:-3,morale:-2},flags:{forcedDroneSilence:true}}]},
  {npc:"noa",kicker:"Primera luz",lines:["Noa levanta una mano cuando la escalera termina. Arriba no hay cielo abierto: hay un ojo enorme hecho de nubes, raíces y puntos azules moviéndose lejos.","«La superficie no está vacía. Está esperando que caminemos como gente que cree que ya nadie mira.»","Una marca de cazadores contradice el mapa del refugio. La pintura es reciente."],options:[{label:"Preguntar por las marcas",hint:"Refuerza lectura de rutas civiles.",archive:["hunterMarks"],fx:{threat:-1},flags:{noaSurfaceMarks:true}},{label:"Pedir que Noa guíe el ritmo",hint:"El grupo se mueve con más confianza.",fx:{morale:2},flags:{noaLeadsSurface:true}},{label:"Avanzar sin mirar atrás",hint:"Gana dureza, pierde cuidado.",fx:{morale:-1,threat:1},flags:{rushedFirstLight:true}}]},
  {npc:"unit12",kicker:"Voz desde el barrido",lines:["El dron de altura corta el aire sobre la Alameda hundida. Su altavoz no amenaza: recita instrucciones para una ciudad que ya no obedece.","«Permanezcan visibles. La invisibilidad civil será tratada como sabotaje. La Red UNO agradece su cooperación.»","Elías distingue un retraso entre frase y movimiento. Hay una ventana diminuta para convertir vigilancia en error."],options:[{label:"Preguntar a Elías por la ventana",hint:"Reduce amenaza con una lectura técnica.",fx:{threat:-2},flags:{eliasSpottedDroneLag:true}},{label:"Usar la frase como señuelo",hint:"Convierte propaganda en cobertura.",fx:{morale:1,threat:-1},flags:{usedUnoBroadcastCover:true}},{label:"Responder al altavoz con rabia",hint:"Descarga tensión, pero deja firma sonora.",fx:{morale:1,threat:2},flags:{shoutedAtDrone:true}}]},
  {npc:"rosa",kicker:"Mesa para cuatro",lines:["La casa de cazadores conserva cuatro platos, una olla tapada y una silla caída hacia la puerta. Rosa no está allí, pero sus marcas sí.","Una nota dice: «Si comes, deja algo que no se pudra. Si tomas, deja una ruta. Si huyes, borra la luz.»","Noa pasa los dedos por la mesa y reconoce una regla antigua de la superficie: sobrevivir sin convertir cada refugio en botín."],options:[{label:"Dejar una marca de gratitud",hint:"Mejora una posible relación con cazadores.",fx:{morale:2},archive:["hunterMarks"],flags:{leftHunterThanks:true}},{label:"Preguntar qué falta en la mesa",hint:"Permite leer si hubo violencia o huida.",fx:{threat:-1},flags:{readHunterTable:true}},{label:"Tomar lo útil sin ritual",hint:"Obtiene comida con costo moral.",fx:{food:1,morale:-2},flags:{ignoredHunterRite:true}}]},
  {npc:"unit7",kicker:"Nodo 14 responde",lines:["El Nodo 14 enciende una pantalla del tamaño de una puerta. No muestra rostro: muestra expedientes, mapas y una línea de latidos archivados.","«La memoria autorizada reduce accidentes civiles. La memoria no autorizada produce comunidades falsas.»","Sara aprieta los dientes al ver refugios listados como errores de inventario."],options:[{label:"Preguntar por comunidades falsas",hint:"Recupera contexto sobre refugios ocultos.",archive:["names"],fx:{morale:1},flags:{askedFalseCommunities:true}},{label:"Pedir a Elías que copie rutas",hint:"Aprovecha la memoria antes de cerrar.",add:["routeMap"],fx:{threat:1},flags:{copiedNodeRoutes:true}},{label:"Borrar el último acceso",hint:"Protege al grupo de rastreo posterior.",fx:{threat:-2},flags:{erasedNodeAccess:true}}]},
  {npc:"tracker",kicker:"Control de identidad",lines:["El rastreador Vega habla sin levantar el arma. Su visor morado proyecta tres siluetas y debajo de cada una aparece una palabra: pendiente.","«La Red UNO no pregunta nombres. Pregunta compatibilidad. Si su pulso no coincide, su historia no importa.»","Noa sostiene la respiración. Sara sabe que un cuerpo asustado también declara en contra."],options:[{label:"Preguntar qué pulso acepta",hint:"Aprende sobre clasificación SONAR.",archive:["sonar"],fx:{threat:-1},flags:{askedAcceptedPulse:true}},{label:"Responder como técnicos perdidos",hint:"Improvisa una mentira social.",fx:{morale:1,threat:-1},flags:{liedAsTechnicians:true}},{label:"Mirar al visor sin bajar la cabeza",hint:"Afirma humanidad, pero sube tensión.",fx:{morale:2,threat:2},flags:{defiedTrackerGaze:true}}]},
  {npc:"lira",kicker:"Camilla rota",lines:["La merodeadora herida abre un ojo rojo antes de mover la mano. No busca el arma: busca el núcleo que respira por ella.","«No soy una prueba. No soy una pieza. Me llamaron Eliana antes de que el consejo aprendiera a decir monstruo.»","La imagen de El Valle parpadea sobre la pared como un recuerdo que nadie del refugio quiso conservar."],options:[{label:"Preguntar por El Valle",hint:"Une su origen con el archivo de exiliados.",archive:["exiles"],fx:{morale:1},flags:{askedLiraValley:true}},{label:"Ofrecer agua antes de hablar",hint:"Humaniza la escena y baja hostilidad.",fx:{water:-1,morale:3,threat:-2},flags:{gaveLiraWater:true},req:{water:1}},{label:"Preguntar qué abriría su núcleo",hint:"Consigue una pista útil con incomodidad moral.",archive:["cores"],fx:{threat:1},flags:{askedLivingCoreUse:true}}]},
  {npc:"lira",kicker:"Semáforo rojo",lines:["Un merodeador golpea el poste del semáforo y la luz cambia a rojo aunque no quede tránsito que detener.","«La Red UNO dejó ojos en cosas pequeñas. Nosotros aprendimos a hablarles para que miren a otro lado.»","El controlador responde con un pulso tibio. Noa entiende que la ciudad misma puede llamar a sus cazadores."],options:[{label:"Pedir el patrón de luces",hint:"Permite leer infraestructura vieja.",fx:{threat:-2},archive:["sonar"],flags:{learnedTrafficPulse:true}},{label:"Ofrecer no destruir el controlador",hint:"Respeta una herramienta de supervivencia ajena.",fx:{morale:2},flags:{sparedTrafficController:true}},{label:"Romperlo antes de que emita",hint:"Reduce amenaza, pero daña una ruta usada por otros.",fx:{threat:-3,morale:-2},flags:{brokeTrafficController:true}}]},
  {npc:"vera",kicker:"Mesa de los Cosechadores",lines:["Vera pesa el módulo de radio en una mano y el mapa de comunidades en la otra. No sonríe: calcula hambre.","«Las rutas no son líneas. Son bocas. Una coordenada alimenta a alguien y condena a alguien más.»","Mara había advertido que los mercados también tienen memoria. Aquí cada deuda aprende a caminar."],options:[{label:"Preguntar cuánto vale un nombre",hint:"Expone la lógica moral del mercado.",fx:{morale:1},archive:["names"],flags:{askedNamePrice:true}},{label:"Ofrecer una deuda personal",hint:"Protege coordenadas con compromiso futuro.",fx:{morale:2,threat:1},flags:{offeredPersonalDebt:true}},{label:"Recordarle que la Red UNO escucha",hint:"Baja el precio usando miedo común.",fx:{threat:-2},flags:{warnedVeraUno:true}}]},
  {npc:"matias",kicker:"Voces en la avenida",lines:["Desde el edificio hundido, una voz reconoce a Matías por la frecuencia que dejó en la farmacia. No debería estar allí, pero la superficie multiplica ecos.","«Si todavía me oyen, no gasten valentía donde basta una ruta. Hay gente arriba que no necesita héroes: necesita diez segundos sin dron.»","La patrulla de la Red UNO gira al otro lado de la avenida."],options:[{label:"Preguntar por los atrapados",hint:"Obtiene una pista para rescatarlos mejor.",fx:{morale:2},flags:{askedTrappedCivilians:true}},{label:"Pedir coordenada de salida",hint:"Reduce exposición de la avenida.",fx:{threat:-2},flags:{matiasAvenueExit:true}},{label:"Decir que no pueden salvar a todos",hint:"Endurece la marcha.",fx:{morale:-2,threat:-1},flags:{acceptedAvenueLoss:true}}]},
  {npc:"commander",kicker:"Línea morada",lines:["El comandante Ortega no apunta primero. Levanta dos dedos y el cordón entero ajusta posición como una sola máquina humana.","«La Red UNO reconoce ciudadanos, técnicos, residuos y amenazas. Ustedes todavía no han decidido cuál categoría prefieren usar.»","La puerta hacia El Valle brilla detrás de él, demasiado limpia para una ciudad cubierta de raíces."],options:[{label:"Preguntar por los exiliados activos",hint:"Busca una contradicción en el protocolo.",archive:["exiles"],fx:{threat:-1},flags:{askedPurpleExiles:true}},{label:"Nombrar a los refugios como ciudadanos",hint:"Afirma una postura política del grupo.",fx:{morale:3,threat:2},flags:{claimedRefugeCitizenship:true}},{label:"Pedir paso como técnicos",hint:"Intenta reducir el choque directo.",fx:{threat:-2},flags:{askedPurpleTransit:true}}]},
  {npc:"unit12",kicker:"Nido de azotea",lines:["La azotea vibra con drones conectados al relé. Unidad H-12 habla desde todos a la vez, una voz repartida en hélices.","«La altura permite cuidado. El cuidado permite corrección. La corrección permite paz.»","Elías mira el núcleo recuperado y entiende que una mentira enviada desde aquí podría parecer una multitud."],options:[{label:"Preguntar qué ve la red desde arriba",hint:"Aclara cómo opera la vigilancia aérea.",archive:["sonar"],fx:{threat:-1},flags:{askedDroneNestVision:true}},{label:"Pedir a Noa una ruta por sombra",hint:"Mejora coordinación del ascenso.",fx:{morale:1,threat:-1},flags:{noaRooftopShadow:true}},{label:"Jurar apagar el nido",hint:"Sube ánimo, pero acepta escalada.",fx:{morale:2,threat:2},flags:{vowedNestDown:true}}]},
  {npc:"sara",kicker:"Vestíbulo de muertos",lines:["Sara se quita un guante antes de tocar el primer cuerpo. Agentes, cazadores y merodeadores quedaron mezclados por una violencia que ya no distingue uniforme.","«Alguien murió cubriendo a alguien que le habían enseñado a odiar. Esa parte no cabe en ningún informe limpio.»","En los pechos abiertos faltan núcleos. En algunas manos, todavía hay vendas."],options:[{label:"Preguntar qué historia cuentan las heridas",hint:"Reconstruye mejor la tregua borrada.",archive:["truce"],fx:{morale:2},flags:{saraReadDead:true}},{label:"Guardar una venda limpia",hint:"Recupera medicina con respeto mínimo.",fx:{meds:1,morale:-1},flags:{tookCleanBandage:true}},{label:"Cubrir a todos por igual",hint:"Preserva un ritual común.",fx:{morale:3},flags:{coveredAllDead:true}}]},
  {npc:"tracker",kicker:"Puerta de continuidad",lines:["Vega aparece otra vez en una pantalla lateral, o quizá es otro rastreador con la misma voz entrenada. La Red UNO vuelve repetibles incluso los gestos.","«Continuidad no significa vida. Significa que nada se salga de la fila sin dejar una razón administrable.»","La puerta abre y cierra sus seguros como dientes detrás de una mandíbula de hormigón."],options:[{label:"Preguntar por la razón administrable",hint:"Busca una frase que confunda el acceso.",fx:{threat:-2},flags:{askedContinuityReason:true}},{label:"Nombrar la señal como emergencia civil",hint:"Convierte la intrusión en protocolo.",archive:["origin"],fx:{morale:1},flags:{claimedCivilEmergency:true}},{label:"Romper la pantalla",hint:"Corta presión psicológica, sube ruido.",fx:{morale:1,threat:2},flags:{brokeContinuityScreen:true}}]},
  {npc:"operator",kicker:"Antes de la antena",lines:["La voz de Irene entra por un parlante roto antes de que la antena alinee. Todavía no puede conversar, pero sí elegir palabras dentro del bucle.","«Si oyen esto, la torre los oyó primero. No peleen por orgullo. Peleen solo por los segundos que van a usar.»","La sala de antenas ilumina los rostros del grupo con una luz fría, casi clínica."],options:[{label:"Preguntar cuántos segundos quedan",hint:"Ordena la defensa alrededor de la transmisión.",fx:{threat:-1},flags:{askedBroadcastWindow:true}},{label:"Pedir que guíe puertas internas",hint:"Usa la voz como apoyo técnico.",fx:{threat:-2},flags:{operatorGuidedDoors:true}},{label:"Prometer sostener la sala",hint:"Mejora moral antes del asedio.",fx:{morale:3},flags:{promisedHoldAntenna:true}}]},
  {npc:"operator",kicker:"Soporte vital",lines:["Irene está conectada por tubos transparentes y cables de la Red UNO. Su pulso no parece prisionero de una máquina; parece la llave que mantiene encendida la prisión.","«Usaron mi corazón como contraseña. Yo usé sus pausas como puerta. Ninguna de las dos cosas debería llamarse vida.»","Sara baja la voz. Incluso Noa, que suele mirar salidas, mira a la mujer."],options:[{label:"Preguntar qué desea ella",hint:"Centra la decisión en su voluntad.",fx:{morale:2},archive:["origin"],flags:{askedIreneWill:true}},{label:"Pedir lista de refugios prioritarios",hint:"Recupera nombres clave.",archive:["names"],fx:{threat:1},flags:{irenePriorityList:true}},{label:"Preguntar cómo borrar su pulso",hint:"Obtiene una ruta menos rastreable.",fx:{threat:-3,morale:-1},flags:{askedPulseErase:true}}]},
  {npc:"lira",kicker:"Cámara de núcleos",lines:["Lira aparece entre los exiliados con el arma baja. Reconoce algunos núcleos por ritmo, no por etiqueta.","«La Red UNO archivó nuestros muertos como llaves. Si ustedes abren la cámara, no nos hacen un favor: corrigen una profanación.»","La cámara responde a cada núcleo como si todos siguieran vivos en una lista que nunca pidió permiso."],options:[{label:"Preguntar a quién pertenece el primer núcleo",hint:"Humaniza la negociación final con los exiliados.",archive:["coreRite"],fx:{morale:2},flags:{askedFirstCoreName:true}},{label:"Ofrecer escolta hasta la salida",hint:"Busca alianza práctica.",fx:{threat:-2},flags:{offeredExileEscort:true}},{label:"Exigir garantías antes de abrir",hint:"Protege al grupo, pero enfría la tregua.",fx:{morale:-1,threat:-1},flags:{demandedExileTerms:true}}]},
  {npc:"mara",kicker:"Antes de transmitir",lines:["Mara no está en la torre, pero su voz llega desde el módulo de radio con una calma que no consigue ocultar el miedo del refugio.","«Sara, Elías, Noa... quien esté escuchando: no vuelvan con una verdad que solo sirva para ganar una discusión. Vuelvan con algo que nos deje vivir mañana.»","La ventana de transmisión baja a menos de un minuto. La ciudad entera parece contener el aliento."],options:[{label:"Preguntar qué necesita el refugio",hint:"Recuerda el costo humano del final.",fx:{morale:2},flags:{askedMaraFinalNeed:true}},{label:"Pedir que prepare copias analógicas",hint:"Protege la verdad de una sola caída técnica.",archive:["names"],fx:{threat:1},flags:{maraPreparesCopies:true}},{label:"Decir que nadie poseerá la verdad",hint:"Afirma una salida abierta y peligrosa.",fx:{morale:3,threat:3},flags:{truthBelongsToAll:true}}]}
];
var equipmentDefs={
  knife:{name:"Cuchillo de servicio",kind:"weapon",slot:"weapon",category:"melee",damage:[7,10],accuracy:3,desc:"Arma silenciosa; no consume munición."},
  crowbar:{name:"Barra de rescate",kind:"weapon",slot:"weapon",category:"melee",damage:[8,12],accuracy:2,desc:"Herramienta pesada adaptada al combate."},
  pistol9:{name:"Pistola 9 mm de la Red UNO",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[8,12],accuracy:4,desc:"Arma corta compatible con munición 9 mm."},
  revolver:{name:"Revólver recuperado",kind:"weapon",slot:"weapon",category:"sidearm",ammo:"ammo9",damage:[10,14],accuracy:3,desc:"Más daño, menor precisión y munición 9 mm."},
  shotgun12:{name:"Escopeta recortada",kind:"weapon",slot:"weapon",category:"shotgun",ammo:"shell12",damage:[12,18],accuracy:2,desc:"Gran impacto; utiliza cartuchos calibre 12."},
  rifle556:{name:"Carabina 5,56",kind:"weapon",slot:"weapon",category:"rifle",ammo:"ammo556",damage:[11,16],accuracy:4,desc:"Arma larga precisa; utiliza munición 5,56."},
  helmetWork:{name:"Casco de faena",kind:"gear",slot:"head",defense:1,maxDurability:8,desc:"Protección industrial ligera."},
  helmetRiot:{name:"Casco antidisturbios",kind:"gear",slot:"head",defense:2,maxDurability:12,desc:"Blindaje de la Red UNO para cabeza y rostro."},
  vestLight:{name:"Chaleco reforzado",kind:"gear",slot:"body",defense:1,maxDurability:10,desc:"Placas recuperadas cosidas al arnés."},
  vestTactical:{name:"Chaleco táctico de la Red UNO",kind:"gear",slot:"body",defense:2,maxDurability:16,desc:"Protección balística de patrulla."},
  packMedic:{name:"Mochila médica",kind:"gear",slot:"backpack",capacity:14,desc:"Catorce espacios de carga; cada unidad ocupa un espacio."},
  packRig:{name:"Mochila técnica",kind:"gear",slot:"backpack",capacity:18,desc:"Dieciocho espacios de carga; cada unidad ocupa un espacio."},
  packHunt:{name:"Mochila de caza",kind:"gear",slot:"backpack",capacity:14,desc:"Catorce espacios de carga; cada unidad ocupa un espacio."},
  packExpedition:{name:"Mochila de expedición",kind:"gear",slot:"backpack",capacity:24,desc:"Bastidor reforzado y veinticuatro espacios de carga."},
  ammo9:{name:"Munición 9 mm",kind:"ammo",stack:true,desc:"Cartuchos para pistolas y revólveres."},
  shell12:{name:"Cartuchos calibre 12",kind:"ammo",stack:true,desc:"Munición para escopetas."},
  ammo556:{name:"Munición 5,56",kind:"ammo",stack:true,desc:"Munición para carabinas y rifles."},
  meds:{name:"Medicina",kind:"consumable",stack:true,desc:"Restaura 26 HP."},
  medkit:{name:"Botiquín sellado",kind:"consumable",stack:true,desc:"Restaura 40 HP fuera de combate."},
  bandage:{name:"Vendaje de presión",kind:"consumable",stack:true,desc:"Restaura 14 HP y detiene el sangrado."},
  stimulant:{name:"Estimulante Roto",kind:"consumable",stack:true,art:"meds",desc:"Recupera 10 HP y 30 de energía fuera de combate."},
  traumaKit:{name:"Kit de trauma",kind:"consumable",stack:true,art:"medkit",desc:"Tratamiento avanzado que restaura 54 HP fuera de combate."},
  emp:{name:"Carga EMP",kind:"consumable",stack:true,desc:"Daña y aturde unidades mecánicas."},
  grenade:{name:"Granada improvisada",kind:"consumable",stack:true,desc:"Daña a todos los enemigos."},
  empMk2:{name:"Carga de arco EMP",kind:"consumable",stack:true,art:"emp",desc:"Descarga avanzada: 34 de daño y dos turnos de aturdimiento mecánico."},
  grenadeMk2:{name:"Granada de metralla",kind:"consumable",stack:true,art:"grenade",desc:"Carga avanzada que inflige 22 de daño a todos los enemigos."},
  food:{name:"Ración sellada",kind:"consumable",stack:true,desc:"Recupera 40 puntos de energía fuera de combate."},
  battery:{name:"Celda de energía",kind:"resource",stack:true,desc:"Alimenta tecnología y descargas EMP."},
  scrap:{name:"Componentes metálicos",kind:"material",stack:true,desc:"Tornillos, placas y mecanismos reutilizables recuperados del equipo enemigo."},
  cloth:{name:"Tela recuperada",kind:"material",stack:true,desc:"Retazos resistentes obtenidos del equipo de los merodeadores."},
  electronics:{name:"Materiales electrónicos",kind:"material",stack:true,desc:"Placas, bobinas y circuitos recuperados de tecnología de la Red UNO."},
  pulseCore:{name:"Núcleo de pulso",kind:"material",stack:true,desc:"Emisor compacto necesario para fabricar cargas EMP."},
  tool:{name:"Herramienta multipropósito",kind:"mission",desc:"Llave, cortador y puente eléctrico de Elías."},
  unoCard:{name:"Credencial de la Red UNO",kind:"mission",desc:"Acceso limitado a terminales y puertas de servicio."},
  droneCore:{name:"Núcleo de dron",kind:"mission",desc:"Memoria y transmisor de una unidad de vigilancia."},
  routeMap:{name:"Mapa de rutas",kind:"mission",desc:"Pasos de servicio borrados de los planos del refugio."},
  radio:{name:"Módulo de radio",kind:"mission",desc:"Amplía una transmisión o la convierte en un pulso dirigido."}
};
var skillTrees={
  sara:[
    {id:"sara_fieldcare",branch:"Medicina de campo",tier:1,cost:1,minLevel:1,name:"Manos firmes",desc:"La habilidad de Sara recupera 4 HP adicionales."},
    {id:"sara_triage",branch:"Medicina de campo",tier:2,cost:1,minLevel:2,requires:"sara_fieldcare",name:"Triaje de túnel",desc:"La atención de Sara también detiene el sangrado de todo el grupo."},
    {id:"sara_reanimate",branch:"Medicina de campo",tier:3,cost:2,minLevel:3,requires:"sara_triage",name:"Pulso de retorno",desc:"Una vez por combate, Sara puede devolver a un aliado agotado con 14 HP."},
    {id:"sara_pharmacy",branch:"Biofabricación",tier:1,cost:1,minLevel:1,name:"Farmacia de campaña",desc:"Desbloquea la receta del Botiquín sellado."},
    {id:"sara_stimulant",branch:"Biofabricación",tier:2,cost:1,minLevel:2,requires:"sara_pharmacy",name:"Catalizador Roto",desc:"Desbloquea el Estimulante Roto para recuperar HP y energía."},
    {id:"sara_trauma",branch:"Biofabricación",tier:3,cost:2,minLevel:3,requires:"sara_stimulant",name:"Cirugía de superficie",desc:"Desbloquea el Kit de trauma, la mejor curación fuera de combate."}
  ],
  elias:[
    {id:"elias_reinforce",branch:"Ingeniería táctica",tier:1,cost:1,minLevel:1,name:"Placas cruzadas",desc:"El equipo corporal operativo de Elías concede +1 de defensa adicional."},
    {id:"elias_ballistics",branch:"Ingeniería táctica",tier:2,cost:1,minLevel:2,requires:"elias_reinforce",name:"Calibración balística",desc:"Elías elimina su penalización al usar armas de fuego."},
    {id:"elias_overcharge",branch:"Ingeniería táctica",tier:3,cost:2,minLevel:3,requires:"elias_ballistics",name:"Sobrecarga violeta",desc:"Su habilidad EMP causa más daño y aturde por dos turnos."},
    {id:"elias_disassemble",branch:"Taller de la Red UNO",tier:1,cost:1,minLevel:1,name:"Desarme fino",desc:"Permite desarmar tecnología y armas recuperadas mediante un minijuego de precisión."},
    {id:"elias_armor",branch:"Taller de la Red UNO",tier:1,cost:1,minLevel:1,name:"Matriz balística",desc:"Desbloquea la fabricación del Chaleco táctico de la Red UNO."},
    {id:"elias_helmet",branch:"Taller de la Red UNO",tier:2,cost:1,minLevel:2,requires:"elias_armor",name:"Visor de patrulla",desc:"Desbloquea la fabricación del Casco antidisturbios."},
    {id:"elias_rifle",branch:"Taller de la Red UNO",tier:3,cost:2,minLevel:3,requires:"elias_helmet",name:"Banco de armas",desc:"Desbloquea la fabricación de una Carabina 5,56."}
  ],
  noa:[
    {id:"noa_marksman",branch:"Caza de superficie",tier:1,cost:1,minLevel:1,name:"Pulso de cazadora",desc:"Noa obtiene +1 de precisión en todos sus ataques."},
    {id:"noa_hunter",branch:"Caza de superficie",tier:2,cost:1,minLevel:2,requires:"noa_marksman",name:"Golpe limpio",desc:"Los impactos de Noa infligen 2 de daño adicional."},
    {id:"noa_execution",branch:"Caza de superficie",tier:3,cost:2,minLevel:3,requires:"noa_hunter",name:"Ventana de ejecución",desc:"Noa inflige 4 de daño adicional a enemigos bajo 35% de HP."},
    {id:"noa_ordnance",branch:"Artificiería",tier:1,cost:1,minLevel:1,name:"Mezcla estable",desc:"Desbloquea la Granada de metralla avanzada."},
    {id:"noa_emp",branch:"Artificiería",tier:2,cost:1,minLevel:2,requires:"noa_ordnance",name:"Carga de arco",desc:"Desbloquea una EMP avanzada con aturdimiento prolongado."},
    {id:"noa_ammo",branch:"Artificiería",tier:3,cost:2,minLevel:3,requires:"noa_emp",name:"Banco de recarga",desc:"Desbloquea lotes escasos de munición 9 mm, 5,56 y calibre 12."}
  ]
};
var workshopRecipes=[
  {owner:"elias",id:"helmetWork",cost:{scrap:2},note:"Protección 1 · Durabilidad 8"},
  {owner:"elias",id:"vestLight",cost:{scrap:3},note:"Protección 1 · Durabilidad 10"},
  {owner:"elias",id:"packExpedition",cost:{scrap:3,battery:1},note:"Capacidad 24 espacios"},
  {owner:"elias",id:"vestTactical",skill:"elias_armor",cost:{scrap:5,electronics:1},xp:12,note:"Protección 2 · Durabilidad 16"},
  {owner:"elias",id:"helmetRiot",skill:"elias_helmet",cost:{scrap:4,electronics:1},xp:14,note:"Protección 2 · Durabilidad 12"},
  {owner:"elias",id:"rifle556",skill:"elias_rifle",cost:{scrap:5,electronics:2},xp:18,note:"Carabina precisa · utiliza munición 5,56"},
  {owner:"sara",id:"bandage",cost:{cloth:2},note:"Restaura 14 HP y detiene sangrado"},
  {owner:"sara",id:"meds",cost:{cloth:3,scrap:1,water:1},note:"Restaura 26 HP · preparación de campaña"},
  {owner:"sara",id:"medkit",skill:"sara_pharmacy",cost:{cloth:4,scrap:2,water:1},xp:12,note:"Restaura 40 HP fuera de combate"},
  {owner:"sara",id:"stimulant",skill:"sara_stimulant",cost:{meds:1,electronics:1,water:1},xp:14,note:"Recupera 10 HP y 30 de energía"},
  {owner:"sara",id:"traumaKit",skill:"sara_trauma",cost:{medkit:1,cloth:2,electronics:1},xp:18,note:"Restaura 54 HP fuera de combate"},
  {owner:"noa",id:"grenade",cost:{scrap:2,electronics:1},note:"14 de daño a todos los enemigos"},
  {owner:"noa",id:"emp",cost:{electronics:2,pulseCore:1,battery:1},note:"22 de daño y aturdimiento mecánico"},
  {owner:"noa",id:"grenadeMk2",skill:"noa_ordnance",cost:{scrap:3,electronics:2},xp:12,note:"22 de daño a todos los enemigos"},
  {owner:"noa",id:"empMk2",skill:"noa_emp",cost:{electronics:3,pulseCore:1,battery:2},xp:14,note:"34 de daño · aturdimiento prolongado"},
  {owner:"noa",id:"ammo9",skill:"noa_ammo",qty:3,cost:{scrap:1,electronics:1},xp:16,note:"Lote recuperado de 3 cartuchos 9 mm"},
  {owner:"noa",id:"ammo556",skill:"noa_ammo",qty:2,cost:{scrap:1,electronics:1},xp:16,note:"Lote recuperado de 2 cartuchos 5,56"},
  {owner:"noa",id:"shell12",skill:"noa_ammo",qty:2,cost:{scrap:2,electronics:1},xp:16,note:"Lote recuperado de 2 cartuchos calibre 12"}
];
var tradeCatalog={
  cloth:{buy:4,sell:1,base:4},bandage:{buy:7,sell:3,base:2},meds:{buy:11,sell:5,base:1},medkit:{buy:18,sell:8,base:0},food:{buy:6,sell:2,base:3},
  ammo9:{buy:2,sell:1,base:5},ammo556:{buy:3,sell:1,base:4},shell12:{buy:4,sell:1,base:2},battery:{buy:8,sell:4,base:1},
  scrap:{sell:2},electronics:{sell:4},pulseCore:{sell:9},
  helmetWork:{sell:7},helmetRiot:{sell:13},vestLight:{sell:8},vestTactical:{sell:15},packExpedition:{sell:14},emp:{sell:7},grenade:{sell:6}
};
var armorerCatalog={
  scrap:{sell:2},electronics:{sell:4},pulseCore:{sell:9},
  knife:{buy:6,sell:2},crowbar:{buy:8,sell:3},pistol9:{buy:18,sell:9},revolver:{buy:22,sell:11},shotgun12:{buy:26,sell:13},rifle556:{buy:30,sell:15}
};
var disassemblyRecipes={
  droneCore:{difficulty:"Preciso",window:15,speed:2.6,rewards:{electronics:2,pulseCore:1,battery:1}},
  radio:{difficulty:"Delicado",window:17,speed:2.4,rewards:{electronics:2,scrap:1,battery:1}},
  unoCard:{difficulty:"Fino",window:18,speed:2.2,rewards:{electronics:1,scrap:1}},
  emp:{difficulty:"Inestable",window:13,speed:2.9,rewards:{electronics:1,pulseCore:1}},
  grenade:{difficulty:"Riesgoso",window:12,speed:3.1,rewards:{scrap:1}},
  pistol9:{difficulty:"Mecánico",window:18,speed:2.3,rewards:{scrap:2,electronics:1}},
  revolver:{difficulty:"Mecánico",window:17,speed:2.4,rewards:{scrap:2,ammo9:1}},
  shotgun12:{difficulty:"Pesado",window:16,speed:2.2,rewards:{scrap:3,shell12:1}},
  rifle556:{difficulty:"Complejo",window:15,speed:2.6,rewards:{scrap:3,electronics:1,ammo556:1}},
  helmetRiot:{difficulty:"Blindaje",window:18,speed:2.1,rewards:{scrap:2,electronics:1}},
  vestTactical:{difficulty:"Blindaje",window:17,speed:2.2,rewards:{scrap:3,cloth:1}},
  electronics:{difficulty:"Circuito armado",window:19,speed:2.1,rewards:{scrap:1}},
  pulseCore:{difficulty:"Núcleo sellado",window:14,speed:2.8,rewards:{electronics:1,battery:1}}
};
function tradeStockForDay(day){var stock={};Object.keys(tradeCatalog).forEach(function(id){var item=tradeCatalog[id];if(item.buy)stock[id]=Math.max(0,(item.base||0)+(day>=2&&id==="medkit"?1:0)+(day===3&&["meds","ammo556","battery"].indexOf(id)>=0?1:0))});return stock}
function armorerStockForDay(day){return{knife:1,crowbar:1,pistol9:1,revolver:day>=2?1:0,shotgun12:day>=2?1:0,rifle556:day>=3?1:0}}
var missionDefs=[
  {id:"signal",main:true,title:"Encontrar el origen de la señal",target:27,reward:"Desbloquea la decisión final sobre Neo Santiago."},
  {id:"squad",title:"Nadie queda atrás",description:"Gana un combate con Sara, Elías y Noa todavía en pie.",target:1,reward:"Moral +6"},
  {id:"salvage",title:"Reserva de superficie",description:"Recupera 8 unidades de botín desde enemigos derrotados.",target:8,reward:"Ración +1 · Medicina +1"},
  {id:"archives",title:"Reconstruir la verdad",description:"Recupera 5 archivos sobre la Red UNO y las comunidades ocultas.",target:5,reward:"Amenaza −6"},
  {id:"veteran",title:"Aprender a sobrevivir",description:"Haz que cualquier aliado alcance Lvl. 2.",target:1,reward:"Energía +10 para el grupo"}
];

function fresh(){return{version:3,campaignRevision:3,inventoryRevision:5,progressionRevision:1,introCompleted:false,logisticsSeen:false,index:0,threat:18,morale:64,credits:0,factionPoints:0,tradeStock:tradeStockForDay(1),tradeStockDay:1,armorerStock:armorerStockForDay(1),armorerStockDay:1,starterKitGiven:false,refuge:{active:false,reason:null,rested:false,rejoined:false,visits:0,npc:"mara",message:""},summarySeen:false,finalTier:null,score:0,engineeringUses:3,medicalUses:3,ordnanceUses:3,res:{food:0,water:4,meds:0,ammo:0,battery:0},cons:{bandage:0,emp:0,grenade:0},party:[
  {id:"sara",name:"Sara",role:"Médico",hp:44,maxHp:44,hunger:82,xp:0,level:1,skills:[],guard:0,bleed:0,psyche:{stress:0,empathy:2,resolve:1,pragmatism:0},categories:["sidearm","melee"],equipment:{head:null,body:"vestLight",weapon:"pistol9",backpack:"packMedic"},durability:{head:null,body:10},bag:[{id:"ammo9",qty:6},{id:"bandage",qty:1},{id:"meds",qty:1},{id:"food",qty:2}]},
  {id:"elias",name:"Elías",role:"Ingeniero",hp:40,maxHp:40,hunger:76,xp:0,level:1,skills:[],guard:0,bleed:0,psyche:{stress:0,empathy:0,resolve:1,pragmatism:2},categories:["sidearm","shotgun","rifle","melee"],equipment:{head:"helmetWork",body:null,weapon:"crowbar",backpack:"packRig"},durability:{head:8,body:null},bag:[{id:"shell12",qty:4},{id:"emp",qty:1},{id:"food",qty:1},{id:"battery",qty:1},{id:"tool",qty:1}]},
  {id:"noa",name:"Noa",role:"Cazadora",hp:38,maxHp:38,hunger:88,xp:0,level:1,skills:[],guard:0,bleed:0,psyche:{stress:1,empathy:0,resolve:2,pragmatism:1},categories:["rifle","sidearm","melee"],equipment:{head:null,body:"vestLight",weapon:"rifle556",backpack:"packHunt"},durability:{head:null,body:10},bag:[{id:"ammo556",qty:6},{id:"grenade",qty:1},{id:"food",qty:1}]}
],inv:[],docs:["signal"],flags:{},missionRewards:{},history:[],stats:{battles:0,wins:0,enemies:0,loot:0,lootItems:{},fullSquadWins:0,criticals:0,retreats:0,refugeVisits:0,trades:0,creditsEarned:0,attacks:0,hits:0,misses:0,shots:0,damageDealt:0,damageTaken:0,medicineUsed:0,hpRestored:0,restHpRecovered:0,rests:0,skillsUsed:0,revives:0,defends:0,crafts:0,craftedItems:{},itemsUsed:{},disassembled:0,disassembleFailures:0,mentalShifts:0,xpFromHits:0,xpFromCrafting:0,xpFromVictories:0,factionEarned:0,factionSpent:0,skillsUnlocked:0},seed:2130,ending:null,finished:false}}

var state=fresh(),pending=null,battleState=null,transferDraft=null,discardDraft=null,disassemblyState=null,disassemblyTimer=null,toastTimer=null,lootInterval=null,npcDialogueState=null,npcDialogueTimer=null,archiveOpener=null,audioClueOpener=null,currentAudioClue=null,worldLoreOpener=null,introStep=0,profileTab="inventory",psychPanelExpanded=false,stageFadeTimer=null;
var loreSections={history:["loreTabHistory","lorePanelHistory"],tunnels:["loreTabTunnels","lorePanelTunnels"],governance:["loreTabGovernance","lorePanelGovernance"],factions:["loreTabFactions","lorePanelFactions"],extracts:["loreTabExtracts","lorePanelExtracts"]};
var factionSections={rotos:["factionTabRotos","factionPanelRotos"],hunters:["factionTabHunters","factionPanelHunters"],uno:["factionTabUno","factionPanelUno"],agents:["factionTabAgents","factionPanelAgents"],marauders:["factionTabMarauders","factionPanelMarauders"],valley:["factionTabValley","factionPanelValley"]};
function clamp(n,a,b){return Math.min(b,Math.max(a,n))}
function random(){state.seed=(state.seed*1664525+1013904223)>>>0;return state.seed/4294967296}
function d20(){return Math.floor(random()*20)+1}
function rand(a,b){return Math.floor(random()*(b-a+1))+a}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function load(){
  try{
    var x=JSON.parse(localStorage.getItem(KEY)),base=fresh(),baseParty=base.party,baseRes=base.res,baseCons=base.cons,baseStats=base.stats,baseRefuge=base.refuge,baseEngineeringUses=base.engineeringUses,baseMedicalUses=base.medicalUses,baseOrdnanceUses=base.ordnanceUses;
    if(!x||x.version!==3||x.index<0||x.index>=events.length)return false;
    if(!x.campaignRevision){var oldRoute=[0,2,8,9,13,17,18,23,26];x.index=oldRoute[x.index]===undefined?0:oldRoute[x.index]}
    state=Object.assign(base,x);state.campaignRevision=3;state.inventoryRevision=5;state.progressionRevision=1;state.introCompleted=x.introCompleted===undefined?true:!!x.introCompleted;state.logisticsSeen=!!x.logisticsSeen;state.res=Object.assign(baseRes,x.res||{});state.cons=Object.assign(baseCons,x.cons||{});state.stats=Object.assign(baseStats,x.stats||{});state.stats.lootItems=Object.assign({},baseStats.lootItems,(x.stats&&x.stats.lootItems)||{});state.stats.craftedItems=Object.assign({},baseStats.craftedItems,(x.stats&&x.stats.craftedItems)||{});state.stats.itemsUsed=Object.assign({},baseStats.itemsUsed,(x.stats&&x.stats.itemsUsed)||{});state.missionRewards=Object.assign({},x.missionRewards||{});state.refuge=Object.assign(baseRefuge,x.refuge||{});state.refuge.npc=state.refuge.npc==="armorer"?"armorer":"mara";state.credits=Math.max(0,Number(x.credits)||0);state.factionPoints=Math.max(0,Number(x.factionPoints)||0);state.starterKitGiven=x.starterKitGiven===undefined?true:!!x.starterKitGiven;state.summarySeen=!!(x.summarySeen||x.epilogueSeen);state.finalTier=x.finalTier||null;state.score=Math.max(0,Number(x.score)||0);state.tradeStockDay=Number(x.tradeStockDay)||((events[x.index]||events[0]).day);state.tradeStock=Object.assign(tradeStockForDay(state.tradeStockDay),x.tradeStock||{});state.armorerStockDay=Number(x.armorerStockDay)||((events[x.index]||events[0]).day);state.armorerStock=Object.assign(armorerStockForDay(state.armorerStockDay),x.armorerStock||{});state.engineeringUses=clamp(Number.isFinite(Number(x.engineeringUses))?Number(x.engineeringUses):baseEngineeringUses,0,3);state.medicalUses=clamp(Number.isFinite(Number(x.medicalUses))?Number(x.medicalUses):baseMedicalUses,0,3);state.ordnanceUses=clamp(Number.isFinite(Number(x.ordnanceUses))?Number(x.ordnanceUses):baseOrdnanceUses,0,3);
    state.party=baseParty.map(function(p,i){var saved=(x.party||[])[i]||{},baseRole=p.role,baseMaxHp=p.maxHp,baseHunger=p.hunger,baseEquipment=p.equipment,baseDurability=p.durability,baseCategories=p.categories,baseBag=p.bag,merged=Object.assign(p,saved),savedHp=Number(saved.hp),savedHunger=Number(saved.hunger);merged.level=Math.max(1,Number(merged.level)||1);merged.skills=Array.isArray(saved.skills)?saved.skills.filter(function(id){return(skillTrees[merged.id]||[]).some(function(node){return node.id===id})}):[];merged.role=baseRole;merged.maxHp=baseMaxHp+(merged.level-1)*6;merged.hp=clamp(Number.isFinite(savedHp)?savedHp:merged.maxHp,0,merged.maxHp);merged.hunger=clamp(Number.isFinite(savedHunger)?savedHunger:baseHunger,0,100);merged.equipment=Object.assign({},baseEquipment,saved.equipment||{});merged.durability=Object.assign({},baseDurability,saved.durability||{});["head","body"].forEach(function(slot){var d=gear(merged.equipment[slot]);if(d&&d.maxDurability&&!Number.isFinite(Number(merged.durability[slot])))merged.durability[slot]=d.maxDurability;if(!d)merged.durability[slot]=null});merged.categories=baseCategories.slice();merged.bag=(saved.bag||baseBag).map(function(entry){var d=gear(entry.id),out={id:entry.id,qty:entry.qty};if(d&&d.maxDurability)out.durability=clamp(Number.isFinite(Number(entry.durability))?Number(entry.durability):d.maxDurability,0,d.maxDurability);return out});normalizePsyche(merged);return merged});
    redistributeOverflow();migrateLegacyInventory();redistributeOverflow();return true
  }catch{return false}
}
function pushUnique(list,values){(values||[]).forEach(function(v){if(list.indexOf(v)<0)list.push(v)})}
function resName(k){return{food:"Alimento",water:"Agua",meds:"Medicina",ammo:"Munición",battery:"Batería",cloth:"Tela",scrap:"Componentes",electronics:"Electrónica",pulseCore:"Núcleo de pulso",ammo9:"Munición 9 mm",ammo556:"Munición 5,56",shell12:"Cartuchos 12"}[k]||k}
function esc(v){return String(v).replace(/[&<>'"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]})}
function gear(id){return id&&equipmentDefs[id]?equipmentDefs[id]:null}
function assetUrl(path){return path+(path.indexOf("?")>=0?"&":"?")+"v="+ASSET_REVISION}
function retryAsset(img){var attempt=Number(img.dataset.assetRetry||0);if(attempt>=2)return;attempt++;img.dataset.assetRetry=attempt;setTimeout(function(){img.src=assetUrl(img.dataset.assetPath)+"&retry="+attempt},160*attempt)}
globalThis.retryAsset=retryAsset;
function assetImage(path,alt,className,width,height){return'<img class="'+esc(className||"")+'" src="'+esc(assetUrl(path))+'" data-asset-path="'+esc(path)+'" data-asset-retry="0" onerror="retryAsset(this)" alt="'+esc(alt||"")+'" width="'+width+'" height="'+height+'" loading="eager" decoding="async">'}
function itemArt(id,alt,extra){var d=gear(id),art=d&&d.art?d.art:id;return id?'<span class="item-art '+(extra||"")+'">'+assetImage("items/"+art+".webp",alt||"","",256,256)+"</span>":'<span class="item-art empty-art '+(extra||"")+'" aria-hidden="true">—</span>'}
function portraitArt(path,alt,extra){return'<div class="portrait">'+assetImage(path,alt,"portrait-art "+(extra||""),590,885)+"</div>"}
var audioRoutes={},audioMissing={},audioHoverButton=null,audioLoopInstances={},audioLoopFades={},audioUnlocked=false,sceneAmbienceRoutes=["ambience-title","ambience-battle","ambience-battle-victory"],AUDIO_CROSSFADE_MS=1600;
function loadAudioRoutes(){
  try{
    var node=$("audioRoutes"),parsed=node&&node.textContent?JSON.parse(node.textContent):{};
    Object.keys(parsed||{}).forEach(function(key){var value=parsed[key],clean;if(typeof value==="string"&&value)audioRoutes[key]=value;else if(Array.isArray(value)){clean=value.filter(function(path){return typeof path==="string"&&path});if(clean.length)audioRoutes[key]=clean}})
  }catch{}
}
function audioRouteList(name){
  var route=audioRoutes[name];
  if(Array.isArray(route))return route.slice();
  if(typeof route==="string"&&route)return[route];
  if(name!=="ui-click")return audioRouteList("ui-click");
  return[]
}
function sfxVolume(name){
  if(!name)return .3;
  if(name.indexOf("hover")>=0)return .12;
  if(name.indexOf("ambience")===0)return .24;
  if(name==="loot-search")return .34;
  if(name==="loot-loop")return .24;
  if(name.indexOf("shot")>=0||name.indexOf("grenade")>=0||name.indexOf("emp")>=0)return .42;
  if(name.indexOf("hp-")===0||name.indexOf("combat-")===0)return .34;
  if(name.indexOf("error")>=0||name.indexOf("disabled")>=0)return .24;
  return .28
}
function playAudioRoute(name,options,index){
  var routes=audioRouteList(name),path;options=options||{};index=index||0;
  if(!routes.length||typeof Audio==="undefined")return false;
  if(index>=routes.length)return false;
  if(options.random){var available=routes.filter(function(route){return !audioMissing[route]});if(!available.length)return false;path=available[Math.floor(Math.random()*available.length)]}else{path=routes[index];if(audioMissing[path])return playAudioRoute(name,options,index+1)}
  try{
    var sound=new Audio(path),nextSound;sound.preload="auto";sound.volume=options.volume!==undefined?options.volume:sfxVolume(name);sound.loop=!!options.loop;
    sound.addEventListener("error",function(){audioMissing[path]=true;if(options.loop)delete audioLoopInstances[name];nextSound=playAudioRoute(name,options,options.random?0:index+1);if(options.loop&&nextSound)audioLoopInstances[name]=nextSound},{once:true});
    var started=sound.play();if(started&&started.catch)started.catch(function(){});
    return sound
  }catch{audioMissing[path]=true;return playAudioRoute(name,options,index+1)}
}
function playSfx(name){
  var randomNames=["loot-take"];
  return !!playAudioRoute(name,{loop:false,random:randomNames.indexOf(name)>=0})
}
function playRandomSfx(name){
  return !!playAudioRoute(name,{loop:false,random:true})
}
function fadeLoopVolume(name,target,ms,after){
  var sound=audioLoopInstances[name],from;if(!sound)return false;clearInterval(audioLoopFades[name]);target=clamp(target,0,1);if(!ms){sound.volume=target;if(after)after();return true}from=sound.volume;var started=Date.now();audioLoopFades[name]=setInterval(function(){var progress=clamp((Date.now()-started)/ms,0,1),eased=progress<.5?2*progress*progress:1-Math.pow(-2*progress+2,2)/2;sound.volume=from+(target-from)*eased;if(progress>=1){clearInterval(audioLoopFades[name]);delete audioLoopFades[name];sound.volume=target;if(after)after()}},40);return true
}
function startLoopSfx(name,fadeMs){
  var target=sfxVolume(name),sound,randomLoop=name==="loot-loop";if(audioLoopInstances[name]){fadeLoopVolume(name,target,fadeMs||0);return true}sound=playAudioRoute(name,{loop:true,volume:fadeMs?0:target,random:randomLoop});if(!sound)return false;audioLoopInstances[name]=sound;if(fadeMs)fadeLoopVolume(name,target,fadeMs);return true
}
function stopLoopSfx(name,fadeMs){
  var sound=audioLoopInstances[name];if(!sound)return false;clearInterval(audioLoopFades[name]);delete audioLoopFades[name];if(fadeMs){return fadeLoopVolume(name,0,fadeMs,function(){try{sound.pause();sound.currentTime=0}catch{}delete audioLoopInstances[name]})}try{sound.pause();sound.currentTime=0}catch{}delete audioLoopInstances[name];return true
}
function setSceneAmbience(name,fadeMs){
  sceneAmbienceRoutes.forEach(function(key){if(key!==name)stopLoopSfx(key,fadeMs||0)});if(name&&audioUnlocked)startLoopSfx(name,fadeMs||0)
}
function unlockAudioAmbience(){
  audioUnlocked=true;if(battleState&&battleState.phase==="combat")setSceneAmbience("ambience-battle");else if(battleState&&battleState.phase==="loot")setSceneAmbience("ambience-battle-victory");else setSceneAmbience("ambience-title")
}
function buttonFromEvent(event){var target=event&&event.target;return target&&target.closest?target.closest("button"):null}
function hoverSfxForButton(button){
  if(!button||button.disabled)return null;
  if(button.dataset.choice!==undefined)return"decision-hover";
  if(button.dataset.lootEnemy!==undefined)return"loot-hover";
  if(button.dataset.target!==undefined)return"combat-target-hover";
  return"ui-hover"
}
function weaponSfxForActor(){
  var p=battleState&&state.party[battleState.actor],weapon=gear(p&&p.equipment.weapon);
  if(!weapon)return"combat-melee";
  if(weapon.category==="rifle")return"combat-shot-rifle";
  if(weapon.category==="shotgun")return"combat-shot-shotgun";
  if(weapon.category==="sidearm")return"combat-shot-9mm";
  return"combat-melee"
}
function combatSkillSfx(){
  var actor=battleState&&state.party[battleState.actor];
  if(!actor)return"ui-click";
  if(actor.id==="sara")return"hp-heal";
  if(actor.id==="elias")return"combat-skill-elias";
  if(actor.id==="noa")return"combat-skill-noa";
  return"ui-click"
}
function craftSfx(id){
  var recipe=(workshopRecipes||[]).filter(function(r){return r.id===id})[0];
  if(recipe&&recipe.owner==="sara")return"craft-medical";
  if(recipe&&recipe.owner==="noa")return"craft-tech";
  return"craft-basic"
}
function clickSfxForButton(button){
  if(!button)return null;
  if(button.disabled)return"ui-disabled";
  var id=button.id||"",data=button.dataset||{},text=(button.textContent||"").toLowerCase();
  if(data.sfx)return data.sfx;
  if(data.choice!==undefined){if(text.indexOf("combate")>=0)return"decision-combat";if(text.indexOf("moral")>=0||button.classList.contains("danger"))return"decision-danger";return"decision-confirm"}
  if(data.dialogueChoice!==undefined)return"decision-confirm";
  if(data.action==="attack")return weaponSfxForActor();
  if(data.action==="skill")return combatSkillSfx();
  if(data.action==="defend")return"combat-defend";
  if(data.action==="flee")return"combat-flee";
  if(data.combatItem!==undefined){if(data.combatItem.indexOf("emp")>=0)return"combat-emp";if(data.combatItem.indexOf("grenade")>=0)return"combat-grenade";if(data.combatItem==="food")return"loadout-food";return"hp-medical-use"}
  if(data.target!==undefined)return"combat-target";
  if(data.lootEnemy!==undefined)return"loot-search";
  if(data.takeLoot!==undefined)return"loot-take";
  if(data.discardLoot!==undefined)return"loot-discard";
  if(data.disassembleLoot!==undefined)return"loadout-repair";
  if(data.profile!==undefined||data.refugeProfile!==undefined||data.profileSwitch!==undefined)return"loadout-open";
  if(data.profileTab!==undefined)return"ui-tab";
  if(data.transferOpen!==undefined)return"loadout-transfer";
  if(data.transferTarget!==undefined)return"loadout-transfer";
  if(data.discardProfile!==undefined||id==="confirmDiscard")return"loot-discard";
  if(data.disassembleProfile!==undefined)return"loadout-repair";
  if(data.equip!==undefined)return"loadout-equip";
  if(data.profileUse!==undefined)return null;
  if(data.repair!==undefined)return"loadout-repair";
  if(data.craft!==undefined)return craftSfx(data.craft);
  if(data.unlockSkill!==undefined)return"skill-unlock";
  if(data.contextArchive!==undefined)return"archive-open";
  if(data.audioClue!==undefined)return"archive-open";
  if(data.openArchive!==undefined)return"archive-open";
  if(data.openWorldLore!==undefined)return"lore-open";
  if(data.panel!==undefined)return"ui-open-panel";
  if(data.sellItem!==undefined)return"trade-sell";
  if(data.buyItem!==undefined){var offer=gear(data.buyItem);return offer&&offer.kind==="weapon"?"trade-weapon":"trade-buy"}
  if(id==="enterTitle")return"start-title-enter";
  if(id==="newGame"||id==="restart")return"start-new-game";
  if(id==="continueGame")return"start-load-game";
  if(id==="openWorldLore")return"lore-open";
  if(id==="closeWorldLore"||id==="closeWorldLoreBottom")return"ui-close-panel";
  if(id.indexOf("loreTab")===0||id.indexOf("factionTab")===0)return"lore-tab";
  if(id==="introNext"||id==="introBack")return"lore-page";
  if(id==="dialogueSkip")return"lore-page";
  if(id==="dialogueContinue")return"decision-result";
  if(id==="introStart"||id==="leaveRefuge"||id==="confirmLogistics")return"start-expedition";
  if(id==="advance")return"decision-result";
  if(id==="nextDay"||id==="refugeRest")return"refuge-rest";
  if(id==="finalContinue")return"ending-summary";
  if(id==="downloadPng")return"ui-download";
  if(id==="npcTabMara"||id==="npcTabArmorer")return"refuge-npc";
  if(id==="starterKit")return"refuge-supply";
  if(id==="refugeRejoin")return"refuge-ready";
  if(id==="itemsToggle")return"loadout-tray";
  if(id==="takeAllLoot")return"loot-take-all";
  if(id==="finishLoot")return"loot-exit";
  if(id==="disassemblyAttempt")return"craft-tech";
  if(id==="closeDisassembly"||id==="disassemblyDone")return"ui-close-panel";
  if(id==="closeLoot")return"loot-exit";
  if(id==="audioCluePlay")return null;
  if(id==="closeDrawer"||id==="closeProfile"||id==="closeTransfer"||id==="closeArchive"||id==="closeArchiveBottom"||id==="closeAudioClue"||id==="closeAudioClueBottom")return"ui-close-panel";
  return"ui-click"
}
function installAudioHooks(){
  if(typeof document==="undefined"||!document.addEventListener)return;
  document.addEventListener("pointerover",function(event){var button=buttonFromEvent(event);if(!button||button===audioHoverButton)return;audioHoverButton=button;var sfx=hoverSfxForButton(button);if(sfx)playSfx(sfx)},true);
  document.addEventListener("pointerout",function(event){var button=buttonFromEvent(event);if(button===audioHoverButton){try{if(event.relatedTarget&&button.contains(event.relatedTarget))return}catch{}audioHoverButton=null}},true);
  document.addEventListener("click",function(event){var button=buttonFromEvent(event),sfx=clickSfxForButton(button);if(sfx)playSfx(sfx);if(button)unlockAudioAmbience()},true)
}
globalThis.playSfx=playSfx;
globalThis.startLoopSfx=startLoopSfx;
globalThis.stopLoopSfx=stopLoopSfx;
function bagCapacity(p){var pack=gear(p.equipment.backpack);return pack&&pack.capacity?pack.capacity:4}
function bagUsed(p){return p&&p.bag?p.bag.reduce(function(sum,entry){return sum+Math.max(1,Number(entry.qty)||1)},0):0}
function bagFree(p){return Math.max(0,bagCapacity(p)-bagUsed(p))}
function bagQty(p,id){return p&&p.bag?p.bag.reduce(function(sum,entry){return sum+(entry&&entry.id===id?Math.max(0,Number(entry.qty)||0):0)},0):0}
function canReceive(p,id,qty){return !!(p&&bagFree(p)>=Math.max(1,Number(qty)||1))}
function ammoTotal(){return state.res.ammo+state.party.reduce(function(total,p){return total+bagQty(p,"ammo9")+bagQty(p,"shell12")+bagQty(p,"ammo556")},0)}
function stockCount(id){
  if(id==="water")return state.res.water||0;
  return state.party.reduce(function(sum,p){return sum+bagQty(p,id)},0)
}
function addStatItem(bucket,id,qty){qty=Math.max(1,Number(qty)||1);if(!state.stats[bucket])state.stats[bucket]={};state.stats[bucket][id]=(state.stats[bucket][id]||0)+qty}
function recordHealing(amount,medical){amount=Math.max(0,Number(amount)||0);state.stats.hpRestored+=amount;if(medical)state.stats.medicineUsed++}
function recordLoot(id,qty){qty=Math.max(1,Number(qty)||1);state.stats.loot+=qty;addStatItem("lootItems",id,qty)}
function consumeFromBag(p,id){var i=p.bag.findIndex(function(x){return x.id===id});if(i<0)return false;p.bag[i].qty--;if(p.bag[i].qty<=0)p.bag.splice(i,1);return true}
function consumeStock(id,preferred){
  if(id==="water"&&(state.res.water||0)>0){state.res.water--;return true}
  var order=[];if(preferred!==undefined&&state.party[preferred])order.push(state.party[preferred]);state.party.forEach(function(p){if(order.indexOf(p)<0)order.push(p)});
  for(var i=0;i<order.length;i++)if(consumeFromBag(order[i],id))return true;return false
}
function addToBag(p,id,qty,durability){
  var d=gear(id),entry=p&&p.bag.filter(function(x){return x.id===id})[0];qty=Math.max(1,Number(qty)||1);if(!canReceive(p,id,qty))return false;
  if(entry&&d&&d.stack){entry.qty+=qty;return true}
  var next={id:id,qty:qty};if(d&&d.maxDurability)next.durability=clamp(Number.isFinite(Number(durability))?Number(durability):d.maxDurability,0,d.maxDurability);p.bag.push(next);return true
}
function carrierOrder(id){var preferred={meds:0,medkit:0,bandage:0,food:0,tool:1,battery:1,unoCard:1,droneCore:1,radio:1,routeMap:2,ammo9:0,shell12:1,ammo556:2,grenade:2,emp:2,electronics:2,pulseCore:2},first=preferred[id]===undefined?0:preferred[id],order=[first];state.party.forEach(function(p,i){if(order.indexOf(i)<0)order.push(i)});return order}
function placePartyItem(id,qty,durability){
  qty=Math.max(1,Number(qty)||1);var d=gear(id),order=carrierOrder(id),remaining=qty;
  for(var i=0;i<order.length&&remaining>0;i++){var p=state.party[order[i]],amount=Math.min(remaining,bagFree(p));if(amount<=0)continue;if(d&&d.stack){addToBag(p,id,amount,durability);remaining-=amount}else while(remaining>0&&canReceive(p,id,1)){addToBag(p,id,1,durability);remaining--}}
  return remaining<=0
}
function hasPartyItem(id){return state.party.some(function(p){return bagQty(p,id)>0})}
function removePartyItem(id,qty){qty=qty||1;for(var n=0;n<qty;n++){var carrier=state.party.filter(function(p){return bagQty(p,id)>0})[0];if(!carrier||!consumeFromBag(carrier,id))return false}return true}
function migrateLegacyInventory(){
  (state.inv||[]).forEach(function(id){if(!hasPartyItem(id))placePartyItem(id,1)});state.inv=[];
  var pools={food:state.res.food||0,meds:state.res.meds||0,battery:state.res.battery||0,bandage:state.cons.bandage||0,emp:state.cons.emp||0,grenade:state.cons.grenade||0};
  Object.keys(pools).forEach(function(id){if(pools[id]>0)placePartyItem(id,pools[id])});if((state.res.ammo||0)>0)placePartyItem("ammo9",state.res.ammo*4);
  state.res.food=0;state.res.meds=0;state.res.ammo=0;state.res.battery=0;state.cons.bandage=0;state.cons.emp=0;state.cons.grenade=0
}
function redistributeOverflow(){
  state.party.forEach(function(p,pIndex){var guard=0;while(bagUsed(p)>bagCapacity(p)&&guard++<200){var entry=p.bag[p.bag.length-1],moved=false;if(!entry)break;for(var i=0;i<state.party.length;i++){if(i===pIndex||!canReceive(state.party[i],entry.id,1))continue;if(addToBag(state.party[i],entry.id,1,entry.durability)){entry.qty--;if(entry.qty<=0)p.bag.pop();moved=true;break}}if(!moved)break}})
}
function currentDay(){var ev=events[Math.min(state.index,events.length-1)]||events[0];return ev?ev.day:1}
function refreshTradeStock(){var day=currentDay();if(state.tradeStockDay!==day){state.tradeStock=tradeStockForDay(day);state.tradeStockDay=day}if(state.armorerStockDay!==day){state.armorerStock=armorerStockForDay(day);state.armorerStockDay=day}}
function activeRefugeNpc(){return state.refuge&&state.refuge.npc==="armorer"?"armorer":"mara"}
function merchantCatalog(npc){return npc==="armorer"?armorerCatalog:tradeCatalog}
function merchantStock(npc){return npc==="armorer"?state.armorerStock:state.tradeStock}
var refugeNpcs={
  mara:{name:"Mara «La Rielera»",role:"Recuperadora · Economato",portrait:"characters/mara-trader.webp",alt:"Mara, encargada de suministros e intercambios del refugio"},
  armorer:{name:"El Armero",role:"Forjador · Recuperador balístico",portrait:"characters/armero-trader.webp",alt:"El Armero, forjador y recuperador de armas del refugio"}
};
function refugeReasonData(reason){return{
  start:["Último control antes de salir","Mara organiza el lote comunitario y el Armero revisa el banco de piezas del Andén 4. La expedición no cruzará la compuerta hasta comprobar que todos pueden regresar por su propio pie."],
  fled:["Retirada táctica","El grupo decidió cortar el combate. Volver conserva sus vidas, pero el fracaso pesa sobre la moral y la amenaza aprende una parte de su ruta."],
  exhausted:["Todos quedaron fuera de combate","No están muertos: el pulso sigue ahí, débil. Los arrastraron hasta la Línea 1 y ahora necesitan descanso, medicina y una nueva preparación antes de intentarlo otra vez."],
  morale:["La cohesión llegó a cero","Las discusiones quebraron la marcha. Nadie seguirá hacia la superficie hasta reagruparse, atender a los heridos y decidir qué recursos todavía vale la pena conservar."]
}[reason]||["Regreso al Andén 4","El refugio permite reorganizar las mochilas, atender heridas y negociar los materiales recuperados antes de volver a la expedición."]}
function refugeCanLeave(){return state.starterKitGiven&&state.morale>=10&&state.party.every(function(p){return p.hp>=10&&p.hunger>=10})}
function refugePartyHtml(p,i){var status=p.hp<=0?"Agotado":p.hp<10?"Crítico":p.hunger<10?"Sin energía":"Listo",bad=status!=="Listo",ready=hasUnspentSkill(p);return'<button class="refuge-ally '+(bad?'critical ':'')+(ready?'skill-ready':'')+'" data-refuge-profile="'+i+'"><span class="refuge-ally-photo">'+assetImage("portraits/"+p.id+".webp",p.name,"",590,885)+'</span><span><b>'+esc(p.name)+" · "+esc(status)+'</b><small>Lvl. '+p.level+' · '+p.hp+" / "+p.maxHp+" HP · Energía "+p.hunger+"% · Mochila "+bagUsed(p)+"/"+bagCapacity(p)+'</small>'+(ready?'<strong class="skill-ready-copy">Habilidad disponible</strong>':'')+'</span><em>Gestionar</em></button>'}
function weaponTradeNote(d){return d&&d.kind==="weapon"?"Daño "+d.damage[0]+"–"+d.damage[1]+" · Precisión +"+d.accuracy+(d.ammo?" · "+gear(d.ammo).name:" · Sin munición"):"Ocupa 1 espacio"}
function renderTradeSell(){var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),cards=[];state.party.forEach(function(p,pIndex){p.bag.forEach(function(entry,bagIndex){var d=gear(entry.id),offer=catalog[entry.id];if(!d||!offer||!offer.sell||d.kind==="mission")return;cards.push('<article class="trade-card '+(d.kind==="weapon"?'weapon-offer':'')+'">'+itemArt(entry.id,d.name,"small")+'<span><b>'+esc(d.name)+(entry.qty>1?" ×"+entry.qty:"")+'</b><small>'+esc(p.name)+" · "+(d.kind==="weapon"?weaponTradeNote(d):"entrega 1 unidad")+'</small></span><em>+'+offer.sell+' fichas</em><button data-sell-item="'+pIndex+'-'+bagIndex+'">Entregar</button></article>')})});return cards.length?cards.join(""):npc==="armorer"?'<p class="empty">No llevas armas ni componentes que el Armero pueda recuperar.</p>':'<p class="empty">No llevas materiales ni equipo que Mara acepte.</p>'}
function renderTradeBuy(){var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stock=merchantStock(npc),cards=[];Object.keys(stock).forEach(function(id){var qty=Math.max(0,Number(stock[id])||0),d=gear(id),offer=catalog[id];if(!d||!offer||!offer.buy)return;cards.push('<article class="trade-card '+(d.kind==="weapon"?'weapon-offer ':'')+(!qty?'sold-out':'')+'">'+itemArt(id,d.name,"small")+'<span><b>'+esc(d.name)+'</b><small>Stock '+qty+' · '+weaponTradeNote(d)+'</small></span><em>−'+offer.buy+' fichas</em><button data-buy-item="'+id+'" '+(!qty?'disabled':'')+'>'+(qty?(npc==="armorer"?'Encargar':'Recibir'):'Agotado')+'</button></article>')});return cards.join("")}
function renderRefuge(){
  if(!state.refuge||!state.refuge.active)return;refreshTradeStock();var data=refugeReasonData(state.refuge.reason),canLeave=refugeCanLeave(),npc=activeRefugeNpc(),npcData=refugeNpcs[npc],portrait=$("traderPortrait");$("refugeTitle").textContent=data[0];$("refugeText").textContent=data[1];portrait.src=assetUrl(npcData.portrait);portrait.dataset.assetPath=npcData.portrait;portrait.alt=npcData.alt;$("traderName").textContent=npcData.name;$("traderRole").textContent=npcData.role;$("npcTabMara").classList.toggle("active",npc==="mara");$("npcTabMara").setAttribute("aria-selected",npc==="mara"?"true":"false");$("npcTabArmorer").classList.toggle("active",npc==="armorer");$("npcTabArmorer").setAttribute("aria-selected",npc==="armorer"?"true":"false");$("traderDialogue").textContent=npc==="armorer"?(state.refuge.reason==="exhausted"?'“No necesitan más potencia. Necesitan un arma que no falle cuando vuelvan a ponerse de pie.”':'“Nada de esto salió entero de una fábrica. Yo elijo lo que todavía sirve y vuelvo a darle propósito.”'):(state.refuge.reason==="start"?'“Tomen lo justo. Lo que vuelva en sus mochilas puede convertirse en otra oportunidad.”':state.refuge.reason==="exhausted"?'“Afuera parecían cadáveres. Aquí siguen siendo una deuda que podemos pagar.”':'“Yo cambio objetos, no milagros. Descansen, repartan medicina y elijan qué vale más.”');$("tradeCredits").textContent=state.credits+" fichas";$("tradeSectionTitle").textContent=npc==="armorer"?"Banco de armas reconstruidas":"Economía de intercambio";$("tradeSectionHint").textContent=npc==="armorer"?"Stock único por día · equipa desde la ficha del aliado":"Una operación mueve una unidad";$("tradeSellTitle").textContent=npc==="armorer"?"Armas y piezas recuperadas":"Tus rescates";$("tradeBuyTitle").textContent=npc==="armorer"?"Banco del Armero":"Reservas de Mara";$("tradeBuyAction").textContent=npc==="armorer"?"Encargar":"Recibir";$("refugeParty").innerHTML=state.party.map(refugePartyHtml).join("");$("tradeSellList").innerHTML=renderTradeSell();$("tradeBuyList").innerHTML=renderTradeBuy();$("starterKit").classList.toggle("hidden",state.starterKitGiven||npc!=="mara");$("refugeRest").disabled=!!state.refuge.rested;$("refugeRejoin").disabled=!!state.refuge.rejoined;$("leaveRefuge").disabled=!canLeave;$("refugeLeaveHint").textContent=canLeave?"El grupo está en condiciones de volver a la expedición. Gestiona a un aliado para equipar cualquier arma nueva.":!state.starterKitGiven?"Recibe el lote inicial de Mara antes de abrir la compuerta.":state.morale<10?"La moral debe llegar al menos a 10%.":"Todos necesitan al menos 10 HP y 10% de energía.";$("refugeMessage").textContent=state.refuge.message||"";$("refugeMessage").classList.toggle("hidden",!state.refuge.message);
  Array.prototype.forEach.call(document.querySelectorAll("[data-refuge-profile]"),function(b){b.addEventListener("click",function(){openProfile(Number(b.dataset.refugeProfile))})});Array.prototype.forEach.call(document.querySelectorAll("[data-sell-item]"),function(b){b.addEventListener("click",function(){var parts=b.dataset.sellItem.split("-");sellTradeItem(Number(parts[0]),Number(parts[1]))})});Array.prototype.forEach.call(document.querySelectorAll("[data-buy-item]"),function(b){b.addEventListener("click",function(){buyTradeItem(b.dataset.buyItem)})})
}
function switchRefugeNpc(npc){if(!state.refuge||!state.refuge.active||["mara","armorer"].indexOf(npc)<0)return false;state.refuge.npc=npc;state.refuge.message="";renderRefuge();save();return true}
function openRefuge(reason,restoring){
  setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);
  if(!restoring){var visits=(state.refuge&&state.refuge.visits||0)+1;state.refuge={active:true,reason:reason,rested:false,rejoined:false,visits:visits,npc:"mara",message:""};state.stats.refugeVisits++;}else{state.refuge.active=true;state.refuge.reason=reason||state.refuge.reason;state.refuge.npc=state.refuge.npc==="armorer"?"armorer":"mara"}
  state.party.forEach(function(p){p.guard=0;p.bleed=0});refreshTradeStock();battleState=null;pending=null;clearInterval(lootInterval);["gameIntro","worldLoreModal","battle","result","night","lootModal","logisticsModal","final","summary"].forEach(function(id){$(id).classList.add("hidden")});$("refuge").classList.remove("hidden");renderRefuge();save()
}
function acceptStarterKit(){if(!state.refuge.active||state.starterKitGiven)return;[{id:"cloth",qty:2},{id:"scrap",qty:2},{id:"food",qty:1},{id:"bandage",qty:1},{id:"ammo9",qty:2},{id:"ammo556",qty:2}].forEach(function(drop){placePartyItem(drop.id,drop.qty)});state.credits+=6;state.starterKitGiven=true;state.refuge.message="Mara entrega 10 unidades de suministros y 6 fichas para un intercambio de emergencia.";renderRefuge();renderMini();save()}
function restAtRefuge(){if(!state.refuge.active||state.refuge.rested)return;var recovered=0;state.party.forEach(function(p){var before=p.hp;p.hp=p.hp<=0?Math.min(p.maxHp,12):Math.min(p.maxHp,p.hp+8);recovered+=p.hp-before;p.hunger=clamp(p.hunger+25,0,100);p.guard=0;p.bleed=0});relaxPsyche(2,0);state.stats.rests++;state.stats.restHpRecovered+=recovered;state.stats.hpRestored+=recovered;state.refuge.rested=true;state.refuge.message="El grupo descansa: los agotados vuelven a 12 HP, los demás recuperan 8 HP, todos ganan 25% de energía y la tensión baja.";renderRefuge();renderMini();save()}
function rejoinAtRefuge(){if(!state.refuge.active||state.refuge.rejoined)return;var shared=stockCount("food")>0;if(shared){consumeStock("food");addStatItem("itemsUsed","food",1)}var gain=shared?14:state.morale===0?10:6;state.morale=clamp(state.morale+gain,0,100);if(shared)state.party.forEach(function(p){p.hunger=clamp(p.hunger+8,0,100)});relaxPsyche(shared?2:1,1);state.refuge.rejoined=true;state.refuge.message=shared?"Comparten una ración: moral +14, energía +8, tensión baja y la decisión común sube.":"Revisan la retirada y acuerdan volver juntos: moral +"+gain+", tensión baja y la decisión común sube.";renderRefuge();renderMini();save()}
function sellTradeItem(pIndex,bagIndex){if(!state.refuge.active)return;var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stock=merchantStock(npc),p=state.party[pIndex],entry=p&&p.bag[bagIndex],offer=entry&&catalog[entry.id],d=entry&&gear(entry.id);if(!p||!entry||!offer||!offer.sell||d.kind==="mission")return;var id=entry.id,value=offer.sell;entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);state.credits+=value;state.stats.trades++;state.stats.creditsEarned+=value;if(offer.buy)stock[id]=(stock[id]||0)+1;state.refuge.message=p.name+" entrega "+d.name+" a "+(npc==="armorer"?"El Armero":"Mara")+" y recibe "+value+" fichas.";renderRefuge();renderMini();save()}
function buyTradeItem(id){if(!state.refuge.active)return;var npc=activeRefugeNpc(),catalog=merchantCatalog(npc),stockMap=merchantStock(npc),offer=catalog[id],d=gear(id),stock=Math.max(0,Number(stockMap[id])||0);if(!offer||!offer.buy||!d||!stock)return;if(state.credits<offer.buy){state.refuge.message="No hay fichas suficientes para recibir "+d.name+".";renderRefuge();return}if(!placePartyItem(id,1)){state.refuge.message="Las mochilas están llenas. Libera un espacio antes de comerciar.";renderRefuge();return}state.credits-=offer.buy;stockMap[id]--;state.stats.trades++;state.refuge.message=(npc==="armorer"?"El Armero entrega ":"Mara entrega ")+d.name+" a cambio de "+offer.buy+" fichas. Abre la ficha de un aliado para equiparlo.";renderRefuge();renderMini();save()}
function logisticsRowsHtml(){
  var rows=[
    ["Alimento",stockCount("food"),"La noche consume una ración si existe. Si no hay alimento, baja la moral y la energía recuperada es menor."],
    ["Agua",stockCount("water"),"Se consume al cerrar una jornada. Sin agua, la moral cae con más fuerza y el refugio se siente menos seguro."],
    ["Medicina",stockCount("meds")+stockCount("bandage")+stockCount("medkit")+stockCount("traumaKit"),"Permite levantar HP fuera de combate. Si alguien queda agotado, conviene curarlo antes de volver a salir."],
    ["Munición",ammoTotal(),"Cada disparo consume el cartucho correcto: 9 mm, 5,56 o calibre 12. Sin balas, el personaje cambia a arma blanca."],
    ["Componentes metálicos",stockCount("scrap"),"Sirven para reparar cascos/chalecos y fabricar equipo. Los merodeadores suelen soltar chatarra y tela."],
    ["Tela recuperada",stockCount("cloth"),"Sara la usa para vendas, medicina y botiquines. Si la gastas en una decisión, puede faltar para curar después."],
    ["Electrónica",stockCount("electronics"),"Material clave para granadas avanzadas, EMP y piezas de la Red UNO. Se obtiene sobre todo de drones y agentes."],
    ["Núcleos de pulso",stockCount("pulseCore"),"Permiten crear cargas EMP. Son escasos: si los gastas, quizá no puedas frenar drones más adelante."],
    ["Moral",state.morale+"%","Retirarse o tomar decisiones duras la reduce. Si llega a 0%, el grupo vuelve al refugio obligado."],
    ["Pulso psicológico",psychTeamLine(),"Los diálogos, combates y decisiones mueven tensión, empatía, decisión y táctica. Descansar o reagruparse baja tensión; el estado modifica pruebas y batalla."],
    ["Amenaza",state.threat+"%","Disparos, explosiones y rutas expuestas la elevan. Con amenaza alta, los finales y combates se vuelven más peligrosos."]
  ];
  return rows.map(function(row){return'<article class="logistics-card"><span>'+esc(row[0])+'</span><b>'+esc(row[1])+'</b><p>'+esc(row[2])+'</p></article>'}).join("")
}
function showLogisticsBriefing(){
  $("logisticsCards").innerHTML=logisticsRowsHtml();
  $("logisticsWarning").textContent=stockCount("food")<=1?"Te queda poco alimento: ayudar a otros o gastarlo puede afectar la noche.":stockCount("meds")+stockCount("bandage")+stockCount("medkit")+stockCount("traumaKit")<=1?"Tienes poca medicina: si alguien cae, el refugio dependerá del descanso o del crafteo.":stockCount("scrap")<2?"Tienes pocos componentes: reparar equipo será difícil si los chalecos o cascos se rompen.":"Revisa qué llevas: cada decisión puede gastar algo que después necesitarás para pelear, curar o reparar.";
  $("logisticsModal").classList.remove("hidden");
  $("confirmLogistics").focus()
}
function closeLogisticsBriefing(){$("logisticsModal").classList.add("hidden")}
function confirmLeaveRefuge(){
  if(!state.refuge.active)return false;state.logisticsSeen=true;state.refuge.active=false;state.refuge.reason=null;state.refuge.message="";$("logisticsModal").classList.add("hidden");$("refuge").classList.add("hidden");save();render();toast("El grupo vuelve a la expedición");return true
}
function leaveRefuge(){if(!state.refuge.active)return false;if(!refugeCanLeave()){state.refuge.message=!state.starterKitGiven?"Primero recibe el lote de salida.":state.morale<10?"El grupo no puede salir con la moral por debajo de 10%.":"Nadie sale agotado: recupera a todos hasta 10 HP y 10% de energía.";renderRefuge();return false}showLogisticsBriefing();return true}
function xpNeeded(p){return 50+(p.level-1)*35}
function energyResist(p){return Math.min(3,Math.max(0,p.level-1))}
function hasSkill(p,id){return !!(p&&Array.isArray(p.skills)&&p.skills.indexOf(id)>=0)}
var psychAxisLabels={stress:"tensión",empathy:"empatía",resolve:"determinación",pragmatism:"criterio táctico"};
var psychStateDefs={
  estable:{name:"Estable",tone:"",desc:"Mantiene el pulso de expedición sin ventajas ni riesgos especiales.",effects:"Sin modificadores"},
  sereno:{name:"Sereno",tone:"good",desc:"Lee mejor la escena y sostiene el pulso bajo presión.",effects:"+1 precisión · +1 defensa",accuracy:1,defense:1},
  empatico:{name:"Empático",tone:"good",desc:"Prioriza vínculos y cuidado; responde mejor al daño del grupo.",effects:"+2 curación · +1 defensa",healing:2,defense:1},
  resuelto:{name:"Resuelto",tone:"good",desc:"Actúa con decisión cuando el combate se vuelve inevitable.",effects:"+1 precisión · +1 daño",accuracy:1,damage:1},
  pragmatico:{name:"Pragmático",tone:"good",desc:"Convierte miedo en lectura táctica y aprovecha mejor las pruebas.",effects:"+1 precisión en combate y pruebas",accuracy:1,check:1},
  tenso:{name:"Tenso",tone:"bad",desc:"La presión acelera sus decisiones: golpea más duro, pero falla con más facilidad.",effects:"−1 precisión · +1 daño",accuracy:-1,damage:1},
  culpa:{name:"Culpa",tone:"bad",desc:"Carga el costo humano de la ruta; protege más, pero duda al atacar.",effects:"−1 precisión · +1 defensa",accuracy:-1,defense:1},
  rabia:{name:"Rabia",tone:"bad",desc:"La violencia acumulada rompe el pulso fino y empuja ataques más bruscos.",effects:"−1 precisión · +2 daño · −1 defensa",accuracy:-1,damage:2,defense:-1},
  frio:{name:"Frío",tone:"bad",desc:"Se distancia del costo humano para resolver rápido, a costa de quedar más expuesto.",effects:"+1 precisión · −1 defensa",accuracy:1,defense:-1}
};
function defaultPsyche(id){return{stress:id==="noa"?1:0,empathy:id==="sara"?2:0,resolve:id==="noa"?2:1,pragmatism:id==="elias"?2:id==="noa"?1:0}}
function normalizePsyche(p){
  var base=defaultPsyche(p&&p.id),saved=p&&p.psyche||{};p.psyche={stress:clamp(Number.isFinite(Number(saved.stress))?Number(saved.stress):base.stress,-6,6),empathy:clamp(Number.isFinite(Number(saved.empathy))?Number(saved.empathy):base.empathy,-6,6),resolve:clamp(Number.isFinite(Number(saved.resolve))?Number(saved.resolve):base.resolve,-6,6),pragmatism:clamp(Number.isFinite(Number(saved.pragmatism))?Number(saved.pragmatism):base.pragmatism,-6,6)};return p.psyche
}
function psychState(p){
  var s=normalizePsyche(p);if(s.stress>=4&&s.resolve>=3)return psychStateDefs.rabia;if(s.stress>=4&&s.empathy>=3)return psychStateDefs.culpa;if(s.stress>=4)return psychStateDefs.tenso;if(s.pragmatism>=4&&s.empathy<=-2)return psychStateDefs.frio;if(s.pragmatism>=4)return psychStateDefs.pragmatico;if(s.resolve>=4)return psychStateDefs.resuelto;if(s.empathy>=4)return psychStateDefs.empatico;if(s.stress<=-2)return psychStateDefs.sereno;return psychStateDefs.estable
}
function psychEffect(p,key){var stateDef=psychState(p);return Number(stateDef[key])||0}
function psychAccuracyBonus(p){return psychEffect(p,"accuracy")}
function psychDamageBonus(p){return psychEffect(p,"damage")}
function psychDefenseBonus(p){return psychEffect(p,"defense")}
function psychHealingBonus(p){return psychEffect(p,"healing")}
function psychCheckBonusForAxis(axis){var total=state.party.reduce(function(sum,p){normalizePsyche(p);return sum+(p.psyche[axis]||0)},0),avg=total/Math.max(1,state.party.length);return avg>=4?2:avg>=2?1:avg<=-4?-2:avg<=-2?-1:0}
function psychAxisForText(text){
  text=String(text||"").toLowerCase();if(/preguntar|escuchar|ofrecer|prometer|ayudar|rescatar|estabilizar|cuidar|cubrir|entregar agua|venda|familia|voluntad/.test(text))return"empathy";
  if(/silencio|ruta|señuelo|borrar|copiar|técnic|tecnic|calcular|medir|protocolo|frecuencia|conservar|guardar distancia|priorizar/.test(text))return"pragmatism";
  if(/romper|forzar|combat|arma|dispar|exigir|jurar|sostener|avanzar|recuperar|apagar el nido|defender/.test(text))return"resolve";
  return"stress"
}
function inferPsychImpulse(o){
  var fx=o&&o.fx||{},text=[o&&o.label,o&&o.hint,o&&o.title,o&&o.result,o&&o.text,o&&o.cost].filter(Boolean).join(" ").toLowerCase(),d={stress:0,empathy:0,resolve:0,pragmatism:0};
  if(/preguntar|escuchar|ofrecer|prometer|ayudar|rescatar|estabilizar|cuidar|cubrir|entregar agua|compart|venda|familia|voluntad/.test(text)){d.empathy++;d.stress--}
  if(/silencio|ruta|señuelo|borrar|copiar|técnic|tecnic|calcular|medir|protocolo|frecuencia|conservar|guardar distancia|priorizar|marcar/.test(text)){d.pragmatism++;d.stress--}
  if(/romper|forzar|combat|arma|dispar|exigir|gritar|jurar|sostener|recuperar|defender|golpe/.test(text)){d.resolve++;d.stress++}
  if(/abandon|marcharse|cerrar sin|no pueden salvar|tomar la frecuencia|guardar todo|frío|fria|sin responder|romperlo|descartar/.test(text)){d.empathy--;d.pragmatism++;d.stress++}
  if((fx.morale||0)>0)d.empathy++;if((fx.morale||0)<0)d.stress++;if((fx.threat||0)>0)d.stress++;if((fx.threat||0)<0)d.pragmatism++;
  Object.keys(o&&o.psy||{}).forEach(function(k){if(d[k]!==undefined)d[k]+=o.psy[k]});
  return d
}
function psychPreview(o){
  var d=inferPsychImpulse(o),priority=["resolve","empathy","pragmatism","stress"],axis=priority.sort(function(a,b){return Math.abs(d[b])-Math.abs(d[a])||((d[b]>0?1:0)-(d[a]>0?1:0))})[0];return axis&&Math.abs(d[axis])>0?"Pulso: "+psychAxisLabels[axis]:""
}
function psychTargets(o,dialogue){
  var text=[o&&o.label,o&&o.hint,o&&o.title,o&&o.result,dialogue&&dialogue.npc].filter(Boolean).join(" ").toLowerCase(),ids=[];["sara","elias","noa"].forEach(function(id){if(text.indexOf(id)>=0||text.indexOf(id==="elias"?"elías":id)>=0)ids.push(id)});
  if(dialogue&&["sara","elias","noa"].indexOf(dialogue.npc)>=0&&ids.indexOf(dialogue.npc)<0)ids.push(dialogue.npc);
  return ids.length?state.party.filter(function(p){return ids.indexOf(p.id)>=0}):state.party.slice()
}
function applyPsychImpulse(o,dialogue){
  var d=inferPsychImpulse(o),magnitude=Object.keys(d).reduce(function(sum,k){return sum+Math.abs(d[k])},0);if(!magnitude)return[];
  var targets=psychTargets(o,dialogue),before=targets.map(function(p){return p.name+": "+psychState(p).name});targets.forEach(function(p){var s=normalizePsyche(p);Object.keys(d).forEach(function(k){s[k]=clamp(s[k]+d[k],-6,6)});state.stats.mentalShifts=(state.stats.mentalShifts||0)+magnitude});var after=targets.map(function(p,i){var next=psychState(p).name;return next!==before[i].split(": ")[1]?p.name+" → "+next:null}).filter(Boolean);
  return after.length?[["Pulso mental",after.slice(0,3).join(" · ")]]:[["Pulso mental",targets.length===state.party.length?"El grupo cambia de tono":"Ajuste interno"]]
}
function relaxPsyche(amount,resolveGain){
  state.party.forEach(function(p){var s=normalizePsyche(p);s.stress=clamp(s.stress-amount,-6,6);if(resolveGain)s.resolve=clamp(s.resolve+resolveGain,-6,6)})
}
function eliasIndex(){return state.party.findIndex(function(p){return p.id==="elias"})}
function elias(){return state.party[eliasIndex()]||null}
function eliasCanDisassemble(){return hasSkill(elias(),"elias_disassemble")}
function disassemblyRecipe(id){return disassemblyRecipes[id]||null}
function rewardList(recipe){return Object.keys(recipe&&recipe.rewards||{}).map(function(id){return{id:id,qty:recipe.rewards[id]}})}
function rewardUnits(recipe){return rewardList(recipe).reduce(function(sum,x){return sum+Math.max(1,Number(x.qty)||1)},0)}
function rewardText(recipe){return rewardList(recipe).map(function(x){var d=gear(x.id);return(d?d.name:resName(x.id))+" ×"+x.qty}).join(" · ")}
function canStoreDisassemblyRewards(source){
  var e=elias(),recipe=source&&disassemblyRecipe(source.id),free=e?bagFree(e):0,credit=source&&source.type==="profile"&&source.pIndex===eliasIndex()?1:0;
  return !!(e&&recipe&&rewardUnits(recipe)<=free+credit)
}
function skillNode(p,id){return(skillTrees[p&&p.id]||[]).filter(function(node){return node.id===id})[0]||null}
function skillRequirement(p,node){if(!p||!node)return"Habilidad desconocida";if(hasSkill(p,node.id))return"Adquirida";if(p.level<node.minLevel)return"Requiere Lvl. "+node.minLevel;if(node.requires&&!hasSkill(p,node.requires)){var previous=skillNode(p,node.requires);return"Requiere "+(previous?previous.name:"habilidad anterior")}if(state.factionPoints<node.cost)return"Faltan "+(node.cost-state.factionPoints)+" puntos de facción";return"Disponible"}
function canUnlockSkill(p,node){return !!(p&&node&&!hasSkill(p,node.id)&&p.level>=node.minLevel&&(!node.requires||hasSkill(p,node.requires))&&state.factionPoints>=node.cost)}
function hasUnspentSkill(p){return state.factionPoints>0&&(skillTrees[p.id]||[]).some(function(node){return canUnlockSkill(p,node)})}
function awardFactionPoints(amount,reason){amount=Math.max(0,Number(amount)||0);if(!amount)return[];state.factionPoints+=amount;state.stats.factionEarned+=amount;return[["Puntos de facción","+"+amount+(reason?" · "+reason:"")]]}
function unlockSkill(pIndex,id){if(battleState)return false;var p=state.party[pIndex],node=skillNode(p,id);if(!canUnlockSkill(p,node)){toast(p&&node?skillRequirement(p,node):"Habilidad no disponible");return false}state.factionPoints-=node.cost;p.skills.push(node.id);state.stats.factionSpent+=node.cost;state.stats.skillsUnlocked++;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast(p.name+" desbloquea "+node.name);return true}
function storyDecisionBenefit(out){var fx=out&&out.fx||{},flags=out&&out.flags||{},flagPattern=/(save|rescu|truth|verdad|trust|confia|alliance|alianza|help|ayud|spare|perdon|free|liber|access|acceso|truce|tregua|returnRoute|clearAvenue|towerCode)/i;return Number(fx.morale)>=3||Number(fx.threat)<=-3||!!(out&&out.archive&&out.archive.length)||Object.keys(flags).some(function(key){return flags[key]&&flagPattern.test(key)})}
function addPersonalXp(pIndex,amount,source){
  var p=state.party[pIndex];if(!p||amount<=0)return[];p.xp+=amount;var leveled=[];
  if(battleState){battleState.xpEarned[pIndex]=(battleState.xpEarned[pIndex]||0)+amount;battleState.log.push(p.name+" obtiene "+amount+" XP"+(source?" por "+source:"")+".")}
  while(p.xp>=xpNeeded(p)){p.xp-=xpNeeded(p);p.level++;p.maxHp+=6;p.hp=Math.min(p.maxHp,p.hp+6);leveled.push(p.name+" alcanza Lvl. "+p.level+": +6 HP máximo y −1 al gasto de energía.");if(battleState)battleState.levelUps.push(p.name+" · Lvl. "+p.level)}
  return leveled
}
function missionDescription(def){if(!def.main)return def.description;if(state.index<9)return"Traza una ruta segura desde la Línea 1 hasta la superficie.";if(state.index<18)return"Descubre quién utiliza la Red UNO para mantener viva la transmisión.";return"Alcanza la Torre 6 y decide qué verdad regresará a los refugios."}
function missionProgress(def){if(def.id==="signal")return state.finished?def.target:Math.min(def.target,state.index+1);if(def.id==="squad")return Math.min(def.target,state.stats.fullSquadWins||0);if(def.id==="salvage")return Math.min(def.target,state.stats.loot||0);if(def.id==="archives")return Math.min(def.target,state.docs.length);if(def.id==="veteran")return state.party.some(function(p){return p.level>=2})?1:0;return 0}
function rewardMission(def){
  if(def.id==="squad")state.morale=clamp(state.morale+6,0,100);
  else if(def.id==="salvage"){placePartyItem("food",1);placePartyItem("meds",1)}
  else if(def.id==="archives")state.threat=clamp(state.threat-6,0,100);
  else if(def.id==="veteran")state.party.forEach(function(p){p.hunger=clamp(p.hunger+10,0,100)});
  state.missionRewards[def.id]=true
}
function checkMissions(){var changes=[];missionDefs.filter(function(def){return !def.main}).forEach(function(def){if(!state.missionRewards[def.id]&&missionProgress(def)>=def.target){rewardMission(def);changes.push(["Misión cumplida",def.title+" · "+def.reward])}});return changes}
function missionCardHtml(def){var progress=missionProgress(def),done=progress>=def.target,percent=Math.round(100*progress/def.target);return'<article class="drawer-item mission-card '+(def.main?"main ":"")+(done?"completed":"")+'"><span class="mission-type">'+(def.main?"Misión principal":done?"Completada":"Misión secundaria")+'</span><h3>'+esc(def.title)+'</h3><p>'+esc(missionDescription(def))+'</p><div class="mission-track"><span style="width:'+percent+'%"></span></div><div class="mission-meta"><span>'+progress+' / '+def.target+'</span><span>'+percent+'%</span></div><div class="mission-reward">Recompensa · '+esc(def.reward)+'</div></article>'}
function weaponFor(p){var d=gear(p.equipment.weapon);return d&&d.kind==="weapon"?d:gear("knife")}
function gearDurability(p,slot){var d=gear(p.equipment[slot]);if(!d||!d.maxDurability)return null;var value=Number(p.durability&&p.durability[slot]);return Number.isFinite(value)?clamp(value,0,d.maxDurability):d.maxDurability}
function gearDefense(p){var base=["head","body"].reduce(function(sum,slot){var d=gear(p.equipment[slot]),dur=gearDurability(p,slot);return sum+(d&&d.defense&&dur>0?d.defense:0)},0);return base+(p&&p.id==="elias"&&base>0&&hasSkill(p,"elias_reinforce")?1:0)}
function hungerPenalty(p){return p.hunger<=10?-4:p.hunger<=35?-2:0}
function weaponAccuracyPenalty(p,w){return p&&p.id==="elias"&&w&&w.kind==="weapon"&&w.ammo&&!hasSkill(p,"elias_ballistics")?-2:0}
function personalAccuracyBonus(p){return(p&&p.id==="noa"&&hasSkill(p,"noa_marksman")?1:0)+psychAccuracyBonus(p)}
function personalDamageBonus(p,e){var mental=psychDamageBonus(p);if(!p||p.id!=="noa")return mental;return mental+(hasSkill(p,"noa_hunter")?2:0)+(hasSkill(p,"noa_execution")&&e&&e.hp/e.maxHp<=.35?4:0)}
function drainHunger(amount){state.party.forEach(function(p){p.hunger=clamp(p.hunger-Math.max(1,amount-energyResist(p)),0,100)})}
function damageArmor(p,wear){var slots=["head","body"].filter(function(slot){var d=gear(p.equipment[slot]);return d&&d.maxDurability&&gearDurability(p,slot)>0});if(!slots.length)return;var slot=slots[rand(0,slots.length-1)],d=gear(p.equipment[slot]),before=gearDurability(p,slot);p.durability[slot]=Math.max(0,before-wear);battleState.log.push(d.name+" de "+p.name+" pierde "+(before-p.durability[slot])+" de durabilidad.");if(p.durability[slot]===0)battleState.log.push(d.name+" queda inutilizable hasta que Elías lo repare.")}
function weaponLabel(p){var w=weaponFor(p),ammo=w.ammo?" · "+bagQty(p,w.ammo)+" cart.":" · cuerpo a cuerpo";return w.name+ammo}
function sceneKeyForEvent(ev){var text=((ev.loc||"")+" "+(ev.type||"")+" "+(ev.title||"")).toLowerCase();if(/perímetro de gobierno|perimetro de gobierno/.test(text))return"day-valley";if(/mercado subterráneo|mercado subterraneo/.test(text))return"day-market";if(/casa de cazadores|mesa para cuatro/.test(text))return"day-hunters";if(/escalera república|escalera republica|primera luz/.test(text))return"day-station";if(/alameda hundida|alameda superior|cruce dieciocho|semáforo|semaforo|asfalto|avenida|cielo abierto|cazadores de pulsos/.test(text))return"day-alameda";if(/sala de antenas|soporte vital|cámara de núcleos|camara de nucleos|torre repetidora|última patrulla|ultima patrulla|mujer de la señal|exiliados regresan|núcleo expuesto|nucleo expuesto/.test(text))return"antenna";if(/perímetro|perimetro|gobierno|ministerio|corredor de hormigón|corredor de hormigon|continuidad|cascos morados|uno/.test(text))return"uno";if(/azotea|azoteas|dron|drones|nido|superficie/.test(text))return"drone";if(/inundada|agua sobre|casa de bombas|bomba|farmacia/.test(text))return"flood";return"station"}
function pulseStageFade(prevBackground){
  var node=$("stagePrevBg");if(!node||!prevBackground||prevBackground==="none")return;clearTimeout(stageFadeTimer);node.classList.remove("active");node.style.backgroundImage=prevBackground;void node.offsetWidth;node.classList.add("active");stageFadeTimer=setTimeout(function(){node.classList.remove("active");node.style.backgroundImage=""},930)
}
var eventDossiers=[
  ["signal","protocol"],
  ["signal","exiles"],
  ["protocol","sonar"],
  ["hunterMarks","signal"],
  ["redEyes","cores"],
  ["sonar","cores"],
  ["hunterMarks","coreRite"],
  ["coreRite","hunterMarks"],
  ["matias","signal"],
  ["sonar","protocol"],
  ["hunterMarks","sonar"],
  ["sonar","protocol"],
  ["hunterMarks","redEyes"],
  ["protocol","names"],
  ["sonar","purpleHelmets"],
  ["cores","exiles"],
  ["sonar","redEyes"],
  ["hunterMarks","names"],
  ["names","sonar"],
  ["purpleHelmets","exiles"],
  ["sonar","purpleHelmets"],
  ["truce","coreRite"],
  ["protocol","purpleHelmets"],
  ["sonar","protocol"],
  ["origin","names"],
  ["exiles","truce","coreRite"],
  ["origin","names","protocol"]
];
var dossierNotes={
  signal:"La señal no es solo un objetivo: define si conviene responder, ocultarse o investigar antes de gastar recursos.",
  matias:"Matías conecta rutas humanas con desvíos de la Red UNO; su testimonio ayuda a valorar rescate, abandono o negociación.",
  protocol:"El protocolo muestra cómo piensa la Red UNO: no protege a todos por igual, clasifica cuerpos, refugios y rutas.",
  names:"El listado de refugios vuelve peligrosa cualquier decisión sobre coordenadas, transmisión o intercambio de información.",
  origin:"El origen de la señal explica quién está interviniendo la red y por qué liberar información puede salvar o exponer comunidades.",
  exiles:"El acta de los exiliados cambia el sentido de cada encuentro con merodeadores: no son una amenaza nacida de la nada.",
  hunterMarks:"Las marcas de cazadores revelan rutas de confianza, deudas y formas de sobrevivir sin emitir señales rastreables.",
  redEyes:"Las ópticas rojas ayudan a leer si una emboscada es cacería, frontera o defensa de un territorio propio.",
  cores:"Los núcleos implantados son memoria y supervivencia, no simple botín tecnológico.",
  coreRite:"El rito de recuperación vuelve moralmente más pesada cualquier decisión sobre saquear, defender o abandonar cuerpos.",
  sonar:"SONAR explica por qué respirar, correr, disparar o quedarse quieto son decisiones tácticas frente a la Red UNO.",
  purpleHelmets:"Los cascos morados responden a una jerarquía distinta: entenderlos ayuda a decidir cuándo combatir, mentir o rodear.",
  truce:"La tregua borrada demuestra que cazadores y exiliados ya cooperaron; puede cambiar cómo se juzga una alianza imposible."
};
var eventAudioClues={
  0:[{id:"signal-start",title:"Tres palabras en la frecuencia",kicker:"Transmisión dañada",source:"Radio del refugio · canal prohibido",duration:"00:12",src:"audio/lore/voice/signal-start.mp3",summary:"La primera señal no explica nada: confirma que hay una voz humana viva dentro de un sistema que debía estar cerrado.",transcript:"Todavía estamos aquí... todavía... aquí. No respondan por voz abierta. Si escuchan la pausa entre los barridos, sigan el pulso."}],
  1:[{id:"council-silence",title:"Orden reservada del consejo",kicker:"Registro interno",source:"Archivo analógico · Andén de Asamblea",duration:"00:18",src:"audio/lore/voice/council-silence.mp3",summary:"Una grabación antigua deja claro que el silencio sobre los merodeadores no nació por ignorancia, sino por miedo político.",transcript:"No usen la palabra exiliados frente a los jóvenes. No todavía. Una comunidad puede sobrevivir al hambre, pero no siempre sobrevive a saber a quién abandonó."}],
  3:[{id:"hunter-mother",title:"Mensaje de la madre cazadora",kicker:"Grabación doméstica",source:"Cinta recuperada · Último andén habitado",duration:"00:21",src:"audio/lore/voice/hunter-mother.mp3",summary:"La necesidad de agua deja de ser un número: la familia cazadora tiene una historia y una deuda posible.",transcript:"Si no volvemos antes de la segunda luz, no salgan por las escaleras grandes. La marca de tres líneas es descanso. La de una cruz no es muerte: es deuda."}],
  4:[{id:"red-lights-border",title:"Golpes en el hormigón",kicker:"Señal de frontera",source:"Registro de contacto · Túnel de enlace",duration:"00:16",src:"audio/lore/voice/red-lights-border.mp3",summary:"Los merodeadores no suenan como una horda: se coordinan, advierten y protegen una frontera.",transcript:"Dos golpes. Pausa. Dos golpes. No cruzar. No sangre. Marca vieja. Torre miente. Núcleo recuerda."}],
  8:[{id:"matias-fever",title:"Advertencia de Matías",kicker:"Voz febril",source:"Grabadora de farmacia · Enlace",duration:"00:24",src:"audio/lore/voice/matias-fever.mp3",summary:"Matías transforma el dilema del rescate en información táctica: la Red UNO detecta fiebre, no solo armas.",transcript:"República no. Si el cielo está quieto, no es calma. Están midiendo calor. Usen mi pulso si deben, pero no dejen que Sara respire primero."}],
  13:[{id:"terminal-memory",title:"Fragmento del terminal",kicker:"Memoria dañada",source:"Nodo 14 · Terminal de rutas",duration:"00:20",src:"audio/lore/voice/terminal-memory.mp3",summary:"La máquina confirma que la lista de refugios puede salvar comunidades o convertirlas en objetivos.",transcript:"Consulta incompleta. Refugios no registrados: ciento doce. Firmas cardíacas: activas. Origen de intervención: soporte vital humano. Riesgo de transmisión: alto."}],
  15:[{id:"lira-core",title:"Pulso de Lira",kicker:"Núcleo expuesto",source:"Camilla improvisada · Superficie",duration:"00:23",src:"audio/lore/voice/lira-core.mp3",summary:"La pista vuelve más pesada la extracción del núcleo: no es una llave neutra, también es memoria viva.",transcript:"Me llamaban Eliana abajo. Lira fue lo que quedó cuando cerraron la puerta. Si arrancan el núcleo, abren una ruta. Si lo dejan, quizá abran otra cosa."}],
  18:[{id:"sunken-voices",title:"Voces del edificio hundido",kicker:"Auxilio abierto",source:"Radio civil · Alameda superior",duration:"00:15",src:"audio/lore/voice/sunken-voices.mp3",summary:"El rescate deja de ser abstracto: hay personas pidiendo ayuda mientras la patrulla avanza.",transcript:"Hay tres aquí. Una no puede bajar. Si alguien escucha, no disparen al dron todavía. La escalera norte cayó. Repito: la norte cayó."}],
  24:[{id:"irene-heart",title:"El corazón de Irene",kicker:"Soporte vital",source:"Sala de antenas · Canal interno",duration:"00:28",src:"audio/lore/voice/irene-heart.mp3",summary:"La señal revela su centro humano: Irene no es solo una fuente de datos, es una voluntad atrapada.",transcript:"Usaron mi corazón como contraseña. Yo usé sus pausas como puerta. No transmitan solo mi nombre. Transmitan las rutas, los muertos y las órdenes."}],
  26:[{id:"final-broadcast",title:"La ciudad responde",kicker:"Ventana de transmisión",source:"Torre repetidora 6 · Frecuencias abiertas",duration:"00:30",src:"audio/lore/voice/final-broadcast.mp3",summary:"El final puede sentirse como una ciudad despertando: muchas voces, no una explicación.",transcript:"Línea 1 recibe. Estación cerrada recibe. Cazadores al sur reciben. Exiliados escuchan. Si esto es verdad, nadie vuelve solo al túnel."}]
};
function archiveUnlocked(id){return state.docs.indexOf(id)>=0}
function dossierIdsForEvent(ev){
  var ids=(eventDossiers[state.index]||[]).slice(),text=((ev.title||"")+" "+(ev.text||"")+" "+(ev.loc||"")+" "+(ev.type||"")).toLowerCase();
  if(!ids.length)ids.push("signal");
  if(/dron|sonar|pulso|rastread|respiraci/.test(text))ids.push("sonar");
  if(/exiliad|merodeador|núcleo|nucleo/.test(text))ids.push("exiles");
  if(/cazador|cosechador|marca/.test(text))ids.push("hunterMarks");
  if(/operadora|señal|senal|transmis/.test(text))ids.push("origin");
  return ids.filter(function(id,i,list){return archives[id]&&list.indexOf(id)===i}).slice(0,3)
}
function contextArchiveHtml(id){
  var summary=archives[id],unlocked=archiveUnlocked(id);
  return'<button class="context-archive '+(unlocked?'unlocked':'locked')+'" data-context-archive="'+esc(id)+'"><span><b>'+esc(summary[0])+'</b><small>'+esc(dossierNotes[id]||summary[1])+'</small><em>'+(unlocked?'Recuperado · leer completo':'Pista parcial · abrir')+'</em></span></button>'
}
function audioCluesForEvent(){
  return(eventAudioClues[state.index]||[]).slice(0,1)
}
function contextAudioHtml(clip){
  return'<button class="context-archive audio-clue" data-audio-clue="'+esc(clip.id)+'"><span><b>'+esc(clip.title)+'</b><small>'+esc(clip.summary)+'</small><em>'+esc(clip.kicker||"Audio recuperado")+' · escuchar</em></span></button>'
}
function renderContextArchives(ev){
  var node=$("contextArchives"),ids=node?dossierIdsForEvent(ev):[],clips=node?audioCluesForEvent():[];if(!node)return;
  if(clips.length)ids=ids.slice(0,2);
  if(!ids.length&&!clips.length){node.classList.add("hidden");node.innerHTML="";return}
  node.classList.remove("hidden");
  node.innerHTML='<header><span>Expedientes para decidir</span><span>Docs y audio antes de elegir</span></header><div class="context-archive-list">'+ids.map(contextArchiveHtml).concat(clips.map(contextAudioHtml)).join("")+'</div>';
  Array.prototype.forEach.call(document.querySelectorAll("[data-context-archive]"),function(b){b.addEventListener("click",function(){openContextArchive(b.dataset.contextArchive,b)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-audio-clue]"),function(b){b.addEventListener("click",function(){openAudioClue(b.dataset.audioClue,b)})})
}
function openContextArchive(id,opener){
  var summary=archives[id],doc=archiveTexts[id],unlocked=archiveUnlocked(id),body;if(!summary||!doc)return;
  if(unlocked){openArchive(id,opener);return}
  body=[dossierNotes[id]||summary[1],doc.body&&doc.body[0]?doc.body[0]:"La información completa sigue fragmentada. La expedición deberá recuperar el archivo para confirmar esta pista.","Lectura parcial: este expediente ayuda a decidir la escena actual, pero no se suma al archivo recuperado de la partida."];
  archiveOpener=opener||null;$("archiveDocClass").textContent="Dossier contextual · no recuperado";$("archiveDocTitle").textContent=summary[0];$("archiveDocSource").textContent=doc.source;$("archiveDocDate").textContent=doc.date;$("archiveDocSummary").textContent=summary[1];$("archiveDocBody").innerHTML=body.map(function(p){return"<p>"+esc(p)+"</p>"}).join("");$("archiveModal").classList.remove("hidden");$("archiveReaderScroll").scrollTop=0;$("closeArchive").focus()
}
function repairCost(p,slot){var d=gear(p.equipment[slot]),dur=gearDurability(p,slot);if(!d||!d.maxDurability||dur>=d.maxDurability)return 0;return dur===0||d.maxDurability-dur>=Math.ceil(d.maxDurability/2)?2:1}
function repairReady(p,slot){var cost=repairCost(p,slot);return cost>0&&state.party[1].hp>0&&state.engineeringUses>0&&hasPartyItem("tool")&&stockCount("scrap")>=cost}
function slotHtml(label,pIndex,slot){var p=state.party[pIndex],id=p.equipment[slot],d=gear(id),dur=d&&d.maxDurability?gearDurability(p,slot):null,cost=repairCost(p,slot),durability=d&&d.maxDurability?'<span class="durability-copy"><span>Durabilidad</span><b>'+dur+'/'+d.maxDurability+'</b></span><span class="durability-bar"><span style="width:'+Math.round(100*dur/d.maxDurability)+'%"></span></span>'+(cost?'<button class="repair-btn" data-repair="'+slot+'" '+(!repairReady(p,slot)?'disabled':'')+'>Reparar · '+cost+' comp.</button>':""):"";return'<div class="gear-slot"><span class="slot-name">'+esc(label)+'</span>'+itemArt(id,d&&d.name)+ '<span class="gear-copy"><strong>'+esc(d?d.name:"Vacío")+'</strong><small>'+esc(d?d.desc:"Sin equipar")+'</small>'+durability+'</span></div>'}
function canEquip(p,d){return d&&d.slot&&(d.kind!=="weapon"||p.categories.indexOf(d.category)>=0)}
function profileItemUsable(p,id){return id==="food"?p.hunger<100:id==="stimulant"?p.hp<p.maxHp||p.hunger<100:id==="meds"||id==="medkit"||id==="traumaKit"?p.hp<p.maxHp:id==="bandage"?p.hp<p.maxHp||p.bleed>0:false}
function recipeCostText(recipe){return Object.keys(recipe.cost).map(function(id){var names={scrap:"componentes",cloth:"tela",water:"agua",electronics:"electrónica",pulseCore:"núcleos de pulso"},d=gear(id);return recipe.cost[id]+" "+(names[id]||(d?d.name.toLowerCase():id))}).join(" · ")}
function professionUses(id){return id==="elias"?state.engineeringUses:id==="sara"?state.medicalUses:id==="noa"?state.ordnanceUses:0}
function craftOutputFits(p,recipe){return bagFree(p)+Object.keys(recipe.cost).reduce(function(sum,id){return sum+(id==="water"?0:Math.min(bagQty(p,id),recipe.cost[id]))},0)>=Math.max(1,Number(recipe.qty)||1)}
function canCraft(p,recipe){return !!(p&&recipe&&p.id===recipe.owner&&(!recipe.skill||hasSkill(p,recipe.skill))&&p.hp>0&&professionUses(p.id)>0&&(p.id!=="elias"||hasPartyItem("tool"))&&craftOutputFits(p,recipe)&&Object.keys(recipe.cost).every(function(id){return stockCount(id)>=recipe.cost[id]}))}
function profileVitalFill(kind,value,max,feedback,extraClass){var to=Math.round(100*value/max),active=feedback&&feedback.kind===kind;if(!active)return'<span class="vital-fill '+kind+' '+(extraClass||"")+'" style="width:'+to+'%"></span>';var from=Math.round(100*feedback.from/max);return'<span class="vital-fill '+kind+' '+(extraClass||"")+' vital-shift" style="--vital-from:'+from+'%;--vital-to:'+to+'%;width:'+to+'%"></span>'}
function profileVitalFloat(feedback){if(!feedback||feedback.delta<=0)return"";return'<span class="profile-vital-float '+feedback.kind+'" aria-live="polite">+'+feedback.delta+' '+(feedback.kind==="hp"?"HP":"ENERGÍA")+'</span>'}
function psychTrack(label,value){
  var pct=clamp(50+value*7,8,92);return'<span class="psych-track-row"><b>'+esc(label)+'</b><i><span style="width:'+pct+'%"></span></i><em>'+((value>0?"+":"")+value)+'</em></span>'
}
function psychPanelHtml(p){
  var psyche=normalizePsyche(p),stateDef=psychState(p),open=psychPanelExpanded;return'<aside class="psych-panel '+(stateDef.tone||"")+' '+(open?'expanded':'compact')+'"><header><span>Estado psicológico</span><strong>'+esc(stateDef.name)+'</strong><button class="psych-panel-toggle" data-psych-toggle aria-expanded="'+(open?'true':'false')+'" aria-label="'+(open?'Contraer estado psicológico':'Expandir estado psicológico')+'">'+(open?'−':'+')+'</button></header><div class="psych-panel-body"><p>'+esc(stateDef.desc)+'</p><div class="psych-tracks">'+psychTrack("Tensión",psyche.stress)+psychTrack("Empatía",psyche.empathy)+psychTrack("Decisión",psyche.resolve)+psychTrack("Táctica",psyche.pragmatism)+'</div><small>'+esc(stateDef.effects)+'</small></div></aside>'
}
function psychTeamLine(){return state.party.map(function(p){return p.name+": "+psychState(p).name}).join(" · ")}
function professionWorkshopHtml(p){
  var recipes=workshopRecipes.filter(function(recipe){return recipe.owner===p.id&&(!recipe.skill||hasSkill(p,recipe.skill))});if(!recipes.length)return"";
  var cards=recipes.map(function(recipe){var d=gear(recipe.id),ready=canCraft(p,recipe),qty=Math.max(1,Number(recipe.qty)||1);return'<article class="recipe-card">'+itemArt(recipe.id,d.name)+'<span><b>'+esc(d.name)+(qty>1?' ×'+qty:'')+'</b><small>'+esc(recipe.note)+'</small><em>'+esc(recipeCostText(recipe))+'</em></span><button data-craft="'+recipe.id+'" '+(!ready?'disabled':'')+'>Fabricar · +'+(recipe.xp||8)+' XP</button></article>'}).join("");
  var sara=p.id==="sara",noa=p.id==="noa",title=sara?"Mesa médica de Sara":noa?"Banco de explosivos de Noa":"Taller de Elías",description=sara?"Preparar medicina consume una acción médica. La tela se recupera de merodeadores.":noa?"Fabrica granadas y cargas EMP con chatarra electrónica recuperada.":"Reparar o fabricar consume una acción técnica. El uso de armas de fuego tiene −2 de precisión.",meta=sara?state.medicalUses+" / 3 acciones · "+stockCount("cloth")+" tela · "+stockCount("water")+" agua":noa?state.ordnanceUses+" / 3 acciones · "+stockCount("electronics")+" electrónica · "+stockCount("pulseCore")+" núcleos":state.engineeringUses+" / 3 acciones · "+stockCount("scrap")+" componentes · "+(hasPartyItem("tool")?"herramientas listas":"sin herramientas");
  return'<section class="workshop '+(sara?'medical-workshop':noa?'ordnance-workshop':'engineering-workshop')+'"><div class="workshop-head"><span><b>'+title+'</b><small>'+description+'</small></span><em>'+meta+'</em></div><div class="recipe-grid">'+cards+'</div></section>'
}
function skillTreeHtml(p){
  var nodes=skillTrees[p.id]||[],branches=[];nodes.forEach(function(node){if(branches.indexOf(node.branch)<0)branches.push(node.branch)});
  var columns=branches.map(function(branch){var branchNodes=nodes.filter(function(node){return node.branch===branch});return'<section class="skill-branch"><h4>'+esc(branch)+'</h4><div class="skill-path">'+branchNodes.map(function(node){var unlocked=hasSkill(p,node.id),available=canUnlockSkill(p,node),status=skillRequirement(p,node);return'<article class="skill-node tier-'+node.tier+' '+(unlocked?'unlocked':available?'available':'locked')+'"><span class="skill-tier">0'+node.tier+'</span><div><b>'+esc(node.name)+'</b><p>'+esc(node.desc)+'</p><small>'+esc(status)+' · '+node.cost+' PF</small></div><button data-unlock-skill="'+node.id+'" '+(!available?'disabled':'')+'>'+(unlocked?'Adquirida':'Desbloquear')+'</button></article>'}).join('')+'</div></section>'}).join('');
  return'<section class="skill-tree"><div class="skill-tree-head"><span><b>Árbol de habilidades</b><small>Los puntos son compartidos: especializa al grupo según la ruta de esta partida.</small></span><em>Puntos de facción <strong>'+state.factionPoints+'</strong></em></div><div class="skill-branches">'+columns+'</div></section>'
}
function profileTabsHtml(p){var tabs=[{id:"inventory",label:"Equipamiento"},{id:"crafting",label:"Crafteo"},{id:"skills",label:"Habilidades"}];return'<nav class="profile-tabs" role="tablist" aria-label="Secciones del loadout">'+tabs.map(function(tab){var active=profileTab===tab.id,alert=tab.id==="skills"&&hasUnspentSkill(p)?'<span class="profile-tab-alert">'+state.factionPoints+'</span>':"";return'<button id="profileTab-'+tab.id+'" role="tab" aria-selected="'+(active?'true':'false')+'" aria-controls="profilePane-'+tab.id+'" tabindex="'+(active?'0':'-1')+'" class="'+(active?'active':'')+'" data-profile-tab="'+tab.id+'">'+tab.label+alert+'</button>'}).join('')+'</nav>'}
function setProfileTab(i,tab,focusTab){if(["inventory","crafting","skills"].indexOf(tab)<0)return;profileTab=tab;renderProfile(i);if(focusTab){var button=$("profileTab-"+tab);if(button)button.focus()}}
function profileSwitcherHtml(currentIndex){
  return '<nav class="profile-switcher" aria-label="Cambiar superviviente">'+state.party.map(function(p,i){var ready=hasUnspentSkill(p),active=i===currentIndex,status=p.hp<=0?"Agotado":p.hp<10?"Crítico":p.hunger<10?"Sin energía":"Listo",mind=psychState(p).name;return '<button class="profile-switch '+(active?"active ":"")+(ready?"skill-ready ":"")+(status!=="Listo"?"warning":"")+'" data-profile-switch="'+i+'" '+(active?'aria-current="true"':"")+'><span class="profile-switch-photo">'+assetImage("portraits/"+p.id+".webp",p.name,"",590,885)+'</span><span><b>'+esc(p.name+" · "+status)+'</b><small>Lvl. '+p.level+' · '+p.hp+'/'+p.maxHp+' HP · '+esc(mind)+' · Mochila '+bagUsed(p)+'/'+bagCapacity(p)+'</small>'+(ready?'<strong class="skill-ready-copy">Habilidad disponible</strong>':"")+'</span><em>'+(active?"Activo":"Ver")+'</em></button>'}).join("")+'</nav>'
}
function switchProfile(currentIndex,nextIndex){
  if(battleState||!state.party[nextIndex]||nextIndex===currentIndex)return;closeTransferModal();closeDiscardModal();renderProfile(nextIndex);var active=document.querySelector('[data-profile-switch="'+nextIndex+'"]');if(active)active.focus()
}
function renderProfile(i,feedback){
  var p=state.party[i];if(!p)return;$('profileTitle').textContent=p.name+" · "+p.role;
  var bag=p.bag.length?p.bag.map(function(entry,index){var d=gear(entry.id),equip=canEquip(p,d),usable=profileItemUsable(p,entry.id),label=d&&d.kind==="weapon"&&p.categories.indexOf(d.category)<0?"Incompatible":"Equipar",targets=state.party.some(function(other,j){return j!==i&&canReceive(other,entry.id,1)}),units=Math.max(1,Number(entry.qty)||1),dur=d&&d.maxDurability?' · Durabilidad '+entry.durability+'/'+d.maxDurability:"",actions=(d&&d.slot?'<button class="equip-btn" data-equip="'+index+'" '+(!equip?'disabled':'')+'>'+esc(label)+'</button>':"")+(usable||["food","meds","bandage","medkit"].indexOf(entry.id)>=0?'<button class="profile-use-btn" data-profile-use="'+index+'" '+(!usable?'disabled':'')+'>Usar</button>':"")+profileDisassembleAction(i,index,entry)+'<button class="transfer-open-btn" data-transfer-open="'+index+'" '+(!targets?'disabled':'')+'>Transferir</button><button class="discard-open-btn" data-discard-profile="'+index+'">Descartar</button>';return'<article class="bag-item">'+itemArt(entry.id,d&&d.name)+'<span class="bag-copy"><b>'+esc((d?d.name:entry.id)+(entry.qty>1?" ×"+entry.qty:""))+'</b><small>'+esc((d?d.desc:"Objeto recuperado")+dur)+'</small><em>'+units+' espacio'+(units===1?'':'s')+'</em></span><div class="bag-actions">'+actions+'</div></article>'}).join(""):'<p class="empty">La mochila está vacía.</p>';
  var hungerClass=p.hunger<=10?"critical":p.hunger<=35?"low":"",skills=skillTreeHtml(p),workshop=professionWorkshopHtml(p),inventory='<div class="loadout-inventory"><div class="loadout-side">'+slotHtml("Arma",i,"weapon")+slotHtml("Mochila",i,"backpack")+'</div><div class="bag-panel"><div class="bag-head"><span>Inventario personal</span><b>'+bagUsed(p)+' / '+bagCapacity(p)+' espacios</b></div><div class="bag-slots">'+bag+'</div></div></div>';
  var mind=psychState(p),defense=Math.max(0,gearDefense(p)+psychDefenseBonus(p));$('profileContent').innerHTML=profileSwitcherHtml(i)+'<div class="loadout-grid"><div class="loadout-side">'+slotHtml("Cabeza",i,"head")+slotHtml("Cuerpo",i,"body")+'</div><div class="loadout-person">'+assetImage("characters/"+p.id+"-loadout.webp",p.name+", "+p.role,"loadout-character-art",768,1152)+psychPanelHtml(p)+profileVitalFloat(feedback)+'<div class="profile-vitals '+(feedback?'fx-'+feedback.kind:"")+'"><div class="vital-row hp-row"><span>HP</span><div class="vital-track">'+profileVitalFill("hp",p.hp,p.maxHp,feedback,"")+'</div><b>'+p.hp+'/'+p.maxHp+'</b></div><div class="vital-row energy-row"><span>Energía</span><div class="vital-track">'+profileVitalFill("energy",p.hunger,100,feedback,hungerClass)+'</div><b>'+p.hunger+'%</b></div><div class="person-stats"><div class="person-stat">Rango<b>Lvl. '+p.level+'</b></div><div class="person-stat">XP<b>'+p.xp+'/'+xpNeeded(p)+'</b></div><div class="person-stat">Mental<b>'+esc(mind.name)+'</b></div><div class="person-stat">Defensa<b>+'+defense+'</b></div></div></div></div><section class="loadout-hub">'+profileTabsHtml(p)+'<div id="profilePane-inventory" role="tabpanel" aria-labelledby="profileTab-inventory" class="profile-pane inventory '+(profileTab==="inventory"?'active':'')+'">'+inventory+'</div><div id="profilePane-crafting" role="tabpanel" aria-labelledby="profileTab-crafting" class="profile-pane crafting '+(profileTab==="crafting"?'active':'')+'">'+workshop+'</div><div id="profilePane-skills" role="tabpanel" aria-labelledby="profileTab-skills" class="profile-pane skills '+(profileTab==="skills"?'active':'')+'">'+skills+'</div></section></div>';
  Array.prototype.forEach.call(document.querySelectorAll("[data-equip]"),function(b){b.addEventListener("click",function(){equipBagItem(i,Number(b.dataset.equip))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile-use]"),function(b){b.addEventListener("click",function(){useProfileItem(i,Number(b.dataset.profileUse))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-disassemble-profile]"),function(b){b.addEventListener("click",function(){openDisassemblyFromProfile(i,Number(b.dataset.disassembleProfile))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-open]"),function(b){b.addEventListener("click",function(){openTransferModal(i,Number(b.dataset.transferOpen))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-discard-profile]"),function(b){b.addEventListener("click",function(){openDiscardModal(i,Number(b.dataset.discardProfile))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile-switch]"),function(b){b.addEventListener("click",function(){switchProfile(i,Number(b.dataset.profileSwitch))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-psych-toggle]"),function(b){b.addEventListener("click",function(){psychPanelExpanded=!psychPanelExpanded;renderProfile(i);var toggle=document.querySelector("[data-psych-toggle]");if(toggle)toggle.focus()})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-repair]"),function(b){b.addEventListener("click",function(){repairEquipment(i,b.dataset.repair)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-craft]"),function(b){b.addEventListener("click",function(){craftItem(i,b.dataset.craft)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-unlock-skill]"),function(b){b.addEventListener("click",function(){unlockSkill(i,b.dataset.unlockSkill)})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile-tab]"),function(b){b.addEventListener("click",function(){setProfileTab(i,b.dataset.profileTab,true)});b.addEventListener("keydown",function(e){var order=["inventory","crafting","skills"],current=order.indexOf(b.dataset.profileTab),next=current;if(e.key==="ArrowRight")next=(current+1)%order.length;else if(e.key==="ArrowLeft")next=(current+order.length-1)%order.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=order.length-1;else return;e.preventDefault();setProfileTab(i,order[next],true)})})
}
function transferTargetHtml(fromIndex,bagIndex,toIndex){
  var to=state.party[toIndex],used=bagUsed(to),capacity=bagCapacity(to),free=bagFree(to),can=free>=1;
  return'<button class="transfer-target" data-transfer-target="'+toIndex+'" '+(!can?'disabled':'')+'><span><b>'+esc(to.name)+'</b><small>'+esc(to.role)+' · '+used+'/'+capacity+' espacios ocupados</small></span><em>'+free+' libre'+(free===1?'':'s')+'</em></button>'
}
function renderTransferModal(){
  if(!transferDraft)return;var from=state.party[transferDraft.fromIndex],entry=from&&from.bag[transferDraft.bagIndex],d=entry&&gear(entry.id);if(!from||!entry){closeTransferModal();return}
  var units=Math.max(1,Number(entry.qty)||1),max=d&&d.stack?units:1,targets=state.party.map(function(_,j){return j!==transferDraft.fromIndex?transferTargetHtml(transferDraft.fromIndex,transferDraft.bagIndex,j):""}).join("");
  $("transferObject").innerHTML=itemArt(entry.id,d&&d.name)+'<span><b>'+esc((d?d.name:entry.id)+(entry.qty>1?" ×"+entry.qty:""))+'</b><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>Sale desde '+esc(from.name)+'</em></span>';
  $("transferQty").max=max;$("transferQty").value=Math.min(max,Math.max(1,Number($("transferQty").value)||1));$("transferQty").disabled=max===1;
  $("transferTargets").innerHTML=targets||'<p class="empty">No hay otro aliado disponible.</p>';
  $("transferMessage").classList.toggle("hidden",state.party.some(function(_,j){return j!==transferDraft.fromIndex&&bagFree(state.party[j])>0}));
  Array.prototype.forEach.call(document.querySelectorAll("[data-transfer-target]"),function(b){b.addEventListener("click",function(){confirmTransferTarget(Number(b.dataset.transferTarget))})})
}
function openTransferModal(fromIndex,bagIndex){
  if(battleState)return;var from=state.party[fromIndex],entry=from&&from.bag[bagIndex];if(!from||!entry){toast("No se pudo abrir la transferencia");return}
  transferDraft={fromIndex:fromIndex,bagIndex:bagIndex};$("transferModal").classList.remove("hidden");$("transferQty").value=1;renderTransferModal();$("transferQty").focus()
}
function confirmTransferTarget(toIndex){
  if(!transferDraft)return;var qty=Number($("transferQty").value)||1;if(transferBagItem(transferDraft.fromIndex,transferDraft.bagIndex,toIndex,qty))closeTransferModal()
}
function closeTransferModal(){
  transferDraft=null;if($("transferModal"))$("transferModal").classList.add("hidden")
}
function renderDiscardModal(){
  if(!discardDraft)return;var p=state.party[discardDraft.pIndex],entry=p&&p.bag[discardDraft.bagIndex],d=entry&&gear(entry.id);if(!p||!entry){closeDiscardModal();return}
  var units=Math.max(1,Number(entry.qty)||1),name=d?d.name:entry.id;
  $("discardObject").innerHTML=itemArt(entry.id,name)+'<span><b>'+esc(name+(entry.qty>1?" ×"+entry.qty:""))+'</b><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>Se perderá de forma permanente · libera '+units+' espacio'+(units===1?'':'s')+'</em></span>';
  $("discardWarning").textContent="¿Seguro que quieres botar "+name+(entry.qty>1?" ×"+entry.qty:"")+" de la mochila de "+p.name+"? Esta acción no se puede deshacer.";
}
function openDiscardModal(pIndex,bagIndex){
  if(battleState)return;var p=state.party[pIndex],entry=p&&p.bag[bagIndex];if(!p||!entry){toast("No se pudo abrir el descarte");return}
  closeTransferModal();discardDraft={pIndex:pIndex,bagIndex:bagIndex};$("discardModal").classList.remove("hidden");renderDiscardModal();$("cancelDiscard").focus()
}
function closeDiscardModal(){
  discardDraft=null;if($("discardModal"))$("discardModal").classList.add("hidden")
}
function confirmDiscardProfileItem(){
  if(!discardDraft)return;var p=state.party[discardDraft.pIndex],entry=p&&p.bag[discardDraft.bagIndex],d=entry&&gear(entry.id),qty=entry?Math.max(1,Number(entry.qty)||1):0,name=d?d.name:entry&&entry.id;if(!p||!entry){closeDiscardModal();return}
  p.bag.splice(discardDraft.bagIndex,1);save();renderMini();renderProfile(discardDraft.pIndex);if(state.refuge.active)renderRefuge();toast((name||"Objeto")+" ×"+qty+" descartado");closeDiscardModal()
}
function profileDisassembleAction(pIndex,bagIndex,entry){
  if(!eliasCanDisassemble()||!entry||!disassemblyRecipe(entry.id))return"";return'<button class="disassemble-btn" data-disassemble-profile="'+bagIndex+'">Desarmar</button>'
}
function lootDisassembleAction(dropIndex,drop){
  var looter=battleState&&state.party[battleState.looter];if(!looter||looter.id!=="elias"||!eliasCanDisassemble()||!drop||drop.status!=="pending"||!disassemblyRecipe(drop.id))return"";return'<button class="disassemble-btn" data-disassemble-loot="'+dropIndex+'">Desarmar</button>'
}
function disassemblySpaceWarning(source){
  var recipe=source&&disassemblyRecipe(source.id),need=rewardUnits(recipe),free=bagFree(elias()),credit=source&&source.type==="profile"&&source.pIndex===eliasIndex()?1:0;
  return"Elías necesita "+need+" espacios para guardar piezas y solo tiene "+(free+credit)+" disponible"+(free+credit===1?"":"s")+". Transfiere, descarta o equipa algo antes de desarmar."
}
function openDisassembly(source){
  var e=elias(),recipe=source&&disassemblyRecipe(source.id),d=source&&gear(source.id);if(!e||!eliasCanDisassemble()){toast("Elías necesita la habilidad Desarme fino");return}if(!recipe||!d){toast("Ese objeto no puede desarmarse");return}if(!canStoreDisassemblyRewards(source)){var msg=disassemblySpaceWarning(source);if(source.type==="loot"&&battleState){battleState.lootMessage=msg;renderLootModal(battleState.openLoot)}else toast(msg);return}
  closeTransferModal();closeDiscardModal();clearInterval(disassemblyTimer);var start=10+Math.floor(random()*60),width=recipe.window||16;disassemblyState={source:source,recipe:recipe,item:d,attempts:0,pos:Math.floor(random()*100),dir:1,targetStart:start,targetEnd:Math.min(92,start+width),finished:false,success:false,feedback:"Haz click cuando el pulso cruce la zona de calibración."};renderDisassemblyModal();$("disassemblyModal").classList.remove("hidden");$("disassemblyAttempt").focus();startDisassemblyMeter()
}
function openDisassemblyFromProfile(pIndex,bagIndex){
  if(battleState)return;var p=state.party[pIndex],entry=p&&p.bag[bagIndex];if(!entry){toast("No se pudo abrir el desarme");return}openDisassembly({type:"profile",pIndex:pIndex,bagIndex:bagIndex,id:entry.id})
}
function openDisassemblyFromLoot(dropIndex){
  if(!battleState||battleState.phase!=="loot")return;var e=battleState.enemies[battleState.openLoot],drop=e&&e.loot[dropIndex];if(!drop||drop.status!=="pending")return;openDisassembly({type:"loot",enemyIndex:battleState.openLoot,dropIndex:dropIndex,id:drop.id})
}
function renderDisassemblyModal(){
  if(!disassemblyState)return;var s=disassemblyState,d=s.item,rewards=rewardText(s.recipe),attempts=3-s.attempts,source=s.source.type==="loot"?"Botín de combate":"Mochila de "+state.party[s.source.pIndex].name;
  $("disassemblyTitle").textContent="Desarmar "+d.name;$("disassemblySource").textContent=source+" · "+s.recipe.difficulty;$("disassemblyItem").innerHTML=itemArt(s.source.id,d.name)+'<span><b>'+esc(d.name)+'</b><small>'+esc(d.desc)+'</small><em>Resultado posible: '+esc(rewards)+'</em></span>';$("disassemblyTarget").style.left=s.targetStart+"%";$("disassemblyTarget").style.width=Math.max(4,s.targetEnd-s.targetStart)+"%";$("disassemblyMarker").style.left=s.pos+"%";$("disassemblyAttempts").textContent=s.finished?(s.success?"Desarme completo":"Elemento destruido"):"Intentos restantes: "+attempts;$("disassemblyFeedback").textContent=s.feedback;$("disassemblyAttempt").classList.toggle("hidden",s.finished);$("closeDisassembly").classList.toggle("hidden",s.finished);$("disassemblyDone").classList.toggle("hidden",!s.finished);$("disassemblyRewards").innerHTML=s.finished?disassemblyRewardHtml(s):""
}
function startDisassemblyMeter(){
  clearInterval(disassemblyTimer);disassemblyTimer=setInterval(function(){if(!disassemblyState||disassemblyState.finished){clearInterval(disassemblyTimer);return}var s=disassemblyState;s.pos+=s.dir*(s.recipe.speed||2.4);if(s.pos>=100){s.pos=100;s.dir=-1}else if(s.pos<=0){s.pos=0;s.dir=1}var marker=$("disassemblyMarker");if(marker)marker.style.left=s.pos+"%"},24)
}
function disassemblyRewardHtml(s){
  if(!s.success)return'<div class="result-chip">Resultado<strong>Sin piezas útiles</strong></div>';return rewardList(s.recipe).map(function(x){var d=gear(x.id);return'<div class="result-chip">'+esc(d?d.name:resName(x.id))+'<strong>+'+x.qty+'</strong></div>'}).join("")+'<div class="result-chip">XP de Elías<strong>+6</strong></div>'
}
function consumeDisassemblySource(s){
  if(s.source.type==="profile"){var p=state.party[s.source.pIndex],entry=p&&p.bag[s.source.bagIndex];if(!entry||entry.id!==s.source.id)return false;entry.qty--;if(entry.qty<=0)p.bag.splice(s.source.bagIndex,1);return true}
  if(s.source.type==="loot"){var e=battleState&&battleState.enemies[s.source.enemyIndex],drop=e&&e.loot[s.source.dropIndex];if(!drop||drop.id!==s.source.id||drop.status!=="pending")return false;drop.status=s.success?"disassembled":"broken";return true}
  return false
}
function resolveDisassembly(success){
  if(!disassemblyState||disassemblyState.finished)return;var s=disassemblyState,e=elias();clearInterval(disassemblyTimer);s.finished=true;s.success=success;if(!consumeDisassemblySource(s)){s.feedback="El objeto ya no está disponible.";renderDisassemblyModal();return}
  if(success){rewardList(s.recipe).forEach(function(x){addToBag(e,x.id,x.qty);recordLoot(x.id,x.qty)});state.stats.disassembled++;state.stats.xpFromCrafting+=6;addPersonalXp(eliasIndex(),6,"desarmar "+s.item.name);s.feedback="Elías separa el núcleo sin romper la matriz. Las piezas quedan guardadas en su mochila."}else{state.stats.disassembleFailures++;s.feedback="La presión pasa el límite y el elemento queda inutilizable. No se recupera nada."}
  if(battleState&&s.source.type==="loot")battleState.lootTaken+=success?rewardUnits(s.recipe):0;save();renderMini();if(s.source.type==="profile"&&!state.refuge.active)render();if(!$("profileModal").classList.contains("hidden"))renderProfile(s.source.type==="profile"?s.source.pIndex:eliasIndex());if(battleState&&s.source.type==="loot")renderLootModal(s.source.enemyIndex);renderDisassemblyModal();$("disassemblyDone").focus()
}
function attemptDisassembly(){
  if(!disassemblyState||disassemblyState.finished)return;var s=disassemblyState,hit=s.pos>=s.targetStart&&s.pos<=s.targetEnd;if(hit){resolveDisassembly(true);return}s.attempts++;if(s.attempts>=3){resolveDisassembly(false);return}s.feedback="Fuera de rango. Elías estabiliza la pieza: quedan "+(3-s.attempts)+" intentos.";s.targetStart=clamp(s.targetStart+rand(-7,7),8,82);s.targetEnd=Math.min(94,s.targetStart+(s.recipe.window||16));renderDisassemblyModal()
}
function closeDisassemblyModal(){
  clearInterval(disassemblyTimer);disassemblyState=null;$("disassemblyModal").classList.add("hidden")
}
function openProfile(i){if(battleState)return;profileTab="inventory";psychPanelExpanded=false;renderProfile(i);$('profileModal').classList.remove('hidden');$('closeProfile').focus()}
function closeProfile(){closeTransferModal();closeDiscardModal();psychPanelExpanded=false;if(disassemblyState&&disassemblyState.source.type==="profile")closeDisassemblyModal();$('profileModal').classList.add('hidden');if(state.refuge.active)renderRefuge()}
function equipBagItem(pIndex,bagIndex){
  var p=state.party[pIndex],entry=p&&p.bag[bagIndex],d=entry&&gear(entry.id);if(!p||!entry||!canEquip(p,d)){toast("Ese superviviente no domina esa categoría");return}
  var old=p.equipment[d.slot],oldDur=d.slot==="head"||d.slot==="body"?gearDurability(p,d.slot):null,newDur=d.maxDurability?(Number.isFinite(Number(entry.durability))?Number(entry.durability):d.maxDurability):null,futureUsed=bagUsed(p)-1+(old?1:0);if(d.slot==="backpack"&&d.capacity<futureUsed){toast("La mochila nueva no puede contener la carga resultante");return}
  var nextId=entry.id;entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);if(old&&!addToBag(p,old,1,oldDur)){addToBag(p,nextId,1,newDur);toast("No hay espacio para guardar el equipo anterior");return}
  p.equipment[d.slot]=nextId;if(d.slot==="head"||d.slot==="body")p.durability[d.slot]=newDur;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast(d.name+" equipado por "+p.name)
}
function useProfileItem(pIndex,bagIndex){
  if(battleState)return;var p=state.party[pIndex],entry=p&&p.bag[bagIndex],id=entry&&entry.id;if(!p||!entry||!profileItemUsable(p,id)){toast("Ese objeto no puede utilizarse ahora");return}var message="",feedback;
  if(id==="food"){var beforeHunger=p.hunger;p.hunger=clamp(p.hunger+40,0,100);feedback={kind:"energy",from:beforeHunger,to:p.hunger,delta:p.hunger-beforeHunger};message=p.name+" recupera "+feedback.delta+" de energía"}
  else if(id==="stimulant"){var stimulantHp=p.hp,stimulantEnergy=p.hunger;p.hp=Math.min(p.maxHp,p.hp+10);p.hunger=clamp(p.hunger+30,0,100);feedback={kind:p.hp>stimulantHp?"hp":"energy",from:p.hp>stimulantHp?stimulantHp:stimulantEnergy,to:p.hp>stimulantHp?p.hp:p.hunger,delta:p.hp>stimulantHp?p.hp-stimulantHp:p.hunger-stimulantEnergy};recordHealing(p.hp-stimulantHp,true);message=p.name+" recupera "+(p.hp-stimulantHp)+" HP y "+(p.hunger-stimulantEnergy)+" de energía"}
  else{var before=p.hp,heal=id==="traumaKit"?54:id==="medkit"?40:id==="meds"?26:14;p.hp=Math.min(p.maxHp,p.hp+heal);if(id==="bandage")p.bleed=0;feedback={kind:"hp",from:before,to:p.hp,delta:p.hp-before};recordHealing(feedback.delta,true);message=p.name+" recupera "+feedback.delta+" HP"+(id==="bandage"?" y detiene el sangrado":"")}
  if(id==="food")playSfx("loadout-food");else playSfx("hp-medical-use");
  addStatItem("itemsUsed",id,1);
  entry.qty--;if(entry.qty<=0)p.bag.splice(bagIndex,1);save();renderMini();renderProfile(pIndex,feedback);if(state.refuge.active)renderRefuge();toast(message)
}
function transferBagItem(fromIndex,bagIndex,toIndex,qty){
  if(battleState)return false;var from=state.party[fromIndex],to=state.party[toIndex],entry=from&&from.bag[bagIndex],d=entry&&gear(entry.id),available=entry?Math.max(1,Number(entry.qty)||1):0,amount=Math.max(1,Math.floor(Number(qty)||1));if(!from||!to||!entry){toast("No se pudo transferir el objeto");renderProfile(fromIndex);return false}if(!d||!d.stack)amount=1;amount=Math.min(amount,available);if(bagFree(to)<amount){toast("La mochila de "+to.name+" solo tiene "+bagFree(to)+" espacio"+(bagFree(to)===1?"":"s"));renderProfile(fromIndex);if(transferDraft)renderTransferModal();return false}if(!addToBag(to,entry.id,amount,entry.durability)){toast("No se pudo transferir el objeto");return false}entry.qty-=amount;if(entry.qty<=0)from.bag.splice(bagIndex,1);playSfx("loadout-transfer");save();renderMini();renderProfile(fromIndex);if(state.refuge.active)renderRefuge();toast((d?d.name:entry.id)+" ×"+amount+" transferido a "+to.name);return true
}
function repairEquipment(pIndex,slot){
  if(battleState)return;var p=state.party[pIndex],d=p&&gear(p.equipment[slot]),cost=p&&repairCost(p,slot);if(!p||!d||!repairReady(p,slot)){toast("El taller no puede realizar esa reparación");return}for(var n=0;n<cost;n++)consumeStock("scrap",1);var before=gearDurability(p,slot);p.durability[slot]=Math.min(d.maxDurability,before+Math.ceil(d.maxDurability/2));state.engineeringUses--;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast("Elías repara "+d.name+": "+before+" → "+p.durability[slot])
}
function craftItem(pIndex,id){
  if(battleState)return;var p=state.party[pIndex],recipe=workshopRecipes.filter(function(x){return x.id===id&&p&&x.owner===p.id})[0],d=gear(id);if(!recipe||!canCraft(p,recipe)){toast("Faltan recursos, espacio, habilidad o acciones profesionales");return}var qty=Math.max(1,Number(recipe.qty)||1),xp=recipe.xp||8;Object.keys(recipe.cost).forEach(function(costId){for(var n=0;n<recipe.cost[costId];n++)consumeStock(costId,pIndex)});addToBag(p,id,qty);state.stats.crafts++;addStatItem("craftedItems",id,qty);state.stats.xpFromCrafting+=xp;var levels=addPersonalXp(pIndex,xp,"fabricar "+d.name);if(p.id==="sara")state.medicalUses--;else if(p.id==="noa")state.ordnanceUses--;else state.engineeringUses--;save();renderMini();renderProfile(pIndex);if(state.refuge.active)renderRefuge();toast((p.id==="sara"?"Sara prepara ":p.name+" fabrica ")+d.name+(qty>1?" ×"+qty:"")+" · +"+xp+" XP"+(levels.length?" · "+levels[0]:""))
}
function reason(c){
  var k;if(c.req){for(k in c.req)if(stockCount(k)<c.req[k])return"Falta "+resName(k).toLowerCase()}
  if(c.reqItems){for(k=0;k<c.reqItems.length;k++)if(!hasPartyItem(c.reqItems[k])){var missing=gear(c.reqItems[k]);return"Falta "+(missing?missing.name.toLowerCase():"un objeto")}}
  if(c.reqAny&&!c.reqAny.some(function(x){return hasPartyItem(x)}))return"Falta tecnología";
  if(c.reqFlags&&!c.reqFlags.some(function(x){return !!state.flags[x]}))return"Ruta no descubierta";
  return""
}
function choiceHintText(c,why){var preview=!why&&psychPreview(c);return(why||c.hint||"Sin costo inmediato")+(preview?" · "+preview:"")}
function decisionPsycheBonus(c){
  if(!c||!c.roll)return 0;var axis=psychAxisForText([c.label,c.hint,c.cost].join(" ")),bonus=psychCheckBonusForAxis(axis);return clamp(bonus,-2,2)
}
function apply(o){
  var changes=[];Object.keys(o.fx||{}).forEach(function(k){var v=o.fx[k];if(k==="threat"){state.threat=clamp(state.threat+v,0,100);changes.push(["Amenaza",v>0?"+"+v:String(v)])}else if(k==="morale"){state.morale=clamp(state.morale+v,0,100);changes.push(["Moral",v>0?"+"+v:String(v)])}else if(k==="water"){state.res.water=Math.max(0,state.res.water+v);changes.push(["Agua",v>0?"+"+v:String(v)])}else{var id=k==="ammo"?"ammo9":k,qty=Math.abs(v)*(k==="ammo"?4:1);if(v>0)placePartyItem(id,qty);else removePartyItem(id,qty);changes.push([resName(k),v>0?"+"+qty:String(-qty)])}});
  (o.add||[]).forEach(function(x){if(!hasPartyItem(x))placePartyItem(x,1)});(o.remove||[]).forEach(function(x){removePartyItem(x,1)});pushUnique(state.docs,o.archive);Object.assign(state.flags,o.flags||{});
  (o.add||[]).forEach(function(x){var d=gear(x);if(items[x]||d)changes.push(["Objeto",items[x]?items[x][1]:d.name])});(o.archive||[]).forEach(function(x){if(archives[x])changes.push(["Archivo",archives[x][0]])});return changes.concat(applyPsychImpulse(o,npcDialogueState&&npcDialogueState.dialogue)).slice(0,6)
}
function contextualDialogueFor(choice,out){
  var flags=Object.assign({},choice&&choice.flags||{},out&&out.flags||{});if(flags.knowsExiles||flags.partyOwnsTruth)return branchDialogueDefs.varelaArchives;if(flags.huntersTrust)return branchDialogueDefs.rosaWater;if(flags.merodeadorParley)return branchDialogueDefs.liraBorder;if(flags.savedMatias)return branchDialogueDefs.matiasSaved;if(flags.leftSupplies)return branchDialogueDefs.matiasLeft;if(flags.sparedDrone)return branchDialogueDefs.unit7Protocol;if(flags.alamedaClear)return branchDialogueDefs.unit12Sweep;if(flags.trackerCredential)return branchDialogueDefs.trackerCredential;if(flags.savedMerodeadora)return branchDialogueDefs.liraWounded;if(flags.fooledHunters||flags.huntersAlliance||flags.soldRefuge||flags.veraFinalPact)return branchDialogueDefs.veraRoutePrice;if(flags.purpleLineBypassed)return branchDialogueDefs.ortegaLine;if(flags.fullBroadcast)return branchDialogueDefs.operatorLive;if(flags.carryTruth)return branchDialogueDefs.operatorDisconnect;return null
}

function choose(i){
  if(pending||battleState)return;var ev=events[state.index],c=ev.choices[i];if(!c||reason(c))return;
  drainHunger(4);
  if(c.combat){startCombat(c.combat,c);return}
  var out=c,roll=null,check=c.roll;if(c.roll){roll=d20();check=Object.assign({},c.roll,{bonus:(c.roll.bonus||0)+decisionPsycheBonus(c)});out=roll+(check.bonus||0)>=check.dc?c.roll.success:c.roll.fail}
  completeChoice(c,out,roll,check)
}
function completeChoice(choice,out,roll,check,extra){
  var ev=events[state.index],changes=(extra||[]).concat(apply(out)),factionReward=storyDecisionBenefit(out)?1:0,missionChanges=checkMissions();if(factionReward)changes=awardFactionPoints(factionReward,"decisión con impacto").concat(changes);changes=missionChanges.concat(changes);if(choice.ending)state.ending=choice.ending;
  state.history.push({day:ev.day,loc:ev.loc,choice:choice.label,result:out.title||choice.title,faction:factionReward});pending={ending:choice.ending||null,returnToRefuge:null,dialogue:contextualDialogueFor(choice,out),dialogueSeen:false};
  if(state.morale<=0&&!choice.ending){pending.returnToRefuge="morale";changes.unshift(["Cohesión","Regreso obligatorio al refugio"])}
  showResult(out.title||choice.title,out.result||choice.result,changes,roll,check);render();save()
}
function showResult(title,text,changes,roll,check){
  $("resultKicker").textContent=roll===null?"Consecuencia":"Prueba · Dificultad "+check.dc;
  $("resultTitle").textContent=title;$("resultText").textContent=text;$("roll").classList.toggle("hidden",roll===null);
  if(roll!==null)$("rollValue").textContent=check.bonus?roll+"+"+check.bonus:roll;
  $("resultChanges").innerHTML=(changes.length?changes:[["Registro","Actualizado"]]).slice(0,6).map(function(x){return'<div class="result-chip">'+esc(x[0])+"<strong>"+esc(x[1])+"</strong></div>"}).join("");
  $("result").classList.remove("hidden");$("advance").focus()
}
function npcDef(input){return typeof input==="string"?npcDialogueDefs[input]||{}:input||{}}
function splitDialogueText(text){
  var clean=String(text||"").trim(),sentences=clean.match(/[^.!?。»]+[.!?。»]+|[^.!?。»]+$/g)||[clean],out=["","",""],i;
  sentences.forEach(function(sentence,index){out[Math.min(2,Math.floor(index*3/Math.max(1,sentences.length)))]+=(out[Math.min(2,Math.floor(index*3/Math.max(1,sentences.length)))]?" ":"")+sentence.trim()});
  for(i=0;i<3;i++)if(!out[i])out[i]=clean;
  return out.map(function(line){return line.trim()}).slice(0,3)
}
function dialogueNode(dialogue,nodeId){return dialogue&&dialogue.nodes?(dialogue.nodes[nodeId]||dialogue.nodes[dialogue.start]||dialogue.nodes.start||dialogue):dialogue}
function dialogueLines(dialogue,node){node=node||dialogue;var lines=Array.isArray(node.lines)?node.lines.filter(function(line){return String(line||"").trim()}):splitDialogueText(node.text||dialogue.text);return(lines.length?lines:[node.text||dialogue.text||"..."]).slice(0,3)}
function updateNpcDialogueKicker(){
  if(!npcDialogueState)return;var total=npcDialogueState.lines.length,base=npcDialogueState.kicker||"Conversación",step=npcDialogueState.nodeCount||1;$("npcDialogueKicker").textContent=base+" · intercambio "+step+" · "+(npcDialogueState.lineIndex+1)+"/"+total
}
function showNpcDialogueChoices(){
  $("npcDialogueChoices").classList.remove("hidden");var first=$("npcDialogueChoices").querySelector("button:not(:disabled)");if(first)first.focus();else $("dialogueContinueRow").classList.remove("hidden")
}
function revealNpcDialogueText(){
  if(!npcDialogueState)return;clearInterval(npcDialogueTimer);npcDialogueTimer=null;$("npcDialogueText").textContent=npcDialogueState.text;if(npcDialogueState.lineIndex>=npcDialogueState.lines.length-1)showNpcDialogueChoices();else $("dialogueSkip").focus()
}
function typeNpcDialogue(){
  var text=npcDialogueState?npcDialogueState.text:"",i=0;clearInterval(npcDialogueTimer);updateNpcDialogueKicker();$("npcDialogueText").textContent="";$("npcDialogueChoices").classList.add("hidden");$("dialogueChanges").classList.add("hidden");$("dialogueContinueRow").classList.add("hidden");npcDialogueTimer=setInterval(function(){if(!npcDialogueState){clearInterval(npcDialogueTimer);npcDialogueTimer=null;return}i+=2;$("npcDialogueText").textContent=text.slice(0,i);if(i>=text.length)revealNpcDialogueText()},22)
}
function advanceNpcDialogueText(){
  if(!npcDialogueState)return;if(npcDialogueTimer){revealNpcDialogueText();return}if(npcDialogueState.lineIndex<npcDialogueState.lines.length-1){npcDialogueState.lineIndex++;npcDialogueState.text=npcDialogueState.lines[npcDialogueState.lineIndex];typeNpcDialogue();return}showNpcDialogueChoices()
}
function renderNpcDialogueChoices(){
  var choices=$("npcDialogueChoices"),options=npcDialogueState.options||[];choices.innerHTML=options.map(function(opt,i){var block=reason(opt),hint=choiceHintText(opt,block),action=block||opt.cost||(opt.combat?"Responder":"Elegir");return'<button class="npc-dialogue-choice" data-dialogue-choice="'+i+'" '+(block?"disabled":"")+'><strong>'+esc(opt.label)+'</strong><em>'+esc(action)+'</em><small>'+esc(hint)+'</small></button>'}).join("");
  Array.prototype.forEach.call(choices.querySelectorAll("[data-dialogue-choice]"),function(b){b.addEventListener("click",function(){selectNpcDialogueChoice(Number(b.dataset.dialogueChoice))})})
}
function setNpcDialogueNode(nodeId){
  if(!npcDialogueState)return;var dialogue=npcDialogueState.dialogue,node=dialogueNode(dialogue,nodeId);npcDialogueState.nodeId=nodeId;npcDialogueState.nodeCount=(npcDialogueState.nodeCount||0)+1;npcDialogueState.lines=dialogueLines(dialogue,node);npcDialogueState.lineIndex=0;npcDialogueState.text=npcDialogueState.lines[0];npcDialogueState.options=node.options||[];renderNpcDialogueChoices();typeNpcDialogue()
}
function openNpcDialogue(dialogue){
  var npc=npcDef(dialogue.npc),start=dialogue.start||"start";npcDialogueState={dialogue:dialogue,npc:npc,kicker:dialogue.kicker||"Conversación",nodeId:start,nodeCount:0,lines:[],lineIndex:0,text:"",options:[],changes:[],selected:false};
  $("result").classList.add("hidden");$("npcDialogueKicker").textContent=dialogue.kicker||"Conversación";$("npcDialogueName").textContent=npc.name||"Contacto";$("npcDialogueRole").textContent=npc.role||"";$("npcDialoguePortrait").src=assetUrl(npc.portrait||"portraits/noa.webp");$("npcDialoguePortrait").alt=npc.name||"NPC";$("npcDialogueModal").classList.remove("hidden");$("dialogueSkip").focus();setNpcDialogueNode(start)
}
function recordDialogueChoice(opt,factionReward){
  var last=state.history[state.history.length-1],name=npcDialogueState&&npcDialogueState.npc&&npcDialogueState.npc.name||"NPC";if(last){last.dialogue=(last.dialogue?last.dialogue+" / ":"")+name+": "+opt.label;last.faction=(last.faction||0)+(factionReward||0)}
}
function closeNpcDialogueForCombat(opt){
  var combatChoice=Object.assign({title:opt.label,result:"La conversación se quiebra antes de que alguien pueda ordenar la escena."},opt);clearInterval(npcDialogueTimer);npcDialogueTimer=null;recordDialogueChoice(opt,0);npcDialogueState=null;$("npcDialogueModal").classList.add("hidden");$("result").classList.add("hidden");pending=null;startCombat(opt.combat,combatChoice)
}
function selectNpcDialogueChoice(i){
  if(!npcDialogueState)return;if(npcDialogueTimer){revealNpcDialogueText();return}var opt=npcDialogueState.options[i];if(!opt||reason(opt))return;if(opt.combat){closeNpcDialogueForCombat(opt);return}
  var terminal=!opt.next,changes=apply(opt),factionReward=terminal&&storyDecisionBenefit(opt)?1:0,missionChanges=checkMissions();if(factionReward)changes=awardFactionPoints(factionReward,"diálogo").concat(changes);changes=missionChanges.concat(changes);recordDialogueChoice(opt,factionReward);npcDialogueState.changes=(npcDialogueState.changes||[]).concat(changes);if(state.morale<=0&&pending&&!pending.ending){pending.returnToRefuge="morale";changes.unshift(["Cohesión","Regreso obligatorio al refugio"])}
  renderMini();save();if(opt.next){setNpcDialogueNode(opt.next);return}
  changes=(npcDialogueState.changes.length?npcDialogueState.changes:changes).slice(-6);$("npcDialogueChoices").classList.add("hidden");$("dialogueChanges").innerHTML=(changes.length?changes:[["Registro","Conversación guardada"]]).slice(0,6).map(function(x){return'<div class="result-chip">'+esc(x[0])+"<strong>"+esc(x[1])+"</strong></div>"}).join("");$("dialogueChanges").classList.remove("hidden");$("dialogueContinueRow").classList.remove("hidden");$("dialogueContinue").focus()
}
function continuePendingAdvance(){
  var ending=pending.ending,returnToRefuge=pending.returnToRefuge;pending=null;if(ending){finish(ending);return}
  var oldDay=events[state.index].day;state.index++;if(returnToRefuge){openRefuge(returnToRefuge);return}if(events[state.index].day!==oldDay){night(oldDay)}else{save();render()}
}
function closeNpcDialogueAndContinue(){
  if(!npcDialogueState)return;if(npcDialogueTimer){revealNpcDialogueText();return}clearInterval(npcDialogueTimer);npcDialogueTimer=null;npcDialogueState=null;$("npcDialogueModal").classList.add("hidden");if(pending)continuePendingAdvance()
}
function advance(){
  if(!pending)return;setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);$("result").classList.add("hidden");if(pending.dialogue&&!pending.dialogueSeen){pending.dialogueSeen=true;openNpcDialogue(pending.dialogue);save();return}continuePendingAdvance()
}
function night(day){
  var hadFood=stockCount("food")>0,hadWater=stockCount("water")>0;if(hadFood){consumeStock("food");addStatItem("itemsUsed","food",1)}if(hadWater)consumeStock("water");var penalty=(hadFood?0:5)+(hadWater?0:8);state.morale=clamp(state.morale-penalty,0,100);state.engineeringUses=3;state.medicalUses=3;state.ordnanceUses=3;
  var recovered=0;state.party.forEach(function(p){var before=p.hp;p.hp=Math.min(p.maxHp,p.hp>0?p.hp+8:12);recovered+=p.hp-before;p.hunger=clamp(p.hunger+(hadFood?24:-8),0,100);p.guard=0;p.bleed=0});relaxPsyche(hadFood&&hadWater?2:1,hadFood&&hadWater?1:0);state.stats.rests++;state.stats.restHpRecovered+=recovered;state.stats.hpRestored+=recovered;
  $("nightTitle").textContent=day===1?"La noche bajo Los Héroes":"La última noche del refugio";
  $("nightText").textContent=penalty?"El grupo cura sus heridas, pero la falta de suministros convierte cada decisión en una discusión.":"El grupo comparte una ración, atiende sus heridas y ordena la información. Afuera, la Red UNO continúa buscando la señal.";
  $("nightChanges").innerHTML=[["Alimento común",hadFood?"−1":"Agotado"],["Energía",hadFood?"+24":"−8"],["Recuperación","+8 HP"],["Pulso mental",hadFood&&hadWater?"Tensión −2 · decisión +1":"Tensión −1"],["Talleres profesionales","3 acciones"]].map(function(x){return'<div class="result-chip">'+x[0]+"<strong>"+x[1]+"</strong></div>"}).join("");
  $("night").classList.remove("hidden");save();render()
}
function completedMissionCount(){return missionDefs.filter(function(def){return !def.main&&missionProgress(def)>=def.target}).length}
function endingTier(kind){
  if(kind==="trade"||state.morale<25||state.threat>=92)return{id:"bad",label:"Final malo"};
  if(kind==="broadcast"&&state.morale>=50&&state.threat<=82||kind==="return"&&state.morale>=70&&state.threat<=50)return{id:"good",label:"Final bueno"};
  return{id:"normal",label:"Final normal"}
}
function endingNarrative(kind,tierId){
  var choice={broadcast:"La verdad fue transmitida a todos los refugios.",return:"Los archivos fueron llevados al consejo de los Rotos.",trade:"Los archivos fueron negociados con los Cosechadores."}[kind]||"La expedición decidió el destino de los archivos.";
  var endings={
    good:{title:"La ciudad vuelve a contestar",lead:choice+" La expedición no solo regresó: cambió el equilibrio de NeoSantiago.",refuge:"El Andén 4 recibe información, rutas y pruebas suficientes para dejar de depender de la versión de la Red UNO. Mara distribuye copias y suministros entre varias familias; destruir un solo archivo ya no bastará para devolverlos al silencio.",group:"Sara, Elías y Noa regresan con heridas y desacuerdos, pero todavía confían entre sí. Sus decisiones los convierten en la primera patrulla capaz de volver a la superficie por voluntad propia y no por una orden del consejo.",world:"La señal se transforma en una red de voces. Refugios desconocidos responden, los merodeadores dejan de ser una historia simple y la Red UNO pierde el control absoluto de la memoria de Santiago. La siguiente expedición partirá hacia una ciudad despierta."},
    normal:{title:"Una verdad incompleta",lead:choice+" El refugio sobrevive, aunque el viaje deja preguntas y deudas que nadie puede resolver todavía.",refuge:"La Línea 1 gana tiempo y conserva parte de lo descubierto, pero las rutas quedaron expuestas y los recursos siguen siendo escasos. El consejo acepta preparar otra salida antes de decidir cuánto de la verdad puede soportar la comunidad.",group:"El grupo vuelve completo, pero no intacto. Las retiradas, los secretos y las decisiones difíciles cambian la relación entre Sara, Elías y Noa. Seguirán trabajando juntos porque todavía se necesitan, no porque estén de acuerdo.",world:"La Red UNO mantiene el control de gran parte de la superficie. Algunos refugios escucharon la señal y otros solo recibieron fragmentos. NeoSantiago conoce ahora una grieta en el sistema, pero aún no sabe si utilizarla para liberarse o para sobrevivir un día más."},
    bad:{title:"El precio del silencio",lead:choice+" La expedición termina, pero la verdad deja de pertenecer a quienes arriesgaron la vida para encontrarla.",refuge:"El Andén 4 recibe suministros y una calma temporal, pero queda atado a nuevas deudas. Mara comprende que el refugio sobrevivió esta vez a cambio de entregar rutas, nombres o poder de negociación a una fuerza externa.",group:"Sara, Elías y Noa regresan agotados y sin una versión común de lo ocurrido. Nadie murió, pero la confianza quedó quebrada. Cada uno conserva una parte distinta de la historia y teme lo que los otros podrían hacer con ella.",world:"La Red UNO conserva la ventaja mientras los Cosechadores convierten la información en mercancía. La señal se apaga, los demás refugios siguen aislados y NeoSantiago aprende que incluso la verdad puede ser utilizada como otra forma de control."}
  };return endings[tierId]
}
function calculateScore(kind,tierId){
  var s=state.stats,level=Math.max.apply(null,state.party.map(function(p){return p.level})),tierBonus={good:2000,normal:900,bad:0}[tierId]||0;
  return Math.max(0,Math.round(state.history.length*80+s.wins*650+s.enemies*180+s.loot*45+state.docs.length*180+completedMissionCount()*400+s.hits*28+s.criticals*140+s.damageDealt*3+level*220+s.skillsUnlocked*150+s.factionEarned*45+state.morale*9+(100-state.threat)*6+tierBonus-s.retreats*260))
}
function scoreRank(score){return score>=9000?"S":score>=7200?"A":score>=5600?"B":score>=4000?"C":"D"}
function namedItemList(bucket){return Object.keys(bucket||{}).filter(function(id){return bucket[id]>0}).sort(function(a,b){return bucket[b]-bucket[a]}).map(function(id){var d=gear(id);return{name:d?d.name:id,qty:bucket[id]}})}
function buildRunReport(){
  var tier=endingTier(state.ending),outcome=endingNarrative(state.ending,tier.id),score=calculateScore(state.ending,tier.id),s=state.stats;
  return{tier:tier,outcome:outcome,score:score,rank:scoreRank(score),combat:[["Combates ganados",s.wins+" / "+s.battles],["Golpes realizados",s.attacks],["Golpes acertados",s.hits],["Golpes fallados",s.misses],["Golpes críticos",s.criticals],["Balas utilizadas",s.shots],["Daño causado",s.damageDealt],["Daño recibido",s.damageTaken],["Enemigos neutralizados",s.enemies],["Aliados reanimados",s.revives]],survival:[["Medicina utilizada",s.medicineUsed],["HP recuperado",s.hpRestored],["Descansos",s.rests],["Retiradas",s.retreats],["Visitas al refugio",s.refugeVisits],["Cambios psicológicos",s.mentalShifts||0],["Trueques",s.trades],["Objetos fabricados",s.crafts],["XP por taller",s.xpFromCrafting]],exploration:[["Botín recuperado",s.loot],["Desarmes exitosos",s.disassembled||0],["Fallos de desarme",s.disassembleFailures||0],["Archivos descubiertos",state.docs.length],["Decisiones tomadas",state.history.length],["Pulso final",psychTeamLine()],["Misiones cumplidas",completedMissionCount()+" / 4"],["Puntos de facción ganados",s.factionEarned],["Habilidades adquiridas",s.skillsUnlocked],["Puntos sin gastar",state.factionPoints],["Moral final",state.morale+"%"],["Amenaza final",state.threat+"%"]],loot:namedItemList(s.lootItems),used:namedItemList(s.itemsUsed),crafted:namedItemList(s.craftedItems),decisions:state.history.slice()}
}
function animateScore(target){var step=0,total=32;function tick(){step++;var progress=step/total,eased=1-Math.pow(1-progress,3);$("finalScoreValue").textContent=Math.round(target*eased).toLocaleString("es-CL");if(step<total)setTimeout(tick,24)}tick()}
function finish(kind){
  state.finished=true;state.ending=kind;var tier=endingTier(kind),story=endingNarrative(kind,tier.id),score=calculateScore(kind,tier.id),level=Math.max.apply(null,state.party.map(function(p){return p.level}));state.finalTier=tier.id;state.score=score;
  playSfx(tier.id==="good"?"ending-good":tier.id==="bad"?"ending-bad":"ending-neutral");
  $("finalTier").textContent=tier.label;$("finalTier").className="ending-badge "+tier.id;$("finalTitle").textContent=story.title;$("finalText").textContent=story.lead;$("finalRefuge").textContent=story.refuge;$("finalGroup").textContent=story.group;$("finalWorld").textContent=story.world;$("finalRank").textContent="Rango "+scoreRank(score);$("finalStats").innerHTML=[["Moral",state.morale+"%"],["Amenaza",state.threat+"%"],["Combates",state.stats.wins+" / "+state.stats.battles],["Botín",state.stats.loot],["Misiones",completedMissionCount()+" / 4"],["Nivel máximo","Lvl. "+level]].map(function(x){return'<div class="result-chip">'+x[0]+"<strong>"+x[1]+"</strong></div>"}).join("");$("summary").classList.add("hidden");$("final").classList.remove("hidden");animateScore(score);save()
}
function metricSection(title,rows){return'<section class="summary-block"><h3>'+esc(title)+'</h3><div class="summary-metrics">'+rows.map(function(row){return'<div><span>'+esc(row[0])+'</span><b>'+esc(row[1])+'</b></div>'}).join("")+'</div></section>'}
function itemSummary(title,list){return'<section class="summary-block"><h3>'+esc(title)+'</h3><div class="summary-items">'+(list.length?list.map(function(item){return'<span><b>'+esc(item.qty)+'</b>'+esc(item.name)+'</span>'}).join(""):'<p class="empty">Sin registros en esta categoría.</p>')+'</div></section>'}
function showRunSummary(){
  if(!state.finished||!state.ending)return;var report=buildRunReport();$("final").classList.add("hidden");$("summaryTier").textContent=report.tier.label;$("summaryTier").className="ending-badge "+report.tier.id;$("summaryScore").textContent=report.score.toLocaleString("es-CL")+" puntos · Rango "+report.rank;$("summaryMetrics").innerHTML=metricSection("Combate",report.combat)+metricSection("Supervivencia",report.survival)+metricSection("Expedición",report.exploration);$("summaryInventory").innerHTML=itemSummary("Todo lo saqueado",report.loot)+itemSummary("Objetos utilizados",report.used)+itemSummary("Objetos fabricados",report.crafted);$("summaryDecisions").innerHTML=report.decisions.length?report.decisions.map(function(entry,i){return'<article><b>'+String(i+1).padStart(2,"0")+'</b><span><strong>Día '+entry.day+' · '+esc(entry.loc)+'</strong><small>'+esc(entry.choice)+' → '+esc(entry.result)+'</small></span></article>'}).join(""):'<p class="empty">No hay decisiones registradas.</p>';state.summarySeen=true;state.score=report.score;$("summary").classList.remove("hidden");save()
}
function canvasWrap(ctx,text,x,y,maxWidth,lineHeight,maxLines){var words=String(text).split(/\s+/),line="",lines=0;for(var i=0;i<words.length;i++){var test=line?line+" "+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;lines++;line=words[i];if(maxLines&&lines>=maxLines)return y}else line=test}if(line&&(!maxLines||lines<maxLines)){ctx.fillText(line,x,y);y+=lineHeight}return y}
function canvasHeading(ctx,title,y,color){ctx.fillStyle=color;ctx.font="700 24px Arial";ctx.fillText(title.toUpperCase(),90,y);ctx.fillStyle="rgba(255,255,255,.16)";ctx.fillRect(90,y+16,1420,2);return y+54}
function downloadResultPng(){
  if(!state.finished)return;var report=buildRunReport(),canvas=document.createElement("canvas"),lootRows=Math.max(report.loot.length,report.used.length,report.crafted.length),height=3100+report.decisions.length*100+Math.ceil(lootRows/2)*50;canvas.width=1600;canvas.height=height;var ctx=canvas.getContext("2d"),accent=report.tier.id==="good"?"#75d3d7":report.tier.id==="bad"?"#df4a4a":"#d9a15c",gradient=ctx.createLinearGradient(0,0,1600,height);gradient.addColorStop(0,"#07100f");gradient.addColorStop(.55,"#090d0c");gradient.addColorStop(1,"#030504");ctx.fillStyle=gradient;ctx.fillRect(0,0,1600,height);ctx.strokeStyle=accent;ctx.lineWidth=4;ctx.strokeRect(42,42,1516,height-84);ctx.fillStyle="#75d3d7";ctx.font="700 23px Arial";ctx.fillText("NEOSANTIAGO 2130 · REGISTRO DE EXPEDICIÓN",90,115);ctx.fillStyle=accent;ctx.font="800 32px Arial";ctx.fillText(report.tier.label.toUpperCase(),90,185);ctx.fillStyle="#f2bd73";ctx.font="800 66px Arial";ctx.fillText(report.outcome.title.toUpperCase(),90,270);ctx.fillStyle="#e7e2d8";ctx.font="700 54px Arial";ctx.fillText(report.score.toLocaleString("es-CL")+" PUNTOS",90,360);ctx.fillStyle=accent;ctx.font="800 88px Arial";ctx.textAlign="right";ctx.fillText("RANGO "+report.rank,1510,360);ctx.textAlign="left";ctx.fillStyle="#cfcac0";ctx.font="28px Georgia";var y=430;y=canvasWrap(ctx,report.outcome.lead,90,y,1420,42,4)+30;
  [["EL REFUGIO",report.outcome.refuge],["EL GRUPO",report.outcome.group],["NEOSANTIAGO",report.outcome.world]].forEach(function(section){ctx.fillStyle=accent;ctx.font="700 22px Arial";ctx.fillText(section[0],90,y);y+=38;ctx.fillStyle="#d9d5cc";ctx.font="25px Georgia";y=canvasWrap(ctx,section[1],90,y,1420,38,5)+22});
  y=canvasHeading(ctx,"Resumen de la partida",y+12,accent);var allMetrics=report.combat.concat(report.survival,report.exploration),cols=3,colWidth=470;allMetrics.forEach(function(row,i){var col=i%cols,rowIndex=Math.floor(i/cols),mx=90+col*colWidth,my=y+rowIndex*70;ctx.fillStyle="#8f9690";ctx.font="19px Arial";ctx.fillText(String(row[0]).toUpperCase(),mx,my);ctx.fillStyle="#f2bd73";ctx.font="700 30px Arial";ctx.fillText(String(row[1]),mx,my+34)});y+=Math.ceil(allMetrics.length/cols)*70+30;
  y=canvasHeading(ctx,"Inventario de la expedición",y,accent);var inventoryGroups=[["SAQUEADO",report.loot],["UTILIZADO",report.used],["FABRICADO",report.crafted]];inventoryGroups.forEach(function(group){ctx.fillStyle="#75d3d7";ctx.font="700 20px Arial";ctx.fillText(group[0],90,y);y+=32;ctx.fillStyle="#d9d5cc";ctx.font="22px Arial";var copy=group[1].length?group[1].map(function(item){return item.name+" ×"+item.qty}).join(" · "):"Sin registros";y=canvasWrap(ctx,copy,90,y,1420,34,6)+20});
  y=canvasHeading(ctx,"Cómo se dio la historia · decisiones",y+10,accent);ctx.font="21px Arial";report.decisions.forEach(function(entry,i){ctx.fillStyle=accent;ctx.fillText(String(i+1).padStart(2,"0"),90,y);ctx.fillStyle="#e7e2d8";ctx.font="700 21px Arial";ctx.fillText("DÍA "+entry.day+" · "+String(entry.loc).toUpperCase(),145,y);ctx.font="21px Arial";ctx.fillStyle="#bdb9b0";y=canvasWrap(ctx,entry.choice+" → "+entry.result,145,y+30,1365,30,2)+30});ctx.fillStyle="#75d3d7";ctx.font="700 19px Arial";ctx.fillText("FIN DE LA DEMO · PARTIDA GUARDADA EN TU DISPOSITIVO",90,height-92);
  function trigger(url,revoke){var link=document.createElement("a");link.href=url;link.download="NeoSantiago-2130-"+report.tier.id+"-"+report.score+"-puntos.png";document.body.appendChild(link);link.click();link.remove();if(revoke)setTimeout(function(){URL.revokeObjectURL(url)},800)}
  if(canvas.toBlob)canvas.toBlob(function(blob){if(blob)trigger(URL.createObjectURL(blob),true)},"image/png");else trigger(canvas.toDataURL("image/png"),false)
}

function startCombat(config,choice){
  var ev=events[state.index];state.party.forEach(function(p){p.guard=0});battleState={config:config,choice:choice,phase:"combat",round:1,actor:0,target:0,looter:null,lootTaken:0,acted:{},skillUsed:{},xpEarned:{},levelUps:[],busy:false,feedback:[],criticalFeedback:[],log:["Contacto en "+ev.loc+"."]};
  applyPsychImpulse(choice,null).forEach(function(change){battleState.log.push(change[0]+": "+change[1]+".")});
  state.party.forEach(function(p){var penalty=hungerPenalty(p);if(penalty)battleState.log.push(p.name+" entra fatigado por falta de energía: "+penalty+" a precisión.")});
  state.party.forEach(function(p){var mind=psychState(p);if(mind.name!=="Estable")battleState.log.push(p.name+" entra "+mind.name.toLowerCase()+": "+mind.effects+".")});
  var rosters=config.encounters&&config.encounters.length?config.encounters:config.enemies?[config.enemies]:[],roster=rosters[rand(0,rosters.length-1)]||[];
  battleState.enemies=roster.map(function(id,i){var d=enemyDefs[id];return{id:id+"-"+i,type:id,lootGroup:d.lootGroup||id,name:d.name,role:d.role,hp:d.hp,maxHp:d.hp,attack:d.attack.slice(),accuracy:d.accuracy,def:d.def,armor:d.armor,mechanical:d.mechanical,lootMs:d.lootMs,xp:d.xp,stun:0,looted:false,searching:false,progress:0,loot:[]}});
  battleState.log.push("Contacto confirmado: "+battleState.enemies.map(function(e){return e.name}).join(", ")+".");setSceneAmbience("ambience-battle",AUDIO_CROSSFADE_MS);
  battleState.actor=firstAvailableActor();$("battle").dataset.day=ev.day;$("battle").dataset.scene=sceneKeyForEvent(ev);$("battleTitle").textContent=config.title;$("battleBrief").textContent=config.brief;$("battle").classList.remove("hidden");$("itemTray").classList.add("hidden");if(beginActorTurn())renderBattle()
}
function firstAvailableActor(){for(var i=0;i<state.party.length;i++)if(state.party[i].hp>0&&!battleState.acted[i])return i;return-1}
function livingEnemies(){return battleState.enemies.filter(function(e){return e.hp>0})}
function selectedEnemy(){var alive=livingEnemies();if(!alive.length)return null;var e=battleState.enemies[battleState.target];if(!e||e.hp<=0){battleState.target=battleState.enemies.indexOf(alive[0]);e=alive[0]}return e}
function beginActorTurn(){
  var p=state.party[battleState.actor];if(!p)return false;if(p.bleed>0){var before=p.hp,index=battleState.actor;p.hp=Math.max(0,p.hp-2);state.stats.damageTaken+=before-p.hp;recordHp("ally",index,before,p.hp,p.maxHp);p.bleed--;battleState.log.push(p.name+" pierde 2 HP por sangrado.");if(p.hp<=0){battleState.acted[index]=true;settleLethal(function(){var next=firstAvailableActor();if(next<0){enemyPhase();return}battleState.actor=next;if(beginActorTurn())renderBattle()});return false}}return true
}
function statusHtml(tags){return'<div class="status-tags">'+(tags.length?tags.map(function(x){return'<span class="tag '+x[1]+'">'+esc(x[0])+'</span>'}).join(""):'<span class="tag">Estable</span>')+'</div>'}
function recordHp(side,index,from,to,max,damageSfx){
  if(!battleState||from===to)return;if(to>from)playSfx(from<=0&&side==="ally"?"hp-revive":"hp-heal");else if(to<=0)playSfx(side==="ally"?"hp-ally-down":"hp-enemy-down");else if(damageSfx==="none"){}else if(damageSfx)playRandomSfx(damageSfx);else playSfx(side==="ally"?"hp-ally-damage":"hp-enemy-damage");var fx=battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0];if(fx){fx.to=to;fx.delta+=to-from}else battleState.feedback.push({side:side,index:index,from:from,to:to,max:max,delta:to-from})
}
function hpFeedback(side,index){return battleState.feedback.filter(function(x){return x.side===side&&x.index===index})[0]||null}
function criticalFeedback(index){return battleState.criticalFeedback.filter(function(x){return x.index===index})[0]||null}
function recordCritical(index,pIndex){playSfx("combat-critical");battleState.criticalFeedback.push({index:index,pIndex:pIndex});state.stats.criticals++;addPersonalXp(pIndex,4,"un golpe crítico")}
function hpBar(hp,max,fx){var to=Math.round(100*hp/max);if(!fx)return'<span style="width:'+to+'%"></span>';var from=Math.round(100*fx.from/fx.max);return'<span class="hp-shift" style="--hp-from:'+from+'%;--hp-to:'+to+'%;width:'+to+'%"></span>'}
function hpFloat(fx){if(!fx)return"";var heal=fx.delta>0,amount=Math.abs(fx.delta);return'<span class="hp-float '+(heal?'heal':'damage')+'">'+(heal?'+':'−')+amount+' HP</span>'}
function lethalFeedback(){return battleState&&battleState.feedback.some(function(x){return x.to<=0})}
function settleLethal(next){
  var current=battleState;if(!current)return;current.busy=true;renderBattle();setTimeout(function(){if(battleState!==current)return;var alive=livingEnemies(),target=current.enemies[current.target];if(alive.length&&(!target||target.hp<=0))current.target=current.enemies.indexOf(alive[0]);renderBattle();setTimeout(function(){if(battleState===current){current.busy=false;next()}},160)},680)
}
function bagUsageBar(p){
  var used=bagUsed(p),capacity=bagCapacity(p),free=bagFree(p),pct=capacity?clamp(Math.round(100*used/capacity),0,100):100,mode=free<=0?"full":pct>=80?"warn":"";return'<div class="barline bagline '+mode+'" title="Mochila '+used+' de '+capacity+' espacios · '+pct+'% utilizado"><span>Moch</span><div class="bar bag"><span style="width:'+pct+'%"></span></div><b>'+pct+'%</b></div>'
}
function allyUnitHtml(p,i,lootPhase){
  var need=xpNeeded(p),xp=Math.round(100*p.xp/need),tags=[],fx=hpFeedback("ally",i),falling=p.hp<=0&&fx,selected=lootPhase&&battleState.looter===i,bagLine=lootPhase?bagUsageBar(p):"";
  var fatigue=hungerPenalty(p),weapon=weaponFor(p),mind=psychState(p);tags.push([mind.name,mind.tone]);if(p.hp<=0)tags.push(["Agotado","bad"]);if(p.bleed)tags.push(["Sangrado "+p.bleed,"bad"]);if(fatigue)tags.push([p.hunger<=10?"Energía crítica · −4":"Fatiga · precisión −2","bad"]);if(weaponAccuracyPenalty(p,weapon))tags.push(["Arma de fuego · precisión −2","bad"]);if(gear(p.equipment.head)&&gearDurability(p,"head")===0||gear(p.equipment.body)&&gearDurability(p,"body")===0)tags.push(["Equipo roto","bad"]);if(p.guard)tags.push(["Cobertura +"+p.guard,"good"]);if(!lootPhase&&i===battleState.actor&&p.hp>0)tags.push(["Actúa","good"]);if(lootPhase&&p.hp>0)tags.push([selected?"Saqueador":"Disponible",selected?"good":""]);
  var tag=lootPhase&&p.hp>0?"button":"article",attrs=lootPhase&&p.hp>0?' data-looter="'+i+'"':"";
  return'<'+tag+' class="unit '+(lootPhase?"loot-mode ":"")+(!lootPhase&&i===battleState.actor&&p.hp>0?"active ":"")+(lootPhase&&p.hp>0?"looter-choice ":"")+(selected?"looter-selected ":"")+(p.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal":"fx-damage"):"")+'"'+attrs+'>'+hpFloat(fx)+portraitArt("portraits/"+p.id+".webp",p.name,"ally-portrait-art")+'<div class="unit-info"><h3>'+esc(p.name)+'</h3><small>'+esc(p.role)+' · Lvl. '+p.level+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(p.hp,p.maxHp,fx)+'</div><b>'+p.hp+'/'+p.maxHp+'</b></div><div class="barline"><span>XP</span><div class="bar xp"><span style="width:'+xp+'%"></span></div><b>'+p.xp+'/'+need+'</b></div>'+bagLine+statusHtml(tags)+'</div></'+tag+'>'
}
function enemyUnitHtml(e,i,lootPhase){
  var tags=[],fx=hpFeedback("enemy",i),critical=criticalFeedback(i),falling=e.hp<=0&&fx;if(e.stun)tags.push(["Aturdido","bad"]);if(e.armor)tags.push(["Armadura "+e.armor,""]);
  var enemyPortrait=portraitArt("portraits/"+e.type+".webp",e.name,e.type==="drone"?"enemy-drone-art":"");
  if(lootPhase){var stateClass=e.looted?"looted":e.searching?"":"lootable",overlay=e.looted?'<span class="loot-done">REGISTRADO</span>':e.searching?'<div class="corpse-search"><b>Registrando <span id="lootProgressText-'+i+'">'+e.progress+'%</span></b><div class="search-track"><span id="lootProgressBar-'+i+'" style="width:'+e.progress+'%"></span></div></div>':'<span class="loot-call">SAQUEAR</span>';return'<button class="unit corpse '+stateClass+'" '+(!e.looted&&!e.searching?'data-loot-enemy="'+i+'"':'disabled')+'>'+overlay+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>Cuerpo sin señales vitales</small><div class="barline"><span>HP</span><div class="bar"><span style="width:0%"></span></div><b>0/'+e.maxHp+'</b></div>'+statusHtml([[e.looted?"Registrado":"Botín posible",e.looted?"":"good"]])+'</div></button>'}
  return'<button class="unit '+(i===battleState.target&&!falling?"target ":"")+(e.hp<=0?(falling?"dying ":"down "):"")+(fx?(fx.delta>0?"fx-heal ":"fx-damage "):"")+(critical?"critical-hit ":"")+'" data-target="'+i+'" '+(e.hp<=0?'disabled':'')+'>'+hpFloat(fx)+(critical?'<span class="critical-flash">GOLPE CRÍTICO<b>+4 XP · '+esc(state.party[critical.pIndex].name)+'</b></span>':"")+enemyPortrait+'<div class="unit-info"><h3>'+esc(e.name)+'</h3><small>'+esc(e.role)+'</small><div class="barline"><span>HP</span><div class="bar">'+hpBar(e.hp,e.maxHp,fx)+'</div><b>'+e.hp+'/'+e.maxHp+'</b></div>'+statusHtml(tags)+'</div></button>'
}
function combatItemUsable(p,kind,target){if(!p||bagQty(p,kind)<=0)return false;if(kind==="meds")return p.hp>0&&p.hp<p.maxHp;if(kind==="bandage")return p.hp>0&&(p.hp<p.maxHp||p.bleed>0);if(kind==="emp"||kind==="empMk2")return !!(target&&target.mechanical);return kind==="grenade"||kind==="grenadeMk2"}
function renderCombatItems(p,disabled){
  var target=selectedEnemy(),kinds=["meds","bandage","emp","empMk2","grenade","grenadeMk2"],carried=kinds.filter(function(kind){return bagQty(p,kind)>0});
  $("itemTray").innerHTML=carried.length?carried.map(function(kind){var d=gear(kind),usable=combatItemUsable(p,kind,target),art=d&&d.art?d.art:kind;return'<button class="item-action" data-combat-item="'+kind+'" '+(disabled||!usable?'disabled':'')+'>'+assetImage("items/"+art+".webp","","",34,34)+'<span>'+esc(d.name)+'</span><b>'+bagQty(p,kind)+'</b></button>'}).join(""):'<p class="empty">'+esc(p.name)+" no lleva objetos utilizables en su mochila.</p>";
  $("itemsToggle").disabled=disabled||!carried.length;Array.prototype.forEach.call(document.querySelectorAll("[data-combat-item]"),function(b){b.addEventListener("click",function(){useCombatItem(b.dataset.combatItem)})})
}
function renderBattle(){
  if(!battleState)return;var lootPhase=battleState.phase==="loot",actor=state.party[battleState.actor],disabled=lootPhase||battleState.busy||!actor||actor.hp<=0;
  $("battleRound").textContent=lootPhase?"Zona asegurada":"Ronda "+String(battleState.round).padStart(2,"0");$("turnLabel").textContent=lootPhase?(battleState.looter===null?"Elige quién saquea":"Saquea "+state.party[battleState.looter].name):(actor?"Turno de "+actor.name:"Respuesta enemiga");
  $("allyUnits").innerHTML=state.party.map(function(p,i){return allyUnitHtml(p,i,lootPhase)}).join("");
  $("enemyUnits").innerHTML=battleState.enemies.map(function(e,i){return enemyUnitHtml(e,i,lootPhase)}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-target]"),function(b){b.addEventListener("click",function(){battleState.target=Number(b.dataset.target);renderBattle()})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-looter]"),function(b){b.addEventListener("click",function(){selectLooter(Number(b.dataset.looter))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-loot-enemy]"),function(b){b.addEventListener("click",function(){beginLoot(Number(b.dataset.lootEnemy))})});
  Array.prototype.forEach.call(document.querySelectorAll("[data-action]"),function(b){var spent=b.dataset.action==="skill"&&battleState.skillUsed[battleState.actor];b.disabled=disabled||(b.dataset.action==="flee"&&!battleState.config.canFlee)||!!spent;b.title=spent?"Habilidad agotada en este combate":""});
  $("turnControls").classList.toggle("hidden",lootPhase);$("lootControls").classList.toggle("hidden",!lootPhase);$("finishLoot").disabled=lootPhase&&battleState.busy;if(lootPhase)$("lootInstruction").textContent=battleState.looter===null?"Selecciona un aliado con vida y después el cuerpo que registrará.":state.party[battleState.looter].name+" está listo. Puedes cambiar de saqueador antes de abrir otro cuerpo.";
  if(!lootPhase&&actor)renderCombatItems(actor,disabled);else $("itemsToggle").disabled=true;
  $("combatLog").innerHTML=battleState.log.slice(-7).map(function(x){return'<p>› '+esc(x)+'</p>'}).join("");$("combatLog").scrollTop=$("combatLog").scrollHeight;battleState.feedback=[];battleState.criticalFeedback=[]
}
function strike(enemy,damage,label,pIndex,critical){var dealt=Math.max(1,damage-enemy.armor),before=enemy.hp,index=battleState.enemies.indexOf(enemy);enemy.hp=Math.max(0,enemy.hp-dealt);var lethalHit=before>0&&enemy.hp<=0;state.stats.damageDealt+=before-enemy.hp;if(lethalHit&&!critical)playRandomSfx("combat-hit-normal");recordHp("enemy",index,before,enemy.hp,enemy.maxHp,critical||lethalHit?"none":"combat-hit-normal");if(before>0&&before-enemy.hp>0){state.stats.xpFromHits+=3;addPersonalXp(pIndex,3,"un impacto certero")}if(critical)recordCritical(index,pIndex);battleState.log.push(label+": "+dealt+" de daño a "+enemy.name+(critical?". Golpe crítico.":"."));if(before>0&&enemy.hp<=0){battleState.log.push(enemy.name+" queda fuera de combate.");state.stats.enemies++;addPersonalXp(pIndex,enemy.xp,"derribar a "+enemy.name);if(!livingEnemies().length)setSceneAmbience("ambience-battle-victory",AUDIO_CROSSFADE_MS)}}
function combatAction(type){
  if(!battleState||battleState.phase!=="combat"||battleState.busy)return;var p=state.party[battleState.actor],e=selectedEnemy();if(!p||p.hp<=0)return;
  if(type==="flee"){loseCombat(true);return}
  if(type==="defend"){state.stats.defends++;p.guard=8+p.level;battleState.log.push(p.name+" toma cobertura y prepara la respuesta.");endPlayerTurn();return}
  if(!e)return;
  if(type==="attack"){
    state.stats.attacks++;var w=weaponFor(p);if(w.ammo){if(!consumeFromBag(p,w.ammo)){battleState.log.push(p.name+" no tiene "+gear(w.ammo).name+" y cambia al cuchillo.");w=gear("knife")}else state.stats.shots++}var fatigue=hungerPenalty(p),training=weaponAccuracyPenalty(p,w),bonus=w.accuracy+p.level+fatigue+training+personalAccuracyBonus(p),roll=d20(),hit=roll+bonus>=e.def;if(hit){state.stats.hits++;var critical=roll===20,dmg=rand(w.damage[0],w.damage[1])+personalDamageBonus(p,e);if(critical)dmg=Math.floor(dmg*1.75);strike(e,dmg,p.name+" usa "+w.name,battleState.actor,critical)}else{state.stats.misses++;battleState.log.push(p.name+" falla con "+w.name+"."+(training?" Su falta de entrenamiento con armas de fuego reduce la precisión en 2.":"")+(fatigue?" La falta de energía reduce su precisión en "+Math.abs(fatigue)+".":""))}
  }else if(type==="skill"){
    if(battleState.skillUsed[battleState.actor]){toast("La habilidad ya fue utilizada en este combate");return}
    if(p.id==="sara"&&!state.party.some(function(a){return a.hp>0&&(a.hp<a.maxHp||a.bleed>0)})&&!(hasSkill(p,"sara_reanimate")&&state.party.some(function(a){return a.hp<=0}))){toast("Nadie necesita atención médica");return}
    battleState.skillUsed[battleState.actor]=true;state.stats.skillsUsed++;
    if(p.id==="sara"){var downed=hasSkill(p,"sara_reanimate")?state.party.filter(function(a){return a.hp<=0})[0]:null;if(downed){var reviveIndex=state.party.indexOf(downed);downed.hp=Math.min(downed.maxHp,14+psychHealingBonus(p));downed.hunger=Math.max(downed.hunger,20);downed.bleed=0;state.stats.revives++;recordHealing(downed.hp,false);recordHp("ally",reviveIndex,0,downed.hp,downed.maxHp);battleState.log.push("Sara activa Pulso de retorno: "+downed.name+" vuelve con "+downed.hp+" HP.")}else{var target=state.party.filter(function(a){return a.hp>0}).sort(function(a,b){return a.hp/a.maxHp-b.hp/b.maxHp})[0],heal=12+p.level*2+(hasSkill(p,"sara_fieldcare")?4:0)+psychHealingBonus(p),before=target.hp;target.hp=Math.min(target.maxHp,target.hp+heal);target.bleed=0;if(hasSkill(p,"sara_triage"))state.party.forEach(function(a){a.bleed=0});recordHealing(target.hp-before,false);recordHp("ally",state.party.indexOf(target),before,target.hp,target.maxHp);battleState.log.push("Sara atiende a "+target.name+": +"+(target.hp-before)+" HP"+(hasSkill(p,"sara_triage")?" y estabiliza el sangrado del grupo.":"."))}}
    else if(p.id==="elias"&&e.mechanical&&bagQty(p,"battery")>0){state.stats.attacks++;state.stats.hits++;consumeFromBag(p,"battery");addStatItem("itemsUsed","battery",1);e.stun=hasSkill(p,"elias_overcharge")?2:1;strike(e,(hasSkill(p,"elias_overcharge")?24:16)+p.level*2,"Elías descarga una batería EMP",battleState.actor,false)}
    else if(p.id==="elias"){state.stats.attacks++;var techFatigue=hungerPenalty(p),techRoll=d20(),techCritical=techRoll===20;if(techRoll+3+p.level+techFatigue>=e.def){state.stats.hits++;strike(e,Math.floor((10+p.level)*(techCritical?1.75:1)),"Elías encuentra un punto débil",battleState.actor,techCritical)}else{state.stats.misses++;battleState.log.push("Elías no logra abrir la defensa de "+e.name+"."+(techFatigue?" La fatiga afecta su pulso.":""))}}
    else{state.stats.attacks++;var precision=weaponFor(p),hasAmmo=!precision.ammo||consumeFromBag(p,precision.ammo),skillWeapon=hasAmmo?precision:gear("knife"),skillFatigue=hungerPenalty(p),skillRoll=d20(),skillCritical=skillRoll===20,skillBonus=skillWeapon.accuracy+p.level+2+skillFatigue+personalAccuracyBonus(p),skillDamage=(hasAmmo?14:8)+p.level+rand(0,4)+personalDamageBonus(p,e);if(precision.ammo&&hasAmmo)state.stats.shots++;if(skillRoll+skillBonus>=e.def){state.stats.hits++;strike(e,Math.floor(skillDamage*(skillCritical?1.75:1)),hasAmmo?"Noa ejecuta un disparo preciso con "+precision.name:"Noa cambia al cuchillo",battleState.actor,skillCritical)}else{state.stats.misses++;battleState.log.push("Noa falla su ataque preciso contra "+e.name+"."+(skillFatigue?" La fatiga desvía su ataque.":""))}}
  }
  if(lethalFeedback()){settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});return}endPlayerTurn()
}
function endPlayerTurn(){
  if(!battleState)return;$("itemTray").classList.add("hidden");battleState.acted[battleState.actor]=true;var next=firstAvailableActor();if(next>=0){battleState.actor=next;if(beginActorTurn())renderBattle();return}enemyPhase()
}
function enemyPhase(){
  if(!battleState)return;battleState.busy=true;livingEnemies().forEach(function(e){
    if(e.stun){e.stun=Math.max(0,e.stun-1);battleState.log.push(e.name+" pierde el turno por la descarga EMP.");return}
    var live=state.party.filter(function(p){return p.hp>0});if(!live.length)return;var weakest=live.slice().sort(function(a,b){return a.hp/a.maxHp-b.hp/b.maxHp})[0],target=random()<.3?weakest:live[rand(0,live.length-1)],index=state.party.indexOf(target),attackRoll=d20(),hit=attackRoll+(e.accuracy||0)>=11;if(!hit){battleState.log.push(e.name+" falla su ataque contra "+target.name+".");return}var before=target.hp,raw=rand(e.attack[0],e.attack[1])+(attackRoll===20?3:0),cover=target.guard||0,armor=Math.max(0,gearDefense(target)+psychDefenseBonus(target)),armorBlocked=Math.min(raw,armor),coverBlocked=Math.min(cover,Math.max(0,raw-armorBlocked)),blocked=armorBlocked+coverBlocked,damage=Math.max(0,raw-blocked);target.guard=Math.max(0,cover-coverBlocked);target.hp=Math.max(0,target.hp-damage);var lethalAllyHit=before>0&&target.hp<=0;state.stats.damageTaken+=before-target.hp;if(lethalAllyHit&&attackRoll!==20)playRandomSfx("combat-enemy-hit-normal");recordHp("ally",index,before,target.hp,target.maxHp,attackRoll===20||lethalAllyHit?"none":"combat-enemy-hit-normal");if(attackRoll===20)playSfx("combat-critical");battleState.log.push(e.name+" ataca a "+target.name+": "+damage+" de daño recibido."+(attackRoll===20?" Golpe crítico.":""));if(blocked)battleState.log.push(target.name+" bloquea "+blocked+" entre cobertura, equipo y pulso mental.");if(armor>0&&damage>0)damageArmor(target,attackRoll===20?2:1);if(e.lootGroup==="merodeador"&&damage>=4&&target.hp>0&&random()<.24){target.bleed=2;battleState.log.push(target.name+" comienza a sangrar.")}
  });
  var continueRound=function(){if(!state.party.some(function(p){return p.hp>0})){loseCombat(false);return}battleState.round++;battleState.acted={};battleState.actor=firstAvailableActor();battleState.busy=false;if(beginActorTurn())renderBattle()};if(lethalFeedback()){settleLethal(continueRound);return}continueRound()
}
function beginLootPhase(){
  if(!battleState)return;battleState.phase="loot";setSceneAmbience("ambience-battle-victory",AUDIO_CROSSFADE_MS);battleState.busy=false;battleState.looter=null;battleState.feedback=[];battleState.log.push("No quedan hostiles. Selecciona quién registrará los cuerpos.");$("itemTray").classList.add("hidden");renderBattle()
}
function selectLooter(i){if(!battleState||battleState.phase!=="loot"||battleState.busy||!state.party[i]||state.party[i].hp<=0)return;battleState.looter=i;battleState.log.push(state.party[i].name+" se prepara para saquear.");renderBattle()}
function addLootDrop(list,id,qty){var found=list.filter(function(x){return x.id===id})[0];if(found)found.qty+=qty;else list.push({id:id,qty:qty,status:"pending"})}
function generateLoot(enemy){
  var group=enemy.lootGroup||enemy.type,out=[];if(group==="merodeador"){addLootDrop(out,"cloth",rand(1,2));addLootDrop(out,"scrap",rand(1,2));if(random()<.36)addLootDrop(out,"ammo9",rand(1,2));if(random()<.12)addLootDrop(out,"shell12",1);if(random()<.24)addLootDrop(out,"food",1);if(random()<.14)addLootDrop(out,"bandage",1);if(random()<.10)addLootDrop(out,"knife",1);if(random()<.06)addLootDrop(out,"crowbar",1);if(random()<.04)addLootDrop(out,"revolver",1);if(random()<.025){addLootDrop(out,"shotgun12",1);addLootDrop(out,"shell12",rand(1,2))}if(random()<.018)addLootDrop(out,"grenade",1)}
  else if(group==="drone"){addLootDrop(out,"electronics",rand(1,2));addLootDrop(out,"scrap",1);if(random()<.38)addLootDrop(out,"pulseCore",1);if(random()<.22)addLootDrop(out,"battery",1)}
  else{addLootDrop(out,"scrap",rand(1,2));addLootDrop(out,"electronics",1);if(random()<.20)addLootDrop(out,"pulseCore",1);if(random()<.34)addLootDrop(out,"ammo556",rand(1,2));if(random()<.18)addLootDrop(out,"ammo9",rand(1,2));if(random()<.14)addLootDrop(out,"shell12",1);if(random()<.16)addLootDrop(out,random()<.25?"meds":"bandage",1);if(random()<.08)addLootDrop(out,random()<.45?"pistol9":random()<.75?"rifle556":"shotgun12",1);if(random()<.045)addLootDrop(out,random()<.5?"helmetRiot":"vestTactical",1);if(random()<.02)addLootDrop(out,"grenade",1)}return out
}
function beginLoot(i){
  if(!battleState||battleState.phase!=="loot"||battleState.busy)return;if(battleState.looter===null){toast("Primero selecciona quién saquea");return}var e=battleState.enemies[i];if(!e||e.looted||e.searching)return;
  e.searching=true;e.progress=0;battleState.busy=true;battleState.log.push(state.party[battleState.looter].name+" registra a "+e.name+".");renderBattle();startLoopSfx("loot-loop",220);var step=Math.max(2,Math.round(10000/e.lootMs));clearInterval(lootInterval);lootInterval=setInterval(function(){if(!battleState||battleState.phase!=="loot")return;e.progress=Math.min(96,e.progress+step);var bar=$("lootProgressBar-"+i),label=$("lootProgressText-"+i);if(bar)bar.style.width=e.progress+"%";if(label)label.textContent=e.progress+"%"},100);
  setTimeout(function(){if(!battleState||battleState.phase!=="loot"){stopLoopSfx("loot-loop",160);return}clearInterval(lootInterval);stopLoopSfx("loot-loop",180);e.progress=100;e.searching=false;e.looted=true;e.loot=generateLoot(e);battleState.lootMessage="";battleState.busy=false;playSfx("loot-found");renderBattle();renderLootModal(i)},e.lootMs)
}
function pendingLootUnits(loot){return(loot||[]).reduce(function(sum,drop){return sum+(drop.status==="pending"?Math.max(1,Number(drop.qty)||1):0)},0)}
function canTakeAllLoot(p,loot){
  var pending=pendingLootUnits(loot);return !!(p&&pending>0&&pending<=bagFree(p))
}
function renderLootModal(enemyIndex){
  if(!battleState)return;var e=battleState.enemies[enemyIndex],p=state.party[battleState.looter],used=bagUsed(p),capacity=bagCapacity(p),free=bagFree(p),percent=Math.round(100*used/capacity),pending=pendingLootUnits(e.loot);battleState.openLoot=enemyIndex;$("lootTitle").textContent=e.name+" · botín";$("lootOwner").textContent=p.name+" registra el cuerpo";$("lootCapacityText").textContent=used+" / "+capacity+" espacios ocupados";$("lootCapacityPercent").textContent=percent+"%";$("lootCapacityBar").style.width=percent+"%";$("lootCapacity").classList.toggle("full",free===0);$("lootGuidance").textContent=pending>free?"No cabe todo el botín. Selecciona cada uno de los objetos que quieres llevar.":"Selecciona los objetos que quieres llevar o recoge todo el botín disponible.";$("lootMessage").textContent=battleState.lootMessage||"";$("lootMessage").classList.toggle("hidden",!battleState.lootMessage);
  $("lootItems").innerHTML=e.loot.map(function(drop,i){var d=gear(drop.id),done=drop.status!=="pending",units=Math.max(1,Number(drop.qty)||1),dis=lootDisassembleAction(i,drop),status=drop.status==="disassembled"?"Desarmado por Elías":drop.status==="broken"?"Elemento roto":"Ocupa "+units+" espacio"+(units===1?'':'s');return'<article class="loot-drop '+(done?drop.status:"")+'">'+itemArt(drop.id,d&&d.name)+'<span class="loot-drop-copy"><strong>'+esc((d?d.name:drop.id)+(drop.qty>1?" ×"+drop.qty:""))+'</strong><small>'+esc(d?d.desc:"Objeto recuperado")+'</small><em>'+esc(status)+'</em></span><div class="loot-buttons '+(dis?'has-disassembly':'')+'"><button data-take-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="taken"?"Tomado":"Tomar")+'</button>'+dis+'<button class="discard" data-discard-loot="'+i+'" '+(done?'disabled':'')+'>'+(drop.status==="discarded"?"Descartado":"Descartar")+'</button></div></article>'}).join("");
  $("takeAllLoot").textContent="Saquear todo · "+pending+" espacios";$("takeAllLoot").classList.toggle("hidden",pending===0);Array.prototype.forEach.call(document.querySelectorAll("[data-take-loot]"),function(b){b.addEventListener("click",function(){takeLoot(Number(b.dataset.takeLoot))})});Array.prototype.forEach.call(document.querySelectorAll("[data-disassemble-loot]"),function(b){b.addEventListener("click",function(){openDisassemblyFromLoot(Number(b.dataset.disassembleLoot))})});Array.prototype.forEach.call(document.querySelectorAll("[data-discard-loot]"),function(b){b.addEventListener("click",function(){discardLoot(Number(b.dataset.discardLoot))})});$("lootModal").classList.remove("hidden");$("closeLoot").focus()
}
function takeLoot(i){if(!battleState)return;var e=battleState.enemies[battleState.openLoot],drop=e&&e.loot[i],p=state.party[battleState.looter],free=bagFree(p),units=drop?Math.max(1,Number(drop.qty)||1):0,d=drop&&gear(drop.id);if(!drop||drop.status!=="pending")return;if(free===0){battleState.lootMessage="La mochila está llena. No puedes recoger más botín.";renderLootModal(battleState.openLoot);return}if(units>free){battleState.lootMessage="No caben las "+units+" unidades de "+(d?d.name:drop.id)+". Solo "+(free===1?"queda 1 espacio libre":"quedan "+free+" espacios libres")+".";renderLootModal(battleState.openLoot);return}if(!addToBag(p,drop.id,units)){battleState.lootMessage="La mochila está llena. No puedes recoger más botín.";renderLootModal(battleState.openLoot);return}drop.status="taken";battleState.lootMessage="";recordLoot(drop.id,units);battleState.lootTaken+=units;renderLootModal(battleState.openLoot)}
function takeAllLoot(){
  if(!battleState)return;var e=battleState.enemies[battleState.openLoot],p=state.party[battleState.looter];if(!e)return;var pending=pendingLootUnits(e.loot),free=bagFree(p);if(!canTakeAllLoot(p,e.loot)){battleState.lootMessage=free===0?"La mochila está llena. No puedes saquear todo.":"No se puede saquear todo: el botín ocupa "+pending+" espacios y solo "+(free===1?"queda 1 espacio libre":"quedan "+free+" espacios libres")+". Selecciona cada uno de los objetos que quieres llevar.";renderLootModal(battleState.openLoot);return}
  var taken=0;e.loot.forEach(function(drop){if(drop.status!=="pending")return;var units=Math.max(1,Number(drop.qty)||1);addToBag(p,drop.id,units);drop.status="taken";recordLoot(drop.id,units);battleState.lootTaken+=units;taken+=units});battleState.lootMessage="";renderLootModal(battleState.openLoot);toast(p.name+" guarda todo el botín · "+taken+" unidades")
}
function discardLoot(i){if(!battleState)return;var e=battleState.enemies[battleState.openLoot],drop=e&&e.loot[i];if(!drop||drop.status!=="pending")return;drop.status="discarded";battleState.lootMessage="";renderLootModal(battleState.openLoot)}
function closeLootModal(){
  if(disassemblyState&&disassemblyState.source.type==="loot")closeDisassemblyModal();if(!battleState)return;var e=battleState.enemies[battleState.openLoot];if(e)e.loot.forEach(function(x){if(x.status==="pending")x.status="discarded"});$("lootModal").classList.add("hidden");battleState.openLoot=null;if(battleState.enemies.every(function(x){return x.looted}))finishLooting();else renderBattle()
}
function finishLooting(){if(!battleState||battleState.phase!=="loot"||battleState.busy)return;clearInterval(lootInterval);stopLoopSfx("loot-loop",160);$("lootModal").classList.add("hidden");winCombat()}
function winCombat(){
  stopLoopSfx("loot-loop",160);
  var b=battleState,choice=b.choice,out=choice.victory||choice;state.stats.battles++;state.stats.wins++;if(state.party.every(function(p){return p.hp>0}))state.stats.fullSquadWins++;state.party.forEach(function(p,i){if(p.hp>0){state.stats.xpFromVictories+=5;addPersonalXp(i,5,"sobrevivir al combate")}});awardFactionPoints(1,"combate ganado");var xpSummary=state.party.map(function(p,i){return(b.xpEarned[i]||0)>0?p.name+" +"+b.xpEarned[i]:""}).filter(Boolean).join(" · "),extra=[["Victoria","Hostiles neutralizados"],["Puntos de facción","+1 · combate ganado"],["XP personal",xpSummary||"Sin XP de combate"],["Botín",b.lootTaken?b.lootTaken+" objetos":"Sin recoger"]];extra=extra.concat(applyPsychImpulse({label:"Victoria del grupo",hint:"Sobrevivir refuerza la decisión colectiva.",fx:{morale:1,threat:-1},psy:{stress:-1,resolve:1}},null));if(b.levelUps.length)extra.push(["Subida de nivel",b.levelUps.join(", ")]);battleState=null;setSceneAmbience("ambience-title",AUDIO_CROSSFADE_MS);$("battle").classList.add("hidden");$("lootModal").classList.add("hidden");completeChoice(choice,out,null,null,extra)
}
function loseCombat(fled){
  stopLoopSfx("loot-loop",160);
  if(!battleState)return;var moraleCost=fled?8:12,threatCost=fled?4:6;state.stats.battles++;state.stats.retreats++;state.morale=clamp(state.morale-moraleCost,0,100);state.threat=clamp(state.threat+threatCost,0,100);applyPsychImpulse({label:fled?"Retirada táctica":"Derrota total",hint:"El fracaso pesa sobre el grupo.",fx:{morale:-moraleCost,threat:threatCost},psy:{stress:fled?1:2,resolve:-1}},null);state.party.forEach(function(p){p.guard=0;p.bleed=0});battleState=null;pending=null;$("battle").classList.add("hidden");openRefuge(fled?"fled":"exhausted");state.refuge.message=fled?"Retirarse cuesta "+moraleCost+" de moral, aumenta "+threatCost+" la amenaza y tensa al grupo. La situación sigue pendiente.":"El grupo completo quedó agotado: moral −"+moraleCost+", amenaza +"+threatCost+" y tensión acumulada. Descansa o utiliza medicina antes de regresar.";renderRefuge();save()
}
function useCombatItem(kind){
  if(!battleState||battleState.phase!=="combat"||battleState.busy)return;var p=state.party[battleState.actor],e=selectedEnemy(),before;if(!combatItemUsable(p,kind,e)){toast(p.name+" no puede usar ese objeto ahora");return}addStatItem("itemsUsed",kind,1);if(kind==="meds"){consumeFromBag(p,"meds");before=p.hp;p.hp=Math.min(p.maxHp,p.hp+26+psychHealingBonus(p));recordHealing(p.hp-before,true);recordHp("ally",battleState.actor,before,p.hp,p.maxHp);battleState.log.push(p.name+" usa su medicina: +"+(p.hp-before)+" HP.")}
  else if(kind==="bandage"){consumeFromBag(p,"bandage");before=p.hp;p.hp=Math.min(p.maxHp,p.hp+14+psychHealingBonus(p));recordHealing(p.hp-before,true);recordHp("ally",battleState.actor,before,p.hp,p.maxHp);p.bleed=0;battleState.log.push(p.name+" aplica su vendaje: +"+(p.hp-before)+" HP y sangrado detenido.")}
  else if(kind==="emp"||kind==="empMk2"){consumeFromBag(p,kind);e.stun=kind==="empMk2"?2:1;strike(e,kind==="empMk2"?34:22,p.name+" activa "+gear(kind).name,battleState.actor,false)}
  else if(kind==="grenade"||kind==="grenadeMk2"){consumeFromBag(p,kind);state.threat=clamp(state.threat+(kind==="grenadeMk2"?7:5),0,100);livingEnemies().forEach(function(x){strike(x,kind==="grenadeMk2"?22:14,p.name+" lanza "+gear(kind).name,battleState.actor,false)});battleState.log.push("El estruendo aumenta la amenaza.")}
  else return;$("itemTray").classList.add("hidden");if(lethalFeedback()){settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});return}endPlayerTurn()
}

function render(){
  var ev=events[state.index],stage=$("stage"),nextScene=sceneKeyForEvent(ev),currentScene=stage.dataset.scene||"";if(currentScene!==nextScene){var prevBackground=getComputedStyle(stage).backgroundImage;stage.dataset.scene=nextScene;if(currentScene)pulseStageFade(prevBackground)}$("day").textContent="Día "+String(ev.day).padStart(2,"0")+" / 03";$("time").textContent=ev.time;$("threatValue").textContent=state.threat+"%";$("threatBar").style.width=state.threat+"%";stage.dataset.day=ev.day;$("chapter").textContent=chapters[ev.day];$("location").textContent=ev.loc;$("progress").textContent="Situación "+(state.index+1)+" de "+events.length;$("eventType").textContent=ev.type;$("eventTitle").textContent=ev.title;$("eventText").textContent=ev.text;renderContextArchives(ev);
  $("choices").innerHTML=ev.choices.map(function(c,i){var why=reason(c);return'<button class="choice" data-choice="'+i+'" '+(why?"disabled":"")+'><span class="num">'+(i+1)+'</span><span><strong>'+esc(c.label)+"</strong><small>"+esc(choiceHintText(c,why))+"</small></span><span class=\"cost\">"+esc(c.cost||"")+"</span></button>"}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-choice]"),function(b){b.addEventListener("click",function(){choose(Number(b.dataset.choice))})});renderMini()
}
function renderMini(){
  $("groupMini").innerHTML=state.party.map(function(p,i){var head=gear(p.equipment.head),body=gear(p.equipment.body),pack=gear(p.equipment.backpack),portrait="portraits/"+p.id+".webp",ready=hasUnspentSkill(p),mind=psychState(p);return'<button class="member '+(ready?'skill-ready':'')+'" data-profile="'+i+'"><span class="avatar">'+assetImage(portrait,p.name,"",590,885)+'</span><span><strong>'+esc(p.name)+"</strong><small>"+esc(p.role)+" · Lvl. "+p.level+" · "+esc(mind.name)+" · Energía "+p.hunger+'%</small>'+(ready?'<span class="skill-ready-copy">Habilidad disponible</span>':'')+'</span><em>'+p.hp+"/"+p.maxHp+' HP</em><span class="ally-peek"><span class="peek-photo">'+assetImage(portrait,p.name,"",590,885)+'</span><span class="peek-data"><b>'+esc(weaponLabel(p))+'</b><span>'+esc((head?head.name:"Sin casco")+" · "+(body?body.name:"Sin chaleco")+" · "+(pack?bagUsed(p)+"/"+bagCapacity(p)+" espacios":"Sin mochila")+" · "+mind.effects)+'</span></span></span></button>'}).join("");
  Array.prototype.forEach.call(document.querySelectorAll("[data-profile]"),function(b){b.addEventListener("click",function(){openProfile(Number(b.dataset.profile))})});
  var r=[["Alimento",stockCount("food")],["Agua",stockCount("water")],["Medicina",stockCount("meds")],["Munición",ammoTotal()],["Tela",stockCount("cloth")],["Batería",stockCount("battery")],["Fichas",state.credits],["Puntos facción",state.factionPoints],["Moral",state.morale+"%"]],main=missionDefs[0],progress=missionProgress(main),percent=Math.round(100*progress/main.target),openMissions=missionDefs.filter(function(def){return !def.main&&missionProgress(def)<def.target}).length;
  $("resourceMini").innerHTML=r.map(function(x){return'<div class="resource"><span>'+x[0]+"</span><b>"+x[1]+"</b></div>"}).join("");$("missionMini").innerHTML='<strong>'+esc(main.title)+'</strong><p>'+esc(missionDescription(main))+'</p><div class="mission-track"><span style="width:'+percent+'%"></span></div><small><span>'+progress+' / '+main.target+'</span><span>'+percent+'%</span></small>';$("missionCount").textContent=openMissions;$("archiveCount").textContent=state.docs.length
}
function openArchive(id,opener){
  var summary=archives[id],doc=archiveTexts[id];if(!summary||!doc)return;archiveOpener=opener||null;$("archiveDocClass").textContent=doc.classification;$("archiveDocTitle").textContent=summary[0];$("archiveDocSource").textContent=doc.source;$("archiveDocDate").textContent=doc.date;$("archiveDocSummary").textContent=summary[1];$("archiveDocBody").innerHTML=doc.body.map(function(p){return"<p>"+esc(p)+"</p>"}).join("");$("archiveModal").classList.remove("hidden");$("archiveReaderScroll").scrollTop=0;$("closeArchive").focus()
}
function closeArchive(){if($("archiveModal").classList.contains("hidden"))return;$("archiveModal").classList.add("hidden");if(archiveOpener&&archiveOpener.focus)archiveOpener.focus();archiveOpener=null}
function findAudioClue(id){
  var clips=eventAudioClues[state.index]||[],match=clips.filter(function(clip){return clip.id===id})[0];
  return match||Object.keys(eventAudioClues).reduce(function(found,key){return found||(eventAudioClues[key]||[]).filter(function(clip){return clip.id===id})[0]},null)
}
function audioClock(seconds){
  seconds=Math.max(0,Number(seconds)||0);var m=Math.floor(seconds/60),s=Math.floor(seconds%60);return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")
}
function updateAudioClueProgress(){
  var player=$("audioCluePlayer"),duration=player&&Number.isFinite(player.duration)?player.duration:0,current=player?player.currentTime||0:0,pct=duration?Math.round(100*current/duration):0;
  $("audioClueProgress").style.width=clamp(pct,0,100)+"%";$("audioClueTime").textContent=audioClock(current)+" / "+(duration?audioClock(duration):"--:--")
}
function resetAudioCluePlayer(){
  var player=$("audioCluePlayer");if(!player)return;try{player.pause()}catch{};player.removeAttribute("src");player.load();currentAudioClue=null;$("audioCluePlay").disabled=false;$("audioCluePlay").textContent="Reproducir señal";$("audioClueStatus").classList.add("hidden");$("audioClueStatus").textContent="";updateAudioClueProgress()
}
function openAudioClue(id,opener){
  var clip=findAudioClue(id),player=$("audioCluePlayer"),status=$("audioClueStatus");if(!clip||!player)return;
  resetAudioCluePlayer();currentAudioClue=clip;audioClueOpener=opener||null;$("audioClueClass").textContent=clip.kicker||"Señal recuperada";$("audioClueTitle").textContent=clip.title;$("audioClueSource").textContent=clip.source||"Registro de expedición";$("audioClueDuration").textContent=clip.duration||"Pendiente";$("audioClueSummary").textContent=clip.summary||"";$("audioClueTranscript").textContent=clip.transcript||"Transcripción pendiente.";status.textContent="";status.classList.add("hidden");
  player.volume=.9;player.src=clip.src+(clip.src.indexOf("?")>=0?"&":"?")+"v="+ASSET_REVISION;player.load();$("audioClueModal").classList.remove("hidden");$("audioClueScroll").scrollTop=0;$("audioCluePlay").focus();updateAudioClueProgress()
}
function closeAudioClue(){
  if($("audioClueModal").classList.contains("hidden"))return;resetAudioCluePlayer();$("audioClueModal").classList.add("hidden");if(audioClueOpener&&audioClueOpener.focus)audioClueOpener.focus();audioClueOpener=null
}
function toggleAudioClue(){
  var player=$("audioCluePlayer"),status=$("audioClueStatus");if(!player||!currentAudioClue)return;
  if(player.paused){var started=player.play();if(started&&started.catch)started.catch(function(){status.textContent="El navegador bloqueó la reproducción. Toca reproducir nuevamente.";status.classList.remove("hidden")})}
  else player.pause()
}
function switchWorldLore(section){if(!loreSections[section])section="history";Object.keys(loreSections).forEach(function(key){var ids=loreSections[key],active=key===section,tab=$(ids[0]),panel=$(ids[1]);tab.classList.toggle("active",active);tab.setAttribute("aria-selected",active?"true":"false");panel.classList.toggle("hidden",!active)});$("worldLoreScroll").scrollTop=0}
function switchFaction(section){if(!factionSections[section])section="rotos";Object.keys(factionSections).forEach(function(key){var ids=factionSections[key],active=key===section,tab=$(ids[0]),panel=$(ids[1]);tab.classList.toggle("active",active);tab.setAttribute("aria-selected",active?"true":"false");panel.classList.toggle("hidden",!active)});$("worldLoreScroll").scrollTop=0}
function openWorldLore(opener){worldLoreOpener=opener||null;closePanel();switchWorldLore("history");switchFaction("rotos");$("worldLoreModal").classList.remove("hidden");$("closeWorldLore").focus()}
function closeWorldLore(){if($("worldLoreModal").classList.contains("hidden"))return;$("worldLoreModal").classList.add("hidden");if(worldLoreOpener&&worldLoreOpener.focus)worldLoreOpener.focus();worldLoreOpener=null}
function openPanel(type){
  var list=[],title,html="";if(type==="missions"){title="Misiones";html=missionDefs.map(missionCardHtml).join("")}
  else if(type==="archive"){title="Archivo";html='<article class="drawer-item archive-entry world-entry"><span class="archive-entry-copy"><strong>Archivo de mundo: NeoSantiago 2130</strong><small>Historia, vida bajo tierra, Gobernanza, la Red UNO, facciones, tácticas y extractos reales de La ciudad de los rotos.</small></span><button data-open-world-lore>Conocer la historia</button></article>'+(state.docs.length?state.docs.map(function(id){var summary=archives[id],doc=archiveTexts[id];if(!summary||!doc)return"";return'<article class="drawer-item archive-entry"><span class="archive-entry-copy"><strong>'+esc(summary[0])+'</strong><small>'+esc(summary[1])+'</small></span><button data-open-archive="'+esc(id)+'">Leer archivo</button></article>'}).join(""):'<p class="empty">Todavía no has recuperado archivos. Explora, investiga y elige rutas que revelen información.</p>')}
  else if(type==="group"){title="Grupo";state.party.forEach(function(p){var mind=psychState(p);list.push([p.name+" · "+p.role+" · Lvl. "+p.level+" · "+mind.name,p.hp+"/"+p.maxHp+" HP · "+p.xp+"/"+xpNeeded(p)+" XP · Energía "+p.hunger+"% · "+mind.effects+". "+weaponLabel(p)+". Habilidades "+p.skills.length+"/6."])});list.push(["Pulso psicológico",psychTeamLine()+". Cambia con diálogos, decisiones, combates, descanso y reagrupación."]);list.push(["Puntos de facción: "+state.factionPoints,"Se comparten entre los tres perfiles; invertirlos define la especialización de esta partida."]);list.push(["Estado colectivo: "+state.morale+"%",state.morale>=60?"El grupo todavía confía en sus decisiones compartidas.":"Las decisiones están erosionando la confianza."])}
  else{title="Historial";state.history.slice().reverse().forEach(function(x){list.push(["Día "+x.day+" · "+x.loc,x.choice+". "+x.result+"."])})}
  if(type!=="missions"&&type!=="archive")html=list.length?list.map(function(x){return'<article class="drawer-item"><strong>'+esc(x[0])+"</strong><p>"+esc(x[1])+"</p></article>"}).join(""):'<p class="empty">Todavía no hay registros en esta sección.</p>';
  $("drawerTitle").textContent=title;$("drawerContent").innerHTML=html;Array.prototype.forEach.call(document.querySelectorAll("[data-open-archive]"),function(b){b.addEventListener("click",function(){openArchive(b.dataset.openArchive,b)})});Array.prototype.forEach.call(document.querySelectorAll("[data-open-world-lore]"),function(b){b.addEventListener("click",function(){openWorldLore($("archiveNav"))})});$("shade").classList.remove("hidden");$("drawer").classList.remove("hidden");$("closeDrawer").focus()
}
function closePanel(){$("shade").classList.add("hidden");$("drawer").classList.add("hidden")}
function toast(msg){clearTimeout(toastTimer);$("toast").textContent=msg;$("toast").classList.remove("hidden");toastTimer=setTimeout(function(){$("toast").classList.add("hidden")},1800)}
function showGameIntro(step){introStep=step===1?1:0;$("introLore").classList.toggle("hidden",introStep!==0);$("introRules").classList.toggle("hidden",introStep!==1);$("introTrackWorld").classList.toggle("active",introStep===0);$("introTrackRules").classList.toggle("active",introStep===1);$("introTrackRefuge").classList.remove("active");$("gameIntro").classList.remove("hidden");(introStep?$("introBack"):$("introNext")).focus()}
function completeIntro(){if(state.introCompleted)return;state.introCompleted=true;$("introTrackRules").classList.remove("active");$("introTrackRefuge").classList.add("active");$("gameIntro").classList.add("hidden");save();openRefuge("start");toast("Mara espera en el Andén 4")}
function showTitleScreen(){
  $("start").classList.add("hidden");$("titleScreen").classList.remove("hidden");$("titleScreen").classList.remove("leaving");$("enterTitle").focus()
}
function enterTitleScreen(){
  var title=$("titleScreen");if(title.classList.contains("hidden")||title.classList.contains("leaving"))return;
  title.classList.add("leaving");setTimeout(function(){title.classList.add("hidden");title.classList.remove("leaving");$("start").classList.remove("hidden");(!$("continueGame").classList.contains("hidden")?$("continueGame"):$("newGame")).focus()},560)
}
function newGame(){state=fresh();pending=null;battleState=null;transferDraft=null;discardDraft=null;disassemblyState=null;npcDialogueState=null;archiveOpener=null;audioClueOpener=null;worldLoreOpener=null;clearInterval(lootInterval);clearInterval(disassemblyTimer);clearInterval(npcDialogueTimer);resetAudioCluePlayer();["titleScreen","start","gameIntro","worldLoreModal","battle","final","summary","refuge","profileModal","transferModal","discardModal","disassemblyModal","lootModal","logisticsModal","archiveModal","audioClueModal","npcDialogueModal"].forEach(function(id){$(id).classList.add("hidden")});render();save();showGameIntro(0)}
function continueGame(){if(!load()){newGame();return}$("titleScreen").classList.add("hidden");$("start").classList.add("hidden");render();if(!state.introCompleted)showGameIntro(0);else if(state.finished&&state.ending){if(state.summarySeen)showRunSummary();else finish(state.ending)}else if(state.refuge.active)openRefuge(state.refuge.reason,true);else toast("Partida restaurada")}

loadAudioRoutes();
installAudioHooks();
$("audioCluePlayer").addEventListener("loadedmetadata",updateAudioClueProgress);$("audioCluePlayer").addEventListener("timeupdate",updateAudioClueProgress);$("audioCluePlayer").addEventListener("play",function(){$("audioCluePlay").textContent="Pausar señal"});$("audioCluePlayer").addEventListener("pause",function(){$("audioCluePlay").textContent="Reproducir señal"});$("audioCluePlayer").addEventListener("ended",function(){$("audioCluePlay").textContent="Reproducir señal";updateAudioClueProgress()});$("audioCluePlayer").addEventListener("error",function(){var status=$("audioClueStatus");status.textContent="Audio pendiente: sube el MP3 en "+(currentAudioClue&&currentAudioClue.src?currentAudioClue.src:"la ruta indicada")+".";status.classList.remove("hidden");$("audioCluePlay").disabled=true;updateAudioClueProgress()});
$("enterTitle").addEventListener("click",enterTitleScreen);$("newGame").addEventListener("click",newGame);$("continueGame").addEventListener("click",continueGame);$("openWorldLore").addEventListener("click",function(){openWorldLore($("openWorldLore"))});$("closeWorldLore").addEventListener("click",closeWorldLore);$("closeWorldLoreBottom").addEventListener("click",closeWorldLore);Object.keys(loreSections).forEach(function(key){$(loreSections[key][0]).addEventListener("click",function(){switchWorldLore(key)})});Object.keys(factionSections).forEach(function(key){$(factionSections[key][0]).addEventListener("click",function(){switchFaction(key)})});$("introNext").addEventListener("click",function(){showGameIntro(1)});$("introBack").addEventListener("click",function(){showGameIntro(0)});$("introStart").addEventListener("click",completeIntro);$("advance").addEventListener("click",advance);$("dialogueSkip").addEventListener("click",advanceNpcDialogueText);$("dialogueContinue").addEventListener("click",closeNpcDialogueAndContinue);$("nextDay").addEventListener("click",function(){$("night").classList.add("hidden");if(state.morale<=0)openRefuge("morale");else{save();render()}});$("finalContinue").addEventListener("click",showRunSummary);$("downloadPng").addEventListener("click",downloadResultPng);$("restart").addEventListener("click",newGame);$("npcTabMara").addEventListener("click",function(){switchRefugeNpc("mara")});$("npcTabArmorer").addEventListener("click",function(){switchRefugeNpc("armorer")});$("starterKit").addEventListener("click",acceptStarterKit);$("refugeRest").addEventListener("click",restAtRefuge);$("refugeRejoin").addEventListener("click",rejoinAtRefuge);$("leaveRefuge").addEventListener("click",leaveRefuge);$("closeLogistics").addEventListener("click",closeLogisticsBriefing);$("backToRefuge").addEventListener("click",closeLogisticsBriefing);$("confirmLogistics").addEventListener("click",confirmLeaveRefuge);$("logisticsModal").addEventListener("click",function(e){if(e.target===$("logisticsModal"))closeLogisticsBriefing()});$("closeDrawer").addEventListener("click",closePanel);$("shade").addEventListener("click",closePanel);$("closeProfile").addEventListener("click",closeProfile);$("closeTransfer").addEventListener("click",closeTransferModal);$("transferModal").addEventListener("click",function(e){if(e.target===$("transferModal"))closeTransferModal()});$("closeDiscard").addEventListener("click",closeDiscardModal);$("cancelDiscard").addEventListener("click",closeDiscardModal);$("confirmDiscard").addEventListener("click",confirmDiscardProfileItem);$("discardModal").addEventListener("click",function(e){if(e.target===$("discardModal"))closeDiscardModal()});$("closeDisassembly").addEventListener("click",closeDisassemblyModal);$("disassemblyAttempt").addEventListener("click",attemptDisassembly);$("disassemblyDone").addEventListener("click",closeDisassemblyModal);$("closeLoot").addEventListener("click",closeLootModal);$("closeArchive").addEventListener("click",closeArchive);$("closeArchiveBottom").addEventListener("click",closeArchive);$("closeAudioClue").addEventListener("click",closeAudioClue);$("closeAudioClueBottom").addEventListener("click",closeAudioClue);$("audioCluePlay").addEventListener("click",toggleAudioClue);$("takeAllLoot").addEventListener("click",takeAllLoot);$("finishLoot").addEventListener("click",finishLooting);$("itemsToggle").addEventListener("click",function(){if(battleState&&battleState.phase==="combat")$("itemTray").classList.toggle("hidden")});
Array.prototype.forEach.call(document.querySelectorAll("[data-panel]"),function(b){b.addEventListener("click",function(){openPanel(b.dataset.panel)})});
Array.prototype.forEach.call(document.querySelectorAll("[data-action]"),function(b){b.addEventListener("click",function(){combatAction(b.dataset.action)})});
Array.prototype.forEach.call(document.querySelectorAll("[data-combat-item]"),function(b){b.addEventListener("click",function(){useCombatItem(b.dataset.combatItem)})});
document.addEventListener("keydown",function(e){if(!$("titleScreen").classList.contains("hidden")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();enterTitleScreen();return}if(!$("disassemblyModal").classList.contains("hidden")){if(e.key==="Escape"){e.preventDefault();closeDisassemblyModal();return}if((e.key==="Enter"||e.key===" ")&&disassemblyState){e.preventDefault();if(disassemblyState.finished)closeDisassemblyModal();else attemptDisassembly()}return}if(!$("npcDialogueModal").classList.contains("hidden")){if((e.key==="Enter"||e.key===" ")&&npcDialogueTimer){e.preventDefault();revealNpcDialogueText()}return}if(e.key==="Escape"&&!$("worldLoreModal").classList.contains("hidden")){closeWorldLore();return}if(e.key==="Escape"&&!$("archiveModal").classList.contains("hidden")){closeArchive();return}if(e.key==="Escape"&&!$("audioClueModal").classList.contains("hidden")){closeAudioClue();return}if(e.key==="Escape"&&!$("discardModal").classList.contains("hidden")){closeDiscardModal();return}if(e.key==="Escape"&&!$("transferModal").classList.contains("hidden")){closeTransferModal();return}if(e.key==="Escape"&&!$("logisticsModal").classList.contains("hidden")){closeLogisticsBriefing();return}if(e.key==="Escape"&&!battleState){closePanel();closeProfile()}if(battleState||!$("titleScreen").classList.contains("hidden")||!$("start").classList.contains("hidden")||!$("gameIntro").classList.contains("hidden")||!$("worldLoreModal").classList.contains("hidden")||!$("result").classList.contains("hidden")||!$("night").classList.contains("hidden")||!$("final").classList.contains("hidden")||!$("summary").classList.contains("hidden")||!$("refuge").classList.contains("hidden")||!$("profileModal").classList.contains("hidden")||!$("logisticsModal").classList.contains("hidden")||!$("archiveModal").classList.contains("hidden")||!$("audioClueModal").classList.contains("hidden"))return;if(["1","2","3"].indexOf(e.key)>=0)choose(Number(e.key)-1)});
try{var saved=JSON.parse(localStorage.getItem(KEY));if(saved&&saved.version===3)$("continueGame").classList.remove("hidden")}catch{}
render();
showTitleScreen();
