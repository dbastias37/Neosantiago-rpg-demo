# Mejoras de campo

Primera versión: doce mejoras, hasta cuatro elecciones por partida. Cada elección presenta tres cartas sin repetir mejoras ya adquiridas. El jugador asigna la carta a un portador compatible. La selección permanece hasta Nueva partida, también al volver al refugio, cambiar de día o continuar una partida guardada.

## Obtención y guardado

La partida comienza sin mejoras ni un acceso vacío a ellas. La primera victoria de combate concede la primera elección. Después se necesita ganar dos combates más por elección: victorias 1, 3, 5 y 7. Avanzar situaciones, retirarse o perder no concede mejoras. El contador también reconoce una victoria por sostener un objetivo en la torre.

La recompensa espera un punto seguro tras resolver combate, loot y ventanas narrativas. Antes de las cartas aparece «Has ganado una mejora», con el origen del material recuperado. La primera vez se explican consulta, asignación, elección y uso. Después de elegir aparece una confirmación específica del portador y de cómo usar la mejora. Las siguientes entregas mantienen el aviso de recompensa y omiten el tutorial largo.

La pantalla de resultado muestra el progreso hacia la próxima mejora. También puede consultarse en «Mejoras»: 0/2 o 1/2 victorias. El máximo sigue siendo cuatro mejoras. La migración conserva las cartas equipadas y cuenta únicamente victorias futuras para las siguientes: no convierte progreso narrativo ni victorias antiguas en premios retroactivos. Una oferta antigua no ganada se descarta.

`state.fieldUpgrades` contiene portadores, oferta pendiente, estadísticas, victorias reconocidas, tutorial visto y un generador aleatorio propio. La oferta se guarda antes de mostrarla; recargar no cambia las cartas. Este generador no consume el azar de la historia. Las partidas anteriores se normalizan sin perder progreso. Los usos por combate están en `battleState.field` y se reinician con cada encuentro.

## Catálogo

| ID | Nombre | Portador | Efecto |
|---|---|---|---|
| triple | Gatillo triple | Arma de fuego | Hasta tres disparos al 55%, mismo objetivo; un uso por combate. Requiere tres balas, consume solo las disparadas y se detiene si el enemigo cae. |
| sweep | Barrido táctico | Arma de fuego | Un disparo al 65% contra hasta tres enemigos vivos, empezando por el seleccionado; un uso. Requiere dos enemigos como mínimo y una bala por objetivo. |
| sight | Mira calibrada | Cualquiera | Críticos con 19–20 en ataques con tirada; aún deben superar la defensa. |
| breach | Punto descubierto | Cualquiera | Un crítico marca al enemigo; el siguiente impacto de otro aliado recibe +25% y consume la marca. |
| opener | Primer disparo | Cualquiera | +2 precisión y +25% daño al primer ataque normal o primer disparo de ráfaga. Se consume incluso al fallar. |
| knife | Último recurso | Cualquiera | +35% al ataque normal que cambia automáticamente al cuchillo por falta de munición. |
| cover | Fuego de cobertura | Cualquiera | Un impacto reduce 25% el daño bruto del próximo ataque enemigo. No acumula y se consume con un fallo, pero no con un turno aturdido. |
| arc | Arco de inducción | Elías | Su habilidad EMP alcanza a otra máquina con 40% del daño base, sin aturdir ni generar más efectos. |
| capacitor | Condensador de reserva | Elías | Una carga de EMP por combate sin consumir batería; funciona con la mochila vacía. |
| plate | Placa reactiva | Cualquiera | Reduce 50% el primer daño directo después de equipo y cobertura. No se consume con daño cero o sangrado. |
| pulse | Pulso estable | Sara | Su primera habilidad médica protege al paciente: reduce 30% el siguiente daño directo. |
| shared | Dosis compartida | Sara | Su habilidad cura hasta 6 HP a otro aliado vivo herido; no reanima ni activa otras mejoras. |

Los porcentajes ofensivos se aplican antes de la armadura. Los impactos de ráfaga tienen tiradas independientes y conservan las reglas de entrenamiento, fatiga, críticos y experiencia. Las curaciones respetan la vida máxima. La descarga secundaria no activa cadenas de efectos. Los valores iniciales requieren ajuste posterior con partidas reales.

## Interfaz

SVG con una geometría común, fondos verdes oscuros y acentos por clase. Las ilustraciones son independientes del texto. El detalle se abre al pasar el cursor sobre el símbolo o al tocarlo; la × y Escape vuelven al frente. Cerrar el detalle no selecciona la carta. `Elegir` es una acción independiente del detalle y del selector de portador.

El menú de navegación incluye `Mejoras`. En combate, los iconos bajo el aliado permiten consultar su equipo cuando no se están resolviendo acciones. Las mejoras activas aparecen en `Habilidad`, junto a la habilidad original, con sus usos y requisitos. Enter funciona sobre los botones de ese menú sin ser interceptado por el avance de narración. El botón Atrás cierra los detalles o el menú sin gastar acciones.

Las ofertas bloquean los atajos de la expedición y pausan el inhibidor. Una resincronización solicitada durante la oferta se difiere hasta terminarla. El diálogo limita el foco del teclado a sus controles y admite movimiento reducido.

El resumen final y su PNG incluyen las mejoras elegidas y sus portadores. Se registran activaciones, daño causado por habilidades de mejora o añadido a ataques, daño evitado efectivo, curación compartida y baterías ahorradas. El daño de las ráfagas se atribuye a su mejora completa; no representa una simulación alternativa de un ataque normal.

## Validación

`npm test`: 144 pruebas, incluidas 20 específicas de esta función. Se verifican ofertas y recarga, migración, cuatro elecciones sin duplicados, munición, muertes durante ráfagas, críticos y defensa, combos sin recursión, batería vacía, protección, curación, interfaz, habilidad original y reinicio.

Prueba adicional en Chromium: escritorio 1440×1000, móvil vertical 390×844 y horizontal 844×390, sin desbordamiento horizontal. Recorrido real con ratón, teclado y tacto: abrir/cerrar detalle, persistir oferta al recargar, elegir portador y gastar la munición correcta al activar Gatillo triple. Sin errores de JavaScript en esos recorridos.
