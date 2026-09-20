# Laboratorio de compuertas — Neo Santiago 2130

Fecha: 20 de septiembre de 2026.

## Alcance

Laboratorio jugable independiente en `labs/compuertas/index.html`. Se accede por URL directa; no se integra todavía al menú, a los encuentros ni al mapa del juego. La petición es evaluar tres mecanismos a partir de las primeras maquetas: dos paneles numéricos y un gabinete de continuidad. Las compuertas podrían permitir usar galerías del antiguo personal del metro para evitar encuentros, pero esa consecuencia todavía no se aplica a la campaña.

Los quince relatos son escenas originales de exploración para el prototipo, no episodios confirmados del libro ni nuevos acontecimientos compartidos con los guardados existentes. La prosa usa personas, registros, desacuerdos y reparaciones concretas, sin claves poéticas. El fondo procede del juego y las miniaturas, de las tres maquetas aprobadas para explorar. Los teclados, bornes, cables, medidor y puertas animadas son elementos HTML/CSS/SVG funcionales.

## Flujo

Seleccionar panel y caso → aparece el equipo con una breve orientación → Examinar panel → consultar tres documentos y probar → resultado rechazado con intentos restantes o resultado de apertura. Hay cuatro intentos de comprobación por caso. Una entrada numérica incompleta no descuenta; leer, pedir pistas, medir, colocar o quitar puentes tampoco. Cada fallo abre una pantalla; el cuarto bloquea la sesión del caso y permite reiniciarla. El acierto muestra la compuerta abriéndose y un desenlace específico del lugar.

Tres pistas progresivas por caso. La explicación completa solo aparece después del acierto o del agotamiento de los intentos, en un desplegable. Se puede pasar a otro caso sin resolver el anterior. El laboratorio recuerda intentos, códigos introducidos, pistas, puentes y resultados con la clave exclusiva `neo2130:lab:compuertas:v1`. Nunca lee ni escribe las partidas del juego. El registro temporal del instrumento se limpia al recargar. Si el navegador impide guardar, el laboratorio sigue funcionando durante la sesión y lo indica.

## Casos numéricos

| Panel | Caso | Deducción | Solución de desarrollo |
| --- | --- | --- | --- |
| Clave de relevo | El relevo de Elena | Entrega real frente a la nómina prevista | 4126 |
| Clave de relevo | El agua que se puede llevar | Disponible después de entradas, pérdidas y reserva | 1412 |
| Clave de relevo | Dieciocho minutos | Hora efectiva corregida por adelanto del reloj | 2128 |
| Clave de relevo | Dos camas juntas | Ubicación posterior al traslado, con ceros iniciales | 0708 |
| Clave de relevo | No cerramos por lista | Personas únicas y último regreso confirmado | 0916 |
| Archivo de turno | La orden que nadie cerró | Reparación recibida frente a una prueba posterior fallida | 184207 |
| Archivo de turno | Dos piezas, una devolución | Identidad física de piezas aceptadas, sin confiar en cajas | 482076 |
| Archivo de turno | La puerta quedó a su nombre | Custodia efectiva y gancho de origen, no casillero | 275309 |
| Archivo de turno | Lo que Beatriz decidió guardar | Lote aprobado y bandeja actual después de un traslado | 307024 |
| Archivo de turno | El último traslado | Hora efectiva y personas distintas, no cruces | 234007 |

El primer panel usa cuatro cifras y botones redondos; el segundo, seis cifras y botones cuadrados. Admiten clic, tacto y teclado físico. Enter valida, Retroceso borra una cifra y Suprimir vacía el campo. Las claves mantienen ceros a la izquierda.

## Continuidad

El teclado numérico selecciona dos bornes del 1 al 6; también pueden tocarse directamente. MEDIR lee el recorrido, INSTALAR PUENTE conecta los puntos seleccionados y PROBAR CIERRE evalúa la reparación. Los puentes se retiran tocando su etiqueta. No hay colores que indiquen la respuesta, secuencias de flechas, caminos que girar ni límites de tiempo de lectura.

| Caso | Problema | Reparación posible |
| --- | --- | --- |
| La luz no abre la puerta | Corte de mando; lámpara independiente | 2–3 |
| Pita, pero no alcanza | Contacto con resistencia excesiva | 2–3 |
| El cable del mismo color | Colores reutilizados y lazo de campana | 2–5 |
| Dos cortes, una protección | Tres bloques que deben seguir en serie | 2–3 + 4–5, o 2–4 + 3–5 |
| Abrir sin apagar el aire | Dos alimentaciones que deben quedar separadas | 4–6 + 3–5 |

El instrumento resuelve una red resistiva de seis nodos: las mediciones incluyen los puentes y su efecto en paralelo. `OL` significa circuito abierto. Para aceptar una reparación se comprueba continuidad bajo el umbral, separación de circuitos y conservación de los componentes protegidos. La comprobación de protección retira virtualmente el componente y verifica que no exista un desvío que lo evite. El modelo es una abstracción jugable de diagnóstico; no una simulación de motores, fusibles o tensiones de un metro real.

## Presentación y controles

Fondo de estación, gabinetes con acabado de metal, luces, teclas con relieve, medidor y cables SVG. Resultados mediante diálogo modal, foco dirigido al título, cierre con Escape, movimiento reducido y sonido opcional apagado inicialmente. En pantallas angostas se alterna Panel / Relato y evidencias. El botón Vista móvil permite comprobar esa distribución desde un escritorio, mediante consultas de contenedor.

## Archivos y verificación

`puzzles.mjs` contiene los relatos y circuitos; `core.mjs` contiene estados, comprobaciones y restauración; `app.mjs` presenta la interfaz; `styles.css` define los equipos y las transiciones. No hay dependencias nuevas ni backend.

`tests/compuertas-lab.test.cjs` cubre las quince soluciones, los ceros, entradas incompletas, cuatro fallos, restauración de intentos, mediciones en paralelo, rutas equivalentes, aislamiento y protecciones. La suite completa aprobó 359 pruebas al incorporar el laboratorio. Las pruebas automáticas no determinan si la dificultad, la extensión de los textos o la repetición resultan satisfactorias: esa evaluación corresponde a las partidas del laboratorio.

Revisión realizada en el navegador del sitio publicado: apertura correcta en los tres paneles; rechazo de código con descuento de intento; teclado físico con Enter; clave de seis cifras con cero; documentos y pistas en la vista móvil; lectura OL antes de reparar y 0,8 Ω después de instalar el puente; cuatro fallos consecutivos y bloqueo conservado al recargar. Se inspeccionaron el gabinete numérico, el archivo, los cables y la pantalla de apertura. La vista móvil se comprobó con el contenedor angosto del laboratorio, no en un teléfono físico. Las capturas y las mediciones de la interfaz no mostraron desbordamiento horizontal del panel. El sonido opcional requiere valoración humana de volumen y carácter.

## Pendiente después de probar

Recoger observaciones sobre legibilidad, dificultad y ritmo. Decidir si se mantienen los cuatro intentos y las tres pistas. Solo después seleccionar compuertas para rutas concretas, recordar accesos abiertos por partida y definir las consecuencias de un fallo dentro del juego. El laboratorio no consume recursos, no abre rutas reales ni modifica la economía.
