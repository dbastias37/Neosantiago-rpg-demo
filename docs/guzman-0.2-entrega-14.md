# Entrega 14 — Guzmán y la recepción de Plaza

21 de septiembre de 2026. V0.2 continúa abierta. El usuario pidió retomar un bloque narrativo antes de seguir con lo visual.

## Alcance

«Piezas para seguir en pie» conserva su recorrido de trece tramos, dos rotores, un sensor, plazo, pago base de 20 Créditos y descanso abastecido en Plaza. El conflicto se sitúa en el trabajo con piezas recuperadas: Guzmán probó un casquillo con una carga menor que la torreta real y necesita que esa limitación llegue a quien monta el equipo.

La primera decisión, en Inés de Suárez, permite copiar la identificación y el límite de la prueba (3 minutos) o mantener la etiqueta junto a la pieza, a cargo de Bruno (2 de desgaste). En Universidad de Chile, una abrazadera suelta del sensor permite fijar el cable y registrar el ajuste (4 minutos) o sujetarlo para el último tramo y pedir la revisión en Plaza (1 minuto). Ninguna opción afirma haber probado la detección sin alimentar el sensor.

Las dos decisiones producen cuatro recepciones. La técnica identifica el rotor, comprueba el conector y realiza la prueba de recepción. El relevo permite al guardia ir a comer. Queda pendiente observar el casquillo durante el turno; no se inventa un resultado de larga duración. La recompensa y el beneficio existente no se duplican.

## Regreso a los talleres

Tras una entrega confirmada, el contacto muestra la copia que lleva el grupo. Guzmán aún no conoce su contenido. «Viajar a los talleres» utiliza el camino físico a Los Leones, con suministros, heridas y encuentros habituales. La llegada abre la conversación sobre la identificación y el cable según las decisiones tomadas. Guzmán distingue lo observado de lo pendiente; no recibe conocimiento a distancia antes de que regrese el equipo.

La conversación también queda disponible al llegar a Los Leones por otro recorrido válido. Consultar el contacto desde lejos permite leer el registro y planificar el viaje, no recibir pagos ni desplazar al equipo. Esta entrega no añade otro encargo ni una reparación posterior del casquillo.

## Compatibilidad y comprobación

`guzmanVersion: 1` se fija al aceptar nuevos encargos y se conserva en checkpoints y recibos. La definición anterior queda en `guzmanLegacyMission`: un contrato previo conserva sus escenas, briefing y condiciones; no inventa las decisiones ni desbloquea esta continuación. Un encargo abandonado o sin entrega confirmada tampoco genera esa memoria. Una nueva partida no conserva el seguimiento.

`npm test`: **371 pruebas aprobadas**. Incluyen las cuatro recepciones, viaje físico y persistencia, ausencia de pago doble, contratos previos, reintento y flujo DOM desde el contacto hasta el regreso. Se actualizó el entorno de pruebas de viajes para importar las vistas actuales de Expediente y comunidades, retirando expectativas obsoletas sobre filtros y formato de los rótulos. No se rediseñó ninguna pantalla. No sustituye una partida humana completa para evaluar ritmo o balance.

## Continuación

Próximo bloque narrativo: Jiménez y «Enlace de respaldo». Guzmán ya no debe tratarse como pendiente de esta primera profundización. Por petición del usuario, después de esta entrega se retoma el trabajo visual; queda propuesto inicio, actividades, ayuda y desenlaces. Los paneles de compuertas siguen aislados.
