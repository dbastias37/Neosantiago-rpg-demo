# Lectura de La Voz y decisiones de La Cisterna

Revisión solicitada después de jugar el capítulo 2: varias decisiones se sentían sin peso y los textos de la primera misión resultaban demasiado cortos.

## La Voz

`campaign-prose.js` añade contexto a las 27 escenas principales: el lugar, los indicios que observa el equipo, sus conversaciones y lo que necesita considerar antes de actuar. En la muestra de la ruta base, el texto principal pasa de unas 1.386 a 5.773 palabras. Esa medición no incluye elecciones, resultados, archivos, desvíos ni finales, y no equivale a una duración de partida.

La ampliación se aplica después de los adaptadores condicionales. Conserva el texto que recuerda lo ocurrido con Lira, S-7, las reservas médicas y otros vínculos, junto con todas las opciones, requisitos, costos, IDs y finales existentes. El mismo texto no se añade dos veces al renderizar. Las escenas guardadas conservan su lugar y los desenlaces ya guardados no se reescriben.

Los siete desvíos reciben un intercambio adicional en su primera escena. Irene tiene más espacio para hablar antes de las decisiones sobre el archivo y el soporte. Se utiliza la bitácora y las ventanas existentes, manteniendo el cambio de diálogos revertido fuera del proyecto.

## La Cisterna

La [guía del capítulo 2](capitulo-2-la-cisterna.md) detalla los costos y alternativas. La revisión añade dos pruebas técnicas con el sistema común, experiencia por trabajos concretos, intercambios de suministros y una elección entre descansar o participar en el recorrido técnico. Las conversaciones y los acuerdos mantienen consecuencias narrativas claras, sin convertirse en pagos artificiales por hablar.

La reparación, la documentación y el aprendizaje compiten con recursos o energía que se necesitan para regresar. Los costos anunciados se aplican a la acción elegida y sus recibos impiden cobrarlos o recompensarlos otra vez al continuar. Las partidas anteriores que ya resolvieron esas escenas conservan lo registrado.

## Comprobaciones

Las pruebas de estado cubren ambas salidas de las nuevas maniobras, requisitos, capacidad de mochila, daño no letal, experiencia, acciones de ingeniería, gastos únicos, semilla aleatoria conservada y reanudación. También verifican que ampliar la lectura conserve las condiciones y las decisiones de La Voz.

Las pruebas de navegador comprueban el desplazamiento hasta las decisiones de la bitácora, las ventanas reales de probabilidad, los cambios de inventario y la restauración tras trabajar. El recorrido completo de La Cisterna y la retirada siguen formando parte de la comprobación. Los fixtures de navegador establecen puntos concretos de partida; no simulan una partida humana completa desde el prólogo.
