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

El norte de L3 y Vicuña–Tobalaba se presentan como corredores agrupados, no como estaciones adyacentes. El corte Baquedano–Los Leones permanece cerrado. No se abren combinaciones nuevas por inferencia.

## Mecánicas

El motor de laboratorio (`engine.mjs`) permanece como base pura de rutas y guardados. `production.mjs` adapta ese motor: cargo que se recoge en destino intermedio, escenas propias por encargo, tres actores y enemigos individuales, acciones de combate, retirada persistente, progreso y economía. El combate de producción usa acciones por turno, objetivos, precisión, críticos, cobertura, habilidades, botiquines y loot; no utiliza el combate agregado de prueba. El motor de campaña sigue atendiendo exclusivamente a su grupo y narrativa.

La resistencia mide el viaje; los HP pertenecen a cada personaje. Descansar consume 1 agua + 1 ración, restaura 25 de resistencia y 12 HP por persona. Un botiquín cura 24 HP. Las derrotas recuperan un punto de control y conservan tiradas, número de combates y vigilancia. Retirarse vuelve al andén anterior y deja el mismo paso sin resolver; conserva consumo y heridas. Evitar antes de combatir permite avanzar sin alerta.

El inhibidor de Adasme tiene 20 minutos narrativos de uso: leer no consume tiempo. No es un plazo para la vida del rescatado. Adasme entrega tres bombas de humo. Cargar a un herido no reduce el pago por sí mismo.

Las entregas son transacciones únicas, retiran la carga exacta y no se pagan por encontrar el objeto o llegar a una estación. La carga no puede venderse, desarmarse ni descartarse. Los objetos incluyen inspección con imagen y uso. Se reutiliza arte existente para los objetos nuevos de apoyo (mapas, radio, piezas, medicina); las cinco ilustraciones aprobadas de rotor, sensor, humo, inhibidor y agua siguen presentes.

Las fichas se usan en la central o en puntos de control. Las compras previas se agregan al aceptar; remanentes de compras y materiales propios se conservan al entregar, mientras que la dotación prestada pertenece al encargo. La victoria recupera munición, agua y materiales. Se fabrican señuelos con 1 electrónica + 1 pieza metálica y trampas con 2 piezas metálicas. Las alertas regionales persisten entre encargos.

## Verificación

`node --test tests/*.test.cjs` ejecuta regresiones de campaña y casos nuevos de actividades y producción. Los recorridos de los siete encargos se completan para varias semillas. Se comprueban pago único, cargo exacto, recogida intermedia, actores y objetivos de combate, guardado durante el turno, retirada, derrota, compras, progresión y aislamiento de la campaña.

Prueba Chromium local: introducción → menú → Mara → encargos; entrega completa de Guzmán; extracción completa de Adasme con combates; recarga durante viaje y durante combate; regreso a la narrativa sin modificar sus recursos/decisiones; compra/fabricación; inspección; zoom y arrastre del mapa. Revisión a 1440, 390 y 360 píxeles. El balance es una primera versión jugable, con constantes en los datos y motor; no representa una prueba extensa con jugadores.

No se cambian ni se publican los laboratorios de Sites. El juego se integra en el repositorio y su despliegue depende del alojamiento habitual.
