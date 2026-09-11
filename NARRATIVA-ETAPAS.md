# Renovación narrativa por etapas

Base revisada: main 2aa39997d09bf44c6ca0a998d0b50aaad6252472.
Etapas 1 y 2 implementadas. No cambia todavía el selector de finales: corresponde a la etapa 3.

## Etapa 1 — Base y piloto de Lira

Implementado: identificadores de escenas/acciones, registro de recorrido guardado, condiciones all/any/none explícitas, revocación de alianzas incompatibles y PNG horizontal descargable desde «Mapa de decisiones». Las definiciones jugables generan el mapa; no existe un segundo árbol dibujado a mano. El mapa cubre únicamente la ruta piloto, oculta nombres desconocidos y no inventa recorridos de partidas antiguas.

El rescate se bifurca por la preparación en la clínica: medicina permite una recuperación estable y lectura; soporte portátil conserva la vida pero consume la energía del lector; acceso forzado provoca combate y deja el lector quemado. Cada variante tiene texto propio. Copiar contra una negativa explícita preserva al hermano pero rompe la confianza. Extraer mata y cierra la ayuda. Una derrota o retirada interrumpe la oportunidad de rescate y deja el destino del hermano desconocido; no vuelve a ofrecer la misma situación. Los dilemas del piloto esperan una elección, sin temporizador. Cada cierre muestra una consecuencia narrativa antes de continuar.

Las consecuencias anteriores siguen en las partidas guardadas; no se reconstruyen elecciones cuyo detalle nunca se guardó. El guardado durante encuentros conserva el checkpoint existente: recargar un encuentro inconcluso vuelve a su inicio, sin conservar sus recompensas. El mapa registra la partida actual, no una colección de todas las partidas.

Validación: regresiones del repositorio más pruebas de rutas, guardado, irreversibilidad, doble pulsación, información oculta, derrota y contrato de descarga PNG. No se realizó una partida completa ni una prueba visual en navegador.

## Etapa 2 — Memoria y conexiones de las siete rutas (implementada)

Los siete desvíos tienen identificadores, recorrido persistente, decisiones sin temporizador y texto de consecuencia para cada cierre. S-7 tiene una escena distinta cuando solo se rescatan los nombres: no recupera por arte de magia su memoria ni los accesos a Nodo 14. El borrado selectivo de H-12, la restitución de todos los nombres por Vega y la entrega de viviendas a los residentes requieren preparación previa; el texto advierte de esas condiciones antes de elegir.

Conexiones implementadas: código de Rosa → traslado cubierto de Matías; frecuencia de Matías → ocultar S-7; S-7 restaurado y aliado → mantenimiento de H-12; ubicaciones de H-12 + red civil de Rosa → advertencia a comunidades; registro de Línea 1 por Vega → revocación de su ocultamiento anterior; identidades restauradas por Vega → controles civiles en el distrito de Ortega. Los hechos conocidos por NPC se guardan tras los intercambios correspondientes. No se supone que Rosa conoce una venta secreta a Vera.

Lira distingue el rescate accidentado de copiar recuerdos sin consentimiento. En el primer caso atender su herida y reconocer el error permite recuperar su apoyo; en el segundo, curarla no restaura la confianza. S-7 apagado no conserva ayudas activas. El retraso de Matías desplaza todo el día 2 para evitar que el reloj retroceda.

El mapa permite seleccionar cualquiera de los siete capítulos y descargarlo como PNG horizontal. Conserva qué opciones estaban cerradas al visitar cada escena, explica sus causas en el panel y añade conexiones vividas a la imagen. No es todavía un mapa de la campaña principal ni una colección entre partidas. La retirada con avance narrativo está implementada en el piloto de Lira; los demás combates conservan la recuperación existente hasta diseñar sus consecuencias específicas.

Validación de etapas 1–2: 107 pruebas automáticas aprobadas, incluidas ocho pruebas nuevas de conexiones, preparación, guardado de caminos cerrados, memoria de Lira y cronología. Sin prueba completa en navegador ni evaluación con jugadores todavía. Los nuevos diálogos no reciben una puntuación final antes de esa evaluación.

## Etapa 3 — Desenlace y cierre automático

Preparar transmisión, evacuación o entrega mediante acciones previas. Convertir la torre en clímax con objetivos distintos y consecuencias de victoria/fracaso. La escena final surgirá de lo que quede físicamente posible. Retirar selector de final y clasificación moral/amenaza como árbitro principal. Ordenar la conversación de Irene antes de actuar sobre su soporte. Cada resolución debe poder explicarse por causas anteriores observables.

## Etapa 4 — Revisión literaria y recorrido completo

Revisar voz de cada personaje, redundancias, claridad del mundo, cronología, epílogos contradictorios y ritmo. Probar recorridos representativos completos y lectura con amigos: qué persiguen, qué sacrificaron y por qué llegaron a ese cierre. Actualizar la reconstrucción literaria entregada al usuario. Puntuar con la misma rúbrica: 4,6/10 fue la evaluación editorial original, 9–9,5 es una aspiración, no una nota concedida por implementar el mapa.
