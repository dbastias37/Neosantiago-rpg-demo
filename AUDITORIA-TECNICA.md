# Auditoría técnica conservadora — Neo Santiago

Fecha: 5 de septiembre de 2026. Base auditada: `main`, commit `a343bb5637a62d8480deddb771bf832bf7c58015`.

Se revisó el código antes de modificarlo. Se preservaron el catálogo de campaña, los diálogos, las rutas, los valores de combate, las recetas y las recompensas definidas. No se añadieron mecánicas ni se reorganizó el runtime.

## Estructura y dependencias

El repositorio es una aplicación estática, sin compilación, servidor de juego ni dependencias declaradas. Antes de esta auditoría no había tests automatizados ni instrucciones `AGENTS.md`.

| Archivo o directorio | Función y relaciones |
|---|---|
| `index.html` | Entrada que redirige a la demo; conserva parámetros y fragmento mediante JavaScript. |
| `campaign-v2.js` | 27 situaciones, 81 decisiones de campaña y sus requisitos, efectos, combates y finales. Define `CAMPAIGN_EVENTS`. |
| `neosantiago-demo.html` | DOM, CSS responsive, catálogo de archivos narrativos, objetos de misión, clave de guardado y rutas de audio. Carga campaña → datos inline → runtime. El antiguo runtime v1 está comentado: no instala listeners activos duplicados. |
| `game-v2.js` | Estado, reglas, renderizado, interacción y guardado. Depende de los datos y del DOM definidos anteriormente. |
| `narrative/` | 21 imágenes WebP para siete rutas: Matías, Rosa, Lira, S-7, H-12, Vega y Ortega. |
| `backgrounds/` | 11 imágenes; fondos asignados por día/escena mediante CSS. |
| `characters/`, `portraits/` | 5 imágenes de personajes y 27 retratos para perfiles, NPC, aliados y enemigos. |
| `items/` | 33 imágenes del inventario, equipo, crafteo y botín. |
| `audio/` | 42 archivos versionados, incluidas instrucciones de assets; el mapa de reproducción contiene rutas opcionales todavía ausentes. |
| Raíz, otros assets | Fondos por día, ilustraciones generales, favicon, SVG y vista previa social. |

| Sistema | Puntos principales del runtime |
|---|---|
| Estado/persistencia | `fresh`, `state`, `save`, `load`; `localStorage`, clave `neosantiago2130_demo_v3`. Los estados de ventanas, combate y temporizadores viven fuera de `state`. |
| Expedición/refugio | `choose`, `completeChoice`, `advance`, `continuePendingAdvance`, `night`, `openRefuge`, logística y salida del refugio. |
| Narrativa/NPC/rutas | `branchDialogueDefs`, `npcDialogueDefs`, `routeNarrativeDefs`, `eventDisplay`, selección de respuestas y escenas. 39 nodos NPC, 117 respuestas; 21 escenas de desvío, 63 opciones. |
| Combate/aliados | `startCombat`, `combatAction`, `enemyPhase`, `battleState`, habilidades, hambre, armadura, victoria y retirada. |
| Inventario/recursos | `equipmentDefs`, mochilas de `state.party`, `bagUsed`, `canReceive`, `placePartyItem`, transferencias, comercio y consumo. Agua sigue siendo recurso común. |
| Loot/desarme | `beginLoot`, generación de botín, recogida, `disassemblyState`, consumo del objeto y entrega de piezas. |
| Crafting | `workshopRecipes`, `canCraft`, `craftOutputFits`, `craftItem`; depende de profesión, habilidades, acciones, herramientas, costes y capacidad. |
| Psicología | `psyche`, `inferPsychImpulse`, `applyPsychImpulse`, `psychEffect`; afecta pruebas, curación, precisión y otros modificadores. |
| Inhibición/rastreo | `state.inhibitor`, reloj global, pausa por ventanas, secuencias, alarmas, desplazamientos expuestos y combate contextual. |
| UI/modales | Apertura/cierre explícitos, clases `hidden`, foco, atajos globales y timers de texto. No hay un gestor central de ventanas. |
| Audio/fondos | `audioRoutes`, reproducción/fallback, caché de fallos, fundidos de loops; `sceneKeyForEvent`, `assetUrl` y fondos CSS. |
| Finales | Tres decisiones finales, `finish`, clasificación/puntuación, resumen y exportación PNG. |
| Responsive | Media queries acumuladas por ancho, altura y orientación en el HTML; la corrección portrait previa de rutas permanece. |

## Hallazgos clasificados y correcciones

| ID | Gravedad | Evidencia y efecto | Corrección |
|---|---|---|---|
| C1 | CRÍTICO | `visibilitychange`/`beforeunload` llamaban a `save` desde la portada con `state=fresh()`. Visitar y cerrar la página podía reemplazar una partida existente sin haberla continuado. | Solo una sesión iniciada o restaurada puede guardar. Reproducido y verificado. |
| A1 | ALTO | Una elección guardaba recompensas y flags manteniendo el mismo índice, pero no guardaba `pending`, diálogo ni combate. Recargar permitía volver a cobrar y escoger consecuencias incompatibles. También podía conservar loot sin su batalla. | Guardado coherente al comienzo y al cierre del encuentro. Mientras está pendiente se conserva el último punto completo. Se comprueba la liberación del bloqueo al avanzar, terminar, retirarse y reiniciar. |
| A2 | ALTO | Tras una respuesta terminal NPC, el botón de avanzar texto volvía a mostrar las opciones. Permitía responder otra vez y combinar rutas incompatibles; reproducido con Rosa. | La respuesta resuelta bloquea la reapertura/selección. El bloqueo se reinicia al entrar a otro nodo. |
| A3 | ALTO | Pulsar `1`, `2` o `3` con el panel lateral abierto ejecutaba una decisión detrás de él. | Se bloquean los atajos de campaña en paneles, transferencia, descarte y campos de entrada. Escape conserva su función. |
| A4 | ALTO | Recargar tras tres errores o un contacto confirmado eliminaba la ventana de alarma y permitía continuar sin drones. | Se conserva el contacto pendiente. Restaurarlo no duplica alarma, amenaza ni contador de combates de rastreo; victoria/retirada lo limpian. |
| M1 | MEDIO | El callback de saqueo solo comprobaba que hubiese algún combate en fase loot. Un callback anterior podía modificar otro combate y consumir su generador aleatorio. | Intervalo y callback comprueban la identidad del combate original. |
| M2 | MEDIO | El paso diferido entre secuencias podía arrancar una ronda perteneciente a otra sesión del inhibidor. | El callback comprueba la identidad del desafío. |
| M3 | MEDIO | Desarmar un stack de electrónica desde un cadáver marcaba el stack entero como consumido, entregando piezas de una sola unidad. Desde mochila se consumía una unidad. | Se consume una unidad; el resto permanece disponible. No se alteran las recetas ni su rendimiento por objeto. |
| M4 | MEDIO | La moral podía llegar a cero en una ruta sin actualizar el regreso obligatorio que sí se evaluaba en campaña/NPC. | Se comprueba la moral al cerrar el encuentro, reutilizando el regreso existente. |
| M5 | MEDIO | Índices `null`, ausentes, fraccionarios o cadenas superaban la validación de límites y podían llegar a `events[index]` inválido. | Se exige un entero dentro de rango antes de restaurar. |
| M6 | MEDIO | 19 precargas de personajes/rutas usaban URLs distintas a `assetUrl`: aproximadamente 2,62 MB de descargas anticipadas que no satisfacían las peticiones posteriores. | Se eliminan esas precargas; las imágenes siguen cargándose cuando se utilizan. Se mantienen precargas de portada y fondos, cuyas URLs coinciden. |
| M7 | MEDIO | Diálogo NPC e inhibidor combinaban altura máxima con `overflow:hidden`: el contenido excedente no tenía salida de scroll. Hallazgo estático; falta medición visual. | Se habilita scroll vertical en esos dos modales. No se cambian medidas, colores, tipografía ni distribución horizontal. |

El reinicio también cierra resultado, noche y panel lateral para evitar ventanas residuales.

### Alcance del guardado corregido

Un encuentro comprende la decisión de campaña y el diálogo/desvío/combate que desencadena. Recargar antes de cerrarlo vuelve al punto anterior **con recursos, flags, estadísticas y semilla coherentes**. La retirada guarda sus consecuencias y el regreso al refugio. Los contactos de rastreo confirmados sobreviven a la recarga.

Esto evita persistir medio encuentro; no implementa reanudación exacta de una ronda, una línea de diálogo o un minijuego. Las acciones del encuentro inconcluso deben repetirse al recargar. Las partidas antiguas que ya guardaron consecuencias parciales no contienen información suficiente para reconstruir su situación anterior: la corrección previene nuevos casos, no deshace esos guardados.

## Detectado y deliberadamente no modificado

| Gravedad | Problema o límite | Motivo de conservarlo |
|---|---|---|
| ALTO | Con las tres mochilas llenas, `apply({fx:{meds:1}})` informa Medicina +1 aunque se reciban cero unidades. `placePartyItem` puede entregar parte del lote y devolver `false`; varios llamadores no gestionan el resto. Afecta recompensas de decisiones/misiones. | Una solución completa necesita decidir cómo conservar o reclamar el excedente y cómo presentarlo. No se añade almacenamiento, no se cambia capacidad y no se retocan recompensas durante esta auditoría. |
| MEDIO | Hay 64 referencias de audio a 60 rutas ausentes. Algunas listas sí contienen alternativas existentes; otras quedan sin sonido cuando fallan. | Crear/sustituir audio cambiaría contenido. La caché de fallos limita reintentos dentro de la sesión. No equivale a 64 fallos de jugabilidad. |
| MEDIO | La misión «Fuera del mapa» cuenta éxitos acumulados, aunque su descripción puede interpretarse como una racha sin alarmas. | Resolverlo exige decidir la condición deseada o cambiar el texto/balance, excluidos de esta tarea. |
| MEDIO | La validación de guardados no cubre todos los tipos internos, cantidades ni equipos desconocidos. `continueGame` todavía inicia una partida nueva cuando `load` falla. | Se corrigió el índice; una migración defensiva completa y recuperación de archivos dañados necesita especificación y pruebas adicionales. |
| MEDIO | Algunas consecuencias descontadas por datos narrativos no llevan requisito equivalente en esa misma opción. El consumo puede ser parcial cuando faltan recursos. | Hay requisitos implícitos en nodos anteriores. Bloquear opciones automáticamente podría crear salidas inaccesibles o cambiar decisiones existentes. Se debe revisar cada cadena antes de ajustar datos. |
| BAJO | HUD con textos de 5–8 px y botones de flechas de 34 px de alto en landscape corto. | No se rediseña la densidad de la interfaz. Requiere prueba táctil y visual antes de cambiar dimensiones. |

## Verificación realizada

Comandos reproducibles, sin instalar dependencias:

```sh
node --check game-v2.js
node --check campaign-v2.js
node --test tests/stability.test.cjs
git diff --check
```

Las **20 pruebas** pasan. El harness ejecuta los scripts activos en el orden del HTML con un DOM y temporizadores simulados; falla ante IDs estáticos solicitados que no existen. Comprueba recargas, siete rutas, combates de desvío, NPC, alarmas, pausas del reloj, botín, capacidad, crafting, combate con munición real, noche y tres finales. No sustituye un navegador ni verifica sonido o interacción táctil reales.

Además se revisaron enlaces de nodos/escenas, enemigos referenciados, imágenes de ruta, IDs duplicados y funciones globales duplicadas. `eventDisplay` y requisitos se evaluaron para las 27 situaciones con 303 configuraciones de flags (vacías, todas y cada flag individual). Eso comprueba integridad de referencias, no demuestra compatibilidad semántica de todas las combinaciones posibles.

No se confirmó doble aplicación de costes de entrada y victoria en los datos actuales: todos los combates de desvío tienen `victory` independiente. No había referencias rotas en los 21 assets narrativos ni salidas inexistentes en los nodos auditados. No se sustituyeron estos sistemas.

### Responsive: alcance y pendiente

| Tamaño | Comprobación realizada | Pendiente |
|---|---|---|
| 360×800 | Revisión de reglas portrait, flujo imagen/texto/opciones, ancho de botones y salida de scroll. | Render, medición de overflow, toque y foco reales. |
| 390×844 | Misma revisión estática. | Mismas verificaciones visuales. |
| 412×915 | Misma revisión estática. | Mismas verificaciones visuales. |
| 768×1024 | Reglas de tablet portrait y modal narrativo. | Render y prueba de inventario/NPC. |
| 1024×768 | Reglas tablet landscape, alturas de modales y rejilla de inventario. | Comprobar mínimos acumulados y controles. |
| 915×412 | Reglas landscape corto del inhibidor y rejillas de campaña. | Toque, legibilidad y alcance de botones. |
| 1920×1080 | Reglas desktop 16:9; no se modificó su distribución. | Capturas comparativas de diálogo/ruta/perfil/combate. |

No había navegador ejecutable disponible; la instalación previa de Chromium no pudo completarse por conectividad. **No se certifica ausencia de superposiciones ni degradación horizontal mediante renderizado.** Los cambios CSS de esta auditoría se limitan al overflow de dos ventanas; la corrección portrait de rutas de la base se conserva.

## Riesgos a vigilar

- Cada nueva salida de encuentro debe cerrar correctamente el bloqueo de guardado. Si se incorpora otro punto de entrada a combate fuera de `choose`/rastreo, debe participar en el mismo protocolo.
- `eventDisplay` aplica prioridades mediante retornos tempranos. Añadir una rama de flags puede ocultar otra ventaja narrativa; revisar coexistencia por escenario.
- Una retirada mantiene el evento pendiente y sus efectos ya aplicados en la sesión. No se cambió la semántica de reintentar encuentros; conviene revisar beneficios de entrada que puedan reclamarse otra vez al repetir una ruta tras huir.
- Las consecuencias de `apply`, el inventario y las misiones no forman una transacción de entrega cuando falta espacio.
- Los callbacks deben pertenecer a una instancia concreta; comprobar identidad antes de tocar combate, minijuego o ventana.
- El CSS contiene overrides acumulados y `!important`, especialmente en inventario. Evitar nuevos overrides globales sin comparación portrait/landscape en navegador.
- Mantener los tres archivos de entrada coordinados y actualizar la revisión del script al publicar. No mezclar guardados parciales con interfaces no serializadas.

Archivos modificados: `game-v2.js`, `neosantiago-demo.html`. Archivos añadidos: este informe, `tests/runtime-harness.cjs` y `tests/stability.test.cjs`.
