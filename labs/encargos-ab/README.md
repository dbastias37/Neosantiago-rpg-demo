# Encargos · bocetos A/B

Prototipos funcionales de la sección de encargos para revisar antes del bloque 2. Se desarrollan directamente con HTML, CSS y JavaScript; no son imágenes de interfaces hipotéticas.

Abrir `index.html?variante=a` para el registro de operaciones o `index.html?variante=b` para el expediente. El selector superior cambia de propuesta y conserva el encargo seleccionado. El botón «Vista móvil» limita la superficie a 390 px; en teléfonos se adapta al ancho disponible.

A conserva bandas compactas con retrato, solicitante, nombre, recorrido y pago. Al seleccionarlas se abre una ficha modal. B mantiene un índice de tres encargos junto al expediente, con lectura directa y retrato más grande. En móvil el índice pasa sobre la ficha. Ambos usan idénticos textos, datos, objetos y recorridos. A conserva los filtros. B muestra todos los encargos directamente, sin los botones Todos/Centro/Norte, según la revisión del usuario del 21 de septiembre. Las fichas, condiciones, rutas y confirmación de selección funcionan. Escape cierra los diálogos nativos.

Los tres encargos son una muestra de Morales, Romero y Beatriz extraída de `prepare(production.json)` al crear el boceto. Se muestran juntos para comparar presentaciones, sin representar el desbloqueo de una partida real. `data.json` es una instantánea de demostración, no una nueva fuente para la campaña. El itinerario muestra la ruta base del encargo, sin simular los planes dinámicos de preparación.

Se reutilizan la textura WebP del mapa y los retratos y objetos del repositorio. Se mantienen la paleta negro verdosa, marfil, cian y ámbar y la misma tipografía. Los retratos usan `object-fit: contain`.

No hay importaciones del motor en el navegador, acceso a localStorage, escrituras al guardado, llamadas de combate, viajes ni pagos. «Elegir este encargo» abre una confirmación que explica el carácter de prueba. No hay acceso desde el menú del juego. El laboratorio de compuertas permanece independiente.

Para revisar: comparar el mismo encargo en A y B, probar los filtros en A, abrir su recorrido, volver a la ficha y repetir con Vista móvil. El usuario eligió B (Expediente). Su integración al bloque 2 queda pendiente; esta revisión solo simplifica el prototipo.
