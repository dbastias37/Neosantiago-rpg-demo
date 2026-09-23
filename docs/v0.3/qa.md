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
