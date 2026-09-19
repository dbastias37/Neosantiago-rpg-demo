# Hacia 0.2 — quinta entrega: llegar antes de aceptar

19 de septiembre de 2026. Continúa el trabajo de descubrimiento gradual y el regreso de Darío. Corrige una contradicción espacial: el mapa guardaba dónde estaba el equipo, pero aceptar un trabajo lo colocaba directamente en su origen mediante un relevo resumido. Ahora la ubicación tiene consecuencias también entre encargos.

## El contacto y la carga tienen un lugar

Una presentación abre la propuesta de un contacto. Si el equipo está lejos, la oferta permite revisar el traslado: origen real, destino, estaciones, minutos de desplazamiento base y suministros disponibles. El jugador puede revisar al equipo y, si está en Los Héroes, comprar antes de salir.

El traslado se juega sobre los mismos corredores, con encuentros, heridas, recursos, combate y saqueo. Los encuentros compartidos describen mochilas y acciones del equipo, sin dar por recibida una carga que aún no tienen. Llegar deja al equipo en destino y ofrece revisar el encargo. La aceptación sigue siendo una acción distinta: entonces se entregan los suministros previstos y empieza su plazo. La carga que deba recogerse durante la misión continúa esperando en su punto original.

El tiempo del traslado no descuenta el pago del siguiente encargo. No concede un pago por llegada ni abre otros contactos. Las heridas y los suministros propios sí persisten. Se mantiene la recuperación mínima de preparación que ya existía al aceptar una misión; no se presenta el traslado como una curación. Los encuentros conservan sus recompensas ordinarias de combate, si corresponde.

Se reutilizan el mapa, el movimiento, los diálogos, las fichas de equipo y el diario. No hay una segunda interfaz de viajes. Los contactos cerrados siguen sin aparecer en el catálogo ni en el mapa de una partida nueva. El motor también rechaza aceptar desde otro lugar: no depende solo de ocultar un botón.

## Evitar un rodeo que no cuenta nada

El enlace de Jiménez acaba en Los Leones. Exigir ir desde allí hasta Vicuña para iniciar la extracción y volver inmediatamente hacia Tobalaba añadiría desplazamiento antes de atender a Darío. La extracción admite ahora un relevo de preparación en Tobalaba, establecido en la propuesta de Adasme tras el enlace.

| Preparación | Recorrido del encargo | Plazo desde la aceptación |
| --- | --- | --- |
| Vicuña Mackenna | 28 tramos originales, extracción y regreso a Vicuña | 140 minutos |
| Tobalaba | 16 tramos, entrada a la extracción y regreso completo a Vicuña | 116 minutos |

El sistema propone el punto de preparación más cercano por tiempo de desplazamiento. Desde Los Leones, llegar a Tobalaba requiere un tramo. El plazo alternativo resta los 24 minutos base del tramo inicial omitido; conserva el margen previsto para resolver encuentros y ayudar a Darío. No cambia el destino del rescate ni permite saltarse su regreso. Tobalaba no se convierte en un refugio con descanso gratuito.

Esto es una decisión de la adaptación jugable. No se atribuye a la novela un nuevo episodio ni se cambia el trazado de una misión ya aceptada.

## Guardado y recuperación

Los nuevos viajes tienen identificadores deterministas por encargo y origen. Usan el mismo sistema de encuentros persistentes que el regreso al mercado. Recargar no repite el desplazamiento, genera otra tirada ni acepta una misión pendiente.

La incorporación a una misión guarda su índice inicial y su plazo. El mapa, el catálogo, el itinerario, el contador de tramos y el recibo utilizan ese mismo inicio. Las estaciones omitidas no se registran como visitadas. Los recibos antiguos mantienen sus plazos guardados.

Las partidas anteriores conservan sus posiciones, encuentros y puntos de control. No se les exige volver a preparar una misión ya iniciada. Si se abandona un viaje, el siguiente sale desde el lugar donde quedó el equipo. Un reintento sincroniza también la ubicación con el punto de control; antes podía quedar el nombre de la estación posterior aunque el recorrido hubiera retrocedido. Incluso un grupo sin fichas y con todos sus miembros caídos puede recurrir al reintento del traslado.

## Comprobación y límites

270 pruebas automáticas aprobadas. Las diez nuevas cubren acceso remoto, vista previa sin efectos, llegada sin aceptación automática, combate y saqueo en el último tramo, heridas y suministros, reloj separado, incorporación en Tobalaba, regreso de Darío, reintentos, partidas anteriores y el flujo de los controles de la interfaz.

La cadena completa se recorre desde una partida nueva con cuatro semillas: primera entrega, Romero, Ana, Beatriz, Guzmán, Jiménez, extracción y Morales, incluyendo sus traslados físicos. En esos recorridos no se inyectan dinero, salud, contactos ni suministros. El simulador elige acciones disponibles, suele evitar combates y descansa cuando puede. Son pruebas de continuidad y viabilidad de esos caminos, no una medición de dificultad para todas las estrategias. Las pruebas unitarias de combate, economía y red colocan explícitamente sus equipos en el origen para aislar el sistema que examinan; no sustituyen el recorrido continuo.

La revisión en el navegador publicado recorrió la primera entrega, la apertura de Romero, la vista previa del traslado, el encuentro al llegar a República y la aceptación separada. El viaje consumió seis minutos; el encargo comenzó en 0/22, sin el estuche todavía. También se recargó un encuentro de una partida iniciada antes del despliegue y se conservó su posición. La revisión visual confirmó el diálogo de preparación en escritorio y detectó la explicación incorrecta de la recogida de Romero y las cantidades en singular, corregidas en esta entrega. No se ha realizado una partida visual completa ni una revisión móvil de todos los diálogos.

La intención es que abrir un contacto signifique ampliar un mundo que el jugador habita. No basta con añadir metros al mapa: todavía falta observar con jugadores dónde el trayecto repite decisiones y cuándo convendría una conversación breve, una consecuencia reconocible o menos encuentros. Esa evaluación no puede inferirse de las pruebas de código.

El siguiente bloque hacia 0.2 debe revisar el calendario y los recursos de la expedición y su relación con el ritmo narrativo. También queda pendiente medir duración y desgaste de los viajes largos de Encargos antes de considerarlos equilibrados para cualquier jugador.
