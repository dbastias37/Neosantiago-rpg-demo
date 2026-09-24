# Escenas estables y orientación de los enlaces — V0.3

Base: `main` tras la fusión del PR #8. Alcance: preparación de un catálogo con identificadores, migración conservadora de la ubicación guardada y orientación en las dos conexiones comunitarias. No se añaden situaciones, recompensas ni requisitos.

## Riesgo observado

La campaña guardaba `index` y varios adaptadores usaban las posiciones 9, 10, 12 y 18. Insertar una escena antes de ellas podría ofrecer una solicitud en otra jornada, perder una opción ya confirmada o devolver un guardado a un punto incorrecto. Otros sistemas, entre ellos el final, la progresión de misión, checkpoints y desvíos, todavía usan índices: **este bloque no autoriza reordenar el catálogo completo**.

## Contrato implementado

- Las 27 situaciones principales tienen un `id` estable en `campaign-v2.js`. El registro en `campaign-scenes.js` valida presencia y unicidad y conserva, en un orden fijo, la correspondencia de los guardados numéricos V0.2/V0.3 anteriores a esta extracción. No reutilizar IDs ni modificar ese orden legado.
- Cada escritura nueva de la campaña incluye `sceneId`, atributo opcional de localización. Clave `neosantiago2130_demo_v3`, esquema `version:3`, `campaignRevision:3` y estructura de estado en memoria se conservan. Se aplica a guardado normal, recepción Matías/Rosa y operaciones de recuperación. La lectura de un guardado antiguo no escribe datos; su primera escritura válida añade únicamente el identificador de la escena.
- La carga resuelve `sceneId` cuando existe; si falta, consulta el mapa legado y la conversión anterior de campañas pre-revisión. Un ID desconocido o una posición inválida rechazan la carga sin sustituir el estado activo ni borrar los bytes del guardado. Se conserva `index` dentro del motor mientras las demás rutas se migran progresivamente.
- Las condiciones de Matías y Rosa consultan IDs para ofrecer la solicitud, anticipar la casa segura y añadir la opción de República/avenida. La preparación del primer día ya no identifica sus escenas por el texto del título; los objetivos de la misión principal cambian de jornada según los mismos límites. Noa resuelve sus dos escenas de salida por ID.

## Orientación dentro del juego

El panel existente «Orientación de la jornada» informa del estado real del relevo al salir y al llegar al punto donde podría importar. Una reserva solicitada para Matías sigue en camino; la recepción sólo habilita la indicación tras revisarla, antes de República. Una solicitud de Rosa no equivale a tener familias acogidas; el acuerdo confirmado abre una opción que gasta agua y deja a la patrulla en la avenida. Los textos no convierten una entrega tardía en rescate retroactivo ni trasladan a Rosa e Iara fuera de la casa segura.

## Validación y límite

Los fixtures V0.2 de inicio y retirada vuelven a cargar intactos; la prueba de mapeo simula una inserción antes de escenas existentes y verifica la resolución del índice guardado, con y sin `sceneId`. Se prueban rechazo atómico de un ID desconocido, condiciones de Matías/Rosa, ruta ya elegida, entrega tardía y orientación visual dentro del DOM. La matriz de navegador comprueba la orientación de producción en pantallas móviles y de escritorio.

Antes de insertar o mover escenas hay que convertir también los demás acoplamientos numéricos, más las referencias internas de checkpoints y resultados, y probar todas las migraciones con un catálogo de prueba alterado. La aprobación de este bloque verifica el mapeo y los enlaces existentes; no afirma que la campaña entera admita hoy una reordenación arbitraria ni que se haya medido una sesión humana de 30–60 minutos.
