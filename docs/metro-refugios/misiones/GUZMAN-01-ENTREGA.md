# Guzmán 01 — Entrega técnica a Plaza de Armas

17 de septiembre de 2026. **Estructura inactiva, con laboratorio local.** Título de trabajo propuesto: «Piezas para seguir en pie». ID de prueba: `guzman-01`.

## Base definida por el usuario

Guzmán, encargado de los talleres de Los Leones, entrega **dos rotores y un sensor de movimiento**. Los Mensajeros deben transportarlos hasta Plaza de Armas y entregarlos a los técnicos encargados de las torretas que defienden la salida del refugio. Los rotores sirven para el movimiento y el sensor para la detección y funcionamiento de las defensas.

Es un encargo simple con un trayecto largo. El usuario pidió incorporar encuentros, decisiones y posibles momentos tranquilos en estaciones intermedias, especialmente en L6 entre Los Leones y Franklin, y contempló un descanso en Universidad de Chile. La entrega es a los técnicos; Ana conserva su función de líder de la comunidad y no los sustituye automáticamente.

## Recorrido preparado

Los Leones → Inés de Suárez → Ñuñoa → Estadio Nacional → Ñuble → Bío Bío → Franklin → Rondizzoni → Parque O’Higgins → Toesca → Los Héroes → La Moneda → Universidad de Chile → Plaza de Armas.

Un avance corresponde a una conexión entre estaciones, con un máximo de una instancia principal. La ruta conserva la decisión de pasar por Franklin y Los Héroes; otras combinaciones no se habilitan por inferencia. No se usa la L1 cortada hacia Los Leones.

| Ubicación | Función en la prueba |
|---|---|
| Los Leones | Origen, recepción de carga y punto de control |
| Inés de Suárez, Ñuñoa, Estadio Nacional, Ñuble y Bío Bío | Instancias variables según riesgo y registro del viaje |
| Franklin | Combinación L6/L2 e instancia posible; sin nuevo refugio |
| Rondizzoni, Parque O’Higgins y Toesca | Instancias de continuidad por L2 |
| Los Héroes | Refugio existente, punto de control y descanso |
| La Moneda | Instancia posible en L1 |
| Universidad de Chile | Punto de descanso y control provisional |
| Plaza de Armas | Refugio de destino y entrega explícita a los técnicos |

Las estaciones son referencias persistentes; el tipo de encuentro no queda fijado para siempre. El peligro es visible y el resultado de cada avance se sortea de forma oculta, se guarda y no cambia al recargar. La prueba no garantiza una cantidad de combates; los encuentros hostiles tienen alternativas para no luchar.

## Carga y cierre

La carga se separa de las provisiones: no se vende, descarta, desarma ni utiliza para otra cosa. Una inspección muestra imagen, cantidad, uso y destinatario. No hay daño aleatorio a los componentes.

Llegar no paga automáticamente: «Entregar a los técnicos» verifica los tres componentes, los retira y registra la recompensa una sola vez. No hace falta regresar a Los Leones para completar esta entrega. Premio de prueba: 40 fichas, pendiente de balance. El usuario no definió penalización específica por combatir en este encargo; sí se conserva la vigilancia causada por las peleas del sistema de viaje.

## Diálogos propuestos

Guzmán: «Estos dos rotores devuelven el movimiento a las torretas. El sensor les permite detectar lo que se acerca. Llévenlos a los técnicos de Plaza de Armas; ellos se encargan de instalarlos. El viaje es largo. Revisen sus provisiones antes de salir.»

Técnicos al recibir: «Llegaron los dos rotores y el sensor. Con esto podemos recuperar el movimiento y la detección de las torretas. Gracias por traerlos.»

Guzmán, informe preparado para una futura conversación: «Los técnicos confirmaron la entrega. Buen trabajo. Esas piezas hacían falta.» Esta línea se conserva en datos y no obliga a volver ni abre una misión nueva.

No se inventan nombres o retratos para los técnicos. Instalación, cambio visual de torretas, pagos definitivos y conexión a la campaña permanecen pendientes.

## Archivos

La definición, objetos, imágenes, motor y modales están en el [manual de la estructura](../../../extensions/mensajeros/README.md).
