# Hacia 0.2 — sexta entrega: cerrar una jornada con el equipo

19 de septiembre de 2026. Esta entrega aborda el calendario y la preparación de la expedición principal. El bloque anterior integró el desplazamiento entre encargos; aquí el problema está en la transición entre los tres días de Sara, Elías y Noa.

## Vacíos encontrados

Las horas de la expedición corresponden a escenas escritas. El día cambia después de resolver la última situación y sus conversaciones o desvíos. No existe un calendario de minutos como el de Encargos. Esa diferencia apenas se explicaba al preparar la salida.

La noche consumía una ración y una unidad de agua automáticamente. La tarjeta de resultados omitía el agua y la pérdida de moral por escasez, y mostraba una recuperación genérica aunque cada personaje recibiera una cantidad distinta. La recarga mantenía los recursos gastados, pero perdía la presentación del cierre de jornada.

Además, una retirada solicitada por el último encuentro tenía prioridad sobre el cambio de día: podía abrir el refugio y saltarse esa noche. No era una elección del jugador. El nuevo flujo resuelve primero la noche y conserva la preparación en el refugio que corresponda después.

## Elegir qué hacer con una reserva

Antes de consumir, el cierre muestra comida, agua y efectos previstos. El jugador puede compartir una ración o conservarla. Si no queda comida, puede descansar con lo disponible; no aparece una falsa opción de guardar lo que no existe. El agua se comparte si queda en ambas alternativas y su consumo se informa antes de confirmar.

| Decisión o disponibilidad | Consumo del grupo | Energía por persona | Moral del grupo |
| --- | --- | --- | --- |
| Compartir una ración | 1 comida y 1 agua si hay | +24, hasta 100 | Sin penalización si hay agua |
| Conservar la comida | 1 agua si hay; conserva la comida | −8, hasta 0 | −5 por pasar la noche sin comer |
| No queda comida | Solo 1 agua si hay | −8, hasta 0 | −5 |
| No queda agua | No crea ni descuenta agua inexistente | Según la comida | −8 adicionales |

No se modificaron las cantidades del descanso nocturno que ya existían. La novedad es poder preverlas, decidir sobre la comida y revisar un resultado exacto. Los personajes reciben hasta 8 HP; quienes estén a 0 vuelven hasta 12, sin exceder su máximo. Se limpian guardia y sangrado y se reponen las tres acciones de cada taller. La reducción de tensión mantiene las reglas previas.

Conservar la ración puede dejar comida para una necesidad posterior, pero reduce la energía disponible. Compartirla permite recuperarse mejor. El juego registra la decisión sin asignarle altruismo, crueldad ni una supuesta intención psicológica. La moral representa aquí el costo grupal de pasar hambre o sed.

Si después del descanso alguien queda por debajo de los mínimos de salida, o la moral es menor que 10, se abre el refugio. El descanso y la reagrupación existentes permiten volver a salir incluso sin fichas ni provisiones. Ese caso tiene una prueba específica.

## Una pausa con hechos y tareas

La conversación ocurre mientras revisan heridas, separan vendas, acomodan el receptor, revisan correas y ordenan las hojas. Sara pide precisión sobre las personas; Elías distingue datos y conclusiones; Noa atiende la preparación inmediata. Ninguno existe solo para explicar una cifra.

La primera noche reconoce el canal de Matías o el uso de su frecuencia como señuelo cuando esos hechos constan. Mantener un canal abierto no permite afirmar que está a salvo. La segunda distingue una atención a Lira de su muerte y no convierte el descanso en una reparación de lo ocurrido. Si alguien volvió agotado, la escena describe su atención en el refugio, sin hacerlo conversar como si estuviera bien.

El texto inicial queda guardado con la noche. El resultado de compartir o conservar se conserva también en el historial, con su consumo y recuperación. No se añaden puntos por leer o registrar estos descansos. No se inventan conversaciones nocturnas de partidas antiguas que ya cruzaron esas jornadas.

La escritura aplica el criterio de [Harris Powell-Smith sobre dar espacio a la ficción interactiva](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/): colocar las conversaciones dentro de tareas y conectar los momentos tranquilos con la trama. La expectativa es que la pausa ayude a procesar lo ocurrido y a anticipar la salida. Las pruebas técnicas no pueden demostrar por sí solas esa respuesta emocional.

## Calendario y presentación

Antes de salir se informa el día, cuántas situaciones principales quedan y qué reservas trae el grupo. Los desvíos se explican como adicionales a ese recorrido. La hora del encabezado se identifica como hora narrativa. La tercera jornada avisa que no hay otro consumo nocturno automático antes del desenlace.

Esto no elimina los relojes específicos que ya existen: el inhibidor mide cobertura y algunas decisiones tienen su propio límite. En la escena nocturna no corren esos relojes. Leer no cambia el día ni consume recursos.

La reagrupación del refugio ahora muestra en el botón cuándo utiliza una ración. El cierre nocturno reutiliza la ventana, tipografía, colores, botones y tarjetas del juego. La lectura tiene desplazamiento propio; las acciones quedan fuera de ese desplazamiento. El teclado conserva el foco dentro de la escena y las teclas de elecciones no ejecutan acciones del fondo.

## Persistencia y verificación

`expedition-rest.js` concentra previsión, escenas, liquidación, continuación y validación. `expeditionRest` conserva una entrada por noche con tres estados: preparación, resultado confirmado y cierre leído. Recargar vuelve a la fase correspondiente. Repetir una acción no gasta recursos, cura ni repone talleres otra vez. Entrar desde Actividades también recupera la noche pendiente.

Las partidas anteriores reciben un registro vacío: no se les repiten noches ya transcurridas ni se les cobra de nuevo. Los recibos incoherentes se rechazan sin sobrescribir el guardado. Nueva partida borra este progreso junto con el resto de la expedición.

282 pruebas automáticas aprobadas, con doce nuevas sobre planificación, ambas decisiones, cuatro combinaciones de disponibilidad, límites de recuperación, recarga, doble pulsación, retirada al cambiar de día, recuperación sin dinero, memoria narrativa, compatibilidad, teclado, Actividades y controles sobre el HTML real. Los dos recorridos narrativos completos existentes pasan por las nuevas noches y llegan a sus finales. Esos recorridos reponen salud y simulan victorias para aislar continuidad; no constituyen una validación global del equilibrio de combate.

## Lo que sigue pendiente

Esta entrega hace visibles y elegibles los costos de jornada. No sustituye una revisión de dificultad de toda la campaña. Falta observar con jugadores cuándo usan comida individualmente, qué suministros venden y si conservan reservas por comprender el costo o por temor a un castigo desconocido.

El siguiente bloque debería trabajar las conversaciones y necesidades de Sara, Elías y Noa entre encuentros, con respuestas posteriores que recuerden decisiones concretas del grupo. Las pausas nocturnas dejan preparado un lugar para esa continuidad; no equivalen todavía a arcos personales completos.
