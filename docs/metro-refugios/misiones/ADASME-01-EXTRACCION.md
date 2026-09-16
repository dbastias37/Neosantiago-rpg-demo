# Adasme 01 — Extracción en Los Leones–Tobalaba

Fecha: 16 de septiembre de 2026.
Estado: **borrador narrativo archivado; sin implementar ni activar**.
Identificador documental propuesto: `adasme-extraccion-01`.
Título de trabajo: **Fuera de contacto** (propuesta, pendiente de aprobación).

## Alcance y continuidad

El usuario pidió guardar esta primera misión para desarrollar después su integración, finalización y demás reglas. Este documento conserva su premisa y distingue las propuestas de los hechos solicitados. No es una especificación lista para programar.

Referencias revisadas: [contexto de NPC](../NPCS-CONTEXTO.md), [catálogo](../npcs.json), [integración de NPC](../NPCS-INTEGRACION.md) y [continuidad del mapa](../../../CONTINUIDAD-METRO-REFUGIOS.md). Adasme es la encargada de extracciones de Vicuña Mackenna (`adasme`, refugio `vicuna`). Su personalidad y manera de hablar siguen pendientes; los diálogos de este archivo no cierran esa definición.

El corredor exterior Los Leones–Tobalaba forma parte del acceso oriente ya documentado a Vicuña Mackenna. La ubicación exacta de la escotilla y del refugio provisorio requiere desarrollo. No modificar el trazado del mapa ni abrir rutas por inferencia.

## Premisa indicada por el usuario

Un grupo de operativos regresaba hacia Vicuña Mackenna después de recuperar municiones y mecanismos de defensa electrónica. Al entrar por la escotilla para volver al refugio, se dieron cuenta de que faltaba uno de sus integrantes. La separación ocurrió entre Los Leones y Tobalaba, en el sector exterior de la escotilla.

El compañero quedó incomunicado. No se sabe en qué condiciones se encuentra. El resto del grupo está ahora en otra misión y no puede ir a buscarlo. Adasme encarga la extracción a Los Mensajeros por su capacidad de desplazarse con rapidez.

El aliado se encuentra en un refugio provisorio conocido por los aliados. Esto es un hecho de diseño: queda pendiente establecer cómo conoce Adasme ese destino y cuánta certeza comunica a Los Mensajeros al partir, sin contradecir la incomunicación ni inventar una transmisión confirmada.

La misión consiste en llegar al exterior de la escotilla, evitar enfrentamientos, encontrar al compañero y acompañarlo de vuelta. Si está herido y no puede desplazarse, será necesario cargarlo. Su nombre, lesión y condición concreta no están definidos.

## Suministros y equipo solicitados

| Elemento | Definición del usuario | Pendiente |
|---|---|---|
| Raciones de comida | Llevar para asistir al compañero | Cantidad y procedencia |
| Agua | Llevar para asistir al compañero | Cantidad y procedencia |
| Munición de 5.56 mm | Llevar por si es necesaria | Cantidad, entrega y relación con el inventario |
| Bombas de humo | Adasme entrega exactamente 3 | Efecto jugable, consumo y remanentes |
| Inhibidor de señal | Adasme entrega 1; batería de 20 minutos | Reloj, activación, pausas, alcance y agotamiento |

Los 20 minutos son la autonomía de la batería; el usuario no estableció un límite total de 20 minutos para rescatar al compañero. No convertirlos en un plazo de muerte, fracaso o cuenta regresiva real por inferencia. Humo e inhibidor se documentan como objetos ficticios del juego, sin resolver aún sus reglas.

## Objetivo y criterio de desempeño confirmados

El objetivo central es recuperar a la persona. Se debe pelear lo menos posible. Completar la extracción sin enfrentamientos, o evitándolos, otorga una recompensa mayor.

Si hay enfrentamientos, la recompensa es menor: la actividad alerta sobre los operativos, aumenta su búsqueda y provoca más vigilantes en túneles y exterior durante futuros viajes, elevando el nivel de amenaza. El efecto debe trascender esta misión; sus valores, alcance geográfico, duración y reglas de persistencia están pendientes.

Adasme debe reaccionar mediante diálogos diferentes según la forma en que se complete la misión. No se fijan moneda, experiencia, porcentajes ni cantidades de recompensa.

## Recorrido narrativo para desarrollar

Esta secuencia ordena la premisa; no fija nodos, encuentros ni condiciones automáticas de cierre.

1. Recibir el encargo de Adasme y conocer la prioridad de evitar enfrentamientos.
2. Preparar las provisiones y recibir las tres bombas de humo y el inhibidor.
3. Llegar al sector exterior de la escotilla entre Los Leones y Tobalaba.
4. Buscar al compañero en el refugio provisorio conocido.
5. Comprobar su estado y asistirlo con los suministros que necesite.
6. Emprender el regreso acompañándolo o cargándolo, según su condición.
7. Resolver la entrega, el informe a Adasme y la evaluación cuando se diseñe el cierre.

El número de encuentros y decisiones está pendiente. La estructura futura debe permitir completar la misión con cero combates para que el resultado mejor recompensado sea alcanzable.

## Resultados a distinguir

| Situación | Base solicitada | Pendiente de diseño |
|---|---|---|
| Rescate completado sin combates o con encuentros evitados | Recompensa mayor; valoración favorable de Adasme | Pago y criterio exacto de extracción completada |
| Rescate completado con enfrentamientos | Recompensa menor; mayor amenaza y vigilancia futura | Grados, duración y alcance de las consecuencias |
| Compañero herido que necesita ser cargado | Debe poder regresar mediante transporte asistido | Restricciones y decisiones; no hay penalización económica solicitada por cargarlo |
| Encuentro evitado antes de combatir | Debe favorecer el objetivo de sigilo | Costo y condiciones de evasión |
| Huida después de iniciar una pelea | No resuelto | Si cuenta como enfrentamiento y cómo afecta la evaluación |
| Retirada sin el compañero, derrota o misión inconclusa | No resuelto | Reintento, continuidad, estado del aliado y diálogo |

“Skippear” necesita una definición jugable: evitar un encuentro y huir después de combatir no son necesariamente el mismo resultado. No adoptar silenciosamente una interpretación.

Tampoco se decidió qué sucede si hay detección sin combate, si el inhibidor evita una alerta o si se agota la batería. Esas reglas deberán compatibilizarse con la consecuencia solicitada para los enfrentamientos.

## Diálogos de Adasme — propuestas para revisar

Los siguientes textos son borradores nuevos. Se propone una voz directa, contenida y preocupada por el compañero y por la seguridad de quienes seguirán usando la ruta. No sustituye su personalidad pendiente en el catálogo.

### Presentación del encargo

«Nos falta uno. Venían de recuperar municiones y equipo de defensa electrónica. Cuando entraron por la escotilla para volver a Vicuña Mackenna, se dieron cuenta de que no estaba con ellos. Fue entre Los Leones y Tobalaba. No tenemos contacto.»

«Su grupo está en otra misión. Necesito que vayan ustedes. Hay un refugio provisorio en ese sector que los nuestros conocen. Empiecen por ahí. Lleven comida, agua y munición de cinco cincuenta y seis, por si la necesita.»

### Entrega del equipo y prioridad

«Les dejo tres bombas de humo y un inhibidor. La batería dura veinte minutos. Lo importante es traerlo de vuelta. Si puede caminar, acompáñenlo. Si no puede, habrá que cargarlo.»

«Eviten las peleas. Si los alertamos, después van a buscar a los nuestros en los túneles y afuera. La recompensa será mayor si logran volver sin enfrentamientos.»

### Rescate completado sin enfrentamientos

«Volvieron con él y no hubo enfrentamientos. Eso era lo que necesitábamos. Hicieron bien el trabajo. Les corresponde la recompensa completa.»

### Rescate completado con enfrentamientos

«Me alegra que lo hayan traído. Pero esos enfrentamientos van a tener consecuencias. Ahora van a buscar más a los nuestros y habrá más vigilancia en la ruta. La recompensa será menor, como les advertí.»

### Variante adicional si fue necesario cargarlo

«Me dijeron que tuvieron que cargarlo. Gracias por no dejarlo ahí. Vamos a recibirlo.»

Esta última línea es complementaria: no debe reemplazar la valoración del sigilo. Su activación y posición en el diálogo quedan pendientes. No se escriben finales de muerte, abandono ni fracaso como hechos aprobados.

## Decisiones abiertas para la siguiente sesión

Antes de integrar, definir la identidad del rescatado; por qué y cómo se separó; la cronología que explica la nueva misión de su grupo; cómo se orienta la búsqueda sin contacto; y si su estado es fijo o depende de las decisiones.

Resolver el punto inicial del jugador, el acceso exacto a la escotilla, el recorrido de vuelta y dónde se considera entregado el compañero. Vicuña Mackenna es el destino narrativo de regreso; todavía no se decide si la entrega ocurre allí, en un punto intermedio o mediante otro mecanismo. Encontrarlo no debe confundirse con haber definido ya el cierre.

Diseñar las decisiones y alternativas a combatir, el funcionamiento ficticio del humo y del inhibidor, los costos de acompañar o cargar, y la relación entre provisiones de misión e inventario. Resolver el reloj de batería y lo que ocurre al agotarse.

Definir evaluación, recompensa, amenaza persistente, detección sin combate, evasión, huida, derrota, retirada y reintentos. La futura integración también requerirá guardado, prevención de cobro duplicado y conexión al modal de misiones y al mapa.

## Instrucción para continuar

Conservar esta misión como documentación hasta que el usuario pida su implementación. No añadirla a `mission_ids`, no cambiar `enabled` ni `runtime_enabled`, no insertar diálogos en la campaña, no crear encuentros, temporizadores, inventario, recompensas ni activaciones de mapa a partir de este borrador.
