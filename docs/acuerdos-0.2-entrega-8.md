# Entrega 8 · Lo que Sara pidió y lo que ocurrió en la clínica

Base: `main` 3ae8ebc125664d44ea72156d1c5bee5aa69065fc. Continúa la actualización hacia 0.2 con un compromiso concreto de la primera noche y una situación posterior donde puede respetarse o quedar sin cumplir. El alcance se concentra en Sara y Lira; no introduce un sistema general de aprobación para los tres protagonistas.

## Conexión implementada

En la primera noche, Sara puede pedir que la decisión de ayudar se discuta entre los tres o que se reconozcan explícitamente los límites de las reservas. Ahora el encuentro «El núcleo expuesto», durante el segundo día, recupera esa respuesta. Si nunca conversaron, no se inventa un acuerdo.

La clínica muestra las medicinas y el agua que realmente lleva el equipo. Advierte cuando atender a Lira utilizaría la última medicina. «Revisar las reservas con el equipo» abre el panel lateral ya utilizado por la campaña: Sara explica qué puede ofrecer, Noa habla de vigilar la puerta y Elías distingue el núcleo que mantiene viva a Lira de una pieza aprovechable. La conversación no consume suministros, energía, puntos de facción ni turnos. El panel pausa el reloj del inhibidor y bloquea los atajos que podrían elegir una acción detrás de la lectura.

Conversar no decide la acción. Se puede atenderla, dejar agua, extraer el núcleo o retirarse. Sara responde a lo ocurrido; haber oído su objeción no convierte la extracción en una decisión compartida de atención médica. Si habían acordado consultar y la decisión se toma sin hacerlo, lo señala. No se agrega un castigo numérico por omitir la conversación.

La reacción aparece en el resultado y en el historial de esa decisión. La segunda noche recupera el hecho concreto: usaron medicina, dejaron agua, se marcharon sin tratarla o le quitaron el núcleo. Si la atendieron y posteriormente la traicionaron durante su diálogo, el recuerdo reconoce ambas acciones. Atender primero no oculta la muerte posterior.

Las respuestas nocturnas permiten comprometerse a consultar antes de gastar reservas o reconocer que no siempre alcanzarán un acuerdo. Sara diferencia poder expresar su objeción de tener siempre la última palabra. Esta entrega registra esa respuesta; todavía no la conecta con una tercera situación.

## Vacíos corregidos

Antes, si el equipo no tenía medicina ni agua, las dos opciones de ayuda quedaban bloqueadas y extraer el núcleo era la única opción disponible. Se añade «Retirarse sin tocar el núcleo»: conserva los recursos, cuesta 2 de moral y continúa la expedición. Lira queda sin tratar y su destino permanece desconocido. No concede una alianza ni confirma una recuperación.

Dejar agua ya no se describe como si hubiera resuelto la herida. Atender tampoco garantiza recuperación completa. Si Sara está agotada, no puede realizar la atención. Si alguno del grupo está agotado, la interfaz no ofrece la conversación conjunta ni registra una decisión como si los tres hubieran participado.

Una Lira que ya figura muerta no puede ser atendida ni entregar otro núcleo. Un registro de clínica ya resuelto, conservado en esa posición de la campaña tras una interrupción, permite continuar sin repetir su consumo.

## Guardado y compatibilidad

La consulta se guarda inmediatamente, con las reservas y palabras que se vieron entonces. Al releerla, el panel distingue esas cantidades de las reservas actuales. Los requisitos de la acción se comprueban con el inventario actual, no con la foto de la conversación.

La decisión conserva el guardado atómico de los encuentros de campaña. Si se recarga antes de terminar la instancia, se vuelve a su inicio con los recursos previos y la consulta ya registrada. Al continuar tras resolverla, acción, costos y recuerdo quedan guardados juntos. Repetir el clic no vuelve a consumir recursos.

Los guardados antiguos reciben un registro vacío. Si ya pasaron la clínica, no se reconstruyen acuerdos a partir de las banderas ni se reabre la escena. Nueva partida limpia el registro. El historial de una noche ya respondida conserva su texto original.

## Criterio narrativo

Se mantiene el criterio de [Emily Short sobre contenido, condiciones y efectos](https://emshort.blog/2019/11/29/storylets-you-want-them/), aplicado en la entrega anterior: la respuesta de la noche es una condición, la clínica pone a prueba el acuerdo y el recuerdo posterior depende de una acción observada. Las tareas concretas que enmarcan el diálogo siguen el criterio de [Harris Powell-Smith sobre espacio para respirar en ficción interactiva](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/).

La relación se expresa mediante respuestas y diferencias de criterio, sin convertir una conversación en puntos de simpatía. Esto es una decisión de diseño para dar continuidad a los personajes, no una demostración de mayor retención. El tratamiento de la novela y las voces de la adaptación sigue documentado en [la primera entrega](narrativa-0.2.md).

## Verificación y próxima parte

Suite completa: 303 pruebas aprobadas. Las pruebas nuevas cruzan las dos respuestas de Sara y la ausencia de conversación con consulta previa o decisión directa y las cuatro acciones de la clínica. Verifican costos, escasez total, agotamiento, muerte posterior, memoria de segunda noche, migración, rechazo de guardados inválidos y reinicio. La integración de interfaz comprueba el botón, el panel de lectura, el bloqueo de atajos, la recuperación del foco y la cuarta opción.

Dos recorridas automáticas completas de continuidad narrativa atraviesan la primera noche, conversan en la clínica y recuperan su consecuencia en la segunda noche antes de llegar a sus desenlaces. Como ya ocurría en esas pruebas, los combates se resuelven explícitamente y se reponen HP y energía entre escenas: comprueban conexiones narrativas, no balance de supervivencia. La revisión final de texto repite las pruebas de este bloque y de sus conexiones nocturnas y de campaña.

Pendiente: aplicar una conexión equivalente a Noa en una decisión de ruta y a Elías en una decisión sobre información incompleta. Cada una necesita un hecho propio, una respuesta posterior y pruebas de continuidad. También falta una lectura humana de este bloque dentro de una partida real; la suite comprueba estados y conexiones, no la intensidad emocional de la escena.
