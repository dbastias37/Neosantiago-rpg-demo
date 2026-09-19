# Entrega 10 — Elías: lo que pudo leer y lo que quiere creer

## Problema y alcance

El Nodo 14 ofrecía archivos, una prueba técnica y la preparación de un relé. La conversación nocturna de Elías no intervenía en ninguno de esos resultados. Además, leer una bitácora se describía como confirmar que la operadora seguía viva, y una descarga completa podía confundirse con información actual. El propio expediente del listado ya decía que su actualización tenía dieciocho meses.

Esta entrega conecta el acuerdo de la primera noche, la consulta del Nodo 14, una conversación breve sobre lo recuperado, la segunda noche y el encuentro con Irene. No declara terminada la versión 0.2.

## Humanizar desde una necesidad concreta

Elías quiere ser útil. Si falla el injerto, vuelve a buscar una lista que no terminó de copiarse; más tarde admite que no quería volver con tan poco. Si el acceso funciona, reconoce el alivio que casi le hizo pasar por alto la fecha. Su dificultad no consiste en recitar una explicación técnica perfecta, sino en responder a quienes esperan algo de él sin asegurar lo que no sabe.

Sara no funciona solamente como quien corrige al ingeniero. Quiere que una pista todavía pueda llevarlos a ayudar a alguien. Al hablar de la operadora, expresa que ella preferiría que fueran a buscarla aunque no estuvieran seguros. Noa necesita saber si el grupo va a buscar a una persona o a comprobar una anotación, porque será quien abra parte del camino. Las tres posturas tienen una razón que el jugador puede comprender.

El diálogo ocurre al desconectar el terminal y guardar el equipo. Utiliza el retrato de Elías y la ventana de conversación existente. Tras la consulta, el jugador puede dejar por escrito lo comprobado y lo pendiente, o conservar preguntas de búsqueda junto al registro. Las opciones expresan una postura y cambian los recuerdos posteriores; sus ayudas aclaran que no abren otra misión ni modifican la ruta. Tampoco conceden simpatía, recuperación ni recursos.

## Qué sabe realmente el grupo

| Consulta | Hecho que se conserva | Límite |
| --- | --- | --- |
| Credencial | Protocolo y listado | La identidad abre el sistema, no actualiza el censo. |
| Núcleo, éxito | Protocolo, listado y rastreo; consume el núcleo | Copia completa no significa datos actuales. |
| Núcleo, fallo | Protocolo, núcleo consumido y alerta | No obtiene nombres de este intento; los documentos anteriores siguen disponibles. |
| S-7 aliado o infiltrado | Archivos de su variante, con sus efectos existentes | La autorización no confirma supervivientes. |
| H-12 controlado | Acceso completo sin consumir un núcleo | Conserva la fecha y el alcance de los registros. |
| Origen de la señal | Bitácora de la operadora vinculada al soporte vital | La hora ilegible impide confirmar su estado actual. |
| Relé | Canal programado y protocolo | No envía la llamada ni descarga el listado. |
| Elías agotado | Salida sin consultar | No inventa un trabajo técnico que no pudo realizar. |

La voz automática del terminal se identifica como un diagnóstico sin fecha legible. Su categoría de identidades activas no equivale a una respuesta humana. Se conserva el audio existente.

Los expedientes aún no recuperados del nodo dejan de mostrar su primer párrafo completo como si fuera una pista ya leída. La restricción continúa después de esa consulta mientras sigan pendientes. Los recuperados incluyen una nota sobre el alcance de la consulta; no se destruye conocimiento anterior. Esta corrección se aplica a protocolo, listado, origen y rastreo en ese contexto, no rehace todo el sistema de archivos.

La segunda noche distingue la copia fallida, el acceso completo, la bitácora y el relé, junto con la postura elegida al guardar el cuaderno. Al encontrar a Irene, la escena reconoce la diferencia entre haber leído una referencia y tener una persona delante. La presencia se registra al elegir acercarse a ella, no por renderizar la escena. Sus decisiones de consentimiento, traslado y archivo permanecen disponibles según las reglas existentes.

## Referencias y adaptación

Se volvió a consultar [Neo Santiago 2130 — La ciudad de los rotos](https://neo2130.onrender.com/), con lectura de la presentación, prólogo y pasajes del capítulo II. La comunidad que conserva archivos sin poder reproducirlos y transmite recuerdos oralmente da peso a la tarea de recuperar y explicar información. La tecnología portátil y los episodios de Elías pertenecen a la adaptación jugable; no se presentan como escenas transcritas de la novela. La matriz de voces y las diferencias entre libro y juego siguen en [la primera entrega](narrativa-0.2.md).

[Emily Short, Conversation](https://emshort.blog/how-to-play/writing-if/my-articles/conversation/), distingue hechos, intervenciones, efectos y objetivos conversacionales; también señala el valor de que un personaje persiga algo propio. Aquí se aplica separando el contenido recuperado del deseo de Sara de buscar y de la incomodidad de Elías ante una respuesta incompleta.

[Harris Powell-Smith, How can I include breathing room in my IF?](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/), propone situar conversaciones en tareas y conectar las pausas con la trama. Aquí la conversación acompaña el manejo del cable, el lector y el cuaderno, y vuelve cuando el grupo puede revisar lo ocurrido. Ninguna de estas fuentes demuestra que este bloque retenga más jugadores: ese efecto necesita una prueba humana.

## Integración y guardado

`companion-evidence.js` transforma la escena después de las variantes y del añadido del relé de `narrative-finale.js`; por eso contempla también esa cuarta opción. El registro `companionCommitments.information` conserva método, resultado, archivos de esta consulta, documentos anteriores, participación del grupo, postura elegida y comprobación posterior de la presencia de Irene.

El guardado sigue siendo atómico por encuentro. Antes de terminar la conversación, una recarga restaura inventario, semilla y estado previos. No permite quedarse con la descarga y volver a tirar. Al completar la instancia se guardan la acción y el diálogo juntos. Los guardados antiguos reciben un registro vacío; no se deduce una consulta a partir de documentos obtenidos en otros lugares. Los registros inválidos se rechazan sin reemplazar el archivo almacenado. Nueva partida limpia esta memoria.

La prosa nueva de las acciones conserva una referencia a su definición mecánica original para calcular impulsos psicológicos y sus destinatarios. Cambiar una frase de este bloque ya no modifica por accidente esos efectos por contener otra palabra. Esto protege estas variantes; todavía queda pendiente sustituir la inferencia textual en el resto del juego por efectos explícitos de las acciones.

## Verificación y siguiente parte

323 pruebas aprobadas en la suite completa, con once pruebas nuevas. Incluyen la matriz de acuerdos y accesos, éxito y fallo del núcleo mediante la interfaz de decisión, consumo único, memoria nocturna, archivos previos, agotamiento, diálogo sin recompensas, recarga, rechazo de datos inválidos, reinicio y controles sobre el HTML real mediante Linkedom. Se comprueba que la reescritura no altere los efectos psicológicos ni sus destinatarios.

Las dos campañas automáticas completas ahora enlazan también la conversación de Elías, la consulta, su postura, la segunda noche y la comprobación de Irene. Como en entregas anteriores, esas pruebas resuelven combates y reponen salud y energía: verifican continuidad, no balance de supervivencia. No se realizó una partida humana completa ni se atribuye a las pruebas una medida de impacto emocional.

La siguiente conexión propuesta es Vera y el precio de la ruta: revisar qué información tiene realmente el grupo al negociar, a quién expone al compartirla y cómo se recuerda esa decisión. El paso posterior debe contrastar las condiciones de sus opciones antes de añadir diálogo, para que el conflicto nazca de información y consecuencias reales.
