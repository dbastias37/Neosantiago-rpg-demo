# QA V0.3: dos capas y límites de la evidencia

La suite Node existente sigue siendo el contrato de reglas y continuidad. Playwright añade navegación real, renderizado, iframes, interacción táctil simulada y recuperación. Los fixtures del navegador no certifican equilibrio, dificultad, duración de 30–60 minutos ni calidad narrativa.

## Ejecución

```sh
npm ci
npm test
npm run validate
npx playwright install --with-deps chromium
npm run test:e2e
npm run qa:performance
```

Playwright 1.63.0 está fijado en el lockfile. Node 22 es la versión de CI. El servidor QA usa `127.0.0.1:4173`, sin paquetes de servidor adicionales. No es un servidor de publicación. `npm run qa:performance` usa otro puerto y genera `test-results/performance.json`.

La matriz Chromium cubre 360×800, 390×844, 412×915, 915×412, 768×1024, 1366×768 y 1920×1080. El navegador simula pantalla y entrada táctil; no equivale a probar Safari/iOS ni GPU, audio físico, teclado virtual o rendimiento de teléfonos reales.

## Cobertura E2E

| Caso | Interacciones verificadas | Preparación |
|---|---|---|
| Entrada y actividades | Portada, cinemática y omisión, todas las páginas de introducción, preludio, ayuda inicial, lote de Mara, inventario, Armero, central, mapa y expediente, inventario/refugio de Mensajeros | Partida realmente nueva, sin modificar estado |
| Combate y loot | Defender, selector de enemigo portrait, saqueo real añade una ración, selector de aliado portrait | Globals existentes preparan combate determinista y fase loot; no certifica victoria/balance |
| Compuerta de producción | Restaurar desvío, iniciar panel, teclado, resultado abierto, cruzar, avance único y recarga | Motor de producción genera y serializa el encuentro de prueba; descubrimiento/origen preparados |
| Colapso futuro | LA RED CAYÓ, aislamiento de tecla 1, recarga y Continuar, recuperación de checkpoint y créditos | API de operaciones recibe explícitamente un colapso de prueba; ninguna misión real lo activa |

Cada prueba falla ante excepciones de JavaScript, errores de consola o respuestas HTTP inesperadas. La única excepción documentada es HTTP 404 de audio heredado, por ruta exacta; se adjunta el registro de esa deuda. Con la capa de disponibilidad V0.3 esas rutas ausentes no deberían solicitarse. No se silencian todos los 404 ni los errores del navegador.

Las capturas de estados representativos se generan por resolución en `test-results/`. El reporte HTML y trazas de fallos ayudan a inspeccionar interacciones. No se declara aprobación visual automática: todavía no hay imágenes de referencia aprobadas para comparación píxel a píxel. Se revisaron capturas representativas de portrait, landscape y escritorio, incluidas texturas y retratos de los iframes compartidos.

## Validación de referencias y audio

`validate:syntax` comprueba JavaScript/ES Modules, scripts HTML inline y JSON. `validate:references` comprueba referencias literales locales de producción y laboratorios, incluyendo HTML de iframes. Respeta la base del documento y no acepta un archivo homónimo en la raíz cuando el navegador buscaría otro en una subcarpeta. Las rutas construidas dinámicamente necesitan la segunda capa E2E.

`docs/v0.3/reference-debt.json` fija 64 referencias de audio ausente heredadas del commit `009092d`. La excepción compara origen, literal y ruta resuelta: usar el mismo audio ausente desde un nuevo archivo falla. No regenerar este documento para hacer pasar una regresión. El catálogo de disponibilidad y PROVENANCE son metadatos, no peticiones; quedan fuera de este escáner. `validate:audio` comprueba por separado que catálogo e informes JSON/Markdown coincidan con los archivos y referencias reales.

Dos regresiones del validador tienen prueba Node: resolución relativa de CSS/iframes y rechazo de nuevas ocurrencias de deuda.

## CI

`.github/workflows/qa.yml` se ejecuta en pull requests, pushes a `main`, `feature/**`, `v0.3/**` y manualmente. Primero ejecuta instalación limpia, Node y validadores; después instala Chromium oficial y corre toda la matriz. Conserva reporte/capturas/trazas durante 14 días incluso si hay fallos. La activación remota depende de subir esta rama y de que GitHub Actions esté habilitado en el repositorio. El workflow no modifica reglas de protección de `main`.

## Resultado de esta revisión

427/427 pruebas Node aprobadas. Sintaxis: 147 scripts/bloques/JSON; referencias: 414 literales, 64 ausencias heredadas y cero nuevas; catálogo de audio consistente. La matriz completa de 28 E2E pasó. Después se amplió el caso de entrada para recorrer también los adaptadores de inventario/refugio de Encargos: sus siete resoluciones volvieron a pasar. No hubo errores JavaScript, consola o HTTP inesperados en esos recorridos.

## Entorno de esta revisión

El CDN del navegador devolvió un archivo truncado en este entorno. Se verificó con Chromium 153.0.8010.0 obtenido de `@sparticuz/chromium` en un directorio temporal, usando Playwright 1.63.0. La dependencia alternativa no se añade al juego ni a CI. El override reproducible es `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; `PLAYWRIGHT_CHROMIUM_ARGS` acepta una lista JSON de flags locales. CI conserva la instalación oficial de Playwright.

## Pendiente antes de declarar terminado el vertical slice

Recorrer el tramo completo sin fixtures; medir tiempo de lectura y decisiones; verificar ambas rutas de consecuencias; aprobar capturas visuales definitivas; probar Safari/iOS y Android real; revisar audio de los assets que faltan. Los éxitos de Node/E2E no sustituyen estos criterios.


## Ampliación: continuidad del primer día

`tests/e2e/day-one.spec.cjs` añade dos recorridos completos a cada una de las siete resoluciones. Ambos comienzan mediante la portada y la introducción, eligen Exploración, recogen el lote inicial y resuelven el inhibidor con su teclado real. No inyectan partidas, salud, objetos, semillas, resultados ni temporizadores. Las lecturas de estado se utilizan para comprobar efectos y elegir controles que están disponibles para el jugador.

La variante de rescate fuerza la compuerta, gana el combate por turnos, registra el cadáver, recoge loot que cabe en la mochila y elige la mejora ganada. La variante alternativa alimenta el lector y deja provisiones a Matías sin trasladarlo. Ambas recorren las nueve situaciones principales, usan los recursos y costes normales, deciden no asegurar la bomba, llegan a la noche, hablan con Noa, descansan y preparan la segunda salida. No afirman cubrir todas las decisiones ni certificar dificultad.

Se recarga en noche pendiente, noche pagada y refugio preparado; se cambia de actividad y comerciante; se lee el relato en el modal existente y se compra una ración con los créditos disponibles. La salida se comprueba antes del segundo hack, porque esa sincronización puede pagar una recompensa de misión ya existente. Los informes `day-one-run.json` adjuntan recursos, hechos y tiempos de reproducción automática; las capturas incluyen orientación, combate, loot, noche, lectura del regreso y preparación.

Las pausas del registro del cadáver y de la oferta de mejora se esperan explícitamente. No se adelantan sus timers desde el test ni se pulsa a través de overlays. La lista comercial debe conservar espacio para operar antes y después del mensaje de compra, incluida la pantalla 915×412.

Resultado integrado del bloque: **436/436 Node y 42/42 E2E**, sin reintentos en la ejecución local final. Incluye los 28 casos anteriores y 14 recorridos completos nuevos. Sintaxis, referencias y audio aprobados. La matriz final incluye compras reales y las correcciones de scroll/filas compartidas. El CI existente descubre automáticamente la nueva suite.

## Enlaces de comunidad en producción

`medical-bridge.spec.cjs` añade el recorrido sin parámetro de laboratorio, con las claves normales; conserva A/B para regresión e aislamiento. `rosa-bridge.spec.cjs` comprueba preparación de la tercera jornada, teclado, solicitud, viaje a Plaza, recogida, aceptación de la escolta de Ana, recepción en Los Héroes, refugio compartido, regreso a Expedición, recarga, inhibidor y decisión en la avenida. Ambos se ejecutan en las siete resoluciones: 14 casos adicionales, 77 en total.

Se prepara la frontera de jornada con un fixture; los viajes intermedios y la escolta se resuelven con el motor de producción y se cargan al llegar. Los botones de solicitud, aceptación y entrega, el almacenamiento y las ventanas son reales. Estos recorridos no equivalen a una partida humana ininterrumpida. Node recorre los trayectos con tres semillas, además de verificar encargos en curso, pagos anteriores, recibos ajenos/provisionales, guardados antiguos, escritura fallida, entrega tardía e idempotencia.

La primera matriz detectó compresión del comercio al aparecer el aviso médico en dos resoluciones. La corrección conserva las aserciones y da scroll propio a la sección de avisos en pantalla ancha; los seis casos afectados pasan. Se conserva esta incidencia en `community-links-production.md` y se registra allí el cierre de la matriz final.

Cierre local de enlaces: **463/463 Node y 77/77 E2E**, sin reintentos en la matriz final. Ver detalles y revisión adicional de lectura de los avisos en `community-links-production.md`.
