# Renovación narrativa por etapas

Base revisada: main 2aa39997d09bf44c6ca0a998d0b50aaad6252472.
Esta rama contiene solamente la etapa 1. No cambia todavía el selector de finales.

## Etapa 1 — Base y piloto de Lira

Implementado: identificadores de escenas/acciones, registro de recorrido guardado, condiciones all/any/none explícitas, revocación de alianzas incompatibles y PNG horizontal descargable desde «Mapa de decisiones». Las definiciones jugables generan el mapa; no existe un segundo árbol dibujado a mano. El mapa cubre únicamente la ruta piloto, oculta nombres desconocidos y no inventa recorridos de partidas antiguas.

El rescate se bifurca por la preparación en la clínica: medicina permite una recuperación estable y lectura; soporte portátil conserva la vida pero consume la energía del lector; acceso forzado provoca combate y deja el lector quemado. Cada variante tiene texto propio. Copiar contra una negativa explícita preserva al hermano pero rompe la confianza. Extraer mata y cierra la ayuda. Una derrota o retirada interrumpe la oportunidad de rescate y deja el destino del hermano desconocido; no vuelve a ofrecer la misma situación. Los dilemas del piloto esperan una elección, sin temporizador. Cada cierre muestra una consecuencia narrativa antes de continuar.

Las consecuencias anteriores siguen en las partidas guardadas; no se reconstruyen elecciones cuyo detalle nunca se guardó. El guardado durante encuentros conserva el checkpoint existente: recargar un encuentro inconcluso vuelve a su inicio, sin conservar sus recompensas. El mapa registra la partida actual, no una colección de todas las partidas.

Validación: regresiones del repositorio más pruebas de rutas, guardado, irreversibilidad, doble pulsación, información oculta, derrota y contrato de descarga PNG. No se realizó una partida completa ni una prueba visual en navegador.

## Etapa 2 — Memoria y conexiones de las siete rutas

Extender el modelo a Rosa, Matías, S-7, H-12, Vega y Ortega. Definir quién sabe cada hecho, relaciones reparables y pérdidas irreversibles. Diseñar conexiones que respeten el orden temporal (Matías y S-7 ocurren después del primer encuentro con Lira: su ayuda requeriría un reencuentro posterior, no puede modificar retrospectivamente su rescate). Reescribir encuentros y transiciones según lo ocurrido. Ampliar el mapa por capítulos y causas conocidas de caminos cerrados. Afinar la negociación de los exiliados: en el piloto la traición la bloquea; pruebas externas y reparaciones específicas se diseñarán aquí.

## Etapa 3 — Desenlace y cierre automático

Preparar transmisión, evacuación o entrega mediante acciones previas. Convertir la torre en clímax con objetivos distintos y consecuencias de victoria/fracaso. La escena final surgirá de lo que quede físicamente posible. Retirar selector de final y clasificación moral/amenaza como árbitro principal. Ordenar la conversación de Irene antes de actuar sobre su soporte. Cada resolución debe poder explicarse por causas anteriores observables.

## Etapa 4 — Revisión literaria y recorrido completo

Revisar voz de cada personaje, redundancias, claridad del mundo, cronología, epílogos contradictorios y ritmo. Probar recorridos representativos completos y lectura con amigos: qué persiguen, qué sacrificaron y por qué llegaron a ese cierre. Actualizar la reconstrucción literaria entregada al usuario. Puntuar con la misma rúbrica: 4,6/10 fue la evaluación editorial original, 9–9,5 es una aspiración, no una nota concedida por implementar el mapa.
