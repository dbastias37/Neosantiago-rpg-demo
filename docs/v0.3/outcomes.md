# V0.3: derrota, misión fallida y colapso de la red

## Alcance implementado

`outcomes-v3.js` es un contrato de estado compartido, sin dependencias del DOM ni del combate. Campaña lo carga como script clásico; Encargos lo importa desde `extensions/mensajeros/outcomes.mjs`. El registro contiene hechos identificables e idempotentes. No entrega XP, recursos, heridas ni recompensas: los runtimes existentes siguen aplicando sus reglas.

| Nivel | Hecho | Integración actual | Continuidad |
| --- | --- | --- | --- |
| Derrota de combate/viaje | `expedition-failed` | `loseCombat` de Expedición y agotamiento existente de Encargos | Recuperación y costes V0.2 conservados |
| Misión fallida | `mission-failed` | API explícita preparada para contenido futuro | Cierre permanente de ese `missionId`; otras misiones siguen disponibles |
| Game Over real | `network-collapsed` | API de operación y pantalla de recuperación listas; **ninguna misión vigente lo activa** | Checkpoint, estado previo o menú; nunca borra la partida |

La retirada de Expedición también deja un hecho recuperable, con motivo `retreat`. La derrota total añade «EXPEDICIÓN FALLIDA» al mensaje del refugio. En Encargos, el valor histórico `run.status === 'failed'` sigue significando viaje interrumpido y reintentable. No se lo convierte en misión perdida ni se penaliza dos veces. Su registro muestra que el encargo sigue pendiente.

El final existente de la torre conserva sus cinco cierres. Una derrota en el asedio mantiene el avance con consecuencias. No se reemplaza por «LA RED CAYÓ» ni por otra elección final. Los cuatro destinos propuestos para la campaña futura siguen pendientes de diseño de contenido.

## Compatibilidad y memoria

Se mantienen claves de localStorage y versiones de campaña/Encargos. `outcomes` es un campo aditivo y perezoso: una partida V0.2 que no experimentó un desenlace nuevo conserva su ausencia. Los cargadores validan la extensión únicamente cuando existe. No se inventan derrotas históricas ni se reinterpretan antiguos estados `failed`.

El campo contiene `version: 1`, `events`, `sequence`, `failedMissions`, `activeGameOver` y `recovery`. Las misiones cerradas se reconstruyen a partir de eventos, sin una segunda verdad mutable. Se rechazan versiones desconocidas y registros corruptos. La carga de campaña es atómica: un rechazo conserva la partida en memoria y el JSON original.

Cada combate de campaña usa índice de escena y contador de batallas siguiente. Encargos conserva el intento entre reintentos; dos notificaciones del mismo agotamiento no crean dos hechos y un nuevo intento sí puede registrar su propia derrota. Los callbacks existentes siguen protegiendo sus costes y recompensas. Este registro no pretende sustituir todos los flags narrativos aprobados.

## Uso para contenido futuro

Las llamadas de campaña se hacen en un límite estable de guardado, fuera de combate, decisiones, diálogos, minijuegos y encuentros bloqueados:

```js
NeoCampaignOutcomes.prepare('operacion-final'); // conserva el estado previo
// Resolver preparación y cerrar la escena por el flujo normal.
NeoCampaignOutcomes.checkpoint('operacion-final');

// Solo ante una condición irreversible definida por el contenido:
NeoCampaignOutcomes.collapse({
  id: 'operacion-final:ultimo-relevo',
  operationId: 'operacion-final',
  irreversible: true,
  reason: 'network-collapse',
  summary: 'La red perdió el último relevo que sostenía a los refugios.'
});
```

`prepare` y `checkpoint` requieren el mismo identificador de operación. Capturar una nueva operación elimina las referencias anteriores; un colapso de otra operación se rechaza. Los snapshots son copias completas de campaña, sin árboles recursivos de snapshots. Recuperar reemplaza recursos, inventarios, recibos, XP y flags conjuntamente, sin mezclar ganancias posteriores. Se conservan ambos puntos para un segundo intento. Un callback doble no vuelve a restaurar mientras la vista se reinicia.

La recuperación valida el snapshot con el mismo cargador de campaña antes de reemplazar el guardado. Las escrituras preservan el JSON previo en `KEY + '.outcomes-backup'`; si el almacenamiento falla, la operación no sustituye el estado activo. Volver al menú conserva el Game Over pendiente. «Continuar» vuelve a su pantalla y pausa el inhibidor. El diálogo nativo contiene el foco, intercepta atajos de la campaña y no confirma recuperación con Escape o Atrás.

Estos snapshots cubren **solo Expedición**. Encargos conserva su guardado y su propio checkpoint. Una futura operación que modifique ambas actividades necesitará una transacción de ambos estados antes de usar este API; todavía no existe ese contenido.

Una misión irreversible necesita un identificador y una declaración explícita:

```js
NeoCampaignOutcomes.failMission({
  id: 'rescate:objeto-perdido',
  missionId: 'rescate',
  reason: 'critical-object-lost',
  irreversible: true
});
// El contenido debe consultar este contrato antes de volver a ofrecerla:
NeoOutcomes.missionAvailable(state.outcomes, 'rescate'); // false
```

El contenido debe aplicar su consecuencia concreta y cerrar el objetivo en su transición normal; la API únicamente registra el cierre y muestra «MISIÓN FALLIDA». No se agregan flags especulativos de cohesión/influencia todavía. Ningún encargo V0.2 es reclasificado por esta API.

## Verificación y límites

`tests/outcomes-v3.test.cjs` cubre contratos de los tres niveles, callbacks duplicados, cierres permanentes, restauración completa sin duplicación de recursos, repetición de intentos, operaciones incompatibles, corrupción, derrota real en campaña, continuidad del asedio, recuperación y menú persistidos, y agotamiento/reintento real de Encargos. Las pruebas del módulo no acreditan por sí solas una experiencia final de 30–60 minutos.

La pantalla de colapso es infraestructura de contenido futuro. La calidad narrativa y el balance de una operación irreversible tendrán que validarse cuando exista una misión que la declare; actualmente no se altera ninguna probabilidad, daño, recompensa ni final aprobado.
