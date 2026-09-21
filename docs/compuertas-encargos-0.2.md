# Compuertas numéricas en Encargos — actualización V0.2

Fecha: 21 de septiembre de 2026.

## Alcance

Los desvíos que buscan otro paso para evitar una instancia ya no se resuelven únicamente con desgaste. Encargos reutiliza la interfaz aprobada y los diez acertijos numéricos de `labs/compuertas/`: cinco claves de relevo de cuatro cifras y cinco archivos de turno de seis cifras. El panel de continuidad conserva sus cinco casos en el laboratorio y no se activa en los viajes.

Se consideran compuertas los desvíos regionales con otro acceso, el paso silencioso de Rocío, el desvío acústico de Tomás y las opciones hostiles que expresamente toman un desvío. Esperar una abertura, usar un señuelo, interferir sensores, retirarse y combatir no abren el panel.

## Flujo y consecuencias

1. El jugador elige el desvío en la instancia.
2. La partida asigna de forma estable un caso numérico a esa compuerta.
3. El panel aparece con relato, tres documentos, tres pistas y cuatro intentos.
4. Un fallo permite revisar y volver a probar. El cuarto fallo bloquea la puerta.
5. Una clave correcta muestra la apertura y «Cruzar la compuerta» resuelve la opción original.
6. Si queda bloqueada, el jugador vuelve a la instancia y elige combate, distracción, espera o retroceso según lo disponible.

Abrir o leer el panel no consume minutos. El coste original de la opción —tiempo, desgaste, recursos o uso limitado— se cobra una sola vez al cruzar. Antes de la apertura no se consume. Esto evita gastar una habilidad si el panel termina bloqueado y mantiene la escasez del recorrido.

## Guardado y compatibilidad

El estado vive en `run.pending.gate`: versión, identidad del encuentro, acertijo, opción elegida y sesión. Se conservan cifras, pistas, intentos, fallo, bloqueo y solución al serializar o recargar. El caso depende de la semilla, el encargo, el tramo y la instancia; recargar no permite cambiarlo. Elegir una salida distinta elimina el panel pendiente y continúa con la regla de esa salida.

No cambia `save_key`, `content_version` ni el esquema visible de V0.2. Las partidas anteriores sin compuerta siguen restaurándose. El laboratorio mantiene su clave local y sus reinicios; un panel bloqueado dentro de Encargos no ofrece reinicio.

## Interfaz

`extensions/mensajeros/gate.html`, `gate.mjs` y `gate.css` montan el panel como una pantalla de dispositivo a página completa dentro de Encargos. Reutilizan los estilos, el teclado, los documentos, los indicadores de intento y las pantallas de fallo y apertura del laboratorio. En móvil se alterna entre panel y evidencias. Volver al encuentro conserva la sesión.

## Verificación

La suite completa aprueba **390 pruebas**. Las nuevas pruebas cubren asignación numérica en desvíos hostiles y ordinarios, coste diferido, resolución única, persistencia de cifras y pistas, cuatro fallos, bloqueo, alternativa de combate, rechazo del reinicio de laboratorio y apertura de la capa visual desde la instancia. También se recorren los ocho encargos, traslados, visitas y retornos con las compuertas activas.

Sigue pendiente una prueba humana de frecuencia, dificultad y duración de lectura. Esa evaluación debe decidir si algunos tramos necesitan evitar una compuerta repetida y si el gabinete de continuidad merece ubicaciones propias.
