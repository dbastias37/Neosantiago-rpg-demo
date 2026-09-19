# Entrega 11 — Vera: qué se paga y quién queda expuesto

## El problema de la negociación anterior

«El precio de la ruta» permitía vender una coordenada real sin identificar la comunidad ni comprobar qué sabía el grupo. Después del intercambio, el diálogo ofrecía reparar una bomba, invocar otra deuda, conseguir otra ruta o recibir comida casi sin relación con la oferta inicial. Vera hablaba de mapas verdaderos y falsos aunque hubiera aceptado un engaño. Las frases sobre hambre e inocencia sustituían a una necesidad concreta.

Esta entrega reordena la negociación para que cada intercambio tenga objeto, costo, información disponible y recuerdo. También conserva la diferencia entre reservar una extracción y llegar a utilizarla. El resultado se conecta con la segunda noche y con el regreso del desenlace.

## Una persona que necesita algo

Vera trabaja junto a una bomba desmontada. Su gente pierde turnos cargando agua y necesita pasos por donde mover provisiones. Por eso puede aceptar trabajo además de información. Esa necesidad explica su oferta; no convierte en inofensivo entregar una ubicación ajena.

Sara pregunta quién vive donde Vera quiere entrar. Noa ve la utilidad inmediata de la radio y después se preocupa por quién recorrerá un trazado inventado. Elías puede conservar la fecha de un listado, pero Sara le recuerda que esa advertencia no llega a quienes todavía vivan allí. Son diferencias de criterio ligadas a una decisión material.

Al descansar también hay una pausa pequeña: si el trato reconoció una ayuda anterior, Sara pide apagar la radio un momento para sentarse sin otra voz encima. No añade una misión ni un premio. Da espacio a una necesidad cotidiana después del regateo.

## Cómo se elige ahora

La escena mantiene cuatro entradas: intentar engañar, negociar sin ubicaciones, revisar qué información podrían entregar y reservar la extracción. Las dos conversaciones de condiciones tienen tres opciones como máximo. Usan el retrato y la ventana de Vera ya existentes.

Abrir las condiciones no entrega datos ni recompensas. Se conserva el gasto de energía del avance de escena; el intercambio ocurre al escoger una respuesta concreta. No hay otra ronda de favores después de haber pagado.

| Intercambio | Condición y costo | Consecuencia |
| --- | --- | --- |
| Ayuda a los cazadores | Haber ayudado en el andén o rescatado al cazador | Radio y cobertura; moral +4, amenaza −4. No entrega ubicaciones. |
| Reparar la bomba | Elías en condiciones y 1 chatarra | Consume la pieza, repara la bomba y recibe radio; moral +2, amenaza −2. |
| Acceso de Línea 1 | Información de su propio hogar, explícita antes de aceptar | Vera aprende ese acceso; radio, moral −10 y amenaza −2. |
| Copia del listado antiguo | Haber recuperado el expediente `names` | Conserva el original, pero Vera recibe otra copia con la fecha de hace 18 meses; radio, moral −6 y amenaza −1. No afirma quién sigue allí. |
| Trato rechazado | Siempre disponible dentro de las condiciones | No recibe una radio nueva ni cobertura; conserva materiales y datos, amenaza +2. Continúa la expedición. |
| Coordenadas falsas | Prueba existente de engaño | El éxito conserva radio, moral +3 y amenaza −2; el fallo deja a Vera hostil, sin su módulo, con moral −3 y amenaza +10. No entrega una ubicación verdadera. |
| Extracción futura | Vera no hostil | Reserva escolta y radio a cambio de las pruebas que consigan sacar de la torre; sustituye el relé civil preparado. No paga todavía con datos. |

Conocer relatos sobre comunidades o el origen de la señal no equivale a tener el listado. Una descarga fallida del Nodo 14 no lo proporciona. Si se había obtenido por otro camino, se conserva: la nueva condición comprueba el archivo disponible, no deduce conocimiento desde una frase del personaje.

El contrato de extracción aclara que las direcciones privadas no forman parte del pago. Es coherente con la separación de pruebas y coordenadas que ya realiza el diálogo de Irene. Alinear posteriormente el relé civil cancela esa extracción y deja constancia del cambio. No se presenta como ayuda de Vera una salida que terminó por otra vía.

## Consecuencias que se pueden sostener

Tras revelar Línea 1, Sara pregunta quién se lo dirá a Mara. En el regreso, Mara pide identificar exactamente la entrada revelada. El juego no inventa un ataque: registra que el acceso dejó de ser secreto para Vera. Eso tampoco implica que UNO haya recibido la ubicación; el conocimiento de una persona no se convierte automáticamente en conocimiento de toda la red.

Tras copiar el listado, se conserva la antigüedad y la incertidumbre de sus ubicaciones. Mara pregunta quién podría seguir ahí. El relato no transforma un registro antiguo en un censo actual ni supone que todos se fueron.

Si el engaño funciona, Vera cree la ruta falsa y anuncia que enviará a alguien a revisarla. No descubre la mentira sin una causa. El grupo recuerda esa posibilidad, pero el final no inventa víctimas. Si detecta el engaño, retira la ayuda y no concede otro premio durante la despedida.

Una promesa posterior no borra una entrega anterior. Las banderas heredadas de ruta limpia o verdad fuera del mercado no eliminan el hecho guardado de haber revelado una ubicación.

## Inventario, estado y compatibilidad

Antes de un intercambio que entrega radio, debe haber espacio. La reparación puede utilizar el espacio que libera su propia pieza. Si ya llevan una radio, Vera comprueba esa unidad y el acuerdo aporta cobertura o reserva de canal; no se añade otra ni se narra una segunda entrega. Siempre queda una salida sin intercambio incluso con las mochilas llenas.

`vera-negotiation.js` transforma la escena después de las variantes y del contrato añadido por el sistema de desenlaces. El registro `companionCommitments.trade` distingue ocho resultados, la fuente de la información, la posibilidad de conversar entre los tres, la radio anterior y la cancelación de una extracción reservada. El conocimiento de Vera distingue el acceso de Línea 1 del listado histórico.

Acción, pago y diálogo siguen el guardado atómico del encuentro. Recargar antes de terminar restaura el punto previo sin conservar radio ni consumo parcial. Repetir un clic no ejecuta otra operación. Un registro resuelto restaurado en el mercado solo permite continuar. La segunda noche guarda su contexto: cancelar el contrato al día siguiente no reescribe retroactivamente lo que conversaron esa noche.

Los guardados antiguos no reciben una negociación inventada. Conservan sus hechos y finales ya guardados. Los registros inválidos se rechazan sin reemplazar el archivo almacenado. Nueva partida limpia el registro. La prosa de los intercambios nuevos utiliza efectos definidos por su acción; las variantes existentes conservan sus referencias mecánicas.

## Fundamento y revisión

Se consultó [Dan Fabulich, 5 Rules for Writing Interesting Choices in Multiple-Choice Games](https://www.choiceofgames.com/2010/03/5-rules-for-writing-interesting-choices-in-multiple-choice-games/). Se aplican dos criterios: dar al jugador información suficiente para escoger y conectar sus elecciones con efectos comprensibles. Retirarse aquí rechaza un trato, no toda la aventura. Las diferencias de necesidad y el diálogo dentro de tareas continúan el criterio de las [entregas narrativa](narrativa-0.2.md) y [de Elías](elias-0.2-entrega-10.md). El episodio de la bomba es desarrollo de la adaptación, no una cita atribuida a la novela.

336 pruebas aprobadas en la suite completa. Las trece nuevas cubren condiciones y pagos, conocimiento disponible, agotamiento, espacio en mochilas, reparación que libera espacio, radio existente, ambos resultados del engaño, recarga, doble entrada, cancelación, consecuencias finales, migración, datos inválidos, reinicio y los botones del diálogo sobre el HTML real mediante Linkedom. Las dos campañas automáticas de continuidad ahora verifican también que el trato llegue al descanso y al guardado final; una de ellas entra por la oferta de información.

Esas campañas resuelven combates y reponen salud y energía como antes: no son una prueba de balance de supervivencia. No se realizó una partida humana completa ni se considera demostrada una mejora de retención. Quedan por evaluar el ritmo de las dos entradas de conversación y el atractivo relativo de pagar con recursos, favores, datos o compromisos.

El siguiente bloque propuesto es la llegada a los refugios después de los encargos: que el destinatario y la comunidad respondan a lo que recibió ayuda, quedó pendiente o se sacrificó durante el trayecto. Antes de añadir encargos nuevos, conviene dar un cierre humano a los que ya existen y comprobar que esa memoria no mezcle los equipos ni duplique recompensas.
