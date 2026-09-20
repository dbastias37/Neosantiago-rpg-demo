# Interfaz del mapa como panel de navegación

Fecha: 20 de septiembre de 2026. Continuación de V0.2 solicitada después del laboratorio de compuertas.

## Resultado

El mapa de Los Mensajeros se aloja en una carcasa de metal verde con tornillos, placa de identificación, bisel y pantalla oscura. Las rutas y estaciones se dibujan dentro del cristal. Los controles de zoom, centrado y recorrido quedan en la superficie del equipo, con botones en relieve. La escala muestra el porcentaje real y deshabilita sus extremos. La pantalla muestra la posición, el destino del recorrido seleccionado y el número de puntos conocidos.

Los módulos de encargo, grupo y suministros, y registro de viaje comparten los verdes, el papel envejecido y el latón del panel. Los retratos mantienen `object-fit: contain`. La presentación se adapta a las distribuciones existentes de escritorio, tableta y teléfono; el espacio de decisiones conserva desplazamiento propio cuando su contenido supera la altura disponible.

El acabado se genera con HTML, CSS y el mapa SVG existente: no necesita fondos nuevos ni descarga imágenes del laboratorio. El cristal decorativo no intercepta pulsaciones. Los controles y las estaciones conservan sus nombres accesibles y navegación por teclado.

## Alcance y aislamiento

`extensions/mensajeros/map-console.css` contiene la nueva presentación y se carga únicamente en `play.html`. El código de la actividad solo añade las lecturas del panel y el estado de los botones de escala. Se actualizan las versiones de carga del módulo y del acceso desde el juego principal.

No cambian los recorridos, encuentros, recompensas, precios, contratos ni formatos de guardado. Las ventanas compartidas de combate, ficha y refugio mantienen sus estilos existentes.

`labs/compuertas/` permanece como laboratorio independiente de quince acertijos. No hay importaciones, entradas de menú ni llamadas al laboratorio desde la campaña. La integración de compuertas para evitar enfrentamientos sigue pendiente de otra decisión de diseño.

## Comprobación

`node --check extensions/mensajeros/play.mjs` y `npm test` completados: 359 pruebas aprobadas. La suite incluye el arranque de la interfaz real de Mensajeros, viajes, retornos, encuentros pendientes, selección de trabajos, ampliación de la red y conservación de contratos antiguos.

La revisión visual se realiza desde el mapa publicado y la página existente `tests/layout-preview.html`, que permite comprobar ventanas de escritorio y teléfono sin reiniciar la partida. Los puntos de revisión son la altura útil del mapa, los controles de escala y recorrido, el acceso a los encargos, la lectura de suministros y la presentación completa de los retratos.

## Continuación

Recoger observaciones de uso del panel durante partidas. Mantener el laboratorio aparte hasta definir qué familias de acertijos se incorporarán, en qué rutas y con qué consecuencias al fallar. Guzmán y Jiménez siguen siendo el próximo bloque narrativo pendiente.
