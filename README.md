# Neo Santiago 2130

RPG narrativo web con una expedición coral y la red de encargos de Los Mensajeros.

**Versión vigente: V0.2.** La actualización narrativa y de sistemas está cerrada; la siguiente etapa acordada vuelve al trabajo visual. El alcance, las pruebas y los límites están en las [notas de versión](docs/version-0.2.md).

## Continuar el desarrollo

Leer primero [INFORME-CONTINUIDAD-V0.2.md](INFORME-CONTINUIDAD-V0.2.md). Reúne lo implementado, el estado de la actualización hacia V0.2, los pendientes, la arquitectura, los criterios narrativos, la compatibilidad de partidas y el contexto necesario para continuar en otro chat.

El historial de entregas está en [NARRATIVA-ETAPAS.md](NARRATIVA-ETAPAS.md). Sus propuestas antiguas deben contrastarse con el informe de continuidad y el código vigente.

La [bibliografía narrativa](docs/BIBLIOGRAFIA-NARRATIVA.md) reúne las fuentes utilizadas, nuevas referencias sobre narrativa coral y decisiones, y galerías visuales para continuar la investigación.

## Juego

[Abrir Neo Santiago 2130](https://neosantiago-rpg-demo.onrender.com/neosantiago-demo.html). La actividad de encargos se integra desde el menú del juego; su implementación está en `extensions/mensajeros/`.

El libro de referencia de la adaptación está en [Neo Santiago 2130](https://neo2130.onrender.com/).

## Laboratorio de compuertas

[Probar los tres paneles y sus quince acertijos](https://neosantiago-rpg-demo.onrender.com/labs/compuertas/). Incluye dos teclados numéricos y un gabinete de continuidad, con relatos, pistas, intentos y resultados de apertura. Es un laboratorio independiente de las partidas del juego. El [documento de diseño y continuidad](docs/laboratorio-compuertas-0.2.md) registra sus reglas, soluciones y límites.

## Verificación

Instalar las dependencias de desarrollo con `npm install` y ejecutar `npm test`. La comprobación de cierre de V0.2 aprobó 385 pruebas. Los límites de esas comprobaciones, incluida la evaluación humana pendiente, están detallados en el informe.
