> Actualización 18-sep-2026: el usuario autorizó activar la expansión. La implementación vigente y las reglas de continuidad están en [INTEGRACION-JUGABLE.md](docs/metro-refugios/INTEGRACION-JUGABLE.md). Los bloques de inactividad siguientes describen etapas históricas.

# Continuidad: mapa, refugios, facciones y encomiendas

Documento de traspaso para continuar este trabajo en otro chat. Fecha: 14 de septiembre de 2026. Repositorio: `dbastias37/Neosantiago-rpg-demo`. Base consultada: `434b1ca53eed534d3a16be17fededae6c45bec72`.

## Actualización del 17 de septiembre: estructura inactiva de misiones

El usuario autorizó preparar Guzmán y Adasme con rutas, puntos de control, instancias, objetos, imágenes y modales en main, sin conectarlos al juego vigente. Leer el [manual del laboratorio local](extensions/mensajeros/README.md), la [entrega de Guzmán](docs/metro-refugios/misiones/GUZMAN-01-ENTREGA.md) y la actualización del [rescate de Adasme](docs/metro-refugios/misiones/ADASME-01-EXTRACCION.md). Hay un motor y una interfaz de prueba, no una expansión activada: los flags originales, catálogos de NPC y archivos de campaña permanecen intactos. Balance, combate de prueba, autonomía narrativa y detalles nuevos son provisionales. No activar por inferencia.

## Primera misión de Adasme — borrador archivado el 16 de septiembre

Se conserva [Adasme 01: extracción en Los Leones–Tobalaba](docs/metro-refugios/misiones/ADASME-01-EXTRACCION.md), basada en la premisa aportada por el usuario. Incluye rescate de un operativo incomunicado, provisiones, tres bombas de humo, un inhibidor con batería de veinte minutos y recompensa mayor por evitar enfrentamientos. Combatir reduce la recompensa y debe aumentar la vigilancia futura, con reglas aún pendientes. Los diálogos son propuestas; integración, cierre y balance siguen por definir. Este registro actualiza las menciones históricas de encargos totalmente pendientes: existe ahora un primer borrador, sin misión jugable. No activar NPC ni modificar la campaña por leerlo.

## Punto de partida para otro chat

Actualización del 15 de septiembre: los siete retratos WebP y sus fichas completas ya están archivados, con nombres, funciones y refugios confirmados por el usuario. Leer primero [NPCS-CONTEXTO.md](docs/metro-refugios/NPCS-CONTEXTO.md), [npcs.json](docs/metro-refugios/npcs.json) y [NPCS-INTEGRACION.md](docs/metro-refugios/NPCS-INTEGRACION.md). Estas fichas prevalecen sobre las menciones históricas de NPC sin definir que siguen más abajo. Ana lidera la comunidad de paso de Plaza de Armas y gestiona encargos; no tiene especialidad medicinal. Los encargos, diálogos y rutas siguen pendientes; también la personalidad y manera de hablar de Adasme. El juego no carga estos NPC ni sus retratos.

Estamos diseñando una expansión de NeoSantiago 2130 con viajes entre refugios del metro, encargos y facciones. Existe un laboratorio visual independiente; todavía no existe esta expansión como sistema jugable conectado a la campaña. El usuario pidió conservar el trabajo en main sin activar el mapa y después desarrollar refugios, funciones y posibles NPC. Las funciones de cada refugio ya están desarrolladas como propuesta en [Refugios y funciones](docs/metro-refugios/REFUGIOS-Y-FUNCIONES.md). El siguiente paso es revisar esa propuesta y definir sus NPC y servicios antes de programar rutas o misiones.

Leer este documento, `docs/metro-refugios/modelo.json` y `docs/metro-refugios/laboratorio.source.json`. El último contiene las fuentes originales completas del prototipo, incluyendo HTML, CSS, JavaScript y un SVG de referencia. Son texto dentro de JSON: no hay un nuevo index ejecutable, enlace, importación ni activación desde el juego. Para recuperar una prueba, extraer las entradas de `sources` en un directorio local separado, conservando sus nombres y contenido. No extraerlas al directorio servido por el juego sin una futura decisión de integración.

Este archivo de fuentes es accesible a quien tenga acceso al repositorio. El archivado impide abrirlo como página jugable; no es una medida de confidencialidad ni una regla de denegación HTTP. El despliegue externo del laboratorio que se creó anteriormente se mantiene independiente; esta entrega no lo publica de nuevo ni cambia su acceso.

## Qué se decidió y qué falta

El usuario aprobó cuatro refugios principales, sus especialidades y los recorridos generales; eligió los nombres Los Mensajeros y El Frente. Aprobó la dirección visual y pidió conservar geometría, colores y estética con correcciones puntuales del mapa. También pidió unificar fuentes y botones con el juego.

Los nombres propios de nuevos NPC, sus diálogos, recompensas, recetas, economía, desbloqueos, eventos y condiciones de viaje todavía no están aprobados. Las ideas de este documento son propuestas cuando se indica. No convertirlas automáticamente en canon o contenido jugable. Tampoco reemplazar personajes o hechos de la campaña existente.

## Refugios y comunidades

| Lugar | Estado | Propósito y contexto |
|---|---|---|
| Los Héroes, L1/L2 | Refugio principal | Base inicial de cazadores y exploradores, que se reúnen para las expediciones y obtención de recursos. |
| República, L1 | Puesto de apoyo | Pequeño puesto de medicinas junto a Los Héroes. La línea se corta después de esta estación hacia el poniente. |
| Los Leones, L1/L6 | Refugio principal | Suministros eléctricos y talleres. Mantiene equipos e infraestructura de la red. |
| Plaza de Armas, L3/L5 | Comunidad provisional | Se propuso cultivo subterráneo y medicina ancestral. Su identidad definitiva sigue por decidir. |
| Los Libertadores, L3 | Refugio principal | Mayor producción de alimentos y huertos hidropónicos. Necesita combustible orgánico, electricidad, mantenimiento y riego automatizado con tecnología sustraída a comunidades de la Gobernanza Unida en superficie. |
| Vicuña Mackenna, L4/L4A | Refugio principal | El interior más seguro y fortificado; abastece de armas y municiones rescatadas en misiones de contacto con la seguridad de El Valle. Base propuesta y representada de El Frente. Sus accesos son peligrosos. |

Los refugios lejanos deben exigir mayor dominio del juego, preparación y dificultad. Los Libertadores se concibe como destino remoto de alta exigencia logística; no se ha calculado ni afirmado que sea el de mayor distancia real. La progresión debe justificar las recompensas y permitir continuar hacia otro refugio, sin obligar a volver siempre a Los Héroes.

## Rutas acordadas

| Destino desde Los Héroes | Recorrido de diseño |
|---|---|
| República | L1 hacia el poniente. |
| Los Leones | L2 hasta Franklin; combinación a L6 y túneles hasta Los Leones. |
| Plaza de Armas | L1 hasta Universidad de Chile; antiguo acceso de combinación a L3 y continuación al norte. |
| Los Libertadores | Mismo corredor de L3 pasando por Plaza de Armas y continuando al norte. |
| Vicuña Mackenna, acceso sur | L2 hasta La Cisterna; combinación a L4A y recorrido por trinchera abierta. |
| Vicuña Mackenna, acceso oriente | Franklin y Los Leones; salida a superficie cerca del ex Costanera, escotilla a Tobalaba y continuación por L4. |

El ex Costanera es, en este mundo ficticio, un centro de inteligencia y seguridad que abastece de ella a El Valle. El tramo exterior hacia Tobalaba debe reflejar vigilancia de alta peligrosidad. No se presupone que todo el trazado de L4 sea subterráneo.

La conexión L1 entre Baquedano y Los Leones está destruida: su línea punteada debe llegar visualmente a Los Leones, pero nunca ofrecerse como ruta transitable por ese solo hecho. Los Héroes puede alcanzar el sector de Baquedano antes del corte; sus eventos y nodos jugables no están desarrollados.

La referencia del usuario es la red real del metro de Santiago, adaptada al mundo de 2130. Se aportó `metrored_servicios_2023_07_19.pdf`; su nombre corresponde a 2023, no debe describirse como una verificación exhaustiva de la red de 2026. Referencia pública usada en el diseño: https://www.red.cl/mapas-y-horarios/metro/. La antigua mención «L2A» se corrigió a **L4A**. No fijar niveles físicos de andenes sin verificarlos.

Hay combinaciones reales alternativas que todavía necesitan una decisión narrativa: Cal y Canto L2/L3, Santa Ana L2/L5 hacia Plaza de Armas, Ñuñoa L3/L6, Plaza Egaña L3/L4 y otras posibilidades de L5. El laboratorio simplifica la red; no demuestra que estos accesos estén destruidos. Definir su estado antes de implementar búsqueda de caminos. También quedan pendientes las estaciones intermedias destruidas, sus salidas a superficie y posibles comunidades o merodeadores.

## Facciones

| Facción | Identidad | Estado |
|---|---|---|
| Cazadores y Exploradores | Trabajos complementarios: reconocimiento de rutas y amenazas, caza, recursos y expediciones compartidas desde Los Héroes. | Agrupación acordada; nombre colectivo adicional pendiente. |
| Los Mensajeros | Red de encargos y conexión entre comunidades; pequeños grupos preparados para sigilo y túneles. | Nombre elegido expresamente por el usuario. |
| El Frente | Combate, protección coordinada, defensa de refugios y recuperación de armas y corredores. | Nombre elegido expresamente por el usuario. |

Los Mensajeros toman inspiración de los chasquis en la organización de relevos y de los «topos» en su adaptación a túneles. Llevan provisiones, distintivos, armamento moderado y objetos de inventario para evitar o abandonar enfrentamientos. El usuario pidió señuelos, trampas de escape, fabricación propia y puestos de descanso. El código o credo de la facción se dejó para después. La frase «Mientras uno llegue, seguimos conectados» fue una propuesta, no un lema aprobado. Los nombres descartados, como Los Postas y Los Bastiones, no deben reaparecer como nombres vigentes.

Para El Frente se propusieron escoltas, defender reparaciones, cubrir evacuaciones y recuperar depósitos o patrullas. Las diferencias de equipo pesado, capacidad de carga y sigilo, así como conflictos entre facciones, requieren diseño; no hay estadísticas fijadas.

## Misiones de encomienda: propuesta de funcionamiento

El pedido nace de una necesidad concreta de un NPC: quién necesita qué, para qué, dónde se consigue, a quién se entrega y qué cambia al completarlo. La mayoría de encargos debe consistir en recolectar o recuperar recursos y llevarlos a su destinatario. Distinguir recoger un paquete ya preparado, reunir materiales y recuperar una carga perdida.

Una ficha futura de contrato debería identificar solicitante, destinatario, origen, destino, objeto y cantidad, condición de la carga, requisitos de acceso, recompensa y consecuencias. Peso, fragilidad, urgencia y restricciones solo se usan cuando tengan una mecánica comprensible. No hay valores aprobados. Evitar pérdida accidental de paquetes por venta, consumo o desarme: diseñar una confirmación explícita.

Los relevos autorizados de Los Mensajeros podrían pagar por un tramo o permitir completar la entrega entera por una recompensa mayor. Cada contrato terminado se liquida; una continuación es una oferta nueva, no una obligación. La recompensa de una entrega debe reconocer su éxito aunque no se mate a nadie. Se propusieron experiencia, reputación, suministros y acceso a servicios; aún no hay economía implementada.

Primero crear encargos escritos y plantillas controladas, después variaciones compatibles con la red y el estado del jugador. Se propusieron misiones principales, cadenas secundarias de dos a cuatro pasos, encargos repetibles y emergencias ocasionales. Una urgencia medida en pasos de expedición, en lugar de tiempo real mientras el usuario está ausente, es una opción pendiente.

Ejemplo de diseño, no misión aprobada: recuperar una pieza en Los Leones y llevarla al encargado de riego de Los Libertadores; reparar el suministro explica por qué el viaje importa y por qué el destinatario paga.

## Retirada, señuelos y descanso

La petición específica es retirarse **de la pelea sin volver automáticamente al refugio**. La propuesta sitúa al grupo en un nodo cercano de la expedición, conserva daño, carga y consumos, y mantiene el peligro que cerraba el paso. Retirarse no concede botín de enemigos vivos ni permite saltarse gratuitamente un bloqueo.

Se mencionaron señuelos sonoros, humo, interferencia, obstáculos de demora y kits de descanso como categorías abstractas de objetos del juego. Sus recetas, costos de acción, probabilidades y límites no se han diseñado. Deben permitir decisiones de escape y preparación, con respuestas de los enemigos, sin convertirse en un botón universal de invulnerabilidad.

Distinguir puestos de relevo atendidos de escondites temporales para descansar después de perder perseguidores. El descanso consumiría recursos y tendría límites; no se acordó curación completa gratuita. La futura retirada debe respetar las consecuencias ya implementadas en la campaña: leer `DECISIONES-NARRATIVAS.md` y `NARRATIVA-ETAPAS.md` antes de tocar combate o guardado.

## Mapa y laboratorio que sí existen

El prototipo usa HTML, CSS y SVG, con geometría dibujada explícitamente. Permite seleccionar seis refugios o puestos, ver descripciones y servicios, mostrar información al pasar el cursor, resaltar rutas, comparar los dos accesos a Vicuña Mackenna y recorrer sus puntos en una simulación. Tiene zoom, desplazamiento, gesto de pinza, botones, ventanas y ficha móvil con transiciones verticales. Incluye tratamiento de teclado y movimiento reducido.

El origen está fijado en Los Héroes y la selección inicial es Los Leones. Las estaciones intermedias están simplificadas. La simulación no consume recursos ni cambia una partida. No contiene sistema de misiones, viaje persistente, economía, encuentros, inventario conectado ni condiciones de desbloqueo. El código contiene una integración opcional de `document.modelContext` para seleccionar un refugio si el navegador la ofrece; no es una dependencia del juego.

La última corrección geométrica pedida fue extender el punteado Baquedano–Los Leones y alargar el tramo vertical Universidad de Chile–Plaza de Armas hacia el norte, dejando el quiebre diagonal a Los Libertadores más arriba. El dibujo del usuario se utilizó únicamente como referencia de esas correcciones. Mantener Los Libertadores al norponiente, L4A con tramo horizontal y diagonal nororiente, y el resto de posiciones y trazados aprobados.

La versión final del laboratorio unificó la tipografía con el juego: `"Arial Narrow", "Roboto Condensed", Arial, sans-serif`. No añadió una fuente descargada; la fuente efectiva depende de la disponibilidad local. Títulos pesados y en mayúsculas; botón principal ámbar con texto oscuro, secundarios transparentes con borde ámbar, cian para información y rutas, rojo para peligro. Paleta: fondo `#070a09`, ámbar `#d9a15c`, ámbar claro `#f2bd73`, cian `#75d3d7`, rojo `#df4a4a`, texto `#e7e2d8`, texto secundario `#9b9b92`.

El SVG de referencia conserva la maqueta estática y geometría anteriores a la última unificación tipográfica. **HTML y CSS archivados son la referencia visual más reciente**, no el SVG por sí solo. No regenerar el mapa con una imagen aproximada ni cambiar su estética al integrar las funciones.

El laboratorio independiente anterior está en https://neosantiago-mapa-laboratorio.diegobastiascl.chatgpt.site. No confundir su repositorio o configuración de hosting con el repositorio del juego. No copiar `.openai/hosting.json` a este proyecto.

## Funciones de NPC propuestas, sin nombres definitivos

El usuario propuso encargados reconocibles por oficio, tomando como referencia general la idea de especialistas que dan misiones en un asentamiento. La siguiente distribución es una propuesta para discutir, no once personajes nuevos aprobados.

| Lugar | Función propuesta | Motivo de los encargos |
|---|---|---|
| Los Héroes | Abastecimiento | Reponer provisiones y equipo básico para expediciones. |
| Los Héroes | Expediciones | Reconocer rutas, localizar recursos y recuperar grupos o registros. |
| Los Héroes | Encomiendas | Recibir contratos, despachar cargas y coordinar relevos de Los Mensajeros. |
| República | Atención médica | Obtener insumos para tratar pacientes y sostener el puesto. |
| Los Leones | Electricidad y talleres | Recuperar componentes y reparar equipos de los refugios. |
| Los Leones | Comunicaciones | Recuperar radios, mantener enlaces y revisar señales. |
| Plaza de Armas | Cultivos medicinales | Producir insumos y conservar cultivos; depende de confirmar la comunidad. |
| Los Libertadores | Producción de alimentos | Obtener semillas, nutrientes y suministros de producción. |
| Los Libertadores | Energía y riego | Mantener bombas, automatización y suministro energético. |
| Vicuña Mackenna | Armería y municiones | Recuperar, revisar y distribuir equipo y munición. |
| Vicuña Mackenna | Operaciones | Coordinar defensa, recuperación y escoltas de El Frente. |

Cada función podría reunir un servicio permanente, encargos habituales y una pequeña historia propia. República atiende pacientes; Plaza de Armas produciría insumos. Los Leones repara tecnología; Los Libertadores la opera para producir. Armería abastece; Operaciones coordina acciones. Esta separación evita repetir al mismo comerciante con otro retrato.

Antes de inventar personajes, revisar los NPC que ya existen y considerar reutilizar funciones compatibles, por ejemplo Mara o el Armero si la continuidad actual lo permite. No desplazar a Elías, Sara, Noa u otros personajes de la campaña sin revisar su papel. Los nombres y roles deben verificarse en el código vigente, no deducirse de esta propuesta.

## Ampliación de refugios documentada

Consultar [Refugios y funciones](docs/metro-refugios/REFUGIOS-Y-FUNCIONES.md): desarrolla tipos de comunidad, espacios propuestos, servicios, necesidades, aportes a la red, ejemplos de encargos y límites de cada lugar. Conserva Plaza de Armas como provisional y diferencia decisiones del usuario de ampliaciones propuestas. Es la referencia más reciente para continuar con funciones y NPC; no modifica el modelo geométrico ni activa el laboratorio.

## Próximo trabajo autorizado como dirección, todavía sin implementación

Continuar por refugios, funciones y posibles NPC. Para cada refugio definir sus espacios, necesidades, servicios, relación con facciones y dependencias de otros refugios. Después asignar cada función a un personaje existente o proponer uno nuevo, todavía sin nombres si así lo prefiere el usuario. Se sugirió comenzar por las tres funciones de Los Héroes y el puesto médico de República.

Solo después diseñar contratos concretos y sus consecuencias. Para volverlo jugable faltarán un grafo de rutas con estados y requisitos, origen actual y viajes entre destinos, costos y encuentros, persistencia compatible con partidas existentes, ciclo de misiones con entregas y pago único, inventario de carga, servicios y reputación. Estas son dependencias futuras, no características de la maqueta archivada.

## Verificación y límites de esta entrega

Esta entrega conserva fuentes de texto y documentación; no modifica los archivos de ejecución existentes. Se verifican estructura JSON, hashes de fuentes, sintaxis del JavaScript archivado y validez XML del SVG. Las verificaciones previas del laboratorio fueron estáticas; no se afirma haber completado QA visual en navegador, una partida completa ni pruebas de equilibrio. Las cifras de tests que figuran en documentos anteriores de campaña pertenecen a aquellas entregas, no a esta expansión.
