# Interfaz del mapa como panel de navegación

Fecha: 20 de septiembre de 2026. Continuación de V0.2 solicitada después del laboratorio de compuertas.

## Resultado

El mapa de Los Mensajeros se aloja en una carcasa de acero oscuro con tornillos, placa de identificación, bisel y pantalla casi negra. Las rutas y estaciones se dibujan dentro del cristal. Los controles de zoom, centrado y recorrido quedan en la superficie del equipo, con botones en relieve. La escala muestra el porcentaje real y deshabilita sus extremos. La pantalla muestra la posición, el destino del recorrido seleccionado y el número de puntos conocidos.

Los módulos de encargo, grupo y suministros, y registro de viaje comparten el negro de matiz verde, el marfil y los acentos cian y ámbar del modal de encargos. Los retratos mantienen `object-fit: contain`. La presentación se adapta a las distribuciones existentes de escritorio, tableta y teléfono; el espacio de decisiones conserva desplazamiento propio cuando su contenido supera la altura disponible. En escritorios de hasta 730 píxeles de altura, el registro se consulta desde su botón del pie y la cabecera se compacta para dejar más altura útil al mapa.

El acabado combina HTML, CSS, el mapa SVG existente y una textura WebP propia de metal oxidado. No descarga imágenes del laboratorio. El cristal decorativo no intercepta pulsaciones. Los controles y las estaciones conservan sus nombres accesibles y navegación por teclado.

## Revisión de color y tipografía

El usuario aprobó la estructura, pero pidió reemplazar los tonos oliva y beige por colores de metal oscuro. Después de revisar la prueba de acero frío, eligió la paleta de la captura del encargo «El turno que no alcanza». Esta selección sustituye la paleta gris azulada anterior. Se midieron los colores de la captura y se contrastaron con `ui.css`: los valores coinciden con los del modal existente. Se conserva la estructura física del panel.

| Uso | Color |
| --- | --- |
| Fondo del modal y base del panel | Negro con matiz verde: `#090e0c` |
| Compartimentos interiores | `#0d1513` |
| Bordes y separadores | Ámbar `#d9a15c`, con la transparencia de `--line` |
| Cristal y sombras | `#070a09` |
| Señales, enfoque y resistencia | Cian de la campaña: `#75d3d7` |
| Ruta seleccionada y acción principal | Ámbar claro: `#f2bd73` |
| Texto principal y títulos | Marfil: `#e7e2d8` |
| Narrativa y metadatos | `#c0c4bd` / `#9b9b92` |

Las acciones principales usan relleno ámbar claro y texto negro, como «Retomar encargo actual» en la captura. Las secundarias usan fondo oscuro, borde y texto ámbar. Los títulos de los encargos vuelven al marfil y los rótulos al cian.

Los textos, rótulos y botones usan `Arial Narrow`, `Roboto Condensed`, `Arial`, sans-serif, igual que el juego principal. Se elimina Courier New. La familia monoespaciada del reloj de la campaña se reserva para la escala, el contador de red y el identificador del terminal. No se añaden descargas de fuentes.

La revisión conserva los tamaños, bordes, posiciones y reglas adaptables del panel existente. El alcance es la pantalla de Mensajeros; aplicar este acabado a la web completa queda pendiente de revisión del usuario. El laboratorio conserva su presentación independiente.

## Textura de metal oxidado

A petición del usuario, la carcasa central incorpora `extensions/mensajeros/assets/textures/metal-oxidado.webp`: pintura negra verdosa descascarada, picaduras y óxido marrón con depósitos cobrizos discretos. Se generó con la herramienta integrada de imágenes y se convirtió a WebP (1254 × 1254, aproximadamente 334 KiB), sin alterar su composición. El recurso se descarga una vez y se reutiliza como fondo estático.

La capa decorativa está detrás del contenido, no recibe pulsaciones y usa máscaras CSS para concentrar el desgaste en los bordes y las uniones. Los tornillos llevan un halo de corrosión. La pantalla, los textos narrativos, los botones y los retratos mantienen sus superficies legibles. Se conserva la paleta aprobada, la geometría adaptable y el aislamiento del laboratorio. Si la imagen no carga, permanece el metal oscuro anterior como fondo.

Prompt de generación (herramienta integrada, no CLI): «Flat straight-on seamless square material texture for the physical metal frame of NeoSantiago 2130. Dark nearly black green-painted industrial steel (#090e0c, #111a15), eroded black paint, fine pitting, layered flaky dark brown oxidation and scattered muted copper rust deposits, fine worn scratches exposing charcoal iron. Approximately 30 percent rust coverage. Even diffuse lighting, no vignette. No text, markings, magenta lines, seams, frame, screws, buttons, screen, symbols or watermark.»

## Alcance y aislamiento

`extensions/mensajeros/map-console.css` contiene la nueva presentación y se carga únicamente en `play.html`. El código de la actividad solo añade las lecturas del panel y el estado de los botones de escala. Se actualizan las versiones de carga del módulo y del acceso desde el juego principal.

No cambian los recorridos, encuentros, recompensas, precios, contratos ni formatos de guardado. Las ventanas compartidas de combate, ficha y refugio mantienen sus estilos existentes.

`labs/compuertas/` permanece como laboratorio independiente de quince acertijos. No hay importaciones, entradas de menú ni llamadas al laboratorio desde la campaña. La integración de compuertas para evitar enfrentamientos sigue pendiente de otra decisión de diseño.

## Comprobación

`node --check extensions/mensajeros/play.mjs` y `npm test` completados: 359 pruebas aprobadas. La suite incluye el arranque de la interfaz real de Mensajeros, viajes, retornos, encuentros pendientes, selección de trabajos, ampliación de la red y conservación de contratos antiguos.

Se revisó el mapa publicado en escritorio y en las ventanas de 390 × 844 y 360 × 640 mediante la página existente `tests/layout-preview.html`, sin reiniciar ni avanzar la partida. El zoom mostró 125 % y cambió el área del mapa; centrado, itinerario, ficha de encargo y carga abrieron sus vistas correctas. Los retratos conservan su imagen completa. La revisión en 1024 × 600 detectó que el registro inferior restaba demasiada altura al mapa, y motivó el ajuste de cabecera y registro descrito arriba.

## Continuación

Recoger observaciones de uso del panel durante partidas. Mantener el laboratorio aparte hasta definir qué familias de acertijos se incorporarán, en qué rutas y con qué consecuencias al fallar. Guzmán y Jiménez siguen siendo el próximo bloque narrativo pendiente.
