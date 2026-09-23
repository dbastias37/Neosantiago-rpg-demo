# NeoSantiago 2130 — V0.3 Vertical Slice

Fecha de inicio: 23 de septiembre de 2026. Fundamentos integrados mediante PR #5 (`main` en `d9f4a22`). Bloque actual: `feature/v0.3-day-one-continuity`.

**Estado: desarrollo y revisión; V0.2 sigue siendo la versión publicada.** Este documento no certifica todavía una experiencia de 30–60 minutos ni el cierre de V0.3.

## Base contrastada

`main` auditado: `009092d0c9ba73fbe9a64ef52249f951ac5326a5`, favicon aprobado del 21 de septiembre. Copia limpia independiente; no se modificaron otros trabajos locales. El despliegue de Render responde HTTP 200 y anuncia actualización del 21 de septiembre. Las comprobaciones posteriores se hacen sobre la rama local, no sobre una publicación nueva.

Se revisaron README, continuidad V0.2, auditoría técnica, notas de versión, bibliografía, decisiones y etapas narrativas, entrada HTML, runtime, campaña, extensiones y suite. La documentación histórica no es una descripción exacta de `main`: README decía 390 pruebas; la ejecución inicial dio **394 aprobadas, cero fallos**. La auditoría de septiembre 5 precede muchos módulos y correcciones actuales.

| Medida inicial | Valor |
| --- | ---: |
| Archivos versionados | 383 |
| `game-v2.js` | 355.331 bytes / 1.885 líneas |
| `campaign-v2.js` | 59.309 bytes / 143 líneas |
| `neosantiago-demo.html` | 282.985 bytes / 2.054 líneas |
| Dependencias iniciales de desarrollo | linkedom 0.18.13 |
| Suite Node inicial | 394 / 394 |

## Diagnóstico

Base jugable con buena cobertura de reglas, guardados y consecuencias. La campaña conserva un runtime grande, pero ya tiene módulos de combate, perfiles, capítulos, finales, noches, compromisos y continuidad. Mensajeros comparte presentación mediante adaptadores e iframes y mantiene un motor modular. Reescribirlos o fusionar los dos inventarios sería una regresión.

Faltaban CI y E2E versionados. El HTML concentra estilos y precarga escenas que no se necesitan en la portada. Hay deuda real de archivos de audio. Las pruebas DOM existentes no acreditan dibujo, rendimiento, duración ni equilibrio.

## Arquitectura objetivo y límites

Separar contenido declarativo, configuración, persistencia, presentación y resultados, conservando las funciones públicas y el orden síncrono de carga de la campaña. La extracción inicial usa scripts clásicos: convertir todo a ES Modules rompería consumidores globales sin aportar un beneficio inmediato. Los módulos nuevos deben tener contratos pequeños y pruebas de integración; Mensajeros conserva sus ES Modules.

El estado autoritativo continúa en cada equipo. Las noticias entre actividades atraviesan comprobantes confirmados; no transfieren tiempo, dinero ni objetos. Las consecuencias se registran como hechos identificables, con fuente y momento, y no se reconstruyen suponiendo elecciones que el jugador nunca tomó.

Los resultados distinguen interrupción recuperable, fracaso irreversible de una misión y colapso narrativo final. La derrota de torre y los cinco cierres aprobados mantienen su resolución. Red Libre, Bastión, Corte y Continuidad son direcciones futuras; no sustituyen retrospectivamente esos finales.

## Vertical slice elegido

Primer día de Expedición: cinemática → Los Héroes → grupo y Mara → preparación → señal/consejo → puerta sellada con alternativa técnica → familia y decisión → encuentros/combate/loot → bomba de agua → Matías → regreso narrativo a Línea 1 → noche y memoria de consecuencias.

El mapa de decisiones muestra la ruta vivida; no se presenta como un nuevo mapa geográfico de viaje. Los paneles numéricos y el mapa físico de Encargos se verifican como sistemas compartidos, sin forzar un cambio de equipo dentro del rescate. La puerta sellada satisface la interacción técnica opcional existente. El regreso de Matías ya es narrativo y no abre por sí mismo la tienda de Mara.

Duración objetivo: 30–60 minutos. Debe medirse con lectura, preparación y combates normales. Las pruebas con estados preparados solo demuestran continuidad técnica.

## Riesgos y mitigaciones

| Riesgo | Decisión |
| --- | --- |
| Guardar medio encuentro o duplicar loot | Mantener `gameSessionActive` y `encounterSaveLocked`; comprobar recarga antes/después de resolver. |
| Versiones de producto confundidas con esquema | Mantener `neosantiago2130_demo_v3`, schema 3, y `neosantiago.mensajeros.production.v1`. |
| Módulos globales y orden de scripts | Extraer declaraciones sin cambiar nombres; comprobar arranque e integración. |
| Adaptadores de Encargos | Revisar sus cargas y usar los componentes existentes; no crear un segundo combate. |
| `failed` de Mensajeros ya es recuperable | No reinterpretarlo como muerte o fracaso permanente. |
| CSS acumulado | Extraer conservando orden y URLs antes de cambiar especificidad. |
| Audio ausente | Inventario reproducible, prioridades, alternativas existentes; no sintetizar ni inventar assets. |
| Pruebas pasan pero el juego no funciona visualmente | Segunda capa Playwright en siete tamaños, capturas y errores de navegador. |
| Rendimiento | Medir antes/después; no optimizar por intuición. |

## Bloques de trabajo

1. Auditoría, arquitectura y alcance documentado; baseline 394 pruebas.
2. CI, validación de sintaxis/referencias, Playwright y baseline reproducible.
3. Extracción de datos/configuración/persistencia; fixtures de guardados V0.2.
4. Resultados de expedición/misión/campaña y recuperación segura.
5. Consolidación inicial CSS y accesibilidad sin rediseño.
6. Inventario y disponibilidad de audio compartida.
7. Noche del primer día: recordar hechos reales del rescate y la bomba; revisión integrada.

Cada bloque tiene commit propio y comprobación Node. E2E y validaciones finales se ejecutan sobre la combinación completa. Los resultados y límites se añaden abajo al cerrar los bloques.

## Compatibilidad

No cambiar claves ni versiones de contenido para simular una nueva edición. Conservar contratos antiguos de Mensajeros, rutas, provisiones, pagos y puntos de control. Las nuevas estructuras opcionales se normalizan sin reinterpretar hechos antiguos. `Nueva partida` sigue siendo una acción explícita; una carga inválida no debe borrar el guardado.

## Registro de entrega

### Extracción conservadora

`campaign-content.js` concentra catálogos narrativos; `campaign-config.js`, configuración y objetos; `persistence-v3.js`, estado inicial, carga y guardado. Se conservaron declaraciones, nombres y comportamiento. El runtime pasa de 355.331 a 230.231 bytes; es una separación de responsabilidades, no una reducción equivalente de descarga total.

Las partidas de prueba V0.2 (inicio y checkpoint tras retirada) se restauran con igualdad de estado, incluida tripulación, flags, recursos y refugio. Guardados y bloqueo transaccional conservan su contrato. **398/398 pruebas**, sintaxis y `git diff --check` aprobados tras esta extracción.

### Estilos y accesibilidad

Los dos bloques CSS inline se separaron en hojas con el mismo orden y contenido; comparación exacta contra `009092d` aprobada. La paleta y las áreas seguras se centralizan; los adaptadores conservan su carga desde la entrada. Foco visible extendido y transiciones de cinemática respetan movimiento reducido. No se alteró la especificidad de los estilos anteriores. Suite integrada en este punto: **403/403**, sin fallos; incluye pruebas nuevas de persistencia y noche en desarrollo.

### Carga y memoria nocturna

Se reprodujo y corrigió una carga parcialmente aplicada: un guardado con mochila inválida podía reemplazar el estado activo antes de retornar error. La carga ahora restaura la referencia anterior al rechazarlo y no escribe sobre los bytes originales. Prueba dirigida incluida en `tests/persistence-v3.test.cjs`.

La primera noche incorpora Matías y la bomba usando hechos existentes. Atiende la diferencia entre auxilio, llegada confirmada y destino desconocido; conserva el contexto literal de noches V0.2 ya iniciadas. No cambia pagos, costes, recuperación ni decisiones. Casos dirigidos de noche: **20/20**; suite integrada del bloque: **403/403**. El recorrido y los límites están en `docs/v0.3/vertical-slice.md`.

### Audio

Inventario reproducible: **37 archivos existentes, 64 faltantes (50 P0 / 13 P1 / 1 P2)**. De 81 eventos, 28 tienen sus archivos, 26 disponen de alternativas existentes de propósito compatible y 27 quedan pendientes. `audio-catalog.js` y `audio-availability.js` evitan solicitudes conocidas como inexistentes y comparten resolución entre Expedición y los adaptadores de combate/perfil. No se añadieron assets. Las grabaciones ausentes conservan transcripción, mensaje accesible y foco en cerrar. **410/410 pruebas** y catálogo verificado. El detalle exacto de archivo, referencia y prioridad está en `docs/v0.3/audio-audit.md` y `.json`.

### Derrota, misión y Game Over

`outcomes-v3.js` define los tres resultados y un registro aditivo, validado e idempotente. La derrota real se conecta a Expedición y Encargos sin duplicar costes; se conservan el reintento de Mensajeros y los cinco cierres de torre. La API de misión irreversible y el colapso «LA RED CAYÓ» quedan preparados para contenido futuro, sin activar una muerte nueva en V0.2.

La recuperación de campaña conserva checkpoint y estado previo por operación, valida antes de escribir, guarda un backup y restaura recursos/flags conjuntamente. Continuar reabre el colapso pendiente; inhibidor, teclado y Atrás respetan la pantalla. No borra la partida ni modifica el guardado del otro equipo. **14 pruebas de resultados**; suite integrada **425/425**. Contratos y límites: `docs/v0.3/outcomes.md`.

### QA, CI y rendimiento

La suite final local aprueba **427/427 pruebas Node** y **28/28 E2E**, cuatro escenarios en cada una de las siete resoluciones pedidas. Después de ampliar el caso inicial con inventario/refugio de Encargos, sus siete tamaños volvieron a pasar. La verificación comprueba errores de navegador, interacción real, selectores portrait, loot, restauración/cruce de compuerta y recuperación de Game Over. Las capturas representativas se inspeccionaron; todavía no hay baselines visuales aprobadas para comparación automática por píxel.

Los validadores aprueban 147 scripts/bloques/JSON y 414 referencias literales. Las 64 ausencias históricas se registran por ocurrencia exacta; ninguna nueva está permitida. El chequeo de audio exige que catálogo e informes completos sigan sincronizados. GitHub Actions instala desde lockfile, ejecuta Node/validadores y después Chromium/Playwright, conservando artefactos 14 días. La ejecución remota debe comprobarse al subir la rama.

Se retiraron diez preloads de escenas tardías. Medición local comparable de cuerpos descargados: **4.036.270 → 2.696.166 bytes (−33,2 %)**. Imágenes iniciales: 26 → 17. JS inicial: 704.416 → 730.174 bytes; solicitudes totales: 63 → 67. La separación de módulos no se disfraza de reducción de JS. Los tiempos, memoria y long tasks están en `docs/v0.3/performance.md` y sus JSON; son muestras locales sin throttling, no una promesa de velocidad en móviles.

## Estado para revisión y continuación

La entrega inicial, ya integrada en `main` mediante PR #5, contiene los fundamentos P0 y el primer pulido del tramo. Los resultados de esa entrega se conservan abajo como baseline histórica. **No declara V0.3 terminada.** La versión visible sigue siendo V0.2; los cambios siguientes se revisan en una rama separada. No se cambió motor, balance, inventario compartido, finales aprobados ni se añadieron misiones grandes.

| Criterio | Evidencia / pendiente |
| --- | --- |
| Compatibilidad V0.2 | Fixtures completos, recarga, bloqueo de encuentro y contratos de Encargos aprobados. |
| Reglas y navegador | 427 Node, 28 E2E; Chromium en siete tamaños. Safari/iOS y teléfonos reales pendientes. |
| Combate/loot compartidos | Adaptadores conservados y recorridos de UI verificados; faltan sonidos esenciales. |
| Derrota y recuperación | Integradas y verificadas; misión irreversible/colapso preparados para contenido futuro. |
| Mundo con memoria | Consecuencias de Matías/bomba reaparecen en la noche; puente de Morales conservado. |
| Experiencia 30–60 minutos | Tramo y variantes definidos; falta recorrido completo sin fixtures y medición de duración. |
| Mapa y regreso | Mapa de decisiones conservado; orientación geográfica y retorno visible a preparación aún pendientes. |
| Pipeline de misiones | Datos separados y contrato autoral documentado; aún existen acoplamientos por índice antes de ampliar/reordenar campaña. |
| Audio final | 64 archivos referenciados ausentes; fallbacks parciales no sustituyen producción sonora ni escucha. |

**Siguiente bloque propuesto al entregar los fundamentos:** recorrido completo, orientación y retorno visible. Su implementación y evidencia están en la sección siguiente. Después quedan la sesión humana medida, assets P0 autorizados, aprobación visual y análisis de IDs estables. No iniciar la producción de 12–15 misiones hasta validar ese circuito.


## Bloque de continuidad del primer día

Autorizado después de revisar `main` en `d9f4a22`. Detalle y compatibilidad: `docs/v0.3/day-one-continuity.md`.

La primera noche ahora termina en la preparación del refugio, antes de confirmar logística y volver a sincronizar el inhibidor. El motivo `preparation` utiliza Mara/Armero, inventario y precios existentes; no da un segundo descanso ni reagrupamiento. Las recuperaciones de emergencia conservan su funcionamiento. La visita comercial del día 2 se vuelve accesible de forma regular, una oportunidad económica que deberá evaluarse con sesiones humanas.

La bitácora ofrece orientación plegable por sector y propósito presente. El refugio permite releer el registro capturado al llegar, sin atribuir conocimiento al comerciante ni inventar el destino de Matías. No hay mapa geográfico nuevo, misiones añadidas ni cambios en el orden de eventos.

Los guardados conservan clave y esquema 3. `returnAccount` es texto opcional en la primera noche; se valida, no se reconstruye en guardados antiguos y no sustituye su contexto. Recargar una jornada ya cerrada fuera del refugio no retrocede la partida.

Node: **436/436** tras la implementación y el ajuste del lector; misma deuda de 64 archivos de audio. El registro utiliza el modal existente para conservar espacio comercial. El CSS compartido corrige el acceso a compras en horizontal corto y fija las filas para que el feedback no tape el comercio. **42/42 E2E aprobadas** en la ejecución local final: 28 casos existentes y 14 recorridos completos, con compras y recargas reales, en las siete resoluciones. Sintaxis, referencias y catálogo aprobados. Resultados reproducibles: `docs/v0.3/day-one-baseline.json`. La reproducción automatizada no valida los 30–60 minutos humanos.
