# Entrega 12 · Primeros recorridos y personas que reciben al equipo

Base: `d6027f4a708945c2938653f785524686b1b4fa29`, 19 de septiembre de 2026.

## Qué fallaba

El inicio presentaba el oficio como un trámite: salir de Los Héroes, hablar en La Moneda y volver. Romero repetía esa estructura entre República y Los Héroes. El jugador desbloqueaba contactos, pero apenas podía distinguir para quién trabajaba o qué cambiaba al llegar. Acortar un tutorial había reducido también su contenido dramático.

Esta entrega reemplaza ese inicio y desarrolla el bloque de consecuencias humanas de llegada. Mantiene el descubrimiento gradual de contactos; no exige completar todas las ramas para avanzar.

## Cuatro encargos conectados

| Encargo actual | Recorrido | Trabajo humano y decisiones |
| --- | --- | --- |
| El turno que no alcanza | Los Héroes → La Moneda → Universidad de Chile → Plaza de Armas; 3 tramos | Elena necesita saber por qué falta su hermano. Inés debe compartir un pasillo entre carga y familias. Decides cómo tramitar la consulta y cómo organizar el paso. Ana recibe el acuerdo y paga en Plaza. |
| Una reserva, tres puestos | Plaza → Universidad de Chile → La Moneda → Los Héroes → República; 4 tramos | Recoges una reserva, proteges el registro de quien la entrega, decides cómo ayudar a Julián y preparas la continuidad de su atención. El estuche permanece sellado. |
| Hasta donde llega el carro | Plaza → Universidad de Chile → La Moneda → Los Héroes → Toesca → Parque O’Higgins → Toesca → Los Héroes; 7 tramos | Distingues observaciones de suposiciones, compruebas qué tipo de carga puede pasar y señalas dónde termina el reconocimiento. El regreso permite a otro trabajador preparar su salida. |
| Cruzar con lo que queda | Plaza → Universidad de Chile → La Moneda → Los Héroes; 3 tramos | El acuerdo se pone en práctica acompañando a dos familias. Debes aclarar su recepción y resolver una correa rota sin tratar las herramientas como equipaje prescindible. |

Romero y Morales pueden aceptarse directamente en Plaza después de la primera entrega. Sus solicitudes están allí: no se afirma que los emisores se hayan trasladado. El reconocimiento de Morales conserva una vuelta porque el destinatario necesita preparar cargas con lo observado; tiene tres cruces tranquilos escritos para ese recorrido, sin confirmación modal y compatibles con el viaje ágil. Este se detiene ante decisiones y paradas de descanso.

Los plazos son 32, 46, 64 y 28 minutos de simulación. El primero paga 18 fichas; los demás mantienen 28, 32 y 30. Todas las combinaciones de decisiones escritas de estos encargos caben dentro del plazo sin descanso adicional. Leer no consume tiempo. Descansar sigue teniendo su coste y puede agotar el margen.

## Lo que cambia al llegar

La respuesta de Ana distingue una confirmación recibida de una consulta todavía pendiente. También muestra el coste organizativo del acuerdo: esperar ventanas separadas o asignar acompañantes que dejan otras tareas.

Romero distingue un vendaje realizado de una visita solicitada. Recibir el aviso no cura a Julián ni permite declararlo listo para el siguiente turno. La auxiliar, el registro de Inés y la reserva tienen continuidad en la recepción.

Morales conserva qué desvío se comprobó, si pasó un carro vacío o solo mochilas y dónde acaba el reconocimiento. El cargador prepara su trabajo según esa información. El informe mantiene los identificadores que la campaña utiliza para la preparación de Noa.

Al recibir a las familias se restituyen las herramientas repartidas o se reconoce la reparación de su correa. Llegar a un refugio también implica averiguar dónde sentarse, guardar lo propio y comer.

Las entregas confirmadas alimentan recuerdos visibles en los puestos correspondientes, el mapa y el diario de posteriores visitas. Abrir una escena, abandonar un encargo o limitarse a proponer algo no produce ese recuerdo. No hay otro pago por leerlo. Estas escenas no simulan indefinidamente el estado de cada NPC: conservan lo registrado y no inventan una atención posterior.

## Criterio narrativo y fuentes

El criterio es dar a cada participante una necesidad concreta y una tarea que compite por su tiempo. La expresión emocional aparece en sus actos: contar otra vez una lista, proteger una firma, no soltar un bolso, pedir que no den por atendida una solicitud. El equipo escucha y actúa; el narrador no convierte esos gestos en una moraleja.

La estructura de escenas con condiciones y consecuencias sigue el modelo descrito por Emily Short en [Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/). Aquí se aplica a recuerdos activados por entregas y a situaciones que pertenecen a un recorrido, con momentos tranquilos entre ellas.

El diseño de alternativas considera las reglas de Dan Fabulich en [5 Rules for Writing Interesting Choices in Multiple-Choice Games](https://www.choiceofgames.com/2010/03/5-rules-for-writing-interesting-choices-in-multiple-choice-games/): informar sobre el coste y ofrecer motivos para elegir distintas respuestas. Se concreta en tiempo, suministros, esfuerzo y responsabilidades distintas, sin un premio moral añadido por escoger la respuesta más generosa.

El marco de adaptación de [Neosantiago 2130](https://neo2130.onrender.com/) se conserva según la revisión de las entregas anteriores: comunidades subterráneas, recursos y registros vulnerables, dependencia entre puestos y límites de lo que una persona sabe. Elena, Inés, Julián y Celso son personajes de estas escenas del juego; no se presentan como personajes o pasajes literales del libro.

Esto es una hipótesis de diseño sobre comprensión, agencia y vínculo. Las pruebas automáticas demuestran funcionamiento; no demuestran emoción ni retención. Hace falta comprobar con jugadores si recuerdan a quién ayudaron, entienden qué cambió y desean aceptar el siguiente trabajo.

## Integración y guardados

`corridors.mjs` contiene las nuevas definiciones, escenas, propósitos y consecuencias. `production.json` conserva las definiciones históricas. `prepare()` construye el catálogo vigente y retiene las rutas anteriores para restaurar partidas. No editar las definiciones históricas para corregir una escena nueva.

Los encargos y traslados nuevos llevan `corridorVersion: 2`. Los antiguos se restauran con su itinerario, encuentro pendiente, reloj, destinatario, punto de control y recompensa originales. Esto incluye el traslado de alguien que iba hacia República para aceptar el antiguo encargo de Romero. Ese viaje termina en República; la siguiente aceptación consulta el nuevo origen en Plaza. No se teletransporta al grupo ni se cambia la carga que aceptó.

Las entregas antiguas no se repiten ni reciben decisiones retroactivas. Para recorrer el inicio nuevo hace falta una partida que todavía no haya aceptado esos trabajos. La actualización no reinicia guardados ni afecta al guardado de la expedición.

La interfaz muestra el propósito inmediato junto al avance y conserva el catálogo, paleta, mapa y controles existentes. Los mapas siguen distinguiendo nodos conocidos de visitados.

## Validación y límites

345 pruebas pasan con `node --test --test-reporter=tap tests/*.test.cjs`. Nueve pruebas nuevas cubren combinaciones de acuerdos y asistencia, costes reales, falta de botiquín, conservación de carga, regreso del reconocimiento, familias y pertenencias, memoria condicionada a entrega y restauración de encargos/traslados anteriores. Las pruebas existentes de interfaz y progresión se actualizaron para la nueva topología y continúan comprobando la cadena completa en cuatro semillas.

Se verificaron guardados durante encuentros, reintentos, abandono y entregas; pago único, apertura de contactos y persistencia de las banderas de observación. Las pruebas de interfaz ejercitan botones, catálogo, mapa, entrega y recarga mediante DOM; no equivalen a una evaluación humana del ritmo o de la composición visual en dispositivos reales.

El bloque no añade estaciones ni convierte el mapa en exploración libre. El siguiente candidato de desarrollo es prolongar la identidad de los destinatarios en las entregas largas: que Beatriz, Guzmán y Jiménez respondan a problemas propios de su sector y que esas situaciones alteren encargos posteriores. Antes de extender el volumen conviene observar una sesión del inicio revisado y ajustar dónde el jugador vuelve a sentir trámite.

## Ajuste del catálogo · 19 de septiembre

El catálogo pasa de tarjetas extensas a franjas de ancho completo con retrato, título y solicitante. Los datos de recorrido, plazo, recompensa, carga y relato aparecen al abrir el encargo. La explicación del progreso queda disponible en un desplegable. Las imágenes conservan su proporción vertical completa, también en el detalle; ya no se recortan como imágenes horizontales. El encabezado del modal permanece fuera del área desplazable y cada cambio de vista vuelve al inicio de su contenido. Los 18 casos existentes de interfaz de encargos pasan tras este ajuste.
