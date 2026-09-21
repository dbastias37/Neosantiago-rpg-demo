# V0.2 — entrega 17: escasez y ritmo de Los Mensajeros

**Fecha:** 21 de septiembre de 2026  
**Alcance:** provisiones prestadas, lectura previa del contrato y compatibilidad de partidas.

## Problema comprobado

Los pagos ya habían bajado de 296 a 134 Créditos, pero siete de los ocho encargos seguían entregando gratis comida, agua, munición y, en cinco casos, un botiquín. Esos objetos no podían venderse y volvían a la red al cerrar el contrato, pero cubrían el consumo normal de casi todas las rutas. El resultado práctico era que comprar, conservar y repartir suministros rara vez importaba.

La suma de esos préstamos era de 131 unidades, con un valor de reposición de 337 Créditos a precios iniciales. Esa subvención superaba ampliamente los 134 Créditos máximos que puede producir toda la cadena.

## Cambio incorporado

| Tipo de encargo | Provisiones prestadas al aceptar |
| --- | --- |
| Relevo, Romero, Morales, Ana y Beatriz | Ninguna |
| Guzmán, Jiménez y Adasme | 1 ración, 1 reserva de agua y 6 municiones 5.56 |

Los dispositivos específicos de Adasme se mantienen: tres bombas de humo y un inhibidor. Son herramientas de esa extracción y no sustituyen la preparación general del equipo.

Los préstamos bajan de 131 a 24 unidades (−81,7 %) y su valor de reposición baja de 337 a 48 Créditos (−85,8 %). No se modifican recompensas, precios, penalizaciones, probabilidades de combate, desgaste ni plazos.

El expediente muestra antes de aceptar si el encargo presta provisiones y cuáles son. La pantalla de traslado y la ayuda explican que los trabajos cortos dependen de las mochilas propias y que todo préstamo sin usar vuelve a la red. Compras y saqueo permanecen en el inventario según las reglas existentes.

## Decisiones que ahora tienen coste

Romero ya no entrega un botiquín gratuito. Cambiar el vendaje de Julián requiere haber conservado o comprado uno. Registrar su ubicación y derivarlo a Romero sigue siendo una salida válida sin coste, de modo que la escasez crea una elección sin bloquear el encargo.

Las rutas largas conservan un equipo mínimo para permitir un descanso o cubrir una necesidad puntual. Los recorridos mantienen alternativas sin coste material y la cadena completa sigue siendo alcanzable sin exigir una secuencia única.

## Compatibilidad

- Un encargo que ya estaba activo conserva exactamente las provisiones y herramientas que recibió, también dentro de su punto de control y al reintentar.
- Los contratos aceptados después de la actualización usan la nueva tabla.
- Abandonar o terminar retira la parte prestada que no se consumió, como antes.
- Créditos, compras, saqueo, carga protegida, recibos y contratos completados no cambian.

## Verificación

La suite completa aprueba **383 pruebas**. La cobertura añadida comprueba la tabla de los ocho encargos, el coste real de la ayuda médica, la devolución del préstamo, la información previa del expediente y la restauración de contratos anteriores. Las pruebas de recorrido completan todos los encargos en varias semillas con las nuevas cantidades.

## Límite de esta entrega

La tienda mantiene stock ilimitado. Este bloque corrige la fuente gratuita que anulaba la preparación; no afirma que la curva final esté validada por jugadores. La revisión de cierre debe observar cuánto se compra, qué queda al terminar cada ruta, cuántas veces se descansa y si una mala salida permite recuperarse sin reiniciar.

Queda un bloque para cerrar V0.2: revisión final del conjunto, corrección de incoherencias y decisión explícita de versión. Después se retoma el trabajo visual.
