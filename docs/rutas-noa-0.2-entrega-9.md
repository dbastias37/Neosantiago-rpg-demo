# Entrega 9 — Noa: explicar el rumbo y responder cuando cambia el riesgo

## El vacío que se corrige

La primera noche permitía pedir a Noa que explicara cuándo volver o acordar decirle el motivo antes de cambiar de rumbo. La salida a la superficie no utilizaba esa conversación. Seguir las marcas, salir por la avenida y esperar acababan en el mismo encuentro sin explicar qué había servido de la decisión anterior. Además, el resultado de las marcas anunciaba haber llegado a una casa antes de cruzar la Alameda que todavía separaba al grupo de ella.

Esta entrega conecta la primera noche, «La primera luz», «Sombras sobre el asfalto» y la segunda noche. El jugador sigue eligiendo acciones con costos reales. Las intervenciones de Noa ocurren dentro de esas escenas, sin añadir un panel obligatorio ni otra ronda de confirmaciones.

## Qué cambia al jugar

En la escalera, elegir un camino expresa una prioridad: buscar cobertura, acercarse a la señal o observar la patrulla. Elías quiere llegar mientras la transmisión siga activa; Sara quiere conservar fuerzas para ayudar; Noa necesita saber qué están intentando evitar antes de abrir camino. Ninguno conoce todavía el cruce completo.

Las marcas conducen por patios hasta el costado de la Alameda, no directamente al interior de una casa. La salida rápida acepta exposición. Esperar deja pasar la patrulla de la escalera, sin prometer que todos los drones de la ciudad hayan desaparecido. Se elimina la duración rígida de cuarenta y siete minutos de ese resultado: era incompatible con algunas horas contextuales de salida tras S-7. Se conservan las horas contextuales de campaña y los costos de las tres acciones.

La Alameda recoge cómo llegaron. Si se acordó escuchar el límite de Noa, ella identifica la vigilancia a dos alturas como motivo para detener el avance frontal. Propone el acceso subterráneo, que cuesta esfuerzo y no equivale a regresar al refugio. El jugador conserva las tres respuestas existentes:

| Acción real | Respuesta que se conserva |
| --- | --- |
| Cruzar por los subterráneos | El grupo cambia el acceso y carga el equipo entre derrumbes; la objeción de Noa interviene en lo que hacen. |
| Vencer a los drones | La victoria permite cruzar, pero Noa no pasa a decir que había preferido combatir. |
| Usar un núcleo como señuelo | El núcleo se consume y esperan a comprobar que el cruce quedó despejado. |
| Utilizar la ayuda disponible de S-7 | Se conserva la acción y costo de su variante; el recuerdo no inventa el consumo de un núcleo. |
| Retirarse o perder el combate | Regresan mediante el sistema de refugio existente. La Alameda sigue pendiente y el intento queda registrado aunque después consigan cruzar. |

La segunda noche retoma la ruta, la solución del cruce y los regresos ocurridos durante los intentos. Permite acordar revisar el rumbo cuando cambie la información o reconocer que explicar un motivo no elimina el desacuerdo. Responder no concede afinidad, recursos ni recuperación.

## Voz y criterio

El vínculo con Noa se expresa en una tarea compartida: buscar paso, comprobar cobertura, cargar mochilas y revisar un mapa. Su necesidad no es recibir siempre la respuesta más prudente, sino poder intervenir antes de que el grupo ya esté comprometido. Comprender la urgencia de Elías no la obliga a preferir la avenida. Sara participa desde el cuidado de quienes tendrán que completar el trayecto.

Se continúa la aplicación de las fuentes consultadas en las entregas anteriores: [Emily Short sobre contenido condicionado por el estado y sus efectos](https://emshort.blog/2019/11/29/storylets-you-want-them/) y [Harris Powell-Smith sobre integrar momentos de pausa en la ficción interactiva](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/). Son criterios de diseño, no pruebas de un efecto psicológico ni de mayor retención. La referencia de mundo y voces de la adaptación permanece en [la entrega inicial](narrativa-0.2.md).

## Estado, guardado y compatibilidad

`companion-routes.js` transforma las escenas sin mutar sus definiciones ni el guardado durante el renderizado. `companionCommitments.route` guarda el acuerdo previo, la salida, el cruce resuelto y el número de intentos que terminaron en el refugio. Distingue la posibilidad de conversar antes del cruce de las condiciones del grupo al terminarlo; recuperar a alguien durante el combate no inventa una objeción que no pudo expresar antes.

La salida y el cruce siguen el guardado por encuentro. Recargar un resultado todavía pendiente vuelve al punto anterior, con el inventario previo y sin conservar una recompensa de la acción inconclusa. Derrota y retirada se guardan con el regreso al refugio. Un registro resuelto conservado en su escena solo permite continuar, sin repetir hambre, efectos, combate ni premio de esa acción.

Los guardados sin este campo reciben un registro vacío. Una partida que ya pasó la salida no reconstruye la decisión a partir de banderas generales. Una conversación nocturna ya respondida mantiene su texto guardado. Nueva partida limpia la memoria. Un registro inválido se rechaza sin reemplazar el archivo almacenado.

## Verificación y alcance

312 pruebas aprobadas en la suite completa. Las nueve pruebas nuevas incluyen matrices de tres acuerdos —incluida la ausencia de conversación—, tres salidas y tres resoluciones; las dos ayudas de S-7; retirada y derrota con reintento; agotamiento; recarga; compatibilidad; rechazo de registros inválidos; reinicio; ausencia de costos duplicados; y controles sobre el HTML real mediante Linkedom.

Las dos campañas automáticas de continuidad ahora responden a Noa en la primera noche, atraviesan la salida y el cruce y recuperan el hecho durante la segunda noche antes del desenlace. Resuelven combates explícitamente y reponen salud y energía, como antes: verifican conexiones, no balance de supervivencia ni recepción emocional humana.

Este bloque no abre nuevas ramas geográficas: da continuidad y memoria a las variantes existentes en ese tramo. Tampoco añade un regreso voluntario desde la escalera: los regresos registrados son los que efectivamente ejecuta el combate. La revisión humana del ritmo y el impacto de estas conversaciones sigue pendiente.

Próximo bloque: Elías ante la información incompleta del Nodo 14. Debe conectar lo acordado por la noche con lo que realmente pudo verificar, lo que entrega al grupo y lo que después se permite afirmar. Otra deuda detectada para una revisión posterior es que parte del sistema de pulso psicológico infiere efectos desde palabras de la prosa; conviene separar esa inferencia de los hechos de las acciones para que una corrección de texto no altere el balance sin intención.
