# V0.3 — tramo de referencia y producción narrativa

## Decisión de alcance

El tramo principal será la primera jornada de la Expedición: **Los Héroes → acceso sellado → corredor habitado → casa de bombas → Matías → regreso narrativo a Línea 1 → primera noche**. Se conserva la campaña completa disponible después. No se crea otra partida, se recorta el contenido existente ni se obliga a rescatar a Matías para continuar.

La duración objetivo es **30–60 minutos**, incluyendo lectura, preparación y uno o dos combates elegidos por el jugador. Es una hipótesis de producción: no una duración medida, una condición automática ni un resultado demostrado por las pruebas. Una lectura rápida o evitar los enfrentamientos puede acortarla; leer todo el archivo y explorar varios desvíos puede alargarla. Antes de declararla validada se debe medir una sesión desde Iniciar hasta confirmar la primera noche, anotando lectura, preparación, combate y desvíos por separado.

La selección usa el elenco de Sara, Elías y Noa durante todo el recorrido. Intercalar los encargos de Morales para reunir todas las interfaces obligaría a cambiar de equipo y extendería el trayecto antes de tener datos de ritmo. El puente de Morales y las superficies compartidas se verifican como un segundo recorrido de regresión.

## Recorrido de revisión con contenido existente

| Momento | Entrada real | Qué debe demostrar |
| --- | --- | --- |
| Portada, cinematográfica y grupo | `enterTitleScreen`, prólogo y `activities.js` | Motivo de salida, voces diferenciadas y elección de actividad; no saltar la presentación en una partida nueva. |
| Preparación en Los Héroes | `finishStoryPrelude`, `openRefuge`, `acceptStarterKit`, `confirmLeaveRefuge` | Inventario, suministros, comercio y condiciones de salida comparten su UI con Encargos. |
| Reserva y consejo | `CAMPAIGN_EVENTS[0..1]` | Escasez legible; información y postura del grupo antes del primer riesgo. |
| Acceso técnico opcional | «La puerta sellada», evento 2 | Alimentar el lector con una batería, forzar con combate o tomar ductos; se conserva el coste de cada alternativa. |
| Encuentro humano y pausa | «El peso de una ración», evento 3; `rosaIaraRoute` opcional | La familia necesita recursos por un motivo concreto; ayudar tiene un alcance identificable. |
| Riesgo, combate y saqueo | «Tres luces rojas», «Agua sobre los rieles», «El campamento apagado», eventos 4–6 | Preparación, decisiones y un combate elegido; recoger loot con el mismo sistema en desktop y portrait. No forzar todas las peleas. |
| Infraestructura | «El guardián reconstruido», evento 7 | Asegurar la bomba, perder su control o marcarla sin asegurarla dejan hechos diferentes. |
| Persona y decisión final del día | «El hombre bajo el mostrador», evento 8; `matiasSaved` / `matiasLeft` | Atender, trasladar, dejar provisiones, mantener radio o marcharse no equivalen a un rescate completado. |
| Regreso | `matiasRescue`, tres escenas, destino Línea 1 | Si se eligió el traslado, conservar los costes, una ruta de regreso y la llegada a enfermería. |
| Noche y memoria | `prepareNight`, `nightContext`, `companionConversation`, `settleNight` | Revisar lo que ocurrió, hablar con compañeros y decidir sobre comida/agua una sola vez. |
| Continuación | `continueAfterNight`, `narrativeRememberedEvent` | La segunda jornada recuerda el retraso del traslado y conserva acuerdos; no se convierte este corte de revisión en el final del juego. |

El orden exacto de compuerta, encuentros y combate depende de la decisión del jugador. La prueba de revisión debe recorrer una variante con combate y loot, y otra que evite el combate. No se promete una pelea obligatoria donde el diseño ya permite resolver el problema de otra forma.

Para revisar el rescate: conservar medicina hasta la farmacia; elegir estabilizar a Matías; completar los dos intercambios de su conversación y escoger llevarlo a Línea 1. El túnel admite agua, batería, combate o las marcas de Rosa si se obtuvieron. Las tres respuestas de llegada confirman `matiasAtRefuge`; la elección de premio no cambia si llegó. La primera noche aparece después de cerrar el desvío.

Las variantes normales también llegan a la noche: atender y mantener el canal de radio; atender y utilizar la frecuencia como señuelo; dejar comida y escuchar sus indicaciones; tomar la frecuencia y marcharse. Todas deben conservar incertidumbre sobre su destino si no existe una llegada confirmada. Una derrota durante un combate ordinario conserva el regreso al refugio y la recuperación existente; no se sustituye por Game Over.

## Pulido implementado en este bloque

`expedition-rest.js` añade `firstNightConsequences()`, una lectura sin efectos de los hechos existentes. Se incorpora al contexto que `prepareNight()` ya guarda. La noche reconoce la llegada de Matías, radio, señuelo, provisiones o abandono, y la situación comprobada de la bomba. `savedMatias` describe atención inicial: **solo `matiasAtRefuge` acredita llegada**. Ninguna rama sin ese hecho afirma rescate, muerte o recuperación médica. Si una partida trae banderas de bomba contradictorias, el texto conserva la duda en lugar de inventar una infraestructura asegurada.

Los relatos se mantienen cuando un compañero está agotado, sin poner una conversación activa en boca del caído. No dan dinero, curación, confianza ni cambios de amenaza. No añaden un sistema simulado de refugios. La atención, consumo y recuperación nocturna conservan sus reglas.

El guardado no cambia de clave ni de esquema: se reutiliza `expeditionRest.nights[1].context`. Las noches ya iniciadas en V0.2 conservan literalmente su contexto; la nueva prosa solo se captura al preparar una noche nueva. Recargar, releer o pulsar dos veces no repite consumos ni modifica los hechos. Las partidas antiguas no reciben un rescate retroactivo.

## Límites que no deben ocultarse

El regreso de Matías conserva la escena de enfermería antes de la noche. El bloque `day-one-continuity` conecta la primera noche confirmada con Mara/Armero: preparación normal sin repetir recuperación, o recuperación de emergencia cuando corresponde. La segunda noche conserva su navegación anterior. El regreso y la noche mantienen prioridad al reanudar un guardado.

La Expedición tiene un **mapa de decisiones de capítulos** (`narrative-v3.js`), no navegación geográfica por el mapa de Mensajeros. No se presenta ese gráfico como un mapa completo del viaje. La bitácora incorpora orientación contextual del primer día (sector, propósito presente y base de regreso). Sigue pendiente una representación geográfica; la lectura contextual no traslada al grupo ni inventa estaciones para ajustar el mapa.

La interacción técnica de este tramo usa el lector de «La puerta sellada». Las compuertas numéricas permanecen en los desvíos de Encargos y tienen cobertura de regresión separada. Llevar su iframe a la campaña requiere antes un adaptador con contrato de coste, checkpoint y resultado único. No se incrusta como un minijuego independiente ni se añade otra interfaz de combate.

Los cinco cierres causales de V0.2 se mantienen. Red Libre, Bastión, Corte y Continuidad son direcciones futuras que necesitarán diseño y variables con uso concreto; este bloque no sustituye los finales existentes ni crea contadores globales sin consumidores.

## Contrato de producción de una misión

El contrato siguiente es una pauta de autoría y revisión sobre las entradas existentes, no una API nueva presentada como implementada. Antes de añadir contenido debe existir un archivo de definición con estos datos y su caso de aceptación:

| Dato exigido | Forma vigente / restricción |
| --- | --- |
| Identidad y versión | ID estable de misión, capítulo, escena y opción. Conservar los ID de contratos activos; revisar `assignment`, `runAssignment` y `scriptAt` al versionar Encargos. |
| Propósito humano | Quién pide qué, qué hará el destinatario y qué necesidad seguirá pendiente aunque la entrega tenga éxito. |
| Entrada y regreso | Lugar, requisito de conocimiento/entrega, ruta existente y límite físico del encargo. La aceptación no teletransporta. |
| Opciones | Postura comprensible, coste visible, requisitos explícitos, resultado y continuación. Usar `narrativeRequires` all/any/none o requisitos de Encargos, no deducir consecuencias del texto. |
| Decisión persistente | Hecho real producido y fuente: `flags`, elección de capítulo o recibo confirmado. Aceptar, abrir el modal y prometer no equivalen a completar. |
| Conocimiento | Quién lo presenció, quién recibe el informe, cuándo puede saberlo y cuándo lo reconocerá. Nunca usar una bandera global para volver omnisciente a todo NPC. |
| Resultado de riesgo | Victoria, retirada, derrota recuperable y eventual objetivo imposible, cada uno con continuación. Una pérdida irreversible debe estar escrita y señalada. |
| Memoria posterior | Una escena concreta de regreso/noche/comunidad que consume el hecho sin volver a pagarlo ni simular lo que no se observó. |
| Compatibilidad | Contrato activo, encuentro pendiente, importe pactado y ruta anterior se conservan; una revisión nueva no reescribe los ya aceptados. |
| Revisión | Variantes alcanzables, requisitos faltantes, recarga en fronteras, derrota, pago/coste único, teclado y viewport móvil. |

En la campaña, `campaign-v2.js` define los eventos y `campaign-content.js` contiene las definiciones extraídas del runtime. `narrative-chapters.js` y las funciones de presentación condicionada muestran cómo extender consecuencias sin editar indiscriminadamente `game-v2.js`. Para capítulos, `narrativeVisit`, `narrativeRecord`, `narrativeBlocked` y `narrativeChapterEffects` conservan recorrido y conocimiento; para acuerdos de compañeros, los módulos `companion-*` usan registros concretos.

No insertar ni reordenar escenas principales a ciegas: hay referencias por índice, títulos, días y revisiones de campaña. El siguiente paso de escalabilidad debe introducir identificadores para el catálogo principal y una migración explícita antes de alterar esa topología. Extraer datos por sí solo no elimina ese acoplamiento.

En Encargos, el patrón vigente es definición versionada + `prepare()` + `scriptAt()` + `arrivalAccount()` + `communityMemory()`. `corridors.mjs`, `beatriz.mjs`, `guzman.mjs` y `jimenez.mjs` son ejemplos concretos. La progresión consulta `requires_any` y recibos pagados; las recepciones y seguimientos solo se habilitan con una entrega confirmada. Nuevos efectos materiales deben ser únicos y conservar términos históricos; nunca escribir en ambos guardados desde un diálogo.

La comunicación entre equipos sigue el patrón de `world-continuity.js`: leer un recibo duradero de Mensajeros, validar origen/destinatario/completitud, importar una vez en una frontera segura y consumir una ayuda solo en la salida confirmada. La copia de Morales es el único hecho de esa conexión hoy. No se amplía el puente a todos los encargos por inferencia.

## Verificación y siguiente bloque

`tests/vertical-slice-night.test.cjs` recorre las cinco salidas reales de la farmacia hasta la primera noche, incluido el traslado sin combate. Verifica recibos restaurados, distinción atención/llegada, resultados de bomba, ausencia de efectos al leer, protección del contexto V0.2, consumo único y compañeros agotados. La batería dirigida de noche y conversaciones aprueba 20 casos.

Las pruebas de continuidad aíslan el estado narrativo; no demuestran la duración ni el balance de una sesión completa. El bloque de continuidad añade recorridos de navegador desde una partida nueva, orientación contextual y retorno visible, conservando las superficies aprobadas. Su resultado y límites se registran en `day-one-continuity.md`. La duración de lectura humana sigue pendiente; solo después corresponde ajustar densidad o sumar otro encuentro.
