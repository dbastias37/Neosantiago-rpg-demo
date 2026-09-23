# Neo Santiago 2130

RPG narrativo web con una expedición coral y la red de encargos de Los Mensajeros.

**Versión vigente: V0.2.** La actualización narrativa y de sistemas está cerrada; la siguiente etapa acordada vuelve al trabajo visual. El alcance, las pruebas y los límites están en las [notas de versión](docs/version-0.2.md).

**V0.3 en desarrollo:** la rama `feature/v0.3-vertical-slice` consolida arquitectura, guardados, resultados, audio y verificación sin reemplazar la versión publicada. El [informe V0.3](INFORME-V0.3-VERTICAL-SLICE.md) registra el alcance implementado y las condiciones que todavía faltan para cerrar el vertical slice.

## Continuar el desarrollo

Leer primero [INFORME-CONTINUIDAD-V0.2.md](INFORME-CONTINUIDAD-V0.2.md). Reúne lo implementado, el estado de la actualización hacia V0.2, los pendientes, la arquitectura, los criterios narrativos, la compatibilidad de partidas y el contexto necesario para continuar en otro chat.

El historial de entregas está en [NARRATIVA-ETAPAS.md](NARRATIVA-ETAPAS.md). Sus propuestas antiguas deben contrastarse con el informe de continuidad y el código vigente.

La [bibliografía narrativa](docs/BIBLIOGRAFIA-NARRATIVA.md) reúne las fuentes utilizadas, nuevas referencias sobre narrativa coral y decisiones, y galerías visuales para continuar la investigación.

## Juego

[Abrir Neo Santiago 2130](https://neosantiago-rpg-demo.onrender.com/neosantiago-demo.html). La actividad de encargos se integra desde el menú del juego; su implementación está en `extensions/mensajeros/`.

El libro de referencia de la adaptación está en [Neo Santiago 2130](https://neo2130.onrender.com/).

## Laboratorio de compuertas

[Probar los tres paneles y sus quince acertijos](https://neosantiago-rpg-demo.onrender.com/labs/compuertas/). Incluye dos teclados numéricos y un gabinete de continuidad, con relatos, pistas, intentos y resultados de apertura. El laboratorio mantiene un guardado independiente; sus diez casos numéricos también aparecen ahora en los desvíos de Encargos, mientras el gabinete de continuidad sigue reservado al laboratorio. El [documento de diseño y continuidad](docs/laboratorio-compuertas-0.2.md) registra sus reglas, soluciones y límites.

## Verificación

Instalar las dependencias de desarrollo con `npm install` y ejecutar `npm test`. La comprobación vigente de V0.2 y la integración posterior de compuertas aprobó 390 pruebas. Los límites de esas comprobaciones, incluida la evaluación humana pendiente, están detallados en el informe.

En la rama V0.3: `npm ci`, `npm test` y `npm run validate`. Para la segunda capa, `npx playwright install --with-deps chromium` y `npm run test:e2e`. La [guía QA](docs/v0.3/qa.md) explica la matriz de siete pantallas, los fixtures y sus límites; la [baseline de rendimiento](docs/v0.3/performance.md) permite repetir las mediciones.
