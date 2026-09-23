# NeoSantiago 2130 — V0.3 Vertical Slice

Fecha de inicio: 23 de septiembre de 2026. Rama: `feature/v0.3-vertical-slice`.

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

En curso. Consultar `docs/v0.3/` para QA, audio, resultados y guion de comprobación del tramo. No integrar a `main` hasta revisar la rama y sus comprobaciones.
