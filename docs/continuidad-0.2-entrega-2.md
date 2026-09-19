# Versión 0.2 · Entrega 2: un informe que llega a otro equipo

Base: `main` 2c990119407661c0259e8ec2cc3c1af0a9a6963e. Continúa los criterios y fuentes de [narrativa-0.2.md](narrativa-0.2.md).

## Problema y alcance

Los Mensajeros y la expedición compartían una entrada, lugares y apariencia de refugio, pero sus acciones permanecían separadas. El informe de Morales terminaba con pago y reducción de vigilancia dentro de Encargos. La expedición no se enteraba de que alguien había recorrido el corredor que conecta con su refugio.

Esta entrega conecta un solo hecho completo: **los Mensajeros entregaron el informe de Morales en Los Héroes**. El lugar y el destinatario ya existían. No se inventa una visita de Noa a una estación remota ni se convierte a Mara en alguien que conoce todo lo que ocurre en los túneles. Morales deja una copia en el refugio; Mara puede señalarla y Noa puede leerla con Sara y Elías.

El informe distingue información comprobada de una observación a distancia. Esa diferencia procede de una elección real del encargo y cambia tanto la conversación como su utilidad. El texto no concede una victoria futura: Noa explica que sirve para preparar la salida, no para garantizar el resto del recorrido.

## Qué verá el jugador

Después de entregar «Rastros del corredor», al regresar a la campaña aparece un aviso en el menú de actividades y un botón junto al estado del grupo en el refugio. Mara reconoce el trabajo de Rocío, Tomás y Bruno. Al abrir el informe, una escena con Noa muestra qué datos llegaron y permite preparar la salida o guardar la información para después.

| Lo que hicieron los Mensajeros | Qué reconoce Noa | Consecuencia al confirmar una salida |
| --- | --- | --- |
| Rastrear el desvío (`desvio_identificado`) | Un paso que el equipo se acercó a comprobar. | Hasta 6 puntos menos de amenaza, una sola vez. |
| Observar desde el andén (`patron_registrado`) | Un patrón de movimientos, sin afirmar que revisaron el otro paso. | Hasta 4 puntos menos de amenaza, una sola vez. |
| Entrega antigua confirmada sin observaciones conservadas | La copia está incompleta. Noa no puede deducir una ruta segura. | Se reconoce la entrega; no se inventa una ayuda. |

Los valores de 6 y 4 son una primera decisión de balance, no una medida psicológica. Reflejan preparación diferente, sin sustituir el inhibidor ni eliminar combates. La amenaza no baja de cero: el registro conserva cuánto se redujo realmente. No hay pago, objeto, experiencia o punto de facción adicional en la campaña por leer o preparar el informe.

El plan espera hasta una salida confirmada. Volver del aviso logístico, no cumplir las condiciones para salir, cambiar de actividad o recargar no lo consume. Después de usarlo, el informe sigue disponible como memoria de esa salida; no recupera su beneficio en cada visita. El diálogo de Mara también cambia para reconocer que aquella información ya se usó.

## Persistencia y conocimiento

La prueba de entrega es el recibo final guardado por el motor de Encargos. El puente lee `neosantiago.mensajeros.production.v1` y exige formato de producción compatible, misión pagada, efecto registrado y recibo no provisional para Morales en Los Héroes. Una misión aceptada, un tramo recorrido, un fracaso o un abandono no cumplen ese contrato. Los mensajes del iframe no se utilizan como prueba de entrega.

El identificador de hecho `morales-corridor-report` se importa una sola vez en `state.worldContinuity`, con versión propia. Conserva la misión de origen, la clase de observación, el día y la posición de campaña al recibirla, si se abrió el informe, si se preparó un plan y cuándo se utilizó. No se modifica el historial anterior para fingir que el grupo ya lo sabía.

La sincronización ocurre al abrir actividades, regresar a la historia o entrar al refugio. No lee ni concede hechos al mostrar la portada y se bloquea durante un combate o un encuentro sin resolver. No cambia el reloj, la semilla aleatoria, las mochilas, las heridas ni el dinero de ninguno de los equipos. El puente nunca escribe el guardado de Los Mensajeros.

El contrato valida el recibo necesario para esta conexión; no es un sistema antitrampas ni sustituye la validación completa del motor de Encargos. Un JSON ilegible, un formato desconocido o un recibo provisional se dejan intactos y no generan hechos. Una entrega antigua compatible puede importarse, pero su momento de conocimiento es el de la campaña actual, no un momento retrospectivo inventado.

## Reinicios y límites

«Nueva partida» conserva su comportamiento: reinicia ambos equipos y borra también los hechos de esta campaña. Cierra la nueva ventana, restituye el foco y descarta cualquier plan pendiente.

«Reiniciar encargos» borra solo Los Mensajeros. No borra lo que la expedición ya recibió, preparó o utilizó. Volver a completar Morales no repone su ayuda, ni reemplaza una observación ya recibida por otra más ventajosa. Esta distinción aparece en la confirmación de reinicio y en la ayuda de actividades. Si se reinician los encargos antes de que la campaña reciba el informe, se pierde esa prueba de entrega junto con el resto del progreso de ese equipo.

La expedición terminada no recibe una nueva salida ni se reescribe su desenlace. Los demás encargos todavía no generan hechos para la campaña. No existe sincronización entre dispositivos o navegadores: ambos equipos comparten el almacenamiento local del mismo origen. Tampoco se simula aún envejecimiento de informes, patrullas en tiempo real o confianza personal. El beneficio tiene un uso precisamente para no tratar una observación pasada como protección permanente.

## Implementación y comprobación

`world-continuity.js` reúne importación, normalización, conocimiento, preparación y uso. `game-v2.js` contiene puntos explícitos de integración en carga, refugio, salida y reinicio. `activities.js` sincroniza al cambiar de equipo; `mobile-back.js` cierra la nueva escena sin elegir por el jugador. El motor de Encargos conserva sus pagos y resultados; se actualizan sus textos y la reacción de Mara.

La escena reutiliza el retrato de Noa y la composición narrativa existente. Tiene texto desplazable, controles fuera de la lectura, foco limitado al diálogo, regreso con Escape y botón Atrás del navegador. El refugio de Los Mensajeros usa la misma base visual pero no muestra el botón reservado a la expedición.

Resultado de esta entrega: `npm test`, 234 pruebas aprobadas; comprobación de sintaxis y `git diff --check` sin errores.

Las pruebas recorren el encargo real hasta obtener sus recibos, en ambas variantes. Cubren importación única, ausencia de transferencias materiales, lectura aplazada, preparación y uso, límites de amenaza, cancelación, recarga, retorno al refugio, reinicio parcial y total, partidas antiguas, recibos incompletos, bloqueo durante encuentros y navegación de teclado/Atrás. Se conserva la batería de regresiones del juego.

## Criterio para la próxima conexión

La unidad de desarrollo deja de ser «otro diálogo» y pasa a ser un hecho con recorrido completo: quién lo produjo, quién pudo conocerlo, qué respuesta abre y cómo se reconoce después. Es la aplicación concreta del enfoque de escenas condicionadas descrito por Emily Short, citado en el documento de la entrega anterior.

La siguiente conexión debe aportar otra clase de consecuencia: una infraestructura reparada o una persona que vuelve y modifica una escena posterior. No conviene convertir todos los encargos en descuentos de amenaza. Antes de implementarla habrá que comprobar lugar, destinatario, momento de conocimiento y efecto real; después escribir la reacción humana que nace de esas condiciones.
