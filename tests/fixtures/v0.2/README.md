# Guardados de regresión V0.2

Estos fixtures se generaron ejecutando el runtime de `main` en `009092d`, antes de extraer sus módulos para V0.3. No contienen datos personales.

`campaign-new.json` conserva el estado inicial de la campaña. `campaign-retreat.json` conserva un encuentro cerrado: elección de batería, compromiso del grupo, combate en la compuerta y retirada a Los Héroes. Incluye inventario, semilla, consecuencias, estadísticas y estado del refugio.

Los tests deben restaurarlos con la clave `neosantiago2130_demo_v3` y versión interna `3`, independientemente del número comercial de versión. No regenerar estos archivos con el nuevo runtime para hacer pasar una regresión. Si una migración futura añade estado, comprobar explícitamente qué cambia y mantener intacto el contenido original de V0.2.
