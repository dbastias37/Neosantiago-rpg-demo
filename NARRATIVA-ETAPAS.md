# Renovación narrativa por etapas

Base revisada: main 2aa39997d09bf44c6ca0a998d0b50aaad6252472.
Etapas 1, 2 y 3 implementadas. En las partidas nuevas y las antiguas aún en curso, el cierre ocurre automáticamente. Los finales de partidas antiguas ya terminadas conservan su versión original.

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

## Etapa 3 — Desenlace y cierre automático (implementada)

El canal se prepara antes del asedio: enlace civil desde Nodo 14 con contactos, extracción reservada con Vera en el mercado o realineación del repetidor con una batería. Reservar a Vera cancela la difusión preparada; realinear posteriormente el relé cancela su extracción. Los textos explican esas incompatibilidades antes de actuar.

En la sala de antenas, defender la consola requiere resistir tres rondas completas o derrotar a los enemigos; preparar la evacuación requiere dos rondas o vencer. Sostener el objetivo no inventa enemigos muertos ni concede loot de unidades vivas. Las ayudas de Ortega y el cierre de pisos existentes siguen funcionando. Una derrota en la torre avanza con consecuencias y no devuelve al refugio para repetir el asedio. El repliegue permite recuperarse con un mínimo de HP: no representa la muerte definitiva del equipo.

Irene habla y confirma su petición antes de cualquier copia o desconexión. Puede salir con soporte portátil alimentado por una batería, morir tras confirmar su petición, quedar conectada mientras se copian las pruebas o quedar sin que el grupo copie nada. Las pruebas y las coordenadas privadas se separan antes de enviar. La retirada de la última cámara conserva lector y soporte solo si había una salida preparada; de lo contrario se pierden, sin inventar una copia al terminar. Los documentos que ya existían antes de Irene se conservan.

Cinco cierres se resuelven automáticamente: difusión completa, emisión parcial, extracción de Vera, regreso con archivo o testimonio sin las pruebas de la torre. Moral y amenaza no seleccionan el desenlace. El cierre queda guardado y la recarga no repite pagos. Los epílogos se escriben según ese hecho y preservan consecuencias de las rutas. Los cofres de suministros dejan de aparecer desde el asedio para no intercalar puzzles en la resolución; siguen existiendo veinte situaciones elegibles antes de ese punto. El loot ordinario de enemigos derrotados se conserva.

El mapa incorpora «El desenlace de la torre» y permite descargar su PNG directamente desde la escena final y el resumen. La exportación del resumen conserva la narración final completa. Las partidas anteriores aún abiertas migran hechos de copia/emisión ya realizados; las partidas anteriores terminadas mantienen su final.

Validación: 118 pruebas automáticas aprobadas. Cubren los cinco cierres, consentimiento y recursos de Irene, objetivos por rondas con el ciclo real de enemigos, derrotas, pérdidas, migración, recarga, pago único y acceso al mapa final. Falta la prueba completa en navegador y con jugadores de la etapa 4.

## Etapa 4 — Revisión literaria y recorrido completo

Revisar voz de cada personaje, redundancias, claridad del mundo, cronología, epílogos contradictorios y ritmo. Probar recorridos representativos completos y lectura con amigos: qué persiguen, qué sacrificaron y por qué llegaron a ese cierre. Actualizar la reconstrucción literaria entregada al usuario. Puntuar con la misma rúbrica: 4,6/10 fue la evaluación editorial original, 9–9,5 es una aspiración, no una nota concedida por implementar el mapa.
