# Expedición · prueba A/B

Laboratorio visual solicitado antes de integrar el bloque de Expedición y decisiones narrativas. No se importa desde el juego ni aparece en Actividades.

- `index.html?variante=a`: Bitácora. Relato y decisiones en una hoja de campo; ubicación, objetivo, equipo y suministros al costado.
- `index.html?variante=b`: Escena. Imagen panorámica junto al relato; tres decisiones en una franja inferior y estado del equipo debajo.

Las dos propuestas usan los mismos datos y funciones de contenido. Cambiar A/B conserva situación y decisión seleccionada. Hay tres muestras: La señal imposible, El guardián reconstruido y Tres identidades autorizadas. «Vista móvil» limita la superficie a 390 px y las reglas de contenedor reorganizan el diseño. En teléfonos responde al ancho disponible.

Seleccionar una decisión abre un diálogo nativo con sus condiciones y el detalle escrito. Las pruebas muestran sus resultados posibles en desplegables, sin hacer tiradas. Las opciones de combate muestran el contexto del encuentro, sin iniciarlo. Escape, cierre y regreso restauran el foco al botón seleccionado.

`data.json` es una instantánea de `d61f755`, extraída con `eventDisplay` y `decisionCostText` desde `tests/runtime-harness.cjs`, y recursos obtenidos con `stockCount`. El equipo y las reservas son la muestra inicial en las tres escenas; las probabilidades corresponden a ese grupo. No se deben interpretar las muestras como escenas consecutivas o estado de una partida. Una futura integración seguirá usando el motor y sus condiciones dinámicas.

El navegador solo descarga esta muestra y las imágenes existentes. No importa el motor ni accede al almacenamiento local o a partidas, créditos e inventario. Cambiar el diseño actualiza únicamente su parámetro en la URL. La tipografía, el metal oscuro, el marfil, el cian y el ámbar siguen la paleta aprobada. El relato tiene fondo sólido.

Revisión manual: comparar la misma escena en A y B, abrir una decisión directa y una de prueba, desplegar ambos resultados, cerrar con Escape y repetir en Vista móvil. Verificar textos y botones completos. La elección e integración quedan pendientes de la revisión del usuario.
