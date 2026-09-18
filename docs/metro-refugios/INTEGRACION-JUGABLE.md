# Integración jugable de Los Mensajeros

18 de septiembre de 2026. El usuario autoriza integrar y activar mapa, NPC, objetos y encargos en el juego. Esta instrucción sustituye la restricción histórica de mantener la expansión oculta. La campaña narrativa sigue siendo la actividad principal.

## Entrada y continuidad

Al terminar las cinco páginas de introducción se muestra «La ciudad sigue viva»: Exploración (Sara, Elías y Noa) y Encargos (Rocío, Tomás y Bruno). Exploración conduce a Mara si aún no se ha preparado el grupo. Se puede cambiar desde el refugio y desde el resumen final. La central vuelve al mismo menú sin resolver ni abandonar un encuentro.

`activities.js` administra el menú y carga `extensions/mensajeros/play.html` en un marco del mismo origen. El aislamiento de DOM evita colisiones de IDs, estilos, teclas e inventarios con el juego existente. Las ventanas de fondo quedan inertes y el reloj de la señal de campaña se pausa. El campo `state.activity` registra el modo; los guardados antiguos sin ese campo siguen su flujo anterior.

El guardado de encargos es `neosantiago.mensajeros.production.v1`; no usa la clave de campaña ni `neosantiago.mensajeros.lab.v1`. Se guarda tras cada transición, también durante el combate. Reiniciar la narrativa conserva los encargos. Reiniciar los encargos requiere su botón de confirmación y guarda una copia anterior con sufijo `.backup`. Si el guardado no es compatible se conserva intacto; no se reemplaza al abrir la guía.

## Equipo nuevo

| Mensajero | Función | Viaje | Combate |
| --- | --- | --- | --- |
| Rocío Rojas | Exploradora, 28 años | Evita un contacto una vez por encargo | Marca: +8 al siguiente ataque sobre el objetivo |
| Tomás Leiva | Técnico de señales, 32 años | Evita un contacto electrónico una vez por encargo | Interferencia: anula una respuesta del objetivo |
| Bruno Araya | Porteador y rescatista, 41 años | Reduce en 1 el desgaste extra de cargar al herido mientras esté en pie | Protege a los tres durante la siguiente respuesta |

Viajan los tres juntos. La red de relevos los reúne en el origen al aceptar un encargo; esto no constituye movimiento libre en el mapa. Los desplazamientos dentro de la misión respetan sus tramos. Cada entrega entrega 35 XP por persona; 60 XP aumentan un nivel, 5 HP máximos y la fuerza de ataque. La atención básica al iniciar asegura al menos 40% de HP, evitando que una devolución con el grupo agotado deje la partida sin salida. Recuperar al grupo por completo entre encargos cuesta 8 fichas.

Retratos nuevos generados individualmente con ImageGen, estilo cinematográfico realista de túneles chilenos; optimizados a WebP de 590 × 885. Los siete retratos aprobados de los contactos no se modifican. Sus perfiles archivados siguen siendo fuentes históricas; las vinculaciones activas viven en `production.json`.

## Encargos disponibles

| Encargo | Contacto | Recorrido y propósito | Recompensa y consecuencia |
| --- | --- | --- | --- |
| Piezas para seguir en pie | Guzmán | Los Leones → L6 → Franklin → L2 → Los Héroes → Universidad de Chile → Plaza de Armas. Dos rotores y un sensor, entrega a técnicos | 40 fichas; las defensas restauradas quedan registradas y visibles en la ficha de Plaza |
| Fuera de contacto | Adasme | Vicuña Mackenna → Tobalaba → escotilla → refugio provisorio → regreso | 40 fichas, +30 con cero combates; rescate ambulante o cargado y diálogo correspondiente |
| Reserva de emergencia | Dr. Romero | República → Los Héroes → República; recoger el estuche, atender o avisar por un vigía herido | 28 fichas; botiquines pasan de 10 a 6 fichas |
| Lo que alimenta al norte | Beatriz | Libertadores → Plaza → Universidad de Chile → regreso; recoger y asegurar nutrientes | 36 fichas; raciones pasan de 5 a 3 fichas |
| Un paso para todos | Ana | Plaza → Universidad de Chile → La Moneda → Los Héroes; verificar un acuerdo de tránsito | 30 fichas; segundo descanso en la posta de Universidad de Chile |
| Rastros del corredor | H. Morales | Los Héroes → La Moneda → Universidad de Chile → regreso; recoger información de los rastros | 32 fichas; vigilancia central baja en 1 |
| Enlace de respaldo | Jiménez | Vicuña Mackenna → Tobalaba → Los Leones; medir un enlace y entregar el módulo a técnicos | 42 fichas; futuras salidas cuentan con inhibidor de 20 minutos |

Guzmán y Adasme conservan las premisas y recorridos previamente desarrollados. Los otros cinco encargos se completan en esta integración a partir de las funciones de sus NPC; sus escenas y balance son contenido nuevo de esta versión. Ana mantiene el rol de comunidad de paso. No se convierte en médica ni reemplaza a los técnicos de la entrega de Guzmán.

El norte de L3 conserva su corredor agrupado. La Línea 4 se recorre estación por estación; véase la revisión de viajes al final. El corte Baquedano–Los Leones permanece cerrado. No se abren combinaciones nuevas por inferencia.

## Mecánicas

El motor de laboratorio (`engine.mjs`) permanece como base pura de rutas y guardados. `production.mjs` adapta ese motor: cargo que se recoge en destino intermedio, escenas propias por encargo, tres actores y enemigos individuales, acciones de combate, retirada persistente, progreso y economía. El combate de producción usa acciones por turno, objetivos, precisión, críticos, cobertura, habilidades, botiquines y loot; no utiliza el combate agregado de prueba. El motor de campaña sigue atendiendo exclusivamente a su grupo y narrativa.

La resistencia mide el viaje; los HP pertenecen a cada personaje. Descansar consume 1 agua + 1 ración, restaura 25 de resistencia y 12 HP por persona. Un botiquín cura 24 HP. Las derrotas recuperan un punto de control y conservan tiradas, número de combates y vigilancia. Retirarse vuelve al andén anterior y deja el mismo paso sin resolver; conserva consumo y heridas. Evitar antes de combatir permite avanzar sin alerta.

El inhibidor de Adasme tiene 20 minutos narrativos de uso: leer no consume tiempo. No es un plazo para la vida del rescatado. Adasme entrega tres bombas de humo. Cargar a un herido no reduce el pago por sí mismo.

Las entregas son transacciones únicas, retiran la carga exacta y no se pagan por encontrar el objeto o llegar a una estación. La carga no puede venderse, desarmarse ni descartarse. Los objetos incluyen inspección con imagen y uso. Se reutiliza arte existente para los objetos nuevos de apoyo (mapas, radio, piezas, medicina); las cinco ilustraciones aprobadas de rotor, sensor, humo, inhibidor y agua siguen presentes.

Las fichas se usan en la central o en puntos de control. Las compras previas se agregan al aceptar; remanentes de compras y materiales propios se conservan al entregar, mientras que la dotación prestada pertenece al encargo. La victoria recupera munición, agua y materiales. Los Mensajeros no fabrican. Compran señuelos y trampas; venden objetos propios y materiales recuperados en las postas. Las alertas regionales persisten entre encargos.

## Verificación

`node --test tests/*.test.cjs` ejecuta regresiones de campaña y casos nuevos de actividades y producción. Los recorridos de los siete encargos se completan para varias semillas. Se comprueban pago único, cargo exacto, recogida intermedia, actores y objetivos de combate, guardado durante el turno, retirada, derrota, compras, progresión y aislamiento de la campaña.

Prueba Chromium local: introducción → menú → Mara → encargos; entrega completa de Guzmán; extracción completa de Adasme con combates; recarga durante viaje y durante combate; regreso a la narrativa sin modificar sus recursos/decisiones; compra/fabricación; inspección; zoom y arrastre del mapa. Revisión a 1440, 390 y 360 píxeles. El balance es una primera versión jugable, con constantes en los datos y motor; no representa una prueba extensa con jugadores.

No se cambian ni se publican los laboratorios de Sites. El juego se integra en el repositorio y su despliegue depende del alojamiento habitual.


## Revisión de Los Mensajeros — 18-sep-2026

Los tres llevan techwear negro ajustado, son delgados y atléticos. Retratos sustituidos conservando sus identidades. Tomás es ciego: precisión base de disparo 45%, cuerpo a cuerpo 60%; encuentros electrónicos restan 15 puntos. Escuchar consume un turno y mejora el próximo golpe cercano en 20 puntos (30 con Separar sonidos). No mejora disparos ni otorga percepción sobrenatural.

Tomás evita un contacto por encargo mediante un desvío acústico (desgaste 2, o 6 con ruido electrónico), ampliable a dos. Puede guiar retirada al andén anterior con desgaste 5 (2 mejorado), más 4 entre ruido electrónico. Retirarse no completa el tramo ni borra vigilancia. Requiere estar consciente.

Cada personaje comienza con un punto de habilidad y gana otro por nivel. Rama de tres nodos: raíz seguida de dos especializaciones, un punto por nodo. Rocío: Lectura de rutas → Marca precisa / Pulso firme. Tomás: Memoria acústica → Separar sonidos / Ruta de salida. Bruno: Paso sostenido → Cobertura coordinada / Primeros auxilios. Se aprende en postas; las partidas anteriores obtienen los puntos correspondientes a su nivel sin reiniciarse. Guardado y recuperación conservan habilidades y usos gastados.

La tienda existente se mantiene; se elimina fabricación de interfaz y motor. Las reservas antiguas de materiales pueden venderse. Carga protegida y suministros prestados no pueden venderse. La campaña principal conserva sus sistemas.

Validación de esta revisión: 184 pruebas automatizadas aprobadas, incluida migración, prerrequisitos, escucha, retirada, límites de uso y comercio. Balance inicial pendiente de experiencia con jugadores.


## Viajes al mercado y estaciones de Línea 4 — 18-sep-2026

El botón «Viajar a Los Héroes» inicia ahora un recorrido independiente, sin teletransporte, pago ni XP por entrega. Sale de `world.location` y sigue el camino de menor tiempo entre los corredores ya abiertos por los encargos. Desde Vicuña Mackenna sube por L4, cruza a Los Leones y usa L6–Franklin–L2. El corte de Baquedano sigue cerrado. Incluso el último tramo puede generar un contacto hostil: las tiendas se habilitan después de resolverlo y terminar el saqueo.

Cada avance usa el mismo sorteo, animación de ruta, aviso de llegada de un segundo, decisiones, batalla y saqueo de Encargos. Mochilas, heridas, loot y alertas se conservan. No se entrega dotación gratuita ni recompensa por ir al mercado. Se puede detener el viaje en el último andén alcanzado o reintentar desde su punto de control tras una derrota. Durante un encargo activo se conserva su itinerario: hay que llegar a Los Héroes por él, o devolverlo antes de iniciar el regreso. Los encargos que comienzan en Los Héroes requieren estar allí para aceptarlos.

`network.mjs` construye los recorridos del mercado a partir de las conexiones existentes, fuera del catálogo de siete encargos. `engine.mjs` comparte desplazamiento y sorteos; `production.mjs` resuelve llegada, combate y persistencia sin pasar por el pago de encargos.

L4 incorpora, en sentido Vicuña Mackenna → Tobalaba: Macul, Las Torres, Quilín, Los Presidentes, Grecia, Los Orientales, Plaza Egaña, Simón Bolívar, Príncipe de Gales, Francisco Bilbao y Cristóbal Colón. El regreso usa el orden inverso. [Referencia del orden de estaciones](https://es.wikipedia.org/wiki/L%C3%ADnea_4_del_Metro_de_Santiago#Estaciones). Son puntos de instancia, no refugios nuevos. Los puntos y rótulos del mapa son interactivos; la luz sigue la geometría de cada tramo sin rellenar los SVG.

Cada segmento L4 cuesta 2 minutos narrativos y 1 de desgaste, más 1 al cargar al rescatado antes de aplicar la ayuda de Bruno. No son tiempos reales del Metro. Adasme tiene 28 tramos y plazo de 140 minutos; Jiménez, 13 tramos y plazo de 75. Su prueba de enlace permanece en Tobalaba. Se mantiene el descuento por demora y la recompensa sin combates.

Las partidas `2026-09-18.production.1` migran a `.2` sin reiniciarse. Los índices, descansos, tiradas y snapshots se traducen a las nuevas estaciones; se preservan inventarios, HP, pagos y alertas. Un encuentro antiguo ya iniciado conserva su destino, turno y loot, sin cobrar de nuevo el recorrido. Solo los desplazamientos futuros recorren las estaciones añadidas. Los guardados actuales no se migran una segunda vez.

Regresiones específicas: `tests/courier-network.test.cjs` y `tests/courier-travel.test.cjs` verifican estaciones de ida/vuelta, migración durante combate/saqueo, bloqueo de mercado, batalla en la llegada, guardado, reintento, detención del viaje y ausencia de pagos duplicados.
