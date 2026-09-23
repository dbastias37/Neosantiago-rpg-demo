# Continuidad del primer día

## Alcance aprobado

Base: `main` en `d9f4a2295873fae4b4cf73e9abab22eda25f1127`, con los fundamentos V0.3 integrados por PR #5. Rama de trabajo: `feature/v0.3-day-one-continuity`.

Cerrar el recorrido existente: preparación → primera jornada → decisión sobre Matías → regreso contextual → conversación/descanso nocturno → preparación en Mara/Armero → salida explícita al día 2. Conservar las alternativas al rescate, los días posteriores y el flujo compartido con Encargos.

## Fronteras técnicas

`continuePendingAdvance()` adelanta el índice al día siguiente antes de preparar la noche. No insertar ni reordenar eventos. El recibo nocturno debe seguir bloqueando la siguiente decisión hasta quedar confirmado.

La noche y el refugio tienen recuperaciones independientes. La nueva parada normal de preparación no debe conceder otro descanso/reagrupamiento; las recuperaciones por retirada, agotamiento o moral baja mantienen sus reglas. Los precios, daños, recompensas y existencias por día no se modifican. El acceso regular al comercio del día 2 sí es un cambio de oportunidad económica y se debe revisar durante el recorrido.

No cambiar claves ni el esquema 3 de guardado. Conservar literalmente los contextos nocturnos guardados. Cualquier campo opcional nuevo se valida; los guardados antiguos sin ese campo siguen siendo válidos. No fabricar un regreso retroactivo para jornadas ya cerradas.

La orientación utiliza los sectores del contenido actual y el propósito de la escena presente. No revela escenas futuras, inventa conexiones entre estaciones ni sustituye el mapa narrativo de capítulos.

## Verificación prevista

Pruebas Node de recuperación única, preparación restaurada, existencias conservadas, recarga antes/después de la noche, noches V0.2 y retirada recuperable. Recorridos Playwright desde partida nueva con acciones de UI, salud/recursos iniciales y combate real; variantes con rescate y sin traslado. Regresión de Encargos en la matriz existente de siete tamaños.

Las capturas y los tiempos de automatización son evidencia de funcionamiento. No equivalen a una sesión humana de lectura ni demuestran la duración objetivo de 30–60 minutos. Registrar esa limitación al entregar.

## Registro

Análisis confirmado contra código real. Baseline local antes de modificar producción: **427/427 pruebas Node aprobadas**. Se actualizarán resultados, decisiones y límites al completar cada bloque.


### Transición y presentación implementadas

La primera noche normal ahora abre `openRefuge("preparation")`. Ese contexto bloquea descanso y reagrupamiento tanto en UI como en funciones; conserva inventario, precios y consumos nocturnos. Las condiciones de emergencia mantienen los motivos anteriores. Confirmar la salida utiliza el flujo de logística e inhibidor existente. Se registra una visita real al puesto, sin sumar otro descanso.

`expedition-continuity.js` contiene orientación y presentación del registro; no administra combate ni recursos. La orientación es plegable en la bitácora. El registro del regreso se lee en el modal de ayuda existente del refugio, con controles de teclado, foco restaurado y paleta aprobada. La orientación no muestra destinos futuros.

Migración aditiva: una noche nueva del día 1 captura `expeditionRest.nights[1].returnAccount` como texto de hechos observados. El campo es opcional, se valida al cargar y jamás se calcula retroactivamente para una noche antigua. `context` permanece intacto. La preparación reutiliza `refuge.reason/rested/rejoined`; una jornada cerrada con refugio inactivo no vuelve a abrirse por cargar.

Validación del bloque: **435/435 Node** (8 nuevos), sintaxis y referencias aprobadas; mismo inventario de audio (solo se regeneraron las líneas de referencia). Se adaptaron tres fixtures de conversaciones posteriores para salir explícitamente del refugio después de la noche. La prueba E2E previa de entrada/Encargos pasó en 390×844. Recorrido completo y matriz final aún en curso.


### Corrección visual verificada por capturas

El primer montaje desplegaba el relato dentro de la cuadrícula del refugio y reducía demasiado el área comercial. Se sustituyó por un botón dentro de Estado del grupo que abre `refugeHelpModal` con el tema `return`. Continuar y Escape solo cierran la lectura; nunca ejecutan el descanso del tema `rest`.

Las compras del recorrido E2E expusieron además un recorte real en 915×412: las filas fijas y el footer tapaban los botones del comercio. El CSS compartido conserva las cuatro filas del diseño, asigna posiciones explícitas para que el mensaje de compra no desplace el comercio y permite scroll exterior en pantallas anchas de hasta 550 px de alto. El ajuste llega también a Encargos por su loader existente. No añade `!important` ni cambia paleta, retratos o reglas económicas.

La prueba completa ahora compra una ración con créditos reales después de la noche, comprueba el descuento y las existencias, recarga, cambia de actividad y confirma la salida. También exige espacio visible en la lista antes y después del feedback de compra. Se corrigieron dos carreras del conductor E2E: esperar el fin del registro del cadáver y esperar la oferta de mejora ganada antes de intentar otra decisión. No se alteraron los temporizadores ni los resultados del juego para hacer pasar la prueba.
