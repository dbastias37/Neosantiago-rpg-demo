# Apertura cinematográfica

El botón Iniciar reproduce una presentación de 20,4 segundos, una vez por visita a la página. Usa el PNG original de Producciones Vérité, sin modificarlo; el encuadre SVG elimina solamente el espacio vacío alrededor del logo.

| Tiempo | Pantalla |
| --- | --- |
| 0–0,5 s | Negro |
| 0,5–4,9 s | Logo: fundido de entrada de 1,6 s y acercamiento de 3,5 % en 8 s |
| 4,9–6,5 s | Fundido de salida del logo |
| 6,5–7,5 s | Negro durante un segundo |
| 7,5–10,1 s | «Un juego basado en la obra digital de Diego Bastías»: entrada de 1,6 s y pausa de un segundo |
| 10,1–11,7 s | Fundido de salida del crédito |
| 11,7–17,3 s | NEOSANTIAGO 2130: entrada de 1,6 s, cuatro segundos plenamente visible y acercamiento suave |
| 17,3–18,9 s | Fundido de salida del título |
| 18,9–20,4 s | Entrada gradual al prólogo o al selector de guardado |

La música ambiental se desbloquea en el clic o Enter inicial y conserva su instancia y posición a través de toda la secuencia. Una primera visita entra directamente al prólogo. Si existe un guardado, se conserva la elección Nueva partida / Continuar; la presentación nunca elimina progreso. La escritura del prólogo espera hasta que termine el fundido.

Omitir intro o Escape cancela los temporizadores y revela el destino. Atrás en móvil hace lo mismo. Durante la presentación, las interfaces de fondo son inertes. La preferencia de movimiento reducido elimina los acercamientos conservando los fundidos. No hay cambios en narrativa, economía ni esquema de guardado.

Archivos: `cinematic-intro.js`, `cinematic-intro.css`, `assets/branding/producciones-verite.png`; integración en `neosantiago-demo.html`, `game-v2.js` y `mobile-back.js`. Pruebas de inicio: orden, música continua, doble activación, omisión y conservación de guardado.
