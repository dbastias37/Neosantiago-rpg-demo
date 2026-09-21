# Neo Santiago 2130 — versión 0.2

**Cierre:** 21 de septiembre de 2026  
**Estado:** jugable en `main`  
**Guardados:** compatibles con la versión de producción anterior

V0.2 cierra el bloque narrativo y de sistemas iniciado para dar propósito a los recorridos, conectar decisiones con consecuencias y presentar Expedición y Los Mensajeros como partes del mismo juego. El laboratorio de compuertas permanece separado y no forma parte de esta versión jugable.

## Qué cambia

- La expedición presenta al grupo, su motivo para salir y las preocupaciones distintas de Sara, Elías y Noa antes de la ruta.
- Las conversaciones nocturnas, el Nodo 14, Lira, Irene, Vera y los desenlaces recuerdan decisiones concretas sin inventar hechos no observados.
- Los Mensajeros descubren contactos y rutas de forma gradual, se trasladan físicamente al origen de los encargos y conservan heridas, equipo y posición.
- Los ocho encargos tienen propósitos por tramo, recepción humana, pagos únicos y memoria local. Beatriz, Guzmán y Jiménez admiten visitas posteriores condicionadas por la entrega. Adasme y Darío conservan su conversación de regreso.
- Los registros comunitarios distinguen lo observado, lo informado y lo que sigue pendiente. Teresa e Inés son personas distintas dentro de la red.
- La moneda se llama Créditos. El máximo de pagos baja de 296 a 134 Créditos y los préstamos de provisiones bajan de 131 a 24 unidades. Los encargos cortos usan las mochilas del equipo; las tres rutas largas reciben un equipo mínimo.
- El informe de Morales puede llegar a la expedición sin transferir dinero, inventario ni tiempo entre equipos.
- El mapa, los expedientes, los refugios, el equipo, el comercio, el combate, el saqueo, la bitácora y las pantallas generales comparten la paleta oscura, tipografía y acabado metálico aprobados.
- Varela usa el retrato definitivo del abuelo del archivo en todas sus apariciones.

## Compatibilidad

La identificación visible de V0.2 no cambia el esquema del guardado. La campaña conserva su versión interna y Los Mensajeros mantienen `content_version: 2026-09-18.production.2` para aceptar partidas existentes.

Los contratos iniciados antes de cada revisión conservan ruta, escena pendiente, pago, provisiones recibidas, punto de control y versión narrativa. Las nuevas partidas y los contratos aceptados después de la actualización usan el contenido de V0.2.

## Verificación de cierre

La suite completa aprueba **385 pruebas**. Cubre guardado, migración, ocho encargos, progresión, continuidad, pagos, provisiones, combate, saqueo, equipo, refugio, teclado, foco y flujos narrativos principales. También verifica que V0.2 sea visible en las dos entradas de producción y que el laboratorio de compuertas no se importe en ellas.

Las pruebas automatizadas no demuestran retención ni balance subjetivo. Sigue siendo necesaria una partida humana completa para observar comprensión, ritmo, compras, descansos, heridas y acumulación al elegir rutas distintas. Esa evaluación puede producir ajustes posteriores sin reabrir el alcance de esta entrega.

## Fuera de V0.2

- Integrar las compuertas del laboratorio a los túneles.
- Limitar existencias de la tienda o simular una economía comunitaria completa.
- Crear vida autónoma indefinida para todos los contactos.
- Sustituir todos los fondos reutilizados por arte específico de cada estación.
- Rehacer la inferencia textual restante de efectos psicológicos en todo el motor.

El siguiente trabajo acordado es visual. Debe partir de la interfaz ya aprobada y revisar una sección por vez, sin volver a implementar los bloques narrativos cerrados.
