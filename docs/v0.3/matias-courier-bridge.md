# La reserva de Vicuña — bloque de conexión en revisión

Base contrastada: `main` e121ed1. Suite inicial: 436/436. Rama: `feature/v0.3-matias-courier-bridge`.

## Acuerdo narrativo

Matías ya fue rescatado: no se borra esa decisión ni se retira su mapa o frecuencia. La posta necesita completar su atención. Sara solicita una reserva identificada en Vicuña; los Mensajeros pueden transportarla. Adasme, cuyo equipo está desplegado, mantiene la búsqueda de Darío. Ambas necesidades comparten territorio y personas, pero la reserva no es el precio de una vida: se puede recoger sin completar el rescate. Ayudar también a Darío cambia el reconocimiento de Adasme y la conversación posterior.

La solicitud se ofrece en la preparación después de cerrar la primera noche, solo si Matías llegó. Aceptar presenta el cambio de equipo y abre exclusivamente el contacto de Adasme, sin fingir cinco encargos previos. Las mochilas, heridas, plazos, combates, compuertas y decisiones del rescate conservan sus reglas. No se sustituye un encargo en curso.

La reserva es carga protegida, separada de los consumibles y los pagos. Se recoge físicamente en Vicuña y se entrega físicamente en Los Héroes. Cada equipo escribe únicamente su propio guardado. La campaña importa una recepción persistida y ligada a su solicitud; Sara verifica la entrega. Matías sigue al cuidado de la posta y puede precisar un acceso a República: no queda mágicamente sano ni sale de expedición. Su información habilita una opción discreta en «La primera luz»; llegar después no modifica decisiones pasadas.

## Comparación A/B

El laboratorio emplea claves separadas por variante. La campaña habitual no activa el episodio. A espera el relevo antes de salir si el jugador aceptó hacerse cargo; permite devolver la coordinación a la posta, liberando la salida sin inventar una entrega. B permite continuar y solo condiciona la nueva opción de República. La conversación explica la diferencia antes de aceptar. Los dos permiten rechazar el compromiso y terminar encargos pendientes.

El tiempo de los encargos sigue siendo duración del viaje y plazo de la extracción, no un reloj universal sincronizado con las horas de la campaña. El episodio se presenta como un relevo paralelo; los encabezados de la segunda jornada pasan a expresar el orden de los sucesos cuando hay una solicitud activa. No se añade muerte por temporizador oculto. Hace falta una sesión humana para evaluar duración y motivación: automatizar el recorrido no prueba una experiencia de 30–60 minutos.

## Contrato y compatibilidad

Módulo puro compartido para solicitud, recogida, recepción y validación. Campo opcional `matiasBridge` en cada guardado; se conservan esquema 3 y esquema 1 respectivamente. Identificador único por solicitud y equipo transportista. No se genera un episodio al migrar partidas existentes. Lecturas incompatibles se rechazan sin reemplazar el estado. Las operaciones del puente se confirman en almacenamiento antes de mostrar éxito; repetirlas no duplica efectos. Una partida nueva invalida los recibos antiguos al reiniciar ambos ámbitos del laboratorio.

Adaptadores pequeños para campaña y Mensajeros. Diálogo integrado en el refugio y en el modal de conversación de encargos; navegación física mediante las rutas existentes. Sin inventario, combate, mapa ni comercio paralelos. Sin assets nuevos, audio generado ni preload adicional.

## Alcance

Este bloque implementa y prueba Matías–Adasme. Rosa/Sorsa queda como siguiente conexión: no se cambia su contenido ni se extiende un bloqueo a toda la campaña. Las cuatro direcciones finales y sus condiciones siguen intactas.

## Referencias de escritura

Emily Short: [Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/), [Pacing Storylet Structures](https://emshort.blog/2019/11/30/pacing-storylet-structures/). Se aplican requisitos locales, memoria de hechos y convergencia, no un árbol de ramas duplicadas. Las líneas se escriben desde necesidades concretas: Sara necesita una entrega verificable, Adasme recuperar a una persona, Matías saber quién volvió.

## Verificación y pendientes

Se actualizará al cerrar cada bloque. Requeridos: idempotencia, guardado antiguo, almacenamiento fallido, recibo ajeno, entrega tardía, rescate ya pagado, encargo en curso, cancelación, A/B aislados y navegador en las siete resoluciones. Queda pendiente aprobación narrativa y prueba humana A/B antes de activar el episodio en la campaña habitual.

## Bloque implementado: contrato y adaptadores

448/448 pruebas Node aprobadas (436 previas y 12 nuevas). El recorrido nuevo se ejecuta con un equipo recién creado, hasta Vicuña y de vuelta, usando el motor de viajes y encuentros existente. También se verifica el recibo de un rescate real ya completado, sin nuevo pago. Pruebas de almacenamiento, migración, aislamiento, ingreso tardío y memoria de Noa aprobadas. Sintaxis y referencias sin errores nuevos; el inventario de audio solo cambia sus líneas de referencia (64 archivos ausentes heredados).

La alternativa de Matías adopta la postura de observación de Noa: no salta el enfrentamiento posterior de la Alameda ni crea otra categoría incompatible en su registro. Se conserva la conversación de regreso de Darío, independiente de la recogida médica. El laboratorio está en `labs/community-bridge/`; permite iniciar una escena de ensayo claramente identificada o jugar desde el comienzo.
