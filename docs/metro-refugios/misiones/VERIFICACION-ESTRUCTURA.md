# Verificación de la estructura de misiones

Fecha: 17 de septiembre de 2026. Base de campaña revisada: `672845c25ba212d04e39cc34bbd0c22f9ac0db4d`.

## Resultados

`node --test tests/mensajeros.test.cjs`: **18/18 pruebas aprobadas**. `npm test`: **165/165 pruebas aprobadas**, incluidas las pruebas existentes de combate, narrativa, inventario y NPC. Comprobación de sintaxis de los módulos y `git diff --check` sin errores.

Se verificaron referencias de NPC, objetos e imágenes; flags de producción desactivados; secuencia de L6; puntos de control; cargo exacto; pago único; guardado de tiradas; evasión y retirada; conservación de amenaza; batería narrativa; rescate ambulante y herido; descanso de un solo uso; derrota y reintento.

## Navegador

Prueba local con Chromium mediante Playwright, sin publicar el laboratorio. Pantallas revisadas a 1440 px de ancho y 390 px de ancho: mapa, encargo, inspección de rotor, instancia y resultado de extracción. La inspección del objeto muestra imagen, descripción y restricciones, con botón Volver. El mapa mantiene el trazado archivado y añade marcadores y nombres de las estaciones de L6. Los modales usan diálogo nativo, foco explícito, cierre con Escape y animación respetando movimiento reducido.

Recorrido completo de Guzmán mediante los botones: aceptación, instancias, evasión, descanso y entrega de los tres componentes a los técnicos; 40 fichas de prueba. Recorrido completo de Adasme en móvil: encuentro, combate de prueba, rescate del herido, transporte y entrega; recompensa reducida de 40 fichas y diálogo correspondiente. No hubo errores JavaScript ni respuestas HTTP de error en esos recorridos. No se detectó desbordamiento horizontal en móvil. Recargar durante una instancia conservó exactamente el guardado y permitió reabrirla.

Se abrió también `neosantiago-demo.html` y se registraron sus peticiones: **cero solicitudes a `extensions/mensajeros/`**. Los archivos ejecutables originales y el catálogo original de NPC no se modificaron.

## Límites

Esto valida la estructura aislada y sus flujos de prueba. No constituye una partida completa de producción con esta expansión, una auditoría de equilibrio ni una integración del combate real. La interfaz de prueba usa un combate agregado independiente; el puente al sistema de campaña, la economía definitiva, las estaciones intermedias de L4 y varias decisiones narrativas siguen pendientes. No se realizó despliegue del laboratorio.
