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
