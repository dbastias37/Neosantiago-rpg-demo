# La reserva de Vicuña — conexión de campaña

Base contrastada: `main` e121ed1. Suite inicial: 436/436. Rama: `feature/v0.3-matias-courier-bridge`.

## Acuerdo narrativo

Matías ya fue rescatado: no se borra esa decisión ni se retira su mapa o frecuencia. La posta necesita completar su atención. Sara solicita una reserva identificada en Vicuña; los Mensajeros pueden transportarla. Adasme, cuyo equipo está desplegado, mantiene la búsqueda de Darío. Ambas necesidades comparten territorio y personas, pero la reserva no es el precio de una vida: se puede recoger sin completar el rescate. Ayudar también a Darío cambia el reconocimiento de Adasme y la conversación posterior.

La solicitud se ofrece en la preparación después de cerrar la primera noche, solo si Matías llegó. Aceptar presenta el cambio de equipo y abre exclusivamente el contacto de Adasme, sin fingir cinco encargos previos. Las mochilas, heridas, plazos, combates, compuertas y decisiones del rescate conservan sus reglas. No se sustituye un encargo en curso.

La reserva es carga protegida, separada de los consumibles y los pagos. Se recoge físicamente en Vicuña y se entrega físicamente en Los Héroes. Cada equipo escribe únicamente su propio guardado. La campaña importa una recepción persistida y ligada a su solicitud; Sara verifica la entrega. Matías sigue al cuidado de la posta y puede precisar un acceso a República: no queda mágicamente sano ni sale de expedición. Su información habilita una opción discreta en «La primera luz»; llegar después no modifica decisiones pasadas.

## Variante de producción y regresión A/B

Desde el bloque de producción del 24 de septiembre se activa B en la campaña habitual por autorización del usuario. El laboratorio conserva claves separadas para regresiones. A espera el relevo antes de salir si el jugador aceptó hacerse cargo; permite devolver la coordinación a la posta, liberando la salida sin inventar una entrega. B permite continuar y solo condiciona la nueva opción de República. La conversación explica la diferencia antes de aceptar. Los dos permiten rechazar el compromiso y terminar encargos pendientes.

El tiempo de los encargos sigue siendo duración del viaje y plazo de la extracción, no un reloj universal sincronizado con las horas de la campaña. El episodio se presenta como un relevo paralelo; los encabezados de la segunda jornada pasan a expresar el orden de los sucesos cuando hay una solicitud activa. No se añade muerte por temporizador oculto. Hace falta una sesión humana para evaluar duración y motivación: automatizar el recorrido no prueba una experiencia de 30–60 minutos.

## Contrato y compatibilidad

Módulo puro compartido para solicitud, recogida, recepción y validación. Campo opcional `matiasBridge` en cada guardado; se conservan esquema 3 y esquema 1 respectivamente. Identificador único por solicitud y equipo transportista. No se genera un episodio al migrar partidas existentes. Lecturas incompatibles se rechazan sin reemplazar el estado. Las operaciones del puente se confirman en almacenamiento antes de mostrar éxito; repetirlas no duplica efectos. Una partida nueva invalida los recibos antiguos al reiniciar ambos ámbitos del laboratorio.

Adaptadores pequeños para campaña y Mensajeros. Diálogo integrado en el refugio y en el modal de conversación de encargos; navegación física mediante las rutas existentes. Sin inventario, combate, mapa ni comercio paralelos. Sin assets nuevos, audio generado ni preload adicional.

## Alcance

El primer bloque implementó Matías–Adasme. El bloque de producción añade Rosa–Ana, documentado en `community-links-production.md`; no existe un personaje Sorsa en el contenido vigente. Ninguna de las dos conexiones bloquea toda la campaña. Las cuatro direcciones finales y sus condiciones siguen intactas.

## Referencias de escritura

Emily Short: [Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/), [Pacing Storylet Structures](https://emshort.blog/2020/01/21/pacing-storylet-structures/). Se aplican requisitos locales, memoria de hechos y convergencia, no un árbol de ramas duplicadas. Becky Slitt: [How to Write Intentional Choices](https://www.choiceofgames.com/2016/12/how-to-write-intentional-choices/), aplicado a explicar antes de aceptar qué espera, qué sigue abierto y qué oportunidad puede perderse. Las líneas se escriben desde necesidades concretas: Sara necesita una entrega verificable, Adasme recuperar a una persona, Matías saber quién volvió.

## Verificación y pendientes

Se actualizará al cerrar cada bloque. Requeridos: idempotencia, guardado antiguo, almacenamiento fallido, recibo ajeno, entrega tardía, rescate ya pagado, encargo en curso, cancelación, A/B aislados y navegador en las siete resoluciones. La prueba humana A/B dejó de ser requisito de activación por decisión expresa del usuario; la evidencia automática y sus límites se registran en `community-links-production.md`.

## Bloque implementado: contrato y adaptadores

448/448 pruebas Node aprobadas (436 previas y 12 nuevas). El recorrido nuevo se ejecuta con un equipo recién creado, hasta Vicuña y de vuelta, usando el motor de viajes y encuentros existente. También se verifica el recibo de un rescate real ya completado, sin nuevo pago. Pruebas de almacenamiento, migración, aislamiento, ingreso tardío y memoria de Noa aprobadas. Sintaxis y referencias sin errores nuevos; el inventario de audio solo cambia sus líneas de referencia (64 archivos ausentes heredados).

La alternativa de Matías adopta la postura de observación de Noa: no salta el enfrentamiento posterior de la Alameda ni crea otra categoría incompatible en su registro. Se conserva la conversación de regreso de Darío, independiente de la recogida médica. El laboratorio está en `labs/community-bridge/`; permite iniciar una escena de ensayo claramente identificada o jugar desde el comienzo.

## Revisión de narrativa e interfaz

La nueva opción mantiene la postura de observación de Noa y se oculta si ya se acordó cualquier ruta; no permite elegir dos veces ni saltar la Alameda. La segunda noche captura el comprobante médico en su contexto, distinguiendo rescate confirmado de destino desconocido de Darío. La primera noche cerrada no se reescribe. El epílogo recuerda la reserva sin declarar el alta de Matías.

Los botones del refugio usan sus clases y variables visuales existentes. La ficha y el comercio de Mensajeros continúan usando sus adaptadores compartidos. El panel de campaña se elimina del refugio comercial de Mensajeros: la entrega se gestiona desde la conversación del relevo, no desde una segunda copia sin comportamiento. No se añaden imágenes ni sonidos.

La primera pasada E2E detectó dos errores del conductor: usar la carpeta sin `index.html` en el servidor estático, y seleccionar a la vez el cierre superior y «Volver al mapa». Se corrigieron los localizadores y se volvió a ejecutar. Los seis casos A/B y delegación en 360×800 y 915×412 pasan, incluyendo ficha compartida y comercio; la matriz completa se registra al finalizar.

## Entrega para revisión

Node: **453/453**. Sintaxis, referencias y catálogo de audio: aprobados, sin referencias ausentes nuevas. El conjunto E2E tiene **63 casos**: 42 previos y 21 del puente (A, B y delegación en las siete resoluciones). Usa `npm run test:e2e`; CI ejecuta la misma matriz y conserva capturas/trazas. El resultado de la ejecución completa para cada revisión se consulta en [NeoSantiago QA](https://github.com/dbastias37/Neosantiago-rpg-demo/actions/workflows/qa.yml); los seis casos específicos en 360×800 y 915×412 ya se verificaron localmente, además de la inspección visual de sus capturas.

Los casos de navegador preparan llegadas usando el motor real y comprueban recogida/entrega mediante botones, recarga, guardado, cambio de actividad, inventario y refugio compartidos. No son una sesión humana ininterrumpida. Node recorre los trayectos completos, incluyendo tres semillas de rescate con un equipo nuevo y sin cinco pagos previos. La suite previa conserva los recorridos del primer día hechos mediante UI.

Se añaden 12.7 KiB sin comprimir entre los tres scripts de campaña y la hoja específica (12,991 bytes); no aumenta el preload de imágenes ni se incorpora audio. Esta cifra es peso estático, no una nueva medición de rendimiento en Render.

Para revisar: `npm ci`, `npm run qa:serve`, abrir `http://127.0.0.1:4173/labs/community-bridge/index.html`. Cada botón prepara su propia variante y conserva una copia anterior. En el juego, «Continuar» lleva al refugio; abrir «Matías · La reserva de Vicuña». Probar recoger directamente, combinar con Darío, dejar la coordinación, llegar tarde y recargar. Jugar desde el comienzo permite comprobar la entrada natural tras rescatar a Matías.

Decisión posterior: B seleccionada y activada en la campaña habitual. Rosa–Ana se incorpora como segunda conexión en la preparación de la tercera jornada. No se generan solicitudes ni recepciones al cargar partidas antiguas: se ofrecen en los puntos narrativos compatibles. Siguen sin medirse con jugadores la duración y el balance del enlace largo; no son una prueba A/B que el usuario deba realizar antes de jugar este bloque.
