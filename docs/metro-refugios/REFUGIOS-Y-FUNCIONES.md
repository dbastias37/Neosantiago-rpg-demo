# Refugios y funciones — diseño para continuar el desarrollo

Fecha: 14 de septiembre de 2026. Proyecto: NeoSantiago 2130. Estado: diseño documentado, sin integración jugable.

## Cómo continuar en otro chat

Leer primero `../../CONTINUIDAD-METRO-REFUGIOS.md` y después este documento. Consultar `modelo.json` para posiciones y recorridos esquemáticos; `laboratorio.source.json` conserva la interfaz aprobada. Este documento amplía las funciones de las comunidades: no reemplaza la geometría ni convierte el prototipo en un sistema de viajes.

Las ubicaciones, especialidades generales, cuatro refugios principales y nombres Los Mensajeros y El Frente vienen de decisiones del usuario. Los espacios interiores, servicios detallados, necesidades, límites y ejemplos de encargos que se desarrollan aquí son **propuestas de diseño para revisar**. Plaza de Armas conserva identidad provisional. No hay nombres propios, estadísticas, precios, recetas ni nuevas misiones aprobadas por este archivo.

El próximo trabajo es convertir estas funciones en fichas de NPC y en servicios concretos. Antes de crear personajes, revisar los que ya existen en el repositorio y su continuidad narrativa. No activar el mapa ni programar la expansión por el solo hecho de leer este documento.

## Estructura de la red

Cada comunidad debe tener una razón para existir, algo que aporta a las demás y necesidades que expliquen sus encargos. La especialidad mejora un servicio o permite una producción concreta; no significa que sus habitantes carezcan de todas las demás capacidades básicas.

| Lugar | Tipo | Función principal | Razón para visitarlo |
|---|---|---|---|
| Los Héroes | Refugio de expediciones y distribución | Preparar salidas, reunir recursos y coordinar encargos | Equiparse, obtener información inicial y encontrar trabajo |
| República | Puesto sanitario | Atención médica y suministro de tratamientos | Recuperarse y sostener el apoyo sanitario cercano |
| Los Leones | Refugio industrial y técnico | Electricidad, talleres y mantenimiento | Reparar equipo y conseguir soluciones técnicas |
| Plaza de Armas | Comunidad de cultivo medicinal, provisional | Producir insumos medicinales y conservar conocimientos de cultivo | Conectar la producción vegetal con la atención sanitaria |
| Los Libertadores | Refugio agrícola e hidropónico | Producción de alimentos a gran escala | Obtener provisiones y mantener el abastecimiento de la red |
| Vicuña Mackenna | Refugio fortificado y de abastecimiento militar | Armas, municiones y defensa organizada | Preparar operaciones difíciles y acceder a equipo especializado |

Son cuatro refugios principales y dos comunidades de apoyo. Ninguno necesita repetir todos los menús de los demás. Las funciones pueden representarse con una ficha de lugar, servicios y contactos usando los componentes HTML5 existentes; no requieren construir espacios 3D ni una pantalla diferente por cada oficio.

## Los Héroes — preparación y expediciones

**Base acordada.** Estación L1/L2, punto inicial y lugar de reunión de Cazadores y Exploradores. República está cerca al poniente; hacia el oriente se llega al corredor de Universidad de Chile y al sector destruido de Baquedano.

**Función propuesta.** Es el lugar donde una necesidad se transforma en una expedición preparada. Organiza información, provisiones y salidas; recibe parte de lo recuperado y facilita su distribución. Debe permitir entender el ciclo básico antes de afrontar corredores largos.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Almacén de expediciones | Compra, venta y provisiones básicas compatibles con la economía actual | Abastecimiento; revisar primero el papel de Mara |
| Mesa de expediciones | Informes de rutas, objetivos de reconocimiento y preparación | Expediciones |
| Punto de encomiendas | Recepción, asignación y entrega de cargas autorizadas | Encomiendas, vinculado a Los Mensajeros |
| Zona de descanso | Recuperación y preparación con los costos que se definan | Puede compartir responsable; no exige otro NPC |

**Aporta:** recursos recuperados, información de campo y organización de grupos. **Necesita:** alimentos de Los Libertadores, atención e insumos de República, reparaciones de Los Leones y abastecimiento defensivo de Vicuña Mackenna.

Sus encargos iniciales pueden pedir reponer material de expedición, llevar insumos al puesto médico o regresar con información de una salida cercana. El propósito es enseñar recolección, entrega y preparación. Un informe de reconocimiento debería obtenerse visitando o resolviendo un punto definido, no regalando conocimiento de toda la red.

**Límite:** disponer de provisiones básicas no convierte su almacén en una tienda con todas las mejoras del juego. Mantener motivos concretos para visitar los refugios especializados. Su posición inicial tampoco obliga a cerrar todos los contratos allí.

## República — atención sanitaria

**Base acordada.** Pequeño puesto de medicinas de L1 junto a Los Héroes; la línea se corta más allá hacia el poniente. No es un quinto refugio principal.

**Función propuesta.** Atiende las consecuencias de las expediciones y transforma suministros médicos en ayuda utilizable. Puede recibir tanto materiales recuperados como insumos de cultivo, sin que cualquier planta se convierta automáticamente en un tratamiento.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Puesto de atención | Servicio de recuperación conforme a las reglas de salud existentes | Atención médica |
| Reserva sanitaria | Recepción y distribución de insumos; preparación de suministros del juego | Puede usar el mismo encargado |

**Aporta:** atención y suministros médicos. **Necesita:** material sanitario, agua apta, energía para equipos y conservación, y un abastecimiento regular de insumos. Los objetos concretos deben mapearse al inventario existente antes de añadir recursos nuevos.

Ejemplo de encargo: recuperar un lote de material para reponer la reserva después de una expedición accidentada. Ejemplo de enlace entre comunidades: recibir un componente de conservación reparado en Los Leones. Las condiciones especiales de transporte, como temperatura o fragilidad, solo deben aparecer si se decide implementar esas mecánicas.

**Límite:** no proponer hospitales completos, producción industrial de medicamentos ni curación gratuita universal. La capacidad reducida explica los pedidos. Si un servicio queda limitado por un encargo, el jugador debe conocerlo antes de gastar recursos y conservar una alternativa básica de recuperación.

## Los Leones — electricidad y talleres

**Base acordada.** Estación L1/L6 especializada en suministros eléctricos y talleres. Desde Los Héroes se accede por L2 hasta Franklin y luego L6. La conexión punteada de Baquedano a Los Leones representa un paso destruido.

**Función propuesta.** Recupera, diagnostica y repara tecnología para que las otras comunidades puedan trabajar. Sus servicios deben relacionarse con el equipo y crafteo existentes; no introducir un sistema de durabilidad solo para justificar un taller.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Taller y banco eléctrico | Reparaciones definidas, fabricación compatible y acondicionamiento de componentes | Electricidad y talleres |
| Puesto de radio | Recepción de señales e informes, mantenimiento de enlaces | Comunicaciones |
| Depósito técnico | Clasificación y recepción de piezas para trabajos pendientes | Función del taller; no necesita otro personaje |

**Aporta:** equipo reparado, componentes preparados y mantenimiento de comunicaciones. **Necesita:** piezas recuperadas, herramientas, materiales conductores y aislantes, alimentos y suministros médicos. Son categorías narrativas; revisar cuáles tienen representación real en el inventario.

Ejemplos de encargo: recuperar un componente eléctrico para una bomba de Los Libertadores, traer una radio de una estación abandonada o entregar equipo reparado en República. El técnico explica qué equipo está detenido y qué pieza falta, para que el pedido tenga una causa visible.

**Límite:** reparar sistemas eléctricos no equivale a producir combustible ni comida. Comunicaciones facilita información y contactos; no revela automáticamente estaciones desconocidas ni crea viaje rápido. El taller tampoco debe absorber sin revisión la función del Armero existente.

## Plaza de Armas — cultivos medicinales, propuesta pendiente

**Base acordada.** Comunidad intermedia en el corredor L3 hacia Los Libertadores. El usuario planteó que cultive bajo tierra y produzca medicinas ancestrales; todavía no confirmó su identidad definitiva. Su combinación real con L5 no está resuelta como ruta jugable.

**Función propuesta.** Mantiene cultivos de pequeña escala destinados a insumos medicinales y conserva conocimientos de su comunidad. Complementa al puesto de República y se diferencia de la producción alimentaria masiva de Los Libertadores. Cualquier efecto de tratamiento pertenece al diseño ficticio del juego; no incorporar recetas médicas reales.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Cámaras de cultivo | Conservación y producción limitada de plantas e insumos | Cultivos medicinales |
| Reserva de semillas y preparación | Recepción de materiales y preparación de entregas | Puede compartir responsable |
| Punto de relevo, opcional | Apoyo al corredor norte de Los Mensajeros | Solo si se aprueba la función logística |

**Aporta, si se aprueba:** insumos medicinales y conocimientos de cultivo. **Necesita:** semillas, sustratos, agua, iluminación, recipientes y mantenimiento. Compartir necesidades agrícolas con Los Libertadores permite cooperación sin duplicar su producto principal.

Ejemplo de encargo: recuperar material para conservar una variedad de cultivo y transportar la siguiente producción a República. No fijar aún especies, recetas o curaciones.

**Límite:** no convertir esta posibilidad en canon definitivo ni condicionar toda la sanidad de la red a su aprobación. También debe decidirse si ofrece descanso, si es un destino de contratos o solo una parada intermedia y qué relación tiene con las facciones.

## Los Libertadores — alimentos e hidroponía

**Base acordada.** Refugio de L3 con los huertos hidropónicos y la producción de alimentos más grandes de la ciudad. Usa automatización y riego sustraídos a comunidades de la Gobernanza Unida de superficie. Depende de combustible orgánico, energía y mantenimiento. Se llega por Universidad de Chile, Plaza de Armas y el corredor norte.

**Función propuesta.** Produce excedentes que permiten sobrevivir a otras comunidades. Sus encargos nacen de sostener ciclos de cultivo, almacenamiento y reparto. La dificultad debe provenir de la logística y exposición del recorrido, no de exigir combates en cada entrega.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Huertos y reserva de alimentos | Producción, acopio y entrega de provisiones | Producción de alimentos |
| Sala de energía y riego | Continuidad de bombas, alimentación y automatización | Energía y riego |
| Zona de cargas | Preparación de entregas hacia otras comunidades | Puede compartir responsable con producción |

**Aporta:** alimentos y provisiones para viajes. **Necesita:** combustible orgánico adecuado, piezas de riego, mantenimiento técnico, agua e insumos de cultivo. La obtención de agua y el tipo de combustible siguen pendientes; no decidir silenciosamente que cualquier residuo sirve ni establecer una planta específica de generación.

Ejemplo de cadena: recuperar una pieza, solicitar su reparación en Los Leones y entregarla al responsable de riego. La entrega cierra ese contrato; distribuir alimentos después es una oportunidad nueva. Otro encargo puede consistir en recuperar una carga que no llegó a destino.

**Límite:** producir a gran escala no implica alimentos ilimitados ni una recompensa que anule la economía. Una avería puede reducir un servicio o crear pedidos, pero no destruir automáticamente la red porque el jugador decidió explorar otra zona. Los eventos temporales y sus consecuencias necesitan reglas visibles y tolerancia al tiempo fuera del juego.

## Vicuña Mackenna — fortificación y abastecimiento militar

**Base acordada.** Refugio L4/L4A, el más seguro y resguardado en su interior. Abastece de armas y municiones recuperadas en misiones de contacto con la seguridad de El Valle. El Frente se asocia a este refugio en el diseño. Tiene el acceso sur por La Cisterna/L4A y el acceso por Los Leones, superficie vigilada, Tobalaba/L4.

**Función propuesta.** Reúne capacidad defensiva y prepara operaciones que protegen a la red. La seguridad del destino contrasta con el riesgo de llegar. No debe interpretarse como una base que controla todos los túneles ni que garantiza escolta permanente.

| Espacio propuesto | Función | Encargado por definir |
|---|---|---|
| Armería y depósito | Revisión, distribución y suministro de equipo militar | Armería y municiones; revisar continuidad del Armero |
| Puesto de operaciones | Contratos de defensa, recuperación y protección de recorridos | Operaciones, vinculado a El Frente |
| Área de recepción segura | Entregas y preparación de grupos que llegan del exterior | Puede integrarse al puesto de operaciones |

**Aporta:** armas, municiones y capacidad de defensa organizada. **Necesita:** alimentos, suministros médicos, piezas de mantenimiento e información fiable sobre amenazas y movimientos. Su abastecimiento proviene de recuperación; fabricar munición industrialmente no está acordado.

Ejemplos de encargo: recuperar un depósito identificado, entregar suministros a un grupo defensivo o sostener una posición mientras se completa una reparación. Una misión de combate debe tener objetivo y condición de éxito explícitos; proteger un trabajo puede completarse sin eliminar a todos los enemigos si las futuras reglas lo permiten.

**Límite:** no igualar confianza con acceso inmediato a todo el arsenal. Los requisitos de servicios avanzados pueden depender de hitos y relaciones, pero aún no se fijan niveles de reputación. No convertir la elección de facción en exclusión de servicios esenciales sin discutir sus consecuencias.

## Relaciones que generan encargos

| Origen | Destinatario | Aporte propuesto | Necesidad que resuelve |
|---|---|---|---|
| Los Libertadores | Los Héroes y otras comunidades | Alimentos y provisiones | Preparar expediciones y sostener población |
| Los Leones | Los Libertadores | Componentes y equipos reparados | Mantener energía y riego |
| Los Leones | República | Equipo técnico acondicionado | Sostener atención y conservación de insumos |
| Plaza de Armas, si se confirma | República | Insumos de cultivo medicinal | Reponer parte de los materiales del puesto |
| República | Grupos y puestos de la red | Suministros médicos | Atender consecuencias de las salidas |
| Vicuña Mackenna | Grupos defensivos de otros refugios | Equipo y munición | Proteger población y operaciones |
| Los Héroes | Talleres y otros puestos | Recursos recuperados e informes | Resolver faltantes y preparar nuevas salidas |

La tabla expresa dependencias narrativas, no envíos automáticos implementados. Los Mensajeros pueden transportar estas cargas sin apropiarse de lo producido. Un refugio puede ser cliente, origen o destino de sus encargos sin pertenecer entero a la facción.

Cada entrega debe nombrar al responsable que solicita y al que recibe, aunque sus nombres propios se diseñen después. El juego debe comprobar el objeto y pagar una sola vez; la interfaz futura explicará el destino antes de aceptar. No es necesario simular una economía completa para dar sentido a estos intercambios.

## Servicios comunes y progresión

Proponer para los cuatro refugios principales un lugar de llegada, consulta de servicios, entrega de contratos y alguna forma de preparación o descanso. Los puestos de apoyo ofrecen un alcance más reducido. La seguridad interior es una condición narrativa del lugar; no implica recuperación instantánea, almacenamiento compartido o teletransporte.

Los puestos de Los Mensajeros se distinguen de un refugio completo: pueden servir para relevar cargas, obtener información y descansar de forma limitada si esas funciones se aprueban. Un escondite temporal se crea con recursos y después de abandonar el peligro; no equivale a llegar a una comunidad. Ninguna de estas instalaciones está implementada.

La progresión propuesta empieza con Los Héroes y República para enseñar preparación y entrega; amplía posibilidades técnicas con Los Leones; y aumenta las exigencias logísticas y tácticas hacia Los Libertadores y Vicuña Mackenna. Es una curva de complejidad, no un orden de desbloqueo obligatorio. La ruta norte puede ser accesible antes o después del taller según se diseñen requisitos y peligros. La distancia dibujada en el SVG no mide duración, dificultad ni costo.

Antes de viajar, el jugador debería entender destino, ruta, requisitos conocidos y preparación necesaria. La recompensa de una entrega debe ayudar a continuar o volver, sin prometer que cada contrato financiará cualquier recorrido. Hace falta definir una recuperación razonable para no dejar al jugador atrapado por agotar suministros; todavía no se decide si será asistencia, trabajo local u otra solución.

## Preparación de los NPC

Una función no equivale obligatoriamente a un personaje nuevo. El primer diseño puede agrupar depósito y entregas bajo un mismo responsable; después se separan únicamente si aporta decisiones, diálogo o identidad. Los puestos de Encomiendas pueden tener contactos en varios destinos sin crear una facción diferente en cada estación.

La siguiente ficha debería completarse para cada encargado: refugio y espacio, función permanente, necesidad que administra, qué recibe, qué entrega, tipos de encargos, límites de conocimiento y servicio, vínculo con facciones, relación con personajes existentes y una motivación personal. Dejar nombre y apariencia pendientes hasta acordar el papel.

Empezar por Abastecimiento, Expediciones y Encomiendas en Los Héroes, más Atención médica en República. Revisar Mara, el Armero, Elías, Sara y Noa en el código vigente; no trasladarlos, duplicarlos ni alterar sus historias por inferencia. Después desarrollar los especialistas de Los Leones y las funciones restantes.

## Criterio para pasar a implementación

El diseño estará listo para programar una primera sección cuando cada servicio tenga una acción concreta, recursos existentes o nuevos aprobados, un responsable definido y condiciones de uso comprensibles. También deben resolverse llegada y salida, entrega y pago, persistencia, recuperación y relación con la campaña actual.

Mantener la estética y los componentes del juego y la geometría aprobada del mapa. El presente documento no añade rutas transitables, NPC, recetas, cambios de inventario, pantallas ni acceso público al laboratorio. La implementación y las pruebas jugables serán una etapa posterior.
