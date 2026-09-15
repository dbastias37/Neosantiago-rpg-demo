# NPC de encargos: preparación pendiente de retratos

Actualización: 15 de septiembre de 2026.

El usuario autorizó integrar los NPC aprobados y sus imágenes ligeras en main,
sin mostrarlos ni activar rutas o misiones. Esta entrega es parcial: los originales
del chat de creación y el elenco completo no se pudieron recuperar. No se han
añadido retratos sustitutos ni se afirma que las imágenes estén integradas.

`npcs.json` registra únicamente la ficha recuperada de Ana. No es el elenco
completo. Ana dirige Plaza de Armas y coordina encargos en esa comunidad de paso.
Su descripción aprobada actualiza la etapa anterior de diseño; no confirma por
sí sola todas las propuestas de cultivos medicinales del documento de funciones.
Los demás nombres, asignaciones y retratos deben recuperarse del material aprobado.

## Cómo completar la integración

Recibir los retratos originales aprobados con su correspondencia de nombres y
refugios. Revisar cada imagen y completar el elenco en `npcs.json`, usando los IDs
de estaciones de `modelo.json`. Mantener los originales fuera de los recursos
servidos por el juego.

Convertir cada original con Python y Pillow:

```sh
python scripts/optimize-npc-portrait.py /ruta/ana.png characters/encargos/ana.webp
```

La herramienta conserva proporciones y encuadre, aplica orientación EXIF, no
amplía imágenes y limita la salida a 768×1024 píxeles y 180 KiB. Prueba calidad
84, 80, 76 y 72; si no cumple el presupuesto, pide revisión en lugar de seguir
degradando automáticamente. No modifica el original ni sobrescribe destinos.
Estos límites son una decisión técnica inicial, no mediciones de retratos aún
ausentes. Revisar el rostro, cabello y detalles en la salida antes de aceptarla.

Para cada retrato verificado, completar `portrait` con `src`, `width`, `height`
y `bytes`, y cambiar `portrait_status` a `verified`. Conservar `enabled: false`,
`runtime_enabled: false` y `mission_ids: []` hasta la etapa jugable. Marcar el
elenco completo únicamente después de contrastarlo con todos los NPC aprobados.

## Carga y futura conexión

Este catálogo no está importado por el HTML, JavaScript o CSS de la campaña.
No se añade precarga, descarga, menú, diálogo, viaje ni cambio de partidas.
Archivar estos datos no añade solicitudes a la carga inicial del juego.

Cuando se apruebe la implementación jugable, cargar el catálogo al abrir el
sistema de refugios y solicitar cada retrato al abrir su contacto. Usar las
dimensiones registradas y `decoding="async"`; para contactos fuera de pantalla,
usar `loading="lazy"`. No incrustar imágenes en base64 ni precargar el elenco.
Los ficheros seguirán siendo accesibles por URL si el alojamiento sirve esas
carpetas: estar desactivados en la interfaz no es una restricción de acceso.
