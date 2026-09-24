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
