# Neo Santiago 2130 — informe de continuidad hacia V0.2

**Fecha:** 19 de septiembre de 2026. **Repositorio:** `dbastias37/Neosantiago-rpg-demo`. **Rama de entrega:** `main`.

**Código revisado:** `9fe232706c61334209f5a20941a4ed66bdebad3f`, posterior al rediseño de los primeros recorridos y al ajuste del catálogo. Este documento se incorpora en un commit posterior que contiene documentación; no cambia el juego.

Este es el punto de entrada para continuar en otro chat. Resume lo implementado, diferencia los antecedentes históricos del estado vigente y deja un alcance propuesto para el siguiente bloque. Cuando el código cambie después de esta revisión, actualizar este informe con la nueva evidencia.

## Estado vigente — entrega 15: Jiménez

Se completa [Jiménez y Enlace de respaldo](docs/jimenez-0.2-entrega-15.md): decisiones sobre el registro del relevo y la prueba en Tobalaba, cuatro recepciones, y regreso físico a Vicuña con conversación condicionada por los resultados. Se distingue recepción de respuesta local y de conexión completa. Se preservan ruta, pago, beneficios y contratos históricos. Suite completa: **376 pruebas aprobadas**. Primer bloque de los cuatro propuestos para el cierre de V0.2 completado. Quedan **tres bloques propuestos**: continuidad de la red; escasez y ritmo en partidas normales; revisión final y cierre. La versión sigue abierta. Los apartados posteriores son historial y pueden contener pendientes ya resueltos: no volver a implementar Beatriz, Guzmán o Jiménez ni los siete bloques visuales. El laboratorio de compuertas sigue separado.

## Retrato definitivo de Varela (21 de septiembre)

El usuario eligió al abuelo con sombrero y manta de lana, sentado con su cuaderno en el archivo. Se reemplaza el recurso compartido `portraits/npc-varela.webp` por la imagen aprobada, conservando el encuadre completo en el archivo. Introducción y diálogos usan la misma versión con URL renovada. Varela se describe como anciano del consejo; las referencias personales se ajustan al masculino. Se conservan nombre, papel narrativo, decisiones e identificadores de guardado. Las variantes con abrigo tecnológico no son la elección final.

## Bloque visual 7 — inicio, actividades, ayudas y desenlaces (21 de septiembre)

`journey-surfaces.css` conserva paleta, tipografía y textura aprobadas con superficies diferenciadas: portada sobre escena, selección como mesa de despacho, ayudas como manual y finales como informe. Actividades distingue Expedición en ámbar y Mensajeros en cian. Los finales recuperan lectura amplia y desplazamiento natural; las acciones se adaptan al móvil. Se conservan textos, controles, reglas y guardados. `tests/journey-surfaces-preview.html` permite revisar siete pantallas en cuatro tamaños, con almacenamiento en memoria en un iframe sin acceso a partidas. Verificación dirigida: 9 pruebas aprobadas de actividades e historia del mundo; Revisión visual publicada: actividades en escritorio y móvil, desenlace e informe en 360 px; el informe no tiene desbordamiento horizontal y permite regresar a Actividades. La muestra de ayuda prepara primero la introducción, como exige el flujo real. No cierra V0.2 ni integra el laboratorio de compuertas. El siguiente bloque narrativo pendiente sigue siendo Jiménez, después de las entregas de Beatriz y Guzmán documentadas más abajo.

## Actualización vigente — interfaz de mapa (20 de septiembre de 2026)

El mapa de Mensajeros ahora se presenta como una [pantalla montada en un panel de navegación](docs/mapa-panel-0.2.md), con carcasa de metal oscuro, cristal casi negro, indicadores de destino y red conocida, escala visible y controles físicos. La paleta vigente es la del modal de encargos elegida por el usuario en su última captura: fondo negro con matiz verde (`#090e0c`), texto marfil, rótulos cian y acción principal de ámbar claro. Esta elección sustituye tanto la primera paleta oliva como la prueba posterior de acero gris azulado. Los textos usan la misma familia tipográfica del juego. Encargo, suministros y registro acompañan ese acabado, sin cambiar la estructura del panel. Se conservan los retratos completos, las rutas, los pagos y la compatibilidad de los guardados. La suite vigente tiene **359 pruebas aprobadas**; esta revisión posterior solo modifica presentación. Extender el acabado al resto del juego queda pendiente de la revisión del usuario.

**Acabado de óxido:** se generó y montó una textura WebP propia sobre la carcasa central del mapa, con desgaste concentrado en bordes y tornillos. Conserva la paleta del modal y no cubre el cristal, los retratos ni los compartimentos de lectura. La imagen y sus instrucciones quedan en el repositorio; el resto de la web no recibe esta textura. Detalles en [interfaz del mapa](docs/mapa-panel-0.2.md).

**Interfaz por bloques — bloque 1:** completado el acabado de los marcos de Encargos: cabecera, encargo activo, grupo y suministros y registro reutilizan la misma textura del mapa, sin cambiar formas, colores, fuentes ni distribución. El siguiente bloque propuesto es actualizar las ventanas de encargos y refugios; requiere la revisión del usuario antes de continuar. El resto de pantallas conserva su acabado actual.

**Bocetos A/B antes del bloque 2:** se añaden dos propuestas funcionales aisladas en `labs/encargos-ab/`: A, registro de operaciones con bandas y ficha modal; B, índice de contactos y expediente visible. Comparten tres encargos reales como muestra y los mismos retratos, textos y pagos. Incluyen filtros, rutas, confirmación de prueba y vista móvil. No leen ni escriben partidas. El 21 de septiembre el usuario eligió B (Expediente) y pidió eliminar los filtros Todos/Centro/Norte de esa versión. B muestra siempre la lista completa de la muestra, incluso al cambiar desde A con un filtro activo. El usuario autorizó después su integración: el catálogo real y «Ver encargo» ahora abren el expediente B, sin filtros, con todos los contactos que la partida haya desbloqueado. `dossier.mjs` consume el motor de producción y mantiene traslado previo, plazos aceptados, recepción de carga, reanudación y resultados. El laboratorio A/B sigue separado como referencia; el de compuertas no se integra. Las ventanas de refugios se completan en la actualización descrita a continuación; el resto de bloques sigue pendiente. La integración supera 29 pruebas dirigidas de presentación, preparación, progresión y economía; el expediente no modifica el guardado al consultarlo.

**Bloque 2 — Refugios y conversaciones (21 de septiembre):** se completa la presentación de la red con comunidades agrupadas, función del puesto, situación del equipo y contactos descubiertos. `community.mjs` / `community.css` usan la paleta aprobada y óxido en la cabecera, pero ofrecen una conversación con retrato completo y texto amplio, distinta del expediente. Se conserva la información del mapa, la memoria de comunidad, los seguimientos de Beatriz y Adasme y sus acciones existentes. No se añaden servicios, viajes gratuitos ni pagos. Volver desde un contacto abre su refugio; desde el refugio se puede regresar a la red o al mapa. 31 pruebas dirigidas aprobadas de presentación, desbloqueos, regreso de Darío y economía/seguimiento de Beatriz. El siguiente bloque visual es Equipo e inventario; Mara/Armero y las demás pantallas siguen pendientes.

**Bloque 3 — Equipo e inventario (21 de septiembre):** `profile-field.css` actualiza la superficie compartida de Expedición y Mensajeros, importada por `profile-loader.mjs` desde el HTML principal. Marco metálico oscuro con desgaste en bordes, título marfil, retrato completo, protección separada y mochila con compartimentos de textura sutil. Los nombres, descripciones y botones de objetos aumentan de tamaño. La cabecera permanece accesible al desplazar la ficha; los anchos intermedios reorganizan las columnas y el teléfono conserva una sola columna con inventario desplazable. Se adapta también la presentación de transferencia, descarte e inspección desde la ficha. No se cambia el motor, el guardado ni el renderizador compartido: equipar, usar, transferir, cancelar descarte, crafteo y habilidades mantienen sus reglas. 29 pruebas dirigidas aprobadas de equipo Mensajero, inspección y estabilidad del juego. Próximo bloque visual: Mara y el Armero.

**Bloque 4 — Mara y el Armero (21 de septiembre):** `refuge-stalls.css` aplica el acabado compartido al refugio de Expedición y Mensajeros. Mara tiene compartimentos de almacén con acentos ámbar; el Armero usa acero oscuro y señales cian, siguiendo la pestaña seleccionada del sistema actual. Se conserva la paleta, tipografía y retratos completos, con marcos oxidados, precios y descripciones más legibles, tarjetas de altura flexible y listas desplazables. Los controles de compra, venta, destinatario, recuperación, equipo y regreso siguen ligados a sus reglas originales. No hay cambios de inventario, precios, stock ni servicios. 10 pruebas dirigidas aprobadas de comercio Mensajero, ayuda y personajes del refugio. Próximo bloque visual: combate y saqueo.

**Bloque 5 — Combate y saqueo (21 de septiembre):** `combat-field.css` aplica la paleta compartida a Expedición y Mensajeros sin alterar la geometría de las cartas ni las reglas de turno. Consola táctica oscura, aliados cian, amenazas rojizas y acciones ámbar; el saqueo usa compartimentos sólidos, descripciones legibles, capacidad visible y salida fija fuera de la lista desplazable. Óxido limitado al borde del contenedor de recuperación. Se conservan objetivos, animaciones, munición, recogida, descarte y guardados. 34 pruebas dirigidas aprobadas de combate, adaptación Mensajera y suministros. `tests/combat-preview.html` permite revisar combate y saqueo reales con almacenamiento en memoria dentro de un iframe aislado sin acceso al guardado del jugador. Próximo bloque visual: expedición y decisiones narrativas.

**Revisión del combate como dispositivo (21 de septiembre):** a petición del usuario, el bloque 5 incorpora metal más oscuro y relieve en los marcos señalados (cabecera, visor, selector y consola), manteniendo la disposición de cartas. La textura existente se oscurece por CSS, sin cargar otra imagen. El registro tiene cristal hundido, reflejo y líneas de pantalla estáticas muy sutiles. «Avanzar» queda en el marco físico a la derecha en escritorio y debajo del cristal en teléfono; conserva su estado deshabilitado y control con Enter. El ajuste de altura mide el ancho útil del cristal para mostrar los relatos completos. Exploración y Mensajeros consumen los mismos estilos y presentación, sin variantes duplicadas ni cambios de reglas. El laboratorio de compuertas continúa separado.

**Prueba A/B de Expedición (21 de septiembre):** antes de integrar el bloque 6, el usuario pidió comparar dos propuestas funcionales. `labs/expedicion-ab/` ofrece A (Bitácora: relato con equipo al costado) y B (Escena: imagen panorámica y decisiones en franja inferior). Ambas comparten tres situaciones reales, condiciones y vista previa de decisiones; conservan situación y selección al cambiar de diseño. Se pueden revisar posibles resultados sin ejecutar tiradas ni combates y probar la adaptación a 390 px. Usa imágenes existentes y datos estáticos extraídos de `eventDisplay`; no carga el motor, no toca partidas ni se integra en el menú. El usuario eligió A (Bitácora); su integración se describe a continuación.

**Bloque 6 — Bitácora de Expedición (21 de septiembre):** se integra la opción A con `expedition-journal.css`, manteniendo la paleta, fuente y textura aprobadas. Ubicación, objetivo, equipo y recursos acompañan al relato y las decisiones; en móvil la lectura y sus opciones preceden al estado del grupo. Los retratos se muestran completos. Los valores, documentos contextuales, condiciones, costes, fichas e inhibidor siguen usando el renderizador de campaña. Cada nueva situación comienza arriba; consultar inventario conserva la posición de lectura. No se importan datos estáticos ni vistas previas del laboratorio, ni se cambian reglas, narrativa o guardados. `tests/expedition-preview.html` permite revisar tres escenas reales con almacenamiento en memoria y un iframe aislado sin acceso a partidas. 40 pruebas dirigidas aprobadas de decisiones, actividades y estabilidad. La prueba A/B y el laboratorio de compuertas se conservan separados. Próximo bloque visual propuesto: inicio, actividades, ayuda y desenlaces, sujeto a revisión del usuario.

**Laboratorio separado:** los [tres paneles de compuertas con quince acertijos](docs/laboratorio-compuertas-0.2.md) siguen disponibles por URL directa en `labs/compuertas/`. El usuario pidió conservarlos en el repositorio para una futura implementación. El mapa toma su lenguaje visual, sin importar su código ni integrar compuertas a viajes, combates o guardados de la campaña. Guzmán se profundiza en la entrega 14; Jiménez sigue pendiente.

### Narrativa y economía — entrega 13

Se incorporan [Beatriz, economía y retratos completos](docs/beatriz-economia-0.2-entrega-13.md). Esta actualización sustituye como siguiente tarea la propuesta de Beatriz de las secciones 10, 11 y 14, conservadas abajo como historia de la revisión del 19 de septiembre.

Beatriz responde a cómo protegieron la reserva y a la preparación de Luz, su aprendiz, con cuatro recepciones combinadas. La visita posterior a Libertadores se realiza por la red física y recuerda ese resultado, sin otro pago. Los encargos anteriores conservan su versión narrativa.

La moneda ahora se llama Créditos en todo el juego. Los pagos máximos de los ocho encargos bajan de 296 a 134 (−54,7 %); las penalizaciones nuevas son de 1 Crédito por cada 5 minutos de demora, hasta el 50 %. Los saldos y los contratos ya aceptados se conservan. La tienda de Mensajeros aún no tiene stock limitado: este bloque reduce las recompensas, sin declarar resuelta toda la economía.

Los retratos junto al mapa y de contactos se muestran completos y sin degradado superpuesto. La ayuda ya describe los tres tramos iniciales. La suite actual tiene 353 pruebas aprobadas. Detalles de compatibilidad, límites y revisión visual en el documento de entrega.

**Continuación de la entrega 13:** Guzmán se completa en el bloque descrito a continuación. Jiménez y la evaluación humana del balance siguen pendientes. No volver a implementar Beatriz ni cambiar recompensas históricas. V0.2 sigue abierta.

### Narrativa — entrega 14: Guzmán

Se integra [Guzmán y la recepción de Plaza](docs/guzman-0.2-entrega-14.md). Dos decisiones sobre identificación del rotor reparado y sujeción del cable del sensor producen cuatro recepciones. Los técnicos distinguen lo probado en el banco de lo comprobado al montar las piezas. Tras entregar, el equipo puede llevar físicamente el comprobante a Los Leones: Guzmán responde al recorrido y conserva como pendiente la revisión que nadie ha observado todavía. Se mantienen ruta, carga, pagos y descanso abastecido en Plaza. Los contratos previos conservan su contenido; no se inventa continuidad retroactiva. La suite completa tiene **371 pruebas aprobadas**, incluido el flujo DOM de visita. No se modificó el diseño de las pantallas.

**Siguiente paso acordado:** retomar lo visual después de este bloque. El próximo pendiente narrativo es Jiménez; los apartados históricos que todavía proponen Beatriz o Guzmán no describen el estado vigente.

## 1. Estado real del proyecto

El repositorio contiene una experiencia jugable con expedición narrativa de tres días y una actividad de encargos con otro equipo. Hay decisiones, combate, recursos, equipo, progresión, guardado, retornos y desenlaces. La actualización hacia V0.2 ha trabajado especialmente las conexiones entre decisiones y consecuencias, la personalidad de los personajes, el descubrimiento de rutas y la presentación.

**V0.2 sigue en desarrollo. No se ha declarado terminada ni se ha demostrado una mejora de retención.** Que una partida pueda completarse y que sus estados sean consistentes no demuestra que el jugador disfrute cada tramo, comprenda todas las consecuencias o quiera seguir jugando.

El problema central ha sido la sensación de vacío entre acciones: encargos que parecían trámites, viajes repetidos, NPC que recibían objetos sin reaccionar y diálogos que olvidaban lo sucedido. Ahora existen conexiones concretas que corrigen parte de eso. La cobertura sigue siendo desigual: el inicio de Mensajeros y algunos arcos de la expedición tienen más continuidad que las entregas largas y las segundas visitas.

Juego principal: [Neo Santiago 2130](https://neosantiago-rpg-demo.onrender.com/neosantiago-demo.html). Actividad revisada en navegador: [Los Mensajeros](https://neosantiago-rpg-demo.onrender.com/extensions/mensajeros/play.html). También se verificó el despliegue en el dominio `rpg-neosantiago.onrender.com`. Libro de referencia: [Neo Santiago 2130](https://neo2130.onrender.com/).

Los guardados son locales al navegador y al origen web. Los dos dominios no deben tratarse como si compartieran automáticamente una partida.

## 2. Intención del usuario y criterios que deben conservarse

El objetivo es un RPG narrativo coral de decisiones, con personajes que tengan necesidades, límites, desacuerdos y formas de entender el mundo. La escritura debe ser humana y concreta, sin frases poéticas vacías, moralejas al final de cada escena ni diálogos que solo expliquen reglas.

El libro orienta la identidad de la adaptación. Las situaciones creadas para el juego no deben presentarse como episodios literales de la novela. Lo que un personaje sabe necesita una fuente y un momento de conocimiento. Una observación, un registro antiguo, una promesa y un resultado confirmado son hechos distintos.

Las rutas se descubren mediante trabajos y contactos. El usuario rechazó que todo estuviera disponible al comenzar y, posteriormente, que esa progresión dependiera de recados mínimos entre refugio y estación vecina. También describió Libertadores–Vicuña como lento, tedioso y repetitivo. La respuesta de diseño debe aportar propósito, diferencias entre sectores y consecuencias; añadir estaciones o combates por sí solo no resuelve el problema.

La expedición y Mensajeros deben reconocerse como partes del mismo juego. Deben compartir lenguaje visual y presentación de sistemas, respetando sus equipos e inventarios separados. No crear otra interfaz de combate, equipo o comercio sin revisar primero las existentes.

El trabajo se realiza por bloques: anunciar su alcance antes de implementarlo, comprobarlo, documentarlo e integrarlo a `main`. El usuario ya autorizó cambios e integración para esta actualización. Esa autorización no convierte las propuestas de este informe en funcionalidades ya realizadas. La petición que originó este documento fue registrar el estado para continuar en otro chat.

## 3. Qué se ha implementado

| Entrega | Cambio incorporado | Resultado y límite |
| --- | --- | --- |
| [1 · Entrada y voz](docs/narrativa-0.2.md) | Introducción, presentación del grupo y orden del archivo de historia. | Sitúa necesidades y distingue adaptación de canon. No supone que toda la prosa posterior esté revisada. |
| [2 · Informe de Morales](docs/continuidad-0.2-entrega-2.md) | Una entrega confirmada de Mensajeros llega como información a la expedición. | Noa puede preparar una salida según lo comprobado; beneficio de un solo uso. No comparte mochilas ni paga dos veces. |
| [3 · Descubrimiento](docs/progresion-0.2-entrega-3.md) | Apertura gradual de trabajos, contactos y mapa; reparación de Plaza con efecto persistente. | Conocido y visitado son estados distintos. Su primer encargo corto fue sustituido en la entrega 12. |
| [4 · Darío](docs/regreso-0.2-entrega-4.md) | Conversación de llegada con Adasme y respuesta posterior del rescatado. | Recuerda cómo volvió y cómo se escuchó su versión. No es otro pago por extraerlo. |
| [5 · Traslados](docs/traslados-0.2-entrega-5.md) | Viaje físico al origen de los encargos y preparación alternativa en Tobalaba. | Llegar no acepta automáticamente el trabajo. El plazo del encargo empieza al aceptarlo. |
| [6 · Descanso](docs/descanso-0.2-entrega-6.md) | Decisiones nocturnas sobre reservas, recuperación y continuidad al recargar. | Corrige saltos y liquidaciones duplicadas. No unifica los dos calendarios del juego. |
| [7 · Sectores y compañeros](docs/recorridos-0.2-entrega-7.md) | Once escenas regionales, cinco textos de tránsito, viaje ágil, bloqueo armado puntual y conversaciones nocturnas. | Los sectores tienen situaciones propias. Falta profundizar su evolución en visitas posteriores. |
| [8 · Sara](docs/acuerdos-0.2-entrega-8.md) | Acuerdo nocturno conectado con recursos y decisiones ante Lira. | La respuesta posterior recuerda lo ocurrido; no inventa conversaciones omitidas. |
| [9 · Noa](docs/rutas-noa-0.2-entrega-9.md) | Motivo de la ruta, cruce de la Alameda y recuerdo de desvíos, combate o intentos fallidos. | La continuidad depende del recorrido efectivo. |
| [10 · Elías](docs/elias-0.2-entrega-10.md) | Investigación del Nodo 14, alcance de los archivos, respuesta posterior e Irene. | Una descarga antigua no confirma por sí sola que alguien siga vivo. |
| [11 · Vera](docs/vera-0.2-entrega-11.md) | Negociación con costes, condiciones y transmisión de información explícitos. | Conserva pagos, deuda, datos revelados y cancelación de extracción en noche y regreso. No inventa ataques posteriores. |
| [12 · Primeros corredores](docs/corredores-0.2-entrega-12.md) | Cuatro encargos iniciales reescritos, propósitos por tramo y consecuencias de recepción. | El recorrido conecta comunidades y continúa desde donde termina. Se conservan las versiones antiguas para partidas iniciadas. |
| Ajuste posterior del modal | Catálogo en franjas con retrato, título y solicitante; ficha completa al abrir. | Retratos verticales sin recorte, cabecera fuera del desplazamiento y retorno al inicio al cambiar de vista. Verificado en el sitio público. |

Estos documentos son registros de entregas. Sus apartados «siguiente» describen lo pendiente en aquella fecha: varias de esas tareas ya están realizadas. Por ejemplo, los arcos de Noa, Elías y Vera no deben volver a planificarse como si no existieran.

## 4. Cómo está organizado el juego

### Expedición

Sara, Elías y Noa comparten una campaña escrita de tres días. El avance corresponde a escenas, decisiones y cierres de jornada; no al contador de minutos de Mensajeros. La base incluye supervivencia, combate, inventario, saqueo, fabricación, habilidades, cajas de suministros con puzles, potenciadores y desenlaces.

Las últimas entregas introducen memoria de conversaciones y compromisos concretos. Todavía no constituyen un sistema universal de relaciones ni arcos personales completos para toda la campaña. Hablar con un compañero no debe convertirse automáticamente en una recompensa de afinidad o curación.

### Los Mensajeros

Rocío Rojas, Tomás Leiva y Bruno Araya recorren una red de encargos con mochilas, heridas, resistencia, tiempo y alertas propios. Tomás es ciego; su escucha tiene funciones y límites, no es visión sobrenatural. No fabrican: adquieren equipo y suministros mediante el sistema de comercio correspondiente.

El ciclo jugable es conocer un trabajo, revisar el recorrido, viajar a su preparación cuando corresponda, aceptarlo, resolver situaciones y entregar. La carga protegida se distingue del equipo propio y de la dotación prestada. Los pagos se producen una vez, al cerrar la entrega. Los minutos se descuentan por acciones y desplazamientos; leer no consume tiempo.

El comercio de Mara y el Armero requiere estar en Los Héroes. Viajar allí puede producir encuentros, combate y saqueo. El acceso a una tienda no debe teletransportar al equipo.

### Conexión entre actividades

`activities.js` presenta las actividades y carga Mensajeros en un marco del mismo origen. Sus interfaces se aíslan para no mezclar identificadores, teclas y estados. Los adaptadores de refugio, combate y ficha utilizan la presentación compartida.

La conexión narrativa más explícita entre equipos es el informe de Morales, leído desde un comprobante confirmado. No existe una sincronización universal de todos los NPC, recursos y consecuencias entre ambas actividades. No debe suponerse que cada nuevo resultado local ya llega a la campaña.

## 5. Encargos y progresión vigentes

La definición efectiva se obtiene con `prepare()` de `extensions/mensajeros/production.mjs`. Leer solo `production.json` muestra parte de las definiciones históricas, no necesariamente el catálogo actual.

| ID estable | Nombre actual | Apertura | Recorrido y función |
| --- | --- | --- | --- |
| `relevo-01` | El turno que no alcanza | Inicio | Los Héroes → La Moneda → Universidad de Chile → Plaza. Tres tramos; consulta de Elena y organización del paso. Ana cierra y paga en Plaza. |
| `romero-01` | Una reserva, tres puestos | Primera entrega | Plaza → Universidad de Chile → La Moneda → Los Héroes → República. Cuatro tramos; reserva sellada, Julián y continuidad de atención. |
| `morales-01` | Hasta donde llega el carro | Primera entrega | Desde Plaza, atraviesa el centro hasta Toesca y Parque O’Higgins; vuelve a Morales en Los Héroes. Siete tramos; reconocer capacidad y límites del paso. |
| `ana-01` | Cruzar con lo que queda | Romero **o** Morales | Plaza → Universidad de Chile → La Moneda → Los Héroes. Tres tramos; acompañar familias y resolver el traslado de sus pertenencias. |
| `beatriz-01` | Lo que alimenta al norte | Ana | Libertadores → Plaza → Universidad de Chile → regreso. Nutrientes para cultivos; cuatro tramos. Rama opcional antes de continuar hacia talleres. |
| `guzman-01` | Piezas para seguir en pie | Ana | Los Leones → L6 → Franklin → L2 → Los Héroes → Universidad de Chile → Plaza. Trece tramos; dos rotores y un sensor. |
| `jimenez-01` | Enlace de respaldo | Guzmán | Vicuña → estaciones de L4 → Tobalaba → Los Leones. Trece tramos; comprobar y entregar el enlace. |
| `adasme-01` | Fuera de contacto | Jiménez | Preparación en Vicuña o Tobalaba, búsqueda de Darío junto a la escotilla y regreso a Vicuña. Veintiocho tramos desde Vicuña; dieciséis desde Tobalaba. |

Romero y Morales pueden aceptarse en Plaza inmediatamente después de la primera entrega. Sus solicitudes están allí; eso no implica que los NPC hayan cambiado de residencia.

El corte de L1 entre Baquedano y Los Leones se mantiene. Para conectar centro y talleres se utiliza la red existente por Franklin y L6. No abrir un atajo por conveniencia narrativa sin revisar la geografía definida. Las estaciones intermedias de L4 son puntos de instancia, no refugios nuevos. El norte conserva un corredor agrupado.

El viaje ágil enlaza pasos tranquilos y se detiene donde hay decisiones, combate, entrega o paradas relevantes. No elige por el jugador ni elimina desgaste. El dron obligatorio del corredor de talleres pertenece a traslados entre encargos y queda resuelto persistentemente; no debe añadirse indiscriminadamente a la extracción de Adasme, cuyo pago contempla evitar combates.

## 6. Consecuencias humanas que ya existen

La primera entrega distingue esperar una respuesta para Elena de llevar una consulta pendiente. El acuerdo entre puestos distingue ventanas separadas y grupos acompañados: Ana debe organizar tareas de manera diferente.

Romero recibe información distinta si el equipo cambió un vendaje o solo registró la necesidad de atención. El relato no confunde un aviso entregado con una persona atendida. También conserva cómo se registró la reserva y quién dará continuidad a las indicaciones.

Morales diferencia lo observado de lo comprobado y un paso para mochilas de una prueba con carro vacío. El límite del reconocimiento termina en Parque O’Higgins. No declara segura toda la ruta hacia talleres ni permite deducir la resistencia del suelo a cualquier carga.

Ana recibe a las familias con sus herramientas restituidas o su correa reparada. El grupo deja de ser un manifiesto que se transporta: las personas llegan con preguntas sobre su vida en el nuevo puesto.

La reparación de Plaza permite descanso abastecido por la posta, con la duración habitual y límite por parada. Darío dispone de llegada y seguimiento propios. Los recuerdos nuevos se activan desde entregas confirmadas, aparecen en puestos o diario y no producen otro pago.

Hay todavía límites: estos recuerdos no simulan una vida autónoma indefinida de los NPC. La atención pendiente de Julián no tiene una misión posterior de resolución. Las visitas no deben narrar nuevas curaciones, muertes, traslados o ataques que el sistema no haya registrado.

## 7. Presentación actual y última corrección

El catálogo anterior usaba tarjetas grandes con imágenes horizontales que recortaban los retratos. Ahora muestra filas de 86 píxeles de alto en la comprobación de escritorio, con retrato vertical, título, solicitante y estado cuando corresponde. Se abre la ficha completa al pulsar una fila. La información para abrir más encargos queda en un desplegable.

La ficha conserva relato, destino, recorrido, plazo, recompensa, carga, efectos y controles de aceptación o traslado. Su retrato respeta la proporción original. La cabecera y el cierre permanecen fuera del contenido desplazable; al cambiar de vista el contenido vuelve arriba. La inspección de objetos conserva el bloqueo de la ventana inferior.

Se comprobó en navegador real la carga del retrato, el catálogo, la apertura de la ficha y el retorno al listado en `neosantiago-rpg-demo.onrender.com`. El CSS contempla pantallas estrechas, pero **este último ajuste no tiene una revisión visual nueva en un teléfono real**. Tampoco equivale a una auditoría visual de todos los estados del juego.

La identidad visual está más unificada por presentación compartida, tipografía, paleta y ventanas reutilizadas. Todavía no hay arte individual de todas las estaciones; los sectores usan fondos existentes. No se asigna una puntuación de calidad visual o narrativa sin una evaluación correspondiente.

## 8. Archivos que debe conocer quien continúe

| Área | Archivos principales | Función |
| --- | --- | --- |
| Entrada y campaña | `neosantiago-demo.html`, `campaign-v2.js`, `decision-v2.js`, `game-v2.js` | Documento anfitrión, contenido y motor principal. El orden de carga de módulos importa. |
| Capítulos y desenlaces | `narrative-v3.js`, `narrative-chapters.js`, `narrative-finale.js` | Variantes, secuencias y cierre narrativo. |
| Noches | `expedition-rest.js`, `companion-nights.js` | Recursos, recuperación, conversación y persistencia nocturna. |
| Continuidad del grupo | `companion-commitments.js`, `companion-routes.js`, `companion-evidence.js`, `vera-negotiation.js` | Sara, Noa, Elías y negociación con Vera. |
| Actividades y noticias | `activities.js`, `world-continuity.js`, `world-continuity.css` | Cambio de actividad e informe de Morales hacia la expedición. |
| Presentación compartida | `combat-common.js`, `combat-stage.js`, `profile-common.js`; adaptadores de Mensajeros | Base de combate y fichas; revisar adaptadores antes de duplicar UI. |
| Central de encargos | `extensions/mensajeros/play.html`, `play.mjs`, `play.css`, `ui.css` | Catálogo, modales, mapa, eventos de interfaz y estilos. |
| Motor de encargos | `extensions/mensajeros/production.mjs`, `engine.mjs` | Transiciones, inventario, combate, recompensa, restauración y núcleo compartido. |
| Catálogo y primeras escenas | `extensions/mensajeros/production.json`, `corridors.mjs` | Datos históricos y redefiniciones vigentes de los primeros cuatro trabajos. |
| Descubrimiento y viajes | `extensions/mensajeros/progression.mjs`, `network.mjs`, `travel.mjs` | Apertura de contactos, red física, traslados y animación. |
| Encuentros y regreso | `extensions/mensajeros/encounters.mjs`, `aftermath.mjs` | Identidad regional y continuidad de Darío. |
| Refugio, equipo y combate de Mensajeros | `refuge-adapter.mjs`, `profile-adapter.mjs`, `combat-adapter.mjs` y sus HTML/loaders | Adaptación de las pantallas compartidas al equipo y estado de Mensajeros. |
| Pruebas | `tests/*.test.cjs`, `tests/runtime-harness.cjs`, fixtures de couriers | Regresiones de estados y DOM. `tests/layout-preview.html` permite revisar tamaños. |

Las rutas abreviadas de la tabla de Mensajeros pertenecen a `extensions/mensajeros/`. Los retratos aprobados de contactos están en `characters/encargos/` y son WebP verticales de 614 × 1024.

## 9. Persistencia y compatibilidad

El guardado de producción de Mensajeros usa `neosantiago.mensajeros.production.v1`. El laboratorio y la expedición tienen estados separados. «Nueva partida» del juego principal reinicia ambos equipos. «Continuar» restaura el progreso. El reinicio dentro de Mensajeros afecta esa actividad; un hecho que la expedición ya aprendió del informe no debe deshacerse retroactivamente mediante ese reinicio local.

`corridorVersion: 2` identifica los nuevos encargos y viajes. Para restaurar una misión anterior se conservan definiciones, ruta, destino, encuentro pendiente, reloj, comprobante y checkpoint antiguos. La compatibilidad también cubre traslados hacia el origen anterior de un encargo. No basta con traducir el índice del jugador al nuevo recorrido.

`directorVersion` y la memoria de encuentros regionales tienen su propia responsabilidad. No confundir esa versión con la de los corredores. Los registros de noche, compromisos, negociación y regreso tampoco deben reconstruirse desde lo que «normalmente» habría escogido el jugador.

Las acciones y pagos se resuelven una vez. La carga protegida no se convierte en inventario vendible; el material prestado no debe permitir acumular recursos reiniciando trabajos. La victoria y el saqueo deben cerrarse antes de declarar abierto un paso bloqueado.

Cambiar el texto de algunas acciones podía alterar la inferencia de efectos psicológicos por palabras. Las variantes recientes conservan referencias mecánicas o efectos explícitos para evitarlo. La eliminación general de esa dependencia textual sigue pendiente; no asumir que quedó resuelta en todo `game-v2.js`.

## 10. Qué falta, con prioridad y evidencia

| Prioridad | Pendiente | Estado conocido y resultado buscado |
| --- | --- | --- |
| Inmediata | Corregir ayuda desactualizada | `help()` de `play.mjs` todavía dice «Tu primer trabajo tiene dos tramos». El inicio vigente tiene tres y termina en Plaza. Es una discrepancia confirmada, no una propuesta narrativa. |
| Alta | Evaluar el inicio jugando con lectura real | Ver si se entiende el propósito de cada trabajo, qué se recuerda de las personas y dónde vuelve a sentirse trámite. Hay pruebas del motor; falta esta evaluación después del bloque 12. |
| Alta | Profundizar Beatriz, Guzmán y Jiménez | Tienen encargos y efectos existentes. Falta extender conflictos propios del sector y consecuencias posteriores condicionadas por el recorrido. Guzmán ya tiene recepción humana y descanso abastecido: no empezar desde cero. |
| Alta | Dar evolución a segundas visitas | Las escenas resueltas dejan de repetirse, pero no todos los sectores tienen continuaciones suficientes. Incorporar cambios pequeños ligados a hechos, sin reaparecer obstáculos eliminados. |
| Alta | Revisar balance en partidas normales | Tiempo, descansos, munición, heridas, dinero, recompensas y dificultad deben evaluarse juntos. Las rutas automáticas comprobadas no representan todas las estrategias ni preferencias de lectura. |
| Media | Unificar efectos de decisiones de forma explícita | Ampliar el desacoplamiento entre prosa y efectos mecánicos. Es un trabajo técnico distinto de escribir más líneas de diálogo. |
| Media | Ampliar continuidad entre actividades cuando aporte valor | Hoy existe una conexión explícita del informe de Morales. Cada puente nuevo necesita fuente, receptor, momento y consecuencia; no mezclar economías por defecto. |
| Media | Revisión visual y de accesibilidad completa | Catálogo con muchos trabajos abiertos, móvil vertical, ventanas anidadas, foco, teclado, lectura larga, imágenes y transiciones. El último ajuste tiene revisión de escritorio y pruebas DOM, no certificación general. |
| Media | Extender arcos corales | Sara, Noa y Elías tienen conexiones concretas, pero no toda la campaña responde con la misma profundidad. Revisar escenas menos conectadas antes de añadir contadores abstractos de relación. |
| Posterior | Arte situado por sectores o estaciones | Los fondos actuales diferencian ambientes, pero se reutilizan. Desarrollar arte donde aporte orientación o identidad, respetando retratos y lenguaje visual existentes. |
| Cierre de versión | Definir y comprobar el alcance final de V0.2 | Existe desarrollo por entregas; no una aceptación final registrada. Cerrar con evidencia jugable, pendientes identificados y un historial de versión claro. |

## 11. Siguiente bloque recomendado, todavía no implementado

La continuación propuesta es **Beatriz y la recepción de nutrientes**, como primer tramo de la profundización de encargos largos. Conviene anunciar ese alcance antes de modificar código. No desarrollar simultáneamente toda la red.

El encargo ya tiene reserva protegida, recogida en Universidad de Chile, decisión sobre el sello, retorno a Libertadores y descuento en raciones. La escena regional del cajón y su cuenta en Plaza también existe. Revisar esas piezas permite escribir un conflicto de hidroponía y recepción que nazca de trabajo real, en lugar de añadir otro recado de listas.

El resultado buscado es una llegada donde Beatriz responda a cómo llegó la carga y a qué pudo comprobar el equipo; una necesidad personal o comunitaria concreta; y una continuación en otra visita que recuerde ese resultado. Si se añade un efecto mecánico, debe tener un coste o beneficio visible y no duplicar el descuento existente. El juego no debe afirmar que salvó una cosecha o a una familia sin un hecho que lo sostenga.

Ese bloque debería incluir la corrección breve de la ayuda desactualizada y preservar las partidas antiguas. Después se podría abordar Guzmán o Jiménez según lo que se observe jugando. Esta es una dirección recomendada, no una descripción de contenido ya disponible.

## 12. Qué se comprobó y qué no

Se ejecutó la suite completa sobre el código `9fe2327` al preparar este informe: **345 pruebas, 345 aprobadas, 0 fallos**, con `node --test --test-reporter=tap tests/*.test.cjs`. El ajuste del catálogo también pasó previamente los 18 casos de `tests/courier-travel.test.cjs`.

La suite cubre, entre otros aspectos, inicio y guardado, progresión y bloqueos, itinerarios, costes, pagos únicos, carga, combate y saqueo, migración, derrota y reintento, recuerdos de personajes, negociación, descansos y controles de interfaz. La cadena de ocho encargos tiene recorridos automáticos en varias semillas. Las nuevas pruebas de corredores verifican combinaciones de decisiones, asistencia sin botiquín, pertenencias y compatibilidad.

Las pruebas de continuidad de la expedición utilizan preparación controlada y, en recorridos integrales, reposición de salud/energía y resolución de combate para comprobar conexiones narrativas. No deben citarse como demostración del balance de supervivencia. Linkedom comprueba estructura e interacción DOM, pero no representa el dibujo real de CSS en cada dispositivo.

La revisión de navegador del último modal confirmó retrato cargado, fila compacta, apertura del detalle y retorno con desplazamiento en cero. Los despliegues de los dos dominios devolvieron el marcador actualizado `v=15-compact-catalog`. No se hizo una nueva partida humana completa después del ajuste.

Para ejecutar las pruebas desde una copia nueva, instalar las dependencias de desarrollo de `package.json` con `npm install` y ejecutar `npm test`. La dependencia DOM declarada es `linkedom` 0.18.13. No se requieren las carpetas temporales ni las sesiones de herramientas del chat anterior.

## 13. Documentación histórica y fuentes

[NARRATIVA-ETAPAS.md](NARRATIVA-ETAPAS.md) conserva el historial narrativo. [INTEGRACION-JUGABLE.md](docs/metro-refugios/INTEGRACION-JUGABLE.md) describe la integración original y revisiones sucesivas; contiene nombres, cantidades de encargos y explicaciones de etapas anteriores. [El README de Mensajeros](extensions/mensajeros/README.md) incluye historia del laboratorio: las restricciones antiguas de mantenerlo oculto no describen la actividad publicada actual. Para decidir qué está vigente, contrastar este informe, la entrega posterior aplicable y el código preparado.

Los criterios usados en las entregas están documentados con fuentes: [Emily Short sobre storylets](https://emshort.blog/2019/11/29/storylets-you-want-them/), [sus artículos sobre conversación](https://emshort.blog/how-to-play/writing-if/my-articles/conversation/), [Harris Powell-Smith sobre pausas narrativas](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/) y [Dan Fabulich sobre elecciones interesantes](https://www.choiceofgames.com/2010/03/5-rules-for-writing-interesting-choices-in-multiple-choice-games/). La [primera entrega](docs/narrativa-0.2.md) registra también el marco motivacional consultado y la relación con el libro. Este informe remite a esa investigación anterior; no afirma haber realizado un estudio nuevo de jugadores.

La [bibliografía narrativa ampliada](docs/BIBLIOGRAFIA-NARRATIVA.md), incorporada el 19 de septiembre de 2026, separa las siete fuentes registradas en las entregas anteriores de las nuevas lecturas sobre elenco coral, decisiones y narrativa ambiental. Incluye galerías de imágenes, diagramas y el alcance de consulta. Esta ampliación es documental y no modifica el estado de implementación descrito arriba.

## 14. Contexto listo para abrir otro chat

> Continúa el desarrollo de Neo Santiago 2130 en `dbastias37/Neosantiago-rpg-demo`. Lee primero `INFORME-CONTINUIDAD-V0.2.md`, verifica el estado actual de `main` y revisa los archivos correspondientes antes de editar. Están implementadas las entregas 1–12 y el catálogo compacto de encargos. V0.2 sigue abierta. El siguiente bloque recomendado es profundizar la llegada de nutrientes a Beatriz y su continuidad en una visita posterior; también está pendiente corregir la ayuda que aún habla de dos tramos iniciales. Anuncia el alcance antes de comenzar. Mantén narrativa humana y concreta, identidad visual compartida, rutas descubiertas progresivamente, efectos ligados a hechos comprobados y compatibilidad de guardados. No repitas las mejoras ya integradas ni alteres las definiciones históricas de misiones en curso. Las modificaciones para esta actualización y su integración a main están autorizadas. Al terminar, registra lo implementado, pruebas, limitaciones y siguiente pendiente en el informe.
