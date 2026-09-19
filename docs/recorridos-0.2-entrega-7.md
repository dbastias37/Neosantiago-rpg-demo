# Entrega 7 · Recorridos con identidad y conversaciones que continúan

Base: `main` 3f47691b36287293d89bbf6c00d237540971cd9c. Esta entrega continúa la actualización hacia 0.2; no declara terminada la versión. Responde al recorrido Libertadores–Vicuña descrito como lento, plano y repetitivo e incorpora el bloque pendiente de Sara, Elías y Noa.

## El problema observado en el código

La red física conecta Libertadores con Vicuña a través de 27 tramos, pasando por centro, talleres, Línea 6 y Línea 4. No existe un enlace directo que permita acortarlos sin modificar la geografía. Antes, el mismo conjunto pequeño de obstáculos, hallazgos y encuentros se reutilizaba en regiones diferentes. Hasta un paso tranquilo detenía el recorrido para pedir «Continuar». La animación podía consumir 2,6 segundos de movimiento y otro segundo de llegada por tramo. Repetir ese procedimiento no añadía una decisión equivalente al tiempo y los clics exigidos.

Se conserva la red física y se cambia la manera de recorrerla: situaciones reconocibles, memoria, intervalos sin decisiones y un control de viaje más rápido. La distancia deja de ser una secuencia de confirmaciones idénticas, aunque sigue teniendo costos de desplazamiento y desgaste.

## Encuentros implementados

Hay once escenas regionales nuevas, con condiciones de aparición y resolución persistente, más cinco textos de tránsito propios de los sectores. Las escenas utilizan fondos existentes distintos; no se presentan como ilustraciones nuevas de estaciones específicas.

| Sector | Conflicto situado | Continuidad |
| --- | --- | --- |
| Abastecimiento del norte | Una etiqueta duplicada impide cerrar la cuenta de un cajón. | Plaza distingue entre una corrección comprobada y una discrepancia que solo fue anotada. |
| Refugios del centro | Una mujer encuentra a su padre en dos registros contradictorios. | La respuesta reconoce fechas y responsables, sin inventar que el padre está a salvo. |
| Talleres y carga | Un carro obstruye el paso; sostener el eje permite repararlo, la escalera cuesta esfuerzo. | La ayuda recibe una respuesta concreta del mecánico. La situación no se repite como si nunca hubieran pasado. |
| Talleres y carga | Un dron conectado por cable bloquea el corredor transitable. | Para cruzar hay que combatir. Retroceder conserva el bloqueo. La victoria abre el paso para siguientes viajes. |
| Línea 6 | Una mensajera lleva dos turnos esperando reemplazo y necesita avisar. | Llevar el recado permite entregarlo en Los Leones; ayudarla a localizar una radio resuelve la necesidad por otra vía. La transmisión no se confunde con recepción confirmada. |
| Línea 4 | Un control no reconoce el sello del relevo anterior. | El grupo elige cómo verificar su paso sin abrir la carga protegida. Queda registrada la respuesta. |
| Línea 4 | Una bomba no aspira y la galería empieza a inundarse. | Un encuentro posterior distingue si ayudaron a cebarla o cruzaron por el borde seco. |
| Acceso a Vicuña | Un auxiliar necesita identificar destinatarios y ordenar la recepción. | El grupo puede aclarar su contacto o ayudar con una etiqueta antes de entrar. |

El dron obligatorio solo aparece durante traslados entre encargos. No se introduce en la extracción de Adasme, donde ya existe una recompensa explícita por no combatir. Humo, señuelo, escucha e interferencia no atraviesan este bloqueo; las retiradas siguen disponibles y regresan al andén anterior. El aviso aparece al preparar el traslado y al consultar su itinerario. La victoria se recuerda al cerrar el saqueo; recargar o retroceder no concede la resolución. Un reintento posterior tampoco vuelve a generar el combate y su botín si ya quedó despejado.

Las escenas de recogida de carga, informes, frecuencia, rescate y entrega mantienen prioridad. Las escenas regionales resueltas no vuelven a sortearse en cada viaje. En los espacios restantes continúa existiendo variación aleatoria; el sistema alterna incidentes con descansos narrativos sin suprimir los encuentros exigidos por ciertos corredores.

Los personajes locales son habitantes de la adaptación. No se les atribuye existencia en la novela. Los criterios de voz y las distinciones entre libro y juego siguen los establecidos en [la primera entrega](narrativa-0.2.md).

## Ritmo e interfaz

«Avanzar a…» conserva el control de un tramo. «Viajar hasta el próximo encuentro» acelera la animación y enlaza solamente pasos tranquilos. Se detiene ante una decisión, combate, entrega, extracción, descanso o punto de control. No elige respuestas por el jugador y no reduce minutos ni desgaste.

Un paso tranquilo del sistema nuevo llega sin otra ventana de confirmación. Su texto queda en el resultado visible y en el registro. Las decisiones regionales muestran su respuesta en el panel del recorrido, donde se puede leer y desplazar el texto sin abrir otra ventana. El panel identifica el sector; las escenas cambian de fondo según su ambiente. Esto inicia una diferenciación visual, pero todavía no constituye arte propio para cada estación.

## Sara, Elías y Noa

Las dos noches incluyen conversaciones opcionales con cada integrante. Se puede hablar antes o después de decidir las reservas. Cada respuesta se guarda una sola vez por personaje y noche. Quien está sin HP necesita primero la atención nocturna; no se escribe una conversación activa mientras permanece agotado.

Sara plantea el peso de decidir quién recibe ayuda cuando no hay medios para todos. Elías expresa la incomodidad de entregar una duda en vez de una explicación. Noa pide saber por qué se cambia de rumbo y que se escuche cuándo propone regresar. Sus conflictos aparecen mientras ordenan vendas, revisan un cuaderno o aflojan una correa, sin convertirlos en discursos sobre su función profesional.

La primera noche ofrece dos respuestas por personaje. La segunda recupera la elegida y permite sostener o revisar ese criterio. Si no hablaron, no se inventa un acuerdo. La conversación de Sara reconoce la muerte de Lira cuando corresponde, sin revertirla ni absolver al grupo. La respuesta visible y su contexto sobreviven a la recarga.

Hablar no entrega afinidad, curación, dinero, puntuación ni reducciones ocultas de estrés. La consecuencia de este bloque es expresiva y persistente en las conversaciones. Todavía no obliga a que una promesa altere una acción futura de campaña: esa conexión requiere una siguiente entrega con hechos comprobables, no un indicador de «confianza» sin comportamiento asociado.

## Persistencia y compatibilidad

Los nuevos recorridos incorporan un director de encuentros y una memoria separada de resoluciones. Las partidas anteriores conservan la instancia ya sorteada, sus heridas, botín y minutos. Un viaje antiguo en curso sigue sus reglas hasta terminar; el siguiente viaje o encargo utiliza el sistema nuevo. No es necesario reiniciar el progreso para recibirlo.

Las noches antiguas reciben un registro vacío de conversaciones. No se reproducen noches cerradas ni se supone que el jugador eligió una respuesta. Los registros inválidos se rechazan sin sobrescribir el guardado existente. Campaña y Mensajeros continúan con inventarios y tiempos separados.

## Fundamento y criterio de diseño

[Emily Short, Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/), describe piezas de contenido con condiciones de aparición y efectos en el estado. Aquí esa estructura organiza encuentros por lugar, resolución previa y respuesta elegida. Permite escribir una continuación sin repetir toda la escena inicial ni añadir una misión nueva para cada diálogo.

[Harris Powell-Smith, sobre espacio para respirar en ficción interactiva](https://hpowellsmith.com/if-seal-how-can-i-include-breathing-room-in-my-if/), recomienda situar las conversaciones en tareas y entornos concretos y conectar los momentos tranquilos con la trama. Se aplica a las labores de los sectores y las conversaciones nocturnas. También fundamenta mantener pasos sin conflicto: aumentar la densidad de enfrentamientos en todos los tramos reemplazaría una repetición por otra.

La hipótesis de diseño es que reconocer diferencias entre lugares, entender una necesidad y ver que una respuesta se recuerda puede dar sentido al avance. No se presenta como una prueba psicológica de retención. La queja del jugador orienta la intervención; su efecto sobre interés y ritmo debe contrastarse jugando, especialmente en un segundo recorrido donde parte de las escenas ya se habrá resuelto.

## Verificación y alcance pendiente

`npm test`: 294 pruebas aprobadas. Incluye la cadena de ocho encargos con traslados reales desde una partida nueva, cuatro semillas de Libertadores–Vicuña, compatibilidad de partidas, rechazo de desvíos ante el bloqueo, retirada real, victoria y reintento sin volver a generar botín, continuidad de los registros del norte, prioridad del rescate y guardado de las seis respuestas iniciales de los compañeros.

La prueba específica de Libertadores–Vicuña conserva 27 llegadas en orden. En sus cuatro semillas encuentra diez escenas regionales distintas, once o doce pasos tranquilos y un combate. Llega con el equipo vivo usando inventario inicial y descansos normales; no inyecta vida ni dinero. Es una simulación del motor, no una sesión humana completa ni una medida de diversión.

Las pruebas de interfaz verifican que el viaje ágil se detenga ante un enfrentamiento sin iniciarlo, que atraviese pasos tranquilos cobrando cada tramo, que desaparezca la confirmación redundante y que los botones nocturnos guarden la respuesta y mantengan el foco. También se revisan sintaxis y diferencias de Git.

La siguiente entrega debería conectar un compromiso concreto de la noche con una situación posterior donde cumplirlo o incumplirlo resulte observable. En Mensajeros, el siguiente vacío es el segundo paso por sectores ya conocidos: hacen falta cambios de turno y pequeñas continuaciones condicionadas por entregas, sin reinstalar obstáculos resueltos. También quedan pendientes ilustraciones locales y una prueba humana del ritmo con lectura real. La base de esta entrega permite añadir esas continuaciones con condiciones y memoria, en lugar de volver a ampliar un sorteo genérico.
