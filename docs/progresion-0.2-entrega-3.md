# Hacia 0.2 — tercera entrega: descubrir una red que responde

19 de septiembre de 2026. Esta entrega implementa progresión de Los Mensajeros y una consecuencia local de infraestructura. Se suma a la entrada narrativa y a la conexión del informe de Morales con Noa; no declara cerrados todos los pendientes de 0.2.

## El vacío que se corrige

La central exponía siete encargos, sus contactos y el atlas completo al entrar. El primer trabajo propuesto podía tener trece tramos; una extracción tenía veintiocho. No había diferencia entre haber llegado a la red y conocerla. Además, el recibo de Guzmán anunciaba defensas reparadas sin ofrecer una respuesta jugable propia en ese lugar.

Ahora el jugador comienza con una tarea breve cuyo propósito puede entender antes de aprender todo el sistema. La entrega abre conversaciones y recorridos; no se exige acumular un contador arbitrario ni repetir trabajos. Los lugares visitados y los recorridos presentados son estados distintos: recibir un itinerario permite consultarlo sin afirmar que ya se caminó.

## Recorrido implementado

| Trabajo | Tramos | Cuándo aparece | Qué abre |
| --- | ---: | --- | --- |
| Antes de que cambie el turno | 2 | Partida nueva, Los Héroes | Romero y Morales |
| Reserva de emergencia | 2 | Aviso del relevo entregado | Ana |
| Rastros del corredor | 4 | Aviso del relevo entregado | Ana; conserva el informe para Noa |
| Un paso para todos | 3 | Completar Romero **o** Morales | Beatriz y Guzmán |
| Lo que alimenta al norte | 4 | Acuerdo de Ana completado | Conserva la mejora de abastecimiento; rama opcional |
| Piezas para seguir en pie | 13 | Acuerdo de Ana completado | Jiménez y descanso abastecido en Plaza |
| Enlace de respaldo | 13 | Piezas de Guzmán entregadas | Adasme; conserva el apoyo de inhibidor |
| Fuera de contacto | 28 | Enlace de Jiménez entregado | Conserva el regreso del operativo; culminación del recorrido de encargos actual |

La bifurcación inicial importa: se puede ocuparse primero de una reserva médica o de observar un paso. Las dos dan acceso a la comunidad de Ana. Beatriz ofrece una alternativa corta antes de comprometerse con los talleres. El costo de tiempo y el itinerario completo de cada trabajo abierto siguen visibles antes de aceptar.

## La escena pequeña y su voz

Morales pide llevar una lista de relevo a La Moneda y volver con una respuesta. Una mujer necesita saber por qué su hermano no llegó. Rocío propone esperar confirmación; Bruno propone llevar la pregunta al regreso. El jugador conoce el tiempo de cada opción. El recibo recuerda lo que eligió, sin un premio moral ni una promesa de relación permanente que aún no existe.

La mujer tiene una necesidad independiente del jugador. Morales debe organizar personas que esperan y personas cansadas; su trabajo no es explicar una interfaz. La voz busca la relación entre vida comunitaria, tareas y preocupación concreta identificada en la lectura de la novela de la primera entrega. Esta escena es material de adaptación creado para el juego, no un episodio atribuido al libro.

## Plaza de Armas recuerda las piezas

Al completar Guzmán se conserva el hecho ya existente en `effects`. Los técnicos prueban el giro de la torreta; el guardia puede dejar su puesto para comer y Ana reserva un banco. En visitas posteriores:

- La llegada reconoce la reparación en el registro; la escena de punto de control también la reconoce cuando ese es el encuentro que corresponde.
- La ficha de Plaza explica la ayuda. Mara confirma la noticia al regresar a Los Héroes.
- El descanso consume el agua y la ración de la posta, sin quitar las del equipo. Mantiene diez minutos, recuperación habitual y un uso por parada.
- No se reduce la amenaza de todos los túneles ni se eliminan los encuentros del acceso: una guardia operativa protege una parada, no vuelve segura toda la ciudad.

El efecto se aplica también a una entrega de Guzmán que ya constaba como realizada en un guardado anterior. No se vuelve a pagar. El reinicio de Encargos retira esta infraestructura, sus descubrimientos y los pagos de ese equipo; conserva la regla anterior respecto de informes ya recibidos por la expedición.

## Interfaz y persistencia

El catálogo solo muestra trabajos conocidos, ordena primero los pendientes y sus trayectos más cortos, y distingue entregados, disponibles y en curso. El mapa se construye con los itinerarios abiertos y los lugares recordados; ya no muestra el atlas completo por detrás. Reutiliza la tipografía, tonos, puntos de control y marcador existentes. Ajusta el encuadre a la red conocida y permite acercar y centrar. Los puntos visitados se distinguen por borde y etiqueta accesible.

Al entregar se muestran los nuevos trabajos y la razón del contacto, con acceso directo a elegir el siguiente. El panel resume entregas, trabajos conocidos, lugares visitados y una pista concreta. Un contador de conocidos no equivale a un contador de trabajos terminados. No hay paredes de tarjetas bloqueadas que adelanten todas las historias.

`progression.mjs` es la fuente común de disponibilidad para motor, catálogo, contactos, itinerarios y mapa. El campo `progression` versionado se añade sin reemplazar el formato del guardado ni las posiciones de las rutas anteriores. Las partidas sin ese campo recuperan sus entregas y conservan el encargo iniciado, fallido o abandonado. Se mantienen los caminos de regreso a Los Héroes desde una ubicación guardada: cerrar un contacto no debe dejar a un equipo sin salida. Los recibos, mochilas y recompensas anteriores no se fabrican ni se borran durante esa migración.

El mundo de Encargos continúa separado materialmente de la expedición. La nueva reparación produce una consecuencia local y una noticia de Mara en Encargos; no añade un segundo beneficio importado a la campaña. Noa conserva la conexión ya implementada con el informe de Morales.

## Fundamento y límites

[Emily Short, Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/), consultado de nuevo para esta entrega, propone organizar contenido mediante condiciones y efectos. Aquí se concreta en una regla legible: una entrega produce un aviso, ese aviso abre un contacto y una visita puede reconocer el cambio. No se añade un segundo motor narrativo.

Los criterios de voz, elección informada y autonomía se mantienen documentados, con sus fuentes y límites, en [narrativa-0.2.md](narrativa-0.2.md). La hipótesis es que una tarea comprensible, una opción real entre trabajos y un cambio visible facilitan orientación y sensación de capacidad. No hay todavía una medición de retención ni una prueba con participantes; las verificaciones técnicas no demuestran esas respuestas psicológicas.

## Verificación

247 pruebas automatizadas aprobadas, incluidas trece nuevas: inicio con un único trabajo, ambas respuestas del relevo, pagos únicos, ausencia de avance al abandonar o reintentar, caminos alternativos hasta Ana, recorrido completo desde cero hasta la extracción, migración de partidas activas/fallidas/abandonadas y recibos antiguos, regreso al mercado, descanso de Plaza sin generar suministros, reconocimiento al volver, datos inválidos, reinicio y catálogo/mapa tras recarga. También se mantienen las pruebas de combate, perfiles, mochilas y continuidad con Noa.

Las pruebas unitarias de combate y economía usan explícitamente un escenario con contactos establecidos, sin inventar pagos ni experiencia. Las pruebas de progresión recorren el juego nuevo sin ese escenario. Sintaxis de módulos y `git diff --check` comprobados. La revisión de la versión publicada confirmó la migración de un informe de Morales anterior, el inicio con una única oferta, el mapa de dos estaciones y la lectura en formato vertical de 390 × 844.

## Siguiente vacío a abordar

La red todavía resume el traslado previo al punto de salida de ciertos encargos mediante un relevo. La oferta lo explica ahora; no presenta ese traslado como un tramo recorrido por el jugador. Convertirlo en un viaje completo requiere diseñar trayectos de incorporación sin duplicar recorridos largos ni castigar la elección de otra misión. No se ha alterado silenciosamente la posición de encargos ya guardados.

La próxima entrega debería trabajar la conversación de regreso del operativo rescatado: qué necesita al volver, cómo responde Adasme y qué escena posterior reconoce esa presencia. Eso aportaría una consecuencia de persona, distinta del informe de Morales y de la infraestructura de Plaza. El calendario de tres días y el equilibrio moral/recursos de la expedición siguen siendo pendientes propios; esta actualización no los da por resueltos.
