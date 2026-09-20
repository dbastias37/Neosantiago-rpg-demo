# Entrega 13 — Beatriz, Créditos y retratos completos

20 de septiembre de 2026. Base revisada: `153daea8480da53f5100bc3e745274dab204eb30`. V0.2 sigue en desarrollo.

## Necesidad y alcance

El usuario observó jugando que las recompensas permitían comprar demasiado, debilitando la escasez. Solicitó reducir pagos, llamar Créditos a la moneda en todo el juego y mostrar completos los retratos de encargos junto al mapa. Se continúa además el bloque de Beatriz previsto por el informe de continuidad.

## Beatriz y Luz

El trayecto mantiene Libertadores → Plaza → Universidad de Chile → Plaza → Libertadores. Se conserva el episodio regional de los cajones. La recogida distingue ajustar el aro exterior con Tomás de sujetar el envase con Bruno; ninguno comprueba el contenido sellado. La vuelta introduce a Luz, aprendiz que necesita saber qué recibió el equipo antes de hacerse cargo del próximo turno.

El jugador puede repasar las comprobaciones con Luz en Plaza o pedir la revisión conjunta al llegar. Se pagan los minutos/desgaste indicados, sin otra carga, objeto gratuito o descuento. La recepción de Beatriz combina ambas decisiones y conserva sus límites. Se mantiene el descuento previo de raciones a 3 Créditos.

Una entrega confirmada deja memoria en Libertadores y en el contacto Beatriz. Desde ese contacto se puede viajar físicamente a los huertos después de haber salido, utilizando la red existente, con los recursos, desgaste y encuentros habituales. Llegar muestra la continuidad de Luz y Beatriz. No se vuelve a aceptar el encargo ni se cobra de nuevo. Desde otro refugio, el contacto muestra el registro de la última visita y ofrece desplazarse cuando no hay un viaje activo o fallido.

`beatrizVersion: 1` opta las nuevas aceptaciones al contenido. Las partidas de Beatriz iniciadas antes mantienen escenas y briefing anteriores; una entrega antigua no inventa a Luz ni activa esta continuación. El seguimiento se guarda en `beatrizFollowup`, y solo se marca una segunda visita después de salir y volver realmente. Nueva partida elimina este progreso junto al resto.

## Economía

Los siguientes son pagos base, antes de las deducciones por demora:

| Encargo | Anterior | Nuevo |
| --- | ---: | ---: |
| El turno que no alcanza | 18 | 8 |
| Una reserva, tres puestos | 28 | 12 |
| Hasta donde llega el carro | 32 | 14 |
| Cruzar con lo que queda | 30 | 10 |
| Lo que alimenta al norte | 36 | 14 |
| Piezas para seguir en pie | 40 | 20 |
| Enlace de respaldo | 42 | 20 |
| Fuera de contacto | 40 + 30 sin combate | 24 + 12 sin combate |

El máximo de la cadena completa pasa de 296 a 134 Créditos (−54,7 %). Las demoras nuevas descuentan 1 Crédito por bloque de 5 minutos, con el mismo máximo del 50 % del pago. El rifle sigue costando 30; los pagos iniciales ya no compran un arma importante y varios suministros a la vez. La recuperación del grupo sigue costando 8; comida, agua y munición mantienen sus precios. Se comprueba que comprar y revender lotes, incluso con los descuentos desbloqueados, no crea dinero.

Cada encargo nuevo guarda `rewardTerms` al aceptarlo. La restauración de uno anterior reconstruye sus condiciones históricas, incluido el primer corredor antiguo, y las conserva en checkpoints y comprobantes. No se reduce el saldo existente, no se recalculan pagos anteriores y no se cambia un contrato en curso. Los encargos todavía no aceptados usan el balance nuevo.

La moneda se presenta como Créditos en Expedición, Mensajeros, laboratorio, comerciantes, inspección, ayudas, pagos y registros. Se conserva `credits` como campo de guardado. Las fichas de personaje y el objeto narrativo de Varela siguen usando su nombre porque no son moneda. Los mensajes monetarios antiguos visibles se presentan con el nombre nuevo sin alterar sus importes.

Esta entrega reduce poder adquisitivo por encargos; no incorpora existencias finitas a la tienda de Mensajeros ni nuevos trabajos repetibles. La campaña mantiene su stock diario. El saqueo y la venta siguen siendo fuentes complementarias; el balance completo de supervivencia requiere partidas humanas. No se afirma haber demostrado retención ni que el farmeo quede equilibrado por estos valores.

## Presentación

El retrato de la operación junto al mapa y las miniaturas de contactos usan `object-fit: contain`, centrado y fondo oscuro. Se elimina el degradado/nombre superpuesto que ocultaba parte del retrato. El catálogo y la ficha completa conservan sus proporciones verticales. Se corrige la ayuda del inicio: tres tramos, entrega en Plaza. Se actualizan las versiones de carga de pantallas afectadas.

## Verificación

`node --test --test-reporter=tap tests/*.test.cjs`: 353 pruebas aprobadas. Incluye las cuatro recepciones, visita física y persistencia, ausencia de pago doble, decisiones abandonadas, contraste de economía y precios, contratos anteriores, reintento, demoras y flujo DOM desde contacto hasta visita. `git diff --check` y análisis sintáctico sin errores.

La comprobación DOM no sustituye una revisión de CSS en navegador. La revisión visual local quedó bloqueada: el navegador remoto no puede abrir localhost y no se pudo descargar Chromium en el entorno local. Cualquier comprobación posterior del sitio publicado se registrará con su evidencia. No hay una nueva partida humana completa ni revisión en teléfono real.

## Continuación

Profundizar Guzmán y Jiménez a partir de sus recepciones y efectos ya existentes. Observar jugando el balance nuevo antes de añadir límites de stock o cambios adicionales a la economía. Mantener el informe de continuidad como punto de entrada.
