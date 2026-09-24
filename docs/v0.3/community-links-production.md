# Enlaces de comunidad en campaña — V0.3

Base: main 6233e1a (PR #7). Decisión autorizada por el usuario: seleccionar la variante y avanzar sin prueba A/B ni otra confirmación previa. La suite de referencia tiene 453 pruebas Node. No se declara validada la duración humana por automatizar recorridos.

## Decisión de ritmo

Se activa B en la campaña habitual. La posta sigue atendiendo a Matías mientras se transporta la reserva. Solo su indicación nueva requiere la recepción antes de cruzar República. No se retiran premios anteriores ni se hace depender la atención médica de rescatar a Darío. A queda conservada en el laboratorio como herramienta de regresión, sin ser un paso de aprobación.

Rosa y su hija Iara son los personajes presentes en el contenido; «Sorsa» no aparece en el repositorio. Su llegada previa a una casa segura no se borra. La segunda conexión utiliza el encargo existente de Ana, «Cruzar con lo que queda»: acompañar familias y resolver su recepción. No se inventa un rescate de Rosa que ya hubiera sucedido.

Tras cerrar la segunda noche, si Iara llegó a la casa y Rosa mantuvo un vínculo (marcas o red civil, no intercambio cerrado), puede solicitarse una recepción para su red. La expedición sigue disponible. Los Mensajeros recogen el añadido de Ana en Plaza y lo presentan en Los Héroes, una vez confirmado su encargo. Si lo completaron antes, solo viajan con el añadido: no se repite escolta ni pago. El recibido abre una alternativa concreta ante los civiles de la avenida; llegar después conserva el reconocimiento, sin cambiar hechos pasados. Rosa e Iara siguen en la casa: habilitar una recepción no prueba su traslado.

## Contrato y riesgos

Se conservan claves y versiones. Campos opcionales validados; sin solicitud ni recibo inventados al cargar. Cada equipo escribe su propio guardado. Identificadores enlazan la solicitud a una recepción posterior; almacenamiento confirmado antes de mutar el estado visible. No se sustituye ningún encargo activo o interrumpido. Retirada, checkpoint, encuentros, combate y loot usan los motores existentes. Las dos conexiones pueden coexistir, pero se ofrecen en jornadas distintas.

Riesgos a verificar: acceso directo a contactos sin pagos falsos; encargos ya terminados; recibos provisionales o ajenos; ida y retorno físicos; derrota y reintento; una sola consecuencia; recarga; partidas V0.2; aislamiento del laboratorio; entrega tardía; final cerrado; ventanas compartidas y orientación móvil.

## Criterio de escritura

Necesidad primero, acuerdo comprensible antes del viaje, encuentro y consecuencia visible después. Aplicación de [Emily Short, Pacing Storylet Structures](https://emshort.blog/2020/01/21/pacing-storylet-structures/) y [Becky Slitt, How to Write Intentional Choices](https://www.choiceofgames.com/2016/12/how-to-write-intentional-choices/). Los encargos se ofrecen en preparación, sin cortar una escena culminante. No se presenta una firma como una cura, una localización segura como un traslado, ni una recompensa como el precio de una vida.

## Verificación

Se actualizará al terminar implementación y pruebas. Pendientes de producción heredados: audio ausente, prueba en dispositivos reales y duración de una sesión humana. No se requieren nuevos assets visuales o sonoros para este bloque.

## Implementación del segundo enlace

`rosa-bridge.js` valida solicitudes y recepciones sin DOM. Los adaptadores de campaña y Mensajeros presentan el acuerdo en los paneles y modales existentes. Ana se descubre sin marcar encargos previos como pagados. Su escolta mantiene familias, decisiones, desgaste, combate, loot y pago. Al aceptarla en Plaza se adjunta la petición si aún no se recogió; una escolta ya completada requiere un viaje nuevo por el añadido, nunca otro pago.

La segunda noche abre preparación únicamente cuando existe el vínculo de Rosa. Usa el mismo refugio, sin otra curación, comida o reagrupamiento gratis. Los textos identifican la tercera jornada. La reserva médica y el acuerdo civil pueden coexistir; el acceso desde cada panel abre su conversación correspondiente.

En la avenida, la recepción revisada permite guiar a los civiles gastando agua y ganando amenaza. No despeja la patrulla, no entrega el código del ascensor ni traslada a Rosa e Iara. Reutiliza la consecuencia `rescuedStrangers` y añade la memoria específica `rosaBridgeRouteUsed`. La escena y el epílogo recuerdan únicamente hechos confirmados. Una elección ya hecha no se sustituye por una entrega tardía.

Verificación del bloque: 463/463 Node, sintaxis y referencias aprobadas. Audio conserva 64 ausencias heredadas y cero nuevas; se actualizan solo índices de referencias. Primera pasada de navegador: 4/4 recorridos de producción en 360×800 y 915×412 (Matías y Rosa). Se ejecutará la matriz completa tras cerrar la prueba de salida de Rosa por los controles del inhibidor.

## Corrección encontrada por navegador

La primera matriz completa aprobó 75/77 casos. El aviso de Matías comprimía la lista comercial a 94.9 px en 915×412 y 60.6 px en 1366×768. Se mantiene la aserción de espacio de comercio y se acota el panel superior con scroll propio únicamente cuando muestra un enlace comunitario en disposición ancha. No se cambia el retrato, el comercio ni las reglas de compra. Los seis recorridos afectados (primer día, Matías y Rosa, en ambas pantallas) vuelven a aprobar. La matriz completa se repite sobre la corrección.

El delta de fuentes cargadas por la campaña, frente a 6233e1a, es 11.983 bytes sin comprimir incluyendo HTML, scripts afectados y la hoja del enlace. No se añaden imágenes, sonidos ni preloads. No es una medición de transferencia ni una nueva baseline de Render.

En la revisión visual se conserva el retrato de Ana identificado como autora de la solicitud recibida y la ubicación como copia firmada en Los Héroes. No se presenta a Ana como la responsable que atiende físicamente ese otro refugio. La conversación, los botones y el marco siguen siendo los compartidos de Encargos.

## Continuidad de producción

Para seguir: revisar el ritmo de estas dos conexiones dentro de una partida, sin añadir una tercera dependencia antes de observarlas; la activación no queda condicionada a una prueba A/B. La siguiente mejora técnica debería sustituir gradualmente los índices de escena por identificadores estables con pruebas de migración. Este bloque usa los puntos 9/10 y 18 existentes y no intenta reescribir el mapa de campaña. Persisten la deuda de audio, las pruebas en dispositivos reales y la medición humana de 30–60 minutos.


## Cierre de verificación

463/463 Node y validadores de sintaxis, referencias y audio aprobados. Matriz completa final: 77/77 E2E en las siete resoluciones, sin reintentos locales (9,8 minutos). Se revisaron capturas de portrait, landscape y desktop. Al expandir un aviso, el panel se desplaza hasta su comienzo para que el texto no quede oculto bajo las fichas; se comprueban nuevamente los 14 recorridos de producción tras ese detalle de lectura y el rótulo de Ana.

El navegador local utilizado fue Chromium 153 empaquetado por Sparticuz, sin añadir esa dependencia al repositorio ni desactivar las políticas de origen del navegador. La descarga de Playwright del entorno devolvía archivos incompletos. CI instala la versión de Chromium de Playwright fijada en el proyecto. Los checks remotos se consultan en el [PR #8](https://github.com/dbastias37/Neosantiago-rpg-demo/pull/8); no se confunde la validación local con una publicación en Render.

La revisión final de lectura aprueba **14/14 recorridos adicionales**, Matías y Rosa en las siete pantallas, después del ajuste de scroll y del rótulo. No aparecen errores JS, HTTP nuevos ni excepciones de consola.
