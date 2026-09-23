# Primera baseline de rendimiento

Medición de 2026-09-23: Chromium 153.0.8010.0, 1366×768, contexto nuevo, servidor local sin compresión/cache HTTP, CPU/red sin throttling. V0.2 proviene del worktree inalterado `009092d`; V0.3 incluye módulos, outcomes, audio, CSS y consolidación de preload. JSON completos: `performance-v02-baseline.json` y `performance-v03-baseline.json`.

| Medida | V0.2 | V0.3 |
|---|---:|---:|
| Cuerpo inicial recibido (bytes) | 4.036.270 | 2.696.166 |
| JavaScript inicial (bytes) | 704.416 | 730.174 |
| Peticiones iniciales | 63 | 67 |
| Imágenes solicitadas | 26 | 17 |
| Bytes de imágenes | 2.934.193 | 1.567.141 |
| Preloads explícitos | 12 | 2 |
| Bytes de preloads explícitos | 1.588.179 | 110.905 |
| Portada usable (ms) | 450 | 363 |
| Long tasks iniciales | 2 | 1 |
| Mayor long task (ms) | 84 | 92 |
| Heap JS inicial CDP (bytes) | 3.817.556 | 3.772.524 |

El cuerpo inicial cae 33.2 %. Se retiraron diez preloads de escenas posteriores; quedan portada y logo cinematográfico. Nueve peticiones de imagen iniciales desaparecen: la imagen restante ya es solicitada por el DOM de introducción. Las peticiones totales crecen por la separación de archivos JS/CSS; el JS inicial aumenta 25.758 bytes. No se ha movido todo el renderizado de paneles ocultos a carga diferida.

| Transición preparada → dos frames (ms) | V0.2 | V0.3 |
|---|---:|---:|
| cinematicToTwoFramesMs | 65 | 58 |
| refugeToTwoFramesMs | 162 | 137 |
| combatToTwoFramesMs | 112 | 171 |

Estas latencias son muestras locales, sensibles a contención, filesystem y caché del SO; no son un benchmark estadístico ni prueban una mejora de velocidad en Render/móviles. Las transiciones usan fixtures explícitos para aislar apertura de cinemática, refugio y combate; no miden el tiempo de lectura del jugador. Se registra `PerformanceObserver(longtask)`, Resource Timing, bytes recibidos y métricas CDP antes y después de las escenas. `performance.memory` está cuantizado en este entorno; usar los datos de heap CDP como referencia local, no como presupuesto universal de memoria. Ambas capturas finalizaron sin excepciones JavaScript.

Reproducción: `npm run qa:performance`. Para comparar revisiones, configurar `NEO_STATIC_ROOT` hacia un checkout, `NEO_PERF_LABEL` y `NEO_PERF_OUTPUT` para conservar el JSON. No se establecen umbrales de tiempo rígidos en CI sobre runners compartidos. Siguiente medición: dispositivo real y despliegue comprimido, ruta de 30–60 minutos, pausas de GC y batería/audio.
