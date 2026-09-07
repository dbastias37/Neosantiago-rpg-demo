# Laboratorio de expedición

Abrir `/expedicion-lab.html` desde el mismo servidor que el juego. Para reiniciar únicamente sus pruebas: `/expedicion-lab.html?reset=1`.

El laboratorio carga `neosantiago-demo.html` y sus scripts actuales. Antes de ejecutarlos sustituye exclusivamente la clave de guardado por `neosantiago2130_expedicion_lab_v1` e incorpora `expedicion-lab.css` y `expedicion-lab.js`. Si la declaración de guardado cambia, el cargador se detiene para evitar tocar partidas principales. No debe abrirse con `file://`.

La primera visita comienza en Estación Los Héroes, con el lote estándar de Mara y una carga de inhibición para probar la expedición directamente. No importa la partida principal. Las siguientes visitas restauran el progreso del laboratorio. Se conservan decisiones, consecuencias, combate, fabricación, inventario, rutas y finales del motor compartido.

La propuesta A reorganiza HUD, relato, decisiones, retratos y navegación. El botón Grupo se mueve junto a los retratos como Suministros y conserva el resumen del grupo, agregando los recursos existentes en la misma ventana. Los retratos abren las fichas actuales. Misiones, Archivo e Historial usan el panel existente presentado como modal centrado. No hay fondos, imágenes, botones de acción ni dependencias nuevas.

En móvil las decisiones se apilan y los tres retratos permanecen juntos debajo del relato. Los textos extensos pueden desplazar el escenario; no se recortan narraciones ni consecuencias para forzar una altura fija. El parecido con la referencia se reproduce en CSS; el fondo y la tipografía disponible pertenecen al juego/dispositivo.

Validación de estado e interacciones: `node --test tests/expedition-lab.test.cjs`. No sustituye una comprobación visual en navegador. Los archivos principales no se modifican para integrar el laboratorio; eliminar los tres archivos `expedicion-lab.*` lo retira.
