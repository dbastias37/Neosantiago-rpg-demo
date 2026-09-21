> **Continuidad del proyecto:** [informe vigente de V0.2](../../INFORME-CONTINUIDAD-V0.2.md), con estado implementado, pendientes y contexto para otro chat.

> **Producción V0.2, 21-sep-2026:** la red publicada incluye ocho encargos, progresión, retornos, continuidad, combate compartido y economía revisada. Los trabajos cortos usan las mochilas propias; Guzmán, Jiménez y Adasme prestan un equipo de campo mínimo. [Notas de versión y límites](../../docs/version-0.2.md). El contenido inferior conserva la historia del laboratorio original y no describe el estado actual de producción.

> **Actualización 0.2, entrega 12:** los cuatro primeros encargos se preparan con `corridors.mjs`. `production.json` mantiene sus versiones históricas para restaurar guardados. [Diseño, compatibilidad y pruebas](../../docs/corredores-0.2-entrega-12.md).

> **Producción activa, 18-sep-2026:** el juego carga `play.html`, `play.mjs`, `production.json` y `production.mjs` desde su menú de actividades. [Manual de integración](../../docs/metro-refugios/INTEGRACION-JUGABLE.md). El resto de este archivo conserva la documentación histórica del laboratorio aislado.

# Los Mensajeros — estructura inactiva y laboratorio local

17 de septiembre de 2026. Encargos de Guzmán y Adasme; diseño del usuario, implementación de prueba. **No está conectado a la campaña pública.**

`runtime_enabled: false` y `enabled: false` describen la integración de producción. El motor admite exclusivamente un inicio explícito con `mode: "laboratory"`. Importarlo no ejecuta nada: no toca DOM, globals, almacenamiento, temporizadores ni partidas. No se alteran los HTML, JS, CSS, inventario, NPC activos ni guardados de la campaña. No hay nuevo enlace ni archivo HTML ejecutable publicado.

## Probar localmente

Desde la raíz del repositorio:

```sh
python scripts/preview-mensajeros.py
```

Abrir `http://127.0.0.1:8130/`. El servidor escucha únicamente en loopback y sirve `preview.html.template` como HTML solo mediante esa ruta local. No se requiere compilar ni instalar dependencias. Parar con Ctrl+C. Puerto alternativo: `--port 8131`.

La plantilla y las imágenes pueden ser accesibles por URL directa si el alojamiento sirve todo el repositorio; la ausencia de enlaces y entradas HTML impide la activación normal, no proporciona confidencialidad. No desplegar el laboratorio ni convertir la plantilla en un index como parte de este cambio.

## Contenido

| Archivo | Responsabilidad |
|---|---|
| `data.json` | Dos misiones, 18 ubicaciones, dos recorridos, 12 eventos, objetos y balance provisional |
| `engine.mjs` | Estado puro e inmutable; avance, sorteo, resolución, entrega, combate de prueba y recuperación |
| `ui.mjs` / `ui.css` | Mapa, encargos, objetos, diálogos, decisiones, descanso, resultado y controles accesibles |
| `map.svg` | SVG extraído de la última fuente HTML del laboratorio archivado; geometría conservada; rótulo actualizado a «Comunidad de paso» |
| `preview.html.template` | Entrada exclusiva del servidor local |
| `assets/` | Cinco imágenes nuevas WebP y prompts de creación |
| `../../tests/mensajeros.test.cjs` | Casos de misión, aislamiento, guardado y consecuencias |

Se reutilizan los retratos de Guzmán y Adasme, los fondos existentes y las imágenes `items/food.webp` y `items/ammo556.webp`. La tipografía es la misma pila: `"Arial Narrow", "Roboto Condensed", Arial, sans-serif`; no se descarga otra fuente. Paleta y controles derivan de `neosantiago-demo.html` y `item-details.css`. Los nuevos objetos son ilustraciones individuales de ImageGen optimizadas a 512×512 WebP: rotor, sensor, humo, inhibidor y agua. Prompts y referencia visual en `assets/PROVENANCE.json`.

## Ciclo funcional

Aceptar → avanzar → resolver instancia → llegar a estación → descansar si corresponde → entregar al destinatario → recibir una recompensa una sola vez.

El progreso se guarda después de cada acción bajo `neosantiago.mensajeros.lab.v1`. Cerrar un modal no resuelve ni cambia el encuentro. Recargar conserva la tirada, el combate en curso, los consumos y las consecuencias. El botón «Resolver instancia» permite volver a una escena cerrada. Un punto de control es adicional al autoguardado: conserva un estado de recuperación para una derrota.

Los únicos puntos de control del recorrido de Guzmán son Los Leones, Los Héroes, Universidad de Chile y Plaza de Armas. Universidad de Chile es un descanso provisional propuesto por el usuario; no se convierte en comunidad o refugio permanente. Franklin sigue siendo combinación y punto de instancia. El refugio provisorio de Adasme es objetivo de búsqueda, no un puesto seguro automático.

Tras derrota, la prueba permite recuperar condición, carga y provisiones desde el último control. Conserva tiradas ya generadas, vigilancia del mundo y número acumulado de combates para no borrar el costo de una extracción ruidosa. Esta política es provisional. Abandonar no paga ni completa el encargo; permite comenzar otro. Reiniciar el laboratorio requiere confirmación y borra solo este guardado.

## Sorteo y coherencia

El peligro del próximo tramo es visible, el resultado no. Las tablas iniciales son:

| Riesgo | Tranquilo | Decisión | Hostil | Hallazgo |
|---|---:|---:|---:|---:|
| Bajo | 50 | 25 | 15 | 10 |
| Medio | 30 | 30 | 30 | 10 |
| Alto | 15 | 25 | 50 | 10 |

Cada avance sortea como máximo una instancia principal entre eventos compatibles con el corredor. Entregas, rescate y entrada a puntos de control son escenas fijas. Dos hostiles seguidos desvían la siguiente probabilidad hostil a tranquilidad; se evita repetir las últimas tres plantillas si existen alternativas del mismo tipo. No se garantizan combates por misión: los contactos hostiles admiten evasión. Los 12 eventos son una base reutilizable, no contenido final suficiente para toda la red.

La semilla y el registro de tiradas viven en el guardado. El azar usa el encargo, el paso y la vigilancia al descubrirlo. Una tirada existente prevalece aunque cambie la amenaza. Las posiciones del marcador siguen la geometría de las líneas; nunca se atraviesa el corte Baquedano–Los Leones. Consultar un punto no teletransporta.

Cada combate aumenta en 1 la vigilancia del corredor correspondiente, máximo 6; cada 2 puntos elevan una categoría el peligro futuro. El estado se conserva entre encargos del mismo laboratorio. Los corredores de centro, L6 y oriente están separados. No se reduce automáticamente; duración y recuperación necesitan diseño. Retirarse después de empezar una pelea conserva combate y alerta. El humo o la evasión previa no cuentan como enfrentamiento. El inhibidor solo ofrece evasión frente a vigilancia electrónica, no humana.

## Parámetros provisionales y límites

Títulos, diálogos nuevos, tiempos, costos, estado sorteado del rescatado, premios y daño son **propuestas de prueba**, no decisiones narrativas finales. Se centralizan en los datos cuando son compartidos. El combate de prueba es deliberadamente independiente y agregado: condición del grupo, amenaza enemiga, disparo, ataque cercano y retirada. No reemplaza ni importa el sistema de aliados/HP/habilidades de la campaña.

La autonomía del inhibidor es de 20 minutos **de uso narrativo**: solo avanza al resolver acciones mientras está encendido. No se gasta por leer, cerrar el navegador o estar ausente. Puede activarse o desactivarse desde el panel del grupo, cerrando el modal si está abierto. Agotarse lo apaga; nunca mata al aliado ni hace fracasar automáticamente el encargo. Esta interpretación del reloj debe aprobarse antes de conectar a producción. La campaña tiene otro inhibidor: no se reutiliza su temporizador de 90 segundos ni su estado.

Guzmán tiene 13 avances entre estaciones. Adasme usa seis avances; Vicuña Mackenna–Tobalaba se conserva como corredor L4 agrupado, expresamente rotulado: no se inventan estaciones, tiempos reales ni una adyacencia que no existe. La posición del refugio provisorio es esquemática. Expandir L4 será otra etapa.

Cargar al herido añade desgaste y tiempo, sin reducir por sí mismo la recompensa. El estado herido o ambulante se sortea una vez y se conserva. Se puede asistir con agua y comida y entregar munición; no se inventa muerte por demora. El nombre, causa de la separación y lesión exacta siguen abiertos. Encontrarlo no finaliza: hay que volver a Vicuña Mackenna y entregarlo a Adasme.

Guzmán paga 40 fichas de prueba al entregar exactamente dos rotores y un sensor a los técnicos de Plaza de Armas. Adasme paga 40 más 30 si hubo cero enfrentamientos, incluso cuando se evitó el contacto. No se añaden compras, descarte, desarme ni consumo de la carga protegida. Los recursos iniciales (3 raciones, 3 aguas, 12 municiones) son dotación del laboratorio; solo los dos rotores, el sensor, las tres bombas y el inhibidor están definidos por el usuario como entregados por los NPC.

## Integración futura

El adaptador de campaña deberá traducir inventario/recursos, ubicación, estado del grupo, combate, recompensas y amenazas regionales. `advance()` expone una instancia pendiente; una opción `combat` abre actualmente el combate de prueba. Antes de producción, sustituir esa resolución por un puente al combate existente que devuelva victoria, retirada o derrota una sola vez. Integrar la transacción de cargo/pago y migración de partidas, y decidir cómo volver al viaje tras combatir. No basta cambiar un flag.

Verificar compatibilidad de las combinaciones alternativas (Ñuñoa L3, Ñuble L5, etc.) antes de añadir rutas: no se declaran destruidas ni se abren por inferencia. No se añaden contactos a la campaña ni se cambian los `mission_ids: []` del catálogo original. `data.json` vincula los IDs de NPC solo dentro de esta estructura.

## Verificación

```sh
node --test tests/mensajeros.test.cjs
npm test
```

La revisión visual debe cubrir escritorio y móvil, foco de modales, cierre con Escape, inspección de objetos, recarga durante una instancia, entrega de ambos encargos y ausencia de peticiones de esta extensión desde el juego original. Ver el informe de verificación en `docs/metro-refugios/misiones/VERIFICACION-ESTRUCTURA.md`.
