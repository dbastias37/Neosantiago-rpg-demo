# Hacia 0.2 — cuarta entrega: el regreso de Darío

19 de septiembre de 2026. Esta entrega continúa la progresión de la red y las consecuencias de Morales y Plaza de Armas. Cierra un vacío de la extracción: el operativo dejaba de existir en cuanto se pagaba la recompensa, y al consultar a Adasme se repetía la petición de buscarlo.

## Una persona después del objetivo

El operativo se llama Darío. Es una incorporación de la adaptación del juego, no un personaje que se atribuya a la novela. Su nombre aparece desde el encargo y se mantiene en el encuentro, la llegada y la respuesta posterior. No se le asigna un retrato de otro personaje: el diálogo utiliza el retrato de Adasme como interlocutora.

Darío quiere conservar su mochila a mano y explicar en qué momento dejó de oír al grupo. Su preocupación no se limita a agradecer el rescate. Adasme debe atenderlo, informar de los enfrentamientos si los hubo y decidir qué puede dejar para después. Rocío y Bruno participan con acciones concretas, sin convertir cada frase en una máxima.

La llegada distingue lo que el motor sabe: regreso caminando o cargado, agua y comida compartidas, cuatro municiones entregadas y combates durante la extracción. Haber podido caminar no equivale a estar dispuesto a salir otra vez. Si fue cargado, la escena posterior no lo presenta recuperado de forma instantánea. No se diagnostica una condición psicológica a partir de esos hechos.

## Dos respuestas y un segundo encuentro

Después de cobrar se puede abrir la conversación o dejarla pendiente. Cerrar la ventana no selecciona una respuesta. La atención a Darío ocurre en ambas ramas y no depende de colaborar con el informe.

| Respuesta del jugador | Qué hace Adasme | Qué se reconoce después |
| --- | --- | --- |
| Dejar la versión del equipo y aplazar sus preguntas | Conserva el parte de los Mensajeros y deja pendiente el de Darío | Darío añade su corrección; el registro conserva ambas voces y precisa cuándo dejó de oír al resto |
| Reconstruir con Darío solo el punto de separación | Anota el punto que él ofrece señalar, sin exigirle relatar toda la extracción | Su observación cambia la hoja del siguiente relevo: dos personas por caja y revisión de correas antes del paso |

La respuesta posterior llega a Los Héroes después del regreso jugable. También se habilita si otro encargo termina allí. El jugador puede atender la primera conversación recién al llegar a casa: no se le exige viajar otra vez. Si la consulta lejos de Vicuña, se presenta como un mensaje; no mueve al equipo ni afirma que está físicamente delante de Adasme.

La segunda escena requiere una acción para guardar la respuesta como leída. Después sigue disponible desde Adasme. La pista de progreso no da por atendida toda la red mientras esa conversación permanezca pendiente. Mara avisa que el relevo dejó el mensaje cuando está listo para leer.

## Alcance de la consecuencia

Esta consecuencia es narrativa: cambia un registro de Vicuña o el procedimiento descrito para su siguiente relevo, la tarea que Darío pide asumir y las respuestas posteriores de Adasme. No añade un aliado al combate ni simula las salidas de la milicia. No reduce el riesgo del mapa, no concede experiencia o dinero y no duplica suministros. La recuperación de Darío tampoco es una nueva barra de salud.

Ese alcance es deliberado. Morales ya produce preparación para una salida; Plaza ya produce una ayuda local de abastecimiento. Este episodio aporta memoria de una persona y de cómo fue escuchada. Los dos caminos tienen una respuesta propia, sin clasificarlos como una elección buena y otra mala ni premiar al jugador por obtener una declaración inmediata.

## Persistencia e interfaz

`aftermath.mjs` concentra el hecho del regreso, sus condiciones, las respuestas y las escenas. El recibo conserva `rescueOutcome`; el guardado de Encargos añade `aftermath` con versión 1. Solo una extracción confirmada, pagada y registrada puede crear el hecho. Encontrar al operativo, fracasar o abandonar no lo crea.

El resultado de la extracción se conserva aunque empiece otro encargo. La respuesta se puede elegir una sola vez, sobre una copia del estado; no modifica el recibo ni los sistemas materiales. Los viajes activos o fallidos bloquean la conversación. Releer una escena no equivale a responder y no vuelve a aplicar ninguna consecuencia.

La migración conserva los resultados anteriores. Si aún está guardada la extracción terminada, recupera de ella los detalles de la ayuda. Si queda solo el recibo antiguo, mantiene desconocidos la movilidad y los suministros que no constan. Las contradicciones con un resultado nuevo registrado se rechazan. El reinicio de Encargos o de la partida elimina esta continuidad junto con su equipo, siguiendo las reglas de reinicio existentes.

La interfaz de extracción habla de acompañar a Darío, de su regreso y de extracción completada. Evita presentarlo como un objeto entregado.

Se reutilizan el diálogo, los botones, la tipografía, el retrato y el cierre/Atrás de Encargos. Hay acceso desde el recibo, el panel del viaje y Adasme. No se añade una interfaz paralela ni una escena automática sobre un combate. La expedición conserva la conexión previa con el informe de Morales; esta entrega no importa a Darío a la campaña.

## Criterio de escritura consultado

[Harris Powell-Smith, sobre dar espacio a las escenas de ficción interactiva](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/), propone situar conversaciones dentro de tareas y reservar momentos tranquilos conectados con la trama. Aquí se aplica a acomodar a alguien que vuelve, guardar su mochila, escribir un parte y revisar correas. La segunda escena permite observar qué ocurrió después de la urgencia del rescate.

Se mantienen los criterios de voz y adaptación documentados en [la primera entrega](narrativa-0.2.md). La expectativa de diseño es que una persona con preocupaciones propias, cuya respuesta se recuerda, dé continuidad a la misión. No hay una medición de vínculo emocional o retención: las pruebas técnicas verifican estados, acceso y persistencia, no esas respuestas de jugadores reales.

## Verificación y siguiente trabajo

260 pruebas aprobadas, incluidas trece nuevas sobre la extracción y sus consecuencias. Recorren extracciones reales con distintas semillas, movilidad, ayuda y combate; verifican ambos caminos de conversación, ausencia de pagos duplicados, aplazamiento, llegada a casa por viaje o encargo, guardados anteriores, datos contradictorios, reinicio y acceso desde la interfaz después de recargar. Se mantiene la batería anterior de combate, equipo, comercio, descubrimiento y continuidad con Noa.

El siguiente trabajo de unificación debería abordar el traslado previo a aceptar encargos que empiezan en otro refugio. Sigue siendo un relevo resumido y explicado en la oferta. Hay que integrarlo sin duplicar rutas largas ni alterar posiciones de partidas en curso. El equilibrio del calendario y los recursos de la expedición continúa siendo otro pendiente hacia 0.2.
