# Consolidación UI inicial

La primera extracción preserva el orden de cascada y las URLs relativas: `theme-tokens.css` contiene la paleta original, `game-shell.css` las reglas de la entrada en el mismo orden y `night-surface.css` las reglas finales de noche. Los archivos se mantienen en la raíz para que los fondos no cambien de ruta. Los adaptadores de combate, perfiles y refugio de Encargos copian estos enlaces desde la entrada y mantienen su `base` en la raíz.

No se eliminaron `!important` por cantidad ni se reordenaron media queries. Muchas reglas antiguas compiten con superficies más recientes. La reducción de especificidad debe hacerse por componente y con capturas antes/después; extraer CSS no demuestra que se haya resuelto toda esa deuda.

La base de accesibilidad extiende el foco visible a enlaces, controles y objetos con rol de botón. Mantiene los controles de teclado y los indicadores actuales. `prefers-reduced-motion` ya estaba cubierto en la base y se refuerza para las transiciones de cinemática cargadas después. Se reserva un token de escala de texto; no se anuncia un control de tamaño que todavía no existe.

Pendientes: evaluar todos los controles táctiles de landscape corto, aplicar escala de texto sin recortes y consolidar el manejo de modales progresivamente. No se reemplaza globalmente el sistema de foco ni el apilamiento aprobado en este bloque.
